"""troupe.composition - 服务注册表（troupe 作用域内）

把 ``Simulator`` 里原本硬编码的挂载清单抽成一份**声明式注册表**，与 d20 基类的
``loader.DEFAULT_SERVICE_ENTRIES`` 同构（id / service / inject），但只登记 troupe 自有服务、
不反向依赖 d20 基类——从而保持「troupe 依赖 d20，而非 d20 依赖 troupe」的单向分层。

权威来源是同级目录下的 ``composition.yml``（数据驱动、可人工编辑、d20 loader 也读它做软挂载）；
本模块导入时读取 YAML 得到 ``DEFAULT_TROUPE_ENTRIES``（``service`` 字段保留为字符串），
类对象在 :func:`mount_troupe` / d20 loader 挂载时按字符串解析。YAML 缺失/损坏时回退到内联清单。

**类解析用显式注册表**（``_SERVICE_CLASSES``），而非运行时 ``importlib`` 盲解析：
troupe 包在 ``__init__`` 里把 composition 放在**最后**导入，因此本模块体执行时所有服务类已就绪，
直接引用即可，彻底规避「部分初始化的缓存模块缺类」这类循环导入陷阱。d20 loader 软挂载 troupe
时也优先复用这里的 :func:`resolve_service`，保证同一份权威解析逻辑。

``Simulator`` 通过 :func:`mount_troupe` 按依赖顺序把注册表里的服务挂进 Cordis ``Context``。
运行时想增删 / 重排服务，只改 ``composition.yml`` 即可，无需碰 ``Simulator`` 的装配逻辑；
想内省当前已注册了哪些服务，调 :func:`available_troupe_services`。
"""
from __future__ import annotations

import importlib
import os

from d20.core import Context
from d20.loader import load_yaml

# composition.yml 与本文件同目录；service 用字符串登记（来自 YAML / 兜底清单）
_COMPOSE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "composition.yml")

# ---- 显式类注册表（import 时所有服务类均已就绪，无循环导入风险）----
# 这里直接 import 全部服务类；composition 在 troupe/__init__ 中最后导入，
# 故 rng/calendar/.../world/agent 全部可用。WorldService 即便尚未被 __init__ 显式导入，
# 在此处触发导入也不会产生环（world 不反向依赖 composition/simulator）。
from .agent import AgentService
from .calendar import CalendarService
from .clock import ClockService
from .encounter import EncounterService
from .faction import FactionService
from .log import LogService
from .lore import LoreService
from .magic import MagicService
from .npc import NpcService
from .provisions import ProvisionService
from .oracle import OracleService
from .quest import QuestService
from .random_tables import RandomTableService
from .rng import RngService
from .ruleset_service import RulesetService
from .director import DirectorService
from .world import WorldService
from .npc_agency import NpcAgencyService

_SERVICE_CLASSES: dict[str, type] = {
    "troupe.rng.RngService": RngService,
    "troupe.calendar.CalendarService": CalendarService,
    "troupe.clock.ClockService": ClockService,
    "troupe.log.LogService": LogService,
    "troupe.lore.LoreService": LoreService,
    "troupe.npc.NpcService": NpcService,
    "troupe.faction.FactionService": FactionService,
    "troupe.quest.QuestService": QuestService,
    "troupe.random_tables.RandomTableService": RandomTableService,
    "troupe.oracle.OracleService": OracleService,
    "troupe.ruleset_service.RulesService": RulesetService,
    "troupe.director.DirectorService": DirectorService,
    "troupe.encounter.EncounterService": EncounterService,
    "troupe.agent.AgentService": AgentService,
    "troupe.world.WorldService": WorldService,
    "troupe.magic.MagicService": MagicService,
    "troupe.provisions.ProvisionService": ProvisionService,
    "troupe.npc_agency.NpcAgencyService": NpcAgencyService,
}

# 内联兜底清单（与 composition.yml 镜像）：仅当 composition.yml 缺失/损坏时启用，
# 保证无 YAML 也能装配。正式注册以 composition.yml 为准。
_FALLBACK_ENTRIES: list[dict] = [
    {"id": "rng", "service": "troupe.rng.RngService", "inject": []},
    {"id": "calendar", "service": "troupe.calendar.CalendarService", "inject": []},
    {"id": "log", "service": "troupe.log.LogService", "inject": ["calendar"]},
    {"id": "tables", "service": "troupe.random_tables.RandomTableService", "inject": ["rng"]},
    {"id": "lore", "service": "troupe.lore.LoreService", "inject": ["calendar"]},
    {"id": "oracle", "service": "troupe.oracle.OracleService", "inject": ["rng"]},
    {"id": "ruleset", "service": "troupe.ruleset_service.RulesService", "inject": ["rng"]},
    {"id": "world", "service": "troupe.world.WorldService",
     "inject": ["calendar", "log", "rng"]},
    {"id": "npc", "service": "troupe.npc.NpcService", "inject": ["rng"]},
    # clock 在 faction/quest 之前：二者依赖它（mount_troupe 按清单顺序挂载，无拓扑重排）
    {"id": "clock", "service": "troupe.clock.ClockService", "inject": []},
    {"id": "faction", "service": "troupe.faction.FactionService", "inject": ["log", "clock"]},
    {"id": "quest", "service": "troupe.quest.QuestService",
     "inject": ["calendar", "clock", "log"]},
    # director 依赖 world/quest（移动/发现写世界、任务推进）→ 排在二者之后
    {"id": "director", "service": "troupe.director.DirectorService",
     "inject": ["rng", "calendar", "log", "oracle", "tables", "ruleset", "world", "quest"]},
    # agency（NPC 自主行动）：依赖 npc/world/oracle/faction，全在前
    {"id": "agency", "service": "troupe.npc_agency.NpcAgencyService",
     "inject": ["rng", "npc", "world", "log", "oracle", "faction"]},
    {"id": "magic", "service": "troupe.magic.MagicService",
     "inject": ["ruleset", "rng", "log"]},
    # provisions 依赖 director（饥饿/疲劳作用于队伍）→ 排在 director 之后
    {"id": "provisions", "service": "troupe.provisions.ProvisionService",
     "inject": ["rng", "ruleset", "log", "calendar", "director"]},
    # agent 依赖 npc/world/tables/director（抽编队、算队伍等级）；
    # encounter 依赖 agent → agent 前移；agent 不依赖 encounter，避免成环
    {"id": "agent", "service": "troupe.agent.AgentService",
     "inject": ["rng", "npc", "world", "tables", "director"]},
    {"id": "encounter", "service": "troupe.encounter.EncounterService",
     "inject": ["ruleset", "world", "rng", "log", "director",
                "agent", "oracle", "provisions"]},
]


def resolve_service(path: str) -> type:
    """把 ``"troupe.rng.RngService"`` 这样的字符串解析成类对象。

    优先查权威显式注册表 ``_SERVICE_CLASSES``（绝对不会命中部分初始化的模块）；
    注册表未覆盖的路径（未来扩展的服务）回退到 ``importlib`` 通用解析。供 :func:`mount_troupe`
    与 d20 loader 软挂载共用，保证同一份解析语义。
    """
    if path in _SERVICE_CLASSES:
        return _SERVICE_CLASSES[path]
    # 兜底：未知路径走 importlib
    module_path, _, cls_name = path.rpartition(".")
    if not module_path:
        raise ValueError(f"invalid service path: {path}")
    module = importlib.import_module(module_path)
    cls = getattr(module, cls_name, None)
    if cls is None:
        raise ValueError(f"service class not found: {path}")
    return cls


def _load_entries() -> list[dict]:
    """读 composition.yml（优先）或回退内联清单，返回 ``service`` 仍为字符串的注册表。"""
    if os.path.exists(_COMPOSE_PATH):
        try:
            with open(_COMPOSE_PATH, "r", encoding="utf-8") as f:
                doc = load_yaml(f.read())
            source = doc.get("services", []) if isinstance(doc, dict) else (doc or [])
        except Exception:
            source = None
    else:
        source = None
    if not source:
        source = _FALLBACK_ENTRIES
    # 浅拷贝，避免外部改动污染；service 字段保持字符串，挂载时再解析
    return [dict(e) for e in source]


# 导入时只读取 YAML（不解析成类），类在挂载时经 resolve_service 解析
DEFAULT_TROUPE_ENTRIES: list[dict] = _load_entries()


def available_troupe_services() -> list[str]:
    """已注册（可被挂载）的 troupe 服务 id 列表。"""
    return [e["id"] for e in DEFAULT_TROUPE_ENTRIES]


def mount_troupe(ctx: Context, *, seed: int, ruleset: str) -> None:
    """按注册表把全套 troupe 服务挂进 ``ctx``。

    注册表里的服务本身不带运行时配置（除 rng 的种子、ruleset 的规则 id），这两项在此处注入。
    挂载时再把 ``service`` 字符串解析成类（经 :func:`resolve_service`，显式注册表，无循环导入风险）。
    挂载后做两件 ``Simulator`` 专属的副作用：

    * 用主种子给**全局** ``random`` 定点播种（``d20.battle`` 消费全局 random，保证同种子同战斗）；
    * 触发派系日推进钩子（按 power 推进计划时钟）。
    """
    for entry in DEFAULT_TROUPE_ENTRIES:
        svc = entry["service"]
        if isinstance(svc, str):
            svc = resolve_service(svc)
        name = entry["id"]
        if name == "rng":
            ctx.mount(svc, {"seed": int(seed)}, name=name)
        elif name == "ruleset":
            ctx.mount(svc, {"id": ruleset}, name=name)
        else:
            ctx.mount(svc, name=name)

    import random as _grng
    _grng.seed(ctx.rng.seed)
    ctx.faction.apply()
