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
//  架构一致性：16 服务全挂载（防回归）
// ---------------------------------------------------------------------------
test("16 个服务全部挂载", () => {
  const c = new d20.Character();
  const all16 = ["attributes","background","combat","condition","derived","dice",
    "equipment","feats","monster","perks","race","rest","sheet","skills","slots","techniques"];
  for (const id of all16) assert.ok(c.ctx.has(id), `服务应挂载: ${id}`);
  assert.equal(d20.COMPOSITION.length, 16, `COMPOSITION 应有 16 项 (实际 ${d20.COMPOSITION.length})`);
});
