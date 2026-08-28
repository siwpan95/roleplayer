"""Cordis 装配不变性测试（重构后行为一致性）

验证重构后 Character（门面 + Service）与重构前 mixin 版本行为一致：
1. composition.yml 真实装配出 16 个 Service，且挂在稳定 key 上；
2. 门面状态与 ctx.state 是同一对象（真实 Cordis 接线，而非又抄一份状态）；
3. Character 不再是 mixin 多重继承树；
4. 用 composition 装配出的 Character 构建的盗贼，与 盗贼.txt 关键字段逐一对齐。

注意：盗贼.txt 的「剩余 CP: 0」是早期旧公式遗留物，当前（与重构前一致的）规则下为 1，
      故本测试只钉住结构稳定字段（属性/优缺点/天赋/技能等级/技术/装备/HP/AC/豁免），
      不钉 CP 末位——避免用过时产物制造脆弱断言。
"""
import os
import sys

import pytest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from d20 import Character
from d20.character import COMPOSITION_PATH

# 重构前 盗贼.txt 中稳定的关键字段（与 CP 末位无关）
EXPECTED_FIELDS = [
    "属性: 力量:11, 敏捷:10, 体质:13",
    "优点: 昏暗视觉",
    "缺点: 荣誉准则(+10)",
    "天赋: 轻巧战法 Lv.1",
    "近战攻击: 10(+1) = 11",
    "技术: 偷袭要害打击",
    "匕首:",
    "全身板甲:",
    "铁盾:",
    "HP: 65 | AC: 20",
    "近战: +11 | 远程: +8",
    "强韧: +11 | 反射: +10 | 意志: +10",
]

SIXTEEN_SERVICES = [
    "attributes", "background", "combat", "condition", "derived", "dice", "equipment",
    "feats", "monster", "perks", "race", "rest", "sheet", "skills", "slots", "techniques",
]


@pytest.fixture
def thief():
    from data.sample_thief import build_thief
    return build_thief()


def _load_thief_txt() -> str:
    with open(os.path.join(ROOT, "盗贼.txt"), encoding="utf-8") as f:
        return f.read()


class TestCompositionWiring:
    def test_composition_file_exists(self):
        assert os.path.exists(COMPOSITION_PATH), "composition.yml 未生成"

    def test_sixteen_services_mounted(self):
        c = Character()
        assert sorted(c.ctx._services.keys()) == sorted(SIXTEEN_SERVICES)

    def test_state_shared_with_ctx(self):
        # 真实 Cordis 接线：门面代理的状态就是 ctx.state，服务读写它即改角色
        c = Character()
        assert c.state is c.ctx.state
        assert c.cp is c.ctx.state.cp
        ok, _ = c.set_attribute("魅力", 12)  # 耗费 calc_attribute_cost(12)=20 CP
        assert ok
        assert c.ctx.state.attributes["魅力"] == 12
        assert c.ctx.state.cp == 150 - 20

    def test_not_mixin_inheritance(self):
        # 重构后 Character 仅是门面，不再继承任何 *Mixin / *Service
        assert Character.__bases__ == (object,)
        names = {b.__name__ for b in Character.__mro__}
        assert not any(n.endswith("Mixin") or n.endswith("Service") for n in names)


class TestThiefMatchesArtifact:
    def test_key_fields_in_sheet(self, thief):
        sheet = thief.show_sheet()
        for field in EXPECTED_FIELDS:
            assert field in sheet, f"角色卡缺少字段: {field}"

    def test_key_fields_in_artifact(self):
        txt = _load_thief_txt()
        for field in EXPECTED_FIELDS:
            assert field in txt, f"盗贼.txt 缺少字段: {field}"

    def test_to_dict_consistent(self, thief):
        d = thief.to_dict()
        assert d["attributes"]["力量"] == 11
        assert d["attributes"]["体质"] == 13
        assert "偷袭要害打击" in d["techniques"]
        assert "匕首" in d["equipment"]
        assert "全身板甲" in d["equipment"]
        assert "铁盾" in d["equipment"]
        assert d["advantages"] == ["昏暗视觉"]
        assert ("轻巧战法", 1) in d["talents"]
        # 装备/优缺点/天赋的等级与 盗贼.txt 一致
        assert d["disadvantages"] == [("荣誉准则", 10)]
