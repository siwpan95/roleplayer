"""troupe.character_gurps - GURPS 4e 角色点经济（点数购买支柱）

GURPS 的「角色构建」本质是**点数预算**：150 点（默认）买到属性、优缺点、技能、HP/FP/DR。
本模块把这套结构性规则实现成可计算、可构建的模型，证明 GURPS 不只是「另一套检定」，
而是和 D&D 的「等级 + 熟练」并列的一套**完整的角色构建经济学**。

成本锚点（Basic Set 结构性公开事实）
----------------------------------
* 属性 ST/DX/IQ/HT：每点 10 点（基准 10 为 0 点；低于 10 返还点数）。
* HP：等于 ST 时免费，每额外 1 点 +2 点；FP：等于 HT 时免费，每额外 1 点 +3 点。
* 技能：见 ``data_world.gurps_skill_cost``（1 点掌握；+1 → 2；+2 → 4；之后每级 +4）。
* 优缺点：下表（代表性子集，均为结构性公开的通用优缺点，非逐格数据）。

许可边界：只采用公开的成本结构；具体优缺点表为**自研代表性子集**，便于模拟器内部平衡，
不搬运 Basic Set 的逐条优缺点清单。
"""
from __future__ import annotations

from typing import Any, Optional

from .data_world import gurps_skill_cost, basic_speed, basic_move, dodge as gurps_dodge

#: 每点属性成本（ST/DX/IQ/HT 同价）
ATTRIBUTE_COST_PER = 10

#: 代表性优点表（名 → 点数）。2026-08-30 联网核对：Magery 拆分三档
#: （官方：Magery 0 = 5 点无加值；Magery 1 起 10 点/级）；语言天才按官方 10 点修正。
ADVANTAGES: dict[str, int] = {
    "警觉": 5, "夜视": 1, "绝对方向感": 5, "快速治疗": 5,
    "天生攻击（爪）": 3,  # GURPS Claws：钝爪 3/尖爪 5/钩爪 8（本仓按钝爪档） "战斗反射": 15, "高阶武艺": 25,
    "强韧": 10, "意志坚定": 5, "语言天才": 10, "财富（小康）": 10,
    "魔法天赋0级": 5,   # Magery 0：可感知魔力/无施法加值（官方 5 点）
    "魔法天赋1级": 10,  # Magery 1：施法 +1（官方 10 点/级）
    "魔法天赋2级": 20,  # Magery 2：施法 +2
}

#: 代表性缺点表（名 → 点数，负值；购买后返还点数）
DISADVANTAGES: dict[str, int] = {
    "贪财": -5, "冲动": -10, "鲁莽": -10, "独行": -5,
    "惧高": -10, "酗酒": -5, "守财奴": -5, "话痨": -5,
    "残疾（一目）": -15, "宿敌": -5, "义务（少量）": -5,
}


def attribute_point_cost(value: int) -> int:
    """属性点成本 = (值 - 10) × 10（低于 10 为负，即返还点数）。"""
    return (int(value) - 10) * ATTRIBUTE_COST_PER


def hp_point_cost(hp: int, st: int) -> int:
    return max(0, int(hp) - int(st)) * 2


def fp_point_cost(fp: int, ht: int) -> int:
    return max(0, int(fp) - int(ht)) * 3


def gurps_point_total(*, st: int, dx: int, iq: int, ht: int,
                      hp: Optional[int] = None, fp: Optional[int] = None,
                      advantages: Optional[list] = None,
                      disadvantages: Optional[list] = None,
                      skills: Optional[dict] = None) -> int:
    """计算一个 GURPS 角色的总点数支出。

    :param skills: ``{技能名: 相对基础属性的等级 +n}``（用于 ``gurps_skill_cost``）。
    """
    total = (attribute_point_cost(st) + attribute_point_cost(dx)
             + attribute_point_cost(iq) + attribute_point_cost(ht))
    total += hp_point_cost(hp if hp is not None else st, st)
    total += fp_point_cost(fp if fp is not None else ht, ht)
    for a in (advantages or []):
        total += int(ADVANTAGES.get(a, 0))
    for d in (disadvantages or []):
        total += int(DISADVANTAGES.get(d, 0))
    for rel in (skills or {}).values():
        total += gurps_skill_cost(int(rel))
    return total


def advantage_names() -> list[str]:
    return sorted(ADVANTAGES)


def disadvantage_names() -> list[str]:
    return sorted(DISADVANTAGES)


def derive_gurps_view(st: int, dx: int, iq: int, ht: int, hp: Optional[int] = None,
                      fp: Optional[int] = None) -> dict:
    """返回 GURPS 派生值速览（供角色卡展示）。"""
    hp = hp if hp is not None else st
    fp = fp if fp is not None else ht
    return {
        "ST": st, "DX": dx, "IQ": iq, "HT": ht,
        "HP": hp, "FP": fp,
        "BasicSpeed": basic_speed(dx, ht),
        "BasicMove": basic_move(dx, ht),
        "Dodge": gurps_dodge(dx, ht),
        "points": gurps_point_total(st=st, dx=dx, iq=iq, ht=ht, hp=hp, fp=fp),
    }


def build_gurps_character(attrs: dict, *, advantages: Optional[list] = None,
                          disadvantages: Optional[list] = None,
                          skills: Optional[dict] = None,
                          seed: int = 0, level: int = 1, name: str = "冒险者") -> Any:
    """用 GURPS 点经济构建一张角色卡（融合设定：底层仍是 ``d20.Character``）。

    六维属性直接写入角色卡；优缺点与技能等级存入 ``state.flags``，供 ``ruleset.points_of``
    随时回算总点数。返回 ``(Character, point_total)``。
    """
    from d20 import Character

    char = Character.random(level, seed=seed)
    char.state.attributes.update({k: int(v) for k, v in attrs.items()})
    char.state.flags = dict(getattr(char.state, "flags", {}) or {})
    char.state.flags["gurps_advantages"] = list(advantages or [])
    char.state.flags["gurps_disadvantages"] = list(disadvantages or [])
    char.state.flags["gurps_skills"] = {k: int(v) for k, v in (skills or {}).items()}
    if name:
        char.state.cls = name
    st = int(attrs.get("力量", 10)); dx = int(attrs.get("敏捷", 10))
    iq = int(attrs.get("智力", 10)); ht = int(attrs.get("体质", 10))
    # 魔法天赋(Magery)等级来自优点列表（0/1/2 级取最高）；疲劳点 FP 默认 = HT（GURPS 结构性事实），供法术系统消耗
    _magery_levels = {"魔法天赋0级": 0, "魔法天赋1级": 1, "魔法天赋2级": 2}
    magery = max([_magery_levels.get(a, 0) for a in (advantages or [])] or [0])
    char.state.flags["gurps_magery"] = magery
    char.state.flags["gurps_fp"] = ht
    char.state.flags["gurps_fp_max"] = ht
    char.state.flags["gurps_spells"] = {}
    pts = gurps_point_total(st=st, dx=dx, iq=iq, ht=ht,
                            advantages=advantages, disadvantages=disadvantages,
                            skills=skills)
    char.state.flags["gurps_points"] = pts
    char.state.flags["gurps_derived"] = derive_gurps_view(st, dx, iq, ht)
    return char, pts


__all__ = [
    "ATTRIBUTE_COST_PER", "ADVANTAGES", "DISADVANTAGES",
    "attribute_point_cost", "hp_point_cost", "fp_point_cost", "gurps_point_total",
    "advantage_names", "disadvantage_names", "derive_gurps_view",
    "build_gurps_character",
]
