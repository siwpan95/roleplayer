"""mvp_builder.py - 向后兼容 shim

原 MVP 单文件版本已重构为模块化 d20 包。
本文件仅作向后兼容，直接转发到新实现：

    from mvp_builder import Character   # 仍可用，等价于 from d20 import Character

新代码请直接使用 ``d20`` 包。
"""
# 重导出全部老 API 以保证向后兼容
from d20 import Character  # noqa: F401
from d20.character import Character as _C  # noqa: F401
from d20.data import (  # noqa: F401
    EQUIPMENT_LIBRARY, ARMOR_PROFICIENCY, SKILL_LIBRARY, DIFFICULTY_COST,
    SKILL_CATEGORIES, TECHNIQUES, TALENT_BONUS_GROUPS,
    ADVANTAGES_LIBRARY, DISADVANTAGES_LIBRARY,
)
from d20.attributes import calc_attribute_cost  # noqa: F401


def create_character_cli():
    """保留老 CLI 入口（转发到新 cli.main）。"""
    from cli import main
    main()


if __name__ == "__main__":
    create_character_cli()
