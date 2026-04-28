import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import { TrendingUp, TrendingDown, BarChart2, Zap, Volume2 } from "lucide-react";

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/* ── helpers ──────────────────────────────────────────────────────── */
function dateOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

const PERIODS = [
  { label: "1D",  days: 1 },
  { label: "5D",  days: 5 },
  { label: "1M",  days: 30 },
  { label: "3M",  days: 90 },
  { label: "6M",  days: 180 },
  { label: "1Y",  days: 365 },
];

const PERFORMER_TABS = [
  "TOP GAINERS",
  "TOP LOSERS",
  "MOST ACTIVE",
  "52W HIGHS",
  "52W LOWS",
];

const fetchPerformers = (start, end) =>
  fetch(`${BASE}/functions/getTopPerformers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ startDate: start, endDate: end }),
  }).then((r) => r.json());

function fmt2(v) {
  return v != null ? Number(v).toFixed(2) : "—";
}
function fmtPct(v) {
  if (v == null) return "—";
  const n = Number(v);
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}
function fmtPrice(v) {
  return v != null
    ? `$${Number(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "—";
}
function fmtBig(v) {
  if (v == null) return "—";
  const n = Number(v);
  if (n >= 1e12) return `$${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${n}`;
}
function fmtVol(v) {
  if (v == null) return "—";
  const n = Number(v);
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return `${n}`;
}

/* ── Sparkline ────────────────────────────────────────────────────── */
function Sparkline({ data, isUp }) {
  const color = isUp ? "var(--up)" : "var(--down)";
  return (
    <div style={{ width: 80, height: 32, display: "inline-block" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <Line
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function makeSparkData(stock) {
  const history = stock?.priceHistory || stock?.price_history || stock?.priceHistoryDaily || stock?.price_history_daily;
  if (history && history.length > 1) {
    const slice = history.slice(-20);
    return slice.map((d) => ({ price: d.price ?? d.close }));
  }
  // Simulate with seeded random walk
  const seed = (stock?.ticker || "X").charCodeAt(0);
  const startPrice = stock?.price ?? 100;
  const trend = (stock?.change_percent ?? 1) > 0 ? 1 : -1;
  const pts = [];
  let p = startPrice * 0.96;
  for (let i = 0; i < 20; i++) {
    p += trend * 0.3 + (Math.sin(i * seed) * 0.5);
    pts.push({ price: Math.max(p, 1) });
  }
  return pts;
}

/* ── Table row ────────────────────────────────────────────────────── */
function StockRow({ rank, stock }) {
  const isUp = (stock.change_percent ?? stock.change ?? 0) >= 0;
  const sparkData = makeSparkData(stock);

  return (
    <tr>
      <td style={{ padding: "0 0.875rem", height: 40 }}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-3)", fontWeight: 600 }}>{rank}</span>
      </td>
      <td style={{ padding: "0 0.875rem", height: 40 }}>
        <span className="t-mono" style={{ fontWeight: 800, fontSize: "0.8125rem", color: "var(--gold)" }}>
          {stock.ticker}
        </span>
      </td>
      <td style={{ padding: "0 0.875rem", maxWidth: 160 }}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
          {stock.company_name ?? stock.name ?? "—"}
        </span>
      </td>
      <td style={{ padding: "0 0.875rem" }}>
        <span className="t-badge t-badge-blue" style={{ fontSize: "0.625rem", padding: "1px 6px" }}>
          {stock.sector ?? "—"}
        </span>
      </td>
      <td style={{ padding: "0 0.875rem" }}>
        <span className="t-mono" style={{ fontSize: "0.8125rem" }}>
          {fmtPrice(stock.current_price ?? stock.price)}
        </span>
      </td>
      <td style={{ padding: "0 0.875rem" }}>
        <span className="t-mono" style={{ fontSize: "0.8125rem", color: isUp ? "var(--up)" : "var(--down)" }}>
          {stock.change != null ? `${isUp ? "+" : ""}${fmt2(stock.change)}` : "—"}
        </span>
      </td>
      <td style={{ padding: "0 0.875rem" }}>
        <span className={`t-badge ${isUp ? "t-badge-up" : "t-badge-down"}`}>
          {fmtPct(stock.change_percent)}
        </span>
      </td>
      <td style={{ padding: "0 0.875rem" }}>
        <span className="t-mono" style={{ fontSize: "0.75rem", color: "var(--text-2)" }}>
          {fmtVol(stock.volume)}
        </span>
      </td>
      <td style={{ padding: "0 0.875rem" }}>
        <span className="t-mono" style={{ fontSize: "0.75rem", color: "var(--text-2)" }}>
          {fmtBig(stock.market_cap)}
        </span>
      </td>
      <td style={{ padding: "0 0.875rem" }}>
        <Sparkline data={sparkData} isUp={isUp} />
      </td>
    </tr>
  );
}

/* ── Momentum card ────────────────────────────────────────────────── */
function MomentumCard({ stock }) {
  const isUp = (stock.change_percent ?? 0) >= 0;
  const sparkData = makeSparkData(stock);
  return (
    <div className="t-card t-card-hover" style={{ padding: "0.875rem", flex: "1 1 140px", minWidth: 130 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <span className="t-mono" style={{ fontWeight: 800, fontSize: "0.9375rem", color: "var(--gold)" }}>
          {stock.ticker}
        </span>
        <span className={`t-badge ${isUp ? "t-badge-up" : "t-badge-down"}`} style={{ fontSize: "0.625rem" }}>
          {fmtPct(stock.change_percent)}
        </span>
      </div>
      <div style={{ fontSize: "0.6875rem", color: "var(--text-3)", marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {stock.company_name ?? stock.name ?? "—"}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="t-mono" style={{ fontSize: "1rem", fontWeight: 700, color: isUp ? "var(--up)" : "var(--down)" }}>
            {fmtPct(stock.change_percent)}
          </div>
          <div style={{ fontSize: "0.625rem", color: "var(--text-3)" }}>
            {fmtPrice(stock.current_price ?? stock.price)}
          </div>
        </div>
        <Sparkline data={sparkData} isUp={isUp} />
      </div>
    </div>
  );
}

/* ── Skeleton ─────────────────────────────────────────────────────── */
function TableSkeleton() {
  return (
    <tbody>
      {Array.from({ length: 10 }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: 10 }).map((__, j) => (
            <td key={j} style={{ padding: "0 0.875rem", height: 40 }}>
              <div className="t-skeleton" style={{ height: 12, borderRadius: 3, width: j === 2 ? 120 : j === 9 ? 80 : 60 }} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

/* ── Main Component ───────────────────────────────────────────────── */
export default function TopPerformers() {
  const [periodIdx, setPeriodIdx] = useState(0);
  const [activeTab, setActiveTab] = useState("TOP GAINERS");

  const period = PERIODS[periodIdx];
  const endDate = new Date().toISOString().split("T")[0];
  const startDate = dateOffset(period.days);

  const { data: rawData, isLoading } = useQuery({
    queryKey: ["top-performers", startDate, endDate],
    queryFn: () => fetchPerformers(startDate, endDate),
    staleTime: 120_000,
    retry: 1,
  });

  const responseData = rawData?.data ?? rawData ?? {};

  // Extract stocks from response — handle various shapes
  const gainers = useMemo(() => {
    const arr = responseData?.gainers ?? responseData?.topGainers ?? responseData?.top_gainers ?? [];
    return Array.isArray(arr) ? [...arr].sort((a, b) => (b.change_percent ?? 0) - (a.change_percent ?? 0)) : [];
  }, [responseData]);

  const losers = useMemo(() => {
    const arr = responseData?.losers ?? responseData?.topLosers ?? responseData?.top_losers ?? gainers;
    const base = Array.isArray(arr) ? arr : [];
    if (base === gainers && gainers.length > 0) {
      return [...gainers].sort((a, b) => (a.change_percent ?? 0) - (b.change_percent ?? 0));
    }
    return [...base].sort((a, b) => (a.change_percent ?? 0) - (b.change_percent ?? 0));
  }, [responseData, gainers]);

  const allStocks = useMemo(() => {
    const combined = [...gainers, ...losers];
    const seen = new Set();
    return combined.filter((s) => {
      if (seen.has(s.ticker)) return false;
      seen.add(s.ticker);
      return true;
    });
  }, [gainers, losers]);

  const mostActive = useMemo(
    () => [...allStocks].sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0)),
    [allStocks]
  );

  const highs52 = useMemo(
    () => allStocks.filter((s) => {
      const p = s.current_price ?? s.price ?? 0;
      const h = s.fifty_two_week_high ?? s.week_52_high ?? 0;
      return h > 0 && p >= h * 0.98;
    }),
    [allStocks]
  );

  const lows52 = useMemo(
    () => allStocks.filter((s) => {
      const p = s.current_price ?? s.price ?? 0;
      const l = s.fifty_two_week_low ?? s.week_52_low ?? 0;
      return l > 0 && p <= l * 1.02;
    }),
    [allStocks]
  );

  const tableMap = {
    "TOP GAINERS": gainers,
    "TOP LOSERS": losers,
    "MOST ACTIVE": mostActive,
    "52W HIGHS": highs52,
    "52W LOWS": lows52,
  };

  const tableData = tableMap[activeTab] ?? [];

  // Momentum leaders: top 6 gainers
  const momentumLeaders = [...gainers].slice(0, 6);

  return (
    <div className="t-bg" style={{ minHeight: "100vh", padding: "1.5rem" }}>
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
                <TrendingUp size={14} style={{ color: "var(--gold)" }} />
              </div>
              <h1 className="t-page-title" style={{ margin: 0 }}>TOP PERFORMERS</h1>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.65, maxWidth: 560, margin: "0 0 1rem" }}>
              Scan the market for today's biggest movers. Track top gainers, top losers, and high-volume stocks driving momentum across all major exchanges.
            </p>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              {["Daily Movers", "Volume Spikes", "52-Week Highs", "Real-Time Screening"].map((label) => (
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
              { icon: TrendingUp, label: "Top Gainers", sub: "Biggest % movers up", color: "#3b82f6" },
              { icon: TrendingDown, label: "Top Losers", sub: "Biggest % movers down", color: "var(--gold)" },
              { icon: Volume2, label: "Volume Leaders", sub: "Unusual volume stocks", color: "var(--teal)" },
              { icon: Zap, label: "Breakout Stocks", sub: "52-week high breakers", color: "#f59e0b" },
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

      {/* Period selector */}
      <div style={{ display: "flex", gap: "0.375rem", marginBottom: "1.25rem" }}>
        {PERIODS.map((p, i) => (
          <button
            key={p.label}
            onClick={() => setPeriodIdx(i)}
            className="t-btn t-btn-sm"
            style={{
              background: periodIdx === i ? "var(--gold-dim)" : "var(--elevated)",
              color: periodIdx === i ? "var(--gold)" : "var(--text-2)",
              borderColor: periodIdx === i ? "rgba(201,168,76,0.3)" : "var(--border-alt)",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="t-tabs" style={{ marginBottom: "1rem" }}>
        {PERFORMER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`t-tab ${activeTab === tab ? "active" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="t-card" style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
        <table
          className="t-table"
          style={{ fontSize: "0.8125rem" }}
        >
          <thead>
            <tr>
              <th style={{ width: 36 }}>#</th>
              <th>SYMBOL</th>
              <th>COMPANY</th>
              <th>SECTOR</th>
              <th>PRICE</th>
              <th>CHG $</th>
              <th>CHG %</th>
              <th>VOLUME</th>
              <th>MKT CAP</th>
              <th>SPARKLINE</th>
            </tr>
          </thead>
          {isLoading ? (
            <TableSkeleton />
          ) : tableData.length > 0 ? (
            <tbody>
              {tableData.map((stock, i) => (
                <StockRow key={stock.ticker ?? i} rank={i + 1} stock={stock} />
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={10} style={{ textAlign: "center", padding: "3rem", color: "var(--text-3)" }}>
                  No data available for this category
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

      {/* Momentum Leaders */}
      {(momentumLeaders.length > 0 || isLoading) && (
        <div>
          <div className="t-section-title" style={{ marginBottom: "0.875rem" }}>
            Momentum Leaders
          </div>
          {isLoading ? (
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="t-card" style={{ flex: "1 1 140px", minWidth: 130, padding: "0.875rem" }}>
                  <div className="t-skeleton" style={{ height: 14, marginBottom: 8, borderRadius: 3 }} />
                  <div className="t-skeleton" style={{ height: 10, marginBottom: 12, borderRadius: 3, width: "70%" }} />
                  <div className="t-skeleton" style={{ height: 32, borderRadius: 3 }} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {momentumLeaders.map((stock) => (
                <MomentumCard key={stock.ticker} stock={stock} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
