"""P3 手写战役模组测试（2026-08-31）。

覆盖：注册可见性 / 结构引用完整性 / 可加载可跑 / 同种子确定性。
"""
from troupe.modules import available_modules, get_module
from troupe.simulator import Simulator

_NEW_IDS = ("mirror_inn", "salt_road", "bone_mill")


def test_p3_new_modules_registered():
    avail = available_modules()
    for mid in _NEW_IDS:
        assert mid in avail, f"{mid} 未注册（现有：{avail}）"
    assert "border_shrine" in avail      # 老模组仍在


def test_p3_module_structure_integrity():
    for mid in _NEW_IDS:
        m = get_module(mid)
        place_ids = {p.id for p in m.places}
        npc_ids = {n.id for n in m.npcs}
        faction_ids = {f.id for f in m.factions}
        # 路线端点合法
        for r in m.routes:
            assert r.a in place_ids and r.b in place_ids, (mid, r.id)
        # 任务 giver 与线索 target 合法（target 可为地点或 NPC）
        for q in m.quests:
            assert q.giver in npc_ids, (mid, q.id, q.giver)
            for c in q.clues:
                assert c.target in place_ids or c.target in npc_ids, (mid, c.target)
        # 派系 rival 合法
        for f in m.factions:
            for rid in (f.rivals or []):
                assert rid in faction_ids, (mid, rid)
        # NPC 所在地合法、所属派系合法
        for n in m.npcs:
            assert n.place in place_ids, (mid, n.id)
            if n.faction:
                assert n.faction in faction_ids, (mid, n.faction)
        # 起始地点合法；时钟至少两个
        assert m.starting_place in place_ids, mid
        assert len(m.clocks) >= 2, mid
        assert m.quests and m.threads, mid


def test_p3_modules_runnable_and_deterministic():
    for mid in _NEW_IDS:
        m = get_module(mid)
        sim = Simulator.quick(seed=7, ruleset="dnd5e", module=m, level=2, count=2)
        res = sim.run(max_scenes=3, verbose=False)
        assert res is not None, mid
        assert sim.ctx.log.all(), mid      # 跑过场景必有事件
        # 同种子两遍事件流一致
        m2 = get_module(mid)
        sim2 = Simulator.quick(seed=7, ruleset="dnd5e", module=m2, level=2, count=2)
        sim2.run(max_scenes=3, verbose=False)
        ev1 = [e.to_dict() for e in sim.ctx.log.all()]
        ev2 = [e.to_dict() for e in sim2.ctx.log.all()]
        assert ev1 == ev2, f"{mid} 同种子事件流不一致"
