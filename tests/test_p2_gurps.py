"""P2 GURPS 自研扩充测试（2026-08-31）。

覆盖：法术规模/全 IQ/学院合法/前置可解析无环；优缺点规模/键唯一；
点数经济对新增条目照常工作。
"""
from troupe.character_gurps import (
    ADVANTAGES, DISADVANTAGES, build_gurps_character, gurps_point_total,
)
from troupe.magic import GURPS_SPELLS

#: 官方学院名集合（GURPS 结构性事实；本仓中文名）
_VALID_COLLEGES = {
    "火", "水", "风", "土", "身体操控", "心智控制", "知识", "光与暗",
    "移动", "防护与警告", "治疗", "死灵", "动物", "植物", "食物",
    "通讯与共情", "附魔", "天气", "防护", "制造与破坏", "光",
}


def test_p2_spell_table_size_and_shape():
    assert len(GURPS_SPELLS) >= 60, len(GURPS_SPELLS)
    for name, sp in GURPS_SPELLS.items():
        assert sp.get("en"), name
        assert sp["college"] in _VALID_COLLEGES, (name, sp["college"])
        assert sp["attr"] == "IQ", (name, sp["attr"])   # 4e 全部 IQ 基础
        assert sp["energy"] > 0, name
        assert sp["kind"] in ("damage", "resist", "buff", "utility"), name
        assert sp.get("prereqs") is not None, name


def test_p2_spell_prereqs_resolve_and_acyclic():
    keys = set(GURPS_SPELLS)
    for name, sp in GURPS_SPELLS.items():
        for p in sp["prereqs"]:
            assert p in keys, (name, p)
    # DFS 无环
    state = {}
    def dfs(k):
        if state.get(k) == 1:
            raise AssertionError(f"前置链成环: {k}")
        if state.get(k) == 2:
            return
        state[k] = 1
        for p in GURPS_SPELLS[k]["prereqs"]:
            dfs(p)
        state[k] = 2
    for k in keys:
        dfs(k)


def test_p2_traits_size_and_unicity():
    assert len(ADVANTAGES) + len(DISADVANTAGES) >= 80
    assert len(set(ADVANTAGES)) == len(ADVANTAGES)
    assert len(set(DISADVANTAGES)) == len(DISADVANTAGES)
    assert all(v > 0 for v in ADVANTAGES.values())
    assert all(v < 0 for v in DISADVANTAGES.values())
    # 已核对的官方条目不动
    assert ADVANTAGES["魔法天赋1级"] == 10
    assert ADVANTAGES["语言天才"] == 10


def test_p2_point_economy_works_with_new_traits():
    char, pts = build_gurps_character(
        {"力量": 12, "敏捷": 12, "智力": 12, "体质": 12},
        advantages=["魔法天赋1级", "直觉敏锐", "名门出身"],
        disadvantages=["被通缉", "招邪"],
        skills={"剑术": 2}, seed=1, name="扩充试作")
    assert char is not None
    assert pts > 0
    expect = gurps_point_total(
        st=12, dx=12, iq=12, ht=12,
        advantages=["魔法天赋1级", "直觉敏锐", "名门出身"],
        disadvantages=["被通缉", "招邪"],
        skills={"剑术": 2})
    assert pts == expect
    # 魔法天赋1级 → gurps_magery == 1
    assert char.state.flags["gurps_magery"] == 1
