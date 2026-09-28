"""troupe 任务系统增强测试：依赖 / 期限 / 失败条件 + 时钟后果真正落地。

锁定三条过去缺失的不变量：
1. 任务**会被卡住**：``depends_on`` 未完成 → locked，不可接取；前置完成 → 自动解锁。
2. 任务**会过期、会失败**：``deadline_minutes`` 超时自动 fail；``fail_condition``
   （``clock:<id>`` / ``quest_failed:<id>``）达成自动 fail 且可级联。
3. 时钟**后果会落地**：``clock/full`` 过去**零订阅者**，压力只停留在日志文本；
   现在由导演兑现为真实世界变更（danger→开战 / campaign→混沌+2 / faction→态度-1）。
"""
from troupe.simulator import Simulator
from troupe.contracts import Objective, Quest


def _sim(seed: int = 21):
    return Simulator.quick(seed=seed, ruleset="dnd5e", level=3, count=1)


# =============================================================================
#  1) 依赖：前置未完成 → 锁定
# =============================================================================
def test_quest_dependency_locks_until_prereq_done():
    sim = _sim(21)
    q1 = Quest(id="q1", title="找到地图",
               objectives=[Objective(id="o1", text="取得地图")])
    q2 = Quest(id="q2", title="进入遗迹",
               objectives=[Objective(id="o2", text="进入遗迹")],
               depends_on=["q1"])
    q2.status = "locked"
    sim.ctx.quest.add(q1)
    sim.ctx.quest.add(q2)

    # 前置未完成 → 锁定，接取被拒
    assert sim.ctx.quest.is_unlocked(q2) is False
    assert sim.ctx.quest.start("q2") is None
    assert q2.status == "locked"
    assert q2 in sim.ctx.quest.all() and q2 not in sim.ctx.quest.available()

    # 完成前置 → 自动解锁（_check_complete 会 refresh_locks）
    sim.ctx.quest.complete_objective("q1", "o1")
    assert q1.status == "done"
    assert q2.status == "active"
    assert q2 in sim.ctx.quest.available()


def test_quest_chain_unlocks_only_in_order():
    """三连任务必须按序解锁，不能跳步。"""
    sim = _sim(22)
    a = Quest(id="a", title="A", objectives=[Objective(id="a1", text="a")],
              reward_xp=10)
    b = Quest(id="b", title="B", objectives=[Objective(id="b1", text="b")],
              depends_on=["a"], status="locked")
    c = Quest(id="c", title="C", objectives=[Objective(id="c1", text="c")],
              depends_on=["b"], status="locked")
    for q in (a, b, c):
        sim.ctx.quest.add(q)

    assert sim.ctx.quest.tick()["unlocked"] == []      # 一个都没解锁
    sim.ctx.quest.complete_objective("a", "a1")
    assert b.status == "active" and c.status == "locked"   # 只解锁 b
    sim.ctx.quest.complete_objective("b", "b1")
    assert c.status == "active"                            # 再解锁 c


# =============================================================================
#  2) 期限与失败条件
# =============================================================================
def test_quest_deadline_expires_and_fails():
    sim = _sim(23)
    q = Quest(id="qd", title="限时护送",
              objectives=[Objective(id="o", text="送达")], deadline_minutes=60)
    sim.ctx.quest.add(q)
    sim.ctx.quest.start("qd")
    start = q.started_minute
    assert q.status == "active"

    # 未超时 → 不动
    assert sim.ctx.quest.tick(now=start + 30)["failed"] == []
    assert q.status == "active"
    # 刚到期不判失败（> 才算超）
    assert sim.ctx.quest.tick(now=start + 60)["failed"] == []
    # 超时 → 自动失败
    assert "qd" in sim.ctx.quest.tick(now=start + 61)["failed"]
    assert q.status == "failed"


def test_quest_fails_when_linked_clock_fills():
    sim = _sim(24)
    c = sim.ctx.clock.create("cl_chase", "追兵逼近", segments=2,
                             kind="campaign", consequence="追兵赶到")
    q = Quest(id="qc", title="甩掉追兵",
              objectives=[Objective(id="o", text="逃脱")],
              fail_condition="clock:cl_chase")
    sim.ctx.quest.add(q)
    sim.ctx.quest.start("qc")

    sim.ctx.clock.tick("cl_chase", 1)
    assert c.full is False
    assert sim.ctx.quest.tick()["failed"] == []        # 未满 → 任务仍在

    sim.ctx.clock.tick("cl_chase", 1)
    assert c.full is True
    assert "qc" in sim.ctx.quest.tick()["failed"]      # 已满 → 任务失败
    assert q.status == "failed"


def test_quest_failure_cascades_to_dependent():
    """前置任务失败 → 以 ``quest_failed:<id>`` 为失败条件的下游一并失败。"""
    sim = _sim(25)
    q1 = Quest(id="q1", title="护送商队",
               objectives=[Objective(id="o1", text="抵达")])
    q2 = Quest(id="q2", title="交付货物",
               objectives=[Objective(id="o2", text="交货")],
               fail_condition="quest_failed:q1")
    sim.ctx.quest.add(q1)
    sim.ctx.quest.add(q2)
    sim.ctx.quest.start("q1")
    sim.ctx.quest.start("q2")

    sim.ctx.quest.fail("q1", reason="商队被劫")
    assert q1.status == "failed"
    assert q2.status == "failed"      # 级联，无需等 tick


# =============================================================================
#  3) 时钟后果真正落地（clock/full 过去零订阅者）
# =============================================================================
def test_danger_clock_full_actually_starts_a_fight():
    sim = _sim(26)
    sim.ctx.clock.create("cl_danger", "暴露行踪", segments=1, kind="danger",
                         consequence="守卫围上来了")
    before = len(sim.ctx.log.tail(200))
    sim.ctx.clock.tick("cl_danger", 1)
    events = sim.ctx.log.tail(200)
    assert len(events) > before
    # 后果被兑现：记 clock.consequence，且真的是战斗（combat.end 出现）
    assert any(e.type == "clock.consequence" for e in events)
    assert any(e.type == "combat.end" for e in events), \
        "danger 时钟满应真的开一场遭遇，而非只写一行文本"
    # 已满的事实保留（供任务失败条件读取），但标记为已兑现
    c = sim.ctx.clock.get("cl_danger")
    assert c.full is True and c.consumed is True


def test_campaign_clock_full_raises_chaos():
    sim = _sim(27)
    chaos_before = sim.ctx.oracle.chaos
    sim.ctx.clock.create("cl_camp", "古神苏醒", segments=1, kind="campaign",
                         consequence="仪式完成")
    sim.ctx.clock.tick("cl_camp", 1)
    assert sim.ctx.oracle.chaos == chaos_before + 2
    assert sim.ctx.clock.get("cl_camp").consumed is True


def test_faction_clock_full_sours_factions():
    sim = _sim(28)
    if not sim.ctx.faction.all():
        # 无派系的模组下该分支退化为「仅记录」，不应崩溃
        sim.ctx.clock.create("cl_f", "教团警觉", segments=1, kind="faction")
        sim.ctx.clock.tick("cl_f", 1)
        assert sim.ctx.clock.get("cl_f").consumed is True
        return
    before = {f.id: int(getattr(f, "standing", 0) or 0) for f in sim.ctx.faction.all()}
    sim.ctx.clock.create("cl_f", "教团警觉", segments=1, kind="faction")
    sim.ctx.clock.tick("cl_f", 1)
    after = {f.id: int(getattr(f, "standing", 0) or 0) for f in sim.ctx.faction.all()}
    assert any(after[k] < before[k] for k in before), "派系时钟满应恶化态度"


def test_clock_full_does_not_retrigger():
    """已满时钟再 tick 不重复兑现后果（tick 对满时钟直接返回）。"""
    sim = _sim(29)
    sim.ctx.clock.create("cl_once", "一次性的压力", segments=1, kind="campaign")
    sim.ctx.clock.tick("cl_once", 1)
    n_after_first = len([e for e in sim.ctx.log.tail(200)
                         if e.type == "clock.consequence"])
    sim.ctx.clock.tick("cl_once", 5)          # 再次推进
    n_after_second = len([e for e in sim.ctx.log.tail(200)
                          if e.type == "clock.consequence"])
    assert n_after_second == n_after_first, "时钟满后不应重复兑现后果"
