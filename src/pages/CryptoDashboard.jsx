import React, { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  Coins, TrendingUp, TrendingDown, ChevronUp, ChevronDown,
  ChevronsUpDown, Activity, BarChart2, Flame, Zap,
} from "lucide-react";

/* ─── Helpers ───────────────────────────────────────────────────── */
function fmtPrice(n) {
  if (n >= 1000) return "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  if (n >= 1) return "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  return "$" + Number(n).toFixed(4);
}
function fmtLarge(n) {
  if (n >= 1e12) return "$" + (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9) return "$" + (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(1) + "M";
  return "$" + n.toLocaleString();
}
function fmtPct(n, showPlus = true) {
  const v = Number(n);
  if (showPlus && v >= 0) return "+" + v.toFixed(2) + "%";
  return v.toFixed(2) + "%";
}

/* ─── Hardcoded Data ─────────────────────────────────────────────── */
const COINS = [
  { rank: 1,  symbol: "BTC",   name: "Bitcoin",         price: 83200,   chg24: 1.24,  chg7d: -3.10, mcap: 1.635e12, vol24: 28.4e9,  dom: 52.4, color: "#F7931A" },
  { rank: 2,  symbol: "ETH",   name: "Ethereum",        price: 1910,    chg24: -2.14, chg7d: -5.80, mcap: 2.30e11,  vol24: 12.1e9,  dom: 11.0, color: "#627EEA" },
  { rank: 3,  symbol: "BNB",   name: "BNB",             price: 594,     chg24: 0.82,  chg7d: 1.40,  mcap: 8.64e10,  vol24: 1.8e9,   dom: 4.1,  color: "#F3BA2F" },
  { rank: 4,  symbol: "SOL",   name: "Solana",          price: 124,     chg24: -3.22, chg7d: -8.40, mcap: 6.40e10,  vol24: 4.2e9,   dom: 3.0,  color: "#9945FF" },
  { rank: 5,  symbol: "XRP",   name: "XRP",             price: 2.14,    chg24: 1.88,  chg7d: 4.20,  mcap: 1.23e11,  vol24: 5.8e9,   dom: 5.9,  color: "#346AA9" },
  { rank: 6,  symbol: "ADA",   name: "Cardano",         price: 0.71,    chg24: -1.05, chg7d: -2.90, mcap: 2.51e10,  vol24: 0.8e9,   dom: 1.2,  color: "#0033AD" },
  { rank: 7,  symbol: "AVAX",  name: "Avalanche",       price: 21.40,   chg24: -4.18, chg7d: -9.20, mcap: 8.82e9,   vol24: 0.6e9,   dom: 0.42, color: "#E84142" },
  { rank: 8,  symbol: "DOGE",  name: "Dogecoin",        price: 0.165,   chg24: 2.44,  chg7d: 6.80,  mcap: 2.41e10,  vol24: 1.4e9,   dom: 1.15, color: "#C2A633" },
  { rank: 9,  symbol: "DOT",   name: "Polkadot",        price: 6.82,    chg24: -1.72, chg7d: -4.10, mcap: 9.34e9,   vol24: 0.4e9,   dom: 0.44, color: "#E6007A" },
  { rank: 10, symbol: "LINK",  name: "Chainlink",       price: 12.40,   chg24: 0.54,  chg7d: -1.20, mcap: 7.71e9,   vol24: 0.5e9,   dom: 0.37, color: "#2A5ADA" },
  { rank: 11, symbol: "MATIC", name: "Polygon",         price: 0.48,    chg24: -2.88, chg7d: -7.60, mcap: 4.56e9,   vol24: 0.3e9,   dom: 0.22, color: "#8247E5" },
  { rank: 12, symbol: "UNI",   name: "Uniswap",         price: 7.20,    chg24: 1.12,  chg7d: 2.40,  mcap: 4.32e9,   vol24: 0.2e9,   dom: 0.21, color: "#FF007A" },
  { rank: 13, symbol: "LTC",   name: "Litecoin",        price: 82,      chg24: 0.33,  chg7d: 0.90,  mcap: 6.14e9,   vol24: 0.7e9,   dom: 0.29, color: "#BFBBBB" },
  { rank: 14, symbol: "ATOM",  name: "Cosmos",          price: 6.44,    chg24: -1.44, chg7d: -3.80, mcap: 2.52e9,   vol24: 0.15e9,  dom: 0.12, color: "#2E3148" },
  { rank: 15, symbol: "FIL",   name: "Filecoin",        price: 3.82,    chg24: -0.78, chg7d: -2.10, mcap: 1.98e9,   vol24: 0.12e9,  dom: 0.09, color: "#0090FF" },
  { rank: 16, symbol: "NEAR",  name: "NEAR Protocol",   price: 3.21,    chg24: 3.14,  chg7d: 7.50,  mcap: 3.51e9,   vol24: 0.22e9,  dom: 0.17, color: "#00C1DE" },
  { rank: 17, symbol: "APT",   name: "Aptos",           price: 5.44,    chg24: -2.01, chg7d: -5.30, mcap: 2.44e9,   vol24: 0.18e9,  dom: 0.12, color: "#29D5A4" },
  { rank: 18, symbol: "ARB",   name: "Arbitrum",        price: 0.52,    chg24: -3.44, chg7d: -8.90, mcap: 1.99e9,   vol24: 0.25e9,  dom: 0.09, color: "#28A0F0" },
  { rank: 19, symbol: "OP",    name: "Optimism",        price: 0.88,    chg24: -2.22, chg7d: -6.10, mcap: 1.15e9,   vol24: 0.14e9,  dom: 0.05, color: "#FF0420" },
  { rank: 20, symbol: "INJ",   name: "Injective",       price: 16.20,   chg24: 4.82,  chg7d: 10.40, mcap: 1.52e9,   vol24: 0.32e9,  dom: 0.07, color: "#00B2FF" },
];

const DOMINANCE_PIE = [
  { name: "BTC",    value: 52.4, color: "#F7931A" },
  { name: "ETH",    value: 11.0, color: "#627EEA" },
  { name: "BNB",    value: 4.1,  color: "#F3BA2F" },
  { name: "Others", value: 32.5, color: "var(--border-c)" },
];

const TRENDING = [
  { symbol: "INJ",  name: "Injective",   chg24: 4.82,  color: "#00B2FF" },
  { symbol: "NEAR", name: "NEAR",        chg24: 3.14,  color: "#00C1DE" },
  { symbol: "DOGE", name: "Dogecoin",    chg24: 2.44,  color: "#C2A633" },
  { symbol: "XRP",  name: "XRP",         chg24: 1.88,  color: "#346AA9" },
  { symbol: "UNI",  name: "Uniswap",     chg24: 1.12,  color: "#FF007A" },
];

const CATEGORY_PERF = [
  { sector: "AI Tokens", change: 6.82  },
  { sector: "Meme",      change: 3.14  },
  { sector: "DeFi",      change: -0.44 },
  { sector: "Layer 1",   change: -2.88 },
  { sector: "Layer 2",   change: -4.22 },
  { sector: "Gaming",    change: -5.10 },
  { sector: "NFT",       change: -7.84 },
];

// 30-day BTC price data (day, price)
const BTC_30D = [
  { day: "Mar 18", price: 84200 },
  { day: "Mar 19", price: 83900 },
  { day: "Mar 20", price: 85100 },
  { day: "Mar 21", price: 86400 },
  { day: "Mar 22", price: 85800 },
  { day: "Mar 23", price: 84700 },
  { day: "Mar 24", price: 83100 },
  { day: "Mar 25", price: 82400 },
  { day: "Mar 26", price: 81800 },
  { day: "Mar 27", price: 80200 },
  { day: "Mar 28", price: 79600 },
  { day: "Mar 29", price: 80900 },
  { day: "Mar 30", price: 82300 },
  { day: "Mar 31", price: 83700 },
  { day: "Apr 1",  price: 85200 },
  { day: "Apr 2",  price: 87100 },
  { day: "Apr 3",  price: 86400 },
  { day: "Apr 4",  price: 84800 },
  { day: "Apr 5",  price: 83200 },
  { day: "Apr 6",  price: 81400 },
  { day: "Apr 7",  price: 80000 },
  { day: "Apr 8",  price: 79100 },
  { day: "Apr 9",  price: 80600 },
  { day: "Apr 10", price: 82200 },
  { day: "Apr 11", price: 83800 },
  { day: "Apr 12", price: 82600 },
  { day: "Apr 13", price: 81900 },
  { day: "Apr 14", price: 82500 },
  { day: "Apr 15", price: 83400 },
  { day: "Apr 16", price: 83200 },
];

/* ─── Sub-components ─────────────────────────────────────────────── */
function SortIcon({ col, sortKey, sortDir }) {
  if (sortKey !== col) return <ChevronsUpDown size={12} style={{ opacity: 0.4, marginLeft: 3, verticalAlign: "middle" }} />;
  return sortDir === "asc"
    ? <ChevronUp size={12} style={{ color: "var(--gold)", marginLeft: 3, verticalAlign: "middle" }} />
    : <ChevronDown size={12} style={{ color: "var(--gold)", marginLeft: 3, verticalAlign: "middle" }} />;
}

function CoinCircle({ symbol, color }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 28, height: 28, borderRadius: "50%",
      background: color + "22", border: `1.5px solid ${color}55`,
      color: color, fontWeight: 700, fontSize: 9, flexShrink: 0,
      fontFamily: "monospace", letterSpacing: "-0.5px",
    }}>
      {symbol.slice(0, 3)}
    </span>
  );
}

function FearGreedGauge({ value }) {
  // value 0-100
  const zones = [
    { label: "Extreme Fear", range: "0–25",  color: "#E53935" },
    { label: "Fear",         range: "25–45", color: "#FB8C00" },
    { label: "Neutral",      range: "45–55", color: "#FDD835" },
    { label: "Greed",        range: "55–75", color: "#7CB342" },
    { label: "Extreme Greed",range: "75–100",color: "#2E7D32" },
  ];
  const getColor = (v) => {
    if (v <= 25) return "#E53935";
    if (v <= 45) return "#FB8C00";
    if (v <= 55) return "#FDD835";
    if (v <= 75) return "#7CB342";
    return "#2E7D32";
  };
  const label = value <= 25 ? "Extreme Fear" : value <= 45 ? "Fear" : value <= 55 ? "Neutral" : value <= 75 ? "Greed" : "Extreme Greed";
  const pct = (value / 100) * 100;
  const color = getColor(value);

  return (
    <div style={{ padding: "4px 0 8px" }}>
      {/* Needle meter */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%", flexShrink: 0,
          border: `4px solid ${color}`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          background: color + "15",
        }}>
          <span style={{ fontSize: 22, fontWeight: 800, color, fontFamily: "monospace" }}>{value}</span>
          <span style={{ fontSize: 9, color: "var(--text-3)", marginTop: -2 }}>/ 100</span>
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color }}>{label}</div>
          <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>Market Sentiment</div>
        </div>
      </div>
      {/* Bar track */}
      <div style={{ position: "relative", height: 10, borderRadius: 6, overflow: "hidden", marginBottom: 8,
        background: "linear-gradient(to right, #E53935 0%, #FB8C00 25%, #FDD835 45%, #7CB342 55%, #2E7D32 100%)" }}>
        <div style={{
          position: "absolute", top: "50%", left: `${pct}%`,
          transform: "translate(-50%, -50%)",
          width: 14, height: 14, borderRadius: "50%",
          background: "#fff", border: `2.5px solid ${color}`,
          boxShadow: "0 0 6px rgba(0,0,0,0.4)",
        }} />
      </div>
      {/* Zone labels */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 10 }}>
        {zones.map(z => (
          <div key={z.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: z.color, flexShrink: 0, display: "inline-block" }} />
            <span style={{ fontSize: 11, color: "var(--text-2)" }}>{z.label}</span>
            <span style={{ fontSize: 11, color: "var(--text-3)", marginLeft: "auto" }}>{z.range}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function CryptoDashboard() {
  const [sortKey, setSortKey] = useState("rank");
  const [sortDir, setSortDir] = useState("asc");

  function handleSort(col) {
    if (sortKey === col) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(col);
      setSortDir(col === "rank" ? "asc" : "desc");
    }
  }

  const sortedCoins = useMemo(() => {
    const arr = [...COINS];
    arr.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (typeof av === "string") av = av.toLowerCase(), bv = bv.toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [sortKey, sortDir]);

  const thStyle = (col) => ({
    padding: "8px 10px", textAlign: "left", fontSize: 11,
    color: sortKey === col ? "var(--gold)" : "var(--text-3)",
    fontWeight: 600, cursor: "pointer", userSelect: "none",
    whiteSpace: "nowrap", borderBottom: "1px solid var(--border-c)",
    background: "var(--surface)",
  });
  const tdStyle = {
    padding: "9px 10px", fontSize: 12, color: "var(--text-1)",
    borderBottom: "1px solid var(--border-c)", verticalAlign: "middle",
  };

  const totalMCap = COINS.reduce((s, c) => s + c.mcap, 0);
  const vol24Total = COINS.reduce((s, c) => s + c.vol24, 0);

  const catColor = (v) => v >= 0 ? "var(--up)" : "var(--down)";

  return (
    <div style={{ padding: "24px 28px", minHeight: "100vh", background: "var(--bg)" }}>

      {/* ── Hero Banner ───────────────────────────────────────────── */}
      <div className="t-card" style={{
        marginBottom: 22, padding: "20px 24px",
        background: "linear-gradient(135deg, #1a1400 0%, var(--surface) 60%, #001a1a 100%)",
        borderColor: "var(--gold)", borderWidth: 1,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{
            width: 52, height: 52, borderRadius: 12,
            background: "var(--gold)22", border: "1.5px solid var(--gold)55",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Coins size={26} style={{ color: "var(--gold)" }} />
          </div>
          <div>
            <h1 className="t-page-title" style={{ margin: 0 }}>Crypto Markets</h1>
            <p style={{ margin: "4px 0 0", color: "var(--text-3)", fontSize: 13 }}>
              Real-time crypto market intelligence — prices, dominance, sentiment & sector performance
            </p>
          </div>
        </div>

        {/* Hero stat boxes */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {[
            { label: "Total Market Cap", value: "$2.1T",      icon: <BarChart2 size={16} />, color: "var(--gold)"  },
            { label: "BTC Dominance",    value: "52.4%",      icon: <Coins size={16} />,    color: "#F7931A"       },
            { label: "24h Volume",       value: "$94B",        icon: <Activity size={16} />, color: "var(--teal)"  },
            { label: "Fear & Greed",     value: "42 — Fear",  icon: <Flame size={16} />,    color: "#FB8C00"       },
          ].map(s => (
            <div key={s.label} style={{
              background: "var(--bg)", border: "1px solid var(--border-c)",
              borderRadius: 10, padding: "12px 14px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: s.color, marginBottom: 6 }}>
                {s.icon}
                <span className="t-label" style={{ color: "var(--text-3)", fontSize: 10 }}>{s.label}</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color, fontFamily: "monospace" }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main 2-col layout ──────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 18, marginBottom: 18 }}>

        {/* Left: Coin Table */}
        <div className="t-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid var(--border-c)", display: "flex", alignItems: "center", gap: 8 }}>
            <Coins size={16} style={{ color: "var(--gold)" }} />
            <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text-1)" }}>Top 20 Cryptocurrencies</span>
            <span className="t-badge" style={{ marginLeft: "auto", fontSize: 10 }}>Live</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {[
                    { col: "rank",   label: "#"          },
                    { col: "name",   label: "Coin"       },
                    { col: "price",  label: "Price"      },
                    { col: "chg24",  label: "24h %"      },
                    { col: "chg7d",  label: "7d %"       },
                    { col: "mcap",   label: "Market Cap" },
                    { col: "vol24",  label: "Volume 24h" },
                    { col: "dom",    label: "Dominance"  },
                  ].map(({ col, label }) => (
                    <th key={col} style={thStyle(col)} onClick={() => handleSort(col)}>
                      {label}<SortIcon col={col} sortKey={sortKey} sortDir={sortDir} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedCoins.map((coin, i) => (
                  <tr key={coin.symbol} style={{ background: i % 2 === 0 ? "transparent" : "var(--surface)22" }}>
                    <td style={{ ...tdStyle, color: "var(--text-3)", fontFamily: "monospace", paddingLeft: 14 }}>{coin.rank}</td>
                    <td style={{ ...tdStyle, minWidth: 150 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <CoinCircle symbol={coin.symbol} color={coin.color} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 12, color: "var(--text-1)" }}>{coin.name}</div>
                          <div style={{ fontSize: 10, color: "var(--text-3)", fontFamily: "monospace" }}>{coin.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, fontFamily: "monospace", fontWeight: 600 }}>{fmtPrice(coin.price)}</td>
                    <td style={{ ...tdStyle, fontFamily: "monospace", fontWeight: 600,
                      color: coin.chg24 >= 0 ? "var(--up)" : "var(--down)" }}>
                      {fmtPct(coin.chg24)}
                    </td>
                    <td style={{ ...tdStyle, fontFamily: "monospace",
                      color: coin.chg7d >= 0 ? "var(--up)" : "var(--down)" }}>
                      {fmtPct(coin.chg7d)}
                    </td>
                    <td style={{ ...tdStyle, fontFamily: "monospace" }}>{fmtLarge(coin.mcap)}</td>
                    <td style={{ ...tdStyle, fontFamily: "monospace", color: "var(--text-2)" }}>{fmtLarge(coin.vol24)}</td>
                    <td style={{ ...tdStyle, minWidth: 100 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ flex: 1, height: 5, background: "var(--border-c)", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{
                            width: `${Math.min((coin.dom / 55) * 100, 100)}%`,
                            height: "100%", borderRadius: 3,
                            background: coin.color,
                          }} />
                        </div>
                        <span style={{ fontSize: 10, fontFamily: "monospace", color: "var(--text-3)", minWidth: 32 }}>
                          {coin.dom.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Sidebar panels */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Dominance Pie */}
          <div className="t-card t-card-p">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <BarChart2 size={15} style={{ color: "var(--teal)" }} />
              <span style={{ fontWeight: 700, fontSize: 13 }}>Market Dominance</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={DOMINANCE_PIE} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  dataKey="value" paddingAngle={3}>
                  {DOMINANCE_PIE.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="var(--bg)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "var(--surface)", border: "1px solid var(--border-c)", borderRadius: 8, fontSize: 12, color: "var(--text-1)" }}
                  labelStyle={{ color: "var(--text-1)" }}
                  itemStyle={{ color: "var(--text-1)" }}
                  formatter={(v, n) => [`${v}%`, n]}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Fear & Greed */}
          <div className="t-card t-card-p">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Flame size={15} style={{ color: "#FB8C00" }} />
              <span style={{ fontWeight: 700, fontSize: 13 }}>Fear & Greed Index</span>
            </div>
            <FearGreedGauge value={42} />
          </div>

          {/* Trending */}
          <div className="t-card t-card-p">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <TrendingUp size={15} style={{ color: "var(--up)" }} />
              <span style={{ fontWeight: 700, fontSize: 13 }}>Trending Now</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {TRENDING.map((c, i) => (
                <div key={c.symbol} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "7px 10px", borderRadius: 8,
                  background: "var(--bg)", border: "1px solid var(--border-c)",
                }}>
                  <span style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "monospace", minWidth: 14 }}>
                    {i + 1}
                  </span>
                  <CoinCircle symbol={c.symbol} color={c.color} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-1)" }}>{c.symbol}</div>
                    <div style={{ fontSize: 10, color: "var(--text-3)" }}>{c.name}</div>
                  </div>
                  <span style={{
                    fontSize: 11, fontFamily: "monospace", fontWeight: 700,
                    color: c.chg24 >= 0 ? "var(--up)" : "var(--down)",
                  }}>
                    {fmtPct(c.chg24)}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom: Charts row ────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>

        {/* BTC 30-day Area Chart */}
        <div className="t-card t-card-p">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#F7931A", flexShrink: 0 }} />
            <span style={{ fontWeight: 700, fontSize: 14 }}>Bitcoin — 30-Day Price</span>
            <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-3)", fontFamily: "monospace" }}>
              $83,200
              <span style={{ color: "var(--down)", marginLeft: 6 }}>+1.24%</span>
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={BTC_30D} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="btcGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F7931A" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#F7931A" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--text-3)" }}
                interval={4} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--text-3)" }} tickLine={false} axisLine={false}
                tickFormatter={v => "$" + (v / 1000).toFixed(0) + "k"} domain={["auto", "auto"]} width={40} />
              <Tooltip
                contentStyle={{ background: "var(--surface)", border: "1px solid var(--border-c)", borderRadius: 8, fontSize: 12, color: "var(--text-1)" }}
                formatter={v => ["$" + Number(v).toLocaleString(), "BTC"]}
                labelStyle={{ color: "var(--text-2)" }}
                itemStyle={{ color: "var(--text-1)" }}
              />
              <Area type="monotone" dataKey="price" stroke="#F7931A" strokeWidth={2}
                fill="url(#btcGrad)" dot={false} activeDot={{ r: 4, fill: "#F7931A" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Performance Bar Chart */}
        <div className="t-card t-card-p">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Zap size={15} style={{ color: "var(--gold)" }} />
            <span style={{ fontWeight: 700, fontSize: 14 }}>Sector Performance — 7d</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CATEGORY_PERF} layout="vertical" margin={{ top: 4, right: 24, left: 12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "var(--text-3)" }}
                tickLine={false} axisLine={false}
                tickFormatter={v => v > 0 ? "+" + v + "%" : v + "%"} />
              <YAxis type="category" dataKey="sector" tick={{ fontSize: 11, fill: "var(--text-2)" }}
                tickLine={false} axisLine={false} width={72} />
              <Tooltip
                contentStyle={{ background: "var(--surface)", border: "1px solid var(--border-c)", borderRadius: 8, fontSize: 12, color: "var(--text-1)" }}
                formatter={(v) => [fmtPct(v), "7d Change"]}
                labelStyle={{ color: "var(--text-2)" }}
                itemStyle={{ color: "var(--text-1)" }}
              />
              <Bar dataKey="change" radius={[0, 4, 4, 0]}>
                {CATEGORY_PERF.map((entry, i) => (
                  <Cell key={i} fill={entry.change >= 0 ? "var(--up)" : "var(--down)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
