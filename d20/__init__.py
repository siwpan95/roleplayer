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
      ├── ctx.sheet        SheetService        角色卡渲染
      ├── ctx.classes      ClassService        职业与等级成长（v2.1）
      ├── ctx.reference    ReferenceService    SRD 规则速查（v2.1）
      └── ctx.battle       BattleService        模拟对战与遭遇构建（v2.2）

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
from .dice import roll_d20, roll_d100, roll_d6, roll_3d6, gurps_success_chance, weapon_dice

# v2.1 SRD 扩充数据（由 gen_srd_v21.py 从 dnd5eapi.co/api/2014 生成）
from .data_classes import CLASSES, CLASS_LEVELS, SUBCLASSES, FEATURES
from .data_equipment_srd import SRD_EQUIPMENT, WEAPON_PROPERTIES
from .data_proficiencies import PROFICIENCIES
from .data_reference import (
    ABILITY_SCORES, ALIGNMENTS, DAMAGE_TYPES, MAGIC_SCHOOLS,
    LANGUAGES, SRD_SKILLS, RULES, RULE_SECTIONS,
)

# v2.2 模拟对战规则常量（DMG 2014 遭遇构建 + AI 启发式）
from .data_battle import (
    XP_THRESHOLDS, DAILY_XP_BUDGET, ENCOUNTER_MULTIPLIERS,
    encounter_multiplier, party_thresholds, judge_difficulty,
    normalize_damage_type, DIFFICULTY_CN,
)

__all__ = [
    "Character",
    "ATTRIBUTES", "EQUIPMENT_LIBRARY", "SKILL_LIBRARY", "DIFFICULTY_COST",
    "TECHNIQUES", "TALENT_BONUS_GROUPS", "SKILL_CATEGORIES", "ARMOR_PROFICIENCY",
    "ADVANTAGES_LIBRARY", "DISADVANTAGES_LIBRARY", "WEAPON_DICE", "FINESSE_WEAPONS",
    "DEFAULT_STARTING_CP", "DEFAULT_MAX_DISADVANTAGE_CP", "ability_mod",
    "roll_d20", "roll_d100", "roll_d6", "roll_3d6", "gurps_success_chance",
    "weapon_dice",
    "CLASSES", "CLASS_LEVELS", "SUBCLASSES", "FEATURES",
    "SRD_EQUIPMENT", "WEAPON_PROPERTIES", "PROFICIENCIES",
    "ABILITY_SCORES", "ALIGNMENTS", "DAMAGE_TYPES", "MAGIC_SCHOOLS",
    "LANGUAGES", "SRD_SKILLS", "RULES", "RULE_SECTIONS",
    "XP_THRESHOLDS", "DAILY_XP_BUDGET", "ENCOUNTER_MULTIPLIERS",
    "encounter_multiplier", "party_thresholds", "judge_difficulty",
    "normalize_damage_type", "DIFFICULTY_CN",
]

__version__ = "2.2.0"
