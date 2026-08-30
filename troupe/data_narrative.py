"""troupe.data_narrative - 叙事锚点查表（裁决结果 → 叙事模板）

此前导演的兜底叙事是内联 f-string（``"{actor} {verb}：{tail}"``），
不可查表、不可扩展。锚点查表把「结果类型 → 叙事模板池」变成**数据**：

* 大成功/大失败/成功/失败 各有一个模板池（``{actor}``/``{verb}`` 占位）；
* 导演按 ``narrative`` 随机域抽模板——同一场战役里同类型结果有多种说法
  （变数归随机），但模板池本身是固定数据（结构归条件/数据）。

模板为**自研通用叙事**，不搬运任何规则书文本。
"""
from __future__ import annotations

#: 结果类型 → 叙事模板池（{actor}/{verb} 占位符）
NARRATIVE_ANCHORS: dict[str, list[str]] = {
    "success": [
        "{actor} 顺利完成了「{verb}」。",
        "{actor} 的「{verb}」奏效了。",
        "{actor} 稳稳拿下了这一记「{verb}」。",
    ],
    "fail": [
        "{actor} 的「{verb}」落了空。",
        "{actor} 这次「{verb}」未能如愿。",
        "{actor} 失手了——「{verb}」功亏一篑。",
    ],
    "crit": [
        "{actor} 的「{verb}」漂亮得无懈可击！",
        "神来之笔——{actor} 的「{verb}」堪称完美！",
    ],
    "crit_fail": [
        "{actor} 的「{verb}」出了大岔子！",
        "糟糕透顶——{actor} 的「{verb}」酿成了大祸！",
    ],
}


def anchor_key(result: object) -> str:
    """按检定结果映射到锚点池键。"""
    critical = str(getattr(result, "critical", "") or "")
    if critical in ("crit", "crit_fail"):
        return critical
    return "success" if getattr(result, "success", False) else "fail"


__all__ = ["NARRATIVE_ANCHORS", "anchor_key"]
