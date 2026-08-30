"""troupe.quest - 任务与线索服务（L2）

任务 = 若干目标 + 若干线索 + 奖励。线索是「玩家知道该怎么推进」的手段，
没有线索的任务等于没有任务 —— 因此探索成功时优先派发**线索**而非直接完成目标。

完成判定：所有目标 done → status=done → 派发奖励（经验 / 金币 / 声望 / 时钟收束）。
"""
from __future__ import annotations

from typing import Optional

from d20.core import Service

from .contracts import Clue, Objective, Quest


class QuestService(Service):
    """任务名册。挂到 ``ctx.quest``。"""

    # calendar/clock/log：tick() 判超时读日历、判 fail_condition 读时钟、全程记事件
    inject: list = ["calendar", "clock", "log"]
    name = "quest"

    def __init__(self, ctx, config=None) -> None:  # noqa: D107
        super().__init__(ctx, config)
        self.quests: dict[str, Quest] = {}

    # ------------------------------------------------------------------ #
    #  构建 / 查询
    # ------------------------------------------------------------------ #
    def add(self, q: Quest) -> Quest:
        self.quests[q.id] = q
        return q

    def get(self, qid: str) -> Optional[Quest]:
        return self.quests.get(qid)

    def active(self) -> list[Quest]:
        return [q for q in self.quests.values() if q.status == "active"]

    def done(self) -> list[Quest]:
        return [q for q in self.quests.values() if q.status == "done"]

    def all(self) -> list[Quest]:
        return list(self.quests.values())

    def open_clues(self) -> list[tuple[str, Clue]]:
        """尚未揭示的线索 (quest_id, clue)。"""
        out = []
        for q in self.active():
            for c in q.clues:
                if not self._revealed(c):
                    out.append((q.id, c))
        return out

    @staticmethod
    def _revealed(c) -> bool:
        return bool(c.revealed) if hasattr(c, "revealed") else bool(c.get("revealed"))

    # ------------------------------------------------------------------ #
    #  依赖 / 期限 / 失败条件（任务真的会被卡住、会过期、会失败）
    # ------------------------------------------------------------------ #
    def is_unlocked(self, q: Quest) -> bool:
        """前置任务是否全部完成（``depends_on`` 为空即视为已解锁）。"""
        for dep in (getattr(q, "depends_on", None) or []):
            dep_q = self.quests.get(dep)
            if dep_q is None or dep_q.status != "done":
                return False
        return True

    def start(self, qid: str, now: Optional[int] = None) -> Optional[Quest]:
        """接取任务：记录起始时刻；前置未满足则维持 locked 并返回 None。"""
        q = self.quests.get(qid)
        if q is None or q.status not in ("locked", "active"):
            return None
        if not self.is_unlocked(q):
            q.status = "locked"
            return None
        q.status = "active"
        q.started_minute = self._now() if now is None else int(now)
        return q

    def is_overdue(self, q: Quest, now: Optional[int] = None) -> bool:
        """是否已超过期限（``deadline_minutes<=0`` 表示无期限）。"""
        dl = int(getattr(q, "deadline_minutes", 0) or 0)
        if dl <= 0:
            return False
        start = int(getattr(q, "started_minute", 0) or 0)
        now = self._now() if now is None else int(now)
        return (now - start) > dl

    def refresh_locks(self) -> list[Quest]:
        """把前置已满足的 locked 任务解锁为 active，返回新解锁的任务。"""
        newly: list[Quest] = []
        for q in self.quests.values():
            if q.status == "locked" and self.is_unlocked(q):
                q.status = "active"
                newly.append(q)
                if self.ctx.has("log"):
                    self.ctx.log.record(
                        "quest.update", target=q.id,
                        text=f"任务解锁【{q.title}】（前置已完成）",
                        payload={"quest": q.id, "status": "active"}, tags=["quest"])
        return newly

    def available(self) -> list[Quest]:
        """当前可进行的任务：active 且未超时。"""
        now = self._now()
        return [q for q in self.quests.values()
                if q.status == "active" and not self.is_overdue(q, now)]

    def tick(self, now: Optional[int] = None) -> dict:
        """时间推进一拍：解锁新任务 → 判定超时/失败条件。

        这是「任务会自己失败」的唯一自动入口，供日历推进或导演调用。

        :return: ``{"unlocked": [quest_id...], "failed": [quest_id...]}``
        """
        now = self._now() if now is None else int(now)
        out = {"unlocked": [], "failed": []}
        for q in self.refresh_locks():
            out["unlocked"].append(q.id)
        for q in list(self.quests.values()):
            if q.status != "active":
                continue
            if self.is_overdue(q, now):
                self.fail(q.id, reason=f"超过期限（{q.deadline_minutes} 分钟）")
                out["failed"].append(q.id)
                continue
            if self._fail_condition_met(q):
                self.fail(q.id, reason=self._fail_reason(q))
                out["failed"].append(q.id)
        return out

    def _fail_condition_met(self, q: Quest) -> bool:
        """判定 ``fail_condition``：``clock:<id>``（该时钟已满）/
        ``quest_failed:<id>``（依赖任务已失败）。"""
        fc = str(getattr(q, "fail_condition", "") or "").strip()
        if not fc:
            return False
        if fc.startswith("clock:"):
            cid = fc.split(":", 1)[1].strip()
            if not self.ctx.has("clock"):
                return False
            c = self.ctx.clock.get(cid)
            return bool(c is not None and c.full)
        if fc.startswith("quest_failed:"):
            qid = fc.split(":", 1)[1].strip()
            dep = self.quests.get(qid)
            return bool(dep is not None and dep.status == "failed")
        return False

    def _fail_reason(self, q: Quest) -> str:
        fc = str(getattr(q, "fail_condition", "") or "").strip()
        if fc.startswith("clock:") and self.ctx.has("clock"):
            c = self.ctx.clock.get(fc.split(":", 1)[1].strip())
            if c is not None:
                return f"「{c.name}」到点"
        if fc.startswith("quest_failed:"):
            dep = self.quests.get(fc.split(":", 1)[1].strip())
            if dep is not None:
                return f"前置任务【{dep.title}】失败"
        return "失败条件达成"

    def _now(self) -> int:
        """当前游戏时间（分钟）；日历不可用时退化为 0。"""
        try:
            return int(self.ctx.calendar.now.total_minutes())
        except Exception:
            return 0

    # ------------------------------------------------------------------ #
    #  推进
    # ------------------------------------------------------------------ #
    def complete_objective(self, qid: str, oid: str) -> bool:
        q = self.quests.get(qid)
        if not q:
            return False
        for o in q.objectives:
            if self._obj_id(o) == oid and not self._obj_done(o):
                self._set_obj_done(o, True)
                if self.ctx.has("log"):
                    self.ctx.log.record(
                        "quest.update", target=qid,
                        text=f"任务进展【{q.title}】：{self._obj_text(o)}",
                        payload={"quest": qid, "objective": oid,
                                 "progress": q.progress()},
                        tags=["quest"])
                self._check_complete(q)
                return True
        return False

    def reveal_clue(self, qid: str, cid: str) -> Optional[Clue]:
        q = self.quests.get(qid)
        if not q:
            return None
        for c in q.clues:
            if self._clue_id(c) == cid:
                if not self._revealed(c):
                    self._set_revealed(c, True)
                    if self.ctx.has("log"):
                        self.ctx.log.record("clue", target=qid,
                                            text=f"线索：{self._clue_text(c)}",
                                            payload={"quest": qid, "clue": cid},
                                            tags=["clue"])
                return c
        return None

    def fail(self, qid: str, reason: str = "") -> None:
        q = self.quests.get(qid)
        if q is None or q.status == "failed":
            return
        q.status = "failed"
        if self.ctx.has("log"):
            self.ctx.log.record("quest.update", target=qid,
                                text=f"任务失败【{q.title}】" + (f"（{reason}）" if reason else ""),
                                payload={"quest": qid, "status": "failed"},
                                tags=["quest"])
        # 级联：把「本任务失败即失败」的下游任务一并判失败（quest_failed:<id>）
        for other in list(self.quests.values()):
            if other.id == qid or other.status != "active":
                continue
            if str(getattr(other, "fail_condition", "") or "").strip() == f"quest_failed:{qid}":
                self.fail(other.id, reason=f"前置任务【{q.title}】失败")
        self.ctx.emit("quest/failed", q)

    # ------------------------------------------------------------------ #
    #  完成结算
    # ------------------------------------------------------------------ #
    def _check_complete(self, q: Quest) -> None:
        if q.status != "active" or not q.objectives:
            return
        if all(self._obj_done(o) for o in q.objectives if not self._obj_optional(o)):
            q.status = "done"
            state = self.ctx.state
            state.total_xp += q.reward_xp
            state.gold += q.reward_gold
            if self.ctx.has("log"):
                self.ctx.log.record(
                    "quest.update", target=q.id,
                    text=f"任务完成【{q.title}】！获得 {q.reward_xp} XP、{q.reward_gold} 金",
                    payload={"quest": q.id, "status": "done",
                             "xp": q.reward_xp, "gold": q.reward_gold},
                    tags=["quest", "reward"])
            self.ctx.emit("quest/completed", q)
            # 完成可能解锁下游任务（depends_on）
            self.refresh_locks()

    # ------------------------------------------------------------------ #
    #  dict / dataclass 兼容（模组里的目标与线索可能是纯 dict）
    # ------------------------------------------------------------------ #
    @staticmethod
    def _obj_id(o) -> str:
        return str(o.id) if hasattr(o, "id") else str(o.get("id", ""))

    @staticmethod
    def _obj_text(o) -> str:
        return str(o.text) if hasattr(o, "text") else str(o.get("text", ""))

    @staticmethod
    def _obj_done(o) -> bool:
        return bool(o.done) if hasattr(o, "done") else bool(o.get("done"))

    @staticmethod
    def _obj_optional(o) -> bool:
        return bool(o.optional) if hasattr(o, "optional") else bool(o.get("optional"))

    @staticmethod
    def _set_obj_done(o, v: bool) -> None:
        if hasattr(o, "done"):
            o.done = v
        else:
            o["done"] = v

    @staticmethod
    def _clue_id(c) -> str:
        return str(c.id) if hasattr(c, "id") else str(c.get("id", ""))

    @staticmethod
    def _clue_text(c) -> str:
        return str(c.text) if hasattr(c, "text") else str(c.get("text", ""))

    @staticmethod
    def _set_revealed(c, v: bool) -> None:
        if hasattr(c, "revealed"):
            c.revealed = v
        else:
            c["revealed"] = v

    # ------------------------------------------------------------------ #
    #  存档
    # ------------------------------------------------------------------ #
    def to_dict(self) -> dict:
        return {k: v.to_dict() for k, v in self.quests.items()}

    def load(self, data: dict) -> None:
        self.quests = {k: Quest.from_dict(v) for k, v in (data or {}).items()}


__all__ = ["QuestService", "Objective", "Clue"]
