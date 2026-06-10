import React, { useState, useCallback, useMemo } from "react";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar, Cell,
} from "recharts";
import { Play, RotateCcw } from "lucide-react";
import { PORTFOLIO_MODELS, GOLD, GREEN, RED, YELLOW } from "./riskData";

const fmt = (n) => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",
  minimumFractionDigits:0,maximumFractionDigits:0}).format(n);

/* ── Monte Carlo engine ──────────────────────────────────────────── */
function runMonteCarlo({ startValue, monthlyContrib, years, annualReturn, volatility,
                         withdrawalRate, inflationRate, simCount=1000 }) {
  const months = years * 12;
  const monthlyRet = annualReturn / 100 / 12;
  const monthlyVol = volatility / 100 / Math.sqrt(12);
  const monthlyInfl = inflationRate / 100 / 12;
  const monthlyWithdraw = withdrawalRate > 0
    ? startValue * (withdrawalRate/100) / 12 : 0;

  /* Box-Muller for normal random */
  const randNorm = () => {
    const u1 = Math.random(), u2 = Math.random();
    return Math.sqrt(-2*Math.log(u1)) * Math.cos(2*Math.PI*u2);
  };

  const paths = [];
  for (let s=0; s<simCount; s++) {
    let val = startValue;
    const path = [val];
    for (let m=0; m<months; m++) {
      const r = monthlyRet + monthlyVol * randNorm();
      val = val * (1 + r) + monthlyContrib - monthlyWithdraw;
      val = Math.max(0, val);
      path.push(Math.round(val));
    }
    paths.push(path);
  }

  /* Percentile extraction */
  const ptile = (pct) => {
    const sorted = [...paths].sort((a,b)=>a[a.length-1]-b[b.length-1]);
    return sorted[Math.floor(pct/100*simCount)];
  };

  /* Fan chart data — sample every 12 months */
  const fanData = [];
  for (let m=0; m<=months; m+=12) {
    const vals = paths.map(p=>p[m]).sort((a,b)=>a-b);
    fanData.push({
      year: m/12,
      p10: vals[Math.floor(0.10*simCount)],
      p25: vals[Math.floor(0.25*simCount)],
      p50: vals[Math.floor(0.50*simCount)],
      p75: vals[Math.floor(0.75*simCount)],
      p90: vals[Math.floor(0.90*simCount)],
    });
  }

  const finalVals = paths.map(p=>p[p.length-1]).sort((a,b)=>a-b);
  const successCount = finalVals.filter(v=>v>0).length;

  /* Withdrawal rate analysis */
  const withdrawalAnalysis = [3,3.5,4,4.5,5].map(wr=>{
    const mW = startValue*(wr/100)/12;
    let successes=0;
    for(let s=0;s<simCount;s++){
      let v=startValue;
      let ok=true;
      for(let m=0;m<months;m++){
        const r=monthlyRet+monthlyVol*randNorm();
        v=v*(1+r)+monthlyContrib-mW;
        if(v<=0){ok=false;break;}
      }
      if(ok)successes++;
    }
    return { rate:wr+"%", success:Math.round(successes/simCount*100) };
  });

  return {
    fanData,
    p10: fanData[fanData.length-1].p10,
    p25: fanData[fanData.length-1].p25,
    p50: fanData[fanData.length-1].p50,
    p75: fanData[fanData.length-1].p75,
    p90: fanData[fanData.length-1].p90,
    successRate: Math.round(successCount/simCount*100),
    finalVals: finalVals.filter((_,i)=>i%10===0), // sample for histogram
    withdrawalAnalysis,
    simCount,
  };
}

/* ── Sliders ─────────────────────────────────────────────────────── */
const SliderInput = ({ label, value, onChange, min, max, step=1, format=(v)=>v, sub }) => (
  <div style={{ display:"flex",flexDirection:"column",gap:4 }}>
    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"baseline" }}>
      <label style={{ fontSize:"0.5rem",color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"0.08em" }}>{label}</label>
      <span style={{ fontSize:"0.875rem",fontWeight:800,color:GOLD }}>{format(value)}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={e=>onChange(Number(e.target.value))}
      style={{ width:"100%",accentColor:GOLD,cursor:"pointer" }}/>
    <div style={{ display:"flex",justifyContent:"space-between",fontSize:"0.4375rem",color:"var(--text-3)" }}>
      <span>{format(min)}</span>
      {sub && <span style={{ color:"var(--text-3)" }}>{sub}</span>}
      <span>{format(max)}</span>
    </div>
  </div>
);

/* ── Fan chart tooltip ───────────────────────────────────────────── */
const FanTip = ({ active, payload, label }) => {
  if (!active||!payload?.length) return null;
  return (
    <div style={{ background:"var(--elevated)",border:"1px solid var(--border-c)",
      borderRadius:6,padding:"8px 12px",fontSize:"0.625rem" }}>
      <div style={{ color:"var(--text-3)",marginBottom:4,fontWeight:600 }}>Year {label}</div>
      {[["90th Percentile","p90",GREEN],["75th","p75","#84cc16"],
        ["Median (50th)","p50",GOLD],["25th","p25",YELLOW],["10th Percentile","p10",RED]].map(([l,k,c])=>{
        const v = payload.find(p=>p.dataKey===k)?.value;
        return v ? <div key={k} style={{ color:c }}>{l}: <strong>{fmt(v)}</strong></div> : null;
      })}
    </div>
  );
};

/* ── Sequence of returns visual ──────────────────────────────────── */
function SequenceChart() {
  // Same average return (7%) but different sequences
  const makeSeq = (returns, label) => {
    let v=100000;
    const path=[{year:0,v,label}];
    returns.forEach((r,i)=>{
      v=Math.max(0,v*(1+r/100)-3500); // $3500/yr withdrawal
      path.push({year:i+1,v:Math.round(v)});
    });
    return path;
  };

  const goodStart = [20,15,10,8,7,5,4,3,2,1,-2,-5,-8,-10,-15].map(r=>r);
  const badStart  = [-15,-10,-8,-5,-2,1,2,3,4,5,7,8,10,15,20].map(r=>r);
  const gs = makeSeq(goodStart,"Good start");
  const bs = makeSeq(badStart,"Bad start");

  const data = gs.map((d,i)=>({
    year: d.year,
    goodStart: d.v,
    badStart: bs[i].v,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)"/>
        <XAxis dataKey="year" tick={{ fill:"var(--text-3)",fontSize:10 }}
          tickFormatter={v=>`Yr ${v}`}/>
        <YAxis tickFormatter={v=>fmt(v)} tick={{ fill:"var(--text-3)",fontSize:9 }} width={70}/>
        <Tooltip formatter={(v)=>fmt(v)}
          contentStyle={{ background:"var(--elevated)",border:"1px solid var(--border-c)",borderRadius:6,fontSize:"0.6875rem",color:"var(--text-1)" }}
          itemStyle={{ color:"var(--text-1)" }}/>
        <ReferenceLine y={0} stroke={RED} strokeDasharray="4 4"/>
        <Line type="monotone" dataKey="goodStart" name="Good start (bull early)"
          stroke={GREEN} strokeWidth={2} dot={false}/>
        <Line type="monotone" dataKey="badStart" name="Bad start (bear early)"
          stroke={RED} strokeWidth={2} dot={false}/>
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ── Main ─────────────────────────────────────────────────────────── */
export default function TabMonteCarlo() {
  const [startValue,    setStartValue]    = useState(250000);
  const [monthlyContrib,setMonthlyContrib]= useState(500);
  const [years,         setYears]         = useState(30);
  const [modelId,       setModelId]       = useState(7);
  const [withdrawalRate,setWithdrawalRate]= useState(0);
  const [inflationRate, setInflationRate] = useState(3);
  const [running,       setRunning]       = useState(false);
  const [result,        setResult]        = useState(null);

  const model = PORTFOLIO_MODELS.find(m=>m.id===modelId) || PORTFOLIO_MODELS[6];

  const run = useCallback(() => {
    setRunning(true);
    // Run in next tick so UI updates
    setTimeout(() => {
      const annualReturn = (model.targetReturnMin+model.targetReturnMax)/2;
      const r = runMonteCarlo({
        startValue, monthlyContrib, years,
        annualReturn, volatility: model.volatility,
        withdrawalRate, inflationRate, simCount:1000,
      });
      setResult(r);
      setRunning(false);
    }, 50);
  }, [startValue,monthlyContrib,years,modelId,withdrawalRate,inflationRate,model]);

  const reset = () => setResult(null);

  /* Success color */
  const successColor = result
    ? result.successRate >= 90 ? GREEN : result.successRate >= 70 ? YELLOW : RED
    : GOLD;

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:"1rem" }}>

      {/* ── Inputs ── */}
      <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem" }}>
        <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:"1rem",
          letterSpacing:"0.06em",textTransform:"uppercase" }}>Simulation Parameters</div>

        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:"1.25rem",marginBottom:"1rem" }}>
          <SliderInput label="Starting Portfolio Value" value={startValue} onChange={setStartValue}
            min={10000} max={2000000} step={10000} format={fmt}/>
          <SliderInput label="Monthly Contribution ($)" value={monthlyContrib} onChange={setMonthlyContrib}
            min={0} max={5000} step={100} format={v=>`$${v.toLocaleString()}`}/>
          <SliderInput label="Time Horizon (Years)" value={years} onChange={setYears}
            min={5} max={50} step={1} format={v=>`${v} yrs`}/>
          <SliderInput label="Annual Withdrawal Rate (%)" value={withdrawalRate} onChange={setWithdrawalRate}
            min={0} max={8} step={0.5} format={v=>v===0?"None":v+"%"}
            sub="0 = accumulation phase"/>
          <SliderInput label="Inflation Assumption (%)" value={inflationRate} onChange={setInflationRate}
            min={0} max={8} step={0.5} format={v=>v+"%"}/>
        </div>

        {/* Model select */}
        <div style={{ display:"flex",alignItems:"center",gap:"0.75rem",flexWrap:"wrap" }}>
          <div style={{ fontSize:"0.5625rem",color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"0.08em" }}>
            Portfolio Model:
          </div>
          <select value={modelId} onChange={e=>setModelId(Number(e.target.value))}
            style={{ background:"var(--elevated)",border:"1px solid var(--border-c)",borderRadius:6,
              padding:"6px 10px",color:"var(--text-1)",fontSize:"0.75rem",cursor:"pointer",flex:1,maxWidth:360 }}>
            {PORTFOLIO_MODELS.map(m=>(
              <option key={m.id} value={m.id}>
                #{m.id} {m.name} (Risk {m.riskLevel}/10 · {m.targetReturnMin}–{m.targetReturnMax}% target)
              </option>
            ))}
          </select>
          <div style={{ fontSize:"0.625rem",color:"var(--text-3)" }}>
            Using {(model.targetReturnMin+model.targetReturnMax)/2}% avg return · {model.volatility}% vol
          </div>
          <button onClick={run} disabled={running} style={{
            display:"flex",alignItems:"center",gap:6,padding:"7px 18px",
            background:"rgba(201,169,110,0.15)",border:"1px solid rgba(201,169,110,0.4)",
            borderRadius:7,color:GOLD,fontSize:"0.75rem",fontWeight:700,
            cursor:running?"not-allowed":"pointer",opacity:running?0.6:1,
          }}>
            <Play size={13}/> {running?"Running 1,000 Simulations…":"Run Monte Carlo"}
          </button>
          {result && (
            <button onClick={reset} style={{
              display:"flex",alignItems:"center",gap:5,padding:"6px 12px",
              background:"none",border:"1px solid var(--border-c)",
              borderRadius:7,color:"var(--text-3)",fontSize:"0.75rem",cursor:"pointer",
            }}><RotateCcw size={12}/> Reset</button>
          )}
        </div>
      </div>

      {result && (
        <>
          {/* ── Key outcomes ── */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:"0.625rem" }}>
            {[
              ["Success Rate",         `${result.successRate}%`,   successColor],
              ["Median Outcome (50th)",  fmt(result.p50),           GOLD],
              ["Best Case (90th)",       fmt(result.p90),           GREEN],
              ["Good Case (75th)",       fmt(result.p75),           "#84cc16"],
              ["Bad Case (25th)",        fmt(result.p25),           YELLOW],
              ["Worst Case (10th)",      fmt(result.p10),           RED],
            ].map(([l,v,c])=>(
              <div key={l} style={{ background:"var(--surface)",border:"1px solid var(--border-c)",
                borderRadius:8,padding:"0.75rem 1rem" }}>
                <div style={{ fontSize:"0.5rem",color:"var(--text-3)",textTransform:"uppercase",
                  letterSpacing:"0.08em",marginBottom:4 }}>{l}</div>
                <div style={{ fontSize:"1.125rem",fontWeight:900,color:c,lineHeight:1 }}>{v}</div>
                <div style={{ fontSize:"0.5rem",color:"var(--text-3)",marginTop:2 }}>after {years} years</div>
              </div>
            ))}
          </div>

          {/* ── Fan chart ── */}
          <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem" }}>
            <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:4,
              letterSpacing:"0.06em",textTransform:"uppercase" }}>Probability Fan Chart — 1,000 Simulations</div>
            <div style={{ fontSize:"0.625rem",color:"var(--text-3)",marginBottom:"0.75rem" }}>
              Shaded bands show range of outcomes. Darker = higher probability.
            </div>
            <div style={{ display:"flex",gap:"1rem",marginBottom:"0.5rem" }}>
              {[["90th",GREEN],["75th","#84cc16"],["Median",GOLD],["25th",YELLOW],["10th",RED]].map(([l,c])=>(
                <div key={l} style={{ display:"flex",alignItems:"center",gap:4,fontSize:"0.5rem",color:"var(--text-3)" }}>
                  <div style={{ width:8,height:8,borderRadius:2,background:c,opacity:0.6 }}/>{l}
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={result.fanData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)"/>
                <XAxis dataKey="year" tickFormatter={v=>`Yr ${v}`} tick={{ fill:"var(--text-3)",fontSize:10 }}/>
                <YAxis tickFormatter={v=>`$${(v/1000).toFixed(0)}K`} tick={{ fill:"var(--text-3)",fontSize:10 }}/>
                <Tooltip content={<FanTip/>}/>
                <Area type="monotone" dataKey="p90" fill={GREEN} fillOpacity={0.08} stroke={GREEN} strokeWidth={1.5}/>
                <Area type="monotone" dataKey="p75" fill={"#84cc16"} fillOpacity={0.10} stroke={"#84cc16"} strokeWidth={1}/>
                <Area type="monotone" dataKey="p50" fill={GOLD} fillOpacity={0.15} stroke={GOLD} strokeWidth={2}/>
                <Area type="monotone" dataKey="p25" fill={YELLOW} fillOpacity={0.10} stroke={YELLOW} strokeWidth={1}/>
                <Area type="monotone" dataKey="p10" fill={RED} fillOpacity={0.08} stroke={RED} strokeWidth={1.5}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* ── Withdrawal rate success ── */}
          <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem" }}>
            <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:4,
              letterSpacing:"0.06em",textTransform:"uppercase" }}>Withdrawal Rate Success Probability</div>
            <div style={{ fontSize:"0.625rem",color:"var(--text-3)",marginBottom:"0.75rem" }}>
              Probability portfolio lasts {years} years at each withdrawal rate (% of starting value)
            </div>
            <div style={{ display:"flex",gap:"0.75rem",flexWrap:"wrap" }}>
              {result.withdrawalAnalysis.map(w=>{
                const c=w.success>=90?GREEN:w.success>=70?YELLOW:RED;
                return (
                  <div key={w.rate} style={{ flex:1,minWidth:100,textAlign:"center",
                    padding:"0.875rem",background:"var(--elevated)",borderRadius:8,
                    border:`1px solid ${c}20` }}>
                    <div style={{ fontSize:"0.5rem",color:"var(--text-3)",letterSpacing:"0.1em",
                      textTransform:"uppercase",marginBottom:4 }}>SWR {w.rate}</div>
                    <div style={{ fontSize:"1.5rem",fontWeight:900,color:c }}>{w.success}%</div>
                    <div style={{ fontSize:"0.5rem",color:"var(--text-3)",marginTop:2 }}>success rate</div>
                    <div style={{ marginTop:6,height:3,background:"var(--border-c)",borderRadius:2 }}>
                      <div style={{ height:"100%",width:`${w.success}%`,background:c,borderRadius:2 }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ── Sequence of Returns Risk ── */}
      <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem" }}>
        <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:4,
          letterSpacing:"0.06em",textTransform:"uppercase" }}>Sequence of Returns Risk</div>
        <div style={{ fontSize:"0.625rem",color:"var(--text-3)",marginBottom:"0.75rem",lineHeight:1.6 }}>
          Two portfolios with identical <em>average</em> returns (7%) but different return sequences.
          $100,000 starting value, $3,500/year withdrawal. The order of returns dramatically changes outcomes.
        </div>
        <SequenceChart/>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem",marginTop:"0.875rem" }}>
          {[
            ["Good Early Returns",GREEN,"Bull market early then bear late. Portfolio survives.","More wealth, more flexibility, sequence risk is manageable."],
            ["Bad Early Returns",RED,"Bear market early then bull late. Portfolio depleted early.","Same 7% avg return but portfolio potentially destroyed by early losses + withdrawals."],
          ].map(([l,c,desc,msg])=>(
            <div key={l} style={{ padding:"0.75rem",background:"var(--elevated)",borderRadius:7,
              border:`1px solid ${c}20` }}>
              <div style={{ fontSize:"0.5625rem",fontWeight:700,color:c,textTransform:"uppercase",
                letterSpacing:"0.06em",marginBottom:4 }}>{l}</div>
              <div style={{ fontSize:"0.625rem",color:"var(--text-2)",lineHeight:1.5,marginBottom:4 }}>{desc}</div>
              <div style={{ fontSize:"0.625rem",color:"var(--text-3)",fontStyle:"italic",lineHeight:1.5 }}>{msg}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:"0.875rem",padding:"0.75rem",background:"rgba(201,169,110,0.06)",
          border:"1px solid rgba(201,169,110,0.15)",borderRadius:7,fontSize:"0.6875rem",
          color:"var(--text-2)",lineHeight:1.6 }}>
          <strong style={{ color:GOLD }}>Protection Strategies:</strong> Bond tent (increase bonds around retirement),
          cash buffer (2 years of expenses in cash), dynamic withdrawal (reduce spending in down years),
          bucket strategy (segment portfolio by time horizon).
        </div>
      </div>
    </div>
  );
}
