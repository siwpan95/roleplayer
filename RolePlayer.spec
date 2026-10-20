# -*- mode: python ; coding: utf-8 -*-
"""Role Player 跑团模拟器 — tkinter GUI 的 PyInstaller 打包规格

用法：<主解释器>/python.exe -m PyInstaller RolePlayer.spec --noconfirm --clean  # 去符盘：原写死 /Python314
入口：gui/app.py（无控制台窗口程序，windowed）
依赖：roleplayer 包（纯标准库，零第三方依赖）+ tkinter（Tcl/Tk 9.0，主解释器自带 —— 去符盘 /Python314）

注意：主解释器（去符盘 /Python314）的 Tcl/Tk 9.0 库以独立目录形式提供（tcl_library/tk_library），
PyInstaller 不会自动收集其初始化脚本（init.tcl/tk.tcl），必须显式 datas 注入，
并由 runtime_hook_tk.py 在运行时设置 TCL_LIBRARY/TK_LIBRARY。
"""
import os

ROOT = os.path.abspath(SPECPATH)  # 2026-08-31：原硬编码 E:/RolePlayer 改为 spec 所在目录
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
        # roleplayer 核心包（纯标准库，全部显式列出以防动态导入漏检）
        "d20",
        "roleplayer.character",
        "roleplayer.attributes",
        "roleplayer.data",
        "roleplayer.data_monsters",
        "roleplayer.data_spells",
        "roleplayer.data_conditions",
        "roleplayer.data_magicitems",
        "roleplayer.combat",
        "roleplayer.condition",
        "roleplayer.skills",
        "roleplayer.techniques",
        "roleplayer.equipment",
        "roleplayer.feats",
        "roleplayer.perks",
        "roleplayer.race",
        "roleplayer.background",
        "roleplayer.derived",
        "roleplayer.dice",
        "roleplayer.monster",
        "roleplayer.slots",
        "roleplayer.rest",
        "roleplayer.sheet",
        "roleplayer.core",
        # ★ 服务由 composition.yml / loader.DEFAULT_SERVICE_ENTRIES 以「字符串」声明，
        #   经 d20/loader.py:195 的 importlib.import_module() 动态导入，
        #   PyInstaller 静态分析**抓不到**，必须在此显式列出。
        #   缺失时 importlib 抛 ModuleNotFoundError（不是 CordisError），
        #   character.py:171 的 `except CordisError` 兜不住 → 打包版启动即崩溃。
        "roleplayer.loader",
        "roleplayer.classes",        # v2.1 ClassService
        "roleplayer.reference",      # v2.1 ReferenceService
        "roleplayer.battle",         # v2.2 BattleService
        # v2.1/v2.2 新增数据表（被上述服务静态引用，显式列出以防漏检）
        "roleplayer.data_classes",
        "roleplayer.data_reference",
        "roleplayer.data_battle",
        "roleplayer.data_equipment_srd",
        "roleplayer.data_proficiencies",
        # v2.2 新增模块（battle 内部静态引用 narration；character 方法内延迟导入
        # character_io，二者均显式列出以确保进入模块图）
        "roleplayer.narration",
        "roleplayer.character_io",
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
    name="RolePlayer",
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
    name="RolePlayer",
)
