/**
 * d20.web engine/equipment - 装备系统服务
 *
 * 与 Python d20/equipment.py 1:1。装备来源两库合一（决策 M）：
 * - data.EQUIPMENT_LIBRARY  手工库 41 件（既有行为不变）
 * - data.SRD_EQUIPMENT      SRD 权威库 237 件，CP 由金币按 3×log10(金币+1) 折算
 *
 * resolve() 把两库统一为同构 7 元组，因此护甲加值、敏捷上限、灵巧判定等逻辑
 * 对两库一致生效。护甲/盾牌技能要求可由职业装备熟练（ClassService 可选增强）
 * 或种族特性豁免。挂到 ctx.equipment。
 */
import { Service } from "./core";
import { EQUIPMENT_LIBRARY, ARMOR_PROFICIENCY, FINESSE_WEAPONS, SRD_EQUIPMENT } from "./data";

const T_WEAPON = "武器";
const T_ARMOR = "护甲";
const T_SHIELD = "盾牌";
const ARMOR_SUBS = ["轻甲", "中甲", "重甲"];

/** SRD 装备 CP 折算（决策 M）：3×log10(金币+1)，下限 1、上限 30。 */
export function srdCpCost(costGp: number): number {
  return Math.max(1, Math.min(30, Math.round(3 * Math.log10(Math.max(costGp, 0) + 1))));
}

export class EquipmentService extends Service {
  static inject: string[] = [];
  EQUIPMENT_LIBRARY = EQUIPMENT_LIBRARY;
  ARMOR_PROFICIENCY = ARMOR_PROFICIENCY;
  FINESSE_WEAPONS = FINESSE_WEAPONS;
  SRD_EQUIPMENT = SRD_EQUIPMENT;

  /** SRD 装备记录 -> 与手工库同构的 7 元组。 */
  private _srdTuple(name: string): any[] | null {
    const v = this.SRD_EQUIPMENT[name];
    if (!v) return null;
    const cat = v.cat;
    const sub: string = v.sub || "";
    const weight = v.weight || 0;
    const cp = srdCpCost(v.cost_gp || 0);
    if (cat === T_WEAPON) {
      const dtype = sub.includes("近战") ? "近战" : sub.includes("远程") ? "远程" : "近战";
      const props: string[] = v.properties || [];
      let desc = `${v.damage} ${v.damage_type || ""}`.trim();
      if (v.two_handed) desc += `，双手${v.two_handed}`;
      if (props.length) desc += `，${props.join("、")}`;
      return [T_WEAPON, dtype, 0, 99, weight, desc, cp];
    }
    if (cat === T_ARMOR) {
      // 手工库存「加值」；SRD 的 armor_class 是「总 AC」
      const bonus = (v.armor_class ?? 10) - 10;
      const maxDex = sub === "轻甲" ? 99 : sub === "中甲" ? 2 : sub === "重甲" ? 0 : 99;
      let desc = `AC ${v.armor_class}`;
      desc += v.armor_dex ? " + 敏捷" : "，无敏捷加值";
      if (v.str_min) desc += `，需力量${v.str_min}`;
      if (v.stealth_dis) desc += "，隐匿劣势";
      return [T_ARMOR, sub, bonus, maxDex, weight, desc, cp];
    }
    if (cat === T_SHIELD) {
      const bonus = v.armor_class ?? 2;
      return [T_SHIELD, T_SHIELD, bonus, 99, weight, `AC +${bonus} 盾牌加值`, cp];
    }
    return null;
  }

  /** 统一解析：手工库优先，回退 SRD 库。 */
  resolve(itemName: string): any[] | null {
    if (itemName in this.EQUIPMENT_LIBRARY) return this.EQUIPMENT_LIBRARY[itemName];
    return this._srdTuple(itemName);
  }

  equipItem(itemName: string): [boolean, string] {
    const st = this.ctx.state;
    const info = this.resolve(itemName);
    if (!info) return [false, "未知装备"];
    const [etype, sub, , , , , cpCost] = info;

    if (etype === T_ARMOR || etype === T_SHIELD) {
      const exempt = (st.race === "山地矮人" && sub === "中甲") || this._hasGearProf(sub);
      if (!exempt) {
        const reqSkill = this.ARMOR_PROFICIENCY[sub];
        if (reqSkill && (st.skills[reqSkill] || 0) < 1)
          return [false, `需要 ${reqSkill} 至少1级才能装备${sub}`];
      }
    }
    if (st.cp < cpCost) return [false, `CP不足，需要 ${cpCost} CP`];

    st.cp -= cpCost;
    st.equipment.push(itemName);
    st.purchases += 1;
    this.recalcArmorBonus();
    this.ctx.emit("character/changed", "equipment");
    return [true, `装备了 ${itemName}，消耗 ${cpCost} CP`];
  }

  unequipItem(itemName: string): [boolean, string] {
    const st = this.ctx.state;
    if (!st.equipment.includes(itemName)) return [false, "未装备此物品"];
    const info = this.resolve(itemName);
    st.equipment = st.equipment.filter((x: string) => x !== itemName);
    const cpCost = info ? info[6] : 0;
    st.cp += cpCost;
    this.recalcArmorBonus();
    return [true, `卸下了 ${itemName}，返还 ${cpCost} CP`];
  }

  /** 职业装备熟练（「全部护甲」覆盖轻/中/重甲）；未挂载 classes 时恒为 false。 */
  private _hasGearProf(sub: string): boolean {
    if (!this.ctx.has("classes")) return false;
    const profs: string[] = this.ctx.state.gearProficiencies || [];
    if (profs.includes(sub)) return true;
    return ARMOR_SUBS.includes(sub) && profs.includes("全部护甲");
  }

  recalcArmorBonus(): void {
    const st = this.ctx.state;
    let totalArmor = 0;
    let bestMaxDex = 99;
    for (const item of st.equipment) {
      const info = this.resolve(item);
      if (info && (info[0] === T_ARMOR || info[0] === T_SHIELD)) {
        totalArmor += info[2];
        if (info[3] < bestMaxDex) bestMaxDex = info[3];
      }
    }
    st.armorBonus = totalArmor;
    st._armorMaxDex = bestMaxDex;
  }

  getEquippedWeapon(): string {
    const st = this.ctx.state;
    for (const item of st.equipment) {
      const info = this.resolve(item);
      if (info && info[0] === T_WEAPON) return item;
    }
    return "徒手";
  }

  hasFinesseWeapon(): boolean {
    const st = this.ctx.state;
    return st.equipment.some((w: string) => {
      const info = this.resolve(w);
      if (!info || info[0] !== T_WEAPON) return false;
      if (this.FINESSE_WEAPONS.has(w)) return true;
      const rec = this.SRD_EQUIPMENT[w];
      return !!(rec && (rec.properties || []).includes("灵巧"));
    });
  }

  // ---------- v2.1：SRD 装备检索 ----------
  gearInfo(name: string): any { return this.SRD_EQUIPMENT[name]; }

  gearCategories(): string[] {
    return Array.from(new Set(Object.values(this.SRD_EQUIPMENT).map((v: any) => v.cat)))
      .filter(Boolean)
      .sort();
  }

  gearByCategory(cat: string): string[] {
    return Object.keys(this.SRD_EQUIPMENT).filter((k) => this.SRD_EQUIPMENT[k].cat === cat);
  }

  parseDamage(expr: string): [number, number] {
    const m = /^\s*(\d*)\s*d\s*(\d+)\s*$/.exec(expr || "");
    return m ? [m[1] ? Number(m[1]) : 1, Number(m[2])] : [0, 0];
  }
}
