import React, { useContext, useMemo, useState } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, ReferenceLine,
} from "recharts";
import { RiskContext } from "../RiskAnalysis";
import { PORTFOLIO_MODELS, ASSET_CLASSES, CORRELATION_MATRIX, GOLD, GREEN, RED, YELLOW } from "./riskData";

const fmt = (n) => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",
  minimumFractionDigits:0,maximumFractionDigits:0}).format(n);

/* ── Efficient frontier points ───────────────────────────────────── */
function buildFrontier() {
  // Sample points along the efficient frontier
  const points = [];
  for (let risk = 2; risk <= 22; risk += 0.5) {
    // Approximate Markowitz frontier: return = a*risk^0.5 + b*risk - c
    const expectedReturn = 1.2 * Math.pow(risk, 0.7) + 0.8;
    points.push({ risk: +risk.toFixed(1), expectedReturn: +expectedReturn.toFixed(2) });
  }
  return points;
}

/* ── Correlation heatmap color ───────────────────────────────────── */
function corrColor(val) {
  if (val >= 0.8) return { bg:"rgba(239,68,68,0.3)",   text:RED };
  if (val >= 0.5) return { bg:"rgba(249,115,22,0.2)",   text:"#f97316" };
  if (val >= 0.2) return { bg:"rgba(234,179,8,0.15)",   text:YELLOW };
  if (val >= -0.1)return { bg:"rgba(255,255,255,0.04)", text:"var(--text-3)" };
  return            { bg:"rgba(34,197,94,0.15)",        text:GREEN };
}

/* ── Scatter tooltip ─────────────────────────────────────────────── */
const FrontierTip = ({ active, payload }) => {
  if (!active||!payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{ background:"var(--elevated)",border:"1px solid var(--border-c)",
      borderRadius:6,padding:"7px 10px",fontSize:"0.6875rem" }}>
      {d.name && <div style={{ color:d.color||GOLD,fontWeight:700,marginBottom:2 }}>{d.name}</div>}
      <div style={{ color:"var(--text-2)" }}>Risk (Vol): <strong style={{ color:"var(--text-1)" }}>{d.risk}%</strong></div>
      <div style={{ color:"var(--text-2)" }}>Return: <strong style={{ color:GREEN }}>{d.expectedReturn}%</strong></div>
      {d.sharpe && <div style={{ color:"var(--text-2)" }}>Sharpe: <strong style={{ color:GOLD }}>{d.sharpe}</strong></div>}
    </div>
  );
};

/* ── Rebalancing analyzer ────────────────────────────────────────── */
function RebalancingAnalyzer({ portfolio }) {
  const [targetModel, setTargetModel] = useState(7);
  const model = PORTFOLIO_MODELS.find(m=>m.id===targetModel)||PORTFOLIO_MODELS[6];
  const totalVal = portfolio.reduce((s,h)=>s+(parseFloat(h.value)||0),0);

  if (!portfolio.length||!totalVal) {
    return (
      <div style={{ textAlign:"center",padding:"1.5rem",color:"var(--text-3)",fontSize:"0.75rem" }}>
        Add holdings in the <strong style={{ color:GOLD }}>My Portfolio</strong> tab to use the rebalancing analyzer.
      </div>
    );
  }

  // Current allocation by asset class
  const current = {};
  portfolio.forEach(h=>{
    const k=h.assetClass||"Other";
    current[k]=(current[k]||0)+(parseFloat(h.value)||0);
  });

  // Target from model (simplified mapping)
  const target = {};
  model.allocation.forEach(a=>{
    const k=a.name;
    target[k]=(a.weight/100)*totalVal;
  });

  const drift5 = Object.values(current).some(v=>{
    const pct=v/totalVal*100;
    return Math.abs(pct-20)>5; // simplified 5% rule
  });

  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.75rem",flexWrap:"wrap" }}>
        <div style={{ fontSize:"0.5625rem",color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"0.08em" }}>
          Target Model:
        </div>
        <select value={targetModel} onChange={e=>setTargetModel(Number(e.target.value))}
          style={{ background:"var(--elevated)",border:"1px solid var(--border-c)",borderRadius:6,
            padding:"5px 8px",color:"var(--text-1)",fontSize:"0.75rem",cursor:"pointer" }}>
          {PORTFOLIO_MODELS.map(m=>(
            <option key={m.id} value={m.id}>#{m.id} {m.name}</option>
          ))}
        </select>
        {drift5 && (
          <div style={{ fontSize:"0.625rem",color:YELLOW,background:"rgba(234,179,8,0.08)",
            border:"1px solid rgba(234,179,8,0.2)",borderRadius:5,padding:"3px 8px" }}>
            ⚠ Drift detected — consider rebalancing
          </div>
        )}
      </div>

      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%",borderCollapse:"collapse",fontSize:"0.6875rem" }}>
          <thead>
            <tr style={{ borderBottom:"1px solid var(--border-c)" }}>
              {["Asset Class","Current Value","Current %","Target %","Difference","Action"].map(h=>(
                <th key={h} style={{ padding:"5px 8px",textAlign:"left",fontSize:"0.5rem",
                  color:"var(--text-3)",letterSpacing:"0.08em",textTransform:"uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {model.allocation.map((a,i)=>{
              // find closest matching holding
              const curVal = Object.entries(current).find(([k])=>k.includes(a.name.split(" ")[0]))?.[1] || 0;
              const curPct = totalVal>0?curVal/totalVal*100:0;
              const tgtPct = a.weight;
              const diff   = curPct - tgtPct;
              const action = Math.abs(diff)<2?"Hold":diff>0?"Trim":"Add";
              const actionColor = action==="Hold"?GREEN:action==="Trim"?YELLOW:RED;
              return (
                <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding:"7px 8px",color:"var(--text-1)",fontWeight:600 }}>{a.name}</td>
                  <td style={{ padding:"7px 8px",color:"var(--text-2)",fontFamily:"monospace" }}>{fmt(curVal)}</td>
                  <td style={{ padding:"7px 8px",color:"var(--text-2)" }}>{curPct.toFixed(1)}%</td>
                  <td style={{ padding:"7px 8px",color:GOLD,fontWeight:700 }}>{tgtPct}%</td>
                  <td style={{ padding:"7px 8px",color:Math.abs(diff)<2?GREEN:Math.abs(diff)<5?YELLOW:RED,fontWeight:700 }}>
                    {diff>=0?"+":""}{diff.toFixed(1)}%
                  </td>
                  <td style={{ padding:"7px 8px" }}>
                    <span style={{ fontSize:"0.5rem",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",
                      color:actionColor,background:`${actionColor}12`,border:`1px solid ${actionColor}30`,
                      borderRadius:4,padding:"2px 6px" }}>{action}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────────────── */
export default function TabOptimization() {
  const { portfolio } = useContext(RiskContext);
  const [targetReturn, setTargetReturn] = useState(8);
  const [maxRisk,      setMaxRisk]      = useState(12);

  const frontierData = useMemo(()=>buildFrontier(), []);

  /* Model scatter points */
  const modelPoints = PORTFOLIO_MODELS.map(m=>({
    name: `#${m.id} ${m.name}`,
    risk: m.volatility,
    expectedReturn: (m.targetReturnMin+m.targetReturnMax)/2,
    sharpe: m.sharpe,
    color: m.riskLevel<=3?"#22c55e":m.riskLevel<=5?"#c9a84c":m.riskLevel<=7?"#f97316":"#ef4444",
  }));

  /* Optimal by target return */
  const optimalReturn = PORTFOLIO_MODELS.reduce((best,m)=>{
    const mid=(m.targetReturnMin+m.targetReturnMax)/2;
    if(Math.abs(mid-targetReturn)<Math.abs((best.targetReturnMin+best.targetReturnMax)/2-targetReturn))
      return m;
    return best;
  }, PORTFOLIO_MODELS[0]);

  /* Optimal by max risk */
  const optimalRisk = PORTFOLIO_MODELS.filter(m=>m.volatility<=maxRisk)
    .reduce((best,m)=>(!best||(m.targetReturnMin+m.targetReturnMax)>(best.targetReturnMin+best.targetReturnMax))?m:best, null);

  /* Max Sharpe */
  const maxSharpe = PORTFOLIO_MODELS.reduce((best,m)=>m.sharpe>best.sharpe?m:best, PORTFOLIO_MODELS[0]);

  /* Min Vol */
  const minVol = PORTFOLIO_MODELS.reduce((best,m)=>m.volatility<best.volatility?m:best, PORTFOLIO_MODELS[0]);

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:"1rem" }}>

      {/* ── Efficient Frontier ── */}
      <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem" }}>
        <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:4,
          letterSpacing:"0.06em",textTransform:"uppercase" }}>Efficient Frontier — Risk vs Return</div>
        <div style={{ fontSize:"0.625rem",color:"var(--text-3)",marginBottom:"0.75rem",lineHeight:1.6 }}>
          The curve shows the maximum return achievable for each level of risk (Markowitz, 1952).
          Points above the curve = inefficient. Every model plotted against the frontier.
        </div>
        <ResponsiveContainer width="100%" height={340}>
          <ScatterChart margin={{ left:0,right:20,top:10,bottom:0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
            <XAxis type="number" dataKey="risk" name="Volatility"
              tickFormatter={v=>v+"%"} tick={{ fill:"var(--text-3)",fontSize:10 }}
              label={{ value:"Volatility (Risk)", position:"insideBottom", offset:-4, fill:"var(--text-3)", fontSize:10 }}
              domain={[0,30]}/>
            <YAxis type="number" dataKey="expectedReturn" name="Expected Return"
              tickFormatter={v=>v+"%"} tick={{ fill:"var(--text-3)",fontSize:10 }}
              label={{ value:"Expected Return (%)", angle:-90, position:"insideLeft", fill:"var(--text-3)", fontSize:10 }}
              domain={[0,18]}/>
            <Tooltip content={<FrontierTip/>}/>
            {/* Frontier line */}
            <Scatter data={frontierData} line={{ stroke:GOLD,strokeWidth:2 }} lineType="monotone"
              shape={() => null} name="Frontier"/>
            {/* Model dots */}
            <Scatter data={modelPoints} name="Models"
              shape={(props) => {
                const { cx,cy,payload } = props;
                return (
                  <g>
                    <circle cx={cx} cy={cy} r={6} fill={payload.color} opacity={0.85}/>
                  </g>
                );
              }}/>
          </ScatterChart>
        </ResponsiveContainer>
        <div style={{ display:"flex",gap:"1rem",flexWrap:"wrap",marginTop:4 }}>
          {[["Conservative",GREEN],["Moderate",GOLD],["Aggressive","#f97316"],["Very Aggressive",RED]].map(([l,c])=>(
            <div key={l} style={{ display:"flex",alignItems:"center",gap:4,fontSize:"0.5rem",color:"var(--text-3)" }}>
              <div style={{ width:8,height:8,borderRadius:"50%",background:c }}/>{l}
            </div>
          ))}
          <div style={{ display:"flex",alignItems:"center",gap:4,fontSize:"0.5rem",color:"var(--text-3)" }}>
            <div style={{ width:20,height:2,background:GOLD }}/> Efficient Frontier
          </div>
        </div>
      </div>

      {/* ── Optimization Tools ── */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:"0.75rem" }}>

        {/* Target return optimizer */}
        <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem" }}>
          <div style={{ fontSize:"0.5625rem",color:"var(--text-3)",letterSpacing:"0.1em",
            textTransform:"uppercase",marginBottom:"0.75rem" }}>Minimize Risk for Target Return</div>
          <div style={{ marginBottom:"0.75rem" }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
              <span style={{ fontSize:"0.5625rem",color:"var(--text-3)" }}>Target return</span>
              <span style={{ fontSize:"0.875rem",fontWeight:800,color:GOLD }}>{targetReturn}%</span>
            </div>
            <input type="range" min={3} max={14} step={0.5} value={targetReturn}
              onChange={e=>setTargetReturn(Number(e.target.value))}
              style={{ width:"100%",accentColor:GOLD,cursor:"pointer" }}/>
          </div>
          {optimalReturn && (
            <div style={{ padding:"0.75rem",background:"rgba(34,197,94,0.06)",
              border:"1px solid rgba(34,197,94,0.15)",borderRadius:7 }}>
              <div style={{ fontSize:"0.5rem",color:GREEN,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4 }}>
                Optimal Model
              </div>
              <div style={{ fontWeight:800,color:"var(--text-1)",marginBottom:2 }}>{optimalReturn.name}</div>
              <div style={{ fontSize:"0.625rem",color:"var(--text-3)" }}>
                {optimalReturn.volatility}% vol · {optimalReturn.targetReturnMin}–{optimalReturn.targetReturnMax}% return
              </div>
            </div>
          )}
        </div>

        {/* Max risk optimizer */}
        <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem" }}>
          <div style={{ fontSize:"0.5625rem",color:"var(--text-3)",letterSpacing:"0.1em",
            textTransform:"uppercase",marginBottom:"0.75rem" }}>Maximize Return for Max Risk Tolerance</div>
          <div style={{ marginBottom:"0.75rem" }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
              <span style={{ fontSize:"0.5625rem",color:"var(--text-3)" }}>Max volatility</span>
              <span style={{ fontSize:"0.875rem",fontWeight:800,color:GOLD }}>{maxRisk}%</span>
            </div>
            <input type="range" min={2} max={25} step={1} value={maxRisk}
              onChange={e=>setMaxRisk(Number(e.target.value))}
              style={{ width:"100%",accentColor:GOLD,cursor:"pointer" }}/>
          </div>
          {optimalRisk && (
            <div style={{ padding:"0.75rem",background:"rgba(34,197,94,0.06)",
              border:"1px solid rgba(34,197,94,0.15)",borderRadius:7 }}>
              <div style={{ fontSize:"0.5rem",color:GREEN,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4 }}>
                Max Return within Risk Budget
              </div>
              <div style={{ fontWeight:800,color:"var(--text-1)",marginBottom:2 }}>{optimalRisk.name}</div>
              <div style={{ fontSize:"0.625rem",color:"var(--text-3)" }}>
                {optimalRisk.volatility}% vol · {optimalRisk.targetReturnMin}–{optimalRisk.targetReturnMax}% return
              </div>
            </div>
          )}
        </div>

        {/* Max Sharpe */}
        <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem" }}>
          <div style={{ fontSize:"0.5625rem",color:"var(--text-3)",letterSpacing:"0.1em",
            textTransform:"uppercase",marginBottom:"0.75rem" }}>Maximum Sharpe Ratio Portfolio</div>
          <div style={{ fontSize:"0.625rem",color:"var(--text-3)",marginBottom:"0.75rem",lineHeight:1.5 }}>
            The portfolio with the best risk-adjusted return per unit of volatility.
          </div>
          <div style={{ padding:"0.75rem",background:"rgba(201,168,76,0.06)",
            border:"1px solid rgba(201,168,76,0.15)",borderRadius:7 }}>
            <div style={{ fontWeight:800,color:"var(--text-1)",marginBottom:4 }}>{maxSharpe.name}</div>
            <div style={{ fontSize:"1.25rem",fontWeight:900,color:GOLD }}>{maxSharpe.sharpe}</div>
            <div style={{ fontSize:"0.5rem",color:"var(--text-3)" }}>Sharpe Ratio</div>
            <div style={{ fontSize:"0.625rem",color:"var(--text-3)",marginTop:4 }}>
              {maxSharpe.volatility}% vol · {maxSharpe.targetReturnMin}–{maxSharpe.targetReturnMax}% return
            </div>
          </div>
        </div>

        {/* Min Vol */}
        <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem" }}>
          <div style={{ fontSize:"0.5625rem",color:"var(--text-3)",letterSpacing:"0.1em",
            textTransform:"uppercase",marginBottom:"0.75rem" }}>Minimum Volatility Portfolio</div>
          <div style={{ fontSize:"0.625rem",color:"var(--text-3)",marginBottom:"0.75rem",lineHeight:1.5 }}>
            The least volatile portfolio in the library. Prioritizes stability over return.
          </div>
          <div style={{ padding:"0.75rem",background:"rgba(34,197,94,0.06)",
            border:"1px solid rgba(34,197,94,0.15)",borderRadius:7 }}>
            <div style={{ fontWeight:800,color:"var(--text-1)",marginBottom:4 }}>{minVol.name}</div>
            <div style={{ fontSize:"1.25rem",fontWeight:900,color:GREEN }}>{minVol.volatility}%</div>
            <div style={{ fontSize:"0.5rem",color:"var(--text-3)" }}>Annualized volatility</div>
            <div style={{ fontSize:"0.625rem",color:"var(--text-3)",marginTop:4 }}>
              {minVol.targetReturnMin}–{minVol.targetReturnMax}% target return
            </div>
          </div>
        </div>
      </div>

      {/* ── Rebalancing Analyzer ── */}
      <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem" }}>
        <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:4,
          letterSpacing:"0.06em",textTransform:"uppercase" }}>Rebalancing Analyzer</div>
        <div style={{ fontSize:"0.625rem",color:"var(--text-3)",marginBottom:"0.75rem" }}>
          Compare your current portfolio vs target model allocation. Identifies drifts triggering rebalancing.
        </div>
        <RebalancingAnalyzer portfolio={portfolio}/>
      </div>

      {/* ── Correlation Matrix ── */}
      <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem",overflowX:"auto" }}>
        <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:4,
          letterSpacing:"0.06em",textTransform:"uppercase" }}>Asset Class Correlation Matrix</div>
        <div style={{ fontSize:"0.625rem",color:"var(--text-3)",marginBottom:"0.75rem",lineHeight:1.6 }}>
          Correlations between major asset classes (historical, 20-year).
          <span style={{ color:RED }}> Red = highly correlated (move together)</span> ·
          <span style={{ color:GREEN }}> Green = negative/low correlation (diversification benefit)</span>
        </div>
        <table style={{ borderCollapse:"collapse",fontSize:"0.5rem" }}>
          <thead>
            <tr>
              <th style={{ padding:"4px 6px",textAlign:"left",color:"var(--text-3)",
                fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase" }}></th>
              {ASSET_CLASSES.map(ac=>(
                <th key={ac} style={{ padding:"2px 2px",textAlign:"center",color:"var(--text-3)",
                  fontWeight:600,fontSize:"0.4375rem",letterSpacing:"0.03em",
                  writingMode:"vertical-lr",transform:"rotate(180deg)",height:70 }}>
                  {ac}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ASSET_CLASSES.map((row,i)=>(
              <tr key={row}>
                <td style={{ padding:"4px 6px",color:"var(--text-2)",fontWeight:600,
                  whiteSpace:"nowrap",fontSize:"0.5rem" }}>{row}</td>
                {ASSET_CLASSES.map((_,j)=>{
                  const val=CORRELATION_MATRIX[i][j];
                  const {bg,text}=corrColor(val);
                  return (
                    <td key={j} style={{ padding:"4px",textAlign:"center",background:bg,
                      minWidth:38,position:"relative" }}>
                      <span style={{ fontSize:"0.5rem",fontWeight:700,color:text }}>
                        {i===j?"—":val.toFixed(2)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop:"0.75rem",display:"flex",gap:"1.5rem",flexWrap:"wrap" }}>
          {[
            ["≥ 0.80 Highly Correlated",RED,"rgba(239,68,68,0.3)"],
            ["0.50–0.79 Moderate",      "#f97316","rgba(249,115,22,0.2)"],
            ["0.20–0.49 Low",           YELLOW,"rgba(234,179,8,0.15)"],
            ["-0.10–0.19 Minimal",      "var(--text-3)","rgba(255,255,255,0.04)"],
            ["< -0.10 Negative",        GREEN,"rgba(34,197,94,0.15)"],
          ].map(([l,c,bg])=>(
            <div key={l} style={{ display:"flex",alignItems:"center",gap:5,fontSize:"0.5rem",color:"var(--text-3)" }}>
              <div style={{ width:12,height:10,borderRadius:2,background:bg,border:`1px solid ${c}40` }}/>
              <span>{l}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
