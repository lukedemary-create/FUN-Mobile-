import React, { useState, useContext } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { PORTFOLIO_MODELS, GOLD, GREEN, RED, YELLOW, riskColor, riskLabel, getTickerExpenseRatio } from "./riskData";
import { RiskContext } from "../RiskAnalysis";

const CATEGORIES = ["All","Ultra Conservative","Conservative","Moderately Conservative",
                    "Moderate","Moderately Aggressive","Aggressive","Very Aggressive","Income","Alternative"];
const RISK_FILTERS = ["All","1–2","3–4","5–6","7–8","9–10"];
const SORT_OPTIONS = ["Risk Level ↑","Risk Level ↓","Return ↑","Return ↓","Sharpe ↓","Max Drawdown"];

function miniAlloc(allocation) {
  return (
    <ResponsiveContainer width="100%" height={90}>
      <PieChart>
        <Pie data={allocation} cx="50%" cy="50%" innerRadius={22} outerRadius={40} dataKey="weight" paddingAngle={1}>
          {allocation.map((e,i) => <Cell key={i} fill={e.color}/>)}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

/* ── Risk bar ─────────────────────────────────────────────────────── */
function RiskBar({ level }) {
  return (
    <div style={{ display:"flex",gap:2,alignItems:"center" }}>
      {Array.from({length:10}).map((_,i) => (
        <div key={i} style={{
          height:5,flex:1,borderRadius:1,
          background: i < level ? riskColor(level) : "rgba(255,255,255,0.06)",
        }}/>
      ))}
      <span style={{ fontSize:"0.5625rem",color:riskColor(level),fontWeight:700,marginLeft:4,whiteSpace:"nowrap" }}>
        {level}/10
      </span>
    </div>
  );
}

/* ── Weighted average expense ratio ──────────────────────────────── */
function calcWeightedExpense(allocation) {
  let weightedSum = 0, totalWeight = 0;
  allocation.forEach(a => {
    const er = getTickerExpenseRatio(a.ticker);
    if (er !== null) { weightedSum += er * a.weight; totalWeight += a.weight; }
  });
  return totalWeight > 0 ? (weightedSum / totalWeight).toFixed(3) : null;
}

/* ── Model Card ───────────────────────────────────────────────────── */
function ModelCard({ model, expanded, onToggle, matchScore }) {
  const rl = model.riskLevel;
  const weightedER = calcWeightedExpense(model.allocation);

  return (
    <div style={{
      background:"var(--surface)",
      border: expanded ? "1px solid rgba(201,168,76,0.35)" : "1px solid var(--border-c)",
      borderRadius:9,overflow:"hidden",transition:"border-color 0.2s, box-shadow 0.2s",
      boxShadow: expanded ? "0 0 0 1px rgba(201,168,76,0.1),0 6px 28px rgba(0,0,0,0.35)" : "none",
    }}>
      {/* ── Card header (always visible) ── */}
      <div style={{ padding:"0.875rem 1rem",display:"flex",gap:"0.75rem",alignItems:"flex-start" }}>
        {/* Number badge */}
        <div style={{ width:30,height:30,borderRadius:7,background:`${riskColor(rl)}18`,
          border:`1px solid ${riskColor(rl)}35`,display:"flex",alignItems:"center",
          justifyContent:"center",flexShrink:0 }}>
          <span style={{ fontSize:"0.6875rem",fontWeight:900,color:riskColor(rl) }}>{model.id}</span>
        </div>

        <div style={{ flex:1,minWidth:0 }}>
          {/* Name + match badge */}
          <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:6,marginBottom:2 }}>
            <div style={{ fontWeight:800,fontSize:"0.8125rem",color:"var(--text-1)",lineHeight:1.2 }}>
              {model.name}
            </div>
            {matchScore !== null && (
              <div style={{ fontSize:"0.5rem",fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",
                color:matchScore>=80?GREEN:matchScore>=50?YELLOW:RED,flexShrink:0,
                background:matchScore>=80?"rgba(34,197,94,0.1)":matchScore>=50?"rgba(234,179,8,0.1)":"rgba(239,68,68,0.1)",
                border:`1px solid ${matchScore>=80?"rgba(34,197,94,0.2)":matchScore>=50?"rgba(234,179,8,0.2)":"rgba(239,68,68,0.2)"}`,
                borderRadius:4,padding:"2px 7px",
              }}>
                {matchScore}% match
              </div>
            )}
          </div>

          <div style={{ fontSize:"0.5625rem",color:"var(--text-3)",marginBottom:6 }}>{model.category}</div>
          <RiskBar level={rl}/>

          {/* Quick stats row */}
          <div style={{ display:"flex",gap:"0.875rem",marginTop:8,flexWrap:"wrap" }}>
            {[
              ["Target", `${model.targetReturnMin}–${model.targetReturnMax}%`, GOLD],
              ["Vol",    `${model.volatility}%`,                               "var(--text-2)"],
              ["Sharpe", `${model.sharpe}`,                                    model.sharpe>=0.88?GREEN:YELLOW],
              ["Max DD", `${model.maxDrawdown}%`,                              RED],
              ...(weightedER !== null ? [["Avg ER", `${weightedER}%`, "var(--text-2)"]] : []),
            ].map(([l,v,c])=>(
              <div key={l}>
                <div style={{ fontSize:"0.4375rem",color:"var(--text-3)",textTransform:"uppercase",
                  letterSpacing:"0.08em" }}>{l}</div>
                <div style={{ fontSize:"0.6875rem",fontWeight:700,color:c }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Expand / Collapse button ── */}
      <button
        onClick={onToggle}
        style={{
          width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:5,
          padding:"0.4375rem 1rem",
          background: expanded ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.02)",
          border:"none",borderTop:"1px solid var(--border-c)",cursor:"pointer",
          color: expanded ? GOLD : "var(--text-3)",
          fontSize:"0.5625rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",
          transition:"background 0.15s, color 0.15s",
        }}
      >
        {expanded
          ? <><ChevronUp size={11}/> Hide Allocation &amp; Details</>
          : <><ChevronDown size={11}/> View Allocation &amp; Holdings</>
        }
      </button>

      {/* ── Expanded panel ── */}
      {expanded && (
        <div style={{ padding:"1rem",borderTop:"1px solid rgba(201,168,76,0.12)" }}>

          {/* Description */}
          <div style={{ fontSize:"0.6875rem",color:"var(--text-2)",lineHeight:1.65,marginBottom:"1rem",
            padding:"0.625rem 0.75rem",background:"rgba(201,168,76,0.04)",
            borderLeft:"2px solid rgba(201,168,76,0.3)",borderRadius:"0 6px 6px 0" }}>
            {model.description}
          </div>

          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem" }}>

            {/* ── LEFT: Allocation breakdown with bars ── */}
            <div>
              <div style={{ fontSize:"0.5rem",color:"var(--text-3)",letterSpacing:"0.1em",
                textTransform:"uppercase",marginBottom:"0.625rem",fontWeight:600 }}>
                Holdings Breakdown
              </div>

              {/* Donut */}
              {miniAlloc(model.allocation)}

              {/* Weight bars */}
              <div style={{ display:"flex",flexDirection:"column",gap:"0.5rem",marginTop:"0.625rem" }}>
                {model.allocation.map((a, i) => {
                  const er = getTickerExpenseRatio(a.ticker);
                  const tickers = a.ticker.split("/").map(t=>t.trim()).filter(Boolean);
                  return (
                    <div key={i}>
                      {/* Name + weight */}
                      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:3 }}>
                        <div style={{ display:"flex",alignItems:"center",gap:5,minWidth:0 }}>
                          <div style={{ width:7,height:7,borderRadius:"50%",background:a.color,flexShrink:0 }}/>
                          <span style={{ fontSize:"0.5625rem",color:"var(--text-1)",fontWeight:600,
                            overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                            {a.name}
                          </span>
                        </div>
                        <span style={{ fontSize:"0.6875rem",fontWeight:800,color:a.color,
                          flexShrink:0,marginLeft:4 }}>{a.weight}%</span>
                      </div>

                      {/* Weight bar */}
                      <div style={{ height:5,background:"rgba(255,255,255,0.06)",borderRadius:3,marginBottom:4 }}>
                        <div style={{ height:"100%",width:`${a.weight}%`,background:a.color,
                          borderRadius:3,transition:"width 0.4s" }}/>
                      </div>

                      {/* Tickers + expense ratio */}
                      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
                        flexWrap:"wrap",gap:3 }}>
                        <div style={{ display:"flex",gap:3,flexWrap:"wrap" }}>
                          {tickers.map(t => (
                            <span key={t} style={{ fontSize:"0.5rem",fontWeight:800,letterSpacing:"0.05em",
                              color:"var(--text-2)",background:"var(--elevated)",
                              border:"1px solid var(--border-c)",borderRadius:4,padding:"1px 5px",
                              fontFamily:"monospace" }}>
                              {t}
                            </span>
                          ))}
                        </div>
                        {er !== null && (
                          <span style={{ fontSize:"0.4375rem",color:"var(--text-3)",letterSpacing:"0.06em" }}>
                            ER: {er.toFixed(2)}%
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Weighted avg expense ratio */}
              {weightedER !== null && (
                <div style={{ marginTop:"0.875rem",padding:"0.5rem 0.75rem",
                  background:"var(--elevated)",borderRadius:6,
                  border:"1px solid var(--border-c)",
                  display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <span style={{ fontSize:"0.5rem",color:"var(--text-3)",textTransform:"uppercase",
                    letterSpacing:"0.08em" }}>Weighted Avg Expense Ratio</span>
                  <span style={{ fontSize:"0.75rem",fontWeight:800,
                    color: parseFloat(weightedER)<0.1?GREEN:parseFloat(weightedER)<0.3?YELLOW:RED }}>
                    {weightedER}% / yr
                  </span>
                </div>
              )}
            </div>

            {/* ── RIGHT: Stats + Best For + Projections ── */}
            <div style={{ display:"flex",flexDirection:"column",gap:"0.5rem" }}>
              <div style={{ fontSize:"0.5rem",color:"var(--text-3)",letterSpacing:"0.1em",
                textTransform:"uppercase",marginBottom:2,fontWeight:600 }}>
                Key Statistics
              </div>

              {[
                ["Annualized Volatility", `${model.volatility}%`,    "var(--text-1)"],
                ["Sharpe Ratio (RF=5%)",  `${model.sharpe}`,          model.sharpe>=0.88?GREEN:YELLOW],
                ["Max Drawdown (hist.)",  `${model.maxDrawdown}%`,    RED],
                ["Best Calendar Year",   `+${model.bestYear}%`,       GREEN],
                ["Worst Calendar Year",  `${model.worstYear}%`,       RED],
                ["Est. Dividend Yield",  `${model.yield}%`,           model.yield>2?GREEN:"var(--text-1)"],
              ].map(([l,v,c])=>(
                <div key={l} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",
                  padding:"5px 8px",background:"var(--elevated)",borderRadius:5 }}>
                  <span style={{ fontSize:"0.5625rem",color:"var(--text-3)" }}>{l}</span>
                  <span style={{ fontSize:"0.75rem",fontWeight:700,color:c }}>{v}</span>
                </div>
              ))}

              {/* Best For */}
              <div style={{ padding:"0.625rem 0.75rem",background:"rgba(201,168,76,0.05)",
                border:"1px solid rgba(201,168,76,0.15)",borderRadius:6,marginTop:4 }}>
                <div style={{ fontSize:"0.4375rem",color:GOLD,letterSpacing:"0.12em",
                  textTransform:"uppercase",marginBottom:4,fontWeight:700 }}>Best For</div>
                <div style={{ fontSize:"0.625rem",color:"var(--text-2)",lineHeight:1.55 }}>{model.bestFor}</div>
              </div>

              {/* Growth projections */}
              <div style={{ padding:"0.625rem 0.75rem",background:"var(--elevated)",
                border:"1px solid var(--border-c)",borderRadius:6 }}>
                <div style={{ fontSize:"0.4375rem",color:"var(--text-3)",letterSpacing:"0.1em",
                  textTransform:"uppercase",marginBottom:"0.5rem",fontWeight:600 }}>
                  $100,000 Growth (mid return)
                </div>
                {[10,20,30].map(yr => {
                  const mid = (model.targetReturnMin + model.targetReturnMax) / 2 / 100;
                  const val = Math.round(100000 * Math.pow(1+mid, yr));
                  const x   = Math.round(val/1000);
                  return (
                    <div key={yr} style={{ display:"flex",justifyContent:"space-between",
                      alignItems:"center",marginBottom:4 }}>
                      <span style={{ fontSize:"0.5625rem",color:"var(--text-3)" }}>{yr} yrs</span>
                      <div style={{ flex:1,mx:8,height:3,background:"rgba(255,255,255,0.05)",
                        borderRadius:2,margin:"0 8px",overflow:"hidden" }}>
                        <div style={{ height:"100%",width:`${Math.min(100,(x/2000)*100)}%`,
                          background:GREEN,borderRadius:2 }}/>
                      </div>
                      <span style={{ fontSize:"0.5625rem",fontWeight:800,color:GREEN,minWidth:56,textAlign:"right" }}>
                        ${x.toLocaleString()}K
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────────────── */
export default function TabModelLibrary() {
  const { profile } = useContext(RiskContext);
  const [category, setCategory] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Risk Level ↑");
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");

  const toggle = (id) => setExpanded(e => e === id ? null : id);

  const filtered = PORTFOLIO_MODELS
    .filter(m => {
      if (category !== "All" && m.category !== category) return false;
      if (riskFilter !== "All") {
        const [lo,hi] = riskFilter.split("–").map(Number);
        if (m.riskLevel < lo || m.riskLevel > hi) return false;
      }
      if (search) {
        const s = search.toLowerCase();
        return m.name.toLowerCase().includes(s) || m.category.toLowerCase().includes(s) ||
               m.allocation.some(a => a.ticker.toLowerCase().includes(s) || a.name.toLowerCase().includes(s));
      }
      return true;
    })
    .sort((a,b) => {
      if (sortBy==="Risk Level ↑") return a.riskLevel - b.riskLevel;
      if (sortBy==="Risk Level ↓") return b.riskLevel - a.riskLevel;
      if (sortBy==="Return ↑") return a.targetReturnMin - b.targetReturnMin;
      if (sortBy==="Return ↓") return b.targetReturnMax - a.targetReturnMax;
      if (sortBy==="Sharpe ↓") return b.sharpe - a.sharpe;
      if (sortBy==="Max Drawdown") return b.maxDrawdown - a.maxDrawdown;
      return 0;
    });

  const matchScore = (model) => {
    if (!profile) return null;
    const diff = Math.abs(model.riskLevel - profile.riskLevel);
    return Math.max(0, Math.round(100 - diff * 14));
  };

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:"1rem" }}>
      {/* ── Controls ── */}
      <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"0.875rem" }}>
        <div style={{ display:"flex",alignItems:"center",gap:"0.75rem",flexWrap:"wrap" }}>
          <Filter size={13} style={{ color:"var(--text-3)",flexShrink:0 }}/>

          {/* Search */}
          <input
            value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search models or tickers…"
            style={{ flex:"1 1 160px",background:"var(--elevated)",border:"1px solid var(--border-c)",
              borderRadius:6,padding:"5px 10px",color:"var(--text-1)",fontSize:"0.75rem",outline:"none",minWidth:120 }}
          />

          {/* Category filter */}
          <select value={category} onChange={e=>setCategory(e.target.value)}
            style={{ background:"var(--elevated)",border:"1px solid var(--border-c)",borderRadius:6,
              padding:"5px 8px",color:"var(--text-2)",fontSize:"0.6875rem",cursor:"pointer" }}>
            {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
          </select>

          {/* Risk filter */}
          <select value={riskFilter} onChange={e=>setRiskFilter(e.target.value)}
            style={{ background:"var(--elevated)",border:"1px solid var(--border-c)",borderRadius:6,
              padding:"5px 8px",color:"var(--text-2)",fontSize:"0.6875rem",cursor:"pointer" }}>
            {RISK_FILTERS.map(r=><option key={r} value={r}>Risk {r}</option>)}
          </select>

          {/* Sort */}
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
            style={{ background:"var(--elevated)",border:"1px solid var(--border-c)",borderRadius:6,
              padding:"5px 8px",color:"var(--text-2)",fontSize:"0.6875rem",cursor:"pointer" }}>
            {SORT_OPTIONS.map(s=><option key={s}>{s}</option>)}
          </select>

          <div style={{ marginLeft:"auto",fontSize:"0.625rem",color:"var(--text-3)" }}>
            {filtered.length} of {PORTFOLIO_MODELS.length} models
          </div>
        </div>
      </div>

      {!profile && (
        <div style={{ fontSize:"0.75rem",color:"var(--text-3)",
          background:"rgba(201,168,76,0.04)",border:"1px solid rgba(201,168,76,0.12)",
          borderRadius:7,padding:"0.625rem 1rem" }}>
          💡 Complete the <strong style={{ color:GOLD }}>Investor Profile</strong> questionnaire to see personalized match scores for each model.
        </div>
      )}

      {/* ── Model Cards Grid ── */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:"0.75rem" }}>
        {filtered.map(m => (
          <ModelCard
            key={m.id}
            model={m}
            expanded={expanded === m.id}
            onToggle={() => toggle(m.id)}
            matchScore={matchScore(m)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign:"center",padding:"3rem 1rem",color:"var(--text-3)",fontSize:"0.75rem" }}>
          No models match your current filters.
        </div>
      )}
    </div>
  );
}
