"""troupe.calendar - 世界时间服务（L2）

时间的意义
----------
跑团模拟器里，时间是**最硬的资源**：旅行要花掉几天，长休要 8 小时，
派系在你磨蹭的时候推进自己的计划，危险时钟按天 tick。没有时间轴，
「休整」就是免费的读档键，世界也不会对玩家的拖延做出反应。

因此本服务提供唯一的时间真相源，并在跨越日界时广播 ``time/day`` 事件，
让世界层（派系推进、NPC 日程、补给消耗）挂上钩子。
"""
from __future__ import annotations

from d20.core import Service

from .contracts import GameTime


class CalendarService(Service):
    """世界时钟。挂到 ``ctx.calendar``。"""

    inject: list = []
    name = "calendar"

    def __init__(self, ctx, config=None) -> None:  # noqa: D107
        super().__init__(ctx, config)
        cfg = config or {}
        self.now = GameTime(day=int(cfg.get("day", 1)),
                            hour=int(cfg.get("hour", 8)),
                            minute=int(cfg.get("minute", 0)))
        self._scene_id = ""
        self.days_elapsed = 0

    # ------------------------------------------------------------------ #
    #  读取
    # ------------------------------------------------------------------ #
    def snapshot_time(self) -> GameTime:
        """返回时间**副本**（事件里存的是当时时刻，不能被后续推进改写）。"""
        return GameTime(self.now.day, self.now.hour, self.now.minute)

    def phase(self) -> str:
        return self.now.phase()

    def set_scene(self, scene_id: str) -> None:
        self._scene_id = scene_id

    def current_scene(self) -> str:
        return self._scene_id

    # ------------------------------------------------------------------ #
    #  推进
    # ------------------------------------------------------------------ #
    def advance(self, minutes: int, reason: str = "") -> GameTime:
        """推进时间；跨日时广播 ``time/day`` 事件。"""
        minutes = int(minutes)
        if minutes <= 0:
            return self.now
        before_day = self.now.day
        self.now.advance(minutes)
        if self.now.day > before_day:
            self.days_elapsed += self.now.day - before_day
            if self.ctx.has("log"):
                self.ctx.log.record(
                    "time.advance",
                    text=f"时间推进 {minutes} 分钟，进入第 {self.now.day} 日"
                         + (f"（{reason}）" if reason else ""),
                    payload={"minutes": minutes, "day": self.now.day, "reason": reason},
                    tags=["day_boundary"],
                )
            self.ctx.emit("time/day", self.now.day)
        elif self.ctx.has("log") and minutes >= 30:
            self.ctx.log.record(
                "time.advance",
                text=f"时间推进 {minutes} 分钟" + (f"（{reason}）" if reason else ""),
                payload={"minutes": minutes, "reason": reason},
            )
        return self.now

    def advance_hours(self, hours: float, reason: str = "") -> GameTime:
        return self.advance(int(round(hours * 60)), reason)

    def advance_days(self, days: int, reason: str = "") -> GameTime:
        return self.advance(int(days) * 1440, reason)

    # ------------------------------------------------------------------ #
    #  展示 / 存档
    # ------------------------------------------------------------------ #
    def to_dict(self) -> dict:
        return {"now": self.now.to_dict(), "days_elapsed": self.days_elapsed}

    def load(self, data: dict) -> None:
        d = (data or {}).get("now")
        if d:
            self.now = GameTime.from_dict(d)
        self.days_elapsed = int((data or {}).get("days_elapsed", 0))


__all__ = ["CalendarService"]
