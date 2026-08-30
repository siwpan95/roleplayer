"""troupe.ruleset_dnd5e - D&D 5e（SRD 5.1）规则适配器

判定语义
--------
    d20 + 加值 ≥ DC  →  成功
    自然 20 = 大成功（必中，伤害骰翻倍）；自然 1 = 大失败（必失手）
    优势/劣势：掷两颗 d20，取较高 / 较低

难度等级取 SRD 5.1 公开的「典型难度等级」表（5/10/15/20/25/30，CC-BY-4.0）。

加值来源（沿用 ``d20`` 既有服务，保证与 v2.x 角色卡完全一致）：
    技能      ctx.skills.effective_skill_rank(技能名)
    属性      d20.data.ability_mod(属性值)
    豁免      ctx.derived.save_bonus(fort/ref/will)
    攻击      ctx.derived.attack_bonus(melee)
    防御      ctx.derived.ac
"""
from __future__ import annotations

from typing import Any

from d20.data import ability_mod, ATTRIBUTES
from d20.dice import weapon_dice

from .contracts import CheckRequest, CheckResult
from .data_world import TIER_DC_DND5E
from .ruleset import RulesetAdapter, register_ruleset


#: 豁免别名（中英文 / 属性名 → 三档）
SAVE_ALIASES = {
    "fort": "fort", "强韧": "fort", "fortitude": "fort", "体质": "fort",
    "ref": "ref", "反射": "ref", "reflex": "ref", "敏捷": "ref",
    "will": "will", "意志": "will", "感知": "will",
}

#: D&D 伤害类型 → 本项目的规范化中文类型（与 d20.data_battle.normalize_damage_type 对齐）
_DTYPE_ALIAS = {
    "火": "火焰", "寒": "寒冷", "电": "闪电", "酸": "酸蚀", "毒": "毒素",
    "穿刺": "穿刺", "挥砍": "挥砍", "钝击": "钝击",
}


@register_ruleset
class Dnd5eRuleset(RulesetAdapter):
    """D&D 5e 规则适配器（掷高）。"""

    id = "dnd5e"
    name = "D&D 5e（SRD 5.1）"
    blurb = "d20 + 加值 ≥ DC；含优势/劣势、自然 20 大成功、六维属性与三档豁免。"

    # ------------------------------------------------------------------ #
    #  核心检定
    # ------------------------------------------------------------------ #
    def check(self, actor: Any, request: CheckRequest) -> CheckResult:
        char = self._unwrap(actor)
        rnd = self._rand()
        dc = request.dc if request.dc is not None else self.dc_for(request.tier)
        bonus = self._bonus_of(char, request)

        if request.advantage == 0:
            roll = rnd.randint(1, 20)
            dice = [roll]
        else:
            a, b = rnd.randint(1, 20), rnd.randint(1, 20)
            dice = sorted([a, b], reverse=(request.advantage > 0))
            roll = dice[0]

        total = roll + bonus + request.modifier
        raw = dice[0]

        critical = ""
        if raw == 20:
            critical = "crit"
        elif raw == 1:
            critical = "crit_fail"

        if critical == "crit":
            success, margin = True, max(1, total - dc)
        elif critical == "crit_fail":
            success, margin = False, total - dc
        else:
            success, margin = total >= dc, total - dc

        adv_tag = {1: " [优势]", -1: " [劣势]", 0: ""}[request.advantage]
        mod_tag = f"{request.modifier:+d}" if request.modifier else ""
        text = (
            f"{request.label or request.key or request.kind}："
            f"d20{adv_tag}{'+' + str(bonus) if bonus else ''}{mod_tag}"
            f" = {roll}{'+' + str(bonus) if bonus else ''}{mod_tag} = {total} vs DC {dc}"
            f" → {'成功' if success else '失败'}"
            + ("（大成功）" if critical == "crit" else "（大失败）" if critical == "crit_fail" else "")
        )
        return CheckResult(
            success=success, critical=critical, margin=margin,
            roll=roll, dice=dice, total=total, target=dc, text=text,
            data={"ruleset": self.id, "bonus": bonus, "dc": dc,
                  "kind": request.kind, "key": request.key},
        )

    def _bonus_of(self, char: Any, request: CheckRequest) -> int:
        """按检定种类取 d20 加值。"""
        ctx = getattr(char, "ctx", None)
        key = request.key or ""
        if request.kind == "attribute":
            if key in ATTRIBUTES:
                return ability_mod(char.state.attributes[key])
            return self.rank_of(char, key)
        if request.kind == "save":
            axis = SAVE_ALIASES.get(key, "")
            if not axis:
                raise ValueError(f"无法识别的豁免类型: {key}")
            return ctx.derived.save_bonus(axis)
        if request.kind == "attack":
            melee = "远程" not in key
            return ctx.derived.attack_bonus(melee=melee)
        # skill / reaction / contest：一律走技能有效等级
        return self.rank_of(char, key)

    # ------------------------------------------------------------------ #
    #  难度
    # ------------------------------------------------------------------ #
    def dc_for(self, tier: str) -> int:
        return TIER_DC_DND5E[tier]

    def modifier_for(self, tier: str) -> int:
        """掷高型规则用 DC 表达难度，不额外给修正。"""
        return 0

    # ------------------------------------------------------------------ #
    #  角色视图
    # ------------------------------------------------------------------ #
    def rank_of(self, actor: Any, key: str) -> int:
        char = self._unwrap(actor)
        if key in ATTRIBUTES:
            return ability_mod(char.state.attributes[key])
        return char.ctx.skills.effective_skill_rank(key)

    def defense_of(self, actor: Any) -> int:
        """D&D：防御 = AC。"""
        return self._unwrap(actor).ctx.derived.ac

    def hp_of(self, actor: Any) -> tuple[int, int]:
        char = self._unwrap(actor)
        return char.ctx.rest.current_hp(), char.hp()

    def set_hp(self, actor: Any, value: int) -> int:
        char = self._unwrap(actor)
        char.state.current_hp = max(0, min(int(value), char.hp()))
        return char.state.current_hp

    def damage(self, actor: Any, amount: int, dtype: str = "钝击") -> dict:
        char = self._unwrap(actor)
        canon = _DTYPE_ALIAS.get(dtype, dtype)
        before = char.ctx.rest.current_hp()
        note = char.ctx.rest.take_damage(int(amount), canon)
        after = char.ctx.rest.current_hp()
        return {"target": self._id_of(actor), "amount": before - after,
                "dtype": canon, "hp": after, "max_hp": char.hp(),
                "down": after <= 0, "note": note}

    def heal(self, actor: Any, amount: int) -> int:
        char = self._unwrap(actor)
        before = char.ctx.rest.current_hp()
        char.ctx.rest.heal(int(amount))
        return char.ctx.rest.current_hp() - before

    def rest(self, actor: Any, kind: str = "short") -> dict:
        char = self._unwrap(actor)
        if kind == "long":
            note = char.ctx.rest.long_rest()
            minutes = 480
        else:
            note = char.ctx.rest.short_rest()
            minutes = 60
        return {"kind": kind, "note": note, "minutes": minutes,
                "hp": char.ctx.rest.current_hp(), "max_hp": char.hp()}

    def describe(self, actor: Any) -> str:
        char = self._unwrap(actor)
        cur, mx = self.hp_of(char)
        return (f"{char.state.cls or '冒险者'} Lv{max(char.state.level, 1)} "
                f"HP {cur}/{mx} AC {self.defense_of(char)}")

    def actor_view(self, actor: Any) -> dict:
        char = self._unwrap(actor)
        st = char.state
        cur, mx = self.hp_of(char)
        return {
            "id": getattr(actor, "id", ""), "name": getattr(actor, "name", ""),
            "ruleset": self.id,
            "cls": st.cls, "level": max(st.level, 1), "race": st.race,
            "hp": cur, "max_hp": mx, "ac": self.defense_of(char),
            "attributes": dict(st.attributes),
            "skills": {k: self.rank_of(char, k) for k in st.skills},
            "conditions": list(st.conditions),
        }

    # ------------------------------------------------------------------ #
    #  战斗
    # ------------------------------------------------------------------ #
    def to_combatant(self, actor: Any):
        """交给 ``d20.battle.BattleService.make_pc`` 转成战斗单位。"""
        return self._unwrap(actor)

    def xp_for(self, threat: Any) -> int:
        from d20.data_monsters import CR_XP

        return CR_XP.get(str(threat), 0)

    def resolve_attack(self, attacker: Any, defender: Any,
                       weapon: str | None = None, modifier: int = 0,
                       retreating: bool = False) -> dict:
        """场景级单次攻击：d20 + 攻击加值 vs AC，命中掷武器骰 + 力量调整。"""
        atk = self._unwrap(attacker)
        dfs = self._unwrap(defender)
        ctx = atk.ctx
        weapon = weapon or self._equipped_weapon(atk)
        melee = "远程" not in str(weapon)
        ac = self.defense_of(dfs)
        res = self.check(atk, CheckRequest(
            actor=self._id_of(attacker), kind="attack",
            key="近战攻击" if melee else "远程攻击",
            dc=ac, modifier=modifier, label=f"{self._name_of(attacker)}的攻击"))
        out = {"hit": res.success, "crit": res.critical == "crit",
               "roll": res.roll, "bonus": res.data.get("bonus", 0),
               "ac": ac, "damage": 0, "text": res.text}
        if res.success:
            dice_n, die = weapon_dice(weapon)
            rolls = [self._rand().randint(1, die) for _ in range(dice_n * (2 if out["crit"] else 1))]
            str_mod = ability_mod(atk.state.attributes["力量"]) if melee else 0
            dmg = max(1, sum(rolls) + max(str_mod, 0))
            out["damage"] = dmg
            out["text"] += f" → 造成 {dmg} 点伤害（{weapon} {dice_n}d{die}{'+' + str(max(str_mod,0)) if str_mod > 0 else ''}）"
        else:
            out["text"] += " → 未命中"
        return out

    @staticmethod
    def _equipped_weapon(char: Any) -> str:
        try:
            return char.ctx.equipment._get_equipped_weapon() or "徒手"
        except Exception:
            return "徒手"


__all__ = ["Dnd5eRuleset", "SAVE_ALIASES"]
