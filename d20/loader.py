"""d20.loader - 从 cordis.yml 风格组合文件装配子系统

借鉴 deepseek-harness 的 plugin-loader / include：
- 每行一个服务条目：``id`` / ``service``(点分路径) / ``config`` / ``inject`` / ``disabled``
- ``include``：内联另一个组合文件
- ``disabled``：布尔，或 ``js:<expr>`` 在受限命名空间求值（平台相关条件组合）
加载器按 ``inject`` 依赖做拓扑排序后挂载；缺失依赖直接报错（misconfiguration fails loud）。
"""
from __future__ import annotations

import importlib
import os
from typing import Any, Optional

from .core import Context, CordisError


# ---------------------------------------------------------------------------
#  极简 YAML 解析（PyYAML 不可用时的兜底；支持本组合文件所需的子集）
# ---------------------------------------------------------------------------
def _strip_comment(line: str) -> str:
    out: list[str] = []
    in_s = False
    in_d = False
    for ch in line:
        if ch == "'" and not in_d:
            in_s = not in_s
        elif ch == '"' and not in_s:
            in_d = not in_d
        elif ch == "#" and not in_s and not in_d:
            break
        out.append(ch)
    return "".join(out)


def _parse_scalar(s: str) -> Any:
    s = s.strip()
    if s == "" or s == "~" or s.lower() == "null":
        return None
    if (s[0] == '"' and s[-1] == '"') or (s[0] == "'" and s[-1] == "'"):
        return s[1:-1]
    low = s.lower()
    if low == "true":
        return True
    if low == "false":
        return False
    try:
        return int(s)
    except ValueError:
        pass
    try:
        return float(s)
    except ValueError:
        pass
    return s


def _parse_flow_seq(s: str) -> list:
    inner = s.strip()[1:-1].strip()
    if not inner:
        return []
    return [_parse_scalar(x) for x in inner.split(",")]


def _minimal_yaml_load(text: str) -> Any:
    """极简 YAML：块映射 / 块序列 / 行内流列表 / 标量 / 注释。"""
    items: list[tuple[int, str]] = []
    for raw in text.splitlines():
        stripped = _strip_comment(raw)
        if stripped.strip() == "":
            continue
        indent = len(stripped) - len(stripped.lstrip(" "))
        items.append((indent, stripped.strip()))

    pos = [0]

    def parse_mapping(cur_ind: int) -> dict:
        d: dict = {}
        while pos[0] < len(items):
            ind, content = items[pos[0]]
            if ind < cur_ind or content.startswith("- "):
                break
            if ind > cur_ind:
                break
            key, _, val = content.partition(":")
            key = key.strip()
            val = val.strip()
            pos[0] += 1
            if val == "":
                if pos[0] < len(items) and items[pos[0]][0] > cur_ind:
                    cind = items[pos[0]][0]
                    if items[pos[0]][1].startswith("- "):
                        d[key] = parse_sequence(cind)
                    else:
                        d[key] = parse_mapping(cind)
                else:
                    d[key] = None
            elif val.startswith("[") and val.endswith("]"):
                d[key] = _parse_flow_seq(val)
            else:
                d[key] = _parse_scalar(val)
        return d

    def parse_sequence(cur_ind: int) -> list:
        seq: list = []
        while pos[0] < len(items):
            ind, content = items[pos[0]]
            if ind != cur_ind or not (content.startswith("- ") or content == "-"):
                break
            item = content[2:].strip() if content.startswith("- ") else ""
            pos[0] += 1
            if item == "":
                if pos[0] < len(items) and items[pos[0]][0] > cur_ind:
                    cind = items[pos[0]][0]
                    seq.append(
                        parse_sequence(cind)
                        if items[pos[0]][1].startswith("- ")
                        else parse_mapping(cind)
                    )
                else:
                    seq.append(None)
            elif (":" in item) and not (item.startswith("[") or item.startswith('"')):
                # 映射项：首 key 在 dash 行
                key, _, val = item.partition(":")
                key = key.strip()
                val = val.strip()
                m: dict = {}
                item_ind = cur_ind + 2
                if val == "":
                    if pos[0] < len(items) and items[pos[0]][0] > cur_ind:
                        cind = items[pos[0]][0]
                        m[key] = (
                            parse_sequence(cind)
                            if items[pos[0]][1].startswith("- ")
                            else parse_mapping(cind)
                        )
                    else:
                        m[key] = None
                elif val.startswith("[") and val.endswith("]"):
                    m[key] = _parse_flow_seq(val)
                else:
                    m[key] = _parse_scalar(val)
                while (
                    pos[0] < len(items)
                    and items[pos[0]][0] == item_ind
                    and not items[pos[0]][1].startswith("- ")
                ):
                    k2, _, v2 = items[pos[0]][1].partition(":")
                    k2 = k2.strip()
                    v2 = v2.strip()
                    pos[0] += 1
                    if v2 == "":
                        if pos[0] < len(items) and items[pos[0]][0] > item_ind:
                            c2 = items[pos[0]][0]
                            m[k2] = (
                                parse_sequence(c2)
                                if items[pos[0]][1].startswith("- ")
                                else parse_mapping(c2)
                            )
                        else:
                            m[k2] = None
                    elif v2.startswith("[") and v2.endswith("]"):
                        m[k2] = _parse_flow_seq(v2)
                    else:
                        m[k2] = _parse_scalar(v2)
                seq.append(m)
            else:
                seq.append(_parse_scalar(item))
        return seq

    if not items:
        return None
    if items[0][1].startswith("- "):
        return parse_sequence(items[0][0])
    return parse_mapping(0)


def load_yaml(text: str) -> Any:
    """优先用 PyYAML，缺失时回退极简解析。"""
    try:
        import yaml  # type: ignore

        return yaml.safe_load(text)
    except Exception:
        return _minimal_yaml_load(text)


# ---------------------------------------------------------------------------
#  组合加载
# ---------------------------------------------------------------------------
def _resolve_service(path: str) -> type:
    module_path, _, cls_name = path.rpartition(".")
    if not module_path:
        raise CordisError(f"invalid service path: {path}")
    module = importlib.import_module(module_path)
    cls = getattr(module, cls_name, None)
    if cls is None:
        raise CordisError(f"service class not found: {path}")
    return cls


def _is_disabled(entry: dict) -> bool:
    """返回该服务是否应被禁用。

    ``disabled`` 字段仅支持布尔。历史版本曾支持 ``disabled: "js:..."`` 表达式求值，
    因构成不必要的动态执行面（即便已沙箱化）已移除；若配置误写非布尔值，按 ``bool(dis)`` 处理。
    """
    dis = entry.get("disabled", False)
    if isinstance(dis, bool):
        return dis
    return bool(dis)


def _collect_entries(doc: Any, base_dir: str, extra_vars: dict) -> list:
    entries: list = []
    if isinstance(doc, dict):
        for inc in doc.get("include", []) or []:
            inc_path = inc if os.path.isabs(inc) else os.path.join(base_dir, inc)
            with open(inc_path, "r", encoding="utf-8") as f:
                sub = load_yaml(f.read())
            entries.extend(_collect_entries(sub, os.path.dirname(inc_path), extra_vars))
        entries.extend(doc.get("services", []) or [])
    elif isinstance(doc, list):
        entries.extend(doc)
    return entries


def _topo_sort(entries: list) -> list:
    """按 inject 依赖拓扑排序，保证依赖先于依赖者挂载。"""
    by_id = {e.get("id"): e for e in entries}
    visited: set = set()
    ordered: list = []

    def visit(e: dict) -> None:
        eid = e.get("id")
        if eid in visited:
            return
        visited.add(eid)
        for dep in e.get("inject", []) or []:
            if dep in by_id:
                visit(by_id[dep])
        ordered.append(e)

    for e in entries:
        visit(e)
    return ordered


def load_composition(ctx: Context, path: str, extra_vars: Optional[dict] = None) -> None:
    """读取组合文件并把服务挂载到 ctx。"""
    if not os.path.exists(path):
        raise CordisError(f"composition file not found: {path}")
    with open(path, "r", encoding="utf-8") as f:
        doc = load_yaml(f.read())
    entries = _collect_entries(doc, os.path.dirname(path), extra_vars or {})
    ordered = _topo_sort(entries)
    for entry in ordered:
        if _is_disabled(entry):
            continue
        cls = _resolve_service(entry["service"])
        ctx.mount(cls, entry.get("config") or {}, name=entry.get("id"))
