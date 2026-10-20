"""troupe.agent - 智能体决策服务（L5）

智能体产出 :class:`Action`（**只提议，不改世界**）。导演裁定后果后落地，
因此智能体永远无法直接写世界 —— 作弊与状态不一致在架构上被杜绝。

两类决策：
* **PC 策略** ``propose(scene, actor, kind)``：根据场景模式（探索/交涉/旅行/休整）
  构造一次行动提议。行动带 ``request``（检定）与 ``on_success`` / ``on_fail`` 后果声明，
  交给导演翻译为具体的世界变更。
* **战斗策略**：交给 ``roleplayer.battle`` 自带的怪物/PC AI，本层不介入（见 ``encounter.combat``）。

策略可插拔：实现一个新的 ``Policy`` 子类（更激进 / 更保守 / 更爱社交），
在构造 ``AgentService`` 时传入即可，世界层代码一行不动。
"""
from __future__ import annotations

from typing import Any, Optional

from roleplayer.core import Service

from .contracts import Action, CheckRequest, Place, Route


class Policy:
    """行动策略基类。子类可重写各模式的提议逻辑。"""

    #: 各模式默认检定键（可被子类覆盖）
    SKILL_FOR_KIND = {
        "exploration": "察觉",
        "social": "说服",
        "travel": "生存",
        "downtime": "医疗",
    }

    def propose(self, ctx, scene, actor_name: str, kind: str) -> Optional[Action]:
        fn = getattr(self, f"_propose_{kind}", None)
        if fn is None:
            fn = self._propose_exploration
        return fn(ctx, scene, actor_name)

    # ------------------------------------------------------------------ #
    def _propose_exploration(self, ctx, scene, actor_name: str) -> Optional[Action]:
        # 先确保有一个可发现的目标地点（导演 apply 的 discovery 要求地点已存在）
        here = ctx.world.here()
        name = ctx.tables.discovery(here.kind if here else "")
        pid = ctx.world.add_discovered_place(name, kind="荒野", danger=2).id
        return Action(
            actor=actor_name, verb="搜索", kind="exploration",
            request=CheckRequest(actor=actor_name, kind="skill",
                                 key=self.SKILL_FOR_KIND["exploration"],
                                 tier="普通", label="搜索环境"),
            payload={
                "on_success": {"discovery": [pid], "xp": 30,
                               "thread_add": [f"在{here.name if here else '野外'}发现的线索"]},
                "on_fail": {"clock": {"danger": 1}},
                "narrative": f"{actor_name} 仔细搜索四周的环境。",
            },
        )

    def _propose_social(self, ctx, scene, actor_name: str) -> Optional[Action]:
        # 已有认识的 NPC 时轮换接触对象（而非永远固定 known()[0]），避免整场只缠着同一个 NPC
        known = ctx.npc.known()
        npc = ctx.rng.pick(known) if known else ctx.npc.generate(place=ctx.world.current)
        ctx.npc.meet(npc.id)
        return Action(
            actor=actor_name, verb="交涉", kind="social",
            request=CheckRequest(actor=actor_name, kind="skill",
                                 key=self.SKILL_FOR_KIND["social"],
                                 tier="普通", label=f"向{npc.name}交涉"),
            payload={
                "on_success": {"npc": {npc.id: {"disposition": 1, "new": True}},
                               "thread_add": [f"{npc.name}提供的情报"]},
                "on_fail": {"npc": {npc.id: {"disposition": -1}}},
                "narrative": f"{actor_name} 试着与{npc.name}（{npc.role}）套话。",
            },
        )

    def _propose_travel(self, ctx, scene, actor_name: str) -> Optional[Action]:
        neighbors = ctx.world.neighbors(ctx.world.current)
        if not neighbors:
            # 没路可走 → 退化为探索
            return self._propose_exploration(ctx, scene, actor_name)
        dest = ctx.rng.pick(neighbors, domain="world")
        return Action(
            actor=actor_name, verb="行进", kind="travel",
            request=CheckRequest(actor=actor_name, kind="skill",
                                 key=self.SKILL_FOR_KIND["travel"],
                                 tier="普通", label="辨明路径"),
            payload={
                "on_success": {"move_to": dest.id, "time": 120,
                               "thread_add": [f"抵达{dest.name}"]},
                "on_fail": {"move_to": dest.id, "time": 180,
                            "clock": {"danger": 1}},
                "narrative": f"{actor_name} 带队向{dest.name}进发。",
            },
        )

    def _propose_downtime(self, ctx, scene, actor_name: str) -> Optional[Action]:
        # 休整无检定：只推进时间并让全队恢复
        return Action(
            actor=actor_name, verb="休整", kind="downtime",
            request=None,
            payload={
                "effects": {"time": 480, "rest": "long"},
                "narrative": f"{actor_name} 安排全队就地休整与补给。",
            },
        )


class CautiousPolicy(Policy):
    """更保守：探索/旅行偏好先侦查（降低危险时钟），休整更频繁。"""

    def _propose_exploration(self, ctx, scene, actor_name: str):
        act = super()._propose_exploration(ctx, scene, actor_name)
        if act and act.payload.get("on_success"):
            act.payload["on_success"].setdefault("clock", {})["danger"] = -1
        return act

    def _propose_travel(self, ctx, scene, actor_name: str):
        act = super()._propose_travel(ctx, scene, actor_name)
        # 保守旅行先做侦察检定（更难失败则推进危险时钟）
        if act and act.request is not None:
            act.request.tier = "容易"
        return act


class AggressivePolicy(Policy):
    """更激进：倾向于主动接战（通过把探索后果改成触发战斗）。"""

    def _propose_exploration(self, ctx, scene, actor_name: str):
        act = super()._propose_exploration(ctx, scene, actor_name)
        if act:
            # 平均队伍等级**内联计算**（不调 ctx.encounter._avg_party_level）——
            # encounter 依赖 agent，agent 再依赖 encounter 会成环
            party = ctx.director.party() if ctx.has("director") else []
            lv = [max(getattr(getattr(p, "state", None), "level", 1) or 1, 1)
                  for p in party]
            level = max(1, round(sum(lv) / len(lv))) if lv else 1
            act.payload.setdefault("on_fail", {})["combat"] = {
                "enemies": [ctx.tables.encounter(
                    ctx.world.here().kind if ctx.world.here() else "道路",
                    level)]}
        return act


_POLICIES = {"default": Policy, "cautious": CautiousPolicy, "aggressive": AggressivePolicy}


class AgentService(Service):
    """智能体决策。挂到 ``ctx.agent``。"""

    # rng/npc/world/tables/director：掷随机、轮换已知 NPC、读世界邻居、
    # 抽遭遇编队（tables）、算队伍等级（director）——不依赖 encounter，避免成环
    inject = ["rng", "npc", "world", "tables", "director"]
    name = "agent"

    def __init__(self, ctx, config=None) -> None:  # noqa: D107
        super().__init__(ctx, config)
        cfg = config or {}
        policy_name = cfg.get("policy", "default")
        self.policy = _POLICIES.get(policy_name, Policy)()

    # ------------------------------------------------------------------ #
    def propose(self, scene, actor_name: str, kind: str = "exploration") -> Optional[Action]:
        """为某演员产出一次行动提议（探索/交涉/旅行/休整）。"""
        if kind == "combat":
            return None  # 战斗由 roleplayer.battle AI 接管
        return self.policy.propose(self.ctx, scene, actor_name, kind)

    def set_policy(self, name: str) -> None:
        """运行时切换策略。"""
        self.policy = _POLICIES.get(name, Policy)()

    @staticmethod
    def available_policies() -> list[str]:
        return sorted(_POLICIES)


__all__ = ["AgentService", "Policy", "CautiousPolicy", "AggressivePolicy"]
