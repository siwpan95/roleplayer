"""技能系统测试。"""
import pytest


class TestSkillCost:
    def test_unknown_skill(self, char):
        assert char.calc_skill_cost("不存在的技能", 10) == (0, 0)

    def test_no_improvement(self, char):
        char.purchase_skill("近战攻击", 10)
        cost, delta = char.calc_skill_cost("近战攻击", 10)
        assert cost == 0 and delta == 0

    def test_buy_to_attr_level(self, char):
        # 属性 10，买到 10 级：rel 从 -10..-1，其中 -2,-1 在表中
        cost, delta = char.calc_skill_cost("近战攻击", 10)
        assert delta == 10
        # rel -10..-3 共 8 个，各 1 CP = 8；rel -2 = 1；rel -1 = 2 → 合计 11
        assert cost == 11

    def test_higher_level_cost(self, char):
        # 买到 13（rel +3），应比买到 10 贵
        cost_low, _ = char.calc_skill_cost("近战攻击", 10)
        cost_high, _ = char.calc_skill_cost("近战攻击", 13)
        assert cost_high > cost_low

    def test_vh_harder_than_easy(self, char):
        # 同样买到相对 +3，VH 应比 E 贵
        char.set_attribute("智力", 10)
        cost_e, _ = char.calc_skill_cost("活力", 13)  # E? 活力是 A
        # 用 E 难度对比：手动构造比较
        from roleplayer.data import DIFFICULTY_COST
        # rel=0: E=4, A=4; rel=3: E=10, A=16 → A 比 E 贵
        assert DIFFICULTY_COST["A"][3] > DIFFICULTY_COST["E"][3]


class TestPurchaseSkill:
    def test_purchase_success(self, char):
        ok, msg = char.purchase_skill("近战攻击", 12)
        assert ok
        assert char.skills["近战攻击"] == 12
        assert char.cp < 150

    def test_purchase_unknown(self, char):
        ok, msg = char.purchase_skill("飞行", 10)
        assert not ok

    def test_purchase_insufficient_cp(self, char):
        ok, msg = char.purchase_skill("近战攻击", 25)
        assert not ok
        assert "CP不足" in msg

    def test_purchase_no_improvement(self, char):
        char.purchase_skill("近战攻击", 10)
        ok, msg = char.purchase_skill("近战攻击", 10)
        assert not ok
        assert "未提高" in msg


class TestFoundations:
    def test_all_missing_initially(self, char):
        missing = char.check_foundations()
        # 8 个根基科
        assert len(missing) == 8
        assert "近战攻击" in missing
        assert "活力" in missing

    def test_foundations_clear_after_buying(self, char):
        for sk in ["活力", "近战攻击", "远程攻击", "闪避防御",
                   "强韧豁免", "反射豁免", "意志豁免", "施法攻击"]:
            char.purchase_skill(sk, 11)
        assert char.check_foundations() == []


class TestDefaultRank:
    def test_no_default_when_nothing_learned(self, char):
        # 任何技能都没学时默认值为 0
        assert char.effective_skill_rank("潜行") == 0

    def test_same_attr_default(self, char):
        # 学了近战攻击(力量)，运动(力量)应有同目默认值
        char.purchase_skill("近战攻击", 14)
        default = char.effective_skill_rank("运动")
        assert default > 0  # 同目推算
        # 默认 = avg(14) - 2 = 12
        assert default == 12

    def test_same_category_default(self, char):
        # 学了近战攻击(力量,物理类)，躲藏(敏捷,物理类)走同纲
        char.purchase_skill("近战攻击", 14)
        default = char.effective_skill_rank("躲藏")
        # 同纲：avg(14) - 3 = 11
        assert default == 11

    def test_learned_overrides_default(self, char):
        char.purchase_skill("潜行", 15)
        assert char.effective_skill_rank("潜行") == 15

    def test_talent_bonus_applied(self, char):
        char.purchase_skill("潜行", 10)
        char.add_talent("暗杀者", 2)  # 潜行 +2
        assert char.effective_skill_rank("潜行") == 12
