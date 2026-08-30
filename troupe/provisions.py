"""troupe.provisions - 补给 / 粮草 / 旅行结算（L2 世界层的可消耗资源）

「完整跑团模拟器」不能只有战斗与法术，还要有**维持队伍活下去的日常系统**：
口粮、饮水、负重、行军。规则锚点：

* **口粮/饮水**：D&D 侧每人每天 1 份口粮；断粮进入「力竭(exhaustion)」阶梯（SRD 5.1：
  每 24 小时未进食 +1 级力竭，第 5 级即死亡）；GURPS 侧断粮按 HT/FP 损失结算
  （Basic Set：饥饿每天 -1 FP，严重则需 HT 检定）。
* **负重**：GURPS 负重等级由携带重量（含钱币）经 ``data_world.gurps_encumbrance_level``
  推算，影响闪避（见 ``data_world.encumbrance_penalty``）；D&D 侧钱币/装备重量仅作记录。
* **旅行**：每日里程 = 基础速度 × 节奏系数 × 地形系数（``data_world.TRAVEL_PACE`` /
  ``TERRAIN``）；行进消耗口粮/饮水、累积疲劳，并按地形危险度掷遭遇。

状态统一存于 ``SessionState.provisions``（随存档序列化），本服务只读写它。
"""
from __future__ import annotations

from typing import Any

from d20.core import Service

from . import data_world as W
from .contracts import CheckRequest


class ProvisionService(Service):
    """补给与旅行结算。挂到 ``ctx.provisions``。"""

    # director：饥饿/疲劳后果要作用于队伍成员；world 为历史冗余（数据走 data_world 模块）
    inject = ["rng", "ruleset", "log", "calendar", "director"]
    name = "provisions"

    # ------------------------------------------------------------------ #
    #  读取 / 写入补给状态
    # ------------------------------------------------------------------ #
    @property
    def _p(self) -> dict:
        st = self.ctx.state
        if "provisions" not in st.__dict__:
            st.provisions = {"rations": 5, "water": 5, "coin_lbs": 0.0, "pack_lbs": 0.0}
        return st.provisions

    def snapshot(self) -> dict:
        return dict(self._p)

    def add_ration(self, n: int = 1) -> int:
        self._p["rations"] = max(0, self._p["rations"] + int(n))
        return self._p["rations"]

    def add_water(self, n: int = 1) -> int:
        self._p["water"] = max(0, self._p["water"] + int(n))
        return self._p["water"]

    def add_coin(self, gold: int, lbs_per_50: float = 2.0) -> float:
        """获得金币并折算重量（约 50 枚/2 lb，SRD 近似）。"""
        g = max(0, int(gold))
        self._p["coin_lbs"] = round(self._p["coin_lbs"] + g / 50.0 * lbs_per_50, 2)
        self.ctx.state.gold = max(0, int(self.ctx.state.gold) + g)
        return self._p["coin_lbs"]

    def set_pack_weight(self, lbs: float) -> None:
        self._p["pack_lbs"] = max(0.0, float(lbs))

    # ------------------------------------------------------------------ #
    #  每日消耗与饥饿
    # ------------------------------------------------------------------ #
    def consume_daily(self, party_size: int = 1) -> dict:
        """推进一天：消耗口粮/饮水；不足则施加饥饿后果（D&D 力竭 / GURPS HT·FP 损失）。"""
        p = self._p
        ration_need = max(1, int(party_size))
        ration_short = max(0, ration_need - p["rations"])
        water_short = max(0, ration_need - p["water"])
        p["rations"] = max(0, p["rations"] - ration_need)
        p["water"] = max(0, p["water"] - ration_need)

        result = {"rations_left": p["rations"], "water_left": p["water"],
                  "ration_short": ration_short, "water_short": water_short,
                  "starving": ration_short > 0 or water_short > 0, "effects": []}

        if ration_short > 0 or water_short > 0:
            if self.ctx.ruleset.id == "gurps":
                # GURPS：每日 -1 FP（饥饿），严重再掷 HT
                for _ in range(max(ration_short, water_short)):
                    self._gurps_starve()
                result["effects"].append("gurps_hunger")
            else:
                # D&D：未进食 +1 级力竭（力竭 5 级 = 死亡）
                self._dnd_exhaust(party_size)
                result["effects"].append("dnd_exhaustion")
            self.ctx.log.record("downtime",
                                text=f"补给告急：缺口粮 {ration_short} / 缺水 {water_short} 份，队伍陷入饥饿",
                                payload={"ration_short": ration_short,
                                         "water_short": water_short}, tags=["provisions"])
        return result

    def _dnd_exhaust(self, party_size: int) -> None:
        # 力竭等级记录在 SessionState.flags（模拟器层）；第 5 级死亡由战斗/休整逻辑执行
        flags = self.ctx.state.flags
        lvl = int(flags.get("exhaustion", 0)) + 1
        flags["exhaustion"] = lvl
        self.ctx.state.flags = flags
        for char in self.ctx.director.party():
            if lvl >= 5:
                self.ctx.ruleset.set_hp(char, 0)
            elif hasattr(char.state, "conditions"):
                if "力竭" not in char.state.conditions:
                    char.state.conditions.append("力竭")

    def _gurps_starve(self) -> None:
        for char in self.ctx.director.party():
            try:
                self.ctx.ruleset.adapter.damage(char, 1, "钝击")
            except Exception:
                pass

    # ------------------------------------------------------------------ #
    #  旅行
    # ------------------------------------------------------------------ #
    def travel(self, distance_km: float, pace: str = "常",
               terrain: str = "道路", party_size: int = 1) -> dict:
        """实时结算一次旅行：推进时间、消耗补给、累积疲劳、按地形掷遭遇。

        :return: ``{"days", "hours", "encounters", "rations_left", "fatigued", "text"}``
        """
        terr = W.TERRAIN.get(terrain, W.TERRAIN["道路"])
        pace_cfg = W.TRAVEL_PACE.get(pace, W.TRAVEL_PACE["常"])
        # 基础每日 32 km（道路常速），按地形/节奏系数折算有效里程
        base_per_day = 32.0
        per_day = max(2.0, base_per_day * terr["speed"] * pace_cfg["mult"])
        days = max(1, round(distance_km / per_day))
        hours = days * W.BASE_TRAVEL_HOURS

        # 时间推进
        self.ctx.calendar.advance(hours * 60)
        # 补给消耗（按天结算，断粮逐日累积后果）
        for _ in range(int(days)):
            self.consume_daily(party_size)
        # 疲劳：急行/超时
        fatigued = bool(pace_cfg.get("exhaustion")) or days > 3
        if fatigued and self.ctx.ruleset.id != "gurps":
            self._dnd_exhaust(party_size)

        # 遭遇：按地形每日次数掷（复用已登记的 "world" 随机域）
        encounters = 0
        for _ in range(int(days)):
            if self.ctx.rng.chance(min(0.9, terr["encounters_per_day"] * 0.4), "world"):
                encounters += 1

        text = (f"行军 {distance_km}km（{terrain}·{pace}）：约 {days} 天 / {hours} 小时，"
                f"消耗口粮 {party_size} 份，途中遭遇 {encounters} 次")
        self.ctx.log.record("travel", text=text,
                            payload={"distance_km": distance_km, "terrain": terrain,
                                     "pace": pace, "days": days, "encounters": encounters},
                            tags=["travel", "provisions"])
        return {"days": days, "hours": hours, "encounters": encounters,
                "rations_left": self._p["rations"], "fatigued": fatigued, "text": text}

    # ------------------------------------------------------------------ #
    #  GURPS 负重 → 闪避惩罚（供规则层 / 渲染消费）
    # ------------------------------------------------------------------ #
    def encumbrance_of(self, char: Any) -> dict:
        """由携带重量推算 GURPS 负重等级与闪避惩罚。"""
        st = int(getattr(char.state, "attributes", {}).get("力量", 10))
        total_lbs = self._p["coin_lbs"] + self._p["pack_lbs"]
        lvl = W.gurps_encumbrance_level(st, total_lbs)
        return {"total_lbs": round(total_lbs, 2), "level": lvl,
                "penalty": W.encumbrance_penalty(lvl)}

    def to_dict(self) -> dict:
        return {}

    def load(self, data: dict) -> None:
        return None


__all__ = ["ProvisionService"]
