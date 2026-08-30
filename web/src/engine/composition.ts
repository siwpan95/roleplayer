/**
 * d20.web engine/composition - 组合装配定义（cordis.yml 风格的 TS 表达）
 *
 * 对应原 Python 版 composition.yml 的 9 个服务条目。loader 按 inject 依赖拓扑排序后
 * 挂载。这里用 TS 常量表达（浏览器原生、零依赖）；运行时也可从 public/composition.yml
 * 经 YAML 解析加载（见 loader.loadCompositionYaml），与 deepseek-harness 的 cordis.yml
 * 加载契约一致。
 */
import type { ServiceCtor } from "./core";
import { AttributesService } from "./attributes";
import { EquipmentService } from "./equipment";
import { PerksService } from "./perks";
import { TechniquesService } from "./techniques";
import { RaceService } from "./race";
import { BackgroundService } from "./background";
import { FeatsService } from "./feats";
import { SkillsService } from "./skills";
import { DiceService } from "./dice";
import { DerivedService } from "./derived";
import { SpellSlotsService } from "./slots";
import { CombatService } from "./combat";
import { RestService } from "./rest";
import { SheetService } from "./sheet";
import { ConditionService } from "./condition";
import { MonsterService } from "./monster";
import { ClassService } from "./classes";
import { ReferenceService } from "./reference";
import { BattleService } from "./battle";

export interface CompositionEntry {
  id: string;
  service: ServiceCtor;
  inject: string[];
  config?: any;
  disabled?: boolean | string;
}

export const COMPOSITION: CompositionEntry[] = [
  { id: "attributes", service: AttributesService, inject: [] },
  { id: "equipment", service: EquipmentService, inject: [] },
  { id: "perks", service: PerksService, inject: [] },
  { id: "techniques", service: TechniquesService, inject: [] },
  { id: "race", service: RaceService, inject: [] },
  { id: "background", service: BackgroundService, inject: [] },
  { id: "feats", service: FeatsService, inject: [] },
  { id: "skills", service: SkillsService, inject: ["perks", "feats"] },
  { id: "dice", service: DiceService, inject: ["skills", "feats"] },
  { id: "derived", service: DerivedService, inject: ["skills", "equipment", "feats", "race"] },
  { id: "slots", service: SpellSlotsService, inject: ["skills"] },
  // race：龙息宏直接调 ctx.race.elemental()，必须声明（此前漏声明，卸载 race 后崩溃）
  { id: "rest", service: RestService, inject: ["derived", "slots", "feats", "race"] },
  { id: "combat", service: CombatService, inject: ["derived", "equipment", "dice", "techniques", "skills", "race", "slots", "feats", "rest"] },
  // feats/race 为历史冗余声明（sheet 直接读 state），已移除
  { id: "sheet", service: SheetService, inject: ["perks", "skills", "equipment", "derived", "slots", "background", "rest", "condition"] },
  { id: "condition", service: ConditionService, inject: [] },
  { id: "monster", service: MonsterService, inject: [] },
  // ---- v2.1：职业与规则速查（可选增强，无人 inject 它们；
  //      依赖方以 ctx.has("classes") 探测，卸载即回落原行为）----
  { id: "classes", service: ClassService, inject: [] },
  { id: "reference", service: ReferenceService, inject: [] },
  // ---- v2.2：模拟对战（回合制完整对战 + 遭遇构建 + 蒙特卡洛）----
  // battle 对自身 ctx 零依赖：怪物数据走 data_monsters，装备/技能/环位/攻击经
  // char.ctx（角色级全量装配）访问；旧的 [dice, monster, condition] 是错误声明。
  { id: "battle", service: BattleService, inject: [] },
];
