"""Generate web/src/engine data modules from the live Python d20 SRD data.

Outputs 4 TS files that mirror d20/data_spells.py, data_magicitems.py,
data_monsters.py, data_conditions.py. Using the Python objects as the single
source of truth guarantees the TS engine content is byte-for-byte consistent
with the Python backend (frontend/backend parity for the SRD expansion).
"""
import json
import os
import sys

# 仓库根 = 本脚本所在目录（2026-08-31 修复：原硬编码 E:/D20 已随项目更名/迁仓失效）
D20 = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, D20)
from d20 import (  # noqa: E402
    data_spells, data_magicitems, data_monsters, data_conditions,
    data_classes, data_equipment_srd, data_proficiencies, data_reference,
    data_battle,
)

OUT = os.path.join(D20, "web", "src", "engine")

HEADER = """/**
 * d20.web engine/{fname} - {desc}
 *
 * 由 Python d20.{pyname} 经 JSON 直转生成，保证与 Python 单一事实来源逐字段一致
 * （前端/后端 SRD 内容零漂移）。如需修改，请在 Python 侧改动后经本生成脚本同步。
 */
"""


def dump(obj):
    return json.dumps(obj, ensure_ascii=False, indent=2)


# ---------------------------------------------------------------------------
#  data_spells.ts
# ---------------------------------------------------------------------------
spell_body = HEADER.format(
    fname="data_spells",
    desc="SRD 全谱法术名册（0–9 环）",
    pyname="data_spells",
)
spell_body += (
    "export const SRD_SPELLS: Record<string, any> = "
    + dump(data_spells.SRD_SPELLS)
    + ";\n\n"
    "export const SRD_SPELL_RINGS: Record<string, number> = "
    + dump(data_spells.SRD_SPELL_RINGS)
    + ";\n"
)
with open(os.path.join(OUT, "data_spells.ts"), "w", encoding="utf-8") as f:
    f.write(spell_body)

# ---------------------------------------------------------------------------
#  data_magicitems.ts
# ---------------------------------------------------------------------------
mi_body = HEADER.format(
    fname="data_magicitems",
    desc="DMG 魔法物品（按 rarity 分级）",
    pyname="data_magicitems",
)
mi_body += (
    "export const MAGIC_ITEMS: Record<string, any> = "
    + dump(data_magicitems.MAGIC_ITEMS)
    + ";\n"
)
with open(os.path.join(OUT, "data_magicitems.ts"), "w", encoding="utf-8") as f:
    f.write(mi_body)

# ---------------------------------------------------------------------------
#  data_monsters.ts
# ---------------------------------------------------------------------------
mon_body = HEADER.format(
    fname="data_monsters",
    desc="SRD 怪物图鉴（含 CR→XP 表）",
    pyname="data_monsters",
)
mon_body += (
    "export const MONSTERS: Record<string, any> = "
    + dump(data_monsters.MONSTERS)
    + ";\n\n"
    "export const CR_XP: Record<string, number> = "
    + dump(data_monsters.CR_XP)
    + ";\n"
)
with open(os.path.join(OUT, "data_monsters.ts"), "w", encoding="utf-8") as f:
    f.write(mon_body)

# ---------------------------------------------------------------------------
#  data_conditions.ts
# ---------------------------------------------------------------------------
cond_body = HEADER.format(
    fname="data_conditions",
    desc="SRD 官方 15 条战斗条件",
    pyname="data_conditions",
)
cond_body += (
    "export const CONDITIONS: Record<string, any> = "
    + dump(data_conditions.CONDITIONS)
    + ";\n\n"
    "export const DISADVANTAGE_PENALTY = "
    + dump(data_conditions.DISADVANTAGE_PENALTY)
    + ";\n"
)
with open(os.path.join(OUT, "data_conditions.ts"), "w", encoding="utf-8") as f:
    f.write(cond_body)

# ---------------------------------------------------------------------------
#  v2.1：data_classes.ts（12 职业 + 12 子职业 + 20 级成长 + 407 特性）
# ---------------------------------------------------------------------------
cls_body = HEADER.format(
    fname="data_classes",
    desc="SRD 职业系统（职业 / 等级成长 / 子职业 / 特性）",
    pyname="data_classes",
)
cls_body += (
    "export const CLASSES: Record<string, any> = "
    + dump(data_classes.CLASSES)
    + ";\n\n"
    "export const CLASS_LEVELS: Record<string, Record<string, any>> = "
    + dump(data_classes.CLASS_LEVELS)
    + ";\n\n"
    "export const SUBCLASSES: Record<string, any> = "
    + dump(data_classes.SUBCLASSES)
    + ";\n\n"
    "export const FEATURES: Record<string, any> = "
    + dump(data_classes.FEATURES)
    + ";\n"
)
with open(os.path.join(OUT, "data_classes.ts"), "w", encoding="utf-8") as f:
    f.write(cls_body)

# ---------------------------------------------------------------------------
#  v2.1：data_equipment_srd.ts（237 件 SRD 装备 + 11 条武器属性）
# ---------------------------------------------------------------------------
eq_body = HEADER.format(
    fname="data_equipment_srd",
    desc="SRD 装备库（237 件）与武器属性（11 条）",
    pyname="data_equipment_srd",
)
eq_body += (
    "export const SRD_EQUIPMENT: Record<string, any> = "
    + dump(data_equipment_srd.SRD_EQUIPMENT)
    + ";\n\n"
    "export const WEAPON_PROPERTIES: Record<string, any> = "
    + dump(data_equipment_srd.WEAPON_PROPERTIES)
    + ";\n"
)
with open(os.path.join(OUT, "data_equipment_srd.ts"), "w", encoding="utf-8") as f:
    f.write(eq_body)

# ---------------------------------------------------------------------------
#  v2.1：data_proficiencies.ts（117 项熟练）
# ---------------------------------------------------------------------------
prof_body = HEADER.format(
    fname="data_proficiencies",
    desc="SRD 熟练项（117 项：技能/豁免/武器/护甲/工具/乐器…）",
    pyname="data_proficiencies",
)
prof_body += (
    "export const PROFICIENCIES: Record<string, any> = "
    + dump(data_proficiencies.PROFICIENCIES)
    + ";\n"
)
with open(os.path.join(OUT, "data_proficiencies.ts"), "w", encoding="utf-8") as f:
    f.write(prof_body)

# ---------------------------------------------------------------------------
#  v2.1：data_reference.ts（参考常量与规则速查）
# ---------------------------------------------------------------------------
ref_body = HEADER.format(
    fname="data_reference",
    desc="SRD 参考常量与规则速查（属性值/阵营/伤害类型/学派/语言/技能/规则）",
    pyname="data_reference",
)
ref_body += "".join(
    f"export const {name}: Record<string, any> = " + dump(getattr(data_reference, name)) + ";\n\n"
    for name in ("ABILITY_SCORES", "ALIGNMENTS", "DAMAGE_TYPES", "MAGIC_SCHOOLS",
                 "LANGUAGES", "SRD_SKILLS", "RULES", "RULE_SECTIONS")
)
with open(os.path.join(OUT, "data_reference.ts"), "w", encoding="utf-8") as f:
    f.write(ref_body)

# ---------------------------------------------------------------------------
#  v2.2：data_battle.ts（DMG 2014 遭遇构建 + AI 启发式 + 伤害归一化常量）
# ---------------------------------------------------------------------------
bt_body = HEADER.format(
    fname="data_battle",
    desc="模拟对战规则常量（遭遇构建/AI/伤害归一化）",
    pyname="data_battle",
)
bt_body += "".join(
    f"export const {name} = " + dump(getattr(data_battle, name)) + ";\n\n"
    for name in ("XP_THRESHOLDS", "ENCOUNTER_MULTIPLIERS", "DAILY_XP_BUDGET",
                 "DIFFICULTIES", "DIFFICULTY_CN", "DAMAGE_TYPE_ALIAS",
                 "CONDITION_KEYWORDS", "SAVE_ABILITY_MAP", "AI_ACTION_PRIORITY",
                 "AI_WIS_WOUNDED_THRESHOLD", "AI_INT_ADAPT_THRESHOLD",
                 "AI_INT_OPTIMAL_THRESHOLD", "MELEE_REACH",
                 "DEFAULT_START_DISTANCE", "DEATH_SAVE_TARGET",
                 "DEATH_SAVE_SUCCESSES", "DEATH_SAVE_FAILURES", "CRIT_ROLL",
                 "DEFAULT_MAX_ROUNDS", "ROUND_SECONDS")
)
with open(os.path.join(OUT, "data_battle.ts"), "w", encoding="utf-8") as f:
    f.write(bt_body)

print("generated: data_spells.ts, data_magicitems.ts, data_monsters.ts, data_conditions.ts, "
      "data_classes.ts, data_equipment_srd.ts, data_proficiencies.ts, data_reference.ts, "
      "data_battle.ts")
print("spells:", len(data_spells.SRD_SPELLS),
      "magic:", len(data_magicitems.MAGIC_ITEMS),
      "monsters:", len(data_monsters.MONSTERS),
      "conditions:", len(data_conditions.CONDITIONS))
print("classes:", len(data_classes.CLASSES),
      "levels:", sum(len(v) for v in data_classes.CLASS_LEVELS.values()),
      "subclasses:", len(data_classes.SUBCLASSES),
      "features:", len(data_classes.FEATURES),
      "equipment:", len(data_equipment_srd.SRD_EQUIPMENT),
      "proficiencies:", len(data_proficiencies.PROFICIENCIES))
