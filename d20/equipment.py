"""d20.equipment - 装备系统服务（原 EquipmentMixin 改写）

装备来源两库合一（决策 M）：
- ``data.EQUIPMENT_LIBRARY``  手工库 41 件，带 D20 折算 CP 定价（既有行为不变）
- ``data_equipment_srd.SRD_EQUIPMENT``  SRD 权威库 237 件（v2.1 新增），
  提供伤害骰 / AC / 重量 / 官方价格；CP 由金币按 3×log10(金币+1) 折算（1–30 封顶）。

``resolve()`` 把两库统一为同构 7 元组（与 TS 端同名方法 1:1），因此护甲加值、
敏捷上限、灵巧判定、伤害骰解析等逻辑对两库一致生效。护甲/盾牌的技能熟练要求
可由**职业装备熟练**（ClassService，可选增强）或种族特性豁免。挂到 ``ctx.equipment``。
"""
from __future__ import annotations

import math
import re

from .core import Service
from .data import EQUIPMENT_LIBRARY, ARMOR_PROFICIENCY, FINESSE_WEAPONS
from .data_equipment_srd import SRD_EQUIPMENT

#: 装备类型与甲种
T_WEAPON, T_ARMOR, T_SHIELD = "武器", "护甲", "盾牌"
T_LIGHT, T_MEDIUM, T_HEAVY = "轻甲", "中甲", "重甲"


def srd_cp_cost(cost_gp: float) -> int:
    """SRD 装备的 CP 折算（决策 M）：3×log10(金币+1)，下限 1、上限 30。

    标定：长剑 15gp → 4 CP（手工库 5），全身板甲 1500gp → 10 CP（手工库 15），
    匕首 2gp → 1 CP（手工库 2）——量级对齐，且对高价物品做对数压缩，
    避免金币价格线性放大到不可购买。
    """
    return max(1, min(30, round(3 * math.log10(max(cost_gp, 0.0) + 1))))


class EquipmentService(Service):
    """装备相关能力。"""

    EQUIPMENT_LIBRARY = EQUIPMENT_LIBRARY
    ARMOR_PROFICIENCY = ARMOR_PROFICIENCY
    FINESSE_WEAPONS = FINESSE_WEAPONS
    SRD_EQUIPMENT = SRD_EQUIPMENT

    # ---------- 统一解析：手工库优先，回退 SRD 库 ----------
    def _srd_tuple(self, name: str) -> tuple | None:
        """把 SRD 装备记录转换为与手工库同构的 7 元组。"""
        v = self.SRD_EQUIPMENT.get(name)
        if not v:
            return None
        cat = v.get("cat")
        sub = v.get("sub") or ""
        weight = v.get("weight") or 0
        cp = srd_cp_cost(v.get("cost_gp") or 0.0)
        if cat == T_WEAPON:
            dtype = "近战" if "近战" in sub else ("远程" if "远程" in sub else "近战")
            props = "、".join(v.get("properties") or [])
            desc = f"{v.get('damage')} {v.get('damage_type') or ''}".strip()
            if v.get("two_handed"):
                desc += f"，双手{v['two_handed']}"
            if props:
                desc += f"，{props}"
            return (T_WEAPON, dtype, 0, 99, weight, desc, cp)
        if cat == T_ARMOR:
            # 手工库的 armor_bonus 是「加值」；SRD 的 armor_class.base 是「总 AC」
            bonus = (v.get("armor_class") or 10) - 10
            max_dex = {"轻甲": 99, "中甲": 2, "重甲": 0}.get(sub, 99)
            desc = f"AC {v.get('armor_class')}"
            desc += " + 敏捷" if v.get("armor_dex") else "，无敏捷加值"
            if v.get("str_min"):
                desc += f"，需力量{v['str_min']}"
            if v.get("stealth_dis"):
                desc += "，隐匿劣势"
            return (T_ARMOR, sub, bonus, max_dex, weight, desc, cp)
        if cat == T_SHIELD:
            bonus = v.get("armor_class") or 2
            return (T_SHIELD, T_SHIELD, bonus, 99, weight, f"AC +{bonus} 盾牌加值", cp)
        return None

    def resolve(self, item_name: str) -> tuple | None:
        """统一解析装备 -> (type, sub, armor_bonus, max_dex, weight, desc, cp)。"""
        if item_name in self.EQUIPMENT_LIBRARY:
            return self.EQUIPMENT_LIBRARY[item_name]
        return self._srd_tuple(item_name)

    def equip_item(self, item_name: str) -> tuple[bool, str]:
        st = self.ctx.state
        info = self.resolve(item_name)
        if info is None:
            return False, "未知装备"
        etype, sub, _armor_b, max_dex, _weight, _desc, cp_cost = info

        # 护甲熟练度检查（山地矮人「免中甲熟练」、职业装备熟练均可豁免）
        if etype in (T_ARMOR, T_SHIELD):
            exempt = (st.race == "山地矮人" and sub == "中甲") or self._has_gear_prof(sub)
            if not exempt:
                req_skill = self.ARMOR_PROFICIENCY.get(sub)
                if req_skill and st.skills.get(req_skill, 0) < 1:
                    return False, f"需要 {req_skill} 至少1级才能装备{sub}"

        if st.cp < cp_cost:
            return False, f"CP不足，需要 {cp_cost} CP"

        st.cp -= cp_cost
        st.equipment.append(item_name)
        st.purchases += 1
        self._recalc_armor_bonus()
        self.ctx.emit("character/changed", "equipment")
        return True, f"装备了 {item_name}，消耗 {cp_cost} CP"

    def unequip_item(self, item_name: str) -> tuple[bool, str]:
        st = self.ctx.state
        if item_name not in st.equipment:
            return False, "未装备此物品"
        info = self.resolve(item_name)
        st.equipment.remove(item_name)
        cp_cost = info[6] if info else 0
        st.cp += cp_cost
        self._recalc_armor_bonus()
        return True, f"卸下了 {item_name}，返还 {cp_cost} CP"

    def _has_gear_prof(self, sub: str) -> bool:
        """职业装备熟练（ClassService 可选增强：未挂载时恒为 False）。

        「全部护甲」（战士/圣武士的 All armor）覆盖轻/中/重甲三个具体甲种。
        """
        if not self.ctx.has("classes"):
            return False
        profs = self.ctx.state.gear_proficiencies
        if sub in profs:
            return True
        return sub in (T_LIGHT, T_MEDIUM, T_HEAVY) and "全部护甲" in profs

    def _recalc_armor_bonus(self):
        """重新计算护甲总加值（含盾牌），并取最严格的敏捷上限。"""
        st = self.ctx.state
        total_armor = 0
        best_max_dex = 99
        for item in st.equipment:
            info = self.resolve(item)
            if info and info[0] in (T_ARMOR, T_SHIELD):
                total_armor += info[2]
                if info[3] < best_max_dex:
                    best_max_dex = info[3]
        st.armor_bonus = total_armor
        st._armor_max_dex = best_max_dex

    def _get_equipped_weapon(self) -> str:
        """获取当前装备的第一件武器名（徒手则返回 '徒手'）。"""
        st = self.ctx.state
        for item in st.equipment:
            info = self.resolve(item)
            if info and info[0] == T_WEAPON:
                return item
        return "徒手"

    def has_finesse_weapon(self) -> bool:
        """是否装备了灵巧武器（可用于偷袭判定）。

        手工库查 FINESSE_WEAPONS 集合；SRD 库查武器属性是否含「灵巧」。
        """
        st = self.ctx.state
        for w in st.equipment:
            info = self.resolve(w)
            if not info or info[0] != T_WEAPON:
                continue
            if w in self.FINESSE_WEAPONS:
                return True
            rec = self.SRD_EQUIPMENT.get(w)
            if rec and "灵巧" in (rec.get("properties") or []):
                return True
        return False

    # ---------- v2.1：SRD 装备检索 ----------
    def gear_info(self, name: str) -> dict | None:
        """查 SRD 装备原始记录（含伤害骰/AC/价格/重量/分类）。"""
        return self.SRD_EQUIPMENT.get(name)

    def gear_categories(self) -> list[str]:
        return sorted({v.get("cat") for v in self.SRD_EQUIPMENT.values() if v.get("cat")})

    def gear_by_category(self, cat: str) -> list[str]:
        return [k for k, v in self.SRD_EQUIPMENT.items() if v.get("cat") == cat]

    def parse_damage(self, expr: str) -> tuple[int, int]:
        """解析伤害骰表达式 '2d6' -> (2, 6)；无法解析返回 (0, 0)。"""
        m = re.match(r"^\s*(\d*)\s*d\s*(\d+)\s*$", expr or "")
        return (int(m.group(1) or 1), int(m.group(2))) if m else (0, 0)
