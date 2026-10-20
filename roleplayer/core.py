"""roleplayer.core - Python 版 mini-Cordis

参考 deepseek-harness 中 vendored 的 Cordis（TypeScript 插件框架）思想，为 D20
提供一套零依赖的「上下文 / 服务 / 依赖注入 / 事件 / 生命周期」模型：

- ``Context``  : 服务容器 + 事件总线 + effect 生命周期。插件按 key 挂到 ``ctx.<name>``。
- ``Service``  : 能力单位，声明 ``inject`` 依赖；挂载后其他服务按 key 查找。
- 依赖注入     : ``Context.mount`` 在挂载前校验 ``inject`` 依赖已就绪（加载顺序由依赖表达）。
- 事件         : ``emit`` / ``waterfall`` / ``serial`` / ``parallel`` 四种语义（见 ``EventBus``）。
- 可逆副作用   : ``ctx.effect(fn)`` 收集 disposer，``ctx.dispose()`` 逆序清理。

与 Cordis 的差异：D20 是单上下文纯 Python 应用，因此省略了 proxy 分支、``isolate``
作用域与 HMR；保留了对本重构最有价值的「显式装配 + 依赖声明 + 事件 + 可逆清理」。
"""
from __future__ import annotations

from typing import Any, Callable, Optional


class CordisError(Exception):
    """Cordis 框架错误（缺失服务 / 配置错误等）。"""


class EventBus:
    """类型化事件总线，支持四种分发语义。"""

    def __init__(self) -> None:
        self._listeners: dict[str, list[Callable]] = {}

    def on(self, name: str, fn: Callable) -> Callable[[], None]:
        """注册监听，返回 disposer（可在 effect 内自动回收）。"""
        self._listeners.setdefault(name, []).append(fn)

        def dispose() -> None:
            lst = self._listeners.get(name)
            if lst and fn in lst:
                lst.remove(fn)

        return dispose

    def off(self, name: str, fn: Callable) -> None:
        lst = self._listeners.get(name)
        if lst and fn in lst:
            lst.remove(fn)

    def emit(self, name: str, *args: Any) -> None:
        """观察型：所有监听按注册顺序触发，忽略返回值，不 await。"""
        for fn in list(self._listeners.get(name, [])):
            fn(*args)

    def waterfall(self, name: str, seed: Any, *args: Any) -> Any:
        """变换/包装型：每个监听 ``fn(current, *args, next)`` 返回新 current，按序链式。

        不调用 ``next()`` 即短路（与 Cordis waterall 语义一致）。
        """
        listeners = list(self._listeners.get(name, []))

        def runner(i: int, current: Any):
            if i >= len(listeners):
                return current
            return listeners[i](current, *args, lambda nxt: runner(i + 1, nxt))

        return runner(0, seed)

    def serial(self, name: str, *args: Any) -> None:
        """按序执行型：监听依次运行（支持 async）。"""
        for fn in list(self._listeners.get(name, [])):
            result = fn(*args)
            if hasattr(result, "__await__"):
                import asyncio

                asyncio.run(result)

    async def parallel(self, name: str, *args: Any) -> None:
        """并行扇出型：所有监听并发执行。"""
        import asyncio

        await asyncio.gather(*(fn(*args) for fn in list(self._listeners.get(name, []))))


class Context:
    """Cordis 上下文：服务容器 + 事件总线 + effect 生命周期。

    服务以稳定 key 挂到 ctx（如 ``ctx.attributes`` / ``ctx.equipment``）。
    通过 ``ctx.get(name)`` 或属性访问 ``ctx.<name>`` 查找。
    ``ctx.state`` 持有宿主（Character）的可变状态，服务读写它。
    """

    def __init__(self) -> None:
        self._services: dict[str, "Service"] = {}
        self._events = EventBus()
        self._disposers: list[list[Callable[[], None]]] = []
        self._effect_stack: list[list[Callable[[], None]]] = []
        self.state: Any = None
        # 供插件元数据探测（轻量生命周期记录）
        self.fiber = _Fiber(self)

    # ---- 服务注册 ----
    def provide(self, name: str, service: "Service") -> "Service":
        self._services[name] = service
        return service

    def get(self, name: str) -> "Service":
        svc = self._services.get(name)
        if svc is None:
            raise CordisError(f"service not found: {name}")
        return svc

    def has(self, name: str) -> bool:
        return name in self._services

    def __getattr__(self, name: str) -> Any:
        # 仅在常规属性查找失败时触发（服务按 key 代理）
        services = self.__dict__.get("_services", {})
        if name in services:
            return services[name]
        raise AttributeError(name)

    # ---- 事件 ----
    def on(self, name: str, fn: Callable) -> Callable[[], None]:
        disp = self._events.on(name, fn)
        if self._effect_stack:
            self._effect_stack[-1].append(disp)
        return disp

    def emit(self, name: str, *args: Any) -> None:
        self._events.emit(name, *args)

    def waterfall(self, name: str, seed: Any, *args: Any) -> Any:
        return self._events.waterfall(name, seed, *args)

    def serial(self, name: str, *args: Any) -> None:
        self._events.serial(name, *args)

    async def parallel(self, name: str, *args: Any) -> None:
        await self._events.parallel(name, *args)

    # ---- 插件挂载（依赖注入） ----
    def mount(self, plugin: type, config: Optional[dict] = None, name: Optional[str] = None) -> "Service":
        """挂载一个 Service 子类。挂载前校验其 ``inject`` 依赖已就绪。"""
        if not (isinstance(plugin, type) and issubclass(plugin, Service)):
            raise CordisError(f"mount expects a Service subclass, got {plugin!r}")
        for dep in getattr(plugin, "inject", []) or []:
            if dep not in self._services:
                raise CordisError(
                    f"service '{name or plugin.__name__}' requires '{dep}' "
                    f"but it is not mounted yet"
                )
        svc = plugin(self, config or {})
        sname = name or svc.name
        svc.name = sname
        self.provide(sname, svc)
        svc.apply()
        return svc

    # ---- 可逆副作用 ----
    def effect(self, fn: Callable[[], Any]) -> Callable[[], None]:
        collected: list[Callable[[], None]] = []
        self._effect_stack.append(collected)
        try:
            result = fn()
            if callable(result):
                collected.append(result)
            elif hasattr(result, "__iter__"):
                collected.extend(result)
        finally:
            self._effect_stack.pop()
        self._disposers.append(collected)

        def dispose() -> None:
            self._dispose_list(collected)

        return dispose

    def _dispose_list(self, collected: list[Callable[[], None]]) -> None:
        for d in reversed(collected):
            d()

    def dispose(self) -> None:
        """卸载所有服务：先逆序调用各服务的 ``dispose()``（若有），再逆序运行 effect disposer。"""
        for svc in reversed(list(self._services.values())):
            dispose_fn = getattr(svc, "dispose", None)
            if callable(dispose_fn):
                dispose_fn()
        for lst in reversed(self._disposers):
            self._dispose_list(lst)
        self._disposers.clear()


class _Fiber:
    """轻量插件生命周期状态（D20 单上下文，仅记录已挂载列表）。"""

    def __init__(self, ctx: Context) -> None:
        self.ctx = ctx
        self.name = "root"

    def effect(self, fn, label: str = "anonymous"):
        return self.ctx.effect(fn)


class Service:
    """能力单位基类。子类声明 ``inject`` 依赖列表与 ``name``。"""

    inject: list[str] = []
    name: str = ""

    def __init__(self, ctx: Context, config: Optional[dict] = None) -> None:
        self.ctx = ctx
        self.config = config or {}
        if not self.name:
            self.name = type(self).__name__.lower().replace("service", "")

    def apply(self) -> None:
        """挂载钩子，子类可重写（默认空）。"""
        return None
