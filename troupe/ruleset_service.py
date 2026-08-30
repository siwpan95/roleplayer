"""troupe.ruleset_service - 把规则适配器挂进 Cordis 容器

``RulesetAdapter`` 是普通对象（便于单独单元测试、便于 Web 端复用），
这个 Service 只是把它包进 ``ctx``，让世界层能写 ``inject: [ruleset]``，
也让规则集可像其他子系统一样在 ``composition.yml`` 里换掉。
"""
from __future__ import annotations

from typing import Any

from d20.core import Service

from .ruleset import RulesetAdapter, get_ruleset, RulesetError


class RulesetService(Service):
    """当前生效的规则集（``ctx.ruleset``）。"""

    inject = ["rng"]
    name = "ruleset"

    def __init__(self, ctx, config=None) -> None:  # noqa: D107
        super().__init__(ctx, config)
        cfg = config or {}
        rid = cfg.get("id", "dnd5e")
        self.adapter: RulesetAdapter = get_ruleset(rid, rng=self.ctx.rng, config=cfg)
        self.id = self.adapter.id

    # ---- 代理常用方法（世界层写 ctx.ruleset.check(...) 即可）----
    def check(self, actor: Any, request) -> Any:
        return self.adapter.check(actor, request)

    def resolve_attack(self, attacker: Any, defender: Any, weapon=None, modifier: int = 0,
                       retreating: bool = False) -> dict:
        return self.adapter.resolve_attack(attacker, defender, weapon, modifier,
                                           retreating=retreating)

    def rank_of(self, actor: Any, key: str) -> int:
        return self.adapter.rank_of(actor, key)

    def hp_of(self, actor: Any) -> tuple[int, int]:
        return self.adapter.hp_of(actor)

    def set_hp(self, actor: Any, value: int) -> int:
        """直接写入当前 HP（战斗结算回写、存档恢复用）。"""
        return self.adapter.set_hp(actor, value)

    def alive(self, actor: Any) -> bool:
        return self.adapter.alive(actor)

    def contest(self, a: Any, b: Any, key: str = "力量", modifier: int = 0) -> dict:
        """双方对抗检定（如推搡、隐藏 vs 察觉）。"""
        return self.adapter.contest(a, b, key, modifier)

    def damage(self, actor: Any, amount: int, dtype: str = "钝击") -> dict:
        return self.adapter.damage(actor, amount, dtype)

    def heal(self, actor: Any, amount: int) -> int:
        return self.adapter.heal(actor, amount)

    def rest(self, actor: Any, kind: str = "short") -> dict:
        return self.adapter.rest(actor, kind)

    def defense_of(self, actor: Any) -> int:
        return self.adapter.defense_of(actor)

    def describe(self, actor: Any) -> str:
        return self.adapter.describe(actor)

    def actor_view(self, actor: Any) -> dict:
        return self.adapter.actor_view(actor)

    def dc_for(self, tier: str) -> int:
        return self.adapter.dc_for(tier)

    def modifier_for(self, tier: str) -> int:
        return self.adapter.modifier_for(tier)

    def xp_for(self, threat: Any) -> int:
        return self.adapter.xp_for(threat)

    def to_combatant(self, actor: Any):
        return self.adapter.to_combatant(actor)

    def points_of(self, actor: Any) -> int:
        """回算角色 GURPS 点数（仅 GURPS 适配器实现，其他规则返回 0）。"""
        fn = getattr(self.adapter, "points_of", None)
        if fn is not None:
            try:
                return int(fn(actor))
            except Exception:
                return 0
        return 0

    def swap(self, rid: str, **config) -> RulesetAdapter:
        """运行时换规则集（同一批角色对象继续可用）。"""
        self.adapter = get_ruleset(rid, rng=self.ctx.rng, config=config)
        self.id = self.adapter.id
        return self.adapter


__all__ = ["RulesetService", "RulesetError"]
