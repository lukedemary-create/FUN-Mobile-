import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LineChart, Line, ReferenceLine,
} from "recharts";
import { STRESS_TESTS, PORTFOLIO_MODELS, GOLD, GREEN, RED, YELLOW, riskColor } from "./riskData";

const fmt = (n) => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",
  minimumFractionDigits:0,maximumFractionDigits:0}).format(n);

/* Color by drawdown severity */
const ddColor = (pct) => {
  if (pct > -10) return GREEN;
  if (pct > -20) return YELLOW;
  if (pct > -35) return "#f97316";
  return RED;
};

/* ── Crisis selector ─────────────────────────────────────────────── */
function CrisisCard({ event, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      textAlign:"left",padding:"0.75rem",borderRadius:8,cursor:"pointer",
      border:`1px solid ${selected?"rgba(239,68,68,0.4)":"var(--border-c)"}`,
      background: selected?"rgba(239,68,68,0.07)":"var(--surface)",
      transition:"all 0.15s",
    }}>
      <div style={{ fontWeight:700,fontSize:"0.6875rem",color:"var(--text-1)",marginBottom:2 }}>
        {event.name}
      </div>
      <div style={{ fontSize:"0.6875rem",color:"var(--text-3)",marginBottom:4 }}>{event.period}</div>
      <div style={{ fontSize:"0.875rem",fontWeight:900,color:RED }}>{event.sp500Drawdown}%</div>
      <div style={{ fontSize:"0.625rem",color:"var(--text-3)",letterSpacing:"0.06em",textTransform:"uppercase" }}>S&P 500</div>
    </button>
  );
}

/* ── Heatmap cell ─────────────────────────────────────────────────── */
function HeatCell({ value, label }) {
  const c = ddColor(value);
  const bg = value > -10 ? "rgba(34,197,94,0.12)"
           : value > -20 ? "rgba(234,179,8,0.12)"
           : value > -35 ? "rgba(249,115,22,0.12)"
           : "rgba(239,68,68,0.12)";
  return (
    <td style={{ padding:"5px 4px",textAlign:"center",background:bg }}>
      <div style={{ fontSize:"0.5625rem",fontWeight:700,color:c }}>{value}%</div>
    </td>
  );
}

/* ── Recovery chart (simulated path) ────────────────────────────────*/
function RecoveryChart({ event, models }) {
  // Simulate a drawdown path: decline linearly to max drawdown, then recover
  const weeks = 104; // 2 years of weekly data
  const declWeeks = 26;
  const data = [];

  for (let w=0; w<=weeks; w++) {
    const row = { week: w };
    models.forEach(m => {
      const dd = (event.modelDrawdowns[m.id]||0) / 100;
      const recovery = (m.targetReturnMin+m.targetReturnMax)/2/100/52;
      let val;
      if (w <= declWeeks) {
        val = 100000 * (1 + dd * (w/declWeeks));
      } else {
        const bottom = 100000 * (1+dd);
        val = bottom * Math.pow(1+recovery, w-declWeeks);
        val = Math.min(val, 100000 * 1.05); // cap at +5% for 2yr
      }
      row[`m${m.id}`] = Math.round(val);
    });
    if (w % 4 === 0) data.push({...row, label: w===0?"Start":w===declWeeks?"Trough":`Wk ${w}`});
  }

  const COLORS = [GOLD,"#3b82f6","#22c55e","#a855f7","#f97316"];
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)"/>
        <XAxis dataKey="label" tick={{ fill:"var(--text-3)",fontSize:9 }} interval={3}/>
        <YAxis tickFormatter={v=>fmt(v)} tick={{ fill:"var(--text-3)",fontSize:9 }} width={70}/>
        <ReferenceLine y={100000} stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" label={{ value:"Start", fill:"var(--text-3)",fontSize:9 }}/>
        <Tooltip formatter={(v)=>fmt(v)}
          contentStyle={{ background:"var(--elevated)",border:"1px solid var(--border-c)",borderRadius:6,fontSize:"0.6875rem",color:"var(--text-1)" }}
          itemStyle={{ color:"var(--text-1)" }}/>
        {models.map((m,i)=>(
          <Line key={m.id} type="monotone" dataKey={`m${m.id}`} name={m.name}
            stroke={COLORS[i%COLORS.length]} strokeWidth={2} dot={false}/>
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ── Main ─────────────────────────────────────────────────────────── */
export default function TabStressTest() {
  const [selectedEvent, setSelectedEvent] = useState("gfc");
  const [compareModels, setCompareModels] = useState([7,9,12,17]);
  const [view, setView] = useState("detail"); // detail | heatmap

  const event = STRESS_TESTS.find(e=>e.id===selectedEvent) || STRESS_TESTS[0];
  const models = compareModels.map(id=>PORTFOLIO_MODELS.find(m=>m.id===id)).filter(Boolean);

  /* ── Drawdown bar data ── */
  const barData = PORTFOLIO_MODELS.map(m => ({
    name: `#${m.id} ${m.name.length>14?m.name.slice(0,14)+"…":m.name}`,
    drawdown: event.modelDrawdowns[m.id]||0,
    riskLevel: m.riskLevel,
  })).sort((a,b)=>a.drawdown-b.drawdown);

  /* ── Recovery time estimate ── */
  const recoveryYrs = (dd, annualReturn) => {
    if (dd >= 0) return 0;
    const frac = Math.abs(dd)/100;
    return Math.ceil(Math.log(1/(1-frac)) / Math.log(1+annualReturn/100) * 10)/10;
  };

  const toggleModel = (id) => {
    setCompareModels(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id].slice(0,5));
  };

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:"1rem" }}>

      {/* ── Warning banner ── */}
      <div style={{ background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.2)",
        borderRadius:8,padding:"0.625rem 1rem",fontSize:"0.6875rem",color:"var(--text-2)",lineHeight:1.5 }}>
        <strong style={{ color:RED }}>Stress Test Simulator</strong> — Drawdown estimates are based on historical
        behavior of similar portfolio allocations during each crisis period. Actual results vary.
        All figures assume a diversified portfolio matching the model's target allocation with no leverage.
      </div>

      {/* ── View toggle ── */}
      <div style={{ display:"flex",gap:2,background:"var(--surface)",border:"1px solid var(--border-c)",
        borderRadius:8,padding:4,width:"fit-content" }}>
        {[["detail","Crisis Detail"],["heatmap","Heatmap View"]].map(([k,l])=>(
          <button key={k} onClick={()=>setView(k)} style={{
            padding:"5px 14px",borderRadius:6,border:"none",cursor:"pointer",
            background: view===k?"rgba(201,169,110,0.15)":"transparent",
            color: view===k?GOLD:"var(--text-3)",fontSize:"0.6875rem",fontWeight:600,
          }}>{l}</button>
        ))}
      </div>

      {view==="detail" && (
        <>
          {/* ── Crisis selector grid ── */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:6 }}>
            {STRESS_TESTS.map(e=>(
              <CrisisCard key={e.id} event={e} selected={selectedEvent===e.id}
                onClick={()=>setSelectedEvent(e.id)}/>
            ))}
          </div>

          {/* ── Crisis detail header ── */}
          <div style={{ background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.2)",
            borderRadius:9,padding:"1rem" }}>
            <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:"0.75rem" }}>
              <div>
                <div style={{ fontSize:"0.6875rem",color:RED,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:4 }}>
                  Crisis Event
                </div>
                <div style={{ fontSize:"1.25rem",fontWeight:900,color:"var(--text-1)",letterSpacing:"-0.01em" }}>
                  {event.name}
                </div>
                <div style={{ fontSize:"0.6875rem",color:"var(--text-3)",marginTop:4 }}>{event.period}</div>
              </div>
              <div style={{ display:"flex",gap:"1rem",flexWrap:"wrap" }}>
                {[
                  ["S&P 500 Drawdown", event.sp500Drawdown+"%", RED],
                  ["Duration",         event.duration,            YELLOW],
                  ["Recovery",         event.recovery,            GREEN],
                ].map(([l,v,c])=>(
                  <div key={l} style={{ textAlign:"center" }}>
                    <div style={{ fontSize:"0.625rem",color:"var(--text-3)",letterSpacing:"0.1em",
                      textTransform:"uppercase",marginBottom:2 }}>{l}</div>
                    <div style={{ fontSize:"1.25rem",fontWeight:900,color:c }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop:"0.75rem",fontSize:"0.6875rem",color:"var(--text-3)",lineHeight:1.6 }}>
              <strong style={{ color:"var(--text-2)" }}>Cause:</strong> {event.cause}
            </div>
          </div>

          {/* ── Model selector ── */}
          <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"0.875rem" }}>
            <div style={{ fontSize:"0.6875rem",color:"var(--text-3)",letterSpacing:"0.1em",
              textTransform:"uppercase",marginBottom:6 }}>Select up to 5 models to compare (click to toggle)</div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:4 }}>
              {PORTFOLIO_MODELS.map(m=>{
                const sel=compareModels.includes(m.id);
                const dd=event.modelDrawdowns[m.id]||0;
                return (
                  <button key={m.id} onClick={()=>toggleModel(m.id)} style={{
                    padding:"3px 8px",borderRadius:4,cursor:"pointer",fontSize:"0.6875rem",fontWeight:700,
                    border:`1px solid ${sel?"rgba(201,169,110,0.4)":"var(--border-c)"}`,
                    background:sel?"rgba(201,169,110,0.08)":"var(--elevated)",
                    color:sel?GOLD:ddColor(dd),
                  }}>
                    #{m.id} {m.name} ({dd}%)
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Recovery simulation chart ── */}
          {models.length>0 && (
            <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem" }}>
              <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:4,
                letterSpacing:"0.06em",textTransform:"uppercase" }}>
                $100,000 Portfolio — Simulated Crisis Path
              </div>
              <div style={{ fontSize:"0.75rem",color:"var(--text-3)",marginBottom:"0.75rem" }}>
                Stylized simulation: drawdown to trough then recovery using target return rate
              </div>
              <RecoveryChart event={event} models={models}/>
            </div>
          )}

          {/* ── Stats table for selected models ── */}
          {models.length>0 && (
            <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem",overflowX:"auto" }}>
              <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:"0.75rem",
                letterSpacing:"0.06em",textTransform:"uppercase" }}>Stress Test Statistics</div>
              <table style={{ width:"100%",borderCollapse:"collapse",minWidth:500 }}>
                <thead>
                  <tr style={{ borderBottom:"1px solid var(--border-c)" }}>
                    <th style={{ padding:"5px 8px",textAlign:"left",fontSize:"0.625rem",color:"var(--text-3)",letterSpacing:"0.08em",textTransform:"uppercase" }}>Model</th>
                    <th style={{ padding:"5px 8px",textAlign:"center",fontSize:"0.625rem",color:"var(--text-3)",letterSpacing:"0.08em",textTransform:"uppercase" }}>Max Drawdown</th>
                    <th style={{ padding:"5px 8px",textAlign:"center",fontSize:"0.625rem",color:"var(--text-3)",letterSpacing:"0.08em",textTransform:"uppercase" }}>$100K Value at Trough</th>
                    <th style={{ padding:"5px 8px",textAlign:"center",fontSize:"0.625rem",color:"var(--text-3)",letterSpacing:"0.08em",textTransform:"uppercase" }}>Est. Recovery (yrs)</th>
                    <th style={{ padding:"5px 8px",textAlign:"center",fontSize:"0.625rem",color:"var(--text-3)",letterSpacing:"0.08em",textTransform:"uppercase" }}>Risk Level</th>
                    <th style={{ padding:"5px 8px",textAlign:"center",fontSize:"0.625rem",color:"var(--text-3)",letterSpacing:"0.08em",textTransform:"uppercase" }}>vs S&P 500</th>
                  </tr>
                </thead>
                <tbody>
                  {models.map(m=>{
                    const dd=event.modelDrawdowns[m.id]||0;
                    const spDiff = dd - event.sp500Drawdown;
                    const midRet = (m.targetReturnMin+m.targetReturnMax)/2;
                    const recYrs = recoveryYrs(dd, midRet);
                    return (
                      <tr key={m.id} style={{ borderBottom:"1px solid var(--border-c)" }}>
                        <td style={{ padding:"7px 8px",fontWeight:700,color:"var(--text-1)",fontSize:"0.6875rem" }}>
                          #{m.id} {m.name}
                        </td>
                        <td style={{ padding:"7px 8px",textAlign:"center",fontWeight:800,color:ddColor(dd),fontSize:"0.875rem" }}>
                          {dd}%
                        </td>
                        <td style={{ padding:"7px 8px",textAlign:"center",fontWeight:700,color:"var(--text-1)" }}>
                          {fmt(100000*(1+dd/100))}
                        </td>
                        <td style={{ padding:"7px 8px",textAlign:"center",color:recYrs<3?GREEN:recYrs<7?YELLOW:RED,fontWeight:700 }}>
                          {recYrs===0?"<0.5":recYrs.toFixed(1)} yrs
                        </td>
                        <td style={{ padding:"7px 8px",textAlign:"center" }}>
                          <span style={{ color:riskColor(m.riskLevel),fontWeight:700 }}>{m.riskLevel}/10</span>
                        </td>
                        <td style={{ padding:"7px 8px",textAlign:"center",fontWeight:700,
                          color:spDiff>0?RED:GREEN }}>
                          {spDiff>0?"+":""}{spDiff.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ── All models drawdown bar ── */}
          <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem" }}>
            <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:4,
              letterSpacing:"0.06em",textTransform:"uppercase" }}>All Models — Max Drawdown During {event.name}</div>
            <ResponsiveContainer width="100%" height={420}>
              <BarChart data={barData} layout="vertical" margin={{ left:0,right:40,top:0,bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" vertical={false}/>
                <XAxis type="number" tickFormatter={v=>v+"%"} tick={{ fill:"var(--text-3)",fontSize:9 }}/>
                <YAxis type="category" dataKey="name" width={160}
                  tick={{ fill:"var(--text-2)",fontSize:9 }}/>
                <ReferenceLine x={event.sp500Drawdown} stroke="#a855f7" strokeDasharray="4 4"
                  label={{ value:"S&P 500", position:"top", fill:"#a855f7",fontSize:9 }}/>
                <Tooltip formatter={(v)=>[v+"%","Drawdown"]}
                  contentStyle={{ background:"var(--elevated)",border:"1px solid var(--border-c)",borderRadius:6,fontSize:"0.6875rem",color:"var(--text-1)" }}
                  itemStyle={{ color:"var(--text-1)" }}/>
                <Bar dataKey="drawdown" radius={[0,4,4,0]}>
                  {barData.map((e,i)=>(
                    <Cell key={i} fill={ddColor(e.drawdown)}/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {view==="heatmap" && (
        <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem",overflowX:"auto" }}>
          <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:4,
            letterSpacing:"0.06em",textTransform:"uppercase" }}>All Models × All Crises — Drawdown Heatmap</div>
          <div style={{ display:"flex",gap:"1.5rem",fontSize:"0.5625rem",color:"var(--text-3)",marginBottom:"0.75rem" }}>
            {[["< 10%",GREEN],["10–20%",YELLOW],["20–35%","#f97316"],["> 35%",RED]].map(([l,c])=>(
              <div key={l} style={{ display:"flex",alignItems:"center",gap:4 }}>
                <div style={{ width:10,height:10,borderRadius:2,background:c+"30",border:`1px solid ${c}60` }}/>
                {l}
              </div>
            ))}
          </div>
          <table style={{ borderCollapse:"collapse",fontSize:"0.5625rem" }}>
            <thead>
              <tr>
                <th style={{ padding:"5px 6px",textAlign:"left",color:"var(--text-3)",
                  fontSize:"0.4375rem",letterSpacing:"0.06em",textTransform:"uppercase",minWidth:90 }}>Model</th>
                {STRESS_TESTS.map(e=>(
                  <th key={e.id} style={{ padding:"3px 2px",textAlign:"center",color:"var(--text-3)",
                    fontSize:"0.4375rem",letterSpacing:"0.04em",textTransform:"uppercase",
                    writingMode:"vertical-lr",transform:"rotate(180deg)",height:80 }}>
                    {e.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PORTFOLIO_MODELS.map(m=>(
                <tr key={m.id} style={{ borderBottom:"1px solid var(--elevated)" }}>
                  <td style={{ padding:"5px 6px",color:"var(--text-2)",fontWeight:600,whiteSpace:"nowrap",
                    fontSize:"0.5625rem" }}>
                    #{m.id} {m.name}
                  </td>
                  {STRESS_TESTS.map(e=>(
                    <HeatCell key={e.id} value={e.modelDrawdowns[m.id]||0}/>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
