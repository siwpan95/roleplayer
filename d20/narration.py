"""d20.narration - 对战叙事文本生成器（D&D 5e SRD + GURPS 战斗描述风格）

把公式化的结算结果（d20+5=17 vs AC15、1d8+3=11）转译为可读的中文「战报」旁白，
为模拟对战提供过程可视化。融合两套规则书的描述特色：

- **D&D 5e SRD**：命中 / 未命中 / 暴击、优势劣势、豁免、死亡豁免、施法、状态。
- **GURPS 风格**：命中部位（头骨/面部/颈部/躯干/腹股沟/手臂/手/腿/脚，B552 表）、
  主动防御（闪避/格挡/招架）、伤害类型差异（穿刺贯穿 / 挥砍劈斩 / 钝击重锤 /
  元素类各具意象）。

本模块是纯文本生成层：无状态、无副作用，只依赖 ``random`` 做措辞多样性选择，
因此可独立单元测试（固定 ``random.seed`` 后输出确定）。
"""
from __future__ import annotations

import random

__all__ = [
    "translate_weapon", "hit_location", "wound_multiplier", "attack_hit",
    "attack_miss", "save_success", "save_fail", "condition_apply",
    "condition_recover", "kill", "down", "cast", "heal", "move", "death_save",
    "resist", "immune", "vuln", "battle_start", "battle_end", "weapon_dtype",
    "initiative",
]


def _pick(*templates: str) -> str:
    """从若干同义模板中随机挑一个，增加叙事变化。"""
    return random.choice(templates)


# =============================================================================
#  伤害类型意象（GURPS 风格：不同伤害类型有不同打击质感）
# =============================================================================
#: 伤害类型 -> (命中动词, 常见命中短语池)
_DTYPE_VERBS = {
    "穿刺": ("刺", ["贯穿要害", "刺入皮肉", "扎进护甲缝隙"]),
    "挥砍": ("劈", ["斩开一道口子", "砍中要害", "划开皮肉"]),
    "钝击": ("砸", ["重重砸下", "锤中躯干", "震得骨裂"]),
    "酸蚀": ("泼洒", ["腐蚀肌肤", "灼蚀护甲", "滋滋冒烟"]),
    "寒冷": ("冻结", ["冻僵肢体", "冰封肌肤", "凝出寒霜"]),
    "火焰": ("灼烧", ["点燃衣角", "燎出一片焦黑", "烧灼皮肉"]),
    "力场": ("冲击", ["无形的力场轰击", "震退数步", "轰出气浪"]),
    "闪电": ("电击", ["劈出电光", "麻痹四肢", "焦糊一片"]),
    "死灵": ("侵蚀", ["吞噬生机", "令皮肉枯萎", "抽走生命力"]),
    "毒素": ("淬毒", ["毒素侵入血液", "伤口泛黑", "毒发蔓延"]),
    "心灵": ("侵袭", ["撕裂心智", "搅乱心神", "钻入脑海"]),
    "光耀": ("灼照", ["灼穿黑暗", "净化之光笼罩", "耀眼灼伤"]),
    "雷鸣": ("震击", ["轰然作响", "震得耳鸣", "气浪震荡"]),
}

#: 远程攻击专用短语（弓/弩/投掷，穿刺意象）
_RANGED_PHRASES = ["一箭射中", "箭矢贯穿", "正中目标", "利箭扎进"]

#: GURPS 人类/类人随机命中部位表（Basic Set p.552，3d6 加权；左右肢合并）。
#: 权重 = 该部位对应的 3d6 组合数（总和 216）。
#: 参考伤口倍率（wounding modifier）：穿刺(imp)×2 / 挥砍(cut)×1.5 / 钝击(cr)×1 /
#: 灼烧(burn)×1 / 腐蚀(cor)×1.5；部位加成：头骨×4(额外+2DR)、颈(cut/cr)×2、
#: 要害(vitals)×3（仅 imp/pi/tight-beam burn 可瞄准）。
_HIT_LOCATIONS = [
    ("躯干", 52),    # 9-10
    ("腿", 61),      # 右腿 6-7(25) + 左腿 13-14(36)
    ("手臂", 46),    # 右臂 8(21) + 左臂 12(25)
    ("腹股沟", 27),  # 11
    ("手", 10),      # 15
    ("面部", 6),     # 5
    ("脚", 6),       # 16
    ("头骨", 4),     # 3-4
    ("颈部", 4),     # 17-18
]

#: 部位 × 物理伤害类型 -> 命中修饰短语池（措辞与伤害类型匹配）
_LOCATION_PHRASES = {
    "头骨": {
        "穿刺": ["贯穿头骨", "刺入颅腔", "从眼窝刺入"],
        "挥砍": ["劈开头骨", "斩在颅顶", "削下一块头皮"],
        "钝击": ["砸在颅顶", "震裂头骨", "敲得颅骨嗡响"],
    },
    "面部": {
        "穿刺": ["刺入面颊", "贯穿下巴", "扎进鼻梁"],
        "挥砍": ["划开面庞", "斩在脸上", "削下一片皮肉"],
        "钝击": ["砸在面门", "打得鼻血横流", "敲在颧骨"],
    },
    "颈部": {
        "穿刺": ["刺穿咽喉", "贯穿颈侧", "扎进颈窝"],
        "挥砍": ["砍中颈项", "斩向咽喉", "划开颈动脉"],
        "钝击": ["砸中后颈", "重击喉结", "敲得喘不上气"],
    },
    "躯干": {
        "穿刺": ["贯穿胸膛", "刺入肋下", "穿透护甲"],
        "挥砍": ["劈开胸甲", "在胸口划开血口", "砍入肩胛"],
        "钝击": ["重砸胸口", "震断肋骨", "锤在胸膛"],
    },
    "腹股沟": {
        "穿刺": ["刺入小腹", "贯穿腹股沟", "扎进下腹"],
        "挥砍": ["砍中腰腹", "划开小腹", "斩在腹股沟"],
        "钝击": ["重击小腹", "砸中腰胯", "打得弓身蜷缩"],
    },
    "手臂": {
        "穿刺": ["刺穿前臂", "扎入肩头", "贯穿手腕"],
        "挥砍": ["砍中肩头", "划开臂膀", "斩伤手臂"],
        "钝击": ["砸中臂膀", "震麻手臂", "敲在肩头"],
    },
    "手": {
        "穿刺": ["刺穿手掌", "扎进手背", "贯穿指节"],
        "挥砍": ["砍中手腕", "划开手背", "削断手指"],
        "钝击": ["砸中手背", "敲在指节", "震得脱手"],
    },
    "腿": {
        "穿刺": ["刺入大腿", "扎进小腿", "贯穿膝盖"],
        "挥砍": ["砍中大腿", "划开腿肚", "斩伤膝盖"],
        "钝击": ["砸中大腿", "敲在膝盖", "震得腿软"],
    },
    "脚": {
        "穿刺": ["刺穿脚背", "扎进脚踝", "贯穿脚掌"],
        "挥砍": ["砍中脚踝", "划开脚背", "削伤脚筋"],
        "钝击": ["砸中脚背", "踩裂脚趾", "震得踉跄"],
    },
}

#: 元素/能量类伤害（无穿刺/挥砍/钝击之分）统一使用的部位短语
_ELEMENT_LOCATION_PHRASES = {
    "头骨": ["灼上头骨", "轰在颅顶", "笼罩头顶"],
    "面部": ["灼伤面门", "轰在脸上", "燎烧眉眼"],
    "颈部": ["灼伤颈项", "轰中咽喉", "缠绕脖颈"],
    "躯干": ["轰中胸口", "灼伤前胸", "正中躯干"],
    "腹股沟": ["轰中腰腹", "灼伤小腹", "击中腰胯"],
    "手臂": ["灼伤手臂", "轰中肩头", "爬上臂膀"],
    "手": ["灼伤手背", "轰中手腕", "烧灼掌心"],
    "腿": ["灼伤大腿", "扫过膝盖", "袭向小腿"],
    "脚": ["灼伤脚踝", "扫过脚背", "烧灼脚底"],
}


def hit_location() -> str:
    """随机返回一个命中部位名（GURPS 加权部位表）。"""
    cands = []
    for loc, weight in _HIT_LOCATIONS:
        cands.extend([loc] * weight)
    return random.choice(cands)


#: GURPS 物理伤害类型伤口倍率（Basic Set p.379：imp×2 / cut×1.5 / cr×1）。
#: 元素/能量类伤害不参与部位伤口倍率，返回 1.0（保持 D&D 5e 数值平衡）。
_PHYSICAL_WOUND = {"穿刺": 2.0, "挥砍": 1.5, "钝击": 1.0}

#: 命中部位伤口加成（Basic Set p.399 / B552）。头骨×4（额外 +2 DR）、颈部×2；
#: 其余部位×1。头骨与颈部为致命弱点，命中后伤口远重于四肢。
_LOCATION_WOUND = {
    "头骨": 4.0, "颈部": 2.0, "面部": 1.0, "躯干": 1.0, "腹股沟": 1.0,
    "手臂": 1.0, "手": 1.0, "腿": 1.0, "脚": 1.0,
}


def wound_multiplier(loc: str, dtype: str = "挥砍") -> float:
    """返回 GURPS 伤口倍率 = 部位加成 × 伤害类型倍率（元素类恒为 1.0）。

    仅物理三类（穿刺/挥砍/钝击）有类型倍率；元素/能量类返回 1.0，
    避免与 D&D 5e 的元素伤害平衡冲突。调用方决定是否把结果乘到伤害数值上。
    """
    base = _PHYSICAL_WOUND.get(dtype)
    if base is None:
        return 1.0  # 元素/能量类：完全不参与部位伤口倍率
    return base * _LOCATION_WOUND.get(loc, 1.0)


def _location_phrase(loc: str, dtype: str = "挥砍") -> str:
    """按部位 + 伤害类型挑选匹配短语（物理三类专用，元素类回退到通用短语）。"""
    pool = _LOCATION_PHRASES.get(loc, {}).get(dtype)
    if not pool:
        pool = _ELEMENT_LOCATION_PHRASES.get(loc, _ELEMENT_LOCATION_PHRASES["躯干"])
    return _pick(*pool)


def weapon_dtype(weapon: str) -> str:
    """按武器名启发式推断伤害类型（用于 PC 武器的叙事措辞）。"""
    w = str(weapon or "")
    if any(k in w for k in ("矛", "枪", "刺", "匕首", "短剑", "箭", "弩", "标", "戟")):
        return "穿刺"
    if any(k in w for k in ("锤", "棍", "杖", "槌", "拳", "棍棒", "钉头")):
        return "钝击"
    return "挥砍"  # 剑 / 刀 / 斧 / 弯刀等默认挥砍


#: SRD 怪物动作/武器英文名 -> 中文
_WEAPON_CN = {
    "Shortbow": "短弓", "Longbow": "长弓", "Shortsword": "短剑",
    "Greatclub": "大棒", "Club": "木棒", "Bite": "撕咬", "Claw": "利爪",
    "Spear": "长矛", "Javelin": "标枪", "Scimitar": "弯刀", "Dagger": "匕首",
    "Mace": "钉头锤", "Greatsword": "巨剑", "Longsword": "长剑",
    "Quarterstaff": "木杖", "Slam": "猛击", "Sling": "投石索",
    "Hooves": "蹄击", "Sting": "毒刺", "Battleaxe": "战斧",
    "Warhammer": "战锤", "Crossbow": "重弩", "Light Crossbow": "轻弩",
    "Heavy Crossbow": "重弩", "Falchion": "弯刃刀", "Tail": "尾击",
    "Tentacle": "触手", "Pincer": "螯钳", "Talons": "利爪", "Gore": "冲撞",
    "Tusks": "獠牙", "Fist": "拳头", "Kick": "踢击", "Breath": "吐息",
}


def translate_weapon(name: str) -> str:
    """把 SRD 英文武器/动作名翻译成中文（未收录则原样返回）。"""
    return _WEAPON_CN.get(str(name or ""), name)


# =============================================================================
#  攻击叙事
# =============================================================================
def attack_hit(attacker: str, target: str, weapon: str = "",
               dtype: str = "", dmg: int = 0, crit: bool = False,
               ranged: bool = False, location: str = "") -> str:
    """命中叙事：结合伤害类型意象 + 命中部位（GURPS 风格）。

    :param attacker: 攻击方名
    :param target: 目标名
    :param weapon: 武器 / 动作名（可空）
    :param dtype: 伤害类型（canonical 中文，如「挥砍」）
    :param dmg: 结算伤害
    :param crit: 是否暴击
    :param ranged: 是否远程攻击（远程用「射」类动词与短语）
    :param location: 命中部位；传入既定部位（与结算倍率一致），空则随机
    """
    weapon = translate_weapon(weapon)
    if ranged:
        verb = "射"
        phrases = _RANGED_PHRASES
        loc_dtype = "穿刺"
    else:
        dtype = dtype or "钝击"
        verb, phrases = _DTYPE_VERBS.get(dtype, ("击中", ["命中", "击伤"]))
        loc_dtype = dtype
    loc = location or hit_location()
    loc_phrase = _location_phrase(loc, loc_dtype)
    tool = f" 用{weapon}" if weapon else ""
    body = _pick(*phrases)
    if crit:
        return _pick(
            f"{attacker}{tool}挥出致命一击，{loc_phrase}，{body}，{target}遭受重创（暴击 {dmg} 点）！",
            f"电光石火间 {attacker}{tool}正中 {target} 的{loc}，{body}，暴击造成 {dmg} 点伤害！",
        )
    if dmg > 0:
        return _pick(
            f"{attacker}{tool}{verb}向 {target}，{loc_phrase}，{body}（{dmg} 点伤害）。",
            f"{attacker}{tool}一击得手，{body}，{target} 的{loc}溅出血花（-{dmg}）。",
        )
    return f"{attacker}{tool}{verb}向 {target} 的{loc}，{body}。"


def attack_miss(attacker: str, target: str, weapon: str = "", melee: bool = True) -> str:
    """未命中叙事：GURPS 主动防御（闪避 / 格挡 / 招架）三选一。"""
    weapon = translate_weapon(weapon)
    tool = f" 用{weapon}" if weapon else ""
    if melee:
        defense = _pick(
            f"{target} 侧身一闪，堪堪避开",            # 闪避 Dodge
            f"{target} 举盾格挡，荡开了",              # 格挡 Block
            f"{target} 横过兵刃，架开了",              # 招架 Parry
            f"{target} 后撤一步，堪堪避过锋芒",        # 后撤闪避 Retreat（闪避+3）
            f"{target} 咬牙拼力，狂热般格挡住来势",    # 狂热防御 Feverish Defense
        )
    else:
        defense = _pick(
            f"{target} 灵巧地闪身躲过",
            f"{target} 侧滚避开",
            f"{target} 低头避过",
            f"{target} 一个后撤步，堪堪躲开",          # 后撤闪避
        )
    return _pick(
        f"{attacker}{tool}攻向 {target}，却被{defense}，攻击落空。",
        f"{attacker}{tool}的攻势被{defense}，只擦到 {target} 的衣角。",
    )


# =============================================================================
#  豁免叙事
# =============================================================================
_AXIS_CN = {"fort": "强韧", "ref": "反射", "will": "意志"}


def save_success(target: str, axis: str = "ref") -> str:
    """豁免成功叙事（D&D 豁免：惊险闪避 / 咬牙硬扛 / 意志坚定）。"""
    a = _AXIS_CN.get(axis, "豁免")
    return _pick(
        f"{target} 以{a}险险扛住，踉跄着稳住身形。",
        f"{target} {a}过人，勉强撑过了这一击。",
        f"{target} 惊险地避开了大部分伤害。",
    )


def save_fail(target: str, axis: str = "ref", dmg: int = 0, dtype: str = "") -> str:
    """豁免失败叙事。"""
    a = _AXIS_CN.get(axis, "豁免")
    if dmg:
        return _pick(
            f"{target} {a}不支，未能躲开，硬吃下 {dmg} 点伤害。",
            f"{target} 的{a}没能撑住，被结结实实地击中（-{dmg}）。",
        )
    return f"{target} {a}不支，露出了破绽。"


# =============================================================================
#  状态叙事
# =============================================================================
_CONDITION_PHRASES = {
    "中毒": "毒素迅速蔓延，{t} 脸色发青",
    "倒地": "{t} 被掀翻在地",
    "目盲": "{t} 眼前一黑，失去了目标",
    "震慑": "{t} 被震得动弹不得",
    "麻痹": "{t} 四肢僵硬，僵在原地",
    "束缚": "{t} 被死死缠住",
    "石化": "{t} 的身体开始僵化为石",
    "魅惑": "{t} 眼神迷离，心神被夺",
    "惊惧": "{t} 心生恐惧，手脚发软",
    "失能": "{t} 一时间失去行动能力",
    "擒抱": "{t} 被牢牢擒住",
    "耳聋": "{t} 耳中嗡鸣，听不见外界",
    "隐形": "{t} 的身影凭空消失",
    "昏迷": "{t} 眼前一黑，昏死过去",
}


def condition_apply(target: str, cond: str) -> str:
    """状态施加叙事。"""
    tpl = _CONDITION_PHRASES.get(cond)
    if tpl:
        return tpl.format(t=target) + "。"
    return f"{target} 陷入了「{cond}」状态。"


def condition_recover(target: str, cond: str) -> str:
    """摆脱状态叙事。"""
    return _pick(
        f"{target} 挣脱了「{cond}」的束缚，恢复如常。",
        f"{target} 咬紧牙关，挺过了「{cond}」。",
    )


# =============================================================================
#  生死叙事
# =============================================================================
def kill(target: str) -> str:
    """击杀叙事。"""
    return _pick(
        f"{target} 轰然倒地，再也没能站起来！",
        f"{target} 的生命之火就此熄灭，瘫倒在血泊之中。",
        f"{target} 发出一声哀嚎，重重栽倒在地。",
    )


def down(target: str) -> str:
    """角色被打至 0 HP（濒死，尚未死亡）。"""
    return _pick(
        f"{target} 被击倒在地，陷入濒死，气若游丝。",
        f"{target} 踉跄一步，倒地不起，命悬一线。",
    )


def death_save(target: str, outcome: str) -> str:
    """死亡豁免叙事。outcome: success / fail / crit / fumble / stable / dead"""
    return {
        "success": _pick(
            f"{target} 在生死边缘挣扎，勉强稳住了气息。",
            f"{target} 的手指动了动，撑过了一次死亡豁免。",
        ),
        "fail": _pick(
            f"{target} 的气息愈发微弱，生命正在流逝。",
            f"{target} 的伤势加重，濒临死亡。",
        ),
        "crit": f"{target} 猛地睁眼，竟凭意志撑了回来，恢复了 1 点生命！",
        "fumble": f"{target} 的伤势急剧恶化，两次死亡豁免失败！",
        "stable": f"{target} 的气息终于平稳下来，脱离了生命危险。",
        "dead": kill(target),
    }.get(outcome, f"{target} 在生死之间徘徊。")


def resist(target: str, dtype: str) -> str:
    """抗力减半叙事。"""
    return _pick(
        f"{target} 对{dtype}伤害有抗力，只受了不到一半的伤。",
        f"{dtype}打在 {target} 身上，仿佛被无形的抗力削弱。",
    )


def immune(target: str, dtype: str) -> str:
    """免疫叙事。"""
    return _pick(
        f"{dtype}伤害对 {target} 完全无效！",
        f"{target} 对{dtype}毫发无伤，攻击如泥牛入海。",
    )


def vuln(target: str, dtype: str) -> str:
    """易伤加倍叙事。"""
    return _pick(
        f"{target} 对{dtype}尤为脆弱，伤害翻倍！",
        f"{dtype}击中了 {target} 的要害，造成了成倍的伤害！",
    )


# =============================================================================
#  施法 / 治疗 / 移动
# =============================================================================
def cast(attacker: str, target: str, spell: str, dmg: int = 0, dtype: str = "") -> str:
    """施法叙事。"""
    if dmg:
        return _pick(
            f"{attacker} 吟诵咒文，{spell}呼啸而出，正中 {target}（{dmg} 点伤害）。",
            f"{attacker} 抬手释放{spell}，{target} 被轰个正着（-{dmg}）。",
        )
    return f"{attacker} 施展了{spell}，魔力涌向 {target}。"


def heal(attacker: str, target: str, amount: int) -> str:
    """治疗叙事。"""
    return _pick(
        f"{attacker} 为 {target} 灌注了生机，恢复了 {amount} 点生命。",
        f"{target} 的伤口以肉眼可见的速度愈合（+{amount}）。",
    )


def move(unit: str, feet: int, dash: bool = False) -> str:
    """移动叙事。"""
    verb = "疾冲" if dash else "前进"
    return _pick(
        f"{unit} {verb}了 {feet} 尺，逼近战线。",
        f"{unit} 向前推进 {feet} 尺。",
    )


def initiative(unit: str, roll: int) -> str:
    """先攻叙事。"""
    return _pick(
        f"{unit} 蓄势待发（先攻 {roll}）。",
        f"{unit} 摆开架势，抢先攻 {roll}。",
    )


# =============================================================================
#  战斗开场 / 结局
# =============================================================================
def battle_start(party_names: list[str], foe_names: list[str], distance: int) -> str:
    """战斗开场叙事。"""
    p = "、".join(party_names) or "冒险者"
    f = "、".join(foe_names) or "敌人"
    return _pick(
        f"狭窄的战场上，{p} 与 {f} 在 {distance} 尺外对峙，剑拔弩张。",
        f"尘土飞扬，{p} 与 {f} 狭路相逢（相距 {distance} 尺），战斗一触即发。",
    )


def battle_end(winner: str, rounds: int) -> str:
    """战斗结局叙事。winner: party / foe / draw"""
    if winner == "party":
        return _pick(
            f"鏖战 {rounds} 轮后，敌人被尽数击溃，冒险者们取得了胜利！",
            f"第 {rounds} 轮，最后一名敌人倒下，战斗以我方的胜利告终。",
        )
    if winner == "foe":
        return _pick(
            f"战至第 {rounds} 轮，冒险者们力竭倒下，敌人笑到了最后。",
            f"敌人在第 {rounds} 轮击溃了队伍，战斗以失败收场。",
        )
    return f"双方鏖战 {rounds} 轮难分胜负，最终各自退去。"
