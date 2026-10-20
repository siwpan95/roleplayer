"""troupe.save - 战役持久化（L6）

把一场进行中的战役**完整落盘**，并保证同一种子 + 同一存档能**确定性续跑**：

* ``ctx.state``（SessionState）+ 各 Service 的 ``to_dict``（世界/派系/NPC/任务/时钟/
  混沌/已确立事实/导演场景/事件流）+ ``rng`` 五域随机流快照；
* 队伍成员用 ``roleplayer.character_io.to_full_dict`` 序列化为完整角色状态，加载时原样重建；
* 事件流（``log``）一并保存，使战报 / 回放 / 审计可追溯。

``migrate`` 按 ``SCHEMA_VERSION`` 执行迁移链：旧版本存档在读入时自动补齐缺失字段，
避免「换了个版本就打不开旧战役」。
"""
from __future__ import annotations

import json
import random
from typing import Any, Optional

from roleplayer.character_io import character_from_dict, to_full_dict

from .contracts import SCHEMA_VERSION, SessionState


def _grng_snapshot() -> str:
    """全局 random 模块状态（战斗桥接 roleplayer.battle 消费它）。存档时一并记录，
    载入后续跑才能精确复现战斗。"""
    import base64
    import pickle

    return base64.b64encode(pickle.dumps(random.getstate())).decode("ascii")


def _grng_restore(blob: str) -> None:
    import base64
    import pickle

    random.setstate(pickle.loads(base64.b64decode(blob)))


def _services_to_dict(ctx) -> dict:
    out: dict[str, Any] = {}
    for name in ("calendar", "world", "npc", "faction", "quest",
                 "clock", "oracle", "lore", "director", "encounter", "ruleset"):
        svc = ctx._services.get(name)
        if svc is None:
            continue
        try:
            if name == "ruleset":
                out[name] = {"id": svc.id, "config": dict(getattr(svc.adapter, "config", {}))}
            else:
                out[name] = svc.to_dict()
        except Exception:
            out[name] = {}
    return out


def _load_services(ctx, services: dict) -> None:
    for name, data in (services or {}).items():
        svc = ctx._services.get(name)
        if svc is None or data is None:
            continue
        try:
            if name == "ruleset":
                continue  # 规则集在 Simulator 构造时已按 id 装配
            svc.load(data)
        except Exception:
            pass


def save_simulator(sim: Any, path: str) -> str:
    """把 ``Simulator`` 序列化为 JSON 文件，返回路径。"""
    data = {
        "schema": SCHEMA_VERSION,
        "state": sim.ctx.state.to_dict(),
        "rng": sim.ctx.rng.snapshot(),
        "grng": _grng_snapshot(),
        "services": _services_to_dict(sim.ctx),
        "actors": [to_full_dict(c) for c in sim.party],
        "actor_names": list(sim.ctx.director.roster().keys()),
        "module_id": sim.ctx.state.module_id,
        # 事件流 + 动作序列：战报/回放/审计的原料（此前只写在文档里，实际没落盘）
        "log": sim.ctx.log.to_dict() if sim.ctx.has("log") else [],
        "actions": (sim.ctx.log.actions_to_dict() if sim.ctx.has("log") else []),
    }
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return path


def load_simulator(path: str) -> Any:
    """从 JSON 文件重建 ``Simulator``（延迟导入避免循环依赖）。"""
    from .simulator import Simulator

    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    data = migrate(data)

    state = SessionState.from_dict(data["state"])
    # 先按保存的规则集/种子构造（模块在 load 时不再强加，世界随后被存档覆盖）
    sim = Simulator(seed=state.seed, ruleset=state.ruleset, module=None,
                    party=None, name="载入的战役")
    sim.ctx.state.load(data["state"])
    sim.ctx.rng.restore(data["rng"])
    if data.get("grng"):
        _grng_restore(data["grng"])
    _load_services(sim.ctx, data.get("services", {}))
    # 还原事件流与动作序列（先还原，保证 seq 连续，再补载入事件）
    if sim.ctx.has("log"):
        if data.get("log"):
            sim.ctx.log.load(data["log"])
        if data.get("actions"):
            sim.ctx.log.load_actions(data["actions"])
    # 重建队伍
    sim.party = [character_from_dict(a) for a in (data.get("actors") or [])]
    sim._bind_party(data.get("actor_names"))
    sim.ctx.log.record("session.start", text="（从存档载入战役）",
                       payload={"restored_events": len(data.get("log") or []),
                                "restored_actions": len(data.get("actions") or []),
                                "migrated_from": data.get("migrated_from") or []},
                       tags=["session"])
    return sim


def _vtuple(v: str) -> tuple:
    """把 ``"1.10"`` 解析成 ``(1, 10)``，避免字符串比较把 1.10 判成小于 1.9。"""
    parts = []
    for p in str(v or "0").split("."):
        try:
            parts.append(int(p))
        except ValueError:
            parts.append(0)
    return tuple(parts) or (0,)


def migrate(data: dict) -> dict:
    """按 ``SCHEMA_VERSION`` 执行**真实生效**的迁移链（此前是空操作占位，
    且会无条件把 schema 覆写成当前版本、静默丢弃旧版本号）。

    迁移历史写入 ``migrated_from``，便于排查「哪份存档从哪个版本升上来」。
    """
    data = dict(data)
    version = str(data.get("schema") or "1.0")
    history = list(data.get("migrated_from") or [])
    explicit = data.get("schema") is not None
    if not explicit:
        history.append("(no-schema)")     # 极早期存档连版本号都没有

    if _vtuple(version) < _vtuple("1.1"):
        data = _migrate_1_0_to_1_1(data)
        if explicit:                      # 缺失版本号时只记 (no-schema)，不重复记 1.0
            history.append(version)

    data["schema"] = SCHEMA_VERSION
    if history:
        data["migrated_from"] = history
    # 兜底：确保必要顶层键存在
    data.setdefault("actors", [])
    data.setdefault("actor_names", [])
    data.setdefault("services", {})
    data.setdefault("state", {})
    data.setdefault("log", [])
    data.setdefault("actions", [])
    return data


def _migrate_1_0_to_1_1(data: dict) -> dict:
    """1.0 → 1.1：补事件流/动作序列，并给任务、时钟补上新增字段。

    1.0 的存档没有 ``log`` / ``actions``（文档声称保存了但实际没落盘），
    也没有任务依赖/期限与时钟 ``consumed`` —— 这里补齐，使旧存档能正常读入。
    """
    data.setdefault("log", [])
    data.setdefault("actions", [])
    services = data.get("services")
    if isinstance(services, dict):
        quests = services.get("quest")
        if isinstance(quests, dict):
            for q in quests.values():
                if not isinstance(q, dict):
                    continue
                q.setdefault("depends_on", [])
                q.setdefault("deadline_minutes", 0)
                q.setdefault("started_minute", 0)
                q.setdefault("fail_condition", "")
        clocks = services.get("clock")
        if isinstance(clocks, dict):
            for c in clocks.values():
                if not isinstance(c, dict):
                    continue
                c.setdefault("consumed", False)
    return data


__all__ = ["save_simulator", "load_simulator", "migrate", "_migrate_1_0_to_1_1"]
