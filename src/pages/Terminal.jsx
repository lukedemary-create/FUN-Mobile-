import React, {
  useState, useRef, useCallback, useEffect, createContext, useContext
} from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, LineChart, Line
} from "recharts";
import {
  Search, TrendingUp, TrendingDown, ChevronDown, ChevronUp,
  MonitorDot, Layers, BarChart2, HelpCircle, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────
   DATA LAYER — untouched
───────────────────────────────────────────────────────────────── */
const BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

const fetchStock = (ticker) =>
  fetch(`${BASE}/functions/getStockData`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticker }),
  }).then((r) => r.json());

const formatPrice = (price) =>
  price != null
    ? `$${Number(price).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : "—";

const formatBig = (v) => {
  if (v == null) return "—";
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9)  return `$${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6)  return `$${(v / 1e6).toFixed(2)}M`;
  return `$${v}`;
};

const fmt = (v, d = 2) => (v != null ? Number(v).toFixed(d) : "—");

const RECENT = ["AAPL", "MSFT", "GOOGL", "TSLA", "NVDA", "JPM", "AMZN", "META"];

const TIMEFRAMES = [
  { label: "1D", key: "1d" }, { label: "5D", key: "5d" },
  { label: "1M", key: "1m" }, { label: "3M", key: "3m" },
  { label: "6M", key: "6m" }, { label: "1Y", key: "1y" },
  { label: "2Y", key: "2y" }, { label: "5Y", key: "5y" },
  { label: "MAX", key: "max" },
];

const TABS = ["OVERVIEW", "CHART", "FINANCIALS", "ANALYSIS"];

function getChartData(stockData, tf) {
  if (!stockData) return [];
  const daily    = stockData.priceHistoryDaily    || stockData.price_history_daily    || [];
  const intraday = stockData.priceHistoryIntraday || stockData.price_history_intraday || [];
  const history  = stockData.priceHistory         || stockData.price_history          || [];

  const cutoffMap = {
    "1d":  () => { const d = new Date(); d.setDate(d.getDate() - 1);       return d; },
    "5d":  () => { const d = new Date(); d.setDate(d.getDate() - 5);       return d; },
    "1m":  () => { const d = new Date(); d.setMonth(d.getMonth() - 1);     return d; },
    "3m":  () => { const d = new Date(); d.setMonth(d.getMonth() - 3);     return d; },
    "6m":  () => { const d = new Date(); d.setMonth(d.getMonth() - 6);     return d; },
    "1y":  () => { const d = new Date(); d.setFullYear(d.getFullYear()-1); return d; },
    "2y":  () => { const d = new Date(); d.setFullYear(d.getFullYear()-2); return d; },
    "5y":  () => { const d = new Date(); d.setFullYear(d.getFullYear()-5); return d; },
    "max": () => new Date(0),
  };
  const cutoff = cutoffMap[tf] ? cutoffMap[tf]() : new Date(0);

  if (tf === "1d" || tf === "5d") {
    const src = intraday.length > 0 ? intraday : daily;
    return src.filter((d) => new Date(d.date) >= cutoff).map((d) => ({
      date: d.date,
      label: tf === "1d"
        ? new Date(d.date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
        : new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      price: d.price ?? d.close,
      volume: d.volume,
    }));
  }
  const src = (tf === "5y" || tf === "max") ? (history.length > 0 ? history : daily) : daily;
  return src.filter((d) => new Date(d.date) >= cutoff).map((d) => ({
    date: d.date,
    label: new Date(d.date).toLocaleDateString("en-US", {
      month: "short", day: "numeric",
      year: (tf === "max" || tf === "5y") ? "2-digit" : undefined,
    }),
    price: d.price ?? d.close,
    volume: d.volume,
  }));
}

/* ─────────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────────── */
const GOLD  = "#F5A623";
const TEAL  = "#00B4C6";
const GREEN = "#10b981";
const RED   = "#ef4444";
const BG    = "#0a0a0f";
const SURF  = "#111318";
const ELEV  = "#16181f";
const BORD  = "#1e2028";
const T1    = "#f1f5f9";
const T2    = "#94a3b8";
const T3    = "#64748b";

const SECTOR_COLORS = {
  "Technology":             { text: "#818cf8", bg: "rgba(99,102,241,0.12)",  border: "rgba(99,102,241,0.3)"  },
  "Healthcare":             { text: "#34d399", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.3)"  },
  "Financial Services":     { text: GOLD,      bg: "rgba(245,165,35,0.12)",  border: "rgba(245,165,35,0.3)"  },
  "Financials":             { text: GOLD,      bg: "rgba(245,165,35,0.12)",  border: "rgba(245,165,35,0.3)"  },
  "Consumer Cyclical":      { text: "#fb923c", bg: "rgba(249,115,22,0.12)",  border: "rgba(249,115,22,0.3)"  },
  "Consumer Defensive":     { text: "#eab308", bg: "rgba(234,179,8,0.12)",   border: "rgba(234,179,8,0.3)"   },
  "Energy":                 { text: "#f87171", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.3)"   },
  "Industrials":            { text: "#60a5fa", bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.3)"  },
  "Communication Services": { text: "#c084fc", bg: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.3)"  },
  "Real Estate":            { text: "#2dd4bf", bg: "rgba(20,184,166,0.12)",  border: "rgba(20,184,166,0.3)"  },
  "Utilities":              { text: "#38bdf8", bg: "rgba(14,165,233,0.12)",  border: "rgba(14,165,233,0.3)"  },
  "Basic Materials":        { text: "#a3e635", bg: "rgba(132,204,22,0.12)", border: "rgba(132,204,22,0.3)"  },
};

const METRIC_INFO = {
  "Revenue (TTM)": "Total sales in the last 12 months. Revenue growth signals strong demand for products and services — but growth without profit is just noise.",
  "Net Income":    "What's left after every cost, tax, and expense. This is real profit — the money that belongs to shareholders.",
  "Gross Margin":  "Revenue minus cost of goods sold, as a %. Margins above 50% signal strong pricing power. Apple runs ~44%. Software companies often exceed 70%.",
  "Op. Margin":    "Operating profit as a % of revenue. Measures operational efficiency. 15%+ is generally strong. Below 5% warrants scrutiny.",
  "Debt/Equity":   "Total debt divided by shareholder equity. Below 1.0 is conservative. Above 2.0 can signal risk, though utilities and banks naturally carry more.",
  "ROE":           "Return on Equity — profit per dollar of shareholder investment. Warren Buffett looks for consistent ROE above 15%. Elite companies exceed 20%.",
  "P/B Ratio":     "Price divided by book value per share. Above 1 means the market values the company higher than its accounting records show. Tech companies typically run high.",
  "Free Cash Flow":"Cash remaining after capital spending. FCF is what companies use to pay dividends, buy back stock, or invest in growth. The lifeblood of long-term value.",
  "Expense Ratio": "Annual fee charged as a % of assets. Seemingly small: 1% more per year = $100K less on $1M over 20 years. Always minimize this.",
  "YTD Return":    "Total return since January 1st including dividends reinvested. Compare to your benchmark — raw returns without context are meaningless.",
  "Beta":          "Volatility relative to the market. Beta 1.0 moves with the market. Beta 1.5 means 50% more volatile. Defensive stocks often have Beta below 0.7.",
  "Dividend Yield":"Annual dividend as a % of stock price. High yield can signal income or a value trap. Always check: is the payout ratio sustainable?",
  "Fund Family":   "The asset management firm running this fund — Vanguard pioneered low-cost indexing, BlackRock manages the most AUM globally, Fidelity offers both.",
  "Category":      "The fund's investment style classification — e.g. 'Large Blend' means large-cap stocks with a mix of value and growth characteristics.",
  "P/E Ratio":     "Price divided by earnings per share. How much investors pay per $1 of profit. The S&P 500 historically averages 15–25x. Above 35x requires strong growth to justify.",
  "Forward P/E":   "P/E using next year's projected earnings rather than last year's. A lower Forward P/E than trailing P/E signals expected earnings growth.",
  "PEG Ratio":     "P/E divided by earnings growth rate. The 'fair value' rule of thumb: PEG of 1.0 means price equals growth. Below 1.0 can signal undervaluation.",
  "P/S Ratio":     "Price divided by revenue per share. Useful for companies with no earnings. Tech firms often trade at high P/S multiples based on future expectations.",
  "EV/EBITDA":     "Enterprise Value divided by earnings before interest, taxes, depreciation. More comprehensive than P/E — accounts for debt and capital structure.",
  "ROE (Analysis)":"Return on equity in analysis context. Measures how efficiently the company converts equity financing into profit.",
  "Profit Margin": "Net income as a % of revenue. Luxury goods companies often exceed 20%. Grocery chains might run 2–3%. Context matters enormously by sector.",
};

/* ─────────────────────────────────────────────────────────────────
   GLOBAL STYLES INJECTION
───────────────────────────────────────────────────────────────── */
const CINEMA_CSS = `
  @keyframes breatheGold {
    0%,100% { box-shadow: 0 0 20px rgba(245,165,35,0.15), 0 0 60px rgba(245,165,35,0.05); }
    50%      { box-shadow: 0 0 40px rgba(245,165,35,0.35), 0 0 90px rgba(245,165,35,0.15); }
  }
  @keyframes breatheLive {
    0%,100% { transform: scale(1);   opacity: 1; }
    50%      { transform: scale(1.7); opacity: 0.4; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes floatUp {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-4px); }
  }
  .cinema-breathe { animation: breatheGold 3s ease-in-out infinite; }
  .cinema-live-dot {
    width: 8px; height: 8px; border-radius: 50%; background: ${GREEN};
    animation: breatheLive 2s ease-in-out infinite;
    box-shadow: 0 0 6px ${GREEN};
  }
  .cinema-live-ring {
    width: 18px; height: 18px; border-radius: 50%;
    border: 1.5px solid ${GREEN}; opacity: 0.35;
    animation: breatheLive 2s ease-in-out infinite;
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: 0.3s;
  }
  .cinema-number {
    font-family: 'SF Mono', 'Fira Code', 'JetBrains Mono', ui-monospace, monospace;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
  }
  .cinema-label {
    font-size: 0.5875rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${T3};
    font-weight: 600;
  }
  .cinema-card {
    background: rgba(17,19,24,0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid ${BORD};
    border-radius: 14px;
  }
  .cinema-card-gold-top {
    border-top: 1px solid rgba(245,165,35,0.4);
  }
  .cinema-tab-btn {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    padding: 8px 18px;
    border-radius: 99px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.18s ease;
    font-family: inherit;
  }
`;

function InjectStyles() {
  useEffect(() => {
    const id = "cinema-terminal-styles";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = CINEMA_CSS;
      document.head.appendChild(style);
    }
  }, []);
  return null;
}

/* ─────────────────────────────────────────────────────────────────
   PARTICLE CANVAS
───────────────────────────────────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });
  const partsRef  = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const COUNT = 160;
    partsRef.current = Array.from({ length: COUNT }, () => ({
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height,
      vx:   (Math.random() - 0.5) * 0.25,
      vy:   (Math.random() - 0.5) * 0.18,
      size: Math.random() * 2 + 0.4,
      base: Math.random() * 0.35 + 0.05,
      color: Math.random() > 0.45 ? GOLD : TEAL,
      layer: Math.floor(Math.random() * 3),
    }));

    const SPEED = [0.25, 0.6, 1.1];
    const ALPHA = [0.12, 0.22, 0.38];

    const tick = () => {
      if (!canvas.width) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      partsRef.current.forEach((p) => {
        const s = SPEED[p.layer];
        p.x += p.vx * s;
        p.y += p.vy * s;
        if (p.x < -4) p.x = canvas.width  + 4;
        if (p.x > canvas.width  + 4) p.x = -4;
        if (p.y < -4) p.y = canvas.height + 4;
        if (p.y > canvas.height + 4) p.y = -4;

        const dx = p.x - mx, dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90 && dist > 0) {
          const f = (90 - dist) / 90;
          p.x += (dx / dist) * f * 1.8;
          p.y += (dy / dist) * f * 1.8;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * ((p.layer + 1) / 2), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.base * ALPHA[p.layer];
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(tick);
    };
    tick();

    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    document.addEventListener("mousemove", handleMouse);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
      document.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 0,
        opacity: 0.9,
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────────────────────────── */
function use3DTilt(maxAngle = 10) {
  const [tilt, setTilt] = useState({ x: 0, y: 0, hover: false });
  const handleMouseMove = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    setTilt({ x: -y * maxAngle, y: x * maxAngle, hover: true });
  }, [maxAngle]);
  const handleMouseLeave = useCallback(() => setTilt({ x: 0, y: 0, hover: false }), []);
  return { tilt, handleMouseMove, handleMouseLeave };
}

function useCountUp(target, duration = 1100) {
  const [val, setVal] = useState(0);
  const rafRef = useRef(null);
  const prevTarget = useRef(null);

  useEffect(() => {
    if (target == null || target === prevTarget.current) return;
    prevTarget.current = target;
    const num = parseFloat(String(target).replace(/[^0-9.-]/g, ""));
    if (isNaN(num)) return;
    const start = Date.now();
    const from = 0;
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 4);
      setVal(from + num * e);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return val;
}

/* ─────────────────────────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────────────────────────── */
function CinemaSkeleton() {
  const bar = (w, h, mb = 0) => (
    <div style={{
      width: w, height: h, marginBottom: mb, borderRadius: 6,
      background: `linear-gradient(90deg, ${ELEV} 25%, #1c1f28 50%, ${ELEV} 75%)`,
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s ease infinite",
    }} />
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", paddingTop: "1rem" }}>
      <div className="cinema-card" style={{ padding: "1.5rem", height: 180 }}>{bar("100%", "100%")}</div>
      <div style={{ display: "flex", gap: "0.75rem" }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="cinema-card" style={{ flex: 1, padding: "1.25rem" }}>
            {bar("60%", 10, 10)}{bar("80%", 22)}
          </div>
        ))}
      </div>
      <div className="cinema-card" style={{ padding: "1.5rem", height: 320 }}>{bar("100%", "100%")}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   BREATHING LIVE INDICATOR
───────────────────────────────────────────────────────────────── */
function BreathingLive() {
  return (
    <div style={{ position: "relative", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="cinema-live-ring" />
      <div className="cinema-live-dot" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   BADGE PILL
───────────────────────────────────────────────────────────────── */
function GlassPill({ children, color = T2, glow = false, size = "sm" }) {
  const sz = size === "lg" ? { fontSize: "0.875rem", padding: "5px 14px" } : { fontSize: "0.6875rem", padding: "3px 11px" };
  return (
    <span style={{
      ...sz,
      fontWeight: 700,
      borderRadius: 99,
      letterSpacing: "0.04em",
      color,
      background: `${color}18`,
      border: `1px solid ${color}40`,
      boxShadow: glow ? `0 0 12px ${color}35` : "none",
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────
   3D TILT METRIC CARD (constellation strip)
───────────────────────────────────────────────────────────────── */
function MetricCard3D({ label, value, color = T1, pulse = false }) {
  const { tilt, handleMouseMove, handleMouseLeave } = use3DTilt(8);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "700px", flexShrink: 0, minWidth: 120 }}
    >
      <motion.div
        animate={{
          rotateX: tilt.x, rotateY: tilt.y,
          translateZ: tilt.hover ? 6 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28, mass: 0.5 }}
        style={{
          background: "rgba(17,19,24,0.9)",
          backdropFilter: "blur(12px)",
          border: `1px solid ${tilt.hover ? GOLD + "55" : BORD}`,
          borderTop: `1px solid ${tilt.hover ? GOLD + "88" : BORD}`,
          borderRadius: 12,
          padding: "14px 16px",
          transformStyle: "preserve-3d",
          boxShadow: tilt.hover
            ? `0 12px 40px rgba(0,0,0,0.5), 0 0 20px ${GOLD}18`
            : "0 4px 20px rgba(0,0,0,0.3)",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      >
        <div className="cinema-label" style={{ marginBottom: 8 }}>{label}</div>
        <div
          className="cinema-number"
          style={{
            fontSize: "1.0625rem",
            fontWeight: 700,
            color,
            animation: pulse && tilt.hover ? "breatheGold 1.5s ease-in-out infinite" : "none",
          }}
        >
          {value}
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   3D RANGE BAR
───────────────────────────────────────────────────────────────── */
function CinemaRangeBar({ low, high, current, targetPct, targetColor = GREEN }) {
  const pct = (low != null && high != null && current != null && high > low)
    ? Math.max(0, Math.min(100, ((current - low) / (high - low)) * 100))
    : null;

  return (
    <div style={{ width: "100%" }}>
      {/* Labels */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <div>
          <div className="cinema-label" style={{ marginBottom: 3 }}>52W LOW</div>
          <div className="cinema-number" style={{ fontSize: "0.8125rem", color: RED, fontWeight: 700 }}>{formatPrice(low)}</div>
        </div>
        {pct != null && (
          <div style={{ textAlign: "center" }}>
            <div className="cinema-label" style={{ marginBottom: 3, color: GOLD }}>CURRENT</div>
            <div className="cinema-number" style={{ fontSize: "0.8125rem", color: GOLD, fontWeight: 700 }}>{formatPrice(current)}</div>
          </div>
        )}
        <div style={{ textAlign: "right" }}>
          <div className="cinema-label" style={{ marginBottom: 3 }}>52W HIGH</div>
          <div className="cinema-number" style={{ fontSize: "0.8125rem", color: GREEN, fontWeight: 700 }}>{formatPrice(high)}</div>
        </div>
      </div>

      {/* Track */}
      <div style={{ position: "relative", height: 8, borderRadius: 4 }}>
        {/* Track shadow beneath */}
        <div style={{
          position: "absolute", inset: 0,
          borderRadius: 4,
          background: "rgba(0,0,0,0.5)",
          transform: "translateY(2px) scaleY(0.5)",
          filter: "blur(3px)",
        }} />
        {/* Gradient track */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 4,
          background: `linear-gradient(90deg, ${RED}90 0%, ${GOLD}90 50%, ${GREEN}90 100%)`,
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4), inset 0 -1px 2px rgba(255,255,255,0.05)",
        }} />

        {/* Target dot (optional) */}
        {targetPct != null && (
          <div style={{
            position: "absolute",
            left: `${targetPct}%`,
            top: "50%",
            transform: "translate(-50%,-50%)",
            width: 10, height: 10,
            background: targetColor,
            borderRadius: "50%",
            border: `2px solid ${BG}`,
            boxShadow: `0 0 8px ${targetColor}`,
            zIndex: 2,
          }} />
        )}

        {/* Animated current price sphere */}
        {pct != null && (
          <motion.div
            initial={{ left: "0%", opacity: 0, scale: 0 }}
            animate={{ left: `${pct}%`, opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, type: "spring", stiffness: 50, damping: 16, delay: 0.3 }}
            style={{
              position: "absolute", top: "50%",
              transform: "translate(-50%,-50%)",
              width: 18, height: 18,
              background: `radial-gradient(circle at 35% 35%, #fff8e7, ${GOLD})`,
              borderRadius: "50%",
              border: `2.5px solid ${BG}`,
              boxShadow: `0 0 0 3px ${GOLD}30, 0 0 16px ${GOLD}80, 0 0 32px ${GOLD}40`,
              zIndex: 3,
            }}
          />
        )}
      </div>

      {pct != null && (
        <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "0.625rem", color: T3 }}>
            {pct.toFixed(0)}% of 52-week range
          </div>
          {targetPct != null && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.625rem", color: T3 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: targetColor }} />
              Analyst Target
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FLIP CARD (Analysis / Education)
───────────────────────────────────────────────────────────────── */
function FlipCard({ label, value, info, accentColor = GOLD, badge = null, height = 110 }) {
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = useCallback((e) => {
    if (flipped) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    setTilt({ x: -y * 9, y: x * 9 });
  }, [flipped]);

  const handleLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  return (
    <div
      style={{ perspective: "900px", cursor: info ? "pointer" : "default" }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={() => { if (info) { setFlipped(f => !f); setTilt({ x: 0, y: 0 }); } }}
    >
      <div style={{
        position: "relative",
        height,
        transformStyle: "preserve-3d",
        transition: flipped ? "transform 0.55s cubic-bezier(0.175,0.885,0.32,1.275)" : "transform 0.12s ease",
        transform: flipped
          ? "rotateY(180deg)"
          : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}>
        {/* Front */}
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
          background: "rgba(17,19,24,0.92)",
          backdropFilter: "blur(12px)",
          border: `1px solid ${BORD}`,
          borderTop: `1px solid ${accentColor}55`,
          borderRadius: 12,
          padding: "14px 16px",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          boxShadow: "0 6px 28px rgba(0,0,0,0.35)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div className="cinema-label" style={{ color: accentColor, fontSize: "0.5625rem" }}>{label}</div>
            {info && <HelpCircle size={10} style={{ color: T3, opacity: 0.6 }} />}
          </div>
          <div className="cinema-number" style={{ fontSize: "1.0625rem", fontWeight: 700, color: T1 }}>{value}</div>
          {badge ? (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontSize: "0.5375rem", fontWeight: 700,
              color: badge.color, letterSpacing: "0.06em",
              background: `${badge.color}18`, border: `1px solid ${badge.color}35`,
              padding: "2px 8px", borderRadius: 4, alignSelf: "flex-start",
            }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: badge.color }} />
              {badge.label}
            </div>
          ) : info ? (
            <div style={{ fontSize: "0.5rem", color: T3, letterSpacing: "0.05em" }}>CLICK TO LEARN MORE</div>
          ) : <div style={{ height: 16 }} />}
        </div>

        {/* Back */}
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: `rgba(22,18,12,0.95)`,
          backdropFilter: "blur(16px)",
          border: `1px solid ${GOLD}40`,
          borderRadius: 12,
          padding: "13px 15px",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          overflow: "hidden",
          boxShadow: `0 6px 28px rgba(0,0,0,0.4), inset 0 0 60px ${GOLD}06`,
        }}>
          <div className="cinema-label" style={{ color: GOLD, fontSize: "0.5375rem" }}>{label}</div>
          <p style={{ fontSize: "0.6875rem", color: T2, lineHeight: 1.6, margin: 0, flex: 1, display: "flex", alignItems: "center", paddingTop: 6 }}>
            {info}
          </p>
          <div style={{ fontSize: "0.5rem", color: T3, letterSpacing: "0.05em" }}>CLICK TO FLIP BACK</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   COMPANY OVERVIEW CARD
───────────────────────────────────────────────────────────────── */
function CompanyOverviewCard({ data }) {
  const [open, setOpen] = useState(true);
  const sector = data.sector || "";
  const sc = SECTOR_COLORS[sector] || { text: T2, bg: `${T2}15`, border: `${T2}30` };
  const quoteType = data.quote_type || "EQUITY";
  const isFund = quoteType === "MUTUALFUND";
  const isETF  = quoteType === "ETF";
  const title  = isFund ? "Fund Overview" : isETF ? "ETF Overview" : "Company Overview";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5 }}
      style={{
        position: "relative",
        background: "rgba(17,19,24,0.88)",
        backdropFilter: "blur(16px)",
        border: `1px solid ${BORD}`,
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      {/* Gold left accent */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
        background: `linear-gradient(180deg, ${GOLD}, ${GOLD}40)`,
        borderRadius: "14px 0 0 14px",
      }} />
      {/* Subtle gold glow inside */}
      <div style={{
        position: "absolute", top: -60, left: -20, width: 200, height: 200,
        background: `radial-gradient(circle, ${GOLD}08 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 1.25rem 1rem 1.5rem",
          background: "none", border: "none", cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "0.875rem", fontWeight: 700, color: T1, letterSpacing: "-0.01em" }}>
            {title}
          </span>
          {sector && (
            <span style={{
              fontSize: "0.6875rem", fontWeight: 700, padding: "3px 10px", borderRadius: 99,
              background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text,
              boxShadow: `0 0 8px ${sc.text}25`,
            }}>{sector}</span>
          )}
          {data.industry && (
            <span style={{ fontSize: "0.75rem", color: T3 }}>{data.industry}</span>
          )}
        </div>
        <motion.div animate={{ rotate: open ? 0 : -90 }} transition={{ duration: 0.2 }}>
          <ChevronUp size={14} style={{ color: T3 }} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 1.25rem 1.25rem 1.5rem", color: T2, fontSize: "0.8125rem", lineHeight: 1.8 }}>
              {data.description}
            </div>
            {(data.exchange || data.country || data.employees) && (
              <div style={{
                display: "flex", gap: "2rem", padding: "0.875rem 1.25rem 1rem 1.5rem",
                borderTop: `1px solid ${BORD}`, flexWrap: "wrap",
              }}>
                {[
                  data.exchange && { l: "EXCHANGE", v: data.exchange },
                  data.country  && { l: "COUNTRY",  v: data.country  },
                  data.employees && { l: "EMPLOYEES", v: Number(data.employees).toLocaleString() },
                ].filter(Boolean).map(({ l, v }) => (
                  <div key={l}>
                    <div className="cinema-label" style={{ marginBottom: 3 }}>{l}</div>
                    <div className="cinema-number" style={{ fontSize: "0.8125rem", color: T1 }}>{v}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   OVERVIEW TAB
───────────────────────────────────────────────────────────────── */
function OverviewTab({ data }) {
  const price     = data.current_price ?? data.price;
  const change    = data.price_change   ?? data.change;
  const changePct = data.price_change_pct ?? data.change_percent;
  const isUp      = (change ?? 0) >= 0;
  const low52     = data.fifty_two_week_low  ?? data.week_52_low;
  const high52    = data.fifty_two_week_high ?? data.week_52_high;
  const animPrice = useCountUp(price);

  const quoteType = data.quote_type || "EQUITY";
  const isFund = quoteType === "MUTUALFUND";
  const isETF  = quoteType === "ETF";
  const isEquity = !isFund && !isETF;

  const statsRow = [
    { label: isFund ? "NAV" : "PRICE",  value: formatPrice(isFund && data.nav ? data.nav : price), color: GOLD },
    { label: "CHANGE $",  value: change != null ? `${isUp ? "+" : ""}${fmt(change)}` : "—", color: isUp ? GREEN : RED },
    { label: "CHANGE %",  value: changePct != null ? `${isUp ? "+" : ""}${fmt(changePct)}%` : "—", color: isUp ? GREEN : RED },
    ...(isEquity ? [
      { label: "MKT CAP",   value: formatBig(data.market_cap), color: T1 },
      { label: "P/E",       value: data.pe_ratio != null ? fmt(data.pe_ratio, 1) : "—", color: T1 },
      { label: "EPS (TTM)", value: data.eps != null ? `$${fmt(data.eps)}` : "—", color: T1 },
    ] : [
      { label: "MKT CAP",    value: formatBig(data.market_cap), color: T1 },
      { label: "EXP RATIO",  value: data.expense_ratio != null ? `${(data.expense_ratio * 100).toFixed(2)}%` : "—", color: T1 },
      { label: "YTD RETURN", value: data.ytd_return != null ? `${(data.ytd_return * 100).toFixed(2)}%` : "—", color: isUp ? GREEN : RED },
    ]),
    { label: "BETA",      value: data.beta != null ? fmt(data.beta, 2) : "—", color: T1 },
    { label: "DIV YIELD", value: data.dividend_yield != null ? `${fmt(data.dividend_yield, 2)}%` : "N/A", color: T1 },
    { label: "52W HIGH",  value: formatPrice(high52), color: GREEN },
    { label: "52W LOW",   value: formatPrice(low52),  color: RED   },
  ];

  const getBadge = (label, value) => {
    const num = parseFloat(String(value).replace(/[^0-9.-]/g, ""));
    if (isNaN(num)) return null;
    const rules = {
      "Gross Margin": [[40, GREEN, "STRONG"], [20, GOLD, "FAIR"],  [0, RED, "WEAK"]],
      "Op. Margin":   [[20, GREEN, "STRONG"], [10, GOLD, "FAIR"],  [0, RED, "WEAK"]],
      "ROE":          [[20, GREEN, "STRONG"], [10, GOLD, "FAIR"],  [0, RED, "WEAK"]],
      "Debt/Equity":  [[null, GREEN, "LOW"],  [2, GOLD, "MODERATE"], [Infinity, RED, "HIGH"]],
    };
    const r = rules[label];
    if (!r) return null;
    for (const [thresh, color, lbl] of r) {
      if (label === "Debt/Equity") {
        if (num < 1) return { label: "LOW", color: GREEN };
        if (num < 2) return { label: "MODERATE", color: GOLD };
        return { label: "HIGH", color: RED };
      }
      if (thresh === null || num >= thresh) return { label: lbl, color };
    }
    return null;
  };

  const metrics = isEquity ? [
    { label: "Revenue (TTM)", value: formatBig(data.revenue) },
    { label: "Net Income",    value: formatBig(data.net_income) },
    { label: "Gross Margin",  value: data.gross_margin   != null ? `${fmt(data.gross_margin, 1)}%`   : "—" },
    { label: "Op. Margin",    value: data.operating_margin != null ? `${fmt(data.operating_margin, 1)}%` : "—" },
    { label: "Debt/Equity",   value: data.debt_to_equity  != null ? fmt(data.debt_to_equity, 2)     : "—" },
    { label: "ROE",           value: data.return_on_equity != null ? `${fmt(data.return_on_equity, 1)}%` : "—" },
    { label: "P/B Ratio",     value: data.price_to_book   != null ? fmt(data.price_to_book, 2)      : "—" },
    { label: "Free Cash Flow", value: formatBig(data.free_cash_flow) },
  ] : [
    { label: "Fund Family",   value: data.fund_family   || "—" },
    { label: "Category",      value: data.fund_category || "—" },
    { label: "Expense Ratio", value: data.expense_ratio != null ? `${(data.expense_ratio * 100).toFixed(2)}%` : "—" },
    { label: "YTD Return",    value: data.ytd_return    != null ? `${(data.ytd_return * 100).toFixed(2)}%`    : "—" },
    { label: "Beta",          value: data.beta          != null ? fmt(data.beta, 2)                          : "—" },
    { label: "Dividend Yield", value: data.dividend_yield != null ? `${fmt(data.dividend_yield, 2)}%`        : "—" },
    { label: "52W High",      value: formatPrice(data.fifty_two_week_high) },
    { label: "52W Low",       value: formatPrice(data.fifty_two_week_low)  },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* ── HERO PRICE ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="cinema-card cinema-breathe"
        style={{
          padding: "1.75rem 2rem",
          position: "relative", overflow: "hidden",
          border: `1px solid ${isUp ? GREEN + "30" : RED + "30"}`,
        }}
      >
        {/* Ambient directional glow */}
        <div style={{
          position: "absolute", top: -100, right: -80, width: 400, height: 400,
          background: `radial-gradient(circle, ${isUp ? GREEN : RED}10 0%, transparent 65%)`,
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative" }}>
          {/* Price row */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
            <div>
              <div className="cinema-label" style={{ marginBottom: 6 }}>LIVE PRICE</div>
              <div className="cinema-number" style={{
                fontSize: "3rem", fontWeight: 800, color: GOLD,
                letterSpacing: "-0.04em", lineHeight: 1,
                textShadow: `0 0 40px ${GOLD}50`,
              }}>
                ${animPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 28 }}>
              <GlassPill color={isUp ? GREEN : RED} glow size="lg">
                {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {isUp ? "+" : ""}{fmt(changePct)}%
              </GlassPill>
              <GlassPill color={isUp ? GREEN : RED}>
                {isUp ? "+" : ""}{fmt(change)}
              </GlassPill>
            </div>

            <div style={{ paddingTop: 30, display: "flex", alignItems: "center", gap: 8 }}>
              <BreathingLive />
              <span className="cinema-label" style={{ color: GREEN }}>LIVE</span>
            </div>

            {(isFund || isETF) && (
              <div style={{ paddingTop: 28 }}>
                <GlassPill color={T2}>{isFund ? "MUTUAL FUND" : "ETF"}</GlassPill>
              </div>
            )}
          </div>

          {/* 52W Range */}
          {low52 != null && high52 != null && (
            <CinemaRangeBar low={low52} high={high52} current={price} />
          )}
        </div>
      </motion.div>

      {/* ── METRIC CONSTELLATION STRIP ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{ display: "flex", gap: "0.75rem", overflowX: "auto", paddingBottom: 4 }}
      >
        {statsRow.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.04, duration: 0.35 }}
          >
            <MetricCard3D label={s.label} value={s.value} color={s.color} />
          </motion.div>
        ))}
      </motion.div>

      {/* ── COMPANY OVERVIEW ── */}
      {data.description && <CompanyOverviewCard data={data} />}

      {/* ── KEY METRICS FLIP CARDS ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
          <div style={{ width: 3, height: 18, background: GOLD, borderRadius: 2 }} />
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: T1, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Key Metrics
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <HelpCircle size={11} style={{ color: TEAL }} />
            <span style={{ fontSize: "0.625rem", color: T3 }}>click any card to understand what it means</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.05, duration: 0.3 }}
            >
              <FlipCard
                label={m.label}
                value={m.value}
                info={METRIC_INFO[m.label]}
                badge={getBadge(m.label, m.value)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   CINEMATIC CHART TAB
───────────────────────────────────────────────────────────────── */
const CinemaTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.12 }}
      style={{
        background: "rgba(16,18,24,0.95)",
        backdropFilter: "blur(12px)",
        border: `1px solid ${GOLD}55`,
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: `0 0 24px ${GOLD}20, 0 8px 32px rgba(0,0,0,0.5)`,
      }}
    >
      <div className="cinema-label" style={{ marginBottom: 5 }}>{label}</div>
      <div className="cinema-number" style={{ fontSize: "1.0625rem", fontWeight: 700, color: GOLD }}>
        {formatPrice(payload[0]?.value)}
      </div>
    </motion.div>
  );
};

const VolTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const v = payload[0]?.value;
  return (
    <div style={{
      background: "rgba(16,18,24,0.92)", backdropFilter: "blur(10px)",
      border: `1px solid ${TEAL}55`, borderRadius: 8, padding: "8px 12px",
    }}>
      <div className="cinema-label" style={{ marginBottom: 3 }}>{label}</div>
      <div className="cinema-number" style={{ fontSize: "0.9375rem", fontWeight: 700, color: TEAL }}>
        {v != null ? (v / 1e6).toFixed(2) + "M" : "—"}
      </div>
    </div>
  );
};

function ChartTab({ data }) {
  const [tf, setTf] = useState("1y");
  const chartData = getChartData(data, tf);
  const hasData   = chartData.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Timeframe Pills */}
      <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
        {TIMEFRAMES.map((t) => (
          <button
            key={t.key}
            onClick={() => setTf(t.key)}
            className="cinema-tab-btn"
            style={{
              background: tf === t.key ? GOLD : "rgba(17,19,24,0.8)",
              color:      tf === t.key ? BG    : T3,
              borderColor: tf === t.key ? GOLD  : BORD,
              boxShadow:  tf === t.key ? `0 0 12px ${GOLD}50` : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Chart */}
      <div style={{
        background: "rgba(10,10,15,0.97)",
        border: `1px solid ${BORD}`,
        borderRadius: 16,
        padding: "1.5rem",
        position: "relative", overflow: "hidden",
      }}>
        {/* SVG glow filter */}
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {hasData ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={tf}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ResponsiveContainer width="100%" height={380}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cineGold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={GOLD} stopOpacity={0.25} />
                      <stop offset="60%"  stopColor={GOLD} stopOpacity={0.06} />
                      <stop offset="100%" stopColor={GOLD} stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 6" stroke="rgba(255,255,255,0.03)" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: T3, fontSize: 10, fontFamily: "monospace" }}
                    interval="preserveStartEnd" tickCount={7}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: T3, fontSize: 10, fontFamily: "monospace" }}
                    tickFormatter={(v) => `$${v.toFixed(0)}`}
                    width={58} axisLine={false} tickLine={false}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip content={<CinemaTooltip />} cursor={{ stroke: `${GOLD}50`, strokeWidth: 1, strokeDasharray: "4 4" }} />
                  <Area
                    type="monotone" dataKey="price"
                    stroke={GOLD} strokeWidth={2}
                    fill="url(#cineGold)"
                    dot={false}
                    activeDot={{ r: 5, fill: GOLD, stroke: BG, strokeWidth: 2, filter: "url(#goldGlow)" }}
                    style={{ filter: "url(#goldGlow)" }}
                    isAnimationActive={true}
                    animationDuration={800}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div style={{ height: 380, display: "flex", alignItems: "center", justifyContent: "center", color: T3 }}>
            No chart data for this timeframe
          </div>
        )}
      </div>

      {/* Volume */}
      {hasData && chartData.some((d) => d.volume) && (
        <div style={{
          background: "rgba(10,10,15,0.97)",
          border: `1px solid ${BORD}`, borderRadius: 14, padding: "1rem 1.5rem",
        }}>
          <div className="cinema-label" style={{ marginBottom: 10, color: TEAL }}>VOLUME</div>
          <ResponsiveContainer width="100%" height={72}>
            <BarChart data={chartData} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
              <XAxis dataKey="label" hide />
              <YAxis hide />
              <Tooltip content={<VolTooltip />} />
              <Bar dataKey="volume" fill={TEAL} opacity={0.55} radius={[2, 2, 0, 0]} isAnimationActive />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   3D BAR SHAPE FOR FINANCIALS
───────────────────────────────────────────────────────────────── */
function Bar3D(props) {
  const { x, y, width, height, fill } = props;
  if (!height || height <= 0 || isNaN(y)) return null;
  const d = Math.min(width * 0.3, 10);
  // Lighten/darken for faces
  const lighter = fill + "cc";
  const darker  = fill + "77";
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} rx={2} />
      <path d={`M${x},${y} L${x+d},${y-d} L${x+width+d},${y-d} L${x+width},${y} Z`} fill={lighter} />
      <path d={`M${x+width},${y} L${x+width+d},${y-d} L${x+width+d},${y+height-d} L${x+width},${y+height} Z`} fill={darker} />
    </g>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FINANCIALS TAB
───────────────────────────────────────────────────────────────── */
function FinancialsTab({ data }) {
  const [view, setView] = useState("annual");
  const chartData = view === "annual"
    ? (data.revenue_annual || data.revenueAnnual || [])
    : (data.revenue_quarterly || data.revenueQuarterly || []);

  const quoteType = data.quote_type || "EQUITY";
  const isFund = quoteType === "MUTUALFUND";
  const isETF  = quoteType === "ETF";
  const noFinancials = isFund || isETF;

  const fmtMoney = (v) => {
    if (v == null) return "—";
    const n = Number(v);
    if (Math.abs(n) >= 1e12) return `$${(n/1e12).toFixed(2)}T`;
    if (Math.abs(n) >= 1e9)  return `$${(n/1e9).toFixed(2)}B`;
    if (Math.abs(n) >= 1e6)  return `$${(n/1e6).toFixed(2)}M`;
    return `$${n.toFixed(0)}`;
  };

  if (noFinancials) {
    const fundStats = [
      { label: isFund ? "NAV" : "Price",  value: data.nav != null ? `$${Number(data.nav).toFixed(2)}` : formatPrice(data.current_price) },
      { label: "Expense Ratio", value: data.expense_ratio != null ? `${(data.expense_ratio * 100).toFixed(2)}%` : "—" },
      { label: "YTD Return",    value: data.ytd_return    != null ? `${(data.ytd_return * 100).toFixed(2)}%` : "—" },
      { label: "Dividend Yield", value: data.dividend_yield != null ? `${fmt(data.dividend_yield, 2)}%` : "—" },
      { label: "52W High", value: formatPrice(data.fifty_two_week_high) },
      { label: "52W Low",  value: formatPrice(data.fifty_two_week_low)  },
      { label: "Beta",     value: data.beta != null ? fmt(data.beta, 2) : "—" },
      { label: "Avg Volume", value: data.avg_volume != null ? (data.avg_volume / 1e6).toFixed(2) + "M" : "—" },
    ];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div style={{
          background: `${GOLD}08`, border: `1px solid ${GOLD}30`, borderRadius: 14, padding: "1.25rem",
        }}>
          <div className="cinema-label" style={{ marginBottom: 8, color: GOLD }}>
            {isFund ? "MUTUAL FUND" : "ETF"} — Income statements not applicable
          </div>
          <div style={{ fontSize: "0.8125rem", color: T2, lineHeight: 1.65 }}>
            {isFund ? "Mutual funds" : "ETFs"} do not report corporate revenue or earnings.
            {data.fund_family && ` Fund family: ${data.fund_family}.`}
            {data.fund_category && ` Category: ${data.fund_category}.`}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
          {fundStats.map((s) => (
            <FlipCard key={s.label} label={s.label} value={s.value} info={METRIC_INFO[s.label]} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Toggle */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {["annual", "quarterly"].map((v) => (
          <button key={v} onClick={() => setView(v)} className="cinema-tab-btn" style={{
            textTransform: "capitalize",
            background: view === v ? TEAL : "rgba(17,19,24,0.8)",
            color:      view === v ? BG    : T3,
            borderColor: view === v ? TEAL  : BORD,
            boxShadow: view === v ? `0 0 12px ${TEAL}50` : "none",
          }}>{v}</button>
        ))}
      </div>

      {/* Chart */}
      <div style={{
        background: "rgba(10,10,15,0.97)",
        border: `1px solid ${BORD}`, borderRadius: 16, padding: "1.5rem",
      }}>
        <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1rem" }}>
          {[{ c: TEAL, l: "Revenue" }, { c: GOLD, l: "Net Income" }].map(({ c, l }) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: c }} />
              <span style={{ fontSize: "0.75rem", color: T2 }}>{l}</span>
            </div>
          ))}
        </div>
        {chartData.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} barCategoryGap="28%">
                  <CartesianGrid strokeDasharray="2 6" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="displayDate" tick={{ fill: T3, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: T3, fontSize: 10 }} tickFormatter={fmtMoney} width={66} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: ELEV, border: `1px solid ${BORD}`, borderRadius: 8, color: T1, fontSize: "0.75rem" }}
                    formatter={(v, n) => [fmtMoney(v), n === "revenue" ? "Revenue" : "Net Income"]}
                    cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  />
                  <Bar dataKey="revenue"  shape={<Bar3D fill={TEAL} />} isAnimationActive animationDuration={700} />
                  <Bar dataKey="earnings" shape={<Bar3D fill={GOLD} />} isAnimationActive animationDuration={700} animationBegin={150} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div style={{ height: 280, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: T3 }}>
            <div>No financial statement data available</div>
            <div style={{ fontSize: "0.75rem" }}>This may be a bond ETF, index, or non-reporting security</div>
          </div>
        )}
      </div>

      {/* EPS Line */}
      {chartData.length > 0 && chartData.some(d => d.eps != null) && (
        <div style={{ background: "rgba(10,10,15,0.97)", border: `1px solid ${BORD}`, borderRadius: 14, padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: "0.875rem" }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: GOLD }} />
            <span style={{ fontSize: "0.75rem", color: T2 }}>Earnings Per Share (EPS)</span>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 6" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="displayDate" tick={{ fill: T3, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T3, fontSize: 10 }} tickFormatter={(v) => `$${v.toFixed(2)}`} width={52} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: ELEV, border: `1px solid ${BORD}`, borderRadius: 8, color: T1, fontSize: "0.75rem" }} formatter={(v) => [`$${Number(v).toFixed(2)}`, "EPS"]} />
              <Line type="monotone" dataKey="eps" stroke={GOLD} strokeWidth={2}
                dot={{ fill: GOLD, r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: GOLD }}
                isAnimationActive animationDuration={700}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Data Table */}
      {chartData.length > 0 && (
        <div style={{ background: "rgba(10,10,15,0.97)", border: `1px solid ${BORD}`, borderRadius: 14, overflowX: "auto" }}>
          <table className="t-table">
            <thead>
              <tr>
                {["Period","Revenue","Net Income","Net Margin","EPS"].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {[...chartData].reverse().map((row, i) => {
                const margin = (row.revenue && row.earnings != null)
                  ? ((row.earnings / row.revenue) * 100).toFixed(1) : null;
                return (
                  <tr key={i}>
                    <td className="t-mono" style={{ color: T2 }}>{row.displayDate || row.date || "—"}</td>
                    <td className="t-mono">{fmtMoney(row.revenue)}</td>
                    <td className="t-mono" style={{ color: (row.earnings ?? 0) >= 0 ? GREEN : RED }}>{fmtMoney(row.earnings)}</td>
                    <td className="t-mono" style={{ color: margin && Number(margin) >= 0 ? GREEN : RED }}>{margin != null ? `${margin}%` : "—"}</td>
                    <td className="t-mono">{row.eps != null ? `$${Number(row.eps).toFixed(2)}` : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ANALYSIS TAB
───────────────────────────────────────────────────────────────── */
function AnalysisTab({ data }) {
  const price    = data.current_price ?? data.price ?? 0;
  const target   = data.one_year_target ?? data.analyst_target;
  const low52    = data.fifty_two_week_low  ?? data.week_52_low  ?? 0;
  const high52   = data.fifty_two_week_high ?? data.week_52_high ?? price * 1.2;
  const targetP  = target ?? high52;
  const upside   = target && price ? (((target - price) / price) * 100).toFixed(1) : null;

  const rangeMin = Math.min(low52, price * 0.9);
  const rangeMax = Math.max(targetP, price * 1.1);
  const range    = rangeMax - rangeMin || 1;
  const pctPos   = ((price - rangeMin) / range) * 100;
  const pctTgt   = ((targetP - rangeMin) / range) * 100;

  const ratios = [
    { label: "P/E Ratio",     value: data.pe_ratio        != null ? fmt(data.pe_ratio, 1)       : "—", info: METRIC_INFO["P/E Ratio"]     },
    { label: "Forward P/E",   value: data.forward_pe      != null ? fmt(data.forward_pe, 1)     : "—", info: METRIC_INFO["Forward P/E"]   },
    { label: "PEG Ratio",     value: data.peg_ratio       != null ? fmt(data.peg_ratio, 2)      : "—", info: METRIC_INFO["PEG Ratio"]     },
    { label: "P/S Ratio",     value: data.price_to_sales  != null ? fmt(data.price_to_sales, 2) : "—", info: METRIC_INFO["P/S Ratio"]     },
    { label: "P/B Ratio",     value: data.price_to_book   != null ? fmt(data.price_to_book, 2)  : "—", info: METRIC_INFO["P/B Ratio"]     },
    { label: "EV/EBITDA",     value: data.ev_to_ebitda    != null ? fmt(data.ev_to_ebitda, 1)   : "—", info: METRIC_INFO["EV/EBITDA"]     },
    { label: "ROE",           value: data.return_on_equity != null ? `${fmt(data.return_on_equity,1)}%` : "—", info: METRIC_INFO["ROE"] },
    { label: "Profit Margin", value: data.profit_margin   != null ? `${fmt(data.profit_margin,1)}%`     : "—", info: METRIC_INFO["Profit Margin"] },
  ];

  const sc = SECTOR_COLORS[data.sector] || { text: T2, bg: `${T2}15`, border: `${T2}30` };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Analyst Price Target */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        style={{
          background: "rgba(17,19,24,0.9)", backdropFilter: "blur(12px)",
          border: `1px solid ${BORD}`, borderLeft: `3px solid ${GOLD}`,
          borderRadius: 14, padding: "1.5rem",
          position: "relative", overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -40, left: -20, width: 180, height: 180, background: `radial-gradient(circle, ${GOLD}08 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div className="cinema-label" style={{ marginBottom: 10, color: GOLD }}>ANALYST CONSENSUS PRICE TARGET</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <span className="cinema-number" style={{ fontSize: "2.25rem", fontWeight: 800, color: GOLD, letterSpacing: "-0.03em", textShadow: `0 0 30px ${GOLD}40` }}>
            {targetP ? formatPrice(targetP) : "N/A"}
          </span>
          {upside && (
            <GlassPill color={Number(upside) >= 0 ? GREEN : RED} glow size="lg">
              {Number(upside) >= 0 ? "+" : ""}{upside}% UPSIDE
            </GlassPill>
          )}
        </div>
        <CinemaRangeBar
          low={low52} high={high52 > targetP ? high52 : targetP}
          current={price}
          targetPct={Math.max(0, Math.min(100, pctTgt))}
          targetColor={GREEN}
        />
      </motion.div>

      {/* Key Ratios Flip Cards */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
          <div style={{ width: 3, height: 18, background: GOLD, borderRadius: 2 }} />
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: T1, letterSpacing: "0.06em", textTransform: "uppercase" }}>Key Ratios</span>
          <span style={{ fontSize: "0.625rem", color: T3 }}>click any card to understand what it means</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
          {ratios.map((r, i) => (
            <motion.div key={r.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <FlipCard label={r.label} value={r.value} info={r.info} accentColor={GOLD} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sector & Classification */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.4 }}
        style={{
          background: "rgba(17,19,24,0.88)", backdropFilter: "blur(12px)",
          border: `1px solid ${BORD}`, borderRadius: 14, padding: "1.5rem",
        }}
      >
        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: T1, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
          Sector & Classification
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {data.sector && (
            <div>
              <div className="cinema-label" style={{ marginBottom: 8 }}>SECTOR</div>
              <span style={{
                fontSize: "0.875rem", fontWeight: 700, padding: "6px 16px", borderRadius: 99,
                background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text,
                boxShadow: `0 0 14px ${sc.text}30`, display: "inline-block",
              }}>{data.sector}</span>
            </div>
          )}
          {data.industry && (
            <div>
              <div className="cinema-label" style={{ marginBottom: 8 }}>INDUSTRY</div>
              <span style={{
                fontSize: "0.875rem", fontWeight: 600, padding: "6px 16px", borderRadius: 99,
                background: `${T2}12`, border: `1px solid ${BORD}`, color: T2,
                display: "inline-block",
              }}>{data.industry}</span>
            </div>
          )}
          {data.country && (
            <div>
              <div className="cinema-label" style={{ marginBottom: 6 }}>COUNTRY</div>
              <span className="cinema-number" style={{ fontSize: "0.9375rem", color: T1 }}>{data.country}</span>
            </div>
          )}
          {data.employees && (
            <div>
              <div className="cinema-label" style={{ marginBottom: 6 }}>EMPLOYEES</div>
              <span className="cinema-number" style={{ fontSize: "0.9375rem", color: T1 }}>{Number(data.employees).toLocaleString()}</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN TERMINAL COMPONENT
───────────────────────────────────────────────────────────────── */
export default function Terminal() {
  const [inputValue, setInputValue] = useState("");
  const [ticker,     setTicker]     = useState("");
  const [activeTab,  setActiveTab]  = useState("OVERVIEW");
  const inputRef    = useRef(null);
  const containerRef = useRef(null);

  const { data, isLoading, isError } = useQuery({
    queryKey:  ["stock", ticker],
    queryFn:   () => fetchStock(ticker),
    enabled:   !!ticker,
    staleTime: 60_000,
    retry: 1,
  });

  const stockData = data?.data ?? data;

  const handleSubmit = (e) => {
    e?.preventDefault();
    const t = inputValue.trim().toUpperCase();
    if (!t) return;
    setTicker(t);
    setActiveTab("OVERVIEW");
  };

  const handleTickerClick = (t) => {
    setInputValue(t);
    setTicker(t);
    setActiveTab("OVERVIEW");
  };

  return (
    <>
      <InjectStyles />
      <div
        ref={containerRef}
        style={{
          minHeight: "100vh",
          background: BG,
          padding: "1.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Particle field */}
        <ParticleCanvas />

        {/* All content above particles */}
        <div style={{ position: "relative", zIndex: 1 }}>

          {/* ── HERO BANNER ── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: "rgba(17,19,24,0.88)",
              backdropFilter: "blur(20px)",
              border: `1px solid ${BORD}`,
              borderRadius: 18,
              padding: "1.75rem 2rem",
              marginBottom: "1.25rem",
              position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: -80, right: -60, width: 360, height: 360, background: `radial-gradient(circle, ${GOLD}07 0%, transparent 70%)`, pointerEvents: "none" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", position: "relative" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: `${GOLD}20`, border: `1px solid ${GOLD}45`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <MonitorDot size={14} style={{ color: GOLD }} />
                  </div>
                  <h1 style={{ margin: 0, fontSize: "1.0625rem", fontWeight: 800, color: T1, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    Equity Research Terminal
                  </h1>
                </div>
                <p style={{ fontSize: "0.875rem", color: T2, lineHeight: 1.65, maxWidth: 520, margin: "0 0 1rem" }}>
                  Institutional-grade stock research. Live data, cinematic visualizations, and plain-English explanations built for wealth managers and their clients.
                </p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {["Live Quotes", "Interactive Charts", "3D Metrics", "Earnings Data"].map((l) => (
                    <GlassPill key={l} color={GOLD}>{l}</GlassPill>
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem", flexShrink: 0 }}>
                {[
                  { icon: Search,   label: "Stock Lookup",      sub: "Any ticker, instant data",        color: "#3b82f6" },
                  { icon: TrendingUp, label: "Live Charts",      sub: "Cinematic price history",        color: GOLD     },
                  { icon: Layers,   label: "Options Flow",       sub: "Calls, puts & open interest",    color: TEAL     },
                  { icon: BarChart2, label: "Technical Analysis", sub: "RSI, MACD, Bollinger & more",  color: "#f59e0b" },
                ].map(({ icon: Icon, label, sub, color }) => (
                  <div key={label} style={{
                    display: "flex", alignItems: "center", gap: "0.625rem",
                    padding: "0.625rem 0.875rem",
                    background: `${color}08`, border: `1px solid ${color}22`,
                    borderRadius: 10, minWidth: 170,
                  }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                      background: `${color}18`, border: `1px solid ${color}30`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon size={14} style={{ color }} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: T1, lineHeight: 1 }}>{label}</div>
                      <div style={{ fontSize: "0.625rem", color: T3, marginTop: 2, lineHeight: 1.3 }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── SEARCH ── */}
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            onSubmit={handleSubmit}
            style={{ display: "flex", gap: "0.625rem", maxWidth: 660, margin: "0 auto 1.5rem" }}
          >
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={15} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: T3, pointerEvents: "none" }} />
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                placeholder="Enter ticker symbol — e.g. AAPL, TSLA, NVDA, JPM"
                style={{
                  width: "100%", height: 46,
                  paddingLeft: "2.5rem", paddingRight: "1rem",
                  background: "rgba(17,19,24,0.9)", backdropFilter: "blur(12px)",
                  border: `1px solid ${BORD}`, borderRadius: 10,
                  color: T1, fontSize: "0.9375rem",
                  outline: "none", fontFamily: "inherit",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = `${GOLD}66`)}
                onBlur={(e)  => (e.target.style.borderColor = BORD)}
              />
            </div>
            <button
              type="submit"
              style={{
                height: 46, padding: "0 1.5rem",
                background: GOLD, color: BG,
                fontWeight: 800, fontSize: "0.8125rem",
                letterSpacing: "0.07em", textTransform: "uppercase",
                border: "none", borderRadius: 10, cursor: "pointer",
                boxShadow: `0 0 20px ${GOLD}40`,
                transition: "box-shadow 0.2s, transform 0.15s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 32px ${GOLD}70`; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 0 20px ${GOLD}40`; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              SEARCH
            </button>
          </motion.form>

          {/* ── EMPTY STATE ── */}
          {!ticker && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
              style={{ textAlign: "center", paddingTop: "2rem" }}
            >
              <p style={{ color: T3, fontSize: "0.875rem", marginBottom: "1.25rem" }}>
                Select a ticker to begin institutional-grade equity research
              </p>
              <div style={{ display: "flex", gap: "0.625rem", justifyContent: "center", flexWrap: "wrap" }}>
                {RECENT.map((t, i) => (
                  <motion.button
                    key={t}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.04 }}
                    onClick={() => handleTickerClick(t)}
                    style={{
                      background: "rgba(17,19,24,0.85)", backdropFilter: "blur(8px)",
                      border: `1px solid ${BORD}`, borderRadius: 8,
                      color: T1, padding: "8px 18px",
                      fontFamily: "monospace", fontWeight: 700, fontSize: "0.875rem",
                      letterSpacing: "0.04em", cursor: "pointer",
                      transition: "border-color 0.18s, box-shadow 0.18s, transform 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${GOLD}55`;
                      e.currentTarget.style.boxShadow  = `0 0 16px ${GOLD}25`;
                      e.currentTarget.style.transform  = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = BORD;
                      e.currentTarget.style.boxShadow  = "none";
                      e.currentTarget.style.transform  = "translateY(0)";
                    }}
                  >
                    {t}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── LOADING ── */}
          {ticker && isLoading && <CinemaSkeleton />}

          {/* ── ERROR ── */}
          {ticker && isError && (
            <div style={{
              background: `${RED}08`, border: `1px solid ${RED}30`,
              borderRadius: 14, padding: "3rem", textAlign: "center",
            }}>
              <div style={{ color: RED, fontSize: "0.9375rem", marginBottom: 8, fontWeight: 600 }}>
                Failed to load data for {ticker}
              </div>
              <div style={{ color: T3, fontSize: "0.8125rem" }}>
                Please verify the ticker symbol and try again.
              </div>
            </div>
          )}

          {/* ── DATA LOADED ── */}
          {ticker && !isLoading && stockData && !isError && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>

              {/* Company Identity Header */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                style={{
                  background: "rgba(17,19,24,0.9)", backdropFilter: "blur(16px)",
                  border: `1px solid ${BORD}`, borderRadius: 14,
                  padding: "1.125rem 1.5rem", marginBottom: "1rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.875rem", marginBottom: 6 }}>
                      <span className="cinema-number" style={{ fontSize: "1.5rem", fontWeight: 900, color: GOLD, letterSpacing: "-0.02em", textShadow: `0 0 20px ${GOLD}40` }}>
                        {stockData.ticker ?? ticker}
                      </span>
                      <span style={{ fontSize: "1.0625rem", fontWeight: 600, color: T1 }}>
                        {stockData.company_name ?? stockData.name ?? ""}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {stockData.exchange && <GlassPill color={T2}>{stockData.exchange}</GlassPill>}
                      {stockData.sector   && (
                        <GlassPill color={(SECTOR_COLORS[stockData.sector] || {}).text || TEAL} glow>
                          {stockData.sector}
                        </GlassPill>
                      )}
                      {stockData.industry && <span style={{ fontSize: "0.75rem", color: T3, alignSelf: "center" }}>{stockData.industry}</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="cinema-label" style={{ marginBottom: 4 }}>LAST PRICE</div>
                    <div className="cinema-number" style={{ fontSize: "1.5rem", fontWeight: 800, color: GOLD, textShadow: `0 0 20px ${GOLD}40` }}>
                      {formatPrice(stockData.current_price ?? stockData.price)}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Tabs */}
              <div style={{ display: "flex", gap: "0.375rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="cinema-tab-btn"
                    style={{
                      background:  activeTab === tab ? GOLD : "rgba(17,19,24,0.85)",
                      color:       activeTab === tab ? BG    : T3,
                      borderColor: activeTab === tab ? GOLD  : BORD,
                      boxShadow:   activeTab === tab ? `0 0 16px ${GOLD}50` : "none",
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  {activeTab === "OVERVIEW"   && <OverviewTab   data={stockData} />}
                  {activeTab === "CHART"      && <ChartTab      data={stockData} />}
                  {activeTab === "FINANCIALS" && <FinancialsTab data={stockData} />}
                  {activeTab === "ANALYSIS"   && <AnalysisTab   data={stockData} />}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
