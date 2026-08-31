/**
 * d20.web engine/data_monsters - SRD 怪物图鉴（含 CR→XP 表）
 *
 * 由 Python d20.data_monsters 经 JSON 直转生成，保证与 Python 单一事实来源逐字段一致
 * （前端/后端 SRD 内容零漂移）。如需修改，请在 Python 侧改动后经本生成脚本同步。
 */
export const MONSTERS: Record<string, any> = {
  "阿巴梭": {
    "en": "Aboleth",
    "size": "大型",
    "type": "异怪",
    "alignment": "守序邪恶",
    "ac": 17,
    "ac_note": "natural",
    "hp": "135 (18d10)",
    "speed": "10 ft., 游泳 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 20}",
    "languages": "深层语, telepathy 120 ft.",
    "cr": "10",
    "traits": [
      [
        "Amphibious",
        "The aboleth can breathe air and water."
      ],
      [
        "Mucous Cloud",
        "While underwater, the aboleth is surrounded by transformative mucus. A creature that touches the aboleth or that hits it with a melee attack while within 5 ft. of it must make a DC 14 Constitution saving throw. On a failure, the creature is diseased for 1d4 hours. The diseased creature can breathe only underwater."
      ],
      [
        "Probing Telepathy",
        "If a creature communicates telepathically with the aboleth, the aboleth learns the creature's greatest desires if the aboleth can see the creature."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The aboleth makes three tentacle attacks."
      },
      {
        "name": "Tentacle",
        "atk": 9,
        "reach": "10 ft",
        "dmg": "2d6+5",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 12 (2d6 + 5) bludgeoning damage. If the target is a creature, it must succeed on a DC 14 Constitution saving throw or become diseased. The disease has no effect for 1 minute and can be removed by any magic that cures disease. After 1 minute, the diseased creature's skin becomes translucent and slimy, the creature can't regain hit points unless it is underwater, and the disease can be removed only by heal or another disease-curing spell of 6th level or higher. When the creature is outside a body of water, it takes 6 (1d12) acid damage every 10 minutes unless moisture is applied to the skin before 10 minutes have passed."
      },
      {
        "name": "Tail",
        "atk": 9,
        "reach": "10 ft",
        "dmg": "3d6+5",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 15 (3d6 + 5) bludgeoning damage."
      },
      {
        "name": "Enslave",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The aboleth targets one creature it can see within 30 ft. of it. The target must succeed on a DC 14 Wisdom saving throw or be magically charmed by the aboleth until the aboleth dies or until it is on a different plane of existence from the target. The charmed target is under the aboleth's control and can't take reactions, and the aboleth and the target can communicate telepathically with each other over any distance.\nWhenever the charmed target takes damage, the target can repeat the saving throw. On a success, the effect ends. No more than once every 24 hours, the target can also repeat the saving throw when it is at least 1 mile away from the aboleth."
      }
    ],
    "legendary": [
      {
        "name": "Detect",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The aboleth makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Swipe",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The aboleth makes one tail attack."
      },
      {
        "name": "Psychic Drain (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "3d6",
        "type": "心灵",
        "extra": "One creature charmed by the aboleth takes 10 (3d6) psychic damage, and the aboleth regains hit points equal to the damage the creature takes."
      }
    ]
  },
  "信徒": {
    "en": "Acolyte",
    "size": "中型",
    "type": "类人妖",
    "alignment": "任意",
    "ac": 10,
    "ac_note": "dex",
    "hp": "9 (2d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 12}",
    "languages": "any one language (usually Common)",
    "cr": "1/4",
    "traits": [
      [
        "Spellcasting",
        "The acolyte is a 1st-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 12, +4 to hit with spell attacks). The acolyte has following cleric spells prepared:\n\n- Cantrips (at will): light, sacred flame, thaumaturgy\n- 1st level (3 slots): bless, cure wounds, sanctuary"
      ]
    ],
    "actions": [
      {
        "name": "Club",
        "atk": 2,
        "reach": "5 ft",
        "dmg": "1d4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 2 (1d4) bludgeoning damage."
      }
    ]
  },
  "成年黑龙": {
    "en": "Adult Black Dragon",
    "size": "超大型",
    "type": "龙",
    "alignment": "混乱邪恶",
    "ac": 19,
    "ac_note": "natural",
    "hp": "195 (17d12)",
    "speed": "40 ft., 飞行 80 ft., 游泳 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "酸"
    ],
    "senses": "{'盲视': '60 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 21}",
    "languages": "通用语, 龙语",
    "cr": "14",
    "traits": [
      [
        "Amphibious",
        "The dragon can breathe air and water."
      ],
      [
        "Legendary Resistance",
        "If the dragon fails a saving throw, it can choose to succeed instead."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 11,
        "reach": "10 ft",
        "dmg": "2d10+6",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 17 (2d10 + 6) piercing damage plus 4 (1d8) acid damage."
      },
      {
        "name": "Claw",
        "atk": 11,
        "reach": "5 ft",
        "dmg": "2d6+6",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +11 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage."
      },
      {
        "name": "Tail",
        "atk": 11,
        "reach": "15 ft",
        "dmg": "2d8+6",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +11 to hit, reach 15 ft., one target. Hit: 15 (2d8 + 6) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours."
      },
      {
        "name": "Acid Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "12d8",
        "type": "酸",
        "extra": "The dragon exhales acid in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Dexterity saving throw, taking 54 (12d8) acid damage on a failed save, or half as much damage on a successful one."
      }
    ],
    "legendary": [
      {
        "name": "Detect",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "2d6+6",
        "type": "钝击",
        "extra": "The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 19 Dexterity saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
      }
    ]
  },
  "成年蓝龙": {
    "en": "Adult Blue Dragon",
    "size": "超大型",
    "type": "龙",
    "alignment": "守序邪恶",
    "ac": 19,
    "ac_note": "natural",
    "hp": "225 (18d12)",
    "speed": "40 ft., 掘地 30 ft., 飞行 80 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "电"
    ],
    "senses": "{'盲视': '60 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 22}",
    "languages": "通用语, 龙语",
    "cr": "16",
    "traits": [
      [
        "Legendary Resistance",
        "If the dragon fails a saving throw, it can choose to succeed instead."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 12,
        "reach": "10 ft",
        "dmg": "2d10+7",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +12 to hit, reach 10 ft., one target. Hit: 18 (2d10 + 7) piercing damage plus 5 (1d10) lightning damage."
      },
      {
        "name": "Claw",
        "atk": 12,
        "reach": "5 ft",
        "dmg": "2d6+7",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +12 to hit, reach 5 ft., one target. Hit: 14 (2d6 + 7) slashing damage."
      },
      {
        "name": "Tail",
        "atk": 12,
        "reach": "15 ft",
        "dmg": "2d8+7",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +12 to hit, reach 15 ft., one target. Hit: 16 (2d8 + 7) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Each creature of the dragon's choice that is within 120 ft. of the dragon and aware of it must succeed on a DC 17 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours."
      },
      {
        "name": "Lightning Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "12d10",
        "type": "电",
        "extra": "The dragon exhales lightning in a 90-foot line that is 5 ft. wide. Each creature in that line must make a DC 19 Dexterity saving throw, taking 66 (12d10) lightning damage on a failed save, or half as much damage on a successful one."
      }
    ],
    "legendary": [
      {
        "name": "Detect",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "2d6+7",
        "type": "钝击",
        "extra": "The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 20 Dexterity saving throw or take 14 (2d6 + 7) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
      }
    ]
  },
  "成年黄铜龙": {
    "en": "Adult Brass Dragon",
    "size": "超大型",
    "type": "龙",
    "alignment": "混乱善良",
    "ac": 18,
    "ac_note": "natural",
    "hp": "172 (15d12)",
    "speed": "40 ft., 掘地 40 ft., 飞行 80 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "火"
    ],
    "senses": "{'盲视': '60 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 21}",
    "languages": "通用语, 龙语",
    "cr": "13",
    "traits": [
      [
        "Legendary Resistance",
        "If the dragon fails a saving throw, it can choose to succeed instead."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 11,
        "reach": "10 ft",
        "dmg": "2d10+6",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 17 (2d10 + 6) piercing damage."
      },
      {
        "name": "Claw",
        "atk": 11,
        "reach": "5 ft",
        "dmg": "2d6+6",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +11 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage."
      },
      {
        "name": "Tail",
        "atk": 11,
        "reach": "15 ft",
        "dmg": "2d8+6",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +11 to hit, reach 15 ft., one target. Hit: 15 (2d8 + 6) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours ."
      },
      {
        "name": "Breath Weapons",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon uses one of the following breath weapons.\nFire Breath. The dragon exhales fire in an 60-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Dexterity saving throw, taking 45 (13d6) fire damage on a failed save, or half as much damage on a successful one.\nSleep Breath. The dragon exhales sleep gas in a 60-foot cone. Each creature in that area must succeed on a DC 18 Constitution saving throw or fall unconscious for 10 minutes. This effect ends for a creature if the creature takes damage or someone uses an action to wake it."
      }
    ],
    "legendary": [
      {
        "name": "Detect",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "2d6+6",
        "type": "钝击",
        "extra": "The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 19 Dexterity saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
      }
    ]
  },
  "成年青铜龙": {
    "en": "Adult Bronze Dragon",
    "size": "超大型",
    "type": "龙",
    "alignment": "守序善良",
    "ac": 19,
    "ac_note": "natural",
    "hp": "212 (17d12)",
    "speed": "40 ft., 飞行 80 ft., 游泳 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "电"
    ],
    "senses": "{'盲视': '60 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 22}",
    "languages": "通用语, 龙语",
    "cr": "15",
    "traits": [
      [
        "Amphibious",
        "The dragon can breathe air and water."
      ],
      [
        "Legendary Resistance",
        "If the dragon fails a saving throw, it can choose to succeed instead."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 12,
        "reach": "10 ft",
        "dmg": "2d10+7",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +12 to hit, reach 10 ft., one target. Hit: 18 (2d10 + 7) piercing damage."
      },
      {
        "name": "Claw",
        "atk": 12,
        "reach": "5 ft",
        "dmg": "2d6+7",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +12 to hit, reach 5 ft., one target. Hit: 14 (2d6 + 7) slashing damage."
      },
      {
        "name": "Tail",
        "atk": 12,
        "reach": "15 ft",
        "dmg": "2d8+7",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +12 to hit, reach 15 ft., one target. Hit: 16 (2d8 + 7) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 17 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours."
      },
      {
        "name": "Breath Weapons",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon uses one of the following breath weapons.\nLightning Breath. The dragon exhales lightning in a 90-foot line that is 5 feet wide. Each creature in that line must make a DC 19 Dexterity saving throw, taking 66 (12d10) lightning damage on a failed save, or half as much damage on a successful one.\nRepulsion Breath. The dragon exhales repulsion energy in a 30-foot cone. Each creature in that area must succeed on a DC 19 Strength saving throw. On a failed save, the creature is pushed 60 feet away from the dragon."
      }
    ],
    "legendary": [
      {
        "name": "Detect",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "2d6+7",
        "type": "钝击",
        "extra": "The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 20 Dexterity saving throw or take 14 (2d6 + 7) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
      }
    ]
  },
  "成年红铜龙": {
    "en": "Adult Copper Dragon",
    "size": "超大型",
    "type": "龙",
    "alignment": "混乱善良",
    "ac": 18,
    "ac_note": "natural",
    "hp": "184 (16d12)",
    "speed": "40 ft., 爬 40 ft., 飞行 80 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "酸"
    ],
    "senses": "{'盲视': '60 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 22}",
    "languages": "通用语, 龙语",
    "cr": "14",
    "traits": [
      [
        "Legendary Resistance",
        "If the dragon fails a saving throw, it can choose to succeed instead."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 11,
        "reach": "10 ft",
        "dmg": "2d10+6",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 17 (2d10 + 6) piercing damage."
      },
      {
        "name": "Claw",
        "atk": 11,
        "reach": "5 ft",
        "dmg": "2d6+6",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +11 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage."
      },
      {
        "name": "Tail",
        "atk": 11,
        "reach": "15 ft",
        "dmg": "2d8+6",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +11 to hit, reach 15 ft., one target. Hit: 15 (2d8 + 6) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours."
      },
      {
        "name": "Breath Weapons",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon uses one of the following breath weapons.\nAcid Breath. The dragon exhales acid in an 60-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Dexterity saving throw, taking 54 (12d8) acid damage on a failed save, or half as much damage on a successful one.\nSlowing Breath. The dragon exhales gas in a 60-foot cone. Each creature in that area must succeed on a DC 18 Constitution saving throw. On a failed save, the creature can't use reactions, its speed is halved, and it can't make more than one attack on its turn. In addition, the creature can use either an action or a bonus action on its turn, but not both. These effects last for 1 minute. The creature can repeat the saving throw at the end of each of its turns, ending the effect on itself with a successful save."
      }
    ],
    "legendary": [
      {
        "name": "Detect",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "2d6+6",
        "type": "钝击",
        "extra": "The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 19 Dexterity saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
      }
    ]
  },
  "成年金龙": {
    "en": "Adult Gold Dragon",
    "size": "超大型",
    "type": "龙",
    "alignment": "守序善良",
    "ac": 19,
    "ac_note": "natural",
    "hp": "256 (19d12)",
    "speed": "40 ft., 飞行 80 ft., 游泳 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "火"
    ],
    "senses": "{'盲视': '60 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 24}",
    "languages": "通用语, 龙语",
    "cr": "17",
    "traits": [
      [
        "Amphibious",
        "The dragon can breathe air and water."
      ],
      [
        "Legendary Resistance",
        "If the dragon fails a saving throw, it can choose to succeed instead."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 14,
        "reach": "10 ft",
        "dmg": "2d10+8",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 19 (2d10 + 8) piercing damage."
      },
      {
        "name": "Claw",
        "atk": 14,
        "reach": "5 ft",
        "dmg": "2d6+8",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +14 to hit, reach 5 ft., one target. Hit: 15 (2d6 + 8) slashing damage."
      },
      {
        "name": "Tail",
        "atk": 14,
        "reach": "15 ft",
        "dmg": "2d8+8",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +14 to hit, reach 15 ft., one target. Hit: 17 (2d8 + 8) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 21 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours."
      },
      {
        "name": "Breath Weapons",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon uses one of the following breath weapons.\nFire Breath. The dragon exhales fire in a 60-foot cone. Each creature in that area must make a DC 21 Dexterity saving throw, taking 66 (12d10) fire damage on a failed save, or half as much damage on a successful one.\nWeakening Breath. The dragon exhales gas in a 60-foot cone. Each creature in that area must succeed on a DC 21 Strength saving throw or have disadvantage on Strength-based attack rolls, Strength checks, and Strength saving throws for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ],
    "legendary": [
      {
        "name": "Detect",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "2d6+8",
        "type": "钝击",
        "extra": "The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 22 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
      }
    ]
  },
  "成年绿龙": {
    "en": "Adult Green Dragon",
    "size": "超大型",
    "type": "龙",
    "alignment": "守序邪恶",
    "ac": 19,
    "ac_note": "natural",
    "hp": "207 (18d12)",
    "speed": "40 ft., 飞行 80 ft., 游泳 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "毒"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'盲视': '60 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 22}",
    "languages": "通用语, 龙语",
    "cr": "15",
    "traits": [
      [
        "Amphibious",
        "The dragon can breathe air and water."
      ],
      [
        "Legendary Resistance",
        "If the dragon fails a saving throw, it can choose to succeed instead."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 11,
        "reach": "10 ft",
        "dmg": "2d10+6",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 17 (2d10 + 6) piercing damage plus 7 (2d6) poison damage."
      },
      {
        "name": "Claw",
        "atk": 11,
        "reach": "5 ft",
        "dmg": "2d6+6",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +11 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage."
      },
      {
        "name": "Tail",
        "atk": 11,
        "reach": "15 ft",
        "dmg": "2d8+6",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +11 to hit, reach 15 ft., one target. Hit: 15 (2d8 + 6) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours ."
      },
      {
        "name": "Poison Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "16d6",
        "type": "毒",
        "extra": "The dragon exhales poisonous gas in a 60-foot cone. Each creature in that area must make a DC 18 Constitution saving throw, taking 56 (16d6) poison damage on a failed save, or half as much damage on a successful one."
      }
    ],
    "legendary": [
      {
        "name": "Detect",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "2d6+6",
        "type": "钝击",
        "extra": "The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 19 Dexterity saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
      }
    ]
  },
  "成年红龙": {
    "en": "Adult Red Dragon",
    "size": "超大型",
    "type": "龙",
    "alignment": "混乱邪恶",
    "ac": 19,
    "ac_note": "natural",
    "hp": "256 (19d12)",
    "speed": "40 ft., 爬 40 ft., 飞行 80 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "火"
    ],
    "senses": "{'盲视': '60 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 23}",
    "languages": "通用语, 龙语",
    "cr": "17",
    "traits": [
      [
        "Legendary Resistance",
        "If the dragon fails a saving throw, it can choose to succeed instead."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 14,
        "reach": "10 ft",
        "dmg": "2d10+8",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 19 (2d10 + 8) piercing damage plus 7 (2d6) fire damage."
      },
      {
        "name": "Claw",
        "atk": 14,
        "reach": "5 ft",
        "dmg": "2d6+8",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +14 to hit, reach 5 ft., one target. Hit: 15 (2d6 + 8) slashing damage."
      },
      {
        "name": "Tail",
        "atk": 14,
        "reach": "15 ft",
        "dmg": "2d8+8",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +14 to hit, reach 15 ft., one target. Hit: 17 (2d8 + 8) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Each creature of the dragon's choice that is within 120 ft. of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours."
      },
      {
        "name": "Fire Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "18d6",
        "type": "火",
        "extra": "The dragon exhales fire in a 60-foot cone. Each creature in that area must make a DC 21 Dexterity saving throw, taking 63 (18d6) fire damage on a failed save, or half as much damage on a successful one."
      }
    ],
    "legendary": [
      {
        "name": "Detect",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "2d6+8",
        "type": "钝击",
        "extra": "The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 22 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
      }
    ]
  },
  "成年银龙": {
    "en": "Adult Silver Dragon",
    "size": "超大型",
    "type": "龙",
    "alignment": "守序善良",
    "ac": 19,
    "ac_note": "natural",
    "hp": "243 (18d12)",
    "speed": "40 ft., 飞行 80 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "冷"
    ],
    "senses": "{'盲视': '60 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 21}",
    "languages": "通用语, 龙语",
    "cr": "16",
    "traits": [
      [
        "Legendary Resistance",
        "If the dragon fails a saving throw, it can choose to succeed instead."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 13,
        "reach": "10 ft",
        "dmg": "2d10+8",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +13 to hit, reach 10 ft., one target. Hit: 19 (2d10 + 8) piercing damage."
      },
      {
        "name": "Claw",
        "atk": 13,
        "reach": "5 ft",
        "dmg": "2d6+8",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +13 to hit, reach 5 ft., one target. Hit: 15 (2d6 + 8) slashing damage."
      },
      {
        "name": "Tail",
        "atk": 13,
        "reach": "15 ft",
        "dmg": "2d8+8",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +13 to hit, reach 15 ft., one target. Hit: 17 (2d8 + 8) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 18 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours."
      },
      {
        "name": "Breath Weapons",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon uses one of the following breath weapons.\nCold Breath. The dragon exhales an icy blast in a 60-foot cone. Each creature in that area must make a DC 20 Constitution saving throw, taking 58 (13d8) cold damage on a failed save, or half as much damage on a successful one.\nParalyzing Breath. The dragon exhales paralyzing gas in a 60-foot cone. Each creature in that area must succeed on a DC 20 Constitution saving throw or be paralyzed for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ],
    "legendary": [
      {
        "name": "Detect",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "2d6+8",
        "type": "钝击",
        "extra": "The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 22 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
      }
    ]
  },
  "成年白龙": {
    "en": "Adult White Dragon",
    "size": "超大型",
    "type": "龙",
    "alignment": "混乱邪恶",
    "ac": 18,
    "ac_note": "natural",
    "hp": "200 (16d12)",
    "speed": "40 ft., 掘地 30 ft., 飞行 80 ft., 游泳 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "冷"
    ],
    "senses": "{'盲视': '60 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 21}",
    "languages": "通用语, 龙语",
    "cr": "13",
    "traits": [
      [
        "Ice Walk",
        "The dragon can move across and climb icy surfaces without needing to make an ability check. Additionally, difficult terrain composed of ice or snow doesn't cost it extra movement."
      ],
      [
        "Legendary Resistance",
        "If the dragon fails a saving throw, it can choose to succeed instead."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 11,
        "reach": "10 ft",
        "dmg": "2d10+6",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 17 (2d10 + 6) piercing damage plus 4 (1d8) cold damage."
      },
      {
        "name": "Claw",
        "atk": 11,
        "reach": "5 ft",
        "dmg": "2d6+6",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +11 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage."
      },
      {
        "name": "Tail",
        "atk": 11,
        "reach": "15 ft",
        "dmg": "2d8+6",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +11 to hit, reach 15 ft., one target. Hit: 15 (2d8 + 6) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Each creature of the dragon's choice that is within 120 ft. of the dragon and aware of it must succeed on a DC 14 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours."
      },
      {
        "name": "Cold Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "12d8",
        "type": "冷",
        "extra": "The dragon exhales an icy blast in a 60-foot cone. Each creature in that area must make a DC 19 Constitution saving throw, taking 54 (12d8) cold damage on a failed save, or half as much damage on a successful one."
      }
    ],
    "legendary": [
      {
        "name": "Detect",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "2d6+6",
        "type": "钝击",
        "extra": "The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 19 Dexterity saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
      }
    ]
  },
  "气元素": {
    "en": "Air Elemental",
    "size": "大型",
    "type": "元素",
    "alignment": "中立",
    "ac": 15,
    "ac_note": "dex",
    "hp": "90 (12d10)",
    "speed": "飞行 90 ft., 悬浮 True",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "电",
      "雷",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "毒"
    ],
    "cond_immune": [
      "力竭",
      "擒抱",
      "麻痹",
      "石化",
      "中毒",
      "倒地",
      "束缚",
      "昏迷"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "气族语",
    "cr": "5",
    "traits": [
      [
        "Air Form",
        "The elemental can enter a hostile creature's space and stop there. It can move through a space as narrow as 1 inch wide without squeezing."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The elemental makes two slam attacks."
      },
      {
        "name": "Slam",
        "atk": 8,
        "reach": "5 ft",
        "dmg": "2d8+5",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 14 (2d8 + 5) bludgeoning damage."
      },
      {
        "name": "Whirlwind",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Each creature in the elemental's space must make a DC 13 Strength saving throw. On a failure, a target takes 15 (3d8 + 2) bludgeoning damage and is flung up 20 feet away from the elemental in a random direction and knocked prone. If a thrown target strikes an object, such as a wall or floor, the target takes 3 (1d6) bludgeoning damage for every 10 feet it was thrown. If the target is thrown at another creature, that creature must succeed on a DC 13 Dexterity saving throw or take the same damage and be knocked prone.\nIf the saving throw is successful, the target takes half the bludgeoning damage and isn't flung away or knocked prone."
      }
    ]
  },
  "远古黑龙": {
    "en": "Ancient Black Dragon",
    "size": "巨型",
    "type": "龙",
    "alignment": "混乱邪恶",
    "ac": 22,
    "ac_note": "natural",
    "hp": "367 (21d20)",
    "speed": "40 ft., 飞行 80 ft., 游泳 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "酸"
    ],
    "senses": "{'盲视': '60 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 26}",
    "languages": "通用语, 龙语",
    "cr": "21",
    "traits": [
      [
        "Amphibious",
        "The dragon can breathe air and water."
      ],
      [
        "Legendary Resistance",
        "If the dragon fails a saving throw, it can choose to succeed instead."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 15,
        "reach": "15 ft",
        "dmg": "2d10+8",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +15 to hit, reach 15 ft., one target. Hit: 19 (2d10 + 8) piercing damage plus 9 (2d8) acid damage."
      },
      {
        "name": "Claw",
        "atk": 15,
        "reach": "10 ft",
        "dmg": "2d6+8",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +15 to hit, reach 10 ft., one target. Hit: 15 (2d6 + 8) slashing damage."
      },
      {
        "name": "Tail",
        "atk": 15,
        "reach": "20 ft",
        "dmg": "2d8+8",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +15 to hit, reach 20 ft., one target. Hit: 17 (2d8 + 8) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours."
      },
      {
        "name": "Acid Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "15d8",
        "type": "酸",
        "extra": "The dragon exhales acid in a 90-foot line that is 10 feet wide. Each creature in that line must make a DC 22 Dexterity saving throw, taking 67 (15d8) acid damage on a failed save, or half as much damage on a successful one."
      }
    ],
    "legendary": [
      {
        "name": "Detect",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "2d6+8",
        "type": "钝击",
        "extra": "The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 23 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
      }
    ]
  },
  "远古蓝龙": {
    "en": "Ancient Blue Dragon",
    "size": "巨型",
    "type": "龙",
    "alignment": "守序邪恶",
    "ac": 22,
    "ac_note": "natural",
    "hp": "481 (26d20)",
    "speed": "40 ft., 掘地 40 ft., 飞行 80 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "电"
    ],
    "senses": "{'盲视': '60 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 27}",
    "languages": "通用语, 龙语",
    "cr": "23",
    "traits": [
      [
        "Legendary Resistance",
        "If the dragon fails a saving throw, it can choose to succeed instead."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 16,
        "reach": "15 ft",
        "dmg": "2d10+9",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +16 to hit, reach 15 ft., one target. Hit: 20 (2d10 + 9) piercing damage plus 11 (2d10) lightning damage."
      },
      {
        "name": "Claw",
        "atk": 16,
        "reach": "10 ft",
        "dmg": "2d6+9",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +16 to hit, reach 10 ft., one target. Hit: 16 (2d6 + 9) slashing damage."
      },
      {
        "name": "Tail",
        "atk": 16,
        "reach": "20 ft",
        "dmg": "2d8+9",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +16 to hit, reach 20 ft., one target. Hit: 18 (2d8 + 9) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 20 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours."
      },
      {
        "name": "Lightning Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "16d10",
        "type": "电",
        "extra": "The dragon exhales lightning in a 120-foot line that is 10 feet wide. Each creature in that line must make a DC 23 Dexterity saving throw, taking 88 (16d10) lightning damage on a failed save, or half as much damage on a successful one."
      }
    ],
    "legendary": [
      {
        "name": "Detect",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "2d6+9",
        "type": "钝击",
        "extra": "The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 24 Dexterity saving throw or take 16 (2d6 + 9) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
      }
    ]
  },
  "远古黄铜龙": {
    "en": "Ancient Brass Dragon",
    "size": "巨型",
    "type": "龙",
    "alignment": "混乱善良",
    "ac": 20,
    "ac_note": "natural",
    "hp": "297 (17d20)",
    "speed": "40 ft., 掘地 40 ft., 飞行 80 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "火"
    ],
    "senses": "{'盲视': '60 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 24}",
    "languages": "通用语, 龙语",
    "cr": "20",
    "traits": [
      [
        "Legendary Resistance",
        "If the dragon fails a saving throw, it can choose to succeed instead."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 14,
        "reach": "15 ft",
        "dmg": "2d10+8",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +14 to hit, reach 15 ft., one target. Hit: 19 (2d10 + 8) piercing damage."
      },
      {
        "name": "Claw",
        "atk": 14,
        "reach": "10 ft",
        "dmg": "2d6+8",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 15 (2d6 + 8) slashing damage."
      },
      {
        "name": "Tail",
        "atk": 14,
        "reach": "20 ft",
        "dmg": "2d8+8",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +14 to hit, reach 20 ft., one target. Hit: 17 (2d8 + 8) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 18 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours."
      },
      {
        "name": "Breath Weapons",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon uses one of the following breath weapons:\nFire Breath. The dragon exhales fire in an 90-foot line that is 10 feet wide. Each creature in that line must make a DC 21 Dexterity saving throw, taking 56 (16d6) fire damage on a failed save, or half as much damage on a successful one.\nSleep Breath. The dragon exhales sleep gas in a 90-foot cone. Each creature in that area must succeed on a DC 21 Constitution saving throw or fall unconscious for 10 minutes. This effect ends for a creature if the creature takes damage or someone uses an action to wake it."
      },
      {
        "name": "Change Shape",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon's choice).\nIn a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Legendary Resistance, lair actions, and Intelligence, Wisdom, and Charisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form."
      }
    ],
    "legendary": [
      {
        "name": "Detect",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "2d6+8",
        "type": "钝击",
        "extra": "The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 22 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
      }
    ]
  },
  "远古青铜龙": {
    "en": "Ancient Bronze Dragon",
    "size": "巨型",
    "type": "龙",
    "alignment": "守序善良",
    "ac": 22,
    "ac_note": "natural",
    "hp": "444 (24d20)",
    "speed": "40 ft., 飞行 80 ft., 游泳 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "电"
    ],
    "senses": "{'盲视': '60 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 27}",
    "languages": "通用语, 龙语",
    "cr": "22",
    "traits": [
      [
        "Amphibious",
        "The dragon can breathe air and water."
      ],
      [
        "Legendary Resistance",
        "If the dragon fails a saving throw, it can choose to succeed instead."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 16,
        "reach": "15 ft",
        "dmg": "2d10+9",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +16 to hit, reach 15 ft., one target. Hit: 20 (2d10 + 9) piercing damage."
      },
      {
        "name": "Claw",
        "atk": 16,
        "reach": "10 ft",
        "dmg": "2d6+9",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +16 to hit, reach 10 ft., one target. Hit: 16 (2d6 + 9) slashing damage."
      },
      {
        "name": "Tail",
        "atk": 16,
        "reach": "20 ft",
        "dmg": "2d8+9",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +16 to hit, reach 20 ft., one target. Hit: 18 (2d8 + 9) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 20 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours."
      },
      {
        "name": "Breath Weapons",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon uses one of the following breath weapons.\nLightning Breath. The dragon exhales lightning in a 120-foot line that is 10 feet wide. Each creature in that line must make a DC 23 Dexterity saving throw, taking 88 (16d10) lightning damage on a failed save, or half as much damage on a successful one.\nRepulsion Breath. The dragon exhales repulsion energy in a 30-foot cone. Each creature in that area must succeed on a DC 23 Strength saving throw. On a failed save, the creature is pushed 60 feet away from the dragon."
      },
      {
        "name": "Change Shape",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon's choice).\nIn a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Legendary Resistance, lair actions, and Intelligence, Wisdom, and Charisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form."
      }
    ],
    "legendary": [
      {
        "name": "Detect",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "2d6+9",
        "type": "钝击",
        "extra": "The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 24 Dexterity saving throw or take 16 (2d6 + 9) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
      }
    ]
  },
  "远古红铜龙": {
    "en": "Ancient Copper Dragon",
    "size": "巨型",
    "type": "龙",
    "alignment": "混乱善良",
    "ac": 21,
    "ac_note": "natural",
    "hp": "350 (20d20)",
    "speed": "40 ft., 爬 40 ft., 飞行 80 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "酸"
    ],
    "senses": "{'盲视': '60 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 27}",
    "languages": "通用语, 龙语",
    "cr": "21",
    "traits": [
      [
        "Legendary Resistance",
        "If the dragon fails a saving throw, it can choose to succeed instead."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 15,
        "reach": "15 ft",
        "dmg": "2d10+8",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +15 to hit, reach 15 ft., one target. Hit: 19 (2d10 + 8) piercing damage."
      },
      {
        "name": "Claw",
        "atk": 15,
        "reach": "10 ft",
        "dmg": "2d6+8",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +15 to hit, reach 10 ft., one target. Hit: 15 (2d6 + 8) slashing damage."
      },
      {
        "name": "Tail",
        "atk": 15,
        "reach": "20 ft",
        "dmg": "2d8+8",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +15 to hit, reach 20 ft., one target. Hit: 17 (2d8 + 8) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours."
      },
      {
        "name": "Breath Weapons",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon uses one of the following breath weapons.\nAcid Breath. The dragon exhales acid in an 90-foot line that is 10 feet wide. Each creature in that line must make a DC 22 Dexterity saving throw, taking 63 (14d8) acid damage on a failed save, or half as much damage on a successful one.\nSlowing Breath. The dragon exhales gas in a 90-foot cone. Each creature in that area must succeed on a DC 22 Constitution saving throw. On a failed save, the creature can't use reactions, its speed is halved, and it can't make more than one attack on its turn. In addition, the creature can use either an action or a bonus action on its turn, but not both. These effects last for 1 minute. The creature can repeat the saving throw at the end of each of its turns, ending the effect on itself with a successful save."
      },
      {
        "name": "Change Shape",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon's choice).\nIn a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Legendary Resistance, lair actions, and Intelligence, Wisdom, and Charisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form."
      }
    ],
    "legendary": [
      {
        "name": "Detect",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "2d6+8",
        "type": "钝击",
        "extra": "The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 23 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
      }
    ]
  },
  "远古金龙": {
    "en": "Ancient Gold Dragon",
    "size": "巨型",
    "type": "龙",
    "alignment": "守序善良",
    "ac": 22,
    "ac_note": "natural",
    "hp": "546 (28d20)",
    "speed": "40 ft., 飞行 80 ft., 游泳 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "火"
    ],
    "senses": "{'盲视': '60 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 27}",
    "languages": "通用语, 龙语",
    "cr": "24",
    "traits": [
      [
        "Amphibious",
        "The dragon can breathe air and water."
      ],
      [
        "Legendary Resistance",
        "If the dragon fails a saving throw, it can choose to succeed instead."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 17,
        "reach": "15 ft",
        "dmg": "2d10+10",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +17 to hit, reach 15 ft., one target. Hit: 21 (2d10 + 10) piercing damage."
      },
      {
        "name": "Claw",
        "atk": 17,
        "reach": "10 ft",
        "dmg": "2d6+10",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +17 to hit, reach 10 ft., one target. Hit: 17 (2d6 + 10) slashing damage."
      },
      {
        "name": "Tail",
        "atk": 17,
        "reach": "20 ft",
        "dmg": "2d8+10",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +17 to hit, reach 20 ft., one target. Hit: 19 (2d8 + 10) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 24 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours."
      },
      {
        "name": "Breath Weapons",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon uses one of the following breath weapons.\nFire Breath. The dragon exhales fire in a 90-foot cone. Each creature in that area must make a DC 24 Dexterity saving throw, taking 71 (13d10) fire damage on a failed save, or half as much damage on a successful one.\nWeakening Breath. The dragon exhales gas in a 90-foot cone. Each creature in that area must succeed on a DC 24 Strength saving throw or have disadvantage on Strength-based attack rolls, Strength checks, and Strength saving throws for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      },
      {
        "name": "Change Shape",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon's choice).\nIn a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Legendary Resistance, lair actions, and Intelligence, Wisdom, and Charisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form."
      }
    ],
    "legendary": [
      {
        "name": "Detect",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "2d6+10",
        "type": "钝击",
        "extra": "The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 25 Dexterity saving throw or take 17 (2d6 + 10) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
      }
    ]
  },
  "远古绿龙": {
    "en": "Ancient Green Dragon",
    "size": "巨型",
    "type": "龙",
    "alignment": "守序邪恶",
    "ac": 21,
    "ac_note": "natural",
    "hp": "385 (22d20)",
    "speed": "40 ft., 飞行 80 ft., 游泳 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "毒"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'盲视': '60 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 27}",
    "languages": "通用语, 龙语",
    "cr": "22",
    "traits": [
      [
        "Amphibious",
        "The dragon can breathe air and water."
      ],
      [
        "Legendary Resistance",
        "If the dragon fails a saving throw, it can choose to succeed instead."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 15,
        "reach": "15 ft",
        "dmg": "2d10+8",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +15 to hit, reach 15 ft., one target. Hit: 19 (2d10 + 8) piercing damage plus 10 (3d6) poison damage."
      },
      {
        "name": "Claw",
        "atk": 15,
        "reach": "10 ft",
        "dmg": "4d6+8",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +15 to hit, reach 10 ft., one target. Hit: 22 (4d6 + 8) slashing damage."
      },
      {
        "name": "Tail",
        "atk": 15,
        "reach": "20 ft",
        "dmg": "2d8+8",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +15 to hit, reach 20 ft., one target. Hit: 17 (2d8 + 8) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours."
      },
      {
        "name": "Poison Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "22d6",
        "type": "毒",
        "extra": "The dragon exhales poisonous gas in a 90-foot cone. Each creature in that area must make a DC 22 Constitution saving throw, taking 77 (22d6) poison damage on a failed save, or half as much damage on a successful one."
      }
    ],
    "legendary": [
      {
        "name": "Detect",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "2d6+8",
        "type": "钝击",
        "extra": "The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 23 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
      }
    ]
  },
  "远古红龙": {
    "en": "Ancient Red Dragon",
    "size": "巨型",
    "type": "龙",
    "alignment": "混乱邪恶",
    "ac": 22,
    "ac_note": "natural",
    "hp": "546 (28d20)",
    "speed": "40 ft., 爬 40 ft., 飞行 80 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "火"
    ],
    "senses": "{'盲视': '60 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 26}",
    "languages": "通用语, 龙语",
    "cr": "24",
    "traits": [
      [
        "Legendary Resistance",
        "If the dragon fails a saving throw, it can choose to succeed instead."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 17,
        "reach": "15 ft",
        "dmg": "2d10+10",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +17 to hit, reach 15 ft., one target. Hit: 21 (2d10 + 10) piercing damage plus 14 (4d6) fire damage."
      },
      {
        "name": "Claw",
        "atk": 17,
        "reach": "10 ft",
        "dmg": "2d6+10",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +17 to hit, reach 10 ft., one target. Hit: 17 (2d6 + 10) slashing damage."
      },
      {
        "name": "Tail",
        "atk": 17,
        "reach": "20 ft",
        "dmg": "2d8+10",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +17 to hit, reach 20 ft., one target. Hit: 19 (2d8 + 10) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 21 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours."
      },
      {
        "name": "Fire Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "26d6",
        "type": "火",
        "extra": "The dragon exhales fire in a 90-foot cone. Each creature in that area must make a DC 24 Dexterity saving throw, taking 91 (26d6) fire damage on a failed save, or half as much damage on a successful one."
      }
    ],
    "legendary": [
      {
        "name": "Detect",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "2d6+10",
        "type": "钝击",
        "extra": "The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 25 Dexterity saving throw or take 17 (2d6 + 10) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
      }
    ]
  },
  "远古银龙": {
    "en": "Ancient Silver Dragon",
    "size": "巨型",
    "type": "龙",
    "alignment": "守序善良",
    "ac": 22,
    "ac_note": "natural",
    "hp": "487 (25d20)",
    "speed": "40 ft., 飞行 80 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "冷"
    ],
    "senses": "{'盲视': '60 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 26}",
    "languages": "通用语, 龙语",
    "cr": "23",
    "traits": [
      [
        "Legendary Resistance",
        "If the dragon fails a saving throw, it can choose to succeed instead."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 17,
        "reach": "15 ft",
        "dmg": "2d10+10",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +17 to hit, reach 15 ft., one target. Hit: 21 (2d10 + 10) piercing damage."
      },
      {
        "name": "Claw",
        "atk": 17,
        "reach": "10 ft",
        "dmg": "2d6+10",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +17 to hit, reach 10 ft., one target. Hit: 17 (2d6 + 10) slashing damage."
      },
      {
        "name": "Tail",
        "atk": 17,
        "reach": "20 ft",
        "dmg": "2d8+10",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +17 to hit, reach 20 ft., one target. Hit: 19 (2d8 + 10) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 21 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours."
      },
      {
        "name": "Breath Weapons",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon uses one of the following breath weapons.\nCold Breath. The dragon exhales an icy blast in a 90-foot cone. Each creature in that area must make a DC 24 Constitution saving throw, taking 67 (15d8) cold damage on a failed save, or half as much damage on a successful one.\nParalyzing Breath. The dragon exhales paralyzing gas in a 90-foot cone. Each creature in that area must succeed on a DC 24 Constitution saving throw or be paralyzed for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      },
      {
        "name": "Change Shape",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon's choice).\nIn a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Legendary Resistance, lair actions, and Intelligence, Wisdom, and Charisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form."
      }
    ],
    "legendary": [
      {
        "name": "Detect",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "2d6+10",
        "type": "钝击",
        "extra": "The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 25 Dexterity saving throw or take 17 (2d6 + 10) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
      }
    ]
  },
  "远古白龙": {
    "en": "Ancient White Dragon",
    "size": "巨型",
    "type": "龙",
    "alignment": "混乱邪恶",
    "ac": 20,
    "ac_note": "natural",
    "hp": "333 (18d20)",
    "speed": "40 ft., 掘地 40 ft., 飞行 80 ft., 游泳 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "冷"
    ],
    "senses": "{'盲视': '60 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 23}",
    "languages": "通用语, 龙语",
    "cr": "20",
    "traits": [
      [
        "Ice Walk",
        "The dragon can move across and climb icy surfaces without needing to make an ability check. Additionally, difficult terrain composed of ice or snow doesn't cost it extra movement."
      ],
      [
        "Legendary Resistance",
        "If the dragon fails a saving throw, it can choose to succeed instead."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 14,
        "reach": "15 ft",
        "dmg": "2d10+8",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +14 to hit, reach 15 ft., one target. Hit: 19 (2d10 + 8) piercing damage plus 9 (2d8) cold damage."
      },
      {
        "name": "Claw",
        "atk": 14,
        "reach": "10 ft",
        "dmg": "2d6+8",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 15 (2d6 + 8) slashing damage."
      },
      {
        "name": "Tail",
        "atk": 14,
        "reach": "20 ft",
        "dmg": "2d8+8",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +14 to hit, reach 20 ft., one target. Hit: 17 (2d8 + 8) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours ."
      },
      {
        "name": "Cold Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "16d8",
        "type": "冷",
        "extra": "The dragon exhales an icy blast in a 90-foot cone. Each creature in that area must make a DC 22 Constitution saving throw, taking 72 (16d8) cold damage on a failed save, or half as much damage on a successful one."
      }
    ],
    "legendary": [
      {
        "name": "Detect",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "2d6+8",
        "type": "钝击",
        "extra": "The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 22 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
      }
    ]
  },
  "男面斯芬克斯": {
    "en": "Androsphinx",
    "size": "大型",
    "type": "怪兽",
    "alignment": "守序中立",
    "ac": 17,
    "ac_note": "natural",
    "hp": "199 (19d10)",
    "speed": "40 ft., 飞行 60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "心灵",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "cond_immune": [
      "魅惑",
      "惊惧"
    ],
    "senses": "{'真实视觉': '120 ft.', 'passive_perception': 20}",
    "languages": "通用语, Sphinx",
    "cr": "17",
    "traits": [
      [
        "Inscrutable",
        "The sphinx is immune to any effect that would sense its emotions or read its thoughts, as well as any divination spell that it refuses. Wisdom (Insight) checks made to ascertain the sphinx's intentions or sincerity have disadvantage."
      ],
      [
        "Magic Weapons",
        "The sphinx's weapon attacks are magical."
      ],
      [
        "Spellcasting",
        "The sphinx is a 12th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 18, +10 to hit with spell attacks). It requires no material components to cast its spells. The sphinx has the following cleric spells prepared:\n\n- Cantrips (at will): sacred flame, spare the dying, thaumaturgy\n- 1st level (4 slots): command, detect evil and good, detect magic\n- 2nd level (3 slots): lesser restoration, zone of truth\n- 3rd level (3 slots): dispel magic, tongues\n- 4th level (3 slots): banishment, freedom of movement\n- 5th level (2 slots): flame strike, greater restoration\n- 6th level (1 slot): heroes' feast"
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The sphinx makes two claw attacks."
      },
      {
        "name": "Claw",
        "atk": 12,
        "reach": "5 ft",
        "dmg": "2d10+6",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +12 to hit, reach 5 ft., one target. Hit: 17 (2d10 + 6) slashing damage."
      },
      {
        "name": "Roar",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The sphinx emits a magical roar. Each time it roars before finishing a long rest, the roar is louder and the effect is different, as detailed below. Each creature within 500 feet of the sphinx and able to hear the roar must make a saving throw.\n\nFirst Roar. Each creature that fails a DC 18 Wisdom saving throw is frightened for 1 minute. A frightened creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.\n\nSecond Roar. Each creature that fails a DC 18 Wisdom saving throw is deafened and frightened for 1 minute. A frightened creature is paralyzed and can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.\n\nThird Roar. Each creature makes a DC 18 Constitution saving throw. On a failed save, a creature takes 44 (8d10) thunder damage and is knocked prone. On a successful save, the creature takes half as much damage and isn't knocked prone."
      }
    ],
    "legendary": [
      {
        "name": "Claw Attack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The sphinx makes one claw attack."
      },
      {
        "name": "Teleport (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The sphinx magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see."
      },
      {
        "name": "Cast a Spell (Costs 3 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The sphinx casts a spell from its list of prepared spells, using a spell slot as normal."
      }
    ]
  },
  "活化护甲": {
    "en": "Animated Armor",
    "size": "中型",
    "type": "构装",
    "alignment": "无",
    "ac": 18,
    "ac_note": "natural",
    "hp": "33 (6d8)",
    "speed": "25 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "毒",
      "心灵"
    ],
    "cond_immune": [
      "目盲",
      "魅惑",
      "耳聋",
      "力竭",
      "惊惧",
      "麻痹",
      "石化",
      "中毒"
    ],
    "senses": "{'盲视': '60 ft. (blind beyond this radius)', 'passive_perception': 6}",
    "languages": "—",
    "cr": "1",
    "traits": [
      [
        "Antimagic Susceptibility",
        "The armor is incapacitated while in the area of an antimagic field. If targeted by dispel magic, the armor must succeed on a Constitution saving throw against the caster's spell save DC or fall unconscious for 1 minute."
      ],
      [
        "False Appearance",
        "While the armor remains motionless, it is indistinguishable from a normal suit of armor."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The armor makes two melee attacks."
      },
      {
        "name": "Slam",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d6+2",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) bludgeoning damage."
      }
    ]
  },
  "掘地虫": {
    "en": "Ankheg",
    "size": "大型",
    "type": "怪兽",
    "alignment": "无",
    "ac": 14,
    "ac_note": "natural",
    "hp": "39 (6d10)",
    "speed": "30 ft., 掘地 10 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', '震颤感知': '60 ft.', 'passive_perception': 11}",
    "languages": "—",
    "cr": "2",
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "2d6+3",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) slashing damage plus 3 (1d6) acid damage. If the target is a Large or smaller creature, it is grappled (escape DC 13). Until this grapple ends, the ankheg can bite only the grappled creature and has advantage on attack rolls to do so."
      },
      {
        "name": "Acid Spray",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "3d6",
        "type": "酸",
        "extra": "The ankheg spits acid in a line that is 30 ft. long and 5 ft. wide, provided that it has no creature grappled. Each creature in that line must make a DC 13 Dexterity saving throw, taking 10 (3d6) acid damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "猿": {
    "en": "Ape",
    "size": "中型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "dex",
    "hp": "19 (3d8)",
    "speed": "30 ft., 爬 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 13}",
    "languages": "—",
    "cr": "1/2",
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The ape makes two fist attacks."
      },
      {
        "name": "Fist",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d6+3",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) bludgeoning damage."
      },
      {
        "name": "Rock",
        "atk": 5,
        "reach": "25/50 ft",
        "dmg": "1d6+3",
        "type": "钝击",
        "extra": "Ranged Weapon Attack: +5 to hit, range 25/50 ft., one target. Hit: 6 (1d6 + 3) bludgeoning damage."
      }
    ]
  },
  "大法师": {
    "en": "Archmage",
    "size": "中型",
    "type": "类人妖",
    "alignment": "任意",
    "ac": 12,
    "ac_note": "dex",
    "hp": "99 (18d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "damage",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "senses": "{'passive_perception': 12}",
    "languages": "any six languages",
    "cr": "12",
    "traits": [
      [
        "Magic Resistance",
        "The archmage has advantage on saving throws against spells and other magical effects."
      ],
      [
        "Spellcasting",
        "The archmage is an 18th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 17, +9 to hit with spell attacks). The archmage can cast disguise self and invisibility at will and has the following wizard spells prepared:\n\n- Cantrips (at will): fire bolt, light, mage hand, prestidigitation, shocking grasp\n- 1st level (4 slots): detect magic, identify, mage armor*, magic missile\n- 2nd level (3 slots): detect thoughts, mirror image, misty step\n- 3rd level (3 slots): counterspell, fly, lightning bolt\n- 4th level (3 slots): banishment, fire shield, stoneskin*\n- 5th level (3 slots): cone of cold, scrying, wall of force\n- 6th level (1 slot): globe of invulnerability\n- 7th level (1 slot): teleport\n- 8th level (1 slot): mind blank*\n- 9th level (1 slot): time stop\n* The archmage casts these spells on itself before combat."
      ]
    ],
    "actions": [
      {
        "name": "Dagger",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "1d4+2",
        "type": "穿刺",
        "extra": "Melee or Ranged Weapon Attack: +6 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 4 (1d4 + 2) piercing damage."
      }
    ]
  },
  "刺客": {
    "en": "Assassin",
    "size": "中型",
    "type": "类人妖",
    "alignment": "任意非善良",
    "ac": 15,
    "ac_note": "Studded Leather Armor",
    "hp": "78 (12d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "毒"
    ],
    "senses": "{'passive_perception': 13}",
    "languages": "Thieves' cant plus any two languages",
    "cr": "8",
    "traits": [
      [
        "Assassinate",
        "During its first turn, the assassin has advantage on attack rolls against any creature that hasn't taken a turn. Any hit the assassin scores against a surprised creature is a critical hit."
      ],
      [
        "Evasion",
        "If the assassin is subjected to an effect that allows it to make a Dexterity saving throw to take only half damage, the assassin instead takes no damage if it succeeds on the saving throw, and only half damage if it fails."
      ],
      [
        "Sneak Attack (1/Turn)",
        "The assassin deals an extra 13 (4d6) damage when it hits a target with a weapon attack and has advantage on the attack roll, or when the target is within 5 ft. of an ally of the assassin that isn't incapacitated and the assassin doesn't have disadvantage on the attack roll."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The assassin makes two shortsword attacks."
      },
      {
        "name": "Shortsword",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "1d6+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) piercing damage, and the target must make a DC 15 Constitution saving throw, taking 24 (7d6) poison damage on a failed save, or half as much damage on a successful one."
      },
      {
        "name": "Light Crossbow",
        "atk": 6,
        "reach": "80/320 ft",
        "dmg": "1d8+3",
        "type": "穿刺",
        "extra": "Ranged Weapon Attack: +6 to hit, range 80/320 ft., one target. Hit: 7 (1d8 + 3) piercing damage, and the target must make a DC 15 Constitution saving throw, taking 24 (7d6) poison damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "启蒙灌木": {
    "en": "Awakened Shrub",
    "size": "小型",
    "type": "植物",
    "alignment": "无",
    "ac": 9,
    "ac_note": "dex",
    "hp": "10 (3d6)",
    "speed": "20 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "穿刺"
    ],
    "vuln": [
      "火"
    ],
    "senses": "{'passive_perception': 10}",
    "languages": "one language known by its creator",
    "cr": "0",
    "traits": [
      [
        "False Appearance",
        "While the shrub remains motionless, it is indistinguishable from a normal shrub."
      ]
    ],
    "actions": [
      {
        "name": "Rake",
        "atk": 1,
        "reach": "5 ft",
        "dmg": "1d4-1",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +1 to hit, reach 5 ft., one target. Hit: 1 (1d4 - 1) slashing damage."
      }
    ]
  },
  "启蒙树木": {
    "en": "Awakened Tree",
    "size": "超大型",
    "type": "植物",
    "alignment": "无",
    "ac": 13,
    "ac_note": "natural",
    "hp": "59 (7d12)",
    "speed": "20 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "钝击",
      "穿刺"
    ],
    "vuln": [
      "火"
    ],
    "senses": "{'passive_perception': 10}",
    "languages": "one language known by its creator",
    "cr": "2",
    "traits": [
      [
        "False Appearance",
        "While the tree remains motionless, it is indistinguishable from a normal tree."
      ]
    ],
    "actions": [
      {
        "name": "Slam",
        "atk": 6,
        "reach": "10 ft",
        "dmg": "3d6+4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +6 to hit, reach 10 ft., one target. Hit: 14 (3d6 + 4) bludgeoning damage."
      }
    ]
  },
  "斧嘴鸟们": {
    "en": "Axe Beak",
    "size": "大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 11,
    "ac_note": "dex",
    "hp": "19 (3d10)",
    "speed": "50 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 10}",
    "languages": "—",
    "cr": "1/4",
    "traits": [],
    "actions": [
      {
        "name": "Beak",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d8+2",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8 + 2) slashing damage."
      }
    ]
  },
  "火矮人们": {
    "en": "Azer",
    "size": "中型",
    "type": "元素",
    "alignment": "守序中立",
    "ac": 15,
    "ac_note": "natural",
    "hp": "39 (6d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "火",
      "毒"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'passive_perception': 11}",
    "languages": "火族语",
    "cr": "2",
    "traits": [
      [
        "Heated Body",
        "A creature that touches the azer or hits it with a melee attack while within 5 ft. of it takes 5 (1d10) fire damage."
      ],
      [
        "Heated Weapons",
        "When the azer hits with a metal melee weapon, it deals an extra 3 (1d6) fire damage (included in the attack)."
      ],
      [
        "Illumination",
        "The azer sheds bright light in a 10-foot radius and dim light for an additional 10 ft.."
      ]
    ],
    "actions": [
      {
        "name": "Warhammer",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d8+3",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) bludgeoning damage, or 8 (1d10 + 3) bludgeoning damage if used with two hands to make a melee attack, plus 3 (1d6) fire damage."
      }
    ]
  },
  "狒狒": {
    "en": "Baboon",
    "size": "小型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "dex",
    "hp": "3 (1d6)",
    "speed": "30 ft., 爬 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 11}",
    "languages": "—",
    "cr": "0",
    "traits": [
      [
        "Pack Tactics",
        "The baboon has advantage on an attack roll against a creature if at least one of the baboon's allies is within 5 ft. of the creature and the ally isn't incapacitated."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 1,
        "reach": "5 ft",
        "dmg": "1d4-1",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +1 to hit, reach 5 ft., one target. Hit: 1 (1d4 - 1) piercing damage."
      }
    ]
  },
  "獾": {
    "en": "Badger",
    "size": "超小型",
    "type": "野兽",
    "alignment": "无",
    "ac": 10,
    "ac_note": "dex",
    "hp": "3 (1d4)",
    "speed": "20 ft., 掘地 5 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '30 ft.', 'passive_perception': 11}",
    "languages": "—",
    "cr": "0",
    "traits": [
      [
        "Keen Smell",
        "The badger has advantage on Wisdom (Perception) checks that rely on smell."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 2,
        "reach": "5 ft",
        "dmg": "1",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 1 piercing damage."
      }
    ]
  },
  "巴洛炎魔": {
    "en": "Balor",
    "size": "超大型",
    "type": "邪魔",
    "alignment": "混乱邪恶",
    "ac": 19,
    "ac_note": "natural",
    "hp": "262 (21d12)",
    "speed": "40 ft., 飞行 80 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "冷",
      "电",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "火",
      "毒"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'真实视觉': '120 ft.', 'passive_perception': 13}",
    "languages": "深渊语, telepathy 120 ft.",
    "cr": "19",
    "traits": [
      [
        "Death Throes",
        "When the balor dies, it explodes, and each creature within 30 feet of it must make a DC 20 Dexterity saving throw, taking 70 (20d6) fire damage on a failed save, or half as much damage on a successful one. The explosion ignites flammable objects in that area that aren't being worn or carried, and it destroys the balor's weapons."
      ],
      [
        "Fire Aura",
        "At the start of each of the balor's turns, each creature within 5 feet of it takes 10 (3d6) fire damage, and flammable objects in the aura that aren't being worn or carried ignite. A creature that touches the balor or hits it with a melee attack while within 5 feet of it takes 10 (3d6) fire damage."
      ],
      [
        "Magic Resistance",
        "The balor has advantage on saving throws against spells and other magical effects."
      ],
      [
        "Magic Weapons",
        "The balor's weapon attacks are magical."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The balor makes two attacks: one with its longsword and one with its whip."
      },
      {
        "name": "Longsword",
        "atk": 14,
        "reach": "10 ft",
        "dmg": "3d8+8",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 21 (3d8 + 8) slashing damage plus 13 (3d8) lightning damage. If the balor scores a critical hit, it rolls damage dice three times, instead of twice."
      },
      {
        "name": "Whip",
        "atk": 14,
        "reach": "30 ft",
        "dmg": "2d6+8",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +14 to hit, reach 30 ft., one target. Hit: 15 (2d6 + 8) slashing damage plus 10 (3d6) fire damage, and the target must succeed on a DC 20 Strength saving throw or be pulled up to 25 feet toward the balor."
      },
      {
        "name": "Teleport",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The balor magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see."
      }
    ]
  },
  "强盗": {
    "en": "Bandit",
    "size": "中型",
    "type": "类人妖",
    "alignment": "任意非守序",
    "ac": 12,
    "ac_note": "Leather Armor",
    "hp": "11 (2d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 10}",
    "languages": "any one language (usually Common)",
    "cr": "1/8",
    "traits": [],
    "actions": [
      {
        "name": "Scimitar",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "1d6+1",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) slashing damage."
      },
      {
        "name": "Light Crossbow",
        "atk": 3,
        "reach": "80/320 ft",
        "dmg": "1d8+1",
        "type": "穿刺",
        "extra": "Ranged Weapon Attack: +3 to hit, range 80/320 ft., one target. Hit: 5 (1d8 + 1) piercing damage."
      }
    ]
  },
  "强盗头目": {
    "en": "Bandit Captain",
    "size": "中型",
    "type": "类人妖",
    "alignment": "任意非守序",
    "ac": 15,
    "ac_note": "Studded Leather Armor",
    "hp": "65 (10d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 10}",
    "languages": "any two languages",
    "cr": "2",
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The captain makes three melee attacks: two with its scimitar and one with its dagger. Or the captain makes two ranged attacks with its daggers."
      },
      {
        "name": "Scimitar",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d6+3",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) slashing damage."
      },
      {
        "name": "Dagger",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d4+3",
        "type": "穿刺",
        "extra": "Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 5 (1d4 + 3) piercing damage."
      }
    ],
    "reactions": [
      {
        "name": "Parry",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The captain adds 2 to its AC against one melee attack that would hit it. To do so, the captain must see the attacker and be wielding a melee weapon."
      }
    ]
  },
  "胡须魔鬼": {
    "en": "Barbed Devil",
    "size": "中型",
    "type": "邪魔",
    "alignment": "守序邪恶",
    "ac": 15,
    "ac_note": "natural",
    "hp": "110 (13d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "冷",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "火",
      "毒"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 18}",
    "languages": "炼狱语, telepathy 120 ft.",
    "cr": "5",
    "traits": [
      [
        "Barbed Hide",
        "At the start of each of its turns, the barbed devil deals 5 (1d10) piercing damage to any creature grappling it."
      ],
      [
        "Devil's Sight",
        "Magical darkness doesn't impede the devil's darkvision."
      ],
      [
        "Magic Resistance",
        "The devil has advantage on saving throws against spells and other magical effects."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The devil makes three melee attacks: one with its tail and two with its claws. Alternatively, it can use Hurl Flame twice."
      },
      {
        "name": "Claw",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "1d6+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) piercing damage."
      },
      {
        "name": "Tail",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d6+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) piercing damage."
      },
      {
        "name": "Hurl Flame",
        "atk": 5,
        "reach": "150 ft",
        "dmg": "3d6",
        "type": "火",
        "extra": "Ranged Spell Attack: +5 to hit, range 150 ft., one target. Hit: 10 (3d6) fire damage. If the target is a flammable object that isn't being worn or carried, it also catches fire."
      }
    ]
  },
  "石化蜥蜴": {
    "en": "Basilisk",
    "size": "中型",
    "type": "怪兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "natural",
    "hp": "52 (8d8)",
    "speed": "20 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 9}",
    "languages": "—",
    "cr": "3",
    "traits": [
      [
        "Petrifying Gaze",
        "If a creature starts its turn within 30 ft. of the basilisk and the two of them can see each other, the basilisk can force the creature to make a DC 12 Constitution saving throw if the basilisk isn't incapacitated. On a failed save, the creature magically begins to turn to stone and is restrained. It must repeat the saving throw at the end of its next turn. On a success, the effect ends. On a failure, the creature is petrified until freed by the greater restoration spell or other magic.\nA creature that isn't surprised can avert its eyes to avoid the saving throw at the start of its turn. If it does so, it can't see the basilisk until the start of its next turn, when it can avert its eyes again. If it looks at the basilisk in the meantime, it must immediately make the save.\nIf the basilisk sees its reflection within 30 ft. of it in bright light, it mistakes itself for a rival and targets itself with its gaze."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "2d6+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) piercing damage plus 7 (2d6) poison damage."
      }
    ]
  },
  "蝙蝠": {
    "en": "Bat",
    "size": "超小型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "dex",
    "hp": "1 (1d4)",
    "speed": "5 ft., 飞行 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'盲视': '60 ft.', 'passive_perception': 11}",
    "languages": "—",
    "cr": "0",
    "traits": [
      [
        "Echolocation",
        "The bat can't use its blindsight while deafened."
      ],
      [
        "Keen Hearing",
        "The bat has advantage on Wisdom (Perception) checks that rely on hearing."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "1",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +0 to hit, reach 5 ft., one creature. Hit: 1 piercing damage."
      }
    ]
  },
  "须魔": {
    "en": "Bearded Devil",
    "size": "中型",
    "type": "邪魔",
    "alignment": "守序邪恶",
    "ac": 13,
    "ac_note": "natural",
    "hp": "52 (8d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "冷",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "火",
      "毒"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 10}",
    "languages": "炼狱语, telepathy 120 ft.",
    "cr": "3",
    "traits": [
      [
        "Devil's Sight",
        "Magical darkness doesn't impede the devil's darkvision."
      ],
      [
        "Magic Resistance",
        "The devil has advantage on saving throws against spells and other magical effects."
      ],
      [
        "Steadfast",
        "The devil can't be frightened while it can see an allied creature within 30 feet of it."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The devil makes two attacks: one with its beard and one with its glaive."
      },
      {
        "name": "Beard",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d8+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one creature. Hit: 6 (1d8 + 2) piercing damage, and the target must succeed on a DC 12 Constitution saving throw or be poisoned for 1 minute. While poisoned in this way, the target can't regain hit points. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      },
      {
        "name": "Glaive",
        "atk": 5,
        "reach": "10 ft",
        "dmg": "1d10+3",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +5 to hit, reach 10 ft., one target. Hit: 8 (1d10 + 3) slashing damage. If the target is a creature other than an undead or a construct, it must succeed on a DC 12 Constitution saving throw or lose 5 (1d10) hit points at the start of each of its turns due to an infernal wound. Each time the devil hits the wounded target with this attack, the damage dealt by the wound increases by 5 (1d10). Any creature can take an action to stanch the wound with a successful DC 12 Wisdom (Medicine) check. The wound also closes if the target receives magical healing."
      }
    ]
  },
  "青足龙蛇": {
    "en": "Behir",
    "size": "超大型",
    "type": "怪兽",
    "alignment": "中立邪恶",
    "ac": 17,
    "ac_note": "natural",
    "hp": "168 (16d12)",
    "speed": "50 ft., 爬 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "电"
    ],
    "senses": "{'黑暗视觉': '90 ft.', 'passive_perception': 16}",
    "languages": "龙语",
    "cr": "11",
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The behir makes two attacks: one with its bite and one to constrict."
      },
      {
        "name": "Bite",
        "atk": 10,
        "reach": "10 ft",
        "dmg": "3d10+6",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 22 (3d10 + 6) piercing damage."
      },
      {
        "name": "Constrict",
        "atk": 10,
        "reach": "5 ft",
        "dmg": "2d10+6",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +10 to hit, reach 5 ft., one Large or smaller creature. Hit: 17 (2d10 + 6) bludgeoning damage plus 17 (2d10 + 6) slashing damage. The target is grappled (escape DC 16) if the behir isn't already constricting a creature, and the target is restrained until this grapple ends."
      },
      {
        "name": "Lightning Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "12d10",
        "type": "电",
        "extra": "The behir exhales a line of lightning that is 20 ft. long and 5 ft. wide. Each creature in that line must make a DC 16 Dexterity saving throw, taking 66 (12d10) lightning damage on a failed save, or half as much damage on a successful one."
      },
      {
        "name": "Swallow",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "6d6",
        "type": "酸",
        "extra": "The behir makes one bite attack against a Medium or smaller target it is grappling. If the attack hits, the target is also swallowed, and the grapple ends. While swallowed, the target is blinded and restrained, it has total cover against attacks and other effects outside the behir, and it takes 21 (6d6) acid damage at the start of each of the behir's turns. A behir can have only one creature swallowed at a time.\nIf the behir takes 30 damage or more on a single turn from the swallowed creature, the behir must succeed on a DC 14 Constitution saving throw at the end of that turn or regurgitate the creature, which falls prone in a space within 10 ft. of the behir. If the behir dies, a swallowed creature is no longer restrained by it and can escape from the corpse by using 15 ft. of movement, exiting prone."
      }
    ]
  },
  "狂战士们": {
    "en": "Berserker",
    "size": "中型",
    "type": "类人妖",
    "alignment": "任意混乱",
    "ac": 13,
    "ac_note": "Hide Armor",
    "hp": "67 (9d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 10}",
    "languages": "any one language (usually Common)",
    "cr": "2",
    "traits": [
      [
        "Reckless",
        "At the start of its turn, the berserker can gain advantage on all melee weapon attack rolls during that turn, but attack rolls against it have advantage until the start of its next turn."
      ]
    ],
    "actions": [
      {
        "name": "Greataxe",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d12+3",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9 (1d12 + 3) slashing damage."
      }
    ]
  },
  "黑熊": {
    "en": "Black Bear",
    "size": "中型",
    "type": "野兽",
    "alignment": "无",
    "ac": 11,
    "ac_note": "natural",
    "hp": "19 (3d8)",
    "speed": "40 ft., 爬 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 13}",
    "languages": "—",
    "cr": "1/2",
    "traits": [
      [
        "Keen Smell",
        "The bear has advantage on Wisdom (Perception) checks that rely on smell."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The bear makes two attacks: one with its bite and one with its claws."
      },
      {
        "name": "Bite",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "1d6+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage."
      },
      {
        "name": "Claws",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "2d4+2",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 7 (2d4 + 2) slashing damage."
      }
    ]
  },
  "黑龙幼龙": {
    "en": "Black Dragon Wyrmling",
    "size": "中型",
    "type": "龙",
    "alignment": "混乱邪恶",
    "ac": 17,
    "ac_note": "natural",
    "hp": "33 (6d8)",
    "speed": "30 ft., 飞行 60 ft., 游泳 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "酸"
    ],
    "senses": "{'盲视': '10 ft.', '黑暗视觉': '60 ft.', 'passive_perception': 14}",
    "languages": "龙语",
    "cr": "2",
    "traits": [
      [
        "Amphibious",
        "The dragon can breathe air and water."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d10+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (1d10 + 2) piercing damage plus 2 (1d4) acid damage."
      },
      {
        "name": "Acid Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "5d8",
        "type": "酸",
        "extra": "The dragon exhales acid in a 15-foot line that is 5 feet wide. Each creature in that line must make a DC 11 Dexterity saving throw, taking 22 (5d8) acid damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "黑布丁": {
    "en": "Black Pudding",
    "size": "大型",
    "type": "泥形",
    "alignment": "无",
    "ac": 7,
    "ac_note": "dex",
    "hp": "85 (10d10)",
    "speed": "20 ft., 爬 20 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "酸",
      "冷",
      "电",
      "挥砍"
    ],
    "cond_immune": [
      "目盲",
      "魅惑",
      "力竭",
      "惊惧",
      "倒地"
    ],
    "senses": "{'盲视': '60 ft. (blind beyond this radius)', 'passive_perception': 8}",
    "languages": "—",
    "cr": "4",
    "traits": [
      [
        "Amorphous",
        "The pudding can move through a space as narrow as 1 inch wide without squeezing."
      ],
      [
        "Corrosive Form",
        "A creature that touches the pudding or hits it with a melee attack while within 5 feet of it takes 4 (1d8) acid damage. Any nonmagical weapon made of metal or wood that hits the pudding corrodes. After dealing damage, the weapon takes a permanent and cumulative -1 penalty to damage rolls. If its penalty drops to -5, the weapon is destroyed. Nonmagical ammunition made of metal or wood that hits the pudding is destroyed after dealing damage. The pudding can eat through 2-inch-thick, nonmagical wood or metal in 1 round."
      ],
      [
        "Spider Climb",
        "The pudding can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."
      ]
    ],
    "actions": [
      {
        "name": "Pseudopod",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d6+3",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) bludgeoning damage plus 18 (4d8) acid damage. In addition, nonmagical armor worn by the target is partly dissolved and takes a permanent and cumulative -1 penalty to the AC it offers. The armor is destroyed if the penalty reduces its AC to 10."
      }
    ],
    "reactions": [
      {
        "name": "Split",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "When a pudding that is Medium or larger is subjected to lightning or slashing damage, it splits into two new puddings if it has at least 10 hit points. Each new pudding has hit points equal to half the original pudding's, rounded down. New puddings are one size smaller than the original pudding."
      }
    ]
  },
  "闪现犬": {
    "en": "Blink Dog",
    "size": "中型",
    "type": "精类",
    "alignment": "守序善良",
    "ac": 13,
    "ac_note": "dex",
    "hp": "22 (4d8)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 10}",
    "languages": "Blink Dog, understands Sylvan but can't speak it",
    "cr": "1/4",
    "traits": [
      [
        "Keen Hearing and Smell",
        "The dog has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "1d6+1",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) piercing damage."
      },
      {
        "name": "Teleport",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dog magically teleports, along with any equipment it is wearing or carrying, up to 40 ft. to an unoccupied space it can see. Before or after teleporting, the dog can make one bite attack."
      }
    ]
  },
  "血鹰": {
    "en": "Blood Hawk",
    "size": "小型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "dex",
    "hp": "7 (2d6)",
    "speed": "10 ft., 飞行 60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 14}",
    "languages": "—",
    "cr": "1/8",
    "traits": [
      [
        "Keen Sight",
        "The hawk has advantage on Wisdom (Perception) checks that rely on sight."
      ],
      [
        "Pack Tactics",
        "The hawk has advantage on an attack roll against a creature if at least one of the hawk's allies is within 5 ft. of the creature and the ally isn't incapacitated."
      ]
    ],
    "actions": [
      {
        "name": "Beak",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d4+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) piercing damage."
      }
    ]
  },
  "蓝龙幼龙": {
    "en": "Blue Dragon Wyrmling",
    "size": "中型",
    "type": "龙",
    "alignment": "守序邪恶",
    "ac": 17,
    "ac_note": "natural",
    "hp": "52 (8d8)",
    "speed": "30 ft., 掘地 15 ft., 飞行 60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "电"
    ],
    "senses": "{'盲视': '10 ft.', '黑暗视觉': '60 ft.', 'passive_perception': 14}",
    "languages": "龙语",
    "cr": "3",
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d10+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (1d10 + 3) piercing damage plus 3 (1d6) lightning damage."
      },
      {
        "name": "Lightning Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "4d10",
        "type": "电",
        "extra": "The dragon exhales lightning in a 30-foot line that is 5 feet wide. Each creature in that line must make a DC 12 Dexterity saving throw, taking 22 (4d10) lightning damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "野猪": {
    "en": "Boar",
    "size": "中型",
    "type": "野兽",
    "alignment": "无",
    "ac": 11,
    "ac_note": "natural",
    "hp": "11 (2d8)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 9}",
    "languages": "—",
    "cr": "1/4",
    "traits": [
      [
        "Charge",
        "If the boar moves at least 20 ft. straight toward a target and then hits it with a tusk attack on the same turn, the target takes an extra 3 (1d6) slashing damage. If the target is a creature, it must succeed on a DC 11 Strength saving throw or be knocked prone."
      ],
      [
        "Relentless",
        "If the boar takes 7 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead."
      ]
    ],
    "actions": [
      {
        "name": "Tusk",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "1d6+1",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) slashing damage."
      }
    ]
  },
  "骸骨魔": {
    "en": "Bone Devil",
    "size": "大型",
    "type": "邪魔",
    "alignment": "守序邪恶",
    "ac": 19,
    "ac_note": "natural",
    "hp": "142 (15d10)",
    "speed": "40 ft., 飞行 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "冷",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "火",
      "毒"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 12}",
    "languages": "炼狱语, telepathy 120 ft.",
    "cr": "9",
    "traits": [
      [
        "Devil's Sight",
        "Magical darkness doesn't impede the devil's darkvision."
      ],
      [
        "Magic Resistance",
        "The devil has advantage on saving throws against spells and other magical effects."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The devil makes three attacks: two with its claws and one with its sting."
      },
      {
        "name": "Claw",
        "atk": 8,
        "reach": "10 ft",
        "dmg": "1d8+4",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 8 (1d8 + 4) slashing damage."
      },
      {
        "name": "Sting",
        "atk": 8,
        "reach": "10 ft",
        "dmg": "2d8+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 13 (2d8 + 4) piercing damage plus 17 (5d6) poison damage, and the target must succeed on a DC 14 Constitution saving throw or become poisoned for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ]
  },
  "黄铜龙幼龙": {
    "en": "Brass Dragon Wyrmling",
    "size": "中型",
    "type": "龙",
    "alignment": "混乱善良",
    "ac": 16,
    "ac_note": "natural",
    "hp": "16 (3d8)",
    "speed": "30 ft., 掘地 15 ft., 飞行 60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "火"
    ],
    "senses": "{'盲视': '10 ft.', '黑暗视觉': '60 ft.', 'passive_perception': 14}",
    "languages": "龙语",
    "cr": "1",
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d10+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (1d10 + 2) piercing damage."
      },
      {
        "name": "Breath Weapons",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon uses one of the following breath weapons.\nFire Breath. The dragon exhales fire in an 20-foot line that is 5 feet wide. Each creature in that line must make a DC 11 Dexterity saving throw, taking 14 (4d6) fire damage on a failed save, or half as much damage on a successful one.\nSleep Breath. The dragon exhales sleep gas in a 15-foot cone. Each creature in that area must succeed on a DC 11 Constitution saving throw or fall unconscious for 1 minute. This effect ends for a creature if the creature takes damage or someone uses an action to wake it."
      }
    ]
  },
  "青铜龙幼龙": {
    "en": "Bronze Dragon Wyrmling",
    "size": "中型",
    "type": "龙",
    "alignment": "守序善良",
    "ac": 17,
    "ac_note": "natural",
    "hp": "32 (5d8)",
    "speed": "30 ft., 飞行 60 ft., 游泳 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "电"
    ],
    "senses": "{'盲视': '10 ft.', '黑暗视觉': '60 ft.', 'passive_perception': 14}",
    "languages": "龙语",
    "cr": "2",
    "traits": [
      [
        "Amphibious",
        "The dragon can breathe air and water."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d10+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (1d10 + 3) piercing damage."
      },
      {
        "name": "Breath Weapons",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon uses one of the following breath weapons.\nLightning Breath. The dragon exhales lightning in a 40-foot line that is 5 feet wide. Each creature in that line must make a DC 12 Dexterity saving throw, taking 16 (3d10) lightning damage on a failed save, or half as much damage on a successful one.\nRepulsion Breath. The dragon exhales repulsion energy in a 30-foot cone. Each creature in that area must succeed on a DC 12 Strength saving throw. On a failed save, the creature is pushed 30 feet away from the dragon."
      }
    ]
  },
  "熊": {
    "en": "Brown Bear",
    "size": "大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 11,
    "ac_note": "natural",
    "hp": "34 (4d10)",
    "speed": "40 ft., 爬 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 13}",
    "languages": "—",
    "cr": "1",
    "traits": [
      [
        "Keen Smell",
        "The bear has advantage on Wisdom (Perception) checks that rely on smell."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The bear makes two attacks: one with its bite and one with its claws."
      },
      {
        "name": "Bite",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d8+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (1d8 + 4) piercing damage."
      },
      {
        "name": "Claws",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "2d6+4",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage."
      }
    ]
  },
  "熊地精": {
    "en": "Bugbear",
    "size": "中型",
    "type": "类人妖",
    "alignment": "混乱邪恶",
    "ac": 16,
    "ac_note": "Shield, Hide Armor",
    "hp": "27 (5d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "通用语, 哥布林语",
    "cr": "1",
    "traits": [
      [
        "Brute",
        "A melee weapon deals one extra die of its damage when the bugbear hits with it (included in the attack)."
      ],
      [
        "Surprise Attack",
        "If the bugbear surprises a creature and hits it with an attack during the first round of combat, the target takes an extra 7 (2d6) damage from the attack."
      ]
    ],
    "actions": [
      {
        "name": "Morningstar",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "2d8+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 11 (2d8 + 2) piercing damage."
      },
      {
        "name": "Javelin",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "2d6+2",
        "type": "穿刺",
        "extra": "Melee or Ranged Weapon Attack: +4 to hit, reach 5 ft. or range 30/120 ft., one target. Hit: 9 (2d6 + 2) piercing damage in melee or 5 (1d6 + 2) piercing damage at range."
      }
    ]
  },
  "鲨蜥们": {
    "en": "Bulette",
    "size": "大型",
    "type": "怪兽",
    "alignment": "无",
    "ac": 17,
    "ac_note": "natural",
    "hp": "94 (9d10)",
    "speed": "40 ft., 掘地 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', '震颤感知': '60 ft.', 'passive_perception': 16}",
    "languages": "—",
    "cr": "5",
    "traits": [
      [
        "Standing Leap",
        "The bulette's long jump is up to 30 ft. and its high jump is up to 15 ft., with or without a running start."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "4d12+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 30 (4d12 + 4) piercing damage."
      },
      {
        "name": "Deadly Leap",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "If the bulette jumps at least 15 ft. as part of its movement, it can then use this action to land on its feet in a space that contains one or more other creatures. Each of those creatures must succeed on a DC 16 Strength or Dexterity saving throw (target's choice) or be knocked prone and take 14 (3d6 + 4) bludgeoning damage plus 14 (3d6 + 4) slashing damage. On a successful save, the creature takes only half the damage, isn't knocked prone, and is pushed 5 ft. out of the bulette's space into an unoccupied space of the creature's choice. If no unoccupied space is within range, the creature instead falls prone in the bulette's space."
      }
    ]
  },
  "骆驼": {
    "en": "Camel",
    "size": "大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 9,
    "ac_note": "dex",
    "hp": "15 (2d10)",
    "speed": "50 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 9}",
    "languages": "—",
    "cr": "1/8",
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 2 (1d4) bludgeoning damage."
      }
    ]
  },
  "猫": {
    "en": "Cat",
    "size": "超小型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "dex",
    "hp": "2 (1d4)",
    "speed": "40 ft., 爬 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 13}",
    "languages": "—",
    "cr": "0",
    "traits": [
      [
        "Keen Smell",
        "The cat has advantage on Wisdom (Perception) checks that rely on smell."
      ]
    ],
    "actions": [
      {
        "name": "Claws",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "1",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 1 slashing damage."
      }
    ]
  },
  "人马": {
    "en": "Centaur",
    "size": "大型",
    "type": "怪兽",
    "alignment": "中立善良",
    "ac": 12,
    "ac_note": "dex",
    "hp": "45 (6d10)",
    "speed": "50 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 13}",
    "languages": "精灵语, 精类语",
    "cr": "2",
    "traits": [
      [
        "Charge",
        "If the centaur moves at least 30 ft. straight toward a target and then hits it with a pike attack on the same turn, the target takes an extra 10 (3d6) piercing damage."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The centaur makes two attacks: one with its pike and one with its hooves or two with its longbow."
      },
      {
        "name": "Pike",
        "atk": 6,
        "reach": "10 ft",
        "dmg": "1d10+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +6 to hit, reach 10 ft., one target. Hit: 9 (1d10 + 4) piercing damage."
      },
      {
        "name": "Hooves",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d6+4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) bludgeoning damage."
      },
      {
        "name": "Longbow",
        "atk": 4,
        "reach": "150/600 ft",
        "dmg": "1d8+2",
        "type": "穿刺",
        "extra": "Ranged Weapon Attack: +4 to hit, range 150/600 ft., one target. Hit: 6 (1d8 + 2) piercing damage."
      }
    ]
  },
  "锁链魔": {
    "en": "Chain Devil",
    "size": "中型",
    "type": "邪魔",
    "alignment": "守序邪恶",
    "ac": 16,
    "ac_note": "natural",
    "hp": "85 (10d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "冷",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "火",
      "毒"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 11}",
    "languages": "炼狱语, telepathy 120 ft.",
    "cr": "8",
    "traits": [
      [
        "Devil's Sight",
        "Magical darkness doesn't impede the devil's darkvision."
      ],
      [
        "Magic Resistance",
        "The devil has advantage on saving throws against spells and other magical effects."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The devil makes two attacks with its chains."
      },
      {
        "name": "Chain",
        "atk": 8,
        "reach": "10 ft",
        "dmg": "2d6+4",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 11 (2d6 + 4) slashing damage. The target is grappled (escape DC 14) if the devil isn't already grappling a creature. Until this grapple ends, the target is restrained and takes 7 (2d6) piercing damage at the start of each of its turns."
      },
      {
        "name": "Animate Chains",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Up to four chains the devil can see within 60 feet of it magically sprout razor-edged barbs and animate under the devil's control, provided that the chains aren't being worn or carried.\nEach animated chain is an object with AC 20, 20 hit points, resistance to piercing damage, and immunity to psychic and thunder damage. When the devil uses Multiattack on its turn, it can use each animated chain to make one additional chain attack. An animated chain can grapple one creature of its own but can't make attacks while grappling. An animated chain reverts to its inanimate state if reduced to 0 hit points or if the devil is incapacitated or dies."
      }
    ],
    "reactions": [
      {
        "name": "Unnerving Mask",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "When a creature the devil can see starts its turn within 30 feet of the devil, the devil can create the illusion that it looks like one of the creature's departed loved ones or bitter enemies. If the creature can see the devil, it must succeed on a DC 14 Wisdom saving throw or be frightened until the end of its turn."
      }
    ]
  },
  "奇美拉": {
    "en": "Chimera",
    "size": "大型",
    "type": "怪兽",
    "alignment": "混乱邪恶",
    "ac": 14,
    "ac_note": "natural",
    "hp": "114 (12d10)",
    "speed": "30 ft., 飞行 60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 18}",
    "languages": "understands Draconic but can't speak",
    "cr": "6",
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The chimera makes three attacks: one with its bite, one with its horns, and one with its claws. When its fire breath is available, it can use the breath in place of its bite or horns."
      },
      {
        "name": "Bite",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "2d6+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) piercing damage."
      },
      {
        "name": "Horns",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "1d12+4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 10 (1d12 + 4) bludgeoning damage."
      },
      {
        "name": "Claws",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "2d6+4",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage."
      },
      {
        "name": "Fire Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "7d8",
        "type": "火",
        "extra": "The dragon head exhales fire in a 15-foot cone. Each creature in that area must make a DC 15 Dexterity saving throw, taking 31 (7d8) fire damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "甲伏怪": {
    "en": "Chuul",
    "size": "大型",
    "type": "异怪",
    "alignment": "混乱邪恶",
    "ac": 16,
    "ac_note": "natural",
    "hp": "93 (11d10)",
    "speed": "30 ft., 游泳 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "毒"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 14}",
    "languages": "understands Deep Speech but can't speak",
    "cr": "4",
    "traits": [
      [
        "Amphibious",
        "The chuul can breathe air and water."
      ],
      [
        "Sense Magic",
        "The chuul senses magic within 120 feet of it at will. This trait otherwise works like the detect magic spell but isn't itself magical."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The chuul makes two pincer attacks. If the chuul is grappling a creature, the chuul can also use its tentacles once."
      },
      {
        "name": "Pincer",
        "atk": 6,
        "reach": "10 ft",
        "dmg": "2d6+4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +6 to hit, reach 10 ft., one target. Hit: 11 (2d6 + 4) bludgeoning damage. The target is grappled (escape DC 14) if it is a Large or smaller creature and the chuul doesn't have two other creatures grappled."
      },
      {
        "name": "Tentacles",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "One creature grappled by the chuul must succeed on a DC 13 Constitution saving throw or be poisoned for 1 minute. Until this poison ends, the target is paralyzed. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ]
  },
  "粘土魔像": {
    "en": "Clay Golem",
    "size": "大型",
    "type": "构装",
    "alignment": "无",
    "ac": 14,
    "ac_note": "natural",
    "hp": "133 (14d10)",
    "speed": "20 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "酸",
      "毒",
      "心灵",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "cond_immune": [
      "魅惑",
      "力竭",
      "惊惧",
      "麻痹",
      "石化",
      "中毒"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 9}",
    "languages": "understands the languages of its creator but can't speak",
    "cr": "9",
    "traits": [
      [
        "Acid Absorption",
        "Whenever the golem is subjected to acid damage, it takes no damage and instead regains a number of hit points equal to the acid damage dealt."
      ],
      [
        "Berserk",
        "Whenever the golem starts its turn with 60 hit points or fewer, roll a d6. On a 6, the golem goes berserk. On each of its turns while berserk, the golem attacks the nearest creature it can see. If no creature is near enough to move to and attack, the golem attacks an object, with preference for an object smaller than itself. Once the golem goes berserk, it continues to do so until it is destroyed or regains all its hit points."
      ],
      [
        "Immutable Form",
        "The golem is immune to any spell or effect that would alter its form."
      ],
      [
        "Magic Resistance",
        "The golem has advantage on saving throws against spells and other magical effects."
      ],
      [
        "Magic Weapons",
        "The golem's weapon attacks are magical."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The golem makes two slam attacks."
      },
      {
        "name": "Slam",
        "atk": 8,
        "reach": "5 ft",
        "dmg": "2d10+5",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 16 (2d10 + 5) bludgeoning damage. If the target is a creature, it must succeed on a DC 15 Constitution saving throw or have its hit point maximum reduced by an amount equal to the damage taken. The target dies if this attack reduces its hit point maximum to 0. The reduction lasts until removed by the greater restoration spell or other magic."
      },
      {
        "name": "Haste",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Until the end of its next turn, the golem magically gains a +2 bonus to its AC, has advantage on Dexterity saving throws, and can use its slam attack as a bonus action."
      }
    ]
  },
  "斗篷怪": {
    "en": "Cloaker",
    "size": "大型",
    "type": "异怪",
    "alignment": "混乱中立",
    "ac": 14,
    "ac_note": "natural",
    "hp": "78 (12d10)",
    "speed": "10 ft., 飞行 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 11}",
    "languages": "深层语, 地底语",
    "cr": "8",
    "traits": [
      [
        "Damage Transfer",
        "While attached to a creature, the cloaker takes only half the damage dealt to it (rounded down). and that creature takes the other half."
      ],
      [
        "False Appearance",
        "While the cloaker remains motionless without its underside exposed, it is indistinguishable from a dark leather cloak."
      ],
      [
        "Light Sensitivity",
        "While in bright light, the cloaker has disadvantage on attack rolls and Wisdom (Perception) checks that rely on sight."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The cloaker makes two attacks: one with its bite and one with its tail."
      },
      {
        "name": "Bite",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d6+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one creature. Hit: 10 (2d6 + 3) piercing damage, and if the target is Large or smaller, the cloaker attaches to it. If the cloaker has advantage against the target, the cloaker attaches to the target's head, and the target is blinded and unable to breathe while the cloaker is attached. While attached, the cloaker can make this attack only against the target and has advantage on the attack roll. The cloaker can detach itself by spending 5 feet of its movement. A creature, including the target, can take its action to detach the cloaker by succeeding on a DC 16 Strength check."
      },
      {
        "name": "Tail",
        "atk": 6,
        "reach": "10 ft",
        "dmg": "1d8+3",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +6 to hit, reach 10 ft., one creature. Hit: 7 (1d8 + 3) slashing damage."
      },
      {
        "name": "Moan",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Each creature within 60 feet of the cloaker that can hear its moan and that isn't an aberration must succeed on a DC 13 Wisdom saving throw or become frightened until the end of the cloaker's next turn. If a creature's saving throw is successful, the creature is immune to the cloaker's moan for the next 24 hours."
      },
      {
        "name": "Phantasms",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The cloaker magically creates three illusory duplicates of itself if it isn't in bright light. The duplicates move with it and mimic its actions, shifting position so as to make it impossible to track which cloaker is the real one. If the cloaker is ever in an area of bright light, the duplicates disappear.\nWhenever any creature targets the cloaker with an attack or a harmful spell while a duplicate remains, that creature rolls randomly to determine whether it targets the cloaker or one of the duplicates. A creature is unaffected by this magical effect if it can't see or if it relies on senses other than sight.\nA duplicate has the cloaker's AC and uses its saving throws. If an attack hits a duplicate, or if a duplicate fails a saving throw against an effect that deals damage, the duplicate disappears."
      }
    ]
  },
  "云巨人": {
    "en": "Cloud Giant",
    "size": "超大型",
    "type": "巨人",
    "alignment": "neutral good (50%) or neutral evil (50%)",
    "ac": 14,
    "ac_note": "natural",
    "hp": "200 (16d12)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 17}",
    "languages": "通用语, 巨语",
    "cr": "9",
    "traits": [
      [
        "Keen Smell",
        "The giant has advantage on Wisdom (Perception) checks that rely on smell."
      ],
      [
        "Innate Spellcasting",
        "The giant's innate spellcasting ability is Charisma. It can innately cast the following spells, requiring no material components:\n\nAt will: detect magic, fog cloud, light\n3/day each: feather fall, fly, misty step, telekinesis\n1/day each: control weather, gaseous form"
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The giant makes two morningstar attacks."
      },
      {
        "name": "Morningstar",
        "atk": 12,
        "reach": "10 ft",
        "dmg": "3d8+8",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +12 to hit, reach 10 ft., one target. Hit: 21 (3d8 + 8) piercing damage."
      },
      {
        "name": "Rock",
        "atk": 12,
        "reach": "60/240 ft",
        "dmg": "4d10+8",
        "type": "钝击",
        "extra": "Ranged Weapon Attack: +12 to hit, range 60/240 ft., one target. Hit: 30 (4d10 + 8) bludgeoning damage."
      }
    ]
  },
  "蛇鸡兽": {
    "en": "Cockatrice",
    "size": "小型",
    "type": "怪兽",
    "alignment": "无",
    "ac": 11,
    "ac_note": "dex",
    "hp": "27 (6d6)",
    "speed": "20 ft., 飞行 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 11}",
    "languages": "—",
    "cr": "1/2",
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "1d4+1",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one creature. Hit: 3 (1d4 + 1) piercing damage, and the target must succeed on a DC 11 Constitution saving throw against being magically petrified. On a failed save, the creature begins to turn to stone and is restrained. It must repeat the saving throw at the end of its next turn. On a success, the effect ends. On a failure, the creature is petrified for 24 hours."
      }
    ]
  },
  "普通民众": {
    "en": "Commoner",
    "size": "中型",
    "type": "类人妖",
    "alignment": "任意",
    "ac": 10,
    "ac_note": "dex",
    "hp": "4 (1d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 10}",
    "languages": "any one language (usually Common)",
    "cr": "0",
    "traits": [],
    "actions": [
      {
        "name": "Club",
        "atk": 2,
        "reach": "5 ft",
        "dmg": "1d4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 2 (1d4) bludgeoning damage."
      }
    ]
  },
  "蟒蛇": {
    "en": "Constrictor Snake",
    "size": "大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "dex",
    "hp": "13 (2d10)",
    "speed": "30 ft., 游泳 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'盲视': '10 ft.', 'passive_perception': 10}",
    "languages": "—",
    "cr": "1/4",
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d6+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 5 (1d6 + 2) piercing damage."
      },
      {
        "name": "Constrict",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d8+2",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 6 (1d8 + 2) bludgeoning damage, and the target is grappled (escape DC 14). Until this grapple ends, the creature is restrained, and the snake can't constrict another target."
      }
    ]
  },
  "红铜龙幼龙": {
    "en": "Copper Dragon Wyrmling",
    "size": "中型",
    "type": "龙",
    "alignment": "混乱善良",
    "ac": 16,
    "ac_note": "natural",
    "hp": "22 (4d8)",
    "speed": "30 ft., 爬 30 ft., 飞行 60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "酸"
    ],
    "senses": "{'盲视': '10 ft.', '黑暗视觉': '60 ft.', 'passive_perception': 14}",
    "languages": "龙语",
    "cr": "1",
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d10+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (1d10 + 2) piercing damage."
      },
      {
        "name": "Breath Weapons",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon uses one of the following breath weapons.\nAcid Breath. The dragon exhales acid in an 20-foot line that is 5 feet wide. Each creature in that line must make a DC 11 Dexterity saving throw, taking 18 (4d8) acid damage on a failed save, or half as much damage on a successful one.\nSlowing Breath. The dragon exhales gas in a 15-foot cone. Each creature in that area must succeed on a DC 11 Constitution saving throw. On a failed save, the creature can't use reactions, its speed is halved, and it can't make more than one attack on its turn. In addition, the creature can use either an action or a bonus action on its turn, but not both. These effects last for 1 minute. The creature can repeat the saving throw at the end of each of its turns, ending the effect on itself with a successful save."
      }
    ]
  },
  "羽蛇": {
    "en": "Couatl",
    "size": "中型",
    "type": "天界",
    "alignment": "守序善良",
    "ac": 19,
    "ac_note": "natural",
    "hp": "97 (13d8)",
    "speed": "30 ft., 飞行 90 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "光耀"
    ],
    "immune": [
      "心灵",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "senses": "{'真实视觉': '120 ft.', 'passive_perception': 15}",
    "languages": "all, telepathy 120 ft.",
    "cr": "4",
    "traits": [
      [
        "Innate Spellcasting",
        "The couatl's spellcasting ability is Charisma (spell save DC 14). It can innately cast the following spells, requiring only verbal components:\n\nAt will: detect evil and good, detect magic, detect thoughts\n3/day each: bless, create food and water, cure wounds, lesser restoration, protection from poison, sanctuary, shield\n1/day each: dream, greater restoration, scrying"
      ],
      [
        "Magic Weapons",
        "The couatl's weapon attacks are magical."
      ],
      [
        "Shielded Mind",
        "The couatl is immune to scrying and to any effect that would sense its emotions, read its thoughts, or detect its location."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 8,
        "reach": "5 ft",
        "dmg": "1d6+5",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +8 to hit, reach 5 ft., one creature. Hit: 8 (1d6 + 5) piercing damage, and the target must succeed on a DC 13 Constitution saving throw or be poisoned for 24 hours. Until this poison ends, the target is unconscious. Another creature can use an action to shake the target awake."
      },
      {
        "name": "Constrict",
        "atk": 6,
        "reach": "10 ft",
        "dmg": "2d6+3",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +6 to hit, reach 10 ft., one Medium or smaller creature. Hit: 10 (2d6 + 3) bludgeoning damage, and the target is grappled (escape DC 15). Until this grapple ends, the target is restrained, and the couatl can't constrict another target."
      },
      {
        "name": "Change Shape",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The couatl magically polymorphs into a humanoid or beast that has a challenge rating equal to or less than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the couatl's choice).\nIn a new form, the couatl retains its game statistics and ability to speak, but its AC, movement modes, Strength, Dexterity, and other actions are replaced by those of the new form, and it gains any statistics and capabilities (except class features, legendary actions, and lair actions) that the new form has but that it lacks. If the new form has a bite attack, the couatl can use its bite in that form."
      }
    ]
  },
  "蟹": {
    "en": "Crab",
    "size": "超小型",
    "type": "野兽",
    "alignment": "无",
    "ac": 11,
    "ac_note": "natural",
    "hp": "2 (1d4)",
    "speed": "20 ft., 游泳 20 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'盲视': '30 ft.', 'passive_perception': 9}",
    "languages": "—",
    "cr": "0",
    "traits": [
      [
        "Amphibious",
        "The crab can breathe air and water."
      ]
    ],
    "actions": [
      {
        "name": "Claw",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "1",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 1 bludgeoning damage."
      }
    ]
  },
  "鳄鱼": {
    "en": "Crocodile",
    "size": "大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "natural",
    "hp": "19 (3d10)",
    "speed": "20 ft., 游泳 20 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 10}",
    "languages": "—",
    "cr": "1/2",
    "traits": [
      [
        "Hold Breath",
        "The crocodile can hold its breath for 15 minutes."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d10+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 7 (1d10 + 2) piercing damage, and the target is grappled (escape DC 12). Until this grapple ends, the target is restrained, and the crocodile can't bite another target"
      }
    ]
  },
  "邪教狂热者": {
    "en": "Cult Fanatic",
    "size": "中型",
    "type": "类人妖",
    "alignment": "任意非善良",
    "ac": 13,
    "ac_note": "Leather Armor",
    "hp": "22 (6d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 11}",
    "languages": "any one language (usually Common)",
    "cr": "2",
    "traits": [
      [
        "Dark Devotion",
        "The fanatic has advantage on saving throws against being charmed or frightened."
      ],
      [
        "Spellcasting",
        "The fanatic is a 4th-level spellcaster. Its spell casting ability is Wisdom (spell save DC 11, +3 to hit with spell attacks). The fanatic has the following cleric spells prepared:\n\nCantrips (at will): light, sacred flame, thaumaturgy\n- 1st level (4 slots): command, inflict wounds, shield of faith\n- 2nd level (3 slots): hold person, spiritual weapon"
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The fanatic makes two melee attacks."
      },
      {
        "name": "Dagger",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d4+2",
        "type": "穿刺",
        "extra": "Melee or Ranged Weapon Attack: +4 to hit, reach 5 ft. or range 20/60 ft., one creature. Hit: 4 (1d4 + 2) piercing damage."
      }
    ]
  },
  "邪教徒": {
    "en": "Cultist",
    "size": "中型",
    "type": "类人妖",
    "alignment": "任意非善良",
    "ac": 12,
    "ac_note": "Leather Armor",
    "hp": "9 (2d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 10}",
    "languages": "any one language (usually Common)",
    "cr": "1/8",
    "traits": [
      [
        "Dark Devotion",
        "The cultist has advantage on saving throws against being charmed or frightened."
      ]
    ],
    "actions": [
      {
        "name": "Scimitar",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "1d6+1",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one creature. Hit: 4 (1d6 + 1) slashing damage."
      }
    ]
  },
  "暗幕魔兽": {
    "en": "Darkmantle",
    "size": "小型",
    "type": "怪兽",
    "alignment": "无",
    "ac": 11,
    "ac_note": "dex",
    "hp": "22 (5d6)",
    "speed": "10 ft., 飞行 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'盲视': '60 ft.', 'passive_perception': 10}",
    "languages": "—",
    "cr": "1/2",
    "traits": [
      [
        "Echolocation",
        "The darkmantle can't use its blindsight while deafened."
      ],
      [
        "False Appearance",
        "While the darkmantle remains motionless, it is indistinguishable from a cave formation such as a stalactite or stalagmite."
      ]
    ],
    "actions": [
      {
        "name": "Crush",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d6+3",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one creature. Hit: 6 (1d6 + 3) bludgeoning damage, and the darkmantle attaches to the target. If the target is Medium or smaller and the darkmantle has advantage on the attack roll, it attaches by engulfing the target's head, and the target is also blinded and unable to breathe while the darkmantle is attached in this way.\nWhile attached to the target, the darkmantle can attack no other creature except the target but has advantage on its attack rolls. The darkmantle's speed also becomes 0, it can't benefit from any bonus to its speed, and it moves with the target.\nA creature can detach the darkmantle by making a successful DC 13 Strength check as an action. On its turn, the darkmantle can detach itself from the target by using 5 feet of movement."
      },
      {
        "name": "Darkness Aura",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "A 15-foot radius of magical darkness extends out from the darkmantle, moves with it, and spreads around corners. The darkness lasts as long as the darkmantle maintains concentration, up to 10 minutes (as if concentrating on a spell). Darkvision can't penetrate this darkness, and no natural light can illuminate it. If any of the darkness overlaps with an area of light created by a spell of 2nd level or lower, the spell creating the light is dispelled."
      }
    ]
  },
  "亡命恶犬": {
    "en": "Death Dog",
    "size": "中型",
    "type": "怪兽",
    "alignment": "中立邪恶",
    "ac": 12,
    "ac_note": "dex",
    "hp": "39 (6d8)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 15}",
    "languages": "—",
    "cr": "1",
    "traits": [
      [
        "Two-Headed",
        "The dog has advantage on Wisdom (Perception) checks and on saving throws against being blinded, charmed, deafened, frightened, stunned, or knocked unconscious."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dog makes two bite attacks."
      },
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d6+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage. If the target is a creature, it must succeed on a DC 12 Constitution saving throw against disease or become poisoned until the disease is cured. Every 24 hours that elapse, the creature must repeat the saving throw, reducing its hit point maximum by 5 (1d10) on a failure. This reduction lasts until the disease is cured. The creature dies if the disease reduces its hit point maximum to 0."
      }
    ]
  },
  "地底侏儒": {
    "en": "Deep Gnome (Svirfneblin)",
    "size": "小型",
    "type": "类人妖",
    "alignment": "中立善良",
    "ac": 15,
    "ac_note": "Chain Shirt",
    "hp": "16 (3d6)",
    "speed": "20 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 12}",
    "languages": "Gnomish, 土族语, 地底语",
    "cr": "1/2",
    "traits": [
      [
        "Stone Camouflage",
        "The gnome has advantage on Dexterity (Stealth) checks made to hide in rocky terrain."
      ],
      [
        "Gnome Cunning",
        "The gnome has advantage on Intelligence, Wisdom, and Charisma saving throws against magic."
      ],
      [
        "Innate Spellcasting",
        "The gnome's innate spellcasting ability is Intelligence (spell save DC 11). It can innately cast the following spells, requiring no material components:\nAt will: nondetection (self only)\n1/day each: blindness/deafness, blur, disguise self"
      ]
    ],
    "actions": [
      {
        "name": "War Pick",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d8+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8 + 2) piercing damage."
      },
      {
        "name": "Poisoned Dart",
        "atk": 4,
        "reach": "30/120 ft",
        "dmg": "1d4+2",
        "type": "穿刺",
        "extra": "Ranged Weapon Attack: +4 to hit, range 30/120 ft., one creature. Hit: 4 (1d4 + 2) piercing damage, and the target must succeed on a DC 12 Constitution saving throw or be poisoned for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success"
      }
    ]
  },
  "鹿": {
    "en": "Deer",
    "size": "中型",
    "type": "野兽",
    "alignment": "无",
    "ac": 13,
    "ac_note": "dex",
    "hp": "4 (1d8)",
    "speed": "50 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 12}",
    "languages": "—",
    "cr": "0",
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "atk": 2,
        "reach": "5 ft",
        "dmg": "1d4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 2 (1d4) piercing damage."
      }
    ]
  },
  "天神使徒": {
    "en": "Deva",
    "size": "中型",
    "type": "天界",
    "alignment": "守序善良",
    "ac": 17,
    "ac_note": "natural",
    "hp": "136 (16d8)",
    "speed": "30 ft., 飞行 90 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "光耀",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "cond_immune": [
      "魅惑",
      "力竭",
      "惊惧"
    ],
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 19}",
    "languages": "all, telepathy 120 ft.",
    "cr": "10",
    "traits": [
      [
        "Angelic Weapons",
        "The deva's weapon attacks are magical. When the deva hits with any weapon, the weapon deals an extra 4d8 radiant damage (included in the attack)."
      ],
      [
        "Innate Spellcasting",
        "The deva's spellcasting ability is Charisma (spell save DC 17). The deva can innately cast the following spells, requiring only verbal components:\nAt will: detect evil and good\n1/day each: commune, raise dead"
      ],
      [
        "Magic Resistance",
        "The deva has advantage on saving throws against spells and other magical effects."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The deva makes two melee attacks."
      },
      {
        "name": "Mace",
        "atk": 8,
        "reach": "5 ft",
        "dmg": "1d6+4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 7 (1d6 + 4) bludgeoning damage plus 18 (4d8) radiant damage."
      },
      {
        "name": "Healing Touch",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The deva touches another creature. The target magically regains 20 (4d8 + 2) hit points and is freed from any curse, disease, poison, blindness, or deafness."
      },
      {
        "name": "Change Shape",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The deva magically polymorphs into a humanoid or beast that has a challenge rating equal to or less than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the deva's choice).\nIn a new form, the deva retains its game statistics and ability to speak, but its AC, movement modes, Strength, Dexterity, and special senses are replaced by those of the new form, and it gains any statistics and capabilities (except class features, legendary actions, and lair actions) that the new form has but that it lacks."
      }
    ]
  },
  "巨狼": {
    "en": "Dire Wolf",
    "size": "大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 14,
    "ac_note": "natural",
    "hp": "37 (5d10)",
    "speed": "50 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 13}",
    "languages": "—",
    "cr": "1",
    "traits": [
      [
        "Keen Hearing and Smell",
        "The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      ],
      [
        "Pack Tactics",
        "The wolf has advantage on an attack roll against a creature if at least one of the wolf's allies is within 5 ft. of the creature and the ally isn't incapacitated."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "2d6+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) piercing damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone."
      }
    ]
  },
  "气巨灵": {
    "en": "Djinni",
    "size": "大型",
    "type": "元素",
    "alignment": "混乱善良",
    "ac": 17,
    "ac_note": "natural",
    "hp": "161 (14d10)",
    "speed": "30 ft., 飞行 90 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "电",
      "雷"
    ],
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 13}",
    "languages": "气族语",
    "cr": "11",
    "traits": [
      [
        "Elemental Demise",
        "If the djinni dies, its body disintegrates into a warm breeze, leaving behind only equipment the djinni was wearing or carrying."
      ],
      [
        "Innate Spellcasting",
        "The djinni's innate spellcasting ability is Charisma (spell save DC 17, +9 to hit with spell attacks). It can innately cast the following spells, requiring no material components:\n\nAt will: detect evil and good, detect magic, thunderwave\n3/day each: create food and water (can create wine instead of water), tongues, wind walk\n1/day each: conjure elemental (air elemental only), creation, gaseous form, invisibility, major image, plane shift"
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The djinni makes three scimitar attacks."
      },
      {
        "name": "Scimitar",
        "atk": 9,
        "reach": "5 ft",
        "dmg": "2d6+5",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 5) slashing damage plus 3 (1d6) lightning or thunder damage (djinni's choice)."
      },
      {
        "name": "Create Whirlwind",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "A 5-foot-radius, 30-foot-tall cylinder of swirling air magically forms on a point the djinni can see within 120 feet of it. The whirlwind lasts as long as the djinni maintains concentration (as if concentrating on a spell). Any creature but the djinni that enters the whirlwind must succeed on a DC 18 Strength saving throw or be restrained by it. The djinni can move the whirlwind up to 60 feet as an action, and creatures restrained by the whirlwind move with it. The whirlwind ends if the djinni loses sight of it.\nA creature can use its action to free a creature restrained by the whirlwind, including itself, by succeeding on a DC 18 Strength check. If the check succeeds, the creature is no longer restrained and moves to the nearest space outside the whirlwind."
      }
    ]
  },
  "变形怪": {
    "en": "Doppelganger",
    "size": "中型",
    "type": "怪兽",
    "alignment": "无",
    "ac": 14,
    "ac_note": "dex",
    "hp": "52 (8d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "cond_immune": [
      "魅惑"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 11}",
    "languages": "通用语",
    "cr": "3",
    "traits": [
      [
        "Shapechanger",
        "The doppelganger can use its action to polymorph into a Small or Medium humanoid it has seen, or back into its true form. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies."
      ],
      [
        "Ambusher",
        "In the first round of combat, the doppelganger has advantage on attack rolls against any creature it has surprised."
      ],
      [
        "Surprise Attack",
        "If the doppelganger surprises a creature and hits it with an attack during the first round of combat, the target takes an extra 10 (3d6) damage from the attack."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The doppelganger makes two melee attacks."
      },
      {
        "name": "Slam",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "1d6+4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 7 (1d6 + 4) bludgeoning damage."
      },
      {
        "name": "Read Thoughts",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The doppelganger magically reads the surface thoughts of one creature within 60 ft. of it. The effect can penetrate barriers, but 3 ft. of wood or dirt, 2 ft. of stone, 2 inches of metal, or a thin sheet of lead blocks it. While the target is in range, the doppelganger can continue reading its thoughts, as long as the doppelganger's concentration isn't broken (as if concentrating on a spell). While reading the target's mind, the doppelganger has advantage on Wisdom (Insight) and Charisma (Deception, Intimidation, and Persuasion) checks against the target."
      }
    ]
  },
  "驼用马": {
    "en": "Draft Horse",
    "size": "大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 10,
    "ac_note": "dex",
    "hp": "19 (3d10)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 10}",
    "languages": "—",
    "cr": "1/4",
    "traits": [],
    "actions": [
      {
        "name": "Hooves",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d4+4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 9 (2d4 + 4) bludgeoning damage."
      }
    ]
  },
  "龙龟": {
    "en": "Dragon Turtle",
    "size": "巨型",
    "type": "龙",
    "alignment": "中立",
    "ac": 20,
    "ac_note": "natural",
    "hp": "341 (22d20)",
    "speed": "20 ft., 游泳 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "火"
    ],
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 11}",
    "languages": "水族语, 龙语",
    "cr": "17",
    "traits": [
      [
        "Amphibious",
        "The dragon turtle can breathe air and water."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon turtle makes three attacks: one with its bite and two with its claws. It can make one tail attack in place of its two claw attacks."
      },
      {
        "name": "Bite",
        "atk": 13,
        "reach": "15 ft",
        "dmg": "3d12+7",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +13 to hit, reach 15 ft., one target. Hit: 26 (3d12 + 7) piercing damage."
      },
      {
        "name": "Claw",
        "atk": 13,
        "reach": "10 ft",
        "dmg": "2d8+7",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +13 to hit, reach 10 ft., one target. Hit: 16 (2d8 + 7) slashing damage."
      },
      {
        "name": "Tail",
        "atk": 13,
        "reach": "15 ft",
        "dmg": "3d12+7",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +13 to hit, reach 15 ft., one target. Hit: 26 (3d12 + 7) bludgeoning damage. If the target is a creature, it must succeed on a DC 20 Strength saving throw or be pushed up to 10 feet away from the dragon turtle and knocked prone."
      },
      {
        "name": "Steam Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "15d6",
        "type": "火",
        "extra": "The dragon turtle exhales scalding steam in a 60-foot cone. Each creature in that area must make a DC 18 Constitution saving throw, taking 52 (15d6) fire damage on a failed save, or half as much damage on a successful one. Being underwater doesn't grant resistance against this damage."
      }
    ]
  },
  "小恶魔": {
    "en": "Dretch",
    "size": "小型",
    "type": "邪魔",
    "alignment": "混乱邪恶",
    "ac": 11,
    "ac_note": "natural",
    "hp": "18 (4d6)",
    "speed": "20 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "冷",
      "火",
      "电"
    ],
    "immune": [
      "毒"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 9}",
    "languages": "深渊语, telepathy 60 ft. (works only with creatures that understand Abyssal)",
    "cr": "1/4",
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dretch makes two attacks: one with its bite and one with its claws."
      },
      {
        "name": "Bite",
        "atk": 2,
        "reach": "5 ft",
        "dmg": "1d6",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 3 (1d6) piercing damage."
      },
      {
        "name": "Claws",
        "atk": 2,
        "reach": "5 ft",
        "dmg": "2d4",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 5 (2d4) slashing damage."
      },
      {
        "name": "Fetid Cloud",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "A 10-foot radius of disgusting green gas extends out from the dretch. The gas spreads around corners, and its area is lightly obscured. It lasts for 1 minute or until a strong wind disperses it. Any creature that starts its turn in that area must succeed on a DC 11 Constitution saving throw or be poisoned until the start of its next turn. While poisoned in this way, the target can take either an action or a bonus action on its turn, not both, and can't take reactions."
      }
    ]
  },
  "蛛化卓尔": {
    "en": "Drider",
    "size": "大型",
    "type": "怪兽",
    "alignment": "混乱邪恶",
    "ac": 19,
    "ac_note": "natural",
    "hp": "123 (13d10)",
    "speed": "30 ft., 爬 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 15}",
    "languages": "精灵语, 地底语",
    "cr": "6",
    "traits": [
      [
        "Fey Ancestry",
        "The drider has advantage on saving throws against being charmed, and magic can't put the drider to sleep."
      ],
      [
        "Innate Spellcasting",
        "The drider's innate spellcasting ability is Wisdom (spell save DC 13). The drider can innately cast the following spells, requiring no material components:\nAt will: dancing lights\n1/day each: darkness, faerie fire"
      ],
      [
        "Spider Climb",
        "The drider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."
      ],
      [
        "Sunlight Sensitivity",
        "While in sunlight, the drider has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight."
      ],
      [
        "Web Walker",
        "The drider ignores movement restrictions caused by webbing."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The drider makes three attacks, either with its longsword or its longbow. It can replace one of those attacks with a bite attack."
      },
      {
        "name": "Bite",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "1d4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one creature. Hit: 2 (1d4) piercing damage plus 9 (2d8) poison damage."
      },
      {
        "name": "Longsword",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) slashing damage, or 8 (1d10 + 3) slashing damage if used with two hands."
      },
      {
        "name": "Longbow",
        "atk": 6,
        "reach": "150/600 ft",
        "dmg": "1d8+3",
        "type": "穿刺",
        "extra": "Ranged Weapon Attack: +6 to hit, range 150/600 ft., one target. Hit: 7 (1d8 + 3) piercing damage plus 4 (1d8) poison damage."
      }
    ]
  },
  "卓尔": {
    "en": "Drow",
    "size": "中型",
    "type": "类人妖",
    "alignment": "中立邪恶",
    "ac": 15,
    "ac_note": "Chain Shirt",
    "hp": "13 (3d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 12}",
    "languages": "精灵语, 地底语",
    "cr": "1/4",
    "traits": [
      [
        "Fey Ancestry",
        "The drow has advantage on saving throws against being charmed, and magic can't put the drow to sleep."
      ],
      [
        "Innate Spellcasting",
        "The drow's spellcasting ability is Charisma (spell save DC 11). It can innately cast the following spells, requiring no material components:\nAt will: dancing lights\n1/day each: darkness, faerie fire"
      ],
      [
        "Sunlight Sensitivity",
        "While in sunlight, the drow has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight."
      ]
    ],
    "actions": [
      {
        "name": "Shortsword",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d6+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage."
      },
      {
        "name": "Hand Crossbow",
        "atk": 4,
        "reach": "30/120 ft",
        "dmg": "1d6+2",
        "type": "穿刺",
        "extra": "Ranged Weapon Attack: +4 to hit, range 30/120 ft., one target. Hit: 5 (1d6 + 2) piercing damage, and the target must succeed on a DC 13 Constitution saving throw or be poisoned for 1 hour. If the saving throw fails by 5 or more, the target is also unconscious while poisoned in this way. The target wakes up if it takes damage or if another creature takes an action to shake it awake."
      }
    ]
  },
  "德鲁伊": {
    "en": "Druid",
    "size": "中型",
    "type": "类人妖",
    "alignment": "任意",
    "ac": 11,
    "ac_note": "dex",
    "hp": "27 (5d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 14}",
    "languages": "Druidic plus any two languages",
    "cr": "2",
    "traits": [
      [
        "Spellcasting",
        "The druid is a 4th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 12, +4 to hit with spell attacks). It has the following druid spells prepared:\n\n- Cantrips (at will): druidcraft, produce flame, shillelagh\n- 1st level (4 slots): entangle, longstrider, speak with animals, thunderwave\n- 2nd level (3 slots): animal messenger, barkskin"
      ]
    ],
    "actions": [
      {
        "name": "Quarterstaff",
        "atk": 2,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": " Melee Weapon Attack: +2 to hit (+4 to hit with shillelagh), reach 5 ft., one target. Hit: 3 (1d6) bludgeoning damage, 4 (1d8) bludgeoning damage if wielded with two hands, or 6 (1d8 + 2) bludgeoning damage with shillelagh."
      }
    ]
  },
  "树精": {
    "en": "Dryad",
    "size": "中型",
    "type": "精类",
    "alignment": "中立",
    "ac": 11,
    "ac_note": "dex",
    "hp": "22 (5d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 14}",
    "languages": "精灵语, 精类语",
    "cr": "1",
    "traits": [
      [
        "Innate Spellcasting",
        "The dryad's innate spellcasting ability is Charisma (spell save DC 14). The dryad can innately cast the following spells, requiring no material components:\n\nAt will: druidcraft\n3/day each: entangle, goodberry\n1/day each: barkskin, pass without trace, shillelagh"
      ],
      [
        "Magic Resistance",
        "The dryad has advantage on saving throws against spells and other magical effects."
      ],
      [
        "Speak with Beasts and Plants",
        "The dryad can communicate with beasts and plants as if they shared a language."
      ],
      [
        "Tree Stride",
        "Once on her turn, the dryad can use 10 ft. of her movement to step magically into one living tree within her reach and emerge from a second living tree within 60 ft. of the first tree, appearing in an unoccupied space within 5 ft. of the second tree. Both trees must be large or bigger."
      ]
    ],
    "actions": [
      {
        "name": "Club",
        "atk": 2,
        "reach": "5 ft",
        "dmg": "1d4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +2 to hit (+6 to hit with shillelagh), reach 5 ft., one target. Hit: 2 (1d4) bludgeoning damage, or 8 (1d8 + 4) bludgeoning damage with shillelagh."
      },
      {
        "name": "Fey Charm",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dryad targets one humanoid or beast that she can see within 30 feet of her. If the target can see the dryad, it must succeed on a DC 14 Wisdom saving throw or be magically charmed. The charmed creature regards the dryad as a trusted friend to be heeded and protected. Although the target isn't under the dryad's control, it takes the dryad's requests or actions in the most favorable way it can.\nEach time the dryad or its allies do anything harmful to the target, it can repeat the saving throw, ending the effect on itself on a success. Otherwise, the effect lasts 24 hours or until the dryad dies, is on a different plane of existence from the target, or ends the effect as a bonus action. If a target's saving throw is successful, the target is immune to the dryad's Fey Charm for the next 24 hours.\nThe dryad can have no more than one humanoid and up to three beasts charmed at a time."
      }
    ]
  },
  "灰矮人": {
    "en": "Duergar",
    "size": "中型",
    "type": "类人妖",
    "alignment": "守序邪恶",
    "ac": 16,
    "ac_note": "Scale Mail, Shield",
    "hp": "26 (4d8)",
    "speed": "25 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "毒"
    ],
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 10}",
    "languages": "矮人语, 地底语",
    "cr": "1",
    "traits": [
      [
        "Duergar Resilience",
        "The duergar has advantage on saving throws against poison, spells, and illusions, as well as to resist being charmed or paralyzed."
      ],
      [
        "Sunlight Sensitivity",
        "While in sunlight, the duergar has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight."
      ]
    ],
    "actions": [
      {
        "name": "Enlarge",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "For 1 minute, the duergar magically increases in size, along with anything it is wearing or carrying. While enlarged, the duergar is Large, doubles its damage dice on Strength-based weapon attacks (included in the attacks), and makes Strength checks and Strength saving throws with advantage. If the duergar lacks the room to become Large, it attains the maximum size possible in the space available."
      },
      {
        "name": "War Pick",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d8+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8 + 2) piercing damage, or 11 (2d8 + 2) piercing damage while enlarged."
      },
      {
        "name": "Javelin",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d6+2",
        "type": "穿刺",
        "extra": "Melee or Ranged Weapon Attack: +4 to hit, reach 5 ft. or range 30/120 ft., one target. Hit: 5 (1d6 + 2) piercing damage, or 9 (2d6 + 2) piercing damage while enlarged."
      },
      {
        "name": "Invisibility",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The duergar magically turns invisible until it attacks, casts a spell, or uses its Enlarge, or until its concentration is broken, up to 1 hour (as if concentrating on a spell). Any equipment the duergar wears or carries is invisible with it."
      }
    ]
  },
  "尘魔蝠": {
    "en": "Dust Mephit",
    "size": "小型",
    "type": "元素",
    "alignment": "中立邪恶",
    "ac": 12,
    "ac_note": "dex",
    "hp": "17 (5d6)",
    "speed": "30 ft., 飞行 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "毒"
    ],
    "vuln": [
      "火"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 12}",
    "languages": "气族语, 土族语",
    "cr": "1/2",
    "traits": [
      [
        "Death Burst",
        "When the mephit dies, it explodes in a burst of dust. Each creature within 5 ft. of it must then succeed on a DC 10 Constitution saving throw or be blinded for 1 minute. A blinded creature can repeat the saving throw on each of its turns, ending the effect on itself on a success."
      ],
      [
        "Innate Spellcasting",
        "The mephit can innately cast sleep, requiring no material components. Its innate spellcasting ability is Charisma."
      ]
    ],
    "actions": [
      {
        "name": "Claws",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d4+2",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 4 (1d4 + 2) slashing damage."
      },
      {
        "name": "Blinding Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The mephit exhales a 15-foot cone of blinding dust. Each creature in that area must succeed on a DC 10 Dexterity saving throw or be blinded for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ]
  },
  "鹰": {
    "en": "Eagle",
    "size": "小型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "dex",
    "hp": "3 (1d6)",
    "speed": "10 ft., 飞行 60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 14}",
    "languages": "—",
    "cr": "0",
    "traits": [
      [
        "Keen Sight",
        "The eagle has advantage on Wisdom (Perception) checks that rely on sight."
      ]
    ],
    "actions": [
      {
        "name": "Talons",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d4+2",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) slashing damage."
      }
    ]
  },
  "土元素": {
    "en": "Earth Elemental",
    "size": "大型",
    "type": "元素",
    "alignment": "中立",
    "ac": 17,
    "ac_note": "natural",
    "hp": "126 (12d10)",
    "speed": "30 ft., 掘地 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "毒"
    ],
    "vuln": [
      "雷"
    ],
    "cond_immune": [
      "力竭",
      "麻痹",
      "石化",
      "中毒",
      "昏迷"
    ],
    "senses": "{'黑暗视觉': '60 ft.', '震颤感知': '60 ft.', 'passive_perception': 10}",
    "languages": "土族语",
    "cr": "5",
    "traits": [
      [
        "Earth Glide",
        "The elemental can burrow through nonmagical, unworked earth and stone. While doing so, the elemental doesn't disturb the material it moves through."
      ],
      [
        "Siege Monster",
        "The elemental deals double damage to objects and structures."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The elemental makes two slam attacks."
      },
      {
        "name": "Slam",
        "atk": 8,
        "reach": "10 ft",
        "dmg": "2d8+5",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 14 (2d8 + 5) bludgeoning damage."
      }
    ]
  },
  "火巨灵": {
    "en": "Efreeti",
    "size": "大型",
    "type": "元素",
    "alignment": "守序邪恶",
    "ac": 17,
    "ac_note": "natural",
    "hp": "200 (16d10)",
    "speed": "40 ft., 飞行 60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "火"
    ],
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 12}",
    "languages": "火族语",
    "cr": "11",
    "traits": [
      [
        "Elemental Demise",
        "If the efreeti dies, its body disintegrates in a flash of fire and puff of smoke, leaving behind only equipment the djinni was wearing or carrying."
      ],
      [
        "Innate Spellcasting",
        "The efreeti's innate spell casting ability is Charisma (spell save DC 15, +7 to hit with spell attacks). It can innately cast the following spells, requiring no material components:\n\nAt will: detect magic\n3/day: enlarge/reduce, tongues\n1/day each: conjure elemental (fire elemental only), gaseous form, invisibility, major image, plane shift, wall of fire"
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The efreeti makes two scimitar attacks or uses its Hurl Flame twice."
      },
      {
        "name": "Scimitar",
        "atk": 10,
        "reach": "5 ft",
        "dmg": "2d6+6",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage plus 7 (2d6) fire damage."
      },
      {
        "name": "Hurl Flame",
        "atk": 7,
        "reach": "120 ft",
        "dmg": "5d6",
        "type": "火",
        "extra": "Ranged Spell Attack: +7 to hit, range 120 ft., one target. Hit: 17 (5d6) fire damage."
      }
    ]
  },
  "象": {
    "en": "Elephant",
    "size": "超大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "natural",
    "hp": "76 (8d12)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 10}",
    "languages": "—",
    "cr": "4",
    "traits": [
      [
        "Trampling Charge",
        "If the elephant moves at least 20 ft. straight toward a creature and then hits it with a gore attack on the same turn, that target must succeed on a DC 12 Strength saving throw or be knocked prone. If the target is prone, the elephant can make one stomp attack against it as a bonus action."
      ]
    ],
    "actions": [
      {
        "name": "Gore",
        "atk": 8,
        "reach": "5 ft",
        "dmg": "3d8+6",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 19 (3d8 + 6) piercing damage."
      },
      {
        "name": "Stomp",
        "atk": 8,
        "reach": "5 ft",
        "dmg": "3d10+6",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +8 to hit, reach 5 ft., one prone creature. Hit: 22 (3d10 + 6) bludgeoning damage."
      }
    ]
  },
  "驼鹿": {
    "en": "Elk",
    "size": "大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 10,
    "ac_note": "dex",
    "hp": "13 (2d10)",
    "speed": "50 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 10}",
    "languages": "—",
    "cr": "1/4",
    "traits": [
      [
        "Charge",
        "If the elk moves at least 20 ft. straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 7 (2d6) damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone."
      ]
    ],
    "actions": [
      {
        "name": "Ram",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d6+3",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) bludgeoning damage."
      },
      {
        "name": "Hooves",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "2d4+3",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one prone creature. Hit: 8 (2d4 + 3) bludgeoning damage."
      }
    ]
  },
  "厄倪尼斯": {
    "en": "Erinyes",
    "size": "中型",
    "type": "邪魔",
    "alignment": "守序邪恶",
    "ac": 18,
    "ac_note": "Plate Armor",
    "hp": "153 (18d8)",
    "speed": "30 ft., 飞行 60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "冷",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "火",
      "毒"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'真实视觉': '120 ft.', 'passive_perception': 12}",
    "languages": "炼狱语, telepathy 120 ft.",
    "cr": "12",
    "traits": [
      [
        "Hellish Weapons",
        "The erinyes's weapon attacks are magical and deal an extra 13 (3d8) poison damage on a hit (included in the attacks)."
      ],
      [
        "Magic Resistance",
        "The erinyes has advantage on saving throws against spells and other magical effects."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The erinyes makes three attacks"
      },
      {
        "name": "Longsword",
        "atk": 8,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 8 (1d8 + 4) slashing damage, or 9 (1d10 + 4) slashing damage if used with two hands, plus 13 (3d8) poison damage."
      },
      {
        "name": "Longbow",
        "atk": 7,
        "reach": "150/600 ft",
        "dmg": "1d8+3",
        "type": "穿刺",
        "extra": "Ranged Weapon Attack: +7 to hit, range 150/600 ft., one target. Hit: 7 (1d8 + 3) piercing damage plus 13 (3d8) poison damage, and the target must succeed on a DC 14 Constitution saving throw or be poisoned. The poison lasts until it is removed by the lesser restoration spell or similar magic."
      }
    ],
    "reactions": [
      {
        "name": "Parry",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The erinyes adds 4 to its AC against one melee attack that would hit it. To do so, the erinyes must see the attacker and be wielding a melee weapon."
      }
    ]
  },
  "伊特怪": {
    "en": "Ettercap",
    "size": "中型",
    "type": "怪兽",
    "alignment": "中立邪恶",
    "ac": 13,
    "ac_note": "natural",
    "hp": "44 (8d8)",
    "speed": "30 ft., 爬 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 13}",
    "languages": "—",
    "cr": "2",
    "traits": [
      [
        "Spider Climb",
        "The ettercap can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."
      ],
      [
        "Web Sense",
        "While in contact with a web, the ettercap knows the exact location of any other creature in contact with the same web."
      ],
      [
        "Web Walker",
        "The ettercap ignores movement restrictions caused by webbing."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The ettercap makes two attacks: one with its bite and one with its claws."
      },
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d8+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 6 (1d8 + 2) piercing damage plus 4 (1d8) poison damage. The target must succeed on a DC 11 Constitution saving throw or be poisoned for 1 minute. The creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      },
      {
        "name": "Claws",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "2d4+2",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (2d4 + 2) slashing damage."
      },
      {
        "name": "Web",
        "atk": 4,
        "reach": "30/60 ft",
        "dmg": "",
        "type": "",
        "extra": "Ranged Weapon Attack: +4 to hit, range 30/60 ft., one Large or smaller creature. Hit: The creature is restrained by webbing. As an action, the restrained creature can make a DC 11 Strength check, escaping from the webbing on a success. The effect ends if the webbing is destroyed. The webbing has AC 10, 5 hit points, is vulnerable to fire damage and immune to bludgeoning damage."
      }
    ]
  },
  "双头巨人": {
    "en": "Ettin",
    "size": "大型",
    "type": "巨人",
    "alignment": "混乱邪恶",
    "ac": 12,
    "ac_note": "natural",
    "hp": "85 (10d10)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 14}",
    "languages": "巨语, 兽人语",
    "cr": "4",
    "traits": [
      [
        "Two Heads",
        "The ettin has advantage on Wisdom (Perception) checks and on saving throws against being blinded, charmed, deafened, frightened, stunned, and knocked unconscious."
      ],
      [
        "Wakeful",
        "When one of the ettin's heads is asleep, its other head is awake."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The ettin makes two attacks: one with its battleaxe and one with its morningstar."
      },
      {
        "name": "Battleaxe",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "2d8+5",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 14 (2d8 + 5) slashing damage."
      },
      {
        "name": "Morningstar",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "2d8+5",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 14 (2d8 + 5) piercing damage."
      }
    ]
  },
  "火元素": {
    "en": "Fire Elemental",
    "size": "大型",
    "type": "元素",
    "alignment": "中立",
    "ac": 13,
    "ac_note": "dex",
    "hp": "102 (12d10)",
    "speed": "50 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "火",
      "毒"
    ],
    "cond_immune": [
      "力竭",
      "擒抱",
      "麻痹",
      "石化",
      "中毒",
      "倒地",
      "束缚",
      "昏迷"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "火族语",
    "cr": "5",
    "traits": [
      [
        "Fire Form",
        "The elemental can move through a space as narrow as 1 inch wide without squeezing. A creature that touches the elemental or hits it with a melee attack while within 5 ft. of it takes 5 (1d10) fire damage. In addition, the elemental can enter a hostile creature's space and stop there. The first time it enters a creature's space on a turn, that creature takes 5 (1d10) fire damage and catches fire; until someone takes an action to douse the fire, the creature takes 5 (1d10) fire damage at the start of each of its turns."
      ],
      [
        "Illumination",
        "The elemental sheds bright light in a 30-foot radius and dim light in an additional 30 ft.."
      ],
      [
        "Water Susceptibility",
        "For every 5 ft. the elemental moves in water, or for every gallon of water splashed on it, it takes 1 cold damage."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The elemental makes two touch attacks."
      },
      {
        "name": "Touch",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d6+3",
        "type": "火",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) fire damage. If the target is a creature or a flammable object, it ignites. Until a creature takes an action to douse the fire, the target takes 5 (1d10) fire damage at the start of each of its turns."
      }
    ]
  },
  "火巨人": {
    "en": "Fire Giant",
    "size": "超大型",
    "type": "巨人",
    "alignment": "守序邪恶",
    "ac": 18,
    "ac_note": "Plate Armor",
    "hp": "162 (13d12)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "火"
    ],
    "senses": "{'passive_perception': 16}",
    "languages": "巨语",
    "cr": "9",
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The giant makes two greatsword attacks."
      },
      {
        "name": "Greatsword",
        "atk": 11,
        "reach": "10 ft",
        "dmg": "6d6+7",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 28 (6d6 + 7) slashing damage."
      },
      {
        "name": "Rock",
        "atk": 11,
        "reach": "60/240 ft",
        "dmg": "4d10+7",
        "type": "钝击",
        "extra": "Ranged Weapon Attack: +11 to hit, range 60/240 ft., one target. Hit: 29 (4d10 + 7) bludgeoning damage."
      }
    ]
  },
  "血肉魔像": {
    "en": "Flesh Golem",
    "size": "中型",
    "type": "构装",
    "alignment": "中立",
    "ac": 9,
    "ac_note": "dex",
    "hp": "93 (11d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "电",
      "毒",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "cond_immune": [
      "魅惑",
      "力竭",
      "惊惧",
      "麻痹",
      "石化",
      "中毒"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "understands the languages of its creator but can't speak",
    "cr": "5",
    "traits": [
      [
        "Berserk",
        "Whenever the golem starts its turn with 40 hit points or fewer, roll a d6. On a 6, the golem goes berserk. On each of its turns while berserk, the golem attacks the nearest creature it can see. If no creature is near enough to move to and attack, the golem attacks an object, with preference for an object smaller than itself. Once the golem goes berserk, it continues to do so until it is destroyed or regains all its hit points.\nThe golem's creator, if within 60 feet of the berserk golem, can try to calm it by speaking firmly and persuasively. The golem must be able to hear its creator, who must take an action to make a DC 15 Charisma (Persuasion) check. If the check succeeds, the golem ceases being berserk. If it takes damage while still at 40 hit points or fewer, the golem might go berserk again."
      ],
      [
        "Aversion of Fire",
        "If the golem takes fire damage, it has disadvantage on attack rolls and ability checks until the end of its next turn."
      ],
      [
        "Immutable Form",
        "The golem is immune to any spell or effect that would alter its form."
      ],
      [
        "Lightning Absorption",
        "Whenever the golem is subjected to lightning damage, it takes no damage and instead regains a number of hit points equal to the lightning damage dealt."
      ],
      [
        "Magic Resistance",
        "The golem has advantage on saving throws against spells and other magical effects."
      ],
      [
        "Magic Weapons",
        "The golem's weapon attacks are magical."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The golem makes two slam attacks."
      },
      {
        "name": "Slam",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "2d8+4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) bludgeoning damage."
      }
    ]
  },
  "飞蛇": {
    "en": "Flying Snake",
    "size": "超小型",
    "type": "野兽",
    "alignment": "无",
    "ac": 14,
    "ac_note": "dex",
    "hp": "5 (2d4)",
    "speed": "30 ft., 飞行 60 ft., 游泳 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'盲视': '10 ft.', 'passive_perception': 11}",
    "languages": "—",
    "cr": "1/8",
    "traits": [
      [
        "Flyby",
        "The snake doesn't provoke opportunity attacks when it flies out of an enemy's reach."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "1",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 1 piercing damage plus 7 (3d4) poison damage."
      }
    ]
  },
  "飞剑": {
    "en": "Flying Sword",
    "size": "小型",
    "type": "构装",
    "alignment": "无",
    "ac": 17,
    "ac_note": "natural",
    "hp": "17 (5d6)",
    "speed": "0 ft., 飞行 50 ft., 悬浮 True",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "毒",
      "心灵"
    ],
    "cond_immune": [
      "目盲",
      "魅惑",
      "目盲",
      "惊惧",
      "麻痹",
      "石化",
      "中毒"
    ],
    "senses": "{'盲视': '60 ft. (blind beyond this radius)', 'passive_perception': 7}",
    "languages": "—",
    "cr": "1/4",
    "traits": [
      [
        "Antimagic Susceptibility",
        "The sword is incapacitated while in the area of an antimagic field. If targeted by dispel magic, the sword must succeed on a Constitution saving throw against the caster's spell save DC or fall unconscious for 1 minute."
      ],
      [
        "False Appearance",
        "While the sword remains motionless and isn't flying, it is indistinguishable from a normal sword."
      ]
    ],
    "actions": [
      {
        "name": "Longsword",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "1d8+1",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 5 (1d8 + 1) slashing damage."
      }
    ]
  },
  "蛙": {
    "en": "Frog",
    "size": "超小型",
    "type": "野兽",
    "alignment": "无",
    "ac": 11,
    "ac_note": "dex",
    "hp": "1 (1d4)",
    "speed": "20 ft., 游泳 20 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '30 ft.', 'passive_perception': 11}",
    "languages": "—",
    "cr": "0",
    "traits": [
      [
        "Amphibious",
        "The frog can breathe air and water"
      ],
      [
        "Standing Leap",
        "The frog's long jump is up to 10 ft. and its high jump is up to 5 ft., with or without a running start."
      ]
    ],
    "actions": []
  },
  "冰霜巨人": {
    "en": "Frost Giant",
    "size": "超大型",
    "type": "巨人",
    "alignment": "中立邪恶",
    "ac": 15,
    "ac_note": "armor",
    "hp": "138 (12d12)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "冷"
    ],
    "senses": "{'passive_perception': 13}",
    "languages": "巨语",
    "cr": "8",
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The giant makes two greataxe attacks."
      },
      {
        "name": "Greataxe",
        "atk": 9,
        "reach": "10 ft",
        "dmg": "3d12+6",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 25 (3d12 + 6) slashing damage."
      },
      {
        "name": "Rock",
        "atk": 9,
        "reach": "60/240 ft",
        "dmg": "4d10+6",
        "type": "钝击",
        "extra": "Ranged Weapon Attack: +9 to hit, range 60/240 ft., one target. Hit: 28 (4d10 + 6) bludgeoning damage."
      }
    ]
  },
  "石像鬼": {
    "en": "Gargoyle",
    "size": "中型",
    "type": "元素",
    "alignment": "混乱邪恶",
    "ac": 15,
    "ac_note": "natural",
    "hp": "52 (7d8)",
    "speed": "30 ft., 飞行 60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "毒"
    ],
    "cond_immune": [
      "力竭",
      "石化",
      "中毒"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "土族语",
    "cr": "2",
    "traits": [
      [
        "False Appearance",
        "While the gargoyle remains motion less, it is indistinguishable from an inanimate statue."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The gargoyle makes two attacks: one with its bite and one with its claws."
      },
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d6+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage."
      },
      {
        "name": "Claws",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d6+2",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) slashing damage."
      }
    ]
  },
  "凝胶立方": {
    "en": "Gelatinous Cube",
    "size": "大型",
    "type": "泥形",
    "alignment": "无",
    "ac": 6,
    "ac_note": "dex",
    "hp": "84 (8d10)",
    "speed": "15 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "cond_immune": [
      "目盲",
      "魅惑",
      "耳聋",
      "力竭",
      "惊惧",
      "倒地"
    ],
    "senses": "{'盲视': '60 ft. (blind beyond this radius)', 'passive_perception': 8}",
    "languages": "—",
    "cr": "2",
    "traits": [
      [
        "Ooze Cube",
        "The cube takes up its entire space. Other creatures can enter the space, but a creature that does so is subjected to the cube's Engulf and has disadvantage on the saving throw.\nCreatures inside the cube can be seen but have total cover.\nA creature within 5 feet of the cube can take an action to pull a creature or object out of the cube. Doing so requires a successful DC 12 Strength check, and the creature making the attempt takes 10 (3d6) acid damage.\nThe cube can hold only one Large creature or up to four Medium or smaller creatures inside it at a time."
      ],
      [
        "Transparent",
        "Even when the cube is in plain sight, it takes a successful DC 15 Wisdom (Perception) check to spot a cube that has neither moved nor attacked. A creature that tries to enter the cube's space while unaware of the cube is surprised by the cube."
      ]
    ],
    "actions": [
      {
        "name": "Pseudopod",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "3d6",
        "type": "酸",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 10 (3d6) acid damage."
      },
      {
        "name": "Engulf",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "3d6",
        "type": "酸",
        "extra": "The cube moves up to its speed. While doing so, it can enter Large or smaller creatures' spaces. Whenever the cube enters a creature's space, the creature must make a DC 12 Dexterity saving throw.\nOn a successful save, the creature can choose to be pushed 5 feet back or to the side of the cube. A creature that chooses not to be pushed suffers the consequences of a failed saving throw.\nOn a failed save, the cube enters the creature's space, and the creature takes 10 (3d6) acid damage and is engulfed. The engulfed creature can't breathe, is restrained, and takes 21 (6d6) acid damage at the start of each of the cube's turns. When the cube moves, the engulfed creature moves with it.\nAn engulfed creature can try to escape by taking an action to make a DC 12 Strength check. On a success, the creature escapes and enters a space of its choice within 5 feet of the cube."
      }
    ]
  },
  "妖鬼们": {
    "en": "Ghast",
    "size": "中型",
    "type": "不死",
    "alignment": "混乱邪恶",
    "ac": 13,
    "ac_note": "dex",
    "hp": "36 (8d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "坏死"
    ],
    "immune": [
      "毒"
    ],
    "cond_immune": [
      "中毒",
      "魅惑",
      "力竭"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "通用语",
    "cr": "2",
    "traits": [
      [
        "Stench",
        "Any creature that starts its turn within 5 ft. of the ghast must succeed on a DC 10 Constitution saving throw or be poisoned until the start of its next turn. On a successful saving throw, the creature is immune to the ghast's Stench for 24 hours."
      ],
      [
        "Turn Defiance",
        "The ghast and any ghouls within 30 ft. of it have advantage on saving throws against effects that turn undead."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "2d8+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one creature. Hit: 12 (2d8 + 3) piercing damage."
      },
      {
        "name": "Claws",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "2d6+3",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) slashing damage. If the target is a creature other than an undead, it must succeed on a DC 10 Constitution saving throw or be paralyzed for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ]
  },
  "幽灵": {
    "en": "Ghost",
    "size": "中型",
    "type": "不死",
    "alignment": "任意",
    "ac": 11,
    "ac_note": "dex",
    "hp": "45 (10d8)",
    "speed": "0 ft., 飞行 40 ft., 悬浮 True",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "酸",
      "火",
      "电",
      "雷",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "冷",
      "坏死",
      "毒"
    ],
    "cond_immune": [
      "魅惑",
      "力竭",
      "惊惧",
      "擒抱",
      "麻痹",
      "石化",
      "中毒",
      "倒地",
      "束缚"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 11}",
    "languages": "any languages it knew in life",
    "cr": "4",
    "traits": [
      [
        "Ethereal Sight",
        "The ghost can see 60 ft. into the Ethereal Plane when it is on the Material Plane, and vice versa."
      ],
      [
        "Incorporeal Movement",
        "The ghost can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object."
      ]
    ],
    "actions": [
      {
        "name": "Withering Touch",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "4d6+3",
        "type": "坏死",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 17 (4d6 + 3) necrotic damage."
      },
      {
        "name": "Etherealness",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The ghost enters the Ethereal Plane from the Material Plane, or vice versa. It is visible on the Material Plane while it is in the Border Ethereal, and vice versa, yet it can't affect or be affected by anything on the other plane."
      },
      {
        "name": "Horrifying Visage",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Each non-undead creature within 60 ft. of the ghost that can see it must succeed on a DC 13 Wisdom saving throw or be frightened for 1 minute. If the save fails by 5 or more, the target also ages 1d4 × 10 years. A frightened target can repeat the saving throw at the end of each of its turns, ending the frightened condition on itself on a success. If a target's saving throw is successful or the effect ends for it, the target is immune to this ghost's Horrifying Visage for the next 24 hours. The aging effect can be reversed with a greater restoration spell, but only within 24 hours of it occurring."
      },
      {
        "name": "Possession",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "One humanoid that the ghost can see within 5 ft. of it must succeed on a DC 13 Charisma saving throw or be possessed by the ghost; the ghost then disappears, and the target is incapacitated and loses control of its body. The ghost now controls the body but doesn't deprive the target of awareness. The ghost can't be targeted by any attack, spell, or other effect, except ones that turn undead, and it retains its alignment, Intelligence, Wisdom, Charisma, and immunity to being charmed and frightened. It otherwise uses the possessed target's statistics, but doesn't gain access to the target's knowledge, class features, or proficiencies.\nThe possession lasts until the body drops to 0 hit points, the ghost ends it as a bonus action, or the ghost is turned or forced out by an effect like the dispel evil and good spell. When the possession ends, the ghost reappears in an unoccupied space within 5 ft. of the body. The target is immune to this ghost's Possession for 24 hours after succeeding on the saving throw or after the possession ends."
      }
    ]
  },
  "食尸鬼": {
    "en": "Ghoul",
    "size": "中型",
    "type": "不死",
    "alignment": "混乱邪恶",
    "ac": 12,
    "ac_note": "dex",
    "hp": "22 (5d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "毒"
    ],
    "cond_immune": [
      "中毒",
      "魅惑",
      "力竭"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "通用语",
    "cr": "1",
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "atk": 2,
        "reach": "5 ft",
        "dmg": "2d6+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +2 to hit, reach 5 ft., one creature. Hit: 9 (2d6 + 2) piercing damage."
      },
      {
        "name": "Claws",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "2d4+2",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (2d4 + 2) slashing damage. If the target is a creature other than an elf or undead, it must succeed on a DC 10 Constitution saving throw or be paralyzed for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ]
  },
  "巨猿": {
    "en": "Giant Ape",
    "size": "超大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "dex",
    "hp": "157 (15d12)",
    "speed": "40 ft., 爬 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 14}",
    "languages": "—",
    "cr": "7",
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The ape makes two fist attacks."
      },
      {
        "name": "Fist",
        "atk": 9,
        "reach": "10 ft",
        "dmg": "3d10+6",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 22 (3d10 + 6) bludgeoning damage."
      },
      {
        "name": "Rock",
        "atk": 9,
        "reach": "50/100 ft",
        "dmg": "7d6+6",
        "type": "钝击",
        "extra": "Ranged Weapon Attack: +9 to hit, range 50/100 ft., one target. Hit: 30 (7d6 + 6) bludgeoning damage."
      }
    ]
  },
  "巨獾": {
    "en": "Giant Badger",
    "size": "中型",
    "type": "野兽",
    "alignment": "无",
    "ac": 10,
    "ac_note": "dex",
    "hp": "13 (2d8)",
    "speed": "30 ft., 掘地 10 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '30 ft.', 'passive_perception': 11}",
    "languages": "—",
    "cr": "1/4",
    "traits": [
      [
        "Keen Smell",
        "The badger has advantage on Wisdom (Perception) checks that rely on smell."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The badger makes two attacks: one with its bite and one with its claws."
      },
      {
        "name": "Bite",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "1d6+1",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) piercing damage."
      },
      {
        "name": "Claws",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "2d4+1",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 6 (2d4 + 1) slashing damage."
      }
    ]
  },
  "巨蝙蝠": {
    "en": "Giant Bat",
    "size": "大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 13,
    "ac_note": "dex",
    "hp": "22 (4d10)",
    "speed": "10 ft., 飞行 60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'盲视': '60 ft.', 'passive_perception': 11}",
    "languages": "—",
    "cr": "1/4",
    "traits": [
      [
        "Echolocation",
        "The bat can't use its blindsight while deafened."
      ],
      [
        "Keen Hearing",
        "The bat has advantage on Wisdom (Perception) checks that rely on hearing."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d6+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 5 (1d6 + 2) piercing damage."
      }
    ]
  },
  "巨野猪": {
    "en": "Giant Boar",
    "size": "大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "natural",
    "hp": "42 (5d10)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 8}",
    "languages": "—",
    "cr": "2",
    "traits": [
      [
        "Charge",
        "If the boar moves at least 20 ft. straight toward a target and then hits it with a tusk attack on the same turn, the target takes an extra 7 (2d6) slashing damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone."
      ],
      [
        "Relentless",
        "If the boar takes 10 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead."
      ]
    ],
    "actions": [
      {
        "name": "Tusk",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "2d6+3",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) slashing damage."
      }
    ]
  },
  "巨蜈蚣": {
    "en": "Giant Centipede",
    "size": "小型",
    "type": "野兽",
    "alignment": "无",
    "ac": 13,
    "ac_note": "natural",
    "hp": "4 (1d6)",
    "speed": "30 ft., 爬 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'盲视': '30 ft.', 'passive_perception': 8}",
    "languages": "—",
    "cr": "1/4",
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d4+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 4 (1d4 + 2) piercing damage, and the target must succeed on a DC 11 Constitution saving throw or take 10 (3d6) poison damage. If the poison damage reduces the target to 0 hit points, the target is stable but poisoned for 1 hour, even after regaining hit points, and is paralyzed while poisoned in this way."
      }
    ]
  },
  "巨蟒": {
    "en": "Giant Constrictor Snake",
    "size": "超大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "dex",
    "hp": "60 (8d12)",
    "speed": "30 ft., 游泳 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'盲视': '10 ft.', 'passive_perception': 12}",
    "languages": "—",
    "cr": "2",
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "atk": 6,
        "reach": "10 ft",
        "dmg": "2d6+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +6 to hit, reach 10 ft., one creature. Hit: 11 (2d6 + 4) piercing damage."
      },
      {
        "name": "Constrict",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d8+4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one creature. Hit: 13 (2d8 + 4) bludgeoning damage, and the target is grappled (escape DC 16). Until this grapple ends, the creature is restrained, and the snake can't constrict another target."
      }
    ]
  },
  "巨蟹": {
    "en": "Giant Crab",
    "size": "中型",
    "type": "野兽",
    "alignment": "无",
    "ac": 15,
    "ac_note": "natural",
    "hp": "13 (3d8)",
    "speed": "30 ft., 游泳 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'盲视': '30 ft.', 'passive_perception': 9}",
    "languages": "—",
    "cr": "1/8",
    "traits": [
      [
        "Amphibious",
        "The crab can breathe air and water."
      ]
    ],
    "actions": [
      {
        "name": "Claw",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "1d6+1",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) bludgeoning damage, and the target is grappled (escape DC 11). The crab has two claws, each of which can grapple only one target."
      }
    ]
  },
  "巨鳄": {
    "en": "Giant Crocodile",
    "size": "超大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 14,
    "ac_note": "natural",
    "hp": "85 (9d12)",
    "speed": "30 ft., 游泳 50 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 10}",
    "languages": "—",
    "cr": "5",
    "traits": [
      [
        "Hold Breath",
        "The crocodile can hold its breath for 30 minutes."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The crocodile makes two attacks: one with its bite and one with its tail."
      },
      {
        "name": "Bite",
        "atk": 8,
        "reach": "5 ft",
        "dmg": "3d10+5",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 21 (3d10 + 5) piercing damage, and the target is grappled (escape DC 16). Until this grapple ends, the target is restrained, and the crocodile can't bite another target."
      },
      {
        "name": "Tail",
        "atk": 8,
        "reach": "10 ft",
        "dmg": "2d8+5",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +8 to hit, reach 10 ft., one target not grappled by the crocodile. Hit: 14 (2d8 + 5) bludgeoning damage. If the target is a creature, it must succeed on a DC 16 Strength saving throw or be knocked prone."
      }
    ]
  },
  "巨鹰": {
    "en": "Giant Eagle",
    "size": "大型",
    "type": "野兽",
    "alignment": "中立善良",
    "ac": 13,
    "ac_note": "dex",
    "hp": "26 (4d10)",
    "speed": "10 ft., 飞行 80 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 14}",
    "languages": "Giant Eagle, understands Common and Auran but can't speak",
    "cr": "1",
    "traits": [
      [
        "Keen Sight",
        "The eagle has advantage on Wisdom (Perception) checks that rely on sight."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The eagle makes two attacks: one with its beak and one with its talons."
      },
      {
        "name": "Beak",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d6+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) piercing damage."
      },
      {
        "name": "Talons",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "2d6+3",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) slashing damage."
      }
    ]
  },
  "巨驼鹿": {
    "en": "Giant Elk",
    "size": "超大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 14,
    "ac_note": "natural",
    "hp": "42 (5d12)",
    "speed": "60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 14}",
    "languages": "Giant Elk, understands Common, 精灵语, and Sylvan but can't speak",
    "cr": "2",
    "traits": [
      [
        "Charge",
        "If the elk moves at least 20 ft. straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 7 (2d6) damage. If the target is a creature, it must succeed on a DC 14 Strength saving throw or be knocked prone."
      ]
    ],
    "actions": [
      {
        "name": "Ram",
        "atk": 6,
        "reach": "10 ft",
        "dmg": "2d6+4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +6 to hit, reach 10 ft., one target. Hit: 11 (2d6 + 4) bludgeoning damage."
      },
      {
        "name": "Hooves",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "4d8+4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one prone creature. Hit: 22 (4d8 + 4) bludgeoning damage."
      }
    ]
  },
  "巨火甲虫": {
    "en": "Giant Fire Beetle",
    "size": "小型",
    "type": "野兽",
    "alignment": "无",
    "ac": 13,
    "ac_note": "natural",
    "hp": "4 (1d6)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'盲视': '30 ft.', 'passive_perception': 8}",
    "languages": "—",
    "cr": "0",
    "traits": [
      [
        "Illumination",
        "The beetle sheds bright light in a 10-foot radius and dim light for an additional 10 ft.."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 1,
        "reach": "5 ft",
        "dmg": "1d6-1",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +1 to hit, reach 5 ft., one target. Hit: 2 (1d6 - 1) slashing damage."
      }
    ]
  },
  "巨蛙": {
    "en": "Giant Frog",
    "size": "中型",
    "type": "野兽",
    "alignment": "无",
    "ac": 11,
    "ac_note": "dex",
    "hp": "18 (4d8)",
    "speed": "30 ft., 游泳 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '30 ft.', 'passive_perception': 12}",
    "languages": "—",
    "cr": "1/4",
    "traits": [
      [
        "Amphibious",
        "The frog can breathe air and water"
      ],
      [
        "Standing Leap",
        "The frog's long jump is up to 20 ft. and its high jump is up to 10 ft., with or without a running start."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "1d6+1",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) piercing damage, and the target is grappled (escape DC 11). Until this grapple ends, the target is restrained, and the frog can't bite another target."
      },
      {
        "name": "Swallow",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The frog makes one bite attack against a Small or smaller target it is grappling. If the attack hits, the target is swallowed, and the grapple ends. The swallowed target is blinded and restrained, it has total cover against attacks and other effects outside the frog, and it takes 5 (2d4) acid damage at the start of each of the frog's turns. The frog can have only one target swallowed at a time. If the frog dies, a swallowed creature is no longer restrained by it and can escape from the corpse using 5 ft. of movement, exiting prone."
      }
    ]
  },
  "巨山羊": {
    "en": "Giant Goat",
    "size": "大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 11,
    "ac_note": "dex",
    "hp": "19 (3d10)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 11}",
    "languages": "—",
    "cr": "1/2",
    "traits": [
      [
        "Charge",
        "If the goat moves at least 20 ft. straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 5 (2d4) bludgeoning damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone."
      ],
      [
        "Sure-Footed",
        "The goat has advantage on Strength and Dexterity saving throws made against effects that would knock it prone."
      ]
    ],
    "actions": [
      {
        "name": "Ram",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "2d4+3",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (2d4 + 3) bludgeoning damage."
      }
    ]
  },
  "巨鬣狗": {
    "en": "Giant Hyena",
    "size": "大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "dex",
    "hp": "45 (6d10)",
    "speed": "50 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 13}",
    "languages": "—",
    "cr": "1",
    "traits": [
      [
        "Rampage",
        "When the hyena reduces a creature to 0 hit points with a melee attack on its turn, the hyena can take a bonus action to move up to half its speed and make a bite attack."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "2d6+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) piercing damage."
      }
    ]
  },
  "巨蜥": {
    "en": "Giant Lizard",
    "size": "大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "natural",
    "hp": "19 (3d10)",
    "speed": "30 ft., 爬 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '30 ft.', 'passive_perception': 10}",
    "languages": "—",
    "cr": "1/4",
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d8+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8 + 2) piercing damage."
      }
    ]
  },
  "巨章鱼": {
    "en": "Giant Octopus",
    "size": "大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 11,
    "ac_note": "dex",
    "hp": "52 (8d10)",
    "speed": "10 ft., 游泳 60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 14}",
    "languages": "—",
    "cr": "1",
    "traits": [
      [
        "Hold Breath",
        "While out of water, the octopus can hold its breath for 1 hour."
      ],
      [
        "Underwater Camouflage",
        "The octopus has advantage on Dexterity (Stealth) checks made while underwater."
      ],
      [
        "Water Breathing",
        "The octopus can breathe only underwater."
      ]
    ],
    "actions": [
      {
        "name": "Tentacles",
        "atk": 5,
        "reach": "15 ft",
        "dmg": "2d6+3",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +5 to hit, reach 15 ft., one target. Hit: 10 (2d6 + 3) bludgeoning damage. If the target is a creature, it is grappled (escape DC 16). Until this grapple ends, the target is restrained, and the octopus can't use its tentacles on another target."
      },
      {
        "name": "Ink Cloud",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "A 20-foot-radius cloud of ink extends all around the octopus if it is underwater. The area is heavily obscured for 1 minute, although a significant current can disperse the ink. After releasing the ink, the octopus can use the Dash action as a bonus action."
      }
    ]
  },
  "巨鸮": {
    "en": "Giant Owl",
    "size": "大型",
    "type": "野兽",
    "alignment": "中立",
    "ac": 12,
    "ac_note": "dex",
    "hp": "19 (3d10)",
    "speed": "5 ft., 飞行 60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 15}",
    "languages": "Giant Owl, understands Common, 精灵语, and Sylvan but can't speak",
    "cr": "1/4",
    "traits": [
      [
        "Flyby",
        "The owl doesn't provoke opportunity attacks when it flies out of an enemy's reach."
      ],
      [
        "Keen Hearing and Sight",
        "The owl has advantage on Wisdom (Perception) checks that rely on hearing or sight."
      ]
    ],
    "actions": [
      {
        "name": "Talons",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "2d6+1",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 8 (2d6 + 1) slashing damage."
      }
    ]
  },
  "巨毒蛇": {
    "en": "Giant Poisonous Snake",
    "size": "中型",
    "type": "野兽",
    "alignment": "无",
    "ac": 14,
    "ac_note": "dex",
    "hp": "11 (2d8)",
    "speed": "30 ft., 游泳 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'盲视': '10 ft.', 'passive_perception': 12}",
    "languages": "—",
    "cr": "1/4",
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "atk": 6,
        "reach": "10 ft",
        "dmg": "1d4+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +6 to hit, reach 10 ft., one target. Hit: 6 (1d4 + 4) piercing damage, and the target must make a DC 11 Constitution saving throw, taking 10 (3d6) poison damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "巨鼠": {
    "en": "Giant Rat",
    "size": "小型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "dex",
    "hp": "7 (2d6)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "—",
    "cr": "1/8",
    "traits": [
      [
        "Keen Smell",
        "The rat has advantage on Wisdom (Perception) checks that rely on smell."
      ],
      [
        "Pack Tactics",
        "The rat has advantage on an attack roll against a creature if at least one of the rat's allies is within 5 ft. of the creature and the ally isn't incapacitated."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d4+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) piercing damage."
      }
    ]
  },
  "巨鼠（染病）": {
    "en": "Giant Rat (Diseased)",
    "size": "小型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "dex",
    "hp": "7 (2d6)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "—",
    "cr": "1/8",
    "traits": [
      [
        "Keen Smell",
        "The rat has advantage on Wisdom (Perception) checks that rely on smell."
      ],
      [
        "Pack Tactics",
        "The rat has advantage on an attack roll against a creature if at least one of the rat's allies is within 5 ft. of the creature and the ally isn't incapacitated."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d4+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 3 (1d4 + 2) piercing damage. If the target is a creature, it must succeed on a DC 10 Constitution saving throw or contract a disease. Until the disease is cured, the target can't regain hit points except by magical means, and the target's hit point maximum decreases by 3 (1d6) every 24 hours. If the target's hit point maximum drops to 0 as a result of this disease, the target dies."
      }
    ]
  },
  "巨蝎": {
    "en": "Giant Scorpion",
    "size": "大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 15,
    "ac_note": "natural",
    "hp": "52 (7d10)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'盲视': '60 ft.', 'passive_perception': 9}",
    "languages": "—",
    "cr": "3",
    "traits": [],
    "actions": [
      {
        "name": "Claw",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d8+2",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8 + 2) bludgeoning damage, and the target is grappled (escape DC 12). The scorpion has two claws, each of which can grapple only one target."
      },
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The scorpion makes three attacks: two with its claws and one with its sting."
      },
      {
        "name": "Sting",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d10+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 7 (1d10 + 2) piercing damage, and the target must make a DC 12 Constitution saving throw, taking 22 (4d10) poison damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "巨海马": {
    "en": "Giant Sea Horse",
    "size": "大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 13,
    "ac_note": "natural",
    "hp": "16 (3d10)",
    "speed": "0 ft., 游泳 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 11}",
    "languages": "—",
    "cr": "1/2",
    "traits": [
      [
        "Charge",
        "If the sea horse moves at least 20 ft. straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 7 (2d6) bludgeoning damage. If the target is a creature, it must succeed on a DC 11 Strength saving throw or be knocked prone."
      ],
      [
        "Water Breathing",
        "The sea horse can breathe only underwater."
      ]
    ],
    "actions": [
      {
        "name": "Ram",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "1d6+1",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) bludgeoning damage."
      }
    ]
  },
  "巨鲨": {
    "en": "Giant Shark",
    "size": "超大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 13,
    "ac_note": "natural",
    "hp": "126 (11d12)",
    "speed": "游泳 50 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'盲视': '60 ft.', 'passive_perception': 13}",
    "languages": "—",
    "cr": "5",
    "traits": [
      [
        "Blood Frenzy",
        "The shark has advantage on melee attack rolls against any creature that doesn't have all its hit points."
      ],
      [
        "Water Breathing",
        "The shark can breathe only underwater."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 9,
        "reach": "5 ft",
        "dmg": "3d10+6",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 22 (3d10 + 6) piercing damage."
      }
    ]
  },
  "巨型蜘蛛": {
    "en": "Giant Spider",
    "size": "大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 14,
    "ac_note": "natural",
    "hp": "26 (4d10)",
    "speed": "30 ft., 爬 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'盲视': '10 ft.', '黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "—",
    "cr": "1",
    "traits": [
      [
        "Spider Climb",
        "The spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."
      ],
      [
        "Web Sense",
        "While in contact with a web, the spider knows the exact location of any other creature in contact with the same web."
      ],
      [
        "Web Walker",
        "The spider ignores movement restrictions caused by webbing."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d8+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one creature. Hit: 7 (1d8 + 3) piercing damage, and the target must make a DC 11 Constitution saving throw, taking 9 (2d8) poison damage on a failed save, or half as much damage on a successful one. If the poison damage reduces the target to 0 hit points, the target is stable but poisoned for 1 hour, even after regaining hit points, and is paralyzed while poisoned in this way."
      },
      {
        "name": "Web",
        "atk": 5,
        "reach": "30/60 ft",
        "dmg": "",
        "type": "",
        "extra": "Ranged Weapon Attack: +5 to hit, range 30/60 ft., one creature. Hit: The target is restrained by webbing. As an action, the restrained target can make a DC 12 Strength check, bursting the webbing on a success. The webbing can also be attacked and destroyed (AC 10; hp 5; vulnerability to fire damage; immunity to bludgeoning, poison, and psychic damage)."
      }
    ]
  },
  "巨蟾蜍": {
    "en": "Giant Toad",
    "size": "大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 11,
    "ac_note": "dex",
    "hp": "39 (6d10)",
    "speed": "20 ft., 游泳 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '30 ft.', 'passive_perception': 10}",
    "languages": "—",
    "cr": "1",
    "traits": [
      [
        "Amphibious",
        "The toad can breathe air and water"
      ],
      [
        "Standing Leap",
        "The toad's long jump is up to 20 ft. and its high jump is up to 10 ft., with or without a running start."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d10+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (1d10 + 2) piercing damage plus 5 (1d10) poison damage, and the target is grappled (escape DC 13). Until this grapple ends, the target is restrained, and the toad can't bite another target."
      },
      {
        "name": "Swallow",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The toad makes one bite attack against a Medium or smaller target it is grappling. If the attack hits, the target is swallowed, and the grapple ends. The swallowed target is blinded and restrained, it has total cover against attacks and other effects outside the toad, and it takes 10 (3d6) acid damage at the start of each of the toad's turns. The toad can have only one target swallowed at a time.\nIf the toad dies, a swallowed creature is no longer restrained by it and can escape from the corpse using 5 feet of movement, exiting prone."
      }
    ]
  },
  "巨秃鹫": {
    "en": "Giant Vulture",
    "size": "大型",
    "type": "野兽",
    "alignment": "中立邪恶",
    "ac": 10,
    "ac_note": "dex",
    "hp": "22 (3d10)",
    "speed": "10 ft., 飞行 60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 13}",
    "languages": "understands Common but can't speak",
    "cr": "1",
    "traits": [
      [
        "Keen Sight and Smell",
        "The vulture has advantage on Wisdom (Perception) checks that rely on sight or smell."
      ],
      [
        "Pack Tactics",
        "The vulture has advantage on an attack roll against a creature if at least one of the vulture's allies is within 5 ft. of the creature and the ally isn't incapacitated."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The vulture makes two attacks: one with its beak and one with its talons."
      },
      {
        "name": "Beak",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "2d4+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (2d4 + 2) piercing damage."
      },
      {
        "name": "Talons",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "2d6+2",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 9 (2d6 + 2) slashing damage."
      }
    ]
  },
  "巨蜂": {
    "en": "Giant Wasp",
    "size": "中型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "dex",
    "hp": "13 (3d8)",
    "speed": "10 ft., 飞行 50 ft., 游泳 50 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 10}",
    "languages": "—",
    "cr": "1/2",
    "traits": [],
    "actions": [
      {
        "name": "Sting",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d6+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 5 (1d6 + 2) piercing damage, and the target must make a DC 11 Constitution saving throw, taking 10 (3d6) poison damage on a failed save, or half as much damage on a successful one. If the poison damage reduces the target to 0 hit points, the target is stable but poisoned for 1 hour, even after regaining hit points, and is paralyzed while poisoned in this way."
      }
    ]
  },
  "巨鼬": {
    "en": "Giant Weasel",
    "size": "中型",
    "type": "野兽",
    "alignment": "无",
    "ac": 13,
    "ac_note": "dex",
    "hp": "9 (2d8)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 13}",
    "languages": "—",
    "cr": "1/8",
    "traits": [
      [
        "Keen Hearing and Smell",
        "The weasel has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d4+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 5 (1d4 + 3) piercing damage."
      }
    ]
  },
  "巨狼蛛": {
    "en": "Giant Wolf Spider",
    "size": "中型",
    "type": "野兽",
    "alignment": "无",
    "ac": 13,
    "ac_note": "dex",
    "hp": "11 (2d8)",
    "speed": "40 ft., 爬 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'盲视': '10 ft.', '黑暗视觉': '60 ft.', 'passive_perception': 13}",
    "languages": "—",
    "cr": "1/4",
    "traits": [
      [
        "Spider Climb",
        "The spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."
      ],
      [
        "Web Sense",
        "While in contact with a web, the spider knows the exact location of any other creature in contact with the same web."
      ],
      [
        "Web Walker",
        "The spider ignores movement restrictions caused by webbing."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "1d6+1",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one creature. Hit: 4 (1d6 + 1) piercing damage, and the target must make a DC 11 Constitution saving throw, taking 7 (2d6) poison damage on a failed save, or half as much damage on a successful one. If the poison damage reduces the target to 0 hit points, the target is stable but poisoned for 1 hour, even after regaining hit points, and is paralyzed while poisoned in this way."
      }
    ]
  },
  "喋喋魔口": {
    "en": "Gibbering Mouther",
    "size": "中型",
    "type": "异怪",
    "alignment": "中立",
    "ac": 9,
    "ac_note": "dex",
    "hp": "67 (9d8)",
    "speed": "10 ft., 游泳 10 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "cond_immune": [
      "倒地"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "—",
    "cr": "2",
    "traits": [
      [
        "Aberrant Ground",
        "The ground in a 10-foot radius around the mouther is doughlike difficult terrain. Each creature that starts its turn in that area must succeed on a DC 10 Strength saving throw or have its speed reduced to 0 until the start of its next turn."
      ],
      [
        "Gibbering",
        "The mouther babbles incoherently while it can see any creature and isn't incapacitated. Each creature that starts its turn within 20 feet of the mouther and can hear the gibbering must succeed on a DC 10 Wisdom saving throw. On a failure, the creature can't take reactions until the start of its next turn and rolls a d8 to determine what it does during its turn. On a 1 to 4, the creature does nothing. On a 5 or 6, the creature takes no action or bonus action and uses all its movement to move in a randomly determined direction. On a 7 or 8, the creature makes a melee attack against a randomly determined creature within its reach or does nothing if it can't make such an attack."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The gibbering mouther makes one bite attack and, if it can, uses its Blinding Spittle."
      },
      {
        "name": "Bites",
        "atk": 2,
        "reach": "5 ft",
        "dmg": "5d6",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +2 to hit, reach 5 ft., one creature. Hit: 17 (5d6) piercing damage. If the target is Medium or smaller, it must succeed on a DC 10 Strength saving throw or be knocked prone. If the target is killed by this damage, it is absorbed into the mouther."
      },
      {
        "name": "Blinding Spittle",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The mouther spits a chemical glob at a point it can see within 15 feet of it. The glob explodes in a blinding flash of light on impact. Each creature within 5 feet of the flash must succeed on a DC 13 Dexterity saving throw or be blinded until the end of the mouther's next turn."
      }
    ]
  },
  "迷诱魔": {
    "en": "Glabrezu",
    "size": "大型",
    "type": "邪魔",
    "alignment": "混乱邪恶",
    "ac": 17,
    "ac_note": "natural",
    "hp": "157 (15d10)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "冷",
      "火",
      "电",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "毒"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'真实视觉': '120 ft.', 'passive_perception': 13}",
    "languages": "深渊语, telepathy 120 ft.",
    "cr": "9",
    "traits": [
      [
        "Innate Spellcasting",
        "The glabrezu's spellcasting ability is Intelligence (spell save DC 16). The glabrezu can innately cast the following spells, requiring no material components:\nAt will: darkness, detect magic, dispel magic\n1/day each: confusion, fly, power word stun"
      ],
      [
        "Magic Resistance",
        "The glabrezu has advantage on saving throws against spells and other magical effects."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The glabrezu makes four attacks: two with its pincers and two with its fists. Alternatively, it makes two attacks with its pincers and casts one spell."
      },
      {
        "name": "Pincer",
        "atk": 9,
        "reach": "10 ft",
        "dmg": "2d10+5",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 16 (2d10 + 5) bludgeoning damage. If the target is a Medium or smaller creature, it is grappled (escape DC 15). The glabrezu has two pincers, each of which can grapple only one target."
      },
      {
        "name": "Fist",
        "atk": 9,
        "reach": "5 ft",
        "dmg": "2d4+2",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 7 (2d4 + 2) bludgeoning damage."
      }
    ]
  },
  "角斗士": {
    "en": "Gladiator",
    "size": "中型",
    "type": "类人妖",
    "alignment": "任意",
    "ac": 16,
    "ac_note": "Studded Leather Armor, Shield",
    "hp": "112 (15d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 11}",
    "languages": "any one language (usually Common)",
    "cr": "5",
    "traits": [
      [
        "Brave",
        "The gladiator has advantage on saving throws against being frightened."
      ],
      [
        "Brute",
        "A melee weapon deals one extra die of its damage when the gladiator hits with it (included in the attack)."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The gladiator makes three melee attacks or two ranged attacks."
      },
      {
        "name": "Spear",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee or Ranged Weapon Attack: +7 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 11 (2d6 + 4) piercing damage, or 13 (2d8 + 4) piercing damage if used with two hands to make a melee attack."
      },
      {
        "name": "Shield Bash",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "2d4+4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one creature. Hit: 9 (2d4 + 4) bludgeoning damage. If the target is a Medium or smaller creature, it must succeed on a DC 15 Strength saving throw or be knocked prone."
      }
    ],
    "reactions": [
      {
        "name": "Parry",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The gladiator adds 3 to its AC against one melee attack that would hit it. To do so, the gladiator must see the attacker and be wielding a melee weapon."
      }
    ]
  },
  "豺狼人": {
    "en": "Gnoll",
    "size": "中型",
    "type": "类人妖",
    "alignment": "混乱邪恶",
    "ac": 15,
    "ac_note": "Hide Armor, Shield",
    "hp": "22 (5d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "Gnoll",
    "cr": "1/2",
    "traits": [
      [
        "Rampage",
        "When the gnoll reduces a creature to 0 hit points with a melee attack on its turn, the gnoll can take a bonus action to move up to half its speed and make a bite attack."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d4+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 4 (1d4 + 2) piercing damage."
      },
      {
        "name": "Spear",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee or Ranged Weapon Attack: +4 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 5 (1d6 + 2) piercing damage, or 6 (1d8 + 2) piercing damage if used with two hands to make a melee attack."
      },
      {
        "name": "Longbow",
        "atk": 3,
        "reach": "150/600 ft",
        "dmg": "1d8+1",
        "type": "穿刺",
        "extra": "Ranged Weapon Attack: +3 to hit, range 150/600 ft., one target. Hit: 5 (1d8 + 1) piercing damage."
      }
    ]
  },
  "山羊": {
    "en": "Goat",
    "size": "中型",
    "type": "野兽",
    "alignment": "无",
    "ac": 10,
    "ac_note": "dex",
    "hp": "4 (1d8)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 10}",
    "languages": "—",
    "cr": "0",
    "traits": [
      [
        "Charge",
        "If the goat moves at least 20 ft. straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 2 (1d4) bludgeoning damage. If the target is a creature, it must succeed on a DC 10 Strength saving throw or be knocked prone."
      ],
      [
        "Sure-Footed",
        "The goat has advantage on Strength and Dexterity saving throws made against effects that would knock it prone."
      ]
    ],
    "actions": [
      {
        "name": "Ram",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "1d4+1",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3 (1d4 + 1) bludgeoning damage."
      }
    ]
  },
  "哥布林": {
    "en": "Goblin",
    "size": "小型",
    "type": "类人妖",
    "alignment": "中立邪恶",
    "ac": 15,
    "ac_note": "Leather Armor, Shield",
    "hp": "7 (2d6)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 9}",
    "languages": "通用语, 哥布林语",
    "cr": "1/4",
    "traits": [
      [
        "Nimble Escape",
        "The goblin can take the Disengage or Hide action as a bonus action on each of its turns."
      ]
    ],
    "actions": [
      {
        "name": "Scimitar",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d6+2",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) slashing damage."
      },
      {
        "name": "Shortbow",
        "atk": 4,
        "reach": "80/320 ft",
        "dmg": "1d6+2",
        "type": "穿刺",
        "extra": "Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target. Hit: 5 (1d6 + 2) piercing damage."
      }
    ]
  },
  "金龙幼龙": {
    "en": "Gold Dragon Wyrmling",
    "size": "中型",
    "type": "龙",
    "alignment": "守序善良",
    "ac": 17,
    "ac_note": "natural",
    "hp": "60 (8d8)",
    "speed": "30 ft., 飞行 60 ft., 游泳 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "火"
    ],
    "senses": "{'盲视': '10 ft.', '黑暗视觉': '60 ft.', 'passive_perception': 14}",
    "languages": "龙语",
    "cr": "3",
    "traits": [
      [
        "Amphibious",
        "The dragon can breathe air and water."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "1d10+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 9 (1d10 + 4) piercing damage."
      },
      {
        "name": "Breath Weapons",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon uses one of the following breath weapons.\nFire Breath. The dragon exhales fire in a 15-foot cone. Each creature in that area must make a DC 13 Dexterity saving throw, taking 22 (4d10) fire damage on a failed save, or half as much damage on a successful one.\nWeakening Breath. The dragon exhales gas in a 15-foot cone. Each creature in that area must succeed on a DC 13 Strength saving throw or have disadvantage on Strength-based attack rolls, Strength checks, and Strength saving throws for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ]
  },
  "石化铁牛们": {
    "en": "Gorgon",
    "size": "大型",
    "type": "怪兽",
    "alignment": "无",
    "ac": 19,
    "ac_note": "natural",
    "hp": "114 (12d10)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "cond_immune": [
      "石化"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 14}",
    "languages": "—",
    "cr": "5",
    "traits": [
      [
        "Trampling Charge",
        "If the gorgon moves at least 20 feet straight toward a creature and then hits it with a gore attack on the same turn, that target must succeed on a DC 16 Strength saving throw or be knocked prone. If the target is prone, the gorgon can make one attack with its hooves against it as a bonus action."
      ]
    ],
    "actions": [
      {
        "name": "Gore",
        "atk": 8,
        "reach": "5 ft",
        "dmg": "2d12+5",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 18 (2d12 + 5) piercing damage."
      },
      {
        "name": "Hooves",
        "atk": 8,
        "reach": "5 ft",
        "dmg": "2d10+5",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 16 (2d10 + 5) bludgeoning damage."
      },
      {
        "name": "Petrifying Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The gorgon exhales petrifying gas in a 30-foot cone. Each creature in that area must succeed on a DC 13 Constitution saving throw. On a failed save, a target begins to turn to stone and is restrained. The restrained target must repeat the saving throw at the end of its next turn. On a success, the effect ends on the target. On a failure, the target is petrified until freed by the greater restoration spell or other magic."
      }
    ]
  },
  "灰泥怪们": {
    "en": "Gray Ooze",
    "size": "中型",
    "type": "泥形",
    "alignment": "无",
    "ac": 8,
    "ac_note": "dex",
    "hp": "22 (3d8)",
    "speed": "10 ft., 爬 10 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "酸",
      "冷",
      "火"
    ],
    "cond_immune": [
      "目盲",
      "魅惑",
      "耳聋",
      "力竭",
      "惊惧",
      "倒地"
    ],
    "senses": "{'盲视': '60 ft. (blind beyond this radius)', 'passive_perception': 8}",
    "languages": "—",
    "cr": "1/2",
    "traits": [
      [
        "Amorphous",
        "The ooze can move through a space as narrow as 1 inch wide without squeezing."
      ],
      [
        "Corrode Metal",
        "Any nonmagical weapon made of metal that hits the ooze corrodes. After dealing damage, the weapon takes a permanent and cumulative -1 penalty to damage rolls. If its penalty drops to -5, the weapon is destroyed. Nonmagical ammunition made of metal that hits the ooze is destroyed after dealing damage.\nThe ooze can eat through 2-inch-thick, nonmagical metal in 1 round."
      ],
      [
        "False Appearance",
        "While the ooze remains motionless, it is indistinguishable from an oily pool or wet rock."
      ]
    ],
    "actions": [
      {
        "name": "Pseudopod",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "1d6+1",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) bludgeoning damage plus 7 (2d6) acid damage, and if the target is wearing nonmagical metal armor, its armor is partly corroded and takes a permanent and cumulative -1 penalty to the AC it offers. The armor is destroyed if the penalty reduces its AC to 10."
      }
    ]
  },
  "绿龙幼龙": {
    "en": "Green Dragon Wyrmling",
    "size": "中型",
    "type": "龙",
    "alignment": "守序邪恶",
    "ac": 17,
    "ac_note": "natural",
    "hp": "38 (7d8)",
    "speed": "30 ft., 飞行 60 ft., 游泳 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "毒"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'盲视': '10 ft.', '黑暗视觉': '60 ft.', 'passive_perception': 14}",
    "languages": "龙语",
    "cr": "2",
    "traits": [
      [
        "Amphibious",
        "The dragon can breathe air and water."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d10+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (1d10 + 2) piercing damage plus 3 (1d6) poison damage."
      },
      {
        "name": "Poison Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "6d6",
        "type": "毒",
        "extra": "The dragon exhales poisonous gas in a 15-foot cone. Each creature in that area must make a DC 11 Constitution saving throw, taking 21 (6d6) poison damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "绿鬼婆": {
    "en": "Green Hag",
    "size": "中型",
    "type": "精类",
    "alignment": "中立邪恶",
    "ac": 17,
    "ac_note": "natural",
    "hp": "82 (11d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 14}",
    "languages": "通用语, 龙语, 精类语",
    "cr": "3",
    "traits": [
      [
        "Amphibious",
        "The hag can breathe air and water."
      ],
      [
        "Innate Spellcasting",
        "The hag's innate spellcasting ability is Charisma (spell save DC 12). She can innately cast the following spells, requiring no material components:\n\nAt will: dancing lights, minor illusion, vicious mockery"
      ],
      [
        "Mimicry",
        "The hag can mimic animal sounds and humanoid voices. A creature that hears the sounds can tell they are imitations with a successful DC 14 Wisdom (Insight) check."
      ]
    ],
    "actions": [
      {
        "name": "Claws",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d8+4",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) slashing damage."
      },
      {
        "name": "Illusory Appearance",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The hag covers herself and anything she is wearing or carrying with a magical illusion that makes her look like another creature of her general size and humanoid shape. The illusion ends if the hag takes a bonus action to end it or if she dies.\nThe changes wrought by this effect fail to hold up to physical inspection. For example, the hag could appear to have smooth skin, but someone touching her would feel her rough flesh. Otherwise, a creature must take an action to visually inspect the illusion and succeed on a DC 20 Intelligence (Investigation) check to discern that the hag is disguised."
      },
      {
        "name": "Invisible Passage",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The hag magically turns invisible until she attacks or casts a spell, or until her concentration ends (as if concentrating on a spell). While invisible, she leaves no physical evidence of her passage, so she can be tracked only by magic. Any equipment she wears or carries is invisible with her."
      }
    ]
  },
  "格里克": {
    "en": "Grick",
    "size": "中型",
    "type": "怪兽",
    "alignment": "中立",
    "ac": 14,
    "ac_note": "natural",
    "hp": "27 (6d8)",
    "speed": "30 ft., 爬 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "钝击",
      "穿刺",
      "slashing"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 12}",
    "languages": "—",
    "cr": "2",
    "traits": [
      [
        "Stone Camouflage",
        "The grick has advantage on Dexterity (Stealth) checks made to hide in rocky terrain."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The grick makes one attack with its tentacles. If that attack hits, the grick can make one beak attack against the same target."
      },
      {
        "name": "Tentacles",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "2d6+2",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 9 (2d6 + 2) slashing damage."
      },
      {
        "name": "Beak",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d6+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage."
      }
    ]
  },
  "狮鹫": {
    "en": "Griffon",
    "size": "大型",
    "type": "怪兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "dex",
    "hp": "59 (7d10)",
    "speed": "30 ft., 飞行 80 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 15}",
    "languages": "—",
    "cr": "2",
    "traits": [
      [
        "Keen Sight",
        "The griffon has advantage on Wisdom (Perception) checks that rely on sight."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The griffon makes two attacks: one with its beak and one with its claws."
      },
      {
        "name": "Beak",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "1d8+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 8 (1d8 + 4) piercing damage."
      },
      {
        "name": "Claws",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d6+4",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage."
      }
    ]
  },
  "幽邃盲族": {
    "en": "Grimlock",
    "size": "中型",
    "type": "类人妖",
    "alignment": "中立邪恶",
    "ac": 11,
    "ac_note": "dex",
    "hp": "11 (2d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "cond_immune": [
      "目盲"
    ],
    "senses": "{'盲视': '30 ft. or 10 ft. while deafened (blind beyond this radius)', 'passive_perception': 13}",
    "languages": "地底语",
    "cr": "1/4",
    "traits": [
      [
        "Blind Senses",
        "The grimlock can't use its blindsight while deafened and unable to smell."
      ],
      [
        "Keen Hearing and Smell",
        "The grimlock has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      ],
      [
        "Stone Camouflage",
        "The grimlock has advantage on Dexterity (Stealth) checks made to hide in rocky terrain."
      ]
    ],
    "actions": [
      {
        "name": "Spiked Bone Club",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d4+3",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 5 (1d4 + 3) bludgeoning damage plus 2 (1d4) piercing damage."
      }
    ]
  },
  "卫兵": {
    "en": "Guard",
    "size": "中型",
    "type": "类人妖",
    "alignment": "任意",
    "ac": 16,
    "ac_note": "Chain Shirt, Shield",
    "hp": "11 (2d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 12}",
    "languages": "any one language (usually Common)",
    "cr": "1/8",
    "traits": [],
    "actions": [
      {
        "name": "Spear",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee or Ranged Weapon Attack: +3 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 4 (1d6 + 1) piercing damage or 5 (1d8 + 1) piercing damage if used with two hands to make a melee attack."
      }
    ]
  },
  "守护纳迦": {
    "en": "Guardian Naga",
    "size": "大型",
    "type": "怪兽",
    "alignment": "守序善良",
    "ac": 18,
    "ac_note": "natural",
    "hp": "127 (15d10)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "毒"
    ],
    "cond_immune": [
      "魅惑",
      "中毒"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 14}",
    "languages": "天界语, 通用语",
    "cr": "10",
    "traits": [
      [
        "Rejuvenation",
        "If it dies, the naga returns to life in 1d6 days and regains all its hit points. Only a wish spell can prevent this trait from functioning."
      ],
      [
        "Spellcasting",
        "The naga is an 11th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 16, +8 to hit with spell attacks), and it needs only verbal components to cast its spells. It has the following cleric spells prepared:\n\n- Cantrips (at will): mending, sacred flame, thaumaturgy\n- 1st level (4 slots): command, cure wounds, shield of faith\n- 2nd level (3 slots): calm emotions, hold person\n- 3rd level (3 slots): bestow curse, clairvoyance\n- 4th level (3 slots): banishment, freedom of movement\n- 5th level (2 slots): flame strike, geas\n- 6th level (1 slot): true seeing"
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 8,
        "reach": "10 ft",
        "dmg": "1d8+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +8 to hit, reach 10 ft., one creature. Hit: 8 (1d8 + 4) piercing damage, and the target must make a DC 15 Constitution saving throw, taking 45 (10d8) poison damage on a failed save, or half as much damage on a successful one."
      },
      {
        "name": "Spit Poison",
        "atk": 8,
        "reach": "15/30 ft",
        "dmg": "",
        "type": "",
        "extra": "Ranged Weapon Attack: +8 to hit, range 15/30 ft., one creature. Hit: The target must make a DC 15 Constitution saving throw, taking 45 (10d8) poison damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "女面斯芬克斯": {
    "en": "Gynosphinx",
    "size": "大型",
    "type": "怪兽",
    "alignment": "守序中立",
    "ac": 17,
    "ac_note": "natural",
    "hp": "136 (16d10)",
    "speed": "40 ft., 飞行 60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "心灵"
    ],
    "cond_immune": [
      "魅惑",
      "惊惧"
    ],
    "senses": "{'真实视觉': '120 ft.', 'passive_perception': 18}",
    "languages": "通用语, Sphinx",
    "cr": "11",
    "traits": [
      [
        "Inscrutable",
        "The sphinx is immune to any effect that would sense its emotions or read its thoughts, as well as any divination spell that it refuses. Wisdom (Insight) checks made to ascertain the sphinx's intentions or sincerity have disadvantage."
      ],
      [
        "Magic Weapons",
        "The sphinx's weapon attacks are magical."
      ],
      [
        "Spellcasting",
        "The sphinx is a 9th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 16, +8 to hit with spell attacks). It requires no material components to cast its spells. The sphinx has the following wizard spells prepared:\n\n- Cantrips (at will): mage hand, minor illusion, prestidigitation\n- 1st level (4 slots): detect magic, identify, shield\n- 2nd level (3 slots): darkness, locate object, suggestion\n- 3rd level (3 slots): dispel magic, remove curse, tongues\n- 4th level (3 slots): banishment, greater invisibility\n- 5th level (1 slot): legend lore"
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The sphinx makes two claw attacks."
      },
      {
        "name": "Claw",
        "atk": 9,
        "reach": "5 ft",
        "dmg": "2d8+4",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) slashing damage."
      }
    ],
    "legendary": [
      {
        "name": "Claw Attack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The sphinx makes one claw attack."
      },
      {
        "name": "Teleport (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The sphinx magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see."
      },
      {
        "name": "Cast a Spell (Costs 3 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The sphinx casts a spell from its list of prepared spells, using a spell slot as normal."
      }
    ]
  },
  "半红龙老兵": {
    "en": "Half-Red Dragon Veteran",
    "size": "中型",
    "type": "类人妖",
    "alignment": "任意",
    "ac": 18,
    "ac_note": "Plate Armor",
    "hp": "65 (10d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "火"
    ],
    "senses": "{'盲视': '10 ft.', '黑暗视觉': '60 ft.', 'passive_perception': 12}",
    "languages": "通用语, 龙语",
    "cr": "5",
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The veteran makes two longsword attacks. If it has a shortsword drawn, it can also make a shortsword attack."
      },
      {
        "name": "Longsword",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) slashing damage, or 8 (1d10 + 3) slashing damage if used with two hands."
      },
      {
        "name": "Shortsword",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d6+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) piercing damage."
      },
      {
        "name": "Heavy Crossbow",
        "atk": 3,
        "reach": "100/400 ft",
        "dmg": "1d10+1",
        "type": "穿刺",
        "extra": "Ranged Weapon Attack: +3 to hit, range 100/400 ft., one target. Hit: 6 (1d10 + 1) piercing damage."
      },
      {
        "name": "Fire Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "7d6",
        "type": "火",
        "extra": "The veteran exhales fire in a 15-foot cone. Each creature in that area must make a DC 15 Dexterity saving throw, taking 24 (7d6) fire damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "鸟妖": {
    "en": "Harpy",
    "size": "中型",
    "type": "怪兽",
    "alignment": "混乱邪恶",
    "ac": 11,
    "ac_note": "dex",
    "hp": "38 (7d8)",
    "speed": "20 ft., 飞行 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 10}",
    "languages": "通用语",
    "cr": "1",
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The harpy makes two attacks: one with its claws and one with its club."
      },
      {
        "name": "Claws",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "2d4+1",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 6 (2d4 + 1) slashing damage."
      },
      {
        "name": "Club",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "1d4+1",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3 (1d4 + 1) bludgeoning damage."
      },
      {
        "name": "Luring Song",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The harpy sings a magical melody. Every humanoid and giant within 300 ft. of the harpy that can hear the song must succeed on a DC 11 Wisdom saving throw or be charmed until the song ends. The harpy must take a bonus action on its subsequent turns to continue singing. It can stop singing at any time. The song ends if the harpy is incapacitated.\nWhile charmed by the harpy, a target is incapacitated and ignores the songs of other harpies. If the charmed target is more than 5 ft. away from the harpy, the must move on its turn toward the harpy by the most direct route. It doesn't avoid opportunity attacks, but before moving into damaging terrain, such as lava or a pit, and whenever it takes damage from a source other than the harpy, a target can repeat the saving throw. A creature can also repeat the saving throw at the end of each of its turns. If a creature's saving throw is successful, the effect ends on it.\nA target that successfully saves is immune to this harpy's song for the next 24 hours."
      }
    ]
  },
  "隼": {
    "en": "Hawk",
    "size": "超小型",
    "type": "野兽",
    "alignment": "无",
    "ac": 13,
    "ac_note": "dex",
    "hp": "1 (1d4)",
    "speed": "10 ft., 飞行 60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 14}",
    "languages": "—",
    "cr": "0",
    "traits": [
      [
        "Keen Sight",
        "The hawk has advantage on Wisdom (Perception) checks that rely on sight."
      ]
    ],
    "actions": [
      {
        "name": "Talons",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 1 slashing damage."
      }
    ]
  },
  "地狱猎犬": {
    "en": "Hell Hound",
    "size": "中型",
    "type": "邪魔",
    "alignment": "守序邪恶",
    "ac": 15,
    "ac_note": "natural",
    "hp": "45 (7d8)",
    "speed": "50 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "火"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 15}",
    "languages": "understands Infernal but can't speak it",
    "cr": "3",
    "traits": [
      [
        "Keen Hearing and Smell",
        "The hound has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      ],
      [
        "Pack Tactics",
        "The hound has advantage on an attack roll against a creature if at least one of the hound's allies is within 5 ft. of the creature and the ally isn't incapacitated."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d8+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) piercing damage plus 7 (2d6) fire damage."
      },
      {
        "name": "Fire Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "6d6",
        "type": "火",
        "extra": "The hound exhales fire in a 15-foot cone. Each creature in that area must make a DC 12 Dexterity saving throw, taking 21 (6d6) fire damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "狂蟾魔": {
    "en": "Hezrou",
    "size": "大型",
    "type": "邪魔",
    "alignment": "混乱邪恶",
    "ac": 16,
    "ac_note": "natural",
    "hp": "136 (13d10)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "冷",
      "火",
      "电",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "毒"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 11}",
    "languages": "深渊语, telepathy 120 ft.",
    "cr": "8",
    "traits": [
      [
        "Magic Resistance",
        "The hezrou has advantage on saving throws against spells and other magical effects."
      ],
      [
        "Stench",
        "Any creature that starts its turn within 10 feet of the hezrou must succeed on a DC 14 Constitution saving throw or be poisoned until the start of its next turn. On a successful saving throw, the creature is immune to the hezrou's stench for 24 hours."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The hezrou makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "2d10+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 15 (2d10 + 4) piercing damage."
      },
      {
        "name": "Claws",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "2d6+4",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage."
      }
    ]
  },
  "山丘巨人": {
    "en": "Hill Giant",
    "size": "超大型",
    "type": "巨人",
    "alignment": "混乱邪恶",
    "ac": 13,
    "ac_note": "natural",
    "hp": "105 (10d12)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 12}",
    "languages": "巨语",
    "cr": "5",
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The giant makes two greatclub attacks."
      },
      {
        "name": "Greatclub",
        "atk": 8,
        "reach": "10 ft",
        "dmg": "3d8+5",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 18 (3d8 + 5) bludgeoning damage."
      },
      {
        "name": "Rock",
        "atk": 8,
        "reach": "60/240 ft",
        "dmg": "3d10+5",
        "type": "钝击",
        "extra": "Ranged Weapon Attack: +8 to hit, range 60/240 ft., one target. Hit: 21 (3d10 + 5) bludgeoning damage."
      }
    ]
  },
  "鹰头马身有翼兽": {
    "en": "Hippogriff",
    "size": "大型",
    "type": "怪兽",
    "alignment": "无",
    "ac": 11,
    "ac_note": "dex",
    "hp": "19 (3d10)",
    "speed": "40 ft., 飞行 60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 15}",
    "languages": "—",
    "cr": "1",
    "traits": [
      [
        "Keen Sight",
        "The hippogriff has advantage on Wisdom (Perception) checks that rely on sight."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The hippogriff makes two attacks: one with its beak and one with its claws."
      },
      {
        "name": "Beak",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d10+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (1d10 + 3) piercing damage."
      },
      {
        "name": "Claws",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "2d6+3",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) slashing damage."
      }
    ]
  },
  "大地精": {
    "en": "Hobgoblin",
    "size": "中型",
    "type": "类人妖",
    "alignment": "守序邪恶",
    "ac": 18,
    "ac_note": "Chain Mail, Shield",
    "hp": "11 (2d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "通用语, 哥布林语",
    "cr": "1/2",
    "traits": [
      [
        "Martial Advantage",
        "Once per turn, the hobgoblin can deal an extra 7 (2d6) damage to a creature it hits with a weapon attack if that creature is within 5 ft. of an ally of the hobgoblin that isn't incapacitated."
      ]
    ],
    "actions": [
      {
        "name": "Longsword",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 5 (1d8 + 1) slashing damage, or 6 (1d10 + 1) slashing damage if used with two hands."
      },
      {
        "name": "Longbow",
        "atk": 3,
        "reach": "150/600 ft",
        "dmg": "1d8+1",
        "type": "穿刺",
        "extra": "Ranged Weapon Attack: +3 to hit, range 150/600 ft., one target. Hit: 5 (1d8 + 1) piercing damage."
      }
    ]
  },
  "人工生命体": {
    "en": "Homunculus",
    "size": "超小型",
    "type": "构装",
    "alignment": "中立",
    "ac": 13,
    "ac_note": "natural",
    "hp": "5 (2d4)",
    "speed": "20 ft., 飞行 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "毒"
    ],
    "cond_immune": [
      "魅惑",
      "中毒"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "understands the languages of its creator but can't speak",
    "cr": "0",
    "traits": [
      [
        "Telepathic Bond",
        "While the homunculus is on the same plane of existence as its master, it can magically convey what it senses to its master, and the two can communicate telepathically."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 1 piercing damage, and the target must succeed on a DC 10 Constitution saving throw or be poisoned for 1 minute. If the saving throw fails by 5 or more, the target is instead poisoned for 5 (1d10) minutes and unconscious while poisoned in this way."
      }
    ]
  },
  "角魔": {
    "en": "Horned Devil",
    "size": "大型",
    "type": "邪魔",
    "alignment": "守序邪恶",
    "ac": 18,
    "ac_note": "natural",
    "hp": "178 (17d10)",
    "speed": "20 ft., 飞行 60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "冷",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "火",
      "毒"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 13}",
    "languages": "炼狱语, telepathy 120 ft.",
    "cr": "11",
    "traits": [
      [
        "Devil's Sight",
        "Magical darkness doesn't impede the devil's darkvision."
      ],
      [
        "Magic Resistance",
        "The devil has advantage on saving throws against spells and other magical effects."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The devil makes three melee attacks: two with its fork and one with its tail. It can use Hurl Flame in place of any melee attack."
      },
      {
        "name": "Fork",
        "atk": 10,
        "reach": "10 ft",
        "dmg": "2d8+6",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 15 (2d8 + 6) piercing damage."
      },
      {
        "name": "Tail",
        "atk": 10,
        "reach": "10 ft",
        "dmg": "1d8+6",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 10 (1d8 + 6) piercing damage. If the target is a creature other than an undead or a construct, it must succeed on a DC 17 Constitution saving throw or lose 10 (3d6) hit points at the start of each of its turns due to an infernal wound. Each time the devil hits the wounded target with this attack, the damage dealt by the wound increases by 10 (3d6). Any creature can take an action to stanch the wound with a successful DC 12 Wisdom (Medicine) check. The wound also closes if the target receives magical healing."
      },
      {
        "name": "Hurl Flame",
        "atk": 7,
        "reach": "150 ft",
        "dmg": "4d6",
        "type": "火",
        "extra": "Ranged Spell Attack: +7 to hit, range 150 ft., one target. Hit: 14 (4d6) fire damage. If the target is a flammable object that isn't being worn or carried, it also catches fire."
      }
    ]
  },
  "寻猎鲨": {
    "en": "Hunter Shark",
    "size": "大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "dex",
    "hp": "45 (6d10)",
    "speed": "游泳 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '30 ft.', 'passive_perception': 12}",
    "languages": "—",
    "cr": "2",
    "traits": [
      [
        "Blood Frenzy",
        "The shark has advantage on melee attack rolls against any creature that doesn't have all its hit points."
      ],
      [
        "Water Breathing",
        "The shark can breathe only underwater."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d8+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) piercing damage."
      }
    ]
  },
  "多头蛇": {
    "en": "Hydra",
    "size": "超大型",
    "type": "怪兽",
    "alignment": "无",
    "ac": 15,
    "ac_note": "natural",
    "hp": "172 (15d12)",
    "speed": "30 ft., 游泳 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 16}",
    "languages": "—",
    "cr": "8",
    "traits": [
      [
        "Hold Breath",
        "The hydra can hold its breath for 1 hour."
      ],
      [
        "Multiple Heads",
        "The hydra has five heads. While it has more than one head, the hydra has advantage on saving throws against being blinded, charmed, deafened, frightened, stunned, and knocked unconscious.\nWhenever the hydra takes 25 or more damage in a single turn, one of its heads dies. If all its heads die, the hydra dies.\nAt the end of its turn, it grows two heads for each of its heads that died since its last turn, unless it has taken fire damage since its last turn. The hydra regains 10 hit points for each head regrown in this way."
      ],
      [
        "Reactive Heads",
        "For each head the hydra has beyond one, it gets an extra reaction that can be used only for opportunity attacks."
      ],
      [
        "Wakeful",
        "While the hydra sleeps, at least one of its heads is awake."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The hydra makes as many bite attacks as it has heads."
      },
      {
        "name": "Bite",
        "atk": 8,
        "reach": "10 ft",
        "dmg": "1d10+5",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 10 (1d10 + 5) piercing damage."
      }
    ]
  },
  "鬣狗": {
    "en": "Hyena",
    "size": "中型",
    "type": "野兽",
    "alignment": "无",
    "ac": 11,
    "ac_note": "dex",
    "hp": "5 (1d8)",
    "speed": "50 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 13}",
    "languages": "—",
    "cr": "0",
    "traits": [
      [
        "Pack Tactics",
        "The hyena has advantage on an attack roll against a creature if at least one of the hyena's allies is within 5 ft. of the creature and the ally isn't incapacitated."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 2,
        "reach": "5 ft",
        "dmg": "1d6",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 3 (1d6) piercing damage."
      }
    ]
  },
  "冰魔": {
    "en": "Ice Devil",
    "size": "大型",
    "type": "邪魔",
    "alignment": "守序邪恶",
    "ac": 18,
    "ac_note": "natural",
    "hp": "180 (19d10)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "火",
      "毒"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'盲视': '60 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 12}",
    "languages": "炼狱语, telepathy 120 ft.",
    "cr": "14",
    "traits": [
      [
        "Devil's Sight",
        "Magical darkness doesn't impede the devil's darkvision."
      ],
      [
        "Magic Resistance",
        "The devil has advantage on saving throws against spells and other magical effects."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The devil makes three attacks: one with its bite, one with its claws, and one with its tail."
      },
      {
        "name": "Bite",
        "atk": 10,
        "reach": "5 ft",
        "dmg": "2d6+5",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 5) piercing damage plus 10 (3d6) cold damage."
      },
      {
        "name": "Claws",
        "atk": 10,
        "reach": "5 ft",
        "dmg": "2d4+5",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 10 (2d4 + 5) slashing damage plus 10 (3d6) cold damage."
      },
      {
        "name": "Tail",
        "atk": 10,
        "reach": "10 ft",
        "dmg": "2d6+5",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 12 (2d6 + 5) bludgeoning damage plus 10 (3d6) cold damage."
      },
      {
        "name": "Wall of Ice",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The devil magically forms an opaque wall of ice on a solid surface it can see within 60 feet of it. The wall is 1 foot thick and up to 30 feet long and 10 feet high, or it's a hemispherical dome up to 20 feet in diameter.\nWhen the wall appears, each creature in its space is pushed out of it by the shortest route. The creature chooses which side of the wall to end up on, unless the creature is incapacitated. The creature then makes a DC 17 Dexterity saving throw, taking 35 (10d6) cold damage on a failed save, or half as much damage on a successful one.\nThe wall lasts for 1 minute or until the devil is incapacitated or dies. The wall can be damaged and breached; each 10-foot section has AC 5, 30 hit points, vulnerability to fire damage, and immunity to acid, cold, necrotic, poison, and psychic damage. If a section is destroyed, it leaves behind a sheet of frigid air in the space the wall occupied. Whenever a creature finishes moving through the frigid air on a turn, willingly or otherwise, the creature must make a DC 17 Constitution saving throw, taking 17 (5d6) cold damage on a failed save, or half as much damage on a successful one. The frigid air dissipates when the rest of the wall vanishes."
      }
    ]
  },
  "冰魔蝠": {
    "en": "Ice Mephit",
    "size": "小型",
    "type": "元素",
    "alignment": "中立邪恶",
    "ac": 11,
    "ac_note": "dex",
    "hp": "21 (6d6)",
    "speed": "30 ft., 飞行 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "冷",
      "毒"
    ],
    "vuln": [
      "钝击",
      "火"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 12}",
    "languages": "水族语, 气族语",
    "cr": "1/2",
    "traits": [
      [
        "Death Burst",
        "When the mephit dies, it explodes in a burst of jagged ice. Each creature within 5 ft. of it must make a DC 10 Dexterity saving throw, taking 4 (1d8) slashing damage on a failed save, or half as much damage on a successful one."
      ],
      [
        "False Appearance",
        "While the mephit remains motionless, it is indistinguishable from an ordinary shard of ice."
      ],
      [
        "Innate Spellcasting",
        "The mephit can innately cast fog cloud, requiring no material components. Its innate spellcasting ability is Charisma."
      ]
    ],
    "actions": [
      {
        "name": "Claws",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "1d4+1",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one creature. Hit: 3 (1d4 + 1) slashing damage plus 2 (1d4) cold damage."
      },
      {
        "name": "Frost Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "2d4",
        "type": "冷",
        "extra": "The mephit exhales a 15-foot cone of cold air. Each creature in that area must succeed on a DC 10 Dexterity saving throw, taking 5 (2d4) cold damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "小魔鬼": {
    "en": "Imp",
    "size": "超小型",
    "type": "邪魔",
    "alignment": "守序邪恶",
    "ac": 13,
    "ac_note": "dex",
    "hp": "10 (3d4)",
    "speed": "20 ft., 飞行 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "冷",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "火",
      "毒"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 11}",
    "languages": "炼狱语, 通用语",
    "cr": "1",
    "traits": [
      [
        "Shapechanger",
        "The imp can use its action to polymorph into a beast form that resembles a rat (speed 20 ft.), a raven (20 ft., fly 60 ft.), or a spider (20 ft., climb 20 ft.), or back into its true form. Its statistics are the same in each form, except for the speed changes noted. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies."
      ],
      [
        "Devil's Sight",
        "Magical darkness doesn't impede the imp's darkvision."
      ],
      [
        "Magic Resistance",
        "The imp has advantage on saving throws against spells and other magical effects."
      ]
    ],
    "actions": [
      {
        "name": "Sting (Bite in Beast Form)",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d4+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 5 (1d4 + 3) piercing damage, and the target must make on a DC 11 Constitution saving throw, taking 10 (3d6) poison damage on a failed save, or half as much damage on a successful one."
      },
      {
        "name": "Invisibility",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The imp magically turns invisible until it attacks, or until its concentration ends (as if concentrating on a spell). Any equipment the imp wears or carries is invisible with it."
      }
    ]
  },
  "隐形追猎者": {
    "en": "Invisible Stalker",
    "size": "中型",
    "type": "元素",
    "alignment": "中立",
    "ac": 14,
    "ac_note": "dex",
    "hp": "104 (16d8)",
    "speed": "50 ft., 飞行 50 ft., 悬浮 True",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "毒"
    ],
    "cond_immune": [
      "力竭",
      "擒抱",
      "麻痹",
      "石化",
      "中毒",
      "倒地",
      "束缚",
      "昏迷"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 18}",
    "languages": "气族语, understands Common but doesn't speak it",
    "cr": "6",
    "traits": [
      [
        "Invisibility",
        "The stalker is invisible."
      ],
      [
        "Faultless Tracker",
        "The stalker is given a quarry by its summoner. The stalker knows the direction and distance to its quarry as long as the two of them are on the same plane of existence. The stalker also knows the location of its summoner."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The stalker makes two slam attacks."
      },
      {
        "name": "Slam",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d6+3",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) bludgeoning damage."
      }
    ]
  },
  "铁魔像": {
    "en": "Iron Golem",
    "size": "大型",
    "type": "构装",
    "alignment": "无",
    "ac": 20,
    "ac_note": "natural",
    "hp": "210 (20d10)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "火",
      "毒",
      "心灵",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "cond_immune": [
      "魅惑",
      "力竭",
      "惊惧",
      "麻痹",
      "石化",
      "中毒"
    ],
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 10}",
    "languages": "understands the languages of its creator but can't speak",
    "cr": "16",
    "traits": [
      [
        "Fire Absorption",
        "Whenever the golem is subjected to fire damage, it takes no damage and instead regains a number of hit points equal to the fire damage dealt."
      ],
      [
        "Immutable Form",
        "The golem is immune to any spell or effect that would alter its form."
      ],
      [
        "Magic Resistance",
        "The golem has advantage on saving throws against spells and other magical effects."
      ],
      [
        "Magic Weapons",
        "The golem's weapon attacks are magical."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The golem makes two melee attacks."
      },
      {
        "name": "Slam",
        "atk": 13,
        "reach": "5 ft",
        "dmg": "3d8+7",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +13 to hit, reach 5 ft., one target. Hit: 20 (3d8 + 7) bludgeoning damage."
      },
      {
        "name": "Sword",
        "atk": 13,
        "reach": "10 ft",
        "dmg": "3d10+7",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +13 to hit, reach 10 ft., one target. Hit: 23 (3d10 + 7) slashing damage."
      },
      {
        "name": "Poison Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "10d8",
        "type": "毒",
        "extra": "The golem exhales poisonous gas in a 15-foot cone. Each creature in that area must make a DC 19 Constitution saving throw, taking 45 (10d8) poison damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "胡狼": {
    "en": "Jackal",
    "size": "小型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "dex",
    "hp": "3 (1d6)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 13}",
    "languages": "—",
    "cr": "0",
    "traits": [
      [
        "Keen Hearing and Smell",
        "The jackal has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      ],
      [
        "Pack Tactics",
        "The jackal has advantage on an attack roll against a creature if at least one of the jackal's allies is within 5 ft. of the creature and the ally isn't incapacitated."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 1,
        "reach": "5 ft",
        "dmg": "1d4-1",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +1 to hit, reach 5 ft., one target. Hit: 1 (1d4 - 1) piercing damage."
      }
    ]
  },
  "虎鲸": {
    "en": "Killer Whale",
    "size": "超大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "natural",
    "hp": "90 (12d12)",
    "speed": "游泳 60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'盲视': '120 ft.', 'passive_perception': 13}",
    "languages": "—",
    "cr": "3",
    "traits": [
      [
        "Echolocation",
        "The whale can't use its blindsight while deafened."
      ],
      [
        "Hold Breath",
        "The whale can hold its breath for 30 minutes"
      ],
      [
        "Keen Hearing",
        "The whale has advantage on Wisdom (Perception) checks that rely on hearing."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "5d6+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 21 (5d6 + 4) piercing damage."
      }
    ]
  },
  "骑士": {
    "en": "Knight",
    "size": "中型",
    "type": "类人妖",
    "alignment": "任意",
    "ac": 18,
    "ac_note": "Plate Armor",
    "hp": "52 (8d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 10}",
    "languages": "any one language (usually Common)",
    "cr": "3",
    "traits": [
      [
        "Brave",
        "The knight has advantage on saving throws against being frightened."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The knight makes two melee attacks."
      },
      {
        "name": "Greatsword",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "2d6+3",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) slashing damage."
      },
      {
        "name": "Heavy Crossbow",
        "atk": 2,
        "reach": "100/400 ft",
        "dmg": "1d10",
        "type": "穿刺",
        "extra": "Ranged Weapon Attack: +2 to hit, range 100/400 ft., one target. Hit: 5 (1d10) piercing damage."
      },
      {
        "name": "Leadership",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "For 1 minute, the knight can utter a special command or warning whenever a nonhostile creature that it can see within 30 ft. of it makes an attack roll or a saving throw. The creature can add a d4 to its roll provided it can hear and understand the knight. A creature can benefit from only one Leadership die at a time. This effect ends if the knight is incapacitated."
      }
    ],
    "reactions": [
      {
        "name": "Parry",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The knight adds 2 to its AC against one melee attack that would hit it. To do so, the knight must see the attacker and be wielding a melee weapon."
      }
    ]
  },
  "狗头人": {
    "en": "Kobold",
    "size": "小型",
    "type": "类人妖",
    "alignment": "守序邪恶",
    "ac": 12,
    "ac_note": "dex",
    "hp": "5 (2d6)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 8}",
    "languages": "通用语, 龙语",
    "cr": "1/8",
    "traits": [
      [
        "Sunlight Sensitivity",
        "While in sunlight, the kobold has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight."
      ],
      [
        "Pack Tactics",
        "The kobold has advantage on an attack roll against a creature if at least one of the kobold's allies is within 5 ft. of the creature and the ally isn't incapacitated."
      ]
    ],
    "actions": [
      {
        "name": "Dagger",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d4+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) piercing damage."
      },
      {
        "name": "Sling",
        "atk": 4,
        "reach": "30/120 ft",
        "dmg": "1d4+2",
        "type": "钝击",
        "extra": "Ranged Weapon Attack: +4 to hit, range 30/120 ft., one target. Hit: 4 (1d4 + 2) bludgeoning damage."
      }
    ]
  },
  "克拉肯": {
    "en": "Kraken",
    "size": "巨型",
    "type": "怪兽",
    "alignment": "混乱邪恶",
    "ac": 18,
    "ac_note": "natural",
    "hp": "472 (27d20)",
    "speed": "20 ft., 游泳 60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "电",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "cond_immune": [
      "惊惧",
      "麻痹"
    ],
    "senses": "{'真实视觉': '120 ft.', 'passive_perception': 14}",
    "languages": "understands Abyssal, 天界语, 炼狱语, and Primordial but can't speak, telepathy 120 ft.",
    "cr": "23",
    "traits": [
      [
        "Amphibious",
        "The kraken can breathe air and water."
      ],
      [
        "Freedom of Movement",
        "The kraken ignores difficult terrain, and magical effects can't reduce its speed or cause it to be restrained. It can spend 5 feet of movement to escape from nonmagical restraints or being grappled."
      ],
      [
        "Siege Monster",
        "The kraken deals double damage to objects and structures."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The kraken makes three tentacle attacks, each of which it can replace with one use of Fling."
      },
      {
        "name": "Bite",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "3d8+10",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 23 (3d8 + 10) piercing damage. If the target is a Large or smaller creature grappled by the kraken, that creature is swallowed, and the grapple ends. While swallowed, the creature is blinded and restrained, it has total cover against attacks and other effects outside the kraken, and it takes 42 (12d6) acid damage at the start of each of the kraken's turns. If the kraken takes 50 damage or more on a single turn from a creature inside it, the kraken must succeed on a DC 25 Constitution saving throw at the end of that turn or regurgitate all swallowed creatures, which fall prone in a space within 10 feet of the kraken. If the kraken dies, a swallowed creature is no longer restrained by it and can escape from the corpse using 15 feet of movement, exiting prone."
      },
      {
        "name": "Tentacle",
        "atk": 7,
        "reach": "30 ft",
        "dmg": "3d6+10",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +7 to hit, reach 30 ft., one target. Hit: 20 (3d6 + 10) bludgeoning damage, and the target is grappled (escape DC 18). Until this grapple ends, the target is restrained. The kraken has ten tentacles, each of which can grapple one target."
      },
      {
        "name": "Fling",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "One Large or smaller object held or creature grappled by the kraken is thrown up to 60 feet in a random direction and knocked prone. If a thrown target strikes a solid surface, the target takes 3 (1d6) bludgeoning damage for every 10 feet it was thrown. If the target is thrown at another creature, that creature must succeed on a DC 18 Dexterity saving throw or take the same damage and be knocked prone."
      },
      {
        "name": "Lightning Storm",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "4d10",
        "type": "电",
        "extra": "The kraken magically creates three bolts of lightning, each of which can strike a target the kraken can see within 120 feet of it. A target must make a DC 23 Dexterity saving throw, taking 22 (4d10) lightning damage on a failed save, or half as much damage on a successful one."
      }
    ],
    "legendary": [
      {
        "name": "Tentacle Attack or Fling",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The kraken makes one tentacle attack or uses its Fling."
      },
      {
        "name": "Lightning Storm (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The kraken uses Lightning Storm."
      },
      {
        "name": "Ink Cloud (Costs 3 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "3d10",
        "type": "毒",
        "extra": "While underwater, the kraken expels an ink cloud in a 60-foot radius. The cloud spreads around corners, and that area is heavily obscured to creatures other than the kraken. Each creature other than the kraken that ends its turn there must succeed on a DC 23 Constitution saving throw, taking 16 (3d10) poison damage on a failed save, or half as much damage on a successful one. A strong current disperses the cloud, which otherwise disappears at the end of the kraken's next turn."
      }
    ]
  },
  "拉迷亚": {
    "en": "Lamia",
    "size": "大型",
    "type": "怪兽",
    "alignment": "混乱邪恶",
    "ac": 13,
    "ac_note": "natural",
    "hp": "97 (13d10)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 12}",
    "languages": "深渊语, 通用语",
    "cr": "4",
    "traits": [
      [
        "Innate Spellcasting",
        "The lamia's innate spellcasting ability is Charisma (spell save DC 13). It can innately cast the following spells, requiring no material components. At will: disguise self (any humanoid form), major image 3/day each: charm person, mirror image, scrying, suggestion 1/day: geas"
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The lamia makes two attacks: one with its claws and one with its dagger or Intoxicating Touch."
      },
      {
        "name": "Claws",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "2d10+3",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 14 (2d10 + 3) slashing damage."
      },
      {
        "name": "Dagger",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d4+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 5 (1d4 + 3) piercing damage."
      },
      {
        "name": "Intoxicating Touch",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Spell Attack: +5 to hit, reach 5 ft., one creature. Hit: The target is magically cursed for 1 hour. Until the curse ends, the target has disadvantage on Wisdom saving throws and all ability checks."
      }
    ]
  },
  "劣魔们": {
    "en": "Lemure",
    "size": "中型",
    "type": "邪魔",
    "alignment": "守序邪恶",
    "ac": 7,
    "ac_note": "dex",
    "hp": "13 (3d8)",
    "speed": "15 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "冷"
    ],
    "immune": [
      "火",
      "毒"
    ],
    "cond_immune": [
      "魅惑",
      "惊惧",
      "中毒"
    ],
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 10}",
    "languages": "understands infernal but can't speak",
    "cr": "0",
    "traits": [
      [
        "Devil's Sight",
        "Magical darkness doesn't impede the lemure's darkvision."
      ],
      [
        "Hellish Rejuvenation",
        "A lemure that dies in the Nine Hells comes back to life with all its hit points in 1d10 days unless it is killed by a good-aligned creature with a bless spell cast on that creature or its remains are sprinkled with holy water."
      ]
    ],
    "actions": [
      {
        "name": "Fist",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "1d4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 2 (1d4) bludgeoning damage."
      }
    ]
  },
  "巫妖": {
    "en": "Lich",
    "size": "中型",
    "type": "不死",
    "alignment": "任意邪恶",
    "ac": 17,
    "ac_note": "natural",
    "hp": "135 (18d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "冷",
      "电",
      "坏死"
    ],
    "immune": [
      "毒",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "cond_immune": [
      "魅惑",
      "力竭",
      "惊惧",
      "麻痹",
      "中毒"
    ],
    "senses": "{'真实视觉': '120 ft.', 'passive_perception': 19}",
    "languages": "Common plus up to five other languages",
    "cr": "21",
    "traits": [
      [
        "Legendary Resistance",
        "If the lich fails a saving throw, it can choose to succeed instead."
      ],
      [
        "Rejuvenation",
        "If it has a phylactery, a destroyed lich gains a new body in 1d10 days, regaining all its hit points and becoming active again. The new body appears within 5 feet of the phylactery."
      ],
      [
        "Spellcasting",
        "The lich is an 18th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 20, +12 to hit with spell attacks). The lich has the following wizard spells prepared:\n\n- Cantrips (at will): mage hand, prestidigitation, ray of frost\n- 1st level (4 slots): detect magic, magic missile, shield, thunderwave\n- 2nd level (3 slots): acid arrow, detect thoughts, invisibility, mirror image\n- 3rd level (3 slots): animate dead, counterspell, dispel magic, fireball\n- 4th level (3 slots): blight, dimension door\n- 5th level (3 slots): cloudkill, scrying\n- 6th level (1 slot): disintegrate, globe of invulnerability\n- 7th level (1 slot): finger of death, plane shift\n- 8th level (1 slot): dominate monster, power word stun\n- 9th level (1 slot): power word kill"
      ],
      [
        "Turn Resistance",
        "The lich has advantage on saving throws against any effect that turns undead."
      ]
    ],
    "actions": [
      {
        "name": "Paralyzing Touch",
        "atk": 12,
        "reach": "5 ft",
        "dmg": "3d6",
        "type": "冷",
        "extra": "Melee Spell Attack: +12 to hit, reach 5 ft., one creature. Hit: 10 (3d6) cold damage. The target must succeed on a DC 18 Constitution saving throw or be paralyzed for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ],
    "legendary": [
      {
        "name": "Cantrip",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The lich casts a cantrip."
      },
      {
        "name": "Paralyzing Touch (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The lich uses its Paralyzing Touch."
      },
      {
        "name": "Frightening Gaze (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The lich fixes its gaze on one creature it can see within 10 feet of it. The target must succeed on a DC 18 Wisdom saving throw against this magic or become frightened for 1 minute. The frightened target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a target's saving throw is successful or the effect ends for it, the target is immune to the lich's gaze for the next 24 hours."
      },
      {
        "name": "Disrupt Life (Costs 3 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "6d6",
        "type": "坏死",
        "extra": "Each living creature within 20 feet of the lich must make a DC 18 Constitution saving throw against this magic, taking 21 (6d6) necrotic damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "狮": {
    "en": "Lion",
    "size": "大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "dex",
    "hp": "26 (4d10)",
    "speed": "50 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 13}",
    "languages": "—",
    "cr": "1",
    "traits": [
      [
        "Keen Smell",
        "The lion has advantage on Wisdom (Perception) checks that rely on smell."
      ],
      [
        "Pack Tactics",
        "The lion has advantage on an attack roll against a creature if at least one of the lion's allies is within 5 ft. of the creature and the ally isn't incapacitated."
      ],
      [
        "Pounce",
        "If the lion moves at least 20 ft. straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 13 Strength saving throw or be knocked prone. If the target is prone, the lion can make one bite attack against it as a bonus action."
      ],
      [
        "Running Leap",
        "With a 10-foot running start, the lion can long jump up to 25 ft.."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d8+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) piercing damage."
      },
      {
        "name": "Claw",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d6+3",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) slashing damage."
      }
    ]
  },
  "蜥蜴": {
    "en": "Lizard",
    "size": "超小型",
    "type": "野兽",
    "alignment": "无",
    "ac": 10,
    "ac_note": "dex",
    "hp": "2 (1d4)",
    "speed": "20 ft., 爬 20 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '30 ft.', 'passive_perception': 9}",
    "languages": "—",
    "cr": "0",
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "1",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 1 piercing damage."
      }
    ]
  },
  "蜥蜴人": {
    "en": "Lizardfolk",
    "size": "中型",
    "type": "类人妖",
    "alignment": "中立",
    "ac": 13,
    "ac_note": "natural",
    "hp": "22 (4d8)",
    "speed": "30 ft., 游泳 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 13}",
    "languages": "龙语",
    "cr": "1/2",
    "traits": [
      [
        "Hold Breath",
        "The lizardfolk can hold its breath for 15 minutes."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The lizardfolk makes two melee attacks, each one with a different weapon."
      },
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d6+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage."
      },
      {
        "name": "Heavy Club",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d6+2",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) bludgeoning damage."
      },
      {
        "name": "Javelin",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d6+2",
        "type": "穿刺",
        "extra": "Melee or Ranged Weapon Attack: +4 to hit, reach 5 ft. or range 30/120 ft., one target. Hit: 5 (1d6 + 2) piercing damage."
      },
      {
        "name": "Spiked Shield",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d6+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage."
      }
    ]
  },
  "魔法师们": {
    "en": "Mage",
    "size": "中型",
    "type": "类人妖",
    "alignment": "任意",
    "ac": 12,
    "ac_note": "dex",
    "hp": "40 (9d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 11}",
    "languages": "any four languages",
    "cr": "6",
    "traits": [
      [
        "Spellcasting",
        "The mage is a 9th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 14, +6 to hit with spell attacks). The mage has the following wizard spells prepared:\n\n- Cantrips (at will): fire bolt, light, mage hand, prestidigitation\n- 1st level (4 slots): detect magic, mage armor, magic missile, shield\n- 2nd level (3 slots): misty step, suggestion\n- 3rd level (3 slots): counterspell, fireball, fly\n- 4th level (3 slots): greater invisibility, ice storm\n- 5th level (1 slot): cone of cold"
      ]
    ],
    "actions": [
      {
        "name": "Dagger",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d4+2",
        "type": "穿刺",
        "extra": "Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 4 (1d4 + 2) piercing damage."
      }
    ]
  },
  "熔岩魔蝠": {
    "en": "Magma Mephit",
    "size": "小型",
    "type": "元素",
    "alignment": "中立邪恶",
    "ac": 11,
    "ac_note": "dex",
    "hp": "22 (5d6)",
    "speed": "30 ft., 飞行 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "火",
      "毒"
    ],
    "vuln": [
      "冷"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "火族语, 土族语",
    "cr": "1/2",
    "traits": [
      [
        "Death Burst",
        "When the mephit dies, it explodes in a burst of lava. Each creature within 5 ft. of it must make a DC 11 Dexterity saving throw, taking 7 (2d6) fire damage on a failed save, or half as much damage on a successful one."
      ],
      [
        "False Appearance",
        "While the mephit remains motionless, it is indistinguishable from an ordinary mound of magma."
      ],
      [
        "Innate Spellcasting",
        "The mephit can innately cast heat metal (spell save DC 10), requiring no material components. Its innate spellcasting ability is Charisma."
      ]
    ],
    "actions": [
      {
        "name": "Claws",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "1d4+1",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one creature. Hit: 3 (1d4 + 1) slashing damage plus 2 (1d4) fire damage."
      },
      {
        "name": "Fire Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "2d6",
        "type": "火",
        "extra": "The mephit exhales a 15-foot cone of fire. Each creature in that area must make a DC 11 Dexterity saving throw, taking 7 (2d6) fire damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "火童": {
    "en": "Magmin",
    "size": "小型",
    "type": "元素",
    "alignment": "混乱中立",
    "ac": 14,
    "ac_note": "natural",
    "hp": "9 (2d6)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "火"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "火族语",
    "cr": "1/2",
    "traits": [
      [
        "Death Burst",
        "When the magmin dies, it explodes in a burst of fire and magma. Each creature within 10 ft. of it must make a DC 11 Dexterity saving throw, taking 7 (2d6) fire damage on a failed save, or half as much damage on a successful one. Flammable objects that aren't being worn or carried in that area are ignited."
      ],
      [
        "Ignited Illumination",
        "As a bonus action, the magmin can set itself ablaze or extinguish its flames. While ablaze, the magmin sheds bright light in a 10-foot radius and dim light for an additional 10 ft."
      ]
    ],
    "actions": [
      {
        "name": "Touch",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "2d6",
        "type": "火",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (2d6) fire damage. If the target is a creature or a flammable object, it ignites. Until a target takes an action to douse the fire, the target takes 3 (1d6) fire damage at the end of each of its turns."
      }
    ]
  },
  "猛犸": {
    "en": "Mammoth",
    "size": "超大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 13,
    "ac_note": "natural",
    "hp": "126 (11d12)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 10}",
    "languages": "—",
    "cr": "6",
    "traits": [
      [
        "Trampling Charge",
        "If the mammoth moves at least 20 ft. straight toward a creature and then hits it with a gore attack on the same turn, that target must succeed on a DC 18 Strength saving throw or be knocked prone. If the target is prone, the mammoth can make one stomp attack against it as a bonus action."
      ]
    ],
    "actions": [
      {
        "name": "Gore",
        "atk": 10,
        "reach": "10 ft",
        "dmg": "4d8+7",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 25 (4d8 + 7) piercing damage."
      },
      {
        "name": "Stomp",
        "atk": 10,
        "reach": "5 ft",
        "dmg": "4d10+7",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +10 to hit, reach 5 ft., one prone creature. Hit: 29 (4d10 + 7) bludgeoning damage."
      }
    ]
  },
  "蝎狮": {
    "en": "Manticore",
    "size": "大型",
    "type": "怪兽",
    "alignment": "守序邪恶",
    "ac": 14,
    "ac_note": "natural",
    "hp": "68 (8d10)",
    "speed": "30 ft., 飞行 50 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 11}",
    "languages": "—",
    "cr": "3",
    "traits": [
      [
        "Tail Spike Regrowth",
        "The manticore has twenty-four tail spikes. Used spikes regrow when the manticore finishes a long rest."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The manticore makes three attacks: one with its bite and two with its claws or three with its tail spikes."
      },
      {
        "name": "Bite",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d8+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) piercing damage."
      },
      {
        "name": "Claw",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d6+3",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) slashing damage."
      },
      {
        "name": "Tail Spike",
        "atk": 5,
        "reach": "100/200 ft",
        "dmg": "1d8+3",
        "type": "穿刺",
        "extra": "Ranged Weapon Attack: +5 to hit, range 100/200 ft., one target. Hit: 7 (1d8 + 3) piercing damage."
      }
    ]
  },
  "六臂蛇魔": {
    "en": "Marilith",
    "size": "大型",
    "type": "邪魔",
    "alignment": "混乱邪恶",
    "ac": 18,
    "ac_note": "natural",
    "hp": "189 (18d10)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "冷",
      "火",
      "电",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "毒"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'真实视觉': '120 ft.', 'passive_perception': 13}",
    "languages": "深渊语, telepathy 120 ft.",
    "cr": "16",
    "traits": [
      [
        "Magic Resistance",
        "The marilith has advantage on saving throws against spells and other magical effects."
      ],
      [
        "Magic Weapons",
        "The marilith's weapon attacks are magical."
      ],
      [
        "Reactive",
        "The marilith can take one reaction on every turn in combat."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The marilith can make seven attacks: six with its longswords and one with its tail."
      },
      {
        "name": "Longsword",
        "atk": 9,
        "reach": "5 ft",
        "dmg": "2d8+4",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) slashing damage."
      },
      {
        "name": "Tail",
        "atk": 9,
        "reach": "10 ft",
        "dmg": "2d10+4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +9 to hit, reach 10 ft., one creature. Hit: 15 (2d10 + 4) bludgeoning damage. If the target is Medium or smaller, it is grappled (escape DC 19). Until this grapple ends, the target is restrained, the marilith can automatically hit the target with its tail, and the marilith can't make tail attacks against other targets."
      },
      {
        "name": "Teleport",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The marilith magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see."
      }
    ],
    "reactions": [
      {
        "name": "Parry",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The marilith adds 5 to its AC against one melee attack that would hit it. To do so, the marilith must see the attacker and be wielding a melee weapon."
      }
    ]
  },
  "獒犬": {
    "en": "Mastiff",
    "size": "中型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "dex",
    "hp": "5 (1d8)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 13}",
    "languages": "—",
    "cr": "1/8",
    "traits": [
      [
        "Keen Hearing and Smell",
        "The mastiff has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "1d6+1",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) piercing damage. If the target is a creature, it must succeed on a DC 11 Strength saving throw or be knocked prone."
      }
    ]
  },
  "美杜莎": {
    "en": "Medusa",
    "size": "中型",
    "type": "怪兽",
    "alignment": "守序邪恶",
    "ac": 15,
    "ac_note": "natural",
    "hp": "127 (17d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 14}",
    "languages": "通用语",
    "cr": "6",
    "traits": [
      [
        "Petrifying Gaze",
        "When a creature that can see the medusa's eyes starts its turn within 30 ft. of the medusa, the medusa can force it to make a DC 14 Constitution saving throw if the medusa isn't incapacitated and can see the creature. If the saving throw fails by 5 or more, the creature is instantly petrified. Otherwise, a creature that fails the save begins to turn to stone and is restrained. The restrained creature must repeat the saving throw at the end of its next turn, becoming petrified on a failure or ending the effect on a success. The petrification lasts until the creature is freed by the greater restoration spell or other magic.\nUnless surprised, a creature can avert its eyes to avoid the saving throw at the start of its turn. If the creature does so, it can't see the medusa until the start of its next turn, when it can avert its eyes again. If the creature looks at the medusa in the meantime, it must immediately make the save.\nIf the medusa sees itself reflected on a polished surface within 30 ft. of it and in an area of bright light, the medusa is, due to its curse, affected by its own gaze."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The medusa makes either three melee attacks--one with its snake hair and two with its shortsword--or two ranged attacks with its longbow."
      },
      {
        "name": "Snake Hair",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d4+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one creature. Hit: 4 (1d4 + 2) piercing damage plus 14 (4d6) poison damage."
      },
      {
        "name": "Shortsword",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d6+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage."
      },
      {
        "name": "Longbow",
        "atk": 5,
        "reach": "150/600 ft",
        "dmg": "1d8+2",
        "type": "穿刺",
        "extra": "Ranged Weapon Attack: +5 to hit, range 150/600 ft., one target. Hit: 6 (1d8 + 2) piercing damage plus 7 (2d6) poison damage."
      }
    ]
  },
  "人鱼": {
    "en": "Merfolk",
    "size": "中型",
    "type": "类人妖",
    "alignment": "中立",
    "ac": 11,
    "ac_note": "dex",
    "hp": "11 (2d8)",
    "speed": "10 ft., 游泳 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 12}",
    "languages": "水族语, 通用语",
    "cr": "1/8",
    "traits": [
      [
        "Amphibious",
        "The merfolk can breathe air and water."
      ]
    ],
    "actions": [
      {
        "name": "Spear",
        "atk": 2,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee or Ranged Weapon Attack: +2 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 3 (1d6) piercing damage, or 4 (1d8) piercing damage if used with two hands to make a melee attack."
      }
    ]
  },
  "迈罗人鱼": {
    "en": "Merrow",
    "size": "大型",
    "type": "怪兽",
    "alignment": "混乱邪恶",
    "ac": 13,
    "ac_note": "natural",
    "hp": "45 (6d10)",
    "speed": "10 ft., 游泳 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "深渊语, 水族语",
    "cr": "2",
    "traits": [
      [
        "Amphibious",
        "The merrow can breathe air and water."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The merrow makes two attacks: one with its bite and one with its claws or harpoon."
      },
      {
        "name": "Bite",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "1d8+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 8 (1d8 + 4) piercing damage."
      },
      {
        "name": "Claws",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d4+4",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 9 (2d4 + 4) slashing damage."
      },
      {
        "name": "Harpoon",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d6+4",
        "type": "穿刺",
        "extra": "Melee or Ranged Weapon Attack: +6 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 11 (2d6 + 4) piercing damage. If the target is a Huge or smaller creature, it must succeed on a Strength contest against the merrow or be pulled up to 20 feet toward the merrow."
      }
    ]
  },
  "拟态": {
    "en": "Mimic",
    "size": "中型",
    "type": "怪兽",
    "alignment": "中立",
    "ac": 12,
    "ac_note": "natural",
    "hp": "58 (9d8)",
    "speed": "15 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "酸"
    ],
    "cond_immune": [
      "倒地"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 11}",
    "languages": "—",
    "cr": "2",
    "traits": [
      [
        "Shapechanger",
        "The mimic can use its action to polymorph into an object or back into its true, amorphous form. Its statistics are the same in each form. Any equipment it is wearing or carrying isn 't transformed. It reverts to its true form if it dies."
      ],
      [
        "Adhesive (Object Form Only)",
        "The mimic adheres to anything that touches it. A Huge or smaller creature adhered to the mimic is also grappled by it (escape DC 13). Ability checks made to escape this grapple have disadvantage."
      ],
      [
        "False Appearance (Object Form Only)",
        "While the mimic remains motionless, it is indistinguishable from an ordinary object."
      ],
      [
        "Grappler",
        "The mimic has advantage on attack rolls against any creature grappled by it."
      ]
    ],
    "actions": [
      {
        "name": "Pseudopod",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d8+3",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) bludgeoning damage. If the mimic is in object form, the target is subjected to its Adhesive trait."
      },
      {
        "name": "Bite",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d8+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) piercing damage plus 4 (1d8) acid damage."
      }
    ]
  },
  "牛头人": {
    "en": "Minotaur",
    "size": "大型",
    "type": "怪兽",
    "alignment": "混乱邪恶",
    "ac": 14,
    "ac_note": "natural",
    "hp": "76 (9d10)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 17}",
    "languages": "深渊语",
    "cr": "3",
    "traits": [
      [
        "Charge",
        "If the minotaur moves at least 10 ft. straight toward a target and then hits it with a gore attack on the same turn, the target takes an extra 9 (2d8) piercing damage. If the target is a creature, it must succeed on a DC 14 Strength saving throw or be pushed up to 10 ft. away and knocked prone."
      ],
      [
        "Labyrinthine Recall",
        "The minotaur can perfectly recall any path it has traveled."
      ],
      [
        "Reckless",
        "At the start of its turn, the minotaur can gain advantage on all melee weapon attack rolls it makes during that turn, but attack rolls against it have advantage until the start of its next turn."
      ]
    ],
    "actions": [
      {
        "name": "Greataxe",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d12+4",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 17 (2d12 + 4) slashing damage."
      },
      {
        "name": "Gore",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d8+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) piercing damage."
      }
    ]
  },
  "骷髅牛头人": {
    "en": "Minotaur Skeleton",
    "size": "大型",
    "type": "不死",
    "alignment": "守序邪恶",
    "ac": 12,
    "ac_note": "natural",
    "hp": "67 (9d10)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "毒"
    ],
    "vuln": [
      "钝击"
    ],
    "cond_immune": [
      "力竭",
      "中毒"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 9}",
    "languages": "understands Abyssal but can't speak",
    "cr": "2",
    "traits": [
      [
        "Charge",
        "If the skeleton moves at least 10 feet straight toward a target and then hits it with a gore attack on the same turn, the target takes an extra 9 (2d8) piercing damage. If the target is a creature, it must succeed on a DC 14 Strength saving throw or be pushed up to 10 feet away and knocked prone."
      ]
    ],
    "actions": [
      {
        "name": "Greataxe",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d12+4",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 17 (2d12 + 4) slashing damage."
      },
      {
        "name": "Gore",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d8+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) piercing damage."
      }
    ]
  },
  "骡": {
    "en": "Mule",
    "size": "中型",
    "type": "野兽",
    "alignment": "无",
    "ac": 10,
    "ac_note": "dex",
    "hp": "11 (2d8)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 10}",
    "languages": "—",
    "cr": "1/8",
    "traits": [
      [
        "Beast of Burden",
        "The mule is considered to be a Large animal for the purpose of determining its carrying capacity."
      ],
      [
        "Sure-Footed",
        "The mule has advantage on Strength and Dexterity saving throws made against effects that would knock it prone."
      ]
    ],
    "actions": [
      {
        "name": "Hooves",
        "atk": 2,
        "reach": "5 ft",
        "dmg": "1d4+2",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) bludgeoning damage."
      }
    ]
  },
  "木乃伊": {
    "en": "Mummy",
    "size": "中型",
    "type": "不死",
    "alignment": "守序邪恶",
    "ac": 11,
    "ac_note": "natural",
    "hp": "58 (9d8)",
    "speed": "20 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "坏死",
      "毒"
    ],
    "vuln": [
      "火"
    ],
    "cond_immune": [
      "魅惑",
      "力竭",
      "惊惧",
      "麻痹",
      "中毒"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "the languages it knew in life",
    "cr": "3",
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The mummy can use its Dreadful Glare and makes one attack with its rotting fist."
      },
      {
        "name": "Rotting Fist",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "2d6+3",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) bludgeoning damage plus 10 (3d6) necrotic damage. If the target is a creature, it must succeed on a DC 12 Constitution saving throw or be cursed with mummy rot. The cursed target can't regain hit points, and its hit point maximum decreases by 10 (3d6) for every 24 hours that elapse. If the curse reduces the target's hit point maximum to 0, the target dies, and its body turns to dust. The curse lasts until removed by the remove curse spell or other magic."
      },
      {
        "name": "Dreadful Glare",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The mummy targets one creature it can see within 60 ft. of it. If the target can see the mummy, it must succeed on a DC 11 Wisdom saving throw against this magic or become frightened until the end of the mummy's next turn. If the target fails the saving throw by 5 or more, it is also paralyzed for the same duration. A target that succeeds on the saving throw is immune to the Dreadful Glare of all mummies (but not mummy lords) for the next 24 hours."
      }
    ]
  },
  "木乃伊领主": {
    "en": "Mummy Lord",
    "size": "中型",
    "type": "不死",
    "alignment": "守序邪恶",
    "ac": 17,
    "ac_note": "natural",
    "hp": "97 (13d8)",
    "speed": "20 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "坏死",
      "毒",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "vuln": [
      "火"
    ],
    "cond_immune": [
      "魅惑",
      "力竭",
      "惊惧",
      "麻痹",
      "中毒"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 14}",
    "languages": "the languages it knew in life",
    "cr": "15",
    "traits": [
      [
        "Magic Resistance",
        "The mummy lord has advantage on saving throws against spells and other magical effects."
      ],
      [
        "Rejuvenation",
        "A destroyed mummy lord gains a new body in 24 hours if its heart is intact, regaining all its hit points and becoming active again. The new body appears within 5 feet of the mummy lord's heart."
      ],
      [
        "Spellcasting",
        "The mummy lord is a 10th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 17, +9 to hit with spell attacks). The mummy lord has the following cleric spells prepared:\n\n- Cantrips (at will): sacred flame, thaumaturgy\n- 1st level (4 slots): command, guiding bolt, shield of faith\n- 2nd level (3 slots): hold person, silence, spiritual weapon\n- 3rd level (3 slots): animate dead, dispel magic\n- 4th level (3 slots): divination, guardian of faith\n- 5th level (2 slots): contagion, insect plague\n- 6th level (1 slot): harm"
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The mummy can use its Dreadful Glare and makes one attack with its rotting fist."
      },
      {
        "name": "Rotting Fist",
        "atk": 9,
        "reach": "5 ft",
        "dmg": "3d6+4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 14 (3d6 + 4) bludgeoning damage plus 21 (6d6) necrotic damage. If the target is a creature, it must succeed on a DC 16 Constitution saving throw or be cursed with mummy rot. The cursed target can't regain hit points, and its hit point maximum decreases by 10 (3d6) for every 24 hours that elapse. If the curse reduces the target's hit point maximum to 0, the target dies, and its body turns to dust. The curse lasts until removed by the remove curse spell or other magic."
      },
      {
        "name": "Dreadful Glare",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The mummy lord targets one creature it can see within 60 feet of it. If the target can see the mummy lord, it must succeed on a DC 16 Wisdom saving throw against this magic or become frightened until the end of the mummy's next turn. If the target fails the saving throw by 5 or more, it is also paralyzed for the same duration. A target that succeeds on the saving throw is immune to the Dreadful Glare of all mummies and mummy lords for the next 24 hours."
      }
    ],
    "legendary": [
      {
        "name": "Attack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The mummy lord makes one attack with its rotting fist or uses its Dreadful Glare."
      },
      {
        "name": "Blinding Dust",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Blinding dust and sand swirls magically around the mummy lord. Each creature within 5 feet of the mummy lord must succeed on a DC 16 Constitution saving throw or be blinded until the end of the creature's next turn."
      },
      {
        "name": "Blasphemous Word (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The mummy lord utters a blasphemous word. Each non-undead creature within 10 feet of the mummy lord that can hear the magical utterance must succeed on a DC 16 Constitution saving throw or be stunned until the end of the mummy lord's next turn."
      },
      {
        "name": "Channel Negative Energy (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The mummy lord magically unleashes negative energy. Creatures within 60 feet of the mummy lord, including ones behind barriers and around corners, can't regain hit points until the end of the mummy lord's next turn."
      },
      {
        "name": "Whirlwind of Sand (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The mummy lord magically transforms into a whirlwind of sand, moves up to 60 feet, and reverts to its normal form. While in whirlwind form, the mummy lord is immune to all damage, and it can't be grappled, petrified, knocked prone, restrained, or stunned. Equipment worn or carried by the mummy lord remain in its possession."
      }
    ]
  },
  "判魂魔": {
    "en": "Nalfeshnee",
    "size": "大型",
    "type": "邪魔",
    "alignment": "混乱邪恶",
    "ac": 18,
    "ac_note": "natural",
    "hp": "184 (16d10)",
    "speed": "20 ft., 飞行 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "冷",
      "火",
      "电",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "毒"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'真实视觉': '120 ft.', 'passive_perception': 11}",
    "languages": "深渊语, telepathy 120 ft.",
    "cr": "13",
    "traits": [
      [
        "Magic Resistance",
        "The nalfeshnee has advantage on saving throws against spells and other magical effects."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The nalfeshnee uses Horror Nimbus if it can. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 10,
        "reach": "5 ft",
        "dmg": "5d10+5",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 32 (5d10 + 5) piercing damage."
      },
      {
        "name": "Claw",
        "atk": 10,
        "reach": "10 ft",
        "dmg": "3d6+5",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 15 (3d6 + 5) slashing damage."
      },
      {
        "name": "Horror Nimbus",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The nalfeshnee magically emits scintillating, multicolored light. Each creature within 15 feet of the nalfeshnee that can see the light must succeed on a DC 15 Wisdom saving throw or be frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the nalfeshnee's Horror Nimbus for the next 24 hours."
      },
      {
        "name": "Teleport",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The nalfeshnee magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see."
      }
    ]
  },
  "夜鬼婆": {
    "en": "Night Hag",
    "size": "中型",
    "type": "邪魔",
    "alignment": "中立邪恶",
    "ac": 17,
    "ac_note": "natural",
    "hp": "112 (15d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "冷",
      "火",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "cond_immune": [
      "魅惑"
    ],
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 16}",
    "languages": "深渊语, 通用语, 炼狱语, 原初语",
    "cr": "5",
    "traits": [
      [
        "Innate Spellcasting",
        "The hag's innate spellcasting ability is Charisma (spell save DC 14, +6 to hit with spell attacks). She can innately cast the following spells, requiring no material components:\n\nAt will: detect magic, magic missile\n2/day each: plane shift (self only), ray of enfeeblement, sleep"
      ],
      [
        "Magic Resistance",
        "The hag has advantage on saving throws against spells and other magical effects."
      ],
      [
        "Night Hag Items",
        "A night hag carries two very rare magic items that she must craft for herself If either object is lost, the night hag will go to great lengths to retrieve it, as creating a new tool takes time and effort.\nHeartstone: This lustrous black gem allows a night hag to become ethereal while it is in her possession. The touch of a heartstone also cures any disease. Crafting a heartstone takes 30 days.\nSoul Bag: When an evil humanoid dies as a result of a night hag's Nightmare Haunting, the hag catches the soul in this black sack made of stitched flesh. A soul bag can hold only one evil soul at a time, and only the night hag who crafted the bag can catch a soul with it. Crafting a soul bag takes 7 days and a humanoid sacrifice (whose flesh is used to make the bag)."
      ]
    ],
    "actions": [
      {
        "name": "Claws (Hag Form Only)",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "2d8+4",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) slashing damage."
      },
      {
        "name": "Change Shape",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The hag magically polymorphs into a Small or Medium female humanoid, or back into her true form. Her statistics are the same in each form. Any equipment she is wearing or carrying isn't transformed. She reverts to her true form if she dies."
      },
      {
        "name": "Etherealness",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The hag magically enters the Ethereal Plane from the Material Plane, or vice versa. To do so, the hag must have a heartstone in her possession."
      },
      {
        "name": "Nightmare Haunting",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "While on the Ethereal Plane, the hag magically touches a sleeping humanoid on the Material Plane. A protection from evil and good spell cast on the target prevents this contact, as does a magic circle. As long as the contact persists, the target has dreadful visions. If these visions last for at least 1 hour, the target gains no benefit from its rest, and its hit point maximum is reduced by 5 (1d10). If this effect reduces the target's hit point maximum to 0, the target dies, and if the target was evil, its soul is trapped in the hag's soul bag. The reduction to the target's hit point maximum lasts until removed by the greater restoration spell or similar magic."
      }
    ]
  },
  "梦魇": {
    "en": "Nightmare",
    "size": "大型",
    "type": "邪魔",
    "alignment": "中立邪恶",
    "ac": 13,
    "ac_note": "natural",
    "hp": "68 (8d10)",
    "speed": "60 ft., 飞行 90 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "火"
    ],
    "senses": "{'passive_perception': 11}",
    "languages": "understands Abyssal, 通用语, and Infernal but can't speak",
    "cr": "3",
    "traits": [
      [
        "Confer Fire Resistance",
        "The nightmare can grant resistance to fire damage to anyone riding it."
      ],
      [
        "Illumination",
        "The nightmare sheds bright light in a 10-foot radius and dim light for an additional 10 feet."
      ]
    ],
    "actions": [
      {
        "name": "Hooves",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d8+4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) bludgeoning damage plus 7 (2d6) fire damage."
      },
      {
        "name": "Ethereal Stride",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The nightmare and up to three willing creatures within 5 feet of it magically enter the Ethereal Plane from the Material Plane, or vice versa."
      }
    ]
  },
  "贵族们": {
    "en": "Noble",
    "size": "中型",
    "type": "类人妖",
    "alignment": "任意",
    "ac": 15,
    "ac_note": "Breastplate",
    "hp": "9 (2d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 12}",
    "languages": "any two languages",
    "cr": "1/8",
    "traits": [],
    "actions": [
      {
        "name": "Rapier",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "1d8+1",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 5 (1d8 + 1) piercing damage."
      }
    ],
    "reactions": [
      {
        "name": "Parry",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The noble adds 2 to its AC against one melee attack that would hit it. To do so, the noble must see the attacker and be wielding a melee weapon."
      }
    ]
  },
  "赭果冻": {
    "en": "Ochre Jelly",
    "size": "大型",
    "type": "泥形",
    "alignment": "无",
    "ac": 8,
    "ac_note": "dex",
    "hp": "45 (6d10)",
    "speed": "10 ft., 爬 10 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "酸"
    ],
    "immune": [
      "电",
      "挥砍"
    ],
    "cond_immune": [
      "目盲",
      "魅惑",
      "目盲",
      "力竭",
      "惊惧",
      "倒地"
    ],
    "senses": "{'盲视': '60 ft. (blind beyond this radius)', 'passive_perception': 8}",
    "languages": "—",
    "cr": "2",
    "traits": [
      [
        "Amorphous",
        "The jelly can move through a space as narrow as 1 inch wide without squeezing."
      ],
      [
        "Spider Climb",
        "The jelly can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."
      ]
    ],
    "actions": [
      {
        "name": "Pseudopod",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "2d6+2",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 9 (2d6 + 2) bludgeoning damage plus 3 (1d6) acid damage."
      }
    ],
    "reactions": [
      {
        "name": "Split",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "When a jelly that is Medium or larger is subjected to lightning or slashing damage, it splits into two new jellies if it has at least 10 hit points. Each new jelly has hit points equal to half the original jelly's, rounded down. New jellies are one size smaller than the original jelly."
      }
    ]
  },
  "章鱼": {
    "en": "Octopus",
    "size": "小型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "dex",
    "hp": "3 (1d6)",
    "speed": "5 ft., 游泳 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '30 ft.', 'passive_perception': 12}",
    "languages": "—",
    "cr": "0",
    "traits": [
      [
        "Hold Breath",
        "While out of water, the octopus can hold its breath for 30 minutes."
      ],
      [
        "Underwater Camouflage",
        "The octopus has advantage on Dexterity (Stealth) checks made while underwater."
      ],
      [
        "Water Breathing",
        "The octopus can breathe only underwater."
      ]
    ],
    "actions": [
      {
        "name": "Tentacles",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 1 bludgeoning damage, and the target is grappled (escape DC 10). Until this grapple ends, the octopus can't use its tentacles on another target."
      },
      {
        "name": "Ink Cloud",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "A 5-foot-radius cloud of ink extends all around the octopus if it is underwater. The area is heavily obscured for 1 minute, although a significant current can disperse the ink. After releasing the ink, the octopus can use the Dash action as a bonus action."
      }
    ]
  },
  "食人魔": {
    "en": "Ogre",
    "size": "大型",
    "type": "巨人",
    "alignment": "混乱邪恶",
    "ac": 11,
    "ac_note": "Hide Armor",
    "hp": "59 (7d10)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 8}",
    "languages": "通用语, 巨语",
    "cr": "2",
    "traits": [],
    "actions": [
      {
        "name": "Greatclub",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d8+4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) bludgeoning damage."
      },
      {
        "name": "Javelin",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d6+4",
        "type": "穿刺",
        "extra": "Melee or Ranged Weapon Attack: +6 to hit, reach 5 ft. or range 30/120 ft., one target. Hit: 11 (2d6 + 4) piercing damage."
      }
    ]
  },
  "食人魔僵尸": {
    "en": "Ogre Zombie",
    "size": "大型",
    "type": "不死",
    "alignment": "中立邪恶",
    "ac": 8,
    "ac_note": "dex",
    "hp": "85 (9d10)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "毒"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 8}",
    "languages": "understands Common and Giant but can't speak",
    "cr": "2",
    "traits": [
      [
        "Undead Fortitude",
        "If damage reduces the zombie to 0 hit points, it must make a Constitution saving throw with a DC of 5+the damage taken, unless the damage is radiant or from a critical hit. On a success, the zombie drops to 1 hit point instead."
      ]
    ],
    "actions": [
      {
        "name": "Morningstar",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d8+4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) bludgeoning damage."
      }
    ]
  },
  "恶鬼": {
    "en": "Oni",
    "size": "大型",
    "type": "巨人",
    "alignment": "守序邪恶",
    "ac": 16,
    "ac_note": "Chain Mail",
    "hp": "110 (13d10)",
    "speed": "30 ft., 飞行 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 14}",
    "languages": "通用语, 巨语",
    "cr": "7",
    "traits": [
      [
        "Innate Spellcasting",
        "The oni's innate spellcasting ability is Charisma (spell save DC 13). The oni can innately cast the following spells, requiring no material components:\n\nAt will: darkness, invisibility\n1/day each: charm person, cone of cold, gaseous form, sleep"
      ],
      [
        "Magic Weapons",
        "The oni's weapon attacks are magical."
      ],
      [
        "Regeneration",
        "The oni regains 10 hit points at the start of its turn if it has at least 1 hit point."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The oni makes two attacks, either with its claws or its glaive."
      },
      {
        "name": "Claw (Oni Form Only)",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "1d8+4",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 8 (1d8 + 4) slashing damage."
      },
      {
        "name": "Glaive",
        "atk": 7,
        "reach": "10 ft",
        "dmg": "2d10+4",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 15 (2d10 + 4) slashing damage, or 9 (1d10 + 4) slashing damage in Small or Medium form."
      },
      {
        "name": "Change Shape",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The oni magically polymorphs into a Small or Medium humanoid, into a Large giant, or back into its true form. Other than its size, its statistics are the same in each form. The only equipment that is transformed is its glaive, which shrinks so that it can be wielded in humanoid form. If the oni dies, it reverts to its true form, and its glaive reverts to its normal size."
      }
    ]
  },
  "兽人": {
    "en": "Orc",
    "size": "中型",
    "type": "类人妖",
    "alignment": "混乱邪恶",
    "ac": 13,
    "ac_note": "Hide Armor",
    "hp": "15 (2d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "通用语, 兽人语",
    "cr": "1/2",
    "traits": [
      [
        "Aggressive",
        "As a bonus action, the orc can move up to its speed toward a hostile creature that it can see."
      ]
    ],
    "actions": [
      {
        "name": "Greataxe",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d12+3",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9 (1d12 + 3) slashing damage."
      },
      {
        "name": "Javelin",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d6+3",
        "type": "穿刺",
        "extra": "Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 30/120 ft., one target. Hit: 6 (1d6 + 3) piercing damage."
      }
    ]
  },
  "食腐兽": {
    "en": "Otyugh",
    "size": "大型",
    "type": "异怪",
    "alignment": "中立",
    "ac": 14,
    "ac_note": "natural",
    "hp": "114 (12d10)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 11}",
    "languages": "Otyugh",
    "cr": "5",
    "traits": [
      [
        "Limited Telepathy",
        "The otyugh can magically transmit simple messages and images to any creature within 120 ft. of it that can understand a language. This form of telepathy doesn't allow the receiving creature to telepathically respond."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The otyugh makes three attacks: one with its bite and two with its tentacles."
      },
      {
        "name": "Bite",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d8+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 12 (2d8 + 3) piercing damage. If the target is a creature, it must succeed on a DC 15 Constitution saving throw against disease or become poisoned until the disease is cured. Every 24 hours that elapse, the target must repeat the saving throw, reducing its hit point maximum by 5 (1d10) on a failure. The disease is cured on a success. The target dies if the disease reduces its hit point maximum to 0. This reduction to the target's hit point maximum lasts until the disease is cured."
      },
      {
        "name": "Tentacle",
        "atk": 6,
        "reach": "10 ft",
        "dmg": "1d8+3",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +6 to hit, reach 10 ft., one target. Hit: 7 (1d8 + 3) bludgeoning damage plus 4 (1d8) piercing damage. If the target is Medium or smaller, it is grappled (escape DC 13) and restrained until the grapple ends. The otyugh has two tentacles, each of which can grapple one target."
      },
      {
        "name": "Tentacle Slam",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The otyugh slams creatures grappled by it into each other or a solid surface. Each creature must succeed on a DC 14 Constitution saving throw or take 10 (2d6 + 3) bludgeoning damage and be stunned until the end of the otyugh's next turn. On a successful save, the target takes half the bludgeoning damage and isn't stunned."
      }
    ]
  },
  "鸮": {
    "en": "Owl",
    "size": "超小型",
    "type": "野兽",
    "alignment": "无",
    "ac": 11,
    "ac_note": "dex",
    "hp": "1 (1d4)",
    "speed": "5 ft., 飞行 60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 13}",
    "languages": "—",
    "cr": "0",
    "traits": [
      [
        "Flyby",
        "The owl doesn't provoke opportunity attacks when it flies out of an enemy's reach."
      ],
      [
        "Keen Hearing and Sight",
        "The owl has advantage on Wisdom (Perception) checks that rely on hearing or sight."
      ]
    ],
    "actions": [
      {
        "name": "Talons",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "1",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1 slashing damage."
      }
    ]
  },
  "枭熊": {
    "en": "Owlbear",
    "size": "大型",
    "type": "怪兽",
    "alignment": "无",
    "ac": 13,
    "ac_note": "natural",
    "hp": "59 (7d10)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 13}",
    "languages": "—",
    "cr": "3",
    "traits": [
      [
        "Keen Sight and Smell",
        "The owlbear has advantage on Wisdom (Perception) checks that rely on sight or smell."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The owlbear makes two attacks: one with its beak and one with its claws."
      },
      {
        "name": "Beak",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "1d10+5",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one creature. Hit: 10 (1d10 + 5) piercing damage."
      },
      {
        "name": "Claws",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "2d8+5",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 14 (2d8 + 5) slashing damage."
      }
    ]
  },
  "黑豹": {
    "en": "Panther",
    "size": "中型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "dex",
    "hp": "13 (3d8)",
    "speed": "50 ft., 爬 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 14}",
    "languages": "—",
    "cr": "1/4",
    "traits": [
      [
        "Keen Smell",
        "The panther has advantage on Wisdom (Perception) checks that rely on smell."
      ],
      [
        "Pounce",
        "If the panther moves at least 20 ft. straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 12 Strength saving throw or be knocked prone. If the target is prone, the panther can make one bite attack against it as a bonus action."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d6+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage."
      },
      {
        "name": "Claw",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d4+2",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) slashing damage."
      }
    ]
  },
  "天马": {
    "en": "Pegasus",
    "size": "大型",
    "type": "天界",
    "alignment": "混乱善良",
    "ac": 12,
    "ac_note": "dex",
    "hp": "59 (7d10)",
    "speed": "60 ft., 飞行 90 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 16}",
    "languages": "understands Celestial, 通用语, 精灵语, and Sylvan but can't speak",
    "cr": "2",
    "traits": [],
    "actions": [
      {
        "name": "Hooves",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d6+4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) bludgeoning damage."
      }
    ]
  },
  "相位蜘蛛": {
    "en": "Phase Spider",
    "size": "大型",
    "type": "怪兽",
    "alignment": "无",
    "ac": 13,
    "ac_note": "natural",
    "hp": "32 (5d10)",
    "speed": "30 ft., 爬 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "—",
    "cr": "3",
    "traits": [
      [
        "Ethereal Jaunt",
        "As a bonus action, the spider can magically shift from the Material Plane to the Ethereal Plane, or vice versa."
      ],
      [
        "Spider Climb",
        "The spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."
      ],
      [
        "Web Walker",
        "The spider ignores movement restrictions caused by webbing."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d10+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 7 (1d10 + 2) piercing damage, and the target must make a DC 11 Constitution saving throw, taking 18 (4d8) poison damage on a failed save, or half as much damage on a successful one. If the poison damage reduces the target to 0 hit points, the target is stable but poisoned for 1 hour, even after regaining hit points, and is paralyzed while poisoned in this way."
      }
    ]
  },
  "深狱炼魔": {
    "en": "Pit Fiend",
    "size": "大型",
    "type": "邪魔",
    "alignment": "守序邪恶",
    "ac": 19,
    "ac_note": "natural",
    "hp": "300 (24d10)",
    "speed": "30 ft., 飞行 60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "冷",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "火",
      "毒"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'真实视觉': '120 ft.', 'passive_perception': 14}",
    "languages": "炼狱语, telepathy 120 ft.",
    "cr": "20",
    "traits": [
      [
        "Fear Aura",
        "Any creature hostile to the pit fiend that starts its turn within 20 feet of the pit fiend must make a DC 21 Wisdom saving throw, unless the pit fiend is incapacitated. On a failed save, the creature is frightened until the start of its next turn. If a creature's saving throw is successful, the creature is immune to the pit fiend's Fear Aura for the next 24 hours."
      ],
      [
        "Magic Resistance",
        "The pit fiend has advantage on saving throws against spells and other magical effects."
      ],
      [
        "Magic Weapons",
        "The pit fiend's weapon attacks are magical."
      ],
      [
        "Innate Spellcasting",
        "The pit fiend's spellcasting ability is Charisma (spell save DC 21). The pit fiend can innately cast the following spells, requiring no material components:\nAt will: detect magic, fireball\n3/day each: hold monster, wall of fire"
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The pit fiend makes four attacks: one with its bite, one with its claw, one with its mace, and one with its tail."
      },
      {
        "name": "Bite",
        "atk": 14,
        "reach": "5 ft",
        "dmg": "4d6+8",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +14 to hit, reach 5 ft., one target. Hit: 22 (4d6 + 8) piercing damage. The target must succeed on a DC 21 Constitution saving throw or become poisoned. While poisoned in this way, the target can't regain hit points, and it takes 21 (6d6) poison damage at the start of each of its turns. The poisoned target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      },
      {
        "name": "Claw",
        "atk": 14,
        "reach": "10 ft",
        "dmg": "2d8+8",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 17 (2d8 + 8) slashing damage."
      },
      {
        "name": "Mace",
        "atk": 14,
        "reach": "10 ft",
        "dmg": "2d6+8",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 15 (2d6 + 8) bludgeoning damage plus 21 (6d6) fire damage."
      },
      {
        "name": "Tail",
        "atk": 14,
        "reach": "10 ft",
        "dmg": "3d10+8",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 24 (3d10 + 8) bludgeoning damage."
      }
    ]
  },
  "异界神侍": {
    "en": "Planetar",
    "size": "大型",
    "type": "天界",
    "alignment": "守序善良",
    "ac": 19,
    "ac_note": "natural",
    "hp": "200 (16d10)",
    "speed": "40 ft., 飞行 120 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "光耀",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "cond_immune": [
      "魅惑",
      "力竭",
      "惊惧"
    ],
    "senses": "{'真实视觉': '120 ft.', 'passive_perception': 21}",
    "languages": "all, telepathy 120 ft.",
    "cr": "16",
    "traits": [
      [
        "Angelic Weapons",
        "The planetar's weapon attacks are magical. When the planetar hits with any weapon, the weapon deals an extra 5d8 radiant damage (included in the attack)."
      ],
      [
        "Divine Awareness",
        "The planetar knows if it hears a lie."
      ],
      [
        "Innate Spellcasting",
        "The planetar's spellcasting ability is Charisma (spell save DC 20). The planetar can innately cast the following spells, requiring no material components:\nAt will: detect evil and good, invisibility (self only)\n3/day each: blade barrier, dispel evil and good, flame strike, raise dead\n1/day each: commune, control weather, insect plague"
      ],
      [
        "Magic Resistance",
        "The planetar has advantage on saving throws against spells and other magical effects."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The planetar makes two melee attacks."
      },
      {
        "name": "Greatsword",
        "atk": 12,
        "reach": "5 ft",
        "dmg": "4d6+7",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +12 to hit, reach 5 ft., one target. Hit: 21 (4d6 + 7) slashing damage plus 22 (5d8) radiant damage."
      },
      {
        "name": "Healing Touch",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The planetar touches another creature. The target magically regains 30 (6d8 + 3) hit points and is freed from any curse, disease, poison, blindness, or deafness."
      }
    ]
  },
  "蛇颈龙": {
    "en": "Plesiosaurus",
    "size": "大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 13,
    "ac_note": "natural",
    "hp": "68 (8d10)",
    "speed": "20 ft., 游泳 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 13}",
    "languages": "—",
    "cr": "2",
    "traits": [
      [
        "Hold Breath",
        "The plesiosaurus can hold its breath for 1 hour."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 6,
        "reach": "10 ft",
        "dmg": "3d6+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +6 to hit, reach 10 ft., one target. Hit: 14 (3d6 + 4) piercing damage."
      }
    ]
  },
  "毒蛇": {
    "en": "Poisonous Snake",
    "size": "超小型",
    "type": "野兽",
    "alignment": "无",
    "ac": 13,
    "ac_note": "dex",
    "hp": "2 (1d4)",
    "speed": "30 ft., 游泳 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'盲视': '10 ft.', 'passive_perception': 10}",
    "languages": "—",
    "cr": "1/8",
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 1 piercing damage, and the target must make a DC 10 Constitution saving throw, taking 5 (2d4) poison damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "北极熊": {
    "en": "Polar Bear",
    "size": "大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "natural",
    "hp": "42 (5d10)",
    "speed": "40 ft., 游泳 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 13}",
    "languages": "—",
    "cr": "2",
    "traits": [
      [
        "Keen Smell",
        "The bear has advantage on Wisdom (Perception) checks that rely on smell."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The bear makes two attacks: one with its bite and one with its claws."
      },
      {
        "name": "Bite",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "1d8+5",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 9 (1d8 + 5) piercing damage."
      },
      {
        "name": "Claws",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "2d6+5",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 5) slashing damage."
      }
    ]
  },
  "矮种马": {
    "en": "Pony",
    "size": "中型",
    "type": "野兽",
    "alignment": "无",
    "ac": 10,
    "ac_note": "dex",
    "hp": "11 (2d8)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 10}",
    "languages": "—",
    "cr": "1/8",
    "traits": [],
    "actions": [
      {
        "name": "Hooves",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "2d4+2",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (2d4 + 2) bludgeoning damage."
      }
    ]
  },
  "祭司": {
    "en": "Priest",
    "size": "中型",
    "type": "类人妖",
    "alignment": "任意",
    "ac": 13,
    "ac_note": "Chain Shirt",
    "hp": "27 (5d8)",
    "speed": "25 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 13}",
    "languages": "any two languages",
    "cr": "2",
    "traits": [
      [
        "Divine Eminence",
        "As a bonus action, the priest can expend a spell slot to cause its melee weapon attacks to magically deal an extra 10 (3d6) radiant damage to a target on a hit. This benefit lasts until the end of the turn. If the priest expends a spell slot of 2nd level or higher, the extra damage increases by 1d6 for each level above 1st."
      ],
      [
        "Spellcasting",
        "The priest is a 5th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 13, +5 to hit with spell attacks). The priest has the following cleric spells prepared:\n\n- Cantrips (at will): light, sacred flame, thaumaturgy\n- 1st level (4 slots): cure wounds, guiding bolt, sanctuary\n- 2nd level (3 slots): lesser restoration, spiritual weapon\n- 3rd level (2 slots): dispel magic, spirit guardians"
      ]
    ],
    "actions": [
      {
        "name": "Mace",
        "atk": 2,
        "reach": "5 ft",
        "dmg": "1d6",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 3 (1d6) bludgeoning damage."
      }
    ]
  },
  "伪龙": {
    "en": "Pseudodragon",
    "size": "超小型",
    "type": "龙",
    "alignment": "中立善良",
    "ac": 13,
    "ac_note": "natural",
    "hp": "7 (2d4)",
    "speed": "15 ft., 飞行 60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'盲视': '10 ft.', '黑暗视觉': '60 ft.', 'passive_perception': 13}",
    "languages": "understands Common and Draconic but can't speak",
    "cr": "1/4",
    "traits": [
      [
        "Keen Senses",
        "The pseudodragon has advantage on Wisdom (Perception) checks that rely on sight, hearing, or smell."
      ],
      [
        "Magic Resistance",
        "The pseudodragon has advantage on saving throws against spells and other magical effects."
      ],
      [
        "Limited Telepathy",
        "The pseudodragon can magically communicate simple ideas, emotions, and images telepathically with any creature within 100 ft. of it that can understand a language."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d4+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) piercing damage."
      },
      {
        "name": "Sting",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d4+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 4 (1d4 + 2) piercing damage, and the target must succeed on a DC 11 Constitution saving throw or become poisoned for 1 hour. If the saving throw fails by 5 or more, the target falls unconscious for the same duration, or until it takes damage or another creature uses an action to shake it awake."
      }
    ]
  },
  "紫虫": {
    "en": "Purple Worm",
    "size": "巨型",
    "type": "怪兽",
    "alignment": "无",
    "ac": 18,
    "ac_note": "natural",
    "hp": "247 (15d20)",
    "speed": "50 ft., 掘地 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'盲视': '30 ft.', '震颤感知': '60 ft.', 'passive_perception': 9}",
    "languages": "—",
    "cr": "15",
    "traits": [
      [
        "Tunneler",
        "The worm can burrow through solid rock at half its burrow speed and leaves a 10-foot-diameter tunnel in its wake."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The worm makes two attacks: one with its bite and one with its stinger."
      },
      {
        "name": "Bite",
        "atk": 9,
        "reach": "10 ft",
        "dmg": "3d8+9",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 22 (3d8 + 9) piercing damage. If the target is a Large or smaller creature, it must succeed on a DC 19 Dexterity saving throw or be swallowed by the worm. A swallowed creature is blinded and restrained, it has total cover against attacks and other effects outside the worm, and it takes 21 (6d6) acid damage at the start of each of the worm's turns.\nIf the worm takes 30 damage or more on a single turn from a creature inside it, the worm must succeed on a DC 21 Constitution saving throw at the end of that turn or regurgitate all swallowed creatures, which fall prone in a space within 10 feet of the worm. If the worm dies, a swallowed creature is no longer restrained by it and can escape from the corpse by using 20 feet of movement, exiting prone."
      },
      {
        "name": "Tail Stinger",
        "atk": 9,
        "reach": "10 ft",
        "dmg": "3d6+9",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +9 to hit, reach 10 ft., one creature. Hit: 19 (3d6 + 9) piercing damage, and the target must make a DC 19 Constitution saving throw, taking 42 (12d6) poison damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "小恶魔（Quasit）": {
    "en": "Quasit",
    "size": "超小型",
    "type": "邪魔",
    "alignment": "混乱邪恶",
    "ac": 13,
    "ac_note": "dex",
    "hp": "7 (3d4)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "冷",
      "火",
      "电",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "毒"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 10}",
    "languages": "深渊语, 通用语",
    "cr": "1",
    "traits": [
      [
        "Shapechanger",
        "The quasit can use its action to polymorph into a beast form that resembles a bat (speed 10 ft. fly 40 ft.), a centipede (40 ft., climb 40 ft.), or a toad (40 ft., swim 40 ft.), or back into its true form . Its statistics are the same in each form, except for the speed changes noted. Any equipment it is wearing or carrying isn't transformed . It reverts to its true form if it dies."
      ],
      [
        "Magic Resistance",
        "The quasit has advantage on saving throws against spells and other magical effects."
      ]
    ],
    "actions": [
      {
        "name": "Claw (Bite in Beast Form)",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d4+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d4 + 3) piercing damage, and the target must succeed on a DC 10 Constitution saving throw or take 5 (2d4) poison damage and become poisoned for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      },
      {
        "name": "Scare",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "One creature of the quasit's choice within 20 ft. of it must succeed on a DC 10 Wisdom saving throw or be frightened for 1 minute. The target can repeat the saving throw at the end of each of its turns, with disadvantage if the quasit is within line of sight, ending the effect on itself on a success."
      },
      {
        "name": "Invisibility",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The quasit magically turns invisible until it attacks or uses Scare, or until its concentration ends (as if concentrating on a spell). Any equipment the quasit wears or carries is invisible with it."
      }
    ]
  },
  "食人鱼": {
    "en": "Quipper",
    "size": "超小型",
    "type": "野兽",
    "alignment": "无",
    "ac": 13,
    "ac_note": "dex",
    "hp": "1 (1d4)",
    "speed": "游泳 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 8}",
    "languages": "—",
    "cr": "0",
    "traits": [
      [
        "Blood Frenzy",
        "The quipper has advantage on melee attack rolls against any creature that doesn't have all its hit points."
      ],
      [
        "Water Breathing",
        "The quipper can breathe only underwater."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 1 piercing damage."
      }
    ]
  },
  "罗刹": {
    "en": "Rakshasa",
    "size": "中型",
    "type": "邪魔",
    "alignment": "守序邪恶",
    "ac": 16,
    "ac_note": "natural",
    "hp": "110 (13d8)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "钝击",
      "穿刺",
      "slashing"
    ],
    "vuln": [
      "piercing"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 13}",
    "languages": "通用语, 炼狱语",
    "cr": "13",
    "traits": [
      [
        "Limited Magic Immunity",
        "The rakshasa can't be affected or detected by spells of 6th level or lower unless it wishes to be. It has advantage on saving throws against all other spells and magical effects."
      ],
      [
        "Innate Spellcasting",
        "The rakshasa's innate spellcasting ability is Charisma (spell save DC 18, +10 to hit with spell attacks). The rakshasa can innately cast the following spells, requiring no material components:\n\nAt will: detect thoughts, disguise self, mage hand, minor illusion\n3/day each: charm person, detect magic, invisibility, major image, suggestion\n1/day each: dominate person, fly, plane shift, true seeing"
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The rakshasa makes two claw attacks"
      },
      {
        "name": "Claw",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "2d6+2",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 9 (2d6 + 2) slashing damage, and the target is cursed if it is a creature. The magical curse takes effect whenever the target takes a short or long rest, filling the target's thoughts with horrible images and dreams. The cursed target gains no benefit from finishing a short or long rest. The curse lasts until it is lifted by a remove curse spell or similar magic."
      }
    ]
  },
  "鼠": {
    "en": "Rat",
    "size": "超小型",
    "type": "野兽",
    "alignment": "无",
    "ac": 10,
    "ac_note": "dex",
    "hp": "1 (1d4)",
    "speed": "20 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '30 ft.', 'passive_perception': 10}",
    "languages": "—",
    "cr": "0",
    "traits": [
      [
        "Keen Smell",
        "The rat has advantage on Wisdom (Perception) checks that rely on smell."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "1",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 1 piercing damage."
      }
    ]
  },
  "乌鸦": {
    "en": "Raven",
    "size": "超小型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "dex",
    "hp": "1 (1d4)",
    "speed": "10 ft., 飞行 50 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 13}",
    "languages": "—",
    "cr": "0",
    "traits": [
      [
        "Mimicry",
        "The raven can mimic simple sounds it has heard, such as a person whispering, a baby crying, or an animal chittering. A creature that hears the sounds can tell they are imitations with a successful DC 10 Wisdom (Insight) check."
      ]
    ],
    "actions": [
      {
        "name": "Beak",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 1 piercing damage."
      }
    ]
  },
  "红龙幼龙": {
    "en": "Red Dragon Wyrmling",
    "size": "中型",
    "type": "龙",
    "alignment": "混乱邪恶",
    "ac": 17,
    "ac_note": "natural",
    "hp": "75 (10d8)",
    "speed": "30 ft., 爬 30 ft., 飞行 60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "火"
    ],
    "senses": "{'盲视': '10 ft.', '黑暗视觉': '60 ft.', 'passive_perception': 14}",
    "languages": "龙语",
    "cr": "4",
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "1d10+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 9 (1d10 + 4) piercing damage plus 3 (1d6) fire damage."
      },
      {
        "name": "Fire Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "7d6",
        "type": "火",
        "extra": "The dragon exhales fire in a 15-foot cone. Each creature in that area must make a DC 13 Dexterity saving throw, taking 24 (7d6) fire damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "礁鲨": {
    "en": "Reef Shark",
    "size": "中型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "natural",
    "hp": "22 (4d8)",
    "speed": "游泳 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'盲视': '30 ft.', 'passive_perception': 12}",
    "languages": "—",
    "cr": "1/2",
    "traits": [
      [
        "Pack Tactics",
        "The shark has advantage on an attack roll against a creature if at least one of the shark's allies is within 5 ft. of the creature and the ally isn't incapacitated."
      ],
      [
        "Water Breathing",
        "The shark can breathe only underwater."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d8+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8 + 2) piercing damage."
      }
    ]
  },
  "百足魔兽": {
    "en": "Remorhaz",
    "size": "超大型",
    "type": "怪兽",
    "alignment": "无",
    "ac": 17,
    "ac_note": "natural",
    "hp": "195 (17d12)",
    "speed": "30 ft., 掘地 20 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "冷",
      "火"
    ],
    "senses": "{'黑暗视觉': '60 ft.', '震颤感知': '60 ft.', 'passive_perception': 10}",
    "languages": "—",
    "cr": "11",
    "traits": [
      [
        "Heated Body",
        "A creature that touches the remorhaz or hits it with a melee attack while within 5 feet of it takes 10 (3d6) fire damage."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 11,
        "reach": "10 ft",
        "dmg": "6d10+7",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 40 (6d10 + 7) piercing damage plus 10 (3d6) fire damage. If the target is a creature, it is grappled (escape DC 17). Until this grapple ends, the target is restrained, and the remorhaz can't bite another target."
      },
      {
        "name": "Swallow",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The remorhaz makes one bite attack against a Medium or smaller creature it is grappling. If the attack hits, that creature takes the bite's damage and is swallowed, and the grapple ends. While swallowed, the creature is blinded and restrained, it has total cover against attacks and other effects outside the remorhaz, and it takes 21 (6d6) acid damage at the start of each of the remorhaz's turns.\nIf the remorhaz takes 30 damage or more on a single turn from a creature inside it, the remorhaz must succeed on a DC 15 Constitution saving throw at the end of that turn or regurgitate all swallowed creatures, which fall prone in a space within 10 feet of the remorhaz. If the remorhaz dies, a swallowed creature is no longer restrained by it and can escape from the corpse using 15 feet of movement, exiting prone."
      }
    ]
  },
  "犀牛": {
    "en": "Rhinoceros",
    "size": "大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 11,
    "ac_note": "natural",
    "hp": "45 (6d10)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 11}",
    "languages": "—",
    "cr": "2",
    "traits": [
      [
        "Charge",
        "If the rhinoceros moves at least 20 ft. straight toward a target and then hits it with a gore attack on the same turn, the target takes an extra 9 (2d8) bludgeoning damage. If the target is a creature, it must succeed on a DC 15 Strength saving throw or be knocked prone."
      ]
    ],
    "actions": [
      {
        "name": "Gore",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "2d8+5",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 14 (2d8 + 5) bludgeoning damage."
      }
    ]
  },
  "乘用马": {
    "en": "Riding Horse",
    "size": "大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 10,
    "ac_note": "dex",
    "hp": "13 (2d10)",
    "speed": "60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 10}",
    "languages": "—",
    "cr": "1/4",
    "traits": [],
    "actions": [
      {
        "name": "Hooves",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "2d4+3",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (2d4 + 3) bludgeoning damage."
      }
    ]
  },
  "鹏鸟": {
    "en": "Roc",
    "size": "巨型",
    "type": "怪兽",
    "alignment": "无",
    "ac": 15,
    "ac_note": "natural",
    "hp": "248 (16d20)",
    "speed": "20 ft., 飞行 120 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 14}",
    "languages": "—",
    "cr": "11",
    "traits": [
      [
        "Keen Sight",
        "The roc has advantage on Wisdom (Perception) checks that rely on sight."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The roc makes two attacks: one with its beak and one with its talons."
      },
      {
        "name": "Beak",
        "atk": 13,
        "reach": "10 ft",
        "dmg": "4d8+9",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +13 to hit, reach 10 ft., one target. Hit: 27 (4d8 + 9) piercing damage."
      },
      {
        "name": "Talons",
        "atk": 13,
        "reach": "5 ft",
        "dmg": "4d6+9",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +13 to hit, reach 5 ft., one target. Hit: 23 (4d6 + 9) slashing damage, and the target is grappled (escape DC 19). Until this grapple ends, the target is restrained, and the roc can't use its talons on another target."
      }
    ]
  },
  "罗珀": {
    "en": "Roper",
    "size": "大型",
    "type": "怪兽",
    "alignment": "中立邪恶",
    "ac": 20,
    "ac_note": "natural",
    "hp": "93 (11d10)",
    "speed": "10 ft., 爬 10 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 16}",
    "languages": "—",
    "cr": "5",
    "traits": [
      [
        "False Appearance",
        "While the roper remains motionless, it is indistinguishable from a normal cave formation, such as a stalagmite."
      ],
      [
        "Grasping Tendrils",
        "The roper can have up to six tendrils at a time. Each tendril can be attacked (AC 20; 10 hit points; immunity to poison and psychic damage). Destroying a tendril deals no damage to the roper, which can extrude a replacement tendril on its next turn. A tendril can also be broken if a creature takes an action and succeeds on a DC 15 Strength check against it."
      ],
      [
        "Spider Climb",
        "The roper can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The roper makes four attacks with its tendrils, uses Reel, and makes one attack with its bite."
      },
      {
        "name": "Bite",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "4d8+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 22 (4d8 + 4) piercing damage."
      },
      {
        "name": "Tendril",
        "atk": 7,
        "reach": "50 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Weapon Attack: +7 to hit, reach 50 ft., one creature. Hit: The target is grappled (escape DC 15). Until the grapple ends, the target is restrained and has disadvantage on Strength checks and Strength saving throws, and the roper can't use the same tendril on another target."
      },
      {
        "name": "Reel",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The roper pulls each creature grappled by it up to 25 ft. straight toward it."
      }
    ]
  },
  "窒息地毯": {
    "en": "Rug of Smothering",
    "size": "大型",
    "type": "构装",
    "alignment": "无",
    "ac": 12,
    "ac_note": "dex",
    "hp": "33 (6d10)",
    "speed": "10 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "毒",
      "心灵"
    ],
    "cond_immune": [
      "目盲",
      "魅惑",
      "目盲",
      "惊惧",
      "麻痹",
      "石化",
      "中毒"
    ],
    "senses": "{'盲视': '60 ft. (blind beyond this radius)', 'passive_perception': 6}",
    "languages": "—",
    "cr": "2",
    "traits": [
      [
        "Antimagic Susceptibility",
        "The rug is incapacitated while in the area of an antimagic field. If targeted by dispel magic, the rug must succeed on a Constitution saving throw against the caster's spell save DC or fall unconscious for 1 minute."
      ],
      [
        "Damage Transfer",
        "While it is grappling a creature, the rug takes only half the damage dealt to it, and the creature grappled by the rug takes the other half."
      ],
      [
        "False Appearance",
        "While the rug remains motionless, it is indistinguishable from a normal rug."
      ]
    ],
    "actions": [
      {
        "name": "Smother",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one Medium or smaller creature. Hit: The creature is grappled (escape DC 13). Until this grapple ends, the target is restrained, blinded, and at risk of suffocating, and the rug can't smother another target. In addition, at the start of each of the target's turns, the target takes 10 (2d6 + 3) bludgeoning damage."
      }
    ]
  },
  "锈虫": {
    "en": "Rust Monster",
    "size": "中型",
    "type": "怪兽",
    "alignment": "无",
    "ac": 14,
    "ac_note": "natural",
    "hp": "27 (5d8)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 11}",
    "languages": "—",
    "cr": "1/2",
    "traits": [
      [
        "Iron Scent",
        "The rust monster can pinpoint, by scent, the location of ferrous metal within 30 feet of it."
      ],
      [
        "Rust Metal",
        "Any nonmagical weapon made of metal that hits the rust monster corrodes. After dealing damage, the weapon takes a permanent and cumulative -1 penalty to damage rolls. If its penalty drops to -5, the weapon is destroyed. Nonmagical ammunition made of metal that hits the rust monster is destroyed after dealing damage."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "1d8+1",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 5 (1d8 + 1) piercing damage."
      },
      {
        "name": "Antennae",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The rust monster corrodes a nonmagical ferrous metal object it can see within 5 feet of it. If the object isn't being worn or carried, the touch destroys a 1-foot cube of it. If the object is being worn or carried by a creature, the creature can make a DC 11 Dexterity saving throw to avoid the rust monster's touch.\nIf the object touched is either metal armor or a metal shield being worn or carried, its takes a permanent and cumulative -1 penalty to the AC it offers. Armor reduced to an AC of 10 or a shield that drops to a +0 bonus is destroyed. If the object touched is a held metal weapon, it rusts as described in the Rust Metal trait."
      }
    ]
  },
  "剑齿虎": {
    "en": "Saber-Toothed Tiger",
    "size": "大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "dex",
    "hp": "52 (7d10)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 13}",
    "languages": "—",
    "cr": "2",
    "traits": [
      [
        "Keen Smell",
        "The tiger has advantage on Wisdom (Perception) checks that rely on smell."
      ],
      [
        "Pounce",
        "If the tiger moves at least 20 ft. straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 14 Strength saving throw or be knocked prone. If the target is prone, the tiger can make one bite attack against it as a bonus action."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "1d10+5",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 10 (1d10 + 5) piercing damage."
      },
      {
        "name": "Claw",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d6+5",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 5) slashing damage."
      }
    ]
  },
  "鲨华鱼人": {
    "en": "Sahuagin",
    "size": "中型",
    "type": "类人妖",
    "alignment": "守序邪恶",
    "ac": 12,
    "ac_note": "natural",
    "hp": "22 (4d8)",
    "speed": "30 ft., 游泳 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 15}",
    "languages": "Sahuagin",
    "cr": "1/2",
    "traits": [
      [
        "Blood Frenzy",
        "The sahuagin has advantage on melee attack rolls against any creature that doesn't have all its hit points."
      ],
      [
        "Limited Amphibiousness",
        "The sahuagin can breathe air and water, but it needs to be submerged at least once every 4 hours to avoid suffocating."
      ],
      [
        "Shark Telepathy",
        "The sahuagin can magically command any shark within 120 feet of it, using a limited telepathy."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The sahuagin makes two melee attacks: one with its bite and one with its claws or spear."
      },
      {
        "name": "Bite",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "1d4+1",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3 (1d4 + 1) piercing damage."
      },
      {
        "name": "Claws",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "1d4+1",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3 (1d4 + 1) slashing damage."
      },
      {
        "name": "Spear",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee or Ranged Weapon Attack: +3 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 4 (1d6 + 1) piercing damage, or 5 (1d8 + 1) piercing damage if used with two hands to make a melee attack."
      }
    ]
  },
  "火蜥蜴们": {
    "en": "Salamander",
    "size": "大型",
    "type": "元素",
    "alignment": "中立邪恶",
    "ac": 15,
    "ac_note": "natural",
    "hp": "90 (12d10)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "火"
    ],
    "vuln": [
      "冷"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "火族语",
    "cr": "5",
    "traits": [
      [
        "Heated Body",
        "A creature that touches the salamander or hits it with a melee attack while within 5 ft. of it takes 7 (2d6) fire damage."
      ],
      [
        "Heated Weapons",
        "Any metal melee weapon the salamander wields deals an extra 3 (1d6) fire damage on a hit (included in the attack)."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The salamander makes two attacks: one with its spear and one with its tail."
      },
      {
        "name": "Spear",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee or Ranged Weapon Attack: +7 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 11 (2d6 + 4) piercing damage, or 13 (2d8 + 4) piercing damage if used with two hands to make a melee attack, plus 3 (1d6) fire damage."
      },
      {
        "name": "Tail",
        "atk": 7,
        "reach": "10 ft",
        "dmg": "2d6+4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 11 (2d6 + 4) bludgeoning damage plus 7 (2d6) fire damage, and the target is grappled (escape DC 14). Until this grapple ends, the target is restrained, the salamander can automatically hit the target with its tail, and the salamander can't make tail attacks against other targets."
      }
    ]
  },
  "半羊人们": {
    "en": "Satyr",
    "size": "中型",
    "type": "精类",
    "alignment": "混乱中立",
    "ac": 14,
    "ac_note": "Leather Armor",
    "hp": "31 (7d8)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 12}",
    "languages": "通用语, 精灵语, 精类语",
    "cr": "1/2",
    "traits": [
      [
        "Magic Resistance",
        "The satyr has advantage on saving throws against spells and other magical effects."
      ]
    ],
    "actions": [
      {
        "name": "Ram",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "2d4+1",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 6 (2d4 + 1) bludgeoning damage."
      },
      {
        "name": "Shortsword",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d6+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) piercing damage."
      },
      {
        "name": "Shortbow",
        "atk": 5,
        "reach": "80/320 ft",
        "dmg": "1d6+3",
        "type": "穿刺",
        "extra": "Ranged Weapon Attack: +5 to hit, range 80/320 ft., one target. Hit: 6 (1d6 + 3) piercing damage."
      }
    ]
  },
  "蝎": {
    "en": "Scorpion",
    "size": "超小型",
    "type": "野兽",
    "alignment": "无",
    "ac": 11,
    "ac_note": "natural",
    "hp": "1 (1d4)",
    "speed": "10 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'盲视': '10 ft.', 'passive_perception': 9}",
    "languages": "—",
    "cr": "0",
    "traits": [],
    "actions": [
      {
        "name": "Sting",
        "atk": 2,
        "reach": "5 ft",
        "dmg": "1",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +2 to hit, reach 5 ft., one creature. Hit: 1 piercing damage, and the target must make a DC 9 Constitution saving throw, taking 4 (1d8) poison damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "斥候": {
    "en": "Scout",
    "size": "中型",
    "type": "类人妖",
    "alignment": "任意",
    "ac": 13,
    "ac_note": "Leather Armor",
    "hp": "16 (3d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 15}",
    "languages": "any one language (usually Common)",
    "cr": "1/2",
    "traits": [
      [
        "Keen Hearing and Sight",
        "The scout has advantage on Wisdom (Perception) checks that rely on hearing or sight."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The scout makes two melee attacks or two ranged attacks."
      },
      {
        "name": "Shortsword",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d6+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage."
      },
      {
        "name": "Longbow",
        "atk": 4,
        "reach": "150/600 ft",
        "dmg": "1d8+2",
        "type": "穿刺",
        "extra": "Ranged Weapon Attack: +4 to hit, range 150/600 ft., one target. Hit: 6 (1d8 + 2) piercing damage."
      }
    ]
  },
  "海鬼婆": {
    "en": "Sea Hag",
    "size": "中型",
    "type": "精类",
    "alignment": "混乱邪恶",
    "ac": 14,
    "ac_note": "natural",
    "hp": "52 (7d8)",
    "speed": "30 ft., 游泳 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 11}",
    "languages": "水族语, 通用语, 巨语",
    "cr": "2",
    "traits": [
      [
        "Amphibious",
        "The hag can breathe air and water."
      ],
      [
        "Horrific Appearance",
        "Any humanoid that starts its turn within 30 feet of the hag and can see the hag's true form must make a DC 11 Wisdom saving throw. On a failed save, the creature is frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, with disadvantage if the hag is within line of sight, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the hag's Horrific Appearance for the next 24 hours.\nUnless the target is surprised or the revelation of the hag's true form is sudden, the target can avert its eyes and avoid making the initial saving throw. Until the start of its next turn, a creature that averts its eyes has disadvantage on attack rolls against the hag."
      ]
    ],
    "actions": [
      {
        "name": "Claws",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "2d6+3",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) slashing damage."
      },
      {
        "name": "Death Glare",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The hag targets one frightened creature she can see within 30 ft. of her. If the target can see the hag, it must succeed on a DC 11 Wisdom saving throw against this magic or drop to 0 hit points."
      },
      {
        "name": "Illusory Appearance",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The hag covers herself and anything she is wearing or carrying with a magical illusion that makes her look like an ugly creature of her general size and humanoid shape. The effect ends if the hag takes a bonus action to end it or if she dies.\nThe changes wrought by this effect fail to hold up to physical inspection. For example, the hag could appear to have no claws, but someone touching her hand might feel the claws. Otherwise, a creature must take an action to visually inspect the illusion and succeed on a DC 16 Intelligence (Investigation) check to discern that the hag is disguised."
      }
    ]
  },
  "海马": {
    "en": "Sea Horse",
    "size": "超小型",
    "type": "野兽",
    "alignment": "无",
    "ac": 11,
    "ac_note": "dex",
    "hp": "1 (1d4)",
    "speed": "游泳 20 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 10}",
    "languages": "—",
    "cr": "0",
    "traits": [
      [
        "Water Breathing",
        "The sea horse can breathe only underwater."
      ]
    ],
    "actions": []
  },
  "幽影": {
    "en": "Shadow",
    "size": "中型",
    "type": "不死",
    "alignment": "混乱邪恶",
    "ac": 12,
    "ac_note": "dex",
    "hp": "16 (3d8)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "酸",
      "冷",
      "火",
      "电",
      "雷",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "坏死",
      "毒"
    ],
    "vuln": [
      "光耀"
    ],
    "cond_immune": [
      "力竭",
      "惊惧",
      "擒抱",
      "麻痹",
      "石化",
      "中毒",
      "倒地",
      "束缚"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "—",
    "cr": "1/2",
    "traits": [
      [
        "Amorphous",
        "The shadow can move through a space as narrow as 1 inch wide without squeezing."
      ],
      [
        "Shadow Stealth",
        "While in dim light or darkness, the shadow can take the Hide action as a bonus action. Its stealth bonus is also improved to +6."
      ],
      [
        "Sunlight Weakness",
        "While in sunlight, the shadow has disadvantage on attack rolls, ability checks, and saving throws."
      ]
    ],
    "actions": [
      {
        "name": "Strength Drain",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "2d6+2",
        "type": "坏死",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 9 (2d6 + 2) necrotic damage, and the target's Strength score is reduced by 1d4. The target dies if this reduces its Strength to 0. Otherwise, the reduction lasts until the target finishes a short or long rest.\nIf a non-evil humanoid dies from this attack, a new shadow rises from the corpse 1d4 hours later."
      }
    ]
  },
  "蔓生怪": {
    "en": "Shambling Mound",
    "size": "大型",
    "type": "植物",
    "alignment": "无",
    "ac": 15,
    "ac_note": "natural",
    "hp": "136 (16d10)",
    "speed": "20 ft., 游泳 20 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "冷",
      "火"
    ],
    "immune": [
      "电"
    ],
    "cond_immune": [
      "目盲",
      "目盲",
      "力竭"
    ],
    "senses": "{'盲视': '60 ft. (blind beyond this radius)', 'passive_perception': 10}",
    "languages": "—",
    "cr": "5",
    "traits": [
      [
        "Lightning Absorption",
        "Whenever the shambling mound is subjected to lightning damage, it takes no damage and regains a number of hit points equal to the lightning damage dealt."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The shambling mound makes two slam attacks. If both attacks hit a Medium or smaller target, the target is grappled (escape DC 14), and the shambling mound uses its Engulf on it."
      },
      {
        "name": "Slam",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "2d8+4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) bludgeoning damage."
      },
      {
        "name": "Engulf",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The shambling mound engulfs a Medium or smaller creature grappled by it. The engulfed target is blinded, restrained, and unable to breathe, and it must succeed on a DC 14 Constitution saving throw at the start of each of the mound's turns or take 13 (2d8 + 4) bludgeoning damage. If the mound moves, the engulfed target moves with it. The mound can have only one creature engulfed at a time."
      }
    ]
  },
  "护盾守卫": {
    "en": "Shield Guardian",
    "size": "大型",
    "type": "构装",
    "alignment": "无",
    "ac": 17,
    "ac_note": "natural",
    "hp": "142 (15d10)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "毒"
    ],
    "cond_immune": [
      "魅惑",
      "力竭",
      "惊惧",
      "麻痹",
      "中毒"
    ],
    "senses": "{'盲视': '10 ft.', '黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "understands commands given in any language but can't speak",
    "cr": "7",
    "traits": [
      [
        "Bound",
        "The shield guardian is magically bound to an amulet. As long as the guardian and its amulet are on the same plane of existence, the amulet's wearer can telepathically call the guardian to travel to it, and the guardian knows the distance and direction to the amulet. If the guardian is within 60 feet of the amulet's wearer, half of any damage the wearer takes (rounded up) is transferred to the guardian."
      ],
      [
        "Regeneration",
        "The shield guardian regains 10 hit points at the start of its turn if it has at least 1 hit. point."
      ],
      [
        "Spell Storing",
        "A spellcaster who wears the shield guardian's amulet can cause the guardian to store one spell of 4th level or lower. To do so, the wearer must cast the spell on the guardian. The spell has no effect but is stored within the guardian. When commanded to do so by the wearer or when a situation arises that was predefined by the spellcaster, the guardian casts the stored spell with any parameters set by the original caster, requiring no components. When the spell is cast or a new spell is stored, any previously stored spell is lost."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The guardian makes two fist attacks."
      },
      {
        "name": "Fist",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "2d6+4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) bludgeoning damage."
      }
    ],
    "reactions": [
      {
        "name": "Shield",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "When a creature makes an attack against the wearer of the guardian's amulet, the guardian grants a +2 bonus to the wearer's AC if the guardian is within 5 feet of the wearer."
      }
    ]
  },
  "尖叫蕈": {
    "en": "Shrieker",
    "size": "中型",
    "type": "植物",
    "alignment": "无",
    "ac": 5,
    "ac_note": "dex",
    "hp": "13 (3d8)",
    "speed": "0 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "cond_immune": [
      "目盲",
      "目盲",
      "惊惧"
    ],
    "senses": "{'盲视': '30 ft. (blind beyond this radius)', 'passive_perception': 6}",
    "languages": "—",
    "cr": "0",
    "traits": [
      [
        "False Appearance",
        "While the shrieker remains motionless, it is indistinguishable from an ordinary fungus."
      ]
    ],
    "actions": [],
    "reactions": [
      {
        "name": "Shriek",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "When bright light or a creature is within 30 feet of the shrieker, it emits a shriek audible within 300 feet of it. The shrieker continues to shriek until the disturbance moves out of range and for 1d4 of the shrieker's turns afterward"
      }
    ]
  },
  "银龙幼龙": {
    "en": "Silver Dragon Wyrmling",
    "size": "中型",
    "type": "龙",
    "alignment": "守序善良",
    "ac": 17,
    "ac_note": "natural",
    "hp": "45 (6d8)",
    "speed": "30 ft., 飞行 60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "冷"
    ],
    "senses": "{'盲视': '10 ft.', '黑暗视觉': '60 ft.', 'passive_perception': 14}",
    "languages": "龙语",
    "cr": "2",
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "1d10+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 9 (1d10 + 4) piercing damage."
      },
      {
        "name": "Breath Weapons",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon uses one of the following breath weapons.\nCold Breath. The dragon exhales an icy blast in a 15-foot cone. Each creature in that area must make a DC 13 Constitution saving throw, taking 18 (4d8) cold damage on a failed save, or half as much damage on a successful one.\nParalyzing Breath. The dragon exhales paralyzing gas in a 15-foot cone. Each creature in that area must succeed on a DC 13 Constitution saving throw or be paralyzed for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ]
  },
  "骷髅": {
    "en": "Skeleton",
    "size": "中型",
    "type": "不死",
    "alignment": "守序邪恶",
    "ac": 13,
    "ac_note": "armor",
    "hp": "13 (2d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "毒"
    ],
    "vuln": [
      "钝击"
    ],
    "cond_immune": [
      "中毒",
      "力竭"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 9}",
    "languages": "understands all languages it spoke in life but can't speak",
    "cr": "1/4",
    "traits": [],
    "actions": [
      {
        "name": "Shortsword",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d6+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage."
      },
      {
        "name": "Shortbow",
        "atk": 4,
        "reach": "80/320 ft",
        "dmg": "1d6+2",
        "type": "穿刺",
        "extra": "Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target. Hit: 5 (1d6 + 2) piercing damage."
      }
    ]
  },
  "炽天神侍": {
    "en": "Solar",
    "size": "大型",
    "type": "天界",
    "alignment": "守序善良",
    "ac": 21,
    "ac_note": "natural",
    "hp": "243 (18d10)",
    "speed": "50 ft., 飞行 150 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "光耀",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "坏死",
      "毒"
    ],
    "cond_immune": [
      "魅惑",
      "力竭",
      "惊惧",
      "中毒"
    ],
    "senses": "{'真实视觉': '120 ft.', 'passive_perception': 24}",
    "languages": "all, telepathy 120 ft.",
    "cr": "21",
    "traits": [
      [
        "Angelic Weapons",
        "The solar's weapon attacks are magical. When the solar hits with any weapon, the weapon deals an extra 6d8 radiant damage (included in the attack)."
      ],
      [
        "Divine Awareness",
        "The solar knows if it hears a lie."
      ],
      [
        "Innate Spellcasting",
        "The solar's spell casting ability is Charisma (spell save DC 25). It can innately cast the following spells, requiring no material components:\nAt will: detect evil and good, invisibility (self only)\n3/day each: blade barrier, dispel evil and good, resurrection\n1/day each: commune, control weather"
      ],
      [
        "Magic Resistance",
        "The solar has advantage on saving throws against spells and other magical effects."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The solar makes two greatsword attacks."
      },
      {
        "name": "Greatsword",
        "atk": 15,
        "reach": "5 ft",
        "dmg": "4d6+8",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +15 to hit, reach 5 ft., one target. Hit: 22 (4d6 + 8) slashing damage plus 27 (6d8) radiant damage."
      },
      {
        "name": "Slaying Longbow",
        "atk": 13,
        "reach": "150/600 ft",
        "dmg": "2d8+6",
        "type": "穿刺",
        "extra": "Ranged Weapon Attack: +13 to hit, range 150/600 ft., one target. Hit: 15 (2d8 + 6) piercing damage plus 27 (6d8) radiant damage. If the target is a creature that has 190 hit points or fewer, it must succeed on a DC 15 Constitution saving throw or die."
      },
      {
        "name": "Flying Sword",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The solar releases its greatsword to hover magically in an unoccupied space within 5 ft. of it. If the solar can see the sword, the solar can mentally command it as a bonus action to fly up to 50 ft. and either make one attack against a target or return to the solar's hands. If the hovering sword is targeted by any effect, the solar is considered to be holding it. The hovering sword falls if the solar dies."
      },
      {
        "name": "Healing Touch",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The solar touches another creature. The target magically regains 40 (8d8 + 4) hit points and is freed from any curse, disease, poison, blindness, or deafness."
      }
    ],
    "legendary": [
      {
        "name": "Teleport",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The solar magically teleports, along with any equipment it is wearing or carrying, up to 120 ft. to an unoccupied space it can see."
      },
      {
        "name": "Searing Burst (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "4d6",
        "type": "火",
        "extra": "The solar emits magical, divine energy. Each creature of its choice in a 10-foot radius must make a DC 23 Dexterity saving throw, taking 14 (4d6) fire damage plus 14 (4d6) radiant damage on a failed save, or half as much damage on a successful one."
      },
      {
        "name": "Blinding Gaze (Costs 3 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The solar targets one creature it can see within 30 ft. of it. If the target can see it, the target must succeed on a DC 15 Constitution saving throw or be blinded until magic such as the lesser restoration spell removes the blindness."
      }
    ]
  },
  "恶灵": {
    "en": "Specter",
    "size": "中型",
    "type": "不死",
    "alignment": "混乱邪恶",
    "ac": 12,
    "ac_note": "dex",
    "hp": "22 (5d8)",
    "speed": "0 ft., 飞行 50 ft., 悬浮 True",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "酸",
      "冷",
      "火",
      "电",
      "雷",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "坏死",
      "毒"
    ],
    "cond_immune": [
      "魅惑",
      "力竭",
      "擒抱",
      "麻痹",
      "石化",
      "中毒",
      "倒地",
      "束缚",
      "昏迷"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "understands all languages it knew in life but can't speak",
    "cr": "1",
    "traits": [
      [
        "Incorporeal Movement",
        "The specter can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object."
      ],
      [
        "Sunlight Sensitivity",
        "While in sunlight, the specter has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight."
      ]
    ],
    "actions": [
      {
        "name": "Life Drain",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "3d6",
        "type": "坏死",
        "extra": "Melee Spell Attack: +4 to hit, reach 5 ft., one creature. Hit: 10 (3d6) necrotic damage. The target must succeed on a DC 10 Constitution saving throw or its hit point maximum is reduced by an amount equal to the damage taken. This reduction lasts until the creature finishes a long rest. The target dies if this effect reduces its hit point maximum to 0."
      }
    ]
  },
  "蛛": {
    "en": "Spider",
    "size": "超小型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "dex",
    "hp": "1 (1d4)",
    "speed": "20 ft., 爬 20 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '30 ft.', 'passive_perception': 12}",
    "languages": "—",
    "cr": "0",
    "traits": [
      [
        "Spider Climb",
        "The spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."
      ],
      [
        "Web Sense",
        "While in contact with a web, the spider knows the exact location of any other creature in contact with the same web."
      ],
      [
        "Web Walker",
        "The spider ignores movement restrictions caused by webbing."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 1 piercing damage, and the target must succeed on a DC 9 Constitution saving throw or take 2 (1d4) poison damage."
      }
    ]
  },
  "精魂纳迦": {
    "en": "Spirit Naga",
    "size": "大型",
    "type": "怪兽",
    "alignment": "混乱邪恶",
    "ac": 15,
    "ac_note": "natural",
    "hp": "75 (10d10)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "毒"
    ],
    "cond_immune": [
      "魅惑",
      "中毒"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 12}",
    "languages": "深渊语, 通用语",
    "cr": "8",
    "traits": [
      [
        "Rejuvenation",
        "If it dies, the naga returns to life in 1d6 days and regains all its hit points. Only a wish spell can prevent this trait from functioning."
      ],
      [
        "Spellcasting",
        "The naga is a 10th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 14, +6 to hit with spell attacks), and it needs only verbal components to cast its spells. It has the following wizard spells prepared:\n\n- Cantrips (at will): mage hand, minor illusion, ray of frost\n- 1st level (4 slots): charm person, detect magic, sleep\n- 2nd level (3 slots): detect thoughts, hold person\n- 3rd level (3 slots): lightning bolt, water breathing\n- 4th level (3 slots): blight, dimension door\n- 5th level (2 slots): dominate person"
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 7,
        "reach": "10 ft",
        "dmg": "1d6+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +7 to hit, reach 10 ft., one creature. Hit: 7 (1d6 + 4) piercing damage, and the target must make a DC 13 Constitution saving throw, taking 31 (7d8) poison damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "小仙灵": {
    "en": "Sprite",
    "size": "超小型",
    "type": "精类",
    "alignment": "中立善良",
    "ac": 15,
    "ac_note": "Leather Armor",
    "hp": "2 (1d4)",
    "speed": "10 ft., 飞行 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 13}",
    "languages": "通用语, 精灵语, 精类语",
    "cr": "1/4",
    "traits": [],
    "actions": [
      {
        "name": "Longsword",
        "atk": 2,
        "reach": "5 ft",
        "dmg": "1",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 1 slashing damage."
      },
      {
        "name": "Shortbow",
        "atk": 6,
        "reach": "40/160 ft",
        "dmg": "1",
        "type": "穿刺",
        "extra": "Ranged Weapon Attack: +6 to hit, range 40/160 ft., one target. Hit: 1 piercing damage, and the target must succeed on a DC 10 Constitution saving throw or become poisoned for 1 minute. If its saving throw result is 5 or lower, the poisoned target falls unconscious for the same duration, or until it takes damage or another creature takes an action to shake it awake."
      },
      {
        "name": "Heart Sight",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The sprite touches a creature and magically knows the creature's current emotional state. If the target fails a DC 10 Charisma saving throw, the sprite also knows the creature's alignment. Celestials, fiends, and undead automatically fail the saving throw."
      },
      {
        "name": "Invisibility",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The sprite magically turns invisible until it attacks or casts a spell, or until its concentration ends (as if concentrating on a spell). Any equipment the sprite wears or carries is invisible with it."
      }
    ]
  },
  "间谍": {
    "en": "Spy",
    "size": "中型",
    "type": "类人妖",
    "alignment": "任意",
    "ac": 12,
    "ac_note": "dex",
    "hp": "27 (6d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 16}",
    "languages": "any two languages",
    "cr": "1",
    "traits": [
      [
        "Cunning Action",
        "On each of its turns, the spy can use a bonus action to take the Dash, Disengage, or Hide action."
      ],
      [
        "Sneak Attack (1/Turn)",
        "The spy deals an extra 7 (2d6) damage when it hits a target with a weapon attack and has advantage on the attack roll, or when the target is within 5 ft. of an ally of the spy that isn't incapacitated and the spy doesn't have disadvantage on the attack roll."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The spy makes two melee attacks."
      },
      {
        "name": "Shortsword",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d6+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage."
      },
      {
        "name": "Hand Crossbow",
        "atk": 4,
        "reach": "30/120 ft",
        "dmg": "1d6+2",
        "type": "穿刺",
        "extra": "Ranged Weapon Attack: +4 to hit, range 30/120 ft., one target. Hit: 5 (1d6 + 2) piercing damage."
      }
    ]
  },
  "蒸汽魔蝠": {
    "en": "Steam Mephit",
    "size": "小型",
    "type": "元素",
    "alignment": "中立邪恶",
    "ac": 10,
    "ac_note": "dex",
    "hp": "21 (6d6)",
    "speed": "30 ft., 飞行 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "火",
      "毒"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "水族语, 火族语",
    "cr": "1/4",
    "traits": [
      [
        "Death Burst",
        "When the mephit dies, it explodes in a cloud of steam. Each creature within 5 ft. of the mephit must succeed on a DC 10 Dexterity saving throw or take 4 (1d8) fire damage."
      ],
      [
        "Innate Spellcasting",
        "The mephit can innately cast blur, requiring no material components. Its innate spellcasting ability is Charisma."
      ]
    ],
    "actions": [
      {
        "name": "Claws",
        "atk": 2,
        "reach": "5 ft",
        "dmg": "1d4",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +2 to hit, reach 5 ft., one creature. Hit: 2 (1d4) slashing damage plus 2 (1d4) fire damage."
      },
      {
        "name": "Steam Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "1d8",
        "type": "火",
        "extra": "The mephit exhales a 15-foot cone of scalding steam. Each creature in that area must succeed on a DC 10 Dexterity saving throw, taking 4 (1d8) fire damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "蚊蝠们": {
    "en": "Stirge",
    "size": "超小型",
    "type": "野兽",
    "alignment": "无",
    "ac": 14,
    "ac_note": "natural",
    "hp": "2 (1d4)",
    "speed": "10 ft., 飞行 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 9}",
    "languages": "—",
    "cr": "1/8",
    "traits": [],
    "actions": [
      {
        "name": "Blood Drain",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d4+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one creature. Hit: 5 (1d4 + 3) piercing damage, and the stirge attaches to the target. While attached, the stirge doesn't attack. Instead, at the start of each of the stirge's turns, the target loses 5 (1d4 + 3) hit points due to blood loss.\nThe stirge can detach itself by spending 5 feet of its movement. It does so after it drains 10 hit points of blood from the target or the target dies. A creature, including the target, can use its action to detach the stirge."
      }
    ]
  },
  "石巨人": {
    "en": "Stone Giant",
    "size": "超大型",
    "type": "巨人",
    "alignment": "中立",
    "ac": 17,
    "ac_note": "natural",
    "hp": "126 (11d12)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 14}",
    "languages": "巨语",
    "cr": "7",
    "traits": [
      [
        "Stone Camouflage",
        "The giant has advantage on Dexterity (Stealth) checks made to hide in rocky terrain."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The giant makes two greatclub attacks."
      },
      {
        "name": "Greatclub",
        "atk": 9,
        "reach": "15 ft",
        "dmg": "3d8+6",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +9 to hit, reach 15 ft., one target. Hit: 19 (3d8 + 6) bludgeoning damage."
      },
      {
        "name": "Rock",
        "atk": 9,
        "reach": "60/240 ft",
        "dmg": "4d10+6",
        "type": "钝击",
        "extra": "Ranged Weapon Attack: +9 to hit, range 60/240 ft., one target. Hit: 28 (4d10 + 6) bludgeoning damage. If the target is a creature, it must succeed on a DC 17 Strength saving throw or be knocked prone."
      }
    ],
    "reactions": [
      {
        "name": "Rock Catching",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "If a rock or similar object is hurled at the giant, the giant can, with a successful DC 10 Dexterity saving throw, catch the missile and take no bludgeoning damage from it."
      }
    ]
  },
  "石魔像": {
    "en": "Stone Golem",
    "size": "大型",
    "type": "构装",
    "alignment": "无",
    "ac": 17,
    "ac_note": "natural",
    "hp": "178 (17d10)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "毒",
      "心灵",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "cond_immune": [
      "魅惑",
      "力竭",
      "惊惧",
      "麻痹",
      "石化",
      "中毒"
    ],
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 10}",
    "languages": "understands the languages of its creator but can't speak",
    "cr": "10",
    "traits": [
      [
        "Immutable Form",
        "The golem is immune to any spell or effect that would alter its form."
      ],
      [
        "Magic Resistance",
        "The golem has advantage on saving throws against spells and other magical effects."
      ],
      [
        "Magic Weapons",
        "The golem's weapon attacks are magical."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The golem makes two slam attacks."
      },
      {
        "name": "Slam",
        "atk": 10,
        "reach": "5 ft",
        "dmg": "3d8+6",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 19 (3d8 + 6) bludgeoning damage."
      },
      {
        "name": "Slow",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The golem targets one or more creatures it can see within 10 ft. of it. Each target must make a DC 17 Wisdom saving throw against this magic. On a failed save, a target can't use reactions, its speed is halved, and it can't make more than one attack on its turn. In addition, the target can take either an action or a bonus action on its turn, not both. These effects last for 1 minute. A target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ]
  },
  "风暴巨人": {
    "en": "Storm Giant",
    "size": "超大型",
    "type": "巨人",
    "alignment": "混乱善良",
    "ac": 16,
    "ac_note": "Scale Mail",
    "hp": "230 (20d12)",
    "speed": "50 ft., 游泳 50 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "冷"
    ],
    "immune": [
      "电",
      "雷"
    ],
    "senses": "{'passive_perception': 19}",
    "languages": "通用语, 巨语",
    "cr": "13",
    "traits": [
      [
        "Amphibious",
        "The giant can breathe air and water."
      ],
      [
        "Innate Spellcasting",
        "The giant's innate spellcasting ability is Charisma (spell save DC 17). It can innately cast the following spells, requiring no material components:\n\nAt will: detect magic, feather fall, levitate, light\n3/day each: control weather, water breathing"
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The giant makes two greatsword attacks."
      },
      {
        "name": "Greatsword",
        "atk": 14,
        "reach": "10 ft",
        "dmg": "6d6+9",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 30 (6d6 + 9) slashing damage."
      },
      {
        "name": "Rock",
        "atk": 14,
        "reach": "60/240 ft",
        "dmg": "4d12+9",
        "type": "钝击",
        "extra": "Ranged Weapon Attack: +14 to hit, range 60/240 ft., one target. Hit: 35 (4d12 + 9) bludgeoning damage."
      },
      {
        "name": "Lightning Strike",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "12d8",
        "type": "电",
        "extra": "The giant hurls a magical lightning bolt at a point it can see within 500 feet of it. Each creature within 10 feet of that point must make a DC 17 Dexterity saving throw, taking 54 (12d8) lightning damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "魅魔": {
    "en": "Succubus/Incubus",
    "size": "中型",
    "type": "邪魔",
    "alignment": "中立邪恶",
    "ac": 15,
    "ac_note": "natural",
    "hp": "66 (12d8)",
    "speed": "30 ft., 飞行 60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "冷",
      "火",
      "电",
      "毒",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 15}",
    "languages": "深渊语, 通用语, 炼狱语, telepathy 60 ft.",
    "cr": "4",
    "traits": [
      [
        "Telepathic Bond",
        "The fiend ignores the range restriction on its telepathy when communicating with a creature it has charmed. The two don't even need to be on the same plane of existence."
      ],
      [
        "Shapechanger",
        "The fiend can use its action to polymorph into a Small or Medium humanoid, or back into its true form. Without wings, the fiend loses its flying speed. Other than its size and speed, its statistics are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies."
      ]
    ],
    "actions": [
      {
        "name": "Claw (Fiend Form Only)",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d6+3",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) slashing damage."
      },
      {
        "name": "Charm",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "One humanoid the fiend can see within 30 feet of it must succeed on a DC 15 Wisdom saving throw or be magically charmed for 1 day. The charmed target obeys the fiend's verbal or telepathic commands. If the target suffers any harm or receives a suicidal command, it can repeat the saving throw, ending the effect on a success. If the target successfully saves against the effect, or if the effect on it ends, the target is immune to this fiend's Charm for the next 24 hours.\nThe fiend can have only one target charmed at a time. If it charms another, the effect on the previous target ends."
      },
      {
        "name": "Draining Kiss",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "5d10+5",
        "type": "心灵",
        "extra": "The fiend kisses a creature charmed by it or a willing creature. The target must make a DC 15 Constitution saving throw against this magic, taking 32 (5d10 + 5) psychic damage on a failed save, or half as much damage on a successful one. The target's hit point maximum is reduced by an amount equal to the damage taken. This reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0."
      },
      {
        "name": "Etherealness",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The fiend magically enters the Ethereal Plane from the Material Plane, or vice versa."
      }
    ]
  },
  "蝙蝠群": {
    "en": "Swarm of Bats",
    "size": "中型",
    "type": "swarm of Tiny beasts",
    "alignment": "无",
    "ac": 12,
    "ac_note": "dex",
    "hp": "22 (5d8)",
    "speed": "0 ft., 飞行 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "钝击",
      "穿刺",
      "挥砍"
    ],
    "cond_immune": [
      "魅惑",
      "惊惧",
      "擒抱",
      "麻痹",
      "石化",
      "倒地",
      "束缚",
      "震慑"
    ],
    "senses": "{'盲视': '60 ft.', 'passive_perception': 11}",
    "languages": "—",
    "cr": "1/4",
    "traits": [
      [
        "Echolocation",
        "The swarm can't use its blindsight while deafened."
      ],
      [
        "Keen Hearing",
        "The swarm has advantage on Wisdom (Perception) checks that rely on hearing."
      ],
      [
        "Swarm",
        "The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny bat. The swarm can't regain hit points or gain temporary hit points."
      ]
    ],
    "actions": [
      {
        "name": "Bites",
        "atk": 4,
        "reach": "0 ft",
        "dmg": "2d4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 0 ft., one creature in the swarm's space. Hit: 5 (2d4) piercing damage, or 2 (1d4) piercing damage if the swarm has half of its hit points or fewer."
      }
    ]
  },
  "甲虫群": {
    "en": "Swarm of Beetles",
    "size": "中型",
    "type": "swarm of Tiny beasts",
    "alignment": "无",
    "ac": 12,
    "ac_note": "natural",
    "hp": "22 (5d8)",
    "speed": "20 ft., 掘地 5 ft., 爬 20 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "钝击",
      "穿刺",
      "挥砍"
    ],
    "cond_immune": [
      "魅惑",
      "惊惧",
      "擒抱",
      "麻痹",
      "石化",
      "倒地",
      "束缚",
      "震慑"
    ],
    "senses": "{'盲视': '10 ft.', 'passive_perception': 8}",
    "languages": "—",
    "cr": "1/2",
    "traits": [
      [
        "Swarm",
        "The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. The swarm can't regain hit points or gain temporary hit points."
      ]
    ],
    "actions": [
      {
        "name": "Bites",
        "atk": 3,
        "reach": "0 ft",
        "dmg": "4d4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +3 to hit, reach 0 ft., one target in the swarm's space. Hit: 10 (4d4) piercing damage, or 5 (2d4) piercing damage if the swarm has half of its hit points or fewer."
      }
    ]
  },
  "蜈蚣群": {
    "en": "Swarm of Centipedes",
    "size": "中型",
    "type": "swarm of Tiny beasts",
    "alignment": "无",
    "ac": 12,
    "ac_note": "natural",
    "hp": "22 (5d8)",
    "speed": "20 ft., 爬 20 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "钝击",
      "穿刺",
      "挥砍"
    ],
    "cond_immune": [
      "魅惑",
      "惊惧",
      "擒抱",
      "麻痹",
      "石化",
      "倒地",
      "束缚",
      "震慑"
    ],
    "senses": "{'盲视': '10 ft.', 'passive_perception': 8}",
    "languages": "—",
    "cr": "1/2",
    "traits": [
      [
        "Swarm",
        "The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. The swarm can't regain hit points or gain temporary hit points."
      ]
    ],
    "actions": [
      {
        "name": "Bites",
        "atk": 3,
        "reach": "0 ft",
        "dmg": "4d4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +3 to hit, reach 0 ft., one target in the swarm's space. Hit: 10 (4d4) piercing damage, or 5 (2d4) piercing damage if the swarm has half of its hit points or fewer.\nA creature reduced to 0 hit points by a swarm of centipedes is stable but poisoned for 1 hour, even after regaining hit points, and paralyzed while poisoned in this way."
      }
    ]
  },
  "虫群": {
    "en": "Swarm of Insects",
    "size": "中型",
    "type": "swarm of Tiny beasts",
    "alignment": "无",
    "ac": 12,
    "ac_note": "natural",
    "hp": "22 (5d8)",
    "speed": "20 ft., 爬 20 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "钝击",
      "穿刺",
      "挥砍"
    ],
    "cond_immune": [
      "魅惑",
      "惊惧",
      "擒抱",
      "麻痹",
      "石化",
      "倒地",
      "束缚",
      "震慑"
    ],
    "senses": "{'盲视': '10 ft.', 'passive_perception': 8}",
    "languages": "—",
    "cr": "1/2",
    "traits": [
      [
        "Swarm",
        "The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. The swarm can't regain hit points or gain temporary hit points."
      ]
    ],
    "actions": [
      {
        "name": "Bites",
        "atk": 3,
        "reach": "0 ft",
        "dmg": "4d4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +3 to hit, reach 0 ft., one target in the swarm's space. Hit: 10 (4d4) piercing damage, or 5 (2d4) piercing damage if the swarm has half of its hit points or fewer."
      }
    ]
  },
  "毒蛇群": {
    "en": "Swarm of Poisonous Snakes",
    "size": "中型",
    "type": "swarm of Tiny beasts",
    "alignment": "无",
    "ac": 14,
    "ac_note": "dex",
    "hp": "36 (8d8)",
    "speed": "30 ft., 游泳 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "钝击",
      "穿刺",
      "挥砍"
    ],
    "cond_immune": [
      "魅惑",
      "惊惧",
      "擒抱",
      "麻痹",
      "石化",
      "倒地",
      "束缚",
      "震慑"
    ],
    "senses": "{'盲视': '10 ft.', 'passive_perception': 10}",
    "languages": "—",
    "cr": "2",
    "traits": [
      [
        "Swarm",
        "The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny snake. The swarm can't regain hit points or gain temporary hit points."
      ]
    ],
    "actions": [
      {
        "name": "Bites",
        "atk": 6,
        "reach": "0 ft",
        "dmg": "2d6",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +6 to hit, reach 0 ft., one creature in the swarm's space. Hit: 7 (2d6) piercing damage, or 3 (1d6) piercing damage if the swarm has half of its hit points or fewer. The target must make a DC 10 Constitution saving throw, taking 14 (4d6) poison damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "食人鱼群": {
    "en": "Swarm of Quippers",
    "size": "中型",
    "type": "swarm of Tiny beasts",
    "alignment": "无",
    "ac": 13,
    "ac_note": "dex",
    "hp": "28 (8d8)",
    "speed": "0 ft., 游泳 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "钝击",
      "穿刺",
      "挥砍"
    ],
    "cond_immune": [
      "魅惑",
      "惊惧",
      "擒抱",
      "麻痹",
      "石化",
      "倒地",
      "束缚",
      "震慑"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 8}",
    "languages": "—",
    "cr": "1",
    "traits": [
      [
        "Blood Frenzy",
        "The swarm has advantage on melee attack rolls against any creature that doesn't have all its hit points."
      ],
      [
        "Swarm",
        "The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny quipper. The swarm can't regain hit points or gain temporary hit points."
      ],
      [
        "Water Breathing",
        "The swarm can breathe only underwater."
      ]
    ],
    "actions": [
      {
        "name": "Bites",
        "atk": 5,
        "reach": "0 ft",
        "dmg": "4d6",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 0 ft., one creature in the swarm's space. Hit: 14 (4d6) piercing damage, or 7 (2d6) piercing damage if the swarm has half of its hit points or fewer."
      }
    ]
  },
  "鼠群": {
    "en": "Swarm of Rats",
    "size": "中型",
    "type": "swarm of Tiny beasts",
    "alignment": "无",
    "ac": 10,
    "ac_note": "dex",
    "hp": "24 (7d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "钝击",
      "穿刺",
      "挥砍"
    ],
    "cond_immune": [
      "魅惑",
      "惊惧",
      "擒抱",
      "麻痹",
      "石化",
      "倒地",
      "束缚",
      "震慑"
    ],
    "senses": "{'黑暗视觉': '30 ft.', 'passive_perception': 10}",
    "languages": "—",
    "cr": "1/4",
    "traits": [
      [
        "Keen Smell",
        "The swarm has advantage on Wisdom (Perception) checks that rely on smell."
      ],
      [
        "Swarm",
        "The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny rat. The swarm can't regain hit points or gain temporary hit points."
      ]
    ],
    "actions": [
      {
        "name": "Bites",
        "atk": 2,
        "reach": "0 ft",
        "dmg": "2d6",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +2 to hit, reach 0 ft., one target in the swarm's space. Hit: 7 (2d6) piercing damage, or 3 (1d6) piercing damage if the swarm has half of its hit points or fewer."
      }
    ]
  },
  "渡鸦群": {
    "en": "Swarm of Ravens",
    "size": "中型",
    "type": "swarm of Tiny beasts",
    "alignment": "无",
    "ac": 12,
    "ac_note": "dex",
    "hp": "24 (7d8)",
    "speed": "10 ft., 飞行 50 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "钝击",
      "穿刺",
      "挥砍"
    ],
    "cond_immune": [
      "魅惑",
      "惊惧",
      "擒抱",
      "麻痹",
      "石化",
      "倒地",
      "束缚",
      "震慑"
    ],
    "senses": "{'passive_perception': 15}",
    "languages": "—",
    "cr": "1/4",
    "traits": [
      [
        "Swarm",
        "The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny raven. The swarm can't regain hit points or gain temporary hit points."
      ]
    ],
    "actions": [
      {
        "name": "Beaks",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "2d6",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target in the swarm's space. Hit: 7 (2d6) piercing damage, or 3 (1d6) piercing damage if the swarm has half of its hit points or fewer."
      }
    ]
  },
  "蜘蛛群": {
    "en": "Swarm of Spiders",
    "size": "中型",
    "type": "swarm of Tiny beasts",
    "alignment": "无",
    "ac": 12,
    "ac_note": "natural",
    "hp": "22 (5d8)",
    "speed": "20 ft., 爬 20 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "钝击",
      "穿刺",
      "挥砍"
    ],
    "cond_immune": [
      "魅惑",
      "惊惧",
      "麻痹",
      "石化",
      "倒地",
      "束缚",
      "震慑"
    ],
    "senses": "{'盲视': '10 ft.', 'passive_perception': 8}",
    "languages": "—",
    "cr": "1/2",
    "traits": [
      [
        "Swarm",
        "The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. The swarm can't regain hit points or gain temporary hit points."
      ],
      [
        "Spider Climb",
        "The swarm can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."
      ],
      [
        "Web Sense",
        "While in contact with a web, the swarm knows the exact location of any other creature in contact with the same web."
      ],
      [
        "Web Walker",
        "The swarm ignores movement restrictions caused by webbing."
      ]
    ],
    "actions": [
      {
        "name": "Bites",
        "atk": 3,
        "reach": "0 ft",
        "dmg": "4d4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +3 to hit, reach 0 ft., one target in the swarm's space. Hit: 10 (4d4) piercing damage, or 5 (2d4) piercing damage if the swarm has half of its hit points or fewer."
      }
    ]
  },
  "黄蜂群": {
    "en": "Swarm of Wasps",
    "size": "中型",
    "type": "swarm of Tiny beasts",
    "alignment": "无",
    "ac": 12,
    "ac_note": "natural",
    "hp": "22 (5d8)",
    "speed": "5 ft., 飞行 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "钝击",
      "穿刺",
      "挥砍"
    ],
    "cond_immune": [
      "魅惑",
      "惊惧",
      "擒抱",
      "麻痹",
      "石化",
      "倒地",
      "束缚",
      "震慑"
    ],
    "senses": "{'盲视': '10 ft.', 'passive_perception': 8}",
    "languages": "—",
    "cr": "1/2",
    "traits": [
      [
        "Swarm",
        "The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. The swarm can't regain hit points or gain temporary hit points."
      ]
    ],
    "actions": [
      {
        "name": "Bites",
        "atk": 3,
        "reach": "0 ft",
        "dmg": "4d4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +3 to hit, reach 0 ft., one target in the swarm's space. Hit: 10 (4d4) piercing damage, or 5 (2d4) piercing damage if the swarm has half of its hit points or fewer."
      }
    ]
  },
  "泰拉斯奎": {
    "en": "Tarrasque",
    "size": "巨型",
    "type": "怪兽",
    "alignment": "无",
    "ac": 25,
    "ac_note": "natural",
    "hp": "676 (33d20)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "火",
      "毒",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "cond_immune": [
      "魅惑",
      "惊惧",
      "麻痹",
      "中毒"
    ],
    "senses": "{'盲视': '120 ft.', 'passive_perception': 10}",
    "languages": "—",
    "cr": "30",
    "traits": [
      [
        "Legendary Resistance",
        "If the tarrasque fails a saving throw, it can choose to succeed instead."
      ],
      [
        "Magic Resistance",
        "The tarrasque has advantage on saving throws against spells and other magical effects."
      ],
      [
        "Reflective Carapace",
        "Any time the tarrasque is targeted by a magic missile spell, a line spell, or a spell that requires a ranged attack roll, roll a d6. On a 1 to 5, the tarrasque is unaffected. On a 6, the tarrasque is unaffected, and the effect is reflected back at the caster as though it originated from the tarrasque, turning the caster into the target."
      ],
      [
        "Siege Monster",
        "The tarrasque deals double damage to objects and structures."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The tarrasque can use its Frightful Presence. It then makes five attacks: one with its bite, two with its claws, one with its horns, and one with its tail. It can use its Swallow instead of its bite."
      },
      {
        "name": "Bite",
        "atk": 19,
        "reach": "10 ft",
        "dmg": "4d12+10",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +19 to hit, reach 10 ft., one target. Hit: 36 (4d12 + 10) piercing damage. If the target is a creature, it is grappled (escape DC 20). Until this grapple ends, the target is restrained, and the tarrasque can't bite another target."
      },
      {
        "name": "Claw",
        "atk": 19,
        "reach": "15 ft",
        "dmg": "4d8+10",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +19 to hit, reach 15 ft., one target. Hit: 28 (4d8 + 10) slashing damage."
      },
      {
        "name": "Horns",
        "atk": 19,
        "reach": "10 ft",
        "dmg": "4d10+10",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +19 to hit, reach 10 ft., one target. Hit: 32 (4d10 + 10) piercing damage."
      },
      {
        "name": "Tail",
        "atk": 19,
        "reach": "20 ft",
        "dmg": "4d6+10",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +19 to hit, reach 20 ft., one target. Hit: 24 (4d6 + 10) bludgeoning damage. If the target is a creature, it must succeed on a DC 20 Strength saving throw or be knocked prone."
      },
      {
        "name": "Frightful Presence",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Each creature of the tarrasque's choice within 120 feet of it and aware of it must succeed on a DC 17 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, with disadvantage if the tarrasque is within line of sight, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the tarrasque's Frightful Presence for the next 24 hours."
      },
      {
        "name": "Swallow",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The tarrasque makes one bite attack against a Large or smaller creature it is grappling. If the attack hits, the target takes the bite's damage, the target is swallowed, and the grapple ends. While swallowed, the creature is blinded and restrained, it has total cover against attacks and other effects outside the tarrasque, and it takes 56 (16d6) acid damage at the start of each of the tarrasque's turns.\nIf the tarrasque takes 60 damage or more on a single turn from a creature inside it, the tarrasque must succeed on a DC 20 Constitution saving throw at the end of that turn or regurgitate all swallowed creatures, which fall prone in a space within 10 feet of the tarrasque. If the tarrasque dies, a swallowed creature is no longer restrained by it and can escape from the corpse by using 30 feet of movement, exiting prone."
      }
    ],
    "legendary": [
      {
        "name": "Attack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The tarrasque makes one claw attack or tail attack."
      },
      {
        "name": "Move",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The tarrasque moves up to half its speed."
      },
      {
        "name": "Chomp (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The tarrasque makes one bite attack or uses its Swallow."
      }
    ]
  },
  "暴徒": {
    "en": "Thug",
    "size": "中型",
    "type": "类人妖",
    "alignment": "任意非善良",
    "ac": 11,
    "ac_note": "Leather Armor",
    "hp": "32 (5d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 10}",
    "languages": "any one language (usually Common)",
    "cr": "1/2",
    "traits": [
      [
        "Pack Tactics",
        "The thug has advantage on an attack roll against a creature if at least one of the thug's allies is within 5 ft. of the creature and the ally isn't incapacitated."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The thug makes two melee attacks."
      },
      {
        "name": "Mace",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d6+2",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 5 (1d6 + 2) bludgeoning damage."
      },
      {
        "name": "Heavy Crossbow",
        "atk": 2,
        "reach": "100/400 ft",
        "dmg": "1d10",
        "type": "穿刺",
        "extra": "Ranged Weapon Attack: +2 to hit, range 100/400 ft., one target. Hit: 5 (1d10) piercing damage."
      }
    ]
  },
  "虎": {
    "en": "Tiger",
    "size": "大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 12,
    "ac_note": "dex",
    "hp": "37 (5d10)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 13}",
    "languages": "—",
    "cr": "1",
    "traits": [
      [
        "Keen Smell",
        "The tiger has advantage on Wisdom (Perception) checks that rely on smell."
      ],
      [
        "Pounce",
        "If the tiger moves at least 20 ft. straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 13 Strength saving throw or be knocked prone. If the target is prone, the tiger can make one bite attack against it as a bonus action."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d10+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (1d10 + 3) piercing damage."
      },
      {
        "name": "Claw",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d8+3",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) slashing damage."
      }
    ]
  },
  "树人": {
    "en": "Treant",
    "size": "超大型",
    "type": "植物",
    "alignment": "混乱善良",
    "ac": 16,
    "ac_note": "natural",
    "hp": "138 (12d12)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "钝击",
      "穿刺"
    ],
    "vuln": [
      "火"
    ],
    "senses": "{'passive_perception': 13}",
    "languages": "通用语, 德鲁伊语, 精灵语, 精类语",
    "cr": "9",
    "traits": [
      [
        "False Appearance",
        "While the treant remains motionless, it is indistinguishable from a normal tree."
      ],
      [
        "Siege Monster",
        "The treant deals double damage to objects and structures."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The treant makes two slam attacks."
      },
      {
        "name": "Slam",
        "atk": 10,
        "reach": "5 ft",
        "dmg": "3d6+6",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 16 (3d6 + 6) bludgeoning damage."
      },
      {
        "name": "Rock",
        "atk": 10,
        "reach": "60/180 ft",
        "dmg": "4d10+6",
        "type": "钝击",
        "extra": "Ranged Weapon Attack: +10 to hit, range 60/180 ft., one target. Hit: 28 (4d10 + 6) bludgeoning damage."
      },
      {
        "name": "Animate Trees",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The treant magically animates one or two trees it can see within 60 feet of it. These trees have the same statistics as a treant, except they have Intelligence and Charisma scores of 1, they can't speak, and they have only the Slam action option. An animated tree acts as an ally of the treant. The tree remains animate for 1 day or until it dies; until the treant dies or is more than 120 feet from the tree; or until the treant takes a bonus action to turn it back into an inanimate tree. The tree then takes root if possible."
      }
    ]
  },
  "部族武者": {
    "en": "Tribal Warrior",
    "size": "中型",
    "type": "类人妖",
    "alignment": "任意",
    "ac": 12,
    "ac_note": "Hide Armor",
    "hp": "11 (2d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 10}",
    "languages": "any one language",
    "cr": "1/8",
    "traits": [
      [
        "Pack Tactics",
        "The warrior has advantage on an attack roll against a creature if at least one of the warrior's allies is within 5 ft. of the creature and the ally isn't incapacitated."
      ]
    ],
    "actions": [
      {
        "name": "Spear",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee or Ranged Weapon Attack: +3 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 4 (1d6 + 1) piercing damage, or 5 (1d8 + 1) piercing damage if used with two hands to make a melee attack."
      }
    ]
  },
  "三角龙": {
    "en": "Triceratops",
    "size": "超大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 13,
    "ac_note": "natural",
    "hp": "95 (10d12)",
    "speed": "50 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 10}",
    "languages": "—",
    "cr": "5",
    "traits": [
      [
        "Trampling Charge",
        "If the triceratops moves at least 20 ft. straight toward a creature and then hits it with a gore attack on the same turn, that target must succeed on a DC 13 Strength saving throw or be knocked prone. If the target is prone, the triceratops can make one stomp attack against it as a bonus action."
      ]
    ],
    "actions": [
      {
        "name": "Gore",
        "atk": 9,
        "reach": "5 ft",
        "dmg": "4d8+6",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 24 (4d8 + 6) piercing damage."
      },
      {
        "name": "Stomp",
        "atk": 9,
        "reach": "5 ft",
        "dmg": "3d10+6",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +9 to hit, reach 5 ft., one prone creature. Hit: 22 (3d10 + 6) bludgeoning damage"
      }
    ]
  },
  "巨魔": {
    "en": "Troll",
    "size": "大型",
    "type": "巨人",
    "alignment": "混乱邪恶",
    "ac": 15,
    "ac_note": "natural",
    "hp": "84 (8d10)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 12}",
    "languages": "巨语",
    "cr": "5",
    "traits": [
      [
        "Keen Smell",
        "The troll has advantage on Wisdom (Perception) checks that rely on smell."
      ],
      [
        "Regeneration",
        "The troll regains 10 hit points at the start of its turn. If the troll takes acid or fire damage, this trait doesn't function at the start of the troll's next turn. The troll dies only if it starts its turn with 0 hit points and doesn't regenerate."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The troll makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "1d6+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 7 (1d6 + 4) piercing damage."
      },
      {
        "name": "Claw",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "2d6+4",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage."
      }
    ]
  },
  "霸王龙": {
    "en": "Tyrannosaurus Rex",
    "size": "超大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 13,
    "ac_note": "natural",
    "hp": "136 (13d12)",
    "speed": "50 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 14}",
    "languages": "—",
    "cr": "8",
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The tyrannosaurus makes two attacks: one with its bite and one with its tail. It can't make both attacks against the same target."
      },
      {
        "name": "Bite",
        "atk": 10,
        "reach": "10 ft",
        "dmg": "4d12+7",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 33 (4d12 + 7) piercing damage. If the target is a Medium or smaller creature, it is grappled (escape DC 17). Until this grapple ends, the target is restrained, and the tyrannosaurus can't bite another target."
      },
      {
        "name": "Tail",
        "atk": 10,
        "reach": "10 ft",
        "dmg": "3d8+7",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 20 (3d8 + 7) bludgeoning damage."
      }
    ]
  },
  "独角兽": {
    "en": "Unicorn",
    "size": "大型",
    "type": "天界",
    "alignment": "守序善良",
    "ac": 12,
    "ac_note": "dex",
    "hp": "67 (9d10)",
    "speed": "50 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "毒"
    ],
    "cond_immune": [
      "魅惑",
      "麻痹",
      "中毒"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 13}",
    "languages": "天界语, 精灵语, 精类语, telepathy 60 ft.",
    "cr": "5",
    "traits": [
      [
        "Charge",
        "If the unicorn moves at least 20 ft. straight toward a target and then hits it with a horn attack on the same turn, the target takes an extra 9 (2d8) piercing damage. If the target is a creature, it must succeed on a DC 15 Strength saving throw or be knocked prone."
      ],
      [
        "Innate Spellcasting",
        "The unicorn's innate spellcasting ability is Charisma (spell save DC 14). The unicorn can innately cast the following spells, requiring no components:\n\nAt will: detect evil and good, druidcraft, pass without trace\n1/day each: calm emotions, dispel evil and good, entangle"
      ],
      [
        "Magic Resistance",
        "The unicorn has advantage on saving throws against spells and other magical effects."
      ],
      [
        "Magic Weapons",
        "The unicorn's weapon attacks are magical."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The unicorn makes two attacks: one with its hooves and one with its horn."
      },
      {
        "name": "Hooves",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "2d6+4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) bludgeoning damage."
      },
      {
        "name": "Horn",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "1d8+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 8 (1d8 + 4) piercing damage."
      },
      {
        "name": "Healing Touch",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The unicorn touches another creature with its horn. The target magically regains 11 (2d8 + 2) hit points. In addition, the touch removes all diseases and neutralizes all poisons afflicting the target."
      },
      {
        "name": "Teleport",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The unicorn magically teleports itself and up to three willing creatures it can see within 5 ft. of it, along with any equipment they are wearing or carrying, to a location the unicorn is familiar with, up to 1 mile away."
      }
    ],
    "legendary": [
      {
        "name": "Hooves",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The unicorn makes one attack with its hooves."
      },
      {
        "name": "Shimmering Shield (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The unicorn creates a shimmering, magical field around itself or another creature it can see within 60 ft. of it. The target gains a +2 bonus to AC until the end of the unicorn's next turn."
      },
      {
        "name": "Heal Self (Costs 3 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The unicorn magically regains 11 (2d8 + 2) hit points."
      }
    ]
  },
  "吸血鬼（蝠形）": {
    "en": "Vampire, Bat Form",
    "size": "中型",
    "type": "不死",
    "alignment": "守序邪恶",
    "ac": 16,
    "ac_note": "natural",
    "hp": "144 (17d8)",
    "speed": "5 ft., 飞行 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "坏死",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 17}",
    "languages": "the languages it knew in life",
    "cr": "13",
    "traits": [
      [
        "Shapechanger",
        "If the vampire isn't in sun light or running water, it can use its action to polymorph into a Tiny bat or a Medium cloud of mist, or back into its true form.\nWhile in bat form, the vampire can't speak, its walking speed is 5 feet, and it has a flying speed of 30 feet. Its statistics, other than its size and speed, are unchanged. Anything it is wearing transforms with it, but nothing it is carrying does. It reverts to its true form if it dies.\nWhile in mist form, the vampire can't take any actions, speak, or manipulate objects. It is weightless, has a flying speed of 20 feet, can hover, and can enter a hostile creature's space and stop there. In addition, if air can pass through a space, the mist can do so without squeezing, and it can't pass through water. It has advantage on Strength, Dexterity, and Constitution saving throws, and it is immune to all nonmagical damage, except the damage it takes from sunlight."
      ],
      [
        "Legendary Resistance",
        "If the vampire fails a saving throw, it can choose to succeed instead."
      ],
      [
        "Misty Escape",
        "When it drops to 0 hit points outside its resting place, the vampire transforms into a cloud of mist (as in the Shapechanger trait) instead of falling unconscious, provided that it isn't in sunlight or running water. If it can't transform, it is destroyed.\nWhile it has 0 hit points in mist form, it can't revert to its vampire form, and it must reach its resting place within 2 hours or be destroyed. Once in its resting place, it reverts to its vampire form. It is then paralyzed until it regains at least 1 hit point. After spending 1 hour in its resting place with 0 hit points, it regains 1 hit point."
      ],
      [
        "Regeneration",
        "The vampire regains 20 hit points at the start of its turn if it has at least 1 hit point and isn't in sunlight or running water. If the vampire takes radiant damage or damage from holy water, this trait doesn't function at the start of the vampire's next turn."
      ],
      [
        "Spider Climb",
        "The vampire can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."
      ],
      [
        "Vampire Weaknesses",
        "The vampire has the following flaws:\nForbiddance. The vampire can't enter a residence without an invitation from one of the occupants.\nHarmed by Running Water. The vampire takes 20 acid damage if it ends its turn in running water.\nStake to the Heart. If a piercing weapon made of wood is driven into the vampire's heart while the vampire is incapacitated in its resting place, the vampire is paralyzed until the stake is removed.\nSunlight Hypersensitivity. The vampire takes 20 radiant damage when it starts its turn in sunlight. While in sunlight, it has disadvantage on attack rolls and ability checks."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 9,
        "reach": "5 ft",
        "dmg": "1d6+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +9 to hit, reach 5 ft., one willing creature, or a creature that is grappled by the vampire, incapacitated, or restrained. Hit: 7 (1d6 + 4) piercing damage plus 10 (3d6) necrotic damage. The target's hit point maximum is reduced by an amount equal to the necrotic damage taken, and the vampire regains hit points equal to that amount. The reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0. A humanoid slain in this way and then buried in the ground rises the following night as a vampire spawn under the vampire's control."
      },
      {
        "name": "Charm",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The vampire targets one humanoid it can see within 30 ft. of it. If the target can see the vampire, the target must succeed on a DC 17 Wisdom saving throw against this magic or be charmed by the vampire. The charmed target regards the vampire as a trusted friend to be heeded and protected. Although the target isn't under the vampire's control, it takes the vampire's requests or actions in the most favorable way it can, and it is a willing target for the vampire's bit attack.\nEach time the vampire or the vampire's companions do anything harmful to the target, it can repeat the saving throw, ending the effect on itself on a success. Otherwise, the effect lasts 24 hours or until the vampire is destroyed, is on a different plane of existence than the target, or takes a bonus action to end the effect."
      },
      {
        "name": "Children of the Night",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The vampire magically calls 2d4 swarms of bats or rats, provided that the sun isn't up. While outdoors, the vampire can call 3d6 wolves instead. The called creatures arrive in 1d4 rounds, acting as allies of the vampire and obeying its spoken commands. The beasts remain for 1 hour, until the vampire dies, or until the vampire dismisses them as a bonus action."
      }
    ],
    "legendary": [
      {
        "name": "Move",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The vampire moves up to its speed without provoking opportunity attacks."
      },
      {
        "name": "Unarmed Strike",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The vampire makes one unarmed strike."
      },
      {
        "name": "Bite (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The vampire makes one bite attack."
      }
    ]
  },
  "吸血鬼（雾形）": {
    "en": "Vampire, Mist Form",
    "size": "中型",
    "type": "不死",
    "alignment": "守序邪恶",
    "ac": 16,
    "ac_note": "natural",
    "hp": "144 (17d8)",
    "speed": "飞行 20 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "坏死",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 17}",
    "languages": "the languages it knew in life",
    "cr": "13",
    "traits": [
      [
        "Shapechanger",
        "If the vampire isn't in sun light or running water, it can use its action to polymorph into a Tiny bat or a Medium cloud of mist, or back into its true form.\nWhile in bat form, the vampire can't speak, its walking speed is 5 feet, and it has a flying speed of 30 feet. Its statistics, other than its size and speed, are unchanged. Anything it is wearing transforms with it, but nothing it is carrying does. It reverts to its true form if it dies.\nWhile in mist form, the vampire can't take any actions, speak, or manipulate objects. It is weightless, has a flying speed of 20 feet, can hover, and can enter a hostile creature's space and stop there. In addition, if air can pass through a space, the mist can do so without squeezing, and it can't pass through water. It has advantage on Strength, Dexterity, and Constitution saving throws, and it is immune to all nonmagical damage, except the damage it takes from sunlight."
      ],
      [
        "Legendary Resistance",
        "If the vampire fails a saving throw, it can choose to succeed instead."
      ],
      [
        "Misty Escape",
        "When it drops to 0 hit points outside its resting place, the vampire transforms into a cloud of mist (as in the Shapechanger trait) instead of falling unconscious, provided that it isn't in sunlight or running water. If it can't transform, it is destroyed.\nWhile it has 0 hit points in mist form, it can't revert to its vampire form, and it must reach its resting place within 2 hours or be destroyed. Once in its resting place, it reverts to its vampire form. It is then paralyzed until it regains at least 1 hit point. After spending 1 hour in its resting place with 0 hit points, it regains 1 hit point."
      ],
      [
        "Regeneration",
        "The vampire regains 20 hit points at the start of its turn if it has at least 1 hit point and isn't in sunlight or running water. If the vampire takes radiant damage or damage from holy water, this trait doesn't function at the start of the vampire's next turn."
      ],
      [
        "Spider Climb",
        "The vampire can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."
      ],
      [
        "Vampire Weaknesses",
        "The vampire has the following flaws:\nForbiddance. The vampire can't enter a residence without an invitation from one of the occupants.\nHarmed by Running Water. The vampire takes 20 acid damage if it ends its turn in running water.\nStake to the Heart. If a piercing weapon made of wood is driven into the vampire's heart while the vampire is incapacitated in its resting place, the vampire is paralyzed until the stake is removed.\nSunlight Hypersensitivity. The vampire takes 20 radiant damage when it starts its turn in sunlight. While in sunlight, it has disadvantage on attack rolls and ability checks."
      ]
    ],
    "actions": [],
    "legendary": [
      {
        "name": "Move",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The vampire moves up to its speed without provoking opportunity attacks."
      },
      {
        "name": "Unarmed Strike",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The vampire makes one unarmed strike."
      },
      {
        "name": "Bite (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The vampire makes one bite attack."
      }
    ]
  },
  "吸血鬼衍体": {
    "en": "Vampire Spawn",
    "size": "中型",
    "type": "不死",
    "alignment": "中立邪恶",
    "ac": 15,
    "ac_note": "natural",
    "hp": "82 (11d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "坏死",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 13}",
    "languages": "the languages it knew in life",
    "cr": "5",
    "traits": [
      [
        "Regeneration",
        "The vampire regains 10 hit points at the start of its turn if it has at least 1 hit point and isn't in sunlight or running water. If the vampire takes radiant damage or damage from holy water, this trait doesn't function at the start of the vampire's next turn."
      ],
      [
        "Spider Climb",
        "The vampire can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."
      ],
      [
        "Vampire Weaknesses",
        "The vampire has the following flaws:\nForbiddance. The vampire can't enter a residence without an invitation from one of the occupants.\nHarmed by Running Water. The vampire takes 20 acid damage when it ends its turn in running water.\nStake to the Heart. The vampire is destroyed if a piercing weapon made of wood is driven into its heart while it is incapacitated in its resting place.\nSunlight Hypersensitivity. The vampire takes 20 radiant damage when it starts its turn in sunlight. While in sunlight, it has disadvantage on attack rolls and ability checks."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The vampire makes two attacks, only one of which can be a bite attack."
      },
      {
        "name": "Bite",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "1d6+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one willing creature, or a creature that is grappled by the vampire, incapacitated, or restrained. Hit: 6 (1d6 + 3) piercing damage plus 7 (2d6) necrotic damage. The target's hit point maximum is reduced by an amount equal to the necrotic damage taken, and the vampire regains hit points equal to that amount. The reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0."
      },
      {
        "name": "Claws",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d4+3",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one creature. Hit: 8 (2d4 + 3) slashing damage. Instead of dealing damage, the vampire can grapple the target (escape DC 13)."
      }
    ]
  },
  "吸血鬼（吸血鬼形态）": {
    "en": "Vampire, Vampire Form",
    "size": "中型",
    "type": "不死",
    "alignment": "守序邪恶",
    "ac": 16,
    "ac_note": "natural",
    "hp": "144 (17d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "坏死",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 17}",
    "languages": "the languages it knew in life",
    "cr": "13",
    "traits": [
      [
        "Shapechanger",
        "If the vampire isn't in sun light or running water, it can use its action to polymorph into a Tiny bat or a Medium cloud of mist, or back into its true form.\nWhile in bat form, the vampire can't speak, its walking speed is 5 feet, and it has a flying speed of 30 feet. Its statistics, other than its size and speed, are unchanged. Anything it is wearing transforms with it, but nothing it is carrying does. It reverts to its true form if it dies.\nWhile in mist form, the vampire can't take any actions, speak, or manipulate objects. It is weightless, has a flying speed of 20 feet, can hover, and can enter a hostile creature's space and stop there. In addition, if air can pass through a space, the mist can do so without squeezing, and it can't pass through water. It has advantage on Strength, Dexterity, and Constitution saving throws, and it is immune to all nonmagical damage, except the damage it takes from sunlight."
      ],
      [
        "Legendary Resistance",
        "If the vampire fails a saving throw, it can choose to succeed instead."
      ],
      [
        "Misty Escape",
        "When it drops to 0 hit points outside its resting place, the vampire transforms into a cloud of mist (as in the Shapechanger trait) instead of falling unconscious, provided that it isn't in sunlight or running water. If it can't transform, it is destroyed.\nWhile it has 0 hit points in mist form, it can't revert to its vampire form, and it must reach its resting place within 2 hours or be destroyed. Once in its resting place, it reverts to its vampire form. It is then paralyzed until it regains at least 1 hit point. After spending 1 hour in its resting place with 0 hit points, it regains 1 hit point."
      ],
      [
        "Regeneration",
        "The vampire regains 20 hit points at the start of its turn if it has at least 1 hit point and isn't in sunlight or running water. If the vampire takes radiant damage or damage from holy water, this trait doesn't function at the start of the vampire's next turn."
      ],
      [
        "Spider Climb",
        "The vampire can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."
      ],
      [
        "Vampire Weaknesses",
        "The vampire has the following flaws:\nForbiddance. The vampire can't enter a residence without an invitation from one of the occupants.\nHarmed by Running Water. The vampire takes 20 acid damage if it ends its turn in running water.\nStake to the Heart. If a piercing weapon made of wood is driven into the vampire's heart while the vampire is incapacitated in its resting place, the vampire is paralyzed until the stake is removed.\nSunlight Hypersensitivity. The vampire takes 20 radiant damage when it starts its turn in sunlight. While in sunlight, it has disadvantage on attack rolls and ability checks."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The vampire makes two attacks, only one of which can be a bite attack."
      },
      {
        "name": "Unarmed Strike",
        "atk": 9,
        "reach": "5 ft",
        "dmg": "1d8+4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +9 to hit, reach 5 ft., one creature. Hit: 8 (1d8 + 4) bludgeoning damage. Instead of dealing damage, the vampire can grapple the target (escape DC 18)."
      },
      {
        "name": "Bite",
        "atk": 9,
        "reach": "5 ft",
        "dmg": "1d6+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +9 to hit, reach 5 ft., one willing creature, or a creature that is grappled by the vampire, incapacitated, or restrained. Hit: 7 (1d6 + 4) piercing damage plus 10 (3d6) necrotic damage. The target's hit point maximum is reduced by an amount equal to the necrotic damage taken, and the vampire regains hit points equal to that amount. The reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0. A humanoid slain in this way and then buried in the ground rises the following night as a vampire spawn under the vampire's control."
      },
      {
        "name": "Charm",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The vampire targets one humanoid it can see within 30 ft. of it. If the target can see the vampire, the target must succeed on a DC 17 Wisdom saving throw against this magic or be charmed by the vampire. The charmed target regards the vampire as a trusted friend to be heeded and protected. Although the target isn't under the vampire's control, it takes the vampire's requests or actions in the most favorable way it can, and it is a willing target for the vampire's bit attack.\nEach time the vampire or the vampire's companions do anything harmful to the target, it can repeat the saving throw, ending the effect on itself on a success. Otherwise, the effect lasts 24 hours or until the vampire is destroyed, is on a different plane of existence than the target, or takes a bonus action to end the effect."
      },
      {
        "name": "Children of the Night",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The vampire magically calls 2d4 swarms of bats or rats, provided that the sun isn't up. While outdoors, the vampire can call 3d6 wolves instead. The called creatures arrive in 1d4 rounds, acting as allies of the vampire and obeying its spoken commands. The beasts remain for 1 hour, until the vampire dies, or until the vampire dismisses them as a bonus action."
      }
    ],
    "legendary": [
      {
        "name": "Move",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The vampire moves up to its speed without provoking opportunity attacks."
      },
      {
        "name": "Unarmed Strike",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The vampire makes one unarmed strike."
      },
      {
        "name": "Bite (Costs 2 Actions)",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The vampire makes one bite attack."
      }
    ]
  },
  "老兵": {
    "en": "Veteran",
    "size": "中型",
    "type": "类人妖",
    "alignment": "任意",
    "ac": 17,
    "ac_note": "Splint Armor",
    "hp": "58 (9d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 12}",
    "languages": "any one language (usually Common)",
    "cr": "3",
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The veteran makes two longsword attacks. If it has a shortsword drawn, it can also make a shortsword attack."
      },
      {
        "name": "Longsword",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) slashing damage, or 8 (1d10 + 3) slashing damage if used with two hands."
      },
      {
        "name": "Shortsword",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d6+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) piercing damage."
      },
      {
        "name": "Heavy Crossbow",
        "atk": 3,
        "reach": "100/400 ft",
        "dmg": "1d10+1",
        "type": "穿刺",
        "extra": "Ranged Weapon Attack: +3 to hit, range 100/400 ft., one target. Hit: 6 (1d10 + 1) piercing damage."
      }
    ]
  },
  "紫蕈": {
    "en": "Violet Fungus",
    "size": "中型",
    "type": "植物",
    "alignment": "无",
    "ac": 5,
    "ac_note": "dex",
    "hp": "18 (4d8)",
    "speed": "5 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "cond_immune": [
      "目盲",
      "目盲",
      "惊惧"
    ],
    "senses": "{'盲视': '30 ft. (blind beyond this radius)', 'passive_perception': 6}",
    "languages": "—",
    "cr": "1/4",
    "traits": [
      [
        "False Appearance",
        "While the violet fungus remains motionless, it is indistinguishable from an ordinary fungus."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The fungus makes 1d4 Rotting Touch attacks."
      },
      {
        "name": "Rotting Touch",
        "atk": 2,
        "reach": "10 ft",
        "dmg": "1d8",
        "type": "坏死",
        "extra": "Melee Weapon Attack: +2 to hit, reach 10 ft., one creature. Hit: 4 (1d8) necrotic damage."
      }
    ]
  },
  "鹫魔": {
    "en": "Vrock",
    "size": "大型",
    "type": "邪魔",
    "alignment": "混乱邪恶",
    "ac": 15,
    "ac_note": "natural",
    "hp": "104 (11d10)",
    "speed": "40 ft., 飞行 60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "冷",
      "火",
      "电",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "毒"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 11}",
    "languages": "深渊语, telepathy 120 ft.",
    "cr": "6",
    "traits": [
      [
        "Magic Resistance",
        "The vrock has advantage on saving throws against spells and other magical effects."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The vrock makes two attacks: one with its beak and one with its talons."
      },
      {
        "name": "Beak",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d6+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) piercing damage."
      },
      {
        "name": "Talons",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d10+3",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 14 (2d10 + 3) slashing damage."
      },
      {
        "name": "Spores",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "A 15-foot-radius cloud of toxic spores extends out from the vrock. The spores spread around corners. Each creature in that area must succeed on a DC 14 Constitution saving throw or become poisoned. While poisoned in this way, a target takes 5 (1d10) poison damage at the start of each of its turns. A target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. Emptying a vial of holy water on the target also ends the effect on it."
      },
      {
        "name": "Stunning Screech",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The vrock emits a horrific screech. Each creature within 20 feet of it that can hear it and that isn't a demon must succeed on a DC 14 Constitution saving throw or be stunned until the end of the vrock's next turn ."
      }
    ]
  },
  "秃鹫": {
    "en": "Vulture",
    "size": "中型",
    "type": "野兽",
    "alignment": "无",
    "ac": 10,
    "ac_note": "dex",
    "hp": "5 (1d8)",
    "speed": "10 ft., 飞行 50 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 13}",
    "languages": "—",
    "cr": "0",
    "traits": [
      [
        "Keen Sight and Smell",
        "The vulture has advantage on Wisdom (Perception) checks that rely on sight or smell."
      ],
      [
        "Pack Tactics",
        "The vulture has advantage on an attack roll against a creature if at least one of the vulture's allies is within 5 ft. of the creature and the ally isn't incapacitated."
      ]
    ],
    "actions": [
      {
        "name": "Beak",
        "atk": 2,
        "reach": "5 ft",
        "dmg": "1d4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 2 (1d4) piercing damage."
      }
    ]
  },
  "战马": {
    "en": "Warhorse",
    "size": "大型",
    "type": "野兽",
    "alignment": "无",
    "ac": 11,
    "ac_note": "dex",
    "hp": "19 (3d10)",
    "speed": "60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 11}",
    "languages": "—",
    "cr": "1/2",
    "traits": [
      [
        "Trampling Charge",
        "If the horse moves at least 20 ft. straight toward a creature and then hits it with a hooves attack on the same turn, that target must succeed on a DC 14 Strength saving throw or be knocked prone. If the target is prone, the horse can make another attack with its hooves against it as a bonus action."
      ]
    ],
    "actions": [
      {
        "name": "Hooves",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d6+4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) bludgeoning damage."
      }
    ]
  },
  "战马骷髅": {
    "en": "Warhorse Skeleton",
    "size": "大型",
    "type": "不死",
    "alignment": "守序邪恶",
    "ac": 13,
    "ac_note": "armor",
    "hp": "22 (3d10)",
    "speed": "60 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "毒"
    ],
    "vuln": [
      "钝击"
    ],
    "cond_immune": [
      "力竭",
      "中毒"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 9}",
    "languages": "—",
    "cr": "1/2",
    "traits": [],
    "actions": [
      {
        "name": "Hooves",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d6+4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) bludgeoning damage."
      }
    ]
  },
  "水元素": {
    "en": "Water Elemental",
    "size": "大型",
    "type": "元素",
    "alignment": "中立",
    "ac": 14,
    "ac_note": "natural",
    "hp": "114 (12d10)",
    "speed": "30 ft., 游泳 90 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "酸",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "毒"
    ],
    "cond_immune": [
      "力竭",
      "擒抱",
      "麻痹",
      "石化",
      "中毒",
      "倒地",
      "束缚",
      "昏迷"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "水族语",
    "cr": "5",
    "traits": [
      [
        "Water Form",
        "The elemental can enter a hostile creature's space and stop there. It can move through a space as narrow as 1 inch wide without squeezing."
      ],
      [
        "Freeze",
        "If the elemental takes cold damage, it partially freezes; its speed is reduced by 20 ft. until the end of its next turn."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The elemental makes two slam attacks."
      },
      {
        "name": "Slam",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "2d8+4",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) bludgeoning damage."
      },
      {
        "name": "Whelm",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "2d8+4",
        "type": "钝击",
        "extra": "Each creature in the elemental's space must make a DC 15 Strength saving throw. On a failure, a target takes 13 (2d8 + 4) bludgeoning damage. If it is Large or smaller, it is also grappled (escape DC 14). Until this grapple ends, the target is restrained and unable to breathe unless it can breathe water. If the saving throw is successful, the target is pushed out of the elemental's space.\nThe elemental can grapple one Large creature or up to two Medium or smaller creatures at one time. At the start of each of the elemental's turns, each target grappled by it takes 13 (2d8 + 4) bludgeoning damage. A creature within 5 feet of the elemental can pull a creature or object out of it by taking an action to make a DC 14 Strength and succeeding."
      }
    ]
  },
  "鼬": {
    "en": "Weasel",
    "size": "超小型",
    "type": "野兽",
    "alignment": "无",
    "ac": 13,
    "ac_note": "dex",
    "hp": "1 (1d4)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 13}",
    "languages": "—",
    "cr": "0",
    "traits": [
      [
        "Keen Hearing and Smell",
        "The weasel has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one creature. Hit: 1 piercing damage."
      }
    ]
  },
  "熊人（熊形）": {
    "en": "Werebear, Bear Form",
    "size": "中型",
    "type": "类人妖",
    "alignment": "中立善良",
    "ac": 11,
    "ac_note": "natural",
    "hp": "135 (18d8)",
    "speed": "40 ft., 爬 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "钝击",
      "穿刺",
      "slashing"
    ],
    "senses": "{'passive_perception': 17}",
    "languages": "—",
    "cr": "5",
    "traits": [
      [
        "Shapechanger",
        "The werebear can use its action to polymorph into a Large bear-humanoid hybrid or into a Large bear, or back into its true form, which is humanoid. Its statistics, other than its size and AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies."
      ],
      [
        "Keen Smell",
        "The werebear has advantage on Wisdom (Perception) checks that rely on smell."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "In bear form, the werebear makes two claw attacks. In humanoid form, it makes two greataxe attacks. In hybrid form, it can attack like a bear or a humanoid."
      },
      {
        "name": "Bite",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "2d10+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 15 (2d10 + 4) piercing damage. If the target is a humanoid, it must succeed on a DC 14 Constitution saving throw or be cursed with werebear lycanthropy."
      },
      {
        "name": "Claw",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "2d8+4",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) slashing damage."
      }
    ]
  },
  "熊人（人形）": {
    "en": "Werebear, Human Form",
    "size": "中型",
    "type": "类人妖",
    "alignment": "中立善良",
    "ac": 10,
    "ac_note": "dex",
    "hp": "135 (18d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "钝击",
      "穿刺",
      "slashing"
    ],
    "senses": "{'passive_perception': 17}",
    "languages": "通用语",
    "cr": "5",
    "traits": [
      [
        "Shapechanger",
        "The werebear can use its action to polymorph into a Large bear-humanoid hybrid or into a Large bear, or back into its true form, which is humanoid. Its statistics, other than its size and AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies."
      ],
      [
        "Keen Smell",
        "The werebear has advantage on Wisdom (Perception) checks that rely on smell."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "In bear form, the werebear makes two claw attacks. In humanoid form, it makes two greataxe attacks. In hybrid form, it can attack like a bear or a humanoid."
      },
      {
        "name": "Greataxe",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "1d12+4",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 10 (1d12 + 4) slashing damage."
      }
    ]
  },
  "熊人（混合形）": {
    "en": "Werebear, Hybrid Form",
    "size": "中型",
    "type": "类人妖",
    "alignment": "中立善良",
    "ac": 11,
    "ac_note": "natural",
    "hp": "135 (18d8)",
    "speed": "40 ft., 爬 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "钝击",
      "穿刺",
      "slashing"
    ],
    "senses": "{'passive_perception': 17}",
    "languages": "通用语",
    "cr": "5",
    "traits": [
      [
        "Shapechanger",
        "The werebear can use its action to polymorph into a Large bear-humanoid hybrid or into a Large bear, or back into its true form, which is humanoid. Its statistics, other than its size and AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies."
      ],
      [
        "Keen Smell",
        "The werebear has advantage on Wisdom (Perception) checks that rely on smell."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "In bear form, the werebear makes two claw attacks. In humanoid form, it makes two greataxe attacks. In hybrid form, it can attack like a bear or a humanoid."
      },
      {
        "name": "Bite",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "2d10+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 15 (2d10 + 4) piercing damage. If the target is a humanoid, it must succeed on a DC 14 Constitution saving throw or be cursed with werebear lycanthropy."
      },
      {
        "name": "Claw",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "2d8+4",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) slashing damage."
      },
      {
        "name": "Greataxe",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "1d12+4",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 10 (1d12 + 4) slashing damage."
      }
    ]
  },
  "野猪人（猪形）": {
    "en": "Wereboar, Boar Form",
    "size": "中型",
    "type": "类人妖",
    "alignment": "中立邪恶",
    "ac": 11,
    "ac_note": "natural",
    "hp": "78 (12d8)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "钝击",
      "穿刺",
      "slashing"
    ],
    "senses": "{'passive_perception': 12}",
    "languages": "—",
    "cr": "4",
    "traits": [
      [
        "Shapechanger",
        "The wereboar can use its action to polymorph into a boar-humanoid hybrid or into a boar, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies."
      ],
      [
        "Charge (Boar or Hybrid Form Only)",
        "If the wereboar moves at least 15 feet straight toward a target and then hits it with its tusks on the same turn, the target takes an extra 7 (2d6) slashing damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone."
      ],
      [
        "Relentless",
        "If the wereboar takes 14 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead."
      ]
    ],
    "actions": [
      {
        "name": "Tusks",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "2d6+3",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) slashing damage. If the target is a humanoid, it must succeed on a DC 12 Constitution saving throw or be cursed with wereboar lycanthropy."
      }
    ]
  },
  "野猪人（人形）": {
    "en": "Wereboar, Human Form",
    "size": "中型",
    "type": "类人妖",
    "alignment": "中立邪恶",
    "ac": 10,
    "ac_note": "dex",
    "hp": "78 (12d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "钝击",
      "穿刺",
      "slashing"
    ],
    "senses": "{'passive_perception': 12}",
    "languages": "Common (can't speak in boar form)",
    "cr": "4",
    "traits": [
      [
        "Shapechanger",
        "The wereboar can use its action to polymorph into a boar-humanoid hybrid or into a boar, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies."
      ],
      [
        "Relentless",
        "If the wereboar takes 14 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The wereboar makes two attacks, only one of which can be with its tusks."
      },
      {
        "name": "Maul",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "2d6+3",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) bludgeoning damage."
      }
    ]
  },
  "野猪人（混合形）": {
    "en": "Wereboar, Hybrid Form",
    "size": "中型",
    "type": "类人妖",
    "alignment": "中立邪恶",
    "ac": 11,
    "ac_note": "natural",
    "hp": "78 (12d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "钝击",
      "穿刺",
      "slashing"
    ],
    "senses": "{'passive_perception': 12}",
    "languages": "通用语",
    "cr": "4",
    "traits": [
      [
        "Shapechanger",
        "The wereboar can use its action to polymorph into a boar-humanoid hybrid or into a boar, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies."
      ],
      [
        "Charge (Boar or Hybrid Form Only)",
        "If the wereboar moves at least 15 feet straight toward a target and then hits it with its tusks on the same turn, the target takes an extra 7 (2d6) slashing damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone."
      ],
      [
        "Relentless",
        "If the wereboar takes 14 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The wereboar makes two attacks, only one of which can be with its tusks."
      },
      {
        "name": "Maul",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "2d6+3",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) bludgeoning damage."
      },
      {
        "name": "Tusks",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "2d6+3",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) slashing damage. If the target is a humanoid, it must succeed on a DC 12 Constitution saving throw or be cursed with wereboar lycanthropy."
      }
    ]
  },
  "鼠人（人形）": {
    "en": "Wererat, Human Form",
    "size": "中型",
    "type": "类人妖",
    "alignment": "守序邪恶",
    "ac": 12,
    "ac_note": "dex",
    "hp": "33 (6d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "钝击",
      "穿刺",
      "slashing"
    ],
    "senses": "{'passive_perception': 12}",
    "languages": "通用语",
    "cr": "2",
    "traits": [
      [
        "Shapechanger",
        "The wererat can use its action to polymorph into a rat-humanoid hybrid or into a giant rat, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies."
      ],
      [
        "Keen Smell",
        "The wererat has advantage on Wisdom (Perception) checks that rely on smell."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The wererat makes two attacks, only one of which can be a bite."
      },
      {
        "name": "Shortsword",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d6+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage."
      },
      {
        "name": "Hand Crossbow",
        "atk": 4,
        "reach": "30/120 ft",
        "dmg": "1d6+2",
        "type": "穿刺",
        "extra": "Ranged Weapon Attack: +4 to hit, range 30/120 ft., one target. Hit: 5 (1d6 + 2) piercing damage."
      }
    ]
  },
  "鼠人（混合形）": {
    "en": "Wererat, Hybrid Form",
    "size": "中型",
    "type": "类人妖",
    "alignment": "守序邪恶",
    "ac": 12,
    "ac_note": "natural",
    "hp": "33 (6d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "钝击",
      "穿刺",
      "slashing"
    ],
    "senses": "{'passive_perception': 12}",
    "languages": "通用语",
    "cr": "2",
    "traits": [
      [
        "Shapechanger",
        "The wererat can use its action to polymorph into a rat-humanoid hybrid or into a giant rat, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies."
      ],
      [
        "Keen Smell",
        "The wererat has advantage on Wisdom (Perception) checks that rely on smell."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The wererat makes two attacks, only one of which can be a bite."
      },
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d4+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) piercing damage. If the target is a humanoid, it must succeed on a DC 11 Constitution saving throw or be cursed with wererat lycanthropy."
      },
      {
        "name": "Shortsword",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d6+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage."
      },
      {
        "name": "Hand Crossbow",
        "atk": 4,
        "reach": "30/120 ft",
        "dmg": "1d6+2",
        "type": "穿刺",
        "extra": "Ranged Weapon Attack: +4 to hit, range 30/120 ft., one target. Hit: 5 (1d6 + 2) piercing damage."
      }
    ]
  },
  "鼠人（鼠形）": {
    "en": "Wererat, Rat Form",
    "size": "中型",
    "type": "类人妖",
    "alignment": "守序邪恶",
    "ac": 12,
    "ac_note": "natural",
    "hp": "33 (6d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "钝击",
      "穿刺",
      "slashing"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 12}",
    "languages": "—",
    "cr": "2",
    "traits": [
      [
        "Shapechanger",
        "The wererat can use its action to polymorph into a rat-humanoid hybrid or into a giant rat, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies."
      ],
      [
        "Keen Smell",
        "The wererat has advantage on Wisdom (Perception) checks that rely on smell."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d4+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) piercing damage. If the target is a humanoid, it must succeed on a DC 11 Constitution saving throw or be cursed with wererat lycanthropy."
      }
    ]
  },
  "虎人（人形）": {
    "en": "Weretiger, Human Form",
    "size": "中型",
    "type": "类人妖",
    "alignment": "中立",
    "ac": 12,
    "ac_note": "dex",
    "hp": "120 (16d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "钝击",
      "穿刺",
      "slashing"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 15}",
    "languages": "通用语",
    "cr": "4",
    "traits": [
      [
        "Shapechanger",
        "The weretiger can use its action to polymorph into a tiger-humanoid hybrid or into a tiger, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies."
      ],
      [
        "Keen Hearing and Smell",
        "The weretiger has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "In humanoid form, the weretiger makes two scimitar attacks or two longbow attacks. In hybrid form, it can attack like a humanoid or make two claw attacks."
      },
      {
        "name": "Scimitar",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d6+3",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) slashing damage."
      },
      {
        "name": "Longbow",
        "atk": 4,
        "reach": "150/600 ft",
        "dmg": "1d8+2",
        "type": "穿刺",
        "extra": "Ranged Weapon Attack: +4 to hit, range 150/600 ft., one target. Hit: 6 (1d8 + 2) piercing damage."
      }
    ]
  },
  "虎人（混合形）": {
    "en": "Weretiger, Hybrid Form",
    "size": "中型",
    "type": "类人妖",
    "alignment": "中立",
    "ac": 12,
    "ac_note": "dex",
    "hp": "120 (16d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "钝击",
      "穿刺",
      "slashing"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 15}",
    "languages": "通用语",
    "cr": "4",
    "traits": [
      [
        "Shapechanger",
        "The weretiger can use its action to polymorph into a tiger-humanoid hybrid or into a tiger, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies."
      ],
      [
        "Keen Hearing and Smell",
        "The weretiger has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      ],
      [
        "Pounce",
        "If the weretiger moves at least 15 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 14 Strength saving throw or be knocked prone. If the target is prone, the weretiger can make one bite attack against it as a bonus action."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "In humanoid form, the weretiger makes two scimitar attacks or two longbow attacks. In hybrid form, it can attack like a humanoid or make two claw attacks."
      },
      {
        "name": "Bite",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d10+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (1d10 + 3) piercing damage. If the target is a humanoid, it must succeed on a DC 13 Constitution saving throw or be cursed with weretiger lycanthropy."
      },
      {
        "name": "Claw",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d8+3",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) slashing damage."
      },
      {
        "name": "Scimitar",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d6+3",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) slashing damage."
      },
      {
        "name": "Longbow",
        "atk": 4,
        "reach": "150/600 ft",
        "dmg": "1d8+2",
        "type": "穿刺",
        "extra": "Ranged Weapon Attack: +4 to hit, range 150/600 ft., one target. Hit: 6 (1d8 + 2) piercing damage."
      }
    ]
  },
  "虎人（虎形）": {
    "en": "Weretiger, Tiger Form",
    "size": "中型",
    "type": "类人妖",
    "alignment": "中立",
    "ac": 12,
    "ac_note": "natural",
    "hp": "120 (16d8)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "钝击",
      "穿刺",
      "slashing"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 15}",
    "languages": "—",
    "cr": "4",
    "traits": [
      [
        "Shapechanger",
        "The weretiger can use its action to polymorph into a tiger-humanoid hybrid or into a tiger, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies."
      ],
      [
        "Keen Hearing and Smell",
        "The weretiger has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      ],
      [
        "Pounce",
        "If the weretiger moves at least 15 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 14 Strength saving throw or be knocked prone. If the target is prone, the weretiger can make one bite attack against it as a bonus action."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d10+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (1d10 + 3) piercing damage. If the target is a humanoid, it must succeed on a DC 13 Constitution saving throw or be cursed with weretiger lycanthropy."
      },
      {
        "name": "Claw",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "1d8+3",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) slashing damage."
      }
    ]
  },
  "狼人（人形）": {
    "en": "Werewolf, Human Form",
    "size": "中型",
    "type": "类人妖",
    "alignment": "混乱邪恶",
    "ac": 11,
    "ac_note": "dex",
    "hp": "58 (9d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "钝击",
      "穿刺",
      "slashing"
    ],
    "senses": "{'passive_perception': 14}",
    "languages": "通用语",
    "cr": "3",
    "traits": [
      [
        "Shapechanger",
        "The werewolf can use its action to polymorph into a wolf-humanoid hybrid or into a wolf, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies."
      ],
      [
        "Keen Hearing and Smell",
        "The werewolf has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The werewolf makes two attacks: two with its spear (humanoid form) or one with its bite and one with its claws (hybrid form)."
      },
      {
        "name": "Spear",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee or Ranged Weapon Attack: +4 to hit, reach 5 ft. or range 20/60 ft., one creature. Hit: 5 (1d6 + 2) piercing damage, or 6 (1d8 + 2) piercing damage if used with two hands to make a melee attack."
      }
    ]
  },
  "狼人（混合形）": {
    "en": "Werewolf, Hybrid Form",
    "size": "中型",
    "type": "类人妖",
    "alignment": "混乱邪恶",
    "ac": 12,
    "ac_note": "natural",
    "hp": "58 (9d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "钝击",
      "穿刺",
      "slashing"
    ],
    "senses": "{'passive_perception': 14}",
    "languages": "通用语",
    "cr": "3",
    "traits": [
      [
        "Shapechanger",
        "The werewolf can use its action to polymorph into a wolf-humanoid hybrid or into a wolf, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies."
      ],
      [
        "Keen Hearing and Smell",
        "The werewolf has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The werewolf makes two attacks: two with its spear (humanoid form) or one with its bite and one with its claws (hybrid form)."
      },
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d8+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8 + 2) piercing damage. If the target is a humanoid, it must succeed on a DC 12 Constitution saving throw or be cursed with werewolf lycanthropy."
      },
      {
        "name": "Claws",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "2d4+2",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 7 (2d4 + 2) slashing damage."
      }
    ]
  },
  "狼人（狼形）": {
    "en": "Werewolf, Wolf Form",
    "size": "中型",
    "type": "类人妖",
    "alignment": "混乱邪恶",
    "ac": 12,
    "ac_note": "natural",
    "hp": "58 (9d8)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "钝击",
      "穿刺",
      "slashing"
    ],
    "senses": "{'passive_perception': 14}",
    "languages": "—",
    "cr": "3",
    "traits": [
      [
        "Shapechanger",
        "The werewolf can use its action to polymorph into a wolf-humanoid hybrid or into a wolf, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies."
      ],
      [
        "Keen Hearing and Smell",
        "The werewolf has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d8+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8 + 2) piercing damage. If the target is a humanoid, it must succeed on a DC 12 Constitution saving throw or be cursed with werewolf lycanthropy."
      }
    ]
  },
  "白龙幼龙": {
    "en": "White Dragon Wyrmling",
    "size": "中型",
    "type": "龙",
    "alignment": "混乱邪恶",
    "ac": 16,
    "ac_note": "natural",
    "hp": "32 (5d8)",
    "speed": "30 ft., 掘地 15 ft., 飞行 60 ft., 游泳 30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "冷"
    ],
    "senses": "{'盲视': '10 ft.', '黑暗视觉': '60 ft.', 'passive_perception': 14}",
    "languages": "龙语",
    "cr": "2",
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d10+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (1d10 + 2) piercing damage plus 2 (1d4) cold damage."
      },
      {
        "name": "Cold Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "5d8",
        "type": "冷",
        "extra": "The dragon exhales an icy blast of hail in a 15-foot cone. Each creature in that area must make a DC 12 Constitution saving throw, taking 22 (5d8) cold damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "尸妖": {
    "en": "Wight",
    "size": "中型",
    "type": "不死",
    "alignment": "中立邪恶",
    "ac": 14,
    "ac_note": "Studded Leather Armor",
    "hp": "45 (6d8)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "坏死",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "毒"
    ],
    "cond_immune": [
      "力竭",
      "中毒"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 13}",
    "languages": "the languages it knew in life",
    "cr": "3",
    "traits": [
      [
        "Sunlight Sensitivity",
        "While in sunlight, the wight has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The wight makes two longsword attacks or two longbow attacks. It can use its Life Drain in place of one longsword attack."
      },
      {
        "name": "Life Drain",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "1d6+2",
        "type": "坏死",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 5 (1d6 + 2) necrotic damage. The target must succeed on a DC 13 Constitution saving throw or its hit point maximum is reduced by an amount equal to the damage taken. This reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0.\nA humanoid slain by this attack rises 24 hours later as a zombie under the wight's control, unless the humanoid is restored to life or its body is destroyed. The wight can have no more than twelve zombies under its control at one time."
      },
      {
        "name": "Longsword",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8 + 2) slashing damage, or 7 (1d10 + 2) slashing damage if used with two hands."
      },
      {
        "name": "Longbow",
        "atk": 4,
        "reach": "150/600 ft",
        "dmg": "1d8+2",
        "type": "穿刺",
        "extra": "Ranged Weapon Attack: +4 to hit, range 150/600 ft., one target. Hit: 6 (1d8 + 2) piercing damage."
      }
    ]
  },
  "鬼火": {
    "en": "Will-o'-Wisp",
    "size": "超小型",
    "type": "不死",
    "alignment": "混乱邪恶",
    "ac": 19,
    "ac_note": "dex",
    "hp": "22 (9d4)",
    "speed": "0 ft., 飞行 50 ft., 悬浮 True",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "酸",
      "冷",
      "火",
      "坏死",
      "雷",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "电",
      "毒"
    ],
    "cond_immune": [
      "力竭",
      "擒抱",
      "麻痹",
      "中毒",
      "倒地",
      "束缚",
      "昏迷"
    ],
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 12}",
    "languages": "the languages it knew in life",
    "cr": "2",
    "traits": [
      [
        "Consume Life",
        "As a bonus action, the will-o'-wisp can target one creature it can see within 5 ft. of it that has 0 hit points and is still alive. The target must succeed on a DC 10 Constitution saving throw against this magic or die. If the target dies, the will-o'-wisp regains 10 (3d6) hit points."
      ],
      [
        "Ephemeral",
        "The will-o'-wisp can't wear or carry anything."
      ],
      [
        "Incorporeal Movement",
        "The will-o'-wisp can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object."
      ],
      [
        "Variable Illumination",
        "The will-o'-wisp sheds bright light in a 5- to 20-foot radius and dim light for an additional number of ft. equal to the chosen radius. The will-o'-wisp can alter the radius as a bonus action."
      ]
    ],
    "actions": [
      {
        "name": "Shock",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "2d8",
        "type": "电",
        "extra": "Melee Spell Attack: +4 to hit, reach 5 ft., one creature. Hit: 9 (2d8) lightning damage."
      },
      {
        "name": "Invisibility",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The will-o'-wisp and its light magically become invisible until it attacks or uses its Consume Life, or until its concentration ends (as if concentrating on a spell)."
      }
    ]
  },
  "冬狼": {
    "en": "Winter Wolf",
    "size": "大型",
    "type": "怪兽",
    "alignment": "中立邪恶",
    "ac": 13,
    "ac_note": "natural",
    "hp": "75 (10d10)",
    "speed": "50 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "冷"
    ],
    "senses": "{'passive_perception': 15}",
    "languages": "通用语, 巨语, Winter Wolf",
    "cr": "3",
    "traits": [
      [
        "Keen Hearing and Smell",
        "The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      ],
      [
        "Pack Tactics",
        "The wolf has advantage on an attack roll against a creature if at least one of the wolf's allies is within 5 ft. of the creature and the ally isn't incapacitated."
      ],
      [
        "Snow Camouflage",
        "The wolf has advantage on Dexterity (Stealth) checks made to hide in snowy terrain."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "2d6+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) piercing damage. If the target is a creature, it must succeed on a DC 14 Strength saving throw or be knocked prone."
      },
      {
        "name": "Cold Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "4d8",
        "type": "冷",
        "extra": "The wolf exhales a blast of freezing wind in a 15-foot cone. Each creature in that area must make a DC 12 Dexterity saving throw, taking 18 (4d8) cold damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "狼": {
    "en": "Wolf",
    "size": "中型",
    "type": "野兽",
    "alignment": "无",
    "ac": 13,
    "ac_note": "natural",
    "hp": "11 (2d8)",
    "speed": "40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'passive_perception': 13}",
    "languages": "—",
    "cr": "1/4",
    "traits": [
      [
        "Keen Hearing and Smell",
        "The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      ],
      [
        "Pack Tactics",
        "The wolf has advantage on an attack roll against a creature if at least one of the wolf's allies is within 5 ft. of the creature and the ally isn't incapacitated."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "2d4+2",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (2d4 + 2) piercing damage. If the target is a creature, it must succeed on a DC 11 Strength saving throw or be knocked prone."
      }
    ]
  },
  "恐狼": {
    "en": "Worg",
    "size": "大型",
    "type": "怪兽",
    "alignment": "中立邪恶",
    "ac": 13,
    "ac_note": "natural",
    "hp": "26 (4d10)",
    "speed": "50 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 14}",
    "languages": "哥布林语, Worg",
    "cr": "1/2",
    "traits": [
      [
        "Keen Hearing and Smell",
        "The worg has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "2d6+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) piercing damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone."
      }
    ]
  },
  "邪灵": {
    "en": "Wraith",
    "size": "中型",
    "type": "不死",
    "alignment": "中立邪恶",
    "ac": 13,
    "ac_note": "dex",
    "hp": "67 (9d8)",
    "speed": "0 ft., 飞行 60 ft., 悬浮 True",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "酸",
      "冷",
      "火",
      "电",
      "雷",
      "钝击",
      "穿刺",
      "slashing"
    ],
    "immune": [
      "坏死",
      "毒"
    ],
    "cond_immune": [
      "魅惑",
      "力竭",
      "擒抱",
      "麻痹",
      "石化",
      "中毒",
      "倒地",
      "束缚"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 12}",
    "languages": "the languages it knew in life",
    "cr": "5",
    "traits": [
      [
        "Incorporeal Movement",
        "The wraith can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object."
      ],
      [
        "Sunlight Sensitivity",
        "While in sunlight, the wraith has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight."
      ]
    ],
    "actions": [
      {
        "name": "Life Drain",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "4d8+3",
        "type": "坏死",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one creature. Hit: 21 (4d8 + 3) necrotic damage. The target must succeed on a DC 14 Constitution saving throw or its hit point maximum is reduced by an amount equal to the damage taken. This reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0."
      },
      {
        "name": "Create Specter",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The wraith targets a humanoid within 10 feet of it that has been dead for no longer than 1 minute and died violently. The target's spirit rises as a specter in the space of its corpse or in the nearest unoccupied space. The specter is under the wraith's control. The wraith can have no more than seven specters under its control at one time."
      }
    ]
  },
  "飞龙": {
    "en": "Wyvern",
    "size": "大型",
    "type": "龙",
    "alignment": "无",
    "ac": 13,
    "ac_note": "natural",
    "hp": "110 (13d10)",
    "speed": "20 ft., 飞行 80 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 14}",
    "languages": "—",
    "cr": "6",
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The wyvern makes two attacks: one with its bite and one with its stinger. While flying, it can use its claws in place of one other attack."
      },
      {
        "name": "Bite",
        "atk": 7,
        "reach": "10 ft",
        "dmg": "2d6+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +7 to hit, reach 10 ft., one creature. Hit: 11 (2d6 + 4) piercing damage."
      },
      {
        "name": "Claws",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "2d8+4",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) slashing damage."
      },
      {
        "name": "Stinger",
        "atk": 7,
        "reach": "10 ft",
        "dmg": "2d6+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +7 to hit, reach 10 ft., one creature. Hit: 11 (2d6 + 4) piercing damage. The target must make a DC 15 Constitution saving throw, taking 24 (7d6) poison damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "石鼎兽": {
    "en": "Xorn",
    "size": "中型",
    "type": "元素",
    "alignment": "中立",
    "ac": 19,
    "ac_note": "natural",
    "hp": "73 (7d8)",
    "speed": "20 ft., 掘地 20 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "resist": [
      "穿刺",
      "slashing"
    ],
    "senses": "{'黑暗视觉': '60 ft.', '震颤感知': '60 ft.', 'passive_perception': 16}",
    "languages": "土族语",
    "cr": "5",
    "traits": [
      [
        "Earth Glide",
        "The xorn can burrow through nonmagical, unworked earth and stone. While doing so, the xorn doesn't disturb the material it moves through."
      ],
      [
        "Stone Camouflage",
        "The xorn has advantage on Dexterity (Stealth) checks made to hide in rocky terrain."
      ],
      [
        "Treasure Sense",
        "The xorn can pinpoint, by scent, the location of precious metals and stones, such as coins and gems, within 60 ft. of it."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The xorn makes three claw attacks and one bite attack."
      },
      {
        "name": "Bite",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "3d6+3",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (3d6 + 3) piercing damage."
      },
      {
        "name": "Claw",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "1d6+3",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) slashing damage."
      }
    ]
  },
  "黑龙幼龙（Young Black Dragon）": {
    "en": "Young Black Dragon",
    "size": "大型",
    "type": "龙",
    "alignment": "混乱邪恶",
    "ac": 18,
    "ac_note": "natural",
    "hp": "127 (15d10)",
    "speed": "40 ft., 飞行 80 ft., 游泳 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "酸"
    ],
    "senses": "{'盲视': '30 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 16}",
    "languages": "通用语, 龙语",
    "cr": "7",
    "traits": [
      [
        "Amphibious",
        "The dragon can breathe air and water."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 7,
        "reach": "10 ft",
        "dmg": "2d10+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 15 (2d10 + 4) piercing damage plus 4 (1d8) acid damage."
      },
      {
        "name": "Claw",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "2d6+4",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage."
      },
      {
        "name": "Acid Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "11d8",
        "type": "酸",
        "extra": "The dragon exhales acid in a 30-foot line that is 5 feet wide. Each creature in that line must make a DC 14 Dexterity saving throw, taking 49 (11d8) acid damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "蓝龙幼龙（Young Blue Dragon）": {
    "en": "Young Blue Dragon",
    "size": "大型",
    "type": "龙",
    "alignment": "守序邪恶",
    "ac": 18,
    "ac_note": "natural",
    "hp": "152 (16d10)",
    "speed": "40 ft., 掘地 20 ft., 飞行 80 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "电"
    ],
    "senses": "{'盲视': '30 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 19}",
    "languages": "通用语, 龙语",
    "cr": "9",
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 9,
        "reach": "10 ft",
        "dmg": "2d10+5",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 16 (2d10 + 5) piercing damage plus 5 (1d10) lightning damage."
      },
      {
        "name": "Claw",
        "atk": 9,
        "reach": "5 ft",
        "dmg": "2d6+5",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 5) slashing damage."
      },
      {
        "name": "Lightning Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "10d10",
        "type": "电",
        "extra": "The dragon exhales lightning in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 16 Dexterity saving throw, taking 55 (10d10) lightning damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "黄铜龙幼龙（Young Brass Dragon）": {
    "en": "Young Brass Dragon",
    "size": "大型",
    "type": "龙",
    "alignment": "混乱善良",
    "ac": 17,
    "ac_note": "natural",
    "hp": "110 (13d10)",
    "speed": "40 ft., 掘地 20 ft., 飞行 80 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "火"
    ],
    "senses": "{'盲视': '30 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 16}",
    "languages": "通用语, 龙语",
    "cr": "6",
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 7,
        "reach": "10 ft",
        "dmg": "2d10+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 15 (2d10 + 4) piercing damage."
      },
      {
        "name": "Claw",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "2d6+4",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage."
      },
      {
        "name": "Breath Weapons",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon uses one of the following breath weapons.\nFire Breath. The dragon exhales fire in a 40-foot line that is 5 feet wide. Each creature in that line must make a DC 14 Dexterity saving throw, taking 42 (12d6) fire damage on a failed save, or half as much damage on a successful one.\nSleep Breath. The dragon exhales sleep gas in a 30-foot cone. Each creature in that area must succeed on a DC 14 Constitution saving throw or fall unconscious for 5 minutes. This effect ends for a creature if the creature takes damage or someone uses an action to wake it."
      }
    ]
  },
  "青铜龙幼龙（Young Bronze Dragon）": {
    "en": "Young Bronze Dragon",
    "size": "大型",
    "type": "龙",
    "alignment": "守序善良",
    "ac": 18,
    "ac_note": "natural",
    "hp": "142 (15d10)",
    "speed": "40 ft., 飞行 80 ft., 游泳 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "电"
    ],
    "senses": "{'盲视': '30 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 17}",
    "languages": "通用语, 龙语",
    "cr": "8",
    "traits": [
      [
        "Amphibious",
        "The dragon can breathe air and water."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 8,
        "reach": "10 ft",
        "dmg": "2d10+5",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 16 (2d10 + 5) piercing damage."
      },
      {
        "name": "Claw",
        "atk": 8,
        "reach": "5 ft",
        "dmg": "2d6+5",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 5) slashing damage."
      },
      {
        "name": "Breath Weapons",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon uses one of the following breath weapons.\nLightning Breath. The dragon exhales lightning in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 15 Dexterity saving throw, taking 55 (10d10) lightning damage on a failed save, or half as much damage on a successful one.\nRepulsion Breath. The dragon exhales repulsion energy in a 30-foot cone. Each creature in that area must succeed on a DC 15 Strength saving throw. On a failed save, the creature is pushed 40 feet away from the dragon."
      }
    ]
  },
  "红铜龙幼龙（Young Copper Dragon）": {
    "en": "Young Copper Dragon",
    "size": "大型",
    "type": "龙",
    "alignment": "混乱善良",
    "ac": 17,
    "ac_note": "natural",
    "hp": "119 (14d10)",
    "speed": "40 ft., 爬 40 ft., 飞行 80 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "酸"
    ],
    "senses": "{'盲视': '30 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 17}",
    "languages": "通用语, 龙语",
    "cr": "7",
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 7,
        "reach": "10 ft",
        "dmg": "2d10+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 15 (2d10 + 4) piercing damage."
      },
      {
        "name": "Claw",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "2d6+4",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage."
      },
      {
        "name": "Breath Weapons",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon uses one of the following breath weapons.\nAcid Breath. The dragon exhales acid in an 40-foot line that is 5 feet wide. Each creature in that line must make a DC 14 Dexterity saving throw, taking 40 (9d8) acid damage on a failed save, or half as much damage on a successful one.\nSlowing Breath. The dragon exhales gas in a 30-foot cone. Each creature in that area must succeed on a DC 14 Constitution saving throw. On a failed save, the creature can't use reactions, its speed is halved, and it can't make more than one attack on its turn. In addition, the creature can use either an action or a bonus action on its turn, but not both. These effects last for 1 minute. The creature can repeat the saving throw at the end of each of its turns, ending the effect on itself with a successful save."
      }
    ]
  },
  "金龙幼龙（Young Gold Dragon）": {
    "en": "Young Gold Dragon",
    "size": "大型",
    "type": "龙",
    "alignment": "守序善良",
    "ac": 18,
    "ac_note": "natural",
    "hp": "178 (17d10)",
    "speed": "40 ft., 飞行 80 ft., 游泳 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "火"
    ],
    "senses": "{'盲视': '30 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 19}",
    "languages": "通用语, 龙语",
    "cr": "10",
    "traits": [
      [
        "Amphibious",
        "The dragon can breathe air and water."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 10,
        "reach": "10 ft",
        "dmg": "2d10+6",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 17 (2d10 + 6) piercing damage."
      },
      {
        "name": "Claw",
        "atk": 10,
        "reach": "5 ft",
        "dmg": "2d6+6",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage."
      },
      {
        "name": "Breath Weapons",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon uses one of the following breath weapons.\nFire Breath. The dragon exhales fire in a 30-foot cone. Each creature in that area must make a DC 17 Dexterity saving throw, taking 55 (10d10) fire damage on a failed save, or half as much damage on a successful one.\nWeakening Breath. The dragon exhales gas in a 30-foot cone. Each creature in that area must succeed on a DC 17 Strength saving throw or have disadvantage on Strength-based attack rolls, Strength checks, and Strength saving throws for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ]
  },
  "绿龙幼龙（Young Green Dragon）": {
    "en": "Young Green Dragon",
    "size": "大型",
    "type": "龙",
    "alignment": "守序邪恶",
    "ac": 18,
    "ac_note": "natural",
    "hp": "136 (16d10)",
    "speed": "40 ft., 飞行 80 ft., 游泳 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "毒"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'盲视': '30 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 17}",
    "languages": "通用语, 龙语",
    "cr": "8",
    "traits": [
      [
        "Amphibious",
        "The dragon can breathe air and water."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 7,
        "reach": "10 ft",
        "dmg": "2d10+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 15 (2d10 + 4) piercing damage plus 7 (2d6) poison damage."
      },
      {
        "name": "Claw",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "2d6+4",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage."
      },
      {
        "name": "Poison Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "12d6",
        "type": "毒",
        "extra": "The dragon exhales poisonous gas in a 30-foot cone. Each creature in that area must make a DC 14 Constitution saving throw, taking 42 (12d6) poison damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "红龙幼龙（Young Red Dragon）": {
    "en": "Young Red Dragon",
    "size": "大型",
    "type": "龙",
    "alignment": "混乱邪恶",
    "ac": 18,
    "ac_note": "natural",
    "hp": "178 (17d10)",
    "speed": "40 ft., 爬 40 ft., 飞行 80 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "火"
    ],
    "senses": "{'盲视': '30 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 18}",
    "languages": "通用语, 龙语",
    "cr": "10",
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 10,
        "reach": "10 ft",
        "dmg": "2d10+6",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 17 (2d10 + 6) piercing damage plus 3 (1d6) fire damage."
      },
      {
        "name": "Claw",
        "atk": 10,
        "reach": "5 ft",
        "dmg": "2d6+6",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage."
      },
      {
        "name": "Fire Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "16d6",
        "type": "火",
        "extra": "The dragon exhales fire in a 30-foot cone. Each creature in that area must make a DC 17 Dexterity saving throw, taking 56 (16d6) fire damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "银龙幼龙（Young Silver Dragon）": {
    "en": "Young Silver Dragon",
    "size": "大型",
    "type": "龙",
    "alignment": "守序善良",
    "ac": 18,
    "ac_note": "natural",
    "hp": "168 (16d10)",
    "speed": "40 ft., 飞行 80 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "冷"
    ],
    "senses": "{'盲视': '30 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 18}",
    "languages": "通用语, 龙语",
    "cr": "9",
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 10,
        "reach": "10 ft",
        "dmg": "2d10+6",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 17 (2d10 + 6) piercing damage."
      },
      {
        "name": "Claw",
        "atk": 10,
        "reach": "5 ft",
        "dmg": "2d6+6",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage."
      },
      {
        "name": "Breath Weapons",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon uses one of the following breath weapons.\nCold Breath. The dragon exhales an icy blast in a 30-foot cone. Each creature in that area must make a DC 17 Constitution saving throw, taking 54 (12d8) cold damage on a failed save, or half as much damage on a successful one.\nParalyzing Breath. The dragon exhales paralyzing gas in a 30-foot cone. Each creature in that area must succeed on a DC 17 Constitution saving throw or be paralyzed for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ]
  },
  "白龙幼龙（Young White Dragon）": {
    "en": "Young White Dragon",
    "size": "大型",
    "type": "龙",
    "alignment": "混乱邪恶",
    "ac": 17,
    "ac_note": "natural",
    "hp": "133 (14d10)",
    "speed": "40 ft., 掘地 20 ft., 飞行 80 ft., 游泳 40 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "冷"
    ],
    "senses": "{'盲视': '30 ft.', '黑暗视觉': '120 ft.', 'passive_perception': 16}",
    "languages": "通用语, 龙语",
    "cr": "6",
    "traits": [
      [
        "Ice Walk",
        "The dragon can move across and climb icy surfaces without needing to make an ability check. Additionally, difficult terrain composed of ice or snow doesn't cost it extra movement."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "The dragon makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "atk": 7,
        "reach": "10 ft",
        "dmg": "2d10+4",
        "type": "穿刺",
        "extra": "Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 15 (2d10 + 4) piercing damage plus 4 (1d8) cold damage."
      },
      {
        "name": "Claw",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "2d6+4",
        "type": "挥砍",
        "extra": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage."
      },
      {
        "name": "Cold Breath",
        "atk": 0,
        "reach": "5 ft",
        "dmg": "10d8",
        "type": "冷",
        "extra": "The dragon exhales an icy blast in a 30-foot cone. Each creature in that area must make a DC 15 Constitution saving throw, taking 45 (10d8) cold damage on a failed save, or half as much damage on a successful one."
      }
    ]
  },
  "僵尸": {
    "en": "Zombie",
    "size": "中型",
    "type": "不死",
    "alignment": "中立邪恶",
    "ac": 8,
    "ac_note": "dex",
    "hp": "22 (3d8)",
    "speed": "20 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "immune": [
      "毒"
    ],
    "cond_immune": [
      "中毒"
    ],
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 8}",
    "languages": "understands all languages it spoke in life but can't speak",
    "cr": "1/4",
    "traits": [
      [
        "Undead Fortitude",
        "If damage reduces the zombie to 0 hit points, it must make a Constitution saving throw with a DC of 5+the damage taken, unless the damage is radiant or from a critical hit. On a success, the zombie drops to 1 hit point instead."
      ]
    ],
    "actions": [
      {
        "name": "Slam",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "1d6+1",
        "type": "钝击",
        "extra": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) bludgeoning damage."
      }
    ]
  },
  "异特龙": {
    "en": "Allosaurus",
    "size": "大型",
    "type": "野兽",
    "alignment": "无阵营",
    "ac": 13,
    "ac_note": "natural armor",
    "hp": "51 (6d10 + 18)",
    "speed": "60 ft.",
    "str": 19,
    "dex": 13,
    "con": 17,
    "int": 2,
    "wis": 12,
    "cha": 5,
    "senses": "{'passive_perception': 15}",
    "languages": "—",
    "cr": "2",
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +6, reach 5 ft. 15 (2d10 + 4) Piercing damage."
      },
      {
        "name": "Claws",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +6, reach 5 ft. 8 (1d8 + 4) Slashing damage. If the target is a Large or smaller creature and the allosaurus moved 30+ feet straight toward it immediately before the hit, the target has the Prone condition, and the allosaurus can make one Bite attack against it."
      }
    ]
  },
  "甲龙": {
    "en": "Ankylosaurus",
    "size": "巨型",
    "type": "野兽",
    "alignment": "无阵营",
    "ac": 15,
    "ac_note": "natural armor",
    "hp": "68 (8d12 + 16)",
    "speed": "30 ft.",
    "str": 19,
    "dex": 11,
    "con": 15,
    "int": 2,
    "wis": 12,
    "cha": 5,
    "senses": "{'passive_perception': 11}",
    "languages": "—",
    "cr": "3",
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The ankylosaurus makes two Tail attacks."
      },
      {
        "name": "Tail",
        "atk": 6,
        "reach": "10 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +6, reach 10 ft. 9 (1d10 + 4) Bludgeoning damage. If the target is a Huge or smaller creature, it has the Prone condition."
      }
    ]
  },
  "古巨龟": {
    "en": "Archelon",
    "size": "巨型",
    "type": "野兽",
    "alignment": "无阵营",
    "ac": 17,
    "ac_note": "natural armor",
    "hp": "90 (12d12 + 12)",
    "speed": "20 ft.",
    "str": 18,
    "dex": 16,
    "con": 13,
    "int": 4,
    "wis": 14,
    "cha": 6,
    "senses": "{'passive_perception': 12}",
    "languages": "—",
    "cr": "4",
    "traits": [
      [
        "Amphibious",
        "The archelon can breathe air and water."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +6, reach 5 ft. 14 (3d6 + 4) Piercing damage."
      },
      {
        "name": "Multiattack",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The archelon makes two Bite attacks."
      }
    ]
  },
  "巨蝇": {
    "en": "Giant Fly",
    "size": "大型",
    "type": "野兽",
    "alignment": "无阵营",
    "ac": 11,
    "ac_note": "natural armor",
    "hp": "19 (3d10 + 3)",
    "speed": "30 ft.",
    "str": 14,
    "dex": 13,
    "con": 13,
    "int": 2,
    "wis": 10,
    "cha": 3,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "—",
    "cr": "0",
    "traits": [],
    "actions": []
  },
  "哥布林头目": {
    "en": "Goblin Boss",
    "size": "小型",
    "type": "精类",
    "alignment": "混乱中立",
    "ac": 17,
    "ac_note": "natural armor",
    "hp": "21 (6d6)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 15,
    "con": 10,
    "int": 10,
    "wis": 8,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 9}",
    "languages": "通用语, 哥布林语",
    "cr": "1",
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The goblin makes two attacks, using Scimitar or Shortbow in any combination."
      },
      {
        "name": "Scimitar",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +4, reach 5 ft. 5 (1d6 + 2) Slashing damage, plus 2 (1d4) Slashing damage if the attack roll had Advantage."
      },
      {
        "name": "Shortbow",
        "atk": 4,
        "reach": "80 ft",
        "dmg": "",
        "type": "",
        "extra": "Ranged Attack Roll: +4, range 80/320 ft. 5 (1d6 + 2) Piercing damage, plus 2 (1d4) Piercing damage if the attack roll had Advantage."
      },
      {
        "name": "Nimble Escape",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The goblin takes the Disengage or Hide action."
      },
      {
        "name": "Redirect Attack",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "_Trigger:_ A creature the goblin can see makes an attack roll against it. _Response:_ The goblin chooses a Small or Medium ally within 5 feet of itself. The goblin and that ally swap places, and the ally becomes the target of the attack instead."
      }
    ]
  },
  "卫兵队长": {
    "en": "Guard Captain",
    "size": "小型",
    "type": "类人",
    "alignment": "绝对中立",
    "ac": 18,
    "ac_note": "natural armor",
    "hp": "75 (10d8 + 30)",
    "speed": "30 ft.",
    "str": 18,
    "dex": 14,
    "con": 16,
    "int": 12,
    "wis": 14,
    "cha": 13,
    "senses": "{'passive_perception': 14}",
    "languages": "通用语",
    "cr": "4",
    "traits": [],
    "actions": [
      {
        "name": "Javelin",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee or Ranged Attack Roll: +6, reach 5 ft. or range 30/120 ft. 14 (3d6 + 4) Piercing damage."
      },
      {
        "name": "Longsword",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +6, reach 5 ft. 15 (2d10 + 4) Slashing damage."
      },
      {
        "name": "Multiattack",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The guard makes two attacks, using Javelin or Longsword in any combination."
      }
    ]
  },
  "半龙": {
    "en": "Half-Dragon",
    "size": "中型",
    "type": "龙",
    "alignment": "绝对中立",
    "ac": 18,
    "ac_note": "natural armor",
    "hp": "105 (14d8 + 42)",
    "speed": "40 ft.",
    "str": 19,
    "dex": 14,
    "con": 16,
    "int": 10,
    "wis": 15,
    "cha": 14,
    "senses": "{'黑暗视觉': '60 ft.', '盲视': '10 ft.', 'passive_perception': 15}",
    "languages": "通用语, 龙语",
    "cr": "5",
    "traits": [
      [
        "Draconic Origin",
        "The half-dragon is related to a type of dragon associated with one of the following damage types (DM's choice): Acid, Cold, Fire, Lightning, or Poison. This choice affects other aspects of the stat block."
      ]
    ],
    "actions": [
      {
        "name": "Claw",
        "atk": 7,
        "reach": "10 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +7, reach 10 ft. 6 (1d4 + 4) Slashing damage plus 7 (2d6) damage of the type chosen for the Draconic Origin trait."
      },
      {
        "name": "Dragon's Breath",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "Dexterity Saving Throw: DC 14, each creature in a 30-foot Cone. Failure: 28 (8d6) damage of the type chosen for the Draconic Origin trait. Success: Half damage."
      },
      {
        "name": "Multiattack",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The half-dragon makes two Claw attacks."
      },
      {
        "name": "Leap",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The half-dragon jumps up to 30 feet by spending 10 feet of movement."
      }
    ]
  },
  "河马": {
    "en": "Hippopotamus",
    "size": "大型",
    "type": "野兽",
    "alignment": "无阵营",
    "ac": 14,
    "ac_note": "natural armor",
    "hp": "82 (11d10 + 22)",
    "speed": "30 ft.",
    "str": 21,
    "dex": 7,
    "con": 15,
    "int": 2,
    "wis": 12,
    "cha": 4,
    "senses": "{'passive_perception': 13}",
    "languages": "—",
    "cr": "4",
    "traits": [
      [
        "Hold Breath",
        "The hippopotamus can hold its breath for 10 minutes."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +7, reach 5 ft. 16 (2d10 + 5) Piercing damage."
      },
      {
        "name": "Multiattack",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The hippopotamus makes two Bite attacks."
      }
    ]
  },
  "梦魔": {
    "en": "Incubus",
    "size": "中型",
    "type": "邪魔",
    "alignment": "中立邪恶",
    "ac": 15,
    "ac_note": "natural armor",
    "hp": "66 (12d8 + 12)",
    "speed": "30 ft.",
    "str": 8,
    "dex": 17,
    "con": 13,
    "int": 15,
    "wis": 12,
    "cha": 20,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 15}",
    "languages": "深渊语, 通用语, Infernal;, telepathy, 60, ft.",
    "cr": "4",
    "traits": [
      [
        "Succubus Form",
        "When the incubus finishes a Long Rest, it can shape-shift into a Succubus, using that stat block instead of this one. Any equipment it's wearing or carrying isn't transformed."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The incubus makes two Restless Touch attacks."
      },
      {
        "name": "Restless Touch",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +7, reach 5 ft. 15 (3d6 + 5) Psychic damage, and the target is cursed for 24 hours or until the incubus dies. Until the curse ends, the target gains no benefit from finishing Short Rests."
      },
      {
        "name": "Spellcasting",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The incubus casts one of the following spells, requiring no Material components and using Charisma as the spellcasting ability (spell save DC 15):\n\n- **At Will:** Disguise Self, Etherealness\n- **1/Day Each:** Dream, Hypnotic Pattern"
      },
      {
        "name": "Nightmare",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "Wisdom Saving Throw: DC 15, one creature the incubus can see within 60 feet. Failure: If the target has 20 Hit Points or fewer, it has the Unconscious condition for 1 hour, until it takes damage, or until a creature within 5 feet of it takes an action to wake it. Otherwise, the target takes 18 (4d8) Psychic damage."
      }
    ]
  },
  "巴弗灭牛头人": {
    "en": "Minotaur of Baphomet",
    "size": "大型",
    "type": "怪兽",
    "alignment": "混乱邪恶",
    "ac": 14,
    "ac_note": "natural armor",
    "hp": "85 (10d10 + 30)",
    "speed": "40 ft.",
    "str": 18,
    "dex": 11,
    "con": 16,
    "int": 6,
    "wis": 16,
    "cha": 9,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 17}",
    "languages": "深渊语",
    "cr": "3",
    "traits": [],
    "actions": [
      {
        "name": "Abyssal Glaive",
        "atk": 6,
        "reach": "10 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +6, reach 10 ft. 10 (1d12 + 4) Slashing damage plus 10 (3d6) Necrotic damage."
      },
      {
        "name": "Gore",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +6, reach 5 ft. 18 (4d6 + 4) Piercing damage. If the target is a Large or smaller creature and the minotaur moved 10+ feet straight toward it immediately before the hit, the target takes an extra 10 (3d6) Piercing damage and has the Prone condition."
      }
    ]
  },
  "海盗船长": {
    "en": "Pirate Captain",
    "size": "小型",
    "type": "类人",
    "alignment": "绝对中立",
    "ac": 17,
    "ac_note": "natural armor",
    "hp": "84 (13d8 + 26)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 18,
    "con": 14,
    "int": 10,
    "wis": 14,
    "cha": 17,
    "senses": "{'passive_perception': 15}",
    "languages": "通用语, plus, one, other, language",
    "cr": "6",
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The pirate makes three attacks, using Rapier or Pistol in any combination."
      },
      {
        "name": "Pistol",
        "atk": 7,
        "reach": "30 ft",
        "dmg": "",
        "type": "",
        "extra": "Ranged Attack Roll: +7, range 30/90 ft. 15 (2d10 + 4) Piercing damage."
      },
      {
        "name": "Rapier",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +7, reach 5 ft. 13 (2d8 + 4) Piercing damage, and the pirate has Advantage on the next attack roll it makes before the end of this turn."
      },
      {
        "name": "Captain's Charm",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "Wisdom Saving Throw: DC 14, one creature the pirate can see within 30 feet. Failure: The target has the Charmed condition until the start of the pirate's next turn."
      },
      {
        "name": "Riposte",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "_Trigger:_ The pirate is hit by a melee attack roll while holding a weapon. _Response:_ The pirate adds 3 to its AC against that attack, possibly causing it to miss. On a miss, the pirate makes one Rapier attack against the triggering creature if within range."
      }
    ]
  },
  "侍祭": {
    "en": "Priest Acolyte",
    "size": "小型",
    "type": "类人",
    "alignment": "绝对中立",
    "ac": 13,
    "ac_note": "natural armor",
    "hp": "11 (2d8 + 2)",
    "speed": "30 ft.",
    "str": 14,
    "dex": 10,
    "con": 12,
    "int": 10,
    "wis": 14,
    "cha": 11,
    "senses": "{'passive_perception': 12}",
    "languages": "通用语",
    "cr": "1/4",
    "traits": [],
    "actions": [
      {
        "name": "Mace",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +4, reach 5 ft. 5 (1d6 + 2) Bludgeoning damage plus 2 (1d4) Radiant damage."
      },
      {
        "name": "Radiant Flame",
        "atk": 4,
        "reach": "60 ft",
        "dmg": "",
        "type": "",
        "extra": "Ranged Attack Roll: +4, range 60 ft. 7 (2d6) Radiant damage."
      },
      {
        "name": "Spellcasting",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The priest casts one of the following spells, using Wisdom as the spellcasting ability:\n\n- **At Will:** Light, Thaumaturgy"
      },
      {
        "name": "Divine Aid",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The priest casts Bless, Healing Word, or Sanctuary, using the same spellcasting ability as Spellcasting."
      }
    ]
  },
  "无齿翼龙": {
    "en": "Pteranodon",
    "size": "中型",
    "type": "野兽",
    "alignment": "无阵营",
    "ac": 13,
    "ac_note": "natural armor",
    "hp": "13 (3d8)",
    "speed": "10 ft.",
    "str": 12,
    "dex": 15,
    "con": 10,
    "int": 2,
    "wis": 9,
    "cha": 5,
    "senses": "{'passive_perception': 11}",
    "languages": "—",
    "cr": "1/4",
    "traits": [
      [
        "Flyby",
        "The pteranodon doesn't provoke an Opportunity Attack when it flies out of an enemy's reach."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +4, reach 5 ft. 6 (1d8 + 2) Piercing damage."
      }
    ]
  },
  "博学斯芬克斯": {
    "en": "Sphinx of Lore",
    "size": "大型",
    "type": "天界生物",
    "alignment": "守序中立",
    "ac": 17,
    "ac_note": "natural armor",
    "hp": "170 (20d10 + 60)",
    "speed": "40 ft.",
    "str": 18,
    "dex": 15,
    "con": 16,
    "int": 18,
    "wis": 18,
    "cha": 18,
    "senses": "{'真视': '120 ft.', 'passive_perception': 18}",
    "languages": "天界语, 通用语",
    "cr": "11",
    "traits": [
      [
        "Inscrutable",
        "No magic can observe the sphinx remotely or detect its thoughts without its permission. Wisdom (Insight) checks made to ascertain its intentions or sincerity are made with Disadvantage."
      ],
      [
        "Legendary Resistance (3/Day, or 4/Day in Lair)",
        "If the sphinx fails a saving throw, it can choose to succeed instead."
      ]
    ],
    "actions": [
      {
        "name": "Arcane Prowl",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The sphinx can teleport up to 30 feet to an unoccupied space it can see, and it makes one Claw attack."
      },
      {
        "name": "Claw",
        "atk": 8,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +8, reach 5 ft. 14 (3d6 + 4) Slashing damage."
      },
      {
        "name": "Mind-Rending Roar",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "Wisdom Saving Throw: DC 16, each enemy in a 300-foot Emanation originating from the sphinx. Failure: 35 (10d6) Psychic damage, and the target has the Incapacitated condition until the start of the sphinx's next turn."
      },
      {
        "name": "Multiattack",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The sphinx makes three Claw attacks."
      },
      {
        "name": "Spellcasting",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The sphinx casts one of the following spells, requiring no Material components and using Intelligence as the spellcasting ability (spell save DC 16):\n\n- **At Will:** Detect Magic, Identify, Mage Hand, Minor Illusion, Prestidigitation\n- **1/Day Each:** Dispel Magic, Legend Lore, Locate Object, Plane Shift, Remove Curse, Tongues"
      },
      {
        "name": "Weight of Years",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "Constitution Saving Throw: DC 16, one creature the sphinx can see within 120 feet. Failure: The target gains 1 Exhaustion level. While the target has any Exhaustion levels, it appears 3d10 years older. Failure or Success: The sphinx can't take this action again until the start of its next turn."
      }
    ]
  },
  "勇武斯芬克斯": {
    "en": "Sphinx of Valor",
    "size": "大型",
    "type": "天界生物",
    "alignment": "守序中立",
    "ac": 17,
    "ac_note": "natural armor",
    "hp": "199 (19d10 + 95)",
    "speed": "40 ft.",
    "str": 22,
    "dex": 10,
    "con": 20,
    "int": 16,
    "wis": 23,
    "cha": 18,
    "senses": "{'真视': '120 ft.', 'passive_perception': 22}",
    "languages": "天界语, 通用语",
    "cr": "17",
    "traits": [
      [
        "Inscrutable",
        "No magic can observe the sphinx remotely or detect its thoughts without its permission. Wisdom (Insight) checks made to ascertain its intentions or sincerity are made with Disadvantage."
      ],
      [
        "Legendary Resistance (3/Day, or 4/Day in Lair)",
        "If the sphinx fails a saving throw, it can choose to succeed instead."
      ]
    ],
    "actions": [
      {
        "name": "Arcane Prowl",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The sphinx can teleport up to 30 feet to an unoccupied space it can see, and it makes one Claw attack."
      },
      {
        "name": "Claw",
        "atk": 12,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +12, reach 5 ft. 20 (4d6 + 6) Slashing damage."
      },
      {
        "name": "Multiattack",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The sphinx makes two Claw attacks and uses Roar."
      },
      {
        "name": "Roar",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The sphinx emits a magical roar. Whenever it roars, the roar has a different effect, as detailed below (the sequence resets when it takes a Long Rest): - First Roar: Wisdom Saving Throw: DC 20, each enemy in a 500-foot Emanation originating from the sphinx. Failure: The target has the Frightened condition for 1 minute. - Second Roar: Wisdom Saving Throw: DC 20, each enemy in a 500-foot Emanation originating from the sphinx. Failure: The target has the Paralyzed condition, and it repeats the save at the end of each of its turns, ending the effect on itself on a success. After 1 minute, it succeeds automatically. - Third Roar: Constitution Saving Throw: DC 20, each enemy in a 500-foot Emanation originating from the sphinx. Failure: 44 (8d10) Thunder damage, and the target has the Prone condition. Success: Half damage only."
      },
      {
        "name": "Spellcasting",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The sphinx casts one of the following spells, requiring no Material components and using Wisdom as the spellcasting ability (spell save DC 20):\n\n- **At Will:** Detect Evil and Good, Thaumaturgy\n- **1/Day Each:** Detect Magic, Dispel Magic, Greater Restoration, Heroes' Feast, Zone of Truth"
      },
      {
        "name": "Weight of Years",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "Constitution Saving Throw: DC 16, one creature the sphinx can see within 120 feet. Failure: The target gains 1 Exhaustion level. While the target has any Exhaustion levels, it appears 3d10 years older. Failure or Success: The sphinx can't take this action again until the start of its next turn."
      }
    ]
  },
  "奇异斯芬克斯": {
    "en": "Sphinx of Wonder",
    "size": "小型",
    "type": "天界生物",
    "alignment": "守序善良",
    "ac": 13,
    "ac_note": "natural armor",
    "hp": "24 (7d4 + 7)",
    "speed": "20 ft.",
    "str": 6,
    "dex": 17,
    "con": 13,
    "int": 15,
    "wis": 12,
    "cha": 11,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 11}",
    "languages": "天界语, 通用语",
    "cr": "1",
    "traits": [
      [
        "Magic Resistance",
        "The sphinx has Advantage on saving throws against spells and other magical effects."
      ]
    ],
    "actions": [
      {
        "name": "Rend",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +5, reach 5 ft. 5 (1d4 + 3) Slashing damage plus 7 (2d6) Radiant damage."
      },
      {
        "name": "Burst of Ingenuity",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "_Trigger:_ The sphinx or another creature within 30 feet makes an ability check or a saving throw. _Response:_ The sphinx adds 2 to the roll."
      }
    ]
  },
  "爬爪群": {
    "en": "Swarm of Crawling Claws",
    "size": "中型",
    "type": "亡灵",
    "alignment": "中立邪恶",
    "ac": 12,
    "ac_note": "natural armor",
    "hp": "49 (11d8)",
    "speed": "30 ft.",
    "str": 14,
    "dex": 14,
    "con": 11,
    "int": 5,
    "wis": 10,
    "cha": 4,
    "senses": "{'盲视': '30 ft.', 'passive_perception': 10}",
    "languages": "Understands, 通用语, but, can't, speak",
    "cr": "3",
    "traits": [
      [
        "Swarm",
        "The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny creature. The swarm can't regain Hit Points or gain Temporary Hit Points."
      ]
    ],
    "actions": [
      {
        "name": "Swarm of Grasping Hands",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +4, reach 5 ft. 20 (4d8 + 2) Necrotic damage, or 11 (2d8 + 2) Necrotic damage if the swarm is Bloodied. If the target is a Medium or smaller creature, it has the Prone condition."
      }
    ]
  },
  "巨魔残肢": {
    "en": "Troll Limb",
    "size": "小型",
    "type": "巨人",
    "alignment": "混乱邪恶",
    "ac": 13,
    "ac_note": "natural armor",
    "hp": "14 (4d6)",
    "speed": "20 ft.",
    "str": 18,
    "dex": 12,
    "con": 10,
    "int": 1,
    "wis": 9,
    "cha": 1,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 9}",
    "languages": "—",
    "cr": "1/2",
    "traits": [
      [
        "Regeneration",
        "The limb regains 5 Hit Points at the start of each of its turns. If the limb takes Acid or Fire damage, this trait doesn't function on the limb's next turn. The limb dies only if it starts its turn with 0 Hit Points and doesn't regenerate."
      ],
      [
        "Troll Spawn",
        "The limb uncannily has the same senses as a whole troll. If the limb isn't destroyed within 24 hours, roll 1d12. On a 12, the limb turns into a Troll. Otherwise, the limb withers away."
      ]
    ],
    "actions": [
      {
        "name": "Rend",
        "atk": 6,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +6, reach 5 ft. 9 (2d4 + 4) Slashing damage."
      }
    ]
  },
  "吸血鬼": {
    "en": "Vampire",
    "size": "小型",
    "type": "亡灵",
    "alignment": "守序邪恶",
    "ac": 16,
    "ac_note": "natural armor",
    "hp": "195 (23d8 + 92)",
    "speed": "40 ft.",
    "str": 18,
    "dex": 18,
    "con": 18,
    "int": 17,
    "wis": 15,
    "cha": 18,
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 17}",
    "languages": "通用语, plus, two, other, languages",
    "cr": "13",
    "traits": [
      [
        "Legendary Resistance (3/Day, or 4/Day in Lair)",
        "If the vampire fails a saving throw, it can choose to succeed instead."
      ],
      [
        "Misty Escape",
        "If the vampire drops to 0 Hit Points outside its resting place, the vampire uses Shape-Shift to become mist (no action required). If it can't use Shape-Shift, it is destroyed. While it has 0 Hit Points in mist form, it can't return to its vampire form, and it must reach its resting place within 2 hours or be destroyed. Once in its resting place, it returns to its vampire form and has the Paralyzed condition until it regains any Hit Points, and it regains 1 Hit Point after spending 1 hour there."
      ],
      [
        "Spider Climb",
        "The vampire can climb difficult surfaces, including along ceilings, without needing to make an ability check."
      ],
      [
        "Vampire Weakness",
        "The vampire has these weaknesses:\n\n- **Forbiddance:** The vampire can't enter a residence without an invitation from an occupant.\n- **Running Water:** The vampire takes 20 Acid damage if it ends its turn in running water.\n- **Stake to the Heart:** If a weapon that deals Piercing damage is driven into the vampire's heart while the vampire has the Incapacitated condition in its resting place, the vampire has the Paralyzed condition until the weapon is removed.\n- **Sunlight:** The vampire takes 20 Radiant damage if it starts its turn in sunlight. While in sunlight, it has Disadvantage on attack rolls and ability checks."
      ]
    ],
    "actions": [
      {
        "name": "Beguile",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The vampire casts Command, requiring no spell components and using Charisma as the spellcasting ability (spell save DC 17). The vampire can't take this action again until the start of its next turn."
      },
      {
        "name": "Bite",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "Constitution Saving Throw: DC 17, one creature within 5 feet that is willing or that has the Grappled, Incapacitated, or Restrained condition. Failure: 6 (1d4 + 4) Piercing damage plus 13 (3d8) Necrotic damage. The target's Hit Point maximum decreases by an amount equal to the Necrotic damage taken, and the vampire regains Hit Points equal to that amount. A Humanoid reduced to 0 Hit Points by this damage and then buried rises the following sunset as a Vampire Spawn under the vampire's control."
      },
      {
        "name": "Deathless Strike",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The vampire moves up to half its Speed, and it makes one Grave Strike attack."
      },
      {
        "name": "Grave Strike",
        "atk": 9,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +9, reach 5 ft. 8 (1d8 + 4) Bludgeoning damage plus 7 (2d6) Necrotic damage. If the target is a Large or smaller creature, it has the Grappled condition (escape DC 14) from one of two hands."
      },
      {
        "name": "Multiattack",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The vampire makes two Grave Strike attacks and uses Bite."
      },
      {
        "name": "Shape-Shift",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "If the vampire isn't in sunlight or running water, it shape-shifts into a Tiny bat (Speed 5 ft., Fly Speed 30 ft.) or a Medium cloud of mist (Speed 5 ft., Fly Speed 20 ft. [hover]), or it returns to its vampire form. Anything it is wearing transforms with it. While in bat form, the vampire can't speak. Its game statistics, other than its size and Speed, are unchanged. While in mist form, the vampire can't take any actions, speak, or manipulate objects. It is weightless and can enter an enemy's space and stop there. If air can pass through a space, the mist can do so, but it can't pass through liquid. It has Resistance to all damage, except the damage it takes from sunlight."
      },
      {
        "name": "Charm",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The vampire casts Charm Person, requiring no spell components and using Charisma as the spellcasting ability (spell save DC 17), and the duration is 24 hours. The Charmed target is a willing recipient of the vampire's Bite, the damage of which doesn't end the spell. When the spell ends, the target is unaware it was Charmed by the vampire."
      }
    ]
  },
  "吸血仆役": {
    "en": "Vampire Familiar",
    "size": "小型",
    "type": "类人",
    "alignment": "中立邪恶",
    "ac": 15,
    "ac_note": "natural armor",
    "hp": "65 (10d8 + 20)",
    "speed": "30 ft.",
    "str": 17,
    "dex": 16,
    "con": 15,
    "int": 10,
    "wis": 10,
    "cha": 14,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 14}",
    "languages": "通用语, plus, one, other, language",
    "cr": "3",
    "traits": [
      [
        "Vampiric Connection",
        "While the familiar and its vampire master are on the same plane of existence, the vampire can communicate with the familiar telepathically, and the vampire can perceive through the familiar's senses."
      ]
    ],
    "actions": [
      {
        "name": "Multiattack",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The familiar makes two Umbral Dagger attacks."
      },
      {
        "name": "Umbral Dagger",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee or Ranged Attack Roll: +5, reach 5 ft. or range 20/60 ft. 5 (1d4 + 3) Piercing damage plus 7 (3d4) Necrotic damage. If the target is reduced to 0 Hit Points by this attack, the target becomes Stable but has the Poisoned condition for 1 hour. While it has the Poisoned condition, the target has the Paralyzed condition."
      },
      {
        "name": "Deathless Agility",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The familiar takes the Dash or Disengage action."
      }
    ]
  },
  "火矮人哨卫": {
    "en": "Azer Sentinel",
    "size": "中型",
    "type": "元素",
    "alignment": "守序中立",
    "ac": 17,
    "ac_note": "natural armor",
    "hp": "39 (6d8 + 12)",
    "speed": "30 ft.",
    "str": 17,
    "dex": 12,
    "con": 15,
    "int": 12,
    "wis": 13,
    "cha": 10,
    "senses": "{'passive_perception': 11}",
    "languages": "原初语, (Ignan)",
    "cr": "2",
    "traits": [
      [
        "Fire Aura",
        "At the end of each of the azer's turns, each creature of the azer's choice in a 5-foot Emanation originating from the azer takes 5 (1d10) Fire damage unless the azer has the Incapacitated condition."
      ],
      [
        "Illumination",
        "The azer sheds Bright Light in a 10-foot radius and Dim Light for an additional 10 feet."
      ]
    ],
    "actions": [
      {
        "name": "Burning Hammer",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +5, reach 5 ft. 8 (1d10 + 3) Bludgeoning damage plus 3 (1d6) Fire damage."
      }
    ]
  },
  "熊地精潜伏者": {
    "en": "Bugbear Stalker",
    "size": "中型",
    "type": "精类",
    "alignment": "混乱邪恶",
    "ac": 15,
    "ac_note": "natural armor",
    "hp": "65 (10d8 + 20)",
    "speed": "30 ft.",
    "str": 17,
    "dex": 14,
    "con": 14,
    "int": 11,
    "wis": 12,
    "cha": 11,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 11}",
    "languages": "通用语, 哥布林语",
    "cr": "3",
    "traits": [
      [
        "Abduct",
        "The bugbear needn't spend extra movement to move a creature it is grappling."
      ]
    ],
    "actions": [
      {
        "name": "Javelin",
        "atk": 5,
        "reach": "10 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee or Ranged Attack Roll: +5, reach 10 ft. or range 30/120 ft. 13 (3d6 + 3) Piercing damage."
      },
      {
        "name": "Morningstar",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +5 (with Advantage if the target is Grappled by the bugbear), reach 10 ft. 12 (2d8 + 3) Piercing damage."
      },
      {
        "name": "Multiattack",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The bugbear makes two Javelin or Morningstar attacks."
      },
      {
        "name": "Quick Grapple",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "Dexterity Saving Throw: DC 13, one Medium or smaller creature the bugbear can see within 10 feet. Failure: The target has the Grappled condition (escape DC 13)."
      }
    ]
  },
  "熊地精战士": {
    "en": "Bugbear Warrior",
    "size": "中型",
    "type": "精类",
    "alignment": "混乱邪恶",
    "ac": 14,
    "ac_note": "natural armor",
    "hp": "33 (6d8 + 6)",
    "speed": "30 ft.",
    "str": 15,
    "dex": 14,
    "con": 13,
    "int": 8,
    "wis": 11,
    "cha": 9,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "通用语, 哥布林语",
    "cr": "1",
    "traits": [
      [
        "Abduct",
        "The bugbear needn't spend extra movement to move a creature it is grappling."
      ]
    ],
    "actions": [
      {
        "name": "Grab",
        "atk": 4,
        "reach": "10 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +4, reach 10 ft. 9 (2d6 + 2) Bludgeoning damage. If the target is a Medium or smaller creature, it has the Grappled condition (escape DC 12)."
      },
      {
        "name": "Light Hammer",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "Melee or Ranged Attack Roll: +4 (with Advantage if the target is Grappled by the bugbear), reach 10 ft. or range 20/60 ft. 9 (3d4 + 2) Bludgeoning damage."
      }
    ]
  },
  "半人马骑兵": {
    "en": "Centaur Trooper",
    "size": "大型",
    "type": "精类",
    "alignment": "中立善良",
    "ac": 16,
    "ac_note": "natural armor",
    "hp": "45 (6d10 + 12)",
    "speed": "50 ft.",
    "str": 18,
    "dex": 14,
    "con": 14,
    "int": 9,
    "wis": 13,
    "cha": 11,
    "senses": "{'passive_perception': 13}",
    "languages": "精灵语, 森精语",
    "cr": "2",
    "traits": [],
    "actions": [
      {
        "name": "Longbow",
        "atk": 4,
        "reach": "150 ft",
        "dmg": "",
        "type": "",
        "extra": "Ranged Attack Roll: +4, range 150/600 ft. 6 (1d8 + 2) Piercing damage."
      },
      {
        "name": "Multiattack",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The centaur makes two attacks, using Pike or Longbow in any combination."
      },
      {
        "name": "Pike",
        "atk": 6,
        "reach": "10 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +6, reach 10 ft. 9 (1d10 + 4) Piercing damage."
      },
      {
        "name": "Trampling Charge",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The centaur moves up to its Speed without provoking Opportunity Attacks and can move through the spaces of Medium or smaller creatures. Each creature whose space the centaur enters is targeted once by the following effect. Strength Saving Throw: DC 14. Failure: 7 (1d6 + 4) Bludgeoning damage, and the target has the Prone condition."
      }
    ]
  },
  "狂热教徒": {
    "en": "Cultist Fanatic",
    "size": "小型",
    "type": "类人",
    "alignment": "绝对中立",
    "ac": 13,
    "ac_note": "natural armor",
    "hp": "44 (8d8 + 8)",
    "speed": "30 ft.",
    "str": 11,
    "dex": 14,
    "con": 12,
    "int": 10,
    "wis": 14,
    "cha": 13,
    "senses": "{'passive_perception': 12}",
    "languages": "通用语",
    "cr": "2",
    "traits": [],
    "actions": [
      {
        "name": "Pact Blade",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +4, reach 5 ft. 6 (1d8 + 2) Slashing damage plus 7 (2d6) Necrotic damage."
      },
      {
        "name": "Spellcasting",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The cultist casts one of the following spells, using Wisdom as the spellcasting ability (spell save DC 12, +4 to hit with spell attacks):\n\n- **At Will:** Light, Thaumaturgy\n- **1/Day Each:** Hold Person\n- **2/Day Each:** Command"
      },
      {
        "name": "Spiritual Weapon",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The cultist casts the Spiritual Weapon spell, using the same spellcasting ability as Spellcasting."
      }
    ]
  },
  "豺狼人战士": {
    "en": "Gnoll Warrior",
    "size": "中型",
    "type": "邪魔",
    "alignment": "混乱邪恶",
    "ac": 15,
    "ac_note": "natural armor",
    "hp": "27 (6d8)",
    "speed": "30 ft.",
    "str": 14,
    "dex": 12,
    "con": 11,
    "int": 6,
    "wis": 10,
    "cha": 7,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "Gnoll",
    "cr": "1/2",
    "traits": [],
    "actions": [
      {
        "name": "Bone Bow",
        "atk": 3,
        "reach": "150 ft",
        "dmg": "",
        "type": "",
        "extra": "Ranged Attack Roll: +3, range 150/600 ft. 6 (1d10 + 1) Piercing damage."
      },
      {
        "name": "Rend",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +4, reach 5 ft. 5 (1d6 + 2) Piercing damage."
      },
      {
        "name": "Rampage",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "Immediately after dealing damage to a creature that is already Bloodied, the gnoll moves up to half its Speed, and it makes one Rend attack."
      }
    ]
  },
  "哥布林爪牙": {
    "en": "Goblin Minion",
    "size": "小型",
    "type": "精类",
    "alignment": "混乱中立",
    "ac": 12,
    "ac_note": "natural armor",
    "hp": "7 (2d6)",
    "speed": "30 ft.",
    "str": 8,
    "dex": 15,
    "con": 10,
    "int": 10,
    "wis": 8,
    "cha": 8,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 9}",
    "languages": "通用语, 哥布林语",
    "cr": "1/8",
    "traits": [],
    "actions": [
      {
        "name": "Dagger",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee or Ranged Attack Roll: +4, reach 5 ft. or range 20/60 ft. 4 (1d4 + 2) Piercing damage."
      },
      {
        "name": "Nimble Escape",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The goblin takes the Disengage or Hide action."
      }
    ]
  },
  "哥布林战士": {
    "en": "Goblin Warrior",
    "size": "小型",
    "type": "精类",
    "alignment": "混乱中立",
    "ac": 15,
    "ac_note": "natural armor",
    "hp": "10 (3d6)",
    "speed": "30 ft.",
    "str": 8,
    "dex": 15,
    "con": 10,
    "int": 10,
    "wis": 8,
    "cha": 8,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 9}",
    "languages": "通用语, 哥布林语",
    "cr": "1/4",
    "traits": [],
    "actions": [
      {
        "name": "Scimitar",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +4, reach 5 ft. 5 (1d6 + 2) Slashing damage, plus 2 (1d4) Slashing damage if the attack roll had Advantage."
      },
      {
        "name": "Shortbow",
        "atk": 4,
        "reach": "80 ft",
        "dmg": "",
        "type": "",
        "extra": "Ranged Attack Roll: +4, range 80/320 ft. 5 (1d6 + 2) Piercing damage, plus 2 (1d4) Piercing damage if the attack roll had Advantage."
      },
      {
        "name": "Nimble Escape",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The goblin takes the Disengage or Hide action."
      }
    ]
  },
  "大地精队长": {
    "en": "Hobgoblin Captain",
    "size": "中型",
    "type": "精类",
    "alignment": "守序邪恶",
    "ac": 17,
    "ac_note": "natural armor",
    "hp": "58 (9d8 + 18)",
    "speed": "30 ft.",
    "str": 15,
    "dex": 14,
    "con": 14,
    "int": 12,
    "wis": 10,
    "cha": 13,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "通用语, 哥布林语",
    "cr": "3",
    "traits": [
      [
        "Aura of Authority",
        "While in a 10-foot Emanation originating from the hobgoblin, the hobgoblin and its allies have Advantage on attack rolls and saving throws, provided the hobgoblin doesn't have the Incapacitated condition."
      ]
    ],
    "actions": [
      {
        "name": "Greatsword",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +4, reach 5 ft. 9 (2d6 + 2) Slashing damage plus 3 (1d6) Poison damage."
      },
      {
        "name": "Longbow",
        "atk": 4,
        "reach": "150 ft",
        "dmg": "",
        "type": "",
        "extra": "Ranged Attack Roll: +4, range 150/600 ft. 6 (1d8 + 2) Piercing damage plus 5 (2d4) Poison damage."
      },
      {
        "name": "Multiattack",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The hobgoblin makes two attacks, using Greatsword or Longbow in any combination."
      }
    ]
  },
  "大地精战士": {
    "en": "Hobgoblin Warrior",
    "size": "中型",
    "type": "精类",
    "alignment": "守序邪恶",
    "ac": 18,
    "ac_note": "natural armor",
    "hp": "11 (2d8 + 2)",
    "speed": "30 ft.",
    "str": 13,
    "dex": 12,
    "con": 12,
    "int": 10,
    "wis": 10,
    "cha": 9,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 10}",
    "languages": "通用语, 哥布林语",
    "cr": "1/2",
    "traits": [
      [
        "Pack Tactics",
        "The hobgoblin has Advantage on an attack roll against a creature if at least one of the hobgoblin's allies is within 5 feet of the creature and the ally doesn't have the Incapacitated condition."
      ]
    ],
    "actions": [
      {
        "name": "Longbow",
        "atk": 3,
        "reach": "150 ft",
        "dmg": "",
        "type": "",
        "extra": "Ranged Attack Roll: +3, range 150/600 ft. 5 (1d8 + 1) Piercing damage plus 7 (3d4) Poison damage."
      },
      {
        "name": "Longsword",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +3, reach 5 ft. 12 (2d10 + 1) Slashing damage."
      }
    ]
  },
  "狗头人战士": {
    "en": "Kobold Warrior",
    "size": "小型",
    "type": "龙",
    "alignment": "绝对中立",
    "ac": 14,
    "ac_note": "natural armor",
    "hp": "7 (3d6 - 3)",
    "speed": "30 ft.",
    "str": 7,
    "dex": 15,
    "con": 9,
    "int": 8,
    "wis": 7,
    "cha": 8,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 8}",
    "languages": "通用语, 龙语",
    "cr": "1/8",
    "traits": [
      [
        "Pack Tactics",
        "The kobold has Advantage on an attack roll against a creature if at least one of the kobold's allies is within 5 feet of the creature and the ally doesn't have the Incapacitated condition."
      ],
      [
        "Sunlight Sensitivity",
        "While in sunlight, the kobold has Disadvantage on ability checks and attack rolls."
      ]
    ],
    "actions": [
      {
        "name": "Dagger",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee or Ranged Attack Roll: +4, reach 5 ft. or range 20/60 ft. 4 (1d4 + 2) Piercing damage."
      }
    ]
  },
  "人鱼游击手": {
    "en": "Merfolk Skirmisher",
    "size": "中型",
    "type": "元素",
    "alignment": "绝对中立",
    "ac": 11,
    "ac_note": "natural armor",
    "hp": "11 (2d8 + 2)",
    "speed": "10 ft.",
    "str": 10,
    "dex": 13,
    "con": 12,
    "int": 11,
    "wis": 14,
    "cha": 12,
    "senses": "{'passive_perception': 12}",
    "languages": "通用语, 原初语, (Aquan)",
    "cr": "1/8",
    "traits": [
      [
        "Amphibious",
        "The merfolk can breathe air and water."
      ]
    ],
    "actions": [
      {
        "name": "Ocean Spear",
        "atk": 2,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee or Ranged Attack Roll: +2, reach 5 ft. or range 20/60 ft. 3 (1d6) Piercing damage plus 2 (1d4) Cold damage. If the target is a creature, its Speed decreases by 10 feet until the end of its next turn. HitomThe spear magically returns to the merfolk's hand immediately after a ranged attack."
      }
    ]
  },
  "海盗": {
    "en": "Pirate",
    "size": "小型",
    "type": "类人",
    "alignment": "绝对中立",
    "ac": 14,
    "ac_note": "natural armor",
    "hp": "33 (6d8 + 6)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 16,
    "con": 12,
    "int": 8,
    "wis": 12,
    "cha": 14,
    "senses": "{'passive_perception': 11}",
    "languages": "通用语, plus, one, other, language",
    "cr": "1",
    "traits": [],
    "actions": [
      {
        "name": "Dagger",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee or Ranged Attack Roll: +5, reach 5 ft. or range 20/60 ft. 5 (1d4 + 3) Piercing damage."
      },
      {
        "name": "Enthralling Panache",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "Wisdom Saving Throw: DC 12, one creature the pirate can see within 30 feet. Failure: The target has the Charmed condition until the start of the pirate's next turn."
      },
      {
        "name": "Multiattack",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The pirate makes two Dagger attacks. It can replace one attack with a use of Enthralling Panache."
      }
    ]
  },
  "鲨华鱼人战士": {
    "en": "Sahuagin Warrior",
    "size": "中型",
    "type": "邪魔",
    "alignment": "守序邪恶",
    "ac": 12,
    "ac_note": "natural armor",
    "hp": "22 (4d8 + 4)",
    "speed": "30 ft.",
    "str": 13,
    "dex": 11,
    "con": 12,
    "int": 12,
    "wis": 13,
    "cha": 9,
    "senses": "{'黑暗视觉': '120 ft.', 'passive_perception': 15}",
    "languages": "Sahuagin",
    "cr": "1/2",
    "traits": [
      [
        "Blood Frenzy",
        "The sahuagin has Advantage on attack rolls against any creature that doesn't have all its Hit Points."
      ],
      [
        "Limited Amphibiousness",
        "The sahuagin can breathe air and water, but it must be submerged at least once every 4 hours to avoid suffocating outside water."
      ],
      [
        "Shark Telepathy",
        "The sahuagin can magically control sharks within 120 feet of itself, using a special telepathy."
      ]
    ],
    "actions": [
      {
        "name": "Claw",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +3, reach 5 ft. 4 (1d6 + 1) Slashing damage."
      },
      {
        "name": "Multiattack",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The sahuagin makes two Claw attacks."
      },
      {
        "name": "Aquatic Charge",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The sahuagin swims up to its Swim Speed straight toward an enemy it can see."
      }
    ]
  },
  "打手": {
    "en": "Tough",
    "size": "小型",
    "type": "类人",
    "alignment": "绝对中立",
    "ac": 12,
    "ac_note": "natural armor",
    "hp": "32 (5d8 + 10)",
    "speed": "30 ft.",
    "str": 15,
    "dex": 12,
    "con": 14,
    "int": 10,
    "wis": 10,
    "cha": 11,
    "senses": "{'passive_perception': 10}",
    "languages": "通用语",
    "cr": "1/2",
    "traits": [
      [
        "Pack Tactics",
        "The tough has Advantage on an attack roll against a creature if at least one of the tough's allies is within 5 feet of the creature and the ally doesn't have the Incapacitated condition."
      ]
    ],
    "actions": [
      {
        "name": "Heavy Crossbow",
        "atk": 3,
        "reach": "100 ft",
        "dmg": "",
        "type": "",
        "extra": "Ranged Attack Roll: +3, range 100/400 ft. 6 (1d10 + 1) Piercing damage."
      },
      {
        "name": "Mace",
        "atk": 4,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +4, reach 5 ft. 5 (1d6 + 2) Bludgeoning damage."
      }
    ]
  },
  "打手头目": {
    "en": "Tough Boss",
    "size": "小型",
    "type": "类人",
    "alignment": "绝对中立",
    "ac": 16,
    "ac_note": "natural armor",
    "hp": "82 (11d8 + 33)",
    "speed": "30 ft.",
    "str": 17,
    "dex": 14,
    "con": 16,
    "int": 11,
    "wis": 10,
    "cha": 11,
    "senses": "{'passive_perception': 10}",
    "languages": "通用语, plus, one, other, language",
    "cr": "4",
    "traits": [
      [
        "Pack Tactics",
        "The tough has Advantage on an attack roll against a creature if at least one of the tough's allies is within 5 feet of the creature and the ally doesn't have the Incapacitated condition."
      ]
    ],
    "actions": [
      {
        "name": "Heavy Crossbow",
        "atk": 4,
        "reach": "100 ft",
        "dmg": "",
        "type": "",
        "extra": "Ranged Attack Roll: +4, range 100/400 ft. 13 (2d10 + 2) Piercing damage."
      },
      {
        "name": "Multiattack",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The tough makes two attacks, using Warhammer or Heavy Crossbow in any combination."
      },
      {
        "name": "Warhammer",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +5, reach 5 ft. 12 (2d8 + 3) Bludgeoning damage. If the target is a Large or smaller creature, the tough pushes the target up to 10 feet straight away from itself."
      }
    ]
  },
  "战士步兵": {
    "en": "Warrior Infantry",
    "size": "小型",
    "type": "类人",
    "alignment": "绝对中立",
    "ac": 13,
    "ac_note": "natural armor",
    "hp": "9 (2d8)",
    "speed": "30 ft.",
    "str": 13,
    "dex": 11,
    "con": 11,
    "int": 8,
    "wis": 11,
    "cha": 8,
    "senses": "{'passive_perception': 10}",
    "languages": "通用语",
    "cr": "1/8",
    "traits": [
      [
        "Pack Tactics",
        "The warrior has Advantage on an attack roll against a creature if at least one of the warrior's allies is within 5 feet of the creature and the ally doesn't have the Incapacitated condition."
      ]
    ],
    "actions": [
      {
        "name": "Spear",
        "atk": 3,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee or Ranged Attack Roll: +3, reach 5 ft. or range 20/60 ft. 4 (1d6 + 1) Piercing damage."
      }
    ]
  },
  "熊人": {
    "en": "Werebear",
    "size": "小型",
    "type": "怪兽",
    "alignment": "中立善良",
    "ac": 15,
    "ac_note": "natural armor",
    "hp": "135 (18d8 + 54)",
    "speed": "30 ft.",
    "str": 19,
    "dex": 10,
    "con": 17,
    "int": 11,
    "wis": 12,
    "cha": 12,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 17}",
    "languages": "通用语, (can't, speak, in, bear, form)",
    "cr": "5",
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +7, reach 5 ft. 17 (2d12 + 4) Piercing damage. If the target is a Humanoid, it is subjected to the following effect. Constitution Saving Throw: DC 14. Failure: The target is cursed. If the cursed target drops to 0 Hit Points, it instead becomes a Werebear under the DM's control and has 10 Hit Points. Success: The target is immune to this werebear's curse for 24 hours."
      },
      {
        "name": "Handaxe",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee or Ranged Attack Roll: +7, reach 5 ft or range 20/60 ft. 14 (3d6 + 4) Slashing damage."
      },
      {
        "name": "Multiattack",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The werebear makes two attacks, using Handaxe or Rend in any combination. It can replace one attack with a Bite attack."
      },
      {
        "name": "Rend",
        "atk": 7,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +7, reach 5 ft. 13 (2d8 + 4) Slashing damage."
      },
      {
        "name": "Shape-Shift",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The werebear shape-shifts into a Large bear-humanoid hybrid form or a Large bear, or it returns to its true humanoid form. Its game statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed."
      }
    ]
  },
  "猪人": {
    "en": "Wereboar",
    "size": "小型",
    "type": "怪兽",
    "alignment": "中立邪恶",
    "ac": 15,
    "ac_note": "natural armor",
    "hp": "97 (15d8 + 30)",
    "speed": "30 ft.",
    "str": 17,
    "dex": 10,
    "con": 15,
    "int": 10,
    "wis": 11,
    "cha": 8,
    "senses": "{'passive_perception': 12}",
    "languages": "通用语, (can't, speak, in, boar, form)",
    "cr": "4",
    "traits": [],
    "actions": [
      {
        "name": "Gore",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +5, reach 5 ft. 12 (2d8 + 3) Piercing damage. If the target is a Humanoid, it is subjected to the following effect. Constitution Saving Throw: DC 12. Failure: The target is cursed. If the cursed target drops to 0 Hit Points, it instead becomes a Wereboar under the DM's control and has 10 Hit Points. Success: The target is immune to this wereboar's curse for 24 hours."
      },
      {
        "name": "Javelin",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee or Ranged Attack Roll: +5, reach 5 ft. or range 30/120 ft. 13 (3d6 + 3) Piercing damage."
      },
      {
        "name": "Multiattack",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The wereboar makes two attacks, using Javelin or Tusk in any combination. It can replace one attack with a Gore attack."
      },
      {
        "name": "Tusk",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +5, reach 5 ft. 10 (2d6 + 3) Piercing damage. If the target is a Medium or smaller creature and the wereboar moved 20+ feet straight toward it immediately before the hit, the target takes an extra 7 (2d6) Piercing damage and has the Prone condition."
      },
      {
        "name": "Shape-Shift",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The wereboar shape-shifts into a Medium boar-humanoid hybrid or a Small boar, or it returns to its true humanoid form. Its game statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed."
      }
    ]
  },
  "鼠人": {
    "en": "Wererat",
    "size": "小型",
    "type": "怪兽",
    "alignment": "守序邪恶",
    "ac": 13,
    "ac_note": "natural armor",
    "hp": "60 (11d8 + 11)",
    "speed": "30 ft.",
    "str": 10,
    "dex": 16,
    "con": 12,
    "int": 11,
    "wis": 10,
    "cha": 8,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 14}",
    "languages": "通用语, (can't, speak, in, rat, form)",
    "cr": "2",
    "traits": [],
    "actions": [
      {
        "name": "Bite ",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +5, reach 5 ft. 8 (2d4 + 3) Piercing damage. If the target is a Humanoid, it is subjected to the following effect. Constitution Saving Throw: DC 11. Failure: The target is cursed. If the cursed target drops to 0 Hit Points, it instead becomes a Wererat under the DM's control and has 10 Hit Points. Success: The target is immune to this wererat's curse for 24 hours."
      },
      {
        "name": "Hand Crossbow",
        "atk": 5,
        "reach": "30 ft",
        "dmg": "",
        "type": "",
        "extra": "Ranged Attack Roll: +5, range 30/120 ft. 6 (1d6 + 3) Piercing damage."
      },
      {
        "name": "Multiattack",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The wererat makes two attacks, using Scratch or Hand Crossbow in any combination. It can replace one attack with a Bite attack."
      },
      {
        "name": "Scratch",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +5, reach 5 ft. 6 (1d6 + 3) Slashing damage."
      },
      {
        "name": "Shape-Shift",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The wererat shape-shifts into a Medium rat-humanoid hybrid or a Small rat, or it returns to its true humanoid form. Its game statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed."
      }
    ]
  },
  "虎人": {
    "en": "Weretiger",
    "size": "小型",
    "type": "怪兽",
    "alignment": "绝对中立",
    "ac": 12,
    "ac_note": "natural armor",
    "hp": "120 (16d8 + 48)",
    "speed": "30 ft.",
    "str": 17,
    "dex": 15,
    "con": 16,
    "int": 10,
    "wis": 13,
    "cha": 11,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 15}",
    "languages": "通用语, (can't, speak, in, tiger, form)",
    "cr": "4",
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +5, reach 5 ft. 12 (2d8 + 3) Piercing damage. If the target is a Humanoid, it is subjected to the following effect. Constitution Saving Throw: DC 13. Failure: The target is cursed. If the cursed target drops to 0 Hit Points, it instead becomes a Weretiger under the DM's control and has 10 Hit Points. Success: The target is immune to this weretiger's curse for 24 hours."
      },
      {
        "name": "Longbow",
        "atk": 4,
        "reach": "150 ft",
        "dmg": "",
        "type": "",
        "extra": "Ranged Attack Roll: +4, range 150/600 ft. 11 (2d8 + 2) Piercing damage."
      },
      {
        "name": "Multiattack",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The weretiger makes two attacks, using Scratch or Longbow in any combination. It can replace one attack with a Bite attack."
      },
      {
        "name": "Scratch",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +5, reach 5 ft. 10 (2d6 + 3) Slashing damage."
      },
      {
        "name": "Prowl (Tiger or Hybrid Form Only)",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The weretiger moves up to its Speed without provoking Opportunity Attacks. At the end of this movement, the weretiger can take the Hide action."
      },
      {
        "name": "Shape-Shift",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The weretiger shape-shifts into a Large tiger-humanoid hybrid or a Large tiger, or it returns to its true humanoid form. Its game statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed."
      }
    ]
  },
  "狼人": {
    "en": "Werewolf",
    "size": "小型",
    "type": "怪兽",
    "alignment": "混乱邪恶",
    "ac": 15,
    "ac_note": "natural armor",
    "hp": "71 (11d8 + 22)",
    "speed": "30 ft.",
    "str": 16,
    "dex": 14,
    "con": 14,
    "int": 10,
    "wis": 11,
    "cha": 10,
    "senses": "{'黑暗视觉': '60 ft.', 'passive_perception': 14}",
    "languages": "通用语, (can't, speak, in, wolf, form)",
    "cr": "3",
    "traits": [
      [
        "Pack Tactics",
        "The werewolf has Advantage on an attack roll against a creature if at least one of the werewolf's allies is within 5 feet of the creature and the ally doesn't have the Incapacitated condition."
      ]
    ],
    "actions": [
      {
        "name": "Bite",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +5, reach 5 ft. 12 (2d8 + 3) Piercing damage. If the target is a Humanoid, it is subjected to the following effect. Constitution Saving Throw: DC 12. Failure: The target is cursed. If the cursed target drops to 0 Hit Points, it instead becomes a Werewolf under the DM's control and has 10 Hit Points. Success: The target is immune to this werewolf's curse for 24 hours."
      },
      {
        "name": "Longbow",
        "atk": 4,
        "reach": "150 ft",
        "dmg": "",
        "type": "",
        "extra": "Ranged Attack Roll: +4, range 150/600 ft. 11 (2d8 + 2) Piercing damage."
      },
      {
        "name": "Multiattack",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The werewolf makes two attacks, using Scratch or Longbow in any combination. It can replace one attack with a Bite attack."
      },
      {
        "name": "Scratch",
        "atk": 5,
        "reach": "5 ft",
        "dmg": "",
        "type": "",
        "extra": "Melee Attack Roll: +5, reach 5 ft. 10 (2d6 + 3) Slashing damage."
      },
      {
        "name": "Shape-Shift",
        "atk": "",
        "reach": "",
        "dmg": "",
        "type": "",
        "extra": "The werewolf shape-shifts into a Large wolf-humanoid hybrid or a Medium wolf, or it returns to its true humanoid form. Its game statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed."
      }
    ]
  }
};

export const CR_XP: Record<string, number> = {
  "0": 10,
  "1/8": 25,
  "1/4": 50,
  "1/2": 100,
  "1": 200,
  "2": 450,
  "3": 700,
  "4": 1100,
  "5": 1800,
  "6": 2300,
  "7": 2900,
  "8": 3900,
  "9": 5000,
  "10": 5900,
  "11": 7200,
  "12": 8400,
  "13": 10000,
  "14": 11500,
  "15": 13000,
  "16": 15000,
  "17": 18000,
  "18": 20000,
  "19": 22000,
  "20": 25000,
  "21": 33000,
  "22": 41000,
  "23": 50000,
  "24": 62000,
  "25": 75000,
  "26": 90000,
  "27": 105000,
  "28": 120000,
  "29": 135000,
  "30": 155000
};
