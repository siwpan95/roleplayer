"""troupe.ruleset_coc - Call of Cthulhu (d100) 规则适配器

判定语义（掷低，d100）
----------------------
    1d100 ≤ 有效技能% + 情境修正  →  成功

这是验证「**换规则世界层一行不动**」的最强证据：CoC 与 D&D/GURPS 复用**同一张**
融合角色卡，只是把卡上存的「绝对有效等级」重新解释成 d100 阈值——

    D&D  ：等级 = 加值（d20 + 等级 vs DC）
    GURPS：等级 = 掷骰上限（3d6 ≤ 等级）
    CoC  ：等级×5 = d100 阈值（掷低，1d100 ≤ 等级×5）

因此一个为 D&D 建的角色，切到 CoC 规则集立刻能用，无需重建卡、不破坏存档。

许可边界
--------
只采用 CoC 的**结构性公开事实**（d100 掷低、难度分档、大成功/大失败区间、SAN/HP/MP
池），不搬运任何版权数据表；具体阈值采用自研近似映射，已在 ``blurb`` / 注释中标注。
"""
from __future__ import annotations

from typing import Any

from d20.data import ATTRIBUTES

from .contracts import CheckRequest, CheckResult
from .ruleset import RulesetAdapter, register_ruleset


#: 难度档 → 阈值修正（掷低型：+ 更易，− 更难）
TIER_MOD_COC = {
    " trivial": 0, "极易": 40, "容易": 20, "普通": 0,
    "困难": -20, "极难": -40, "不可能": -50,
}
#: 兜底（未知档按普通）
_DEFAULT_MOD = 0


@register_ruleset
class CocRuleset(RulesetAdapter):
    """Call of Cthulhu (d100) 规则适配器（掷低）。"""

    id = "coc"
    name = "Call of Cthulhu (d100)"
    blurb = "1d100 ≤ 技能% + 修正；含大成功（≤5 或 ≤技能/20）与大失败（≥96）。"

    # ------------------------------------------------------------------ #
    #  难度
    # ------------------------------------------------------------------ #
    def dc_for(self, tier: str) -> int:
        """掷低型规则无 DC 概念，返回 0（难度由 ``modifier_for`` 表达）。"""
        return 0

    def modifier_for(self, tier: str) -> int:
        return TIER_MOD_COC.get(tier, _DEFAULT_MOD)

    # ------------------------------------------------------------------ #
    #  等级（把融合卡上的「绝对有效等级」按 CoC 语义放大为 %）
    # ------------------------------------------------------------------ #
    def _pct_of(self, char: Any, request: CheckRequest) -> int:
        key = request.key or ""
        if request.kind == "attribute" and key in ATTRIBUTES:
            return min(99, max(1, int(char.state.attributes[key]) * 5))
        if request.kind == "save":
            base = char.state.attributes.get(key if key in ATTRIBUTES else "体质", 10)
            return min(99, max(1, int(base) * 5))
        # 技能：融合卡存的等级 ×5 当作 d100 阈值（近似，便于跨规则统一）
        return min(99, max(1, self.rank_of(char, key) * 5))

    def rank_of(self, actor: Any, key: str) -> int:
        char = self._unwrap(actor)
        if key in ATTRIBUTES:
            return int(char.state.attributes[key])
        return int(char.ctx.skills.effective_skill_rank(key))

    # ------------------------------------------------------------------ #
    #  核心检定
    # ------------------------------------------------------------------ #
    def check(self, actor: Any, request: CheckRequest) -> CheckResult:
        char = self._unwrap(actor)
        rnd = self._rand()
        base = self._pct_of(char, request)
        tier_mod = self.modifier_for(request.tier) if request.dc is None else 0
        target = max(1, min(99, base + request.modifier + tier_mod))

        roll = rnd.randint(1, 100)

        # 大成功：掷 ≤5，或技能较低时 ≤ 技能/20（CoC 常见变体）
        crit_success = roll <= 5 or (target < 50 and roll <= max(1, target // 20))
        # 大失败：96–00（高技能时仅在 ≥100−技能/20 才失败）
        crit_fail = roll >= 96
        if target >= 50:
            crit_fail = roll >= 100

        if crit_success:
            success, critical = True, "crit"
        elif crit_fail:
            success, critical = False, "crit_fail"
        else:
            success, critical = roll <= target, ""

        margin = target - roll
        mod_parts = []
        if request.modifier:
            mod_parts.append(f"{request.modifier:+d}")
        if tier_mod:
            mod_parts.append(f"{tier_mod:+d}({request.tier})")
        mod_tag = "".join(mod_parts) or "0"
        crit_tag = {"crit": "（大成功！）", "crit_fail": "（大失败！）", "": ""}[critical]
        text = (f"{request.label or request.key or request.kind}："
                f"d100={roll} vs {base}[{mod_tag}]={target} → "
                f"{'成功' if success else '失败'}{crit_tag}")
        return CheckResult(
            success=success, critical=critical, margin=margin,
            roll=roll, dice=[roll], total=target, target=target, text=text,
            data={"ruleset": self.id, "level": base, "effective": target,
                  "kind": request.kind, "key": request.key},
        )

    # ------------------------------------------------------------------ #
    #  角色视图
    # ------------------------------------------------------------------ #
    def defense_of(self, actor: Any) -> int:
        """CoC 闪避（Dodge）近似：敏捷%的一半。"""
        char = self._unwrap(actor)
        return max(1, int(char.state.attributes["敏捷"]) * 5 // 2)

    def hp_of(self, actor: Any) -> tuple[int, int]:
        char = self._unwrap(actor)
        return char.ctx.rest.current_hp(), char.hp()

    def set_hp(self, actor: Any, value: int) -> int:
        char = self._unwrap(actor)
        char.state.current_hp = max(0, min(int(value), char.hp()))
        return char.state.current_hp

    def damage(self, actor: Any, amount: int, dtype: str = "钝击") -> dict:
        char = self._unwrap(actor)
        before = char.ctx.rest.current_hp()
        applied = max(1, int(amount))
        char.ctx.rest.take_damage(applied, dtype)
        after = char.ctx.rest.current_hp()
        return {"target": self._id_of(actor), "amount": before - after,
                "dtype": dtype, "hp": after, "max_hp": char.hp(),
                "down": after <= 0}

    def heal(self, actor: Any, amount: int) -> int:
        char = self._unwrap(actor)
        before = char.ctx.rest.current_hp()
        char.ctx.rest.heal(int(amount))
        return char.ctx.rest.current_hp() - before

    def rest(self, actor: Any, kind: str = "short") -> dict:
        """CoC 恢复：短时休整恢复 1 点 HP；整夜睡眠按体质/10 恢复。"""
        char = self._unwrap(actor)
        ht = char.state.attributes["体质"]
        if kind == "long":
            amount, minutes = max(1, ht // 10), 480
        else:
            amount, minutes = 1, 60
        gained = self.heal(char, amount)
        return {"kind": kind, "healed": gained, "minutes": minutes,
                "hp": char.ctx.rest.current_hp(), "max_hp": char.hp()}

    def describe(self, actor: Any) -> str:
        char = self._unwrap(actor)
        cur, mx = self.hp_of(char)
        dex = char.state.attributes["敏捷"] * 5 // 2
        return (f"{char.state.cls or '调查员'} HP {cur}/{mx} "
                f"闪避 {dex}（STR{char.state.attributes['力量']}/"
                f"DEX{char.state.attributes['敏捷']}/"
                f"INT{char.state.attributes['智力']}/"
                f"CON{char.state.attributes['体质']}）")

    def actor_view(self, actor: Any) -> dict:
        char = self._unwrap(actor)
        st = char.state
        cur, mx = self.hp_of(char)
        return {
            "id": getattr(actor, "id", ""), "name": getattr(actor, "name", ""),
            "ruleset": self.id,
            "cls": st.cls, "level": max(st.level, 1), "race": st.race,
            "hp": cur, "max_hp": mx, "defense": self.defense_of(char),
            "attributes": {k: int(v) * 5 for k, v in st.attributes.items()},
            "skills": {k: self.rank_of(char, k) * 5 for k in st.skills},
            "conditions": list(st.conditions),
        }

    # ------------------------------------------------------------------ #
    #  战斗：复用 d20.battle（角色卡 HP/AC 与规则集无关）
    # ------------------------------------------------------------------ #
    def to_combatant(self, actor: Any):
        return None

    def xp_for(self, threat: Any) -> int:
        table = {"微弱": 1, "普通": 2, "丰厚": 3, "巨富": 5}
        return table.get(str(threat), 1)

    def resolve_attack(self, attacker: Any, defender: Any,
                       weapon: str | None = None, modifier: int = 0) -> dict:
        """CoC 单次攻击：命中检定（d100 ≤ 技能%）→ 目标闪避 → 伤害。"""
        atk = self._unwrap(attacker)
        dfs = self._unwrap(defender)
        rnd = self._rand()
        melee = not (weapon and "远程" in str(weapon))
        hit = self.check(atk, CheckRequest(
            actor=self._id_of(attacker), kind="skill",
            key="近战攻击" if melee else "远程攻击",
            modifier=modifier, label=f"{self._name_of(attacker)}的攻击"))
        out = {"hit": False, "crit": hit.critical == "crit", "roll": hit.roll,
               "defense": 0, "damage": 0, "text": hit.text}
        if not hit.success:
            out["text"] += " → 未命中"
            return out
        defense = self.defense_of(dfs)
        droll = rnd.randint(1, 100)
        out["defense"] = defense
        if droll <= defense:
            out["text"] += f" → 目标闪避成功（d100={droll} ≤ {defense}）"
            return out
        out["hit"] = True
        dmg = max(1, rnd.randint(1, 6) + 1)   # 近似 : 1d6+1
        out["damage"] = dmg
        out["text"] += (f" → 命中（目标闪避失败 d100={droll} > {defense}），"
                        f"造成 {dmg} 点伤害")
        return out


__all__ = ["CocRuleset", "TIER_MOD_COC"]
