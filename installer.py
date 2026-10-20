# -*- mode: python ; coding: utf-8 -*-
"""Role Player 跑团模拟器 — 自包含安装器 / 卸载器（纯标准库，零第三方依赖）

打包：F:/Python314/python.exe -m PyInstaller installer.spec --noconfirm --clean
内嵌的程序目录 dist/RolePlayer 由 installer.spec 的 --add-data 提供（onedir 产物整体嵌入）。

行为：
  installer.exe            图形(windowed)模式安装，结束弹 MessageBox
  installer.exe --silent   静默安装（供自动化/验证使用）
  installer.exe --uninstall           卸载
  installer.exe --uninstall --silent  静默卸载
  installer.exe --install             强制安装（覆盖按文件名的自动判定）

安装目录下的 uninstall.exe 是安装器的**逐字节副本**（见 do_install 的
shutil.copyfile）。不带参数直接双击它时，程序按文件名自动进入卸载模式，
而不是重装（详见 _invoked_as_uninstaller 的说明）。

卸载时由于卸载器自身正位于待删除目录中，Windows 不允许它删除自己。
因此 do_uninstall 会：先清快捷方式与注册表 → 删除目录内除自身外的全部内容
→ 派生脱离本进程的 .bat 延迟清理残余文件与空目录。

安装位置：%LOCALAPPDATA%\\Programs\\RolePlayer（用户级，免 UAC）
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

APP_NAME = "Role Player 跑团模拟器"
# 必须与 roleplayer/__init__.py 的 __version__ 对齐。
# 该值会写入注册表 DisplayVersion（见下方 winreg.SetValueEx），
# 版本不一致会让"添加/删除程序"里显示错误的版本号。
APP_VERSION = "3.0.1"
REG_KEY = r"Software\Microsoft\Windows\CurrentVersion\Uninstall\RolePlayer"


def bundled_roleplayer() -> str:
    """打包后通过 sys._MEIPASS 找到内嵌的 RolePlayer 目录；开发期回退到仓库 dist/RolePlayer。"""
    if getattr(sys, "_MEIPASS", None):
        return os.path.join(sys._MEIPASS, "RolePlayer")
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist", "RolePlayer")


def install_location() -> str:
    local = os.environ.get("LOCALAPPDATA") or os.path.expandvars("%LOCALAPPDATA%")
    return os.path.join(local, "Programs", "RolePlayer")


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


def _write_shortcut(target: str, link_path: str, description: str = "", arguments: str = ""):
    """真正执行 IShellLink + IPersistFile 写 .lnk。失败时抛出 OSError。

    与 PowerShell 的 WScript.Shell 不同，IShellLink+IPersistFile 只做文件写入，
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
        # IShellLinkW vtable 偏移（含 IUnknown 的 0=QueryInterface/1=AddRef/2=Release）：
        #     3=GetPath             4=GetIDList            5=SetIDList
        #     6=GetDescription      7=SetDescription       8=GetWorkingDirectory
        #     9=SetWorkingDirectory 10=GetArguments        11=SetArguments
        #    12=GetHotkey          13=SetHotkey           14=GetShowCmd
        #    15=SetShowCmd         16=GetIconLocation     17=SetIconLocation
        #    18=SetRelativePath    19=Resolve             20=SetPath
        #
        # ★ 2026-08-29 修正：原实现误用 5/8/10/12（它们分别是 SetIDList /
        #   GetWorkingDirectory / GetArguments / GetHotkey）。后果不止「属性没设上」：
        #     * 5=SetIDList 被当作 SetPath 调用 → 往 Shell 对象里塞了一个伪造的
        #       IDList，Save 时序列化出 24KB~58KB 的垃圾 .lnk（正常约 300B）；
        #     * 8=GetWorkingDirectory 与 10=GetArguments 都需要 3 个参数，
        #       却经 2 参数的 stdcall 函数指针调用 → 被调方多弹栈，栈失衡；
        #       同时它们会把路径写进「当作输出缓冲区的字符串内存」，破坏 Python 对象。
        #   二者叠加导致 IPersistFile::Save 间歇性抛出
        #   OSError(22, ..., -2147317563)，即快捷方式创建时好时坏且内容根本是坏的。
        SetPath = WINFUNCTYPE(ctypes.c_long, c_void_p, c_wchar_p)(vt[20])
        SetDesc = WINFUNCTYPE(ctypes.c_long, c_void_p, c_wchar_p)(vt[7])
        SetWD = WINFUNCTYPE(ctypes.c_long, c_void_p, c_wchar_p)(vt[9])
        SetArgs = WINFUNCTYPE(ctypes.c_long, c_void_p, c_wchar_p)(vt[11])
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
        # 应对 Defender/Explorer 对桌面、开始菜单目录的瞬时共享锁（WinError 32）。
        # 实测（2026-08-29）：占用可能持续数秒，且失败时 Save 会留下一个**截断的
        # 半成品 .lnk**（实测 76 字节，正常 1~2KB）—— 必须清理掉，否则用户桌面上
        # 会躺一个点不开的坏快捷方式。
        #   原策略：固定 8 次 × 0.4s ≈ 3.2s。实测仍有约 1/4 概率失败。
        #   现策略：指数退避，最长约 12s；仍失败则删掉残骸并抛错由调用方降级处理。
        last_hr = -1
        delay = 0.3
        for _ in range(12):
            last_hr = Save(ppf, link_path, 1)
            if last_hr == 0:
                break
            time.sleep(delay)
            delay = min(delay * 1.6, 2.0)
        if last_hr != 0:
            # 清理 Save 留下的截断文件，避免留下打不开的坏快捷方式
            try:
                if os.path.getsize(link_path) < 512:
                    os.remove(link_path)
            except OSError:
                pass
            raise ctypes.WinError(last_hr)
        WINFUNCTYPE(ctypes.c_long, c_void_p)(pfv[2])(ppf)  # Release IPersistFile
        WINFUNCTYPE(ctypes.c_long, c_void_p)(vt[2])(psl)    # Release IShellLink
    finally:
        _ole32.CoUninitialize()


def make_shortcut(target: str, link_path: str, description: str = "", arguments: str = ""):
    """创建快捷方式：优先直写目标路径，失败则回退「先写 %TEMP% 再 move」。

    为什么保留回退（2026-08-29 实测）：修复 IShellLinkW vtable 偏移之前，
    ``IPersistFile::Save`` 会间歇性抛 ``OSError(22, ..., -2147317563)``，
    并留下截断的半成品 .lnk（76 字节）。

    一度怀疑是 Explorer/安全软件占用桌面目录，但受控实验**否定**了该假设：
    同一 API 单独调用时，写 %TEMP% 10/10 成功、写桌面与开始菜单各 4/4 成功。
    真正的根因是 vtable 偏移写错造成的栈失衡与伪造 IDList（详见
    ``_write_shortcut`` 内注释）。修正偏移后连跑 3 轮完整安装→卸载，
    3/3 全部成功，``.lnk`` 大小稳定在 1230B / 1304B —— 间歇失败彻底消失。

    回退路径仍予保留，仅作为安全网：先 Save 到 %TEMP%（普通目录，稳定），
    再用 ``shutil.move`` 挪进目标目录。move 是目录项改名，不再走 COM，
    可绕过一切与目标目录相关的写入干扰。
    """
    try:
        _write_shortcut(target, link_path, description, arguments)
        return
    except OSError:
        pass
    # 回退：写到临时目录再 move 进目标位置
    tmp = os.path.join(tempfile.gettempdir(), "_d20_" + os.path.basename(link_path))
    if os.path.exists(tmp):
        try:
            os.remove(tmp)
        except OSError:
            pass
    _write_shortcut(target, tmp, description, arguments)
    shutil.move(tmp, link_path)


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
    exe = os.path.join(dst, "RolePlayer.exe")
    uninstaller = os.path.join(dst, "uninstall.exe")
    return dst, exe, uninstaller


def do_install(silent: bool = False) -> int:
    dst = install_location()
    src = bundled_roleplayer()
    if not os.path.isdir(src):
        msg = f"找不到内嵌的程序目录：\n{src}"
        if not silent:
            ctypes.windll.user32.MessageBoxW(0, msg, "安装失败", 0x10)
        print("INSTALL_FAIL", msg)
        return 1

    if os.path.isdir(dst):
        # 覆盖安装：目标目录里若有正在运行的 RolePlayer.exe，Windows 会拒绝删除。
        # 此前此处是裸 rmtree，用户会得到一屏未捕获的 traceback；
        # 现在给出可操作的提示。
        try:
            shutil.rmtree(dst)
        except PermissionError as e:
            msg = (f"无法覆盖安装：目标目录中的文件正在被占用。\n"
                   f"请先关闭正在运行的 {APP_NAME}，然后重试。\n\n"
                   f"{dst}\n\n（{e.filename or ''}）")
            if not silent:
                ctypes.windll.user32.MessageBoxW(0, msg, "安装失败", 0x10)
            print("INSTALL_FAIL", msg)
            return 1
    shutil.copytree(src, dst)

    # 复制自身作为卸载器
    uninstaller = os.path.join(dst, "uninstall.exe")
    shutil.copyfile(sys.executable, uninstaller)

    # 快捷方式失败**不得**中断安装：程序本体与卸载注册都已就位，
    # 只因为 Explorer/Defender 占用导致 .lnk 没写成，就让整个安装以未捕获异常收场，
    # 是极糟糕的失败模式（实测触发过，用户看到崩溃，实际 958 个文件已全部装好）。
    # 降级策略：记录失败项，安装照常成功，并在完成消息里如实告知。
    exe = os.path.join(dst, "RolePlayer.exe")
    sm = start_menu_programs()
    shortcuts = [
        (exe, os.path.join(user_desktop(), "RolePlayer.lnk"), APP_NAME, ""),
        (exe, os.path.join(sm, "RolePlayer.lnk"), APP_NAME, ""),
        (uninstaller, os.path.join(sm, "卸载 RolePlayer.lnk"), "卸载 " + APP_NAME, "--uninstall"),
    ]
    failed_links = []
    for target, link, desc, args in shortcuts:
        try:
            make_shortcut(target, link, desc, args)
        except OSError as e:
            failed_links.append(os.path.basename(link))
            print("SHORTCUT_FAIL", link, repr(e))

    register_uninstall(dst, uninstaller)

    msg = f"{APP_NAME} 已安装到：\n{dst}"
    if failed_links:
        msg += ("\n\n注意：以下快捷方式创建失败（多为安全软件/资源管理器瞬时占用），"
                f"可稍后手动创建或重新安装：\n  " + "\n  ".join(failed_links)
                + f"\n\n程序本体已完整安装，可从上述目录直接运行 RolePlayer.exe。")
    else:
        msg += "\n\n桌面与开始菜单已创建快捷方式。"
    if not silent:
        ctypes.windll.user32.MessageBoxW(0, msg, "安装完成", 0x40)
    print("INSTALL_OK", dst)
    return 0


def _running_self() -> str:
    """返回「本程序自身」的绝对路径（frozen 时是 exe，开发期是脚本）。"""
    return os.path.abspath(sys.executable if getattr(sys, "frozen", False) else __file__)


def _cleanup_bat_lines(target_dir: str, self_exe: str) -> list:
    """生成延迟清理批处理的内容（纯 ASCII 结构，路径原样嵌入）。

    单独抽成函数是为了可测：``tests/test_installer.py`` 会在不派生任何进程的
    前提下校验「全篇零括号」等不变量。
    """
    return [
        "@echo off",
        "set TRY=0",
        ":wait",
        "ping -n 2 127.0.0.1 >nul 2>&1",
        'del /f /q "%s" >nul 2>&1' % self_exe,
        'if not exist "%s" goto rmdir' % self_exe,
        "set /a TRY=TRY+1",
        "if %TRY% GEQ 40 goto rmdir",
        "goto wait",
        ":rmdir",
        'rmdir /s /q "%s" >nul 2>&1' % target_dir,
        'if not exist "%s" goto done' % target_dir,
        "ping -n 3 127.0.0.1 >nul 2>&1",
        'rmdir /s /q "%s" >nul 2>&1' % target_dir,
        ":done",
        'del /f /q "%~f0" >nul 2>&1',
        "",
    ]


def _spawn_delayed_cleanup(target_dir: str, self_exe: str) -> bool:
    """派生脱离本进程的批处理，等卸载器退出后清掉残余（含卸载器自身）。

    ★ 为什么需要它：Windows 禁止删除正在运行的 exe。卸载器就躺在安装目录里，
      因此它无法在自身进程内把自己删掉——直接 ``shutil.rmtree(dst)`` 必然抛
      ``PermissionError: [WinError 5]``（实测：958 个文件删到只剩 uninstall.exe
      时炸掉，且异常打断了后续的快捷方式清理与 ``unregister_uninstall()``，
      导致「添加/删除程序」里条目还在而程序已残废，卸载从此彻底卡死）。

      做法：主流程删除目录内除自身外的全部内容，并**优先**清掉快捷方式与注册表，
      最后派生一个 cmd 子进程轮询等待本进程退出，再删掉残余的 exe 与空目录。

    ★ .bat 编写铁律（本机实测踩过）：cmd 按 GBK 解读脚本；且 ``if (...)`` /
      ``for (...)`` 的括号会被解析器误判为语句块边界——若路径含 ``(x86)`` 必然
      报「此时不应有 xxx」。因此本脚本**全篇零括号**，控制流一律 ``goto`` + 标签。
      另外脚本内容按 GBK 编码写出，以便中文用户名路径能正确往返。

    返回：True=已派生清理脚本；False=无法写出脚本（此时残余需用户手动删除）。
    """
    bat = os.path.join(tempfile.gettempdir(), "_d20_cleanup.bat")
    lines = _cleanup_bat_lines(target_dir, self_exe)
    try:
        with open(bat, "w", encoding="gbk", newline="\r\n") as f:
            f.write("\n".join(lines))
    except (OSError, UnicodeEncodeError):
        return False
    # DETACHED_PROCESS：脱离父进程，本进程退出后清理脚本仍能继续运行
    subprocess.Popen(
        ["cmd", "/c", bat],
        creationflags=subprocess.DETACHED_PROCESS | subprocess.CREATE_NEW_PROCESS_GROUP,
        close_fds=True,
    )
    return True


def do_uninstall(silent: bool = False) -> int:
    dst, exe, uninstaller = _shortcut_targets()
    self_exe = _running_self()

    # 先清「对外可见状态」（快捷方式 + 注册表），再删文件。
    # 顺序很关键：早期实现把 rmtree 放在最前，一旦删文件抛异常，
    # 后续清理全部被跳过而注册表条目还留着 —— 用户会看到已残废的程序仍列在
    # 「添加/删除程序」里，且每次卸载都崩。先清状态可保证失败时也自洽。
    for p in [
        os.path.join(user_desktop(), "RolePlayer.lnk"),
        os.path.join(start_menu_programs(), "RolePlayer.lnk"),
        os.path.join(start_menu_programs(), "卸载 RolePlayer.lnk"),
    ]:
        try:
            os.remove(p)
        except OSError:
            pass
    unregister_uninstall()

    residual = None
    if os.path.isdir(dst):

        def _keep_running_self(func, path, exc):
            """放行「正在运行的卸载器自身」及「因它而无法删除的安装目录」。

            要放行两类路径，缺一不可（实测两阶段各崩一次）：
              1. uninstall.exe 文件本身 —— 运行中的 exe 不可删；
              2. 安装目录 dst 本身     —— rmtree 收尾要 os.rmdir(dst)，
                 而目录里还留着上面那个删不掉的 exe，于是 rmdir 同样
                 抛 WinError 5。只放行文件的话，会在这里二次崩溃。
            其余路径一律照常报错，避免掩盖真实故障。
            """
            p = os.path.normcase(os.path.abspath(path))
            if p in (os.path.normcase(self_exe), os.path.normcase(os.path.abspath(dst))):
                return
            raise exc[1]

        shutil.rmtree(dst, onerror=_keep_running_self)
        if os.path.isdir(dst):
            residual = dst

    msg = f"{APP_NAME} 已卸载。"
    if residual and not _spawn_delayed_cleanup(residual, self_exe):
        # 兜底：写不出清理脚本时如实告知，而不是假装卸载干净了
        msg += f"\n\n注意：部分文件未能自动删除，请手动删除：\n{residual}"

    if not silent:
        ctypes.windll.user32.MessageBoxW(0, msg, "卸载完成", 0x40)
    print("UNINSTALL_OK")
    return 0


def _invoked_as_uninstaller() -> bool:
    """本程序是否以「卸载器」身份被启动。

    ``do_install`` 里用 ``shutil.copyfile(sys.executable, uninstaller)`` 把自身
    复制成 ``uninstall.exe`` —— 它是**逐字节相同的副本**，行为也完全一样。
    这带来一个陷阱：用户直接双击安装目录里的 ``uninstall.exe``（不带参数）时，
    走的是**安装**分支，于是尝试删除自身所在目录并重装，最终以
    ``PermissionError`` + 未捕获 traceback 崩溃收场。

    这里按文件名兜底：以卸载器身份启动时，默认动作改为「卸载」。
    """
    name = os.path.basename(sys.argv[0] or "").lower()
    if name == "uninstall.exe":
        return True
    # frozen 环境下 sys.argv[0] 在某些调用方式下可能不可靠，回退查 sys.executable
    return os.path.basename(sys.executable or "").lower() == "uninstall.exe"


def main() -> int:
    ap = argparse.ArgumentParser(description="D20 安装器")
    ap.add_argument("--uninstall", action="store_true", help="卸载模式")
    ap.add_argument("--silent", action="store_true", help="静默（不弹窗）")
    ap.add_argument("--install", action="store_true", help="强制安装模式（覆盖按文件名的自动判定）")
    args = ap.parse_args()
    if args.install:
        return do_install(silent=args.silent)
    if args.uninstall or _invoked_as_uninstaller():
        return do_uninstall(silent=args.silent)
    return do_install(silent=args.silent)


if __name__ == "__main__":
    sys.exit(main())
