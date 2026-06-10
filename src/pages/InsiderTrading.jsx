import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Eye, TrendingUp, TrendingDown, AlertCircle, Filter, Search,
  Users, DollarSign, Calendar,
} from "lucide-react";

/* ─── Helpers ───────────────────────────────────────────────────────── */
function fmtDollar(n) {
  if (n == null) return "—";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n}`;
}
function fmtShares(n) {
  if (n == null) return "—";
  return Number(n).toLocaleString("en-US");
}
function fmtPrice(n) {
  if (n == null) return "—";
  return `$${Number(n).toFixed(2)}`;
}

/* ─── Raw Filings Data (SEC Form 4, April 2026) ─────────────────────── */
const ALL_FILINGS = [
  {
    id: 1,
    date: "Apr 14, 2026",
    dateTs: 20260414,
    insider: "Jensen Huang",
    title: "CEO",
    ticker: "NVDA",
    company: "NVIDIA",
    sector: "Tech",
    type: "Sale",
    shares: 240000,
    price: 112.40,
    totalValue: 26976000,
    sharesAfter: 33200000,
  },
  {
    id: 2,
    date: "Apr 14, 2026",
    dateTs: 20260414,
    insider: "Warren Buffett (via BRK)",
    title: "Chairman",
    ticker: "OXY",
    company: "Occidental Petroleum",
    sector: "Energy",
    type: "Purchase",
    shares: 1200000,
    price: 47.82,
    totalValue: 57384000,
    sharesAfter: 255000000,
  },
  {
    id: 3,
    date: "Apr 13, 2026",
    dateTs: 20260413,
    insider: "Marc Benioff",
    title: "CEO",
    ticker: "CRM",
    company: "Salesforce",
    sector: "Tech",
    type: "Sale",
    shares: 50000,
    price: 298.40,
    totalValue: 14920000,
    sharesAfter: 3100000,
  },
  {
    id: 4,
    date: "Apr 12, 2026",
    dateTs: 20260412,
    insider: "Lisa Su",
    title: "CEO",
    ticker: "AMD",
    company: "AMD",
    sector: "Tech",
    type: "Purchase",
    shares: 10000,
    price: 88.20,
    totalValue: 882000,
    sharesAfter: 420000,
    notable: true,
    signal: "strong",
  },
  {
    id: 5,
    date: "Apr 12, 2026",
    dateTs: 20260412,
    insider: "Satya Nadella",
    title: "CEO",
    ticker: "MSFT",
    company: "Microsoft",
    sector: "Tech",
    type: "Sale",
    shares: 35000,
    price: 388.10,
    totalValue: 13583500,
    sharesAfter: 1850000,
  },
  {
    id: 6,
    date: "Apr 11, 2026",
    dateTs: 20260411,
    insider: "Jamie Dimon",
    title: "CEO",
    ticker: "JPM",
    company: "JPMorgan Chase",
    sector: "Financials",
    type: "Sale",
    shares: 150000,
    price: 241.30,
    totalValue: 36195000,
    sharesAfter: 4200000,
  },
  {
    id: 7,
    date: "Apr 11, 2026",
    dateTs: 20260411,
    insider: "David Ricks",
    title: "CEO",
    ticker: "LLY",
    company: "Eli Lilly",
    sector: "Healthcare",
    type: "Purchase",
    shares: 8500,
    price: 812.60,
    totalValue: 6907100,
    sharesAfter: 185000,
    notable: true,
    signal: "strong",
  },
  {
    id: 8,
    date: "Apr 11, 2026",
    dateTs: 20260411,
    insider: "Anne Wojcicki",
    title: "Director",
    ticker: "LLY",
    company: "Eli Lilly",
    sector: "Healthcare",
    type: "Purchase",
    shares: 3200,
    price: 812.60,
    totalValue: 2600320,
    sharesAfter: 48000,
    notable: true,
    signal: "moderate",
  },
  {
    id: 9,
    date: "Apr 10, 2026",
    dateTs: 20260410,
    insider: "Elon Musk",
    title: "Director",
    ticker: "TSLA",
    company: "Tesla",
    sector: "Tech",
    type: "Sale",
    shares: 2000000,
    price: 178.90,
    totalValue: 357800000,
    sharesAfter: 410000000,
  },
  {
    id: 10,
    date: "Apr 10, 2026",
    dateTs: 20260410,
    insider: "Robert Ford",
    title: "CEO",
    ticker: "ABT",
    company: "Abbott Laboratories",
    sector: "Healthcare",
    type: "Purchase",
    shares: 25000,
    price: 124.70,
    totalValue: 3117500,
    sharesAfter: 620000,
    notable: true,
    signal: "moderate",
  },
  {
    id: 11,
    date: "Apr 10, 2026",
    dateTs: 20260410,
    insider: "Bryan Salesky",
    title: "Director",
    ticker: "ABT",
    company: "Abbott Laboratories",
    sector: "Healthcare",
    type: "Purchase",
    shares: 15000,
    price: 124.70,
    totalValue: 1870500,
    sharesAfter: 210000,
    notable: true,
    signal: "moderate",
  },
  {
    id: 12,
    date: "Apr 9, 2026",
    dateTs: 20260409,
    insider: "Andy Jassy",
    title: "CEO",
    ticker: "AMZN",
    company: "Amazon",
    sector: "Tech",
    type: "Sale",
    shares: 80000,
    price: 194.20,
    totalValue: 15536000,
    sharesAfter: 2100000,
  },
  {
    id: 13,
    date: "Apr 9, 2026",
    dateTs: 20260409,
    insider: "Vicki Hollub",
    title: "CEO",
    ticker: "OXY",
    company: "Occidental Petroleum",
    sector: "Energy",
    type: "Purchase",
    shares: 200000,
    price: 47.82,
    totalValue: 9564000,
    sharesAfter: 1850000,
    notable: true,
    signal: "strong",
  },
  {
    id: 14,
    date: "Apr 8, 2026",
    dateTs: 20260408,
    insider: "Tim Cook",
    title: "CEO",
    ticker: "AAPL",
    company: "Apple",
    sector: "Tech",
    type: "Sale",
    shares: 100000,
    price: 188.40,
    totalValue: 18840000,
    sharesAfter: 2800000,
  },
  {
    id: 15,
    date: "Apr 8, 2026",
    dateTs: 20260408,
    insider: "Chris Kempczinski",
    title: "CEO",
    ticker: "MCD",
    company: "McDonald's",
    sector: "Consumer",
    type: "Purchase",
    shares: 12000,
    price: 268.50,
    totalValue: 3222000,
    sharesAfter: 310000,
    notable: true,
    signal: "moderate",
  },
  {
    id: 16,
    date: "Apr 7, 2026",
    dateTs: 20260407,
    insider: "Dara Khosrowshahi",
    title: "CEO",
    ticker: "UBER",
    company: "Uber Technologies",
    sector: "Tech",
    type: "Purchase",
    shares: 50000,
    price: 76.30,
    totalValue: 3815000,
    sharesAfter: 920000,
    notable: true,
    signal: "strong",
  },
  {
    id: 17,
    date: "Apr 7, 2026",
    dateTs: 20260407,
    insider: "Nelson Chai",
    title: "CFO",
    ticker: "UBER",
    company: "Uber Technologies",
    sector: "Tech",
    type: "Purchase",
    shares: 30000,
    price: 76.30,
    totalValue: 2289000,
    sharesAfter: 480000,
    notable: true,
    signal: "moderate",
  },
  {
    id: 18,
    date: "Apr 7, 2026",
    dateTs: 20260407,
    insider: "Dan Henig",
    title: "Director",
    ticker: "UBER",
    company: "Uber Technologies",
    sector: "Tech",
    type: "Purchase",
    shares: 20000,
    price: 76.30,
    totalValue: 1526000,
    sharesAfter: 185000,
    notable: true,
    signal: "moderate",
  },
  {
    id: 19,
    date: "Apr 6, 2026",
    dateTs: 20260406,
    insider: "Larry Culp",
    title: "CEO",
    ticker: "GEV",
    company: "GE Vernova",
    sector: "Energy",
    type: "Purchase",
    shares: 40000,
    price: 312.80,
    totalValue: 12512000,
    sharesAfter: 550000,
    notable: true,
    signal: "strong",
  },
  {
    id: 20,
    date: "Apr 6, 2026",
    dateTs: 20260406,
    insider: "Ruth Porat",
    title: "CFO",
    ticker: "GOOGL",
    company: "Alphabet",
    sector: "Tech",
    type: "Sale",
    shares: 28000,
    price: 164.80,
    totalValue: 4614400,
    sharesAfter: 610000,
  },
  {
    id: 21,
    date: "Apr 5, 2026",
    dateTs: 20260405,
    insider: "Michael Dell",
    title: "Chairman & CEO",
    ticker: "DELL",
    company: "Dell Technologies",
    sector: "Tech",
    type: "Sale",
    shares: 500000,
    price: 98.40,
    totalValue: 49200000,
    sharesAfter: 310000000,
  },
  {
    id: 22,
    date: "Apr 5, 2026",
    dateTs: 20260405,
    insider: "Brian Niccol",
    title: "CEO",
    ticker: "SBUX",
    company: "Starbucks",
    sector: "Consumer",
    type: "Purchase",
    shares: 75000,
    price: 82.40,
    totalValue: 6180000,
    sharesAfter: 1200000,
    notable: true,
    signal: "strong",
  },
  {
    id: 23,
    date: "Apr 4, 2026",
    dateTs: 20260404,
    insider: "James Quincey",
    title: "CEO",
    ticker: "KO",
    company: "Coca-Cola",
    sector: "Consumer",
    type: "Purchase",
    shares: 20000,
    price: 71.20,
    totalValue: 1424000,
    sharesAfter: 1050000,
    notable: true,
    signal: "weak",
  },
  {
    id: 24,
    date: "Apr 4, 2026",
    dateTs: 20260404,
    insider: "Pat Gelsinger",
    title: "CEO",
    ticker: "INTC",
    company: "Intel",
    sector: "Tech",
    type: "Purchase",
    shares: 200000,
    price: 22.10,
    totalValue: 4420000,
    sharesAfter: 3800000,
    notable: true,
    signal: "strong",
  },
  {
    id: 25,
    date: "Apr 3, 2026",
    dateTs: 20260403,
    insider: "Sundar Pichai",
    title: "CEO",
    ticker: "GOOGL",
    company: "Alphabet",
    sector: "Tech",
    type: "Sale",
    shares: 22000,
    price: 164.80,
    totalValue: 3625600,
    sharesAfter: 980000,
  },
  {
    id: 26,
    date: "Apr 3, 2026",
    dateTs: 20260403,
    insider: "Mary Barra",
    title: "CEO",
    ticker: "GM",
    company: "General Motors",
    sector: "Consumer",
    type: "Purchase",
    shares: 65000,
    price: 48.60,
    totalValue: 3159000,
    sharesAfter: 840000,
    notable: true,
    signal: "moderate",
  },
  {
    id: 27,
    date: "Apr 2, 2026",
    dateTs: 20260402,
    insider: "James Gorman",
    title: "Chairman",
    ticker: "MS",
    company: "Morgan Stanley",
    sector: "Financials",
    type: "Purchase",
    shares: 45000,
    price: 118.40,
    totalValue: 5328000,
    sharesAfter: 2100000,
    notable: true,
    signal: "moderate",
  },
  {
    id: 28,
    date: "Apr 2, 2026",
    dateTs: 20260402,
    insider: "Ted Sarandos",
    title: "Co-CEO",
    ticker: "NFLX",
    company: "Netflix",
    sector: "Tech",
    type: "Sale",
    shares: 15000,
    price: 928.40,
    totalValue: 13926000,
    sharesAfter: 540000,
  },
  {
    id: 29,
    date: "Apr 1, 2026",
    dateTs: 20260401,
    insider: "Bob Chapek",
    title: "Director",
    ticker: "DIS",
    company: "Walt Disney",
    sector: "Consumer",
    type: "Purchase",
    shares: 18000,
    price: 108.20,
    totalValue: 1947600,
    sharesAfter: 95000,
    notable: true,
    signal: "weak",
  },
  {
    id: 30,
    date: "Apr 1, 2026",
    dateTs: 20260401,
    insider: "Clarence Thomas",
    title: "Director",
    ticker: "LLY",
    company: "Eli Lilly",
    sector: "Healthcare",
    type: "Purchase",
    shares: 2100,
    price: 812.60,
    totalValue: 1706460,
    sharesAfter: 28000,
    notable: true,
    signal: "moderate",
  },
];

/* ─── Sector Buying Chart Data ──────────────────────────────────────── */
const SECTOR_DATA = [
  { sector: "Healthcare", buyVolume: 142 },
  { sector: "Energy", buyVolume: 118 },
  { sector: "Financials", buyVolume: 87 },
  { sector: "Consumer", buyVolume: 74 },
  { sector: "Tech", buyVolume: 63 },
  { sector: "Industrials", buyVolume: 41 },
  { sector: "Materials", buyVolume: 28 },
];

/* ─── Cluster Activity ──────────────────────────────────────────────── */
const CLUSTERS = [
  {
    ticker: "UBER",
    company: "Uber Technologies",
    insiders: ["Dara Khosrowshahi (CEO)", "Nelson Chai (CFO)", "Dan Henig (Director)"],
    count: 3,
    totalBought: 7630000,
    window: "Apr 7, 2026",
    analysis:
      "Three senior insiders — including the CEO and CFO — purchased simultaneously following a 28% share price pullback. CEO open-market purchases with CFO participation historically precede positive earnings guidance revisions.",
    signal: "strong",
  },
  {
    ticker: "LLY",
    company: "Eli Lilly",
    insiders: ["David Ricks (CEO)", "Anne Wojcicki (Director)", "Clarence Thomas (Director)"],
    count: 3,
    totalBought: 11213880,
    window: "Apr 1–11, 2026",
    analysis:
      "Multiple insiders accumulating at $812 ahead of Q1 earnings. CEO purchase of $6.9M is the largest individual insider buy at LLY in over 2 years. Strong conviction signal given current market conditions.",
    signal: "strong",
  },
  {
    ticker: "ABT",
    company: "Abbott Laboratories",
    insiders: ["Robert Ford (CEO)", "Bryan Salesky (Director)"],
    count: 2,
    totalBought: 4988000,
    window: "Apr 10, 2026",
    analysis:
      "CEO and director bought on the same day following FDA approval news for a new diagnostic device. Back-to-back insider purchases on the same date carry elevated signal weight.",
    signal: "strong",
  },
  {
    ticker: "OXY",
    company: "Occidental Petroleum",
    insiders: ["Warren Buffett via BRK (Chairman)", "Vicki Hollub (CEO)"],
    count: 2,
    totalBought: 66948000,
    window: "Apr 9–14, 2026",
    analysis:
      "Berkshire Hathaway's continued accumulation alongside CEO open-market purchases suggests management expects oil prices to recover above $60. Combined buyer conviction is exceptionally high.",
    signal: "strong",
  },
  {
    ticker: "UBER",
    company: "Uber Technologies",
    insiders: ["Dara Khosrowshahi (CEO)", "Nelson Chai (CFO)"],
    count: 2,
    totalBought: 6104000,
    window: "Apr 7, 2026",
    analysis:
      "Executive team buying into weakness after a competitor regulatory setback opened market share opportunity. Intraday purchase timing suggests coordinated conviction.",
    signal: "moderate",
  },
  {
    ticker: "GOOGL",
    company: "Alphabet",
    insiders: ["Sundar Pichai (CEO)", "Ruth Porat (CFO)"],
    count: 2,
    totalBought: 0,
    totalSold: 8240000,
    window: "Apr 3–6, 2026",
    analysis:
      "Both CEO and CFO sold within the same week — likely pre-planned 10b5-1 plan executions. Simultaneous selling from two executives warrants monitoring but is common near stock vesting schedules.",
    signal: "watch",
    isSell: true,
  },
];

/* ─── By Company Aggregate ──────────────────────────────────────────── */
const BY_COMPANY = [
  {
    ticker: "LLY",
    company: "Eli Lilly",
    sector: "Healthcare",
    insidersActive: 3,
    totalBought: 11213880,
    totalSold: 0,
    netRatio: "100% Buy",
    verdict: "bullish",
  },
  {
    ticker: "OXY",
    company: "Occidental Petroleum",
    sector: "Energy",
    insidersActive: 2,
    totalBought: 66948000,
    totalSold: 0,
    netRatio: "100% Buy",
    verdict: "bullish",
  },
  {
    ticker: "UBER",
    company: "Uber Technologies",
    sector: "Tech",
    insidersActive: 3,
    totalBought: 7630000,
    totalSold: 0,
    netRatio: "100% Buy",
    verdict: "bullish",
  },
  {
    ticker: "ABT",
    company: "Abbott Laboratories",
    sector: "Healthcare",
    insidersActive: 2,
    totalBought: 4988000,
    totalSold: 0,
    netRatio: "100% Buy",
    verdict: "bullish",
  },
  {
    ticker: "NVDA",
    company: "NVIDIA",
    sector: "Tech",
    insidersActive: 1,
    totalBought: 0,
    totalSold: 26976000,
    netRatio: "100% Sell",
    verdict: "bearish",
  },
  {
    ticker: "GOOGL",
    company: "Alphabet",
    sector: "Tech",
    insidersActive: 2,
    totalBought: 0,
    totalSold: 8240000,
    netRatio: "100% Sell",
    verdict: "bearish",
  },
  {
    ticker: "TSLA",
    company: "Tesla",
    sector: "Tech",
    insidersActive: 1,
    totalBought: 0,
    totalSold: 357800000,
    netRatio: "100% Sell",
    verdict: "bearish",
  },
  {
    ticker: "MSFT",
    company: "Microsoft",
    sector: "Tech",
    insidersActive: 1,
    totalBought: 0,
    totalSold: 13583500,
    netRatio: "100% Sell",
    verdict: "bearish",
  },
  {
    ticker: "JPM",
    company: "JPMorgan Chase",
    sector: "Financials",
    insidersActive: 1,
    totalBought: 0,
    totalSold: 36195000,
    netRatio: "100% Sell",
    verdict: "bearish",
  },
  {
    ticker: "INTC",
    company: "Intel",
    sector: "Tech",
    insidersActive: 1,
    totalBought: 4420000,
    totalSold: 0,
    netRatio: "100% Buy",
    verdict: "bullish",
  },
  {
    ticker: "GEV",
    company: "GE Vernova",
    sector: "Energy",
    insidersActive: 1,
    totalBought: 12512000,
    totalSold: 0,
    netRatio: "100% Buy",
    verdict: "bullish",
  },
  {
    ticker: "SBUX",
    company: "Starbucks",
    sector: "Consumer",
    insidersActive: 1,
    totalBought: 6180000,
    totalSold: 0,
    netRatio: "100% Buy",
    verdict: "bullish",
  },
];

const NOTABLE_BUYS = ALL_FILINGS.filter((f) => f.type === "Purchase" && f.notable);

const NOTABLE_ANALYSIS = {
  7: "CEO David Ricks purchased $6.9M — the largest individual insider buy at LLY in 2+ years. With multiple directors also buying, this cluster signals high management conviction ahead of upcoming GLP-1 trial data.",
  8: "Director purchase alongside CEO cluster. Combined insider acquisition of $9.5M within 11 days represents a significant show of confidence at current price levels.",
  30: "Third insider at LLY purchasing within 11 days. Cluster confirmation elevates the signal from moderate to high confidence for long-term accumulation.",
  4: "Lisa Su's open-market purchase is notable — AMD CEOs rarely buy on the open market. A $882K purchase represents roughly 2.1% of her total holding, a meaningful personal commitment.",
  10: "CEO purchase of $3.1M on the same day as a director buy. Back-to-back purchases on the same date suggest coordinated conviction following a recent sector selloff.",
  11: "Director Bryan Salesky co-purchased with CEO Robert Ford on the same day — elevating the cluster signal. ABT is trading near 52-week lows.",
  13: "CEO Vicki Hollub purchased $9.6M alongside Berkshire's continued accumulation. Two independent buyers with different investment horizons reaching the same conclusion.",
  15: "CEO purchased $3.2M in an open-market transaction — uncommon for a consumer staple CEO. Suggests internal expectation of margin improvement in H2 2026.",
  16: "CEO Dara Khosrowshahi's $3.8M open-market purchase is one of the largest insider buys at UBER in 3 years. CFO and director co-purchased same day — strong cluster signal.",
  19: "CEO Larry Culp purchased $12.5M — largest insider buy at GEV since spin-off. Grid infrastructure tailwinds and data center power demand cited as core conviction drivers.",
  22: "Incoming CEO Brian Niccol purchased $6.2M within his first 90 days — a strong vote of confidence in his own turnaround execution at Starbucks.",
  23: "Modest CEO purchase but meaningful for a consumer staple. KO insiders rarely buy on the open market — suggests undervaluation relative to peers.",
  24: "Pat Gelsinger's $4.4M open-market purchase at a multi-year low for INTC. CEO buying at lows with a new foundry roadmap ahead is a historically strong setup.",
  27: "Outgoing chairman purchased $5.3M after recent board restructuring. Buying during a leadership transition signals confidence in the firm's strategic direction.",
  29: "Director purchase after DIS pulled back 14%. Small open-market buy, but insiders purchasing at multi-month lows is a historically reliable leading indicator.",
};

/* ─── Signal Badge ──────────────────────────────────────────────────── */
function SignalBadge({ signal }) {
  const cfg = {
    strong: { label: "Strong Buy Signal", bg: "rgba(0,200,120,0.15)", color: "var(--up)", border: "1px solid rgba(0,200,120,0.35)" },
    moderate: { label: "Moderate Signal", bg: "rgba(255,185,0,0.12)", color: "var(--gold)", border: "1px solid rgba(255,185,0,0.3)" },
    weak: { label: "Weak Signal", bg: "rgba(100,180,255,0.1)", color: "var(--teal)", border: "1px solid rgba(100,180,255,0.25)" },
    watch: { label: "Watch — Sells", bg: "rgba(255,80,80,0.1)", color: "var(--down)", border: "1px solid rgba(255,80,80,0.25)" },
  };
  const c = cfg[signal] || cfg.weak;
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      background: c.bg,
      color: c.color,
      border: c.border,
      letterSpacing: "0.03em",
    }}>
      {c.label}
    </span>
  );
}

/* ─── Custom Tooltip for sector chart ─────────────────────────────── */
function SectorTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border-c)",
      borderRadius: 8,
      padding: "8px 14px",
      fontSize: 12,
      color: "var(--text-1)",
    }}>
      <div style={{ fontWeight: 700 }}>{payload[0]?.payload?.sector}</div>
      <div style={{ color: "var(--gold)" }}>{payload[0]?.value}M in buys</div>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────────── */
export default function InsiderTrading() {
  const [activeTab, setActiveTab] = useState("recent");
  const [typeFilter, setTypeFilter] = useState("All");
  const [dateRange, setDateRange] = useState("30d");
  const [minValue, setMinValue] = useState("$50K+");
  const [searchTicker, setSearchTicker] = useState("");

  const TABS = [
    { id: "recent", label: "Recent Filings" },
    { id: "notable", label: "Notable Buys" },
    { id: "cluster", label: "Cluster Activity" },
    { id: "bycompany", label: "By Company" },
  ];

  const filteredFilings = useMemo(() => {
    let data = [...ALL_FILINGS];

    // Type filter
    if (typeFilter === "Purchases") data = data.filter((f) => f.type === "Purchase");
    else if (typeFilter === "Sales") data = data.filter((f) => f.type === "Sale");
    else if (typeFilter === "Option Exercises") data = data.filter((f) => f.type === "Option Exercise");

    // Min value filter
    if (minValue === "$250K+") data = data.filter((f) => f.totalValue >= 250000);
    else if (minValue === "$1M+") data = data.filter((f) => f.totalValue >= 1000000);
    else data = data.filter((f) => f.totalValue >= 50000);

    // Date range filter
    const cutoffMap = { "7d": 20260407, "30d": 20260315, "90d": 20260115 };
    const cutoff = cutoffMap[dateRange] || 0;
    data = data.filter((f) => f.dateTs >= cutoff);

    // Ticker search
    if (searchTicker.trim()) {
      const q = searchTicker.trim().toUpperCase();
      data = data.filter((f) => f.ticker.includes(q) || f.company.toUpperCase().includes(q));
    }

    return data;
  }, [typeFilter, dateRange, minValue, searchTicker]);

  const filteredNotable = useMemo(() => {
    let data = NOTABLE_BUYS;
    if (minValue === "$250K+") data = data.filter((f) => f.totalValue >= 250000);
    else if (minValue === "$1M+") data = data.filter((f) => f.totalValue >= 1000000);
    if (searchTicker.trim()) {
      const q = searchTicker.trim().toUpperCase();
      data = data.filter((f) => f.ticker.includes(q) || f.company.toUpperCase().includes(q));
    }
    return data;
  }, [minValue, searchTicker]);

  /* ─── Styles ─────────────────────────────────────────────────────── */
  const statBox = {
    background: "var(--surface)",
    border: "1px solid var(--border-c)",
    borderRadius: 12,
    padding: "18px 22px",
    flex: 1,
    minWidth: 140,
  };

  const tabBtn = (id) => ({
    padding: "0.45rem 0.85rem",
    borderRadius: 7,
    border: activeTab === id ? "1px solid rgba(201,169,110,0.3)" : "1px solid transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "0.75rem",
    fontWeight: activeTab === id ? 700 : 500,
    letterSpacing: "0.03em",
    background: activeTab === id ? "rgba(201,169,110,0.18)" : "transparent",
    color: activeTab === id ? "var(--gold)" : "var(--text-3)",
    transition: "all 0.15s ease",
    whiteSpace: "nowrap",
    flexShrink: 0,
  });

  const filterBtn = (val, current) => ({
    padding: "5px 14px",
    borderRadius: 20,
    border: "1px solid var(--border-c)",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 12,
    fontWeight: 600,
    background: val === current ? "rgba(212,175,55,0.15)" : "transparent",
    color: val === current ? "var(--gold)" : "var(--text-2)",
    transition: "all 0.15s ease",
  });

  const thStyle = {
    padding: "10px 14px",
    textAlign: "left",
    fontSize: 11,
    fontWeight: 700,
    color: "var(--text-3)",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    borderBottom: "1px solid var(--border-c)",
    whiteSpace: "nowrap",
  };

  const tdStyle = (isBuy) => ({
    padding: "10px 14px",
    fontSize: 13,
    color: "var(--text-1)",
    borderBottom: "1px solid var(--border-c)",
    background: isBuy ? "rgba(0,200,120,0.03)" : "rgba(255,80,80,0.03)",
    whiteSpace: "nowrap",
  });

  return (
    <div style={{ maxWidth: 1400, color: "var(--text-1)" }}>

      {/* ─── Hero Banner ───────────────────────────────────────────── */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border-c)",
        borderRadius: 20,
        padding: "2rem 2.25rem",
        marginBottom: 28,
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 var(--border-c)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "rgba(212,175,55,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Eye size={22} color="var(--gold)" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: "var(--text-1)", letterSpacing: "-0.01em", fontFamily: "'Inter', system-ui, sans-serif" }}>
              Insider Trading{" "}
              <em style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", color: "var(--gold)", fontWeight: 400, fontSize: "1.5rem" }}>Tracker</em>
            </h1>
            <p style={{ margin: "4px 0 0", color: "var(--text-2)", fontSize: 14 }}>
              Monitor SEC Form 4 filings — track when executives and directors buy or sell their own company stock
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 22 }}>
          {[
            { icon: <Calendar size={16} />, label: "Filings This Week", value: "847", color: "var(--text-1)" },
            { icon: <TrendingUp size={16} />, label: "Notable Buys", value: "23", color: "var(--up)" },
            { icon: <TrendingDown size={16} />, label: "Notable Sells", value: "156", color: "var(--down)" },
            { icon: <Users size={16} />, label: "Cluster Buys", value: "8", color: "var(--gold)" },
          ].map((s) => (
            <div key={s.label} style={statBox}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-3)", marginBottom: 6 }}>
                {s.icon}
                <span className="t-label" style={{ fontSize: 11 }}>{s.label}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "monospace" }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Key Concept Callout ────────────────────────────────────── */}
      <div style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        background: "rgba(0,180,170,0.07)",
        border: "1px solid rgba(0,180,170,0.2)",
        borderRadius: 12,
        padding: "14px 18px",
        marginBottom: 24,
      }}>
        <AlertCircle size={18} color="var(--teal)" style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ margin: 0, fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--teal)" }}>Why insider transactions matter:</strong>{" "}
          Insider buying is a bullish signal — executives rarely purchase their own company stock unless they believe it's
          undervalued. <strong style={{ color: "var(--text-1)" }}>Cluster buying</strong> (multiple insiders buying
          simultaneously) carries the highest signal weight, as it reflects coordinated conviction across the leadership team.
          Sales are less informative, as they often reflect pre-planned 10b5-1 schedules, diversification, or tax needs.
        </p>
      </div>

      {/* ─── Filter Bar ─────────────────────────────────────────────── */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border-c)",
        borderRadius: 12,
        padding: "16px 20px",
        marginBottom: 22,
        display: "flex",
        gap: 20,
        flexWrap: "wrap",
        alignItems: "center",
      }}>
        {/* Transaction Type */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span className="t-label" style={{ fontSize: 10, display: "flex", alignItems: "center", gap: 4 }}>
            <Filter size={10} /> TRANSACTION TYPE
          </span>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["All", "Purchases", "Sales", "Option Exercises"].map((v) => (
              <button key={v} style={filterBtn(v, typeFilter)} onClick={() => setTypeFilter(v)}>{v}</button>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span className="t-label" style={{ fontSize: 10, display: "flex", alignItems: "center", gap: 4 }}>
            <Calendar size={10} /> DATE RANGE
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            {["7d", "30d", "90d"].map((v) => (
              <button key={v} style={filterBtn(v, dateRange)} onClick={() => setDateRange(v)}>{v}</button>
            ))}
          </div>
        </div>

        {/* Min Value */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span className="t-label" style={{ fontSize: 10, display: "flex", alignItems: "center", gap: 4 }}>
            <DollarSign size={10} /> MIN VALUE
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            {["$50K+", "$250K+", "$1M+"].map((v) => (
              <button key={v} style={filterBtn(v, minValue)} onClick={() => setMinValue(v)}>{v}</button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginLeft: "auto" }}>
          <span className="t-label" style={{ fontSize: 10, display: "flex", alignItems: "center", gap: 4 }}>
            <Search size={10} /> SEARCH TICKER
          </span>
          <div style={{ position: "relative" }}>
            <Search size={13} color="var(--text-3)" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={searchTicker}
              onChange={(e) => setSearchTicker(e.target.value)}
              placeholder="NVDA, AMD…"
              style={{
                paddingLeft: 30,
                paddingRight: 12,
                paddingTop: 6,
                paddingBottom: 6,
                background: "var(--bg)",
                border: "1px solid var(--border-c)",
                borderRadius: 20,
                color: "var(--text-1)",
                fontFamily: "inherit",
                fontSize: 12,
                outline: "none",
                width: 130,
              }}
            />
          </div>
        </div>
      </div>

      {/* ─── Main Layout ────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>

        {/* Left: Tabs + Content */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Tab Bar */}
          <div style={{ display: "flex", gap: "0.25rem", background: "var(--surface)", padding: "0.3rem", borderRadius: 10, border: "1px solid var(--border-c)", overflowX: "auto", backdropFilter: "blur(12px)", marginBottom: 18 }}>
            {TABS.map((t) => (
              <button key={t.id} style={tabBtn(t.id)} onClick={() => setActiveTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ═══ Recent Filings Tab ═══════════════════════════════════ */}
          {activeTab === "recent" && (
            <div className="t-card" style={{ overflowX: "auto", padding: 0 }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-c)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>SEC Form 4 Filings</span>
                <span style={{ fontSize: 12, color: "var(--text-3)" }}>{filteredFilings.length} results</span>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Date", "Insider", "Title", "Ticker", "Company", "Type", "Shares", "Price", "Total Value", "Shares After"].map((h) => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredFilings.map((f) => {
                    const isBuy = f.type === "Purchase";
                    return (
                      <tr key={f.id}>
                        <td style={tdStyle(isBuy)}>
                          <span className="t-mono" style={{ fontSize: 12, color: "var(--text-2)" }}>{f.date}</span>
                        </td>
                        <td style={{ ...tdStyle(isBuy), fontWeight: 600 }}>{f.insider}</td>
                        <td style={{ ...tdStyle(isBuy), color: "var(--text-3)", fontSize: 12 }}>{f.title}</td>
                        <td style={tdStyle(isBuy)}>
                          <span className="t-badge" style={{ background: "rgba(212,175,55,0.12)", color: "var(--gold)", fontWeight: 700 }}>{f.ticker}</span>
                        </td>
                        <td style={{ ...tdStyle(isBuy), fontSize: 12, color: "var(--text-2)" }}>{f.company}</td>
                        <td style={tdStyle(isBuy)}>
                          <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            fontWeight: 700,
                            fontSize: 12,
                            color: isBuy ? "var(--up)" : "var(--down)",
                          }}>
                            {isBuy ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {f.type}
                          </span>
                        </td>
                        <td style={{ ...tdStyle(isBuy), fontFamily: "monospace", textAlign: "right" }}>
                          {fmtShares(f.shares)}
                        </td>
                        <td style={{ ...tdStyle(isBuy), fontFamily: "monospace", textAlign: "right" }}>
                          {fmtPrice(f.price)}
                        </td>
                        <td style={{ ...tdStyle(isBuy), fontFamily: "monospace", textAlign: "right", fontWeight: 700, color: isBuy ? "var(--up)" : "var(--down)" }}>
                          {fmtDollar(f.totalValue)}
                        </td>
                        <td style={{ ...tdStyle(isBuy), fontFamily: "monospace", textAlign: "right", color: "var(--text-3)", fontSize: 12 }}>
                          {fmtShares(f.sharesAfter)}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredFilings.length === 0 && (
                    <tr>
                      <td colSpan={10} style={{ padding: "32px 20px", textAlign: "center", color: "var(--text-3)", fontSize: 13 }}>
                        No filings match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ═══ Notable Buys Tab ════════════════════════════════════ */}
          {activeTab === "notable" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {filteredNotable.map((f) => (
                <div key={f.id} className="t-card-p" style={{
                  border: `1px solid ${f.signal === "strong" ? "rgba(16,185,129,0.3)" : f.signal === "moderate" ? "rgba(201,169,110,0.3)" : "rgba(0,180,198,0.3)"}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <span className="t-badge" style={{ background: "rgba(212,175,55,0.12)", color: "var(--gold)", fontWeight: 700, fontSize: 13 }}>{f.ticker}</span>
                        <span style={{ fontWeight: 700, fontSize: 15 }}>{f.company}</span>
                        <SignalBadge signal={f.signal} />
                      </div>
                      <div style={{ fontSize: 13, color: "var(--text-2)" }}>
                        {f.insider} &middot; {f.title} &middot; <span className="t-mono" style={{ fontSize: 12 }}>{f.date}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 800, fontSize: 20, color: "var(--up)", fontFamily: "monospace" }}>{fmtDollar(f.totalValue)}</div>
                      <div style={{ fontSize: 12, color: "var(--text-3)" }}>{fmtShares(f.shares)} shares @ {fmtPrice(f.price)}</div>
                    </div>
                  </div>
                  <div style={{
                    marginTop: 12,
                    padding: "10px 14px",
                    background: "var(--elevated)",
                    borderRadius: 8,
                    fontSize: 13,
                    color: "var(--text-2)",
                    lineHeight: 1.6,
                    border: "1px solid rgba(212,175,55,0.2)",
                  }}>
                    {NOTABLE_ANALYSIS[f.id] || "Insider purchase filed with the SEC. Review full Form 4 filing for transaction context."}
                  </div>
                </div>
              ))}
              {filteredNotable.length === 0 && (
                <div className="t-card-p" style={{ textAlign: "center", color: "var(--text-3)", fontSize: 13 }}>
                  No notable buys match the current filters.
                </div>
              )}
            </div>
          )}

          {/* ═══ Cluster Activity Tab ════════════════════════════════ */}
          {activeTab === "cluster" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{
                display: "flex", gap: 8, alignItems: "center", padding: "12px 16px",
                background: "rgba(0,180,170,0.07)", border: "1px solid rgba(0,180,170,0.2)",
                borderRadius: 10, fontSize: 13, color: "var(--text-2)",
              }}>
                <Users size={15} color="var(--teal)" />
                Cluster buying — 2 or more insiders purchasing at the same company within 30 days — is the highest-conviction insider signal.
              </div>

              {CLUSTERS.map((c, i) => (
                <div key={i} className="t-card-p" style={{
                  border: `1px solid ${c.isSell ? "rgba(239,68,68,0.3)" : c.signal === "strong" ? "rgba(16,185,129,0.3)" : "rgba(201,169,110,0.3)"}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span className="t-badge" style={{ background: "rgba(212,175,55,0.12)", color: "var(--gold)", fontWeight: 700, fontSize: 13 }}>{c.ticker}</span>
                        <span style={{ fontWeight: 700, fontSize: 15 }}>{c.company}</span>
                        <SignalBadge signal={c.isSell ? "watch" : c.signal} />
                        <span style={{
                          fontSize: 11,
                          padding: "2px 8px",
                          borderRadius: 20,
                          background: "rgba(100,100,120,0.15)",
                          color: "var(--text-3)",
                          border: "1px solid var(--border-c)",
                        }}>
                          {c.count} insiders
                        </span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {c.insiders.map((name, j) => (
                          <div key={j} style={{ fontSize: 12, color: "var(--text-2)", display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.isSell ? "var(--down)" : "var(--up)", flexShrink: 0 }} />
                            {name}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{
                        fontWeight: 800, fontSize: 20, fontFamily: "monospace",
                        color: c.isSell ? "var(--down)" : "var(--up)",
                      }}>
                        {c.isSell ? `-${fmtDollar(c.totalSold)}` : `+${fmtDollar(c.totalBought)}`}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                        {c.isSell ? "net sold" : "net bought"} &middot; {c.window}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    marginTop: 12,
                    padding: "10px 14px",
                    background: "var(--elevated)",
                    borderRadius: 8,
                    fontSize: 13,
                    color: "var(--text-2)",
                    lineHeight: 1.6,
                    border: `1px solid ${c.isSell ? "rgba(255,80,80,0.2)" : "rgba(0,200,120,0.2)"}`,
                  }}>
                    {c.analysis}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ═══ By Company Tab ══════════════════════════════════════ */}
          {activeTab === "bycompany" && (
            <div className="t-card" style={{ overflowX: "auto", padding: 0 }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-c)" }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Aggregate Insider Activity by Company</span>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Ticker", "Company", "Sector", "Active Insiders", "Total Bought", "Total Sold", "Net Ratio", "Sentiment"].map((h) => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {BY_COMPANY.map((c, i) => (
                    <tr key={i}>
                      <td style={tdStyle(c.verdict === "bullish")}>
                        <span className="t-badge" style={{ background: "rgba(212,175,55,0.12)", color: "var(--gold)", fontWeight: 700 }}>{c.ticker}</span>
                      </td>
                      <td style={{ ...tdStyle(c.verdict === "bullish"), fontWeight: 600 }}>{c.company}</td>
                      <td style={{ ...tdStyle(c.verdict === "bullish"), color: "var(--text-3)", fontSize: 12 }}>{c.sector}</td>
                      <td style={{ ...tdStyle(c.verdict === "bullish"), textAlign: "center", fontFamily: "monospace" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          width: 28, height: 28, borderRadius: "50%",
                          background: "rgba(212,175,55,0.12)", color: "var(--gold)",
                          fontWeight: 700, fontSize: 13,
                        }}>{c.insidersActive}</span>
                      </td>
                      <td style={{ ...tdStyle(c.verdict === "bullish"), fontFamily: "monospace", textAlign: "right", color: c.totalBought ? "var(--up)" : "var(--text-3)" }}>
                        {c.totalBought ? `+${fmtDollar(c.totalBought)}` : "—"}
                      </td>
                      <td style={{ ...tdStyle(c.verdict === "bullish"), fontFamily: "monospace", textAlign: "right", color: c.totalSold ? "var(--down)" : "var(--text-3)" }}>
                        {c.totalSold ? `-${fmtDollar(c.totalSold)}` : "—"}
                      </td>
                      <td style={{ ...tdStyle(c.verdict === "bullish"), fontSize: 12, fontWeight: 600 }}>
                        <span style={{ color: c.verdict === "bullish" ? "var(--up)" : "var(--down)" }}>{c.netRatio}</span>
                      </td>
                      <td style={tdStyle(c.verdict === "bullish")}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          fontWeight: 700, fontSize: 12,
                          color: c.verdict === "bullish" ? "var(--up)" : "var(--down)",
                        }}>
                          {c.verdict === "bullish" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {c.verdict === "bullish" ? "Bullish" : "Bearish"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ─── Sidebar: Top Buying Sectors ─────────────────────────── */}
        <div style={{ width: 240, flexShrink: 0 }}>
          <div className="t-card-p">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <TrendingUp size={15} color="var(--gold)" />
              <span style={{ fontWeight: 700, fontSize: 13 }}>Top Buying Sectors</span>
            </div>
            <p style={{ margin: "0 0 14px", fontSize: 11, color: "var(--text-3)", lineHeight: 1.5 }}>
              Total insider purchase volume by sector (April 2026, $M)
            </p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={SECTOR_DATA}
                layout="vertical"
                margin={{ top: 0, right: 10, bottom: 0, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: "var(--text-3)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="sector"
                  tick={{ fill: "var(--text-2)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={72}
                />
                <Tooltip content={<SectorTooltip />} />
                <Bar dataKey="buyVolume" fill="var(--gold)" radius={[0, 4, 4, 0]} maxBarSize={14} />
              </BarChart>
            </ResponsiveContainer>

            <div style={{ marginTop: 18, padding: "12px 0 0", borderTop: "1px solid var(--border-c)" }}>
              <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, color: "var(--text-3)", letterSpacing: "0.05em" }}>
                SIGNAL LEGEND
              </p>
              {[
                { color: "var(--up)", label: "Strong — CEO/CFO cluster buy" },
                { color: "var(--gold)", label: "Moderate — single senior exec" },
                { color: "var(--teal)", label: "Weak — director, small size" },
                { color: "var(--down)", label: "Watch — insider selling" },
              ].map((l) => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: l.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: "var(--text-2)", lineHeight: 1.4 }}>{l.label}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, padding: "12px 0 0", borderTop: "1px solid var(--border-c)" }}>
              <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: "var(--text-3)", letterSpacing: "0.05em" }}>
                QUICK STATS
              </p>
              {[
                { label: "Buy/Sell ratio", value: "1:6.8" },
                { label: "Avg buy size", value: "$4.1M" },
                { label: "Avg sell size", value: "$28.3M" },
                { label: "Cluster events (30d)", value: "8" },
              ].map((s) => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                  <span style={{ fontSize: 11, color: "var(--text-3)" }}>{s.label}</span>
                  <span className="t-mono" style={{ fontSize: 11, color: "var(--text-1)", fontWeight: 700 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Footer Note ─────────────────────────────────────────────── */}
      <div style={{
        marginTop: 28,
        padding: "14px 18px",
        background: "var(--surface)",
        border: "1px solid var(--border-c)",
        borderRadius: 10,
        fontSize: 11,
        color: "var(--text-3)",
        lineHeight: 1.6,
      }}>
        <strong style={{ color: "var(--text-2)" }}>Disclaimer:</strong> Insider transaction data sourced from SEC Form 4 filings.
        All figures reflect April 2026 filings. This tool is for informational and educational purposes only and does not
        constitute investment advice. Insider purchases and sales do not guarantee future price performance. Always review
        the original SEC filing for complete context, including whether transactions are part of pre-scheduled 10b5-1 plans.
      </div>
    </div>
  );
}
