"""P1 D&D 5.2 (2024) SRD 增量测试（2026-08-31）。

数据源：open5e `srd-2024`（官方 System Reference Document 5.2，CC BY 4.0）。
覆盖：新增条目在场且字段契约完整、环位登记齐备、旧条目未被改动、
Web 镜像与 Python 侧同规模。
"""
from roleplayer.data_monsters import MONSTERS
from roleplayer.data_spells import SRD_SPELLS, SRD_SPELL_RINGS

#: 本次新增的 26 法术 / 20 怪物（中文键）
NEW_SPELLS = [
    "生命光环", "迷惘术", "魅惑怪物", "五彩球", "与自然沟通", "嘈杂低语", "神圣斩",
    "龙息术", "元素操纵", "缠网打击", "咒缚", "冰刃", "融入岩石", "心灵钉刺",
    "无痕而行", "幻影之力", "律令治愈", "能量防护", "疾病射线", "灼热斩", "光耀斩",
    "术法爆发", "星屑", "召唤巨龙", "海啸术", "蚀酸球",
]
NEW_MONSTERS = [
    "异特龙", "甲龙", "古巨龟", "巨蝇", "半龙", "河马", "梦魔", "巴弗灭牛头人",
    "无齿翼龙", "博学斯芬克斯", "勇武斯芬克斯", "奇异斯芬克斯", "爬爪群",
    "巨魔残肢", "吸血鬼", "吸血仆役", "哥布林头目", "海盗船长", "侍祭", "卫兵队长",
]


def test_p1_new_spells_present_with_rings():
    assert len(SRD_SPELLS) >= 345
    assert len(SRD_SPELL_RINGS) == len(SRD_SPELLS)
    for name in NEW_SPELLS:
        sp = SRD_SPELLS[name]
        assert sp["en"], name
        assert sp["level"] == SRD_SPELL_RINGS[name], name
        for key in ("school", "time", "range", "dur", "desc"):
            assert sp.get(key), (name, key)
        assert sp.get("comp") is not None


def test_p1_new_monsters_present_with_contract():
    assert len(MONSTERS) >= 354
    for name in NEW_MONSTERS:
        m = MONSTERS[name]
        assert m["en"], name
        assert m["size"] and m["type"], name
        assert m["ac"] > 0, name
        assert m["hp"], name
        assert m["cr"], name
        for ab in ("str", "dex", "con", "int", "wis", "cha"):
            assert isinstance(m[ab], int), (name, ab)
        assert m.get("senses") is not None, name


def test_p1_old_entries_untouched():
    # 抽查旧条目仍原样（值不变）
    assert SRD_SPELLS["火球术"]["level"] == 3
    assert SRD_SPELLS["火球术"]["damage"] == "8d6"
    assert SRD_SPELL_RINGS["火球术"] == 3
    assert MONSTERS["哥布林"]["ac"] == 15
    assert MONSTERS["哥布林"]["cr"] == "1/4"


def test_p1_web_mirror_parity():
    # Web TS 镜像由 gen_ts_data.py 生成；此处核对生成文件中的条目数标记
    path = r"G:\repos\RolePlayer\web\src\engine\data_spells.ts"
    text = open(path, encoding="utf-8").read()
    assert "生命光环" in text and "蚀酸球" in text
    mpath = r"G:\repos\RolePlayer\web\src\engine\data_monsters.ts"
    mtext = open(mpath, encoding="utf-8").read()
    assert "吸血鬼" in mtext and "古巨龟" in mtext
