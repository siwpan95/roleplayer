"""troupe.ruleset - 规则适配层抽象（L1）

为什么要有这一层
----------------
项目本身就是「D&D 三宝书 × GURPS Basic Set」的融合体，但两套规则的**判定语义相反**：

    D&D 5e   d20 + 加值 ≥ DC     掷**高**、有优势/劣势、有难度等级表
    GURPS 4e 3d6 ≤ 有效技能等级   掷**低**、有情境修正、有大成功/大失败区间

如果世界层（探索/交涉/旅行）里到处写 ``if ruleset == "gurps"``，规则与叙事就焊死了，
换规则要改十几个文件。因此这里定一个**规则无关的门面**：

    世界层只会说：「做一次普通难度的『搜索』检定」
    规则层负责把它翻译成 d20+3 vs DC15，或 3d6 ≤ 11

新增一套规则（CoC 的 d100、PbtA 的 2d6、Year Zero 的骰池）只需：
1. 写一个 ``RulesetAdapter`` 子类；
2. 在模块底部 ``register_ruleset``；
3. 世界层代码**一行不动**。

角色对象的约定
--------------
两个适配器都作用于同一个 ``d20.Character`` —— 本项目用 GURPS 式点数购买 +
D&D 六维属性，技能等级是「绝对有效等级」，两套规则各自解释它：

    D&D：等级 = 加值（d20 + 等级 vs DC）
    GURPS：等级 = 掷骰上限（3d6 ≤ 等级）

这样规则切换不需要重建角色，也不破坏 v2.x 的既有 API 与存档。
"""
from __future__ import annotations

from typing import Any, Optional

from .contracts import CheckRequest, CheckResult, CHECK_TIERS


class RulesetError(Exception):
    """规则适配层错误（未知规则集 / 检定参数非法）。"""


class RulesetAdapter:
    """规则集适配器基类。子类实现 ``check`` 与若干取值方法。"""

    #: 规则集 id（存档与配置里引用它）
    id: str = ""
    #: 中文名
    name: str = ""
    #: 一句话说明（用于 ``--ruleset ?`` 之类的自省）
    blurb: str = ""

    def __init__(self, rng: Any = None, config: Optional[dict] = None) -> None:
        self.rng = rng                      # RngService（可为 None → 退回全局 random）
        self.config = config or {}

    # ------------------------------------------------------------------ #
    #  检定语义
    # ------------------------------------------------------------------ #
    def check(self, actor: Any, request: CheckRequest) -> CheckResult:
        raise NotImplementedError

    def dc_for(self, tier: str) -> int:
        """难度档 → 本规则下的目标值（掷低型规则返回 0，看 ``modifier_for``）。"""
        raise NotImplementedError

    def modifier_for(self, tier: str) -> int:
        """难度档 → 本规则下的情境修正（掷高型规则返回 0，看 ``dc_for``）。"""
        raise NotImplementedError

    def contest(self, a: Any, b: Any, key: str = "", modifier: int = 0) -> CheckResult:
        """对抗检定：默认实现为各自 ``check`` 后比较余量。"""
        ra = self.check(a, CheckRequest(actor=self._id_of(a), kind="skill",
                                        key=key, modifier=modifier))
        rb = self.check(b, CheckRequest(actor=self._id_of(b), kind="skill",
                                        key=key, modifier=modifier))
        win = ra.margin >= rb.margin
        return CheckResult(
            success=win, margin=ra.margin - rb.margin,
            roll=ra.roll, total=ra.margin, target=rb.margin,
            text=f"对抗：{ra.actor_text if hasattr(ra, 'actor_text') else ''}"
                 f"{self._name_of(a)} {ra.margin} vs {self._name_of(b)} {rb.margin}"
                 f" → {'前者胜' if win else '后者胜'}",
            data={"a": ra.to_dict(), "b": rb.to_dict()},
        )

    # ------------------------------------------------------------------ #
    #  角色视图（世界层只认这些取值，不碰 Character 内部）
    # ------------------------------------------------------------------ #
    def rank_of(self, actor: Any, key: str) -> int:
        """技能（或属性）的有效等级。"""
        raise NotImplementedError

    def hp_of(self, actor: Any) -> tuple[int, int]:
        """(当前 HP, 最大 HP)。"""
        raise NotImplementedError

    def set_hp(self, actor: Any, value: int) -> int:
        raise NotImplementedError

    def damage(self, actor: Any, amount: int, dtype: str = "钝击") -> dict:
        raise NotImplementedError

    def heal(self, actor: Any, amount: int) -> int:
        raise NotImplementedError

    def rest(self, actor: Any, kind: str = "short") -> dict:
        """``kind``: short / long / sleep（GURPS 侧按小时折算 FP 恢复）。"""
        raise NotImplementedError

    def alive(self, actor: Any) -> bool:
        cur, _ = self.hp_of(actor)
        return cur > 0

    def defense_of(self, actor: Any) -> int:
        """防御值（D&D 为 AC，GURPS 为闪避值）。"""
        raise NotImplementedError

    def resolve_attack(self, attacker: Any, defender: Any,
                       weapon: Optional[str] = None, modifier: int = 0,
                       retreating: bool = False) -> dict:
        """场景级单次攻击结算（不经 ``d20.battle`` 的轻量路径）。"""
        raise NotImplementedError

    def describe(self, actor: Any) -> str:
        """一行角色速览（战报 / 队伍面板用）。"""
        raise NotImplementedError

    def actor_view(self, actor: Any) -> dict:
        """结构化角色视图（存档 / Web 前端 / 渲染层消费）。"""
        raise NotImplementedError

    # ------------------------------------------------------------------ #
    #  战斗桥接
    # ------------------------------------------------------------------ #
    def to_combatant(self, actor: Any) -> Any:
        """把角色转成 ``d20.battle`` 可消费的战斗单位（不支持则返回 None）。"""
        return None

    def xp_for(self, threat: Any) -> int:
        """威胁等级（CR 字符串 / 描述）→ 经验值。"""
        return 0

    # ------------------------------------------------------------------ #
    #  工具
    # ------------------------------------------------------------------ #
    @staticmethod
    def _unwrap(actor: Any) -> Any:
        """``ActorRef`` → 内部角色对象；普通 Character 原样返回。"""
        if actor is None:
            return None
        ref = getattr(actor, "ref", None)
        return ref if ref is not None else actor

    @staticmethod
    def _id_of(actor: Any) -> str:
        return str(getattr(actor, "id", "") or getattr(actor, "name", "") or "?")

    @staticmethod
    def _name_of(actor: Any) -> str:
        inner = RulesetAdapter._unwrap(actor)
        st = getattr(inner, "state", None)
        if st is not None:
            return getattr(st, "cls", "") or getattr(st, "race", "") or "冒险者"
        return str(getattr(actor, "name", "") or "?")

    def _rand(self):
        """取规则域随机源（无 RngService 时退回全局 random）。"""
        if self.rng is not None and hasattr(self.rng, "stream"):
            return self.rng.stream("rules")
        import random

        return random


# =============================================================================
#  注册表
# =============================================================================
_REGISTRY: dict[str, type[RulesetAdapter]] = {}


def register_ruleset(cls: type[RulesetAdapter]) -> type[RulesetAdapter]:
    """注册一个规则集适配器（供 ``@register_ruleset`` 装饰或直接调用）。"""
    if not (isinstance(cls, type) and issubclass(cls, RulesetAdapter)):
        raise RulesetError(f"只能注册 RulesetAdapter 子类，收到 {cls!r}")
    if not cls.id:
        cls.id = cls.__name__.lower().replace("ruleset", "").replace("adapter", "")
    _REGISTRY[cls.id] = cls
    return cls


def get_ruleset(rid: str, rng: Any = None, config: Optional[dict] = None) -> RulesetAdapter:
    """按 id 取一个规则集实例（未注册抛 ``RulesetError``，fails loud）。"""
    cls = _REGISTRY.get(rid)
    if cls is None:
        raise RulesetError(
            f"未注册的规则集: {rid}（已注册：{', '.join(sorted(_REGISTRY)) or '无'}）"
        )
    return cls(rng=rng, config=config)


def available_rulesets() -> list[str]:
    return sorted(_REGISTRY)


def ruleset_info() -> list[dict]:
    return [{"id": k, "name": v.name, "blurb": v.blurb} for k, v in sorted(_REGISTRY.items())]


__all__ = [
    "RulesetError", "RulesetAdapter",
    "register_ruleset", "get_ruleset", "available_rulesets", "ruleset_info",
    "CHECK_TIERS",
]
