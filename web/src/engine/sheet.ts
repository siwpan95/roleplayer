/**
 * d20.web engine/sheet - 角色卡渲染服务
 *
 * 将 Character 的全部状态渲染为可读的纯文本角色卡。挂到 ctx.sheet。
 */
import { Service } from "./core";
import { abilityMod } from "./data";

export class SheetService extends Service {
  static inject: string[] = ["perks", "skills", "equipment", "derived", "slots", "race", "background", "feats", "rest", "condition"];

  showSheet(): string {
    const st = this.ctx.state;
    const lines: string[] = ["=".repeat(40), "角色卡", "=".repeat(40)];
    lines.push(`剩余 CP: ${st.cp}`);
    lines.push("属性: " + Object.entries(st.attributes).map(([a, v]) => `${a}:${v}`).join(", "));
    lines.push("优点: " + (st.advantages.length ? st.advantages.join(", ") : "优点: 无"));
    lines.push(st.disadvantages.length
      ? "缺点: " + st.disadvantages.map(([n, r]: [string, number]) => `${n}(+${r})`).join(", ")
      : "缺点: 无");
    lines.push(st.talents.length
      ? "天赋: " + st.talents.map(([n, l]: [string, number]) => `${n} Lv.${l}`).join(", ")
      : "天赋: 无");

    // ---- 扩充子系统 ----
    lines.push("种族: " + (st.race || "无"));
    lines.push(st.background ? `背景: ${st.background}（${this.ctx.background.feature()}）` : "背景: 无");
    // ---- v2.1：职业（等级/子职业/特性/职业法术位）----
    if (st.cls && this.ctx.has("classes")) {
      const cls = (this.ctx as any).classes;
      lines.push(`职业: ${cls.summary()} | 生命骰 d${cls.hitDie()} | 熟练加值 +${cls.profBonus()}`);
      const feats: string[] = cls.features();
      if (feats.length) lines.push("职业特性: " + feats.join("、"));
      const cslots: Record<number, number> = cls.spellSlots();
      const slotTxt = Object.keys(cslots).map(Number).sort((a, b) => a - b)
        .map((r) => `${r}环×${cslots[r]}`).join(" | ");
      if (slotTxt) lines.push("职业法术位: " + slotTxt);
      if ((st.gearProficiencies || []).length)
        lines.push("装备熟练: " + st.gearProficiencies.join("、"));
      if ((st.saveProficiencies || []).length)
        lines.push("豁免熟练: " + st.saveProficiencies.join("、"));
    } else {
      lines.push("职业: 无");
    }

    lines.push("专长: " + (st.feats.length ? st.feats.join(", ") : "无"));
    if (st.proficiencies.length) lines.push("熟练(+2): " + st.proficiencies.join(", "));
    if (Object.keys(st.slots).length) {
      lines.push("法术位: " + this.ctx.slots.slotTable()
        .map(([ring, used, owned]: [number, number, number]) => `${ring}环 ${used}/${owned}`).join(" | "));
    } else lines.push("法术位: 无");

    lines.push("--- 技能 ---");
    for (const [skill, rank] of Object.entries(st.skills).sort(([a], [b]) => (a < b ? -1 : 1))) {
      const bonus = (this.ctx as any).perks.getTalentBonus(skill);
      const total = (rank as number) + bonus;
      const bonusStr = bonus ? `(+${bonus})` : "";
      lines.push(`${skill}: ${rank}${bonusStr} = ${total}`);
    }

    const unlearned = Object.keys((this.ctx as any).skills.SKILL_LIBRARY).filter(
      (s) => !(s in st.skills) || st.skills[s] === 0
    );
    if (unlearned.length) {
      lines.push("--- 未学技能（默认值） ---");
      for (const skill of unlearned.sort()) {
        const def = (this.ctx as any).skills.effectiveSkillRank(skill);
        lines.push(`${skill}: ~${def} (推算)`);
      }
    }

    lines.push("技术: " + (st.techniques.length ? st.techniques.join(", ") : "技术: 无"));

    if (st.equipment.length) {
      lines.push("--- 装备 ---");
      for (const item of st.equipment) {
        const info = (this.ctx as any).equipment.resolve(item);   // 手工库 + SRD 库统一解析
        lines.push(`${item}: ${info[5]} (AC+${info[2]})`);
      }
    } else lines.push("装备: 无");

    const curHp = this.ctx.rest.currentHp();
    const maxHp = this.ctx.derived.hp();
    if (curHp === maxHp) lines.push(`HP: ${maxHp} | AC: ${this.ctx.derived.ac}`);
    else lines.push(`HP: ${curHp}/${maxHp} | AC: ${this.ctx.derived.ac}`);
    lines.push(`先攻: +${this.ctx.rest.initiativeBonus()}`);
    lines.push(`近战: +${this.ctx.derived.attackBonus(true)} | 远程: +${this.ctx.derived.attackBonus(false)}`);
    lines.push(
      `强韧: +${this.ctx.derived.saveBonus("fort")} | 反射: +${this.ctx.derived.saveBonus("ref")} | 意志: +${this.ctx.derived.saveBonus("will")}`
    );

    // ---- 战斗条件追踪（ConditionService）----
    const cond = this.ctx.condition.active();
    if (cond.length) {
      const pen: string[] = [];
      for (const [kind, label] of [["attack", "攻"], ["save", "免"], ["check", "检"]] as Array<[string, string]>) {
        const p = this.ctx.condition.penalty(kind);
        if (p) pen.push(`${label}${p >= 0 ? "+" : ""}${p}`);
      }
      const penTxt = pen.length ? `（${pen.join("，")}）` : "";
      lines.push(`战斗条件: ${cond.join(", ")}${penTxt}`);
    } else {
      lines.push("战斗条件: 无");
    }

    lines.push("--- 属性调整值 ---");
    lines.push(Object.entries(st.attributes).map(([a, v]) => `${a}:${abilityMod(v as number) >= 0 ? "+" : ""}${abilityMod(v as number)}`).join(" | "));
    return lines.join("\n");
  }

  toDict(): Record<string, any> {
    const st = this.ctx.state;
    return {
      cp: st.cp,
      maxDisadvantageCp: st.maxDisadvantageCp,
      attributes: { ...st.attributes },
      advantages: [...st.advantages],
      disadvantages: st.disadvantages.map(([n, r]: [string, number]) => [n, r]),
      talents: st.talents.map(([n, l]: [string, number]) => [n, l]),
      skills: { ...st.skills },
      techniques: [...st.techniques],
      equipment: [...st.equipment],
      race: st.race,
      background: st.background,
      feats: [...st.feats],
      proficiencies: [...st.proficiencies],
      slots: { ...st.slots },
      slotsUsed: { ...st.slotsUsed },
      currentHp: st.currentHp,
      conditions: [...(st.conditions || [])],
      // ---- v2.1 职业 ----
      cls: st.cls,
      level: st.level,
      subclass: st.subclass,
      gearProficiencies: [...(st.gearProficiencies || [])],
      saveProficiencies: [...(st.saveProficiencies || [])],
    };
  }
}
