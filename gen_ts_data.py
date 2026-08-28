"""Generate web/src/engine data modules from the live Python d20 SRD data.

Outputs 4 TS files that mirror d20/data_spells.py, data_magicitems.py,
data_monsters.py, data_conditions.py. Using the Python objects as the single
source of truth guarantees the TS engine content is byte-for-byte consistent
with the Python backend (frontend/backend parity for the SRD expansion).
"""
import json
import os
import sys

D20 = r"E:/D20"
sys.path.insert(0, D20)
from d20 import data_spells, data_magicitems, data_monsters, data_conditions  # noqa: E402

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

print("generated: data_spells.ts, data_magicitems.ts, data_monsters.ts, data_conditions.ts")
print("spells:", len(data_spells.SRD_SPELLS),
      "magic:", len(data_magicitems.MAGIC_ITEMS),
      "monsters:", len(data_monsters.MONSTERS),
      "conditions:", len(data_conditions.CONDITIONS))
