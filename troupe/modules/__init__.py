"""troupe.modules - 战役模组注册表

模组是**可选的脚手架**：没有模组时模拟器用 ``WorldService.ensure_default_world``
搭最小世界即兴生成；有模组时提供初始种子，导演在其上即兴发挥。

新增模组：在 ``build`` 处登记一行即可。
"""
from __future__ import annotations

from ..contracts import CampaignModule
from .generator import build_generated_module, generate_module
from .handwritten import (  # P3 手写模组（2026-08-31）
    build_bone_mill_module, build_mirror_inn_module, build_salt_road_module,
)
from .sample import build_sample_module

#: 模组注册表（id → 构造器）
_REGISTRY: dict[str, type[CampaignModule]] = {}


def register_module(builder) -> None:
    mod = builder()
    _REGISTRY[mod.id] = builder


register_module(build_sample_module)
register_module(build_generated_module)   # 程序化生成（同种子同图，见 generator.generate_module）
register_module(build_mirror_inn_module)
register_module(build_salt_road_module)
register_module(build_bone_mill_module)


def available_modules() -> list[str]:
    return sorted(_REGISTRY)


def get_module(module_id: str) -> CampaignModule:
    builder = _REGISTRY.get(module_id)
    if builder is None:
        raise KeyError(f"未知模组：{module_id}（已注册：{', '.join(available_modules())} 或 'improvised'）")
    return builder()


__all__ = ["register_module", "available_modules", "get_module",
           "generate_module", "build_generated_module"]
