# D20 v2.2 模拟对战扩充方案 — 回合制对战引擎 / 遭遇构建 / 蒙特卡洛

> 状态：**已实施**（2026-08-28）。规则依据：联网调研 DMG 2014 遭遇构建与 5e 怪物
> AI 实践，并与本地已拉取的 SRD 官方战斗规则原文（`_srd_pull/rule_sections/`）交叉核对。

## 0. 背景：缺口在哪

v2.0/v2.1 的战斗能力 = **单次「战斗宏」**（`combat_macro`）：掷一次命中、报一次伤害。
缺的是**整场战斗**：

- 没有先攻顺序 → 没有回合轮转
- 怪物 stat block 的 `Multiattack` / `Recharge` / `DC 豁免` 文本从未被解析利用
- 抗力/免疫/易伤数据躺在图鉴里，从未参与结算
- 没有死亡（怪物 0 HP 只是「显示」），PC 没有濒死与死亡豁免
- 没有胜负判定、没有 XP 结算、没有「打很多场看胜率」的能力
- 遭遇难度只能靠 DM 拍脑袋，DMG 2014 的 XP 阈值/遭遇倍数体系完全没有

## 1. 规则调研结论（联网 + 本地交叉核对）

### 1.1 遭遇构建（DMG 2014 第 3 章「Creating Encounters」）

- **每角色 XP 阈值**（easy/medium/hard/deadly）：等级 1 = 25/50/75/100 …
  等级 20 = 2800/5700/8500/12700（全表见 `data_battle.XP_THRESHOLDS`）。
- **遭遇倍数**（行动经济修正）：1 怪 ×1 / 2 怪 ×1.5 / 3–6 怪 ×2 / 7–10 怪 ×2.5 /
  11–14 怪 ×3 / 15+ 怪 ×4。**仅用于判难度，XP 奖励用原始值**。
- **队伍规模调整**：<3 人上浮一档、≥6 人下调一档。
- **每日冒险 XP 预算**（`DAILY_XP_BUDGET`）：1 级 300 … 20 级 40000。
- 验证例：4×L1 队 vs 哥布林×4 → 基础 200 × 2 = 400 = 该队 **致命** 阈值 ✓；
  L3×4 队 vs 单只石化蜥蜴（CR3=700 XP）→ **中等** ✓（与「CR = 4 人同级队伍的中等挑战」规则一致）。

### 1.2 怪物 AI（5e 怪物 AI 实践，多来源综合）

- **目标选择**：最近优先；**WIS ≥ 12 时「重伤优先」**（按 HP 百分比）。
- **动作优先级**：解除自身状态 > 特殊能力（喷吐/眼波）> 远程 > 近战。
- **适配**：**INT ≥ 10** 自动规避目标免疫/抗性的伤害类型；**INT ≥ 18** 每回合取期望伤害最大。
- **PC 侧（行动经济研究结论）**：集火最低 HP 敌人（减少敌方行动数）；
  「悠悠球治疗」——同伴倒地后用附赠动作法术（治疗言灵）拉起，而非满血维持。

### 1.3 战斗流程（本地 SRD 规则原文，`RULE_SECTIONS`）

- The Order of Combat：先攻 d20+敏捷，平手比骰面；回合 = 动作 + 移动 + 附赠（+反应）。
- Making an Attack：命中 = d20+加值 ≥ AC；20 暴击（伤害骰翻倍）、1 必失。
- Damage and Healing：抗力减半 / 免疫无效 / 易伤加倍；HP 最低 0。
- 状态攻防影响：目盲/束缚/震慑…攻击劣势；倒地/麻痹/昏迷/束缚/石化…被攻优势；
  倒地时远程攻击劣势。死亡豁免：≥10 成功、<10 失败、1 计 2 败、20 回 1 HP。

## 2. 设计决策（A–F）

| # | 决策点 | 结论 |
|---|---|---|
| **A** | 战斗单位模型 | 统一 `Combatant`：PC（包装 `Character`）与怪物（包装 stat block）同构；怪物为「外部战斗单位」，不污染 `CharacterState` |
| **B** | 空间模型 | 1-D 位置线（初始 60 尺），移动 = 速度，近战触及 5 尺，远程取武器正常射程；触及不到可**疾行**（动作换移动，本回合不再攻击） |
| **C** | 结构化结算单一真相 | `combat.resolve_attack()` 返回 dict，战斗宏**改为基于它渲染字符串**（输出与旧版一致），对战引擎直接消费——命中/伤害公式只有一份 |
| **D** | 怪物动作解析 | 从 stat block 英文原文解析：`Multiattack`（"makes three attacks: one with its bite and two with its claws"）、`DC N 豁免`、`Recharge 5-6`——全部数据驱动，零硬编码 |
| **E** | 伤害类型归一化 | `normalize_damage_type`：怪物库中英混用/简称（slashing/挥砍/火/酸…）归一到 canonical 中文，抗力判定跨模块一致 |
| **F** | 蒙特卡洛状态隔离 | `simulate(trials)` 每局快照/恢复 PC 的 HP、法术位、条件——跑 1000 场也不污染玩家状态 |

## 3. 新增模块

```
d20/data_battle.py   对战规则常量：XP 阈值/遭遇倍数/每日预算/伤害归一化/状态与豁免映射/AI 阈值
d20/battle.py        BattleService：Combatant/Battle 模型、回合引擎、怪物与 PC AI、
                     死亡豁免、传奇动作、遭遇构建、蒙特卡洛
tests/test_battle.py 30 项测试
web/src/engine/battle.ts / data_battle.ts   TS 端 1:1 镜像
```

`composition.yml` / `composition.ts` 追加 `battle`（inject `[dice, monster, condition]`），
服务总数 16 → 19（v2.1 +2，v2.2 +1）。CLI 新增 `12.模拟对战`。

## 4. 校准（蒙特卡洛 x300，3 级双人队：战士+法师）

| 遭遇 | 调整 XP | DMG 难度 | 实测胜率 |
|---|---|---|---|
| 哥布林×2 | 200 | 简单 | **97%** |
| 兽人×2 | 300 | 中等 | **91%** |
| 哥布林×4 | 400 | 困难 | **45%** |

胜率与 DMG 档位描述吻合（困难 = 真有风险）。校准过程中修掉的引擎真 bug：
① 战士用长剑打 60 尺外的敌人（没有远程武器却「远程攻击」）；② 疾行后仍攻击
（动作经济违规）；③ 稳定的濒死 PC 仍每回合掷死亡豁免；④ 法师只抡武器不放法术。

## 5. 验证

| 端 | 命令 | 结果 |
|---|---|---|
| Python | `python -m pytest tests/ -q` | **255 passed**（225 → 255，+30，盗贼基准零回归） |
| Web 类型/构建 | `npm run typecheck` / `npm run build` | 通过 |
| Web 冒烟 | `npm run smoke` | 通过（+7 项 v2.2 断言） |
| Web 单测 | `npm test` | **25 passed**（19 → 25） |

## 6. 来源

- DMG 2014 遭遇构建：dndhpcalculator.com/dnd-encounter-calculator（完整 XP 阈值表）、
  theroleplayersguild.com（DM 速查表，两队数字互相印证）
- 怪物 AI：gameandtechfocus.com（5e Monster AI：目标/适配/WIS/INT 阈值）、
  oracle-rpg.com（solo DnD 怪物 AI 优先级）、ice5e.com（行动经济：集火与悠悠球治疗）
- 战斗流程原文：本地 `_srd_pull/rule_sections/*.json`（dnd5eapi.co/api/2014 权威拉取）
