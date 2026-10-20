"""GURPS 战斗引擎 / 条件生效 / 点经济 / 社交反应 的端到端测试。

这些测试锁定本次「全量搭建完整架构」的核心交付：
1. GURPS 真的有独立战斗引擎（不再悄悄退回 roleplayer.battle）；
2. 主动防御三选一（闪避/招架/格挡）、命中部位、伤口倍率、休克/击倒均按规则书生效；
3. 条件（震慑/眩晕…）真正修正检定；
4. GURPS 点数购买（属性/优缺点/技能）可计算可构建；
5. 社交反应子系统（data_social）真正接入遭遇层。
"""
import random

import pytest

from roleplayer import Character
from roleplayer.core import Context

from troupe.composition import mount_troupe
from troupe.ruleset_gurps import GurpsRuleset
from troupe.combat_gurps import (
    GurpsCombatant, build_pc_combatant, build_monster_combatant, run_gurps_combat,
)
from troupe.data_world import (
    parry, block, shock_penalty, condition_modifier_of, wound_multiplier,
    HIT_LOCATIONS, LOCATION_WOUND,
)
from troupe.contracts import CheckRequest
from troupe.character_gurps import build_gurps_character, gurps_point_total


# --------------------------------------------------------------------------- #
#  1. 战斗单位映射
# --------------------------------------------------------------------------- #
def _gurps_rs():
    return GurpsRuleset(rng=None, config={})


def test_pc_combatant_maps_six_attrs_to_gurps():
    char = Character.random(3, seed=11)
    char.state.attributes.update({"力量": 13, "敏捷": 14, "智力": 12, "体质": 11})
    c = build_pc_combatant(char, _gurps_rs())
    assert c.st == 13 and c.dx == 14 and c.iq == 12 and c.ht == 11
    # 闪避 = floor((DX+HT)/4)+3 = floor(25/4)+3 = 6+3 = 9
    assert c.dodge_base == 9
    # 近战武器技能 = DX+2 = 16；招架 = 3 + 16//2 = 11
    assert c.weapon_skill == 16
    assert c.parry_val == 11


def test_monster_combatant_maps_dnd_stats_to_gurps():
    m = build_monster_combatant("哥布林")
    # 哥布林 str/dex/con/int = 10；HP 基础 7；武器技能 = DX+atk(4) = 14
    assert m.st == 10 and m.dx == 10 and m.ht == 10
    assert m.max_hp == 7
    assert m.weapon_skill == 14
    assert m.dmg_dice is not None and len(m.dmg_dice) == 3  # (n, die, adds)


def test_unknown_monster_falls_back_gracefully():
    m = build_monster_combatant("不存在的怪物XYZ")
    assert m.max_hp >= 1
    assert m.side == "foes"


# --------------------------------------------------------------------------- #
#  2. 主动防御三选一
# --------------------------------------------------------------------------- #
def test_active_defense_picks_best_of_three():
    # 招架值高于闪避 → 应选招架
    c = GurpsCombatant(name="x", side="party", st=10, dx=10, iq=10, ht=10,
                       max_hp=10, dodge_base=8, parry_val=12, block_val=5)
    val, kind = c.active_defense()
    assert kind == "招架" and val == 12
    # 去掉招架 → 应退回闪避
    c.parry_val = 0
    val, kind = c.active_defense()
    assert kind == "闪避" and val == 8
    # 格挡高于闪避 → 选格挡
    c.block_val = 15
    val, kind = c.active_defense()
    assert kind == "格挡" and val == 15


def test_retreat_adds_three_to_dodge():
    c = GurpsCombatant(name="x", side="party", st=10, dx=10, iq=10, ht=10,
                       max_hp=10, dodge_base=8)
    _, _ = c.active_defense(retreating=True)
    # 撤退仅影响闪避路径；招架/格挡不变，故最高值仍为闪避 8+3=11
    val, kind = c.active_defense(retreating=True)
    assert kind == "闪避" and val == 11


def test_incapacitated_cannot_defend():
    c = GurpsCombatant(name="x", side="party", st=10, dx=10, iq=10, ht=10,
                       max_hp=10, dodge_base=15, conditions=["束缚"])
    val, kind = c.active_defense()
    assert kind == "束缚" and val == 0


# --------------------------------------------------------------------------- #
#  3. resolve_attack：命中→防御→部位→伤口倍率→休克/击倒
# --------------------------------------------------------------------------- #
class _SeqRand:
    """可播种、按序列循环返回骰面的伪随机源，用于确定性攻击测试。"""
    def __init__(self, seq):
        self.seq = list(seq) or [1]
        self.i = 0
    def randint(self, a, b):
        v = self.seq[self.i % len(self.seq)]
        self.i += 1
        return v
    def random(self):
        # roll_location 用 .random() 决定部位；固定中值 → 腿
        return 0.5


class _FakeRng:
    def __init__(self, seq):
        self._seq = seq
    def stream(self, name):
        return _SeqRand(self._seq)


def test_resolve_attack_miss_when_skill_zero():
    rs = _gurps_rs()
    rs.rng = _FakeRng([3, 3, 3, 3, 3, 3])  # 攻击骰=9 必大于技能0
    atk = GurpsCombatant(name="a", side="party", st=10, dx=10, iq=10, ht=10,
                         max_hp=10, dodge_base=10, weapon_skill=0, dtype="挥砍")
    dfs = GurpsCombatant(name="d", side="foes", st=10, dx=10, iq=10, ht=10,
                         max_hp=10, dodge_base=0)
    out = rs.resolve_attack(atk, dfs)
    assert out["hit"] is False
    assert "未命中" in out["text"]


def test_resolve_attack_lands_damage_with_location_and_multiplier():
    rs = _gurps_rs()
    # 攻击骰=3（大成功必中），防御骰=18（必失守），部位骰=先掷一个 random 决定部位
    # 序列：命中(3) 防御(18) 部位(1→躯干) 伤害骰(2 颗) 击倒骰(6)
    rs.rng = _FakeRng([3, 18, 1, 4, 4, 6])
    atk = GurpsCombatant(name="a", side="party", st=14, dx=14, iq=14, ht=14,
                         max_hp=20, dodge_base=10, weapon_skill=30, dtype="挥砍",
                         swing=(2, 0))
    dfs = GurpsCombatant(name="d", side="foes", st=10, dx=10, iq=10, ht=10,
                         max_hp=30, dodge_base=0)
    out = rs.resolve_attack(atk, dfs)
    assert out["hit"] is True
    assert out["location"] in {loc for loc, _ in HIT_LOCATIONS}
    assert out["damage"] >= 1
    # 伤口倍率应与 data_world 一致（挥砍×1.5，躯干×1 → 1.5）
    expected_mult = wound_multiplier(out["location"], "挥砍")
    assert abs(out["multiplier"] - expected_mult) < 1e-6
    # 受伤后应产生休克
    assert out["shock"] == shock_penalty(out["damage"])


def test_wound_multiplier_head_is_deadly():
    # 头骨伤害倍率应远高于躯干
    assert wound_multiplier("头骨", "穿刺") > wound_multiplier("躯干", "穿刺")
    assert LOCATION_WOUND["头骨"] == 4.0


# --------------------------------------------------------------------------- #
#  4. 条件真正修正检定
# --------------------------------------------------------------------------- #
def test_condition_modifier_feeds_into_gurps_check():
    char = Character.random(3, seed=21)
    char.state.attributes.update({"力量": 14})
    char.state.conditions = ["震慑"]
    rs = _gurps_rs()
    res = rs.check(char, CheckRequest(actor="pc", kind="attribute", key="力量",
                                      label="力量检定"))
    # 基础=14，震慑 -4 → 目标=10
    assert res.target == 10
    assert "-4(状态)" in res.text


def test_condition_modifier_table_present():
    assert condition_modifier_of(["震慑"], "check") == -4
    assert condition_modifier_of(["震慑"], "defense") == -4
    # 倒地 Prone：攻击 -4 / 防御 -3（2026-08-30 联网核对修正）
    assert condition_modifier_of(["倒地"], "attack") == -4
    assert condition_modifier_of(["倒地"], "defense") == -3


# --------------------------------------------------------------------------- #
#  5. GURPS 点经济
# --------------------------------------------------------------------------- #
def test_gurps_point_total_attribute_cost():
    # 全 10 属性 = 0 点
    assert gurps_point_total(st=10, dx=10, iq=10, ht=10) == 0
    # 力量 13（+3×10=30）
    assert attribute_cost_checkable()


def attribute_cost_checkable():
    from troupe.character_gurps import attribute_point_cost
    return attribute_point_cost(13) == 30


def test_build_gurps_character_and_points_of_roundtrip():
    char, pts = build_gurps_character(
        {"力量": 13, "敏捷": 12, "智力": 11, "体质": 12},
        advantages=["警觉"], disadvantages=["鲁莽"], skills={"近战攻击": 2},
        seed=1, name="点侠")
    rs = _gurps_rs()
    # points_of 应从 flags 回算，与构建时一致
    assert rs.points_of(char) == pts
    assert pts > 0


# --------------------------------------------------------------------------- #
#  6. encounter.combat 按规则集分派（gurps 不走 roleplayer.battle）
# --------------------------------------------------------------------------- #
def _make_sim(ruleset):
    from troupe.simulator import Simulator
    return Simulator.quick(seed=42, ruleset=ruleset, level=3, count=2)


def test_gurps_combat_does_not_use_d20_battle():
    sim = _make_sim("gurps")
    # 若误走 roleplayer.battle，Character.battle_create 会被调用——这里打桩验证它不被调用
    called = {"battle_create": False}
    orig = Character.battle_create
    def spy(self, *a, **k):
        called["battle_create"] = True
        return orig(self, *a, **k)
    Character.battle_create = spy
    try:
        res = sim.ctx.encounter.combat(sim.party, ["哥布林", "哥布林"], distance=60)
    finally:
        Character.battle_create = orig
    assert called["battle_create"] is False, "GURPS 战斗不应调用 roleplayer.battle"
    assert res["winner"] in ("party", "foes")
    assert isinstance(res.get("report"), str) and "GURPS" in res["report"]


def test_dnd_combat_still_uses_d20_battle():
    sim = _make_sim("dnd5e")
    called = {"battle_create": False}
    orig = Character.battle_create
    def spy(self, *a, **k):
        called["battle_create"] = True
        return orig(self, *a, **k)
    Character.battle_create = spy
    try:
        res = sim.ctx.encounter.combat(sim.party, ["哥布林", "哥布林"], distance=60)
    finally:
        Character.battle_create = orig
    assert called["battle_create"] is True, "D&D 战斗必须走 roleplayer.battle"
    assert res["winner"] in ("party", "foes")


def test_run_gurps_combat_produces_valid_result():
    party = [Character.random(4, seed=3), Character.random(4, seed=4)]
    res = run_gurps_combat(party, ["哥布林"], _gurps_rs(), distance=60, max_rounds=50)
    assert res["winner"] in ("party", "foes", "none")
    assert res["rounds"] >= 1
    assert "report" in res and "result" in res


# --------------------------------------------------------------------------- #
#  7. 社交反应子系统接入
# --------------------------------------------------------------------------- #
def test_social_reaction_shifts_disposition():
    sim = _make_sim("gurps")
    npc = sim.ctx.npc.generate()
    before = npc.disposition
    res = sim.ctx.encounter.social({"tactic": "讲理"}, npc_id=npc.id)
    assert res["npc"] == npc.id
    assert res["attitude_before"] == before
    assert "text" in res and res["outcome"] in ("敌对", "冷淡", "中立", "友善", "盟友")
    # 讲理无失败代价、无金钱成本
    assert res["fail_cost"] == 0 and res["gold_spent"] == 0


def test_social_threat_has_risk():
    sim = _make_sim("dnd5e")
    npc = sim.ctx.npc.generate()
    res = sim.ctx.encounter.social({"tactic": "威胁"}, npc_id=npc.id)
    # 威胁失手会带来态度恶化代价
    assert res["fail_cost"] <= 0
    assert res["tactic"] == "威胁"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
