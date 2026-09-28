"""troupe 落地管线测试：智能体「只提议」→ 导演 ``apply_consequence``「唯一写世界」。

这些测试证明架构的核心边界成立——agent 产出的 Action 经过导演裁定落地后，
确实改变了世界状态（发现地点 / 移动 / 休整恢复 / 派系-NPC 态度 / 时钟 / 触发战斗）。
直接构造 ``Consequence`` 并调用 ``apply_consequence``，绕开随机检定，保证确定性。
"""
from __future__ import annotations

import pytest

from troupe import Simulator, Action, Consequence, SceneSpec
from troupe.contracts import SCENE_ALTERED, SCENE_INTERRUPTED, SCENE_NORMAL
from troupe.modules import get_module


def _sim():
    return Simulator.quick(seed=7, ruleset="dnd5e",
                           module=get_module("border_shrine"), level=3, count=3)


def _start(sim, kind):
    sim.ctx.director.start_scene(SceneSpec(kind=kind, title="测试", goal="g"))
    return list(sim.ctx.director.roster())[0]


# --------------------------------------------------------------------------- #
#  探索成功 → 发现地点 + XP + 线索
# --------------------------------------------------------------------------- #
def test_exploration_success_discovers_and_rewards():
    sim = _sim()
    actor = _start(sim, "exploration")
    act = sim.ctx.agent.propose(sim.ctx.director.current, actor, kind="exploration")
    assert isinstance(act, Action)

    xp_before = sim.ctx.state.total_xp
    threads_before = len(sim.ctx.oracle.threads)
    receipt = sim.ctx.director.apply_consequence(
        Consequence(ok=True, narrative="探索成功", effects=act.payload["on_success"]))

    # 发现了一个新地点（propose 已用 add_discovered_place 建好）
    assert receipt["applied"].get("discovery")
    pid = receipt["applied"]["discovery"][0]
    assert sim.ctx.world.places[pid].discovered is True
    # 奖励 XP
    assert sim.ctx.state.total_xp == xp_before + act.payload["on_success"]["xp"]
    # 新增剧情线索
    assert len(sim.ctx.oracle.threads) == threads_before + len(
        act.payload["on_success"].get("thread_add", []))


# --------------------------------------------------------------------------- #
#  旅行成功 → 队伍移动到目的地
# --------------------------------------------------------------------------- #
def test_travel_moves_party():
    sim = _sim()
    actor = _start(sim, "travel")
    act = sim.ctx.agent.propose(sim.ctx.director.current, actor, kind="travel")
    dest = act.payload["on_success"]["move_to"]
    assert dest != sim.ctx.world.current
    sim.ctx.director.apply_consequence(
        Consequence(ok=True, narrative="抵达", effects=act.payload["on_success"]))
    assert sim.ctx.world.current == dest


# --------------------------------------------------------------------------- #
#  休整 → 全队恢复 HP（先扣血再休整）
# --------------------------------------------------------------------------- #
def test_downtime_restores_hp():
    sim = _sim()
    actor = _start(sim, "downtime")
    char = sim.party[0]
    _, mx = sim.ctx.ruleset.hp_of(char)
    sim.ctx.ruleset.damage(char, 8)
    low, _ = sim.ctx.ruleset.hp_of(char)
    assert low == mx - 8
    act = sim.ctx.agent.propose(sim.ctx.director.current, actor, kind="downtime")
    sim.ctx.director.apply_consequence(
        Consequence(ok=True, narrative="休整", effects=act.payload["effects"]))
    after, _ = sim.ctx.ruleset.hp_of(char)
    assert after > low  # 确实恢复了


# --------------------------------------------------------------------------- #
#  交涉 → NPC 态度变化（直接用已存在的模组 NPC）
# --------------------------------------------------------------------------- #
def test_social_adjusts_npc_disposition():
    sim = _sim()
    npc_id = get_module("border_shrine").npcs[0].id
    before = sim.ctx.npc.get(npc_id).disposition
    sim.ctx.director.apply_consequence(
        Consequence(ok=True, narrative="套话", effects={"npc": {npc_id: {"disposition": 1}}}))
    assert sim.ctx.npc.get(npc_id).disposition == before + 1


# --------------------------------------------------------------------------- #
#  失败探索（激进策略）→ 真正触发战斗
# --------------------------------------------------------------------------- #
def test_aggressive_fail_triggers_combat():
    sim = _sim()
    _start(sim, "exploration")
    # 构造一个「激进探索失败」的后果：带 combat 规格
    combat_spec = {
        "enemies": ["强盗"],
        "distance": 30,
    }
    receipt = sim.ctx.director.apply_consequence(
        Consequence(ok=True, narrative="遭遇伏兵", effects={"combat": combat_spec}))
    res = receipt["applied"].get("combat", {})
    assert res.get("winner") in {"party", "foes", "none"}
    # 战斗确实发生了：日志里有 combat.end
    assert any(e.type == "combat.end" for e in sim.ctx.log.all())


# --------------------------------------------------------------------------- #
#  失败探索 → 推进危险时钟
# --------------------------------------------------------------------------- #
def test_failed_exploration_advances_danger_clock():
    sim = _sim()
    _start(sim, "exploration")
    # 模组自带 cl_danger（追猎者逼近，danger 类）。失败时 +1 段。
    cid = "cl_danger"
    before = sim.ctx.clock.get(cid)
    assert before is not None
    seg_before = before.filled
    sim.ctx.director.apply_consequence(
        Consequence(ok=True, narrative="警觉", effects={"clock": {"danger": 1}}))
    assert sim.ctx.clock.get(cid).filled == seg_before + 1


# --------------------------------------------------------------------------- #
#  边界：未知 actor 的伤害被安全跳过（skipped 而非崩溃）
# --------------------------------------------------------------------------- #
def test_unknown_actor_damage_is_skipped():
    sim = _sim()
    receipt = sim.ctx.director.apply_consequence(
        Consequence(ok=True, narrative="x", effects={"damage": {"幽灵": 10}}))
    assert "damage:幽灵" in receipt["skipped"]
