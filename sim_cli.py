#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""sim_cli.py - 跑团模拟器命令行入口（REPL）

把 ``troupe.Simulator`` 包成一个可交互的战役驾驶舱。所有操作都走已建好的分层架构，
本文件只负责「收指令 → 调 Simulator → 渲染」。

用法
----
    python sim_cli.py            # 进入交互菜单
    python sim_cli.py --demo     # 不交互，直接跑一局示例并打印档案

菜单
----
    1 新建战役   2 载入存档   3 自动跑 N 场   4 单步一场
    5 世界地图   6 队伍面板   7 任务/派系/时钟 8 事件日志
    9 存档       0 退出
"""
from __future__ import annotations

import argparse
import os
import sys

# 在 PYTHONSAFEPATH=1（入口脚本目录不自动加入 sys.path）时，仍能从自身目录定位 roleplayer / troupe 包
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from roleplayer import Character

from troupe import Simulator
from troupe.modules import available_modules, get_module
from troupe.render import (
    render_clocks, render_factions, render_log, render_party, render_quests,
    render_world,
)


def build_new(opts: dict) -> Simulator:
    ruleset = opts.get("ruleset", "dnd5e")
    module_id = opts.get("module", "improvised")
    module = get_module(module_id) if module_id and module_id != "improvised" else None
    level = int(opts.get("level", 3))
    count = int(opts.get("count", 3))
    seed = int(opts.get("seed", 42))
    party = [Character.random(level, seed=(seed * 100 + i)) for i in range(count)]
    return Simulator(seed=seed, ruleset=ruleset, module=module, party=party)


def cmd_new(sim: Simulator | None) -> Simulator:
    print("可用模组：", "improvised（即兴）", *available_modules())
    module = input("模组 id（回车=即兴）: ").strip() or "improvised"
    ruleset = input("规则集 dnd5e/gurps/coc（回车=dnd5e）: ").strip() or "dnd5e"
    seed_s = input("随机种子（回车=42）: ").strip()
    seed = int(seed_s) if seed_s else 42
    level_s = input("队员等级（回车=3）: ").strip()
    level = int(level_s) if level_s else 3
    count_s = input("队员人数（回车=3）: ").strip()
    count = int(count_s) if count_s else 3
    sim = build_new({"module": module, "ruleset": ruleset, "seed": seed,
                     "level": level, "count": count})
    print(f"已开新战役：规则 {ruleset} · 模组 {module} · 种子 {seed} · 队员 {count} 名")
    return sim


def demo_llm(sim: Simulator) -> None:
    """离线 AI-GM 叙事层演示：把 ``troupe.oracle`` 的结构化判定叠加上 LLM 文笔。

    无 ``ollama_generator`` / Ollama 服务时自动回落到启发式文本（绝不报错）。
    仅用于 ``--demo --llm``，不改动 ``Simulator`` / ``OracleService`` 任何逻辑。
    """
    from roleplayer.gm_llm import LLMNarrator

    n = LLMNarrator(model="qwen2.5:7b")
    ctx = "地下城·哀嚎回廊"
    _scene_label = {"normal": "一切如预期展开", "altered": "出现了意外变故",
                    "interrupted": "被突发事件打断"}
    print("\n" + "═" * 22 + " AI-GM 叙事层演示 " + "═" * 22)
    print(f"LLM 后端在线: {n.enabled}（False = 离线，回落启发式文本）\n")

    fate = sim.ctx.oracle.fate("前方石门后有埋伏吗", odds="不太可能")
    print("【命运问答】", fate["text"])
    print("  →", n.narrate_fate(fate, context=ctx), "\n")

    chk = sim.ctx.oracle.check_scene()
    chk_fb = f"场景开局：{_scene_label.get(chk['result'], chk['result'])}"
    print("【场景开局】", chk_fb)
    print("  →", n.narrate_scene_check({**chk, "text": chk_fb}, context=ctx), "\n")

    ev = sim.ctx.oracle.random_event(scene_kind="exploration", context=ctx)
    print("【随机事件】", ev["text"])
    print("  →", n.narrate_event(ev, context=ctx), "\n")

    q = "我们要不要先搜索左侧的壁龛？"
    print("【开放 GM 应答】玩家：", q)
    print("  →", n.gm_ask(q, context=ctx), "\n")


def main() -> None:
    parser = argparse.ArgumentParser(description="跑团模拟器 CLI")
    parser.add_argument("--demo", action="store_true", help="直接跑一局示例并打印档案")
    parser.add_argument("--llm", action="store_true",
                        help="--demo 时叠加 AI-GM 叙事层（离线自动回落启发式文本）")
    args = parser.parse_args()

    if args.demo:
        sim = Simulator.quick(seed=7, ruleset="dnd5e",
                              module=get_module("border_shrine"), level=3, count=3)
        sim.run(max_scenes=8, verbose=True)
        print("\n" + sim.render())
        if args.llm:
            demo_llm(sim)
        return

    sim: Simulator | None = None
    print("═══════════ 跑团模拟器 D20/Troupe ═══════════")
    while True:
        print("\n菜单：1新建 2载入 3自动跑 4单步 5世界 6队伍 7任务 8日志 9存档 0退出")
        choice = input("> ").strip()
        try:
            if choice == "1":
                sim = cmd_new(sim)
            elif choice == "2":
                path = input("存档路径: ").strip()
                sim = Simulator.load(path)
                print("已载入战役。")
            elif choice == "3":
                if sim is None:
                    print("请先新建或载入战役。")
                    continue
                n_s = input("跑几场（回车=8）: ").strip()
                n = int(n_s) if n_s else 8
                sim.run(max_scenes=n, verbose=True)
                print(sim.render())
            elif choice == "4":
                if sim is None:
                    print("请先新建或载入战役。")
                    continue
                res = sim.step()
                if "winner" in res:  # 战斗戏：补充回合 / XP / 战利品摘要
                    xp = res.get("total_xp", 0)
                    gold = res.get("gold", 0)
                    print(f"⚔ 战斗结果：{res.get('winner')} · {res.get('rounds')} 回合 "
                          f"· 获得 {xp} XP" + (f" · 战利品 {gold} 金" if gold else ""))
                else:  # 非战斗戏
                    print("本场结果：", res.get("outcome") or res.get("fate") or "—")
                sc = sim.ctx.director.scenes()
                if sc:
                    print(sim.render_scene(sc[-1]))
            elif choice == "5":
                if sim: print(render_world(sim))
            elif choice == "6":
                if sim: print(render_party(sim))
            elif choice == "7":
                if sim:
                    print(render_quests(sim) + "\n\n" + render_factions(sim)
                          + "\n\n" + render_clocks(sim))
            elif choice == "8":
                if sim:
                    nn = input("最近几条（回车=20）: ").strip()
                    print(render_log(sim, int(nn) if nn else 20))
            elif choice == "9":
                if sim is None:
                    print("没有可保存的战役。")
                    continue
                path = input("存档路径（回车=save.json）: ").strip() or "save.json"
                sim.save(path)
                print(f"已存档到 {path}")
            elif choice == "0":
                print("退出。")
                break
            else:
                print("无效选项。")
        except Exception as e:  # 单条指令失败不应退出整个 REPL
            print(f"[错误] {e}")


if __name__ == "__main__":
    main()
