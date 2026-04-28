import React, { useState, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart, Line, PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer
} from "recharts";
import { Star, X, Plus, TrendingUp, TrendingDown, DollarSign, BarChart2, Bell, List } from "lucide-react";

const SERVER = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/* ─── Constants ─────────────────────────────────────────────────── */
const DEFAULT_WATCHLIST = ["AAPL", "MSFT", "GOOGL", "TSLA", "NVDA", "JPM", "AMZN", "META", "BRK-B", "V"];
const POPULAR = ["SPY", "QQQ", "GLD", "SLV", "TLT", "BND", "VNQ", "ARKK"];

const SECTOR_MAP = {
  // Technology
  AAPL: "Technology", MSFT: "Technology", GOOGL: "Technology", GOOG: "Technology",
  META: "Technology", NVDA: "Technology", AMD: "Technology", INTC: "Technology",
  AVGO: "Technology", ORCL: "Technology", CRM: "Technology", ADBE: "Technology",
  QCOM: "Technology", TXN: "Technology", MU: "Technology", AMAT: "Technology",
  NOW: "Technology", SNOW: "Technology", PLTR: "Technology", UBER: "Technology",
  // Consumer Discretionary
  TSLA: "Consumer Disc.", AMZN: "Consumer Disc.", HD: "Consumer Disc.",
  MCD: "Consumer Disc.", NKE: "Consumer Disc.", SBUX: "Consumer Disc.",
  TGT: "Consumer Disc.", LOW: "Consumer Disc.", BKNG: "Consumer Disc.",
  // Consumer Staples
  WMT: "Consumer Staples", PG: "Consumer Staples", KO: "Consumer Staples",
  PEP: "Consumer Staples", COST: "Consumer Staples", PM: "Consumer Staples",
  MO: "Consumer Staples", CL: "Consumer Staples",
  // Financials
  JPM: "Financials", "BRK-B": "Financials", V: "Financials", MA: "Financials",
  GS: "Financials", BAC: "Financials", WFC: "Financials", MS: "Financials",
  AXP: "Financials", BLK: "Financials", C: "Financials", USB: "Financials",
  // Healthcare
  JNJ: "Healthcare", UNH: "Healthcare", LLY: "Healthcare", PFE: "Healthcare",
  ABT: "Healthcare", TMO: "Healthcare", MRK: "Healthcare", DHR: "Healthcare",
  ABBV: "Healthcare", BMY: "Healthcare", AMGN: "Healthcare", GILD: "Healthcare",
  // Energy
  XOM: "Energy", CVX: "Energy", COP: "Energy", EOG: "Energy",
  SLB: "Energy", MPC: "Energy", PSX: "Energy", VLO: "Energy",
  // Industrials
  BA: "Industrials", CAT: "Industrials", GE: "Industrials", HON: "Industrials",
  RTX: "Industrials", UPS: "Industrials", LMT: "Industrials", DE: "Industrials",
  // Utilities
  NEE: "Utilities", DUK: "Utilities", SO: "Utilities", D: "Utilities",
  AEP: "Utilities", EXC: "Utilities", SRE: "Utilities",
  // Real Estate
  VNQ: "Real Estate", AMT: "Real Estate", PLD: "Real Estate", CCI: "Real Estate",
  EQIX: "Real Estate", O: "Real Estate", SPG: "Real Estate",
  // Materials
  LIN: "Materials", APD: "Materials", FCX: "Materials", NEM: "Materials",
  // Bonds / Fixed Income
  TLT: "Bonds", BND: "Bonds", AGG: "Bonds", SHY: "Bonds",
  HYG: "Bonds", LQD: "Bonds", IEF: "Bonds", TIPS: "Bonds",
  // Commodities
  GLD: "Commodities", SLV: "Commodities", USO: "Commodities", UNG: "Commodities",
  DJP: "Commodities", PDBC: "Commodities",
  // Index ETFs
  SPY: "Index ETF", QQQ: "Index ETF", DIA: "Index ETF", IWM: "Index ETF",
  VOO: "Index ETF", VTI: "Index ETF", IVV: "Index ETF", ARKK: "Index ETF",
  TQQQ: "Index ETF", SQQQ: "Index ETF", SPXL: "Index ETF",
};

// Normalize sector strings coming from the server to our display keys
const SECTOR_NORMALIZE = {
  "technology": "Technology",
  "information technology": "Technology",
  "communication services": "Technology",
  "consumer discretionary": "Consumer Disc.",
  "consumer staples": "Consumer Staples",
  "financials": "Financials",
  "financial services": "Financials",
  "healthcare": "Healthcare",
  "health care": "Healthcare",
  "energy": "Energy",
  "industrials": "Industrials",
  "utilities": "Utilities",
  "real estate": "Real Estate",
  "materials": "Materials",
  "basic materials": "Materials",
  "etf": "Index ETF",
  "mutual fund": "Index ETF",
};

const SECTOR_DEFAULT = "Other";

const SECTOR_COLORS = {
  Technology:         "#1a9fd8",
  Financials:         "#c9a84c",
  "Consumer Disc.":   "#00b899",
  "Consumer Staples": "#4caf7d",
  Healthcare:         "#7c5cbf",
  Energy:             "#ff6b35",
  Industrials:        "#5b8dd9",
  Utilities:          "#26c6da",
  "Real Estate":      "#ef5350",
  Materials:          "#8d6e63",
  Bonds:              "#78909c",
  Commodities:        "#ffca28",
  "Index ETF":        "#ab47bc",
  Other:              "#4a5568",
};

const COMPANY_NAMES = {
  AAPL: "Apple Inc.", MSFT: "Microsoft Corp.", GOOGL: "Alphabet Inc.", TSLA: "Tesla Inc.",
  NVDA: "NVIDIA Corp.", JPM: "JPMorgan Chase", AMZN: "Amazon.com Inc.", META: "Meta Platforms",
  "BRK-B": "Berkshire Hathaway", V: "Visa Inc.", SPY: "SPDR S&P 500 ETF", QQQ: "Invesco QQQ",
  GLD: "SPDR Gold Shares", SLV: "iShares Silver", TLT: "iShares 20Y+ Treas.",
  BND: "Vanguard Bond ETF", VNQ: "Vanguard Real Estate", ARKK: "ARK Innovation ETF",
};

/* ─── Helpers ───────────────────────────────────────────────────── */
function fmt(n, dec = 2) {
  if (n == null || isNaN(n)) return "—";
  return Number(n).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}
function fmtLarge(n) {
  if (n == null || isNaN(n)) return "—";
  const v = Number(n);
  if (v >= 1e12) return "$" + (v / 1e12).toFixed(2) + "T";
  if (v >= 1e9) return "$" + (v / 1e9).toFixed(2) + "B";
  if (v >= 1e6) return "$" + (v / 1e6).toFixed(2) + "M";
  return "$" + v.toLocaleString();
}
function fmtVol(n) {
  if (n == null || isNaN(n)) return "—";
  const v = Number(n);
  if (v >= 1e9) return (v / 1e9).toFixed(1) + "B";
  if (v >= 1e6) return (v / 1e6).toFixed(1) + "M";
  if (v >= 1e3) return (v / 1e3).toFixed(0) + "K";
  return String(v);
}
function fmtPct(n) {
  if (n == null || isNaN(n)) return "—";
  const v = Number(n);
  return (v >= 0 ? "+" : "") + v.toFixed(2) + "%";
}
function getWatchlist() {
  try {
    return JSON.parse(localStorage.getItem("planora-watchlist") || JSON.stringify(DEFAULT_WATCHLIST));
  } catch {
    return [...DEFAULT_WATCHLIST];
  }
}
function saveWatchlist(arr) {
  localStorage.setItem("planora-watchlist", JSON.stringify(arr));
}
function generateSparkData(basePrice, isUp, points = 20) {
  const data = [];
  let price = basePrice * (isUp ? 0.97 : 1.03);
  for (let i = 0; i < points; i++) {
    const trend = isUp ? 0.001 : -0.001;
    const noise = (Math.random() - 0.48) * 0.005;
    price = price * (1 + trend + noise);
    data.push({ v: price });
  }
  data.push({ v: basePrice });
  return data;
}

/* ─── Sub-components ─────────────────────────────────────────────── */
function Skeleton({ w, h }) {
  return <div className="t-skeleton" style={{ width: w || "100%", height: h || 14, borderRadius: 3 }} />;
}

function Sparkline({ price, isUp }) {
  const data = useMemo(() => generateSparkData(price, isUp), [price, isUp]);
  const color = isUp ? "var(--up)" : "var(--down)";
  return (
    <ResponsiveContainer width={80} height={32}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function RangeBar({ price, low52, high52 }) {
  const pct = Math.min(100, Math.max(0, ((price - low52) / (high52 - low52)) * 100));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 90 }}>
      <div style={{ width: 80, height: 4, background: "var(--elevated)", borderRadius: 2, position: "relative" }}>
        <div style={{ position: "absolute", left: 0, width: `${pct}%`, height: "100%", background: "var(--gold)", borderRadius: 2 }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", width: 80 }}>
        <span style={{ fontSize: "0.5625rem", color: "var(--text-3)" }}>{fmt(low52)}</span>
        <span style={{ fontSize: "0.5625rem", color: "var(--text-3)" }}>{fmt(high52)}</span>
      </div>
    </div>
  );
}

function resolveSector(symbol, liveSector) {
  // Try live sector from server first
  if (liveSector) {
    const norm = SECTOR_NORMALIZE[liveSector.toLowerCase()];
    if (norm) return norm;
    // If server returned something we don't have a normalization for, use it as-is if it's a known color key
    if (SECTOR_COLORS[liveSector]) return liveSector;
  }
  // Fall back to static map
  return SECTOR_MAP[symbol] || SECTOR_DEFAULT;
}

function SectorBreakdown({ symbols, quotes }) {
  const counts = {};
  symbols.forEach(s => {
    const liveQ = quotes?.find(q => q.symbol === s);
    const sec = resolveSector(s, liveQ?.sector);
    counts[sec] = (counts[sec] || 0) + 1;
  });
  const data = Object.entries(counts).map(([name, value]) => ({ name, value }));
  return (
    <div className="t-card t-card-p" style={{ minWidth: 220 }}>
      <div className="t-section-title" style={{ marginBottom: "1rem" }}>Sector Allocation</div>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius={42} outerRadius={70}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={SECTOR_COLORS[entry.name] || SECTOR_COLORS.Other} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "var(--surface)",
              border: "1px solid var(--border-c)",
              borderRadius: 4,
              fontSize: 11,
              color: "var(--text-1)",
            }}
            labelStyle={{ color: "var(--text-1)" }}
            itemStyle={{ color: "var(--text-2)" }}
            formatter={(v, n) => [v + " stocks", n]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem 0.75rem", marginTop: "0.5rem" }}>
        {data.map(d => (
          <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: SECTOR_COLORS[d.name] || SECTOR_COLORS.Other, flexShrink: 0 }} />
            <span style={{ fontSize: "0.6875rem", color: "var(--text-2)" }}>{d.name}</span>
            <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>({d.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function Watchlist() {
  const [symbols, setSymbols] = useState(getWatchlist);
  const [inputVal, setInputVal] = useState("");
  const [pinnedSet, setPinnedSet] = useState(new Set());
  const inputRef = useRef(null);

  const { data: quotes, isLoading, refetch } = useQuery({
    queryKey: ["watchlist-quotes", symbols.join(",")],
    queryFn: () =>
      fetch(`${SERVER}/api/watchlist/quote?symbols=${symbols.join(",")}`)
        .then(r => { if (!r.ok) throw new Error("quote fetch failed"); return r.json(); }),
    refetchInterval: 30000,
    enabled: symbols.length > 0,
  });

  function addTicker(raw) {
    const sym = raw.trim().toUpperCase();
    if (!sym || symbols.includes(sym)) return;
    const next = [...symbols, sym];
    setSymbols(next);
    saveWatchlist(next);
    setInputVal("");
    setTimeout(() => refetch(), 200);
  }

  function removeTicker(sym) {
    const next = symbols.filter(s => s !== sym);
    setSymbols(next);
    saveWatchlist(next);
  }

  function togglePin(sym) {
    setPinnedSet(prev => {
      const s = new Set(prev);
      if (s.has(sym)) s.delete(sym); else s.add(sym);
      return s;
    });
  }

  const quoteMap = useMemo(() => {
    if (!quotes) return {};
    return Object.fromEntries(quotes.map(q => [q.symbol, q]));
  }, [quotes]);

  const sortedSymbols = useMemo(() => {
    const pinned = symbols.filter(s => pinnedSet.has(s));
    const rest = symbols.filter(s => !pinnedSet.has(s));
    return [...pinned, ...rest];
  }, [symbols, pinnedSet]);

  // Summary bar calculations
  const summary = useMemo(() => {
    if (!quotes || quotes.length === 0) return null;
    let totalValue = 0, totalChange = 0, peSum = 0, peCount = 0;
    quotes.forEach(q => {
      const price = Number(q.price) || 0;
      const change = Number(q.change) || 0;
      totalValue += price;
      totalChange += change;
      const pe = Number(q.pe);
      if (!isNaN(pe) && pe > 0) { peSum += pe; peCount++; }
    });
    return {
      totalValue,
      totalChange,
      avgPE: peCount > 0 ? peSum / peCount : null,
      positions: quotes.length,
    };
  }, [quotes]);

  return (
    <div className="t-bg" style={{ padding: "1.5rem", minHeight: "100vh" }}>
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
                <Star size={14} style={{ color: "var(--gold)" }} />
              </div>
              <h1 className="t-page-title" style={{ margin: 0 }}>WATCHLIST</h1>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.65, maxWidth: 560, margin: "0 0 1rem" }}>
              Build and monitor your personalized stock watchlist. Track live prices, daily changes, and key metrics for the tickers that matter most to you.
            </p>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              {["Real-Time Quotes", "Custom Lists", "Price Alerts", "Portfolio Tracking"].map((label) => (
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
              { icon: Bell, label: "Price Alerts", sub: "Custom threshold alerts", color: "#3b82f6" },
              { icon: DollarSign, label: "Live Quotes", sub: "Real-time bid & ask", color: "var(--gold)" },
              { icon: BarChart2, label: "Portfolio Tracker", sub: "P&L & performance", color: "var(--teal)" },
              { icon: List, label: "Custom Lists", sub: "Organize by strategy", color: "#f59e0b" },
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

      {/* Add ticker / controls */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span className="t-badge t-badge-gold" style={{ fontFamily: "var(--font-mono)" }}>{symbols.length} positions</span>
          <span className="t-live">● LIVE</span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <input
            ref={inputRef}
            className="t-input"
            style={{ width: 140 }}
            placeholder="Add ticker…"
            value={inputVal}
            onChange={e => setInputVal(e.target.value.toUpperCase())}
            onKeyDown={e => { if (e.key === "Enter") addTicker(inputVal); }}
          />
          <button className="t-btn t-btn-gold" onClick={() => addTicker(inputVal)}>
            <Plus size={13} />
            ADD
          </button>
        </div>
      </div>

      {/* Summary Bar */}
      {summary && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <div className="t-card t-card-p" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span className="t-label">Portfolio Value (1 share ea.)</span>
            <span className="t-metric-lg t-mono grad-gold">${fmt(summary.totalValue)}</span>
          </div>
          <div className="t-card t-card-p" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span className="t-label">Day P&L</span>
            <span
              className="t-metric-lg t-mono"
              style={{ color: summary.totalChange >= 0 ? "var(--up)" : "var(--down)" }}
            >
              {summary.totalChange >= 0 ? "+" : ""}{fmt(summary.totalChange)}
            </span>
          </div>
          <div className="t-card t-card-p" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span className="t-label">Average P/E Ratio</span>
            <span className="t-metric-lg t-mono" style={{ color: "var(--text-1)" }}>
              {summary.avgPE ? fmt(summary.avgPE, 1) + "x" : "—"}
            </span>
          </div>
          <div className="t-card t-card-p" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span className="t-label">Positions</span>
            <span className="t-metric-lg t-mono" style={{ color: "var(--blue)" }}>{summary.positions}</span>
          </div>
        </div>
      )}

      {/* Main layout */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
        {/* Table */}
        <div className="t-card" style={{ flex: 1, overflow: "auto" }}>
          <table className="t-table" style={{ minWidth: 900 }}>
            <thead>
              <tr>
                <th style={{ width: 32, textAlign: "center" }}>★</th>
                <th>Symbol</th>
                <th>Company</th>
                <th>Price</th>
                <th>Trend</th>
                <th>Day Change</th>
                <th>Day %</th>
                <th>Volume</th>
                <th>Mkt Cap</th>
                <th>P/E</th>
                <th>52W Range</th>
                <th style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {sortedSymbols.map(sym => {
                const q = quoteMap[sym];
                const isPinned = pinnedSet.has(sym);
                const price = q ? Number(q.price) : null;
                const change = q ? Number(q.change) : null;
                const changePct = q ? Number(q.changePercent) : null;
                const isUp = change != null ? change >= 0 : true;

                return (
                  <tr key={sym}>
                    <td style={{ textAlign: "center", padding: "0.5rem" }}>
                      <button
                        className="t-btn t-btn-ghost t-btn-sm"
                        style={{ padding: "2px 4px", color: isPinned ? "var(--gold)" : "var(--text-3)" }}
                        onClick={() => togglePin(sym)}
                        title={isPinned ? "Unpin" : "Pin to top"}
                      >
                        ★
                      </button>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: "var(--gold)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em" }}>
                        {sym}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-2)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {COMPANY_NAMES[sym] || sym}
                    </td>
                    <td>
                      {isLoading ? <Skeleton w={60} /> : (
                        <span className="t-mono" style={{ fontWeight: 700, color: "var(--text-1)" }}>
                          {price != null ? "$" + fmt(price) : "—"}
                        </span>
                      )}
                    </td>
                    <td>
                      {isLoading ? <Skeleton w={80} h={32} /> : (
                        price != null ? <Sparkline price={price} isUp={isUp} /> : <span style={{ color: "var(--text-3)" }}>—</span>
                      )}
                    </td>
                    <td>
                      {isLoading ? <Skeleton w={60} /> : (
                        change != null ? (
                          <span className="t-mono" style={{ color: isUp ? "var(--up)" : "var(--down)", fontWeight: 600 }}>
                            {isUp ? "+" : ""}{fmt(change)}
                          </span>
                        ) : "—"
                      )}
                    </td>
                    <td>
                      {isLoading ? <Skeleton w={55} /> : (
                        changePct != null ? (
                          <span className={`t-badge t-badge-${isUp ? "up" : "down"}`}>
                            {isUp ? "▲" : "▼"} {Math.abs(changePct).toFixed(2)}%
                          </span>
                        ) : "—"
                      )}
                    </td>
                    <td>
                      {isLoading ? <Skeleton w={55} /> : (
                        <span className="t-mono" style={{ color: "var(--text-2)", fontSize: "0.75rem" }}>
                          {q ? fmtVol(q.volume) : "—"}
                        </span>
                      )}
                    </td>
                    <td>
                      {isLoading ? <Skeleton w={65} /> : (
                        <span className="t-mono" style={{ color: "var(--text-2)", fontSize: "0.75rem" }}>
                          {q ? fmtLarge(q.marketCap) : "—"}
                        </span>
                      )}
                    </td>
                    <td>
                      {isLoading ? <Skeleton w={40} /> : (
                        <span className="t-mono" style={{ color: "var(--text-2)" }}>
                          {q && q.pe && !isNaN(q.pe) && Number(q.pe) > 0 ? Number(q.pe).toFixed(1) + "x" : "—"}
                        </span>
                      )}
                    </td>
                    <td>
                      {isLoading ? <Skeleton w={90} h={20} /> : (
                        q && q.low52 && q.high52 && price != null
                          ? <RangeBar price={price} low52={Number(q.low52)} high52={Number(q.high52)} />
                          : <span style={{ color: "var(--text-3)" }}>—</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="t-btn t-btn-ghost t-btn-sm"
                        style={{ color: "var(--text-3)", padding: "2px 6px", fontSize: "0.875rem" }}
                        onClick={() => removeTicker(sym)}
                        title={`Remove ${sym}`}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                );
              })}
              {sortedSymbols.length === 0 && (
                <tr>
                  <td colSpan={12} style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-3)" }}>
                    No tickers in watchlist. Add one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Sidebar */}
        <SectorBreakdown symbols={symbols} quotes={quotes} />
      </div>

      {/* Popular Additions */}
      <div className="t-card t-card-p" style={{ marginTop: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <span className="t-label" style={{ flexShrink: 0 }}>Popular Additions</span>
          {POPULAR.map(sym => (
            <button
              key={sym}
              className="t-btn t-btn-sm"
              style={{
                color: symbols.includes(sym) ? "var(--text-3)" : "var(--gold)",
                borderColor: symbols.includes(sym) ? "var(--border-c)" : "rgba(201,168,76,0.25)",
                opacity: symbols.includes(sym) ? 0.5 : 1,
                cursor: symbols.includes(sym) ? "default" : "pointer",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
              disabled={symbols.includes(sym)}
              onClick={() => addTicker(sym)}
            >
              {symbols.includes(sym) ? "✓ " : "+ "}{sym}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
