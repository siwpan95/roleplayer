/* D20 引擎单元测试（零依赖，Node 内置 node:test）。
 * 运行前由 package.json 的 test 脚本先 tsc -p tsconfig.smoke.json 产出 dist-smoke。 */
const test = require("node:test");
const assert = require("node:assert");
const d20 = require("../dist-smoke/index.js");

// ---------------------------------------------------------------------------
//  骰子纯函数（确定性边界 + 概率区间）
// ---------------------------------------------------------------------------
test("rollD20 / rollD100 落在合法区间", () => {
  for (let i = 0; i < 300; i++) {
    const d20r = d20.rollD20();
    assert.ok(d20r >= 1 && d20r <= 20, `rollD20 越界: ${d20r}`);
    const d100 = d20.rollD100();
    assert.ok(d100 >= 1 && d100 <= 100, `rollD100 越界: ${d100}`);
  }
});

test("rollD6 / roll3d6 返回正确骰子数与总和", () => {
  for (let i = 0; i < 100; i++) {
    const [rolls, total] = d20.rollD6(3, 2);
    assert.equal(rolls.length, 3);
    rolls.forEach((r) => assert.ok(r >= 1 && r <= 6));
    assert.equal(total, rolls.reduce((a, b) => a + b, 0) + 2);
    const [r3, t3] = d20.roll3d6();
    assert.equal(r3.length, 3);
    assert.equal(t3, r3.reduce((a, b) => a + b, 0));
  }
});

test("gurpsSuccessChance 边界值正确", () => {
  assert.equal(d20.gurpsSuccessChance(3), 0);
  assert.equal(d20.gurpsSuccessChance(10), 50);
  assert.equal(d20.gurpsSuccessChance(16), 98);
  assert.equal(d20.gurpsSuccessChance(18), 100);
  assert.equal(d20.gurpsSuccessChance(11), 63);
});

test("parseDice 解析 '2d6+3' / '1d8-1' / '' 正确", () => {
  assert.deepEqual(d20.parseDice("2d6+3"), [2, 6, 3]);
  assert.deepEqual(d20.parseDice("1d8-1"), [1, 8, -1]);
  assert.deepEqual(d20.parseDice("3d4"), [3, 4, 0]);
  assert.deepEqual(d20.parseDice(""), [0, 0, 0]);
  assert.deepEqual(d20.parseDice("+5"), [0, 0, 5]);
});

// ---------------------------------------------------------------------------
//  属性调整值
// ---------------------------------------------------------------------------
test("abilityMod 纯函数符合 D&D 地板公式（含 <10）", () => {
  const cases = [[1, -5], [7, -2], [8, -1], [10, 0], [11, 0], [13, 1], [14, 2], [15, 2], [16, 3], [18, 4], [20, 5], [24, 7]];
  for (const [score, mod] of cases) {
    assert.equal(d20.abilityMod(score), mod, `能力值${score} 调整值应为 ${mod}`);
  }
});

test("setAttribute 拒绝低于 10 且 attrMod 反映已购值", () => {
  const c = new d20.Character();
  assert.equal(c.setAttribute("力量", 8)[0], false, "力量8 应被拒（不能低于10）");
  assert.equal(c.attrMod("力量"), 0, "默认值10 调整值0");
  assert.equal(c.setAttribute("力量", 14)[0], true);
  assert.equal(c.attrMod("力量"), 2);
  assert.equal(c.setAttribute("力量", 16)[0], true);
  assert.equal(c.attrMod("力量"), 3);
  assert.equal(c.setAttribute("力量", 6)[0], false, "再次确认低于10被拒");
});

// ---------------------------------------------------------------------------
//  战斗条件服务
// ---------------------------------------------------------------------------
test("战斗条件叠加计算惩罚与 autoFail", () => {
  const c = new d20.Character();
  c.addCondition("震慑");
  assert.ok(c.activeConditions().includes("震慑"));
  assert.equal(c.conditionPenalty("check"), -2);
  c.addCondition("目盲");
  assert.equal(c.conditionPenalty("attack"), -4);
  assert.equal(c.ctx.condition.autoFail("vis"), true);
  assert.equal(c.ctx.condition.autoFail("aud"), false);
  c.ctx.condition.remove("目盲");
  assert.equal(c.conditionPenalty("attack"), -2, "移除目盲后仅震慑剩余攻击-2");
  c.ctx.condition.remove("震慑");
  assert.equal(c.conditionPenalty("attack"), 0, "全部移除后攻击无惩罚");
});

// ---------------------------------------------------------------------------
//  怪物图鉴服务
// ---------------------------------------------------------------------------
test("怪物 XP 映射与图鉴规模", () => {
  const c = new d20.Character();
  assert.equal(c.ctx.monster.xp("1"), 200);
  assert.equal(c.ctx.monster.xp("1/2"), 100);
  assert.equal(c.ctx.monster.xp("5"), 1800);
  const names = c.monsterNames();
  assert.ok(names.includes("哥布林"), "图鉴应含 哥布林");
  assert.ok(names.length >= 300, `图鉴规模应 >=300 (实际 ${names.length})`);
  const block = c.monsterStatBlock("哥布林");
  assert.ok(block.includes("哥布林") && block.includes("AC") && block.includes("HP"));
});

// ---------------------------------------------------------------------------
//  盗贼基准（与 Python tests/test_expansion.py 与 web smoke 一致）
// ---------------------------------------------------------------------------
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

test("盗贼基准：CP/HP/AC/攻击/豁免 逐值一致", () => {
  const t = buildThief();
  assert.equal(t.cp, 1, `剩余 CP 应为 1 (实际 ${t.cp})`);
  assert.equal(t.hp(), 65, `HP 应为 65 (实际 ${t.hp()})`);
  assert.equal(t.ac, 20, `AC 应为 20 (实际 ${t.ac})`);
  assert.equal(t.attackBonus(true), 11, `近战 +11 (实际 ${t.attackBonus(true)})`);
  assert.equal(t.attackBonus(false), 8, `远程 +8 (实际 ${t.attackBonus(false)})`);
  assert.equal(t.saveBonus("fort"), 11);
  assert.equal(t.saveBonus("ref"), 10);
  assert.equal(t.saveBonus("will"), 10);
});

// ---------------------------------------------------------------------------
//  v2.1 SRD 扩充：职业 / 装备 / 熟练 / 参考常量 数据契约
// ---------------------------------------------------------------------------
test("v2.1 数据规模与 Python 侧一致", () => {
  assert.equal(Object.keys(d20.CLASSES).length, 12, "12 职业");
  assert.equal(Object.keys(d20.SUBCLASSES).length, 12, "12 子职业");
  assert.equal(Object.keys(d20.FEATURES).length, 318, "318 特性（407 条记录去重后）");
  assert.equal(Object.keys(d20.SRD_EQUIPMENT).length, 237, "237 件 SRD 装备");
  assert.equal(Object.keys(d20.PROFICIENCIES).length, 117, "117 项熟练");
  assert.equal(Object.keys(d20.DAMAGE_TYPES).length, 13);
  assert.equal(Object.keys(d20.MAGIC_SCHOOLS).length, 8);
  assert.equal(Object.keys(d20.LANGUAGES).length, 16);
  assert.equal(Object.keys(d20.SRD_SKILLS).length, 18);
  assert.equal(Object.keys(d20.RULE_SECTIONS).length, 33);
  let lv = 0;
  for (const cls of Object.keys(d20.CLASS_LEVELS)) lv += Object.keys(d20.CLASS_LEVELS[cls]).length;
  assert.equal(lv, 240, "12 职业 × 20 级");
});

test("职业数据与 SRD 官方表一致", () => {
  assert.equal(d20.CLASSES["法师"].hit_die, 6);
  assert.equal(d20.CLASSES["法师"].spellcasting.progression, "full");
  assert.equal(d20.CLASSES["圣武士"].spellcasting.progression, "half");
  assert.equal(d20.CLASSES["魔契师"].spellcasting.progression, "pact");
  assert.equal(d20.CLASSES["野蛮人"].spellcasting, null);
  assert.equal(d20.CLASS_LEVELS["游荡者"]["5"].class_specific.sneak_attack.dice_count, 3);
});

test("weaponDice 回退 SRD 装备库", () => {
  assert.deepEqual(d20.weaponDice("长剑"), [1, 8], "手工库优先");
  assert.deepEqual(d20.weaponDice("巨剑"), [2, 6]);
  const srdOnly = Object.keys(d20.SRD_EQUIPMENT).find(
    (k) => d20.SRD_EQUIPMENT[k].cat === "武器" && d20.SRD_EQUIPMENT[k].damage && !(k in d20.WEAPON_DICE)
  );
  const [n, d] = d20.weaponDice(srdOnly);
  assert.ok(n >= 1 && d >= 4, `SRD 武器 ${srdOnly} 应解析出伤害骰`);
});

// ---------------------------------------------------------------------------
//  v2.1 ClassService 行为与集成
// ---------------------------------------------------------------------------
test("职业选择/升级/子职业与熟练授予", () => {
  const c = new d20.Character();
  const [ok] = c.setClass("法师", ["奥术知识", "历史"]);
  assert.ok(ok);
  assert.equal(c.level, 1);
  assert.equal(c.cp, 150, "1 级免费");
  assert.equal(c.proficiencies.length, 2);
  assert.ok(c.saveProficiencies.includes("意志豁免"));

  assert.equal(c.levelTo(5)[0], true);
  assert.equal(c.level, 5);
  assert.equal(c.cp, 138, "2–5 级共 12 CP");
  assert.equal(c.hitDie(), 6);
  assert.equal(c.profBonus(), 3);
  assert.equal(c.casterLevel(), 5);
  assert.equal(c.maxSpellRing(), 3);

  assert.equal(c.setSubclass("塑能学派")[0], true);
  assert.ok(c.classFeatures().includes("施法：法师"));
});

test("职业等级定价（决策 G 递增标价）", () => {
  assert.equal(d20.levelUpCost(1), 0);
  assert.equal(d20.levelUpCost(2), 3);
  assert.equal(d20.levelUpCost(6), 4);
  assert.equal(d20.levelUpCost(11), 5);
  assert.equal(d20.levelUpCost(16), 6);
  assert.equal(d20.cumulativeCost(20), 87);
});

test("职业装备熟练豁免护甲技能要求 + 施法资格", () => {
  const c = new d20.Character();
  assert.equal(c.equipItem("全身板甲")[0], false, "无职业无技能应被拒");

  const f = new d20.Character();
  f.setClass("战士");
  assert.equal(f.equipItem("全身板甲")[0], true, "战士有全部护甲熟练");

  const w = new d20.Character();
  w.setClass("法师");
  w.levelTo(5);
  assert.equal(w.buySlot(3)[0], true, "凭职业等级可买 3 环法术位");
  assert.equal(w.ctx.slots.available(3), 1);
});

test("职业豁免熟练 +2（决策 H）", () => {
  const base = new d20.Character().saveBonus("will");
  const m = new d20.Character();
  m.setClass("法师");
  assert.equal(m.saveBonus("will"), base + 2);
  assert.equal(m.saveBonus("fort"), base);
});

test("生命骰随职业（决策 J）", () => {
  assert.equal(new d20.Character().hitDie(), 6, "无职业回落 d6");
  const f = new d20.Character();
  f.setClass("战士");
  assert.equal(f.hitDie(), 10);
  assert.equal(f.ctx.rest.hitDice(), 10);
});

test("ReferenceService 规则速查", () => {
  const c = new d20.Character();
  assert.ok(c.rule("休息").length > 0);
  assert.ok(c.gearInfo("长剑").damage === "1d8");
  assert.equal(c.armorInfo("全身板甲").armor_class, 18);
  assert.equal(c.weaponInfo("全身板甲"), undefined);
  assert.ok(c.gearByCategory("武器").includes("长剑"));
  assert.ok(c.classFeatureDetail("狂暴").class === "野蛮人");
});

// ---------------------------------------------------------------------------
//  架构一致性：18 服务全挂载（防回归）
// ---------------------------------------------------------------------------
test("18 个服务全部挂载", () => {
  const c = new d20.Character();
  const all18 = ["attributes","background","classes","combat","condition","derived","dice",
    "equipment","feats","monster","perks","race","reference","rest","sheet","skills",
    "slots","techniques"];
  for (const id of all18) assert.ok(c.ctx.has(id), `服务应挂载: ${id}`);
  assert.equal(d20.COMPOSITION.length, 18, `COMPOSITION 应有 18 项 (实际 ${d20.COMPOSITION.length})`);
});
