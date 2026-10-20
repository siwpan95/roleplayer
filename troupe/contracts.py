"""troupe.contracts - 跑团模拟器的**数据契约层**（单一真相来源）

设计原则
--------
1. **契约先行**：所有 Service 之间只交换这里定义的 dataclass，不允许互相塞裸 dict。
   这样序列化（存档 / 回放 / 网络传输）与单元测试才有稳定抓手。
2. **可序列化**：凡需要进存档的契约，一律实现 ``to_dict()`` / ``from_dict()``；
   对无法序列化的运行时引用（如 ``Character`` 实例）显式丢弃，靠 id 重建。
3. **规则无关**：本层不出现 d20 / 3d6 / AC 等规则专有概念。规则差异全部关在
   ``troupe.ruleset`` 适配层后面，世界层只认 ``CheckRequest`` / ``CheckResult``。

分层对应
--------
    L0 内核      roleplayer.core            Context / Service / 事件总线（复用，不重写）
    L1 规则适配  troupe.ruleset*     把角色对象翻译成统一的检定语义
    L2 世界模型  troupe.world 等     地点 / NPC / 派系 / 任务 / 时钟 / 时间
    L3 叙事导演  troupe.oracle 等    GM 模拟器（混沌 / 命运 / 场景 / 随机表）
    L4 遭遇模式  troupe.encounter 等 战斗 / 探索 / 交涉 / 旅行 / 休整
    L5 智能体    troupe.agent*       PC / NPC 决策策略
    L6 持久化    troupe.log 等       事件溯源 / 存档 / 确定性回放
    L7 呈现      troupe.render       文本渲染（战报 / 场景卡 / 世界图）
"""
from __future__ import annotations

from dataclasses import dataclass, field, fields
from typing import Any

#: 存档 schema 版本。存档加载时若版本不匹配，交由 ``troupe.save`` 的迁移链处理。
SCHEMA_VERSION = "1.1"


# =============================================================================
#  序列化辅助
# =============================================================================
def _to_plain(value: Any) -> Any:
    """把契约对象递归降为纯 JSON 友好结构（丢弃不可序列化的运行时引用）。"""
    if hasattr(value, "to_dict"):
        return value.to_dict()
    if isinstance(value, dict):
        return {k: _to_plain(v) for k, v in value.items()}
    if isinstance(value, (list, tuple)):
        return [_to_plain(v) for v in value]
    if isinstance(value, set):
        return sorted(_to_plain(v) for v in value)
    if isinstance(value, (str, int, float, bool)) or value is None:
        return value
    # 非契约、非基础类型（如 Character 实例）：不进存档
    return None


class DictMixin:
    """为契约 dataclass 提供 ``to_dict`` / ``from_dict``。"""

    #: ``from_dict`` 时不还原的字段（运行时引用）
    _transient: frozenset = frozenset()

    def to_dict(self) -> dict:
        out: dict[str, Any] = {}
        for f in fields(self):  # type: ignore[arg-type]
            if f.name in self._transient:
                continue
            out[f.name] = _to_plain(getattr(self, f.name))
        return out

    @classmethod
    def from_dict(cls, data: dict):
        kwargs = {}
        valid = {f.name for f in fields(cls)}  # type: ignore[arg-type]
        for k, v in (data or {}).items():
            if k in valid:
                kwargs[k] = v
        return cls(**kwargs)

    def load(self, data: dict) -> None:
        """从 ``to_dict`` 产出的 dict 原地还原字段（用于存档续跑）。

        嵌套的契约对象（本身也有 ``load``/``from_dict``）会递归还原；
        不认识或不在字段白名单里的键直接忽略。
        """
        if not data:
            return
        valid = {f.name for f in fields(type(self))}
        for k, v in data.items():
            if k not in valid:
                continue
            cur = getattr(self, k, None)
            if isinstance(v, dict) and hasattr(cur, "load"):
                cur.load(v)                       # 嵌套契约对象（如 GameTime.now）
            elif isinstance(v, dict) and hasattr(type(cur), "from_dict"):
                setattr(self, k, type(cur).from_dict(v))
            else:
                setattr(self, k, v)


# =============================================================================
#  L2-a 世界时间
# =============================================================================
#: 一天四个时段（旅行/探索/遭遇权重会随时段变化）
PHASES = ("黎明", "白天", "黄昏", "夜晚")


@dataclass
class GameTime(DictMixin):
    """世界内时钟。以「日 + 时 + 分」表示，最小推进粒度 1 分钟。"""

    day: int = 1
    hour: int = 8
    minute: int = 0

    MINUTES_PER_DAY: int = field(default=1440, repr=False, compare=False)

    def total_minutes(self) -> int:
        return self.day * 1440 + self.hour * 60 + self.minute

    def advance(self, minutes: int) -> "GameTime":
        """返回推进后的新时间（原地修改，便于 Service 直接 ``self.now = ...``）。"""
        total = self.total_minutes() + int(minutes)
        self.day, rem = divmod(max(total, 0), 1440)
        self.hour, self.minute = divmod(rem, 60)
        return self

    def phase(self) -> str:
        h = self.hour
        if 5 <= h < 8:
            return "黎明"
        if 8 <= h < 17:
            return "白天"
        if 17 <= h < 20:
            return "黄昏"
        return "夜晚"

    def __str__(self) -> str:  # noqa: D105
        return f"第{self.day}日 {self.hour:02d}:{self.minute:02d}（{self.phase()}）"


# =============================================================================
#  L1 规则适配：统一检定语义
# =============================================================================
#: 检定种类
#:   attribute 属性检定   skill 技能检定   attack 攻击检定
#:   save 豁免            contest 对抗     reaction 交涉/反应检定
CHECK_KINDS = ("attribute", "skill", "attack", "save", "contest", "reaction")

#: 难度档（规则无关）。由各 RulesetAdapter 翻译为本规则的 DC / 修正。
CHECK_TIERS = ("极易", "容易", "普通", "困难", "极难", "近乎不可能")


@dataclass
class CheckRequest(DictMixin):
    """一次检定的**请求**。

    :param actor: 行动者 id
    :param kind: 见 ``CHECK_KINDS``
    :param key: 检定键（技能名 / 属性名 / 武器名 / 豁免属性）
    :param tier: 难度档（与 ``dc`` 二选一；``dc`` 优先）
    :param dc: 直接给定难度等级（D&D 语义）
    :param modifier: 情境修正（GURPS 语义下直接叠加到有效技能等级）
    :param advantage: -1 劣势 / 0 常态 / +1 优势（D&D 语义；GURPS 忽略）
    :param opposed: 对抗检定的对手请求
    """

    actor: str
    kind: str = "skill"
    key: str = ""
    tier: str = "普通"
    dc: int | None = None
    modifier: int = 0
    advantage: int = 0
    opposed: "CheckRequest | None" = None
    label: str = ""

    _transient = frozenset({"opposed"})

    def __post_init__(self) -> None:
        if self.kind not in CHECK_KINDS:
            raise ValueError(f"未知检定种类: {self.kind}（应为 {CHECK_KINDS}）")
        if self.tier not in CHECK_TIERS:
            raise ValueError(f"未知难度档: {self.tier}（应为 {CHECK_TIERS}）")
        if self.advantage not in (-1, 0, 1):
            raise ValueError("advantage 只能取 -1 / 0 / +1")


@dataclass
class CheckResult(DictMixin):
    """一次检定的**结果**（规则无关的结构化输出，供叙事层渲染）。"""

    success: bool
    critical: str = ""          # "" / "crit" / "crit_fail"
    margin: int = 0             # 余量：D&D = total-dc；GURPS = target-roll
    roll: int = 0               # 主骰结果（优势取最终骰面；3d6 取点数和）
    dice: list = field(default_factory=list)   # 原始骰面，便于战报展示
    total: int = 0              # 参与比较的左侧值
    target: int = 0             # 参与比较的右侧值（DC / 有效技能等级）
    text: str = ""
    data: dict = field(default_factory=dict)

    @property
    def degree(self) -> str:
        """把余量粗略分档，供后果裁定（大胜 / 胜 / 险胜 / 小负 / 惨败）。"""
        if self.critical == "crit":
            return "大胜"
        if self.critical == "crit_fail":
            return "惨败"
        if not self.success:
            return "小负" if self.margin >= -2 else "惨败"
        return "大胜" if self.margin >= 6 else "胜"


# =============================================================================
#  L2-b 世界实体
# =============================================================================
@dataclass
class Place(DictMixin):
    """地点（场景发生的容器）。"""

    id: str
    name: str
    region: str = ""
    kind: str = "据点"          # 据点 / 城镇 / 地牢 / 荒野 / 遗迹 / 建筑
    danger: int = 1             # 1(安全) - 5(致命)：决定遭遇掷骰频率
    tags: list = field(default_factory=list)
    description: str = ""
    discovered: bool = False
    visited: int = 0


@dataclass
class Route(DictMixin):
    """地点之间的通路（旅行用）。"""

    id: str
    a: str
    b: str
    distance_km: float = 10.0
    terrain: str = "平原"        # 平原 / 森林 / 山地 / 沼泽 / 沙漠 / 道路 / 水路
    danger: int = 1
    hidden: bool = False        # 未发现的小径


@dataclass
class NpcProfile(DictMixin):
    """NPC 档案。``disposition`` 为 -2..+2 的态度值（敌对→友善）。"""

    id: str
    name: str
    role: str = ""
    faction: str = ""
    place: str = ""
    disposition: int = 0
    traits: list = field(default_factory=list)
    wants: str = ""             # 目标（驱动其行动）
    secret: str = ""            # 秘密（可被线索揭示）
    met: bool = False
    alive: bool = True
    notes: list = field(default_factory=list)
    ref: Any = None             # 运行时角色对象（不序列化）

    _transient = frozenset({"ref"})


@dataclass
class FactionProfile(DictMixin):
    """派系。``standing`` 为队伍在该派系的声望 -100..100。"""

    id: str
    name: str
    goals: list = field(default_factory=list)
    standing: int = 0
    power: int = 5              # 1..10：影响其推进时钟的速度
    allies: list = field(default_factory=list)
    rivals: list = field(default_factory=list)


@dataclass
class Clue(DictMixin):
    """线索：解锁任务目标或指向新地点 / NPC。"""

    id: str
    text: str
    target: str = ""            # 指向的 quest / place / npc id
    revealed: bool = False


@dataclass
class Objective(DictMixin):
    id: str
    text: str
    done: bool = False
    optional: bool = False


@dataclass
class Quest(DictMixin):
    """任务（可有多条目标，完成后派发奖励并推进战役时钟）。"""

    id: str
    title: str
    summary: str = ""
    objectives: list = field(default_factory=list)   # list[Objective]
    clues: list = field(default_factory=list)        # list[Clue]
    giver: str = ""
    reward_xp: int = 0
    reward_gold: int = 0
    status: str = "active"      # locked / active / done / failed
    clock_id: str = ""          # 关联的进度时钟
    # ---- 依赖 / 期限 / 失败条件（让任务真的会「被卡住、会过期、会失败」）----
    depends_on: list = field(default_factory=list)   # 前置任务 id：全部 done 才解锁
    deadline_minutes: int = 0                        # 期限（游戏内分钟，0 = 无期限）
    started_minute: int = 0                          # 接取时刻（用于计算超时）
    fail_condition: str = ""                         # 失败条件："clock:<id>" / "quest_failed:<id>"

    def progress(self) -> float:
        if not self.objectives:
            return 0.0
        done = sum(1 for o in self.objectives if self._is_done(o))
        return done / len(self.objectives)

    @staticmethod
    def _is_done(o: Any) -> bool:
        return bool(o.done) if hasattr(o, "done") else bool(o.get("done"))


@dataclass
class Clock(DictMixin):
    """进度时钟（受 PbtA 启发）：N 段，推进满即触发后果。"""

    id: str
    name: str
    segments: int = 4
    filled: int = 0
    kind: str = "danger"        # danger / exploration / campaign / faction
    consequence: str = ""
    #: 后果是否已兑现（填满后由导演置位）。**不**清空 filled ——「已满」是既成事实，
    #: 任务的 ``fail_condition="clock:<id>"`` 需要读到它。
    consumed: bool = False

    def tick(self, n: int = 1) -> bool:
        """推进 n 段，返回是否已填满（触发后果）。"""
        self.filled = min(self.segments, self.filled + int(n))
        return self.filled >= self.segments

    @property
    def full(self) -> bool:
        return self.filled >= self.segments


@dataclass
class Thread(DictMixin):
    """剧情线索（GME 语义）：可被推进 / 关闭 / 随机事件命中。"""

    id: str
    text: str
    weight: int = 1             # 1..3，越高越容易被随机事件抽中
    status: str = "open"        # open / closed


# =============================================================================
#  L3 场景
# =============================================================================
#: 场景模式 —— 决定导演调用哪套「行动菜单 + 后果裁定」
SCENE_KINDS = ("exploration", "social", "combat", "travel", "downtime", "epilogue")
SCENE_KIND_CN = {
    "exploration": "探索",
    "social": "交涉",
    "combat": "战斗",
    "travel": "旅行",
    "downtime": "休整",
    "epilogue": "收尾",
}

#: 场景检查结果
SCENE_NORMAL = "normal"         # 如预期
SCENE_ALTERED = "altered"       # 有变故
SCENE_INTERRUPTED = "interrupted"  # 被打断（插入随机事件）

#: 场景结局
OUTCOME_IN_CONTROL = "in_control"
OUTCOME_OUT_OF_CONTROL = "out_of_control"


@dataclass
class SceneSpec(DictMixin):
    """场景**预期**：玩家/导演打算让这一场戏演什么。"""

    title: str = ""
    kind: str = "exploration"
    place: str = ""
    goal: str = ""              # 本场戏的戏剧问题
    actors: list = field(default_factory=list)
    tags: list = field(default_factory=list)

    def __post_init__(self) -> None:
        if self.kind not in SCENE_KINDS:
            raise ValueError(f"未知场景模式: {self.kind}（应为 {SCENE_KINDS}）")


@dataclass
class SceneState(DictMixin):
    """场景运行时状态。"""

    id: str
    spec: SceneSpec
    started_at: GameTime
    chaos: int = 5
    check: str = SCENE_NORMAL
    beats: list = field(default_factory=list)   # 场景内的事件 seq 列表
    ended_at: GameTime | None = None
    outcome: str = ""

    @property
    def index(self) -> int:
        return int(self.id.split("-")[-1]) if "-" in self.id else 0


# =============================================================================
#  L6 事件溯源
# =============================================================================
EVENT_TYPES = (
    "session.start", "session.end",
    "scene.start", "scene.check", "scene.note", "scene.end",
    "check", "oracle.fate", "oracle.event",
    "move", "discovery", "clue",
    "combat.start", "combat.round", "combat.end", "combat.request",
    "damage", "heal", "condition", "death", "rest",
    "magic.cast", "travel", "social", "social.reaction", "downtime",
    "quest.update", "quest.lock", "clock.tick", "clock.consequence", "faction.shift",
    "npc.new", "npc.met", "npc.action", "loot", "xp",
    "time.advance", "custom",
)


@dataclass
class Event(DictMixin):
    """结构化事件（事件溯源的最小单元）。

    叙事文本（``text``）只是事件的一种**渲染**；真正的状态由各 Service 持有，
    因此回放可以只重放事件流 + 重建服务状态。
    """

    seq: int
    type: str
    ts: GameTime = field(default_factory=GameTime)
    scene_id: str = ""
    actor: str = ""
    target: str = ""
    payload: dict = field(default_factory=dict)
    text: str = ""
    tags: list = field(default_factory=list)

    def __post_init__(self) -> None:
        if self.type not in EVENT_TYPES:
            raise ValueError(f"未登记的事件类型: {self.type}")


# =============================================================================
#  L5 智能体
# =============================================================================
@dataclass
class Action(DictMixin):
    """一次**行动提议**：智能体产出，导演负责裁定后果。

    智能体只「提议」，不直接改世界 —— 保证所有状态变更都发生在导演层，
    便于回放、审计与难度调参。
    """

    actor: str
    verb: str                    # 如 "搜索" / "说服" / "攻击" / "行进"
    kind: str = "exploration"    # 对应 SCENE_KINDS，便于导演路由
    request: CheckRequest | None = None
    payload: dict = field(default_factory=dict)
    rationale: str = ""

    _transient = frozenset({"request"})

    def to_dict(self) -> dict:
        d = super().to_dict()
        if self.request is not None:
            d["request"] = self.request.to_dict()
        return d


@dataclass
class Consequence(DictMixin):
    """导演对一次行动的**裁定结果**（世界层可执行的增量）。"""

    ok: bool
    narrative: str = ""
    effects: dict = field(default_factory=dict)
    """effects 约定键（各 Service 消费）：
        ``time``      推进分钟数
        ``damage``    {target: 点数}
        ``heal``      {target: 点数}
        ``condition`` {target: [状态...]}
        ``clue``      [线索 id...]
        ``discovery`` [地点 id...]
        ``quest``     {quest_id: {objective_id: done}}
        ``clock``     {clock_id: 段数}
        ``faction``   {faction_id: 声望变化}
        ``npc``       {npc_id: {disposition: 变化}}
        ``loot``      [物品...]
        ``xp``        经验值
        ``combat``    True 表示触发战斗遭遇
    """


# =============================================================================
#  L2-c 战役模块（数据驱动的剧本）
# =============================================================================
@dataclass
class CampaignModule(DictMixin):
    """一个可加载的战役/模组（纯数据，YAML/JSON 可表达）。

    模组是**可选的脚手架**：即使没有模组，导演也能靠 Oracle + 随机表即兴生成战役
    （GME 式的无预设跑团）；有模组时，模组提供初始种子（地点 / 派系 / 任务 / NPC），
    导演在其之上即兴发挥。
    """

    id: str = "improvised"
    title: str = "即兴冒险"
    premise: str = ""
    regions: list = field(default_factory=list)     # list[str]
    places: list = field(default_factory=list)      # list[Place]
    routes: list = field(default_factory=list)      # list[Route]
    npcs: list = field(default_factory=list)        # list[NpcProfile]
    factions: list = field(default_factory=list)    # list[FactionProfile]
    quests: list = field(default_factory=list)      # list[Quest]
    clocks: list = field(default_factory=list)      # list[Clock]
    threads: list = field(default_factory=list)     # list[Thread]
    starting_place: str = ""
    target_scenes: int = 8


# =============================================================================
#  L6 会话快照
# =============================================================================
@dataclass
class SessionState(DictMixin):
    """会话级可变状态（被所有 Service 共享读写，等价于 d20 的 ``CharacterState``）。"""

    seed: int = 0
    ruleset: str = "dnd5e"
    module_id: str = "improvised"
    now: GameTime = field(default_factory=GameTime)
    current_place: str = ""
    scene_counter: int = 0
    chaos: int = 5
    round_xp: int = 0
    total_xp: int = 0
    gold: int = 0
    provisions: dict = field(default_factory=lambda: {
        "rations": 5, "water": 5, "coin_lbs": 0.0, "pack_lbs": 0.0,
    })                                       # 补给：口粮(份)/饮水(份)/钱币重量(lb)/负重(lb)
    flags: dict = field(default_factory=dict)       # 任意标记（用于模组分支）
    dungeon: dict = field(default_factory=dict)     # 地牢空间地图存档（spatial.DungeonMap.to_dict）
    finished: bool = False
    ending: str = ""


__all__ = [
    "SCHEMA_VERSION", "DictMixin",
    "PHASES", "GameTime",
    "CHECK_KINDS", "CHECK_TIERS", "CheckRequest", "CheckResult",
    "Place", "Route", "NpcProfile", "FactionProfile",
    "Clue", "Objective", "Quest", "Clock", "Thread",
    "SCENE_KINDS", "SCENE_KIND_CN",
    "SCENE_NORMAL", "SCENE_ALTERED", "SCENE_INTERRUPTED",
    "OUTCOME_IN_CONTROL", "OUTCOME_OUT_OF_CONTROL",
    "SceneSpec", "SceneState",
    "EVENT_TYPES", "Event",
    "Action", "Consequence",
    "CampaignModule", "SessionState",
]
