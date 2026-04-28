import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, ReferenceLine, Legend, Cell,
  PieChart, Pie,
} from "recharts";
import { X, Plus } from "lucide-react";
import { PORTFOLIO_MODELS, GOLD, GREEN, RED, YELLOW, riskColor } from "./riskData";

const fmt = (n) => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",
  minimumFractionDigits:0,maximumFractionDigits:0}).format(n);

const MODEL_COLORS = [GOLD,"#3b82f6","#22c55e","#a855f7","#f97316"];

/* ── Projection data ─────────────────────────────────────────────── */
function buildProjections(models) {
  const rows = [];
  for (let yr = 0; yr <= 30; yr+=5) {
    const row = { year: yr === 0 ? "Start" : `Year ${yr}` };
    models.forEach((m,i) => {
      const rate = (m.targetReturnMin + m.targetReturnMax) / 2 / 100;
      row[`m${m.id}`] = Math.round(100000 * Math.pow(1+rate, yr));
    });
    rows.push(row);
  }
  return rows;
}

/* ── Tooltip ─────────────────────────────────────────────────────── */
const CompTip = ({ active, payload, label }) => {
  if (!active||!payload?.length) return null;
  return (
    <div style={{ background:"var(--elevated)",border:"1px solid var(--border-c)",
      borderRadius:6,padding:"8px 12px",fontSize:"0.6875rem" }}>
      <div style={{ color:"var(--text-3)",marginBottom:4 }}>{label}</div>
      {payload.map((p,i) => (
        <div key={i} style={{ color:p.color,marginBottom:2 }}>
          {p.name}: <strong>{typeof p.value==="number"&&p.value>10000?fmt(p.value):p.value}</strong>
        </div>
      ))}
    </div>
  );
};

/* ── Mini donut ──────────────────────────────────────────────────── */
function MiniDonut({ model }) {
  return (
    <ResponsiveContainer width="100%" height={80}>
      <PieChart>
        <Pie data={model.allocation} cx="50%" cy="50%" innerRadius={18} outerRadius={36}
          dataKey="weight" paddingAngle={1}>
          {model.allocation.map((e,i)=><Cell key={i} fill={e.color}/>)}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

/* ── Comparison table row ────────────────────────────────────────── */
function CompRow({ label, values, formatFn, colorFn }) {
  return (
    <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
      <td style={{ padding:"7px 10px",fontSize:"0.5625rem",color:"var(--text-3)",
        textTransform:"uppercase",letterSpacing:"0.06em",fontWeight:600 }}>{label}</td>
      {values.map((v,i) => (
        <td key={i} style={{ padding:"7px 10px",textAlign:"center",fontSize:"0.75rem",
          fontWeight:700,color: colorFn ? colorFn(v) : GOLD }}>
          {formatFn ? formatFn(v) : v}
        </td>
      ))}
    </tr>
  );
}

/* ── Main ─────────────────────────────────────────────────────────── */
export default function TabComparison() {
  const [selected, setSelected] = useState([7, 9, 12]); // default: 60/40, All Weather, Three Fund
  const [pickOpen, setPickOpen] = useState(false);

  const models = selected.map(id => PORTFOLIO_MODELS.find(m => m.id === id)).filter(Boolean);
  const projections = buildProjections(models);

  const toggle = (id) => {
    if (selected.includes(id)) {
      setSelected(s => s.filter(x => x !== id));
    } else if (selected.length < 5) {
      setSelected(s => [...s, id]);
    }
  };

  /* ── Chart data: returns bar ── */
  const retData = [
    { metric:"Target Return (mid)", ...Object.fromEntries(models.map(m=>[`m${m.id}`, (m.targetReturnMin+m.targetReturnMax)/2])) },
    { metric:"Best Year", ...Object.fromEntries(models.map(m=>[`m${m.id}`, m.bestYear])) },
    { metric:"Worst Year", ...Object.fromEntries(models.map(m=>[`m${m.id}`, m.worstYear])) },
    { metric:"Max Drawdown", ...Object.fromEntries(models.map(m=>[`m${m.id}`, m.maxDrawdown])) },
  ];

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:"1rem" }}>

      {/* ── Model Selector ── */}
      <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.75rem" }}>
          <div>
            <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",
              letterSpacing:"0.06em",textTransform:"uppercase" }}>Compare Up to 5 Models</div>
            <div style={{ fontSize:"0.625rem",color:"var(--text-3)",marginTop:2 }}>
              {selected.length}/5 selected
            </div>
          </div>
          <button onClick={()=>setPickOpen(p=>!p)} style={{
            display:"flex",alignItems:"center",gap:5,padding:"5px 12px",
            background:"rgba(201,168,76,0.08)",border:"1px solid rgba(201,168,76,0.2)",
            borderRadius:6,color:GOLD,fontSize:"0.6875rem",fontWeight:600,cursor:"pointer",
          }}>
            <Plus size={12}/> {pickOpen?"Close":"Add Model"}
          </button>
        </div>

        {/* Selected chips */}
        <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom: pickOpen?"0.75rem":0 }}>
          {models.map((m,i) => (
            <div key={m.id} style={{
              display:"flex",alignItems:"center",gap:5,padding:"4px 10px",
              background:`${MODEL_COLORS[i]}12`,border:`1px solid ${MODEL_COLORS[i]}30`,
              borderRadius:20,fontSize:"0.6875rem",color:MODEL_COLORS[i],fontWeight:700,
            }}>
              <div style={{ width:6,height:6,borderRadius:"50%",background:MODEL_COLORS[i] }}/>
              {m.name}
              <button onClick={()=>toggle(m.id)} style={{ background:"none",border:"none",
                cursor:"pointer",color:MODEL_COLORS[i],padding:0,lineHeight:1,marginLeft:2 }}>
                <X size={10}/>
              </button>
            </div>
          ))}
        </div>

        {/* Model picker grid */}
        {pickOpen && (
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:4,
            maxHeight:240,overflowY:"auto",padding:"0.25rem 0" }}>
            {PORTFOLIO_MODELS.map(m => {
              const sel = selected.includes(m.id);
              const colorIdx = selected.indexOf(m.id);
              const color = sel ? MODEL_COLORS[colorIdx] : "var(--text-3)";
              return (
                <button key={m.id} onClick={()=>toggle(m.id)} disabled={!sel && selected.length>=5}
                  style={{
                    textAlign:"left",padding:"6px 10px",borderRadius:6,cursor:"pointer",
                    border:`1px solid ${sel?`${color}40`:"var(--border-c)"}`,
                    background: sel ? `${color}08` : "var(--elevated)",
                    opacity: !sel && selected.length>=5 ? 0.4 : 1,
                  }}>
                  <div style={{ fontSize:"0.5625rem",fontWeight:800,color,letterSpacing:"0.04em" }}>
                    #{m.id} {m.name}
                  </div>
                  <div style={{ fontSize:"0.5rem",color:"var(--text-3)",marginTop:1 }}>
                    Risk {m.riskLevel}/10 · {m.targetReturnMin}–{m.targetReturnMax}%
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {models.length < 2 && (
        <div style={{ textAlign:"center",padding:"2rem",color:"var(--text-3)",fontSize:"0.75rem" }}>
          Select at least 2 models to compare.
        </div>
      )}

      {models.length >= 2 && (
        <>
          {/* ── Side-by-side donut row ── */}
          <div style={{ display:"grid",gridTemplateColumns:`repeat(${Math.min(models.length,5)},1fr)`,gap:"0.75rem" }}>
            {models.map((m,i) => (
              <div key={m.id} style={{ background:"var(--surface)",border:`1px solid ${MODEL_COLORS[i]}25`,
                borderRadius:8,padding:"0.75rem",textAlign:"center" }}>
                <div style={{ fontSize:"0.5rem",color:MODEL_COLORS[i],letterSpacing:"0.1em",
                  textTransform:"uppercase",marginBottom:2,fontWeight:700 }}>Model {m.id}</div>
                <div style={{ fontSize:"0.75rem",fontWeight:800,color:"var(--text-1)",marginBottom:4 }}>{m.name}</div>
                <MiniDonut model={m}/>
                <div style={{ fontSize:"0.5625rem",color:MODEL_COLORS[i],fontWeight:800,marginTop:2 }}>
                  {m.targetReturnMin}–{m.targetReturnMax}% / yr
                </div>
              </div>
            ))}
          </div>

          {/* ── Detailed comparison table ── */}
          <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem",overflowX:"auto" }}>
            <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:"0.75rem",
              letterSpacing:"0.06em",textTransform:"uppercase" }}>Side-by-Side Comparison</div>
            <table style={{ width:"100%",borderCollapse:"collapse",minWidth:400 }}>
              <thead>
                <tr style={{ borderBottom:"1px solid var(--border-c)" }}>
                  <th style={{ padding:"7px 10px",textAlign:"left",fontSize:"0.5rem",
                    color:"var(--text-3)",letterSpacing:"0.1em",textTransform:"uppercase" }}>Metric</th>
                  {models.map((m,i) => (
                    <th key={m.id} style={{ padding:"7px 10px",textAlign:"center",fontSize:"0.5625rem",
                      color:MODEL_COLORS[i],fontWeight:700 }}>{m.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <CompRow label="Risk Level" values={models.map(m=>`${m.riskLevel}/10`)}
                  colorFn={v=>riskColor(parseInt(v))}/>
                <CompRow label="Category" values={models.map(m=>m.category)}/>
                <CompRow label="Target Return" values={models.map(m=>`${m.targetReturnMin}–${m.targetReturnMax}%`)} colorFn={()=>GREEN}/>
                <CompRow label="Volatility" values={models.map(m=>`${m.volatility}%`)} colorFn={v=>parseFloat(v)>15?RED:YELLOW}/>
                <CompRow label="Sharpe Ratio" values={models.map(m=>m.sharpe)} colorFn={v=>v>=0.88?GREEN:YELLOW}/>
                <CompRow label="Max Drawdown" values={models.map(m=>`${m.maxDrawdown}%`)} colorFn={()=>RED}/>
                <CompRow label="Best Year" values={models.map(m=>`+${m.bestYear}%`)} colorFn={()=>GREEN}/>
                <CompRow label="Worst Year" values={models.map(m=>`${m.worstYear}%`)} colorFn={()=>RED}/>
                <CompRow label="Dividend Yield" values={models.map(m=>`${m.yield}%`)} colorFn={v=>parseFloat(v)>2?GREEN:"var(--text-1)"}/>
                <CompRow label="4% Rule Income on $1M" values={models.map(m=>"$40,000")} colorFn={()=>"var(--text-1)"}/>
                <tr style={{ background:"rgba(34,197,94,0.04)",borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding:"7px 10px",fontSize:"0.5625rem",color:"var(--text-3)",
                    textTransform:"uppercase",letterSpacing:"0.06em",fontWeight:600 }}>$100K → 10 Yrs</td>
                  {models.map((m,i) => {
                    const r=(m.targetReturnMin+m.targetReturnMax)/2/100;
                    return <td key={i} style={{ padding:"7px 10px",textAlign:"center",fontSize:"0.75rem",fontWeight:700,color:GREEN }}>
                      {fmt(100000*Math.pow(1+r,10))}
                    </td>;
                  })}
                </tr>
                <tr style={{ background:"rgba(34,197,94,0.04)",borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding:"7px 10px",fontSize:"0.5625rem",color:"var(--text-3)",
                    textTransform:"uppercase",letterSpacing:"0.06em",fontWeight:600 }}>$100K → 20 Yrs</td>
                  {models.map((m,i) => {
                    const r=(m.targetReturnMin+m.targetReturnMax)/2/100;
                    return <td key={i} style={{ padding:"7px 10px",textAlign:"center",fontSize:"0.75rem",fontWeight:700,color:GREEN }}>
                      {fmt(100000*Math.pow(1+r,20))}
                    </td>;
                  })}
                </tr>
                <tr style={{ background:"rgba(34,197,94,0.04)" }}>
                  <td style={{ padding:"7px 10px",fontSize:"0.5625rem",color:"var(--text-3)",
                    textTransform:"uppercase",letterSpacing:"0.06em",fontWeight:600 }}>$100K → 30 Yrs</td>
                  {models.map((m,i) => {
                    const r=(m.targetReturnMin+m.targetReturnMax)/2/100;
                    return <td key={i} style={{ padding:"7px 10px",textAlign:"center",fontSize:"0.75rem",fontWeight:700,color:GREEN }}>
                      {fmt(100000*Math.pow(1+r,30))}
                    </td>;
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          {/* ── Growth projection chart ── */}
          <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem" }}>
            <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:4,
              letterSpacing:"0.06em",textTransform:"uppercase" }}>$100,000 Growth Projection</div>
            <div style={{ fontSize:"0.625rem",color:"var(--text-3)",marginBottom:"0.75rem" }}>
              Using midpoint target return for each model
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={projections}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                <XAxis dataKey="year" tick={{ fill:"var(--text-3)",fontSize:10 }}/>
                <YAxis tickFormatter={v=>`$${(v/1000).toFixed(0)}K`} tick={{ fill:"var(--text-3)",fontSize:10 }}/>
                <Tooltip content={<CompTip/>}/>
                {models.map((m,i) => (
                  <Line key={m.id} type="monotone" dataKey={`m${m.id}`} name={m.name}
                    stroke={MODEL_COLORS[i]} strokeWidth={2} dot={{ fill:MODEL_COLORS[i],r:4 }}/>
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* ── Return/drawdown bar chart ── */}
          <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem" }}>
            <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:"0.75rem",
              letterSpacing:"0.06em",textTransform:"uppercase" }}>Return & Drawdown Comparison</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={retData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
                <XAxis type="number" tick={{ fill:"var(--text-3)",fontSize:10 }} tickFormatter={v=>v+"%"}/>
                <YAxis type="category" dataKey="metric" width={100} tick={{ fill:"var(--text-2)",fontSize:10 }}/>
                <Tooltip content={<CompTip/>}/>
                {models.map((m,i) => (
                  <Bar key={m.id} dataKey={`m${m.id}`} name={m.name} fill={MODEL_COLORS[i]} radius={[0,4,4,0]}/>
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ── Volatility vs Return scatter summary ── */}
          <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem" }}>
            <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:"0.75rem",
              letterSpacing:"0.06em",textTransform:"uppercase" }}>Risk vs Return Summary</div>
            <div style={{ display:"grid",gridTemplateColumns:`repeat(${Math.min(models.length,5)},1fr)`,gap:"0.5rem" }}>
              {models.map((m,i) => {
                const efficiency = m.sharpe;
                return (
                  <div key={m.id} style={{ padding:"0.75rem",background:"var(--elevated)",
                    borderRadius:7,border:`1px solid ${MODEL_COLORS[i]}20`,textAlign:"center" }}>
                    <div style={{ fontSize:"0.5rem",color:MODEL_COLORS[i],fontWeight:700,
                      letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4 }}>{m.name}</div>
                    <div style={{ fontSize:"1.25rem",fontWeight:900,color:GOLD }}>{m.sharpe}</div>
                    <div style={{ fontSize:"0.5rem",color:"var(--text-3)",marginBottom:6 }}>Sharpe Ratio</div>
                    <div style={{ height:2,background:"rgba(255,255,255,0.06)",borderRadius:1,marginBottom:6 }}>
                      <div style={{ height:"100%",width:`${Math.min(100,efficiency*80)}%`,
                        background:MODEL_COLORS[i],borderRadius:1 }}/>
                    </div>
                    <div style={{ fontSize:"0.5625rem",color:"var(--text-3)" }}>
                      {m.volatility}% vol · {m.targetReturnMin}–{m.targetReturnMax}% return
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
