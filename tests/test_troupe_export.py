"""troupe 战役档案富文本导出测试（L7 呈现层的对外出口）。

``render.py`` 只输出终端纯文本；``export.py`` 输出可归档/可分享的富文本。
锁定：Markdown / HTML / JSON 三种产物**共用同一份中间档案**（不会出现某一种
少了字段），且 HTML 是**自包含 + 已转义**的（可双击打开、不会被事件文本注入破坏）。
"""
import json

from roleplayer import Character

from troupe.simulator import Simulator
from troupe.modules import generate_module
from troupe.export import build_archive, export_html, export_json, export_markdown


def _sim(seed: int = 51, steps: int = 3):
    """带队伍 + 带程序化模组的战役（跑几场，让时间轴有内容）。"""
    sim = Simulator(seed=seed, ruleset="dnd5e", module=generate_module(seed),
                    party=[Character.random(3, seed=seed)])
    sim.run(steps)
    return sim


# =============================================================================
#  中间档案
# =============================================================================
def test_build_archive_has_all_sections():
    a = build_archive(_sim())
    for key in ("meta", "party", "world", "quests", "clocks",
                "factions", "timeline", "stats"):
        assert key in a, f"档案缺少 {key}"
    assert a["meta"]["ruleset"] == "dnd5e"
    assert a["party"], "带队伍的战役应导出队伍"
    assert a["world"]["places"], "带模组的战役应导出地点"
    assert a["timeline"], "跑过场景应导出时间轴"
    assert a["stats"]["events"] == len(a["timeline"])


def test_three_exports_share_one_archive():
    """三种产物来自同一份取数逻辑：任务数、事件数必须一致。"""
    sim = _sim(52)
    a = build_archive(sim)
    md = export_markdown(sim)
    js = json.loads(export_json(sim))
    assert js["stats"]["events"] == a["stats"]["events"]
    assert js["quests"] == a["quests"]
    # Markdown 里应出现每个任务的标题（不是只挑了几个）
    for q in a["quests"]:
        assert q["title"] in md


# =============================================================================
#  Markdown
# =============================================================================
def test_export_markdown_sections():
    md = export_markdown(_sim(53))
    for head in ("# ", "## 队伍", "## 任务", "## 时钟", "## 世界", "## 事件时间轴"):
        assert head in md, f"Markdown 缺少章节：{head}"
    # 表格头完整
    assert "| 成员 | 职业 | 等级 | 生命 | 状态 |" in md


def test_export_markdown_writes_file(tmp_path):
    path = str(tmp_path / "campaign.md")
    export_markdown(_sim(54), path)
    with open(path, "r", encoding="utf-8") as f:
        assert f.read().startswith("# ")


# =============================================================================
#  HTML
# =============================================================================
def test_export_html_is_self_contained():
    h = export_html(_sim(55))
    assert h.startswith("<!DOCTYPE html>")
    assert "<style>" in h and "</style>" in h     # 内联样式，无外部依赖
    assert "<script" not in h                      # 不需要脚本也能看
    assert h.rstrip().endswith("</html>")
    assert "<h1>" in h and "<h2>队伍</h2>" in h


def test_export_html_escapes_hostile_event_text():
    """事件文本里的尖括号必须被转义，否则会破坏结构（甚至注入脚本）。"""
    sim = _sim(56, steps=1)
    sim.ctx.log.record("scene.note", text="<script>alert('x')</script>", tags=[])
    h = export_html(sim)
    assert "<script>" not in h
    assert "&lt;script&gt;" in h
    assert "alert(&#x27;x&#x27;)" in h      # 内容仍在，只是连引号也被安全转义


def test_export_html_writes_file(tmp_path):
    path = str(tmp_path / "campaign.html")
    export_html(_sim(57), path)
    with open(path, "r", encoding="utf-8") as f:
        assert f.read().startswith("<!DOCTYPE html>")


# =============================================================================
#  JSON（Web 端消费）
# =============================================================================
def test_export_json_roundtrips():
    sim = _sim(58)
    text = export_json(sim)
    data = json.loads(text)
    assert data["meta"]["seed"] == 58
    assert isinstance(data["timeline"], list)
    # 每个事件都带 seq/type/text，前端才好渲染
    for ev in data["timeline"]:
        assert {"seq", "type", "text"} <= set(ev)


def test_export_json_writes_file(tmp_path):
    path = str(tmp_path / "campaign.json")
    export_json(_sim(59), path)
    with open(path, "r", encoding="utf-8") as f:
        assert json.load(f)["meta"]["ruleset"] == "dnd5e"
