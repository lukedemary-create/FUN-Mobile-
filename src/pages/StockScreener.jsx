import React, { useState, useMemo } from "react";
import {
  SlidersHorizontal, TrendingUp, TrendingDown, BarChart2,
  Search, X, ChevronUp, ChevronDown, Filter, Activity,
} from "lucide-react";

/* ─── Helpers ──────────────────────────────────────────────────────── */
function fmtPrice(v) {
  return v != null
    ? `$${Number(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "—";
}
function fmtBig(v) {
  if (v == null) return "—";
  const n = Number(v);
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${n}`;
}
function fmtVol(v) {
  if (v == null) return "—";
  const n = Number(v);
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return `${n}`;
}
function fmtPct(v) {
  if (v == null) return "—";
  const n = Number(v);
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}
function fmtPE(v) {
  if (v == null || v < 0) return v < 0 ? "NEG" : "—";
  return v.toFixed(1) + "x";
}
function fmtDiv(v) {
  if (v == null || v === 0) return "—";
  return v.toFixed(2) + "%";
}

/* ─── Hardcoded stock data ─────────────────────────────────────────── */
const ALL_STOCKS = [
  { ticker: "AAPL",  name: "Apple Inc.",                    sector: "Technology",    price: 189.84, cap: 2.94e12, pe: 31.2, div: 0.51, w52: 22.4,  vol: 58_200_000 },
  { ticker: "MSFT",  name: "Microsoft Corp.",               sector: "Technology",    price: 415.32, cap: 3.08e12, pe: 35.8, div: 0.72, w52: 17.9,  vol: 21_900_000 },
  { ticker: "GOOGL", name: "Alphabet Inc.",                 sector: "Technology",    price: 175.98, cap: 2.19e12, pe: 24.7, div: 0.0,  w52: 33.1,  vol: 25_400_000 },
  { ticker: "AMZN",  name: "Amazon.com Inc.",               sector: "Consumer",      price: 198.12, cap: 2.08e12, pe: 44.6, div: 0.0,  w52: 51.2,  vol: 39_700_000 },
  { ticker: "META",  name: "Meta Platforms Inc.",           sector: "Technology",    price: 519.73, cap: 1.32e12, pe: 27.1, div: 0.40, w52: 62.4,  vol: 16_800_000 },
  { ticker: "NVDA",  name: "NVIDIA Corp.",                  sector: "Technology",    price: 875.40, cap: 2.16e12, pe: 65.3, div: 0.03, w52: 198.7, vol: 41_200_000 },
  { ticker: "TSLA",  name: "Tesla Inc.",                    sector: "Consumer",      price: 177.86, cap: 567e9,   pe: 47.2, div: 0.0,  w52: -28.4, vol: 94_500_000 },
  { ticker: "BRK.B", name: "Berkshire Hathaway B",          sector: "Financials",    price: 403.85, cap: 879e9,   pe: 21.4, div: 0.0,  w52: 18.7,  vol: 4_100_000 },
  { ticker: "JPM",   name: "JPMorgan Chase & Co.",          sector: "Financials",    price: 198.47, cap: 570e9,   pe: 12.3, div: 2.18, w52: 31.4,  vol: 9_800_000 },
  { ticker: "JNJ",   name: "Johnson & Johnson",             sector: "Healthcare",    price: 152.63, cap: 367e9,   pe: 14.8, div: 3.22, w52: -8.2,  vol: 7_200_000 },
  { ticker: "V",     name: "Visa Inc.",                     sector: "Financials",    price: 278.91, cap: 564e9,   pe: 30.7, div: 0.81, w52: 12.6,  vol: 5_900_000 },
  { ticker: "MA",    name: "Mastercard Inc.",               sector: "Financials",    price: 488.22, cap: 451e9,   pe: 36.2, div: 0.63, w52: 19.1,  vol: 3_400_000 },
  { ticker: "UNH",   name: "UnitedHealth Group Inc.",       sector: "Healthcare",    price: 493.18, cap: 454e9,   pe: 22.1, div: 1.56, w52: -14.3, vol: 3_700_000 },
  { ticker: "XOM",   name: "Exxon Mobil Corp.",             sector: "Energy",        price: 113.47, cap: 449e9,   pe: 13.6, div: 3.52, w52: 6.8,   vol: 14_200_000 },
  { ticker: "CVX",   name: "Chevron Corp.",                 sector: "Energy",        price: 153.72, cap: 281e9,   pe: 14.2, div: 4.21, w52: -1.4,  vol: 8_600_000 },
  { ticker: "WMT",   name: "Walmart Inc.",                  sector: "Consumer",      price: 68.54,  cap: 551e9,   pe: 29.8, div: 1.22, w52: 47.3,  vol: 12_800_000 },
  { ticker: "HD",    name: "Home Depot Inc.",               sector: "Consumer",      price: 355.18, cap: 352e9,   pe: 23.9, div: 2.51, w52: 8.4,   vol: 3_900_000 },
  { ticker: "BAC",   name: "Bank of America Corp.",         sector: "Financials",    price: 38.72,  cap: 304e9,   pe: 13.1, div: 2.37, w52: 22.9,  vol: 32_100_000 },
  { ticker: "PG",    name: "Procter & Gamble Co.",          sector: "Consumer",      price: 162.43, cap: 382e9,   pe: 27.4, div: 2.41, w52: 4.2,   vol: 6_300_000 },
  { ticker: "KO",    name: "Coca-Cola Co.",                 sector: "Consumer",      price: 62.18,  cap: 268e9,   pe: 24.3, div: 3.07, w52: 7.6,   vol: 12_100_000 },
  { ticker: "PEP",   name: "PepsiCo Inc.",                  sector: "Consumer",      price: 163.87, cap: 225e9,   pe: 22.8, div: 3.31, w52: -9.7,  vol: 5_700_000 },
  { ticker: "ABBV",  name: "AbbVie Inc.",                   sector: "Healthcare",    price: 178.29, cap: 314e9,   pe: 54.6, div: 3.58, w52: 11.4,  vol: 8_100_000 },
  { ticker: "MRK",   name: "Merck & Co. Inc.",              sector: "Healthcare",    price: 127.54, cap: 322e9,   pe: 16.3, div: 2.74, w52: -10.8, vol: 9_400_000 },
  { ticker: "TMO",   name: "Thermo Fisher Scientific",      sector: "Healthcare",    price: 554.17, cap: 213e9,   pe: 29.8, div: 0.31, w52: -14.2, vol: 1_800_000 },
  { ticker: "COST",  name: "Costco Wholesale Corp.",        sector: "Consumer",      price: 881.43, cap: 391e9,   pe: 52.7, div: 0.54, w52: 36.8,  vol: 2_200_000 },
  { ticker: "AVGO",  name: "Broadcom Inc.",                 sector: "Technology",    price: 1432.67, cap: 674e9,  pe: 30.4, div: 1.52, w52: 74.8,  vol: 4_600_000 },
  { ticker: "CSCO",  name: "Cisco Systems Inc.",            sector: "Technology",    price: 48.21,  cap: 196e9,   pe: 15.7, div: 3.26, w52: -4.1,  vol: 17_400_000 },
  { ticker: "ACN",   name: "Accenture plc",                 sector: "Technology",    price: 318.54, cap: 199e9,   pe: 27.3, div: 1.79, w52: -12.4, vol: 2_800_000 },
  { ticker: "LLY",   name: "Eli Lilly and Co.",             sector: "Healthcare",    price: 798.34, cap: 757e9,   pe: 95.4, div: 0.63, w52: 41.2,  vol: 3_300_000 },
  { ticker: "MCD",   name: "McDonald's Corp.",              sector: "Consumer",      price: 289.54, cap: 207e9,   pe: 23.6, div: 2.38, w52: -2.7,  vol: 3_100_000 },
  { ticker: "ABT",   name: "Abbott Laboratories",           sector: "Healthcare",    price: 112.38, cap: 194e9,   pe: 33.2, div: 1.91, w52: 5.7,   vol: 5_800_000 },
  { ticker: "DHR",   name: "Danaher Corp.",                 sector: "Healthcare",    price: 228.71, cap: 165e9,   pe: 40.6, div: 0.43, w52: -16.3, vol: 3_500_000 },
  { ticker: "TXN",   name: "Texas Instruments Inc.",        sector: "Technology",    price: 184.23, cap: 168e9,   pe: 34.7, div: 2.78, w52: 8.2,   vol: 5_300_000 },
  { ticker: "NEE",   name: "NextEra Energy Inc.",           sector: "Utilities",     price: 72.48,  cap: 148e9,   pe: 19.3, div: 2.81, w52: 14.6,  vol: 9_700_000 },
  { ticker: "AMT",   name: "American Tower Corp.",          sector: "Real Estate",   price: 198.64, cap: 92e9,    pe: 42.1, div: 2.98, w52: 12.4,  vol: 2_400_000 },
  { ticker: "LOW",   name: "Lowe's Companies Inc.",         sector: "Consumer",      price: 231.47, cap: 136e9,   pe: 19.4, div: 1.91, w52: 13.7,  vol: 4_200_000 },
  { ticker: "SCHW",  name: "Charles Schwab Corp.",          sector: "Financials",    price: 74.63,  cap: 134e9,   pe: 28.4, div: 1.34, w52: 17.3,  vol: 7_800_000 },
  { ticker: "INTC",  name: "Intel Corp.",                   sector: "Technology",    price: 30.47,  cap: 129e9,   pe: -1,   div: 1.31, w52: -42.1, vol: 38_700_000 },
  { ticker: "IBM",   name: "International Business Machines", sector: "Technology", price: 186.72, cap: 170e9,   pe: 21.6, div: 3.27, w52: 31.8,  vol: 4_900_000 },
  { ticker: "GE",    name: "GE Aerospace",                  sector: "Industrials",   price: 168.43, cap: 183e9,   pe: 30.8, div: 0.32, w52: 78.2,  vol: 6_100_000 },
];

/* ─── Market Snapshot data ─────────────────────────────────────────── */
const MARKET_SNAPSHOT = [
  { ticker: "SPY",  price: 521.84, change: 2.34, changePct: 0.45 },
  { ticker: "QQQ",  price: 444.72, change: 3.11, changePct: 0.70 },
  { ticker: "DIA",  price: 391.28, change: -1.08, changePct: -0.28 },
  { ticker: "VIX",  price: 14.32,  change: -0.41, changePct: -2.78 },
];

/* ─── Sector color map ─────────────────────────────────────────────── */
const SECTOR_COLORS = {
  Technology:   { bg: "rgba(26,159,216,0.10)",  color: "var(--blue)" },
  Healthcare:   { bg: "rgba(0,184,153,0.10)",   color: "var(--teal)" },
  Financials:   { bg: "rgba(201,169,110,0.10)",  color: "var(--gold)" },
  Consumer:     { bg: "rgba(124,92,191,0.10)",  color: "var(--purple)" },
  Energy:       { bg: "rgba(255,59,92,0.10)",   color: "var(--down)" },
  Industrials:  { bg: "rgba(6,214,240,0.10)",   color: "var(--cyan)" },
  "Real Estate":{ bg: "rgba(201,169,110,0.08)",  color: "#e8a94c" },
  Utilities:    { bg: "rgba(0,184,153,0.08)",   color: "#4cc9b8" },
};

/* ─── Filter definitions ───────────────────────────────────────────── */
const SECTORS = ["All", "Technology", "Healthcare", "Financials", "Consumer", "Energy", "Industrials", "Real Estate", "Utilities"];
const MARKET_CAPS = [
  { label: "All", key: "all" },
  { label: "Mega (>$200B)", key: "mega" },
  { label: "Large ($10–200B)", key: "large" },
  { label: "Mid ($2–10B)", key: "mid" },
  { label: "Small (<$2B)", key: "small" },
];
const PE_RANGES = [
  { label: "Any", key: "any" },
  { label: "Under 15", key: "u15" },
  { label: "15–25", key: "15-25" },
  { label: "25–40", key: "25-40" },
  { label: "Over 40", key: "o40" },
  { label: "Negative", key: "neg" },
];
const DIV_YIELDS = [
  { label: "Any", key: "any" },
  { label: "1%+", key: "1p" },
  { label: "2%+", key: "2p" },
  { label: "3%+", key: "3p" },
  { label: "5%+", key: "5p" },
];
const W52_PERF = [
  { label: "Any", key: "any" },
  { label: "Up >20%", key: "up20" },
  { label: "Up 0–20%", key: "up0" },
  { label: "Down 0–20%", key: "dn0" },
  { label: "Down >20%", key: "dn20" },
];
const SORT_OPTIONS = [
  { label: "Market Cap", key: "cap" },
  { label: "P/E Ratio", key: "pe" },
  { label: "Dividend Yield", key: "div" },
  { label: "52W Change", key: "w52" },
  { label: "Volume", key: "vol" },
];

/* ─── Filter logic ─────────────────────────────────────────────────── */
function applyFilters(stocks, filters) {
  return stocks.filter((s) => {
    // Sector
    if (filters.sector !== "All" && s.sector !== filters.sector) return false;

    // Market Cap
    if (filters.cap !== "all") {
      if (filters.cap === "mega"  && s.cap <= 200e9)  return false;
      if (filters.cap === "large" && (s.cap <= 10e9 || s.cap > 200e9)) return false;
      if (filters.cap === "mid"   && (s.cap <= 2e9  || s.cap > 10e9))  return false;
      if (filters.cap === "small" && s.cap >= 2e9)   return false;
    }

    // P/E
    if (filters.pe !== "any") {
      if (filters.pe === "u15"   && (s.pe < 0 || s.pe >= 15))  return false;
      if (filters.pe === "15-25" && (s.pe < 15 || s.pe >= 25)) return false;
      if (filters.pe === "25-40" && (s.pe < 25 || s.pe >= 40)) return false;
      if (filters.pe === "o40"   && (s.pe < 0 || s.pe <= 40))  return false;
      if (filters.pe === "neg"   && s.pe >= 0)                  return false;
    }

    // Dividend Yield
    if (filters.div !== "any") {
      if (filters.div === "1p" && s.div < 1) return false;
      if (filters.div === "2p" && s.div < 2) return false;
      if (filters.div === "3p" && s.div < 3) return false;
      if (filters.div === "5p" && s.div < 5) return false;
    }

    // 52W Performance
    if (filters.w52 !== "any") {
      if (filters.w52 === "up20" && s.w52 <= 20)  return false;
      if (filters.w52 === "up0"  && (s.w52 < 0 || s.w52 > 20)) return false;
      if (filters.w52 === "dn0"  && (s.w52 < -20 || s.w52 >= 0)) return false;
      if (filters.w52 === "dn20" && s.w52 >= -20)  return false;
    }

    return true;
  });
}

function applySortAndSearch(stocks, sortKey, sortDir, search) {
  let result = [...stocks];

  if (search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(
      (s) => s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    );
  }

  result.sort((a, b) => {
    let av, bv;
    if (sortKey === "cap")  { av = a.cap;  bv = b.cap; }
    if (sortKey === "pe")   { av = a.pe < 0 ? Infinity : a.pe; bv = b.pe < 0 ? Infinity : b.pe; }
    if (sortKey === "div")  { av = a.div;  bv = b.div; }
    if (sortKey === "w52")  { av = a.w52;  bv = b.w52; }
    if (sortKey === "vol")  { av = a.vol;  bv = b.vol; }
    if (av == null) return 1;
    if (bv == null) return -1;
    return sortDir === "desc" ? bv - av : av - bv;
  });

  return result;
}

/* ─── FilterSelect pill row ────────────────────────────────────────── */
function FilterRow({ label, options, value, onChange }) {
  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <div className="t-label" style={{ marginBottom: "0.375rem" }}>{label}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
        {options.map((opt) => {
          const key = typeof opt === "string" ? opt : opt.key;
          const lbl = typeof opt === "string" ? opt : opt.label;
          const active = value === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              style={{
                padding: "3px 10px",
                borderRadius: 99,
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.02em",
                border: active ? "1px solid rgba(201,169,110,0.5)" : "1px solid var(--border-c)",
                background: active ? "rgba(201,169,110,0.13)" : "var(--elevated)",
                color: active ? "var(--gold)" : "var(--text-2)",
                cursor: "pointer",
                transition: "all 0.12s",
                whiteSpace: "nowrap",
              }}
            >
              {lbl}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Active filter chip ────────────────────────────────────────────── */
function FilterChip({ label, onRemove }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 8px 3px 10px",
      borderRadius: 99,
      fontSize: "0.6875rem", fontWeight: 700,
      background: "rgba(201,169,110,0.10)",
      border: "1px solid rgba(201,169,110,0.25)",
      color: "var(--gold)",
    }}>
      {label}
      <button
        onClick={onRemove}
        style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", padding: 0,
          color: "var(--gold)", opacity: 0.7,
        }}
      >
        <X size={10} />
      </button>
    </span>
  );
}

/* ─── Sortable column header ────────────────────────────────────────── */
function SortTh({ label, sortKey, activeSort, direction, onSort, style }) {
  const active = activeSort === sortKey;
  return (
    <th
      onClick={() => onSort(sortKey)}
      style={{
        cursor: "pointer",
        userSelect: "none",
        padding: "0.5rem 0.875rem",
        ...style,
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
        {label}
        <span style={{ opacity: active ? 1 : 0.3 }}>
          {active && direction === "asc" ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
        </span>
      </span>
    </th>
  );
}

/* ─── Main component ───────────────────────────────────────────────── */
export default function StockScreener() {
  const [sector, setSector]   = useState("All");
  const [cap, setCap]         = useState("all");
  const [pe, setPe]           = useState("any");
  const [div, setDiv]         = useState("any");
  const [w52, setW52]         = useState("any");
  const [sortKey, setSortKey] = useState("cap");
  const [sortDir, setSortDir] = useState("desc");
  const [search, setSearch]   = useState("");

  /* ── Active filter chips ── */
  const activeFilters = useMemo(() => {
    const chips = [];
    if (sector !== "All")  chips.push({ key: "sector", label: `Sector: ${sector}`,    reset: () => setSector("All") });
    if (cap !== "all")     chips.push({ key: "cap",    label: `Cap: ${MARKET_CAPS.find(o=>o.key===cap)?.label}`, reset: () => setCap("all") });
    if (pe !== "any")      chips.push({ key: "pe",     label: `P/E: ${PE_RANGES.find(o=>o.key===pe)?.label}`,   reset: () => setPe("any") });
    if (div !== "any")     chips.push({ key: "div",    label: `Yield: ${DIV_YIELDS.find(o=>o.key===div)?.label}`, reset: () => setDiv("any") });
    if (w52 !== "any")     chips.push({ key: "w52",    label: `52W: ${W52_PERF.find(o=>o.key===w52)?.label}`,   reset: () => setW52("any") });
    return chips;
  }, [sector, cap, pe, div, w52]);

  function resetAll() {
    setSector("All"); setCap("all"); setPe("any"); setDiv("any"); setW52("any"); setSearch("");
  }

  function handleSort(key) {
    if (sortKey === key) setSortDir((d) => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  const filtered = useMemo(() => {
    const base = applyFilters(ALL_STOCKS, { sector, cap, pe, div, w52 });
    return applySortAndSearch(base, sortKey, sortDir, search);
  }, [sector, cap, pe, div, w52, sortKey, sortDir, search]);

  return (
    <div style={{ maxWidth: 1400 }}>

      {/* ─── Hero Banner ─────────────────────────────────────────────── */}
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
        {/* decorative glow */}
        <div style={{
          position: "absolute", top: -60, right: -40,
          width: 340, height: 340,
          background: "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "absolute", bottom: -80, left: "30%",
          width: 280, height: 280,
          background: "radial-gradient(circle, rgba(0,184,153,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "2rem", position: "relative" }}>
          {/* left: title + subtitle */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.625rem" }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <SlidersHorizontal size={14} style={{ color: "var(--gold)" }} />
              </div>
              <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: "var(--text-1)", letterSpacing: "-0.01em", fontFamily: "'Inter', system-ui, sans-serif" }}>
                STOCK{" "}
                <em style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", color: "var(--gold)", fontWeight: 400, fontSize: "1.5rem" }}>Screener</em>
              </h1>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.65, maxWidth: 560, margin: "0 0 1rem" }}>
              Filter and rank stocks by fundamentals. Screen across sectors, market caps, valuations, dividend yields, and 52-week price performance to surface opportunities matching your criteria.
            </p>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              {["Fundamental Screens", "Sector Filters", "Valuation Metrics", "Dividend Yield"].map((tag) => (
                <span key={tag} style={{
                  fontSize: "0.6875rem", fontWeight: 700, padding: "3px 10px",
                  borderRadius: 99, letterSpacing: "0.04em",
                  background: "rgba(201,169,110,0.10)",
                  border: "1px solid rgba(201,169,110,0.25)",
                  color: "var(--gold)",
                }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* right: 4 stat callout boxes */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", flexShrink: 0 }}>
            {[
              { icon: BarChart2,   label: "40 Stocks",          sub: "S&P 500 constituents",    color: "var(--gold)" },
              { icon: SlidersHorizontal, label: "6 Filters",   sub: "Combine for precision",   color: "var(--blue)" },
              { icon: Activity,    label: "Live Sorting",        sub: "By any metric",           color: "var(--teal)" },
              { icon: TrendingUp,  label: "52W Performance",     sub: "Yearly price momentum",   color: "#f59e0b" },
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

      {/* ─── Market Snapshot Bar ─────────────────────────────────────── */}
      <div className="t-card" style={{ marginBottom: "1rem", padding: "0.625rem 1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          <span className="t-label" style={{ flexShrink: 0 }}>Market Snapshot</span>
          <div style={{ width: 1, height: 18, background: "var(--border-c)", flexShrink: 0 }} />
          {MARKET_SNAPSHOT.map((m) => {
            const isUp = m.changePct >= 0;
            return (
              <div key={m.ticker} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-2)" }}>{m.ticker}</span>
                <span className="t-mono" style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-1)" }}>
                  {fmtPrice(m.price)}
                </span>
                <span className="t-mono" style={{
                  fontSize: "0.6875rem", fontWeight: 700,
                  color: isUp ? "var(--up)" : "var(--down)",
                }}>
                  {isUp ? "+" : ""}{m.change.toFixed(2)} ({fmtPct(m.changePct)})
                </span>
              </div>
            );
          })}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
            <div className="t-live" />
            <span className="t-label">Market Open</span>
          </div>
        </div>
      </div>

      {/* ─── Main layout: Filter Panel + Results ─────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "1rem", alignItems: "start" }}>

        {/* ── Left: Filter Panel ───────────────────────────────────── */}
        <div className="t-card t-card-p" style={{ position: "sticky", top: "calc(var(--topbar-h) + 1rem)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-1)", display: "flex", alignItems: "center", gap: 6 }}>
              <Filter size={13} style={{ color: "var(--gold)" }} />
              Filters
            </span>
            {activeFilters.length > 0 && (
              <button
                onClick={resetAll}
                style={{
                  fontSize: "0.6875rem", fontWeight: 700, color: "var(--text-3)",
                  background: "none", border: "none", cursor: "pointer", padding: 0,
                  letterSpacing: "0.03em",
                }}
              >
                Reset All
              </button>
            )}
          </div>

          <FilterRow label="Sector"       options={SECTORS}     value={sector} onChange={setSector} />
          <FilterRow label="Market Cap"   options={MARKET_CAPS} value={cap}    onChange={setCap} />
          <FilterRow label="P/E Ratio"    options={PE_RANGES}   value={pe}     onChange={setPe} />
          <FilterRow label="Dividend Yield" options={DIV_YIELDS} value={div}   onChange={setDiv} />
          <FilterRow label="52W Performance" options={W52_PERF} value={w52}    onChange={setW52} />

          <div className="t-divider" style={{ margin: "1rem 0" }} />

          <div className="t-label" style={{ marginBottom: "0.375rem" }}>Sort By</div>
          {SORT_OPTIONS.map((opt) => {
            const active = sortKey === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => handleSort(opt.key)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%", padding: "0.375rem 0.625rem",
                  borderRadius: 5, border: "1px solid transparent",
                  background: active ? "rgba(201,169,110,0.10)" : "transparent",
                  borderColor: active ? "rgba(201,169,110,0.22)" : "transparent",
                  color: active ? "var(--gold)" : "var(--text-2)",
                  cursor: "pointer", fontSize: "0.8125rem", fontWeight: active ? 700 : 500,
                  transition: "all 0.12s", marginBottom: 2,
                }}
              >
                {opt.label}
                {active && (
                  sortDir === "desc" ? <ChevronDown size={12} /> : <ChevronUp size={12} />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Right: Results ───────────────────────────────────────── */}
        <div>
          {/* Search bar + chips + count */}
          <div style={{ marginBottom: "0.75rem" }}>
            {/* Search */}
            <div style={{ position: "relative", marginBottom: "0.625rem" }}>
              <Search size={13} style={{
                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                color: "var(--text-3)", pointerEvents: "none",
              }} />
              <input
                className="t-input"
                type="text"
                placeholder="Search ticker or company name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 34 }}
              />
            </div>

            {/* Active chips + count */}
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.375rem" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-3)", fontWeight: 600, marginRight: 4 }}>
                Showing <span style={{ color: "var(--text-1)", fontWeight: 700 }}>{filtered.length}</span> of {ALL_STOCKS.length} stocks
              </span>
              {activeFilters.map((f) => (
                <FilterChip key={f.key} label={f.label} onRemove={f.reset} />
              ))}
            </div>
          </div>

          {/* Results table */}
          <div className="t-card" style={{ overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table className="t-table" style={{ minWidth: 860 }}>
                <thead>
                  <tr>
                    <th style={{ padding: "0.5rem 0.875rem", width: 70 }}>Ticker</th>
                    <th style={{ padding: "0.5rem 0.875rem" }}>Company</th>
                    <th style={{ padding: "0.5rem 0.875rem" }}>Sector</th>
                    <th style={{ padding: "0.5rem 0.875rem", textAlign: "right" }}>Price</th>
                    <SortTh label="Mkt Cap"      sortKey="cap" activeSort={sortKey} direction={sortDir} onSort={handleSort} style={{ textAlign: "right" }} />
                    <SortTh label="P/E"           sortKey="pe"  activeSort={sortKey} direction={sortDir} onSort={handleSort} style={{ textAlign: "right" }} />
                    <SortTh label="Div Yield"     sortKey="div" activeSort={sortKey} direction={sortDir} onSort={handleSort} style={{ textAlign: "right" }} />
                    <SortTh label="52W Chg"       sortKey="w52" activeSort={sortKey} direction={sortDir} onSort={handleSort} style={{ textAlign: "right" }} />
                    <SortTh label="Volume"        sortKey="vol" activeSort={sortKey} direction={sortDir} onSort={handleSort} style={{ textAlign: "right" }} />
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: "center", padding: "3rem", color: "var(--text-3)" }}>
                        No stocks match the current filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((s) => {
                      const isUp52 = s.w52 >= 0;
                      const sc = SECTOR_COLORS[s.sector] || { bg: "rgba(122,136,153,0.10)", color: "var(--text-2)" };
                      const peNeg = s.pe < 0;
                      return (
                        <tr key={s.ticker}>
                          {/* Ticker */}
                          <td style={{ padding: "0.625rem 0.875rem" }}>
                            <span className="t-mono" style={{ fontWeight: 800, color: "var(--gold)", fontSize: "0.8125rem" }}>
                              {s.ticker}
                            </span>
                          </td>

                          {/* Name */}
                          <td style={{ padding: "0.625rem 0.875rem", maxWidth: 220 }}>
                            <span style={{ fontSize: "0.8125rem", color: "var(--text-1)", fontWeight: 500 }}>
                              {s.name}
                            </span>
                          </td>

                          {/* Sector badge */}
                          <td style={{ padding: "0.625rem 0.875rem" }}>
                            <span style={{
                              display: "inline-block",
                              padding: "2px 8px",
                              borderRadius: 99,
                              fontSize: "0.625rem",
                              fontWeight: 700,
                              letterSpacing: "0.03em",
                              background: sc.bg,
                              color: sc.color,
                              whiteSpace: "nowrap",
                            }}>
                              {s.sector}
                            </span>
                          </td>

                          {/* Price */}
                          <td style={{ padding: "0.625rem 0.875rem", textAlign: "right" }}>
                            <span className="t-mono" style={{ fontWeight: 600, fontSize: "0.8125rem" }}>
                              {fmtPrice(s.price)}
                            </span>
                          </td>

                          {/* Market Cap */}
                          <td style={{ padding: "0.625rem 0.875rem", textAlign: "right" }}>
                            <span className="t-mono" style={{ fontSize: "0.8125rem", color: "var(--text-2)" }}>
                              {fmtBig(s.cap)}
                            </span>
                          </td>

                          {/* P/E */}
                          <td style={{ padding: "0.625rem 0.875rem", textAlign: "right" }}>
                            <span className="t-mono" style={{
                              fontSize: "0.8125rem",
                              color: peNeg ? "var(--down)" : s.pe > 40 ? "var(--gold)" : "var(--text-2)",
                              fontWeight: peNeg ? 700 : 500,
                            }}>
                              {peNeg ? "NEG" : fmtPE(s.pe)}
                            </span>
                          </td>

                          {/* Dividend Yield */}
                          <td style={{ padding: "0.625rem 0.875rem", textAlign: "right" }}>
                            <span className="t-mono" style={{
                              fontSize: "0.8125rem",
                              color: s.div >= 3 ? "var(--teal)" : s.div > 0 ? "var(--text-2)" : "var(--text-3)",
                            }}>
                              {fmtDiv(s.div)}
                            </span>
                          </td>

                          {/* 52W Change */}
                          <td style={{ padding: "0.625rem 0.875rem", textAlign: "right" }}>
                            <span className="t-badge" style={{
                              background: isUp52 ? "var(--up-dim)"   : "var(--down-dim)",
                              color:      isUp52 ? "var(--up)"       : "var(--down)",
                              border:     isUp52 ? "1px solid rgba(0,184,153,0.2)" : "1px solid rgba(255,59,92,0.2)",
                            }}>
                              {isUp52 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                              {fmtPct(s.w52)}
                            </span>
                          </td>

                          {/* Volume */}
                          <td style={{ padding: "0.625rem 0.875rem", textAlign: "right" }}>
                            <span className="t-mono" style={{ fontSize: "0.8125rem", color: "var(--text-3)" }}>
                              {fmtVol(s.vol)}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            {filtered.length > 0 && (
              <div style={{
                padding: "0.625rem 1.25rem",
                borderTop: "1px solid var(--border-c)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                  {activeFilters.length > 0 ? ` — ${activeFilters.length} filter${activeFilters.length !== 1 ? "s" : ""} active` : ""}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>
                  Sorted by <span style={{ color: "var(--text-2)", fontWeight: 600 }}>
                    {SORT_OPTIONS.find(o => o.key === sortKey)?.label}
                  </span> ({sortDir === "desc" ? "high to low" : "low to high"})
                </span>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <p style={{ fontSize: "0.6875rem", color: "var(--text-3)", marginTop: "0.75rem", lineHeight: 1.6 }}>
            All data is illustrative and for educational purposes only. Prices, ratios, and yields shown are hardcoded approximations and do not reflect real-time market data. Not financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}
