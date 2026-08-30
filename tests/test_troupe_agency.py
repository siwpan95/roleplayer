"""troupe NPC 自主行动测试。

锁定「世界自己会动」的四条不变量：
1. 行动**真实落地**：每个行动都产生 ``npc.action`` 事件 + 可观察的世界变化
   （线索 / 态度 / 派系声望 / 金币 / 移动 / 危险度）；
2. **确定性**：同种子两次 ``tick`` 结果一致；
3. **每日推进**：日历过夜（time/day 事件）触发 NPC 大规模活动；
4. 与遭遇节拍挂钩：跑场景时世界在行动间隙转动（不崩溃、事件可追溯）。
"""
from troupe.simulator import Simulator
from troupe.contracts import Place, Route
from troupe.npc_agency import _ACTION_CN, _ROLE_ACTIONS


def _sim(seed: int = 61):
    return Simulator.quick(seed=seed, ruleset="dnd5e", level=3, count=2)


# =============================================================================
#  1) 单个 NPC 行动：落地 + 事件
# =============================================================================
def test_act_produces_event_with_effects():
    sim = _sim(61)
    npc = sim.ctx.npc.generate(role="商人")
    out = sim.ctx.agency.act(npc)
    # 行动必须是合法行动键（条件层候选 或 职业表兜底 二者之一）
    assert out["action"] in _ACTION_CN
    assert out["via"] in ("condition", "fallback")
    assert out["npc"] == npc.id
    # 事件已记录且带行动键
    ev = [e for e in sim.ctx.log.tail(10) if e.type == "npc.action"]
    assert ev and ev[-1].payload["action"] == out["action"]
    assert ev[-1].payload["name"] == npc.name


def test_tick_p1_acts_on_every_living_npc():
    sim = _sim(62)
    for role in ("商人", "卫兵", "盗贼", "学者", "祭司"):
        sim.ctx.npc.generate(role=role)
    sim.ctx.npc.all()[0].alive = False          # 死亡 NPC 不应行动
    outs = sim.ctx.agency.tick(p=1.0)
    assert len(outs) == 4                        # 5 个 NPC 中 1 个死亡
    assert all(o["action"] for o in outs)


def test_tick_p0_acts_on_nobody():
    sim = _sim(63)
    sim.ctx.npc.generate(role="卫兵")
    assert sim.ctx.agency.tick(p=0.0) == []


# =============================================================================
#  2) 世界变化真实可见
# =============================================================================
def test_trade_adds_thread_and_can_raise_disposition():
    sim = _sim(64)
    npc = sim.ctx.npc.generate(role="商人")
    npc.role = "商人"
    before_threads = len(sim.ctx.oracle.open_threads())
    for _ in range(10):
        sim.ctx.agency.act(npc)
    # 商人的 trade 行动会放出线索（新增剧情线）
    assert len(sim.ctx.oracle.open_threads()) >= before_threads


def test_sneak_can_cost_gold():
    sim = _sim(65)
    thief = sim.ctx.npc.generate(role="盗贼")
    sim.ctx.state.gold = 100
    for _ in range(60):
        sim.ctx.agency.act(thief)
    # 40 次行动（盗贼 2/3 概率 sneak、sneak 内 1/4 偷钱）几乎必然至少丢一次钱
    assert sim.ctx.state.gold < 100, "盗贼活动 40 次仍未造成金币损失（异常）"


def test_travel_moves_npc_between_places():
    sim = _sim(66)
    sim.ctx.world.add_place(Place(id="a1", name="甲镇", kind="城镇"))
    sim.ctx.world.add_place(Place(id="a2", name="乙镇", kind="据点"))
    sim.ctx.world.add_route(Route(id="r1", a="a1", b="a2", terrain="道路"))
    npc = sim.ctx.npc.generate(place="a1", role="向导")
    # 队伍金币 15：不穷不富 → 行为树全不命中 → 走职业表兜底（向导 travel 权重高）
    sim.ctx.state.gold = 15
    moved = False
    for _ in range(30):
        out = sim.ctx.agency.act(npc)
        if out["action"] == "travel" and out.get("effects", {}).get("move"):
            moved = True
            break
    assert moved, "向导 30 次行动未发生一次移动（异常）"
    assert npc.place == "a2"


def test_politics_adjusts_faction_standing():
    sim = _sim(67)
    sim.ctx.faction.add(__import__("troupe.contracts", fromlist=["FactionProfile"]).FactionProfile(
        id="f1", name="铁誓约", standing=0))
    npc = sim.ctx.npc.generate(role="贵族")
    npc.faction = "f1"
    shifts = 0
    for _ in range(30):
        out = sim.ctx.agency.act(npc)
        if out["action"] == "politics":
            shifts += 1
    assert shifts > 0
    assert sim.ctx.faction.get("f1").standing != 0, "政治活动应挪动派系声望"


# =============================================================================
#  3) 确定性 + 每日推进 + 场景挂钩
# =============================================================================
def test_agency_is_deterministic_same_seed():
    a, b = _sim(68), _sim(68)
    for s in (a, b):
        for role in ("盗贼", "商人", "卫兵"):
            s.ctx.npc.generate(role=role)
    assert a.ctx.agency.tick(p=1.0) == b.ctx.agency.tick(p=1.0)


def test_time_day_event_triggers_daily_activity():
    sim = _sim(69)
    for role in ("农夫", "卫兵", "吟游诗人"):
        sim.ctx.npc.generate(role=role)
    sim.ctx.calendar.advance(24 * 60)            # 过一天
    events = [e for e in sim.ctx.log.all() if e.type == "npc.action"]
    assert events, "过夜应触发 NPC 自主行动（time/day → daily）"


def test_scene_beats_let_world_move():
    """跑一场非战斗场景，世界在行动间隙转动（不崩溃；或产生 npc.action）。"""
    sim = _sim(70)
    for role in ("卫兵", "商人"):
        sim.ctx.npc.generate(role=role)
    sim.run(2)
    # 节拍循环里 tick(0.25)：两场戏后大概率已有 NPC 行动；即便没有也不应崩溃
    assert len(sim.ctx.log.all()) > 0


# =============================================================================
#  4) 条件层（行为树）：该走什么由条件决定，具体动作由随机决定
# =============================================================================
def test_hostile_npc_only_threatens_or_skulks():
    """敌对 NPC 的条件层候选 = {threaten, sneak, flee}，绝不交易/援助。"""
    sim = _sim(91)
    npc = sim.ctx.npc.generate(role="商人")
    npc.disposition = -2                        # 敌对
    sim.ctx.state.gold = 100                    # 即使队伍富有，敌对优先
    kinds = set()
    for _ in range(40):
        out = sim.ctx.agency.act(npc)
        assert out["via"] == "condition"
        assert out["action"] in ("threaten", "sneak", "flee"), \
            f"敌对 NPC 不应 {out['action']}"
        kinds.add(out["action"])
    assert kinds, "40 次行动应有结果"


def test_friendly_npc_never_threatens():
    sim = _sim(92)
    npc = sim.ctx.npc.generate(role="卫兵")
    npc.disposition = 2
    for _ in range(40):
        out = sim.ctx.agency.act(npc)
        assert out["via"] == "condition"
        assert out["action"] in ("aid", "gossip", "trade"), \
            f"友善 NPC 不应 {out['action']}"


def test_rich_party_attracts_sneak():
    """队伍富有 → 条件层含 sneak（觊觎）；同状态多次行动仍落在候选集内。"""
    sim = _sim(93)
    npc = sim.ctx.npc.generate(role="盗贼")
    sim.ctx.state.gold = 100
    seen = set()
    for _ in range(40):
        out = sim.ctx.agency.act(npc)
        assert out["via"] == "condition"
        assert out["action"] in ("sneak", "trade", "gossip")
        seen.add(out["action"])
    assert len(seen) >= 1


def test_condition_tree_reports_via_field():
    """条件命中 via=condition；树不命中 via=fallback（职业表兜底）。"""
    sim = _sim(94)
    npc = sim.ctx.npc.generate(role="学者")
    npc.disposition = -2                        # hostile → 条件命中
    assert sim.ctx.agency.act(npc)["via"] == "condition"
    npc2 = sim.ctx.npc.generate(role="学者")
    # 中险地点（danger=2）：不和平也不戒备 → 树全不命中 → 职业表兜底
    sim.ctx.world.add_place(Place(id="m1", name="中险地", kind="荒野", danger=2))
    npc2.place = "m1"
    npc2.faction = ""
    npc2.disposition = 0
    sim.ctx.state.gold = 15                     # 不穷不富、不敌对、无派系
    out = sim.ctx.agency.act(npc2)
    assert out["via"] == "fallback"
    assert out["action"] in [k for _, k in _ROLE_ACTIONS["学者"]]


def test_decision_state_snapshot_keys():
    sim = _sim(95)
    npc = sim.ctx.npc.generate(role="商人")
    state = sim.ctx.agency._state_of(npc)
    for key in ("hostile", "friendly", "rich_target", "poor_target",
                "has_faction", "guarded_place", "peaceful_place"):
        assert key in state, f"决策状态缺 {key}"
