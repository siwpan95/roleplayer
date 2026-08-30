"""troupe.replay - 战役重演（L6）

兑现 ``troupe/log.py`` 里「见 ``troupe.replay``」的引用 —— 在此之前该模块
**根本不存在**，那句注释是悬空的。

两条互补的重演路径
------------------
1. **档案回放**：读存档的事件流 + 动作序列，按时间轴浏览、按类型/标签过滤、
   导出战报。回答「这局到底发生了什么」。
2. **确定性自检**：同一种子重建两个 Simulator 跑同样步数，事件流应**逐条一致**。
   回答「这局能不能精确复现」——这是上面那条路径可信的前提。

为什么动作序列要单独存
----------------------
事件流记「世界变成了什么样」，动作序列记「当时谁提议了什么」。只有事件流的话，
回放能看到结果，却看不到玩家/AI 的意图；两者合起来才是完整的重演。
"""
from __future__ import annotations

from typing import Any, Iterable, Optional


class Replay:
    """一份战役档案的可重演视图。"""

    def __init__(self, events: Optional[Iterable[Any]] = None,
                 actions: Optional[list] = None,
                 meta: Optional[dict] = None) -> None:
        self.events = list(events or [])
        self.actions = list(actions or [])
        self.meta = dict(meta or {})

    # ------------------------------------------------------------------ #
    #  构造
    # ------------------------------------------------------------------ #
    @classmethod
    def from_simulator(cls, sim: Any) -> "Replay":
        """从运行中的 ``Simulator`` 取当前事件流与动作序列。"""
        log = sim.ctx.log if sim.ctx.has("log") else None
        if log is None:
            return cls(meta={"source": "simulator(no-log)"})
        return cls(events=log.all(), actions=log.actions_to_dict(),
                   meta={"source": "simulator",
                         "seed": getattr(sim.ctx.state, "seed", None),
                         "ruleset": getattr(sim.ctx.state, "ruleset", None)})

    @classmethod
    def from_save(cls, path: str) -> "Replay":
        """从存档文件读取（顺带跑一遍迁移链，旧存档也能读）。"""
        import json

        from .contracts import Event
        from .save import migrate

        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        data = migrate(data)
        events = [Event.from_dict(r) for r in (data.get("log") or [])]
        return cls(events=events, actions=list(data.get("actions") or []),
                   meta={"source": path, "schema": data.get("schema"),
                         "module_id": data.get("module_id"),
                         "migrated_from": data.get("migrated_from") or []})

    # ------------------------------------------------------------------ #
    #  浏览
    # ------------------------------------------------------------------ #
    def __len__(self) -> int:
        return len(self.events)

    def __iter__(self):
        return iter(self.events)

    def timeline(self) -> list[str]:
        """按 seq 排序的战报行（含时间/类型/文本）。"""
        out = []
        for e in self.events:
            if not getattr(e, "text", ""):
                continue
            out.append(f"#{e.seq} [{e.ts}] {e.type}: {e.text}")
        return out

    def narrative(self) -> list[str]:
        """纯叙述文本（不含时间/类型前缀），适合直接当战报读。"""
        return [e.text for e in self.events if getattr(e, "text", "")]

    def filter(self, type: str = "", tag: str = "") -> list[Any]:
        out = self.events
        if type:
            out = [e for e in out if e.type == type]
        if tag:
            out = [e for e in out if tag in (e.tags or [])]
        return out

    def summary(self) -> dict:
        """各类型事件计数 + 动作数（一眼看出这局的重心在哪）。"""
        counts: dict[str, int] = {}
        for e in self.events:
            counts[e.type] = counts.get(e.type, 0) + 1
        return {"events": len(self.events), "actions": len(self.actions),
                "by_type": dict(sorted(counts.items(), key=lambda kv: -kv[1])),
                "meta": dict(self.meta)}

    def actions_of(self, actor: str = "") -> list[dict]:
        """动作序列（可按提出者过滤）——「当时谁想做什么」。"""
        if not actor:
            return list(self.actions)
        return [a for a in self.actions if a.get("actor") == actor]


def verify_determinism(seed: int = 7, ruleset: str = "dnd5e", steps: int = 3,
                       level: int = 3, count: int = 2) -> dict:
    """确定性自检：同种子跑两遍，事件流应**逐条一致**。

    :return: ``{"identical", "steps", "a_events", "b_events", "first_diff"}``
             ``first_diff`` 为首个不一致事件的 seq（一致时为 ``None``）。
    """
    from .simulator import Simulator

    def _run() -> list[dict]:
        sim = Simulator.quick(seed=seed, ruleset=ruleset, level=level, count=count)
        sim.run(steps)
        return [e.to_dict() for e in sim.ctx.log.all()]

    a, b = _run(), _run()
    first_diff = None
    for i, (ea, eb) in enumerate(zip(a, b)):
        if ea != eb:
            first_diff = ea.get("seq", i)
            break
    return {"identical": a == b, "steps": steps,
            "a_events": len(a), "b_events": len(b),
            "first_diff": first_diff}


def save_replay(sim: Any, path: str) -> str:
    """把当前战役的**战报**导出成纯文本（便于 diff / 归档 / 分享）。"""
    rp = Replay.from_simulator(sim)
    lines = rp.timeline()
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(lines))
        f.write("\n")
    return path


__all__ = ["Replay", "verify_determinism", "save_replay"]
