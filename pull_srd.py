"""Pull the full D&D 5e SRD (2014) from the authoritative dnd5eapi.co REST API.

Stores every detail record under _srd_pull/{category}/{index}.json as verifiable
provenance evidence. Resumable: skips files already present. Multithreaded.

Categories: monsters (334), spells (319), magic-items (362), conditions (15).
"""
import json
import os
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE = "https://www.dnd5eapi.co"
PULL = r"E:/D20/_srd_pull"

CATS = {
    "monsters": "monsters",
    "spells": "spells",
    "magicitems": "magic-items",
    "conditions": "conditions",
}

HEADERS = {"User-Agent": "d20-srd-pull/1.0"}


def fetch(url: str):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))


def load_index(cat: str):
    with open(os.path.join(PULL, f"{cat}_idx.json"), encoding="utf-8") as f:
        return json.load(f)


def worker(cat: str, entry: dict):
    idx = entry["index"]
    out = os.path.join(PULL, cat, f"{idx}.json")
    if os.path.exists(out):
        return (idx, "skip")
    try:
        data = fetch(f"{BASE}{entry['url']}")
        with open(out, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=1)
        return (idx, "ok")
    except Exception as e:  # noqa: BLE001
        return (idx, f"ERR:{type(e).__name__}:{e}")


def main():
    for cat, _apicat in CATS.items():
        os.makedirs(os.path.join(PULL, cat), exist_ok=True)
        idx = load_index(cat)
        results = idx["results"]
        print(f"== {cat}: {len(results)} entries ==")
        ok = skip = err = 0
        errs = []
        with ThreadPoolExecutor(max_workers=16) as ex:
            futs = [ex.submit(worker, cat, e) for e in results]
            for i, fu in enumerate(as_completed(futs), 1):
                _idx, st = fu.result()
                if st == "ok":
                    ok += 1
                elif st == "skip":
                    skip += 1
                else:
                    err += 1
                    errs.append((_idx, st))
                if i % 100 == 0:
                    print(f"  progress {i}/{len(results)} ok={ok} skip={skip} err={err}")
        for e in errs[:15]:
            print("  ERR", e)
        print(f"  done ok={ok} skip={skip} err={err}")


if __name__ == "__main__":
    main()
