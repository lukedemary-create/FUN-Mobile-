import React, { useState, useMemo } from "react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
  ResponsiveContainer, Legend, Cell,
} from "recharts";
import { AlertTriangle, CheckCircle, TrendingUp, Wallet, Target, Clock, Info, Sparkles } from "lucide-react";

/* ─── Constants ──────────────────────────────────────────────────── */
const INFLATION = 0.03;
const GOLD = "#c9a84c";
const GREEN = "#22c55e";
const RED = "#ef4444";
const BLUE = "#3b82f6";
const ORANGE = "#f97316";

/* ─── Formatting ─────────────────────────────────────────────────── */
const fmt$ = (n) => {
  if (n === null || isNaN(n)) return "—";
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
};
const fmtFull = (n) =>
  n === null || isNaN(n) ? "—" : "$" + Math.round(n).toLocaleString();
const fmtPct = (n, dec = 1) => (n >= 0 ? "+" : "") + n.toFixed(dec) + "%";

/* ─── Slider ─────────────────────────────────────────────────────── */
function Slider({ label, value, onChange, min, max, step = 0.5, suffix = "%", note }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: "0.875rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: "0.6875rem", color: "var(--text-3)", fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: "0.75rem", fontFamily: "monospace", fontWeight: 700, color: GOLD }}>
          {value}{suffix}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: GOLD }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <span style={{ fontSize: "0.5rem", color: "var(--text-3)" }}>{min}{suffix}</span>
        {note && <span style={{ fontSize: "0.5rem", color: "var(--text-3)", textAlign: "center" }}>{note}</span>}
        <span style={{ fontSize: "0.5rem", color: "var(--text-3)" }}>{max}{suffix}</span>
      </div>
    </div>
  );
}

/* ─── Input field ────────────────────────────────────────────────── */
function Field({ label, value, onChange, prefix, suffix, type = "number", min, note, tooltip }) {
  return (
    <div style={{ marginBottom: "0.875rem" }}>
      <label style={{ fontSize: "0.6875rem", color: "var(--text-3)", fontWeight: 600, display: "flex", alignItems: "center", marginBottom: 4 }}>
        {label}{tooltip && <InfoTooltip text={tooltip} />}
      </label>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {prefix && (
          <span style={{
            position: "absolute", left: 9, fontSize: "0.75rem",
            color: "var(--text-3)", pointerEvents: "none", zIndex: 1,
          }}>{prefix}</span>
        )}
        <input
          type={type} value={value} min={min}
          onChange={e => onChange(e.target.value)}
          style={{
            width: "100%", background: "var(--bg)", border: "1px solid var(--border-c)",
            borderRadius: 6, padding: prefix ? "7px 8px 7px 20px" : "7px 10px",
            fontSize: "0.8125rem", color: "var(--text-1)", outline: "none",
            fontFamily: "monospace",
          }}
        />
        {suffix && (
          <span style={{ position: "absolute", right: 9, fontSize: "0.75rem", color: "var(--text-3)" }}>
            {suffix}
          </span>
        )}
      </div>
      {note && <div style={{ fontSize: "0.5625rem", color: "var(--text-3)", marginTop: 3 }}>{note}</div>}
    </div>
  );
}

/* ─── Section header ─────────────────────────────────────────────── */
function SectionTitle({ children, icon: Icon, color = GOLD }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "0.5rem",
      marginBottom: "0.875rem", paddingBottom: "0.5rem",
      borderBottom: "1px solid var(--border-c)",
    }}>
      {Icon && <Icon size={14} style={{ color }} />}
      <span style={{ fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.1em",
        textTransform: "uppercase", color: "var(--text-2)" }}>{children}</span>
    </div>
  );
}

/* ─── Tooltip ────────────────────────────────────────────────────── */
function InfoTooltip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <button
        onClick={() => setShow(s => !s)}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        style={{
          width: 15, height: 15, borderRadius: '50%', border: '1px solid var(--text-3)',
          background: 'transparent', color: 'var(--text-3)', fontSize: '0.5rem', fontWeight: 800,
          cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          marginLeft: 5, flexShrink: 0, lineHeight: 1,
        }}
      >?</button>
      {show && (
        <div style={{
          position: 'absolute', bottom: '120%', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--elevated)', border: '1px solid var(--border-c)', borderRadius: 8,
          padding: '8px 12px', fontSize: '0.6875rem', color: 'var(--text-2)', lineHeight: 1.5,
          width: 240, zIndex: 100, boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          pointerEvents: 'none',
        }}>
          {text}
        </div>
      )}
    </span>
  );
}

/* ─── Stat Card ──────────────────────────────────────────────────── */
function StatCard({ label, value, sub, color = GOLD, highlight = false }) {
  return (
    <div style={{
      background: "var(--bg)", borderRadius: 8, padding: "0.875rem 1rem",
      border: `1px solid ${highlight ? color + "50" : "var(--border-c)"}`,
      borderTop: highlight ? `3px solid ${color}` : "1px solid var(--border-c)",
    }}>
      <div style={{ fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase",
        color: "var(--text-3)", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: "1.375rem", fontWeight: 800, fontFamily: "monospace",
        color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: "0.6875rem", color: "var(--text-3)", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

/* ─── TVM Core Calculation ───────────────────────────────────────── */
function runTVM(inputs) {
  const {
    currentAge, retirementAge, lifeExpectancy,
    currentSavings, monthlyContrib,
    monthlyExpenses, otherMonthlyIncome,
    accumReturn, retireReturn,
  } = inputs;

  const n_accum = retirementAge - currentAge;          // years to retirement
  const n_retire = lifeExpectancy - retirementAge;     // years in retirement
  if (n_accum <= 0 || n_retire <= 0) return null;

  const r_accum = accumReturn / 100;
  const r_retire = retireReturn / 100;
  const r_accum_monthly = Math.pow(1 + r_accum, 1 / 12) - 1;
  const n_months = n_accum * 12;

  /* ── Accumulation Phase ── */
  // FV of lump sum + annuity (monthly contributions)
  const fv_savings = currentSavings * Math.pow(1 + r_accum, n_accum);
  const fv_contrib = monthlyContrib * (Math.pow(1 + r_accum_monthly, n_months) - 1) / r_accum_monthly;
  const projectedCorpus = fv_savings + fv_contrib;

  /* ── Retirement Expenses (inflated to retirement date) ── */
  const annualExpensesToday = monthlyExpenses * 12;
  const annualExpensesRetirement = annualExpensesToday * Math.pow(1 + INFLATION, n_accum);
  const otherIncomeRetirement = otherMonthlyIncome * 12 * Math.pow(1 + INFLATION, n_accum);
  const annualWithdrawal = Math.max(0, annualExpensesRetirement - otherIncomeRetirement);

  /* ── Corpus Needed: PV of inflation-growing annuity ── */
  // Growing annuity PV: PMT / (r - g) × [1 - ((1+g)/(1+r))^n]
  // where g = inflation, r = retire return, PMT = first year withdrawal
  let corpusNeeded;
  if (Math.abs(r_retire - INFLATION) < 0.0001) {
    corpusNeeded = annualWithdrawal * n_retire;
  } else {
    corpusNeeded = (annualWithdrawal / (r_retire - INFLATION)) *
      (1 - Math.pow((1 + INFLATION) / (1 + r_retire), n_retire));
  }

  /* ── Gap Analysis ── */
  const surplus = projectedCorpus - corpusNeeded;
  const onTrack = surplus >= 0;

  // Additional monthly savings needed to close gap
  let additionalMonthlyNeeded = 0;
  if (!onTrack) {
    const gap = -surplus;
    additionalMonthlyNeeded = gap * r_accum_monthly / (Math.pow(1 + r_accum_monthly, n_months) - 1);
  }

  /* ── Monthly Income at Retirement ── */
  const monthlyIncomeYear1 = annualWithdrawal / 12;

  /* ── Safe Withdrawal Rate implied ── */
  const impliedSWR = projectedCorpus > 0 ? (annualWithdrawal / projectedCorpus) * 100 : 0;

  /* ── Years Money Will Last (simulate) ── */
  let yearsMoney = 0;
  {
    let bal = projectedCorpus;
    for (let y = 0; y < 200; y++) {
      const draw = annualWithdrawal * Math.pow(1 + INFLATION, y);
      bal = bal * (1 + r_retire) - draw;
      yearsMoney = y + 1;
      if (bal <= 0) break;
      if (y >= 100) { yearsMoney = 999; break; } // effectively infinite
    }
  }

  /* ── Breakeven point ── */
  // Age at which portfolio runs out
  const portfolioRunsOutAge = yearsMoney < 999 ? retirementAge + yearsMoney : null;

  /* ── Year-by-year chart data ── */
  const chartData = [];

  // Accumulation
  let bal = currentSavings;
  for (let y = 0; y <= n_accum; y++) {
    const totalContribSoFar = currentSavings + monthlyContrib * 12 * y;
    chartData.push({
      age: currentAge + y,
      balance: Math.round(bal),
      contributions: Math.round(Math.min(totalContribSoFar, bal)),
      growth: Math.round(Math.max(0, bal - totalContribSoFar)),
      phase: "Accumulation",
      corpusLine: null,
    });
    // Grow for next year
    const r_m = r_accum_monthly;
    bal = bal * (1 + r_accum) + monthlyContrib * 12; // simple annual approximation for chart
    // More precise: monthly compounding
    bal = currentSavings * Math.pow(1 + r_accum, y + 1) +
      monthlyContrib * (Math.pow(1 + r_m, (y + 1) * 12) - 1) / r_m;
  }

  // Retirement phase
  bal = projectedCorpus;
  for (let y = 1; y <= n_retire; y++) {
    const draw = annualWithdrawal * Math.pow(1 + INFLATION, y - 1);
    bal = bal * (1 + r_retire) - draw;
    chartData.push({
      age: retirementAge + y,
      balance: Math.round(Math.max(0, bal)),
      contributions: 0,
      growth: 0,
      phase: "Retirement",
      corpusLine: Math.round(Math.max(0, bal)),
    });
    if (bal <= 0) break;
  }

  /* ── Corpus needed at retirement breakdown ── */
  const totalContributions = currentSavings + monthlyContrib * 12 * n_accum;
  const investmentGrowth = projectedCorpus - totalContributions;

  /* ── Today's dollar equivalents ── */
  const corpusNeededToday = corpusNeeded / Math.pow(1 + INFLATION, n_accum);
  const projectedCorpusToday = projectedCorpus / Math.pow(1 + INFLATION, n_accum);

  return {
    n_accum, n_retire,
    projectedCorpus, corpusNeeded,
    surplus, onTrack,
    additionalMonthlyNeeded,
    annualWithdrawal, monthlyIncomeYear1,
    impliedSWR, yearsMoney, portfolioRunsOutAge,
    totalContributions, investmentGrowth,
    corpusNeededToday, projectedCorpusToday,
    annualExpensesRetirement, otherIncomeRetirement,
    chartData,
  };
}

/* ─── Custom Chart Tooltip ────────────────────────────────────────── */
const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload;
  return (
    <div style={{
      background: "var(--elevated)", border: "1px solid var(--border-c)",
      borderRadius: 8, padding: "10px 14px", fontSize: "0.6875rem",
    }}>
      <div style={{ color: GOLD, fontWeight: 700, marginBottom: 6 }}>Age {label}</div>
      <div style={{ color: "var(--text-2)", marginBottom: 2 }}>
        Balance: <strong style={{ fontFamily: "monospace" }}>{fmtFull(p?.balance)}</strong>
      </div>
      <div style={{ fontSize: "0.5625rem", color: p?.phase === "Retirement" ? RED : GREEN }}>
        {p?.phase} Phase
      </div>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────── */
export default function RetirementCalc() {
  /* Inputs */
  const [currentAge, setCurrentAge] = useState("35");
  const [retirementAge, setRetirementAge] = useState("65");
  const [lifeExpectancy, setLifeExpectancy] = useState("90");
  const [currentSavings, setCurrentSavings] = useState("75000");
  const [monthlyContrib, setMonthlyContrib] = useState("1500");
  const [otherMonthlyIncome, setOtherMonthlyIncome] = useState("2000");
  const [accumReturn, setAccumReturn] = useState(7);
  const [retireReturn, setRetireReturn] = useState(5);
  const [calculated, setCalculated] = useState(false);

  const [currentIncome, setCurrentIncome] = useState("8000");
  const [essentialSpending, setEssentialSpending] = useState("3000");
  const [discretionarySpending, setDiscretionarySpending] = useState("2000");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  const results = useMemo(() => {
    if (!calculated) return null;
    const essential = parseFloat(essentialSpending) || 0;
    const discretionary = parseFloat(discretionarySpending) || 0;
    return runTVM({
      currentAge: parseInt(currentAge) || 35,
      retirementAge: parseInt(retirementAge) || 65,
      lifeExpectancy: parseInt(lifeExpectancy) || 90,
      currentSavings: parseFloat(currentSavings) || 0,
      monthlyContrib: parseFloat(monthlyContrib) || 0,
      monthlyExpenses: essential + discretionary,
      otherMonthlyIncome: parseFloat(otherMonthlyIncome) || 0,
      accumReturn,
      retireReturn,
    });
  }, [calculated, currentAge, retirementAge, lifeExpectancy, currentSavings,
    monthlyContrib, essentialSpending, discretionarySpending, otherMonthlyIncome, accumReturn, retireReturn]);

  async function generateAiAnalysis(inputs, tvmResult) {
    setAiLoading(true);
    setAiAnalysis(null);
    await new Promise(r => setTimeout(r, 1200));

    const { essential, discretionary, income, otherIncome, n_accum } = inputs;
    const totalExpenses = essential + discretionary;
    const incomeReplacement = income > 0 ? (totalExpenses / income * 100) : 0;
    const targetIncome = income * 0.75; // 75% replacement
    const essentialOnly = essential;

    // Which scenario is closest to on-track?
    const scenarioIncome = runTVM({ ...inputs, monthlyExpenses: targetIncome / 12 });
    const scenarioFull = runTVM({ ...inputs, monthlyExpenses: totalExpenses });
    const scenarioEssential = runTVM({ ...inputs, monthlyExpenses: essentialOnly });

    const recommended = scenarioIncome.onTrack ? 'income' : scenarioEssential.onTrack ? 'essential' : 'full';

    const analysis = {
      recommended,
      incomeReplacement: incomeReplacement.toFixed(0),
      scenarioIncome, scenarioFull, scenarioEssential,
      targetIncome,
      insights: [],
    };

    if (incomeReplacement < 70) {
      analysis.insights.push({ type: 'good', text: `Your spending is ${incomeReplacement.toFixed(0)}% of income — below the 70-80% replacement target. You may need less than you think to retire comfortably.` });
    } else if (incomeReplacement > 90) {
      analysis.insights.push({ type: 'warn', text: `Your spending is ${incomeReplacement.toFixed(0)}% of income. Consider which discretionary expenses you'd eliminate in retirement to reduce your number.` });
    }

    if (discretionary > essential * 0.5) {
      analysis.insights.push({ type: 'info', text: `Discretionary spending ($${discretionary.toLocaleString()}/mo) is large relative to essentials. A lean retirement focusing on essentials only would require ${fmt$(scenarioEssential.corpusNeeded)} — potentially ${fmt$(tvmResult.corpusNeeded - scenarioEssential.corpusNeeded)} less.` });
    }

    if (!tvmResult.onTrack && scenarioEssential.onTrack) {
      analysis.insights.push({ type: 'good', text: `While your full lifestyle plan has a gap, you ARE on track for an essential-spending retirement. Consider which discretionary items matter most.` });
    }

    if (tvmResult.impliedSWR > 4) {
      analysis.insights.push({ type: 'warn', text: `Your implied withdrawal rate of ${tvmResult.impliedSWR.toFixed(1)}% exceeds the 4% rule. Consider increasing savings by $${Math.round(tvmResult.additionalMonthlyNeeded).toLocaleString()}/mo or retiring 2-3 years later.` });
    }

    setAiAnalysis(analysis);
    setAiLoading(false);
  }

  function runCalc() {
    setCalculated(true);
    const essential = parseFloat(essentialSpending) || 0;
    const discretionary = parseFloat(discretionarySpending) || 0;
    const income = parseFloat(currentIncome) || 0;
    const tvmInputs = {
      currentAge: parseInt(currentAge) || 35,
      retirementAge: parseInt(retirementAge) || 65,
      lifeExpectancy: parseInt(lifeExpectancy) || 90,
      currentSavings: parseFloat(currentSavings) || 0,
      monthlyContrib: parseFloat(monthlyContrib) || 0,
      monthlyExpenses: essential + discretionary,
      otherMonthlyIncome: parseFloat(otherMonthlyIncome) || 0,
      accumReturn, retireReturn,
    };
    const tvmResult = runTVM(tvmInputs);
    generateAiAnalysis({ essential, discretionary, income, otherIncome: parseFloat(otherMonthlyIncome)||0, ...tvmInputs }, tvmResult);
  }

  /* ─── Layout ── */
  return (
    <div>
      {/* Two-column input layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>

        {/* Col 1: About You */}
        <div style={{ background: "var(--surface)", borderRadius: 10, padding: "1rem", border: "1px solid var(--border-c)" }}>
          <SectionTitle icon={Clock} color={GOLD}>About You</SectionTitle>
          <Field label="Current Age" value={currentAge} onChange={setCurrentAge} suffix="yrs" min="18" />
          <Field label="Retirement Age" value={retirementAge} onChange={setRetirementAge} suffix="yrs"
            note="When you stop working" />
          <Field label="Plan Until Age (Life Expectancy)" value={lifeExpectancy} onChange={setLifeExpectancy}
            suffix="yrs" note="How long your money needs to last" />

          <div style={{
            background: "rgba(201,169,110,0.05)", borderRadius: 6, padding: "0.625rem 0.75rem",
            border: "1px solid rgba(201,169,110,0.2)", marginTop: "0.5rem",
          }}>
            <div style={{ fontSize: "0.5625rem", color: "var(--text-3)", marginBottom: 2 }}>Planning window</div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div>
                <span style={{ fontSize: "1rem", fontWeight: 800, fontFamily: "monospace", color: GOLD }}>
                  {Math.max(0, (parseInt(retirementAge) || 65) - (parseInt(currentAge) || 35))}
                </span>
                <span style={{ fontSize: "0.5625rem", color: "var(--text-3)", marginLeft: 3 }}>yrs to retire</span>
              </div>
              <div>
                <span style={{ fontSize: "1rem", fontWeight: 800, fontFamily: "monospace", color: BLUE }}>
                  {Math.max(0, (parseInt(lifeExpectancy) || 90) - (parseInt(retirementAge) || 65))}
                </span>
                <span style={{ fontSize: "0.5625rem", color: "var(--text-3)", marginLeft: 3 }}>yrs in retirement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Col 2: Your Money */}
        <div style={{ background: "var(--surface)", borderRadius: 10, padding: "1rem", border: "1px solid var(--border-c)" }}>
          <SectionTitle icon={Wallet} color={BLUE}>Your Money</SectionTitle>
          <Field label="Current Investment Balance" value={currentSavings} onChange={setCurrentSavings}
            prefix="$" note="401k, IRA, brokerage — total invested assets" />
          <Field label="Monthly Contribution" value={monthlyContrib} onChange={setMonthlyContrib}
            prefix="$" note="Total you invest each month across all accounts" />
          <Field
            label="Current Monthly Income"
            value={currentIncome}
            onChange={setCurrentIncome}
            prefix="$"
            tooltip="Your gross monthly income before taxes. Used to calculate your income replacement ratio — most planners target replacing 70-80% of pre-retirement income."
          />
          <Field
            label="Essential Monthly Spending"
            value={essentialSpending}
            onChange={setEssentialSpending}
            prefix="$"
            tooltip="Non-negotiable expenses you must cover every month: housing/rent, utilities, groceries, insurance, transportation, and minimum debt payments. This is your retirement floor."
          />
          <Field
            label="Discretionary Monthly Spending"
            value={discretionarySpending}
            onChange={setDiscretionarySpending}
            prefix="$"
            tooltip="Flexible lifestyle spending: dining out, travel, hobbies, entertainment, subscriptions. Can be reduced in retirement if needed."
          />
          <Field
            label="Other Retirement Income"
            value={otherMonthlyIncome}
            onChange={setOtherMonthlyIncome}
            prefix="$"
            tooltip="Expected monthly income from Social Security, pension, rental income, or part-time work in retirement (enter in today's dollars)."
          />

          {/* Total monthly expenses auto-sum */}
          <div style={{
            background: "rgba(59,130,246,0.05)", borderRadius: 6, padding: "0.5rem 0.75rem",
            border: "1px solid rgba(59,130,246,0.2)", marginBottom: "0.5rem",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.5625rem", color: "var(--text-3)" }}>Total monthly expenses</span>
              <span style={{ fontFamily: "monospace", fontSize: "0.8125rem", fontWeight: 700, color: BLUE }}>
                {fmtFull((parseFloat(essentialSpending) || 0) + (parseFloat(discretionarySpending) || 0))}/mo
              </span>
            </div>
            <div style={{ fontSize: "0.5rem", color: "var(--text-3)", marginTop: 2 }}>
              Essential + Discretionary
            </div>
          </div>

          <div style={{
            background: "rgba(59,130,246,0.05)", borderRadius: 6, padding: "0.625rem 0.75rem",
            border: "1px solid rgba(59,130,246,0.2)", marginTop: "0.5rem",
          }}>
            <div style={{ fontSize: "0.5625rem", color: "var(--text-3)", marginBottom: 3 }}>
              Current monthly surplus / shortfall
            </div>
            {(() => {
              const income = parseFloat(currentIncome) || 0;
              const essential = parseFloat(essentialSpending) || 0;
              const discretionary = parseFloat(discretionarySpending) || 0;
              const contrib = parseFloat(monthlyContrib) || 0;
              const surplus = income > 0
                ? income - essential - discretionary - contrib
                : null;
              return (
                <span style={{ fontSize: "1rem", fontWeight: 800, fontFamily: "monospace",
                  color: surplus !== null ? (surplus >= 0 ? GREEN : RED) : "var(--text-3)" }}>
                  {surplus !== null ? (surplus >= 0 ? "+" : "") + fmtFull(surplus) : "—"}
                </span>
              );
            })()}
          </div>
        </div>

        {/* Col 3: Return Assumptions */}
        <div style={{ background: "var(--surface)", borderRadius: 10, padding: "1rem", border: "1px solid var(--border-c)" }}>
          <SectionTitle icon={TrendingUp} color={GREEN}>Return Assumptions</SectionTitle>

          <Slider
            label="Accumulation Return (working years)"
            value={accumReturn}
            onChange={setAccumReturn}
            min={6} max={8} step={0.5}
            note="Historical stock market avg: 7–8%"
          />

          <Slider
            label="Distribution Return (retirement years)"
            value={retireReturn}
            onChange={setRetireReturn}
            min={4} max={7} step={0.5}
            note="Conservative (4%) → Moderate (7%)"
          />

          <div style={{ marginBottom: "0.875rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: "0.6875rem", color: "var(--text-3)", fontWeight: 600 }}>
                Inflation Rate
              </span>
              <span style={{ fontSize: "0.75rem", fontFamily: "monospace", fontWeight: 700, color: ORANGE }}>
                3.0%
              </span>
            </div>
            <div style={{
              background: "rgba(249,115,22,0.08)", borderRadius: 5, padding: "6px 10px",
              border: "1px solid rgba(249,115,22,0.2)",
              fontSize: "0.5625rem", color: "var(--text-3)", lineHeight: 1.5,
            }}>
              Fixed at 3% (long-run Fed target). Applied to both expense growth and corpus calculation.
            </div>
          </div>

          {/* Real return in retirement */}
          <div style={{
            background: "rgba(34,197,94,0.05)", borderRadius: 6, padding: "0.625rem 0.75rem",
            border: "1px solid rgba(34,197,94,0.2)", marginTop: "auto",
          }}>
            <div style={{ fontSize: "0.5625rem", color: "var(--text-3)", marginBottom: 3 }}>
              Real return in retirement (after inflation)
            </div>
            <span style={{ fontSize: "1rem", fontWeight: 800, fontFamily: "monospace", color: GREEN }}>
              {((((1 + retireReturn / 100) / (1 + INFLATION)) - 1) * 100).toFixed(2)}%
            </span>
            <div style={{ fontSize: "0.5625rem", color: "var(--text-3)", marginTop: 2 }}>
              = ({retireReturn}% − 3%) / 1.03 — purchasing power preserved
            </div>
          </div>
        </div>
      </div>

      {/* Calculate button */}
      <button
        onClick={runCalc}
        style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          padding: "0.75rem 2rem", borderRadius: 8, border: "none",
          background: GOLD, color: "#07080a", fontWeight: 800,
          fontSize: "0.875rem", cursor: "pointer", letterSpacing: "0.04em",
          marginBottom: "1.5rem", transition: "all 0.15s",
        }}
      >
        <Target size={16} />
        Calculate My Retirement Number
      </button>

      {/* ── RESULTS ── */}
      {results && (
        <div>
          {/* Status banner */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0.875rem",
            padding: "1rem 1.25rem", borderRadius: 10, marginBottom: "1.25rem",
            background: results.onTrack ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
            border: `1px solid ${results.onTrack ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
          }}>
            {results.onTrack
              ? <CheckCircle size={24} style={{ color: GREEN, flexShrink: 0 }} />
              : <AlertTriangle size={24} style={{ color: RED, flexShrink: 0 }} />
            }
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.875rem", fontWeight: 800, color: results.onTrack ? GREEN : RED, marginBottom: 2 }}>
                {results.onTrack
                  ? `You're on track — projected ${fmt$(results.surplus)} surplus at retirement`
                  : `Gap detected — you need ${fmt$(Math.abs(results.surplus))} more at retirement`
                }
              </div>
              <div style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>
                {results.onTrack
                  ? `Your projected ${fmt$(results.projectedCorpus)} exceeds the ${fmt$(results.corpusNeeded)} needed. Money lasts ${results.yearsMoney < 999 ? results.yearsMoney + " years" : "indefinitely"}.`
                  : `To close the gap, increase monthly contributions by ${fmtFull(results.additionalMonthlyNeeded)}/month.`
                }
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: "0.5625rem", color: "var(--text-3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                On-Track Ratio
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "monospace",
                color: results.onTrack ? GREEN : RED }}>
                {(results.projectedCorpus / results.corpusNeeded * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          {/* ── Three Scenarios ── */}
          {(() => {
            const essential = parseFloat(essentialSpending) || 0;
            const discretionary = parseFloat(discretionarySpending) || 0;
            const income = parseFloat(currentIncome) || 0;
            const targetIncome = income * 0.75;
            const baseInputs = {
              currentAge: parseInt(currentAge) || 35,
              retirementAge: parseInt(retirementAge) || 65,
              lifeExpectancy: parseInt(lifeExpectancy) || 90,
              currentSavings: parseFloat(currentSavings) || 0,
              monthlyContrib: parseFloat(monthlyContrib) || 0,
              otherMonthlyIncome: parseFloat(otherMonthlyIncome) || 0,
              accumReturn, retireReturn,
            };
            const scenarioIncome = runTVM({ ...baseInputs, monthlyExpenses: targetIncome / 12 });
            const scenarioFull = runTVM({ ...baseInputs, monthlyExpenses: essential + discretionary });
            const scenarioEssential = runTVM({ ...baseInputs, monthlyExpenses: essential });
            const recommended = aiAnalysis ? aiAnalysis.recommended : (scenarioIncome?.onTrack ? 'income' : scenarioEssential?.onTrack ? 'essential' : 'full');

            const scenarios = [
              {
                key: 'income',
                label: 'Income Replacement (75%)',
                desc: '75% of current gross income',
                result: scenarioIncome,
                monthlyNeeded: targetIncome / 12,
                color: BLUE,
              },
              {
                key: 'full',
                label: 'Full Lifestyle',
                desc: 'Essential + discretionary spending',
                result: scenarioFull,
                monthlyNeeded: essential + discretionary,
                color: GOLD,
              },
              {
                key: 'essential',
                label: 'Essential Only',
                desc: 'Non-negotiable expenses only',
                result: scenarioEssential,
                monthlyNeeded: essential,
                color: GREEN,
              },
            ];

            return (
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.08em",
                  textTransform: "uppercase", color: "var(--text-2)", marginBottom: "0.75rem" }}>
                  Three Retirement Scenarios
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                  {scenarios.map(s => {
                    const isRec = s.key === recommended;
                    return (
                      <div key={s.key} style={{
                        background: "var(--surface)", borderRadius: 10, padding: "1rem",
                        border: isRec ? `2px solid ${GOLD}` : "1px solid var(--border-c)",
                        position: "relative",
                      }}>
                        {isRec && (
                          <div style={{
                            position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
                            background: GOLD, color: "#07080a", fontSize: "0.5rem", fontWeight: 800,
                            padding: "2px 8px", borderRadius: 10, letterSpacing: "0.08em",
                            textTransform: "uppercase", whiteSpace: "nowrap",
                          }}>
                            Recommended
                          </div>
                        )}
                        <div style={{ fontSize: "0.5625rem", fontWeight: 800, letterSpacing: "0.08em",
                          textTransform: "uppercase", color: s.color, marginBottom: 2 }}>
                          {s.label}
                        </div>
                        <div style={{ fontSize: "0.5rem", color: "var(--text-3)", marginBottom: "0.625rem" }}>
                          {s.desc}
                        </div>
                        {s.result ? (
                          <>
                            <div style={{ marginBottom: "0.375rem" }}>
                              <div style={{ fontSize: "0.5rem", color: "var(--text-3)" }}>Corpus Needed</div>
                              <div style={{ fontSize: "1.125rem", fontWeight: 800, fontFamily: "monospace", color: s.color }}>
                                {fmt$(s.result.corpusNeeded)}
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.375rem" }}>
                              <div>
                                <div style={{ fontSize: "0.5rem", color: "var(--text-3)" }}>Status</div>
                                <div style={{ fontSize: "0.75rem", fontWeight: 700,
                                  color: s.result.onTrack ? GREEN : RED }}>
                                  {s.result.onTrack ? "✓ On Track" : "✗ Gap"}
                                </div>
                              </div>
                              <div>
                                <div style={{ fontSize: "0.5rem", color: "var(--text-3)" }}>Monthly Need</div>
                                <div style={{ fontSize: "0.75rem", fontWeight: 700, fontFamily: "monospace",
                                  color: "var(--text-2)" }}>
                                  {fmt$(s.monthlyNeeded)}/mo
                                </div>
                              </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                              paddingTop: "0.375rem", borderTop: "1px solid var(--border-c)" }}>
                              <span style={{ fontSize: "0.5rem", color: "var(--text-3)" }}>Implied SWR</span>
                              <span style={{ fontFamily: "monospace", fontSize: "0.6875rem", fontWeight: 700,
                                color: s.result.impliedSWR <= 4 ? GREEN : s.result.impliedSWR <= 5 ? ORANGE : RED }}>
                                {s.result.impliedSWR.toFixed(1)}%
                              </span>
                            </div>
                          </>
                        ) : (
                          <div style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>N/A</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* ── AI Analysis ── */}
          <div style={{
            background: "rgba(201,169,110,0.04)", border: "1px solid rgba(201,169,110,0.2)",
            borderRadius: 10, padding: "1.25rem", marginBottom: "1.25rem",
          }}>
            {aiLoading && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.5rem 0" }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: "50%", background: GOLD,
                      animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                      opacity: 0.7,
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>
                  Analyzing your retirement plan...
                </span>
                <style>{`@keyframes pulse { 0%,80%,100%{transform:scale(0.8);opacity:0.5} 40%{transform:scale(1.1);opacity:1} }`}</style>
              </div>
            )}
            {!aiLoading && aiAnalysis && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.875rem" }}>
                  <Sparkles size={16} color={GOLD} />
                  <span style={{ fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: GOLD }}>
                    Planora AI Recommendation
                  </span>
                </div>

                {/* Recommended scenario summary */}
                <div style={{
                  background: "rgba(201,169,110,0.08)", borderRadius: 8, padding: "0.75rem 1rem",
                  border: "1px solid rgba(201,169,110,0.25)", marginBottom: "0.875rem",
                }}>
                  <div style={{ fontSize: "0.6875rem", color: "var(--text-2)", lineHeight: 1.6 }}>
                    {aiAnalysis.recommended === 'income' && (
                      <>Based on your income, the <strong style={{ color: GOLD }}>75% Income Replacement</strong> scenario is achievable — target {fmt$(aiAnalysis.targetIncome / 12)}/mo in retirement.</>
                    )}
                    {aiAnalysis.recommended === 'essential' && (
                      <>Your full lifestyle plan has a gap, but the <strong style={{ color: GREEN }}>Essential Only</strong> scenario is funded. Focus on which discretionary items truly matter in retirement.</>
                    )}
                    {aiAnalysis.recommended === 'full' && (
                      <>You're building toward the <strong style={{ color: BLUE }}>Full Lifestyle</strong> scenario — covering both essential and discretionary spending through retirement.</>
                    )}
                  </div>
                </div>

                {/* Income replacement ratio visualization */}
                <div style={{ marginBottom: "0.875rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: "0.5625rem", color: "var(--text-3)" }}>Income replacement ratio</span>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, fontFamily: "monospace",
                      color: parseFloat(aiAnalysis.incomeReplacement) < 80 ? GREEN : parseFloat(aiAnalysis.incomeReplacement) < 90 ? ORANGE : RED }}>
                      {aiAnalysis.incomeReplacement}%
                    </span>
                  </div>
                  <div style={{ height: 6, background: "var(--border-c)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 3,
                      width: `${Math.min(100, parseFloat(aiAnalysis.incomeReplacement))}%`,
                      background: parseFloat(aiAnalysis.incomeReplacement) < 80 ? GREEN : parseFloat(aiAnalysis.incomeReplacement) < 90 ? ORANGE : RED,
                      transition: "width 0.6s ease",
                    }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                    <span style={{ fontSize: "0.5rem", color: "var(--text-3)" }}>0%</span>
                    <span style={{ fontSize: "0.5rem", color: GREEN }}>70% target</span>
                    <span style={{ fontSize: "0.5rem", color: ORANGE }}>80%</span>
                    <span style={{ fontSize: "0.5rem", color: "var(--text-3)" }}>100%</span>
                  </div>
                </div>

                {/* Insight bullets */}
                {aiAnalysis.insights.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {aiAnalysis.insights.map((insight, i) => {
                      const color = insight.type === 'good' ? GREEN : insight.type === 'warn' ? ORANGE : BLUE;
                      const bg = insight.type === 'good' ? "rgba(34,197,94,0.06)" : insight.type === 'warn' ? "rgba(249,115,22,0.06)" : "rgba(59,130,246,0.06)";
                      const border = insight.type === 'good' ? "rgba(34,197,94,0.2)" : insight.type === 'warn' ? "rgba(249,115,22,0.2)" : "rgba(59,130,246,0.2)";
                      const dot = insight.type === 'good' ? "●" : insight.type === 'warn' ? "▲" : "●";
                      return (
                        <div key={i} style={{
                          background: bg, border: `1px solid ${border}`,
                          borderRadius: 6, padding: "0.5rem 0.75rem",
                          display: "flex", gap: "0.5rem", alignItems: "flex-start",
                        }}>
                          <span style={{ color, fontSize: "0.5rem", marginTop: 3, flexShrink: 0 }}>{dot}</span>
                          <span style={{ fontSize: "0.6875rem", color: "var(--text-2)", lineHeight: 1.5 }}>
                            {insight.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
            {!aiLoading && !aiAnalysis && (
              <div style={{ fontSize: "0.6875rem", color: "var(--text-3)", fontStyle: "italic" }}>
                AI analysis will appear here after calculation.
              </div>
            )}
          </div>

          {/* Key metrics row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <StatCard
              label="Your Retirement Number"
              value={fmt$(results.corpusNeeded)}
              sub={`= ${fmt$(results.corpusNeededToday)} in today's dollars`}
              color={GOLD} highlight
            />
            <StatCard
              label="Projected Corpus at Retirement"
              value={fmt$(results.projectedCorpus)}
              sub={`${fmt$(results.projectedCorpusToday)} in today's dollars`}
              color={results.onTrack ? GREEN : RED} highlight
            />
            <StatCard
              label="Monthly Income in Retirement"
              value={fmt$(results.monthlyIncomeYear1)}
              sub={`${fmt$(results.annualWithdrawal / 12 * Math.pow(1.03, 10))}/mo in 10 yrs (inflation-adj)`}
              color={BLUE}
            />
            <StatCard
              label="Years Money Will Last"
              value={results.yearsMoney < 999 ? results.yearsMoney + " yrs" : "Indefinitely"}
              sub={results.portfolioRunsOutAge
                ? `Portfolio depleted at age ${results.portfolioRunsOutAge}`
                : `Outlasts plan to age ${parseInt(lifeExpectancy)}`}
              color={results.yearsMoney >= results.n_retire ? GREEN : RED}
            />
          </div>

          {/* Secondary metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <StatCard
              label="Total Contributions"
              value={fmt$(results.totalContributions)}
              sub={`Over ${results.n_accum} years`}
              color="var(--text-2)"
            />
            <StatCard
              label="Investment Growth"
              value={fmt$(results.investmentGrowth)}
              sub={`${((results.investmentGrowth / results.projectedCorpus) * 100).toFixed(0)}% of final corpus`}
              color={ORANGE}
            />
            <StatCard
              label="Implied Withdrawal Rate"
              value={results.impliedSWR.toFixed(2) + "%"}
              sub={results.impliedSWR <= 4 ? "Below 4% rule ✓ safe" : results.impliedSWR <= 5 ? "Moderate range" : "Above 5% — reduce expenses or save more"}
              color={results.impliedSWR <= 4 ? GREEN : results.impliedSWR <= 5 ? ORANGE : RED}
            />
            <StatCard
              label="Additional Monthly Savings Needed"
              value={results.onTrack ? "$0" : fmt$(results.additionalMonthlyNeeded)}
              sub={results.onTrack ? "No gap — you're funded" : "To fully fund retirement goal"}
              color={results.onTrack ? GREEN : RED}
            />
          </div>

          {/* ── Wealth Trajectory Chart ── */}
          <div style={{
            background: "var(--surface)", borderRadius: 10, border: "1px solid var(--border-c)",
            padding: "1.25rem", marginBottom: "1.25rem",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
              <div>
                <div style={{ fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.08em",
                  textTransform: "uppercase", color: "var(--text-2)" }}>
                  Wealth Trajectory — Accumulation → Retirement
                </div>
                <div style={{ fontSize: "0.5625rem", color: "var(--text-3)", marginTop: 2 }}>
                  Ages {currentAge} – {lifeExpectancy} · Gold = accumulation · Red = drawdown
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ fontSize: "0.5625rem", color: "var(--text-3)", display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 10, height: 2, background: GOLD, borderRadius: 1 }} /> Accumulation
                </div>
                <div style={{ fontSize: "0.5625rem", color: "var(--text-3)", display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 10, height: 2, background: RED, borderRadius: 1 }} /> Retirement
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={results.chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="accumGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={GOLD} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={GOLD} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="retireGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={RED} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={RED} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="age" tick={{ fontSize: 10, fill: "var(--text-3)" }}
                  label={{ value: "Age", position: "insideBottom", offset: -2, fill: "var(--text-3)", fontSize: 10 }} />
                <YAxis tickFormatter={v => fmt$(v)} tick={{ fontSize: 10, fill: "var(--text-3)" }} />
                <Tooltip content={<ChartTip />} />
                <ReferenceLine
                  x={parseInt(retirementAge)}
                  stroke="rgba(255,255,255,0.3)"
                  strokeDasharray="4 4"
                  label={{ value: "Retirement", position: "insideTopLeft", fill: "var(--text-3)", fontSize: 9 }}
                />
                <Area
                  type="monotone" dataKey="balance"
                  stroke={GOLD} strokeWidth={2.5}
                  fill="url(#accumGrad)"
                  dot={false} connectNulls={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* ── TVM Breakdown ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>

            {/* Corpus composition */}
            <div style={{ background: "var(--surface)", borderRadius: 10, border: "1px solid var(--border-c)", padding: "1.25rem" }}>
              <div style={{ fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.08em",
                textTransform: "uppercase", color: "var(--text-2)", marginBottom: "0.875rem" }}>
                Corpus Composition
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={[
                  { name: "Contributions", value: Math.round(results.totalContributions) },
                  { name: "Investment Growth", value: Math.round(results.investmentGrowth) },
                ]} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--text-3)" }} />
                  <YAxis tickFormatter={v => fmt$(v)} tick={{ fontSize: 10, fill: "var(--text-3)" }} />
                  <Tooltip formatter={v => fmtFull(v)}
                    contentStyle={{ background: "var(--elevated)", border: "1px solid var(--border-c)", fontSize: "0.6875rem" }} />
                  <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                    <Cell fill={BLUE} />
                    <Cell fill={GOLD} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>Starting balance</span>
                  <span style={{ fontFamily: "monospace", fontSize: "0.6875rem", color: "var(--text-1)" }}>
                    {fmtFull(parseFloat(currentSavings) || 0)}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>
                    Contributions ({results.n_accum} yrs × ${monthlyContrib}/mo)
                  </span>
                  <span style={{ fontFamily: "monospace", fontSize: "0.6875rem", color: BLUE }}>
                    {fmtFull(results.totalContributions - (parseFloat(currentSavings) || 0))}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>Compound growth ({accumReturn}% × {results.n_accum} yrs)</span>
                  <span style={{ fontFamily: "monospace", fontSize: "0.6875rem", color: GOLD }}>
                    {fmtFull(results.investmentGrowth)}
                  </span>
                </div>
                <div style={{
                  display: "flex", justifyContent: "space-between", paddingTop: "0.375rem",
                  borderTop: "1px solid var(--border-c)", marginTop: "0.25rem",
                }}>
                  <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--text-1)" }}>Projected Corpus</span>
                  <span style={{ fontFamily: "monospace", fontSize: "0.75rem", fontWeight: 700, color: GOLD }}>
                    {fmtFull(results.projectedCorpus)}
                  </span>
                </div>
              </div>
            </div>

            {/* Retirement income bridge */}
            <div style={{ background: "var(--surface)", borderRadius: 10, border: "1px solid var(--border-c)", padding: "1.25rem" }}>
              <div style={{ fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.08em",
                textTransform: "uppercase", color: "var(--text-2)", marginBottom: "0.875rem" }}>
                Retirement Income Bridge
              </div>

              {/* Expense waterfall */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  {
                    label: `Monthly expenses in retirement (${parseInt(retirementAge)})`,
                    value: results.annualExpensesRetirement / 12,
                    color: RED,
                    note: `Today's $${(parseFloat(essentialSpending)||0) + (parseFloat(discretionarySpending)||0)}/mo inflated ${results.n_accum} yrs at 3%`,
                  },
                  {
                    label: "Other income (SS, pension, rental)",
                    value: results.otherIncomeRetirement / 12,
                    color: GREEN,
                    note: `Today's $${otherMonthlyIncome}/mo inflated to retirement`,
                    isIncome: true,
                  },
                  {
                    label: "Net portfolio withdrawal needed",
                    value: results.monthlyIncomeYear1,
                    color: GOLD,
                    note: `= ${fmtPct(results.impliedSWR)} withdrawal rate on your corpus`,
                    bold: true,
                  },
                ].map(item => (
                  <div key={item.label} style={{
                    padding: "0.625rem 0.75rem", borderRadius: 6,
                    background: `${item.color}08`,
                    border: `1px solid ${item.color}25`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.625rem", color: "var(--text-3)" }}>{item.label}</span>
                      <span style={{ fontFamily: "monospace", fontSize: item.bold ? "1rem" : "0.8125rem",
                        fontWeight: item.bold ? 800 : 600, color: item.color }}>
                        {item.isIncome ? "−" : ""}{fmtFull(item.value)}/mo
                      </span>
                    </div>
                    <div style={{ fontSize: "0.5rem", color: "var(--text-3)", marginTop: 2 }}>{item.note}</div>
                  </div>
                ))}
              </div>

              {/* TVM formula display */}
              <div style={{
                marginTop: "1rem", padding: "0.75rem", borderRadius: 6,
                background: "rgba(107,114,128,0.08)", border: "1px solid var(--border-c)",
              }}>
                <div style={{ fontSize: "0.5625rem", color: "var(--text-3)", fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                  TVM Formula Used
                </div>
                <div style={{ fontFamily: "monospace", fontSize: "0.5625rem", color: "var(--text-2)", lineHeight: 1.8 }}>
                  <div>Corpus = PMT / (r − g) × [1 − ((1+g)/(1+r))^n]</div>
                  <div style={{ color: "var(--text-3)" }}>
                    = {fmtFull(results.annualWithdrawal)}/yr ÷ ({retireReturn}%−3%) × [1−(1.03/1.{retireReturn < 10 ? "0" + retireReturn : retireReturn})^{results.n_retire}]
                  </div>
                  <div style={{ marginTop: 4, color: GOLD }}>= {fmtFull(results.corpusNeeded)} needed</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Scenario sensitivity ── */}
          <SensitivityTable
            inputs={{
              currentAge, retirementAge, lifeExpectancy, currentSavings, monthlyContrib,
              monthlyExpenses: (parseFloat(essentialSpending)||0) + (parseFloat(discretionarySpending)||0),
              otherMonthlyIncome,
            }}
            baseAccum={accumReturn} baseRetire={retireReturn}
          />

          {/* Disclaimer */}
          <div style={{
            marginTop: "1rem", padding: "0.75rem 1rem", borderRadius: 6,
            background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.2)",
            fontSize: "0.5625rem", color: "var(--text-3)", lineHeight: 1.6,
          }}>
            <span style={{ color: ORANGE, fontWeight: 700 }}>Educational purposes only. </span>
            Results assume constant returns and 3% inflation. Actual markets fluctuate. Consult a CFP® before making financial decisions.
            Social Security estimates should come from ssa.gov. Tax implications not included.
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Sensitivity Table ──────────────────────────────────────────── */
function SensitivityTable({ inputs, baseAccum, baseRetire }) {
  const scenarios = [
    { label: "Conservative", accum: 6.0, retire: 4.0 },
    { label: "Moderate",     accum: 7.0, retire: 5.0 },
    { label: "Base Case",    accum: baseAccum, retire: baseRetire, isBase: true },
    { label: "Optimistic",   accum: 8.0, retire: 6.0 },
    { label: "Aggressive",   accum: 8.0, retire: 7.0 },
  ];

  const rows = scenarios.map(s => {
    const r = runTVM({
      currentAge: parseInt(inputs.currentAge) || 35,
      retirementAge: parseInt(inputs.retirementAge) || 65,
      lifeExpectancy: parseInt(inputs.lifeExpectancy) || 90,
      currentSavings: parseFloat(inputs.currentSavings) || 0,
      monthlyContrib: parseFloat(inputs.monthlyContrib) || 0,
      monthlyExpenses: parseFloat(inputs.monthlyExpenses) || 0,
      otherMonthlyIncome: parseFloat(inputs.otherMonthlyIncome) || 0,
      accumReturn: s.accum,
      retireReturn: s.retire,
    });
    return { ...s, r };
  });

  return (
    <div style={{ background: "var(--surface)", borderRadius: 10, border: "1px solid var(--border-c)", overflow: "hidden", marginBottom: "1.25rem" }}>
      <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border-c)" }}>
        <div style={{ fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "var(--text-2)" }}>
          Scenario Sensitivity Analysis
        </div>
        <div style={{ fontSize: "0.5625rem", color: "var(--text-3)", marginTop: 2 }}>
          How your outcome changes across return assumptions
        </div>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Scenario", "Accum Return", "Retire Return", "Projected Corpus", "Corpus Needed", "Surplus / Gap", "Monthly Income", "Yrs Money Lasts"].map(h => (
              <th key={h} style={{
                padding: "8px 12px", fontSize: "0.5rem", letterSpacing: "0.08em",
                color: "var(--text-3)", textTransform: "uppercase", textAlign: h === "Scenario" ? "left" : "right",
                borderBottom: "1px solid var(--border-c)",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ label, accum, retire, isBase, r }) => (
            <tr key={label} style={{ background: isBase ? "rgba(201,169,110,0.06)" : "transparent" }}>
              <td style={{ padding: "8px 12px", fontSize: "0.6875rem", fontWeight: isBase ? 700 : 400,
                color: isBase ? GOLD : "var(--text-2)", borderBottom: "1px solid var(--border-c)" }}>
                {label}{isBase && " ★"}
              </td>
              <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace",
                fontSize: "0.6875rem", color: "var(--text-2)", borderBottom: "1px solid var(--border-c)" }}>
                {accum}%
              </td>
              <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace",
                fontSize: "0.6875rem", color: "var(--text-2)", borderBottom: "1px solid var(--border-c)" }}>
                {retire}%
              </td>
              <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace",
                fontSize: "0.6875rem", color: GOLD, borderBottom: "1px solid var(--border-c)" }}>
                {r ? fmt$(r.projectedCorpus) : "—"}
              </td>
              <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace",
                fontSize: "0.6875rem", color: "var(--text-2)", borderBottom: "1px solid var(--border-c)" }}>
                {r ? fmt$(r.corpusNeeded) : "—"}
              </td>
              <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace",
                fontSize: "0.6875rem", color: r?.onTrack ? GREEN : RED, borderBottom: "1px solid var(--border-c)" }}>
                {r ? (r.onTrack ? "+" : "") + fmt$(r.surplus) : "—"}
              </td>
              <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace",
                fontSize: "0.6875rem", color: BLUE, borderBottom: "1px solid var(--border-c)" }}>
                {r ? fmt$(r.monthlyIncomeYear1) + "/mo" : "—"}
              </td>
              <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace",
                fontSize: "0.6875rem", color: r?.yearsMoney < 999 && r?.yearsMoney < r?.n_retire ? RED : GREEN,
                borderBottom: "1px solid var(--border-c)" }}>
                {r ? (r.yearsMoney < 999 ? r.yearsMoney + " yrs" : "Indefinite") : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
