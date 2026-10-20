"""roleplayer.combat 边界测试：补齐「从未被执行过」的法术宏与远程攻击宏。

覆盖率依据（修复前）：_macro_ranged_attack / _macro_fire_bolt / _macro_ray_of_frost /
_macro_scorching_ray / _macro_lightning_bolt / _macro_cone_of_cold / _macro_meteor_swarm
均为 0 覆盖（每个函数仅 entry 行被执行到）。
"""
import os
import random
import sys

import pytest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from roleplayer import Character
from roleplayer.data import SPELL_RINGS


@pytest.fixture
def mage():
    """高 CP 施法者：奥术施法 17，可学全部测试用法术。"""
    m = Character(starting_cp=5000)
    m.set_attribute("智力", 18)
    m.purchase_skill("奥术施法", 17)
    return m


@pytest.fixture
def archer():
    """远程攻击者。"""
    a = Character(starting_cp=500)
    a.set_attribute("敏捷", 16)
    a.purchase_skill("远程攻击", 12)
    a.equip_item("长弓")
    return a


# =============================================================================
#  远程攻击宏（此前 0 覆盖）
# =============================================================================
class TestRangedAttack:
    def test_ranged_attack_hits_on_low_ac(self, archer):
        random.seed(1)
        out = archer.combat_macro("ranged_attack", target_ac=2)
        assert "远程攻击" in out
        assert "命中" in out

    def test_ranged_attack_misses_on_impossible_ac(self, archer):
        random.seed(1)
        out = archer.combat_macro("ranged_attack", target_ac=99)
        assert "未命中" in out

    def test_ranged_attack_ignores_sharpshooter_without_feat(self, archer):
        """未拥有「神射手」专长时，sharpshooter=True 不得产生 -5/+10。"""
        random.seed(1)
        out = archer.combat_macro("ranged_attack", target_ac=10, sharpshooter=True)
        assert "神射手" not in out

    def test_ranged_attack_sharpshooter_applies_penalty_and_bonus(self, archer):
        archer.add_feat("神射手")
        random.seed(1)
        out = archer.combat_macro("ranged_attack", target_ac=2, sharpshooter=True)
        assert "神射手" in out
        assert "-5" in out          # 攻击惩罚
        assert "+10(神射)" in out   # 伤害加成


# =============================================================================
#  戏法：火焰箭 / 霜冻射线（此前 0 覆盖）
# =============================================================================
class TestCantrips:
    def test_fire_bolt_needs_technique(self, mage):
        assert "未学会" in mage.combat_macro("fire_bolt")

    def test_fire_bolt_hit_reports_fire_damage(self, mage):
        mage.purchase_technique("火焰箭")
        random.seed(1)
        out = mage.combat_macro("fire_bolt", target_ac=2)
        assert "火焰箭" in out
        assert "1d10" in out
        assert "火焰" in out

    def test_fire_bolt_miss_on_impossible_ac(self, mage):
        mage.purchase_technique("火焰箭")
        random.seed(1)
        assert "未命中" in mage.combat_macro("fire_bolt", target_ac=99)

    def test_ray_of_frost_needs_technique(self, mage):
        assert "未学会" in mage.combat_macro("ray_of_frost")

    def test_ray_of_frost_hit_reports_cold_damage(self, mage):
        mage.purchase_technique("霜冻射线")
        random.seed(1)
        out = mage.combat_macro("ray_of_frost", target_ac=2)
        assert "霜冻射线" in out
        assert "1d8" in out
        assert "寒冷" in out

    def test_ray_of_frost_miss_on_impossible_ac(self, mage):
        mage.purchase_technique("霜冻射线")
        random.seed(1)
        assert "未命中" in mage.combat_macro("ray_of_frost", target_ac=99)


# =============================================================================
#  环位法术（此前 0 覆盖）
# =============================================================================
class TestRangedSpellMacros:
    def test_scorching_ray_needs_technique(self, mage):
        assert "未学会" in mage.combat_macro("scorching_ray")

    def test_scorching_ray_fires_three_rays_at_base_ring(self, mage):
        mage.purchase_technique("灼热射线")
        mage.buy_slot(2)
        random.seed(1)
        out = mage.combat_macro("scorching_ray", target_ac=2)
        assert "3道" in out
        assert "第1道" in out and "第2道" in out and "第3道" in out
        assert "共造成" in out

    def test_scorching_ray_upcast_adds_one_ray_per_ring(self, mage):
        mage.purchase_technique("灼热射线")
        mage.buy_slot(2)
        mage.buy_slot(3)
        random.seed(1)
        out = mage.combat_macro("scorching_ray", target_ac=2, upcast=3)
        assert "3环" in out
        assert "第4道" in out

    def test_scorching_ray_without_slot_fails_cleanly(self, mage):
        mage.purchase_technique("灼热射线")
        out = mage.combat_macro("scorching_ray", target_ac=2)
        assert "施法失败" in out

    def test_scorching_ray_all_rays_can_miss(self, mage):
        mage.purchase_technique("灼热射线")
        mage.buy_slot(2)
        random.seed(1)
        out = mage.combat_macro("scorching_ray", target_ac=99)
        assert out.count("未命中") == 3
        assert "共造成 0" in out

    def test_lightning_bolt_needs_technique(self, mage):
        assert "未学会" in mage.combat_macro("lightning_bolt")

    def test_lightning_bolt_rolls_8d6_on_success(self, mage):
        mage.purchase_technique("闪电束")
        mage.buy_slot(3)
        random.seed(1)
        out = mage.combat_macro("lightning_bolt", dc=1)
        assert "8d6" in out
        assert "闪电" in out

    def test_lightning_bolt_fails_when_dc_unreachable(self, mage):
        mage.purchase_technique("闪电束")
        mage.buy_slot(3)
        out = mage.combat_macro("lightning_bolt", dc=999)
        assert "施法失败" in out

    def test_cone_of_cold_rolls_8d8_on_success(self, mage):
        mage.purchase_technique("寒冰锥")
        mage.buy_slot(5)
        random.seed(1)
        out = mage.combat_macro("cone_of_cold", dc=1)
        assert "8d8" in out
        assert "寒冷" in out

    def test_cone_of_cold_fails_when_dc_unreachable(self, mage):
        mage.purchase_technique("寒冰锥")
        mage.buy_slot(5)
        out = mage.combat_macro("cone_of_cold", dc=999)
        assert "施法失败" in out

    def test_meteor_swarm_needs_technique(self, mage):
        assert "未学会" in mage.combat_macro("meteor_swarm")

    def test_meteor_swarm_rolls_40d6_on_success(self, mage):
        mage.purchase_technique("陨石雨")
        mage.buy_slot(9)
        random.seed(1)
        out = mage.combat_macro("meteor_swarm", dc=1)
        assert "40d6" in out
        assert "火焰" in out

    def test_meteor_swarm_fails_without_ninth_ring_slot(self, mage):
        """已学会但没有 9 环法术位 → 应报「无可用 9 环法术位」而不是崩溃。"""
        mage.purchase_technique("陨石雨")
        out = mage.combat_macro("meteor_swarm", dc=1)
        assert "施法失败" in out
        assert "9 环" in out


# =============================================================================
#  上环（upcast）夹取规则
# =============================================================================
class TestUpcastClamping:
    def test_fireball_upcast_below_base_ring_clamps_to_base(self, mage):
        """火球术是 3 环；upcast=1 必须仍按 3 环结算，不得降环。"""
        mage.purchase_technique("火球术")
        mage.buy_slot(3)
        random.seed(1)
        out = mage.combat_macro("fireball", dc=1, upcast=1)
        assert "3环" in out
        assert "8d6" in out

    def test_fireball_upcast_adds_one_d6_per_ring(self, mage):
        mage.purchase_technique("火球术")
        mage.buy_slot(3)
        mage.buy_slot(4)
        random.seed(1)
        out = mage.combat_macro("fireball", dc=1, upcast=4)
        assert "9d6" in out

    def test_magic_missile_upcast_adds_one_missile_per_ring(self, mage):
        mage.purchase_technique("魔法飞弹")
        mage.buy_slot(1)
        mage.buy_slot(3)
        random.seed(1)
        out = mage.combat_macro("magic_missile", upcast=3)
        assert "3环，5发" in out

    def test_magic_missile_multi_target_split(self, mage):
        mage.purchase_technique("魔法飞弹")
        mage.buy_slot(1)
        random.seed(1)
        out = mage.combat_macro("magic_missile", num_targets=2)
        assert "分散打击" in out

    def test_healing_word_needs_technique(self, mage):
        assert "未学会" in mage.combat_macro("healing_word")

    def test_healing_word_fails_without_slot(self, mage):
        mage.purchase_technique("治疗言灵")
        assert "施法失败" in mage.combat_macro("healing_word")

    def test_healing_word_restores_hp_after_damage(self, mage):
        mage.purchase_technique("治疗言灵")
        mage.buy_slot(1)
        mage.purchase_skill("活力", 4)
        mage.take_damage(10)
        hurt = mage.state.current_hp
        out = mage.combat_macro("healing_word")
        assert mage.state.current_hp > hurt, "治疗言灵应实际回复 HP"
        assert "生命恢复" in out


# =============================================================================
#  龙息（状态机：一次性资源）
# =============================================================================
class TestDragonBreath:
    def test_rejected_for_non_dragonborn(self):
        c = Character(starting_cp=300)
        assert "非龙裔" in c.combat_macro("dragon_breath")

    def test_dragonborn_can_use_once(self):
        c = Character(starting_cp=300)
        c.set_race("龙裔")
        random.seed(1)
        out = c.combat_macro("dragon_breath")
        assert "龙息" in out
        assert "2d6" in out

    def test_dragonborn_second_use_same_turn_is_blocked(self):
        """重复操作：未休息前二次使用必须被拒绝（状态机非法流转）。"""
        c = Character(starting_cp=300)
        c.set_race("龙裔")
        random.seed(1)
        c.combat_macro("dragon_breath")
        assert "已使用" in c.combat_macro("dragon_breath")

    def test_dragon_breath_is_element_tagged(self):
        c = Character(starting_cp=300)
        c.set_race("龙裔")
        random.seed(1)
        out = c.combat_macro("dragon_breath")
        assert "伤害" in out


# =============================================================================
#  参数边界
# =============================================================================
class TestParameterBoundaries:
    def test_unknown_macro_name_returns_message(self):
        c = Character()
        assert "未知战斗宏" in c.combat_macro("definitely_not_a_macro")

    def test_empty_macro_name_returns_message(self):
        c = Character()
        assert "未知战斗宏" in c.combat_macro("")

    def test_whirlwind_with_zero_targets_has_no_target_lines(self):
        c = Character(starting_cp=500)
        c.set_attribute("力量", 15)
        c.purchase_skill("近战攻击", 10)
        c.purchase_technique("旋风切割")
        out = c.combat_macro("whirlwind", num_targets=0)
        assert "旋风切割" in out
        assert "目标1" not in out

    def test_whirlwind_with_negative_targets_has_no_target_lines(self):
        c = Character(starting_cp=500)
        c.set_attribute("力量", 15)
        c.purchase_skill("近战攻击", 10)
        c.purchase_technique("旋风切割")
        out = c.combat_macro("whirlwind", num_targets=-5)
        assert "目标1" not in out

    def test_power_attack_two_handed_scales_str_mod(self):
        c = Character(starting_cp=500)
        c.set_attribute("力量", 17)      # 调整值 +3 → 双手 *1.5 = 4
        c.purchase_skill("近战攻击", 12)
        c.purchase_technique("猛力攻击")
        random.seed(1)
        one = c.combat_macro("power_attack", target_ac=2)
        c2 = Character(starting_cp=500)
        c2.set_attribute("力量", 17)
        c2.purchase_skill("近战攻击", 12)
        c2.purchase_technique("猛力攻击")
        random.seed(1)
        two = c2.combat_macro("power_attack", target_ac=2, two_handed=True)
        assert one != two, "双手猛力应与单手伤害不同"
        assert "猛力攻击" in two

    def test_allout_strong_two_handed_scales_str_mod(self):
        c = Character(starting_cp=500)
        c.set_attribute("力量", 17)
        c.purchase_skill("近战攻击", 12)
        c.purchase_technique("全力强击")
        random.seed(1)
        out = c.combat_macro("allout_strong", target_ac=2, two_handed=True)
        assert "全力强击" in out
        assert "无法防御" in out

    def test_magic_missile_zero_targets_reports_single_target(self, mage):
        mage.purchase_technique("魔法飞弹")
        mage.buy_slot(1)
        random.seed(1)
        out = mage.combat_macro("magic_missile", num_targets=0)
        assert "单目标" in out


# =============================================================================
#  resolve_attack 结构化契约（battle.py 与 combat.py 共用的单一公式）
# =============================================================================
class TestResolveAttackContract:
    def test_crit_on_natural_twenty_doubles_weapon_dice(self):
        """强制 d20=20：必须判定暴击，且按武器骰追加额外骰。"""
        c = Character(starting_cp=500)
        c.set_attribute("力量", 16)
        c.purchase_skill("近战攻击", 12)
        c.equip_item("匕首")
        original = c.ctx.dice.d20_roll
        c.ctx.dice.d20_roll = lambda *a, **k: 20
        try:
            r = c.ctx.combat.resolve_attack("melee", target_ac=99)
        finally:
            c.ctx.dice.d20_roll = original
        assert r["crit"] is True
        assert r["hit"] is True, "自然 20 必须命中，哪怕 AC 不可能达到"
        assert r["crit_bonus"] > 0, "暴击应追加武器骰"

    def test_natural_one_crit_flag_false(self):
        c = Character(starting_cp=500)
        c.set_attribute("力量", 16)
        c.purchase_skill("近战攻击", 12)
        c.equip_item("匕首")
        original = c.ctx.dice.d20_roll
        c.ctx.dice.d20_roll = lambda *a, **k: 1
        try:
            r = c.ctx.combat.resolve_attack("melee", target_ac=1)
        finally:
            c.ctx.dice.d20_roll = original
        assert r["crit"] is False
        assert r["hit"] is True          # AC 1 必中
        assert r["crit_bonus"] == 0

    def test_result_contract_keys_present(self):
        c = Character(starting_cp=500)
        c.equip_item("匕首")
        r = c.ctx.combat.resolve_attack("melee", target_ac=10)
        for k in ("kind", "roll", "atk_bonus", "penalty", "total", "crit",
                  "hit", "weapon", "damage", "dmg_desc", "str_mod"):
            assert k in r, f"resolve_attack 结果缺少字段 {k}"

    def test_ranged_attack_excludes_str_mod(self):
        c = Character(starting_cp=500)
        c.set_attribute("力量", 20)      # 力量调整值 +5，远程不应计入
        c.purchase_skill("远程攻击", 12)
        c.equip_item("长弓")
        r = c.ctx.combat.resolve_attack("ranged", target_ac=5)
        assert r["str_mod"] == 0, "远程攻击不应加力量调整值"

    def test_melee_attack_includes_str_mod(self):
        c = Character(starting_cp=500)
        c.set_attribute("力量", 20)
        c.purchase_skill("近战攻击", 12)
        c.equip_item("长剑")
        r = c.ctx.combat.resolve_attack("melee", target_ac=5)
        assert r["str_mod"] == 5

    def test_element_affinity_floors_ones_to_twos(self, mage):
        """元素亲和：对应元素的伤害骰 1 应被抬到 2。"""
        mage.purchase_technique("火焰箭")
        ok, msg = mage.add_feat("元素亲和", "火")
        assert ok, f"应能选取火元素亲和: {msg}"
        assert mage.ctx.feats.element_picked() == "火"
        # 强制 randint 恒返回 1
        real = random.randint
        random.randint = lambda a, b: 1
        try:
            rolls = mage.ctx.combat._dmg_rolls(3, 6, "火")
            rolls_wrong_elem = mage.ctx.combat._dmg_rolls(3, 6, "寒")
            rolls_no_elem = mage.ctx.combat._dmg_rolls(3, 6, "")
        finally:
            random.randint = real
        assert rolls_no_elem == [1, 1, 1], "未指定元素时不应抬升"
        assert rolls_wrong_elem == [1, 1, 1], "非亲和元素不应抬升"
        assert rolls == [2, 2, 2], "火元素亲和应把 1 抬到 2"
