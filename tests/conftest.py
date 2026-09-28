"""pytest 共享 fixtures。"""
import random
import sys
import os

import pytest

# 把项目根目录加入 sys.path，使 `import d20` / `from d20 import ...` 可用
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from d20 import Character


@pytest.fixture(autouse=True)
def _isolate_global_random():
    """隔离全局随机状态，消除测试间的相互污染（flaky）。

    背景：``d20.narration`` 有 25 处 ``_pick()`` 调用依赖全局 ``random``，
    战斗/掷骰逻辑同样如此。此前各测试文件各自 ``random.seed(...)`` 或干脆不播种，
    导致测试**单独跑通过、全量跑随机失败**（实测失败率约 20%，CI 会随机变红）。

    这里用 autouse fixture 在每个测试**开始前**重置为固定种子，使任何测试的执行
    结果只取决于自身逻辑，不再受前面测试消耗随机数的顺序影响。需要在测试内部使用
    特定随机序列的，可在测试体内自行 ``random.seed(...)`` 覆盖（如 seeded_char）。
    """
    random.seed(20260829)
    yield
    random.seed(20260829)


@pytest.fixture
def char():
    """全新角色，150 CP。"""
    return Character()


@pytest.fixture
def fighter(char):
    """预置一个力量型战士：力量 16 + 近战攻击 12 + 匕首。"""
    char.set_attribute("力量", 16)
    char.purchase_skill("近战攻击", 12)
    char.purchase_skill("活力", 10)  # 提供 HP
    char.equip_item("匕首")
    return char


@pytest.fixture
def seeded_char(char):
    """固定随机种子的角色，用于战斗宏的可重现测试。"""
    random.seed(42)
    char.set_attribute("力量", 16)
    char.purchase_skill("近战攻击", 12)
    char.purchase_skill("活力", 10)
    char.equip_item("短剑")
    return char
