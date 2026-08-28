"""扩充子系统测试：法术位 / 专长 / 种族 / 背景 / 先攻·休整。

覆盖决策 A-F 的行为约定：
- A 法术位：独立 CP 购买环位（前置奥术施法等级、SRD 环上限、总量上限、长休恢复、上环）。
- B 专长：8/12/15 CP 分档，前置校验，静态效果与事件钩子效果。
- C 种族：GURPS 式模板定价（属性成本+优点折算），创建期限制。
- D 背景：+2 熟练加值（有效等级 +2）。
- E 先攻/休整：current_hp 引入，短休生命骰/长休全恢复。
- F 种族/背景仅创建期。
"""
import os
import sys

import pytest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from d20 import Character


# =============================================================================
#  法术位（决策 A）
# =============================================================================
class TestSpellSlots:
    def test_buy_1st_ring_needs_arcane_skill(self):
        c = Character()
        ok, msg = c.buy_slot(1)
        assert not ok and "奥术施法" in msg

    def test_buy_and_spend_and_cap(self):
        c = Character()
        c.purchase_skill("奥术施法", 1)
        for _ in range(4):
            ok, msg = c.buy_slot(1)
            assert ok, msg
        ok, msg = c.buy_slot(1)          # 1 环上限 4
        assert not ok and "上限" in msg
        assert c.cp == 150 - 1 - 4       # 奥术施法1级 1CP + 4 个 1 环各 1CP
        ok, msg = c.ctx.slots.spend_slot(1)
        assert ok
        assert c.ctx.slots.available(1) == 3

    def test_high_ring_prereq_and_cost(self):
        c = Character()
        c.purchase_skill("奥术施法", 5)
        ok, msg = c.buy_slot(3)          # 前置 2*3-1=5 ✓
        assert ok
        assert c.cp == 150 - 5 - 3       # 奥术施法5级 5CP + 3 环 3CP
        ok, msg = c.buy_slot(9)          # 前置 17 不满足
        assert not ok and "17" in msg

    def test_long_rest_recovers(self):
        c = Character()
        c.purchase_skill("奥术施法", 1)
        c.buy_slot(1)
        c.ctx.slots.spend_slot(1)
        assert c.ctx.slots.available(1) == 0
        c.long_rest()
        assert c.ctx.slots.available(1) == 1

    def test_cantrip_needs_no_slot(self):
        c = Character()
        ok, msg = c.ctx.slots.spend_slot(0)
        assert ok and "戏法" in msg


# =============================================================================
#  专长（决策 B）
# =============================================================================
class TestFeats:
    def test_alert_initiative(self):
        c = Character()
        before = c.roll_initiative()
        ok, _ = c.add_feat("警觉")
        assert ok
        assert c.cp == 150 - 12
        assert c.ctx.rest.initiative_bonus() == 5  # 敏捷+0，警觉+5

    def test_tough_hp_hook(self):
        c = Character()
        c.purchase_skill("活力", 2)
        hp_before = c.hp()
        c.add_feat("强壮")
        assert c.hp() == hp_before + 4  # +2×活力等级2

    def test_athlete_choice_and_cap(self):
        c = Character()
        ok, _ = c.add_feat("运动员", "力量")
        assert ok and c.attributes["力量"] == 11
        assert c.has_feat("运动员")

    def test_prereq_attr(self):
        c = Character()
        ok, msg = c.add_feat("防御决斗者")     # 需敏捷13
        assert not ok and "敏捷" in msg

    def test_prereq_spellcasting(self):
        c = Character()
        ok, msg = c.add_feat("元素亲和", "火")  # 需会施法
        assert not ok
        c.purchase_skill("奥术施法", 1)
        ok, msg = c.add_feat("元素亲和", "火")
        assert ok

    def test_observant_skill_bonus(self):
        c = Character()
        c.purchase_skill("侦察", 4)
        c.add_feat("观察力")
        assert c.effective_skill_rank("侦察") == 6  # 4 + 专长+2

    def test_no_duplicate(self):
        c = Character()
        assert c.add_feat("警觉")[0]
        ok, msg = c.add_feat("警觉")
        assert not ok and "已拥有" in msg


# =============================================================================
#  种族（决策 C、F）
# =============================================================================
class TestRace:
    def test_human_template_cost(self):
        c = Character()
        ok, msg = c.set_race("人类")
        assert ok
        assert c.cp == 150 - 60
        assert all(v == 11 for v in c.attributes.values())

    def test_elf_grants_darkvision_and_proficiency(self):
        c = Character()
        ok, _ = c.set_race("精灵")
        assert ok
        assert c.cp == 150 - 28          # 敏捷+2=20 + 黑暗视觉8
        assert c.attributes["敏捷"] == 12
        assert "黑暗视觉" in c.advantages
        assert "侦察" in c.proficiencies

    def test_mountain_dwarf_medium_armor_no_skill(self):
        c = Character()
        c.set_race("山地矮人")
        ok, msg = c.equip_item("锁子衫")   # 中甲，无需闪避防御
        assert ok, msg

    def test_tiefling_fire_resistance(self):
        c = Character()
        c.set_race("提夫林")
        c.purchase_skill("活力", 2)
        out = c.take_damage(10, "火")     # 减半 = 5
        assert "5 点" in out

    def test_half_orc_relentless_endurance(self):
        c = Character()
        c.set_race("半兽人")
        c.purchase_skill("活力", 2)
        c.take_damage(999)
        assert c.ctx.rest.current_hp() == 1

    def test_dragonborn_breath(self):
        c = Character()
        c.set_race("龙裔", {"元素": "电"})
        out = c.combat_macro("dragon_breath")
        assert "电" in out
        out2 = c.combat_macro("dragon_breath")   # 已使用
        assert "充能" in out2

    def test_race_only_at_creation(self):
        c = Character()
        c.purchase_skill("活力", 1)
        ok, msg = c.set_race("人类")
        assert not ok and "创建期" in msg

    def test_half_elf_choose(self):
        c = Character()
        ok, _ = c.set_race("半精灵", {"任选+1": ["智力", "感知"]})
        assert ok
        assert c.attributes["智力"] == 11 and c.attributes["感知"] == 11
        assert c.cp == 150 - 48


# =============================================================================
#  背景（决策 D、F）
# =============================================================================
class TestBackground:
    def test_soldier_proficiency(self):
        c = Character()
        ok, msg = c.set_background("士兵")
        assert ok
        c.purchase_skill("运动", 4)
        assert c.effective_skill_rank("运动") == 6      # 4 + 熟练+2
        assert c.effective_skill_rank("恐吓") == 2      # 默认0 + 熟练+2

    def test_background_only_at_creation(self):
        c = Character()
        c.purchase_skill("活力", 1)
        ok, msg = c.set_background("士兵")
        assert not ok and "创建期" in msg

    def test_feature(self):
        c = Character()
        c.set_background("学者")
        assert c.background_feature() == "研究者"


# =============================================================================
#  先攻 / 休整（决策 E）
# =============================================================================
class TestRest:
    def test_current_hp_tracks(self):
        c = Character()
        c.purchase_skill("活力", 2)
        assert c.ctx.rest.current_hp() == c.hp()
        c.take_damage(3)
        assert c.ctx.rest.current_hp() == c.hp() - 3
        c.heal(1)
        assert c.ctx.rest.current_hp() == c.hp() - 2

    def test_short_rest_uses_hit_dice(self):
        c = Character()
        c.purchase_skill("活力", 3)        # 3 个生命骰
        c.take_damage(999)
        out = c.short_rest()
        assert "短休" in out
        assert c.ctx.state.hit_dice_used == 1
        assert c.ctx.rest.current_hp() > 0

    def test_short_rest_no_dice(self):
        c = Character()
        assert "无可用生命骰" in c.short_rest()

    def test_long_rest_full(self):
        c = Character()
        c.purchase_skill("活力", 2)
        c.purchase_skill("奥术施法", 1)
        c.buy_slot(1)
        c.ctx.slots.spend_slot(1)
        c.take_damage(5)
        c.ctx.state.lucky_used = 2
        out = c.long_rest()
        assert c.ctx.rest.current_hp() == c.hp()
        assert c.ctx.slots.available(1) == 1
        assert c.ctx.state.lucky_used == 0
        assert "长休" in out

    def test_combat_reflexes_initiative(self):
        c = Character()
        assert c.ctx.rest.initiative_bonus() == 0
        c.add_advantage("战斗反射", 15)
        assert c.ctx.rest.initiative_bonus() == 1

    def test_lucky_feat_reroll_counts(self):
        c = Character()
        c.add_feat("幸运")
        c.purchase_skill("活力", 1)
        c.d20_check("活力", 30)           # 触发一次重掷
        assert c.ctx.state.lucky_used == 1
        for _ in range(3):
            c.d20_check("活力", 30)
        assert c.ctx.state.lucky_used == 3  # 每日上限 3


# =============================================================================
#  集成：新子系统在角色卡与战斗宏中的呈现
# =============================================================================
class TestIntegration:
    def test_sheet_shows_new_sections(self):
        c = Character()
        c.set_race("精灵")
        c.set_background("学者")
        c.add_feat("警觉")
        c.purchase_skill("奥术施法", 3)
        c.buy_slot(1)
        sheet = c.show_sheet()
        assert "种族: 精灵" in sheet
        assert "背景: 学者（研究者）" in sheet
        assert "专长: 警觉" in sheet
        assert "熟练(+2): 侦察, 奥术知识, 历史" in sheet
        assert "1环 0/1" in sheet
        assert "先攻:" in sheet

    def test_spell_macro_consumes_slot(self):
        c = Character()
        c.purchase_skill("奥术施法", 5)
        c.purchase_technique("火球术")
        c.buy_slot(3)
        out = c.combat_macro("fireball")
        assert "火球术(3环)" in out
        assert c.ctx.slots.available(3) == 0
        out2 = c.combat_macro("fireball")   # 无位可用
        assert "施法失败" in out2

    def test_upcast_fireball(self):
        c = Character()
        c.purchase_skill("奥术施法", 7)     # 4 环前置 7
        c.purchase_technique("火球术")
        c.buy_slot(4)
        out = c.combat_macro("fireball", upcast=4, dc=1)
        assert "火球术(4环)" in out
        assert "9d6" in out                  # 8 + 1 上环

    def test_to_dict_new_fields(self):
        c = Character()
        c.set_race("人类")
        c.add_feat("警觉")
        d = c.to_dict()
        assert d["race"] == "人类"
        assert d["feats"] == ["警觉"]
        assert "slots" in d and "current_hp" in d
