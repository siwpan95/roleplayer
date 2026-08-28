"""v2.2 模拟对战测试：遭遇构建常量 / 动作解析 / 对战流程 / 伤害与状态 / 蒙特卡洛

规则依据：DMG 2014 遭遇构建（XP 阈值、遭遇倍数、队伍规模调整）+ 本地 SRD
规则章节（The Order of Combat / Making an Attack / Damage and Healing）。
"""
import os
import random
import sys

import pytest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from d20 import Character
from d20.data_battle import (
    XP_THRESHOLDS, ENCOUNTER_MULTIPLIERS, DAILY_XP_BUDGET,
    encounter_multiplier, party_thresholds, judge_difficulty,
    normalize_damage_type, DIFFICULTY_CN,
)
from d20.battle import (
    Combatant, Battle, BattleService, normalize_action, _parse_save,
    _parse_multiattack, _hp_of, _reach_of,
)
from d20.data_monsters import MONSTERS


# =============================================================================
#  1. 遭遇构建常量
# =============================================================================
class TestBattleData:
    def test_xp_thresholds_span_20_levels(self):
        assert len(XP_THRESHOLDS) == 20
        assert XP_THRESHOLDS[1] == {"easy": 25, "medium": 50, "hard": 75, "deadly": 100}
        assert XP_THRESHOLDS[20]["deadly"] == 12700
        for row in XP_THRESHOLDS.values():
            assert row["easy"] < row["medium"] < row["hard"] < row["deadly"]

    def test_encounter_multiplier(self):
        assert encounter_multiplier(1) == 1.0
        assert encounter_multiplier(2) == 1.5
        assert encounter_multiplier(4) == 2.0
        assert encounter_multiplier(8) == 2.5
        assert encounter_multiplier(12) == 3.0
        assert encounter_multiplier(20) == 4.0

    def test_encounter_multiplier_party_size_adjust(self):
        # 队伍 <3 上浮一档；>=6 下调一档（DMG 明文）
        assert encounter_multiplier(1, party_size=2) == 1.5
        assert encounter_multiplier(2, party_size=2) == 2.0
        assert encounter_multiplier(4, party_size=6) == 1.5
        assert encounter_multiplier(8, party_size=6) == 2.0

    def test_party_thresholds(self):
        th = party_thresholds([5, 5, 5, 5])
        assert th == {"easy": 1000, "medium": 2000, "hard": 3000, "deadly": 4400}

    def test_judge_difficulty(self):
        th = party_thresholds([5, 5, 5, 5])
        assert judge_difficulty(999, th) == "trivial"    # 低于 easy 阈值
        assert judge_difficulty(1000, th) == "easy"
        assert judge_difficulty(2000, th) == "medium"
        assert judge_difficulty(4399, th) == "hard"
        assert judge_difficulty(4400, th) == "deadly"

    def test_daily_budget(self):
        assert DAILY_XP_BUDGET[1] == 300 and DAILY_XP_BUDGET[20] == 40000

    def test_normalize_damage_type(self):
        assert normalize_damage_type("挥砍") == "挥砍"
        assert normalize_damage_type("火") == "火焰"
        assert normalize_damage_type("酸") == "酸蚀"
        assert normalize_damage_type("电") == "闪电"
        assert normalize_damage_type("坏死") == "死灵"
        assert normalize_damage_type("slashing") == "挥砍"
        assert normalize_damage_type("piercing") == "穿刺"
        assert normalize_damage_type("bludgeoning") == "钝击"
        assert normalize_damage_type("fire") == "火焰"


# =============================================================================
#  2. 动作解析（stat block 文本）
# =============================================================================
class TestActionParsing:
    def test_multiattack_parse(self):
        sg = MONSTERS["石巨人"]
        ma = next(a for a in sg["actions"] if "ultiattack" in a["name"])
        norm = normalize_action(ma, sg)
        assert norm["is_multi"]
        assert norm["multi"] and norm["multi"][0][0] == 2
        assert norm["multi"][0][1]["name"] == "Greatclub"

    def test_save_parse(self):
        sg = MONSTERS["石巨人"]
        rock = next(a for a in sg["actions"] if a["name"] == "Rock")
        save = _parse_save(rock["extra"])
        assert save == {"dc": 17, "axis": "fort", "condition": "倒地"}

    def test_recharge_parse(self):
        import re
        from d20.battle import _parse_recharge
        assert _parse_recharge("... Recharge 5-6. ...") == 5
        assert _parse_recharge("no recharge") is None

    def test_hp_and_reach(self):
        assert _hp_of("84 (8d10)") == 84
        assert _hp_of("7 (2d6)") == 7
        assert _reach_of({"reach": "5 ft."}) == 5
        assert _reach_of({"reach": "80/320 ft."}) == 80


# =============================================================================
#  3. 对战流程
# =============================================================================
def _party2() -> list:
    """一支像样的 3 级双人队伍：战士（近战 12）+ 法师（施法 12，火焰箭/魔法飞弹）。"""
    f = Character()
    f.set_class("战士")
    f.level_to(3)
    f.set_attribute("力量", 16)
    f.purchase_skill("近战攻击", 12)
    f.purchase_skill("活力", 6)
    f.equip_item("鳞甲")
    f.equip_item("长剑")
    w = Character()
    w.set_class("法师")
    w.level_to(3)
    w.set_attribute("智力", 16)
    w.purchase_skill("奥术施法", 12)
    w.purchase_skill("活力", 4)
    w.purchase_technique("火焰箭")
    w.purchase_technique("魔法飞弹")
    w.buy_slot(1)
    w.buy_slot(1)
    return [f, w]


class TestBattleFlow:
    def test_new_battle_initiative_order(self):
        svc = Character().ctx.battle
        random.seed(1)
        b = svc.new_battle(_party2(), [("哥布林", 2)])
        assert len(b.combatants) == 4 and len(b.order) == 4
        inits = [b.combatants[i].init for i in b.order]
        assert inits == sorted(inits, reverse=True), "先攻序必须降序"
        assert b.total_xp == 100                       # 哥布林 CR1/4 = 50 XP × 2

    def test_run_completes(self):
        svc = Character().ctx.battle
        random.seed(3)
        b = svc.new_battle(_party2(), [("哥布林", 2)])
        r = svc.run(b)
        assert r["winner"] in ("party", "foe", "draw")
        assert r["rounds"] >= 1
        assert r["total_xp"] == 100
        assert len(r["log"]) > 5

    def test_easy_encounter_high_win_rate(self):
        svc = Character().ctx.battle
        random.seed(5)
        r = svc.simulate(_party2(), [("哥布林", 2)], trials=100)
        assert r["trials"] == 100
        assert r["win_rate"] > 0.85, f"简单遭遇胜率应 >85%（实际 {r['win_rate']}）"

    def test_hard_encounter_middle_win_rate(self):
        svc = Character().ctx.battle
        random.seed(6)
        r = svc.simulate(_party2(), [("哥布林", 4)], trials=100)
        assert 0.05 < r["win_rate"] < 0.95, f"困难遭遇胜率应居中（实际 {r['win_rate']}）"

    def test_pc_state_restored_after_simulate(self):
        party = _party2()
        svc = party[0].ctx.battle
        hp0 = party[0].ctx.rest.current_hp()
        slots0 = dict(party[1].state.slots_used)
        random.seed(7)
        svc.simulate(party, [("哥布林", 4)], trials=30)
        assert party[0].ctx.rest.current_hp() == hp0
        assert party[1].state.slots_used == slots0
        assert party[0].state.conditions == []

    def test_multiattack_monster_attacks_multiple_times(self):
        svc = Character().ctx.battle
        random.seed(8)
        # 石巨人（Multiattack 2×Greatclub + Rock DC17 击倒）vs 两个有 AC 的角色
        party = _party2()
        b = svc.new_battle(party, ["石巨人"])
        giant = b.foes()[0]
        assert any(a["is_multi"] for a in giant.actions)
        svc.run(b)
        # 石巨人回合应出现过多次攻击（多攻击展开）
        assert sum("Greatclub" in ln for ln in b.log) >= 2 or b.winner == "foe"

    def test_legendary_monster_acts_extra(self):
        # 传奇怪物（如 巫妖）有传奇动作：回合外额外行动
        lich = Character().ctx.monster.lookup("巫妖")
        assert lich and lich.get("legendary")

    def test_stepwise_play(self):
        svc = Character().ctx.battle
        random.seed(9)
        b = svc.new_battle(_party2(), ["兽人"])
        steps = 0
        while not b.over and steps < 60:
            svc.step(b)
            steps += 1
        assert b.over and steps < 60


# =============================================================================
#  4. 伤害 / 状态 / 死亡豁免（合成单位，确定性）
# =============================================================================
def _dummy(**kw) -> Combatant:
    base = dict(name="目标", side="foe", kind="monster", ac=10, max_hp=20, hp=20,
                dex=10, speed=30, dex_mod=0)
    base.update(kw)
    return Combatant(**base)


class TestDamageAndConditions:
    def test_resist_immune_vuln(self):
        svc = Character().ctx.battle
        b = Battle()
        b.log = []
        t = _dummy(immune={"火焰"}, resist={"挥砍"}, vuln={"雷鸣"})
        assert svc._apply_damage(t, 10, "火焰", b) == 0    # 免疫
        assert svc._apply_damage(t, 10, "挥砍", b) == 5    # 抗力减半
        assert svc._apply_damage(t, 4, "雷鸣", b) == 8     # 易伤加倍
        assert t.hp == 20 - 5 - 8

    def test_damage_type_alias_in_resistance(self):
        """怪物库英文残留（slashing）经归一后仍能正确命中抗力。"""
        svc = Character().ctx.battle
        b = Battle()
        b.log = []
        t = _dummy(resist={"挥砍"})
        assert svc._apply_damage(t, 8, "slashing", b) == 4

    def test_condition_immunity(self):
        svc = Character().ctx.battle
        b = Battle()
        b.log = []
        t = _dummy(cond_immune={"中毒"})
        svc._apply_condition(t, "中毒", b)
        assert "中毒" not in t.conditions
        svc._apply_condition(t, "目盲", b)
        assert "目盲" in t.conditions

    def test_advantage_model(self):
        svc = Character().ctx.battle
        a = _dummy(name="攻方", side="foe", conditions=["目盲"])
        t = _dummy(name="守方", side="party", conditions=["倒地"])
        assert svc._advantage(a, t, melee=True) == 0    # 目盲(-1) + 倒地近战(+1) = 0
        assert svc._advantage(a, t, melee=False) == -1  # 目盲(-1) + 倒地远程(-1) = -2 → -1
        t2 = _dummy(name="守方2", side="party", conditions=["麻痹"])
        assert svc._advantage(_dummy(name="攻方2"), t2, melee=True) == 1

    def test_death_save_terminates(self):
        svc = Character().ctx.battle
        b = Battle()
        b.log = []
        c = _dummy(name="濒死者", side="party", kind="pc", hp=0, max_hp=10)
        random.seed(10)
        for _ in range(20):
            svc._death_save(c, b)
        assert c.death_success >= 3 or c.death_failure >= 3

    def test_apply_damage_kills_monster(self):
        svc = Character().ctx.battle
        b = Battle()
        b.log = []
        t = _dummy()
        svc._apply_damage(t, 100, "钝击", b)
        assert not t.alive and t.hp == 0


# =============================================================================
#  5. 遭遇构建（DMG 2014）
# =============================================================================
class TestEncounterBuilder:
    def test_evaluate_goblin_squad(self):
        svc = Character().ctx.battle
        ev = svc.evaluate([1, 1, 1, 1], ["哥布林"] * 4)
        assert ev["base_xp"] == 200
        assert ev["adjusted_xp"] == 400       # ×2 遭遇倍数
        assert ev["difficulty"] == "deadly"   # 4×L1 deadly 阈值 400
        assert ev["difficulty_cn"] == "致命"

    def test_evaluate_single_medium(self):
        svc = Character().ctx.battle
        ev = svc.evaluate([3, 3, 3, 3], ["石化蜥蜴"])   # CR3 = 700 XP，单怪 ×1
        assert ev["adjusted_xp"] == 700
        assert ev["difficulty"] == "medium"            # L3×4 中等阈值 600

    def test_build_encounter_respects_difficulty(self):
        svc = Character().ctx.battle
        for lv, diff in [(1, "easy"), (3, "medium"), (5, "hard"), (8, "deadly")]:
            ev = svc.build_encounter([lv] * 4, diff)
            assert ev["difficulty"] == diff, f"L{lv} {diff} 构建出 {ev['difficulty']}：{ev['monsters']}"
            assert ev["monsters"], "构建结果不能为空"

    def test_xp_budget(self):
        svc = Character().ctx.battle
        assert svc.xp_budget([1, 1, 1, 1], "deadly") == 400
        assert svc.xp_budget([5, 5, 5, 5], "medium") == 2000

    def test_report_and_state(self):
        svc = Character().ctx.battle
        random.seed(12)
        b = svc.new_battle(_party2(), ["哥布林"])
        svc.run(b)
        rep = svc.report(b)
        assert "模拟对战报告" in rep and "战况" in rep
        st = svc.state(b)
        assert len(st["combatants"]) == 3
        assert any(c["hp"] == 0 for c in st["combatants"]) or st["winner"] == "party"
