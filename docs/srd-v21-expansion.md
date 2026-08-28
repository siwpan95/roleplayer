# D20 v2.1 SRD 扩充方案 — 职业 / 装备 / 熟练 / 规则速查

> 状态：**已实施**（2026-08-28）。数据源：联网拉取 `dnd5eapi.co/api/2014` 权威 REST API
> + 灰机 wiki《龙与地下城 TRPG》双语名册。双端（Python / TypeScript）已同步并全绿。

## 0. 背景：v2.0 用了多少 SRD？

v2.0 已从 `dnd5eapi.co/api/2014` 拉取 4 类 SRD 内容（怪物 334 / 法术 319 /
魔法物品 361 / 条件 15）。但该 API 共 **24 个端点**，剩余 20 类从未使用，其中最大的缺口是：

**一个角色构建器居然没有「职业」**（12 职业 + 子职业 + 20 级成长 + 407 条特性全部未接入），
装备库也只有手写子集（41 件 vs SRD 237 件）。

## 1. 本次覆盖范围

| # | 类别 | API 端点 | 条目数 | 落地模块 |
|---|---|---|---|---|
| 1 | 职业 | `classes` | 12 | `d20/data_classes.py` |
| 2 | 职业等级 | `classes/{i}/levels/{n}` | 12×20 = 240 | 同上 `CLASS_LEVELS` |
| 3 | 子职业 | `subclasses` | 12 | 同上 `SUBCLASSES` |
| 4 | 特性 | `features` | 407（去重后 318 键） | 同上 `FEATURES` |
| 5 | 装备 | `equipment` | 237 | `d20/data_equipment_srd.py` |
| 6 | 武器属性 | `weapon-properties` | 11 | 同上 `WEAPON_PROPERTIES` |
| 7 | 熟练 | `proficiencies` | 117 | `d20/data_proficiencies.py` |
| 8 | 参考常量 | `ability-scores` / `alignments` / `damage-types` / `magic-schools` / `languages` / `skills` / `rules` / `rule-sections` | 6/9/13/8/16/18/6/33 | `d20/data_reference.py` |

拉取脚本 `pull_srd.py` 扩展为 22 类 + 嵌套等级，**零错误**落盘 `_srd_pull/`
（可复现：`python pull_srd.py`）。

## 2. 中文化方法论（沿用 v2.0 三层来源 + curated 覆盖层）

| 层 | 来源 | 覆盖 |
|---|---|---|
| ① | `_cn_src/hj_*namelist.json` —— 灰机 wiki 双语名册 | 职业 12/12、装备 160/237、子职业（经全名桥接）12/12 |
| ② | 脚本内规则派生（去复数 / 前缀复合 / 颜色+伤害类型 / 括号等级） | 特性 258 基名、熟练复数形式 |
| ③ | `EN2CN_*_CURATED` 手工校订（**优先级最高**） | 装备缺口 77 项、特性主体表、护甲名对齐既有装备库 |

结果：**全部 15 张表 100% 中文键**，英文原名保留在 `en`、官方描述保留在 `desc_en`。

对齐既有命名空间的额外处理：SRD 的 `Chain Mail` / `Plate Armor` 校订为
`锁子甲` / `全身板甲`，与 `d20.data.EQUIPMENT_LIBRARY` 同名，避免两套装备库命名割裂。

## 3. 设计决策（G–M）

| # | 决策点 | 结论 | 理由 |
|---|---|---|---|
| **G** | 职业等级定价 | bracket 递增标价：1 级 **0 CP**（创建期），2–5 级 3，6–10 级 4，11–15 级 5，16–20 级 6；累计 L5=12 / L10=32 / L15=57 / L20=87 CP | 与 `ATTR_COST_BRACKETS` 同构。D20 的 HP 走「活力」技能、法术位独立 CP 购买，职业等级只买「特性+熟练+施法能力+生命骰」，故刻意定得比同级属性投入低，避免挤占全部起始 CP（150） |
| **L** | 选择时机 | 创建期（`purchases == 0`），与种族/背景一致 | D&D 建卡流程即如此 |
| **H** | 职业熟练 | **三轨**：技能熟练→`proficiencies`（+2）；装备熟练→`gear_proficiencies`（豁免护甲技能要求）；豁免熟练→`save_proficiencies`（`save_bonus` +2） | 复用既有熟练机制，不引入第三套加成模型 |
| **I** | 施法者等级 | `full=等级` / `half=⌈等级/2⌉` / `pact=等级(环位封顶5)`；`slots.buy_slot` 前置改为「技能等级 **或** 职业等级满足其一」 | 让纯靠职业的施法者不必再买「奥术施法」技能 |
| **J** | 生命骰 | 短休掷骰改用职业生命骰（d6/d8/d10/d12），无职业回落 d6 | 补上 D&D 生命骰与 D20「活力」之间的桥 |
| **K** | 特性 | 中文键 + `en` + `desc_en`（官方英文原文） | 与 v2.0 怪物/法术同款约定 |
| **M** | SRD 装备 CP | `3×log10(金币+1)`，下限 1、上限 30 | 长剑 15gp→4CP（手工库 5）、全身板甲 1500gp→10CP（手工库 15）：量级对齐，对高价物品对数压缩，避免线性放大到不可购买 |

### 施法进程为何可信

「施法进程」不是硬编码，而是**从 20 级法术位分布反推**：
`spell_slots_level_1..9` 中非零环位集合为 `{1..9}` → `full`；`{1..5}` → `half`；
单环位且 ≥2 → `pact`；全零 → `none`。12 职业推导结果与 PHB 官方表逐项一致。

## 4. 服务与集成

新增 2 个 Service（`composition.yml` / `composition.ts` 各加一行，无人 inject）：

- **`ClassService`（`ctx.classes`）**：`set_class` / `level_up` / `level_to` /
  `set_subclass` / `hit_die` / `caster_level` / `max_ring` / `spell_slots` /
  `features` / `class_specific` / `prof_bonus` / `has_gear_prof` / `has_save_prof`。
- **`ReferenceService`（`ctx.reference`）**：规则速查（`rule` / `search_rules`）、
  装备检索（`gear` / `weapon` / `armor` / `gear_by_category`）、职业与特性查询、枚举翻译。

**可选增强语义**：所有依赖方（slots / rest / equipment / derived）一律以
`ctx.has("classes")` 探测，**未挂载时自动回落原行为**，不崩、不改既有数值。
这保持了 Cordis「卸载即失效」的演示价值（web 插件面板可热卸载 classes 后看到
HP 生命骰回落到 d6、重甲重新要求技能）。

装备服务新增 `resolve()` 统一解析器：手工库优先、回退 SRD 库，返回同构 7 元组，
因此护甲加值、敏捷上限、灵巧判定、伤害骰解析对两库一致生效。

## 5. 验证

| 端 | 命令 | 结果 |
|---|---|---|
| Python | `python -m pytest tests/ -q` | **225 passed**（184 → 225，新增 41 项，零回归） |
| Web 类型 | `npm run typecheck` / `npm run build` | 通过 |
| Web 冒烟 | `npm run smoke` | 通过（含 v2.1 新增 31 项断言） |
| Web 单测 | `npm test` | **19 passed**（10 → 19） |
| 端到端 | 法师/战士/游荡者建卡 | 职业、等级、特性、法术位、护甲熟练、生命骰均正确 |

新增测试文件：`tests/test_srd_v21.py`（数据契约 + Service 行为 + 集成 + 可选增强回落）。

## 6. 复现

```bash
python pull_srd.py        # 拉取 22 类 + 240 条等级 JSON -> _srd_pull/（零错误）
python gen_srd_v21.py     # 生成 d20/data_classes.py / data_equipment_srd.py /
                          #      data_proficiencies.py / data_reference.py
python gen_ts_data.py     # 同步 web/src/engine/data_*.ts（8 个模块）
```

## 7. 来源

- D&D 5e SRD 权威 REST API：https://www.dnd5eapi.co/api/2014/
- 灰机 wiki《龙与地下城 TRPG》双语名册：https://dnd.huijiwiki.com/wiki/Wikitext/Data:classnamelist.json
  （及 `subclassnamelist` / `itemnamelist` / `backgroundnamelist` / `racenamelist`）
