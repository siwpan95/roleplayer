"""roleplayer.data_battle - 模拟对战与遭遇构建的规则常量

数据来源（联网调研 + 与本地 SRD 规则章节交叉核对）：
- **遭遇构建**：D&D 5e 2014《Dungeon Master's Guide》第 3 章「Creating Encounters」
  —— 每角色 XP 阈值表、遭遇倍数表、队伍规模调整、每日冒险 XP 预算。
- **回合与动作**：本地已拉取的 SRD 规则章节
  （`data_reference.RULE_SECTIONS`：`The Order of Combat` / `Actions in Combat` /
  `Making an Attack` / `Damage and Healing` / `Cover` / `Movement and Position`）。
- **怪物 AI 启发式**：联网调研的 5e 怪物 AI 实践（目标选择「最近 + WIS≥12 时重伤优先」、
  按 INT 做抗力/免疫适配、动作优先级：解状态 > 特殊能力 > 远程 > 近战）。
"""
from __future__ import annotations

# =============================================================================
#  遭遇构建（DMG 2014 第 3 章）
# =============================================================================
#: 每角色 XP 阈值：等级 -> {easy, medium, hard, deadly}
XP_THRESHOLDS = {
    1:  {"easy": 25,   "medium": 50,   "hard": 75,   "deadly": 100},
    2:  {"easy": 50,   "medium": 100,  "hard": 150,  "deadly": 200},
    3:  {"easy": 75,   "medium": 150,  "hard": 225,  "deadly": 400},
    4:  {"easy": 125,  "medium": 250,  "hard": 375,  "deadly": 500},
    5:  {"easy": 250,  "medium": 500,  "hard": 750,  "deadly": 1100},
    6:  {"easy": 300,  "medium": 600,  "hard": 900,  "deadly": 1400},
    7:  {"easy": 350,  "medium": 750,  "hard": 1100, "deadly": 1700},
    8:  {"easy": 450,  "medium": 900,  "hard": 1400, "deadly": 2100},
    9:  {"easy": 550,  "medium": 1100, "hard": 1600, "deadly": 2400},
    10: {"easy": 600,  "medium": 1200, "hard": 1900, "deadly": 2800},
    11: {"easy": 800,  "medium": 1600, "hard": 2400, "deadly": 3600},
    12: {"easy": 1000, "medium": 2000, "hard": 3000, "deadly": 4500},
    13: {"easy": 1100, "medium": 2200, "hard": 3400, "deadly": 5100},
    14: {"easy": 1250, "medium": 2500, "hard": 3800, "deadly": 5700},
    15: {"easy": 1400, "medium": 2800, "hard": 4300, "deadly": 6400},
    16: {"easy": 1600, "medium": 3200, "hard": 4800, "deadly": 7200},
    17: {"easy": 2000, "medium": 3900, "hard": 5900, "deadly": 8800},
    18: {"easy": 2100, "medium": 4200, "hard": 6300, "deadly": 9500},
    19: {"easy": 2400, "medium": 4900, "hard": 7300, "deadly": 10900},
    20: {"easy": 2800, "medium": 5700, "hard": 8500, "deadly": 12700},
}

#: 遭遇倍数（怪物数量 -> XP 倍率）：反映行动经济——同 XP 下多怪更难
ENCOUNTER_MULTIPLIERS = [
    (1, 1, 1.0),
    (2, 2, 1.5),
    (3, 6, 2.0),
    (7, 10, 2.5),
    (11, 14, 3.0),
    (15, 10 ** 6, 4.0),
]

#: 每角色每日冒险 XP 预算（DMG Adventuring Day XP）
DAILY_XP_BUDGET = {
    1: 300, 2: 600, 3: 1200, 4: 1700, 5: 3500, 6: 4000, 7: 5000, 8: 6000,
    9: 7500, 10: 9000, 11: 10500, 12: 11500, 13: 13500, 14: 15000,
    15: 18000, 16: 20000, 17: 25000, 18: 27000, 19: 30000, 20: 40000,
}

#: 难度档位（由低到高）
DIFFICULTIES = ["easy", "medium", "hard", "deadly"]

# ``judge_difficulty()`` 以 "trivial" 作为初始档：当调整后 XP 未越过任何阈值时返回它。
# 因此 DIFFICULTY_CN **必须**覆盖 trivial，否则 ``BattleService.evaluate()`` 在
# 面对弱遭遇时会抛 ``KeyError: 'trivial'`` 直接崩溃（实测：4×L5 队伍 vs 1 只哥布林即触发）。
DIFFICULTY_CN = {
    "trivial": "轻松",
    "easy": "简单",
    "medium": "中等",
    "hard": "困难",
    "deadly": "致命",
}


def encounter_multiplier(count: int, party_size: int = 4) -> float:
    """按怪物数量与队伍规模取遭遇倍率。

    队伍人数 <3 时上浮一档（更危险），>=6 时下调一档（更轻松）——DMG 明文规则。
    """
    mult = 1.0
    for lo, hi, m in ENCOUNTER_MULTIPLIERS:
        if lo <= count <= hi:
            mult = m
            break
    if party_size < 3:
        mult = _shift(mult, +1)
    elif party_size >= 6:
        mult = _shift(mult, -1)
    return mult


def _shift(mult: float, direction: int) -> float:
    """在倍率序列上移动一档（direction=+1 上浮，-1 下调），端点不动。"""
    ladder = [m for _, _, m in ENCOUNTER_MULTIPLIERS]
    if mult not in ladder:
        return mult
    i = ladder.index(mult) + direction
    return ladder[max(0, min(len(ladder) - 1, i))]


def party_thresholds(levels: list[int]) -> dict[str, int]:
    """把队伍各成员等级换算为四档 XP 阈值总和。"""
    out = {d: 0 for d in DIFFICULTIES}
    for lv in levels:
        row = XP_THRESHOLDS.get(max(1, min(20, int(lv))))
        if row:
            for d in DIFFICULTIES:
                out[d] += row[d]
    return out


def judge_difficulty(adjusted_xp: int, thresholds: dict[str, int]) -> str:
    """用调整后 XP 对照队伍阈值判定难度（取被越过的最高档）。"""
    cur = "trivial"
    for d in DIFFICULTIES:
        if adjusted_xp >= thresholds.get(d, 0):
            cur = d
    return cur


# =============================================================================
#  伤害类型归一化
# =============================================================================
# 说明：怪物库（v2.0 生成）的伤害类型存在中英混用与简称（slashing / 挥砍 / 酸 / 火 / 坏死…），
# 而 data_reference.DAMAGE_TYPES 用的是 canonical 中文名。这里统一归一到 canonical，
# 让「抗力/免疫/易伤」判定跨模块一致。
DAMAGE_TYPE_ALIAS = {
    # canonical
    "钝击": "钝击", "穿刺": "穿刺", "挥砍": "挥砍", "酸蚀": "酸蚀", "寒冷": "寒冷",
    "火焰": "火焰", "力场": "力场", "闪电": "闪电", "死灵": "死灵", "毒素": "毒素",
    "心灵": "心灵", "光耀": "光耀", "雷鸣": "雷鸣",
    # 怪物库简称
    "酸": "酸蚀", "冷": "寒冷", "火": "火焰", "电": "闪电", "毒": "毒素",
    "坏死": "死灵", "雷": "雷鸣",
    # 英文残留（v2.0 生成时未翻译完的条目）
    "slashing": "挥砍", "piercing": "穿刺", "bludgeoning": "钝击",
    "acid": "酸蚀", "cold": "寒冷", "fire": "火焰", "force": "力场",
    "lightning": "闪电", "necrotic": "死灵", "poison": "毒素", "psychic": "心灵",
    "radiant": "光耀", "thunder": "雷鸣",
}


def normalize_damage_type(name: str) -> str:
    """把任意写法的伤害类型归一到 canonical 中文名；无法识别按原样返回。"""
    if not name:
        return ""
    key = str(name).strip().lower()
    return DAMAGE_TYPE_ALIAS.get(key, DAMAGE_TYPE_ALIAS.get(str(name).strip(), name))


# =============================================================================
#  状态与豁免（用于解析怪物 stat block 的英文原文）
# =============================================================================
#: 英文状态关键词 -> ConditionService 使用的中文状态名
CONDITION_KEYWORDS = {
    "blinded": "目盲", "charmed": "魅惑", "deafened": "耳聋", "frightened": "惊惧",
    "grappled": "擒抱", "incapacitated": "失能", "invisible": "隐形",
    "paralyzed": "麻痹", "petrified": "石化", "poisoned": "中毒", "prone": "倒地",
    "restrained": "束缚", "stunned": "震慑", "unconscious": "昏迷",
}

#: 英文豁免属性 -> D20 三豁免轴（fort/ref/will）
SAVE_ABILITY_MAP = {
    "strength": "fort", "constitution": "fort",
    "dexterity": "ref",
    "intelligence": "will", "wisdom": "will", "charisma": "will",
}

#: 怪物 AI 动作优先级（数值越小越优先），取自调研的 5e 怪物 AI 实践
AI_ACTION_PRIORITY = {
    "condition": 0,     # 解除自身状态 / 通过豁免摆脱
    "legendary": 1,     # 传奇动作（回合外）
    "special": 2,       # 特殊能力（喷吐、眼波、召唤…）
    "spell": 3,         # 法术
    "ranged": 4,        # 远程武器
    "melee": 5,         # 近战武器
    "utility": 6,       # 疾行/撤离/躲藏
}

#: AI 目标选择：WIS >= 该值时启用「重伤优先」（调研结论）
AI_WIS_WOUNDED_THRESHOLD = 12
#: AI 抗力/免疫适配：INT >= 该值时自动规避被抗/免疫的伤害类型
AI_INT_ADAPT_THRESHOLD = 10
#: AI 完全理性（每回合取期望伤害最大）：INT >= 该值
AI_INT_OPTIMAL_THRESHOLD = 18

# =============================================================================
#  战斗流程常量
# =============================================================================
#: 一回合 6 秒（SRD The Order of Combat）
ROUND_SECONDS = 6
#: 默认近战触及（尺）
MELEE_REACH = 5
#: 默认起始交战距离（尺）
DEFAULT_START_DISTANCE = 60
#: 死亡豁免：成功/失败各 3 次；d20 < 10 计失败，>= 10 计成功；1 记 2 次失败，20 回 1 HP
DEATH_SAVE_TARGET = 10
DEATH_SAVE_SUCCESSES = 3
DEATH_SAVE_FAILURES = 3
#: 暴击：d20 掷出 20 必中且伤害骰翻倍；掷出 1 必失（SRD）
CRIT_ROLL = 20
#: 默认最大回合数（超过判平/超时）
DEFAULT_MAX_ROUNDS = 30
