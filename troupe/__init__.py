"""troupe - 跑团模拟器（GM 模拟器 / 战役引擎）

分层（详见 ``docs/troupe-architecture.md``）：

    L0 内核      roleplayer.core            Context / Service / 事件总线
    L1 规则适配  ruleset*            把角色卡翻译成 D&D / GURPS 统一检定语义
    L2 世界模型  world/npc/faction/quest/clock/calendar/lore
    L3 叙事导演  oracle/director      GM 模拟（混沌/命运/场景）+ 裁定落地
    L4 遭遇模式  encounter            探索/交涉/旅行/休整/战斗的调度
    L5 智能体    agent                PC 行动提议策略
    L6 持久化    save                 存档 / 确定性续跑
    L7 呈现      render               文本渲染

入口：``from troupe import Simulator``。
"""
from __future__ import annotations

from .rng import RngService

from .agent import AgentService
from .calendar import CalendarService
from .clock import ClockService
from .contracts import (
    Action,
    CampaignModule,
    CheckRequest,
    CheckResult,
    Consequence,
    Event,
    FactionProfile,
    NpcProfile,
    Quest,
    SceneSpec,
    SessionState,
    Thread,
)
from .director import DirectorService
from .encounter import EncounterService
from .faction import FactionService
from .lore import LoreService
from .log import LogService
from .npc import NpcService
from .oracle import OracleService
from .quest import QuestService
from .random_tables import RandomTableService
from .render import render_campaign
from .ruleset import RulesetAdapter, get_ruleset, register_ruleset
from .ruleset_gurps import GurpsRuleset
from .ruleset_dnd5e import Dnd5eRuleset
from .ruleset_coc import CocRuleset
from .ruleset_service import RulesetService
from .simulator import Simulator
from .composition import (
    DEFAULT_TROUPE_ENTRIES, available_troupe_services, mount_troupe,
)
from .world import WorldService

__all__ = [
    "Simulator",
    # 契约层
    "Action", "CheckRequest", "CheckResult", "Consequence", "Event",
    "CampaignModule", "SessionState", "SceneSpec", "Thread",
    "NpcProfile", "FactionProfile", "Quest",
    # 服务
    "RngService", "CalendarService", "ClockService", "LoreService", "LogService",
    "NpcService", "FactionService", "QuestService", "RandomTableService",
    "OracleService", "RulesetService", "DirectorService", "EncounterService",
    "AgentService", "WorldService",
    # 服务注册表（troupe 作用域内，不污染 roleplayer 基类）
    "DEFAULT_TROUPE_ENTRIES", "available_troupe_services", "mount_troupe",
    # 规则适配器
    "RulesetAdapter", "Dnd5eRuleset", "GurpsRuleset", "CocRuleset",
    "get_ruleset", "register_ruleset",
    # 渲染
    "render_campaign",
]
