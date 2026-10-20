"""troupe.world - 世界地理服务（L2）

持有地点图（``Place`` + ``Route``）与当前位置，负责：

* 地点/通路的增删改查与发现状态；
* 邻接与最短路（BFS，按 ``distance_km`` 加权用 Dijkstra 的简化版）；
* 天气（按日滚动，影响导航与遭遇）；
* 从 ``CampaignModule`` 载入世界骨架。

世界图是**数据驱动**的：模组给骨架，探索/旅行服务给增量（发现新地点、开路）。
"""
from __future__ import annotations

from typing import Optional

from roleplayer.core import Service

from .contracts import CampaignModule, Place, Route
from .data_world import WEATHER


class WorldService(Service):
    """世界地理。挂到 ``ctx.world``。"""

    # calendar/log：天气按日推进、发现新地点记事件
    inject = ["calendar", "log", "rng"]
    name = "world"

    def __init__(self, ctx, config=None) -> None:  # noqa: D107
        super().__init__(ctx, config)
        self.places: dict[str, Place] = {}
        self.routes: list[Route] = []
        self.current: str = ""
        self.weather: str = "晴朗"
        self._weather_day: int = -1

    # ------------------------------------------------------------------ #
    #  构建
    # ------------------------------------------------------------------ #
    def add_place(self, place: Place) -> Place:
        self.places[place.id] = place
        if not self.current:
            self.current = place.id
        return place

    def add_route(self, route: Route) -> Route:
        if route.a in self.places and route.b in self.places:
            self.routes.append(route)
        return route

    def load_module(self, module: CampaignModule) -> None:
        """从战役模组载入世界骨架。"""
        for p in module.places:
            self.add_place(p if hasattr(p, "visited") else Place.from_dict(p))
        for r in module.routes:
            self.add_route(r if hasattr(r, "distance_km") else Route.from_dict(r))
        if module.starting_place in self.places:
            self.current = module.starting_place
        elif self.places:
            self.current = next(iter(self.places))

    def ensure_default_world(self) -> None:
        """没有任何模组时，搭一个能跑起来的最小世界（边界镇 + 两个邻近地点）。"""
        if self.places:
            return
        self.add_place(Place(id="border_town", name="边陲镇", kind="城镇",
                             danger=1, description="商路上的最后一处补给点。"))
        self.add_place(Place(id="old_road", name="旧商道", kind="荒野",
                             danger=2, description="荒废多年，据说夜里不干净。"))
        self.add_place(Place(id="ruined_shrine", name="荒神社", kind="遗迹",
                             danger=3, description="塌了半边的石祠，香火断了很久。"))
        self.add_route(Route(id="r1", a="border_town", b="old_road",
                             distance_km=12, terrain="道路", danger=1))
        self.add_route(Route(id="r2", a="old_road", b="ruined_shrine",
                             distance_km=8, terrain="森林", danger=3))
        self.current = "border_town"
        self.places["border_town"].discovered = True
        self.places["old_road"].discovered = True

    # ------------------------------------------------------------------ #
    #  查询
    # ------------------------------------------------------------------ #
    def place(self, pid: str) -> Optional[Place]:
        return self.places.get(pid)

    def here(self) -> Optional[Place]:
        return self.places.get(self.current)

    def neighbors(self, pid: str) -> list[Place]:
        out = []
        for r in self.routes:
            if r.hidden:
                continue
            other = r.b if r.a == pid else (r.a if r.b == pid else None)
            if other and other in self.places:
                out.append(self.places[other])
        return out

    def route_between(self, a: str, b: str) -> Optional[Route]:
        for r in self.routes:
            if {r.a, r.b} == {a, b}:
                return r
        return None

    def path(self, a: str, b: str) -> list[str]:
        """最短路径（Dijkstra，按公里数）。不可达返回 ``[]``。"""
        import heapq

        if a not in self.places or b not in self.places:
            return []
        dist = {a: 0.0}
        prev: dict[str, str] = {}
        pq = [(0.0, a)]
        visited = set()
        while pq:
            d, u = heapq.heappop(pq)
            if u in visited:
                continue
            visited.add(u)
            if u == b:
                break
            for r in self.routes:
                if r.hidden:
                    continue
                v = r.b if r.a == u else (r.a if r.b == u else None)
                if v is None or v not in self.places:
                    continue
                nd = d + max(r.distance_km, 0.1)
                if nd < dist.get(v, float("inf")):
                    dist[v] = nd
                    prev[v] = u
                    heapq.heappush(pq, (nd, v))
        if b not in dist:
            return []
        path = [b]
        while path[-1] != a:
            path.append(prev[path[-1]])
        return list(reversed(path))

    def undiscovered(self) -> list[Place]:
        return [p for p in self.places.values() if not p.discovered]

    # ------------------------------------------------------------------ #
    #  变更
    # ------------------------------------------------------------------ #
    def move_to(self, pid: str) -> Optional[Place]:
        if pid in self.places:
            self.current = pid
            p = self.places[pid]
            p.discovered = True
            p.visited += 1
            return p
        return None

    def discover(self, pid: str) -> Optional[Place]:
        p = self.places.get(pid)
        if p and not p.discovered:
            p.discovered = True
            if self.ctx.has("log"):
                self.ctx.log.record("discovery", text=f"发现了新地点：{p.name}",
                                    payload={"place": pid}, tags=["world"])
        return p

    def add_discovered_place(self, name: str, kind: str = "荒野",
                             danger: int = 2, region: str = "") -> Place:
        """探索时新发现的地点（挂到当前地点旁）。"""
        pid = f"found_{len(self.places) + 1}"
        p = Place(id=pid, name=name, kind=kind, danger=danger,
                  region=region, discovered=True)
        self.add_place(p)
        if self.current:
            self.add_route(Route(id=f"r_{self.current}_{pid}", a=self.current, b=pid,
                                 distance_km=6, terrain="平原", danger=danger))
        if self.ctx.has("log"):
            self.ctx.log.record("discovery", text=f"发现了新地点：{name}",
                                payload={"place": pid}, tags=["world"])
        return p

    # ------------------------------------------------------------------ #
    #  天气
    # ------------------------------------------------------------------ #
    def roll_weather(self, day: Optional[int] = None) -> str:
        """按日滚动天气（同一天内重复调用结果稳定）。"""
        day = day if day is not None else self.ctx.calendar.now.day
        if day == self._weather_day:
            return self.weather
        rnd = self.ctx.rng.stream("world")
        weights = [("晴朗", 5), ("阴天", 4), ("细雨", 3), ("浓雾", 2), ("暴雨", 1), ("风雪", 1)]
        total = sum(w for _, w in weights)
        x = rnd.random() * total
        acc = 0
        for name, w in weights:
            acc += w
            if x <= acc:
                self.weather = name
                break
        self._weather_day = day
        return self.weather

    def weather_mod(self) -> dict:
        return WEATHER.get(self.weather, WEATHER["晴朗"])

    # ------------------------------------------------------------------ #
    #  存档
    # ------------------------------------------------------------------ #
    def to_dict(self) -> dict:
        return {
            "places": {k: v.to_dict() for k, v in self.places.items()},
            "routes": [r.to_dict() for r in self.routes],
            "current": self.current,
            "weather": self.weather,
        }

    def load(self, data: dict) -> None:
        data = data or {}
        self.places = {k: Place.from_dict(v) for k, v in (data.get("places") or {}).items()}
        self.routes = [Route.from_dict(r) for r in (data.get("routes") or [])]
        self.current = data.get("current", "")
        self.weather = data.get("weather", "晴朗")
        self._weather_day = -1


__all__ = ["WorldService"]
