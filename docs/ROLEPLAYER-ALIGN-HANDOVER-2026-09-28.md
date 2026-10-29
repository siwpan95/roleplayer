# RolePlayer 远端对齐交接说明

- **日期**：2026-09-28
- **操作**：WorkBuddy 本地自动化同步（Agent 模式）
- **仓库**：`D:\projects\RolePlayer` ↔ `https://gitee.com/siwpan/roleplayer`
- **目标**：把此前无 remote 的本地 RolePlayer 接入 Gitee 远端，并将远端新增内容对齐到本地

---

## 1. 背景

本地 `RolePlayer` 此前是一个 git 仓库，但**未配置任何 remote**，无法与 Gitee 远端同步，因此在上轮"D:\projects 整体远端→本地对齐"任务中被跳过。本次补齐：接入远端并完成对齐。

## 2. 关系核对（对齐前）

| 项 | 值 |
|---|---|
| 本地 `master` HEAD | `faf6796`（feat: GUI 扩展职业/模拟对战面板）|
| 新增 remote | `origin` = `https://gitee.com/siwpan/roleplayer.git` |
| 远端默认分支 | `master`（标签 `v3.0.0`）|
| 共同祖先 (merge-base) | `faf6796`（即本地 HEAD 本身就是共同祖先）|
| 远端领先本地 | **13 提交** |
| 本地领先远端 | **0 提交** |

远端在其基础上新增的 13 个提交即 **v3.0.0 发布内容**：GURPS 自研扩充（61 法术 / 85 优缺点）、D&D 5.2(2024) SRD 增量、怪物增量（354→376）、构建前置修复（去本地化硬编码路径）、v3.0.0 发布材料（CHANGELOG 定稿 / README 安装包节 / installer.spec datas 修正）。

## 3. 本地工作树状态（对齐前）

本地存在大量**未提交**工作：

- 已修改已跟踪文件 **35 个**：`d20/*`（battle/character/combat/core/data/data_battle/derived/dice/loader/monster/perks/rest/sheet 等）、`gui/app.py`、`web/*`（README/index.html/package.json/public/composition.yml/public/manifest.json/src/engine/composition.ts/src/engine/data_battle.ts/src/ui/App.tsx）、`cli.py`、`installer.py`、`installer.spec`、`tests/*`、`README.md`、`.gitignore`、`composition.yml`
- 未跟踪新文件数十个：整套 `troupe/` 系统、`web/src/ui/CampaignPanel.tsx`、`web/src/ui/CampaignRunner.tsx`、`sim_cli.py`、`docs/troupe-architecture.md`、`docs/campaign_demo.html`、`docs/dungeon_demo.html`、`docs/HANDOVER.md`、`tests/test_troupe*`（约 30 个测试）、`docs/.workbuddy/` 等

## 4. 关键判定：本地 WIP 是否独立于远端

经逐文件核对，远端 v3.0.0 **已经包含**本地 WIP 的同名内容：

- 远端 `troupe/` = **46 文件**
- 远端含 `web/src/ui/CampaignPanel.tsx`、`sim_cli.py`、`docs/troupe-architecture.md`、`docs/HANDOVER.md`、`tests/test_troupe*`、`tests/test_p0_content.py`、`tests/test_p1_srd52.py`、`tests/test_p2_gurps.py` 等
- 本地已改的 35 个已跟踪文件与远端 13 提交触及文件**高度重叠**

**结论**：本地未提交改动基本是这份 v3.0.0 工作在另一台机器提交发布前的草稿态，**远端才是权威版本**。因此没有对本地 WIP 做 merge（会大面积冲突且冗余），而是先存档、再对齐。

## 5. 执行动作

1. `git checkout -b backup/roleplayer-local-wip` —— 建立备份分支
2. `git add -A && git commit` —— 将全部本地改动（已跟踪修改 + 未跟踪新文件）快照到该分支，commit `78de571`
3. `git checkout master` → `git reset --hard origin/master` —— `master` 硬对齐到远端 `4b8d4a6`（v3.0.0）
4. 重置后工作树已被远端版本覆盖，本地未提交草稿不再残留，工作树干净
5. `git branch --set-upstream-to=origin/master master` —— 设置上游跟踪，今后可直接 `git pull`

## 6. 当前状态

- `master` = `origin/master` = `4b8d4a6`（v3.0.0），behind/ahead = **0 / 0**，工作树干净
- 备份分支 `backup/roleplayer-local-wip`（commit `78de571`）保留对齐前全部本地工作
- 该备份分支**已推送到 Gitee 远端留档**：
  `https://gitee.com/siwpan/roleplayer/tree/backup/roleplayer-local-wip`
- 备注：`git status` 出现的 `LF will be replaced by CRLF` 仅为 git `autocrlf` 行尾规范化提示，**非实际改动**；工作树经 `git status --porcelain` 核验为空。

## 7. 如何取回本地 WIP（如需）

```bash
git checkout backup/roleplayer-local-wip
```

若要在 v3.0.0 基础上继续开发本地未合入的工作，建议在该分支上：

```bash
git rebase master      # 或 git merge master
```

冲突处逐文件解决。鉴于第 4 节的重叠分析，本地 WIP 与远端 v3.0.0 高度重合，取回价值有限，仅当发现远端未涵盖的独特改动时才需操作。

## 8. 后续建议

- 此后基于 `master`（= 已发布 v3.0.0）继续开发，避免再出现"无 remote 的孤岛仓库"。
- 远端新增内容后，直接 `git pull` 即可（已设上游跟踪）。
- 备份分支仅作安全快照，确认无需后可删除；删除前请确保本地 WIP 已合并或确认丢弃。
