"""roleplayer.character_io 边界测试（该模块此前 0% 覆盖，从未被任何测试 import）。

覆盖重点：JSON 往返保真、深拷贝别名、文件 IO 异常路径（不存在/损坏 JSON/编码错误）、
随机种子可复现性、等级边界。
"""
import json
import os
import sys

import pytest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from roleplayer import Character
from roleplayer.character_io import (
    SAVE_FORMAT, SAVE_VERSION,
    to_full_dict, character_from_dict, save_character, load_character,
    random_character, _copy,
)


@pytest.fixture
def rich_char():
    """一个有职业/等级/技能/装备/技术的角色，用于往返保真比对。"""
    c = Character(starting_cp=500)
    c.set_class("法师")
    c.level_to(4)
    c.set_attribute("智力", 16)
    c.set_attribute("体质", 14)
    c.purchase_skill("奥术施法", 10)
    c.purchase_skill("近战攻击", 6)
    c.purchase_technique("火焰箭")
    c.equip_item("匕首")
    return c


# =============================================================================
#  _copy 深拷贝语义
# =============================================================================
class TestCopySemantics:
    def test_copy_dict_returns_new_object_not_alias(self):
        src = {"力量": 16}
        out = _copy(src)
        assert out == src
        assert out is not src

    def test_copy_list_returns_new_object_not_alias(self):
        src = ["匕首", "布甲"]
        out = _copy(src)
        assert out == src
        assert out is not src

    def test_copy_scalar_returned_as_is(self):
        assert _copy(16) == 16
        assert _copy("法师") == "法师"
        assert _copy(None) is None


# =============================================================================
#  to_full_dict / character_from_dict 往返
# =============================================================================
class TestRoundTrip:
    def test_to_full_dict_has_format_metadata(self, rich_char):
        d = to_full_dict(rich_char)
        assert d["__format__"] == SAVE_FORMAT == "d20-character"
        assert d["version"] == SAVE_VERSION == 1
        assert "saved_at" in d and d["saved_at"]

    def test_roundtrip_preserves_scalars(self, rich_char):
        d = to_full_dict(rich_char)
        back = character_from_dict(d)
        for f in ("cp", "base_cp", "cls", "level", "race", "background",
                  "current_hp", "hit_dice_used"):
            assert getattr(back.state, f) == getattr(rich_char.state, f), f

    def test_roundtrip_preserves_containers(self, rich_char):
        d = to_full_dict(rich_char)
        back = character_from_dict(d)
        assert back.state.attributes == rich_char.state.attributes
        assert back.state.skills == rich_char.state.skills
        assert back.state.equipment == rich_char.state.equipment
        assert back.state.techniques == rich_char.state.techniques

    def test_roundtrip_preserves_class_and_level(self, rich_char):
        back = character_from_dict(to_full_dict(rich_char))
        assert back.state.cls == rich_char.state.cls
        assert back.state.level == rich_char.state.level

    def test_roundtrip_does_not_share_container_aliases(self, rich_char):
        """从同一份 dict 读回的两个角色，容器字段必须互不影响。"""
        d = to_full_dict(rich_char)
        a = character_from_dict(d)
        b = character_from_dict(d)
        a.state.skills["临时技能"] = 99
        assert "临时技能" not in b.state.skills
        assert "临时技能" not in d["skills"]

    def test_roundtrip_armor_max_dex_preserved(self, rich_char):
        rich_char.state._armor_max_dex = 2
        back = character_from_dict(to_full_dict(rich_char))
        assert back.state._armor_max_dex == 2

    def test_missing_armor_max_dex_leaves_default(self):
        back = character_from_dict({})
        assert back.state._armor_max_dex == 99


# =============================================================================
#  character_from_dict 容错
# =============================================================================
class TestFromDictTolerance:
    def test_empty_dict_yields_blank_character_without_crash(self):
        c = character_from_dict({})
        assert c is not None
        assert c.state.cls in (None, "")
        assert not c.state.skills

    def test_unknown_extra_keys_are_ignored(self):
        c = character_from_dict({"力量": 99, "不存在的字段": [1, 2, 3]})
        assert c.state.skills == {}

    def test_partial_dict_fills_only_present_fields(self):
        c = character_from_dict({"level": 5, "skills": {"近战攻击": 8}})
        assert c.state.level == 5
        assert c.state.skills == {"近战攻击": 8}
        assert c.state.attributes  # 未提供的字段保持默认非空

    def test_container_field_given_as_list_is_accepted(self):
        c = character_from_dict({"techniques": ["火焰箭"]})
        assert c.state.techniques == ["火焰箭"]

    def test_container_field_given_as_tuple_is_accepted(self):
        c = character_from_dict({"techniques": ("火焰箭",)})
        assert c.state.techniques == ["火焰箭"]


# =============================================================================
#  文件 IO 正常路径
# =============================================================================
class TestFileIOHappyPath:
    def test_save_appends_json_suffix_and_returns_absolute_path(self, rich_char, tmp_path):
        target = tmp_path / "hero"
        out = save_character(rich_char, target)
        assert out.endswith("hero.json")
        assert os.path.isabs(out)
        assert os.path.exists(out)

    def test_save_keeps_explicit_json_suffix(self, rich_char, tmp_path):
        out = save_character(rich_char, tmp_path / "hero.json")
        assert out.endswith("hero.json")
        assert os.path.exists(out)

    def test_saved_file_is_utf8_readable_chinese(self, rich_char, tmp_path):
        out = save_character(rich_char, tmp_path / "hero.json")
        raw = open(out, "rb").read()
        text = raw.decode("utf-8")          # 非 UTF-8 会在此抛异常
        assert '"cls"' in text
        # ensure_ascii=False 应让中文以原字符落盘
        assert "法师".encode("utf-8") in raw

    def test_load_roundtrip_matches_original_state(self, rich_char, tmp_path):
        out = save_character(rich_char, tmp_path / "hero.json")
        back = load_character(out)
        assert back.state.attributes == rich_char.state.attributes
        assert back.state.skills == rich_char.state.skills
        assert back.state.techniques == rich_char.state.techniques
        assert back.state.cls == rich_char.state.cls
        assert back.state.level == rich_char.state.level

    def test_save_twice_overwrites_without_corruption(self, rich_char, tmp_path):
        p = tmp_path / "hero.json"
        save_character(rich_char, p)
        save_character(rich_char, p)
        data = json.loads(p.read_text(encoding="utf-8"))
        assert data["__format__"] == SAVE_FORMAT     # 未被追加成两份 JSON


# =============================================================================
#  文件 IO 异常路径
# =============================================================================
class TestFileIOErrorPaths:
    def test_load_missing_file_raises_filenotfound(self, tmp_path):
        with pytest.raises(FileNotFoundError):
            load_character(tmp_path / "does_not_exist.json")

    def test_load_directory_path_raises_oserror(self, tmp_path):
        with pytest.raises(OSError):
            load_character(tmp_path)

    def test_load_corrupted_json_raises_decode_error(self, tmp_path):
        p = tmp_path / "broken.json"
        p.write_text("{ this is not valid json ,,,", encoding="utf-8")
        with pytest.raises(json.JSONDecodeError):
            load_character(p)

    def test_load_empty_file_raises_decode_error(self, tmp_path):
        p = tmp_path / "empty.json"
        p.write_text("", encoding="utf-8")
        with pytest.raises(json.JSONDecodeError):
            load_character(p)

    def test_load_non_numeric_json_raises_typeerror(self, tmp_path):
        """顶层是标量（null / 数字）时 list(...) 会抛 TypeError。"""
        for content in ("null", "123"):
            p = tmp_path / "scalar.json"
            p.write_text(content, encoding="utf-8")
            with pytest.raises(TypeError):
                load_character(p)

    @pytest.mark.xfail(
        strict=True,
        reason="已知 BUG：load_character 不校验 __format__/顶层类型，"
               "数组或字符串型 JSON 会被静默读成一张空白卡（见 QA 报告 BUG-4）",
    )
    def test_load_non_object_json_should_be_rejected(self, tmp_path):
        """修复后请删除 xfail 标记：非对象存档应报错，而不是静默产出空角色。"""
        for content in ("[1, 2, 3]", '"just a string"'):
            p = tmp_path / "arr.json"
            p.write_text(content, encoding="utf-8")
            with pytest.raises((TypeError, ValueError, KeyError)):
                load_character(p)

    def test_load_gbk_encoded_file_raises_unicode_decode_error(self, tmp_path):
        """用 GBK 写中文再按 UTF-8 读，必须抛 UnicodeDecodeError（显式失败而非乱码）。"""
        p = tmp_path / "gbk.json"
        p.write_bytes('{"cls": "法师"}'.encode("gbk"))
        with pytest.raises(UnicodeDecodeError):
            load_character(p)

    def test_save_to_nonexistent_nested_dir_raises_filenotfound(self, rich_char, tmp_path):
        with pytest.raises(FileNotFoundError):
            save_character(rich_char, tmp_path / "no" / "such" / "dir" / "hero.json")


# =============================================================================
#  random_character 可复现性与边界
# =============================================================================
class TestRandomCharacter:
    def test_same_seed_produces_identical_character(self):
        a = random_character(level=3, seed=42)
        b = random_character(level=3, seed=42)
        assert a.state.cls == b.state.cls
        assert a.state.attributes == b.state.attributes
        assert a.state.skills == b.state.skills
        assert a.state.equipment == b.state.equipment
        assert a.state.techniques == b.state.techniques

    def test_different_seeds_produce_different_builds(self):
        seen = set()
        for s in range(12):
            c = random_character(level=3, seed=s)
            seen.add((c.state.cls, tuple(sorted(c.state.skills.items()))))
        assert len(seen) > 1, "不同种子应产生不同构筑"

    def test_seed_does_not_leak_into_global_random_state(self):
        """random_character 必须用独立 Random(seed)，不得污染全局 random。"""
        import random
        random.seed(1234)
        before = [random.randint(1, 10**6) for _ in range(3)]
        random.seed(1234)
        random_character(level=3, seed=999)
        after = [random.randint(1, 10**6) for _ in range(3)]
        assert before == after, "random_character 污染了全局随机状态"

    def test_zero_and_negative_level_clamp_to_one(self):
        for lv in (0, -1, -100):
            c = random_character(level=lv, seed=3)
            assert c.state.level == 1, f"level={lv} 应被夹到 1"

    def test_generated_character_is_exportable_and_reloadable(self, tmp_path):
        c = random_character(level=5, seed=11)
        p = save_character(c, tmp_path / "rand.json")
        back = load_character(p)
        assert back.state.cls == c.state.cls
        assert back.state.skills == c.state.skills
        assert back.state.equipment == c.state.equipment

    def test_generated_character_always_valid_class(self):
        from roleplayer.data_classes import CLASSES
        for s in range(15):
            c = random_character(level=3, seed=s)
            assert c.state.cls in CLASSES, f"seed={s} 产生了非法职业 {c.state.cls}"

    @pytest.mark.parametrize("lv", list(range(1, 15)))
    def test_low_level_characters_have_positive_max_hp(self, lv):
        for seed in (1, 2, 3):
            c = random_character(level=lv, seed=seed)
            assert c.max_hp > 0, f"level={lv} seed={seed} 生成了 max_hp={c.max_hp}"

    @pytest.mark.parametrize("lv", [15, 16, 17, 18, 19, 20])
    def test_high_level_characters_should_have_positive_max_hp(self, lv):
        """高等级随机角色必须有正生命值，不得产出 0 HP 废卡。

        2026-08-29 已修复：derived.max_hp 去掉 vit_rank==0 的 ``return 0.0`` 早退，
        改为按公式外推并设下限。
        """
        for seed in (1, 2, 3):
            c = random_character(level=lv, seed=seed)
            assert c.max_hp > 0, f"level={lv} seed={seed} 生成了 max_hp={c.max_hp} 的废卡"
