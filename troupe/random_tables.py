"""troupe.random_tables - 通用随机表引擎（L3）

随机表是数据驱动的：``[(权重, 值), ...]``。值可以是字符串、怪物名、嵌套表
（列表或字典），引擎会递归展开 —— 这样一张表就能表达「先定氛围，再定内容」。

所有随机表的取数都走 ``ctx.rng`` 的 ``world`` 域，保证：
* 与检定骰互不干扰（AI 多掷一次骰不会改变后续表结果）；
* 同一种子必然得到同一张表结果（可复现）。

**三层决策抽取（``roll_smart``，条件 → 随机 → 降级）**
----------------------------------------------------
随机表不等于「纯随机」：正确的做法是**分层**——

1. **条件层（该不该出现）**：``condition(item)`` 硬过滤候选集——按队伍等级、
   金币、地点、状态筛掉不该出现的项（正确性归条件管）；
2. **随机层（出现哪个）**：过滤后的候选集里**加权随机**抽取；``cooldown`` 内
   的项权重衰减、``seen`` 里的项排除——同一条件集下保留多种可能（趣味归随机管）；
3. **降级层（永不为空）**：候选被条件筛空时逐级放宽（先无视冷却/已见，
   再无视条件），最后全表兜底——**永不抛异常、永不为空**。
"""
from __future__ import annotations

from typing import Any, Callable, Optional

from roleplayer.core import Service

from . import data_tables as T


class RandomTableService(Service):
    """随机表。挂到 ``ctx.tables``。"""

    inject = ["rng"]
    name = "tables"

    def __init__(self, ctx, config=None) -> None:  # noqa: D107
        super().__init__(ctx, config)
        #: key → 最近抽取历史（roll_smart 的 cooldown 记忆；不进存档，续跑时重学）
        self._history: dict[str, list] = {}

    # ------------------------------------------------------------------ #
    #  引擎
    # ------------------------------------------------------------------ #
    def roll(self, table, domain: str = "world") -> Any:
        """按权重抽一项。``table`` 支持 ``[(w, v), ...]`` / 纯列表 / 嵌套字典。"""
        if callable(table):
            return table(self.ctx.rng.stream(domain))
        if isinstance(table, dict):
            return self.roll(list(table.items()), domain)
        if not table:
            return None
        # 统一成 (值, 权重) —— 与 rng.weighted 的契约一致
        norm = self._normalize(table)
        picked = self.ctx.rng.weighted(norm, domain=domain)
        # 嵌套展开：值本身若是表则继续展开
        if isinstance(picked, (list, tuple, dict)) and not isinstance(picked, str):
            return self.roll(picked, domain)
        return picked

    @staticmethod
    def _normalize(table) -> list:
        """把 ``[(权重, 值), ...]`` / 纯列表 / 嵌套字典 统一成 ``[(值, 权重), ...]``。"""
        norm = []
        for item in table:
            if isinstance(item, (list, tuple)) and len(item) == 2 and isinstance(item[0], (int, float)):
                norm.append((item[1], float(item[0])))
            else:
                norm.append((item, 1.0))
        return norm

    def roll_smart(self, table, key: str = "", condition: Optional[Callable] = None,
                   seen: Optional[set] = None, cooldown: int = 0,
                   domain: str = "world") -> Any:
        """三层决策抽取：**条件过滤 → 防重复加权随机 → 降级兜底**。

        :param table: 与 ``roll`` 同构的表（或 callable）
        :param key: 记忆键（cooldown 按键记历史；默认用表 id，跨调用共享）
        :param condition: ``condition(item) -> bool``；返回 False 的项被条件层剔除
        :param seen: 本次会话已抽过的项（排除集，可跨调用累积传入）
        :param cooldown: 最近 N 次抽中的项权重衰减（同 key 记忆内）
        :param domain: 随机域（默认 "world"）
        """
        if callable(table):
            return table(self.ctx.rng.stream(domain))
        if isinstance(table, dict):
            table = list(table.items())
        if not table:
            return None
        norm = self._normalize(table)
        history = self._history.setdefault(key or id(table), [])
        recent = set(history[-max(0, int(cooldown)):]) if cooldown > 0 else set()
        exclude = set(seen or [])

        def ok(item: Any) -> bool:
            if condition is None:
                return True
            try:
                return bool(condition(item))
            except Exception:
                return True                      # 条件异常视为通过（永不为空优先）

        # 1) 条件层 + 排除集
        candidates = [(v, w) for (v, w) in norm if v not in exclude and ok(v)]
        # 2) 降级一：条件筛空 → 无视 cooldown/seen（条件仍保留）
        if not candidates:
            candidates = [(v, w) for (v, w) in norm if ok(v)]
        # 3) 降级二：仍为空 → 全表兜底（无视一切）
        if not candidates:
            candidates = norm
        # 随机层：cooldown 内权重衰减，再加权抽取
        pairs = [(v, w * 0.2 if v in recent else w) for (v, w) in candidates]
        picked = self.ctx.rng.weighted(pairs, domain=domain)
        history.append(picked)
        del history[:-16]                       # 只保留最近 16 次记忆
        return picked

    def pick_n(self, table, n: int, domain: str = "world") -> list:
        return [self.roll(table, domain) for _ in range(n)]

    # ------------------------------------------------------------------ #
    #  语义化入口
    # ------------------------------------------------------------------ #
    def encounter(self, terrain: str, level: int = 1) -> str:
        """按地形与队伍等级抽一个遭遇怪物名（保证存在于 ``MONSTERS``）。"""
        tier = T.tier_of_level(level)
        table = T.TERRAIN_ENCOUNTERS.get(terrain, T.DEFAULT_ENCOUNTERS).get(
            tier, T.DEFAULT_ENCOUNTERS[tier])
        return self.roll(table)

    def encounter_group(self, terrain: str, level: int = 1, size: int = 1) -> list[str]:
        """抽一支遭遇编队（可重复同种）。"""
        return [self.encounter(terrain, level) for _ in range(max(1, size))]

    def discovery(self, place_kind: str = "") -> str:
        table = T.DISCOVERIES.get(place_kind, T.DEFAULT_DISCOVERY)
        return self.roll(table)

    def rumor(self) -> str:
        return self.roll(T.RUMORS)

    def travel_event(self) -> str:
        return self.roll(T.TRAVEL_EVENTS)

    def complication(self) -> str:
        return self.roll(T.COMPLICATIONS)

    def loot(self, tier: str = "普通") -> dict:
        """抽战利品：``{"gold": n, "items": [...]}``。"""
        spec = T.LOOT_TIERS.get(tier, T.LOOT_TIERS["普通"])
        rnd = self.ctx.rng.stream("world")
        lo, hi = spec["gold"]
        gold = rnd.randint(lo, hi)
        items = []
        if rnd.random() < 0.5:
            items.append(self.roll(spec["items"]))
        return {"gold": gold, "items": items}

    def theme_words(self, scene_kind: str, n: int = 2) -> list[str]:
        """取主题词（用于随机事件的双词启发）。"""
        theme = T.THEME_TABLES.get(scene_kind)
        if not theme:
            return []
        verbs, nouns = theme["verbs"], theme["nouns"]
        rnd = self.ctx.rng.stream("oracle")
        return [rnd.choice(verbs), rnd.choice(nouns)]

    # ------------------------------------------------------------------ #
    #  动态注册（模组可以塞自己的表进来）
    # ------------------------------------------------------------------ #
    def register(self, name: str, table) -> None:
        setattr(T, f"CUSTOM_{name}", table)

    def custom(self, name: str) -> Any:
        return self.roll(getattr(T, f"CUSTOM_{name}", []))


__all__ = ["RandomTableService"]
