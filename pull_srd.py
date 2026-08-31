"""Pull the full D&D 5e SRD (2014) from the authoritative dnd5eapi.co REST API.

Stores every detail record under _srd_pull/{category}/{index}.json as verifiable
provenance evidence. Resumable: skips files already present. Multithreaded.

Categories (v2.1 全量):
  monsters (334), spells (319), magic-items (362), conditions (15),
  classes (12), subclasses (12), features (407), equipment (237),
  equipment-categories (39), proficiencies (117), skills (18), languages (16),
  damage-types (13), magic-schools (8), ability-scores (6), alignments (9),
  weapon-properties (11), rules (6), rule-sections (33), traits (38),
  subraces (4), races (9).

Nested: class levels 1..20 for each of the 12 classes -> _srd_pull/classes_levels/.
"""
import json
import os
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE = "https://www.dnd5eapi.co"
API = f"{BASE}/api/2014"
PULL = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_srd_pull")  # 2026-08-31：原 E:/D20 硬编码改相对

# 本地目录名 -> API 类别路径
CATS = {
    # ---- v2.0 已拉取（保留，断点续传会跳过）----
    "monsters": "monsters",
    "spells": "spells",
    "magicitems": "magic-items",
    "conditions": "conditions",
    # ---- v2.1 新增 ----
    "classes": "classes",
    "subclasses": "subclasses",
    "features": "features",
    "equipment": "equipment",
    "equipment_categories": "equipment-categories",
    "proficiencies": "proficiencies",
    "skills": "skills",
    "languages": "languages",
    "damage_types": "damage-types",
    "magic_schools": "magic-schools",
    "ability_scores": "ability-scores",
    "alignments": "alignments",
    "weapon_properties": "weapon-properties",
    "rules": "rules",
    "rule_sections": "rule-sections",
    "traits": "traits",
    "subraces": "subraces",
    "races": "races",
}

HEADERS = {"User-Agent": "d20-srd-pull/2.1"}
LEVEL_MIN, LEVEL_MAX = 1, 20

#: Windows 保留设备名（作为文件名基名时 Win32 API 拒绝打开，git 无法索引）。
#: SRD 的体质属性 index 恰为 `con`，必须脱敏后才能落盘入库。
_WIN_RESERVED = {"CON", "PRN", "AUX", "NUL"} | {
    f"{p}{i}" for p in ("COM", "LPT") for i in range(1, 10)
}


def safe_index(index: str) -> str:
    """把 API 的 index 脱敏为 Windows 合法文件名基名（保留名追加下划线）。"""
    return f"{index}_" if index.upper() in _WIN_RESERVED else index


def fetch(url: str):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))


def fetch_index(apicat: str, cat: str) -> list[dict]:
    """读取本地索引（不存在则联网拉取并落盘）。"""
    path = os.path.join(PULL, f"{cat}_idx.json")
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            return json.load(f)["results"]
    data = fetch(f"{API}/{apicat}")
    os.makedirs(PULL, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    return data["results"]


def save(relpath: str, data: dict) -> None:
    out = os.path.join(PULL, relpath)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)


def worker(relpath: str, url: str):
    """拉取单条明细并落盘；已存在则跳过。"""
    out = os.path.join(PULL, relpath)
    if os.path.exists(out):
        return (relpath, "skip")
    try:
        save(relpath, fetch(url))
        return (relpath, "ok")
    except Exception as e:  # noqa: BLE001
        return (relpath, f"ERR:{type(e).__name__}:{e}")


def run_batch(jobs: list[tuple[str, str]], label: str) -> int:
    """并发执行 (relpath, url) 作业列表，返回错误数。"""
    ok = skip = err = 0
    errs = []
    with ThreadPoolExecutor(max_workers=16) as ex:
        futs = [ex.submit(worker, p, u) for p, u in jobs]
        for i, fu in enumerate(as_completed(futs), 1):
            _p, st = fu.result()
            if st == "ok":
                ok += 1
            elif st == "skip":
                skip += 1
            else:
                err += 1
                errs.append((_p, st))
            step = 100 if len(jobs) > 400 else 50
            if i % step == 0:
                print(f"  progress {i}/{len(jobs)} ok={ok} skip={skip} err={err}", flush=True)
    for e in errs[:15]:
        print("  ERR", e)
    print(f"  {label}: ok={ok} skip={skip} err={err}", flush=True)
    return err


def main() -> int:
    total_err = 0

    # ---------- 1. 扁平类别：索引 -> 明细 ----------
    for cat, apicat in CATS.items():
        results = fetch_index(apicat, cat)
        print(f"== {cat} ({apicat}): {len(results)} entries ==", flush=True)
        jobs = [(f"{cat}/{safe_index(e['index'])}.json", f"{BASE}{e['url']}")
                for e in results]
        total_err += run_batch(jobs, cat)

    # ---------- 2. 嵌套：12 职业 × 1..20 级 ----------
    class_idx = fetch_index("classes", "classes")
    jobs = []
    for c in class_idx:
        for lv in range(LEVEL_MIN, LEVEL_MAX + 1):
            jobs.append(
                (f"classes_levels/{c['index']}-{lv}.json",
                 f"{API}/classes/{c['index']}/levels/{lv}")
            )
    print(f"== classes_levels: {len(jobs)} entries ==", flush=True)
    total_err += run_batch(jobs, "classes_levels")

    print(f"\nTOTAL ERRORS: {total_err}")
    return total_err


if __name__ == "__main__":
    raise SystemExit(main())
