# -*- coding: utf-8 -*-
"""Convert the authoritative SRD JSON (pulled by pull_srd.py into _srd_pull/)
into D20's Chinese-keyed data modules.

Provenance: every record originates from https://www.dnd5eapi.co/api/2014/ (the
official D&D 5e SRD REST API). This script is the *only* thing that writes
d20/data_{monsters,spells,magicitems,conditions}.py — no hand-authored numbers.

Naming policy (documented, honest):
  * Enum fields (size/type/alignment/damage/school/rarity/...) are translated to
    Chinese deterministically via the maps below — full coverage.
  * Entry *names* are keyed by the authoritative English `name` by default.
  * A curated EN2CN map supplies Chinese keys for the subset D20's UI/tests
    reference (e.g. 哥布林, 火球术, 目盲). Entries outside that map keep their
    English key — they are still present and verifiable, just not localized.
  * The 15 CONDITIONS penalty model (attack/save/check/auto_fail) is D20's own
    rule design (disadvantage ≈ -2 proxy); the API only provides name + prose,
    so we attach the official `name`/`desc` and the rule-modeled fields.
"""
from __future__ import annotations

import json
import os
import pprint
import re
from collections import OrderedDict

_HERE = os.path.dirname(os.path.abspath(__file__))
PULL = os.path.join(_HERE, "_srd_pull")   # 2026-08-31：原 E:/D20 硬编码改相对
OUT = os.path.join(_HERE, "d20")

# =============================================================================
#  Enum translation maps (deterministic, full coverage)
# =============================================================================
SIZE = {"Tiny": "超小型", "Small": "小型", "Medium": "中型", "Large": "大型",
        "Huge": "超大型", "Gargantuan": "巨型"}

TYPE = {"aberration": "异怪", "beast": "野兽", "celestial": "天界", "construct": "构装",
        "dragon": "龙", "elemental": "元素", "fey": "精类", "fiend": "邪魔",
        "giant": "巨人", "humanoid": "类人妖", "monstrosity": "怪兽", "ooze": "泥形",
        "plant": "植物", "swarm": "群", "undead": "不死"}

ALIGN = {
    "lawful good": "守序善良", "neutral good": "中立善良", "chaotic good": "混乱善良",
    "lawful neutral": "守序中立", "neutral": "中立", "true neutral": "绝对中立",
    "chaotic neutral": "混乱中立", "lawful evil": "守序邪恶", "neutral evil": "中立邪恶",
    "chaotic evil": "混乱邪恶", "any alignment": "任意", "unaligned": "无",
    "any chaotic alignment": "任意混乱", "any evil alignment": "任意邪恶",
    "any good alignment": "任意善良", "any lawful alignment": "任意守序",
    "any non-good alignment": "任意非善良", "any non-lawful alignment": "任意非守序",
    "any non-aligned": "无", "any": "任意",
}

DMG = {"bludgeoning": "钝击", "piercing": "穿刺", "slashing": "挥砍", "acid": "酸",
       "cold": "冷", "fire": "火", "lightning": "电", "thunder": "雷", "poison": "毒",
       "psychic": "心灵", "radiant": "光耀", "necrotic": "坏死", "force": "力场",
       "bludgeoning, piercing, and slashing": "钝击/挥砍/穿刺"}

SCHOOL = {"abjuration": "防护", "conjuration": "咒法", "divination": "预言",
          "enchantment": "附魔", "evocation": "塑能", "illusion": "幻术",
          "necromancy": "死灵", "transmutation": "变化"}

RARITY = {"common": "普通", "uncommon": "非普通", "rare": "稀有", "very rare": "极稀有",
          "legendary": "传说", "artifact": "神器"}

SAVE_ATTR = {"str": "力量", "dex": "敏捷", "con": "体质", "int": "智力",
             "wis": "感知", "cha": "魅力"}

SKILL = {"acrobatics": "杂技", "animal handling": "驯兽", "arcana": "奥术知识",
         "athletics": "运动", "deception": "欺瞒", "history": "历史", "insight": "洞察",
         "intimidation": "恐吓", "investigation": "调查", "medicine": "医疗",
         "nature": "自然知识", "perception": "察觉", "performance": "表演",
         "persuasion": "说服", "religion": "宗教", "sleight of hand": "巧手",
         "stealth": "潜行", "survival": "生存"}

LANG = {"common": "通用语", "dwarvish": "矮人语", "elvish": "精灵语", "giant": "巨语",
        "goblin": "哥布林语", "halfling": "半身人语", "orc": "兽人语", "draconic": "龙语",
        "undercommon": "地底语", "abyssal": "深渊语", "infernal": "炼狱语",
        "celestial": "天界语", "deep speech": "深层语", "primordial": "原初语",
        "sylvan": "精类语", "aquan": "水族语", "auran": "气族语", "ignan": "火族语",
        "terran": "土族语", "common sign language": "通用手语", "thieves' cant": "盗贼黑话",
        "druidic": "德鲁伊语"}

SENSE = {"darkvision": "黑暗视觉", "blindsight": "盲视", "tremorsense": "震颤感知",
         "truesight": "真实视觉", "passive perception": "被动察觉", "passive Perception": "被动察觉"}

ITEMTYPE = {"weapon": "武器", "armor": "护甲", "potion": "药剂", "ring": "戒指",
            "rod": "魔杖", "staff": "法杖", "wand": "魔杖", "wondrous item": "奇物",
            "ammunition": "弹药", "gear": "装备", "poison": "毒药", "tool": "工具"}

COND_EN2CN = {"blinded": "目盲", "charmed": "魅惑", "deafened": "耳聋",
              "frightened": "惊惧", "grappled": "擒抱", "incapacitated": "失能",
              "invisible": "隐形", "paralyzed": "麻痹", "petrified": "石化",
              "poisoned": "中毒", "prone": "倒地", "restrained": "束缚",
              "stunned": "震慑", "unconscious": "昏迷", "exhaustion": "力竭"}

# =============================================================================
#  Curated English -> Chinese NAME map (subset D20 references / common SRD)
# =============================================================================
# =============================================================================
#  EN2CN 中英译名表（扩展层）
#  来源：huijiwiki 龙与地下城TRPG 官方中文译名（法术列表 / 怪物图鉴2025），
#        以 gen_srd_from_api.py 内手工校订子集（curated）为权威覆盖层。
#  - 法术/怪物英文名默认保留英文原名；命中下表者使用中文键。
#  - curated 子集经过人工校订，优先级高于 huijiwiki 自动抓取，避免错译。
#  - 怪物层对 2025 怪物手册复数/更名条目做了 norm 归一匹配到 SRD 2014 原名。
# =============================================================================
EN2CN_MON = OrderedDict([   ('Aboleth', '阿巴梭'),
                ('Acolyte', '信徒'),
                ('Adult Black Dragon', '成年黑龙'),
                ('Adult Blue Dragon', '成年蓝龙'),
                ('Adult Brass Dragon', '成年黄铜龙'),
                ('Adult Bronze Dragon', '成年青铜龙'),
                ('Adult Copper Dragon', '成年红铜龙'),
                ('Adult Gold Dragon', '成年金龙'),
                ('Adult Green Dragon', '成年绿龙'),
                ('Adult Red Dragon', '成年红龙'),
                ('Adult Silver Dragon', '成年银龙'),
                ('Adult White Dragon', '成年白龙'),
                ('Air Elemental', '气元素'),
                ('Allosaurus', '异齿龙'),
                ('Ancient Black Dragon', '远古黑龙'),
                ('Ancient Blue Dragon', '远古蓝龙'),
                ('Ancient Brass Dragon', '远古黄铜龙'),
                ('Ancient Bronze Dragon', '远古青铜龙'),
                ('Ancient Copper Dragon', '远古红铜龙'),
                ('Ancient Gold Dragon', '远古金龙'),
                ('Ancient Green Dragon', '远古绿龙'),
                ('Ancient Red Dragon', '远古红龙'),
                ('Ancient Silver Dragon', '远古银龙'),
                ('Ancient White Dragon', '远古白龙'),
                ('Animated Armor', '活化护甲'),
                ('Ankheg', '掘地虫'),
                ('Ankylosaurus', '甲龙'),
                ('Archmage', '大法师'),
                ('Assassin', '刺客'),
                ('Axe Beak', '斧嘴鸟们'),
                ('Azer', '火矮人们'),
                ('Baboon', '狒狒'),
                ('Badger', '獾'),
                ('Balor', '巴洛炎魔'),
                ('Bandit', '强盗'),
                ('Bandit Captain', '强盗头目'),
                ('Barbed Devil', '胡须魔鬼'),
                ('Basilisk', '石化蜥蜴'),
                ('Bat', '蝙蝠'),
                ('Bearded Devil', '须魔'),
                ('Behir', '青足龙蛇'),
                ('Beholder', '眼魔'),
                ('Berserker', '狂战士们'),
                ('Black Bear', '黑熊'),
                ('Black Pudding', '黑布丁'),
                ('Blink Dog', '闪现犬'),
                ('Boar', '野猪'),
                ('Bone Devil', '骸骨魔'),
                ('Bone Naga', '骸骨纳迦'),
                ('Brown Bear', '熊'),
                ('Bugbear', '熊地精'),
                ('Bulette', '鲨蜥们'),
                ('Cat', '猫'),
                ('Centaur', '人马'),
                ('Chain Devil', '锁链魔'),
                ('Chimera', '奇美拉'),
                ('Chuul', '甲伏怪'),
                ('Clay Golem', '粘土魔像'),
                ('Cloaker', '斗篷怪'),
                ('Cloud Giant', '云巨人'),
                ('Cockatrice', '蛇鸡兽'),
                ('Commoner', '普通民众'),
                ('Constrictor Snake', '蟒蛇'),
                ('Couatl', '羽蛇'),
                ('Crab', '蟹'),
                ('Crocodile', '鳄鱼'),
                ('Cultist', '邪教徒'),
                ('Darkmantle', '暗幕魔兽'),
                ('Death Dog', '亡命恶犬'),
                ('Deer', '鹿'),
                ('Demilich', '半巫妖'),
                ('Deva', '天神使徒'),
                ('Dire Bear', '巨熊'),
                ('Dire Wolf', '巨狼'),
                ('Displacer Beast', '移位兽'),
                ('Djinni', '气巨灵'),
                ('Doppelganger', '变形怪'),
                ('Dragon Turtle', '龙龟'),
                ('Drider', '蛛化卓尔'),
                ('Druid', '德鲁伊'),
                ('Dryad', '树精'),
                ('Eagle', '鹰'),
                ('Earth Elemental', '土元素'),
                ('Efreeti', '火巨灵'),
                ('Elephant', '象'),
                ('Erinyes', '厄倪尼斯'),
                ('Ettercap', '伊特怪'),
                ('Ettin', '双头巨人'),
                ('Fire Elemental', '火元素'),
                ('Fire Giant', '火巨人'),
                ('Flesh Golem', '血肉魔像'),
                ('Flying Sword', '飞剑'),
                ('Frog', '蛙'),
                ('Frost Giant', '冰霜巨人'),
                ('Gargoyle', '石像鬼'),
                ('Gelatinous Cube', '凝胶立方'),
                ('Ghast', '妖鬼们'),
                ('Ghost', '幽灵'),
                ('Ghoul', '食尸鬼'),
                ('Giant Boar', '巨野猪'),
                ('Giant Constrictor Snake', '巨蟒'),
                ('Giant Crocodile', '巨鳄'),
                ('Giant Eagle', '巨鹰'),
                ('Giant Frog', '巨蛙'),
                ('Giant Goat', '巨山羊'),
                ('Giant Hyena', '巨鬣狗'),
                ('Giant Octopus', '巨章鱼'),
                ('Giant Owl', '巨鸮'),
                ('Giant Poisonous Snake', '巨毒蛇'),
                ('Giant Rat', '巨鼠'),
                ('Giant Scorpion', '巨蝎'),
                ('Giant Shark', '巨鲨'),
                ('Giant Spider', '巨型蜘蛛'),
                ('Giant Toad', '巨蟾蜍'),
                ('Giant Wasp', '巨蜂'),
                ('Giant Weasel', '巨鼬'),
                ('Giant Wolf Spider', '巨狼蛛'),
                ('Gibbering Mouther', '喋喋魔口'),
                ('Glabrezu', '迷诱魔'),
                ('Gladiator', '角斗士'),
                ('Gnoll', '豺狼人'),
                ('Goblin', '哥布林'),
                ('Gorgon', '石化铁牛们'),
                ('Gray Ooze', '灰泥怪们'),
                ('Green Hag', '绿鬼婆'),
                ('Grick', '格里克'),
                ('Griffon', '狮鹫'),
                ('Grimlock', '幽邃盲族'),
                ('Guard', '卫兵'),
                ('Guardian Naga', '守护纳迦'),
                ('Harpy', '鸟妖'),
                ('Hawk', '隼'),
                ('Hell Hound', '地狱猎犬'),
                ('Hezrou', '狂蟾魔'),
                ('Hill Giant', '山丘巨人'),
                ('Hippogriff', '鹰头马身有翼兽'),
                ('Hobgoblin', '大地精'),
                ('Hobgoblin Warlord', '大地精领主'),
                ('Homunculus', '人工生命体'),
                ('Horned Devil', '角魔'),
                ('Hydra', '多头蛇'),
                ('Hyena', '鬣狗'),
                ('Ice Devil', '冰魔'),
                ('Imp', '小魔鬼'),
                ('Invisible Stalker', '隐形追猎者'),
                ('Iron Golem', '铁魔像'),
                ('Jackal', '胡狼'),
                ('Knight', '骑士'),
                ('Kobold', '狗头人'),
                ('Kraken', '克拉肯'),
                ('Lamia', '拉迷亚'),
                ('Lemure', '劣魔们'),
                ('Lich', '巫妖'),
                ('Lion', '狮'),
                ('Lizard', '蜥蜴'),
                ('Lizardfolk', '蜥蜴人'),
                ('Mage', '魔法师们'),
                ('Magmin', '火童'),
                ('Manticore', '蝎狮'),
                ('Marilith', '六臂蛇魔'),
                ('Medusa', '美杜莎'),
                ('Merfolk', '人鱼'),
                ('Merrow', '迈罗人鱼'),
                ('Mimic', '拟态'),
                ('Mind Flayer', '夺心魔'),
                ('Monkey', '猴'),
                ('Mule', '骡'),
                ('Nalfeshnee', '判魂魔'),
                ('Night Hag', '夜鬼婆'),
                ('Nightmare', '梦魇'),
                ('Noble', '贵族们'),
                ('Ochre Jelly', '赭果冻'),
                ('Octopus', '章鱼'),
                ('Ogre', '食人魔'),
                ('Oni', '恶鬼'),
                ('Orc', '兽人'),
                ('Orc War Chief', '兽人战酋'),
                ('Otyugh', '食腐兽'),
                ('Owl', '鸮'),
                ('Owlbear', '枭熊'),
                ('Pegasus', '天马'),
                ('Phase Spider', '相位蜘蛛'),
                ('Pit Fiend', '深狱炼魔'),
                ('Planetar', '异界神侍'),
                ('Poisonous Snake', '毒蛇'),
                ('Polar Bear', '北极熊'),
                ('Priest', '祭司'),
                ('Pseudodragon', '伪龙'),
                ('Pteranodon', '无齿翼龙'),
                ('Purple Worm', '紫虫'),
                ('Quasit', '小恶魔'),
                ('Rakshasa', '罗刹'),
                ('Rat', '鼠'),
                ('Raven', '乌鸦'),
                ('Rhinoceros', '犀牛'),
                ('Roc', '鹏鸟'),
                ('Roper', '罗珀'),
                ('Rug of Smothering', '窒息地毯'),
                ('Rust Monster', '锈虫'),
                ('Sahuagin', '鲨华鱼人'),
                ('Salamander', '火蜥蜴们'),
                ('Satyr', '半羊人们'),
                ('Scorpion', '蝎'),
                ('Scout', '斥候'),
                ('Sea Hag', '海鬼婆'),
                ('Sea Horse', '海马'),
                ('Shadow', '幽影'),
                ('Shambling Mound', '蔓生怪'),
                ('Shield Guardian', '护盾守卫'),
                ('Skeleton', '骷髅'),
                ('Solar', '炽天神侍'),
                ('Specter', '恶灵'),
                ('Spider', '蛛'),
                ('Spirit Naga', '精魂纳迦'),
                ('Sprite', '小仙灵'),
                ('Spy', '间谍'),
                ('Stegosaurus', '剑龙'),
                ('Stirge', '蚊蝠们'),
                ('Stone Giant', '石巨人'),
                ('Stone Golem', '石魔像'),
                ('Storm Giant', '风暴巨人'),
                ('Tarrasque', '泰拉斯奎'),
                ('Thug', '暴徒'),
                ('Tiger', '虎'),
                ('Treant', '树人'),
                ('Triceratops', '三角龙'),
                ('Troll', '巨魔'),
                ('Tyrannosaurus Rex', '霸王龙'),
                ('Unicorn', '独角兽'),
                ('Vampire', '吸血鬼'),
                ('Vrock', '鹫魔'),
                ('Vulture', '秃鹫'),
                ('Water Elemental', '水元素'),
                ('Weasel', '鼬'),
                ('Whale', '鲸'),
                ('Wight', '尸妖'),
                ('Winter Wolf', '冬狼'),
                ('Wolf', '狼'),
                ('Worg', '恐狼'),
                ('Wraith', '邪灵'),
                ('Wyvern', '飞龙'),
                ('Xorn', '石鼎兽'),
                ('Young Black Dragon', '黑龙幼龙'),
                ('Young Blue Dragon', '蓝龙幼龙'),
                ('Young Brass Dragon', '黄铜龙幼龙'),
                ('Young Bronze Dragon', '青铜龙幼龙'),
                ('Young Copper Dragon', '红铜龙幼龙'),
                ('Young Gold Dragon', '金龙幼龙'),
                ('Young Green Dragon', '绿龙幼龙'),
                ('Young Red Dragon', '红龙幼龙'),
                ('Young Silver Dragon', '银龙幼龙'),
                ('Young White Dragon', '白龙幼龙'),
                ('Yuan-Ti Malison', '元提伪人'),
                ('Zombie', '僵尸')])

EN2CN_SPELL = OrderedDict([   ("Abi-Dalzim's Horrid Wilting", '亚比达奇凋死术'),
                ('Absorb Elements', '吸收元素'),
                ('Acid Splash', '酸液飞溅'),
                ("Aganazzar's Scorcher", '阿迦纳萨喷火术'),
                ('Aid', '援助术'),
                ('Air Bubble', '空气泡泡'),
                ('Alarm', '警报术'),
                ('Alter Self', '变身术'),
                ('Animal Friendship', '动物亲和'),
                ('Animal Messenger', '动物信使'),
                ('Animal Shapes', '动物形态'),
                ('Animate Dead', '唤起死灵'),
                ('Animate Objects', '活化物件'),
                ('Antilife Shell', '防活物护罩'),
                ('Antimagic Field', '反魔法力场'),
                ('Antipathy', '关怀术'),
                ('Arcane Eye', '秘法眼'),
                ('Arcane Gate', '秘法门'),
                ('Arcane Lock', '秘法锁'),
                ('Armor of Agathys', '阿加西斯之甲'),
                ('Arms of Hadar', '哈达之臂'),
                ("Ashardalon's Stride", '阿莎德隆奔行'),
                ('Astral Projection', '星界投影'),
                ('Augury', '卜筮术'),
                ('Aura of Life', '生命灵光'),
                ('Aura of Purity', '净化灵光'),
                ('Aura of Vitality', '活力灵光'),
                ('Awaken', '启蒙术'),
                ('Bane', '衰弱术'),
                ('Banishing Smite', '放逐斩'),
                ('Banishment', '放逐术'),
                ('Barkskin', '树皮术'),
                ('Beacon of Hope', '希望信标'),
                ('Beast Bond', '兽之联结'),
                ('Beast Sense', '兽感'),
                ('Bestow Curse', '降咒术'),
                ("Bigby's Hand", '毕格比之手'),
                ('Blade Barrier', '剑刃护壁'),
                ('Blade Ward', '剑刃护盾'),
                ('Blade of Disaster', '灾厄之刃'),
                ('Bless', '祝福术'),
                ('Blight', '枯萎术'),
                ('Blinding Smite', '致盲斩'),
                ('Blink', '闪烁术'),
                ('Blur', '朦胧术'),
                ('Bones of the Earth', '地之骨'),
                ('Booming Blade', '回响刃'),
                ('Borrowed Knowledge', '借鉴才学'),
                ('Branding Smite', '印记斩'),
                ('Burning Hands', '燃烧之手'),
                ('Call Lightning', '召雷术'),
                ('Calm Emotions', '安定心神'),
                ('Catapult', '弹射术'),
                ('Catnap', '假寐术'),
                ('Cause Fear', '造成恐惧'),
                ('Ceremony', '典礼术'),
                ('Chain Lightning', '连锁闪电'),
                ('Chaos Bolt', '混沌箭'),
                ('Charm Monster', '魅惑怪物'),
                ('Charm Person', '魅惑人类'),
                ('Chill Touch', '冷冻之触'),
                ('Chromatic Orb', '繁彩球'),
                ('Circle of Death', '死亡法阵'),
                ('Circle of Power', '原力法阵'),
                ('Clairvoyance', '鹰眼术'),
                ('Clone', '克隆术'),
                ('Cloud of Daggers', '匕首之云'),
                ('Cloudkill', '死云术'),
                ('Color Spray', '色彩喷射'),
                ('Command', '命令术'),
                ('Commune', '通神术'),
                ('Commune With Nature', '问道自然'),
                ('Commune with Nature', '问道自然'),
                ('Compelled Duel', '强令对决'),
                ('Comprehend Languages', '语言通晓'),
                ('Compulsion', '强迫术'),
                ('Cone of Cold', '寒冰锥'),
                ('Confusion', '困惑术'),
                ('Conjure Animals', '动物咒唤术'),
                ('Conjure Barrage', '箭幕咒唤术'),
                ('Conjure Celestial', '天界咒唤术'),
                ('Conjure Elemental', '元素咒唤术'),
                ('Conjure Fey', '精类咒唤术'),
                ('Conjure Minor Elementals', '次级元素咒唤术'),
                ('Conjure Volley', '箭雨咒唤术'),
                ('Conjure Woodland Beings', '林地之精咒唤术'),
                ('Contact Other Plane', '异界交涉'),
                ('Contagion', '疫病术'),
                ('Contingency', '触发术'),
                ('Continual Flame', '不灭明焰'),
                ('Control Flames', '控火'),
                ('Control Water', '操控水体'),
                ('Control Weather', '操控天气'),
                ('Control Wind', '操控风力'),
                ('Cordon of Arrows', '警戒箭阵'),
                ('Counterspell', '反制法术'),
                ('Create Bonfire', '创造篝火'),
                ('Create Food and Water', '造粮术'),
                ('Create Homunculus', '创造造妖'),
                ('Create Magen', '创造魔卫'),
                ('Create Spelljamming Helm', '创造法驱魔舵'),
                ('Create Undead', '唤起不死'),
                ('Create or Destroy Water', '枯水术'),
                ('Creation', '造物术'),
                ('Crown of Madness', '疯狂冠冕'),
                ('Crown of Stars', '众星冠冕'),
                ("Crusader's Mantle", '十字军披风'),
                ('Cure Wounds', '治疗术'),
                ('Dancing Lights', '舞光术'),
                ('Danse Macabre', '骷髅之舞'),
                ('Dark Star', '暗黑星辰'),
                ('Darkness', '黑暗术'),
                ('Darkvision', '黑暗视觉术'),
                ('Dawn', '拂晓'),
                ('Daylight', '昼明术'),
                ('Death Ward', '防死术'),
                ('Delayed Blast Fireball', '延迟爆裂火球'),
                ('Demiplane', '创造半位面'),
                ('Destructive Wave', '湮灭波'),
                ('Detect Evil and Good', '侦测善恶'),
                ('Detect Magic', '侦测魔法'),
                ('Detect Poison and Disease', '侦测毒性和疾病'),
                ('Detect Thoughts', '侦测思想'),
                ('Dimension Door', '次元门'),
                ('Disguise Self', '易容术'),
                ('Disintegrate', '解离术'),
                ('Dispel Evil and Good', '驱散善恶'),
                ('Dispel Magic', '解除魔法'),
                ('Dissonant Whispers', '不谐低语'),
                ('Distort Value', '扭曲价值'),
                ('Divination', '预言术'),
                ('Divine Favor', '神恩'),
                ('Divine Word', '圣言术'),
                ('Dominate Beast', '支配野兽'),
                ('Dominate Monster', '支配怪物'),
                ('Dominate Person', '支配人类'),
                ('Draconic Transformation', '龙类变化术'),
                ("Dragon's Breath", '龙息术'),
                ("Drawmij's Instant Summons", '卓姆吉瞬间召唤'),
                ('Dream', '托梦术'),
                ('Dream of the Blue Veil', '蓝纱一梦'),
                ('Druid Grove', '德鲁伊林地'),
                ('Druidcraft', '德鲁伊伎俩'),
                ('Dust Devil', '尘土恶魔'),
                ('Earth Tremor', '地动'),
                ('Earthbind', '地缚'),
                ('Earthquake', '地震术'),
                ('Eldritch Blast', '邪术爆'),
                ('Elemental Bane', '元素灾厄'),
                ('Elemental Weapon', '元素武器'),
                ('Encode Thoughts', '编码思绪'),
                ('Enemies Abound', '敌群环绕'),
                ('Enervation', '汲能术'),
                ('Enhance Ability', '强化能力'),
                ('Enlarge', '缩小术'),
                ('Ensnaring Strike', '诱捕打击'),
                ('Entangle', '纠缠术'),
                ('Enthrall', '注目术'),
                ('Erupting Earth', '土石喷发'),
                ('Etherealness', '以太化'),
                ("Evard's Black Tentacles", '艾伐黑触手'),
                ('Expeditious Retreat', '疾行术'),
                ('Eyebite', '摄心目光'),
                ('Fabricate', '鬼斧神工'),
                ('Faerie Fire', '妖火'),
                ('False Life', '假生命'),
                ('Far Step', '渺远步'),
                ('Fast Friends', '快速交友'),
                ('Fear', '恐惧术'),
                ('Feast', '英雄宴'),
                ('Feather Fall', '羽落术'),
                ('Feeblemind', '弱智术'),
                ('Feign Death', '假死术'),
                ('Find Familiar', '寻获魔宠'),
                ('Find Greater Steed', '寻获高等坐骑'),
                ('Find Steed', '寻获坐骑'),
                ('Find Traps', '发现陷阱'),
                ('Find the Path', '寻路术'),
                ('Finger of Death', '死亡一指'),
                ('Fire Bolt', '火焰箭'),
                ('Fire Shield', '火焰护盾'),
                ('Fire Storm', '火焰风暴'),
                ('Fireball', '火球术'),
                ("Fizban's Platinum Shield", '费资本铂金盾'),
                ('Flame Arrows', '烈焰箭矢'),
                ('Flame Blade', '火焰刀'),
                ('Flame Strike', '烈焰击'),
                ('Flaming Sphere', '炽焰法球'),
                ('Flesh to Stone', '化肉为石'),
                ('Flock of Familiars', '魔宠群'),
                ('Fly', '飞行术'),
                ('Fog Cloud', '云雾术'),
                ('Forbiddance', '禁制术'),
                ('Forcecage', '魔力监牢'),
                ('Foresight', '预视术'),
                ("Fortune's Favor", '命运宠儿'),
                ('Freedom of Movement', '行动自如'),
                ('Freedom of the Wave', '浪之自由'),
                ('Freedom of the Wind', '风之自由'),
                ('Friends', '交友术'),
                ('Frost Fingers', '冰冷一指'),
                ('Frostbite', '霜噬'),
                ("Galder's Speedy Courier", '加德尔急速邮差'),
                ("Galder's Tower", '加德尔高塔术'),
                ('Gaseous Form', '气化形体'),
                ('Gate', '异界之门'),
                ('Geas', '指使术'),
                ('Gentle Repose', '遗体防腐'),
                ('Giant Insect', '巨虫术'),
                ('Gift Of Gab', '巧舌如簧'),
                ('Gift of Alacrity', '灵敏之赐'),
                ('Glibness', '花言巧语'),
                ('Globe of Invulnerability', '法术无效结界'),
                ('Glyph of Warding', '守卫刻纹'),
                ('Goodberry', '神莓术'),
                ('Grasping Vine', '擒抱藤'),
                ('Gravity Fissure', '重力分裂'),
                ('Gravity Sinkhole', '引力裂沟'),
                ('Grease', '油脂术'),
                ('Greater Invisibility', '高等隐形术'),
                ('Greater Restoration', '高等复原术'),
                ('Green-Flame Blade', '绿焰刃'),
                ('Guardian of Faith', '信仰守卫'),
                ('Guardian of Nature', '自然守卫'),
                ('Guards and Wards', '铜墙铁壁'),
                ('Guidance', '指引术'),
                ('Guiding Bolt', '导引箭'),
                ('Gust', '舞风'),
                ('Gust of Wind', '疾风术'),
                ('Hail of Thorns', '棘雹术'),
                ('Hallow', '圣居'),
                ('Hallucinatory Terrain', '幻景术'),
                ('Harm', '重伤术'),
                ('Haste', '加速术'),
                ('Heal', '医疗术'),
                ('Healing Spirit', '治愈之魂'),
                ('Healing Word', '治疗言灵'),
                ('Heat Metal', '加热金属'),
                ('Hellish Rebuke', '地狱回敬'),
                ('Heroism', '英勇术'),
                ('Hex', '诅咒'),
                ('Hold Monster', '定身怪物'),
                ('Hold Person', '人类定身术'),
                ('Holy Aura', '神圣灵光'),
                ('Holy Weapon', '神圣武器'),
                ('Hunger of Hadar', '哈达之欲'),
                ("Hunter's Mark", '猎人印记'),
                ('Hypnotic Pattern', '催眠图纹'),
                ('Ice Knife', '冰刃'),
                ('Ice Storm', '冰风暴'),
                ('Identify', '鉴定术'),
                ('Illusory Dragon', '幻影巨龙'),
                ('Illusory Script', '迷幻手稿'),
                ('Immolation', '焚烧术'),
                ('Immovable Object', '不动物件'),
                ('Imprisonment', '禁锢术'),
                ('Incendiary Cloud', '焚云术'),
                ('Incite Greed', '鼓动贪欲'),
                ('Infernal Calling', '地狱呼唤'),
                ('Infestation', '虫群孳生'),
                ('Inflict Wounds', '降祸伤口'),
                ('Insect Plague', '疫病虫群'),
                ('Intellect Fortress', '智力壁垒'),
                ('Investiture of Flame', '炽焰赋权'),
                ('Investiture of Ice', '寒冰赋权'),
                ('Investiture of Stone', '磐石赋权'),
                ('Investiture of Wind', '清风赋权'),
                ('Invisibility', '隐身术'),
                ('Invulnerability', '无敌术'),
                ("Jim's Glowing Coin", '吉姆的发光硬币'),
                ("Jim's Magic Missile", '吉姆的魔法飞弹'),
                ('Jump', '跳跃术'),
                ('Kinetic Jaunt', '动力短行'),
                ('Knock', '敲开门扉'),
                ('Legend Lore', '通晓传奇'),
                ("Leomund's Secret Chest", '李欧蒙秘藏箱'),
                ("Leomund's Tiny Hut", '李欧蒙小屋'),
                ('Lesser Restoration', '次级复原术'),
                ('Levitate', '悬浮术'),
                ('Life Transference', '生命转换'),
                ('Light', '光亮术'),
                ('Lightning Arrow', '闪电箭矢'),
                ('Lightning Bolt', '闪电束'),
                ('Lightning Lure', '闪电牵引'),
                ('Locate Animals or Plants', '定位动植物'),
                ('Locate Creature', '生物定位术'),
                ('Locate Object', '定位物体'),
                ('Longstrider', '远行术'),
                ('Maddening Darkness', '疯狂之暗'),
                ('Maelstrom', '大漩涡'),
                ('Mage Armor', '法师护甲'),
                ('Mage Hand', '法师之手'),
                ('Magic Circle', '防护法阵'),
                ('Magic Jar', '魔魂壶'),
                ('Magic Missile', '魔法飞弹'),
                ('Magic Mouth', '魔嘴术'),
                ('Magic Stone', '魔石术'),
                ('Magic Weapon', '魔法武器'),
                ('Magnify Gravity', '扩大重力'),
                ('Major Image', '高等幻影'),
                ('Mass Cure Wounds', '群体治疗术'),
                ('Mass Heal', '群体医疗术'),
                ('Mass Healing Word', '群体治愈真言'),
                ('Mass Polymorph', '群体变形术'),
                ('Mass Suggestion', '群体暗示术'),
                ("Maximilian's Earthen Grasp", '麦克斯米利安的地之攫'),
                ('Maze', '迷宫术'),
                ('Meld Into Stone', '融身入石'),
                ('Meld into Stone', '融身入石'),
                ("Melf's Acid Arrow", '马友夫强酸箭'),
                ("Melf's Minute Meteors", '马友夫微流星'),
                ('Mending', '修复术'),
                ('Mental Prison', '精神监狱'),
                ('Message', '传讯术'),
                ('Meteor Swarm', '陨石雨'),
                ('Mighty Fortress', '坚固堡垒'),
                ('Mind Blank', '心灵屏障'),
                ('Mind Sliver', '心智碎片'),
                ('Mind Spike', '心灵尖刺'),
                ('Minor Illusion', '次级幻影'),
                ('Mirage Arcane', '海市蜃楼'),
                ('Mirror Image', '镜影术'),
                ('Mislead', '假象术'),
                ('Misty Step', '迷踪步'),
                ('Modify Memory', '篡改记忆'),
                ('Mold Earth', '塑土'),
                ('Moonbeam', '月光束'),
                ("Mordenkainen's Faithful Hound", '魔邓肯忠犬'),
                ("Mordenkainen's Magnificent Mansion", '魔邓肯豪宅术'),
                ("Mordenkainen's Private Sanctum", '魔邓肯私人密室'),
                ("Mordenkainen's Sword", '魔邓肯之剑'),
                ('Motivational Speech', '励志演讲'),
                ('Move Earth', '地动术'),
                ("Nathair's Mischief", '纳撒尔恶作剧'),
                ('Negative Energy Flood', '负能量洪流'),
                ('Nondetection', '回避侦测'),
                ("Nystul's Magic Aura", '涅斯图魔法灵光'),
                ("Otiluke's Freezing Sphere", '欧提路克冰封法球'),
                ("Otiluke's Resilient Sphere", '欧提路克弹力法球'),
                ("Otto's Irresistible Dance", '奥图迷舞'),
                ('Pass Without Trace', '行动无踪'),
                ('Pass without Trace', '无踪步'),
                ('Passwall', '穿墙术'),
                ('Phantasmal Force', '魅影之力'),
                ('Phantasmal Killer', '魅影杀手'),
                ('Phantom Steed', '魅影驹'),
                ('Planar Ally', '异界誓盟'),
                ('Planar Binding', '异界誓缚'),
                ('Plane Shift', '异界传送'),
                ('Plant Growth', '植物滋长'),
                ('Poison Spray', '毒气喷吐'),
                ('Polymorph', '变形术'),
                ('Power Word Heal', '律令医疗'),
                ('Power Word Kill', '力量台词杀'),
                ('Power Word Pain', '律令痛苦'),
                ('Power Word Stun', '力量台词震慑'),
                ('Prayer of Healing', '治疗祷念'),
                ('Prestidigitation', '魔法戏法'),
                ('Primal Savagery', '原初蛮击'),
                ('Primordial Ward', '原初守护'),
                ('Prismatic Spray', '虹光喷射'),
                ('Prismatic Wall', '虹光法墙'),
                ('Produce Flame', '燃火术'),
                ('Programmed Illusion', '预置幻术'),
                ('Project Image', '投影术'),
                ('Protection From Energy', '防护能量'),
                ('Protection from Energy', '防护能量'),
                ('Protection from Evil and Good', '防护善恶'),
                ('Protection from Poison', '防护毒素'),
                ('Psychic Scream', '心灵尖啸'),
                ('Pulse Wave', '脉冲波动'),
                ('Purify Food and Drink', '净化食粮'),
                ('Pyrotechnics', '烟火'),
                ('Raise Dead', '死者复活'),
                ("Rary's Telepathic Bond", '拉瑞心灵联结'),
                ("Raulothim's Psychic Lance", '劳洛希姆心灵长枪'),
                ('Ravenous Void', '饕餮虚空'),
                ('Ray of Enfeeblement', '衰弱射线'),
                ('Ray of Frost', '霜冻射线'),
                ('Ray of Sickness', '致病射线'),
                ('Reality Break', '崩坏现实'),
                ('Regenerate', '再生术'),
                ('Reincarnate', '转生术'),
                ('Remove Curse', '移除诅咒'),
                ('Resistance', '抗力术'),
                ('Resurrection', '复活术'),
                ('Reverse Gravity', '重力逆转'),
                ('Revivify', '复生术'),
                ("Rime's Binding Ice", '雾凇霜缚'),
                ('Rope Trick', '魔绳术'),
                ('Sacred Flame', '圣火'),
                ('Sanctuary', '圣域'),
                ('Sapping Sting', '削弱芒刺'),
                ('Scatter', '分散术'),
                ('Scorching Ray', '灼热射线'),
                ('Scrying', '探知'),
                ('Searing Smite', '炽焰斩'),
                ('See Invisibility', '看清隐形'),
                ('Seeming', '伪装术'),
                ('Sending', '短讯术'),
                ('Sequester', '隔离术'),
                ('Shadow Blade', '幽影刃'),
                ('Shadow of Moil', '莫伊之影'),
                ('Shape Water', '操水'),
                ('Shapechange', '形态变化'),
                ('Shatter', '粉碎术'),
                ('Shield', '护盾术'),
                ('Shield of Faith', '信仰之盾'),
                ('Shillelagh', '橡棍术'),
                ('Shocking Grasp', '电击'),
                ('Sickening Radiance', '致病辐射'),
                ('Silence', '沉默术'),
                ('Silent Image', '无声幻影'),
                ('Silvery Barbs', '银光锐语'),
                ('Simulacrum', '拟像术'),
                ('Skill Empowerment', '授予技能'),
                ('Skywrite', '写入空中'),
                ('Sleep', '睡眠术'),
                ('Sleet Storm', '雪雨暴'),
                ('Slow', '减慢术'),
                ('Snare', '圈套术'),
                ("Snilloc's Snowball Storm", '斯尼洛克雪球风暴'),
                ("Snilloc's Snowball Swarm", '史尼洛雪球群'),
                ('Soul Cage', '灵魂牢笼'),
                ('Spare the Dying', '挽救濒死'),
                ('Speak with Animals', '动物交谈'),
                ('Speak with Dead', '死者交谈'),
                ('Speak with Plants', '植物交谈'),
                ('Spider Climb', '蛛爬术'),
                ('Spike Growth', '尖刺生长'),
                ('Spirit Guardians', '灵体守卫'),
                ('Spirit Shroud', '魂灵环绕'),
                ('Spiritual Weapon', '灵体武器'),
                ('Staggering Smite', '惊惧斩'),
                ('Steel Wind Strike', '钢风斩'),
                ('Stinking Cloud', '臭云术'),
                ('Stone Shape', '塑石术'),
                ('Stoneskin', '石肤术'),
                ('Storm Sphere', '暴风球'),
                ('Storm of Vengeance', '复仇风暴'),
                ('Suggestion', '暗示术'),
                ('Summon Aberration', '异怪召唤术'),
                ('Summon Beast', '野兽召唤术'),
                ('Summon Celestial', '天界召唤术'),
                ('Summon Construct', '构装召唤术'),
                ('Summon Draconic Spirit', '龙类精魂召唤术'),
                ('Summon Elemental', '元素召唤术'),
                ('Summon Fey', '精类召唤术'),
                ('Summon Fiend', '邪魔召唤术'),
                ('Summon Greater Demon', '高阶恶魔召唤术'),
                ('Summon Lesser Demon', '低阶恶魔召唤术'),
                ('Summon Shadowspawn', '暗影衍体召唤术'),
                ('Summon Undead', '不死召唤术'),
                ('Sunbeam', '阳炎射线'),
                ('Sunburst', '阳炎爆'),
                ('Swift Quiver', '迅捷箭袋'),
                ('Sword Burst', '剑爆'),
                ('Symbol', '徽记术'),
                ('Synaptic Static', '突触静止'),
                ("Tasha's Caustic Brew", '塔莎酸蚀酿'),
                ("Tasha's Hideous Laughter", '塔莎狂笑术'),
                ("Tasha's Mind Whip", '塔莎心灵鞭'),
                ("Tasha's Otherworldly Guise", '塔莎超凡形态'),
                ('Telekinesis', '心灵遥控'),
                ('Telepathy', '心灵感应'),
                ('Teleport', '传送术'),
                ('Teleportation Circle', '传送法阵'),
                ('Temple of the Gods', '神庙术'),
                ('Temporal Shunt', '时流刹转'),
                ("Tenser's Floating Disk", '谭森浮碟术'),
                ("Tenser's Transformation", '谭森变化术'),
                ('Tether Essence', '系结本源'),
                ('Thaumaturgy', '奇术'),
                ('Thorn Whip', '荆棘之鞭'),
                ('Thunder Step', '雷霆步'),
                ('Thunderclap', '雷鸣掌'),
                ('Thunderous Smite', '雷鸣斩'),
                ('Thunderwave', '雷鸣波'),
                ('Tidal Wave', '潮涌'),
                ('Time Ravage', '时光蹂躏'),
                ('Time Stop', '时间停止'),
                ('Tiny Servant', '迷你仆役'),
                ('Toll the Dead', '召唤亡者'),
                ('Tongues', '巧言术'),
                ('Transmute Rock', '转化岩石'),
                ('Transport via Plants', '木遁术'),
                ('Tree Stride', '树跃术'),
                ('True Polymorph', '完全变形术'),
                ('True Resurrection', '真复活术'),
                ('True Seeing', '真知术'),
                ('True Strike', '真知斩'),
                ('Tsunami', '海啸术'),
                ('Unseen Servant', '隐形侍从'),
                ('Vampiric Touch', '吸血鬼之触'),
                ('Vicious Mockery', '恶言相加'),
                ('Vitriolic Sphere', '浓酸球'),
                ('Vortex Warp', '涡旋翘曲'),
                ('Wall of Fire', '火墙术'),
                ('Wall of Force', '力场墙'),
                ('Wall of Ice', '冰墙术'),
                ('Wall of Light', '光墙术'),
                ('Wall of Sand', '沙墙术'),
                ('Wall of Stone', '石墙术'),
                ('Wall of Thorns', '棘墙术'),
                ('Wall of Water', '水墙术'),
                ('Warding Bond', '守护联结'),
                ('Warding Wind', '守护之风'),
                ('Water Breathing', '水下呼吸'),
                ('Water Walk', '水上行走'),
                ('Watery Sphere', '碧水球'),
                ('Web', '蛛网术'),
                ('Weird', '怪影杀手'),
                ('Whirlwind', '旋风'),
                ('Wind Walk', '御风而行'),
                ('Wind Wall', '风墙术'),
                ('Wish', '祈愿术'),
                ('Witch Bolt', '女巫箭'),
                ('Wither and Bloom', '靡叶生华'),
                ('Word of Radiance', '光耀之言'),
                ('Word of Recall', '回返真言'),
                ('Wrath of Nature', '自然之怒'),
                ('Wrathful Smite', '激愤斩'),
                ('Wristpocket', '魔袋术'),
                ('Zephyr Strike', '西风打击'),
                ('Zone of Truth', '真相领域')])

# =============================================================================
#  Helpers
# =============================================================================

def load_detail(cat: str, index: str):
    p = os.path.join(PULL, cat, f"{index}.json")
    if not os.path.exists(p):
        return None
    try:
        with open(p, encoding="utf-8") as f:
            return json.load(f)
    except Exception:  # noqa: BLE001
        return None


def cr_to_str(cr):
    try:
        cr = float(cr)
    except (TypeError, ValueError):
        return str(cr)
    if cr == 0:
        return "0"
    if cr == 0.125:
        return "1/8"
    if cr == 0.25:
        return "1/4"
    if cr == 0.5:
        return "1/2"
    if abs(cr - round(cr)) < 1e-9:
        return str(int(round(cr)))
    return str(cr)


def tx_name(token, mapping, fallback=None):
    if token is None:
        return fallback if fallback is not None else token
    return mapping.get(token.lower(), token if fallback is None else fallback)


def conv_speed(speed: dict) -> str:
    if not speed:
        return "—"
    parts = []
    order = [("walk", ""), ("burrow", "掘地 "), ("climb", "爬 "), ("fly", "飞行 "),
             ("swim", "游泳 "), ("hover", "悬浮 ")]
    for key, prefix in order:
        v = speed.get(key)
        if v:
            parts.append(f"{prefix}{v}")
    return ", ".join(parts) if parts else "—"


def conv_senses(m: dict, senses) -> str:
    if isinstance(senses, list):
        parts = []
        for s in senses:
            if isinstance(s, dict):
                parts.append(f"{s.get('name', '')} {s.get('value', '')}".strip())
            else:
                parts.append(str(s))
        senses = ", ".join(parts)
    if not isinstance(senses, str):
        senses = str(senses)
    s = senses or ""
    for en, cn in SENSE.items():
        s = re.sub(re.escape(en), cn, s, flags=re.IGNORECASE)
    # ensure passive perception present
    pp = m.get("passive_perception")
    if pp and "被动察觉" not in s:
        s = (s + f", 被动察觉 {pp}").strip(", ")
    return s or "—"


def conv_languages(lang) -> str:
    if not lang:
        return "—"
    if isinstance(lang, list):
        lang = ", ".join(str(x) for x in lang)
    if not isinstance(lang, str):
        lang = str(lang)
    out = []
    for piece in lang.split(","):
        piece = piece.strip()
        out.append(LANG.get(piece.lower(), piece))
    return ", ".join(out) if out else "—"


def conv_dmg_tokens(lst) -> list:
    if not lst:
        return []
    res = []
    for item in lst:
        if isinstance(item, dict):
            name = item.get("name", "")
        else:
            name = item
        # name may be a combined string ("bludgeoning, piercing, and slashing from ...")
        for tok in re.split(r",| and ", name):
            tok = tok.strip().lower()
            if not tok:
                continue
            if tok in DMG:
                res.append(DMG[tok])
            else:
                # keep a cleaned token (strip trailing phrases)
                tok = re.sub(r"\s+from.*$", "", tok).strip()
                if tok:
                    res.append(tok)
    # dedupe preserve order
    seen, uniq = set(), []
    for r in res:
        if r not in seen:
            seen.add(r); uniq.append(r)
    return uniq


def conv_cond_tokens(lst) -> list:
    if not lst:
        return []
    res = []
    for item in lst:
        name = item.get("name", "") if isinstance(item, dict) else str(item)
        res.append(COND_EN2CN.get(name.lower(), name))
    return res


def conv_skills(skills: dict) -> dict:
    if not skills:
        return {}
    out = {}
    for k, v in skills.items():
        out[SKILL.get(k.lower(), k)] = v
    return out


def conv_actions(actions: list) -> list:
    out = []
    for a in actions or []:
        name = a.get("name", "")
        desc = a.get("desc", "") or ""
        atk = a.get("attack_bonus")
        if atk is None:
            atk = 0
        dmg = ""
        dtype = ""
        dmg_list = a.get("damage") or []
        if dmg_list:
            d0 = dmg_list[0]
            dmg = d0.get("damage_dice", "") or ""
            dtype = tx_name((d0.get("damage_type") or {}).get("name"), DMG, "")
        m = re.search(r"(?:reach|range)\s*([\d]+(?:/[\d]+)?\s*ft)", desc, re.I)
        reach = m.group(1) if m else "5 ft"
        out.append({"name": name, "atk": atk, "reach": reach,
                    "dmg": dmg, "type": dtype, "extra": desc})
    return out


# =============================================================================
#  Converters
# =============================================================================

def conv_monster(m: dict) -> dict:
    align = m.get("alignment", "")
    if isinstance(align, list):
        align = ", ".join(align)
    align = tx_name(align, ALIGN, align)

    ac_list = m.get("armor_class") or [{}]
    ac = ac_list[0].get("value", 10) if ac_list else 10
    ac_note = ""
    if ac_list and ac_list[0].get("armor"):
        armor = ac_list[0]["armor"]
        if isinstance(armor, list):
            ac_note = ", ".join(a.get("name", str(a)) if isinstance(a, dict) else str(a) for a in armor)
        else:
            ac_note = str(armor)
    elif ac_list and ac_list[0].get("type"):
        ac_note = ac_list[0]["type"]

    hp = m.get("hit_points")
    hd = m.get("hit_dice", "")
    hp_str = f"{hp} ({hd})" if hd else str(hp)

    stats = {k: m.get(k, 10) for k in ("str", "dex", "con", "int", "wis", "cha")}
    saves = m.get("saves") or {}
    skills = conv_skills(m.get("skills") or {})
    resist = conv_dmg_tokens(m.get("damage_resistances") or [])
    immune = conv_dmg_tokens(m.get("damage_immunities") or [])
    vuln = conv_dmg_tokens(m.get("damage_vulnerabilities") or [])
    cond_immune = conv_cond_tokens(m.get("condition_immunities") or [])

    rec = OrderedDict()
    rec["en"] = m.get("name")  # 保留 SRD 原始英文名，便于按英文名查表/外部集成
    rec["size"] = SIZE.get(m.get("size", ""), m.get("size", ""))
    rec["type"] = TYPE.get(m.get("type", ""), m.get("type", ""))
    rec["alignment"] = align
    rec["ac"] = ac
    if ac_note:
        rec["ac_note"] = ac_note
    rec["hp"] = hp_str
    rec["speed"] = conv_speed(m.get("speed") or {})
    rec.update(stats)
    if saves:
        rec["saves"] = saves
    if skills:
        rec["skills"] = skills
    if resist:
        rec["resist"] = resist
    if immune:
        rec["immune"] = immune
    if vuln:
        rec["vuln"] = vuln
    if cond_immune:
        rec["cond_immune"] = cond_immune
    rec["senses"] = conv_senses(m, m.get("senses") or "")
    rec["languages"] = conv_languages(m.get("languages"))
    rec["cr"] = cr_to_str(m.get("challenge_rating", 0))
    rec["traits"] = [[t.get("name", ""), t.get("desc", "")] for t in (m.get("special_abilities") or [])]
    rec["actions"] = conv_actions(m.get("actions") or [])
    if m.get("bonus_actions"):
        rec["bonus_actions"] = conv_actions(m.get("bonus_actions"))
    if m.get("reactions"):
        rec["reactions"] = conv_actions(m.get("reactions"))
    if m.get("legendary_actions"):
        rec["legendary"] = conv_actions(m.get("legendary_actions"))
    return rec


def conv_spell(s: dict) -> dict:
    level = s.get("level", 0)
    school = tx_name((s.get("school") or {}).get("name"), SCHOOL,
                     (s.get("school") or {}).get("name", ""))
    comp = s.get("components") or []
    save = None
    dc = s.get("dc")
    if dc:
        save = tx_name((dc.get("dc_type") or {}).get("name"), SAVE_ATTR, None)
    damage = None
    dtype = ""
    dmg = s.get("damage")
    if dmg:
        dsl = dmg.get("damage_at_slot_level") or {}
        damage = dsl.get(str(level)) or (list(dsl.values())[-1] if dsl else None)
        dtype = tx_name((dmg.get("damage_type") or {}).get("name"), DMG, "")
    rec = OrderedDict()
    rec["en"] = s.get("name")  # 保留 SRD 原始英文名，便于按英文名查表/外部集成
    rec["level"] = level
    rec["school"] = school
    rec["time"] = s.get("casting_time", "")
    rec["range"] = s.get("range", "")
    rec["comp"] = comp
    rec["dur"] = s.get("duration", "")
    rec["save"] = save
    rec["damage"] = damage
    rec["type"] = dtype
    rec["desc"] = "\n".join(s.get("desc") or [])
    return rec


def conv_item(it: dict) -> dict:
    rarity = tx_name((it.get("rarity") or {}).get("name"), RARITY,
                     (it.get("rarity") or {}).get("name", ""))
    ec = it.get("equipment_category") or {}
    itype = ITEMTYPE.get(ec.get("name", "").lower(), ec.get("name", ""))
    att = it.get("requires_attunement")
    if att is None:
        d = " ".join(it.get("desc") or [])
        att = "需绑定" if "requires attunement" in d.lower() else False
    rec = OrderedDict()
    rec["rarity"] = rarity
    rec["type"] = itype
    rec["attunement"] = att
    rec["desc"] = "\n".join(it.get("desc") or [])
    return rec


# =============================================================================
#  Conditions: keep D20 penalty model, attach API name + official prose
# =============================================================================
CONDITION_PENALTY = {
    "目盲": {"attack": -2, "save": 0, "check": 0, "auto_fail": ["vis"],
             "special": "攻击检定劣势；受攻击时攻击者获优势；所有依赖视觉的检定自动失败。",
             "ends_on": "治疗/解除目盲法术；回合结束若原因为咒法则可能豁免。"},
    "魅惑": {"attack": 0, "save": 0, "check": 0, "auto_fail": [],
             "special": "不能攻击魅惑来源；魅惑来源对其进行的社交技能检定获优势。",
             "ends_on": "魅惑来源伤害该生物；法术/效应自然结束。"},
    "耳聋": {"attack": 0, "save": 0, "check": 0, "auto_fail": ["aud"],
             "special": "所有依赖听觉的检定自动失败。",
             "ends_on": "治疗/解除耳聋法术。"},
    "惊惧": {"attack": -2, "save": -2, "check": -2, "auto_fail": [],
             "special": "恐惧来源方向的所有检定与攻击劣势；不能主动接近来源；来源 30 尺内无法自愿移动。",
             "ends_on": "来源不可见或超出 60 尺；效应结束。"},
    "擒抱": {"attack": 0, "save": 0, "check": 0, "auto_fail": [], "speed": 0,
             "special": "速度变为 0 且无法获得速度加值；无法移动到擒抱者不允许之处；可用力量(运动)/敏捷(体操)检定挣脱。",
             "ends_on": "擒抱者放开或被打倒/传走；效应结束。"},
    "失能": {"attack": 0, "save": 0, "check": 0, "auto_fail": [],
             "special": "不能执行动作或反应；不能说话；许多其他条件（麻痹/震慑/昏迷等）隐含失能。",
             "ends_on": "源效应结束。"},
    "隐形": {"attack": 0, "save": 0, "check": 0, "auto_fail": [],
             "special": "攻击获得优势；受攻击时攻击者处于劣势（看不清目标）；依赖视觉的感知检定需靠听觉/其他线索。",
             "ends_on": "攻击/受击后常短暂显形；法术/效应结束。"},
    "麻痹": {"attack": 0, "save": 0, "check": 0, "auto_fail": ["str_save", "dex_save"],
             "special": "失能；5 尺内攻击者获优势；对受击者的近战攻击命中即视为重击；力量/敏捷豁免自动失败。",
             "ends_on": "源效应结束。"},
    "石化": {"attack": 0, "save": 0, "check": 0, "auto_fail": ["str_save", "dex_save"],
             "special": "失能；对一切伤害具抗性；重量增为 10 倍；无法移动/说话/感知；力量/敏捷豁免自动失败。",
             "ends_on": "解石化法术；源效应结束。"},
    "中毒": {"attack": -2, "save": -2, "check": -2, "auto_fail": [],
             "special": "攻击检定劣势；属性检定劣势。",
             "ends_on": "毒效持续结束；解毒/医疗检定成功。"},
    "倒地": {"attack": 0, "save": 0, "check": 0, "auto_fail": [],
             "special": "5 尺内近战攻击对其获优势、远程攻击对其处劣势；移动速度减半；起身需 1 个动作。",
             "ends_on": "起身动作；被扶起；效应结束。"},
    "束缚": {"attack": -2, "save": 0, "check": 0, "auto_fail": [],
             "special": "攻击检定劣势；攻击者对其获优势；速度 0；对抗其的敏捷豁免处劣势。",
             "ends_on": "挣脱（力量/敏捷检定）；移动效应结束。"},
    "震慑": {"attack": -2, "save": -2, "check": -2, "auto_fail": [],
             "special": "失能；攻击检定劣势；受攻击时攻击者获优势。",
             "ends_on": "源效应结束。"},
    "昏迷": {"attack": 0, "save": 0, "check": 0, "auto_fail": ["str_save", "dex_save"],
             "special": "倒地且失能；5 尺内攻击者获优势；对其的近战攻击命中即重击；力量/敏捷豁免自动失败；不知攻击来源方位。",
             "ends_on": "恢复生命/法术唤醒；源效应结束。"},
    "力竭": {"attack": 0, "save": 0, "check": 0, "auto_fail": [], "levels": 6,
             "special": "六级累积状态：每级叠加惩罚（1 级-优势检定劣势；2 级-速度减半；3 级-攻击/豁免劣势；"
                        "4 级-最大 HP 减半；5 级-速度 0；6 级-死亡）。完成长休可减 1 级（除非源于诅咒/不眠）。",
             "ends_on": "长休减 1 级；特定来源需更高阶解除。"},
}


def conv_condition(c: dict) -> dict:
    en = c.get("name", "")
    cn = COND_EN2CN.get(en.lower())
    if not cn or cn not in CONDITION_PENALTY:
        return None
    p = CONDITION_PENALTY[cn]
    rec = OrderedDict()
    rec["en"] = en
    rec["attack"] = p["attack"]
    rec["save"] = p["save"]
    rec["check"] = p["check"]
    rec["auto_fail"] = p["auto_fail"]
    if "speed" in p:
        rec["speed"] = p["speed"]
    if "levels" in p:
        rec["levels"] = p["levels"]
    rec["special"] = p["special"]
    rec["ends_on"] = p["ends_on"]
    rec["desc_en"] = "\n".join(c.get("desc") or [])
    return rec


# =============================================================================
#  CR_XP table (unchanged; CR string -> XP)
# =============================================================================
CR_XP = {
    "0": 10, "1/8": 25, "1/4": 50, "1/2": 100,
    "1": 200, "2": 450, "3": 700, "4": 1100, "5": 1800, "6": 2300, "7": 2900,
    "8": 3900, "9": 5000, "10": 5900, "11": 7200, "12": 8400, "13": 10000,
    "14": 11500, "15": 13000, "16": 15000, "17": 18000, "18": 20000, "19": 22000,
    "20": 25000, "21": 33000, "22": 41000, "23": 50000, "24": 62000, "25": 75000,
    "26": 90000, "27": 105000, "28": 120000, "29": 135000, "30": 155000,
}


# =============================================================================
#  EN2CN 缺口补全层（全量中文化）
#  来源：dndlogs.com《怪物清单》2014-MM 中英对照（野兽/NPC/幼龙/兽化人/吸血鬼形态/
#        虫群等 96 条） + huijiwiki 法术列表（21 条附发明式法术） + 与源同源体系的
#        标准 D&D 5e 中文译名（幼龙/兽化形态/吸血鬼形态/特定虫群等可派生条目）。
#  作用：上一层 EN2CN 已含 238 怪物/298 法术；本层补齐剩余 96 怪物/21 法术，
#        使 SRD 334 怪物 + 319 法术达到 100% 中文键覆盖。
#  诚实声明：dndlogs 未收录的特定虫群（甲虫/蜈蚣/蜘蛛/黄蜂）及幼龙/兽化/吸血鬼形态
#        采用与权威源同源体系的标准译名派生，非臆造；其余均直接取自 dndlogs/huijiwiki。
# =============================================================================

EN2CN_MON_GAP = OrderedDict([   ('Androsphinx', '男面斯芬克斯'),
    ('Ape', '猿'),
    ('Awakened Shrub', '启蒙灌木'),
    ('Awakened Tree', '启蒙树木'),
    ('Black Dragon Wyrmling', '黑龙幼龙'),
    ('Blood Hawk', '血鹰'),
    ('Blue Dragon Wyrmling', '蓝龙幼龙'),
    ('Brass Dragon Wyrmling', '黄铜龙幼龙'),
    ('Bronze Dragon Wyrmling', '青铜龙幼龙'),
    ('Camel', '骆驼'),
    ('Copper Dragon Wyrmling', '红铜龙幼龙'),
    ('Cult Fanatic', '邪教狂热者'),
    ('Deep Gnome (Svirfneblin)', '地底侏儒'),
    ('Draft Horse', '驼用马'),
    ('Dretch', '小恶魔'),
    ('Drow', '卓尔'),
    ('Duergar', '灰矮人'),
    ('Dust Mephit', '尘魔蝠'),
    ('Elk', '驼鹿'),
    ('Flying Snake', '飞蛇'),
    ('Giant Ape', '巨猿'),
    ('Giant Badger', '巨獾'),
    ('Giant Bat', '巨蝙蝠'),
    ('Giant Centipede', '巨蜈蚣'),
    ('Giant Crab', '巨蟹'),
    ('Giant Elk', '巨驼鹿'),
    ('Giant Fire Beetle', '巨火甲虫'),
    ('Giant Lizard', '巨蜥'),
    ('Giant Rat (Diseased)', '巨鼠（染病）'),
    ('Giant Sea Horse', '巨海马'),
    ('Giant Vulture', '巨秃鹫'),
    ('Goat', '山羊'),
    ('Gold Dragon Wyrmling', '金龙幼龙'),
    ('Green Dragon Wyrmling', '绿龙幼龙'),
    ('Gynosphinx', '女面斯芬克斯'),
    ('Half-Red Dragon Veteran', '半红龙老兵'),
    ('Hunter Shark', '寻猎鲨'),
    ('Ice Mephit', '冰魔蝠'),
    ('Killer Whale', '虎鲸'),
    ('Magma Mephit', '熔岩魔蝠'),
    ('Mammoth', '猛犸'),
    ('Mastiff', '獒犬'),
    ('Minotaur', '牛头人'),
    ('Minotaur Skeleton', '骷髅牛头人'),
    ('Mummy', '木乃伊'),
    ('Mummy Lord', '木乃伊领主'),
    ('Ogre Zombie', '食人魔僵尸'),
    ('Panther', '黑豹'),
    ('Plesiosaurus', '蛇颈龙'),
    ('Pony', '矮种马'),
    ('Quipper', '食人鱼'),
    ('Red Dragon Wyrmling', '红龙幼龙'),
    ('Reef Shark', '礁鲨'),
    ('Remorhaz', '百足魔兽'),
    ('Riding Horse', '乘用马'),
    ('Saber-Toothed Tiger', '剑齿虎'),
    ('Shrieker', '尖叫蕈'),
    ('Silver Dragon Wyrmling', '银龙幼龙'),
    ('Steam Mephit', '蒸汽魔蝠'),
    ('Succubus/Incubus', '魅魔'),
    ('Swarm of Bats', '蝙蝠群'),
    ('Swarm of Beetles', '甲虫群'),
    ('Swarm of Centipedes', '蜈蚣群'),
    ('Swarm of Insects', '虫群'),
    ('Swarm of Poisonous Snakes', '毒蛇群'),
    ('Swarm of Quippers', '食人鱼群'),
    ('Swarm of Rats', '鼠群'),
    ('Swarm of Ravens', '渡鸦群'),
    ('Swarm of Spiders', '蜘蛛群'),
    ('Swarm of Wasps', '黄蜂群'),
    ('Tribal Warrior', '部族武者'),
    ('Vampire Spawn', '吸血鬼衍体'),
    ('Vampire, Bat Form', '吸血鬼（蝠形）'),
    ('Vampire, Mist Form', '吸血鬼（雾形）'),
    ('Vampire, Vampire Form', '吸血鬼（吸血鬼形态）'),
    ('Veteran', '老兵'),
    ('Violet Fungus', '紫蕈'),
    ('Warhorse', '战马'),
    ('Warhorse Skeleton', '战马骷髅'),
    ('Werebear, Bear Form', '熊人（熊形）'),
    ('Werebear, Human Form', '熊人（人形）'),
    ('Werebear, Hybrid Form', '熊人（混合形）'),
    ('Wereboar, Boar Form', '野猪人（猪形）'),
    ('Wereboar, Human Form', '野猪人（人形）'),
    ('Wereboar, Hybrid Form', '野猪人（混合形）'),
    ('Wererat, Human Form', '鼠人（人形）'),
    ('Wererat, Hybrid Form', '鼠人（混合形）'),
    ('Wererat, Rat Form', '鼠人（鼠形）'),
    ('Weretiger, Human Form', '虎人（人形）'),
    ('Weretiger, Hybrid Form', '虎人（混合形）'),
    ('Weretiger, Tiger Form', '虎人（虎形）'),
    ('Werewolf, Human Form', '狼人（人形）'),
    ('Werewolf, Hybrid Form', '狼人（混合形）'),
    ('Werewolf, Wolf Form', '狼人（狼形）'),
    ('White Dragon Wyrmling', '白龙幼龙'),
    ("Will-o'-Wisp", '鬼火')])

EN2CN_SPELL_GAP = OrderedDict([   ('Acid Arrow', '马友夫强酸箭'),
    ('Antipathy/Sympathy', '嫌恶术/关怀术'),
    ('Arcane Hand', '毕格比之手'),
    ('Arcane Sword', '毕格比之剑'),
    ("Arcanist's Magic Aura", '涅斯图魔法灵光'),
    ('Black Tentacles', '艾伐黑触手'),
    ('Blindness/Deafness', '目盲术/耳聋术'),
    ('Enlarge/Reduce', '变巨术/缩小术'),
    ('Faithful Hound', '魔邓肯忠犬'),
    ('Floating Disk', '谭森浮碟术'),
    ('Freezing Sphere', '欧提路克冰封法球'),
    ("Heroes' Feast", '英雄宴'),
    ('Hideous Laughter', '塔莎狂笑术'),
    ('Instant Summons', '卓姆吉瞬间召唤'),
    ('Irresistible Dance', '奥图迷舞'),
    ('Magnificent Mansion', '魔邓肯豪宅术'),
    ('Private Sanctum', '魔邓肯私人密室'),
    ('Resilient Sphere', '欧提路克弹力法球'),
    ('Secret Chest', '李欧蒙秘藏箱'),
    ('Telepathic Bond', '拉瑞心灵联结'),
    ('Tiny Hut', '李欧蒙小屋')])

# =============================================================================
#  Build
# =============================================================================

def build():
    # ---- merge gap layer (full Chinese coverage) ----
    EN2CN_MON_FULL = dict(EN2CN_MON); EN2CN_MON_FULL.update(EN2CN_MON_GAP)
    EN2CN_SPELL_FULL = dict(EN2CN_SPELL); EN2CN_SPELL_FULL.update(EN2CN_SPELL_GAP)

    # ---- monsters ----
    MONSTERS = OrderedDict()
    idx = json.load(open(os.path.join(PULL, "monsters_idx.json"), encoding="utf-8"))
    for e in idx["results"]:
        m = load_detail("monsters", e["index"])
        if not m:
            continue
        rec = conv_monster(m)
        key = EN2CN_MON_FULL.get(m.get("name"), m.get("name"))
        if key in MONSTERS:  # 防御：中文键冲突时追加英文原名消歧，避免静默丢条目
            key = f"{key}（{m.get('name')}）"
        MONSTERS[key] = rec

    # ---- spells ----
    SRD_SPELLS = OrderedDict()
    SRD_SPELL_RINGS = OrderedDict()
    idx = json.load(open(os.path.join(PULL, "spells_idx.json"), encoding="utf-8"))
    for e in idx["results"]:
        s = load_detail("spells", e["index"])
        if not s:
            continue
        rec = conv_spell(s)
        key = EN2CN_SPELL_FULL.get(s.get("name"), s.get("name"))
        if key in SRD_SPELLS:  # 防御：中文键冲突时追加英文原名消歧，避免静默丢条目
            key = f"{key}（{s.get('name')}）"
        SRD_SPELLS[key] = rec
        SRD_SPELL_RINGS[key] = rec["level"]

    # ---- magic items ----
    MAGIC_ITEMS = OrderedDict()
    idx = json.load(open(os.path.join(PULL, "magicitems_idx.json"), encoding="utf-8"))
    for e in idx["results"]:
        it = load_detail("magicitems", e["index"])
        if not it:
            continue
        MAGIC_ITEMS[it.get("name", e["index"])] = conv_item(it)

    # ---- conditions ----
    CONDITIONS = OrderedDict()
    idx = json.load(open(os.path.join(PULL, "conditions_idx.json"), encoding="utf-8"))
    for e in idx["results"]:
        c = load_detail("conditions", e["index"])
        if not c:
            continue
        rec = conv_condition(c)
        if rec:
            CONDITIONS[COND_EN2CN[c["name"].lower()]] = rec

    return MONSTERS, SRD_SPELLS, SRD_SPELL_RINGS, MAGIC_ITEMS, CONDITIONS


def fmt(obj):
    return pprint.pformat(obj, width=120, sort_dicts=False, indent=1)


def write_file(path, header, body_assignments: list):
    with open(path, "w", encoding="utf-8") as f:
        f.write(header)
        f.write("from collections import OrderedDict\n")
        for var, val in body_assignments:
            f.write(f"\n{var} = {fmt(val)}\n")


def main():
    MONSTERS, SRD_SPELLS, SRD_SPELL_RINGS, MAGIC_ITEMS, CONDITIONS = build()

    # data_monsters.py
    write_file(
        os.path.join(OUT, "data_monsters.py"),
        '''"""d20.data_monsters - D&D 5e SRD 怪物图鉴（全量，由权威 API 转换）

来源：D&D 5e SRD《Monster Manual》公开内容，经 dnd5eapi.co/api/2014/monsters
（官方 REST API）拉取全部 334 个怪物的规范化 JSON，由 gen_srd_from_api.py
转换为本格式。枚举字段（体型/种类/阵营/伤害类型）已翻译为中文；条目名默认
使用权威英文原名，少量 D20 界面/测试引用的条目提供中文键（见 EN2CN 映射）。

字段结构见模块顶部类型说明；CR 数值由 API 的 challenge_rating 推导为字符串并
查 CR_XP 得 XP。本文件由脚本生成，勿手工编辑——改 Python 侧后重跑生成脚本。
"""\nfrom __future__ import annotations\n''',
        [("CR_XP", CR_XP), ("MONSTERS", MONSTERS)],
    )

    # data_spells.py
    write_file(
        os.path.join(OUT, "data_spells.py"),
        '''"""d20.data_spells - D&D 5e SRD 法术名册（全谱 0–9 环，由权威 API 转换）

来源：dnd5eapi.co/api/2014/spells（官方 REST API）拉取全部法术规范化 JSON，
由 gen_srd_from_api.py 转换。枚举字段（学派/伤害类型/豁免属性）已译中文；
条目名默认英文原名，少数条目（火球术/魔法飞弹/火焰箭/治疗言灵…）提供中文键。

字段：level 环位(0=戏法) / school 学派 / time 施法时间 / range 射程 /
comp 成分[V/S/M] / dur 持续 / save 豁免属性 / damage 伤害骰 / type 伤害类型 /
desc 效果摘要（英文，取自 API）。SRD_SPELL_RINGS 为 name->环位 供法术位系统消费。
本文件由脚本生成，勿手工编辑。
"""\nfrom __future__ import annotations\n''',
        [("SRD_SPELLS", SRD_SPELLS), ("SRD_SPELL_RINGS", SRD_SPELL_RINGS)],
    )

    # data_magicitems.py
    write_file(
        os.path.join(OUT, "data_magicitems.py"),
        '''"""d20.data_magicitems - D&D 5e DMG 魔法物品（全量，由权威 API 转换）

来源：dnd5eapi.co/api/2014/magic-items（官方 REST API）拉取全部魔法物品规范化
JSON，由 gen_srd_from_api.py 转换。rarirty 已译中文（普通/非普通/稀有/极稀有/
传说/神器）；条目名使用权威英文原名。

字段：rarity 稀有度 / type 类型 / attunement 是否需要同调 / desc 效果摘要（英文）。
本文件由脚本生成，勿手工编辑。
"""\nfrom __future__ import annotations\n''',
        [("MAGIC_ITEMS", MAGIC_ITEMS)],
    )

    # data_conditions.py
    write_file(
        os.path.join(OUT, "data_conditions.py"),
        '''"""d20.data_conditions - D&D 5e 官方战斗条件（15 条，由权威 API 核对）

来源：dnd5eapi.co/api/2014/conditions 核对官方 15 条条件名称与说明。
API 仅提供 name + desc 散文；本模块的 attack/save/check/auto_fail 惩罚模型是
D20 自有的规则建模（劣势≈-2 近似），非 API 数据。en 取官方名，desc_en 取官方描述。
"""\nfrom __future__ import annotations\n''',
        [("CONDITIONS", CONDITIONS), ("DISADVANTAGE_PENALTY", -2)],
    )

    cn_mon = sum(1 for k in MONSTERS if k in EN2CN_MON.values())
    cn_spell = sum(1 for k in SRD_SPELLS if k in EN2CN_SPELL.values())
    print("monsters:", len(MONSTERS), "(chinese-keyed:", cn_mon, ")")
    print("spells:", len(SRD_SPELLS), "(chinese-keyed:", cn_spell, ")")
    print("spell_rings:", len(SRD_SPELL_RINGS))
    print("magic_items:", len(MAGIC_ITEMS))
    print("conditions:", len(CONDITIONS))


if __name__ == "__main__":
    main()
