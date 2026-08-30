/**
 * CampaignPanel — 跑团战役档案面板（troupe 侧 Web 渲染）。
 *
 * 在此之前 web 端只有角色构建器 UI，对 troupe（跑团模拟器）零覆盖。
 * 本组件消费 Python 侧 ``troupe.export.export_json`` 导出的战役档案
 * （粘贴 JSON 或选择 .json 文件），渲染成可读的战役报告：
 * 概览 / 队伍 / 任务（含依赖·期限）/ 时钟 / 世界 / 事件时间轴。
 */
import { useState } from "react";

export interface ArchiveMeta {
  name: string;
  seed: number | string;
  ruleset: string;
  module_id: string;
  total_xp: number;
  gold: number;
}
export interface ArchiveMember {
  name: string; cls: string; level: number;
  hp: number; max_hp: number; alive: boolean;
}
export interface ArchiveQuest {
  id: string; title: string; status: string; progress: number;
  depends_on: string[]; deadline_minutes: number; fail_condition: string;
}
export interface ArchiveClock {
  id: string; name: string; filled: number; segments: number;
  kind: string; consumed: boolean;
}
export interface ArchivePlace {
  id: string; name: string; kind: string; danger: number; discovered: boolean;
}
export interface ArchiveEvent { seq: number; ts: string; type: string; text: string; tags: string[]; }
export interface Archive {
  meta: ArchiveMeta;
  party: ArchiveMember[];
  world: { current: string; places: ArchivePlace[] };
  quests: ArchiveQuest[];
  clocks: ArchiveClock[];
  factions: { id: string; name: string; standing: number; power: number }[];
  timeline: ArchiveEvent[];
  stats: { events: number; by_type: Record<string, number> };
}

const STATUS_CN: Record<string, string> = {
  active: "进行中", done: "已完成", failed: "失败", locked: "未解锁",
};

function isArchive(x: unknown): x is Archive {
  const a = x as Archive;
  return !!a && !!a.meta && Array.isArray(a.timeline) && Array.isArray(a.quests);
}

export function CampaignPanel() {
  const [archive, setArchive] = useState<Archive | null>(null);
  const [error, setError] = useState("");
  const [raw, setRaw] = useState("");

  function load(text: string) {
    setRaw(text);
    try {
      const data = JSON.parse(text);
      if (!isArchive(data)) throw new Error("不是有效的战役档案 JSON");
      setArchive(data);
      setError("");
    } catch (e) {
      setArchive(null);
      setError((e as Error).message ?? String(e));
    }
  }

  async function pickFile() {
    const inp = document.createElement("input");
    inp.type = "file";
    inp.accept = "application/json,.json";
    inp.onchange = async () => {
      const f = inp.files?.[0];
      if (f) load(await f.text());
    };
    inp.click();
  }

  if (!archive) {
    return (
      <div>
        <div className="sub" style={{ marginBottom: 8 }}>
          粘贴 Python 侧 <code>troupe.export.export_json(sim)</code> 导出的战役档案，
          或选择导出的 <code>.json</code> 文件。
        </div>
        <textarea
          rows={6}
          style={{ width: "100%", boxSizing: "border-box", fontFamily: "monospace" }}
          placeholder='{"meta":{"name":"…"},"party":[…],"timeline":[…]…}'
          value={raw}
          onChange={(ev) => setRaw(ev.target.value)}
        />
        <div className="row" style={{ marginTop: 8 }}>
          <button onClick={() => load(raw)}>渲染档案</button>
          <button onClick={pickFile}>选择 JSON 文件…</button>
        </div>
        {error && <div className="hint">解析失败：{error}</div>}
      </div>
    );
  }

  const { meta, party, quests, clocks, world, factions, timeline, stats } = archive;
  return (
    <div>
      <div className="row" style={{ marginBottom: 8 }}>
        <button onClick={() => { setArchive(null); setError(""); }}>← 换一份档案</button>
        <span className="tag">{meta.ruleset}</span>
        <span className="tag">种子 {meta.seed}</span>
        <span className="tag">模组 {meta.module_id || "即兴"}</span>
        <span className="tag">XP {meta.total_xp}</span>
        <span className="tag">金币 {meta.gold}</span>
      </div>

      <div className="sub">事件 {stats.events} 条 ·{" "}
        {Object.entries(stats.by_type).slice(0, 6).map(([t, n]) => `${t}×${n}`).join(" · ")}
      </div>

      {party.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div className="sub">队伍</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {party.map((p) => (
                <tr key={p.name}>
                  <td>{p.name}</td>
                  <td>{p.cls || "—"}</td>
                  <td>Lv{p.level}</td>
                  <td>{p.hp}/{p.max_hp}</td>
                  <td>{p.alive ? "存活" : "倒下"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {quests.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div className="sub">任务</div>
          {quests.map((q) => (
            <div key={q.id} className="plugin" style={{ justifyContent: "flex-start" }}>
              <strong>{q.title}</strong>
              <span className="tag">{STATUS_CN[q.status] ?? q.status}</span>
              <span className="tag">{Math.round(q.progress * 100)}%</span>
              {q.depends_on.length > 0 && <span className="tag">前置 {q.depends_on.join("、")}</span>}
              {q.deadline_minutes > 0 && <span className="tag">期限 {q.deadline_minutes} 分钟</span>}
              {q.fail_condition && <span className="tag">失败条件 {q.fail_condition}</span>}
            </div>
          ))}
        </div>
      )}

      {clocks.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div className="sub">时钟</div>
          {clocks.map((c) => (
            <div key={c.id} className="plugin" style={{ justifyContent: "flex-start" }}>
              <strong>{c.name}</strong>
              <span className="tag">{c.filled}/{c.segments}</span>
              <span className="tag">{c.kind}</span>
              {c.consumed && <span className="tag">已兑现</span>}
            </div>
          ))}
        </div>
      )}

      {world.places.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div className="sub">世界 · 当前位置：{world.current || "—"}</div>
          {world.places.map((p) => (
            <div key={p.id} className="plugin" style={{ justifyContent: "flex-start" }}>
              <span>{p.discovered ? "✔" : "·"} {p.name}</span>
              <span className="tag">{p.kind}</span>
              <span className="tag">危险 {p.danger}</span>
            </div>
          ))}
        </div>
      )}

      {factions.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div className="sub">派系</div>
          {factions.map((f) => (
            <span key={f.id} className="tag">{f.name}（声望 {f.standing}）</span>
          ))}
        </div>
      )}

      <div style={{ marginTop: 10 }}>
        <div className="sub">事件时间轴</div>
        <div className="log" style={{ maxHeight: 320, overflowY: "auto" }}>
          {timeline.filter((e) => e.text).map((e) => (
            <div key={e.seq}>
              <span className="meta">#{e.seq} [{e.ts}] {e.type}</span> {e.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
