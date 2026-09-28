"""troupe 三层决策抽取（roll_smart）测试。

锁定「条件 → 随机 → 降级」三层模型：
1. **条件层**：``condition`` 过滤候选集——不该出现的项绝不会被抽中；
2. **随机层**：``seen`` 硬排除 + ``cooldown`` 软衰减（权重 ×0.2），同条件集下仍有变数；
3. **降级层**：条件筛空时逐级放宽，**永不为空、永不抛异常**。
"""
from troupe.simulator import Simulator


def _sim(seed: int = 81):
    return Simulator.quick(seed=seed, ruleset="dnd5e", level=3, count=2)


# =============================================================================
#  条件层
# =============================================================================
def test_condition_filters_candidates():
    sim = _sim(81)
    tbl = [(1, "弱"), (1, "强"), (1, "传说")]
    for _ in range(30):
        got = sim.ctx.tables.roll_smart(tbl, key="cond1",
                                        condition=lambda v: v == "弱")
        assert got == "弱", "条件层未过滤掉不符合条件的项"


def test_condition_with_stateful_context():
    """条件可以引用外部状态（队伍等级/金币），实现「按状态过滤」。"""
    sim = _sim(82)
    sim.ctx.state.gold = 100
    tbl = [(1, "乞丐的乞讨"), (1, "商人的推销"), (1, "盗贼的觊觎")]
    # 有钱人才会被盯上：金币 < 50 时「盗贼的觊觎」不该出现
    sim.ctx.state.gold = 10
    for _ in range(30):
        got = sim.ctx.tables.roll_smart(
            tbl, key="cond2",
            condition=lambda v: v != "盗贼的觊觎" or sim.ctx.state.gold >= 50)
        assert got != "盗贼的觊觎"


# =============================================================================
#  随机层：seen 硬排除 / cooldown 软衰减
# =============================================================================
def test_seen_items_are_excluded():
    sim = _sim(83)
    tbl = [(1, "A"), (1, "B")]
    for _ in range(20):
        assert sim.ctx.tables.roll_smart(tbl, key="seen1", seen={"A"}) == "B"


def test_cooldown_changes_draw_sequence():
    """cooldown 让最近抽中的项权重衰减 → 抽取序列与无冷却时不同。"""
    a, b = _sim(84), _sim(84)
    tbl = [(1, i) for i in range(5)]
    seq_a = [a.ctx.tables.roll_smart(tbl, key="k") for _ in range(12)]
    seq_b = [b.ctx.tables.roll_smart(tbl, key="k", cooldown=2) for _ in range(12)]
    assert seq_a != seq_b, "cooldown 应改变决策（权重衰减参与了抽取）"


def test_roll_smart_is_deterministic_same_seed():
    a, b = _sim(85), _sim(85)
    tbl = [(1, i) for i in range(6)]
    seq_a = [a.ctx.tables.roll_smart(tbl, key="d", cooldown=2) for _ in range(15)]
    seq_b = [b.ctx.tables.roll_smart(tbl, key="d", cooldown=2) for _ in range(15)]
    assert seq_a == seq_b


# =============================================================================
#  降级层：永不为空
# =============================================================================
def test_fallback_when_condition_rejects_everything():
    sim = _sim(86)
    tbl = [(1, "甲"), (1, "乙")]
    for _ in range(20):
        got = sim.ctx.tables.roll_smart(tbl, key="fb1", condition=lambda v: False)
        assert got in ("甲", "乙"), "条件全拒时应降级到全表兜底"


def test_fallback_when_seen_covers_everything():
    sim = _sim(87)
    tbl = [(1, "甲"), (1, "乙")]
    got = sim.ctx.tables.roll_smart(tbl, key="fb2", seen={"甲", "乙"})
    assert got in ("甲", "乙"), "seen 覆盖全表时应降级（否则返回 None）"


def test_empty_table_returns_none():
    sim = _sim(88)
    assert sim.ctx.tables.roll_smart([], key="empty") is None
