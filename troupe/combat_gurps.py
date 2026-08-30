"""troupe.combat_gurps - GURPS 4e 战斗引擎（L4 专用结算路径）

为什么独立成模块
----------------
``troupe`` 的 D&D 路径复用 ``d20.battle``（一个成熟的 d20 对战引擎）；但 GURPS 的判定与
战斗语义与 d20 根本不同（3d6 掷低、主动防御三选一、命中部位、伤口倍率、休克/击倒），
无法塞进 d20.battle。因此这里实现**与规则书对齐的 GURPS 自有战斗循环**，由
``EncounterService.combat`` 在 ``ruleset.id == "gurps"`` 时调度。

规则锚点（Basic Set 结构性公开事实，已在 ``data_world`` 标注）
------------------------------------------------------------
* 命中 = 武器技能检定（3d6 ≤ 有效技能；含大成功 3–4 / 大失败 17–18）。
* 主动防御三选一：**闪避** Dodge=3+BasicSpeed/2、*招架* Parry=3+武器技能/2、
  *格挡* Block=3+盾技能/2；取最高者掷 3d6 ≤ 该值即成功（撤退 +3 闪避）。
* 命中 → 掷**部位**（按组合数权重）→ 基础伤害（Thrust/Swing 来自 ST，怪物用其固有骰）
  × **伤口倍率**（穿刺×2 / 挥砍×1.5 / 钝击×1，头骨×4 / 颈部×2 / 面部·腹股沟×1.5）。
* 受伤 → **休克** -受伤/2（上限 4，作用到 DX 与主动防御，持续到下一回合）；
  重伤或命中腿/头骨/颈部 → **击倒检定**（d6 ≤ ST），失败则倒地且震慑。

参与单位
--------
* PC：由 ``d20.Character`` 映射（六维 → GURPS 四属性；HP 沿用角色池；武器技能 = DX+2 融合基线）。
* 怪物：由 ``d20.data_monsters.MONSTERS`` 映射（str/dex/con/int → ST/DX/HT/IQ；
  HP 取数据值；武器技能 = DX + 攻击加值；伤害用怪物固有骰）。

确定性：所有掷骰走 ``ruleset._rand()``（即 RngService 的可播种流），同种子同战斗可复现。
"""
from __future__ import annotations

from typing import Any, Optional

from d20.data_monsters import MONSTERS
from d20.monster import parse_dice

from .data_world import (
    basic_move, dodge as gurps_dodge, parry as gurps_parry, block as gurps_block,
    st_damage, roll_location, wound_multiplier, shock_penalty,
    knockdown_success, gurps_encumbrance_level, encumbrance_penalty,
    condition_modifier_of, is_incapacitated,
)


def _guess_dtype(weapon: str) -> str:
    """按武器名推断物理伤害类型（穿刺/挥砍/钝击），默认挥砍。"""
    w = str(weapon or "")
    for k, v in (("矛", "穿刺"), ("枪", "穿刺"), ("刺", "穿刺"), ("匕首", "穿刺"),
                 ("箭", "穿刺"), ("弩", "穿刺"), ("戟", "穿刺"), ("剑", "挥砍"),
                 ("斧", "挥砍"), ("刀", "挥砍"), ("锤", "钝击"), ("棍", "钝击"),
                 ("杖", "钝击"), ("槌", "钝击"), ("拳", "钝击")):
        if k in w:
            return v
    return "挥砍"


def _parse_monster_hp(hp_field: str) -> int:
    """怪物 HP 字段形如 '7 (2d6)' / '135 (18d10)' → 取基础值 7 / 135。"""
    import re
    m = re.match(r"\s*(\d+)", str(hp_field or ""))
    return int(m.group(1)) if m else 10


def _resolve_monster(name: str) -> Optional[dict]:
    """按名字（精确/模糊）在 MONSTERS 里找一个怪物条目；找不到返回 None。"""
    if name in MONSTERS:
        return MONSTERS[name]
    low = str(name).strip().lower()
    for k, v in MONSTERS.items():
        if k.lower() == low or str(v.get("en", "")).lower() == low:
            return v
    for k, v in MONSTERS.items():
        if low in k.lower() or low in str(v.get("en", "")).lower():
            return v
    return None


class GurpsCombatant:
    """一个 GURPS 战斗单位（PC 或怪物）。持有战斗内可变状态（HP/FP/休克/条件）。

    设计原则：纯数据 + 规则无关的取值方法；真正的「命中→防御→部位→伤害」结算在
    ``ruleset_gurps.resolve_attack``（规则适配器）里，本类只负责承载与落地。
    """

    def __init__(self, name: str, side: str, *, st: int, dx: int, iq: int, ht: int,
                 max_hp: int, dodge_base: int, weapon: str = "徒手",
                 weapon_skill: int = 10, dtype: str = "挥砍",
                 parry_val: int = 0, block_val: int = 0,
                 thrust: tuple[int, int] = (1, -2), swing: tuple[int, int] = (1, 0),
                 dmg_dice: Optional[tuple[int, int, int]] = None,
                 char: Any = None, conditions: Optional[list] = None) -> None:
        self.name = name
        self.side = side                      # "party" / "foes"
        self.st, self.dx, self.iq, self.ht = st, dx, iq, ht
        self.max_hp = max(1, int(max_hp))
        self.hp = self.max_hp
        self.fp = ht                          # FP 初始 = HT（战斗内暂不消耗）
        self.dodge_base = max(1, int(dodge_base))
        self.weapon = weapon
        self.weapon_skill = int(weapon_skill)
        self.dtype = dtype
        self.parry_val = int(parry_val)
        self.block_val = int(block_val)
        self.thrust = thrust                  # (骰数, 修正)
        self.swing = swing                    # (骰数, 修正)
        self.dmg_dice = dmg_dice              # 怪物用：(n, die, adds)
        self.char = char                      # 真实角色对象（PC），用于写回 HP
        self.conditions: list = list(conditions or [])
        self.shock: int = 0                   # 当前休克惩罚（每回合开始清零）
        self.alive: bool = True

    # ------------------------------------------------------------------ #
    #  防御
    # ------------------------------------------------------------------ #
    def active_defense(self, retreating: bool = False) -> tuple[int, str]:
        """返回 (防御值, 采用的防御种类)。取闪避/招架/格挡中的最高者。

        受休克与条件（defense 修正）影响；撤退 +3 闪避（仅闪避）。被束缚则无法防御。
        """
        if is_incapacitated(self.conditions):
            return 0, "束缚"
        cond_def = condition_modifier_of(self.conditions, "defense")
        dodge_val = self.dodge_base - self.shock + cond_def + (3 if retreating else 0)
        dodge_val = max(0, dodge_val)
        best_val, best_kind = dodge_val, "闪避"
        if self.parry_val > 0:
            pv = max(0, self.parry_val - self.shock + cond_def)
            if pv > best_val:
                best_val, best_kind = pv, "招架"
        if self.block_val > 0:
            bv = max(0, self.block_val - self.shock + cond_def)
            if bv > best_val:
                best_val, best_kind = bv, "格挡"
        return best_val, best_kind

    # ------------------------------------------------------------------ #
    #  受伤 / 休克
    # ------------------------------------------------------------------ #
    def apply_injury(self, amount: int) -> int:
        self.hp = max(0, self.hp - int(amount))
        if self.hp <= 0:
            self.alive = False
        return self.hp

    def add_shock(self, amount: int) -> None:
        self.shock = max(self.shock, int(amount))

    def add_condition(self, cond: str) -> None:
        if cond and cond not in self.conditions:
            self.conditions.append(cond)

    def reset_shock(self) -> None:
        self.shock = 0

    # ------------------------------------------------------------------ #
    #  视图
    # ------------------------------------------------------------------ #
    def summary(self) -> str:
        return (f"{self.name} [{self.side}] HP {self.hp}/{self.max_hp} "
                f"闪避 {self.dodge_base} 武器技 {self.weapon_skill} "
                f"{'倒地' if '倒地' in self.conditions else ''}"
                f"{'震慑' if '震慑' in self.conditions else ''}")


# =============================================================================
#  单位构建
# =============================================================================
def build_pc_combatant(char: Any, ruleset: Any = None) -> GurpsCombatant:
    """把 ``d20.Character`` 映射成 GURPS 战斗单位。"""
    st_obj = getattr(char, "state", None)
    a = dict(st_obj.attributes) if st_obj is not None else {}
    st = int(a.get("力量", 10)); dx = int(a.get("敏捷", 10))
    iq = int(a.get("智力", 10)); ht = int(a.get("体质", 10))
    max_hp = char.hp() if hasattr(char, "hp") and callable(char.hp) else int(a.get("hp", 10))
    # 负重：尽量读装备重量，否则 None（负重等级 0）
    weight = None
    eq = getattr(getattr(char, "ctx", None), "equipment", None)
    if eq is not None:
        try:
            weight = float(getattr(eq, "total_weight", lambda: 0.0)() or 0.0)
        except Exception:
            weight = None
    enc = gurps_encumbrance_level(st, weight or 0.0)
    dodge_base = gurps_dodge(dx, ht) - encumbrance_penalty(enc)
    weapon = _equipped_weapon_name(char)
    weapon_skill = dx + 2                      # 融合基线：D&D 熟练 ≈ GURPS 受训 +2
    dtype = _guess_dtype(weapon)
    is_melee = "远程" not in weapon and "弓" not in weapon and "弩" not in weapon
    parry_val = gurps_parry(weapon_skill) if is_melee else 0
    block_val = 0
    if "盾" in weapon:
        block_val = gurps_block(dx // 2)
    thrust = st_damage(st, "突刺")
    swing = st_damage(st, "挥砍")
    conditions = list(getattr(st_obj, "conditions", []) or [])
    return GurpsCombatant(
        name=getattr(char, "name", "") or getattr(st_obj, "cls", "冒险者") or "冒险者",
        side="party", st=st, dx=dx, iq=iq, ht=ht, max_hp=max_hp,
        dodge_base=dodge_base, weapon=weapon, weapon_skill=weapon_skill,
        dtype=dtype, parry_val=parry_val, block_val=block_val,
        thrust=thrust, swing=swing, char=char, conditions=conditions,
    )


def build_monster_combatant(name: str, level: int = 1) -> GurpsCombatant:
    """把 ``MONSTERS`` 里的怪物映射成 GURPS 战斗单位。"""
    m = _resolve_monster(name)
    if m is None:
        return GurpsCombatant(name=name, side="foes", st=10, dx=10, iq=6, ht=10,
                              max_hp=10, dodge_base=gurps_dodge(10, 10),
                              weapon="爪牙", weapon_skill=10, dtype="挥砍",
                              thrust=st_damage(10, "突刺"), swing=st_damage(10, "挥砍"))
    disp = m.get("en", name)
    st = int(m.get("str", 10)); dx = int(m.get("dex", 10))
    iq = int(m.get("int", 6)); ht = int(m.get("con", 10))
    max_hp = _parse_monster_hp(m.get("hp", "10"))
    dodge_base = gurps_dodge(dx, ht)
    actions = m.get("actions") or []
    act = actions[0] if actions else {}
    weapon = act.get("name", "爪牙")
    atk = int(act.get("atk", 0) or 0)
    weapon_skill = dx + atk                  # GURPS 武器技能 = DX + D&D 攻击加值
    dtype = act.get("type") or _guess_dtype(weapon)
    dmg = act.get("dmg", "1d6")
    try:
        dmg_dice = parse_dice(dmg)           # (count, sides, mod)
    except Exception:
        dmg_dice = (1, 6, 0)
    is_melee = "远程" not in weapon and "弓" not in weapon and "弩" not in weapon
    parry_val = gurps_parry(weapon_skill) if is_melee else 0
    block_val = gurps_block(dx // 2) if "盾" in str(m.get("ac_note", "")) else 0
    return GurpsCombatant(
        name=disp, side="foes", st=st, dx=dx, iq=iq, ht=ht, max_hp=max_hp,
        dodge_base=dodge_base, weapon=weapon, weapon_skill=weapon_skill,
        dtype=dtype, parry_val=parry_val, block_val=block_val,
        dmg_dice=dmg_dice, char=None,
    )


def _equipped_weapon_name(char: Any) -> str:
    try:
        return char._get_equipped_weapon() or "徒手"
    except Exception:
        return "徒手"


# =============================================================================
#  战斗循环
# =============================================================================
def run_gurps_combat(party: list, foes: list, ruleset: Any,
                     rng: Any = None, ctx: Any = None,
                     distance: float = 60, max_rounds: int = 50) -> dict:
    """跑一场 GURPS 回合制对战，回写 HP 与状态到真实角色。

    :param party: ``d20.Character`` 列表（PC）。
    :param foes: 怪物名字符串，或 ``("怪物名", 数量)`` 元组。
    :param ruleset: ``GurpsRuleset`` 实例（驱动攻击结算与写回）。
    :return: 与 d20.battle 结果同构的 dict（winner / rounds / total_xp / report / result）。
    """
    if not party:
        return {"error": "no_party", "winner": "none"}

    pc_units = [build_pc_combatant(c, ruleset) for c in party if ruleset.alive(c)]
    foe_units = []
    for f in foes:
        if isinstance(f, (tuple, list)):
            fname, count = f[0], int(f[1]) if len(f) > 1 else 1
        else:
            fname, count = f, 1
        for i in range(count):
            mc = build_monster_combatant(fname, level=1)
            if count > 1:
                mc.name = f"{mc.name}#{i + 1}"
            foe_units.append(mc)
    if not foe_units:
        return {"error": "no_foes", "winner": "party"}

    # 双方初始快照（便于战报）
    report_lines: list[str] = []
    report_lines.append(
        f"GURPS 战斗开始：我方 {len(pc_units)} 人 vs 敌方 {len(foe_units)} 单位，距离 {distance:.0f} 尺。"
    )

    round_no = 0
    while round_no < max_rounds:
        round_no += 1
        report_lines.append(f"── 第 {round_no} 回合 ──")
        # 每方行动前清零本方休克
        for u in pc_units:
            u.reset_shock()
        for u in foe_units:
            u.reset_shock()

        for side_units, enemy_units in ((pc_units, foe_units), (foe_units, pc_units)):
            for u in side_units:
                if not u.alive:
                    continue
                if is_incapacitated(u.conditions):
                    report_lines.append(f"  {u.name} 被束缚，无法行动。")
                    continue
                targets = [t for t in enemy_units if t.alive]
                if not targets:
                    break
                # 选当前 HP 最低者（简单 AI）
                target = min(targets, key=lambda t: t.hp)
                res = ruleset.resolve_attack(u, target, retreating=False)
                report_lines.append("  " + res.get("text", ""))
                # 写回真实角色 HP 与状态
                if target.char is not None:
                    try:
                        ruleset.set_hp(target.char, target.hp)
                        for c in target.conditions:
                            _apply_cond_to_char(target.char, c)
                    except Exception:
                        pass
                if not any(t.alive for t in enemy_units):
                    break
            if not any(t.alive for t in enemy_units):
                break

        if not any(u.alive for u in foe_units):
            break
        if not any(u.alive for u in pc_units):
            break

    party_alive = any(u.alive for u in pc_units)
    winner = "party" if party_alive else "foes"
    # 经验：按怪物威胁合计（CR_XP），查不到则按数量兜底
    try:
        from d20.data_monsters import CR_XP
        xp = sum(int(CR_XP.get(getattr(u, "name", "").split("#")[0], 0)) for u in foe_units)
    except Exception:
        xp = 0
    if xp <= 0:
        xp = len(foe_units) * 2
    xp = max(xp, 0)

    report_lines.append(
        f"战斗结束：胜方 = {winner}，共 {round_no} 回合。"
    )
    report = "\n".join(report_lines)
    return {
        "winner": winner,
        "rounds": round_no,
        "total_xp": xp,
        "gold": 0,
        "loot": [],
        "report": report,
        "result": {
            "winner": winner, "rounds": round_no, "total_xp": xp,
            "party": [u.summary() for u in pc_units],
            "foes": [u.summary() for u in foe_units],
        },
    }


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


__all__ = [
    "GurpsCombatant", "build_pc_combatant", "build_monster_combatant",
    "run_gurps_combat",
]
