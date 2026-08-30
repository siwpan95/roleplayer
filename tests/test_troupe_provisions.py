"""troupe 补给/旅行结算测试。

规则锚点：D&D 断粮累积力竭（SRD 5.1）；GURPS 饥饿每日损 FP；
旅行里程 = 基础 × 地形 × 节奏（data_world.TERRAIN / TRAVEL_PACE）。
"""
import pytest

from troupe.simulator import Simulator


def _sim(ruleset="dnd5e"):
    sim = Simulator.quick(seed=11, ruleset=ruleset, level=4, count=1)
    return sim


def test_consume_daily_shortage_triggers_starvation():
    sim = _sim("dnd5e")
    sim.ctx.state.provisions["rations"] = 0
    sim.ctx.state.provisions["water"] = 0
    res = sim.ctx.provisions.consume_daily(1)
    assert res["starving"] is True
    assert "dnd_exhaustion" in res["effects"]
    # 力竭等级在会话 flags 累积
    assert sim.ctx.state.flags.get("exhaustion", 0) >= 1


def test_consume_daily_gurps_loses_fp():
    sim = _sim("gurps")
    sim.ctx.state.provisions["rations"] = 0
    res = sim.ctx.provisions.consume_daily(1)
    assert res["starving"] is True
    assert "gurps_hunger" in res["effects"]


def test_travel_consumes_provisions_and_advances_time():
    sim = _sim("dnd5e")
    sim.ctx.state.provisions["rations"] = 10
    before = sim.ctx.calendar.now.total_minutes()
    res = sim.ctx.provisions.travel(64, pace="常", terrain="道路", party_size=1)
    assert res["days"] >= 1
    assert res["hours"] > 0
    # 时间已推进
    assert sim.ctx.calendar.now.total_minutes() > before
    # 口粮已消耗
    assert sim.ctx.state.provisions["rations"] < 10
    # 旅行事件已记录
    assert any(e.type == "travel" for e in sim.ctx.log.tail(50))


def test_coin_weight_drives_encumbrance():
    sim = _sim("gurps")
    sim.ctx.provisions.add_coin(100)  # 约 4 lb
    enc = sim.ctx.provisions.encumbrance_of(sim.party[0])
    assert "level" in enc and "penalty" in enc
    assert enc["total_lbs"] >= 4.0


def test_noncombat_travel_scene_resolves():
    sim = _sim("dnd5e")
    sim.ctx.state.provisions["rations"] = 20
    spec = {"kind": "travel", "title": "行军", "goal": "抵达下一站",
            "distance_km": 30, "pace": "常", "terrain": "道路"}
    ended = sim.ctx.encounter.noncombat(spec)
    assert ended.get("outcome") in ("in_control", "out_of_control")
    assert any(e.type == "travel" for e in sim.ctx.log.tail(50))


# =============================================================================
#  途中遭遇真正落地（此前 encounters 只计数，不开戏）
# =============================================================================
def test_travel_encounter_resolves_to_battle_or_event():
    """单次途中遭遇必须真正开一场戏：战斗（带胜负/XP）或路遇事件（带文本）。"""
    sim = _sim("dnd5e")
    sim.ctx.state.provisions["rations"] = 30
    out = sim.ctx.encounter._travel_encounter("道路")
    assert out["kind"] in ("combat", "event")
    if out["kind"] == "combat":
        assert "winner" in out and "xp" in out and "rounds" in out
    else:
        assert out["text"], "路遇事件必须有叙述文本"


def test_travel_settles_every_encounter_it_rolls():
    """旅行结算的每一次遭遇都被落地：battles + events 总数 == encounters。"""
    sim = _sim("dnd5e")
    sim.ctx.state.provisions["rations"] = 60
    res = sim.ctx.encounter.travel(120, pace="常", terrain="森林")
    assert "battles" in res and "events" in res
    assert len(res["battles"]) + len(res["events"]) == res["encounters"]
    for b in res["battles"]:
        assert b["kind"] == "combat" and "winner" in b
    for e in res["events"]:
        assert e["kind"] == "event" and e["text"]


def test_travel_can_skip_encounter_resolution():
    """``resolve_encounters=False`` 时只做补给/时间结算，不开戏（供外部自行编排）。"""
    sim = _sim("dnd5e")
    sim.ctx.state.provisions["rations"] = 30
    res = sim.ctx.encounter.travel(30, pace="常", terrain="道路",
                                   resolve_encounters=False)
    assert res["battles"] == [] and res["events"] == []
    assert res["encounters"] >= 0
