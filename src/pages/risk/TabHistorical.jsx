import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, ReferenceLine, Cell,
} from "recharts";
import { ANNUAL_RETURNS, DECADE_RETURNS, PORTFOLIO_MODELS, GOLD, GREEN, RED, YELLOW } from "./riskData";

const SERIES = [
  { key:"m7",   label:"60/40 Classic",   color:GOLD },
  { key:"m9",   label:"All Weather",     color:"#3b82f6" },
  { key:"m12",  label:"Three Fund",      color:"#22c55e" },
  { key:"m17",  label:"Max Growth",      color:"#ef4444" },
  { key:"sp500",label:"S&P 500",         color:"#a855f7" },
  { key:"bonds",label:"US Bonds (AGG)",  color:"#94a3b8" },
];

const Tip = ({ active, payload, label }) => {
  if (!active||!payload?.length) return null;
  return (
    <div style={{ background:"var(--elevated)",border:"1px solid var(--border-c)",
      borderRadius:6,padding:"8px 12px",fontSize:"0.6875rem" }}>
      <div style={{ color:"var(--text-3)",marginBottom:4,fontWeight:600 }}>{label}</div>
      {payload.map((p,i) => (
        <div key={i} style={{ color:p.color,marginBottom:2 }}>
          {p.name}: <strong style={{ color:p.value>=0?GREEN:RED }}>{p.value>=0?"+":""}{p.value?.toFixed(1)}%</strong>
        </div>
      ))}
    </div>
  );
};

function YearBars({ seriesKeys, activeColors }) {
  const data = ANNUAL_RETURNS.years.map((yr,i) => {
    const obj = { year: yr };
    seriesKeys.forEach(k => { obj[k] = ANNUAL_RETURNS[k]?.[i] ?? 0; });
    return obj;
  });
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ left:0,right:0,top:4,bottom:0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" vertical={false}/>
        <XAxis dataKey="year" tick={{ fill:"var(--text-3)",fontSize:9 }}
          interval={4} tickLine={false}/>
        <YAxis tick={{ fill:"var(--text-3)",fontSize:10 }} tickFormatter={v=>v+"%"}/>
        <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" strokeWidth={1}/>
        <Tooltip content={<Tip/>}/>
        {seriesKeys.map((k,i) => (
          <Bar key={k} dataKey={k} name={SERIES.find(s=>s.key===k)?.label||k}
            fill={activeColors[k]} radius={[2,2,0,0]}>
            {data.map((d,j)=>(
              <Cell key={j} fill={(d[k]||0)>=0?activeColors[k]:`${activeColors[k]}60`}/>
            ))}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

function GrowthChart({ seriesKeys, activeColors }) {
  const data = [{ year: 1989, ...Object.fromEntries(seriesKeys.map(k=>[k,10000])) }];
  ANNUAL_RETURNS.years.forEach((yr,i) => {
    const prev = data[data.length-1];
    const row = { year: yr };
    seriesKeys.forEach(k => {
      const ret = (ANNUAL_RETURNS[k]?.[i] ?? 0) / 100;
      row[k] = Math.round(prev[k] * (1 + ret));
    });
    data.push(row);
  });
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)"/>
        <XAxis dataKey="year" tick={{ fill:"var(--text-3)",fontSize:9 }} interval={4} tickLine={false}/>
        <YAxis tickFormatter={v=>`$${(v/1000).toFixed(0)}K`} tick={{ fill:"var(--text-3)",fontSize:10 }}/>
        <Tooltip
          formatter={(v)=>[`$${v.toLocaleString()}`,""]}
          contentStyle={{ background:"var(--elevated)",border:"1px solid var(--border-c)",borderRadius:6,fontSize:"0.6875rem",color:"var(--text-1)" }}
          itemStyle={{ color:"var(--text-1)" }}
          labelStyle={{ color:"var(--text-2)" }}
        />
        {seriesKeys.map((k)=>(
          <Line key={k} type="monotone" dataKey={k} name={SERIES.find(s=>s.key===k)?.label||k}
            stroke={activeColors[k]} strokeWidth={2} dot={false}/>
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ── Calendar year returns table ────────────────────────────────────  */
function CalendarTable({ activeSeries }) {
  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%",borderCollapse:"collapse",fontSize:"0.625rem" }}>
        <thead>
          <tr style={{ borderBottom:"1px solid var(--border-c)" }}>
            <th style={{ padding:"5px 8px",textAlign:"left",color:"var(--text-3)",
              fontWeight:600,fontSize:"0.5rem",letterSpacing:"0.08em",textTransform:"uppercase",width:48 }}>Year</th>
            {activeSeries.map(s=>(
              <th key={s.key} style={{ padding:"5px 8px",textAlign:"right",color:s.color,
                fontWeight:700,fontSize:"0.5rem",letterSpacing:"0.06em",textTransform:"uppercase",whiteSpace:"nowrap" }}>
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ANNUAL_RETURNS.years.map((yr,i)=>(
            <tr key={yr} style={{ borderBottom:"1px solid var(--elevated)",
              background: yr%2===0?"rgba(255,255,255,0.01)":"transparent" }}>
              <td style={{ padding:"5px 8px",color:"var(--text-3)",fontWeight:700 }}>{yr}</td>
              {activeSeries.map(s=>{
                const v = ANNUAL_RETURNS[s.key]?.[i] ?? 0;
                return (
                  <td key={s.key} style={{ padding:"5px 8px",textAlign:"right",fontWeight:700,
                    color:v>=0?GREEN:RED,fontFamily:"monospace" }}>
                    {v>=0?"+":""}{v.toFixed(1)}%
                  </td>
                );
              })}
            </tr>
          ))}
          {/* Average row */}
          <tr style={{ borderTop:"2px solid var(--border-c)",background:"rgba(201,169,110,0.04)" }}>
            <td style={{ padding:"5px 8px",color:GOLD,fontWeight:800 }}>AVG</td>
            {activeSeries.map(s=>{
              const vals = ANNUAL_RETURNS[s.key]||[];
              const avg = vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : 0;
              return (
                <td key={s.key} style={{ padding:"5px 8px",textAlign:"right",fontWeight:800,
                  color:avg>=0?GREEN:RED,fontFamily:"monospace" }}>
                  {avg>=0?"+":""}{avg.toFixed(2)}%
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ── Decade analysis ─────────────────────────────────────────────── */
function DecadeChart() {
  const data = DECADE_RETURNS;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" vertical={false}/>
        <XAxis dataKey="decade" tick={{ fill:"var(--text-3)",fontSize:10 }}/>
        <YAxis tickFormatter={v=>v+"%"} tick={{ fill:"var(--text-3)",fontSize:10 }}/>
        <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)"/>
        <Tooltip
          formatter={(v,name)=>[`${v.toFixed(1)}%`,name]}
          contentStyle={{ background:"var(--elevated)",border:"1px solid var(--border-c)",borderRadius:6,fontSize:"0.6875rem",color:"var(--text-1)" }}
          itemStyle={{ color:"var(--text-1)" }}
        />
        <Bar dataKey="sp500" name="S&P 500"   fill="#a855f7" radius={[2,2,0,0]}/>
        <Bar dataKey="m7"    name="60/40"      fill={GOLD}    radius={[2,2,0,0]}/>
        <Bar dataKey="m9"    name="All Weather" fill="#3b82f6" radius={[2,2,0,0]}/>
        <Bar dataKey="bonds" name="US Bonds"    fill="#94a3b8" radius={[2,2,0,0]}/>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ── Main ─────────────────────────────────────────────────────────── */
export default function TabHistorical() {
  const [activeSeries, setActiveSeries] = useState(["m7","m12","sp500"]);
  const [view, setView] = useState("annual"); // annual | growth | calendar | decade

  const toggleSeries = (key) => {
    setActiveSeries(s => s.includes(key) ? s.filter(x=>x!==key) : [...s, key]);
  };

  const activeColors = Object.fromEntries(SERIES.map(s=>[s.key,s.color]));
  const filtered = SERIES.filter(s => activeSeries.includes(s.key));

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:"1rem" }}>
      {/* ── Controls ── */}
      <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"0.875rem" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.5rem" }}>
          {/* Series toggles */}
          <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
            {SERIES.map(s => {
              const on = activeSeries.includes(s.key);
              return (
                <button key={s.key} onClick={()=>toggleSeries(s.key)} style={{
                  display:"flex",alignItems:"center",gap:5,padding:"4px 10px",
                  border:`1px solid ${on?`${s.color}50`:"var(--border-c)"}`,
                  borderRadius:20,background: on?`${s.color}12`:"transparent",
                  color: on?s.color:"var(--text-3)",fontSize:"0.625rem",fontWeight:700,cursor:"pointer",
                }}>
                  <div style={{ width:6,height:6,borderRadius:"50%",
                    background:on?s.color:"rgba(255,255,255,0.15)" }}/>
                  {s.label}
                </button>
              );
            })}
          </div>
          {/* View tabs */}
          <div style={{ display:"flex",gap:2,background:"var(--elevated)",borderRadius:6,padding:2 }}>
            {[["annual","Annual Returns"],["growth","Growth of $10K"],
              ["calendar","Calendar Table"],["decade","Decade Analysis"]].map(([k,l])=>(
              <button key={k} onClick={()=>setView(k)} style={{
                padding:"4px 10px",borderRadius:5,border:"none",cursor:"pointer",
                background: view===k?"rgba(201,169,110,0.15)":"transparent",
                color: view===k?GOLD:"var(--text-3)",fontSize:"0.5625rem",fontWeight:600,
              }}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Chart ── */}
      <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem" }}>
        {view==="annual" && (
          <>
            <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:4,
              letterSpacing:"0.06em",textTransform:"uppercase" }}>Annual Returns 1990–2024</div>
            <div style={{ fontSize:"0.625rem",color:"var(--text-3)",marginBottom:"0.75rem" }}>
              Each bar represents calendar year total return including dividends
            </div>
            <YearBars seriesKeys={activeSeries} activeColors={activeColors}/>
          </>
        )}
        {view==="growth" && (
          <>
            <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:4,
              letterSpacing:"0.06em",textTransform:"uppercase" }}>Growth of $10,000 — 1990 to 2024</div>
            <div style={{ fontSize:"0.625rem",color:"var(--text-3)",marginBottom:"0.75rem" }}>
              $10,000 invested at start of 1990, dividends reinvested, no fees
            </div>
            <GrowthChart seriesKeys={activeSeries} activeColors={activeColors}/>
          </>
        )}
        {view==="calendar" && (
          <>
            <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:4,
              letterSpacing:"0.06em",textTransform:"uppercase" }}>Calendar Year Returns Table</div>
            <div style={{ fontSize:"0.625rem",color:"var(--text-3)",marginBottom:"0.75rem" }}>
              Annual total return for each strategy · Green = positive · Red = negative
            </div>
            <CalendarTable activeSeries={filtered}/>
          </>
        )}
        {view==="decade" && (
          <>
            <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:4,
              letterSpacing:"0.06em",textTransform:"uppercase" }}>Average Annual Return by Decade</div>
            <div style={{ fontSize:"0.625rem",color:"var(--text-3)",marginBottom:"0.75rem" }}>
              1930s through 2020s — compound annual growth rate per decade
            </div>
            <DecadeChart/>
          </>
        )}
      </div>

      {/* ── Best/worst years summary ── */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:"0.75rem" }}>
        {filtered.map(s => {
          const vals = ANNUAL_RETURNS[s.key]||[];
          const yrs  = ANNUAL_RETURNS.years;
          const avg  = vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : 0;
          const maxV = Math.max(...vals);
          const minV = Math.min(...vals);
          const maxI = vals.indexOf(maxV);
          const minI = vals.indexOf(minV);
          const positiveYrs = vals.filter(v=>v>0).length;
          return (
            <div key={s.key} style={{ background:"var(--surface)",border:`1px solid ${s.color}20`,
              borderRadius:8,padding:"0.875rem" }}>
              <div style={{ fontSize:"0.5rem",color:s.color,letterSpacing:"0.1em",textTransform:"uppercase",
                fontWeight:700,marginBottom:4 }}>{s.label}</div>
              <div style={{ display:"flex",flexDirection:"column",gap:4 }}>
                {[
                  ["Avg Annual Return", `${avg>=0?"+":""}${avg.toFixed(2)}%`, avg>=0?GREEN:RED],
                  ["Best Year", `+${maxV.toFixed(1)}% (${yrs[maxI]})`, GREEN],
                  ["Worst Year", `${minV.toFixed(1)}% (${yrs[minI]})`, RED],
                  ["Positive Years", `${positiveYrs}/${vals.length} (${Math.round(positiveYrs/vals.length*100)}%)`, GREEN],
                ].map(([l,v,c])=>(
                  <div key={l} style={{ display:"flex",justifyContent:"space-between",
                    padding:"3px 0",borderBottom:"1px solid var(--border-c)" }}>
                    <span style={{ fontSize:"0.5625rem",color:"var(--text-3)" }}>{l}</span>
                    <span style={{ fontSize:"0.6875rem",fontWeight:700,color:c }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
