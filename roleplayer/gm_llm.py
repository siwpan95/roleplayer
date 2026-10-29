"""roleplayer.gm_llm — 离线 AI-GM 叙事层（Tier ① MVP）

把本地 LLM（默认经 ``ollama_generator`` 走 Ollama）接到 ``troupe.oracle`` 的启发式
GM 之上：troupe.oracle 负责「机制」（命运概率、混沌因子、随机事件抽取），本模块负责
「文笔」（把 oracle 产出的结构化结果翻译成有画面感的叙事文本，或承接开放的 GM 应答）。

设计约束
--------
- **离线优先、零硬依赖**：``ollama_generator`` 缺失，或 Ollama 服务不可达/超时，自动
  回落到 oracle 自身给出的启发式文本（``dict["text"]``）——绝不抛错，也绝不改变
  确定性模拟的结果。
- **后端可插拔**：``Backend`` 协议 + ``OllamaBackend``（默认，本地 LLM）/ ``StubBackend``
  （测试用）。日后可把 ``weor`` 的 Ollama 适配器或任何 OpenAI 兼容端点接成新后端。
- **不改动** ``troupe.oracle`` 的任何逻辑，只在它产出的结构化结果上叠加叙事。

用法
----
    from roleplayer.gm_llm import LLMNarrator
    from troupe import Simulator, get_module

    narrator = LLMNarrator(model="qwen2.5:7b")   # 无 ollama_generator 时自动回落
    sim = Simulator.quick(seed=7, ruleset="dnd5e",
                          module=get_module("border_shrine"), level=3, count=3)
    fate = sim.ctx.oracle.fate("门后有人吗", odds="不太可能")
    print(narrator.narrate_fate(fate, context=sim.ctx.state.summary()))
    # 若要真正联网，请确保：pip install ollama_generator 且本机 ollama serve 已起。
"""
from __future__ import annotations

from typing import Optional, Protocol, runtime_checkable

TIMEOUT_S = 30.0

# oracle.fate 的 answer 枚举 → 中文
_FATE_CN = {
    "yes": "成功", "no": "失败",
    "exceptional_yes": "大成功", "exceptional_no": "大失败",
    "random_event": "随机事件",
}

GM_SYSTEM = (
    "你是一位桌面角色扮演游戏（TRPG）的地下城主（GM）。用简洁、有画面感的中文"
    "描写当下情境，不超过 80 字，不要替玩家做决定，不要输出任何系统标记或代码。"
)


@runtime_checkable
class Backend(Protocol):
    """LLM 后端契约：给定 prompt（+ 可选 system）返回文本。"""

    def complete(self, prompt: str, system: str = "") -> str:  # pragma: no cover - 接口
        ...


class StubBackend:
    """测试 / 离线演示用：不联网，返回固定或占位的叙事文本。"""

    def __init__(self, reply: Optional[str] = None) -> None:
        self.reply = reply
        self.last_prompt: Optional[str] = None
        self.last_system: str = ""

    def complete(self, prompt: str, system: str = "") -> str:
        self.last_prompt = prompt
        self.last_system = system
        if self.reply is not None:
            return self.reply
        return "（stub 叙事）"


class OllamaBackend:
    """默认后端：本地 Ollama，经 ``ollama_generator.OllamaTextGenerator``。"""

    def __init__(self, model: str = "qwen2.5:7b", timeout: float = TIMEOUT_S) -> None:
        self.model = model
        self.timeout = timeout
        self._gen = None
        self._err: Optional[str] = None
        try:
            from ollama_generator import OllamaTextGenerator
            self._gen = OllamaTextGenerator(model=model)
        except Exception as e:  # 缺失 / 导入失败 → 标记，complete 直接回空（触发回落）
            self._err = f"ollama_generator 不可用：{e}"

    @property
    def available(self) -> bool:
        return self._gen is not None

    def complete(self, prompt: str, system: str = "") -> str:
        if not self.available:
            return ""
        try:
            return (self._gen.generate(prompt) or "").strip()
        except Exception:
            return ""


class LLMNarrator:
    """LLM 叙事层：把 oracle 的结构化结果 / 开放问题翻译成叙事文本。"""

    def __init__(self, backend: Optional[Backend] = None,
                 model: str = "qwen2.5:7b") -> None:
        self.backend = backend or OllamaBackend(model=model)

    # ---- 是否有 LLM 在线（决定走文笔还是回落） ----
    @property
    def enabled(self) -> bool:
        b = self.backend
        if isinstance(b, OllamaBackend):
            return b.available
        return True  # StubBackend 等测试 / 自定义后端视为可用

    # ---- 命运问答 ----
    def narrate_fate(self, fate_dict: dict, context: str = "") -> str:
        ans = fate_dict.get("answer", "")
        p = fate_dict.get("p", 0.5)
        q = fate_dict.get("question", "")
        fb = fate_dict.get("text", "")
        prompt = (
            f"情境：{context}\n"
            f"玩家的问题是：「{q or '（未指明）'}」\n"
            f"规则判定结果：{_FATE_CN.get(ans, ans)}（基础概率 {p:.0%}）。\n"
            f"请以 GM 口吻描写这一判定带来的具体画面。"
        )
        return self._safe(prompt, fb)

    # ---- 场景开局检查 ----
    def narrate_scene_check(self, check_dict: dict, context: str = "") -> str:
        result = check_dict.get("result", "")
        fb = check_dict.get("text", "")
        label = {"normal": "一切如预期展开", "altered": "出现了意外变故",
                 "interrupted": "被突发事件打断"}
        prompt = (
            f"情境：{context}\n"
            f"场景开局判定：{label.get(result, result)}。\n"
            f"请以 GM 口吻描写这一幕的起始氛围。"
        )
        return self._safe(prompt, fb)

    # ---- 随机事件 ----
    def narrate_event(self, event_dict: dict, context: str = "") -> str:
        fb = event_dict.get("text", "")
        focus = event_dict.get("focus_cn", event_dict.get("focus", ""))
        meaning = event_dict.get("meaning", []) or []
        twist = event_dict.get("twist", "")
        prompt = (
            f"情境：{context}\n"
            f"触发随机事件【{focus}】：{('、'.join(meaning)) if meaning else '未知'}。"
            f"{(' ' + twist) if twist else ''}\n"
            f"请以 GM 口吻把这件事演成一段具体的遭遇开场。"
        )
        return self._safe(prompt, fb)

    # ---- 开放 GM 应答 ----
    def gm_ask(self, question: str, context: str = "", history=None) -> str:
        hist = "\n".join(history or [])
        prompt = (
            f"战役背景：{context}\n"
            f"对话历史：\n{hist}\n"
            f"玩家：{question}\nGM："
        )
        return self._safe(prompt, f"（GM 沉思片刻）{question}")

    # ---- 内部：统一回落 ----
    def _safe(self, prompt: str, fallback: str) -> str:
        if not self.enabled:
            return fallback
        try:
            out = self.backend.complete(prompt, system=GM_SYSTEM)
        except Exception:
            return fallback
        return out if out else fallback


__all__ = ["LLMNarrator", "Backend", "OllamaBackend", "StubBackend", "GM_SYSTEM"]
