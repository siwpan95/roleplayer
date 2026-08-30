"""Round 6：composition.yml 作为 troupe 服务注册权威来源 + d20 loader 软挂载。

锁定三条不变量：
1. ``troupe/composition.yml`` 与 ``composition.DEFAULT_TROUPE_ENTRIES`` 逐条一致
   （id / service / inject）；且 YAML 必须能被 d20 的「极简 YAML 兜底解析器」解析
   （PyYAML 缺失时回退），因此必须写成块风格，不能写成行内流风格 ``{...}``。
2. d20 基类的 ``loader.DEFAULT_SERVICE_ENTRIES`` 不被 troupe 反向污染（单向分层）。
3. ``mount_defaults_with_troupe`` / ``D20_MERGE_TROUPE`` 软挂载确实把全部 troupe 服务挂上，
   且 d20 自身服务不受影响；默认关闭时绝不挂载 troupe。
"""
from __future__ import annotations

import os

from d20.core import Context
from d20.loader import (
    DEFAULT_SERVICE_ENTRIES,
    _minimal_yaml_load,
    load_yaml,
    merge_optional_troupe,
    mount_defaults_with_troupe,
)

from troupe import available_troupe_services
from troupe.composition import (
    DEFAULT_TROUPE_ENTRIES,
    _COMPOSE_PATH,
    resolve_service,
)

_TROUPE_IDS = (
    "rng", "calendar", "log", "tables", "lore", "oracle", "ruleset",
    "world", "npc", "clock", "faction", "quest", "director", "agency",
    "magic", "provisions", "agent", "encounter",
)


# --------------------------------------------------------------------------- #
#  1) composition.yml 权威来源 ↔ 注册表一致 + 极简解析器兼容
# --------------------------------------------------------------------------- #
def test_compose_yaml_exists_and_is_block_style():
    assert os.path.exists(_COMPOSE_PATH), "troupe/composition.yml 必须存在"
    with open(_COMPOSE_PATH, "r", encoding="utf-8") as f:
        text = f.read()
    # 极简解析器不支持行内流风格映射 {id: ...}，必须全用块风格。
    # 先去掉注释（注释里会举例说明「不要写成 {id: ...}」），再检查是否还有裸 { 。
    stripped = "\n".join(line.split("#", 1)[0] for line in text.splitlines())
    assert "{" not in stripped, "composition.yml 含行内流映射 { ... }，必须改用块风格"


def test_yaml_parses_under_minimal_fallback_parser():
    # 即便 PyYAML 缺失，d20.loader 的极简解析器也必须能解析出 15 条合法条目
    with open(_COMPOSE_PATH, "r", encoding="utf-8") as f:
        text = f.read()
    doc = _minimal_yaml_load(text)
    services = doc.get("services", []) if isinstance(doc, dict) else (doc or [])
    assert len(services) == len(_TROUPE_IDS)
    for e in services:
        assert "id" in e and "service" in e and "inject" in e, \
            f"极简解析器解析出的条目缺字段：{e}"


def test_yaml_matches_registry_entries():
    with open(_COMPOSE_PATH, "r", encoding="utf-8") as f:
        doc = load_yaml(f.read())
    services = doc.get("services", []) if isinstance(doc, dict) else (doc or [])
    # 逐条比对 id / service / inject（顺序也应一致，保证可人工 diff）
    assert [(e["id"], e["service"], e["inject"]) for e in services] == \
           [(e["id"], e["service"], e["inject"]) for e in DEFAULT_TROUPE_ENTRIES]
    assert available_troupe_services() == [e["id"] for e in services]


def test_resolve_service_uses_explicit_registry():
    # 权威解析走显式注册表，不依赖 importlib 盲解析（规避部分初始化模块缺类）
    from troupe.ruleset_service import RulesetService

    assert resolve_service("troupe.ruleset_service.RulesService") is RulesetService
    for e in DEFAULT_TROUPE_ENTRIES:
        assert isinstance(resolve_service(e["service"]), type)


# --------------------------------------------------------------------------- #
#  2) d20 默认清单不被 troupe 污染（单向分层）
# --------------------------------------------------------------------------- #
def test_d20_default_entries_not_polluted_by_troupe():
    d20_ids = {e.get("id") for e in DEFAULT_SERVICE_ENTRIES}
    overlap = d20_ids & set(_TROUPE_IDS)
    assert not overlap, f"d20 默认清单被 troupe 污染：{overlap}"
    # 注册表里的 id 也不应反向写进 d20 默认清单
    for e in DEFAULT_TROUPE_ENTRIES:
        assert e["id"] not in d20_ids


# --------------------------------------------------------------------------- #
#  3) 软挂载：显式 opt-in 挂全部 troupe + d20 不受影响；默认关闭
# --------------------------------------------------------------------------- #
def test_mount_defaults_with_troupe_merges_all_and_keeps_d20():
    ctx = Context()
    mount_defaults_with_troupe(ctx)
    # troupe 全套到位
    for sid in _TROUPE_IDS:
        assert ctx.has(sid), f"软挂载未挂上 troupe 服务：{sid}"
    # d20 自身服务不受影响
    for sid in ("attributes", "skills", "dice", "battle", "sheet"):
        assert ctx.has(sid), f"软挂载拖累了 d20 自有服务：{sid}"


def test_merge_optional_troupe_off_by_default():
    # 无 D20_MERGE_TROUPE 环境变量时，merge_optional_troupe 是 no-op
    ctx = Context()
    mount_defaults_with_troupe(ctx)  # 先确保 d20 服务在
    # 模拟默认关闭：临时清掉环境变量再调 merge（幂等，无 troupe 时应仍无 troupe）
    import os as _os

    saved = _os.environ.pop("D20_MERGE_TROUPE", None)
    try:
        ctx2 = Context()
        merge_optional_troupe(ctx2)  # 默认关闭：什么也不挂
        for sid in _TROUPE_IDS:
            assert not ctx2.has(sid), f"默认关闭却挂上了 troupe 服务：{sid}"
    finally:
        if saved is not None:
            _os.environ["D20_MERGE_TROUPE"] = saved
