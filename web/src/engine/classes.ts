/**
 * d20.web engine/classes - 职业系统服务（决策 G 递增标价 / 决策 L 创建期选择）
 *
 * 与 Python d20/classes.py 1:1。12 职业：创建期选择（1 级免费），之后逐级 CP 购买。
 * 职业授予三类熟练（决策 H 三轨）并驱动生命骰、施法者等级与特性表：
 *   - 技能熟练 -> state.proficiencies（+2 有效等级）
 *   - 装备熟练 -> state.gearProficiencies（equipment 校验时豁免技能要求）
 *   - 豁免熟练 -> state.saveProficiencies（derived.saveBonus +2）
 *
 * 被依赖方（slots / rest / equipment / derived）一律以 ctx.has("classes") 做
 * **可选增强**：卸载本服务后自动回落原行为（Cordis「卸载即失效」语义）。
 */
import { Service } from "./core";
import {
  CLASS_LEVEL_COST_BRACKETS, CLASS_LEVEL_MAX, PROFICIENCY_BONUS, SUBCLASS_MIN_LEVEL,
  CLASSES, CLASS_LEVELS, SUBCLASSES, FEATURES,
} from "./data";

/** 购买第 level 级所需 CP（1 级为 0 CP）。 */
export function levelUpCost(level: number): number {
  for (const [low, high, price] of CLASS_LEVEL_COST_BRACKETS) {
    if (level >= low && level <= high) return price;
  }
  return 0;
}

/** 从 1 级升到 level 级的累计 CP。 */
export function cumulativeCost(level: number): number {
  let total = 0;
  for (let lv = 1; lv <= level; lv++) total += levelUpCost(lv);
  return total;
}

export class ClassService extends Service {
  static inject: string[] = [];
  CLASSES = CLASSES;
  CLASS_LEVELS = CLASS_LEVELS;
  SUBCLASSES = SUBCLASSES;
  FEATURES = FEATURES;

  // ---------------- 选择 / 升级 ----------------
  setClass(name: string, choices: string[] = []): [boolean, string] {
    const st = this.ctx.state;
    if (!(name in this.CLASSES)) return [false, `未知职业: ${name}`];
    if (st.cls) return [false, `已选择职业: ${st.cls}`];
    // 决策 L：创建期限定（与种族/背景一致）
    if (st.purchases > 0) return [false, "职业仅可在创建期（未购买任何内容前）选择"];

    const tpl = this.CLASSES[name];
    st.cls = name;
    st.level = 1;
    st.subclass = "";
    this._applyProficiencies(tpl, choices);
    this.ctx.emit("character/changed", "class");
    const pool: string[] = tpl.skill_choices || [];
    const picked = st.proficiencies.filter((s: string) => pool.includes(s));
    return [
      true,
      `选择职业 ${name}（1 级，免费）；熟练技能: ${picked.join("/") || "无"}；生命骰 d${tpl.hit_die}`,
    ];
  }

  private _applyProficiencies(tpl: any, choices: string[]): void {
    const st = this.ctx.state;
    const pool: string[] = tpl.skill_choices || [];
    const want: number = tpl.skill_choice_count || 0;
    const picks: string[] = choices.filter((s) => pool.includes(s)).slice(0, want);
    if (picks.length < want) {
      picks.push(...pool.filter((s) => !picks.includes(s)).slice(0, want - picks.length));
    }
    for (const s of [...picks, ...(tpl.skill_profs || [])]) {
      if (!st.proficiencies.includes(s)) st.proficiencies.push(s);
    }
    for (const g of tpl.gear_profs || []) {
      if (!st.gearProficiencies.includes(g)) st.gearProficiencies.push(g);
    }
    for (const sv of tpl.saves || []) {
      if (!st.saveProficiencies.includes(sv)) st.saveProficiencies.push(sv);
    }
  }

  levelUp(): [boolean, string] {
    const st = this.ctx.state;
    if (!st.cls) return [false, "尚未选择职业"];
    const next = st.level + 1;
    if (next > CLASS_LEVEL_MAX) return [false, `职业等级已达上限 ${CLASS_LEVEL_MAX}`];
    const cost = levelUpCost(next);
    if (st.cp < cost) return [false, `CP不足，升至 ${next} 级需要 ${cost} CP，当前剩余 ${st.cp} CP`];
    st.cp -= cost;
    st.level = next;
    st.purchases += 1;
    this.ctx.emit("character/changed", "class-level");
    const gained = this.featuresAt(next);
    return [true, `${st.cls} 升至 ${next} 级，消耗 ${cost} CP；新增特性: ${gained.join("/") || "无"}`];
  }

  levelTo(target: number): [boolean, string] {
    const st = this.ctx.state;
    if (!st.cls) return [false, "尚未选择职业"];
    if (target <= st.level) return [false, `目标等级 ${target} 未高于当前 ${st.level} 级`];
    if (target > CLASS_LEVEL_MAX) return [false, `职业等级上限为 ${CLASS_LEVEL_MAX}`];
    const total = cumulativeCost(target) - cumulativeCost(st.level);
    if (st.cp < total) return [false, `CP不足，升至 ${target} 级共需 ${total} CP，当前剩余 ${st.cp} CP`];
    st.cp -= total;
    st.level = target;
    st.purchases += 1;
    this.ctx.emit("character/changed", "class-level");
    return [true, `${st.cls} 升至 ${target} 级，消耗 ${total} CP`];
  }

  setSubclass(name: string): [boolean, string] {
    const st = this.ctx.state;
    if (!st.cls) return [false, "尚未选择职业"];
    if (!(name in this.SUBCLASSES)) return [false, `未知子职业: ${name}`];
    if (this.SUBCLASSES[name].class !== st.cls) return [false, `${name} 不属于 ${st.cls}`];
    if (st.level < SUBCLASS_MIN_LEVEL)
      return [false, `需要 ${st.cls} 等级 >= ${SUBCLASS_MIN_LEVEL} 才能选择子职业`];
    if (st.subclass) return [false, `已选择子职业: ${st.subclass}`];
    st.subclass = name;
    this.ctx.emit("character/changed", "subclass");
    return [true, `${st.cls} 选择子职业 ${name}`];
  }

  // ---------------- 查询 ----------------
  info(name?: string): any {
    return this.CLASSES[name || this.ctx.state.cls];
  }

  levelData(level?: number): any {
    const st = this.ctx.state;
    if (!st.cls) return {};
    const lv = level || st.level;
    return (this.CLASS_LEVELS[st.cls] || {})[String(lv)] || {};
  }

  hitDie(): number {
    const tpl = this.info();
    return tpl ? tpl.hit_die : 6;
  }

  profBonus(): number {
    return this.levelData().prof_bonus || 0;
  }

  casterLevel(): number {
    const tpl = this.info();
    if (!tpl || !tpl.spellcasting) return 0;
    const lv = this.ctx.state.level;
    const prog = tpl.spellcasting.progression;
    if (prog === "full") return lv;
    if (prog === "half") return Math.ceil(lv / 2);
    if (prog === "pact") return lv;
    return 0;
  }

  maxRing(): number {
    const tpl = this.info();
    if (!tpl || !tpl.spellcasting) return 0;
    const lv = this.ctx.state.level;
    const prog = tpl.spellcasting.progression;
    if (prog === "full") return Math.min(9, Math.floor((lv + 1) / 2));
    if (prog === "half") return Math.min(5, Math.floor((Math.ceil(lv / 2) + 1) / 2));
    if (prog === "pact") return Math.min(5, Math.ceil(lv / 2));
    return 0;
  }

  spellSlots(): Record<number, number> {
    const sp = this.levelData().spellcasting;
    if (!sp || !sp.slots) return {};
    const out: Record<number, number> = {};
    for (const k of Object.keys(sp.slots)) out[Number(k)] = sp.slots[k];
    return out;
  }

  classSpecific(): Record<string, any> {
    return this.levelData().class_specific || {};
  }

  featuresAt(level: number): string[] {
    const st = this.ctx.state;
    if (!st.cls) return [];
    const rec = (this.CLASS_LEVELS[st.cls] || {})[String(level)];
    return rec ? [...(rec.features || [])] : [];
  }

  features(upto?: number): string[] {
    const st = this.ctx.state;
    if (!st.cls) return [];
    const top = upto || st.level;
    const out: string[] = [];
    for (let lv = 1; lv <= top; lv++) {
      for (const f of this.featuresAt(lv)) if (!out.includes(f)) out.push(f);
    }
    const sub = this.SUBCLASSES[st.subclass];
    if (sub) for (const f of sub.features || []) if (!out.includes(f)) out.push(f);
    return out;
  }

  featureDetail(name: string): any {
    return this.FEATURES[name];
  }

  hasGearProf(gear: string): boolean {
    return this.ctx.state.gearProficiencies.includes(gear);
  }

  hasSaveProf(saveSkill: string): boolean {
    return this.ctx.state.saveProficiencies.includes(saveSkill);
  }

  saveBonusAdjust(saveSkill: string): number {
    return this.hasSaveProf(saveSkill) ? PROFICIENCY_BONUS : 0;
  }

  summary(): string {
    const st = this.ctx.state;
    if (!st.cls) return "无职业";
    let s = `${st.cls} ${st.level} 级`;
    if (st.subclass) s += `（${st.subclass}）`;
    return s;
  }
}
