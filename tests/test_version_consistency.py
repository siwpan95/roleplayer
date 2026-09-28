# -*- mode: python ; coding: utf-8 -*-
"""版本号一致性回归测试。

背景（2026-08-29 上线前全检发现）：
    D20 的版本号一度散落在三处，且互不校验：
      1. d20/__init__.py        __version__ = "2.2.0"
      2. installer.py           APP_VERSION = "2.0.0"   ← 漂移，写入注册表 DisplayVersion
      3. installer.spec         name="RolePlayer-Setup-2.0.0"  ← 漂移，决定产出安装包文件名

    后果：「添加/删除程序」显示 2.0.0，而应用内「关于」显示 2.2.0；
    用户拿到的安装包名叫 2.0.0，里面装的却是 2.2.0 的代码——发版追溯会彻底混乱。

    修复：APP_VERSION 与 spec 的 name 均以 d20.__version__ 为唯一真相源
    （spec 侧通过 _app_version() 正则解析），本测试负责在 CI 里守住这条约束。
"""
import os
import re
import sys

import pytest

import d20

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


class TestVersionConsistency:
    def test_installer_py_matches_package_version(self):
        """installer.py 的 APP_VERSION 必须等于 d20.__version__。"""
        src = _read(os.path.join(ROOT, "installer.py"))
        m = re.search(r'^APP_VERSION\s*=\s*["\']([^"\']+)["\']', src, re.M)
        assert m, "installer.py 中未找到 APP_VERSION 定义"
        assert m.group(1) == d20.__version__, (
            f"installer.py 的 APP_VERSION({m.group(1)}) 与 "
            f"d20.__version__({d20.__version__}) 不一致，"
            "会导致「添加/删除程序」显示错误版本号"
        )

    def test_installer_spec_derives_name_from_package_version(self):
        """installer.spec 不得再硬编码版本号，必须从 d20/__init__.py 解析。"""
        spec = _read(os.path.join(ROOT, "installer.spec"))
        hardcoded = re.search(r'name\s*=\s*["\']RolePlayer-Setup-\d', spec)
        assert hardcoded is None, (
            "installer.spec 的 name 硬编码了版本号，"
            "应改为 name=f'RolePlayer-Setup-{APP_VERSION}'，由 _app_version() 从 d20/__init__.py 解析"
        )
        assert "RolePlayer-Setup-{APP_VERSION}" in spec, \
            "installer.spec 应使用 _app_version() 解析出的 APP_VERSION 命名产出物"

    def test_spec_version_parser_actually_works(self):
        """直接执行 spec 里的 _app_version()，确认解析逻辑有效（防止正则写错静默失效）。"""
        spec = _read(os.path.join(ROOT, "installer.spec"))
        m = re.search(r"def _app_version\(\) -> str:.*?(?=\nAPP_VERSION)", spec, re.S)
        assert m, "installer.spec 中未找到 _app_version() 定义"
        ns = {"ROOT": ROOT, "os": os, "re": re}
        exec(m.group(0), ns)
        assert ns["_app_version"]() == d20.__version__


@pytest.mark.skipif(
    sys.platform != "win32" or "winreg" not in sys.modules and sys.platform != "win32",
    reason="installer.py 依赖 winreg/ctypes，仅 Windows 可导入",
)
def test_installer_module_imports_and_reports_matching_version():
    """installer 模块能被导入，且运行时读到的版本与包版本一致。"""
    sys.path.insert(0, ROOT)
    try:
        import installer
    except ImportError as e:  # pragma: no cover - 环境相关
        pytest.skip(f"installer 模块无法导入：{e}")
    assert installer.APP_VERSION == d20.__version__
