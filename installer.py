# -*- mode: python ; coding: utf-8 -*-
"""D20 角色构筑器 — 自包含安装器 / 卸载器（纯标准库，零第三方依赖）

打包：F:/Python314/python.exe -m PyInstaller installer.spec --noconfirm --clean
内嵌的程序目录 dist/D20 由 installer.spec 的 --add-data 提供（onedir 产物整体嵌入）。

行为：
  installer.exe            图形(windowed)模式安装，结束弹 MessageBox
  installer.exe --silent   静默安装（供自动化/验证使用）
  installer.exe --uninstall           卸载
  installer.exe --uninstall --silent  静默卸载

安装位置：%LOCALAPPDATA%\\Programs\\D20（用户级，免 UAC）
"""
import argparse
import ctypes
import time
from ctypes import (
    WINFUNCTYPE, POINTER, byref, c_void_p, c_wchar_p,
    c_ulong, c_ushort, c_ubyte, c_int,
)
from ctypes import wintypes
import os
import shutil
import subprocess
import sys
import tempfile
import winreg

APP_NAME = "D20 角色构筑器"
APP_VERSION = "2.0.0"
REG_KEY = r"Software\Microsoft\Windows\CurrentVersion\Uninstall\D20"


def bundled_d20() -> str:
    """打包后通过 sys._MEIPASS 找到内嵌的 D20 目录；开发期回退到仓库 dist/D20。"""
    if getattr(sys, "_MEIPASS", None):
        return os.path.join(sys._MEIPASS, "D20")
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist", "D20")


def install_location() -> str:
    local = os.environ.get("LOCALAPPDATA") or os.path.expandvars("%LOCALAPPDATA%")
    return os.path.join(local, "Programs", "D20")


def user_desktop() -> str:
    return os.path.join(os.path.expandvars("%USERPROFILE%"), "Desktop")


def start_menu_programs() -> str:
    return os.path.join(
        os.path.expandvars("%APPDATA%"),
        "Microsoft", "Windows", "Start Menu", "Programs",
    )


# ---- 纯 ctypes 创建 .lnk（不依赖 WScript.Shell，可在无桌面会话工作） ----
class _GUID(ctypes.Structure):
    _fields_ = [
        ("Data1", c_ulong), ("Data2", c_ushort), ("Data3", c_ushort),
        ("Data4", c_ubyte * 8),
    ]

    def __init__(self, s: str = ""):
        if s:
            p = s.split("-")
            d4 = bytes.fromhex(p[3]) + bytes.fromhex(p[4])
            super().__init__(int(p[0], 16), int(p[1], 16), int(p[2], 16),
                             (c_ubyte * 8).from_buffer_copy(d4))
        else:
            super().__init__()


_CLSID_ShellLink = _GUID("00021401-0000-0000-C000-000000000046")
_IID_IShellLinkW = _GUID("000214F9-0000-0000-C000-000000000046")
_IID_IPersistFile = _GUID("0000010B-0000-0000-C000-000000000046")

_ole32 = ctypes.windll.ole32
_ole32.CoInitialize.argtypes = [c_void_p]
_ole32.CoInitialize.restype = ctypes.c_long
_ole32.CoCreateInstance.argtypes = [
    POINTER(_GUID), c_void_p, c_ulong, POINTER(_GUID), POINTER(c_void_p)]
_ole32.CoCreateInstance.restype = ctypes.c_long
_ole32.CoUninitialize.argtypes = []
_ole32.CoUninitialize.restype = None


def make_shortcut(target: str, link_path: str, description: str = "", arguments: str = ""):
    """用 ctypes 直接调 IShellLink + IPersistFile 写 .lnk（无需 Explorer/第三方库）。

    相比 PowerShell 的 WScript.Shell，IShellLink+IPersistFile 只做文件写入，
    不要求交互式 Shell 会话，因此在无显示环境也能创建快捷方式。
    """
    _ole32.CoInitialize(None)
    try:
        psl = c_void_p()
        hr = _ole32.CoCreateInstance(
            byref(_CLSID_ShellLink), None, 1, byref(_IID_IShellLinkW), byref(psl))
        if hr != 0:
            raise ctypes.WinError(hr)
        vt = ctypes.cast(psl, POINTER(POINTER(c_void_p))).contents
        # IShellLinkW vtable 偏移: 5=SetPath 8=SetDescription 10=SetWorkingDirectory 12=SetArguments
        SetPath = WINFUNCTYPE(ctypes.c_long, c_void_p, c_wchar_p)(vt[5])
        SetDesc = WINFUNCTYPE(ctypes.c_long, c_void_p, c_wchar_p)(vt[8])
        SetWD = WINFUNCTYPE(ctypes.c_long, c_void_p, c_wchar_p)(vt[10])
        SetArgs = WINFUNCTYPE(ctypes.c_long, c_void_p, c_wchar_p)(vt[12])
        if SetPath(psl, target) != 0:
            raise ctypes.WinError()
        if description:
            SetDesc(psl, description)
        if arguments:
            SetArgs(psl, arguments)
        SetWD(psl, os.path.dirname(target))
        # QueryInterface IShellLink -> IPersistFile (vtable[0]=QueryInterface)
        ppf = c_void_p()
        QI = WINFUNCTYPE(ctypes.c_long, c_void_p, POINTER(_GUID), POINTER(c_void_p))(vt[0])
        if QI(psl, byref(_IID_IPersistFile), byref(ppf)) != 0:
            raise ctypes.WinError()
        pfv = ctypes.cast(ppf, POINTER(POINTER(c_void_p))).contents
        # IPersistFile vtable 偏移: 6=Save(LPCWSTR, BOOL)
        Save = WINFUNCTYPE(ctypes.c_long, c_void_p, c_wchar_p, c_int)(pfv[6])
        # 应对 Defender/Explorer 对桌面、开始菜单目录的瞬时共享锁（WinError 32）
        last_hr = -1
        for _ in range(8):
            last_hr = Save(ppf, link_path, 1)
            if last_hr == 0:
                break
            time.sleep(0.4)
        if last_hr != 0:
            raise ctypes.WinError(last_hr)
        WINFUNCTYPE(ctypes.c_long, c_void_p)(pfv[2])(ppf)  # Release IPersistFile
        WINFUNCTYPE(ctypes.c_long, c_void_p)(vt[2])(psl)    # Release IShellLink
    finally:
        _ole32.CoUninitialize()


def register_uninstall(dst: str, uninstaller: str):
    key = winreg.CreateKey(winreg.HKEY_CURRENT_USER, REG_KEY)
    try:
        winreg.SetValueEx(key, "DisplayName", 0, winreg.REG_SZ, APP_NAME)
        winreg.SetValueEx(key, "DisplayVersion", 0, winreg.REG_SZ, APP_VERSION)
        winreg.SetValueEx(key, "Publisher", 0, winreg.REG_SZ, "siwpan")
        winreg.SetValueEx(key, "InstallLocation", 0, winreg.REG_SZ, dst)
        winreg.SetValueEx(key, "UninstallString", 0, winreg.REG_SZ, f'"{uninstaller}" --uninstall')
        winreg.SetValueEx(key, "NoModify", 0, winreg.REG_DWORD, 1)
        winreg.SetValueEx(key, "NoRepair", 0, winreg.REG_DWORD, 1)
    finally:
        winreg.CloseKey(key)


def unregister_uninstall():
    try:
        winreg.DeleteKey(winreg.HKEY_CURRENT_USER, REG_KEY)
    except FileNotFoundError:
        pass


def _shortcut_targets():
    dst = install_location()
    exe = os.path.join(dst, "D20.exe")
    uninstaller = os.path.join(dst, "uninstall.exe")
    return dst, exe, uninstaller


def do_install(silent: bool = False) -> int:
    dst = install_location()
    src = bundled_d20()
    if not os.path.isdir(src):
        msg = f"找不到内嵌的程序目录：\n{src}"
        if not silent:
            ctypes.windll.user32.MessageBoxW(0, msg, "安装失败", 0x10)
        print("INSTALL_FAIL", msg)
        return 1

    if os.path.isdir(dst):
        shutil.rmtree(dst)
    shutil.copytree(src, dst)

    # 复制自身作为卸载器
    uninstaller = os.path.join(dst, "uninstall.exe")
    shutil.copyfile(sys.executable, uninstaller)

    exe = os.path.join(dst, "D20.exe")
    make_shortcut(exe, os.path.join(user_desktop(), "D20.lnk"), APP_NAME)
    sm = start_menu_programs()
    make_shortcut(exe, os.path.join(sm, "D20.lnk"), APP_NAME)
    make_shortcut(uninstaller, os.path.join(sm, "卸载 D20.lnk"), "卸载 " + APP_NAME, "--uninstall")
    register_uninstall(dst, uninstaller)

    msg = f"{APP_NAME} 已安装到：\n{dst}\n\n桌面与开始菜单已创建快捷方式。"
    if not silent:
        ctypes.windll.user32.MessageBoxW(0, msg, "安装完成", 0x40)
    print("INSTALL_OK", dst)
    return 0


def do_uninstall(silent: bool = False) -> int:
    dst, exe, uninstaller = _shortcut_targets()
    if os.path.isdir(dst):
        shutil.rmtree(dst)
    for p in [
        os.path.join(user_desktop(), "D20.lnk"),
        os.path.join(start_menu_programs(), "D20.lnk"),
        os.path.join(start_menu_programs(), "卸载 D20.lnk"),
    ]:
        try:
            os.remove(p)
        except OSError:
            pass
    unregister_uninstall()
    msg = f"{APP_NAME} 已卸载。"
    if not silent:
        ctypes.windll.user32.MessageBoxW(0, msg, "卸载完成", 0x40)
    print("UNINSTALL_OK")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description="D20 安装器")
    ap.add_argument("--uninstall", action="store_true", help="卸载模式")
    ap.add_argument("--silent", action="store_true", help="静默（不弹窗）")
    args = ap.parse_args()
    if args.uninstall:
        return do_uninstall(silent=args.silent)
    return do_install(silent=args.silent)


if __name__ == "__main__":
    sys.exit(main())
