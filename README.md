# D&D-GURPS 变体角色构建器 v2.2

融合 **D&D 三宝书**（玩家手册 PHB / 地下城主指南 DMG / 怪物图鉴 MM）与
**GURPS Basic Set** 规则的点数制角色构建器。支持属性购买、优缺点、天赋、
技能、技术（战技/法术）、装备、战斗宏与多种掷骰检定。

## 架构（Cordis 化：Context / Service / 依赖注入 / 组合装配）

原 MVP 的单文件 `mvp_builder.py`（29KB）已拆分为模块化 `d20` 包，并参考 vendored 的
[Cordis](https://cordis.js.org)（deepseek-harness 内嵌的 TypeScript 插件元框架）思想，
将 9 个子系统改写为**服务（Service）**而非 mixin 多重继承：

```
d20/
├── __init__.py        # 包入口，导出 Character 与数据
├── core.py            # ★ mini-Cordis：Context / Service / 事件 / effect 生命周期
├── loader.py          # composition.yml 解析 + 按 inject 依赖拓扑排序挂载
├── data.py            # ★ 规则数据中枢（D&D+GURPS 融合，单一事实来源）
├── composition.yml    # ★ 子系统装配清单（纯 YAML 组合，cordis.yml 风格）
├── character.py       # Character 门面：委托方法 + 代理实例状态到 ctx.state
├── attributes.py      # AttributesService  属性购买（递增标价）
├── equipment.py       # EquipmentService   装备系统（武器/护甲/盾牌）
├── perks.py           # PerksService       优点/缺点/天赋
├── skills.py          # SkillsService      技能购买与默认值推算
├── techniques.py      # TechniquesService  技术（战技/法术）
├── derived.py         # DerivedService     HP/AC/攻击/豁免衍生数值
├── combat.py          # CombatService      战斗宏（D&D战技 + GURPS机动）
├── dice.py            # DiceService        d20/d100/d6/GURPS 3d6 检定
├── sheet.py           # SheetService       角色卡渲染
├── slots.py           # SpellSlotsService 法术位（独立 CP 购环位 + 上环施法）
├── feats.py           # FeatsService       专长（53 款 SRD 全量，事件钩子生效）
├── race.py            # RaceService        种族（9 族 GURPS 式模板定价）
├── background.py      # BackgroundService  背景（6 款，+2 熟练）
├── rest.py            # RestService        先攻/休整（current_hp 追踪）
├── condition.py       # ConditionService   战斗条件追踪（SRD 15 条 + 惩罚聚合）
├── monster.py         # MonsterService     怪物图鉴（SRD 334 种 + stat block + DM 结算）
├── classes.py         # ★ ClassService      职业系统（12 职业 + 等级 + 子职业，v2.1）
├── reference.py       # ★ ReferenceService  规则速查与 SRD 检索（v2.1）
├── battle.py          # ★ BattleService      模拟对战与遭遇构建（v2.2）
├── data_spells.py     # SRD 全谱法术名册（0–9 环，319 款，权威 API 转换）
├── data_magicitems.py # DMG 魔法物品（按 rarity 分级，361 件，权威 API 转换）
├── data_monsters.py   # SRD 怪物图鉴数据（334 种 + CR→XP 表，权威 API 转换）
├── data_conditions.py # SRD 15 条战斗条件规则数据
├── data_classes.py    # ★ SRD 职业系统数据（12 职业 + 240 条等级 + 12 子职业 + 407 特性）
├── data_equipment_srd.py # ★ SRD 装备库（237 件 + 11 条武器属性，v2.1）
├── data_proficiencies.py # ★ SRD 熟练项（117 项，v2.1）
├── data_reference.py  # ★ SRD 参考常量与规则速查（属性值/阵营/伤害类型/学派/语言/技能/规则章节）
└── data_battle.py     # ★ 对战规则常量（DMG 遭遇构建 + AI 启发式 + 伤害归一化，v2.2）

gui/app.py             # tkinter 图形界面
cli.py                 # 命令行界面
tests/                 # pytest 单元测试（255 项，含 Cordis 装配不变性 + v2.1 SRD + v2.2 模拟对战）
mvp_builder.py         # 向后兼容 shim → d20
mvp_gui.py             # 向后兼容 shim → gui.app
```

**核心模型**（`d20.core` 的 Python 版 mini-Cordis，零依赖）：

- `Context`：服务容器 + 事件总线（`emit` / `waterfall` / `serial` / `parallel`）+ effect 生命周期。
  服务以稳定 key 挂到 `ctx.<name>`，其他服务通过 `ctx.<service>` 互调。
- `Service`：能力单位，声明 `inject` 依赖；`mount` 前校验依赖已就绪（缺失即报错）。
- `composition.yml`：声明 19 个服务的 `id` / `service`（点分路径）/ `inject` 依赖。
  加载器按依赖拓扑排序后挂载，真正「显式装配、可插拔、无静态 MRO」。

`Character` 是**兼容门面**：公共方法委托给 `ctx.<service>.<method>`，实例状态字段
（`cp` / `attributes` / `skills` / …）通过 `__getattr__` / `__setattr__` 透明代理到
`ctx.state`，保证老 API（`char.SKILL_LIBRARY`、`char.equip_item()`、`char.cp`）100% 兼容。
要加一套新规则系统，只需写个 `Service` + 在 `composition.yml` 加一行，无需改动 `Character`。

**2026-08-27 扩充**（联网调研 D&D 5e SRD，决策 A–F）：
- 法术位：独立 CP 购买（单价=环位，SRD 各环上限 4/3/3/3/3/2/2/1/1、总量 22），
  前置「奥术施法」等级 ≥ 2×环位−1；法术宏消耗环位并支持上环施法。
- 专长：53 款 SRD 专长（全量搬运），8/12/15 CP 分档，带前置校验；效果经 waterfall/serial 事件钩子
  挂到计算链（卸载服务即失效）。
- 种族：9 族 GURPS 式模板定价（属性加值成本 + 优点折算），创建期选择。
- 背景：6 款，免费 +2 熟练加值（有效等级 +2），创建期选择。
- 先攻/休整：引入 current_hp，先攻 d20+敏捷+加成（waterfall），短休生命骰/长休全恢复。
- 事件钩子示范：`derived/max_hp`（强壮专长、丘陵矮人）、`derived/initiative`（警觉、木精灵）、
  `dice/d20_roll`（半身人幸运、幸运专长重掷）——纯增量挂载，不改核心公式。

**2026-08-28 扩充**（D&D 5e SRD 全量内容，新增 2 个 Service + 4 个数据模块）：

> **数据来源更正**：本扩充的 SRD 数据现已由 `pull_srd.py` 从权威 REST API
> `https://www.dnd5eapi.co/api/2014/`（D&D 5e SRD 官方开放接口）拉取全部怪物 / 法术 / 魔法物品 /
> 条件的规范化 JSON（共 334 怪物 / 319 法术 / 362 魔法物品 / 15 条件，零错误），再经 `gen_srd_from_api.py`
> 转换为 `d20/data_*.py` 的字典结构（枚举字段译中、CR 数值推导为 CR 字符串 + XP）。**并非手工撰写**。
> 条目名现已**全量中文化**：334 怪物 + 319 法术均转为中文键（100% 覆盖，零英文键残留），原始 SRD 英文名保留在每条记录的 `en` 字段便于按英文名查表/外部集成；中文键由脚本内 `EN2CN_MON` / `EN2CN_SPELL` + 新增缺口补全层 `EN2CN_MON_GAP` / `EN2CN_SPELL_GAP` 提供：
> - **来源（三层）**：① [huijiwiki 龙与地下城TRPG](https://dnd.huijiwiki.com) 的《法术列表》与《怪物图鉴 2025》双语对照（238 怪物 / 298 法术）；
>   ② [dndlogs.com 怪物清单](https://dndlogs.com) 的 2014-MM 中英对照，补齐野兽 / NPC / 幼龙 / 兽化人 / 吸血鬼形态 / 虫群等剩余 96 怪物；
>   ③ 与权威源同源体系的**标准 D&D 5e 中文译名**派生（幼龙 = 颜色+龙幼龙、兽化人/吸血鬼形态 = 基础译名+形态后缀、特定虫群 = X群），非臆造。
>   并以脚本内手工校订子集（curated）为**权威覆盖层**——curated 优先级最高，杜绝错译。
> - **覆盖**：334 怪物 **334** 个、319 法术 **319** 个已转为中文键（100%）。
>   怪物层对 2025 怪物手册的复数/更名条目做了 norm 归一匹配到 SRD 2014 原名（如 `Goblins→哥布林` 走 curated 覆盖）。
> - **复现**：`python gen_srd_from_api.py` 重新生成 `d20/data_*.py`；`python gen_ts_data.py` 同步 `web/src/engine/data_*.ts`。`_cn_src/` 保留双语原始抓取页作溯源。
- **战斗条件** `ConditionService`（`ctx.condition`，注入 `[]`）：内置 SRD 15 条官方战斗条件
  （目盲/魅惑/耳聋/惊惧/擒抱/失能/隐形/麻痹/石化/中毒/倒地/束缚/震慑/昏迷/力竭）。支持按名
  施加/解除/清空、活跃查询、`auto_fail` 维度判定（如麻痹→力量/敏捷豁免自动失败），以及对
  攻击/豁免/检定的「劣势≈-2」平坦惩罚聚合（供 combat/sheet 统一扣减）；角色卡新增「战斗条件」
  行并标注净惩罚。
- **怪物图鉴** `MonsterService`（`ctx.monster`，注入 `[dice]`）：内置 SRD 怪物 **334 种**（全量）
  （红龙幼/成/古三阶、哥布林/兽人/强盗/骑士/吸血鬼/巨魔/石巨人/火巨人/夺心魔/眼魔/元素四系/
  恶魔/魔鬼/巫妖等），含 size/type/六维/AC/HP/速度/豁免/技能/抗力/免疫/状态免疫/senses/CR/traits/
  actions/传奇动作等完整字段；提供 stat block 渲染、`by_cr` 抽取、`quick_encounter` 编组，以及
  基于攻击/伤害骰的 `roll_attack` DM 掷骰结算。怪物为「外部战斗单位」，不污染玩家 `CharacterState`。
- **法术名册** `data_spells.py`：**SRD 全谱法术 319 款**（0–9 环，戏法=0），真实施法时间/射程/成分/
  持续/豁免/伤害骰/类型；并入主 `SPELL_RINGS`（in-place update，法术位系统可直接消费）。
- **魔法物品** `data_magicitems.py`：**DMG 魔法物品 361 件**（全量），按 rarity 分级（普通/非普通/稀有/
  极稀有/传说/神器），含 attunement 与描述。
- **装配**：`composition.yml` 追加 `condition`（inject: []）/ `monster`（inject: [dice]）两服务，
  `Character` 门面新增对应委托方法（`add_condition` / `active_conditions` / `condition_penalty` /
  `monster_stat_block` / `monster_roll_attack` / `monster_by_cr` 等），`CharacterState.conditions`
  字段与 `_mount_defaults` 兜底装配同步。
- 测试：`tests/test_srd_content.py` 覆盖条件/怪物/法术/魔法物品的数据契约与 Service 行为；
  全量 184 项 pytest 通过、盗贼基准零回归。

**2026-08-28 v2.1 扩充**（联网检索 D&D 5e SRD 剩余 20 个端点，新增 2 个 Service + 4 个数据模块）：

> **缺口**：v2.0 只用了 `dnd5eapi.co/api/2014` 的 24 个端点中的 4 类。最大的洞是——
> **一个角色构建器居然没有「职业」**。本次把这 20 类一次性补齐。
>
> **数据来源**：`pull_srd.py` 扩展为 22 类 + 嵌套等级，从 `dnd5eapi.co/api/2014` 拉取
> **12 职业 / 240 条职业等级（12×20）/ 12 子职业 / 407 条特性 / 237 件装备 / 39 个装备分类 /
> 117 项熟练 / 18 项技能 / 16 种语言 / 13 种伤害类型 / 8 个魔法学派 / 6 项属性值 / 9 种阵营 /
> 11 条武器属性 / 6 部规则 + 33 个规则章节 / 38 条种族特性 / 4 个亚种 / 9 个种族**，
> 共 **1100+ 份规范化 JSON**、**零错误**落盘 `_srd_pull/` 作可验证溯源证据。
> 再经 `gen_srd_v21.py` 转换为 `d20/data_*.py`。**并非手工撰写**。
>
> **中文化（100% 中文键 + `en` 保留英文原名 + `desc_en` 保留官方描述）**：沿用 v2.0 的
> 「三层来源 + curated 覆盖层」方法论——① `_cn_src/hj_*namelist.json` 灰机 wiki 双语名册
> （职业 12/12、装备 160/237、子职业经全名桥接 12/12）；② 脚本内规则派生（去复数 /
> `Eldritch Invocation: X` 类前缀复合 / 龙族「颜色+伤害类型」/ 括号等级）；
> ③ `EN2CN_*_CURATED` 手工校订层优先级最高（补齐装备缺口 77 项、特性主体表 258 基名，
> 并将 SRD 的 `Chain Mail`/`Plate Armor` 对齐既有装备库译名 `锁子甲`/`全身板甲`）。

- **职业系统** `ClassService`（`ctx.classes`，inject `[]`）：**12 职业全量**
  （野蛮人 d12 / 吟游诗人·牧师·德鲁伊·武僧·游荡者·魔契师 d8 / 战士·圣武士·游侠 d10 / 术士·法师 d6），
  含生命骰、关键属性、豁免熟练、技能自选池、武器护甲熟练、施法能力。
  **施法进程（full/half/pact/none）由 20 级法术位分布反推而非硬编码**，12 职业与 PHB 官方表逐项一致。
  提供 `set_class` / `level_up` / `level_to` / `set_subclass` / `hit_die` / `caster_level` /
  `max_ring` / `spell_slots` / `features` / `class_specific` / `prof_bonus` 等。
  职业等级 **1 级免费（创建期）+ bracket 递增标价**（2–5 级 3CP、6–10 级 4、11–15 级 5、16–20 级 6；
  累计 L5=12 / L10=32 / L20=87 CP）——刻意低于同级属性投入，避免挤占 150 起始 CP。
- **等级成长表** `CLASS_LEVELS`：12 职业 × 1–20 级，每级含特性清单、熟练加值、
  法术位表（SRD 权威）、`class_specific` 职业专属数值（狂暴次数 / **偷袭骰 1d6→10d6** /
  气点 / 武艺骰 / 无甲移动…）。
- **子职业** `SUBCLASSES`：SRD 12 款（狂战士道途 / 逸闻学院 / 生命领域 / 大地结社 / 勇士 /
  散打宗 / 奉献之誓 / 猎人 / 盗贼 / 龙族血脉 / 邪魔宗主 / 塑能学派），3 级起可选。
- **特性库** `FEATURES`：407 条职业特性（去重后 318 键），含所属职业/子职业/等级与官方描述。
- **装备库** `SRD_EQUIPMENT`：SRD **237 件**全量（武器伤害骰+双手骰+武器属性、护甲 AC+
  力量需求+隐匿劣势、冒险装备/工具/乐器/坐骑/载具…），与手工库 41 件经 `equipment.resolve()`
  统一为同构 7 元组，**护甲加值/敏捷上限/灵巧判定/伤害骰解析对两库一致生效**；
  CP 按 `3×log10(金币+1)` 折算（1–30 封顶）。
- **熟练库** `PROFICIENCIES`：117 项（18 技能熟练与 `SKILL_LIBRARY` 同一命名空间、
  6 项豁免→D20 三豁免轴、武器/护甲/工具/乐器/赌具/载具）。
- **规则速查** `ReferenceService`（`ctx.reference`，inject `[]`）：33 个规则章节正文检索、
  装备/武器/护甲/特性/职业/枚举翻译的只读查询（DM 侧工具）。
- **参考常量** `data_reference.py`：属性值 6 / 阵营 9 / 伤害类型 13 / 魔法学派 8 /
  语言 16 / 技能 18 / 规则 6 + 规则章节 33。
- **集成（决策 H–J）**：职业熟练三轨生效——技能熟练→`proficiencies`(+2)、
  装备熟练→`gear_proficiencies`（战士「全部护甲」可免技能穿全身板甲）、
  豁免熟练→`save_proficiencies`（豁免 +2）；
  法术位前置改为「奥术施法技能 **或** 职业等级满足其一」；短休生命骰改用职业生命骰。
  所有依赖方以 `ctx.has("classes")` 探测，**卸载 classes 即回落原行为**（不崩、不改既有数值）。
- CLI 新增 `10.职业` / `11.规则速查` 两个入口；角色卡新增职业/等级/子职业/生命骰/
  熟练加值/职业特性/职业法术位/装备熟练/豁免熟练行。
- 测试：`tests/test_srd_v21.py`（41 项）覆盖数据契约、施法进程与官方表一致、
  定价曲线、Service 行为、集成与「卸载即回落」；全量 **225 项 pytest 通过、盗贼基准零回归**。
- 方案与决策记录见 `docs/srd-v21-expansion.md`。

**2026-08-28 v2.2 扩充**（联网调研 D&D 5e 遭遇构建与怪物 AI，新增 1 个 Service + 1 个数据模块）：

> **缺口**：v2.0/v2.1 的战斗停留在「单次战斗宏」——没有回合、没有先攻、没有胜负闭环。
> 本次补上**完整回合制模拟对战**，把战斗从「掷一次骰」升级为「跑一场架」。
>
> **规则来源（联网检索 + 本地权威交叉核对）**：
> ① DMG 2014 第 3 章遭遇构建（每角色 XP 阈值表 1–20 级 × 四档难度、遭遇倍数
> 1/1.5/2/2.5/3/4、队伍规模上下浮动、每日冒险 XP 预算）；
> ② 本地 `_srd_pull/rule_sections/` 的 SRD 官方战斗规则原文（The Order of Combat /
> Actions in Combat / Making an Attack / Damage and Healing / Cover / Movement and Position）；
> ③ 联网调研的 5e 怪物 AI 实践（目标选择「最近优先 + WIS≥12 重伤优先」、动作优先级
> 「解状态 > 特殊能力 > 远程 > 近战」、按 INT 做抗力/免疫适配、集火与「悠悠球治疗」）。

- **对战引擎** `BattleService`（`ctx.battle`，inject `[dice, monster, condition]`）：
  - **先攻与回合**：d20+敏捷调整，平手比骰面再比敏捷；回合 = 动作 + 移动 + 附赠（反应/传奇）；
  - **动作经济**：攻击 / **多攻击**（解析 stat block 的 Multiattack 文本）/ 疾行 / 施法 /
    特殊能力（含 **Recharge 5-6 充能**与 **DC N 豁免**解析）；
  - **伤害结算**：暴击双倍、抗力减半、免疫无效、易伤加倍；伤害类型经
    `normalize_damage_type` 归一（怪物库中英混用/简称亦正确判定）；
  - **状态**：从 stat block 英文原文解析「DC 豁免 + 状态」，命中后按豁免判定，
    状态真实影响攻防（倒地=近战优势/远程劣势、目盲=攻击劣势、麻痹=被攻优势…）；
  - **死亡**：怪物 0 HP 即死；PC 0 HP 濒死 + 每回合死亡豁免（3 成稳定/3 败死亡/20 回 1 HP）；
  - **怪物 AI**：最近优先（WIS≥12 重伤优先）、规避抗免（INT≥10）、期望伤害最优（INT≥18）；
  - **PC AI**：集火最低 HP 敌人、濒死同伴悠悠球治疗、施法者会放魔法飞弹/火焰箭；
  - **传奇动作**：每轮每个传奇怪物回合外额外行动一次；
  - **结构化结算单一真相**：`combat.resolve_attack()` 同时供战斗宏渲染与对战引擎消费，
    命中/伤害公式只有一份（近战/远程宏已重构为基于它渲染，输出与旧版一致）。
- **遭遇构建（DMG 2014）**：`evaluate`（XP 阈值+遭遇倍数+队伍规模 → 难度评估）、
  `build_encounter`（按目标难度贪心编组并裁剪归档）、`xp_budget`。验证例：
  4×L1 vs 哥布林×4 = 200×2 = 400 = **致命**；L3×4 中等 → 单只石化蜥蜴（700 XP）。
- **蒙特卡洛**：`simulate(trials)` 统计胜率/平均回合/平均剩余 HP，模拟前后自动
  快照/恢复 PC 的 HP、法术位与条件（不污染玩家状态）。校准例（3 级双人队）：
  哥布林×2（简单）胜率 97%、兽人×2（中等）91%、哥布林×4（困难）45%——与 DMG 档位一致。
- **CLI**：新增 `12.模拟对战`（遭遇评估 / 按难度构建 / 单场对战 / 蒙特卡洛）。
- 测试：`tests/test_battle.py`（30 项）覆盖遭遇构建常量与 DMG 一致、动作文本解析、
  对战流程/多攻击/传奇、伤害抗免与状态、死亡豁免、蒙特卡洛状态恢复；
  全量 **255 项 pytest 通过、盗贼基准零回归**。
- 方案与决策记录见 `docs/srd-v22-battle.md`。

## 浏览器扩展（TypeScript 移植，web/）

以 deepseek-harness 的 `web-cordis` 示例（浏览器界面 + Cordis 插件内存挂载/卸载）为参考，
把 `d20` 包**1:1 移植为 TypeScript** 并包装成 WebExtension（React 18 + Vite + 零依赖
mini-Cordis），见 `web/`：

- 引擎层（`web/src/engine/`）逐文件对应 `d20/`：core/data/19 个 Service/Character/loader/
  composition，逻辑 1:1；`d20Plugin(ctx, options)` 可把 D20 整体挂入任意遵循契约的宿主 Context。
- 插件面板复刻 web-cordis：19 个服务运行时热挂载/卸载，卸载被依赖服务后对应能力即报错
  （如卸载 feats 后 HP/先攻回落、卸载 slots 后施法宏报错）；classes/reference 为可选增强，
  卸载后依赖方自动回落原行为。
- 验证：`npm run build`（tsc 类型检查 + vite 打包）＋ `node smoke.cjs`（运行时检查：
  11 项盗贼基准逐值一致 CP=1/HP=65/AC=20/近战+11/远程+8/强韧+11/反射+10/意志+10，
  扩充子系统与 Python `tests/test_expansion.py` 逐值一致，并额外校验 18 服务挂载、
  ConditionService（15 条条件/惩罚聚合/auto_fail）、MonsterService（334 种怪物/CR→XP/stat block/DM 结算），
  以及 v2.1 的 31 项断言（12 职业/12 子职业/318 特性/237 装备/117 熟练/240 条等级记录、
  法师 d6·full、游荡者 5 级偷袭 3d6、职业定价 L5=12CP、施法者等级与最高环位、
  职业装备熟练穿重甲、豁免熟练 +2、生命骰随职业、规则速查、卸载 classes 后回落）。
- 单元测试：`npm test`（Node 内置 `node:test`，零新依赖，规避本机 npm 大包安装不可靠）
  跑 `web/test/engine.test.cjs`，覆盖骰子纯函数/属性调整/战斗条件叠加/怪物图鉴/盗贼基准/
  19 服务挂载 + v2.1 数据契约与 ClassService/ReferenceService 行为 + v2.2 对战（遭遇评估/模拟/蒙特卡洛/抗免判定），共 25 项全过；
  构建前由 `test:build` 复用 `tsconfig.smoke.json` 产出 `dist-smoke`。
- CI 门禁：根 `.github/workflows/ci.yml` 固化 Python(pytest) + web(typecheck/build/smoke/unit)
  双 job，push/PR 即触发。
- 代码分割：`vite.config.ts` 经 `manualChunks` 把 bundle 拆为 `data`(静态 SRD 数据集)/
  `vendor-react`/`engine`/`ui` 多 chunk，主逻辑 chunk 由单 1.2MB 降为 popup 0.8KB +
  engine 50KB + ui 11KB + vendor-react 142KB（data 1.02MB 为 gzip 221KB 的静态数据）。
- **SRD 内容同步**：`web/src/engine/` 现已 1:1 镜像 Python 端 SRD 扩充——八个数据模块
  `data_spells.ts`(319 法术) / `data_magicitems.ts`(361 物品) / `data_monsters.ts`(334 怪物+CR_XP) /
  `data_conditions.ts`(15 条件) / `data_classes.ts`(12 职业+240 等级+12 子职业+318 特性) /
  `data_equipment_srd.ts`(237 装备+11 武器属性) / `data_proficiencies.ts`(117 熟练) /
  `data_reference.ts`(属性值/阵营/伤害类型/学派/语言/技能/规则)，以及 `condition.ts` /
  `monster.ts` / `classes.ts` / `reference.ts` 四个 Service，经 `composition.ts` 装配 +
  `Character` 门面委托 + `sheet` 渲染战斗条件行与职业行。八个数据模块全部由
  Python `d20` 对象经 JSON 直转生成（`gen_ts_data.py`），保证前端/后端 SRD 内容零漂移。
- 安装：`chrome://extensions` → 开发者模式 → 加载 `web/dist`。

## 规则内容（权威 SRD 数据 · 已联网拉取）

> 数据由 `pull_srd.py` 从 `dnd5eapi.co/api/2014` 拉取规范化 JSON，经 `gen_srd_from_api.py` 转换，
> 单一事实来源为 `d20/data_*.py`（再由 `gen_ts_data.py` 同步到 `web/src/engine/data_*.ts`）。

### D&D 三宝书（PHB/DMG/MM）
- **完整回合制模拟对战**：先攻/回合轮转/动作经济（多攻击·疾行·施法·充能·豁免）/
  状态与死亡豁免/传奇动作/怪物 AI 与 PC AI/胜负与 XP 结算
- **DMG 2014 遭遇构建**：每角色 XP 阈值×四档难度、遭遇倍数与队伍规模调整、
  难度评估、按预算编组、蒙特卡洛胜率统计
- **12 个 SRD 职业全量 + 20 级成长**：生命骰、关键属性、豁免/武器/护甲熟练、
  技能自选池、施法进程（full/half/pact/none，由官方 20 级法术位反推）、
  每级特性与法术位表、职业专属数值（狂暴次数/偷袭骰/气点/武艺骰）
- **12 款子职业**（狂战士道途/逸闻学院/生命领域/大地结社/勇士/散打宗/奉献之誓/
  猎人/盗贼/龙族血脉/邪魔宗主/塑能学派）+ **407 条职业特性**
- **237 件 SRD 装备**（武器伤害骰/双手骰/武器属性、护甲 AC/力量需求/隐匿劣势、
  冒险装备/工具/乐器/坐骑/载具）+ **117 项熟练**
- **规则速查**：6 部规则 + 33 个规则章节正文；伤害类型 13 / 魔法学派 8 / 语言 16 /
  阵营 9 / 属性值 6 / 武器属性 11
- **18 项标准技能**：杂技/运动/察觉/洞察/驯兽/医疗/生存/奥术知识/历史/调查/
  自然知识/宗教/欺瞒/恐吓/表演/说服 + 变体根基科
- **53 款 SRD 专长**（全量搬运）、**9 族 SRD 种族**模板、**6 款背景**
- **319 款 SRD 法术**（0–9 环全谱，含火球术 8d6、魔法飞弹、治疗言灵等，并入法术位系统）
- **361 件 DMG 魔法物品**（普通/非普通/稀有/极稀有/传说/神器分级）
- **334 种 SRD 怪物**（红龙幼/成/古三阶、哥布林/兽人/吸血鬼/巨魔/眼魔/巫妖等）+ CR→XP 表
- **15 条 SRD 战斗条件**（目盲/魅惑/麻痹/震慑/昏迷等）含惩罚聚合与自动失败维度
- **偷袭要害打击**：精准伤害骰随等级成长（1d6→10d6，D&D Sneak Attack 进阶表），
  需灵巧/远程武器 + 措手不及/优势条件
- **火球术**：3 环法术 **8d6** 火焰伤害（D&D 官方伤害骰）
- **装备库**：D&D 5e SRD 武器伤害骰（长剑1d8/巨剑2d6/巨斧1d12/刺剑1d8…）
  与护甲 AC 公式（轻甲+敏捷无上限、中甲+敏捷上限2、重甲固定AC）
- **灵巧武器**集合：匕首/短剑/刺剑/弯刀/鞭子/飞镖/手弩（可触发偷袭）

### GURPS Basic Set
- **4 属性 + 递增标价**思想：低分段便宜、高分段陡升
- **技能难度分级**：E(Easy)/A(Average)/H(Hard)/VH(Very Hard)，按相对属性等级查表
- **同目/同纲默认值**推算（未学技能的临时等级）
- **技术（Technique）买除惩罚**：欺诈攻击(-2攻/-1防)、连环打击(双攻各-6)
- **战斗机动**：全力强击(+2伤,无防御)、精准突击(+4命中,无防御)
- **优缺点点值**：战斗反射15、双手灵巧5、过度自信-5、坏视力-25 等
- **缺点上限**：通常为起始 CP 的一半（默认 75）
- **3d6 roll-low 检定**：≤技能等级即成功，3/4暴击、17/18大失败

## 快速开始

```python
from d20 import Character

c = Character()                       # 150 CP 起始
c.set_attribute("力量", 16)            # 递增标价购买
c.purchase_skill("近战攻击", 12)       # 技能购买
c.add_talent("重击战士", 2)            # 天赋（对相关技能组+2）
c.purchase_technique("偷袭要害打击")   # 学战技
c.equip_item("长剑")                   # 装备
print(c.show_sheet())                 # 渲染角色卡
print(c.combat_macro("melee_attack", target_ac=12))  # 战斗宏
print(c.gurps_check("近战攻击"))       # GURPS 3d6 检定
```

**职业（v2.1）**：角色构建的传统主轴——选职业、升级、拿特性与施法能力。

```python
from d20 import Character

c = Character()
c.set_class("法师", choices=["奥术知识", "历史"])   # 创建期选择，1 级免费
c.level_to(5)                     # 升至 5 级，共 12 CP（bracket 递增标价）
c.set_subclass("塑能学派")         # 3 级起可选子职业
c.hit_die(), c.prof_bonus()      # (6, 3) —— 生命骰 d6 / 熟练加值 +3
c.caster_level(), c.max_spell_ring()   # (5, 3) —— 施法者等级 5 / 最高 3 环
c.buy_slot(3)                    # 凭职业等级即可购 3 环法术位（无需奥术施法技能）
c.class_features()               # ['施法：法师', '奥术回复', '奥术传承', '属性提升']
c.class_feature_detail("奥术回复")  # 官方特性描述

# 规则速查（DM 侧）
c.rule("休息")                    # 规则章节正文
c.search_rules("short rest")      # 关键词检索
c.gear_info("长剑")["damage"]      # '1d8'
```

**模拟对战（v2.2）**：完整回合制对战 + DMG 遭遇构建 + 蒙特卡洛。

```python
from d20 import Character

c = Character()
c.battle_create([c], ["哥布林", ("兽人", 2)])   # 当前角色 vs 3 个敌人
result = c.battle_run()               # 跑完全场：先攻→回合→胜负
print(c.battle_report())              # 战况 + 战斗日志 + XP
print(result["winner"], result["rounds"], result["total_xp"])

c.battle_evaluate([3, 3, 3, 3], ["石化蜥蜴"])     # 难度评估（DMG 2014）
c.battle_build([3, 3, 3, 3], "medium")            # 按难度编组怪物
c.battle_simulate([c], ["哥布林", "哥布林"], trials=200)  # 蒙特卡洛胜率
```

### 命令行
```bash
python cli.py
```

### 图形界面
```bash
python mvp_gui.py        # 或 python -m gui.app
```

### Windows 安装包
项目提供自包含安装包 `dist/D20-Setup-2.0.0.exe`（单文件，无需 Python 环境即可安装运行）：

- **打包 GUI 应用**：`F:/Python314/python.exe -m PyInstaller D20.spec --noconfirm --clean`
  入口 `gui/app.py`，已注入 Tcl/Tk 9.0 运行时（`runtime_hook_tk.py` + `_tcllib/`）以修复 PyInstaller 对 Tk 9.0 的收集盲点。
  重新打包前需先解压 `F:/Python314/tcl/libtcl9.0.4.zip`、`libtk9.0.4.zip` 到
  `_tcllib/tcl/tcl_library`、`_tcllib/tk/tk_library`（`_tcllib/` 已被 .gitignore 排除）。
- **构建安装包**：`F:/Python314/python.exe -m PyInstaller installer.spec --noconfirm --clean`
  产出 `dist/D20-Setup-2.0.0.exe`，内嵌完整 D20 程序目录，双击即装。
- **安装行为**：默认安装到 `%LOCALAPPDATA%\Programs\D20`（免 UAC），并在桌面与开始菜单创建快捷方式，
  同时写入 `HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\D20` 卸载项。
- **卸载**：开始菜单「卸载 D20」，或 `D20-Setup-2.0.0.exe --uninstall`。
- 注：本机网络无法访问 Inno Setup 官方源（GitHub 被墙），安装包改用纯标准库自写安装向导
  （`installer.py`，ctypes 直调 `IShellLink` 创建快捷方式），零第三方依赖。

### 运行测试
```bash
python -m pytest tests/ -v
```

## 战斗宏一览

| 宏 | 来源 | 说明 |
|---|---|---|
| `melee_attack` | D&D | 普通近战，d20+攻击加值 vs AC |
| `sneak_attack` | D&D | 偷袭，精准伤害骰随等级成长（需灵巧武器） |
| `power_attack` | D&D | 猛力攻击：命中-1/伤害+2（双手+3） |
| `whirlwind` | D&D | 旋风切割：对周围所有敌人各一次攻击 |
| `fireball` | D&D | 火球术：3环 8d6 火焰范围伤害 |
| `magic_missile` | D&D | 魔法飞弹：自动命中3发，每发1d4+1 |
| `healing_word` | D&D | 治疗言灵：1d4+施法调整恢复 |
| `deceptive_attack` | GURPS | 欺诈攻击：自攻-2/敌防-1（不可使技能低于10） |
| `rapid_strike` | GURPS | 连环打击：一回合两次攻击各-6 |
| `allout_strong` | GURPS | 全力强击：伤害+2，本回合无法防御 |
| `allout_determined` | GURPS | 精准突击：命中+4，本回合无法防御 |

## 项目结构由来

本项目由原 MVP（`mvp_builder.py` + `mvp_gui.py` 两文件）重构而来：
1. **Cordis 化重构**：按职责拆为 9 个 Service + Context/事件生命周期 + data 数据中枢，
   由 `composition.yml` 装配；`Character` 退化为兼容门面（不再多重继承 mixin）
2. **内容增强**：联网检索 D&D 三宝书与 GURPS Basic Set，扩充技能/技术/装备/优缺点
3. **测试补齐**：pytest 单元测试覆盖全部模块（255 项全通过，含 Cordis 装配不变性测试 +
   SRD 内容测试 + v2.1 职业/装备/熟练/参考测试 + v2.2 模拟对战测试）
4. **v2.1 SRD 全量扩充**：联网拉取 `dnd5eapi.co/api/2014` 剩余 20 个端点（1100+ JSON，零错误），
   新增职业/子职业/等级成长/特性/装备/熟练/规则速查，双端同步（详见 `docs/srd-v21-expansion.md`）
5. **v2.2 模拟对战**：回合制完整对战引擎 + DMG 2014 遭遇构建 + 怪物/PC AI + 蒙特卡洛，
   双端同步（详见 `docs/srd-v22-battle.md`）
