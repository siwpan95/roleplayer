"""troupe 服务注册表 + 线索去重测试。

* 方向一：troupe 服务正式登记在 troupe 作用域内的注册表（DEFAULT_TROUPE_ENTRIES /
  mount_troupe），不污染 d20 基类的 loader.DEFAULT_SERVICE_ENTRIES；Simulator 经注册表装配后
  行为与重构前一致（仍端到端可跑）。
* 方向三：oracle.add_thread 对相同未关闭线索幂等，整场跑完不出现重复未关闭线索。
"""
from __future__ import annotations

from d20.core import Context

from troupe import Simulator, available_troupe_services, mount_troupe
from troupe.composition import DEFAULT_TROUPE_ENTRIES


# --------------------------------------------------------------------------- #
#  方向一：服务注册表
# --------------------------------------------------------------------------- #
def test_registry_has_no_duplicate_ids_and_covers_core():
    ids = available_troupe_services()
    assert len(ids) == len(DEFAULT_TROUPE_ENTRIES)
    assert len(ids) == len(set(ids))  # 无重复 id（注册表按依赖顺序排列，非字母序）
    for needed in ("rng", "ruleset", "world", "director", "encounter", "agent",
                   "calendar", "log", "tables", "oracle", "npc", "faction",
                   "quest", "clock", "lore"):
        assert needed in ids


def test_mount_troupe_registers_every_service_on_context():
    ctx = Context()
    mount_troupe(ctx, seed=7, ruleset="dnd5e")
    for sid in available_troupe_services():
        assert ctx.has(sid), f"注册表声明但未挂载：{sid}"


def test_simulator_runs_after_registry_refactor():
    # 重构后换规则集仍可跑（gurps 走掷低语义），证明装配等价
    sim = Simulator.quick(seed=7, ruleset="gurps", level=3, count=2)
    sim.run(max_scenes=4, verbose=False)
    assert sim.ctx.state.scene_counter >= 1
    # 注册表声明的服务在真实 Simulator 上也都在
    for sid in available_troupe_services():
        assert sim.ctx.has(sid), f"Simulator 缺失服务：{sid}"


# --------------------------------------------------------------------------- #
#  方向三：线索去重
# --------------------------------------------------------------------------- #
def test_oracle_add_thread_is_idempotent_on_open_text():
    sim = Simulator.quick(seed=3, ruleset="dnd5e", level=2, count=2)
    o = sim.ctx.oracle
    before = len(o.threads)
    t1 = o.add_thread("崔微提供的情报")
    t2 = o.add_thread("崔微提供的情报")  # 相同未关闭文本 → 复用、不新增
    assert t1.id == t2.id
    assert len(o.threads) == before + 1


def test_oracle_add_thread_allows_distinct_texts():
    sim = Simulator.quick(seed=3, ruleset="dnd5e", level=2, count=2)
    o = sim.ctx.oracle
    before = len(o.threads)
    o.add_thread("线索甲")
    o.add_thread("线索乙")
    assert len(o.threads) == before + 2


def test_run_does_not_accumulate_duplicate_open_threads():
    # 多轮社交/探索后，未关闭线索里不应有重复文本（收敛「崔微提供的情报」重复写入）
    sim = Simulator.quick(seed=9, ruleset="dnd5e", level=3, count=3)
    sim.run(max_scenes=12, verbose=False)
    open_texts = [t.text for t in sim.ctx.oracle.threads if t.status == "open"]
    assert len(open_texts) == len(set(open_texts)), "存在重复未关闭线索"
