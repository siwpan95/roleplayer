"""troupe.log - 事件溯源日志（L6）

所有世界状态变更都必须**先记事件再改状态**（或同时）。这样做的好处：

* 战报 / 回放 / 存档 / 撤销 全部由同一条事件流驱动，不需要第二套记录机制；
* 可以只序列化事件流 + 种子，就能精确重放整场战役（见 ``troupe.replay``）；
* 调试时可把事件流 dump 出来 diff，比打断点快。

事件是**追加写**的（append-only），``seq`` 单调递增，不允许修改历史事件。
"""
from __future__ import annotations

from typing import Any, Iterable, Optional

from d20.core import Service

from .contracts import EVENT_TYPES, Event


class LogService(Service):
    """结构化事件流。挂到 ``ctx.log``。"""

    inject = ["calendar"]
    name = "log"

    def __init__(self, ctx, config=None) -> None:  # noqa: D107
        super().__init__(ctx, config)
        self.events: list[Event] = []
        self._seq = 0
        #: **动作提议序列**（L5 智能体产出、导演裁定）。与事件流分开存：
        #: 事件流记「世界变成了什么样」，动作序列记「当时谁提议了什么」——
        #: 两者合起来才能完整重演一场战役（见 ``troupe.replay``）。
        self.actions: list[dict] = []

    # ------------------------------------------------------------------ #
    #  动作序列（replay 的另一半）
    # ------------------------------------------------------------------ #
    def record_action(self, action: Any, outcome: Any = None) -> dict:
        """记录一次**行动提议**及其裁定结果。"""
        row = action.to_dict() if hasattr(action, "to_dict") else dict(action or {})
        row["_outcome"] = outcome if isinstance(outcome, dict) else {"receipt": outcome}
        self.actions.append(row)
        return row

    def actions_of(self, actor: str = "") -> list[dict]:
        if not actor:
            return list(self.actions)
        return [a for a in self.actions if a.get("actor") == actor]

    def actions_to_dict(self) -> list[dict]:
        return [dict(a) for a in self.actions]

    def load_actions(self, rows: list[dict]) -> None:
        self.actions = [dict(r) for r in (rows or [])]

    # ------------------------------------------------------------------ #
    #  写入
    # ------------------------------------------------------------------ #
    def record(self, type: str, actor: str = "", target: str = "",
               text: str = "", payload: Optional[dict] = None,
               tags: Optional[Iterable[str]] = None,
               scene_id: str = "") -> Event:
        """追加一条事件。``type`` 必须在 ``EVENT_TYPES`` 中登记（fails loud）。"""
        if type not in EVENT_TYPES:
            raise ValueError(f"未登记的事件类型: {type}")
        self._seq += 1
        ev = Event(
            seq=self._seq,
            type=type,
            ts=self.ctx.calendar.snapshot_time(),
            scene_id=scene_id or self.ctx.calendar.current_scene(),
            actor=actor, target=target,
            payload=dict(payload or {}),
            text=text,
            tags=list(tags or []),
        )
        self.events.append(ev)
        self.ctx.emit("log/recorded", ev)
        return ev

    def check(self, actor: str, result, label: str = "", scene_id: str = "") -> Event:
        """记录一次检定结果。"""
        return self.record(
            "check", actor=actor, text=result.text,
            payload={"success": result.success, "critical": result.critical,
                     "margin": result.margin, "roll": result.roll,
                     "total": result.total, "target": result.target,
                     "label": label, "data": result.data},
            scene_id=scene_id,
        )

    # ------------------------------------------------------------------ #
    #  查询
    # ------------------------------------------------------------------ #
    def __len__(self) -> int:
        return len(self.events)

    def __iter__(self):
        return iter(self.events)

    def all(self) -> list[Event]:
        return list(self.events)

    def filter(self, type: str | None = None, actor: str | None = None,
               scene_id: str | None = None, tag: str | None = None) -> list[Event]:
        out = self.events
        if type:
            out = [e for e in out if e.type == type]
        if actor:
            out = [e for e in out if e.actor == actor or e.target == actor]
        if scene_id:
            out = [e for e in out if e.scene_id == scene_id]
        if tag:
            out = [e for e in out if tag in e.tags]
        return out

    def tail(self, n: int = 20) -> list[Event]:
        return self.events[-n:]

    def since(self, seq: int) -> list[Event]:
        return [e for e in self.events if e.seq > seq]

    # ------------------------------------------------------------------ #
    #  渲染
    # ------------------------------------------------------------------ #
    def narrative(self, with_time: bool = True) -> list[str]:
        """把事件流渲染成人类可读的战报行（无文本的事件跳过）。"""
        lines = []
        for e in self.events:
            if not e.text:
                continue
            prefix = f"[{e.ts}] " if with_time else ""
            lines.append(f"{prefix}{e.text}")
        return lines

    def to_dict(self) -> list[dict]:
        return [e.to_dict() for e in self.events]

    def load(self, rows: list[dict]) -> None:
        """从存档还原事件流（保持 seq 连续）。"""
        self.events = [Event.from_dict(r) for r in rows]
        self._seq = max((e.seq for e in self.events), default=0)

    def clear(self) -> None:
        self.events = []
        self._seq = 0


__all__ = ["LogService"]
