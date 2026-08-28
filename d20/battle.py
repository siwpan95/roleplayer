"""d20.battle - 模拟对战服务（v2.2：回合制完整对战流程）

把 D20 从「单次战斗宏」升级为**完整回合制模拟对战**：

- 先攻：d20 + 敏捷调整，平手比骰面、再平手比敏捷（SRD The Order of Combat）
- 回合轮转：按先攻序每人一回合；回合 = 动作 + 移动 + 附赠动作（+ 反应/传奇动作）
- 动作经济：攻击 / 多攻击（解析 stat block 的 Multiattack 文本）/ 疾行 / 撤离 / 躲藏 /
  特殊能力（喷吐等含充能与豁免 DC）/ 施法
- 伤害结算：暴击双倍 / 抗力减半 / 免疫无效 / 易伤加倍；伤害类型经
  ``data_battle.normalize_damage_type`` 归一（怪物库中英混用亦正确判定）
- 状态施加：从 stat block 英文原文解析「DC N 豁免 + 状态」，命中后按豁免判定，
  状态对攻防有实际影响（倒地=近战优势/远程劣势、目盲=攻击劣势…）
- 死亡：怪物 0 HP 即死；PC 0 HP 进入濒死，每回合死亡豁免（3 成稳定 / 3 败死亡 / 20 回 1 HP）
- 怪物 AI（联网调研的 5e 怪物 AI 实践）：
  目标选择「最近优先，WIS≥12 时重伤优先」；动作「解状态 > 特殊能力 > 远程 > 近战」；
  INT≥10 自动规避目标抗/免疫的伤害类型；INT≥18 每回合取期望伤害最大
- PC AI：集火最低 HP 敌人（行动经济研究结论）；濒死同伴「悠悠球式」治疗优先
- 传奇动作：每轮每名传奇怪物可额外行动一次（消耗点数）
- 遭遇构建：DMG 2014 XP 阈值/遭遇倍数/队伍规模调整 → 难度评估与按预算编组
- 蒙特卡洛：``simulate(trials)`` 统计胜率 / 平均回合 / 平均剩余 HP

挂到 ``ctx.battle``。依赖 dice/monster/condition 均为既有服务；怪物仍是「外部战斗
单位」，不污染玩家 CharacterState（模拟结束恢复其 HP/法术位/条件）。
"""
from __future__ import annotations

import random
import re
from dataclasses import dataclass, field

from .core import Service
from .data import ability_mod
from .data_battle import (
    XP_THRESHOLDS, DAILY_XP_BUDGET, DIFFICULTIES, DIFFICULTY_CN,
    encounter_multiplier, party_thresholds, judge_difficulty,
    normalize_damage_type, CONDITION_KEYWORDS, SAVE_ABILITY_MAP,
    AI_WIS_WOUNDED_THRESHOLD, AI_INT_ADAPT_THRESHOLD, AI_INT_OPTIMAL_THRESHOLD,
    MELEE_REACH, DEFAULT_START_DISTANCE, DEATH_SAVE_TARGET,
    DEATH_SAVE_SUCCESSES, DEATH_SAVE_FAILURES, CRIT_ROLL, DEFAULT_MAX_ROUNDS,
)
from .data_monsters import MONSTERS, CR_XP
from .monster import parse_dice

# 数字英文（解析 Multiattack 文本）
_NUM_WORDS = {"one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6}
_CN_NUMS = {1: "一次", 2: "两次", 3: "三次", 4: "四次", 5: "五次", 6: "六次"}


# =============================================================================
#  Combatant —— 统一战斗单位（PC / 怪物）
# =============================================================================
@dataclass
class Combatant:
    name: str
    side: str                                  # "party" | "foe"
    kind: str                                   # "pc" | "monster"
    ac: int
    max_hp: int
    hp: int
    dex: int
    speed: int
    cr: str = ""
    xp: int = 0
    x: float = 0.0                              # 1-D 位置（尺）
    init: int = 0
    init_roll: int = 0
    dex_mod: int = 0
    # 属性（AI 用）
    wis: int = 10
    intl: int = 10
    # 防御谱系（canonical 中文伤害类型集合）
    resist: set = field(default_factory=set)
    immune: set = field(default_factory=set)
    vuln: set = field(default_factory=set)
    cond_immune: set = field(default_factory=set)
    # 动作（normalized dict 列表）与传奇动作
    actions: list = field(default_factory=list)
    legendary: list = field(default_factory=list)
    traits: list = field(default_factory=list)
    recharge_ready: dict = field(default_factory=dict)   # 动作名 -> bool
    # 回合内资源
    action_used: bool = False
    bonus_used: bool = False
    reaction_used: bool = False
    move_left: int = 0
    # 状态与死亡
    conditions: list = field(default_factory=list)
    death_success: int = 0
    death_failure: int = 0
    # PC 专用
    source: object = None                        # Character 实例
    atk_melee: int = 0
    atk_ranged: int = 0
    weapon: str = "徒手"
    weapon_dice: tuple = (1, 4)
    str_mod: int = 0
    level: int = 1
    can_sneak: bool = False
    can_range: bool = False
    # 统计
    damage_dealt: int = 0

    @property
    def alive(self) -> bool:
        return self.hp > 0

    @property
    def conscious(self) -> bool:
        return self.alive or self.death_success < DEATH_SAVE_SUCCESSES

    def __repr__(self) -> str:  # noqa: D105
        return f"<{self.name} hp={self.hp}/{self.max_hp} {self.side}>"


# =============================================================================
#  Battle —— 一场对战的完整状态
# =============================================================================
@dataclass
class Battle:
    combatants: list = field(default_factory=list)
    order: list = field(default_factory=list)      # 先攻序的索引
    round: int = 1
    turn_index: int = 0
    log: list = field(default_factory=list)
    over: bool = False
    winner: str = ""
    total_xp: int = 0
    party_levels: list = field(default_factory=list)

    def party(self) -> list:
        return [c for c in self.combatants if c.side == "party"]

    def foes(self) -> list:
        return [c for c in self.combatants if c.side == "foe"]


# =============================================================================
#  工具函数
# =============================================================================
def _dist(a: Combatant, b: Combatant) -> float:
    return abs(a.x - b.x)


def _reach_of(action: dict, default: int = MELEE_REACH) -> int:
    """解析动作的触及/射程（尺）。'80/320 ft' 取正常射程 80；'5 ft' 取 5。"""
    r = str(action.get("reach") or "")
    m = re.match(r"^\s*(\d+)", r)
    return int(m.group(1)) if m else default


def _is_ranged(action: dict) -> bool:
    r = str(action.get("reach") or "")
    return "ft" in r and ("/" in r or int(re.match(r"\s*(\d+)", r).group(1)) > 10)


def _hp_of(expr: str) -> int:
    """'84 (8d10)' -> 84（取平均 HP）。"""
    m = re.match(r"^\s*(\d+)", str(expr or ""))
    return int(m.group(1)) if m else 10


def _parse_multiattack(action: dict, actions: list) -> list:
    """解析 Multiattack 文本 -> [(次数, 子动作名)]，按名匹配真实子动作。"""
    extra = action.get("extra", "") or ""
    out: list = []
    # 模式 A："makes three attacks: one with its bite and two with its claws"
    for m in re.finditer(
        r"(one|two|three|four|five|six|\d+)\s+with\s+its\s+([\w\s]+?)(?=,| and|\Z)",
        extra, re.I,
    ):
        cnt = _NUM_WORDS.get(m.group(1).lower(), int(m.group(1)) if m.group(1).isdigit() else 1)
        out.append((cnt, m.group(2).strip().lower()))
    # 模式 B："makes two greatclub attacks"
    if not out:
        m = re.search(r"makes\s+(one|two|three|four|five|six|\d+)\s+([\w\s]+?)\s+attacks?", extra, re.I)
        if m:
            cnt = _NUM_WORDS.get(m.group(1).lower(), int(m.group(1)) if m.group(1).isdigit() else 1)
            out.append((cnt, m.group(2).strip().lower()))
    # 子动作名 -> 真实动作（单复数/子串匹配）
    resolved = []
    for cnt, nm in out:
        sub = _find_action(actions, nm)
        if sub:
            resolved.append((cnt, sub))
    return resolved


def _find_action(actions: list, name: str) -> dict | None:
    nm = name.lower().rstrip("s")
    for a in actions:
        an = str(a.get("name", "")).lower().rstrip("s")
        if an == nm or nm in an or an in nm:
            return a
    return None


def _parse_save(extra: str) -> dict | None:
    """解析 'DC 18 Constitution saving throw or be paralyzed' -> {dc, axis, condition}。"""
    m = re.search(r"DC\s+(\d+)\s+(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)\s+saving throw", extra, re.I)
    if not m:
        return None
    dc = int(m.group(1))
    axis = SAVE_ABILITY_MAP.get(m.group(2).lower(), "will")
    condition = ""
    tail = extra[m.end():].lower()
    for kw, zh in CONDITION_KEYWORDS.items():
        if re.search(rf"\b{kw}\b", tail) and re.search(rf"\b{kw}\b", tail).start() < 120:
            condition = zh
            break
    if not condition and "knocked prone" in tail:
        condition = "倒地"
    return {"dc": dc, "axis": axis, "condition": condition}


def _parse_recharge(extra: str) -> int | None:
    """解析 'Recharge 5-6' -> 5（需掷出 >=5 才充能）；无充能返回 None。"""
    m = re.search(r"Recharge\s+(\d)\s*-\s*6", extra, re.I)
    return int(m.group(1)) if m else None


def normalize_action(a: dict, monster: dict) -> dict:
    """把怪物 stat block 动作规范化为引擎结构。"""
    extra = a.get("extra", "") or ""
    name = a.get("name", "")
    is_multi = "multiattack" in name.lower()
    atk = a.get("atk") or 0
    dmg_expr = a.get("dmg", "")
    dtype = normalize_damage_type(a.get("type", ""))
    save = None if is_multi else _parse_save(extra)
    recharge = _parse_recharge(extra)
    if is_multi:
        kind = "multiattack"
    elif "attack" in extra.lower() or atk:
        kind = "ranged" if _is_ranged(a) else "melee"
    elif save or dtype:
        kind = "special"                      # 喷吐/毒素云等（含豁免）
    else:
        kind = "utility"
    return {
        "name": name, "atk": atk, "reach": _reach_of(a),
        "dmg_expr": dmg_expr, "dmg_type": dtype,
        "extra": extra, "kind": kind, "save": save,
        "recharge": recharge, "is_multi": is_multi,
        "multi": _parse_multiattack(a, monster.get("actions", [])) if is_multi else [],
    }


# =============================================================================
#  BattleService
# =============================================================================
class BattleService(Service):
    """模拟对战引擎。"""

    inject = ["dice", "monster", "condition"]

    MONSTERS = MONSTERS
    CR_XP = CR_XP
    XP_THRESHOLDS = XP_THRESHOLDS
    DAILY_XP_BUDGET = DAILY_XP_BUDGET
    DIFFICULTY_CN = DIFFICULTY_CN

    _battle: Battle | None = None

    # ---------------- 当前对战（门面糖） ----------------
    def create(self, party: list, foes: list, distance: float = DEFAULT_START_DISTANCE) -> Battle:
        """创建一场对战并置为当前对战（供 step/run/report 免传参使用）。"""
        self._battle = self.new_battle(party, foes, distance)
        return self._battle

    def current(self) -> Battle | None:
        return self._battle

    def step_current(self) -> bool:
        if self._battle is None:
            return False
        return self.step(self._battle)

    def run_current(self, max_rounds: int | None = None) -> dict:
        if self._battle is None:
            return {}
        return self.run(self._battle, max_rounds)

    def report_current(self) -> str:
        if self._battle is None:
            return "无进行中的对战"
        return self.report(self._battle)

    def state_current(self) -> dict:
        if self._battle is None:
            return {}
        return self.state(self._battle)

    # ---------------- 构造 ----------------
    def make_monster(self, name: str, side: str = "foe", x: float = DEFAULT_START_DISTANCE,
                     suffix: str = "") -> Combatant | None:
        m = self.MONSTERS.get(name)
        if not m:
            return None
        hp = _hp_of(m.get("hp", "10"))
        actions = [normalize_action(a, m) for a in m.get("actions", [])]
        return Combatant(
            name=name + suffix, side=side, kind="monster",
            ac=m.get("ac", 10), max_hp=hp, hp=hp,
            dex=m.get("dex", 10), speed=self._parse_speed(m.get("speed", "30 ft.")),
            cr=m.get("cr", "0"), xp=self.CR_XP.get(m.get("cr", "0"), 0),
            x=x, dex_mod=ability_mod(m.get("dex", 10)),
            wis=m.get("wis", 10), intl=m.get("int", 10),
            resist={normalize_damage_type(v) for v in (m.get("resist") or [])},
            immune={normalize_damage_type(v) for v in (m.get("immune") or [])},
            vuln={normalize_damage_type(v) for v in (m.get("vuln") or [])},
            cond_immune=set(m.get("cond_immune") or []),
            actions=actions,
            legendary=[normalize_action(a, m) for a in m.get("legendary", [])],
            traits=list(m.get("traits", [])),
        )

    def make_pc(self, char, x: float = 0.0) -> Combatant:
        from .dice import weapon_dice

        st = char.state
        hp = char.hp()
        weapon = char.ctx.equipment._get_equipped_weapon()
        info = char.ctx.equipment.resolve(weapon)
        can_range = bool(info) and info[0] == "武器" and "远程" in info[1]
        can_sneak = char.has_technique("偷袭要害打击") and char.has_finesse_weapon()
        return Combatant(
            name=f"{st.cls or '冒险者'}", side="party", kind="pc",
            ac=char.ac, max_hp=hp, hp=hp,
            dex=st.attributes["敏捷"], speed=30,
            x=x, dex_mod=ability_mod(st.attributes["敏捷"]),
            wis=st.attributes["感知"], intl=st.attributes["智力"],
            source=char,
            atk_melee=char.attack_bonus(melee=True),
            atk_ranged=char.attack_bonus(melee=False),
            weapon=weapon, weapon_dice=weapon_dice(weapon),
            str_mod=max(ability_mod(st.attributes["力量"]), 0),
            level=max(st.level, 1),
            can_sneak=can_sneak,
            can_range=can_range,
        )

    @staticmethod
    def _parse_speed(s: str) -> int:
        m = re.match(r"^\s*(\d+)", str(s or ""))
        return int(m.group(1)) if m else 30

    def new_battle(self, party: list, foes: list[str | tuple[str, int]],
                   distance: float = DEFAULT_START_DISTANCE) -> Battle:
        """party: Character 列表；foes: 怪物名或 (怪物名, 数量)。"""
        b = Battle(party_levels=[max(c.state.level, 1) for c in party])
        for i, ch in enumerate(party):
            b.combatants.append(self.make_pc(ch, x=0.0))
        n = 1
        for spec in foes:
            name, count = (spec, 1) if isinstance(spec, str) else spec
            for _ in range(count):
                suffix = f" #{n}" if count > 1 else ""
                c = self.make_monster(name, x=distance, suffix=suffix)
                if c:
                    b.combatants.append(c)
                    b.total_xp += c.xp
                n += 1
        self._roll_initiative(b)
        b.log.append(f"战斗开始：{len(b.party())} 名冒险者 vs {len(b.foes())} 个敌人，"
                     f"起始距离 {int(distance)} 尺")
        return b

    def _roll_initiative(self, b: Battle) -> None:
        for c in b.combatants:
            c.init_roll = random.randint(1, 20)
            c.init = c.init_roll + c.dex_mod
        # 排序：先攻高在前；平手比骰面；再平手比敏捷
        idx = sorted(range(len(b.combatants)),
                     key=lambda i: (b.combatants[i].init,
                                    b.combatants[i].init_roll,
                                    b.combatants[i].dex),
                     reverse=True)
        b.order = idx
        b.turn_index = 0
        for i in idx:
            c = b.combatants[i]
            b.log.append(f"先攻: {c.name} {c.init_roll}+{c.dex_mod} = {c.init}")

    # ---------------- 推进 ----------------
    def step(self, b: Battle) -> bool:
        """执行下一个战斗单位的一回合，返回战斗是否仍在进行。"""
        if b.over:
            return False
        i = b.order[b.turn_index % len(b.order)]
        c = b.combatants[i]
        if c.alive or (c.kind == "pc" and c.hp == 0 and c.death_failure < DEATH_SAVE_FAILURES):
            if c.hp <= 0 and c.kind == "pc":
                self._death_save(c, b)
            else:
                self._start_turn(c)
                if c.kind == "monster":
                    self._monster_turn(c, b)
                else:
                    self._pc_turn(c, b)
        # 回合结束 → 清资源；传奇怪物可行动一次
        c.action_used = c.bonus_used = c.reaction_used = False
        self._legendary_phase(b, just_acted=i)
        if self._check_end(b):
            return False
        b.turn_index += 1
        if b.turn_index >= len(b.order):
            b.turn_index = 0
            b.round += 1
        return True

    def run(self, b: Battle, max_rounds: int | None = None) -> dict:
        """把战斗推进到结束（或 max_rounds 回合超时）。"""
        cap = max_rounds or DEFAULT_MAX_ROUNDS
        while not b.over and b.round < cap:
            self.step(b)
        if not b.over:
            b.over = True
            b.winner = "draw"
            b.log.append(f"…{cap} 回合未分胜负，战斗判定为平局")
        return self.result(b)

    def _start_turn(self, c: Combatant) -> None:
        c.move_left = c.speed
        c.reaction_used = False
        # 充能检定
        for a in c.actions:
            if a.get("recharge") and not c.recharge_ready.get(a["name"], True):
                if random.randint(1, 6) >= a["recharge"]:
                    c.recharge_ready[a["name"]] = True

    # ---------------- PC 回合（自动模拟 AI） ----------------
    def _pc_turn(self, c: Combatant, b: Battle) -> None:
        foes = [f for f in b.foes() if f.alive]
        if not foes:
            return
        # 悠悠球治疗：有同伴濒死且自己会治疗言灵 → 优先救
        if self._pc_yo_yo_heal(c, b):
            return
        target = min(foes, key=lambda f: (f.hp, _dist(c, f)))   # 集火最低 HP
        # 施法者优先施法（魔法飞弹 > 火焰箭戏法）
        if self._pc_cast(c, target, b):
            return
        # 选择攻击方式
        used = False
        if c.can_sneak and _dist(c, target) <= MELEE_REACH:
            used = self._pc_attack(c, target, b, sneak=True)
        if not used and _dist(c, target) <= MELEE_REACH:
            used = self._pc_attack(c, target, b, sneak=False)
        if not used and c.can_range:
            used = self._pc_attack(c, target, b, ranged=True)   # 仅持有远程武器时
        if not used:
            self._move_toward(c, target, MELEE_REACH, b)
            if c.move_left <= 0:
                # 疾行：动作用于再移动一次（本回合不再攻击）
                self._move_toward(c, target, MELEE_REACH, b, dash=True)

    def _pc_yo_yo_heal(self, c: Combatant, b: Battle) -> bool:
        ch: object = c.source
        if not ch or not ch.has_technique("治疗言灵"):
            return False
        down = [p for p in b.party() if p.hp <= 0 and p.kind == "pc"
                and p.death_failure < DEATH_SAVE_FAILURES]
        if not down:
            return False
        ok, _ = ch.ctx.slots.spend_slot(1)
        if not ok:
            return False
        healed = random.randint(1, 4) + max(ability_mod(ch.state.attributes["感知"]), 0)
        tgt = down[0]
        tgt.hp = min(tgt.hp + healed, tgt.max_hp)
        b.log.append(f"[{b.round}] {c.name} 治疗言灵 → {tgt.name} 恢复 {healed} HP（{tgt.hp}/{tgt.max_hp}）")
        return True

    def _pc_cast(self, c: Combatant, tgt: Combatant, b: Battle) -> bool:
        """施法者 PC 的法术选择：魔法飞弹（有 1 环位时）> 火焰箭（戏法）。"""
        ch: object = c.source
        if not ch:
            return False
        # 魔法飞弹：自动命中 3d4+3 力场（SRD）
        if ch.has_technique("魔法飞弹"):
            ok, _ = ch.ctx.slots.spend_slot(1)
            if ok:
                dmg = sum(random.randint(1, 4) for _ in range(3)) + 3
                applied = self._apply_damage(tgt, dmg, "力场", b)
                c.damage_dealt += applied
                b.log.append(f"[{b.round}] {c.name} 魔法飞弹（1环）→ {tgt.name} "
                             f"自动命中 3d4+3 = {dmg} 力场伤害（剩余 {tgt.hp}）")
                return True
        # 火焰箭：戏法，施法攻击检定（与 combat._macro_fire_bolt 同一公式）
        if ch.has_technique("火焰箭"):
            atk = ch.ctx.skills.effective_skill_rank("施法攻击")
            roll = random.randint(1, 20)
            total = roll + atk
            crit = roll == CRIT_ROLL
            if total >= tgt.ac or crit:
                dmg = sum(random.randint(1, 10) for _ in range(2 if crit else 1))
                applied = self._apply_damage(tgt, dmg, "火焰", b)
                c.damage_dealt += applied
                b.log.append(f"[{b.round}] {c.name} 火焰箭(戏法) → {tgt.name}: "
                             f"d20+{atk} = {total} vs AC {tgt.ac} ✓ 命中 {dmg} 火焰伤害（剩余 {tgt.hp}）")
            else:
                b.log.append(f"[{b.round}] {c.name} 火焰箭(戏法) → {tgt.name}: "
                             f"d20+{atk} = {total} vs AC {tgt.ac} ✗ 未命中")
            return True
        return False

    def _pc_attack(self, c: Combatant, tgt: Combatant, b: Battle,
                   sneak: bool = False, ranged: bool = False) -> bool:
        """PC 攻击：直接复用 CombatService.resolve_attack（单一公式来源）。"""
        ch: object = c.source
        r = ch.ctx.combat.resolve_attack(
            "ranged" if ranged else "melee", target_ac=tgt.ac, sneak=sneak)
        label = "偷袭" if sneak else ("远程" if ranged else "近战")
        pfx = f"{r['penalty']:+d}" if r["penalty"] else ""
        if not r["hit"]:
            b.log.append(f"[{b.round}] {c.name} {label}攻击 {tgt.name}: "
                         f"d20+{r['atk_bonus']}{pfx} = {r['total']} vs AC {tgt.ac} ✗ 未命中")
            return True
        applied = self._apply_damage(tgt, r["damage"], "", b)
        c.damage_dealt += applied
        b.log.append(f"[{b.round}] {c.name} {label}攻击 {tgt.name}: "
                     f"d20+{r['atk_bonus']}{pfx} = {r['total']} vs AC {tgt.ac} ✓ 命中 "
                     f"{r['dmg_desc']} → {r['damage']} 伤害（剩余 {tgt.hp}）")
        return True

    # ---------------- 怪物回合（AI） ----------------
    def _monster_turn(self, c: Combatant, b: Battle) -> None:
        targets = [t for t in b.party() if t.alive or t.hp <= 0 and t.death_failure < DEATH_SAVE_FAILURES]
        targets = [t for t in targets if t.alive]
        if not targets:
            return
        # 先尝试解除自身状态（克制状态 AI 优先级最高）
        if c.conditions and self._try_recover(c, b):
            pass
        target = self._ai_pick_target(c, targets)
        self._monster_act(c, target, b)

    def _try_recover(self, c: Combatant, b: Battle) -> bool:
        """怪物尝试摆脱可豁免状态（简化：每回合一个状态做豁免判定）。"""
        for cond in list(c.conditions):
            # 震慑/麻痹等无重复豁免的状态跳过（用固定 50% 复原模拟复杂规则）
            if random.random() < 0.5:
                c.conditions.remove(cond)
                b.log.append(f"[{b.round}] {c.name} 摆脱了 {cond}")
                return True
        return False

    def _ai_pick_target(self, c: Combatant, targets: list) -> Combatant:
        """目标选择：最近优先；WIS>=12 时重伤（HP 百分比最低）优先（调研结论）。"""
        if c.wis >= AI_WIS_WOUNDED_THRESHOLD:
            return min(targets, key=lambda t: (t.hp / max(t.max_hp, 1), _dist(c, t)))
        return min(targets, key=lambda t: _dist(c, t))

    def _monster_act(self, c: Combatant, tgt: Combatant, b: Battle) -> None:
        dist = _dist(c, tgt)
        action = self._ai_pick_action(c, tgt, dist)
        if action is None:
            # 无可用攻击 → 接近（必要时疾行）
            self._move_toward(c, tgt, MELEE_REACH, b)
            if _dist(c, tgt) <= MELEE_REACH:
                a = self._best_melee(c, tgt)
                if a:
                    self._resolve_monster_attack(c, tgt, a, b)
            else:
                self._move_toward(c, tgt, MELEE_REACH, b, dash=True)
            return
        if action["kind"] in ("ranged", "special", "spell"):
            self._resolve_monster_attack(c, tgt, action, b)
            return
        # 近战：移动到触及内再打（疾行会消耗动作，疾行后不再攻击）
        self._move_toward(c, tgt, action["reach"], b)
        if _dist(c, tgt) > action["reach"]:
            self._move_toward(c, tgt, action["reach"], b, dash=True)
        if _dist(c, tgt) <= action["reach"] and not c.action_used:
            self._resolve_monster_attack(c, tgt, action, b)

    def _ai_pick_action(self, c: Combatant, tgt: Combatant, dist: float) -> dict | None:
        """动作选择：优先顺序 特殊(充能) > 远程 > 近战；INT 适配抗免（调研结论）。"""
        usable = [a for a in c.actions
                  if a["kind"] != "utility" and not a["is_multi"]
                  and self._recharge_ok(c, a)]
        # INT>=10：规避目标免疫/抗性的伤害类型
        if c.intl >= AI_INT_ADAPT_THRESHOLD:
            adapted = [a for a in usable if a["dmg_type"] not in tgt.immune
                       and a["dmg_type"] not in tgt.resist]
            if adapted:
                usable = adapted
        if not usable:
            return None
        # INT>=18：取期望伤害最大；否则按种类优先级（特殊 > 远程 > 近战）
        if c.intl >= AI_INT_OPTIMAL_THRESHOLD:
            return max(usable, key=lambda a: self._expected_dmg(a, c, tgt))
        for kind in ("special", "spell", "ranged", "melee"):
            for a in usable:
                if a["kind"] == kind and self._in_range(a, dist):
                    return a
        # 无射程内的：退化为伤害最大的任意动作
        return max(usable, key=lambda a: self._expected_dmg(a, c, tgt))

    @staticmethod
    def _recharge_ok(c: Combatant, a: dict) -> bool:
        if not a.get("recharge"):
            return True
        return c.recharge_ready.get(a["name"], True)

    @staticmethod
    def _in_range(a: dict, dist: float) -> bool:
        return dist <= a["reach"]

    @staticmethod
    def _expected_dmg(a: dict, c: Combatant, tgt: Combatant) -> float:
        cnt, die, bonus = parse_dice(a.get("dmg_expr", ""))
        avg = (cnt * (die + 1) / 2 + bonus) if cnt else (8 if a["kind"] == "special" else 0)
        hit_chance = max(0.05, min(0.95, (21 - (tgt.ac - (a.get("atk") or 0))) / 20))
        return avg * hit_chance

    def _best_melee(self, c: Combatant, tgt: Combatant) -> dict | None:
        melee = [a for a in c.actions
                 if a["kind"] == "melee" and not a["is_multi"]
                 and self._recharge_ok(c, a)
                 and a["dmg_type"] not in tgt.immune]
        return max(melee, key=lambda a: self._expected_dmg(a, c, tgt)) if melee else None

    def _move_toward(self, c: Combatant, tgt: Combatant, reach: int, b: Battle,
                     dash: bool = False) -> None:
        dist = _dist(c, tgt)
        need = dist - reach
        if need <= 0:
            return
        step = min(c.move_left, need)
        if step > 0:
            c.x += step if tgt.x > c.x else -step
            c.move_left -= step
            b.log.append(f"[{b.round}] {c.name} 移动 {int(step)} 尺（距离 {int(_dist(c, tgt))} 尺）")
        if dash and c.move_left <= 0 and not c.action_used:
            c.move_left = c.speed
            c.action_used = True
            step = min(c.move_left, max(_dist(c, tgt) - reach, 0))
            if step > 0:
                c.x += step if tgt.x > c.x else -step
                c.move_left -= step
                b.log.append(f"[{b.round}] {c.name} 疾行 {int(step)} 尺（距离 {int(_dist(c, tgt))} 尺）")

    # ---------------- 攻击结算 ----------------
    def _resolve_monster_attack(self, c: Combatant, tgt: Combatant, a: dict, b: Battle) -> None:
        if a["is_multi"]:
            for cnt, sub in a["multi"]:
                for _ in range(cnt):
                    if not tgt.alive:
                        break
                    self._resolve_monster_attack(c, tgt, sub, b)
            return
        adv = self._advantage(c, tgt, melee=a["kind"] == "melee")
        if a.get("save"):
            self._resolve_save_action(c, tgt, a, b, adv)
            return
        roll = self._d20_adv(adv)
        total = roll + (a.get("atk") or 0)
        crit = roll == CRIT_ROLL
        if total < tgt.ac and not crit:
            b.log.append(f"[{b.round}] {c.name}·{a['name']} → {tgt.name}: "
                         f"d20+{a.get('atk') or 0} = {total} vs AC {tgt.ac} ✗ 未命中")
            return
        cnt, die, bonus = parse_dice(a.get("dmg_expr", ""))
        if cnt:
            rolls = [random.randint(1, die) for _ in range(cnt * (2 if crit else 1))]
            dmg = sum(rolls) + bonus
            dmg_desc = f"{cnt}d{die}{bonus:+d} = {rolls}"
        else:
            dmg = 0
            dmg_desc = "无伤害"
        applied = self._apply_damage(tgt, dmg, a["dmg_type"], b)
        c.damage_dealt += applied
        note = "（暴击）" if crit else ""
        b.log.append(f"[{b.round}] {c.name}·{a['name']} → {tgt.name}: "
                     f"d20+{a.get('atk') or 0} = {total} vs AC {tgt.ac} ✓ 命中{note} "
                     f"{dmg_desc} → {dmg} {a['dmg_type']} 伤害（剩余 {tgt.hp}）")
        self._maybe_apply_condition(c, tgt, a, b)

    def _resolve_save_action(self, c: Combatant, tgt: Combatant, a: dict, b: Battle, adv: int) -> None:
        save = a["save"]
        # 目标豁免：fort/ref/will（PC 用自身豁免；怪物用属性近似）
        tgt_bonus = self._save_bonus_of(tgt, save["axis"])
        roll = self._d20_adv(adv)
        passed = roll + tgt_bonus >= save["dc"]
        cnt, die, bonus = parse_dice(a.get("dmg_expr", ""))
        if cnt:
            rolls = [random.randint(1, die) for _ in range(cnt)]
            dmg = sum(rolls) + bonus
            if passed:
                dmg = dmg // 2
        else:
            dmg = 0
        applied = self._apply_damage(tgt, dmg, a["dmg_type"], b)
        c.damage_dealt += applied
        verdict = "豁免通过" if passed else "豁免失败"
        b.log.append(f"[{b.round}] {c.name}·{a['name']} → {tgt.name}: DC {save['dc']} "
                     f"{save['axis']} 豁免 d20+{tgt_bonus} = {roll + tgt_bonus} {verdict}"
                     + (f"，{dmg} {a['dmg_type']} 伤害（剩余 {tgt.hp}）" if cnt else ""))
        if not passed and save["condition"] and save["condition"] not in tgt.cond_immune:
            self._apply_condition(tgt, save["condition"], b)

    @staticmethod
    def _save_bonus_of(t: Combatant, axis: str) -> int:
        if t.kind == "pc" and t.source is not None:
            return t.source.save_bonus(axis)
        attr = {"fort": "con", "ref": "dex", "will": "wis"}[axis]
        return ability_mod(getattr(t, attr, 10))

    # ---------------- 优势/劣势模型 ----------------
    def _advantage(self, attacker: Combatant, target: Combatant,
                   melee: bool = True) -> int:
        """返回 -1 劣势 / 0 正常 / 1 优势。基于状态（SRD 规则）。"""
        adv = 0
        atk_conds = set(attacker.conditions)
        tgt_conds = set(target.conditions)
        if atk_conds & {"目盲", "中毒", "束缚", "震慑", "惊惧"}:
            adv -= 1
        if "隐形" in atk_conds:
            adv += 1
        if "隐形" in tgt_conds:
            adv -= 1
        if tgt_conds & {"束缚", "麻痹", "石化", "昏迷", "震慑"}:
            adv += 1
        if "倒地" in tgt_conds:
            adv += 1 if melee else -1
        if "擒抱" in tgt_conds:
            adv += 0
        return max(-1, min(1, adv))

    def _d20_adv(self, adv: int) -> int:
        r1 = random.randint(1, 20)
        if adv == 0:
            return r1
        r2 = random.randint(1, 20)
        return max(r1, r2) if adv > 0 else min(r1, r2)

    # ---------------- 伤害与状态 ----------------
    def _apply_damage(self, tgt: Combatant, amount: int, dtype: str, b: Battle) -> int:
        dt = normalize_damage_type(dtype)
        if dt and dt in tgt.immune:
            if amount:
                b.log.append(f"  {tgt.name} 免疫 {dt}")
            return 0
        if dt and dt in tgt.resist:
            amount = max(amount // 2, 0)
            if amount:
                b.log.append(f"  {tgt.name} 抵抗 {dt}（减半）")
        if dt and dt in tgt.vuln:
            amount *= 2
            if amount:
                b.log.append(f"  {tgt.name} 易伤 {dt}（加倍）")
        tgt.hp = max(tgt.hp - amount, 0)
        if tgt.hp == 0 and tgt.kind == "pc":
            b.log.append(f"  {tgt.name} 倒地濒死！")
        elif tgt.hp == 0:
            b.log.append(f"  {tgt.name} 被击杀！")
        return amount

    def _apply_condition(self, tgt: Combatant, cond: str, b: Battle) -> None:
        if cond in tgt.cond_immune or cond in tgt.conditions:
            return
        tgt.conditions.append(cond)
        b.log.append(f"  {tgt.name} 陷入 {cond}")

    def _maybe_apply_condition(self, attacker: Combatant, tgt: Combatant,
                               action: dict | None, b: Battle) -> None:
        if action:
            save = action.get("save")
            if save and save.get("condition"):
                return          # 已有豁免结算路径处理
        # 简化：无豁免字段的攻击若文本含状态且未明确豁免，按 25% 概率触发
        if action and action.get("extra"):
            for kw, zh in CONDITION_KEYWORDS.items():
                if re.search(rf"\b{kw}\b", action["extra"], re.I) and random.random() < 0.25:
                    self._apply_condition(tgt, zh, b)
                    return

    # ---------------- 死亡豁免 ----------------
    def _death_save(self, c: Combatant, b: Battle) -> None:
        """濒死 PC 的死亡豁免；已稳定（3 成功）者不再掷。"""
        if c.death_success >= DEATH_SAVE_SUCCESSES:
            b.log.append(f"[{b.round}] {c.name} 伤势已稳定（0 HP）")
            return
        roll = random.randint(1, 20)
        if roll == 20:
            c.hp = 1
            c.death_failure = 0
            b.log.append(f"[{b.round}] {c.name} 死亡豁免掷出 20！恢复 1 HP 重回战斗")
        elif roll == 1:
            c.death_failure += 2
            b.log.append(f"[{b.round}] {c.name} 死亡豁免掷出 1（计 2 次失败，{c.death_failure}/{DEATH_SAVE_FAILURES}）")
        elif roll >= DEATH_SAVE_TARGET:
            c.death_success += 1
            b.log.append(f"[{b.round}] {c.name} 死亡豁免成功（{c.death_success}/{DEATH_SAVE_SUCCESSES}）")
        else:
            c.death_failure += 1
            b.log.append(f"[{b.round}] {c.name} 死亡豁免失败（{c.death_failure}/{DEATH_SAVE_FAILURES}）")
        if c.death_failure >= DEATH_SAVE_FAILURES:
            b.log.append(f"☠ {c.name} 死亡！")

    # ---------------- 传奇动作 ----------------
    def _legendary_phase(self, b: Battle, just_acted: int) -> None:
        for i, c in enumerate(b.combatants):
            if i == just_acted or not c.alive or not c.legendary:
                continue
            targets = [t for t in b.combatants if t.side != c.side and t.alive]
            if not targets:
                continue
            tgt = self._ai_pick_target(c, targets)
            a = max(c.legendary, key=lambda x: self._expected_dmg(x, c, tgt))
            self._resolve_monster_attack(c, tgt, a, b)

    # ---------------- 胜负与结算 ----------------
    def _check_end(self, b: Battle) -> bool:
        # 任一方全部倒下即结束（倒下 = HP 0，无论是否稳定濒死）
        party_alive = any(p.hp > 0 for p in b.party())
        foes_alive = any(f.alive for f in b.foes())
        if not party_alive:
            b.over, b.winner = True, "foe"
            b.log.append(f"战斗结束：冒险者全军覆没（{b.round} 回合）")
            return True
        if not foes_alive:
            b.over, b.winner = True, "party"
            b.log.append(f"战斗结束：冒险者获胜（{b.round} 回合，获得 {b.total_xp} XP）")
            return True
        return False

    def result(self, b: Battle) -> dict:
        alive_party = [p for p in b.party() if p.alive]
        return {
            "winner": b.winner or ("party" if any(p.alive for p in b.party()) else "foe"),
            "rounds": b.round,
            "turns": b.turn_index + b.round * len(b.order),
            "total_xp": b.total_xp,
            "party_hp": sum(p.hp for p in alive_party),
            "party_down": sum(1 for p in b.party() if p.kind == "pc" and p.hp <= 0),
            "foes_left": sum(1 for f in b.foes() if f.alive),
            "log": list(b.log),
        }

    # ---------------- 报告与状态 ----------------
    def report(self, b: Battle) -> str:
        lines = ["=" * 46, f"模拟对战报告（{b.round} 回合结束）", "=" * 46]
        lines.append(f"结果: {'冒险者获胜' if b.winner == 'party' else ('敌人获胜' if b.winner == 'foe' else '平局')}"
                     f" | 敌人总数 {len(b.foes())} | 获得 {b.total_xp} XP")
        lines.append("")
        lines.append("— 战况 —")
        for c in sorted(b.combatants, key=lambda x: (x.side, -x.hp)):
            hpbar = "█" * max(1, round(c.hp / max(c.max_hp, 1) * 16))
            status = ""
            if c.hp <= 0 and c.kind == "pc":
                status = "（濒死/死亡）"
            elif c.hp <= 0:
                status = "（已死亡）"
            elif c.conditions:
                status = f"（{'、'.join(c.conditions)}）"
            lines.append(f"  {c.side == 'party' and '🛡' or '👹'} {c.name:<12s} "
                         f"HP {c.hp:>3d}/{c.max_hp:<3d} {hpbar}{status}")
        lines.append("")
        lines.append("— 战斗日志（最近 30 条）—")
        lines += b.log[-30:]
        return "\n".join(lines)

    def state(self, b: Battle) -> dict:
        return {
            "round": b.round, "over": b.over, "winner": b.winner,
            "combatants": [
                {"name": c.name, "side": c.side, "hp": c.hp, "max_hp": c.max_hp,
                 "ac": c.ac, "conditions": list(c.conditions),
                 "init": c.init, "x": c.x, "cr": c.cr}
                for c in b.combatants
            ],
        }

    # ---------------- 蒙特卡洛 ----------------
    def simulate(self, party: list, foes: list, trials: int = 100,
                 max_rounds: int | None = None, reset_state: bool = True) -> dict:
        """重复对战 trials 次，统计胜率 / 平均回合 / 平均剩余 HP。

        reset_state=True 时每局恢复 PC 的 HP/法术位/条件（模拟不影响玩家状态）。
        """
        wins = draws = losses = 0
        rounds_sum = 0
        hp_sum = 0
        snapshots = [(ch, ch.state.current_hp, dict(ch.state.slots_used), list(ch.state.conditions))
                     for ch in party]
        for _ in range(trials):
            self._restore(snapshots)
            b = self.new_battle(party, foes)
            r = self.run(b, max_rounds)
            if r["winner"] == "party":
                wins += 1
            elif r["winner"] == "foe":
                losses += 1
            else:
                draws += 1
            rounds_sum += r["rounds"]
            hp_sum += r["party_hp"]
        self._restore(snapshots)
        return {
            "trials": trials,
            "win_rate": round(wins / trials, 4),
            "loss_rate": round(losses / trials, 4),
            "draw_rate": round(draws / trials, 4),
            "avg_rounds": round(rounds_sum / trials, 2),
            "avg_remaining_hp": round(hp_sum / trials, 1),
        }

    @staticmethod
    def _restore(snapshots) -> None:
        for ch, hp, slots, conds in snapshots:
            ch.state.current_hp = hp
            ch.state.slots_used = dict(slots)
            ch.state.conditions = list(conds)

    # ---------------- 遭遇构建（DMG 2014） ----------------
    def xp_budget(self, levels: list[int], difficulty: str = "medium") -> int:
        return party_thresholds(levels).get(difficulty, 0)

    def evaluate(self, levels: list[int], monsters: list[str]) -> dict:
        """评估一场遭遇的难度（DMG 2014 阈值 + 遭遇倍数 + 队伍规模调整）。"""
        base_xp = sum(self.CR_XP.get(self.MONSTERS[n]["cr"], 0) for n in monsters if n in self.MONSTERS)
        adjusted = round(base_xp * encounter_multiplier(len(monsters), len(levels)))
        th = party_thresholds(levels)
        difficulty = judge_difficulty(adjusted, th)
        return {
            "monsters": monsters, "base_xp": base_xp, "adjusted_xp": adjusted,
            "multiplier": encounter_multiplier(len(monsters), len(levels)),
            "thresholds": th, "difficulty": difficulty,
            "difficulty_cn": DIFFICULTY_CN[difficulty],
            "daily_budget": sum(DAILY_XP_BUDGET[max(1, min(20, lv))] for lv in levels),
        }

    def build_encounter(self, levels: list[int], difficulty: str = "medium",
                        target_count: int | None = None) -> dict:
        """按队伍等级与难度目标从图鉴选怪编组。

        贪心策略：以「当前档位与下一档位阈值的中点」为调整后 XP 目标，
        优先挑 CR≈队伍均等的怪物（少而精 > 多而杂），最后裁剪小怪把难度拉回目标档。
        """
        th = party_thresholds(levels)
        harder = DIFFICULTIES[min(DIFFICULTIES.index(difficulty) + 1, len(DIFFICULTIES) - 1)]
        target = (th[difficulty] + (th[harder] if difficulty != "deadly" else th["deadly"] * 2)) // 2
        avg_lv = sum(levels) / len(levels)
        pool = sorted(self.MONSTERS.keys(), key=lambda n: abs(self._cr_value(n) - avg_lv))
        max_count = target_count or (4 if difficulty in ("easy", "medium") else 6)
        chosen: list[str] = []
        for n in pool:
            if len(chosen) >= max_count:
                break
            xp = self.CR_XP.get(self.MONSTERS[n]["cr"], 0)
            if xp <= 0:
                continue
            trial = chosen + [n]
            adj = round(sum(self.CR_XP[self.MONSTERS[m]["cr"]] for m in trial)
                        * encounter_multiplier(len(trial), len(levels)))
            if adj > target * 1.25:
                continue
            chosen = trial
            if adj >= th[difficulty]:
                break
        if not chosen:                     # 兜底：取最接近的一个
            chosen = [pool[0]]
        # 裁剪：难度越档时从最小的怪开始移除
        ev = self.evaluate(levels, chosen)
        while ev["difficulty"] != difficulty and len(chosen) > 1:
            smaller = min(chosen, key=lambda m: self.CR_XP[self.MONSTERS[m]["cr"]])
            if smaller == max(chosen, key=lambda m: self.CR_XP[self.MONSTERS[m]["cr"]]):
                break                        # 全是同 CR，无从裁剪
            chosen.remove(smaller)
            ev = self.evaluate(levels, chosen)
        ev["party_levels"] = levels
        return ev

    def _cr_value(self, name: str) -> float:
        cr = self.MONSTERS[name]["cr"]
        if "/" in cr:
            a, b = cr.split("/")
            return int(a) / int(b)
        try:
            return float(cr)
        except ValueError:
            return 99.0
