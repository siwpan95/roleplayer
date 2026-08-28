"""cli.py - D&D-GURPS 变体角色构建器命令行界面

基于新的 d20 包，提供交互式角色构建、掷骰测试与战斗宏演示。
运行：python cli.py
"""
from d20 import Character


def _set_attributes(char: Character):
    for attr in ["力量", "敏捷", "体质", "智力", "感知", "魅力"]:
        while True:
            val = input(f"  {attr} (当前{char.attributes[attr]}, 输入新值或回车跳过): ").strip()
            if val == "":
                break
            try:
                ok, msg = char.set_attribute(attr, int(val))
                print(f"  {msg}")
                if ok:
                    break
            except ValueError:
                print("  请输入数字")


def _perks(char: Character):
    print("  优点库:")
    for i, (n, c) in enumerate(char.ADVANTAGES_LIBRARY.items(), 1):
        print(f"    {i}. {n} ({c}CP)")
    print("  缺点库:")
    base = len(char.ADVANTAGES_LIBRARY)
    for i, (n, r) in enumerate(char.DISADVANTAGES_LIBRARY.items(), 1):
        print(f"    {base+i}. {n} (+{r}CP)")
    choice = input("  输入名称添加, 0返回: ").strip()
    if choice == "0" or not choice:
        return
    if choice in char.ADVANTAGES_LIBRARY:
        print("  " + " ".join(char.add_advantage_by_name(choice)))
    elif choice in char.DISADVANTAGES_LIBRARY:
        print("  " + " ".join(char.add_disadvantage_by_name(choice)))
    else:
        print("  未知项")


def _talents(char: Character):
    print("  天赋列表 (每级5CP):")
    for name in char.TALENT_BONUS_GROUPS:
        skills = ", ".join(char.TALENT_BONUS_GROUPS[name])
        print(f"    {name} -> {skills}")
    tname = input("  天赋名: ").strip()
    if not tname:
        return
    level = input("  等级(1-3, 默认1): ").strip()
    level = int(level) if level else 1
    print("  " + " ".join(char.add_talent(tname, level)))


def _skills(char: Character):
    print("  技能列表:")
    items = list(char.SKILL_LIBRARY.items())
    for i, (sk, (attr, diff, _)) in enumerate(items, 1):
        cur = char.skills.get(sk, 0)
        print(f"    {i}. {sk} ({attr}/{diff}) 当前:{cur}")
    try:
        idx = int(input("  选择技能编号: ")) - 1
        sk_name = items[idx][0]
        target = int(input(f"  目标绝对等级: "))
        print("  " + " ".join(char.purchase_skill(sk_name, target)))
    except (ValueError, IndexError):
        print("  无效输入")


def _techniques(char: Character):
    print("  技术列表:")
    items = list(char.TECHNIQUES.items())
    for i, (tech, (req, rank, attr_req, _pen, cost, desc)) in enumerate(items, 1):
        owned = "✓" if tech in char.techniques else " "
        print(f"    {i}. [{owned}] {tech} (需{req}{rank} {attr_req or ''}, CP:{cost}) - {desc}")
    try:
        idx = int(input("  选择技术编号: ")) - 1
        tech_name = items[idx][0]
        print("  " + " ".join(char.purchase_technique(tech_name)))
    except (ValueError, IndexError):
        print("  无效输入")


def _equipment(char: Character):
    print("  装备库:")
    items = list(char.EQUIPMENT_LIBRARY.items())
    for i, (name, (etype, sub, armor, _md, _w, desc, cp)) in enumerate(items, 1):
        owned = "✓" if name in char.equipment else " "
        print(f"    {i}. [{owned}] {name} ({etype}/{sub}, AC+{armor}, {cp}CP) - {desc}")
    sub = input("  [e]装备 [u]卸下 [0]返回: ").strip()
    if sub == "e":
        try:
            idx = int(input("  装备编号: ")) - 1
            print("  " + " ".join(char.equip_item(items[idx][0])))
        except (ValueError, IndexError):
            print("  无效输入")
    elif sub == "u":
        if not char.equipment:
            print("  未装备任何物品")
            return
        for i, name in enumerate(char.equipment, 1):
            print(f"    {i}. {name}")
        try:
            idx = int(input("  卸下编号: ")) - 1
            print("  " + " ".join(char.unequip_item(char.equipment[idx])))
        except (ValueError, IndexError):
            print("  无效输入")


def _roll_test(char: Character):
    print("  1. D20检定  2. D100技能成功率  3. GURPS 3d6检定  4. D6伤害")
    t = input("  选: ").strip()
    if t == "1":
        sk = input("  技能名: ").strip()
        dc = int(input("  DC: "))
        print("  " + char.d20_check(sk, dc))
    elif t == "2":
        sk = input("  技能名: ").strip()
        print("  " + char.d100_check(sk))
    elif t == "3":
        sk = input("  技能名: ").strip()
        print("  " + char.gurps_check(sk))
    elif t == "4":
        n = int(input("  骰数: "))
        m = int(input("  加值: "))
        print("  " + char.roll_d6(n, m))


def _combat_demo(char: Character):
    macros = ["melee_attack", "sneak_attack", "power_attack", "whirlwind",
              "fireball", "magic_missile", "healing_word",
              "deceptive_attack", "rapid_strike", "allout_strong", "allout_determined"]
    for i, m in enumerate(macros, 1):
        print(f"    {i}. {m}")
    try:
        idx = int(input("  选择宏编号: ")) - 1
        m = macros[idx]
        print(char.combat_macro(m, target_ac=12, num_targets=2, flat_footed=True))
    except (ValueError, IndexError):
        print("  无效输入")


def _classes(char: Character):
    """职业：选择 / 升级 / 子职业 / 特性速览。"""
    from d20.classes import level_up_cost

    print(f"  当前职业: {char.class_summary()} | 生命骰 d{char.hit_die()}")
    print("  职业列表（生命骰 / 关键属性 / 施法 / 可选技能数）:")
    items = list(char.CLASSES.items())
    for i, (name, c) in enumerate(items, 1):
        sp = c["spellcasting"]
        prog = f"{sp['progression']}({sp['ability']})" if sp else "无"
        print(f"    {i}. {name}  d{c['hit_die']}  {'/'.join(c['primary'])}  {prog}  "
              f"自选{c['skill_choice_count']}技能  子职业:{'/'.join(c['subclasses'])}")
    print(f"  [s]选择职业  [u]升级(下一级 {level_up_cost(char.level + 1)}CP)  "
          f"[t]升级至…  [b]选子职业  [f]特性详情  [0]返回")
    sub = input("  选: ").strip().lower()
    try:
        if sub == "s":
            idx = int(input("  职业编号: ")) - 1
            name = items[idx][0]
            pool = items[idx][1]["skill_choices"]
            print(f"  可选熟练技能: {', '.join(pool)}")
            picks = input(f"  自选 {items[idx][1]['skill_choice_count']} 项（逗号分隔，回车自动取前几项）: ").strip()
            choices = [p.strip() for p in picks.split(",") if p.strip()] or None
            print("  " + " / ".join(char.set_class(name, choices)))
        elif sub == "u":
            print("  " + " / ".join(char.level_up()))
        elif sub == "t":
            print("  " + " / ".join(char.level_to(int(input("  目标等级: ")))))
        elif sub == "b":
            print("  " + " / ".join(char.set_subclass(input("  子职业名: ").strip())))
        elif sub == "f":
            for f in char.class_features():
                d = char.class_feature_detail(f)
                print(f"    - {f}（{d['en']}，{d['class']} Lv.{d['level']}）")
    except (ValueError, IndexError):
        print("  无效输入")


def _reference(char: Character):
    """SRD 规则速查与装备/特性检索。"""
    print("  [1]规则章节检索  [2]规则正文  [3]装备检索  [4]特性检索  [5]分类浏览  [0]返回")
    t = input("  选: ").strip()
    if t == "1":
        hits = char.search_rules(input("  关键词（中/英均可）: ").strip())
        print("  命中: " + ("、".join(hits) if hits else "无"))
    elif t == "2":
        name = input("  规则章节名: ").strip()
        body = char.rule(name)
        print("  " + (body[:600] + ("…" if len(body) > 600 else "") if body else "未找到"))
    elif t == "3":
        name = input("  装备名: ").strip()
        g = char.gear_info(name)
        if not g:
            print("  未找到")
            return
        print(f"    {name}（{g['en']}） 分类={g['cat']}/{g['sub']} "
              f"价格={g['cost_gp']}gp 重量={g['weight']}")
        if g["damage"]:
            print(f"    伤害 {g['damage']} {g['damage_type']}"
                  + (f"，双手 {g['two_handed']}" if g["two_handed"] else ""))
        if g["armor_class"]:
            print(f"    AC {g['armor_class']}" + ("（可加敏捷）" if g["armor_dex"] else "（无敏捷）"))
    elif t == "4":
        d = char.class_feature_detail(input("  特性名: ").strip())
        if not d:
            print("  未找到")
            return
        print(f"    {d['en']} | {d['class']} Lv.{d['level']}")
        print("    " + "\n    ".join(d["desc_en"]))
    elif t == "5":
        kind = input(f"  类别（{'/'.join(char.reference_kinds())}）: ").strip()
        names = char.reference_names(kind)
        print(f"  共 {len(names)} 项: " + "、".join(names[:40])
              + ("…" if len(names) > 40 else ""))


def _battle_cli(char: Character):
    """模拟对战：遭遇评估 / 构建 / 单场 / 蒙特卡洛。"""
    print("  [1]遭遇难度评估  [2]按难度构建遭遇  [3]单场模拟对战  [4]蒙特卡洛  [0]返回")
    t = input("  选: ").strip()
    try:
        if t == "1":
            lvs = [int(x) for x in input("  队伍等级（逗号分隔，如 3,3,4）: ").split(",")]
            names = [n.strip() for n in input("  怪物名（逗号分隔，中文名）: ").split(",")]
            ev = char.battle_evaluate(lvs, names)
            print(f"    基础 XP {ev['base_xp']} × {ev['multiplier']}（遭遇倍数）"
                  f" = 调整 XP {ev['adjusted_xp']}")
            print(f"    难度: {ev['difficulty_cn']}（阈值 "
                  f"{' / '.join(f'{k}={v}' for k, v in ev['thresholds'].items())}）")
            print(f"    每日预算: {ev['daily_budget']} XP")
        elif t == "2":
            lvs = [int(x) for x in input("  队伍等级（逗号分隔）: ").split(",")]
            diff = input("  难度（easy/medium/hard/deadly，默认 medium）: ").strip() or "medium"
            ev = char.battle_build(lvs, diff)
            print(f"    编组: {' + '.join(ev['monsters'])}")
            print(f"    难度: {ev['difficulty_cn']}（调整 XP {ev['adjusted_xp']}）")
        elif t == "3":
            names = [n.strip() for n in input("  怪物（逗号分隔，可用 名x数量，如 哥布林x3,兽人）: ").split(",")]
            foes = []
            for n in names:
                if "x" in n:
                    nm, cnt = n.rsplit("x", 1)
                    foes.append((nm.strip(), int(cnt)))
                else:
                    foes.append(n)
            char.battle_create([char], foes)
            r = char.battle_run()
            print(char.battle_report())
        elif t == "4":
            names = [n.strip() for n in input("  怪物（逗号分隔，可用 名x数量）: ").split(",")]
            foes = []
            for n in names:
                if "x" in n:
                    nm, cnt = n.rsplit("x", 1)
                    foes.append((nm.strip(), int(cnt)))
                else:
                    foes.append(n)
            trials = int(input("  次数（默认 200）: ") or 200)
            r = char.battle_simulate([char], foes, trials=trials)
            print(f"    胜率 {r['win_rate'] * 100:.1f}% | 败率 {r['loss_rate'] * 100:.1f}% | "
                  f"平局 {r['draw_rate'] * 100:.1f}%")
            print(f"    平均 {r['avg_rounds']} 回合 | 平均剩余 HP {r['avg_remaining_hp']}")
    except (ValueError, IndexError):
        print("  无效输入")


def main():
    char = Character()
    print("=" * 50)
    print(" D&D-GURPS 变体角色构建器 v2.2")
    print(" 融合 D&D 三宝书 + GURPS Basic Set 规则")
    print("=" * 50)
    while True:
        print(f"\n当前 CP: {char.cp} | HP: {char.hp()} | AC: {char.ac}")
        print("1.属性  2.优缺点  3.天赋  4.技能  5.技术  6.装备  "
              "7.角色卡  8.掷骰  9.战斗宏  10.职业  11.规则速查  12.模拟对战  0.完成退出")
        cmd = input("选择: ").strip()
        if cmd == "1":
            _set_attributes(char)
        elif cmd == "2":
            _perks(char)
        elif cmd == "3":
            _talents(char)
        elif cmd == "4":
            _skills(char)
        elif cmd == "5":
            _techniques(char)
        elif cmd == "6":
            _equipment(char)
        elif cmd == "7":
            print(char.show_sheet())
        elif cmd == "8":
            _roll_test(char)
        elif cmd == "9":
            _combat_demo(char)
        elif cmd == "10":
            _classes(char)
        elif cmd == "11":
            _reference(char)
        elif cmd == "12":
            _battle_cli(char)
        elif cmd == "0":
            missing = char.check_foundations()
            if missing:
                print(f"⚠ 警告: 缺少根基科 {', '.join(missing)}，请至少投入1级")
            else:
                print("✓ 角色创建完成！最终角色卡：")
                print(char.show_sheet())
            break
        else:
            print("无效选择")


if __name__ == "__main__":
    main()
