"""test_narration - 对战叙事文本生成器的单元测试。

覆盖 D&D（命中/暴击/豁免/死亡豁免）与 GURPS（命中部位/主动防御/伤害类型
差异）两类叙事风格，以及武器名中文化与伤害类型启发式推断。
"""
import random

from roleplayer import narration as n


def test_translate_weapon():
    assert n.translate_weapon("Shortbow") == "短弓"
    assert n.translate_weapon("Greatclub") == "大棒"
    assert n.translate_weapon("Bite") == "撕咬"
    # 未收录的原样返回
    assert n.translate_weapon("自定义武器") == "自定义武器"
    assert n.translate_weapon("") == ""


def test_weapon_dtype_heuristic():
    assert n.weapon_dtype("长剑") == "挥砍"
    assert n.weapon_dtype("匕首") == "穿刺"
    assert n.weapon_dtype("钉头锤") == "钝击"
    assert n.weapon_dtype("战斧") == "挥砍"  # 默认挥砍


def test_hit_location_valid():
    random.seed(0)
    valid = {"头骨", "面部", "颈部", "躯干", "腹股沟", "手臂", "手", "腿", "脚"}
    for _ in range(50):
        assert n.hit_location() in valid


def test_hit_location_distribution_matches_gurps_b552():
    # 合并左右肢后按 Basic Set p.552 的 3d6 权重：
    # 腿(61) > 躯干(52) > 手臂(46) > 腹股沟(27) > 手(10) > 面/脚(6) > 头骨/颈(4)
    from collections import Counter
    random.seed(1)
    cnt = Counter(n.hit_location() for _ in range(20000))
    assert cnt["腿"] > cnt["躯干"] > cnt["手臂"] > cnt["腹股沟"]
    assert cnt["腹股沟"] > cnt["手"] > cnt["面部"]
    assert cnt["面部"] >= cnt["脚"] > cnt["头骨"]
    assert cnt["脚"] > cnt["颈部"]  # 头骨与颈部同为 4/216，抽样波动下不比较彼此


def test_attack_hit_contains_actors_and_weapon():
    random.seed(0)
    s = n.attack_hit("战士", "哥布林", "长剑", "挥砍", 8)
    assert "战士" in s and "哥布林" in s and "长剑" in s
    # 伤害数字（dmg > 0 时）
    assert "8" in s


def test_attack_hit_crit_mentions_crit():
    random.seed(0)
    assert "暴击" in n.attack_hit("战士", "哥布林", "长剑", "挥砍", 12, crit=True)


def test_attack_hit_ranged_uses_shoot():
    random.seed(0)
    s = n.attack_hit("哥布林", "战士", "Shortbow", "穿刺", 3, ranged=True)
    assert "短弓" in s          # 武器名已中文化
    assert "射" in s            # 远程用「射」


def test_attack_miss_uses_active_defense():
    # GURPS 主动防御：闪避 / 格挡 / 招架 三选一
    random.seed(0)
    got = {n.attack_miss("战士", "哥布林", melee=True) for _ in range(30)}
    assert any(("避开" in s or "格挡" in s or "架开" in s) for s in got)
    assert all("战士" in s and "哥布林" in s for s in got)


def test_attack_miss_includes_retreat_and_feverish_variants():
    # 主动防御变体：后撤闪避（Retreat）、狂热防御（Feverish Defense）应能出现
    random.seed(0)
    got = {n.attack_miss("战士", "哥布林", melee=True) for _ in range(200)}
    assert any("后撤" in s for s in got)
    assert any("狂热" in s for s in got)


def test_wound_multiplier_type_and_location():
    # 类型倍率：穿刺×2 / 挥砍×1.5 / 钝击×1；元素类恒 ×1
    assert n.wound_multiplier("躯干", "穿刺") == 2.0
    assert n.wound_multiplier("躯干", "挥砍") == 1.5
    assert n.wound_multiplier("躯干", "钝击") == 1.0
    assert n.wound_multiplier("躯干", "火焰") == 1.0
    assert n.wound_multiplier("躯干", "力场") == 1.0
    # 部位加成：头骨×4、颈部×2、其余×1
    assert n.wound_multiplier("头骨", "钝击") == 4.0    # 1.0 × 4
    assert n.wound_multiplier("头骨", "穿刺") == 8.0    # 2.0 × 4
    assert n.wound_multiplier("颈部", "挥砍") == 3.0    # 1.5 × 2
    assert n.wound_multiplier("腿", "挥砍") == 1.5      # 1.5 × 1
    assert n.wound_multiplier("手", "穿刺") == 2.0      # 2.0 × 1
    # 元素类命中要害也不参与部位加成
    assert n.wound_multiplier("头骨", "火焰") == 1.0


def test_attack_hit_uses_passed_location():
    # 传入既定部位时，命中叙事应体现该部位：部位名或该部位对应短语池
    pool = {"劈开头骨", "斩在颅顶", "削下一块头皮"}
    random.seed(0)
    for _ in range(20):
        s = n.attack_hit("战士", "哥布林", "长剑", "挥砍", 8, location="头骨")
        assert "头骨" in s or any(p in s for p in pool)


def test_save_narration_mentions_axis():
    random.seed(0)
    assert "反射" in n.save_success("法师", "ref")
    assert "意志" in n.save_fail("法师", "will", dmg=5)


def test_condition_narration():
    random.seed(0)
    assert "哥布林" in n.condition_apply("哥布林", "中毒")
    # 未收录状态直接回显状态名
    assert "虚弱" in n.condition_apply("哥布林", "虚弱")
    assert "中毒" in n.condition_recover("哥布林", "中毒")


def test_kill_and_down():
    random.seed(0)
    assert "哥布林" in n.kill("哥布林")
    assert "战士" in n.down("战士")


def test_death_save_outcomes():
    random.seed(0)
    for outcome in ("success", "fail", "crit", "fumble", "stable", "dead"):
        assert n.death_save("战士", outcome)


def test_resist_immune_vuln_mention_dtype():
    random.seed(0)
    assert "火焰" in n.resist("恶魔", "火焰")
    assert "毒素" in n.immune("骷髅", "毒素")
    assert "挥砍" in n.vuln("树精", "挥砍")


def test_cast_heal_move():
    random.seed(0)
    assert "火球术" in n.cast("法师", "哥布林", "火球术", dmg=20, dtype="火焰")
    assert "8" in n.heal("牧师", "战士", 8)
    s = n.move("战士", 30)
    assert "战士" in s and "30" in s
    # 疾行措辞至少有一个模板命中
    assert any("疾冲" in n.move("战士", 30, dash=True) for _ in range(30))


def test_battle_start_and_end():
    random.seed(0)
    s = n.battle_start(["战士", "法师"], ["哥布林"], 60)
    assert "战士" in s and "法师" in s and "哥布林" in s
    assert any("胜利" in n.battle_end("party", 5) for _ in range(30))
    assert any("失败" in n.battle_end("foe", 5) for _ in range(30))
