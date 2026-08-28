/**
 * d20.web engine/condition - 战斗条件服务（Cordis 插件）
 *
 * D&D 5e 官方 15 条战斗条件的规则数据库 + 角色当前条件追踪器。挂到 ctx.condition。
 * 条件对攻击/豁免/检定的影响以「劣势≈-2」的平坦惩罚代理表达（见 data_conditions），
 * 供 combat/sheet 统一扣减，避免改动 d20_roll 的随机语义。
 */
import { Service } from "./core";
import { CONDITIONS, DISADVANTAGE_PENALTY } from "./data_conditions";

function signed(n: number): string {
  return (n >= 0 ? "+" : "") + n;
}

export class ConditionService extends Service {
  static inject: string[] = [];
  CONDITIONS = CONDITIONS;
  DISADVANTAGE_PENALTY = DISADVANTAGE_PENALTY;

  // ---------- 规则查询 ----------
  allNames(): string[] {
    return Object.keys(this.CONDITIONS);
  }

  describe(name: string): string {
    const info = this.CONDITIONS[name];
    if (!info) return `未知条件: ${name}`;
    const pen: string[] = [];
    if (info.attack) pen.push(`攻击${signed(info.attack)}`);
    if (info.save) pen.push(`豁免${signed(info.save)}`);
    if (info.check) pen.push(`检定${signed(info.check)}`);
    const penTxt = pen.length ? `（${pen.join("，")}）` : "";
    return `${name}（${info.en}）${penTxt}：${info.special}`;
  }

  autoFail(kind: string): boolean {
    const conds: string[] = this.ctx.state.conditions || [];
    return conds.some((c) => (this.CONDITIONS[c]?.auto_fail || []).includes(kind));
  }

  // ---------- 追踪 ----------
  add(name: string): [boolean, string] {
    if (!(name in this.CONDITIONS)) return [false, `未知条件: ${name}`];
    const conds: string[] = this.ctx.state.conditions;
    if (conds.includes(name)) return [false, `已处于 ${name} 状态`];
    conds.push(name);
    this.ctx.emit("character/changed", "conditions");
    return [true, `施加条件：${name}`];
  }

  remove(name: string): [boolean, string] {
    const conds: string[] = this.ctx.state.conditions;
    const i = conds.indexOf(name);
    if (i < 0) return [false, `未处于 ${name} 状态`];
    conds.splice(i, 1);
    this.ctx.emit("character/changed", "conditions");
    return [true, `解除条件：${name}`];
  }

  clear(): void {
    this.ctx.state.conditions = [];
    this.ctx.emit("character/changed", "conditions");
  }

  active(): string[] {
    return [...this.ctx.state.conditions];
  }

  has(name: string): boolean {
    return this.ctx.state.conditions.includes(name);
  }

  // ---------- 聚合惩罚（供 combat/sheet 扣减）----------
  penalty(kind: string): number {
    const conds: string[] = this.ctx.state.conditions;
    return conds.reduce((sum, c) => sum + (this.CONDITIONS[c]?.[kind] || 0), 0);
  }

  summary(): string {
    const conds: string[] = this.ctx.state.conditions;
    return conds.length ? conds.join("; ") : "无";
  }
}
