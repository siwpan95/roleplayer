/**
 * d20.web engine/reference - SRD 规则速查服务（DM 侧只读查询）
 *
 * 与 Python d20/reference.py 1:1。把 v2.1 新增的四类 SRD 数据（职业/装备/熟练/
 * 参考常量）暴露为只读查询能力，不改动任何既有战斗或点数逻辑。
 */
import { Service } from "./core";
import {
  CLASSES, CLASS_LEVELS, SUBCLASSES, FEATURES,
  SRD_EQUIPMENT, WEAPON_PROPERTIES, PROFICIENCIES,
  ABILITY_SCORES, ALIGNMENTS, DAMAGE_TYPES, MAGIC_SCHOOLS,
  LANGUAGES, SRD_SKILLS, RULES, RULE_SECTIONS,
} from "./data";

/** 查询名 -> 数据表（lookup 统一入口） */
export const REFERENCE_TABLES: Record<string, Record<string, any>> = {
  属性值: ABILITY_SCORES,
  阵营: ALIGNMENTS,
  伤害类型: DAMAGE_TYPES,
  魔法学派: MAGIC_SCHOOLS,
  语言: LANGUAGES,
  技能: SRD_SKILLS,
  规则: RULES,
  规则章节: RULE_SECTIONS,
  装备: SRD_EQUIPMENT,
  武器属性: WEAPON_PROPERTIES,
  熟练: PROFICIENCIES,
  职业: CLASSES,
  子职业: SUBCLASSES,
  特性: FEATURES,
};

function descOf(rec: any): string {
  if (!rec) return "";
  const d = rec.desc_en;
  return Array.isArray(d) ? d.join("\n") : d || "";
}

export class ReferenceService extends Service {
  static inject: string[] = [];
  TABLES = REFERENCE_TABLES;
  RULE_SECTIONS = RULE_SECTIONS;
  SRD_EQUIPMENT = SRD_EQUIPMENT;

  // ---------------- 通用 ----------------
  kinds(): string[] { return Object.keys(this.TABLES); }
  lookup(kind: string, name: string): any { return (this.TABLES[kind] || {})[name]; }
  count(kind: string): number { return Object.keys(this.TABLES[kind] || {}).length; }
  names(kind: string): string[] { return Object.keys(this.TABLES[kind] || {}); }

  // ---------------- 规则速查 ----------------
  rule(name: string): string { return descOf(this.RULE_SECTIONS[name]); }

  searchRules(keyword: string, limit = 8): string[] {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return [];
    const hits: string[] = [];
    for (const zh of Object.keys(this.RULE_SECTIONS)) {
      const rec = this.RULE_SECTIONS[zh];
      const hay = `${zh} ${rec.en || ""} ${descOf(rec)}`.toLowerCase();
      if (hay.includes(kw)) hits.push(zh);
      if (hits.length >= limit) break;
    }
    return hits;
  }

  // ---------------- 装备 ----------------
  gear(name: string): any { return this.SRD_EQUIPMENT[name]; }

  gearByCategory(cat: string): string[] {
    return Object.keys(this.SRD_EQUIPMENT).filter((k) => this.SRD_EQUIPMENT[k].cat === cat);
  }

  gearCategories(): string[] {
    return Array.from(new Set(Object.values(this.SRD_EQUIPMENT).map((v: any) => v.cat)))
      .filter(Boolean)
      .sort();
  }

  weapon(name: string): any {
    const v = this.SRD_EQUIPMENT[name];
    if (!v || v.cat !== "武器") return undefined;
    return {
      damage: v.damage, damage_type: v.damage_type, two_handed: v.two_handed,
      range: v.range, properties: v.properties, cost_gp: v.cost_gp,
      weight: v.weight, sub: v.sub,
    };
  }

  armor(name: string): any {
    const v = this.SRD_EQUIPMENT[name];
    if (!v || v.cat !== "护甲") return undefined;
    return {
      armor_class: v.armor_class, armor_dex: v.armor_dex, str_min: v.str_min,
      stealth_dis: v.stealth_dis, cost_gp: v.cost_gp, weight: v.weight, sub: v.sub,
    };
  }

  // ---------------- 职业 / 特性 ----------------
  classInfo(name: string): any { return CLASSES[name]; }
  classLevels(name: string): Record<string, any> { return { ...(CLASS_LEVELS[name] || {}) }; }
  feature(name: string): any { return FEATURES[name]; }

  // ---------------- 枚举翻译 ----------------
  damageType(name: string): any { return DAMAGE_TYPES[name]; }
  magicSchool(name: string): any { return MAGIC_SCHOOLS[name]; }
  language(name: string): any { return LANGUAGES[name]; }
  alignment(name: string): any { return ALIGNMENTS[name]; }
  abilityScore(name: string): any { return ABILITY_SCORES[name]; }
  skill(name: string): any { return SRD_SKILLS[name]; }
  weaponProperty(name: string): any { return WEAPON_PROPERTIES[name]; }
  proficiency(name: string): any { return PROFICIENCIES[name]; }
}
