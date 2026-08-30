/**
 * CampaignRunner — 实时跑团（连本地 troupe HTTP API）。
 *
 * 后端：`python troupe/server.py`（默认 http://127.0.0.1:8765）。
 * 前端通过 fetch 调 /new（开一局）、/step（跑一场戏）、/state（取状态）、
 * /export（导出档案），把跑团从命令行搬到浏览器。
 */
import { useState } from "react";

const API = "http://127.0.0.1:8765";

interface CampaignState {
  ok: boolean;
  error?: string;
  meta: { name: string; seed: number | string; ruleset: string;
          module_id: string; total_xp: number; gold: number };
  party: { name: string; cls: string; level: number; hp: number; max_hp: number; alive: boolean }[];
  quests: { id: string; title: string; status: string; progress: number;
            depends_on: string[]; deadline_minutes: number; fail_condition: string }[];
  clocks: { id: string; name: string; filled: number; segments: number;
            kind: string; consumed: boolean }[];
  world: { current: string; places: { id: string; name: string; kind: string;
           danger: number; discovered: boolean }[] };
  log: { seq: number; ts: string; type: string; text: string }[];
  stats: { events: number; by_type: Record<string, number> };
  last_scene?: Record<string, unknown>;
}

const STATUS_CN: Record<string, string> = {
  active: "进行中", done: "已完成", failed: "失败", locked: "未解锁",
};

export function CampaignRunner() {
  const [state, setState] = useState<CampaignState | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [seed, setSeed] = useState(8);
  const [ruleset, setRuleset] = useState("dnd5e");
  const [module, setModule] = useState("generated");
  const [level, setLevel] = useState(3);
  const [count, setCount] = useState(2);

  async function call(path: string, method = "GET", body?: unknown) {
    const res = await fetch(API + path, {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return (await res.json()) as CampaignState;
  }

  async function run(fn: () => Promise<CampaignState>) {
    setBusy(true);
    setError("");
    try {
      const s = await fn();
      if (s && s.ok) setState(s);
      else setError(s?.error ?? "服务返回异常");
    } catch (e) {
      setError(`无法连接 ${API} —— 请先运行 F:/Python314/python.exe troupe/server.py`);
    } finally {
      setBusy(false);
    }
  }

  const newGame = () => run(() => call("/new", "POST",
    { seed, ruleset, module, level, count }));
  const step = () => run(() => call("/step", "POST", {}));
  const reload = () => run(() => call("/state"));

  function download() {
    call("/export").then((archive) => {
      const blob = new Blob([JSON.stringify(archive, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "campaign.json";
      a.click();
      URL.revokeObjectURL(a.href);
    }).catch(() => setError(`无法连接 ${API}`));
  }

  return (
    <div>
      <div className="row" style={{ marginBottom: 8 }}>
        <input type="number" value={seed} onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
               style={{ width: 56 }} title="种子" />
        <select value={ruleset} onChange={(e) => setRuleset(e.target.value)}>
          <option value="dnd5e">D&amp;D 5e</option>
          <option value="gurps">GURPS 4e</option>
          <option value="coc">CoC d100</option>
        </select>
        <select value={module} onChange={(e) => setModule(e.target.value)}>
          <option value="generated">程序化战役</option>
          <option value="border_shrine">边陲镇古神祭</option>
          <option value="">即兴（无模组）</option>
        </select>
        <input type="number" value={level} onChange={(e) => setLevel(parseInt(e.target.value) || 1)}
               style={{ width: 48 }} title="等级" />
        <input type="number" value={count} onChange={(e) => setCount(parseInt(e.target.value) || 1)}
               style={{ width: 48 }} title="人数" />
        <button onClick={newGame} disabled={busy}>新开一局</button>
        <button onClick={step} disabled={busy || !state}>下一步</button>
        <button onClick={reload} disabled={busy || !state}>刷新</button>
        <button onClick={download} disabled={!state}>导出 JSON</button>
      </div>

      {error && <div className="hint">{error}</div>}

      {state && (
        <div>
          <div className="row" style={{ marginBottom: 4 }}>
            <span className="tag">{state.meta.name}</span>
            <span className="tag">{state.meta.ruleset}</span>
            <span className="tag">XP {state.meta.total_xp}</span>
            <span className="tag">金币 {state.meta.gold}</span>
            <span className="tag">事件 {state.stats.events}</span>
          </div>

          {state.last_scene && (
            <div className="sub" style={{ marginBottom: 4 }}>
              上一场：{String(state.last_scene.text ?? state.last_scene.winner ??
                state.last_scene.outcome ?? "")}
            </div>
          )}

          <div className="row" style={{ marginBottom: 4 }}>
            {state.party.slice(0, 4).map((p) => (
              <span key={p.name} className="tag">
                {p.name} Lv{p.level} {p.hp}/{p.max_hp}
              </span>
            ))}
          </div>

          {state.quests.length > 0 && (
            <div className="sub">
              任务：{state.quests.slice(0, 3).map((q) =>
                `${q.title}(${STATUS_CN[q.status] ?? q.status})`).join(" · ")}
            </div>
          )}
          {state.clocks.length > 0 && (
            <div className="sub">
              时钟：{state.clocks.slice(0, 4).map((c) =>
                `${c.name} ${c.filled}/${c.segments}`).join(" · ")}
            </div>
          )}
          <div className="sub">位置：{state.world.current || "—"}</div>

          <div className="log" style={{ marginTop: 6, maxHeight: 240, overflowY: "auto" }}>
            {state.log.filter((e) => e.text).slice().reverse().map((e) => (
              <div key={e.seq}>
                <span className="meta">#{e.seq} [{e.ts}] {e.type}</span> {e.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
