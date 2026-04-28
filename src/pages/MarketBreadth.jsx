import React, { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { Activity, Clock, TrendingUp, TrendingDown, Minus, BarChart2, ArrowUpDown, Waves } from "lucide-react";

const SERVER = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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

/* ─── Simulated data generators ──────────────────────────────────── */
function genADLine(points = 252) {
  const data = [];
  let val = 1000;
  const now = new Date();
  for (let i = points; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    val += (Math.random() - 0.46) * 18;
    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: Math.round(val),
    });
  }
  return data;
}

function genVIXHistory(points = 252) {
  const data = [];
  let val = 18;
  const now = new Date();
  for (let i = points; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    val += (Math.random() - 0.49) * 0.8;
    val = Math.max(9, Math.min(55, val));
    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      vix: parseFloat(val.toFixed(2)),
    });
  }
  return data;
}

function genMcClellan(points = 60) {
  const data = [];
  let val = 20;
  const now = new Date();
  let daysBack = 0;
  let count = 0;
  while (count < points) {
    daysBack++;
    const d = new Date(now);
    d.setDate(d.getDate() - daysBack);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    val += (Math.random() - 0.5) * 18;
    val = Math.max(-120, Math.min(120, val));
    data.unshift({
      date: d.toLocaleDateString("en-US", { month: "numeric", day: "numeric" }),
      value: parseFloat(val.toFixed(1)),
    });
    count++;
  }
  return data;
}

function genVIXTermStructure(spot) {
  return [
    { label: "VIX", value: spot },
    { label: "VIX3M", value: parseFloat((spot + (Math.random() * 1.5 + 0.5)).toFixed(2)) },
    { label: "VIX6M", value: parseFloat((spot + (Math.random() * 2.5 + 1.5)).toFixed(2)) },
  ];
}

/* ─── Shared tooltip ─────────────────────────────────────────────── */
const ChartTooltip = ({ contentStyle, ...rest }) => null;
const sharedTooltipStyle = {
  contentStyle: {
    background: "var(--surface)",
    border: "1px solid var(--border-c)",
    borderRadius: 4,
    fontSize: 11,
    color: "var(--text-1)",
  },
  itemStyle: { color: "var(--text-1)" },
};

/* ─── Put/Call Gauge ─────────────────────────────────────────────── */
function PutCallGauge({ value }) {
  const v = Number(value) || 0.85;
  const pct = Math.min(100, (v / 2) * 100);
  let color = "var(--up)";
  let label = "Bullish";
  if (v >= 0.7 && v < 1.0) { color = "var(--gold)"; label = "Neutral"; }
  if (v >= 1.0) { color = "var(--down)"; label = "Bearish"; }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
        <span className="t-metric-xl t-mono" style={{ color }}>{v.toFixed(2)}</span>
        <span className={`t-badge ${label === "Bullish" ? "t-badge-up" : label === "Bearish" ? "t-badge-down" : "t-badge-gold"}`}>{label}</span>
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: "0.625rem", color: "var(--up)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Bullish &lt;0.7</span>
          <span style={{ fontSize: "0.625rem", color: "var(--down)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Bearish &gt;1.0</span>
        </div>
        <div style={{ height: 8, background: "var(--elevated)", borderRadius: 4, position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", left: 0, top: 0, height: "100%", width: "35%",
            background: "var(--up)", opacity: 0.7, borderRadius: "4px 0 0 4px",
          }} />
          <div style={{
            position: "absolute", left: "35%", top: 0, height: "100%", width: "15%",
            background: "var(--gold)", opacity: 0.7,
          }} />
          <div style={{
            position: "absolute", left: "50%", top: 0, height: "100%", width: "50%",
            background: "var(--down)", opacity: 0.7, borderRadius: "0 4px 4px 0",
          }} />
          {/* Needle */}
          <div style={{
            position: "absolute", top: 0, height: "100%", width: 3,
            background: "var(--text-1)",
            left: `calc(${pct}% - 1.5px)`,
            borderRadius: 2,
            boxShadow: "0 0 4px rgba(255,255,255,0.6)",
            transition: "left 0.4s ease",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
          <span style={{ fontSize: "0.5625rem", color: "var(--text-3)" }}>0</span>
          <span style={{ fontSize: "0.5625rem", color: "var(--text-3)" }}>1.0</span>
          <span style={{ fontSize: "0.5625rem", color: "var(--text-3)" }}>2.0</span>
        </div>
      </div>
      <span style={{ fontSize: "0.6875rem", color: "var(--text-2)" }}>
        {v < 0.7 ? "Options traders buying calls — bullish sentiment." :
          v < 1.0 ? "Balanced put/call activity — neutral market." :
          "Elevated put buying — hedging or bearish bets."}
      </span>
    </div>
  );
}

/* ─── Above 200-Day MA bar ───────────────────────────────────────── */
function MaBar({ value }) {
  const v = Number(value) || 58;
  let color = "var(--up)";
  let signal = "Bullish";
  let badgeClass = "t-badge-up";
  if (v < 70 && v >= 40) { color = "var(--gold)"; signal = "Neutral"; badgeClass = "t-badge-gold"; }
  if (v < 40) { color = "var(--down)"; signal = "Bearish"; badgeClass = "t-badge-down"; }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
        <span className="t-metric-xl t-mono" style={{ color }}>{v.toFixed(1)}%</span>
        <span className={`t-badge ${badgeClass}`}>{signal}</span>
      </div>
      <div>
        <div style={{ height: 10, background: "var(--elevated)", borderRadius: 5, overflow: "hidden", position: "relative" }}>
          <div style={{
            height: "100%", width: `${v}%`, borderRadius: 5,
            background: `linear-gradient(90deg, var(--down) 0%, var(--gold) 40%, var(--up) 70%)`,
            transition: "width 0.5s ease",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: "0.5625rem", color: "var(--text-3)" }}>0%</span>
          <span style={{ fontSize: "0.5625rem", color: "var(--text-3)" }}>40% Bear</span>
          <span style={{ fontSize: "0.5625rem", color: "var(--text-3)" }}>70% Bull</span>
          <span style={{ fontSize: "0.5625rem", color: "var(--text-3)" }}>100%</span>
        </div>
      </div>
      <span style={{ fontSize: "0.6875rem", color: "var(--text-2)" }}>
        {v.toFixed(0)}% of S&P 500 stocks trade above their 200-day moving average.
      </span>
    </div>
  );
}

/* ─── Advance / Decline Donut ────────────────────────────────────── */
function ADDonut({ advancing, declining, unchanged }) {
  const adv = Number(advancing) || 1823;
  const dec = Number(declining) || 987;
  const unc = Number(unchanged) || 214;
  const total = adv + dec + unc;
  const ratio = dec > 0 ? (adv / dec).toFixed(2) : "—";
  const data = [
    { name: "Advancing", value: adv },
    { name: "Declining", value: dec },
    { name: "Unchanged", value: unc },
  ];
  const COLORS = ["var(--up)", "var(--down)", "var(--text-3)"];

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "1.25rem" }}>
      <div style={{ position: "relative", width: 130, height: 130, flexShrink: 0 }}>
        <ResponsiveContainer width={130} height={130}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={2} dataKey="value" startAngle={90} endAngle={-270}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <span className="t-mono" style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-1)", lineHeight: 1 }}>{ratio}</span>
          <span style={{ fontSize: "0.5625rem", color: "var(--text-3)", letterSpacing: "0.05em", marginTop: 2 }}>A/D</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {data.map((d, i) => (
          <div key={d.name} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i], flexShrink: 0 }} />
            <span style={{ fontSize: "0.6875rem", color: "var(--text-2)" }}>{d.name}</span>
            <span className="t-mono" style={{ fontSize: "0.6875rem", color: "var(--text-1)", fontWeight: 700, marginLeft: "auto", minWidth: 40, textAlign: "right" }}>
              {d.value.toLocaleString()}
            </span>
          </div>
        ))}
        <div style={{ borderTop: "1px solid var(--border-c)", paddingTop: 4 }}>
          <span style={{ fontSize: "0.5625rem", color: "var(--text-3)" }}>NYSE | Total: {total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── New Highs / Lows ───────────────────────────────────────────── */
function HighsLows({ highs, lows }) {
  const h = Number(highs) || 187;
  const l = Number(lows) || 54;
  const net = h - l;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-end" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span className="t-label" style={{ color: "var(--up)" }}>52W Highs</span>
          <span className="t-metric-xl t-mono" style={{ color: "var(--up)" }}>{h}</span>
        </div>
        <div style={{ fontSize: "1.25rem", color: "var(--text-3)", marginBottom: 4 }}>vs</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span className="t-label" style={{ color: "var(--down)" }}>52W Lows</span>
          <span className="t-metric-xl t-mono" style={{ color: "var(--down)" }}>{l}</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-2)" }}>Net:</span>
        <span className={`t-badge ${net > 0 ? "t-badge-up" : net < 0 ? "t-badge-down" : "t-badge-neutral"}`}>
          {net > 0 ? "▲ +" : net < 0 ? "▼ " : ""}{net} highs vs lows
        </span>
      </div>
      <div style={{ height: 6, background: "var(--elevated)", borderRadius: 3, overflow: "hidden", position: "relative" }}>
        <div style={{
          height: "100%",
          width: `${(h / (h + l)) * 100}%`,
          background: "var(--up)",
          borderRadius: 3,
          transition: "width 0.5s ease",
        }} />
      </div>
      <span style={{ fontSize: "0.6875rem", color: "var(--text-2)" }}>
        {((h / (h + l)) * 100).toFixed(0)}% of extremes are new highs
      </span>
    </div>
  );
}

/* ─── Fear & Greed Score ─────────────────────────────────────────── */
const FG_COMPONENTS = [
  { name: "Market Momentum", desc: "S&P 500 vs 125-day MA", score: 62 },
  { name: "Stock Price Strength", desc: "52W Highs vs Lows", score: 55 },
  { name: "Stock Price Breadth", desc: "McClellan Oscillator", score: 48 },
  { name: "Put/Call Ratio", desc: "Options activity", score: 71 },
  { name: "Market Volatility", desc: "VIX relative to average", score: 58 },
  { name: "Safe Haven Demand", desc: "Stocks vs Bonds", score: 63 },
  { name: "Junk Bond Demand", desc: "High yield spread", score: 52 },
];

function scoreColor(s) {
  if (s <= 25) return "var(--down)";
  if (s <= 45) return "#e07b39";
  if (s <= 55) return "var(--gold)";
  if (s <= 75) return "#4caf7d";
  return "var(--up)";
}
function scoreLabel(s) {
  if (s <= 25) return "Extreme Fear";
  if (s <= 45) return "Fear";
  if (s <= 55) return "Neutral";
  if (s <= 75) return "Greed";
  return "Extreme Greed";
}
function scoreBadgeClass(s) {
  if (s <= 25) return "t-badge-down";
  if (s <= 45) return "t-badge-down";
  if (s <= 55) return "t-badge-gold";
  if (s <= 75) return "t-badge-up";
  return "t-badge-up";
}

function FearGreedMeter({ score }) {
  const color = scoreColor(score);
  const label = scoreLabel(score);
  const rotation = -135 + (score / 100) * 270;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
      {/* Arc gauge using CSS clip */}
      <div style={{ position: "relative", width: 140, height: 75, overflow: "visible" }}>
        {/* Background arc */}
        <div style={{
          position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: 130, height: 65, borderRadius: "65px 65px 0 0",
          background: "conic-gradient(from 180deg at 50% 100%, var(--down) 0deg, #e07b39 54deg, var(--gold) 81deg, #4caf7d 135deg, var(--up) 162deg, transparent 162deg)",
          opacity: 0.3,
        }} />
        {/* Active arc */}
        <div style={{
          position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)",
          width: 116, height: 58, borderRadius: "58px 58px 0 0",
          background: "var(--elevated)",
        }} />
        {/* Needle */}
        <div style={{
          position: "absolute", bottom: 0, left: "50%",
          width: 2, height: 58,
          background: color,
          transformOrigin: "bottom center",
          transform: `translateX(-50%) rotate(${rotation}deg)`,
          transition: "transform 0.6s cubic-bezier(.34,1.56,.64,1)",
          borderRadius: 2,
          boxShadow: `0 0 6px ${color}`,
        }} />
        <div style={{
          position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%)",
          width: 10, height: 10, borderRadius: "50%",
          background: color,
          boxShadow: `0 0 8px ${color}`,
        }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
        <span className="t-metric-xl t-mono" style={{ color }}>{score}</span>
        <span className={`t-badge ${scoreBadgeClass(score)}`} style={{ fontSize: "0.75rem" }}>{label}</span>
      </div>
    </div>
  );
}

function FearGreedCard({ overallScore }) {
  return (
    <div className="t-card t-card-p" style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: 180 }}>
        <span className="t-section-title" style={{ marginBottom: "1rem" }}>Fear & Greed Index</span>
        <FearGreedMeter score={overallScore} />
        <span style={{ fontSize: "0.6875rem", color: "var(--text-2)", marginTop: "0.5rem", textAlign: "center", maxWidth: 160 }}>
          CNN Money style composite of 7 market indicators
        </span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.625rem", minWidth: 280 }}>
        <span className="t-label" style={{ marginBottom: "0.25rem" }}>Component Breakdown</span>
        {FG_COMPONENTS.map(c => (
          <div key={c.name} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ minWidth: 160 }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-1)" }}>{c.name}</div>
              <div style={{ fontSize: "0.5625rem", color: "var(--text-3)" }}>{c.desc}</div>
            </div>
            <div style={{ flex: 1, height: 5, background: "var(--elevated)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${c.score}%`,
                background: scoreColor(c.score),
                borderRadius: 3,
                transition: "width 0.5s ease",
              }} />
            </div>
            <span className="t-mono" style={{ fontSize: "0.6875rem", fontWeight: 700, color: scoreColor(c.score), minWidth: 24, textAlign: "right" }}>
              {c.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── VIX Interpretation ─────────────────────────────────────────── */
function getVixLabel(v) {
  if (v < 12) return { label: "Complacent", color: "#00d4aa" };
  if (v < 16) return { label: "Low Volatility", color: "var(--up)" };
  if (v < 20) return { label: "Normal", color: "var(--gold)" };
  if (v < 25) return { label: "Elevated", color: "#e07b39" };
  if (v < 30) return { label: "High Fear", color: "var(--down)" };
  return { label: "Extreme Fear", color: "#ff1744" };
}

function VIXCard({ vixValue }) {
  const vix = Number(vixValue) || 17.42;
  const { label, color } = getVixLabel(vix);
  const vixHistory = useMemo(() => genVIXHistory(), []);
  const termStructure = useMemo(() => genVIXTermStructure(vix), [vix]);

  return (
    <div className="t-card t-card-p" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div className="t-section-title">VIX — Volatility Index</div>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
        {/* Big number + interpretation */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", minWidth: 180 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
            <span className="t-mono" style={{ fontSize: "3rem", fontWeight: 800, color, letterSpacing: "-0.04em", lineHeight: 1 }}>
              {vix.toFixed(2)}
            </span>
          </div>
          <span className={`t-badge ${vix < 20 ? "t-badge-up" : vix < 25 ? "t-badge-gold" : "t-badge-down"}`} style={{ alignSelf: "flex-start", fontSize: "0.75rem" }}>
            {label}
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: "0.25rem" }}>
            {[
              { range: "< 12", label: "Complacent", c: "#00d4aa" },
              { range: "12–16", label: "Low Vol", c: "var(--up)" },
              { range: "16–20", label: "Normal", c: "var(--gold)" },
              { range: "20–25", label: "Elevated", c: "#e07b39" },
              { range: "25–30", label: "High Fear", c: "var(--down)" },
              { range: "> 30", label: "Extreme Fear", c: "#ff1744" },
            ].map(row => (
              <div key={row.label} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <div style={{ width: 6, height: 6, borderRadius: 1, background: row.c, flexShrink: 0 }} />
                <span className="t-mono" style={{ fontSize: "0.5625rem", color: "var(--text-3)", minWidth: 38 }}>{row.range}</span>
                <span style={{ fontSize: "0.5625rem", color: vix < 12 && row.range === "< 12" ? row.c : vix >= 12 && vix < 16 && row.label === "Low Vol" ? row.c : vix >= 16 && vix < 20 && row.label === "Normal" ? row.c : vix >= 20 && vix < 25 && row.label === "Elevated" ? row.c : vix >= 25 && vix < 30 && row.label === "High Fear" ? row.c : vix >= 30 && row.label === "Extreme Fear" ? row.c : "var(--text-3)", fontWeight: label === row.label ? 700 : 400 }}>{row.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Term structure */}
        <div style={{ minWidth: 200 }}>
          <span className="t-label" style={{ marginBottom: "0.5rem", display: "block" }}>VIX Term Structure</span>
          <ResponsiveContainer width="100%" height={90}>
            <LineChart data={termStructure}>
              <XAxis dataKey="label" tick={{ fill: "var(--text-3)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide domain={["auto", "auto"]} />
              <Tooltip {...sharedTooltipStyle} formatter={v => [v.toFixed(2), "VIX"]} />
              <Line type="monotone" dataKey="value" stroke="var(--blue)" strokeWidth={2} dot={{ fill: "var(--blue)", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ fontSize: "0.5625rem", color: "var(--text-3)", marginTop: 2 }}>
            {termStructure[1]?.value > termStructure[0]?.value ? "Contango — normal backwardation" : "Backwardation — near-term fear elevated"}
          </div>
        </div>

        {/* VIX 1Y history */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <span className="t-label" style={{ marginBottom: "0.5rem", display: "block" }}>1-Year VIX History</span>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={vixHistory}>
              <defs>
                <linearGradient id="vixGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--gold)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" hide />
              <YAxis hide domain={[8, 40]} />
              <Tooltip {...sharedTooltipStyle} formatter={v => [v.toFixed(2), "VIX"]} />
              <ReferenceLine y={15} stroke="var(--up)" strokeDasharray="3 3" strokeOpacity={0.4} />
              <ReferenceLine y={25} stroke="var(--down)" strokeDasharray="3 3" strokeOpacity={0.4} />
              <Area type="monotone" dataKey="vix" stroke="var(--gold)" strokeWidth={1.5} fill="url(#vixGrad)" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: "1rem", marginTop: 4 }}>
            <span style={{ fontSize: "0.5625rem", color: "var(--up)" }}>▬ &lt;15 Calm</span>
            <span style={{ fontSize: "0.5625rem", color: "var(--gold)" }}>▬ 15–25 Normal</span>
            <span style={{ fontSize: "0.5625rem", color: "var(--down)" }}>▬ &gt;25 Fear</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── PMI data ───────────────────────────────────────────────────── */
const PMI_HISTORY = [
  { month:"Apr '25", mfg:49.2, svc:52.8 },
  { month:"May '25", mfg:48.7, svc:53.1 },
  { month:"Jun '25", mfg:49.8, svc:54.2 },
  { month:"Jul '25", mfg:50.1, svc:53.7 },
  { month:"Aug '25", mfg:49.4, svc:52.4 },
  { month:"Sep '25", mfg:47.8, svc:54.9 },
  { month:"Oct '25", mfg:48.5, svc:55.3 },
  { month:"Nov '25", mfg:49.7, svc:56.1 },
  { month:"Dec '25", mfg:49.3, svc:54.7 },
  { month:"Jan '26", mfg:50.3, svc:52.9 },
  { month:"Feb '26", mfg:52.7, svc:53.4 },
  { month:"Mar '26", mfg:50.3, svc:53.5 },
];

const GLOBAL_PMI = [
  { country:"🇺🇸 US – ISM Mfg",        value:50.3, prior:52.7, type:"Manufacturing" },
  { country:"🇺🇸 US – ISM Services",    value:53.5, prior:53.4, type:"Services" },
  { country:"🇺🇸 US – S&P Global Mfg",  value:51.2, prior:52.1, type:"Manufacturing" },
  { country:"🇪🇺 Eurozone Mfg",          value:47.3, prior:46.6, type:"Manufacturing" },
  { country:"🇪🇺 Eurozone Services",     value:50.6, prior:50.2, type:"Services" },
  { country:"🇨🇳 China – Caixin Mfg",   value:50.8, prior:50.8, type:"Manufacturing" },
  { country:"🇨🇳 China – NBS Mfg",      value:50.5, prior:50.4, type:"Manufacturing" },
  { country:"🇬🇧 UK Manufacturing",     value:46.9, prior:46.9, type:"Manufacturing" },
  { country:"🇯🇵 Japan Manufacturing",  value:49.5, prior:49.0, type:"Manufacturing" },
  { country:"🇨🇦 Canada Manufacturing", value:48.8, prior:47.8, type:"Manufacturing" },
];

function pmiColor(v) {
  if (v >= 55) return "#22c55e";
  if (v >= 52) return "#4caf7d";
  if (v >= 50) return "#a3c4a0";
  if (v >= 48) return "#e07b39";
  return "#ef4444";
}
function pmiLabel(v) {
  if (v >= 55) return "Strong Expansion";
  if (v >= 52) return "Solid Expansion";
  if (v >= 50.1) return "Slight Expansion";
  if (v === 50) return "No Change";
  if (v >= 48) return "Slight Contraction";
  return "Contraction";
}

function PMISection() {
  const latest = PMI_HISTORY[PMI_HISTORY.length - 1];
  return (
    <div className="t-card t-card-p" style={{ display:"flex",flexDirection:"column",gap:"1.25rem" }}>
      <div>
        <div className="t-section-title">PMI — Purchasing Managers' Index</div>
        <span style={{ fontSize:"0.6875rem",color:"var(--text-2)" }}>
          Leading economic indicator · Above 50 = expansion · Below 50 = contraction
        </span>
      </div>

      {/* Current readings row */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem" }}>
        {[
          { label:"ISM Manufacturing", value:latest.mfg, prev:PMI_HISTORY[PMI_HISTORY.length-2].mfg, sub:"Factory activity, orders, employment" },
          { label:"ISM Services",      value:latest.svc, prev:PMI_HISTORY[PMI_HISTORY.length-2].svc, sub:"Non-manufacturing — 80% of US economy" },
        ].map(({ label, value, prev, sub }) => {
          const color = pmiColor(value);
          const chg = value - prev;
          return (
            <div key={label} style={{ background:"var(--elevated)",borderRadius:8,padding:"1rem",
              border:`1px solid ${value >= 50 ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)"}` }}>
              <div style={{ fontSize:"0.5625rem",color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6 }}>{label}</div>
              <div style={{ display:"flex",alignItems:"baseline",gap:"0.625rem",marginBottom:4 }}>
                <span style={{ fontSize:"2.25rem",fontWeight:900,color,lineHeight:1,fontFamily:"'JetBrains Mono',monospace" }}>
                  {value.toFixed(1)}
                </span>
                <span style={{ fontSize:"0.6875rem",fontWeight:700,
                  color: chg > 0 ? "var(--up)" : "var(--down)" }}>
                  {chg > 0 ? "▲" : "▼"} {Math.abs(chg).toFixed(1)} MoM
                </span>
              </div>
              <span style={{ fontSize:"0.625rem",fontWeight:700,color,
                background:`${color}15`,borderRadius:4,padding:"2px 8px",display:"inline-block",marginBottom:6 }}>
                {pmiLabel(value)}
              </span>
              {/* Bar */}
              <div style={{ height:6,background:"var(--surface)",borderRadius:3,overflow:"hidden",marginTop:6 }}>
                <div style={{ height:"100%",width:`${Math.min(100,(value/70)*100)}%`,
                  background:color,borderRadius:3,transition:"width 0.5s" }} />
              </div>
              <div style={{ display:"flex",justifyContent:"space-between",marginTop:3,fontSize:"0.5rem",color:"var(--text-3)" }}>
                <span>30</span><span style={{ color:"var(--text-2)",fontWeight:700 }}>50 = Neutral</span><span>70</span>
              </div>
              <div style={{ fontSize:"0.5625rem",color:"var(--text-3)",marginTop:6 }}>{sub}</div>
            </div>
          );
        })}
      </div>

      {/* 12-month trend chart */}
      <div>
        <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:"0.75rem" }}>
          12-Month Trend
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={PMI_HISTORY}>
            <XAxis dataKey="month" tick={{ fill:"var(--text-3)",fontSize:10 }} axisLine={false} tickLine={false} />
            <YAxis domain={[44,58]} tick={{ fill:"var(--text-3)",fontSize:10 }} axisLine={false} tickLine={false} width={32} />
            <Tooltip {...sharedTooltipStyle}
              formatter={(v,n) => [v.toFixed(1), n === "mfg" ? "ISM Manufacturing" : "ISM Services"]} />
            <ReferenceLine y={50} stroke="rgba(255,255,255,0.2)" strokeDasharray="4 3"
              label={{ value:"50", fill:"var(--text-3)",fontSize:9,position:"right" }} />
            <Line type="monotone" dataKey="mfg" stroke="var(--gold)" strokeWidth={2}
              dot={{ fill:"var(--gold)",r:3 }} name="mfg" />
            <Line type="monotone" dataKey="svc" stroke="var(--blue)" strokeWidth={2}
              dot={{ fill:"var(--blue)",r:3 }} name="svc" />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ display:"flex",gap:"1.25rem",justifyContent:"center",marginTop:4 }}>
          {[["ISM Manufacturing","var(--gold)"],["ISM Services","var(--blue)"]].map(([l,c]) => (
            <div key={l} style={{ display:"flex",alignItems:"center",gap:4,fontSize:"0.5625rem",color:"var(--text-3)" }}>
              <div style={{ width:12,height:2,background:c,borderRadius:1 }} />{l}
            </div>
          ))}
        </div>
      </div>

      {/* Global PMI table */}
      <div>
        <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:"0.75rem" }}>
          Global PMI Snapshot — April 2026
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%",borderCollapse:"collapse",fontSize:"0.6875rem" }}>
            <thead>
              <tr style={{ borderBottom:"1px solid var(--border-c)" }}>
                {["Region / Index","Latest","Prior","Change","Signal"].map(h => (
                  <th key={h} style={{ padding:"6px 10px",textAlign:"left",fontSize:"0.5625rem",
                    color:"var(--text-3)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GLOBAL_PMI.map(row => {
                const chg = row.value - row.prior;
                const c = pmiColor(row.value);
                return (
                  <tr key={row.country} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding:"7px 10px",color:"var(--text-1)",fontWeight:600 }}>{row.country}</td>
                    <td style={{ padding:"7px 10px" }}>
                      <span style={{ fontWeight:800,color:c,fontFamily:"'JetBrains Mono',monospace" }}>
                        {row.value.toFixed(1)}
                      </span>
                    </td>
                    <td style={{ padding:"7px 10px",color:"var(--text-3)",fontFamily:"'JetBrains Mono',monospace" }}>
                      {row.prior.toFixed(1)}
                    </td>
                    <td style={{ padding:"7px 10px" }}>
                      <span style={{ color: chg > 0 ? "var(--up)" : chg < 0 ? "var(--down)" : "var(--text-3)",
                        fontWeight:700,fontFamily:"'JetBrains Mono',monospace" }}>
                        {chg > 0 ? "▲ +" : chg < 0 ? "▼ " : "→ "}{Math.abs(chg).toFixed(1)}
                      </span>
                    </td>
                    <td style={{ padding:"7px 10px" }}>
                      <span style={{ fontSize:"0.5625rem",fontWeight:700,color:c,
                        background:`${c}18`,borderRadius:4,padding:"2px 7px" }}>
                        {pmiLabel(row.value)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PMI education note */}
      <div style={{ background:"rgba(201,168,76,0.06)",border:"1px solid rgba(201,168,76,0.15)",
        borderRadius:6,padding:"0.75rem 1rem",fontSize:"0.625rem",color:"var(--text-3)",lineHeight:1.7 }}>
        <strong style={{ color:"var(--gold)" }}>How to read PMI:</strong> A reading above 50 signals economic
        expansion; below 50 signals contraction. The ISM Manufacturing PMI surveys ~300 purchasing managers
        on new orders, production, employment, deliveries, and inventories. Services PMI covers the same for
        the non-manufacturing sector. PMI is a leading indicator — it often turns before GDP and earnings do.
      </div>
    </div>
  );
}

/* ─── Buffett Indicator ──────────────────────────────────────────── */
const BUFFETT_HISTORY = [
  { year:"1990", value:58  }, { year:"1995", value:77  }, { year:"2000", value:148 },
  { year:"2001", value:115 }, { year:"2002", value:86  }, { year:"2003", value:105 },
  { year:"2005", value:118 }, { year:"2007", value:135 }, { year:"2008", value:82  },
  { year:"2009", value:82  }, { year:"2010", value:103 }, { year:"2012", value:102 },
  { year:"2013", value:124 }, { year:"2015", value:128 }, { year:"2017", value:148 },
  { year:"2018", value:142 }, { year:"2019", value:156 }, { year:"2020", value:177 },
  { year:"2021", value:216 }, { year:"2022", value:155 }, { year:"2023", value:172 },
  { year:"2024", value:197 }, { year:"2025", value:184 }, { year:"2026", value:191 },
];

const BUFFETT_CURRENT = 191;
const BUFFETT_ZONES = [
  { label:"Significantly Undervalued", min:0,   max:75,  color:"#22c55e" },
  { label:"Undervalued",               min:75,  max:90,  color:"#4caf7d" },
  { label:"Fair Value",                min:90,  max:115, color:"var(--gold)" },
  { label:"Overvalued",                min:115, max:150, color:"#e07b39" },
  { label:"Significantly Overvalued",  min:150, max:300, color:"#ef4444" },
];

function buffettColor(v) {
  if (v < 75)  return "#22c55e";
  if (v < 90)  return "#4caf7d";
  if (v < 115) return "var(--gold)";
  if (v < 150) return "#e07b39";
  return "#ef4444";
}
function buffettLabel(v) {
  if (v < 75)  return "Significantly Undervalued";
  if (v < 90)  return "Undervalued";
  if (v < 115) return "Fair Value";
  if (v < 150) return "Overvalued";
  return "Significantly Overvalued";
}

function BuffettIndicator() {
  const color = buffettColor(BUFFETT_CURRENT);
  const label = buffettLabel(BUFFETT_CURRENT);
  // Position needle 0–300 mapped to 0–100%
  const needlePct = Math.min(100, (BUFFETT_CURRENT / 250) * 100);

  return (
    <div className="t-card t-card-p" style={{ display:"flex",flexDirection:"column",gap:"1.25rem" }}>
      <div>
        <div className="t-section-title">Buffett Indicator — Market Cap / GDP</div>
        <span style={{ fontSize:"0.6875rem",color:"var(--text-2)" }}>
          Warren Buffett's preferred measure of overall market valuation · Wilshire 5000 ÷ US GDP
        </span>
      </div>

      {/* Main reading + gauge */}
      <div style={{ display:"grid",gridTemplateColumns:"auto 1fr",gap:"2rem",alignItems:"center",flexWrap:"wrap" }}>
        {/* Big number */}
        <div style={{ display:"flex",flexDirection:"column",gap:6,minWidth:180 }}>
          <div style={{ fontSize:"0.5rem",color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"0.1em" }}>Current Reading</div>
          <div style={{ display:"flex",alignItems:"baseline",gap:"0.5rem" }}>
            <span style={{ fontSize:"3.5rem",fontWeight:900,color,lineHeight:1,
              fontFamily:"'JetBrains Mono',monospace" }}>{BUFFETT_CURRENT}%</span>
          </div>
          <span style={{ fontSize:"0.6875rem",fontWeight:700,color,
            background:`${color}15`,borderRadius:5,padding:"3px 10px",display:"inline-block",alignSelf:"flex-start" }}>
            {label}
          </span>
          <div style={{ fontSize:"0.5625rem",color:"var(--text-3)",lineHeight:1.7,marginTop:4 }}>
            US total market cap is approximately <strong style={{ color:"var(--text-1)" }}>{BUFFETT_CURRENT}%</strong> of
            annual GDP. Buffett described ratios above 100% as "playing with fire." The long-term average is ~85%.
          </div>
        </div>

        {/* Zone gauge */}
        <div>
          <div style={{ fontSize:"0.5625rem",color:"var(--text-3)",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.08em" }}>Valuation Spectrum</div>
          {/* Gradient bar */}
          <div style={{ position:"relative",height:20,borderRadius:10,overflow:"visible",
            background:"linear-gradient(90deg, #22c55e 0%, #4caf7d 30%, var(--gold) 42%, #e07b39 60%, #ef4444 100%)",
            marginBottom:28 }}>
            {/* Needle */}
            <div style={{ position:"absolute",top:-4,height:28,width:3,borderRadius:2,
              background:"var(--text-1)",boxShadow:"0 0 6px rgba(255,255,255,0.5)",
              left:`calc(${needlePct}% - 1.5px)`,transition:"left 0.5s" }} />
            {/* Value label below needle */}
            <div style={{ position:"absolute",top:26,fontWeight:800,fontSize:"0.6875rem",color,
              left:`clamp(0px, calc(${needlePct}% - 20px), calc(100% - 44px))`,
              whiteSpace:"nowrap" }}>{BUFFETT_CURRENT}%</div>
          </div>
          {/* Zone labels */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:4,marginTop:8 }}>
            {BUFFETT_ZONES.map(z => (
              <div key={z.label} style={{ textAlign:"center" }}>
                <div style={{ height:4,borderRadius:2,background:z.color,marginBottom:4 }} />
                <div style={{ fontSize:"0.4375rem",color:z.color,lineHeight:1.3,fontWeight:600 }}>{z.label}</div>
                <div style={{ fontSize:"0.4375rem",color:"var(--text-3)" }}>{z.min}–{z.max === 300 ? "300+" : z.max}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Historical chart */}
      <div>
        <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:"0.75rem" }}>
          Historical Buffett Indicator (1990–2026)
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={BUFFETT_HISTORY}>
            <defs>
              <linearGradient id="buffettGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="year" tick={{ fill:"var(--text-3)",fontSize:10 }} axisLine={false} tickLine={false} />
            <YAxis domain={[40,240]} tick={{ fill:"var(--text-3)",fontSize:10 }} axisLine={false} tickLine={false} width={36}
              tickFormatter={v => `${v}%`} />
            <Tooltip {...sharedTooltipStyle} formatter={v => [`${v}%`, "Market Cap / GDP"]} />
            {/* Zone reference lines */}
            <ReferenceLine y={75}  stroke="#22c55e"      strokeDasharray="3 3" strokeOpacity={0.4}
              label={{ value:"Undervalued 75%", fill:"#22c55e", fontSize:8, position:"right" }} />
            <ReferenceLine y={115} stroke="var(--gold)"  strokeDasharray="3 3" strokeOpacity={0.4}
              label={{ value:"Overvalued 115%", fill:"var(--gold)", fontSize:8, position:"right" }} />
            <ReferenceLine y={150} stroke="#ef4444"      strokeDasharray="3 3" strokeOpacity={0.4}
              label={{ value:"Danger 150%", fill:"#ef4444", fontSize:8, position:"right" }} />
            <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2}
              fill="url(#buffettGrad)" dot={{ fill:color,r:3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Key data points */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:"0.625rem" }}>
        {[
          { label:"Long-Term Average",  value:"~85%",  color:"var(--gold)" },
          { label:"Dot-Com Peak (2000)", value:"148%", color:"#e07b39" },
          { label:"2009 Crisis Low",    value:"82%",   color:"#22c55e" },
          { label:"2021 Peak",          value:"216%",  color:"#ef4444" },
          { label:"Current",            value:`${BUFFETT_CURRENT}%`, color },
          { label:"Signal",             value:label,   color },
        ].map(({ label, value, color: c }) => (
          <div key={label} style={{ background:"var(--elevated)",border:"1px solid var(--border-c)",
            borderRadius:6,padding:"0.625rem 0.75rem" }}>
            <div style={{ fontSize:"0.5rem",color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:3 }}>{label}</div>
            <div style={{ fontSize:"0.875rem",fontWeight:800,color:c,fontFamily:"'JetBrains Mono',monospace" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Education note */}
      <div style={{ background:"rgba(201,168,76,0.06)",border:"1px solid rgba(201,168,76,0.15)",
        borderRadius:6,padding:"0.75rem 1rem",fontSize:"0.625rem",color:"var(--text-3)",lineHeight:1.7 }}>
        <strong style={{ color:"var(--gold)" }}>Buffett on this indicator:</strong> "If the percentage relationship falls
        to the 70% or 80% area, buying stocks is likely to work very well for you. If the ratio approaches 200% —
        as it did in 1999 and a part of 2000 — you are playing with fire." — Warren Buffett, Fortune Magazine, 2001.
        The indicator has limitations: low interest rates and globalization can justify higher ratios than in prior decades.
      </div>
    </div>
  );
}

/* ─── Sector Momentum Table ──────────────────────────────────────── */
const SECTORS_DATA = [
  { sector: "Technology", etf: "XLK", d5: 1.82, d20: 3.41, rs: 1.12, signal: "up" },
  { sector: "Healthcare", etf: "XLV", d5: -0.43, d20: 0.98, rs: 0.94, signal: "neutral" },
  { sector: "Financials", etf: "XLF", d5: 0.91, d20: 2.15, rs: 1.03, signal: "up" },
  { sector: "Consumer Disc.", etf: "XLY", d5: -1.24, d20: -0.87, rs: 0.89, signal: "down" },
  { sector: "Industrials", etf: "XLI", d5: 0.55, d20: 1.44, rs: 0.97, signal: "up" },
  { sector: "Energy", etf: "XLE", d5: -2.11, d20: -3.28, rs: 0.82, signal: "down" },
  { sector: "Materials", etf: "XLB", d5: 0.28, d20: 0.73, rs: 0.96, signal: "neutral" },
  { sector: "Real Estate", etf: "XLRE", d5: -0.67, d20: -1.02, rs: 0.91, signal: "down" },
  { sector: "Utilities", etf: "XLU", d5: 0.14, d20: 0.31, rs: 0.98, signal: "neutral" },
  { sector: "Comm. Services", etf: "XLC", d5: 2.03, d20: 4.17, rs: 1.18, signal: "up" },
  { sector: "Consumer Staples", etf: "XLP", d5: 0.07, d20: 0.44, rs: 0.99, signal: "neutral" },
];

function SectorMomentumTable() {
  return (
    <div className="t-card" style={{ overflow: "auto" }}>
      <div style={{ padding: "1rem 1.25rem 0.75rem" }}>
        <span className="t-section-title">Sector Momentum</span>
      </div>
      <table className="t-table">
        <thead>
          <tr>
            <th>Sector</th>
            <th>ETF</th>
            <th>5-Day</th>
            <th>20-Day</th>
            <th>RS vs SPY</th>
            <th>Signal</th>
          </tr>
        </thead>
        <tbody>
          {SECTORS_DATA.map(row => (
            <tr key={row.sector}>
              <td style={{ fontWeight: 600 }}>{row.sector}</td>
              <td>
                <span style={{ color: "var(--gold)", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.04em" }}>
                  {row.etf}
                </span>
              </td>
              <td>
                <span className="t-mono" style={{ color: row.d5 >= 0 ? "var(--up)" : "var(--down)", fontWeight: 600 }}>
                  {row.d5 >= 0 ? "+" : ""}{row.d5.toFixed(2)}%
                </span>
              </td>
              <td>
                <span className="t-mono" style={{ color: row.d20 >= 0 ? "var(--up)" : "var(--down)", fontWeight: 600 }}>
                  {row.d20 >= 0 ? "+" : ""}{row.d20.toFixed(2)}%
                </span>
              </td>
              <td>
                <span className="t-mono" style={{ color: row.rs >= 1 ? "var(--up)" : "var(--down)" }}>
                  {row.rs.toFixed(2)}
                </span>
              </td>
              <td>
                {row.signal === "up" && (
                  <span className="t-badge t-badge-up">↑ Outperform</span>
                )}
                {row.signal === "down" && (
                  <span className="t-badge t-badge-down">↓ Underperform</span>
                )}
                {row.signal === "neutral" && (
                  <span className="t-badge t-badge-neutral">→ Neutral</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function MarketBreadth() {
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const { data: breadth, isLoading } = useQuery({
    queryKey: ["market-breadth"],
    queryFn: () =>
      fetch(`${SERVER}/api/market/breadth`)
        .then(r => { if (!r.ok) throw new Error("breadth fetch failed"); return r.json(); }),
    refetchInterval: 60000,
    onSuccess: () => setLastUpdate(new Date()),
  });

  const adLineData = useMemo(() => genADLine(), []);
  const mcclellanData = useMemo(() => genMcClellan(), []);
  const overallFGScore = 58;

  const vixValue = breadth?.vix || 17.42;
  const advancing = breadth?.advancing || 1823;
  const declining = breadth?.declining || 987;
  const unchanged = breadth?.unchanged || 214;
  const newHighs = breadth?.newHighs || 187;
  const newLows = breadth?.newLows || 54;
  const putCall = breadth?.putCallRatio || 0.85;
  const pctAbove200 = breadth?.pctAbove200dma || 58.3;

  const topCards = [
    {
      id: "ad",
      title: "Advance / Decline",
      subtitle: "NYSE breadth",
      content: <ADDonut advancing={advancing} declining={declining} unchanged={unchanged} />,
    },
    {
      id: "hl",
      title: "New Highs / Lows",
      subtitle: "52-week extremes",
      content: <HighsLows highs={newHighs} lows={newLows} />,
    },
    {
      id: "pc",
      title: "Put / Call Ratio",
      subtitle: "CBOE equity P/C",
      content: <PutCallGauge value={putCall} />,
    },
    {
      id: "ma200",
      title: "% Above 200-Day MA",
      subtitle: "S&P 500 constituents",
      content: <MaBar value={pctAbove200} />,
    },
  ];

  return (
    <div className="t-bg" style={{ padding: "1.5rem", minHeight: "100vh", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
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
                <BarChart2 size={14} style={{ color: "var(--gold)" }} />
              </div>
              <h1 className="t-page-title" style={{ margin: 0 }}>MARKET BREADTH & INTERNALS</h1>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.65, maxWidth: 560, margin: "0 0 1rem" }}>
              Look beneath the surface of the market. Breadth indicators reveal whether a rally is broad-based or narrow — critical signals before major turning points.
            </p>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              {["A/D Line", "New Highs & Lows", "VIX Volatility", "Market Internals"].map((label) => (
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
              { icon: ArrowUpDown, label: "Advance/Decline", sub: "Breadth line & ratio", color: "#3b82f6" },
              { icon: BarChart2, label: "New Highs/Lows", sub: "52-week extremes", color: "var(--gold)" },
              { icon: Waves, label: "McClellan Oscillator", sub: "Breadth momentum signal", color: "var(--teal)" },
              { icon: Activity, label: "VIX", sub: "Fear & volatility index", color: "#f59e0b" },
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

      {/* Top 4 breadth cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {topCards.map(card => (
          <div key={card.id} className="t-card t-card-p t-card-hover" style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <div>
              <div className="t-section-title">{card.title}</div>
              <span style={{ fontSize: "0.6875rem", color: "var(--text-3)", marginTop: 2, display: "block" }}>{card.subtitle}</span>
            </div>
            {isLoading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div className="t-skeleton" style={{ height: 80, borderRadius: 3 }} />
                <div className="t-skeleton" style={{ height: 16, width: "60%", borderRadius: 3 }} />
              </div>
            ) : card.content}
          </div>
        ))}
      </div>

      {/* AD Line Chart */}
      <div className="t-card t-card-p">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <div className="t-section-title">NYSE Advance-Decline Line</div>
            <span style={{ fontSize: "0.6875rem", color: "var(--text-2)" }}>Cumulative daily breadth — 1 year</span>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {adLineData.length > 0 && (
              <span className={`t-badge ${adLineData[adLineData.length - 1].value > adLineData[0].value ? "t-badge-up" : "t-badge-down"}`}>
                {adLineData[adLineData.length - 1].value > adLineData[0].value ? "▲" : "▼"} {adLineData[adLineData.length - 1].value > adLineData[0].value ? "Uptrend" : "Downtrend"}
              </span>
            )}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={adLineData}>
            <defs>
              <linearGradient id="adGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--blue)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--blue)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fill: "var(--text-3)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={Math.floor(adLineData.length / 8)}
            />
            <YAxis
              tick={{ fill: "var(--text-3)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              domain={["auto", "auto"]}
              width={48}
            />
            <Tooltip {...sharedTooltipStyle} formatter={v => [v.toLocaleString(), "A/D Line"]} />
            <Area type="monotone" dataKey="value" stroke="var(--blue)" strokeWidth={2} fill="url(#adGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* VIX Section */}
      <VIXCard vixValue={vixValue} />

      {/* McClellan Oscillator */}
      <div className="t-card t-card-p">
        <div style={{ marginBottom: "1rem" }}>
          <div className="t-section-title">McClellan Oscillator</div>
          <span style={{ fontSize: "0.6875rem", color: "var(--text-2)" }}>Daily breadth momentum — last 60 sessions. +50 overbought / −50 oversold</span>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={mcclellanData} barCategoryGap="10%">
            <XAxis
              dataKey="date"
              tick={{ fill: "var(--text-3)", fontSize: 9 }}
              tickLine={false}
              axisLine={false}
              interval={9}
            />
            <YAxis
              tick={{ fill: "var(--text-3)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              domain={[-120, 120]}
              width={32}
            />
            <Tooltip {...sharedTooltipStyle} formatter={v => [v.toFixed(1), "Oscillator"]} />
            <ReferenceLine y={0} stroke="var(--border-alt)" strokeWidth={1} />
            <ReferenceLine y={50} stroke="var(--down)" strokeDasharray="4 3" strokeOpacity={0.5} label={{ value: "+50", fill: "var(--down)", fontSize: 9, position: "right" }} />
            <ReferenceLine y={-50} stroke="var(--up)" strokeDasharray="4 3" strokeOpacity={0.5} label={{ value: "−50", fill: "var(--up)", fontSize: 9, position: "right" }} />
            <Bar
              dataKey="value"
              radius={[1, 1, 0, 0]}
              cell={mcclellanData.map((d, i) => (
                <Cell key={i} fill={d.value >= 0 ? "var(--up)" : "var(--down)"} fillOpacity={0.8} />
              ))}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Fear & Greed */}
      <FearGreedCard overallScore={overallFGScore} />

      {/* Sector Momentum */}
      <SectorMomentumTable />

      {/* PMI Dashboard */}
      <PMISection />

      {/* Buffett Indicator */}
      <BuffettIndicator />
    </div>
  );
}
