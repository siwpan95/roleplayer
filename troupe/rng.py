"""troupe.rng - 分域随机源（可播种、可复现）

跑团模拟器要能**确定性回放**：同样的种子必须跑出同样的战役。全局 ``random``
做不到这点（任何一处调用都会串味），因此按域切分独立随机流：

    rules     规则检定骰（d20 / 3d6、伤害）—— 受规则集影响最频繁
    world     世界生成与地理（地点、天气、路况）
    oracle    GM 模拟器（混沌、命运、事件焦点、意义表）
    ai        智能体决策（目标选择、行动取舍）
    narrative 叙事润色（措辞多样性，不影响机制）

好处：AI 多掷一次骰不会改变后续检定结果；叙事措辞改动不会破坏回归测试；
存档只需记录 5 个流的状态即可精确续跑。
"""
from __future__ import annotations

import random
from typing import Optional

from d20.core import Service

#: 随机域（顺序即存档序列化顺序，勿随意重排）
DOMAINS = ("rules", "world", "oracle", "ai", "narrative")


def _derive(seed: int, domain: str) -> int:
    """从主种子为各域派生独立种子（同域同名 → 同结果；不同域 → 互不相关）。"""
    h = 2166136261
    for ch in f"{seed}:{domain}":
        h = ((h ^ ord(ch)) * 16777619) & 0xFFFFFFFF
    return h


class RngService(Service):
    """随机源服务。挂到 ``ctx.rng``，其他服务一律通过它取骰。"""

    inject: list = []
    name = "rng"

    def __init__(self, ctx, config=None) -> None:  # noqa: D107
        super().__init__(ctx, config)
        seed = int((config or {}).get("seed") or 0)
        self.seed = seed
        self._streams: dict[str, random.Random] = {
            d: random.Random(_derive(seed, d)) for d in DOMAINS
        }

    # ---------------- 取用 ----------------
    def stream(self, domain: str = "rules") -> random.Random:
        if domain not in self._streams:
            raise KeyError(f"未登记的随机域: {domain}（应为 {DOMAINS}）")
        return self._streams[domain]

    def r(self, domain: str = "rules") -> random.Random:
        """``stream`` 的短别名（调用处更紧凑）。"""
        return self.stream(domain)

    # ---------------- 常用骰 ----------------
    def d(self, sides: int, domain: str = "rules") -> int:
        return self.stream(domain).randint(1, sides)

    def nd(self, n: int, sides: int, domain: str = "rules") -> list[int]:
        s = self.stream(domain)
        return [s.randint(1, sides) for _ in range(n)]

    def chance(self, p: float, domain: str = "world") -> bool:
        return self.stream(domain).random() < p

    def pick(self, seq, domain: str = "world"):
        return self.stream(domain).choice(list(seq))

    def weighted(self, pairs, domain: str = "world"):
        """``pairs``: [(值, 权重), ...] → 加权抽取一个值。"""
        s = self.stream(domain)
        total = sum(w for _, w in pairs)
        if total <= 0:
            return pairs[0][0] if pairs else None
        x = s.random() * total
        acc = 0.0
        for v, w in pairs:
            acc += w
            if x <= acc:
                return v
        return pairs[-1][0]

    def shuffle(self, seq, domain: str = "world") -> list:
        out = list(seq)
        self.stream(domain).shuffle(out)
        return out

    # ---------------- 播种 / 快照 ----------------
    def reseed(self, seed: Optional[int] = None) -> None:
        """重播种（同一域序列不变，保证回放可复现）。"""
        if seed is not None:
            self.seed = int(seed)
        for d in DOMAINS:
            self._streams[d] = random.Random(_derive(self.seed, d))

    def snapshot(self) -> dict:
        """导出各流状态（存档用；加载后用 ``restore`` 精确续跑）。"""
        import base64
        import pickle

        out = {"seed": self.seed}
        for d in DOMAINS:
            blob = pickle.dumps(self._streams[d].getstate())
            out[d] = base64.b64encode(blob).decode("ascii")
        return out

    def restore(self, snap: dict) -> None:
        """从快照恢复随机流状态。"""
        import base64
        import pickle

        self.seed = int(snap.get("seed", 0))
        for d in DOMAINS:
            if d in snap:
                self._streams[d] = random.Random()
                self._streams[d].setstate(pickle.loads(base64.b64decode(snap[d])))


__all__ = ["DOMAINS", "RngService"]
