"""troupe.director - 叙事导演（L3 中枢）

分层边界
--------
L3 与 L4 的分工用一句话说清：

* **L4 遭遇模式**（``exploration`` / ``social`` / ``travel`` / ``encounter`` /
  ``downtime``）负责**提议**：构造 ``Action``，并声明「成功了会怎样、失败了会怎样」
  （``payload["on_success"]`` / ``payload["on_fail"]``）。
* **L3 导演**负责**裁定与落地**：掷骰判定成败 → 生成 :class:`Consequence` →
  把 ``effects`` 分发到各个 Service 真正改世界。

这样「谁提议」和「谁改世界」彻底分离，带来三个好处：

1. 所有状态变更集中在 ``apply()`` 一处，回放 / 审计 / 难度调参只需动这一层；
2. 智能体（L5）永远无法直接写世界，作弊与状态不一致在架构上被杜绝；
3. 同一份 L4 提议可以换不同的导演策略（宽松 / 严苛 / 纯随机）而不改 L4 代码。

导演还承担场景生命周期（``start_scene`` / ``note`` / ``end_scene``）与
随机事件翻译（``interpret_event``）—— 把 Oracle 给出的「焦点 + 意义词」
翻译成「新 NPC 出现 / 派系声望 -1 / 危险时钟 +1」这类可执行的世界变更。
"""
from __future__ import annotations

from typing import Any, Optional

from roleplayer.core import Service

from .contracts import (
    OUTCOME_IN_CONTROL,
    OUTCOME_OUT_OF_CONTROL,
    SCENE_ALTERED,
    SCENE_INTERRUPTED,
    SCENE_KIND_CN,
    SCENE_NORMAL,
    Action,
    Consequence,
    SceneSpec,
    SceneState,
)

#: 行动种类。导演按 ``Action.kind`` 路由到对应的后续处理。
ACTION_KINDS = (
    "exploration",   # 探索 / 搜索 / 勘察
    "social",        # 交涉 / 询价 / 威胁
    "travel",        # 行军 / 导航 / 扎营
    "combat",        # 战斗（交由 L4 encounter 桥接 roleplayer.battle）
    "downtime",      # 休整 / 采购 / 打探
    "lore",          # 回忆知识 / 辨识
    "custom",        # 模组自定义
)

#: 场景检查结果 → 中文
SCENE_CHECK_CN = {
    SCENE_NORMAL: "如预期",
    SCENE_ALTERED: "有变故",
    SCENE_INTERRUPTED: "被打断",
}

#: 大成功 / 大失败对混沌因子的影响
CRIT_CHAOS = {"crit": -1, "crit_fail": 1}


class DirectorService(Service):
    """叙事导演。挂到 ``ctx.director``。"""

    # world/quest：移动与发现写世界、任务目标/线索推进；rng：锚点叙事按 narrative 域抽模板
    inject = ["rng", "calendar", "log", "oracle", "tables", "ruleset", "world", "quest"]
    name = "director"

    def __init__(self, ctx, config=None) -> None:  # noqa: D107
        super().__init__(ctx, config)
        #: 角色注册表：名字 → 角色对象（Character）。运行时引用，不进存档。
        self._roster: dict[str, Any] = {}
        self._scenes: list[SceneState] = []
        self._current: Optional[SceneState] = None
        self._counter = 0
        #: 宽松度：>1 判定更易成功，<1 更严苛。调难度只动这一个旋钮。
        self.leniency = float(self.config.get("leniency", 1.0))
        #: 订阅「时钟填满」——此前 ``clock/full`` 零订阅者，后果只停留在日志文本里
        self.ctx.on("clock/full", self._on_clock_full)

    # ================================================================== #
    #  角色注册表（roster）
    # ================================================================== #
    def bind(self, actor: Any, name: str = "") -> str:
        """登记一个角色，返回其名字。"""
        key = name or self.ctx.ruleset.describe(actor)
        self._roster[key] = actor
        return key

    def bind_all(self, actors) -> list[str]:
        return [self.bind(a) for a in actors]

    def actor(self, name: str) -> Any:
        return self._roster.get(name)

    def roster(self) -> dict:
        return dict(self._roster)

    def party(self) -> list:
        """仍存活的角色对象列表。"""
        out = []
        for obj in self._roster.values():
            try:
                if self.ctx.ruleset.alive(obj):
                    out.append(obj)
            except Exception:
                out.append(obj)
        return out

    # ================================================================== #
    #  场景生命周期
    # ================================================================== #
    def start_scene(self, spec: SceneSpec) -> SceneState:
        """开一幕：先做场景检查（如预期 / 有变故 / 被打断），再登记状态。"""
        self._counter += 1
        check = self.ctx.oracle.check_scene()
        state = SceneState(
            id=f"S{self._counter:03d}",
            spec=spec,
            started_at=self.ctx.calendar.snapshot_time(),
            chaos=self.ctx.oracle.chaos,
            check=check["result"],
            beats=[],
            ended_at=None,
            outcome="",
        )
        self._scenes.append(state)
        self._current = state
        self.ctx.calendar.set_scene(state.id)

        kind_cn = SCENE_KIND_CN.get(spec.kind, spec.kind)
        self.ctx.log.record(
            "scene.start",
            text=f"【{state.id}】{kind_cn}：{spec.title}"
                 f"（场景检查：掷 {check['roll']} vs 混沌 {check['chaos']} → "
                 f"{SCENE_CHECK_CN[check['result']]}）",
            payload={"scene_id": state.id, "kind": spec.kind, "goal": spec.goal,
                     "check": check["result"]},
            tags=["scene", spec.kind],
        )
        self.ctx.emit("scene/start", state)

        # 场景检查的即时后果：变故 → 追加一个节拍；打断 → 直接塞一个随机事件
        if check["result"] == SCENE_ALTERED:
            self.note("场景与预期有出入 —— 细节已经变了。", tags=["scene"])
        elif check["result"] == SCENE_INTERRUPTED:
            ev = self.inject_event(spec.kind, context=spec.goal)
            self.note(f"场景被打断：{ev['text']}", tags=["scene", "interrupt"])
        return state

    def note(self, text: str, tags: Optional[list] = None) -> None:
        """记一个叙事节拍（挂在当前场景上）。"""
        if self._current is not None:
            self._current.beats.append(text)
        self.ctx.log.record("scene.note", text=text, tags=list(tags or []))

    def end_scene(self, outcome: str = OUTCOME_IN_CONTROL) -> Optional[SceneState]:
        """收一幕。失控结局会推高混沌，掌控结局会压低混沌。"""
        if self._current is None:
            return None
        st = self._current
        st.ended_at = self.ctx.calendar.snapshot_time()
        st.outcome = outcome
        self._current = None
        self.ctx.calendar.set_scene("")
        self.ctx.oracle.adjust_chaos(1 if outcome == OUTCOME_OUT_OF_CONTROL else -1)
        self.ctx.log.record(
            "scene.end",
            text=f"【{st.id}】落幕（{'失控' if outcome == OUTCOME_OUT_OF_CONTROL else '掌控'}，"
                 f"混沌 → {self.ctx.oracle.chaos}）",
            payload={"scene_id": st.id, "outcome": outcome,
                     "beats": len(st.beats)},
            tags=["scene"],
        )
        self.ctx.emit("scene/end", st)
        return st

    @property
    def current(self) -> Optional[SceneState]:
        return self._current

    def scene(self, sid: str) -> Optional[SceneState]:
        for s in self._scenes:
            if s.id == sid:
                return s
        return None

    def scenes(self) -> list[SceneState]:
        return list(self._scenes)

    # ================================================================== #
    #  裁定：Action → Consequence
    # ================================================================== #
    def adjudicate(self, action: Action) -> Consequence:
        """裁定一次行动提议，返回可落地的后果（**不调用 apply**）。

        调用方可先审查 ``Consequence`` 再决定是否 ``apply`` —— 这让「导演提议、
        人类 GM 复核」的交互模式成为可能。
        """
        req = action.request
        if req is None:
            # 无检定行动：直接成立（时间推移由 payload 声明）
            effects = dict(action.payload.get("effects") or {})
            narrative = action.payload.get("narrative") or f"{action.actor} {action.verb}。"
            return Consequence(ok=True, narrative=narrative, effects=effects)

        actor_obj = self.actor(action.actor)
        if actor_obj is None:
            raise KeyError(f"actor not bound to director: {action.actor!r}")

        # 宽松度作用在检定修正上（只影响成败，不影响掷骰序列本身）
        if self.leniency != 1.0:
            req = _with_modifier(req, int(round((self.leniency - 1.0) * 5)))
        # 环境标签：天气对检定的修正（环境即第一个 NPC——暴雨难行、浓雾难辨）
        if self.ctx.has("world"):
            try:
                env = self.ctx.world.weather_mod() or {}
                env_mod = int(env.get("nav_mod", 0) or 0)
                if env_mod:
                    req = _with_modifier(req, env_mod)
            except Exception:
                pass
        result = self.ctx.ruleset.check(actor_obj, req)
        self.ctx.log.check(action.actor, result, req.label or action.verb)

        # L4 声明的成功 / 失败后果
        branch = action.payload.get("on_success") if result.success \
            else action.payload.get("on_fail")
        effects = dict(branch or {})
        effects.update(self._critical_effects(result, action))

        narrative = result.text or self._default_narrative(action, result)
        con = Consequence(ok=result.success, narrative=narrative, effects=effects)
        # 允许 L4 / 模组通过 waterfall 钩子改写后果（难定制的最后一公里）
        con = self.ctx.waterfall("director/consequence", con, action, result)
        return con

    def _critical_effects(self, result, action: Action) -> dict:
        """大成功 / 大失败的附加后果（混沌 + 额外收益/代价）。"""
        out: dict = {}
        crit = result.critical
        if crit == "crit":
            out["chaos"] = out.get("chaos", 0) + CRIT_CHAOS["crit"]
            if action.kind == "exploration":
                out.setdefault("xp", 0)
                out["xp"] = out["xp"] + 10
        elif crit == "crit_fail":
            out["chaos"] = out.get("chaos", 0) + CRIT_CHAOS["crit_fail"]
            if action.kind == "exploration":
                out.setdefault("clock", {})
                out["clock"]["danger"] = out["clock"].get("danger", 0) + 1
        return out

    def _default_narrative(self, action: Action, result) -> str:
        """兜底叙事：从锚点查表（``data_narrative``）按结果类型抽模板。

        模板池是固定数据（结构归数据），同类型结果的**具体说法**由
        ``narrative`` 随机域抽取（变数归随机）——两层分离，可扩展可测试。
        """
        from .data_narrative import NARRATIVE_ANCHORS, anchor_key

        pool = NARRATIVE_ANCHORS.get(anchor_key(result))
        if pool:
            tpl = self.ctx.rng.stream("narrative").choice(pool)
            return tpl.format(actor=action.actor, verb=action.verb)
        tail = "成功" if result.success else "失败"
        return f"{action.actor} {action.verb}：{tail}（{result.degree()}）。"

    def resolve(self, action: Action) -> tuple[Consequence, dict]:
        """裁定 **并** 落地。返回 ``(Consequence, apply 回执)``。"""
        con = self.adjudicate(action)
        receipt = self.apply_consequence(con)
        self.note(con.narrative, tags=[action.kind])
        # 记录动作提议：事件流说「世界变成了什么样」，动作序列说「当时想做什么」
        if self.ctx.has("log"):
            try:
                self.ctx.log.record_action(action, receipt)
            except Exception:
                pass
        return con, receipt

    # ================================================================== #
    #  落地：Consequence.effects → 各 Service
    # ================================================================== #
    def apply_consequence(self, con: Consequence) -> dict:
        """把后果写进世界。**这是全系统唯一应该改世界状态的地方之一**。

        :return: 回执 ``{"applied": {键: 摘要}, "skipped": [键...]}``
        """
        eff = con.effects or {}
        applied: dict[str, Any] = {}
        skipped: list[str] = []

        # --- 时间 ---
        if eff.get("time"):
            self.ctx.calendar.advance(int(eff["time"]), reason="行动耗时")
            applied["time"] = eff["time"]

        # --- 休息（休整场景：全队按规则集恢复 HP/FP）---
        if eff.get("rest"):
            rest_kind = eff["rest"] if isinstance(eff["rest"], str) else "long"
            for obj in self.party():
                try:
                    self.ctx.ruleset.rest(obj, rest_kind)
                except Exception:
                    pass
            applied["rest"] = rest_kind

        # --- 伤害 / 治疗 / 状态 ---
        for name, amount in (eff.get("damage") or {}).items():
            obj = self.actor(name)
            if obj is None:
                skipped.append(f"damage:{name}")
                continue
            dtype = amount[1] if isinstance(amount, (list, tuple)) else "钝击"
            pts = amount[0] if isinstance(amount, (list, tuple)) else amount
            self.ctx.ruleset.damage(obj, int(pts), dtype)
            applied.setdefault("damage", {})[name] = pts
        for name, amount in (eff.get("heal") or {}).items():
            obj = self.actor(name)
            if obj is None:
                skipped.append(f"heal:{name}")
                continue
            self.ctx.ruleset.heal(obj, int(amount))
            applied.setdefault("heal", {})[name] = amount
        for name, conds in (eff.get("condition") or {}).items():
            obj = self.actor(name)
            if obj is None:
                skipped.append(f"condition:{name}")
                continue
            for c in conds:
                _apply_condition(self.ctx, obj, c)
            applied.setdefault("condition", {})[name] = list(conds)

        # --- 位置 ---
        if eff.get("move_to"):
            self.ctx.world.move_to(eff["move_to"])
            applied["move_to"] = eff["move_to"]
        for pid in (eff.get("discovery") or []):
            self.ctx.world.discover(pid)
            applied.setdefault("discovery", []).append(pid)

        # --- 任务 / 线索 ---
        for qid, objmap in (eff.get("quest") or {}).items():
            for oid, done in (objmap or {}).items():
                if done:
                    self.ctx.quest.complete_objective(qid, oid)
            applied.setdefault("quest", {})[qid] = list(objmap or {})
        for cid in (eff.get("clue") or []):
            for q in self.ctx.quest.active():
                self.ctx.quest.reveal_clue(q.id, cid)
            applied.setdefault("clue", []).append(cid)

        # --- 时钟 ---
        # 键可以是具体时钟 id，也可以是逻辑名（danger/exploration/campaign/faction）。
        # 逻辑名按 kind 解析到模组里的真实时钟，避免「失败探索」打到孤儿时钟上。
        for key, seg in (eff.get("clock") or {}).items():
            clock = self.ctx.clock.get(key)
            if clock is None:
                matches = self.ctx.clock.by_kind(key)
                clock = matches[0] if matches else None
            if clock is None:
                clock = self.ctx.clock.create(key, key, 6, "danger", "危机爆发")
            self.ctx.clock.tick(clock.id, int(seg))
            applied.setdefault("clock", {})[key] = seg

        # --- 派系 / NPC ---
        for fid, delta in (eff.get("faction") or {}).items():
            self.ctx.faction.adjust(fid, int(delta), reason=con.narrative)
            applied.setdefault("faction", {})[fid] = delta
        for nid, patch in (eff.get("npc") or {}).items():
            if isinstance(patch, dict):
                delta = int(patch.get("disposition", 0))
                if patch.get("new"):
                    self.ctx.npc.generate(name=nid)
            else:
                delta = int(patch)
            if delta:
                self.ctx.npc.adjust(nid, delta, reason=con.narrative)
            applied.setdefault("npc", {})[nid] = patch

        # --- 收益 ---
        if eff.get("xp"):
            self.ctx.state.total_xp = int(getattr(self.ctx.state, "total_xp", 0)) + int(eff["xp"])
            applied["xp"] = eff["xp"]
        if eff.get("gold"):
            self.ctx.state.gold = int(getattr(self.ctx.state, "gold", 0)) + int(eff["gold"])
            applied["gold"] = eff["gold"]
        if eff.get("loot"):
            applied["loot"] = eff["loot"]

        # --- 混沌 ---
        if eff.get("chaos"):
            self.ctx.oracle.adjust_chaos(int(eff["chaos"]))
            applied["chaos"] = eff["chaos"]

        # --- 线索（thread）增删 ---
        for t in (eff.get("thread_add") or []):
            self.ctx.oracle.add_thread(t)
            applied.setdefault("thread_add", []).append(t)
        for t in (eff.get("thread_close") or []):
            self.ctx.oracle.close_thread(t)
            applied.setdefault("thread_close", []).append(t)

        # --- 战斗请求：交给 L4 encounter 处理 ---
        if eff.get("combat"):
            spec = eff["combat"] if isinstance(eff["combat"], dict) else {}
            applied["combat"] = self._raise_combat(spec)

        self.ctx.emit("director/applied", con, applied)
        return {"applied": applied, "skipped": skipped}

    def _raise_combat(self, spec: dict) -> dict:
        """把 effects["combat"] 交给 L4 遭遇层（若已装配）。

        ``effects["combat"]`` 是战斗规格（{"enemies": [...], "party"?, "distance"?}），
        直接桥接 ``encounter.combat`` —— 不要走 ``encounter.trigger``，后者按
        ``mode/kind=="combat"`` 路由，会把纯敌人规格误判成非战斗戏。
        """
        if not self.ctx.has("encounter"):
            self.ctx.log.record("combat.request", text="触发战斗，但未装配 encounter 服务。",
                                payload=spec, tags=["combat"])
            return {"handled": False}
        enemies = spec.get("enemies") or []
        party = spec.get("party") or self.ctx.director.party() \
            or list(self.ctx.director.roster().values())
        distance = int(spec.get("distance", 60))
        return self.ctx.encounter.combat(party, enemies, distance=distance)

    def _on_clock_full(self, clock: Any) -> dict:
        """时钟填满 → **后果真正落地**（``clock/full`` 的唯一消费者）。

        ``ClockService.tick`` 广播该事件，但过去没有任何订阅者，压力只作为一行日志
        文本存在。此处按时钟类型把「看不见的压力」兑现为真实世界变更：

        * ``danger``   → 麻烦找上门：抽编队后真的开一场遭遇
        * ``campaign`` → 主线推进：混沌 +2（不可挽回）
        * ``faction``  → 派系反制：所有派系态度 -1
        * 其他         → 记录 ``consequence`` 文本

        兑现后**清空该时钟**，避免同一压力反复触发。
        """
        cid = str(getattr(clock, "id", "") or "")
        name = str(getattr(clock, "name", "") or "时钟")
        kind = str(getattr(clock, "kind", "") or "")
        consequence = str(getattr(clock, "consequence", "") or "")
        detail: dict = {"clock": cid, "name": name, "kind": kind}
        text = f"【{name}】已满"

        if kind == "danger":
            spec = {}
            if self.ctx.has("encounter"):
                try:
                    spec = self.ctx.encounter.plan(force_kind="combat")
                except Exception:
                    spec = {}
            res = self._raise_combat(spec) if spec else {}
            winner = (res or {}).get("winner")
            detail["combat"] = {"winner": winner, "xp": int((res or {}).get("total_xp", 0) or 0)}
            text += f" → 麻烦找上门，遭遇{'结束（' + str(winner) + '）' if winner else '触发'}"
        elif kind == "campaign":
            if self.ctx.has("oracle"):
                self.ctx.oracle.adjust_chaos(2)
            detail["chaos"] = 2
            text += " → 主线不可挽回地推进（混沌 +2）"
        elif kind == "faction":
            shifted = 0
            if self.ctx.has("faction"):
                try:
                    for f in self.ctx.faction.all():
                        self.ctx.faction.adjust(f.id, -1, reason=f"时钟【{name}】到期")
                        shifted += 1
                except Exception:
                    pass
            detail["faction_shift"] = -1 if shifted else 0
            detail["factions_affected"] = shifted
            text += f" → 派系反制（{shifted} 个派系态度 -1）"
        else:
            text += f" → {consequence}" if consequence else " → 后果兑现"

        self.ctx.log.record("clock.consequence", target=cid, text=text,
                            payload=detail, tags=["clock", "consequence"])
        self.ctx.emit("clock/consequence", clock, detail)
        # 标记「后果已兑现」而非清空：``clock.tick`` 对已满时钟本就不再推进/再广播，
        # 因此不会重复触发；而「已满」这个既成事实要留给任务失败条件去读。
        if self.ctx.has("clock"):
            c = self.ctx.clock.get(cid)
            if c is not None:
                c.consumed = True
        return detail

    # ================================================================== #
    #  随机事件翻译
    # ================================================================== #
    def inject_event(self, scene_kind: str = "exploration", context: str = "") -> dict:
        """掷一个随机事件，并立刻把它翻译成世界变更。"""
        ev = self.ctx.oracle.random_event(scene_kind, context)
        con = self.interpret_event(ev)
        receipt = self.apply_consequence(con)
        self.note(con.narrative, tags=["event", ev["focus"]])
        ev["consequence"] = con.to_dict()
        ev["applied"] = receipt["applied"]
        return ev

    def interpret_event(self, ev: dict) -> Consequence:
        """把 Oracle 的「焦点 + 意义词」翻译成具体后果。

        这是 GM 模拟器最容易做成「随机噪音」的一步。翻译原则：

        * 每个焦点都必须落到**世界里有名字的东西**上（NPC / 派系 / 时钟 / 任务），
          而不是留下一句「发生了奇怪的事」；
        * 翻译出的后果要能被后续场景消费 —— 新 NPC 要登记进 ``ctx.npc``，
          推进线索要真的 tick 任务目标或战役时钟。
        """
        focus = ev.get("focus", "current_context")
        target = ev.get("target", "")
        meaning = ev.get("meaning") or []
        verb = meaning[0] if meaning else "变动"
        noun = meaning[1] if len(meaning) > 1 else "局势"
        desc = ev.get("descriptor", "")

        handler = getattr(self, f"_ev_{focus}", None)
        if handler is None:
            return Consequence(ok=True,
                               narrative=f"{desc}{verb}的{noun}悄然发生。",
                               effects={})
        return handler(target, verb, noun, desc)

    # --- 各焦点的具体翻译 ---
    def _ev_new_npc(self, target, verb, noun, desc) -> Consequence:
        npc = self.ctx.npc.generate()
        self.ctx.npc.meet(npc.id)
        return Consequence(
            ok=True,
            narrative=f"一个陌生人出现了：{npc.name}（{npc.role}）——{desc}{verb}的{noun}。",
            effects={"npc": {npc.id: {"new": True, "disposition": 0}},
                     "thread_add": [f"{npc.name}的来意"]},
        )

    def _ev_npc_negative(self, target, verb, noun, desc) -> Consequence:
        nid = self._npc_id_by_name(target)
        eff: dict = {"clock": {"danger": 1}, "chaos": 1}
        if nid:
            eff["npc"] = {nid: {"disposition": -1}}
        return Consequence(ok=True,
                           narrative=f"{target or '某个 NPC'}采取了不利举动：{desc}{verb}的{noun}。",
                           effects=eff)

    def _ev_npc_positive(self, target, verb, noun, desc) -> Consequence:
        nid = self._npc_id_by_name(target)
        eff: dict = {"chaos": -1}
        if nid:
            eff["npc"] = {nid: {"disposition": 1}}
        return Consequence(ok=True,
                           narrative=f"{target or '某个 NPC'}伸出援手：{desc}{verb}的{noun}。",
                           effects=eff)

    def _ev_npc_action(self, target, verb, noun, desc) -> Consequence:
        nid = self._npc_id_by_name(target)   # 缺这行会在该分支触发时 NameError
        eff: dict = {"thread_add": [f"{target or '某人'}：{verb}{noun}"]}
        if nid:
            eff["npc"] = {nid: {"disposition": 0}}
        return Consequence(ok=True,
                           narrative=f"{target or '某个 NPC'}有所行动：{desc}{verb}的{noun}。",
                           effects=eff)

    def _ev_pc_negative(self, target, verb, noun, desc) -> Consequence:
        victims = [self.ctx.ruleset.describe(a) for a in self.party()[:1]]
        eff: dict = {"chaos": 1}
        if victims:
            eff["damage"] = {victims[0]: (2, "钝击")}
        return Consequence(ok=True,
                           narrative=f"队伍蒙受损失：{desc}{verb}的{noun}。",
                           effects=eff)

    def _ev_pc_positive(self, target, verb, noun, desc) -> Consequence:
        loot = self.ctx.tables.loot("微弱")
        return Consequence(ok=True,
                           narrative=f"队伍时来运转：{desc}{verb}的{noun}。",
                           effects={"chaos": -1, "gold": loot["gold"], "loot": loot["items"]})

    def _ev_move_toward_thread(self, target, verb, noun, desc) -> Consequence:
        return Consequence(ok=True,
                           narrative=f"线索推进：{target or '主线'}——{desc}{verb}的{noun}。",
                           effects={"clock": {"campaign": 1}, "chaos": -1})

    def _ev_move_away_thread(self, target, verb, noun, desc) -> Consequence:
        return Consequence(ok=True,
                           narrative=f"线索偏离：{target or '主线'}被岔开——{desc}{verb}的{noun}。",
                           effects={"chaos": 1, "thread_add": [f"岔路：{noun}"]})

    def _ev_close_thread(self, target, verb, noun, desc) -> Consequence:
        tid = ""
        for t in self.ctx.oracle.open_threads():
            if t.text == target:
                tid = t.id
                break
        eff: dict = {"chaos": -1}
        if tid:
            eff["thread_close"] = [tid]
        return Consequence(ok=True,
                           narrative=f"线索收束：{target or '一条线索'}画上句点——{desc}{verb}的{noun}。",
                           effects=eff)

    def _ev_remote_event(self, target, verb, noun, desc) -> Consequence:
        rumor = self.ctx.tables.rumor()
        return Consequence(ok=True,
                           narrative=f"远方传来消息：{rumor}",
                           effects={"thread_add": [f"传闻：{rumor}"]})

    def _ev_ambiguous_event(self, target, verb, noun, desc) -> Consequence:
        return Consequence(ok=True,
                           narrative=f"一个含义不明的征兆：{desc}{verb}的{noun}。",
                           effects={"thread_add": [f"征兆：{verb}{noun}"]})

    def _ev_current_context(self, target, verb, noun, desc) -> Consequence:
        comp = self.ctx.tables.complication()
        return Consequence(ok=True,
                           narrative=f"局面陡生枝节：{comp}",
                           effects={"chaos": 1, "clock": {"danger": 1}})

    # ------------------------------------------------------------------ #
    def _npc_id_by_name(self, name: str) -> str:
        if not name or not self.ctx.has("npc"):
            return ""
        npc = self.ctx.npc.by_name(name)
        return npc.id if npc else ""

    # ================================================================== #
    #  存档
    # ================================================================== #
    def to_dict(self) -> dict:
        return {
            "counter": self._counter,
            "leniency": self.leniency,
            "scenes": [s.to_dict() for s in self._scenes],
            "current_id": self._current.id if self._current else "",
        }

    def load(self, data: dict) -> None:
        data = data or {}
        self._counter = int(data.get("counter", 0))
        self.leniency = float(data.get("leniency", 1.0))
        self._scenes = [SceneState.from_dict(s) for s in (data.get("scenes") or [])]
        cid = data.get("current_id") or ""
        self._current = self.scene(cid)


# ===================================================================== #
#  模块级辅助
# ===================================================================== #
def _with_modifier(req, delta: int):
    """返回一份 ``modifier`` 已调整的请求副本（不改原对象，避免污染回放）。"""
    import dataclasses

    return dataclasses.replace(req, modifier=req.modifier + delta)


def _apply_condition(ctx, actor, cond: str) -> None:
    """给角色挂一个状态。``d20`` 有 condition 服务时走它，否则直接写 state。"""
    try:
        ctx.condition.apply(actor, cond)
        return
    except Exception:
        pass
    st = getattr(actor, "state", actor)
    conds = getattr(st, "conditions", None)
    if isinstance(conds, dict):
        conds[cond] = True
    elif isinstance(conds, list) and cond not in conds:
        conds.append(cond)


__all__ = ["DirectorService", "ACTION_KINDS", "SCENE_CHECK_CN"]
