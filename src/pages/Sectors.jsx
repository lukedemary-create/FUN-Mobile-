import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Cell
} from "recharts";
import { PieChart, TrendingUp, BarChart2, RefreshCw, ArrowLeftRight } from "lucide-react";

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const SECTOR_META = {
  XLK:  { name: "Technology",         holdings: ["AAPL", "MSFT", "NVDA", "AVGO", "ORCL"],      desc: "Information technology companies including hardware, software, semiconductors, and IT services." },
  XLF:  { name: "Financials",          holdings: ["BRK.B", "JPM", "V", "MA", "BAC"],            desc: "Banks, insurance, investment firms, and real estate companies that manage financial assets." },
  XLE:  { name: "Energy",              holdings: ["XOM", "CVX", "EOG", "SLB", "MPC"],           desc: "Oil, gas, and consumable fuels companies along with energy equipment and services." },
  XLV:  { name: "Health Care",         holdings: ["LLY", "UNH", "JNJ", "ABBV", "MRK"],         desc: "Pharmaceuticals, biotechnology, medical devices, and healthcare facilities." },
  XLY:  { name: "Consumer Disc.",      holdings: ["AMZN", "TSLA", "HD", "MCD", "NKE"],         desc: "Non-essential goods and services including autos, retail, media, and hospitality." },
  XLP:  { name: "Consumer Staples",    holdings: ["PG", "KO", "PEP", "COST", "WMT"],           desc: "Essential everyday products including food, beverages, tobacco, and household goods." },
  XLI:  { name: "Industrials",         holdings: ["GE", "RTX", "HON", "CAT", "UNP"],           desc: "Aerospace, defense, machinery, construction, and transportation companies." },
  XLU:  { name: "Utilities",           holdings: ["NEE", "SO", "DUK", "AEP", "SRE"],           desc: "Electric, gas, and water utilities providing essential infrastructure services." },
  XLRE: { name: "Real Estate",         holdings: ["PLD", "AMT", "EQIX", "WELL", "PSA"],        desc: "Real estate investment trusts (REITs) and real estate management companies." },
  XLB:  { name: "Materials",           holdings: ["LIN", "SHW", "APD", "FCX", "NEM"],          desc: "Chemicals, construction materials, containers, metals, mining, and paper products." },
  XLC:  { name: "Communication",       holdings: ["META", "GOOGL", "NFLX", "DIS", "T"],        desc: "Telecom carriers, media companies, and interactive entertainment providers." },
};

const CELL_WIDTHS = {
  XLK: 180, XLF: 160, XLE: 140, XLV: 150,
  XLY: 130, XLP: 130, XLI: 130, XLU: 130, XLRE: 130, XLB: 130, XLC: 130,
};

const PERIOD_OPTIONS = [
  { label: "1D",  key: "dayChange" },
  { label: "1W",  key: "weekChange" },
  { label: "1M",  key: "monthChange" },
  { label: "3M",  key: "threeMonthChange" },
  { label: "YTD", key: "ytdChange" },
  { label: "1Y",  key: "yearChange" },
];

const fetchHeatmap = () =>
  fetch(`${BASE}/api/sector/heatmap`).then((r) => {
    if (!r.ok) throw new Error("heatmap failed");
    return r.json();
  });

const fetchSectorFallback = (start, end) =>
  fetch(`${BASE}/functions/getSectorPerformance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ startDate: start, endDate: end }),
  }).then((r) => r.json());

function fmtPct(v) {
  if (v == null) return "—";
  const n = Number(v);
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}

function cellBg(val) {
  if (val == null) return "rgba(122,136,153,0.08)";
  const v = Number(val);
  const intensity = Math.min(Math.abs(v) * 0.05, 0.45);
  if (v >= 0) return `rgba(0,184,153,${0.12 + intensity})`;
  return `rgba(255,59,92,${0.12 + intensity})`;
}

function pctColor(v) {
  if (v == null) return "var(--text-2)";
  return Number(v) >= 0 ? "var(--up)" : "var(--down)";
}

function MiniBar({ label, value, max = 5 }) {
  const v = Number(value) || 0;
  const pct = Math.min(Math.abs(v) / max, 1) * 100;
  const isUp = v >= 0;
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span className="t-label">{label}</span>
        <span className="t-mono" style={{ fontSize: "0.6875rem", color: isUp ? "var(--up)" : "var(--down)" }}>
          {fmtPct(v)}
        </span>
      </div>
      <div style={{ height: 5, background: "var(--elevated)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          marginLeft: isUp ? "50%" : `${50 - pct / 2}%`,
          background: isUp ? "var(--up)" : "var(--down)",
          borderRadius: 3,
          transform: isUp ? "none" : "translateX(-100%)",
          transition: "width 0.4s ease",
        }} />
      </div>
    </div>
  );
}

function SectorSidebar({ symbol, sectorData, period }) {
  const meta = SECTOR_META[symbol] || {};
  const val = sectorData?.[period];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Header */}
      <div className="t-card t-card-gold t-card-p">
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.625rem", marginBottom: 4 }}>
          <span className="t-mono" style={{ fontWeight: 800, fontSize: "1.125rem", color: "var(--gold)" }}>{symbol}</span>
          <span style={{ fontSize: "0.875rem", color: "var(--text-1)", fontWeight: 600 }}>{meta.name}</span>
        </div>
        <div style={{ fontSize: "1.75rem", fontWeight: 800, color: pctColor(val), fontVariantNumeric: "tabular-nums" }}>
          {fmtPct(val)}
        </div>
        <div className="t-label" style={{ marginTop: 4 }}>SELECTED PERIOD</div>
      </div>

      {/* Performance Bars */}
      <div className="t-card t-card-p">
        <div className="t-section-title" style={{ marginBottom: "0.75rem" }}>Performance</div>
        <MiniBar label="DAY" value={sectorData?.dayChange} max={3} />
        <MiniBar label="WEEK" value={sectorData?.weekChange} max={5} />
        <MiniBar label="MONTH" value={sectorData?.monthChange} max={10} />
      </div>

      {/* Top Holdings */}
      <div className="t-card t-card-p">
        <div className="t-section-title" style={{ marginBottom: "0.75rem" }}>Top Holdings</div>
        {(meta.holdings || []).map((h, i) => (
          <div key={h} style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "5px 0", borderBottom: i < (meta.holdings.length - 1) ? "1px solid var(--border-c)" : "none" }}>
            <span style={{ fontSize: "0.6875rem", color: "var(--text-3)", minWidth: 14 }}>{i + 1}</span>
            <span className="t-mono" style={{ fontWeight: 700, color: "var(--gold)", fontSize: "0.8125rem" }}>{h}</span>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="t-card t-card-p">
        <div className="t-section-title" style={{ marginBottom: "0.75rem" }}>About</div>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-2)", lineHeight: 1.65 }}>
          {meta.desc || "Sector ETF tracking a basket of representative equities."}
        </p>
      </div>
    </div>
  );
}

const BarTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{ background: "var(--elevated)", border: "1px solid var(--border-alt)", borderRadius: 6, padding: "8px 12px", fontSize: "0.75rem" }}>
      <div style={{ color: "var(--text-2)", marginBottom: 2 }}>{d.payload?.symbol}</div>
      <div style={{ color: Number(d.value) >= 0 ? "var(--up)" : "var(--down)", fontWeight: 700 }}>{fmtPct(d.value)}</div>
    </div>
  );
};

export default function Sectors() {
  const [period, setPeriod] = useState("dayChange");
  const [selected, setSelected] = useState(null);

  const { data: heatmapData, isError: heatmapError } = useQuery({
    queryKey: ["sector-heatmap"],
    queryFn: fetchHeatmap,
    refetchInterval: 300_000,
    retry: 1,
  });

  const today = new Date().toISOString().split("T")[0];
  const monthAgo = new Date(Date.now() - 30 * 86400_000).toISOString().split("T")[0];

  const { data: fallbackData } = useQuery({
    queryKey: ["sector-perf-fallback", monthAgo, today],
    queryFn: () => fetchSectorFallback(monthAgo, today),
    enabled: !!heatmapError,
    retry: 1,
  });

  // Merge heatmap data into a map keyed by symbol
  const rawList = heatmapError
    ? (fallbackData?.data ?? fallbackData ?? [])
    : (heatmapData?.data ?? heatmapData ?? []);

  const dataMap = {};
  if (Array.isArray(rawList)) {
    rawList.forEach((item) => {
      if (item?.symbol) dataMap[item.symbol] = item;
    });
  }

  const symbols = Object.keys(SECTOR_META);
  const selectedData = selected ? dataMap[selected] : null;

  // Bar chart data sorted by period
  const barData = symbols
    .map((sym) => ({
      symbol: sym,
      value: Number(dataMap[sym]?.[period] ?? 0),
    }))
    .sort((a, b) => b.value - a.value);

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
                <PieChart size={14} style={{ color: "var(--gold)" }} />
              </div>
              <h1 className="t-page-title" style={{ margin: 0 }}>SECTOR PERFORMANCE</h1>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.65, maxWidth: 560, margin: "0 0 1rem" }}>
              Track performance across all 11 S&P 500 sectors. Identify rotation opportunities and see which sectors are leading or lagging the broad market.
            </p>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              {["11 S&P Sectors", "Weekly & YTD", "Live ETF Data", "Sector Rotation"].map((label) => (
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
              { icon: PieChart, label: "11 GICS Sectors", sub: "Full S&P 500 coverage", color: "#3b82f6" },
              { icon: TrendingUp, label: "Weekly Performance", sub: "7-day sector returns", color: "var(--gold)" },
              { icon: BarChart2, label: "YTD Returns", sub: "Year-to-date performance", color: "var(--teal)" },
              { icon: ArrowLeftRight, label: "Rotation Map", sub: "Capital flow tracking", color: "#f59e0b" },
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
        {PERIOD_OPTIONS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className="t-btn t-btn-sm"
            style={{
              background: period === p.key ? "var(--gold-dim)" : "var(--elevated)",
              color: period === p.key ? "var(--gold)" : "var(--text-2)",
              borderColor: period === p.key ? "rgba(201,168,76,0.3)" : "var(--border-alt)",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main layout: heatmap + sidebar */}
      <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
        {/* Heatmap */}
        <div style={{ flex: 1 }}>
          <div className="t-section-title" style={{ marginBottom: "0.75rem" }}>Market Sectors</div>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginBottom: "1.5rem",
          }}>
            {symbols.map((sym) => {
              const meta = SECTOR_META[sym];
              const val = dataMap[sym]?.[period];
              const isSelected = selected === sym;
              const w = CELL_WIDTHS[sym] ?? 130;
              return (
                <div
                  key={sym}
                  className="t-heat-cell"
                  onClick={() => setSelected(isSelected ? null : sym)}
                  style={{
                    width: w,
                    height: 120,
                    background: cellBg(val),
                    border: isSelected
                      ? "2px solid var(--gold)"
                      : "1px solid rgba(255,255,255,0.06)",
                    boxShadow: isSelected ? "0 0 0 2px rgba(201,168,76,0.15)" : "none",
                  }}
                >
                  <span className="t-mono" style={{ fontWeight: 800, fontSize: "0.9375rem", color: "var(--text-1)", letterSpacing: "0.04em" }}>
                    {sym}
                  </span>
                  <span style={{ fontSize: "0.625rem", color: "var(--text-3)", marginTop: 2, marginBottom: 6, textAlign: "center", lineHeight: 1.3 }}>
                    {meta.name}
                  </span>
                  <span
                    className="t-mono"
                    style={{
                      fontSize: "1.0625rem",
                      fontWeight: 800,
                      color: pctColor(val),
                    }}
                  >
                    {fmtPct(val)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 14, height: 10, borderRadius: 2, background: "rgba(0,184,153,0.45)" }} />
              <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>Positive</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 14, height: 10, borderRadius: 2, background: "rgba(255,59,92,0.45)" }} />
              <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>Negative</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 14, height: 10, borderRadius: 2, background: "rgba(122,136,153,0.12)" }} />
              <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>No data</span>
            </div>
            <span style={{ fontSize: "0.6875rem", color: "var(--text-3)", marginLeft: "auto" }}>
              Darker color = stronger move
            </span>
          </div>

          {/* Comparison Bar Chart */}
          <div className="t-card t-card-p">
            <div className="t-section-title" style={{ marginBottom: "0.875rem" }}>Sector Performance Comparison</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="symbol"
                  tick={{ fill: "var(--text-3)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--text-3)", fontSize: 10 }}
                  tickFormatter={(v) => `${v.toFixed(1)}%`}
                  axisLine={false}
                  tickLine={false}
                  width={44}
                />
                <Tooltip content={<BarTooltip />} />
                <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                  {barData.map((entry) => (
                    <Cell
                      key={entry.symbol}
                      fill={entry.value >= 0 ? "var(--up)" : "var(--down)"}
                      opacity={selected === entry.symbol ? 1 : 0.75}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sidebar */}
        {selected && (
          <div style={{ width: 240, flexShrink: 0 }} className="t-fade-up">
            <div className="t-label" style={{ marginBottom: "0.625rem" }}>SECTOR DETAIL</div>
            <SectorSidebar symbol={selected} sectorData={selectedData} period={period} />
          </div>
        )}

        {!selected && (
          <div style={{ width: 240, flexShrink: 0 }}>
            <div className="t-card t-card-p" style={{ textAlign: "center", padding: "2rem 1rem" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: 8, opacity: 0.4 }}>◎</div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-3)" }}>
                Click any sector cell to view detailed breakdown
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
