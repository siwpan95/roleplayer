"""troupe.export - 战役档案富文本导出（L7 呈现层的对外出口）

``render.py`` 输出的是**终端可读**的纯文本；本模块输出**可归档 / 可分享**的富文本：

* ``export_markdown``：Markdown 战役档案（GitHub / 记事本直读，便于 diff）
* ``export_html``：自包含 HTML 战报（单文件、零外部依赖、双击即开）
* ``export_json``：结构化档案（``web`` 端战役面板消费，或供二次加工）

三者共用 :func:`build_archive` 产出的同一份中间结构 —— 只有一份取数逻辑，
三个渲染器各管各的排版，不会出现「Markdown 里有的字段 HTML 里没有」。

许可边界：只导出本战役自己产生的数据（角色卡 / 事件流 / 世界状态），
不复制任何 SRD 或规则书文本。
"""
from __future__ import annotations

import html
import json
from typing import Any, Optional


def _g(obj: Any, key: str, default: Any = None) -> Any:
    """对象/字典双模式取属性（契约层的 dict/dataclass 兼容惯例）。"""
    if obj is None:
        return default
    if hasattr(obj, key):
        return getattr(obj, key)
    if isinstance(obj, dict):
        return obj.get(key, default)
    return default


def build_archive(sim: Any) -> dict:
    """把一场战役抽成一份**与呈现无关**的中间档案。"""
    ctx = sim.ctx
    state = ctx.state
    party = []
    for c in (getattr(sim, "party", None) or []):
        try:
            cur, mx = ctx.ruleset.hp_of(c)
        except Exception:
            cur = mx = 0
        st = getattr(c, "state", None)
        party.append({
            "name": ctx.ruleset.describe(c) if ctx.has("ruleset") else str(c),
            "cls": _g(st, "cls", "") or "",
            "level": int(_g(st, "level", 1) or 1),
            "hp": int(cur), "max_hp": int(mx),
            "alive": bool(ctx.ruleset.alive(c)) if ctx.has("ruleset") else True,
        })

    places = []
    if ctx.has("world"):
        for p in _iter_places(ctx.world):
            places.append({
                "id": _g(p, "id", ""), "name": _g(p, "name", ""),
                "kind": _g(p, "kind", ""), "danger": int(_g(p, "danger", 1) or 1),
                "discovered": bool(_g(p, "discovered", False)),
            })

    quests = []
    if ctx.has("quest"):
        for q in ctx.quest.all():
            quests.append({
                "id": q.id, "title": q.title, "status": q.status,
                "progress": round(float(q.progress()), 2),
                "depends_on": list(getattr(q, "depends_on", []) or []),
                "deadline_minutes": int(getattr(q, "deadline_minutes", 0) or 0),
                "fail_condition": str(getattr(q, "fail_condition", "") or ""),
            })

    clocks = []
    if ctx.has("clock"):
        for c in ctx.clock.all():
            clocks.append({"id": c.id, "name": c.name, "filled": c.filled,
                           "segments": c.segments, "kind": c.kind,
                           "consumed": bool(getattr(c, "consumed", False))})

    factions = []
    if ctx.has("faction"):
        for f in ctx.faction.all():
            factions.append({"id": f.id, "name": f.name,
                             "standing": int(getattr(f, "standing", 0) or 0),
                             "power": int(getattr(f, "power", 0) or 0)})

    timeline = []
    for e in ctx.log.all():
        timeline.append({"seq": e.seq, "ts": str(getattr(e, "ts", "") or ""),
                         "type": e.type, "text": e.text,
                         "tags": list(getattr(e, "tags", []) or [])})

    by_type: dict[str, int] = {}
    for e in timeline:
        by_type[e["type"]] = by_type.get(e["type"], 0) + 1

    return {
        "meta": {
            "name": str(_g(state, "name", "") or "冒险"),
            "seed": _g(state, "seed", 0),
            "ruleset": str(_g(state, "ruleset", "") or ""),
            "module_id": str(_g(state, "module_id", "") or ""),
            "total_xp": int(_g(state, "total_xp", 0) or 0),
            "gold": int(_g(state, "gold", 0) or 0),
        },
        "party": party,
        "world": {
            "current": _g(ctx.world.here() if ctx.has("world") else None, "name", "") or "",
            "places": places,
        },
        "quests": quests, "clocks": clocks, "factions": factions,
        "timeline": timeline,
        "stats": {"events": len(timeline), "by_type": dict(
            sorted(by_type.items(), key=lambda kv: -kv[1]))},
    }


def _iter_places(world: Any) -> list:
    """尽量枚举世界里的地点（不同版本接口不同，逐个安全降级）。"""
    for attr in ("places", "_places"):
        coll = getattr(world, attr, None)
        if isinstance(coll, dict):
            return list(coll.values())
        if isinstance(coll, (list, tuple)):
            return list(coll)
    return []


# --------------------------------------------------------------------------- #
#  Markdown
# --------------------------------------------------------------------------- #
def export_markdown(sim: Any, path: Optional[str] = None) -> str:
    a = build_archive(sim)
    m = a["meta"]
    L: list[str] = []
    L.append(f"# {m['name']}")
    L.append("")
    L.append(f"- 规则集：**{m['ruleset']}**　种子：`{m['seed']}`　模组：`{m['module_id'] or '即兴'}`")
    L.append(f"- 累计经验：**{m['total_xp']}**　金币：**{m['gold']}**")
    L.append(f"- 事件总数：**{a['stats']['events']}**")
    L.append("")

    if a["party"]:
        L.append("## 队伍")
        L.append("")
        L.append("| 成员 | 职业 | 等级 | 生命 | 状态 |")
        L.append("| --- | --- | --- | --- | --- |")
        for p in a["party"]:
            L.append(f"| {p['name']} | {p['cls'] or '—'} | {p['level']} | "
                     f"{p['hp']}/{p['max_hp']} | {'存活' if p['alive'] else '倒下'} |")
        L.append("")

    if a["quests"]:
        L.append("## 任务")
        L.append("")
        for q in a["quests"]:
            deps = f"（前置：{', '.join(q['depends_on'])}）" if q["depends_on"] else ""
            dl = f"，期限 {q['deadline_minutes']} 分钟" if q["deadline_minutes"] else ""
            L.append(f"- **{q['title']}** — {q['status']}"
                     f"（{int(q['progress'] * 100)}%）{deps}{dl}")
        L.append("")

    if a["clocks"]:
        L.append("## 时钟")
        L.append("")
        for c in a["clocks"]:
            L.append(f"- {c['name']}：`{c['filled']}/{c['segments']}`"
                     f"（{c['kind']}）{'✔ 已兑现' if c['consumed'] else ''}")
        L.append("")

    if a["world"]["places"]:
        L.append("## 世界")
        L.append("")
        L.append(f"当前位置：**{a['world']['current'] or '—'}**")
        L.append("")
        for p in a["world"]["places"]:
            mark = "✔" if p["discovered"] else "·"
            L.append(f"- [{mark}] {p['name']}（{p['kind']}，危险 {p['danger']}）")
        L.append("")

    L.append("## 事件时间轴")
    L.append("")
    for e in a["timeline"]:
        if not e["text"]:
            continue
        L.append(f"- `#{e['seq']}` [{e['ts']}] **{e['type']}** — {e['text']}")
    L.append("")

    text = "\n".join(L)
    if path:
        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(text)
    return text


# --------------------------------------------------------------------------- #
#  HTML
# --------------------------------------------------------------------------- #
_CSS = """
:root{color-scheme:light dark}
body{font-family:-apple-system,"Segoe UI","Microsoft YaHei",sans-serif;
     max-width:920px;margin:2rem auto;padding:0 1.2rem;line-height:1.65}
h1{border-bottom:2px solid #8884;padding-bottom:.3rem}
h2{margin-top:2rem;border-left:4px solid #8884;padding-left:.6rem}
table{border-collapse:collapse;width:100%}
th,td{border:1px solid #8884;padding:.4rem .6rem;text-align:left}
code{background:#8882;padding:.1rem .35rem;border-radius:3px}
.timeline{list-style:none;padding:0}
.timeline li{border-left:3px solid #8884;margin:.35rem 0;padding:.25rem .7rem}
.timeline .seq{color:#888;font-size:.85em}
.muted{color:#888;font-size:.9em}
.badge{display:inline-block;background:#8882;border-radius:3px;
       padding:0 .4rem;font-size:.85em;margin-left:.3rem}
"""

_STATUS_CN = {"active": "进行中", "done": "已完成", "failed": "失败", "locked": "未解锁"}


def export_html(sim: Any, path: Optional[str] = None) -> str:
    a = build_archive(sim)
    m = a["meta"]
    e = html.escape
    P: list[str] = []
    P.append("<!DOCTYPE html><html lang='zh-CN'><head><meta charset='utf-8'>")
    P.append(f"<title>{e(str(m['name']))} — 战役档案</title>")
    P.append(f"<style>{_CSS}</style></head><body>")
    P.append(f"<h1>{e(str(m['name']))}</h1>")
    P.append(f"<p class='muted'>规则集 <b>{e(str(m['ruleset']))}</b> · "
             f"种子 <code>{e(str(m['seed']))}</code> · "
             f"模组 <code>{e(str(m['module_id'] or '即兴'))}</code></p>")
    P.append(f"<p>累计经验 <b>{m['total_xp']}</b> · 金币 <b>{m['gold']}</b> · "
             f"事件 <b>{a['stats']['events']}</b></p>")

    if a["party"]:
        P.append("<h2>队伍</h2><table><tr><th>成员</th><th>职业</th>"
                 "<th>等级</th><th>生命</th><th>状态</th></tr>")
        for p in a["party"]:
            P.append(f"<tr><td>{e(p['name'])}</td><td>{e(p['cls'] or '—')}</td>"
                     f"<td>{p['level']}</td><td>{p['hp']}/{p['max_hp']}</td>"
                     f"<td>{'存活' if p['alive'] else '倒下'}</td></tr>")
        P.append("</table>")

    if a["quests"]:
        P.append("<h2>任务</h2><ul>")
        for q in a["quests"]:
            deps = (f"<span class='badge'>前置 {'、'.join(e(d) for d in q['depends_on'])}</span>"
                    if q["depends_on"] else "")
            dl = (f"<span class='badge'>期限 {q['deadline_minutes']} 分钟</span>"
                  if q["deadline_minutes"] else "")
            P.append(f"<li><b>{e(q['title'])}</b> — "
                     f"{e(_STATUS_CN.get(q['status'], q['status']))}"
                     f"<span class='badge'>{int(q['progress'] * 100)}%</span>{deps}{dl}</li>")
        P.append("</ul>")

    if a["clocks"]:
        P.append("<h2>时钟</h2><ul>")
        for c in a["clocks"]:
            P.append(f"<li>{e(c['name'])}：<code>{c['filled']}/{c['segments']}</code>"
                     f"<span class='badge'>{e(c['kind'])}</span>"
                     f"{'<span class=badge>已兑现</span>' if c['consumed'] else ''}</li>")
        P.append("</ul>")

    if a["world"]["places"]:
        P.append(f"<h2>世界</h2><p>当前位置：<b>{e(str(a['world']['current'] or '—'))}</b></p><ul>")
        for p in a["world"]["places"]:
            mark = "✔" if p["discovered"] else "·"
            P.append(f"<li>[{mark}] {e(p['name'])}"
                     f"<span class='badge'>{e(p['kind'])}</span>"
                     f"<span class='badge'>危险 {p['danger']}</span></li>")
        P.append("</ul>")

    P.append("<h2>事件时间轴</h2><ul class='timeline'>")
    for ev in a["timeline"]:
        if not ev["text"]:
            continue
        P.append(f"<li><span class='seq'>#{ev['seq']} [{e(ev['ts'])}] "
                 f"{e(ev['type'])}</span><br>{e(ev['text'])}</li>")
    P.append("</ul>")
    P.append("</body></html>")

    text = "\n".join(P)
    if path:
        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(text)
    return text


# --------------------------------------------------------------------------- #
#  JSON（Web 端消费）
# --------------------------------------------------------------------------- #
def export_json(sim: Any, path: Optional[str] = None, indent: int = 2) -> str:
    a = build_archive(sim)
    text = json.dumps(a, ensure_ascii=False, indent=indent)
    if path:
        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(text)
    return text


__all__ = ["build_archive", "export_markdown", "export_html", "export_json"]
