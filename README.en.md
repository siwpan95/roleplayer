# Role Player — TRPG Simulator v3.0 (package name: `d20`)

A tabletop role-playing game (TRPG) simulator blending the **D&D three core books**
(PHB / DMG / MM), the **GURPS Basic Set**, and **Call of Cthulhu** rules:
character building (point-buy), GM emulation (Oracle), three rule-set resolution,
combat / magic / provisions, quests / clocks, and save / replay.

## Quick start

```bash
pip install -r requirements.txt        # runtime: stdlib only (PyYAML optional)
python mvp_gui.py                      # or: python -m gui.app  (tkinter GUI)
python cli.py                          # command-line interface
python sim_cli.py --demo               # troupe campaign simulator demo
python -m pytest tests/ -v             # 665 unit tests
```

Web panel (React + Vite, zero runtime deps beyond React):

```bash
cd web && npm ci && npm run build && npm test
```

## Architecture

- `d20/` — rule services assembled via `composition.yml` (mini-Cordis: Context /
  Service / dependency injection / event lifecycle), D&D + GURPS unified data hub.
- `troupe/` — campaign simulator: GM emulator (Oracle/Director), world model
  (NPC / factions / quests / clocks / calendar / lore), encounters (D&D 5e /
  GURPS 4e / CoC d100), NPC agency, dungeon spatial maps, persistence + replay,
  HTTP API (`/new /step /state /export`, zero-dependency `http.server`), and
  rich-text export (Markdown / self-contained HTML / JSON).
- `web/` — browser panels mirroring the engine in TypeScript (SRD datasets kept
  1:1 with the Python side via `gen_ts_data.py`).
- `gui/` — tkinter desktop GUI; `installer.py` — self-contained Windows
  installer wizard (pure stdlib, no third-party installer toolkit).

## Rule content & licensing

- **D&D 5e SRD** data (monsters / spells / magic items / classes / equipment /
  conditions / feats / proficiencies) is converted from the official open API
  `https://www.dnd5eapi.co/api/2014/` (see `pull_srd.py`). SRD 5.1 content is
  © Wizards of the Coast LLC, licensed under CC-BY-4.0 — see the attribution
  section in `README.md`.
- GURPS / CoC rule adaptations are original re-implementations of game
  mechanics for interoperability; names referenced for compatibility only.

## License

MIT — see `LICENSE` (Copyright (c) 2026 siwpan).
