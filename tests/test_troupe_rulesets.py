"""troupe 规则适配器扩展测试：验证新增 CoC d100 规则集即插即用。

核心断言：同一张融合角色卡切到 CoC 规则集即可跑（actor/ruleset 调用签名不变），
世界层 / 遭遇 / 智能体代码**一行未动**——这正是架构的可扩展性卖点。
"""
from __future__ import annotations

import os
import tempfile

from troupe import Simulator, CheckRequest, get_ruleset, render_campaign
from troupe.modules import get_module
from troupe.ruleset import available_rulesets


def test_coc_registered_and_extensible():
    assert "coc" in available_rulesets()
    # 三套规则集共存，互不影响
    assert {"dnd5e", "gurps", "coc"} <= set(available_rulesets())


def test_coc_check_semantics_d100():
    coc = get_ruleset("coc")
    # 掷低型：无 DC，难度用情境修正表达
    assert coc.dc_for("普通") == 0
    assert coc.modifier_for("困难") == -20
    assert coc.modifier_for("容易") == 20

    sim = Simulator.quick(seed=5, ruleset="coc",
                          module=get_module("border_shrine"), level=3, count=3)
    res = coc.check(sim.party[0], CheckRequest(actor="p1", kind="skill",
                                               key="侦查", tier="普通", label="侦查"))
    assert 1 <= res.roll <= 100
    assert isinstance(res.success, bool)
    assert res.target <= 99


def test_coc_swap_needs_no_world_change():
    """D&D 与 CoC 用同一张卡跑同一模组，世界层 API 完全一致（只换 ruleset id）。"""
    dnd = Simulator.quick(seed=7, ruleset="dnd5e",
                          module=get_module("border_shrine"), level=3, count=3)
    coc = Simulator.quick(seed=7, ruleset="coc",
                          module=get_module("border_shrine"), level=3, count=3)
    # 队伍规模、初始世界、可用操作一致
    assert len(dnd.party) == len(coc.party)
    assert dnd.ctx.world.current == coc.ctx.world.current
    # 切规则不影响角色卡本身
    assert dnd.party[0].state.cls == coc.party[0].state.cls


def test_coc_run_and_save_roundtrip():
    sim = Simulator.quick(seed=5, ruleset="coc",
                          module=get_module("border_shrine"), level=3, count=3)
    state = sim.run(max_scenes=6, verbose=False)
    assert state.finished is True
    assert isinstance(render_campaign(sim), str)

    xp_before = sim.ctx.state.total_xp
    with tempfile.TemporaryDirectory() as td:
        path = os.path.join(td, "coc.json")
        sim.save(path)
        loaded = Simulator.load(path)
    assert loaded.ctx.state.seed == 5
    assert loaded.ctx.state.ruleset == "coc"
    assert loaded.ctx.state.total_xp == xp_before
    assert len(loaded.party) == len(sim.party)


def test_coc_determinism_same_seed():
    def run_once():
        s = Simulator.quick(seed=321, ruleset="coc",
                            module=get_module("border_shrine"), level=3, count=3)
        s.run(max_scenes=6, verbose=False)
        return (s.ctx.state.total_xp, s.ctx.state.chaos,
                s.ctx.state.scene_counter,
                [(e.type, e.text) for e in s.ctx.log.all()])

    assert run_once() == run_once()
