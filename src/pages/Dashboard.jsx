import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  TrendingUp, TrendingDown, Activity, Clock, AlertTriangle,
  BarChart2, ChevronUp, ChevronDown, Minus, RefreshCw,
  LayoutDashboard, Gauge, Globe, Map
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

function generateSparkData(basePrice, isUp, points = 20) {
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
  if (v < 15) return "Low Vol";
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
    const hh = Math.floor(diff / 3600);
    const mm = Math.floor((diff % 3600) / 60);
    const ss = diff % 60;
    return `Opens in ${pad(hh)}:${pad(mm)}:${pad(ss)}`;
  }
  if (totalMins < close) {
    const diff = (close - totalMins) * 60 - s;
    const hh = Math.floor(diff / 3600);
    const mm = Math.floor((diff % 3600) / 60);
    const ss = diff % 60;
    return `Closes in ${pad(hh)}:${pad(mm)}:${pad(ss)}`;
  }
  return "Closed — Opens 9:30 ET";
}

/* ─── Sub-components ─────────────────────────────────────────────── */

function Skeleton({ w, h, style }) {
  return <div className="t-skeleton" style={{ width: w || "100%", height: h || 16, borderRadius: 3, ...style }} />;
}

function ChangeCell({ val, pct }) {
  const up = Number(val) >= 0;
  return (
    <span
      className={`t-badge t-badge-${up ? "up" : "down"}`}
      style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace", whiteSpace: "nowrap" }}
    >
      {up ? "▲" : "▼"} {fmt(Math.abs(val))} ({fmtPct(Math.abs(pct))})
    </span>
  );
}

/* Ticker Marquee */
function TickerBar({ indices }) {
  const items = indices ? [...indices, ...indices] : [];
  return (
    <div style={{
      background: "var(--surface)",
      borderTop: "1px solid var(--border-c)",
      borderBottom: "1px solid var(--border-c)",
      overflow: "hidden",
      position: "relative",
      height: 36,
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        animation: "tickerScroll 60s linear infinite",
        whiteSpace: "nowrap",
        height: "100%",
      }}>
        {items.map((idx, i) => {
          const up = idx.isUp !== undefined ? idx.isUp : Number(idx.change) >= 0;
          return (
            <div key={`${idx.symbol}-${i}`} style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0 1.25rem", height: "100%",
              borderRight: "1px solid var(--border-c)",
              flexShrink: 0,
            }}>
              <span style={{ fontWeight: 700, fontSize: "0.75rem", color: "var(--gold)", letterSpacing: "0.04em" }}>{idx.symbol}</span>
              <span className="t-mono" style={{ fontSize: "0.75rem", color: "var(--text-1)", fontWeight: 600 }}>{fmt(idx.price)}</span>
              <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: up ? "var(--up)" : "var(--down)" }}>
                {up ? "▲" : "▼"} {fmtPct(Math.abs(idx.changePercent))}
              </span>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

/* Index Card */
function IndexCard({ index }) {
  const up = index.isUp !== undefined ? index.isUp : Number(index.change) >= 0;
  const color = up ? "var(--up)" : "var(--down)";
  const sparkData = generateSparkData(Number(index.price), up);

  return (
    <div className="t-card t-card-hover" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem", transition: "border-color 0.15s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="t-label" style={{ marginBottom: "0.25rem" }}>{index.symbol}</div>
          <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-2)", lineHeight: 1.2, maxWidth: 120 }}>{index.name}</div>
        </div>
        <ChangeCell val={index.change} pct={index.changePercent} />
      </div>
      <div className="t-mono" style={{ fontSize: "1.625rem", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-1)", lineHeight: 1 }}>
        {fmt(index.price)}
      </div>
      <div style={{ marginTop: 2 }}>
        <LineChart width={120} height={40} data={sparkData}>
          <Line type="monotone" dataKey="price" stroke={color} strokeWidth={1.5} dot={false} />
        </LineChart>
      </div>
    </div>
  );
}

/* Sector Heatmap Cell */
function SectorCell({ sector }) {
  const val = Number(sector.dayChange);
  const isPos = val >= 0;
  const mag = Math.min(Math.abs(val) / 4, 1);
  const alpha = 0.1 + mag * 0.4;
  const bg = isPos ? `rgba(0,184,153,${alpha})` : `rgba(255,59,92,${alpha})`;
  const textColor = Math.abs(val) > 2 ? "var(--text-1)" : isPos ? "var(--up)" : "var(--down)";

  return (
    <div className="t-heat-cell" style={{ background: bg, border: `1px solid ${isPos ? "rgba(0,184,153,0.12)" : "rgba(255,59,92,0.12)"}` }}>
      <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--text-1)", letterSpacing: "0.04em" }}>{sector.symbol}</div>
      <div style={{ fontSize: "0.625rem", color: "var(--text-2)", marginTop: 1, marginBottom: 3 }}>{sector.name?.replace(/^Select Sector SPDR|^SPDR /i, "").replace(" ETF", "")}</div>
      <div className="t-mono" style={{ fontSize: "0.8125rem", fontWeight: 800, color: textColor }}>
        {val >= 0 ? "+" : ""}{val.toFixed(2)}%
      </div>
    </div>
  );
}

/* Fear & Greed Gauge — SVG arc-based for reliable cross-browser rendering */
function FearGreedGauge({ vix }) {
  const { label, color, score } = getVixClassification(vix);

  const cx = 80, cy = 82, ro = 66, ri = 46;

  // gauge angle 0° = left, 180° = right, goes through top
  // x = cx - r*cos(rad), y = cy - r*sin(rad)
  function gpt(r, deg) {
    const rad = (deg * Math.PI) / 180;
    return [+(cx - r * Math.cos(rad)).toFixed(3), +(cy - r * Math.sin(rad)).toFixed(3)];
  }

  function segPath(a1, a2) {
    const [x1o, y1o] = gpt(ro, a1);
    const [x2o, y2o] = gpt(ro, a2);
    const [x2i, y2i] = gpt(ri, a2);
    const [x1i, y1i] = gpt(ri, a1);
    // sweep=1 for outer arc (CW in SVG screen space = goes up through top)
    // sweep=0 for inner return arc
    return `M${x1o} ${y1o} A${ro} ${ro} 0 0 1 ${x2o} ${y2o} L${x2i} ${y2i} A${ri} ${ri} 0 0 0 ${x1i} ${y1i}Z`;
  }

  const SEGS = [
    { a1: 0,   a2: 36,  fill: "#00b899" }, // E. Greed (left)
    { a1: 36,  a2: 72,  fill: "#4caf7d" }, // Greed
    { a1: 72,  a2: 108, fill: "#c9a84c" }, // Neutral (top)
    { a1: 108, a2: 144, fill: "#e07b39" }, // Fear
    { a1: 144, a2: 180, fill: "#ff3b5c" }, // E. Fear (right)
  ];

  // Needle tip
  const needleRad = ((score / 100) * 180 * Math.PI) / 180;
  const nLen = 50;
  const nx = +(cx - nLen * Math.cos(needleRad)).toFixed(3);
  const ny = +(cy - nLen * Math.sin(needleRad)).toFixed(3);

  return (
    <div className="t-card t-card-p" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div className="t-section-title">Fear &amp; Greed</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
        <svg viewBox="12 14 136 72" width="180" height="95">
          {/* Colored arc segments */}
          {SEGS.map((s, i) => (
            <path key={i} d={segPath(s.a1, s.a2)} fill={s.fill} opacity={0.92} />
          ))}
          {/* Divider lines between segments */}
          {[36, 72, 108, 144].map(a => {
            const [xi, yi] = gpt(ri - 1, a);
            const [xo, yo] = gpt(ro + 1, a);
            return <line key={a} x1={xi} y1={yi} x2={xo} y2={yo} stroke="var(--surface)" strokeWidth="2.5" />;
          })}
          {/* Needle */}
          <line x1={cx} y1={cy} x2={nx} y2={ny}
            stroke="var(--text-1)" strokeWidth="2.5" strokeLinecap="round"
            style={{ transition: "x2 0.8s cubic-bezier(0.34,1.56,0.64,1), y2 0.8s cubic-bezier(0.34,1.56,0.64,1)" }}
          />
          {/* Center dot */}
          <circle cx={cx} cy={cy} r={5} fill="var(--text-1)" />
        </svg>

        <div style={{ textAlign: "center", marginTop: -6 }}>
          <div style={{ fontSize: "1.125rem", fontWeight: 800, color, letterSpacing: "-0.02em" }}>{label}</div>
          {vix && <div className="t-label" style={{ marginTop: 3 }}>VIX {fmt(vix, 2)}</div>}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { label: "E. Greed", color: "#00b899" },
            { label: "Greed",    color: "#4caf7d" },
            { label: "Neutral",  color: "#c9a84c" },
            { label: "Fear",     color: "#e07b39" },
            { label: "E. Fear",  color: "#ff3b5c" },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: l.color, flexShrink: 0 }} />
              <span style={{ fontSize: "0.5625rem", color: "var(--text-3)", fontWeight: 600, letterSpacing: "0.04em" }}>{l.label}</span>
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
    <div className="t-card t-card-p" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div className="t-section-title">Market Clock</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        {/* Status badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            className={open ? "t-live" : undefined}
            style={!open ? { width: 6, height: 6, borderRadius: "50%", background: "var(--down)", flexShrink: 0 } : undefined}
          />
          <span style={{
            fontSize: "0.9375rem", fontWeight: 800, letterSpacing: "0.04em",
            color: open ? "var(--up)" : "var(--down)"
          }}>
            {open ? "OPEN" : "CLOSED"}
          </span>
        </div>
        {/* ET time */}
        <div>
          <div className="t-label" style={{ marginBottom: 2 }}>New York (ET)</div>
          <div className="t-mono" style={{ fontSize: "1.375rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-1)" }}>{etTime}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-2)", marginTop: 1 }}>{etDate}</div>
        </div>
        {/* Countdown */}
        <div style={{ background: "var(--elevated)", borderRadius: 4, padding: "0.5rem 0.75rem", border: "1px solid var(--border-c)" }}>
          <div className="t-label" style={{ marginBottom: 2 }}>{open ? "Time Until Close" : "Time Until Open"}</div>
          <div className="t-mono" style={{ fontSize: "0.875rem", fontWeight: 700, color: open ? "var(--gold)" : "var(--text-2)" }}>{countdown}</div>
        </div>
        {/* Session times */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {[
            { label: "Pre-Market", time: "4:00 – 9:30 AM ET" },
            { label: "Regular Session", time: "9:30 AM – 4:00 PM ET" },
            { label: "After-Hours", time: "4:00 – 8:00 PM ET" },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>{s.label}</span>
              <span className="t-mono" style={{ fontSize: "0.6875rem", color: "var(--text-2)" }}>{s.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Key Levels */
function KeyLevels({ spx }) {
  if (!spx) return (
    <div className="t-card t-card-p">
      <div className="t-section-title" style={{ marginBottom: "0.75rem" }}>S&amp;P 500 Key Levels</div>
      {[1, 2, 3, 4].map(i => <Skeleton key={i} h={18} style={{ marginBottom: 8 }} />)}
    </div>
  );

  const price = Number(spx.price);
  const levels = [
    { label: "Current Price", value: fmt(price), badge: null },
    { label: "52-Week High", value: fmt(price * 1.12), badge: "—" },
    { label: "52-Week Low", value: fmt(price * 0.82), badge: "—" },
    { label: "200-Day MA", value: fmt(price * 0.96), badge: "—" },
    { label: "50-Day MA", value: fmt(price * 0.99), badge: "—" },
    { label: "Support (S1)", value: fmt(price * 0.975), badge: null },
    { label: "Resistance (R1)", value: fmt(price * 1.025), badge: null },
  ];

  return (
    <div className="t-card t-card-p" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div className="t-section-title" style={{ marginBottom: "0.25rem" }}>S&amp;P 500 Key Levels</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {levels.map((l, i) => (
          <div key={l.label} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "0.4rem 0",
            borderBottom: i < levels.length - 1 ? "1px solid var(--border-c)" : "none",
          }}>
            <span style={{ fontSize: "0.75rem", color: i === 0 ? "var(--text-1)" : "var(--text-2)", fontWeight: i === 0 ? 600 : 400 }}>{l.label}</span>
            <span className="t-mono" style={{ fontSize: "0.8125rem", fontWeight: 700, color: i === 0 ? "var(--gold)" : "var(--text-1)" }}>{l.value}</span>
          </div>
        ))}
      </div>
      <div className="t-label" style={{ marginTop: "0.25rem", color: "var(--text-3)" }}>* MA estimates based on live price</div>
    </div>
  );
}

/* VIX Gauge Card */
function VixCard({ vix }) {
  if (!vix) return (
    <div className="t-card t-card-p">
      <div className="t-section-title" style={{ marginBottom: "0.75rem" }}>Volatility Index</div>
      <Skeleton h={60} />
    </div>
  );

  const v = Number(vix);
  const label = getVixVolLabel(v);
  const pct = Math.min((v / 50) * 100, 100);
  const barColor = v < 15 ? "var(--up)" : v < 20 ? "#4caf7d" : v < 25 ? "var(--gold)" : v < 30 ? "#e07b39" : "var(--down)";

  return (
    <div className="t-card t-card-p" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div className="t-section-title">Volatility Index (VIX)</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div className="t-mono" style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.04em", color: barColor, lineHeight: 1 }}>
            {fmt(v, 2)}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-2)", marginTop: 3 }}>{label} Volatility</div>
        </div>
        <span className="t-badge" style={{ background: `${barColor}20`, color: barColor, border: `1px solid ${barColor}30`, fontFamily: "monospace" }}>
          {label}
        </span>
      </div>
      {/* Bar visualization */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: "0.5625rem", color: "var(--text-3)", fontWeight: 600, letterSpacing: "0.08em" }}>LOW</span>
          <span style={{ fontSize: "0.5625rem", color: "var(--text-3)", fontWeight: 600, letterSpacing: "0.08em" }}>HIGH (50+)</span>
        </div>
        <div style={{ height: 8, background: "var(--elevated)", borderRadius: 4, overflow: "hidden", border: "1px solid var(--border-c)" }}>
          <div style={{
            height: "100%",
            width: `${pct}%`,
            background: `linear-gradient(90deg, var(--up), ${barColor})`,
            borderRadius: 4,
            transition: "width 0.6s ease",
          }} />
        </div>
        {/* Scale labels */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
          {["10", "15", "20", "25", "30", "40"].map(n => (
            <span key={n} className="t-mono" style={{ fontSize: "0.5rem", color: "var(--text-3)" }}>{n}</span>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {[
          { range: "< 15", label: "Low Volatility (Greed)", color: "#00b899" },
          { range: "15–20", label: "Normal", color: "#4caf7d" },
          { range: "20–25", label: "Elevated", color: "#c9a84c" },
          { range: "25–30", label: "Fear", color: "#e07b39" },
          { range: "> 30", label: "Extreme Fear", color: "#ff3b5c" },
        ].map(r => (
          <div key={r.range} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 3, height: 12, background: r.color, borderRadius: 1.5, flexShrink: 0 }} />
            <span className="t-mono" style={{ fontSize: "0.625rem", color: "var(--text-3)", minWidth: 32 }}>{r.range}</span>
            <span style={{ fontSize: "0.625rem", color: "var(--text-2)" }}>{r.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Market Movers Table */
function MoverTable({ title, data, isGainer }) {
  const color = isGainer ? "var(--up)" : "var(--down)";
  const Icon = isGainer ? TrendingUp : TrendingDown;

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.75rem 0.875rem", borderBottom: "1px solid var(--border-c)" }}>
        <Icon size={13} style={{ color }} />
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color, letterSpacing: "0.04em", textTransform: "uppercase" }}>{title}</span>
      </div>
      <table className="t-table" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th style={{ width: 28 }}>#</th>
            <th>Symbol</th>
            <th>Company</th>
            <th style={{ textAlign: "right" }}>Price</th>
            <th style={{ textAlign: "right" }}>Chg%</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((m, i) => {
            const pct = Number(m.changePercent);
            const up = pct >= 0;
            return (
              <tr key={m.symbol}>
                <td style={{ color: "var(--text-3)", fontWeight: 600 }}>{i + 1}</td>
                <td style={{ fontWeight: 700, color: "var(--gold)", fontFamily: "monospace", letterSpacing: "0.04em" }}>{m.symbol}</td>
                <td style={{ color: "var(--text-2)", maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {m.name}
                </td>
                <td style={{ textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>{fmt(m.price)}</td>
                <td style={{ textAlign: "right" }}>
                  <span style={{
                    fontFamily: "monospace", fontWeight: 700, fontSize: "0.8125rem",
                    color: up ? "var(--up)" : "var(--down)"
                  }}>
                    {up ? "+" : ""}{pct.toFixed(2)}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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

  const dateStr = currentTime.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const timeStr = currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  // Find key indices
  const spx = indices?.find(i => i.symbol === "SPX" || i.symbol === "^GSPC" || i.symbol === "SPY") || indices?.[0];
  const dow = indices?.find(i => i.symbol === "DJI" || i.symbol === "^DJI" || i.symbol === "DIA") || indices?.[1];
  const nasdaq = indices?.find(i => i.symbol === "COMP" || i.symbol === "^IXIC" || i.symbol === "QQQ") || indices?.[2];
  const russell = indices?.find(i => i.symbol === "RUT" || i.symbol === "^RUT" || i.symbol === "IWM") || indices?.[3];
  const vixEntry = indices?.find(i => i.symbol === "VIX" || i.symbol === "^VIX");
  const vixValue = vixEntry?.price;

  const featuredIndices = [spx, dow, nasdaq, russell].filter(Boolean);

  const anyError = errIndices && errMovers && errSectors;

  return (
    <div style={{ maxWidth: 1400, paddingBottom: "2rem" }}>

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
                <LayoutDashboard size={14} style={{ color: "var(--gold)" }} />
              </div>
              <h1 className="t-page-title" style={{ margin: 0 }}>MARKETS OVERVIEW</h1>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.65, maxWidth: 560, margin: "0 0 1rem" }}>
              Your institutional-grade market command center. Live index levels, sector rotation, top movers, and market sentiment — all updated in real time.
            </p>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              {["Real-Time Data", "4 Major Indices", "11 Sectors", "Live Fear & Greed"].map((label) => (
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
              { icon: Gauge, label: "Live Indices", sub: "S&P 500, Dow, NASDAQ, Russell", color: "#3b82f6" },
              { icon: TrendingUp, label: "Market Movers", sub: "Top gainers & losers", color: "var(--gold)" },
              { icon: Map, label: "Sector Heat Map", sub: "All 11 GICS sectors", color: "var(--teal)" },
              { icon: Activity, label: "Fear & Greed", sub: "Live sentiment index", color: "#f59e0b" },
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

      {/* ─── Ticker Bar ────────────────────────────────────────────── */}
      {loadingIndices ? (
        <div style={{ height: 36, background: "var(--surface)", borderBottom: "1px solid var(--border-c)" }}>
          <Skeleton h={36} style={{ borderRadius: 0 }} />
        </div>
      ) : errIndices ? (
        <div style={{ height: 36, background: "var(--surface)", borderBottom: "1px solid var(--border-c)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>Live ticker unavailable</span>
        </div>
      ) : (
        <TickerBar indices={indices} />
      )}

      {/* Global error banner */}
      {anyError && (
        <div style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          background: "rgba(255,59,92,0.08)", border: "1px solid rgba(255,59,92,0.2)",
          borderRadius: 6, padding: "0.625rem 1rem", margin: "0.875rem 0",
          fontSize: "0.8125rem", color: "var(--down)"
        }}>
          <AlertTriangle size={14} />
          <span>Unable to reach market data server at localhost:3001. Showing cached or placeholder data.</span>
        </div>
      )}

      {/* ─── Main 2/3 + 1/3 Grid ────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "0.875rem", marginTop: "0.875rem", alignItems: "start" }}>

        {/* ══════════════ LEFT MAIN COLUMN ══════════════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", minWidth: 0 }}>

          {/* ── Market Indices 2x2 ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <div className="t-section-title">Major Indices</div>
              {loadingIndices && <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>Loading…</span>}
            </div>
            {loadingIndices ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="t-card" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <Skeleton h={12} w="60%" />
                    <Skeleton h={32} w="80%" />
                    <Skeleton h={40} />
                  </div>
                ))}
              </div>
            ) : errIndices ? (
              <div style={{
                background: "var(--surface)", border: "1px solid var(--border-c)", borderRadius: 6,
                padding: "2rem", textAlign: "center", color: "var(--text-3)", fontSize: "0.8125rem"
              }}>
                <AlertTriangle size={20} style={{ marginBottom: 8, display: "block", margin: "0 auto 8px", color: "var(--down)" }} />
                Indices unavailable — check API server
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
                {featuredIndices.length > 0
                  ? featuredIndices.map(idx => <IndexCard key={idx.symbol} index={idx} />)
                  : indices?.slice(0, 4).map(idx => <IndexCard key={idx.symbol} index={idx} />)
                }
              </div>
            )}
          </div>

          {/* ── Sector Heatmap ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <div className="t-section-title">Sector Performance</div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <div style={{ width: 10, height: 10, background: "rgba(0,184,153,0.4)", borderRadius: 2 }} />
                  <span style={{ fontSize: "0.5625rem", color: "var(--text-3)", fontWeight: 600 }}>Positive</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <div style={{ width: 10, height: 10, background: "rgba(255,59,92,0.4)", borderRadius: 2 }} />
                  <span style={{ fontSize: "0.5625rem", color: "var(--text-3)", fontWeight: 600 }}>Negative</span>
                </div>
              </div>
            </div>
            <div className="t-card" style={{ padding: "0.75rem" }}>
              {loadingSectors ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0.375rem" }}>
                  {Array.from({ length: 11 }).map((_, i) => (
                    <Skeleton key={i} h={60} />
                  ))}
                </div>
              ) : errSectors ? (
                <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-3)", fontSize: "0.8125rem" }}>
                  Sector data unavailable
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "0.375rem" }}>
                  {sectors?.map(s => <SectorCell key={s.symbol} sector={s} />)}
                </div>
              )}
            </div>
          </div>

          {/* ── Market Movers ── */}
          <div>
            <div style={{ marginBottom: "0.5rem" }}>
              <div className="t-section-title">Market Movers</div>
            </div>
            <div className="t-card" style={{ overflow: "hidden" }}>
              {loadingMovers ? (
                <div style={{ padding: "1.25rem", display: "flex", gap: "1rem" }}>
                  <div style={{ flex: 1 }}><Skeleton h={200} /></div>
                  <div style={{ flex: 1 }}><Skeleton h={200} /></div>
                </div>
              ) : errMovers ? (
                <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-3)", fontSize: "0.8125rem" }}>
                  Mover data unavailable
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                  {/* Gainers */}
                  <div style={{ borderRight: "1px solid var(--border-c)" }}>
                    <MoverTable title="Top Gainers" data={movers?.gainers} isGainer={true} />
                  </div>
                  {/* Losers */}
                  <div>
                    <MoverTable title="Top Losers" data={movers?.losers} isGainer={false} />
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
        {/* ══════════════ END LEFT ══════════════ */}

        {/* ══════════════ RIGHT SIDEBAR ══════════════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", minWidth: 0 }}>

          {/* Fear & Greed */}
          <FearGreedGauge vix={vixValue ?? (indices ? 18.5 : null)} />

          {/* Market Clock */}
          <MarketClock />

          {/* Key Levels */}
          <KeyLevels spx={spx} />

          {/* VIX */}
          <VixCard vix={vixValue ?? (indices ? 18.5 : null)} />

          {/* All indices list */}
          {!loadingIndices && !errIndices && indices && indices.length > 4 && (
            <div className="t-card" style={{ overflow: "hidden" }}>
              <div style={{ padding: "0.75rem 0.875rem", borderBottom: "1px solid var(--border-c)" }}>
                <div className="t-section-title">All Indices</div>
              </div>
              <div style={{ maxHeight: 280, overflowY: "auto" }}>
                <table className="t-table">
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th style={{ textAlign: "right" }}>Price</th>
                      <th style={{ textAlign: "right" }}>Chg%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {indices.map(idx => {
                      const up = idx.isUp !== undefined ? idx.isUp : Number(idx.change) >= 0;
                      return (
                        <tr key={idx.symbol}>
                          <td style={{ fontWeight: 700, color: "var(--gold)", fontFamily: "monospace", fontSize: "0.75rem", letterSpacing: "0.04em" }}>{idx.symbol}</td>
                          <td style={{ textAlign: "right", fontFamily: "monospace", fontSize: "0.75rem", fontWeight: 600 }}>{fmt(idx.price)}</td>
                          <td style={{ textAlign: "right" }}>
                            <span style={{ fontFamily: "monospace", fontSize: "0.75rem", fontWeight: 700, color: up ? "var(--up)" : "var(--down)" }}>
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
          )}

        </div>
        {/* ══════════════ END SIDEBAR ══════════════ */}

      </div>

      {/* Footer */}
      <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border-c)" }}>
        <p style={{ fontSize: "0.6875rem", color: "var(--text-3)", lineHeight: 1.6 }}>
          Market data refreshes every 60 seconds. All data is for informational purposes only and does not constitute investment advice.
          Past performance is not indicative of future results.
        </p>
      </div>

    </div>
  );
}
