"""troupe.ruleset_gurps - GURPS 4e 规则适配器

判定语义
--------
    3d6 ≤ 有效技能等级 + 情境修正  →  成功
    掷 3~4 恒为大成功（有效等级 ≥15 时 5 也算，≥16 时 6 也算）
    掷 18 恒为大失败；掷 17 仅在有效等级 ≥16 时算成功

属性映射（本项目六维 ↔ GURPS 四属性）
------------------------------------
    ST 力量    DX 敏捷    IQ 智力    HT 体质
    Will（意志）与 Per（知觉）在 GURPS 中默认等于 IQ；本项目把感知作为二者的来源，
    保留 GURPS 的「可独立调整」思想：``will_adj`` / ``per_adj`` 写在角色 flags 上。

血条与疲劳
----------
* **生命池沿用角色卡 HP**（项目融合设定，避免与 v2.x 存档分裂）。
* GURPS 派生值（HP←ST、FP←HT、闪避、基础速度、突刺/挥砍伤害）作为**附加视图**输出，
  并参与专项检定（如 HT 检定抗力竭、Will 检定抗恐惧）。
* 伤害按 GURPS 的伤口倍率结算（穿刺 ×2 / 挥砍 ×1.5，头骨 ×4 / 颈部 ×2），
  可通过 ``config={"wound_multiplier": False}`` 关掉以对齐 5e 手感。

许可边界
--------
只采用 GURPS 的**结构性公开事实**（四属性、3d6 掷低、难度分档、主动防御、伤口倍率），
不搬运 Basic Set 的逐格数据表；ST→伤害使用 ``data_world`` 中已标注的近似外推公式。
"""
from __future__ import annotations

from typing import Any

from roleplayer.data import ATTRIBUTES

from .contracts import CheckRequest, CheckResult
from .data_world import (
    TIER_MOD_GURPS, basic_speed, basic_move, dodge as gurps_dodge,
    st_damage, roll_location, wound_multiplier, shock_penalty,
    knockdown_success, condition_modifier_of,
)
from .combat_gurps import GurpsCombatant, build_pc_combatant
from .ruleset import RulesetAdapter, register_ruleset


#: 六维属性 → GURPS 四属性
GURPS_ATTR = {"力量": "ST", "敏捷": "DX", "智力": "IQ", "体质": "HT",
              "感知": "Per", "魅力": "Cha"}

#: 武器名 → 伤害类型（用于伤口倍率）
_DTYPE_HINT = {
    "矛": "穿刺", "枪": "穿刺", "刺": "穿刺", "匕首": "穿刺", "短剑": "穿刺",
    "箭": "穿刺", "弩": "穿刺", "标": "穿刺", "戟": "穿刺",
    "锤": "钝击", "棍": "钝击", "杖": "钝击", "槌": "钝击", "拳": "钝击", "钉头": "钝击",
}


def guess_dtype(weapon: str) -> str:
    """按武器名推断物理伤害类型（默认挥砍）。"""
    w = str(weapon or "")
    for k, v in _DTYPE_HINT.items():
        if k in w:
            return v
    return "挥砍"


@register_ruleset
class GurpsRuleset(RulesetAdapter):
    """GURPS 4e 规则适配器（掷低）。"""

    id = "gurps"
    name = "GURPS 4e"
    blurb = "3d6 ≤ 有效技能等级 + 修正；含主动防御（闪避/格挡/招架）、命中部位与伤口倍率。"

    def __init__(self, rng: Any = None, config: dict | None = None) -> None:
        super().__init__(rng, config)
        self.wound_multiplier_on = bool(self.config.get("wound_multiplier", True))

    # ------------------------------------------------------------------ #
    #  核心检定
    # ------------------------------------------------------------------ #
    def check(self, actor: Any, request: CheckRequest) -> CheckResult:
        char = self._unwrap(actor)
        rnd = self._rand()
        base = self._level_of(char, request)
        tier_mod = self.modifier_for(request.tier) if request.dc is None else 0
        # 条件修正（震慑/眩晕/倒地/盲目…）作用于所有 GURPS 检定
        cond_mod = condition_modifier_of(getattr(char.state, "conditions", []) or [], "check")
        target = base + request.modifier + tier_mod + cond_mod

        dice = [rnd.randint(1, 6) for _ in range(3)]
        roll = sum(dice)

        critical = ""
        if roll <= 4 or (roll == 5 and target >= 15) or (roll == 6 and target >= 16):
            critical = "crit"
        elif roll == 18:
            critical = "crit_fail"

        if critical == "crit":
            success = True
        elif critical == "crit_fail":
            success = False
        elif roll == 17:
            success = target >= 16          # 有效等级 ≥16 时掷 17 仍算成功
        else:
            success = roll <= target

        margin = target - roll
        mod_parts = []
        if request.modifier:
            mod_parts.append(f"{request.modifier:+d}")
        if tier_mod:
            mod_parts.append(f"{tier_mod:+d}({request.tier})")
        if cond_mod:
            mod_parts.append(f"{cond_mod:+d}(状态)")
        mod_tag = "".join(mod_parts) or "0"
        crit_tag = {"crit": "（大成功！）", "crit_fail": "（大失败！）", "": ""}[critical]
        text = (f"{request.label or request.key or request.kind}："
                f"3d6({'+'.join(str(d) for d in dice)}={roll}) vs "
                f"{base}[{mod_tag}]={target} → {'成功' if success else '失败'}{crit_tag}")
        return CheckResult(
            success=success, critical=critical, margin=margin,
            roll=roll, dice=dice, total=target, target=target, text=text,
            data={"ruleset": self.id, "level": base, "effective": target,
                  "kind": request.kind, "key": request.key},
        )

    def _level_of(self, char: Any, request: CheckRequest) -> int:
        """3d6 的上限值：技能取有效等级，属性取属性值（GURPS 掷低）。"""
        key = request.key or ""
        if request.kind == "attribute" and key in ATTRIBUTES:
            return int(char.state.attributes[key])
        if request.kind == "save":
            # GURPS 的「豁免」= 对 HT / Will 的属性检定
            return int(char.state.attributes.get(key if key in ATTRIBUTES else "体质", 10))
        return self.rank_of(char, key)

    # ------------------------------------------------------------------ #
    #  难度
    # ------------------------------------------------------------------ #
    def dc_for(self, tier: str) -> int:
        """掷低型规则无 DC 概念，返回 0（难度由 ``modifier_for`` 表达）。"""
        return 0

    def modifier_for(self, tier: str) -> int:
        return TIER_MOD_GURPS[tier]

    # ------------------------------------------------------------------ #
    #  角色视图（GURPS 派生值）
    # ------------------------------------------------------------------ #
    def rank_of(self, actor: Any, key: str) -> int:
        char = self._unwrap(actor)
        if key in ATTRIBUTES:
            return int(char.state.attributes[key])
        return char.ctx.skills.effective_skill_rank(key)

    def derived(self, actor: Any) -> dict:
        """GURPS 派生值全览。"""
        char = self._unwrap(actor)
        a = char.state.attributes
        st, dx, iq, ht = a["力量"], a["敏捷"], a["智力"], a["体质"]
        per_adj = int(getattr(char.state, "flags", {}).get("per_adj", 0) or 0)
        will_adj = int(getattr(char.state, "flags", {}).get("will_adj", 0) or 0)
        speed = basic_speed(dx, ht)
        cur, mx = self.hp_of(char)
        return {
            "ST": st, "DX": dx, "IQ": iq, "HT": ht,
            "HP": st, "FP": ht,
            "Will": iq + will_adj, "Per": a["感知"] + per_adj,
            "BasicSpeed": speed, "BasicMove": basic_move(dx, ht),
            "Dodge": gurps_dodge(dx, ht),
            "Thrust": st_damage(st, "突刺"), "Swing": st_damage(st, "挥砍"),
            "hp_pool": cur, "hp_pool_max": mx,
        }

    def defense_of(self, actor: Any) -> int:
        """GURPS：防御 = 闪避值（负重 0）。"""
        return self.derived(actor)["Dodge"]

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
        # GURPS：护甲/部位的伤口倍率放大穿透伤害
        mult = wound_multiplier("躯干", dtype) if self.wound_multiplier_on else 1.0
        applied = max(1, int(round(amount * mult)))
        char.ctx.rest.take_damage(applied, dtype)
        after = char.ctx.rest.current_hp()
        return {"target": self._id_of(actor), "amount": before - after,
                "dtype": dtype, "multiplier": mult,
                "hp": after, "max_hp": char.hp(), "down": after <= 0}

    def heal(self, actor: Any, amount: int) -> int:
        char = self._unwrap(actor)
        before = char.ctx.rest.current_hp()
        char.ctx.rest.heal(int(amount))
        return char.ctx.rest.current_hp() - before

    def rest(self, actor: Any, kind: str = "short") -> dict:
        """GURPS 恢复：短时休整止血 1 点；整夜睡眠按 HT/10 恢复。"""
        char = self._unwrap(actor)
        ht = char.state.attributes["体质"]
        if kind == "long":
            amount = max(1, ht // 10)
            minutes = 480
        else:
            amount = 1
            minutes = 60
        gained = self.heal(char, amount)
        return {"kind": kind, "healed": gained, "minutes": minutes,
                "hp": char.ctx.rest.current_hp(), "max_hp": char.hp()}

    def describe(self, actor: Any) -> str:
        char = self._unwrap(actor)
        d = self.derived(char)
        cur, mx = self.hp_of(char)
        return (f"{char.state.cls or '冒险者'} HP {cur}/{mx} "
                f"闪避 {d['Dodge']} 速度 {d['BasicSpeed']:.2f} "
                f"(ST{d['ST']}/DX{d['DX']}/IQ{d['IQ']}/HT{d['HT']})")

    def actor_view(self, actor: Any) -> dict:
        char = self._unwrap(actor)
        st = char.state
        cur, mx = self.hp_of(char)
        return {
            "id": getattr(actor, "id", ""), "name": getattr(actor, "name", ""),
            "ruleset": self.id,
            "cls": st.cls, "level": max(st.level, 1), "race": st.race,
            "hp": cur, "max_hp": mx, "defense": self.defense_of(char),
            "gurps": self.derived(char),
            "attributes": dict(st.attributes),
            "skills": {k: self.rank_of(char, k) for k in st.skills},
            "conditions": list(st.conditions),
        }

    # ------------------------------------------------------------------ #
    #  战斗：命中 → 主动防御 → 部位 → 伤口倍率
    # ------------------------------------------------------------------ #
    def to_combatant(self, actor: Any):
        """GURPS 战斗单位：由 ``roleplayer.Character`` 映射成 ``GurpsCombatant``。

        真正的回合制结算在 ``troupe.combat_gurps.run_gurps_combat``，本方法只负责
        把角色转成可驱动该循环的单位（不复用 roleplayer.battle）。
        """
        return build_pc_combatant(self._unwrap(actor), self)

    def _gurps_skill_roll(self, skill_level: int, modifier: int = 0):
        """GURPS 技能检定：3d6 ≤ 有效等级 + 修正 → 成功；含大成功/大失败区间。

        返回 ``(success, critical, roll, dice, margin)``。
        """
        level = int(skill_level) + int(modifier)
        roll, dice = self._roll_3d6()

        critical = ""
        if roll <= 4 or (roll == 5 and level >= 15) or (roll == 6 and level >= 16):
            critical = "crit"
        elif roll == 18:
            critical = "crit_fail"

        if critical == "crit":
            success = True
        elif critical == "crit_fail":
            success = False
        elif roll == 17:
            success = level >= 16
        else:
            success = roll <= level

        return success, critical, roll, dice, level - roll

    def _roll_3d6(self):
        rnd = self._rand()
        dice = [rnd.randint(1, 6) for _ in range(3)]
        return sum(dice), dice

    def xp_for(self, threat: Any) -> int:
        """GURPS 用点数制：威胁 → 建议奖励点数（自研映射，便于跨规则统一结算）。"""
        table = {"微弱": 1, "普通": 2, "丰厚": 3, "巨富": 5}
        return table.get(str(threat), 1)

    def points_of(self, actor: Any) -> int:
        """回算一个角色的 GURPS 总点数（属性 + HP/FP + 优缺点 + 技能）。

        从 ``state.flags`` 读取优缺点/技能（由 ``build_gurps_character`` 写入；
        手工角色无 flags 时只算属性/HP/FP，给出结构下限）。
        """
        from .character_gurps import gurps_point_total
        char = self._unwrap(actor)
        a = char.state.attributes
        st = int(a.get("力量", 10)); dx = int(a.get("敏捷", 10))
        iq = int(a.get("智力", 10)); ht = int(a.get("体质", 10))
        hp = int(getattr(char.state, "max_hp", st))
        fp = int(a.get("体质", ht))  # GURPS FP 默认 = HT
        flags = getattr(char.state, "flags", {}) or {}
        adv = flags.get("gurps_advantages") or []
        dis = flags.get("gurps_disadvantages") or []
        skills = flags.get("gurps_skills") or {}
        return gurps_point_total(st=st, dx=dx, iq=iq, ht=ht, hp=hp, fp=fp,
                                 advantages=adv, disadvantages=dis, skills=skills)

    def resolve_attack(self, attacker: Any, defender: Any,
                       weapon: str | None = None, modifier: int = 0,
                       retreating: bool = False) -> dict:
        """GURPS 单次攻击完整结算：命中 → 主动防御三选一 → 部位 → 伤口倍率 → 休克/击倒。

        接受 ``GurpsCombatant``（由战斗循环传入）或 ``roleplayer.Character``（直接调用时自动映射）。
        命中落地后写回防御方 HP 与状态（经 ``set_hp`` / ``condition`` 服务），保证与导演层一致。
        """
        rnd = self._rand()
        atk_char = self._unwrap(attacker)
        dfs_char = self._unwrap(defender)

        # ---- 攻击方战斗视图 ----
        if isinstance(attacker, GurpsCombatant):
            a = attacker
            weapon = a.weapon
            wskill = a.weapon_skill
            dtype = a.dtype
            dmg_dice = a.dmg_dice
            thrust = a.thrust
            swing = a.swing
            a_conds = a.conditions
        else:
            weapon = weapon or self._equipped_weapon(atk_char)
            wskill = int(atk_char.state.attributes["敏捷"]) + 2   # 融合基线 DX+2
            dtype = guess_dtype(weapon)
            dmg_dice = None
            thrust = st_damage(atk_char.state.attributes["力量"], "突刺")
            swing = st_damage(atk_char.state.attributes["力量"], "挥砍")
            a_conds = list(getattr(atk_char.state, "conditions", []) or [])

        atk_mod = int(modifier) + condition_modifier_of(a_conds, "attack")
        success, critical, roll, dice, margin = self._gurps_skill_roll(wskill, atk_mod)
        atk_name = self._name_of(attacker)
        out = {
            "hit": False, "crit": critical == "crit", "roll": roll, "dice": dice,
            "skill": wskill, "modifier": atk_mod, "weapon": weapon, "dtype": dtype,
            "defense": 0, "defense_kind": "", "damage": 0, "location": "",
            "multiplier": 1.0, "shock": 0, "knockdown": False, "text": "",
        }
        out["text"] = (f"{atk_name} 以{weapon}攻击（3d6={' '.join(str(x) for x in dice)}"
                       f" 和={roll} vs 技能 {wskill}{atk_mod:+d}）")
        if not success:
            out["text"] += " → 未命中"
            return out

        # ---- 防御方战斗视图 ----
        if isinstance(defender, GurpsCombatant):
            d = defender
        else:
            d = build_pc_combatant(dfs_char, self)
        def_val, def_kind = d.active_defense(retreating=retreating)
        out["defense"] = def_val
        out["defense_kind"] = def_kind
        ddice = [rnd.randint(1, 6) for _ in range(3)]
        droll = sum(ddice)
        if def_val > 0 and droll <= def_val:
            out["text"] += (f" → {d.name} {def_kind}成功（3d6 "
                            f"{' '.join(str(x) for x in ddice)} 和={droll} ≤ {def_val}）")
            return out

        # ---- 命中落地：部位 → 伤害 × 伤口倍率 ----
        loc = roll_location(rnd)
        out["hit"] = True
        out["location"] = loc
        if dmg_dice is not None:
            n, die, adds = dmg_dice
            rolls = [rnd.randint(1, die) for _ in range(max(1, n))]
            base = max(1, sum(rolls) + int(adds))
        else:
            kind_for_dmg = "突刺" if dtype == "穿刺" else "挥砍"
            dn, adds = thrust if dtype == "穿刺" else swing
            rolls = [rnd.randint(1, 6) for _ in range(max(1, dn))]
            base = max(1, sum(rolls) + int(adds))
        mult = wound_multiplier(loc, dtype) if self.wound_multiplier_on else 1.0
        out["multiplier"] = mult
        dmg = max(1, int(round(base * mult)))
        out["damage"] = dmg

        # ---- 落地到防御方：受伤 → 休克 → 击倒/震慑 ----
        d.apply_injury(dmg)
        d.add_shock(shock_penalty(dmg))
        knockdown = loc in ("头骨", "颈部", "腿") or dmg >= d.max_hp / 2
        if knockdown:
            kr = rnd.randint(1, 6)
            if not knockdown_success(kr, d.st):
                d.add_condition("倒地")
                d.add_condition("震慑")
                out["knockdown"] = True
                out["text"] += "（被击倒并震慑）"
        out["shock"] = d.shock

        # 写回真实角色（PC 才有 char 引用；怪物 HP 留在本单位）
        if d.char is not None:
            self.set_hp(d.char, d.hp)
            for c in d.conditions:
                _apply_cond_to_char(d.char, c)

        out["text"] += (f" → 命中{loc}（{d.name} 防御失败 3d6 "
                        f"{' '.join(str(x) for x in ddice)} 和={droll} > {def_val}），"
                        f"基础 {base} ×{mult:g} = {dmg} 点{dtype}伤害")
        return out

    @staticmethod
    def _equipped_weapon(char: Any) -> str:
        try:
            return char.ctx.equipment._get_equipped_weapon() or "徒手"
        except Exception:
            return "徒手"


def _apply_cond_to_char(char: Any, cond: str) -> None:
    """把战斗产生的条件写回真实角色（经 d20 condition 服务或 state）。"""
    try:
        char.ctx.condition.apply(char, cond)
        return
    except Exception:
        pass
    st = getattr(char, "state", char)
    conds = getattr(st, "conditions", None)
    if isinstance(conds, dict):
        conds[cond] = True
    elif isinstance(conds, list) and cond not in conds:
        conds.append(cond)


__all__ = ["GurpsRuleset", "GURPS_ATTR", "guess_dtype"]
