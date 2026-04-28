import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  AreaChart, Area, LineChart, Line, ResponsiveContainer, Legend,
} from "recharts";
import {
  LayoutDashboard, DollarSign, CreditCard, Landmark, Target, FileText,
  Lightbulb, TrendingUp, Plus, Trash2, Edit3, Check, X, ChevronDown,
  ChevronUp, Download, AlertTriangle, CheckCircle, Info, Zap, ArrowUpRight,
  ArrowDownRight, Calendar, RefreshCw, Flag, Wallet,
} from "lucide-react";
import confetti from "canvas-confetti";

/* ─── localStorage hook ─────────────────────────────────────────── */
function useLocalStorage(key, defaultVal) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : defaultVal;
    } catch {
      return defaultVal;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
}

/* ─── Color palette ─────────────────────────────────────────────── */
const GOLD = "#c9a84c";
const BLUE = "#4c9fcf";
const GREEN = "#4caf7d";
const RED = "#e05c5c";
const TEAL = "#4dd0c4";
const PURPLE = "#9b6cdb";
const ORANGE = "#e07c3a";
const PIE_COLORS = [GOLD, BLUE, GREEN, TEAL, PURPLE, ORANGE, RED, "#a3b8cc", "#f7b731", "#45aaf2"];

/* ─── Keyword → color map ───────────────────────────────────────── */
const CATEGORY_COLORS = [
  { keywords: ["rent","mortgage","housing","home","hoa","property"],  color: GOLD    },
  { keywords: ["food","grocery","groceries","dining","restaurant","coffee","eat"], color: "#4caf7d" },
  { keywords: ["car","auto","vehicle","gas","fuel","parking","transport","uber","lyft","commute"], color: "#e07c3a" },
  { keywords: ["phone","mobile","cell","telecom","internet","cable","wifi"], color: "#4dd0c4"  },
  { keywords: ["health","medical","doctor","dental","vision","prescription","pharmacy","insurance","life"], color: "#9b6cdb" },
  { keywords: ["entertain","fun","movie","netflix","hulu","spotify","game","hobby","subscription","streaming"], color: "#4c9fcf" },
  { keywords: ["saving","invest","401k","ira","emergency","brokerage","retire","hsa","fund"], color: "#22c55e" },
  { keywords: ["debt","loan","credit","card","payment","collections","borrow"], color: "#e05c5c" },
  { keywords: ["utility","electric","water","sewer","heat","trash","bill"], color: "#f7b731" },
  { keywords: ["child","kid","baby","daycare","school","education","tuition"], color: "#45aaf2" },
  { keywords: ["pet","dog","cat","vet","animal"], color: "#a855f7" },
  { keywords: ["travel","vacation","trip","hotel","flight","airbnb"], color: "#ec4899" },
  { keywords: ["cloth","shop","fashion","apparel","wear"], color: "#fb923c" },
  { keywords: ["gift","charity","donat","church","tithe"], color: "#06b6d4"  },
];

function colorForCategory(name, existingCount) {
  const lower = name.toLowerCase();
  for (const { keywords, color } of CATEGORY_COLORS) {
    if (keywords.some(k => lower.includes(k))) return color;
  }
  return PIE_COLORS[existingCount % PIE_COLORS.length];
}

/* ─── Default categories ────────────────────────────────────────── */
const DEFAULT_CATEGORIES = [
  { id: "c1", name: "Housing", budget: 1500, color: GOLD },
  { id: "c2", name: "Food & Dining", budget: 600, color: BLUE },
  { id: "c3", name: "Transportation", budget: 400, color: GREEN },
  { id: "c4", name: "Utilities", budget: 200, color: TEAL },
  { id: "c5", name: "Healthcare", budget: 150, color: PURPLE },
  { id: "c6", name: "Entertainment", budget: 200, color: ORANGE },
  { id: "c7", name: "Savings", budget: 500, color: RED },
  { id: "c8", name: "Other", budget: 300, color: "#a3b8cc" },
];

/* ─── Shared utility components ─────────────────────────────────── */
function MetricCard({ label, value, sub, color = GOLD, icon: Icon, trend }) {
  return (
    <div className="t-card" style={{ padding: "1rem 1.25rem" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.35rem" }}>{label}</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 900, color, fontFamily: "var(--font-mono)", letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ fontSize: "0.7rem", color: "var(--text-3)", marginTop: "0.35rem" }}>{sub}</div>}
          {trend !== undefined && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.35rem" }}>
              {trend >= 0 ? <ArrowUpRight size={12} color={GREEN} /> : <ArrowDownRight size={12} color={RED} />}
              <span style={{ fontSize: "0.7rem", color: trend >= 0 ? GREEN : RED, fontWeight: 700 }}>{Math.abs(trend).toFixed(1)}%</span>
            </div>
          )}
        </div>
        {Icon && <Icon size={20} color={color} style={{ opacity: 0.6, flexShrink: 0 }} />}
      </div>
    </div>
  );
}

function ProgressBar({ pct, color = GOLD, height = 6, showLabel = false }) {
  const clamped = Math.min(100, Math.max(0, pct));
  const barColor = pct > 100 ? RED : color;
  return (
    <div style={{ width: "100%" }}>
      <div style={{ height, background: "var(--border-c)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${Math.min(clamped, 100)}%`, background: barColor, borderRadius: 99, transition: "width 0.4s ease" }} />
      </div>
      {showLabel && <div style={{ fontSize: "0.65rem", color: "var(--text-3)", marginTop: "0.2rem", textAlign: "right" }}>{pct.toFixed(0)}%</div>}
    </div>
  );
}

function CircularProgress({ pct, size = 80, stroke = 8, color = GOLD, label, sub }) {
  const clamped = Math.min(100, Math.max(0, pct));
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (clamped / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border-c)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.5s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {label && <div style={{ fontSize: size < 70 ? "0.65rem" : "0.875rem", fontWeight: 900, color: "var(--text-1)", fontFamily: "var(--font-mono)" }}>{label}</div>}
        {sub && <div style={{ fontSize: "0.55rem", color: "var(--text-3)", textAlign: "center", lineHeight: 1.2 }}>{sub}</div>}
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon = Info, message, action, onAction }) {
  return (
    <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--text-3)" }}>
      <Icon size={32} style={{ opacity: 0.4, marginBottom: "0.75rem" }} />
      <div style={{ fontSize: "0.85rem", marginBottom: action ? "0.75rem" : 0 }}>{message}</div>
      {action && <button className="t-btn" onClick={onAction} style={{ fontSize: "0.75rem" }}>{action}</button>}
    </div>
  );
}

function CustomTooltip({ active, payload, label, prefix = "$" }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--elevated)", border: "1px solid var(--border-c)", borderRadius: 6, padding: "0.6rem 0.9rem", fontSize: "0.75rem" }}>
      {label && <div style={{ color: "var(--text-3)", marginBottom: "0.35rem" }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || "var(--text-1)", fontWeight: 700 }}>
          {p.name}: {prefix}{Number(p.value).toLocaleString()}
        </div>
      ))}
    </div>
  );
}

const fc = (n) => "$" + (Math.abs(n) >= 1e6 ? (n / 1e6).toFixed(2) + "M" : Math.abs(n) >= 1e3 ? (n / 1e3).toFixed(1) + "K" : Number(n).toFixed(0));
const pct = (a, b) => b === 0 ? 0 : Math.round((a / b) * 100);

/* ─── Inline editable field ─────────────────────────────────────── */
function InlineEdit({ value, onSave, type = "number", prefix = "" }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef(null);
  useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);
  const save = () => { onSave(draft); setEditing(false); };
  if (editing) return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {prefix && <span style={{ color: "var(--text-3)", fontSize: "0.8rem" }}>{prefix}</span>}
      <input ref={ref} type={type} value={draft} onChange={e => setDraft(type === "number" ? Number(e.target.value) : e.target.value)}
        onBlur={save} onKeyDown={e => e.key === "Enter" ? save() : e.key === "Escape" && setEditing(false)}
        style={{ width: 100, background: "var(--surface)", border: "1px solid var(--gold)", borderRadius: 4, color: "var(--text-1)", padding: "2px 6px", fontSize: "0.8rem" }} />
    </div>
  );
  return (
    <button onClick={() => { setDraft(value); setEditing(true); }} style={{ background: "none", border: "none", color: "var(--text-1)", cursor: "pointer", fontSize: "0.8rem", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>
      {prefix}{type === "number" ? Number(value).toLocaleString() : value}
      <Edit3 size={10} color="var(--text-3)" />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TABS
═══════════════════════════════════════════════════════════════════ */

/* ─── Dashboard Tab ─────────────────────────────────────────────── */
function TabDashboard({ income, extraIncome, categories, transactions, accounts, goals, bills, nwHistory }) {
  const totalIncome = income + extraIncome.reduce((s, e) => s + e.amount, 0);
  const totalBudget = categories.reduce((s, c) => s + c.budget, 0);
  const unallocated = totalIncome - totalBudget;
  const totalSpent = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const totalAssets = accounts.filter(a => a.type !== "debt").reduce((s, a) => s + a.balance, 0);
  const totalDebt = accounts.filter(a => a.type === "debt").reduce((s, a) => s + a.balance, 0);
  const netWorth = totalAssets - totalDebt;
  const savingsRate = totalIncome > 0 ? pct(unallocated + categories.find(c => c.name === "Savings")?.budget || 0, totalIncome) : 0;
  const dueThisMonth = bills.filter(b => !b.paid).reduce((s, b) => s + b.amount, 0);

  const spendByCategory = categories.map(c => ({
    name: c.name,
    budget: c.budget,
    spent: transactions.filter(t => t.categoryId === c.id && t.type === "expense").reduce((s, t) => s + t.amount, 0),
    color: c.color,
  })).filter(c => c.budget > 0 || c.spent > 0);

  const last6months = useMemo(() => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleString("default", { month: "short" });
      const spent = transactions.filter(t => t.date?.startsWith(key) && t.type === "expense").reduce((s, t) => s + t.amount, 0);
      const inc = transactions.filter(t => t.date?.startsWith(key) && t.type === "income").reduce((s, t) => s + t.amount, 0);
      months.push({ label, spent, income: inc || totalIncome });
    }
    return months;
  }, [transactions, totalIncome]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "0.75rem" }}>
        <MetricCard label="Monthly Income" value={fc(totalIncome)} sub="All sources" color={GREEN} icon={DollarSign} />
        <MetricCard label="Total Budgeted" value={fc(totalBudget)} sub={unallocated >= 0 ? `${fc(unallocated)} unallocated` : `${fc(-unallocated)} over budget`} color={unallocated >= 0 ? GOLD : RED} icon={FileText} />
        <MetricCard label="Net Worth" value={fc(netWorth)} sub={`${fc(totalAssets)} assets · ${fc(totalDebt)} debt`} color={netWorth >= 0 ? TEAL : RED} icon={Landmark} />
        <MetricCard label="Bills Due" value={fc(dueThisMonth)} sub={`${bills.filter(b => !b.paid).length} unpaid`} color={ORANGE} icon={Calendar} />
        <MetricCard label="Savings Rate" value={`${savingsRate}%`} sub="of gross income" color={savingsRate >= 20 ? GREEN : savingsRate >= 10 ? GOLD : RED} icon={TrendingUp} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {/* Spending vs Budget bar */}
        <div className="t-card" style={{ padding: "1.25rem" }}>
          <div className="t-section-title" style={{ marginBottom: "1rem" }}>Budget vs Spending</div>
          {spendByCategory.length === 0 ? <EmptyState message="No categories yet" /> : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {spendByCategory.slice(0, 6).map(c => (
                <div key={c.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "0.2rem" }}>
                    <span style={{ color: "var(--text-2)" }}>{c.name}</span>
                    <span style={{ color: c.spent > c.budget ? RED : "var(--text-3)" }}>{fc(c.spent)} / {fc(c.budget)}</span>
                  </div>
                  <ProgressBar pct={pct(c.spent, c.budget)} color={c.color} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cashflow area chart */}
        <div className="t-card" style={{ padding: "1.25rem" }}>
          <div className="t-section-title" style={{ marginBottom: "1rem" }}>6-Month Cash Flow</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={last6months}>
              <defs>
                <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={GREEN} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={RED} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={RED} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "var(--text-3)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--text-3)" }} axisLine={false} tickLine={false} tickFormatter={v => "$" + (v / 1000).toFixed(0) + "K"} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" name="Income" stroke={GREEN} fill="url(#incGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="spent" name="Spent" stroke={RED} fill="url(#expGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Goals preview */}
      {goals.length > 0 && (
        <div className="t-card" style={{ padding: "1.25rem" }}>
          <div className="t-section-title" style={{ marginBottom: "1rem" }}>Goal Tracker</div>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {goals.slice(0, 4).map(g => {
              const p = pct(g.saved, g.target);
              return (
                <div key={g.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", minWidth: 80 }}>
                  <CircularProgress pct={p} size={68} color={p >= 100 ? GREEN : GOLD} label={`${p}%`} sub={g.name} />
                  <div style={{ fontSize: "0.65rem", color: "var(--text-3)", textAlign: "center" }}>{fc(g.saved)} / {fc(g.target)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Budget Tab ─────────────────────────────────────────────────── */
function TabBudget({ income, setIncome, extraIncome, setExtraIncome, categories, setCategories }) {
  const [addingExtra, setAddingExtra] = useState(false);
  const [newExtra, setNewExtra] = useState({ name: "", amount: 0 });
  const [addingCat, setAddingCat] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", budget: 0, color: BLUE });
  const [editCatId, setEditCatId] = useState(null);

  const totalIncome = income + extraIncome.reduce((s, e) => s + e.amount, 0);
  const totalBudget = categories.reduce((s, c) => s + c.budget, 0);
  const unallocated = totalIncome - totalBudget;

  const catPieData = categories.filter(c => c.budget > 0).map(c => ({ name: c.name, value: c.budget, color: c.color }));

  const addCategory = () => {
    if (!newCat.name || newCat.budget <= 0) return;
    const color = colorForCategory(newCat.name, categories.length);
    setCategories(prev => [...prev, { ...newCat, color, id: `c${Date.now()}` }]);
    setNewCat({ name: "", budget: 0, color: BLUE });
    setAddingCat(false);
  };

  const removeCategory = (id) => setCategories(prev => prev.filter(c => c.id !== id));
  const updateCatBudget = (id, budget) => setCategories(prev => prev.map(c => c.id === id ? { ...c, budget: Number(budget) } : c));
  const updateCatName = (id, name) => setCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c));

  const removeExtra = (id) => setExtraIncome(prev => prev.filter(e => e.id !== id));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Income block */}
      <div className="t-card" style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div className="t-section-title">Income Sources</div>
          <button className="t-btn" onClick={() => setAddingExtra(true)} style={{ fontSize: "0.7rem", display: "flex", alignItems: "center", gap: 4 }}>
            <Plus size={12} /> Add Source
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0.75rem", background: "var(--elevated)", borderRadius: 6 }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-2)" }}>Primary Income (monthly)</span>
            <InlineEdit value={income} onSave={v => setIncome(Number(v))} type="number" prefix="$" />
          </div>
          {extraIncome.map(e => (
            <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0.75rem", background: "var(--elevated)", borderRadius: 6 }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-2)" }}>{e.name}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <InlineEdit value={e.amount} onSave={v => setExtraIncome(prev => prev.map(x => x.id === e.id ? { ...x, amount: Number(v) } : x))} type="number" prefix="$" />
                <button onClick={() => removeExtra(e.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", display: "flex", alignItems: "center" }}><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
          {addingExtra && (
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input placeholder="Source name" value={newExtra.name} onChange={e => setNewExtra(p => ({ ...p, name: e.target.value }))} className="t-input" style={{ flex: 1, fontSize: "0.8rem" }} />
              <input type="number" placeholder="Amount" value={newExtra.amount || ""} onChange={e => setNewExtra(p => ({ ...p, amount: Number(e.target.value) }))} className="t-input" style={{ width: 100, fontSize: "0.8rem" }} />
              <button className="t-btn" onClick={() => { if (newExtra.name && newExtra.amount > 0) { setExtraIncome(prev => [...prev, { ...newExtra, id: `e${Date.now()}` }]); setNewExtra({ name: "", amount: 0 }); setAddingExtra(false); } }} style={{ fontSize: "0.7rem" }}><Check size={12} /></button>
              <button onClick={() => setAddingExtra(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)" }}><X size={14} /></button>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0.75rem", borderTop: "1px solid var(--border-c)", marginTop: "0.25rem" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-1)" }}>Total Monthly Income</span>
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 900, color: GREEN }}>{fc(totalIncome)}</span>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "1rem" }}>
        {/* Category list */}
        <div className="t-card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <div className="t-section-title">Budget Categories</div>
            <button className="t-btn" onClick={() => setAddingCat(true)} style={{ fontSize: "0.7rem", display: "flex", alignItems: "center", gap: 4 }}><Plus size={12} /> Add</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {categories.map(c => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.5rem 0.6rem", background: "var(--elevated)", borderRadius: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                <InlineEdit value={c.name} onSave={v => updateCatName(c.id, v)} type="text" />
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <InlineEdit value={c.budget} onSave={v => updateCatBudget(c.id, v)} type="number" prefix="$" />
                  <button onClick={() => removeCategory(c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", display: "flex" }}><Trash2 size={11} /></button>
                </div>
              </div>
            ))}
            {addingCat && (
              <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: colorForCategory(newCat.name, categories.length), flexShrink: 0, transition: "background 0.2s" }} />
                <input placeholder="Category name" value={newCat.name} onChange={e => setNewCat(p => ({ ...p, name: e.target.value }))} className="t-input" style={{ flex: 1, fontSize: "0.75rem" }} />
                <input type="number" placeholder="Budget" value={newCat.budget || ""} onChange={e => setNewCat(p => ({ ...p, budget: Number(e.target.value) }))} className="t-input" style={{ width: 85, fontSize: "0.75rem" }} />
                <button className="t-btn" onClick={addCategory} style={{ fontSize: "0.7rem" }}><Check size={12} /></button>
                <button onClick={() => setAddingCat(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)" }}><X size={14} /></button>
              </div>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.75rem", padding: "0.5rem 0", borderTop: "1px solid var(--border-c)" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>Unallocated</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 900, color: unallocated >= 0 ? GREEN : RED }}>{fc(unallocated)}</span>
          </div>
        </div>

        {/* Pie chart */}
        <div className="t-card" style={{ padding: "1.25rem" }}>
          <div className="t-section-title" style={{ marginBottom: "0.75rem" }}>Allocation</div>
          {catPieData.length === 0 ? <EmptyState message="Add categories to see allocation" /> : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={catPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={2}>
                    {catPieData.map((d, i) => <Cell key={i} fill={d.color || PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v => fc(v)} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem 0.75rem", marginTop: "0.25rem" }}>
                {catPieData.map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.65rem", color: "var(--text-3)" }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: d.color }} />
                    {d.name}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Transactions Tab ───────────────────────────────────────────── */
function TabTransactions({ transactions, setTransactions, categories }) {
  const [form, setForm] = useState({ description: "", amount: "", type: "expense", categoryId: categories[0]?.id || "", date: new Date().toISOString().slice(0, 10), note: "" });
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);

  const filtered = transactions.filter(t => {
    if (filter !== "all" && t.type !== filter) return false;
    if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date));

  const add = () => {
    if (!form.description || !form.amount) return;
    setTransactions(prev => [{ ...form, id: `t${Date.now()}`, amount: Number(form.amount) }, ...prev]);
    setForm(p => ({ ...p, description: "", amount: "", note: "" }));
    setAdding(false);
  };

  const remove = (id) => setTransactions(prev => prev.filter(t => t.id !== id));

  const totalIn = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  const exportCSV = () => {
    const rows = [["Date", "Description", "Amount", "Type", "Category", "Note"], ...transactions.map(t => [t.date, t.description, t.amount, t.type, categories.find(c => c.id === t.categoryId)?.name || "", t.note || ""])];
    const csv = rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "transactions.csv"; a.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          {["all", "expense", "income"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "0.35rem 0.75rem", borderRadius: 4, border: "none", cursor: "pointer", fontSize: "0.75rem", fontWeight: 700, background: filter === f ? GOLD : "var(--elevated)", color: filter === f ? "#07080a" : "var(--text-2)" }}>
              {f === "all" ? "All" : f === "expense" ? "Expenses" : "Income"}
            </button>
          ))}
        </div>
        <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="t-input" style={{ flex: 1, minWidth: 140, fontSize: "0.8rem" }} />
        <button className="t-btn" onClick={() => setAdding(v => !v)} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem" }}><Plus size={12} /> Add</button>
        <button onClick={exportCSV} style={{ background: "var(--elevated)", border: "1px solid var(--border-c)", borderRadius: 4, cursor: "pointer", color: "var(--text-2)", display: "flex", alignItems: "center", gap: 4, padding: "0.35rem 0.65rem", fontSize: "0.75rem" }}><Download size={12} /> CSV</button>
      </div>

      {adding && (
        <div className="t-card" style={{ padding: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: "0.5rem", alignItems: "end" }}>
            <div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-3)", marginBottom: 3 }}>Description</div>
              <input className="t-input" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="e.g. Groceries" style={{ width: "100%", fontSize: "0.8rem" }} />
            </div>
            <div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-3)", marginBottom: 3 }}>Amount</div>
              <input type="number" className="t-input" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="0.00" style={{ width: "100%", fontSize: "0.8rem" }} />
            </div>
            <div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-3)", marginBottom: 3 }}>Type</div>
              <select className="t-input" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={{ width: "100%", fontSize: "0.8rem" }}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-3)", marginBottom: 3 }}>Category</div>
              <select className="t-input" value={form.categoryId} onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))} style={{ width: "100%", fontSize: "0.8rem" }}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-3)", marginBottom: 3 }}>Date</div>
              <input type="date" className="t-input" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} style={{ width: "100%", fontSize: "0.8rem" }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
            <button className="t-btn" onClick={add} style={{ fontSize: "0.75rem" }}>Save Transaction</button>
            <button onClick={() => setAdding(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", fontSize: "0.75rem" }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "0.75rem" }}>
        <div style={{ flex: 1, padding: "0.6rem 0.9rem", background: "var(--elevated)", borderRadius: 6, textAlign: "center" }}>
          <div style={{ fontSize: "0.65rem", color: "var(--text-3)" }}>Total In</div>
          <div style={{ fontFamily: "var(--font-mono)", color: GREEN, fontWeight: 900 }}>{fc(totalIn)}</div>
        </div>
        <div style={{ flex: 1, padding: "0.6rem 0.9rem", background: "var(--elevated)", borderRadius: 6, textAlign: "center" }}>
          <div style={{ fontSize: "0.65rem", color: "var(--text-3)" }}>Total Out</div>
          <div style={{ fontFamily: "var(--font-mono)", color: RED, fontWeight: 900 }}>{fc(totalOut)}</div>
        </div>
        <div style={{ flex: 1, padding: "0.6rem 0.9rem", background: "var(--elevated)", borderRadius: 6, textAlign: "center" }}>
          <div style={{ fontSize: "0.65rem", color: "var(--text-3)" }}>Net</div>
          <div style={{ fontFamily: "var(--font-mono)", color: totalIn - totalOut >= 0 ? GREEN : RED, fontWeight: 900 }}>{fc(totalIn - totalOut)}</div>
        </div>
        <div style={{ flex: 1, padding: "0.6rem 0.9rem", background: "var(--elevated)", borderRadius: 6, textAlign: "center" }}>
          <div style={{ fontSize: "0.65rem", color: "var(--text-3)" }}>Transactions</div>
          <div style={{ fontFamily: "var(--font-mono)", color: "var(--text-1)", fontWeight: 900 }}>{transactions.length}</div>
        </div>
      </div>

      <div className="t-card" style={{ overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <EmptyState message="No transactions found" action="Add Transaction" onAction={() => setAdding(true)} />
        ) : (
          <table className="t-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Date</th><th>Description</th><th>Category</th><th>Type</th><th style={{ textAlign: "right" }}>Amount</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => {
                const cat = categories.find(c => c.id === t.categoryId);
                return (
                  <tr key={t.id}>
                    <td style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>{t.date}</td>
                    <td style={{ fontSize: "0.8rem", color: "var(--text-1)" }}>{t.description}</td>
                    <td>
                      {cat && <span style={{ fontSize: "0.65rem", padding: "2px 7px", borderRadius: 99, background: cat.color + "22", color: cat.color, fontWeight: 700 }}>{cat.name}</span>}
                    </td>
                    <td><span style={{ fontSize: "0.65rem", color: t.type === "income" ? GREEN : RED, fontWeight: 700 }}>{t.type}</span></td>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: t.type === "income" ? GREEN : "var(--text-1)" }}>
                      {t.type === "income" ? "+" : "-"}{fc(t.amount)}
                    </td>
                    <td><button onClick={() => remove(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)" }}><Trash2 size={12} /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ─── Accounts Tab ───────────────────────────────────────────────── */
function TabAccounts({ accounts, setAccounts, nwHistory, setNwHistory }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", balance: "", type: "checking", institution: "" });

  const ACCOUNT_TYPES = ["checking", "savings", "investment", "retirement", "crypto", "debt", "other"];

  const totalAssets = accounts.filter(a => a.type !== "debt").reduce((s, a) => s + a.balance, 0);
  const totalDebt = accounts.filter(a => a.type === "debt").reduce((s, a) => s + a.balance, 0);
  const netWorth = totalAssets - totalDebt;

  const add = () => {
    if (!form.name || form.balance === "") return;
    const newAccounts = [...accounts, { ...form, id: `a${Date.now()}`, balance: Number(form.balance), lastUpdated: new Date().toISOString().slice(0, 10) }];
    setAccounts(newAccounts);
    const nw = newAccounts.filter(a => a.type !== "debt").reduce((s, a) => s + a.balance, 0)
      - newAccounts.filter(a => a.type === "debt").reduce((s, a) => s + a.balance, 0);
    const month = new Date().toISOString().slice(0, 7);
    setNwHistory(prev => [...prev.filter(h => h.month !== month), { month, nw }].slice(-24));
    setForm({ name: "", balance: "", type: "checking", institution: "" });
    setAdding(false);
  };

  const remove = (id) => setAccounts(prev => prev.filter(a => a.id !== id));
  const updateBalance = (id, balance) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, balance: Number(balance), lastUpdated: new Date().toISOString().slice(0, 10) } : a));
  };

  const typeColor = { checking: BLUE, savings: GREEN, investment: GOLD, retirement: PURPLE, crypto: ORANGE, debt: RED, other: TEAL };

  const pieData = accounts.map(a => ({ name: a.name, value: Math.abs(a.balance), color: typeColor[a.type] || TEAL })).filter(a => a.value > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
        <MetricCard label="Total Assets" value={fc(totalAssets)} color={GREEN} icon={Landmark} />
        <MetricCard label="Total Debt" value={fc(totalDebt)} color={RED} icon={CreditCard} />
        <MetricCard label="Net Worth" value={fc(netWorth)} color={netWorth >= 0 ? TEAL : RED} icon={TrendingUp} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1rem" }}>
        <div className="t-card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div className="t-section-title">Accounts</div>
            <button className="t-btn" onClick={() => setAdding(v => !v)} style={{ fontSize: "0.7rem", display: "flex", alignItems: "center", gap: 4 }}><Plus size={12} /> Add Account</button>
          </div>

          {adding && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", marginBottom: "0.75rem", padding: "0.75rem", background: "var(--elevated)", borderRadius: 6 }}>
              <div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-3)", marginBottom: 3 }}>Name</div>
                <input className="t-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Chase Checking" style={{ width: "100%", fontSize: "0.8rem" }} />
              </div>
              <div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-3)", marginBottom: 3 }}>Balance</div>
                <input type="number" className="t-input" value={form.balance} onChange={e => setForm(p => ({ ...p, balance: e.target.value }))} placeholder="0.00" style={{ width: "100%", fontSize: "0.8rem" }} />
              </div>
              <div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-3)", marginBottom: 3 }}>Type</div>
                <select className="t-input" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={{ width: "100%", fontSize: "0.8rem" }}>
                  {ACCOUNT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: "1/-1", display: "flex", gap: "0.5rem" }}>
                <button className="t-btn" onClick={add} style={{ fontSize: "0.75rem" }}>Save Account</button>
                <button onClick={() => setAdding(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", fontSize: "0.75rem" }}>Cancel</button>
              </div>
            </div>
          )}

          {accounts.length === 0 ? <EmptyState message="No accounts added yet" action="Add Account" onAction={() => setAdding(true)} /> : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {ACCOUNT_TYPES.filter(t => accounts.some(a => a.type === t)).map(type => (
                <div key={type}>
                  <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.35rem" }}>{type}</div>
                  {accounts.filter(a => a.type === type).map(a => (
                    <div key={a.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0.6rem", background: "var(--elevated)", borderRadius: 6, marginBottom: "0.3rem" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: typeColor[type] || TEAL }} />
                      <span style={{ flex: 1, fontSize: "0.8rem", color: "var(--text-1)" }}>{a.name}</span>
                      <InlineEdit value={a.balance} onSave={v => updateBalance(a.id, v)} type="number" prefix="$" />
                      <button onClick={() => remove(a.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)" }}><Trash2 size={11} /></button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="t-card" style={{ padding: "1.25rem" }}>
            <div className="t-section-title" style={{ marginBottom: "0.75rem" }}>Allocation</div>
            {pieData.length === 0 ? <EmptyState message="Add accounts to see allocation" /> : (
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={80} dataKey="value" paddingAngle={2}>
                    {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip formatter={v => fc(v)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {nwHistory.length > 1 && (
            <div className="t-card" style={{ padding: "1.25rem" }}>
              <div className="t-section-title" style={{ marginBottom: "0.75rem" }}>Net Worth History</div>
              <ResponsiveContainer width="100%" height={130}>
                <AreaChart data={nwHistory.slice(-12)}>
                  <defs>
                    <linearGradient id="nwGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={TEAL} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: "var(--text-3)" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="nw" name="Net Worth" stroke={TEAL} fill="url(#nwGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Goals Tab ──────────────────────────────────────────────────── */
function GoalCard({ g, monthsTo, addContribution, remove }) {
  const [contrib, setContrib] = useState("");
  const p = pct(g.saved, g.target);
  const months = monthsTo(g);
  const done = p >= 100;
  return (
    <div className="t-card" style={{ padding: "1.25rem", position: "relative", border: done ? `1px solid ${GREEN}40` : undefined }}>
      {done && <div style={{ position: "absolute", top: 10, right: 10, background: GREEN + "22", color: GREEN, fontSize: "0.6rem", fontWeight: 700, padding: "2px 7px", borderRadius: 99 }}>COMPLETE ✓</div>}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <CircularProgress pct={p} size={72} color={done ? GREEN : GOLD} label={`${p}%`} />
        <div>
          <div style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>{g.icon}</div>
          <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-1)" }}>{g.name}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>{fc(g.saved)} of {fc(g.target)}</div>
          {months && <div style={{ fontSize: "0.7rem", color: GOLD, marginTop: "0.2rem" }}>{months} months to go</div>}
          {g.deadline && <div style={{ fontSize: "0.7rem", color: "var(--text-3)" }}>Target: {g.deadline}</div>}
        </div>
      </div>
      <ProgressBar pct={p} color={done ? GREEN : GOLD} height={8} />
      {!done && (
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
          <input type="number" placeholder="Add funds..." value={contrib} onChange={e => setContrib(e.target.value)} className="t-input" style={{ flex: 1, fontSize: "0.8rem" }} />
          <button className="t-btn" onClick={() => { if (contrib) { addContribution(g.id, contrib); setContrib(""); } }} style={{ fontSize: "0.75rem" }}>Add</button>
        </div>
      )}
      <button onClick={() => remove(g.id)} style={{ position: "absolute", bottom: 10, right: 10, background: "none", border: "none", cursor: "pointer", color: "var(--text-3)" }}><Trash2 size={11} /></button>
    </div>
  );
}

function TabGoals({ goals, setGoals }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", target: "", saved: "", monthly: "", deadline: "", icon: "🎯" });
  const ICONS = ["🎯", "🏠", "🚗", "✈️", "🎓", "💍", "🏖️", "💰", "🏥", "🛡️"];

  const add = () => {
    if (!form.name || !form.target) return;
    const g = { ...form, id: `g${Date.now()}`, target: Number(form.target), saved: Number(form.saved || 0), monthly: Number(form.monthly || 0) };
    setGoals(prev => [...prev, g]);
    if (pct(g.saved, g.target) >= 100) fireworks();
    setForm({ name: "", target: "", saved: "", monthly: "", deadline: "", icon: "🎯" });
    setAdding(false);
  };

  const addContribution = (id, amount) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g;
      const newSaved = Math.min(g.target, g.saved + Number(amount));
      if (pct(newSaved, g.target) >= 100) fireworks();
      return { ...g, saved: newSaved };
    }));
  };

  const remove = (id) => setGoals(prev => prev.filter(g => g.id !== id));

  const fireworks = () => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: [GOLD, GREEN, BLUE, PURPLE] });
  };

  const monthsTo = (g) => {
    const remaining = g.target - g.saved;
    if (g.monthly <= 0 || remaining <= 0) return null;
    return Math.ceil(remaining / g.monthly);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="t-section-title">Financial Goals</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-3)", marginTop: "0.25rem" }}>{goals.length} goal{goals.length !== 1 ? "s" : ""} · {goals.filter(g => pct(g.saved, g.target) >= 100).length} completed</div>
        </div>
        <button className="t-btn" onClick={() => setAdding(v => !v)} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem" }}><Plus size={12} /> New Goal</button>
      </div>

      {adding && (
        <div className="t-card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
            {ICONS.map(ic => (
              <button key={ic} onClick={() => setForm(p => ({ ...p, icon: ic }))} style={{ fontSize: "1.25rem", background: form.icon === ic ? GOLD + "33" : "none", border: form.icon === ic ? `1px solid ${GOLD}` : "1px solid transparent", borderRadius: 6, cursor: "pointer", padding: "2px 6px" }}>{ic}</button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: "0.5rem" }}>
            <div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-3)", marginBottom: 3 }}>Goal Name</div>
              <input className="t-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Emergency Fund" style={{ width: "100%", fontSize: "0.8rem" }} />
            </div>
            <div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-3)", marginBottom: 3 }}>Target ($)</div>
              <input type="number" className="t-input" value={form.target} onChange={e => setForm(p => ({ ...p, target: e.target.value }))} placeholder="10000" style={{ width: "100%", fontSize: "0.8rem" }} />
            </div>
            <div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-3)", marginBottom: 3 }}>Saved ($)</div>
              <input type="number" className="t-input" value={form.saved} onChange={e => setForm(p => ({ ...p, saved: e.target.value }))} placeholder="0" style={{ width: "100%", fontSize: "0.8rem" }} />
            </div>
            <div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-3)", marginBottom: 3 }}>Monthly ($)</div>
              <input type="number" className="t-input" value={form.monthly} onChange={e => setForm(p => ({ ...p, monthly: e.target.value }))} placeholder="200" style={{ width: "100%", fontSize: "0.8rem" }} />
            </div>
            <div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-3)", marginBottom: 3 }}>Target Date</div>
              <input type="date" className="t-input" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} style={{ width: "100%", fontSize: "0.8rem" }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
            <button className="t-btn" onClick={add} style={{ fontSize: "0.75rem" }}>Save Goal</button>
            <button onClick={() => setAdding(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", fontSize: "0.75rem" }}>Cancel</button>
          </div>
        </div>
      )}

      {goals.length === 0 ? (
        <EmptyState icon={Target} message="Set your first financial goal" action="Add Goal" onAction={() => setAdding(true)} />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {goals.map(g => (
            <GoalCard key={g.id} g={g} monthsTo={monthsTo} addContribution={addContribution} remove={remove} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Bills Tab ──────────────────────────────────────────────────── */
function TabBills({ bills, setBills }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", amount: "", dueDay: "", frequency: "monthly", category: "Subscription", autopay: false });
  const CATEGORIES = ["Subscription", "Utilities", "Insurance", "Loan", "Rent/Mortgage", "Other"];
  const FREQS = ["monthly", "quarterly", "annually"];

  const add = () => {
    if (!form.name || !form.amount) return;
    setBills(prev => [...prev, { ...form, id: `b${Date.now()}`, amount: Number(form.amount), dueDay: Number(form.dueDay || 1), paid: false }]);
    setForm({ name: "", amount: "", dueDay: "", frequency: "monthly", category: "Subscription", autopay: false });
    setAdding(false);
  };

  const togglePaid = (id) => setBills(prev => prev.map(b => b.id === id ? { ...b, paid: !b.paid } : b));
  const remove = (id) => setBills(prev => prev.filter(b => b.id !== id));

  const totalMonthly = bills.reduce((s, b) => {
    if (b.frequency === "annually") return s + b.amount / 12;
    if (b.frequency === "quarterly") return s + b.amount / 3;
    return s + b.amount;
  }, 0);

  const dueUnpaid = bills.filter(b => !b.paid).reduce((s, b) => s + b.amount, 0);
  const today = new Date().getDate();

  const catColor = { Subscription: BLUE, Utilities: TEAL, Insurance: PURPLE, Loan: RED, "Rent/Mortgage": GOLD, Other: "var(--text-3)" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <MetricCard label="Monthly Obligation" value={fc(totalMonthly)} color={GOLD} icon={Calendar} />
        <MetricCard label="Unpaid This Cycle" value={fc(dueUnpaid)} color={dueUnpaid > 0 ? RED : GREEN} icon={AlertTriangle} />
        <MetricCard label="Autopay Enrolled" value={bills.filter(b => b.autopay).length} sub="bills on autopay" color={GREEN} icon={RefreshCw} />
      </div>

      <div className="t-card" style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div className="t-section-title">Bills & Subscriptions</div>
          <button className="t-btn" onClick={() => setAdding(v => !v)} style={{ fontSize: "0.7rem", display: "flex", alignItems: "center", gap: 4 }}><Plus size={12} /> Add Bill</button>
        </div>

        {adding && (
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", gap: "0.5rem", marginBottom: "0.75rem", padding: "0.75rem", background: "var(--elevated)", borderRadius: 6 }}>
            <div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-3)", marginBottom: 3 }}>Name</div>
              <input className="t-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Netflix" style={{ width: "100%", fontSize: "0.8rem" }} />
            </div>
            <div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-3)", marginBottom: 3 }}>Amount</div>
              <input type="number" className="t-input" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="15.99" style={{ width: "100%", fontSize: "0.8rem" }} />
            </div>
            <div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-3)", marginBottom: 3 }}>Due Day</div>
              <input type="number" className="t-input" value={form.dueDay} onChange={e => setForm(p => ({ ...p, dueDay: e.target.value }))} placeholder="1-31" min={1} max={31} style={{ width: "100%", fontSize: "0.8rem" }} />
            </div>
            <div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-3)", marginBottom: 3 }}>Frequency</div>
              <select className="t-input" value={form.frequency} onChange={e => setForm(p => ({ ...p, frequency: e.target.value }))} style={{ width: "100%", fontSize: "0.8rem" }}>
                {FREQS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-3)", marginBottom: 3 }}>Category</div>
              <select className="t-input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={{ width: "100%", fontSize: "0.8rem" }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: "1/-1", display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "var(--text-2)", cursor: "pointer" }}>
                <input type="checkbox" checked={form.autopay} onChange={e => setForm(p => ({ ...p, autopay: e.target.checked }))} />
                Autopay enabled
              </label>
              <button className="t-btn" onClick={add} style={{ fontSize: "0.75rem" }}>Save</button>
              <button onClick={() => setAdding(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", fontSize: "0.75rem" }}>Cancel</button>
            </div>
          </div>
        )}

        {bills.length === 0 ? <EmptyState message="No bills tracked yet" action="Add Bill" onAction={() => setAdding(true)} /> : (
          <table className="t-table" style={{ width: "100%" }}>
            <thead><tr><th>Bill</th><th>Category</th><th>Due</th><th>Frequency</th><th style={{ textAlign: "right" }}>Amount</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {bills.sort((a, b) => a.dueDay - b.dueDay).map(b => {
                const overdue = !b.paid && b.dueDay < today;
                return (
                  <tr key={b.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-1)" }}>{b.name}</span>
                        {b.autopay && <span style={{ fontSize: "0.6rem", color: GREEN, background: GREEN + "22", padding: "1px 5px", borderRadius: 99 }}>AUTO</span>}
                      </div>
                    </td>
                    <td><span style={{ fontSize: "0.65rem", color: catColor[b.category] || "var(--text-3)" }}>{b.category}</span></td>
                    <td style={{ fontSize: "0.75rem", color: overdue ? RED : "var(--text-3)" }}>Day {b.dueDay}{overdue ? " ⚠" : ""}</td>
                    <td style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>{b.frequency}</td>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{fc(b.amount)}</td>
                    <td>
                      <button onClick={() => togglePaid(b.id)} style={{ padding: "2px 9px", borderRadius: 99, border: "none", cursor: "pointer", fontSize: "0.65rem", fontWeight: 700, background: b.paid ? GREEN + "33" : "var(--elevated)", color: b.paid ? GREEN : "var(--text-3)" }}>
                        {b.paid ? "Paid ✓" : "Mark Paid"}
                      </button>
                    </td>
                    <td><button onClick={() => remove(b.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)" }}><Trash2 size={11} /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ─── Insights Tab ───────────────────────────────────────────────── */
function TabInsights({ income, extraIncome, categories, transactions, bills, goals }) {
  const totalIncome = income + extraIncome.reduce((s, e) => s + e.amount, 0);
  const totalBudget = categories.reduce((s, c) => s + c.budget, 0);
  const savingsAmt = Math.max(0, totalIncome - totalBudget);
  const savingsRate = totalIncome > 0 ? (savingsAmt / totalIncome) * 100 : 0;
  const housingCat = categories.find(c => c.name.toLowerCase().includes("hous") || c.name.toLowerCase().includes("rent"));
  const housingPct = housingCat && totalIncome > 0 ? (housingCat.budget / totalIncome) * 100 : 0;
  const dtiDebt = bills.filter(b => ["Loan", "Rent/Mortgage"].includes(b.category)).reduce((s, b) => s + b.amount, 0);
  const dti = totalIncome > 0 ? (dtiDebt / totalIncome) * 100 : 0;
  const billsTotal = bills.filter(b => !b.autopay).length;

  const spendByCategory = categories.map(c => ({
    name: c.name,
    budget: c.budget,
    spent: transactions.filter(t => t.categoryId === c.id && t.type === "expense").reduce((s, t) => s + t.amount, 0),
  }));

  const overBudgetCats = spendByCategory.filter(c => c.spent > c.budget && c.budget > 0);
  const underBudgetCats = spendByCategory.filter(c => c.spent < c.budget * 0.5 && c.budget > 0);

  const insights = [];
  if (savingsRate < 10) insights.push({ type: "warning", text: `Your savings rate is ${savingsRate.toFixed(1)}%. Aim for at least 20% to build wealth. Try reducing discretionary spending by ${fc(totalIncome * 0.1)}/mo.` });
  else if (savingsRate >= 20) insights.push({ type: "success", text: `Strong savings rate of ${savingsRate.toFixed(1)}%! You're on track to build significant wealth over time.` });
  if (housingPct > 30) insights.push({ type: "warning", text: `Housing at ${housingPct.toFixed(0)}% of income exceeds the 30% rule. Look for ways to reduce or increase income.` });
  if (dti > 36) insights.push({ type: "warning", text: `Debt-to-income ratio of ${dti.toFixed(0)}% is high. Lenders prefer under 36%. Focus on paying down debt.` });
  if (overBudgetCats.length > 0) insights.push({ type: "warning", text: `Over budget in: ${overBudgetCats.map(c => c.name).join(", ")}. Review spending in these areas.` });
  if (billsTotal > 0) insights.push({ type: "info", text: `${billsTotal} bills not on autopay. Setting up autopay prevents late fees and protects your credit score.` });
  if (goals.filter(g => pct(g.saved, g.target) < 100).length === 0 && goals.length > 0) insights.push({ type: "success", text: "All goals funded! Time to set new milestones or increase investment contributions." });

  const rulesData = [
    { rule: "50/30/20", actual: savingsRate.toFixed(0) + "% savings", status: savingsRate >= 20 ? "green" : savingsRate >= 10 ? "yellow" : "red", desc: "50% needs, 30% wants, 20% savings" },
    { rule: "Housing ≤30%", actual: housingPct.toFixed(0) + "%", status: housingPct <= 30 ? "green" : housingPct <= 40 ? "yellow" : "red", desc: "Keep housing under 30% of income" },
    { rule: "DTI ≤36%", actual: dti.toFixed(0) + "%", status: dti <= 36 ? "green" : dti <= 43 ? "yellow" : "red", desc: "Debt payments under 36% of income" },
    { rule: "6mo Emergency", actual: `${goals.find(g => g.name.toLowerCase().includes("emergency"))?.saved ? fc(goals.find(g => g.name.toLowerCase().includes("emergency")).saved) : "—"}`, status: goals.find(g => g.name.toLowerCase().includes("emergency") && pct(g.saved, g.target) >= 100) ? "green" : "yellow", desc: "6 months of expenses in cash" },
  ];

  const catBarData = categories.map((c, i) => ({
    name: c.name.length > 10 ? c.name.slice(0, 10) + "…" : c.name,
    Budget: c.budget,
    Spent: transactions.filter(t => t.categoryId === c.id && t.type === "expense").reduce((s, t) => s + t.amount, 0),
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Financial health rules */}
      <div className="t-card" style={{ padding: "1.25rem" }}>
        <div className="t-section-title" style={{ marginBottom: "1rem" }}>Financial Health Rules</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
          {rulesData.map(r => (
            <div key={r.rule} style={{ padding: "0.75rem 1rem", background: "var(--elevated)", borderRadius: 8, borderLeft: `3px solid ${r.status === "green" ? GREEN : r.status === "yellow" ? GOLD : RED}` }}>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "0.25rem" }}>{r.rule}</div>
              <div style={{ fontSize: "1rem", fontWeight: 900, color: r.status === "green" ? GREEN : r.status === "yellow" ? GOLD : RED, fontFamily: "var(--font-mono)" }}>{r.actual}</div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-3)", marginTop: "0.2rem" }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="t-card" style={{ padding: "1.25rem" }}>
        <div className="t-section-title" style={{ marginBottom: "0.75rem" }}>Smart Insights</div>
        {insights.length === 0 ? <EmptyState icon={Lightbulb} message="Add more data to generate insights" /> : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {insights.map((ins, i) => (
              <div key={i} style={{ display: "flex", gap: "0.75rem", padding: "0.75rem 1rem", background: "var(--elevated)", borderRadius: 6, borderLeft: `3px solid ${ins.type === "success" ? GREEN : ins.type === "warning" ? GOLD : BLUE}` }}>
                {ins.type === "success" ? <CheckCircle size={16} color={GREEN} style={{ flexShrink: 0, marginTop: 1 }} /> : ins.type === "warning" ? <AlertTriangle size={16} color={GOLD} style={{ flexShrink: 0, marginTop: 1 }} /> : <Info size={16} color={BLUE} style={{ flexShrink: 0, marginTop: 1 }} />}
                <span style={{ fontSize: "0.8rem", color: "var(--text-2)", lineHeight: 1.5 }}>{ins.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category comparison chart */}
      {catBarData.length > 0 && (
        <div className="t-card" style={{ padding: "1.25rem" }}>
          <div className="t-section-title" style={{ marginBottom: "0.75rem" }}>Budget vs Actual by Category</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={catBarData} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--text-3)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--text-3)" }} axisLine={false} tickLine={false} tickFormatter={v => "$" + v} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "0.7rem" }} />
              <Bar dataKey="Budget" fill={GOLD} opacity={0.6} radius={[3, 3, 0, 0]} />
              <Bar dataKey="Spent" fill={BLUE} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

/* ─── Net Worth Tab ──────────────────────────────────────────────── */
function TabNetWorth({ accounts, nwHistory, setNwHistory }) {
  const totalAssets = accounts.filter(a => a.type !== "debt").reduce((s, a) => s + a.balance, 0);
  const totalDebt = accounts.filter(a => a.type === "debt").reduce((s, a) => s + a.balance, 0);
  const netWorth = totalAssets - totalDebt;

  const [projYears, setProjYears] = useState(10);
  const [growthRate, setGrowthRate] = useState(7);
  const [monthlyAdd, setMonthlyAdd] = useState(500);

  const fvL = (pv, r, n) => pv * Math.pow(1 + r / 100, n);
  const fvP = (pmt, r, n) => pmt * 12 * ((Math.pow(1 + r / 100, n) - 1) / (r / 100));

  const projData = Array.from({ length: projYears + 1 }, (_, i) => ({
    year: `Y${i}`,
    conservative: Math.round(fvL(netWorth, 4, i) + fvP(monthlyAdd, 4, i)),
    base: Math.round(fvL(netWorth, growthRate, i) + fvP(monthlyAdd, growthRate, i)),
    aggressive: Math.round(fvL(netWorth, 10, i) + fvP(monthlyAdd, 10, i)),
  }));

  const assetTypes = ["checking", "savings", "investment", "retirement", "crypto", "other"];
  const assetBreakdown = assetTypes.map(t => ({
    name: t.charAt(0).toUpperCase() + t.slice(1),
    value: accounts.filter(a => a.type === t).reduce((s, a) => s + a.balance, 0),
  })).filter(a => a.value > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
        <MetricCard label="Total Assets" value={fc(totalAssets)} color={GREEN} icon={Landmark} />
        <MetricCard label="Total Debt" value={fc(totalDebt)} color={RED} icon={CreditCard} />
        <MetricCard label="Net Worth" value={fc(netWorth)} color={netWorth >= 0 ? TEAL : RED} icon={TrendingUp} />
      </div>

      {/* Projection */}
      <div className="t-card" style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <div className="t-section-title">Net Worth Projection</div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <label style={{ fontSize: "0.7rem", color: "var(--text-3)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              Years: <select value={projYears} onChange={e => setProjYears(Number(e.target.value))} className="t-input" style={{ fontSize: "0.75rem", padding: "2px 6px" }}>
                {[5, 10, 15, 20, 30].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </label>
            <label style={{ fontSize: "0.7rem", color: "var(--text-3)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              Return: <input type="number" value={growthRate} onChange={e => setGrowthRate(Number(e.target.value))} className="t-input" style={{ width: 55, fontSize: "0.75rem", padding: "2px 6px" }} />%
            </label>
            <label style={{ fontSize: "0.7rem", color: "var(--text-3)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              Monthly: $<input type="number" value={monthlyAdd} onChange={e => setMonthlyAdd(Number(e.target.value))} className="t-input" style={{ width: 80, fontSize: "0.75rem", padding: "2px 6px" }} />
            </label>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={projData}>
            <defs>
              <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={GOLD} stopOpacity={0.3} />
                <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" />
            <XAxis dataKey="year" tick={{ fontSize: 10, fill: "var(--text-3)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "var(--text-3)" }} axisLine={false} tickLine={false} tickFormatter={v => fc(v)} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "0.7rem" }} />
            <Area type="monotone" dataKey="conservative" name="Conservative (4%)" stroke={BLUE} fill="none" strokeDasharray="4 2" strokeWidth={1.5} />
            <Area type="monotone" dataKey="base" name={`Base (${growthRate}%)`} stroke={GOLD} fill="url(#baseGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="aggressive" name="Aggressive (10%)" stroke={GREEN} fill="none" strokeDasharray="4 2" strokeWidth={1.5} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: "1rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
          {[{ label: `In ${projYears} Years (Base)`, val: projData[projYears]?.base }, { label: "Conservative", val: projData[projYears]?.conservative }, { label: "Aggressive", val: projData[projYears]?.aggressive }].map(p => (
            <div key={p.label} style={{ padding: "0.5rem 0.9rem", background: "var(--elevated)", borderRadius: 6, textAlign: "center" }}>
              <div style={{ fontSize: "0.65rem", color: "var(--text-3)" }}>{p.label}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontWeight: 900, color: GOLD, fontSize: "0.9rem" }}>{fc(p.val || 0)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Asset breakdown */}
      {assetBreakdown.length > 0 && (
        <div className="t-card" style={{ padding: "1.25rem" }}>
          <div className="t-section-title" style={{ marginBottom: "0.75rem" }}>Asset Breakdown</div>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {assetBreakdown.map((a, i) => (
              <div key={a.name} style={{ display: "flex", flexDirection: "column", gap: "0.3rem", minWidth: 100 }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-3)" }}>{a.name}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontWeight: 900, color: PIE_COLORS[i % PIE_COLORS.length], fontSize: "0.9rem" }}>{fc(a.value)}</div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-3)" }}>{pct(a.value, totalAssets)}% of assets</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
/* ─── Goal Funding Tab ───────────────────────────────────────────── */
function TabFunding({ accounts, goals, allocations, setAllocations }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ accountId: "", goalId: "", pct: "" });

  const nonDebtAccounts = accounts.filter(a => a.type !== "debt");

  // Dollar amount for an allocation is always derived live from account.balance * pct / 100
  const allocAmt = (al) => {
    const acct = accounts.find(a => a.id === al.accountId);
    return acct ? Math.round((acct.balance * al.pct) / 100) : 0;
  };

  const add = () => {
    const p = Number(form.pct);
    if (!form.accountId || !form.goalId || !p || p <= 0 || p > 100) return;
    // Guard: total allocated % for this account can't exceed 100
    const usedPct = allocations.filter(al => al.accountId === form.accountId).reduce((s, al) => s + al.pct, 0);
    if (usedPct + p > 100) return;
    setAllocations(prev => [...prev, { id: `al${Date.now()}`, accountId: form.accountId, goalId: form.goalId, pct: p }]);
    setForm({ accountId: "", goalId: "", pct: "" });
    setAdding(false);
  };

  const remove = (id) => setAllocations(prev => prev.filter(a => a.id !== id));

  // Per-goal: dollar amount funded from all allocations
  const goalFunding = goals.map(g => {
    const sources = allocations.filter(al => al.goalId === g.id).map(al => ({
      ...al,
      dollarAmt: allocAmt(al),
      accountName: accounts.find(a => a.id === al.accountId)?.name || "Unknown",
      accountType: accounts.find(a => a.id === al.accountId)?.type || "",
    }));
    const funded = sources.reduce((s, src) => s + src.dollarAmt, 0);
    return { ...g, funded, sources, pctFunded: g.target > 0 ? Math.min(100, Math.round((funded / g.target) * 100)) : 0 };
  });

  // Per-account: total % allocated and remaining %
  const accountSummary = nonDebtAccounts.map(a => {
    const usedPct = allocations.filter(al => al.accountId === a.id).reduce((s, al) => s + al.pct, 0);
    const allocatedAmt = Math.round((a.balance * usedPct) / 100);
    return { ...a, usedPct, allocatedAmt, freePct: 100 - usedPct, freeAmt: a.balance - allocatedAmt };
  });

  const typeColor = { checking: BLUE, savings: GREEN, investment: GOLD, retirement: PURPLE, crypto: ORANGE, other: TEAL };

  // Available % remaining for selected account in form
  const selectedAcct = nonDebtAccounts.find(a => a.id === form.accountId);
  const usedPctForSelected = allocations.filter(al => al.accountId === form.accountId).reduce((s, al) => s + al.pct, 0);
  const availPct = 100 - usedPctForSelected;
  const previewAmt = selectedAcct && form.pct ? Math.round((selectedAcct.balance * Number(form.pct)) / 100) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="t-section-title">Goal Funding</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-3)", marginTop: "0.25rem" }}>
            Allocate a percentage of each account toward specific goals
          </div>
        </div>
        <button className="t-btn" onClick={() => setAdding(v => !v)} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem" }}>
          <Plus size={12} /> Add Allocation
        </button>
      </div>

      {/* Add allocation form */}
      {adding && (
        <div className="t-card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", alignItems: "end" }}>
            <div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-3)", marginBottom: 4 }}>From Account</div>
              <select className="t-input" value={form.accountId} onChange={e => setForm(p => ({ ...p, accountId: e.target.value, pct: "" }))} style={{ width: "100%", fontSize: "0.8rem" }}>
                <option value="">Select account…</option>
                {nonDebtAccounts.map(a => {
                  const used = allocations.filter(al => al.accountId === a.id).reduce((s, al) => s + al.pct, 0);
                  const free = 100 - used;
                  return <option key={a.id} value={a.id} disabled={free <= 0}>{a.name} — {free}% available ({fc(Math.round(a.balance * free / 100))})</option>;
                })}
              </select>
            </div>
            <div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-3)", marginBottom: 4 }}>Toward Goal</div>
              <select className="t-input" value={form.goalId} onChange={e => setForm(p => ({ ...p, goalId: e.target.value }))} style={{ width: "100%", fontSize: "0.8rem" }}>
                <option value="">Select goal…</option>
                {goals.map(g => <option key={g.id} value={g.id}>{g.icon} {g.name} (target {fc(g.target)})</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-3)", marginBottom: 4 }}>
                Percentage (%) {form.accountId && <span style={{ color: "var(--text-3)" }}>— max {availPct}%</span>}
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type="number" min="1" max={availPct || 100}
                  className="t-input" value={form.pct}
                  onChange={e => setForm(p => ({ ...p, pct: e.target.value }))}
                  placeholder="e.g. 50"
                  style={{ width: "100%", fontSize: "0.8rem", paddingRight: "2rem" }}
                />
                <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: "0.8rem", color: "var(--text-3)" }}>%</span>
              </div>
              {previewAmt !== null && (
                <div style={{ fontSize: "0.7rem", color: GOLD, marginTop: "0.3rem" }}>
                  = {fc(previewAmt)} from {selectedAcct?.name}
                </div>
              )}
            </div>
          </div>
          {form.accountId && usedPctForSelected + Number(form.pct || 0) > 100 && (
            <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: RED }}>
              Exceeds available allocation — only {availPct}% remaining for this account.
            </div>
          )}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
            <button className="t-btn" onClick={add} style={{ fontSize: "0.75rem" }}>Save Allocation</button>
            <button onClick={() => setAdding(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", fontSize: "0.75rem" }}>Cancel</button>
          </div>
        </div>
      )}

      {accounts.length === 0 || goals.length === 0 ? (
        <EmptyState icon={Flag} message="Add accounts and goals first to set up funding allocations" />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>

          {/* Goals column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Goals — Funding Status</div>
            {goalFunding.map(g => (
              <div key={g.id} className="t-card" style={{ padding: "1rem 1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.6rem" }}>
                  <span style={{ fontSize: "1.1rem" }}>{g.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-1)" }}>{g.name}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-3)" }}>Target: {fc(g.target)}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 900, color: g.pctFunded >= 100 ? GREEN : g.pctFunded >= 50 ? GOLD : RED }}>
                      {g.pctFunded}%
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "var(--text-3)" }}>{fc(g.funded)} funded</div>
                  </div>
                </div>
                <ProgressBar pct={g.pctFunded} color={g.pctFunded >= 100 ? GREEN : g.pctFunded >= 50 ? GOLD : RED} height={6} />

                {/* Funding sources */}
                {g.sources.length > 0 && (
                  <div style={{ marginTop: "0.6rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                    {g.sources.map(src => (
                      <div key={src.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.72rem" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: typeColor[src.accountType] || TEAL, flexShrink: 0 }} />
                        <span style={{ flex: 1, color: "var(--text-2)" }}>{src.accountName}</span>
                        <span style={{ color: GOLD, fontWeight: 700 }}>{src.pct}%</span>
                        <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-3)" }}>= {fc(src.dollarAmt)}</span>
                        <button onClick={() => remove(src.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", display: "flex", padding: 0 }}>
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {g.sources.length === 0 && (
                  <div style={{ marginTop: "0.5rem", fontSize: "0.7rem", color: "var(--text-3)", fontStyle: "italic" }}>No accounts allocated yet</div>
                )}
                {g.pctFunded < 100 && (
                  <div style={{ marginTop: "0.5rem", fontSize: "0.7rem", color: RED }}>{fc(g.target - g.funded)} still needed</div>
                )}
              </div>
            ))}
          </div>

          {/* Accounts column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Accounts — Allocation Breakdown</div>
            {accountSummary.map(a => {
              const goalsForAccount = allocations.filter(al => al.accountId === a.id).map(al => ({
                ...al,
                dollarAmt: allocAmt(al),
                goalName: goals.find(g => g.id === al.goalId)?.name || "Unknown",
                goalIcon: goals.find(g => g.id === al.goalId)?.icon || "🎯",
              }));
              return (
                <div key={a.id} className="t-card" style={{ padding: "1rem 1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.6rem" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: typeColor[a.type] || TEAL, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-1)" }}>{a.name}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-3)", textTransform: "capitalize" }}>{a.type}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 900, color: "var(--text-1)" }}>{fc(a.balance)}</div>
                      <div style={{ fontSize: "0.65rem", color: "var(--text-3)" }}>total balance</div>
                    </div>
                  </div>

                  {/* Segmented bar: each goal gets a color slice */}
                  <div style={{ height: 8, background: "var(--border-c)", borderRadius: 99, overflow: "hidden", marginBottom: "0.5rem", display: "flex" }}>
                    {goalsForAccount.map((gf, i) => (
                      <div key={gf.id} style={{ height: "100%", width: `${gf.pct}%`, background: PIE_COLORS[i % PIE_COLORS.length], transition: "width 0.4s ease" }} />
                    ))}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", marginBottom: goalsForAccount.length > 0 ? "0.5rem" : 0 }}>
                    <span style={{ color: GOLD }}>{a.usedPct}% allocated · {fc(a.allocatedAmt)}</span>
                    <span style={{ color: a.freePct > 0 ? GREEN : "var(--text-3)" }}>{a.freePct}% free · {fc(a.freeAmt)}</span>
                  </div>

                  {goalsForAccount.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      {goalsForAccount.map((gf, i) => (
                        <div key={gf.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.72rem" }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                          <span style={{ color: "var(--text-2)" }}>{gf.goalIcon} {gf.goalName}</span>
                          <span style={{ marginLeft: "auto", color: GOLD, fontWeight: 700 }}>{gf.pct}%</span>
                          <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-3)" }}>{fc(gf.dollarAmt)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {nonDebtAccounts.length === 0 && <EmptyState icon={Landmark} message="No asset accounts yet" />}
          </div>
        </div>
      )}
    </div>
  );
}

const TABS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "budget", label: "Budget", icon: DollarSign },
  { key: "transactions", label: "Transactions", icon: CreditCard },
  { key: "accounts", label: "Accounts", icon: Landmark },
  { key: "goals", label: "Goals", icon: Target },
  { key: "funding", label: "Funding", icon: Flag },
  { key: "bills", label: "Bills", icon: Calendar },
  { key: "insights", label: "Insights", icon: Lightbulb },
  { key: "networth", label: "Net Worth", icon: TrendingUp },
];

export default function BudgetPlanner() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [income, setIncome] = useLocalStorage("bp_income", 5000);
  const [extraIncome, setExtraIncome] = useLocalStorage("bp_extra_income", []);
  const [categories, setCategories] = useLocalStorage("bp_categories", DEFAULT_CATEGORIES);
  const [transactions, setTransactions] = useLocalStorage("bp_transactions", []);
  const [accounts, setAccounts] = useLocalStorage("bp_accounts", []);
  const [goals, setGoals] = useLocalStorage("bp_goals", []);
  const [bills, setBills] = useLocalStorage("bp_bills", []);
  const [nwHistory, setNwHistory] = useLocalStorage("bp_nw_history", []);
  const [allocations, setAllocations] = useLocalStorage("bp_allocations", []);

  const tabProps = { income, setIncome, extraIncome, setExtraIncome, categories, setCategories, transactions, setTransactions, accounts, setAccounts, goals, setGoals, bills, setBills, nwHistory, setNwHistory, allocations, setAllocations };

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <TabDashboard {...tabProps} />;
      case "budget": return <TabBudget {...tabProps} />;
      case "transactions": return <TabTransactions {...tabProps} />;
      case "accounts": return <TabAccounts {...tabProps} />;
      case "goals": return <TabGoals {...tabProps} />;
      case "funding": return <TabFunding {...tabProps} />;
      case "bills": return <TabBills {...tabProps} />;
      case "insights": return <TabInsights {...tabProps} />;
      case "networth": return <TabNetWorth {...tabProps} />;
      default: return null;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border-c)",
        borderRadius: 16,
        padding: "1.75rem 2rem",
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
                <Wallet size={14} style={{ color: "var(--gold)" }} />
              </div>
              <h1 className="t-page-title" style={{ margin: 0 }}>BUDGET PLANNER</h1>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.65, maxWidth: 560, margin: "0 0 1rem" }}>
              Build a budget that actually works. Categorize your income and expenses, set savings goals, and visualize your monthly cash flow to take control of your finances.
            </p>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              {["50/30/20 Rule", "Category Tracking", "Savings Goals", "Monthly Cash Flow"].map((label) => (
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
              { icon: DollarSign, label: "Income Tracker", sub: "Salary, freelance & more", color: "#3b82f6" },
              { icon: LayoutDashboard, label: "Expense Categories", sub: "Needs, wants & savings", color: "var(--gold)" },
              { icon: Target, label: "Savings Goals", sub: "Track progress to goals", color: "var(--teal)" },
              { icon: TrendingUp, label: "Cash Flow", sub: "Monthly in vs. out", color: "#f59e0b" },
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
      <div style={{ display: "flex", gap: "0.25rem", background: "var(--surface)", padding: "0.3rem", borderRadius: 8, border: "1px solid var(--border-c)", overflowX: "auto" }}>
        {TABS.map(t => {
          const active = activeTab === t.key;
          return (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.45rem 0.85rem", borderRadius: 6, border: "none", cursor: "pointer", background: active ? GOLD : "none", color: active ? "#07080a" : "var(--text-3)", fontWeight: active ? 800 : 500, fontSize: "0.75rem", whiteSpace: "nowrap", transition: "all 0.15s ease", flexShrink: 0 }}>
              <t.icon size={13} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {renderTab()}
    </div>
  );
}
