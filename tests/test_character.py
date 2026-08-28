"""Character 集成测试 + 衍生数值测试。"""
import pytest


class TestDerivedStats:
    def test_hp_zero_without_vitality(self, char):
        assert char.hp() == 0

    def test_hp_with_vitality(self, char):
        char.set_attribute("体质", 14)  # +2
        char.purchase_skill("活力", 5)
        # 6 + 2 + (5-1)*(3.5+2) = 8 + 4*5.5 = 8+22 = 30
        assert char.hp() == 30

    def test_ac_base_10(self, char):
        assert char.ac == 10

    def test_ac_with_dex_and_armor(self, char):
        char.set_attribute("敏捷", 16)  # +3
        char.purchase_skill("闪避防御", 11)  # 等级11 → 11//2 = 5
        char.equip_item("皮甲")  # AC+1
        # AC = 10 + 3 + 5 + 1 = 19
        assert char.ac == 19

    def test_attack_bonus(self, char):
        char.purchase_skill("近战攻击", 12)
        assert char.attack_bonus(True) == 12

    def test_ranged_bonus(self, char):
        char.purchase_skill("远程攻击", 10)
        assert char.attack_bonus(False) == 10

    def test_save_bonus(self, char):
        char.set_attribute("体质", 14)  # +2
        char.purchase_skill("强韧豁免", 10)
        # 10 + 2 = 12
        assert char.save_bonus("fort") == 12

    def test_save_unknown_type(self, char):
        with pytest.raises(ValueError):
            char.save_bonus("luck")


class TestCharacterIntegration:
    def test_build_full_character(self, char):
        """完整构建一个盗贼角色，复现 盗贼.txt 的结构。"""
        char.set_attribute("力量", 11)
        char.set_attribute("体质", 13)
        char.add_advantage("昏暗视觉", 2)
        char.add_disadvantage("荣誉准则", 10)
        char.add_talent("轻巧战法", 1)
        for sk, lvl in [("反射豁免", 10), ("强韧豁免", 10), ("意志豁免", 10),
                        ("活力", 14), ("潜行", 10), ("躲藏", 10),
                        ("近战攻击", 10)]:
            char.purchase_skill(sk, lvl)
        char.purchase_technique("偷袭要害打击")
        char.purchase_skill("近战攻击", 1)  # 满足盾牌熟练度
        char.equip_item("匕首")
        char.equip_item("全身板甲")
        char.equip_item("铁盾")

        # 验证关键数值
        assert char.hp() > 0
        assert char.ac > 15
        assert "偷袭要害打击" in char.techniques
        assert "匕首" in char.equipment
        assert "全身板甲" in char.equipment

    def test_repr(self, char):
        r = repr(char)
        assert "Character" in r and "CP=" in r

    def test_to_dict(self, char):
        char.set_attribute("力量", 14)
        char.purchase_skill("近战攻击", 10)
        d = char.to_dict()
        assert d["cp"] == char.cp
        assert d["attributes"]["力量"] == 14
        assert "近战攻击" in d["skills"]
        assert d["techniques"] == []
        assert d["equipment"] == []


class TestBackwardCompat:
    def test_old_import_path(self):
        """mvp_builder 仍可 import Character。"""
        from mvp_builder import Character as OldChar
        from d20 import Character as NewChar
        assert OldChar is NewChar

    def test_class_data_accessible(self, char):
        # 老代码通过实例访问类数据
        assert "近战攻击" in char.SKILL_LIBRARY
        assert "匕首" in char.EQUIPMENT_LIBRARY
        assert "火球术" in char.TECHNIQUES
        assert "暗杀者" in char.TALENT_BONUS_GROUPS
