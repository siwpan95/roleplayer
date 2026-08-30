"""优点/缺点/天赋系统测试。"""
import pytest


class TestAdvantages:
    def test_add_advantage(self, char):
        ok, msg = char.add_advantage("战斗反射", 15)
        assert ok
        assert "战斗反射" in char.advantages
        assert char.cp == 150 - 15

    def test_add_advantage_by_name(self, char):
        ok, msg = char.add_advantage_by_name("双巧手")
        assert ok
        assert "双巧手" in char.advantages
        assert char.cp == 150 - 5  # 库内价格 5

    def test_add_unknown_advantage(self, char):
        ok, msg = char.add_advantage_by_name("不存在的优点")
        assert not ok

    def test_insufficient_cp(self, char):
        char.cp = 3
        ok, msg = char.add_advantage("战斗反射", 15)
        assert not ok
        assert "CP不足" in msg


class TestDisadvantages:
    def test_add_disadvantage(self, char):
        ok, msg = char.add_disadvantage("荣誉准则", 10)
        assert ok
        assert char.cp == 150 + 10  # 返还

    def test_add_by_name(self, char):
        ok, msg = char.add_disadvantage_by_name("过度自信")
        assert ok
        assert char.cp == 155  # +5

    def test_cap_limit(self, char):
        # 默认上限 75
        char.add_disadvantage("守密", 10)       # 10
        char.add_disadvantage("责任感", 10)     # 20
        char.add_disadvantage("贪婪", 15)       # 35
        char.add_disadvantage("正义感", 10)     # 45
        char.add_disadvantage("丑陋", 10)       # 55
        char.add_disadvantage("文盲", 5)        # 60
        ok, msg = char.add_disadvantage("嗜酒", 5)  # 65
        assert ok
        ok, msg = char.add_disadvantage("坏视力", 25)  # 65+25=90 > 75
        assert not ok
        assert "不能超过" in msg

    def test_unknown_disadvantage(self, char):
        ok, msg = char.add_disadvantage_by_name("神仙缺点")
        assert not ok


class TestTalents:
    def test_add_talent(self, char):
        ok, msg = char.add_talent("暗杀者", 2)
        assert ok
        assert ("暗杀者", 2) in char.talents
        assert char.cp == 150 - 10  # 5*2

    def test_unknown_talent(self, char):
        ok, msg = char.add_talent("不存在的天赋", 1)
        assert not ok

    def test_invalid_level(self, char):
        ok, _ = char.add_talent("暗杀者", 0)
        assert not ok
        ok, _ = char.add_talent("暗杀者", 4)
        assert not ok

    def test_talent_bonus(self, char):
        char.add_talent("暗杀者", 2)
        assert char.get_talent_bonus("潜行") == 2
        assert char.get_talent_bonus("侦察") == 2
        assert char.get_talent_bonus("近战攻击") == 0  # 不在该组

    def test_multiple_talents_stack(self, char):
        char.add_talent("暗杀者", 1)        # 潜行 +1
        char.add_talent("机敏斥候", 2)      # 潜行 +2
        assert char.get_talent_bonus("潜行") == 3

    def test_insufficient_cp(self, char):
        char.cp = 4
        ok, msg = char.add_talent("暗杀者", 1)
        assert not ok
