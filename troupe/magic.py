"""troupe.magic - 双规则集法术系统（L1.5 规则适配之上的「神秘学」层）

为什么单独成层
--------------
「完整跑团模拟器」的标志性能力是**法术**。D&D 与 GURPS 的施法语义几乎完全相反，
因此和规则判定一样必须关在适配层之后，由本服务统一暴露 ``cast(spec)``：

* **GURPS 4e**（Basic Set / Magic，结构性公开事实）
    - 每个法术是**一项独立技能**，基础有效等级 = 属性(IQ 或 HT) + 魔力(Magery)；
      再按相对基础等级 +n 购买（消耗点数，与 ``character_gurps`` 同套点经济）。
    - 施法消耗**疲劳点(FP)**；法术能否施展取决于**玛那浓度(mana level)**——
      普通法力下只有「法师(mage, 即拥有 Magery 者)」能施法。
    - 24 个法术学院(college)；高阶法术有**前置法术**；大失败走临界法术失败表（此处简化为轻微反噬）。
    - 命中型法术（火球/闪电）目标可闪避；抗力型法术（催眠/恐惧）目标掷属性检定抵抗。

* **D&D 5e（SRD 5.1，CC-BY-4.0）**
    - 法术来自 ``d20.data_spells.SRD_SPELLS``（由 dnd5eapi 拉取的全谱 0–9 环法术，本层只消费、不搬运文本）。
    - 法术位直接复用角色自带的 ``char.ctx.slots``（真实 d20 法术位系统：上限 4/3/3/3/3/2/2/1/1）。
    - 判定：伤害法术走「法术攻击 vs AC」；非攻击走「目标豁免 DC = 8 + 施法属性调整 + 熟练加值」；
      戏法(0 环)不耗位；高环施放(upcasting) 对伤害法术每高 1 环 +1d8。
    - 持续法术标 ``Concentration`` 时记录专注，施放新专注法术会顶掉旧的。

许可边界：只采用公开的结构性机制（Magery/FP/mana、学院与前置、3d6 掷低；D&D 环位/DC/专注/升环）。
具体法术文本与逐格数值不复制；GURPS 法术表为**代表性子集**（跨主要学院），便于模拟器内部平衡。
"""
from __future__ import annotations

from typing import Any, Optional

from d20.core import Service
from d20.data import ability_mod

from .contracts import CheckRequest


# =============================================================================
#  GURPS 代表性法术表（跨主要学院，结构性事实 + 自研代表子集）
# =============================================================================
#: 字段：zh 中文名 / en 英文名 / college 学院 / attr 基础属性(IQ 或 HT) /
#:       energy 疲劳消耗(FP) / time 施法秒数 / prereqs 前置法术(zh) /
#:       kind 效果类型(damage/resist/buff/utility) / damage (骰数, 面, 修正) /
#:       dtype 伤害类型 / resist 抗力属性(HT/Will/DX，None=可闪避) /
#:       condition 命中后施加的状态(list) / range 射程(尺)
GURPS_SPELLS: dict[str, dict] = {
    # ---- 火学院 ----
    "点火":  {"en": "Ignite Fire", "college": "火", "attr": "IQ", "energy": 1,
              "time": 1, "prereqs": [], "kind": "utility", "damage": None,
              "dtype": "灼烧", "resist": None, "condition": None, "range": 10},
    "创造火": {"en": "Create Fire", "college": "火", "attr": "IQ", "energy": 2,
                "time": 2, "prereqs": ["点火"], "kind": "utility", "damage": (1, 6, 0),
                "dtype": "灼烧", "resist": None, "condition": None, "range": 10},
    # 官方译名「火球术」；因与 D&D SRD 同名法术键冲突，本仓 GURPS 键保留「火球」。
    # 官方前置：Magery 1 + 召火术(Create Fire) + 火焰塑形(Shape Fire)（trow 8778 中译；
    # 注意俄译本 sp1r 把 Magery 前置系统性抬档为 2，不可信）——本仓自研简化只要求「创造火」。
    "火球":  {"en": "Fireball", "college": "火", "attr": "IQ", "energy": 3,
              "time": 2, "prereqs": ["创造火"], "kind": "damage", "damage": (3, 6, 0),
              "dtype": "灼烧", "resist": None, "condition": None, "range": 100},
    # ---- 风学院（官方 Air 系；官方前置 Magery 1 + 6 个风系法术，本仓未收录 6 风法术故简化为无前置）----
    "闪电箭": {"en": "Lightning", "college": "风", "attr": "IQ", "energy": 2,
               "time": 2, "prereqs": [], "kind": "damage", "damage": (2, 6, 0),
               "dtype": "闪电", "resist": None, "condition": None, "range": 100},
    # ---- 冰/水学院 ----
    "寒冰箭": {"en": "Ice Dagger", "college": "水", "attr": "IQ", "energy": 2,
               "time": 2, "prereqs": [], "kind": "damage", "damage": (2, 6, 0),
               "dtype": "寒冷", "resist": None, "condition": None, "range": 80},
    # ---- 心智控制学院（官方 Mind Control 系，IQ 施法；2026-08-30 联网核对修正自「身体控制」）----
    "眩晕":  {"en": "Daze", "college": "心智控制", "attr": "IQ", "energy": 2,
              "time": 2, "prereqs": [], "kind": "resist", "damage": None,
              "dtype": "钝击", "resist": "IQ", "condition": ["眩晕"], "range": 10},
    "昏睡":  {"en": "Sleep", "college": "心智控制", "attr": "IQ", "energy": 3,
              "time": 4, "prereqs": ["眩晕"], "kind": "resist", "damage": None,
              "dtype": "钝击", "resist": "HT", "condition": ["倒地", "震慑"], "range": 10},
    # ---- 心智学院 ----
    "恐惧":  {"en": "Fear", "college": "心智控制", "attr": "IQ", "energy": 3,
              "time": 2, "prereqs": [], "kind": "resist", "damage": None,
              "dtype": "钝击", "resist": "Will", "condition": ["震慑"], "range": 100},
    "催眠":  {"en": "Hypnotism", "college": "心智控制", "attr": "IQ", "energy": 1,
              "time": 3, "prereqs": [], "kind": "resist", "damage": None,
              "dtype": "钝击", "resist": "Will", "condition": ["眩晕"], "range": 10},
    # ---- 防护学院 ----
    "护盾术": {"en": "Shield", "college": "防护", "attr": "IQ", "energy": 2,
               "time": 2, "prereqs": [], "kind": "buff", "damage": None,
               "dtype": "钝击", "resist": None, "condition": None, "range": 0},
    "治愈术": {"en": "Cure", "college": "治疗", "attr": "HT", "energy": 3,
               "time": 4, "prereqs": [], "kind": "buff", "damage": None,
               "dtype": "钝击", "resist": None, "condition": None, "range": 0},
    # ---- 制造与破坏学院 ----
    "粉碎":  {"en": "Shatter", "college": "制造与破坏", "attr": "IQ", "energy": 3,
              "time": 3, "prereqs": [], "kind": "damage", "damage": (2, 6, 0),
              "dtype": "钝击", "resist": None, "condition": None, "range": 50},
    # ---- 光与暗学院（官方 Light and Darkness 系；2026-08-30 联网核对修正自「幻术」）----
    "隐形术": {"en": "Invisibility", "college": "光与暗", "attr": "IQ", "energy": 4,
               "time": 4, "prereqs": [], "kind": "buff", "damage": None,
               "dtype": "钝击", "resist": None, "condition": None, "range": 0},
    # ---- 光学院 ----
    "光亮术": {"en": "Light", "college": "光", "attr": "IQ", "energy": 1,
               "time": 1, "prereqs": [], "kind": "utility", "damage": None,
               "dtype": "光耀", "resist": None, "condition": None, "range": 10},
    # ---- 知识学院（官方 Knowledge 系；en 由误标的 Seek Magic 修正为 Detect Magic）----
    "侦测魔法": {"en": "Detect Magic", "college": "知识", "attr": "IQ", "energy": 2,
                 "time": 2, "prereqs": [], "kind": "utility", "damage": None,
                 "dtype": "钝击", "resist": None, "condition": None, "range": 0},
    # ---- 死灵学院 ----
    "虚弱术": {"en": "Weakness", "college": "死灵", "attr": "IQ", "energy": 3,
               "time": 3, "prereqs": [], "kind": "resist", "damage": None,
               "dtype": "死灵", "resist": "HT", "condition": ["力竭"], "range": 50},
}

#: 玛那浓度（GURPS 结构性事实，2026-08-30 联网核对修正）：官方 5 档，
#: 无玛那（无人可施）/ 低玛那（仅法师，全法术 -5 减值）/ 普通玛那（仅法师）/
#: 高玛那（人人可施）/ 极高玛那（人人可施 + FP 轮后回满 + 失败皆大失败）。
MANA_LEVELS = ("无", "低", "普通", "高", "极高")

#: GURPS 属性键（IQ/HT/DX/Will/Per）↔ 本项目六维中文键 的映射
_GURPS_ATTR_ALIAS = {"IQ": "智力", "HT": "体质", "DX": "敏捷",
                     "Will": "智力", "Per": "感知"}

#: GURPS 施法**大失败**后果表 ``(权重, 后果键)``。
#: 取「临界法术失败」的结构性思想（能量反噬 / 哑火 / 反冲 / 失控），具体条目为
#: **代表性自研子集**，不搬运 Basic Set 的逐格魔陷表。
GURPS_CRIT_FAIL_TABLE: list[tuple[float, str]] = [
    (4.0, "backfire"),    # 能量反噬：施法者受伤
    (3.0, "no_effect"),   # 哑火消散：额外损失等量 FP（双倍耗能）
    (3.0, "stun_self"),   # 魔力反冲：施法者被震慑
    (2.0, "flash"),       # 刺目闪光：施法者暂时目盲
    (2.0, "wild_surge"),  # 魔力涌动：法术偏移失控，无效果
    (2.0, "lose_spell"),  # 记忆紊乱：本次施法后暂时遗忘该法术
]

#: D&D 5e 专注(concentration)法术（公开 SRD 5.1 事实的代表性子集）。
#: SRD 数据集把持续时间的 "Concentration, " 前缀归一掉了，故此处显式登记以驱动专注机制。
DND_CONCENTRATION_SPELLS = frozenset({
    "Bless", "Invisibility", "Haste", "Faerie Fire", "Feather Fall",
    "Protection from Evil and Good", "Shield of Faith", "Web", "Hold Person",
    "Suggestion", "Fly", "Mage Armor", "Hunter's Mark", "Hex", "Longstrider",
    "Alarm", "Sanctuary", "Silence", "Pyrotechnics", "Enlarge/Reduce",
})


# =============================================================================
#  服务
# =============================================================================
class MagicService(Service):
    """法术系统。挂到 ``ctx.magic``。"""

    inject = ["ruleset", "rng", "log"]
    name = "magic"

    def __init__(self, ctx, config=None) -> None:  # noqa: D107
        super().__init__(ctx, config)
        # 玛那浓度为会话级（不进存档，载入时按默认「普通」重建）
        self.mana = (config or {}).get("mana", "普通")

    # ------------------------------------------------------------------ #
    #  通用
    # ------------------------------------------------------------------ #
    def set_mana(self, level: str) -> str:
        if level not in MANA_LEVELS:
            raise ValueError(f"未知玛那浓度: {level}（应为 {MANA_LEVELS}）")
        self.mana = level
        return level

    def available_spells(self, ruleset: str = "") -> list[str]:
        """列出当前规则集可学/已知的法术名（用于自省）。"""
        rid = ruleset or (self.ctx.ruleset.id if self.ctx.has("ruleset") else "dnd5e")
        if rid == "gurps":
            return sorted(GURPS_SPELLS)
        try:
            from d20.data_spells import SRD_SPELLS
            return list(SRD_SPELLS.keys())
        except Exception:
            return []

    def cast(self, spec: dict) -> dict:
        """统一施法入口：按 ``ctx.ruleset.id`` 分派到 GURPS / D&D 路径。

        ``spec``：``{"actor", "spell", "target"(可选), "ring"(D&D 可选),
        "modifier"(可选)}``。``actor``/``target`` 为 ``d20.Character``。
        """
        rid = self.ctx.ruleset.id
        if rid == "gurps":
            return self.cast_gurps(spec.get("actor"), spec.get("spell"),
                                   target=spec.get("target"),
                                   modifier=int(spec.get("modifier", 0) or 0))
        return self.cast_dnd5e(spec.get("actor"), spec.get("spell"),
                                ring=spec.get("ring"), target=spec.get("target"),
                                modifier=int(spec.get("modifier", 0) or 0))

    # ================================================================== #
    #  GURPS
    # ================================================================== #
    def magery_of(self, char: Any) -> int:
        flags = getattr(char.state, "flags", {}) or {}
        return int(flags.get("gurps_magery", 0) or 0)

    def fp_of(self, char: Any) -> tuple[int, int]:
        flags = getattr(char.state, "flags", {}) or {}
        ht = int(char.state.attributes.get("体质", 10))
        mx = int(flags.get("gurps_fp_max", ht))
        cur = int(flags.get("gurps_fp", mx))
        return cur, mx

    def _spend_fp(self, char: Any, n: int) -> int:
        flags = getattr(char.state, "flags", {}) or {}
        ht = int(char.state.attributes.get("体质", 10))
        mx = int(flags.get("gurps_fp_max", ht))
        cur = int(flags.get("gurps_fp", mx))
        cur = max(0, cur - int(n))
        flags["gurps_fp"] = cur
        flags["gurps_fp_max"] = mx
        char.state.flags = flags
        return cur

    def known_gurps_spells(self, char: Any) -> list[str]:
        flags = getattr(char.state, "flags", {}) or {}
        return list((flags.get("gurps_spells") or {}).keys())

    def can_learn_gurps(self, char: Any, name: str) -> tuple[bool, str]:
        spell = GURPS_SPELLS.get(name)
        if spell is None:
            return False, f"未知 GURPS 法术: {name}"
        # GURPS 玛那浓度（结构性事实，2026-08-30 核对修正）：
        # - 无玛那：任何人（含 Magery）都无法习/施
        # - 低/普通/高/极高：只有 mage（拥有 Magery>0）能施法（低玛那另 -5 减值，见核对报告）
        magery = self.magery_of(char)
        if self.mana == "无":
            return False, "玛那浓度「无」：无 mana 环境中法术不可用（即使有魔法天赋 Magery 亦无法习/施）"
        if self.mana in ("低", "普通", "高", "极高") and magery <= 0:
            return False, f"玛那浓度「{self.mana}」且无魔法天赋(Magery)，无法习得/施展法术"
        # 前置校验
        known = self.known_gurps_spells(char)
        missing = [p for p in spell["prereqs"] if p not in known]
        if missing:
            return False, f"缺少前置法术: {missing}"
        return True, ""

    def learn_gurps_spell(self, char: Any, name: str, relative: int = 0) -> tuple[bool, str]:
        """把一个 GURPS 法术记入学识：写入 ``state.skills``（作为技能，复用规则判定）
        并登记到 ``flags["gurps_spells"]``。"""
        ok, msg = self.can_learn_gurps(char, name)
        if not ok:
            return False, msg
        spell = GURPS_SPELLS[name]
        key = _GURPS_ATTR_ALIAS.get(spell["attr"], spell["attr"])
        attr_val = int(char.state.attributes.get(key, 10))
        base = attr_val + self.magery_of(char)        # 基础有效等级 = 属性 + 魔法天赋
        effective = base + int(relative)
        char.state.skills[name] = effective           # 法术即技能
        flags = getattr(char.state, "flags", {}) or {}
        known = dict(flags.get("gurps_spells") or {})
        known[name] = {"college": spell["college"], "relative": int(relative),
                       "energy": spell["energy"]}
        flags["gurps_spells"] = known
        char.state.flags = flags
        return True, f"习得 {name}（有效等级 {effective}，耗能 {spell['energy']} FP）"

    def cast_gurps(self, actor: Any, spell: str, target: Any = None,
                   modifier: int = 0) -> dict:
        """GURPS 施法：3d6 ≤ 有效技能等级（属性+魔法天赋+相对等级）→ 成功；消耗 FP；按效果落地。"""
        if actor is None:
            return {"ok": False, "reason": "no_actor"}
        if spell not in self.known_gurps_spells(actor):
            return {"ok": False, "reason": "unknown_spell",
                    "text": f"{self._name(actor)} 未习得 {spell}"}
        sp = GURPS_SPELLS[spell]
        cur_fp, _ = self.fp_of(actor)
        if cur_fp < sp["energy"]:
            return {"ok": False, "reason": "no_fp",
                    "text": f"{self._name(actor)} 疲劳不足（{cur_fp}/{sp['energy']} FP），无法施展 {spell}"}

        # 技能检定（法术即技能，复用 GURPS 适配器）
        res = self.ctx.ruleset.check(
            actor, CheckRequest(actor=self._id(actor), kind="skill",
                                key=spell, modifier=modifier, label=f"{spell} 施展"))
        out = {"ok": res.success, "ruleset": "gurps", "spell": spell,
               "critical": res.critical, "roll": res.roll, "text": res.text}

        if not res.success:
            self._spend_fp(actor, sp["energy"])              # 失败也耗能
            out["fp_spent"] = sp["energy"]
            if res.critical == "crit_fail":
                crit = self._gurps_crit_fail(actor, sp, target)
                crit_text = crit.pop("text", "")
                if "fp_spent" in crit:
                    out["fp_spent"] = crit.pop("fp_spent")
                out.update(crit)
                out["text"] += crit_text
            else:
                out["text"] += " → 施法失败（无效果）"
            self._log(out)
            return out

        # ---- 成功：耗能 → 按效果类型落地 ----
        self._spend_fp(actor, sp["energy"])
        out["fp_spent"] = sp["energy"]
        out.update(self._resolve_gurps_effect(actor, target, sp))
        self._log(out)
        return out

    def _gurps_crit_fail(self, actor: Any, sp: dict, target: Any = None) -> dict:
        """GURPS 施法大失败：掷 ``GURPS_CRIT_FAIL_TABLE`` 决定后果（非一律反噬）。"""
        table = [(name, float(w)) for w, name in GURPS_CRIT_FAIL_TABLE]
        kind = self.ctx.rng.weighted(table, domain="rules")
        who = self._name(actor)
        out = {"critical": "crit_fail", "crit_result": kind, "fp_spent": sp["energy"]}
        if kind == "backfire":
            back = max(1, int(sp["energy"]))
            self.ctx.ruleset.damage(actor, back, "钝击")
            out["text"] = f" → 大失败！法力反噬，{who} 受到 {back} 点伤害"
            out["backfire"] = back
        elif kind == "no_effect":
            self._spend_fp(actor, sp["energy"])          # 哑火仍抽走能量（双倍）
            out["fp_spent"] = sp["energy"] * 2
            out["text"] = f" → 大失败！{sp['en']}哑火消散，额外损失 {sp['energy']} FP"
        elif kind == "stun_self":
            self._apply_cond(actor, "震慑")
            out["text"] = f" → 大失败！魔力反冲，{who} 被震慑"
        elif kind == "flash":
            self._apply_cond(actor, "盲目")
            out["text"] = f" → 大失败！刺目闪光，{who} 暂时目盲"
        elif kind == "wild_surge":
            out["text"] = f" → 大失败！魔力涌动，{sp['en']}偏移失控（无效果）"
            out["wild"] = True
        else:                                            # lose_spell
            out["text"] = f" → 大失败！记忆紊乱，{who} 暂时遗忘 {sp['en']}"
            out["forgotten"] = True
        return out

    def recover_fp(self, char: Any, amount: Optional[int] = None,
                   kind: str = "short") -> tuple[int, int]:
        """GURPS 休整恢复疲劳：短休 +1 FP；长休（整夜）回满。

        GURPS 中 FP 与 HP 分账，休息回 FP、医疗回 HP；长休（睡眠）恢复全部 FP。
        """
        cur, mx = self.fp_of(char)
        if amount is None:
            amount = mx if kind == "long" else 1
        cur = min(mx, cur + max(0, int(amount)))
        flags = getattr(char.state, "flags", {}) or {}
        flags["gurps_fp"] = cur
        char.state.flags = flags
        return cur, mx

        self._spend_fp(actor, sp["energy"])
        out["fp_spent"] = sp["energy"]
        out.update(self._resolve_gurps_effect(actor, target, sp))
        self._log(out)
        return out

    def _resolve_gurps_effect(self, actor: Any, target: Any, sp: dict) -> dict:
        """按效果类型落地 GURPS 法术结果。"""
        applied = {"effect": sp["kind"]}
        if sp["kind"] == "damage" and target is not None:
            dodged = self._gurps_target_dodge(target)
            if dodged:
                applied["text"] = f" → {self._name(target)} 闪避成功，{sp['en']}未命中"
                applied["hit"] = False
                return applied
            n, die, adds = sp["damage"]
            dmg = max(1, sum(self._d3() for _ in range(max(1, n))) + int(adds))
            r = self.ctx.ruleset.damage(target, dmg, sp["dtype"])
            applied["hit"] = True
            applied["damage"] = dmg
            applied["text"] = f" → 命中 {self._name(target)}，造成 {dmg} 点{sp['dtype']}伤害"
        elif sp["kind"] == "resist" and target is not None:
            if self._gurps_target_resist(target, sp["resist"]):
                applied["text"] = f" → {self._name(target)} 抵抗成功，{sp['en']}无效"
                applied["resisted"] = True
            else:
                for c in (sp["condition"] or []):
                    self._apply_cond(target, c)
                applied["text"] = f" → {self._name(target)} 抵抗失败，陷入 {sp['condition']}"
                applied["conditions"] = list(sp["condition"] or [])
        elif sp["kind"] in ("buff", "utility"):
            if sp["en"] == "Cure":
                healed = self.ctx.ruleset.heal(actor, 3 + self.magery_of(actor))
                applied["text"] = f" → 治疗 {healed} 点"
                applied["healed"] = healed
            else:
                applied["text"] = f" → {sp['en']} 生效"
        return applied

    def _gurps_target_dodge(self, target: Any) -> bool:
        """目标闪避检定（3d6 ≤ 闪避值则闪过）。"""
        try:
            dodge = self.ctx.ruleset.defense_of(target)
        except Exception:
            dodge = 0
        return sum(self._d3() for _ in range(3)) <= dodge

    def _gurps_target_resist(self, target: Any, attr: str) -> bool:
        """目标属性抵抗检定（3d6 ≤ 属性值则抵抗成功）。"""
        key = _GURPS_ATTR_ALIAS.get(attr, attr)
        val = int(getattr(target.state, "attributes", {}).get(key, 10))
        return sum(self._d3() for _ in range(3)) <= val

    def _apply_cond(self, target: Any, cond: str) -> None:
        try:
            self.ctx.ruleset.adapter._apply_cond_to_char(target, cond)
        except Exception:
            st = getattr(target, "state", target)
            conds = getattr(st, "conditions", None)
            if isinstance(conds, list) and cond not in conds:
                conds.append(cond)

    # ================================================================== #
    #  D&D 5e（包装 d20.data_spells + 真实 slots 服务）
    # ================================================================== #
    def grant_dnd_spellcaster(self, char: Any, ability: str = "智力",
                              level: Optional[int] = None,
                              auto_cantrips: bool = True) -> dict:
        """把一个 D&D 角色配成「全环法师」：按 SRD 环位表填满 ``state.slots``，
        并记录施法属性。

        **戏法(0 环)永久已知、无需准备**（SRD 5.1 结构性事实），故默认把全部 0 环
        写入 ``dnd_known`` 并单独记 ``dnd_cantrips``。

        :return: ``{"level", "slots", "cantrips", "prepare_cap"}``
        """
        lv = int(level if level is not None else getattr(char.state, "level", 1))
        table = _srd_slot_table(lv)
        char.state.slots = {r: c for r, c in table.items()}
        char.state.slots_used = {r: 0 for r in table}
        flags = getattr(char.state, "flags", {}) or {}
        flags["dnd_spell_ability"] = ability
        known = list(flags.get("dnd_known", []))
        cantrips: list[str] = []
        if auto_cantrips:
            from d20.data_spells import SRD_SPELLS
            cantrips = [zh for zh, v in SRD_SPELLS.items()
                        if int(v.get("level", 0) or 0) == 0]
            for c in cantrips:
                if c not in known:
                    known.append(c)
        flags["dnd_known"] = known
        flags["dnd_cantrips"] = cantrips
        cap = lv + ability_mod(int(char.state.attributes.get(ability, 10)))
        flags["dnd_prepare_cap"] = cap
        char.state.flags = flags
        return {"level": lv, "slots": dict(table), "cantrips": cantrips,
                "prepare_cap": cap}

    def prepare_dnd_spells(self, char: Any, names: Optional[list] = None) -> dict:
        """每日备法（SRD：可备数量 = 施法者等级 + 施法属性调整；戏法不计入）。

        ``names`` 为 ``None`` 时自动备考：在已知法术中优先保留**高环**法术。
        未显式备过时（``dnd_prepared`` 不存在），施法校验退回「已知即可施」，
        因此本方法是**可选的**精细化，不强制调用。

        :return: ``{"prepared", "cap", "unknown_skipped"}``
        """
        flags = getattr(char.state, "flags", {}) or {}
        ability = flags.get("dnd_spell_ability", "智力")
        lv = max(1, int(getattr(char.state, "level", 1)))
        cap = max(0, lv + ability_mod(int(char.state.attributes.get(ability, 10))))
        known = self.known_dnd_spells(char)
        if names is None:
            with_lv = []
            for n in known:
                sp = _lookup_dnd_spell(n)
                if sp is not None and int(sp.get("level", 0) or 0) > 0:
                    with_lv.append((int(sp["level"]), n))
            with_lv.sort(key=lambda t: -t[0])
            names = [n for _, n in with_lv]
        picked = [n for n in names if n in known]
        skipped = [n for n in names if n not in known]
        picked = picked[:cap]
        flags["dnd_prepared"] = picked
        flags["dnd_prepare_cap"] = cap
        char.state.flags = flags
        return {"prepared": picked, "cap": cap, "unknown_skipped": skipped}

    def prepared_dnd_spells(self, char: Any) -> list[str]:
        """当前已备法术（未备过则返回空列表）。"""
        return list((getattr(char.state, "flags", {}) or {}).get("dnd_prepared", []))

    def learn_dnd_spell(self, char: Any, name: str) -> tuple[bool, str]:
        """把 SRD 法术加入已知/预备清单（记 ``flags["dnd_known"]``）。"""
        sp = _lookup_dnd_spell(name)
        if sp is None:
            return False, f"SRD 中未找到法术: {name}"
        flags = getattr(char.state, "flags", {}) or {}
        known = list(flags.get("dnd_known", []))
        if name not in known:
            known.append(name)
        flags["dnd_known"] = known
        char.state.flags = flags
        return True, f"习得/预备 {name}（{sp['level']} 环，{sp['school']}）"

    def known_dnd_spells(self, char: Any) -> list[str]:
        return list((getattr(char.state, "flags", {}) or {}).get("dnd_known", []))

    def cast_dnd5e(self, actor: Any, spell: str, ring: Optional[int] = None,
                   target: Any = None, modifier: int = 0) -> dict:
        """D&D 施法：环位(戏法免) → 法术攻击/目标豁免 → 落地（升环/专注）。"""
        if actor is None:
            return {"ok": False, "reason": "no_actor"}
        sp = _lookup_dnd_spell(spell)
        if sp is None:
            return {"ok": False, "reason": "unknown_spell",
                    "text": f"SRD 中未找到法术: {spell}"}
        if spell not in self.known_dnd_spells(actor):
            return {"ok": False, "reason": "not_known",
                    "text": f"{self._name(actor)} 未预备 {spell}"}

        level = int(sp["level"])
        ring = int(ring) if ring is not None else level

        # ---- 备法校验：戏法(0 环)永久可用；1+ 环仅「显式备过时」才校验 ----
        if level > 0:
            prepared = (getattr(actor.state, "flags", {}) or {}).get("dnd_prepared")
            if prepared is not None and spell not in prepared:
                return {"ok": False, "reason": "not_prepared",
                        "text": f"{self._name(actor)} 今日未准备 {spell}"
                                f"（已备：{'、'.join(prepared) or '无'}）"}

        # ---- 环位消耗（戏法免；真实 slots 服务优先，缺则旗标兜底）----
        if level > 0:
            ok, msg = self._spend_dnd_slot(actor, ring)
            if not ok:
                return {"ok": False, "reason": "no_slot",
                        "text": f"{self._name(actor)} {msg}"}

        # ---- 专注：顶掉旧专注 ----
        concentrating = sp.get("en") in DND_CONCENTRATION_SPELLS
        if concentrating:
            self._set_concentration(actor, spell)

        # ---- 施法 DC / 攻击 ----
        ability = (getattr(actor.state, "flags", {}) or {}).get("dnd_spell_ability", "智力")
        prof = (int(getattr(actor.state, "level", 1)) - 1) // 4 + 2
        dc = 8 + ability_mod(int(actor.state.attributes.get(ability, 10))) + prof

        out = {"ok": True, "ruleset": "dnd5e", "spell": spell,
               "level": level, "ring": ring, "school": sp["school"],
               "concentration": concentrating, "text": ""}

        # ---- 伤害 / 豁免 / 工具 ----
        save_attr = sp.get("save")
        has_dmg = bool(sp.get("damage"))
        if save_attr and has_dmg and target is not None:
            res = self.ctx.ruleset.check(
                target, CheckRequest(actor=self._id(target), kind="save",
                                     key=save_attr, dc=dc, label=f"{spell} 豁免"))
            out["save_roll"] = res.roll
            if res.success:
                out["text"] = f"{self._name(target)} 豁免成功（{save_attr}），{spell} 无效"
                out["saved"] = True
            else:
                dmg = self._roll_dnd_damage(sp, ring)
                self.ctx.ruleset.damage(target, dmg, _canon_dtype(sp.get("type")))
                out["damage"] = dmg
                out["text"] = f"{self._name(target)} 豁免失败，受到 {dmg} 点{_canon_dtype(sp.get('type'))}伤害"
        elif has_dmg and target is not None:
            ac = self.ctx.ruleset.defense_of(target)
            res = self.ctx.ruleset.check(
                actor, CheckRequest(actor=self._id(actor), kind="attack",
                                    key="法术攻击", dc=ac, label=f"{spell} 法术攻击"))
            out["attack_roll"] = res.roll
            if res.success:
                dmg = self._roll_dnd_damage(sp, ring)
                self.ctx.ruleset.damage(target, dmg, _canon_dtype(sp.get("type")))
                out["damage"] = dmg
                out["text"] = f"{spell} 命中 {self._name(target)}，造成 {dmg} 点伤害"
            else:
                out["text"] = f"{spell} 未命中 {self._name(target)}"
        else:
            out["text"] = f"{self._name(actor)} 施展 {spell}（{sp['school']}）"

        self._log(out)
        return out

    def _spend_dnd_slot(self, char: Any, ring: int) -> tuple[bool, str]:
        try:
            if char.ctx.has("slots"):
                return char.ctx.slots.spend_slot(ring)
        except Exception:
            pass
        # 旗标兜底（理论上 Character 已挂载 slots 服务，此处为保险）
        used = char.state.slots_used.get(ring, 0)
        owned = char.state.slots.get(ring, 0)
        if used >= owned:
            return False, f"{ring} 环法术位不足（{owned-used}/{owned}）"
        char.state.slots_used[ring] = used + 1
        return True, "ok"

    def _set_concentration(self, char: Any, spell: str) -> None:
        flags = getattr(char.state, "flags", {}) or {}
        prev = flags.get("dnd_concentration")
        flags["dnd_concentration"] = spell
        char.state.flags = flags
        if prev and prev != spell:
            self.ctx.log.record("magic.cast", text=f"专注被打断：{prev} → {spell}",
                                payload={"type": "concentration_switch", "from": prev,
                                         "to": spell}, tags=["magic"])

    def break_concentration(self, char: Any) -> Optional[str]:
        """受伤等外部事件打断专注（战斗循环可调用）。"""
        flags = getattr(char.state, "flags", {}) or {}
        prev = flags.pop("dnd_concentration", None)
        char.state.flags = flags
        if prev:
            self.ctx.log.record("magic.cast", text=f"{self._name(char)} 失去专注（{prev} 中断）",
                                payload={"type": "concentration_break", "spell": prev},
                                tags=["magic"])
        return prev

    def _roll_dnd_damage(self, sp: dict, ring: int) -> int:
        base = sp.get("damage") or "1d6"
        n, die, adds = _parse_dice(base)
        # 升环：伤害/治疗法术每高 1 环 +1d8（SRD 5.1 典型规则）
        extra = max(0, int(ring) - int(sp["level"])) if int(sp["level"]) > 0 else 0
        rolls = [self._d20() for _ in range(max(1, n))] + [self._d20() for _ in range(extra)]
        return max(1, sum(rolls) + int(adds))

    # ------------------------------------------------------------------ #
    #  工具
    # ------------------------------------------------------------------ #
    def _d3(self) -> int:
        return self.ctx.rng.stream("rules").randint(1, 6)

    def _d20(self) -> int:
        return self.ctx.rng.stream("rules").randint(1, 20)

    def _id(self, actor: Any) -> str:
        return str(getattr(actor, "id", "") or getattr(actor, "name", "") or "?")

    def _name(self, actor: Any) -> str:
        if actor is None:
            return "?"
        st = getattr(actor, "state", None)
        if st is not None:
            return getattr(st, "cls", "") or getattr(st, "race", "") or "冒险者"
        return str(getattr(actor, "name", "") or "?")

    def _log(self, out: dict) -> None:
        try:
            self.ctx.log.record("magic.cast", text=out.get("text", ""),
                                payload={k: v for k, v in out.items()
                                         if k not in ("text",)},
                                tags=["magic"])
        except Exception:
            pass

    def to_dict(self) -> dict:
        return {"mana": self.mana}

    def load(self, data: dict) -> None:
        if isinstance(data, dict) and data.get("mana") in MANA_LEVELS:
            self.mana = data["mana"]


# =============================================================================
#  D&D 辅助（包装 d20.data_spells，绝不搬运文本）
# =============================================================================
def _lookup_dnd_spell(name: str) -> Optional[dict]:
    """按中文名（优先）或英文名查 SRD 法术。"""
    from d20.data_spells import SRD_SPELLS
    if name in SRD_SPELLS:
        return SRD_SPELLS[name]
    for zh, v in SRD_SPELLS.items():
        if v.get("en") == name:
            return v
    return None


def _canon_dtype(t: Optional[str]) -> str:
    """把 SRD 伤害类型归一（火/寒/电/酸/毒 → 标准中文）。"""
    alias = {"火": "火焰", "寒": "寒冷", "电": "闪电", "酸": "酸蚀", "毒": "毒素"}
    return alias.get(t, t or "钝击")


def _parse_dice(s: str) -> tuple[int, int, int]:
    """解析 'NdM' / 'NdM±K' → (骰数, 面, 修正)。"""
    if not s:
        return 1, 6, 0
    s = str(s).strip().lower().replace(" ", "")
    sign = 0
    if "+" in s:
        body, adds = s.split("+", 1)
        sign = int(adds)
    elif "-" in s:
        body, adds = s.split("-", 1)
        sign = -int(adds)
    else:
        body = s
    if "d" in body:
        n, die = body.split("d", 1)
        return max(1, int(n or 1)), max(1, int(die or 6)), sign
    return 1, 6, int(body or 0)


def _srd_slot_table(level: int) -> dict[int, int]:
    """全环法师 SRD 5.1 环位表（按施法者等级）。"""
    # 行索引 = level-1；列 = 1..9 环拥有数（0 表示无）
    rows = {
        1:  [2, 0, 0, 0, 0, 0, 0, 0, 0],
        2:  [3, 0, 0, 0, 0, 0, 0, 0, 0],
        3:  [4, 2, 0, 0, 0, 0, 0, 0, 0],
        4:  [4, 3, 0, 0, 0, 0, 0, 0, 0],
        5:  [4, 3, 2, 0, 0, 0, 0, 0, 0],
        6:  [4, 3, 3, 0, 0, 0, 0, 0, 0],
        7:  [4, 3, 3, 1, 0, 0, 0, 0, 0],
        8:  [4, 3, 3, 2, 0, 0, 0, 0, 0],
        9:  [4, 3, 3, 3, 1, 0, 0, 0, 0],
        10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
        11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
        12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
        13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
        14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
        15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
        16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
        17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
        18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
        19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
        20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
    }
    row = rows.get(max(1, min(20, level)), rows[1])
    return {r + 1: c for r, c in enumerate(row) if c > 0}


__all__ = ["MagicService", "GURPS_SPELLS", "MANA_LEVELS", "_lookup_dnd_spell"]
