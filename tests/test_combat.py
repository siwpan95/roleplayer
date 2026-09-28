"""战斗宏测试（固定随机种子保证可重现）。"""
import random
import pytest


class TestCombatDispatch:
    def test_unknown_macro(self, char):
        assert "未知战斗宏" in char.combat_macro("not_a_macro")

    def test_melee_attack_hit(self, seeded_char):
        result = seeded_char.combat_macro("melee_attack", target_ac=5)
        assert "近战攻击" in result

    def test_melee_attack_miss_on_high_ac(self, seeded_char):
        result = seeded_char.combat_macro("melee_attack", target_ac=50)
        assert "未命中" in result


class TestSneakAttack:
    def test_needs_technique(self, seeded_char):
        # 未学偷袭技术时，无精准伤害
        result = seeded_char.combat_macro("sneak_attack", target_ac=5, flat_footed=True)
        assert "偷袭攻击" in result

    def test_rogue_sneak_has_precision_damage(self, char):
        # 游荡者 + 偷袭技术 + 灵巧武器 → 命中时按职业等级给精准伤害
        char.set_class("游荡者")
        char.level_to(3)                 # 3 级游荡者 → 2d6
        char.set_attribute("力量", 16)
        char.purchase_skill("近战攻击", 12)
        char.purchase_technique("偷袭要害打击")
        char.equip_item("匕首")          # 灵巧武器
        random.seed(1)
        result = char.combat_macro("sneak_attack", target_ac=2, flat_footed=True)
        assert "精准伤害" in result
        assert "2d6" in result

    def test_no_sneak_without_finesse(self, char):
        # 游荡者 + 偷袭技术，但装备非灵巧武器 → 无精准伤害
        char.set_class("游荡者")
        char.level_to(3)
        char.set_attribute("力量", 16)
        char.purchase_skill("近战攻击", 12)
        char.purchase_technique("偷袭要害打击")
        char.equip_item("长剑")          # 非灵巧武器
        random.seed(1)
        result = char.combat_macro("sneak_attack", target_ac=2, flat_footed=True)
        # 无灵巧武器不应有精准伤害
        assert "精准伤害" not in result


class TestPowerAttack:
    def test_needs_technique(self, seeded_char):
        result = seeded_char.combat_macro("power_attack", target_ac=10)
        assert "未学会" in result

    def test_power_attack_works(self, fighter):
        fighter.set_attribute("力量", 13)
        fighter.purchase_technique("猛力攻击")
        random.seed(1)
        result = fighter.combat_macro("power_attack", target_ac=5)
        assert "猛力攻击" in result


class TestWhirlwind:
    def test_needs_technique(self, seeded_char):
        assert "未学会" in seeded_char.combat_macro("whirlwind", num_targets=2)

    def test_multi_target(self, fighter):
        fighter.set_attribute("力量", 15)
        fighter.purchase_skill("近战攻击", 10)
        fighter.purchase_technique("旋风切割")
        random.seed(1)
        result = fighter.combat_macro("whirlwind", num_targets=3, target_ac=30)
        assert "目标1" in result and "目标3" in result


class TestSpells:
    def test_fireball_8d6(self, char):
        # 用充足 CP 构建施法者
        mage = type(char)(starting_cp=500)
        mage.set_attribute("智力", 18)
        mage.purchase_skill("奥术施法", 15)
        ok, _ = mage.purchase_technique("火球术")
        assert ok, "应能学会火球术"
        ok, _ = mage.buy_slot(3)          # 扩充规则：法术需法术位
        assert ok
        random.seed(1)
        result = mage.combat_macro("fireball", dc=1, num_targets=1)
        assert "8d6" in result
        assert "火焰" in result

    def test_fireball_needs_tech(self, char):
        assert "未学会" in char.combat_macro("fireball")

    def test_magic_missile_auto_hit(self, char):
        char.set_attribute("智力", 14)
        char.purchase_skill("奥术施法", 10)
        char.purchase_technique("魔法飞弹")
        char.buy_slot(1)
        random.seed(1)
        result = char.combat_macro("magic_missile", num_targets=1)
        assert "自动命中" in result
        assert "力场伤害" in result

    def test_healing_word(self, char):
        char.set_attribute("智力", 14)
        char.purchase_skill("奥术施法", 10)
        char.purchase_technique("治疗言灵")
        char.buy_slot(1)
        result = char.combat_macro("healing_word")
        assert "治疗言灵" in result
        assert "生命恢复" in result


class TestGurpsTechniques:
    def test_deceptive_attack_needs_tech(self, seeded_char):
        assert "未学会" in seeded_char.combat_macro("deceptive_attack")

    def test_deceptive_attack_too_low_skill(self, char):
        char.set_attribute("力量", 11)
        char.purchase_skill("近战攻击", 10)  # 有效等级 10，-2 后 = 8 < 10
        char.purchase_technique("欺诈攻击")
        result = char.combat_macro("deceptive_attack", target_ac=10)
        assert "不足" in result or "无法" in result or "低于10" in result

    def test_deceptive_attack_works(self, fighter):
        # 近战 12，-2 后 = 10，刚好不 < 10
        fighter.purchase_technique("欺诈攻击")
        random.seed(1)
        result = fighter.combat_macro("deceptive_attack", target_ac=8)
        assert "欺诈攻击" in result

    def test_rapid_strike_two_attacks(self, fighter):
        fighter.set_attribute("力量", 16)
        fighter.purchase_skill("近战攻击", 12)
        fighter.purchase_technique("连环打击")
        random.seed(1)
        result = fighter.combat_macro("rapid_strike", target_ac=20)
        assert "第1击" in result and "第2击" in result

    def test_allout_strong_bonus(self, fighter):
        fighter.purchase_technique("全力强击")
        random.seed(1)
        result = fighter.combat_macro("allout_strong", target_ac=2)
        assert "全力强击" in result and "无法防御" in result

    def test_allout_determined_plus4(self, fighter):
        fighter.purchase_technique("精准突击")
        random.seed(1)
        result = fighter.combat_macro("allout_determined", target_ac=2)
        assert "精准突击" in result and "+4" in result


class TestSneakDiceLogic:
    def test_dice_follows_rogue_level(self, char):
        # 游荡者偷袭骰随职业等级成长（SRD：1→1d6, 3→2d6, 5→3d6, 9→5d6, 19/20→10d6）
        cases = {1: 1, 3: 2, 5: 3, 9: 5, 19: 10, 20: 10}
        for level, expected in cases.items():
            c = type(char)(starting_cp=5000)
            c.set_class("游荡者")
            if level > 1:
                c.level_to(level)
            c.equip_item("匕首")
            assert c._sneak_attack_dice() == expected, f"游荡者 {level} 级应 {expected}d6"

    def test_zero_without_rogue_class(self, char):
        # 非游荡者职业（战士）→ 无偷袭骰
        char.set_class("战士")
        char.equip_item("匕首")
        assert char._sneak_attack_dice() == 0

    def test_zero_without_class(self, char):
        # 未选职业 → 无偷袭骰
        char.equip_item("匕首")
        assert char._sneak_attack_dice() == 0

    def test_zero_without_finesse(self, char):
        # 游荡者但无灵巧武器 → 无偷袭骰
        char.set_class("游荡者")
        char.equip_item("长剑")
        assert char._sneak_attack_dice() == 0
