import React, { useState, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, BarChart, Bar, Cell, ReferenceLine,
} from "recharts";
import { Plus, X, RefreshCw, AlertTriangle, TrendingUp, Download } from "lucide-react";

/* ─── Config ─────────────────────────────────────────────────────── */
const SERVER = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hrs
const GOLD = "#c9a84c";
const BLUE = "#3b82f6";
const RED  = "#ef4444";
const GREEN = "#22c55e";
const GRAY  = "#6b7280";

/* ─── Crisis Scenarios ───────────────────────────────────────────── */
const CRISES = [
  { key: "dotcom",   label: "Dot-Com Crash",        start: "2000-03", end: "2002-10", desc: "Mar 2000 – Oct 2002" },
  { key: "gfc",      label: "2008 Crisis",           start: "2007-10", end: "2009-03", desc: "Oct 2007 – Mar 2009" },
  { key: "euroDebt", label: "Euro Debt",             start: "2010-04", end: "2011-09", desc: "Apr 2010 – Sep 2011" },
  { key: "q42018",   label: "2018 Q4 Selloff",       start: "2018-09", end: "2018-12", desc: "Sep – Dec 2018" },
  { key: "covid",    label: "COVID Crash",           start: "2020-01", end: "2020-04", desc: "Jan – Apr 2020" },
  { key: "bear2022", label: "2022 Bear Market",      start: "2021-12", end: "2022-10", desc: "Dec 2021 – Oct 2022" },
];

/* ─── Data Fetching ──────────────────────────────────────────────── */
async function fetchMonthly(ticker) {
  const key = `av_monthly_${ticker.toUpperCase()}`;
  const cached = localStorage.getItem(key);
  if (cached) {
    try {
      const { data, ts } = JSON.parse(cached);
      if (Date.now() - ts < CACHE_TTL) return { ticker, data, error: null };
    } catch {}
  }

  try {
    const res = await fetch(`${SERVER}/api/av-monthly/${encodeURIComponent(ticker)}`);
    const json = await res.json();

    if (json.error === 'rate_limit') return { ticker, data: null, error: "rate_limit" };
    if (json.error === 'not_found' || !json.data) return { ticker, data: null, error: "not_found" };

    const data = json.data;
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
    return { ticker, data, error: null };
  } catch (e) {
    return { ticker, data: null, error: "network" };
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ─── Calculation Helpers ────────────────────────────────────────── */
function calcReturn(data, years) {
  if (!data || data.length < 2) return null;
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - years);
  const cutoffStr = cutoff.toISOString().slice(0, 7);
  const start = data.find(d => d.date.slice(0, 7) >= cutoffStr);
  const end = data[data.length - 1];
  if (!start || !end || start.date === end.date) return null;
  return ((end.close - start.close) / start.close) * 100;
}

function calcCrisisDrawdown(data, startMonth, endMonth) {
  if (!data || data.length < 2) return null;
  const window = data.filter(d => {
    const m = d.date.slice(0, 7);
    return m >= startMonth && m <= endMonth;
  });
  if (window.length < 2) return null;
  const peak = window[0].close;
  const trough = Math.min(...window.map(d => d.close));
  return ((trough - peak) / peak) * 100;
}

function calcAllMetrics(data) {
  return {
    r1:  calcReturn(data, 1),
    r5:  calcReturn(data, 5),
    r10: calcReturn(data, 10),
    rinception: data && data.length > 1
      ? ((data[data.length-1].close - data[0].close) / data[0].close) * 100
      : null,
    crises: Object.fromEntries(
      CRISES.map(c => [c.key, calcCrisisDrawdown(data, c.start, c.end)])
    ),
  };
}

function weightedMetric(rows, metricFn) {
  let wSum = 0, total = 0;
  for (const r of rows) {
    const v = metricFn(r);
    if (v !== null && v !== undefined && !isNaN(v)) {
      const w = (r.weight || 0) / 100;
      wSum += v * w;
      total += w;
    }
  }
  return total > 0 ? wSum / total : null;
}

/* ─── Build Growth Chart ─────────────────────────────────────────── */
function buildGrowthChart(portfolioRows, label, dataMap) {
  // Find common date range
  const allDates = new Set();
  for (const r of portfolioRows) {
    const d = dataMap[r.ticker.toUpperCase()];
    if (d) d.forEach(p => allDates.add(p.date.slice(0, 7)));
  }
  const sorted = Array.from(allDates).sort();
  if (sorted.length === 0) return [];

  // Find earliest date all tickers have data
  const starts = portfolioRows.map(r => {
    const d = dataMap[r.ticker.toUpperCase()];
    return d && d.length > 0 ? d[0].date.slice(0, 7) : null;
  }).filter(Boolean);
  const commonStart = starts.length > 0 ? starts.reduce((a, b) => a > b ? a : b) : sorted[0];

  const dates = sorted.filter(m => m >= commonStart);
  if (dates.length === 0) return [];

  // Get monthly values for each ticker
  const getClose = (ticker, month) => {
    const d = dataMap[ticker.toUpperCase()];
    if (!d) return null;
    const p = d.find(x => x.date.slice(0, 7) === month) ||
              d.filter(x => x.date.slice(0, 7) <= month).at(-1);
    return p ? p.close : null;
  };

  // Compute base prices at commonStart
  const bases = {};
  for (const r of portfolioRows) {
    bases[r.ticker.toUpperCase()] = getClose(r.ticker.toUpperCase(), commonStart);
  }

  return dates.map(month => {
    let portValue = 0;
    let valid = true;
    for (const r of portfolioRows) {
      const base = bases[r.ticker.toUpperCase()];
      const cur = getClose(r.ticker.toUpperCase(), month);
      if (!base || !cur) { valid = false; break; }
      portValue += (r.weight / 100) * (cur / base) * 100;
    }
    return { month, [label]: valid ? portValue : null };
  });
}

function mergeCharts(a, b, spy) {
  const dateMap = {};
  for (const row of a) dateMap[row.month] = { ...row };
  for (const row of b) {
    if (dateMap[row.month]) Object.assign(dateMap[row.month], row);
    else dateMap[row.month] = { ...row };
  }
  for (const row of spy) {
    if (dateMap[row.month]) Object.assign(dateMap[row.month], row);
    else dateMap[row.month] = { ...row };
  }
  return Object.values(dateMap).sort((a, b) => a.month.localeCompare(b.month));
}

/* ─── Formatting ─────────────────────────────────────────────────── */
const fmtPct = (v, dec = 1) =>
  v === null || v === undefined || isNaN(v) ? "—"
  : `${v >= 0 ? "+" : ""}${v.toFixed(dec)}%`;

function PctCell({ v, bold = false }) {
  if (v === null || v === undefined || isNaN(v))
    return <span style={{ color: "var(--text-3)", fontSize: "0.6875rem" }}>—</span>;
  const color = v >= 0 ? GREEN : RED;
  return (
    <span style={{ color, fontFamily: "monospace", fontSize: "0.75rem", fontWeight: bold ? 700 : 400 }}>
      {v >= 0 ? "+" : ""}{v.toFixed(1)}%
    </span>
  );
}

/* ─── Portfolio Input Panel ──────────────────────────────────────── */
const EMPTY_HOLDING = () => ({ ticker: "", weight: "" });

function PortfolioPanel({ port, setPort, color, label }) {
  const add = () => {
    if (port.holdings.length >= 25) return;
    setPort(p => ({ ...p, holdings: [...p.holdings, EMPTY_HOLDING()] }));
  };
  const remove = (i) => setPort(p => ({ ...p, holdings: p.holdings.filter((_, idx) => idx !== i) }));
  const update = (i, field, val) => setPort(p => ({
    ...p,
    holdings: p.holdings.map((h, idx) => idx === i ? { ...h, [field]: val } : h),
  }));
  const totalW = port.holdings.reduce((s, h) => s + (parseFloat(h.weight) || 0), 0);
  const wOk = Math.abs(totalW - 100) < 0.5;

  return (
    <div style={{
      flex: 1, background: "var(--surface)", borderRadius: 10,
      border: `1px solid ${color}40`, padding: "1rem",
    }}>
      {/* Panel header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.875rem" }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
        <input
          value={port.name}
          onChange={e => setPort(p => ({ ...p, name: e.target.value }))}
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            fontWeight: 700, fontSize: "0.8125rem", color: "var(--text-1)",
          }}
          placeholder="Portfolio name…"
        />
        <span style={{ fontSize: "0.5625rem", color: "var(--text-3)" }}>{port.holdings.length}/25</span>
      </div>

      {/* Column headers */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 72px 24px", gap: "0.375rem",
        marginBottom: "0.375rem", padding: "0 2px" }}>
        <span style={{ fontSize: "0.5625rem", letterSpacing: "0.08em", color: "var(--text-3)", textTransform: "uppercase" }}>Ticker</span>
        <span style={{ fontSize: "0.5625rem", letterSpacing: "0.08em", color: "var(--text-3)", textTransform: "uppercase", textAlign: "right" }}>Weight %</span>
        <span />
      </div>

      {/* Holdings rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", marginBottom: "0.75rem" }}>
        {port.holdings.map((h, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 72px 24px", gap: "0.375rem", alignItems: "center" }}>
            <input
              value={h.ticker}
              onChange={e => update(i, "ticker", e.target.value.toUpperCase())}
              placeholder="SPY"
              maxLength={6}
              style={inputStyle}
            />
            <input
              value={h.weight}
              onChange={e => update(i, "weight", e.target.value)}
              placeholder="0"
              type="number"
              min="0" max="100" step="1"
              style={{ ...inputStyle, textAlign: "right" }}
            />
            <button onClick={() => remove(i)} style={iconBtnStyle}>
              <X size={11} />
            </button>
          </div>
        ))}
      </div>

      {/* Add row */}
      <button onClick={add} style={addBtnStyle}>
        <Plus size={12} /> Add Ticker
      </button>

      {/* Weight total */}
      <div style={{
        marginTop: "0.625rem", display: "flex", justifyContent: "space-between",
        padding: "0.4rem 0.5rem", borderRadius: 5,
        background: wOk ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)",
        border: `1px solid ${wOk ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
      }}>
        <span style={{ fontSize: "0.625rem", color: "var(--text-3)" }}>Total Weight</span>
        <span style={{ fontSize: "0.75rem", fontFamily: "monospace", fontWeight: 700,
          color: wOk ? GREEN : RED }}>
          {totalW.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────── */
const inputStyle = {
  background: "var(--bg)", border: "1px solid var(--border-c)", borderRadius: 5,
  padding: "5px 8px", fontSize: "0.75rem", color: "var(--text-1)",
  outline: "none", width: "100%", fontFamily: "monospace",
};
const iconBtnStyle = {
  display: "flex", alignItems: "center", justifyContent: "center",
  width: 22, height: 22, borderRadius: 4, border: "none",
  background: "rgba(239,68,68,0.1)", color: RED, cursor: "pointer", flexShrink: 0,
};
const addBtnStyle = {
  display: "flex", alignItems: "center", gap: "0.375rem",
  width: "100%", padding: "6px 10px", borderRadius: 6, cursor: "pointer",
  border: "1px dashed var(--border-c)", background: "transparent",
  color: "var(--text-3)", fontSize: "0.6875rem", fontWeight: 600,
};

/* ─── Main Component ─────────────────────────────────────────────── */
export default function TabPortfolioAnalyzer() {
  const [portA, setPortA] = useState({
    name: "Portfolio A",
    holdings: [
      { ticker: "SPY", weight: "50" },
      { ticker: "QQQ", weight: "30" },
      { ticker: "AGG", weight: "20" },
    ],
  });
  const [portB, setPortB] = useState({
    name: "Portfolio B",
    holdings: [
      { ticker: "VTI", weight: "60" },
      { ticker: "VXUS", weight: "25" },
      { ticker: "BND", weight: "15" },
    ],
  });

  const [status, setStatus] = useState(null); // null | { running, done, total, current, rateLimited, errors }
  const [results, setResults] = useState(null);
  const [view, setView] = useState("returns"); // returns | drawdowns | chart | compare

  const runAnalysis = useCallback(async () => {
    // Collect unique tickers
    const allHoldings = [
      ...portA.holdings.map(h => ({ ...h, port: "A" })),
      ...portB.holdings.map(h => ({ ...h, port: "B" })),
      { ticker: "SPY", weight: 100, port: "benchmark" },
    ].filter(h => h.ticker.trim());

    const uniqueTickers = [...new Set(allHoldings.map(h => h.ticker.toUpperCase()))];

    setStatus({ running: true, done: 0, total: uniqueTickers.length, current: "", rateLimited: false, errors: [] });
    setResults(null);

    const dataMap = {};
    const errors = [];

    for (let i = 0; i < uniqueTickers.length; i++) {
      const ticker = uniqueTickers[i];
      setStatus(s => ({ ...s, done: i, current: ticker }));

      // Check cache first (no delay needed if cached)
      const cacheKey = `av_monthly_${ticker}`;
      const cached = localStorage.getItem(cacheKey);
      let fromCache = false;
      if (cached) {
        try {
          const { ts } = JSON.parse(cached);
          if (Date.now() - ts < CACHE_TTL) fromCache = true;
        } catch {}
      }

      if (!fromCache && i > 0) {
        // Rate limit: 5 calls/min on free tier → 13s between live fetches
        await sleep(13000);
      }

      const result = await fetchMonthly(ticker);

      if (result.error === "rate_limit") {
        setStatus(s => ({ ...s, rateLimited: true }));
        errors.push({ ticker, error: "Rate limited — try again in 1 min" });
      } else if (result.error) {
        errors.push({ ticker, error: result.error === "not_found" ? "Ticker not found" : "Fetch error" });
      }

      if (result.data) dataMap[ticker] = result.data;
    }

    setStatus(s => ({ ...s, running: false, done: uniqueTickers.length, errors }));

    // Build per-ticker metrics
    const buildRows = (port) => port.holdings
      .filter(h => h.ticker.trim())
      .map(h => {
        const t = h.ticker.toUpperCase();
        const data = dataMap[t];
        const m = calcAllMetrics(data);
        return { ticker: t, weight: parseFloat(h.weight) || 0, ...m };
      });

    const rowsA = buildRows(portA);
    const rowsB = buildRows(portB);
    const spyData = dataMap["SPY"];
    const spyMetrics = calcAllMetrics(spyData);

    // Portfolio weighted aggregates
    const portATotal = {
      ticker: "Portfolio A",
      weight: 100,
      r1:  weightedMetric(rowsA, r => r.r1),
      r5:  weightedMetric(rowsA, r => r.r5),
      r10: weightedMetric(rowsA, r => r.r10),
      rinception: weightedMetric(rowsA, r => r.rinception),
      crises: Object.fromEntries(CRISES.map(c => [c.key, weightedMetric(rowsA, r => r.crises[c.key])])),
    };
    const portBTotal = {
      ticker: "Portfolio B",
      weight: 100,
      r1:  weightedMetric(rowsB, r => r.r1),
      r5:  weightedMetric(rowsB, r => r.r5),
      r10: weightedMetric(rowsB, r => r.r10),
      rinception: weightedMetric(rowsB, r => r.rinception),
      crises: Object.fromEntries(CRISES.map(c => [c.key, weightedMetric(rowsB, r => r.crises[c.key])])),
    };

    // Growth charts — use 5Y window
    const chartA = buildGrowthChart(portA.holdings.filter(h => h.ticker.trim()), portA.name, dataMap);
    const chartB = buildGrowthChart(portB.holdings.filter(h => h.ticker.trim()), portB.name, dataMap);
    const chartSPY = buildGrowthChart([{ ticker: "SPY", weight: 100 }], "S&P 500", dataMap);
    const chartData = mergeCharts(chartA, chartB, chartSPY);

    // Filter last 10 years
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 10);
    const cutoffStr = cutoff.toISOString().slice(0, 7);
    const chartData10Y = chartData.filter(d => d.month >= cutoffStr);

    setResults({
      rowsA, rowsB,
      portATotal, portBTotal,
      spyMetrics,
      chartData: chartData10Y,
      portAName: portA.name,
      portBName: portB.name,
      errors,
    });
  }, [portA, portB]);

  /* ─── CSV Export ─────────────────────────────────────────────────── */
  function exportCSV() {
    if (!results) return;
    const headers = ["Portfolio", "Ticker", "Weight", "1Y Return", "5Y Return", "10Y Return",
      ...CRISES.map(c => c.label)];
    const rows = [
      ...results.rowsA.map(r => [results.portAName, r.ticker, r.weight + "%",
        fmtPct(r.r1), fmtPct(r.r5), fmtPct(r.r10), ...CRISES.map(c => fmtPct(r.crises[c.key]))]),
      [results.portAName, "TOTAL", "100%",
        fmtPct(results.portATotal.r1), fmtPct(results.portATotal.r5), fmtPct(results.portATotal.r10),
        ...CRISES.map(c => fmtPct(results.portATotal.crises[c.key]))],
      [],
      ...results.rowsB.map(r => [results.portBName, r.ticker, r.weight + "%",
        fmtPct(r.r1), fmtPct(r.r5), fmtPct(r.r10), ...CRISES.map(c => fmtPct(r.crises[c.key]))]),
      [results.portBName, "TOTAL", "100%",
        fmtPct(results.portBTotal.r1), fmtPct(results.portBTotal.r5), fmtPct(results.portBTotal.r10),
        ...CRISES.map(c => fmtPct(results.portBTotal.crises[c.key]))],
    ];
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "portfolio_analysis.csv";
    a.click();
  }

  /* ─── Render ─────────────────────────────────────────────────────── */
  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ fontSize: "0.8125rem", fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.01em" }}>
          PORTFOLIO ANALYZER
        </div>
        <div style={{ fontSize: "0.6875rem", color: "var(--text-3)", marginTop: 2, letterSpacing: "0.04em" }}>
          ENTER UP TO 25 TICKERS PER PORTFOLIO · AUTO-FETCH RETURNS + DRAWDOWNS · SIDE-BY-SIDE COMPARISON
        </div>
      </div>

      {/* Portfolio inputs */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <PortfolioPanel port={portA} setPort={setPortA} color={GOLD} label="A" />
        <PortfolioPanel port={portB} setPort={setPortB} color={BLUE} label="B" />
      </div>

      {/* Benchmark note */}
      <div style={{
        display: "flex", alignItems: "center", gap: "0.5rem",
        padding: "0.5rem 0.875rem", borderRadius: 6, marginBottom: "1rem",
        background: "rgba(107,114,128,0.08)", border: "1px solid var(--border-c)",
        fontSize: "0.6875rem", color: "var(--text-3)",
      }}>
        <TrendingUp size={12} />
        S&P 500 (SPY) benchmark is automatically included for comparison.
        Data is cached 24 hours to minimize API calls (Alpha Vantage · 5 calls/min free tier).
      </div>

      {/* Run button */}
      <button
        onClick={runAnalysis}
        disabled={status?.running}
        style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          padding: "0.625rem 1.5rem", borderRadius: 7, cursor: status?.running ? "not-allowed" : "pointer",
          border: "none", fontWeight: 700, fontSize: "0.8125rem", letterSpacing: "0.02em",
          background: status?.running ? "rgba(201,168,76,0.3)" : GOLD,
          color: status?.running ? "rgba(255,255,255,0.5)" : "#07080a",
          transition: "all 0.15s",
        }}
      >
        <RefreshCw size={14} style={{ animation: status?.running ? "tSpin 1s linear infinite" : "none" }} />
        {status?.running ? `Fetching ${status.current}… (${status.done}/${status.total})` : "Run Analysis"}
      </button>
      <style>{`@keyframes tSpin{to{transform:rotate(360deg)}}`}</style>

      {/* Progress / errors */}
      {status && !status.running && status.errors?.length > 0 && (
        <div style={{
          marginTop: "0.75rem", padding: "0.625rem 0.875rem", borderRadius: 6,
          background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)",
          fontSize: "0.6875rem", color: RED,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontWeight: 700, marginBottom: 4 }}>
            <AlertTriangle size={12} /> Fetch warnings
          </div>
          {status.errors.map((e, i) => (
            <div key={i}>{e.ticker}: {e.error}</div>
          ))}
        </div>
      )}

      {/* Results */}
      {results && (
        <div style={{ marginTop: "1.5rem" }}>
          {/* Sub-tab nav */}
          <div style={{
            display: "flex", gap: "2px", marginBottom: "1rem",
            background: "var(--surface)", borderRadius: 8, padding: "4px",
            border: "1px solid var(--border-c)",
          }}>
            {[
              { key: "returns",   label: "Cumulative Returns" },
              { key: "drawdowns", label: "Crisis Drawdowns" },
              { key: "chart",     label: "Growth Chart" },
              { key: "compare",   label: "Portfolio Comparison" },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setView(t.key)}
                style={{
                  padding: "0.4375rem 0.875rem", borderRadius: 6, border: "none", cursor: "pointer",
                  fontSize: "0.6875rem", fontWeight: 600, whiteSpace: "nowrap",
                  background: view === t.key ? "rgba(201,168,76,0.12)" : "transparent",
                  color: view === t.key ? GOLD : "var(--text-3)",
                  borderBottom: view === t.key ? `2px solid ${GOLD}` : "2px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                {t.label}
              </button>
            ))}
            <button
              onClick={exportCSV}
              style={{
                marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.375rem",
                padding: "0.375rem 0.75rem", borderRadius: 6, border: "1px solid var(--border-c)",
                background: "transparent", color: "var(--text-3)", cursor: "pointer",
                fontSize: "0.6875rem", fontWeight: 600,
              }}
            >
              <Download size={12} /> Export CSV
            </button>
          </div>

          {/* RETURNS TABLE */}
          {view === "returns" && (
            <ReturnsTable results={results} />
          )}

          {/* DRAWDOWN TABLE */}
          {view === "drawdowns" && (
            <DrawdownTable results={results} />
          )}

          {/* GROWTH CHART */}
          {view === "chart" && (
            <GrowthChart results={results} />
          )}

          {/* COMPARE */}
          {view === "compare" && (
            <CompareView results={results} />
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Returns Table ──────────────────────────────────────────────── */
function ReturnsTable({ results }) {
  const { rowsA, rowsB, portATotal, portBTotal, spyMetrics, portAName, portBName } = results;

  const tableStyle = { width: "100%", borderCollapse: "collapse" };
  const thStyle = {
    fontSize: "0.5625rem", letterSpacing: "0.08em", color: "var(--text-3)",
    textTransform: "uppercase", padding: "6px 10px", textAlign: "right",
    borderBottom: "1px solid var(--border-c)",
  };
  const tdStyle = { padding: "7px 10px", borderBottom: "1px solid var(--border-c)", textAlign: "right" };

  const Block = ({ rows, total, name, color }) => (
    <>
      <tr>
        <td colSpan={6} style={{
          padding: "10px 10px 4px", fontSize: "0.625rem", fontWeight: 700,
          letterSpacing: "0.1em", color, textTransform: "uppercase",
          borderBottom: "1px solid var(--border-c)",
        }}>{name}</td>
      </tr>
      {rows.map(r => (
        <tr key={r.ticker} style={{ background: "transparent" }}>
          <td style={{ ...tdStyle, textAlign: "left" }}>
            <span style={{ fontFamily: "monospace", fontWeight: 600, fontSize: "0.75rem", color: "var(--text-1)" }}>
              {r.ticker}
            </span>
          </td>
          <td style={tdStyle}>
            <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>{r.weight}%</span>
          </td>
          <td style={tdStyle}><PctCell v={r.r1} /></td>
          <td style={tdStyle}><PctCell v={r.r5} /></td>
          <td style={tdStyle}><PctCell v={r.r10} /></td>
          <td style={tdStyle}><PctCell v={r.rinception} /></td>
        </tr>
      ))}
      <tr style={{ background: `${color}08` }}>
        <td style={{ ...tdStyle, textAlign: "left", fontWeight: 700, fontSize: "0.6875rem", color }}>
          WEIGHTED TOTAL
        </td>
        <td style={tdStyle}><span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>100%</span></td>
        <td style={tdStyle}><PctCell v={total.r1} bold /></td>
        <td style={tdStyle}><PctCell v={total.r5} bold /></td>
        <td style={tdStyle}><PctCell v={total.r10} bold /></td>
        <td style={tdStyle}><PctCell v={total.rinception} bold /></td>
      </tr>
    </>
  );

  return (
    <div style={{ background: "var(--surface)", borderRadius: 10, border: "1px solid var(--border-c)", overflow: "hidden" }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...thStyle, textAlign: "left" }}>Ticker</th>
            <th style={thStyle}>Weight</th>
            <th style={thStyle}>1-Year</th>
            <th style={thStyle}>5-Year</th>
            <th style={thStyle}>10-Year</th>
            <th style={thStyle}>Since Inception</th>
          </tr>
        </thead>
        <tbody>
          <Block rows={rowsA} total={results.portATotal} name={portAName} color={GOLD} />
          <tr><td colSpan={6} style={{ padding: "8px 0" }} /></tr>
          <Block rows={rowsB} total={results.portBTotal} name={portBName} color={BLUE} />
          <tr><td colSpan={6} style={{ padding: "8px 0" }} /></tr>
          <tr>
            <td colSpan={6} style={{
              padding: "10px 10px 4px", fontSize: "0.625rem", fontWeight: 700,
              letterSpacing: "0.1em", color: GRAY, textTransform: "uppercase",
              borderBottom: "1px solid var(--border-c)",
            }}>S&amp;P 500 Benchmark</td>
          </tr>
          <tr>
            <td style={{ ...tdStyle, textAlign: "left" }}>
              <span style={{ fontFamily: "monospace", fontWeight: 600, fontSize: "0.75rem", color: "var(--text-1)" }}>SPY</span>
            </td>
            <td style={tdStyle}><span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>100%</span></td>
            <td style={tdStyle}><PctCell v={spyMetrics.r1} /></td>
            <td style={tdStyle}><PctCell v={spyMetrics.r5} /></td>
            <td style={tdStyle}><PctCell v={spyMetrics.r10} /></td>
            <td style={tdStyle}><PctCell v={spyMetrics.rinception} /></td>
          </tr>
        </tbody>
      </table>
      <div style={{ padding: "0.75rem 1rem", fontSize: "0.5625rem", color: "var(--text-3)", borderTop: "1px solid var(--border-c)" }}>
        All returns are total return (dividends reinvested) · Monthly adjusted close · Source: Alpha Vantage
      </div>
    </div>
  );
}

/* ─── Drawdown Table ─────────────────────────────────────────────── */
function DrawdownTable({ results }) {
  const { rowsA, rowsB, portATotal, portBTotal, spyMetrics, portAName, portBName } = results;

  const tableStyle = { width: "100%", borderCollapse: "collapse" };
  const thStyle = {
    fontSize: "0.5rem", letterSpacing: "0.07em", color: "var(--text-3)",
    textTransform: "uppercase", padding: "6px 8px", textAlign: "right",
    borderBottom: "1px solid var(--border-c)", whiteSpace: "nowrap",
  };
  const tdStyle = { padding: "6px 8px", borderBottom: "1px solid var(--border-c)", textAlign: "right" };

  const Block = ({ rows, total, name, color }) => (
    <>
      <tr>
        <td colSpan={CRISES.length + 2} style={{
          padding: "10px 8px 4px", fontSize: "0.625rem", fontWeight: 700,
          letterSpacing: "0.1em", color, textTransform: "uppercase",
          borderBottom: "1px solid var(--border-c)",
        }}>{name}</td>
      </tr>
      {rows.map(r => (
        <tr key={r.ticker}>
          <td style={{ ...tdStyle, textAlign: "left" }}>
            <span style={{ fontFamily: "monospace", fontWeight: 600, fontSize: "0.6875rem", color: "var(--text-1)" }}>{r.ticker}</span>
          </td>
          <td style={tdStyle}><span style={{ fontSize: "0.625rem", color: "var(--text-3)" }}>{r.weight}%</span></td>
          {CRISES.map(c => (
            <td key={c.key} style={tdStyle}><PctCell v={r.crises[c.key]} /></td>
          ))}
        </tr>
      ))}
      <tr style={{ background: `${color}08` }}>
        <td style={{ ...tdStyle, textAlign: "left", fontWeight: 700, fontSize: "0.6875rem", color }}>WEIGHTED</td>
        <td style={tdStyle}><span style={{ fontSize: "0.625rem", color: "var(--text-3)" }}>100%</span></td>
        {CRISES.map(c => (
          <td key={c.key} style={tdStyle}><PctCell v={total.crises[c.key]} bold /></td>
        ))}
      </tr>
    </>
  );

  return (
    <div style={{ background: "var(--surface)", borderRadius: 10, border: "1px solid var(--border-c)", overflow: "auto" }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...thStyle, textAlign: "left" }}>Ticker</th>
            <th style={thStyle}>Wt</th>
            {CRISES.map(c => (
              <th key={c.key} style={thStyle}>
                <div>{c.label}</div>
                <div style={{ fontWeight: 400, opacity: 0.7 }}>{c.desc}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <Block rows={rowsA} total={portATotal} name={portAName} color={GOLD} />
          <tr><td colSpan={CRISES.length + 2} style={{ padding: "6px 0" }} /></tr>
          <Block rows={rowsB} total={portBTotal} name={portBName} color={BLUE} />
          <tr><td colSpan={CRISES.length + 2} style={{ padding: "6px 0" }} /></tr>
          <tr>
            <td colSpan={CRISES.length + 2} style={{
              padding: "10px 8px 4px", fontSize: "0.625rem", fontWeight: 700,
              letterSpacing: "0.1em", color: GRAY, textTransform: "uppercase",
              borderBottom: "1px solid var(--border-c)",
            }}>S&amp;P 500</td>
          </tr>
          <tr>
            <td style={{ ...tdStyle, textAlign: "left" }}>
              <span style={{ fontFamily: "monospace", fontWeight: 600, fontSize: "0.6875rem", color: "var(--text-1)" }}>SPY</span>
            </td>
            <td style={tdStyle}><span style={{ fontSize: "0.625rem", color: "var(--text-3)" }}>100%</span></td>
            {CRISES.map(c => (
              <td key={c.key} style={tdStyle}><PctCell v={spyMetrics.crises[c.key]} /></td>
            ))}
          </tr>
        </tbody>
      </table>
      <div style={{ padding: "0.75rem 1rem", fontSize: "0.5625rem", color: "var(--text-3)", borderTop: "1px solid var(--border-c)" }}>
        Drawdown measured peak-to-trough using monthly adjusted close · "—" = ticker not in market during crisis period
      </div>
    </div>
  );
}

/* ─── Growth Chart ────────────────────────────────────────────────── */
function GrowthChart({ results }) {
  const { chartData, portAName, portBName } = results;

  if (!chartData || chartData.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-3)", fontSize: "0.75rem" }}>
        Insufficient overlapping data to render chart.
      </div>
    );
  }

  const CustomTip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: "var(--elevated)", border: "1px solid var(--border-c)", borderRadius: 6, padding: "8px 12px", fontSize: "0.6875rem" }}>
        <div style={{ color: "var(--text-3)", marginBottom: 4 }}>{label}</div>
        {payload.map((p, i) => p.value !== null && (
          <div key={i} style={{ color: p.color, marginBottom: 2 }}>
            {p.name}: <strong>{p.value?.toFixed(1)}</strong> (base 100)
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ background: "var(--surface)", borderRadius: 10, border: "1px solid var(--border-c)", padding: "1.25rem" }}>
      <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--text-2)", marginBottom: "0.875rem", letterSpacing: "0.04em" }}>
        CUMULATIVE GROWTH (BASE 100) · 10-YEAR WINDOW
      </div>
      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="month"
            tickFormatter={v => v.slice(0, 7)}
            tick={{ fontSize: 10, fill: "var(--text-3)" }}
            interval={11}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--text-3)" }}
            tickFormatter={v => v.toFixed(0)}
            domain={["auto", "auto"]}
          />
          <Tooltip content={<CustomTip />} />
          <Legend wrapperStyle={{ fontSize: "0.6875rem" }} />
          <ReferenceLine y={100} stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4" />
          <Line type="monotone" dataKey={portAName} stroke={GOLD} dot={false} strokeWidth={2} connectNulls />
          <Line type="monotone" dataKey={portBName} stroke={BLUE} dot={false} strokeWidth={2} connectNulls />
          <Line type="monotone" dataKey="S&P 500" stroke={GRAY} dot={false} strokeWidth={1.5} strokeDasharray="4 3" connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─── Portfolio Comparison ───────────────────────────────────────── */
function CompareView({ results }) {
  const { portATotal, portBTotal, spyMetrics, portAName, portBName } = results;

  const StatRow = ({ label, a, b, spy, lowerIsBetter = false }) => {
    const av = a, bv = b;
    let winner = null;
    if (av !== null && bv !== null && !isNaN(av) && !isNaN(bv)) {
      winner = lowerIsBetter ? (av < bv ? "A" : "B") : (av > bv ? "A" : "B");
    }
    return (
      <tr>
        <td style={{ padding: "8px 12px", fontSize: "0.6875rem", color: "var(--text-3)", borderBottom: "1px solid var(--border-c)" }}>{label}</td>
        <td style={{
          padding: "8px 12px", textAlign: "center", borderBottom: "1px solid var(--border-c)",
          background: winner === "A" ? "rgba(201,168,76,0.07)" : "transparent",
        }}>
          <PctCell v={av} bold={winner === "A"} />
          {winner === "A" && <span style={{ fontSize: "0.5rem", marginLeft: 4, color: GOLD }}>▲</span>}
        </td>
        <td style={{
          padding: "8px 12px", textAlign: "center", borderBottom: "1px solid var(--border-c)",
          background: winner === "B" ? "rgba(59,130,246,0.07)" : "transparent",
        }}>
          <PctCell v={bv} bold={winner === "B"} />
          {winner === "B" && <span style={{ fontSize: "0.5rem", marginLeft: 4, color: BLUE }}>▲</span>}
        </td>
        <td style={{ padding: "8px 12px", textAlign: "center", borderBottom: "1px solid var(--border-c)" }}>
          <PctCell v={spy} />
        </td>
      </tr>
    );
  };

  // Compute worst crisis for each
  const worstCrisis = (total) => {
    const vals = CRISES.map(c => total.crises[c.key]).filter(v => v !== null && !isNaN(v));
    return vals.length > 0 ? Math.min(...vals) : null;
  };
  const bestCrisis = (total) => {
    const vals = CRISES.map(c => total.crises[c.key]).filter(v => v !== null && !isNaN(v));
    return vals.length > 0 ? Math.min(...vals) : null; // min is best (least negative)
  };

  // Comparison bar chart
  const barData = [
    { name: "1-Year", [portAName]: portATotal.r1, [portBName]: portBTotal.r1, "S&P 500": spyMetrics.r1 },
    { name: "5-Year", [portAName]: portATotal.r5, [portBName]: portBTotal.r5, "S&P 500": spyMetrics.r5 },
    { name: "10-Year", [portAName]: portATotal.r10, [portBName]: portBTotal.r10, "S&P 500": spyMetrics.r10 },
    ...CRISES.map(c => ({
      name: c.label.replace(" ", "\n"),
      [portAName]: portATotal.crises[c.key],
      [portBName]: portBTotal.crises[c.key],
      "S&P 500": spyMetrics.crises[c.key],
    })),
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
        {[
          { label: portAName, total: portATotal, color: GOLD },
          { label: portBName, total: portBTotal, color: BLUE },
          { label: "S&P 500 (SPY)", total: { ...spyMetrics, crises: spyMetrics.crises }, color: GRAY },
        ].map(({ label, total, color }) => (
          <div key={label} style={{
            background: "var(--surface)", borderRadius: 10, border: `1px solid ${color}30`,
            padding: "1rem", borderTop: `3px solid ${color}`,
          }}>
            <div style={{ fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.1em", color, textTransform: "uppercase", marginBottom: 12 }}>
              {label}
            </div>
            {[
              ["1-Year Return", total.r1],
              ["5-Year Return", total.r5],
              ["10-Year Return", total.r10],
              ["Worst Crisis", worstCrisis(total)],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid var(--border-c)" }}>
                <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>{k}</span>
                <PctCell v={v} />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Side-by-side table */}
      <div style={{ background: "var(--surface)", borderRadius: 10, border: "1px solid var(--border-c)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "10px 12px", fontSize: "0.5625rem", letterSpacing: "0.08em", color: "var(--text-3)", textTransform: "uppercase", textAlign: "left", borderBottom: "1px solid var(--border-c)" }}>Metric</th>
              <th style={{ padding: "10px 12px", fontSize: "0.5625rem", textAlign: "center", color: GOLD, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid var(--border-c)" }}>{portAName}</th>
              <th style={{ padding: "10px 12px", fontSize: "0.5625rem", textAlign: "center", color: BLUE, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid var(--border-c)" }}>{portBName}</th>
              <th style={{ padding: "10px 12px", fontSize: "0.5625rem", textAlign: "center", color: GRAY, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid var(--border-c)" }}>S&amp;P 500</th>
            </tr>
          </thead>
          <tbody>
            <StatRow label="1-Year Return" a={portATotal.r1} b={portBTotal.r1} spy={spyMetrics.r1} />
            <StatRow label="5-Year Return" a={portATotal.r5} b={portBTotal.r5} spy={spyMetrics.r5} />
            <StatRow label="10-Year Return" a={portATotal.r10} b={portBTotal.r10} spy={spyMetrics.r10} />
            <StatRow label="Since Inception" a={portATotal.rinception} b={portBTotal.rinception} spy={spyMetrics.rinception} />
            {CRISES.map(c => (
              <StatRow
                key={c.key}
                label={`${c.label} (${c.desc})`}
                a={portATotal.crises[c.key]}
                b={portBTotal.crises[c.key]}
                spy={spyMetrics.crises[c.key]}
                lowerIsBetter={false}
              />
            ))}
          </tbody>
        </table>
        <div style={{ padding: "0.75rem 1rem", fontSize: "0.5625rem", color: "var(--text-3)", borderTop: "1px solid var(--border-c)" }}>
          ▲ indicates better performer between the two portfolios. Crisis drawdowns: lower loss = better.
        </div>
      </div>

      {/* Bar chart */}
      <div style={{ background: "var(--surface)", borderRadius: 10, border: "1px solid var(--border-c)", padding: "1.25rem" }}>
        <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--text-2)", marginBottom: "0.875rem", letterSpacing: "0.04em" }}>
          RETURNS &amp; DRAWDOWNS · SIDE-BY-SIDE
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={barData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: "var(--text-3)" }} />
            <YAxis tick={{ fontSize: 10, fill: "var(--text-3)" }} tickFormatter={v => `${v.toFixed(0)}%`} />
            <Tooltip formatter={(v) => v !== null ? `${v >= 0 ? "+" : ""}${v?.toFixed(1)}%` : "—"}
              contentStyle={{ background: "var(--elevated)", border: "1px solid var(--border-c)", fontSize: "0.6875rem", color: "var(--text-1)" }}
              itemStyle={{ color: "var(--text-1)" }} />
            <Legend wrapperStyle={{ fontSize: "0.6875rem" }} />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
            <Bar dataKey={portAName} fill={GOLD} radius={[3, 3, 0, 0]} />
            <Bar dataKey={portBName} fill={BLUE} radius={[3, 3, 0, 0]} />
            <Bar dataKey="S&P 500" fill={GRAY} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
