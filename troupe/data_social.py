"""troupe.data_social - 交涉 / 反应检定常量

交涉模式建模
------------
一次交涉 = **态度值**（NPC 对队伍的既有立场）+ **话术修正**（玩家选择的施压方式）
+ **情境修正**（礼物、把柄、人质…）→ 一次 ``reaction`` 检定 → 态度位移。

设计要点：话术不是纯粹的数值堆砌，而带**风险**：威胁一旦失手会直接恶化态度，
贿赂有金钱成本。这样「交涉」才是一个有取舍的子系统，而非一次说服掷骰。
"""
from __future__ import annotations

# =============================================================================
#  态度等级（-2 .. +2）
# =============================================================================
ATTITUDE_LEVELS: dict[int, dict] = {
    -2: {"name": "敌对", "desc": "会主动伤害、阻挠，不会提供帮助。", "help_mod": -10},
    -1: {"name": "冷淡", "desc": "不合作，只做最少的事。", "help_mod": -5},
    0: {"name": "中立", "desc": "按规矩办事，不偏不倚。", "help_mod": 0},
    1: {"name": "友善", "desc": "愿意多帮一点，会主动通风报信。", "help_mod": +5},
    2: {"name": "盟友", "desc": "愿意承担风险相助。", "help_mod": +10},
}

ATTITUDE_CN = {k: v["name"] for k, v in ATTITUDE_LEVELS.items()}


def clamp_disposition(value: int) -> int:
    return max(-2, min(2, int(value)))


def disposition_of(name: str) -> int:
    """态度名 → 数值（未知名返回 0）。"""
    for k, v in ATTITUDE_LEVELS.items():
        if v["name"] == name:
            return k
    return 0


# =============================================================================
#  反应检定
# =============================================================================
#: 反应检定 = d20 + 2×态度 + 话术修正 + 情境修正，按下表分档
REACTION_THRESHOLDS: list[tuple[int, str]] = [
    (4, "敌对"),     # ≤4
    (8, "冷淡"),     # 5-8
    (13, "中立"),    # 9-13
    (18, "友善"),    # 14-18
    (999, "盟友"),   # 19+
]

#: 反应结果 → 态度位移（检定越过当前态度越多，位移越大）
REACTION_SHIFT = {
    "敌对": -1,
    "冷淡": -1,
    "中立": 0,
    "友善": +1,
    "盟友": +1,
}


# =============================================================================
#  话术（玩家可选的交涉手段）
# =============================================================================
#: 话术 → (修正, 失败代价, 说明)
TACTICS: dict[str, dict] = {
    "讲理": {"mod": 0, "fail_cost": 0, "cost_gold": 0,
             "desc": "摆事实讲道理。稳妥，无额外代价。"},
    "共情": {"mod": 2, "fail_cost": 0, "cost_gold": 0,
             "desc": "诉诸对方的处境与情感。对有软肋的 NPC 更有效。"},
    "恭维": {"mod": 1, "fail_cost": -1, "cost_gold": 0,
             "desc": "抬举对方。失手会显得虚伪，反而减分。"},
    "贿赂": {"mod": 3, "fail_cost": 0, "cost_gold": 25,
             "desc": "花钱开路。每轮 25 金，失手也花了钱。"},
    "施压": {"mod": 1, "fail_cost": -1, "cost_gold": 0,
             "desc": "以势压人。对地位低者有效，对有靠山者危险。"},
    "威胁": {"mod": 3, "fail_cost": -2, "cost_gold": 0,
             "desc": "直接威胁。见效快，失手则态度急剧恶化。"},
    "欺骗": {"mod": 2, "fail_cost": -2, "cost_gold": 0,
             "desc": "编造说辞。一旦被识破，信任难以重建。"},
}

#: 情境修正（可叠加）
CIRCUMSTANCE_MODS = {
    "持有把柄": +5,
    "有共同敌人": +3,
    "持有对方所需": +4,
    "曾有过节": -4,
    "当众施压": -2,
    "语言不通": -5,
    "持有介绍信": +3,
}

#: 交涉轮次上限（超过后对方开始敷衍，边际收益递减）
MAX_PERSUADE_ROUNDS = 3
#: 每多一轮的疲劳修正
ROUND_FATIGUE = -2

#: 情报交换：态度 → 可问出的问题数
INTEL_QUESTIONS = {-2: 0, -1: 0, 0: 1, 1: 2, 2: 3}


__all__ = [
    "ATTITUDE_LEVELS", "ATTITUDE_CN", "clamp_disposition", "disposition_of",
    "REACTION_THRESHOLDS", "REACTION_SHIFT",
    "TACTICS", "CIRCUMSTANCE_MODS",
    "MAX_PERSUADE_ROUNDS", "ROUND_FATIGUE", "INTEL_QUESTIONS",
]
