/**
 * d20.web engine/battle - 模拟对战服务（v2.2）
 *
 * 与 Python d20/battle.py 1:1。回合制完整对战：先攻、回合轮转、动作经济
 * （攻击/多攻击/疾行/施法）、伤害结算（暴击/抗力/免疫/易伤）、状态与死亡豁免、
 * 怪物 AI（最近+重伤优先、按 INT 适配抗免）、PC AI（集火/悠悠球治疗/施法）、
 * 传奇动作、遭遇构建（DMG 2014）、蒙特卡洛模拟。挂到 ctx.battle。
 */
import { Service } from "./core";
import { abilityMod } from "./data";
import { MONSTERS, CR_XP } from "./data";
import { parseDice } from "./monster";
import { weaponDice } from "./dice";
import {
  XP_THRESHOLDS, DAILY_XP_BUDGET, DIFFICULTIES, DIFFICULTY_CN,
  DAMAGE_TYPE_ALIAS, CONDITION_KEYWORDS, SAVE_ABILITY_MAP,
  AI_WIS_WOUNDED_THRESHOLD, AI_INT_ADAPT_THRESHOLD, AI_INT_OPTIMAL_THRESHOLD,
  MELEE_REACH, DEFAULT_START_DISTANCE, DEATH_SAVE_TARGET,
  DEATH_SAVE_SUCCESSES, DEATH_SAVE_FAILURES, CRIT_ROLL, DEFAULT_MAX_ROUNDS,
} from "./data_battle";

const rand = (n: number) => Math.floor(Math.random() * n) + 1;

const NUM_WORDS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6,
};

// ---------------------------------------------------------------------------
//  Combatant / Battle
// ---------------------------------------------------------------------------
export interface ActionNorm {
  name: string; atk: number; reach: number; dmg_expr: string; dmg_type: string;
  extra: string; kind: string; save: any; recharge: number | null;
  is_multi: boolean; multi: Array<[number, ActionNorm]>;
}

export class Combatant {
  name = ""; side = ""; kind = "";
  ac = 10; max_hp = 10; hp = 10; dex = 10; speed = 30;
  cr = ""; xp = 0; x = 0; init = 0; init_roll = 0; dex_mod = 0;
  wis = 10; intl = 10;
  resist: Set<string> = new Set(); immune: Set<string> = new Set();
  vuln: Set<string> = new Set(); cond_immune: Set<string> = new Set();
  actions: ActionNorm[] = []; legendary: ActionNorm[] = [];
  traits: any[] = []; recharge_ready: Record<string, boolean> = {};
  action_used = false; bonus_used = false; reaction_used = false; move_left = 0;
  conditions: string[] = [];
  death_success = 0; death_failure = 0;
  source: any = null;
  atk_melee = 0; atk_ranged = 0; weapon = "徒手"; weapon_dice: [number, number] = [1, 4];
  str_mod = 0; level = 1; can_sneak = false; can_range = false;
  damage_dealt = 0;

  constructor(fields: Partial<Combatant> = {}) { Object.assign(this, fields); }

  get alive(): boolean { return this.hp > 0; }
}

export class Battle {
  combatants: Combatant[] = [];
  order: number[] = [];
  round = 1;
  turn_index = 0;
  log: string[] = [];
  over = false;
  winner = "";
  total_xp = 0;
  party_levels: number[] = [];

  party(): Combatant[] { return this.combatants.filter((c) => c.side === "party"); }
  foes(): Combatant[] { return this.combatants.filter((c) => c.side === "foe"); }
}

// ---------------------------------------------------------------------------
//  工具函数
// ---------------------------------------------------------------------------
function dist(a: Combatant, b: Combatant): number { return Math.abs(a.x - b.x); }

function reachOf(action: any, fallback = MELEE_REACH): number {
  const m = /^\s*(\d+)/.exec(String(action.reach || ""));
  return m ? Number(m[1]) : fallback;
}

function isRanged(action: any): boolean {
  const r = String(action.reach || "");
  const m = /^\s*(\d+)/.exec(r);
  return r.includes("ft") && m !== null && (r.includes("/") || Number(m[1]) > 10);
}

function hpOf(expr: string): number {
  const m = /^\s*(\d+)/.exec(String(expr || ""));
  return m ? Number(m[1]) : 10;
}

function findAction(actions: any[], name: string): any {
  const nm = name.toLowerCase().replace(/s$/, "");
  for (const a of actions) {
    const an = String(a.name || "").toLowerCase().replace(/s$/, "");
    if (an === nm || nm.includes(an) || an.includes(nm)) return a;
  }
  return null;
}

function parseMultiattack(action: any, actions: any[]): Array<[number, any]> {
  const extra = action.extra || "";
  const out: Array<[number, string]> = [];
  const reA = /(one|two|three|four|five|six|\d+)\s+with\s+its\s+([\w\s]+?)(?=,| and|$)/gi;
  let m: RegExpExecArray | null;
  while ((m = reA.exec(extra)) !== null) {
    out.push([NUM_WORDS[m[1].toLowerCase()] ?? Number(m[1]), m[2].trim().toLowerCase()]);
  }
  if (!out.length) {
    const mB = /makes\s+(one|two|three|four|five|six|\d+)\s+([\w\s]+?)\s+attacks?/i.exec(extra);
    if (mB) out.push([NUM_WORDS[mB[1].toLowerCase()] ?? Number(mB[1]), mB[2].trim().toLowerCase()]);
  }
  const resolved: Array<[number, any]> = [];
  for (const [cnt, nm] of out) {
    const sub = findAction(actions, nm);
    if (sub) resolved.push([cnt, sub]);
  }
  return resolved;
}

function parseSave(extra: string): any {
  const m = /DC\s+(\d+)\s+(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)\s+saving throw/i.exec(extra);
  if (!m) return null;
  const dc = Number(m[1]);
  const axis = (SAVE_ABILITY_MAP as any)[m[2].toLowerCase()] || "will";
  let condition = "";
  const tail = extra.slice((m.index ?? 0) + m[0].length).toLowerCase();
  for (const [kw, zh] of Object.entries(CONDITION_KEYWORDS)) {
    const i = tail.search(new RegExp(`\\b${kw}\\b`));
    if (i >= 0 && i < 120) { condition = zh; break; }
  }
  if (!condition && tail.includes("knocked prone")) condition = "倒地";
  return { dc, axis, condition };
}

function parseRecharge(extra: string): number | null {
  const m = /Recharge\s+(\d)\s*-\s*6/i.exec(extra);
  return m ? Number(m[1]) : null;
}

function normalizeDamageType(name: string): string {
  if (!name) return "";
  const key = String(name).trim();
  const lk = key.toLowerCase();
  return (DAMAGE_TYPE_ALIAS as any)[lk] ?? (DAMAGE_TYPE_ALIAS as any)[key] ?? name;
}

function normalizeAction(a: any, monster: any): ActionNorm {
  const extra = a.extra || "";
  const name = a.name || "";
  const isMulti = name.toLowerCase().includes("multiattack");
  const atk = a.atk || 0;
  const save = isMulti ? null : parseSave(extra);
  const recharge = parseRecharge(extra);
  let kind: string;
  if (isMulti) kind = "multiattack";
  else if (extra.toLowerCase().includes("attack") || atk) kind = isRanged(a) ? "ranged" : "melee";
  else if (save || a.type) kind = "special";
  else kind = "utility";
  return {
    name, atk, reach: reachOf(a),
    dmg_expr: a.dmg || "", dmg_type: normalizeDamageType(a.type || ""),
    extra, kind, save, recharge, is_multi: isMulti,
    multi: isMulti ? parseMultiattack(a, monster.actions || []) : [],
  };
}

// ---------------------------------------------------------------------------
//  BattleService
// ---------------------------------------------------------------------------
export class BattleService extends Service {
  static inject: string[] = ["dice", "monster", "condition"];
  MONSTERS = MONSTERS;
  CR_XP = CR_XP;
  XP_THRESHOLDS = XP_THRESHOLDS;
  DAILY_XP_BUDGET = DAILY_XP_BUDGET;
  DIFFICULTY_CN = DIFFICULTY_CN;

  private _battle: Battle | null = null;

  // ---------------- 构造 ----------------
  makeMonster(name: string, side = "foe", x = DEFAULT_START_DISTANCE, suffix = ""): Combatant | null {
    const m = (this.MONSTERS as any)[name];
    if (!m) return null;
    const hp = hpOf(m.hp || "10");
    return new Combatant({
      name: name + suffix, side, kind: "monster",
      ac: m.ac || 10, max_hp: hp, hp,
      dex: m.dex || 10, speed: this._parseSpeed(m.speed || "30 ft."),
      cr: m.cr || "0", xp: (this.CR_XP as any)[m.cr || "0"] || 0,
      x, dex_mod: abilityMod(m.dex || 10),
      wis: m.wis || 10, intl: m.int || 10,
      resist: new Set((m.resist || []).map(normalizeDamageType)),
      immune: new Set((m.immune || []).map(normalizeDamageType)),
      vuln: new Set((m.vuln || []).map(normalizeDamageType)),
      cond_immune: new Set(m.cond_immune || []),
      actions: (m.actions || []).map((a: any) => normalizeAction(a, m)),
      legendary: (m.legendary || []).map((a: any) => normalizeAction(a, m)),
      traits: m.traits || [],
    });
  }

  makePc(ch: any, x = 0): Combatant {
    const st = ch.state;
    const hp = ch.hp();
    const weapon = ch.ctx.equipment.getEquippedWeapon();
    const info = ch.ctx.equipment.resolve(weapon);
    const canRange = !!info && info[0] === "武器" && String(info[1]).includes("远程");
    const canSneak = ch.hasTechnique("偷袭要害打击") && ch.hasFinesseWeapon();
    const wdice = weaponDice(weapon);
    return new Combatant({
      name: st.cls || "冒险者", side: "party", kind: "pc",
      ac: ch.ac, max_hp: hp, hp,
      dex: st.attributes["敏捷"], speed: 30,
      x, dex_mod: abilityMod(st.attributes["敏捷"]),
      wis: st.attributes["感知"], intl: st.attributes["智力"],
      source: ch,
      atk_melee: ch.attackBonus(true), atk_ranged: ch.attackBonus(false),
      weapon, weapon_dice: wdice,
      str_mod: Math.max(abilityMod(st.attributes["力量"]), 0),
      level: Math.max(st.level || 0, 1),
      can_sneak: canSneak, can_range: canRange,
    });
  }

  private _parseSpeed(s: string): number {
    const m = /^\s*(\d+)/.exec(String(s || ""));
    return m ? Number(m[1]) : 30;
  }

  newBattle(party: any[], foes: Array<string | [string, number]>,
            distance = DEFAULT_START_DISTANCE): Battle {
    const b = new Battle();
    b.party_levels = party.map((c) => Math.max(c.state.level || 0, 1));
    for (const ch of party) b.combatants.push(this.makePc(ch, 0));
    let n = 1;
    for (const spec of foes) {
      const [name, count] = typeof spec === "string" ? [spec, 1] : spec;
      for (let i = 0; i < count; i++) {
        const c = this.makeMonster(name, "foe", distance, count > 1 ? ` #${n}` : "");
        if (c) { b.combatants.push(c); b.total_xp += c.xp; }
        n++;
      }
    }
    this._rollInitiative(b);
    b.log.push(`战斗开始：${b.party().length} 名冒险者 vs ${b.foes().length} 个敌人，起始距离 ${Math.floor(distance)} 尺`);
    return b;
  }

  private _rollInitiative(b: Battle): void {
    for (const c of b.combatants) {
      c.init_roll = rand(20);
      c.init = c.init_roll + c.dex_mod;
    }
    b.order = b.combatants.map((_, i) => i)
      .sort((i, j) => (b.combatants[j].init - b.combatants[i].init)
        || (b.combatants[j].init_roll - b.combatants[i].init_roll)
        || (b.combatants[j].dex - b.combatants[i].dex));
    b.turn_index = 0;
    for (const i of b.order) {
      const c = b.combatants[i];
      b.log.push(`先攻: ${c.name} ${c.init_roll}+${c.dex_mod} = ${c.init}`);
    }
  }

  // ---------------- 当前对战糖 ----------------
  create(party: any[], foes: any[], distance = DEFAULT_START_DISTANCE): Battle {
    this._battle = this.newBattle(party, foes, distance);
    return this._battle;
  }
  current(): Battle | null { return this._battle; }
  stepCurrent(): boolean { return this._battle ? this.step(this._battle) : false; }
  runCurrent(maxRounds?: number): Record<string, any> {
    return this._battle ? this.run(this._battle, maxRounds) : {};
  }
  reportCurrent(): string { return this._battle ? this.report(this._battle) : "无进行中的对战"; }
  stateCurrent(): Record<string, any> { return this._battle ? this.state(this._battle) : {}; }

  // ---------------- 推进 ----------------
  step(b: Battle): boolean {
    if (b.over) return false;
    const i = b.order[b.turn_index % b.order.length];
    const c = b.combatants[i];
    if (c.hp <= 0 && c.kind === "pc") this._deathSave(c, b);
    else if (c.alive) {
      this._startTurn(c);
      if (c.kind === "monster") this._monsterTurn(c, b);
      else this._pcTurn(c, b);
    }
    c.action_used = c.bonus_used = c.reaction_used = false;
    this._legendaryPhase(b, i);
    if (this._checkEnd(b)) return false;
    b.turn_index += 1;
    if (b.turn_index >= b.order.length) { b.turn_index = 0; b.round += 1; }
    return true;
  }

  run(b: Battle, maxRounds?: number): Record<string, any> {
    const cap = maxRounds ?? DEFAULT_MAX_ROUNDS;
    while (!b.over && b.round < cap) this.step(b);
    if (!b.over) {
      b.over = true; b.winner = "draw";
      b.log.push(`…${cap} 回合未分胜负，战斗判定为平局`);
    }
    return this.result(b);
  }

  private _startTurn(c: Combatant): void {
    c.move_left = c.speed;
    c.reaction_used = false;
    for (const a of c.actions) {
      if (a.recharge && !c.recharge_ready[a.name]) {
        if (rand(6) >= (a.recharge as number)) c.recharge_ready[a.name] = true;
      }
    }
  }

  // ---------------- PC 回合 ----------------
  private _pcTurn(c: Combatant, b: Battle): void {
    const foes = b.foes().filter((f) => f.alive);
    if (!foes.length) return;
    if (this._pcYoYoHeal(c, b)) return;
    const target = foes.reduce((a, f) =>
      (f.hp < a.hp || (f.hp === a.hp && dist(c, f) < dist(c, a))) ? f : a);
    if (this._pcCast(c, target, b)) return;
    let used = false;
    if (c.can_sneak && dist(c, target) <= MELEE_REACH) used = this._pcAttack(c, target, b, true, false);
    if (!used && dist(c, target) <= MELEE_REACH) used = this._pcAttack(c, target, b, false, false);
    if (!used && c.can_range) used = this._pcAttack(c, target, b, false, true);
    if (!used) {
      this._moveToward(c, target, MELEE_REACH, b);
      if (c.move_left <= 0) this._moveToward(c, target, MELEE_REACH, b, true);
    }
  }

  private _pcYoYoHeal(c: Combatant, b: Battle): boolean {
    const ch: any = c.source;
    if (!ch || !ch.hasTechnique("治疗言灵")) return false;
    const down = b.party().filter((p) => p.hp <= 0 && p.kind === "pc"
      && p.death_failure < DEATH_SAVE_FAILURES);
    if (!down.length) return false;
    const [ok] = ch.ctx.slots.spendSlot(1);
    if (!ok) return false;
    const healed = rand(4) + Math.max(abilityMod(ch.state.attributes["感知"]), 0);
    const tgt = down[0];
    tgt.hp = Math.min(tgt.hp + healed, tgt.max_hp);
    b.log.push(`[${b.round}] ${c.name} 治疗言灵 → ${tgt.name} 恢复 ${healed} HP（${tgt.hp}/${tgt.max_hp}）`);
    return true;
  }

  private _pcCast(c: Combatant, tgt: Combatant, b: Battle): boolean {
    const ch: any = c.source;
    if (!ch) return false;
    if (ch.hasTechnique("魔法飞弹")) {
      const [ok] = ch.ctx.slots.spendSlot(1);
      if (ok) {
        const dmg = Array.from({ length: 3 }, () => rand(4)).reduce((a: number, v: number) => a + v, 0) + 3;
        const applied = this._applyDamage(tgt, dmg, "力场", b);
        c.damage_dealt += applied;
        b.log.push(`[${b.round}] ${c.name} 魔法飞弹（1环）→ ${tgt.name} 自动命中 3d4+3 = ${dmg} 力场伤害（剩余 ${tgt.hp}）`);
        return true;
      }
    }
    if (ch.hasTechnique("火焰箭")) {
      const atk = ch.ctx.skills.effectiveSkillRank("施法攻击");
      const roll = rand(20);
      const total = roll + atk;
      const crit = roll === CRIT_ROLL;
      if (total >= tgt.ac || crit) {
        const dmg = Array.from({ length: crit ? 2 : 1 }, () => rand(10))
          .reduce((a: number, v: number) => a + v, 0);
        const applied = this._applyDamage(tgt, dmg, "火焰", b);
        c.damage_dealt += applied;
        b.log.push(`[${b.round}] ${c.name} 火焰箭(戏法) → ${tgt.name}: d20+${atk} = ${total} vs AC ${tgt.ac} ✓ 命中 ${dmg} 火焰伤害（剩余 ${tgt.hp}）`);
      } else {
        b.log.push(`[${b.round}] ${c.name} 火焰箭(戏法) → ${tgt.name}: d20+${atk} = ${total} vs AC ${tgt.ac} ✗ 未命中`);
      }
      return true;
    }
    return false;
  }

  private _pcAttack(c: Combatant, tgt: Combatant, b: Battle,
                    sneak = false, ranged = false): boolean {
    const ch: any = c.source;
    const r = ch.ctx.combat.resolveAttack(ranged ? "ranged" : "melee", tgt.ac,
      false, false, sneak);
    const label = sneak ? "偷袭" : ranged ? "远程" : "近战";
    const pfx = r.penalty ? `${r.penalty}` : "";
    if (!r.hit) {
      b.log.push(`[${b.round}] ${c.name} ${label}攻击 ${tgt.name}: d20+${r.atk_bonus}${pfx} = ${r.total} vs AC ${tgt.ac} ✗ 未命中`);
      return true;
    }
    const applied = this._applyDamage(tgt, r.damage, "", b);
    c.damage_dealt += applied;
    b.log.push(`[${b.round}] ${c.name} ${label}攻击 ${tgt.name}: d20+${r.atk_bonus}${pfx} = ${r.total} vs AC ${tgt.ac} ✓ 命中 ${r.dmg_desc} → ${r.damage} 伤害（剩余 ${tgt.hp}）`);
    return true;
  }

  // ---------------- 怪物回合 ----------------
  private _monsterTurn(c: Combatant, b: Battle): void {
    const targets = b.party().filter((t) => t.alive);
    if (!targets.length) return;
    if (c.conditions.length) this._tryRecover(c, b);
    const target = this._aiPickTarget(c, targets);
    this._monsterAct(c, target, b);
  }

  private _tryRecover(c: Combatant, b: Battle): boolean {
    for (const cond of [...c.conditions]) {
      if (Math.random() < 0.5) {
        c.conditions = c.conditions.filter((x) => x !== cond);
        b.log.push(`[${b.round}] ${c.name} 摆脱了 ${cond}`);
        return true;
      }
    }
    return false;
  }

  private _aiPickTarget(c: Combatant, targets: Combatant[]): Combatant {
    if (c.wis >= AI_WIS_WOUNDED_THRESHOLD) {
      return targets.reduce((a, t) =>
        (t.hp / Math.max(t.max_hp, 1)) < (a.hp / Math.max(a.max_hp, 1))
          || ((t.hp / Math.max(t.max_hp, 1)) === (a.hp / Math.max(a.max_hp, 1)) && dist(c, t) < dist(c, a))
          ? t : a);
    }
    return targets.reduce((a, t) => (dist(c, t) < dist(c, a) ? t : a));
  }

  private _monsterAct(c: Combatant, tgt: Combatant, b: Battle): void {
    const d = dist(c, tgt);
    const action = this._aiPickAction(c, tgt, d);
    if (!action) {
      this._moveToward(c, tgt, MELEE_REACH, b);
      if (dist(c, tgt) <= MELEE_REACH) {
        const a = this._bestMelee(c, tgt);
        if (a) this._resolveMonsterAttack(c, tgt, a, b);
      } else {
        this._moveToward(c, tgt, MELEE_REACH, b, true);
      }
      return;
    }
    if (["ranged", "special", "spell"].includes(action.kind)) {
      this._resolveMonsterAttack(c, tgt, action, b);
      return;
    }
    this._moveToward(c, tgt, action.reach, b);
    if (dist(c, tgt) > action.reach) this._moveToward(c, tgt, action.reach, b, true);
    if (dist(c, tgt) <= action.reach && !c.action_used) {
      this._resolveMonsterAttack(c, tgt, action, b);
    }
  }

  private _aiPickAction(c: Combatant, tgt: Combatant, d: number): ActionNorm | null {
    let usable = c.actions.filter((a) => a.kind !== "utility" && !a.is_multi
      && this._rechargeOk(c, a));
    if (c.intl >= AI_INT_ADAPT_THRESHOLD) {
      const adapted = usable.filter((a) => !tgt.immune.has(a.dmg_type) && !tgt.resist.has(a.dmg_type));
      if (adapted.length) usable = adapted;
    }
    if (!usable.length) return null;
    if (c.intl >= AI_INT_OPTIMAL_THRESHOLD) {
      return usable.reduce((a, x) => this._expectedDmg(x, c, tgt) > this._expectedDmg(a, c, tgt) ? x : a);
    }
    for (const kind of ["special", "spell", "ranged", "melee"]) {
      const hit = usable.find((a) => a.kind === kind && d <= a.reach);
      if (hit) return hit;
    }
    return usable.reduce((a, x) => this._expectedDmg(x, c, tgt) > this._expectedDmg(a, c, tgt) ? x : a);
  }

  private _rechargeOk(c: Combatant, a: ActionNorm): boolean {
    return !a.recharge || c.recharge_ready[a.name] !== false;
  }

  private _expectedDmg(a: ActionNorm, c: Combatant, tgt: Combatant): number {
    const [cnt, die, bonus] = parseDice(a.dmg_expr);
    const avg = cnt ? (cnt * (die + 1) / 2 + bonus) : (a.kind === "special" ? 8 : 0);
    const hitChance = Math.max(0.05, Math.min(0.95, (21 - (tgt.ac - (a.atk || 0))) / 20));
    return avg * hitChance;
  }

  private _bestMelee(c: Combatant, tgt: Combatant): ActionNorm | null {
    const melee = c.actions.filter((a) => a.kind === "melee" && !a.is_multi
      && this._rechargeOk(c, a) && !tgt.immune.has(a.dmg_type));
    return melee.length
      ? melee.reduce((a, x) => this._expectedDmg(x, c, tgt) > this._expectedDmg(a, c, tgt) ? x : a)
      : null;
  }

  private _moveToward(c: Combatant, tgt: Combatant, reach: number, b: Battle, dash = false): void {
    const d = dist(c, tgt);
    const need = d - reach;
    if (need <= 0) return;
    let step = Math.min(c.move_left, need);
    if (step > 0) {
      c.x += tgt.x > c.x ? step : -step;
      c.move_left -= step;
      b.log.push(`[${b.round}] ${c.name} 移动 ${Math.floor(step)} 尺（距离 ${Math.floor(dist(c, tgt))} 尺）`);
    }
    if (dash && c.move_left <= 0 && !c.action_used) {
      c.move_left = c.speed;
      c.action_used = true;
      step = Math.min(c.move_left, Math.max(dist(c, tgt) - reach, 0));
      if (step > 0) {
        c.x += tgt.x > c.x ? step : -step;
        c.move_left -= step;
        b.log.push(`[${b.round}] ${c.name} 疾行 ${Math.floor(step)} 尺（距离 ${Math.floor(dist(c, tgt))} 尺）`);
      }
    }
  }

  // ---------------- 攻击结算 ----------------
  private _resolveMonsterAttack(c: Combatant, tgt: Combatant, a: ActionNorm, b: Battle): void {
    if (a.is_multi) {
      for (const [cnt, sub] of a.multi) {
        for (let i = 0; i < cnt; i++) {
          if (!tgt.alive) break;
          this._resolveMonsterAttack(c, tgt, sub, b);
        }
      }
      return;
    }
    const adv = this._advantage(c, tgt, a.kind === "melee");
    if (a.save) { this._resolveSaveAction(c, tgt, a, b, adv); return; }
    const roll = this._d20Adv(adv);
    const total = roll + (a.atk || 0);
    const crit = roll === CRIT_ROLL;
    if (total < tgt.ac && !crit) {
      b.log.push(`[${b.round}] ${c.name}·${a.name} → ${tgt.name}: d20+${a.atk || 0} = ${total} vs AC ${tgt.ac} ✗ 未命中`);
      return;
    }
    const [cnt, die, bonus] = parseDice(a.dmg_expr);
    let dmg = 0;
    let dmgDesc = "无伤害";
    if (cnt) {
      const rolls = Array.from({ length: cnt * (crit ? 2 : 1) }, () => rand(die));
      dmg = rolls.reduce((x: number, v: number) => x + v, 0) + bonus;
      dmgDesc = `${cnt}d${die}${bonus >= 0 ? "+" : ""}${bonus} = ${JSON.stringify(rolls)}`;
    }
    const applied = this._applyDamage(tgt, dmg, a.dmg_type, b);
    c.damage_dealt += applied;
    b.log.push(`[${b.round}] ${c.name}·${a.name} → ${tgt.name}: d20+${a.atk || 0} = ${total} vs AC ${tgt.ac} ✓ 命中${crit ? "（暴击）" : ""} ${dmgDesc} → ${dmg} ${a.dmg_type} 伤害（剩余 ${tgt.hp}）`);
    this._maybeApplyCondition(c, tgt, a, b);
  }

  private _resolveSaveAction(c: Combatant, tgt: Combatant, a: ActionNorm, b: Battle, adv: number): void {
    const save = a.save;
    const tgtBonus = this._saveBonusOf(tgt, save.axis);
    const roll = this._d20Adv(adv);
    const passed = roll + tgtBonus >= save.dc;
    const [cnt, die, bonus] = parseDice(a.dmg_expr);
    let dmg = 0;
    if (cnt) {
      dmg = Array.from({ length: cnt }, () => rand(die)).reduce((x: number, v: number) => x + v, 0) + bonus;
      if (passed) dmg = Math.floor(dmg / 2);
    }
    const applied = this._applyDamage(tgt, dmg, a.dmg_type, b);
    c.damage_dealt += applied;
    b.log.push(`[${b.round}] ${c.name}·${a.name} → ${tgt.name}: DC ${save.dc} ${save.axis} 豁免 d20+${tgtBonus} = ${roll + tgtBonus} ${passed ? "豁免通过" : "豁免失败"}` +
      (cnt ? `，${dmg} ${a.dmg_type} 伤害（剩余 ${tgt.hp}）` : ""));
    if (!passed && save.condition && !tgt.cond_immune.has(save.condition)) {
      this._applyCondition(tgt, save.condition, b);
    }
  }

  private _saveBonusOf(t: Combatant, axis: string): number {
    if (t.kind === "pc" && t.source) return t.source.saveBonus(axis);
    const attr = axis === "fort" ? "con" : axis === "ref" ? "dex" : "wis";
    return abilityMod((t as any)[attr] || 10);
  }

  // ---------------- 优势/劣势 ----------------
  private _advantage(attacker: Combatant, target: Combatant, melee = true): number {
    let adv = 0;
    const atkC = new Set(attacker.conditions);
    const tgtC = new Set(target.conditions);
    if (["目盲", "中毒", "束缚", "震慑", "惊惧"].some((x) => atkC.has(x))) adv -= 1;
    if (atkC.has("隐形")) adv += 1;
    if (tgtC.has("隐形")) adv -= 1;
    if (["束缚", "麻痹", "石化", "昏迷", "震慑"].some((x) => tgtC.has(x))) adv += 1;
    if (tgtC.has("倒地")) adv += melee ? 1 : -1;
    return Math.max(-1, Math.min(1, adv));
  }

  private _d20Adv(adv: number): number {
    const r1 = rand(20);
    if (adv === 0) return r1;
    const r2 = rand(20);
    return adv > 0 ? Math.max(r1, r2) : Math.min(r1, r2);
  }

  // ---------------- 伤害与状态 ----------------
  private _applyDamage(tgt: Combatant, amount: number, dtype: string, b: Battle): number {
    const dt = normalizeDamageType(dtype);
    if (dt && tgt.immune.has(dt)) {
      if (amount) b.log.push(`  ${tgt.name} 免疫 ${dt}`);
      return 0;
    }
    if (dt && tgt.resist.has(dt)) {
      amount = Math.max(Math.floor(amount / 2), 0);
      if (amount) b.log.push(`  ${tgt.name} 抵抗 ${dt}（减半）`);
    }
    if (dt && tgt.vuln.has(dt)) {
      amount *= 2;
      if (amount) b.log.push(`  ${tgt.name} 易伤 ${dt}（加倍）`);
    }
    tgt.hp = Math.max(tgt.hp - amount, 0);
    if (tgt.hp === 0 && tgt.kind === "pc") b.log.push(`  ${tgt.name} 倒地濒死！`);
    else if (tgt.hp === 0) b.log.push(`  ${tgt.name} 被击杀！`);
    return amount;
  }

  private _applyCondition(tgt: Combatant, cond: string, b: Battle): void {
    if (tgt.cond_immune.has(cond) || tgt.conditions.includes(cond)) return;
    tgt.conditions.push(cond);
    b.log.push(`  ${tgt.name} 陷入 ${cond}`);
  }

  private _maybeApplyCondition(_c: Combatant, tgt: Combatant, a: ActionNorm, b: Battle): void {
    if (a.save && a.save.condition) return;
    if (!a.extra) return;
    for (const [kw, zh] of Object.entries(CONDITION_KEYWORDS)) {
      if (new RegExp(`\\b${kw}\\b`, "i").test(a.extra) && Math.random() < 0.25) {
        this._applyCondition(tgt, zh, b);
        return;
      }
    }
  }

  // ---------------- 死亡豁免 ----------------
  private _deathSave(c: Combatant, b: Battle): void {
    if (c.death_success >= DEATH_SAVE_SUCCESSES) {
      b.log.push(`[${b.round}] ${c.name} 伤势已稳定（0 HP）`);
      return;
    }
    const roll = rand(20);
    if (roll === 20) {
      c.hp = 1; c.death_failure = 0;
      b.log.push(`[${b.round}] ${c.name} 死亡豁免掷出 20！恢复 1 HP 重回战斗`);
    } else if (roll === 1) {
      c.death_failure += 2;
      b.log.push(`[${b.round}] ${c.name} 死亡豁免掷出 1（计 2 次失败，${c.death_failure}/${DEATH_SAVE_FAILURES}）`);
    } else if (roll >= DEATH_SAVE_TARGET) {
      c.death_success += 1;
      b.log.push(`[${b.round}] ${c.name} 死亡豁免成功（${c.death_success}/${DEATH_SAVE_SUCCESSES}）`);
    } else {
      c.death_failure += 1;
      b.log.push(`[${b.round}] ${c.name} 死亡豁免失败（${c.death_failure}/${DEATH_SAVE_FAILURES}）`);
    }
    if (c.death_failure >= DEATH_SAVE_FAILURES) b.log.push(`☠ ${c.name} 死亡！`);
  }

  // ---------------- 传奇动作 ----------------
  private _legendaryPhase(b: Battle, justActed: number): void {
    for (let i = 0; i < b.combatants.length; i++) {
      const c = b.combatants[i];
      if (i === justActed || !c.alive || !c.legendary.length) continue;
      const targets = b.combatants.filter((t) => t.side !== c.side && t.alive);
      if (!targets.length) continue;
      const tgt = this._aiPickTarget(c, targets);
      const a = c.legendary.reduce((x, y) => this._expectedDmg(y, c, tgt) > this._expectedDmg(x, c, tgt) ? y : x);
      this._resolveMonsterAttack(c, tgt, a, b);
    }
  }

  // ---------------- 胜负与结算 ----------------
  private _checkEnd(b: Battle): boolean {
    const partyAlive = b.party().some((p) => p.hp > 0);
    const foesAlive = b.foes().some((f) => f.alive);
    if (!partyAlive) {
      b.over = true; b.winner = "foe";
      b.log.push(`战斗结束：冒险者全军覆没（${b.round} 回合）`);
      return true;
    }
    if (!foesAlive) {
      b.over = true; b.winner = "party";
      b.log.push(`战斗结束：冒险者获胜（${b.round} 回合，获得 ${b.total_xp} XP）`);
      return true;
    }
    return false;
  }

  result(b: Battle): Record<string, any> {
    const aliveParty = b.party().filter((p) => p.alive);
    return {
      winner: b.winner || (b.party().some((p) => p.alive) ? "party" : "foe"),
      rounds: b.round,
      turns: b.turn_index + b.round * b.order.length,
      total_xp: b.total_xp,
      party_hp: aliveParty.reduce((a, p) => a + p.hp, 0),
      party_down: b.party().filter((p) => p.kind === "pc" && p.hp <= 0).length,
      foes_left: b.foes().filter((f) => f.alive).length,
      log: [...b.log],
    };
  }

  report(b: Battle): string {
    const lines = ["=".repeat(46), `模拟对战报告（${b.round} 回合结束）`, "=".repeat(46)];
    lines.push(`结果: ${b.winner === "party" ? "冒险者获胜" : b.winner === "foe" ? "敌人获胜" : "平局"} | 敌人总数 ${b.foes().length} | 获得 ${b.total_xp} XP`);
    lines.push("");
    lines.push("— 战况 —");
    for (const c of [...b.combatants].sort((x, y) => x.side.localeCompare(y.side) || y.hp - x.hp)) {
      const hpbar = "█".repeat(Math.max(1, Math.round(c.hp / Math.max(c.max_hp, 1) * 16)));
      let status = "";
      if (c.hp <= 0 && c.kind === "pc") status = "（濒死/死亡）";
      else if (c.hp <= 0) status = "（已死亡）";
      else if (c.conditions.length) status = `（${c.conditions.join("、")}）`;
      lines.push(`  ${c.side === "party" ? "🛡" : "👹"} ${c.name.padEnd(12, " ")} HP ${String(c.hp).padStart(3)}/${c.max_hp} ${hpbar}${status}`);
    }
    lines.push("");
    lines.push("— 战斗日志（最近 30 条）—");
    lines.push(...b.log.slice(-30));
    return lines.join("\n");
  }

  state(b: Battle): Record<string, any> {
    return {
      round: b.round, over: b.over, winner: b.winner,
      combatants: b.combatants.map((c) => ({
        name: c.name, side: c.side, hp: c.hp, max_hp: c.max_hp,
        ac: c.ac, conditions: [...c.conditions], init: c.init, x: c.x, cr: c.cr,
      })),
    };
  }

  // ---------------- 蒙特卡洛 ----------------
  simulate(party: any[], foes: any[], trials = 100,
           maxRounds?: number, resetState = true): Record<string, any> {
    let wins = 0; let losses = 0; let draws = 0;
    let roundsSum = 0; let hpSum = 0;
    const snapshots = party.map((ch) => ({
      ch, hp: ch.state.currentHp,
      slots: { ...ch.state.slotsUsed }, conds: [...ch.state.conditions],
    }));
    for (let i = 0; i < trials; i++) {
      this._restore(snapshots);
      const b = this.newBattle(party, foes);
      const r = this.run(b, maxRounds);
      if (r.winner === "party") wins++;
      else if (r.winner === "foe") losses++;
      else draws++;
      roundsSum += r.rounds;
      hpSum += r.party_hp;
    }
    this._restore(snapshots);
    return {
      trials,
      win_rate: Math.round((wins / trials) * 10000) / 10000,
      loss_rate: Math.round((losses / trials) * 10000) / 10000,
      draw_rate: Math.round((draws / trials) * 10000) / 10000,
      avg_rounds: Math.round((roundsSum / trials) * 100) / 100,
      avg_remaining_hp: Math.round((hpSum / trials) * 10) / 10,
    };
  }

  private _restore(snapshots: any[]): void {
    for (const s of snapshots) {
      s.ch.state.currentHp = s.hp;
      s.ch.state.slotsUsed = { ...s.slots };
      s.ch.state.conditions = [...s.conds];
    }
  }

  // ---------------- 遭遇构建（DMG 2014） ----------------
  xpBudget(levels: number[], difficulty = "medium"): number {
    return (this.partyThresholds(levels) as any)[difficulty] || 0;
  }

  partyThresholds(levels: number[]): Record<string, number> {
    const out: Record<string, number> = {};
    for (const d of DIFFICULTIES) out[d] = 0;
    for (const lv of levels) {
      const row = (XP_THRESHOLDS as any)[Math.max(1, Math.min(20, Math.floor(lv)))];
      if (row) for (const d of DIFFICULTIES) out[d] += row[d];
    }
    return out;
  }

  encounterMultiplier(count: number, partySize = 4): number {
    let mult = 1.0;
    const ladder = [1.0, 1.5, 2.0, 2.5, 3.0, 4.0];
    const bands = [[1, 1], [2, 2], [3, 6], [7, 10], [11, 14], [15, 10 ** 6]];
    for (let i = 0; i < bands.length; i++) {
      if (count >= bands[i][0] && count <= bands[i][1]) { mult = ladder[i]; break; }
    }
    const idx = ladder.indexOf(mult);
    if (partySize < 3) mult = ladder[Math.min(idx + 1, ladder.length - 1)];
    else if (partySize >= 6) mult = ladder[Math.max(idx - 1, 0)];
    return mult;
  }

  evaluate(levels: number[], monsters: string[]): Record<string, any> {
    const baseXp = monsters.reduce((a, n) =>
      a + ((this.CR_XP as any)[(this.MONSTERS as any)[n]?.cr] || 0), 0);
    const mult = this.encounterMultiplier(monsters.length, levels.length);
    const adjusted = Math.round(baseXp * mult);
    const th = this.partyThresholds(levels);
    let difficulty = "trivial";
    for (const d of DIFFICULTIES) if (adjusted >= th[d]) difficulty = d;
    return {
      monsters, base_xp: baseXp, adjusted_xp: adjusted, multiplier: mult,
      thresholds: th, difficulty,
      difficulty_cn: (DIFFICULTY_CN as any)[difficulty],
      daily_budget: levels.reduce((a, lv) =>
        a + ((DAILY_XP_BUDGET as any)[Math.max(1, Math.min(20, lv))] || 0), 0),
    };
  }

  buildEncounter(levels: number[], difficulty = "medium",
                 targetCount?: number): Record<string, any> {
    const th = this.partyThresholds(levels);
    const hi = DIFFICULTIES[Math.min(DIFFICULTIES.indexOf(difficulty) + 1, DIFFICULTIES.length - 1)];
    const target = Math.floor((th[difficulty] + (difficulty !== "deadly" ? th[hi] : th.deadly * 2)) / 2);
    const avgLv = levels.reduce((a, b) => a + b, 0) / levels.length;
    const pool = Object.keys(this.MONSTERS).sort((a, b) =>
      Math.abs(this._crValue(a) - avgLv) - Math.abs(this._crValue(b) - avgLv));
    const maxCount = targetCount ?? (difficulty === "easy" || difficulty === "medium" ? 4 : 6);
    let chosen: string[] = [];
    for (const n of pool) {
      if (chosen.length >= maxCount) break;
      const xp = (this.CR_XP as any)[(this.MONSTERS as any)[n].cr] || 0;
      if (xp <= 0) continue;
      const trial = [...chosen, n];
      const adj = Math.round(trial.reduce((a, m) =>
        a + ((this.CR_XP as any)[(this.MONSTERS as any)[m].cr] || 0), 0)
        * this.encounterMultiplier(trial.length, levels.length));
      if (adj > target * 1.25) continue;
      chosen = trial;
      if (adj >= th[difficulty]) break;
    }
    if (!chosen.length) chosen = [pool[0]];
    let ev = this.evaluate(levels, chosen);
    while (ev.difficulty !== difficulty && chosen.length > 1) {
      const smaller = chosen.reduce((a, m) =>
        ((this.CR_XP as any)[(this.MONSTERS as any)[m].cr] || 0) <
        ((this.CR_XP as any)[(this.MONSTERS as any)[a].cr] || 0) ? m : a);
      const bigger = chosen.reduce((a, m) =>
        ((this.CR_XP as any)[(this.MONSTERS as any)[m].cr] || 0) >
        ((this.CR_XP as any)[(this.MONSTERS as any)[a].cr] || 0) ? m : a);
      if (smaller === bigger) break;
      chosen = chosen.filter((m) => m !== smaller);
      ev = this.evaluate(levels, chosen);
    }
    (ev as any).party_levels = levels;
    return ev;
  }

  private _crValue(name: string): number {
    const cr = (this.MONSTERS as any)[name].cr;
    if (cr.includes("/")) {
      const [a, b] = cr.split("/");
      return Number(a) / Number(b);
    }
    const v = Number(cr);
    return Number.isNaN(v) ? 99 : v;
  }
}
