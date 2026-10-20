"""troupe.faction - 派系服务（L2）

派系是让世界「自己动起来」的关键装置：玩家在别处磨蹭时，派系照自己的目标推进
（推进时钟 → 触发后果），并对玩家在该派系的声望做出反应。

模型：
    standing  -100..100  队伍在该派系的声望
    power     1..10      推进速度（每次 tick 的时钟段数）
    allies / rivals      声望变化会按 **半值** 传播到盟友 / 反向传播到对手

这样「讨好 A 得罪 B」会自动产生连锁反应，而不需要剧本硬写。
"""
from __future__ import annotations

from typing import Optional

from roleplayer.core import Service

from .contracts import FactionProfile


class FactionService(Service):
    """派系与声望。挂到 ``ctx.faction``。"""

    # log/clock：声望变动记事件；_apply/_on_new_day 推进派系时钟
    inject: list = ["log", "clock"]
    name = "faction"

    def __init__(self, ctx, config=None) -> None:  # noqa: D107
        super().__init__(ctx, config)
        self.factions: dict[str, FactionProfile] = {}

    # ------------------------------------------------------------------ #
    #  构建 / 查询
    # ------------------------------------------------------------------ #
    def add(self, f: FactionProfile) -> FactionProfile:
        self.factions[f.id] = f
        return f

    def get(self, fid: str) -> Optional[FactionProfile]:
        return self.factions.get(fid)

    def all(self) -> list[FactionProfile]:
        return list(self.factions.values())

    def standing_word(self, standing: int) -> str:
        if standing <= -60:
            return "死敌"
        if standing <= -20:
            return "敌视"
        if standing < 20:
            return "中立"
        if standing < 60:
            return "认可"
        return "崇敬"

    # ------------------------------------------------------------------ #
    #  变更
    # ------------------------------------------------------------------ #
    def adjust(self, fid: str, delta: int, reason: str = "") -> int:
        """调整声望并**传播**到盟友（半值同向）与对手（半值反向）。"""
        f = self.factions.get(fid)
        if not f:
            return 0
        before = f.standing
        f.standing = max(-100, min(100, f.standing + int(delta)))
        if self.ctx.has("log"):
            self.ctx.log.record(
                "faction.shift", target=fid,
                text=f"在「{f.name}」的声望 {before:+d} → {f.standing:+d}"
                     + (f"（{reason}）" if reason else ""),
                payload={"faction": fid, "from": before, "to": f.standing, "reason": reason},
                tags=["faction"],
            )
        # 传播
        half = int(round(delta / 2))
        if half:
            for aid in f.allies:
                if aid in self.factions:
                    self._apply_raw(aid, half, f"与{f.name}同盟")
            for rid in f.rivals:
                if rid in self.factions:
                    self._apply_raw(rid, -half, f"与{f.name}对立")
        return f.standing

    def _apply_raw(self, fid: str, delta: int, reason: str) -> None:
        """内部使用：调整声望但**不再传播**（防止无限递归）。"""
        f = self.factions.get(fid)
        if not f:
            return
        f.standing = max(-100, min(100, f.standing + int(delta)))
        if self.ctx.has("log"):
            self.ctx.log.record("faction.shift", target=fid,
                                text=f"「{f.name}」声望 {f.standing:+d}（{reason}）",
                                payload={"faction": fid, "to": f.standing,
                                         "reason": reason, "propagated": True},
                                tags=["faction"])

    # ------------------------------------------------------------------ #
    #  自主推进（挂到 time/day 事件）
    # ------------------------------------------------------------------ #
    def apply(self) -> None:
        """挂载钩子：每个新游戏日，派系按 power 推进自己的时钟。"""
        self.ctx.on("time/day", self._on_new_day)

    def _on_new_day(self, day: int) -> None:
        if not self.ctx.has("clock"):
            return
        for f in self.factions.values():
            if f.standing <= -60:
                continue                       # 死敌不会为你放缓脚步，但也不额外加速
            cid = f"faction_{f.id}"
            clock = self.ctx.clock.get(cid)
            if clock is None:
                clock = self.ctx.clock.create(
                    cid, f"{f.name}的计划", segments=8,
                    kind="faction", consequence=f"「{f.name}」完成了它的计划。")
            step = max(1, f.power // 4)
            self.ctx.clock.tick(cid, step)

    # ------------------------------------------------------------------ #
    #  存档
    # ------------------------------------------------------------------ #
    def to_dict(self) -> dict:
        return {k: v.to_dict() for k, v in self.factions.items()}

    def load(self, data: dict) -> None:
        self.factions = {k: FactionProfile.from_dict(v)
                         for k, v in (data or {}).items()}


__all__ = ["FactionService"]
