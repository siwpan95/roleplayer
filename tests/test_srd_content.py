"""SRD 全量扩充内容测试：战斗条件 / 怪物图鉴 / 法术名册 / 魔法物品。

覆盖 Task #3/#4 新增的 4 个数据模块 + ConditionService / MonsterService 的契约：
- 条件：15 条官方条件齐全，追踪与惩罚聚合正确，自动失败维度正确。
- 怪物：图鉴可查、stat block 渲染、CR→XP、按 CR 抽取、DM 掷骰结算。
- 法术：SRD 名册并入 SPELL_RINGS，已知法术环位正确（戏法=0）。
- 魔法物品：DMG 分级齐全。
- 门面：Character 委托方法可用，sheet 渲染条件行。
"""
import os
import sys

import pytest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from d20 import Character
from d20.data_conditions import CONDITIONS as CONDITIONS_DATA, DISADVANTAGE_PENALTY
from d20.data_monsters import MONSTERS, CR_XP
from d20.data_spells import SRD_SPELLS, SRD_SPELL_RINGS
from d20.data_magicitems import MAGIC_ITEMS
from d20.data import SPELL_RINGS

# D&D 5e SRD Appendix A 的 15 条官方战斗条件
SRD_CONDITION_NAMES = [
    "目盲", "魅惑", "耳聋", "惊惧", "擒抱", "失能", "隐形", "麻痹",
    "石化", "中毒", "倒地", "束缚", "震慑", "昏迷", "力竭",
]


# =============================================================================
#  战斗条件（data_conditions + ConditionService）
# =============================================================================
class TestConditionsData:
    def test_fifteen_official_conditions(self):
        assert set(CONDITIONS_DATA.keys()) == set(SRD_CONDITION_NAMES)

    def test_condition_shape_and_penalty_constant(self):
        for name, info in CONDITIONS_DATA.items():
            assert {"en", "attack", "save", "check", "auto_fail", "special", "ends_on"} <= info.keys()
            assert isinstance(info["auto_fail"], list)
        assert DISADVANTAGE_PENALTY == -2


class TestConditionService:
    def test_add_and_active_and_has(self):
        c = Character()
        assert c.active_conditions() == []
        ok, msg = c.add_condition("惊惧")
        assert ok and "惊惧" in msg
        assert c.has_condition("惊惧")
        assert c.active_conditions() == ["惊惧"]
        ok, msg = c.add_condition("惊惧")      # 重复施加应失败
        assert not ok and "已处于" in msg

    def test_remove_and_clear(self):
        c = Character()
        c.add_condition("目盲")
        c.add_condition("中毒")
        assert set(c.active_conditions()) == {"目盲", "中毒"}
        c.remove_condition("目盲")
        assert c.active_conditions() == ["中毒"]
        c.clear_conditions()
        assert c.active_conditions() == []
        assert c.has_condition("中毒") is False

    def test_penalty_aggregation(self):
        c = Character()
        # 惊惧：攻/免/检 各 -2；目盲：攻 -2
        c.add_condition("惊惧")
        c.add_condition("目盲")
        assert c.condition_penalty("attack") == -4
        assert c.condition_penalty("save") == -2
        assert c.condition_penalty("check") == -2

    def test_auto_fail_dimensions(self):
        c = Character()
        c.add_condition("麻痹")          # auto_fail str_save / dex_save
        assert c.ctx.condition.auto_fail("str_save") is True
        assert c.ctx.condition.auto_fail("dex_save") is True
        assert c.ctx.condition.auto_fail("vis") is False
        c.clear_conditions()
        c.add_condition("目盲")          # auto_fail vis
        assert c.ctx.condition.auto_fail("vis") is True
        assert c.ctx.condition.auto_fail("aud") is False

    def test_describe_unknown(self):
        c = Character()
        assert "未知条件" in c.describe_condition("不存在")

    def test_facade_delegates(self):
        c = Character()
        c.add_condition("震慑")
        assert "震慑" in c.describe_condition("震慑")
        assert c.ctx.condition is c.ctx._services["condition"]


# =============================================================================
#  怪物图鉴（data_monsters + MonsterService）
# =============================================================================
class TestMonstersData:
    def test_monster_count_and_red_dragon_stages(self):
        assert len(MONSTERS) >= 45
        assert {"红龙幼龙", "成年红龙", "远古红龙"} <= set(MONSTERS.keys())

    def test_cr_xp_table(self):
        assert CR_XP["1"] == 200
        assert CR_XP["20"] == 25000
        assert CR_XP["1/2"] == 100


class TestMonsterService:
    def test_lookup_and_names(self):
        c = Character()
        assert "哥布林" in c.monster_names()
        block = c.monster_lookup("哥布林")
        assert block is not None
        assert block["size"] == "小型" or block["type"] == "人形怪物"

    def test_stat_block_renders(self):
        c = Character()
        txt = c.monster_stat_block("成年红龙")
        assert "成年红龙" in txt
        assert "AC" in txt and "HP" in txt
        assert "动作" in txt

    def test_stat_block_unknown(self):
        c = Character()
        assert "未知怪物" in c.monster_stat_block("不存在的怪")

    def test_xp_and_by_cr(self):
        c = Character()
        assert c.ctx.monster.xp("1") == 200
        cr1 = c.monster_by_cr("1")
        assert isinstance(cr1, list)
        enc = c.monster_quick_encounter("1", 2)
        assert "CR 1" in enc

    def test_roll_attack_returns_string(self):
        c = Character()
        out = c.monster_roll_attack("哥布林", 0, target_ac=12)
        assert "哥布林" in out
        assert ("命中" in out) or ("未命中" in out)


# =============================================================================
#  法术名册（data_spells + 并入 SPELL_RINGS）
# =============================================================================
class TestSpellsData:
    def test_srd_spell_count_and_shape(self):
        assert len(SRD_SPELLS) >= 150
        sample = next(iter(SRD_SPELLS.values()))
        assert {"level", "school", "time", "range", "comp", "dur", "desc"} <= sample.keys()

    def test_ring_merge_into_spell_rings(self):
        # 武装之刃等 SRD 法术已并入主 SPELL_RINGS（戏法=0）
        assert "火球术" in SPELL_RINGS
        assert SPELL_RINGS["火球术"] == 3
        assert SRD_SPELL_RINGS["魔法飞弹"] == 1
        assert SRD_SPELL_RINGS["火焰箭"] == 0      # 戏法（0 环）

    def test_known_spell_metadata(self):
        fb = SRD_SPELLS["火球术"]
        assert fb["level"] == 3
        assert "火伤" in fb["desc"] or "fire" in fb["desc"].lower()


# =============================================================================
#  魔法物品（data_magicitems + DMG 分级）
# =============================================================================
class TestMagicItemsData:
    def test_magic_item_count_and_rarities(self):
        assert len(MAGIC_ITEMS) >= 40
        rarities = {info["rarity"] for info in MAGIC_ITEMS.values()}
        assert {"非普通", "稀有", "极稀有", "传说", "神器"} <= rarities

    def test_magic_item_shape(self):
        sample = next(iter(MAGIC_ITEMS.values()))
        assert {"rarity", "type", "attunement", "desc"} <= sample.keys()


# =============================================================================
#  门面 + 角色卡集成
# =============================================================================
class TestSheetConditionsRow:
    def test_sheet_renders_condition_row(self):
        c = Character()
        sheet_no_cond = c.show_sheet()
        assert "战斗条件: 无" in sheet_no_cond
        c.add_condition("惊惧")
        c.add_condition("目盲")
        sheet = c.show_sheet()
        assert "战斗条件:" in sheet
        assert "惊惧" in sheet and "目盲" in sheet
        # 惊惧+目盲 → 攻击 -4
        assert "攻-4" in sheet

    def test_to_dict_no_conditions_key_regression(self):
        c = Character()
        d = c.to_dict()
        # to_dict 不强制含 conditions，但状态应为空列表由 state 持有
        assert c.ctx.state.conditions == []
