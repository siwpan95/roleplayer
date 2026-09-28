"""troupe HTTP API 端到端测试（真实 http.client 请求，非 mock）。"""
import http.client
import json
import threading

import pytest

from troupe.server import make_server


@pytest.fixture()
def port():
    """起一个随机端口的真实 HTTP 服务；每个测试重置服务端单实例战役。"""
    import troupe.server as S

    S._SIM = None                              # 隔离：不沿用上一测试的战役
    srv = make_server(0)
    t = threading.Thread(target=srv.serve_forever, daemon=True)
    t.start()
    yield srv.server_address[1]
    srv.shutdown()
    srv.server_close()
    S._SIM = None


def _req(port: int, method: str, path: str, body: dict | None = None):
    conn = http.client.HTTPConnection("127.0.0.1", port, timeout=15)
    headers = {"Content-Type": "application/json"} if body is not None else {}
    conn.request(method, path, body=json.dumps(body) if body is not None else None,
                 headers=headers)
    r = conn.getresponse()
    data = json.loads(r.read().decode("utf-8"))
    conn.close()
    return r.status, data


# =============================================================================
#  基础路由
# =============================================================================
def test_health(port):
    status, data = _req(port, "GET", "/health")
    assert status == 200 and data == {"ok": True}


def test_state_before_new_is_error(port):
    status, data = _req(port, "GET", "/state")
    assert status == 200
    assert data["ok"] is False and "尚无战役" in data.get("error", "")


# =============================================================================
#  开一局 + 单步
# =============================================================================
def test_new_creates_campaign(port):
    status, data = _req(port, "POST", "/new",
                        {"seed": 71, "ruleset": "dnd5e", "level": 3, "count": 2})
    assert status == 200 and data["ok"] is True
    assert data["meta"]["seed"] == 71
    assert len(data["party"]) == 2
    assert isinstance(data["log"], list)
    assert "stats" in data and "quests" in data and "clocks" in data


def test_step_advances_campaign(port):
    _req(port, "POST", "/new", {"seed": 72, "ruleset": "dnd5e", "level": 3, "count": 2})
    before = _req(port, "GET", "/state")[1]
    status, data = _req(port, "POST", "/step")
    assert status == 200 and data["ok"] is True
    assert "last_scene" in data
    assert data["stats"]["events"] >= before["stats"]["events"]


def test_step_without_new_auto_creates(port):
    status, data = _req(port, "POST", "/step", {"seed": 73, "ruleset": "dnd5e"})
    assert status == 200 and data["ok"] is True
    assert data["meta"]["seed"] == 73


def test_new_with_generated_module_has_world(port):
    status, data = _req(port, "POST", "/new",
                        {"seed": 74, "module": "generated", "ruleset": "dnd5e"})
    assert status == 200
    assert data["world"]["places"], "程序化模组应带来地点"
    assert data["quests"], "程序化模组应带来任务"


def test_export_returns_archive(port):
    _req(port, "POST", "/new", {"seed": 75, "ruleset": "dnd5e"})
    status, data = _req(port, "GET", "/export")
    assert status == 200
    assert data["meta"]["seed"] == 75
    assert isinstance(data["timeline"], list)


def test_unknown_route_404(port):
    status, data = _req(port, "GET", "/nope")
    assert status == 404 and data.get("error") == "not_found"
