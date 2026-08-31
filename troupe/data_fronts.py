"""troupe.data_fronts - 战役阴谋模板（P0 内容填充，2026-08-30）

结构借鉴 Dungeon World fronts（威胁 → 危机 → 坏结局 → 阶段推进）与
Blades in the Dark 的时钟概念（见 docs/CONTENT-CREDITS.md 署名声明）。
全部为**中文原创重写**；由 ``troupe.modules.generator`` 经独立
``random.Random(seed)`` 挑选，注入程序化战役的时钟与派系目标。
"""
from __future__ import annotations

import random

#: 阴谋模板列表
FRONTS: list[dict] = [
    {
        "id": "灰烬契约",
        "threat": "一支以焚烧旧契约起家的秘密结社，正把整座城的债务据为己有。",
        "drivers": ["放贷", "纵火", "灭口"],
        "clock": "焚城之夜",
        "grim": "全城的契约化为灰烬，欠债者与债主一同被拖入火场。",
    },
    {
        "id": "无声圣堂",
        "threat": "一个崇拜「寂静」的教团在城中地下扩建祭坛，把反对者一个个变成哑巴。",
        "drivers": ["传教", "绑架", "封口"],
        "clock": "万籁俱寂",
        "grim": "钟声再也不会响起，整座城陷入没有尽头的安静。",
    },
    {
        "id": "盐路断绝",
        "threat": "有组织地截断盐路的匪帮，正把北方的运盐商队一支支吞掉。",
        "drivers": ["劫道", "勒索", "垄断"],
        "clock": "盐荒",
        "grim": "盐价疯涨，驻军哗变，沿途城镇在冬天来临前陷入骚乱。",
    },
    {
        "id": "镜中王朝",
        "threat": "一面古镜里的「另一座城」开始向外置换活人，被换回来的人只是外表一样。",
        "drivers": ["置换", "渗透", "顶替"],
        "clock": "镜城降临",
        "grim": "镜中的城市与真实世界重叠，没有人分得清自己身在何处。",
    },
    {
        "id": "亡者税吏",
        "threat": "一名自称替「旧王」收税的收尸人，正向每个村子征收「三成寿命」。",
        "drivers": ["收税", "掘墓", "立约"],
        "clock": "旧王还朝",
        "grim": "旧王的债簿翻到最后一页，所有签过约的人同时倒下。",
    },
    {
        "id": "黑帆共济会",
        "threat": "一支没有旗帜的船队把持了入海口，向每个靠港的人收「买路命」。",
        "drivers": ["封锁", "劫船", "招揽"],
        "clock": "黑帆蔽日",
        "grim": "黑帆船队倾巢而出，沿海城镇在一天之内全部易主。",
    },
]


def pick_front(rnd: random.Random) -> dict:
    """从模板中挑一个阴谋（``rnd`` 为生成器独立 Random，保证确定性）。"""
    return rnd.choice(FRONTS)


__all__ = ["FRONTS", "pick_front"]
