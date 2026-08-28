/**
 * d20.web engine/data_classes - SRD 职业系统（职业 / 等级成长 / 子职业 / 特性）
 *
 * 由 Python d20.data_classes 经 JSON 直转生成，保证与 Python 单一事实来源逐字段一致
 * （前端/后端 SRD 内容零漂移）。如需修改，请在 Python 侧改动后经本生成脚本同步。
 */
export const CLASSES: Record<string, any> = {
  "野蛮人": {
    "en": "Barbarian",
    "hit_die": 12,
    "primary": [
      "力量"
    ],
    "saves": [
      "强韧豁免"
    ],
    "saves_en": [
      "STR",
      "CON"
    ],
    "skill_profs": [],
    "skill_choices": [
      "驯兽",
      "运动",
      "恐吓",
      "知识(自然)",
      "侦察",
      "生存"
    ],
    "skill_choice_count": 2,
    "gear_profs": [
      "轻甲",
      "中甲",
      "盾牌",
      "简易武器",
      "军用武器"
    ],
    "gear_profs_en": [
      "Light Armor",
      "Medium Armor",
      "Shields",
      "Simple Weapons",
      "Martial Weapons"
    ],
    "spellcasting": null,
    "subclasses": [
      "狂战士道途"
    ]
  },
  "吟游诗人": {
    "en": "Bard",
    "hit_die": 8,
    "primary": [
      "魅力"
    ],
    "saves": [
      "反射豁免",
      "意志豁免"
    ],
    "saves_en": [
      "DEX",
      "CHA"
    ],
    "skill_profs": [],
    "skill_choices": [
      "杂技",
      "驯兽",
      "奥术知识",
      "运动",
      "欺瞒",
      "历史",
      "洞察",
      "恐吓",
      "调查",
      "医疗",
      "知识(自然)",
      "侦察",
      "表演",
      "说服",
      "宗教",
      "手上功夫",
      "躲藏",
      "生存"
    ],
    "skill_choice_count": 3,
    "gear_profs": [
      "轻甲",
      "简易武器",
      "长剑",
      "刺剑",
      "短剑",
      "手弩"
    ],
    "gear_profs_en": [
      "Light Armor",
      "Simple Weapons",
      "Longswords",
      "Rapiers",
      "Shortswords",
      "Hand crossbows"
    ],
    "spellcasting": {
      "ability": "魅力",
      "ability_en": "CHA",
      "progression": "full"
    },
    "subclasses": [
      "逸闻学院"
    ]
  },
  "牧师": {
    "en": "Cleric",
    "hit_die": 8,
    "primary": [
      "感知"
    ],
    "saves": [
      "意志豁免"
    ],
    "saves_en": [
      "WIS",
      "CHA"
    ],
    "skill_profs": [],
    "skill_choices": [
      "历史",
      "洞察",
      "医疗",
      "说服",
      "宗教"
    ],
    "skill_choice_count": 2,
    "gear_profs": [
      "轻甲",
      "中甲",
      "盾牌",
      "简易武器"
    ],
    "gear_profs_en": [
      "Light Armor",
      "Medium Armor",
      "Shields",
      "Simple Weapons"
    ],
    "spellcasting": {
      "ability": "感知",
      "ability_en": "WIS",
      "progression": "full"
    },
    "subclasses": [
      "生命领域"
    ]
  },
  "德鲁伊": {
    "en": "Druid",
    "hit_die": 8,
    "primary": [
      "感知"
    ],
    "saves": [
      "意志豁免"
    ],
    "saves_en": [
      "INT",
      "WIS"
    ],
    "skill_profs": [],
    "skill_choices": [
      "奥术知识",
      "驯兽",
      "洞察",
      "医疗",
      "知识(自然)",
      "侦察",
      "宗教",
      "生存"
    ],
    "skill_choice_count": 2,
    "gear_profs": [
      "轻甲",
      "中甲",
      "盾牌",
      "短棒",
      "匕首",
      "标枪",
      "硬头锤",
      "长棍",
      "镰刀",
      "矛",
      "飞镖",
      "投石索",
      "弯刀",
      "草药工具"
    ],
    "gear_profs_en": [
      "Light Armor",
      "Medium Armor",
      "Shields",
      "Clubs",
      "Daggers",
      "Javelins",
      "Maces",
      "Quarterstaffs",
      "Sickles",
      "Spears",
      "Darts",
      "Slings",
      "Scimitars",
      "Herbalism Kit"
    ],
    "spellcasting": {
      "ability": "感知",
      "ability_en": "WIS",
      "progression": "full"
    },
    "subclasses": [
      "大地结社"
    ]
  },
  "战士": {
    "en": "Fighter",
    "hit_die": 10,
    "primary": [
      "力量",
      "敏捷"
    ],
    "saves": [
      "强韧豁免"
    ],
    "saves_en": [
      "STR",
      "CON"
    ],
    "skill_profs": [],
    "skill_choices": [
      "杂技",
      "驯兽",
      "运动",
      "历史",
      "洞察",
      "恐吓",
      "侦察",
      "生存"
    ],
    "skill_choice_count": 2,
    "gear_profs": [
      "全部护甲",
      "盾牌",
      "简易武器",
      "军用武器"
    ],
    "gear_profs_en": [
      "All armor",
      "Shields",
      "Simple Weapons",
      "Martial Weapons"
    ],
    "spellcasting": null,
    "subclasses": [
      "勇士"
    ]
  },
  "武僧": {
    "en": "Monk",
    "hit_die": 8,
    "primary": [
      "敏捷",
      "感知"
    ],
    "saves": [
      "反射豁免",
      "强韧豁免"
    ],
    "saves_en": [
      "STR",
      "DEX"
    ],
    "skill_profs": [],
    "skill_choices": [
      "杂技",
      "运动",
      "历史",
      "洞察",
      "宗教",
      "躲藏"
    ],
    "skill_choice_count": 2,
    "gear_profs": [
      "简易武器",
      "短剑"
    ],
    "gear_profs_en": [
      "Simple Weapons",
      "Shortswords"
    ],
    "spellcasting": null,
    "subclasses": [
      "散打宗"
    ]
  },
  "圣武士": {
    "en": "Paladin",
    "hit_die": 10,
    "primary": [
      "力量",
      "魅力"
    ],
    "saves": [
      "意志豁免"
    ],
    "saves_en": [
      "WIS",
      "CHA"
    ],
    "skill_profs": [],
    "skill_choices": [
      "运动",
      "洞察",
      "恐吓",
      "医疗",
      "说服",
      "宗教"
    ],
    "skill_choice_count": 2,
    "gear_profs": [
      "全部护甲",
      "盾牌",
      "简易武器",
      "军用武器"
    ],
    "gear_profs_en": [
      "All armor",
      "Shields",
      "Simple Weapons",
      "Martial Weapons"
    ],
    "spellcasting": {
      "ability": "魅力",
      "ability_en": "CHA",
      "progression": "half"
    },
    "subclasses": [
      "奉献之誓"
    ]
  },
  "游侠": {
    "en": "Ranger",
    "hit_die": 10,
    "primary": [
      "敏捷",
      "感知"
    ],
    "saves": [
      "反射豁免",
      "强韧豁免"
    ],
    "saves_en": [
      "STR",
      "DEX"
    ],
    "skill_profs": [],
    "skill_choices": [
      "驯兽",
      "运动",
      "洞察",
      "调查",
      "知识(自然)",
      "侦察",
      "躲藏",
      "生存"
    ],
    "skill_choice_count": 3,
    "gear_profs": [
      "轻甲",
      "中甲",
      "盾牌",
      "简易武器",
      "军用武器"
    ],
    "gear_profs_en": [
      "Light Armor",
      "Medium Armor",
      "Shields",
      "Simple Weapons",
      "Martial Weapons"
    ],
    "spellcasting": {
      "ability": "感知",
      "ability_en": "WIS",
      "progression": "half"
    },
    "subclasses": [
      "猎人"
    ]
  },
  "游荡者": {
    "en": "Rogue",
    "hit_die": 8,
    "primary": [
      "敏捷"
    ],
    "saves": [
      "反射豁免",
      "意志豁免"
    ],
    "saves_en": [
      "DEX",
      "INT"
    ],
    "skill_profs": [],
    "skill_choices": [
      "杂技",
      "运动",
      "欺瞒",
      "洞察",
      "恐吓",
      "调查",
      "侦察",
      "表演",
      "说服",
      "手上功夫",
      "躲藏"
    ],
    "skill_choice_count": 4,
    "gear_profs": [
      "轻甲",
      "简易武器",
      "长剑",
      "刺剑",
      "短剑",
      "手弩",
      "盗贼工具"
    ],
    "gear_profs_en": [
      "Light Armor",
      "Simple Weapons",
      "Longswords",
      "Rapiers",
      "Shortswords",
      "Hand crossbows",
      "Thieves' Tools"
    ],
    "spellcasting": null,
    "subclasses": [
      "盗贼"
    ]
  },
  "术士": {
    "en": "Sorcerer",
    "hit_die": 6,
    "primary": [
      "魅力"
    ],
    "saves": [
      "强韧豁免",
      "意志豁免"
    ],
    "saves_en": [
      "CON",
      "CHA"
    ],
    "skill_profs": [],
    "skill_choices": [
      "奥术知识",
      "欺瞒",
      "洞察",
      "恐吓",
      "说服",
      "宗教"
    ],
    "skill_choice_count": 2,
    "gear_profs": [
      "匕首",
      "飞镖",
      "投石索",
      "长棍",
      "轻弩"
    ],
    "gear_profs_en": [
      "Daggers",
      "Darts",
      "Slings",
      "Quarterstaffs",
      "Crossbows, light"
    ],
    "spellcasting": {
      "ability": "魅力",
      "ability_en": "CHA",
      "progression": "full"
    },
    "subclasses": [
      "龙族血脉"
    ]
  },
  "魔契师": {
    "en": "Warlock",
    "hit_die": 8,
    "primary": [
      "魅力"
    ],
    "saves": [
      "意志豁免"
    ],
    "saves_en": [
      "WIS",
      "CHA"
    ],
    "skill_profs": [],
    "skill_choices": [
      "奥术知识",
      "欺瞒",
      "历史",
      "恐吓",
      "调查",
      "知识(自然)",
      "宗教"
    ],
    "skill_choice_count": 2,
    "gear_profs": [
      "轻甲",
      "简易武器"
    ],
    "gear_profs_en": [
      "Light Armor",
      "Simple Weapons"
    ],
    "spellcasting": {
      "ability": "魅力",
      "ability_en": "CHA",
      "progression": "pact"
    },
    "subclasses": [
      "邪魔宗主"
    ]
  },
  "法师": {
    "en": "Wizard",
    "hit_die": 6,
    "primary": [
      "智力"
    ],
    "saves": [
      "意志豁免"
    ],
    "saves_en": [
      "INT",
      "WIS"
    ],
    "skill_profs": [],
    "skill_choices": [
      "奥术知识",
      "历史",
      "洞察",
      "调查",
      "医疗",
      "宗教"
    ],
    "skill_choice_count": 2,
    "gear_profs": [
      "匕首",
      "飞镖",
      "投石索",
      "长棍",
      "轻弩"
    ],
    "gear_profs_en": [
      "Daggers",
      "Darts",
      "Slings",
      "Quarterstaffs",
      "Crossbows, light"
    ],
    "spellcasting": {
      "ability": "智力",
      "ability_en": "INT",
      "progression": "full"
    },
    "subclasses": [
      "塑能学派"
    ]
  }
};

export const CLASS_LEVELS: Record<string, Record<string, any>> = {
  "野蛮人": {
    "1": {
      "level": 1,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "狂暴",
        "无甲防御"
      ],
      "spellcasting": null,
      "class_specific": {
        "rage_count": 2,
        "rage_damage_bonus": 2,
        "brutal_critical_dice": 0
      }
    },
    "2": {
      "level": 2,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "鲁莽攻击",
        "危险感知"
      ],
      "spellcasting": null,
      "class_specific": {
        "rage_count": 2,
        "rage_damage_bonus": 2,
        "brutal_critical_dice": 0
      }
    },
    "3": {
      "level": 3,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "原初道途"
      ],
      "spellcasting": null,
      "class_specific": {
        "rage_count": 3,
        "rage_damage_bonus": 2,
        "brutal_critical_dice": 0
      }
    },
    "4": {
      "level": 4,
      "prof_bonus": 2,
      "ability_score_bonuses": 1,
      "features": [
        "属性提升"
      ],
      "spellcasting": null,
      "class_specific": {
        "rage_count": 3,
        "rage_damage_bonus": 2,
        "brutal_critical_dice": 0
      }
    },
    "5": {
      "level": 5,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [
        "额外攻击",
        "疾行"
      ],
      "spellcasting": null,
      "class_specific": {
        "rage_count": 3,
        "rage_damage_bonus": 2,
        "brutal_critical_dice": 0
      }
    },
    "6": {
      "level": 6,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [
        "道途特性"
      ],
      "spellcasting": null,
      "class_specific": {
        "rage_count": 4,
        "rage_damage_bonus": 2,
        "brutal_critical_dice": 0
      }
    },
    "7": {
      "level": 7,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [
        "野性直觉"
      ],
      "spellcasting": null,
      "class_specific": {
        "rage_count": 4,
        "rage_damage_bonus": 2,
        "brutal_critical_dice": 0
      }
    },
    "8": {
      "level": 8,
      "prof_bonus": 3,
      "ability_score_bonuses": 2,
      "features": [
        "属性提升"
      ],
      "spellcasting": null,
      "class_specific": {
        "rage_count": 4,
        "rage_damage_bonus": 2,
        "brutal_critical_dice": 0
      }
    },
    "9": {
      "level": 9,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [
        "残暴重击（1骰）"
      ],
      "spellcasting": null,
      "class_specific": {
        "rage_count": 4,
        "rage_damage_bonus": 3,
        "brutal_critical_dice": 1
      }
    },
    "10": {
      "level": 10,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [
        "道途特性"
      ],
      "spellcasting": null,
      "class_specific": {
        "rage_count": 4,
        "rage_damage_bonus": 3,
        "brutal_critical_dice": 1
      }
    },
    "11": {
      "level": 11,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [
        "不懈狂暴"
      ],
      "spellcasting": null,
      "class_specific": {
        "rage_count": 4,
        "rage_damage_bonus": 3,
        "brutal_critical_dice": 1
      }
    },
    "12": {
      "level": 12,
      "prof_bonus": 4,
      "ability_score_bonuses": 3,
      "features": [
        "属性提升"
      ],
      "spellcasting": null,
      "class_specific": {
        "rage_count": 5,
        "rage_damage_bonus": 3,
        "brutal_critical_dice": 1
      }
    },
    "13": {
      "level": 13,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [
        "残暴重击（2骰）"
      ],
      "spellcasting": null,
      "class_specific": {
        "rage_count": 5,
        "rage_damage_bonus": 3,
        "brutal_critical_dice": 2
      }
    },
    "14": {
      "level": 14,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [
        "道途特性"
      ],
      "spellcasting": null,
      "class_specific": {
        "rage_count": 5,
        "rage_damage_bonus": 3,
        "brutal_critical_dice": 2
      }
    },
    "15": {
      "level": 15,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [
        "持续狂暴"
      ],
      "spellcasting": null,
      "class_specific": {
        "rage_count": 5,
        "rage_damage_bonus": 3,
        "brutal_critical_dice": 2
      }
    },
    "16": {
      "level": 16,
      "prof_bonus": 5,
      "ability_score_bonuses": 4,
      "features": [
        "属性提升"
      ],
      "spellcasting": null,
      "class_specific": {
        "rage_count": 5,
        "rage_damage_bonus": 4,
        "brutal_critical_dice": 2
      }
    },
    "17": {
      "level": 17,
      "prof_bonus": 6,
      "ability_score_bonuses": 4,
      "features": [
        "残暴重击（3骰）"
      ],
      "spellcasting": null,
      "class_specific": {
        "rage_count": 6,
        "rage_damage_bonus": 4,
        "brutal_critical_dice": 3
      }
    },
    "18": {
      "level": 18,
      "prof_bonus": 6,
      "ability_score_bonuses": 4,
      "features": [
        "不屈之力"
      ],
      "spellcasting": null,
      "class_specific": {
        "rage_count": 6,
        "rage_damage_bonus": 4,
        "brutal_critical_dice": 3
      }
    },
    "19": {
      "level": 19,
      "prof_bonus": 6,
      "ability_score_bonuses": 5,
      "features": [
        "属性提升"
      ],
      "spellcasting": null,
      "class_specific": {
        "rage_count": 6,
        "rage_damage_bonus": 4,
        "brutal_critical_dice": 3
      }
    },
    "20": {
      "level": 20,
      "prof_bonus": 6,
      "ability_score_bonuses": 5,
      "features": [
        "原初勇士"
      ],
      "spellcasting": null,
      "class_specific": {
        "rage_count": 9999,
        "rage_damage_bonus": 4,
        "brutal_critical_dice": 3
      }
    }
  },
  "吟游诗人": {
    "1": {
      "level": 1,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "施法：吟游诗人",
        "诗人激励（d6）"
      ],
      "spellcasting": {
        "cantrips_known": 2,
        "spells_known": 4,
        "slots": {
          "1": 2
        }
      },
      "class_specific": {
        "bardic_inspiration_die": 6,
        "song_of_rest_die": 0,
        "magical_secrets_max_5": 0,
        "magical_secrets_max_7": 0,
        "magical_secrets_max_9": 0
      }
    },
    "2": {
      "level": 2,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "万事通",
        "休憩之歌（d6）"
      ],
      "spellcasting": {
        "cantrips_known": 2,
        "spells_known": 5,
        "slots": {
          "1": 3
        }
      },
      "class_specific": {
        "bardic_inspiration_die": 6,
        "song_of_rest_die": 6,
        "magical_secrets_max_5": 0,
        "magical_secrets_max_7": 0,
        "magical_secrets_max_9": 0
      }
    },
    "3": {
      "level": 3,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "专精造诣",
        "吟游诗人学院"
      ],
      "spellcasting": {
        "cantrips_known": 2,
        "spells_known": 6,
        "slots": {
          "1": 4,
          "2": 2
        }
      },
      "class_specific": {
        "bardic_inspiration_die": 6,
        "song_of_rest_die": 6,
        "magical_secrets_max_5": 0,
        "magical_secrets_max_7": 0,
        "magical_secrets_max_9": 0
      }
    },
    "4": {
      "level": 4,
      "prof_bonus": 2,
      "ability_score_bonuses": 1,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 3,
        "spells_known": 7,
        "slots": {
          "1": 4,
          "2": 3
        }
      },
      "class_specific": {
        "bardic_inspiration_die": 6,
        "song_of_rest_die": 6,
        "magical_secrets_max_5": 0,
        "magical_secrets_max_7": 0,
        "magical_secrets_max_9": 0
      }
    },
    "5": {
      "level": 5,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [
        "诗人激励（d8）",
        "激励之泉"
      ],
      "spellcasting": {
        "cantrips_known": 3,
        "spells_known": 8,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 2
        }
      },
      "class_specific": {
        "bardic_inspiration_die": 8,
        "song_of_rest_die": 6,
        "magical_secrets_max_5": 0,
        "magical_secrets_max_7": 0,
        "magical_secrets_max_9": 0
      }
    },
    "6": {
      "level": 6,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [
        "破咒之歌",
        "吟游诗人学院特性"
      ],
      "spellcasting": {
        "cantrips_known": 3,
        "spells_known": 9,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3
        }
      },
      "class_specific": {
        "bardic_inspiration_die": 8,
        "song_of_rest_die": 6,
        "magical_secrets_max_5": 0,
        "magical_secrets_max_7": 0,
        "magical_secrets_max_9": 0
      }
    },
    "7": {
      "level": 7,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [],
      "spellcasting": {
        "cantrips_known": 3,
        "spells_known": 10,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 1
        }
      },
      "class_specific": {
        "bardic_inspiration_die": 8,
        "song_of_rest_die": 6,
        "magical_secrets_max_5": 0,
        "magical_secrets_max_7": 0,
        "magical_secrets_max_9": 0
      }
    },
    "8": {
      "level": 8,
      "prof_bonus": 3,
      "ability_score_bonuses": 2,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 3,
        "spells_known": 11,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 2
        }
      },
      "class_specific": {
        "bardic_inspiration_die": 8,
        "song_of_rest_die": 6,
        "magical_secrets_max_5": 0,
        "magical_secrets_max_7": 0,
        "magical_secrets_max_9": 0
      }
    },
    "9": {
      "level": 9,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [
        "休憩之歌（d8）"
      ],
      "spellcasting": {
        "cantrips_known": 3,
        "spells_known": 12,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 1
        }
      },
      "class_specific": {
        "bardic_inspiration_die": 8,
        "song_of_rest_die": 8,
        "magical_secrets_max_5": 0,
        "magical_secrets_max_7": 0,
        "magical_secrets_max_9": 0
      }
    },
    "10": {
      "level": 10,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [
        "专精造诣",
        "诗人激励（d10）",
        "秘学知识"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 14,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2
        }
      },
      "class_specific": {
        "bardic_inspiration_die": 10,
        "song_of_rest_die": 8,
        "magical_secrets_max_5": 2,
        "magical_secrets_max_7": 0,
        "magical_secrets_max_9": 0
      }
    },
    "11": {
      "level": 11,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 15,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1
        }
      },
      "class_specific": {
        "bardic_inspiration_die": 10,
        "song_of_rest_die": 8,
        "magical_secrets_max_5": 2,
        "magical_secrets_max_7": 0,
        "magical_secrets_max_9": 0
      }
    },
    "12": {
      "level": 12,
      "prof_bonus": 4,
      "ability_score_bonuses": 3,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 15,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1
        }
      },
      "class_specific": {
        "bardic_inspiration_die": 10,
        "song_of_rest_die": 8,
        "magical_secrets_max_5": 2,
        "magical_secrets_max_7": 0,
        "magical_secrets_max_9": 0
      }
    },
    "13": {
      "level": 13,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [
        "休憩之歌（d10）"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 16,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1,
          "7": 1
        }
      },
      "class_specific": {
        "bardic_inspiration_die": 10,
        "song_of_rest_die": 10,
        "magical_secrets_max_5": 2,
        "magical_secrets_max_7": 0,
        "magical_secrets_max_9": 0
      }
    },
    "14": {
      "level": 14,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [
        "秘学知识",
        "吟游诗人学院特性"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 18,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1,
          "7": 1
        }
      },
      "class_specific": {
        "bardic_inspiration_die": 10,
        "song_of_rest_die": 10,
        "magical_secrets_max_5": 2,
        "magical_secrets_max_7": 2,
        "magical_secrets_max_9": 0
      }
    },
    "15": {
      "level": 15,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [
        "诗人激励（d12）"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 19,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1,
          "7": 1,
          "8": 1
        }
      },
      "class_specific": {
        "bardic_inspiration_die": 12,
        "song_of_rest_die": 10,
        "magical_secrets_max_5": 2,
        "magical_secrets_max_7": 2,
        "magical_secrets_max_9": 0
      }
    },
    "16": {
      "level": 16,
      "prof_bonus": 5,
      "ability_score_bonuses": 4,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 19,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1,
          "7": 1,
          "8": 1
        }
      },
      "class_specific": {
        "bardic_inspiration_die": 12,
        "song_of_rest_die": 10,
        "magical_secrets_max_5": 2,
        "magical_secrets_max_7": 2,
        "magical_secrets_max_9": 0
      }
    },
    "17": {
      "level": 17,
      "prof_bonus": 6,
      "ability_score_bonuses": 4,
      "features": [
        "休憩之歌（d12）"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 20,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1,
          "7": 1,
          "8": 1,
          "9": 1
        }
      },
      "class_specific": {
        "bardic_inspiration_die": 12,
        "song_of_rest_die": 12,
        "magical_secrets_max_5": 2,
        "magical_secrets_max_7": 2,
        "magical_secrets_max_9": 0
      }
    },
    "18": {
      "level": 18,
      "prof_bonus": 6,
      "ability_score_bonuses": 4,
      "features": [
        "秘学知识"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 22,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 3,
          "6": 1,
          "7": 1,
          "8": 1,
          "9": 1
        }
      },
      "class_specific": {
        "bardic_inspiration_die": 12,
        "song_of_rest_die": 12,
        "magical_secrets_max_5": 2,
        "magical_secrets_max_7": 2,
        "magical_secrets_max_9": 2
      }
    },
    "19": {
      "level": 19,
      "prof_bonus": 6,
      "ability_score_bonuses": 5,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 22,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 3,
          "6": 2,
          "7": 1,
          "8": 1,
          "9": 1
        }
      },
      "class_specific": {
        "bardic_inspiration_die": 12,
        "song_of_rest_die": 12,
        "magical_secrets_max_5": 2,
        "magical_secrets_max_7": 2,
        "magical_secrets_max_9": 2
      }
    },
    "20": {
      "level": 20,
      "prof_bonus": 6,
      "ability_score_bonuses": 5,
      "features": [
        "高级激励"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 22,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 3,
          "6": 2,
          "7": 2,
          "8": 1,
          "9": 1
        }
      },
      "class_specific": {
        "bardic_inspiration_die": 12,
        "song_of_rest_die": 12,
        "magical_secrets_max_5": 2,
        "magical_secrets_max_7": 2,
        "magical_secrets_max_9": 2
      }
    }
  },
  "牧师": {
    "1": {
      "level": 1,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "施法：牧师",
        "神术领域",
        "领域法术"
      ],
      "spellcasting": {
        "cantrips_known": 3,
        "spells_known": 0,
        "slots": {
          "1": 2
        }
      },
      "class_specific": {
        "channel_divinity_charges": 0,
        "destroy_undead_cr": 0
      }
    },
    "2": {
      "level": 2,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "引导神力（1次/休整）",
        "引导神力：驱散不死生物",
        "神术领域特性"
      ],
      "spellcasting": {
        "cantrips_known": 3,
        "spells_known": 0,
        "slots": {
          "1": 3
        }
      },
      "class_specific": {
        "channel_divinity_charges": 1,
        "destroy_undead_cr": 0
      }
    },
    "3": {
      "level": 3,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "领域法术"
      ],
      "spellcasting": {
        "cantrips_known": 3,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 2
        }
      },
      "class_specific": {
        "channel_divinity_charges": 1,
        "destroy_undead_cr": 0
      }
    },
    "4": {
      "level": 4,
      "prof_bonus": 2,
      "ability_score_bonuses": 1,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3
        }
      },
      "class_specific": {
        "channel_divinity_charges": 1,
        "destroy_undead_cr": 0
      }
    },
    "5": {
      "level": 5,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [
        "领域法术",
        "摧毁不死生物（CR 1/2 or below）"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 2
        }
      },
      "class_specific": {
        "channel_divinity_charges": 1,
        "destroy_undead_cr": 0.5
      }
    },
    "6": {
      "level": 6,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [
        "引导神力（2次/休整）",
        "神术领域特性"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3
        }
      },
      "class_specific": {
        "channel_divinity_charges": 2,
        "destroy_undead_cr": 0.5
      }
    },
    "7": {
      "level": 7,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [
        "领域法术"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 1
        }
      },
      "class_specific": {
        "channel_divinity_charges": 2,
        "destroy_undead_cr": 0.5
      }
    },
    "8": {
      "level": 8,
      "prof_bonus": 3,
      "ability_score_bonuses": 2,
      "features": [
        "属性提升",
        "摧毁不死生物（CR 1 or below）",
        "神术领域特性"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 2
        }
      },
      "class_specific": {
        "channel_divinity_charges": 2,
        "destroy_undead_cr": 1
      }
    },
    "9": {
      "level": 9,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [
        "领域法术"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 1
        }
      },
      "class_specific": {
        "channel_divinity_charges": 2,
        "destroy_undead_cr": 1
      }
    },
    "10": {
      "level": 10,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [
        "神力干预"
      ],
      "spellcasting": {
        "cantrips_known": 5,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2
        }
      },
      "class_specific": {
        "channel_divinity_charges": 2,
        "destroy_undead_cr": 1
      }
    },
    "11": {
      "level": 11,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [
        "摧毁不死生物（CR 2 or below）"
      ],
      "spellcasting": {
        "cantrips_known": 5,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1
        }
      },
      "class_specific": {
        "channel_divinity_charges": 2,
        "destroy_undead_cr": 2
      }
    },
    "12": {
      "level": 12,
      "prof_bonus": 4,
      "ability_score_bonuses": 3,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 5,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1
        }
      },
      "class_specific": {
        "channel_divinity_charges": 2,
        "destroy_undead_cr": 2
      }
    },
    "13": {
      "level": 13,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [],
      "spellcasting": {
        "cantrips_known": 5,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1,
          "7": 1
        }
      },
      "class_specific": {
        "channel_divinity_charges": 2,
        "destroy_undead_cr": 2
      }
    },
    "14": {
      "level": 14,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [
        "摧毁不死生物（CR 3 or below）"
      ],
      "spellcasting": {
        "cantrips_known": 5,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1,
          "7": 1
        }
      },
      "class_specific": {
        "channel_divinity_charges": 2,
        "destroy_undead_cr": 3
      }
    },
    "15": {
      "level": 15,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [],
      "spellcasting": {
        "cantrips_known": 5,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1,
          "7": 1,
          "8": 1
        }
      },
      "class_specific": {
        "channel_divinity_charges": 2,
        "destroy_undead_cr": 3
      }
    },
    "16": {
      "level": 16,
      "prof_bonus": 5,
      "ability_score_bonuses": 4,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 5,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1,
          "7": 1,
          "8": 1
        }
      },
      "class_specific": {
        "channel_divinity_charges": 2,
        "destroy_undead_cr": 3
      }
    },
    "17": {
      "level": 17,
      "prof_bonus": 6,
      "ability_score_bonuses": 4,
      "features": [
        "摧毁不死生物（CR 4 or below）",
        "神术领域特性"
      ],
      "spellcasting": {
        "cantrips_known": 5,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1,
          "7": 1,
          "8": 1,
          "9": 1
        }
      },
      "class_specific": {
        "channel_divinity_charges": 2,
        "destroy_undead_cr": 4
      }
    },
    "18": {
      "level": 18,
      "prof_bonus": 6,
      "ability_score_bonuses": 4,
      "features": [
        "引导神力（3次/休整）"
      ],
      "spellcasting": {
        "cantrips_known": 5,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 3,
          "6": 1,
          "7": 1,
          "8": 1,
          "9": 1
        }
      },
      "class_specific": {
        "channel_divinity_charges": 3,
        "destroy_undead_cr": 4
      }
    },
    "19": {
      "level": 19,
      "prof_bonus": 6,
      "ability_score_bonuses": 5,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 5,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 3,
          "6": 2,
          "7": 1,
          "8": 1,
          "9": 1
        }
      },
      "class_specific": {
        "channel_divinity_charges": 3,
        "destroy_undead_cr": 4
      }
    },
    "20": {
      "level": 20,
      "prof_bonus": 6,
      "ability_score_bonuses": 5,
      "features": [
        "神力干预强化"
      ],
      "spellcasting": {
        "cantrips_known": 5,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 3,
          "6": 2,
          "7": 2,
          "8": 1,
          "9": 1
        }
      },
      "class_specific": {
        "channel_divinity_charges": 3,
        "destroy_undead_cr": 4
      }
    }
  },
  "德鲁伊": {
    "1": {
      "level": 1,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "施法：德鲁伊",
        "德鲁伊语"
      ],
      "spellcasting": {
        "cantrips_known": 2,
        "spells_known": 0,
        "slots": {
          "1": 2
        }
      },
      "class_specific": {
        "wild_shape_max_cr": 0,
        "wild_shape_swim": false,
        "wild_shape_fly": false
      }
    },
    "2": {
      "level": 2,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "荒野形态（CR 1/4 or below, no flying or swim speed）",
        "德鲁伊结社"
      ],
      "spellcasting": {
        "cantrips_known": 2,
        "spells_known": 0,
        "slots": {
          "1": 3
        }
      },
      "class_specific": {
        "wild_shape_max_cr": 0.25,
        "wild_shape_swim": false,
        "wild_shape_fly": false
      }
    },
    "3": {
      "level": 3,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [],
      "spellcasting": {
        "cantrips_known": 2,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 2
        }
      },
      "class_specific": {
        "wild_shape_max_cr": 0.25,
        "wild_shape_swim": false,
        "wild_shape_fly": false
      }
    },
    "4": {
      "level": 4,
      "prof_bonus": 2,
      "ability_score_bonuses": 1,
      "features": [
        "荒野形态（CR 1/2 or below, no flying speed）",
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 3,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3
        }
      },
      "class_specific": {
        "wild_shape_max_cr": 0.5,
        "wild_shape_swim": true,
        "wild_shape_fly": false
      }
    },
    "5": {
      "level": 5,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [],
      "spellcasting": {
        "cantrips_known": 3,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 2
        }
      },
      "class_specific": {
        "wild_shape_max_cr": 0.5,
        "wild_shape_swim": true,
        "wild_shape_fly": false
      }
    },
    "6": {
      "level": 6,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [
        "德鲁伊结社特性"
      ],
      "spellcasting": {
        "cantrips_known": 3,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3
        }
      },
      "class_specific": {
        "wild_shape_max_cr": 0.5,
        "wild_shape_swim": true,
        "wild_shape_fly": false
      }
    },
    "7": {
      "level": 7,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [],
      "spellcasting": {
        "cantrips_known": 3,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 1
        }
      },
      "class_specific": {
        "wild_shape_max_cr": 1,
        "wild_shape_swim": true,
        "wild_shape_fly": false
      }
    },
    "8": {
      "level": 8,
      "prof_bonus": 3,
      "ability_score_bonuses": 2,
      "features": [
        "荒野形态（CR 1 or below）",
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 3,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 2
        }
      },
      "class_specific": {
        "wild_shape_max_cr": 1,
        "wild_shape_swim": true,
        "wild_shape_fly": true
      }
    },
    "9": {
      "level": 9,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [],
      "spellcasting": {
        "cantrips_known": 3,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 1
        }
      },
      "class_specific": {
        "wild_shape_max_cr": 1,
        "wild_shape_swim": true,
        "wild_shape_fly": true
      }
    },
    "10": {
      "level": 10,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [
        "德鲁伊结社特性"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2
        }
      },
      "class_specific": {
        "wild_shape_max_cr": 1,
        "wild_shape_swim": true,
        "wild_shape_fly": true
      }
    },
    "11": {
      "level": 11,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1
        }
      },
      "class_specific": {
        "wild_shape_max_cr": 1,
        "wild_shape_swim": true,
        "wild_shape_fly": true
      }
    },
    "12": {
      "level": 12,
      "prof_bonus": 4,
      "ability_score_bonuses": 3,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1
        }
      },
      "class_specific": {
        "wild_shape_max_cr": 1,
        "wild_shape_swim": true,
        "wild_shape_fly": true
      }
    },
    "13": {
      "level": 13,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1,
          "7": 1
        }
      },
      "class_specific": {
        "wild_shape_max_cr": 1,
        "wild_shape_swim": true,
        "wild_shape_fly": true
      }
    },
    "14": {
      "level": 14,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [
        "德鲁伊结社特性"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1,
          "7": 1
        }
      },
      "class_specific": {
        "wild_shape_max_cr": 1,
        "wild_shape_swim": true,
        "wild_shape_fly": true
      }
    },
    "15": {
      "level": 15,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1,
          "7": 1,
          "8": 1
        }
      },
      "class_specific": {
        "wild_shape_max_cr": 1,
        "wild_shape_swim": true,
        "wild_shape_fly": true
      }
    },
    "16": {
      "level": 16,
      "prof_bonus": 5,
      "ability_score_bonuses": 4,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1,
          "7": 1,
          "8": 1
        }
      },
      "class_specific": {
        "wild_shape_max_cr": 1,
        "wild_shape_swim": true,
        "wild_shape_fly": true
      }
    },
    "17": {
      "level": 17,
      "prof_bonus": 6,
      "ability_score_bonuses": 4,
      "features": [],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1,
          "7": 1,
          "8": 1,
          "9": 1
        }
      },
      "class_specific": {
        "wild_shape_max_cr": 1,
        "wild_shape_swim": true,
        "wild_shape_fly": true
      }
    },
    "18": {
      "level": 18,
      "prof_bonus": 6,
      "ability_score_bonuses": 4,
      "features": [
        "不朽之躯",
        "野兽法术"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 3,
          "6": 1,
          "7": 1,
          "8": 1,
          "9": 1
        }
      },
      "class_specific": {
        "wild_shape_max_cr": 1,
        "wild_shape_swim": true,
        "wild_shape_fly": true
      }
    },
    "19": {
      "level": 19,
      "prof_bonus": 6,
      "ability_score_bonuses": 5,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 3,
          "6": 2,
          "7": 1,
          "8": 1,
          "9": 1
        }
      },
      "class_specific": {
        "wild_shape_max_cr": 1,
        "wild_shape_swim": true,
        "wild_shape_fly": true
      }
    },
    "20": {
      "level": 20,
      "prof_bonus": 6,
      "ability_score_bonuses": 5,
      "features": [
        "大德鲁伊"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 3,
          "6": 2,
          "7": 2,
          "8": 1,
          "9": 1
        }
      },
      "class_specific": {
        "wild_shape_max_cr": 1,
        "wild_shape_swim": true,
        "wild_shape_fly": true
      }
    }
  },
  "战士": {
    "1": {
      "level": 1,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "战斗风格",
        "再起之风"
      ],
      "spellcasting": null,
      "class_specific": {
        "action_surges": 0,
        "indomitable_uses": 0,
        "extra_attacks": 0
      }
    },
    "2": {
      "level": 2,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "行动如潮（1次）"
      ],
      "spellcasting": null,
      "class_specific": {
        "action_surges": 1,
        "indomitable_uses": 0,
        "extra_attacks": 0
      }
    },
    "3": {
      "level": 3,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "武术范型"
      ],
      "spellcasting": null,
      "class_specific": {
        "action_surges": 1,
        "indomitable_uses": 0,
        "extra_attacks": 0
      }
    },
    "4": {
      "level": 4,
      "prof_bonus": 2,
      "ability_score_bonuses": 1,
      "features": [
        "属性提升"
      ],
      "spellcasting": null,
      "class_specific": {
        "action_surges": 1,
        "indomitable_uses": 0,
        "extra_attacks": 0
      }
    },
    "5": {
      "level": 5,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [
        "额外攻击"
      ],
      "spellcasting": null,
      "class_specific": {
        "action_surges": 1,
        "indomitable_uses": 0,
        "extra_attacks": 1
      }
    },
    "6": {
      "level": 6,
      "prof_bonus": 3,
      "ability_score_bonuses": 2,
      "features": [
        "属性提升"
      ],
      "spellcasting": null,
      "class_specific": {
        "action_surges": 1,
        "indomitable_uses": 0,
        "extra_attacks": 1
      }
    },
    "7": {
      "level": 7,
      "prof_bonus": 3,
      "ability_score_bonuses": 2,
      "features": [
        "武术范型特性"
      ],
      "spellcasting": null,
      "class_specific": {
        "action_surges": 1,
        "indomitable_uses": 0,
        "extra_attacks": 1
      }
    },
    "8": {
      "level": 8,
      "prof_bonus": 3,
      "ability_score_bonuses": 3,
      "features": [
        "属性提升"
      ],
      "spellcasting": null,
      "class_specific": {
        "action_surges": 1,
        "indomitable_uses": 0,
        "extra_attacks": 1
      }
    },
    "9": {
      "level": 9,
      "prof_bonus": 4,
      "ability_score_bonuses": 3,
      "features": [
        "不屈（1次）"
      ],
      "spellcasting": null,
      "class_specific": {
        "action_surges": 1,
        "indomitable_uses": 1,
        "extra_attacks": 1
      }
    },
    "10": {
      "level": 10,
      "prof_bonus": 4,
      "ability_score_bonuses": 3,
      "features": [
        "武术范型特性"
      ],
      "spellcasting": null,
      "class_specific": {
        "action_surges": 1,
        "indomitable_uses": 1,
        "extra_attacks": 1
      }
    },
    "11": {
      "level": 11,
      "prof_bonus": 4,
      "ability_score_bonuses": 3,
      "features": [
        "额外攻击（2）"
      ],
      "spellcasting": null,
      "class_specific": {
        "action_surges": 1,
        "indomitable_uses": 1,
        "extra_attacks": 2
      }
    },
    "12": {
      "level": 12,
      "prof_bonus": 4,
      "ability_score_bonuses": 4,
      "features": [
        "属性提升"
      ],
      "spellcasting": null,
      "class_specific": {
        "action_surges": 1,
        "indomitable_uses": 1,
        "extra_attacks": 2
      }
    },
    "13": {
      "level": 13,
      "prof_bonus": 5,
      "ability_score_bonuses": 4,
      "features": [
        "不屈（2次）"
      ],
      "spellcasting": null,
      "class_specific": {
        "action_surges": 1,
        "indomitable_uses": 2,
        "extra_attacks": 2
      }
    },
    "14": {
      "level": 14,
      "prof_bonus": 5,
      "ability_score_bonuses": 5,
      "features": [
        "属性提升"
      ],
      "spellcasting": null,
      "class_specific": {
        "action_surges": 1,
        "indomitable_uses": 2,
        "extra_attacks": 2
      }
    },
    "15": {
      "level": 15,
      "prof_bonus": 5,
      "ability_score_bonuses": 5,
      "features": [
        "武术范型特性"
      ],
      "spellcasting": null,
      "class_specific": {
        "action_surges": 1,
        "indomitable_uses": 2,
        "extra_attacks": 2
      }
    },
    "16": {
      "level": 16,
      "prof_bonus": 5,
      "ability_score_bonuses": 6,
      "features": [
        "属性提升"
      ],
      "spellcasting": null,
      "class_specific": {
        "action_surges": 1,
        "indomitable_uses": 2,
        "extra_attacks": 2
      }
    },
    "17": {
      "level": 17,
      "prof_bonus": 6,
      "ability_score_bonuses": 6,
      "features": [
        "行动如潮（2次）",
        "不屈（3次）"
      ],
      "spellcasting": null,
      "class_specific": {
        "action_surges": 2,
        "indomitable_uses": 3,
        "extra_attacks": 2
      }
    },
    "18": {
      "level": 18,
      "prof_bonus": 6,
      "ability_score_bonuses": 6,
      "features": [
        "武术范型特性"
      ],
      "spellcasting": null,
      "class_specific": {
        "action_surges": 2,
        "indomitable_uses": 3,
        "extra_attacks": 2
      }
    },
    "19": {
      "level": 19,
      "prof_bonus": 6,
      "ability_score_bonuses": 7,
      "features": [
        "属性提升"
      ],
      "spellcasting": null,
      "class_specific": {
        "action_surges": 2,
        "indomitable_uses": 3,
        "extra_attacks": 2
      }
    },
    "20": {
      "level": 20,
      "prof_bonus": 6,
      "ability_score_bonuses": 7,
      "features": [
        "额外攻击（3）"
      ],
      "spellcasting": null,
      "class_specific": {
        "action_surges": 2,
        "indomitable_uses": 3,
        "extra_attacks": 3
      }
    }
  },
  "武僧": {
    "1": {
      "level": 1,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "无甲防御",
        "武艺"
      ],
      "spellcasting": null,
      "class_specific": {
        "martial_arts": {
          "dice_count": 1,
          "dice_value": 4
        },
        "ki_points": 0,
        "unarmored_movement": 0
      }
    },
    "2": {
      "level": 2,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "气",
        "疾风连击",
        "守势待机",
        "踏风步",
        "无甲移动"
      ],
      "spellcasting": null,
      "class_specific": {
        "martial_arts": {
          "dice_count": 1,
          "dice_value": 4
        },
        "ki_points": 2,
        "unarmored_movement": 10
      }
    },
    "3": {
      "level": 3,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "修道传承",
        "拨挡飞弹"
      ],
      "spellcasting": null,
      "class_specific": {
        "martial_arts": {
          "dice_count": 1,
          "dice_value": 4
        },
        "ki_points": 3,
        "unarmored_movement": 10
      }
    },
    "4": {
      "level": 4,
      "prof_bonus": 2,
      "ability_score_bonuses": 1,
      "features": [
        "属性提升",
        "缓降"
      ],
      "spellcasting": null,
      "class_specific": {
        "martial_arts": {
          "dice_count": 1,
          "dice_value": 4
        },
        "ki_points": 4,
        "unarmored_movement": 10
      }
    },
    "5": {
      "level": 5,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [
        "额外攻击",
        "震慑拳"
      ],
      "spellcasting": null,
      "class_specific": {
        "martial_arts": {
          "dice_count": 1,
          "dice_value": 6
        },
        "ki_points": 5,
        "unarmored_movement": 10
      }
    },
    "6": {
      "level": 6,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [
        "气之强化打击",
        "修道传承特性"
      ],
      "spellcasting": null,
      "class_specific": {
        "martial_arts": {
          "dice_count": 1,
          "dice_value": 6
        },
        "ki_points": 6,
        "unarmored_movement": 15
      }
    },
    "7": {
      "level": 7,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [
        "回避",
        "心如止水"
      ],
      "spellcasting": null,
      "class_specific": {
        "martial_arts": {
          "dice_count": 1,
          "dice_value": 6
        },
        "ki_points": 7,
        "unarmored_movement": 15
      }
    },
    "8": {
      "level": 8,
      "prof_bonus": 3,
      "ability_score_bonuses": 2,
      "features": [
        "属性提升"
      ],
      "spellcasting": null,
      "class_specific": {
        "martial_arts": {
          "dice_count": 1,
          "dice_value": 6
        },
        "ki_points": 8,
        "unarmored_movement": 15
      }
    },
    "9": {
      "level": 9,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [
        "无甲移动"
      ],
      "spellcasting": null,
      "class_specific": {
        "martial_arts": {
          "dice_count": 1,
          "dice_value": 6
        },
        "ki_points": 9,
        "unarmored_movement": 15
      }
    },
    "10": {
      "level": 10,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [
        "纯净之躯"
      ],
      "spellcasting": null,
      "class_specific": {
        "martial_arts": {
          "dice_count": 1,
          "dice_value": 6
        },
        "ki_points": 10,
        "unarmored_movement": 20
      }
    },
    "11": {
      "level": 11,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [
        "修道传承特性"
      ],
      "spellcasting": null,
      "class_specific": {
        "martial_arts": {
          "dice_count": 1,
          "dice_value": 8
        },
        "ki_points": 11,
        "unarmored_movement": 20
      }
    },
    "12": {
      "level": 12,
      "prof_bonus": 4,
      "ability_score_bonuses": 3,
      "features": [
        "属性提升"
      ],
      "spellcasting": null,
      "class_specific": {
        "martial_arts": {
          "dice_count": 1,
          "dice_value": 8
        },
        "ki_points": 12,
        "unarmored_movement": 20
      }
    },
    "13": {
      "level": 13,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [
        "日月之语"
      ],
      "spellcasting": null,
      "class_specific": {
        "martial_arts": {
          "dice_count": 1,
          "dice_value": 8
        },
        "ki_points": 13,
        "unarmored_movement": 20
      }
    },
    "14": {
      "level": 14,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [
        "钻石之魂"
      ],
      "spellcasting": null,
      "class_specific": {
        "martial_arts": {
          "dice_count": 1,
          "dice_value": 8
        },
        "ki_points": 14,
        "unarmored_movement": 25
      }
    },
    "15": {
      "level": 15,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [
        "不朽之躯"
      ],
      "spellcasting": null,
      "class_specific": {
        "martial_arts": {
          "dice_count": 1,
          "dice_value": 8
        },
        "ki_points": 15,
        "unarmored_movement": 25
      }
    },
    "16": {
      "level": 16,
      "prof_bonus": 5,
      "ability_score_bonuses": 4,
      "features": [
        "属性提升"
      ],
      "spellcasting": null,
      "class_specific": {
        "martial_arts": {
          "dice_count": 1,
          "dice_value": 8
        },
        "ki_points": 16,
        "unarmored_movement": 25
      }
    },
    "17": {
      "level": 17,
      "prof_bonus": 6,
      "ability_score_bonuses": 4,
      "features": [
        "修道传承特性"
      ],
      "spellcasting": null,
      "class_specific": {
        "martial_arts": {
          "dice_count": 1,
          "dice_value": 10
        },
        "ki_points": 17,
        "unarmored_movement": 25
      }
    },
    "18": {
      "level": 18,
      "prof_bonus": 6,
      "ability_score_bonuses": 4,
      "features": [
        "空灵之体"
      ],
      "spellcasting": null,
      "class_specific": {
        "martial_arts": {
          "dice_count": 1,
          "dice_value": 10
        },
        "ki_points": 18,
        "unarmored_movement": 30
      }
    },
    "19": {
      "level": 19,
      "prof_bonus": 6,
      "ability_score_bonuses": 5,
      "features": [
        "属性提升"
      ],
      "spellcasting": null,
      "class_specific": {
        "martial_arts": {
          "dice_count": 1,
          "dice_value": 10
        },
        "ki_points": 19,
        "unarmored_movement": 30
      }
    },
    "20": {
      "level": 20,
      "prof_bonus": 6,
      "ability_score_bonuses": 5,
      "features": [
        "完美自我"
      ],
      "spellcasting": null,
      "class_specific": {
        "martial_arts": {
          "dice_count": 1,
          "dice_value": 10
        },
        "ki_points": 20,
        "unarmored_movement": 30
      }
    }
  },
  "圣武士": {
    "1": {
      "level": 1,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "神圣感知",
        "抚慰之手"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 0,
        "slots": {}
      },
      "class_specific": {
        "aura_range": 0
      }
    },
    "2": {
      "level": 2,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "战斗风格",
        "施法：圣武士",
        "神威斩击"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 0,
        "slots": {
          "1": 2
        }
      },
      "class_specific": {
        "aura_range": 0
      }
    },
    "3": {
      "level": 3,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "圣洁体魄",
        "神圣誓言",
        "誓约法术",
        "引导神力"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 0,
        "slots": {
          "1": 3
        }
      },
      "class_specific": {
        "aura_range": 0
      }
    },
    "4": {
      "level": 4,
      "prof_bonus": 2,
      "ability_score_bonuses": 1,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 0,
        "slots": {
          "1": 3
        }
      },
      "class_specific": {
        "aura_range": 0
      }
    },
    "5": {
      "level": 5,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [
        "额外攻击"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 2
        }
      },
      "class_specific": {
        "aura_range": 0
      }
    },
    "6": {
      "level": 6,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [
        "守护光环"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 2
        }
      },
      "class_specific": {
        "aura_range": 10
      }
    },
    "7": {
      "level": 7,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [
        "神圣誓言特性"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3
        }
      },
      "class_specific": {
        "aura_range": 10
      }
    },
    "8": {
      "level": 8,
      "prof_bonus": 3,
      "ability_score_bonuses": 2,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3
        }
      },
      "class_specific": {
        "aura_range": 10
      }
    },
    "9": {
      "level": 9,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 2
        }
      },
      "class_specific": {
        "aura_range": 10
      }
    },
    "10": {
      "level": 10,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [
        "勇气光环"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 2
        }
      },
      "class_specific": {
        "aura_range": 10
      }
    },
    "11": {
      "level": 11,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [
        "强化神威斩击"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3
        }
      },
      "class_specific": {
        "aura_range": 10
      }
    },
    "12": {
      "level": 12,
      "prof_bonus": 4,
      "ability_score_bonuses": 3,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3
        }
      },
      "class_specific": {
        "aura_range": 10
      }
    },
    "13": {
      "level": 13,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 1
        }
      },
      "class_specific": {
        "aura_range": 10
      }
    },
    "14": {
      "level": 14,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [
        "净化之触"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 1
        }
      },
      "class_specific": {
        "aura_range": 10
      }
    },
    "15": {
      "level": 15,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [
        "神圣誓言特性"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 2
        }
      },
      "class_specific": {
        "aura_range": 10
      }
    },
    "16": {
      "level": 16,
      "prof_bonus": 5,
      "ability_score_bonuses": 4,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 2
        }
      },
      "class_specific": {
        "aura_range": 10
      }
    },
    "17": {
      "level": 17,
      "prof_bonus": 6,
      "ability_score_bonuses": 4,
      "features": [],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 1
        }
      },
      "class_specific": {
        "aura_range": 10
      }
    },
    "18": {
      "level": 18,
      "prof_bonus": 6,
      "ability_score_bonuses": 4,
      "features": [
        "光环强化"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 1
        }
      },
      "class_specific": {
        "aura_range": 30
      }
    },
    "19": {
      "level": 19,
      "prof_bonus": 6,
      "ability_score_bonuses": 5,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2
        }
      },
      "class_specific": {
        "aura_range": 30
      }
    },
    "20": {
      "level": 20,
      "prof_bonus": 6,
      "ability_score_bonuses": 5,
      "features": [
        "神圣誓言特性"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2
        }
      },
      "class_specific": {
        "aura_range": 30
      }
    }
  },
  "游侠": {
    "1": {
      "level": 1,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "宿敌（1 type）",
        "自然探索者（1 terrain type）"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 0,
        "slots": {}
      },
      "class_specific": {
        "favored_enemies": 1,
        "favored_terrain": 1
      }
    },
    "2": {
      "level": 2,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "战斗风格",
        "施法：游侠"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 2,
        "slots": {
          "1": 2
        }
      },
      "class_specific": {
        "favored_enemies": 1,
        "favored_terrain": 1
      }
    },
    "3": {
      "level": 3,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "游侠范型",
        "远古感知"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 3,
        "slots": {
          "1": 3
        }
      },
      "class_specific": {
        "favored_enemies": 1,
        "favored_terrain": 1
      }
    },
    "4": {
      "level": 4,
      "prof_bonus": 2,
      "ability_score_bonuses": 1,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 3,
        "slots": {
          "1": 3
        }
      },
      "class_specific": {
        "favored_enemies": 1,
        "favored_terrain": 1
      }
    },
    "5": {
      "level": 5,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [
        "额外攻击"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 4,
        "slots": {
          "1": 4,
          "2": 2
        }
      },
      "class_specific": {
        "favored_enemies": 1,
        "favored_terrain": 1
      }
    },
    "6": {
      "level": 6,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [
        "宿敌（2 types）",
        "自然探索者（2 terrain types）"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 4,
        "slots": {
          "1": 4,
          "2": 2
        }
      },
      "class_specific": {
        "favored_enemies": 2,
        "favored_terrain": 2
      }
    },
    "7": {
      "level": 7,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [
        "游侠范型特性"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 5,
        "slots": {
          "1": 4,
          "2": 3
        }
      },
      "class_specific": {
        "favored_enemies": 2,
        "favored_terrain": 2
      }
    },
    "8": {
      "level": 8,
      "prof_bonus": 3,
      "ability_score_bonuses": 2,
      "features": [
        "属性提升",
        "大地行者"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 5,
        "slots": {
          "1": 4,
          "2": 3
        }
      },
      "class_specific": {
        "favored_enemies": 2,
        "favored_terrain": 2
      }
    },
    "9": {
      "level": 9,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 6,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 2
        }
      },
      "class_specific": {
        "favored_enemies": 2,
        "favored_terrain": 2
      }
    },
    "10": {
      "level": 10,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [
        "自然探索者（3 terrain types）",
        "光天化日隐匿"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 6,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 2
        }
      },
      "class_specific": {
        "favored_enemies": 2,
        "favored_terrain": 3
      }
    },
    "11": {
      "level": 11,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [
        "游侠范型特性"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 7,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3
        }
      },
      "class_specific": {
        "favored_enemies": 2,
        "favored_terrain": 3
      }
    },
    "12": {
      "level": 12,
      "prof_bonus": 4,
      "ability_score_bonuses": 3,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 7,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3
        }
      },
      "class_specific": {
        "favored_enemies": 2,
        "favored_terrain": 3
      }
    },
    "13": {
      "level": 13,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 8,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 1
        }
      },
      "class_specific": {
        "favored_enemies": 2,
        "favored_terrain": 3
      }
    },
    "14": {
      "level": 14,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [
        "宿敌（3 enemies）",
        "隐匿无踪"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 8,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 1
        }
      },
      "class_specific": {
        "favored_enemies": 3,
        "favored_terrain": 3
      }
    },
    "15": {
      "level": 15,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [
        "游侠范型特性"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 9,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 2
        }
      },
      "class_specific": {
        "favored_enemies": 3,
        "favored_terrain": 3
      }
    },
    "16": {
      "level": 16,
      "prof_bonus": 5,
      "ability_score_bonuses": 4,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 9,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 2
        }
      },
      "class_specific": {
        "favored_enemies": 3,
        "favored_terrain": 3
      }
    },
    "17": {
      "level": 17,
      "prof_bonus": 6,
      "ability_score_bonuses": 4,
      "features": [],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 10,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 1
        }
      },
      "class_specific": {
        "favored_enemies": 3,
        "favored_terrain": 3
      }
    },
    "18": {
      "level": 18,
      "prof_bonus": 6,
      "ability_score_bonuses": 4,
      "features": [
        "野性感官"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 10,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 1
        }
      },
      "class_specific": {
        "favored_enemies": 3,
        "favored_terrain": 3
      }
    },
    "19": {
      "level": 19,
      "prof_bonus": 6,
      "ability_score_bonuses": 5,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 11,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2
        }
      },
      "class_specific": {
        "favored_enemies": 3,
        "favored_terrain": 3
      }
    },
    "20": {
      "level": 20,
      "prof_bonus": 6,
      "ability_score_bonuses": 5,
      "features": [
        "克敌者"
      ],
      "spellcasting": {
        "cantrips_known": 0,
        "spells_known": 11,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2
        }
      },
      "class_specific": {
        "favored_enemies": 3,
        "favored_terrain": 3
      }
    }
  },
  "游荡者": {
    "1": {
      "level": 1,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "专精造诣",
        "偷袭",
        "盗贼黑话"
      ],
      "spellcasting": null,
      "class_specific": {
        "sneak_attack": {
          "dice_count": 1,
          "dice_value": 6
        }
      }
    },
    "2": {
      "level": 2,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "机敏动作"
      ],
      "spellcasting": null,
      "class_specific": {
        "sneak_attack": {
          "dice_count": 1,
          "dice_value": 6
        }
      }
    },
    "3": {
      "level": 3,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "游荡者范型"
      ],
      "spellcasting": null,
      "class_specific": {
        "sneak_attack": {
          "dice_count": 2,
          "dice_value": 6
        }
      }
    },
    "4": {
      "level": 4,
      "prof_bonus": 2,
      "ability_score_bonuses": 1,
      "features": [
        "属性提升"
      ],
      "spellcasting": null,
      "class_specific": {
        "sneak_attack": {
          "dice_count": 2,
          "dice_value": 6
        }
      }
    },
    "5": {
      "level": 5,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [
        "洞悉闪避"
      ],
      "spellcasting": null,
      "class_specific": {
        "sneak_attack": {
          "dice_count": 3,
          "dice_value": 6
        }
      }
    },
    "6": {
      "level": 6,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [
        "专精造诣"
      ],
      "spellcasting": null,
      "class_specific": {
        "sneak_attack": {
          "dice_count": 3,
          "dice_value": 6
        }
      }
    },
    "7": {
      "level": 7,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [
        "回避"
      ],
      "spellcasting": null,
      "class_specific": {
        "sneak_attack": {
          "dice_count": 4,
          "dice_value": 6
        }
      }
    },
    "8": {
      "level": 8,
      "prof_bonus": 3,
      "ability_score_bonuses": 2,
      "features": [
        "属性提升"
      ],
      "spellcasting": null,
      "class_specific": {
        "sneak_attack": {
          "dice_count": 4,
          "dice_value": 6
        }
      }
    },
    "9": {
      "level": 9,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [
        "游荡者范型特性"
      ],
      "spellcasting": null,
      "class_specific": {
        "sneak_attack": {
          "dice_count": 5,
          "dice_value": 6
        }
      }
    },
    "10": {
      "level": 10,
      "prof_bonus": 4,
      "ability_score_bonuses": 3,
      "features": [
        "属性提升"
      ],
      "spellcasting": null,
      "class_specific": {
        "sneak_attack": {
          "dice_count": 5,
          "dice_value": 6
        }
      }
    },
    "11": {
      "level": 11,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [
        "可靠天赋"
      ],
      "spellcasting": null,
      "class_specific": {
        "sneak_attack": {
          "dice_count": 6,
          "dice_value": 6
        }
      }
    },
    "12": {
      "level": 12,
      "prof_bonus": 4,
      "ability_score_bonuses": 4,
      "features": [
        "属性提升"
      ],
      "spellcasting": null,
      "class_specific": {
        "sneak_attack": {
          "dice_count": 6,
          "dice_value": 6
        }
      }
    },
    "13": {
      "level": 13,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [
        "游荡者范型特性"
      ],
      "spellcasting": null,
      "class_specific": {
        "sneak_attack": {
          "dice_count": 7,
          "dice_value": 6
        }
      }
    },
    "14": {
      "level": 14,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [
        "盲视感知"
      ],
      "spellcasting": null,
      "class_specific": {
        "sneak_attack": {
          "dice_count": 7,
          "dice_value": 6
        }
      }
    },
    "15": {
      "level": 15,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [
        "滑溜心智"
      ],
      "spellcasting": null,
      "class_specific": {
        "sneak_attack": {
          "dice_count": 8,
          "dice_value": 6
        }
      }
    },
    "16": {
      "level": 16,
      "prof_bonus": 5,
      "ability_score_bonuses": 5,
      "features": [
        "属性提升"
      ],
      "spellcasting": null,
      "class_specific": {
        "sneak_attack": {
          "dice_count": 8,
          "dice_value": 6
        }
      }
    },
    "17": {
      "level": 17,
      "prof_bonus": 6,
      "ability_score_bonuses": 4,
      "features": [
        "游荡者范型特性"
      ],
      "spellcasting": null,
      "class_specific": {
        "sneak_attack": {
          "dice_count": 9,
          "dice_value": 6
        }
      }
    },
    "18": {
      "level": 18,
      "prof_bonus": 6,
      "ability_score_bonuses": 4,
      "features": [
        "难以捉摸"
      ],
      "spellcasting": null,
      "class_specific": {
        "sneak_attack": {
          "dice_count": 9,
          "dice_value": 6
        }
      }
    },
    "19": {
      "level": 19,
      "prof_bonus": 6,
      "ability_score_bonuses": 6,
      "features": [
        "属性提升"
      ],
      "spellcasting": null,
      "class_specific": {
        "sneak_attack": {
          "dice_count": 10,
          "dice_value": 6
        }
      }
    },
    "20": {
      "level": 20,
      "prof_bonus": 6,
      "ability_score_bonuses": 5,
      "features": [
        "幸运一击"
      ],
      "spellcasting": null,
      "class_specific": {
        "sneak_attack": {
          "dice_count": 10,
          "dice_value": 6
        }
      }
    }
  },
  "术士": {
    "1": {
      "level": 1,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "施法：术士",
        "术法根源"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 2,
        "slots": {
          "1": 2
        }
      },
      "class_specific": {
        "sorcery_points": 0,
        "metamagic_known": 0,
        "creating_spell_slots": []
      }
    },
    "2": {
      "level": 2,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "魔力之泉",
        "灵活施法：创造法术位",
        "灵活施法：转化法术位"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 3,
        "slots": {
          "1": 3
        }
      },
      "class_specific": {
        "sorcery_points": 2,
        "metamagic_known": 0,
        "creating_spell_slots": [
          {
            "spell_slot_level": 1,
            "sorcery_point_cost": 2
          },
          {
            "spell_slot_level": 2,
            "sorcery_point_cost": 3
          },
          {
            "spell_slot_level": 3,
            "sorcery_point_cost": 5
          },
          {
            "spell_slot_level": 4,
            "sorcery_point_cost": 6
          },
          {
            "spell_slot_level": 5,
            "sorcery_point_cost": 7
          }
        ]
      }
    },
    "3": {
      "level": 3,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "超魔法"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 4,
        "slots": {
          "1": 4,
          "2": 2
        }
      },
      "class_specific": {
        "sorcery_points": 3,
        "metamagic_known": 2,
        "creating_spell_slots": [
          {
            "spell_slot_level": 1,
            "sorcery_point_cost": 2
          },
          {
            "spell_slot_level": 2,
            "sorcery_point_cost": 3
          },
          {
            "spell_slot_level": 3,
            "sorcery_point_cost": 5
          },
          {
            "spell_slot_level": 4,
            "sorcery_point_cost": 6
          },
          {
            "spell_slot_level": 5,
            "sorcery_point_cost": 7
          }
        ]
      }
    },
    "4": {
      "level": 4,
      "prof_bonus": 2,
      "ability_score_bonuses": 1,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 5,
        "spells_known": 5,
        "slots": {
          "1": 4,
          "2": 3
        }
      },
      "class_specific": {
        "sorcery_points": 4,
        "metamagic_known": 2,
        "creating_spell_slots": [
          {
            "spell_slot_level": 1,
            "sorcery_point_cost": 2
          },
          {
            "spell_slot_level": 2,
            "sorcery_point_cost": 3
          },
          {
            "spell_slot_level": 3,
            "sorcery_point_cost": 5
          },
          {
            "spell_slot_level": 4,
            "sorcery_point_cost": 6
          },
          {
            "spell_slot_level": 5,
            "sorcery_point_cost": 7
          }
        ]
      }
    },
    "5": {
      "level": 5,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [],
      "spellcasting": {
        "cantrips_known": 5,
        "spells_known": 6,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 2
        }
      },
      "class_specific": {
        "sorcery_points": 5,
        "metamagic_known": 2,
        "creating_spell_slots": [
          {
            "spell_slot_level": 1,
            "sorcery_point_cost": 2
          },
          {
            "spell_slot_level": 2,
            "sorcery_point_cost": 3
          },
          {
            "spell_slot_level": 3,
            "sorcery_point_cost": 5
          },
          {
            "spell_slot_level": 4,
            "sorcery_point_cost": 6
          },
          {
            "spell_slot_level": 5,
            "sorcery_point_cost": 7
          }
        ]
      }
    },
    "6": {
      "level": 6,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [
        "术法根源特性"
      ],
      "spellcasting": {
        "cantrips_known": 5,
        "spells_known": 7,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3
        }
      },
      "class_specific": {
        "sorcery_points": 6,
        "metamagic_known": 2,
        "creating_spell_slots": [
          {
            "spell_slot_level": 1,
            "sorcery_point_cost": 2
          },
          {
            "spell_slot_level": 2,
            "sorcery_point_cost": 3
          },
          {
            "spell_slot_level": 3,
            "sorcery_point_cost": 5
          },
          {
            "spell_slot_level": 4,
            "sorcery_point_cost": 6
          },
          {
            "spell_slot_level": 5,
            "sorcery_point_cost": 7
          }
        ]
      }
    },
    "7": {
      "level": 7,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [],
      "spellcasting": {
        "cantrips_known": 5,
        "spells_known": 8,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 1
        }
      },
      "class_specific": {
        "sorcery_points": 7,
        "metamagic_known": 2,
        "creating_spell_slots": [
          {
            "spell_slot_level": 1,
            "sorcery_point_cost": 2
          },
          {
            "spell_slot_level": 2,
            "sorcery_point_cost": 3
          },
          {
            "spell_slot_level": 3,
            "sorcery_point_cost": 5
          },
          {
            "spell_slot_level": 4,
            "sorcery_point_cost": 6
          },
          {
            "spell_slot_level": 5,
            "sorcery_point_cost": 7
          }
        ]
      }
    },
    "8": {
      "level": 8,
      "prof_bonus": 3,
      "ability_score_bonuses": 2,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 5,
        "spells_known": 9,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 2
        }
      },
      "class_specific": {
        "sorcery_points": 8,
        "metamagic_known": 2,
        "creating_spell_slots": [
          {
            "spell_slot_level": 1,
            "sorcery_point_cost": 2
          },
          {
            "spell_slot_level": 2,
            "sorcery_point_cost": 3
          },
          {
            "spell_slot_level": 3,
            "sorcery_point_cost": 5
          },
          {
            "spell_slot_level": 4,
            "sorcery_point_cost": 6
          },
          {
            "spell_slot_level": 5,
            "sorcery_point_cost": 7
          }
        ]
      }
    },
    "9": {
      "level": 9,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [],
      "spellcasting": {
        "cantrips_known": 5,
        "spells_known": 10,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 1
        }
      },
      "class_specific": {
        "sorcery_points": 9,
        "metamagic_known": 2,
        "creating_spell_slots": [
          {
            "spell_slot_level": 1,
            "sorcery_point_cost": 2
          },
          {
            "spell_slot_level": 2,
            "sorcery_point_cost": 3
          },
          {
            "spell_slot_level": 3,
            "sorcery_point_cost": 5
          },
          {
            "spell_slot_level": 4,
            "sorcery_point_cost": 6
          },
          {
            "spell_slot_level": 5,
            "sorcery_point_cost": 7
          }
        ]
      }
    },
    "10": {
      "level": 10,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [
        "超魔法"
      ],
      "spellcasting": {
        "cantrips_known": 6,
        "spells_known": 11,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2
        }
      },
      "class_specific": {
        "sorcery_points": 10,
        "metamagic_known": 3,
        "creating_spell_slots": [
          {
            "spell_slot_level": 1,
            "sorcery_point_cost": 2
          },
          {
            "spell_slot_level": 2,
            "sorcery_point_cost": 3
          },
          {
            "spell_slot_level": 3,
            "sorcery_point_cost": 5
          },
          {
            "spell_slot_level": 4,
            "sorcery_point_cost": 6
          },
          {
            "spell_slot_level": 5,
            "sorcery_point_cost": 7
          }
        ]
      }
    },
    "11": {
      "level": 11,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [],
      "spellcasting": {
        "cantrips_known": 6,
        "spells_known": 12,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1
        }
      },
      "class_specific": {
        "sorcery_points": 11,
        "metamagic_known": 3,
        "creating_spell_slots": [
          {
            "spell_slot_level": 1,
            "sorcery_point_cost": 2
          },
          {
            "spell_slot_level": 2,
            "sorcery_point_cost": 3
          },
          {
            "spell_slot_level": 3,
            "sorcery_point_cost": 5
          },
          {
            "spell_slot_level": 4,
            "sorcery_point_cost": 6
          },
          {
            "spell_slot_level": 5,
            "sorcery_point_cost": 7
          }
        ]
      }
    },
    "12": {
      "level": 12,
      "prof_bonus": 4,
      "ability_score_bonuses": 3,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 6,
        "spells_known": 12,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1
        }
      },
      "class_specific": {
        "sorcery_points": 12,
        "metamagic_known": 3,
        "creating_spell_slots": [
          {
            "spell_slot_level": 1,
            "sorcery_point_cost": 2
          },
          {
            "spell_slot_level": 2,
            "sorcery_point_cost": 3
          },
          {
            "spell_slot_level": 3,
            "sorcery_point_cost": 5
          },
          {
            "spell_slot_level": 4,
            "sorcery_point_cost": 6
          },
          {
            "spell_slot_level": 5,
            "sorcery_point_cost": 7
          }
        ]
      }
    },
    "13": {
      "level": 13,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [],
      "spellcasting": {
        "cantrips_known": 6,
        "spells_known": 13,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1,
          "7": 1
        }
      },
      "class_specific": {
        "sorcery_points": 13,
        "metamagic_known": 3,
        "creating_spell_slots": [
          {
            "spell_slot_level": 1,
            "sorcery_point_cost": 2
          },
          {
            "spell_slot_level": 2,
            "sorcery_point_cost": 3
          },
          {
            "spell_slot_level": 3,
            "sorcery_point_cost": 5
          },
          {
            "spell_slot_level": 4,
            "sorcery_point_cost": 6
          },
          {
            "spell_slot_level": 5,
            "sorcery_point_cost": 7
          }
        ]
      }
    },
    "14": {
      "level": 14,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [
        "术法根源特性"
      ],
      "spellcasting": {
        "cantrips_known": 6,
        "spells_known": 13,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1,
          "7": 1
        }
      },
      "class_specific": {
        "sorcery_points": 14,
        "metamagic_known": 3,
        "creating_spell_slots": [
          {
            "spell_slot_level": 1,
            "sorcery_point_cost": 2
          },
          {
            "spell_slot_level": 2,
            "sorcery_point_cost": 3
          },
          {
            "spell_slot_level": 3,
            "sorcery_point_cost": 5
          },
          {
            "spell_slot_level": 4,
            "sorcery_point_cost": 6
          },
          {
            "spell_slot_level": 5,
            "sorcery_point_cost": 7
          }
        ]
      }
    },
    "15": {
      "level": 15,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [],
      "spellcasting": {
        "cantrips_known": 6,
        "spells_known": 14,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1,
          "7": 1,
          "8": 1
        }
      },
      "class_specific": {
        "sorcery_points": 15,
        "metamagic_known": 3,
        "creating_spell_slots": [
          {
            "spell_slot_level": 1,
            "sorcery_point_cost": 2
          },
          {
            "spell_slot_level": 2,
            "sorcery_point_cost": 3
          },
          {
            "spell_slot_level": 3,
            "sorcery_point_cost": 5
          },
          {
            "spell_slot_level": 4,
            "sorcery_point_cost": 6
          },
          {
            "spell_slot_level": 5,
            "sorcery_point_cost": 7
          }
        ]
      }
    },
    "16": {
      "level": 16,
      "prof_bonus": 5,
      "ability_score_bonuses": 4,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 6,
        "spells_known": 14,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1,
          "7": 1,
          "8": 1
        }
      },
      "class_specific": {
        "sorcery_points": 16,
        "metamagic_known": 4,
        "creating_spell_slots": [
          {
            "spell_slot_level": 1,
            "sorcery_point_cost": 2
          },
          {
            "spell_slot_level": 2,
            "sorcery_point_cost": 3
          },
          {
            "spell_slot_level": 3,
            "sorcery_point_cost": 5
          },
          {
            "spell_slot_level": 4,
            "sorcery_point_cost": 6
          },
          {
            "spell_slot_level": 5,
            "sorcery_point_cost": 7
          }
        ]
      }
    },
    "17": {
      "level": 17,
      "prof_bonus": 6,
      "ability_score_bonuses": 4,
      "features": [
        "超魔法"
      ],
      "spellcasting": {
        "cantrips_known": 6,
        "spells_known": 15,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1,
          "7": 1,
          "8": 1,
          "9": 1
        }
      },
      "class_specific": {
        "sorcery_points": 17,
        "metamagic_known": 4,
        "creating_spell_slots": [
          {
            "spell_slot_level": 1,
            "sorcery_point_cost": 2
          },
          {
            "spell_slot_level": 2,
            "sorcery_point_cost": 3
          },
          {
            "spell_slot_level": 3,
            "sorcery_point_cost": 5
          },
          {
            "spell_slot_level": 4,
            "sorcery_point_cost": 6
          },
          {
            "spell_slot_level": 5,
            "sorcery_point_cost": 7
          }
        ]
      }
    },
    "18": {
      "level": 18,
      "prof_bonus": 6,
      "ability_score_bonuses": 4,
      "features": [
        "术法根源特性"
      ],
      "spellcasting": {
        "cantrips_known": 6,
        "spells_known": 15,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 3,
          "6": 1,
          "7": 1,
          "8": 1,
          "9": 1
        }
      },
      "class_specific": {
        "sorcery_points": 18,
        "metamagic_known": 4,
        "creating_spell_slots": [
          {
            "spell_slot_level": 1,
            "sorcery_point_cost": 2
          },
          {
            "spell_slot_level": 2,
            "sorcery_point_cost": 3
          },
          {
            "spell_slot_level": 3,
            "sorcery_point_cost": 5
          },
          {
            "spell_slot_level": 4,
            "sorcery_point_cost": 6
          },
          {
            "spell_slot_level": 5,
            "sorcery_point_cost": 7
          }
        ]
      }
    },
    "19": {
      "level": 19,
      "prof_bonus": 6,
      "ability_score_bonuses": 5,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 6,
        "spells_known": 15,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 3,
          "6": 2,
          "7": 1,
          "8": 1,
          "9": 1
        }
      },
      "class_specific": {
        "sorcery_points": 19,
        "metamagic_known": 4,
        "creating_spell_slots": [
          {
            "spell_slot_level": 1,
            "sorcery_point_cost": 2
          },
          {
            "spell_slot_level": 2,
            "sorcery_point_cost": 3
          },
          {
            "spell_slot_level": 3,
            "sorcery_point_cost": 5
          },
          {
            "spell_slot_level": 4,
            "sorcery_point_cost": 6
          },
          {
            "spell_slot_level": 5,
            "sorcery_point_cost": 7
          }
        ]
      }
    },
    "20": {
      "level": 20,
      "prof_bonus": 6,
      "ability_score_bonuses": 5,
      "features": [
        "术法回复"
      ],
      "spellcasting": {
        "cantrips_known": 6,
        "spells_known": 15,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 3,
          "6": 2,
          "7": 2,
          "8": 1,
          "9": 1
        }
      },
      "class_specific": {
        "sorcery_points": 20,
        "metamagic_known": 4,
        "creating_spell_slots": [
          {
            "spell_slot_level": 1,
            "sorcery_point_cost": 2
          },
          {
            "spell_slot_level": 2,
            "sorcery_point_cost": 3
          },
          {
            "spell_slot_level": 3,
            "sorcery_point_cost": 5
          },
          {
            "spell_slot_level": 4,
            "sorcery_point_cost": 6
          },
          {
            "spell_slot_level": 5,
            "sorcery_point_cost": 7
          }
        ]
      }
    }
  },
  "魔契师": {
    "1": {
      "level": 1,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "异界宗主",
        "契约魔法"
      ],
      "spellcasting": {
        "cantrips_known": 2,
        "spells_known": 2,
        "slots": {
          "1": 1
        }
      },
      "class_specific": {
        "invocations_known": 0,
        "mystic_arcanum_level_6": 0,
        "mystic_arcanum_level_7": 0,
        "mystic_arcanum_level_8": 0,
        "mystic_arcanum_level_9": 0
      }
    },
    "2": {
      "level": 2,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "邪术魔典"
      ],
      "spellcasting": {
        "cantrips_known": 2,
        "spells_known": 3,
        "slots": {
          "1": 2
        }
      },
      "class_specific": {
        "invocations_known": 2,
        "mystic_arcanum_level_6": 0,
        "mystic_arcanum_level_7": 0,
        "mystic_arcanum_level_8": 0,
        "mystic_arcanum_level_9": 0
      }
    },
    "3": {
      "level": 3,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "契约恩赐"
      ],
      "spellcasting": {
        "cantrips_known": 2,
        "spells_known": 4,
        "slots": {
          "2": 2
        }
      },
      "class_specific": {
        "invocations_known": 2,
        "mystic_arcanum_level_6": 0,
        "mystic_arcanum_level_7": 0,
        "mystic_arcanum_level_8": 0,
        "mystic_arcanum_level_9": 0
      }
    },
    "4": {
      "level": 4,
      "prof_bonus": 2,
      "ability_score_bonuses": 1,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 3,
        "spells_known": 5,
        "slots": {
          "2": 2
        }
      },
      "class_specific": {
        "invocations_known": 3,
        "mystic_arcanum_level_6": 0,
        "mystic_arcanum_level_7": 0,
        "mystic_arcanum_level_8": 0,
        "mystic_arcanum_level_9": 0
      }
    },
    "5": {
      "level": 5,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [],
      "spellcasting": {
        "cantrips_known": 3,
        "spells_known": 6,
        "slots": {
          "3": 2
        }
      },
      "class_specific": {
        "invocations_known": 3,
        "mystic_arcanum_level_6": 0,
        "mystic_arcanum_level_7": 0,
        "mystic_arcanum_level_8": 0,
        "mystic_arcanum_level_9": 0
      }
    },
    "6": {
      "level": 6,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [
        "异界宗主特性"
      ],
      "spellcasting": {
        "cantrips_known": 3,
        "spells_known": 7,
        "slots": {
          "3": 2
        }
      },
      "class_specific": {
        "invocations_known": 4,
        "mystic_arcanum_level_6": 0,
        "mystic_arcanum_level_7": 0,
        "mystic_arcanum_level_8": 0,
        "mystic_arcanum_level_9": 0
      }
    },
    "7": {
      "level": 7,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [],
      "spellcasting": {
        "cantrips_known": 3,
        "spells_known": 8,
        "slots": {
          "4": 2
        }
      },
      "class_specific": {
        "invocations_known": 4,
        "mystic_arcanum_level_6": 0,
        "mystic_arcanum_level_7": 0,
        "mystic_arcanum_level_8": 0,
        "mystic_arcanum_level_9": 0
      }
    },
    "8": {
      "level": 8,
      "prof_bonus": 3,
      "ability_score_bonuses": 2,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 3,
        "spells_known": 9,
        "slots": {
          "4": 2
        }
      },
      "class_specific": {
        "invocations_known": 4,
        "mystic_arcanum_level_6": 0,
        "mystic_arcanum_level_7": 0,
        "mystic_arcanum_level_8": 0,
        "mystic_arcanum_level_9": 0
      }
    },
    "9": {
      "level": 9,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [],
      "spellcasting": {
        "cantrips_known": 3,
        "spells_known": 10,
        "slots": {
          "5": 2
        }
      },
      "class_specific": {
        "invocations_known": 5,
        "mystic_arcanum_level_6": 0,
        "mystic_arcanum_level_7": 0,
        "mystic_arcanum_level_8": 0,
        "mystic_arcanum_level_9": 0
      }
    },
    "10": {
      "level": 10,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [
        "异界宗主特性"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 10,
        "slots": {
          "5": 2
        }
      },
      "class_specific": {
        "invocations_known": 5,
        "mystic_arcanum_level_6": 0,
        "mystic_arcanum_level_7": 0,
        "mystic_arcanum_level_8": 0,
        "mystic_arcanum_level_9": 0
      }
    },
    "11": {
      "level": 11,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [
        "玄奥秘术（6th level）"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 11,
        "slots": {
          "5": 3
        }
      },
      "class_specific": {
        "invocations_known": 5,
        "mystic_arcanum_level_6": 1,
        "mystic_arcanum_level_7": 0,
        "mystic_arcanum_level_8": 0,
        "mystic_arcanum_level_9": 0
      }
    },
    "12": {
      "level": 12,
      "prof_bonus": 4,
      "ability_score_bonuses": 3,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 11,
        "slots": {
          "5": 3
        }
      },
      "class_specific": {
        "invocations_known": 6,
        "mystic_arcanum_level_6": 1,
        "mystic_arcanum_level_7": 0,
        "mystic_arcanum_level_8": 0,
        "mystic_arcanum_level_9": 0
      }
    },
    "13": {
      "level": 13,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [
        "玄奥秘术（7th level）"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 12,
        "slots": {
          "5": 3
        }
      },
      "class_specific": {
        "invocations_known": 6,
        "mystic_arcanum_level_6": 1,
        "mystic_arcanum_level_7": 1,
        "mystic_arcanum_level_8": 0,
        "mystic_arcanum_level_9": 0
      }
    },
    "14": {
      "level": 14,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [
        "异界宗主特性"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 12,
        "slots": {
          "5": 3
        }
      },
      "class_specific": {
        "invocations_known": 6,
        "mystic_arcanum_level_6": 1,
        "mystic_arcanum_level_7": 1,
        "mystic_arcanum_level_8": 0,
        "mystic_arcanum_level_9": 0
      }
    },
    "15": {
      "level": 15,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [
        "玄奥秘术（8th level）"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 13,
        "slots": {
          "5": 3
        }
      },
      "class_specific": {
        "invocations_known": 7,
        "mystic_arcanum_level_6": 1,
        "mystic_arcanum_level_7": 1,
        "mystic_arcanum_level_8": 1,
        "mystic_arcanum_level_9": 0
      }
    },
    "16": {
      "level": 16,
      "prof_bonus": 5,
      "ability_score_bonuses": 4,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 13,
        "slots": {
          "5": 3
        }
      },
      "class_specific": {
        "invocations_known": 7,
        "mystic_arcanum_level_6": 1,
        "mystic_arcanum_level_7": 1,
        "mystic_arcanum_level_8": 1,
        "mystic_arcanum_level_9": 0
      }
    },
    "17": {
      "level": 17,
      "prof_bonus": 6,
      "ability_score_bonuses": 4,
      "features": [
        "玄奥秘术（9th level）"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 14,
        "slots": {
          "5": 4
        }
      },
      "class_specific": {
        "invocations_known": 7,
        "mystic_arcanum_level_6": 1,
        "mystic_arcanum_level_7": 1,
        "mystic_arcanum_level_8": 1,
        "mystic_arcanum_level_9": 1
      }
    },
    "18": {
      "level": 18,
      "prof_bonus": 6,
      "ability_score_bonuses": 4,
      "features": [],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 14,
        "slots": {
          "5": 4
        }
      },
      "class_specific": {
        "invocations_known": 8,
        "mystic_arcanum_level_6": 1,
        "mystic_arcanum_level_7": 1,
        "mystic_arcanum_level_8": 1,
        "mystic_arcanum_level_9": 1
      }
    },
    "19": {
      "level": 19,
      "prof_bonus": 6,
      "ability_score_bonuses": 5,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 15,
        "slots": {
          "5": 4
        }
      },
      "class_specific": {
        "invocations_known": 8,
        "mystic_arcanum_level_6": 1,
        "mystic_arcanum_level_7": 1,
        "mystic_arcanum_level_8": 1,
        "mystic_arcanum_level_9": 1
      }
    },
    "20": {
      "level": 20,
      "prof_bonus": 6,
      "ability_score_bonuses": 5,
      "features": [
        "邪术大师"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 15,
        "slots": {
          "5": 4
        }
      },
      "class_specific": {
        "invocations_known": 8,
        "mystic_arcanum_level_6": 1,
        "mystic_arcanum_level_7": 1,
        "mystic_arcanum_level_8": 1,
        "mystic_arcanum_level_9": 1
      }
    }
  },
  "法师": {
    "1": {
      "level": 1,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "施法：法师",
        "奥术回复"
      ],
      "spellcasting": {
        "cantrips_known": 3,
        "spells_known": 0,
        "slots": {
          "1": 2
        }
      },
      "class_specific": {
        "arcane_recovery_levels": 1
      }
    },
    "2": {
      "level": 2,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [
        "奥术传承"
      ],
      "spellcasting": {
        "cantrips_known": 3,
        "spells_known": 0,
        "slots": {
          "1": 3
        }
      },
      "class_specific": {
        "arcane_recovery_levels": 1
      }
    },
    "3": {
      "level": 3,
      "prof_bonus": 2,
      "ability_score_bonuses": 0,
      "features": [],
      "spellcasting": {
        "cantrips_known": 3,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 2
        }
      },
      "class_specific": {
        "arcane_recovery_levels": 2
      }
    },
    "4": {
      "level": 4,
      "prof_bonus": 2,
      "ability_score_bonuses": 1,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3
        }
      },
      "class_specific": {
        "arcane_recovery_levels": 2
      }
    },
    "5": {
      "level": 5,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 2
        }
      },
      "class_specific": {
        "arcane_recovery_levels": 3
      }
    },
    "6": {
      "level": 6,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [
        "奥术传承特性"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3
        }
      },
      "class_specific": {
        "arcane_recovery_levels": 3
      }
    },
    "7": {
      "level": 7,
      "prof_bonus": 3,
      "ability_score_bonuses": 1,
      "features": [],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 1
        }
      },
      "class_specific": {
        "arcane_recovery_levels": 4
      }
    },
    "8": {
      "level": 8,
      "prof_bonus": 3,
      "ability_score_bonuses": 2,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 2
        }
      },
      "class_specific": {
        "arcane_recovery_levels": 4
      }
    },
    "9": {
      "level": 9,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [],
      "spellcasting": {
        "cantrips_known": 4,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 1
        }
      },
      "class_specific": {
        "arcane_recovery_levels": 5
      }
    },
    "10": {
      "level": 10,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [
        "奥术传承特性"
      ],
      "spellcasting": {
        "cantrips_known": 5,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2
        }
      },
      "class_specific": {
        "arcane_recovery_levels": 5
      }
    },
    "11": {
      "level": 11,
      "prof_bonus": 4,
      "ability_score_bonuses": 2,
      "features": [],
      "spellcasting": {
        "cantrips_known": 5,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1
        }
      },
      "class_specific": {
        "arcane_recovery_levels": 6
      }
    },
    "12": {
      "level": 12,
      "prof_bonus": 4,
      "ability_score_bonuses": 3,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 5,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1
        }
      },
      "class_specific": {
        "arcane_recovery_levels": 6
      }
    },
    "13": {
      "level": 13,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [],
      "spellcasting": {
        "cantrips_known": 5,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1,
          "7": 1
        }
      },
      "class_specific": {
        "arcane_recovery_levels": 7
      }
    },
    "14": {
      "level": 14,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [
        "奥术传承特性"
      ],
      "spellcasting": {
        "cantrips_known": 5,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1,
          "7": 1
        }
      },
      "class_specific": {
        "arcane_recovery_levels": 7
      }
    },
    "15": {
      "level": 15,
      "prof_bonus": 5,
      "ability_score_bonuses": 3,
      "features": [],
      "spellcasting": {
        "cantrips_known": 5,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1,
          "7": 1,
          "8": 1
        }
      },
      "class_specific": {
        "arcane_recovery_levels": 8
      }
    },
    "16": {
      "level": 16,
      "prof_bonus": 5,
      "ability_score_bonuses": 4,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 5,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1,
          "7": 1,
          "8": 1
        }
      },
      "class_specific": {
        "arcane_recovery_levels": 8
      }
    },
    "17": {
      "level": 17,
      "prof_bonus": 6,
      "ability_score_bonuses": 4,
      "features": [],
      "spellcasting": {
        "cantrips_known": 5,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 2,
          "6": 1,
          "7": 1,
          "8": 1,
          "9": 1
        }
      },
      "class_specific": {
        "arcane_recovery_levels": 9
      }
    },
    "18": {
      "level": 18,
      "prof_bonus": 6,
      "ability_score_bonuses": 4,
      "features": [
        "法术精通"
      ],
      "spellcasting": {
        "cantrips_known": 5,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 3,
          "6": 1,
          "7": 1,
          "8": 1,
          "9": 1
        }
      },
      "class_specific": {
        "arcane_recovery_levels": 9
      }
    },
    "19": {
      "level": 19,
      "prof_bonus": 6,
      "ability_score_bonuses": 5,
      "features": [
        "属性提升"
      ],
      "spellcasting": {
        "cantrips_known": 5,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 3,
          "6": 2,
          "7": 1,
          "8": 1,
          "9": 1
        }
      },
      "class_specific": {
        "arcane_recovery_levels": 10
      }
    },
    "20": {
      "level": 20,
      "prof_bonus": 6,
      "ability_score_bonuses": 5,
      "features": [
        "招牌法术"
      ],
      "spellcasting": {
        "cantrips_known": 5,
        "spells_known": 0,
        "slots": {
          "1": 4,
          "2": 3,
          "3": 3,
          "4": 3,
          "5": 3,
          "6": 2,
          "7": 2,
          "8": 1,
          "9": 1
        }
      },
      "class_specific": {
        "arcane_recovery_levels": 10
      }
    }
  }
};

export const SUBCLASSES: Record<string, any> = {
  "狂战士道途": {
    "en": "Berserker",
    "class": "野蛮人",
    "flavor": "Primal Path",
    "desc_en": [
      "For some barbarians, rage is a means to an end--that end being violence. The Path of the Berserker is a path of untrammeled fury, slick with blood. As you enter the berserker's rage, you thrill in the chaos of battle, heedless of your own health or well-being."
    ]
  },
  "勇士": {
    "en": "Champion",
    "class": "战士",
    "flavor": "Martial Archetype",
    "desc_en": [
      "The archetypal Champion focuses on the development of raw physical power honed to deadly perfection. Those who model themselves on this archetype combine rigorous training with physical excellence to deal devastating blows."
    ]
  },
  "奉献之誓": {
    "en": "Devotion",
    "class": "圣武士",
    "flavor": "Sacred Oath",
    "desc_en": [
      "The Oath of Devotion binds a paladin to the loftiest ideals of justice, virtue, and order. Sometimes called cavaliers, white knights, or holy warriors, these paladins meet the ideal of the knight in shining armor, acting with honor in pursuit of justice and the greater good. They hold themselves to the highest standards of conduct, and some, for better or worse, hold the rest of the world to the same standards. Many who swear this oath are devoted to gods of law and good and use their gods' tenets as the measure of their devotion. They hold angels--the perfect servants of good--as their ideals, and incorporate images of angelic wings into their helmets or coats of arms."
    ]
  },
  "龙族血脉": {
    "en": "Draconic",
    "class": "术士",
    "flavor": "Sorcerous Origin",
    "desc_en": [
      "Your innate magic comes from draconic magic that was mingled with your blood or that of your ancestors. Most often, sorcerers with this origin trace their descent back to a mighty sorcerer of ancient times who made a bargain with a dragon or who might even have claimed a dragon parent. Some of these bloodlines are well established in the world, but most are obscure. Any given sorcerer could be the first of a new bloodline, as a result of a pact or some other exceptional circumstance."
    ]
  },
  "塑能学派": {
    "en": "Evocation",
    "class": "法师",
    "flavor": "Arcane Tradition",
    "desc_en": [
      "You focus your study on magic that creates powerful elemental effects such as bitter cold, searing flame, rolling thunder, crackling lightning, and burning acid. Some evokers find employment in military forces, serving as artillery to blast enemy armies from afar. Others use their spectacular power to protect the weak, while some seek their own gain as bandits, adventurers, or aspiring tyrants."
    ]
  },
  "邪魔宗主": {
    "en": "Fiend",
    "class": "魔契师",
    "flavor": "Otherworldly Patron",
    "desc_en": [
      "You have made a pact with a fiend from the lower planes of existence, a being whose aims are evil, even if you strive against those aims. Such beings desire the corruption or destruction of all things, ultimately including you. Fiends powerful enough to forge a pact include demon lords such as Demogorgon, Orcus, Fraz'Urb-luu, and Baphomet; archdevils such as Asmodeus, Dispater, Mephistopheles, and Belial; pit fiends and balors that are especially mighty; and ultroloths and other lords of the yugoloths."
    ]
  },
  "猎人": {
    "en": "Hunter",
    "class": "游侠",
    "flavor": "Ranger Archetype",
    "desc_en": [
      "Emulating the Hunter archetype means accepting your place as a bulwark between civilization and the terrors of the wilderness. As you walk the Hunter's path, you learn specialized techniques for fighting the threats you face, from rampaging ogres and hordes of orcs to towering giants and terrifying dragons."
    ]
  },
  "大地结社": {
    "en": "Land",
    "class": "德鲁伊",
    "flavor": "Druid Circle",
    "desc_en": [
      "The Circle of the Land is made up of mystics and sages who safeguard ancient knowledge and rites through a vast oral tradition. These druids meet within sacred circles of trees or standing stones to whisper primal secrets in Druidic. The circle's wisest members preside as the chief priests of communities that hold to the Old Faith and serve as advisors to the rulers of those folk. As a member of this circle, your magic is influenced by the land where you were initiated into the circle's mysterious rites."
    ]
  },
  "生命领域": {
    "en": "Life",
    "class": "牧师",
    "flavor": "Divine Domain",
    "desc_en": [
      "The Life domain focuses on the vibrant positive energy--one of the fundamental forces of the universe--that sustains all life. The gods of life promote vitality and health through healing the sick and wounded, caring for those in need, and driving away the forces of death and undeath. Almost any non-evil deity can claim influence over this domain, particularly agricultural deities, sun gods, gods of healing or endurance, and gods of home and community."
    ]
  },
  "逸闻学院": {
    "en": "Lore",
    "class": "吟游诗人",
    "flavor": "Bard College",
    "desc_en": [
      "Bards of the College of Lore know something about most things, collecting bits of knowledge from sources as diverse as scholarly tomes and peasant tales. Whether singing folk ballads in taverns or elaborate compositions in royal courts, these bards use their gifts to hold audiences spellbound. When the applause dies down, the audience members might find themselves questioning everything they held to be true, from their faith in the priesthood of the local temple to their loyalty to the king. The loyalty of these bards lies in the pursuit of beauty and truth, not in fealty to a monarch or following the tenets of a deity. A noble who keeps such a bard as a herald or advisor knows that the bard would rather be honest than politic. The college's members gather in libraries and sometimes in actual colleges, complete with classrooms and dormitories, to share their lore with one another. They also meet at festivals or affairs of state, where they can expose corruption, unravel lies, and poke fun at self-important figures of authority."
    ]
  },
  "散打宗": {
    "en": "Open Hand",
    "class": "武僧",
    "flavor": "Monastic Tradition",
    "desc_en": [
      "Monks of the Way of the Open Hand are the ultimate masters of martial arts combat, whether armed or unarmed. They learn techniques to push and trip their opponents, manipulate ki to heal damage to their bodies, and practice advanced meditation that can protect them from harm."
    ]
  },
  "盗贼": {
    "en": "Thief",
    "class": "游荡者",
    "flavor": "Roguish Archetype",
    "desc_en": [
      "You hone your skills in the larcenous arts. Burglars, bandits, cutpurses, and other criminals typically follow this archetype, but so do rogues who prefer to think of themselves as professional treasure seekers, explorers, delvers, and investigators. In addition to improving your agility and stealth, you learn skills useful for delving into ancient ruins, reading unfamiliar languages, and using magic items you normally couldn't employ."
    ]
  }
};

export const FEATURES: Record<string, any> = {
  "行动如潮（1次）": {
    "en": "Action Surge (1 use)",
    "class": "战士",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "Starting at 2nd level, you can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action on top of your regular action and a possible bonus action.",
      "Once you use this feature, you must finish a short or long rest before you can use it again. Starting at 17th level, you can use it twice before a rest, but only once on the same turn."
    ]
  },
  "行动如潮（2次）": {
    "en": "Action Surge (2 uses)",
    "class": "战士",
    "subclass": "",
    "level": 17,
    "prereq": [],
    "desc_en": [
      "Starting at 2nd level, you can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action on top of your regular action and a possible bonus action.",
      "Once you use this feature, you must finish a short or long rest before you can use it again. Starting at 17th level, you can use it twice before a rest, but only once on the same turn."
    ]
  },
  "额外战斗风格": {
    "en": "Additional Fighting Style",
    "class": "战士",
    "subclass": "勇士",
    "level": 10,
    "prereq": [],
    "desc_en": [
      "At 10th level, you can choose a second option from the Fighting Style class feature."
    ]
  },
  "额外秘学知识": {
    "en": "Additional Magical Secrets",
    "class": "吟游诗人",
    "subclass": "逸闻学院",
    "level": 6,
    "prereq": [],
    "desc_en": [
      "At 6th level, you learn two spells of your choice from any class. A spell you choose must be of a level you can cast, as shown on the Bard table, or a cantrip. The chosen spells count as bard spells for you but don't count against the number of bard spells you know."
    ]
  },
  "奥术回复": {
    "en": "Arcane Recovery",
    "class": "法师",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "You have learned to regain some of your magical energy by studying your spellbook. Once per day when you finish a short rest, you can choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than half your wizard level (rounded up), and none of the slots can be 6th level or higher.",
      "For example, if you're a 4th-level wizard, you can recover up to two levels worth of spell slots. You can recover either a 2nd-level spell slot or two 1st-level spell slots."
    ]
  },
  "奥术传承": {
    "en": "Arcane Tradition",
    "class": "法师",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "When you reach 2nd level, you choose an arcane tradition, shaping your practice of magic through one of eight schools, such as Evocation.",
      "Your choice grants you features at 2nd level and again at 6th, 10th, and 14th level."
    ]
  },
  "奥术传承特性": {
    "en": "Arcane Tradition feature",
    "class": "法师",
    "subclass": "",
    "level": 6,
    "prereq": [],
    "desc_en": [
      "When you reach 2nd level, you choose an arcane tradition, shaping your practice of magic through one of eight schools, such as Evocation.",
      "Your choice grants you features at 2nd level and again at 6th, 10th, and 14th level."
    ]
  },
  "奥术传承特性（Arcane Tradition feature）": {
    "en": "Arcane Tradition feature",
    "class": "法师",
    "subclass": "",
    "level": 14,
    "prereq": [],
    "desc_en": [
      "When you reach 2nd level, you choose an arcane tradition, shaping your practice of magic through one of eight schools, such as Evocation.",
      "Your choice grants you features at 2nd level and again at 6th, 10th, and 14th level."
    ]
  },
  "大德鲁伊": {
    "en": "Archdruid",
    "class": "德鲁伊",
    "subclass": "",
    "level": 20,
    "prereq": [],
    "desc_en": [
      "At 20th level, you can use your Wild Shape an unlimited number of times.",
      "Additionally, you can ignore the verbal and somatic components of your druid spells, as well as any material components that lack a cost and aren't consumed by a spell. You gain this benefit in both your normal shape and your beast shape from Wild Shape."
    ]
  },
  "光环强化": {
    "en": "Aura improvements",
    "class": "圣武士",
    "subclass": "",
    "level": 18,
    "prereq": [],
    "desc_en": [
      "At 18th level, the range of your auras increase to 30 feet."
    ]
  },
  "勇气光环": {
    "en": "Aura of Courage",
    "class": "圣武士",
    "subclass": "",
    "level": 10,
    "prereq": [],
    "desc_en": [
      "Starting at 10th level, you and friendly creatures within 10 feet of you can't be frightened while you are conscious.",
      "At 18th level, the range of this aura increases to 30 feet."
    ]
  },
  "奉献光环": {
    "en": "Aura of Devotion",
    "class": "圣武士",
    "subclass": "奉献之誓",
    "level": 7,
    "prereq": [],
    "desc_en": [
      "Starting at 7th level, you and friendly creatures within 10 feet of you can't be charmed while you are conscious.",
      "At 18th level, the range of this aura increases to 30 feet."
    ]
  },
  "守护光环": {
    "en": "Aura of Protection",
    "class": "圣武士",
    "subclass": "",
    "level": 6,
    "prereq": [],
    "desc_en": [
      "Starting at 6th level, whenever you or a friendly creature within 10 feet of you must make a saving throw, the creature gains a bonus to the saving throw equal to your Charisma modifier (with a minimum bonus of +1). You must be conscious to grant this bonus.",
      "At 18th level, the range of this aura increases to 30 feet."
    ]
  },
  "属性提升": {
    "en": "Ability Score Improvement",
    "class": "野蛮人",
    "subclass": "",
    "level": 4,
    "prereq": [],
    "desc_en": [
      "When you reach 4th level, and again at 8th, 12th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature."
    ]
  },
  "属性提升（Ability Score Improvement）": {
    "en": "Ability Score Improvement",
    "class": "法师",
    "subclass": "",
    "level": 19,
    "prereq": [],
    "desc_en": [
      "When you reach 4th level, and again at 8th, 12th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature."
    ]
  },
  "额外攻击": {
    "en": "Extra Attack",
    "class": "野蛮人",
    "subclass": "",
    "level": 5,
    "prereq": [],
    "desc_en": [
      "Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn."
    ]
  },
  "无甲防御": {
    "en": "Unarmored Defense",
    "class": "野蛮人",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "While you are not wearing any armor, your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier. You can use a shield and still gain this benefit."
    ]
  },
  "吟游诗人学院": {
    "en": "Bard College",
    "class": "吟游诗人",
    "subclass": "",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "At 3rd level, you delve into the advanced techniques of a bard college of your choice, such as the College of Lore. Your choice grants you features at 3rd level and again at 6th and 14th level."
    ]
  },
  "吟游诗人学院特性": {
    "en": "Bard College feature",
    "class": "吟游诗人",
    "subclass": "",
    "level": 6,
    "prereq": [],
    "desc_en": [
      "At 3rd level, you delve into the advanced techniques of a bard college of your choice, such as the College of Lore. Your choice grants you features at 3rd level and again at 6th and 14th level."
    ]
  },
  "吟游诗人学院特性（Bard College feature）": {
    "en": "Bard College feature",
    "class": "吟游诗人",
    "subclass": "",
    "level": 14,
    "prereq": [],
    "desc_en": [
      "At 3rd level, you delve into the advanced techniques of a bard college of your choice, such as the College of Lore. Your choice grants you features at 3rd level and again at 6th and 14th level."
    ]
  },
  "专精造诣": {
    "en": "Expertise",
    "class": "吟游诗人",
    "subclass": "",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "At 3rd level, choose two of your skill proficiencies. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies. At 10th level, you can choose another two skill proficiencies to gain this benefit."
    ]
  },
  "专精造诣（Expertise）": {
    "en": "Expertise",
    "class": "游荡者",
    "subclass": "",
    "level": 6,
    "prereq": [],
    "desc_en": [
      "At 1st level, choose two of your skill proficiencies, or one of your skill proficiencies and your proficiency with thieves' tools. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.",
      "At 6th level, you can choose two more of your proficiencies (in skills or with thieves' tools) to gain this benefit"
    ]
  },
  "诗人激励（d10）": {
    "en": "Bardic Inspiration (d10)",
    "class": "吟游诗人",
    "subclass": "",
    "level": 10,
    "prereq": [],
    "desc_en": [
      "You can inspire others through stirring words or music. To do so, you use a bonus action on your turn to choose one creature other than yourself within 60 feet of you who can hear you. That creature gains one Bardic Inspiration die, a d6. Once within the next 10 minutes, the creature can roll the die and add the number rolled to one ability check, attack roll, or saving throw it makes. The creature can wait until after it rolls the d20 before deciding to use the Bardic Inspiration die, but must decide before the GM says whether the roll succeeds or fails. Once the Bardic Inspiration die is rolled, it is lost. A creature can have only one Bardic Inspiration die at a time.",
      "You can use this feature a number of times equal to your Charisma modifier (a minimum of once). You regain any expended uses when you finish a long rest. ",
      "Your Bardic Inspiration die changes when you reach certain levels in this class. The die becomes a d8 at 5th level, a d10 at 10th level, and a d12 at 15th level."
    ]
  },
  "诗人激励（d12）": {
    "en": "Bardic Inspiration (d12)",
    "class": "吟游诗人",
    "subclass": "",
    "level": 15,
    "prereq": [],
    "desc_en": [
      "You can inspire others through stirring words or music. To do so, you use a bonus action on your turn to choose one creature other than yourself within 60 feet of you who can hear you. That creature gains one Bardic Inspiration die, a d6. Once within the next 10 minutes, the creature can roll the die and add the number rolled to one ability check, attack roll, or saving throw it makes. The creature can wait until after it rolls the d20 before deciding to use the Bardic Inspiration die, but must decide before the GM says whether the roll succeeds or fails. Once the Bardic Inspiration die is rolled, it is lost. A creature can have only one Bardic Inspiration die at a time.",
      "You can use this feature a number of times equal to your Charisma modifier (a minimum of once). You regain any expended uses when you finish a long rest. ",
      "Your Bardic Inspiration die changes when you reach certain levels in this class. The die becomes a d8 at 5th level, a d10 at 10th level, and a d12 at 15th level."
    ]
  },
  "诗人激励（d6）": {
    "en": "Bardic Inspiration (d6)",
    "class": "吟游诗人",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "You can inspire others through stirring words or music. To do so, you use a bonus action on your turn to choose one creature other than yourself within 60 feet of you who can hear you. That creature gains one Bardic Inspiration die, a d6. Once within the next 10 minutes, the creature can roll the die and add the number rolled to one ability check, attack roll, or saving throw it makes. The creature can wait until after it rolls the d20 before deciding to use the Bardic Inspiration die, but must decide before the GM says whether the roll succeeds or fails. Once the Bardic Inspiration die is rolled, it is lost. A creature can have only one Bardic Inspiration die at a time.",
      "You can use this feature a number of times equal to your Charisma modifier (a minimum of once). You regain any expended uses when you finish a long rest. ",
      "Your Bardic Inspiration die changes when you reach certain levels in this class. The die becomes a d8 at 5th level, a d10 at 10th level, and a d12 at 15th level."
    ]
  },
  "诗人激励（d8）": {
    "en": "Bardic Inspiration (d8)",
    "class": "吟游诗人",
    "subclass": "",
    "level": 5,
    "prereq": [],
    "desc_en": [
      "You can inspire others through stirring words or music. To do so, you use a bonus action on your turn to choose one creature other than yourself within 60 feet of you who can hear you. That creature gains one Bardic Inspiration die, a d6. Once within the next 10 minutes, the creature can roll the die and add the number rolled to one ability check, attack roll, or saving throw it makes. The creature can wait until after it rolls the d20 before deciding to use the Bardic Inspiration die, but must decide before the GM says whether the roll succeeds or fails. Once the Bardic Inspiration die is rolled, it is lost. A creature can have only one Bardic Inspiration die at a time.",
      "You can use this feature a number of times equal to your Charisma modifier (a minimum of once). You regain any expended uses when you finish a long rest. ",
      "Your Bardic Inspiration die changes when you reach certain levels in this class. The die becomes a d8 at 5th level, a d10 at 10th level, and a d12 at 15th level."
    ]
  },
  "野兽法术": {
    "en": "Beast Spells",
    "class": "德鲁伊",
    "subclass": "",
    "level": 18,
    "prereq": [],
    "desc_en": [
      "Beginning at 18th level, you can cast many of your druid spells in any shape you assume using Wild Shape. You can perform the somatic and verbal components of a druid spell while in a beast shape, but you aren't able to provide material components."
    ]
  },
  "受祝治疗者": {
    "en": "Blessed Healer",
    "class": "牧师",
    "subclass": "生命领域",
    "level": 6,
    "prereq": [],
    "desc_en": [
      "Beginning at 6th level, the healing spells you cast on others heal you as well. When you cast a spell of 1st level or higher that restores hit points to a creature other than you, you regain hit points equal to 2 + the spell's level."
    ]
  },
  "盲视感知": {
    "en": "Blindsense",
    "class": "游荡者",
    "subclass": "",
    "level": 14,
    "prereq": [],
    "desc_en": [
      "Starting at 14th level, if you are able to hear, you are aware of the location of any hidden or invisible creature within 10 feet of you."
    ]
  },
  "额外戏法": {
    "en": "Bonus Cantrip",
    "class": "德鲁伊",
    "subclass": "大地结社",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "When you choose this circle at 2nd level, you learn one additional druid cantrip of your choice."
    ]
  },
  "额外熟练": {
    "en": "Bonus Proficiencies",
    "class": "吟游诗人",
    "subclass": "逸闻学院",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "When you join the College of Lore at 3rd level, you gain proficiency with three skills of your choice."
    ]
  },
  "额外熟练项": {
    "en": "Bonus Proficiency",
    "class": "牧师",
    "subclass": "生命领域",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "When you choose this domain at 1st level, you gain proficiency with heavy armor."
    ]
  },
  "残暴重击（1骰）": {
    "en": "Brutal Critical (1 die)",
    "class": "野蛮人",
    "subclass": "",
    "level": 9,
    "prereq": [],
    "desc_en": [
      "Beginning at 9th level, you can roll one additional weapon damage die when determining the extra damage for a critical hit with a melee attack. This increases to two additional dice at 13th level and three additional dice at 17th level."
    ]
  },
  "残暴重击（2骰）": {
    "en": "Brutal Critical (2 dice)",
    "class": "野蛮人",
    "subclass": "",
    "level": 13,
    "prereq": [],
    "desc_en": [
      "Beginning at 9th level, you can roll one additional weapon damage die when determining the extra damage for a critical hit with a melee attack. This increases to two additional dice at 13th level and three additional dice at 17th level."
    ]
  },
  "残暴重击（3骰）": {
    "en": "Brutal Critical (3 dice)",
    "class": "野蛮人",
    "subclass": "",
    "level": 17,
    "prereq": [],
    "desc_en": [
      "Beginning at 9th level, you can roll one additional weapon damage die when determining the extra damage for a critical hit with a melee attack. This increases to two additional dice at 13th level and three additional dice at 17th level."
    ]
  },
  "引导神力": {
    "en": "Channel Divinity",
    "class": "圣武士",
    "subclass": "",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "Your oath allows you to channel divine energy to fuel magical effects. Each Channel Divinity option provided by your oath explains how to use it.",
      "When you use your Channel Divinity, you choose which option to use. You must then finish a short or long rest to use your Channel Divinity again.",
      "Some Channel Divinity effects require saving throws. When you use such an effect from this class, the DC equals your paladin spell save DC."
    ]
  },
  "引导神力（1次/休整）": {
    "en": "Channel Divinity (1/rest)",
    "class": "牧师",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "At 2nd level, you gain the ability to channel divine energy directly from your deity, using that energy to fuel magical effects. You start with two such effects: Turn Undead and an effect determined by your domain. Some domains grant you additional effects as you advance in levels, as noted in the domain description.",
      "When you use your Channel Divinity, you choose which effect to create. You must then finish a short or long rest to use your Channel Divinity again.",
      "Some Channel Divinity effects require saving throws. When you use such an effect from this class, the DC equals your cleric spell save DC.",
      "Beginning at 6th level, you can use your Channel Divinity twice between rests, and beginning at 18th level, you can use it three times between rests. When you finish a short or long rest, you regain your expended uses."
    ]
  },
  "引导神力（2次/休整）": {
    "en": "Channel Divinity (2/rest)",
    "class": "牧师",
    "subclass": "",
    "level": 6,
    "prereq": [],
    "desc_en": [
      "Beginning at 6th level, you can use your Channel Divinity twice between rests, and beginning at 18th level, you can use it three times between rests. When you finish a short or long rest, you regain your expended uses."
    ]
  },
  "引导神力（3次/休整）": {
    "en": "Channel Divinity (3/rest)",
    "class": "牧师",
    "subclass": "",
    "level": 18,
    "prereq": [],
    "desc_en": [
      "Beginning at 6th level, you can use your Channel Divinity twice between rests, and beginning at 18th level, you can use it three times between rests. When you finish a short or long rest, you regain your expended uses."
    ]
  },
  "引导神力：维系生命": {
    "en": "Channel Divinity: Preserve Life",
    "class": "牧师",
    "subclass": "生命领域",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "Starting at 2nd level, you can use your Channel Divinity to heal the badly injured.",
      "As an action, you present your holy symbol and evoke healing energy that can restore a number of hit points equal to five times your cleric level.",
      "Choose any creatures within 30 feet of you, and divide those hit points among them. This feature can restore a creature to no more than half of its hit point maximum. You can't use this feature on an undead or a construct."
    ]
  },
  "引导神力：圣化武器": {
    "en": "Channel Divinity: Sacred Weapon",
    "class": "圣武士",
    "subclass": "奉献之誓",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "As an action, you can imbue one weapon that you are holding with positive energy, using your Channel Divinity. For 1 minute, you add your Charisma modifier to attack rolls made with that weapon (with a minimum bonus of +1). The weapon also emits bright light in a 20-foot radius and dim light 20 feet beyond that. If the weapon is not already magical, it becomes magical for the duration.",
      "You can end this effect on your turn as part of any other action. If you are no longer holding or carrying this weapon, or if you fall unconscious, this effect ends."
    ]
  },
  "引导神力：驱散邪秽": {
    "en": "Channel Divinity: Turn the Unholy",
    "class": "圣武士",
    "subclass": "奉献之誓",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "As an action, you present your holy symbol and speak a prayer censuring fiends and undead, using your Channel Divinity. Each fiend or undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes damage.",
      "A turned creature must spend its turns trying to move as far away from you as it can, and it can't willingly move to a space within 30 feet of you. It also can't take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there's nowhere to move, the creature can use the Dodge action."
    ]
  },
  "引导神力：驱散不死生物": {
    "en": "Channel Divinity: Turn Undead",
    "class": "牧师",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "As an action, you present your holy symbol and speak a prayer censuring the undead. Each undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes any damage.",
      "A turned creature must spend its turns trying to move as far away from you as it can, and it can't willingly move to a space within 30 feet of you. It also can't take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there's nowhere to move, the creature can use the Dodge action."
    ]
  },
  "大地结社": {
    "en": "Circle of the Land",
    "class": "德鲁伊",
    "subclass": "大地结社",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "The Circle of the Land is made up of mystics and sages who safeguard ancient knowledge and rites through a vast oral tradition. These druids meet within sacred circles of trees or standing stones to whisper primal secrets in Druidic. The circle's wisest members preside as the chief priests of communities that hold to the Old Faith and serve as advisors to the rulers of those folk. As a member of this circle, your magic is influenced by the land where you were initiated into the circle's mysterious rites."
    ]
  },
  "大地结社：极地": {
    "en": "Circle of the Land: Arctic",
    "class": "德鲁伊",
    "subclass": "大地结社",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "The Circle of the Land is made up of mystics and sages who safeguard ancient knowledge and rites through a vast oral tradition. These druids meet within sacred circles of trees or standing stones to whisper primal secrets in Druidic. The circle's wisest members preside as the chief priests of communities that hold to the Old Faith and serve as advisors to the rulers of those folk. As a member of this circle, your magic is influenced by the land where you were initiated into the circle's mysterious rites."
    ]
  },
  "大地结社：海岸": {
    "en": "Circle of the Land: Coast",
    "class": "德鲁伊",
    "subclass": "大地结社",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "The Circle of the Land is made up of mystics and sages who safeguard ancient knowledge and rites through a vast oral tradition. These druids meet within sacred circles of trees or standing stones to whisper primal secrets in Druidic. The circle's wisest members preside as the chief priests of communities that hold to the Old Faith and serve as advisors to the rulers of those folk. As a member of this circle, your magic is influenced by the land where you were initiated into the circle's mysterious rites."
    ]
  },
  "大地结社：沙漠": {
    "en": "Circle of the Land: Desert",
    "class": "德鲁伊",
    "subclass": "大地结社",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "The Circle of the Land is made up of mystics and sages who safeguard ancient knowledge and rites through a vast oral tradition. These druids meet within sacred circles of trees or standing stones to whisper primal secrets in Druidic. The circle's wisest members preside as the chief priests of communities that hold to the Old Faith and serve as advisors to the rulers of those folk. As a member of this circle, your magic is influenced by the land where you were initiated into the circle's mysterious rites."
    ]
  },
  "大地结社：森林": {
    "en": "Circle of the Land: Forest",
    "class": "德鲁伊",
    "subclass": "大地结社",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "The Circle of the Land is made up of mystics and sages who safeguard ancient knowledge and rites through a vast oral tradition. These druids meet within sacred circles of trees or standing stones to whisper primal secrets in Druidic. The circle's wisest members preside as the chief priests of communities that hold to the Old Faith and serve as advisors to the rulers of those folk. As a member of this circle, your magic is influenced by the land where you were initiated into the circle's mysterious rites."
    ]
  },
  "大地结社：草原": {
    "en": "Circle of the Land: Grassland",
    "class": "德鲁伊",
    "subclass": "大地结社",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "The Circle of the Land is made up of mystics and sages who safeguard ancient knowledge and rites through a vast oral tradition. These druids meet within sacred circles of trees or standing stones to whisper primal secrets in Druidic. The circle's wisest members preside as the chief priests of communities that hold to the Old Faith and serve as advisors to the rulers of those folk. As a member of this circle, your magic is influenced by the land where you were initiated into the circle's mysterious rites."
    ]
  },
  "大地结社：山地": {
    "en": "Circle of the Land: Mountain",
    "class": "德鲁伊",
    "subclass": "大地结社",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "The Circle of the Land is made up of mystics and sages who safeguard ancient knowledge and rites through a vast oral tradition. These druids meet within sacred circles of trees or standing stones to whisper primal secrets in Druidic. The circle's wisest members preside as the chief priests of communities that hold to the Old Faith and serve as advisors to the rulers of those folk. As a member of this circle, your magic is influenced by the land where you were initiated into the circle's mysterious rites."
    ]
  },
  "大地结社：沼泽": {
    "en": "Circle of the Land: Swamp",
    "class": "德鲁伊",
    "subclass": "大地结社",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "The Circle of the Land is made up of mystics and sages who safeguard ancient knowledge and rites through a vast oral tradition. These druids meet within sacred circles of trees or standing stones to whisper primal secrets in Druidic. The circle's wisest members preside as the chief priests of communities that hold to the Old Faith and serve as advisors to the rulers of those folk. As a member of this circle, your magic is influenced by the land where you were initiated into the circle's mysterious rites."
    ]
  },
  "结社法术": {
    "en": "Circle Spells",
    "class": "德鲁伊",
    "subclass": "大地结社",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "Your mystical connection to the land infuses you with the ability to cast certain spells. At 3rd, 5th, 7th, and 9th level you gain access to circle spells connected to the land where you became a druid.",
      "Choose that land--arctic, coast, desert, forest, grassland, mountain, or swamp--and consult the associated list of spells.",
      "Once you gain access to a circle spell, you always have it prepared, and it doesn't count against the number of spells you can prepare each day. If you gain access to a spell that doesn't appear on the druid spell list, the spell is nonetheless a druid spell for you."
    ]
  },
  "结社法术（Circle Spells）": {
    "en": "Circle Spells",
    "class": "德鲁伊",
    "subclass": "大地结社",
    "level": 9,
    "prereq": [],
    "desc_en": [
      "Your mystical connection to the land infuses you with the ability to cast certain spells. At 3rd, 5th, 7th, and 9th level you gain access to circle spells connected to the land where you became a druid.",
      "Choose that land--arctic, coast, desert, forest, grassland, mountain, or swamp--and consult the associated list of spells.",
      "Once you gain access to a circle spell, you always have it prepared, and it doesn't count against the number of spells you can prepare each day. If you gain access to a spell that doesn't appear on the druid spell list, the spell is nonetheless a druid spell for you."
    ]
  },
  "净化之触": {
    "en": "Cleansing Touch",
    "class": "圣武士",
    "subclass": "",
    "level": 14,
    "prereq": [],
    "desc_en": [
      "Beginning at 14th level, you can use your action to end one spell on yourself or on one willing creature that you touch.",
      "You can use this feature a number of times equal to your Charisma modifier (a minimum of once). You regain expended uses when you finish a long rest."
    ]
  },
  "破咒之歌": {
    "en": "Countercharm",
    "class": "吟游诗人",
    "subclass": "",
    "level": 6,
    "prereq": [],
    "desc_en": [
      "At 6th level, you gain the ability to use musical notes or words of power to disrupt mind-influencing effects. As an action, you can start a performance that lasts until the end of your next turn. During that time, you and any friendly creatures within 30 feet of you have advantage on saving throws against being frightened or charmed. A creature must be able to hear you to gain this benefit. The performance ends early if you are incapacitated or silenced or if you voluntarily end it (no action required)."
    ]
  },
  "机敏动作": {
    "en": "Cunning Action",
    "class": "游荡者",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "Starting at 2nd level, your quick thinking and agility allow you to move and act quickly. You can take a bonus action on each of your turns in combat. This action can be used only to take the Dash, Disengage, or Hide action."
    ]
  },
  "尖刻之词": {
    "en": "Cutting Words",
    "class": "吟游诗人",
    "subclass": "逸闻学院",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "Also at 3rd level, you learn how to use your wit to distract, confuse, and otherwise sap the confidence and competence of others.",
      "When a creature that you can see within 60 feet of you makes an attack roll, an ability check, or a damage roll, you can use your reaction to expend one of your uses of Bardic Inspiration, rolling a Bardic Inspiration die and subtracting the number rolled from the creature's roll.",
      "You can choose to use this feature after the creature makes its roll, but before the GM determines whether the attack roll or ability check succeeds or fails, or before the creature deals its damage. The creature is immune if it can't hear you or if it's immune to being charmed."
    ]
  },
  "危险感知": {
    "en": "Danger Sense",
    "class": "野蛮人",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "At 2nd level, you gain an uncanny sense of when things nearby aren't as they should be, giving you an edge when you dodge away from danger. You have advantage on Dexterity saving throws against effects that you can see, such as traps and spells. To gain this benefit, you can't be blinded, deafened, or incapacitated."
    ]
  },
  "暗主的祝福": {
    "en": "Dark One's Blessing",
    "class": "魔契师",
    "subclass": "邪魔宗主",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "Starting at 1st level, when you reduce a hostile creature to 0 hit points, you gain temporary hit points equal to your Charisma modifier + your warlock level (minimum of 1)."
    ]
  },
  "暗主的眷顾": {
    "en": "Dark One's Own Luck",
    "class": "魔契师",
    "subclass": "邪魔宗主",
    "level": 6,
    "prereq": [],
    "desc_en": [
      "Starting at 6th level, you can call on your patron to alter fate in your favor. When you make an ability check or a saving throw, you can use this feature to add a d10 to your roll. You can do so after seeing the initial roll but before any of the roll's effects occur.",
      "Once you use this feature, you can't use it again until you finish a short or long rest."
    ]
  },
  "防御战术": {
    "en": "Defensive Tactics",
    "class": "游侠",
    "subclass": "猎人",
    "level": 7,
    "prereq": [],
    "desc_en": [
      "At 7th level, you gain one of the following features of your choice.",
      "Escape the Horde",
      "Multiattack Defense",
      "Steel Will"
    ]
  },
  "防御战术：脱离群敌": {
    "en": "Defensive Tactics: Escape the Horde",
    "class": "游侠",
    "subclass": "猎人",
    "level": 7,
    "prereq": [],
    "desc_en": [
      "Opportunity attacks against you are made with disadvantage."
    ]
  },
  "防御战术：多重攻击防御": {
    "en": "Defensive Tactics: Multiattack Defense",
    "class": "游侠",
    "subclass": "猎人",
    "level": 7,
    "prereq": [],
    "desc_en": [
      "When a creature hits you with an attack, you gain a +4 bonus to AC against all subsequent attacks made by that creature for the rest of the turn."
    ]
  },
  "防御战术：钢铁意志": {
    "en": "Defensive Tactics: Steel Will",
    "class": "游侠",
    "subclass": "猎人",
    "level": 7,
    "prereq": [],
    "desc_en": [
      "You have advantage on saving throws against being frightened."
    ]
  },
  "拨挡飞弹": {
    "en": "Deflect Missiles",
    "class": "武僧",
    "subclass": "",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "Starting at 3rd level, you can use your reaction to deflect or catch the missile when you are hit by a ranged weapon attack. When you do so, the damage you take from the attack is reduced by 1d10 + your Dexterity modifier + your monk level.",
      "If you reduce the damage to 0, you can catch the missile if it is small enough for you to hold in one hand and you have at least one hand free. If you catch a missile in this way, you can spend 1 ki point to make a ranged attack with the weapon or piece of ammunition you just caught, as part of the same reaction. You make this attack with proficiency, regardless of your weapon proficiencies, and the missile counts as a monk weapon for the attack, which has a normal range of 20 feet and a long range of 60 feet."
    ]
  },
  "摧毁不死生物（CR 1/2 or below）": {
    "en": "Destroy Undead (CR 1/2 or below)",
    "class": "牧师",
    "subclass": "",
    "level": 5,
    "prereq": [],
    "desc_en": [
      "Starting at 5th level, when an undead fails its saving throw against your Turn Undead feature, the creature is instantly destroyed if its challenge rating is at or below a certain threshold."
    ]
  },
  "摧毁不死生物（CR 1 or below）": {
    "en": "Destroy Undead (CR 1 or below)",
    "class": "牧师",
    "subclass": "",
    "level": 8,
    "prereq": [],
    "desc_en": [
      "Starting at 5th level, when an undead fails its saving throw against your Turn Undead feature, the creature is instantly destroyed if its challenge rating is at or below a certain threshold."
    ]
  },
  "摧毁不死生物（CR 2 or below）": {
    "en": "Destroy Undead (CR 2 or below)",
    "class": "牧师",
    "subclass": "",
    "level": 11,
    "prereq": [],
    "desc_en": [
      "Starting at 5th level, when an undead fails its saving throw against your Turn Undead feature, the creature is instantly destroyed if its challenge rating is at or below a certain threshold."
    ]
  },
  "摧毁不死生物（CR 3 or below）": {
    "en": "Destroy Undead (CR 3 or below)",
    "class": "牧师",
    "subclass": "",
    "level": 14,
    "prereq": [],
    "desc_en": [
      "Starting at 5th level, when an undead fails its saving throw against your Turn Undead feature, the creature is instantly destroyed if its challenge rating is at or below a certain threshold."
    ]
  },
  "摧毁不死生物（CR 4 or below）": {
    "en": "Destroy Undead (CR 4 or below)",
    "class": "牧师",
    "subclass": "",
    "level": 17,
    "prereq": [],
    "desc_en": [
      "Starting at 5th level, when an undead fails its saving throw against your Turn Undead feature, the creature is instantly destroyed if its challenge rating is at or below a certain threshold."
    ]
  },
  "钻石之魂": {
    "en": "Diamond Soul",
    "class": "武僧",
    "subclass": "",
    "level": 14,
    "prereq": [],
    "desc_en": [
      "Beginning at 14th level, your mastery of ki grants you proficiency in all saving throws.",
      "Additionally, whenever you make a saving throw and fail, you can spend 1 ki point to reroll it and take the second result."
    ]
  },
  "生命门徒": {
    "en": "Disciple of Life",
    "class": "牧师",
    "subclass": "生命领域",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "Also starting at 1st level, your healing spells are more effective. Whenever you use a spell of 1st level or higher to restore hit points to a creature, the creature regains additional hit points equal to 2 + the spell's level."
    ]
  },
  "神术领域": {
    "en": "Divine Domain",
    "class": "牧师",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "Choose one domain related to your deity, such as Knowledge, Life, Light, Nature, Tempest, Trickery, or War. Only the Life domain is detailed in the Open Game Licensed SRD. Additional Domains are described in the official rulebooks or products from other publishers.",
      "Your domain grants you domain spells and other features when you choose it at 1st level. It also grants you additional ways to use Channel Divinity when you gain that feature at 2nd level, and additional benefits at 6th, 8th, and 17th levels."
    ]
  },
  "神术领域特性": {
    "en": "Divine Domain feature",
    "class": "牧师",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "Choose one domain related to your deity, such as Knowledge, Life, Light, Nature, Tempest, Trickery, or War. Only the Life domain is detailed in the Open Game Licensed SRD. Additional Domains are described in the official rulebooks or products from other publishers.",
      "Your domain grants you domain spells and other features when you choose it at 1st level. It also grants you additional ways to use Channel Divinity when you gain that feature at 2nd level, and additional benefits at 6th, 8th, and 17th levels."
    ]
  },
  "神术领域特性（Divine Domain feature）": {
    "en": "Divine Domain feature",
    "class": "牧师",
    "subclass": "",
    "level": 17,
    "prereq": [],
    "desc_en": [
      "Choose one domain related to your deity, such as Knowledge, Life, Light, Nature, Tempest, Trickery, or War. Only the Life domain is detailed in the Open Game Licensed SRD. Additional Domains are described in the official rulebooks or products from other publishers.",
      "Your domain grants you domain spells and other features when you choose it at 1st level. It also grants you additional ways to use Channel Divinity when you gain that feature at 2nd level, and additional benefits at 6th, 8th, and 17th levels."
    ]
  },
  "圣洁体魄": {
    "en": "Divine Health",
    "class": "圣武士",
    "subclass": "",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "By 3rd level, the divine magic flowing through you makes you immune to disease."
    ]
  },
  "神力干预": {
    "en": "Divine Intervention",
    "class": "牧师",
    "subclass": "",
    "level": 10,
    "prereq": [],
    "desc_en": [
      "Beginning at 10th level, you can call on your deity to intervene on your behalf when your need is great.",
      "Imploring your deity's aid requires you to use your action. Describe the assistance you seek, and roll percentile dice. If you roll a number equal to or lower than your cleric level, your deity intervenes. The GM chooses the nature of the intervention; the effect of any cleric spell or cleric domain spell would be appropriate.",
      "If your deity intervenes, you can't use this feature again for 7 days. Otherwise, you can use it again after you finish a long rest.",
      "At 20th level, your call for intervention succeeds automatically, no roll required."
    ]
  },
  "神力干预强化": {
    "en": "Divine Intervention Improvement",
    "class": "牧师",
    "subclass": "",
    "level": 20,
    "prereq": [],
    "desc_en": [
      "At 20th level, your call for intervention succeeds automatically, no roll required."
    ]
  },
  "神圣感知": {
    "en": "Divine Sense",
    "class": "圣武士",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "The presence of strong evil registers on your senses like a noxious odor, and powerful good rings like heavenly music in your ears. As an action, you can open your awareness to detect such forces. Until the end of your next turn, you know the location of any celestial, fiend, or undead within 60 feet of you that is not behind total cover. You know the type (celestial, fiend, or undead) of any being whose presence you sense, but not its identity. Within the same radius, you also detect the presence of any place or object that has been consecrated or desecrated, as with the hallow spell.",
      "You can use this feature a number of times equal to 1 + your Charisma modifier. When you finish a long rest, you regain all expended uses."
    ]
  },
  "神威斩击": {
    "en": "Divine Smite",
    "class": "圣武士",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "Starting at 2nd level, when you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage to the target, in addition to the weapon's damage. The extra damage is 2d8 for a 1st-level spell slot, plus 1d8 for each spell level higher than 1st, to a maximum of 5d8. The damage increases by 1d8 if the target is an undead or a fiend."
    ]
  },
  "神圣打击": {
    "en": "Divine Strike",
    "class": "牧师",
    "subclass": "生命领域",
    "level": 8,
    "prereq": [],
    "desc_en": [
      "At 8th level, you gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 radiant damage to the target. When you reach 14th level, the extra damage increases to 2d8."
    ]
  },
  "领域法术": {
    "en": "Domain Spells",
    "class": "牧师",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "Each domain has a list of spells--its domain spells--that you gain at the cleric levels noted in the domain description. Once you gain a domain spell, you always have it prepared, and it doesn't count against the number of spells you can prepare each day.",
      "If you have a domain spell that doesn't appear on the cleric spell list, the spell is nonetheless a cleric spell for you."
    ]
  },
  "领域法术（Domain Spells）": {
    "en": "Domain Spells",
    "class": "牧师",
    "subclass": "",
    "level": 9,
    "prereq": [],
    "desc_en": [
      "Each domain has a list of spells--its domain spells--that you gain at the cleric levels noted in the domain description. Once you gain a domain spell, you always have it prepared, and it doesn't count against the number of spells you can prepare each day.",
      "If you have a domain spell that doesn't appear on the cleric spell list, the spell is nonetheless a cleric spell for you."
    ]
  },
  "龙族威压": {
    "en": "Draconic Presence",
    "class": "术士",
    "subclass": "龙族血脉",
    "level": 18,
    "prereq": [],
    "desc_en": [
      "Beginning at 18th level, you can channel the dread presence of your dragon ancestor, causing those around you to become awestruck or frightened. As an action, you can spend 5 sorcery points to draw on this power and exude an aura of awe or fear (your choice) to a distance of 60 feet. For 1 minute or until you lose your concentration (as if you were casting a concentration spell), each hostile creature that starts its turn in this aura must succeed on a Wisdom saving throw or be charmed (if you chose awe) or frightened (if you chose fear) until the aura ends. A creature that succeeds on this saving throw is immune to your aura for 24 hours."
    ]
  },
  "龙族坚韧": {
    "en": "Draconic Resilience",
    "class": "术士",
    "subclass": "龙族血脉",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "As magic flows through your body, it causes physical traits of your dragon ancestors to emerge. At 1st level, your hit point maximum increases by 1 and increases by 1 again whenever you gain a level in this class.",
      "Additionally, parts of your skin are covered by a thin sheen of dragon-like scales. When you aren't wearing armor, your AC equals 13 + your Dexterity modifier."
    ]
  },
  "龙族先祖": {
    "en": "Dragon Ancestor",
    "class": "术士",
    "subclass": "龙族血脉",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "At 1st level, you choose one type of dragon as your ancestor. The damage type associated with each dragon is used by features you gain later.",
      "You can speak, read, and write Draconic. Additionally, whenever you make a Charisma check when interacting with dragons, your proficiency bonus is doubled if it applies to the check."
    ]
  },
  "龙族先祖：黑龙（酸蚀）": {
    "en": "Dragon Ancestor: Black - Acid Damage",
    "class": "术士",
    "subclass": "龙族血脉",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "At 1st level, you choose one type of dragon as your ancestor. The damage type associated with each dragon is used by features you gain later.",
      "You can speak, read, and write Draconic. Additionally, whenever you make a Charisma check when interacting with dragons, your proficiency bonus is doubled if it applies to the check."
    ]
  },
  "龙族先祖：蓝龙（闪电）": {
    "en": "Dragon Ancestor: Blue - Lightning Damage",
    "class": "术士",
    "subclass": "龙族血脉",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "At 1st level, you choose one type of dragon as your ancestor. The damage type associated with each dragon is used by features you gain later.",
      "You can speak, read, and write Draconic. Additionally, whenever you make a Charisma check when interacting with dragons, your proficiency bonus is doubled if it applies to the check."
    ]
  },
  "龙族先祖：黄铜龙（火焰）": {
    "en": "Dragon Ancestor: Brass - Fire Damage",
    "class": "术士",
    "subclass": "龙族血脉",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "At 1st level, you choose one type of dragon as your ancestor. The damage type associated with each dragon is used by features you gain later.",
      "You can speak, read, and write Draconic. Additionally, whenever you make a Charisma check when interacting with dragons, your proficiency bonus is doubled if it applies to the check."
    ]
  },
  "龙族先祖：青铜龙（闪电）": {
    "en": "Dragon Ancestor: Bronze - Lightning Damage",
    "class": "术士",
    "subclass": "龙族血脉",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "At 1st level, you choose one type of dragon as your ancestor. The damage type associated with each dragon is used by features you gain later.",
      "You can speak, read, and write Draconic. Additionally, whenever you make a Charisma check when interacting with dragons, your proficiency bonus is doubled if it applies to the check."
    ]
  },
  "龙族先祖：赤铜龙（酸蚀）": {
    "en": "Dragon Ancestor: Copper - Acid Damage",
    "class": "术士",
    "subclass": "龙族血脉",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "At 1st level, you choose one type of dragon as your ancestor. The damage type associated with each dragon is used by features you gain later.",
      "You can speak, read, and write Draconic. Additionally, whenever you make a Charisma check when interacting with dragons, your proficiency bonus is doubled if it applies to the check."
    ]
  },
  "龙族先祖：金龙（火焰）": {
    "en": "Dragon Ancestor: Gold - Fire Damage",
    "class": "术士",
    "subclass": "龙族血脉",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "At 1st level, you choose one type of dragon as your ancestor. The damage type associated with each dragon is used by features you gain later.",
      "You can speak, read, and write Draconic. Additionally, whenever you make a Charisma check when interacting with dragons, your proficiency bonus is doubled if it applies to the check."
    ]
  },
  "龙族先祖：绿龙（毒素）": {
    "en": "Dragon Ancestor: Green - Poison Damage",
    "class": "术士",
    "subclass": "龙族血脉",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "At 1st level, you choose one type of dragon as your ancestor. The damage type associated with each dragon is used by features you gain later.",
      "You can speak, read, and write Draconic. Additionally, whenever you make a Charisma check when interacting with dragons, your proficiency bonus is doubled if it applies to the check."
    ]
  },
  "龙族先祖：红龙（火焰）": {
    "en": "Dragon Ancestor: Red - Fire Damage",
    "class": "术士",
    "subclass": "龙族血脉",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "At 1st level, you choose one type of dragon as your ancestor. The damage type associated with each dragon is used by features you gain later.",
      "You can speak, read, and write Draconic. Additionally, whenever you make a Charisma check when interacting with dragons, your proficiency bonus is doubled if it applies to the check."
    ]
  },
  "龙族先祖：银龙（寒冷）": {
    "en": "Dragon Ancestor: Silver - Cold Damage",
    "class": "术士",
    "subclass": "龙族血脉",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "At 1st level, you choose one type of dragon as your ancestor. The damage type associated with each dragon is used by features you gain later.",
      "You can speak, read, and write Draconic. Additionally, whenever you make a Charisma check when interacting with dragons, your proficiency bonus is doubled if it applies to the check."
    ]
  },
  "龙族先祖：白龙（寒冷）": {
    "en": "Dragon Ancestor: White - Cold Damage",
    "class": "术士",
    "subclass": "龙族血脉",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "At 1st level, you choose one type of dragon as your ancestor. The damage type associated with each dragon is used by features you gain later.",
      "You can speak, read, and write Draconic. Additionally, whenever you make a Charisma check when interacting with dragons, your proficiency bonus is doubled if it applies to the check."
    ]
  },
  "龙翼": {
    "en": "Dragon Wings",
    "class": "术士",
    "subclass": "龙族血脉",
    "level": 14,
    "prereq": [],
    "desc_en": [
      "At 14th level, you gain the ability to sprout a pair of dragon wings from your back, gaining a flying speed equal to your current speed. You can create these wings as a bonus action on your turn. They last until you dismiss them as a bonus action on your turn.",
      "You can't manifest your wings while wearing armor unless the armor is made to accommodate them, and clothing not made to accommodate your wings might be destroyed when you manifest them."
    ]
  },
  "德鲁伊结社": {
    "en": "Druid Circle",
    "class": "德鲁伊",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "At 2nd level, you choose to identify with a circle of druids, such as the Circle of the Land. Your choice grants you features at 2nd level and again at 6th, 10th, and 14th level."
    ]
  },
  "德鲁伊结社特性": {
    "en": "Druid Circle feature",
    "class": "德鲁伊",
    "subclass": "",
    "level": 6,
    "prereq": [],
    "desc_en": [
      "At 2nd level, you choose to identify with a circle of druids, such as the Circle of the Land. Your choice grants you features at 2nd level and again at 6th, 10th, and 14th level."
    ]
  },
  "德鲁伊结社特性（Druid Circle feature）": {
    "en": "Druid Circle feature",
    "class": "德鲁伊",
    "subclass": "",
    "level": 14,
    "prereq": [],
    "desc_en": [
      "At 2nd level, you choose to identify with a circle of druids, such as the Circle of the Land. Your choice grants you features at 2nd level and again at 6th, 10th, and 14th level."
    ]
  },
  "大地行者": {
    "en": "Land's Stride",
    "class": "德鲁伊",
    "subclass": "大地结社",
    "level": 6,
    "prereq": [],
    "desc_en": [
      "Starting at 6th level, moving through nonmagical difficult terrain costs you no extra movement. You can also pass through nonmagical plants without being slowed by them and without taking damage from them if they have thorns, spines, or a similar hazard.",
      "In addition, you have advantage on saving throws against plants that are magically created or manipulated to impede movement, such those created by the entangle spell."
    ]
  },
  "不朽之躯": {
    "en": "Timeless Body",
    "class": "德鲁伊",
    "subclass": "",
    "level": 18,
    "prereq": [],
    "desc_en": [
      "Starting at 18th level, the primal magic that you wield causes you to age more slowly. For every 10 years that pass, your body ages only 1 year."
    ]
  },
  "德鲁伊语": {
    "en": "Druidic",
    "class": "德鲁伊",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "You know Druidic, the secret language of druids. You can speak the language and use it to leave hidden messages. You and others who know this language automatically spot such a message. Others spot the message's presence with a successful DC 15 Wisdom (Perception) check but can't decipher it without magic."
    ]
  },
  "邪术魔典：苦痛魔爆": {
    "en": "Eldritch Invocation: Agonizing Blast",
    "class": "魔契师",
    "subclass": "",
    "level": 2,
    "prereq": [
      ""
    ],
    "desc_en": [
      "When you cast eldritch blast, add your Charisma modifier to the damage it deals on a hit."
    ]
  },
  "邪术魔典：暗影护甲": {
    "en": "Eldritch Invocation: Armor of Shadows",
    "class": "魔契师",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "You can cast mage armor on yourself at will, without expending a spell slot or material components."
    ]
  },
  "邪术魔典：腾空步": {
    "en": "Eldritch Invocation: Ascendant Step",
    "class": "魔契师",
    "subclass": "",
    "level": 9,
    "prereq": [
      ""
    ],
    "desc_en": [
      "You can cast levitate on yourself at will, without expending a spell slot or material components."
    ]
  },
  "邪术魔典：兽语": {
    "en": "Eldritch Invocation: Beast Speech",
    "class": "魔契师",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "You can cast speak with animals at will, without expending a spell slot."
    ]
  },
  "邪术魔典：蛊惑影响": {
    "en": "Eldritch Invocation: Beguiling Influence",
    "class": "魔契师",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "You gain proficiency in the Deception and Persuasion skills."
    ]
  },
  "邪术魔典：迷魂低语": {
    "en": "Eldritch Invocation: Bewitching Whispers",
    "class": "魔契师",
    "subclass": "",
    "level": 7,
    "prereq": [
      ""
    ],
    "desc_en": [
      "You can cast compulsion once using a warlock spell slot. You can't do so again until you finish a long rest."
    ]
  },
  "邪术魔典：远古秘典": {
    "en": "Eldritch Invocation: Book of Ancient Secrets",
    "class": "魔契师",
    "subclass": "",
    "level": 2,
    "prereq": [
      ""
    ],
    "desc_en": [
      "You can now inscribe magical rituals in your Book of Shadows. Choose two 1st-level spells that have the ritual tag from any class's spell list (the two needn't be from the same list). The spells appear in the book and don't count against the number of spells you know. With your Book of Shadows in hand, you can cast the chosen spells as rituals. You can't cast the spells except as rituals, unless you've learned them by some other means. You can also cast a warlock spell you know as a ritual if it has the ritual tag.",
      "On your adventures, you can add other ritual spells to your Book of Shadows. When you find such a spell, you can add it to the book if the spell's level is equal to or less than half your warlock level (rounded up) and if you can spare the time to transcribe the spell. For each level of the spell, the transcription process takes 2 hours and costs 50 gp for the rare inks needed to inscribe it."
    ]
  },
  "邪术魔典：卡瑟利之链": {
    "en": "Eldritch Invocation: Chains of Carceri",
    "class": "魔契师",
    "subclass": "",
    "level": 15,
    "prereq": [
      "",
      ""
    ],
    "desc_en": [
      "You can cast hold monster at will--targeting a celestial, fiend, or elemental--without expending a spell slot or material components. You must finish a long rest before you can use this invocation on the same creature again."
    ]
  },
  "邪术魔典：魔视": {
    "en": "Eldritch Invocation: Devil's Sight",
    "class": "魔契师",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "You can see normally in darkness, both magical and nonmagical, to a distance of 120 feet."
    ]
  },
  "邪术魔典：可怖真言": {
    "en": "Eldritch Invocation: Dreadful Word",
    "class": "魔契师",
    "subclass": "",
    "level": 7,
    "prereq": [
      ""
    ],
    "desc_en": [
      "You can cast confusion once using a warlock spell slot. You can't do so again until you finish a long rest."
    ]
  },
  "邪术魔典：邪魔之眼": {
    "en": "Eldritch Invocation: Eldritch Sight",
    "class": "魔契师",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "You can cast detect magic at will, without expending a spell slot."
    ]
  },
  "邪术魔典：邪魔长矛": {
    "en": "Eldritch Invocation: Eldritch Spear",
    "class": "魔契师",
    "subclass": "",
    "level": 2,
    "prereq": [
      ""
    ],
    "desc_en": [
      "When you cast eldritch blast, its range is 300 feet."
    ]
  },
  "邪术魔典：符文通晓之眼": {
    "en": "Eldritch Invocation: Eyes of the Rune Keeper",
    "class": "魔契师",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "You can read all writing."
    ]
  },
  "邪术魔典：邪魔活力": {
    "en": "Eldritch Invocation: Fiendish Vigor",
    "class": "魔契师",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "You can cast false life on yourself at will as a 1st-level spell, without expending a spell slot or material components."
    ]
  },
  "邪术魔典：双心凝视": {
    "en": "Eldritch Invocation: Gaze of Two Minds",
    "class": "魔契师",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "You can use your action to touch a willing humanoid and perceive through its senses until the end of your next turn. As long as the creature is on the same plane of existence as you, you can use your action on subsequent turns to maintain this connection, extending the duration until the end of your next turn. While perceiving through the other creature's senses, you benefit from any special senses possessed by that creature, and you are blinded and deafened to your own surroundings."
    ]
  },
  "邪术魔典：饮命者": {
    "en": "Eldritch Invocation: Lifedrinker",
    "class": "魔契师",
    "subclass": "",
    "level": 12,
    "prereq": [
      "",
      ""
    ],
    "desc_en": [
      "When you hit a creature with your pact weapon, the creature takes extra necrotic damage equal to your Charisma modifier (minimum 1)."
    ]
  },
  "邪术魔典：千面之具": {
    "en": "Eldritch Invocation: Mask of Many Faces",
    "class": "魔契师",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "You can cast disguise self at will, without expending a spell slot."
    ]
  },
  "邪术魔典：万形之主": {
    "en": "Eldritch Invocation: Master of Myriad Forms",
    "class": "魔契师",
    "subclass": "",
    "level": 15,
    "prereq": [
      ""
    ],
    "desc_en": [
      "You can cast alter self at will, without expending a spell slot."
    ]
  },
  "邪术魔典：混沌仆从": {
    "en": "Eldritch Invocation: Minions of Chaos",
    "class": "魔契师",
    "subclass": "",
    "level": 9,
    "prereq": [
      ""
    ],
    "desc_en": [
      "You can cast conjure elemental once using a warlock spell slot. You can't do so again until you finish a long rest."
    ]
  },
  "邪术魔典：心智泥沼": {
    "en": "Eldritch Invocation: Mire the Mind",
    "class": "魔契师",
    "subclass": "",
    "level": 5,
    "prereq": [
      ""
    ],
    "desc_en": [
      "You can cast slow once using a warlock spell slot. You can't do so again until you finish a long rest."
    ]
  },
  "邪术魔典：迷雾幻象": {
    "en": "Eldritch Invocation: Misty Visions",
    "class": "魔契师",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "You can cast silent image at will, without expending a spell slot or material components."
    ]
  },
  "邪术魔典：融于暗影": {
    "en": "Eldritch Invocation: One with Shadows",
    "class": "魔契师",
    "subclass": "",
    "level": 5,
    "prereq": [
      ""
    ],
    "desc_en": [
      "When you are in an area of dim light or darkness, you can use your action to become invisible until you move or take an action or a reaction."
    ]
  },
  "邪术魔典：异界之跃": {
    "en": "Eldritch Invocation: Otherworldly Leap",
    "class": "魔契师",
    "subclass": "",
    "level": 9,
    "prereq": [
      ""
    ],
    "desc_en": [
      "You can cast jump on yourself at will, without expending a spell slot or material components."
    ]
  },
  "邪术魔典：斥力魔爆": {
    "en": "Eldritch Invocation: Repelling Blast",
    "class": "魔契师",
    "subclass": "",
    "level": 2,
    "prereq": [
      ""
    ],
    "desc_en": [
      "When you hit a creature with eldritch blast, you can push the creature up to 10 feet away from you in a straight line."
    ]
  },
  "邪术魔典：血肉塑形者": {
    "en": "Eldritch Invocation: Sculptor of Flesh",
    "class": "魔契师",
    "subclass": "",
    "level": 7,
    "prereq": [
      ""
    ],
    "desc_en": [
      "You can cast polymorph once using a warlock spell slot. You can't do so again until you finish a long rest."
    ]
  },
  "邪术魔典：凶兆之印": {
    "en": "Eldritch Invocation: Sign of Ill Omen",
    "class": "魔契师",
    "subclass": "",
    "level": 5,
    "prereq": [
      ""
    ],
    "desc_en": [
      "You can cast bestow curse once using a warlock spell slot. You can't do so again until you finish a long rest."
    ]
  },
  "邪术魔典：五命窃者": {
    "en": "Eldritch Invocation: Thief of Five Fates",
    "class": "魔契师",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "You can cast bane once using a warlock spell slot. You can't do so again until you finish a long rest."
    ]
  },
  "邪术魔典：饥渴之刃": {
    "en": "Eldritch Invocation: Thirsting Blade",
    "class": "魔契师",
    "subclass": "",
    "level": 5,
    "prereq": [
      "",
      ""
    ],
    "desc_en": [
      "You can attack with your pact weapon twice, instead of once, whenever you take the Attack action on your turn."
    ]
  },
  "邪术魔典：远域之视": {
    "en": "Eldritch Invocation: Visions of Distant Realms",
    "class": "魔契师",
    "subclass": "",
    "level": 15,
    "prereq": [
      ""
    ],
    "desc_en": [
      "You can cast arcane eye at will, without expending a spell slot."
    ]
  },
  "邪术魔典：链主之音": {
    "en": "Eldritch Invocation: Voice of the Chain Master",
    "class": "魔契师",
    "subclass": "",
    "level": 2,
    "prereq": [
      ""
    ],
    "desc_en": [
      "You can communicate telepathically with your familiar and perceive through your familiar's senses as long as you are on the same plane of existence.",
      "Additionally, while perceiving through your familiar's senses, you can also speak through your familiar in your own voice, even if your familiar is normally incapable of speech."
    ]
  },
  "邪术魔典：墓穴低语": {
    "en": "Eldritch Invocation: Whispers of the Grave",
    "class": "魔契师",
    "subclass": "",
    "level": 9,
    "prereq": [
      ""
    ],
    "desc_en": [
      "You can cast speak with dead at will, without expending a spell slot."
    ]
  },
  "邪术魔典：巫视": {
    "en": "Eldritch Invocation: Witch Sight",
    "class": "魔契师",
    "subclass": "",
    "level": 15,
    "prereq": [
      ""
    ],
    "desc_en": [
      "You can see the true form of any shapechanger or creature concealed by illusion or transmutation magic while the creature is within 30 feet of you and within line of sight."
    ]
  },
  "邪术魔典": {
    "en": "Eldritch Invocations",
    "class": "魔契师",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "In your study of occult lore, you have unearthed eldritch invocations, fragments of forbidden knowledge that imbue you with an abiding magical ability.",
      "At 2nd level, you gain two eldritch invocations of your choice. Your invocation options are detailed at the end of the class description. When you gain certain warlock levels, you gain additional invocations of your choice, as shown in the Invocations Known column of the Warlock table.",
      "Additionally, when you gain a level in this class, you can choose one of the invocations you know and replace it with another invocation that you could learn at that level."
    ]
  },
  "邪术大师": {
    "en": "Eldritch Master",
    "class": "魔契师",
    "subclass": "",
    "level": 20,
    "prereq": [],
    "desc_en": [
      "At 20th level, you can draw on your inner reserve of mystical power while entreating your patron to regain expended spell slots. You can spend 1 minute entreating your patron for aid to regain all your expended spell slots from your Pact Magic feature.",
      "Once you regain spell slots with this feature, you must finish a long rest before you can do so again."
    ]
  },
  "元素亲和": {
    "en": "Elemental Affinity",
    "class": "术士",
    "subclass": "龙族血脉",
    "level": 6,
    "prereq": [],
    "desc_en": [
      "Starting at 6th level, when you cast a spell that deals damage of the type associated with your draconic ancestry, you can add your Charisma modifier to one damage roll of that spell. At the same time, you can spend 1 sorcery point to gain resistance to that damage type for 1 hour."
    ]
  },
  "难以捉摸": {
    "en": "Elusive",
    "class": "游荡者",
    "subclass": "",
    "level": 18,
    "prereq": [],
    "desc_en": [
      "Beginning at 18th level, you are so evasive that attackers rarely gain the upper hand against you. No attack roll has advantage against you while you aren't incapacitated."
    ]
  },
  "强化塑能": {
    "en": "Empowered Evocation",
    "class": "法师",
    "subclass": "塑能学派",
    "level": 10,
    "prereq": [],
    "desc_en": [
      "Beginning at 10th level, you can add your Intelligence modifier to one damage roll of any wizard evocation spell you cast."
    ]
  },
  "空灵之体": {
    "en": "Empty Body",
    "class": "武僧",
    "subclass": "",
    "level": 18,
    "prereq": [],
    "desc_en": [
      "Beginning at 18th level, you can use your action to spend 4 ki points to become invisible for 1 minute. During that time, you also have resistance to all damage but force damage.",
      "Additionally, you can spend 8 ki points to cast the astral projection spell, without needing material components. When you do so, you can't take any other creatures with you."
    ]
  },
  "塑能精通": {
    "en": "Evocation Savant",
    "class": "法师",
    "subclass": "塑能学派",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "Beginning when you select this school at 2nd level, the gold and time you must spend to copy an evocation spell into your spellbook is halved."
    ]
  },
  "额外攻击（Extra Attack）": {
    "en": "Extra Attack",
    "class": "游侠",
    "subclass": "",
    "level": 5,
    "prereq": [],
    "desc_en": [
      "Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn."
    ]
  },
  "额外攻击（2）": {
    "en": "Extra Attack (2)",
    "class": "战士",
    "subclass": "",
    "level": 11,
    "prereq": [],
    "desc_en": [
      "Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn. The number of attacks increases to three when you reach 11th level in this class and to four when you reach 20th level in this class."
    ]
  },
  "额外攻击（3）": {
    "en": "Extra Attack (3)",
    "class": "战士",
    "subclass": "",
    "level": 20,
    "prereq": [],
    "desc_en": [
      "Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn. The number of attacks increases to three when you reach 11th level in this class and to four when you reach 20th level in this class."
    ]
  },
  "妙手空空": {
    "en": "Fast Hands",
    "class": "游荡者",
    "subclass": "盗贼",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "Starting at 3rd level, you can use the bonus action granted by your Cunning Action to make a Dexterity (Sleight of Hand) check, use your thieves' tools to disarm a trap or open a lock, or take the Use an Object action."
    ]
  },
  "疾行": {
    "en": "Fast Movement",
    "class": "野蛮人",
    "subclass": "",
    "level": 5,
    "prereq": [],
    "desc_en": [
      "Starting at 5th level, your speed increases by 10 feet while you aren't wearing heavy armor."
    ]
  },
  "宿敌（1 type）": {
    "en": "Favored Enemy (1 type)",
    "class": "游侠",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "Beginning at 1st level, you have significant experience studying, tracking, hunting, and even talking to a certain type of enemy.",
      "Choose a type of favored enemy: aberrations, beasts, celestials, constructs, dragons, elementals, fey, fiends, giants, monstrosities, oozes, plants, or undead. Alternatively, you can select two races of humanoid (such as gnolls and orcs) as favored enemies.",
      "You have advantage on Wisdom (Survival) checks to track your favored enemies, as well as on Intelligence checks to recall information about them.",
      "When you gain this feature, you also learn one language of your choice that is spoken by your favored enemies, if they speak one at all.",
      "You choose one additional favored enemy, as well as an associated language, at 6th and 14th level. As you gain levels, your choices should reflect the types of monsters you have encountered on your adventures."
    ]
  },
  "宿敌（2 types）": {
    "en": "Favored Enemy (2 types)",
    "class": "游侠",
    "subclass": "",
    "level": 6,
    "prereq": [],
    "desc_en": [
      "Beginning at 1st level, you have significant experience studying, tracking, hunting, and even talking to a certain type of enemy.",
      "Choose a type of favored enemy: aberrations, beasts, celestials, constructs, dragons, elementals, fey, fiends, giants, monstrosities, oozes, plants, or undead. Alternatively, you can select two races of humanoid (such as gnolls and orcs) as favored enemies.",
      "You have advantage on Wisdom (Survival) checks to track your favored enemies, as well as on Intelligence checks to recall information about them.",
      "When you gain this feature, you also learn one language of your choice that is spoken by your favored enemies, if they speak one at all.",
      "You choose one additional favored enemy, as well as an associated language, at 6th and 14th level. As you gain levels, your choices should reflect the types of monsters you have encountered on your adventures."
    ]
  },
  "宿敌（3 enemies）": {
    "en": "Favored Enemy (3 enemies)",
    "class": "游侠",
    "subclass": "",
    "level": 14,
    "prereq": [],
    "desc_en": [
      "Beginning at 1st level, you have significant experience studying, tracking, hunting, and even talking to a certain type of enemy.",
      "Choose a type of favored enemy: aberrations, beasts, celestials, constructs, dragons, elementals, fey, fiends, giants, monstrosities, oozes, plants, or undead. Alternatively, you can select two races of humanoid (such as gnolls and orcs) as favored enemies.",
      "You have advantage on Wisdom (Survival) checks to track your favored enemies, as well as on Intelligence checks to recall information about them.",
      "When you gain this feature, you also learn one language of your choice that is spoken by your favored enemies, if they speak one at all.",
      "You choose one additional favored enemy, as well as an associated language, at 6th and 14th level. As you gain levels, your choices should reflect the types of monsters you have encountered on your adventures."
    ]
  },
  "野性直觉": {
    "en": "Feral Instinct",
    "class": "野蛮人",
    "subclass": "",
    "level": 7,
    "prereq": [],
    "desc_en": [
      "By 7th level, your instincts are so honed that you have advantage on initiative rolls.",
      "Additionally, if you are surprised at the beginning of combat and aren't incapacitated, you can act normally on your first turn, but only if you enter your rage before doing anything else on that turn."
    ]
  },
  "野性感官": {
    "en": "Feral Senses",
    "class": "游侠",
    "subclass": "",
    "level": 18,
    "prereq": [],
    "desc_en": [
      "At 18th level, you gain preternatural senses that help you fight creatures you can't see. When you attack a creature you can't see, your inability to see it doesn't impose disadvantage on your attack rolls against it.",
      "You are also aware of the location of any invisible creature within 30 feet of you, provided that the creature isn't hidden from you and you aren't blinded or deafened."
    ]
  },
  "邪魔韧性": {
    "en": "Fiendish Resilience",
    "class": "魔契师",
    "subclass": "邪魔宗主",
    "level": 10,
    "prereq": [],
    "desc_en": [
      "Starting at 10th level, you can choose one damage type when you finish a short or long rest. You gain resistance to that damage type until you choose a different one with this feature. Damage from magical weapons or silver weapons ignores this resistance."
    ]
  },
  "战斗风格": {
    "en": "Fighting Style",
    "class": "战士",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "You adopt a particular style of fighting as your specialty. Choose one of the following options. You can't take a Fighting Style option more than once, even if you later get to choose again."
    ]
  },
  "战斗风格：箭术": {
    "en": "Fighting Style: Archery",
    "class": "战士",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "You gain a +2 bonus to attack rolls you make with ranged weapons."
    ]
  },
  "战斗风格：防御": {
    "en": "Fighting Style: Defense",
    "class": "战士",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "While you are wearing armor, you gain a +1 bonus to AC."
    ]
  },
  "战斗风格：决斗": {
    "en": "Fighting Style: Dueling",
    "class": "战士",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon."
    ]
  },
  "战斗风格：巨武战斗": {
    "en": "Fighting Style: Great Weapon Fighting",
    "class": "战士",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll, even if the new roll is a 1 or a 2. The weapon must have the two-handed or versatile property for you to gain this benefit."
    ]
  },
  "战斗风格：守护": {
    "en": "Fighting Style: Protection",
    "class": "战士",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield."
    ]
  },
  "战斗风格：双武器战斗": {
    "en": "Fighting Style: Two-Weapon Fighting",
    "class": "战士",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack."
    ]
  },
  "战斗风格：防御（Fighting Style: Defense）": {
    "en": "Fighting Style: Defense",
    "class": "游侠",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "While you are wearing armor, you gain a +1 bonus to AC."
    ]
  },
  "战斗风格：决斗（Fighting Style: Dueling）": {
    "en": "Fighting Style: Dueling",
    "class": "游侠",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon."
    ]
  },
  "战斗风格：巨武战斗（Fighting Style: Great Weapon Fighting）": {
    "en": "Fighting Style: Great Weapon Fighting",
    "class": "圣武士",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll. The weapon must have the two-handed or versatile property for you to gain this benefit."
    ]
  },
  "战斗风格：守护（Fighting Style: Protection）": {
    "en": "Fighting Style: Protection",
    "class": "圣武士",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield."
    ]
  },
  "灵活施法：转化法术位": {
    "en": "Flexible Casting: Converting Spell Slot",
    "class": "术士",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "As a bonus action on your turn, you can expend one spell slot and gain a number of sorcery points equal to the slot's level.."
    ]
  },
  "灵活施法：创造法术位": {
    "en": "Flexible Casting: Creating Spell Slots",
    "class": "术士",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "You can transform unexpended sorcery points into one spell slot as a bonus action on your turn. The Creating Spell Slots table shows the cost of creating a spell slot of a given level. You can create spell slots no higher in level than 5th. ",
      "Any spell slot you create with this feature vanishes when you finish a long rest."
    ]
  },
  "疾风连击": {
    "en": "Flurry of Blows",
    "class": "武僧",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "Immediately after you take the Attack action on your turn, you can spend 1 ki point to make two unarmed strikes as a bonus action."
    ]
  },
  "克敌者": {
    "en": "Foe Slayer",
    "class": "游侠",
    "subclass": "",
    "level": 20,
    "prereq": [],
    "desc_en": [
      "At 20th level, you become an unparalleled hunter of your enemies. Once on each of your turns, you can add your Wisdom modifier to the attack roll or the damage roll of an attack you make against one of your favored enemies. You can choose to use this feature before or after the roll, but before any effects of the roll are applied."
    ]
  },
  "激励之泉": {
    "en": "Font of Inspiration",
    "class": "吟游诗人",
    "subclass": "",
    "level": 5,
    "prereq": [],
    "desc_en": [
      "Beginning when you reach 5th level, you regain all of your expended uses of Bardic Inspiration when you finish a short or long rest."
    ]
  },
  "魔力之泉": {
    "en": "Font of Magic",
    "class": "术士",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "At 2nd level, you tap into a deep wellspring of magic within yourself. This wellspring is represented by sorcery points, which allow you to create a variety of magical effects.",
      "Sorcery Points",
      "You have 2 sorcery points, and you gain more as you reach higher levels, as shown in the Sorcery Points column of the Sorcerer table. You can never have more sorcery points than shown on the table for your level. You regain all spent sorcery points when you finish a long rest."
    ]
  },
  "狂乱": {
    "en": "Frenzy",
    "class": "野蛮人",
    "subclass": "狂战士道途",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "Starting when you choose this path at 3rd level, you can go into a frenzy when you rage. If you do so, for the duration of your rage you can make a single melee weapon attack as a bonus action on each of your turns after this one. When your rage ends, you suffer one level of exhaustion (as described in appendix A)."
    ]
  },
  "光天化日隐匿": {
    "en": "Hide in Plain Sight",
    "class": "游侠",
    "subclass": "",
    "level": 10,
    "prereq": [],
    "desc_en": [
      "Starting at 10th level, you can spend 1 minute creating camouflage for yourself. You must have access to fresh mud, dirt, plants, soot, and other naturally occurring materials with which to create your camouflage.",
      "Once you are camouflaged in this way, you can try to hide by pressing yourself up against a solid surface, such as a tree or wall, that is at least as tall and wide as you are. You gain a +10 bonus to Dexterity (Stealth) checks as long as you remain there without moving or taking actions. Once you move or take an action or a reaction, you must camouflage yourself again to gain this benefit."
    ]
  },
  "圣光华轮": {
    "en": "Holy Nimbus",
    "class": "圣武士",
    "subclass": "奉献之誓",
    "level": 20,
    "prereq": [],
    "desc_en": [
      "At 20th level, as an action, you can emanate an aura of sunlight. For 1 minute, bright light shines from you in a 30-foot radius, and dim light shines 30 feet beyond that.",
      "Whenever an enemy creature starts its turn in the bright light, the creature takes 10 radiant damage.",
      "In addition, for the duration, you have advantage on saving throws against spells cast by fiends or undead."
    ]
  },
  "猎手的猎物": {
    "en": "Hunter's Prey",
    "class": "游侠",
    "subclass": "猎人",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "At 3rd level, you gain one of the following features of your choice.",
      "Colossus Slayer",
      "Giant Killer",
      "Horde Breaker"
    ]
  },
  "猎手的猎物：巨物杀手": {
    "en": "Hunter's Prey: Colossus Slayer",
    "class": "游侠",
    "subclass": "猎人",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "Your tenacity can wear down the most potent foes. When you hit a creature with a weapon attack, the creature takes an extra 1d8 damage if it's below its hit point maximum. You can deal this extra damage only once per turn."
    ]
  },
  "猎手的猎物：巨人猎手": {
    "en": "Hunter's Prey: Giant Killer",
    "class": "游侠",
    "subclass": "猎人",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "When a Large or larger creature within 5 feet of you hits or misses you with an attack, you can use your reaction to attack that creature immediately after its attack, provided that you can see the creature."
    ]
  },
  "猎手的猎物：破群者": {
    "en": "Hunter's Prey: Horde Breaker",
    "class": "游侠",
    "subclass": "猎人",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "Once on each of your turns when you make a weapon attack, you can make another attack with the same weapon against a different creature that is within 5 feet of the original target and within range of your weapon."
    ]
  },
  "投入地狱": {
    "en": "Hurl Through Hell",
    "class": "魔契师",
    "subclass": "邪魔宗主",
    "level": 14,
    "prereq": [],
    "desc_en": [
      "Starting at 14th level, when you hit a creature with an attack, you can use this feature to instantly transport the target through the lower planes. The creature disappears and hurtles through a nightmare landscape.",
      "At the end of your next turn, the target returns to the space it previously occupied, or the nearest unoccupied space. If the target is not a fiend, it takes 10d10 psychic damage as it reels from its horrific experience.",
      "Once you use this feature, you can't use it again until you finish a long rest."
    ]
  },
  "精通重击": {
    "en": "Improved Critical",
    "class": "战士",
    "subclass": "勇士",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "Beginning when you choose this archetype at 3rd level, your weapon attacks score a critical hit on a roll of 19 or 20."
    ]
  },
  "强化神威斩击": {
    "en": "Improved Divine Smite",
    "class": "圣武士",
    "subclass": "",
    "level": 11,
    "prereq": [],
    "desc_en": [
      "By 11th level, you are so suffused with righteous might that all your melee weapon strikes carry divine power with them. Whenever you hit a creature with a melee weapon, the creature takes an extra 1d8 radiant damage. If you also use your Divine Smite with an attack, you add this damage to the extra damage of your Divine Smite."
    ]
  },
  "不屈（1次）": {
    "en": "Indomitable (1 use)",
    "class": "战士",
    "subclass": "",
    "level": 9,
    "prereq": [],
    "desc_en": [
      "Beginning at 9th level, you can reroll a saving throw that you fail. If you do so, you must use the new roll, and you can't use this feature again until you finish a long rest. You can use this feature twice between long rests starting at 13th level and three times between long rests starting at 17th level."
    ]
  },
  "不屈（2次）": {
    "en": "Indomitable (2 uses)",
    "class": "战士",
    "subclass": "",
    "level": 13,
    "prereq": [],
    "desc_en": [
      "Beginning at 9th level, you can reroll a saving throw that you fail. If you do so, you must use the new roll, and you can't use this feature again until you finish a long rest. You can use this feature twice between long rests starting at 13th level and three times between long rests starting at 17th level."
    ]
  },
  "不屈（3次）": {
    "en": "Indomitable (3 uses)",
    "class": "战士",
    "subclass": "",
    "level": 17,
    "prereq": [],
    "desc_en": [
      "Beginning at 9th level, you can reroll a saving throw that you fail. If you do so, you must use the new roll, and you can't use this feature again until you finish a long rest. You can use this feature twice between long rests starting at 13th level and three times between long rests starting at 17th level."
    ]
  },
  "不屈之力": {
    "en": "Indomitable Might",
    "class": "野蛮人",
    "subclass": "",
    "level": 18,
    "prereq": [],
    "desc_en": [
      "Beginning at 18th level, if your total for a Strength check is less than your Strength score, you can use that score in place of the total."
    ]
  },
  "慑人威仪": {
    "en": "Intimidating Presence",
    "class": "野蛮人",
    "subclass": "狂战士道途",
    "level": 10,
    "prereq": [],
    "desc_en": [
      "Beginning at 10th level, you can use your action to frighten someone with your menacing presence. When you do so, choose one creature that you can see within 30 feet of you. If the creature can see or hear you, it must succeed on a Wisdom saving throw (DC equal to 8 + your proficiency bonus + your Charisma modifier) or be frightened of you until the end of your next turn. On subsequent turns, you can use your action to extend the duration of this effect on the frightened creature until the end of your next turn. This effect ends if the creature ends its turn out of line of sight or more than 60 feet away from you.",
      " If the creature succeeds on its saving throw, you can't use this feature on that creature again for 24 hours."
    ]
  },
  "万事通": {
    "en": "Jack of All Trades",
    "class": "吟游诗人",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "Starting at 2nd level, you can add half your proficiency bonus, rounded down, to any ability check you make that doesn't already include your proficiency bonus."
    ]
  },
  "气": {
    "en": "Ki",
    "class": "武僧",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "Starting at 2nd level, your training allows you to harness the mystic energy of ki. Your access to this energy is represented by a number of ki points. Your monk level determines the number of points you have, as shown in the Ki Points column of Table: The Monk.",
      "You can spend these points to fuel various ki features. You start knowing three such features: Flurry of Blows, Patient Defense, and Step of the Wind. You learn more ki features as you gain levels in this class.",
      "When you spend a ki point, it is unavailable until you finish a short or long rest, at the end of which you draw all of your expended ki back into yourself. You must spend at least 30 minutes of the rest meditating to regain your ki points.",
      "Some of your ki features require your target to make a saving throw to resist the feature's effects. The saving throw DC is calculated as follows:",
      "Ki save DC = 8 + your proficiency bonus + your Wisdom modifier"
    ]
  },
  "气之强化打击": {
    "en": "Ki Empowered Strikes",
    "class": "武僧",
    "subclass": "",
    "level": 6,
    "prereq": [],
    "desc_en": [
      "Starting at 6th level, your unarmed strikes count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage."
    ]
  },
  "抚慰之手": {
    "en": "Lay on Hands",
    "class": "圣武士",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you take a long rest. With that pool, you can restore a total number of hit points equal to your paladin level x 5.",
      "As an action, you can touch a creature and draw power from the pool to restore a number of hit points to that creature, up to the maximum amount remaining in your pool.",
      "Alternatively, you can expend 5 hit points from your pool of healing to cure the target of one disease or neutralize one poison affecting it. You can cure multiple diseases and neutralize multiple poisons with a single use of Lay on Hands, expending hit points separately for each one.",
      "This feature has no effect on undead and constructs."
    ]
  },
  "秘学知识": {
    "en": "Magical Secrets",
    "class": "吟游诗人",
    "subclass": "",
    "level": 10,
    "prereq": [],
    "desc_en": [
      "By 10th level, you have plundered magical knowledge from a wide spectrum of disciplines. Choose two spells from any class, including this one. A spell you choose must be of a level you can cast, as shown on the Bard table, or a cantrip. ",
      "The chosen spells count as bard spells for you and are included in the number in the Spells Known column of the Bard table. ",
      "You learn two additional spells from any class at 14th level and again at 18th level."
    ]
  },
  "秘学知识（Magical Secrets）": {
    "en": "Magical Secrets",
    "class": "吟游诗人",
    "subclass": "",
    "level": 18,
    "prereq": [],
    "desc_en": [
      "By 10th level, you have plundered magical knowledge from a wide spectrum of disciplines. Choose two spells from any class, including this one. A spell you choose must be of a level you can cast, as shown on the Bard table, or a cantrip. ",
      "The chosen spells count as bard spells for you and are included in the number in the Spells Known column of the Bard table. ",
      "You learn two additional spells from any class at 14th level and again at 18th level."
    ]
  },
  "武术范型": {
    "en": "Martial Archetype",
    "class": "战士",
    "subclass": "",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "At 3rd level, you choose an archetype that you strive to emulate in your combat styles and techniques, such as Champion. The archetype you choose grants you features at 3rd level and again at 7th, 10th, 15th, and 18th level."
    ]
  },
  "武术范型特性": {
    "en": "Martial Archetype feature",
    "class": "战士",
    "subclass": "",
    "level": 7,
    "prereq": [],
    "desc_en": [
      "At 3rd level, you choose an archetype that you strive to emulate in your combat styles and techniques, such as Champion. The archetype you choose grants you features at 3rd level and again at 7th, 10th, 15th, and 18th level."
    ]
  },
  "武术范型特性（Martial Archetype feature）": {
    "en": "Martial Archetype feature",
    "class": "战士",
    "subclass": "",
    "level": 18,
    "prereq": [],
    "desc_en": [
      "At 3rd level, you choose an archetype that you strive to emulate in your combat styles and techniques, such as Champion. The archetype you choose grants you features at 3rd level and again at 7th, 10th, 15th, and 18th level."
    ]
  },
  "武艺": {
    "en": "Martial Arts",
    "class": "武僧",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "At 1st level, your practice of martial arts gives you mastery of combat styles that use unarmed strikes and monk weapons, which are shortswords and any simple melee weapons that don't have the two- handed or heavy property.",
      "You gain the following benefits while you are unarmed or wielding only monk weapons and you aren't wearing armor or wielding a shield:",
      "- You can use Dexterity instead of Strength for the attack and damage rolls of your unarmed strikes and monk weapons.",
      "- You can roll a d4 in place of the normal damage of your unarmed strike or monk weapon. This die changes as you gain monk levels, as shown in the Martial Arts column of Table: The Monk.",
      "- When you use the Attack action with an unarmed strike or a monk weapon on your turn, you can make one unarmed strike as a bonus action. For example, if you take the Attack action and attack with a quarterstaff, you can also make an unarmed strike as a bonus action, assuming you haven't already taken a bonus action this turn.",
      "Certain monasteries use specialized forms of the monk weapons. For example, you might use a club that is two lengths of wood connected by a short chain (called a nunchaku) or a sickle with a shorter, straighter blade (called a kama). Whatever name you use for a monk weapon, you can use the game statistics provided for the weapon."
    ]
  },
  "超魔法": {
    "en": "Metamagic",
    "class": "术士",
    "subclass": "",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "At 3rd level, you gain the ability to twist your spells to suit your needs. You gain two of the following Metamagic options of your choice. You gain another one at 10th and 17th level.",
      "You can use only one Metamagic option on a spell when you cast it, unless otherwise noted."
    ]
  },
  "超魔法（Metamagic）": {
    "en": "Metamagic",
    "class": "术士",
    "subclass": "",
    "level": 17,
    "prereq": [],
    "desc_en": [
      "At 3rd level, you gain the ability to twist your spells to suit your needs. You gain two of the following Metamagic options of your choice. You gain another one at 10th and 17th level.",
      "You can use only one Metamagic option on a spell when you cast it, unless otherwise noted."
    ]
  },
  "超魔法：谨慎法术": {
    "en": "Metamagic: Careful Spell",
    "class": "术士",
    "subclass": "",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "When you cast a spell that forces other creatures to make a saving throw, you can protect some of those creatures from the spell's full force. To do so, you spend 1 sorcery point and choose a number of those creatures up to your Charisma modifier (minimum of one creature). A chosen creature automatically succeeds on its saving throw against the spell."
    ]
  },
  "超魔法：远程法术": {
    "en": "Metamagic: Distant Spell",
    "class": "术士",
    "subclass": "",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "When you cast a spell that has a range of 5 feet or greater, you can spend 1 sorcery point to double the range of the spell.",
      "When you cast a spell that has a range of touch, you can spend 1 sorcery point to make the range of the spell 30 feet."
    ]
  },
  "超魔法：强化法术": {
    "en": "Metamagic: Empowered Spell",
    "class": "术士",
    "subclass": "",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "When you roll damage for a spell, you can spend 1 sorcery point to reroll a number of the damage dice up to your Charisma modifier (minimum of one). You must use the new rolls.",
      "You can use Empowered Spell even if you have already used a different Metamagic option during the casting of the spell."
    ]
  },
  "超魔法：延时法术": {
    "en": "Metamagic: Extended Spell",
    "class": "术士",
    "subclass": "",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "When you cast a spell that has a duration of 1 minute or longer, you can spend 1 sorcery point to double its duration, to a maximum duration of 24 hours."
    ]
  },
  "超魔法：高阶法术": {
    "en": "Metamagic: Heightened Spell",
    "class": "术士",
    "subclass": "",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "When you cast a spell that forces a creature to make a saving throw to resist its effects, you can spend 3 sorcery points to give one target of the spell disadvantage on its first saving throw made against the spell."
    ]
  },
  "超魔法：瞬发法术": {
    "en": "Metamagic: Quickened Spell",
    "class": "术士",
    "subclass": "",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "When you cast a spell that has a casting time of 1 action, you can spend 2 sorcery points to change the casting time to 1 bonus action for this casting."
    ]
  },
  "超魔法：微妙法术": {
    "en": "Metamagic: Subtle Spell",
    "class": "术士",
    "subclass": "",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "When you cast a spell, you can spend 1 sorcery point to cast it without any somatic or verbal components."
    ]
  },
  "超魔法：双生法术": {
    "en": "Metamagic: Twinned Spell",
    "class": "术士",
    "subclass": "",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "When you cast a spell that targets only one creature and doesn't have a range of self, you can spend a number of sorcery points equal to the spell's level to target a second creature in range with the same spell (1 sorcery point if the spell is a cantrip).",
      "To be eligible, a spell must be incapable of targeting more than one creature at the spell's current level. For example, magic missile and scorching ray aren't eligible, but ray of frost is."
    ]
  },
  "无念狂暴": {
    "en": "Mindless Rage",
    "class": "野蛮人",
    "subclass": "狂战士道途",
    "level": 6,
    "prereq": [],
    "desc_en": [
      "Beginning at 6th level, you can't be charmed or frightened while raging. If you are charmed or frightened when you enter your rage, the effect is suspended for the duration of the rage."
    ]
  },
  "修道传承": {
    "en": "Monastic Tradition",
    "class": "武僧",
    "subclass": "",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "When you reach 3rd level, you commit yourself to a monastic tradition, such as the Way of the Open Hand. Your tradition grants you features at 3rd level and again at 6th, 11th, and 17th level."
    ]
  },
  "修道传承特性": {
    "en": "Monastic Tradition feature",
    "class": "武僧",
    "subclass": "",
    "level": 6,
    "prereq": [],
    "desc_en": [
      "When you reach 3rd level, you commit yourself to a monastic tradition, such as the Way of the Open Hand. Your tradition grants you features at 3rd level and again at 6th, 11th, and 17th level."
    ]
  },
  "修道传承特性（Monastic Tradition feature）": {
    "en": "Monastic Tradition feature",
    "class": "武僧",
    "subclass": "",
    "level": 17,
    "prereq": [],
    "desc_en": [
      "When you reach 3rd level, you commit yourself to a monastic tradition, such as the Way of the Open Hand. Your tradition grants you features at 3rd level and again at 6th, 11th, and 17th level."
    ]
  },
  "回避": {
    "en": "Evasion",
    "class": "武僧",
    "subclass": "",
    "level": 7,
    "prereq": [],
    "desc_en": [
      "At 7th level, your instinctive agility lets you dodge out of the way of certain area effects, such as a blue dragon's lightning breath or a fireball spell. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail."
    ]
  },
  "不朽之躯（Timeless Body）": {
    "en": "Timeless Body",
    "class": "武僧",
    "subclass": "",
    "level": 15,
    "prereq": [],
    "desc_en": [
      "At 15th level, your ki sustains you so that you suffer none of the frailty of old age, and you can't be aged magically. You can still die of old age, however. In addition, you no longer need food or water."
    ]
  },
  "无甲防御（Unarmored Defense）": {
    "en": "Unarmored Defense",
    "class": "武僧",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "Beginning at 1st level, while you are wearing no armor and not wielding a shield, your AC equals 10 + your Dexterity modifier + your Wisdom modifier."
    ]
  },
  "多重攻击": {
    "en": "Multiattack",
    "class": "游侠",
    "subclass": "猎人",
    "level": 11,
    "prereq": [],
    "desc_en": [
      "At 11th level, you gain one of the following features of your choice.",
      "Volley",
      "Whirlwind Attack"
    ]
  },
  "多重攻击：箭雨": {
    "en": "Multiattack: Volley",
    "class": "游侠",
    "subclass": "猎人",
    "level": 11,
    "prereq": [],
    "desc_en": [
      "You can use your action to make a ranged attack against any number of creatures within 10 feet of a point you can see within your weapon's range. You must have ammunition for each target, as normal, and you make a separate attack roll for each target."
    ]
  },
  "多重攻击：旋风攻击": {
    "en": "Multiattack: Whirlwind Attack",
    "class": "游侠",
    "subclass": "猎人",
    "level": 11,
    "prereq": [],
    "desc_en": [
      "You can use your action to make a melee attack against any number of creatures within 5 feet of you, with a separate attack roll for each target."
    ]
  },
  "玄奥秘术（6th level）": {
    "en": "Mystic Arcanum (6th level)",
    "class": "魔契师",
    "subclass": "",
    "level": 11,
    "prereq": [],
    "desc_en": [
      "At 11th level, your patron bestows upon you a magical secret called an arcanum. Choose one 6th- level spell from the warlock spell list as this arcanum.",
      "You can cast your arcanum spell once without expending a spell slot. You must finish a long rest before you can do so again.",
      "At higher levels, you gain more warlock spells of your choice that can be cast in this way: one 7th- level spell at 13th level, one 8th-level spell at 15th level, and one 9th-level spell at 17th level. You regain all uses of your Mystic Arcanum when you finish a long rest."
    ]
  },
  "玄奥秘术（7th level）": {
    "en": "Mystic Arcanum (7th level)",
    "class": "魔契师",
    "subclass": "",
    "level": 13,
    "prereq": [],
    "desc_en": [
      "At 11th level, your patron bestows upon you a magical secret called an arcanum. Choose one 6th- level spell from the warlock spell list as this arcanum.",
      "You can cast your arcanum spell once without expending a spell slot. You must finish a long rest before you can do so again.",
      "At higher levels, you gain more warlock spells of your choice that can be cast in this way: one 7th- level spell at 13th level, one 8th-level spell at 15th level, and one 9th-level spell at 17th level. You regain all uses of your Mystic Arcanum when you finish a long rest."
    ]
  },
  "玄奥秘术（8th level）": {
    "en": "Mystic Arcanum (8th level)",
    "class": "魔契师",
    "subclass": "",
    "level": 15,
    "prereq": [],
    "desc_en": [
      "At 11th level, your patron bestows upon you a magical secret called an arcanum. Choose one 6th- level spell from the warlock spell list as this arcanum.",
      "You can cast your arcanum spell once without expending a spell slot. You must finish a long rest before you can do so again.",
      "At higher levels, you gain more warlock spells of your choice that can be cast in this way: one 7th- level spell at 13th level, one 8th-level spell at 15th level, and one 9th-level spell at 17th level. You regain all uses of your Mystic Arcanum when you finish a long rest."
    ]
  },
  "玄奥秘术（9th level）": {
    "en": "Mystic Arcanum (9th level)",
    "class": "魔契师",
    "subclass": "",
    "level": 17,
    "prereq": [],
    "desc_en": [
      "At 11th level, your patron bestows upon you a magical secret called an arcanum. Choose one 6th- level spell from the warlock spell list as this arcanum.",
      "You can cast your arcanum spell once without expending a spell slot. You must finish a long rest before you can do so again.",
      "At higher levels, you gain more warlock spells of your choice that can be cast in this way: one 7th- level spell at 13th level, one 8th-level spell at 15th level, and one 9th-level spell at 17th level. You regain all uses of your Mystic Arcanum when you finish a long rest."
    ]
  },
  "自然探索者（1 terrain type）": {
    "en": "Natural Explorer (1 terrain type)",
    "class": "游侠",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "You are particularly familiar with one type of natural environment and are adept at traveling and surviving in such regions. Choose one type of favored terrain: arctic, coast, desert, forest, grassland, mountain, or swamp. When you make an Intelligence or Wisdom check related to your favored terrain, your proficiency bonus is doubled if you are using a skill that you're proficient in.",
      "While traveling for an hour or more in your favored terrain, you gain the following benefits:",
      "- Difficult terrain doesn't slow your group's travel.",
      "- Your group can't become lost except by magical means.",
      "- Even when you are engaged in another activity while traveling (such as foraging, navigating, or tracking), you remain alert to danger.",
      "- If you are traveling alone, you can move stealthily at a normal pace.",
      "- When you forage, you find twice as much food as you normally would.",
      "- While tracking other creatures, you also learn their exact number, their sizes, and how long ago they passed through the area.",
      "You choose additional favored terrain types at 6th and 10th level."
    ]
  },
  "自然探索者（2 terrain types）": {
    "en": "Natural Explorer (2 terrain types)",
    "class": "游侠",
    "subclass": "",
    "level": 6,
    "prereq": [],
    "desc_en": [
      "You are particularly familiar with one type of natural environment and are adept at traveling and surviving in such regions. Choose one type of favored terrain: arctic, coast, desert, forest, grassland, mountain, or swamp. When you make an Intelligence or Wisdom check related to your favored terrain, your proficiency bonus is doubled if you are using a skill that you're proficient in.",
      "While traveling for an hour or more in your favored terrain, you gain the following benefits:",
      "- Difficult terrain doesn't slow your group's travel.",
      "- Your group can't become lost except by magical means.",
      "- Even when you are engaged in another activity while traveling (such as foraging, navigating, or tracking), you remain alert to danger.",
      "- If you are traveling alone, you can move stealthily at a normal pace.",
      "- When you forage, you find twice as much food as you normally would.",
      "- While tracking other creatures, you also learn their exact number, their sizes, and how long ago they passed through the area.",
      "You choose additional favored terrain types at 6th and 10th level."
    ]
  },
  "自然探索者（3 terrain types）": {
    "en": "Natural Explorer (3 terrain types)",
    "class": "游侠",
    "subclass": "",
    "level": 10,
    "prereq": [],
    "desc_en": [
      "You are particularly familiar with one type of natural environment and are adept at traveling and surviving in such regions. Choose one type of favored terrain: arctic, coast, desert, forest, grassland, mountain, or swamp. When you make an Intelligence or Wisdom check related to your favored terrain, your proficiency bonus is doubled if you are using a skill that you're proficient in.",
      "While traveling for an hour or more in your favored terrain, you gain the following benefits:",
      "- Difficult terrain doesn't slow your group's travel.",
      "- Your group can't become lost except by magical means.",
      "- Even when you are engaged in another activity while traveling (such as foraging, navigating, or tracking), you remain alert to danger.",
      "- If you are traveling alone, you can move stealthily at a normal pace.",
      "- When you forage, you find twice as much food as you normally would.",
      "- While tracking other creatures, you also learn their exact number, their sizes, and how long ago they passed through the area.",
      "You choose additional favored terrain types at 6th and 10th level."
    ]
  },
  "自然回复": {
    "en": "Natural Recovery",
    "class": "德鲁伊",
    "subclass": "大地结社",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "Starting at 2nd level, you can regain some of your magical energy by sitting in meditation and communing with nature. During a short rest, you choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than half your druid level (rounded up), and none of the slots can be 6th level or higher. You can't use this feature again until you finish a long rest.",
      "For example, when you are a 4th-level druid, you can recover up to two levels worth of spell slots. You can recover either a 2nd-level slot or two 1st-level slots."
    ]
  },
  "自然庇护": {
    "en": "Nature's Sanctuary",
    "class": "德鲁伊",
    "subclass": "大地结社",
    "level": 14,
    "prereq": [],
    "desc_en": [
      "When you reach 14th level, creatures of the natural world sense your connection to nature and become hesitant to attack you. When a beast or plant creature attacks you, that creature must make a Wisdom saving throw against your druid spell save DC. On a failed save, the creature must choose a different target, or the attack automatically misses. On a successful save, the creature is immune to this effect for 24 hours. The creature is aware of this effect before it makes its attack against you."
    ]
  },
  "自然守护": {
    "en": "Nature's Ward",
    "class": "德鲁伊",
    "subclass": "大地结社",
    "level": 10,
    "prereq": [],
    "desc_en": [
      "When you reach 10th level, you can't be charmed or frightened by elementals or fey, and you are immune to poison and disease."
    ]
  },
  "誓约法术": {
    "en": "Oath Spells",
    "class": "圣武士",
    "subclass": "",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "Each oath has a list of associated spells. You gain access to these spells at the levels specified in the oath description. Once you gain access to an oath spell, you always have it prepared. Oath spells don't count against the number of spells you can prepare each day.",
      "If you gain an oath spell that doesn't appear on the paladin spell list, the spell is nonetheless a paladin spell for you."
    ]
  },
  "散打技法": {
    "en": "Open Hand Technique",
    "class": "武僧",
    "subclass": "散打宗",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "Starting when you choose this tradition at 3rd level, you can manipulate your enemy's ki when you harness your own. Whenever you hit a creature with one of the attacks granted by your Flurry of Blows, you can impose one of the following effects on that target:",
      "- It must succeed on a Dexterity saving throw or be knocked prone.",
      "- It must make a Strength saving throw. If it fails, you can push it up to 15 feet away from you.",
      "- It can't take reactions until the end of your next turn."
    ]
  },
  "异界宗主": {
    "en": "Otherworldly Patron",
    "class": "魔契师",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "At 1st level, you have struck a bargain with an otherworldly being of your choice, such as the Fiend. Your choice grants you features at 1st level and again at 6th, 10th, and 14th level."
    ]
  },
  "异界宗主特性": {
    "en": "Otherworldly Patron feature",
    "class": "魔契师",
    "subclass": "",
    "level": 6,
    "prereq": [],
    "desc_en": [
      "At 1st level, you have struck a bargain with an otherworldly being of your choice, such as the Fiend. Your choice grants you features at 1st level and again at 6th, 10th, and 14th level."
    ]
  },
  "异界宗主特性（Otherworldly Patron feature）": {
    "en": "Otherworldly Patron feature",
    "class": "魔契师",
    "subclass": "",
    "level": 14,
    "prereq": [],
    "desc_en": [
      "At 1st level, you have struck a bargain with an otherworldly being of your choice, such as the Fiend. Your choice grants you features at 1st level and again at 6th, 10th, and 14th level."
    ]
  },
  "过载引导": {
    "en": "Overchannel",
    "class": "法师",
    "subclass": "塑能学派",
    "level": 14,
    "prereq": [],
    "desc_en": [
      "Starting at 14th level, you can increase the power of your simpler spells. When you cast a wizard spell of 1st through 5th level that deals damage, you can deal maximum damage with that spell.",
      "The first time you do so, you suffer no adverse effect. If you use this feature again before you finish a long rest, you take 2d12 necrotic damage for each level of the spell, immediately after you cast it. Each time you use this feature again before finishing a long rest, the necrotic damage per spell level increases by 1d12. This damage ignores resistance and immunity."
    ]
  },
  "契约恩赐": {
    "en": "Pact Boon",
    "class": "魔契师",
    "subclass": "",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "At 3rd level, your otherworldly patron bestows a gift upon you for your loyal service. You gain one of the following features of your choice."
    ]
  },
  "契约魔法": {
    "en": "Pact Magic",
    "class": "魔契师",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "Your arcane research and the magic bestowed on you by your patron have given you facility with spells."
    ]
  },
  "刃之契约": {
    "en": "Pact of the Blade",
    "class": "魔契师",
    "subclass": "",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "You can use your action to create a pact weapon in your empty hand. You can choose the form that this melee weapon takes each time you create it. You are proficient with it while you wield it. This weapon counts as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.",
      "Your pact weapon disappears if it is more than 5 feet away from you for 1 minute or more. It also disappears if you use this feature again, if you dismiss the weapon (no action required), or if you die.",
      "You can transform one magic weapon into your pact weapon by performing a special ritual while you hold the weapon. You perform the ritual over the course of 1 hour, which can be done during a short rest. You can then dismiss the weapon, shunting it into an extradimensional space, and it appears whenever you create your pact weapon thereafter. You can't affect an artifact or a sentient weapon in this way. The weapon ceases being your pact weapon if you die, if you perform the 1-hour ritual on a different weapon, or if you use a 1-hour ritual to break your bond to it. The weapon appears at your feet if it is in the extradimensional space when the bond breaks.",
      "If you serve the Fiend, your weapon could be an axe made of black metal and adorned with decorative flames."
    ]
  },
  "链之契约": {
    "en": "Pact of the Chain",
    "class": "魔契师",
    "subclass": "",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "You learn the find familiar spell and can cast it as a ritual. The spell doesn't count against your number of spells known.",
      "When you cast the spell, you can choose one of the normal forms for your familiar or one of the following special forms: imp, pseudodragon, quasit, or sprite.",
      "Additionally, when you take the Attack action, you can forgo one of your own attacks to allow your familiar to make one attack of its own with its reaction.",
      "Your familiar is more cunning than a typical familiar. Its default form can be a reflection of your patron, with imps and quasits tied to the Fiend."
    ]
  },
  "书之契约": {
    "en": "Pact of the Tome",
    "class": "魔契师",
    "subclass": "",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "Your patron gives you a grimoire called a Book of Shadows. When you gain this feature, choose three cantrips from any class's spell list (the three needn't be from the same list). While the book is on your person, you can cast those cantrips at will. They don't count against your number of cantrips known. If they don't appear on the warlock spell list, they are nonetheless warlock spells for you.",
      "If you lose your Book of Shadows, you can perform a 1-hour ceremony to receive a replacement from your patron. This ceremony can be performed during a short or long rest, and it destroys the previous book. The book turns to ash when you die.",
      "Your Book of Shadows could be a weighty tome bound in demon hide studded with iron, holding spells of conjuration and a wealth of forbidden lore about the sinister regions of the cosmos, a gift of the Fiend."
    ]
  },
  "战斗风格（Fighting Style）": {
    "en": "Fighting Style",
    "class": "游侠",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "At 2nd level, you adopt a particular style of fighting as your specialty. Choose one of the following options. You can't take a Fighting Style option more than once, even if you later get to choose again."
    ]
  },
  "守势待机": {
    "en": "Patient Defense",
    "class": "武僧",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "You can spend 1 ki point to take the Dodge action as a bonus action on your turn."
    ]
  },
  "无双技艺": {
    "en": "Peerless Skill",
    "class": "吟游诗人",
    "subclass": "逸闻学院",
    "level": 14,
    "prereq": [],
    "desc_en": [
      "Starting at 14th level, when you make an ability check, you can expend one use of Bardic Inspiration. Roll a Bardic Inspiration die and add the number rolled to your ability check. You can choose to do so after you roll the die for the ability check, but before the GM tells you whether you succeed or fail."
    ]
  },
  "完美自我": {
    "en": "Perfect Self",
    "class": "武僧",
    "subclass": "",
    "level": 20,
    "prereq": [],
    "desc_en": [
      "At 20th level, when you roll for initiative and have no ki points remaining, you regain 4 ki points."
    ]
  },
  "持续狂暴": {
    "en": "Persistent Rage",
    "class": "野蛮人",
    "subclass": "",
    "level": 15,
    "prereq": [],
    "desc_en": [
      "Beginning at 15th level, your rage is so fierce that it ends early only if you fall unconscious or if you choose to end it."
    ]
  },
  "强化戏法": {
    "en": "Potent Cantrip",
    "class": "法师",
    "subclass": "塑能学派",
    "level": 6,
    "prereq": [],
    "desc_en": [
      "Starting at 6th level, your damaging cantrips affect even creatures that avoid the brunt of the effect. When a creature succeeds on a saving throw against your cantrip, the creature takes half the cantrip's damage (if any) but suffers no additional effect from the cantrip."
    ]
  },
  "原初勇士": {
    "en": "Primal Champion",
    "class": "野蛮人",
    "subclass": "",
    "level": 20,
    "prereq": [],
    "desc_en": [
      "At 20th level, you embody the power of the wilds. Your Strength and Constitution scores increase by 4. Your maximum for those scores is now 24."
    ]
  },
  "原初道途": {
    "en": "Primal Path",
    "class": "野蛮人",
    "subclass": "",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "At 3rd level, you choose a path that shapes the nature of your rage. Choose the Path of the Berserker or the Path of the Totem Warrior, both detailed at the end of the class description. Your choice grants you features at 3rd level and again at 6th, 10th, and 14th levels."
    ]
  },
  "道途特性": {
    "en": "Path feature",
    "class": "野蛮人",
    "subclass": "",
    "level": 6,
    "prereq": [],
    "desc_en": [
      "At 3rd level, you choose a path that shapes the nature of your rage. Choose the Path of the Berserker or the Path of the Totem Warrior, both detailed at the end of the class description. Your choice grants you features at 3rd level and again at 6th, 10th, and 14th levels."
    ]
  },
  "道途特性（Path feature）": {
    "en": "Path feature",
    "class": "野蛮人",
    "subclass": "",
    "level": 14,
    "prereq": [],
    "desc_en": [
      "At 3rd level, you choose a path that shapes the nature of your rage. Choose the Path of the Berserker or the Path of the Totem Warrior, both detailed at the end of the class description. Your choice grants you features at 3rd level and again at 6th, 10th, and 14th levels."
    ]
  },
  "远古感知": {
    "en": "Primeval Awareness",
    "class": "游侠",
    "subclass": "",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "Beginning at 3rd level, you can use your action and expend one ranger spell slot to focus your awareness on the region around you. For 1 minute per level of the spell slot you expend, you can sense whether the following types of creatures are present within 1 mile of you (or within up to 6 miles if you are in your favored terrain): aberrations, celestials, dragons, elementals, fey, fiends, and undead. This feature doesn't reveal the creatures' location or number."
    ]
  },
  "纯净之躯": {
    "en": "Purity of Body",
    "class": "武僧",
    "subclass": "",
    "level": 10,
    "prereq": [],
    "desc_en": [
      "At 10th level, your mastery of the ki flowing through you makes you immune to disease and poison."
    ]
  },
  "纯净之魂": {
    "en": "Purity of Spirit",
    "class": "圣武士",
    "subclass": "奉献之誓",
    "level": 15,
    "prereq": [],
    "desc_en": [
      "Beginning at 15th level, you are always under the effects of a protection from evil and good spell."
    ]
  },
  "震颤掌": {
    "en": "Quivering Palm",
    "class": "武僧",
    "subclass": "散打宗",
    "level": 17,
    "prereq": [],
    "desc_en": [
      "At 17th level, you gain the ability to set up lethal vibrations in someone's body. When you hit a creature with an unarmed strike, you can spend 3 ki points to start these imperceptible vibrations, which last for a number of days equal to your monk level. The vibrations are harmless unless you use your action to end them. To do so, you and the target must be on the same plane of existence. When you use this action, the creature must make a Constitution saving throw. If it fails, it is reduced to 0 hit points. If it succeeds, it takes 10d10 necrotic damage.",
      "You can have only one creature under the effect of this feature at a time. You can choose to end the vibrations harmlessly without using an action."
    ]
  },
  "狂暴": {
    "en": "Rage",
    "class": "野蛮人",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "In battle, you fight with primal ferocity. On your turn, you can enter a rage as a bonus action. While raging, you gain the following benefits if you aren't wearing heavy armor:",
      "- You have advantage on Strength checks and Strength saving throws.",
      "- When you make a melee weapon Attack using Strength, you gain a +2 bonus to the damage roll. This bonus increases as you level.",
      "- You have Resistance to bludgeoning, piercing, and slashing damage.",
      "If you are able to cast Spells, you can't cast them or concentrate on them while raging.",
      "Your rage lasts for 1 minute. It ends early if you are knocked Unconscious or if Your Turn ends and you haven't attacked a hostile creature since your last turn or taken damage since then. You can also end your rage on Your Turn as a Bonus Action.",
      "Once you have raged the maximum number of times for your barbarian level, you must finish a Long Rest before you can rage again. You may rage 2 times at 1st level, 3 at 3rd, 4 at 6th, 5 at 12th, and 6 at 17th."
    ]
  },
  "游侠范型": {
    "en": "Ranger Archetype",
    "class": "游侠",
    "subclass": "",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "At 3rd level, you choose an archetype that you strive to emulate, such as the Hunter. Your choice grants you features at 3rd level and again at 7th, 11th, and 15th level."
    ]
  },
  "游侠范型特性": {
    "en": "Ranger Archetype feature",
    "class": "游侠",
    "subclass": "",
    "level": 7,
    "prereq": [],
    "desc_en": [
      "At 3rd level, you choose an archetype that you strive to emulate, such as the Hunter. Your choice grants you features at 3rd level and again at 7th, 11th, and 15th level."
    ]
  },
  "游侠范型特性（Ranger Archetype feature）": {
    "en": "Ranger Archetype feature",
    "class": "游侠",
    "subclass": "",
    "level": 15,
    "prereq": [],
    "desc_en": [
      "At 3rd level, you choose an archetype that you strive to emulate, such as the Hunter. Your choice grants you features at 3rd level and again at 7th, 11th, and 15th level."
    ]
  },
  "战斗风格：箭术（Fighting Style: Archery）": {
    "en": "Fighting Style: Archery",
    "class": "游侠",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "You gain a +2 bonus to attack rolls you make with ranged weapons."
    ]
  },
  "战斗风格：双武器战斗（Fighting Style: Two-Weapon Fighting）": {
    "en": "Fighting Style: Two-Weapon Fighting",
    "class": "游侠",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack."
    ]
  },
  "大地行者（Land's Stride）": {
    "en": "Land's Stride",
    "class": "游侠",
    "subclass": "",
    "level": 8,
    "prereq": [],
    "desc_en": [
      "Starting at 8th level, moving through nonmagical difficult terrain costs you no extra movement. You can also pass through nonmagical plants without being slowed by them and without taking damage from them if they have thorns, spines, or a similar hazard.",
      "In addition, you have advantage on saving throws against plants that are magically created or manipulated to impede movement, such those created by the entangle spell."
    ]
  },
  "鲁莽攻击": {
    "en": "Reckless Attack",
    "class": "野蛮人",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "Starting at 2nd level, you can throw aside all concern for defense to attack with fierce desperation. When you make your first attack on your turn, you can decide to attack recklessly. Doing so gives you advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn."
    ]
  },
  "不懈狂暴": {
    "en": "Relentless Rage",
    "class": "野蛮人",
    "subclass": "",
    "level": 11,
    "prereq": [],
    "desc_en": [
      "Starting at 11th level, your rage can keep you fighting despite grievous wounds. If you drop to 0 hit points while you're raging and don't die outright, you can make a DC 10 Constitution saving throw. If you succeed, you drop to 1 hit point instead.",
      "Each time you use this feature after the first, the DC increases by 5. When you finish a short or long rest, the DC resets to 10."
    ]
  },
  "可靠天赋": {
    "en": "Reliable Talent",
    "class": "游荡者",
    "subclass": "",
    "level": 11,
    "prereq": [],
    "desc_en": [
      "By 11th level, you have refined your chosen skills until they approach perfection. Whenever you make an ability check that lets you add your proficiency bonus, you can treat a d20 roll of 9 or lower as a 10."
    ]
  },
  "卓绝运动家": {
    "en": "Remarkable Athlete",
    "class": "战士",
    "subclass": "勇士",
    "level": 7,
    "prereq": [],
    "desc_en": [
      "Starting at 7th level, you can add half your proficiency bonus (round up) to any Strength, Dexterity, or Constitution check you make that doesn't already use your proficiency bonus. In addition, when you make a running long jump, the distance you can cover increases by a number of feet equal to your Strength modifier."
    ]
  },
  "反击": {
    "en": "Retaliation",
    "class": "野蛮人",
    "subclass": "狂战士道途",
    "level": 14,
    "prereq": [],
    "desc_en": [
      "Starting at 14th level, when you take damage from a creature that is within 5 feet of you, you can use your reaction to make a melee weapon Attack against that creature."
    ]
  },
  "回避（Evasion）": {
    "en": "Evasion",
    "class": "游荡者",
    "subclass": "",
    "level": 7,
    "prereq": [],
    "desc_en": [
      "Beginning at 7th level, you can nimbly dodge out of the way of certain area effects, such as a red dragon's fiery breath or an ice storm spell. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail."
    ]
  },
  "游荡者范型": {
    "en": "Roguish Archetype",
    "class": "游荡者",
    "subclass": "",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "At 3rd level, you choose an archetype that you emulate in the exercise of your rogue abilities, such as Thief. Additional archetypes are available in the original source material. Your archetype choice grants you features at 3rd level and then again at 9th, 13th, and 17th level."
    ]
  },
  "游荡者范型特性": {
    "en": "Roguish Archetype feature",
    "class": "游荡者",
    "subclass": "",
    "level": 9,
    "prereq": [],
    "desc_en": [
      "At 3rd level, you choose an archetype that you emulate in the exercise of your rogue abilities, such as Thief. Additional archetypes are available in the original source material. Your archetype choice grants you features at 3rd level and then again at 9th, 13th, and 17th level."
    ]
  },
  "游荡者范型特性（Roguish Archetype feature）": {
    "en": "Roguish Archetype feature",
    "class": "游荡者",
    "subclass": "",
    "level": 17,
    "prereq": [],
    "desc_en": [
      "At 3rd level, you choose an archetype that you emulate in the exercise of your rogue abilities, such as Thief. Additional archetypes are available in the original source material. Your archetype choice grants you features at 3rd level and then again at 9th, 13th, and 17th level."
    ]
  },
  "神圣誓言": {
    "en": "Sacred Oath",
    "class": "圣武士",
    "subclass": "",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "When you reach 3rd level, you swear the oath that binds you as a paladin forever. Up to this time you have been in a preparatory stage, committed to the path but not yet sworn to it. Now you choose an oath, such as the Oath of Devotion.",
      "Your choice grants you features at 3rd level and again at 7th, 15th, and 20th level. Those features include oath spells and the Channel Divinity feature."
    ]
  },
  "神圣誓言特性": {
    "en": "Sacred Oath feature",
    "class": "圣武士",
    "subclass": "",
    "level": 7,
    "prereq": [],
    "desc_en": [
      "When you reach 3rd level, you swear the oath that binds you as a paladin forever. Up to this time you have been in a preparatory stage, committed to the path but not yet sworn to it. Now you choose an oath, such as the Oath of Devotion.",
      "Your choice grants you features at 3rd level and again at 7th, 15th, and 20th level. Those features include oath spells and the Channel Divinity feature."
    ]
  },
  "神圣誓言特性（Sacred Oath feature）": {
    "en": "Sacred Oath feature",
    "class": "圣武士",
    "subclass": "",
    "level": 20,
    "prereq": [],
    "desc_en": [
      "When you reach 3rd level, you swear the oath that binds you as a paladin forever. Up to this time you have been in a preparatory stage, committed to the path but not yet sworn to it. Now you choose an oath, such as the Oath of Devotion.",
      "Your choice grants you features at 3rd level and again at 7th, 15th, and 20th level. Those features include oath spells and the Channel Divinity feature."
    ]
  },
  "法术塑形": {
    "en": "Sculpt Spells",
    "class": "法师",
    "subclass": "塑能学派",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "Beginning at 2nd level, you can create pockets of relative safety within the effects of your evocation spells. When you cast an evocation spell that affects other creatures that you can see, you can choose a number of them equal to 1 + the spell's level. The chosen creatures automatically succeed on their saving throws against the spell, and they take no damage if they would normally take half damage on a successful save."
    ]
  },
  "飞檐走壁": {
    "en": "Second-Story Work",
    "class": "游荡者",
    "subclass": "盗贼",
    "level": 3,
    "prereq": [],
    "desc_en": [
      "When you choose this archetype at 3rd level, you gain the ability to climb faster than normal; climbing no longer costs you extra movement.",
      "In addition, when you make a running jump, the distance you cover increases by a number of feet equal to your Dexterity modifier."
    ]
  },
  "再起之风": {
    "en": "Second Wind",
    "class": "战士",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level. Once you use this feature, you must finish a short or long rest before you can use it again."
    ]
  },
  "招牌法术": {
    "en": "Signature Spell",
    "class": "法师",
    "subclass": "",
    "level": 20,
    "prereq": [],
    "desc_en": [
      "When you reach 20th level, you gain mastery over two powerful spells and can cast them with little effort. Choose two 3rd-level wizard spells in your spellbook as your signature spells. You always have these spells prepared, they don't count against the number of spells you have prepared, and you can cast each of them once at 3rd level without expending a spell slot. When you do so, you can't do so again until you finish a short or long rest.",
      "If you want to cast either spell at a higher level, you must expend a spell slot as normal."
    ]
  },
  "滑溜心智": {
    "en": "Slippery Mind",
    "class": "游荡者",
    "subclass": "",
    "level": 15,
    "prereq": [],
    "desc_en": [
      "By 15th level, you have acquired greater mental strength. You gain proficiency in Wisdom saving throws."
    ]
  },
  "缓降": {
    "en": "Slow Fall",
    "class": "武僧",
    "subclass": "",
    "level": 4,
    "prereq": [],
    "desc_en": [
      "Beginning at 4th level, you can use your reaction when you fall to reduce any falling damage you take by an amount equal to five times your monk level."
    ]
  },
  "偷袭": {
    "en": "Sneak Attack",
    "class": "游荡者",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "Beginning at 1st level, you know how to strike subtly and exploit a foe's distraction. Once per turn, you can deal an extra 1d6 damage to one creature you hit with an attack if you have advantage on the attack roll. The attack must use a finesse or a ranged weapon.",
      "You don't need advantage on the attack roll if another enemy of the target is within 5 feet of it, that enemy isn't incapacitated, and you don't have disadvantage on the attack roll.",
      "The amount of the extra damage increases as you gain levels in this class, as shown in the Sneak Attack column of the Rogue table."
    ]
  },
  "休憩之歌（d10）": {
    "en": "Song of Rest (d10)",
    "class": "吟游诗人",
    "subclass": "",
    "level": 13,
    "prereq": [],
    "desc_en": [
      "Beginning at 2nd level, you can use soothing music or oration to help revitalize your wounded allies during a short rest. If you or any friendly creatures who can hear your performance regain hit points at the end of the short rest by spending one or more Hit Dice, each of those creatures regains an extra 1d6 hit points. ",
      "The extra hit points increase when you reach certain levels in this class: to 1d8 at 9th level, to 1d10 at 13th level, and to 1d12 at 17th level."
    ]
  },
  "休憩之歌（d12）": {
    "en": "Song of Rest (d12)",
    "class": "吟游诗人",
    "subclass": "",
    "level": 17,
    "prereq": [],
    "desc_en": [
      "Beginning at 2nd level, you can use soothing music or oration to help revitalize your wounded allies during a short rest. If you or any friendly creatures who can hear your performance regain hit points at the end of the short rest by spending one or more Hit Dice, each of those creatures regains an extra 1d6 hit points. ",
      "The extra hit points increase when you reach certain levels in this class: to 1d8 at 9th level, to 1d10 at 13th level, and to 1d12 at 17th level."
    ]
  },
  "休憩之歌（d6）": {
    "en": "Song of Rest (d6)",
    "class": "吟游诗人",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "Beginning at 2nd level, you can use soothing music or oration to help revitalize your wounded allies during a short rest. If you or any friendly creatures who can hear your performance regain hit points at the end of the short rest by spending one or more Hit Dice, each of those creatures regains an extra 1d6 hit points. ",
      "The extra hit points increase when you reach certain levels in this class: to 1d8 at 9th level, to 1d10 at 13th level, and to 1d12 at 17th level."
    ]
  },
  "休憩之歌（d8）": {
    "en": "Song of Rest (d8)",
    "class": "吟游诗人",
    "subclass": "",
    "level": 9,
    "prereq": [],
    "desc_en": [
      "Beginning at 2nd level, you can use soothing music or oration to help revitalize your wounded allies during a short rest. If you or any friendly creatures who can hear your performance regain hit points at the end of the short rest by spending one or more Hit Dice, each of those creatures regains an extra 1d6 hit points. ",
      "The extra hit points increase when you reach certain levels in this class: to 1d8 at 9th level, to 1d10 at 13th level, and to 1d12 at 17th level."
    ]
  },
  "术法根源": {
    "en": "Sorcerous Origin",
    "class": "术士",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "Choose a sorcerous origin, which describes the source of your innate magical power, such as Draconic Bloodline.",
      "Your choice grants you features when you choose it at 1st level and again at 6th, 14th, and 18th level."
    ]
  },
  "术法根源特性": {
    "en": "Sorcerous Origin feature",
    "class": "术士",
    "subclass": "",
    "level": 6,
    "prereq": [],
    "desc_en": [
      "Choose a sorcerous origin, which describes the source of your innate magical power, such as Draconic Bloodline.",
      "Your choice grants you features when you choose it at 1st level and again at 6th, 14th, and 18th level."
    ]
  },
  "术法根源特性（Sorcerous Origin feature）": {
    "en": "Sorcerous Origin feature",
    "class": "术士",
    "subclass": "",
    "level": 18,
    "prereq": [],
    "desc_en": [
      "Choose a sorcerous origin, which describes the source of your innate magical power, such as Draconic Bloodline.",
      "Your choice grants you features when you choose it at 1st level and again at 6th, 14th, and 18th level."
    ]
  },
  "术法回复": {
    "en": "Sorcerous Restoration",
    "class": "术士",
    "subclass": "",
    "level": 20,
    "prereq": [],
    "desc_en": [
      "At 20th level, you regain 4 expended sorcery points whenever you finish a short rest."
    ]
  },
  "法术精通": {
    "en": "Spell Mastery",
    "class": "法师",
    "subclass": "",
    "level": 18,
    "prereq": [],
    "desc_en": [
      "At 18th level, you have achieved such mastery over certain spells that you can cast them at will. Choose a 1st-level wizard spell and a 2nd-level wizard spell that are in your spellbook. You can cast those spells at their lowest level without expending a spell slot when you have them prepared. If you want to cast either spell at a higher level, you must expend a spell slot as normal.",
      "By spending 8 hours in study, you can exchange one or both of the spells you chose for different spells of the same levels."
    ]
  },
  "施法：吟游诗人": {
    "en": "Spellcasting: Bard",
    "class": "吟游诗人",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "You have learned to untangle and reshape the fabric of reality in harmony with your wishes and music. Your spells are part of your vast repertoire, magic that you can tune to different situations."
    ]
  },
  "施法：牧师": {
    "en": "Spellcasting: Cleric",
    "class": "牧师",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "As a conduit for divine power, you can cast cleric spells."
    ]
  },
  "施法：德鲁伊": {
    "en": "Spellcasting: Druid",
    "class": "德鲁伊",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "Drawing on the divine essence of nature itself, you can cast spells to shape that essence to your will."
    ]
  },
  "施法：圣武士": {
    "en": "Spellcasting: Paladin",
    "class": "圣武士",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "By 2nd level, you have learned to draw on divine magic through meditation and prayer to cast spells as a cleric does."
    ]
  },
  "施法：游侠": {
    "en": "Spellcasting: Ranger",
    "class": "游侠",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "By the time you reach 2nd level, you have learned to use the magical essence of nature to cast spells, much as a druid does."
    ]
  },
  "施法：术士": {
    "en": "Spellcasting: Sorcerer",
    "class": "术士",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "An event in your past, or in the life of a parent or ancestor, left an indelible mark on you, infusing you with arcane magic. This font of magic, whatever its origin, fuels your spells."
    ]
  },
  "施法：法师": {
    "en": "Spellcasting: Wizard",
    "class": "法师",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "As a student of arcane magic, you have a spellbook containing spells that show the first glimmerings of your true power."
    ]
  },
  "踏风步": {
    "en": "Step of the Wind",
    "class": "武僧",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "You can spend 1 ki point to take the Disengage or Dash action as a bonus action on your turn, and your jump distance is doubled for the turn."
    ]
  },
  "心如止水": {
    "en": "Stillness of Mind",
    "class": "武僧",
    "subclass": "",
    "level": 7,
    "prereq": [],
    "desc_en": [
      "Starting at 7th level, you can use your action to end one effect on yourself that is causing you to be charmed or frightened."
    ]
  },
  "幸运一击": {
    "en": "Stroke of Luck",
    "class": "游荡者",
    "subclass": "",
    "level": 20,
    "prereq": [],
    "desc_en": [
      "At 20th level, you have an uncanny knack for succeeding when you need to. If your attack misses a target within range, you can turn the miss into a hit. Alternatively, if you fail an ability check, you can treat the d20 roll as a 20.",
      "Once you use this feature, you can't use it again until you finish a short or long rest."
    ]
  },
  "震慑拳": {
    "en": "Stunning Strike",
    "class": "武僧",
    "subclass": "",
    "level": 5,
    "prereq": [],
    "desc_en": [
      "Starting at 5th level, you can interfere with the flow of ki in an opponent's body. When you hit another creature with a melee weapon attack, you can spend 1 ki point to attempt a stunning strike. The target must succeed on a Constitution saving throw or be stunned until the end of your next turn."
    ]
  },
  "卓越重击": {
    "en": "Superior Critical",
    "class": "战士",
    "subclass": "勇士",
    "level": 15,
    "prereq": [],
    "desc_en": [
      "Starting at 15th level, your weapon attacks score a critical hit on a roll of 18-20."
    ]
  },
  "高级猎手防御": {
    "en": "Superior Hunter's Defense",
    "class": "游侠",
    "subclass": "猎人",
    "level": 15,
    "prereq": [],
    "desc_en": [
      "At 15th level, you gain one of the following features of your choice.",
      "Evasion",
      "Stand Against the Tide",
      "Uncanny Dodge"
    ]
  },
  "高级猎手防御：回避": {
    "en": "Superior Hunter's Defense: Evasion",
    "class": "游侠",
    "subclass": "猎人",
    "level": 15,
    "prereq": [],
    "desc_en": [
      "When you are subjected to an effect, such as a red dragon's fiery breath or a lightning bolt spell, that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail."
    ]
  },
  "高级猎手防御：力抗狂潮": {
    "en": "Superior Hunter's Defense: Stand Against the Tide",
    "class": "游侠",
    "subclass": "猎人",
    "level": 15,
    "prereq": [],
    "desc_en": [
      "When a hostile creature misses you with a melee attack, you can use your reaction to force that creature to repeat the same attack against another creature (other than itself) of your choice."
    ]
  },
  "高级猎手防御：洞悉闪避": {
    "en": "Superior Hunter's Defense: Uncanny Dodge",
    "class": "游侠",
    "subclass": "猎人",
    "level": 15,
    "prereq": [],
    "desc_en": [
      "When an attacker that you can see hits you with an attack, you can use your reaction to halve the attack's damage against you."
    ]
  },
  "高级激励": {
    "en": "Superior Inspiration",
    "class": "吟游诗人",
    "subclass": "",
    "level": 20,
    "prereq": [],
    "desc_en": [
      "At 20th level, when you roll initiative and have no uses of Bardic Inspiration left, you regain one use."
    ]
  },
  "终极治疗": {
    "en": "Supreme Healing",
    "class": "牧师",
    "subclass": "",
    "level": 17,
    "prereq": [],
    "desc_en": [
      "Starting at 17th level, when you would normally roll one or more dice to restore hit points with a spell, you instead use the highest number possible for each die. For example, instead of restoring 2d6 hit points to a creature, you restore 12."
    ]
  },
  "终极潜行": {
    "en": "Supreme Sneak",
    "class": "游荡者",
    "subclass": "盗贼",
    "level": 9,
    "prereq": [],
    "desc_en": [
      "Starting at 9th level, you have advantage on a Dexterity (Stealth) check if you move no more than half your speed on the same turn."
    ]
  },
  "幸存者": {
    "en": "Survivor",
    "class": "战士",
    "subclass": "勇士",
    "level": 18,
    "prereq": [],
    "desc_en": [
      "At 18th level, you attain the pinnacle of resilience in battle. At the start of each of your turns, you regain hit points equal to 5 + your Constitution modifier if you have no more than half of your hit points left. You don't gain this benefit if you have 0 hit points."
    ]
  },
  "盗贼反射": {
    "en": "Thief's Reflexes",
    "class": "游荡者",
    "subclass": "盗贼",
    "level": 17,
    "prereq": [],
    "desc_en": [
      "When you reach 17th level, you have become adept at laying ambushes and quickly escaping danger. You can take two turns during the first round of any combat. You take your first turn at your normal initiative and your second turn at your initiative minus 10. You can't use this feature when you are surprised."
    ]
  },
  "盗贼黑话": {
    "en": "Thieves' Cant",
    "class": "游荡者",
    "subclass": "",
    "level": 1,
    "prereq": [],
    "desc_en": [
      "During your rogue training you learned thieves' cant, a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation. Only another creature that knows thieves' cant understands such messages. It takes four times longer to convey such a message than it does to speak the same idea plainly.",
      "In addition, you understand a set of secret signs and symbols used to convey short, simple messages, such as whether an area is dangerous or the territory of a thieves' guild, whether loot is nearby, or whether the people in an area are easy marks or will provide a safe house for thieves on the run."
    ]
  },
  "日月之语": {
    "en": "Tongue of the Sun and Moon",
    "class": "武僧",
    "subclass": "",
    "level": 13,
    "prereq": [],
    "desc_en": [
      "Starting at 13th level, you learn to touch the ki of other minds so that you understand all spoken languages. Moreover, any creature that can understand a language can understand what you say."
    ]
  },
  "静谧": {
    "en": "Tranquility",
    "class": "武僧",
    "subclass": "散打宗",
    "level": 11,
    "prereq": [],
    "desc_en": [
      "Beginning at 11th level, you can enter a special meditation that surrounds you with an aura of peace. At the end of a long rest, you gain the effect of a sanctuary spell that lasts until the start of your next long rest (the spell can end early as normal). The saving throw DC for the spell equals 8 + your Wisdom modifier + your proficiency bonus."
    ]
  },
  "无甲移动": {
    "en": "Unarmored Movement",
    "class": "武僧",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "Starting at 2nd level, your speed increases by 10 feet while you are not wearing armor or wielding a shield. This bonus increases when you reach certain monk levels, as shown in Table: The Monk.",
      "At 9th level, you gain the ability to move along vertical surfaces and across liquids on your turn without falling during the move."
    ]
  },
  "无甲移动（Unarmored Movement）": {
    "en": "Unarmored Movement",
    "class": "武僧",
    "subclass": "",
    "level": 9,
    "prereq": [],
    "desc_en": [
      "Starting at 2nd level, your speed increases by 10 feet while you are not wearing armor or wielding a shield. This bonus increases when you reach certain monk levels, as shown in Table: The Monk.",
      "At 9th level, you gain the ability to move along vertical surfaces and across liquids on your turn without falling during the move."
    ]
  },
  "洞悉闪避": {
    "en": "Uncanny Dodge",
    "class": "游荡者",
    "subclass": "",
    "level": 5,
    "prereq": [],
    "desc_en": [
      "Starting at 5th level, when an attacker that you can see hits you with an attack, you can use your reaction to halve the attack's damage against you."
    ]
  },
  "使用魔法装置": {
    "en": "Use Magic Device",
    "class": "游荡者",
    "subclass": "盗贼",
    "level": 13,
    "prereq": [],
    "desc_en": [
      "By 13th level, you have learned enough about the workings of magic that you can improvise the use of items even when they are not intended for you. You ignore all class, race, and level requirements on the use of magic items."
    ]
  },
  "隐匿无踪": {
    "en": "Vanish",
    "class": "游侠",
    "subclass": "",
    "level": 14,
    "prereq": [],
    "desc_en": [
      "Starting at 14th level, you can use the Hide action as a bonus action on your turn. Also, you can't be tracked by nonmagical means, unless you choose to leave a trail."
    ]
  },
  "完满之躯": {
    "en": "Wholeness of Body",
    "class": "武僧",
    "subclass": "散打宗",
    "level": 6,
    "prereq": [],
    "desc_en": [
      "At 6th level, you gain the ability to heal yourself. As an action, you can regain hit points equal to three times your monk level. You must finish a long rest before you can use this feature again."
    ]
  },
  "荒野形态（CR 1/2 or below, no flying speed）": {
    "en": "Wild Shape (CR 1/2 or below, no flying speed)",
    "class": "德鲁伊",
    "subclass": "",
    "level": 4,
    "prereq": [],
    "desc_en": [
      "Starting at 2nd level, you can use your action to magically assume the shape of a beast that you have seen before. You can use this feature twice. You regain expended uses when you finish a short or long rest.",
      "Your druid level determines the beasts you can transform into, as shown in the Beast Shapes table. At 2nd level, for example, you can transform into any beast that has a challenge rating of 1/4 or lower that doesn't have a flying or swimming speed.",
      "You can stay in a beast shape for a number of hours equal to half your druid level (rounded down). You then revert to your normal form unless you expend another use of this feature. You can revert to your normal form earlier by using a bonus action on your turn. You automatically revert if you fall unconscious, drop to 0 hit points, or die.",
      "While you are transformed, the following rules apply:",
      "- Your game statistics are replaced by the statistics of the beast, but you retain your alignment, personality, and Intelligence, Wisdom, and Charisma scores. You also retain all of your skill and saving throw proficiencies, in addition to gaining those of the creature. If the creature has the same proficiency as you and the bonus in its stat block is higher than yours, use the creature's bonus instead of yours. If the creature has any legendary or lair actions, you can't use them.",
      "- When you transform, you assume the beast's hit points and Hit Dice. When you revert to your normal form, you return to the number of hit points you had before you transformed. However, if you revert as a result of dropping to 0 hit points, any excess damage carries over to your normal form. For example, if you take 10 damage in animal form and have only 1 hit point left, you revert and take 9 damage. As long as the excess damage doesn't reduce your normal form to 0 hit points, you aren't knocked unconscious.",
      "- You can't cast spells, and your ability to speak or take any action that requires hands is limited to the capabilities of your beast form. Transforming doesn't break your concentration on a spell you've already cast, however, or prevent you from taking actions that are part of a spell, such as call lightning, that you've already cast.",
      "- You retain the benefit of any features from your class, race, or other source and can use them if the new form is physically capable of doing so. However, you can't use any of your special senses, such as darkvision, unless your new form also has that sense.",
      "- You choose whether your equipment falls to the ground in your space, merges into your new form, or is worn by it. Worn equipment functions as normal, but the GM decides whether it is practical for the new form to wear a piece of equipment, based on the creature's shape and size. Your equipment doesn't change size or shape to match the new form, and any equipment that the new form can't wear must either fall to the ground or merge with it. Equipment that merges with the form has no effect until you leave the form."
    ]
  },
  "荒野形态（CR 1/4 or below, no flying or swim speed）": {
    "en": "Wild Shape (CR 1/4 or below, no flying or swim speed)",
    "class": "德鲁伊",
    "subclass": "",
    "level": 2,
    "prereq": [],
    "desc_en": [
      "Starting at 2nd level, you can use your action to magically assume the shape of a beast that you have seen before. You can use this feature twice. You regain expended uses when you finish a short or long rest.",
      "Your druid level determines the beasts you can transform into, as shown in the Beast Shapes table. At 2nd level, for example, you can transform into any beast that has a challenge rating of 1/4 or lower that doesn't have a flying or swimming speed.",
      "You can stay in a beast shape for a number of hours equal to half your druid level (rounded down). You then revert to your normal form unless you expend another use of this feature. You can revert to your normal form earlier by using a bonus action on your turn. You automatically revert if you fall unconscious, drop to 0 hit points, or die.",
      "While you are transformed, the following rules apply:",
      "- Your game statistics are replaced by the statistics of the beast, but you retain your alignment, personality, and Intelligence, Wisdom, and Charisma scores. You also retain all of your skill and saving throw proficiencies, in addition to gaining those of the creature. If the creature has the same proficiency as you and the bonus in its stat block is higher than yours, use the creature's bonus instead of yours. If the creature has any legendary or lair actions, you can't use them.",
      "- When you transform, you assume the beast's hit points and Hit Dice. When you revert to your normal form, you return to the number of hit points you had before you transformed. However, if you revert as a result of dropping to 0 hit points, any excess damage carries over to your normal form. For example, if you take 10 damage in animal form and have only 1 hit point left, you revert and take 9 damage. As long as the excess damage doesn't reduce your normal form to 0 hit points, you aren't knocked unconscious.",
      "- You can't cast spells, and your ability to speak or take any action that requires hands is limited to the capabilities of your beast form. Transforming doesn't break your concentration on a spell you've already cast, however, or prevent you from taking actions that are part of a spell, such as call lightning, that you've already cast.",
      "- You retain the benefit of any features from your class, race, or other source and can use them if the new form is physically capable of doing so. However, you can't use any of your special senses, such as darkvision, unless your new form also has that sense.",
      "- You choose whether your equipment falls to the ground in your space, merges into your new form, or is worn by it. Worn equipment functions as normal, but the GM decides whether it is practical for the new form to wear a piece of equipment, based on the creature's shape and size. Your equipment doesn't change size or shape to match the new form, and any equipment that the new form can't wear must either fall to the ground or merge with it. Equipment that merges with the form has no effect until you leave the form."
    ]
  },
  "荒野形态（CR 1 or below）": {
    "en": "Wild Shape (CR 1 or below)",
    "class": "德鲁伊",
    "subclass": "",
    "level": 8,
    "prereq": [],
    "desc_en": [
      "Starting at 2nd level, you can use your action to magically assume the shape of a beast that you have seen before. You can use this feature twice. You regain expended uses when you finish a short or long rest.",
      "Your druid level determines the beasts you can transform into, as shown in the Beast Shapes table. At 2nd level, for example, you can transform into any beast that has a challenge rating of 1/4 or lower that doesn't have a flying or swimming speed.",
      "You can stay in a beast shape for a number of hours equal to half your druid level (rounded down). You then revert to your normal form unless you expend another use of this feature. You can revert to your normal form earlier by using a bonus action on your turn. You automatically revert if you fall unconscious, drop to 0 hit points, or die.",
      "While you are transformed, the following rules apply:",
      "- Your game statistics are replaced by the statistics of the beast, but you retain your alignment, personality, and Intelligence, Wisdom, and Charisma scores. You also retain all of your skill and saving throw proficiencies, in addition to gaining those of the creature. If the creature has the same proficiency as you and the bonus in its stat block is higher than yours, use the creature's bonus instead of yours. If the creature has any legendary or lair actions, you can't use them.",
      "- When you transform, you assume the beast's hit points and Hit Dice. When you revert to your normal form, you return to the number of hit points you had before you transformed. However, if you revert as a result of dropping to 0 hit points, any excess damage carries over to your normal form. For example, if you take 10 damage in animal form and have only 1 hit point left, you revert and take 9 damage. As long as the excess damage doesn't reduce your normal form to 0 hit points, you aren't knocked unconscious.",
      "- You can't cast spells, and your ability to speak or take any action that requires hands is limited to the capabilities of your beast form. Transforming doesn't break your concentration on a spell you've already cast, however, or prevent you from taking actions that are part of a spell, such as call lightning, that you've already cast.",
      "- You retain the benefit of any features from your class, race, or other source and can use them if the new form is physically capable of doing so. However, you can't use any of your special senses, such as darkvision, unless your new form also has that sense.",
      "- You choose whether your equipment falls to the ground in your space, merges into your new form, or is worn by it. Worn equipment functions as normal, but the GM decides whether it is practical for the new form to wear a piece of equipment, based on the creature's shape and size. Your equipment doesn't change size or shape to match the new form, and any equipment that the new form can't wear must either fall to the ground or merge with it. Equipment that merges with the form has no effect until you leave the form."
    ]
  }
};
