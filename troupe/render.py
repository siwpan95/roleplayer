"""troupe.render - 文本渲染（L7）

把模拟器的内部状态渲染成人类可读的文本。所有函数都是**纯输出**：只读 ctx，不改世界，
因此 CLI / Web / 日志都能安全复用。布局用 ASCII 框线，终端与文件都友好。

命名约定：``render_*`` 返回字符串；``Simulator.render()`` 组合成整份战役档案。
"""
from __future__ import annotations

from typing import Any, Optional

from .magic import GURPS_SPELLS


def _bar(cur: int, mx: int, width: int = 16) -> str:
    if mx <= 0:
        return "[" + "-" * width + "]"
    filled = max(0, min(width, round(cur / mx * width)))
    return "[" + "#" * filled + "-" * (width - filled) + "]"


def render_status(sim: Any) -> str:
    st = sim.ctx.state
    cal = sim.ctx.calendar
    lines = [
        "══════════════════════════════════════════════════════",
        f"  战役档案 · 规则集 {st.ruleset} · 模组 {st.module_id}",
        "══════════════════════════════════════════════════════════════════",
        f"  时间      ：{cal.now}（已历 {cal.days_elapsed} 日）",
        f"  混沌因子  ：{'█' * st.chaos}{'·' * (9 - st.chaos)}  {st.chaos}/9",
        f"  累计经验  ：{st.total_xp} XP      金币：{st.gold}",
        f"  场景数    ：{st.scene_counter}       状态：{'已结束' if st.finished else '进行中'}",
        "══════════════════════════════════════════════════════════════════",
    ]
    return "\n".join(lines)


def render_world(sim: Any) -> str:
    world = sim.ctx.world
    here = world.here()
    lines = ["【世界地图】", f"  当前位置：{here.name if here else '—'}（{here.kind if here else ''}）",
             f"  天气：{world.weather}"]
    lines.append("  地点：")
    for p in world.places.values():
        mark = "★" if p.id == world.current else (" " if p.discovered else "?")
        lines.append(f"    {mark} {p.name}（{p.kind}，危险{p.danger}）"
                     f"{' 已访问'+str(p.visited)+'次' if p.visited else ''}")
    lines.append("  通路：")
    for r in world.routes:
        a = world.places.get(r.a, {})
        b = world.places.get(r.b, {})
        an = getattr(a, "name", r.a)
        bn = getattr(b, "name", r.b)
        lines.append(f"    {an} ⇄ {bn}  {r.distance_km}km（{r.terrain}）")
    return "\n".join(lines)


def render_party(sim: Any) -> str:
    lines = ["【队伍面板】"]
    if not sim.party:
        lines.append("  （尚无队员）")
        return "\n".join(lines)
    for i, char in enumerate(sim.party, 1):
        view = sim.ctx.ruleset.actor_view(char)
        defense_label = "AC" if sim.ctx.ruleset.id == "dnd5e" else "闪避"
        defense = view.get("ac", view.get("defense", "?"))
        cur, mx = view.get("hp", 0), view.get("max_hp", 0)
        cls = view.get("cls") or "冒险者"
        lvl = view.get("level", 1)
        lines.append(f"  {i}. {cls} Lv{lvl}  HP {cur}/{mx} {_bar(cur, mx)}  {defense_label} {defense}")
    return "\n".join(lines)


def render_quests(sim: Any) -> str:
    lines = ["【任务进度】"]
    quests = sim.ctx.quest.active()
    if not quests:
        lines.append("  （暂无进行中的任务）")
        return "\n".join(lines)
    for q in quests:
        prog = int(q.progress() * 100)
        lines.append(f"  ◆ {q.title}  [{prog}%]  XP{q.reward_xp}/金{q.reward_gold}")
        for o in q.objectives:
            done = "✓" if o.done else "✗"
            lines.append(f"      [{done}] {o.text}")
    return "\n".join(lines)


def render_factions(sim: Any) -> str:
    lines = ["【派系声望】"]
    facs = sim.ctx.faction.all()
    if not facs:
        lines.append("  （暂无派系）")
        return "\n".join(lines)
    for f in facs:
        lines.append(f"  ◇ {f.name}  声望 {f.standing:+d}（{sim.ctx.faction.standing_word(f.standing)}）"
                     f"  势力 {f.power}")
    return "\n".join(lines)


def render_clocks(sim: Any) -> str:
    lines = ["【进度时钟】"]
    clocks = sim.ctx.clock.all()
    if not clocks:
        lines.append("  （暂无时钟）")
        return "\n".join(lines)
    for c in clocks:
        lines.append(f"  ⏳ {c.name}  {c.filled}/{c.segments}  [{c.kind}]"
                     f"{'  ⚠ 已满' if c.full else ''}")
    return "\n".join(lines)


def render_threads(sim: Any) -> str:
    opens = sim.ctx.oracle.open_threads()
    if not opens:
        return "【剧情线索】\n  （无线索）"
    lines = ["【剧情线索】"]
    for t in opens:
        lines.append(f"  → {t.text}")
    return "\n".join(lines)


def render_magic(sim: Any) -> str:
    lines = ["【神秘学 / 法术】"]
    if not sim.party:
        lines.append("  （尚无队员）")
        return "\n".join(lines)
    magic = sim.ctx.magic if sim.ctx.has("magic") else None
    mana = getattr(magic, "mana", "普通") if magic else "普通"
    rid = sim.ctx.ruleset.id
    if rid == "gurps":
        lines.append(f"  法力位阶：{mana}")
    for i, char in enumerate(sim.party, 1):
        if rid == "gurps":
            known = [n for n in char.state.skills if n in GURPS_SPELLS]
            label = f"魔力{magic.magery_of(char) if magic else 0} · FP{magic.fp_of(char)[0] if magic else '?'}/{magic.fp_of(char)[1] if magic else ''}"
        else:
            known = list((getattr(char.state, "flags", {}) or {}).get("dnd_known", []))
            label = f"施法属性 {getattr(char.state,'flags',{}).get('dnd_spell_ability','智力')}"
        if not known:
            lines.append(f"  {i}. {getattr(char.state,'cls','冒险者')}（{label}）：未习法术")
        else:
            lines.append(f"  {i}. {getattr(char.state,'cls','冒险者')}（{label}）：{len(known)} 个 → {', '.join(known[:8])}{'…' if len(known) > 8 else ''}")
    return "\n".join(lines)


def render_provisions(sim: Any) -> str:
    lines = ["【补给 / 粮草】"]
    prov = sim.ctx.state.provisions
    lines.append(f"  口粮 {prov.get('rations',0)} 份 · 饮水 {prov.get('water',0)} 份"
                 f" · 钱币 {prov.get('coin_lbs',0)} lb · 负重 {prov.get('pack_lbs',0)} lb")
    if sim.party and sim.ctx.has("provisions"):
        enc = sim.ctx.provisions.encumbrance_of(sim.party[0])
        lines.append(f"  首队员负重：{enc['total_lbs']} lb → 等级 {enc['level']}"
                     f"（闪避惩罚 -{enc['penalty']}）")
    return "\n".join(lines)


def render_log(sim: Any, n: int = 20) -> str:
    lines = [f"【事件日志（最近 {n} 条）】"]
    for e in sim.ctx.log.tail(n):
        prefix = f"[{e.ts}] " if e.ts else ""
        lines.append(f"  {prefix}{e.text}")
    return "\n".join(lines)


def render_scene(scene: Any) -> str:
    """渲染单场戏（``SceneState`` 或 dict）。"""
    if isinstance(scene, dict):
        sid = scene.get("id", "?")
        spec = scene.get("spec", {}) or {}
        kind = spec.get("kind", "")
        title = spec.get("title", "")
        check = scene.get("check", "")
        outcome = scene.get("outcome", "")
        beats = scene.get("beats", []) or []
    else:
        sid = scene.id
        spec = getattr(scene, "spec", None)
        kind = spec.kind if spec else ""
        title = spec.title if spec else ""
        check = scene.check
        outcome = scene.outcome
        beats = scene.beats or []
    kind_cn = {"exploration": "探索", "social": "交涉", "travel": "旅行",
               "combat": "战斗", "downtime": "休整", "epilogue": "收尾"}.get(kind, kind)
    lines = [f"── {sid} · {title}（{kind_cn}）· 场景检查：{check} · 结局：{outcome}"]
    for b in beats:
        lines.append(f"    · {b}")
    return "\n".join(lines)


def render_dungeon(sim: Any) -> str:
    """地牢空间地图（若 ``state.dungeon`` 存有地图）。"""
    data = getattr(sim.ctx.state, "dungeon", None) or {}
    if not data.get("grid"):
        return "地牢地图（尚未探索）"
    from .spatial import DungeonMap

    dm = DungeonMap.from_dict(data)
    return f"地牢地图（种子 {dm.seed}，房间 {len(dm.rooms)} 个，连通={dm.is_connected()}）\n" + dm.render()


def render_campaign(sim: Any, log_n: int = 15) -> str:
    """整份战役档案（CLI 主视图）。"""
    blocks = [
        render_status(sim),
        render_world(sim),
        render_dungeon(sim),
        render_party(sim),
        render_quests(sim),
        render_factions(sim),
        render_clocks(sim),
        render_threads(sim),
        render_magic(sim),
        render_provisions(sim),
        render_log(sim, log_n),
    ]
    return "\n\n".join(blocks)


__all__ = [
    "render_campaign", "render_status", "render_world", "render_dungeon",
    "render_party",
    "render_quests", "render_factions", "render_clocks", "render_threads",
    "render_magic", "render_provisions", "render_log", "render_scene",
]
