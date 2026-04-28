import React, { useState, useMemo } from "react";
import {
  Home, TrendingUp, TrendingDown, DollarSign, MapPin,
  BarChart2, Percent, Clock, Building2, Calculator,
  ChevronUp, ChevronDown, ChevronsUpDown
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  Cell
} from "recharts";

/* ─── Hardcoded 2026 data ─────────────────────────────────────────── */

const HERO_STATS = [
  { label: "National Median Price", value: "$412,000", sub: "+3.2% YoY" },
  { label: "Mortgage Rate 30Y", value: "6.84%", sub: "Avg this week" },
  { label: "Active Listings", value: "1.24M", sub: "Apr 2026" },
  { label: "Days on Market", value: "38", sub: "National avg" },
];

const KEY_METRICS = [
  { label: "National Median Price", value: "$412,000", change: "+3.2%", up: true, sub: "YoY" },
  { label: "30-Year Mortgage Rate", value: "6.84%", change: "-0.12%", up: false, sub: "vs last month" },
  { label: "Monthly Payment", value: "$2,178", change: "+$48", up: true, sub: "Median, 20% down" },
  { label: "Price-to-Income Ratio", value: "6.8x", change: "+0.2x", up: true, sub: "National avg" },
  { label: "Months of Supply", value: "3.4 mo", change: "+0.3", up: true, sub: "April 2026" },
];

// 24-month median price (May 2024 – Apr 2026)
const PRICE_HISTORY = [
  { month: "May '24", price: 391000 },
  { month: "Jun '24", price: 394500 },
  { month: "Jul '24", price: 396800 },
  { month: "Aug '24", price: 395200 },
  { month: "Sep '24", price: 392100 },
  { month: "Oct '24", price: 388700 },
  { month: "Nov '24", price: 385400 },
  { month: "Dec '24", price: 383000 },
  { month: "Jan '25", price: 380500 },
  { month: "Feb '25", price: 382900 },
  { month: "Mar '25", price: 387400 },
  { month: "Apr '25", price: 392600 },
  { month: "May '25", price: 397100 },
  { month: "Jun '25", price: 400300 },
  { month: "Jul '25", price: 403800 },
  { month: "Aug '25", price: 402100 },
  { month: "Sep '25", price: 399600 },
  { month: "Oct '25", price: 397200 },
  { month: "Nov '25", price: 394800 },
  { month: "Dec '25", price: 393100 },
  { month: "Jan '26", price: 395400 },
  { month: "Feb '26", price: 400900 },
  { month: "Mar '26", price: 407200 },
  { month: "Apr '26", price: 412000 },
];

// 12-month active inventory (thousands)
const INVENTORY_HISTORY = [
  { month: "May '25", listings: 980 },
  { month: "Jun '25", listings: 1020 },
  { month: "Jul '25", listings: 1080 },
  { month: "Aug '25", listings: 1120 },
  { month: "Sep '25", listings: 1150 },
  { month: "Oct '25", listings: 1180 },
  { month: "Nov '25", listings: 1210 },
  { month: "Dec '25", listings: 1190 },
  { month: "Jan '26", listings: 1170 },
  { month: "Feb '26", listings: 1200 },
  { month: "Mar '26", listings: 1220 },
  { month: "Apr '26", listings: 1240 },
];

const REGION_CHANGE = [
  { region: "Northeast", change: 4.1 },
  { region: "South", change: 3.8 },
  { region: "Midwest", change: 2.9 },
  { region: "West", change: 1.2 },
];

const TOP_MARKETS = [
  { city: "Seattle, WA",      price: 698000, yoy: 2.1,  dom: 22, lts: 101.2, inv: 1.8, status: "Hot" },
  { city: "Miami, FL",        price: 598000, yoy: 5.4,  dom: 28, lts: 100.8, inv: 2.1, status: "Hot" },
  { city: "Portland, OR",     price: 541000, yoy: 1.4,  dom: 34, lts: 99.4,  inv: 2.6, status: "Balanced" },
  { city: "Denver, CO",       price: 512000, yoy: 2.8,  dom: 29, lts: 100.1, inv: 2.3, status: "Hot" },
  { city: "Austin, TX",       price: 478000, yoy: 3.6,  dom: 31, lts: 99.8,  inv: 2.9, status: "Hot" },
  { city: "Nashville, TN",    price: 456000, yoy: 4.2,  dom: 26, lts: 101.4, inv: 2.0, status: "Hot" },
  { city: "Phoenix, AZ",      price: 421000, yoy: 3.1,  dom: 33, lts: 99.6,  inv: 3.1, status: "Balanced" },
  { city: "Raleigh, NC",      price: 421000, yoy: 4.8,  dom: 24, lts: 101.7, inv: 1.7, status: "Hot" },
  { city: "Tampa, FL",        price: 412000, yoy: 2.9,  dom: 36, lts: 99.2,  inv: 3.3, status: "Balanced" },
  { city: "Dallas, TX",       price: 401000, yoy: 2.2,  dom: 38, lts: 99.0,  inv: 3.5, status: "Balanced" },
  { city: "Las Vegas, NV",    price: 398000, yoy: 1.8,  dom: 42, lts: 98.4,  inv: 3.8, status: "Cooling" },
  { city: "Atlanta, GA",      price: 389000, yoy: 3.4,  dom: 31, lts: 100.3, inv: 2.7, status: "Hot" },
  { city: "Charlotte, NC",    price: 367000, yoy: 3.9,  dom: 27, lts: 101.1, inv: 2.2, status: "Hot" },
  { city: "Orlando, FL",      price: 365000, yoy: 2.6,  dom: 37, lts: 99.1,  inv: 3.4, status: "Balanced" },
  { city: "Jacksonville, FL", price: 334000, yoy: 1.9,  dom: 44, lts: 98.1,  inv: 4.1, status: "Cooling" },
  { city: "San Antonio, TX",  price: 298000, yoy: 1.1,  dom: 48, lts: 97.8,  inv: 4.5, status: "Cooling" },
  { city: "Columbus, OH",     price: 298000, yoy: 2.7,  dom: 33, lts: 100.6, inv: 2.8, status: "Hot" },
  { city: "Indianapolis, IN", price: 278000, yoy: 2.4,  dom: 36, lts: 99.8,  inv: 3.1, status: "Balanced" },
  { city: "Memphis, TN",      price: 234000, yoy: 0.8,  dom: 52, lts: 97.2,  inv: 5.0, status: "Cooling" },
  { city: "Detroit, MI",      price: 198000, yoy: 1.4,  dom: 46, lts: 98.3,  inv: 4.3, status: "Cooling" },
];

// 24-month mortgage rate history
const RATE_HISTORY = [
  { month: "May '24", rate30: 7.22, rate15: 6.54, arm51: 6.88 },
  { month: "Jun '24", rate30: 7.08, rate15: 6.41, arm51: 6.72 },
  { month: "Jul '24", rate30: 6.92, rate15: 6.28, arm51: 6.59 },
  { month: "Aug '24", rate30: 6.78, rate15: 6.14, arm51: 6.44 },
  { month: "Sep '24", rate30: 6.62, rate15: 5.98, arm51: 6.28 },
  { month: "Oct '24", rate30: 6.74, rate15: 6.10, arm51: 6.38 },
  { month: "Nov '24", rate30: 6.88, rate15: 6.22, arm51: 6.52 },
  { month: "Dec '24", rate30: 7.02, rate15: 6.36, arm51: 6.66 },
  { month: "Jan '25", rate30: 7.14, rate15: 6.48, arm51: 6.78 },
  { month: "Feb '25", rate30: 7.06, rate15: 6.40, arm51: 6.69 },
  { month: "Mar '25", rate30: 6.98, rate15: 6.32, arm51: 6.61 },
  { month: "Apr '25", rate30: 6.88, rate15: 6.22, arm51: 6.52 },
  { month: "May '25", rate30: 6.76, rate15: 6.10, arm51: 6.40 },
  { month: "Jun '25", rate30: 6.68, rate15: 6.02, arm51: 6.32 },
  { month: "Jul '25", rate30: 6.72, rate15: 6.08, arm51: 6.36 },
  { month: "Aug '25", rate30: 6.80, rate15: 6.14, arm51: 6.42 },
  { month: "Sep '25", rate30: 6.88, rate15: 6.20, arm51: 6.48 },
  { month: "Oct '25", rate30: 6.94, rate15: 6.26, arm51: 6.55 },
  { month: "Nov '25", rate30: 6.98, rate15: 6.30, arm51: 6.59 },
  { month: "Dec '25", rate30: 7.01, rate15: 6.33, arm51: 6.62 },
  { month: "Jan '26", rate30: 6.96, rate15: 6.28, arm51: 6.56 },
  { month: "Feb '26", rate30: 6.90, rate15: 6.20, arm51: 6.48 },
  { month: "Mar '26", rate30: 6.86, rate15: 6.14, arm51: 6.04 },
  { month: "Apr '26", rate30: 6.84, rate15: 6.12, arm51: 6.02 },
];

const RATE_TABLE = [
  { type: "30-Year Fixed",  rate: 6.84, apy: 6.92, points: 0.8 },
  { type: "15-Year Fixed",  rate: 6.12, apy: 6.22, points: 0.7 },
  { type: "5/1 ARM",        rate: 6.02, apy: 6.84, points: 0.6 },
  { type: "FHA 30-Year",    rate: 6.44, apy: 7.18, points: 1.2 },
  { type: "VA 30-Year",     rate: 6.18, apy: 6.28, points: 0.5 },
  { type: "Jumbo 30-Year",  rate: 7.02, apy: 7.11, points: 0.9 },
];

// Affordability index (100 = median income can exactly afford median home)
const AFFORDABILITY_HISTORY = [
  { month: "May '24", index: 96.2 },
  { month: "Jun '24", index: 97.4 },
  { month: "Jul '24", index: 98.8 },
  { month: "Aug '24", index: 99.6 },
  { month: "Sep '24", index: 101.2 },
  { month: "Oct '24", index: 100.4 },
  { month: "Nov '24", index: 99.1 },
  { month: "Dec '24", index: 98.3 },
  { month: "Jan '25", index: 97.4 },
  { month: "Feb '25", index: 97.9 },
  { month: "Mar '25", index: 98.6 },
  { month: "Apr '25", index: 99.3 },
  { month: "May '25", index: 100.1 },
  { month: "Jun '25", index: 100.8 },
  { month: "Jul '25", index: 101.4 },
  { month: "Aug '25", index: 100.9 },
  { month: "Sep '25", index: 100.2 },
  { month: "Oct '25", index: 99.6 },
  { month: "Nov '25", index: 98.8 },
  { month: "Dec '25", index: 98.1 },
  { month: "Jan '26", index: 97.8 },
  { month: "Feb '26", index: 98.4 },
  { month: "Mar '26", index: 98.9 },
  { month: "Apr '26", index: 99.1 },
];

// Income needed to afford median home (assumes 28% DTI, 20% down, 30Y at 6.84%)
const INCOME_BY_CITY = [
  { city: "Seattle",     income: 198400 },
  { city: "Miami",       income: 169900 },
  { city: "Denver",      income: 145400 },
  { city: "Austin",      income: 135700 },
  { city: "Nashville",   income: 129500 },
  { city: "Phoenix",     income: 119600 },
  { city: "Tampa",       income: 116900 },
  { city: "Dallas",      income: 113800 },
  { city: "Atlanta",     income: 110400 },
  { city: "Charlotte",   income: 104100 },
  { city: "Nat. Median", income:  96800 },
  { city: "Orlando",     income: 103600 },
  { city: "Columbus",    income:  84600 },
  { city: "Indianapolis",income:  78900 },
  { city: "Memphis",     income:  66400 },
  { city: "Detroit",     income:  56200 },
];

const REITS = [
  { ticker: "VNQ",  name: "Vanguard Real Estate ETF",  price: 84.62,  divYield: 4.12, ytd: 2.8,  type: "Diversified",   mktCap: "36.2B" },
  { ticker: "O",    name: "Realty Income Corp",         price: 56.38,  divYield: 5.68, ytd: 4.1,  type: "Net Lease",     mktCap: "32.8B" },
  { ticker: "SPG",  name: "Simon Property Group",       price: 162.14, divYield: 5.02, ytd: 6.4,  type: "Retail/Mall",   mktCap: "52.4B" },
  { ticker: "PLD",  name: "Prologis Inc",               price: 114.88, divYield: 3.44, ytd: -1.2, type: "Industrial",    mktCap: "99.1B" },
  { ticker: "WELL", name: "Welltower Inc",              price: 148.92, divYield: 2.18, ytd: 8.6,  type: "Healthcare",    mktCap: "62.3B" },
  { ticker: "AMT",  name: "American Tower Corp",        price: 196.44, divYield: 3.02, ytd: 3.4,  type: "Towers/Infra",  mktCap: "91.4B" },
  { ticker: "EQIX", name: "Equinix Inc",                price: 888.72, divYield: 1.88, ytd: 5.2,  type: "Data Centers",  mktCap: "77.6B" },
  { ticker: "DLR",  name: "Digital Realty Trust",       price: 148.36, divYield: 3.22, ytd: 1.8,  type: "Data Centers",  mktCap: "43.2B" },
  { ticker: "AVB",  name: "AvalonBay Communities",      price: 212.64, divYield: 3.54, ytd: 2.1,  type: "Apartments",    mktCap: "30.1B" },
  { ticker: "EQR",  name: "Equity Residential",         price: 68.92,  divYield: 4.12, ytd: 1.4,  type: "Apartments",    mktCap: "26.2B" },
];

/* ─── Utility helpers ─────────────────────────────────────────────── */
function fmtPrice(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

function calcMonthlyPayment(homePrice, downPct, annualRate) {
  const principal = homePrice * (1 - downPct / 100);
  const monthlyRate = annualRate / 100 / 12;
  const n = 360;
  if (monthlyRate === 0) return principal / n;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
}

/* ─── Custom tooltip ──────────────────────────────────────────────── */
const TT = ({ active, payload, label, prefix = "", suffix = "", decimals = 0 }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border-c)",
      borderRadius: 6, padding: "8px 12px", fontSize: 11
    }}>
      <div style={{ color: "var(--text-2)", marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || "var(--text-1)", fontWeight: 600 }}>
          {p.name}: {prefix}{typeof p.value === "number" ? p.value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : p.value}{suffix}
        </div>
      ))}
    </div>
  );
};

/* ─── Badge component ─────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const colors = {
    Hot:      { bg: "rgba(0,184,153,0.15)", text: "var(--up)",   border: "rgba(0,184,153,0.3)" },
    Balanced: { bg: "rgba(250,189,0,0.15)",  text: "var(--gold)", border: "rgba(250,189,0,0.3)" },
    Cooling:  { bg: "rgba(255,59,92,0.15)",  text: "var(--down)", border: "rgba(255,59,92,0.3)" },
  };
  const c = colors[status] || colors.Balanced;
  return (
    <span className="t-badge" style={{
      background: c.bg, color: c.text,
      border: `1px solid ${c.border}`, fontSize: "0.68rem"
    }}>
      {status}
    </span>
  );
}

/* ─── Mortgage Calculator ─────────────────────────────────────────── */
function MortgageCalc() {
  const [homePrice, setHomePrice] = useState(412000);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(6.84);

  const monthly = calcMonthlyPayment(homePrice, downPct, rate);
  const downAmt = homePrice * (downPct / 100);
  const principal = homePrice - downAmt;
  const totalPaid = monthly * 360;
  const totalInterest = totalPaid - principal;

  return (
    <div className="t-card t-card-p" style={{ maxWidth: 520 }}>
      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-1)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <Calculator size={16} style={{ color: "var(--gold)" }} />
        Monthly Payment Calculator
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <div className="t-label" style={{ marginBottom: 6 }}>Home Price</div>
          <input
            type="number"
            value={homePrice}
            onChange={e => setHomePrice(Number(e.target.value))}
            style={{
              width: "100%", background: "var(--bg)", border: "1px solid var(--border-c)",
              borderRadius: 5, padding: "6px 8px", color: "var(--text-1)", fontSize: "0.82rem",
              boxSizing: "border-box"
            }}
          />
        </div>
        <div>
          <div className="t-label" style={{ marginBottom: 6 }}>Down Payment %</div>
          <input
            type="number"
            value={downPct}
            min={0} max={100}
            onChange={e => setDownPct(Number(e.target.value))}
            style={{
              width: "100%", background: "var(--bg)", border: "1px solid var(--border-c)",
              borderRadius: 5, padding: "6px 8px", color: "var(--text-1)", fontSize: "0.82rem",
              boxSizing: "border-box"
            }}
          />
        </div>
        <div>
          <div className="t-label" style={{ marginBottom: 6 }}>Annual Rate %</div>
          <input
            type="number"
            value={rate}
            step={0.01}
            onChange={e => setRate(Number(e.target.value))}
            style={{
              width: "100%", background: "var(--bg)", border: "1px solid var(--border-c)",
              borderRadius: 5, padding: "6px 8px", color: "var(--text-1)", fontSize: "0.82rem",
              boxSizing: "border-box"
            }}
          />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, borderTop: "1px solid var(--border-c)", paddingTop: 14 }}>
        {[
          { label: "Monthly Payment", value: `$${monthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, accent: true },
          { label: "Down Payment",    value: `$${downAmt.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: "Total Interest",  value: `$${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: "Total Cost",      value: `$${(downAmt + totalPaid).toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
        ].map(item => (
          <div key={item.label} style={{ textAlign: "center" }}>
            <div className="t-label" style={{ marginBottom: 4 }}>{item.label}</div>
            <div className="t-mono" style={{
              fontSize: item.accent ? "1.1rem" : "0.9rem",
              fontWeight: 700,
              color: item.accent ? "var(--gold)" : "var(--text-1)"
            }}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Rent vs Buy Tool ────────────────────────────────────────────── */
function RentVsBuy() {
  const [rent, setRent] = useState(2200);
  const [buyPrice, setBuyPrice] = useState(412000);
  const [years, setYears] = useState(7);
  const [appreciation, setAppreciation] = useState(3.2);

  const downAmt = buyPrice * 0.20;
  const monthly = calcMonthlyPayment(buyPrice, 20, 6.84);
  const propertyTax = (buyPrice * 0.012) / 12;
  const insurance = 150;
  const maintenance = (buyPrice * 0.01) / 12;
  const totalBuyCost = (monthly + propertyTax + insurance + maintenance) * years * 12 + downAmt;
  const futureValue = buyPrice * Math.pow(1 + appreciation / 100, years);
  const equity = futureValue - (buyPrice * 0.78); // rough remaining principal
  const buyNetCost = totalBuyCost - equity;
  const totalRentCost = rent * 12 * years * Math.pow(1.03, years / 2); // rough rent growth
  const breakEven = buyNetCost < totalRentCost;

  return (
    <div className="t-card t-card-p" style={{ maxWidth: 580 }}>
      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-1)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <Home size={16} style={{ color: "var(--teal)" }} />
        Rent vs. Buy Comparison
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[
          { label: "Monthly Rent", val: rent, set: setRent, step: 50 },
          { label: "Home Price", val: buyPrice, set: setBuyPrice, step: 1000 },
          { label: "Holding Years", val: years, set: setYears, step: 1 },
          { label: "Appreciation %", val: appreciation, set: setAppreciation, step: 0.1 },
        ].map(f => (
          <div key={f.label}>
            <div className="t-label" style={{ marginBottom: 6 }}>{f.label}</div>
            <input
              type="number" value={f.val} step={f.step}
              onChange={e => f.set(Number(e.target.value))}
              style={{
                width: "100%", background: "var(--bg)", border: "1px solid var(--border-c)",
                borderRadius: 5, padding: "6px 8px", color: "var(--text-1)", fontSize: "0.82rem",
                boxSizing: "border-box"
              }}
            />
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div style={{ background: "rgba(255,59,92,0.07)", border: "1px solid rgba(255,59,92,0.2)", borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--text-3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Renting {years}yrs</div>
          <div className="t-mono" style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--down)" }}>
            ${Math.round(totalRentCost).toLocaleString()}
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-3)", marginTop: 4 }}>Total rent paid (3% annual increase)</div>
        </div>
        <div style={{ background: "rgba(0,184,153,0.07)", border: "1px solid rgba(0,184,153,0.2)", borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--text-3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Buying {years}yrs</div>
          <div className="t-mono" style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--up)" }}>
            ${Math.round(buyNetCost).toLocaleString()}
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-3)", marginTop: 4 }}>Net cost after equity gained</div>
        </div>
      </div>
      <div style={{
        textAlign: "center", padding: "10px", borderRadius: 6,
        background: breakEven ? "rgba(0,184,153,0.12)" : "rgba(250,189,0,0.12)",
        border: `1px solid ${breakEven ? "rgba(0,184,153,0.3)" : "rgba(250,189,0,0.3)"}`,
        fontSize: "0.82rem", fontWeight: 600,
        color: breakEven ? "var(--up)" : "var(--gold)"
      }}>
        {breakEven
          ? `Buying saves ~$${Math.round(totalRentCost - buyNetCost).toLocaleString()} over ${years} years`
          : `Renting saves ~$${Math.round(buyNetCost - totalRentCost).toLocaleString()} over ${years} years`
        }
      </div>
    </div>
  );
}

/* ─── Sortable table hook ─────────────────────────────────────────── */
function useSortable(data, defaultKey, defaultDir = "asc") {
  const [sortKey, setSortKey] = useState(defaultKey);
  const [sortDir, setSortDir] = useState(defaultDir);

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey];
      if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === "asc" ? va - vb : vb - va;
    });
  }, [data, sortKey, sortDir]);

  function toggle(key) {
    if (key === sortKey) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  }

  function SortIcon({ col }) {
    if (col !== sortKey) return <ChevronsUpDown size={11} style={{ opacity: 0.35 }} />;
    return sortDir === "asc" ? <ChevronUp size={11} /> : <ChevronDown size={11} />;
  }

  return { sorted, toggle, SortIcon, sortKey };
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function RealEstate() {
  const [tab, setTab] = useState("national");
  const { sorted: sortedMarkets, toggle: toggleMarkets, SortIcon: MarketSortIcon } = useSortable(TOP_MARKETS, "price", "desc");
  const { sorted: sortedReits, toggle: toggleReits, SortIcon: ReitSortIcon } = useSortable(REITS, "mktCap", "desc");

  const TABS = [
    { id: "national",     label: "National" },
    { id: "markets",      label: "Top Markets" },
    { id: "mortgage",     label: "Mortgage Rates" },
    { id: "affordability",label: "Affordability" },
    { id: "reits",        label: "REITs" },
  ];

  const thStyle = (col, toggle, SortIcon) => ({
    padding: "8px 10px", textAlign: "left", fontSize: "0.7rem",
    fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em",
    color: "var(--text-3)", whiteSpace: "nowrap",
    cursor: "pointer", userSelect: "none",
    borderBottom: "1px solid var(--border-c)"
  });

  const tdStyle = {
    padding: "9px 10px", fontSize: "0.8rem",
    color: "var(--text-1)", borderBottom: "1px solid var(--border-c)", whiteSpace: "nowrap"
  };

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px 40px" }}>

      {/* ── Hero Banner ────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, rgba(250,189,0,0.08) 0%, rgba(0,184,153,0.06) 100%)",
        border: "1px solid var(--border-c)", borderRadius: 12,
        padding: "28px 32px", marginBottom: 24
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{
            background: "rgba(250,189,0,0.12)", border: "1px solid rgba(250,189,0,0.3)",
            borderRadius: 10, padding: 12, display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Home size={24} style={{ color: "var(--gold)" }} />
          </div>
          <div>
            <h1 className="t-page-title" style={{ marginBottom: 4 }}>Real Estate Markets</h1>
            <div style={{ color: "var(--text-2)", fontSize: "0.88rem" }}>
              Housing market intelligence — prices, inventory, mortgage rates &amp; investment data · April 2026
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
          {HERO_STATS.map(s => (
            <div key={s.label} style={{
              background: "var(--surface)", border: "1px solid var(--border-c)",
              borderRadius: 8, padding: "12px 16px"
            }}>
              <div className="t-label" style={{ marginBottom: 6 }}>{s.label}</div>
              <div className="t-mono" style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-1)", marginBottom: 2 }}>
                {s.value}
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-3)" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Key Metrics Row ────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12, marginBottom: 24 }}>
        {KEY_METRICS.map(m => (
          <div key={m.label} className="t-card t-card-p">
            <div className="t-label" style={{ marginBottom: 8 }}>{m.label}</div>
            <div className="t-mono" style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-1)", marginBottom: 6 }}>
              {m.value}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: "0.72rem", color: m.up ? "var(--up)" : "var(--down)", fontWeight: 600 }}>
                {m.up ? "▲" : "▼"} {m.change}
              </span>
              <span style={{ fontSize: "0.7rem", color: "var(--text-3)" }}>{m.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tab Nav ────────────────────────────────────────────────── */}
      <div style={{
        display: "flex", gap: 4, marginBottom: 20,
        borderBottom: "1px solid var(--border-c)", paddingBottom: 0
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "8px 16px", fontSize: "0.8rem", fontWeight: 600,
              background: "none", border: "none", cursor: "pointer",
              borderBottom: tab === t.id ? "2px solid var(--gold)" : "2px solid transparent",
              color: tab === t.id ? "var(--gold)" : "var(--text-2)",
              marginBottom: "-1px", transition: "color 0.15s"
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          NATIONAL TAB
      ══════════════════════════════════════════════════════════════ */}
      {tab === "national" && (
        <div style={{ display: "grid", gap: 20 }}>

          {/* Median Price Chart */}
          <div className="t-card t-card-p">
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-1)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <TrendingUp size={15} style={{ color: "var(--gold)" }} />
              National Median Home Price — 24 Months
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={PRICE_HISTORY} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--gold)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--text-3)" }} interval={3} />
                <YAxis
                  tick={{ fontSize: 10, fill: "var(--text-3)" }}
                  tickFormatter={v => `$${(v / 1000).toFixed(0)}K`}
                  domain={["auto", "auto"]}
                />
                <Tooltip content={<TT prefix="$" decimals={0} />} formatter={v => [`$${v.toLocaleString()}`, "Median Price"]} />
                <Area
                  type="monotone" dataKey="price" name="Median Price"
                  stroke="var(--gold)" strokeWidth={2}
                  fill="url(#priceGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Inventory + Region Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

            {/* Inventory Chart */}
            <div className="t-card t-card-p">
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-1)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <BarChart2 size={15} style={{ color: "var(--teal)" }} />
                Active Listings — 12 Months (thousands)
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={INVENTORY_HISTORY} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--text-3)" }} interval={2} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--text-3)" }} tickFormatter={v => `${v}K`} />
                  <Tooltip content={<TT suffix="K" decimals={0} />} />
                  <Bar dataKey="listings" name="Active Listings" fill="var(--teal)" fillOpacity={0.75} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Region YoY */}
            <div className="t-card t-card-p">
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-1)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <MapPin size={15} style={{ color: "var(--gold)" }} />
                YoY Price Change by Region
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={REGION_CHANGE} layout="vertical" margin={{ top: 4, right: 24, left: 60, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "var(--text-3)" }} tickFormatter={v => `${v}%`} />
                  <YAxis dataKey="region" type="category" tick={{ fontSize: 11, fill: "var(--text-2)" }} width={70} />
                  <Tooltip content={<TT suffix="%" decimals={1} />} />
                  <Bar dataKey="change" name="YoY Change" radius={[0, 3, 3, 0]}>
                    {REGION_CHANGE.map((entry, i) => (
                      <Cell key={i} fill={entry.change >= 3 ? "var(--up)" : entry.change >= 2 ? "var(--gold)" : "var(--teal)"} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TOP MARKETS TAB
      ══════════════════════════════════════════════════════════════ */}
      {tab === "markets" && (
        <div className="t-card" style={{ overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="t-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--surface)" }}>
                  {[
                    { col: "city",   label: "Metro Area" },
                    { col: "price",  label: "Median Price" },
                    { col: "yoy",    label: "YoY %" },
                    { col: "dom",    label: "Days on Mkt" },
                    { col: "lts",    label: "List-to-Sale" },
                    { col: "inv",    label: "Supply (mo)" },
                    { col: "status", label: "Market" },
                  ].map(h => (
                    <th key={h.col} style={thStyle()} onClick={() => toggleMarkets(h.col)}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        {h.label} <MarketSortIcon col={h.col} />
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedMarkets.map((row, i) => (
                  <tr key={row.city} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                    <td style={{ ...tdStyle, fontWeight: 600, color: "var(--text-1)" }}>{row.city}</td>
                    <td style={{ ...tdStyle }} className="t-mono">{fmtPrice(row.price)}</td>
                    <td style={{ ...tdStyle, color: row.yoy >= 3 ? "var(--up)" : row.yoy >= 1.5 ? "var(--gold)" : "var(--text-2)" }} className="t-mono">
                      {row.yoy >= 0 ? "+" : ""}{row.yoy.toFixed(1)}%
                    </td>
                    <td style={tdStyle} className="t-mono">{row.dom}</td>
                    <td style={{ ...tdStyle, color: row.lts >= 100 ? "var(--up)" : "var(--text-2)" }} className="t-mono">
                      {row.lts.toFixed(1)}%
                    </td>
                    <td style={{ ...tdStyle, color: row.inv <= 2.5 ? "var(--up)" : row.inv >= 4 ? "var(--down)" : "var(--text-1)" }} className="t-mono">
                      {row.inv.toFixed(1)}
                    </td>
                    <td style={tdStyle}><StatusBadge status={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MORTGAGE RATES TAB
      ══════════════════════════════════════════════════════════════ */}
      {tab === "mortgage" && (
        <div style={{ display: "grid", gap: 20 }}>

          {/* Rate History Chart */}
          <div className="t-card t-card-p">
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-1)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Percent size={15} style={{ color: "var(--gold)" }} />
              Mortgage Rate History — 24 Months
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={RATE_HISTORY} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--text-3)" }} interval={3} />
                <YAxis tick={{ fontSize: 10, fill: "var(--text-3)" }} tickFormatter={v => `${v}%`} domain={[5.5, 7.5]} />
                <Tooltip content={<TT suffix="%" decimals={2} />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="rate30" name="30-Year Fixed" stroke="var(--gold)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="rate15" name="15-Year Fixed" stroke="var(--teal)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="arm51" name="5/1 ARM" stroke="var(--down)" strokeWidth={1.5} dot={false} strokeDasharray="4 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Rate Table + Calculator */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
            <div className="t-card" style={{ overflow: "hidden" }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-c)", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-1)" }}>
                Current Rate Comparison
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--surface)" }}>
                    {["Loan Type", "Rate", "APR", "Points"].map(h => (
                      <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-3)", borderBottom: "1px solid var(--border-c)" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RATE_TABLE.map((r, i) => (
                    <tr key={r.type} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{r.type}</td>
                      <td style={{ ...tdStyle, color: "var(--gold)", fontWeight: 700 }} className="t-mono">{r.rate.toFixed(2)}%</td>
                      <td style={tdStyle} className="t-mono">{r.apy.toFixed(2)}%</td>
                      <td style={tdStyle} className="t-mono">{r.points.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <MortgageCalc />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          AFFORDABILITY TAB
      ══════════════════════════════════════════════════════════════ */}
      {tab === "affordability" && (
        <div style={{ display: "grid", gap: 20 }}>

          {/* Affordability Index Chart */}
          <div className="t-card t-card-p">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-1)", display: "flex", alignItems: "center", gap: 8 }}>
                <TrendingUp size={15} style={{ color: "var(--teal)" }} />
                Housing Affordability Index — 24 Months
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-3)" }}>100 = Median household can exactly afford median home · Above 100 = more affordable</div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={AFFORDABILITY_HISTORY} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="affGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--teal)" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="var(--teal)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--text-3)" }} interval={3} />
                <YAxis tick={{ fontSize: 10, fill: "var(--text-3)" }} domain={[94, 104]} />
                <Tooltip content={<TT decimals={1} />} />
                <Area type="monotone" dataKey="index" name="Affordability Index" stroke="var(--teal)" strokeWidth={2} fill="url(#affGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Income needed + Rent vs Buy */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
            <div className="t-card t-card-p">
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-1)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <DollarSign size={15} style={{ color: "var(--gold)" }} />
                Income Needed to Afford Median Home
              </div>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={INCOME_BY_CITY} layout="vertical" margin={{ top: 4, right: 40, left: 80, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "var(--text-3)" }} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                  <YAxis dataKey="city" type="category" tick={{ fontSize: 10, fill: "var(--text-2)" }} width={85} />
                  <Tooltip content={<TT prefix="$" decimals={0} />} formatter={v => [`$${v.toLocaleString()}`, "Income Needed"]} />
                  <Bar dataKey="income" name="Income Needed" radius={[0, 3, 3, 0]}>
                    {INCOME_BY_CITY.map((entry, i) => (
                      <Cell key={i} fill={entry.city === "Nat. Median" ? "var(--gold)" : entry.income > 130000 ? "var(--down)" : entry.income > 100000 ? "rgba(250,189,0,0.7)" : "var(--teal)"} fillOpacity={0.82} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <RentVsBuy />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          REITs TAB
      ══════════════════════════════════════════════════════════════ */}
      {tab === "reits" && (
        <div className="t-card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border-c)", display: "flex", alignItems: "center", gap: 8 }}>
            <Building2 size={16} style={{ color: "var(--gold)" }} />
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-1)" }}>Major REITs — April 2026</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="t-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--surface)" }}>
                  {[
                    { col: "ticker",   label: "Ticker" },
                    { col: "name",     label: "Name" },
                    { col: "price",    label: "Price" },
                    { col: "divYield", label: "Div Yield" },
                    { col: "ytd",      label: "YTD Return" },
                    { col: "type",     label: "Property Type" },
                    { col: "mktCap",   label: "Mkt Cap" },
                  ].map(h => (
                    <th key={h.col} style={thStyle()} onClick={() => toggleReits(h.col)}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        {h.label} <ReitSortIcon col={h.col} />
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedReits.map((r, i) => (
                  <tr key={r.ticker} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                    <td style={{ ...tdStyle, fontWeight: 700, color: "var(--gold)" }} className="t-mono">{r.ticker}</td>
                    <td style={{ ...tdStyle, maxWidth: 200 }}>{r.name}</td>
                    <td style={tdStyle} className="t-mono">${r.price.toFixed(2)}</td>
                    <td style={{ ...tdStyle, color: "var(--up)", fontWeight: 600 }} className="t-mono">{r.divYield.toFixed(2)}%</td>
                    <td style={{ ...tdStyle, color: r.ytd >= 0 ? "var(--up)" : "var(--down)", fontWeight: 600 }} className="t-mono">
                      {r.ytd >= 0 ? "+" : ""}{r.ytd.toFixed(1)}%
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        fontSize: "0.72rem", fontWeight: 600, padding: "2px 8px",
                        background: "rgba(0,184,153,0.1)", color: "var(--teal)",
                        border: "1px solid rgba(0,184,153,0.25)", borderRadius: 4
                      }}>
                        {r.type}
                      </span>
                    </td>
                    <td style={tdStyle} className="t-mono">{r.mktCap}</td>
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
