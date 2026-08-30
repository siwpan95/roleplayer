# GURPS 4e 结构性事实核对报告

> 用途：校准自研 TRPG 模拟器 GURPS 数据表。只陈述核实到的结构性公开事实（数值/分类/学院名/公式），不搬运规则书成段文本。
> 核对方：规则核对子代理　时间：2026-08-30
> 判定符号：✅ 一致 / ✗ 不符 / ⚠️ 存疑或需澄清

## 参考来源（可达性）
- ✅ 可达：trow.cc 论坛 GURPS 4e 完整中译（优势列表/劣势列表/魔法/战斗/受伤/技能/译名表）；GitHub `sp1r/gurps4`（俄译 GURPS 4e 规则 RST，英文学院名/法术名/成本齐全）；gurps4.readthedocs.io。
- ❌ 被墙（connect timeout）：gurps.fandom.com、rpg.fandom.com、web.archive.org、blogspot、dragonsfoot、breeze.hostux.net。这些只能靠 web_search 摘要佐证。
- 因此「全书 GURPS Magic 特有法术」（Fear/Shatter/Invisibility/Ice Dagger 等）的精确耗能/前置标注 ⚠️，其学院与属性为可靠事实。

---

## A. 优点表（12 项）

| 项目现值 | 核实（官方英文名 / 点数 / 通用中文译名） | 判定 | 来源 |
|---|---|---|---|
| 警觉 5 | 4e **无 Alertness**（3e 概念）。等价物：**Perception (Per)** 感知，次要属性 **5 点/级**；或 **Acute Vision** 敏锐视觉 **2 点/级**（仅视觉感知检定） | ⚠️ | [trow 优势列表](https://trow.cc/board/showtopic=9117)、[技能概述](https://trow.cc/board/showtopic=26463)、[gh advantages.rst](https://github.com/sp1r/gurps4/blob/master/docs/source/advantages.rst) |
| 夜视 1 | **Night Vision** 夜视，**1 点/级**（最高 9 级） | ✅ | [trow 优势列表](https://trow.cc/board/showtopic=9117)（71页） |
| 绝对方向感 5 | **Absolute Direction** 完美方向感/绝对方向感，**5 点**（3D Spatial Sense 三维空间感 10 点） | ✅ | [trow 优势列表](https://trow.cc/board/showtopic=9117)（34页） |
| 快速治疗 5 | **Rapid Healing** 快速医疗/快速治疗，**5 点**（Very Rapid Healing 高级快速医疗 15 点） | ✅ | [trow 优势列表](https://trow.cc/board/showtopic=9117)（79页） |
| 天生攻击（爪）0 | **Claws** 利爪，**可变**：Blunt Claws 钝爪 **3** / Sharp Claws 尖爪 **5** / Talons 钩爪 **8** | ✗ | [trow 优势列表](https://trow.cc/board/showtopic=9117)（42页，标"变动"）；档位 B42（fandom 被墙，档位为高置信待二次核对） |
| 战斗反射 15 | **Combat Reflexes** 战斗反射/镇定自若，**15 点** | ✅ | [trow 优势列表](https://trow.cc/board/showtopic=9117)（43页）、[gh advantages.rst](https://github.com/sp1r/gurps4/blob/master/docs/source/advantages.rst) |
| 高阶武艺 25 | 二选一需澄清：**Trained By A Master** 名师之徒 **30**；或 **Weapon Master** 武器大师 **20/25/30/35/40**（单武器/小类/中类/大类/全部徒手·肌肉动力） | ⚠️ | [trow 优势列表](https://trow.cc/board/showtopic=9117)（93/99页） |
| 强韧 10 | 译名模糊，候选：**High Pain Threshold** 高痛阈 **10**；**Hard to Kill** 顽强生命 **2/级**；**Fit** 健康 5 / **Very Fit** 高度健康 15 | ⚠️ | [trow 优势列表](https://trow.cc/board/showtopic=9117)（55/58/59页） |
| 意志坚定 5 | **Will** 意志力，次要属性 **5 点/级**（3e Strong Will 已并入 Will） | ✅(若指 Will+1) | [技能概述](https://trow.cc/board/showtopic=26463) |
| 语言天赋 5 | **Language Talent** 语言天才/语言天赋，**10 点**（非 5） | ✗ | [trow 优势列表](https://trow.cc/board/showtopic=9117)（65页）、[gh advantages.rst](https://github.com/sp1r/gurps4/blob/master/docs/source/advantages.rst) |
| 财富（小康）10 | **Wealth (Comfortable)** 财富·小康，**10 点**（档：Dead Broke -25 / Poor -15 / Struggling -10 / Average 0 / Comfortable 10 / Wealthy 20 / Very Wealthy 30 / Filthy Rich 50 / Multimillionaire 75） | ✅ | [trow 优势列表](https://trow.cc/board/showtopic=9117)（25页） |
| 魔力 5 | **Magery** 魔法天赋，**Magery 0 = 5 点**；Magery 1+ = **10 点/级** | ✅(若指 Magery 0) | [trow 优势列表](https://trow.cc/board/showtopic=9117)（66页）、[gh advantages.rst](https://github.com/sp1r/gurps4/blob/master/docs/source/advantages.rst) |

## B. 缺点表（11 项，负值）

| 项目现值 | 核实（英文名 / 点数 / 中文译名） | 判定 | 来源 |
|---|---|---|---|
| 贪财 -5 | **Greed** 贪婪，**-15※**（自控检定） | ✗ | [trow 劣势列表](https://trow.cc/board/showtopic=9115)（137页） |
| 冲动 -10 | **Impulsiveness** 鲁莽/冲动，**-10※** | ✅ | [trow 劣势列表](https://trow.cc/board/showtopic=9115)（139页，trow 译"鲁莽"） |
| 鲁莽 -10 | 若指 Impulsiveness = **-10**；若指 **Overconfidence** 自负 = **-5※**（项目"冲动/鲁莽"疑似重复） | ⚠️ | [trow 劣势列表](https://trow.cc/board/showtopic=9115)（139/148页） |
| 独行 -5 | **Loner** 孤独，**-5※** | ✅ | [trow 劣势列表](https://trow.cc/board/showtopic=9115)（142页） |
| 惧高 -10 | **Phobia (Acrophobia)** 恐惧症·恐高，**-10**（严重级/自控 12-） | ✅ | [trow 劣势列表](https://trow.cc/board/showtopic=9115)（148页，标"变动※"）；Acrophobia 标准 -10 |
| 酗酒 -5 | **Alcoholism** 酗酒，**-15 或 -20** | ✗ | [trow 劣势列表](https://trow.cc/board/showtopic=9115)（122页） |
| 守财奴 -5 | **Miserliness** 吝啬，**-10※** | ✗ | [trow 劣势列表](https://trow.cc/board/showtopic=9115)（144页） |
| 话痨 -5 | 候选：**Chummy** 亲密 -5；**Gregarious** 合群 -10；**Compulsive Behavior** 强迫症 -5 到 -15※ | ⚠️ | [trow 劣势列表](https://trow.cc/board/showtopic=9115)（126/128页） |
| 残疾（一目）-15 | **One Eye** 独眼，**-15**（失明 Blindness -50） | ✅ | [trow 劣势列表](https://trow.cc/board/showtopic=9115)（147页） |
| 宿敌 -5 | **Enemy** 敌人，**可变**（按敌人强度/出现频率）；**-5 为最低档**（约 25% 强度、9- 出现） | ✅(最低档) | B135；[trow 劣势列表](https://trow.cc/board/showtopic=9115)（"变动"） |
| 义务（少量）-5 | **Duty** 责任，**可变**：-2（极少 6-）/ -5（偶尔 9-）/ -10（经常 12-）/ -15（几乎总是 15-），+ 极端危险加成 | ⚠️ | [trow 劣势列表](https://trow.cc/board/showtopic=9115)（133页，"变动"）；档位 B133 |

## C. 16 款法术

**关键规则（4e）**：GURPS 4e 所有法术都是 **IQ 基础技能**（IQ/Hard 或 IQ/Very Hard），**没有 HT 基础的法术**（3e 的 Body Control=HT 在 4e 已废除）。
来源（双重确认）：[trow 第五章魔法（一）](https://trow.cc/board/showtopic=8775)「大多数法术的关键属性是智力…IQ/Hard…少数 IQ/Very Hard」；[trow 法术列表前补](https://trow.cc/board/showtopic=8857)「（VH）表示 IQ/Very Hard 的法术；其它都是 IQ/Hard」。

**来源质量提示**：[gh spells.rst](https://github.com/sp1r/gurps4/blob/master/docs/source/spells.rst)（俄译本）对 **Magery 前置有系统性抬档**——它把 Fireball 标 Magery 2、Deflect Energy 标 Magery 2，而 trow 中译（译自英文原版）均标「魔法天赋1」。故凡俄译本给出的 Magery 等级，均应以 trow 中译 / 英文原版为准；本表 Magery 栏已按 trow 中译修正。

| 项目（名/学院/属性/耗能/前置） | 核实 | 判定 | 来源 |
|---|---|---|---|
| 点火 Ignite Fire 火 IQ 1 无 | **Fire** 火，无前置，耗 **1-4**（1 火柴/2 火炬/3 喷灯/4 镁），维持同耗 | ✅(耗能为区间) | [gh spells.rst](https://github.com/sp1r/gurps4/blob/master/docs/source/spells.rst) |
| 创造火 Create Fire 火 IQ 2 点火 | **Fire**，前置 Ignite Fire，耗 **2**（维持减半） | ✅ | [gh spells.rst](https://github.com/sp1r/gurps4/blob/master/docs/source/spells.rst) |
| 火球 Fireball 火 IQ 3 创造火 | **Fire**，**Missile**，前置 **Magery 1 + Create Fire + Shape Fire**，耗 **1d/能量点**（每秒≤Magery，3 秒） | ✗(前置/耗能；学院·属性✅) | [trow 魔法（三）](https://trow.cc/board/showtopic=8778)「需求：魔法天赋1，召火术，火焰塑形」 |
| 闪电箭 Lightning 闪电 IQ 2 无 | **Air 风**（GURPS 无"闪电"学院），**Missile**，前置 **Magery 1 + 6 风系**，耗 **1d-1/能量点** | ✗(学院/前置/耗能) | [gh spells.rst](https://github.com/sp1r/gurps4/blob/master/docs/source/spells.rst) |
| 寒冰箭 Ice Dagger 水 IQ 2 无 | 学院 **Water 水** ✅；但 Basic Set 无 "Ice Dagger"，仅有 **Icy Weapon**（前置 Create Water，耗 3 维持 1）。全书 GURPS Magic 才有 Ice Dagger（Missile，耗 1-3，1d-1 穿刺/点） | ⚠️ | [gh spells.rst](https://github.com/sp1r/gurps4/blob/master/docs/source/spells.rst)（Icy Weapon）；全书待核对 |
| 眩晕 Daze 身体控制 HT 2 无 | **Mind Control 心智控制**（非身体控制），**IQ**，前置 **Foolishness**，耗 **3**（维持 2），施法 2 秒 | ✗(学院/属性/耗能/前置) | [gh spells.rst](https://github.com/sp1r/gurps4/blob/master/docs/source/spells.rst) |
| 昏睡 Sleep 身体控制 HT 3 眩晕 | **Mind Control 心智控制**，**IQ**，前置 Daze，耗 **4**，施法 3 秒 | ✗(学院/属性/耗能) | [gh spells.rst](https://github.com/sp1r/gurps4/blob/master/docs/source/spells.rst) |
| 恐惧 Fear 心智 IQ 3 无 | **Mind Control 心智控制**，**IQ**，全书法术（非 Basic Set），耗约 1（目标做 Fright Check） | ⚠️ | GURPS Magic 全书（被墙，待核对） |
| 催眠 Hypnotism 心智 IQ 1 无 | **非法术**——GURPS 中 Hypnotism 是**技能**（IQ/Hard） | ✗ | [技能概述](https://trow.cc/board/showtopic=26463) |
| 护盾术 Shield 防护 IQ 2 无 | **Protection & Warning 防护与警告**，前置 **Magery 2**，耗 **2×DB**（最大 DB 4=8），维持减半 | ✗(前置/耗能) | [gh spells.rst](https://github.com/sp1r/gurps4/blob/master/docs/source/spells.rst) |
| 治愈术 Cure 治疗 HT 3 无 | "Cure"非标准名。**Healing 治疗**，**IQ**。实为 **Minor Healing**（前置 Lend Vitality，耗 1-3，回等量 HP）或 **Major Healing**（前置 Magery 1 + Minor Healing，耗 1-4，回 2×HP） | ✗(名称/属性/前置) | [gh spells.rst](https://github.com/sp1r/gurps4/blob/master/docs/source/spells.rst) |
| 粉碎 Shatter 制造与破坏 IQ 3 无 | **Making & Breaking 制造与破坏**，**IQ**，全书法术，耗按材质/重量可变，前置 Weaken 等 | ⚠️ | GURPS Magic 全书（被墙） |
| 隐形术 Invisibility 幻术 IQ 4 无 | **Illusion & Creation 幻术与创造**，**IQ**，全书法术，耗 **5**（维持 3），前置 Simple Illusion/Blur 等 | ⚠️(耗能 4→5) | GURPS Magic 全书（被墙） |
| 光亮术 Light 光 IQ 1 无 | **Light & Darkness 光与暗**，无前置，耗 **1**（维持 1） | ✅ | [gh spells.rst](https://github.com/sp1r/gurps4/blob/master/docs/source/spells.rst) |
| 侦测魔法 Seek Magic 通讯 IQ 2 无 | "Seek Magic"非标准名；实为 **Detect Magic**，**Knowledge 知识**（非通讯），前置 **Magery 1**，耗 **2**，施法 5 秒 | ✗(名称/学院/前置) | [gh spells.rst](https://github.com/sp1r/gurps4/blob/master/docs/source/spells.rst) |
| 虚弱术 Weakness 死灵 IQ 3 无 | "Weakness"非标准名；Basic Set 死灵学院无此名（有 Death Vision/Zombie 等）。可能指 Weaken（制造与破坏）或 Steal Vitality（死灵） | ⚠️ | [gh spells.rst](https://github.com/sp1r/gurps4/blob/master/docs/source/spells.rst) |

**学院名对照（GURPS 4e 24 学院，供校准）**：Air 风 / Animal 动物 / Body Control 身体控制(躯体操控) / Communication and Empathy 通讯与共情 / Earth 土 / Enchantment 附魔 / Fire 火 / Food 食物 / Gate 门 / Healing 治疗 / Illusion and Creation 幻术与创造 / Knowledge 知识 / Light and Darkness 光与暗 / Making and Breaking 制造与破坏 / Meta-Spells 元法术 / Mind Control 心智控制 / Movement 移动 / Necromantic 死灵 / Plant 植物 / Protection and Warning 防护与警告 / Sound 声音 / Technological 科技 / Water 水 / Weather 天气。

## D. 技能成本表

- 四难度：**Easy 简单(E) / Average 普通(A) / Hard 困难(H) / Very Hard 极难(VH)**。
- 相对属性偏移（1 点买到的基础等级）：**E=+0 / A=-1 / H=-2 / VH=-3**。
- 成本阶梯：**1 点=基础，2 点=基础+1，4 点=基础+2，之后每 +1 级再 +4 点**（即 1/2/4/+4），**四档一致**。
- 判定：项目问「-0/-1/-2/-3 偏移」与「1/2/4/+4 阶梯各档一致」→ **✅ 正确**。
- 来源：[trow 技能概述](https://trow.cc/board/showtopic=26463)（四难度）、[gh skills.rst](https://github.com/sp1r/gurps4/blob/master/docs/source/skills.rst)（成本表 1/2/4/+4，Lite 版三档）。

## E. 法力位阶 Mana Levels

5 档：**No Mana 无玛那 / Low Mana 低玛那 / Normal Mana 普通玛那 / High Mana 高玛那 / Very High Mana 极高玛那**。✅（项目问 none/low/normal/high/very high 一致）
| 档位 | 中文 | 对施法的限制 |
|---|---|---|
| No Mana | 无玛那 | 无人能施法；魔法物品失效 |
| Low Mana | 低玛那 | 仅法师可施法，法术技能 **-5**；必然失败效果减半或无效 |
| Normal Mana | 普通玛那 | 仅法师可施法，正常 |
| High Mana | 高玛那 | **任何人（掌握法术者）均可施法** |
| Very High Mana | 极高玛那 | 任何人可施法；法师耗 FP 后下一轮回复；所有失败视为必然失败，真必然失败引发灾难 |
来源：[trow 第五章魔法（一）](https://trow.cc/board/showtopic=8775)「玛那」段。

## F. 战斗条件修正

| 状态 | 核实修正 | 判定 | 来源 |
|---|---|---|---|
| 震慑 Stun（晕眩） | 主动防御 **-4**，无法后退，须"不做行动"，每轮末 HT 检定恢复 | ✅ | [第十一章战斗](https://trow.cc/board/showtopic=6931)、[第十四章受伤](https://trow.cc/board/showtopic=12011) |
| 震慑 Shock（受伤冲击，与 Stun 区分） | 下轮 DX/IQ/技能 **-1/每损失 HP，最大 -4**（HP≥20 则 -1/每 HP/10） | ✅(注意区分) | [第十四章受伤](https://trow.cc/board/showtopic=12011) |
| 倒地 Prone（俯卧/仰卧） | 近战攻击 **-4**，主动防御 **-3**（B551 姿势表） | ⚠️(待二次核对) | B548/B551（fandom 被墙） |
| 目盲 Blind | 攻击 **-10**（看不见目标；能听到则 -6）；无法远程瞄准；对看不见的攻击难以主动防御 | ✅(-10) | B124/B547（fandom 被墙，公开事实） |
| 击倒检定 Knockdown | 重大创伤（单次伤害 > **HP/2**）须 **HT 检定**，失败即**倒地+晕眩**；失败 ≥5 则昏厥；肢体重创则肢体残废 | ✅ | [第十四章受伤](https://trow.cc/board/showtopic=12011) |
| 死亡检定 | HP≤0 起每轮 HT 检定否则昏迷；**-1×HP 起 HT 检定否则死亡**；-5×HP 必死 | ✅ | [第十四章受伤](https://trow.cc/board/showtopic=12011) |

## G. 译名对照（trow 官方译名 + 通俗别名）

| 英文 | 官方译名（trow） | 通俗别名 |
|---|---|---|
| Strength (ST) | 力量 | — |
| Dexterity (DX) | 灵巧 | 敏捷 |
| Intelligence (IQ) | 心智 | 智力 |
| Health (HT) | 健康 | 体质 |
| Fatigue Points (FP) | 体力值 | 疲乏点数 |
| Hit Points (HP) | 生命值 | — |
| Basic Speed | 基本速度 | — |
| Basic Move | 基本移动 | — |
| Dodge | 闪躲 | 闪避 |
| Parry | 招架 | — |
| Block | 阻挡 | 格挡 |
| Magery | 魔法天赋 | 魔力 |
| thrust (thr) | 突刺 | — |
| swing (sw) | 挥砍 | — |
来源：[trow 参考译名列表](https://trow.cc/board/showtopic=8797)、[技能概述](https://trow.cc/board/showtopic=26463)、[第十一章战斗](https://trow.cc/board/showtopic=6931)。

---

## 需要修正的数据清单（按优先级）

**优点**
1. 天生攻击（爪）`0` → Claws 利爪：钝爪 3 / 尖爪 5 / 钩爪 8（非 0）。
2. 语言天赋 `5` → Language Talent **10**。
3. 高阶武艺 `25` → 明确为 Trained By A Master **30** 或 Weapon Master **20/25/30/35/40**。
4. 强韧 `10` → 明确为 High Pain Threshold **10** 或 Hard to Kill **2/级**。
5. 警觉 `5` → 4e 无 Alertness，改 Perception **5/级**（或 Acute Vision 2/级）。
6. 意志坚定 `5` → Will **5/级**（3e Strong Will 已废）。

**缺点**
1. 贪财 `-5` → Greed **-15**。
2. 酗酒 `-5` → Alcoholism **-15 或 -20**。
3. 守财奴 `-5` → Miserliness **-10**。
4. 冲动/鲁莽 重复，且「鲁莽=Overconfidence」应 -5（trow 译 Impulsiveness 为"鲁莽"）。
5. 义务(少量) `-5` → Duty 可变（-2/-5/-10/-15）。
6. 宿敌 `-5` → Enemy 可变（-5 为最低档）。
7. 话痨 `-5` → 明确 Chummy -5 / Gregarious -10 / Compulsive Behavior。

**法术（重点）**
1. **全部「身体控制 HT」「治疗 HT」→ 改为 IQ**（4e 法术均 IQ 基础，无 HT）。
2. 眩晕 Daze：身体控制→**心智控制**；耗 2→**3**；前置 无→**Foolishness**。
3. 昏睡 Sleep：身体控制→**心智控制**；耗 3→**4**。
4. 闪电箭 Lightning：学院"闪电"→**风 Air**；前置→**Magery 1 + 6 风系**；耗能→**可变 1d-1/点**。
5. 火球 Fireball：前置→**Magery 1 + Create Fire + Shape Fire**；耗 3→**可变 1d/点**。
6. 护盾术 Shield：前置 无→**Magery 2**；耗 2→**2×DB**。
7. 侦测魔法 Seek Magic → **Detect Magic**，学院 通讯→**知识 Knowledge**，前置→**Magery 1**。
8. 治愈术 Cure → **Minor Healing / Major Healing**（名称非标准），属性 HT→**IQ**。
9. 催眠 Hypnotism → **是技能，非法术**。
10. 虚弱术 Weakness → 名称非标准，无法唯一对应（Weaken 制造与破坏 / Steal Vitality 死灵）。
11. 寒冰箭 Ice Dagger → Basic Set 无此名（可能指 Icy Weapon：前置 Create Water，耗 3）。
12. 恐惧 Fear / 粉碎 Shatter / 隐形术 Invisibility → 不在 Basic Set，属 GURPS Magic 全书（隐形术耗 4→**5**）。

## 译名建议表（见 G 节）

核心建议：属性四维用 **ST 力量 / DX 灵巧 / IQ 心智 / HT 健康**；次要 **FP 体力值 / HP 生命值 / Per 感知 / Will 意志力**；防御 **Dodge 闪躲 / Parry 招架 / Block 阻挡**；伤害模式 **thrust 突刺 / swing 挥砍**。

---

## 补充核实（第二轮，抓取 trow 专区原文后）

**新增抓取线程**：章节索引 [11708](https://trow.cc/board/showtopic=11708)、法术列表前补 [8857](https://trow.cc/board/showtopic=8857)、第五章魔法（二）[8776](https://trow.cc/board/showtopic=8776)、第五章魔法（三）[8778](https://trow.cc/board/showtopic=8778)、参考译名列表第 2 页 [8797](https://trow.cc/board/showtopic=8797)。

**1. 关键修正（影响全局）**：
- **Fireball 火球术前置 = Magery 1**（trow 原文「需求：魔法天赋1，召火术，火焰塑形」）。俄译本误标 Magery 2。
- **Deflect Energy 能量偏转 = Magery 1**（trow 原文「需求：魔法天赋1和火焰塑形」）。俄译本同样误标 Magery 2。
- 结论：俄译本 [gh spells.rst] 对 Magery 前置**系统性抬档**，本报告 C 表 Magery 栏已按 trow 中译修正；Shield 的「Magery 2」因源自俄译本，仍建议以英文原版复核（高置信为 Magery 2，因 Shield/Armor 属高阶防护法术）。

**2. 全部法术 IQ 基础（二次确认）**：[8857](https://trow.cc/board/showtopic=8857) 明言「**（VH）表示 IQ/Very Hard 的法术；其它都是 IQ/Hard**」，且 Basic Set 第五章仅收录 **93 个法术**（全书 GURPS Magic 有数百个）。

**3. trow 官方法术译名（供数据表字段校准）**：Ignite Fire 燃烧之焰 / Create Fire 召火术 / Shape Fire 火焰塑形 / Fireball 火球术 / Explosive Fireball 爆裂火球 / Lightning 闪电术 / Purify Air 净化之风 / Deflect Energy 能量偏转 / Daze 晕眩术（作状态时为「失神」）。学院名：Air 风系法术 / Body Control 身体操控法术 / Fire 火系法术。（项目用的 点火/创造火/火球/闪电箭 为自拟简称，非 trow 官方译名，建议与官方译名对齐。）

**4. F 项未解项说明**：章节索引显示 trow **未翻译第十二章（战术战斗）与第十三章（特殊战斗情况）**——这两章才是「姿势表 B551」「能见度/目盲修正 B547」等精确数值所在。故「倒地 Prone 攻-4/防-3」「目盲 -10」仍标 ⚠️（基于 B547/B551 公开数值 + 高置信记忆，未能从 trow 直接取证）。
