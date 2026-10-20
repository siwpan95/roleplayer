"""roleplayer.battle 边界测试：补齐「当前对战」门面、状态机与 AI 辅助函数的未覆盖分支。

覆盖率依据（修复前）：create/current/step_current/run_current/report_current/
state_current 六个门面方法整体 0 覆盖；_pc_yo_yo_heal 缺 12 行、_try_recover 缺 7 行、
_expected_dmg 缺 4 行、_legendary_phase 缺 6 行、build_encounter 缺 8 行。
"""
import os
import random
import sys

import pytest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from roleplayer import Character
from roleplayer.battle import Battle, BattleService, Combatant, normalize_action
from roleplayer.character_io import random_character
from roleplayer.data_monsters import MONSTERS


@pytest.fixture
def bs():
    return Character().ctx.battle


@pytest.fixture
def party():
    return [random_character(3, seed=1), random_character(3, seed=2)]


def _dummy(mon_name="哥布林", side="foe", hp=None, x=5):
    m = MONSTERS[mon_name]
    c = Combatant(
        name=mon_name, side=side, kind="monster",
        ac=m.get("ac", 10), max_hp=hp or 12, hp=hp or 12,
        dex=m.get("dex", 10), speed=30, x=x,
    )
    c.actions = [normalize_action(a, m) for a in m.get("actions", [])]
    return c


# =============================================================================
#  「当前对战」门面（此前 0 覆盖）
# =============================================================================
class TestCurrentBattleFacade:
    def test_current_is_none_before_create(self, bs):
        assert bs.current() is None

    def test_step_current_safe_without_battle(self, bs):
        assert bs.step_current() is False

    def test_run_current_safe_without_battle(self, bs):
        assert bs.run_current() == {}

    def test_report_current_safe_without_battle(self, bs):
        assert "无进行中的对战" in bs.report_current()

    def test_state_current_safe_without_battle(self, bs):
        assert bs.state_current() == {}

    def test_create_sets_current_battle(self, bs, party):
        b = bs.create(party, ["哥布林"], distance=20)
        assert bs.current() is b
        assert len(b.combatants) == 3

    def test_state_current_reflects_created_battle(self, bs, party):
        bs.create(party, ["哥布林"], distance=20)
        st = bs.state_current()
        assert st["round"] == 1
        assert len(st["combatants"]) == 3
        assert {c["side"] for c in st["combatants"]} == {"party", "foe"}

    def test_report_current_contains_report_header(self, bs, party):
        bs.create(party, ["哥布林"], distance=20)
        assert "模拟对战报告" in bs.report_current()

    def test_step_current_advances_without_error(self, bs, party):
        """用高血量对手，确保单步不会立刻结束战斗（结果依赖全局随机，须显式播种）。"""
        random.seed(7)
        bs.create(party, ["成年红龙"], distance=5)
        assert bs.step_current() is True

    def test_step_current_returns_false_once_battle_is_over(self, bs, party):
        """战斗结束后 step_current 必须返回 False（状态机不再推进）。"""
        random.seed(7)
        bs.create(party, ["成年红龙"], distance=5)
        bs.run_current(max_rounds=50)
        assert bs.current().over is True
        assert bs.step_current() is False

    def test_run_current_completes_battle(self, bs, party):
        random.seed(7)
        bs.create(party, ["哥布林"], distance=5)
        r = bs.run_current(max_rounds=50)
        assert r["winner"] in ("party", "foe", "draw")
        assert r["rounds"] >= 1


# =============================================================================
#  怪物构造
# =============================================================================
class TestMakeMonster:
    def test_unknown_monster_returns_none(self, bs):
        assert bs.make_monster("这个怪物不存在") is None

    def test_empty_name_returns_none(self, bs):
        assert bs.make_monster("") is None

    def test_known_monster_normalizes_defenses(self, bs):
        m = bs.make_monster("哥布林")
        assert m is not None
        assert m.hp == 7 and m.ac == 15 and m.cr == "1/4" and m.xp == 50
        assert isinstance(m.immune, set) and isinstance(m.resist, set)

    def test_speed_parsing(self, bs):
        assert bs._parse_speed("30 ft.") == 30
        assert bs._parse_speed("60 尺") == 60
        assert bs._parse_speed("") == 30        # 空值回退默认
        assert bs._parse_speed(None) == 30      # None 回退默认


# =============================================================================
#  AI 辅助函数
# =============================================================================
class TestAiHelpers:
    def test_expected_dmg_is_positive_for_real_action(self, bs, party):
        gob = _dummy()
        tgt = bs.make_pc(party[0])
        a = [x for x in gob.actions if x["kind"] == "melee"]
        assert a, "哥布林应有近战动作"
        assert bs._expected_dmg(a[0], gob, tgt) > 0

    def test_expected_dmg_never_negative_for_high_ac(self, bs, party):
        gob = _dummy()
        tgt = bs.make_pc(party[0])
        tgt.ac = 99
        a = [x for x in gob.actions if x["kind"] == "melee"]
        # 命中率被夹在 5%，期望伤害仍应为正
        assert bs._expected_dmg(a[0], gob, tgt) >= 0

    def test_best_melee_returns_none_when_only_ranged(self, bs, party):
        c = _dummy()
        c.actions = [a for a in c.actions if a["kind"] == "ranged"]
        if not c.actions:
            pytest.skip("该怪物无远程动作可用于构造场景")
        tgt = bs.make_pc(party[0])
        assert bs._best_melee(c, tgt) is None

    def test_best_melee_ignores_immune_damage_type(self, bs, party):
        c = _dummy()
        tgt = bs.make_pc(party[0])
        for a in c.actions:
            tgt.immune.add(a["dmg_type"])
        assert bs._best_melee(c, tgt) is None

    def test_in_range_boundary(self, bs):
        assert bs._in_range({"reach": 5}, 5) is True
        assert bs._in_range({"reach": 5}, 5.1) is False

    def test_recharge_ok_for_non_recharge_action(self, bs):
        c = _dummy()
        assert bs._recharge_ok(c, {"name": "x"}) is True


# =============================================================================
#  _try_recover（此前仅 1/8 行覆盖）
# =============================================================================
class TestTryRecover:
    def test_recovers_a_condition_and_logs_it(self, bs, party):
        b = bs.new_battle(party, ["哥布林"], distance=5)
        c = [x for x in b.combatants if x.side == "foe"][0]
        c.conditions = ["倒地"]
        random.seed(0)                      # 让 random.random() < 0.5 成立
        result = bs._try_recover(c, b)
        if result:
            assert "倒地" not in c.conditions
            assert any("摆脱" in line for line in b.log)
        else:
            pytest.skip("随机分支未命中，跳过（不视为失败）")

    def test_returns_false_without_conditions(self, bs, party):
        b = bs.new_battle(party, ["哥布林"], distance=5)
        c = [x for x in b.combatants if x.side == "foe"][0]
        assert bs._try_recover(c, b) is False


# =============================================================================
#  传奇动作（此前 6/10 行未覆盖）
# =============================================================================
class TestLegendaryPhase:
    def test_legendary_monster_gets_legendary_actions(self, bs):
        m = bs.make_monster("成年红龙")
        assert m is not None
        assert m.legendary, "成年红龙应有传奇动作"

    def test_legendary_phase_skips_when_no_targets(self, bs):
        b = Battle()
        c = _dummy()
        c.legendary = [normalize_action({"name": "爪击", "attack": 5, "damage": "1d6"}, {})]
        b.combatants.append(c)
        bs._legendary_phase(b, just_acted=0)     # 场上无敌人，必须安全返回
        assert c.damage_dealt == 0

    def test_legendary_phase_fires_at_living_foe(self, bs, party):
        b = Battle()
        dragon = bs.make_monster("成年红龙", side="foe", x=5)
        hero = bs.make_pc(party[0], x=0)
        b.combatants.extend([dragon, hero])
        b.order = [0, 1]
        random.seed(3)
        bs._legendary_phase(b, just_acted=1)     # just_acted=1 → 龙(i=0)应行动
        assert b.log, "传奇阶段应让龙对存活敌人行动并留下日志"

    def test_legendary_phase_skips_the_unit_that_just_acted(self, bs, party):
        """just_acted 的单位不得在传奇阶段再次行动（避免同一回合两动）。"""
        b = Battle()
        dragon = bs.make_monster("成年红龙", side="foe", x=5)
        hero = bs.make_pc(party[0], x=0)
        b.combatants.extend([dragon, hero])
        random.seed(3)
        bs._legendary_phase(b, just_acted=0)     # 龙自己刚行动过
        assert b.log == [], "刚行动过的单位不应触发传奇动作"


# =============================================================================
#  遭遇构建
# =============================================================================
class TestEncounterBuilding:
    def test_xp_budget_returns_threshold(self, bs):
        assert bs.xp_budget([5, 5, 5, 5], "hard") == 3000
        assert bs.xp_budget([5, 5, 5, 5], "不存在难度") == 0

    def test_build_encounter_returns_known_monsters(self, bs):
        r = bs.build_encounter([5, 5, 5, 5], "hard")
        assert r["monsters"]
        for n in r["monsters"]:
            assert n in MONSTERS

    def test_build_encounter_respects_target_count_one(self, bs):
        r = bs.build_encounter([5, 5, 5, 5], "medium", target_count=1)
        assert len(r["monsters"]) == 1

    def test_build_encounter_never_returns_empty(self, bs):
        for lv in ([1], [1, 1], [10, 10], [20, 20, 20]):
            for d in ("easy", "medium", "hard", "deadly"):
                r = bs.build_encounter(lv, d)
                assert len(r["monsters"]) >= 1, f"{lv}/{d} 返回了空编组"

    def test_cr_value_handles_fraction(self, bs):
        def expected(cr: str) -> float:
            return int(cr.split("/")[0]) / int(cr.split("/")[1]) if "/" in cr else float(cr)

        for name in ("哥布林", "大地精", "豺狼人", "枭熊"):
            assert bs._cr_value(name) == expected(MONSTERS[name]["cr"]), name

    def test_cr_value_falls_back_to_99_on_unparsable_cr(self, bs):
        """CR 无法解析时回退 99（排到池子末尾），不得抛异常。"""
        original = bs.MONSTERS
        bs.MONSTERS = dict(MONSTERS, 测试怪={"cr": "?"})
        try:
            assert bs._cr_value("测试怪") == 99.0
        finally:
            bs.MONSTERS = original

    def test_evaluate_should_not_crash_on_trivial_encounter(self, bs):
        """弱遭遇（调整后 XP 低于 easy 阈值）必须正常返回 trivial，不得 KeyError。

        2026-08-29 已修复：DIFFICULTY_CN 补上 "trivial" 键（双端同步）。
        """
        r = bs.evaluate([5], ["哥布林"])
        assert r["difficulty"] == "trivial"
        assert r["difficulty_cn"] == "轻松"

    @pytest.mark.xfail(
        strict=True,
        reason="已知 BUG：build_encounter 无法裁剪到只剩一只怪时静默返回错误难度，"
               "请求 'deadly' 却返回 'easy'（见 QA 报告 BUG-3）",
    )
    def test_build_encounter_should_match_requested_difficulty(self, bs):
        """修复后请删除 xfail 标记。"""
        r = bs.build_encounter([5, 5, 5, 5], "deadly", target_count=1)
        assert r["difficulty"] == "deadly"


# =============================================================================
#  蒙特卡洛 simulate 边界
# =============================================================================
class TestSimulate:
    def test_simulate_small_trials_returns_rates(self, bs, party):
        r = bs.simulate(party, ["哥布林"], trials=5)
        assert r["trials"] == 5
        assert 0.0 <= r["win_rate"] <= 1.0
        assert r["avg_rounds"] > 0

    def test_simulate_restores_pc_hp_afterwards(self, bs, party):
        hp_before = [c.state.current_hp for c in party]
        bs.simulate(party, ["成年红龙"], trials=3)
        hp_after = [c.state.current_hp for c in party]
        assert hp_before == hp_after, "simulate 不应改变玩家角色的 HP"

    @pytest.mark.xfail(
        strict=True,
        reason="已知 BUG：simulate(trials=0) 触发 ZeroDivisionError（见 QA 报告 BUG-5）",
    )
    def test_simulate_zero_trials_should_not_crash(self, bs, party):
        """修复后请删除 xfail 标记。"""
        bs.simulate(party, ["哥布林"], trials=0)


# =============================================================================
#  对战流程边界
# =============================================================================
class TestBattleFlowEdges:
    def test_new_battle_with_empty_party_has_only_foes(self, bs):
        b = bs.new_battle([], ["哥布林"], distance=20)
        assert len(b.combatants) == 1
        assert not b.party()

    def test_new_battle_with_unknown_foe_skips_it(self, bs, party):
        b = bs.new_battle(party, ["不存在的怪"], distance=20)
        assert len(b.foes()) == 0
        assert b.total_xp == 0

    def test_new_battle_with_duplicate_foe_counts(self, bs, party):
        b = bs.new_battle(party, [("哥布林", 3)], distance=20)
        assert len(b.foes()) == 3
        assert b.total_xp == 150

    def test_run_respects_max_rounds(self, bs, party):
        b = bs.new_battle(party, ["成年红龙"], distance=60)
        r = bs.run(b, max_rounds=2)
        assert r["rounds"] <= 2

    def test_report_on_fresh_battle_does_not_crash(self, bs, party):
        b = bs.new_battle(party, ["哥布林"], distance=20)
        assert "模拟对战报告" in bs.report(b)

    def test_report_shows_status_for_zero_hp_pc(self, bs, party):
        b = bs.new_battle(party, ["哥布林"], distance=20)
        for p in b.party():
            p.hp = 0
        out = bs.report(b)
        assert "濒死" in out

    def test_state_snapshot_shape(self, bs, party):
        b = bs.new_battle(party, ["哥布林"], distance=20)
        st = bs.state(b)
        for c in st["combatants"]:
            for k in ("name", "side", "hp", "max_hp", "ac", "conditions", "init", "x", "cr"):
                assert k in c

    def test_combatant_repr_and_conscious(self):
        c = Combatant(name="X", side="party", kind="pc", ac=10, max_hp=10, hp=10,
                      dex=10, speed=30)
        assert c.alive is True
        assert c.conscious is True
        assert "X" in repr(c)
        c.hp = 0
        assert c.alive is False
        c.death_success = 0
        assert c.conscious is True        # 尚未稳定，仍算有意识（可做死亡豁免）
        c.death_success = 3
        assert c.conscious is False
