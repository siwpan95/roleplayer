# Role Player 项目交接报告

> 撰写时间：2026-08-30　|　项目路径：`G:\repos\RolePlayer`（gitee `siwpan/roleplayer`，公开+MIT）
> 存档副本：`E:\RolePlayer`（原 `E:\D20`，本次会话更名；2026-08-30 起视为存档，不再推进）
> 当前版本：v3.0.0　|　测试：**665 passed, 1 skipped, 4 xfailed**（零回归）
> 适用对象：接手本项目继续开发的人（含下一个会话的我自己）

---

## 一、一句话定位

**Role Player 是一个纯 Python（零第三方依赖）+ TypeScript 前端的跑团模拟器**：
角色构建（点数制，D&D 5e / GURPS 4e / CoC 三规则集）→ GM 模拟（Oracle 混沌·命运·场景）
→ 遭遇调度（探索/交涉/旅行/休整/战斗）→ 任务与时钟驱动剧情 → 存档/续跑/重演 → 导出战报。
定位是 **solo / GM-less（AI 代 GM）模拟器**，不含真人 GM 接管与多人协作。

---

## 二、当前状态总览

| 项 | 值 |
|---|---|
| 目录 | `E:\RolePlayer`（包名 `d20` 保留为技术标识，产品名 Role Player） |
| 版本 | `__version__ = "3.0.0"`（installer `APP_VERSION` 同步，由版本一致性测试守住） |
| 服务 | d20 **19** 个 + troupe **18** 个（含本次新增的 `agency`），全部 Cordis 装配 |
| 规则集 | dnd5e（掷高）/ gurps（3d6 掷低）/ coc（d100） |
| 模组 | `border_shrine`（手写）+ `generated`（程序化，种子决定整张图） |
| 存档 | `SCHEMA_VERSION = "1.1"`，迁移链真实生效 |
| 测试 | 665 passed / 1 skipped / 4 xfailed |
| Web | `tsc --noEmit` + `vite build` 均通过（纯 vite，无测试框架） |

---

## 三、本次会话完成的工作（按时间顺序）

### 1. 跑团模拟器六项 P2/P3 落地（测试 572 → 617）

| 项 | 内容 |
|---|---|
| 法术/补给细节 | 旅行遭遇真正开戏（七成战斗/三成路遇）；D&D 戏法永久已知 + 每日备法（上限=等级+施法属性调整）；GURPS 休整恢复 FP；施法大失败走六种后果表 |
| 任务系统增强 | `Quest.depends_on` 依赖链（完成自动解锁、失败级联）、`deadline_minutes` 期限、`fail_condition`；**`clock/full` 后果由导演真实兑现**（danger→开战 / campaign→混沌+2 / faction→派系-1） |
| 存档迁移 + replay | 存档落盘事件流与动作序列；`migrate` 真实迁移链；新建 `troupe/replay.py`（档案浏览/战报导出/同种子确定性自检） |
| 程序化生成 + 意义表 | `modules/generator.py` 按种子生成地图/派系/NPC/任务链/时钟；意义表补「主体」「转折」两维 |
| 富文本 + Web 面板 | `troupe/export.py`（Markdown/HTML/JSON 三格式共用一份取数）；Web 新增「跑团战役档案」面板 |
| 地牢空间地图 | `troupe/spatial.py`：房间+走廊生成、BFS 连通、ASCII/HTML 渲染、随存档 |

### 2. 依赖声明审计修正（用户质疑 Web 面板依赖列表不合理）

用 AST 静态核对「每个服务的 `self.ctx.<svc>` 引用 vs `inject` 声明」，发现 **10 处漂移**并全部修复：

- **欠声明**：`combat` 用 `ctx.race.elemental()`（龙息宏）未声明 → 卸载 race 后崩溃；troupe 侧 `director`/`encounter`/`provisions`/`world`/`quest`/`faction`/`lore` 同病
- **冗余声明**：`rest`(dice)、`sheet`(feats/race)、`monster`(dice)
- **装饰性错误**：`battle` 的 `[dice, monster, condition]` 三个全不用（自身零依赖，实际经 `char.ctx` 访问角色级服务）
- **清单漂移**：`web/public/composition.yml` 缺 `sheet.condition` 与 v2.1/v2.2 三条
- 新增 `tests/test_composition_consistency.py` 把不变量锁死（AST 静态核对 + d20 四处清单一致）

### 3. 三项外围缺口补完（测试 617 → 647）

| 项 | 落点 |
|---|---|
| NPC 自主行动 | `troupe/npc_agency.py`：9+2 种行动按职业/条件分派，产生真实世界变化（线索/态度/派系声望/金币/移动/危险度），挂场景节拍 + 每日过夜 |
| Web 实时跑团 | `troupe/server.py` 零依赖 HTTP API（`/new` `/step` `/state` `/export`）+ Web `CampaignRunner` 面板 |
| 地牢空间地图 | `troupe/spatial.py`（`sim.explore_dungeon(seed)` 一键生成，`render_campaign` 已含地图面板） |

### 4. 项目更名 Role Player v3.0.0

目录 `E:\D20` → `E:\RolePlayer`；产品名（README/GUI 标题/CLI 横幅/Web 标题/manifest/安装器）统一；
版本 2.2.0 → 3.0.0；`D20.spec` → `RolePlayer.spec`；`D20-Setup` → `RolePlayer-Setup`；
卸载注册表键与安装目录同步；两个 spec 的硬编码 `E:/D20` 路径已修复。**包名 `d20` 保留**（全项目 import 不动）。

### 5. 三层决策抽取（借鉴 `G:\repos` 三仓后重写，测试 647 → 665）

模型：**条件层（该不该出现）→ 随机层（出现哪个）→ 降级层（永不为空）**

| 优先级 | 落点 |
|---|---|
| P0 | `tables.roll_smart()`：`condition` 硬过滤 → `seen` 排除 + `cooldown` 权重衰减 → 加权抽取 → 筛空逐级放宽兜底 |
| P1 | NPC 行为树 `_BTREE`（7 个条件键×优先级）+ `_ACTION_WEIGHTS` 随机层 + 职业表兜底；新增 `threaten`/`flee`；事件带 `via=condition/fallback` 溯源 |
| P2 | 导演兜底叙事改锚点查表（`troupe/data_narrative.py`，4 类结果模板池）；天气作为环境标签进检定修正 |

### 6. 内容填充阶段调研与规划（**已产出，未执行**）

见第五节。

---

## 四、关键技术决策与踩坑清单（接手前必读）

### 装配与依赖
- **`inject` 是硬契约，不是注释**：声明了不用（装饰性）会误导卸载传播；用了没声明（欠声明）会在卸载后运行时崩溃。
- **`ctx.mount` 校验类属性 `inject`，loader 拓扑排序看清单** —— 改依赖必须同步**七处**：`roleplayer/composition.yml`（3.0.1 起由项目根移入包内）、`roleplayer/loader.py` 兜底、服务类属性、`web/src/engine/composition.ts`、`web/public/composition.yml`、troupe `composition.yml`、`composition.py` 兜底。
- **`mount_troupe` 按清单顺序逐个挂载，无拓扑重排** —— 加依赖后必须手工重排：clock 在 faction/quest 前、director 在 provisions 前、agent 在 encounter 前。
- **循环依赖**：agent 原调 `encounter._avg_party_level()` 而 encounter 依赖 agent → 已把平均等级内联进 agent 破环。

### 确定性与状态
- 程序化生成（`modules/generator.py`、`spatial.py`）一律用**独立 `random.Random(seed)`**，不消耗模拟器分域 RNG，保证存档快照与重演确定性。
- **时钟满后标记 `consumed=True`，不清 `filled`** —— 「已满」是既成事实，任务的 `fail_condition="clock:<id>"` 要读它；防重复靠 `tick` 对满时钟直接 return。

### 改名相关
- Bash 的 `mv` 若在目标目录内 cwd 会 `Permission denied` → 用 **PowerShell `Rename-Item`**，且**先停占用进程**（vite preview 监听目录会阻止改名）。
- `from d20 import Character` **不会**把 `d20` 绑到本地命名空间 → 需要 `d20.__version__` 时另加 `import d20`。

### 测试与验证
- 服务端 `troupe/server.py` 的 `_SIM` 是**模块级单例**，跨测试共享 → 测试的 fixture 里必须 `S._SIM = None` 重置。
- dnd5e 掷高语义下 **target=DC 不变**，环境/天气修正落在 `total` 上 → 相关断言比较 **margin**（`total - target`）而非 `target`。
- 新增任何 `self.ctx.<svc>` 引用后跑 `tests/test_composition_consistency.py`，它会立刻抓出未声明的依赖。

### 许可边界（红线）
- **GURPS 全部内容不可搬运**：GURPS Lite 明文禁止并入其他产品，SJG FAQ 2.18 明确拒绝对 homebrew/电脑游戏授权 → GURPS 侧只能**自研 + 与公开结构性事实对齐**。
- **D&D 5e**：仅使用 SRD 5.1（CC BY 4.0）公开数据，不搬三宝书逐格文本。

---

## 五、下一步：内容填充阶段（规划已定，待拍板执行）

### 5.1 内容缺口盘点

| 类别 | 现状 | 判断 |
|---|---|---|
| D&D 法术/怪物/装备/魔法物品/熟练/职业 | 319 / 334 / 237 / 361 / 117 / 12（318 特性） | 充足 |
| **GURPS 法术** | **16 款** | **最薄**，三规则集里唯一不成体系 |
| troupe 词表（动/名/形容/主体/转折） | 40 / 40 / 30 / 18 / 11 | 够用偏薄 |
| NPC 角色/特质/诉求 | 16 / 16 / 10 | 偏薄 |
| 事件表（旅行/探索/路遇/社交/战斗转折/史诗） | 8 / 8 / 10 / 10 / 8 / 12 | 偏薄，跑 20 场开始重复 |
| 传闻 RUMORS | 9 条 | 明显不足 |
| **地牢内容** | 只有几何网格，**零房间描述** | 空壳 |
| 模组 | 2 个（1 手写 + 1 程序化） | 手写仅 1 个 |

### 5.2 授权调研结论（分级）

| 级别 | 内容源 | 授权 | 结论 |
|---|---|---|---|
| **A（首选）** | Ironsworn SRD + 全部 oracle 表 + asset 卡 | **CC BY 4.0**（明确覆盖商业用途） | ✅ 仅署名，solo 模拟器黄金内容 |
| A | Ironsworn: Delve 主题/域卡（地牢房间·危险·发现） | CC BY 4.0 | ✅ 正好填地牢空壳 |
| A | Dungeon World SRD（fronts、怪物动作、地名生成器） | CC BY 3.0 | ✅ fronts ≈ 时钟 + 派系阴谋 |
| A | Blades in the Dark SRD（派系、时钟、score） | CC BY 3.0 | ✅ 与 troupe 时钟/派系同构 |
| A | 5e SRD 5.2 / 5.2.1 | CC BY 4.0 | ✅ 增量补强 |
| **B** | OSE SRD、OSRIC、13th Age SRD | OGL 1.0a | ⚠️ 需附 OGL 第 15 节声明 |
| B | A5E SRD、Mythras、Chaosium BRP | ORC | ⚠️ 需 ORC 声明 |
| **C** | Basic Fantasy RPG 4E、Cairn | **CC BY-SA 4.0** | ❌ **避用**：SA 有传染性，本项目当前无 LICENSE |
| **D** | GURPS 全部内容（含 GURPS Lite） | 闭源 | ❌ **不能用**，只能自研 |

### 5.3 执行路线

| 优先级 | 内容 | 做法 | 规模目标 |
|---|---|---|---|
| **P0** | GM 叙事内容（价值最高/零 IP 风险） | 借 Ironsworn oracle 结构中文重写；Delve 域卡→地牢房间描述/危险/发现表；DW fronts→时钟与派系阴谋模板；传闻与 NPC 词表扩充 | 词表 ×2.5、传闻 9→40+、地牢房间类型 12+ |
| **P1** | D&D 5.2 增量 + 宝藏表 | 拉 SRD 5.2/5.2.1 与 5.1 的 diff；OSE/OSRIC（OGL）宝藏表 | 法术/怪物各 +30~60 |
| **P2** | GURPS 自研扩充 | 按 10+ 学院自研法术（对齐学院名/前置链/耗魔等结构性事实）；优缺点按肉体/精神/社会/超常四类自研 | 法术 16→60~80、优缺点 →80+ |
| **P3** | 模组与战役 | 手写模组 1→4~6；程序化模组增强任务链模板与 NPC 关系网 | 模组 2→6~7 |

**执行纪律**：借结构·中文重写（不照搬措辞）；每项配测试（表非空/加权合法/确定性）；
**新增 `docs/CONTENT-CREDITS.md`** 记录各来源授权与署名（CC BY 的法律义务）；每阶段全量零回归。

### 5.4 待拍板的四个问题

1. **项目许可**：引入 CC BY 内容必须署名。当前无 LICENSE —— 保持闭源 + 只加 CREDITS，还是补 MIT？
2. **GURPS 侧**：SJG 禁止搬运，P2 全靠自研。接受，还是把重心移到 D&D/GM 内容？
3. **体积**：web data chunk 已 1.5MB，内容翻倍会到 2~3MB。接受，还是做按需懒加载？
4. **顺序**：P0→P1→P2→P3 依次执行，还是先只做 P0 看效果？

---

## 六、常用命令

```bash
# 全量测试（唯一权威验证入口）
cd /e/RolePlayer && F:/Python314/python.exe -m pytest -q

# 跑团 CLI 演示
F:/Python314/python.exe sim_cli.py --demo

# 跑团 HTTP API（Web 实时跑团的后端，端口 8765）
F:/Python314/python.exe troupe/server.py

# Web：类型检查 / 构建 / 预览
cd /e/RolePlayer/web
F:/node/node.exe node_modules/typescript/bin/tsc --noEmit
F:/node/node.exe node_modules/vite/bin/vite.js build
F:/node/node.exe node_modules/vite/bin/vite.js preview --port 4173

# 打包（需 F:/Python314，自带 Tcl/Tk 9.0）
F:/Python314/python.exe -m PyInstaller RolePlayer.spec --noconfirm --clean
F:/Python314/python.exe -m PyInstaller installer.spec    --noconfirm --clean
```

> 注意：本机 npm 装大包不可靠，Web 构建一律用上面的 `node + node_modules 内二进制` 方式，不要 `npm install`。

---

## 七、本次会话新增/改动的关键文件

| 文件 | 说明 |
|---|---|
| `troupe/npc_agency.py` | 新增：NPC 自主行动（行为树条件层 + 职业表降级层） |
| `troupe/spatial.py` | 新增：地牢空间地图生成与渲染 |
| `troupe/server.py` | 新增：零依赖 HTTP API（Web 实时跑团后端） |
| `troupe/export.py` | 新增：Markdown / HTML / JSON 战役档案导出 |
| `troupe/replay.py` | 新增：战役重演（档案浏览 + 确定性自检） |
| `troupe/data_narrative.py` | 新增：叙事锚点查表（4 类结果模板池） |
| `troupe/modules/generator.py` | 新增：程序化战役生成（种子驱动） |
| `troupe/random_tables.py` | 改动：`roll_smart` 三层决策抽取 |
| `troupe/quest.py` / `clock.py` / `director.py` | 改动：任务依赖链、时钟后果兑现、锚点叙事、环境标签 |
| `troupe/save.py` / `log.py` / `contracts.py` | 改动：事件流+动作序列落盘、迁移链、SCHEMA 1.1 |
| `web/src/ui/CampaignPanel.tsx`、`CampaignRunner.tsx` | 新增：战役档案面板 + 实时跑团面板 |
| `tests/` | 新增 5 个测试文件（agency / server / spatial / tables / environment + consistency） |
| `RolePlayer.spec`（原 D20.spec）、`installer.spec`、`installer.py` | 改动：产品名、版本、安装路径、硬编码 ROOT |
| `docs/dungeon_demo.html`、`docs/campaign_demo.html`、`web/campaign.sample.json` | 演示产物 |

---

**交接状态**：架构层无悬空或占位，665 项测试零回归，Web 可构建、CLI 可跑、API 可联调。
下一步是**内容填充**（见第五节），四个待拍板问题确认后即可按 P0→P3 执行。
