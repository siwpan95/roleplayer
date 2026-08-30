"""troupe.spatial - 地牢空间地图（程序化网格生成 + 渲染）

此前世界是**地点图**（Place/Route 节点），没有「一间间房间」的空间层。
本模块补上地牢网格：种子驱动的房间 + L 形走廊 + 入口/出口/宝藏，
保证全连通，可渲染成 ASCII（终端）或 HTML（战报/Web）。

与既有世界模型的关系
--------------------
* 大世界仍是 Place 节点图；本模块是**单个地牢内部**的空间层
  （队伍深入某地牢时的站位图），两者互补、不互相替代。
* 生成用独立 ``random.Random(seed)``，不消耗模拟器分域 RNG，
  存档快照与重演确定性不受影响（与 modules.generator 同一条纪律）。

许可边界：程序化地牢生成算法为自研（受经典 roguelike 房间-走廊法启发），
不搬运任何规则书逐格数据。
"""
from __future__ import annotations

import random
from typing import Optional

#: 网格符号
_WALL, _FLOOR, _ENTRY, _EXIT, _TREASURE = "#", ".", "S", "X", "T"
_PASSABLE = (_FLOOR, _ENTRY, _EXIT, _TREASURE)


class DungeonMap:
    """一张地牢网格：``grid[y][x]`` 取字符，另有房间清单与种子。"""

    def __init__(self, grid: list[list[str]], rooms: list, seed: int = 0) -> None:
        self.grid = grid
        self.rooms = rooms            # [(x, y, w, h), ...]
        self.seed = int(seed)

    # ------------------------------------------------------------------ #
    #  查询
    # ------------------------------------------------------------------ #
    @property
    def height(self) -> int:
        return len(self.grid)

    @property
    def width(self) -> int:
        return len(self.grid[0]) if self.grid else 0

    def entry(self) -> Optional[tuple[int, int]]:
        return self._find(_ENTRY)

    def exit(self) -> Optional[tuple[int, int]]:
        return self._find(_EXIT)

    def _find(self, ch: str) -> Optional[tuple[int, int]]:
        for y, row in enumerate(self.grid):
            for x, c in enumerate(row):
                if c == ch:
                    return (x, y)
        return None

    def is_connected(self) -> bool:
        """入口能否走通出口（4 邻域 BFS，只在可行走格上扩散）。"""
        start = self.entry()
        goal = self.exit()
        if start is None or goal is None:
            return False
        seen = {start}
        stack = [start]
        while stack:
            x, y = stack.pop()
            if (x, y) == goal:
                return True
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if (0 <= ny < self.height and 0 <= nx < self.width
                        and self.grid[ny][nx] in _PASSABLE
                        and (nx, ny) not in seen):
                    seen.add((nx, ny))
                    stack.append((nx, ny))
        return False

    def count(self, ch: str) -> int:
        return sum(row.count(ch) for row in self.grid)

    # ------------------------------------------------------------------ #
    #  渲染
    # ------------------------------------------------------------------ #
    def render(self) -> str:
        """ASCII 地图（终端 / 纯文本战报）。"""
        return "\n".join("".join(row) for row in self.grid)

    def render_html(self) -> str:
        """自包含 HTML 片段（``<pre>`` 等宽网格，含图例）。"""
        import html as _html

        text = _html.escape(self.render())
        legend = ("#=墙 .=地板 S=入口 X=出口 T=宝藏")
        return (f"<pre class='dungeon-map'>{text}</pre>"
                f"<p class='muted'>{legend} · 房间 {len(self.rooms)} 个 · "
                f"种子 {self.seed}</p>")

    # ------------------------------------------------------------------ #
    #  存档
    # ------------------------------------------------------------------ #
    def to_dict(self) -> dict:
        return {"seed": self.seed,
                "grid": ["".join(r) for r in self.grid],
                "rooms": [list(r) for r in self.rooms]}

    @classmethod
    def from_dict(cls, data: dict) -> "DungeonMap":
        return cls(grid=[list(r) for r in (data.get("grid") or [])],
                   rooms=[tuple(r) for r in (data.get("rooms") or [])],
                   seed=int(data.get("seed", 0) or 0))


# --------------------------------------------------------------------------- #
#  生成
# --------------------------------------------------------------------------- #
def generate_dungeon(seed: int = 0, width: int = 44, height: int = 18,
                     n_rooms: int = 6) -> DungeonMap:
    """按种子生成一张地牢（房间-走廊法，保证入口↔出口连通）。

    :param width/height: 网格尺寸（≥16 / ≥10）
    :param n_rooms: 房间数（≥2）
    """
    w = max(16, int(width))
    h = max(10, int(height))
    n_rooms = max(2, min(int(n_rooms), 12))
    rnd = random.Random(int(seed))

    grid = [[_WALL for _ in range(w)] for _ in range(h)]
    rooms: list[tuple[int, int, int, int]] = []
    for _ in range(n_rooms):
        placed = False
        for _attempt in range(60):
            rw = rnd.randint(4, 9)
            rh = rnd.randint(3, 5)
            x = rnd.randint(1, w - rw - 2)
            y = rnd.randint(1, h - rh - 2)
            if not _overlaps(rooms, x, y, rw, rh):
                rooms.append((x, y, rw, rh))
                placed = True
                break
        if not placed:
            break

    for (x, y, rw, rh) in rooms:
        for iy in range(y, y + rh):
            for ix in range(x, x + rw):
                grid[iy][ix] = _FLOOR

    # 依序连接相邻房间（L 形走廊），保证连通
    for k in range(len(rooms) - 1):
        _corridor(grid, _center(rooms[k]), _center(rooms[k + 1]), rnd)

    sx, sy = _center(rooms[0])
    ex, ey = _center(rooms[-1])
    grid[sy][sx] = _ENTRY
    grid[ey][ex] = _EXIT
    # 宝藏：除首尾外挑 1–2 个房间中心放 T
    for room in rooms[1:-1]:
        if rnd.random() < 0.4:
            tx, ty = _center(room)
            if grid[ty][tx] == _FLOOR:
                grid[ty][tx] = _TREASURE

    return DungeonMap(grid=grid, rooms=rooms, seed=seed)


def _center(room: tuple[int, int, int, int]) -> tuple[int, int]:
    x, y, w, h = room
    return (x + w // 2, y + h // 2)


def _overlaps(rooms: list, x: int, y: int, w: int, h: int) -> bool:
    """房间是否与已有房间（含 1 格间距）重叠。"""
    for (rx, ry, rw, rh) in rooms:
        if x < rx + rw + 1 and rx < x + w + 1 and y < ry + rh + 1 and ry < y + h + 1:
            return True
    return False


def _corridor(grid: list[list[str]], a: tuple[int, int], b: tuple[int, int],
              rnd: random.Random) -> None:
    """在 a、b 之间挖一条 L 形走廊（先横后竖或先竖后横，随机）。"""
    ax, ay = a
    bx, by = b
    if rnd.random() < 0.5:
        for x in range(min(ax, bx), max(ax, bx) + 1):
            grid[ay][x] = _FLOOR
        for y in range(min(ay, by), max(ay, by) + 1):
            grid[y][bx] = _FLOOR
    else:
        for y in range(min(ay, by), max(ay, by) + 1):
            grid[y][ax] = _FLOOR
        for x in range(min(ax, bx), max(ax, bx) + 1):
            grid[by][x] = _FLOOR


__all__ = ["DungeonMap", "generate_dungeon"]
