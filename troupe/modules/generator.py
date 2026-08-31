"""troupe.modules.generator - **程序化战役生成**

此前 ``troupe/modules`` 里只有 1 个手写示例模组（``border_shrine``），
``WorldService.ensure_default_world`` 也是硬编码的 3 地点 + 2 路线 ——
「再开一局」等于重看同一张图。本模块按**种子**生成整张战役骨架：
地名 / 路线 / 派系 / NPC / 任务链 / 时钟 / 线索。

生成原则
--------
* **种子决定一切**：同种子必得同一张图；不同种子给出不同地图、不同任务链。
* **不污染模拟器随机源**：用独立的 ``random.Random(seed)``，不消耗
  ``ctx.rng`` 的分域流，因此存档的 rng 快照与重演确定性不受影响。
* **任务是真的任务**：生成出的任务形成**依赖链**（``depends_on``，见
  ``QuestService``），并挂上期限（``deadline_minutes``）与失败条件
  （``fail_condition="clock:..."``），所以程序化战役同样「会卡住、会过期、会失败」。
"""
from __future__ import annotations

import random
from typing import Any, Optional

from ..contracts import (
    CampaignModule, Clue, Clock, FactionProfile, NpcProfile, Objective,
    Place, Quest, Route, Thread,
)


# --------------------------------------------------------------------------- #
#  词表（自研，中文奇幻地名/组织名构件）
# --------------------------------------------------------------------------- #
_NAME_A = ("灰", "白", "黑", "赤", "青", "金", "银", "古", "新", "寒",
           "炎", "雾", "石", "铁", "月", "星", "暗", "苍")
_NAME_B = ("岩", "林", "渡", "堡", "窟", "塔", "墟", "渊", "原", "岭",
           "湾", "径", "泉", "冢", "市", "港", "垣", "丘")

#: 地点类型 → 权重（越常见的越容易被抽中）
_PLACE_KINDS: tuple[tuple[str, float], ...] = (
    ("荒野", 3.0), ("据点", 2.5), ("城镇", 2.5),
    ("遗迹", 2.0), ("地牢", 1.5), ("建筑", 1.0),
)
_TERRAINS = ("道路", "平原", "森林", "丘陵", "山地", "沼泽", "沙漠", "水路")

#: 派系名构件
_FACTION_A = ("铁", "银", "赤", "灰", "静", "长", "暗", "圣")
_FACTION_B = ("誓约", "之手", "教团", "商社", "兄弟会", "守望", "议会", "遗族")

#: 任务模板：动词 + 目标（拼成任务标题）
_QUEST_VERBS = ("查明", "夺回", "护送", "封印", "摧毁", "寻回", "调解", "揭露")
_QUEST_NOUNS = ("失踪的商队", "失窃的典籍", "腐化的水源", "古老的封印",
                "背叛者的名单", "失踪的孩子", "被夺的遗物", "暗中的契约")

#: 目标模板
_OBJ_TEMPLATES = (
    "抵达{d}并确认情况",
    "从{d}取得关键情报",
    "在{d}解决主要阻碍",
    "把结果回报给发起人",
)

#: 线索模板
_CLUE_TEMPLATES = (
    "{d}的居民似乎知道些什么",
    "有人在{d}附近留下了痕迹",
    "一份残缺的记录提到了{d}",
    "传闻把线索指向{d}",
)


def _unique_name(rnd: random.Random, taken: set) -> str:
    """拼一个不重复的地名。"""
    for _ in range(64):
        name = f"{rnd.choice(_NAME_A)}{rnd.choice(_NAME_B)}"
        if name not in taken:
            taken.add(name)
            return name
    # 极端情况下加数字兜底
    i = len(taken)
    name = f"无名之地{i}"
    taken.add(name)
    return name


def generate_module(seed: int = 0, *, module_id: str = "generated",
                    n_places: int = 5, n_quests: int = 3,
                    title: str = "") -> CampaignModule:
    """按种子生成一个完整战役模组。

    :param seed: 生成种子（同种子 → 同一张图）
    :param n_places: 地点数（≥2）
    :param n_quests: 任务数（≥1，会串成依赖链）
    """
    rnd = random.Random(int(seed))
    n_places = max(2, int(n_places))
    n_quests = max(1, int(n_quests))

    # ---- 地点 ----
    taken: set = set()
    places: list[Place] = []
    for i in range(n_places):
        name = _unique_name(rnd, taken)
        kind = rnd.choices([k for k, _ in _PLACE_KINDS],
                           weights=[w for _, w in _PLACE_KINDS], k=1)[0]
        # 城镇/据点偏安全，地牢/遗迹偏危险
        base = {"城镇": 1, "据点": 2, "建筑": 2, "荒野": 3, "遗迹": 4, "地牢": 5}[kind]
        danger = max(1, min(5, base + rnd.randint(-1, 1)))
        places.append(Place(
            id=f"p{i+1}", name=name, kind=kind, danger=danger,
            discovered=(i == 0),
            description=f"一处{kind}：{rnd.choice(_CLUE_TEMPLATES).format(d=name)}",
            tags=[kind],
        ))
    start_id = places[0].id

    # ---- 路线：先串成链保证连通，再补 1–2 条捷径 ----
    routes: list[Route] = []
    for i in range(n_places - 1):
        routes.append(Route(
            id=f"r{i+1}", a=places[i].id, b=places[i + 1].id,
            distance_km=round(rnd.uniform(8.0, 60.0), 1),
            terrain=rnd.choice(_TERRAINS),
            danger=max(1, (places[i].danger + places[i + 1].danger) // 2),
            hidden=False,
        ))
    for j in range(min(2, max(0, n_places - 3))):
        a, b = rnd.sample(range(n_places), 2)
        routes.append(Route(
            id=f"rx{j+1}", a=places[a].id, b=places[b].id,
            distance_km=round(rnd.uniform(5.0, 35.0), 1),
            terrain=rnd.choice(_TERRAINS), danger=max(1, rnd.randint(1, 4)),
            hidden=True,          # 捷径：初始未发现
        ))

    # ---- 派系 ----
    fname_taken: set = set()
    factions: list[FactionProfile] = []
    for k in range(2):
        fname = f"{rnd.choice(_FACTION_A)}{rnd.choice(_FACTION_B)}"
        while fname in fname_taken:
            fname = f"{rnd.choice(_FACTION_A)}{rnd.choice(_FACTION_B)}"
        fname_taken.add(fname)
        factions.append(FactionProfile(
            id=f"f{k+1}", name=fname,
            goals=[f"控制{places[rnd.randrange(n_places)].name}"],
            standing=rnd.randint(-10, 10), power=rnd.randint(3, 8),
        ))
    if len(factions) == 2:
        factions[0].rivals = [factions[1].id]
        factions[1].rivals = [factions[0].id]

    # ---- NPC：每个地点 1–2 个 ----
    from ..data_oracle import NPC_ROLES, NPC_TRAITS, NPC_WANTS
    npcs: list[NpcProfile] = []
    for p in places:
        for m in range(1 if p.kind in ("荒野", "地牢") else 2):
            npcs.append(NpcProfile(
                id=f"n{len(npcs)+1}",
                name=f"{rnd.choice(_NAME_A)}{rnd.choice(_NAME_B)}的{rnd.choice(NPC_ROLES)}",
                role=rnd.choice(NPC_ROLES),
                faction=rnd.choice(factions).id if factions else "",
                place=p.id, disposition=rnd.randint(-1, 1),
                traits=[rnd.choice(NPC_TRAITS)],
                wants=[rnd.choice(NPC_WANTS)],
            ))

    # ---- 时钟：危险 + 主线倒计时（P0：阴谋模板注入坏结局时钟与派系目标）----
    from ..data_fronts import pick_front
    front = pick_front(rnd)
    clocks = [
        Clock(id="cl_danger", name="暴露行踪", segments=4, kind="danger",
              consequence="巡逻队围了上来"),
        Clock(id="cl_doom", name=front["clock"], segments=6, kind="campaign",
              consequence=front["grim"]),
    ]
    if factions:
        factions[0].goals = [front["threat"]]

    # ---- 任务链：q1 → q2 → …（后置任务依赖前置）----
    quests: list[Quest] = []
    for q in range(n_quests):
        place = places[min(q + 1, n_places - 1)]
        qid = f"q{q+1}"
        objs = [
            Objective(id=f"{qid}o{j+1}",
                      text=tpl.format(d=place.name),
                      optional=(j == len(_OBJ_TEMPLATES) - 1 and len(_OBJ_TEMPLATES) > 2))
            for j, tpl in enumerate(_OBJ_TEMPLATES[:rnd.randint(2, 3)])
        ]
        clues = [
            Clue(id=f"{qid}c{j+1}",
                 text=tpl.format(d=place.name),
                 target=place.id)
            for j, tpl in enumerate(rnd.sample(_CLUE_TEMPLATES, 2))
        ]
        quests.append(Quest(
            id=qid,
            title=f"{rnd.choice(_QUEST_VERBS)}{rnd.choice(_QUEST_NOUNS)}",
            summary=f"线索指向{place.name}。",
            objectives=objs, clues=clues,
            giver=npcs[rnd.randrange(len(npcs))].id if npcs else "",
            reward_xp=25 * (q + 1), reward_gold=15 * (q + 1),
            # 依赖链：第 1 个任务直接开放，其余锁在前一个之后
            depends_on=[f"q{q}"] if q > 0 else [],
            status="active" if q == 0 else "locked",
            # 越靠后的任务期限越紧；最终任务与主線倒计时绑定
            deadline_minutes=(0 if q == 0 else max(480, 1440 - 240 * q)),
            fail_condition=("clock:cl_doom" if q == n_quests - 1 and n_quests > 1 else ""),
        ))

    threads = [Thread(id="t1", text=f"{places[0].name}的传闻", weight=2),
               Thread(id="t2", text=f"阴谋：{front['threat']}", weight=2)]

    return CampaignModule(
        id=module_id,
        title=title or f"程序化战役 #{seed}",
        premise=f"在{places[0].name}开始的{quests[0].title}。",
        regions=[places[0].name],
        places=places, routes=routes, npcs=npcs, factions=factions,
        quests=quests, clocks=clocks, threads=threads,
        starting_place=start_id,
        target_scenes=8,
    )


def build_generated_module() -> CampaignModule:
    """注册表用的**无参**构造器（0 号种子）。

    想要不同地图请直接调 ``generate_module(seed)``。
    """
    return generate_module(0)


__all__ = ["generate_module", "build_generated_module"]
