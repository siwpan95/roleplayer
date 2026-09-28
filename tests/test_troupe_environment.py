"""troupe 环境标签 + 叙事锚点查表测试（P2 渲染层升级）。"""
from troupe.simulator import Simulator
from troupe.contracts import Action, CheckRequest
from troupe.data_narrative import NARRATIVE_ANCHORS, anchor_key


def _sim(seed: int = 101):
    return Simulator.quick(seed=seed, ruleset="dnd5e", level=3, count=2)


def _actor_name(sim) -> str:
    return next(iter(sim.ctx.director.roster().keys()))


def _search_action(actor: str) -> Action:
    return Action(
        actor=actor, verb="搜索", kind="exploration",
        request=CheckRequest(actor=actor, kind="skill", key="察觉",
                             tier="普通", label="搜索环境"),
        payload={"on_success": {"xp": 10}, "on_fail": {"clock": {"danger": 1}}},
    )


# =============================================================================
#  环境标签：天气修正进检定
# =============================================================================
def test_weather_applies_environment_modifier():
    """暴雨（nav_mod -5）下同一检定的净余量应比晴朗低 5。

    dnd5e 掷高语义：target=DC 不变，修正落在 roll/total 上，故比较 margin。
    """
    a, b = _sim(101), _sim(101)
    a.ctx.world.weather = "晴朗"          # nav_mod 0
    b.ctx.world.weather = "暴雨"          # nav_mod -5
    actor = _actor_name(a)
    a.ctx.director.adjudicate(_search_action(actor))
    b.ctx.director.adjudicate(_search_action(actor))
    ca = [e for e in a.ctx.log.all() if e.type == "check"][-1].payload
    cb = [e for e in b.ctx.log.all() if e.type == "check"][-1].payload
    ma = ca["total"] - ca["target"]
    mb = cb["total"] - cb["target"]
    assert ma - mb == 5, f"环境修正未生效：晴朗 margin={ma}，暴雨 margin={mb}"


def test_calm_weather_is_neutral():
    """晴朗（默认）nav_mod=0：不改变检定（既有政策/管线测试全部以此为前提）。"""
    sim = _sim(103)
    assert int(sim.ctx.world.weather_mod().get("nav_mod", 0) or 0) == 0


# =============================================================================
#  叙事锚点查表
# =============================================================================
def test_anchor_key_mapping():
    class R:
        success = True
        critical = ""

    r = R()
    assert anchor_key(r) == "success"
    r.success = False
    assert anchor_key(r) == "fail"
    r.critical = "crit"
    assert anchor_key(r) == "crit"
    r.critical = "crit_fail"
    assert anchor_key(r) == "crit_fail"


def test_default_narrative_draws_from_anchor_pool():
    sim = _sim(104)
    act = Action(actor="X", verb="搜索", kind="exploration", request=None)

    class R:
        success = True
        critical = ""

        def degree(self):
            return "普通"

    allowed = {tpl.format(actor="X", verb="搜索")
               for tpl in NARRATIVE_ANCHORS["success"]}
    seen = set()
    for _ in range(30):
        text = sim.ctx.director._default_narrative(act, R())
        assert text in allowed, f"叙事不在锚点池内：{text}"
        seen.add(text)
    assert len(seen) > 1, "30 次应抽到多种模板（变数归随机）"


def test_anchor_table_has_all_four_outcomes():
    for key in ("success", "fail", "crit", "crit_fail"):
        assert NARRATIVE_ANCHORS.get(key), f"锚点池缺 {key}"
        assert all("{actor}" in t and "{verb}" in t for t in NARRATIVE_ANCHORS[key])
