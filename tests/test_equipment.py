"""装备系统测试。"""
import pytest


class TestEquipItem:
    def test_equip_weapon(self, char):
        ok, msg = char.equip_item("匕首")
        assert ok
        assert "匕首" in char.equipment
        assert char.cp == 150 - 2  # 匕首 2 CP

    def test_equip_unknown(self, char):
        ok, msg = char.equip_item("神器")
        assert not ok
        assert "未知装备" in msg

    def test_equip_insufficient_cp(self, char):
        # 重甲需近战攻击熟练度，先学技能再耗光 CP
        char.purchase_skill("近战攻击", 11)
        char.cp = 1
        ok, msg = char.equip_item("全身板甲")
        assert not ok
        assert "CP不足" in msg

    def test_light_armor_no_proficiency(self, char):
        # 轻甲无需专精
        ok, msg = char.equip_item("皮甲")
        assert ok

    def test_medium_armor_needs_skill(self, char):
        # 中甲需要闪避防御至少 1 级
        ok, msg = char.equip_item("鳞甲")
        assert not ok
        assert "闪避防御" in msg
        # 学了之后可以穿
        char.purchase_skill("闪避防御", 11)
        ok, msg = char.equip_item("鳞甲")
        assert ok

    def test_heavy_armor_needs_melee(self, char):
        ok, msg = char.equip_item("全身板甲")
        assert not ok
        assert "近战攻击" in msg
        char.purchase_skill("近战攻击", 11)
        ok, _ = char.equip_item("全身板甲")
        assert ok


class TestUnequip:
    def test_unequip_returns_cp(self, char):
        # 铁盾需近战攻击熟练度
        char.purchase_skill("近战攻击", 11)
        char.equip_item("铁盾")
        cp_after_equip = char.cp
        ok, msg = char.unequip_item("铁盾")
        assert ok
        assert char.cp == cp_after_equip + 5  # 铁盾 5 CP

    def test_unequip_not_equipped(self, char):
        ok, msg = char.unequip_item("匕首")
        assert not ok


class TestArmorBonus:
    def test_armor_ac_bonus(self, char):
        char.purchase_skill("近战攻击", 11)
        char.equip_item("全身板甲")  # AC +8
        char.equip_item("铁盾")      # AC +2
        assert char.armor_bonus == 10

    def test_armor_max_dex(self, char):
        # 用充足 CP 构建：敏捷 16(+3) + 全身板甲(max_dex 0, AC+8)
        rich = type(char)(starting_cp=500)
        rich.set_attribute("敏捷", 16)  # +3
        rich.purchase_skill("近战攻击", 11)
        rich.equip_item("全身板甲")  # 最大敏捷 0
        # AC = 10 + min(3, 0) + 0(闪避) + 8(护甲) = 18
        assert rich.ac == 18

    def test_light_armor_keeps_dex(self, char):
        rich = type(char)(starting_cp=500)
        rich.set_attribute("敏捷", 18)  # +4
        rich.equip_item("皮甲")  # 最大敏捷 99, AC+1
        # AC = 10 + 4 + 0 + 1 = 15
        assert rich.ac == 15

    def test_strictest_max_dex_wins(self, char):
        # 中甲(锁子衫 max_dex 2) + 盾牌(max_dex 99) → 取最严格 2
        rich = type(char)(starting_cp=500)
        rich.set_attribute("敏捷", 16)  # +3
        rich.purchase_skill("近战攻击", 11)
        rich.purchase_skill("闪避防御", 11)  # 11//2=5 闪避加值
        rich.equip_item("锁子衫")  # 中甲 max_dex 2, AC+3
        rich.equip_item("铁盾")    # 盾牌 max_dex 99, AC+2
        # 取最严格：max_dex = min(2, 99) = 2
        # AC = 10 + min(3, 2) + 5 + 3 + 2 = 22
        assert rich.ac == 22


class TestWeaponHelpers:
    def test_get_equipped_weapon(self, char):
        char.equip_item("长剑")
        assert char._get_equipped_weapon() == "长剑"

    def test_unarmed_default(self, char):
        assert char._get_equipped_weapon() == "徒手"

    def test_finesse_weapon_detection(self, char):
        assert not char.has_finesse_weapon()
        char.equip_item("刺剑")  # 灵巧武器
        assert char.has_finesse_weapon()
        char2 = type(char)()
        char2.equip_item("长剑")  # 非灵巧
        assert not char2.has_finesse_weapon()

    def test_recalc_after_unequip(self, char):
        char.purchase_skill("近战攻击", 11)
        char.equip_item("铁盾")
        assert char.armor_bonus == 2
        char.unequip_item("铁盾")
        assert char.armor_bonus == 0
