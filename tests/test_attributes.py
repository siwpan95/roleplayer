"""属性购买系统测试。"""
import pytest

from roleplayer.attributes import calc_attribute_cost


class TestAttributeCost:
    def test_base_10_free(self):
        assert calc_attribute_cost(10) == 0

    def test_below_10_no_refund(self):
        # 变体系统：低于 10 不退款
        assert calc_attribute_cost(8) == 0

    def test_11_costs_10(self):
        assert calc_attribute_cost(11) == 10

    def test_12_costs_20(self):
        assert calc_attribute_cost(12) == 20

    def test_13_costs_35(self):
        # 11:10 + 12:10 + 13:15 = 35
        assert calc_attribute_cost(13) == 35

    def test_monotonic(self):
        prev = 0
        for v in range(10, 21):
            c = calc_attribute_cost(v)
            assert c >= prev
            prev = c

    def test_high_cost_steep(self):
        # 高分段应该比低分段贵
        low = calc_attribute_cost(12) - calc_attribute_cost(10)  # 11-12 段
        high = calc_attribute_cost(20) - calc_attribute_cost(18)  # 19-20 段
        assert high > low


class TestSetAttribute:
    def test_set_basic(self, char):
        ok, msg = char.set_attribute("力量", 14)
        assert ok
        assert char.attributes["力量"] == 14
        assert char.cp == 150 - calc_attribute_cost(14)

    def test_set_too_low(self, char):
        ok, msg = char.set_attribute("力量", 9)
        assert not ok
        assert "不能低于10" in msg

    def test_set_unknown_attr(self, char):
        ok, msg = char.set_attribute("幸运", 12)
        assert not ok

    def test_insufficient_cp(self, char):
        # 20 点力量需要 10+10+15+15+20+20+25+25+30+30 = 200 CP，超出 150
        ok, msg = char.set_attribute("力量", 20)
        assert not ok
        assert "CP不足" in msg

    def test_lower_refunds_cp(self, char):
        char.set_attribute("力量", 14)
        cp_after_raise = char.cp
        ok, _ = char.set_attribute("力量", 12)
        assert ok
        assert char.cp > cp_after_raise  # 降属性返还 CP

    def test_attr_mod(self, char):
        char.set_attribute("敏捷", 16)
        assert char.attr_mod("敏捷") == 3
        assert char.attr_mod("力量") == 0  # 仍为 10
