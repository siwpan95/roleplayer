"""技术（战技/法术）系统测试。"""
import pytest


class TestPurchaseTechnique:
    def test_purchase_success(self, fighter):
        # 近战攻击 12 ≥ 5，可学偷袭要害打击
        ok, msg = fighter.purchase_technique("偷袭要害打击")
        assert ok
        assert "偷袭要害打击" in fighter.techniques

    def test_already_owned(self, fighter):
        fighter.purchase_technique("偷袭要害打击")
        ok, msg = fighter.purchase_technique("偷袭要害打击")
        assert not ok
        assert "已拥有" in msg

    def test_prereq_skill_not_met(self, char):
        # 未学近战攻击
        ok, msg = char.purchase_technique("偷袭要害打击")
        assert not ok
        assert "近战攻击" in msg and "5" in msg

    def test_prereq_rank_not_met(self, char):
        char.purchase_skill("近战攻击", 4)  # < 5
        ok, msg = char.purchase_technique("偷袭要害打击")
        assert not ok

    def test_attribute_prereq(self, char):
        # 猛力攻击需力量 13
        char.purchase_skill("近战攻击", 11)  # 满足技能要求 1
        ok, msg = char.purchase_technique("猛力攻击")
        assert not ok
        assert "力量" in msg and "13" in msg
        char.set_attribute("力量", 13)
        ok, _ = char.purchase_technique("猛力攻击")
        assert ok

    def test_insufficient_cp(self, char):
        # 先满足全部前置（力量13 + 近战攻击11），再把 CP 耗光
        char.set_attribute("力量", 13)
        char.purchase_skill("近战攻击", 11)
        char.cp = 0  # 耗光 CP
        ok, msg = char.purchase_technique("猛力攻击")
        assert not ok
        assert "CP不足" in msg

    def test_spell_prereq(self, char):
        # 火球术需奥术施法 5 级
        ok, msg = char.purchase_technique("火球术")
        assert not ok
        assert "奥术施法" in msg
        char.purchase_skill("奥术施法", 11)  # 11 ≥ 5
        ok, _ = char.purchase_technique("火球术")
        assert ok

    def test_unknown_technique(self, char):
        ok, msg = char.purchase_technique("不存在的技术")
        assert not ok

    def test_has_technique_helper(self, fighter):
        assert not fighter.has_technique("火球术")
        fighter.purchase_skill("奥术施法", 11)
        fighter.purchase_technique("火球术")
        assert fighter.has_technique("火球术")
