"""组合装配「声明 = 实现」不变量测试（防回归）。

背景（2026-08-30 用户发现 Web 插件面板的依赖列表不合理）：
- combat 用了 ``ctx.race.elemental()``（龙息宏）却未声明 → 卸载 race 后崩溃（真欠依赖）；
- rest/sheet/monster 声明了从不使用的冗余依赖（dice / feats·race / dice）；
- battle 声明 ``[dice, monster, condition]`` 但自身 ctx 三者全不用（装饰性错误声明）；
- web/public/composition.yml 与 composition.ts 漂移（sheet 缺 condition、缺三条 v2.1/v2.2 条目）；
- troupe 侧同样欠声明：director 用 world/quest、encounter 用 agent/oracle/provisions、
  provisions 用 director、world 用 calendar/log、quest/faction/lore 均未声明。

本测试把不变量锁死：
1. 服务 A 里每个 ``self.ctx.<svc>`` 引用（含经方法参数 ``ctx`` 传递的形态），
   要么在 A 的 inject 声明里，要么有 ``ctx.has("<svc>")`` 探测（可选增强模式），
   要么是服务自身的 id（经 ctx 自引用，无法也不应 inject 自己）。
2. inject 声明的每一项都必须被实际使用（不许装饰性 / 历史冗余声明）。
3. d20 的四处清单（根 composition.yml / loader.DEFAULT_SERVICE_ENTRIES /
   web composition.ts / web public composition.yml）的 (id, inject) 逐条一致。
"""
from __future__ import annotations

import ast
import re
from pathlib import Path

import pytest

from roleplayer.loader import DEFAULT_SERVICE_ENTRIES

ROOT = Path(__file__).resolve().parent.parent

#: troupe 服务 id → 源文件（service 路径名与文件名不一致的映射）
_TROUPE_FILES = {
    "rng": "rng.py", "calendar": "calendar.py", "log": "log.py",
    "tables": "random_tables.py", "lore": "lore.py", "oracle": "oracle.py",
    "ruleset": "ruleset_service.py", "world": "world.py", "magic": "magic.py",
    "provisions": "provisions.py", "npc": "npc.py", "faction": "faction.py",
    "quest": "quest.py", "clock": "clock.py", "director": "director.py",
    "agency": "npc_agency.py",
    "encounter": "encounter.py", "agent": "agent.py",
}


# --------------------------------------------------------------------------- #
#  静态分析：真实 ctx 依赖
# --------------------------------------------------------------------------- #
def _ctx_uses(src: str, known: set[str]) -> tuple[set[str], set[str]]:
    """返回 ``(self.ctx.<svc> 引用集, ctx.has("<svc>") 探测集)``。

    覆盖两种形态：``self.ctx.<svc>`` 直引用；方法形参名为 ``ctx`` 时方法体内的
    ``ctx.<svc>``（调用方传入的正是 self.ctx，如 agent 的 _propose_* 族）。
    """
    tree = ast.parse(src)
    uses: set[str] = set()
    probes: set[str] = set()

    def attr_chain(node: ast.Attribute):
        chain, cur = [], node
        while isinstance(cur, ast.Attribute):
            chain.append(cur.attr)
            cur = cur.value
        if isinstance(cur, ast.Name):
            chain.append(cur.id)
            return list(reversed(chain))
        return None

    for node in ast.walk(tree):
        if isinstance(node, ast.Attribute):
            chain = attr_chain(node)
            if (chain and len(chain) == 3 and chain[0] == "self"
                    and chain[1] == "ctx" and chain[2] in known):
                uses.add(chain[2])
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute):
            f = node.func
            if (isinstance(f.value, ast.Attribute) and f.value.attr == "ctx"
                    and f.attr == "has" and node.args
                    and isinstance(node.args[0], ast.Constant)
                    and isinstance(node.args[0].value, str)):
                probes.add(node.args[0].value)
    # 参数 ctx 形态：def _(self, ctx, ...) 体内 ctx.<svc>
    for node in ast.walk(tree):
        if (isinstance(node, ast.FunctionDef)
                and any(a.arg == "ctx" for a in node.args.args)):
            for sub in ast.walk(node):
                if isinstance(sub, ast.Attribute):
                    chain = attr_chain(sub)
                    if (chain and len(chain) == 2 and chain[0] == "ctx"
                            and chain[1] in known):
                        uses.add(chain[1])
    return uses, probes


def _check_decls(label: str, entries: list[dict], files: dict[str, str],
                 pkg: str) -> None:
    """核心不变量：每个服务的声明 ↔ 实现的交叉核对。"""
    for entry in entries:
        sid = entry["id"]
        decl = set(entry.get("inject") or [])
        fn = ROOT / pkg / files[sid]
        src = fn.read_text(encoding="utf-8", errors="replace")
        uses, probes = _ctx_uses(src, {e["id"] for e in entries})
        missing = uses - decl - probes - {sid}
        unused = decl - uses
        assert not missing, (
            f"[{label}] {sid} 用了但未声明（卸载后运行时崩溃）: {sorted(missing)}")
        assert not unused, (
            f"[{label}] {sid} 声明了但从未使用（冗余/装饰性声明）: {sorted(unused)}")


# --------------------------------------------------------------------------- #
#  清单解析（四处来源）
# --------------------------------------------------------------------------- #
def _parse_root_yml() -> list[tuple[str, list[str]]]:
    """解析根 composition.yml（行内列表 inject 形态）。"""
    out, cur = [], None
    for l in (ROOT / "roleplayer" / "composition.yml").read_text(encoding="utf-8").splitlines():
        m = re.match(r"\s*-?\s*id:\s*([a-z_]+)", l)
        if m:
            cur = m.group(1)
            continue
        m = re.match(r"\s*inject:\s*\[([^\]]*)\]", l)
        if m and cur:
            out.append((cur, [x.strip().strip("'").strip('"')
                              for x in m.group(1).split(",") if x.strip()]))
            cur = None
    return out


def _parse_ts_composition() -> list[tuple[str, list[str]]]:
    src = (ROOT / "web/src/engine/composition.ts").read_text(
        encoding="utf-8", errors="replace")
    out = []
    for m in re.finditer(r'\{\s*id:\s*"([a-z_]+)".*?inject:\s*\[([^\]]*)\]', src):
        sid = m.group(1)
        inject = [x.strip().strip('"').strip("'")
                  for x in m.group(2).split(",") if x.strip()]
        out.append((sid, inject))
    return out


def _parse_public_yml() -> list[tuple[str, list[str]]]:
    """解析 web/public/composition.yml（块风格列表 inject 形态）。"""
    out, cur, in_list = [], None, False
    for l in (ROOT / "web/public/composition.yml").read_text(
            encoding="utf-8").splitlines():
        m = re.match(r"-\s*id:\s*([a-z_]+)", l)
        if m:
            cur = m.group(1)
            out.append([cur, []])
            in_list = False
            continue
        m = re.match(r"\s*inject:\s*\[([^\]]*)\]", l)
        if m and cur:
            out[-1][1] = [x.strip().strip("'").strip('"')
                          for x in m.group(1).split(",") if x.strip()]
            in_list = False
            continue
        m = re.match(r"\s*inject:\s*$", l)
        if m and cur:
            in_list = True
            continue
        m = re.match(r"\s*-\s*([a-z_]+)\s*$", l)
        if m and in_list and cur:
            out[-1][1].append(m.group(1))
    return [(sid, inj) for sid, inj in out]


# --------------------------------------------------------------------------- #
#  测试
# --------------------------------------------------------------------------- #
def test_roleplayer_declarations_match_implementation():
    rp_files = {e["id"]: f'{e["id"]}.py' for e in DEFAULT_SERVICE_ENTRIES}
    _check_decls("roleplayer", DEFAULT_SERVICE_ENTRIES, rp_files, "roleplayer")


def test_troupe_declarations_match_implementation():
    from troupe.composition import DEFAULT_TROUPE_ENTRIES
    _check_decls("troupe", DEFAULT_TROUPE_ENTRIES, _TROUPE_FILES, "troupe")


def test_roleplayer_four_sources_agree():
    """根 yml / loader 兜底 / composition.ts / public yml 四处 (id, inject) 一致。

    roleplayer loader 挂载前有拓扑排序，清单**顺序**无语义，故按 id 匹配即可；
    troupe 侧顺序=挂载顺序，已由 test_troupe_composition_yml 锁定。
    """
    from_loader = {e["id"]: list(e["inject"]) for e in DEFAULT_SERVICE_ENTRIES}
    assert dict(_parse_root_yml()) == from_loader, "根 composition.yml 与 loader 兜底漂移"
    assert dict(_parse_ts_composition()) == from_loader, "web composition.ts 与 loader 兜底漂移"
    assert dict(_parse_public_yml()) == from_loader, "web/public/composition.yml 与 loader 兜底漂移"
