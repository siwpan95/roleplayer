"""test_prerelease_regression - D20 v2.2 上线前全检发现的缺陷回归网。

本文件由「上线前全检（代码审查 / 安全审计 / QA）」产出，**只记录已复现确认的缺陷**，
作为防退化回归网。每个测试都对应全检报告中的一条问题编号，断言当前**实际行为**
（含缺陷行为），以便缺陷修复时测试变红、提醒同步更新断言与报告状态。

注意：这些断言锁的是"现状"。修复对应缺陷后，必须同步修正这里的期望值。
"""
import json
import os
import tempfile

import pytest

from d20 import Character, narration


# ---------------------------------------------------------------------------
# P1-3 / 根因：derived.max_hp 在「活力」技能为 0 时直接返回 0.0
# ---------------------------------------------------------------------------
class TestMaxHpFloor:
    """derived.max_hp 的生命值下限（P1-1，已于 2026-08-29 修复）。

    原缺陷：``vit_rank == 0`` 时提前 ``return 0.0``，导致未买活力的角色 HP 恒为 0，
    高等级随机角色因 CP 被职业等级吃光而必然产出 0 HP 废卡且无法自救（死锁）。

    修复后按公式外推并设下限。以下断言锁的是**修复后的正确行为**，防止退化回 0。
    """

    def test_blank_character_has_positive_max_hp(self):
        """新建空白角色（未买活力）也必须有正生命值。"""
        assert Character().max_hp > 0

    def test_high_level_random_characters_never_zero_hp(self):
        """L10~L20 随机角色不得再出现 0 HP 废卡（原 L15 达 78%）。"""
        for lv in (10, 12, 15, 18, 20):
            for seed in range(10):
                c = Character.random(level=lv, seed=seed)
                assert c.max_hp > 0, f"L{lv} seed={seed} 仍产出 0 HP 废卡"

    def test_vitality_still_drives_hp_growth(self):
        """修复不得破坏原有规则：投资活力仍按公式线性提升 HP。"""
        c = Character()
        base = c.max_hp
        c.set_attribute("体质", 14)  # +2
        c.purchase_skill("活力", 5)
        # 6 + 2 + (5-1)*(3.5+2) = 30
        assert c.max_hp == 30.0
        assert c.max_hp > base

    @pytest.mark.xfail(
        reason="已知缺陷（未修）：random_character(level=20) 实际只生成 L15，"
               "等级参数在高段被截断。修复 random_character 的 CP 预算后应转为通过。",
        strict=True,
    )
    def test_random_level_should_honor_requested_level(self):
        """请求 L20 应得到 L20，而非被截断到 L15。"""
        assert Character.random(level=20, seed=0).level == 20


# ---------------------------------------------------------------------------
# P2：角色卡 JSON 反序列化无类型校验（安全审计 + 实测复现）
# ---------------------------------------------------------------------------
def _base_card():
    return {
        "__format__": "d20-character", "version": 1, "cp": 0, "base_cp": 150,
        "purchases": 0, "max_disadvantage_cp": 75, "armor_bonus": 0,
        "race": "", "race_element": "火", "background": "", "current_hp": None,
        "hit_dice_used": 0, "lucky_used": 0, "breath_used": False,
        "relentless_used": False, "cls": "", "level": 1, "subclass": "",
        "attributes": {"力量": 10, "敏捷": 10, "体质": 10,
                       "智力": 10, "感知": 10, "魅力": 10},
        "advantages": [], "disadvantages": [], "skills": {}, "techniques": [],
        "equipment": [],
    }


def _load_card(mutate):
    d = _base_card()
    mutate(d)
    fd, path = tempfile.mkstemp(suffix=".json")
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        json.dump(d, f, ensure_ascii=False)
    try:
        return Character.load(path)
    finally:
        os.unlink(path)


class TestCharacterCardDeserialization:
    """character_io.load_character 对畸形 JSON 无类型校验。"""

    def test_equipment_as_string_silently_split_into_chars(self):
        """手改存档把 equipment 写成字符串 -> 静默按字符拆开成 ['长','剑']。"""
        c = _load_card(lambda d: d.__setitem__("equipment", "长剑"))
        assert c.equipment == ["长", "剑"], "预期缺陷：字符串被按字符拆成列表"

    def test_absurd_level_is_accepted_silently(self):
        """level 写成 10**12 被静默接受，无范围校验。"""
        c = _load_card(lambda d: d.__setitem__("level", 10 ** 12))
        assert c.level == 10 ** 12, "预期缺陷：超大等级被静默接受"

    def test_wrong_type_raises_bare_typeerror(self):
        """skills 写成 int -> 抛出裸 TypeError（未包装成友好错误）。"""
        with pytest.raises(TypeError):
            _load_card(lambda d: d.__setitem__("skills", 5))


# ---------------------------------------------------------------------------
# P1-1 / P1-2：掷骰规则的双端一致性基线（Python 侧为规则基准）
# ---------------------------------------------------------------------------
class TestDiceRuleBaseline:
    """Python 侧是规则基准。TS 端 dice.ts 当前与此处不一致（见全检报告 P1-1/P1-2）。"""

    def test_lucky_feat_reroll_takes_new_value_not_max(self):
        """dice.py:90 —— 幸运专长重掷**取新值**（可能更低），忠于 D&D 5e。

        TS 端 dice.ts:73 写成 Math.max(roll, rollD20())（取较高值），与本基准不符。
        """
        import inspect
        from d20 import dice
        src = inspect.getsource(dice.DiceService.d20_roll)
        assert "Math.max" not in src
        assert "roll = roll_d20()" in src, "Python 侧应重掷取新值"

    def test_gurps_17_is_success_when_target_ge_16(self):
        """dice.py:123-125 —— 有效技能 >=16 时掷 17 判成功。"""
        import inspect
        from d20 import dice
        src = inspect.getsource(dice.DiceService.gurps_check)
        assert "total == 17 and target >= 16" in src


# ---------------------------------------------------------------------------
# P2：narration 本地化覆盖缺口
# ---------------------------------------------------------------------------
class TestNarrationLocalization:
    """战报中英混杂：未覆盖的武器名原样透出英文。"""

    @pytest.mark.parametrize("en", ["Morningstar", "Handaxe", "Greataxe",
                                    "Fire Bolt", "Magic Missile"])
    def test_weapon_name_not_translated(self, en):
        """这些武器名当前未翻译，战报会漏出英文（缺陷现状）。"""
        assert narration.translate_weapon(en) == en

    def test_translation_table_covers_common_weapons(self):
        """已覆盖的常见武器仍必须翻译正确（防止修复时误删映射表）。"""
        assert narration.translate_weapon("Shortbow") == "短弓"
        assert narration.translate_weapon("Longbow") == "长弓"
        assert narration.translate_weapon("Greatsword") == "巨剑"

    def test_ranged_weapon_dtype_defaults_to_slashing(self):
        """weapon_dtype 对远程武器错误回退为「挥砍」（弓箭应为穿刺）。"""
        assert narration.weapon_dtype("Shortbow") == "挥砍"
        assert narration.weapon_dtype("Longbow") == "挥砍"


# ---------------------------------------------------------------------------
# 端到端冒烟：v2.2 核心链路必须可用（防止上述缺陷修复时打断主流程）
# ---------------------------------------------------------------------------
class TestEndToEndSmoke:
    def test_battle_runs_to_completion(self):
        """模拟对战：4 人小队 vs 3 敌人，必须分出胜负并产出战报。"""
        c = Character()
        party = [Character.random(level=3, seed=s) for s in (1, 2, 3, 4)]
        c.battle_create(party, ["哥布林", "哥布林", "大地精"])
        res = c.battle_run(max_rounds=60)
        assert res["winner"] in ("party", "foe")
        assert res["rounds"] >= 1
        assert "战斗结束" in c.battle_report()

    def test_character_card_roundtrip(self):
        """角色卡 保存 -> 加载 往返一致。"""
        c = Character.random(level=3, seed=42)
        fd, path = tempfile.mkstemp(suffix=".json")
        os.close(fd)
        try:
            c.save(path)
            assert Character.load(path).to_dict() == c.to_dict()
        finally:
            os.unlink(path)
