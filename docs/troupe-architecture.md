# troupe — 跑团模拟器架构手册（D&D × GURPS 融合）

> 把 `d20` 包（v3.0「Role Player 跑团模拟器」，包名沿用 d20）从一个**角色构建 + 回合制对战引擎**，
> 拓展为一个**无真人 DM 也能跑的跑团模拟器（GM emulator / session simulator）**。
>
> 设计哲学：**模组给骨架，模拟器填血肉。** 模组只提供初始种子（地点 / 通路 / NPC / 派系 /
> 任务 / 时钟 / 线索），真正的剧情走向由「导演 + 智能体 + 随机表」即兴生成——这正是 GME
> （GM 模拟器）式「无预设跑团」的精髓。

---

## 1. 分层架构总览

```
L0  内核        d20.core                 Context / Service / 事件总线（Cordis 迷你实现）
L1  规则适配     ruleset*                把角色卡翻译成 D&D / GURPS 统一检定语义
L2  世界模型     world/npc/faction/
               quest/clock/calendar/lore 地点图 / NPC / 派系 / 任务 / 进度时钟 / 历法 / 已确立事实
L3  叙事导演     oracle/director          GM 模拟（混沌 / 命运 / 场景检查）+ 裁定落地
L4  遭遇模式     encounter                探索 / 交涉 / 旅行 / 休整 / 战斗的调度
L5  智能体       agent                    PC 行动提议策略（只提议，不落地）
L6  持久化       save                     存档 / 确定性续跑 / 事件溯源
L7  呈现         render                   文本渲染（战报 / 档案 / 队伍面板）
```

### 依赖方向（单向向下）

```
L7 render ──▶ L6 save ──▶ L5 agent ──▶ L4 encounter ──▶ L3 director ──▶ L2 world
   │            │            │            │               │              │
   └────────────┴────────────┴────────────┴───────┬───────┴──────────────┘
                                                  ▼
                                    L1 ruleset ──▶ L0 d20.core
```

- **L5 智能体**只产生 `Action`（提议），**绝不**直接改世界状态；
- **L4 遭遇**调度 `Action`；
- **L3 导演** `adjudicate()` 裁定 + `apply_consequence()` 落地——**全系统唯一集中写世界状态的地方**
  （战斗由 `d20.battle` 在内部快照上结算，不污染角色卡长期状态）。

---

## 2. 装配顺序（组合根）

所有服务由 `troupe/simulator.py` 的 `Simulator.__init__` 按依赖顺序程序化 `mount`：

```text
RngService → Calendar → Log → Tables → Lore → Oracle → Ruleset
          → World → Npc → Faction → Quest → Clock → Director
          → Encounter → Agent
```

> 注意：troupe 服务**不**进 `d20/composition.yml` / `loader.DEFAULT_SERVICE_ENTRIES`。
> 它们由 `Simulator` 独立装配（Cordis 的 `DEFAULT_SERVICE_ENTRIES` 只覆盖 `d20` 自有服务）。
> 若以后要让 troupe 走配置文件装配，需在此两处镜像同步。

`Simulator` 暴露的对外面（门面）：

| 方法 | 作用 |
|------|------|
| `Simulator(seed, ruleset, module, party, name)` | 构造并装配全部服务 |
| `Simulator.quick(seed, ruleset, module, level, count)` | 随机生成队伍 + 装配的便捷构造 |
| `plan_next()` | 让 Encounter 规划下一场戏的 `SceneSpec` |
| `step()` | 跑一场戏（探索/交涉/旅行/休整/战斗） |
| `run(max_scenes, verbose)` | 自动跑完至多 N 场，遇全灭即止 |
| `render(log_n)` | 渲染战役档案文本 |
| `save(path)` / `Simulator.load(path)` | 存档 / 载入（确定性续跑） |

---

## 3. 核心契约（`troupe/contracts.py`）

所有 Service 之间**只交换 dataclass**（契约层），通过 `DictMixin` 提供 `to_dict` /
`from_dict` / `load`，`_transient` 字段在序列化时被丢弃（运行时引用不进存档）。

### 3.1 事件溯源（`Event` + `EVENT_TYPES`）

所有世界状态变更都**先记事件再改状态**（或同时）。`EVENT_TYPES` 是事件类型的白名单，
未登记的类型在 `record()` / `Event.__post_init__` 处 **fails loud**（`ValueError`），
防止拼写错误悄悄流入事件流。

已登记类型（节选）：

```
session.start / session.end
scene.start / scene.check / scene.note / scene.end
check / oracle.fate / oracle.event
move / discovery / clue
combat.start / combat.round / combat.end / combat.request
damage / heal / condition / death / rest
travel / social / downtime
quest.update / clock.tick / faction.shift
npc.new / npc.met / loot / xp / time.advance / custom
```

渲染战报只需遍历 `log.events` 取 `text`——叙事文本是事件的**一种渲染**，真正的状态由
各 Service 持有，因此回放可以只重放「事件流 + 种子 + 规则集」。

### 3.2 行动 → 后果（`Action` / `CheckRequest` / `Consequence`）

```
Action      PC 想做的事：kind / verb / actor / target / request(CheckRequest?) / on_success / on_fail
CheckRequest  一次检定请求：actor / kind / key / tier / modifier
Consequence   裁定后的世界变更：narrative + effects(dict)  —— 由导演翻译为各 Service 调用
```

`effects` 是声明式字典（如 `{"damage": {...}}`、`{"move": "ruined_shrine"}`、
`{"rest": "long"}`、`{"discover": "..."}`），导演 `apply_consequence` 据此分发，世界状态
变更**只发生在此处**。

### 3.3 场景（`SceneSpec` / `SceneState`）

```
SceneSpec   一场戏的静态规划：kind / title / goal / place / danger / enemies / actors
SceneState  一场戏的运行态：id / kind / beats(叙事节拍) / outcome / 起止时间
```

### 3.4 战役模组（`CampaignModule`）

模组的初始种子容器（见 §10），由 `WorldService.load_module` 灌入世界。

### 3.5 会话状态（`SessionState`）

被所有 Service 共享读写的会话级可变状态：种子、规则集、当前地点、场景计数、混沌因子、
累计 XP / 金币、是否结束、结局。本身也实现 `load()` 以支持存档续跑。

---

## 4. 规则适配层（L1）— Ruleset Adapter Pattern

两套规则的**判定语义相反**：

| 规则 | 判定 | 掷骰 | 难度 |
|------|------|------|------|
| D&D 5e | `d20 + 加值 ≥ DC` | 掷**高** | 难度等级表（DC 5/10/15/20/25/30） |
| GURPS 4e | `3d6 ≤ 有效技能等级` | 掷**低** | 情境修正（±1..±n） |

`RulesetAdapter`（`troupe/ruleset.py`）定义**规则无关门面**。世界层只说「做一次普通难度的
『搜索』检定」，规则层负责翻译成 `d20+3 vs DC15` 或 `3d6 ≤ 11`。

两个适配器作用在**同一个 `d20.Character`** 上（本项目用 GURPS 式点数购买 + D&D 六维属性，
技能等级是「绝对有效等级」，两套规则各自解释）：

- D&D：等级 = 加值（`d20 + 等级 vs DC`）
- GURPS：等级 = 掷骰上限（`3d6 ≤ 等级`）

规则切换**不需要重建角色**，也不破坏 v2.x 的既有 API 与存档。

### 适配器必须实现的接口（节选）

```
check(actor, request) -> CheckResult      # 核心判定语义
dc_for(tier) / modifier_for(tier)         # 难度档 → 目标值 / 情境修正
rank_of / hp_of / set_hp / damage / heal / rest / alive / defense_of
resolve_attack(attacker, defender, ...)   # 场景级轻量攻击结算
to_combatant(actor)                       # 转成 d20.battle 可消费的战斗单位
xp_for(threat)                            # 威胁 → 经验值
actor_view(actor) / describe(actor)       # 结构化 / 文本角色视图
```

### 注册与查找

```python
from troupe import register_ruleset, get_ruleset, available_rulesets

register_ruleset(MyRuleset)          # 模块底部注册
rs = get_ruleset("dnd5e", rng=ctx.rng) # 按 id 取实例
```

### 如何新增一套规则（CoC d100 / PbtA 2d6 / Year Zero 骰池）

`ruleset_coc.py`（Call of Cthulhu d100，掷低）已实现，可作为**可直接复制的模板**——它
只重写了 `check` / `rank_of` / `dc_for` / `modifier_for` / `actor_view` 等少量方法，复用同一张
融合角色卡，战斗仍走 `d20.battle`。

1. 在 `ruleset_xxx.py` 写 `class XxxRuleset(RulesetAdapter)`，实现上述接口；
2. 文件底部 `register_ruleset(XxxRuleset)`；
3. 在 `troupe/__init__.py` 导出该类；
4. **世界层代码一行不动**——`Simulator(ruleset="xxx", ...)` 即可切换。

> 已注册：`dnd5e` / `gurps` / `coc`（见 `available_rulesets()`）。三套规则集共用同一张
> 角色卡，仅把卡上存的「绝对有效等级」重新解释成各自的判定语义。

---

## 5. 世界模型（L2）

| 服务 | 挂点 | 职责 |
|------|------|------|
| `WorldService` | `ctx.world` | 地点图 / 通路 / 当前位置 / 天气 / 发现新地点（`discovery` 写 `log`） |
| `NpcService` | `ctx.npc` | NPC 名册 / 态度（disposition -2..+2）/ 结识（`npc.met`） |
| `FactionService` | `ctx.faction` | 派系声望（standing -100..+100）/ 每日按 power 推进（`time/day` 钩子） |
| `QuestService` | `ctx.quest` | 任务目标达成 / 线索揭露 / 完成发奖（`quest.update` / `clue`） |
| `ClockService` | `ctx.clock` | 进度时钟（danger/exploration/campaign/faction），填满触发后果（`clock.tick`） |
| `CalendarService` | `ctx.calendar` | 游戏内历法（日/时/分），跨日发 `time/day` 钩子，`time.advance` 写日志 |
| `LoreService` | `ctx.lore` | 已确立事实（`recall_or_establish`）——防命名类随机结果叙事矛盾 |

---

## 6. 叙事导演 + GM 模拟器（L3）

### 6.1 Oracle（GM 模拟器核心）

```python
ctx.oracle.fate(question, odds="五五开")   # 命运问答：是非问 → {text, yes, roll, ...}
ctx.oracle.check_scene()                    # 场景检查：d10 vs 混沌 → normal/altered/interrupted
ctx.oracle.random_event(kind, context)     # 随机事件：焦点 + 双词意义表
```

- **混沌因子 `1..9`**：全局「局势失控程度」。顺风顺水→下降，处处碰壁→上升。它同时决定
  后续场景更易被打断、问题更难得到肯定答复，形成自然的叙事起伏而不需要剧本。
- **概率模型**：`troupe/data_oracle.py` 中的 **logit 平移模型**（自研，非任何商业产品
  表格）。事件焦点 12 类（EVENT_FOCUS）+ ACTION_VERBS / NOUNS / DESCRIPTORS 双词启发。

### 6.2 Director（裁定 + 落地）

```
start_scene(spec)    起一幕，做场景检查，变故/打断即时触发额外节拍或随机事件
adjudicate(action)   把 Action 裁定为 Consequence（调用 ruleset.check，记 check 事件）
resolve(action)      = adjudicate + apply_consequence + note（对外一气呵成）
apply_consequence(con)  把 Consequence.effects 分发到各 Service —— 唯一集中写世界处
                      （``effects["clock"]`` 的键既可是具体时钟 id，也可是逻辑名
                      danger/exploration/campaign/faction，按 kind 解析到模组真实时钟）
inject_event(...)    掷随机事件并立刻翻译为世界变更
interpret_event(ev)  12 个 _ev_* 焦点翻译器（把焦点 + 意义词 → Consequence）
end_scene(outcome)   收幕，失控推高混沌、掌控压低混沌
```

名册：`bind(char, key)` / `roster()` / `party()` / `actor(name)`——导演持有当前在场角色，
`encounter` 与 `agent` 都通过它取阵容。

---

## 7. 遭遇模式（L4）— `EncounterService`

```
plan(counter)        按当前地点 danger 决定战斗概率，返回 SceneSpec
  └─ _plan_combat     用 ctx.tables.encounter(terrain, level) 抽编队
trigger(spec)        路由 combat / noncombat
noncombat(spec)      start_scene → 循环 [ agent.propose + director.resolve ] → end_scene
combat(party, foes, distance, max_rounds)
                     桥接 d20.battle：pc.battle_create → battle_run → battle_report
                     回写 total_xp / gold / loot，并 oracle.adjust_chaos(-1)
```

战斗**复用 v2.2 已充分验证的 `d20.battle`**（先攻 / 动作经济 / 伤害抗免 / 状态 /
死亡豁免 / 怪物 AI），不重造轮子。PC / 怪物 HP 由 BattleService 内部快照恢复，不污染
角色卡长期状态。

---

## 8. 智能体（L5）— `AgentService`

只**提议**（`propose` 返回 `Action`），不落地。内置策略：

```
Policy（基类）         _propose_exploration / _propose_social / _propose_travel / _propose_downtime
CautiousPolicy        保守：偏好交涉 / 休整，避开高危地点
AggressivePolicy      激进：偏好探索 / 战斗，主动推进
```

`propose(scene, actor_name, kind)` 按场景类型产出带 `CheckRequest` + `on_success` /
`on_fail` 后果声明的 `Action`。`set_policy(name)` 切换，`available_policies()` 列出可选策略。

> 设计红线：**agent 永远不直接改世界**。它只说「我想做 X，成功则 Y，失败则 Z」，由导演裁定并落地。

---

## 9. 持久化与确定性（L6）— `save`

```python
save_simulator(sim, path)   # state + rng 五域快照 + 各 Service.to_dict + 队伍完整角色 + 事件流
load_simulator(path)        # 重建 Simulator → 还原 state/rng/services/队伍 → 确定性续跑
migrate(data)               # 按 SCHEMA_VERSION 执行迁移链（当前为首个版本，占位）
```

**确定性保证**：

1. 随机源按域切分（`rules` / `world` / `oracle` / `ai` / `narrative`），各流独立、可快照
   （FNV-1a 派生种子 + pickle/base64 状态）。AI 多掷一次骰不会改变后续检定结果；叙事措辞
   改动不会破坏回归测试。
2. 存档记录 rng 五域状态 + 事件流 + 各 Service 快照 + 角色卡完整状态 → 同一存档精确续跑。
3. `migrate` 按 `SCHEMA_VERSION` 补齐缺失字段，避免「换版本就打不开旧战役」。

---

## 10. 战役模组（示例 + 注册表）

`CampaignModule` 只提供**初始种子**：

```python
from troupe.modules import register_module, available_modules, get_module

register_module(build_sample_module)        # 注册
mod = get_module("border_shrine")           # 取模组
```

`build_sample_module()`（`troupe/modules/sample.py`）示例「边陲镇古神祭」：5 地点 / 4 通路 /
4 NPC / 2 派系 / 1 任务（3 目标 + 2 线索）/ 2 时钟 / 3 线索。装入 `Simulator` 后，剧情走向
由导演 + 智能体 + 随机表即兴生成。

### 如何新增模组

1. 在 `troupe/modules/your_module.py` 写 `build_xxx_module() -> CampaignModule`；
2. 在 `troupe/modules/__init__.py` 调 `register_module(build_xxx_module)`；
3. `Simulator(module=get_module("your_id"), ...)` 载入。

---

## 11. 渲染（L7）— `render`

`render_campaign(sim, log_n)` 输出完整战役档案（时间 / 混沌 / XP / 世界地图 / 队伍面板 /
任务 / 派系 / 时钟 / 线索 / 战报）。另有 `render_status` / `render_world` / `render_party` /
`render_quests` / `render_factions` / `render_clocks` / `render_threads` / `render_log` /
`render_scene` 供 CLI 分屏查看。队伍面板通过 `ctx.ruleset.actor_view(char)` 取 hp/max_hp/
ac|defense/cls/level，规则无关。

---

## 12. CLI 入口 — `sim_cli.py`

```bash
python sim_cli.py --demo          # 直接跑示例战役（dnd5e + border_shrine）
python sim_cli.py                  # 交互 REPL
```

REPL 菜单：1 新建 / 2 载入 / 3 自动跑 / 4 单步 / 5 世界 / 6 队伍 / 7 任务 / 8 日志 /
9 存档 / 0 退出。新建用 `Character.random(level, seed)` 生成队伍。

---

## 13. 许可与数据合规

- **D&D 5e SRD v5.2.1**（CC-BY-4.0，dndbeyond.com/srd）：可商用、可搬运规则文本与数据。
- **GURPS Basic Set 4e**：仅取**结构性公开事实**（四属性 ST/DX/IQ/HT、3d6 掷低、100-150
  起始点、技能基于 DX/IQ、伤口倍率等），**不搬运受版权保护的逐格数据表**。
- **Oracle 概率模型**：`troupe/data_oracle.py` 的 logit 平移为**自研**，非 Mythic GME 等
  商业产品的表格照搬。

---

## 14. 端到端数据流（一次 `run`）

```
Simulator.run
  └─ plan_next → Encounter.plan → SceneSpec
     ├─ kind=combat → Encounter.combat
     │     └─ d20.battle（先攻→动作→伤害→死亡豁免）→ 回写 xp/gold/loot → chaos-1
     └─ kind=noncombat → Encounter.noncombat
           └─ Director.start_scene（场景检查）
              └─ loop:
                 Agent.propose(scene, actor, kind) → Action        # 只提议
                 Director.resolve(action)                            # 裁定 + 落地
                   ├─ adjudicate → ruleset.check → CheckResult
                   └─ apply_consequence → 各 Service 改状态 + log 记事件
              Director.end_scene(outcome) → 调整 chaos
  └─ 遇 _party_wiped → 结束（全员阵亡）
```

---

## 15. 测试与回归

- 既有 `d20` 测试 `tests/test_*.py`（484+ 项）零回归是硬约束；
- troupe 测试放在 `tests/test_troupe_*.py`，覆盖 encounter / agent / simulator / save /
  确定性回归；
- 冒烟脚本 `_smoke_troupe.py` 跑通「dnd5e 8 场 + 存档往返 + gurps 4 场」即视为架构可用。
