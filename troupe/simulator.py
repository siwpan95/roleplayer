"""troupe.simulator - 跑团模拟器门面（L0.5 装配中枢）

``Simulator`` 是整套管层的**唯一入口**，类比 ``d20.Character`` 在规则引擎里的位置：
把分散的 Service 按依赖顺序挂进一个 Cordis ``Context``，持有队伍（``d20.Character`` 列表），
并把「导演 / 遭遇 / 智能体 / 渲染 / 存档」编排成一场可跑、可存、可复现的战役。

分层装配顺序（依赖在前）
------------------------
    rng → calendar → log → tables → lore → oracle → ruleset
       → world → npc → faction → quest → clock
       → director → encounter → agent

角色对象（``d20.Character``）自带各自的 d20 Cordis 上下文（属性/技能/装备/战斗…），
``ruleset`` 适配器读取其中的 ``char.ctx`` 把同一张卡翻译成 D&D 或 GURPS 判定语义 ——
因此**换规则集不需要重建角色卡**。
"""
from __future__ import annotations

from typing import Any, Optional

from d20 import Character
from d20.core import Context

from .composition import mount_troupe
from .contracts import (
    CampaignModule,
    Clock,
    FactionProfile,
    NpcProfile,
    Quest,
    SessionState,
)
from .render import render_campaign, render_scene


def _as_profile(value, cls):
    """模组数据里可能是 ``dict`` 或已构造的契约对象，统一成契约对象。"""
    if hasattr(value, "id"):
        return value
    return cls.from_dict(value)


class Simulator:
    """跑团模拟器。一句话跑完一场战役：

        sim = Simulator.quick(seed=42, ruleset="dnd5e")   # 随机三人队 + 最小世界
        sim.run(max_scenes=10)                            # 自动跑 10 场戏
        print(sim.render())                               # 看整份档案
        sim.save("save.json")                             # 存档
        sim2 = Simulator.load("save.json")                # 续跑
    """

    def __init__(self, seed: int = 0, ruleset: str = "dnd5e",
                 module: Optional[CampaignModule] = None,
                 party: Optional[list] = None, name: str = "冒险") -> None:
        self.ctx = Context()
        self.ctx.state = SessionState(seed=int(seed), ruleset=ruleset,
                                      module_id=module.id if module else "improvised")
        self.party: list = list(party or [])
        self.name = name

        # ---- 按 troupe 注册表装配（依赖在前，见 troupe/composition.py）----
        mount_troupe(self.ctx, seed=seed, ruleset=ruleset)

        if module is not None:
            self._load_module(module)
        else:
            self.ctx.world.ensure_default_world()

        if self.party:
            self._bind_party()

    # ================================================================== #
    #  队伍
    # ================================================================== #
    def add_party_member(self, char: Character, name: str = "") -> str:
        self.party.append(char)
        return self._bind_one(char, name, len(self.party) - 1)

    def explore_dungeon(self, seed: int = 0, width: int = 44, height: int = 18,
                        n_rooms: int = 6):
        """生成一张地牢空间地图并存进会话状态（``state.dungeon``）。

        返回 ``DungeonMap``；随后可用 ``render_dungeon(self)`` 渲染。
        同种子必得同一张图；地图随存档序列化（``DungeonMap.to_dict``）。
        """
        from .spatial import generate_dungeon

        dm = generate_dungeon(seed, width=width, height=height, n_rooms=n_rooms)
        self.ctx.state.dungeon = dm.to_dict()
        return dm

    def _bind_party(self, names: Optional[list] = None) -> None:
        for i, char in enumerate(self.party):
            nm = (names or [])[i] if names and i < len(names) else ""
            self._bind_one(char, nm, i)

    def _bind_one(self, char: Character, name: str = "", idx: int = 0) -> str:
        cls = getattr(getattr(char, "state", None), "cls", "") or "冒险者"
        key = name or f"{cls}{idx + 1}"
        self.ctx.director.bind(char, key)
        return key

    # ================================================================== #
    #  模组
    # ================================================================== #
    def _load_module(self, module: CampaignModule) -> None:
        self.ctx.world.load_module(module)
        for npc in module.npcs:
            self.ctx.npc.add(_as_profile(npc, NpcProfile))
        for f in module.factions:
            self.ctx.faction.add(_as_profile(f, FactionProfile))
        for q in module.quests:
            self.ctx.quest.add(_as_profile(q, Quest))
        for c in module.clocks:
            self.ctx.clock.add(_as_profile(c, Clock))
        for t in module.threads:
            text = t.text if hasattr(t, "text") else t.get("text", "")
            weight = getattr(t, "weight", 1) if hasattr(t, "weight") else t.get("weight", 1)
            self.ctx.oracle.add_thread(text, int(weight))
        self.ctx.state.module_id = module.id

    # ================================================================== #
    #  会话编排
    # ================================================================== #
    def plan_next(self) -> dict:
        return self.ctx.encounter.plan(self.ctx.state.scene_counter)

    def step(self) -> dict:
        """跑一场戏（探索/交涉/旅行/休整/战斗）并返回其结果。"""
        spec = self.plan_next()
        if spec.get("kind") == "combat":
            result = self.ctx.encounter.combat(self.party, spec.get("enemies", []))
        else:
            result = self.ctx.encounter.noncombat(spec)
        self.ctx.state.scene_counter += 1
        if self._party_wiped():
            self.ctx.state.finished = True
            self.ctx.state.ending = "全员阵亡"
        return result

    def run(self, max_scenes: int = 8, verbose: bool = True) -> SessionState:
        """自动跑完至多 ``max_scenes`` 场戏。"""
        self.ctx.state.finished = False
        self.ctx.log.record(
            "session.start",
            text=f"战役开始 · 规则 {self.ctx.state.ruleset} · 种子 {self.ctx.state.seed}",
            tags=["session"],
        )
        scenes = 0
        while not self.ctx.state.finished and scenes < max_scenes:
            spec = self.plan_next()
            kind = spec.get("kind")
            where = self.ctx.world.here().name if self.ctx.world.here() else "—"
            if verbose:
                print(f"── 第 {scenes + 1} 场：{spec.get('title', kind)}（{kind}）@ {where}")
            if kind == "combat":
                res = self.ctx.encounter.combat(self.party, spec.get("enemies", []))
                if verbose:
                    print(f"   战斗结果：{res.get('winner')} · {res.get('rounds')} 回合 · "
                          f"获得 {res.get('total_xp')} XP")
            else:
                self.ctx.encounter.noncombat(spec)
            scenes += 1
            self.ctx.state.scene_counter = scenes
            if self._party_wiped():
                self.ctx.state.finished = True
                self.ctx.state.ending = "全员阵亡"
                self.ctx.log.record("session.end", text="队伍全灭，战役终结。", tags=["session"])
                break
        if not self.ctx.state.finished:
            self.ctx.state.finished = True
            self.ctx.state.ending = "达到场景上限"
        self.ctx.log.record("session.end",
                            text=f"战役落幕 · 共 {scenes} 场 · 结局：{self.ctx.state.ending}",
                            tags=["session"])
        return self.ctx.state

    def _party_wiped(self) -> bool:
        party = self.ctx.director.party()
        if not party:
            return False
        return all(not self.ctx.ruleset.alive(p) for p in party)

    # ================================================================== #
    #  渲染 / 存档
    # ================================================================== #
    def render(self, log_n: int = 15) -> str:
        return render_campaign(self, log_n)

    def render_scene(self, scene) -> str:
        return render_scene(scene)

    def save(self, path: str) -> str:
        from .save import save_simulator

        return save_simulator(self, path)

    @classmethod
    def load(cls, path: str) -> "Simulator":
        from .save import load_simulator

        return load_simulator(path)

    # ================================================================== #
    #  便捷构造
    # ================================================================== #
    @classmethod
    def quick(cls, seed: int = 0, ruleset: str = "dnd5e",
              module: Optional[CampaignModule] = None,
              level: int = 3, count: int = 3) -> "Simulator":
        """快速开一局：随机 ``count`` 名 ``level`` 级队员 + 最小世界/模组。"""
        party = [Character.random(level, seed=(seed * 100 + i)) for i in range(count)]
        return cls(seed=seed, ruleset=ruleset, module=module, party=party)


__all__ = ["Simulator"]
