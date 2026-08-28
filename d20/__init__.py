"""d20 - D&D-GURPS 变体角色构建器核心包

Cordis 化架构（Context / Service / 依赖注入 / 事件 / 生命周期）：

    Character（公共门面）
      ├── ctx.attributes   AttributesService   属性购买
      ├── ctx.equipment    EquipmentService    装备系统
      ├── ctx.perks        PerksService        优点/缺点/天赋
      ├── ctx.skills       SkillsService       技能购买与默认值
      ├── ctx.techniques   TechniquesService    技术（战技/法术）
      ├── ctx.derived      DerivedService      HP/AC/攻击/豁免
      ├── ctx.combat       CombatService       战斗宏
      ├── ctx.dice         DiceService         骰子检定
      └── ctx.sheet        SheetService        角色卡渲染

子系统由 composition.yml 装配（纯 YAML 组合），加载器按 inject 依赖拓扑排序。
Character 仅作兼容门面：公共方法委托给 ctx.<service>，实例状态代理到 ctx.state。
数据中枢：d20.data（融合 D&D 三宝书与 GURPS Basic Set 规则）。

快速开始：
    from d20 import Character
    c = Character()
    c.set_attribute("力量", 16)
    c.purchase_skill("近战攻击", 12)
    print(c.show_sheet())
"""
from .character import Character
from .data import (
    ATTRIBUTES, EQUIPMENT_LIBRARY, SKILL_LIBRARY, DIFFICULTY_COST,
    TECHNIQUES, TALENT_BONUS_GROUPS, SKILL_CATEGORIES, ARMOR_PROFICIENCY,
    ADVANTAGES_LIBRARY, DISADVANTAGES_LIBRARY, WEAPON_DICE, FINESSE_WEAPONS,
    DEFAULT_STARTING_CP, DEFAULT_MAX_DISADVANTAGE_CP, ability_mod,
)
from .dice import roll_d20, roll_d100, roll_d6, roll_3d6, gurps_success_chance

__all__ = [
    "Character",
    "ATTRIBUTES", "EQUIPMENT_LIBRARY", "SKILL_LIBRARY", "DIFFICULTY_COST",
    "TECHNIQUES", "TALENT_BONUS_GROUPS", "SKILL_CATEGORIES", "ARMOR_PROFICIENCY",
    "ADVANTAGES_LIBRARY", "DISADVANTAGES_LIBRARY", "WEAPON_DICE", "FINESSE_WEAPONS",
    "DEFAULT_STARTING_CP", "DEFAULT_MAX_DISADVANTAGE_CP", "ability_mod",
    "roll_d20", "roll_d100", "roll_d6", "roll_3d6", "gurps_success_chance",
]

__version__ = "2.0.0"
