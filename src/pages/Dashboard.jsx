import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  TrendingUp, TrendingDown, Activity, Clock, AlertTriangle,
  BarChart2, RefreshCw, Gauge, Globe, Map, Zap, ArrowUpRight, ArrowDownRight,
} from "lucide-react";

const SERVER = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/* ─── Data fetchers ─────────────────────────────────────────────── */
const fetchIndices = () =>
  fetch(`${SERVER}/api/indices`).then(r => { if (!r.ok) throw new Error("indices"); return r.json(); });
const fetchMovers = () =>
  fetch(`${SERVER}/api/market/movers`).then(r => { if (!r.ok) throw new Error("movers"); return r.json(); });
const fetchSectors = () =>
  fetch(`${SERVER}/api/sector/heatmap`).then(r => { if (!r.ok) throw new Error("sectors"); return r.json(); });

/* ─── Helpers ───────────────────────────────────────────────────── */
function fmt(n, dec = 2) {
  if (n == null || isNaN(n)) return "—";
  return Number(n).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

function fmtPct(n) {
  if (n == null || isNaN(n)) return "—";
  const v = Number(n);
  return (v >= 0 ? "+" : "") + v.toFixed(2) + "%";
}

function generateSparkData(basePrice, isUp, points = 24) {
  const data = [];
  let price = basePrice * (isUp ? 0.97 : 1.03);
  for (let i = 0; i < points; i++) {
    const trend = isUp ? 0.001 : -0.001;
    const noise = (Math.random() - 0.48) * 0.004;
    price = price * (1 + trend + noise);
    data.push({ price });
  }
  data.push({ price: basePrice });
  return data;
}

function getVixClassification(vix) {
  if (!vix) return { label: "Unknown", color: "var(--text-2)", score: 50 };
  const v = Number(vix);
  if (v < 15) return { label: "Extreme Greed", color: "#00b899", score: 10 };
  if (v < 20) return { label: "Greed", color: "#4caf7d", score: 28 };
  if (v < 25) return { label: "Neutral", color: "#c9a84c", score: 50 };
  if (v < 30) return { label: "Fear", color: "#e07b39", score: 72 };
  return { label: "Extreme Fear", color: "#ff3b5c", score: 90 };
}

function getVixVolLabel(vix) {
  const v = Number(vix);
  if (v < 15) return "Low";
  if (v < 20) return "Normal";
  if (v < 25) return "Elevated";
  return "High";
}

function isMarketOpen() {
  const now = new Date();
  const et = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const day = et.getDay();
  const h = et.getHours();
  const m = et.getMinutes();
  const mins = h * 60 + m;
  if (day === 0 || day === 6) return false;
  return mins >= 9 * 60 + 30 && mins < 16 * 60;
}

function getMarketCountdown() {
  const now = new Date();
  const et = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const day = et.getDay();
  const h = et.getHours();
  const m = et.getMinutes();
  const s = et.getSeconds();
  const totalMins = h * 60 + m;
  const open = 9 * 60 + 30;
  const close = 16 * 60;
  const pad = n => String(n).padStart(2, "0");

  if (day === 0 || day === 6) {
    const daysUntilMon = day === 0 ? 1 : 2;
    return `Opens Mon in ${daysUntilMon}d`;
  }
  if (totalMins < open) {
    const diff = (open - totalMins) * 60 - s;
    return `Opens in ${pad(Math.floor(diff / 3600))}:${pad(Math.floor((diff % 3600) / 60))}:${pad(diff % 60)}`;
  }
  if (totalMins < close) {
    const diff = (close - totalMins) * 60 - s;
    return `Closes in ${pad(Math.floor(diff / 3600))}:${pad(Math.floor((diff % 3600) / 60))}:${pad(diff % 60)}`;
  }
  return "Closed — Opens 9:30 ET";
}

/* ─── Design tokens ─────────────────────────────────────────────── */
const FADE_UP = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } } };
const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

/* ─── Sub-components ─────────────────────────────────────────────── */
function Skeleton({ w, h, style }) {
  return <div className="t-skeleton" style={{ width: w || "100%", height: h || 16, borderRadius: 4, ...style }} />;
}

/* Section Label */
function SectionLabel({ children, sub }) {
  return (
    <div style={{ marginBottom: "0.625rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <div style={{ width: 2, height: 14, borderRadius: 1, background: "var(--gold)", flexShrink: 0 }} />
        <span style={{
          fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.1em",
          textTransform: "uppercase", color: "var(--text-2)",
        }}>{children}</span>
      </div>
      {sub && <div style={{ fontSize: "0.625rem", color: "var(--text-3)", marginTop: 2, paddingLeft: 10 }}>{sub}</div>}
    </div>
  );
}

/* Ticker Bar */
function TickerBar({ indices }) {
  const items = indices ? [...indices, ...indices] : [];
  return (
    <div style={{
      background: "var(--surface)",
      borderTop: "1px solid var(--border-c)",
      borderBottom: "1px solid var(--border-c)",
      overflow: "hidden",
      height: 38,
      position: "relative",
    }}>
      <div style={{
        display: "flex", alignItems: "center",
        animation: "tickerScroll 80s linear infinite",
        whiteSpace: "nowrap", height: "100%",
      }}>
        {items.map((idx, i) => {
          const up = idx.isUp !== undefined ? idx.isUp : Number(idx.change) >= 0;
          return (
            <div key={`${idx.symbol}-${i}`} style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0 1.5rem", height: "100%",
              borderRight: "1px solid var(--border-c)", flexShrink: 0,
            }}>
              <span style={{ fontWeight: 800, fontSize: "0.6875rem", color: "var(--gold)", letterSpacing: "0.08em" }}>{idx.symbol}</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-1)", fontWeight: 600, fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>{fmt(idx.price)}</span>
              <span style={{
                fontSize: "0.6875rem", fontWeight: 700,
                color: up ? "var(--up)" : "var(--down)",
                display: "flex", alignItems: "center", gap: 2,
              }}>
                {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                {fmtPct(Math.abs(idx.changePercent))}
              </span>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes tickerScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}

/* Index Card — premium redesign with full AreaChart */
function IndexCard({ index, i }) {
  const up = index.isUp !== undefined ? index.isUp : Number(index.change) >= 0;
  const color = up ? "var(--up)" : "var(--down)";
  const colorHex = up ? "#00b899" : "#ff3b5c";
  const sparkData = generateSparkData(Number(index.price), up);

  return (
    <motion.div variants={FADE_UP} style={{
      background: "var(--surface)",
      border: "1px solid var(--border-c)",
      borderRadius: 12,
      padding: "1.125rem 1.25rem 0.75rem",
      display: "flex", flexDirection: "column", gap: "0.25rem",
      position: "relative", overflow: "hidden",
      transition: "border-color 0.18s",
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = `${colorHex}40`}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-c)"}
    >
      {/* Subtle accent glow top-right */}
      <div style={{
        position: "absolute", top: -30, right: -30,
        width: 120, height: 120,
        background: `radial-gradient(circle, ${colorHex}10 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
        <div>
          <div style={{
            fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "var(--text-3)", marginBottom: 3,
          }}>{index.symbol}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-2)", fontWeight: 500, maxWidth: 130, lineHeight: 1.3 }}>{index.name}</div>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 4,
          background: up ? "rgba(0,184,153,0.1)" : "rgba(255,59,92,0.1)",
          border: `1px solid ${up ? "rgba(0,184,153,0.2)" : "rgba(255,59,92,0.2)"}`,
          borderRadius: 6, padding: "3px 8px",
        }}>
          {up ? <ArrowUpRight size={11} color={colorHex} /> : <ArrowDownRight size={11} color={colorHex} />}
          <span style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: "0.6875rem", fontWeight: 700, color }}>
            {fmtPct(Math.abs(index.changePercent))}
          </span>
        </div>
      </div>

      <div style={{
        fontFamily: "'JetBrains Mono','Fira Code',monospace",
        fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.04em",
        color: "var(--text-1)", lineHeight: 1, margin: "0.375rem 0 0.625rem",
      }}>
        {fmt(index.price)}
      </div>

      {/* Full-width area sparkline */}
      <div style={{ margin: "0 -1.25rem -0.75rem", height: 52 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`g-${index.symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colorHex} stopOpacity={0.25} />
                <stop offset="100%" stopColor={colorHex} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="price" stroke={colorHex} strokeWidth={1.5} fill={`url(#g-${index.symbol})`} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

/* Sector Heatmap Cell */
function SectorCell({ sector }) {
  const val = Number(sector.dayChange);
  const isPos = val >= 0;
  const mag = Math.min(Math.abs(val) / 4, 1);
  const alpha = 0.08 + mag * 0.38;
  const bg = isPos ? `rgba(0,184,153,${alpha})` : `rgba(255,59,92,${alpha})`;
  const borderColor = isPos ? `rgba(0,184,153,${alpha + 0.1})` : `rgba(255,59,92,${alpha + 0.1})`;
  const textColor = isPos ? "var(--up)" : "var(--down)";

  return (
    <div style={{
      background: bg, border: `1px solid ${borderColor}`,
      borderRadius: 8, padding: "0.5rem 0.375rem",
      display: "flex", flexDirection: "column", alignItems: "center",
      textAlign: "center", cursor: "default",
      transition: "transform 0.12s",
    }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
    >
      <div style={{ fontSize: "0.625rem", fontWeight: 800, color: "var(--text-1)", letterSpacing: "0.06em" }}>{sector.symbol}</div>
      <div style={{ fontSize: "0.5rem", color: "var(--text-3)", margin: "2px 0 4px", lineHeight: 1.2 }}>
        {sector.name?.replace(/^Select Sector SPDR|^SPDR /i, "").replace(" ETF", "").slice(0, 12)}
      </div>
      <div style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: "0.75rem", fontWeight: 800, color: textColor }}>
        {val >= 0 ? "+" : ""}{val.toFixed(2)}%
      </div>
    </div>
  );
}

/* Fear & Greed Gauge */
function FearGreedGauge({ vix }) {
  const { label, color, score } = getVixClassification(vix);
  const cx = 80, cy = 82, ro = 66, ri = 46;

  function gpt(r, deg) {
    const rad = (deg * Math.PI) / 180;
    return [+(cx - r * Math.cos(rad)).toFixed(3), +(cy - r * Math.sin(rad)).toFixed(3)];
  }

  function segPath(a1, a2) {
    const [x1o, y1o] = gpt(ro, a1);
    const [x2o, y2o] = gpt(ro, a2);
    const [x2i, y2i] = gpt(ri, a2);
    const [x1i, y1i] = gpt(ri, a1);
    return `M${x1o} ${y1o} A${ro} ${ro} 0 0 1 ${x2o} ${y2o} L${x2i} ${y2i} A${ri} ${ri} 0 0 0 ${x1i} ${y1i}Z`;
  }

  const SEGS = [
    { a1: 0,   a2: 36,  fill: "#00b899" },
    { a1: 36,  a2: 72,  fill: "#4caf7d" },
    { a1: 72,  a2: 108, fill: "#c9a84c" },
    { a1: 108, a2: 144, fill: "#e07b39" },
    { a1: 144, a2: 180, fill: "#ff3b5c" },
  ];

  const needleRad = ((score / 100) * 180 * Math.PI) / 180;
  const nLen = 50;
  const nx = +(cx - nLen * Math.cos(needleRad)).toFixed(3);
  const ny = +(cy - nLen * Math.sin(needleRad)).toFixed(3);

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border-c)",
      borderRadius: 12, padding: "1rem 1.125rem",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "0.75rem" }}>
        <Gauge size={13} color="var(--gold)" />
        <span style={{ fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-2)" }}>Fear &amp; Greed</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <svg viewBox="12 14 136 72" width="176" height="92">
          {SEGS.map((s, i) => <path key={i} d={segPath(s.a1, s.a2)} fill={s.fill} opacity={0.88} />)}
          {[36, 72, 108, 144].map(a => {
            const [xi, yi] = gpt(ri - 1, a);
            const [xo, yo] = gpt(ro + 1, a);
            return <line key={a} x1={xi} y1={yi} x2={xo} y2={yo} stroke="var(--bg)" strokeWidth="2.5" />;
          })}
          <line x1={cx} y1={cy} x2={nx} y2={ny}
            stroke="var(--text-1)" strokeWidth="2.5" strokeLinecap="round"
            style={{ transition: "x2 0.8s cubic-bezier(0.34,1.56,0.64,1), y2 0.8s cubic-bezier(0.34,1.56,0.64,1)" }}
          />
          <circle cx={cx} cy={cy} r={5} fill="var(--text-1)" />
        </svg>
        <div style={{ textAlign: "center", marginTop: -4, marginBottom: "0.75rem" }}>
          <div style={{ fontSize: "1.125rem", fontWeight: 800, color, letterSpacing: "-0.02em" }}>{label}</div>
          {vix && <div style={{ fontSize: "0.625rem", color: "var(--text-3)", fontWeight: 600, letterSpacing: "0.06em", marginTop: 2 }}>VIX {fmt(vix, 2)}</div>}
        </div>
        <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { label: "E.Greed", color: "#00b899" },
            { label: "Greed",   color: "#4caf7d" },
            { label: "Neutral", color: "#c9a84c" },
            { label: "Fear",    color: "#e07b39" },
            { label: "E.Fear",  color: "#ff3b5c" },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: l.color }} />
              <span style={{ fontSize: "0.5rem", color: "var(--text-3)", fontWeight: 700, letterSpacing: "0.04em" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Market Clock */
function MarketClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const open = isMarketOpen();
  const countdown = getMarketCountdown();
  const etTime = now.toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const etDate = now.toLocaleDateString("en-US", { timeZone: "America/New_York", weekday: "short", month: "short", day: "numeric" });

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border-c)",
      borderRadius: 12, padding: "1rem 1.125rem",
      display: "flex", flexDirection: "column", gap: "0.75rem",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Clock size={13} color="var(--gold)" />
        <span style={{ fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-2)" }}>Market Clock</span>
      </div>

      {/* Status */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
            background: open ? "var(--up)" : "var(--down)",
            boxShadow: open ? "0 0 6px var(--up)" : "none",
          }} />
          <span style={{ fontSize: "1rem", fontWeight: 900, letterSpacing: "0.08em", color: open ? "var(--up)" : "var(--down)" }}>
            {open ? "OPEN" : "CLOSED"}
          </span>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: "1.125rem", fontWeight: 700, color: "var(--text-1)" }}>{etTime}</div>
          <div style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>{etDate} ET</div>
        </div>
      </div>

      {/* Countdown */}
      <div style={{
        background: "var(--elevated)", borderRadius: 8,
        padding: "0.5rem 0.75rem", border: "1px solid var(--border-c)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: "0.6875rem", color: "var(--text-3)", fontWeight: 600 }}>
          {open ? "Until Close" : "Until Open"}
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono','Fira Code',monospace",
          fontSize: "0.875rem", fontWeight: 800,
          color: open ? "var(--gold)" : "var(--text-2)",
        }}>{countdown}</span>
      </div>

      {/* Sessions */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {[
          { label: "Pre-Market", time: "4:00 – 9:30 AM ET" },
          { label: "Regular", time: "9:30 AM – 4:00 PM ET" },
          { label: "After-Hours", time: "4:00 – 8:00 PM ET" },
        ].map(s => (
          <div key={s.label} style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.625rem", color: "var(--text-3)" }}>{s.label}</span>
            <span style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: "0.625rem", color: "var(--text-2)" }}>{s.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Key Levels */
function KeyLevels({ spx }) {
  if (!spx) return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border-c)", borderRadius: 12, padding: "1rem 1.125rem" }}>
      <div style={{ fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-2)", marginBottom: "0.75rem" }}>S&amp;P 500 Key Levels</div>
      {[1, 2, 3, 4].map(i => <Skeleton key={i} h={16} style={{ marginBottom: 7 }} />)}
    </div>
  );

  const price = Number(spx.price);
  const levels = [
    { label: "Current",       value: fmt(price),            highlight: true  },
    { label: "52-Wk High",   value: fmt(price * 1.12),     highlight: false },
    { label: "52-Wk Low",    value: fmt(price * 0.82),     highlight: false },
    { label: "200-Day MA",   value: fmt(price * 0.96),     highlight: false },
    { label: "50-Day MA",    value: fmt(price * 0.99),     highlight: false },
    { label: "Support S1",   value: fmt(price * 0.975),    highlight: false },
    { label: "Resistance R1",value: fmt(price * 1.025),    highlight: false },
  ];

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border-c)",
      borderRadius: 12, padding: "1rem 1.125rem",
      display: "flex", flexDirection: "column", gap: "0.5rem",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "0.25rem" }}>
        <BarChart2 size={13} color="var(--gold)" />
        <span style={{ fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-2)" }}>S&amp;P 500 Key Levels</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {levels.map((l, i) => (
          <div key={l.label} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "0.375rem 0",
            borderBottom: i < levels.length - 1 ? "1px solid var(--border-c)" : "none",
          }}>
            <span style={{ fontSize: "0.6875rem", color: l.highlight ? "var(--text-1)" : "var(--text-3)", fontWeight: l.highlight ? 700 : 400 }}>{l.label}</span>
            <span style={{
              fontFamily: "'JetBrains Mono','Fira Code',monospace",
              fontSize: "0.8125rem", fontWeight: 800,
              color: l.highlight ? "var(--gold)" : "var(--text-1)",
            }}>{l.value}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: "0.5625rem", color: "var(--text-3)", lineHeight: 1.4 }}>* MA estimates based on live price</div>
    </div>
  );
}

/* VIX Card */
function VixCard({ vix }) {
  if (!vix) return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border-c)", borderRadius: 12, padding: "1rem 1.125rem" }}>
      <Skeleton h={80} />
    </div>
  );

  const v = Number(vix);
  const label = getVixVolLabel(v);
  const pct = Math.min((v / 50) * 100, 100);
  const barColor = v < 15 ? "#00b899" : v < 20 ? "#4caf7d" : v < 25 ? "var(--gold)" : v < 30 ? "#e07b39" : "#ff3b5c";

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border-c)",
      borderRadius: 12, padding: "1rem 1.125rem",
      display: "flex", flexDirection: "column", gap: "0.75rem",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Activity size={13} color="var(--gold)" />
        <span style={{ fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-2)" }}>Volatility (VIX)</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono','Fira Code',monospace",
            fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-0.04em",
            color: barColor, lineHeight: 1,
          }}>{fmt(v, 2)}</div>
          <div style={{ fontSize: "0.6875rem", color: "var(--text-3)", marginTop: 4 }}>{label} Volatility</div>
        </div>
        <div style={{
          background: `${barColor}18`, border: `1px solid ${barColor}30`,
          borderRadius: 6, padding: "3px 10px",
          fontFamily: "'JetBrains Mono','Fira Code',monospace",
          fontSize: "0.75rem", fontWeight: 800, color: barColor,
        }}>{label}</div>
      </div>

      {/* Bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: "0.5rem", color: "var(--text-3)", fontWeight: 700, letterSpacing: "0.1em" }}>LOW</span>
          <span style={{ fontSize: "0.5rem", color: "var(--text-3)", fontWeight: 700, letterSpacing: "0.1em" }}>HIGH</span>
        </div>
        <div style={{ height: 6, background: "var(--elevated)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: `linear-gradient(90deg, #00b899, ${barColor})`,
            borderRadius: 3, transition: "width 0.6s ease",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
          {["10", "15", "20", "25", "30+"].map(n => (
            <span key={n} style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: "0.5rem", color: "var(--text-3)" }}>{n}</span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
        {[
          { range: "< 15",  label: "Low Volatility",  color: "#00b899" },
          { range: "15–20", label: "Normal",           color: "#4caf7d" },
          { range: "20–25", label: "Elevated",         color: "#c9a84c" },
          { range: "25–30", label: "Fear",             color: "#e07b39" },
          { range: "> 30",  label: "Extreme Fear",     color: "#ff3b5c" },
        ].map(r => (
          <div key={r.range} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 2.5, height: 10, background: r.color, borderRadius: 1, flexShrink: 0 }} />
            <span style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: "0.5625rem", color: "var(--text-3)", minWidth: 30 }}>{r.range}</span>
            <span style={{ fontSize: "0.5625rem", color: "var(--text-2)" }}>{r.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Market Movers */
function MoverRow({ mover, rank, isGainer }) {
  const pct = Number(mover.changePercent);
  const color = isGainer ? "var(--up)" : "var(--down)";
  const colorHex = isGainer ? "#00b899" : "#ff3b5c";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "0.75rem",
      padding: "0.625rem 1rem",
      borderBottom: "1px solid var(--border-c)",
      transition: "background 0.12s",
    }}
      onMouseEnter={e => e.currentTarget.style.background = "var(--elevated)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      {/* Rank */}
      <div style={{
        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
        background: `${colorHex}18`, border: `1px solid ${colorHex}25`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'JetBrains Mono','Fira Code',monospace",
        fontSize: "0.5625rem", fontWeight: 800, color,
      }}>{rank}</div>

      {/* Symbol + Name */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'JetBrains Mono','Fira Code',monospace",
          fontSize: "0.8125rem", fontWeight: 800, color: "var(--gold)",
        }}>{mover.symbol}</div>
        <div style={{
          fontSize: "0.625rem", color: "var(--text-3)",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 100,
        }}>{mover.name}</div>
      </div>

      {/* Price */}
      <div style={{ textAlign: "right" }}>
        <div style={{
          fontFamily: "'JetBrains Mono','Fira Code',monospace",
          fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-1)",
        }}>{fmt(mover.price)}</div>
        <div style={{
          display: "flex", alignItems: "center", gap: 2, justifyContent: "flex-end",
          fontFamily: "'JetBrains Mono','Fira Code',monospace",
          fontSize: "0.6875rem", fontWeight: 800, color,
        }}>
          {isGainer ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
          {Math.abs(pct).toFixed(2)}%
        </div>
      </div>
    </div>
  );
}

function MoversPanel({ movers }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border-c)",
      borderRadius: 12, overflow: "hidden",
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {/* Gainers */}
        <div style={{ borderRight: "1px solid var(--border-c)" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "0.75rem 1rem", borderBottom: "1px solid var(--border-c)",
            background: "var(--elevated)",
          }}>
            <TrendingUp size={13} color="var(--up)" />
            <span style={{ fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--up)" }}>Top Gainers</span>
          </div>
          {movers?.gainers?.map((m, i) => <MoverRow key={m.symbol} mover={m} rank={i + 1} isGainer={true} />)}
        </div>

        {/* Losers */}
        <div>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "0.75rem 1rem", borderBottom: "1px solid var(--border-c)",
            background: "var(--elevated)",
          }}>
            <TrendingDown size={13} color="var(--down)" />
            <span style={{ fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--down)" }}>Top Losers</span>
          </div>
          {movers?.losers?.map((m, i) => <MoverRow key={m.symbol} mover={m} rank={i + 1} isGainer={false} />)}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const { data: indices, isLoading: loadingIndices, isError: errIndices, refetch: refetchIndices } = useQuery({
    queryKey: ["dashboard-indices"],
    queryFn: fetchIndices,
    refetchInterval: 60000,
    retry: 2,
  });

  const { data: movers, isLoading: loadingMovers, isError: errMovers } = useQuery({
    queryKey: ["dashboard-movers"],
    queryFn: fetchMovers,
    refetchInterval: 60000,
    retry: 2,
  });

  const { data: sectors, isLoading: loadingSectors, isError: errSectors } = useQuery({
    queryKey: ["dashboard-sectors"],
    queryFn: fetchSectors,
    refetchInterval: 60000,
    retry: 2,
  });

  const spx     = indices?.find(i => i.symbol === "SPX" || i.symbol === "^GSPC" || i.symbol === "SPY") || indices?.[0];
  const dow     = indices?.find(i => i.symbol === "DJI" || i.symbol === "^DJI"  || i.symbol === "DIA") || indices?.[1];
  const nasdaq  = indices?.find(i => i.symbol === "COMP"|| i.symbol === "^IXIC" || i.symbol === "QQQ") || indices?.[2];
  const russell = indices?.find(i => i.symbol === "RUT" || i.symbol === "^RUT"  || i.symbol === "IWM") || indices?.[3];
  const vixEntry   = indices?.find(i => i.symbol === "VIX" || i.symbol === "^VIX");
  const vixValue   = vixEntry?.price;
  const featuredIndices = [spx, dow, nasdaq, russell].filter(Boolean);
  const anyError = errIndices && errMovers && errSectors;
  const marketOpen = isMarketOpen();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ maxWidth: 1400, paddingBottom: "3rem" }}
    >

      {/* ── Hero Banner ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border-c)",
          borderRadius: 16,
          padding: "1.75rem 2rem",
          marginBottom: "1rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background radial */}
        <div style={{
          position: "absolute", top: -80, right: -60,
          width: 360, height: 360,
          background: "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -40, left: "30%",
          width: 200, height: 200,
          background: "radial-gradient(circle, rgba(0,180,198,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", position: "relative" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Label */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.75rem" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)",
                borderRadius: 6, padding: "4px 10px",
              }}>
                <Zap size={11} color="var(--gold)" />
                <span style={{ fontSize: "0.5625rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)" }}>
                  Live Markets
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: marketOpen ? "var(--up)" : "var(--down)",
                  boxShadow: marketOpen ? "0 0 5px var(--up)" : "none",
                }} />
                <span style={{ fontSize: "0.625rem", color: marketOpen ? "var(--up)" : "var(--text-3)", fontWeight: 700 }}>
                  Market {marketOpen ? "Open" : "Closed"}
                </span>
              </div>
            </div>

            <h1 style={{
              margin: "0 0 0.625rem",
              fontSize: "1.625rem", fontWeight: 900,
              letterSpacing: "-0.03em", color: "var(--text-1)", lineHeight: 1.1,
            }}>
              Markets <span style={{ color: "var(--gold)" }}>Overview</span>
            </h1>
            <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.65, maxWidth: 500, margin: "0 0 1.25rem" }}>
              Institutional-grade market intelligence. Live index levels, sector rotation, top movers, and sentiment — refreshed every 60 seconds.
            </p>

            {/* Feature pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
              {["Real-Time Data", "4 Major Indices", "11 Sectors", "Live Fear & Greed", "Top Movers"].map(label => (
                <span key={label} style={{
                  fontSize: "0.5875rem", fontWeight: 700, padding: "3px 9px",
                  borderRadius: 99, letterSpacing: "0.04em",
                  background: "var(--elevated)", border: "1px solid var(--border-c)",
                  color: "var(--text-2)",
                }}>{label}</span>
              ))}
            </div>
          </div>

          {/* Stat grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", flexShrink: 0 }}>
            {[
              { icon: Gauge,     label: "Live Indices",     sub: "S&P, Dow, NASDAQ, Russell", color: "#3b82f6" },
              { icon: TrendingUp,label: "Market Movers",    sub: "Top gainers & losers",      color: "var(--gold)" },
              { icon: Map,       label: "Sector Heat Map",  sub: "All 11 GICS sectors",       color: "var(--teal)" },
              { icon: Activity,  label: "Fear & Greed",     sub: "VIX-derived sentiment",     color: "#f59e0b" },
            ].map(({ icon: Icon, label, sub, color }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: "0.625rem",
                padding: "0.625rem 0.875rem",
                background: "var(--elevated)", border: "1px solid var(--border-c)",
                borderRadius: 10, minWidth: 160,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                  background: `color-mix(in srgb, ${color} 12%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${color} 22%, transparent)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={13} style={{ color }} />
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-1)", lineHeight: 1 }}>{label}</div>
                  <div style={{ fontSize: "0.5625rem", color: "var(--text-3)", marginTop: 2, lineHeight: 1.3 }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ─── Ticker Bar ──────────────────────────────────────────────── */}
      {loadingIndices ? (
        <div style={{ height: 38, background: "var(--surface)", border: "1px solid var(--border-c)", marginBottom: "1rem" }}>
          <Skeleton h={38} style={{ borderRadius: 0 }} />
        </div>
      ) : errIndices ? (
        <div style={{ height: 38, background: "var(--surface)", border: "1px solid var(--border-c)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
          <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>Live ticker unavailable</span>
        </div>
      ) : (
        <div style={{ marginBottom: "1rem" }}>
          <TickerBar indices={indices} />
        </div>
      )}

      {/* Global error */}
      {anyError && (
        <div style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          background: "rgba(255,59,92,0.07)", border: "1px solid rgba(255,59,92,0.2)",
          borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1rem",
          fontSize: "0.8125rem", color: "var(--down)",
        }}>
          <AlertTriangle size={14} />
          <span>Unable to reach market data server at localhost:3001. Showing cached or placeholder data.</span>
        </div>
      )}

      {/* ─── Main Grid: 2/3 + 1/3 ────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 308px", gap: "1rem", alignItems: "start" }}>

        {/* ════════ LEFT ════════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", minWidth: 0 }}>

          {/* Major Indices */}
          <div>
            <SectionLabel sub="Real-time price levels for 4 key benchmarks">Major Indices</SectionLabel>
            {loadingIndices ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border-c)", borderRadius: 12, padding: "1.125rem 1.25rem" }}>
                    <Skeleton h={12} w="50%" style={{ marginBottom: 8 }} />
                    <Skeleton h={36} w="70%" style={{ marginBottom: 8 }} />
                    <Skeleton h={52} />
                  </div>
                ))}
              </div>
            ) : errIndices ? (
              <div style={{
                background: "var(--surface)", border: "1px solid var(--border-c)", borderRadius: 12,
                padding: "2rem", textAlign: "center", color: "var(--text-3)", fontSize: "0.8125rem",
              }}>
                <AlertTriangle size={20} style={{ marginBottom: 8, display: "block", margin: "0 auto 8px", color: "var(--down)" }} />
                Indices unavailable — check API server
              </div>
            ) : (
              <motion.div
                variants={STAGGER} initial="hidden" animate="show"
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}
              >
                {(featuredIndices.length > 0 ? featuredIndices : indices?.slice(0, 4))?.map((idx, i) => (
                  <IndexCard key={idx.symbol} index={idx} i={i} />
                ))}
              </motion.div>
            )}
          </div>

          {/* Sector Heatmap */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.625rem" }}>
              <SectionLabel sub="Day-over-day performance across all 11 GICS sectors">Sector Performance</SectionLabel>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                {[{ label: "Positive", color: "rgba(0,184,153,0.45)" }, { label: "Negative", color: "rgba(255,59,92,0.45)" }].map(({ label, color }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 8, height: 8, background: color, borderRadius: 2 }} />
                    <span style={{ fontSize: "0.5625rem", color: "var(--text-3)", fontWeight: 600 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{
              background: "var(--surface)", border: "1px solid var(--border-c)",
              borderRadius: 12, padding: "0.875rem",
            }}>
              {loadingSectors ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0.375rem" }}>
                  {Array.from({ length: 11 }).map((_, i) => <Skeleton key={i} h={66} />)}
                </div>
              ) : errSectors ? (
                <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-3)", fontSize: "0.8125rem" }}>
                  Sector data unavailable
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(82px, 1fr))", gap: "0.375rem" }}>
                  {sectors?.map(s => <SectorCell key={s.symbol} sector={s} />)}
                </div>
              )}
            </div>
          </div>

          {/* Market Movers */}
          <div>
            <SectionLabel sub="Top performing and underperforming equities today">Market Movers</SectionLabel>
            {loadingMovers ? (
              <div style={{ background: "var(--surface)", border: "1px solid var(--border-c)", borderRadius: 12, padding: "1.25rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <Skeleton h={220} />
                  <Skeleton h={220} />
                </div>
              </div>
            ) : errMovers ? (
              <div style={{
                background: "var(--surface)", border: "1px solid var(--border-c)", borderRadius: 12,
                padding: "1.5rem", textAlign: "center", color: "var(--text-3)", fontSize: "0.8125rem",
              }}>
                Mover data unavailable
              </div>
            ) : (
              <MoversPanel movers={movers} />
            )}
          </div>

          {/* All Indices table (only shown when >4 returned) */}
          {!loadingIndices && !errIndices && indices && indices.length > 4 && (
            <div>
              <SectionLabel>All Tracked Indices</SectionLabel>
              <div style={{
                background: "var(--surface)", border: "1px solid var(--border-c)",
                borderRadius: 12, overflow: "hidden",
              }}>
                <div style={{ maxHeight: 280, overflowY: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "var(--elevated)" }}>
                        <th style={{ padding: "0.5rem 1rem", textAlign: "left", fontSize: "0.5875rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)" }}>Symbol</th>
                        <th style={{ padding: "0.5rem 1rem", textAlign: "right", fontSize: "0.5875rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)" }}>Price</th>
                        <th style={{ padding: "0.5rem 1rem", textAlign: "right", fontSize: "0.5875rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)" }}>Chg%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {indices.map((idx, i) => {
                        const up = idx.isUp !== undefined ? idx.isUp : Number(idx.change) >= 0;
                        return (
                          <tr key={idx.symbol} style={{ borderBottom: "1px solid var(--border-c)" }}>
                            <td style={{ padding: "0.5rem 1rem", fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: "0.75rem", fontWeight: 800, color: "var(--gold)" }}>{idx.symbol}</td>
                            <td style={{ padding: "0.5rem 1rem", textAlign: "right", fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-1)" }}>{fmt(idx.price)}</td>
                            <td style={{ padding: "0.5rem 1rem", textAlign: "right" }}>
                              <span style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: "0.75rem", fontWeight: 800, color: up ? "var(--up)" : "var(--down)" }}>
                                {up ? "+" : ""}{Number(idx.changePercent).toFixed(2)}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* ════════ END LEFT ════════ */}

        {/* ════════ RIGHT SIDEBAR ════════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", minWidth: 0 }}>
          <FearGreedGauge vix={vixValue ?? (indices ? 18.5 : null)} />
          <MarketClock />
          <KeyLevels spx={spx} />
          <VixCard vix={vixValue ?? (indices ? 18.5 : null)} />
        </div>
        {/* ════════ END SIDEBAR ════════ */}

      </div>

      {/* Footer note */}
      <div style={{ marginTop: "1.75rem", paddingTop: "1rem", borderTop: "1px solid var(--border-c)" }}>
        <p style={{ fontSize: "0.625rem", color: "var(--text-3)", lineHeight: 1.7, margin: 0 }}>
          Market data refreshes every 60 seconds. All data is for informational purposes only and does not constitute investment advice.
          Past performance is not indicative of future results.
        </p>
      </div>

    </motion.div>
  );
}
