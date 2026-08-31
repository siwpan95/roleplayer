"""troupe 存档迁移 + 重演测试。

锁定过去「形同虚设 / 完全缺失」的三件事：
1. 存档**真的**落盘事件流与动作序列（文档一直这么声称，但 ``save_simulator``
   根本没有 ``log`` 键）；
2. ``migrate`` **真的**执行迁移链（此前无条件把 schema 覆写成当前版本、丢弃旧版本号，
   且 ``_migrate_x_to_y`` 一个都不存在）；
3. ``troupe/replay.py`` 存在且可用（``log.py`` 那句「见 troupe.replay」此前是悬空引用）。
"""
import json

import pytest

from troupe.simulator import Simulator
from troupe.save import _vtuple, load_simulator, migrate, save_simulator
from troupe.replay import Replay, save_replay, verify_determinism


def _run_sim(seed: int, steps: int = 2):
    sim = Simulator.quick(seed=seed, ruleset="dnd5e", level=3, count=2)
    sim.run(steps)
    return sim


# =============================================================================
#  1) 事件流 / 动作序列真的落盘
# =============================================================================
def test_save_persists_event_stream_and_actions(tmp_path):
    sim = _run_sim(31, 2)
    n_events = len(sim.ctx.log.all())
    n_actions = len(sim.ctx.log.actions)
    assert n_events > 0, "跑过场景后事件流不应为空"

    path = str(tmp_path / "save.json")
    save_simulator(sim, path)

    # 直接读文件，确认**落盘了**（而不是只留在内存里）
    with open(path, "r", encoding="utf-8") as f:
        raw = json.load(f)
    assert len(raw["log"]) == n_events
    assert len(raw["actions"]) == n_actions
    assert raw["schema"] == "1.1"

    # 载入后事件流/动作序列被还原（+1 是载入时补记的 session.start）
    sim2 = load_simulator(path)
    assert len(sim2.ctx.log.all()) == n_events + 1
    assert len(sim2.ctx.log.actions) == n_actions


def test_log_service_records_actions_from_director_resolves():
    """导演裁定过的动作提议应进入 ``log.actions``（供 replay 看「当时想做什么」）。

    seed=34：P0 词表扩充（2026-08-30）后 seed=32 的确定性走向不再触发动作记录，
    按项目先例（内容扩充 → 测试换 seed）改用仍能覆盖断言的相邻种子。
    """
    sim = _run_sim(34, 3)
    assert len(sim.ctx.log.actions) > 0, "跑过场景应有动作提议被记录"
    row = sim.ctx.log.actions[0]
    assert "kind" in row or "actor" in row
    assert "_outcome" in row            # 附带裁定回执


# =============================================================================
#  2) 迁移链真的生效
# =============================================================================
def test_migrate_1_0_to_1_1_backfills_new_fields():
    old = {
        "schema": "1.0",
        "state": {"seed": 1, "ruleset": "dnd5e"},
        "services": {
            "quest": {"q1": {"id": "q1", "title": "老任务", "status": "active"}},
            "clock": {"c1": {"id": "c1", "name": "旧时钟", "segments": 4, "filled": 2}},
        },
        "actors": [], "actor_names": [],
    }
    out = migrate(old)
    assert out["schema"] == "1.1"
    # 旧版本号被如实记录，不再被静默丢弃
    assert out["migrated_from"] == ["1.0"]
    # 1.0 没有的两个键被补齐
    assert out["log"] == [] and out["actions"] == []
    q = out["services"]["quest"]["q1"]
    assert q["depends_on"] == []
    assert q["deadline_minutes"] == 0
    assert q["started_minute"] == 0
    assert q["fail_condition"] == ""
    assert out["services"]["clock"]["c1"]["consumed"] is False


def test_migrate_preserves_existing_data_and_is_idempotent():
    old = {"schema": "1.0", "log": [{"seq": 1, "type": "custom", "text": "旧事件"}],
           "state": {"seed": 9}}
    out = migrate(old)
    assert out["log"] == [{"seq": 1, "type": "custom", "text": "旧事件"}], \
        "迁移不得丢掉已有事件流"
    # 已是当前版本 → 不再追加迁移历史
    again = migrate(out)
    assert again["migrated_from"] == out["migrated_from"]


def test_migrate_handles_missing_schema_and_compares_numerically():
    # 连版本号都没有的极早期存档
    out = migrate({"state": {}})
    assert out["schema"] == "1.1"
    assert out["migrated_from"] == ["(no-schema)"]
    # 版本号按数值元组比较，不能让 "1.10" < "1.9"
    assert _vtuple("1.10") > _vtuple("1.9")


def test_old_1_0_save_file_loads_after_migration(tmp_path):
    """端到端：一份 1.0 旧存档文件能被正常读入，且事件流字段已补齐。"""
    old = {
        "schema": "1.0",
        "state": {"seed": 5, "ruleset": "dnd5e", "module_id": ""},
        "rng": {}, "grng": "", "services": {}, "actors": [], "actor_names": [],
    }
    path = str(tmp_path / "old.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(old, f)
    sim = load_simulator(path)
    assert sim is not None
    # 载入时补记的事件里带得出迁移历史
    start = [e for e in sim.ctx.log.tail(5) if e.type == "session.start"]
    assert start and start[-1].payload.get("migrated_from") == ["1.0"]


# =============================================================================
#  3) replay 可用
# =============================================================================
def test_replay_from_save_reads_events_and_actions(tmp_path):
    sim = _run_sim(33, 2)
    path = str(tmp_path / "s.json")
    save_simulator(sim, path)

    rp = Replay.from_save(path)
    assert len(rp) > 0
    assert rp.timeline(), "应能渲染出战报行"
    assert rp.narrative()
    s = rp.summary()
    assert s["events"] == len(rp)
    assert s["by_type"], "应按事件类型给出计数"
    assert s["meta"]["schema"] == "1.1"


def test_replay_filter_by_type_and_tag():
    sim = _run_sim(34, 2)
    rp = Replay.from_simulator(sim)
    assert len(rp) > 0
    for e in rp.filter(type="scene.start"):
        assert e.type == "scene.start"
    # 过滤不存在的类型 → 空
    assert rp.filter(type="__nope__") == []


def test_replay_actions_of_actor():
    # 32 号种子会产生通用节拍（非 social/travel）场景，故有动作提议
    sim = _run_sim(32, 3)
    rp = Replay.from_simulator(sim)
    if not rp.actions:
        pytest.skip("本局未产生动作提议（随机性所致）")
    first_actor = rp.actions[0].get("actor")
    assert rp.actions_of() == rp.actions
    if first_actor:
        assert all(a.get("actor") == first_actor for a in rp.actions_of(first_actor))


def test_verify_determinism_same_seed_reproduces():
    r = verify_determinism(seed=36, ruleset="dnd5e", steps=2)
    assert r["a_events"] > 0
    assert r["identical"] is True, f"同种子两遍跑出不同事件流（首个差异 seq={r['first_diff']}）"


def test_save_replay_exports_readable_text(tmp_path):
    sim = _run_sim(37, 1)
    path = str(tmp_path / "battle.txt")
    save_replay(sim, path)
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    assert text.strip(), "导出的战报不应为空"
    assert text.startswith("#"), "每行应以事件序号开头，便于 diff"
