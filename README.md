# D&D-GURPS 变体角色构建器 v2.0

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
├── data_spells.py     # SRD 全谱法术名册（0–9 环，319 款，权威 API 转换）
├── data_magicitems.py # DMG 魔法物品（按 rarity 分级，361 件，权威 API 转换）
├── data_monsters.py   # SRD 怪物图鉴数据（334 种 + CR→XP 表，权威 API 转换）
└── data_conditions.py # SRD 15 条战斗条件规则数据

gui/app.py             # tkinter 图形界面
cli.py                 # 命令行界面
tests/                 # pytest 单元测试（184 项，含 Cordis 装配不变性 + 扩充子系统）
mvp_builder.py         # 向后兼容 shim → d20
mvp_gui.py             # 向后兼容 shim → gui.app
```

**核心模型**（`d20.core` 的 Python 版 mini-Cordis，零依赖）：

- `Context`：服务容器 + 事件总线（`emit` / `waterfall` / `serial` / `parallel`）+ effect 生命周期。
  服务以稳定 key 挂到 `ctx.<name>`，其他服务通过 `ctx.<service>` 互调。
- `Service`：能力单位，声明 `inject` 依赖；`mount` 前校验依赖已就绪（缺失即报错）。
- `composition.yml`：声明 16 个服务的 `id` / `service`（点分路径）/ `inject` 依赖。
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

## 浏览器扩展（TypeScript 移植，web/）

以 deepseek-harness 的 `web-cordis` 示例（浏览器界面 + Cordis 插件内存挂载/卸载）为参考，
把 `d20` 包**1:1 移植为 TypeScript** 并包装成 WebExtension（React 18 + Vite + 零依赖
mini-Cordis），见 `web/`：

- 引擎层（`web/src/engine/`）逐文件对应 `d20/`：core/data/16 个 Service/Character/loader/
  composition，逻辑 1:1；`d20Plugin(ctx, options)` 可把 D20 整体挂入任意遵循契约的宿主 Context。
- 插件面板复刻 web-cordis：16 个服务运行时热挂载/卸载，卸载被依赖服务后对应能力即报错
  （如卸载 feats 后 HP/先攻回落、卸载 slots 后施法宏报错）。
- 验证：`npm run build`（tsc 类型检查 + vite 打包）＋ `node smoke.cjs`（运行时检查：
  11 项盗贼基准逐值一致 CP=1/HP=65/AC=20/近战+11/远程+8/强韧+11/反射+10/意志+10，
  扩充子系统与 Python `tests/test_expansion.py` 逐值一致，并额外校验 16 服务挂载、
  ConditionService（15 条条件/惩罚聚合/auto_fail）、MonsterService（334 种怪物/CR→XP/stat block/DM 结算））。
- **SRD 内容同步**：`web/src/engine/` 现已 1:1 镜像 Python 端 SRD 扩充——新增
  `data_spells.ts`(319 法术) / `data_magicitems.ts`(361 物品) / `data_monsters.ts`(334 怪物+CR_XP) /
  `data_conditions.ts`(15 条件) 四个数据模块，以及 `condition.ts` / `monster.ts` 两个 Service，
  经 `composition.ts` 装配 + `Character` 门面委托 + `sheet` 渲染战斗条件行。四个数据模块由
  Python `d20` 对象经 JSON 直转生成（`gen_ts_data.py`），保证前端/后端 SRD 内容零漂移。
- 安装：`chrome://extensions` → 开发者模式 → 加载 `web/dist`。

## 规则内容（权威 SRD 数据 · 已联网拉取）

> 数据由 `pull_srd.py` 从 `dnd5eapi.co/api/2014` 拉取规范化 JSON，经 `gen_srd_from_api.py` 转换，
> 单一事实来源为 `d20/data_*.py`（再由 `gen_ts_data.py` 同步到 `web/src/engine/data_*.ts`）。

### D&D 三宝书（PHB/DMG/MM）
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

### 命令行
```bash
python cli.py
```

### 图形界面
```bash
python mvp_gui.py        # 或 python -m gui.app
```

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
3. **测试补齐**：pytest 单元测试覆盖全部模块（184 项全通过，含 Cordis 装配不变性测试 + SRD 内容测试）
