"""mvp_gui.py - 向后兼容 shim

原 MVP GUI 单文件版本已重构为 gui.app 模块。
本文件仅作向后兼容，直接转发到新实现：

    python mvp_gui.py        # 仍可启动 GUI
"""
from gui.app import CharacterBuilderApp, main  # noqa: F401


if __name__ == "__main__":
    main()
