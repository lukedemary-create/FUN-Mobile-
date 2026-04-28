import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Cell, Legend, ReferenceLine,
} from "recharts";
import {
  LayoutDashboard, Calculator, BookOpen, Star, DollarSign, Users,
  FileText, Shield, GraduationCap, ArrowRight, Plus, Trash2, Check,
  AlertTriangle, CheckCircle, Info, ChevronDown, ChevronUp, Download,
  HeartPulse, Clock, TrendingUp, Zap,
} from "lucide-react";

/* ─── localStorage hook ─────────────────────────────────────────── */
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

/* ─── Colors ────────────────────────────────────────────────────── */
const GOLD = "#c9a84c"; const BLUE = "#4c9fcf"; const GREEN = "#4caf7d";
const RED = "#e05c5c"; const TEAL = "#4dd0c4"; const PURPLE = "#9b6cdb";
const ORANGE = "#e07c3a";
const POLICY_COLOR = { term: BLUE, whole: GOLD, universal: PURPLE, iul: GREEN, variable: ORANGE };

const fc = (n) => {
  const abs = Math.abs(n || 0);
  if (abs >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (abs >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
  return "$" + Math.round(n || 0).toLocaleString();
};
const fm = (n) => "$" + (n || 0).toFixed(2) + "/mo";

/* ─── Shared UI ─────────────────────────────────────────────────── */
function KPI({ label, value, sub, color = GOLD, icon: Icon }) {
  return (
    <div className="t-card" style={{ padding: "1rem 1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: "0.62rem", fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>{label}</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 900, color, fontFamily: "var(--font-mono)", lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ fontSize: "0.68rem", color: "var(--text-3)", marginTop: "0.3rem" }}>{sub}</div>}
        </div>
        {Icon && <Icon size={18} color={color} style={{ opacity: 0.6 }} />}
      </div>
    </div>
  );
}

function PBar({ pct, color = GOLD, h = 6 }) {
  return (
    <div style={{ height: h, background: "var(--border-c)", borderRadius: 99, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${Math.min(100, Math.max(0, pct))}%`, background: color, borderRadius: 99, transition: "width 0.4s" }} />
    </div>
  );
}

function Badge({ label, color = GOLD }) {
  return <span style={{ fontSize: "0.62rem", fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: color + "22", color, border: `1px solid ${color}44` }}>{label}</span>;
}

function ScoreGauge({ score, size = 140 }) {
  const sw = size * 0.09;
  const r  = (size - sw * 2) / 2;
  const cx = size / 2;
  const cy = size / 2;
  // Semicircle path: left endpoint → top arc → right endpoint
  const x0 = cx - r, x1 = cx + r, y0 = cy;
  const arcPath = `M ${x0},${y0} A ${r},${r} 0 0 1 ${x1},${y0}`;
  const arcLen  = Math.PI * r;
  const filled  = (Math.min(100, Math.max(0, score)) / 100) * arcLen;
  const color   = score >= 75 ? GREEN : score >= 50 ? GOLD : score >= 25 ? ORANGE : RED;
  const label   = score >= 70 ? "Well Protected" : score >= 40 ? "Partially Covered" : "Needs Coverage";
  const viewH   = cy + sw / 2; // only show top half + stroke cap
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", width: size, height: viewH, margin: "0 auto" }}>
        <svg width={size} height={viewH} viewBox={`0 0 ${size} ${viewH}`}>
          {/* Track */}
          <path d={arcPath} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={sw} strokeLinecap="round" />
          {/* Progress */}
          <path d={arcPath} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
            strokeDasharray={`${filled} ${arcLen}`}
            style={{ transition: "stroke-dasharray 0.5s ease" }}
          />
        </svg>
        {/* Score text pinned to center-bottom of the arc */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, textAlign: "center" }}>
          <div style={{ fontSize: size * 0.22, fontWeight: 900, color, fontFamily: "var(--font-mono)", lineHeight: 1 }}>{score}</div>
          <div style={{ fontSize: size * 0.11, color: "var(--text-3)", marginTop: 2 }}>/ 100</div>
        </div>
      </div>
      <div style={{ fontSize: "0.7rem", color, fontWeight: 600, marginTop: 10 }}>{label}</div>
    </div>
  );
}

function Empty({ msg, action, onAction }) {
  return (
    <div style={{ textAlign: "center", padding: "2rem 1rem", color: "var(--text-3)" }}>
      <Info size={28} style={{ opacity: 0.3, marginBottom: "0.6rem" }} />
      <div style={{ fontSize: "0.82rem", marginBottom: action ? "0.6rem" : 0 }}>{msg}</div>
      {action && <button className="t-btn" onClick={onAction} style={{ fontSize: "0.72rem" }}>{action}</button>}
    </div>
  );
}

function ExpandCard({ title, color, badge, summary, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="t-card" style={{ overflow: "hidden", borderTop: `3px solid ${color}` }}>
      <button onClick={() => setOpen(v => !v)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem", background: "none", border: "none", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Badge label={badge} color={color} />
          <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-1)" }}>{title}</span>
          <span style={{ fontSize: "0.72rem", color: "var(--text-3)" }}>{summary}</span>
        </div>
        {open ? <ChevronUp size={14} color="var(--text-3)" /> : <ChevronDown size={14} color="var(--text-3)" />}
      </button>
      {open && <div style={{ padding: "0 1.25rem 1.25rem", borderTop: "1px solid var(--border-c)" }}>{children}</div>}
    </div>
  );
}

const CustomTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--elevated)", border: "1px solid var(--border-c)", borderRadius: 6, padding: "0.6rem 0.9rem", fontSize: "0.75rem" }}>
      {label && <div style={{ color: "var(--text-3)", marginBottom: "0.3rem" }}>{label}</div>}
      {payload.map((p, i) => <div key={i} style={{ color: p.color || "var(--text-1)", fontWeight: 700 }}>{p.name}: {typeof p.value === "number" && p.value > 99 ? fc(p.value) : p.value}</div>)}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   PREMIUM ESTIMATION LOGIC
═══════════════════════════════════════════════════════════════════ */
function estimatePremium(coverage, age, isSmoker, healthClass, policyType = "term", termYears = 20) {
  const base = coverage / 1000;
  const healthMult = { "Preferred Plus": 1.0, "Preferred": 1.15, "Standard Plus": 1.35, "Standard": 1.6, "Substandard": 2.2 };
  const smokerMult = isSmoker ? 2.5 : 1.0;
  const ageMult = age < 30 ? 0.5 : age < 35 ? 0.7 : age < 40 ? 1.0 : age < 45 ? 1.5 : age < 50 ? 2.2 : age < 55 ? 3.2 : age < 60 ? 4.5 : 6.5;
  const termMult = termYears <= 10 ? 0.7 : termYears <= 15 ? 0.85 : termYears <= 20 ? 1.0 : termYears <= 25 ? 1.2 : 1.4;
  const typeMult = { term: 1.0, whole: 8.0, universal: 5.0, iul: 6.0, variable: 5.5 };
  const rate = 0.06 * ageMult * smokerMult * (healthMult[healthClass] || 1.0) * (typeMult[policyType] || 1.0) * (policyType === "term" ? termMult : 1.0);
  return Math.max(10, Math.round(base * rate));
}

/* ═══════════════════════════════════════════════════════════════════
   TAB 1 — DASHBOARD
═══════════════════════════════════════════════════════════════════ */
function TabDashboard({ profile, policies }) {
  const annualIncome = profile.annualIncome || 75000;
  const dependents = profile.dependents || 2;
  const debts = profile.totalDebts || 0;
  const existingCoverage = policies.reduce((s, p) => s + (p.deathBenefit || 0), 0);

  const incomeReplacement = annualIncome * (profile.incomeYears || 10);
  const mortgageNeed = profile.mortgage || 0;
  const educationNeed = (profile.children || 0) * 60000;
  const finalExpenses = 15000;
  const totalNeed = incomeReplacement + mortgageNeed + educationNeed + debts + finalExpenses;
  const gap = Math.max(0, totalNeed - existingCoverage);
  const recommended = Math.ceil(totalNeed / 250000) * 250000;

  const age = profile.age || 35;
  const monthlyEst = estimatePremium(gap || recommended, age, profile.isSmoker, profile.healthClass || "Preferred", "term", 20);

  const score = Math.min(100, Math.round(
    (existingCoverage > 0 ? 30 : 0) +
    (existingCoverage >= totalNeed * 0.5 ? 20 : 0) +
    (existingCoverage >= totalNeed ? 30 : 0) +
    (profile.annualIncome ? 10 : 0) +
    (dependents > 0 ? 10 : 0)
  ));

  const gapData = [
    { name: "Income Replacement", value: incomeReplacement, fill: BLUE },
    { name: "Mortgage", value: mortgageNeed, fill: TEAL },
    { name: "Education", value: educationNeed, fill: PURPLE },
    { name: "Debts", value: debts, fill: ORANGE },
    { name: "Final Expenses", value: finalExpenses, fill: RED },
  ].filter(d => d.value > 0);

  const coverageBar = [
    { name: "What You Need", need: totalNeed, have: 0 },
    { name: "Current Coverage", need: 0, have: existingCoverage },
    { name: "Coverage Gap", need: 0, have: 0, gap },
  ];

  const summaryBar = [
    { name: "Total Need", amount: totalNeed },
    { name: "Have", amount: existingCoverage },
    { name: "Gap", amount: gap },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))", gap: "0.75rem" }}>
        <KPI label="Recommended Coverage" value={fc(recommended)} sub="based on your profile" color={GOLD} icon={Shield} />
        <KPI label="Coverage Gap" value={fc(gap)} sub="currently unprotected" color={gap > 0 ? RED : GREEN} icon={AlertTriangle} />
        <KPI label="Est. Monthly Premium" value={fm(monthlyEst)} sub="20-yr term, gap coverage" color={BLUE} icon={DollarSign} />
        <KPI label="Dependents Protected" value={dependents} color={GREEN} icon={Users} />
        <KPI label="Income Years Covered" value={`${profile.incomeYears || 10}y`} color={TEAL} icon={Clock} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", gap: "1rem" }}>
        {/* Coverage gap chart */}
        <div className="t-card" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-1)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>Coverage Gap Analysis</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={summaryBar} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-3)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--text-3)" }} axisLine={false} tickLine={false} tickFormatter={v => fc(v)} />
              <Tooltip content={<CustomTip />} />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                <Cell fill={GOLD} />
                <Cell fill={GREEN} />
                <Cell fill={RED} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: "1rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
            {[{ l: "Total Need", v: fc(totalNeed), c: GOLD }, { l: "Current Coverage", v: fc(existingCoverage), c: GREEN }, { l: "Gap", v: fc(gap), c: RED }].map(x => (
              <div key={x.l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.62rem", color: "var(--text-3)" }}>{x.l}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontWeight: 900, color: x.c, fontSize: "0.9rem" }}>{x.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Score */}
        <div className="t-card" style={{ padding: "1.25rem 1rem 1rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
          <div style={{ fontSize: "0.62rem", fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Policy Health</div>
          <ScoreGauge score={score} size={140} />
        </div>
      </div>

      {/* Coverage breakdown */}
      {gapData.length > 0 && (
        <div className="t-card" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-1)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>Coverage Need Breakdown</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={gapData} layout="vertical" margin={{ left: 80 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: "var(--text-3)" }} axisLine={false} tickLine={false} tickFormatter={v => fc(v)} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "var(--text-2)" }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={<CustomTip />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {gapData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Quick recommendation */}
      <div className="t-card" style={{ padding: "1.25rem", borderLeft: `3px solid ${BLUE}` }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-1)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem" }}>Quick Recommendation</div>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          {[
            { l: "Policy Type", v: age < 45 ? "20-Year Term" : age < 55 ? "30-Year Term or Universal" : "Whole Life or Universal", c: BLUE },
            { l: "Coverage Amount", v: fc(recommended), c: GOLD },
            { l: "Est. Monthly Cost", v: fm(monthlyEst), c: GREEN },
            { l: "Best Action", v: gap > 0 ? "Get coverage now" : "Review existing policies", c: gap > 0 ? RED : GREEN },
          ].map(x => (
            <div key={x.l}>
              <div style={{ fontSize: "0.62rem", color: "var(--text-3)", marginBottom: "0.2rem" }}>{x.l}</div>
              <div style={{ fontWeight: 900, color: x.c, fontSize: "0.88rem" }}>{x.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TAB 2 — DIME COVERAGE CALCULATOR
═══════════════════════════════════════════════════════════════════ */
function TabCalculator({ profile, setProfile }) {
  const [step, setStep] = useState(0);
  const STEPS = ["Debt", "Income", "Mortgage", "Education", "Final Expenses", "Results"];

  const debt = profile.totalDebts || 0;
  const income = profile.annualIncome || 0;
  const years = profile.incomeYears || 10;
  const inflation = profile.inflation || 3;
  const mortgage = profile.mortgage || 0;
  const children = profile.children || 0;
  const childrenAges = profile.childrenAges || [];
  const costPerChild = profile.costPerChild || 60000;
  const funeral = profile.funeral || 15000;
  const estateSettlement = profile.estateSettlement || 5000;
  const existingCoverage = profile.existingCoverage || 0;

  const inflatedIncome = income * years * (1 + inflation / 100 / 2);
  const educationNeed = children * costPerChild;
  const totalNeed = debt + inflatedIncome + mortgage + educationNeed + funeral + estateSettlement;
  const gap = Math.max(0, totalNeed - existingCoverage);
  const recommended = Math.ceil(gap / 250000) * 250000 || 500000;

  const waterfall = [
    { name: "Debt", value: debt, cumulative: debt },
    { name: "Income", value: inflatedIncome, cumulative: debt + inflatedIncome },
    { name: "Mortgage", value: mortgage, cumulative: debt + inflatedIncome + mortgage },
    { name: "Education", value: educationNeed, cumulative: debt + inflatedIncome + mortgage + educationNeed },
    { name: "Final Exp", value: funeral + estateSettlement, cumulative: totalNeed },
  ];

  const F = ({ label, field, type = "number", placeholder = "0" }) => (
    <div>
      <div style={{ fontSize: "0.63rem", color: "var(--text-3)", marginBottom: 3 }}>{label}</div>
      <input type={type} className="t-input" value={profile[field] || ""} onChange={e => setProfile(p => ({ ...p, [field]: type === "number" ? Number(e.target.value) : e.target.value }))} placeholder={placeholder} style={{ width: "100%", fontSize: "0.8rem" }} />
    </div>
  );

  const stepContent = [
    /* DEBT */
    <div key="debt" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.5 }}>Enter all debts that would need to be paid off. This includes credit cards, auto loans, student loans, and any other obligations.</div>
      <F label="Total Debt (excluding mortgage) ($)" field="totalDebts" />
      <div style={{ padding: "0.75rem 1rem", background: BLUE + "18", borderRadius: 8, borderLeft: `3px solid ${BLUE}` }}>
        <div style={{ fontSize: "0.72rem", color: BLUE, fontWeight: 700 }}>DIME Step 1 — Debt</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.4rem", fontWeight: 900, color: BLUE }}>{fc(debt)}</div>
      </div>
    </div>,

    /* INCOME */
    <div key="inc" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.5 }}>How much annual income needs to be replaced, and for how many years? Factor in inflation to maintain purchasing power.</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.6rem" }}>
        <F label="Annual Income ($)" field="annualIncome" />
        <F label="Years to Replace" field="incomeYears" />
        <F label="Inflation Rate (%)" field="inflation" />
      </div>
      <div>
        <div style={{ fontSize: "0.7rem", color: "var(--text-3)", marginBottom: "0.4rem" }}>Years: {years}</div>
        <input type="range" min={5} max={30} value={years} onChange={e => setProfile(p => ({ ...p, incomeYears: Number(e.target.value) }))} style={{ width: "100%" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "var(--text-3)" }}><span>5 yrs</span><span>30 yrs</span></div>
      </div>
      <div style={{ padding: "0.75rem 1rem", background: GREEN + "18", borderRadius: 8, borderLeft: `3px solid ${GREEN}` }}>
        <div style={{ fontSize: "0.72rem", color: GREEN, fontWeight: 700 }}>DIME Step 2 — Income Replacement (inflation-adjusted)</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.4rem", fontWeight: 900, color: GREEN }}>{fc(inflatedIncome)}</div>
      </div>
    </div>,

    /* MORTGAGE */
    <div key="mort" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.5 }}>Enter the remaining balance on your mortgage so your family can stay in their home without financial stress.</div>
      <F label="Remaining Mortgage Balance ($)" field="mortgage" />
      <div style={{ padding: "0.75rem 1rem", background: TEAL + "18", borderRadius: 8, borderLeft: `3px solid ${TEAL}` }}>
        <div style={{ fontSize: "0.72rem", color: TEAL, fontWeight: 700 }}>DIME Step 3 — Mortgage</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.4rem", fontWeight: 900, color: TEAL }}>{fc(mortgage)}</div>
      </div>
    </div>,

    /* EDUCATION */
    <div key="edu" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.5 }}>Plan for your children's education. The average 4-year college costs $60,000–$120,000 depending on public vs private.</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
        <F label="Number of Children" field="children" />
        <F label="Est. Education Cost Per Child ($)" field="costPerChild" />
      </div>
      <div style={{ padding: "0.75rem 1rem", background: PURPLE + "18", borderRadius: 8, borderLeft: `3px solid ${PURPLE}` }}>
        <div style={{ fontSize: "0.72rem", color: PURPLE, fontWeight: 700 }}>DIME Step 4 — Education</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.4rem", fontWeight: 900, color: PURPLE }}>{fc(educationNeed)}</div>
      </div>
    </div>,

    /* FINAL EXPENSES */
    <div key="final" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.5 }}>The average funeral costs $8,000–$15,000. Estate settlement adds legal and administrative costs.</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
        <F label="Funeral & Burial ($)" field="funeral" />
        <F label="Estate Settlement Costs ($)" field="estateSettlement" />
      </div>
      <F label="Existing Life Insurance Coverage ($)" field="existingCoverage" />
      <div style={{ padding: "0.75rem 1rem", background: ORANGE + "18", borderRadius: 8, borderLeft: `3px solid ${ORANGE}` }}>
        <div style={{ fontSize: "0.72rem", color: ORANGE, fontWeight: 700 }}>Final Expenses</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.4rem", fontWeight: 900, color: ORANGE }}>{fc(funeral + estateSettlement)}</div>
      </div>
    </div>,

    /* RESULTS */
    <div key="res" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
        <KPI label="Total Coverage Need" value={fc(totalNeed)} color={GOLD} icon={Shield} />
        <KPI label="Coverage Gap" value={fc(gap)} color={gap > 0 ? RED : GREEN} icon={AlertTriangle} />
        <KPI label="Recommended Policy" value={fc(recommended)} color={BLUE} icon={Star} />
      </div>
      <div className="t-card" style={{ padding: "1.25rem" }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-1)", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>DIME Waterfall Breakdown</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={waterfall} margin={{ left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--text-3)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "var(--text-3)" }} axisLine={false} tickLine={false} tickFormatter={v => fc(v)} />
            <Tooltip content={<CustomTip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {waterfall.map((_, i) => <Cell key={i} fill={[BLUE, GREEN, TEAL, PURPLE, ORANGE][i]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {gap > 0 && (
        <div style={{ padding: "1rem 1.25rem", background: RED + "18", border: `1px solid ${RED}44`, borderRadius: 8 }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 800, color: RED, marginBottom: "0.4rem" }}>Coverage Gap: {fc(gap)}</div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-2)" }}>
            Estimated monthly premium to close this gap: <strong style={{ color: GREEN }}>{fm(estimatePremium(gap, profile.age || 35, profile.isSmoker, profile.healthClass || "Preferred", "term", 20))}</strong> (20-year term, {profile.healthClass || "Preferred"} health class)
          </div>
        </div>
      )}
    </div>,
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-1)", textTransform: "uppercase", letterSpacing: "0.08em" }}>DIME Coverage Calculator</div>
      <div style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>The DIME method (Debt · Income · Mortgage · Education) is the most comprehensive way to calculate how much life insurance you need.</div>

      {/* Step indicator */}
      <div style={{ display: "flex", gap: "0.25rem", alignItems: "center", overflowX: "auto" }}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <button onClick={() => setStep(i)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: i === step ? GOLD : i < step ? GREEN : "var(--elevated)", border: `1.5px solid ${i === step ? GOLD : i < step ? GREEN : "var(--border-c)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {i < step ? <Check size={13} color="#fff" /> : <span style={{ fontSize: "0.72rem", fontWeight: 900, color: i === step ? "#07080a" : "var(--text-3)" }}>{i + 1}</span>}
              </div>
              <span style={{ fontSize: "0.62rem", color: i === step ? GOLD : "var(--text-3)", fontWeight: i === step ? 700 : 400, whiteSpace: "nowrap" }}>{s}</span>
            </button>
            {i < STEPS.length - 1 && <div style={{ flex: 1, minWidth: 12, height: 1, background: i < step ? GREEN : "var(--border-c)" }} />}
          </React.Fragment>
        ))}
      </div>

      <div className="t-card" style={{ padding: "1.25rem" }}>
        {stepContent[step]}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="t-btn" style={{ fontSize: "0.75rem", opacity: step === 0 ? 0.4 : 1 }}>← Previous</button>
        <button onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))} disabled={step === STEPS.length - 1} className="t-btn" style={{ fontSize: "0.75rem", opacity: step === STEPS.length - 1 ? 0.4 : 1 }}>Next →</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TAB 3 — POLICY EXPLORER
═══════════════════════════════════════════════════════════════════ */
function TabPolicyExplorer() {
  const AGE_DATA = [25, 30, 35, 40, 45, 50, 55, 60].map(age => ({
    age, term: estimatePremium(500000, age, false, "Preferred", "term", 20),
    whole: estimatePremium(500000, age, false, "Preferred", "whole"),
  }));

  const IUL_HISTORY = [
    { year: "2009", sp: 26.5, iul: 10 }, { year: "2010", sp: 15.1, iul: 10 },
    { year: "2011", sp: 2.1, iul: 2.1 }, { year: "2012", sp: 16.0, iul: 10 },
    { year: "2013", sp: 32.4, iul: 10 }, { year: "2014", sp: 13.7, iul: 10 },
    { year: "2015", sp: 1.4, iul: 1.4 }, { year: "2016", sp: 12.0, iul: 10 },
    { year: "2017", sp: 21.8, iul: 10 }, { year: "2018", sp: -4.4, iul: 0 },
    { year: "2019", sp: 31.5, iul: 10 }, { year: "2020", sp: 18.4, iul: 10 },
    { year: "2021", sp: 28.7, iul: 10 }, { year: "2022", sp: -18.1, iul: 0 },
    { year: "2023", sp: 26.3, iul: 10 },
  ];

  const COMPARISON_TABLE = [
    { attr: "Monthly Premium ($500K)", term: "~$25", whole: "~$400", universal: "~$150", iul: "~$200", variable: "~$175" },
    { attr: "Cash Value", term: "None", whole: "Guaranteed", universal: "Interest-based", iul: "Index-linked", variable: "Market-based" },
    { attr: "Investment Component", term: "No", whole: "No", universal: "No", iul: "Yes (index)", variable: "Yes (subaccounts)" },
    { attr: "Flexibility", term: "Low", whole: "Low", universal: "High", iul: "Medium", variable: "Medium" },
    { attr: "Complexity", term: "Low", whole: "Low", universal: "Medium", iul: "High", variable: "High" },
    { attr: "Risk Level", term: "None", whole: "None", universal: "Low-Med", iul: "Low (floor=0%)", variable: "High" },
    { attr: "Tax Benefits", term: "Death benefit", whole: "DB + tax-deferred CV", universal: "DB + tax-deferred", iul: "DB + tax-deferred", variable: "DB + tax-deferred" },
    { attr: "Best For", term: "Most people", whole: "Estate planning", universal: "Flexible needs", iul: "Growth + protection", variable: "Risk-tolerant" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-1)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Policy Type Explorer</div>
      <div style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>Learn exactly how each type works — click any policy to expand the full explainer.</div>

      {/* TERM */}
      <ExpandCard title="Term Life Insurance" color={BLUE} badge="TERM" summary="Pure protection · Most affordable · Best for most people">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginTop: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.6, marginBottom: "0.75rem" }}>
              <strong style={{ color: BLUE }}>What it is:</strong> Term life insurance provides a death benefit for a fixed period (term) — typically 10, 15, 20, or 30 years. If you die during the term, your beneficiaries receive the payout. If you outlive the term, coverage ends and you receive nothing back.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "0.75rem" }}>
              {["Lowest cost for highest coverage", "Simple — easy to understand", "Level premiums guaranteed", "Ideal for income replacement", "Covers your family while dependents are young"].map((p, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-2)" }}><CheckCircle size={13} color={GREEN} style={{ flexShrink: 0, marginTop: 1 }} />{p}</div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {["No cash value accumulation", "Coverage ends at term expiration", "Premiums increase significantly upon renewal", "Cannot borrow against policy"].map((c, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-2)" }}><AlertTriangle size={13} color={ORANGE} style={{ flexShrink: 0, marginTop: 1 }} />{c}</div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "0.5rem" }}>PREMIUM BY AGE — $500K 20-YEAR TERM</div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={AGE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" />
                <XAxis dataKey="age" tick={{ fontSize: 10, fill: "var(--text-3)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--text-3)" }} axisLine={false} tickLine={false} tickFormatter={v => "$" + v} />
                <Tooltip content={<CustomTip />} />
                <Line type="monotone" dataKey="term" name="Term Premium" stroke={BLUE} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ marginTop: "0.6rem", padding: "0.6rem 0.75rem", background: BLUE + "18", borderRadius: 6 }}>
              <div style={{ fontSize: "0.7rem", color: BLUE, fontWeight: 700 }}>Real Example</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-2)", marginTop: "0.2rem" }}>35-year-old non-smoker, Preferred health, $500,000 policy = approximately <strong style={{ color: GREEN }}>$25–$35/month</strong></div>
            </div>
          </div>
        </div>
      </ExpandCard>

      {/* WHOLE LIFE */}
      <ExpandCard title="Whole Life Insurance" color={GOLD} badge="WHOLE LIFE" summary="Permanent · Cash value · Guaranteed · Higher cost">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginTop: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.6, marginBottom: "0.75rem" }}>
              <strong style={{ color: GOLD }}>What it is:</strong> Whole life provides permanent coverage — it never expires. Your premium is split between the insurance cost and a cash value account that grows at a guaranteed rate. Many policies also pay annual dividends.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "0.75rem" }}>
              {["Permanent — never expires", "Guaranteed cash value growth", "Can borrow against cash value tax-free", "Dividend-paying policies from top carriers", "Estate planning tool for high net worth"].map((p, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-2)" }}><CheckCircle size={13} color={GREEN} style={{ flexShrink: 0, marginTop: 1 }} />{p}</div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {["8–15x more expensive than term", "Cash value growth is slow early on", "Surrender charges if cancelled early", "Complex dividend structure"].map((c, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-2)" }}><AlertTriangle size={13} color={ORANGE} style={{ flexShrink: 0, marginTop: 1 }} />{c}</div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "0.5rem" }}>TERM VS WHOLE LIFE — PREMIUM COMPARISON</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={AGE_DATA.slice(1, 5)} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" />
                <XAxis dataKey="age" tick={{ fontSize: 10, fill: "var(--text-3)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--text-3)" }} axisLine={false} tickLine={false} tickFormatter={v => "$" + v} />
                <Tooltip content={<CustomTip />} />
                <Legend wrapperStyle={{ fontSize: "0.7rem" }} />
                <Bar dataKey="term" name="Term" fill={BLUE} radius={[3, 3, 0, 0]} />
                <Bar dataKey="whole" name="Whole Life" fill={GOLD} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </ExpandCard>

      {/* UNIVERSAL LIFE */}
      <ExpandCard title="Universal Life Insurance" color={PURPLE} badge="UNIVERSAL" summary="Permanent · Flexible premiums · Adjustable death benefit">
        <div style={{ marginTop: "1rem", fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.6, marginBottom: "0.75rem" }}>
          <strong style={{ color: PURPLE }}>What it is:</strong> Universal life separates the insurance cost from the savings component, giving you the flexibility to adjust premiums and death benefit over time. The cash value earns interest at a credited rate.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            {["Flexible premium payments", "Adjustable death benefit up or down", "Cash value earns credited interest rate", "Good for changing income situations"].map((p, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-2)", marginBottom: "0.35rem" }}><CheckCircle size={13} color={GREEN} style={{ flexShrink: 0, marginTop: 1 }} />{p}</div>
            ))}
          </div>
          <div>
            {["Policy can lapse if underfunded — major risk", "Interest credited rate can decrease", "More complex than term or whole life", "Requires monitoring to stay in force"].map((c, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-2)", marginBottom: "0.35rem" }}><AlertTriangle size={13} color={ORANGE} style={{ flexShrink: 0, marginTop: 1 }} />{c}</div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: "0.75rem", padding: "0.75rem 1rem", background: ORANGE + "18", border: `1px solid ${ORANGE}44`, borderRadius: 8 }}>
          <div style={{ fontSize: "0.72rem", color: ORANGE, fontWeight: 700 }}>⚠ Important Warning</div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-2)", marginTop: "0.2rem" }}>Universal life policies have lapsed on millions of policyholders who didn't pay enough premiums. Always run an in-force illustration before reducing payments.</div>
        </div>
      </ExpandCard>

      {/* IUL */}
      <ExpandCard title="Indexed Universal Life (IUL)" color={GREEN} badge="IUL" summary="Permanent · S&P 500 linked · Floor 0% · Cap ~10-12%">
        <div style={{ marginTop: "1rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.6, marginBottom: "0.75rem" }}>
            <strong style={{ color: GREEN }}>What it is:</strong> IUL links your cash value growth to a stock market index (like the S&P 500) with a floor (you can't lose money in a down market) and a cap (your gains are limited, typically 10–12% per year).
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "0.4rem" }}>S&P 500 ACTUAL VS IUL (FLOOR 0% / CAP 10%)</div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={IUL_HISTORY} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" />
                  <XAxis dataKey="year" tick={{ fontSize: 8, fill: "var(--text-3)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "var(--text-3)" }} axisLine={false} tickLine={false} tickFormatter={v => v + "%"} />
                  <Tooltip content={<CustomTip />} />
                  <ReferenceLine y={0} stroke="var(--text-3)" strokeDasharray="3 3" />
                  <Bar dataKey="sp" name="S&P 500" fill={BLUE} opacity={0.5} radius={[2, 2, 0, 0]} />
                  <Bar dataKey="iul" name="IUL Credit" fill={GREEN} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "0.75rem" }}>
                {["0% floor — never lose money in down markets", "Upside participation in market gains", "Tax-deferred cash value growth", "Tax-free loans against cash value", "Death benefit included"].map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-2)" }}><CheckCircle size={13} color={GREEN} style={{ flexShrink: 0, marginTop: 1 }} />{p}</div>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {["Caps limit upside (typically 10–12%)", "High internal fees reduce returns", "Very complex product", "Aggressive sales practices in industry"].map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-2)" }}><AlertTriangle size={13} color={ORANGE} style={{ flexShrink: 0, marginTop: 1 }} />{c}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ExpandCard>

      {/* VARIABLE */}
      <ExpandCard title="Variable Life Insurance" color={ORANGE} badge="VARIABLE" summary="Permanent · Investment subaccounts · Highest risk/reward">
        <div style={{ marginTop: "1rem", fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.6, marginBottom: "0.75rem" }}>
          <strong style={{ color: ORANGE }}>What it is:</strong> Variable life lets you invest your cash value in stock/bond subaccounts (similar to mutual funds). Your death benefit and cash value fluctuate with market performance — meaning you can lose money.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>{["Highest potential cash value growth", "Wide investment selection", "Can outperform all other types in bull market"].map((p, i) => <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-2)", marginBottom: "0.35rem" }}><CheckCircle size={13} color={GREEN} style={{ flexShrink: 0, marginTop: 1 }} />{p}</div>)}</div>
          <div>{["Death benefit can decrease with poor performance", "Highest fees of all policy types", "Requires active investment management", "Securities license required to sell"].map((c, i) => <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-2)", marginBottom: "0.35rem" }}><AlertTriangle size={13} color={ORANGE} style={{ flexShrink: 0, marginTop: 1 }} />{c}</div>)}</div>
        </div>
      </ExpandCard>

      {/* Comparison table */}
      <div className="t-card" style={{ padding: "1.25rem" }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-1)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>Side-by-Side Comparison</div>
        <div style={{ overflowX: "auto" }}>
          <table className="t-table" style={{ width: "100%", minWidth: 640 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Feature</th>
                <th style={{ color: BLUE }}>TERM</th>
                <th style={{ color: GOLD }}>WHOLE</th>
                <th style={{ color: PURPLE }}>UNIVERSAL</th>
                <th style={{ color: GREEN }}>IUL</th>
                <th style={{ color: ORANGE }}>VARIABLE</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_TABLE.map(row => (
                <tr key={row.attr}>
                  <td style={{ fontSize: "0.75rem", color: "var(--text-2)", fontWeight: 600 }}>{row.attr}</td>
                  <td style={{ fontSize: "0.75rem", color: BLUE }}>{row.term}</td>
                  <td style={{ fontSize: "0.75rem", color: GOLD }}>{row.whole}</td>
                  <td style={{ fontSize: "0.75rem", color: PURPLE }}>{row.universal}</td>
                  <td style={{ fontSize: "0.75rem", color: GREEN }}>{row.iul}</td>
                  <td style={{ fontSize: "0.75rem", color: ORANGE }}>{row.variable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TAB 4 — RECOMMENDATION ENGINE
═══════════════════════════════════════════════════════════════════ */
function TabRecommendation({ profile, setProfile }) {
  const rec = useMemo(() => {
    const age = profile.age || 35;
    const goal = profile.goal || "income replacement";
    const budget = profile.budget || 100;
    const perm = profile.needPermanent === "permanent";
    const estateGoal = goal === "estate planning";
    const wealthGoal = goal === "wealth building";

    let primary, secondary, reason, altReason;
    if (estateGoal || age > 55) {
      primary = "whole"; reason = "Permanent coverage with guaranteed cash value is ideal for estate planning. The policy will be in force whenever you pass, ensuring your estate plan is funded.";
      secondary = "iul"; altReason = "IUL offers permanent coverage with market-linked growth potential — a good alternative if you want more upside in the cash value.";
    } else if (wealthGoal && budget > 300) {
      primary = "iul"; reason = "With your wealth building goal and adequate budget, IUL provides permanent protection plus tax-advantaged growth linked to market indexes with a 0% floor.";
      secondary = "whole"; altReason = "Whole life provides guaranteed, conservative growth with dividends — lower upside but fully guaranteed.";
    } else if (perm && budget > 150) {
      primary = "universal"; reason = "Universal life gives you permanent protection with premium flexibility — important if your income varies or is expected to change.";
      secondary = "term"; altReason = "If budget is a concern, a 30-year term provides coverage through most of your working years at a fraction of the cost.";
    } else {
      primary = "term"; reason = "Term life is the right choice for the vast majority of people. It provides the highest coverage at the lowest cost — freeing money to invest elsewhere.";
      secondary = age > 40 ? "universal" : "iul"; altReason = age > 40 ? "If you want permanent coverage, Universal Life is a flexible option that won't lock in high whole-life premiums." : "If you want a permanent option with growth potential, IUL is worth exploring once your term coverage is in place.";
    }

    const termLength = age < 35 ? 30 : age < 45 ? 20 : age < 55 ? 15 : 10;
    const income = profile.annualIncome || 75000;
    const deps = profile.dependents || 2;
    const coverage = Math.max(500000, income * 10 + (profile.totalDebts || 0) + (deps * 60000));
    const recommended = Math.ceil(coverage / 250000) * 250000;

    const healthClass = profile.healthStatus === "Excellent" ? "Preferred Plus" : profile.healthStatus === "Good" ? "Preferred" : profile.healthStatus === "Fair" ? "Standard Plus" : "Standard";
    const monthlyEst = estimatePremium(recommended, age, profile.isSmoker, healthClass, primary, primary === "term" ? termLength : 0);

    const carriers = primary === "term"
      ? ["Banner Life", "Protective Life", "Pacific Life", "Prudential", "Lincoln Financial"]
      : primary === "whole"
        ? ["Northwestern Mutual", "New York Life", "MassMutual", "Guardian Life", "Penn Mutual"]
        : ["Pacific Life", "Nationwide", "North American", "Transamerica", "Allianz"];

    const radarData = [
      { axis: "Cost Efficiency", term: 95, whole: 30, universal: 55, iul: 50, variable: 45 },
      { axis: "Coverage Amount", term: 95, whole: 70, universal: 80, iul: 80, variable: 80 },
      { axis: "Cash Value", term: 0, whole: 90, universal: 70, iul: 80, variable: 85 },
      { axis: "Flexibility", term: 25, whole: 20, universal: 90, iul: 70, variable: 75 },
      { axis: "Simplicity", term: 95, whole: 75, universal: 50, iul: 30, variable: 20 },
      { axis: "Tax Benefits", term: 40, whole: 80, universal: 75, iul: 85, variable: 80 },
    ];

    return { primary, secondary, reason, altReason, termLength, recommended, monthlyEst, healthClass, carriers, radarData };
  }, [profile]);

  const F = ({ label, field, type = "number", placeholder = "", opts }) => (
    <div>
      <div style={{ fontSize: "0.63rem", color: "var(--text-3)", marginBottom: 3 }}>{label}</div>
      {opts ? (
        <select className="t-input" value={profile[field] || ""} onChange={e => setProfile(p => ({ ...p, [field]: e.target.value }))} style={{ width: "100%", fontSize: "0.8rem" }}>
          <option value="">Select…</option>
          {opts.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} className="t-input" value={profile[field] || ""} onChange={e => setProfile(p => ({ ...p, [field]: type === "number" ? Number(e.target.value) : e.target.value }))} placeholder={placeholder} style={{ width: "100%", fontSize: "0.8rem" }} />
      )}
    </div>
  );

  const pNames = { term: "Term Life", whole: "Whole Life", universal: "Universal Life", iul: "Indexed Universal Life", variable: "Variable Life" };
  const pColors = POLICY_COLOR;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-1)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Personalized Recommendation</div>

      {/* Profile form */}
      <div className="t-card" style={{ padding: "1.25rem" }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", marginBottom: "0.75rem" }}>Your Profile</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))", gap: "0.6rem" }}>
          <F label="Age" field="age" placeholder="35" />
          <F label="Annual Income ($)" field="annualIncome" placeholder="75000" />
          <F label="Number of Dependents" field="dependents" placeholder="2" />
          <F label="Total Debts ($)" field="totalDebts" placeholder="0" />
          <F label="Monthly Premium Budget ($)" field="budget" placeholder="100" />
          <F label="Gender" field="gender" opts={["Male", "Female"]} />
          <F label="Health Status" field="healthStatus" opts={["Excellent", "Good", "Fair", "Poor"]} />
          <F label="Primary Goal" field="goal" opts={["income replacement", "wealth building", "estate planning", "business protection", "final expenses"]} />
          <F label="Coverage Duration" field="needPermanent" opts={["temporary (term)", "permanent", "not sure"]} />
          <div>
            <div style={{ fontSize: "0.63rem", color: "var(--text-3)", marginBottom: 3 }}>Smoker?</div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {["Yes", "No"].map(v => <button key={v} onClick={() => setProfile(p => ({ ...p, isSmoker: v === "Yes" }))} style={{ flex: 1, padding: "0.4rem", borderRadius: 4, border: `1px solid ${((v === "Yes") === !!profile.isSmoker) ? GOLD : "var(--border-c)"}`, background: ((v === "Yes") === !!profile.isSmoker) ? GOLD + "22" : "none", color: ((v === "Yes") === !!profile.isSmoker) ? GOLD : "var(--text-3)", fontSize: "0.78rem", cursor: "pointer" }}>{v}</button>)}
            </div>
          </div>
        </div>
      </div>

      {/* Radar chart */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1rem" }}>
        <div className="t-card" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "0.75rem" }}>POLICY FIT ANALYSIS</div>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={rec.radarData}>
              <PolarGrid stroke="var(--border-c)" />
              <PolarAngleAxis dataKey="axis" tick={{ fontSize: 9, fill: "var(--text-3)" }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
              {["term", "whole", "universal", "iul"].map(t => (
                <Radar key={t} name={pNames[t]} dataKey={t} stroke={pColors[t]} fill={pColors[t]} fillOpacity={rec.primary === t ? 0.25 : 0.05} strokeWidth={rec.primary === t ? 2.5 : 1} />
              ))}
              <Legend wrapperStyle={{ fontSize: "0.7rem" }} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Recommendation cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div className="t-card" style={{ padding: "1.25rem", borderTop: `3px solid ${pColors[rec.primary]}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Star size={14} color={GOLD} />
              <span style={{ fontSize: "0.65rem", fontWeight: 700, color: GOLD, textTransform: "uppercase" }}>Primary Recommendation</span>
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 900, color: pColors[rec.primary], marginBottom: "0.4rem" }}>{pNames[rec.primary]}</div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-2)", lineHeight: 1.5, marginBottom: "0.6rem" }}>{rec.reason}</div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <div><div style={{ fontSize: "0.62rem", color: "var(--text-3)" }}>Coverage</div><div style={{ fontWeight: 900, color: GOLD, fontFamily: "var(--font-mono)" }}>{fc(rec.recommended)}</div></div>
              {rec.primary === "term" && <div><div style={{ fontSize: "0.62rem", color: "var(--text-3)" }}>Term</div><div style={{ fontWeight: 900, color: BLUE }}>{rec.termLength} years</div></div>}
              <div><div style={{ fontSize: "0.62rem", color: "var(--text-3)" }}>Est. Monthly</div><div style={{ fontWeight: 900, color: GREEN, fontFamily: "var(--font-mono)" }}>{fm(rec.monthlyEst)}</div></div>
              <div><div style={{ fontSize: "0.62rem", color: "var(--text-3)" }}>Health Class</div><div style={{ fontWeight: 700, color: "var(--text-2)" }}>{rec.healthClass}</div></div>
            </div>
          </div>

          <div className="t-card" style={{ padding: "1.25rem", borderTop: `3px solid ${pColors[rec.secondary]}` }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", marginBottom: "0.4rem" }}>Alternative Option</div>
            <div style={{ fontSize: "0.9rem", fontWeight: 800, color: pColors[rec.secondary], marginBottom: "0.35rem" }}>{pNames[rec.secondary]}</div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-2)", lineHeight: 1.5 }}>{rec.altReason}</div>
          </div>

          <div className="t-card" style={{ padding: "1.25rem" }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", marginBottom: "0.5rem" }}>Top Carriers for Your Profile</div>
            {rec.carriers.map((c, i) => (
              <div key={c} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.3rem 0", borderBottom: i < rec.carriers.length - 1 ? "1px solid var(--border-c)" : "none" }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: GOLD + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.62rem", fontWeight: 900, color: GOLD }}>{i + 1}</div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-1)" }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TAB 5 — PREMIUM CALCULATOR
═══════════════════════════════════════════════════════════════════ */
function TabPremiumCalc() {
  const [coverage, setCoverage] = useState(500000);
  const [age, setAge] = useState(35);
  const [termYears, setTermYears] = useState(20);
  const [gender, setGender] = useState("Male");
  const [healthClass, setHealthClass] = useState("Preferred");
  const [isSmoker, setIsSmoker] = useState(false);
  const [pType, setPType] = useState("term");

  const monthly = estimatePremium(coverage, age, isSmoker, healthClass, pType, termYears);
  const annual = monthly * 12;
  const totalPaid = pType === "term" ? monthly * termYears * 12 : monthly * 12 * 20;
  const costPer1k = ((monthly * 12) / (coverage / 1000)).toFixed(2);

  const CARRIERS = [
    { name: "Banner Life", mult: 1.0 }, { name: "Protective Life", mult: 1.02 }, { name: "Pacific Life", mult: 1.05 },
    { name: "Prudential", mult: 1.08 }, { name: "Lincoln Financial", mult: 1.10 }, { name: "Northwestern Mutual", mult: 1.15 },
    { name: "New York Life", mult: 1.18 }, { name: "MassMutual", mult: 1.20 },
  ];
  const carrierData = CARRIERS.map(c => ({ name: c.name.split(" ")[0], est: Math.round(monthly * c.mult) }));

  const ageData = [25, 30, 35, 40, 45, 50, 55, 60].map(a => ({
    age: a, premium: estimatePremium(coverage, a, isSmoker, healthClass, pType, termYears),
  }));

  const waitData = [0, 1, 2, 3, 5].map(w => ({
    wait: `Wait ${w}yr`, monthly: estimatePremium(coverage, age + w, isSmoker, healthClass, pType, termYears),
  }));

  const S = ({ label, value, onChange, min, max, step = 1, fmt = v => v }) => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.63rem", color: "var(--text-3)", marginBottom: 3 }}>
        <span>{label}</span><span style={{ color: GOLD, fontWeight: 700 }}>{fmt(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} style={{ width: "100%" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.62rem", color: "var(--text-3)" }}><span>{fmt(min)}</span><span>{fmt(max)}</span></div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-1)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Premium Calculator</div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "1.25rem", alignItems: "start" }}>
        {/* Controls */}
        <div className="t-card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase" }}>Calculator Inputs</div>

          <div>
            <div style={{ fontSize: "0.63rem", color: "var(--text-3)", marginBottom: 3 }}>Policy Type</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
              {Object.entries({ term: "Term", whole: "Whole", universal: "Universal", iul: "IUL" }).map(([k, v]) => (
                <button key={k} onClick={() => setPType(k)} style={{ padding: "3px 10px", borderRadius: 99, border: `1px solid ${pType === k ? POLICY_COLOR[k] : "var(--border-c)"}`, background: pType === k ? POLICY_COLOR[k] + "22" : "none", color: pType === k ? POLICY_COLOR[k] : "var(--text-3)", fontSize: "0.7rem", cursor: "pointer" }}>{v}</button>
              ))}
            </div>
          </div>

          <S label="Coverage Amount" value={coverage} onChange={setCoverage} min={100000} max={5000000} step={50000} fmt={fc} />
          <S label="Your Age" value={age} onChange={setAge} min={18} max={75} fmt={v => v + " yrs"} />
          {pType === "term" && <S label="Term Length" value={termYears} onChange={setTermYears} min={10} max={30} step={5} fmt={v => v + " yrs"} />}

          <div>
            <div style={{ fontSize: "0.63rem", color: "var(--text-3)", marginBottom: 3 }}>Health Class</div>
            <select className="t-input" value={healthClass} onChange={e => setHealthClass(e.target.value)} style={{ width: "100%", fontSize: "0.8rem" }}>
              {["Preferred Plus", "Preferred", "Standard Plus", "Standard", "Substandard"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["Male", "Female"].map(g => <button key={g} onClick={() => setGender(g)} style={{ flex: 1, padding: "0.4rem", borderRadius: 4, border: `1px solid ${gender === g ? BLUE : "var(--border-c)"}`, background: gender === g ? BLUE + "22" : "none", color: gender === g ? BLUE : "var(--text-3)", fontSize: "0.75rem", cursor: "pointer" }}>{g}</button>)}
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["Non-Smoker", "Smoker"].map(s => {
              const sel = (s === "Smoker") === isSmoker;
              return <button key={s} onClick={() => setIsSmoker(s === "Smoker")} style={{ flex: 1, padding: "0.4rem", borderRadius: 4, border: `1px solid ${sel ? RED : "var(--border-c)"}`, background: sel ? RED + "22" : "none", color: sel ? RED : "var(--text-3)", fontSize: "0.72rem", cursor: "pointer" }}>{s}</button>;
            })}
          </div>
        </div>

        {/* Results */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.6rem" }}>
            <KPI label="Monthly Premium" value={fm(monthly)} color={GREEN} icon={DollarSign} />
            <KPI label="Annual Premium" value={fc(annual)} color={GOLD} icon={TrendingUp} />
            <KPI label={`Total Paid (${pType === "term" ? termYears + " yr" : "20 yr est."})`} value={fc(totalPaid)} color={BLUE} icon={Calculator} />
            <KPI label="Cost per $1K Coverage" value={"$" + costPer1k} color={TEAL} icon={Star} />
          </div>

          <div className="t-card" style={{ padding: "1.25rem" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "0.75rem" }}>ESTIMATED CARRIER COMPARISON</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={carrierData} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "var(--text-3)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--text-3)" }} axisLine={false} tickLine={false} tickFormatter={v => "$" + v} />
                <Tooltip content={<CustomTip />} />
                <Bar dataKey="est" name="Est. Monthly" fill={BLUE} radius={[3, 3, 0, 0]}>
                  {carrierData.map((_, i) => <Cell key={i} fill={i === 0 ? GREEN : BLUE} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ fontSize: "0.68rem", color: "var(--text-3)", marginTop: "0.4rem" }}>* Estimated rates only. Actual quotes require underwriting. Get multiple quotes before buying.</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div className="t-card" style={{ padding: "1.25rem" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "0.75rem" }}>COST OF WAITING</div>
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={waitData} margin={{ left: -10 }}>
                  <XAxis dataKey="wait" tick={{ fontSize: 9, fill: "var(--text-3)" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={<CustomTip />} />
                  <Bar dataKey="monthly" name="Monthly Premium" fill={ORANGE} radius={[3, 3, 0, 0]}>
                    {waitData.map((_, i) => <Cell key={i} fill={i === 0 ? GREEN : i < 2 ? GOLD : i < 4 ? ORANGE : RED} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="t-card" style={{ padding: "1.25rem" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "0.75rem" }}>PREMIUM BY AGE</div>
              <ResponsiveContainer width="100%" height={130}>
                <LineChart data={ageData} margin={{ left: -10 }}>
                  <XAxis dataKey="age" tick={{ fontSize: 9, fill: "var(--text-3)" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={<CustomTip />} />
                  <ReferenceLine x={age} stroke={GOLD} strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="premium" name="Monthly" stroke={BLUE} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TAB 6 — CASH VALUE GROWTH PROJECTOR
═══════════════════════════════════════════════════════════════════ */
function TabCashValue() {
  const [age, setAge] = useState(35);
  const [coverage, setCoverage] = useState(500000);
  const [projYears, setProjYears] = useState(30);
  const [returnRate, setReturnRate] = useState(8);

  const termMonthly  = estimatePremium(coverage, age, false, "Preferred", "term", 20);
  const wholeMonthly = estimatePremium(coverage, age, false, "Preferred", "whole");
  const iulMonthly   = estimatePremium(coverage, age, false, "Preferred", "iul");
  const univMonthly  = estimatePremium(coverage, age, false, "Preferred", "universal");

  const wholeAnnual = wholeMonthly * 12;
  const iulAnnual   = iulMonthly   * 12;
  const termAnnual  = termMonthly  * 12;
  const diffAnnual  = wholeAnnual - termAnnual;

  const projectionData = useMemo(() => Array.from({ length: projYears + 1 }, (_, yr) => {
    // Whole life: heavy front-load costs, guaranteed ~4% on net amount at risk
    const wholeCV = yr < 2
      ? wholeAnnual * yr * 0.08
      : wholeAnnual * 0.35 * ((Math.pow(1.045, yr - 1) - 1) / 0.045) + wholeAnnual * yr * 0.12;

    // IUL: moderate front-load, avg ~7% credited (cap 10%, floor 0%)
    const iulCV = yr < 2
      ? iulAnnual * yr * 0.05
      : iulAnnual * 0.45 * ((Math.pow(1.07, yr - 1) - 1) / 0.07);

    // Term + Invest the difference at chosen rate
    const btid = diffAnnual > 0
      ? diffAnnual * ((Math.pow(1 + returnRate / 100, yr) - 1) / (returnRate / 100))
      : 0;

    return {
      year: yr,
      age: age + yr,
      whole: Math.round(Math.max(0, wholeCV)),
      iul:   Math.round(Math.max(0, iulCV)),
      btid:  Math.round(Math.max(0, btid)),
    };
  }), [age, coverage, projYears, returnRate, wholeAnnual, iulAnnual, diffAnnual]);

  const breakEvenWhole = projectionData.find(d => d.year > 0 && d.btid > d.whole);
  const breakEvenIUL   = projectionData.find(d => d.year > 0 && d.btid > d.iul);
  const finalYear      = projectionData[projectionData.length - 1];

  const S = ({ label, value, onChange, min, max, step = 1, fmt = v => v }) => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.63rem", color: "var(--text-3)", marginBottom: 3 }}>
        <span>{label}</span><span style={{ color: GOLD, fontWeight: 700 }}>{fmt(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} style={{ width: "100%" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.62rem", color: "var(--text-3)" }}><span>{fmt(min)}</span><span>{fmt(max)}</span></div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-1)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Cash Value Growth Projector</div>
      <div style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>
        Compare how cash value builds in permanent policies vs investing the premium difference in the market. Values are educational estimates — not guaranteed illustrations.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "1.25rem", alignItems: "start" }}>
        {/* Controls */}
        <div className="t-card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase" }}>Inputs</div>
          <S label="Current Age" value={age} onChange={setAge} min={25} max={60} fmt={v => v + " yrs"} />
          <S label="Coverage Amount" value={coverage} onChange={setCoverage} min={100000} max={2000000} step={50000} fmt={fc} />
          <S label="Projection Period" value={projYears} onChange={setProjYears} min={10} max={40} fmt={v => v + " yrs"} />
          <S label="Market Return (invest scenario)" value={returnRate} onChange={setReturnRate} min={4} max={12} fmt={v => v + "%"} />

          <div style={{ borderTop: "1px solid var(--border-c)", paddingTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <div style={{ fontSize: "0.65rem", color: "var(--text-3)", fontWeight: 700, textTransform: "uppercase" }}>Est. Monthly Premiums</div>
            {[
              { label: "Term (20-yr)", monthly: termMonthly, color: BLUE },
              { label: "Universal Life", monthly: univMonthly, color: PURPLE },
              { label: "IUL", monthly: iulMonthly, color: GREEN },
              { label: "Whole Life", monthly: wholeMonthly, color: GOLD },
            ].map(p => (
              <div key={p.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem" }}>
                <span style={{ color: p.color }}>{p.label}</span>
                <span style={{ color: "var(--text-2)", fontFamily: "var(--font-mono)" }}>{fm(p.monthly)}</span>
              </div>
            ))}
            {diffAnnual > 0 && (
              <div style={{ marginTop: "0.25rem", padding: "0.5rem 0.6rem", background: BLUE + "18", borderRadius: 6, fontSize: "0.68rem", color: BLUE }}>
                Term vs Whole savings: <strong>{fm(wholeMonthly - termMonthly)}/mo</strong> to invest
              </div>
            )}
          </div>
        </div>

        {/* Charts + KPIs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div className="t-card" style={{ padding: "1.25rem" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "0.75rem" }}>
              PROJECTED VALUE OVER {projYears} YEARS
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={projectionData} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" />
                <XAxis dataKey="age" tick={{ fontSize: 10, fill: "var(--text-3)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--text-3)" }} axisLine={false} tickLine={false} tickFormatter={v => fc(v)} />
                <Tooltip content={<CustomTip />} />
                <Legend wrapperStyle={{ fontSize: "0.7rem" }} />
                <Line type="monotone" dataKey="whole" name="Whole Life CV" stroke={GOLD}  strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="iul"   name="IUL Cash Value" stroke={GREEN} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="btid"  name={`Term + Invest (${returnRate}%)`} stroke={BLUE}  strokeWidth={2.5} dot={false} strokeDasharray="6 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.6rem" }}>
            <KPI label={`Whole Life (yr ${projYears})`} value={fc(finalYear.whole)} color={GOLD}  icon={Shield} sub="guaranteed growth" />
            <KPI label={`IUL (yr ${projYears})`}        value={fc(finalYear.iul)}   color={GREEN} icon={TrendingUp} sub="index-linked est." />
            <KPI label={`Term+Invest (yr ${projYears})`} value={fc(finalYear.btid)}  color={BLUE}  icon={Zap} sub={`at ${returnRate}% return`} />
          </div>

          {/* Break-even */}
          <div className="t-card" style={{ padding: "1.25rem" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-1)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>Break-Even Analysis</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                { label: "Term + Invest overtakes Whole Life", data: breakEvenWhole, refColor: GOLD },
                { label: "Term + Invest overtakes IUL",        data: breakEvenIUL,   refColor: GREEN },
              ].map(({ label, data, refColor }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0.75rem", background: "var(--elevated)", borderRadius: 6, borderLeft: `3px solid ${data ? BLUE : refColor}` }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-2)" }}>{label}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 900, color: data ? BLUE : refColor, fontSize: "0.82rem" }}>
                    {data ? `Year ${data.year} (age ${data.age})` : `Not within ${projYears} yrs`}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ padding: "0.75rem 1rem", background: BLUE + "18", borderRadius: 8, borderLeft: `3px solid ${BLUE}`, fontSize: "0.72rem", color: "var(--text-2)", lineHeight: 1.5 }}>
                <strong style={{ color: BLUE }}>If you invest the difference:</strong> Term + investing typically wins long-term at market returns. This works best for disciplined investors who will actually invest every month.
              </div>
              <div style={{ padding: "0.75rem 1rem", background: GOLD + "18", borderRadius: 8, borderLeft: `3px solid ${GOLD}`, fontSize: "0.72rem", color: "var(--text-2)", lineHeight: 1.5 }}>
                <strong style={{ color: GOLD }}>If you won't invest the difference:</strong> Whole life acts as forced savings. The guaranteed cash value is better than nothing invested — which is what most people actually do.
              </div>
            </div>
          </div>

          {/* Side-by-side 20yr snapshot */}
          <div className="t-card" style={{ padding: "1.25rem" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "0.75rem" }}>YEAR-BY-YEAR SNAPSHOT</div>
            <div style={{ overflowX: "auto" }}>
              <table className="t-table" style={{ width: "100%", minWidth: 420 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Year</th>
                    <th style={{ color: "var(--text-3)" }}>Age</th>
                    <th style={{ color: GOLD }}>Whole Life CV</th>
                    <th style={{ color: GREEN }}>IUL CV</th>
                    <th style={{ color: BLUE }}>Term + Invest</th>
                  </tr>
                </thead>
                <tbody>
                  {projectionData.filter(d => d.year > 0 && d.year % 5 === 0).map(d => (
                    <tr key={d.year}>
                      <td style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>{d.year}</td>
                      <td style={{ fontSize: "0.75rem", color: "var(--text-2)" }}>{d.age}</td>
                      <td style={{ fontSize: "0.75rem", color: GOLD,  fontFamily: "var(--font-mono)", fontWeight: 700 }}>{fc(d.whole)}</td>
                      <td style={{ fontSize: "0.75rem", color: GREEN, fontFamily: "var(--font-mono)", fontWeight: 700 }}>{fc(d.iul)}</td>
                      <td style={{ fontSize: "0.75rem", color: BLUE,  fontFamily: "var(--font-mono)", fontWeight: 700 }}>{fc(d.btid)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TAB 7 — MY POLICIES
═══════════════════════════════════════════════════════════════════ */
function TabMyPolicies({ policies, setPolicies }) {
  const [adding, setAdding] = useState(false);
  const blank = { company: "", type: "term", policyNumber: "", deathBenefit: "", premium: "", startDate: "", endDate: "", cashValue: "", beneficiaries: "", riders: "", notes: "" };
  const [form, setForm] = useState(blank);

  const save = () => {
    if (!form.company || !form.deathBenefit) return;
    setPolicies(prev => [...prev, { ...form, id: `p${Date.now()}`, deathBenefit: Number(form.deathBenefit), premium: Number(form.premium), cashValue: Number(form.cashValue || 0) }]);
    setForm(blank); setAdding(false);
  };
  const remove = (id) => setPolicies(prev => prev.filter(p => p.id !== id));

  const totalCoverage = policies.reduce((s, p) => s + (p.deathBenefit || 0), 0);
  const totalPremium = policies.reduce((s, p) => s + (p.premium || 0), 0);
  const totalCV = policies.reduce((s, p) => s + (p.cashValue || 0), 0);

  const timelineData = policies.filter(p => p.type === "term" && p.endDate).map(p => ({
    name: p.company, benefit: p.deathBenefit, end: p.endDate,
  }));

  const F = ({ label, field, type = "text", placeholder = "", opts }) => (
    <div>
      <div style={{ fontSize: "0.63rem", color: "var(--text-3)", marginBottom: 3 }}>{label}</div>
      {opts ? (
        <select className="t-input" value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} style={{ width: "100%", fontSize: "0.8rem" }}>
          {opts.map(o => <option key={o} value={o.toLowerCase().replace(/ /g, "_")}>{o}</option>)}
        </select>
      ) : (
        <input type={type} className="t-input" value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} placeholder={placeholder} style={{ width: "100%", fontSize: "0.8rem" }} />
      )}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-1)", textTransform: "uppercase", letterSpacing: "0.08em" }}>My Policies</div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-3)", marginTop: "0.2rem" }}>{policies.length} polic{policies.length !== 1 ? "ies" : "y"} tracked</div>
        </div>
        <button className="t-btn" onClick={() => { setForm(blank); setAdding(v => !v); }} style={{ fontSize: "0.72rem", display: "flex", alignItems: "center", gap: 4 }}><Plus size={11} />Add Policy</button>
      </div>

      {(totalCoverage > 0 || policies.length > 0) && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.75rem" }}>
          <KPI label="Total Coverage" value={fc(totalCoverage)} color={GREEN} icon={Shield} />
          <KPI label="Total Monthly Premium" value={fm(totalPremium)} color={GOLD} icon={DollarSign} />
          <KPI label="Total Cash Value" value={fc(totalCV)} color={PURPLE} icon={TrendingUp} />
        </div>
      )}

      {adding && (
        <div className="t-card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.6rem" }}>
            <F label="Insurance Company" field="company" placeholder="e.g. Northwestern Mutual" />
            <F label="Policy Type" field="type" opts={["Term", "Whole Life", "Universal Life", "IUL", "Variable"]} />
            <F label="Policy Number" field="policyNumber" placeholder="(optional)" />
            <F label="Death Benefit ($)" field="deathBenefit" type="number" placeholder="500000" />
            <F label="Monthly Premium ($)" field="premium" type="number" placeholder="35" />
            <F label="Cash Value ($)" field="cashValue" type="number" placeholder="0" />
            <F label="Policy Start Date" field="startDate" type="date" />
            <F label="Policy End Date (if term)" field="endDate" type="date" />
            <F label="Primary Beneficiary" field="beneficiaries" placeholder="Full name" />
            <div style={{ gridColumn: "1/-1" }}>
              <F label="Riders Included" field="riders" placeholder="e.g. Waiver of Premium, Accelerated Death Benefit" />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <F label="Notes" field="notes" placeholder="Any additional details…" />
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
            <button className="t-btn" onClick={save} style={{ fontSize: "0.75rem" }}>Save Policy</button>
            <button onClick={() => setAdding(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", fontSize: "0.75rem" }}>Cancel</button>
          </div>
        </div>
      )}

      {policies.length === 0 ? <Empty msg="No policies tracked yet. Add your existing life insurance policies to see your complete coverage picture." action="Add Policy" onAction={() => setAdding(true)} /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: "0.75rem" }}>
          {policies.map(p => {
            const typeKey = p.type?.toLowerCase().replace(/ /g, "_") || "term";
            const col = typeKey.includes("term") ? BLUE : typeKey.includes("whole") ? GOLD : typeKey.includes("iul") ? GREEN : typeKey.includes("variable") ? ORANGE : PURPLE;
            const isExpiringSoon = p.endDate && new Date(p.endDate) < new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
            return (
              <div key={p.id} className="t-card" style={{ padding: "1rem 1.25rem", borderTop: `3px solid ${col}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-1)" }}>{p.company}</div>
                    <div style={{ fontSize: "0.68rem", color: col, fontWeight: 700, marginTop: "0.1rem" }}>{p.type}</div>
                  </div>
                  <button onClick={() => remove(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)" }}><Trash2 size={12} /></button>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.2rem", fontWeight: 900, color: col, marginBottom: "0.4rem" }}>{fc(p.deathBenefit)}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", fontSize: "0.72rem", color: "var(--text-3)" }}>
                  {p.premium > 0 && <span>Premium: <strong style={{ color: "var(--text-2)" }}>{fm(p.premium)}</strong></span>}
                  {p.cashValue > 0 && <span>Cash Value: <strong style={{ color: GREEN }}>{fc(p.cashValue)}</strong></span>}
                  {p.startDate && <span>Started: {p.startDate}</span>}
                  {p.endDate && <span>Expires: <strong style={{ color: isExpiringSoon ? RED : "var(--text-2)" }}>{p.endDate}</strong></span>}
                  {p.beneficiaries && <span>Beneficiary: {p.beneficiaries}</span>}
                </div>
                {isExpiringSoon && (
                  <div style={{ marginTop: "0.5rem", fontSize: "0.68rem", color: RED, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <AlertTriangle size={11} />Expiring within 12 months — take action
                  </div>
                )}
                {p.riders && <div style={{ marginTop: "0.4rem", fontSize: "0.65rem", color: "var(--text-3)" }}>Riders: {p.riders}</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TAB 8 — RIDERS GUIDE
═══════════════════════════════════════════════════════════════════ */
function TabRiders() {
  const RIDERS = [
    { name: "Waiver of Premium", cost: "+5–15%", color: BLUE, who: "Anyone with a physically demanding job or disability risk", desc: "If you become totally disabled and unable to work, the insurance company waives your premiums — keeping your policy in force at no cost to you.", good: ["Keeps coverage active during disability", "Premiums waived — significant savings", "No impact to death benefit"], bad: ["Added cost", "Strict disability definition required", "Limited to under certain ages"] },
    { name: "Accelerated Death Benefit", cost: "Usually free", color: GREEN, who: "Everyone — this should always be included", desc: "If diagnosed with a terminal illness (typically 12–24 month life expectancy), you can access a portion of your death benefit while still alive to cover medical expenses and end-of-life costs.", good: ["Usually included at no charge", "Access benefits when you need them most", "Can cover home care, hospice, or treatment"], bad: ["Reduces death benefit paid to family", "Taxable in some situations", "Definition of terminal illness varies by carrier"] },
    { name: "Child Term Rider", cost: "+$5–25/mo", color: TEAL, who: "Parents with young children", desc: "Provides a small death benefit for all children under one affordable rider on the parent's policy. Typically convertible to a permanent policy when the child reaches adulthood with no medical exam.", good: ["Covers all current and future children", "Affordable — one rider covers all kids", "Convertible to permanent at adulthood"], bad: ["Low coverage amount (typically $10K–$25K)", "Terminates when children reach adulthood"] },
    { name: "Accidental Death Benefit", cost: "+$5–30/mo", color: ORANGE, who: "Active individuals, frequent travelers, high-risk occupations", desc: "Doubles (or sometimes triples) the death benefit if death occurs due to a covered accident. Also called a 'double indemnity' rider.", good: ["Doubles payout for accidental death", "Very affordable addition", "Provides extra protection for young families"], bad: ["Only covers accidents — not illness", "Many exclusions (war, aviation, extreme sports)", "Most deaths are from illness, not accidents"] },
    { name: "Return of Premium", cost: "+50–100% more", color: PURPLE, who: "People who want coverage with a 'safety net'", desc: "If you outlive your term policy, all premiums paid are returned to you. Turns life insurance into a forced savings vehicle — you either get a death benefit or your money back.", good: ["Premiums returned if you outlive term", "'Win either way' value proposition", "Forces savings discipline"], bad: ["Significantly higher premiums", "Better returns available by investing the difference", "Money returned with no interest"] },
    { name: "Long Term Care Rider", cost: "+$50–200/mo", color: GOLD, who: "Ages 45+ planning for retirement", desc: "Allows you to accelerate your death benefit to pay for long-term care costs if you cannot perform two of six Activities of Daily Living (ADLs). Combines life insurance and LTC coverage.", good: ["Covers nursing home and home care costs", "Premiums may be tax-deductible", "Avoids separate expensive LTC policy"], bad: ["Complex and expensive", "Reduces death benefit when used", "Underwriting requirements"] },
    { name: "Guaranteed Insurability", cost: "+$20–60/mo", color: RED, who: "Young people who may need more coverage later", desc: "Allows you to purchase additional coverage at specified future dates (marriage, child birth, age milestones) without a new medical exam — regardless of health changes.", good: ["Buy more coverage without medical exam", "Critical if health may deteriorate", "Locks in your insurability"], bad: ["Limited to specific option dates", "Coverage amounts per option are limited", "Added cost even if never used"] },
    { name: "Term Conversion", cost: "Usually free", color: TEAL, who: "Anyone with a term policy under age 60", desc: "Allows you to convert part or all of your term policy to a permanent policy before the conversion deadline — without a new medical exam. Extremely valuable if your health changes.", good: ["Locked in regardless of health changes", "Usually included at no extra cost", "Maintains insurability for life"], bad: ["Must convert before deadline (varies by carrier)", "Permanent policy will cost significantly more", "Available policies at conversion may be limited"] },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-1)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Policy Riders Guide</div>
      <div style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>Riders are optional add-ons that customize your policy. Click any rider to see full details.</div>
      {RIDERS.map(r => (
        <ExpandCard key={r.name} title={r.name} color={r.color} badge={r.cost} summary={r.who}>
          <div style={{ marginTop: "1rem" }}>
            <div style={{ fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.6, marginBottom: "0.75rem" }}>{r.desc}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, color: GREEN, marginBottom: "0.4rem" }}>Benefits</div>
                {r.good.map((g, i) => <div key={i} style={{ display: "flex", gap: "0.4rem", fontSize: "0.75rem", color: "var(--text-2)", marginBottom: "0.25rem" }}><CheckCircle size={12} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} />{g}</div>)}
              </div>
              <div>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, color: ORANGE, marginBottom: "0.4rem" }}>Considerations</div>
                {r.bad.map((b, i) => <div key={i} style={{ display: "flex", gap: "0.4rem", fontSize: "0.75rem", color: "var(--text-2)", marginBottom: "0.25rem" }}><AlertTriangle size={12} color={ORANGE} style={{ flexShrink: 0, marginTop: 2 }} />{b}</div>)}
              </div>
            </div>
          </div>
        </ExpandCard>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TAB 9 — EDUCATION
═══════════════════════════════════════════════════════════════════ */
function TabEducation() {
  const TOPICS = [
    {
      title: "How Underwriting Works", color: BLUE, icon: "🔍",
      steps: ["Submit application with health and lifestyle info", "Insurance company orders medical records", "Possible medical exam (blood draw, height/weight, blood pressure)", "Underwriter reviews all information", "Health classification assigned (Preferred Plus → Substandard)", "Policy issued with your rate", "30-day free-look period to review and cancel"],
      insight: "Being honest on your application is critical — misrepresentation can void your policy. Contestability periods typically last 2 years."
    },
    {
      title: "Tax Benefits of Life Insurance", color: GREEN, icon: "💰",
      steps: ["Death benefit paid income-tax-free to beneficiaries (IRC §101)", "Cash value grows on a tax-deferred basis", "Policy loans are income-tax-free (not a withdrawal)", "LIRP strategy: fund policy to MEC limits for retirement income", "No RMDs required unlike IRA/401(k)", "Used in estate planning to pay estate taxes tax-efficiently"],
      insight: "Life insurance is one of the last remaining tax-advantaged vehicles. The death benefit bypass of income tax is one of the most powerful wealth transfer tools available."
    },
    {
      title: "Buy Term and Invest the Difference", color: GOLD, icon: "📊",
      steps: ["Buy the largest term policy you can afford", "Calculate savings vs whole life premium", "Invest the difference in index funds (e.g., S&P 500)", "Over 20-30 years, investment account may dwarf whole life cash value", "At end of term, may be self-insured from accumulated wealth", "This strategy works best for disciplined investors"],
      insight: "Dave Ramsey famously advocates this approach. The math often favors 'BTID' for those who will actually invest the difference. Those who won't invest need to consider whole life as forced savings."
    },
    {
      title: "Life Insurance as Retirement Income (LIRP)", color: PURPLE, icon: "🏦",
      steps: ["Overfund a permanent policy (IUL or whole life) without making it a MEC", "Cash value accumulates tax-deferred", "In retirement, take tax-free loans against cash value", "Loans don't count as income — no effect on Social Security taxation", "No contribution limits unlike IRA or 401(k)", "Death benefit repays loans at death"],
      insight: "LIRPs are powerful for high earners who have maxed tax-advantaged accounts. Complexity and fees make them unsuitable for most people — consult a fee-only financial advisor."
    },
    {
      title: "Business Life Insurance Uses", color: ORANGE, icon: "🏢",
      steps: ["Key Man Insurance: protects business if a critical employee dies", "Buy-Sell Agreement Funding: funds buyout of deceased partner's share", "Executive Bonus Plan: business pays premium as deductible compensation", "Group Term Life: employee benefit, up to $50K tax-free", "COLI: company-owned life insurance for deferred compensation funding"],
      insight: "Business uses of life insurance can be highly tax-efficient. Key man and buy-sell policies protect business continuity and are essential for any business with partners or key employees."
    },
    {
      title: "Life Insurance Mistakes to Avoid", color: RED, icon: "⚠️",
      steps: ["Buying too little coverage (underinsuring to save on premiums)", "Not buying early enough (premiums double every 10 years)", "Naming a minor as direct beneficiary (court-appointed guardian controls)", "Forgetting to update beneficiaries after major life events", "Letting a policy lapse before replacement is in force", "Purchasing a policy with high surrender charges without reading terms", "Buying only employer-provided group term (non-portable, inadequate)"],
      insight: "The biggest mistake is having no coverage at all. Even a small policy is better than nothing. Review your coverage every 3–5 years or after any major life event."
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-1)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Education Center</div>
      {TOPICS.map(t => (
        <ExpandCard key={t.title} title={t.title} color={t.color} badge={t.icon} summary="">
          <div style={{ marginTop: "0.75rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.75rem" }}>
              {t.steps.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: t.color + "22", border: `1px solid ${t.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.62rem", fontWeight: 900, color: t.color, flexShrink: 0 }}>{i + 1}</div>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: "0.75rem 1rem", background: t.color + "18", borderRadius: 8, borderLeft: `3px solid ${t.color}` }}>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, color: t.color, marginBottom: "0.25rem" }}>Key Insight</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-2)", lineHeight: 1.5 }}>{t.insight}</div>
            </div>
          </div>
        </ExpandCard>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TAB 10 — ACTION PLAN
═══════════════════════════════════════════════════════════════════ */
function TabActionPlan({ profile, policies }) {
  const age = profile.age || 35;
  const hasCoverage = policies.length > 0;
  const totalCoverage = policies.reduce((s, p) => s + (p.deathBenefit || 0), 0);
  const income = profile.annualIncome || 75000;
  const gap = Math.max(0, income * 10 - totalCoverage);

  const LIFE_STAGES = [
    { age: "25–34", icon: "🎓", label: "Early Career", coverage: "5–7× income", why: "Starting out, may have student debt and first dependents. Cheapest time to buy." },
    { age: "35–44", icon: "👨‍👩‍👧", label: "Family Building", coverage: "10–12× income", why: "Peak dependency years. Mortgage, children's education, spouse income replacement all at maximum need." },
    { age: "45–54", icon: "🏠", label: "Wealth Accumulation", coverage: "8–10× income", why: "Debts declining, wealth building. Consider permanent coverage for estate planning." },
    { age: "55–64", icon: "📈", label: "Pre-Retirement", coverage: "5–8× income", why: "Final working years. Focus on ensuring retirement isn't derailed if you die prematurely." },
    { age: "65+", icon: "🌅", label: "Retirement", coverage: "Final expense + estate", why: "If self-insured, small final expense policy or permanent policy for estate transfer may be all that's needed." },
  ];

  const steps = [
    ...(gap > 0 ? [{ p: "CRITICAL", text: `Close your ${fc(gap)} coverage gap immediately`, detail: "You have dependents relying on income you cannot replace if you die. Get quotes today.", color: RED }] : []),
    ...(!hasCoverage ? [{ p: "CRITICAL", text: "Get life insurance coverage as soon as possible", detail: "Every day without coverage is a risk to your family's financial security.", color: RED }] : []),
    { p: "HIGH", text: "Get quotes from at least 3 different carriers", detail: "Premiums vary 30–50% between carriers for the same coverage. Always compare.", color: ORANGE },
    { p: "HIGH", text: "Have a licensed independent broker shop your case", detail: "Independent brokers represent multiple companies and can find you the best rate for your health profile.", color: ORANGE },
    { p: "MEDIUM", text: "Gather these documents before applying", detail: "Driver's license, SSN, beneficiary information, existing policy details, physician contact info, list of medications.", color: GOLD },
    { p: "MEDIUM", text: "Review and update beneficiary designations annually", detail: "After marriage, divorce, or birth of a child — your beneficiary designations must be updated.", color: GOLD },
    { p: "STANDARD", text: "Ask these questions before buying", detail: "Is the carrier AM Best rated A or better? What's the conversion privilege on term? What riders are included? What's the free-look period?", color: BLUE },
    { p: "STANDARD", text: "Schedule an annual policy review", detail: "Life changes. Review your coverage every year or after any major life event.", color: BLUE },
  ];

  const exportPlan = () => {
    const html = `<!DOCTYPE html><html><head><title>Life Insurance Action Plan</title><style>body{font-family:Arial,sans-serif;background:#07080a;color:#e2e8f0;max-width:900px;margin:40px auto;padding:20px}h1{color:#c9a84c}h2{color:#4c9fcf;border-bottom:1px solid #333;padding-bottom:8px}table{width:100%;border-collapse:collapse}td,th{padding:8px 12px;border:1px solid #333;font-size:13px}th{background:#1a1d24;color:#c9a84c}.critical{color:#e05c5c}.high{color:#e07c3a}.medium{color:#c9a84c}</style></head><body>
    <h1>Life Insurance Action Plan</h1><p>Generated: ${new Date().toLocaleDateString()}</p>
    <h2>Your Profile</h2>
    <table><tr><th>Age</th><td>${profile.age || "—"}</td><th>Annual Income</th><td>${fc(profile.annualIncome || 0)}</td></tr>
    <tr><th>Dependents</th><td>${profile.dependents || 0}</td><th>Total Coverage</th><td>${fc(totalCoverage)}</td></tr>
    <tr><th>Coverage Gap</th><td colspan="3" style="color:${gap > 0 ? "#e05c5c" : "#4caf7d"}">${fc(gap)}</td></tr></table>
    <h2>Action Steps</h2>${steps.map(s => `<p class="${s.p.toLowerCase()}"><strong>[${s.p}]</strong> ${s.text}<br><small>${s.detail}</small></p>`).join("")}
    <h2>Coverage by Life Stage</h2><table><tr><th>Age</th><th>Stage</th><th>Recommended Coverage</th><th>Why</th></tr>
    ${LIFE_STAGES.map(s => `<tr><td>${s.age}</td><td>${s.icon} ${s.label}</td><td>${s.coverage}</td><td>${s.why}</td></tr>`).join("")}</table>
    <p style="margin-top:40px;font-size:11px;color:#666">For educational purposes only. Not insurance advice. Work with a licensed insurance professional.</p></body></html>`;
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([html], { type: "text/html" })); a.download = "life-insurance-action-plan.html"; a.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-1)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Your Action Plan</div>
        <button className="t-btn" onClick={exportPlan} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.72rem" }}><Download size={12} />Export Plan</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: "1rem", padding: "0.85rem 1.1rem", background: "var(--elevated)", borderRadius: 8, borderLeft: `3px solid ${s.color}` }}>
            <Badge label={s.p} color={s.color} />
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-1)", marginBottom: "0.2rem" }}>{s.text}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-3)", lineHeight: 1.4 }}>{s.detail}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="t-card" style={{ padding: "1.25rem" }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-1)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>Coverage by Life Stage</div>
        <div style={{ display: "flex", gap: 0, position: "relative" }}>
          <div style={{ position: "absolute", top: 20, left: "10%", right: "10%", height: 2, background: "var(--border-c)" }} />
          {LIFE_STAGES.map((s, i) => {
            const inStage = (age >= parseInt(s.age) && age <= parseInt(s.age.split("–")[1] || "99"));
            return (
              <div key={s.age} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", position: "relative", zIndex: 1 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: inStage ? GOLD + "33" : "var(--elevated)", border: `2px solid ${inStage ? GOLD : "var(--border-c)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>{s.icon}</div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "0.65rem", fontWeight: 700, color: inStage ? GOLD : "var(--text-3)" }}>{s.age}</div>
                  <div style={{ fontSize: "0.62rem", color: inStage ? "var(--text-1)" : "var(--text-3)", fontWeight: inStage ? 700 : 400 }}>{s.label}</div>
                  <div style={{ fontSize: "0.62rem", color: GREEN }}>{s.coverage}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "0.75rem 1rem", background: "var(--elevated)", borderRadius: 8, fontSize: "0.68rem", color: "var(--text-3)", textAlign: "center", lineHeight: 1.6 }}>
        This tool is for educational purposes only and does not constitute insurance advice. Rates shown are estimates only. Work with a licensed insurance professional to obtain actual quotes and policy recommendations.
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
const TABS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "calculator", label: "Coverage Calculator", icon: Calculator },
  { key: "explorer", label: "Policy Explorer", icon: BookOpen },
  { key: "recommendation", label: "My Recommendation", icon: Star },
  { key: "premium", label: "Premium Calculator", icon: DollarSign },
  { key: "cashvalue", label: "Growth Projector", icon: TrendingUp },
  { key: "policies", label: "My Policies", icon: FileText },
  { key: "riders", label: "Riders Guide", icon: Shield },
  { key: "education", label: "Education", icon: GraduationCap },
  { key: "action", label: "Action Plan", icon: ArrowRight },
];

export default function LifeInsurance() {
  const [tab, setTab] = useState("dashboard");
  const [profile, setProfile] = useLS("li_profile", { age: 35, annualIncome: 75000, dependents: 2, incomeYears: 10, inflation: 3, mortgage: 200000, children: 2, costPerChild: 60000, funeral: 15000, estateSettlement: 5000, existingCoverage: 0, healthStatus: "Good", isSmoker: false, goal: "income replacement", budget: 100 });
  const [policies, setPolicies] = useLS("li_policies", []);

  const render = () => {
    switch (tab) {
      case "dashboard": return <TabDashboard profile={profile} policies={policies} />;
      case "calculator": return <TabCalculator profile={profile} setProfile={setProfile} />;
      case "explorer": return <TabPolicyExplorer />;
      case "recommendation": return <TabRecommendation profile={profile} setProfile={setProfile} />;
      case "premium": return <TabPremiumCalc />;
      case "cashvalue": return <TabCashValue />;
      case "policies": return <TabMyPolicies policies={policies} setPolicies={setPolicies} />;
      case "riders": return <TabRiders />;
      case "education": return <TabEducation />;
      case "action": return <TabActionPlan profile={profile} policies={policies} />;
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
                <HeartPulse size={14} style={{ color: "var(--gold)" }} />
              </div>
              <h1 className="t-page-title" style={{ margin: 0 }}>LIFE INSURANCE</h1>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.65, maxWidth: 560, margin: "0 0 1rem" }}>
              Understand exactly how much life insurance you need and what it should cost. Compare policy types, calculate your coverage gap, and get a clear picture of your family's protection.
            </p>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              {["Term & Whole Life", "Need Analysis", "Coverage Calculator", "Premium Estimator"].map((label) => (
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
              { icon: Calculator, label: "Coverage Calculator", sub: "How much do you need?", color: "#3b82f6" },
              { icon: FileText, label: "Policy Comparison", sub: "Term vs. whole vs. UL", color: "var(--gold)" },
              { icon: HeartPulse, label: "Need Analysis", sub: "Income replacement model", color: "var(--teal)" },
              { icon: DollarSign, label: "Premium Estimator", sub: "Age & health-based quotes", color: "#f59e0b" },
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

      <div style={{ display: "flex", gap: "0.2rem", background: "var(--surface)", padding: "0.3rem", borderRadius: 8, border: "1px solid var(--border-c)", overflowX: "auto" }}>
        {TABS.map(t => {
          const active = tab === t.key;
          return (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.4rem 0.75rem", borderRadius: 6, border: "none", cursor: "pointer", background: active ? GOLD : "none", color: active ? "#07080a" : "var(--text-3)", fontWeight: active ? 800 : 500, fontSize: "0.72rem", whiteSpace: "nowrap", transition: "all 0.15s", flexShrink: 0 }}>
              <t.icon size={12} />{t.label}
            </button>
          );
        })}
      </div>

      {render()}
    </div>
  );
}
