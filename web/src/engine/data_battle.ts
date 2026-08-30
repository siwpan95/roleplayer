/**
 * d20.web engine/data_battle - 模拟对战规则常量（遭遇构建/AI/伤害归一化）
 *
 * 由 Python d20.data_battle 经 JSON 直转生成，保证与 Python 单一事实来源逐字段一致
 * （前端/后端 SRD 内容零漂移）。如需修改，请在 Python 侧改动后经本生成脚本同步。
 */
export const XP_THRESHOLDS = {
  "1": {
    "easy": 25,
    "medium": 50,
    "hard": 75,
    "deadly": 100
  },
  "2": {
    "easy": 50,
    "medium": 100,
    "hard": 150,
    "deadly": 200
  },
  "3": {
    "easy": 75,
    "medium": 150,
    "hard": 225,
    "deadly": 400
  },
  "4": {
    "easy": 125,
    "medium": 250,
    "hard": 375,
    "deadly": 500
  },
  "5": {
    "easy": 250,
    "medium": 500,
    "hard": 750,
    "deadly": 1100
  },
  "6": {
    "easy": 300,
    "medium": 600,
    "hard": 900,
    "deadly": 1400
  },
  "7": {
    "easy": 350,
    "medium": 750,
    "hard": 1100,
    "deadly": 1700
  },
  "8": {
    "easy": 450,
    "medium": 900,
    "hard": 1400,
    "deadly": 2100
  },
  "9": {
    "easy": 550,
    "medium": 1100,
    "hard": 1600,
    "deadly": 2400
  },
  "10": {
    "easy": 600,
    "medium": 1200,
    "hard": 1900,
    "deadly": 2800
  },
  "11": {
    "easy": 800,
    "medium": 1600,
    "hard": 2400,
    "deadly": 3600
  },
  "12": {
    "easy": 1000,
    "medium": 2000,
    "hard": 3000,
    "deadly": 4500
  },
  "13": {
    "easy": 1100,
    "medium": 2200,
    "hard": 3400,
    "deadly": 5100
  },
  "14": {
    "easy": 1250,
    "medium": 2500,
    "hard": 3800,
    "deadly": 5700
  },
  "15": {
    "easy": 1400,
    "medium": 2800,
    "hard": 4300,
    "deadly": 6400
  },
  "16": {
    "easy": 1600,
    "medium": 3200,
    "hard": 4800,
    "deadly": 7200
  },
  "17": {
    "easy": 2000,
    "medium": 3900,
    "hard": 5900,
    "deadly": 8800
  },
  "18": {
    "easy": 2100,
    "medium": 4200,
    "hard": 6300,
    "deadly": 9500
  },
  "19": {
    "easy": 2400,
    "medium": 4900,
    "hard": 7300,
    "deadly": 10900
  },
  "20": {
    "easy": 2800,
    "medium": 5700,
    "hard": 8500,
    "deadly": 12700
  }
};

export const ENCOUNTER_MULTIPLIERS = [
  [
    1,
    1,
    1.0
  ],
  [
    2,
    2,
    1.5
  ],
  [
    3,
    6,
    2.0
  ],
  [
    7,
    10,
    2.5
  ],
  [
    11,
    14,
    3.0
  ],
  [
    15,
    1000000,
    4.0
  ]
];

export const DAILY_XP_BUDGET = {
  "1": 300,
  "2": 600,
  "3": 1200,
  "4": 1700,
  "5": 3500,
  "6": 4000,
  "7": 5000,
  "8": 6000,
  "9": 7500,
  "10": 9000,
  "11": 10500,
  "12": 11500,
  "13": 13500,
  "14": 15000,
  "15": 18000,
  "16": 20000,
  "17": 25000,
  "18": 27000,
  "19": 30000,
  "20": 40000
};

export const DIFFICULTIES = [
  "easy",
  "medium",
  "hard",
  "deadly"
];

// judgeDifficulty() 以 "trivial" 作为初始档：当调整后 XP 未越过任何阈值时返回它。
// 因此 DIFFICULTY_CN **必须**覆盖 trivial，否则 evaluate() 面对弱遭遇会抛
// KeyError 直接崩溃（与 Python 端 d20/data_battle.py 保持同步）。
export const DIFFICULTY_CN: Record<string, string> = {
  "trivial": "轻松",
  "easy": "简单",
  "medium": "中等",
  "hard": "困难",
  "deadly": "致命"
};

export const DAMAGE_TYPE_ALIAS = {
  "钝击": "钝击",
  "穿刺": "穿刺",
  "挥砍": "挥砍",
  "酸蚀": "酸蚀",
  "寒冷": "寒冷",
  "火焰": "火焰",
  "力场": "力场",
  "闪电": "闪电",
  "死灵": "死灵",
  "毒素": "毒素",
  "心灵": "心灵",
  "光耀": "光耀",
  "雷鸣": "雷鸣",
  "酸": "酸蚀",
  "冷": "寒冷",
  "火": "火焰",
  "电": "闪电",
  "毒": "毒素",
  "坏死": "死灵",
  "雷": "雷鸣",
  "slashing": "挥砍",
  "piercing": "穿刺",
  "bludgeoning": "钝击",
  "acid": "酸蚀",
  "cold": "寒冷",
  "fire": "火焰",
  "force": "力场",
  "lightning": "闪电",
  "necrotic": "死灵",
  "poison": "毒素",
  "psychic": "心灵",
  "radiant": "光耀",
  "thunder": "雷鸣"
};

export const CONDITION_KEYWORDS = {
  "blinded": "目盲",
  "charmed": "魅惑",
  "deafened": "耳聋",
  "frightened": "惊惧",
  "grappled": "擒抱",
  "incapacitated": "失能",
  "invisible": "隐形",
  "paralyzed": "麻痹",
  "petrified": "石化",
  "poisoned": "中毒",
  "prone": "倒地",
  "restrained": "束缚",
  "stunned": "震慑",
  "unconscious": "昏迷"
};

export const SAVE_ABILITY_MAP = {
  "strength": "fort",
  "constitution": "fort",
  "dexterity": "ref",
  "intelligence": "will",
  "wisdom": "will",
  "charisma": "will"
};

export const AI_ACTION_PRIORITY = {
  "condition": 0,
  "legendary": 1,
  "special": 2,
  "spell": 3,
  "ranged": 4,
  "melee": 5,
  "utility": 6
};

export const AI_WIS_WOUNDED_THRESHOLD = 12;

export const AI_INT_ADAPT_THRESHOLD = 10;

export const AI_INT_OPTIMAL_THRESHOLD = 18;

export const MELEE_REACH = 5;

export const DEFAULT_START_DISTANCE = 60;

export const DEATH_SAVE_TARGET = 10;

export const DEATH_SAVE_SUCCESSES = 3;

export const DEATH_SAVE_FAILURES = 3;

export const CRIT_ROLL = 20;

export const DEFAULT_MAX_ROUNDS = 30;

export const ROUND_SECONDS = 6;

