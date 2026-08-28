"""骰子系统测试。"""
import random

from d20.dice import (
    roll_d20, roll_d100, roll_d6, roll_3d6,
    gurps_success_chance, roll_weapon_damage,
)


class TestRollBasics:
    def test_d20_range(self):
        for _ in range(200):
            r = roll_d20()
            assert 1 <= r <= 20

    def test_d100_range(self):
        for _ in range(200):
            r = roll_d100()
            assert 1 <= r <= 100

    def test_d6_sum(self):
        rolls, total = roll_d6(3, mod=2)
        assert len(rolls) == 3
        assert all(1 <= r <= 6 for r in rolls)
        assert total == sum(rolls) + 2

    def test_d6_zero_mod(self):
        rolls, total = roll_d6(0)
        assert rolls == []
        assert total == 0

    def test_3d6_range(self):
        for _ in range(200):
            rolls, total = roll_3d6()
            assert len(rolls) == 3
            assert 3 <= total <= 18
            assert all(1 <= r <= 6 for r in rolls)


class TestGurpsChance:
    def test_extremes(self):
        assert gurps_success_chance(3) == 0
        assert gurps_success_chance(18) == 100

    def test_monotonic(self):
        prev = 0
        for lvl in range(3, 19):
            chance = gurps_success_chance(lvl)
            assert chance >= prev
            prev = chance

    def test_middle(self):
        # 3d6 ≤10 约为 50%
        assert 45 <= gurps_success_chance(10) <= 55


class TestWeaponDamage:
    def test_known_weapon(self):
        random.seed(0)
        rolls, desc = roll_weapon_damage("长剑")
        assert desc == "1d8"
        assert len(rolls) == 1
        assert 1 <= rolls[0] <= 8

    def test_greatsword(self):
        random.seed(0)
        rolls, desc = roll_weapon_damage("巨剑")
        assert desc == "2d6"
        assert len(rolls) == 2

    def test_unknown_weapon_defaults(self):
        random.seed(0)
        rolls, desc = roll_weapon_damage("不存在的武器")
        assert desc == "1d4"
        assert len(rolls) == 1

    def test_unarmed(self):
        rolls, desc = roll_weapon_damage("徒手")
        assert desc == "1d3"
        assert 1 <= rolls[0] <= 3
