"""troupe.npc_agency - NPC 自主行动（L2 世界层的「世界自己会动」）

在此之前 NPC 只有档案（态度/诉求/秘密），不会**主动**做任何事——世界在队伍
不动时是静止的。本服务给每个 NPC 补上自主行为：按职业(role)分派行动，行动
产生真实世界变化（放出线索、改变态度、挪动派系声望、暗中偷窃、换防移动），
全部经事件溯源记录，可回放、可审计。

驱动时机
--------
* **场景节拍**：``EncounterService.noncombat`` 每个节拍后以较低概率 ``tick()``
  （世界在玩家行动间隙悄悄转动）；
* **每日推进**：订阅 ``time/day`` 事件做 ``daily()``（过夜时 NPC 大规模活动）。

许可边界：行动类型与职业映射为**自研设计**（受 PbtA「世界推动剧情」启发），
不搬运任何规则书逐格数据。
"""
from __future__ import annotations

from typing import Any, Optional

from d20.core import Service

#: role → [(权重, 行动键)]。行动键见 ``_EFFECTS``。
_ROLE_ACTIONS: dict[str, list] = {
    "商人": [(3, "trade"), (1, "travel")],
    "卫兵": [(3, "patrol"), (1, "gossip")],
    "佣兵": [(2, "patrol"), (2, "travel")],
    "学者": [(3, "research"), (1, "gossip")],
    "祭司": [(2, "research"), (2, "aid")],
    "医师": [(3, "aid"), (1, "travel")],
    "盗贼": [(2, "sneak"), (1, "gossip")],
    "走私犯": [(2, "sneak"), (1, "trade")],
    "密探": [(3, "sneak"), (1, "travel")],
    "贵族": [(2, "politics"), (1, "gossip")],
    "官员": [(2, "politics"), (2, "patrol")],
    "工匠": [(2, "trade"), (1, "aid")],
    "吟游诗人": [(2, "gossip"), (2, "travel")],
    "向导": [(2, "travel"), (2, "gossip")],
    "农夫": [(3, "daily"), (1, "gossip")],
    "流浪者": [(2, "travel"), (1, "daily")],
}
_DEFAULT_ACTIONS = [(2, "daily"), (1, "gossip")]

#: 行动键 → 中文标签（事件文本用）
_ACTION_CN = {
    "trade": "放出货源消息", "patrol": "加强戒备", "research": "钻研情报",
    "aid": "施以援手", "sneak": "暗中活动", "politics": "经营关系",
    "gossip": "散布传闻", "travel": "动身远行", "daily": "操持日常",
    "threaten": "出言威胁", "flee": "仓皇离去",
}

#: 随机层权重：同一条件集内的候选行动按此加权抽取（趣味变数归这里）
_ACTION_WEIGHTS = {
    "threaten": 1.0, "sneak": 1.5, "flee": 1.0, "trade": 1.2,
    "gossip": 1.2, "aid": 1.0, "patrol": 1.0, "travel": 1.0,
    "politics": 1.0, "research": 1.0, "daily": 1.0,
}

#: **条件层（行为树）**：按状态条件决定候选行动集，顺序即优先级。
#: 条件键 → 命中时的候选行动。语义：
#:   敌对 → 威胁/暗算/逃走（绝不交易、绝不援助）；
#:   队伍富有 → 觊觎（暗行）+ 推销 + 传闻；
#:   友善 → 援助/闲聊/交易（绝不威胁）；
#:   危险地带 → 戒备/远行；
#:   有派系 → 政治活动；
#:   队伍拮据 → 推销/闲聊/援助；
#:   和平地带 → 远行/交易/闲聊。
#: 全部不命中 → 降级层（职业表 ``_ROLE_ACTIONS`` 随机兜底）。
_BTREE: list[tuple[str, list]] = [
    ("hostile", ["threaten", "sneak", "flee"]),
    ("rich_target", ["sneak", "trade", "gossip"]),
    ("friendly", ["aid", "gossip", "trade"]),
    ("guarded_place", ["patrol", "travel", "gossip"]),
    ("has_faction", ["politics", "gossip", "trade"]),
    ("poor_target", ["trade", "gossip", "aid"]),
    ("peaceful_place", ["travel", "trade", "gossip"]),
]


class NpcAgencyService(Service):
    """NPC 自主行动。挂到 ``ctx.agency``。"""

    inject = ["rng", "npc", "world", "log", "oracle", "faction"]
    name = "agency"

    def __init__(self, ctx, config=None) -> None:  # noqa: D107
        super().__init__(ctx, config)
        #: 每日推进订阅：过夜时世界大规模转动
        ctx.on("time/day", self._on_new_day)

    # ------------------------------------------------------------------ #
    #  驱动
    # ------------------------------------------------------------------ #
    def tick(self, p: float = 0.25) -> list[dict]:
        """每个存活 NPC 以概率 ``p`` 行动一次（场景节拍用）。

        :return: 本次行动的结果列表（事件 payload 的同构 dict）。
        """
        rnd = self.ctx.rng.stream("world")
        out: list[dict] = []
        for npc in self.ctx.npc.all():
            if not npc.alive:
                continue
            if rnd.random() < max(0.0, min(1.0, p)):
                out.append(self.act(npc))
        return out

    def daily(self, p: float = 0.5) -> list[dict]:
        """每日推进：NPC 以更高概率活动（``time/day`` 事件触发）。"""
        return self.tick(p)

    def _on_new_day(self, day: int) -> None:
        try:
            self.daily()
        except Exception:
            pass

    # ------------------------------------------------------------------ #
    #  单个 NPC 行动
    # ------------------------------------------------------------------ #
    def act(self, npc: Any) -> dict:
        """让一个 NPC 自主行动：**条件层 → 随机层 → 降级层** → 落地效果 → 记事件。

        1. 条件层（行为树 ``_BTREE``）：按 NPC/队伍/地点状态筛出候选行动集；
        2. 随机层：候选集内按 ``_ACTION_WEIGHTS`` 加权抽取（同条件集下的趣味变数）；
        3. 降级层：条件全不命中 → 职业表 ``_ROLE_ACTIONS`` 随机兜底（永不为空）。
        """
        rnd = self.ctx.rng.stream("world")
        candidates = self._decision(npc)
        if candidates:
            kind = rnd.choices(
                candidates,
                weights=[_ACTION_WEIGHTS.get(k, 1.0) for k in candidates], k=1)[0]
            via = "condition"
        else:
            table = _ROLE_ACTIONS.get(getattr(npc, "role", "") or "", _DEFAULT_ACTIONS)
            kind = rnd.choices([k for _, k in table],
                               weights=[w for w, _ in table], k=1)[0]
            via = "fallback"
        label = _ACTION_CN.get(kind, kind)
        effects = self._apply(kind, npc)
        text = f"{npc.name}（{npc.role}）{label}" + (f"：{effects['text']}" if effects.get("text") else "")
        payload = {"npc": npc.id, "name": npc.name, "role": getattr(npc, "role", ""),
                   "action": kind, "place": getattr(npc, "place", ""),
                   "via": via,
                   "effects": {k: v for k, v in effects.items() if k != "text"}}
        self.ctx.log.record("npc.action", actor=npc.id, text=text,
                            payload=payload, tags=["npc", "agency"])
        payload["text"] = text
        return payload

    # ------------------------------------------------------------------ #
    #  条件层（行为树）
    # ------------------------------------------------------------------ #
    def _state_of(self, npc: Any) -> dict:
        """NPC 决策上下文（条件层的输入）。"""
        gold = int(getattr(self.ctx.state, "gold", 0) or 0)
        place = None
        try:
            place = self.ctx.world.place(getattr(npc, "place", "") or "")
        except Exception:
            place = None
        danger = int(getattr(place, "danger", 1) or 1) if place else 1
        return {
            "hostile": int(getattr(npc, "disposition", 0) or 0) <= -1,
            "friendly": int(getattr(npc, "disposition", 0) or 0) >= 1,
            "rich_target": gold >= 30,
            "poor_target": gold <= 10,
            "has_faction": bool(getattr(npc, "faction", "") or ""),
            "guarded_place": danger >= 3,
            "peaceful_place": danger <= 1,
        }

    def _decision(self, npc: Any) -> list:
        """条件层：命中第一个条件即返回其候选行动集；全不命中返回空（走降级）。"""
        state = self._state_of(npc)
        for cond, acts in _BTREE:
            if state.get(cond):
                return list(acts)
        return []

    # ------------------------------------------------------------------ #
    #  效果落地（真实世界变化）
    # ------------------------------------------------------------------ #
    def _apply(self, kind: str, npc: Any) -> dict:
        rnd = self.ctx.rng.stream("world")
        name = getattr(npc, "name", "某人")
        eff: dict = {}
        if kind == "trade":
            eff["text"] = "放出了新货源的消息"
            self._thread(f"听说 {name} 手里有批新货")
            if rnd.random() < 0.5:
                eff["disposition"] = self._disposition(npc, 1, "生意往来")
        elif kind == "patrol":
            eff["text"] = "让附近戒备森严了起来"
            self._thread(f"{name} 加强了附近的巡逻")
            if rnd.random() < 0.5:
                self._danger_shift(npc.place, -1)
                eff["danger"] = -1
        elif kind == "research":
            eff["text"] = "钻研出了一些东西"
            self._thread(f"{name} 似乎查到了什么")
            if rnd.random() < 0.3 and npc.secret:
                eff["secret_hint"] = True
                self._thread(f"关于 {name} 的流言开始传开")
        elif kind == "aid":
            eff["text"] = "向周围的人施以援手"
            eff["disposition"] = self._disposition(npc, 1, "善意")
        elif kind == "sneak":
            eff["text"] = "在暗中活动"
            self._thread("有人注意到阴影里的动静")
            if rnd.random() < 0.25:
                loss = rnd.randint(2, 8)
                state = self.ctx.state
                state.gold = max(0, int(getattr(state, "gold", 0)) - loss)
                eff["gold"] = -loss
                eff["text"] += f"，队伍少了 {loss} 枚金币"
        elif kind == "politics":
            eff["text"] = "在经营各方关系"
            if npc.faction:
                delta = rnd.choice([1, -1])
                self.ctx.faction.adjust(npc.faction, delta, reason=f"{name} 的活动")
                eff["faction"] = delta
            self._thread(f"{name} 最近在四处走动")
        elif kind == "gossip":
            eff["text"] = "散布了一些传闻"
            self._thread(f"{name} 说了一件有意思的事")
        elif kind == "travel":
            dest = self._move(npc)
            eff["text"] = "动身去了别处" + (f"（抵达 {dest}）" if dest else "")
            eff["move"] = dest
        elif kind == "threaten":
            eff["text"] = "对队伍撂下狠话"
            eff["disposition"] = self._disposition(npc, -1, "威胁")
            self._thread(f"有人被 {name} 威胁了")
        elif kind == "flee":
            dest = self._move(npc)
            eff["text"] = "匆匆离开了" + (f"（去向 {dest}）" if dest else "")
            eff["move"] = dest
            self._thread(f"{name} 似乎在躲着什么")
        else:  # daily
            eff["text"] = ""
        return eff

    # ------------------------------------------------------------------ #
    #  世界写入的小工具
    # ------------------------------------------------------------------ #
    def _thread(self, text: str) -> None:
        """给 Oracle 加一条未关闭的剧情线索（NPC 制造情报）。"""
        try:
            self.ctx.oracle.add_thread(text)
        except Exception:
            pass

    def _disposition(self, npc: Any, delta: int, reason: str) -> int:
        """调整 NPC 对队伍的态度。"""
        try:
            return self.ctx.npc.adjust(npc.id, delta, reason=reason)
        except Exception:
            return 0

    def _danger_shift(self, place_id: str, delta: int) -> None:
        """调整地点危险度（巡逻降危险）。"""
        try:
            p = self.ctx.world.place(place_id)
            if p is not None:
                p.danger = max(1, min(5, int(getattr(p, "danger", 1)) + delta))
        except Exception:
            pass

    def _move(self, npc: Any) -> str:
        """NPC 移动：优先沿路线去邻接地点，无路线则随机换地点。"""
        try:
            here = getattr(npc, "place", "") or ""
            neighbors = [p for p in self.ctx.world.neighbors(here)
                         if getattr(p, "id", "") != here] if here else []
            dest = self.ctx.rng.pick(neighbors) if neighbors else None
            if dest is None and here:
                others = [p for p in self.ctx.world.places.values()
                          if p.id != here]
                if others:
                    dest = self.ctx.rng.pick(others)
            if dest is not None:
                npc.place = getattr(dest, "id", str(dest))
                return npc.place
        except Exception:
            pass
        return ""

    # ------------------------------------------------------------------ #
    #  存档（本服务无自有状态，NPC 状态在 npc 服务）
    # ------------------------------------------------------------------ #
    def to_dict(self) -> dict:
        return {}

    def load(self, data: dict) -> None:
        return None


__all__ = ["NpcAgencyService", "_ROLE_ACTIONS"]
