/* 引擎运行时烟雾测试：验证 TS 移植后的核心行为（零依赖，Node CJS 运行 emit 产物）。*/
const assert = require("assert");
const d20 = require("./dist-smoke/index.js");

function ok(cond, msg) { assert.ok(cond, "❌ " + msg); console.log("✓ " + msg); }

console.log("=== D20 web 引擎烟雾测试 ===");
const char = new d20.Character();
ok(char.cp === 150, `初始 CP=150 (实际 ${char.cp})`);

// 属性
let [s] = char.setAttribute("力量", 14);
ok(s === true, "设置力量=14 成功");
ok(char.attrMod("力量") === 2, `力量调整值=+2 (实际 ${char.attrMod("力量")})`);
ok(char.cp === 100, `力量14 消耗 50CP (剩余 ${char.cp})`);

// 技能
[s] = char.purchaseSkill("活力", 2);
ok(s === true, "购买活力 Lv.2 成功");
ok(char.effectiveSkillRank("活力") === 2, `活力有效等级=2 (实际 ${char.effectiveSkillRank("活力")})`);
ok(char.hp() > 0, `HP>0 (实际 ${char.hp()})`);

// 近战攻击 5 -> 解锁偷袭技术
char.purchaseSkill("近战攻击", 5);
char.purchaseSkill("闪避防御", 3);
[s] = char.purchaseTechnique("偷袭要害打击");
ok(s === true, "学习技术 偷袭要害打击 成功");

// 装备
[s] = char.equipItem("皮甲");
ok(s === true, "装备皮甲成功");
[s] = char.equipItem("短剑");
ok(s === true, "装备短剑成功");
ok(Number.isFinite(char.ac), `AC 为有限数值 (实际 ${char.ac})`);

// 优点/天赋
char.addAdvantageByName("昏暗视觉");
[s] = char.addTalent("轻巧战法", 1);
ok(s === true, "获得天赋 轻巧战法 Lv.1 成功");
ok(char.getTalentBonus("近战攻击") === 1, `轻巧战法 对近战攻击+1 (实际 ${char.getTalentBonus("近战攻击")})`);

// 组合契约：9 个服务已挂载
const ids = ["attributes","equipment","perks","techniques","skills","dice","derived","combat","sheet"];
for (const id of ids) ok(char.ctx.has(id), `服务已挂载: ${id}`);

// 战斗宏
const out = char.combatMacro("sneak_attack", {});
ok(out.includes("偷袭攻击"), "偷袭攻击战斗宏可运行");

// 插件热卸载：卸载 derived 后，依赖它的能力应报错（演示 web-cordis 式插件影响）
d20.unmountService(char.ctx, "derived");
let threw = false;
try { char.hp(); } catch (e) { threw = true; }
ok(threw, "卸载 derived 服务后 char.hp() 报错（插件影响可观测）");
// 重新挂载以恢复
d20.mountService(char.ctx, d20.COMPOSITION.find((e) => e.id === "derived"));
ok(Number.isFinite(char.hp()), "重新挂载 derived 后 HP 恢复");

// 角色卡渲染
const sheet = char.showSheet();
ok(sheet.includes("角色卡"), "showSheet 渲染出角色卡");
ok(sheet.includes("HP:"), "角色卡含 HP 行");

console.log("\n=== 盗贼复刻比对（与 Python data/sample_thief.py 基准一致） ===");
function buildThief() {
  const c = new d20.Character();
  c.setAttribute("力量", 11);
  c.setAttribute("体质", 13);
  c.addAdvantage("昏暗视觉", 2);
  c.addDisadvantage("荣誉准则", 10);
  c.addTalent("轻巧战法", 1);
  for (const [sk, lvl] of [["反射豁免", 10], ["强韧豁免", 10], ["意志豁免", 10],
    ["活力", 14], ["潜行", 10], ["躲藏", 10], ["近战攻击", 10]]) {
    c.purchaseSkill(sk, lvl);
  }
  c.purchaseTechnique("偷袭要害打击");
  c.equipItem("匕首");
  c.equipItem("全身板甲");
  c.equipItem("铁盾");
  return c;
}
const thief = buildThief();
ok(thief.cp === 1, `剩余 CP=1 (实际 ${thief.cp})`);
ok(thief.hp() === 65, `HP=65 (实际 ${thief.hp()})`);
ok(thief.ac === 20, `AC=20 (实际 ${thief.ac})`);
ok(thief.attackBonus(true) === 11, `近战=+11 (实际 ${thief.attackBonus(true)})`);
ok(thief.attackBonus(false) === 8, `远程=+8 (实际 ${thief.attackBonus(false)})`);
ok(thief.saveBonus("fort") === 11, `强韧=+11 (实际 ${thief.saveBonus("fort")})`);
ok(thief.saveBonus("ref") === 10, `反射=+10 (实际 ${thief.saveBonus("ref")})`);
ok(thief.saveBonus("will") === 10, `意志=+10 (实际 ${thief.saveBonus("will")})`);
ok(thief.effectiveSkillRank("远程攻击") === 8, `远程攻击默认值=8 (实际 ${thief.effectiveSkillRank("远程攻击")})`);
ok(thief.attrMod("体质") === 1, `体质调整值=+1 (实际 ${thief.attrMod("体质")})`);
ok(thief.attrMod("力量") === 0, `力量调整值=+0 (实际 ${thief.attrMod("力量")})`);

console.log("\n=== 扩充子系统（与 Python tests/test_expansion.py 基准一致） ===");
// 16 服务挂载（含新增 condition / monster）
const all16 = ["attributes","background","combat","condition","derived","dice","equipment","feats",
  "monster","perks","race","rest","sheet","skills","slots","techniques"];
for (const id of all16) ok(char.ctx.has(id) || thief.ctx.has(id), `服务已挂载: ${id}`);

// 战斗条件（新增 ConditionService）
const cond = new d20.Character();
let [sc] = cond.addCondition("震慑");
ok(sc === true, "施加战斗条件 震慑 成功");
ok(cond.activeConditions().includes("震慑"), "activeConditions 含 震慑");
ok(cond.conditionPenalty("check") === -2, `震慑 检定惩罚 -2 (实际 ${cond.conditionPenalty("check")})`);
cond.addCondition("目盲");
ok(cond.conditionPenalty("attack") === -4, `震慑+目盲 攻击惩罚 -4 (实际 ${cond.conditionPenalty("attack")})`);
ok(cond.ctx.condition.autoFail("vis") === true, "目盲 autoFail 视觉维度");
const sheetCond = cond.showSheet();
ok(sheetCond.includes("战斗条件:") && sheetCond.includes("震慑") && sheetCond.includes("攻-4"), "角色卡渲染战斗条件行（含净惩罚）");

// 怪物图鉴（新增 MonsterService）
const mon = new d20.Character();
ok(mon.monsterNames().length >= 45, `怪物图鉴 >= 45 种 (实际 ${mon.monsterNames().length})`);
const gob = mon.monsterStatBlock("哥布林");
ok(gob.includes("哥布林") && gob.includes("AC") && gob.includes("HP"), "怪物 stat block 渲染");
ok(thief.ctx.monster.xp("1") === 200, `CR1 -> 200 XP (实际 ${thief.ctx.monster.xp("1")})`);
ok(thief.ctx.monster.xp("1/2") === 100, "CR1/2 -> 100 XP");
const mroll = mon.monsterRollAttack("哥布林", 0, 12);
ok(mroll.includes("哥布林") && (mroll.includes("命中") || mroll.includes("未命中")), "怪物 DM 掷骰结算可运行");

// 法术位（决策 A）
const mage = new d20.Character();
let [s2, m2] = mage.buySlot(1);
ok(s2 === false && m2.includes("奥术施法"), "无奥术施法不能买 1 环位");
mage.purchaseSkill("奥术施法", 1);
for (let i = 0; i < 4; i++) [s2] = mage.buySlot(1);
[s2, m2] = mage.buySlot(1);
ok(s2 === false && m2.includes("上限"), "1 环上限 4");
ok(mage.cp === 150 - 1 - 4, `法术位 CP 计价 (剩余 ${mage.cp})`);

// 专长（决策 B）
const f = new d20.Character();
f.addFeat("警觉");
ok(f.ctx.rest.initiativeBonus() === 5, `警觉先攻+5 (实际 ${f.ctx.rest.initiativeBonus()})`);
const f2 = new d20.Character();
f2.purchaseSkill("活力", 2);
const hpBefore = f2.hp();
f2.addFeat("强壮");
ok(f2.hp() === hpBefore + 4, `强壮 HP+2×活力 (实际 ${f2.hp()})`);

// 种族（决策 C）
const r1 = new d20.Character();
r1.setRace("人类");
ok(r1.cp === 90 && r1.attributes["力量"] === 11, `人类 60CP 全属性11 (剩余 ${r1.cp})`);
const r2 = new d20.Character();
r2.setRace("精灵");
ok(r2.cp === 122 && r2.attributes["敏捷"] === 12 && r2.advantages.includes("黑暗视觉"),
  `精灵 28CP 敏捷12 黑暗视觉 (剩余 ${r2.cp})`);
const r3 = new d20.Character();
r3.setRace("提夫林");
r3.purchaseSkill("活力", 2);
const dmgOut = r3.takeDamage(10, "火");
ok(dmgOut.includes("5 点"), `提夫林火焰抗性减半 (${dmgOut})`);
const r4 = new d20.Character();
r4.setRace("半兽人");
r4.purchaseSkill("活力", 2);
r4.takeDamage(999);
ok(r4.ctx.rest.currentHp() === 1, `半兽人濒死不屈 HP=1 (实际 ${r4.ctx.rest.currentHp()})`);

// 背景（决策 D）
const b1 = new d20.Character();
b1.setBackground("士兵");
b1.purchaseSkill("运动", 4);
ok(b1.effectiveSkillRank("运动") === 6, `背景熟练+2 (实际 ${b1.effectiveSkillRank("运动")})`);

// 休整（决策 E）
const e1 = new d20.Character();
e1.purchaseSkill("活力", 2);
ok(e1.ctx.rest.currentHp() === e1.hp(), "current_hp 初始=满血");
e1.takeDamage(3);
ok(e1.ctx.rest.currentHp() === e1.hp() - 3, `受伤跟踪 (实际 ${e1.ctx.rest.currentHp()})`);
e1.longRest();
ok(e1.ctx.rest.currentHp() === e1.hp(), "长休回满");

// 法术宏消耗法术位
const c1 = new d20.Character();
c1.purchaseSkill("奥术施法", 5);
c1.purchaseTechnique("火球术");
c1.buySlot(3);
const fb = c1.combatMacro("fireball", { dc: 1 });
ok(fb.includes("火球术(3环)") && c1.ctx.slots.available(3) === 0, "火球术消耗 3 环法术位");
const fb2 = c1.combatMacro("fireball", { dc: 1 });
ok(fb2.includes("施法失败"), "无法术位时施法失败");

// 角色卡新行
const s1 = new d20.Character();
s1.setRace("精灵");
s1.setBackground("学者");
s1.addFeat("警觉");
const sheet2 = s1.showSheet();
ok(sheet2.includes("种族: 精灵") && sheet2.includes("背景: 学者（研究者）") && sheet2.includes("专长: 警觉"),
  "角色卡含种族/背景/专长行");

// ===========================================================================
//  v2.1 SRD 扩充：职业 / 子职业 / 等级 / 特性 / 装备 / 熟练 / 规则速查
//  （数值与 Python 侧 tests/test_srd_v21.py 逐值一致）
// ===========================================================================
console.log("--- v2.1 SRD 扩充 ---");
ok(Object.keys(d20.CLASSES).length === 12, `职业 12 种 (实际 ${Object.keys(d20.CLASSES).length})`);
ok(Object.keys(d20.SUBCLASSES).length === 12, `子职业 12 种 (实际 ${Object.keys(d20.SUBCLASSES).length})`);
ok(Object.keys(d20.FEATURES).length === 318, `特性 318 条 (实际 ${Object.keys(d20.FEATURES).length})`);
ok(Object.keys(d20.SRD_EQUIPMENT).length === 237, `SRD 装备 237 件 (实际 ${Object.keys(d20.SRD_EQUIPMENT).length})`);
ok(Object.keys(d20.PROFICIENCIES).length === 117, `熟练 117 项 (实际 ${Object.keys(d20.PROFICIENCIES).length})`);
let lvCount = 0;
for (const cls of Object.keys(d20.CLASS_LEVELS)) lvCount += Object.keys(d20.CLASS_LEVELS[cls]).length;
ok(lvCount === 240, `职业等级记录 240 条 (实际 ${lvCount})`);

ok(d20.CLASSES["法师"].hit_die === 6 && d20.CLASSES["法师"].spellcasting.progression === "full",
  "法师 d6 / full 施法（与 PHB 一致）");
ok(d20.CLASSES["野蛮人"].spellcasting === null, "野蛮人无施法能力");
ok(d20.CLASS_LEVELS["游荡者"]["5"].class_specific.sneak_attack.dice_count === 3,
  "游荡者 5 级偷袭 3d6（SRD 权威值）");

// 职业选择 / 升级 / 子职业
const m1 = new d20.Character();
ok(m1.setClass("法师", ["奥术知识", "历史"])[0] === true, "创建期选择职业 法师");
ok(m1.level === 1 && m1.cp === 150, `1 级免费 (CP ${m1.cp})`);
ok(m1.proficiencies.length === 2, `法师自选 2 项技能熟练 (实际 ${m1.proficiencies.length})`);
ok(m1.saveProficiencies.includes("意志豁免"), "法师授予意志豁免熟练");
ok(m1.levelTo(5)[0] === true && m1.cp === 138, `升至 5 级共 12 CP (剩余 ${m1.cp})`);
ok(m1.profBonus() === 3, `5 级熟练加值 +3 (实际 ${m1.profBonus()})`);
ok(m1.setSubclass("塑能学派")[0] === true, "5 级可选子职业 塑能学派");
ok(m1.classFeatures().includes("施法：法师"), "特性表含 施法：法师");

// 施法资格（决策 I）
ok(m1.casterLevel() === 5 && m1.maxSpellRing() === 3,
  `法师 5 级：施法者等级 5 / 最高 3 环 (实际 ${m1.casterLevel()}/${m1.maxSpellRing()})`);
ok(m1.buySlot(3)[0] === true && m1.ctx.slots.available(3) === 1,
  "凭职业等级（无奥术施法技能）即可购 3 环法术位");

// 装备熟练（决策 H）
const w1 = new d20.Character();
ok(w1.equipItem("全身板甲")[0] === false, "无职业无技能 -> 重甲被拒");
const w2 = new d20.Character();
w2.setClass("战士");
ok(w2.equipItem("全身板甲")[0] === true, "战士「全部护甲」熟练 -> 可穿全身板甲");

// 豁免熟练（决策 H）
const baseWill = new d20.Character().saveBonus("will");
ok(m1.saveBonus("will") === baseWill + 2, `职业豁免熟练 +2 (实际 ${m1.saveBonus("will")})`);

// 生命骰（决策 J）
ok(new d20.Character().hitDie() === 6, "无职业回落 d6");
ok(w2.hitDie() === 10 && w2.ctx.rest.hitDice() === 10, `战士生命骰 d${w2.hitDie()}`);

// 规则速查
ok(m1.rule("休息").length > 0, "规则章节「休息」可取正文");
ok(m1.gearInfo("长剑").damage === "1d8", "SRD 装备检索 长剑 1d8");
ok(m1.armorInfo("全身板甲").armor_class === 18, "SRD 护甲检索 全身板甲 AC18");
ok(m1.classFeatureDetail("狂暴").class === "野蛮人", "特性详情 狂暴 -> 野蛮人");

// 可选增强：卸载 classes 后回落原行为
const noCls = new d20.Character();
d20.unmountService(noCls.ctx, "classes");
ok(noCls.ctx.rest.hitDice() === 6, "卸载 classes 后生命骰回落 d6");
ok(noCls.equipItem("全身板甲")[0] === false, "卸载 classes 后重甲仍需技能");

// 角色卡职业行
const sheet3 = m1.showSheet();
ok(sheet3.includes("职业: 法师 5 级（塑能学派）") && sheet3.includes("生命骰 d6"),
  "角色卡含职业/等级/子职业与生命骰行");

console.log("\n全部烟雾测试通过 ✅");
