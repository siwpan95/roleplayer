"""troupe.lore - 已确立事实（canon）服务（L3）

跑团最难的不是随机，而是**自洽**：第 3 场说领主姓沈，第 7 场变成姓陆，
玩家立刻出戏。随机表负责惊喜，``lore`` 负责不让惊喜变成矛盾。

工作机制：
* 任何「命名类」的随机结果（人名、地名、组织名、物品名）都登记为一条事实；
* 生成新的同类事实时，先查已有事实，命中就复用；
* 事实带 ``topic`` 分类与可选 ``key``，供后续检索与「世界 wiki」渲染。
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional

from d20.core import Service

from .contracts import DictMixin


@dataclass
class Fact(DictMixin):
    """一条已确立的事实。"""

    topic: str                      # 人物 / 地点 / 组织 / 物品 / 事件 / 规则
    text: str
    key: str = ""                   # 可选检索键（如 "领主"）
    source: str = ""                # 由谁确立（scene id / "module"）
    tags: list = field(default_factory=list)


class LoreService(Service):
    """已确立事实库。挂到 ``ctx.lore``。"""

    # calendar：确立事实时取当前场景/时间戳
    inject: list = ["calendar"]
    name = "lore"

    def __init__(self, ctx, config=None) -> None:  # noqa: D107
        super().__init__(ctx, config)
        self.facts: list[Fact] = []

    # ------------------------------------------------------------------ #
    #  写入
    # ------------------------------------------------------------------ #
    def establish(self, topic: str, text: str, key: str = "",
                  source: str = "", tags: Optional[list] = None) -> Fact:
        """登记一条事实（重复登记同一 topic+text 不会重复入库）。"""
        for f in self.facts:
            if f.topic == topic and f.text == text:
                return f
        fact = Fact(topic=topic, text=text, key=key,
                    source=source or (self.ctx.calendar.current_scene()
                                      if self.ctx.has("calendar") else ""),
                    tags=list(tags or []))
        self.facts.append(fact)
        return fact

    # ------------------------------------------------------------------ #
    #  查询
    # ------------------------------------------------------------------ #
    def by_topic(self, topic: str) -> list[Fact]:
        return [f for f in self.facts if f.topic == topic]

    def by_key(self, key: str) -> list[Fact]:
        return [f for f in self.facts if f.key == key]

    def find(self, keyword: str) -> list[Fact]:
        return [f for f in self.facts if keyword in f.text]

    def has(self, topic: str, text: str) -> bool:
        return any(f.topic == topic and f.text == text for f in self.facts)

    def names_of(self, topic: str) -> list[str]:
        return [f.text for f in self.by_topic(topic)]

    # ------------------------------------------------------------------ #
    #  「取或建」——生成新事实的统一入口
    # ------------------------------------------------------------------ #
    def recall_or_establish(self, topic: str, key: str, generator) -> Fact:
        """有则复用，无则调用 ``generator()`` 生成并登记。

        用法::

            fact = ctx.lore.recall_or_establish("人物", "镇长",
                       lambda: f"{rnd.choice(姓)}{rnd.choice(名)}")
        """
        for f in self.facts:
            if f.topic == topic and f.key == key:
                return f
        text = generator()
        return self.establish(topic, text, key=key)

    # ------------------------------------------------------------------ #
    #  存档
    # ------------------------------------------------------------------ #
    def to_dict(self) -> list[dict]:
        return [f.to_dict() for f in self.facts]

    def load(self, data: list) -> None:
        self.facts = [Fact.from_dict(d) for d in (data or [])]


__all__ = ["LoreService", "Fact"]
