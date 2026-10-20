"""roleplayer.monster - 怪物图鉴服务（Cordis 插件）

D&D 5e SRD 怪物（见 data_monsters.MONSTERS）：提供查询、角色卡式 stat block 渲染，
以及基于其攻击/伤害骰的掷骰结算（供 DM 快速跑怪）。挂到 ctx.monster。

依赖 dice 服务做随机掷骰；与角色自己的 CharacterState 解耦——怪物是「外部战斗单位」，
不污染玩家状态。卸载本服务即失去怪物查询/结算能力（符合 Cordis 可逆副作用范式）。
"""
import random
from .core import Service
from .data_monsters import MONSTERS, CR_XP


def parse_dice(expr: str):
    """解析 '2d6+3' / '1d8-1' / '' -> (count, die, bonus)。无法解析返回 (0,0,0)。"""
    if not expr:
        return (0, 0, 0)
    s = expr.strip().lower().replace(" ", "")
    sign = 1
    if s.startswith("+"):
        s = s[1:]
    elif s.startswith("-"):
        sign = -1
        s = s[1:]
    if "d" not in s:
        try:
            return (0, 0, sign * int(s))
        except ValueError:
            return (0, 0, 0)
    cnt_part, _, die_part = s.partition("d")
    try:
        cnt = int(cnt_part) if cnt_part else 1
        bonus = 0
        if "+" in die_part:
            die_s, _, b = die_part.partition("+")
            die = int(die_s); bonus = int(b)
        elif "-" in die_part:
            die_s, _, b = die_part.partition("-")
            die = int(die_s); bonus = -int(b)
        else:
            die = int(die_part)
    except ValueError:
        return (0, 0, 0)
    return (cnt, die, sign * bonus)


class MonsterService(Service):
    """怪物查询与结算。"""

    # dice 为历史冗余声明（怪物图鉴是纯数据 + 数据级结算，自身不调 ctx.dice）
    inject = []

    MONSTERS = MONSTERS
    CR_XP = CR_XP

    # ---------- 查询 ----------
    def names(self) -> list[str]:
        return list(self.MONSTERS.keys())

    def lookup(self, name: str) -> dict | None:
        return self.MONSTERS.get(name)

    def xp(self, cr: str) -> int:
        return self.CR_XP.get(cr, 0)

    def by_cr(self, cr: str) -> list[str]:
        return [n for n, m in self.MONSTERS.items() if m.get("cr") == cr]

    # ---------- 渲染 ----------
    def stat_block(self, name: str) -> str:
        m = self.lookup(name)
        if not m:
            return f"未知怪物: {name}"
        ab = {k: m[k] for k in ("str", "dex", "con", "int", "wis", "cha")}
        def mod(v): return f"{ (v-10)//2:+d}"
        lines = ["=" * 40, f"{name}  [{m['size']} {m['type']}, {m['alignment']}]", "=" * 40]
        lines.append(f"AC {m['ac']}" + (f" ({m['ac_note']})" if m.get('ac_note') else "")
                    + f" | HP {m['hp']} | 速度 {m['speed']}")
        lines.append("六维 " + " ".join(f"{k[:3].upper()}:{v}({mod(v)})" for k, v in ab.items()))
        if m.get("saves"):
            lines.append("豁免 " + ", ".join(f"{k[:3].upper()} {v:+d}" for k, v in m["saves"].items()))
        if m.get("skills"):
            lines.append("技能 " + ", ".join(f"{k} {v:+d}" for k, v in m["skills"].items()))
        for label, key in (("抗力", "resist"), ("免疫", "immune"), ("易伤", "vuln"),
                           ("状态免疫", "cond_immune")):
            if m.get(key):
                lines.append(f"{label} " + ", ".join(m[key]))
        lines.append(f"感官 {m['senses']} | 语言 {m['languages']} | CR {m['cr']}（{self.xp(m['cr'])} XP）")
        for tname, tdesc in m.get("traits", []):
            lines.append(f"• 特性·{tname}: {tdesc}")
        if m.get("actions"):
            lines.append("— 动作 —")
            for a in m["actions"]:
                dmg_txt = f", {a['dmg']} {a['type']}" if a.get("dmg") else ""
                extra = f" | {a['extra']}" if a.get("extra") else ""
                if a.get("atk"):
                    lines.append(f"  {a['name']}: 命中+{a['atk']} ({a.get('reach','近战')}){dmg_txt}{extra}")
                else:
                    lines.append(f"  {a['name']}: {extra}")
        for grp, label in (("bonus_actions", "附赠动作"), ("reactions", "反应"), ("legendary", "传奇动作")):
            if m.get(grp):
                lines.append(f"— {label} —")
                for a in m[grp]:
                    extra = f" {a.get('extra','')}" if a.get('extra') else ""
                    if a.get("atk"):
                        lines.append(f"  {a['name']}: 命中+{a['atk']}{extra}")
                    else:
                        lines.append(f"  {a['name']}:{extra}")
        return "\n".join(lines)

    # ---------- 结算（DM 用）----------
    def roll_attack(self, name: str, action_index: int = 0, target_ac: int = 10) -> str:
        m = self.lookup(name)
        if not m:
            return f"未知怪物: {name}"
        actions = m.get("actions", [])
        if not actions:
            return f"{name} 无可用动作"
        if action_index >= len(actions):
            return f"{name} 没有第 {action_index} 个动作（共 {len(actions)}）"
        a = actions[action_index]
        if not a.get("atk"):
            return f"{a['name']} 非攻击动作：{a.get('extra','')}"
        atk_bonus = a["atk"]
        roll = random.randint(1, 20)
        total = roll + atk_bonus
        hit = total >= target_ac
        cnt, die, bonus = parse_dice(a["dmg"]) if a.get("dmg") else (0, 0, 0)
        lines = [f"{name}·{a['name']}: d20+{atk_bonus} = {roll}+{atk_bonus} = {total} vs AC {target_ac}"]
        if hit:
            if cnt:
                rolls = [random.randint(1, die) for _ in range(cnt)]
                dmg = sum(rolls) + bonus
                lines.append(f"  命中！伤害: {cnt}d{die}{bonus:+d} = {rolls} = {dmg} {a.get('type','')}")
            else:
                lines.append("  命中！")
        else:
            lines.append("  未命中")
        return "\n".join(lines)

    def quick_encounter(self, cr: str, count: int = 1) -> str:
        """按 CR 抽取若干同类怪物名（无则全图鉴按 CR 排序前 count）。"""
        pool = self.by_cr(cr)
        if not pool:
            pool = sorted(self.names(), key=lambda n: self.MONSTERS[n]["cr"])[:count]
        return ", ".join(pool[:count]) + f"（CR {cr}, {self.xp(cr)} XP/个）"
