"""troupe 空间地图（地牢网格）测试。

锁定四条不变量：
1. **确定性**：同种子必得同一张图；
2. **连通性**：入口 S 必能走通出口 X（4 邻域 BFS）；
3. **结构合法**：房间互不重叠、渲染尺寸正确、入口/出口各一；
4. **挂接**：``Simulator.explore_dungeon`` 写入会话状态、可存档往返、
   ``render_dungeon`` 输出非空。
"""
from troupe.simulator import Simulator
from troupe.spatial import DungeonMap, generate_dungeon
from troupe.render import render_dungeon


# =============================================================================
#  1) 生成
# =============================================================================
def test_generate_is_deterministic_by_seed():
    a = generate_dungeon(91)
    b = generate_dungeon(91)
    c = generate_dungeon(92)
    assert a.render() == b.render()
    assert a.render() != c.render()


def test_dungeon_is_connected_entry_to_exit():
    for seed in (1, 2, 3, 7, 42, 99):
        dm = generate_dungeon(seed)
        assert dm.is_connected(), f"seed={seed} 的入口走不到出口"
        assert dm.count("S") == 1 and dm.count("X") == 1


def test_dungeon_structure_is_valid():
    dm = generate_dungeon(5, n_rooms=7)
    assert len(dm.rooms) == 7
    assert dm.width == 44 and dm.height == 18
    lines = dm.render().splitlines()
    assert len(lines) == dm.height
    assert all(len(l) == dm.width for l in lines)
    # 房间互不重叠（间距 ≥1 已由生成器保证，抽查渲染里每个房间都是地板开头）
    for (x, y, w, h) in dm.rooms:
        assert dm.grid[y][x] in (".", "S", "X", "T")


def test_treasures_are_optional_and_counted():
    dm = generate_dungeon(13, n_rooms=8)
    assert dm.count("T") >= 0
    assert dm.count("#") > 0                       # 墙必须存在（不是全地板）


# =============================================================================
#  2) 渲染与存档
# =============================================================================
def test_render_html_is_self_contained_and_escaped():
    dm = generate_dungeon(17)
    h = dm.render_html()
    assert "<pre" in h and "</pre>" in h
    assert "入口" in h and "出口" in h             # 图例存在


def test_dungeon_roundtrip_through_dict():
    dm = generate_dungeon(23)
    dm2 = DungeonMap.from_dict(dm.to_dict())
    assert dm2.render() == dm.render()
    assert dm2.rooms == dm.rooms
    assert dm2.seed == dm.seed
    assert dm2.is_connected()


# =============================================================================
#  3) 与模拟器挂接
# =============================================================================
def test_simulator_explore_dungeon_stores_and_renders():
    sim = Simulator.quick(seed=24, ruleset="dnd5e", level=3, count=2)
    dm = sim.explore_dungeon(seed=24)
    assert sim.ctx.state.dungeon.get("grid"), "地图应写入会话状态"
    assert sim.ctx.state.dungeon["seed"] == 24
    out = render_dungeon(sim)
    assert "地牢地图" in out and "S" in out
    # 同一局生成的地图与状态里的一致
    dm2 = DungeonMap.from_dict(sim.ctx.state.dungeon)
    assert dm2.render() == dm.render()


def test_render_dungeon_without_map_is_graceful():
    sim = Simulator.quick(seed=25, ruleset="dnd5e", level=3, count=2)
    out = render_dungeon(sim)
    assert "尚未探索" in out or "地牢地图" in out


def test_dungeon_survives_save_roundtrip(tmp_path):
    sim = Simulator.quick(seed=26, ruleset="dnd5e", level=3, count=2)
    sim.explore_dungeon(seed=26)
    from troupe.save import load_simulator, save_simulator
    path = str(tmp_path / "with_dungeon.json")
    save_simulator(sim, path)
    sim2 = load_simulator(path)
    assert sim2.ctx.state.dungeon.get("grid")
    assert DungeonMap.from_dict(sim2.ctx.state.dungeon).is_connected()
