import React, { useContext, useMemo } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Zap } from "lucide-react";
import { RiskContext } from "../RiskAnalysis";
import { PORTFOLIO_MODELS, riskColor, riskLabel, GOLD, GREEN, RED, YELLOW } from "./riskData";

/* ── KPI Card ─────────────────────────────────────────────────────── */
function KPI({ label, value, sub, color }) {
  return (
    <div style={{
      background:"var(--surface)",border:"1px solid var(--border-c)",
      borderRadius:8,padding:"0.75rem 1rem",display:"flex",flexDirection:"column",gap:4,
    }}>
      <div style={{ fontSize:"0.5625rem",color:"var(--text-3)",letterSpacing:"0.1em",textTransform:"uppercase" }}>{label}</div>
      <div style={{ fontSize:"1.375rem",fontWeight:800,color: color || GOLD,lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:"0.625rem",color:"var(--text-3)" }}>{sub}</div>}
    </div>
  );
}

/* ── Gauge ────────────────────────────────────────────────────────── */
function RiskGauge({ score }) {
  const angle = -135 + (score / 100) * 270;
  const c = riskColor(score / 10);
  return (
    <div style={{ position:"relative",width:160,height:90,margin:"0 auto" }}>
      <svg viewBox="0 0 160 90" style={{ width:"100%",height:"100%" }}>
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#22c55e" />
            <stop offset="33%"  stopColor="#eab308" />
            <stop offset="66%"  stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <path d="M 20 85 A 60 60 0 0 1 140 85" fill="none" stroke="var(--border-c)" strokeWidth="12" strokeLinecap="round" />
        <path d="M 20 85 A 60 60 0 0 1 140 85" fill="none" stroke="url(#gaugeGrad)" strokeWidth="8" strokeLinecap="round" />
        {/* needle */}
        <line
          x1="80" y1="85"
          x2={80 + 50 * Math.cos((angle - 90) * Math.PI / 180)}
          y2={85 + 50 * Math.sin((angle - 90) * Math.PI / 180)}
          stroke={c} strokeWidth="2.5" strokeLinecap="round"
        />
        <circle cx="80" cy="85" r="5" fill={c} />
        <text x="80" y="80" textAnchor="middle" fill={c} fontSize="18" fontWeight="900">{score}</text>
      </svg>
    </div>
  );
}

/* ── Radar chart data ─────────────────────────────────────────────── */
const RADAR_DIMS = [
  { key:"market",       label:"Market Risk" },
  { key:"credit",       label:"Credit Risk" },
  { key:"inflation",    label:"Inflation Risk" },
  { key:"liquidity",    label:"Liquidity Risk" },
  { key:"concentration",label:"Concentration" },
  { key:"currency",     label:"Currency Risk" },
  { key:"interest",     label:"Interest Rate" },
  { key:"sequence",     label:"Sequence Risk" },
];

function n(v) { return parseFloat(v) || 0; }

function computeRadar(portfolio) {
  if (!portfolio?.length) return {
    market:40,credit:30,inflation:45,liquidity:20,
    concentration:25,currency:20,interest:35,sequence:40,
  };
  const totalVal = portfolio.reduce((s,h) => s + n(h.value), 0);
  const topWeight = totalVal > 0
    ? Math.max(...portfolio.map(h => n(h.value) / totalVal)) * 100
    : 30;
  const equityWt = portfolio.reduce((s,h) => {
    if ((h.assetClass || "").includes("Stock") || (h.assetClass || "").includes("Cap") || (h.assetClass || "").includes("Equity"))
      return s + n(h.value);
    return s;
  }, 0) / (totalVal || 1) * 100;
  const bondWt = 100 - equityWt;
  return {
    market: Math.min(95, equityWt),
    credit: Math.min(95, Math.max(10, bondWt * 0.4)),
    inflation: Math.min(95, Math.max(20, equityWt * 0.5 + 20)),
    liquidity: Math.min(95, Math.max(10, topWeight * 0.6)),
    concentration: Math.min(95, topWeight),
    currency: Math.min(95, 25),
    interest: Math.min(95, Math.max(10, bondWt * 0.6)),
    sequence: Math.min(95, Math.max(20, equityWt * 0.7)),
  };
}

/* ── Donut allocation ─────────────────────────────────────────────── */
const RECOMMENDED_ALLOC = [
  { name:"US Stocks",        value:40, color:"#22c55e" },
  { name:"Intl Stocks",      value:12, color:"#84cc16" },
  { name:"US Bonds",         value:30, color:"#3b82f6" },
  { name:"Intl Bonds",       value:8,  color:"#6366f1" },
  { name:"Real Estate",      value:4,  color:"#c9a84c" },
  { name:"Commodities",      value:3,  color:"#f97316" },
  { name:"Cash",             value:3,  color:"#94a3b8" },
];

function portfolioToAlloc(portfolio) {
  if (!portfolio?.length) return RECOMMENDED_ALLOC;
  const totalVal = portfolio.reduce((s,h) => s + n(h.value), 0);
  if (!totalVal) return RECOMMENDED_ALLOC;
  const buckets = {};
  portfolio.forEach(h => {
    const ac = h.assetClass || "Other";
    const bucket =
      ac.includes("US Large") || ac.includes("US Mid") || ac.includes("US Small") ? "US Stocks" :
      ac.includes("International") || ac.includes("Intl Dev") ? "Intl Stocks" :
      ac.includes("Emerging") ? "Emerging Mkts" :
      ac.includes("US Government") || ac.includes("Treasury") || ac.includes("Investment Grade Corp") ? "US Bonds" :
      ac.includes("Intl Bond") || ac.includes("Municipal") ? "Intl/Muni Bonds" :
      ac.includes("Real Estate") || ac.includes("REIT") ? "Real Estate" :
      ac.includes("Commodity") || ac.includes("Gold") ? "Commodities" :
      ac.includes("Cash") || ac.includes("Money Market") || ac.includes("CD") ? "Cash" :
      ac.includes("Crypto") ? "Crypto" : "Alternatives";
    buckets[bucket] = (buckets[bucket] || 0) + n(h.value);
  });
  const COLORS = ["#22c55e","#84cc16","#f97316","#3b82f6","#6366f1","#c9a84c","#94a3b8","#ef4444","#a855f7"];
  return Object.entries(buckets).map(([name, val], i) => ({
    name, value: Math.round((val / totalVal) * 100), color: COLORS[i % COLORS.length],
  }));
}

function computePortfolioStats(portfolio) {
  const totalVal = portfolio.reduce((s,h) => s + n(h.value), 0);
  const totalCost= portfolio.reduce((s,h) => s + (n(h.cost) || n(h.value)), 0);
  const wBeta   = portfolio.reduce((s,h) => s + n(h.value)/Math.max(totalVal,1) * (n(h.beta)||1), 0);
  const maxWt   = totalVal > 0 ? Math.max(...portfolio.map(h => n(h.value)/totalVal*100)) : 0;
  const equityWt= portfolio.reduce((s,h) => {
    if ((h.assetClass||"").includes("Stock")||(h.assetClass||"").includes("Cap")) return s+n(h.value);
    return s;
  },0)/(totalVal||1);
  const vol = 8 + equityWt * 14;
  const riskScore = Math.round(20 + equityWt * 60 + (maxWt > 20 ? 10 : 0));
  const sharpe = +((equityWt * 0.8 + 0.4) / (vol / 10)).toFixed(2);
  const maxDD = -(equityWt * 40 + 8);
  const varDaily = vol / Math.sqrt(252) * 1.645;
  const divScore = Math.max(0, 100 - maxWt * 1.5 - (portfolio.length < 4 ? 30 : 0));

  return {
    totalVal, totalCost,
    gainLoss: totalVal - totalCost,
    gainLossPct: totalCost > 0 ? ((totalVal - totalCost) / totalCost * 100) : 0,
    wBeta: +wBeta.toFixed(2),
    maxWt: +maxWt.toFixed(1),
    vol: +vol.toFixed(1),
    riskScore: Math.min(95, Math.max(5, riskScore)),
    sharpe,
    maxDD: +maxDD.toFixed(1),
    varDaily: +varDaily.toFixed(2),
    divScore: +divScore.toFixed(0),
    count: portfolio.length,
  };
}

const fmt = (n) => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:0,maximumFractionDigits:0}).format(n);
const fmtPct = (n) => (n >= 0 ? "+" : "") + n.toFixed(2) + "%";

const CustomTip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"var(--elevated)",border:"1px solid var(--border-c)",
      borderRadius:6,padding:"6px 10px",fontSize:"0.6875rem" }}>
      {payload.map((p,i) => (
        <div key={i} style={{ color:p.payload?.color || GOLD }}>{p.name}: {p.value}%</div>
      ))}
    </div>
  );
};

export default function TabCommandCenter() {
  const { portfolio, profile } = useContext(RiskContext);
  const hasPortfolio = portfolio?.length > 0;

  const stats  = useMemo(() => computePortfolioStats(portfolio || []), [portfolio]);
  const radar  = useMemo(() => computeRadar(portfolio || []), [portfolio]);
  const alloc  = useMemo(() => portfolioToAlloc(portfolio || []), [portfolio]);

  const radarData = RADAR_DIMS.map(d => ({
    dim: d.label,
    score: radar[d.key],
    benchmark: 50,
  }));

  const model7 = PORTFOLIO_MODELS.find(m => m.id === 7);

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:"1rem" }}>

      {!hasPortfolio && (
        <div style={{
          background:"rgba(201,169,110,0.06)",border:"1px solid rgba(201,169,110,0.2)",
          borderRadius:8,padding:"0.75rem 1rem",display:"flex",gap:"0.75rem",alignItems:"center",
        }}>
          <Zap size={16} color={GOLD} />
          <div style={{ fontSize:"0.75rem",color:"var(--text-2)",lineHeight:1.6 }}>
            <strong style={{ color:GOLD }}>No portfolio entered.</strong> Head to the{" "}
            <em>My Portfolio</em> tab to add your holdings for personalized risk analysis.
            Showing demo metrics below.
          </div>
        </div>
      )}

      {/* ── Top KPI Row ── */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:"0.625rem" }}>
        <div style={{
          background:"var(--surface)",border:"1px solid var(--border-c)",
          borderRadius:8,padding:"0.75rem 1rem",gridColumn:"span 1",
        }}>
          <div style={{ fontSize:"0.5625rem",color:"var(--text-3)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4 }}>
            Portfolio Risk Score
          </div>
          <RiskGauge score={hasPortfolio ? stats.riskScore : 52} />
          <div style={{ textAlign:"center",fontSize:"0.6875rem",color:riskColor((hasPortfolio ? stats.riskScore : 52)/10),fontWeight:700,marginTop:4 }}>
            {riskLabel((hasPortfolio ? stats.riskScore : 52)/10)}
          </div>
        </div>

        <KPI label="Portfolio Volatility" value={`${hasPortfolio ? stats.vol : 10.2}%`}
          sub="Annualized std deviation" color={hasPortfolio && stats.vol > 15 ? RED : GOLD} />
        <KPI label="Sharpe Ratio" value={hasPortfolio ? stats.sharpe : "0.91"}
          sub="Risk-adj return (RF=5%)" color={hasPortfolio && stats.sharpe < 0.7 ? RED : GREEN} />
        <KPI label="Beta vs S&P 500" value={hasPortfolio ? stats.wBeta : "0.94"}
          sub="Market sensitivity" color={GOLD} />
        <KPI label="Max Drawdown" value={`${hasPortfolio ? stats.maxDD : -22.1}%`}
          sub="Historical worst peak→trough" color={RED} />
        <KPI label="VaR 95% (Daily)" value={`-${hasPortfolio ? stats.varDaily.toFixed(2) : "0.98"}%`}
          sub="Daily loss at 95% confidence" color={RED} />
        <KPI label="Diversification Score" value={`${hasPortfolio ? stats.divScore : 74}/100`}
          sub="Holdings breadth & correlation" color={hasPortfolio && stats.divScore < 40 ? RED : GREEN} />
        <KPI label="Holdings" value={hasPortfolio ? stats.count : "—"}
          sub={hasPortfolio ? fmt(stats.totalVal) + " total" : "Add in My Portfolio"} color={GOLD} />
      </div>

      {/* ── Radar + Donut Row ── */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem" }}>
        {/* Radar */}
        <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem" }}>
          <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:4,
            letterSpacing:"0.06em",textTransform:"uppercase" }}>
            Risk Dimension Radar
          </div>
          <div style={{ fontSize:"0.625rem",color:"var(--text-3)",marginBottom:"0.75rem" }}>
            8-axis risk profile · Scale 0–100
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border-c)" />
              <PolarAngleAxis dataKey="dim" tick={{ fill:"var(--text-3)",fontSize:10 }} />
              <PolarRadiusAxis angle={30} domain={[0,100]} tick={false} axisLine={false} />
              <Radar name="Benchmark" dataKey="benchmark" stroke="rgba(255,255,255,0.15)"
                fill="var(--border-c)" />
              <Radar name="Your Portfolio" dataKey="score" stroke={GOLD}
                fill={GOLD} fillOpacity={0.18} dot={{ fill:GOLD,r:3 }} />
              <Tooltip content={<CustomTip />} />
            </RadarChart>
          </ResponsiveContainer>
          <div style={{ display:"flex",gap:"1rem",justifyContent:"center",marginTop:4 }}>
            {[["Your Portfolio",GOLD],["Benchmark","rgba(255,255,255,0.3)"]].map(([l,c]) => (
              <div key={l} style={{ display:"flex",alignItems:"center",gap:4,fontSize:"0.625rem",color:"var(--text-3)" }}>
                <div style={{ width:8,height:8,borderRadius:"50%",background:c }} />{l}
              </div>
            ))}
          </div>
        </div>

        {/* Donut */}
        <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem" }}>
          <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:4,
            letterSpacing:"0.06em",textTransform:"uppercase" }}>
            Asset Allocation
          </div>
          <div style={{ fontSize:"0.625rem",color:"var(--text-3)",marginBottom:"0.75rem" }}>
            {hasPortfolio ? "Your current portfolio" : "Classic 60/40 benchmark shown"}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={alloc} cx="50%" cy="50%" innerRadius={60} outerRadius={95}
                dataKey="value" paddingAngle={2}>
                {alloc.map((e,i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} content={<CustomTip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"2px 12px",marginTop:4 }}>
            {alloc.map((a,i) => (
              <div key={i} style={{ display:"flex",alignItems:"center",gap:4,fontSize:"0.5625rem",color:"var(--text-2)" }}>
                <div style={{ width:6,height:6,borderRadius:"50%",background:a.color,flexShrink:0 }} />
                <span style={{ minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                  {a.name}
                </span>
                <span style={{ marginLeft:"auto",fontWeight:700,color:"var(--text-1)" }}>{a.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Portfolio Summary (if entered) ── */}
      {hasPortfolio && (
        <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem" }}>
          <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:"0.75rem",
            letterSpacing:"0.06em",textTransform:"uppercase" }}>Portfolio Summary</div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:"0.5rem" }}>
            {[
              ["Total Value", fmt(stats.totalVal)],
              ["Total Cost Basis", fmt(stats.totalCost)],
              ["Unrealized Gain/Loss", fmt(stats.gainLoss)],
              ["Return on Cost", fmtPct(stats.gainLossPct)],
              ["Largest Position", `${stats.maxWt}%`],
              ["Weighted Beta", stats.wBeta],
            ].map(([l,v],i) => (
              <div key={i} style={{ padding:"0.5rem 0.75rem",background:"var(--elevated)",
                borderRadius:6,border:"1px solid var(--border-c)" }}>
                <div style={{ fontSize:"0.5rem",color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"0.08em" }}>{l}</div>
                <div style={{ fontSize:"0.9375rem",fontWeight:800,color:GOLD,marginTop:2 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Model Benchmark Comparison ── */}
      <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem" }}>
        <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:"0.25rem",
          letterSpacing:"0.06em",textTransform:"uppercase" }}>Model Benchmark Quick Comparison</div>
        <div style={{ fontSize:"0.625rem",color:"var(--text-3)",marginBottom:"0.875rem" }}>
          Your portfolio vs key institutional models
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%",borderCollapse:"collapse",fontSize:"0.6875rem" }}>
            <thead>
              <tr style={{ borderBottom:"1px solid var(--border-c)" }}>
                {["Model","Risk Lvl","Target Return","Volatility","Sharpe","Max Drawdown","Best Year","Worst Year"].map(h => (
                  <th key={h} style={{ padding:"6px 10px",textAlign:"left",color:"var(--text-3)",
                    fontWeight:600,fontSize:"0.5625rem",letterSpacing:"0.08em",textTransform:"uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hasPortfolio && (
                <tr style={{ background:"rgba(201,169,110,0.06)",borderBottom:"1px solid var(--border-c)" }}>
                  <td style={{ padding:"7px 10px",fontWeight:700,color:GOLD }}>⭐ Your Portfolio</td>
                  <td style={{ padding:"7px 10px",color:riskColor(stats.riskScore/10) }}>{Math.round(stats.riskScore/10)}/10</td>
                  <td style={{ padding:"7px 10px",color:"var(--text-1)" }}>—</td>
                  <td style={{ padding:"7px 10px",color:"var(--text-1)" }}>{stats.vol}%</td>
                  <td style={{ padding:"7px 10px",color:stats.sharpe >= 0.8 ? GREEN : YELLOW }}>{stats.sharpe}</td>
                  <td style={{ padding:"7px 10px",color:RED }}>{stats.maxDD}%</td>
                  <td style={{ padding:"7px 10px",color:"var(--text-1)" }}>—</td>
                  <td style={{ padding:"7px 10px",color:"var(--text-1)" }}>—</td>
                </tr>
              )}
              {[5,7,9,12,17].map(id => {
                const m = PORTFOLIO_MODELS.find(x => x.id === id);
                return (
                  <tr key={id} style={{ borderBottom:"1px solid var(--border-c)" }}>
                    <td style={{ padding:"7px 10px",color:"var(--text-1)",fontWeight:600 }}>{m.name}</td>
                    <td style={{ padding:"7px 10px" }}>
                      <span style={{ color:riskColor(m.riskLevel),fontWeight:700 }}>{m.riskLevel}/10</span>
                    </td>
                    <td style={{ padding:"7px 10px",color:"var(--text-2)" }}>{m.targetReturnMin}–{m.targetReturnMax}%</td>
                    <td style={{ padding:"7px 10px",color:"var(--text-1)" }}>{m.volatility}%</td>
                    <td style={{ padding:"7px 10px",color:m.sharpe >= 0.88 ? GREEN : YELLOW }}>{m.sharpe}</td>
                    <td style={{ padding:"7px 10px",color:RED }}>{m.maxDrawdown}%</td>
                    <td style={{ padding:"7px 10px",color:GREEN }}>+{m.bestYear}%</td>
                    <td style={{ padding:"7px 10px",color:RED }}>{m.worstYear}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
