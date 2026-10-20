# Changelog

本项目所有值得注意的变更都会记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [3.0.1] - 2026-10-20

**包名 `d20` → `roleplayer`** ｜ **PyPI 首发**：<https://pypi.org/project/roleplayer/3.0.1/>

### Changed

- **包名改为 `roleplayer`**：PyPI 上的 `d20` 已被他人占用，无法发布，故随首发改名。
  导入方式：`from d20 import Character` → **`from roleplayer import Character`**。
  共改写 106 个文件、375 处引用。
- `composition.yml` 由项目根移入 `roleplayer/` 包内：此前装进 site-packages 后会丢失，
  只能走 `loader.DEFAULT_SERVICE_ENTRIES` 兜底清单；现在随包分发，pip 安装后可读。
- 环境变量 `D20_MERGE_TROUPE` → `ROLEPLAYER_MERGE_TROUPE`（**旧名仍兼容读取**，
  已写在脚本里的配置不会失效）。

### Added

- `pyproject.toml`（此前完全没有打包文件）：`packages = ["roleplayer", "troupe"]` +
  `py-modules = ["cli"]` + 两份 `composition.yml` 作为 package-data + 控制台入口 `roleplayer`。
  刻意不用 `packages.find` —— 仓根还有 `data/ docs/ gui/ web/ tests/`，自动发现会把
  `web/node_modules` 误收进 wheel。
- PyPI / Python 版本 / License / Gitee 四个 shields 徽章。

### ⚠️ 刻意未改（不是遗漏）

- **骰子语境的 `d20`**：`d20/d100/d6` 检定、`d20+敏捷`、`D20 三豁免轴` 等指 20 面骰与 D20 规则体系，
  与包名无关，61 处全部保留。
- **存档格式标识 `d20-character`**：改了会让既有存档读不出来。
- **安装路径与卸载注册表键**：`%LOCALAPPDATA%\Programs\D20`、
  `HKCU\...\Uninstall\D20` —— 改名会让已安装用户的卸载项失效。
- **前端 `d20Plugin(ctx, options)`**：`web/` 下 TypeScript 侧的插件 API 名，不在 Python 包内。

### 验证

- `pytest tests -q`：**684 passed, 2 skipped, 4 xfailed**（改名前后一致）
- wheel 85 条目，顶层仅 `cli.py` / `roleplayer` / `troupe`，未混入 `web/` 与 `node_modules`
- 干净 venv 安装后零第三方依赖，中立目录 `Character()` 构建成功、`composition.yml` 可读

## [3.0.0] - 2026-08-31

### Added

- **项目更名 Role Player v3.0.0**（原 D20；包名 `d20` 保留为技术标识）。
- **跑团模拟器（troupe）全量**：GM 模拟（Oracle/导演/命运问答）、D&D 5e / GURPS 4e / CoC 三规则集、遭遇调度、任务依赖链与时钟、存档迁移与重演、NPC 自主行动、地牢空间地图、程序化战役生成、Web 实时跑团（零依赖 HTTP API）+ 战役档案面板。
- **GURPS 规则集完整化**：战斗引擎（主动防御/部位/伤口倍率/休克/击倒）、点数经济、法术系统（61 款，覆盖 18 学院）、玛那浓度、优缺点（85 项，四类自研）。
- **内容填充（P0）**：GM 叙事词表×2.5、传闻 49 条、事件/发现表扩充、地牢房间内容（14 类型/20 危险/20 发现）、战役阴谋模板 6 个（fronts）；来源署名见 `docs/CONTENT-CREDITS.md`。
- **D&D SRD 5.2（2024）增量（P1）**：法术 +26（345 款全含环位）、怪物 +42（376 种，含吸血鬼/三斯芬克斯/兽化人全谱），数据源 open5e `srd-2024`（官方 SRD 5.2，CC BY 4.0）。
- **手写战役模组 ×4**：边境神社（border_shrine）+ 镜湖客栈 / 盐路风云 / 白骨磨坊。

### Fixed

- 打包管线更名遗留的硬编码路径（spec / 数据管线脚本改相对路径）。
- `gen_ts_data.py` 的 E:/D20 路径漂移。
- GURPS 数据对齐官方结构性事实（法术学院/Magery 点值/玛那 5 档/译名，见 `docs/GURPS-核对报告-2026-08-30.md`）。

### Security

- 无密钥/令牌入库；第三方内容仅取 CC 授权来源并履行署名。

## [2.2.0] - 2026-08-28

### Added

- 模拟对战（回合制对战引擎 / DMG 遭遇构建 / 蒙特卡洛）、SRD 全量扩充（职业/装备/熟练/规则速查）、Windows 安装包（自写安装向导）。
