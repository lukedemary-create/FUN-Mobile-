import React, { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, LineChart, Line
} from "recharts";
import { Search, TrendingUp, TrendingDown, ChevronDown, ChevronUp, MonitorDot, Layers, BarChart2 } from "lucide-react";

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const fetchStock = (ticker) =>
  fetch(`${BASE}/functions/getStockData`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticker }),
  }).then((r) => r.json());

const formatPrice = (price) =>
  price != null
    ? `$${Number(price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "—";

const formatBig = (v) => {
  if (v == null) return "—";
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
  return `$${v}`;
};

const fmt = (v, d = 2) => (v != null ? Number(v).toFixed(d) : "—");

const RECENT = ["AAPL", "MSFT", "GOOGL", "TSLA", "NVDA", "JPM", "AMZN", "META"];

const TIMEFRAMES = [
  { label: "1D", key: "1d" },
  { label: "5D", key: "5d" },
  { label: "1M", key: "1m" },
  { label: "3M", key: "3m" },
  { label: "6M", key: "6m" },
  { label: "1Y", key: "1y" },
  { label: "2Y", key: "2y" },
  { label: "5Y", key: "5y" },
  { label: "MAX", key: "max" },
];

const TABS = ["OVERVIEW", "CHART", "FINANCIALS", "ANALYSIS"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--elevated)",
      border: "1px solid var(--border-alt)",
      borderRadius: 6,
      padding: "8px 12px",
      fontSize: "0.75rem",
    }}>
      <div style={{ color: "var(--text-2)", marginBottom: 2 }}>{label}</div>
      <div style={{ color: "var(--gold)", fontWeight: 700 }}>
        {formatPrice(payload[0]?.value)}
      </div>
    </div>
  );
};

const VolumeTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const v = payload[0]?.value;
  return (
    <div style={{
      background: "var(--elevated)",
      border: "1px solid var(--border-alt)",
      borderRadius: 6,
      padding: "8px 12px",
      fontSize: "0.75rem",
    }}>
      <div style={{ color: "var(--text-2)", marginBottom: 2 }}>{label}</div>
      <div style={{ color: "var(--blue)", fontWeight: 700 }}>
        {v != null ? (v / 1e6).toFixed(2) + "M" : "—"}
      </div>
    </div>
  );
};

function getChartData(stockData, tf) {
  if (!stockData) return [];
  const now = new Date();
  const daily = stockData.priceHistoryDaily || stockData.price_history_daily || [];
  const intraday = stockData.priceHistoryIntraday || stockData.price_history_intraday || [];
  const history = stockData.priceHistory || stockData.price_history || [];

  const cutoffMap = {
    "1d": () => { const d = new Date(); d.setDate(d.getDate() - 1); return d; },
    "5d": () => { const d = new Date(); d.setDate(d.getDate() - 5); return d; },
    "1m": () => { const d = new Date(); d.setMonth(d.getMonth() - 1); return d; },
    "3m": () => { const d = new Date(); d.setMonth(d.getMonth() - 3); return d; },
    "6m": () => { const d = new Date(); d.setMonth(d.getMonth() - 6); return d; },
    "1y": () => { const d = new Date(); d.setFullYear(d.getFullYear() - 1); return d; },
    "2y": () => { const d = new Date(); d.setFullYear(d.getFullYear() - 2); return d; },
    "5y": () => { const d = new Date(); d.setFullYear(d.getFullYear() - 5); return d; },
    "max": () => new Date(0),
  };

  const cutoff = cutoffMap[tf] ? cutoffMap[tf]() : new Date(0);

  if (tf === "1d" || tf === "5d") {
    const src = intraday.length > 0 ? intraday : daily;
    return src
      .filter((d) => new Date(d.date) >= cutoff)
      .map((d) => ({
        date: d.date,
        label: tf === "1d"
          ? new Date(d.date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
          : new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        price: d.price ?? d.close,
        volume: d.volume,
      }));
  }

  const src = tf === "5y" || tf === "max" ? (history.length > 0 ? history : daily) : daily;
  return src
    .filter((d) => new Date(d.date) >= cutoff)
    .map((d) => ({
      date: d.date,
      label: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: tf === "max" || tf === "5y" ? "2-digit" : undefined }),
      price: d.price ?? d.close,
      volume: d.volume,
    }));
}

function SkeletonBlock({ w = "100%", h = 18, mb = 0 }) {
  return (
    <div className="t-skeleton" style={{ width: w, height: h, marginBottom: mb, borderRadius: 4 }} />
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", paddingTop: "1rem" }}>
      <div style={{ display: "flex", gap: "1rem", overflowX: "auto" }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="t-card t-card-p" style={{ minWidth: 120 }}>
            <SkeletonBlock w={60} h={10} mb={8} />
            <SkeletonBlock w={80} h={22} />
          </div>
        ))}
      </div>
      <div className="t-card t-card-p">
        <SkeletonBlock w="30%" h={14} mb={10} />
        <SkeletonBlock h={12} mb={6} />
        <SkeletonBlock h={12} mb={6} />
        <SkeletonBlock w="70%" h={12} />
      </div>
      <div className="t-card t-card-p" style={{ height: 380 }}>
        <SkeletonBlock h="100%" />
      </div>
    </div>
  );
}

/* ── Stat card in top strip ─────────────────────────────────────── */
function StatChip({ label, value, highlight }) {
  return (
    <div className="t-card t-card-p" style={{ minWidth: 110, flexShrink: 0 }}>
      <div className="t-label" style={{ marginBottom: 4 }}>{label}</div>
      <div
        className="t-mono t-metric-md"
        style={{ color: highlight ? "var(--gold)" : "var(--text-1)", fontSize: "0.9375rem" }}
      >
        {value}
      </div>
    </div>
  );
}

/* ── Metric grid card ───────────────────────────────────────────── */
function MetricCard({ label, value, sub }) {
  return (
    <div className="t-card t-card-p t-card-hover" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div className="t-label">{label}</div>
      <div className="t-mono t-metric-md" style={{ color: "var(--text-1)" }}>{value}</div>
      {sub && <div style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>{sub}</div>}
    </div>
  );
}

/* ── Overview Tab ───────────────────────────────────────────────── */
function OverviewTab({ data }) {
  const [descOpen, setDescOpen] = useState(false);
  const price = data.current_price ?? data.price;
  const change = data.price_change ?? data.change;
  const changePct = data.price_change_pct ?? data.change_percent;
  const isUp = (change ?? 0) >= 0;

  const quoteType = data.quote_type || "EQUITY";
  const isFund = quoteType === "MUTUALFUND";
  const isETF = quoteType === "ETF";
  const isEquity = !isFund && !isETF;

  // Stats strip — adapt based on asset type
  const stats = [
    { label: isFund ? "NAV" : "PRICE", value: formatPrice(isFund && data.nav ? data.nav : price), highlight: true },
    { label: "CHANGE $", value: change != null ? `${isUp ? "+" : ""}${fmt(change)}` : "—" },
    { label: "CHANGE %", value: changePct != null ? `${isUp ? "+" : ""}${fmt(changePct)}%` : "—" },
    ...(isEquity ? [
      { label: "MKT CAP", value: formatBig(data.market_cap) },
      { label: "P/E", value: data.pe_ratio != null ? fmt(data.pe_ratio, 1) : "—" },
      { label: "EPS (TTM)", value: data.eps != null ? `$${fmt(data.eps)}` : "—" },
    ] : [
      { label: "MKT CAP", value: formatBig(data.market_cap) },
      { label: "EXP. RATIO", value: data.expense_ratio != null ? `${(data.expense_ratio * 100).toFixed(2)}%` : "—" },
      { label: "YTD RETURN", value: data.ytd_return != null ? `${(data.ytd_return * 100).toFixed(2)}%` : "—" },
    ]),
    { label: "BETA", value: data.beta != null ? fmt(data.beta, 2) : "—" },
    { label: "DIV YIELD", value: data.dividend_yield != null ? `${fmt(data.dividend_yield, 2)}%` : "N/A" },
    { label: "52W HIGH", value: formatPrice(data.fifty_two_week_high ?? data.week_52_high) },
    { label: "52W LOW", value: formatPrice(data.fifty_two_week_low ?? data.week_52_low) },
  ];

  // Metrics grid — equity vs fund
  const metrics = isEquity ? [
    { label: "Revenue (TTM)", value: formatBig(data.revenue) },
    { label: "Net Income", value: formatBig(data.net_income) },
    { label: "Gross Margin", value: data.gross_margin != null ? `${fmt(data.gross_margin, 1)}%` : "—" },
    { label: "Op. Margin", value: data.operating_margin != null ? `${fmt(data.operating_margin, 1)}%` : "—" },
    { label: "Debt/Equity", value: data.debt_to_equity != null ? fmt(data.debt_to_equity, 2) : "—" },
    { label: "ROE", value: data.return_on_equity != null ? `${fmt(data.return_on_equity, 1)}%` : "—" },
    { label: "P/B Ratio", value: data.price_to_book != null ? fmt(data.price_to_book, 2) : "—" },
    { label: "Free Cash Flow", value: formatBig(data.free_cash_flow) },
  ] : [
    { label: "Fund Family", value: data.fund_family || "—" },
    { label: "Category", value: data.fund_category || "—" },
    { label: "Expense Ratio", value: data.expense_ratio != null ? `${(data.expense_ratio * 100).toFixed(2)}%` : "—" },
    { label: "YTD Return", value: data.ytd_return != null ? `${(data.ytd_return * 100).toFixed(2)}%` : "—" },
    { label: "Beta", value: data.beta != null ? fmt(data.beta, 2) : "—" },
    { label: "Dividend Yield", value: data.dividend_yield != null ? `${fmt(data.dividend_yield, 2)}%` : "—" },
    { label: "52W High", value: formatPrice(data.fifty_two_week_high) },
    { label: "52W Low", value: formatPrice(data.fifty_two_week_low) },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Stats Strip */}
      <div style={{ display: "flex", gap: "0.625rem", overflowX: "auto", paddingBottom: 4 }}>
        {stats.map((s) => (
          <StatChip key={s.label} {...s} />
        ))}
      </div>

      {/* Price badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem 0", flexWrap: "wrap" }}>
        <span className="t-metric-xl grad-gold">{formatPrice(price)}</span>
        <span
          className={`t-badge ${isUp ? "t-badge-up" : "t-badge-down"}`}
          style={{ fontSize: "0.875rem", padding: "4px 12px" }}
        >
          {isUp ? "▲" : "▼"} {isUp ? "+" : ""}{fmt(changePct)}%
        </span>
        <span className={`t-badge ${isUp ? "t-badge-up" : "t-badge-down"}`} style={{ padding: "4px 12px" }}>
          {isUp ? "+" : ""}{fmt(change)}
        </span>
        <div className="t-live" style={{ marginLeft: 4 }} />
        <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>LIVE</span>
        {(isFund || isETF) && (
          <span className="t-badge t-badge-neutral" style={{ marginLeft: 4 }}>
            {isFund ? "MUTUAL FUND" : "ETF"}
          </span>
        )}
      </div>

      {/* Description */}
      {data.description && (
        <div className="t-card">
          <button
            onClick={() => setDescOpen((o) => !o)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.875rem 1.25rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-1)",
            }}
          >
            <span className="t-section-title">{isFund ? "Fund Overview" : isETF ? "ETF Overview" : "Company Overview"}</span>
            {descOpen ? <ChevronUp size={14} color="var(--text-3)" /> : <ChevronDown size={14} color="var(--text-3)" />}
          </button>
          {descOpen && (
            <div style={{ padding: "0 1.25rem 1.25rem", color: "var(--text-2)", fontSize: "0.8125rem", lineHeight: 1.75 }}>
              {data.description}
            </div>
          )}
        </div>
      )}

      {/* Metrics Grid */}
      <div>
        <div className="t-section-title" style={{ marginBottom: "0.75rem" }}>Key Metrics</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.625rem" }}>
          {metrics.map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Chart Tab ──────────────────────────────────────────────────── */
function ChartTab({ data }) {
  const [tf, setTf] = useState("1y");
  const chartData = getChartData(data, tf);
  const hasData = chartData.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Timeframe selector */}
      <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
        {TIMEFRAMES.map((t) => (
          <button
            key={t.key}
            onClick={() => setTf(t.key)}
            className="t-btn t-btn-sm"
            style={{
              background: tf === t.key ? "var(--gold-dim)" : "var(--elevated)",
              color: tf === t.key ? "var(--gold)" : "var(--text-2)",
              borderColor: tf === t.key ? "rgba(201,168,76,0.3)" : "var(--border-alt)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main price chart */}
      <div className="t-card t-card-p">
        {hasData ? (
          <ResponsiveContainer width="100%" height={380}>
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="label"
                tick={{ fill: "var(--text-3)", fontSize: 10 }}
                interval="preserveStartEnd"
                tickCount={7}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--text-3)", fontSize: 10 }}
                tickFormatter={(v) => `$${v.toFixed(0)}`}
                width={56}
                axisLine={false}
                tickLine={false}
                domain={["auto", "auto"]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="var(--gold)"
                strokeWidth={1.5}
                fill="url(#goldGrad)"
                dot={false}
                activeDot={{ r: 4, fill: "var(--gold)", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: 380, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-3)" }}>
            No data for this timeframe
          </div>
        )}
      </div>

      {/* Volume chart */}
      {hasData && chartData.some((d) => d.volume) && (
        <div className="t-card t-card-p">
          <div className="t-label" style={{ marginBottom: 8 }}>VOLUME</div>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={chartData} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
              <XAxis dataKey="label" hide />
              <YAxis hide />
              <Tooltip content={<VolumeTooltip />} />
              <Bar dataKey="volume" fill="var(--blue)" opacity={0.7} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

/* ── Financials Tab ─────────────────────────────────────────────── */
function FinancialsTab({ data }) {
  const [view, setView] = useState("annual");
  const chartData = view === "annual"
    ? (data.revenue_annual || data.revenueAnnual || [])
    : (data.revenue_quarterly || data.revenueQuarterly || []);

  const quoteType = data.quote_type || "EQUITY";
  const isFund = quoteType === "MUTUALFUND";
  const isETF = quoteType === "ETF";
  const noFinancials = isFund || isETF;

  const fmtMoney = (v) => {
    if (v == null) return "—";
    const n = Number(v);
    if (Math.abs(n) >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
    if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
    if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
    return `$${n.toFixed(0)}`;
  };

  // For funds/ETFs: show fund-specific stats instead
  if (noFinancials) {
    const fundStats = [
      { label: isFund ? "NAV" : "Price", value: data.nav != null ? `$${Number(data.nav).toFixed(2)}` : formatPrice(data.current_price) },
      { label: "Expense Ratio", value: data.expense_ratio != null ? `${(data.expense_ratio * 100).toFixed(2)}%` : "—" },
      { label: "YTD Return", value: data.ytd_return != null ? `${(data.ytd_return * 100).toFixed(2)}%` : "—" },
      { label: "Dividend Yield", value: data.dividend_yield != null ? `${fmt(data.dividend_yield, 2)}%` : "—" },
      { label: "52W High", value: formatPrice(data.fifty_two_week_high) },
      { label: "52W Low", value: formatPrice(data.fifty_two_week_low) },
      { label: "Beta", value: data.beta != null ? fmt(data.beta, 2) : "—" },
      { label: "Avg Volume", value: data.avg_volume != null ? (data.avg_volume / 1e6).toFixed(2) + "M" : "—" },
    ];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div className="t-card t-card-p" style={{ borderColor: "rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.04)" }}>
          <div className="t-label" style={{ marginBottom: 8 }}>
            {isFund ? "MUTUAL FUND" : "ETF"} — Income statements not applicable
          </div>
          <div style={{ fontSize: "0.8125rem", color: "var(--text-2)", lineHeight: 1.6 }}>
            {isFund ? "Mutual funds" : "ETFs"} do not report corporate revenue or earnings. Key performance metrics are shown below.
            {data.fund_family && ` Fund family: ${data.fund_family}.`}
            {data.fund_category && ` Category: ${data.fund_category}.`}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.625rem" }}>
          {fundStats.map((s) => <MetricCard key={s.label} label={s.label} value={s.value} />)}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Toggle */}
      <div style={{ display: "flex", gap: "0.375rem" }}>
        {["annual", "quarterly"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="t-btn t-btn-sm"
            style={{
              textTransform: "capitalize",
              background: view === v ? "var(--blue-dim)" : "var(--elevated)",
              color: view === v ? "var(--blue)" : "var(--text-2)",
              borderColor: view === v ? "rgba(26,159,216,0.3)" : "var(--border-alt)",
            }}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="t-card t-card-p">
        <div style={{ display: "flex", gap: "1.25rem", marginBottom: "0.875rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: "var(--blue)" }} />
            <span style={{ fontSize: "0.75rem", color: "var(--text-2)" }}>Revenue</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: "var(--teal)" }} />
            <span style={{ fontSize: "0.75rem", color: "var(--text-2)" }}>Net Income (Earnings)</span>
          </div>
        </div>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="displayDate"
                tick={{ fill: "var(--text-3)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--text-3)", fontSize: 10 }}
                tickFormatter={fmtMoney}
                width={66}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--elevated)",
                  border: "1px solid var(--border-alt)",
                  borderRadius: 6,
                  color: "var(--text-1)",
                  fontSize: "0.75rem",
                }}
                formatter={(v, n) => [fmtMoney(v), n === "revenue" ? "Revenue" : "Net Income"]}
              />
              <Bar dataKey="revenue" fill="var(--blue)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="earnings" fill="var(--teal)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: 280, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--text-3)" }}>
            <div>No financial statement data available</div>
            <div style={{ fontSize: "0.75rem" }}>This may be a bond ETF, index, or non-reporting security</div>
          </div>
        )}
      </div>

      {/* EPS Trend Line (if we have eps data) */}
      {chartData.length > 0 && chartData.some(d => d.eps != null) && (
        <div className="t-card t-card-p">
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "0.875rem" }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: "var(--gold)" }} />
            <span style={{ fontSize: "0.75rem", color: "var(--text-2)" }}>Earnings Per Share (EPS)</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="displayDate" tick={{ fill: "var(--text-3)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: "var(--text-3)", fontSize: 10 }}
                tickFormatter={(v) => `$${v.toFixed(2)}`}
                width={52}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ background: "var(--elevated)", border: "1px solid var(--border-alt)", borderRadius: 6, color: "var(--text-1)", fontSize: "0.75rem" }}
                formatter={(v) => [`$${Number(v).toFixed(2)}`, "EPS"]}
              />
              <Line type="monotone" dataKey="eps" stroke="var(--gold)" strokeWidth={2} dot={{ fill: "var(--gold)", r: 4 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Data Table */}
      {chartData.length > 0 && (
        <div className="t-card" style={{ overflowX: "auto" }}>
          <table className="t-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Revenue</th>
                <th>Net Income (Earnings)</th>
                <th>Net Margin</th>
                <th>EPS</th>
              </tr>
            </thead>
            <tbody>
              {[...chartData].reverse().map((row, i) => {
                const margin = (row.revenue && row.earnings != null)
                  ? ((row.earnings / row.revenue) * 100).toFixed(1) : null;
                return (
                  <tr key={i}>
                    <td className="t-mono" style={{ color: "var(--text-2)" }}>
                      {row.displayDate || row.date || "—"}
                    </td>
                    <td className="t-mono">{fmtMoney(row.revenue)}</td>
                    <td className="t-mono" style={{ color: (row.earnings ?? 0) >= 0 ? "var(--up)" : "var(--down)" }}>
                      {fmtMoney(row.earnings)}
                    </td>
                    <td className="t-mono" style={{ color: margin != null && Number(margin) >= 0 ? "var(--up)" : "var(--down)" }}>
                      {margin != null ? `${margin}%` : "—"}
                    </td>
                    <td className="t-mono">
                      {row.eps != null ? `$${Number(row.eps).toFixed(2)}` : "—"}
                    </td>
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

/* ── Analysis Tab ───────────────────────────────────────────────── */
function AnalysisTab({ data }) {
  const price = data.current_price ?? data.price ?? 0;
  const target = data.one_year_target ?? data.analyst_target;
  const low52 = data.fifty_two_week_low ?? data.week_52_low ?? 0;
  const high52 = data.fifty_two_week_high ?? data.week_52_high ?? price * 1.2;
  const targetPrice = target ?? high52;

  const rangeMin = Math.min(low52, price * 0.9);
  const rangeMax = Math.max(targetPrice, price * 1.1);
  const range = rangeMax - rangeMin || 1;

  const pctPos = ((price - rangeMin) / range) * 100;
  const pctTarget = ((targetPrice - rangeMin) / range) * 100;

  const ratios = [
    { label: "P/E Ratio", value: data.pe_ratio != null ? fmt(data.pe_ratio, 1) : "—" },
    { label: "Forward P/E", value: data.forward_pe != null ? fmt(data.forward_pe, 1) : "—" },
    { label: "PEG Ratio", value: data.peg_ratio != null ? fmt(data.peg_ratio, 2) : "—" },
    { label: "P/S Ratio", value: data.price_to_sales != null ? fmt(data.price_to_sales, 2) : "—" },
    { label: "P/B Ratio", value: data.price_to_book != null ? fmt(data.price_to_book, 2) : "—" },
    { label: "EV/EBITDA", value: data.ev_to_ebitda != null ? fmt(data.ev_to_ebitda, 1) : "—" },
    { label: "ROE", value: data.return_on_equity != null ? `${fmt(data.return_on_equity, 1)}%` : "—" },
    { label: "Profit Margin", value: data.profit_margin != null ? `${fmt(data.profit_margin, 1)}%` : "—" },
  ];

  const upside = target && price ? (((target - price) / price) * 100).toFixed(1) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Analyst Price Target */}
      <div className="t-card t-card-gold t-card-p">
        <div className="t-label" style={{ marginBottom: 6 }}>ANALYST CONSENSUS PRICE TARGET</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", flexWrap: "wrap" }}>
          <span className="t-metric-xl grad-gold">
            {targetPrice ? formatPrice(targetPrice) : "N/A"}
          </span>
          {upside && (
            <span className={`t-badge ${Number(upside) >= 0 ? "t-badge-up" : "t-badge-down"}`} style={{ fontSize: "0.875rem" }}>
              {Number(upside) >= 0 ? "+" : ""}{upside}% UPSIDE
            </span>
          )}
        </div>

        {/* Price target visualization */}
        <div style={{ marginTop: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>52W LOW {formatPrice(low52)}</span>
            <span style={{ fontSize: "0.6875rem", color: "var(--gold)" }}>TARGET {formatPrice(targetPrice)}</span>
          </div>
          <div style={{ position: "relative", height: 6, background: "var(--elevated)", borderRadius: 3, overflow: "visible" }}>
            {/* Fill up to current price */}
            <div style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: `${Math.min(pctPos, 100)}%`,
              height: "100%",
              background: "linear-gradient(90deg, var(--down), var(--gold))",
              borderRadius: 3,
            }} />
            {/* Current price marker */}
            <div style={{
              position: "absolute",
              left: `${Math.min(pctPos, 100)}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 12,
              height: 12,
              background: "var(--gold)",
              borderRadius: "50%",
              border: "2px solid var(--bg)",
              zIndex: 2,
            }} />
            {/* Target marker */}
            <div style={{
              position: "absolute",
              left: `${Math.min(pctTarget, 100)}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 8,
              height: 8,
              background: "var(--up)",
              borderRadius: "50%",
              border: "2px solid var(--bg)",
              zIndex: 2,
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>{formatPrice(rangeMin)}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--gold)" }} />
              <span style={{ fontSize: "0.6875rem", color: "var(--text-2)" }}>Current {formatPrice(price)}</span>
            </div>
            <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>{formatPrice(rangeMax)}</span>
          </div>
        </div>
      </div>

      {/* Key Ratios */}
      <div>
        <div className="t-section-title" style={{ marginBottom: "0.75rem" }}>Key Ratios</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.625rem" }}>
          {ratios.map((r) => (
            <MetricCard key={r.label} label={r.label} value={r.value} />
          ))}
        </div>
      </div>

      {/* Sector & Industry */}
      <div className="t-card t-card-p">
        <div className="t-section-title" style={{ marginBottom: "0.875rem" }}>Sector & Classification</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
          <div>
            <div className="t-label" style={{ marginBottom: 4 }}>SECTOR</div>
            <span className="t-badge t-badge-blue" style={{ fontSize: "0.8125rem", padding: "4px 10px" }}>
              {data.sector || "—"}
            </span>
          </div>
          <div>
            <div className="t-label" style={{ marginBottom: 4 }}>INDUSTRY</div>
            <span className="t-badge t-badge-neutral" style={{ fontSize: "0.8125rem", padding: "4px 10px" }}>
              {data.industry || "—"}
            </span>
          </div>
          {data.country && (
            <div>
              <div className="t-label" style={{ marginBottom: 4 }}>COUNTRY</div>
              <span style={{ fontSize: "0.8125rem", color: "var(--text-2)" }}>{data.country}</span>
            </div>
          )}
          {data.employees && (
            <div>
              <div className="t-label" style={{ marginBottom: 4 }}>EMPLOYEES</div>
              <span className="t-mono" style={{ fontSize: "0.8125rem", color: "var(--text-1)" }}>
                {Number(data.employees).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────── */
export default function Terminal() {
  const [inputValue, setInputValue] = useState("");
  const [ticker, setTicker] = useState("");
  const [activeTab, setActiveTab] = useState("OVERVIEW");
  const inputRef = useRef(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["stock", ticker],
    queryFn: () => fetchStock(ticker),
    enabled: !!ticker,
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
                <MonitorDot size={14} style={{ color: "var(--gold)" }} />
              </div>
              <h1 className="t-page-title" style={{ margin: 0 }}>EQUITY RESEARCH TERMINAL</h1>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.65, maxWidth: 560, margin: "0 0 1rem" }}>
              The full Bloomberg-style market terminal. Deep-dive any stock with live price data, interactive charts, key financials, and technical indicators.
            </p>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              {["Live Quotes", "Interactive Charts", "Technical Indicators", "Earnings Data"].map((label) => (
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
              { icon: Search, label: "Stock Lookup", sub: "Any ticker, instant data", color: "#3b82f6" },
              { icon: TrendingUp, label: "Live Charts", sub: "Interactive price history", color: "var(--gold)" },
              { icon: Layers, label: "Options Flow", sub: "Calls, puts & open interest", color: "var(--teal)" },
              { icon: BarChart2, label: "Technical Analysis", sub: "RSI, MACD, Bollinger & more", color: "#f59e0b" },
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

      {/* Search Bar */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "0.625rem",
          marginBottom: "1.25rem",
          maxWidth: 640,
          margin: "0 auto 1.25rem",
        }}
      >
        <div style={{ position: "relative", flex: 1 }}>
          <Search
            size={15}
            style={{
              position: "absolute",
              left: "0.875rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-3)",
              pointerEvents: "none",
            }}
          />
          <input
            ref={inputRef}
            className="t-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.toUpperCase())}
            placeholder="Enter ticker symbol  —  e.g. AAPL, TSLA, NVDA, JPM"
            style={{ paddingLeft: "2.5rem", fontSize: "0.9375rem", height: 42 }}
          />
        </div>
        <button
          type="submit"
          className="t-btn t-btn-gold"
          style={{ padding: "0 1.25rem", height: 42, fontWeight: 700, letterSpacing: "0.05em" }}
        >
          SEARCH
        </button>
      </form>

      {/* No ticker selected */}
      {!ticker && (
        <div className="t-fade-up" style={{ textAlign: "center" }}>
          <p style={{ color: "var(--text-3)", fontSize: "0.8125rem", marginBottom: "1rem" }}>
            Select a ticker to begin institutional-grade equity research
          </p>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
            {RECENT.map((t) => (
              <button
                key={t}
                onClick={() => handleTickerClick(t)}
                className="t-btn t-btn-sm t-card-hover"
                style={{ fontFamily: "var(--font-mono, monospace)", fontWeight: 700, letterSpacing: "0.04em" }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {ticker && isLoading && <LoadingSkeleton />}

      {/* Error */}
      {ticker && isError && (
        <div className="t-card t-card-p" style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{ color: "var(--down)", fontSize: "0.875rem", marginBottom: 8 }}>
            Failed to load data for {ticker}
          </div>
          <div style={{ color: "var(--text-3)", fontSize: "0.8125rem" }}>
            Please check the ticker symbol and try again.
          </div>
        </div>
      )}

      {/* Data loaded */}
      {ticker && !isLoading && stockData && !isError && (
        <div className="t-fade-up">
          {/* Company header */}
          <div className="t-card" style={{ padding: "1rem 1.25rem", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
                  <span className="t-mono" style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--gold)" }}>
                    {stockData.ticker ?? ticker}
                  </span>
                  <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-1)" }}>
                    {stockData.company_name ?? stockData.name ?? ""}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: 4, flexWrap: "wrap" }}>
                  {stockData.exchange && (
                    <span className="t-badge t-badge-neutral">{stockData.exchange}</span>
                  )}
                  {stockData.sector && (
                    <span className="t-badge t-badge-blue">{stockData.sector}</span>
                  )}
                  {stockData.industry && (
                    <span style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>{stockData.industry}</span>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div>
                  <div className="t-label" style={{ textAlign: "right" }}>LAST PRICE</div>
                  <div className="t-mono t-metric-lg" style={{ color: "var(--gold)" }}>
                    {formatPrice(stockData.current_price ?? stockData.price)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="t-tabs" style={{ marginBottom: "1.25rem" }}>
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`t-tab ${activeTab === tab ? "active" : ""}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "OVERVIEW" && <OverviewTab data={stockData} />}
          {activeTab === "CHART" && <ChartTab data={stockData} />}
          {activeTab === "FINANCIALS" && <FinancialsTab data={stockData} />}
          {activeTab === "ANALYSIS" && <AnalysisTab data={stockData} />}
        </div>
      )}
    </div>
  );
}
