"""troupe.oracle - GM 模拟器核心（L3）

没有真人 DM 时，谁来决定「门后面有没有人」？答案是这一个服务。它提供 GM 的
三个基本功：

1. **命运问答**（``fate``）：把是非问句按可能性档 + 混沌因子折算成概率；
2. **场景检查**（``check_scene``）：这一幕按预期演、有变故、还是被彻底打断；
3. **随机事件**（``random_event``）：当答案是「随机事件」时，抽事件焦点 + 意义词，
   交给导演翻译成具体的世界变更。

混沌因子（1..9）是全局的「局势失控程度」：玩家顺风顺水 → 混沌下降；
处处碰壁 → 混沌上升。它同时决定了后续场景更容易被打断、问题更难得到肯定答复，
于是形成自然的叙事起伏，而不需要剧本。

概率模型见 ``troupe.data_oracle``（logit 平移，自研，非任何商业产品表格）。
"""
from __future__ import annotations

from typing import Optional

from d20.core import Service

from . import data_oracle as O
from .contracts import SCENE_ALTERED, SCENE_INTERRUPTED, SCENE_NORMAL, Thread


class OracleService(Service):
    """GM 模拟器。挂到 ``ctx.oracle``。"""

    inject = ["rng"]
    name = "oracle"

    def __init__(self, ctx, config=None) -> None:  # noqa: D107
        super().__init__(ctx, config)
        self.threads: list[Thread] = []
        self._thread_counter = 0

    # ------------------------------------------------------------------ #
    #  混沌因子
    # ------------------------------------------------------------------ #
    @property
    def chaos(self) -> int:
        return self.ctx.state.chaos

    def set_chaos(self, value: int) -> int:
        self.ctx.state.chaos = O.clamp_chaos(value)
        return self.ctx.state.chaos

    def adjust_chaos(self, delta: int) -> int:
        return self.set_chaos(self.ctx.state.chaos + int(delta))

    # ------------------------------------------------------------------ #
    #  命运问答
    # ------------------------------------------------------------------ #
    def fate(self, question: str = "", odds: str = "五五开",
             base_p: Optional[float] = None) -> dict:
        """问一个是非问题。

        :param odds: 可能性档（``data_oracle.ODDS_TIERS`` 之一）
        :param base_p: 直接给基础概率（优先于 ``odds``）
        :return: ``{"answer", "roll", "p", "random_event", "text"}``
        """
        p = float(base_p if base_p is not None else O.ODDS_BASE.get(odds, 0.5))
        actual = O.fate_probability(p, self.chaos)
        roll = self.ctx.rng.stream("oracle").random()
        event_chance = O.RANDOM_EVENT_CHANCE.get(self.chaos, 0.1)
        span = max(1.0 - event_chance, 1e-6)
        band = O.EXCEPTIONAL_BAND

        if roll < event_chance:
            answer, success = O.FATE_RANDOM_EVENT, False
        else:
            pos = (roll - event_chance) / span          # 去掉事件区间后的位置 [0,1)
            if pos < actual:
                success = True
                # 成功区内极靠前 → 异常肯定
                answer = O.FATE_EXCEPTIONAL_YES if pos < actual * band else O.FATE_YES
            else:
                success = False
                # 失败区内极靠后 → 异常否定
                answer = O.FATE_EXCEPTIONAL_NO if pos >= 1 - band else O.FATE_NO

        out = {
            "question": question, "odds": odds, "chaos": self.chaos,
            "base_p": p, "p": actual, "roll": round(roll, 4),
            "answer": answer, "success": success,
            "random_event": answer == O.FATE_RANDOM_EVENT,
            "text": f"{question or '提问'} → {O.FATE_CN[answer]}"
                    f"（p={actual:.0%}，混沌 {self.chaos}）",
        }
        if self.ctx.has("log"):
            self.ctx.log.record("oracle.fate", text=out["text"],
                                payload={k: out[k] for k in
                                         ("question", "odds", "p", "roll", "answer")},
                                tags=["oracle"])
        return out

    # ------------------------------------------------------------------ #
    #  场景检查
    # ------------------------------------------------------------------ #
    def check_scene(self) -> dict:
        """场景开局掷骰：如预期 / 有变故 / 被打断。

        规则：掷 d10，``>`` 混沌 → 如预期；``==`` 混沌 → 有变故；``<`` 混沌 → 被打断。
        """
        roll = self.ctx.rng.stream("oracle").randint(1, O.SCENE_CHECK_DIE)
        if roll > self.chaos:
            result = SCENE_NORMAL
        elif roll == self.chaos:
            result = SCENE_ALTERED
        else:
            result = SCENE_INTERRUPTED
        out = {"result": result, "roll": roll, "chaos": self.chaos}
        if self.ctx.has("log"):
            self.ctx.log.record("scene.check",
                                text=f"场景检查：掷 {roll} vs 混沌 {self.chaos} → "
                                     f"{ {'normal': '如预期', 'altered': '有变故', 'interrupted': '被打断'}[result] }",
                                payload=out, tags=["oracle", "scene"])
        return out

    # ------------------------------------------------------------------ #
    #  随机事件
    # ------------------------------------------------------------------ #
    def random_event(self, scene_kind: str = "exploration",
                     context: str = "") -> dict:
        """掷一个随机事件：焦点 + 目标 + 意义词。

        导演负责把结果翻译成具体的世界变更（新 NPC / 推进线索 / 队伍受损…）。
        """
        rnd = self.ctx.rng.stream("oracle")
        focus = self.ctx.rng.weighted([(k, w) for k, _, w in O.EVENT_FOCUS],
                                      domain="oracle")
        meaning = list(self.ctx.tables.theme_words(scene_kind, 2)) \
            if self.ctx.has("tables") else []
        if not meaning:
            meaning = [rnd.choice(O.ACTION_VERBS), rnd.choice(O.ACTION_NOUNS)]
        descriptor = rnd.choice(O.DESCRIPTORS)
        # 意义细化：补上「谁做的」（主体）与低概率的「但…」（转折）
        subject = rnd.choice(O.MEANING_SUBJECTS)
        twist = rnd.choice(O.MEANING_TWISTS) if rnd.random() < 0.35 else ""

        target = self._target_for_focus(focus)
        out = {
            "focus": focus,
            "focus_cn": O.EVENT_FOCUS_CN.get(focus, focus),
            "target": target,
            "meaning": meaning,
            "descriptor": descriptor,
            "subject": subject,
            "twist": twist,
            "context": context,
            "text": f"随机事件【{O.EVENT_FOCUS_CN.get(focus, focus)}】"
                    + (f"：{target}" if target else "")
                    + f" —— {subject}{descriptor}{meaning[0]}的{meaning[1]}"
                    + (f"，{twist}" if twist else ""),
        }
        if self.ctx.has("log"):
            self.ctx.log.record("oracle.event", text=out["text"],
                                payload=out, tags=["oracle", "event"])
        return out

    def _target_for_focus(self, focus: str) -> str:
        """按焦点类型取一个具名目标（NPC / 线索 / 队伍）。"""
        if focus in ("npc_action", "npc_negative", "npc_positive"):
            if self.ctx.has("npc"):
                cands = [n for n in self.ctx.npc.all() if n.alive]
                if cands:
                    return self.ctx.rng.pick(cands, domain="oracle").name
            if self.ctx.has("npc"):
                return self.ctx.npc.generate().name
        if focus in ("move_toward_thread", "move_away_thread", "close_thread"):
            if self.threads:
                return self.pick_thread().text
        return ""

    # ------------------------------------------------------------------ #
    #  线索（Threads）
    # ------------------------------------------------------------------ #
    def add_thread(self, text: str, weight: int = 1) -> Thread:
        text = (text or "").strip()
        if text:
            # 幂等：已存在相同且未关闭的线索则不重复写入，收敛多轮社交/探索产生的重复线索
            for t in self.threads:
                if t.status == "open" and t.text == text:
                    return t
        self._thread_counter += 1
        t = Thread(id=f"thread_{self._thread_counter}", text=text, weight=max(1, min(3, weight)))
        self.threads.append(t)
        return t

    def open_threads(self) -> list[Thread]:
        return [t for t in self.threads if t.status == "open"]

    def pick_thread(self) -> Thread:
        """按权重抽一条未关闭的线索（无则临时造一条）。"""
        opens = self.open_threads()
        if not opens:
            return self.add_thread("不明势力的动向")
        pairs = [(t, t.weight) for t in opens]
        return self.ctx.rng.weighted(pairs, domain="oracle")

    def close_thread(self, tid: str) -> None:
        for t in self.threads:
            if t.id == tid:
                t.status = "closed"

    # ------------------------------------------------------------------ #
    #  存档
    # ------------------------------------------------------------------ #
    def to_dict(self) -> dict:
        return {"threads": [t.to_dict() for t in self.threads],
                "counter": self._thread_counter}

    def load(self, data: dict) -> None:
        data = data or {}
        self.threads = [Thread.from_dict(t) for t in (data.get("threads") or [])]
        self._thread_counter = int(data.get("counter", len(self.threads)))


__all__ = ["OracleService"]
