"""troupe 可插拔策略（Policy）行为测试。

证明架构承诺：「换策略不改世界层代码」——策略只决定智能体**提议**的
``Action.payload`` 形态（成功/失败分支的世界效果声明），世界落地仍由
导演 ``apply_consequence`` 唯一负责。

对比三档策略：

* ``default`` (Policy)：探索失败仅推进 ``danger`` 时钟 +1。
* ``cautious`` (CautiousPolicy)：探索成功主动把 ``danger`` 时钟 -1（更爱侦查）；
  旅行把检定难度降到「容易」（更难失败）。
* ``aggressive`` (AggressivePolicy)：探索失败直接挂出 ``combat`` 后果（主动接战）。

约定：既有 ``d20`` 测试零回归是硬约束；本文件只测新增的 ``troupe`` 包。
"""
from __future__ import annotations

import pytest

from roleplayer.character import Character

from troupe import Simulator
from troupe.agent import AgentService, Policy, CautiousPolicy, AggressivePolicy
from troupe.contracts import Action


# --------------------------------------------------------------------------- #
#  夹具
# --------------------------------------------------------------------------- #
@pytest.fixture
def sim():
    """最小可跑世界（improvised）：border_town 有 1 个邻居 old_road。"""
    return Simulator.quick(seed=7, ruleset="dnd5e", level=3, count=3)


@pytest.fixture
def actor():
    return "牧师1"


# --------------------------------------------------------------------------- #
#  注册表 / 构造
# --------------------------------------------------------------------------- #
def test_available_policies_registered():
    assert AgentService.available_policies() == ["aggressive", "cautious", "default"]


def test_policy_classes_are_subclasses():
    assert issubclass(CautiousPolicy, Policy)
    assert issubclass(AggressivePolicy, Policy)


# --------------------------------------------------------------------------- #
#  default 策略：只提议，不主动接战、不主动降危险
# --------------------------------------------------------------------------- #
def test_default_exploration_shape(sim, actor):
    sim.ctx.agent.set_policy("default")
    act = sim.ctx.agent.propose(sim.ctx.director.current, actor, "exploration")
    assert isinstance(act, Action)
    # 失败：仅推进 danger 时钟 +1，绝不挂 combat
    assert act.payload["on_fail"] == {"clock": {"danger": 1}}
    assert "combat" not in act.payload.get("on_fail", {})
    # 成功：发现新地点 + 经验 + 线索，但不主动降危险时钟
    succ = act.payload["on_success"]
    assert succ.get("discovery") and succ.get("xp") and succ.get("thread_add")
    assert succ.get("clock", {}).get("danger", 0) == 0


# --------------------------------------------------------------------------- #
#  aggressive 策略：探索失败主动接战（架构卖点）
# --------------------------------------------------------------------------- #
def test_aggressive_exploration_proposes_combat_on_fail(sim, actor):
    sim.ctx.agent.set_policy("aggressive")
    act = sim.ctx.agent.propose(sim.ctx.director.current, actor, "exploration")
    fail = act.payload.get("on_fail", {})
    assert "combat" in fail
    enemies = fail["combat"].get("enemies")
    assert isinstance(enemies, list) and len(enemies) >= 1


def test_aggressive_keeps_default_danger_clock(sim, actor):
    sim.ctx.agent.set_policy("aggressive")
    act = sim.ctx.agent.propose(sim.ctx.director.current, actor, "exploration")
    # 接战是「额外」后果，原有的 danger 时钟推进仍然保留
    assert act.payload["on_fail"].get("clock", {}).get("danger") == 1


# --------------------------------------------------------------------------- #
#  cautious 策略：探索成功降危险、旅行更稳
# --------------------------------------------------------------------------- #
def test_cautious_exploration_lowers_danger_on_success(sim, actor):
    sim.ctx.agent.set_policy("cautious")
    act = sim.ctx.agent.propose(sim.ctx.director.current, actor, "exploration")
    succ = act.payload.get("on_success", {})
    assert succ.get("clock", {}).get("danger") == -1


def test_cautious_travel_is_easier(sim, actor):
    sim.ctx.agent.set_policy("cautious")
    act = sim.ctx.agent.propose(sim.ctx.director.current, actor, "travel")
    assert act.request is not None
    assert act.request.tier == "容易"          # 保守旅行先做侦察，更难失败
    # 同一 API 在不插拔世界层的前提下，travel 成功仍只 move_to，不挂 combat
    assert "combat" not in act.payload.get("on_fail", {})


# --------------------------------------------------------------------------- #
#  运行时切换策略：同一 ctx / 同一世界，提议随策略改变
# --------------------------------------------------------------------------- #
def test_runtime_policy_switch_changes_proposal(sim, actor):
    sim.ctx.agent.set_policy("default")
    base = sim.ctx.agent.propose(sim.ctx.director.current, actor, "exploration")
    assert "combat" not in base.payload.get("on_fail", {})

    sim.ctx.agent.set_policy("aggressive")
    switched = sim.ctx.agent.propose(sim.ctx.director.current, actor, "exploration")
    assert "combat" in switched.payload["on_fail"]


# --------------------------------------------------------------------------- #
#  行为对比：同种子下三档策略产出可区分的提议（不改世界层代码即可换行为）
# --------------------------------------------------------------------------- #
def test_policy_trajectory_is_differentiated():
    agg = Simulator.quick(seed=11, ruleset="dnd5e", level=3, count=3)
    agg.ctx.agent.set_policy("aggressive")
    cau = Simulator.quick(seed=11, ruleset="dnd5e", level=3, count=3)
    cau.ctx.agent.set_policy("cautious")

    agg_acts = [agg.ctx.agent.propose(agg.ctx.director.current, "牧师1", "exploration")
                for _ in range(3)]
    cau_acts = [cau.ctx.agent.propose(cau.ctx.director.current, "牧师1", "exploration")
                for _ in range(3)]

    # aggressive：每次探索失败都挂 combat，且成功不降危险
    assert all("combat" in a.payload["on_fail"] for a in agg_acts)
    assert all(a.payload["on_success"].get("clock", {}).get("danger", 0) == 0
               for a in agg_acts)
    # cautious：每次探索成功都降 danger 时钟 -1，且从不接战
    assert all(a.payload["on_success"]["clock"]["danger"] == -1 for a in cau_acts)
    assert all("combat" not in a.payload.get("on_fail", {}) for a in cau_acts)
