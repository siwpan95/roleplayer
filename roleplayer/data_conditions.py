"""roleplayer.data_conditions - D&D 5e 官方战斗条件（15 条，由权威 API 核对）

来源：dnd5eapi.co/api/2014/conditions 核对官方 15 条条件名称与说明。
API 仅提供 name + desc 散文；本模块的 attack/save/check/auto_fail 惩罚模型是
D20 自有的规则建模（劣势≈-2 近似），非 API 数据。en 取官方名，desc_en 取官方描述。
"""
from __future__ import annotations
from collections import OrderedDict

CONDITIONS = OrderedDict([('目盲',
              OrderedDict([('en', 'Blinded'),
                           ('attack', -2),
                           ('save', 0),
                           ('check', 0),
                           ('auto_fail', ['vis']),
                           ('special', '攻击检定劣势；受攻击时攻击者获优势；所有依赖视觉的检定自动失败。'),
                           ('ends_on', '治疗/解除目盲法术；回合结束若原因为咒法则可能豁免。'),
                           ('desc_en',
                            "- A blinded creature can't see and automatically fails any ability check that requires "
                            'sight.\n'
                            "- Attack rolls against the creature have advantage, and the creature's attack rolls have "
                            'disadvantage.')])),
             ('魅惑',
              OrderedDict([('en', 'Charmed'),
                           ('attack', 0),
                           ('save', 0),
                           ('check', 0),
                           ('auto_fail', []),
                           ('special', '不能攻击魅惑来源；魅惑来源对其进行的社交技能检定获优势。'),
                           ('ends_on', '魅惑来源伤害该生物；法术/效应自然结束。'),
                           ('desc_en',
                            "- A charmed creature can't attack the charmer or target the charmer with harmful "
                            'abilities or magical effects.\n'
                            '- The charmer has advantage on any ability check to interact socially with the '
                            'creature.')])),
             ('耳聋',
              OrderedDict([('en', 'Deafened'),
                           ('attack', 0),
                           ('save', 0),
                           ('check', 0),
                           ('auto_fail', ['aud']),
                           ('special', '所有依赖听觉的检定自动失败。'),
                           ('ends_on', '治疗/解除耳聋法术。'),
                           ('desc_en',
                            "- A deafened creature can't hear and automatically fails any ability check that requires "
                            'hearing.')])),
             ('力竭',
              OrderedDict([('en', 'Exhaustion'),
                           ('attack', 0),
                           ('save', 0),
                           ('check', 0),
                           ('auto_fail', []),
                           ('levels', 6),
                           ('special',
                            '六级累积状态：每级叠加惩罚（1 级-优势检定劣势；2 级-速度减半；3 级-攻击/豁免劣势；4 级-最大 HP 减半；5 级-速度 0；6 级-死亡）。完成长休可减 1 '
                            '级（除非源于诅咒/不眠）。'),
                           ('ends_on', '长休减 1 级；特定来源需更高阶解除。'),
                           ('desc_en',
                            'Some special abilities and environmental hazards, such as starvation and the long-term '
                            'effects of freezing or scorching temperatures, can lead to a special condition called '
                            'exhaustion. Exhaustion is measured in six levels. An effect can give a creature one or '
                            "more levels of exhaustion, as specified in the effect's description.\n"
                            '1 - Disadvantage on ability checks\n'
                            '2 - Speed halved\n'
                            '3 - Disadvantage on attack rolls and saving throws\n'
                            '4 - Hit point maximum halved\n'
                            '5 - Speed reduced to 0\n'
                            '6 - Death\n'
                            'If an already exhausted creature suffers another effect that causes exhaustion, its '
                            "current level of exhaustion increases by the amount specified in the effect's "
                            'description.\n'
                            'A creature suffers the effect of its current level of exhaustion as well as all lower '
                            'levels. For example, a creature suffering level 2 exhaustion has its speed halved and has '
                            'disadvantage on ability checks.\n'
                            "An effect that removes exhaustion reduces its level as specified in the effect's "
                            "description, with all exhaustion effects ending if a creature's exhaustion level is "
                            'reduced below 1.\n'
                            "Finishing a long rest reduces a creature's exhaustion level by 1, provided that the "
                            'creature has also ingested some food and drink.')])),
             ('惊惧',
              OrderedDict([('en', 'Frightened'),
                           ('attack', -2),
                           ('save', -2),
                           ('check', -2),
                           ('auto_fail', []),
                           ('special', '恐惧来源方向的所有检定与攻击劣势；不能主动接近来源；来源 30 尺内无法自愿移动。'),
                           ('ends_on', '来源不可见或超出 60 尺；效应结束。'),
                           ('desc_en',
                            '- A frightened creature has disadvantage on ability checks and attack rolls while the '
                            'source of its fear is within line of sight.\n'
                            "- The creature can't willingly move closer to the source of its fear.")])),
             ('擒抱',
              OrderedDict([('en', 'Grappled'),
                           ('attack', 0),
                           ('save', 0),
                           ('check', 0),
                           ('auto_fail', []),
                           ('speed', 0),
                           ('special', '速度变为 0 且无法获得速度加值；无法移动到擒抱者不允许之处；可用力量(运动)/敏捷(体操)检定挣脱。'),
                           ('ends_on', '擒抱者放开或被打倒/传走；效应结束。'),
                           ('desc_en',
                            "- A grappled creature's speed becomes 0, and it can't benefit from any bonus to its "
                            'speed.\n'
                            '- The condition ends if the grappler is incapacitated (see the condition).\n'
                            '- The condition also ends if an effect removes the grappled creature from the reach of '
                            'the grappler or grappling effect, such as when a creature is hurled away by the '
                            'thunderwave spell.')])),
             ('失能',
              OrderedDict([('en', 'Incapacitated'),
                           ('attack', 0),
                           ('save', 0),
                           ('check', 0),
                           ('auto_fail', []),
                           ('special', '不能执行动作或反应；不能说话；许多其他条件（麻痹/震慑/昏迷等）隐含失能。'),
                           ('ends_on', '源效应结束。'),
                           ('desc_en', "- An incapacitated creature can't take actions or reactions.")])),
             ('隐形',
              OrderedDict([('en', 'Invisible'),
                           ('attack', 0),
                           ('save', 0),
                           ('check', 0),
                           ('auto_fail', []),
                           ('special', '攻击获得优势；受攻击时攻击者处于劣势（看不清目标）；依赖视觉的感知检定需靠听觉/其他线索。'),
                           ('ends_on', '攻击/受击后常短暂显形；法术/效应结束。'),
                           ('desc_en',
                            '- An invisible creature is impossible to see without the aid of magic or a special sense. '
                            "For the purpose of hiding, the creature is heavily obscured. The creature's location can "
                            'be detected by any noise it makes or any tracks it leaves.\n'
                            "- Attack rolls against the creature have disadvantage, and the creature's attack rolls "
                            'have advantage.')])),
             ('麻痹',
              OrderedDict([('en', 'Paralyzed'),
                           ('attack', 0),
                           ('save', 0),
                           ('check', 0),
                           ('auto_fail', ['str_save', 'dex_save']),
                           ('special', '失能；5 尺内攻击者获优势；对受击者的近战攻击命中即视为重击；力量/敏捷豁免自动失败。'),
                           ('ends_on', '源效应结束。'),
                           ('desc_en',
                            "- A paralyzed creature is incapacitated (see the condition) and can't move or speak.\n"
                            '- The creature automatically fails Strength and Dexterity saving throws.\n'
                            '- Attack rolls against the creature have advantage.\n'
                            '- Any attack that hits the creature is a critical hit if the attacker is within 5 feet of '
                            'the creature.')])),
             ('石化',
              OrderedDict([('en', 'Petrified'),
                           ('attack', 0),
                           ('save', 0),
                           ('check', 0),
                           ('auto_fail', ['str_save', 'dex_save']),
                           ('special', '失能；对一切伤害具抗性；重量增为 10 倍；无法移动/说话/感知；力量/敏捷豁免自动失败。'),
                           ('ends_on', '解石化法术；源效应结束。'),
                           ('desc_en',
                            '- A petrified creature is transformed, along with any nonmagical object it is wearing or '
                            'carrying, into a solid inanimate substance (usually stone). Its weight increases by a '
                            'factor of ten, and it ceases aging.\n'
                            "- The creature is incapacitated (see the condition), can't move or speak, and is unaware "
                            'of its surroundings.\n'
                            '- Attack rolls against the creature have advantage.\n'
                            '- The creature automatically fails Strength and Dexterity saving throws.\n'
                            '- The creature has resistance to all damage.\n'
                            '- The creature is immune to poison and disease, although a poison or disease already in '
                            'its system is suspended, not neutralized.')])),
             ('中毒',
              OrderedDict([('en', 'Poisoned'),
                           ('attack', -2),
                           ('save', -2),
                           ('check', -2),
                           ('auto_fail', []),
                           ('special', '攻击检定劣势；属性检定劣势。'),
                           ('ends_on', '毒效持续结束；解毒/医疗检定成功。'),
                           ('desc_en', '- A poisoned creature has disadvantage on attack rolls and ability checks.')])),
             ('倒地',
              OrderedDict([('en', 'Prone'),
                           ('attack', 0),
                           ('save', 0),
                           ('check', 0),
                           ('auto_fail', []),
                           ('special', '5 尺内近战攻击对其获优势、远程攻击对其处劣势；移动速度减半；起身需 1 个动作。'),
                           ('ends_on', '起身动作；被扶起；效应结束。'),
                           ('desc_en',
                            "- A prone creature's only movement option is to crawl, unless it stands up and thereby "
                            'ends the condition.\n'
                            '- The creature has disadvantage on attack rolls.\n'
                            '- An attack roll against the creature has advantage if the attacker is within 5 feet of '
                            'the creature. Otherwise, the attack roll has disadvantage.')])),
             ('束缚',
              OrderedDict([('en', 'Restrained'),
                           ('attack', -2),
                           ('save', 0),
                           ('check', 0),
                           ('auto_fail', []),
                           ('special', '攻击检定劣势；攻击者对其获优势；速度 0；对抗其的敏捷豁免处劣势。'),
                           ('ends_on', '挣脱（力量/敏捷检定）；移动效应结束。'),
                           ('desc_en',
                            "- A restrained creature's speed becomes 0, and it can't benefit from any bonus to its "
                            'speed.\n'
                            "- Attack rolls against the creature have advantage, and the creature's attack rolls have "
                            'disadvantage.\n'
                            '- The creature has disadvantage on Dexterity saving throws.')])),
             ('震慑',
              OrderedDict([('en', 'Stunned'),
                           ('attack', -2),
                           ('save', -2),
                           ('check', -2),
                           ('auto_fail', []),
                           ('special', '失能；攻击检定劣势；受攻击时攻击者获优势。'),
                           ('ends_on', '源效应结束。'),
                           ('desc_en',
                            "- A stunned creature is incapacitated (see the condition), can't move, and can speak only "
                            'falteringly.\n'
                            '- The creature automatically fails Strength and Dexterity saving throws.\n'
                            '- Attack rolls against the creature have advantage.')])),
             ('昏迷',
              OrderedDict([('en', 'Unconscious'),
                           ('attack', 0),
                           ('save', 0),
                           ('check', 0),
                           ('auto_fail', ['str_save', 'dex_save']),
                           ('special', '倒地且失能；5 尺内攻击者获优势；对其的近战攻击命中即重击；力量/敏捷豁免自动失败；不知攻击来源方位。'),
                           ('ends_on', '恢复生命/法术唤醒；源效应结束。'),
                           ('desc_en',
                            "- An unconscious creature is incapacitated (see the condition), can't move or speak, and "
                            'is unaware of its surroundings.\n'
                            "- The creature drops whatever it's holding and falls prone.\n"
                            '- The creature automatically fails Strength and Dexterity saving throws.\n'
                            '- Attack rolls against the creature have advantage.\n'
                            '- Any attack that hits the creature is a critical hit if the attacker is within 5 feet of '
                            'the creature.')]))])

DISADVANTAGE_PENALTY = -2
