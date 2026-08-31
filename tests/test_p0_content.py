"""P0 GM 叙事内容测试（2026-08-30 内容填充批次 3）。

覆盖：各扩充表的规模达标 / 去重 / 加权表权重为正 / 字段完整；
地牢房间内容的同种子确定性与旧存档兼容；fronts 模板注入的确定性。
"""
import random

from troupe import data_dungeon as DD
from troupe import data_fronts as DF
from troupe import data_oracle as O
from troupe import data_tables as T
from troupe import data_world as W
from troupe.modules.generator import generate_module
from troupe.spatial import DungeonMap, generate_dungeon


def test_p0_oracle_tables_meet_targets():
    assert len(O.ACTION_VERBS) >= 100
    assert len(O.ACTION_NOUNS) >= 100
    assert len(O.DESCRIPTORS) >= 75
    assert len(O.MEANING_SUBJECTS) >= 45
    assert len(O.MEANING_TWISTS) >= 28
    assert len(O.NPC_ROLES) >= 32
    assert len(O.NPC_TRAITS) >= 32
    assert len(O.NPC_WANTS) >= 24
    for t in (O.ACTION_VERBS, O.ACTION_NOUNS, O.DESCRIPTORS,
              O.MEANING_SUBJECTS, O.MEANING_TWISTS,
              O.NPC_ROLES, O.NPC_TRAITS, O.NPC_WANTS):
        assert len(set(t)) == len(t), f"词表存在重复项: {t[:6]}"
    for theme in O.THEME_TABLES.values():
        assert len(theme["verbs"]) >= 12
        assert len(theme["nouns"]) >= 12


def test_p0_rumors_and_events_meet_targets():
    assert len(T.RUMORS) >= 40
    assert len(T.TRAVEL_EVENTS) >= 20
    assert len(T.COMPLICATIONS) >= 16
    for loc, table in T.DISCOVERIES.items():
        assert len(table) >= 10, loc
    for table in (T.RUMORS, T.TRAVEL_EVENTS, T.COMPLICATIONS):
        texts = [item[1] for item in table]
        assert len(set(texts)) == len(texts), "事件表存在重复文本"
        assert all(w > 0 for w, _ in table), "权重必须为正"


def test_p0_npc_names_meet_targets():
    assert len(W.NPC_SURNAMES) >= 40
    assert len(W.NPC_GIVEN_NAMES) >= 40
    assert len(set(W.NPC_SURNAMES)) == len(W.NPC_SURNAMES)
    assert len(set(W.NPC_GIVEN_NAMES)) == len(W.NPC_GIVEN_NAMES)


def test_p0_dungeon_tables_meet_targets_and_fields():
    assert len(DD.DUNGEON_ROOM_TYPES) >= 12
    assert len(DD.DUNGEON_DANGERS) >= 20
    assert len(DD.DUNGEON_DISCOVERIES) >= 20
    assert all(w > 0 for w, _ in DD.DUNGEON_DANGERS)
    assert all(w > 0 for w, _ in DD.DUNGEON_DISCOVERIES)
    for name, desc in DD.DUNGEON_ROOM_TYPES:
        assert name and desc
    # 抽样：字段完整
    content = DD.roll_room_content(random.Random(7))
    for key in ("type", "desc", "danger", "discovery"):
        assert content.get(key), key


def test_p0_dungeon_content_deterministic_and_serializable():
    d1 = generate_dungeon(seed=9)
    d2 = generate_dungeon(seed=9)
    assert d1.contents == d2.contents
    assert len(d1.contents) == len(d1.rooms)
    # 存档往返（含新 contents 键）
    restored = DungeonMap.from_dict(d1.to_dict())
    assert restored.contents == d1.contents
    # 旧存档（无 contents 键）加载不崩，缺省为空
    old = {"seed": 9, "grid": d1.to_dict()["grid"], "rooms": d1.to_dict()["rooms"]}
    legacy = DungeonMap.from_dict(old)
    assert legacy.contents == {}
    # HTML 渲染包含房间内容
    html = d1.render_html()
    assert "dungeon-rooms" in html


def test_p0_fronts_templates_and_generator_determinism():
    assert len(DF.FRONTS) >= 6
    for f in DF.FRONTS:
        for key in ("id", "threat", "drivers", "clock", "grim"):
            assert f.get(key), (f.get("id"), key)
    m1 = generate_module(seed=11)
    m2 = generate_module(seed=11)
    doom1 = next(c for c in m1.clocks if c.id == "cl_doom")
    doom2 = next(c for c in m2.clocks if c.id == "cl_doom")
    assert doom1.name == doom2.name          # 同种子阴谋相同
    assert doom1.name in [f["clock"] for f in DF.FRONTS]
    assert any(t.text.startswith("阴谋：") for t in m1.threads)
