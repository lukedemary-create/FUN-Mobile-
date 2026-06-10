import React, { useState, useEffect } from "react";
import { Zap, TrendingUp, TrendingDown, RefreshCw, Droplets, Flame, BarChart2, Fuel } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  ReferenceLine, Legend
} from "recharts";

const SERVER = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/* ─── Commodity prices strip ─────────────────────────────────────── */
// Prices as of April 11, 2026 — WTI elevated on tight supply & geopolitical risk premium
const BASE_COMMODITIES = [
  { symbol: "WTI",   name: "WTI Crude Oil",  price: 95.48, change: 1.24,  unit: "/bbl" },
  { symbol: "BRENT", name: "Brent Crude",     price: 98.72, change: 1.09,  unit: "/bbl" },
  { symbol: "NG",    name: "Natural Gas",     price: 3.49,  change: 0.8,   unit: "/MMBtu" },
  { symbol: "RBOB",  name: "Gasoline (avg)",  price: 3.18,  change: 0.6,   unit: "/gal" },
  { symbol: "HO",    name: "Heating Oil",     price: 3.04,  change: 0.4,   unit: "/gal" },
  { symbol: "PROP",  name: "Propane",         price: 1.02,  change: 0.2,   unit: "/gal" },
];

/* ─── OPEC+ data ──────────────────────────────────────────────────── */
// Apr 2026: OPEC+ maintaining production restraint supporting $90+ oil
// Saudi Arabia leading compliance; Kazakhstan and Iraq remain chronic overproducers
const OPEC_DATA = [
  { country: "Saudi Arabia", quota: 10.00, production: 9.75,  compliance: 98 },
  { country: "Russia",       quota: 9.50,  production: 9.38,  compliance: 99 },
  { country: "UAE",          quota: 3.22,  production: 3.19,  compliance: 99 },
  { country: "Iraq",         quota: 4.00,  production: 4.21,  compliance: 105 },
  { country: "Kuwait",       quota: 2.48,  production: 2.43,  compliance: 98 },
  { country: "Nigeria",      quota: 1.50,  production: 1.34,  compliance: 89 },
  { country: "Kazakhstan",   quota: 1.60,  production: 1.76,  compliance: 110 },
  { country: "Algeria",      quota: 0.91,  production: 0.90,  compliance: 99 },
];

/* ─── Energy sector stocks ────────────────────────────────────────── */
// Prices as of Apr 11, 2026 — energy sector outperforming on high crude
const ENERGY_STOCKS = [
  { symbol: "XLE", name: "Energy Select ETF", price: 97.84,  dayChange: 1.12,  ytd: 6.4,  divYield: 3.21 },
  { symbol: "XOM", name: "Exxon Mobil",       price: 121.36, dayChange: 0.94,  ytd: 6.6,  divYield: 3.38 },
  { symbol: "CVX", name: "Chevron",            price: 162.74, dayChange: 0.78,  ytd: 4.2,  divYield: 3.94 },
  { symbol: "COP", name: "ConocoPhillips",     price: 114.52, dayChange: 1.43,  ytd: 8.8,  divYield: 1.76 },
  { symbol: "SLB", name: "SLB",               price: 47.18,  dayChange: 1.68,  ytd: 4.2,  divYield: 2.38 },
  { symbol: "EOG", name: "EOG Resources",      price: 138.91, dayChange: 1.55,  ytd: 7.9,  divYield: 2.68 },
];

/* ─── Simulated data generators ──────────────────────────────────── */
function genWeekly(count, startVal, trend, noise, label = "value") {
  const data = [];
  let val = startVal;
  const now = new Date("2026-04-11");
  for (let i = count; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    val += trend + (Math.random() - 0.5) * noise * 2;
    data.push({
      date: d.toISOString().slice(0, 10),
      week: `W${String(Math.ceil(i / 4)).padStart(2, "0")}`,
      [label]: Math.max(0, +val.toFixed(2))
    });
  }
  return data;
}

function genMonthly(count, startVal, trend, noise) {
  const data = [];
  let val = startVal;
  const now = new Date("2026-04-11");
  for (let i = count; i >= 0; i--) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    val += trend + (Math.random() - 0.5) * noise * 2;
    const regular = Math.max(0, +val.toFixed(3));
    data.push({
      date: d.toISOString().slice(0, 7),
      regular,
      premium: +(regular * 1.25).toFixed(3)
    });
  }
  return data;
}

function genNgStorage(count) {
  const data = [];
  const now = new Date("2026-04-11");
  for (let i = count; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    const week = (i % 52);
    // Seasonal sine wave: high in fall, low in spring
    const seasonal = Math.sin((week / 52) * Math.PI * 2 + Math.PI) * 900;
    const base = 2100 + seasonal;
    const fiveYearAvg = 2000 + Math.sin((week / 52) * Math.PI * 2 + Math.PI) * 820;
    data.push({
      date: d.toISOString().slice(0, 10),
      storage: +(base + (Math.random() - 0.5) * 150).toFixed(0),
      avg5yr: +fiveYearAvg.toFixed(0)
    });
  }
  return data;
}

function genCrudeStorage(count) {
  const FIVE_YR_AVG = 440;
  const data = [];
  const now = new Date("2026-04-11");
  let val = 425;
  for (let i = count; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    val += (Math.random() - 0.5) * 8 + (FIVE_YR_AVG - val) * 0.03;
    const storage = Math.max(380, Math.min(510, +val.toFixed(1)));
    data.push({
      date: d.toISOString().slice(0, 10),
      storage,
      avg5yr: FIVE_YR_AVG,
      fill: storage > FIVE_YR_AVG ? "var(--up)" : "var(--down)"
    });
  }
  return data;
}

/* ─── Custom tooltip ──────────────────────────────────────────────── */
const TT = ({ active, payload, label, unit = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--elevated)", border: "1px solid var(--border-alt)", borderRadius: 5, padding: "8px 12px", fontSize: 11 }}>
      <div style={{ color: "var(--text-2)", marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || "var(--text-1)", fontWeight: 600 }}>
          {p.name}: {typeof p.value === "number" ? p.value.toFixed(2) : p.value}{unit}
        </div>
      ))}
    </div>
  );
};

/* ─── Commodity card ──────────────────────────────────────────────── */
function CommodityCard({ item, liveOffset }) {
  const price = (item.price + liveOffset * 0.01).toFixed(2);
  const up = item.change >= 0;
  return (
    <div className="t-card t-card-p t-card-hover" style={{ flex: "1 1 140px", minWidth: 130 }}>
      <div className="t-label" style={{ marginBottom: 4 }}>{item.symbol}</div>
      <div className="t-metric-lg t-mono" style={{ marginBottom: 2 }}>${price}</div>
      <div style={{ fontSize: "0.7rem", color: "var(--text-3)", marginBottom: 6 }}>{item.name}</div>
      <span className="t-badge" style={{
        background: up ? "var(--up-dim)" : "var(--down-dim)",
        color: up ? "var(--up)" : "var(--down)",
        border: `1px solid ${up ? "rgba(0,184,153,0.2)" : "rgba(255,59,92,0.2)"}`,
        fontSize: "0.7rem"
      }}>
        {up ? "▲" : "▼"} {Math.abs(item.change)}%
      </span>
    </div>
  );
}

/* ─── Bar with conditional color ─────────────────────────────────── */
const StorageBar = ({ x, y, width, height, value, avg5yr }) => {
  const fill = value > avg5yr ? "var(--up)" : "var(--down)";
  return <rect x={x} y={y} width={width} height={height} fill={fill} fillOpacity={0.75} rx={1} />;
};

/* ─── Main Component ─────────────────────────────────────────────── */
export default function Energy() {
  const [tick, setTick] = useState(0);
  const [fredData, setFredData] = useState({});
  const [loading, setLoading] = useState(true);

  // Live price sim
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  // FRED fetches
  useEffect(() => {
    let cancelled = false;
    const SERIES = {
      PAPR: { label: "Oil Production (Mbbl/d)", startVal: 12.9, trend: 0.02, noise: 0.15 },
      WCESTUS1: "crude_storage",
      GASREGCOVM: { label: "Regular Gas", startVal: 3.45, trend: -0.004, noise: 0.03 },
      WNGCSTUS: "ng_storage",
    };
    const keys = Object.keys(SERIES);
    Promise.all(
      keys.map(id =>
        fetch(`${SERVER}/api/fred/${id}`)
          .then(r => r.json())
          .then(j => ({ id, data: j.data }))
          .catch(() => ({ id, data: null }))
      )
    ).then(results => {
      if (cancelled) return;
      const map = {};
      results.forEach(r => { map[r.id] = r.data; });
      setFredData(map);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  // Generate chart data (use API data if available, else simulate)
  const productionData = (() => {
    if (fredData.PAPR?.length > 10) {
      return fredData.PAPR.slice(-104).map(d => ({
        date: d.date?.slice(0, 7) || d.date,
        production: +Number(d.value).toFixed(2)
      }));
    }
    return genWeekly(104, 12.9, 0.01, 0.12, "production");
  })();

  const crudeStorageData = (() => {
    if (fredData.WCESTUS1?.length > 10) {
      const AVG = 440;
      return fredData.WCESTUS1.slice(-52).map(d => ({
        date: d.date?.slice(5) || d.date,
        storage: +Number(d.value).toFixed(1),
        avg5yr: AVG
      }));
    }
    return genCrudeStorage(52).map(d => ({ ...d, date: d.date.slice(5) }));
  })();

  const gasData = (() => {
    if (fredData.GASREGCOVM?.length > 10) {
      return fredData.GASREGCOVM.slice(-36).map(d => ({
        date: d.date?.slice(0, 7) || d.date,
        regular: +Number(d.value).toFixed(3),
        premium: +(Number(d.value) * 1.25).toFixed(3)
      }));
    }
    return genMonthly(36, 3.45, -0.003, 0.04);
  })();

  const ngStorageData = genNgStorage(52).map(d => ({ ...d, date: d.date.slice(5) }));

  const liveOffset = Math.sin(tick * 0.7) + Math.cos(tick * 0.3);

  // Production vs consumption
  const latestProd = productionData[productionData.length - 1]?.production || 12.9;
  const consumption = 20.1;
  const prodPct = Math.round((latestProd / consumption) * 100);

  return (
    <div className="t-bg" style={{ padding: "1.5rem", minHeight: "100vh" }}>
      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border-c)",
        borderRadius: 20,
        padding: "2rem 2.25rem",
        marginBottom: "1.25rem",
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 var(--border-c)",
      }}>
        <div style={{
          position: "absolute", top: -60, right: -40,
          width: 320, height: 320,
          background: "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", position: "relative" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.625rem" }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Zap size={14} style={{ color: "var(--gold)" }} />
              </div>
              <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: "var(--text-1)", letterSpacing: "-0.01em", fontFamily: "'Inter', system-ui, sans-serif" }}>
                ENERGY{" "}
                <em style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", color: "var(--gold)", fontWeight: 400, fontSize: "1.5rem" }}>Markets</em>
              </h1>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.65, maxWidth: 560, margin: "0 0 1rem" }}>
              Monitor global energy markets in real time. Track crude oil, natural gas, and retail gasoline prices alongside key EIA inventory reports and energy sector trends.
            </p>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              {["WTI & Brent Crude", "Natural Gas", "EIA Data", "State Gas Prices"].map((label) => (
                <span key={label} style={{
                  fontSize: "0.6875rem", fontWeight: 700, padding: "3px 10px",
                  borderRadius: 99, letterSpacing: "0.04em",
                  background: "rgba(201,169,110,0.10)",
                  border: "1px solid rgba(201,169,110,0.25)",
                  color: "var(--gold)",
                }}>{label}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", flexShrink: 0 }}>
            {[
              { icon: Droplets, label: "Crude Oil", sub: "WTI & Brent spot prices", color: "#3b82f6" },
              { icon: Flame, label: "Natural Gas", sub: "Henry Hub & EIA data", color: "var(--gold)" },
              { icon: Fuel, label: "Gasoline Prices", sub: "National & state averages", color: "var(--teal)" },
              { icon: BarChart2, label: "Energy Stocks", sub: "XLE & sector leaders", color: "#f59e0b" },
            ].map(({ icon: Icon, label, sub, color }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: "0.625rem",
                padding: "0.625rem 0.875rem",
                background: "var(--bg)", border: "1px solid var(--border-c)",
                borderRadius: 10, minWidth: 170,
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  background: "rgba(201,169,110,0.1)",
                  border: "1px solid rgba(201,169,110,0.2)",
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

      {/* Commodity Strip */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {BASE_COMMODITIES.map((c, i) => (
          <CommodityCard key={c.symbol} item={c} liveOffset={liveOffset * (i % 2 === 0 ? 1 : -0.7)} />
        ))}
      </div>

      {/* Main 3-column grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1rem" }}>

        {/* 1. Oil Production */}
        <div className="t-card">
          <div className="t-card-p" style={{ borderBottom: "1px solid var(--border-c)" }}>
            <div className="t-section-title">
              <Droplets size={13} style={{ color: "var(--blue)" }} />
              Crude Oil Production (Mbbl/d)
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
              <span className="t-metric-lg t-mono">{latestProd.toFixed(2)}</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>Mbbl/d</span>
            </div>
          </div>
          <div style={{ padding: "0.75rem 0.5rem 0.5rem" }}>
            {loading ? (
              <div className="t-skeleton" style={{ height: 140, borderRadius: 4 }} />
            ) : (
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={productionData.slice(-52)} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--blue)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--blue)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: "var(--text-3)" }} tickLine={false} interval={12} />
                  <YAxis tick={{ fontSize: 9, fill: "var(--text-3)" }} tickLine={false} domain={["auto", "auto"]} />
                  <Tooltip content={<TT unit=" Mbbl/d" />} />
                  <Area type="monotone" dataKey="production" name="Production" stroke="var(--blue)" strokeWidth={2} fill="url(#prodGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 2. Crude Oil Storage */}
        <div className="t-card">
          <div className="t-card-p" style={{ borderBottom: "1px solid var(--border-c)" }}>
            <div className="t-section-title">U.S. Crude Oil Storage (MMbbl)</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: 1, background: "var(--up)", display: "inline-block" }} />
                <span style={{ fontSize: "0.7rem", color: "var(--text-3)" }}>Above 5yr avg</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: 1, background: "var(--down)", display: "inline-block" }} />
                <span style={{ fontSize: "0.7rem", color: "var(--text-3)" }}>Below 5yr avg</span>
              </div>
            </div>
          </div>
          <div style={{ padding: "0.75rem 0.5rem 0.5rem" }}>
            {loading ? (
              <div className="t-skeleton" style={{ height: 140, borderRadius: 4 }} />
            ) : (
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={crudeStorageData.slice(-26)} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: "var(--text-3)" }} tickLine={false} interval={6} />
                  <YAxis tick={{ fontSize: 9, fill: "var(--text-3)" }} tickLine={false} domain={[380, 510]} />
                  <Tooltip content={<TT unit=" MMbbl" />} />
                  <ReferenceLine y={440} stroke="var(--gold)" strokeDasharray="3 3" strokeOpacity={0.6} />
                  <Bar dataKey="storage" name="Storage" shape={<StorageBar />} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 3. Natural Gas Storage */}
        <div className="t-card">
          <div className="t-card-p" style={{ borderBottom: "1px solid var(--border-c)" }}>
            <div className="t-section-title">
              <Flame size={13} style={{ color: "var(--gold)" }} />
              Natural Gas Storage (Bcf)
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 16, height: 2, background: "var(--teal)", display: "inline-block" }} />
                <span style={{ fontSize: "0.7rem", color: "var(--text-3)" }}>Storage</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 16, height: 2, background: "var(--gold)", display: "inline-block", borderTop: "1px dashed var(--gold)" }} />
                <span style={{ fontSize: "0.7rem", color: "var(--text-3)" }}>5yr avg</span>
              </div>
            </div>
          </div>
          <div style={{ padding: "0.75rem 0.5rem 0.5rem" }}>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={ngStorageData.slice(-26)} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="ngGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--teal)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--teal)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: "var(--text-3)" }} tickLine={false} interval={6} />
                <YAxis tick={{ fontSize: 9, fill: "var(--text-3)" }} tickLine={false} domain={[800, 3500]} />
                <Tooltip content={<TT unit=" Bcf" />} />
                <Area type="monotone" dataKey="storage" name="Storage" stroke="var(--teal)" strokeWidth={2} fill="url(#ngGrad)" dot={false} />
                <Line type="monotone" dataKey="avg5yr" name="5yr Avg" stroke="var(--gold)" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Retail Gasoline Prices */}
        <div className="t-card">
          <div className="t-card-p" style={{ borderBottom: "1px solid var(--border-c)" }}>
            <div className="t-section-title">Retail Gasoline Prices ($/gal)</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 16, height: 2, background: "var(--gold)", display: "inline-block" }} />
                <span style={{ fontSize: "0.7rem", color: "var(--text-3)" }}>Regular</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 16, height: 2, background: "var(--blue)", display: "inline-block" }} />
                <span style={{ fontSize: "0.7rem", color: "var(--text-3)" }}>Premium</span>
              </div>
            </div>
          </div>
          <div style={{ padding: "0.75rem 0.5rem 0.5rem" }}>
            {loading ? (
              <div className="t-skeleton" style={{ height: 140, borderRadius: 4 }} />
            ) : (
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={gasData.slice(-36)} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: "var(--text-3)" }} tickLine={false} interval={8} />
                  <YAxis tick={{ fontSize: 9, fill: "var(--text-3)" }} tickLine={false} domain={["auto", "auto"]} />
                  <Tooltip content={<TT unit=" $/gal" />} />
                  <Line type="monotone" dataKey="regular" name="Regular" stroke="var(--gold)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="premium" name="Premium" stroke="var(--blue)" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 5. Energy Sector Stocks */}
        <div className="t-card">
          <div className="t-card-p" style={{ borderBottom: "1px solid var(--border-c)" }}>
            <div className="t-section-title">Energy Sector Stocks</div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="t-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th style={{ textAlign: "right" }}>Price</th>
                  <th style={{ textAlign: "right" }}>Day</th>
                  <th style={{ textAlign: "right" }}>YTD</th>
                  <th style={{ textAlign: "right" }}>Div</th>
                </tr>
              </thead>
              <tbody>
                {ENERGY_STOCKS.map(s => {
                  const livePrice = (s.price + liveOffset * 0.05).toFixed(2);
                  const dayUp = s.dayChange >= 0;
                  const ytdUp = s.ytd >= 0;
                  return (
                    <tr key={s.symbol}>
                      <td>
                        <div style={{ fontWeight: 700, color: "var(--gold)" }}>{s.symbol}</div>
                        <div style={{ fontSize: "0.65rem", color: "var(--text-3)" }}>{s.name}</div>
                      </td>
                      <td style={{ textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>${livePrice}</td>
                      <td style={{ textAlign: "right" }}>
                        <span style={{
                          color: dayUp ? "var(--up)" : "var(--down)",
                          fontWeight: 600,
                          fontSize: "0.8rem"
                        }}>
                          {dayUp ? "+" : ""}{s.dayChange}%
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <span style={{ color: ytdUp ? "var(--up)" : "var(--down)", fontWeight: 600, fontSize: "0.8rem" }}>
                          {ytdUp ? "+" : ""}{s.ytd}%
                        </span>
                      </td>
                      <td style={{ textAlign: "right", color: "var(--gold)", fontWeight: 600 }}>{s.divYield}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. Energy Independence */}
        <div className="t-card t-card-p">
          <div className="t-section-title" style={{ marginBottom: 16 }}>U.S. Energy Independence</div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div className="t-label" style={{ marginBottom: 4 }}>Domestic Production</div>
              <div className="t-metric-lg t-mono" style={{ color: "var(--up)" }}>{latestProd.toFixed(1)} Mbbl/d</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="t-label" style={{ marginBottom: 4 }}>Total Consumption</div>
              <div className="t-metric-lg t-mono" style={{ color: "var(--text-1)" }}>{consumption} Mbbl/d</div>
            </div>
          </div>

          {/* Production ratio bar */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-2)" }}>Production vs Consumption</span>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: prodPct >= 90 ? "var(--up)" : "var(--gold)" }}>{prodPct}%</span>
            </div>
            <div style={{ height: 10, borderRadius: 5, background: "var(--elevated)", border: "1px solid var(--border-c)", overflow: "hidden" }}>
              <div style={{
                width: `${Math.min(100, prodPct)}%`,
                height: "100%",
                borderRadius: 5,
                background: `linear-gradient(90deg, var(--up), ${prodPct >= 90 ? "var(--teal)" : "var(--gold)"})`,
                transition: "width 0.5s"
              }} />
            </div>
          </div>

          {/* Net import/export */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { label: "Net Import/Export", val: `${(consumption - latestProd).toFixed(1)} Mbbl/d`, note: "net imports", color: "var(--gold)" },
              { label: "Self-Sufficiency", val: `${prodPct}%`, note: "of demand met", color: prodPct >= 90 ? "var(--up)" : "var(--gold)" },
              { label: "Reserves (SPR)", val: "372 MMbbl", note: "strategic reserve", color: "var(--blue)" },
              { label: "Days of Supply", val: `${Math.round(372 / consumption)}d`, note: "at current use", color: "var(--text-2)" },
            ].map((m, i) => (
              <div key={i} style={{
                padding: "0.625rem",
                background: "var(--elevated)",
                borderRadius: 5,
                border: "1px solid var(--border-c)"
              }}>
                <div className="t-label" style={{ marginBottom: 3 }}>{m.label}</div>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: m.color, fontFamily: "monospace" }}>{m.val}</div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-3)" }}>{m.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OPEC+ Table */}
      <div className="t-card">
        <div className="t-card-p" style={{ borderBottom: "1px solid var(--border-c)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="t-section-title">OPEC+ PRODUCTION DATA</div>
          <span style={{ fontSize: "0.7rem", color: "var(--text-3)" }}>Quota & Actual in Mbbl/d · Apr 2026 · WTI ~$95/bbl</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="t-table">
            <thead>
              <tr>
                <th>Country</th>
                <th style={{ textAlign: "right" }}>Quota (Mbbl/d)</th>
                <th style={{ textAlign: "right" }}>Production (Mbbl/d)</th>
                <th style={{ textAlign: "right" }}>Variance</th>
                <th style={{ textAlign: "right" }}>Compliance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {OPEC_DATA.map((row, i) => {
                const variance = row.production - row.quota;
                const over = variance > 0;
                return (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{row.country}</td>
                    <td style={{ textAlign: "right", fontFamily: "monospace" }}>{row.quota.toFixed(2)}</td>
                    <td style={{ textAlign: "right", fontFamily: "monospace", fontWeight: 700 }}>{row.production.toFixed(2)}</td>
                    <td style={{ textAlign: "right" }}>
                      <span style={{ color: over ? "var(--down)" : "var(--up)", fontWeight: 700, fontFamily: "monospace" }}>
                        {over ? "+" : ""}{variance.toFixed(2)}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span style={{ color: row.compliance > 105 ? "var(--down)" : row.compliance < 95 ? "var(--gold)" : "var(--up)", fontWeight: 700 }}>
                        {row.compliance}%
                      </span>
                    </td>
                    <td>
                      <span style={{
                        display: "inline-block",
                        fontSize: "0.65rem",
                        padding: "2px 6px",
                        borderRadius: 3,
                        fontWeight: 700,
                        background: row.compliance > 105 ? "var(--down-dim)" : row.compliance < 95 ? "var(--gold-dim)" : "var(--up-dim)",
                        color: row.compliance > 105 ? "var(--down)" : row.compliance < 95 ? "var(--gold)" : "var(--up)",
                        border: `1px solid ${row.compliance > 105 ? "rgba(255,59,92,0.2)" : row.compliance < 95 ? "rgba(201,169,110,0.2)" : "rgba(0,184,153,0.2)"}`
                      }}>
                        {row.compliance > 105 ? "OVER QUOTA" : row.compliance < 95 ? "UNDER QUOTA" : "COMPLIANT"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{
          padding: "0.75rem 1rem",
          borderTop: "1px solid var(--border-c)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>
            Total Quota: {OPEC_DATA.reduce((s, r) => s + r.quota, 0).toFixed(2)} Mbbl/d
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-2)", fontWeight: 600 }}>
            Total Production: {OPEC_DATA.reduce((s, r) => s + r.production, 0).toFixed(2)} Mbbl/d
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>
            Next OPEC+ Meeting: May 5, 2026
          </span>
        </div>
      </div>
    </div>
  );
}
