"""roleplayer.classes - 职业系统服务（决策 G 递增标价 / 决策 L 创建期选择）

D&D 5e SRD 12 职业：创建期选择职业（1 级免费），之后逐级用 CP 购买（递增标价）。
职业授予三类熟练（决策 H 三轨）并驱动生命骰、施法者等级与特性表：

- 技能熟练（职业自选池）    -> ``state.proficiencies``（+2 有效等级，与种族/背景同机制）
- 装备熟练（武器/护甲/工具）-> ``state.gear_proficiencies``（``equipment`` 校验时豁免技能要求）
- 豁免熟练                -> ``state.save_proficiencies``（``derived.save_bonus`` +2）

被依赖方（slots / rest / equipment / derived）一律以 ``ctx.has("classes")`` 做
**可选增强**：卸载本服务后它们自动回落到原有行为，不会崩——与 Cordis 的
「卸载即失效」语义一致。挂到 ``ctx.classes``。
"""
from __future__ import annotations

import math

from .core import Service
from .data import (
    CLASS_LEVEL_COST_BRACKETS, CLASS_LEVEL_MAX, PROFICIENCY_BONUS, SUBCLASS_MIN_LEVEL,
)
from .data_classes import CLASSES, CLASS_LEVELS, SUBCLASSES, FEATURES


def level_up_cost(level: int) -> int:
    """购买第 ``level`` 级所需 CP（level 从 1 起；1 级为 0 CP）。"""
    for low, high, price in CLASS_LEVEL_COST_BRACKETS:
        if low <= level <= high:
            return price
    return 0


def cumulative_cost(level: int) -> int:
    """从 1 级升到 ``level`` 级的累计 CP。"""
    return sum(level_up_cost(lv) for lv in range(1, level + 1))


class ClassService(Service):
    """职业选择与等级成长能力。"""

    CLASSES = CLASSES
    CLASS_LEVELS = CLASS_LEVELS
    SUBCLASSES = SUBCLASSES
    FEATURES = FEATURES

    # ---------------- 选择 / 升级 ----------------
    def set_class(self, name: str, choices: list[str] | None = None) -> tuple[bool, str]:
        """创建期选择职业（1 级免费）。choices 指定自选熟练技能。"""
        st = self.ctx.state
        if name not in self.CLASSES:
            return False, f"未知职业: {name}"
        if st.cls:
            return False, f"已选择职业: {st.cls}"
        # 决策 L：创建期限定（与种族/背景一致）
        if st.purchases > 0:
            return False, "职业仅可在创建期（未购买任何内容前）选择"

        tpl = self.CLASSES[name]
        st.cls = name
        st.level = 1
        st.subclass = ""
        self._apply_proficiencies(tpl, choices)
        self.ctx.emit("character/changed", "class")
        picked = [s for s in st.proficiencies if s in (tpl.get("skill_choices") or [])]
        return True, (f"选择职业 {name}（1 级，免费）；"
                      f"熟练技能: {'/'.join(picked) or '无'}；"
                      f"生命骰 d{tpl['hit_die']}")

    def _apply_proficiencies(self, tpl: dict, choices: list[str] | None) -> None:
        """写入职业熟练（技能/装备/豁免三轨）。"""
        st = self.ctx.state
        pool = tpl.get("skill_choices") or []
        picks = [s for s in (choices or []) if s in pool][: tpl.get("skill_choice_count", 0)]
        if len(picks) < tpl.get("skill_choice_count", 0):
            picks += [s for s in pool if s not in picks][: tpl.get("skill_choice_count", 0) - len(picks)]
        for s in picks + list(tpl.get("skill_profs") or []):
            if s not in st.proficiencies:
                st.proficiencies.append(s)
        for g in tpl.get("gear_profs") or []:
            if g not in st.gear_proficiencies:
                st.gear_proficiencies.append(g)
        for sv in tpl.get("saves") or []:
            if sv not in st.save_proficiencies:
                st.save_proficiencies.append(sv)

    def level_up(self) -> tuple[bool, str]:
        """提升一级职业等级（付 CP）。"""
        st = self.ctx.state
        if not st.cls:
            return False, "尚未选择职业"
        nxt = st.level + 1
        if nxt > CLASS_LEVEL_MAX:
            return False, f"职业等级已达上限 {CLASS_LEVEL_MAX}"
        cost = level_up_cost(nxt)
        if st.cp < cost:
            return False, f"CP不足，升至 {nxt} 级需要 {cost} CP，当前剩余 {st.cp} CP"
        st.cp -= cost
        st.level = nxt
        st.purchases += 1
        self.ctx.emit("character/changed", "class-level")
        gained = self.features_at(nxt)
        return True, (f"{st.cls} 升至 {nxt} 级，消耗 {cost} CP；"
                      f"新增特性: {'/'.join(gained) or '无'}")

    def level_to(self, target: int) -> tuple[bool, str]:
        """连续升级到目标等级；任一级失败即整体失败（不产生部分扣费）。"""
        st = self.ctx.state
        if not st.cls:
            return False, "尚未选择职业"
        if target <= st.level:
            return False, f"目标等级 {target} 未高于当前 {st.level} 级"
        if target > CLASS_LEVEL_MAX:
            return False, f"职业等级上限为 {CLASS_LEVEL_MAX}"
        total = cumulative_cost(target) - cumulative_cost(st.level)
        if st.cp < total:
            return False, f"CP不足，升至 {target} 级共需 {total} CP，当前剩余 {st.cp} CP"
        st.cp -= total
        st.level = target
        st.purchases += 1
        self.ctx.emit("character/changed", "class-level")
        return True, f"{st.cls} 升至 {target} 级，消耗 {total} CP"

    def set_subclass(self, name: str) -> tuple[bool, str]:
        """选择子职业（需职业等级 >= SUBCLASS_MIN_LEVEL）。"""
        st = self.ctx.state
        if not st.cls:
            return False, "尚未选择职业"
        if name not in self.SUBCLASSES:
            return False, f"未知子职业: {name}"
        if self.SUBCLASSES[name]["class"] != st.cls:
            return False, f"{name} 不属于 {st.cls}"
        if st.level < SUBCLASS_MIN_LEVEL:
            return False, f"需要 {st.cls} 等级 >= {SUBCLASS_MIN_LEVEL} 才能选择子职业"
        if st.subclass:
            return False, f"已选择子职业: {st.subclass}"
        st.subclass = name
        self.ctx.emit("character/changed", "subclass")
        return True, f"{st.cls} 选择子职业 {name}"

    # ---------------- 查询 ----------------
    def info(self, name: str | None = None) -> dict | None:
        return self.CLASSES.get(name or self.ctx.state.cls)

    def level_data(self, level: int | None = None) -> dict:
        """当前职业在指定等级的成长记录（特性/熟练加值/施法位/职业专属数值）。"""
        st = self.ctx.state
        if not st.cls:
            return {}
        lv = level or st.level
        return self.CLASS_LEVELS.get(st.cls, {}).get(lv, {})

    def hit_die(self) -> int:
        """职业生命骰面数（d6/d8/d10/d12）；无职业回退 6。"""
        tpl = self.info()
        return tpl["hit_die"] if tpl else 6

    def prof_bonus(self) -> int:
        """当前等级的熟练加值（SRD 官方表，直接取权威数据）。"""
        return self.level_data().get("prof_bonus", 0)

    def caster_level(self) -> int:
        """用于环位前置判定的施法者等级（full=等级 / half=等级的一半向上取整 /
        pact=等级 / none=0）。"""
        tpl = self.info()
        if not tpl or not tpl.get("spellcasting"):
            return 0
        lv = self.ctx.state.level
        prog = tpl["spellcasting"]["progression"]
        if prog == "full":
            return lv
        if prog == "half":
            return math.ceil(lv / 2)
        if prog == "pact":
            return lv
        return 0

    def max_ring(self) -> int:
        """当前职业等级能买到的最高法术环位（0 表示无施法能力）。"""
        tpl = self.info()
        if not tpl or not tpl.get("spellcasting"):
            return 0
        lv = self.ctx.state.level
        prog = tpl["spellcasting"]["progression"]
        if prog == "full":
            return min(9, (lv + 1) // 2)
        if prog == "half":
            return min(5, (math.ceil(lv / 2) + 1) // 2)
        if prog == "pact":                       # 契约魔法：环位随等级但封顶 5 环
            return min(5, math.ceil(lv / 2))
        return 0

    def spell_slots(self) -> dict:
        """当前等级的官方法术位表 {环位: 数量}。"""
        sp = self.level_data().get("spellcasting")
        return dict(sp.get("slots", {})) if sp else {}

    def class_specific(self) -> dict:
        """当前等级的职业专属数值（狂暴次数/偷袭骰/气点/武艺骰…）。"""
        return dict(self.level_data().get("class_specific") or {})

    def features_at(self, level: int) -> list[str]:
        """指定等级新增的特性名（中文）。"""
        st = self.ctx.state
        if not st.cls:
            return []
        return list(self.CLASS_LEVELS.get(st.cls, {}).get(level, {}).get("features", []))

    def features(self, upto: int | None = None) -> list[str]:
        """累计到 upto（默认当前等级）为止的全部特性名（中文，按等级升序去重）。"""
        st = self.ctx.state
        if not st.cls:
            return []
        top = upto or st.level
        out: list[str] = []
        for lv in range(1, top + 1):
            for f in self.features_at(lv):
                if f not in out:
                    out.append(f)
        if st.subclass:
            for f in self.SUBCLASSES.get(st.subclass, {}).get("features", []):
                if f not in out:
                    out.append(f)
        return out

    def feature_detail(self, name: str) -> dict | None:
        """按中文名查特性详情（所属职业/子职业/等级/官方描述）。"""
        return self.FEATURES.get(name)

    def has_gear_prof(self, gear: str) -> bool:
        """是否拥有指定装备熟练（供 equipment 免除技能需求）。"""
        return gear in self.ctx.state.gear_proficiencies

    def has_save_prof(self, save_skill: str) -> bool:
        """是否拥有指定豁免熟练（供 derived 叠加熟练加值）。"""
        return save_skill in self.ctx.state.save_proficiencies

    def save_bonus_adjust(self, save_skill: str) -> int:
        """职业豁免熟练对豁免加值的贡献（决策 H：+PROFICIENCY_BONUS）。"""
        return PROFICIENCY_BONUS if self.has_save_prof(save_skill) else 0

    def summary(self) -> str:
        """角色卡用的一行摘要。"""
        st = self.ctx.state
        if not st.cls:
            return "无职业"
        s = f"{st.cls} {st.level} 级"
        if st.subclass:
            s += f"（{st.subclass}）"
        return s
