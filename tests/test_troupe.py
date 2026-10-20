"""troupe 跑团模拟器集成与契约测试。

覆盖：规则适配（D&D / GURPS 检定语义）、Oracle（混沌/命运/场景/事件）、
智能体提议、Simulator 端到端 run、存档确定性续跑、同种子可复现、模组注册表、渲染。

约定：既有 ``d20`` 测试零回归是硬约束；本文件只测新增的 ``troupe`` 包。
"""
from __future__ import annotations

import os
import tempfile

import pytest

from roleplayer.character import Character

from troupe import (
    Simulator,
    Action,
    CheckRequest,
    Dnd5eRuleset,
    GurpsRuleset,
    get_ruleset,
    render_campaign,
)
from troupe.modules import get_module, available_modules
from troupe.ruleset import available_rulesets
from troupe.contracts import SCENE_ALTERED, SCENE_INTERRUPTED, SCENE_NORMAL, SceneSpec, SessionState


# --------------------------------------------------------------------------- #
#  L1 规则适配层
# --------------------------------------------------------------------------- #
def test_rulesets_registered():
    regs = available_rulesets()
    assert "dnd5e" in regs
    assert "gurps" in regs


def test_dnd5e_vs_gurps_check_semantics():
    """两套规则判定语义相反：D&D 掷高用 DC，GURPS 掷低用情境修正。"""
    dnd = get_ruleset("dnd5e")
    gur = get_ruleset("gurps")
    # D&D 用 DC（掷高），GURPS 不用 DC 而用情境修正
    assert isinstance(dnd.dc_for("普通"), int) and dnd.dc_for("普通") > 0
    assert dnd.modifier_for("普通") == 0
    assert gur.dc_for("普通") == 0
    assert isinstance(gur.modifier_for("普通"), int)


def test_ruleset_hp_damage_heal_alive():
    sim = Simulator.quick(seed=11, ruleset="dnd5e", level=3, count=1)
    char = sim.party[0]
    cur, mx = sim.ctx.ruleset.hp_of(char)
    assert 0 < cur <= mx
    assert sim.ctx.ruleset.alive(char) is True

    sim.ctx.ruleset.damage(char, 5)
    cur2, _ = sim.ctx.ruleset.hp_of(char)
    assert cur2 == cur - 5

    sim.ctx.ruleset.heal(char, 2)
    cur3, _ = sim.ctx.ruleset.hp_of(char)
    assert cur3 == cur2 + 2

    # 致命伤害后判定死亡
    sim.ctx.ruleset.damage(char, mx + 50)
    assert sim.ctx.ruleset.alive(char) is False


def test_ruleset_rest_recovers():
    sim = Simulator.quick(seed=12, ruleset="dnd5e", level=4, count=1)
    char = sim.party[0]
    sim.ctx.ruleset.damage(char, 8)
    before, _ = sim.ctx.ruleset.hp_of(char)
    sim.ctx.ruleset.rest(char, "long")
    after, _ = sim.ctx.ruleset.hp_of(char)
    assert after > before


def test_ruleset_actor_view_is_rule_agnostic():
    sim = Simulator.quick(seed=13, ruleset="gurps", level=3, count=1)
    view = sim.ctx.ruleset.actor_view(sim.party[0])
    assert {"hp", "max_hp", "defense", "cls", "level"} <= set(view)


# --------------------------------------------------------------------------- #
#  L3 Oracle（GM 模拟器）
# --------------------------------------------------------------------------- #
def test_oracle_chaos_clamped():
    sim = Simulator.quick(seed=21, ruleset="dnd5e", level=3, count=2)
    sim.ctx.oracle.set_chaos(99)
    assert sim.ctx.oracle.chaos == 9
    sim.ctx.oracle.set_chaos(-50)
    assert sim.ctx.oracle.chaos == 1
    sim.ctx.oracle.adjust_chaos(2)
    assert sim.ctx.oracle.chaos <= 9


def test_oracle_fate_structure():
    sim = Simulator.quick(seed=22, ruleset="dnd5e", level=3, count=2)
    out = sim.ctx.oracle.fate("门后有伏兵吗？", odds="很可能")
    assert "text" in out and "success" in out
    assert isinstance(out["success"], bool)
    # 高概率问题在极低混沌下更可能肯定
    sim.ctx.oracle.set_chaos(1)
    yes_low_chaos = sum(
        1 for _ in range(40)
        if sim.ctx.oracle.fate("肯定会发生吗？", odds="很可能")["success"]
    )
    assert yes_low_chaos >= 20  # 期望显著偏向是


def test_oracle_scene_check_result_values():
    sim = Simulator.quick(seed=23, ruleset="dnd5e", level=3, count=2)
    allowed = {SCENE_NORMAL, SCENE_ALTERED, SCENE_INTERRUPTED}
    for _ in range(30):
        r = sim.ctx.oracle.check_scene()
        assert r["result"] in allowed


def test_oracle_random_event_structure():
    sim = Simulator.quick(seed=24, ruleset="dnd5e", level=3, count=2)
    ev = sim.ctx.oracle.random_event("exploration", "搜索神社")
    assert "focus" in ev and "text" in ev


# --------------------------------------------------------------------------- #
#  L5 智能体（只提议，不改世界）
# --------------------------------------------------------------------------- #
def test_agent_proposes_action_with_request():
    sim = Simulator.quick(seed=31, ruleset="dnd5e",
                          module=get_module("border_shrine"), level=3, count=3)
    sim.ctx.director.start_scene(SceneSpec(kind="exploration", title="搜索", goal="查明异象"))
    actor = list(sim.ctx.director.roster())[0]
    act = sim.ctx.agent.propose(sim.ctx.director.current, actor, kind="exploration")
    assert isinstance(act, Action)
    assert isinstance(act.request, CheckRequest)


def test_agent_downtime_has_no_request():
    sim = Simulator.quick(seed=32, ruleset="dnd5e",
                          module=get_module("border_shrine"), level=3, count=3)
    sim.ctx.director.start_scene(SceneSpec(kind="downtime", title="休整", goal="恢复"))
    actor = list(sim.ctx.director.roster())[0]
    act = sim.ctx.agent.propose(sim.ctx.director.current, actor, kind="downtime")
    assert act is not None
    assert act.request is None  # 休整无检定


def test_agent_policies_available():
    sim = Simulator.quick(seed=33, ruleset="dnd5e", level=3, count=2)
    pols = sim.ctx.agent.available_policies()
    assert {"default", "cautious", "aggressive"} <= set(pols)


# --------------------------------------------------------------------------- #
#  L4 / L3 端到端 run（D&D & GURPS）
# --------------------------------------------------------------------------- #
def test_simulator_run_dnd5e_completes():
    sim = Simulator.quick(seed=7, ruleset="dnd5e",
                          module=get_module("border_shrine"), level=3, count=3)
    state = sim.run(max_scenes=8, verbose=False)
    assert state.scene_counter == 8
    assert state.finished is True
    assert isinstance(render_campaign(sim), str)


def test_simulator_run_gurps_completes():
    sim = Simulator.quick(seed=3, ruleset="gurps", level=3, count=2)
    state = sim.run(max_scenes=4, verbose=False)
    assert state.finished is True
    assert state.scene_counter == 4


def test_simulator_party_wipe_ends_run():
    # 极端低等级 + 高危模组，验证全灭即止（不要求必然全灭，只验证机制不崩）
    sim = Simulator.quick(seed=99, ruleset="gurps",
                          module=get_module("border_shrine"), level=1, count=1)
    sim.run(max_scenes=6, verbose=False)
    assert sim.ctx.state.finished is True


# --------------------------------------------------------------------------- #
#  L6 持久化 + 确定性
# --------------------------------------------------------------------------- #
def test_save_load_roundtrip():
    sim = Simulator.quick(seed=7, ruleset="dnd5e",
                          module=get_module("border_shrine"), level=3, count=3)
    sim.run(max_scenes=6, verbose=False)
    xp_before = sim.ctx.state.total_xp
    with tempfile.TemporaryDirectory() as td:
        path = os.path.join(td, "sim.json")
        sim.save(path)
        loaded = Simulator.load(path)
    assert loaded.ctx.state.seed == 7
    assert loaded.ctx.state.total_xp == xp_before
    assert len(loaded.party) == len(sim.party)
    assert loaded.ctx.state.chaos == sim.ctx.state.chaos


def test_determinism_same_seed():
    """同种子必须产出完全相同的战役（含战斗，因为全局 random 已按种子定点播种）。"""
    def run_once():
        s = Simulator.quick(seed=123, ruleset="dnd5e",
                            module=get_module("border_shrine"), level=3, count=3)
        s.run(max_scenes=8, verbose=False)
        events = [(e.type, e.text) for e in s.ctx.log.all()]
        return (s.ctx.state.total_xp, s.ctx.state.chaos,
                s.ctx.state.scene_counter, events)

    a = run_once()
    b = run_once()
    assert a == b, "同种子两次运行结果不一致 —— 确定性被破坏"


def test_sessionstate_dict_roundtrip():
    st = SessionState(seed=5, ruleset="gurps", chaos=3, total_xp=120, gold=40)
    blob = st.to_dict()
    st2 = SessionState.from_dict(blob)
    assert st2.seed == 5 and st2.total_xp == 120 and st2.chaos == 3
    # load 原地还原
    st3 = SessionState()
    st3.load(blob)
    assert st3.gold == 40 and st3.ruleset == "gurps"


# --------------------------------------------------------------------------- #
#  L2 / L10 模组与渲染
# --------------------------------------------------------------------------- #
def test_module_registry():
    assert "border_shrine" in available_modules()
    mod = get_module("border_shrine")
    assert len(mod.places) >= 4
    assert len(mod.quests) >= 1
    assert mod.starting_place


def test_render_contains_party():
    sim = Simulator.quick(seed=7, ruleset="dnd5e",
                          module=get_module("border_shrine"), level=3, count=3)
    sim.run(max_scenes=3, verbose=False)
    text = render_campaign(sim)
    assert "队伍" in text
    assert "混沌" in text


def test_encounter_plan_returns_scene_spec():
    sim = Simulator.quick(seed=41, ruleset="dnd5e",
                          module=get_module("border_shrine"), level=3, count=3)
    spec = sim.plan_next()
    assert isinstance(spec, dict) and "kind" in spec


if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-v"]))
