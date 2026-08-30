"""troupe.encounter - 遭遇模式服务（L4）

这一层是「玩家要演什么戏」与「世界实际怎么跑」之间的**调度中枢**：

* **plan**：根据当前地点危险度、队伍等级、混沌因子，决定下一场戏是
  探索 / 交涉 / 旅行 / 休整 还是 战斗，并给出 ``SceneSpec``（战斗则给敌人编组）。
* **noncombat**：跑一场非战斗戏 —— 开场景 → 智能体逐节拍「提议行动」 →
  导演裁定并落地 → 收场景。所有状态变更都经由导演，保证回放/审计一致。
* **combat**：桥接 ``d20.battle`` 跑完整回合制对战（先攻/动作经济/伤害抗免/
  状态/死亡豁免/怪物 AI），把胜败与战利品回写模拟器状态。
* **trigger**：导演 ``apply`` 在遇到 ``effects["combat"]`` 时调用的统一入口。

设计边界（与 L3/L5 的分工）
--------------------------
* L4 只**提议与调度**，不写世界；写世界唯一发生在 L3 导演的 ``apply``。
* 非战斗戏的「每个节拍怎么打」由 L5 智能体 ``propose`` 决定，L4 负责把它串成一场戏。
* 战斗戏的「每个回合怎么打」由 ``d20.battle`` 自带的 PC/怪物 AI 决定，L4 只负责
  起手、等结果、收尾 —— 复用已在 v2.2 充分验证过的对战引擎，不重复造轮子。
"""
from __future__ import annotations

from typing import Any, Optional

from d20.core import Service

from .combat_gurps import run_gurps_combat
from . import data_social as social_data

from .contracts import (
    OUTCOME_IN_CONTROL,
    OUTCOME_OUT_OF_CONTROL,
    SCENE_KINDS,
    SceneSpec,
)


#: 地形 → 默认危险度（无地点数据时按地形推算旅行遭遇强度）
_TERRAIN_DANGER = {"道路": 1, "平原": 1, "森林": 2, "丘陵": 2, "山地": 3,
                   "沼泽": 3, "沙漠": 2, "水路": 1, "地下": 3}


class EncounterService(Service):
    """遭遇模式调度。挂到 ``ctx.encounter``。"""

    # agent/oracle/provisions：节拍循环提议行动、战斗后调混沌、旅行委托补给结算；
    # calendar 为历史冗余（时间推进发生在 provisions 内部）
    inject = ["ruleset", "world", "rng", "log", "director",
              "agent", "oracle", "provisions"]
    name = "encounter"

    # ------------------------------------------------------------------ #
    #  下一场戏规划
    # ------------------------------------------------------------------ #
    def plan(self, index: int = 0, force_kind: str = "") -> dict:
        """决定下一场戏的规格。

        :return: 非战斗 → ``{"kind", "title", "goal", "place", ...}``；
                 战斗   → ``{"kind": "combat", "enemies": [...], "place": ...}``
        """
        world = self.ctx.world
        place = world.here()
        danger = place.danger if place else 1
        here_id = world.current

        # 战斗概率随地点危险度上升
        p_combat = max(0.05, min(0.6, 0.12 + 0.10 * danger))
        if force_kind == "combat" or (force_kind == "" and self.ctx.rng.chance(p_combat, "world")):
            return self._plan_combat(here_id, danger)

        # 非战斗：按地点类型偏好一种模式
        kind = force_kind or self._pick_noncombat_kind(place)
        title_map = {
            "exploration": "勘察未知",
            "social": "与人交涉",
            "travel": "踏上旅途",
            "downtime": "短暂休整",
        }
        return {
            "kind": kind,
            "title": title_map.get(kind, "行动"),
            "goal": self._goal_for(kind, place),
            "place": here_id,
            "actors": list(self.ctx.director.roster().keys()),
            "tags": [kind],
            "max_beats": 4,
        }

    def _pick_noncombat_kind(self, place) -> str:
        kind = place.kind if place else "荒野"
        table = {
            "城镇": "social", "据点": "social", "建筑": "social",
            "遗迹": "exploration", "地牢": "exploration",
            "荒野": "exploration", "道路": "travel",
        }
        preferred = table.get(kind, "exploration")
        # 30% 概率插入一次休整，避免队伍永远在赶路
        if self.ctx.rng.chance(0.3, "world"):
            return "downtime"
        return preferred

    def _goal_for(self, kind: str, place) -> str:
        where = place.name if place else "此地"
        return {
            "exploration": f"在{with_where(where)}找到有用的线索或资源",
            "social": f"从{with_where(where)}的居民口中套出情报",
            "travel": f"安全抵达{with_where(where)}的下一站",
            "downtime": f"在{with_where(where)}恢复体力与补给",
        }.get(kind, "推进剧情")

    def _plan_combat(self, here_id: str, danger: int) -> dict:
        """按地形与等级抽一支遭遇编队。"""
        level = self._avg_party_level()
        terrain = self.ctx.world.here().kind if self.ctx.world.here() else "道路"
        size = max(1, min(5, danger + self.ctx.rng.d(1, "world") - 1))
        enemies: list[Any] = []
        for _ in range(size):
            name = self.ctx.tables.encounter(terrain, level)
            enemies.append(name)
        return {
            "kind": "combat",
            "mode": "combat",
            "title": "遭遇战斗",
            "goal": "击败来犯之敌",
            "place": here_id,
            "enemies": enemies,
            "distance": 60,
        }

    def _avg_party_level(self) -> int:
        party = self.ctx.director.party()
        if not party:
            return 1
        lv = [max(getattr(getattr(p, "state", None), "level", 1), 1) for p in party]
        return max(1, round(sum(lv) / len(lv)))

    def _party(self) -> list:
        party = self.ctx.director.party()
        return party or list(self.ctx.director.roster().values())

    # ------------------------------------------------------------------ #
    #  统一入口（导演 apply 的 effects["combat"] 调用）
    # ------------------------------------------------------------------ #
    def trigger(self, spec: dict) -> dict:
        """导演 ``apply`` 分发入口：战斗 → combat，否则 → noncombat。"""
        if isinstance(spec, dict) and spec.get("mode", spec.get("kind")) == "combat":
            enemies = spec.get("enemies") or []
            party = spec.get("party") or self._party()
            return self.combat(party, enemies, distance=int(spec.get("distance", 60)))
        return self.noncombat(spec)

    # ------------------------------------------------------------------ #
    #  非战斗戏
    # ------------------------------------------------------------------ #
    def noncombat(self, spec: dict) -> dict:
        """跑一场非战斗戏，返回收场后的 ``SceneState.to_dict()``。"""
        kind = spec.get("kind", "exploration")
        if kind not in SCENE_KINDS:
            kind = "exploration"
        scene_spec = SceneSpec(
            title=spec.get("title", "行动"),
            kind=kind,
            place=spec.get("place", self.ctx.world.current),
            goal=spec.get("goal", ""),
            actors=spec.get("actors") or list(self.ctx.director.roster().keys()),
            tags=spec.get("tags") or [kind],
        )
        self.ctx.director.start_scene(scene_spec)
        max_beats = int(spec.get("max_beats", 4))
        beats = 0

        # 社交场景：直接走反应检定子系统（data_social），不做通用节拍循环
        if kind == "social":
            res = self.social(spec, npc_id=spec.get("npc_id", ""))
            self.ctx.director.note(res.get("text", "交涉结束。"))
            ended = self.ctx.director.end_scene(OUTCOME_IN_CONTROL)
            return ended.to_dict() if ended else {}
        # 旅行场景：直接走补给/旅行结算（provisions），不做通用节拍循环
        if kind == "travel":
            res = self.travel(spec.get("distance_km", float(spec.get("distance", 30)) or 30),
                              pace=spec.get("pace", "常"), terrain=spec.get("terrain", "道路"))
            self.ctx.director.note(res.get("text", "旅行结束。"))
            ended = self.ctx.director.end_scene(OUTCOME_IN_CONTROL)
            return ended.to_dict() if ended else {}
        while self.ctx.director.current is not None and beats < max_beats:
            actor_name = self._next_actor()
            if not actor_name:
                break
            action = self.ctx.agent.propose(self.ctx.director.current, actor_name, kind=kind)
            if action is None:
                break
            self.ctx.director.resolve(action)
            beats += 1
            # 世界在玩家行动间隙悄悄转动：NPC 自主行动（低概率，若有装配）
            if self.ctx.has("agency"):
                try:
                    self.ctx.agency.tick(0.25)
                except Exception:
                    pass
        outcome = OUTCOME_IN_CONTROL if beats > 0 else OUTCOME_OUT_OF_CONTROL
        ended = self.ctx.director.end_scene(outcome)
        return ended.to_dict() if ended else {}

    def _next_actor(self) -> str:
        roster = self.ctx.director.roster()
        for name, obj in roster.items():
            try:
                if self.ctx.ruleset.alive(obj):
                    return name
            except Exception:
                return name
        return ""

    # ------------------------------------------------------------------ #
    #  战斗戏（桥接 d20.battle）
    # ------------------------------------------------------------------ #
    def combat(self, party: list, foes: list, distance: float = 60,
               max_rounds: int = 50) -> dict:
        """跑一场完整回合制对战，回写战利品/XP。

        **按规则集分派引擎**：``ruleset.id == "gurps"`` 走 ``troupe.combat_gurps`` 的 GURPS
        自有结算（3d6 掷低、主动防御三选一、部位、伤口倍率、休克/击倒）；其余（dnd5e/coc…）
        走 ``d20.battle``（已充分验证的 d20 对战引擎）。两者最终都回写同一份模拟器状态。
        """
        if not party:
            return {"error": "no_party", "winner": "none"}
        if self.ctx.ruleset.id == "gurps":
            result = self._combat_gurps(party, foes, distance, max_rounds)
        else:
            result = self._combat_dnd(party, foes, distance, max_rounds)

        # ---- 共享后处理：经验 / 战利品 / 日志 / 混沌 ----
        xp = int(result.get("total_xp", 0) or 0)
        self.ctx.state.total_xp += xp
        loot = {}
        if result.get("winner") == "party":
            loot = self.ctx.tables.loot("普通")
            self.ctx.state.gold += int(loot.get("gold", 0) or 0)

        report = result.get("report") or "战斗结束"
        self.ctx.log.record(
            "combat.end", text=report.splitlines()[0] if report else "战斗结束",
            payload={"winner": result.get("winner"), "rounds": result.get("rounds"),
                     "ruleset": self.ctx.ruleset.id, "xp": xp,
                     "gold": loot.get("gold", 0), "loot": loot.get("items", [])},
            tags=["combat"],
        )
        # 战斗触发后混沌轻微回落（掌控感）
        self.ctx.oracle.adjust_chaos(-1)
        return {
            "winner": result.get("winner"),
            "rounds": result.get("rounds"),
            "total_xp": xp,
            "gold": loot.get("gold", 0),
            "loot": loot.get("items", []),
            "report": report,
            "result": result,
        }

    def _combat_dnd(self, party: list, foes: list, distance: float,
                    max_rounds: int) -> dict:
        """D&D 路径：复用 ``d20.battle`` 自带的 AI 驱动对战。"""
        pc = party[0]
        pc.battle_create(party, foes, distance)
        result = pc.battle_run(max_rounds)
        report = pc.battle_report()
        result["report"] = report
        return result

    def _combat_gurps(self, party: list, foes: list, distance: float,
                      max_rounds: int) -> dict:
        """GURPS 路径：``troupe.combat_gurps.run_gurps_combat`` 驱动对战。"""
        return run_gurps_combat(
            party, foes, ruleset=self.ctx.ruleset, rng=self.ctx.rng,
            ctx=self.ctx, distance=distance, max_rounds=max_rounds,
        )

    # ------------------------------------------------------------------ #
    #  法术 / 旅行（委托 magic / provisions 服务）
    # ------------------------------------------------------------------ #
    def cast(self, spec: dict) -> dict:
        """施法入口：委托 ``ctx.magic``（按规则集分派 GURPS / D&D 路径）。

        ``spec`` 见 :meth:`troupe.magic.MagicService.cast`。
        """
        if not self.ctx.has("magic"):
            return {"ok": False, "reason": "no_magic_service"}
        return self.ctx.magic.cast(spec)

    def travel(self, distance_km: float, pace: str = "常", terrain: str = "道路",
               resolve_encounters: bool = True) -> dict:
        """旅行结算 **+ 途中遭遇真正落地**。

        先委托 ``ctx.provisions.travel`` 推进时间、消耗补给并掷出遭遇**次数**，
        再对每一次遭遇真正开一场戏（约七成战斗、三成路遇事件），写回世界与日志。
        此前遭遇只计数不落地（旅行永远风平浪静），本方法是真正的结算入口。

        :return: ``provisions`` 的结果，另加 ``battles``（战斗摘要）与 ``events``（路遇）。
        """
        party = self._party()
        size = len(party)
        res = self.ctx.provisions.travel(distance_km, pace=pace, terrain=terrain,
                                          party_size=size)
        res["battles"] = []
        res["events"] = []
        if resolve_encounters:
            for _ in range(int(res.get("encounters", 0) or 0)):
                out = self._travel_encounter(terrain)
                if out.get("kind") == "combat":
                    res["battles"].append(out)
                else:
                    res["events"].append(out)
        return res

    def _travel_encounter(self, terrain: str = "道路") -> dict:
        """途中的一次遭遇：战斗（按地形危险度抽编队）或路遇事件（随机表）。"""
        if self.ctx.rng.chance(0.7, "world"):
            spec = self._plan_combat(self.ctx.world.current, self._danger_here(terrain))
            out = self.combat(self._party(), spec.get("enemies", []), distance=60)
            return {"kind": "combat", "winner": out.get("winner"),
                    "xp": int(out.get("total_xp", 0) or 0),
                    "rounds": out.get("rounds"), "gold": int(out.get("gold", 0) or 0)}
        text = "途中有惊无险。"
        if self.ctx.has("tables"):
            ev = self.ctx.tables.travel_event()
            if ev:
                text = f"途中路遇：{ev}"
        self.ctx.log.record("travel", text=text,
                            payload={"kind": "travel_event", "terrain": terrain},
                            tags=["travel"])
        return {"kind": "event", "text": text}

    def _danger_here(self, terrain: str = "道路") -> int:
        """旅行中的危险度：优先取当前地点；无地点数据时按地形推算。"""
        place = self.ctx.world.here() if self.ctx.has("world") else None
        danger = int(getattr(place, "danger", 0) or 0) if place else 0
        return danger if danger > 0 else _TERRAIN_DANGER.get(terrain, 1)

    # ------------------------------------------------------------------ #
    #  社交反应（消费 data_social 的反应检定子系统）
    # ------------------------------------------------------------------ #
    def social(self, spec: dict, npc_id: str = "") -> dict:
        """跑一场交涉戏：对目标 NPC 做反应检定 → 态度位移。

        ``spec`` 可含 ``tactic``（话术）、``circumstances``（情境修正列表）、
        ``gift_gold``（贿赂金额）。返回 ``{"npc", "attitude_before/after",
        "shift", "text", "gold_spent", "fail_cost"}``。
        """
        npc = None
        if npc_id and self.ctx.has("npc"):
            npc = self.ctx.npc.get(npc_id) or self.ctx.npc.by_name(npc_id)
        if npc is None and self.ctx.has("npc"):
            npc = self.ctx.npc.random_one() if hasattr(self.ctx.npc, "random_one") else None
        if npc is None:
            return {"error": "no_npc", "attitude_before": 0, "attitude_after": 0,
                    "shift": 0, "text": "此处没有可交谈的对象。"}

        disp_before = int(getattr(npc, "disposition", 0) or 0)
        tactic = spec.get("tactic", "讲理")
        tactic_info = social_data.TACTICS.get(tactic, social_data.TACTICS["讲理"])
        circumstances = spec.get("circumstances", []) or []
        circ_mod = sum(social_data.CIRCUMSTANCE_MODS.get(c, 0) for c in circumstances)
        gold_spent = int(tactic_info.get("cost_gold", 0) or 0)

        # 反应检定：d20 + 2×态度 + 话术修正 + 情境修正（掷高；用规则域随机源）
        roll = self.ctx.rng.d(20, "world")
        total = roll + 2 * disp_before + int(tactic_info.get("mod", 0)) + circ_mod
        outcome = "中立"
        for thr, name in social_data.REACTION_THRESHOLDS:
            if total <= thr:
                outcome = name
                break
        shift = social_data.REACTION_SHIFT.get(outcome, 0)
        # 话术失败代价（如威胁失手）
        fail_cost = 0
        if shift <= 0 and tactic_info.get("fail_cost"):
            fail_cost = int(tactic_info["fail_cost"])
            shift += fail_cost

        disp_after = social_data.clamp_disposition(disp_before + shift)
        if self.ctx.has("npc"):
            self.ctx.npc.adjust(npc.id, disp_after - disp_before, reason=f"交涉/{tactic}")
        if gold_spent:
            self.ctx.state.gold = max(0, int(getattr(self.ctx.state, "gold", 0)) - gold_spent)

        text = (f"对 {npc.name}（{social_data.ATTITUDE_CN.get(disp_before, '中立')}）"
                f"使出「{tactic}」：d20={roll} + 态度{2*disp_before} "
                f"+ 话术{tactic_info.get('mod',0)} + 情境{circ_mod} = {total} "
                f"→ {outcome}，态度 {disp_before} → {disp_after}。")
        self.ctx.log.record("social.reaction", text=text,
                            payload={"npc": npc.id, "tactic": tactic,
                                     "attitude_before": disp_before,
                                     "attitude_after": disp_after, "shift": shift,
                                     "gold_spent": gold_spent},
                            tags=["social"])
        return {"npc": npc.id, "npc_name": npc.name, "tactic": tactic,
                "attitude_before": disp_before, "attitude_after": disp_after,
                "shift": shift, "outcome": outcome, "gold_spent": gold_spent,
                "fail_cost": fail_cost, "text": text}

    # ------------------------------------------------------------------ #
    #  存档（遭遇层本身无状态，留给导演/世界持有；此处仅占位）
    # ------------------------------------------------------------------ #
    def to_dict(self) -> dict:
        return {}

    def load(self, data: dict) -> None:  # noqa: D401
        return None


__all__ = ["EncounterService"]


def with_where(name: str) -> str:
    """给地名加合适量词。"""
    if not name:
        return "此地"
    return name
