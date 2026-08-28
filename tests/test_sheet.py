"""角色卡渲染测试。"""
import pytest


class TestShowSheet:
    def test_empty_sheet(self, char):
        sheet = char.show_sheet()
        assert "角色卡" in sheet
        assert "剩余 CP: 150" in sheet
        assert "优点: 无" in sheet
        assert "技术: 无" in sheet
        assert "装备: 无" in sheet

    def test_sheet_with_content(self, fighter):
        sheet = fighter.show_sheet()
        assert "力量:16" in sheet
        assert "近战攻击" in sheet
        assert "匕首" in sheet
        assert f"HP: {fighter.hp()}" in sheet
        assert f"AC: {fighter.ac}" in sheet

    def test_sheet_shows_talent_bonus(self, char):
        char.purchase_skill("潜行", 10)
        char.add_talent("暗杀者", 2)
        sheet = char.show_sheet()
        assert "潜行: 10(+2) = 12" in sheet

    def test_sheet_shows_unlearned_defaults(self, char):
        char.purchase_skill("近战攻击", 14)
        sheet = char.show_sheet()
        assert "未学技能" in sheet
        assert "推算" in sheet

    def test_sheet_shows_saves(self, char):
        sheet = char.show_sheet()
        assert "强韧" in sheet
        assert "反射" in sheet
        assert "意志" in sheet

    def test_sheet_shows_attr_mods(self, char):
        char.set_attribute("力量", 16)
        sheet = char.show_sheet()
        assert "属性调整值" in sheet
        assert "力量:+3" in sheet
