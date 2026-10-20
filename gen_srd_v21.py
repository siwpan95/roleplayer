"""gen_srd_v21.py - 由 _srd_pull/ 权威 JSON 生成 v2.1 SRD 扩充数据模块。

输入：pull_srd.py 从 https://www.dnd5eapi.co/api/2014/ 拉取并落盘的规范化 JSON
      （_srd_pull/{category}/{index}.json，含 12 职业 × 20 级 = 240 条等级记录）。
输出：
      roleplayer/data_classes.py       12 职业 + 12 子职业 + 20 级成长 + 407 特性
      roleplayer/data_equipment_srd.py 237 件 SRD 装备 + 11 条武器属性
      roleplayer/data_proficiencies.py 117 项熟练
      roleplayer/data_reference.py     属性值/阵营/伤害类型/学派/语言/技能/规则/规则章节

译名来源（三层，与 v2.0 怪物/法术中文化同一套方法论）：
  ① _cn_src/hj_*namelist.json —— 灰机 wiki《龙与地下城 TRPG》双语名册（权威对照层）
  ② 脚本内规则派生（去复数/前缀复合/颜色+伤害类型等）
  ③ EN2CN_*_CURATED 手工校订层 —— 优先级最高，杜绝错译

条目键全部中文化，英文原名保留在每条记录的 `en` 字段，官方描述保留在 `desc_en`。
本文件生成的数据模块勿手工编辑——改本脚本后重跑即可。
"""
from __future__ import annotations

import json
import os
import pprint
import re
from collections import OrderedDict

_HERE = os.path.dirname(os.path.abspath(__file__))
PULL = os.path.join(_HERE, "_srd_pull")   # 2026-08-31：原 E:/D20 硬编码改相对
CN = os.path.join(_HERE, "_cn_src")
OUT = os.path.join(_HERE, "roleplayer")


# =============================================================================
#  载入工具
# =============================================================================
def load_dir(cat: str) -> dict:
    """读取 _srd_pull/{cat}/ 下全部明细 JSON，返回 {index: record}。"""
    d = os.path.join(PULL, cat)
    out = {}
    if not os.path.isdir(d):
        return out
    for f in sorted(os.listdir(d)):
        if not f.endswith(".json"):
            continue
        rec = json.load(open(os.path.join(d, f), encoding="utf-8"))
        out[rec.get("index", f[:-5])] = rec
    return out


def load_index(cat: str) -> list:
    """读取类别索引（API 返回顺序即官方文档顺序）。"""
    p = os.path.join(PULL, f"{cat}_idx.json")
    return json.load(open(p, encoding="utf-8"))["results"] if os.path.exists(p) else []


def load_hj(name: str) -> dict:
    """载入灰机 wiki 双语名册 -> {英文名: 中文名}（同名取首个来源）。"""
    p = os.path.join(CN, name)
    if not os.path.exists(p):
        return {}
    data = json.load(open(p, encoding="utf-8"))["data"]
    out = {}
    for r in data:
        out.setdefault(r["name_en"], r["name_zh"])
    return out


HJ_CLASS = load_hj("hj_classnamelist.json")
HJ_ITEM = load_hj("hj_itemnamelist.json")
HJ_SUBCLASS = load_hj("hj_subclassnamelist.json")


# =============================================================================
#  译名映射（curated 覆盖层 / 规则派生）
# =============================================================================
#: 六属性（API 用缩写 STR/DEX/CON/INT/WIS/CHA）
EN2CN_ABILITY = {
    "STR": "力量", "DEX": "敏捷", "CON": "体质",
    "INT": "智力", "WIS": "感知", "CHA": "魅力",
}

#: 六项豁免 -> D20 的三豁免轴（强韧=STR/CON，反射=DEX，意志=INT/WIS/CHA）
SAVE_MAP = {
    "STR": "强韧豁免", "CON": "强韧豁免", "DEX": "反射豁免",
    "INT": "意志豁免", "WIS": "意志豁免", "CHA": "意志豁免",
}

#: SRD 18 技能 -> 项目 SKILL_LIBRARY 既有中文名（保证与技能系统同一命名空间）
EN2CN_SKILL = {
    "Athletics": "运动", "Acrobatics": "杂技", "Sleight of Hand": "手上功夫",
    "Stealth": "躲藏", "Arcana": "奥术知识", "History": "历史",
    "Investigation": "调查", "Nature": "知识(自然)", "Religion": "宗教",
    "Animal Handling": "驯兽", "Insight": "洞察", "Medicine": "医疗",
    "Perception": "侦察", "Survival": "生存", "Deception": "欺瞒",
    "Intimidation": "恐吓", "Performance": "表演", "Persuasion": "说服",
}

#: 职业关键属性（API 不提供，取自 PHB 职业表）
CLASS_PRIMARY = {
    "Barbarian": ["力量"], "Bard": ["魅力"], "Cleric": ["感知"], "Druid": ["感知"],
    "Fighter": ["力量", "敏捷"], "Monk": ["敏捷", "感知"],
    "Paladin": ["力量", "魅力"], "Ranger": ["敏捷", "感知"],
    "Rogue": ["敏捷"], "Sorcerer": ["魅力"], "Warlock": ["魅力"], "Wizard": ["智力"],
}

#: 子职业：API 用短名（Lore/Land/Life…），灰机 wiki 用全名（College of Lore…）。
#: 这里给出 API 短名 -> 灰机 wiki 全名的桥接，中文名一律取自灰机 wiki。
SUBCLASS_FULLNAME = {
    "Berserker": "Path of the Berserker",
    "Lore": "College of Lore",
    "Life": "Life Domain",
    "Land": "Circle of the Land",
    "Champion": "Champion",
    "Open Hand": "Way of the Open Hand",
    "Devotion": "Oath of Devotion",
    "Hunter": "Hunter",
    "Thief": "Thief",
    "Draconic": "Draconic Bloodline",
    "Fiend": "The Fiend",
    "Evocation": "School of Evocation",
}

EN2CN_DAMAGE = {
    "Acid": "酸蚀", "Bludgeoning": "钝击", "Cold": "寒冷", "Fire": "火焰",
    "Force": "力场", "Lightning": "闪电", "Necrotic": "死灵", "Piercing": "穿刺",
    "Poison": "毒素", "Psychic": "心灵", "Radiant": "光耀", "Slashing": "挥砍",
    "Thunder": "雷鸣",
}

EN2CN_SCHOOL = {
    "Abjuration": "防护", "Conjuration": "咒法", "Divination": "预言",
    "Enchantment": "附魔", "Evocation": "塑能", "Illusion": "幻术",
    "Necromancy": "死灵", "Transmutation": "变化",
}

EN2CN_LANG = {
    "Abyssal": "深渊语", "Celestial": "天界语", "Common": "通用语",
    "Deep Speech": "深潜语", "Draconic": "龙语", "Dwarvish": "矮人语",
    "Elvish": "精灵语", "Giant": "巨人语", "Gnomish": "侏儒语", "Goblin": "哥布林语",
    "Halfling": "半身人语", "Infernal": "地狱语", "Orc": "兽人语",
    "Primordial": "原初语", "Sylvan": "木族语", "Undercommon": "地底通用语",
}

EN2CN_ALIGN = {
    "Lawful Good": "守序善良", "Neutral Good": "中立善良", "Chaotic Good": "混乱善良",
    "Lawful Neutral": "守序中立", "Neutral": "绝对中立", "Chaotic Neutral": "混乱中立",
    "Lawful Evil": "守序邪恶", "Neutral Evil": "中立邪恶", "Chaotic Evil": "混乱邪恶",
}

EN2CN_WPROP = {
    "Ammunition": "弹药", "Finesse": "灵巧", "Heavy": "重型", "Light": "轻型",
    "Loading": "装填", "Monk": "武僧", "Reach": "触及", "Special": "特殊",
    "Thrown": "投掷", "Two-Handed": "双手", "Versatile": "多用",
}

EN2CN_RULE = {
    "Adventuring": "冒险", "Appendix": "附录", "Combat": "战斗",
    "Equipment": "装备", "Spellcasting": "施法", "Using Ability Scores": "使用属性值",
}

EN2CN_RULESEC = {
    "Ability Checks": "属性检定",
    "Ability Scores and Modifiers": "属性值与调整值",
    "Actions in Combat": "战斗中的动作",
    "Activating an Item": "激活物品",
    "Advantage and Disadvantage": "优势与劣势",
    "Attunement": "同调",
    "Between Adventures": "冒险之间",
    "Casting a Spell": "施放法术",
    "Cover": "掩护",
    "Damage and Healing": "伤害与治疗",
    "Diseases": "疾病",
    "Fantasy-Historical Pantheons": "奇幻历史神系",
    "Madness": "疯狂",
    "Making an Attack": "进行攻击",
    "Mounted Combat": "骑乘战斗",
    "Movement": "移动",
    "Movement and Position": "移动与位置",
    "Objects": "物件",
    "Poisons": "毒药",
    "Proficiency Bonus": "熟练加值",
    "Resting": "休息",
    "Saving Throws": "豁免检定",
    "Sentient Magic Items": "有智魔法物品",
    "Standard Exchange Rates": "标准兑换率",
    "The Environment": "环境",
    "The Order of Combat": "战斗流程",
    "The Planes of Existence": "存在诸位面",
    "Time": "时间",
    "Traps": "陷阱",
    "Underwater Combat": "水下战斗",
    "Using Each Ability": "使用各项属性",
    "Wearing and Wielding Items": "穿戴与使用物品",
    "What Is a Spell?": "什么是法术？",
}

#: 装备分类
EN2CN_EQCAT = {
    "Adventuring Gear": "冒险装备", "Ammunition": "弹药", "Arcane Foci": "奥术法器",
    "Armor": "护甲", "Artisan's Tools": "工匠工具", "Druidic Foci": "德鲁伊法器",
    "Equipment Packs": "装备包", "Gaming Sets": "赌具", "Heavy Armor": "重甲",
    "Holy Symbols": "圣徽", "Kits": "工具包", "Land Vehicles": "陆地载具",
    "Light Armor": "轻甲", "Martial Melee Weapons": "军用近战武器",
    "Martial Ranged Weapons": "军用远程武器", "Martial Weapons": "军用武器",
    "Medium Armor": "中甲", "Melee Weapons": "近战武器",
    "Mounts and Other Animals": "坐骑与其他动物", "Mounts and Vehicles": "坐骑与载具",
    "Musical Instruments": "乐器", "Other Tools": "其他工具", "Potion": "药水",
    "Ranged Weapons": "远程武器", "Ring": "戒指", "Rod": "法杖（短）", "Scroll": "卷轴",
    "Shields": "盾牌", "Simple Melee Weapons": "简易近战武器",
    "Simple Ranged Weapons": "简易远程武器", "Simple Weapons": "简易武器",
    "Staff": "法杖", "Standard Gear": "标准装备",
    "Tack, Harness, and Drawn Vehicles": "鞍具、挽具与载具",
    "Tools": "工具", "Wand": "魔杖", "Waterborne Vehicles": "水上载具",
    "Weapon": "武器", "Wondrous Items": "奇物",
}

#: 装备中文名 — 灰机 wiki 未覆盖的 77 项手工校订（curated 最高优先级）
EN2CN_EQUIP_CURATED = {
    "Alchemist's fire (flask)": "炼金火（瓶）", "Alms box": "施舍箱",
    "Animal Feed (1 day)": "饲料（1日）", "Ball bearings (bag of 1,000)": "滚珠（1000颗装）",
    "Barding: Breastplate": "坐骑护甲：胸甲", "Barding: Chain mail": "坐骑护甲：锁子甲",
    "Barding: Chain shirt": "坐骑护甲：锁子衫", "Barding: Half plate": "坐骑护甲：半身板甲",
    "Barding: Hide": "坐骑护甲：兽皮甲", "Barding: Leather": "坐骑护甲：皮甲",
    "Barding: Padded": "坐骑护甲：布甲", "Barding: Plate": "坐骑护甲：板甲",
    "Barding: Ring mail": "坐骑护甲：环甲", "Barding: Scale mail": "坐骑护甲：鳞甲",
    "Barding: Splint": "坐骑护甲：板条甲", "Barding: Studded Leather": "坐骑护甲：镶钉皮甲",
    "Block and tackle": "滑轮组", "Block of incense": "香块", "Blowgun needle": "吹箭针",
    "Bottle, glass": "玻璃瓶", "Case, crossbow bolt": "弩矢匣",
    "Case, map or scroll": "地图/卷轴筒", "Censer": "香炉", "Clothes, common": "便服",
    "Clothes, costume": "戏服", "Clothes, fine": "华服", "Clothes, traveler's": "旅人服",
    "Component pouch": "材料包", "Cook's utensils": "厨具", "Crossbow bolt": "弩矢",
    "Crossbow, hand": "手弩", "Crossbow, heavy": "重弩", "Crossbow, light": "轻弩",
    "Hand crossbow": "手弩", "Light hammer": "轻锤", "War pick": "战镐",
    "Fishing tackle": "钓具", "Flask or tankard": "酒瓶或酒杯", "Grappling hook": "抓钩",
    "Hammer, sledge": "大锤", "Holy water (flask)": "圣水（瓶）", "Horse, draft": "挽马",
    "Horse, riding": "骑乘马", "Hunting trap": "猎兽夹",
    "Ink (1 ounce bottle)": "墨水（1盎司瓶）", "Ink pen": "蘸水笔",
    "Jug or pitcher": "水罐", "Lantern, bullseye": "聚光灯笼", "Lantern, hooded": "罩灯",
    "Light hammer": "轻锤", "Little bag of sand": "小沙袋", "Magnifying glass": "放大镜",
    "Mirror, steel": "钢镜", "Pan flute": "排箫", "Pick, miner's": "矿工镐",
    "Poison, basic (vial)": "基础毒药（瓶）", "Pot, iron": "铁锅", "Ram, portable": "便携撞木",
    "Rope, hempen (50 feet)": "麻绳（50尺）", "Rope, silk (50 feet)": "丝绳（50尺）",
    "Saddle, Exotic": "异种鞍具", "Saddle, Military": "军用鞍具", "Saddle, Pack": "驮鞍",
    "Saddle, Riding": "骑乘鞍具", "Sailing ship": "帆船", "Scale, merchant's": "商贩天平",
    "Sealing wax": "火漆", "Signal whistle": "信号哨", "Signet ring": "印章戒指",
    "Sling bullet": "投石索弹丸", "Small knife": "小刀", "Spike, iron": "铁刺钉",
    "Sprig of mistletoe": "槲寄生枝条", "Stabling (1 day)": "马厩（1日）",
    "String (10 feet)": "细绳（10尺）", "Tent, two-person": "双人帐篷", "Vestments": "祭袍",
    "War pick": "战镐", "Wooden staff": "木杖", "Yew wand": "紫杉魔杖",
    # 与 roleplayer.data.EQUIPMENT_LIBRARY 既有中文名对齐，避免两套装备库命名割裂
    "Chain Mail": "锁子甲", "Plate Armor": "全身板甲",
}

#: 熟练项 — 灰机 wiki / 装备映射未覆盖部分的手工校订
EN2CN_PROF_CURATED = {
    "All armor": "全部护甲", "Heavy Armor": "重甲", "Light Armor": "轻甲",
    "Medium Armor": "中甲", "Shields": "盾牌", "Martial Weapons": "军用武器",
    "Simple Weapons": "简易武器", "Land Vehicles": "陆地载具",
    "Water Vehicles": "水上载具", "Dice Set": "骰子组", "Playing Card Set": "纸牌组",
    "Bagpipes": "风笛", "Drum": "鼓", "Dulcimer": "扬琴", "Flute": "长笛",
    "Horn": "号角", "Lute": "琉特琴", "Lyre": "里拉琴", "Shawm": "肖姆管",
    "Viol": "维奥尔琴", "Pan flute": "排箫",
    "Disguise Kit": "易容工具包", "Forgery Kit": "伪造工具包",
    "Herbalism Kit": "草药工具包", "Poisoner's Kit": "毒师工具包",
    "Alchemist's Supplies": "炼金工具", "Brewer's Supplies": "酿造工具",
    "Calligrapher's Supplies": "书法工具", "Carpenter's Tools": "木工工具",
    "Cartographer's Tools": "制图工具", "Cobbler's Tools": "鞋匠工具",
    "Cook's utensils": "厨具", "Glassblower's Tools": "吹玻璃工具",
    "Jeweler's Tools": "珠宝匠工具", "Leatherworker's Tools": "皮革匠工具",
    "Mason's Tools": "石匠工具", "Navigator's Tools": "领航工具",
    "Painter's Supplies": "绘画工具", "Potter's Tools": "陶匠工具",
    "Smith's Tools": "锻工工具", "Thieves' Tools": "盗贼工具",
    "Tinker's Tools": "修补工具", "Weaver's Tools": "织匠工具",
    "Woodcarver's Tools": "木雕工具",
}

#: 熟练项武器复数 -> 单数（用于回退查表）
PROF_SINGULAR = {
    "Battleaxes": "Battleaxe", "Blowguns": "Blowgun", "Clubs": "Club", "Daggers": "Dagger",
    "Darts": "Dart", "Flails": "Flail", "Glaives": "Glaive", "Greataxes": "Greataxe",
    "Greatclubs": "Greatclub", "Greatswords": "Greatsword", "Halberds": "Halberd",
    "Hand crossbows": "Hand crossbow", "Handaxes": "Handaxe", "Javelins": "Javelin",
    "Lances": "Lance", "Light hammers": "Light hammer", "Longbows": "Longbow",
    "Longswords": "Longsword", "Maces": "Mace", "Mauls": "Maul",
    "Morningstars": "Morningstar", "Nets": "Net", "Pikes": "Pike",
    "Quarterstaffs": "Quarterstaff", "Rapiers": "Rapier", "Scimitars": "Scimitar",
    "Shortbows": "Shortbow", "Shortswords": "Shortsword", "Sickles": "Sickle",
    "Slings": "Sling", "Spears": "Spear", "Tridents": "Trident", "War picks": "War pick",
    "Warhammers": "Warhammer", "Whips": "Whip",
    "Crossbows, heavy": "Crossbow, heavy", "Crossbows, light": "Crossbow, light",
    "Hand crossbows": "Hand crossbow", "Light hammers": "Light hammer",
    "War picks": "War pick",
    "Breastplate": "Breastplate", "Chain Mail": "Chain Mail", "Chain Shirt": "Chain Shirt",
    "Half Plate Armor": "Half Plate Armor", "Hide Armor": "Hide Armor",
    "Leather Armor": "Leather Armor", "Padded Armor": "Padded Armor",
    "Plate Armor": "Plate Armor", "Ring Mail": "Ring Mail", "Scale Mail": "Scale Mail",
    "Splint Armor": "Splint Armor", "Studded Leather Armor": "Studded Leather Armor",
}


# =============================================================================
#  特性译名（258 个基名：前缀复合规则 + curated 主体表）
# =============================================================================
#: 复合前缀：「前缀: 子项」-> 前缀中文
FEATURE_PREFIX = {
    "Eldritch Invocation": "邪术魔典", "Metamagic": "超魔法",
    "Circle of the Land": "大地结社", "Dragon Ancestor": "龙族先祖",
    "Fighting Style": "战斗风格", "Defensive Tactics": "防御战术",
    "Superior Hunter's Defense": "高级猎手防御", "Hunter's Prey": "猎手的猎物",
    "Spellcasting": "施法", "Channel Divinity": "引导神力",
    "Multiattack": "多重攻击", "Flexible Casting": "灵活施法",
}

#: 邪术魔典（Eldritch Invocation）子项
EN2CN_INVOCATION = {
    "Agonizing Blast": "苦痛魔爆", "Armor of Shadows": "暗影护甲",
    "Ascendant Step": "腾空步", "Beast Speech": "兽语",
    "Beguiling Influence": "蛊惑影响", "Bewitching Whispers": "迷魂低语",
    "Book of Ancient Secrets": "远古秘典", "Chains of Carceri": "卡瑟利之链",
    "Devil's Sight": "魔视", "Dreadful Word": "可怖真言", "Eldritch Sight": "邪魔之眼",
    "Eldritch Spear": "邪魔长矛", "Eyes of the Rune Keeper": "符文通晓之眼",
    "Fiendish Vigor": "邪魔活力", "Gaze of Two Minds": "双心凝视",
    "Lifedrinker": "饮命者", "Mask of Many Faces": "千面之具",
    "Master of Myriad Forms": "万形之主", "Minions of Chaos": "混沌仆从",
    "Mire the Mind": "心智泥沼", "Misty Visions": "迷雾幻象",
    "One with Shadows": "融于暗影", "Otherworldly Leap": "异界之跃",
    "Repelling Blast": "斥力魔爆", "Sculptor of Flesh": "血肉塑形者",
    "Sign of Ill Omen": "凶兆之印", "Thief of Five Fates": "五命窃者",
    "Thirsting Blade": "饥渴之刃", "Visions of Distant Realms": "远域之视",
    "Voice of the Chain Master": "链主之音", "Whispers of the Grave": "墓穴低语",
    "Witch Sight": "巫视",
}

#: 超魔法（Metamagic）子项
EN2CN_METAMAGIC = {
    "Careful Spell": "谨慎法术", "Distant Spell": "远程法术",
    "Empowered Spell": "强化法术", "Extended Spell": "延时法术",
    "Heightened Spell": "高阶法术", "Quickened Spell": "瞬发法术",
    "Subtle Spell": "微妙法术", "Twinned Spell": "双生法术",
}

#: 大地结社（Circle of the Land）地形
EN2CN_TERRAIN = {
    "Arctic": "极地", "Coast": "海岸", "Desert": "沙漠", "Forest": "森林",
    "Grassland": "草原", "Mountain": "山地", "Swamp": "沼泽", "Underdark": "幽暗地域",
}

#: 龙族先祖：颜色 + 伤害类型
DRAGON_COLOR = {
    "Black": "黑龙", "Blue": "蓝龙", "Brass": "黄铜龙", "Bronze": "青铜龙",
    "Copper": "赤铜龙", "Gold": "金龙", "Green": "绿龙", "Red": "红龙",
    "Silver": "银龙", "White": "白龙",
}
DRAGON_DAMAGE = {
    "Acid": "酸蚀", "Lightning": "闪电", "Fire": "火焰", "Cold": "寒冷",
    "Poison": "毒素",
}

#: 战斗风格 / 防御战术 / 猎手猎物 / 高级猎手防御 / 施法 / 引导神力 / 多重攻击 子项
EN2CN_FSTYLE = {
    "Archery": "箭术", "Defense": "防御", "Dueling": "决斗",
    "Great Weapon Fighting": "巨武战斗", "Protection": "守护",
    "Two-Weapon Fighting": "双武器战斗",
}
EN2CN_DTACTIC = {
    "Escape the Horde": "脱离群敌", "Multiattack Defense": "多重攻击防御",
    "Steel Will": "钢铁意志",
}
EN2CN_HPREY = {
    "Colossus Slayer": "巨物杀手", "Giant Killer": "巨人猎手", "Horde Breaker": "破群者",
}
EN2CN_SHDEFENSE = {
    "Evasion": "回避", "Stand Against the Tide": "力抗狂潮", "Uncanny Dodge": "洞悉闪避",
}
EN2CN_CHANNEL = {
    "Preserve Life": "维系生命", "Sacred Weapon": "圣化武器",
    "Turn Undead": "驱散不死生物", "Turn the Unholy": "驱散邪秽",
}
EN2CN_MULTI = {"Volley": "箭雨", "Whirlwind Attack": "旋风攻击"}
EN2CN_FLEXIBLE = {
    "Converting Spell Slot": "转化法术位", "Creating Spell Slots": "创造法术位",
}

#: 特性主体表（258 个基名中去掉带前缀者）
EN2CN_FEATURE = {
    "Ability Score Improvement": "属性提升", "Action Surge": "行动如潮",
    "Additional Fighting Style": "额外战斗风格",
    "Additional Magical Secrets": "额外秘学知识", "Arcane Recovery": "奥术回复",
    "Arcane Tradition": "奥术传承", "Arcane Tradition feature": "奥术传承特性",
    "Archdruid": "大德鲁伊", "Aura improvements": "光环强化",
    "Aura of Courage": "勇气光环", "Aura of Devotion": "奉献光环",
    "Aura of Protection": "守护光环", "Bard College": "吟游诗人学院",
    "Bard College feature": "吟游诗人学院特性", "Bardic Inspiration": "诗人激励",
    "Beast Spells": "野兽法术", "Blessed Healer": "受祝治疗者",
    "Blindsense": "盲视感知", "Bonus Cantrip": "额外戏法",
    "Bonus Proficiencies": "额外熟练", "Bonus Proficiency": "额外熟练项",
    "Brutal Critical": "残暴重击", "Channel Divinity": "引导神力",
    "Circle Spells": "结社法术", "Circle of the Land": "大地结社",
    "Cleansing Touch": "净化之触", "Countercharm": "破咒之歌",
    "Cunning Action": "机敏动作", "Cutting Words": "尖刻之词",
    "Danger Sense": "危险感知", "Dark One's Blessing": "暗主的祝福",
    "Dark One's Own Luck": "暗主的眷顾", "Defensive Tactics": "防御战术",
    "Deflect Missiles": "拨挡飞弹", "Destroy Undead": "摧毁不死生物",
    "Diamond Soul": "钻石之魂", "Disciple of Life": "生命门徒",
    "Divine Domain": "神术领域", "Divine Domain feature": "神术领域特性",
    "Divine Health": "圣洁体魄", "Divine Intervention": "神力干预",
    "Divine Intervention Improvement": "神力干预强化", "Divine Sense": "神圣感知",
    "Divine Smite": "神威斩击", "Divine Strike": "神圣打击",
    "Domain Spells": "领域法术", "Draconic Presence": "龙族威压",
    "Draconic Resilience": "龙族坚韧", "Dragon Ancestor": "龙族先祖",
    "Dragon Wings": "龙翼", "Druid Circle": "德鲁伊结社",
    "Druid Circle feature": "德鲁伊结社特性", "Druidic": "德鲁伊语",
    "Eldritch Invocations": "邪术魔典", "Eldritch Master": "邪术大师",
    "Elemental Affinity": "元素亲和", "Elusive": "难以捉摸",
    "Empowered Evocation": "强化塑能", "Empty Body": "空灵之体",
    "Evasion": "回避", "Evocation Savant": "塑能精通", "Expertise": "专精造诣",
    "Extra Attack": "额外攻击", "Fast Hands": "妙手空空", "Fast Movement": "疾行",
    "Favored Enemy": "宿敌", "Feral Instinct": "野性直觉", "Feral Senses": "野性感官",
    "Fiendish Resilience": "邪魔韧性", "Fighting Style": "战斗风格",
    "Flurry of Blows": "疾风连击", "Foe Slayer": "克敌者",
    "Font of Inspiration": "激励之泉", "Font of Magic": "魔力之泉", "Frenzy": "狂乱",
    "Hide in Plain Sight": "光天化日隐匿", "Holy Nimbus": "圣光华轮",
    "Hunter's Prey": "猎手的猎物", "Hurl Through Hell": "投入地狱",
    "Improved Critical": "精通重击", "Improved Divine Smite": "强化神威斩击",
    "Indomitable": "不屈", "Indomitable Might": "不屈之力",
    "Intimidating Presence": "慑人威仪", "Jack of All Trades": "万事通",
    "Ki": "气", "Ki Empowered Strikes": "气之强化打击", "Land's Stride": "大地行者",
    "Lay on Hands": "抚慰之手", "Magical Secrets": "秘学知识",
    "Martial Archetype": "武术范型", "Martial Archetype feature": "武术范型特性",
    "Martial Arts": "武艺", "Metamagic": "超魔法", "Mindless Rage": "无念狂暴",
    "Monastic Tradition": "修道传承", "Monastic Tradition feature": "修道传承特性",
    "Multiattack": "多重攻击", "Mystic Arcanum": "玄奥秘术",
    "Natural Explorer": "自然探索者", "Natural Recovery": "自然回复",
    "Nature's Sanctuary": "自然庇护", "Nature's Ward": "自然守护",
    "Oath Spells": "誓约法术", "Open Hand Technique": "散打技法",
    "Otherworldly Patron": "异界宗主", "Otherworldly Patron feature": "异界宗主特性",
    "Overchannel": "过载引导", "Pact Boon": "契约恩赐", "Pact Magic": "契约魔法",
    "Pact of the Blade": "刃之契约", "Pact of the Chain": "链之契约",
    "Pact of the Tome": "书之契约", "Path feature": "道途特性",
    "Patient Defense": "守势待机", "Peerless Skill": "无双技艺",
    "Perfect Self": "完美自我", "Persistent Rage": "持续狂暴",
    "Potent Cantrip": "强化戏法", "Primal Champion": "原初勇士",
    "Primal Path": "原初道途", "Primeval Awareness": "远古感知",
    "Purity of Body": "纯净之躯", "Purity of Spirit": "纯净之魂",
    "Quivering Palm": "震颤掌", "Rage": "狂暴", "Ranger Archetype": "游侠范型",
    "Ranger Archetype feature": "游侠范型特性", "Reckless Attack": "鲁莽攻击",
    "Relentless Rage": "不懈狂暴", "Reliable Talent": "可靠天赋",
    "Remarkable Athlete": "卓绝运动家", "Retaliation": "反击",
    "Roguish Archetype": "游荡者范型", "Roguish Archetype feature": "游荡者范型特性",
    "Sacred Oath": "神圣誓言", "Sacred Oath feature": "神圣誓言特性",
    "Sculpt Spells": "法术塑形", "Second Wind": "再起之风",
    "Second-Story Work": "飞檐走壁", "Signature Spell": "招牌法术",
    "Slippery Mind": "滑溜心智", "Slow Fall": "缓降", "Sneak Attack": "偷袭",
    "Step of the Wind": "踏风步",
    "Song of Rest": "休憩之歌", "Sorcerous Origin": "术法根源",
    "Sorcerous Origin feature": "术法根源特性", "Sorcerous Restoration": "术法回复",
    "Spell Mastery": "法术精通", "Stillness of Mind": "心如止水",
    "Stroke of Luck": "幸运一击", "Stunning Strike": "震慑拳",
    "Superior Critical": "卓越重击", "Superior Hunter's Defense": "高级猎手防御",
    "Superior Inspiration": "高级激励", "Supreme Healing": "终极治疗",
    "Supreme Sneak": "终极潜行", "Survivor": "幸存者",
    "Thief's Reflexes": "盗贼反射", "Thieves' Cant": "盗贼黑话",
    "Timeless Body": "不朽之躯", "Tongue of the Sun and Moon": "日月之语",
    "Tranquility": "静谧", "Unarmored Defense": "无甲防御",
    "Unarmored Movement": "无甲移动", "Uncanny Dodge": "洞悉闪避",
    "Use Magic Device": "使用魔法装置", "Vanish": "隐匿无踪",
    "Wholeness of Body": "完满之躯", "Wild Shape": "荒野形态",
}

#: 特性名尾部括号（等级/次数/骰数）的中文化
PAREN_MAP = {
    "1 use": "1次", "2 uses": "2次", "3 uses": "3次", "4 uses": "4次",
    "1/rest": "1次/休整", "2/rest": "2次/休整", "3/rest": "3次/休整",
    "1 die": "1骰", "2 dice": "2骰", "3 dice": "3骰",
    "1d6": "1d6", "d6": "d6", "d8": "d8", "d10": "d10", "d12": "d12",
    "1d10": "1d10", "2d6": "2d6",
}

_SUB_TABLES = {
    "Eldritch Invocation": EN2CN_INVOCATION,
    "Metamagic": EN2CN_METAMAGIC,
    "Circle of the Land": EN2CN_TERRAIN,
    "Fighting Style": EN2CN_FSTYLE,
    "Defensive Tactics": EN2CN_DTACTIC,
    "Hunter's Prey": EN2CN_HPREY,
    "Superior Hunter's Defense": EN2CN_SHDEFENSE,
    "Channel Divinity": EN2CN_CHANNEL,
    "Multiattack": EN2CN_MULTI,
    "Flexible Casting": EN2CN_FLEXIBLE,
}


def feat_zh(name: str) -> str:
    """特性名中文化：剥离尾部括号 -> 前缀复合 / 主体查表 -> 回拼括号。"""
    m = re.match(r"^(.*?)\s*\(([^()]*)\)\s*$", name)
    base, paren = (m.group(1).strip(), m.group(2).strip()) if m else (name.strip(), "")

    zh = ""
    if ":" in base:
        head, _, tail = base.partition(":")
        head, tail = head.strip(), tail.strip()
        if head in FEATURE_PREFIX:
            pfx = FEATURE_PREFIX[head]
            if head == "Dragon Ancestor" and " - " in tail:
                color, _, dmg = tail.partition(" - ")
                dmg = dmg.replace(" Damage", "").strip()
                sub = f"{DRAGON_COLOR.get(color.strip(), color)}（{DRAGON_DAMAGE.get(dmg, dmg)}）"
            elif head == "Spellcasting":
                sub = HJ_CLASS.get(tail, tail)
            else:
                sub = _SUB_TABLES.get(head, {}).get(tail, tail)
            zh = f"{pfx}：{sub}"
    if not zh:
        zh = EN2CN_FEATURE.get(base, "")

    if not zh:                       # 前缀未覆盖的冒号形式：逐段查表
        if ":" in base:
            parts = [p.strip() for p in base.split(":")]
            mapped = [EN2CN_FEATURE.get(p, p) for p in parts]
            zh = "：".join(mapped)
        else:
            zh = base

    if paren:
        zh = f"{zh}（{PAREN_MAP.get(paren, paren)}）"
    return zh


# =============================================================================
#  通用小工具
# =============================================================================
def gp(cost: dict | None) -> float:
    """把 {quantity, unit} 统一折算为金币（gp）。"""
    if not cost:
        return 0.0
    rate = {"cp": 0.01, "sp": 0.1, "ep": 0.5, "gp": 1.0, "pp": 10.0}
    return round(cost.get("quantity", 0) * rate.get(cost.get("unit", "gp"), 1.0), 2)


def zh_item(name: str) -> str:
    """装备/物品中文化：curated -> 灰机 wiki -> 去复数回退 -> 原名。"""
    if name in EN2CN_EQUIP_CURATED:
        return EN2CN_EQUIP_CURATED[name]
    if name in HJ_ITEM:
        return HJ_ITEM[name]
    s = PROF_SINGULAR.get(name)
    if s:
        if s in EN2CN_EQUIP_CURATED:
            return EN2CN_EQUIP_CURATED[s]
        if s in HJ_ITEM:
            return HJ_ITEM[s]
    if name.endswith("s") and name[:-1] in HJ_ITEM:
        return HJ_ITEM[name[:-1]]
    # 熟练项词汇（All armor / Simple Weapons / Heavy Armor …）复用同一套中文名
    if name in EN2CN_PROF_CURATED:
        return EN2CN_PROF_CURATED[name]
    return name


def zh_class(en: str) -> str:
    return HJ_CLASS.get(en, en)


def zh_subclass(short: str) -> str:
    full = SUBCLASS_FULLNAME.get(short, short)
    return HJ_SUBCLASS.get(full, HJ_SUBCLASS.get(short, short))


def unique_put(d: OrderedDict, key: str, rec: dict, en: str) -> None:
    """写入并在中文键冲突时追加英文原名消歧（避免静默丢条目）。"""
    if key in d:
        key = f"{key}（{en}）"
    d[key] = rec


# =============================================================================
#  转换器
# =============================================================================
def _option_names(node) -> list:
    """递归展开 API 的 option_set（reference / choice 嵌套）取全部引用名。"""
    out = []
    if not isinstance(node, dict):
        return out
    item = node.get("item")
    if isinstance(item, dict) and item.get("name"):
        out.append(item["name"])
    for o in node.get("options", []) or []:
        out.extend(_option_names(o))
    return out


#: 武器分类（Simple/Martial）+ 射程（Melee/Ranged）
WCAT = {"Simple": "简易", "Martial": "军用"}
WRANGE = {"Melee": "近战", "Ranged": "远程"}
#: 护甲分类
ACAT = {"Light": "轻甲", "Medium": "中甲", "Heavy": "重甲", "Shield": "盾牌"}


def conv_class(c: dict, raw_levels: dict) -> dict:
    en = c["name"]
    saves_en = [s["index"].upper() for s in c.get("saving_throws", [])]
    saves = sorted({SAVE_MAP[a] for a in saves_en if a in SAVE_MAP})

    skill_profs, gear_profs_en, gear_profs = [], [], []
    for p in c.get("proficiencies", []):
        nm = p["name"]
        if nm.startswith("Skill: "):
            skill_profs.append(EN2CN_SKILL.get(nm[7:], nm[7:]))
        elif nm.startswith("Saving Throw: "):
            continue
        else:
            gear_profs_en.append(nm)
            gear_profs.append(zh_item(nm))

    # 技能自选池（proficiency_choices）—— 递归展开嵌套 option_set
    choices, choose_n = [], 0
    for pc in c.get("proficiency_choices", []):
        opts = _option_names(pc.get("from", {}))
        skills = [EN2CN_SKILL.get(o.replace("Skill: ", ""), o.replace("Skill: ", ""))
                  for o in opts if o.startswith("Skill: ")]
        if skills:
            choices = skills
            choose_n = pc.get("choose", 0)

    # 施法进程：由 20 级法术位分布推导（用 API 原始等级记录，勿用已转换结构）
    l20 = (raw_levels.get(20) or {}).get("spellcasting") or {}
    rings = {i: l20.get(f"spell_slots_level_{i}", 0) for i in range(1, 10)}
    nz = [i for i, v in rings.items() if v > 0]
    if not nz:
        prog = "none"
    elif len(nz) == 1 and rings[nz[0]] >= 2:
        prog = "pact"
    elif max(nz) == 9:
        prog = "full"
    else:
        prog = "half"

    sp = c.get("spellcasting") or {}
    ab = (sp.get("spellcasting_ability") or {}).get("index", "").upper()

    return OrderedDict([
        ("en", en),
        ("hit_die", c.get("hit_die")),
        ("primary", CLASS_PRIMARY.get(en, [])),
        ("saves", saves),
        ("saves_en", saves_en),
        ("skill_profs", skill_profs),
        ("skill_choices", choices),
        ("skill_choice_count", choose_n),
        ("gear_profs", gear_profs),
        ("gear_profs_en", gear_profs_en),
        ("spellcasting", OrderedDict([
            ("ability", EN2CN_ABILITY.get(ab, ab)),
            ("ability_en", ab),
            ("progression", prog),
        ]) if ab else None),
        ("subclasses", [zh_subclass(s["name"]) for s in c.get("subclasses", [])]),
    ])


def conv_level(lv: dict) -> dict:
    sp = lv.get("spellcasting") or {}
    slots = OrderedDict()
    for i in range(1, 10):
        v = sp.get(f"spell_slots_level_{i}", 0)
        if v:
            slots[i] = v
    return OrderedDict([
        ("level", lv.get("level")),
        ("prof_bonus", lv.get("prof_bonus")),
        ("ability_score_bonuses", lv.get("ability_score_bonuses", 0)),
        ("features", [feat_zh(f["name"]) for f in lv.get("features", [])]),
        ("spellcasting", OrderedDict([
            ("cantrips_known", sp.get("cantrips_known", 0)),
            ("spells_known", sp.get("spells_known", 0)),
            ("slots", slots),
        ]) if sp else None),
        ("class_specific", lv.get("class_specific") or {}),
    ])


def conv_feature(f: dict) -> dict:
    cls = (f.get("class") or {}).get("name", "")
    sub = (f.get("subclass") or {}).get("name", "")
    return OrderedDict([
        ("en", f["name"]),
        ("class", zh_class(cls) if cls else ""),
        ("subclass", zh_subclass(sub) if sub else ""),
        ("level", f.get("level")),
        ("prereq", [p.get("name", "") if isinstance(p, dict) else str(p)
                    for p in f.get("prerequisites", [])]),
        ("desc_en", f.get("desc", [])),
    ])


def conv_equipment(e: dict) -> dict:
    dmg = e.get("damage") or {}
    dmg_type = (dmg.get("damage_type") or {}).get("name", "")
    ac = e.get("armor_class") or {}
    two = e.get("two_handed_damage") or {}
    cat = (e.get("equipment_category") or {}).get("name", "")
    props = [EN2CN_WPROP.get(p["name"], p["name"]) for p in e.get("properties", [])]
    wc, wr, acat = e.get("weapon_category", ""), e.get("weapon_range", ""), e.get("armor_category", "")
    if wc:
        sub = f"{WCAT.get(wc, wc)}{WRANGE.get(wr, wr)}"
    elif acat:
        sub = ACAT.get(acat, acat)
    else:
        sub = e.get("category_range", "") or ""
    return OrderedDict([
        ("en", e["name"]),
        ("cat", EN2CN_EQCAT.get(cat, cat)),
        ("sub", sub),
        ("cost_gp", gp(e.get("cost"))),
        ("weight", e.get("weight")),
        ("damage", dmg.get("damage_dice", "")),
        ("damage_type", EN2CN_DAMAGE.get(dmg_type, dmg_type)),
        ("two_handed", two.get("damage_dice", "")),
        ("range", e.get("range") or {}),
        ("properties", props),
        ("armor_class", ac.get("base") if ac else None),
        ("armor_dex", bool(ac.get("dex_bonus")) if ac else None),
        ("str_min", e.get("str_minimum")),
        ("stealth_dis", bool(e.get("stealth_disadvantage"))),
        ("desc_en", e.get("desc", []) + e.get("special", [])),
    ])


def conv_proficiency(p: dict) -> dict:
    nm = p["name"]
    if nm.startswith("Skill: "):
        zh = EN2CN_SKILL.get(nm[7:], nm[7:])
    elif nm.startswith("Saving Throw: "):
        zh = SAVE_MAP.get(nm.split(": ")[-1].upper(), nm)
    elif nm in EN2CN_PROF_CURATED:
        zh = EN2CN_PROF_CURATED[nm]
    else:
        zh = zh_item(nm)
    ref = (p.get("reference") or {}).get("name", "")
    return OrderedDict([
        ("en", nm),
        ("type", p.get("type", "")),
        ("ref", ref),
    ]), zh


# =============================================================================
#  构建
# =============================================================================
def build():
    classes_raw = load_dir("classes")
    subclasses_raw = load_dir("subclasses")
    features_raw = load_dir("features")
    equip_raw = load_dir("equipment")
    prof_raw = load_dir("proficiencies")

    # ---- 职业 + 等级 ----
    CLASSES = OrderedDict()
    CLASS_LEVELS = OrderedDict()
    for e in load_index("classes"):
        c = classes_raw.get(e["index"])
        if not c:
            continue
        raw_levels, levels = {}, OrderedDict()
        for lv in range(1, 21):
            p = os.path.join(PULL, "classes_levels", f"{e['index']}-{lv}.json")
            if os.path.exists(p):
                raw = json.load(open(p, encoding="utf-8"))
                raw_levels[lv] = raw
                levels[lv] = conv_level(raw)
        rec = conv_class(c, raw_levels)
        key = zh_class(c["name"])
        unique_put(CLASSES, key, rec, c["name"])
        CLASS_LEVELS[key] = levels

    # ---- 子职业 ----
    SUBCLASSES = OrderedDict()
    for e in load_index("subclasses"):
        s = subclasses_raw.get(e["index"])
        if not s:
            continue
        rec = OrderedDict([
            ("en", s["name"]),
            ("class", zh_class((s.get("class") or {}).get("name", ""))),
            ("flavor", s.get("subclass_flavor", "")),
            ("desc_en", s.get("desc", [])),
        ])
        unique_put(SUBCLASSES, zh_subclass(s["name"]), rec, s["name"])

    # ---- 特性 ----
    FEATURES = OrderedDict()
    for e in load_index("features"):
        f = features_raw.get(e["index"])
        if not f:
            continue
        unique_put(FEATURES, feat_zh(f["name"]), conv_feature(f), f["name"])

    # ---- 装备 ----
    SRD_EQUIPMENT = OrderedDict()
    for e in load_index("equipment"):
        it = equip_raw.get(e["index"])
        if not it:
            continue
        unique_put(SRD_EQUIPMENT, zh_item(it["name"]), conv_equipment(it), it["name"])

    WEAPON_PROPERTIES = OrderedDict()
    for e in load_index("weapon_properties"):
        w = load_dir("weapon_properties").get(e["index"])
        if not w:
            continue
        WEAPON_PROPERTIES[EN2CN_WPROP.get(w["name"], w["name"])] = OrderedDict([
            ("en", w["name"]), ("desc_en", w.get("desc", [])),
        ])

    # ---- 熟练 ----
    PROFICIENCIES = OrderedDict()
    for e in load_index("proficiencies"):
        p = prof_raw.get(e["index"])
        if not p:
            continue
        rec, zh = conv_proficiency(p)
        unique_put(PROFICIENCIES, zh, rec, p["name"])

    # ---- 参考常量 ----
    def simple(cat, en2cn, order):
        d = OrderedDict()
        raw = load_dir(cat)
        for e in load_index(cat):
            r = raw.get(e["index"])
            if not r:
                continue
            zh = en2cn.get(r["name"], r["name"])
            rec = OrderedDict([("en", r["name"]), ("desc_en", r.get("desc", []))])
            for extra in order:
                if extra in r:
                    rec[extra] = r[extra]
            unique_put(d, zh, rec, r["name"])
        return d

    ABILITY_SCORES = simple("ability_scores", EN2CN_ABILITY, ["full_name"])
    ALIGNMENTS = simple("alignments", EN2CN_ALIGN, ["abbreviation"])
    DAMAGE_TYPES = simple("damage_types", EN2CN_DAMAGE, [])
    MAGIC_SCHOOLS = simple("magic_schools", EN2CN_SCHOOL, [])
    LANGUAGES = simple("languages", EN2CN_LANG, ["type", "script"])
    WEAPON_PROPS_REF = WEAPON_PROPERTIES

    SRD_SKILLS = OrderedDict()
    raw = load_dir("skills")
    for e in load_index("skills"):
        s = raw.get(e["index"])
        if not s:
            continue
        ab = (s.get("ability_score") or {}).get("index", "").upper()
        SRD_SKILLS[EN2CN_SKILL.get(s["name"], s["name"])] = OrderedDict([
            ("en", s["name"]),
            ("ability", EN2CN_ABILITY.get(ab, ab)),
            ("desc_en", s.get("desc", [])),
        ])

    RULES = simple("rules", EN2CN_RULE, [])
    RULE_SECTIONS = OrderedDict()
    raw = load_dir("rule_sections")
    for e in load_index("rule_sections"):
        r = raw.get(e["index"])
        if not r:
            continue
        RULE_SECTIONS[EN2CN_RULESEC.get(r["name"], r["name"])] = OrderedDict([
            ("en", r["name"]), ("desc_en", r.get("desc", "")),
        ])

    return (CLASSES, CLASS_LEVELS, SUBCLASSES, FEATURES,
            SRD_EQUIPMENT, WEAPON_PROPS_REF, PROFICIENCIES,
            ABILITY_SCORES, ALIGNMENTS, DAMAGE_TYPES, MAGIC_SCHOOLS,
            LANGUAGES, SRD_SKILLS, RULES, RULE_SECTIONS)


# =============================================================================
#  输出
# =============================================================================
def fmt(obj):
    return pprint.pformat(obj, width=120, sort_dicts=False, indent=1)


def write_file(path, header, body_assignments: list):
    with open(path, "w", encoding="utf-8") as f:
        f.write(header)
        f.write("from collections import OrderedDict\n")
        for var, val in body_assignments:
            f.write(f"\n{var} = {fmt(val)}\n")


def main():
    (CLASSES, CLASS_LEVELS, SUBCLASSES, FEATURES,
     SRD_EQUIPMENT, WEAPON_PROPERTIES, PROFICIENCIES,
     ABILITY_SCORES, ALIGNMENTS, DAMAGE_TYPES, MAGIC_SCHOOLS,
     LANGUAGES, SRD_SKILLS, RULES, RULE_SECTIONS) = build()

    write_file(
        os.path.join(OUT, "data_classes.py"),
        '''"""roleplayer.data_classes - D&D 5e SRD 职业系统（全量，由权威 API 转换）

来源：dnd5eapi.co/api/2014 的 classes / subclasses / features 三个端点，外加
12 职业 × 1–20 级 = 240 条 class-level 记录（每级含特性、熟练加值、施法位、
职业专属数值如狂暴次数/偷袭骰/气点），由 gen_srd_v21.py 转换。

- CLASSES       12 职业：生命骰 / 关键属性 / 豁免熟练 / 技能自选池 / 装备熟练 /
                施法能力（进程 full|half|pact|none 由 20 级法术位分布推导，非臆造）
- CLASS_LEVELS  职业 -> 等级 -> 该级特性 / 熟练加值 / 施法位 / class_specific
- SUBCLASSES    12 子职业（SRD 每职业一款），中文名取自灰机 wiki 权威对照
- FEATURES      407 条职业特性：中文键 + 英文原名 + 所属职业/子职业/等级 + 官方描述

条目名全量中文化，英文原名保留在 `en` 字段，官方描述保留在 `desc_en`。
本文件由脚本生成，勿手工编辑。
"""\nfrom __future__ import annotations\n''',
        [("CLASSES", CLASSES), ("CLASS_LEVELS", CLASS_LEVELS),
         ("SUBCLASSES", SUBCLASSES), ("FEATURES", FEATURES)],
    )

    write_file(
        os.path.join(OUT, "data_equipment_srd.py"),
        '''"""roleplayer.data_equipment_srd - D&D 5e SRD 装备库（全量 237 件，由权威 API 转换）

来源：dnd5eapi.co/api/2014/equipment（237 件）+ weapon-properties（11 条），
由 gen_srd_v21.py 转换。与 roleplayer.data 的手工 EQUIPMENT_LIBRARY（41 件，带 D20
CP 定价）互补：本模块提供权威的伤害骰 / AC / 重量 / 价格 / 武器属性 / 分类。

字段：cat 分类 / sub 子类（军用近战、重甲…） / cost_gp 价格（统一折算金币） /
weight 重量 / damage 伤害骰 / damage_type 伤害类型 / two_handed 双手伤害骰 /
range 射程 / properties 武器属性 / armor_class AC / armor_dex 可否加敏捷 /
str_min 力量需求 / stealth_dis 隐匿劣势 / desc_en 官方描述。
条目名全量中文化，英文原名保留在 `en`。本文件由脚本生成，勿手工编辑。
"""\nfrom __future__ import annotations\n''',
        [("SRD_EQUIPMENT", SRD_EQUIPMENT), ("WEAPON_PROPERTIES", WEAPON_PROPERTIES)],
    )

    write_file(
        os.path.join(OUT, "data_proficiencies.py"),
        '''"""roleplayer.data_proficiencies - D&D 5e SRD 熟练项（全量 117 项，由权威 API 转换）

来源：dnd5eapi.co/api/2014/proficiencies。覆盖技能熟练（18 项，中文名对齐
roleplayer.data.SKILL_LIBRARY 同一命名空间）、豁免熟练（6 项 -> D20 三豁免轴）、
武器/护甲/工具/乐器/赌具/载具熟练。

type 为 API 的熟练大类（Skills / Saving Throws / Weapons / Armor / Artisan's
Tools / Musical Instruments …）；ref 为 API 的关联引用原名。
条目名全量中文化，英文原名保留在 `en`。本文件由脚本生成，勿手工编辑。
"""\nfrom __future__ import annotations\n''',
        [("PROFICIENCIES", PROFICIENCIES)],
    )

    write_file(
        os.path.join(OUT, "data_reference.py"),
        '''"""roleplayer.data_reference - D&D 5e SRD 参考常量与规则速查（由权威 API 转换）

来源：dnd5eapi.co/api/2014 的 ability-scores(6) / alignments(9) /
damage-types(13) / magic-schools(8) / languages(16) / skills(18) /
rules(6) / rule-sections(33)，由 gen_srd_v21.py 转换。

用途：给 ReferenceService 提供 DM 侧规则速查与枚举翻译（伤害类型、学派、
阵营、语言、武器属性…），并让 SRD 的 18 项技能与 roleplayer.data.SKILL_LIBRARY
可交叉核对。条目名全量中文化，英文原名保留在 `en`，官方描述保留在 `desc_en`。
本文件由脚本生成，勿手工编辑。
"""\nfrom __future__ import annotations\n''',
        [("ABILITY_SCORES", ABILITY_SCORES), ("ALIGNMENTS", ALIGNMENTS),
         ("DAMAGE_TYPES", DAMAGE_TYPES), ("MAGIC_SCHOOLS", MAGIC_SCHOOLS),
         ("LANGUAGES", LANGUAGES), ("SRD_SKILLS", SRD_SKILLS),
         ("RULES", RULES), ("RULE_SECTIONS", RULE_SECTIONS)],
    )

    # ---- 覆盖率报告 ----
    def cn_ratio(d):
        return sum(1 for k in d if re.search(r"[一-鿿]", k)), len(d)

    print("generated data_classes.py / data_equipment_srd.py / "
          "data_proficiencies.py / data_reference.py")
    for name, d in [("CLASSES", CLASSES), ("CLASS_LEVELS", CLASS_LEVELS),
                    ("SUBCLASSES", SUBCLASSES), ("FEATURES", FEATURES),
                    ("SRD_EQUIPMENT", SRD_EQUIPMENT),
                    ("WEAPON_PROPERTIES", WEAPON_PROPERTIES),
                    ("PROFICIENCIES", PROFICIENCIES),
                    ("ABILITY_SCORES", ABILITY_SCORES), ("ALIGNMENTS", ALIGNMENTS),
                    ("DAMAGE_TYPES", DAMAGE_TYPES), ("MAGIC_SCHOOLS", MAGIC_SCHOOLS),
                    ("LANGUAGES", LANGUAGES), ("SRD_SKILLS", SRD_SKILLS),
                    ("RULES", RULES), ("RULE_SECTIONS", RULE_SECTIONS)]:
        cn, total = cn_ratio(d)
        flag = "OK " if cn == total else "!! "
        print(f"{flag}{name:20s} zh={cn}/{total}")
    lv_total = sum(len(v) for v in CLASS_LEVELS.values())
    print(f"   CLASS_LEVELS total records: {lv_total}")
    # 未中文化的残留（供人工补齐）
    for name, d in [("FEATURES", FEATURES), ("SRD_EQUIPMENT", SRD_EQUIPMENT),
                    ("PROFICIENCIES", PROFICIENCIES), ("SUBCLASSES", SUBCLASSES)]:
        left = [k for k in d if not re.search(r"[一-鿿]", k)]
        if left:
            print(f"   !! {name} 非中文键 {len(left)}: {left[:12]}")


if __name__ == "__main__":
    main()
