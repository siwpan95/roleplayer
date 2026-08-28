# -*- mode: python ; coding: utf-8 -*-
"""D20 安装器 — PyInstaller 单文件规格

用法：F:/Python314/python.exe -m PyInstaller installer.spec --noconfirm --clean
入口：installer.py（windowed，纯标准库，不依赖 tkinter）
内嵌：dist/D20（已用 runtime_hook_tk.py 验证可用的完整 tkinter 应用目录）

输出：dist/D20-Setup-2.0.0.exe（单文件自包含安装包）
"""
import os

ROOT = os.path.abspath(r"E:/D20")

a = Analysis(
    [os.path.join(ROOT, "installer.py")],
    pathex=[ROOT],
    binaries=[],
    datas=[(os.path.join(ROOT, "dist", "D20"), "D20")],
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
    name="D20-Setup-2.0.0",
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
