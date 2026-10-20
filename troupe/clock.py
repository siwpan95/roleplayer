"""troupe.clock - 进度时钟服务（L2）

进度时钟（Progress Clock）是让「看不见的压力」变得可见的装置：

    danger      危险时钟：失败、暴露、追兵逼近 → 满了就出事
    exploration 探索时钟：搜完一整片区域需要几个成功
    campaign    战役时钟：主线在多长时间后自己推进到不可挽回
    faction     派系时钟：由 ``FactionService`` 每 tick 推进

时钟把「叙事压力」量化了，导演就能在不写死剧本的前提下制造节奏：
玩家拖得越久，危险时钟越满，世界越危险。
"""
from __future__ import annotations

from typing import Optional

from roleplayer.core import Service

from .contracts import Clock


class ClockService(Service):
    """进度时钟。挂到 ``ctx.clock``。"""

    inject: list = []
    name = "clock"

    def __init__(self, ctx, config=None) -> None:  # noqa: D107
        super().__init__(ctx, config)
        self.clocks: dict[str, Clock] = {}

    # ------------------------------------------------------------------ #
    #  构建 / 查询
    # ------------------------------------------------------------------ #
    def create(self, cid: str, name: str, segments: int = 4,
               kind: str = "danger", consequence: str = "") -> Clock:
        c = Clock(id=cid, name=name, segments=max(1, int(segments)),
                  kind=kind, consequence=consequence or f"{name}到点了。")
        self.clocks[cid] = c
        return c

    def get(self, cid: str) -> Optional[Clock]:
        return self.clocks.get(cid)

    def all(self) -> list[Clock]:
        return list(self.clocks.values())

    def by_kind(self, kind: str) -> list[Clock]:
        return [c for c in self.clocks.values() if c.kind == kind]

    def add(self, clock: Clock) -> Clock:
        self.clocks[clock.id] = clock
        return clock

    # ------------------------------------------------------------------ #
    #  推进
    # ------------------------------------------------------------------ #
    def tick(self, cid: str, n: int = 1) -> Optional[Clock]:
        """推进时钟；填满时记事件并广播 ``clock/full``（导演挂后果）。"""
        c = self.clocks.get(cid)
        if c is None:
            return None
        if c.full:
            return c
        filled = c.tick(n)
        if self.ctx.has("log"):
            self.ctx.log.record("clock.tick", target=cid,
                                text=f"【{c.name}】{c.filled}/{c.segments}",
                                payload={"clock": cid, "filled": c.filled,
                                         "segments": c.segments, "kind": c.kind},
                                tags=["clock", c.kind])
        if filled:
            if self.ctx.has("log"):
                self.ctx.log.record("clock.tick", target=cid,
                                    text=f"【{c.name}】已满 → {c.consequence}",
                                    payload={"clock": cid, "full": True},
                                    tags=["clock", "consequence"])
            self.ctx.emit("clock/full", c)
        return c

    def clear(self, cid: str) -> None:
        c = self.clocks.get(cid)
        if c:
            c.filled = 0

    def remove(self, cid: str) -> None:
        self.clocks.pop(cid, None)

    # ------------------------------------------------------------------ #
    #  存档
    # ------------------------------------------------------------------ #
    def to_dict(self) -> dict:
        return {k: v.to_dict() for k, v in self.clocks.items()}

    def load(self, data: dict) -> None:
        self.clocks = {k: Clock.from_dict(v) for k, v in (data or {}).items()}


__all__ = ["ClockService"]
