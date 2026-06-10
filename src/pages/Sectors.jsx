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

const GLASS_CARD = { background: "var(--surface)", border: "1px solid var(--border-c)", borderRadius: 12, padding: "1rem", backdropFilter: "blur(8px)" };
const SIDE_TITLE = { fontSize: "0.5625rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "0.625rem", fontFamily: "'Inter', system-ui, sans-serif" };

function SectorSidebar({ symbol, sectorData, period }) {
  const meta = SECTOR_META[symbol] || {};
  const val = sectorData?.[period];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* Header */}
      <div style={{ ...GLASS_CARD, background: "rgba(201,169,110,0.05)", border: "1px solid rgba(201,169,110,0.2)" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.375rem" }}>
          <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--gold)", fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>{symbol}</span>
          <span style={{ fontSize: "0.8125rem", color: "var(--text-1)", fontWeight: 600, fontFamily: "'Inter', system-ui, sans-serif" }}>{meta.name}</span>
        </div>
        <div style={{ fontSize: "1.75rem", fontWeight: 800, color: pctColor(val), fontFamily: "'JetBrains Mono', 'Fira Code', monospace", lineHeight: 1 }}>
          {fmtPct(val)}
        </div>
        <div style={{ fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-3)", marginTop: 6, fontFamily: "'Inter', system-ui, sans-serif" }}>Selected Period</div>
      </div>

      {/* Performance Bars */}
      <div style={GLASS_CARD}>
        <div style={SIDE_TITLE}>Performance</div>
        <MiniBar label="DAY" value={sectorData?.dayChange} max={3} />
        <MiniBar label="WEEK" value={sectorData?.weekChange} max={5} />
        <MiniBar label="MONTH" value={sectorData?.monthChange} max={10} />
      </div>

      {/* Top Holdings */}
      <div style={GLASS_CARD}>
        <div style={SIDE_TITLE}>Top Holdings</div>
        {(meta.holdings || []).map((h, i) => (
          <div key={h} style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "5px 0", borderBottom: i < (meta.holdings.length - 1) ? "1px solid var(--border-c)" : "none" }}>
            <span style={{ fontSize: "0.625rem", color: "var(--text-3)", minWidth: 14, fontFamily: "'Inter', system-ui, sans-serif" }}>{i + 1}</span>
            <span style={{ fontWeight: 700, color: "var(--gold)", fontSize: "0.8125rem", fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>{h}</span>
          </div>
        ))}
      </div>

      {/* Description */}
      <div style={GLASS_CARD}>
        <div style={SIDE_TITLE}>About</div>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-2)", lineHeight: 1.7, margin: 0, fontFamily: "'Inter', system-ui, sans-serif" }}>
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
    <div>
      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border-c)",
        borderRadius: 20, padding: "2rem 2.25rem",
        marginBottom: "1.25rem", position: "relative", overflow: "hidden",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 var(--border-c)",
      }}>
        <div style={{ position: "absolute", top: -80, right: -60, width: 400, height: 400, background: "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 68%)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "2rem", position: "relative" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.875rem" }}>
              <div style={{ width: 20, height: 1, background: "var(--gold)", opacity: 0.55 }} />
              <p style={{ fontSize: "0.5625rem", fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--gold)", margin: 0, fontFamily: "'Inter', system-ui, sans-serif" }}>
                Terminal · Markets
              </p>
            </div>
            <h1 style={{ margin: "0 0 0.625rem", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-1)", lineHeight: 1.05, fontFamily: "'Inter', system-ui, sans-serif", display: "flex", alignItems: "baseline", gap: "0.375rem", flexWrap: "wrap" }}>
              <span>Sector</span>
              <em style={{ fontStyle: "italic", color: "var(--gold)", fontFamily: "'Playfair Display', Georgia, serif" }}>Performance</em>
            </h1>
            <p style={{ fontSize: "0.875rem", color: "var(--text-3)", lineHeight: 1.75, maxWidth: 520, margin: "0 0 1.125rem", fontFamily: "'Inter', system-ui, sans-serif" }}>
              Track performance across all 11 S&P 500 sectors. Identify rotation opportunities and see which sectors are leading or lagging the broad market.
            </p>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.375rem" }}>
              {["11 S&P Sectors", "Weekly & YTD", "Live ETF Data", "Sector Rotation"].map((label) => (
                <span key={label} style={{
                  fontSize: "0.5625rem", fontWeight: 700, padding: "3px 10px",
                  borderRadius: 99, letterSpacing: "0.08em", textTransform: "uppercase",
                  background: "rgba(201,169,110,0.08)",
                  border: "1px solid rgba(201,169,110,0.2)",
                  color: "var(--gold)", fontFamily: "'Inter', system-ui, sans-serif",
                }}>{label}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", flexShrink: 0 }}>
            {[
              { icon: PieChart, label: "11 GICS Sectors", sub: "Full S&P 500 coverage" },
              { icon: TrendingUp, label: "Weekly Performance", sub: "7-day sector returns" },
              { icon: BarChart2, label: "YTD Returns", sub: "Year-to-date performance" },
              { icon: ArrowLeftRight, label: "Rotation Map", sub: "Capital flow tracking" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: "0.625rem",
                padding: "0.625rem 0.875rem",
                background: "var(--elevated)", border: "1px solid var(--border-c)",
                borderRadius: 10, minWidth: 160,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                  background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={13} style={{ color: "var(--gold)" }} />
                </div>
                <div>
                  <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--text-1)", lineHeight: 1.2, fontFamily: "'Inter', system-ui, sans-serif" }}>{label}</div>
                  <div style={{ fontSize: "0.5625rem", color: "var(--text-3)", marginTop: 2, fontFamily: "'Inter', system-ui, sans-serif" }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Period selector */}
      <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.25rem", background: "var(--surface)", border: "1px solid var(--border-c)", borderRadius: 10, padding: "0.3rem", width: "fit-content" }}>
        {PERIOD_OPTIONS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            style={{
              background: period === p.key ? "rgba(201,169,110,0.18)" : "transparent",
              color: period === p.key ? "var(--gold)" : "var(--text-3)",
              border: period === p.key ? "1px solid rgba(201,169,110,0.35)" : "1px solid transparent",
              borderRadius: 7, padding: "0.35rem 0.75rem",
              fontSize: "0.6875rem", fontWeight: period === p.key ? 700 : 500,
              cursor: "pointer", transition: "all 0.12s",
              fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: "0.03em",
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
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-2)", marginBottom: "0.875rem", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'Inter', system-ui, sans-serif" }}>Market Sectors</div>
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
                      : "1px solid var(--border-c)",
                    boxShadow: isSelected ? "0 0 0 2px rgba(201,169,110,0.15)" : "none",
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
          <div style={{ background: "var(--surface)", border: "1px solid var(--border-c)", borderRadius: 14, padding: "1.25rem", backdropFilter: "blur(8px)" }}>
            <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-1)", marginBottom: "0.875rem", fontFamily: "'Inter', system-ui, sans-serif" }}>Sector Performance Comparison</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" />
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
          <div style={{ width: 244, flexShrink: 0 }}>
            <div style={{ fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "0.625rem", fontFamily: "'Inter', system-ui, sans-serif" }}>Sector Detail</div>
            <SectorSidebar symbol={selected} sectorData={selectedData} period={period} />
          </div>
        )}

        {!selected && (
          <div style={{ width: 244, flexShrink: 0 }}>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border-c)", borderRadius: 12, padding: "2.5rem 1.25rem", textAlign: "center", backdropFilter: "blur(8px)" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.875rem" }}>
                <PieChart size={16} style={{ color: "var(--gold)", opacity: 0.6 }} />
              </div>
              <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-2)", marginBottom: "0.375rem", fontFamily: "'Inter', system-ui, sans-serif" }}>
                Select a sector
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-3)", lineHeight: 1.65, fontFamily: "'Inter', system-ui, sans-serif" }}>
                Click any cell in the heatmap to view the detailed breakdown
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
