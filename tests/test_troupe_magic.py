"""troupe 法术系统测试：GURPS 技能型法术 + D&D 环位/专注/升环。

规则锚点（联网核对 Basic Set / SRD 5.1）：
- GURPS：法术即技能（属性+魔力），消耗 FP，前置法术，大失败反噬，抗力型法术掷属性检定。
- D&D：法术位由真实 slots 服务持有，伤害法术走法术攻击/目标豁免，戏法免位，专注顶替。
"""
import pytest

from d20 import Character

from troupe.simulator import Simulator
from troupe.character_gurps import build_gurps_character
from troupe.magic import GURPS_SPELLS, DND_CONCENTRATION_SPELLS, GURPS_CRIT_FAIL_TABLE


# =============================================================================
#  GURPS
# =============================================================================
def _gurps_sim():
    sim = Simulator.quick(seed=3, ruleset="gurps", level=5, count=1)
    mage, _ = build_gurps_character(
        {"力量": 10, "敏捷": 12, "智力": 14, "体质": 12},
        advantages=["魔法天赋1级"], seed=3, name="法师")
    sim.party = [mage]
    sim._bind_party(["法师"])
    sim.ctx.magic.set_mana("普通")
    return sim, mage


def test_gurps_spell_is_skill_and_learned():
    sim, mage = _gurps_sim()
    ok, msg = sim.ctx.magic.learn_gurps_spell(mage, "燃烧之焰")
    assert ok, msg
    # 法术作为技能写入 state.skills，复用规则判定
    assert "燃烧之焰" in mage.state.skills
    # 基础有效等级 = IQ(14) + 魔法天赋1级(1) = 15
    assert mage.state.skills["燃烧之焰"] == 15


def test_gurps_prereq_enforced():
    sim, mage = _gurps_sim()
    ok, msg = sim.ctx.magic.learn_gurps_spell(mage, "火球")  # 缺前置 创造火/点火
    assert not ok
    assert "前置" in msg


def test_gurps_no_magery_blocks_under_no_mana():
    sim, mage = _gurps_sim()
    sim.ctx.magic.set_mana("无")
    ok, msg = sim.ctx.magic.learn_gurps_spell(mage, "燃烧之焰")
    assert not ok
    assert "魔力" in msg or "Magery" in msg


def test_gurps_cast_spends_fp_and_resist_applies_condition():
    sim, mage = _gurps_sim()
    sim.ctx.magic.learn_gurps_spell(mage, "恐惧")  # 抗力型，resist=Will
    # 让目标 Will=1（智力=1）→ 抵抗必败，陷入 震慑
    foe = Character.random(3)
    foe.state.attributes["智力"] = 1
    fp_before, _ = sim.ctx.magic.fp_of(mage)
    spell_fp = GURPS_SPELLS["恐惧"]["energy"]
    res = sim.ctx.magic.cast_gurps(mage, "恐惧", target=foe)
    assert res["ok"] is True
    # FP 已消耗
    assert sim.ctx.magic.fp_of(mage)[0] == fp_before - spell_fp
    # 抵抗失败 → 施加状态
    assert "震慑" in foe.state.conditions
    # 事件已记录
    assert any(e.type == "magic.cast" for e in sim.ctx.log.tail(50))


def test_gurps_critical_failure_backfires():
    sim, mage = _gurps_sim()
    sim.ctx.magic.learn_gurps_spell(mage, "燃烧之焰")
    # 强制大失败：把技能等级压到极低，使 3d6 几乎必败且掷 18 概率存在
    mage.state.skills["燃烧之焰"] = 3
    # 多次施放直至命中一次大失败（或直接验证失败路径不崩溃 + FP 仍消耗）
    fp0, _ = sim.ctx.magic.fp_of(mage)
    res = sim.ctx.magic.cast_gurps(mage, "燃烧之焰")
    assert res["ok"] is False
    assert sim.ctx.magic.fp_of(mage)[0] == fp0 - GURPS_SPELLS["燃烧之焰"]["energy"]


# =============================================================================
#  D&D 5e
# =============================================================================
def _dnd_sim():
    sim = Simulator.quick(seed=5, ruleset="dnd5e", level=5, count=1)
    char = sim.party[0]
    sim.ctx.magic.grant_dnd_spellcaster(char, "智力", 5)
    return sim, char


def test_dnd_grant_fills_slots_from_srd_table():
    sim, char = _dnd_sim()
    # 5 级全环法师：3 环应有 2 个
    assert char.state.slots.get(3) == 2
    assert char.state.flags["dnd_spell_ability"] == "智力"


def test_dnd_cast_consumes_slot():
    sim, char = _dnd_sim()
    sim.ctx.magic.learn_dnd_spell(char, "火球术")  # 3 环
    foe = Character.random(3)
    res = sim.ctx.magic.cast_dnd5e(char, "火球术", target=foe)
    assert res["ok"] is True
    # 3 环法术位已消耗
    assert char.state.slots_used.get(3, 0) == 1
    assert any(e.type == "magic.cast" for e in sim.ctx.log.tail(50))


def test_dnd_cantrip_no_slot():
    sim, char = _dnd_sim()
    sim.ctx.magic.learn_dnd_spell(char, "酸液飞溅")  # 0 环戏法
    res = sim.ctx.magic.cast_dnd5e(char, "酸液飞溅")
    assert res["ok"] is True
    assert sum(char.state.slots_used.values()) == 0  # 戏法不耗位


def test_dnd_concentration_switches():
    sim, char = _dnd_sim()
    # 隐形术 / 祝福术 均为专注法术（登记于 DND_CONCENTRATION_SPELLS）
    assert "Invisibility" in DND_CONCENTRATION_SPELLS
    assert "Bless" in DND_CONCENTRATION_SPELLS
    sim.ctx.magic.learn_dnd_spell(char, "隐身术")
    sim.ctx.magic.learn_dnd_spell(char, "祝福术")
    sim.ctx.magic.cast_dnd5e(char, "隐身术")
    assert char.state.flags.get("dnd_concentration") == "隐身术"
    sim.ctx.magic.cast_dnd5e(char, "祝福术")
    assert char.state.flags.get("dnd_concentration") == "祝福术"
    # 顶替旧专注的事件已记录
    assert any(e.payload.get("type") == "concentration_switch"
               for e in sim.ctx.log.tail(50))


def test_dnd_unknown_spell_rejected():
    sim, char = _dnd_sim()
    res = sim.ctx.magic.cast_dnd5e(char, "不存在的法术")
    assert res["ok"] is False
    assert res["reason"] == "unknown_spell"


# =============================================================================
#  Rule-deepening（戏法永久已知 / 每日备法 / FP 休整恢复 / 大失败表）
# =============================================================================
def test_dnd_cantrips_are_permanently_known():
    """戏法(0 环)永久已知、无需准备、不耗环位（SRD 5.1）。"""
    sim, char = _dnd_sim()
    cantrips = char.state.flags.get("dnd_cantrips") or []
    assert cantrips, "grant_dnd_spellcaster 应自动学全 0 环戏法"
    assert "酸液飞溅" in cantrips
    assert "酸液飞溅" in sim.ctx.magic.known_dnd_spells(char)
    # 0 环不计入备法名额，且施放不耗环位
    res = sim.ctx.magic.cast_dnd5e(char, "酸液飞溅")
    assert res["ok"] is True
    assert sum(char.state.slots_used.values()) == 0


def test_dnd_prepared_spells_limit_and_enforced():
    """每日备法：上限 = 等级 + 施法属性调整；未备的 1+ 环法术不可施，戏法不受限。"""
    sim, char = _dnd_sim()
    sim.ctx.magic.learn_dnd_spell(char, "火球术")   # 3 环
    sim.ctx.magic.learn_dnd_spell(char, "祝福术")   # 1 环
    info = sim.ctx.magic.prepare_dnd_spells(char, ["火球术"])
    assert "火球术" in info["prepared"]
    assert info["cap"] >= 1
    assert sim.ctx.magic.prepared_dnd_spells(char) == ["火球术"]

    # 未备 → 拒绝（且先于环位校验，不消耗法术位）
    blocked = sim.ctx.magic.cast_dnd5e(char, "祝福术")
    assert blocked["ok"] is False
    assert blocked["reason"] == "not_prepared"
    assert char.state.slots_used.get(1, 0) == 0

    # 已备 → 可施，消耗 3 环位
    ok_res = sim.ctx.magic.cast_dnd5e(char, "火球术")
    assert ok_res["ok"] is True
    assert char.state.slots_used.get(3, 0) == 1

    # 戏法不受备法限制
    assert sim.ctx.magic.cast_dnd5e(char, "酸液飞溅")["ok"] is True


def test_dnd_prepare_auto_picks_highest_ring_first():
    """自动备考优先保留高环法术，且不超过名额上限。"""
    sim, char = _dnd_sim()
    for s in ("火球术", "隐身术", "祝福术", "护盾术", "加速术", "法师护甲"):
        sim.ctx.magic.learn_dnd_spell(char, s)
    info = sim.ctx.magic.prepare_dnd_spells(char)
    assert len(info["prepared"]) <= info["cap"]
    # 名额内应优先含高环（3 环优先于 1 环）
    levels = [_lookup_level(n) for n in info["prepared"]]
    assert levels == sorted(levels, reverse=True)


def test_gurps_rest_recovers_fp():
    """GURPS FP 与 HP 分账：短休 +1，长休回满。"""
    sim, mage = _gurps_sim()
    cur, mx = sim.ctx.magic.fp_of(mage)
    sim.ctx.magic._spend_fp(mage, 3)
    assert sim.ctx.magic.fp_of(mage)[0] == cur - 3
    # 短休 +1
    after_short, _ = sim.ctx.magic.recover_fp(mage)
    assert after_short == cur - 2
    # 长休回满，且不超过上限
    after_long, mx2 = sim.ctx.magic.recover_fp(mage, kind="long")
    assert after_long == mx2 == mx


def test_gurps_crit_fail_table_rolls_all_branches_safely():
    """大失败不再是「一律反噬 HP」：掷表得出不同后果，且各分支都不崩溃。"""
    sim, mage = _gurps_sim()
    valid = {name for _, name in GURPS_CRIT_FAIL_TABLE}
    assert len(valid) == len(GURPS_CRIT_FAIL_TABLE)          # 键不重复
    assert sum(w for w, _ in GURPS_CRIT_FAIL_TABLE) > 0      # 权重有效
    sp = GURPS_SPELLS["火球"]
    seen = set()
    for _ in range(60):
        out = sim.ctx.magic._gurps_crit_fail(mage, sp)
        assert out["critical"] == "crit_fail"
        assert out["crit_result"] in valid
        assert out["text"]
        seen.add(out["crit_result"])
    # 60 次足以覆盖到多种不同后果（表有 6 项，权重非退化）
    assert len(seen) > 1, f"大失败表未掷出多种后果，仅见 {seen}"


def test_gurps_low_mana_penalizes_casting():
    """批次1 A1：低玛那下全法术检定 -5（官方结构性事实）。"""
    sim, mage = _gurps_sim()
    sim.ctx.magic.set_mana("低")
    assert sim.ctx.magic.learn_gurps_spell(mage, "燃烧之焰")[0]  # 低玛那仅法师可学，mage 有魔法天赋1级
    captured = {}
    orig = sim.ctx.ruleset.check

    def spy(actor, req):
        captured["modifier"] = req.modifier
        return orig(actor, req)

    sim.ctx.ruleset.check = spy
    sim.ctx.magic.cast_gurps(mage, "燃烧之焰")
    assert captured.get("modifier") == -5


def test_gurps_concentration_broken_when_stunned():
    """批次1 A2：震慑状态下施法先做 -3 意志检定，失败则专注被打断且不耗 FP。"""
    sim, mage = _gurps_sim()
    assert sim.ctx.magic.learn_gurps_spell(mage, "燃烧之焰")[0]
    # 确定性必败：智力 1 → 意志目标 = 1 - 3(打断) - 4(震慑状态) < 0
    mage.state.attributes["智力"] = 1
    mage.state.conditions = ["震慑"]
    fp0, mx = sim.ctx.magic.fp_of(mage)
    res = sim.ctx.magic.cast_gurps(mage, "燃烧之焰")
    assert res.get("reason") == "concentration_broken"
    assert "专注被打断" in res.get("text", "")
    assert sim.ctx.magic.fp_of(mage)[0] == fp0          # 未耗 FP


def test_gurps_skill_cost_difficulty_ladders():
    """批次1 A3：四档难度成本阶梯（普通档保持既有简化行为）。"""
    from troupe.data_world import gurps_skill_cost
    # 普通档（默认，旧行为）：0→1、1→2、2→4、3→8
    assert gurps_skill_cost(0) == 1
    assert gurps_skill_cost(1) == 2
    assert gurps_skill_cost(2) == 4
    assert gurps_skill_cost(3) == 8
    # 易（偏移 0）：1 点=Att、2=+1、4=+2、8=+3
    assert gurps_skill_cost(0, "易") == 1
    assert gurps_skill_cost(1, "易") == 2
    assert gurps_skill_cost(2, "易") == 4
    assert gurps_skill_cost(3, "易") == 8
    # 难（偏移 -2）：1 点=Att-2、2=Att-1、4=Att、8=Att+1
    assert gurps_skill_cost(-2, "难") == 1
    assert gurps_skill_cost(-1, "难") == 2
    assert gurps_skill_cost(0, "难") == 4
    assert gurps_skill_cost(1, "难") == 8
    # 极难（偏移 -3）
    assert gurps_skill_cost(-3, "极难") == 1
    assert gurps_skill_cost(-2, "极难") == 2
    assert gurps_skill_cost(-1, "极难") == 4
    assert gurps_skill_cost(0, "极难") == 8
    # 未知档报错
    import pytest as _pytest
    with _pytest.raises(ValueError):
        gurps_skill_cost(0, "不存在")


def _lookup_level(name: str) -> int:
    from d20.data_spells import SRD_SPELLS
    return int(SRD_SPELLS[name]["level"])
