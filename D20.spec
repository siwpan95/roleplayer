# -*- mode: python ; coding: utf-8 -*-
"""D20 角色构筑器 — tkinter GUI 的 PyInstaller 打包规格

用法：F:/Python314/python.exe -m PyInstaller D20.spec --noconfirm --clean
入口：gui/app.py（无控制台窗口程序，windowed）
依赖：d20 包（纯标准库，零第三方依赖）+ tkinter（Tcl/Tk 9.0，F:/Python314 自带）

注意：F:/Python314 的 Tcl/Tk 9.0 库以独立目录形式提供（tcl_library/tk_library），
PyInstaller 不会自动收集其初始化脚本（init.tcl/tk.tcl），必须显式 datas 注入，
并由 runtime_hook_tk.py 在运行时设置 TCL_LIBRARY/TK_LIBRARY。
"""
import os

ROOT = os.path.abspath(r"E:/D20")
TCLLIB = os.path.join(ROOT, "_tcllib")

a = Analysis(
    [os.path.join(ROOT, "gui", "app.py")],
    pathex=[ROOT],
    binaries=[],
    datas=[
        (os.path.join(TCLLIB, "tcl", "tcl_library"), "tcl_library"),
        (os.path.join(TCLLIB, "tk", "tk_library"), "tk_library"),
    ],
    hiddenimports=[
        # d20 核心包（纯标准库，全部显式列出以防动态导入漏检）
        "d20",
        "d20.character",
        "d20.attributes",
        "d20.data",
        "d20.data_monsters",
        "d20.data_spells",
        "d20.data_conditions",
        "d20.data_magicitems",
        "d20.combat",
        "d20.condition",
        "d20.skills",
        "d20.techniques",
        "d20.equipment",
        "d20.feats",
        "d20.perks",
        "d20.race",
        "d20.background",
        "d20.derived",
        "d20.dice",
        "d20.monster",
        "d20.slots",
        "d20.rest",
        "d20.sheet",
        "d20.core",
        # tkinter 子模块
        "tkinter",
        "tkinter.ttk",
        "tkinter.messagebox",
        "tkinter.scrolledtext",
        "tkinter.filedialog",
        "tkinter.simpledialog",
        "tkinter.font",
        "tkinter.colorchooser",
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[os.path.join(ROOT, "runtime_hook_tk.py")],
    excludes=["pytest", "PIL", "numpy", "Crypto", "mutagen"],
    noarchive=False,
    optimize=0,
)

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name="D20",
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

coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name="D20",
)
