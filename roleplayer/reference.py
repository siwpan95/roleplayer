"""roleplayer.reference - SRD 规则速查服务（DM 侧只读查询）

把 v2.1 新增的四类 SRD 数据（职业/装备/熟练/参考常量）暴露为**只读查询**能力，
供 CLI / GUI / Web 做规则检索，不改动任何既有战斗或点数逻辑。挂到 ``ctx.reference``。

- 规则速查：``rule(name)`` 取规则章节正文，``search_rules(kw)`` 关键词检索
- 装备检索：``gear(name)`` / ``gear_by_category(cat)`` / ``weapon(name)`` / ``armor(name)``
- 枚举翻译：``damage_type`` / ``magic_school`` / ``language`` / ``alignment`` /
  ``ability_score`` / ``skill`` / ``weapon_property``
- 职业与特性：``class_info`` / ``class_levels`` / ``feature(name)``
- 熟练：``proficiency(name)``
"""
from __future__ import annotations

from .core import Service
from .data_classes import CLASSES, CLASS_LEVELS, SUBCLASSES, FEATURES
from .data_equipment_srd import SRD_EQUIPMENT, WEAPON_PROPERTIES
from .data_proficiencies import PROFICIENCIES
from .data_reference import (
    ABILITY_SCORES, ALIGNMENTS, DAMAGE_TYPES, MAGIC_SCHOOLS,
    LANGUAGES, SRD_SKILLS, RULES, RULE_SECTIONS,
)

#: 查询名 -> 数据表（供 lookup 统一入口）
_TABLES = {
    "属性值": ABILITY_SCORES,
    "阵营": ALIGNMENTS,
    "伤害类型": DAMAGE_TYPES,
    "魔法学派": MAGIC_SCHOOLS,
    "语言": LANGUAGES,
    "技能": SRD_SKILLS,
    "规则": RULES,
    "规则章节": RULE_SECTIONS,
    "装备": SRD_EQUIPMENT,
    "武器属性": WEAPON_PROPERTIES,
    "熟练": PROFICIENCIES,
    "职业": CLASSES,
    "子职业": SUBCLASSES,
    "特性": FEATURES,
}


def _desc(rec: dict) -> str:
    """取出记录里的英文描述（list 或 str 统一为 str）。"""
    d = rec.get("desc_en")
    if isinstance(d, list):
        return "\n".join(d)
    return d or ""


class ReferenceService(Service):
    """SRD 规则与内容的只读检索能力。"""

    TABLES = _TABLES
    RULE_SECTIONS = RULE_SECTIONS
    SRD_EQUIPMENT = SRD_EQUIPMENT

    # ---------------- 通用 ----------------
    def kinds(self) -> list[str]:
        return list(self.TABLES)

    def lookup(self, kind: str, name: str) -> dict | None:
        return self.TABLES.get(kind, {}).get(name)

    def count(self, kind: str) -> int:
        return len(self.TABLES.get(kind, {}))

    def names(self, kind: str) -> list[str]:
        return list(self.TABLES.get(kind, {}))

    # ---------------- 规则速查 ----------------
    def rule(self, name: str) -> str:
        """取规则章节正文（英文官方原文）。"""
        rec = self.RULE_SECTIONS.get(name)
        return _desc(rec) if rec else ""

    def search_rules(self, keyword: str, limit: int = 8) -> list[str]:
        """在规则章节里做关键词检索（命中中文名、英文原名或正文）。"""
        kw = keyword.strip().lower()
        if not kw:
            return []
        hits = []
        for zh, rec in self.RULE_SECTIONS.items():
            hay = f"{zh} {rec.get('en', '')} {_desc(rec)}".lower()
            if kw in hay:
                hits.append(zh)
            if len(hits) >= limit:
                break
        return hits

    # ---------------- 装备 ----------------
    def gear(self, name: str) -> dict | None:
        return self.SRD_EQUIPMENT.get(name)

    def gear_by_category(self, cat: str) -> list[str]:
        """按中文分类（武器/护甲/冒险装备/工具…）列出条目名。"""
        return [k for k, v in self.SRD_EQUIPMENT.items() if v.get("cat") == cat]

    def gear_categories(self) -> list[str]:
        return sorted({v.get("cat") for v in self.SRD_EQUIPMENT.values()})

    def weapon(self, name: str) -> dict | None:
        """武器摘要：伤害骰/伤害类型/双手伤害/射程/属性/价格/重量。"""
        v = self.SRD_EQUIPMENT.get(name)
        if not v or v.get("cat") != "武器":
            return None
        return {
            "damage": v.get("damage"), "damage_type": v.get("damage_type"),
            "two_handed": v.get("two_handed"), "range": v.get("range"),
            "properties": v.get("properties"), "cost_gp": v.get("cost_gp"),
            "weight": v.get("weight"), "sub": v.get("sub"),
        }

    def armor(self, name: str) -> dict | None:
        """护甲摘要：AC/可否加敏捷/力量需求/隐匿劣势/价格/重量。"""
        v = self.SRD_EQUIPMENT.get(name)
        if not v or v.get("cat") != "护甲":
            return None
        return {
            "armor_class": v.get("armor_class"), "armor_dex": v.get("armor_dex"),
            "str_min": v.get("str_min"), "stealth_dis": v.get("stealth_dis"),
            "cost_gp": v.get("cost_gp"), "weight": v.get("weight"), "sub": v.get("sub"),
        }

    # ---------------- 职业 / 特性 ----------------
    def class_info(self, name: str) -> dict | None:
        return CLASSES.get(name)

    def class_levels(self, name: str) -> dict:
        return dict(CLASS_LEVELS.get(name, {}))

    def feature(self, name: str) -> dict | None:
        return FEATURES.get(name)

    # ---------------- 枚举翻译 ----------------
    def damage_type(self, name: str) -> dict | None:
        return DAMAGE_TYPES.get(name)

    def magic_school(self, name: str) -> dict | None:
        return MAGIC_SCHOOLS.get(name)

    def language(self, name: str) -> dict | None:
        return LANGUAGES.get(name)

    def alignment(self, name: str) -> dict | None:
        return ALIGNMENTS.get(name)

    def ability_score(self, name: str) -> dict | None:
        return ABILITY_SCORES.get(name)

    def skill(self, name: str) -> dict | None:
        return SRD_SKILLS.get(name)

    def weapon_property(self, name: str) -> dict | None:
        return WEAPON_PROPERTIES.get(name)

    def proficiency(self, name: str) -> dict | None:
        return PROFICIENCIES.get(name)
