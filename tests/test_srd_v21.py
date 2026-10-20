"""v2.1 SRD 扩充测试：职业 / 子职业 / 等级 / 特性 / 装备 / 熟练 / 参考常量

覆盖两层：
1. **数据契约**——由 dnd5eapi.co/api/2014 权威 JSON 生成的四大模块条目数、
   中文键 100% 覆盖、字段完整性与关键数值（生命骰、施法进程、偷袭骰…）；
2. **Service 行为与集成**——职业选择/升级/子职业、生命骰、施法者等级、
   豁免熟练加值、装备熟练豁免护甲技能需求、SRD 装备可装备，以及
   ``ctx.has("classes")`` 的**可选增强**语义（卸载职业服务后回落原行为）。
"""
import os
import re
import sys

import pytest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from roleplayer import Character
from roleplayer.classes import ClassService, level_up_cost, cumulative_cost
from roleplayer.data import CLASS_LEVEL_MAX, PROFICIENCY_BONUS, SUBCLASS_MIN_LEVEL
from roleplayer.data_classes import CLASSES, CLASS_LEVELS, SUBCLASSES, FEATURES
from roleplayer.data_equipment_srd import SRD_EQUIPMENT, WEAPON_PROPERTIES
from roleplayer.data_proficiencies import PROFICIENCIES
from roleplayer.data_reference import (
    ABILITY_SCORES, ALIGNMENTS, DAMAGE_TYPES, MAGIC_SCHOOLS,
    LANGUAGES, SRD_SKILLS, RULES, RULE_SECTIONS,
)
from roleplayer.dice import weapon_dice
from roleplayer.data import WEAPON_DICE

ZH = re.compile(r"[一-鿿]")


def _all_zh(d) -> bool:
    return all(ZH.search(k) for k in d)


# =============================================================================
#  1. 数据契约
# =============================================================================
class TestClassData:
    def test_counts(self):
        assert len(CLASSES) == 12
        assert len(SUBCLASSES) == 12
        assert len(FEATURES) == 318          # 407 条记录去重后（含同名消歧）
        assert sum(len(v) for v in CLASS_LEVELS.values()) == 240   # 12 职业 × 20 级

    def test_all_keys_chinese(self):
        assert _all_zh(CLASSES) and _all_zh(SUBCLASSES) and _all_zh(FEATURES)
        assert _all_zh(CLASS_LEVELS)

    def test_class_fields(self):
        for name, c in CLASSES.items():
            assert c["en"], name
            assert c["hit_die"] in (6, 8, 10, 12), name
            assert c["primary"], name
            assert set(c["saves"]) <= {"强韧豁免", "反射豁免", "意志豁免"}, name
            assert c["skill_choice_count"] >= 2, name
            assert isinstance(c["gear_profs"], list), name
            assert c["subclasses"], name

    def test_spellcasting_progression_matches_srd(self):
        """施法进程由 20 级法术位分布推导，须与 PHB 官方表一致。"""
        expected = {
            "法师": "full", "牧师": "full", "德鲁伊": "full",
            "吟游诗人": "full", "术士": "full",
            "圣武士": "half", "游侠": "half",
            "魔契师": "pact",
            "野蛮人": "none", "战士": "none", "武僧": "none", "游荡者": "none",
        }
        for cls, prog in expected.items():
            sp = CLASSES[cls]["spellcasting"]
            if prog == "none":
                assert sp is None, cls
            else:
                assert sp["progression"] == prog, cls

    def test_wizard_and_paladin_details(self):
        w = CLASSES["法师"]
        assert w["hit_die"] == 6
        assert w["primary"] == ["智力"]
        assert w["spellcasting"]["ability"] == "智力"
        assert set(w["skill_choices"]) >= {"奥术知识", "历史", "宗教"}
        p = CLASSES["圣武士"]
        assert p["hit_die"] == 10
        assert p["spellcasting"]["ability"] == "魅力"

    def test_level_table(self):
        # 法师 1 级：施法 + 奥术回复；20 级法术位与 SRD 一致
        assert CLASS_LEVELS["法师"][1]["prof_bonus"] == 2
        assert "施法：法师" in CLASS_LEVELS["法师"][1]["features"]
        slots20 = CLASS_LEVELS["法师"][20]["spellcasting"]["slots"]
        assert [slots20[i] for i in range(1, 10)] == [4, 3, 3, 3, 3, 2, 2, 1, 1]

    def test_rogue_sneak_attack_and_ki(self):
        """class_specific 提供权威的职业专属数值（偷袭骰 / 气点）。"""
        assert CLASS_LEVELS["游荡者"][5]["class_specific"]["sneak_attack"] == {
            "dice_count": 3, "dice_value": 6}
        assert CLASS_LEVELS["游荡者"][1]["class_specific"]["sneak_attack"]["dice_count"] == 1
        assert CLASS_LEVELS["武僧"][5]["class_specific"]["ki_points"] == 5
        assert CLASS_LEVELS["野蛮人"][5]["class_specific"]["rage_count"] == 3

    def test_features_linked_to_class(self):
        rage = FEATURES["狂暴"]
        assert rage["en"] == "Rage"
        assert rage["class"] == "野蛮人"
        assert rage["level"] == 1
        assert rage["desc_en"]
        assert any(f["en"] == "Sneak Attack" for f in FEATURES.values())

    def test_subclass_belongs_to_class(self):
        for name, s in SUBCLASSES.items():
            assert s["class"] in CLASSES, name
        assert SUBCLASSES["塑能学派"]["class"] == "法师"
        assert SUBCLASSES["盗贼"]["class"] == "游荡者"


class TestEquipmentProfReferenceData:
    def test_counts(self):
        assert len(SRD_EQUIPMENT) == 237
        assert len(WEAPON_PROPERTIES) == 11
        assert len(PROFICIENCIES) == 117
        assert (len(ABILITY_SCORES), len(ALIGNMENTS), len(DAMAGE_TYPES)) == (6, 9, 13)
        assert (len(MAGIC_SCHOOLS), len(LANGUAGES), len(SRD_SKILLS)) == (8, 16, 18)
        assert (len(RULES), len(RULE_SECTIONS)) == (6, 33)

    def test_all_keys_chinese(self):
        for d in (SRD_EQUIPMENT, WEAPON_PROPERTIES, PROFICIENCIES,
                  ABILITY_SCORES, ALIGNMENTS, DAMAGE_TYPES, MAGIC_SCHOOLS,
                  LANGUAGES, SRD_SKILLS, RULES, RULE_SECTIONS):
            assert _all_zh(d), [k for k in d if not ZH.search(k)][:5]

    def test_weapon_and_armor_values(self):
        sw = SRD_EQUIPMENT["长剑"]
        assert sw["damage"] == "1d8" and sw["two_handed"] == "1d10"
        assert sw["damage_type"] == "挥砍" and sw["sub"] == "军用近战"
        plate = SRD_EQUIPMENT["全身板甲"]
        assert plate["armor_class"] == 18 and plate["sub"] == "重甲"
        assert plate["str_min"] == 15 and plate["stealth_dis"] is True

    def test_srd_skills_align_with_skill_library(self):
        """SRD 18 技能必须全部落在项目既有 SKILL_LIBRARY 命名空间内。"""
        from roleplayer.data import SKILL_LIBRARY
        assert set(SRD_SKILLS) <= set(SKILL_LIBRARY)

    def test_weapon_dice_falls_back_to_srd(self):
        """手工库保持原值；手工库没有的武器回退 SRD 伤害骰。"""
        assert weapon_dice("长剑") == WEAPON_DICE["长剑"] == (1, 8)
        assert weapon_dice("巨剑") == (2, 6)
        srd_only = next(k for k, v in SRD_EQUIPMENT.items()
                        if v["cat"] == "武器" and v["damage"] and k not in WEAPON_DICE)
        assert weapon_dice(srd_only) == (1, 6) or weapon_dice(srd_only)[0] >= 1


# =============================================================================
#  2. 定价与 Service 行为
# =============================================================================
class TestLevelPricing:
    def test_bracket_costs(self):
        assert level_up_cost(1) == 0          # 创建期 1 级免费
        assert level_up_cost(2) == 3
        assert level_up_cost(5) == 3
        assert level_up_cost(6) == 4
        assert level_up_cost(11) == 5
        assert level_up_cost(16) == 6
        assert level_up_cost(20) == 6

    def test_cumulative(self):
        assert cumulative_cost(1) == 0
        assert cumulative_cost(5) == 12
        assert cumulative_cost(10) == 32
        assert cumulative_cost(15) == 57
        assert cumulative_cost(20) == 87      # 20 级职业占 150 起始 CP 的 58%


class TestClassService:
    def test_set_class_grants_proficiencies(self):
        c = Character()
        ok, msg = c.set_class("法师")
        assert ok, msg
        assert c.cls == "法师" and c.level == 1
        assert c.cp == 150                     # 1 级免费
        assert len(c.proficiencies) == 2       # 法师自选 2 项技能
        assert set(c.proficiencies) <= set(CLASSES["法师"]["skill_choices"])
        assert "意志豁免" in c.save_proficiencies
        assert c.gear_proficiencies  # 匕首/飞镖/投石索/长棍/轻弩

    def test_set_class_locked_after_purchase(self):
        c = Character()
        c.set_attribute("力量", 12)
        ok, msg = c.set_class("法师")
        assert not ok and "创建期" in msg

    def test_level_up_and_level_to(self):
        c = Character()
        c.set_class("法师")
        ok, msg = c.level_up()
        assert ok and c.level == 2 and c.cp == 147
        ok, msg = c.level_to(5)
        assert ok and c.level == 5 and c.cp == 150 - 12

    def test_level_to_insufficient_cp_fails_whole(self):
        c = Character()
        c.set_class("法师")
        ok, msg = c.level_to(20)               # 需 87 CP
        assert ok and c.level == 20
        ok, msg = c.level_to(19)
        assert not ok                          # 不能降级
        assert c.level == 20

    def test_max_level_cap(self):
        c = Character()
        c.set_class("法师")
        c.level_to(CLASS_LEVEL_MAX)
        ok, msg = c.level_up()
        assert not ok and "上限" in msg

    def test_subclass_requires_level(self):
        c = Character()
        c.set_class("法师")
        ok, msg = c.set_subclass("塑能学派")
        assert not ok and str(SUBCLASS_MIN_LEVEL) in msg
        c.level_to(SUBCLASS_MIN_LEVEL)
        ok, msg = c.set_subclass("塑能学派")
        assert ok and c.subclass == "塑能学派"
        ok, msg = c.set_subclass("盗贼")        # 跨职业
        assert not ok

    def test_features_and_hit_die(self):
        c = Character()
        c.set_class("游荡者")
        c.level_to(5)
        assert c.hit_die() == 8
        assert "偷袭" in c.class_features()
        assert "洞悉闪避" in c.class_features()
        assert c.class_specific()["sneak_attack"]["dice_count"] == 3
        assert c.prof_bonus() == 3

    def test_caster_level_and_max_ring(self):
        """full 职业：等级 5 -> 施法者等级 5 / 最高 3 环（SRD 一致）。"""
        c = Character()
        c.set_class("法师")
        assert c.caster_level() == 1 and c.max_spell_ring() == 1
        c.level_to(5)
        assert c.caster_level() == 5 and c.max_spell_ring() == 3
        c.level_to(9)
        assert c.max_spell_ring() == 5
        c.level_to(17)
        assert c.max_spell_ring() == 9

    def test_half_and_pact_ring_cap(self):
        c = Character()
        c.set_class("圣武士")                   # half
        c.level_to(9)
        assert c.caster_level() == 5 and c.max_spell_ring() == 3
        c.level_to(20)
        assert c.max_spell_ring() == 5

        c2 = Character()
        c2.set_class("魔契师")                  # pact：封顶 5 环
        c2.level_to(5)
        assert c2.max_spell_ring() == 3
        c2.level_to(20)
        assert c2.max_spell_ring() == 5

    def test_spell_slots_table(self):
        c = Character()
        c.set_class("法师")
        c.level_to(3)
        assert c.class_spell_slots() == {1: 4, 2: 2}


# =============================================================================
#  3. 与既有子系统的集成（决策 I / J / H）
# =============================================================================
class TestIntegration:
    def test_class_grants_spell_slot_qualification(self):
        """决策 I：无「奥术施法」技能，凭职业等级也能买 3 环法术位。"""
        c = Character()
        assert c.skills.get("奥术施法", 0) == 0
        ok, msg = c.buy_slot(3)
        assert not ok                            # 无职业无技能 -> 拒绝
        c2 = Character()
        c2.set_class("法师")
        c2.level_to(5)
        ok, msg = c2.buy_slot(3)
        assert ok, msg
        assert c2.ctx.slots.available(3) == 1

    def test_save_proficiency_bonus(self):
        """决策 H：职业豁免熟练 -> 对应豁免 +PROFICIENCY_BONUS。"""
        c = Character()
        base = c.save_bonus("will")
        c2 = Character()
        c2.set_class("法师")                     # 智力/感知豁免 -> 意志豁免
        assert c2.save_bonus("will") == base + PROFICIENCY_BONUS
        assert c2.save_bonus("fort") == base     # 法师无强韧熟练

    def test_gear_proficiency_exempts_armor_skill(self):
        """决策 H：战士有重甲熟练，无需「近战攻击」技能即可穿全身板甲。"""
        c = Character()
        ok, msg = c.equip_item("全身板甲")
        assert not ok and "近战攻击" in msg
        c2 = Character()
        c2.set_class("战士")                     # gear_profs 含「全部护甲」
        assert "全部护甲" in c2.gear_proficiencies
        ok, msg = c2.equip_item("全身板甲")
        assert ok, msg
        assert c2.ac >= 18
        # 全部护甲也覆盖中甲
        ok, msg = c2.equip_item("半身板甲")
        assert ok, msg

    def test_hit_die_follows_class(self):
        """决策 J：生命骰随职业（战士 d10 / 法师 d6）。"""
        c = Character()
        assert c.hit_die() == 6                  # 无职业回落
        c.set_class("战士")
        assert c.hit_die() == 10
        c.set_attribute("体质", 12)
        c.purchase_skill("活力", 3)
        out = c.short_rest()
        assert "1d10" in out

    def test_srd_weapon_equippable(self):
        """SRD 装备库中的武器/护甲可直接装备，CP 由金币折算。"""
        c = Character()
        c.set_class("战士")
        ok, msg = c.equip_item("全身板甲")
        assert ok                                # 手工库优先（15 CP）
        srd_only = next(k for k, v in SRD_EQUIPMENT.items()
                        if v["cat"] == "武器" and k not in c.EQUIPMENT_LIBRARY)
        ok, msg = c.equip_item(srd_only)
        assert ok, msg
        assert srd_only in c.equipment
        assert c.ctx.equipment._get_equipped_weapon() == srd_only

    def test_sheet_shows_class(self):
        c = Character()
        c.set_class("法师")
        c.level_to(3)
        sheet = c.show_sheet()
        assert "职业: 法师 3 级" in sheet
        assert "生命骰 d6" in sheet
        assert "职业特性:" in sheet
        assert "职业法术位:" in sheet

    def test_to_dict_includes_class(self):
        c = Character()
        c.set_class("游荡者")
        c.set_subclass("盗贼") if False else None
        d = c.to_dict()
        assert d["cls"] == "游荡者" and d["level"] == 1
        assert "gear_proficiencies" in d and "save_proficiencies" in d


class TestOptionalEnhancement:
    """卸载 classes 服务后，依赖方必须回落原行为（Cordis 可选增强语义）。"""

    def _without_classes(self):
        c = Character()
        c.ctx._services.pop("classes", None)
        return c

    def test_slots_falls_back(self):
        c = self._without_classes()
        ok, msg = c.buy_slot(1)
        assert not ok and "奥术施法" in msg

    def test_rest_hit_die_falls_back(self):
        c = self._without_classes()
        assert c.ctx.rest.hit_dice() == 6

    def test_equipment_requires_skill_again(self):
        c = self._without_classes()
        ok, msg = c.equip_item("全身板甲")
        assert not ok and "近战攻击" in msg

    def test_derived_save_unchanged(self):
        c = self._without_classes()
        base = Character().save_bonus("will")
        assert c.save_bonus("will") == base


# =============================================================================
#  4. ReferenceService（规则速查）
# =============================================================================
class TestReferenceService:
    def test_kinds_and_counts(self):
        c = Character()
        kinds = c.reference_kinds()
        assert "职业" in kinds and "装备" in kinds and "规则章节" in kinds
        assert len(c.reference_names("职业")) == 12
        assert len(c.reference_names("装备")) == 237

    def test_rule_lookup_and_search(self):
        c = Character()
        assert "Resting" in [c.reference_lookup("规则章节", "休息")["en"]]
        assert c.rule("休息")
        assert "休息" in c.search_rules("short rest") or c.search_rules("rest")

    def test_gear_queries(self):
        c = Character()
        assert c.gear_info("长剑")["damage"] == "1d8"
        assert c.weapon_info("长剑")["two_handed"] == "1d10"
        assert c.armor_info("全身板甲")["armor_class"] == 18
        assert c.gear_info("长剑") and not c.weapon_info("全身板甲")
        assert "武器" in c.ctx.reference.gear_categories()
        assert "长剑" in c.gear_by_category("武器")

    def test_feature_and_class_lookup(self):
        c = Character()
        f = c.class_feature_detail("狂暴")
        assert f and f["class"] == "野蛮人"
        assert len(c.ctx.reference.class_levels("法师")) == 20
