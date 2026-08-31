"""troupe.modules.handwritten - P3 手写战役模组（2026-08-31，原创中文）

三个主题各异的悬疑/商战模组，结构与 ``sample.py``（border_shrine）一致：
只提供初始种子（地点/通路/NPC/派系/任务/时钟/线索），剧情由导演+智能体即兴展开。
"""
from __future__ import annotations

from ..contracts import (
    CampaignModule, Clock, Clue, FactionProfile, NpcProfile, Objective,
    Place, Quest, Route, Thread,
)


def build_mirror_inn_module() -> CampaignModule:
    """镜湖客栈：住客夜半失踪，镜中却多出人影。"""
    places = [
        Place(id="inn", name="镜湖客栈", region="雾岭", kind="建筑", danger=1,
              tags=["客栈", "怪谈"], discovered=True,
              description="临湖而建的老客栈，大厅悬着一面整墙铜镜，蒙尘却照人分明。"),
        Place(id="dock", name="旧码头", region="雾岭", kind="荒野", danger=2,
              tags=["湖畔"], description="栈桥朽了一半，湖水深黑，夜里能听见船桨声却不见船。"),
        Place(id="lake_isle", name="湖心岛", region="雾岭", kind="遗迹", danger=4,
              tags=["禁地", "异象"], description="雾里若隐若现的石屋，只有无月的夜里才看得清轮廓。"),
        Place(id="village", name="望湖村", region="雾岭", kind="城镇", danger=1,
              tags=["补给"], description="湖边的渔村，村民对客栈讳莫如深。"),
        Place(id="mirror_hall", name="镜厅", region="雾岭", kind="地牢", danger=5,
              tags=["镜像"], description="客栈地窖里的回廊，四面皆镜，走到深处会分不清来路。"),
    ]
    routes = [
        Route(id="r1", a="inn", b="village", distance_km=4, terrain="道路", danger=1),
        Route(id="r2", a="inn", b="dock", distance_km=1, terrain="道路", danger=2),
        Route(id="r3", a="dock", b="lake_isle", distance_km=2, terrain="水路", danger=4, hidden=True),
        Route(id="r4", a="inn", b="mirror_hall", distance_km=0, terrain="地下", danger=4, hidden=True),
    ]
    npcs = [
        NpcProfile(id="npc_keeper", name="镜婆婆", role="客栈掌柜", faction="inn_hands",
                   place="inn", disposition=0, traits=["慈祥", "讳莫如深"],
                   wants="客栈能平安撑过这个冬天", secret="她每晚都要给镜子上油。"),
        NpcProfile(id="npc_waiter", name="哑仆", role="跑堂", faction="inn_hands",
                   place="inn", disposition=0, traits=["沉默"],
                   wants="找到失踪的妹妹", secret="他妹妹最后出现在镜厅门口。"),
        NpcProfile(id="npc_fisher", name="老艄公", role="渔夫", faction="villagers",
                   place="dock", disposition=1, traits=["迷信", "健谈"],
                   wants="劝退每一个想夜里划船的人", secret="他见过镜子里的人朝他招手。"),
    ]
    factions = [
        FactionProfile(id="inn_hands", name="客栈众人", goals=["维持营生", "守住客栈的秘密"],
                       standing=0, power=2, allies=["villagers"], rivals=["mirror_folk"]),
        FactionProfile(id="villagers", name="望湖村村民", goals=["远离镜湖的怪事"],
                       standing=0, power=2, allies=["inn_hands"], rivals=[]),
        FactionProfile(id="mirror_folk", name="镜中人", goals=["顶替生者", "走出镜厅"],
                       standing=-20, power=7, allies=[], rivals=["inn_hands"]),
    ]
    quests = [
        Quest(id="q_missing", title="查明住客失踪之谜",
              summary="客栈接连有住客夜半失踪，登记簿上的名字次日却还在。",
              objectives=[
                  Objective(id="o1", text="向客栈众人打听失踪住客", done=False),
                  Objective(id="o2", text="深夜探查镜厅", done=False),
                  Objective(id="o3", text="找到镜中人的巢穴", done=False, optional=True),
              ],
              clues=[
                  Clue(id="c1", text="哑仆的妹妹最后出现在镜厅门口", target="npc_waiter"),
                  Clue(id="c2", text="老艄公见过镜子里的人招手", target="npc_fisher"),
              ],
              giver="npc_keeper", reward_xp=200, reward_gold=120, status="active",
              clock_id="cl_mirror"),
    ]
    clocks = [
        Clock(id="cl_mirror", name="镜面蔓延", segments=6, kind="campaign",
              consequence="镜中人成群走出镜厅，顶替了半个村子。"),
        Clock(id="cl_danger", name="雾夜行船", segments=4, kind="danger",
              consequence="无月的夜里，湖面传来成片的船桨声。"),
    ]
    threads = [
        Thread(id="t1", text="镜子里多出来的人影是谁？", weight=2),
        Thread(id="t2", text="湖心岛的石屋为何只在无月夜可见？", weight=2),
    ]
    return CampaignModule(
        id="mirror_inn", title="镜湖客栈怪谈",
        premise="雾岭镜湖客栈的住客夜半失踪，登记簿上的名字却赖着不走。",
        regions=["雾岭"], places=places, routes=routes, npcs=npcs, factions=factions,
        quests=quests, clocks=clocks, threads=threads, starting_place="inn",
        target_scenes=8)


def build_salt_road_module() -> CampaignModule:
    """盐路风云：运盐车队接连被劫，两方势力都盯上了这条命脉。"""
    places = [
        Place(id="salt_field", name="白滩盐场", region="枯川", kind="据点", danger=2,
              tags=["盐", "工坊"], discovered=True,
              description="一眼望不到边的晒盐滩，监工的皮鞭声从早响到晚。"),
        Place(id="salt_road", name="官盐道", region="枯川", kind="道路", danger=3,
              tags=["商路"], description="运盐车队的必经之路，路旁新坟垒得比界碑还高。"),
        Place(id="bandit_camp", name="鸦巢", region="枯川", kind="据点", danger=4,
              tags=["匪巢"], description="半山腰的匪寨，寨墙上挂满了没有主人的车旗。"),
        Place(id="market", name="盐市", region="枯川", kind="城镇", danger=1,
              tags=["集市"], description="凭盐引进出的集市，柜台后的算盘声没有停过。"),
        Place(id="salt_warehouse", name="官仓", region="枯川", kind="建筑", danger=2,
              tags=["仓储"], description="城墙般厚实的官仓，账房先生住在仓里从不回家。"),
    ]
    routes = [
        Route(id="r1", a="salt_field", b="salt_road", distance_km=20, terrain="道路", danger=2),
        Route(id="r2", a="salt_road", b="market", distance_km=15, terrain="道路", danger=3),
        Route(id="r3", a="salt_road", b="bandit_camp", distance_km=6, terrain="山地", danger=4, hidden=True),
        Route(id="r4", a="market", b="salt_warehouse", distance_km=1, terrain="道路", danger=1),
    ]
    npcs = [
        NpcProfile(id="npc_steward", name="白管事", role="盐场管事", faction="salt_guild",
                   place="salt_field", disposition=0, traits=["刻薄", "精明"],
                   wants="完成本季的盐额", secret="他私下把盐卖给了两拨人。"),
        NpcProfile(id="npc_bookkeeper", name="虞先生", role="账房", faction="salt_guild",
                   place="salt_warehouse", disposition=1, traits=["谨慎", "记性过人"],
                   wants="把账本里的亏空填平", secret="亏空正是他自己做的假账。"),
        NpcProfile(id="npc_bandit", name="断尾", role="匪首", faction="crows",
                   place="bandit_camp", disposition=-1, traits=["豪爽", "多疑"],
                   wants="劫下今秋最后一支盐队", secret="他收买了一个押车的镖师。"),
    ]
    factions = [
        FactionProfile(id="salt_guild", name="盐帮", goals=["垄断盐路", "查清内鬼"],
                       standing=0, power=6, allies=[], rivals=["crows"]),
        FactionProfile(id="crows", name="鸦巢匪帮", goals=["劫断官盐道", "壮大队伍"],
                       standing=-25, power=5, allies=[], rivals=["salt_guild"]),
    ]
    quests = [
        Quest(id="q_caravan", title="夺回被劫的盐车",
              summary="今秋第三支运盐队被劫，押车的镖师活不见人死不见尸。",
              objectives=[
                  Objective(id="o1", text="勘察官盐道的劫案现场", done=False),
                  Objective(id="o2", text="追查被收买的内应", done=False),
                  Objective(id="o3", text="夺回盐车并捣毁鸦巢", done=False, optional=True),
              ],
              clues=[
                  Clue(id="c1", text="账房虞先生对亏空闪烁其词", target="npc_bookkeeper"),
                  Clue(id="c2", text="官盐道旁的新坟埋的不是人", target="salt_road"),
              ],
              giver="npc_steward", reward_xp=250, reward_gold=200, status="active",
              clock_id="cl_salt"),
    ]
    clocks = [
        Clock(id="cl_salt", name="盐路断绝", segments=6, kind="campaign",
              consequence="盐价疯涨，驻军哗变，枯川沿线在入冬前陷入骚乱。"),
        Clock(id="cl_danger", name="匪帮的盯梢", segments=4, kind="danger",
              consequence="鸦巢的探子把队伍的行踪摸得一清二楚。"),
    ]
    threads = [
        Thread(id="t1", text="押车的镖师为什么会凭空消失？", weight=2),
        Thread(id="t2", text="白管事私下把盐卖给了谁？", weight=2),
    ]
    return CampaignModule(
        id="salt_road", title="盐路风云",
        premise="枯川官盐道的运盐队接连被劫，盐市里的算盘声却一天比一天响。",
        regions=["枯川"], places=places, routes=routes, npcs=npcs, factions=factions,
        quests=quests, clocks=clocks, threads=threads, starting_place="salt_field",
        target_scenes=8)


def build_bone_mill_module() -> CampaignModule:
    """白骨磨坊：磨出来的面粉里掺着骨渣，而磨坊主已经死了三年。"""
    places = [
        Place(id="mill", name="河畔磨坊", region="荒原", kind="建筑", danger=3,
              tags=["磨坊", "怪谈"], discovered=True,
              description="水车彻夜转个不停的老磨坊，磨盘声里混着细碎的咯吱声。"),
        Place(id="graveyard", name="乱葬岗", region="荒原", kind="荒野", danger=3,
              tags=["坟地"], description="无人认领的尸首埋在这里，坟头大多没有名字。"),
        Place(id="village", name="磨盘村", region="荒原", kind="城镇", danger=1,
              tags=["补给"], description="靠磨坊吃饭的小村，家家灶台都封着磨坊的面粉。"),
        Place(id="cellar", name="磨坊地窖", region="荒原", kind="地牢", danger=5,
              tags=["禁地"], description="磨坊底下的石窖，墙壁上钉着一排排风干的皮囊。"),
        Place(id="old_millhouse", name="旧磨坊主屋", region="荒原", kind="遗迹", danger=4,
              tags=["遗宅"], description="磨坊主生前的住所，门窗用铁条钉死了三年。"),
    ]
    routes = [
        Route(id="r1", a="mill", b="village", distance_km=3, terrain="道路", danger=1),
        Route(id="r2", a="mill", b="graveyard", distance_km=2, terrain="道路", danger=3),
        Route(id="r3", a="mill", b="cellar", distance_km=0, terrain="地下", danger=5, hidden=True),
        Route(id="r4", a="graveyard", b="old_millhouse", distance_km=1, terrain="道路", danger=3, hidden=True),
    ]
    npcs = [
        NpcProfile(id="npc_miller", name="石磨", role="磨坊帮工", faction="villagers",
                   place="mill", disposition=0, traits=["木讷", "力大"],
                   wants="保住这份没人敢干的差事", secret="他半夜见过磨坊主在磨盘边站着。"),
        NpcProfile(id="npc_widow", name="宋寡妇", role="村妇", faction="villagers",
                   place="village", disposition=1, traits=["泼辣", "护短"],
                   wants="查出面粉里的骨渣来源", secret="她男人就埋在乱葬岗，坟是空的。"),
        NpcProfile(id="npc_gravedigger", name="老驼背", role="守墓人", faction="keepers",
                   place="graveyard", disposition=0, traits=["沉默", "知根知底"],
                   wants="让死人入土为安", secret="他替人埋过三具「还活着」的尸首。"),
    ]
    factions = [
        FactionProfile(id="villagers", name="磨盘村村民", goals=["活下去", "查清磨坊真相"],
                       standing=0, power=2, allies=["keepers"], rivals=["bone_cult"]),
        FactionProfile(id="keepers", name="守墓人公会", goals=["让死人入土为安"],
                       standing=0, power=2, allies=["villagers"], rivals=["bone_cult"]),
        FactionProfile(id="bone_cult", name="窃骨者", goals=["收集尸骨", "喂饱磨盘下的东西"],
                       standing=-20, power=6, allies=[], rivals=["villagers", "keepers"]),
    ]
    quests = [
        Quest(id="q_flour", title="追查面粉里的骨渣",
              summary="磨坊磨出的面粉里掺着碾碎的骨渣，而磨坊主已死了三年。",
              objectives=[
                  Objective(id="o1", text="检查河畔磨坊与磨盘", done=False),
                  Objective(id="o2", text="向守墓人打听乱葬岗异状", done=False),
                  Objective(id="o3", text="探明磨坊地窖的真相", done=False, optional=True),
              ],
              clues=[
                  Clue(id="c1", text="宋寡妇男人的坟是空的", target="npc_widow"),
                  Clue(id="c2", text="老驼背替人埋过「还活着」的尸首", target="npc_gravedigger"),
              ],
              giver="npc_widow", reward_xp=220, reward_gold=130, status="active",
              clock_id="cl_grind"),
    ]
    clocks = [
        Clock(id="cl_grind", name="磨盘下的饥饿", segments=6, kind="campaign",
              consequence="磨盘下的东西吃光了乱葬岗，开始敲各家的门。"),
        Clock(id="cl_danger", name="夜巡的窃骨者", segments=4, kind="danger",
              consequence="窃骨者发现有人在查磨坊，夜里的磨盘声更近了。"),
    ]
    threads = [
        Thread(id="t1", text="死了三年的磨坊主为什么还站在磨盘边？", weight=2),
        Thread(id="t2", text="乱葬岗里究竟埋过什么？", weight=2),
    ]
    return CampaignModule(
        id="bone_mill", title="白骨磨坊",
        premise="荒原磨盘村的面粉里掺着骨渣，而磨坊主已经死了三年。",
        regions=["荒原"], places=places, routes=routes, npcs=npcs, factions=factions,
        quests=quests, clocks=clocks, threads=threads, starting_place="mill",
        target_scenes=8)


__all__ = ["build_mirror_inn_module", "build_salt_road_module",
           "build_bone_mill_module"]
