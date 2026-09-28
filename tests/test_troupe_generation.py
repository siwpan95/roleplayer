"""troupe 程序化战役生成 + 叙事意义表细化测试。

锁定两件过去缺失的事：
1. **程序化生成**：``modules`` 过去只有 1 个手写模组（border_shrine），
   ``world.ensure_default_world`` 是硬编码 3 地点 —— 现在可按种子生成整张图。
2. **意义表细化**：随机事件过去只有「动词 + 名词」（发生了什么），
   现在补上「主体（谁做的）」与可选的「转折（但…）」。
"""
from troupe.modules import available_modules, generate_module, get_module
from troupe.simulator import Simulator
from troupe import data_oracle as O


# =============================================================================
#  1) 程序化生成
# =============================================================================
def test_generator_is_deterministic_by_seed():
    """同种子必得同一张图，不同种子给出不同图。"""
    a, b = generate_module(1), generate_module(1)
    c = generate_module(99)
    assert a.to_dict() == b.to_dict()
    assert a.to_dict() != c.to_dict()
    assert [p.name for p in a.places] != [p.name for p in c.places]


def test_generated_module_places_are_connected():
    """地点必须连通（仅用**非隐藏**路线即可从起点走遍全图；隐藏路线是额外捷径）。"""
    m = generate_module(7, n_places=6)
    adj: dict[str, list[str]] = {p.id: [] for p in m.places}
    for r in m.routes:
        if r.hidden:
            continue
        adj[r.a].append(r.b)
        adj[r.b].append(r.a)
    seen, stack = {m.starting_place}, [m.starting_place]
    while stack:
        cur = stack.pop()
        for nxt in adj[cur]:
            if nxt not in seen:
                seen.add(nxt)
                stack.append(nxt)
    assert seen == set(adj), f"存在不可达地点：{set(adj) - seen}"
    assert any(r.hidden for r in m.routes), "应至少有一条未发现的捷径"


def test_generated_quests_form_dependency_chain():
    """任务串成依赖链：首个开放，其余锁在前一个之后，且越靠后期限越紧。"""
    m = generate_module(3, n_quests=3)
    qs = m.quests
    assert len(qs) == 3
    assert qs[0].depends_on == [] and qs[0].status == "active"
    for i in range(1, len(qs)):
        assert qs[i].depends_on == [qs[i - 1].id], "后置任务应依赖前一个"
        assert qs[i].status == "locked"
        assert qs[i].deadline_minutes > 0, "后置任务应有期限"
    # 最终任务与主线倒计时绑定
    assert qs[-1].fail_condition == "clock:cl_doom"


def test_generated_module_loads_and_runs():
    """生成的模组能被 Simulator 真实加载并跑起来（不是只有数据结构正确）。"""
    m = generate_module(11, n_places=4, n_quests=2)
    sim = Simulator(seed=11, ruleset="dnd5e", module=m)
    # 世界/任务/时钟都进了服务
    for p in m.places:                       # 每个地点都能查到
        assert sim.ctx.world.place(p.id) is not None
    assert sim.ctx.world.here() is not None  # 起点已就位
    assert len(sim.ctx.quest.all()) == 2
    assert sim.ctx.clock.get("cl_doom") is not None
    # 真的能跑
    sim.run(2)
    assert len(sim.ctx.log.all()) > 0


def test_available_modules_includes_generated():
    mods = available_modules()
    assert "border_shrine" in mods
    assert "generated" in mods, "程序化模组应已注册"
    assert get_module("generated").id == "generated"


# =============================================================================
#  2) 叙事意义表细化
# =============================================================================
def test_meaning_tables_cover_all_dimensions():
    """意义表应有 主体 / 动词 / 名词 / 修饰 / 转折 五个维度。"""
    for name in ("MEANING_SUBJECTS", "MEANING_TWISTS"):
        table = getattr(O, name)
        assert table and len(table) >= 8, f"{name} 太小：{len(table)}"
        assert len(set(table)) == len(table), f"{name} 有重复条目"
    assert len(O.ACTION_VERBS) >= 20 and len(O.ACTION_NOUNS) >= 20
    assert len(O.DESCRIPTORS) >= 20


def test_random_event_reports_subject():
    """随机事件要能说出「谁做的」，而不只是「发生了什么」。"""
    sim = Simulator.quick(seed=41, ruleset="dnd5e", level=3, count=2)
    seen_subjects, seen_twists = set(), 0
    for _ in range(20):
        ev = sim.ctx.oracle.random_event("exploration")
        assert "subject" in ev and ev["subject"], "随机事件缺少主体"
        assert ev["subject"] in O.MEANING_SUBJECTS
        assert ev["subject"] in ev["text"], "主体应出现在叙述文本里"
        seen_subjects.add(ev["subject"])
        if ev.get("twist"):
            seen_twists += 1
            assert ev["twist"] in ev["text"], "转折应出现在叙述文本里"
    assert len(seen_subjects) > 1, "20 次抽取应见到不同主体"
    assert seen_twists > 0, "转折应至少出现过一次（约 35% 概率）"


def test_theme_tables_still_scene_specific():
    """主题表仍按场景分化（细化不得破坏原有场景特异性）。"""
    from troupe import data_tables as T
    assert T.THEME_TABLES is O.THEME_TABLES, \
        "data_tables 应 re-export data_oracle 的 THEME_TABLES，不应存在第二份副本"
    assert set(T.THEME_TABLES) >= {"exploration", "social", "combat", "travel", "downtime"}
    for kind, tbl in T.THEME_TABLES.items():
        assert tbl["verbs"] and tbl["nouns"], f"{kind} 主题表不完整"
