"""d20.condition - 战斗条件服务（Cordis 插件）

D&D 5e 官方 15 条战斗条件的**规则数据库 + 角色当前条件追踪器**。挂到 ctx.condition。
条件对攻击/豁免/检定的影响以「劣势≈-2」的平坦惩罚代理表达（见 data_conditions），
供 combat/sheet 统一扣减，避免改动 d20_roll 的随机语义。

卸载本服务（web 端热卸载）即移除所有条件追踪能力——符合 Cordis 可逆副作用范式。
"""
from .core import Service
from .data_conditions import CONDITIONS, DISADVANTAGE_PENALTY


class ConditionService(Service):
    """战斗条件规则与追踪。"""

    inject = []

    CONDITIONS = CONDITIONS
    DISADVANTAGE_PENALTY = DISADVANTAGE_PENALTY

    # ---------- 规则查询 ----------
    def all_names(self) -> list[str]:
        return list(self.CONDITIONS.keys())

    def describe(self, name: str) -> str:
        info = self.CONDITIONS.get(name)
        if not info:
            return f"未知条件: {name}"
        ap = info.get("attack", 0)
        sp = info.get("save", 0)
        cp = info.get("check", 0)
        pen = []
        if ap: pen.append(f"攻击{ap:+d}")
        if sp: pen.append(f"豁免{sp:+d}")
        if cp: pen.append(f"检定{cp:+d}")
        pen_txt = "（" + "，".join(pen) + "）" if pen else ""
        return f"{name}（{info['en']}）{pen_txt}：{info['special']}"

    def auto_fail(self, kind: str) -> bool:
        """当前活跃条件中是否有对该维度的自动失败（kind ∈ str_save/dex_save/vis/aud）。"""
        return any(kind in self.CONDITIONS.get(c, {}).get("auto_fail", [])
                   for c in self.ctx.state.conditions)

    # ---------- 追踪 ----------
    def add(self, name: str) -> tuple[bool, str]:
        if name not in self.CONDITIONS:
            return False, f"未知条件: {name}"
        if name in self.ctx.state.conditions:
            return False, f"已处于 {name} 状态"
        self.ctx.state.conditions.append(name)
        self.ctx.emit("character/changed", "conditions")
        return True, f"施加条件：{name}"

    def remove(self, name: str) -> tuple[bool, str]:
        if name not in self.ctx.state.conditions:
            return False, f"未处于 {name} 状态"
        self.ctx.state.conditions.remove(name)
        self.ctx.emit("character/changed", "conditions")
        return True, f"解除条件：{name}"

    def clear(self) -> None:
        self.ctx.state.conditions = []
        self.ctx.emit("character/changed", "conditions")

    def active(self) -> list[str]:
        return list(self.ctx.state.conditions)

    def has(self, name: str) -> bool:
        return name in self.ctx.state.conditions

    # ---------- 聚合惩罚（供 combat/sheet 扣减）----------
    def penalty(self, kind: str) -> int:
        """kind ∈ 'attack' | 'save' | 'check'，返回当前活跃条件的惩罚之和。"""
        return sum(self.CONDITIONS.get(c, {}).get(kind, 0)
                   for c in self.ctx.state.conditions)

    def summary(self) -> str:
        if not self.ctx.state.conditions:
            return "无"
        return "; ".join(self.ctx.state.conditions)
