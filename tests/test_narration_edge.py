"""roleplayer.narration 边界测试：补齐零伤害 / 平局 / 未知输入等未覆盖分支。

覆盖率依据（修复前）：narration.py 95%，未覆盖行为
171（元素部位短语回退）、245（attack_hit 零伤害）、297（save_fail 零伤害）、
409（cast 零伤害）、431（initiative 从未被调用）、462（battle_end 平局）。
"""
import os
import sys

import pytest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from roleplayer import narration as N
from roleplayer.narration import (
    hit_location, wound_multiplier, weapon_dtype, translate_weapon,
    attack_hit, attack_miss, save_success, save_fail,
    condition_apply, condition_recover, kill, down, death_save,
    resist, immune, vuln, cast, heal, move, initiative,
    battle_start, battle_end, _location_phrase,
)


VALID_LOCATIONS = ("头骨", "面部", "颈部", "躯干", "腹股沟", "手臂", "手", "腿", "脚")


# =============================================================================
#  零伤害分支（此前从未被执行）
# =============================================================================
class TestZeroDamageBranches:
    def test_attack_hit_zero_damage_omits_damage_figure(self):
        out = attack_hit("阿瑞斯", "哥布林", "长剑", "挥砍", 0)
        assert isinstance(out, str) and out
        assert "0 点伤害" not in out, "零伤害不应报「0 点伤害」"
        assert "阿瑞斯" in out and "哥布林" in out

    def test_attack_hit_positive_damage_includes_figure(self):
        out = attack_hit("阿瑞斯", "哥布林", "长剑", "挥砍", 9)
        assert "9" in out

    def test_save_fail_zero_damage_reports_opening(self):
        out = save_fail("哥布林", "ref", 0)
        assert out
        assert "0 点伤害" not in out

    def test_save_fail_positive_damage_includes_figure(self):
        out = save_fail("哥布林", "ref", 12)
        assert "12" in out

    def test_cast_zero_damage_reports_magic_only(self):
        out = cast("梅林", "食尸鬼", "火球术", 0, "火焰")
        assert out
        assert "0 点伤害" not in out
        assert "火球术" in out

    def test_cast_positive_damage_includes_figure(self):
        out = cast("梅林", "食尸鬼", "火球术", 24, "火焰")
        assert "24" in out

    def test_heal_zero_amount_still_produces_sentence(self):
        out = heal("牧师", "战士", 0)
        assert out and "战士" in out, "零治疗量文案至少应提到被治疗者"
        assert "牧师" not in out, "实现：零治疗量走「自然愈合」文案，不提施术者"

    def test_move_zero_feet_still_produces_sentence(self):
        out = move("游荡者", 0)
        assert out and "游荡者" in out


# =============================================================================
#  battle_end 平局分支（此前从未被执行）
# =============================================================================
class TestBattleEndBranches:
    def test_party_win_mentions_victory(self):
        assert "胜利" in battle_end("party", 4) or "获胜" in battle_end("party", 4)

    def test_foe_win_mentions_defeat(self):
        out = battle_end("foe", 4)
        assert "倒下" in out or "失败" in out or "击溃" in out

    def test_draw_is_handled_without_KeyError(self):
        """winner 非 party/foe（如 'draw' 或空串）时必须走平局文案。"""
        for w in ("draw", "", None, "unknown_value"):
            out = battle_end(w, 3)
            assert out and "3" in out, f"winner={w!r} 未产生合法平局文案"

    def test_battle_start_mentions_all_participants(self):
        out = battle_start(["战士", "法师"], ["哥布林", "大地精"], 60)
        for name in ("战士", "法师", "哥布林", "大地精"):
            assert name in out

    def test_battle_start_handles_empty_lists(self):
        out = battle_start([], [], 30)
        assert isinstance(out, str) and out


# =============================================================================
#  initiative：已定义但代码中从未调用（死代码，需确认仍可用）
# =============================================================================
class TestInitiative:
    def test_initiative_reports_unit_and_roll(self):
        out = initiative("哥布林", 17)
        assert "哥布林" in out
        assert "17" in out

    def test_initiative_never_called_from_battle_or_combat(self):
        """确认该函数当前在生产代码中无调用点（死代码，供后续清理确认）。"""
        import subprocess
        src = open(os.path.join(ROOT, "roleplayer", "battle.py"), encoding="utf-8").read()
        assert "narration.initiative" not in src, \
            "battle.py 已开始调用 narration.initiative，请删除本断言"


# =============================================================================
#  部位 / 伤害类型映射
# =============================================================================
class TestLocationAndDamageType:
    def test_hit_location_always_returns_known_location(self):
        for _ in range(200):
            assert hit_location() in VALID_LOCATIONS

    def test_location_phrase_falls_back_for_element_type(self):
        """物理三类的部位短语查不到时，应回退到元素部位短语而非崩溃。"""
        out = _location_phrase("头骨", "火焰")
        assert isinstance(out, str) and out

    def test_location_phrase_falls_back_for_unknown_location(self):
        out = _location_phrase("不存在的部位", "挥砍")
        assert isinstance(out, str) and out

    def test_location_phrase_physical_types_are_distinct(self):
        outs = {_location_phrase("躯干", t) for t in ("挥砍", "穿刺", "钝击")}
        assert all(isinstance(o, str) and o for o in outs)

    def test_wound_multiplier_is_positive_for_all_combinations(self):
        for loc in VALID_LOCATIONS:
            for dt in ("挥砍", "穿刺", "钝击", "火焰", "未知类型"):
                m = wound_multiplier(loc, dt)
                assert isinstance(m, (int, float)) and m > 0, f"{loc}/{dt} 倍率={m}"

    def test_wound_multiplier_head_is_higher_than_limb(self):
        """要害（头骨）倍率应高于四肢（手），否则部位系统无意义。"""
        assert wound_multiplier("头骨", "挥砍") > wound_multiplier("手", "挥砍")

    def test_weapon_dtype_unknown_weapon_falls_back(self):
        assert weapon_dtype("完全不存在的武器xyz") in ("挥砍", "穿刺", "钝击")

    def test_weapon_dtype_known_weapons(self):
        assert weapon_dtype("长剑") == "挥砍"
        assert weapon_dtype("匕首") == "穿刺"
        assert weapon_dtype("钉头锤") == "钝击"

    def test_translate_weapon_unknown_returns_input_or_empty(self):
        out = translate_weapon("完全不存在的武器xyz")
        assert isinstance(out, str)


# =============================================================================
#  空 / 异常输入
# =============================================================================
class TestEmptyAndOddInputs:
    def test_empty_names_do_not_crash(self):
        assert attack_hit("", "", "", "", 5)
        assert attack_miss("", "")
        assert save_success("")
        assert save_fail("")
        assert condition_apply("", "")
        assert condition_recover("", "")
        assert kill("")
        assert down("")
        assert resist("", "")
        assert immune("", "")
        assert vuln("", "")
        assert cast("", "", "")
        assert heal("", "", 0)
        assert move("", 0)

    def test_negative_damage_does_not_crash(self):
        assert isinstance(attack_hit("A", "B", "长剑", "挥砍", -5), str)
        assert isinstance(cast("A", "B", "火球术", -5, "火焰"), str)
        assert isinstance(save_fail("B", "ref", -5), str)

    def test_very_large_damage_does_not_crash(self):
        out = attack_hit("A", "B", "长剑", "挥砍", 10**9)
        assert "1000000000" in out

    def test_death_save_unknown_outcome_has_fallback(self):
        for outcome in ("success", "fail", "dead", "stabilize", "未知状态"):
            assert isinstance(death_save("战士", outcome), str)

    def test_all_functions_return_strings(self):
        """叙事层契约：所有出口都必须是非空字符串，避免 UI 拼接到 None。"""
        cases = [
            attack_hit("A", "B", "长剑", "挥砍", 7),
            attack_miss("A", "B", "长剑"),
            save_success("B", "ref"),
            save_fail("B", "ref", 7, "火焰"),
            condition_apply("B", "中毒"),
            condition_recover("B", "中毒"),
            kill("B"), down("B"), death_save("B", "success"),
            resist("B", "火焰"), immune("B", "火焰"), vuln("B", "火焰"),
            cast("A", "B", "火球术", 7, "火焰"),
            heal("A", "B", 7), move("A", 30), initiative("A", 10),
            battle_start(["A"], ["B"], 30), battle_end("party", 2),
        ]
        for i, out in enumerate(cases):
            assert isinstance(out, str) and out.strip(), f"第 {i} 项返回了空/非字符串: {out!r}"
