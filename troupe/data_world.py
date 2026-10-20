"""troupe.data_world - 世界层规则常量（地形 / 时间 / 难度 / GURPS 派生值）

数据来源与边界
--------------
* D&D 侧：取 **SRD 5.1**（Wizards of the Coast，CC-BY-4.0 开放内容）中明确公开的
  机制常量，例如典型难度等级表（5/10/15/20/25/30）、掩护加值（半身 +2 / 四分之三 +5）、
  旅行速度（慢/常/快 与 快步急行）。
* GURPS 侧：**只采用结构性公开事实**——四属性（ST/DX/IQ/HT）、3d6 掷低即成功、
  技能难度分档（易/普通/难/极难）、派生值（HP←ST，FP←HT，Will/Per←IQ，
  基础速度=(DX+HT)/4，闪避=floor(基础速度)+3）。**不搬运 Basic Set 的逐格数据表**；
  力量→伤害这类查表值改用下方明确标注的**近似外推公式**，服务于模拟器内部平衡。
"""
from __future__ import annotations

# =============================================================================
#  L1 难度档 → 各规则集的目标值
# =============================================================================
#: D&D：SRD 5.1「典型难度等级」——极易 5 / 容易 10 / 普通 15 / 困难 20 / 极难 25 / 近乎不可能 30
TIER_DC_DND5E = {
    "极易": 5,
    "容易": 10,
    "普通": 15,
    "困难": 20,
    "极难": 25,
    "近乎不可能": 30,
}

#: GURPS：难度档 → 情境修正（叠加到有效技能等级；3d6 掷低）
TIER_MOD_GURPS = {
    "极易": 6,
    "容易": 3,
    "普通": 0,
    "困难": -4,
    "极难": -8,
    "近乎不可能": -12,
}

#: GURPS：技能难度分档 → 相对基础属性的偏移（易 +0 / 普通 -1 / 难 -2 / 极难 -3）
GURPS_SKILL_DIFFICULTY = {"易": 0, "普通": -1, "难": -2, "极难": -3}

#: GURPS：技能等级购买成本（1 点 = 基础等级；+1 → 2 点；+2 → 4 点；此后每级 +4 点）
GURPS_SKILL_COST_STEPS = (1, 2, 4)


def gurps_skill_cost(relative_levels: int, difficulty: str = "普通") -> int:
    """购买到「相对基础等级 +n」所需累计点数。

    「普通」档（默认）保持项目既有简化阶梯：n<=0 → 1 点（仅掌握）；
    +1 → 2 点；+2 → 4 点；之后每级 +4 点。
    传入「易/难/极难」时按官方四档偏移阶梯（偏移 易=0 / 难=-2 / 极难=-3）：
    1 点 = 偏移档；2 点 = 偏移+1；4 点 = 偏移+2；此后每级 +4 点。
    """
    if difficulty == "普通":
        if relative_levels <= 0:
            return GURPS_SKILL_COST_STEPS[0]
        if relative_levels == 1:
            return GURPS_SKILL_COST_STEPS[1]
        if relative_levels == 2:
            return GURPS_SKILL_COST_STEPS[2]
        return GURPS_SKILL_COST_STEPS[2] + (relative_levels - 2) * 4
    offset = GURPS_SKILL_DIFFICULTY.get(difficulty)
    if offset is None:
        raise ValueError(f"未知技能难度档: {difficulty}（应为 易/普通/难/极难）")
    if relative_levels <= offset:
        return 1
    if relative_levels == offset + 1:
        return 2
    if relative_levels == offset + 2:
        return 4
    return 4 + (relative_levels - (offset + 2)) * 4


# =============================================================================
#  GURPS 派生值（结构性公式）
# =============================================================================
def basic_speed(dx: int, ht: int) -> float:
    """基础速度 = (DX + HT) / 4。"""
    return (dx + ht) / 4.0


def basic_move(dx: int, ht: int) -> int:
    """基础移动 = floor(基础速度)（负重等级 0 时）。"""
    return int(basic_speed(dx, ht))


def dodge(dx: int, ht: int, encumbrance: int = 0) -> int:
    """闪避 = floor(基础速度) + 3 - 负重惩罚。"""
    return max(1, basic_move(dx, ht) + 3 - max(0, encumbrance))


def _quantize(pips: float) -> tuple[int, int]:
    """把期望点数近似量化为 ``Nd±M`` 骰表达式（1 颗骰期望 3.5 点）。"""
    dice = max(1, int(round(pips / 3.5)))
    adds = int(round(pips - 3.5 * dice))
    return dice, adds


#: 力量 → 基础伤害（**模拟器内部近似外推**，非 Basic Set 伤害表照搬）。
#: 依据：GURPS 的突刺/挥砍伤害随 ST 近似线性增长（每 +1 ST 约 +1 点期望）。
#: 锚点：ST10 突刺 ≈ 1d-2（期望 1.5）、ST10 挥砍 ≈ 1d（期望 3.5）。
ST_DAMAGE_TABLE: dict[int, dict[str, tuple[int, int]]] = {
    st: {
        "突刺": _quantize(1.5 + (st - 10) * 1.0),
        "挥砍": _quantize(3.5 + (st - 10) * 1.0),
    }
    for st in range(1, 31)
}


def st_damage(st: int, kind: str = "突刺") -> tuple[int, int]:
    """返回 ``(骰数, 修正)``，如 ST14 突刺 → (2, -2) 表示 2d-2。"""
    st = max(1, min(30, int(st)))
    return ST_DAMAGE_TABLE[st].get(kind, (1, 4))


#: 伤害类型 → 伤口倍率（GURPS 结构性公开事实：穿刺 ×2 / 挥砍 ×1.5 / 钝击 ×1）
WOUND_MULTIPLIER = {
    "穿刺": 2.0, "挥砍": 1.5, "钝击": 1.0,
    "灼烧": 1.0, "腐蚀": 1.5,
}

#: 命中部位权重（3d6 组合数，左右肢合并）。部位表的组合数是可推算的公开事实。
HIT_LOCATIONS = [
    ("躯干", 52), ("腿", 61), ("手臂", 46), ("腹股沟", 27), ("手", 10),
    ("面部", 6), ("脚", 6), ("头骨", 4), ("颈部", 4),
]

#: 部位伤口加成（头骨 ×4、颈部 ×2，其余 1.0）
LOCATION_WOUND = {"头骨": 4.0, "颈部": 2.0, "面部": 1.5, "腹股沟": 1.5}


def roll_location(rand) -> str:
    """按部位权重随机一个命中部位（``rand`` 为可播种的 Random，保证可复现）。"""
    total = sum(w for _, w in HIT_LOCATIONS)
    x = rand.random() * total
    acc = 0.0
    for loc, w in HIT_LOCATIONS:
        acc += w
        if x <= acc:
            return loc
    return HIT_LOCATIONS[0][0]


def wound_multiplier(loc: str, dtype: str) -> float:
    """伤口倍率 = 类型倍率 × 部位加成；元素/能量类恒为 1.0。"""
    base = WOUND_MULTIPLIER.get(dtype)
    if base is None:
        return 1.0
    return base * LOCATION_WOUND.get(loc, 1.0)


# =============================================================================
#  GURPS 主动防御（Basic Set 结构性公开事实）
# =============================================================================
#: 主动防御公式（含「双武器/剑客」+1 特例的简化：默认不 +1）
def parry(weapon_skill: int, fencing_or_two_handed: bool = False) -> int:
    """招架 = 3 + 武器技能/2（向下取整）；剑客/双武器类可 +1（此处默认 0）。

    仅近战武器可招架；远程武器招架值记 0。
    """
    base = 3 + max(0, int(weapon_skill)) // 2
    return base + (1 if fencing_or_two_handed else 0)


def block(shield_skill: int) -> int:
    """格挡 = 3 + 盾技能/2（向下取整）。无盾记 0。"""
    return 3 + max(0, int(shield_skill)) // 2


def encumbrance_penalty(level: int) -> int:
    """负重等级（0=None/1=轻/2=中/3=重/4=超重）→ 闪避惩罚（等于等级本身）。"""
    return max(0, min(4, int(level)))


def gurps_encumbrance_level(st: int, weight_lbs: float) -> int:
    """由携带重量（磅）推算 GURPS 负重等级。

    Basic Lift = ST×ST/5 lb；阈值 None<BL、轻<2×BL、中<3×BL、重<6×BL、超重<10×BL。
    无装备数据时默认 0（None）。
    """
    if weight_lbs is None or weight_lbs <= 0:
        return 0
    bl = max(1.0, (st * st) / 5.0)
    if weight_lbs < 2 * bl:
        return 0
    if weight_lbs < 3 * bl:
        return 1
    if weight_lbs < 6 * bl:
        return 2
    if weight_lbs < 10 * bl:
        return 3
    return 4


def shock_penalty(injury: int) -> int:
    """休克惩罚 = 受伤点数的一半（向下取整），上限 4。

    作用于 DX 与 DX 系技能、主动防御，持续到受伤者下一回合开始。
    """
    return max(0, min(4, int(injury) // 2))


def knockdown_success(roll: int, st: int) -> bool:
    """击倒检定：掷 d6 ≤ ST 即站稳（未击倒）。命中腿/头骨或重伤时强制掷。"""
    return roll <= max(1, int(st))


# =============================================================================
#  GURPS 状态（condition）修正表
# =============================================================================
#: 条件 → 对检定的修正。``check`` 作用于所有 GURPS 检定（DX/IQ 系），
#  ``defense`` 额外作用于主动防御，``attack`` 作用于攻击命中检定，``skip`` 表示无法行动。
#: 来源：Basic Set 公开的状态效果（震慑 -4 DX、倒地 攻击-4/防御-3、盲目 -10 攻击/-6 防御、
#  束缚无法行动、眩晕 -2、失血持续掉血）。倒地精确值 trow 未译第十二/十三章，
#  以公开数值为准，⚠️ 待英文原书 B551 复核。
CONDITION_MODIFIERS_GURPS: dict[str, dict] = {
    "震慑":   {"check": -4, "defense": -4, "attack": -4},
    "眩晕":   {"check": -2, "defense": -2, "attack": -2},
    "倒地":   {"check": 0,  "defense": -3, "attack": -4},
    "盲目":   {"check": -6, "defense": -6, "attack": -10},
    "失能":   {"check": -2, "defense": -2, "attack": -4},
    "束缚":   {"check": 0,  "defense": 0,  "attack": 0, "skip": True},
    "流血":   {"check": 0,  "defense": 0,  "attack": 0},   # 持续掉血在战斗循环里处理
    "力竭":   {"check": -2, "defense": -2, "attack": -2},
    "恶心":   {"check": -2, "defense": -2, "attack": -2},
}


def condition_modifier_of(conditions, kind: str = "check") -> int:
    """汇总某角色所带条件对 ``kind``（check/defense/attack）的修正之和。"""
    if not conditions:
        return 0
    total = 0
    for c in conditions:
        mods = CONDITION_MODIFIERS_GURPS.get(c)
        if mods:
            total += int(mods.get(kind, 0))
    return total


def is_incapacitated(conditions) -> bool:
    """是否被条件限制到无法行动（如束缚）。"""
    return any(CONDITION_MODIFIERS_GURPS.get(c, {}).get("skip") for c in (conditions or []))

#: D&D：伤害类型归一（与 roleplayer.data_battle.normalize_damage_type 对齐）
DAMAGE_TYPES = (
    "穿刺", "挥砍", "钝击", "酸蚀", "寒冷", "火焰", "力场",
    "闪电", "死灵", "毒素", "心灵", "光耀", "雷鸣",
)

#: D&D：掩护（SRD 5.1）
COVER = {
    "半身": {"ac": 2, "dex_save": 2},
    "四分之三": {"ac": 5, "dex_save": 5},
    "全身": {"ac": None, "dex_save": None},
}


# =============================================================================
#  L2 地形 / 旅行
# =============================================================================
#: 地形 → (速度系数, 每日遭遇掷骰次数, 导航难度档, 迷路概率)
TERRAIN = {
    "道路":   {"speed": 1.25, "encounters_per_day": 1, "nav_tier": "极易", "lost_chance": 0.05},
    "平原":   {"speed": 1.00, "encounters_per_day": 2, "nav_tier": "容易", "lost_chance": 0.15},
    "森林":   {"speed": 0.75, "encounters_per_day": 2, "nav_tier": "普通", "lost_chance": 0.30},
    "丘陵":   {"speed": 0.75, "encounters_per_day": 2, "nav_tier": "普通", "lost_chance": 0.25},
    "山地":   {"speed": 0.50, "encounters_per_day": 3, "nav_tier": "困难", "lost_chance": 0.35},
    "沼泽":   {"speed": 0.50, "encounters_per_day": 3, "nav_tier": "困难", "lost_chance": 0.40},
    "沙漠":   {"speed": 0.75, "encounters_per_day": 2, "nav_tier": "困难", "lost_chance": 0.45},
    "水路":   {"speed": 1.00, "encounters_per_day": 1, "nav_tier": "容易", "lost_chance": 0.20},
    "地下":   {"speed": 0.50, "encounters_per_day": 3, "nav_tier": "困难", "lost_chance": 0.50},
}

#: 行进节奏 → 每日里程系数与代价（D&D 慢/常/快；快步为急行）
TRAVEL_PACE = {
    "慢":   {"mult": 0.67, "perception_penalty": 0, "stealth_ok": True},
    "常":   {"mult": 1.00, "perception_penalty": 0, "stealth_ok": False},
    "快":   {"mult": 1.33, "perception_penalty": -5, "stealth_ok": False},
    "急行": {"mult": 2.00, "perception_penalty": -5, "stealth_ok": False, "exhaustion": True},
}

#: 基础每日行进小时数（超时需做体质/HT 检定）
BASE_TRAVEL_HOURS = 8

#: 天气（按地形加权；影响遭遇与导航）
WEATHER = {
    "晴朗": {"nav_mod": 0, "encounter_mod": 0.0},
    "阴天": {"nav_mod": 0, "encounter_mod": 0.0},
    "细雨": {"nav_mod": -2, "encounter_mod": -0.1},
    "暴雨": {"nav_mod": -5, "encounter_mod": -0.3},
    "浓雾": {"nav_mod": -8, "encounter_mod": -0.2},
    "风雪": {"nav_mod": -8, "encounter_mod": -0.4},
}


# =============================================================================
#  时间成本（场景内行动的分钟数）
# =============================================================================
TIME_COST = {
    "search": 10,       # 搜查一个房间 / 一片区域
    "investigate": 10,  # 调查线索
    "persuade": 5,      # 一轮交涉
    "travel_hour": 60,
    "short_rest": 60,   # D&D 短休 1 小时
    "long_rest": 480,   # D&D 长休 8 小时
    "downtime_day": 1440,
    "explore_turn": 10, # 一个地下城探索回合
    "combat_round": 1,  # 战斗一回合 6 秒（按 1 分钟计便于记账）
}


# =============================================================================
#  NPC 姓名生成（中文姓 + 名，纯自造词表）
# =============================================================================
NPC_SURNAMES = (
    "沈", "陆", "崔", "裴", "燕", "霍", "容", "傅", "虞", "柯",
    "祁", "闵", "聂", "舒", "甄", "柏", "窦", "詹", "娄", "隋",
    # ---- P0 扩充（2026-08-30）----
    "祝", "温", "覃", "凌", "池", "解", "逄", "曲", "宁", "花",
    "蓝", "归", "闻人", "上官", "端木", "百里", "独孤", "西门", "东方", "慕容",
)
NPC_GIVEN_NAMES = (
    "砚", "照", "微", "临", "朔", "知", "野", "衔", "渡", "疏",
    "隅", "霁", "阔", "辞", "隐", "织", "烬", "屿", "朔风", "未晞",
    # ---- P0 扩充（2026-08-30）----
    "既明", "折柳", "见山", "听雨", "拾遗", "问樵", "观棋", "枕戈", "饮冰", "踏歌",
    "扶摇", "惊蛰", "白露", "霜降", "谷雨", "寒食", "望舒", "荧惑", "岁星", "启明",
)


# =============================================================================
#  L2 地点危险度 → 遭遇概率
# =============================================================================
#: 危险度 1..5 → 每次探索回合触发遭遇的基础概率
DANGER_ENCOUNTER_CHANCE = {1: 0.05, 2: 0.12, 3: 0.20, 4: 0.30, 5: 0.42}

#: 时段 → 遭遇概率系数
PHASE_ENCOUNTER_MOD = {"黎明": 0.8, "白天": 1.0, "黄昏": 1.1, "夜晚": 1.3}


__all__ = [
    "TIER_DC_DND5E", "TIER_MOD_GURPS", "GURPS_SKILL_DIFFICULTY",
    "gurps_skill_cost", "basic_speed", "basic_move", "dodge",
    "ST_DAMAGE_TABLE", "st_damage", "WOUND_MULTIPLIER", "DAMAGE_TYPES", "COVER",
    "HIT_LOCATIONS", "LOCATION_WOUND", "roll_location", "wound_multiplier",
    "parry", "block", "encumbrance_penalty", "gurps_encumbrance_level",
    "shock_penalty", "knockdown_success",
    "CONDITION_MODIFIERS_GURPS", "condition_modifier_of", "is_incapacitated",
    "TERRAIN", "TRAVEL_PACE", "BASE_TRAVEL_HOURS", "WEATHER",
    "NPC_SURNAMES", "NPC_GIVEN_NAMES",
    "TIME_COST", "DANGER_ENCOUNTER_CHANCE", "PHASE_ENCOUNTER_MOD",
]
