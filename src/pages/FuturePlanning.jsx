import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  Plus, Trash2, ChevronDown, ChevronUp, CheckCircle, Circle,
  AlertTriangle, TrendingUp, FileText, GraduationCap, Flag,
  LineChart, Target, DollarSign, BarChart2,
} from "lucide-react";

/* ─── Helpers ────────────────────────────────────────────────────── */
function useLS(key, def) {
  const [v, setV] = useState(() => {
    try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : def; } catch { return def; }
  });
  const set = (val) => {
    const next = typeof val === "function" ? val(v) : val;
    setV(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  };
  return [v, set];
}

const GOLD = "#c9a84c";
const GREEN = "#22c55e";
const RED = "#ef4444";
const BLUE = "#3b82f6";
const ORANGE = "#f97316";

const fc = (n) => {
  const abs = Math.abs(n || 0);
  if (abs >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (abs >= 1e3) return "$" + (n / 1e3).toFixed(0) + "K";
  return "$" + Math.round(n || 0).toLocaleString();
};

const ASSET_TYPES = [
  "Primary Home", "Investment Property", "Retirement Account (401k/IRA)",
  "Brokerage Account", "Bank/Savings Account", "Life Insurance",
  "Business Interest", "Vehicle", "Other",
];
const ASSET_COLORS = [GOLD, BLUE, GREEN, "#a855f7", "#14b8a6", ORANGE, "#f43f5e", "#64748b", "#84cc16"];

const RELATIONSHIPS = ["Spouse", "Child", "Parent", "Sibling", "Grandchild", "Friend", "Charity", "Other"];

/* ─── Tabs ────────────────────────────────────────────────────────── */
const TABS = [
  { key: "snapshot", label: "Estate Snapshot", icon: TrendingUp },
  { key: "checklist", label: "Estate Checklist", icon: Flag },
  { key: "learn", label: "Learn", icon: GraduationCap },
];

/* ─── Shared components ──────────────────────────────────────────── */
const inputStyle = {
  background: "var(--bg)", border: "1px solid var(--border-c)", borderRadius: 6,
  padding: "7px 10px", fontSize: "0.8125rem", color: "var(--text-1)",
  outline: "none", width: "100%",
};
const selectStyle = { ...inputStyle, cursor: "pointer" };

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: "0.5625rem", fontWeight: 800, letterSpacing: "0.12em",
      textTransform: "uppercase", color: "var(--text-3)", marginBottom: "0.625rem" }}>
      {children}
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ background: "var(--surface)", borderRadius: 10,
      border: "1px solid var(--border-c)", padding: "1.25rem", ...style }}>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   TAB 1 — ESTATE SNAPSHOT
══════════════════════════════════════════════════════════════════ */
const EMPTY_ASSET = () => ({ id: Date.now(), name: "", type: ASSET_TYPES[0], value: "", beneficiary: "" });
const EMPTY_BEN = () => ({ id: Date.now(), name: "", relationship: RELATIONSHIPS[0], pct: "" });

function TabSnapshot() {
  const [assets, setAssets] = useLS("fp_assets_v2", []);
  const [liabilities, setLiabilities] = useLS("fp_liabilities_v2", []);
  const [beneficiaries, setBeneficiaries] = useLS("fp_beneficiaries_v2", []);

  const totalAssets = assets.reduce((s, a) => s + (parseFloat(a.value) || 0), 0);
  const totalLiab = liabilities.reduce((s, l) => s + (parseFloat(l.value) || 0), 0);
  const netWorth = totalAssets - totalLiab;
  const totalBenPct = beneficiaries.reduce((s, b) => s + (parseFloat(b.pct) || 0), 0);

  const pieData = assets
    .filter(a => parseFloat(a.value) > 0)
    .map(a => ({ name: a.name || a.type, value: parseFloat(a.value) }));

  const addAsset = () => setAssets(p => [...p, EMPTY_ASSET()]);
  const removeAsset = (id) => setAssets(p => p.filter(a => a.id !== id));
  const updateAsset = (id, field, val) => setAssets(p => p.map(a => a.id === id ? { ...a, [field]: val } : a));

  const addLiab = () => setLiabilities(p => [...p, { id: Date.now(), name: "", value: "" }]);
  const removeLiab = (id) => setLiabilities(p => p.filter(l => l.id !== id));
  const updateLiab = (id, field, val) => setLiabilities(p => p.map(l => l.id === id ? { ...l, [field]: val } : l));

  const addBen = () => setBeneficiaries(p => [...p, EMPTY_BEN()]);
  const removeBen = (id) => setBeneficiaries(p => p.filter(b => b.id !== id));
  const updateBen = (id, field, val) => setBeneficiaries(p => p.map(b => b.id === id ? { ...b, [field]: val } : b));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Net Worth Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.75rem" }}>
        {[
          { label: "Total Assets", value: fc(totalAssets), color: GREEN },
          { label: "Total Liabilities", value: fc(totalLiab), color: RED },
          { label: "Net Worth", value: fc(netWorth), color: netWorth >= 0 ? GOLD : RED, big: true },
        ].map(c => (
          <div key={c.label} style={{
            background: "var(--surface)", borderRadius: 10, padding: "1rem 1.25rem",
            border: `1px solid ${c.big ? c.color + "50" : "var(--border-c)"}`,
            borderTop: c.big ? `3px solid ${c.color}` : undefined,
          }}>
            <div style={{ fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase",
              color: "var(--text-3)", marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: c.big ? "1.75rem" : "1.375rem", fontWeight: 800,
              fontFamily: "monospace", color: c.color, lineHeight: 1 }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>

        {/* Assets */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
            <SectionLabel>Assets</SectionLabel>
            <button onClick={addAsset} style={{
              display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 5,
              border: `1px solid ${GOLD}50`, background: `${GOLD}10`, color: GOLD,
              cursor: "pointer", fontSize: "0.6875rem", fontWeight: 700,
            }}>
              <Plus size={11} /> Add
            </button>
          </div>

          {assets.length === 0 && (
            <div style={{ textAlign: "center", padding: "1.5rem 0", color: "var(--text-3)", fontSize: "0.6875rem" }}>
              No assets added yet. Click Add to get started.
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {assets.map((a, i) => (
              <div key={a.id} style={{ display: "grid", gridTemplateColumns: "1fr 120px 32px", gap: 6 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <input value={a.name} onChange={e => updateAsset(a.id, "name", e.target.value)}
                    placeholder="Asset name" style={{ ...inputStyle, fontSize: "0.75rem" }} />
                  <select value={a.type} onChange={e => updateAsset(a.id, "type", e.target.value)}
                    style={{ ...selectStyle, fontSize: "0.625rem" }}>
                    {ASSET_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <input value={a.beneficiary} onChange={e => updateAsset(a.id, "beneficiary", e.target.value)}
                    placeholder="Beneficiary (optional)" style={{ ...inputStyle, fontSize: "0.625rem" }} />
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", paddingTop: 2 }}>
                  <div style={{ position: "relative", width: "100%" }}>
                    <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)",
                      fontSize: "0.75rem", color: "var(--text-3)" }}>$</span>
                    <input type="number" value={a.value} onChange={e => updateAsset(a.id, "value", e.target.value)}
                      placeholder="0" style={{ ...inputStyle, paddingLeft: 18, fontSize: "0.75rem" }} />
                  </div>
                </div>
                <button onClick={() => removeAsset(a.id)} style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 28, height: 28, borderRadius: 5, border: "none", marginTop: 2,
                  background: "rgba(239,68,68,0.1)", color: RED, cursor: "pointer",
                }}>
                  <Trash2 size={11} />
                </button>
              </div>
            ))}
          </div>

          {assets.length > 0 && (
            <div style={{ marginTop: "0.875rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border-c)",
              display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>Total</span>
              <span style={{ fontFamily: "monospace", fontWeight: 700, color: GREEN }}>{fc(totalAssets)}</span>
            </div>
          )}
        </Card>

        {/* Liabilities + Pie */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
              <SectionLabel>Liabilities</SectionLabel>
              <button onClick={addLiab} style={{
                display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 5,
                border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", color: RED,
                cursor: "pointer", fontSize: "0.6875rem", fontWeight: 700,
              }}>
                <Plus size={11} /> Add
              </button>
            </div>
            {liabilities.length === 0 && (
              <div style={{ fontSize: "0.6875rem", color: "var(--text-3)", textAlign: "center", padding: "0.75rem 0" }}>
                Mortgage, auto loans, student debt, etc.
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {liabilities.map(l => (
                <div key={l.id} style={{ display: "grid", gridTemplateColumns: "1fr 100px 28px", gap: 5, alignItems: "center" }}>
                  <input value={l.name} onChange={e => updateLiab(l.id, "name", e.target.value)}
                    placeholder="e.g. Mortgage" style={{ ...inputStyle, fontSize: "0.75rem" }} />
                  <input type="number" value={l.value} onChange={e => updateLiab(l.id, "value", e.target.value)}
                    placeholder="0" style={{ ...inputStyle, fontSize: "0.75rem" }} />
                  <button onClick={() => removeLiab(l.id)} style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 26, height: 26, borderRadius: 5, border: "none",
                    background: "rgba(239,68,68,0.1)", color: RED, cursor: "pointer",
                  }}>
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
            {liabilities.length > 0 && (
              <div style={{ marginTop: "0.75rem", paddingTop: "0.625rem", borderTop: "1px solid var(--border-c)",
                display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>Total</span>
                <span style={{ fontFamily: "monospace", fontWeight: 700, color: RED }}>{fc(totalLiab)}</span>
              </div>
            )}
          </Card>

          {/* Pie chart */}
          {pieData.length > 0 && (
            <Card style={{ padding: "1rem" }}>
              <SectionLabel>Asset Breakdown</SectionLabel>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={65} dataKey="value" paddingAngle={2}>
                    {pieData.map((_, i) => <Cell key={i} fill={ASSET_COLORS[i % ASSET_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v => fc(v)}
                    contentStyle={{ background: "var(--elevated)", border: "1px solid var(--border-c)", fontSize: "0.6875rem", color: "var(--text-1)" }}
                    itemStyle={{ color: "var(--text-1)" }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginTop: "0.25rem" }}>
                {pieData.map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: ASSET_COLORS[i % ASSET_COLORS.length] }} />
                    <span style={{ fontSize: "0.5625rem", color: "var(--text-3)" }}>{d.name}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Beneficiaries */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
          <div>
            <SectionLabel>Beneficiaries</SectionLabel>
            <div style={{ fontSize: "0.5625rem", color: "var(--text-3)", marginTop: -4 }}>
              Who inherits your estate — update this whenever life changes (marriage, divorce, new children)
            </div>
          </div>
          <button onClick={addBen} style={{
            display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 5,
            border: `1px solid ${BLUE}50`, background: `${BLUE}10`, color: BLUE,
            cursor: "pointer", fontSize: "0.6875rem", fontWeight: 700,
          }}>
            <Plus size={11} /> Add
          </button>
        </div>

        {beneficiaries.length === 0 && (
          <div style={{ textAlign: "center", padding: "1.25rem 0", color: "var(--text-3)", fontSize: "0.6875rem" }}>
            Add the people or organizations who should inherit your assets.
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: "0.75rem" }}>
          {beneficiaries.map(b => (
            <div key={b.id} style={{ background: "var(--bg)", borderRadius: 8, padding: "0.75rem",
              border: "1px solid var(--border-c)", position: "relative" }}>
              <button onClick={() => removeBen(b.id)} style={{
                position: "absolute", top: 8, right: 8, width: 22, height: 22, borderRadius: 4,
                border: "none", background: "rgba(239,68,68,0.1)", color: RED, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Trash2 size={10} />
              </button>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingRight: 24 }}>
                <input value={b.name} onChange={e => updateBen(b.id, "name", e.target.value)}
                  placeholder="Full name" style={{ ...inputStyle, fontSize: "0.75rem" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 80px", gap: 6 }}>
                  <select value={b.relationship} onChange={e => updateBen(b.id, "relationship", e.target.value)}
                    style={{ ...selectStyle, fontSize: "0.6875rem" }}>
                    {RELATIONSHIPS.map(r => <option key={r}>{r}</option>)}
                  </select>
                  <div style={{ position: "relative" }}>
                    <input type="number" value={b.pct} onChange={e => updateBen(b.id, "pct", e.target.value)}
                      placeholder="%" min="0" max="100"
                      style={{ ...inputStyle, fontSize: "0.75rem", paddingRight: 22 }} />
                    <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                      fontSize: "0.75rem", color: "var(--text-3)" }}>%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {beneficiaries.length > 0 && (
          <div style={{
            marginTop: "0.875rem", display: "flex", alignItems: "center", gap: "0.625rem",
            padding: "0.5rem 0.75rem", borderRadius: 6,
            background: Math.abs(totalBenPct - 100) < 0.5 ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)",
            border: `1px solid ${Math.abs(totalBenPct - 100) < 0.5 ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
          }}>
            {Math.abs(totalBenPct - 100) < 0.5
              ? <CheckCircle size={13} style={{ color: GREEN }} />
              : <AlertTriangle size={13} style={{ color: RED }} />
            }
            <span style={{ fontSize: "0.6875rem", color: "var(--text-2)" }}>
              Allocations total: <strong style={{ fontFamily: "monospace" }}>{totalBenPct.toFixed(0)}%</strong>
              {Math.abs(totalBenPct - 100) >= 0.5 && " — should equal 100%"}
            </span>
          </div>
        )}
      </Card>

      <div style={{ fontSize: "0.5625rem", color: "var(--text-3)", textAlign: "center", lineHeight: 1.6 }}>
        This is a personal reference tool only. Information stored locally on your device — not transmitted anywhere.
        Consult an estate attorney to create legally binding documents.
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   TAB 2 — ESTATE CHECKLIST
══════════════════════════════════════════════════════════════════ */
const CHECKLIST_ITEMS = [
  {
    key: "will",
    title: "Last Will & Testament",
    priority: "Critical",
    priorityColor: RED,
    why: "Without a will, a court decides who gets your assets (intestate succession). Your state's default may not match your wishes — especially for unmarried partners, stepchildren, or charities.",
    howToStart: "Use an estate attorney ($300–$1,500) or online services like Trust & Will or LegalZoom ($100–$200). Update after every major life event: marriage, divorce, new child, death of beneficiary.",
    whatItCovers: "Who gets your assets, who raises your minor children (guardian), who manages your estate (executor), and any specific bequests.",
  },
  {
    key: "poa",
    title: "Durable Power of Attorney",
    priority: "Critical",
    priorityColor: RED,
    why: "If you become incapacitated, someone needs legal authority to manage your finances — pay bills, manage investments, file taxes. Without a POA, family members may need expensive court proceedings to get this authority.",
    howToStart: "Designate a trusted person (agent) who will act on your behalf. Must be notarized. Your estate attorney can draft this alongside your will.",
    whatItCovers: "Financial decisions, banking, investments, real estate transactions, tax filings — all while you're alive but incapacitated.",
  },
  {
    key: "healthcare_poa",
    title: "Healthcare Power of Attorney",
    priority: "Critical",
    priorityColor: RED,
    why: "Separate from financial POA — this designates who makes medical decisions if you can't. Without it, doctors may default to whoever shows up first, or follow state law hierarchy that may not match your wishes.",
    howToStart: "Name a healthcare proxy you trust to honor your wishes under pressure. Have a real conversation with them about your wishes beforehand.",
    whatItCovers: "Medical treatment decisions, surgical consent, end-of-life care decisions when you're unable to communicate.",
  },
  {
    key: "living_will",
    title: "Living Will / Advance Directive",
    priority: "Important",
    priorityColor: ORANGE,
    why: "Tells doctors your wishes for end-of-life care — do you want CPR, ventilators, feeding tubes if there's no hope of recovery? Removes this devastating decision from your family.",
    howToStart: "Each state has its own form. Search '[your state] advance directive form' — most are free. Keep a copy with your doctor, hospital, and family.",
    whatItCovers: "Life-sustaining treatment preferences, pain management, organ donation wishes, DNR (Do Not Resuscitate) instructions.",
  },
  {
    key: "beneficiaries",
    title: "Beneficiary Designations Updated",
    priority: "Critical",
    priorityColor: RED,
    why: "Beneficiary designations on 401k, IRA, life insurance, and bank accounts (TOD/POD) override your will entirely. An ex-spouse listed as beneficiary in 1998 gets the money — not your current family — no matter what your will says.",
    howToStart: "Log into every financial account and verify the beneficiary listed. Do this annually. Especially critical after divorce, marriage, or death of a listed beneficiary.",
    whatItCovers: "Retirement accounts (401k, IRA), life insurance policies, bank accounts with TOD (Transfer on Death), brokerage accounts.",
  },
  {
    key: "life_insurance",
    title: "Life Insurance in Place",
    priority: "Important",
    priorityColor: ORANGE,
    why: "If people depend on your income (spouse, children, business partner), life insurance replaces that income when you're gone. A common rule: 10–12× your annual income in term life coverage.",
    howToStart: "Term life is the most cost-effective for most people — 20 or 30-year term. $500K policy for a healthy 30-year-old runs $20–30/month. Get quotes at Policygenius, Haven Life, or Ladder.",
    whatItCovers: "Income replacement for dependents, mortgage payoff, education funding, business buyout agreements.",
  },
  {
    key: "emergency_contacts",
    title: "Emergency Contact & Account Inventory",
    priority: "Important",
    priorityColor: ORANGE,
    why: "If something happens to you, your family needs to find your accounts, passwords, and contacts quickly. Most families spend months discovering all assets after a death — and some accounts are never found.",
    howToStart: "Create a secure document (encrypted, or printed and stored in a safe) listing: bank accounts, investment accounts, insurance policies, digital accounts, attorney contact, financial advisor contact.",
    whatItCovers: "All financial accounts, passwords or password manager location, insurance policies, recurring bills, digital assets, contact list.",
  },
  {
    key: "trust",
    title: "Revocable Living Trust (if applicable)",
    priority: "Consider",
    priorityColor: BLUE,
    why: "A trust avoids probate (the public, slow, expensive court process to validate a will). Recommended if you own real estate in multiple states, have a blended family, or want more control over how assets are distributed.",
    howToStart: "Requires an estate attorney — not a DIY task. Typically $1,500–$3,500. Must transfer assets into the trust (funding the trust) for it to work — an unfunded trust is useless.",
    whatItCovers: "Avoids probate, provides privacy (wills are public record), easier multi-state asset distribution, can include conditions for distribution (age requirements, etc.).",
  },
];

function ChecklistItem({ item, checked, onToggle }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: "var(--surface)", borderRadius: 10, overflow: "hidden",
      border: `1px solid ${checked ? "rgba(34,197,94,0.3)" : "var(--border-c)"}`,
      transition: "border-color 0.2s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.875rem 1rem" }}>
        {/* Checkbox */}
        <button onClick={() => onToggle(item.key)} style={{
          width: 22, height: 22, borderRadius: "50%", border: "none",
          background: checked ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)",
          cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {checked
            ? <CheckCircle size={20} style={{ color: GREEN }} />
            : <Circle size={20} style={{ color: "var(--text-3)" }} />
          }
        </button>

        {/* Title + priority */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.8125rem", fontWeight: 700,
              color: checked ? "var(--text-3)" : "var(--text-1)",
              textDecoration: checked ? "line-through" : "none" }}>
              {item.title}
            </span>
            <span style={{
              fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", padding: "2px 6px", borderRadius: 4,
              background: `${item.priorityColor}15`, color: item.priorityColor,
            }}>
              {item.priority}
            </span>
          </div>
          {!open && (
            <div style={{ fontSize: "0.5625rem", color: "var(--text-3)", marginTop: 2, lineHeight: 1.4 }}>
              {item.why.slice(0, 100)}…
            </div>
          )}
        </div>

        {/* Expand */}
        <button onClick={() => setOpen(o => !o)} style={{
          background: "none", border: "none", color: "var(--text-3)", cursor: "pointer",
          display: "flex", alignItems: "center", padding: 4,
        }}>
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {open && (
        <div style={{ padding: "0 1rem 1rem", borderTop: "1px solid var(--border-c)" }}>
          <div style={{ paddingTop: "0.875rem", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
            <div style={{ padding: "0.625rem 0.75rem", borderRadius: 7,
              background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <div style={{ fontSize: "0.5rem", fontWeight: 800, letterSpacing: "0.08em",
                textTransform: "uppercase", color: RED, marginBottom: 4 }}>Why It Matters</div>
              <div style={{ fontSize: "0.5625rem", color: "var(--text-2)", lineHeight: 1.6 }}>{item.why}</div>
            </div>
            <div style={{ padding: "0.625rem 0.75rem", borderRadius: 7,
              background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}>
              <div style={{ fontSize: "0.5rem", fontWeight: 800, letterSpacing: "0.08em",
                textTransform: "uppercase", color: GREEN, marginBottom: 4 }}>How to Get Started</div>
              <div style={{ fontSize: "0.5625rem", color: "var(--text-2)", lineHeight: 1.6 }}>{item.howToStart}</div>
            </div>
            <div style={{ padding: "0.625rem 0.75rem", borderRadius: 7,
              background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)" }}>
              <div style={{ fontSize: "0.5rem", fontWeight: 800, letterSpacing: "0.08em",
                textTransform: "uppercase", color: BLUE, marginBottom: 4 }}>What It Covers</div>
              <div style={{ fontSize: "0.5625rem", color: "var(--text-2)", lineHeight: 1.6 }}>{item.whatItCovers}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TabChecklist() {
  const [checked, setChecked] = useLS("fp_checklist_v2", {});
  const total = CHECKLIST_ITEMS.length;
  const done = CHECKLIST_ITEMS.filter(i => checked[i.key]).length;
  const pct = Math.round((done / total) * 100);

  const toggle = (key) => setChecked(p => ({ ...p, [key]: !p[key] }));

  const critical = CHECKLIST_ITEMS.filter(i => i.priority === "Critical");
  const important = CHECKLIST_ITEMS.filter(i => i.priority === "Important");
  const consider = CHECKLIST_ITEMS.filter(i => i.priority === "Consider");

  const GroupLabel = ({ label, color, count, doneCount }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "1rem 0 0.5rem" }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
      <span style={{ fontSize: "0.625rem", fontWeight: 800, letterSpacing: "0.1em",
        textTransform: "uppercase", color }}>{label}</span>
      <span style={{ fontSize: "0.5625rem", color: "var(--text-3)" }}>({doneCount}/{count} complete)</span>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>

      {/* Progress header */}
      <div style={{ background: "var(--surface)", borderRadius: 10, padding: "1.25rem",
        border: "1px solid var(--border-c)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <div>
            <div style={{ fontSize: "0.8125rem", fontWeight: 800, color: "var(--text-1)" }}>
              Estate Planning Progress
            </div>
            <div style={{ fontSize: "0.5625rem", color: "var(--text-3)", marginTop: 2 }}>
              Click each item to expand details, then check it off when complete
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "monospace",
              color: pct === 100 ? GREEN : pct >= 60 ? GOLD : RED, lineHeight: 1 }}>
              {pct}%
            </div>
            <div style={{ fontSize: "0.5625rem", color: "var(--text-3)" }}>{done} of {total} complete</div>
          </div>
        </div>
        <div style={{ height: 8, background: "var(--border-c)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 99, transition: "width 0.4s",
            width: `${pct}%`,
            background: pct === 100 ? GREEN : pct >= 60 ? GOLD : RED,
          }} />
        </div>
        {pct === 100 && (
          <div style={{ marginTop: "0.625rem", display: "flex", alignItems: "center", gap: "0.375rem",
            color: GREEN, fontSize: "0.6875rem", fontWeight: 700 }}>
            <CheckCircle size={13} /> Your estate plan is complete — review annually and after major life events.
          </div>
        )}
      </div>

      <GroupLabel label="Critical — Do These First" color={RED}
        count={critical.length} doneCount={critical.filter(i => checked[i.key]).length} />
      {critical.map(item => (
        <ChecklistItem key={item.key} item={item} checked={!!checked[item.key]} onToggle={toggle} />
      ))}

      <GroupLabel label="Important — Do These Next" color={ORANGE}
        count={important.length} doneCount={important.filter(i => checked[i.key]).length} />
      {important.map(item => (
        <ChecklistItem key={item.key} item={item} checked={!!checked[item.key]} onToggle={toggle} />
      ))}

      <GroupLabel label="Consider — Depending on Your Situation" color={BLUE}
        count={consider.length} doneCount={consider.filter(i => checked[i.key]).length} />
      {consider.map(item => (
        <ChecklistItem key={item.key} item={item} checked={!!checked[item.key]} onToggle={toggle} />
      ))}

      <div style={{ fontSize: "0.5625rem", color: "var(--text-3)", textAlign: "center",
        padding: "0.5rem", lineHeight: 1.6 }}>
        For educational reference only. Consult a licensed estate attorney for legally binding documents.
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   TAB 3 — LEARN
══════════════════════════════════════════════════════════════════ */
function Accordion({ title, icon, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "var(--surface)", borderRadius: 8,
      border: "1px solid var(--border-c)", overflow: "hidden" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", textAlign: "left", padding: "0.875rem 1rem",
        background: "none", border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", gap: "0.75rem",
      }}>
        <span style={{ fontSize: "1.125rem" }}>{icon}</span>
        <span style={{ flex: 1, fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-1)" }}>{title}</span>
        {open ? <ChevronUp size={13} style={{ color: "var(--text-3)" }} />
               : <ChevronDown size={13} style={{ color: "var(--text-3)" }} />}
      </button>
      {open && (
        <div style={{ padding: "0 1rem 1rem", borderTop: "1px solid var(--border-c)" }}>
          <div style={{ paddingTop: "0.875rem" }}>{children}</div>
        </div>
      )}
    </div>
  );
}

const P = ({ children }) => (
  <p style={{ fontSize: "0.75rem", color: "var(--text-2)", lineHeight: 1.75, margin: "0 0 0.75rem" }}>{children}</p>
);
const Bullet = ({ color = GOLD, children }) => (
  <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
    <div style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0, marginTop: 6 }} />
    <div style={{ fontSize: "0.6875rem", color: "var(--text-2)", lineHeight: 1.6 }}>{children}</div>
  </div>
);
const Callout = ({ color = GOLD, label, children }) => (
  <div style={{ padding: "0.625rem 0.875rem", borderRadius: 7, marginBottom: "0.75rem",
    background: `${color}08`, border: `1px solid ${color}25` }}>
    {label && <div style={{ fontSize: "0.5rem", fontWeight: 800, letterSpacing: "0.1em",
      textTransform: "uppercase", color, marginBottom: 4 }}>{label}</div>}
    <div style={{ fontSize: "0.6875rem", color: "var(--text-2)", lineHeight: 1.6 }}>{children}</div>
  </div>
);

function TabLearn() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
      <div style={{ fontSize: "0.5625rem", color: "var(--text-3)", padding: "0.375rem 0", letterSpacing: "0.05em" }}>
        Click any topic to expand. Educational content — not legal advice.
      </div>

      <Accordion title="What Is Estate Planning & Why Does It Matter?" icon="🏛️">
        <P>Estate planning is deciding in advance what happens to your money, property, and medical care when you die or become incapacitated. Without a plan, a court decides — and the outcome often surprises families.</P>
        <P>Estate planning is not just for the wealthy. Anyone with assets, dependents, or strong opinions about their medical care needs at least a basic plan.</P>
        <Callout color={RED} label="The cost of doing nothing">
          Dying without a will is called dying "intestate." Your state has a default distribution formula — typically spouse first, then children. If you're unmarried, your partner gets nothing. If you have no family, assets go to the state.
          Your family may spend 12–18 months and thousands of dollars in probate court resolving what a $500 estate plan could have settled instantly.
        </Callout>
        <Bullet color={GREEN}>Every adult over 18 should have at minimum: a will, a durable POA, and a healthcare directive.</Bullet>
        <Bullet color={GOLD}>People with children, real estate, or significant assets should also have beneficiary designations reviewed and a potential trust evaluated.</Bullet>
        <Bullet>Review your plan after every major life event: marriage, divorce, birth of a child, death of a beneficiary, major asset purchase, or moving to a new state.</Bullet>
      </Accordion>

      <Accordion title="The 5 Essential Documents" icon="📄">
        <P>Most people need five core documents to have a complete basic estate plan. Here's what each one does and why it exists.</P>
        {[
          { title: "1. Last Will & Testament", color: RED, desc: "Directs how your probate assets are distributed after death. Names an executor (who manages the process), a guardian for minor children, and beneficiaries for each asset. Does NOT cover assets with beneficiary designations (401k, IRA, life insurance) — those pass automatically to named beneficiaries regardless of your will." },
          { title: "2. Durable Power of Attorney (Financial)", color: ORANGE, desc: "Gives someone legal authority to manage your finances while you are alive but incapacitated. Without this, your family may need to petition a court for guardianship — which can take months and cost thousands in legal fees. 'Durable' means it stays in effect even if you become mentally incapacitated." },
          { title: "3. Healthcare Power of Attorney", color: ORANGE, desc: "Names a healthcare proxy — someone who makes medical decisions if you cannot. This is separate from financial POA. Choose someone who understands your values and can make hard decisions under pressure. Have an explicit conversation with them about your wishes." },
          { title: "4. Living Will / Advance Directive", color: GOLD, desc: "Documents your wishes for end-of-life medical treatment — ventilators, feeding tubes, CPR, artificial nutrition. This document speaks for you when you cannot. Without it, your family faces an impossible decision during the worst moment of their lives." },
          { title: "5. HIPAA Authorization", color: BLUE, desc: "Allows named individuals to access your medical records and communicate with your healthcare providers. Without HIPAA authorization, even a spouse may be denied information about your condition." },
        ].map(d => (
          <Callout key={d.title} color={d.color} label={d.title}>{d.desc}</Callout>
        ))}
      </Accordion>

      <Accordion title="How Beneficiary Designations Work (& Why They Override Your Will)" icon="⚡">
        <P>This is the most misunderstood concept in estate planning. Beneficiary designations on financial accounts pass assets <strong>directly to the named person — completely bypassing your will.</strong></P>
        <Callout color={RED} label="Real example">
          A man remarries but never updates his 401k beneficiary from his ex-wife. He dies. His current wife and children get nothing from his $400K retirement account — his ex-wife legally inherits it all. His will says "everything to my current wife" — doesn't matter. The beneficiary designation wins.
        </Callout>
        <P>Accounts controlled by beneficiary designations:</P>
        <Bullet color={RED}>401k, 403b, pension plans — update through your HR or plan administrator</Bullet>
        <Bullet color={RED}>IRA, Roth IRA — update through your brokerage (Fidelity, Vanguard, Schwab)</Bullet>
        <Bullet color={RED}>Life insurance policies — update through your insurer</Bullet>
        <Bullet color={ORANGE}>Bank accounts with TOD (Transfer on Death) designation</Bullet>
        <Bullet color={ORANGE}>Brokerage accounts with TOD/POD (Payable on Death) designation</Bullet>
        <Callout color={GREEN} label="Best practice">
          Review beneficiary designations every January as part of an annual financial review. Also review immediately after: marriage, divorce, birth of child, death of named beneficiary.
          Always name both a primary beneficiary AND a contingent beneficiary (backup if primary predeceases you).
        </Callout>
      </Accordion>

      <Accordion title="Trusts — What They Are & When You Need One" icon="🛡️">
        <P>A trust is a legal arrangement where one party (the trustee) holds and manages assets for the benefit of another (the beneficiary). Trusts are more flexible and powerful than wills, but more complex and expensive to set up.</P>
        <Callout color={GOLD} label="The most common: Revocable Living Trust">
          You create a trust, transfer assets into it, and you remain the trustee (in control) while alive. When you die, assets pass to beneficiaries instantly — no probate court, no public record, no delay.
          Cost: $1,500–$3,500 with an attorney. The key requirement: you must actually transfer assets into the trust (called "funding the trust") or it accomplishes nothing.
        </Callout>
        <P>When a trust makes sense:</P>
        <Bullet color={GREEN}>You own real estate in more than one state (avoids multi-state probate)</Bullet>
        <Bullet color={GREEN}>You have a blended family and want to control exactly who gets what</Bullet>
        <Bullet color={GREEN}>You want to set conditions on inheritance (e.g., child receives at age 30, not 18)</Bullet>
        <Bullet color={GREEN}>You have significant assets and value privacy (wills are public record, trusts are not)</Bullet>
        <Bullet color={ORANGE}>You have a beneficiary with special needs who receives government benefits</Bullet>
        <P>When a trust is probably overkill:</P>
        <Bullet color="var(--text-3)">Your assets are simple — one home, retirement accounts with named beneficiaries, a brokerage with TOD</Bullet>
        <Bullet color="var(--text-3)">Your state has a simple probate process (some states: TX, FL, CA for small estates)</Bullet>
        <Bullet color="var(--text-3)">You can't afford to fund it — an unfunded trust is useless</Bullet>
      </Accordion>

      <Accordion title="Probate — What It Is & How to Avoid It" icon="⚖️">
        <P>Probate is the court-supervised process of validating your will and distributing your estate. It is public, slow, and expensive — typically 6–18 months and 2–5% of estate value in legal fees.</P>
        <Callout color={RED} label="What goes through probate">
          Assets in your name alone with no beneficiary designation and not held in a trust. This includes: solely-owned real estate, bank accounts without TOD, cars, personal property, and business interests — unless transferred to a trust.
        </Callout>
        <P>How to avoid probate:</P>
        <Bullet color={GREEN}>Beneficiary designations — 401k, IRA, life insurance pass directly</Bullet>
        <Bullet color={GREEN}>Joint ownership with right of survivorship — surviving owner inherits automatically</Bullet>
        <Bullet color={GREEN}>TOD/POD designations on bank and brokerage accounts</Bullet>
        <Bullet color={GREEN}>Revocable living trust — assets in trust skip probate entirely</Bullet>
        <Callout color={BLUE} label="Small estate shortcuts">
          Most states have simplified probate procedures for small estates (typically under $100K–$200K). If your estate is modest and straightforward, full probate may be simple. Check your state's rules.
        </Callout>
      </Accordion>

      <Accordion title="Estate Taxes — Do You Need to Worry?" icon="💰">
        <P>In 2024, the federal estate tax exemption is $13.61 million per person ($27.22 million for married couples). Only estates above this threshold owe federal estate tax at 40%.</P>
        <Callout color={GREEN} label="The reality for most people">
          Less than 0.2% of estates owe federal estate tax. If your net worth is under $10 million, federal estate tax is not your primary concern.
          Focus instead on income tax planning — IRAs, 401ks, and brokerage accounts all have different tax treatments for heirs.
        </Callout>
        <P>What you should focus on:</P>
        <Bullet color={GOLD}>Income tax on inherited IRAs — heirs must empty inherited IRAs within 10 years (SECURE 2.0). All withdrawals are taxed as ordinary income. Large IRAs can create big tax bills for heirs.</Bullet>
        <Bullet color={GOLD}>Step-up in basis — appreciated assets (stocks, real estate) in a taxable brokerage get a new cost basis at your death. Your heirs pay zero capital gains tax on pre-death appreciation. This is one of the most powerful estate planning tools available.</Bullet>
        <Bullet color={ORANGE}>State estate taxes — 12 states + DC have their own estate taxes with lower exemptions ($1M–$7M). If you live in MA, OR, WA, MN, or similar states, this may be relevant to you.</Bullet>
        <Callout color={BLUE} label="2025 sunset">
          The current $13.61M federal exemption is scheduled to be cut roughly in half in 2026 when the Tax Cuts and Jobs Act expires (unless Congress extends it). Estates between $6M–$13M should consult an estate attorney before 2026.
        </Callout>
      </Accordion>

      <Accordion title="When to Hire an Estate Attorney" icon="👨‍⚖️">
        <P>Online services like Trust & Will, LegalZoom, or Willing can handle simple situations for $100–$400. An estate attorney costs $1,500–$5,000+ for a full plan but is worth it when the situation is complex.</P>
        <P>Use an online service if:</P>
        <Bullet color={GREEN}>Single or married with straightforward assets</Bullet>
        <Bullet color={GREEN}>No minor children from multiple relationships</Bullet>
        <Bullet color={GREEN}>Net worth under $1 million, no real estate in multiple states</Bullet>
        <Bullet color={GREEN}>You just need a basic will, POA, and healthcare directive</Bullet>
        <P>Hire an estate attorney if:</P>
        <Bullet color={RED}>You have children from a previous marriage</Bullet>
        <Bullet color={RED}>You own real estate in multiple states</Bullet>
        <Bullet color={RED}>Net worth exceeds $5 million (state estate tax planning)</Bullet>
        <Bullet color={RED}>You own a business</Bullet>
        <Bullet color={RED}>You have a beneficiary with special needs or addiction issues</Bullet>
        <Bullet color={RED}>You want a trust (must be properly drafted and funded)</Bullet>
        <Callout color={GOLD} label="How to find one">
          The American College of Trust and Estate Counsel (ACTEC.org) has a directory of certified estate attorneys.
          Your state bar association also maintains a referral service. Ask your financial advisor for a referral — they work with estate attorneys regularly.
        </Callout>
      </Accordion>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════ */
export default function FuturePlanning() {
  const [activeTab, setActiveTab] = useState("snapshot");

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border-c)",
        borderRadius: 16,
        padding: "1.75rem 2rem",
        marginBottom: "1.25rem",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -60, right: -40,
          width: 320, height: 320,
          background: "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", position: "relative" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.625rem" }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <LineChart size={14} style={{ color: "var(--gold)" }} />
              </div>
              <h1 className="t-page-title" style={{ margin: 0 }}>FUTURE PLANNING</h1>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.65, maxWidth: 560, margin: "0 0 1rem" }}>
              Map out your financial future with precision. Project your net worth, retirement readiness, and progress toward major life goals with interactive timelines.
            </p>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              {["Net Worth Tracker", "Retirement Projections", "Life Goals", "Wealth Milestones"].map((label) => (
                <span key={label} style={{
                  fontSize: "0.6875rem", fontWeight: 700, padding: "3px 10px",
                  borderRadius: 99, letterSpacing: "0.04em",
                  background: "rgba(201,168,76,0.10)",
                  border: "1px solid rgba(201,168,76,0.25)",
                  color: "var(--gold)",
                }}>{label}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", flexShrink: 0 }}>
            {[
              { icon: LineChart, label: "Retirement Timeline", sub: "Age-based projection model", color: "#3b82f6" },
              { icon: TrendingUp, label: "Net Worth Projections", sub: "Assets minus liabilities", color: "var(--gold)" },
              { icon: Target, label: "Goal Planning", sub: "House, college, travel", color: "var(--teal)" },
              { icon: BarChart2, label: "Wealth Milestones", sub: "Track key financial markers", color: "#f59e0b" },
            ].map(({ icon: Icon, label, sub, color }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: "0.625rem",
                padding: "0.625rem 0.875rem",
                background: "var(--bg)", border: "1px solid var(--border-c)",
                borderRadius: 10, minWidth: 170,
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  background: `color-mix(in srgb, ${color} 14%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={14} style={{ color }} />
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-1)", lineHeight: 1 }}>{label}</div>
                  <div style={{ fontSize: "0.625rem", color: "var(--text-3)", marginTop: 2, lineHeight: 1.3 }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 2, marginBottom: "1.25rem",
        background: "var(--surface)", borderRadius: 8, padding: 4,
        border: "1px solid var(--border-c)" }}>
        {TABS.map(tab => {
          const active = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              display: "flex", alignItems: "center", gap: "0.375rem",
              padding: "0.5rem 1rem", borderRadius: 6, border: "none", cursor: "pointer",
              fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.02em",
              whiteSpace: "nowrap", transition: "all 0.15s",
              background: active ? "rgba(201,168,76,0.12)" : "transparent",
              color: active ? GOLD : "var(--text-3)",
              borderBottom: active ? `2px solid ${GOLD}` : "2px solid transparent",
            }}>
              <Icon size={13} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "snapshot" && <TabSnapshot />}
      {activeTab === "checklist" && <TabChecklist />}
      {activeTab === "learn" && <TabLearn />}
    </div>
  );
}
