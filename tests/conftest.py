"""pytest 共享 fixtures。"""
import random
import sys
import os

import pytest

# 把项目根目录加入 sys.path，使 `import d20` / `from d20 import ...` 可用
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from d20 import Character


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
