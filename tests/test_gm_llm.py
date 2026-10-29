"""tests.test_gm_llm — 离线 AI-GM 叙事层（gm_llm）单元测试

全部离线执行：不依赖 ollama_generator / Ollama 服务，用 StubBackend 验证
「文笔可用时叠加、不可用时回落启发式文本」的核心契约。
"""
import os
import sys

# 让测试能 import 仓库根下的 roleplayer 包（与 pytest 根目录一致时也可直接 import）
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from roleplayer.gm_llm import GM_SYSTEM, LLMNarrator, StubBackend


def test_stub_overrides_fallback():
    stub = StubBackend(reply="GM叙事：队伍推开石门，尘灰簌簌落下。")
    n = LLMNarrator(backend=stub)
    fb = "门后有敌人吗 → 成功（p=70%）"
    out = n.narrate_fate(
        {"answer": "yes", "p": 0.7, "question": "门后有敌人吗", "text": fb},
        context="地下城入口",
    )
    assert "石门" in out and out != fb


def test_empty_reply_falls_back():
    stub = StubBackend(reply="")  # 空回复 → 必须回落
    n = LLMNarrator(backend=stub)
    fb = "命运：失败（p=30%）"
    out = n.narrate_fate(
        {"answer": "no", "p": 0.3, "question": "q", "text": fb}, context="x"
    )
    assert out == fb


def test_backend_receives_prompt_and_system():
    stub = StubBackend(reply="ok")
    n = LLMNarrator(backend=stub)
    n.narrate_event(
        {"focus_cn": "NPC行动", "meaning": ["发现", "线索"], "twist": "", "text": "t"},
        context="幽暗洞穴",
    )
    assert stub.last_prompt and "幽暗洞穴" in stub.last_prompt
    assert stub.last_system == GM_SYSTEM


def test_backend_exception_falls_back():
    class Boom:
        def complete(self, prompt, system=""):
            raise RuntimeError("boom")

    n = LLMNarrator(backend=Boom())
    fb = "fallback text"
    out = n.narrate_fate(
        {"answer": "no", "p": 0.3, "question": "q", "text": fb}, context="c"
    )
    assert out == fb


def test_disabled_when_ollama_unavailable():
    # 默认后端 OllamaBackend 在 ollama_generator 缺失时 available=False → enabled=False
    n = LLMNarrator(model="qwen2.5:7b")
    fb = "启发式文本"
    # 即使 enabled 为 False，也保证回落且不抛错
    out = n.narrate_scene_check({"result": "normal", "text": fb}, context="营地")
    assert out == fb
