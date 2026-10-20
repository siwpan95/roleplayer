# -*- mode: python ; coding: utf-8 -*-
"""D20 安装器 — PyInstaller 单文件规格

用法：F:/Python314/python.exe -m PyInstaller installer.spec --noconfirm --clean
入口：installer.py（windowed，纯标准库，不依赖 tkinter）
内嵌：dist/D20（已用 runtime_hook_tk.py 验证可用的完整 tkinter 应用目录）

输出：dist/RolePlayer-Setup-<版本>.exe（单文件自包含安装包）

注意：输出文件名**不再硬编码**，而是从 roleplayer/__init__.py 的 __version__ 解析。
此前写死 "RolePlayer-Setup-2.0.0"，版本升到 2.2.0 后产出物名仍叫 2.0.0 —— 与
installer.py:APP_VERSION 的版本漂移属同一病根（同一个数字散落三处）。
现在唯一真相源是 roleplayer.__version__，配合 tests/test_version_consistency.py 守住。
"""
import os
import re

ROOT = os.path.abspath(SPECPATH)  # 2026-08-31：原硬编码 E:/RolePlayer 改为 spec 所在目录


def _app_version() -> str:
    """从 roleplayer/__init__.py 解析 __version__，作为版本号的唯一真相源。"""
    init = os.path.join(ROOT, "roleplayer", "__init__.py")
    with open(init, encoding="utf-8") as f:
        m = re.search(r'^__version__\s*=\s*["\']([^"\']+)["\']', f.read(), re.M)
    if not m:
        raise RuntimeError(f"无法在 {init} 中解析 __version__")
    return m.group(1)


APP_VERSION = _app_version()

a = Analysis(
    [os.path.join(ROOT, "installer.py")],
    pathex=[ROOT],
    binaries=[],
    datas=[(os.path.join(ROOT, "dist", "RolePlayer"), "RolePlayer")],
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=["pytest", "tkinter", "numpy", "PIL"],
    noarchive=False,
    optimize=0,
)

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name=f"RolePlayer-Setup-{APP_VERSION}",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
