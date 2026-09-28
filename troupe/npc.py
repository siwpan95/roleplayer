"""troupe.npc - NPC 服务（L2）

NPC 不是「会说话的怪物」，而是三样东西的组合：

1. **态度（disposition）**：-2..+2，决定交涉难度与情报多寡；
2. **目标（wants）**：驱动其自主行动 —— 派系推进 / 时钟推进时会用到；
3. **秘密（secret）**：可被线索揭示，揭示后往往改变态度或触发任务。

NPC 可以被**即兴生成**（Oracle 词表）也可以来自模组。生成时先问 ``ctx.lore``
拿取已确立事实，避免「同一个镇子的领主换了个名字」这类叙事事故。
"""
from __future__ import annotations

from typing import Optional

from d20.core import Service

from .contracts import NpcProfile
from .data_oracle import NPC_ROLES, NPC_TRAITS, NPC_WANTS
from .data_world import NPC_SURNAMES, NPC_GIVEN_NAMES


class NpcService(Service):
    """NPC 名册。挂到 ``ctx.npc``。"""

    inject = ["rng"]
    name = "npc"

    def __init__(self, ctx, config=None) -> None:  # noqa: D107
        super().__init__(ctx, config)
        self.npcs: dict[str, NpcProfile] = {}
        self._counter = 0

    # ------------------------------------------------------------------ #
    #  生成
    # ------------------------------------------------------------------ #
    def generate(self, place: str = "", faction: str = "",
                 role: str = "", name: str = "") -> NpcProfile:
        """即兴生成一个 NPC（可指定地点/派系/职业，未指定则随机）。"""
        rnd = self.ctx.rng.stream("world")
        self._counter += 1
        npc = NpcProfile(
            id=f"npc_{self._counter}",
            name=name or (rnd.choice(NPC_SURNAMES) + rnd.choice(NPC_GIVEN_NAMES)),
            role=role or rnd.choice(NPC_ROLES),
            faction=faction,
            place=place or (self.ctx.world.current if self.ctx.has("world") else ""),
            disposition=0,
            traits=[rnd.choice(NPC_TRAITS)],
            wants=rnd.choice(NPC_WANTS),
            secret="",
        )
        self.npcs[npc.id] = npc
        if self.ctx.has("log"):
            self.ctx.log.record("npc.new", actor=npc.id,
                                text=f"登场：{npc.name}（{npc.role}）",
                                payload={"name": npc.name, "role": npc.role,
                                         "place": npc.place, "faction": npc.faction},
                                tags=["npc"])
        return npc

    def add(self, npc: NpcProfile) -> NpcProfile:
        self.npcs[npc.id] = npc
        return npc

    # ------------------------------------------------------------------ #
    #  查询
    # ------------------------------------------------------------------ #
    def get(self, nid: str) -> Optional[NpcProfile]:
        return self.npcs.get(nid)

    def at(self, place: str) -> list[NpcProfile]:
        return [n for n in self.npcs.values() if n.place == place and n.alive]

    def by_faction(self, fid: str) -> list[NpcProfile]:
        return [n for n in self.npcs.values() if n.faction == fid and n.alive]

    def known(self) -> list[NpcProfile]:
        return [n for n in self.npcs.values() if n.met]

    def all(self) -> list[NpcProfile]:
        return list(self.npcs.values())

    def by_name(self, name: str) -> Optional[NpcProfile]:
        for n in self.npcs.values():
            if n.name == name:
                return n
        return None

    # ------------------------------------------------------------------ #
    #  变更
    # ------------------------------------------------------------------ #
    def meet(self, nid: str) -> Optional[NpcProfile]:
        npc = self.npcs.get(nid)
        if npc and not npc.met:
            npc.met = True
            if self.ctx.has("log"):
                self.ctx.log.record("npc.met", actor=nid,
                                    text=f"与 {npc.name} 打过照面了",
                                    payload={"name": npc.name}, tags=["npc"])
        return npc

    def adjust(self, nid: str, delta: int, reason: str = "") -> int:
        """调整态度（钳制在 -2..+2），返回新值。"""
        npc = self.npcs.get(nid)
        if not npc:
            return 0
        before = npc.disposition
        npc.disposition = max(-2, min(2, npc.disposition + int(delta)))
        if npc.disposition != before and self.ctx.has("log"):
            from .data_social import ATTITUDE_CN

            self.ctx.log.record(
                "faction.shift", actor=nid,
                text=f"{npc.name} 的态度：{ATTITUDE_CN.get(before, '?')} → "
                     f"{ATTITUDE_CN.get(npc.disposition, '?')}"
                     + (f"（{reason}）" if reason else ""),
                payload={"npc": nid, "from": before, "to": npc.disposition, "reason": reason},
                tags=["npc", "attitude"],
            )
        return npc.disposition

    def remember(self, nid: str, note: str) -> None:
        """记录一条备忘（NPC 的「记忆」，用于后续交涉与叙事一致性）。"""
        npc = self.npcs.get(nid)
        if npc:
            npc.notes.append(note)

    def reveal_secret(self, nid: str) -> str:
        npc = self.npcs.get(nid)
        if not npc or not npc.secret:
            return ""
        npc.notes.append(f"秘密暴露：{npc.secret}")
        return npc.secret

    def kill(self, nid: str) -> None:
        npc = self.npcs.get(nid)
        if npc:
            npc.alive = False

    # ------------------------------------------------------------------ #
    #  存档
    # ------------------------------------------------------------------ #
    def to_dict(self) -> dict:
        return {"npcs": {k: v.to_dict() for k, v in self.npcs.items()},
                "counter": self._counter}

    def load(self, data: dict) -> None:
        data = data or {}
        self.npcs = {k: NpcProfile.from_dict(v) for k, v in (data.get("npcs") or {}).items()}
        self._counter = int(data.get("counter", len(self.npcs)))


__all__ = ["NpcService"]
