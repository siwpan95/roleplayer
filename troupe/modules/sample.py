"""troupe.modules.sample - 示例战役：边陲镇古神祭

一个可直接载入 ``Simulator`` 的悬疑模组。它只提供**初始种子**（地点 / 通路 / NPC /
派系 / 任务 / 时钟 / 线索），真正的剧情走向由导演 + 智能体 + 随机表即兴生成 —— 这正是
GME（GM 模拟器）式「无预设跑团」的精髓：模组给骨架，模拟器填血肉。

结构（对应 ``CampaignModule``）：
    places    地点图（含危险度，决定遭遇频率）
    routes    通路（决定旅行目的地与耗时）
    npcs      关键 NPC（带态度/目标/秘密）
    factions  派系（带目标/声望/盟友/对手）
    quests    任务（目标 + 线索 + 奖励）
    clocks    进度时钟（危机 / 战役自推进）
    threads   剧情线索（随机事件可命中的主线）
"""
from __future__ import annotations

from ..contracts import (
    CampaignModule,
    Clock,
    Clue,
    FactionProfile,
    NpcProfile,
    Objective,
    Place,
    Quest,
    Route,
    Thread,
)


def build_sample_module() -> CampaignModule:
    places = [
        Place(id="border_town", name="边陲镇", region="灰岭", kind="城镇",
              danger=1, tags=["补给", "安全"], discovered=True, visited=0,
              description="商路上的最后一处补给点，镇民对神社的异象噤若寒蝉。"),
        Place(id="old_road", name="旧商道", region="灰岭", kind="道路",
              danger=2, tags=["野外"], description="荒废多年，入夜后常闻怪声。"),
        Place(id="ruined_shrine", name="荒神社", region="灰岭", kind="遗迹",
              danger=4, tags=["邪教", "异象"], description="塌了半边的石祠，夜半有听不懂的吟诵。"),
        Place(id="forest_camp", name="林间营地", region="灰岭", kind="荒野",
              danger=2, tags=["旅人"], description="失踪旅人最后露营之处。"),
        Place(id="lord_manor", name="领主宅", region="灰岭", kind="建筑",
              danger=1, tags=["权贵"], description="灰岭领主沈氏的宅邸，门禁森严。"),
    ]
    routes = [
        Route(id="r1", a="border_town", b="old_road", distance_km=12, terrain="道路", danger=1),
        Route(id="r2", a="old_road", b="ruined_shrine", distance_km=8, terrain="森林", danger=3),
        Route(id="r3", a="old_road", b="forest_camp", distance_km=5, terrain="森林", danger=2),
        Route(id="r4", a="border_town", b="lord_manor", distance_km=2, terrain="道路", danger=1, hidden=True),
    ]
    npcs = [
        NpcProfile(id="npc_mayor", name="沈碌", role="镇长", faction="town_guild",
                   place="border_town", disposition=0, traits=["谨慎", "守旧"],
                   wants="维持镇子表面的平静", secret="他明知神社邪教却不敢上报。"),
        NpcProfile(id="npc_innkeeper", name="柯三娘", role="酒馆老板", faction="town_guild",
                   place="border_town", disposition=1, traits=["八卦", "好客"],
                   wants="多卖几杯酒", secret="她见过失踪旅人进了神社。"),
        NpcProfile(id="npc_priest", name="枯眼", role="邪教祭司", faction="old_cult",
                   place="ruined_shrine", disposition=-2, traits=["狂热", "阴鸷"],
                   wants="完成唤醒古神的仪式", secret="仪式还差最后一名活祭。"),
        NpcProfile(id="npc_lost", name="云游客", role="失踪旅人", faction="",
                   place="forest_camp", disposition=0, traits=["警觉"],
                   wants="活着离开灰岭", secret="他偷听到了仪式的日期。"),
    ]
    factions = [
        FactionProfile(id="town_guild", name="镇民公会", goals=["保境安民", "维持商贸"],
                       standing=0, power=3, allies=[], rivals=["old_cult"]),
        FactionProfile(id="old_cult", name="古神教团", goals=["唤醒古神", "献祭活人"],
                       standing=-30, power=6, allies=[], rivals=["town_guild"]),
    ]
    quests = [
        Quest(id="q_shrine", title="查明荒神社异象",
              summary="边陲镇夜半的吟诵来自荒神社，镇民噤声，须查明真相。",
              objectives=[
                  Objective(id="o1", text="进入荒神社勘察", done=False),
                  Objective(id="o2", text="揭露古神教团的仪式", done=False),
                  Objective(id="o3", text="解救失踪旅人云游客", done=False, optional=True),
              ],
              clues=[
                  Clue(id="c1", text="酒馆老板柯三娘见过旅人进神社", target="npc_innkeeper"),
                  Clue(id="c2", text="神社地窖有血迹与符文", target="ruined_shrine"),
              ],
              giver="npc_mayor", reward_xp=200, reward_gold=150, status="active",
              clock_id="cl_cult"),
    ]
    clocks = [
        Clock(id="cl_cult", name="古神教团的仪式", segments=8, kind="campaign",
              consequence="仪式完成，古神苏醒，灰岭沦陷。"),
        Clock(id="cl_danger", name="追猎者逼近", segments=4, kind="danger",
              consequence="邪教猎手找上门来。"),
    ]
    threads = [
        Thread(id="t1", text="神社夜半的吟诵究竟在召唤什么？", weight=2),
        Thread(id="t2", text="失踪旅人云游客的下落", weight=2),
        Thread(id="t3", text="领主沈碌为何不敢上报？", weight=1),
    ]
    return CampaignModule(
        id="border_shrine", title="边陲镇古神祭",
        premise="灰岭边陲镇夜半响起荒神社的吟诵，旅人接连失踪。"
                "一支冒险队受镇民所托，查清真相。",
        regions=["灰岭"],
        places=places, routes=routes, npcs=npcs, factions=factions,
        quests=quests, clocks=clocks, threads=threads,
        starting_place="border_town", target_scenes=8,
    )


__all__ = ["build_sample_module"]
