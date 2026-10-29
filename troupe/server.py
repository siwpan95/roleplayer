"""troupe.server - 跑团模拟器 HTTP API（零依赖，标准库 http.server）

让模拟器离开命令行：Web 端「跑团战役面板」通过本 API 实时开一局。

路由
----
* ``GET  /health``   → ``{"ok": true}``
* ``POST /new``      → 按 ``{seed, ruleset, module, level, count, name}`` 新建战役
* ``POST /step``     → 跑一场戏（探索/交涉/旅行/休整/战斗），返回最新状态
* ``GET  /state``    → 当前战役完整状态（队伍/任务/时钟/世界/最近日志）
* ``GET  /export``   → 战役档案 JSON（与 ``troupe.export.export_json`` 同构）

服务端在内存中持有**单实例**战役（``_SIM``），带线程锁；CORS 全开，供
本地 Web 前端直连。状态结构复用 ``troupe.export.build_archive``，保证与
档案导出同一份取数逻辑。

启动：``python troupe/server.py``（或 ``python -m troupe.server``）。
"""
from __future__ import annotations

import json
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any, Optional

#: 服务端单实例战役（线程锁保护）
_SIM: Any = None
_LOCK = threading.Lock()

DEFAULT_PORT = 8765


def _build_sim(spec: dict) -> Any:
    """按请求规格新建一场战役。"""
    from roleplayer import Character

    from .modules import generate_module, get_module
    from .simulator import Simulator

    seed = int(spec.get("seed", 0) or 0)
    ruleset = str(spec.get("ruleset", "dnd5e") or "dnd5e")
    level = max(1, int(spec.get("level", 3) or 3))
    count = max(1, min(6, int(spec.get("count", 2) or 2)))
    module_id = str(spec.get("module", "") or "")
    name = str(spec.get("name", "") or "网络战役")

    module = None
    if module_id == "generated":
        module = generate_module(seed, module_id="generated")
    elif module_id == "border_shrine":
        module = get_module("border_shrine")
    party = [Character.random(level, seed=seed + i) for i in range(count)]
    return Simulator(seed=seed, ruleset=ruleset, module=module,
                     party=party, name=name)


def _state(sim: Any) -> dict:
    """当前战役状态（队伍/任务/时钟/世界/最近日志 + 档案统计）。"""
    from .export import build_archive

    arch = build_archive(sim)
    log = [{"seq": e.seq, "ts": str(getattr(e, "ts", "") or ""),
            "type": e.type, "text": e.text}
           for e in sim.ctx.log.tail(30)]
    return {"ok": True, "meta": arch["meta"], "party": arch["party"],
            "quests": arch["quests"], "clocks": arch["clocks"],
            "world": arch["world"], "log": log, "stats": arch["stats"]}


def new_sim(spec: Optional[dict] = None) -> dict:
    """新建战役（线程安全）。"""
    global _SIM
    with _LOCK:
        _SIM = _build_sim(dict(spec or {}))
        return _state(_SIM)


def step_sim(spec: Optional[dict] = None) -> dict:
    """跑一场戏并返回最新状态（无战役时先按 spec 新建）。"""
    global _SIM
    with _LOCK:
        if _SIM is None:
            _SIM = _build_sim(dict(spec or {}))
        res = _SIM.step()
        state = _state(_SIM)
        keys = ("kind", "winner", "outcome", "rounds", "total_xp",
                "gold", "days", "hours", "encounters", "text")
        state["last_scene"] = {k: res.get(k) for k in keys if k in res}
        return state


def state_of() -> dict:
    """当前战役状态。"""
    global _SIM
    with _LOCK:
        if _SIM is None:
            return {"ok": False, "error": "尚无战役，先 POST /new"}
        return _state(_SIM)


def export_of() -> str:
    """战役档案 JSON（与 export_json 同构）。"""
    from .export import export_json

    global _SIM
    with _LOCK:
        if _SIM is None:
            return json.dumps({"error": "no_sim"}, ensure_ascii=False)
        return export_json(_SIM)


class _Handler(BaseHTTPRequestHandler):
    """请求处理：JSON 进出 + CORS。"""

    def _cors(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(204)
        self._cors()
        self.end_headers()

    def _send(self, obj: Any, code: int = 200) -> None:
        data = obj if isinstance(obj, str) else json.dumps(obj, ensure_ascii=False)
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self._cors()
        self.end_headers()
        self.wfile.write(data.encode("utf-8"))

    def _body(self) -> dict:
        try:
            n = int(self.headers.get("Content-Length", 0) or 0)
            return json.loads(self.rfile.read(n) or b"{}") if n else {}
        except Exception:
            return {}

    def do_GET(self) -> None:  # noqa: N802
        if self.path.startswith("/health"):
            return self._send({"ok": True})
        if self.path.startswith("/state"):
            return self._send(state_of())
        if self.path.startswith("/export"):
            return self._send(export_of())
        self._send({"error": "not_found"}, 404)

    def do_POST(self) -> None:  # noqa: N802
        body = self._body()
        if self.path.startswith("/new"):
            return self._send(new_sim(body))
        if self.path.startswith("/step"):
            return self._send(step_sim(body))
        self._send({"error": "not_found"}, 404)

    def log_message(self, *args: Any) -> None:  # 静默访问日志
        return None


def make_server(port: int = DEFAULT_PORT) -> ThreadingHTTPServer:
    """构造服务器（测试可拿到句柄后自行 shutdown）。"""
    return ThreadingHTTPServer(("127.0.0.1", port), _Handler)


def run_server(port: int = DEFAULT_PORT) -> None:
    """阻塞运行（入口用）。"""
    srv = make_server(port)
    print(f"troupe server listening on http://127.0.0.1:{port}  (Ctrl+C 退出)")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        srv.server_close()


__all__ = ["make_server", "run_server", "new_sim", "step_sim", "state_of",
           "export_of", "DEFAULT_PORT"]


if __name__ == "__main__":  # pragma: no cover
    run_server()
