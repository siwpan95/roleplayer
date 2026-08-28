/**
 * d20.web engine/monster - 怪物图鉴服务（Cordis 插件）
 *
 * D&D 5e SRD 怪物（见 data_monsters.MONSTERS）：提供查询、角色卡式 stat block 渲染，
 * 以及基于其攻击/伤害骰的掷骰结算（供 DM 快速跑怪）。挂到 ctx.monster。
 *
 * 依赖 dice 服务做随机掷骰；与角色自己的 CharacterState 解耦——怪物是「外部战斗单位」，
 * 不污染玩家状态。卸载本服务即失去怪物查询/结算能力。
 */
import { Service } from "./core";
import { MONSTERS, CR_XP } from "./data_monsters";

function signed(n: number): string {
  return (n >= 0 ? "+" : "") + n;
}

/** 解析 '2d6+3' / '1d8-1' / '' -> [count, die, bonus]。无法解析返回 [0,0,0]。 */
export function parseDice(expr: string): [number, number, number] {
  if (!expr) return [0, 0, 0];
  let s = expr.trim().toLowerCase().replace(/ /g, "");
  let sign = 1;
  if (s.startsWith("+")) s = s.slice(1);
  else if (s.startsWith("-")) {
    sign = -1;
    s = s.slice(1);
  }
  if (!s.includes("d")) {
    const n = parseInt(s, 10);
    return isNaN(n) ? [0, 0, 0] : [0, 0, sign * n];
  }
  const idx = s.indexOf("d");
  const cntPart = s.slice(0, idx);
  const diePart = s.slice(idx + 1);
  const cnt = cntPart ? parseInt(cntPart, 10) : 1;
  let die = 0;
  let bonus = 0;
  if (diePart.includes("+")) {
    const [ds, b] = diePart.split("+");
    die = parseInt(ds, 10);
    bonus = parseInt(b, 10);
  } else if (diePart.includes("-")) {
    const [ds, b] = diePart.split("-");
    die = parseInt(ds, 10);
    bonus = -parseInt(b, 10);
  } else {
    die = parseInt(diePart, 10);
  }
  if (isNaN(cnt) || isNaN(die) || isNaN(bonus)) return [0, 0, 0];
  return [cnt, die, sign * bonus];
}

export class MonsterService extends Service {
  static inject: string[] = ["dice"];
  MONSTERS = MONSTERS;
  CR_XP = CR_XP;

  // ---------- 查询 ----------
  names(): string[] {
    return Object.keys(this.MONSTERS);
  }

  lookup(name: string): any {
    return this.MONSTERS[name];
  }

  xp(cr: string): number {
    return this.CR_XP[cr] || 0;
  }

  byCr(cr: string): string[] {
    return Object.keys(this.MONSTERS).filter((n) => this.MONSTERS[n].cr === cr);
  }

  // ---------- 渲染 ----------
  statBlock(name: string): string {
    const m = this.lookup(name);
    if (!m) return `未知怪物: ${name}`;
    const ab: Record<string, number> = { str: m.str, dex: m.dex, con: m.con, int: m.int, wis: m.wis, cha: m.cha };
    const mod = (v: number) => signed(Math.floor((v - 10) / 2));
    const lines: string[] = ["=".repeat(40), `${name}  [${m.size} ${m.type}, ${m.alignment}]`, "=".repeat(40)];
    lines.push(`AC ${m.ac}` + (m.ac_note ? ` (${m.ac_note})` : "") + ` | HP ${m.hp} | 速度 ${m.speed}`);
    lines.push("六维 " + Object.entries(ab).map(([k, v]) => `${k.slice(0, 3).toUpperCase()}:${v}(${mod(v)})`).join(" "));
    if (m.saves) lines.push("豁免 " + Object.entries(m.saves as Record<string, number>).map(([k, v]) => `${k.slice(0, 3).toUpperCase()} ${signed(v)}`).join(", "));
    if (m.skills) lines.push("技能 " + Object.entries(m.skills as Record<string, number>).map(([k, v]) => `${k} ${signed(v)}`).join(", "));
    for (const [label, key] of [["抗力", "resist"], ["免疫", "immune"], ["易伤", "vuln"], ["状态免疫", "cond_immune"]] as Array<[string, string]>) {
      if (m[key] && (m[key] as string[]).length) lines.push(`${label} ` + (m[key] as string[]).join(", "));
    }
    lines.push(`感官 ${m.senses} | 语言 ${m.languages} | CR ${m.cr}（${this.xp(m.cr)} XP）`);
    for (const [tname, tdesc] of m.traits as Array<[string, string]>) lines.push(`• 特性·${tname}: ${tdesc}`);
    if (m.actions) {
      lines.push("— 动作 —");
      for (const a of m.actions) {
        const dmgTxt = a.dmg ? `, ${a.dmg} ${a.type}` : "";
        const extra = a.extra ? ` | ${a.extra}` : "";
        if (a.atk !== undefined) lines.push(`  ${a.name}: 命中+${a.atk} (${a.reach || "近战"})${dmgTxt}${extra}`);
        else lines.push(`  ${a.name}: ${extra}`);
      }
    }
    for (const [grp, label] of [["bonus_actions", "附赠动作"], ["reactions", "反应"], ["legendary", "传奇动作"]] as Array<[string, string]>) {
      if (m[grp]) {
        lines.push(`— ${label} —`);
        for (const a of m[grp]) {
          const extra = a.extra ? ` ${a.extra}` : "";
          if (a.atk !== undefined) lines.push(`  ${a.name}: 命中+${a.atk}${extra}`);
          else lines.push(`  ${a.name}:${extra}`);
        }
      }
    }
    return lines.join("\n");
  }

  // ---------- 结算（DM 用）----------
  rollAttack(name: string, actionIndex = 0, targetAc = 10): string {
    const m = this.lookup(name);
    if (!m) return `未知怪物: ${name}`;
    const actions = m.actions || [];
    if (!actions.length) return `${name} 无可用动作`;
    if (actionIndex >= actions.length) return `${name} 没有第 ${actionIndex} 个动作（共 ${actions.length}）`;
    const a = actions[actionIndex];
    if (a.atk === undefined) return `${a.name} 非攻击动作：${a.extra || ""}`;
    const atkBonus = a.atk;
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + atkBonus;
    const hit = total >= targetAc;
    const [cnt, die, bonus] = a.dmg ? parseDice(a.dmg) : [0, 0, 0];
    const lines: string[] = [`${name}·${a.name}: d20+${atkBonus} = ${roll}+${atkBonus} = ${total} vs AC ${targetAc}`];
    if (hit) {
      if (cnt) {
        const rolls = Array.from({ length: cnt }, () => Math.floor(Math.random() * die) + 1);
        const dmg = rolls.reduce((s, r) => s + r, 0) + bonus;
        lines.push(`  命中！伤害: ${cnt}d${die}${signed(bonus)} = ${rolls} = ${dmg} ${a.type || ""}`);
      } else {
        lines.push("  命中！");
      }
    } else {
      lines.push("  未命中");
    }
    return lines.join("\n");
  }

  quickEncounter(cr: string, count = 1): string {
    let pool = this.byCr(cr);
    if (!pool.length) {
      pool = Object.keys(this.MONSTERS)
        .sort((a, b) => String(this.MONSTERS[a].cr).localeCompare(String(this.MONSTERS[b].cr)))
        .slice(0, count);
    }
    return pool.slice(0, count).join(", ") + `（CR ${cr}, ${this.xp(cr)} XP/个）`;
  }
}
