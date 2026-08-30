"""d20.character_io - 角色卡持久化与随机生成

打通「车卡 → 导出 → 加载 → 模拟对战」链路：

- :func:`save_character` / :func:`load_character`：JSON 文件读写
- :func:`character_from_dict`：从字典恢复 Character
- :func:`random_character`：随机生成一张可直接进模拟对战的角色卡
"""
from __future__ import annotations

import json
import random
from datetime import datetime
from pathlib import Path

from .character import Character
from .data_classes import CLASSES

SAVE_FORMAT = "d20-character"
SAVE_VERSION = 1

# CharacterState 标量字段（JSON 直接可存）
_SCALAR_FIELDS = (
    "cp", "base_cp", "purchases", "max_disadvantage_cp",
    "armor_bonus", "race", "race_element", "background",
    "current_hp", "hit_dice_used", "lucky_used", "breath_used",
    "relentless_used", "cls", "level", "subclass",
)

# CharacterState 容器字段（深拷贝，避免别名共享）
_CONTAINER_FIELDS = (
    "attributes", "advantages", "disadvantages", "talents",
    "skills", "techniques", "equipment", "feats", "proficiencies",
    "slots", "slots_used", "conditions",
    "gear_proficiencies", "save_proficiencies",
)


def _copy(value):
    if isinstance(value, dict):
        return dict(value)
    if isinstance(value, (list, tuple)):
        return list(value)
    return value


def to_full_dict(char: Character) -> dict:
    """导出完整角色状态为字典（含格式元信息）。"""
    st = char.state
    data = {
        "__format__": SAVE_FORMAT,
        "version": SAVE_VERSION,
        "saved_at": datetime.now().isoformat(timespec="seconds"),
    }
    for field in _SCALAR_FIELDS:
        data[field] = _copy(getattr(st, field))
    for field in _CONTAINER_FIELDS:
        data[field] = _copy(getattr(st, field))
    data["armor_max_dex"] = getattr(st, "_armor_max_dex", 99)
    return data


def character_from_dict(data: dict) -> Character:
    """从字典恢复角色（宽松容错，缺失字段用默认值）。"""
    char = Character()
    st = char.state
    for field in _SCALAR_FIELDS:
        if field in data:
            setattr(st, field, _copy(data[field]))
    for field in _CONTAINER_FIELDS:
        if field in data:
            value = data[field]
            setattr(st, field, dict(value) if isinstance(value, dict) else list(value))
    if "armor_max_dex" in data:
        st._armor_max_dex = data["armor_max_dex"]
    return char


def save_character(char: Character, path: str | Path) -> str:
    """保存角色卡到 JSON 文件（自动补 .json 后缀），返回绝对路径。"""
    path = Path(path)
    if path.suffix == "":
        path = path.with_suffix(".json")
    path.write_text(
        json.dumps(to_full_dict(char), ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    return str(path.resolve())


def load_character(path: str | Path) -> Character:
    """从 JSON 文件加载角色卡。"""
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    return character_from_dict(data)


# ---------------------------------------------------------------------------
# 随机角色卡
# ---------------------------------------------------------------------------

_CASTER_WEAPONS = ("匕首", "棍棒", "短剑")
_MELEE_WEAPONS = ("长剑", "短剑", "棍棒", "战斧", "钉头锤")
_RANGED_WEAPONS = ("长弓", "短弓", "轻弩")
_LIGHT_ARMORS = ("布甲", "皮甲", "镶钉皮甲")


def _buy_skill(char: Character, skill: str, candidates: tuple[int, ...]) -> bool:
    """尽力把技能买到 candidates 中最高可负担的等级。"""
    for target in candidates:
        ok, _ = char.purchase_skill(skill, target)
        if ok:
            return True
    return False


def random_character(level: int = 3, seed=None) -> Character:
    """随机生成一张「可直接进模拟对战」的角色卡。

    流程：随机职业 → 分配属性（主属性14 / 体质12 / 可选副属性12）→
    升级 → 买战斗技能与根基科 → 随机装备（轻甲 + 武器）。
    全程走服务 API 扣 CP，CP 不足时自动降级，保证任意等级都能生成。
    """
    rng = random.Random(seed)
    char = Character()

    # 1. 职业（必须先选：创建期限制，purchases==0）
    cls_name = rng.choice(list(CLASSES.keys()))
    info = CLASSES[cls_name]
    char.set_class(cls_name)

    # 2. 属性
    primary = info.get("primary") or ["力量"]
    main_attr = primary[0]
    sc = info.get("spellcasting")
    cast_attr = sc["ability"] if sc else None
    char.set_attribute(main_attr, 14)
    sec_attr = cast_attr or (primary[1] if len(primary) > 1 else None)
    if sec_attr and sec_attr != main_attr:
        char.set_attribute(sec_attr, 12)
    if "体质" not in (main_attr, sec_attr):
        char.set_attribute("体质", 12)

    # 3. 等级（CP 不足则逐级下调）
    target = max(1, int(level))
    while target > 1:
        ok, _ = char.level_to(target)
        if ok:
            break
        target -= 1

    # 4. 技能（战斗核心 + 根基科）
    is_caster = bool(sc)
    if is_caster:
        _buy_skill(char, "奥术施法", (12, 10, 8, 6, 4, 2, 1))
        _buy_skill(char, "施法攻击", (12, 10, 8, 6, 4, 2, 1))
        char.purchase_technique("火焰箭")
        char.purchase_technique("魔法飞弹")
    else:
        use_melee = rng.random() < 0.7
        skill = "近战攻击" if use_melee else "远程攻击"
        _buy_skill(char, skill, (12, 10, 8, 6, 4, 2, 1))
    _buy_skill(char, "活力", (4, 3, 2, 1))
    _buy_skill(char, "闪避防御", (2, 1))
    for s in ("强韧豁免", "反射豁免", "意志豁免"):
        char.purchase_skill(s, 1)

    # 5. 装备
    if is_caster:
        weapon = rng.choice(_CASTER_WEAPONS)
    elif rng.random() < 0.7:
        weapon = rng.choice(_MELEE_WEAPONS)
    else:
        weapon = rng.choice(_RANGED_WEAPONS)
    char.equip_item(weapon)
    char.equip_item(rng.choice(_LIGHT_ARMORS))

    return char
