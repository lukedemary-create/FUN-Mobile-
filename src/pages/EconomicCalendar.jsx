import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar, ChevronLeft, ChevronRight, List, LayoutGrid,
  TrendingUp, TrendingDown, Clock, AlertCircle, RefreshCw,
  CalendarDays, Briefcase, BarChart2, DollarSign,
  Building2, Rocket, Activity, Landmark, Star,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

const SERVER = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/* ─── Helpers ─────────────────────────────────────────────────────── */
const fmt = (v, dec = 2) => (v == null ? "—" : Number(v).toFixed(dec));
const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const fmtShort = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

const IMPORTANCE_COLORS = { HIGH: "var(--red)", MEDIUM: "var(--gold)", LOW: "var(--text-3)" };
const IMPORTANCE_BG = { HIGH: "var(--red-dim)", MEDIUM: "var(--gold-dim)", LOW: "rgba(122,136,153,0.08)" };
const IMPORTANCE_BORDER = {
  HIGH: "rgba(255,59,92,0.25)",
  MEDIUM: "rgba(201,169,110,0.25)",
  LOW: "rgba(122,136,153,0.15)"
};

/* ─── Hardcoded realistic economic events ─────────────────────────── */
function buildEvents() {
  const now = new Date("2026-04-11");
  const y = now.getFullYear();

  const raw = [
    // January 2026
    { date: "2026-01-08", time: "8:30 AM", event: "Initial Jobless Claims", importance: "MEDIUM", forecast: "215K", previous: "219K", actual: "212K" },
    { date: "2026-01-15", time: "8:30 AM", event: "CPI (YoY)", importance: "HIGH", forecast: "2.9%", previous: "2.7%", actual: "3.0%" },
    { date: "2026-01-15", time: "8:30 AM", event: "Core CPI (MoM)", importance: "HIGH", forecast: "0.3%", previous: "0.3%", actual: "0.4%" },
    { date: "2026-01-17", time: "8:30 AM", event: "Retail Sales (MoM)", importance: "HIGH", forecast: "0.4%", previous: "-0.1%", actual: "0.6%" },
    { date: "2026-01-24", time: "8:30 AM", event: "Durable Goods Orders", importance: "MEDIUM", forecast: "0.5%", previous: "-1.1%", actual: "0.9%" },
    { date: "2026-01-28", time: "2:00 PM", event: "FOMC Rate Decision", importance: "HIGH", forecast: "4.25-4.50%", previous: "4.25-4.50%", actual: "4.25-4.50%" },
    { date: "2026-01-30", time: "8:30 AM", event: "GDP (Advance, Q4)", importance: "HIGH", forecast: "2.6%", previous: "3.1%", actual: "2.3%" },
    // February 2026
    { date: "2026-02-05", time: "8:30 AM", event: "Non-Farm Payrolls", importance: "HIGH", forecast: "175K", previous: "256K", actual: "143K" },
    { date: "2026-02-05", time: "8:30 AM", event: "Unemployment Rate", importance: "HIGH", forecast: "4.1%", previous: "4.1%", actual: "4.0%" },
    { date: "2026-02-12", time: "8:30 AM", event: "CPI (YoY)", importance: "HIGH", forecast: "2.9%", previous: "3.0%", actual: "3.0%" },
    { date: "2026-02-19", time: "8:30 AM", event: "PPI (MoM)", importance: "MEDIUM", forecast: "0.3%", previous: "0.2%", actual: "0.4%" },
    { date: "2026-02-26", time: "8:30 AM", event: "PCE Price Index (YoY)", importance: "HIGH", forecast: "2.5%", previous: "2.6%", actual: "2.5%" },
    { date: "2026-02-26", time: "8:30 AM", event: "Core PCE (MoM)", importance: "HIGH", forecast: "0.3%", previous: "0.2%", actual: "0.3%" },
    // March 2026
    { date: "2026-03-05", time: "10:00 AM", event: "ISM Manufacturing PMI", importance: "MEDIUM", forecast: "50.4", previous: "50.9", actual: "50.3" },
    { date: "2026-03-07", time: "8:30 AM", event: "Non-Farm Payrolls", importance: "HIGH", forecast: "160K", previous: "143K", actual: "151K" },
    { date: "2026-03-07", time: "8:30 AM", event: "Unemployment Rate", importance: "HIGH", forecast: "4.1%", previous: "4.0%", actual: "4.1%" },
    { date: "2026-03-12", time: "8:30 AM", event: "CPI (YoY)", importance: "HIGH", forecast: "2.9%", previous: "3.0%", actual: "2.8%" },
    { date: "2026-03-19", time: "2:00 PM", event: "FOMC Rate Decision", importance: "HIGH", forecast: "4.00-4.25%", previous: "4.25-4.50%", actual: "4.00-4.25%" },
    { date: "2026-03-19", time: "2:30 PM", event: "FOMC Press Conference", importance: "HIGH", forecast: "—", previous: "—", actual: "Dovish" },
    { date: "2026-03-20", time: "8:30 AM", event: "Initial Jobless Claims", importance: "MEDIUM", forecast: "220K", previous: "227K", actual: "223K" },
    { date: "2026-03-24", time: "10:00 AM", event: "Consumer Confidence (Conference Board)", importance: "MEDIUM", forecast: "103.5", previous: "98.3", actual: "92.9" },
    { date: "2026-03-24", time: "10:00 AM", event: "New Home Sales", importance: "MEDIUM", forecast: "680K", previous: "657K", actual: "676K" },
    { date: "2026-03-26", time: "8:30 AM", event: "Durable Goods Orders (MoM)", importance: "MEDIUM", forecast: "0.7%", previous: "-0.6%", actual: "0.9%" },
    { date: "2026-03-26", time: "8:30 AM", event: "GDP (Final, Q4)", importance: "HIGH", forecast: "2.3%", previous: "2.3%", actual: "2.4%" },
    { date: "2026-03-27", time: "8:30 AM", event: "PCE Price Index (YoY)", importance: "HIGH", forecast: "2.5%", previous: "2.5%", actual: "2.5%" },
    { date: "2026-03-27", time: "8:30 AM", event: "Core PCE (MoM)", importance: "HIGH", forecast: "0.3%", previous: "0.3%", actual: "0.4%" },
    { date: "2026-03-27", time: "10:00 AM", event: "Consumer Sentiment (U. of Michigan)", importance: "MEDIUM", forecast: "65.0", previous: "64.7", actual: "57.0" },
    // April 2026 — past (before Apr 11)
    { date: "2026-04-02", time: "8:30 AM", event: "Initial Jobless Claims", importance: "MEDIUM", forecast: "222K", previous: "223K", actual: "219K" },
    { date: "2026-04-03", time: "8:30 AM", event: "Non-Farm Payrolls", importance: "HIGH", forecast: "165K", previous: "151K", actual: "228K" },
    { date: "2026-04-03", time: "8:30 AM", event: "Unemployment Rate", importance: "HIGH", forecast: "4.1%", previous: "4.1%", actual: "4.2%" },
    { date: "2026-04-03", time: "10:00 AM", event: "ISM Services PMI", importance: "MEDIUM", forecast: "53.0", previous: "52.8", actual: "50.8" },
    { date: "2026-04-08", time: "2:00 PM", event: "FOMC Meeting Minutes", importance: "HIGH", forecast: "—", previous: "—", actual: "Cautious" },
    { date: "2026-04-09", time: "8:30 AM", event: "Initial Jobless Claims", importance: "MEDIUM", forecast: "225K", previous: "219K", actual: "223K" },
    { date: "2026-04-10", time: "8:30 AM", event: "CPI (YoY)", importance: "HIGH", forecast: "2.7%", previous: "2.8%", actual: "2.4%" },
    { date: "2026-04-10", time: "8:30 AM", event: "Core CPI (MoM)", importance: "HIGH", forecast: "0.3%", previous: "0.3%", actual: "0.1%" },
    // April 11 — today
    { date: "2026-04-11", time: "8:30 AM", event: "PPI (MoM)", importance: "MEDIUM", forecast: "0.2%", previous: "0.4%", actual: null },
    // April 2026 — upcoming
    { date: "2026-04-16", time: "8:30 AM", event: "Retail Sales (MoM)", importance: "HIGH", forecast: "1.3%", previous: "0.2%", actual: null },
    { date: "2026-04-16", time: "8:30 AM", event: "Initial Jobless Claims", importance: "MEDIUM", forecast: "226K", previous: "223K", actual: null },
    { date: "2026-04-16", time: "9:15 AM", event: "Industrial Production (MoM)", importance: "LOW", forecast: "0.3%", previous: "0.7%", actual: null },
    { date: "2026-04-17", time: "8:30 AM", event: "Housing Starts", importance: "MEDIUM", forecast: "1.42M", previous: "1.50M", actual: null },
    { date: "2026-04-17", time: "8:30 AM", event: "Building Permits", importance: "MEDIUM", forecast: "1.45M", previous: "1.46M", actual: null },
    { date: "2026-04-22", time: "10:00 AM", event: "Existing Home Sales", importance: "LOW", forecast: "4.14M", previous: "4.26M", actual: null },
    { date: "2026-04-23", time: "8:30 AM", event: "Initial Jobless Claims", importance: "MEDIUM", forecast: "227K", previous: "226K", actual: null },
    { date: "2026-04-24", time: "8:30 AM", event: "Durable Goods Orders", importance: "MEDIUM", forecast: "-1.0%", previous: "0.9%", actual: null },
    { date: "2026-04-25", time: "10:00 AM", event: "Consumer Sentiment (U. of Michigan, Final)", importance: "MEDIUM", forecast: "50.8", previous: "57.0", actual: null },
    { date: "2026-04-29", time: "8:30 AM", event: "GDP (Advance, Q1)", importance: "HIGH", forecast: "0.3%", previous: "2.4%", actual: null },
    { date: "2026-04-30", time: "8:30 AM", event: "PCE Price Index (YoY)", importance: "HIGH", forecast: "2.3%", previous: "2.5%", actual: null },
    { date: "2026-04-30", time: "8:30 AM", event: "Core PCE (MoM)", importance: "HIGH", forecast: "0.1%", previous: "0.4%", actual: null },
    { date: "2026-04-30", time: "8:30 AM", event: "Employment Cost Index (Q1)", importance: "MEDIUM", forecast: "0.9%", previous: "0.9%", actual: null },
    { date: "2026-04-30", time: "10:00 AM", event: "Trade Balance", importance: "LOW", forecast: "-$130.0B", previous: "-$122.7B", actual: null },
    // May 2026
    { date: "2026-05-01", time: "2:00 PM", event: "FOMC Rate Decision", importance: "HIGH", forecast: "4.00-4.25%", previous: "4.00-4.25%", actual: null },
    { date: "2026-05-01", time: "2:30 PM", event: "FOMC Press Conference", importance: "HIGH", forecast: "—", previous: "—", actual: null },
    { date: "2026-05-07", time: "2:00 PM", event: "Fed Beige Book", importance: "MEDIUM", forecast: "—", previous: "—", actual: null },
    { date: "2026-05-13", time: "8:30 AM", event: "CPI (YoY)", importance: "HIGH", forecast: "2.3%", previous: "2.4%", actual: null },
  ];

  return raw.sort((a, b) => new Date(a.date) - new Date(b.date));
}

/* ─── Generate simulated FRED data ───────────────────────────────── */
function simFred(seriesId) {
  const seeds = {
    GDP: { start: 21000, trend: 180, noise: 120, label: "GDP", unit: "$B", dec: 0 },
    CPIAUCSL: { start: 296, trend: 0.5, noise: 0.3, label: "CPI", unit: "", dec: 2 },
    PCEPI: { start: 120, trend: 0.15, noise: 0.1, label: "Core PCE", unit: "", dec: 2 },
    UNRATE: { start: 3.5, trend: 0.02, noise: 0.15, label: "Unemployment", unit: "%", dec: 1 },
    UMCSENT: { start: 70, trend: -0.1, noise: 2, label: "Consumer Conf.", unit: "", dec: 1 },
  };
  const cfg = seeds[seriesId] || seeds.GDP;
  const data = [];
  const count = seriesId === "GDP" ? 20 : 36;
  let val = cfg.start;
  const now = new Date("2026-04-11");
  for (let i = count; i >= 0; i--) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    val += cfg.trend + (Math.random() - 0.5) * cfg.noise * 2;
    data.push({ date: d.toISOString().slice(0, 10), value: Math.max(0, val) });
  }
  return { seriesId, data, cfg };
}

/* ─── FRED Indicator Card ─────────────────────────────────────────── */
function FredCard({ seriesId, loaded }) {
  const { data, cfg } = loaded || simFred(seriesId);
  if (!data || data.length < 2) return null;
  const latest = data[data.length - 1];
  const prev = data[data.length - 2];
  const change = latest.value - prev.value;
  const pct = ((change / prev.value) * 100).toFixed(2);
  const up = change >= 0;
  const chartData = data.slice(-24).map(d => ({ date: d.date.slice(5), v: +d.value.toFixed(cfg.dec) }));

  return (
    <div className="t-card t-card-p t-card-hover" style={{ flex: "1 1 180px", minWidth: 160 }}>
      <div className="t-label" style={{ marginBottom: 6 }}>{cfg.label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
        <span className="t-metric-lg t-mono">{fmt(latest.value, cfg.dec)}{cfg.unit}</span>
        <span className="t-badge" style={{
          background: up ? "var(--up-dim)" : "var(--down-dim)",
          color: up ? "var(--up)" : "var(--down)",
          border: `1px solid ${up ? "rgba(0,184,153,0.2)" : "rgba(255,59,92,0.2)"}`,
          fontSize: "0.65rem", padding: "1px 5px"
        }}>
          {up ? "▲" : "▼"} {Math.abs(pct)}%
        </span>
      </div>
      <div style={{ color: "var(--text-3)", fontSize: "0.7rem", marginBottom: 8 }}>
        Prev: {fmt(prev.value, cfg.dec)}{cfg.unit}
      </div>
      <ResponsiveContainer width="100%" height={60}>
        <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`fg-${seriesId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={up ? "var(--up)" : "var(--down)"} stopOpacity={0.4} />
              <stop offset="100%" stopColor={up ? "var(--up)" : "var(--down)"} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone" dataKey="v"
            stroke={up ? "var(--up)" : "var(--down)"}
            strokeWidth={1.5}
            fill={`url(#fg-${seriesId})`}
            dot={false}
          />
          <Tooltip
            contentStyle={{ background: "var(--elevated)", border: "1px solid var(--border-alt)", borderRadius: 4, fontSize: 11, color: "var(--text-1)" }}
            labelStyle={{ color: "var(--text-2)" }}
            itemStyle={{ color: "var(--text-1)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */
/* ─── Earnings Data ──────────────────────────────────────────────── */
const EARNINGS = [
  { date: "2026-04-14", time: "Pre-Market", ticker: "JPM", company: "JPMorgan Chase", epsEst: "$4.61", epsActual: "$4.94", revEst: "$43.5B", revActual: "$45.3B", surprise: "+7.2%", beat: true },
  { date: "2026-04-14", time: "Pre-Market", ticker: "WFC", company: "Wells Fargo", epsEst: "$1.24", epsActual: "$1.27", revEst: "$20.7B", revActual: "$20.4B", surprise: "+2.4%", beat: true },
  { date: "2026-04-15", time: "Pre-Market", ticker: "BAC", company: "Bank of America", epsEst: "$0.82", epsActual: null, revEst: "$26.1B", revActual: null, surprise: null, beat: null },
  { date: "2026-04-15", time: "Pre-Market", ticker: "GS", company: "Goldman Sachs", epsEst: "$12.35", epsActual: null, revEst: "$14.7B", revActual: null, surprise: null, beat: null },
  { date: "2026-04-16", time: "Pre-Market", ticker: "NFLX", company: "Netflix", epsEst: "$5.68", epsActual: null, revEst: "$10.5B", revActual: null, surprise: null, beat: null },
  { date: "2026-04-16", time: "After-Market", ticker: "ASML", company: "ASML Holding", epsEst: "$7.02", epsActual: null, revEst: "$8.0B", revActual: null, surprise: null, beat: null },
  { date: "2026-04-22", time: "After-Market", ticker: "TSLA", company: "Tesla", epsEst: "$0.48", epsActual: null, revEst: "$21.3B", revActual: null, surprise: null, beat: null },
  { date: "2026-04-23", time: "Pre-Market", ticker: "BA", company: "Boeing", epsEst: "-$1.40", epsActual: null, revEst: "$19.5B", revActual: null, surprise: null, beat: null },
  { date: "2026-04-23", time: "After-Market", ticker: "META", company: "Meta Platforms", epsEst: "$5.28", epsActual: null, revEst: "$41.6B", revActual: null, surprise: null, beat: null },
  { date: "2026-04-24", time: "After-Market", ticker: "GOOGL", company: "Alphabet", epsEst: "$2.01", epsActual: null, revEst: "$89.1B", revActual: null, surprise: null, beat: null },
  { date: "2026-04-24", time: "After-Market", ticker: "MSFT", company: "Microsoft", epsEst: "$3.22", epsActual: null, revEst: "$68.4B", revActual: null, surprise: null, beat: null },
  { date: "2026-04-29", time: "After-Market", ticker: "AMZN", company: "Amazon", epsEst: "$1.36", epsActual: null, revEst: "$155.2B", revActual: null, surprise: null, beat: null },
  { date: "2026-04-30", time: "After-Market", ticker: "AAPL", company: "Apple", epsEst: "$1.61", epsActual: null, revEst: "$94.2B", revActual: null, surprise: null, beat: null },
  { date: "2026-05-06", time: "After-Market", ticker: "NVDA", company: "NVIDIA", epsEst: "$0.89", epsActual: null, revEst: "$43.1B", revActual: null, surprise: null, beat: null },
  { date: "2026-05-07", time: "Pre-Market", ticker: "DIS", company: "Walt Disney", epsEst: "$1.12", epsActual: null, revEst: "$23.7B", revActual: null, surprise: null, beat: null },
];

/* ─── IPO Data ────────────────────────────────────────────────────── */
const IPOS = [
  { date: "2026-04-16", ticker: "KLRN", company: "Klarna", exchange: "NYSE", priceRange: "$68–$72", sharesOffered: "28M", estValuation: "$15B", sector: "Fintech", status: "upcoming" },
  { date: "2026-04-22", ticker: "STRF", company: "Strive Asset Management", exchange: "NASDAQ", priceRange: "$20–$23", sharesOffered: "10M", estValuation: "$800M", sector: "Asset Management", status: "upcoming" },
  { date: "2026-04-24", ticker: "MNTN", company: "Mountain Digital", exchange: "NASDAQ", priceRange: "$14–$16", sharesOffered: "5M", estValuation: "$375M", sector: "Technology", status: "upcoming" },
  { date: "2026-03-12", ticker: "SERV", company: "Serve Robotics", exchange: "NASDAQ", priceRange: "$12", sharesOffered: "8M", estValuation: "$580M", sector: "Robotics", status: "priced", openChange: "+34.2%", currentPrice: "$16.11" },
  { date: "2026-03-05", ticker: "PHGE", company: "PhageX Bio", exchange: "NASDAQ", priceRange: "$15", sharesOffered: "4M", estValuation: "$310M", sector: "Biotech", status: "priced", openChange: "-8.3%", currentPrice: "$13.75" },
  { date: "2026-02-18", ticker: "RDDT", company: "Reddit (follow-on)", exchange: "NYSE", priceRange: "$—", sharesOffered: "12M", estValuation: "—", sector: "Social Media", status: "priced", openChange: "+2.1%", currentPrice: "$187.40" },
  { date: "2026-05-08", ticker: "TBD1", company: "CoreWeave (expansion)", exchange: "NASDAQ", priceRange: "$TBD", sharesOffered: "TBD", estValuation: "$35B+", sector: "AI Infrastructure", status: "filed" },
  { date: "2026-06-01", ticker: "TBD2", company: "Chime Financial", exchange: "NASDAQ", priceRange: "$TBD", sharesOffered: "TBD", estValuation: "$25B", sector: "Neobank", status: "filed" },
];

/* ─── Fed Watch Data ──────────────────────────────────────────────── */
const FED_MEETINGS = [
  { date: "2026-01-28", decision: "Hold", rate: "4.25-4.50%", actual: true, votes: "12-0", tone: "Hawkish Hold", summary: "Committee held rates steady citing persistent inflation above 2% target. Acknowledged labor market remains solid." },
  { date: "2026-03-19", decision: "Cut -25bps", rate: "4.00-4.25%", actual: true, votes: "11-1", tone: "Dovish Cut", summary: "First cut of 2026. Progress on inflation and softening labor market justified first reduction. One dissent for hold." },
  { date: "2026-05-01", decision: "Hold (expected)", rate: "4.00-4.25%", actual: false, probHold: 72, probCut: 23, probHike: 5 },
  { date: "2026-06-17", decision: "Cut -25bps (expected)", rate: "3.75-4.00%", actual: false, probHold: 31, probCut: 62, probHike: 7 },
  { date: "2026-07-29", decision: "Cut -25bps (possible)", rate: "3.50-3.75%", actual: false, probHold: 45, probCut: 48, probHike: 7 },
  { date: "2026-09-16", decision: "TBD", rate: "TBD", actual: false, probHold: 52, probCut: 42, probHike: 6 },
  { date: "2026-11-04", decision: "TBD", rate: "TBD", actual: false, probHold: 55, probCut: 39, probHike: 6 },
  { date: "2026-12-16", decision: "TBD", rate: "TBD", actual: false, probHold: 50, probCut: 44, probHike: 6 },
];

const YIELD_CURVE = [
  { term: "1M", yield: 4.32 }, { term: "3M", yield: 4.28 }, { term: "6M", yield: 4.18 },
  { term: "1Y", yield: 4.05 }, { term: "2Y", yield: 3.92 }, { term: "3Y", yield: 3.88 },
  { term: "5Y", yield: 3.95 }, { term: "7Y", yield: 4.06 }, { term: "10Y", yield: 4.22 },
  { term: "20Y", yield: 4.51 }, { term: "30Y", yield: 4.58 },
];

/* ─── Dividend Calendar Data ──────────────────────────────────────── */
const DIVIDENDS = [
  { ticker: "AAPL", company: "Apple", exDate: "2026-05-09", payDate: "2026-05-15", amount: "$0.25", yield: "0.52%", frequency: "Quarterly", yrsGrowth: 12 },
  { ticker: "MSFT", company: "Microsoft", exDate: "2026-05-14", payDate: "2026-06-12", amount: "$0.83", yield: "0.71%", frequency: "Quarterly", yrsGrowth: 23 },
  { ticker: "JNJ", company: "Johnson & Johnson", exDate: "2026-05-19", payDate: "2026-06-03", amount: "$1.24", yield: "3.14%", frequency: "Quarterly", yrsGrowth: 62 },
  { ticker: "KO", company: "Coca-Cola", exDate: "2026-05-28", payDate: "2026-06-15", amount: "$0.49", yield: "3.08%", frequency: "Quarterly", yrsGrowth: 62 },
  { ticker: "O", company: "Realty Income", exDate: "2026-04-30", payDate: "2026-05-15", amount: "$0.2635", yield: "5.72%", frequency: "Monthly", yrsGrowth: 30 },
  { ticker: "VZ", company: "Verizon", exDate: "2026-04-08", payDate: "2026-05-01", amount: "$0.6775", yield: "6.48%", frequency: "Quarterly", yrsGrowth: 18 },
  { ticker: "T", company: "AT&T", exDate: "2026-04-08", payDate: "2026-05-01", amount: "$0.2775", yield: "4.02%", frequency: "Quarterly", yrsGrowth: 1 },
  { ticker: "PG", company: "Procter & Gamble", exDate: "2026-04-17", payDate: "2026-05-15", amount: "$1.0065", yield: "2.44%", frequency: "Quarterly", yrsGrowth: 68 },
  { ticker: "MMM", company: "3M", exDate: "2026-05-22", payDate: "2026-06-12", amount: "$0.70", yield: "2.20%", frequency: "Quarterly", yrsGrowth: 5 },
  { ticker: "XOM", company: "ExxonMobil", exDate: "2026-05-12", payDate: "2026-06-10", amount: "$0.99", yield: "3.62%", frequency: "Quarterly", yrsGrowth: 42 },
  { ticker: "CVX", company: "Chevron", exDate: "2026-05-16", payDate: "2026-06-10", amount: "$1.71", yield: "4.38%", frequency: "Quarterly", yrsGrowth: 37 },
  { ticker: "SCHD", company: "Schwab Dividend ETF", exDate: "2026-06-20", payDate: "2026-06-24", amount: "$0.71", yield: "3.98%", frequency: "Quarterly", yrsGrowth: 14 },
];

/* ─── Calendar Type Tabs ─────────────────────────────────────────── */
const CAL_TABS = [
  { id: "economic", label: "Economic Events", icon: BarChart2 },
  { id: "earnings", label: "Earnings", icon: Building2 },
  { id: "ipo", label: "IPO Calendar", icon: Rocket },
  { id: "fedwatch", label: "Fed Watch", icon: Landmark },
  { id: "dividend", label: "Dividend Calendar", icon: Star },
];

/* ─── Earnings Tab ───────────────────────────────────────────────── */
function EarningsCalendar() {
  const TODAY = "2026-04-11";
  const upcoming = EARNINGS.filter(e => e.date >= TODAY);
  const past = EARNINGS.filter(e => e.date < TODAY);

  return (
    <div>
      {upcoming.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
            Upcoming Earnings
          </div>
          <div className="t-card" style={{ overflowX: "auto" }}>
            <table className="t-table">
              <thead>
                <tr>
                  <th>Date</th><th>Time</th><th>Company</th><th>EPS Est.</th><th>Rev Est.</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map(e => (
                  <tr key={e.ticker}>
                    <td><span style={{ fontFamily: "monospace", fontSize: 12 }}>{e.date.slice(5)}</span></td>
                    <td><span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 10, background: e.time === "Pre-Market" ? "rgba(45,212,164,0.1)" : "rgba(201,169,110,0.1)", color: e.time === "Pre-Market" ? "var(--teal)" : "var(--gold)" }}>{e.time}</span></td>
                    <td>
                      <span style={{ fontWeight: 700, color: "var(--gold)" }}>{e.ticker}</span>
                      <span style={{ marginLeft: 8, color: "var(--text-2)", fontSize: 12 }}>{e.company}</span>
                    </td>
                    <td style={{ fontFamily: "monospace" }}>{e.epsEst}</td>
                    <td style={{ fontFamily: "monospace" }}>{e.revEst}</td>
                    <td><span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: "var(--border-c)", color: "var(--text-3)", border: "1px solid var(--border-c)" }}>Pending</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {past.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
            Recent Results
          </div>
          <div className="t-card" style={{ overflowX: "auto" }}>
            <table className="t-table">
              <thead>
                <tr>
                  <th>Date</th><th>Company</th><th>EPS Est.</th><th>EPS Actual</th><th>Surprise</th><th>Rev Actual</th>
                </tr>
              </thead>
              <tbody>
                {past.map(e => (
                  <tr key={e.ticker}>
                    <td style={{ fontFamily: "monospace", fontSize: 12 }}>{e.date.slice(5)}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: "var(--gold)" }}>{e.ticker}</span>
                      <span style={{ marginLeft: 8, color: "var(--text-2)", fontSize: 12 }}>{e.company}</span>
                    </td>
                    <td style={{ fontFamily: "monospace" }}>{e.epsEst}</td>
                    <td style={{ fontFamily: "monospace", fontWeight: 700, color: e.beat ? "var(--up)" : "var(--down)" }}>{e.epsActual}</td>
                    <td>
                      <span style={{ fontSize: 12, fontWeight: 700, color: e.beat ? "var(--up)" : "var(--down)" }}>{e.surprise}</span>
                    </td>
                    <td style={{ fontFamily: "monospace", fontSize: 12 }}>{e.revActual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── IPO Tab ────────────────────────────────────────────────────── */
function IPOCalendar() {
  const upcoming = IPOS.filter(i => i.status === "upcoming" || i.status === "filed");
  const priced = IPOS.filter(i => i.status === "priced");
  const statusColor = { upcoming: "var(--gold)", filed: "var(--teal)", priced: "var(--up)" };
  const statusBg = { upcoming: "rgba(201,169,110,0.1)", filed: "rgba(45,212,164,0.1)", priced: "rgba(45,212,164,0.08)" };

  const Section = ({ title, items }) => (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>{title}</div>
      <div className="t-card" style={{ overflowX: "auto" }}>
        <table className="t-table">
          <thead>
            <tr>
              <th>Date</th><th>Company</th><th>Exchange</th><th>Price Range</th><th>Est. Valuation</th><th>Sector</th><th>Status</th>
              {items[0]?.openChange && <th>1st Day</th>}
            </tr>
          </thead>
          <tbody>
            {items.map(ipo => (
              <tr key={ipo.company}>
                <td style={{ fontFamily: "monospace", fontSize: 12 }}>{ipo.date.slice(5)}</td>
                <td>
                  {ipo.ticker !== "TBD1" && ipo.ticker !== "TBD2" && <span style={{ fontWeight: 700, color: "var(--gold)" }}>{ipo.ticker} </span>}
                  <span style={{ color: "var(--text-1)", fontWeight: 600 }}>{ipo.company}</span>
                </td>
                <td style={{ fontSize: 12, color: "var(--text-3)" }}>{ipo.exchange}</td>
                <td style={{ fontFamily: "monospace" }}>{ipo.priceRange}</td>
                <td style={{ fontWeight: 700, color: "var(--text-1)" }}>{ipo.estValuation}</td>
                <td><span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: "var(--border-c)", color: "var(--text-2)", border: "1px solid var(--border-c)" }}>{ipo.sector}</span></td>
                <td><span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: statusBg[ipo.status], color: statusColor[ipo.status], fontWeight: 700, textTransform: "uppercase" }}>{ipo.status}</span></td>
                {ipo.openChange && <td style={{ fontWeight: 700, color: ipo.openChange.startsWith("+") ? "var(--up)" : "var(--down)" }}>{ipo.openChange}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div>
      <Section title="Upcoming & Filed IPOs" items={upcoming} />
      <Section title="Recently Priced" items={priced} />
    </div>
  );
}

/* ─── Fed Watch Tab ──────────────────────────────────────────────── */
function FedWatchCalendar() {
  const toneColor = { "Hawkish Hold": "#f59e0b", "Dovish Cut": "var(--teal)", "Hold": "var(--text-3)" };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {/* Yield curve */}
      <div className="t-card t-card-p">
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)", marginBottom: 4 }}>U.S. Treasury Yield Curve</div>
        <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 16 }}>Current as of Apr 11, 2026 · 10Y at 4.22%</div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={YIELD_CURVE}>
            <defs>
              <linearGradient id="yc-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" />
            <XAxis dataKey="term" tick={{ fontSize: 10, fill: "var(--text-3)" }} />
            <YAxis domain={[3.8, 4.7]} tick={{ fontSize: 10, fill: "var(--text-3)" }} tickFormatter={v => `${v}%`} />
            <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border-c)", borderRadius: 8, fontSize: 11, color: "var(--text-1)" }} itemStyle={{ color: "var(--text-1)" }} formatter={v => [`${v.toFixed(2)}%`, "Yield"]} />
            <Area type="monotone" dataKey="yield" stroke="var(--gold)" strokeWidth={2} fill="url(#yc-grad)" dot={{ r: 3, fill: "var(--gold)" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Rate expectations + meeting schedule */}
      <div className="t-card t-card-p">
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)", marginBottom: 16 }}>FOMC Meeting Schedule & Rate Expectations</div>
        <div style={{ overflowX: "auto" }}>
          <table className="t-table">
            <thead>
              <tr>
                <th>Meeting Date</th><th>Rate / Expected</th><th>Prob. Hold</th><th>Prob. Cut</th><th>Prob. Hike</th><th>Tone / Notes</th>
              </tr>
            </thead>
            <tbody>
              {FED_MEETINGS.map(m => (
                <tr key={m.date}>
                  <td style={{ fontFamily: "monospace", fontWeight: m.actual ? 700 : 400 }}>
                    {m.date}
                    {m.actual && <span style={{ marginLeft: 6, fontSize: 10, color: "var(--up)", fontWeight: 700 }}>●</span>}
                  </td>
                  <td style={{ fontWeight: 700, color: m.actual ? "var(--text-1)" : "var(--text-2)" }}>{m.rate}</td>
                  {m.actual ? (
                    <>
                      <td colSpan={3} style={{ fontSize: 12, color: "var(--text-3)" }}>Votes: {m.votes}</td>
                    </>
                  ) : (
                    <>
                      <td><span style={{ fontWeight: 700, color: "var(--text-2)" }}>{m.probHold}%</span></td>
                      <td><span style={{ fontWeight: 700, color: "var(--teal)" }}>{m.probCut}%</span></td>
                      <td><span style={{ fontWeight: 700, color: "var(--down)" }}>{m.probHike}%</span></td>
                    </>
                  )}
                  <td>
                    {m.tone && <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: "var(--border-c)", color: toneColor[m.tone] || "var(--text-2)", border: "1px solid var(--border-c)" }}>{m.tone}</span>}
                    {m.summary && <span style={{ fontSize: 11, color: "var(--text-3)", marginLeft: 6 }}>{m.summary.slice(0, 60)}…</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Current rate context */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {[
          { label: "Current Fed Funds Rate", value: "4.00–4.25%", color: "var(--gold)" },
          { label: "Next Meeting", value: "May 1, 2026", color: "var(--text-1)" },
          { label: "Market-Implied Rate (YE)", value: "3.75–4.00%", color: "var(--teal)" },
          { label: "10Y–2Y Spread", value: "+0.30%", color: "var(--up)" },
        ].map(({ label, value, color }) => (
          <div key={label} className="t-card t-card-p" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color, fontFamily: "monospace" }}>{value}</div>
            <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 4, lineHeight: 1.4 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Dividend Calendar Tab ──────────────────────────────────────── */
function DividendCalendar() {
  const [sortBy, setSortBy] = useState("exDate");
  const sorted = [...DIVIDENDS].sort((a, b) => {
    if (sortBy === "yield") return parseFloat(b.yield) - parseFloat(a.yield);
    if (sortBy === "yrsGrowth") return b.yrsGrowth - a.yrsGrowth;
    return a.exDate.localeCompare(b.exDate);
  });

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "var(--text-3)" }}>Sort by:</span>
        {[["exDate", "Ex-Date"], ["yield", "Yield"], ["yrsGrowth", "Years of Growth"]].map(([v, l]) => (
          <button key={v} onClick={() => setSortBy(v)} style={{
            padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer",
            border: `1px solid ${sortBy === v ? "var(--gold)" : "var(--border-c)"}`,
            background: sortBy === v ? "rgba(201,169,110,0.1)" : "transparent",
            color: sortBy === v ? "var(--gold)" : "var(--text-3)",
          }}>{l}</button>
        ))}
      </div>
      <div className="t-card" style={{ overflowX: "auto" }}>
        <table className="t-table">
          <thead>
            <tr>
              <th>Ticker</th><th>Company</th><th>Ex-Date</th><th>Pay Date</th><th>Amount</th><th>Yield</th><th>Frequency</th><th>Yrs Growth</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(d => (
              <tr key={d.ticker}>
                <td><span style={{ fontWeight: 700, color: "var(--gold)" }}>{d.ticker}</span></td>
                <td style={{ color: "var(--text-2)" }}>{d.company}</td>
                <td style={{ fontFamily: "monospace", fontSize: 12 }}>{d.exDate.slice(5)}</td>
                <td style={{ fontFamily: "monospace", fontSize: 12 }}>{d.payDate.slice(5)}</td>
                <td style={{ fontFamily: "monospace", fontWeight: 600 }}>{d.amount}</td>
                <td><span style={{ fontWeight: 700, color: parseFloat(d.yield) > 4 ? "var(--up)" : "var(--text-1)" }}>{d.yield}</span></td>
                <td><span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 10, background: d.frequency === "Monthly" ? "rgba(45,212,164,0.1)" : "var(--border-c)", color: d.frequency === "Monthly" ? "var(--teal)" : "var(--text-3)", border: "1px solid var(--border-c)" }}>{d.frequency}</span></td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: Math.min(d.yrsGrowth * 1.5, 60), height: 4, borderRadius: 2, background: d.yrsGrowth >= 25 ? "var(--up)" : d.yrsGrowth >= 10 ? "var(--gold)" : "var(--text-3)" }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-2)" }}>{d.yrsGrowth}y</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function EconomicCalendar() {
  const [calType, setCalType] = useState("economic");
  const [viewMode, setViewMode] = useState("list"); // "list" | "calendar"
  const [filter, setFilter] = useState("ALL");
  const [currentMonth, setCurrentMonth] = useState(new Date("2026-04-01"));
  const [selectedDay, setSelectedDay] = useState(null);
  const [fredData, setFredData] = useState({});
  const [fredLoading, setFredLoading] = useState(true);
  const [events] = useState(buildEvents);
  const TODAY = "2026-04-11";

  /* FRED fetch */
  const SERIES = ["GDP", "CPIAUCSL", "PCEPI", "UNRATE", "UMCSENT"];
  useEffect(() => {
    let cancelled = false;
    const fetches = SERIES.map(id =>
      fetch(`${SERVER}/api/fred/${id}`)
        .then(r => r.json())
        .then(j => {
          const cfg = simFred(id).cfg;
          return { id, data: j.data, cfg };
        })
        .catch(() => {
          const sim = simFred(id);
          return { id, data: sim.data, cfg: sim.cfg };
        })
    );
    Promise.all(fetches).then(results => {
      if (cancelled) return;
      const map = {};
      results.forEach(r => { map[r.id] = { data: r.data, cfg: r.cfg }; });
      setFredData(map);
      setFredLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  /* Filtered events */
  const monthStr = currentMonth.toISOString().slice(0, 7);
  const filteredEvents = events.filter(e => {
    const matchFilter = filter === "ALL" || e.importance === filter;
    return matchFilter;
  });
  const monthEvents = filteredEvents.filter(e => e.date.startsWith(monthStr));

  /* Next 7 upcoming */
  const upcoming = events
    .filter(e => e.date >= TODAY)
    .slice(0, 7);

  /* Calendar grid */
  const calendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDow = (firstDay.getDay() + 6) % 7; // Mon=0
    const days = [];
    for (let i = 0; i < startDow; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push(dateStr);
    }
    return days;
  };

  const eventsForDay = (dateStr) => filteredEvents.filter(e => e.date === dateStr);

  const dayLabel = (dateStr) => {
    if (!dateStr) return "";
    return String(Number(dateStr.slice(8)));
  };

  /* Countdown */
  const countdown = (dateStr, timeStr) => {
    const target = new Date(`${dateStr} ${timeStr}`);
    const now = new Date(TODAY);
    const diff = target - now;
    if (diff < 0) return "Past";
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `in ${days}d`;
  };

  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="t-bg" style={{ padding: "1.5rem", minHeight: "100vh" }}>
      {/* ── Hero Banner ─────────────────────────────────────────── */}
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
        <div style={{
          position: "absolute", top: -60, right: -40,
          width: 320, height: 320,
          background: "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", position: "relative" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.625rem" }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <CalendarDays size={14} style={{ color: "var(--gold)" }} />
              </div>
              <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: "var(--text-1)", letterSpacing: "-0.01em", fontFamily: "'Inter', system-ui, sans-serif" }}>
                ECONOMIC{" "}
                <em style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", color: "var(--gold)", fontWeight: 400, fontSize: "1.5rem" }}>Calendar</em>
              </h1>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.65, maxWidth: 560, margin: "0 0 1rem" }}>
              Stay ahead of market-moving events. Track Federal Reserve meetings, inflation reports, employment data, and GDP releases that drive market volatility.
            </p>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              {["FOMC Dates", "Key Macro Events", "Market Impact Ratings", "Global Coverage"].map((label) => (
                <span key={label} style={{
                  fontSize: "0.6875rem", fontWeight: 700, padding: "3px 10px",
                  borderRadius: 99, letterSpacing: "0.04em",
                  background: "rgba(201,169,110,0.10)",
                  border: "1px solid rgba(201,169,110,0.25)",
                  color: "var(--gold)",
                }}>{label}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", flexShrink: 0 }}>
            {[
              { icon: CalendarDays, label: "Fed Meetings", sub: "FOMC dates & decisions", color: "#3b82f6" },
              { icon: Briefcase, label: "Jobs Reports", sub: "NFP & unemployment data", color: "var(--gold)" },
              { icon: BarChart2, label: "CPI Data", sub: "Inflation & PCE releases", color: "var(--teal)" },
              { icon: DollarSign, label: "GDP Releases", sub: "Growth & output data", color: "#f59e0b" },
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

      {/* ── Calendar Type Tabs ──────────────────────────────────── */}
      <div style={{ display: "flex", gap: "0.25rem", background: "var(--surface)", padding: "0.3rem", borderRadius: 10, border: "1px solid var(--border-c)", overflowX: "auto", backdropFilter: "blur(12px)", marginBottom: 20 }}>
        {CAL_TABS.map(tab => {
          const active = calType === tab.id;
          return (
            <button key={tab.id} onClick={() => setCalType(tab.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "0.45rem 0.85rem", borderRadius: 7, border: active ? "1px solid rgba(201,169,110,0.3)" : "1px solid transparent", cursor: "pointer", background: active ? "rgba(201,169,110,0.18)" : "transparent", color: active ? "var(--gold)" : "var(--text-3)", fontWeight: active ? 700 : 500, fontSize: "0.75rem", whiteSpace: "nowrap", flexShrink: 0 }}>
              <tab.icon size={13} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Non-economic tabs render here */}
      {calType === "earnings" && <EarningsCalendar />}
      {calType === "ipo" && <IPOCalendar />}
      {calType === "fedwatch" && <FedWatchCalendar />}
      {calType === "dividend" && <DividendCalendar />}

      {/* Existing Economic Events content only shown when calType === economic */}
      {calType === "economic" && <>

      {/* Filters */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          {/* Filter */}
          <div style={{ display: "flex", gap: 4, padding: "3px 4px", background: "var(--surface)", borderRadius: 5, border: "1px solid var(--border-c)" }}>
            {["ALL", "HIGH", "MEDIUM", "LOW"].map(f => (
              <button
                key={f}
                className={`t-btn t-btn-sm${filter === f ? "" : " t-btn-ghost"}`}
                onClick={() => setFilter(f)}
                style={filter === f ? {
                  background: f === "HIGH" ? "var(--red-dim)" : f === "MEDIUM" ? "var(--gold-dim)" : f === "LOW" ? "rgba(122,136,153,0.12)" : "var(--elevated)",
                  color: f === "HIGH" ? "var(--red)" : f === "MEDIUM" ? "var(--gold)" : f === "LOW" ? "var(--text-2)" : "var(--text-1)",
                  borderColor: f === "HIGH" ? "rgba(255,59,92,0.2)" : f === "MEDIUM" ? "rgba(201,169,110,0.2)" : "var(--border-alt)"
                } : {}}
              >
                {f}
              </button>
            ))}
          </div>
          {/* View toggle */}
          <div style={{ display: "flex", gap: 4, padding: "3px 4px", background: "var(--surface)", borderRadius: 5, border: "1px solid var(--border-c)" }}>
            <button
              className={`t-btn t-btn-sm${viewMode === "list" ? "" : " t-btn-ghost"}`}
              onClick={() => setViewMode("list")}
            >
              <List size={13} /> LIST VIEW
            </button>
            <button
              className={`t-btn t-btn-sm${viewMode === "calendar" ? "" : " t-btn-ghost"}`}
              onClick={() => setViewMode("calendar")}
            >
              <LayoutGrid size={13} /> CALENDAR VIEW
            </button>
          </div>
          {/* Month nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button className="t-btn t-btn-sm t-btn-ghost" onClick={() => {
              const d = new Date(currentMonth);
              d.setMonth(d.getMonth() - 1);
              setCurrentMonth(d);
            }}>
              <ChevronLeft size={14} />
            </button>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-1)", minWidth: 130, textAlign: "center" }}>
              {monthName}
            </span>
            <button className="t-btn t-btn-sm t-btn-ghost" onClick={() => {
              const d = new Date(currentMonth);
              d.setMonth(d.getMonth() + 1);
              setCurrentMonth(d);
            }}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* FRED Indicators */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div className="t-section-title" style={{ marginBottom: "0.875rem" }}>KEY ECONOMIC INDICATORS</div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {fredLoading
            ? SERIES.map(id => (
                <div key={id} className="t-skeleton" style={{ flex: "1 1 160px", height: 130, borderRadius: 6, minWidth: 150 }} />
              ))
            : SERIES.map(id => (
                <FredCard key={id} seriesId={id} loaded={fredData[id]} />
              ))
          }
        </div>
      </div>

      {/* Main content + sidebar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "1rem", alignItems: "start" }}>

        {/* Left: Calendar or List */}
        <div>
          {viewMode === "calendar" ? (
            <div className="t-card">
              <div className="t-card-p" style={{ borderBottom: "1px solid var(--border-c)" }}>
                <div className="t-section-title">CALENDAR — {monthName.toUpperCase()}</div>
              </div>
              {/* Day headers */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", borderBottom: "1px solid var(--border-c)" }}>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                  <div key={d} style={{
                    padding: "0.5rem",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--text-3)",
                    textAlign: "center",
                    borderRight: "1px solid var(--border-c)"
                  }}>{d}</div>
                ))}
              </div>
              {/* Day cells */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
                {calendarDays().map((dateStr, i) => {
                  const dayEvts = dateStr ? eventsForDay(dateStr) : [];
                  const isToday = dateStr === TODAY;
                  const isSelected = dateStr === selectedDay;
                  return (
                    <div
                      key={i}
                      onClick={() => dateStr && setSelectedDay(isSelected ? null : dateStr)}
                      style={{
                        minHeight: 72,
                        padding: "0.4rem 0.5rem",
                        borderRight: "1px solid var(--border-c)",
                        borderBottom: "1px solid var(--border-c)",
                        cursor: dateStr ? "pointer" : "default",
                        background: isSelected ? "var(--elevated)" : isToday ? "rgba(201,169,110,0.04)" : "transparent",
                        transition: "background 0.1s",
                        position: "relative"
                      }}
                    >
                      {dateStr && (
                        <>
                          <div style={{
                            fontSize: "0.75rem",
                            fontWeight: isToday ? 800 : 500,
                            color: isToday ? "var(--gold)" : "var(--text-2)",
                            marginBottom: 4,
                            display: "flex",
                            alignItems: "center",
                            gap: 4
                          }}>
                            {dayLabel(dateStr)}
                            {isToday && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--gold)", display: "inline-block" }} />}
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                            {dayEvts.slice(0, 4).map((e, j) => (
                              <span key={j} style={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                background: IMPORTANCE_COLORS[e.importance],
                                display: "inline-block",
                                opacity: 0.85
                              }} />
                            ))}
                            {dayEvts.length > 4 && (
                              <span style={{ fontSize: "0.6rem", color: "var(--text-3)" }}>+{dayEvts.length - 4}</span>
                            )}
                          </div>
                          {/* Expanded day events */}
                          {isSelected && dayEvts.length > 0 && (
                            <div style={{
                              position: "absolute",
                              top: "100%",
                              left: 0,
                              zIndex: 20,
                              background: "var(--elevated)",
                              border: "1px solid var(--border-alt)",
                              borderRadius: 5,
                              padding: "0.5rem",
                              width: 220,
                              boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
                            }}>
                              <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-2)", marginBottom: 6 }}>
                                {fmtDate(dateStr)}
                              </div>
                              {dayEvts.map((e, j) => (
                                <div key={j} style={{
                                  padding: "4px 0",
                                  borderBottom: j < dayEvts.length - 1 ? "1px solid var(--border-c)" : "none"
                                }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: "0.75rem", color: "var(--text-1)", fontWeight: 600 }}>{e.event}</span>
                                    <span style={{
                                      fontSize: "0.6rem",
                                      padding: "1px 5px",
                                      borderRadius: 3,
                                      background: IMPORTANCE_BG[e.importance],
                                      color: IMPORTANCE_COLORS[e.importance],
                                      border: `1px solid ${IMPORTANCE_BORDER[e.importance]}`,
                                      fontWeight: 700
                                    }}>{e.importance}</span>
                                  </div>
                                  <div style={{ display: "flex", gap: 8, marginTop: 2, fontSize: "0.7rem", color: "var(--text-3)" }}>
                                    <span>{e.time}</span>
                                    {e.actual && <span style={{ color: "var(--text-2)" }}>Act: {e.actual}</span>}
                                    {!e.actual && e.forecast && <span>Fcst: {e.forecast}</span>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Legend */}
              <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid var(--border-c)", display: "flex", gap: "1.25rem" }}>
                {["HIGH", "MEDIUM", "LOW"].map(imp => (
                  <div key={imp} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: IMPORTANCE_COLORS[imp], display: "inline-block" }} />
                    <span style={{ fontSize: "0.65rem", color: "var(--text-3)", fontWeight: 600 }}>{imp}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* List View */
            <div className="t-card">
              <div className="t-card-p" style={{ borderBottom: "1px solid var(--border-c)" }}>
                <div className="t-section-title">EVENT LIST — {monthName.toUpperCase()}</div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="t-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time (ET)</th>
                      <th>Event</th>
                      <th>Importance</th>
                      <th style={{ textAlign: "right" }}>Forecast</th>
                      <th style={{ textAlign: "right" }}>Previous</th>
                      <th style={{ textAlign: "right" }}>Actual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthEvents.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center", color: "var(--text-3)", padding: "2rem" }}>
                          No events for this month / filter
                        </td>
                      </tr>
                    ) : monthEvents.map((e, i) => {
                      const isToday = e.date === TODAY;
                      const isPast = e.date < TODAY;
                      return (
                        <tr key={i} style={{
                          background: isToday ? "rgba(201,169,110,0.05)" : undefined,
                          outline: isToday ? "1px solid rgba(201,169,110,0.2)" : undefined,
                          outlineOffset: "-1px",
                        }}>
                          <td>
                            <span style={{
                              fontWeight: isToday ? 700 : 500,
                              color: isToday ? "var(--gold)" : "var(--text-1)"
                            }}>
                              {fmtShort(e.date)}
                            </span>
                            {isToday && (
                              <span style={{
                                marginLeft: 6,
                                fontSize: "0.6rem",
                                padding: "1px 5px",
                                borderRadius: 3,
                                background: "var(--gold-dim)",
                                color: "var(--gold)",
                                fontWeight: 700
                              }}>TODAY</span>
                            )}
                          </td>
                          <td style={{ color: "var(--text-2)" }}>{e.time}</td>
                          <td style={{ fontWeight: 600 }}>{e.event}</td>
                          <td>
                            <span style={{
                              display: "inline-block",
                              fontSize: "0.6875rem",
                              padding: "2px 7px",
                              borderRadius: 3,
                              fontWeight: 700,
                              background: IMPORTANCE_BG[e.importance],
                              color: IMPORTANCE_COLORS[e.importance],
                              border: `1px solid ${IMPORTANCE_BORDER[e.importance]}`
                            }}>{e.importance}</span>
                          </td>
                          <td style={{ textAlign: "right", color: "var(--text-2)", fontFamily: "var(--font-mono)" }}>{e.forecast}</td>
                          <td style={{ textAlign: "right", color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>{e.previous}</td>
                          <td style={{ textAlign: "right" }}>
                            {e.actual ? (
                              <span style={{
                                fontFamily: "var(--font-mono)",
                                fontWeight: 700,
                                color: "var(--text-1)"
                              }}>{e.actual}</span>
                            ) : isPast ? (
                              <span style={{ color: "var(--text-3)", fontSize: "0.75rem" }}>N/A</span>
                            ) : (
                              <span style={{ color: "var(--text-3)", fontSize: "0.75rem" }}>Pending</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Upcoming Events */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="t-card">
            <div className="t-card-p" style={{ borderBottom: "1px solid var(--border-c)", display: "flex", alignItems: "center", gap: 8 }}>
              <Clock size={14} color="var(--gold)" />
              <div className="t-section-title">UPCOMING EVENTS</div>
            </div>
            <div style={{ padding: "0.5rem 0" }}>
              {upcoming.map((e, i) => (
                <div key={i} style={{
                  padding: "0.625rem 1rem",
                  borderBottom: i < upcoming.length - 1 ? "1px solid var(--border-c)" : "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 3
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-1)" }}>{e.event}</span>
                    <span style={{
                      fontSize: "0.6rem",
                      padding: "1px 5px",
                      borderRadius: 3,
                      fontWeight: 700,
                      background: IMPORTANCE_BG[e.importance],
                      color: IMPORTANCE_COLORS[e.importance],
                      border: `1px solid ${IMPORTANCE_BORDER[e.importance]}`,
                      whiteSpace: "nowrap"
                    }}>{e.importance}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-3)" }}>
                      {fmtShort(e.date)} · {e.time}
                    </span>
                    <span style={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      color: e.date === TODAY ? "var(--gold)" : "var(--text-2)"
                    }}>
                      {countdown(e.date, e.time)}
                    </span>
                  </div>
                  {e.forecast && e.forecast !== "—" && (
                    <div style={{ fontSize: "0.7rem", color: "var(--text-3)" }}>
                      Fcst: <span style={{ color: "var(--text-2)" }}>{e.forecast}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div className="t-card t-card-p">
            <div className="t-label" style={{ marginBottom: 12 }}>THIS MONTH AT A GLANCE</div>
            {[
              { label: "Total Events", val: monthEvents.length },
              { label: "High Impact", val: monthEvents.filter(e => e.importance === "HIGH").length, color: "var(--red)" },
              { label: "Medium Impact", val: monthEvents.filter(e => e.importance === "MEDIUM").length, color: "var(--gold)" },
              { label: "Released", val: monthEvents.filter(e => e.actual).length, color: "var(--up)" },
              { label: "Pending", val: monthEvents.filter(e => !e.actual && e.date >= TODAY).length, color: "var(--text-2)" },
            ].map((s, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "5px 0",
                borderBottom: i < 4 ? "1px solid var(--border-c)" : "none"
              }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-2)" }}>{s.label}</span>
                <span style={{ fontSize: "0.875rem", fontWeight: 700, color: s.color || "var(--text-1)" }}>{s.val}</span>
              </div>
            ))}
          </div>

          <div className="t-card t-card-p" style={{ borderColor: "rgba(201,169,110,0.12)" }}>
            <div className="t-label" style={{ marginBottom: 8 }}>NEXT HIGH IMPACT</div>
            {(() => {
              const next = events.find(e => e.importance === "HIGH" && e.date >= TODAY);
              if (!next) return <span style={{ color: "var(--text-3)", fontSize: "0.8rem" }}>None upcoming</span>;
              return (
                <>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-1)", marginBottom: 4 }}>{next.event}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-2)", marginBottom: 4 }}>{fmtDate(next.date)} · {next.time}</div>
                  {next.forecast !== "—" && (
                    <div style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>
                      Forecast: <span style={{ color: "var(--gold)", fontWeight: 700 }}>{next.forecast}</span>
                    </div>
                  )}
                  <div style={{ marginTop: 8, display: "inline-block", fontSize: "0.75rem", padding: "3px 8px", borderRadius: 4, background: "var(--red-dim)", color: "var(--red)", border: "1px solid rgba(255,59,92,0.2)", fontWeight: 700 }}>
                    {countdown(next.date, next.time)}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
      </> }
    </div>
  );
}
