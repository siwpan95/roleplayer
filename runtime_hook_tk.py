# -*- mode: python ; coding: utf-8 -*-
"""PyInstaller runtime hook — 为打包后的 tkinter 指定 Tcl/Tk 9.0 库路径。

F:/Python314 的 Tcl/Tk 9.0 库以独立目录（tcl_library/tk_library）形式随包分发，
PyInstaller 不会自动设置 TCL_LIBRARY/TK_LIBRARY，需在 bootstrap 阶段手动指向
sys._MEIPASS 下的收集目录，否则运行时会报 "can't find a usable tk.tcl"。
"""
import os
import sys

if getattr(sys, "frozen", False):
    base = getattr(sys, "_MEIPASS", os.path.dirname(sys.executable))
    tcl = os.path.join(base, "tcl_library")
    tk = os.path.join(base, "tk_library")
    if os.path.isdir(tcl):
        os.environ["TCL_LIBRARY"] = tcl
    if os.path.isdir(tk):
        os.environ["TK_LIBRARY"] = tk
