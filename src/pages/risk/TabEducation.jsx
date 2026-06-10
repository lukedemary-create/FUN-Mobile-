import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, ReferenceLine, Cell,
  PieChart, Pie,
} from "recharts";
import {
  ChevronDown, ChevronUp, BarChart2, Zap, Target, Search, Umbrella,
  Calendar, Clock, TrendingDown, TrendingUp, Layers, Landmark, MapPin,
  Scale, Receipt, HeartPulse, GraduationCap, BookOpen, Heart, Building2,
} from "lucide-react";
import { GOLD, GREEN, RED, YELLOW, BLUE, PURPLE } from "./riskData";

const ORANGE = "#f97316";
const TEAL = "#14b8a6";

const fmt = (n) => `$${n.toLocaleString()}`;

/* ── Accordion section ───────────────────────────────────────────── */
function Section({ title, subtitle, icon, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,overflow:"hidden" }}>
      <button onClick={()=>setOpen(o=>!o)} style={{
        width:"100%",textAlign:"left",padding:"0.875rem 1rem",
        background:"none",border:"none",cursor:"pointer",
        display:"flex",alignItems:"center",gap:"0.75rem",
      }}>
        <div style={{ fontSize:"1.25rem" }}>{icon}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:"0.75rem",fontWeight:800,color:"var(--text-1)" }}>{title}</div>
          <div style={{ fontSize:"0.8rem",color:"var(--text-3)",marginTop:2 }}>{subtitle}</div>
        </div>
        {open ? <ChevronUp size={14} style={{ color:"var(--text-3)",flexShrink:0 }}/>
               : <ChevronDown size={14} style={{ color:"var(--text-3)",flexShrink:0 }}/>}
      </button>
      {open && (
        <div style={{ padding:"0 1rem 1rem",borderTop:"1px solid var(--border-c)" }}>
          <div style={{ paddingTop:"0.875rem" }}>{children}</div>
        </div>
      )}
    </div>
  );
}

const P = ({ children }) => (
  <p style={{ fontSize:"0.75rem",color:"var(--text-2)",lineHeight:1.7,margin:"0 0 0.75rem" }}>{children}</p>
);

const Formula = ({ children }) => (
  <div style={{ fontFamily:"'JetBrains Mono','Fira Code',monospace",fontSize:"0.75rem",
    background:"var(--elevated)",border:"1px solid var(--border-c)",borderRadius:6,
    padding:"8px 14px",color:GOLD,margin:"0.5rem 0",letterSpacing:"0.02em" }}>
    {children}
  </div>
);

const KeyPoint = ({ color=GOLD, children }) => (
  <div style={{ display:"flex",gap:6,alignItems:"flex-start",marginBottom:4 }}>
    <div style={{ width:5,height:5,borderRadius:"50%",background:color,flexShrink:0,marginTop:5 }}/>
    <div style={{ fontSize:"0.6875rem",color:"var(--text-2)",lineHeight:1.5 }}>{children}</div>
  </div>
);

/* ── Standard Deviation chart ────────────────────────────────────── */
function VolChart() {
  const t=[];
  for(let i=0;i<60;i++){
    const noise=(Math.sin(i*0.4)+Math.cos(i*0.7)+Math.sin(i*1.1))*4;
    t.push({month:i+1,highVol:100000*(1+noise/100),lowVol:100000*(1+noise*0.3/100)});
  }
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={t}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)"/>
        <XAxis dataKey="month" tick={{ fill:"var(--text-3)",fontSize:9 }}/>
        <YAxis tickFormatter={v=>fmt(v)} tick={{ fill:"var(--text-3)",fontSize:9 }} width={70}/>
        <Tooltip formatter={(v)=>fmt(v)}
          contentStyle={{ background:"var(--elevated)",border:"1px solid var(--border-c)",borderRadius:6,fontSize:"0.6875rem",color:"var(--text-1)" }}
          itemStyle={{ color:"var(--text-1)" }}/>
        <Line type="monotone" dataKey="highVol" name="High Volatility (20% vol)" stroke={RED} strokeWidth={1.5} dot={false}/>
        <Line type="monotone" dataKey="lowVol"  name="Low Volatility (6% vol)"  stroke={GREEN} strokeWidth={1.5} dot={false}/>
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ── DCA vs Lump Sum ─────────────────────────────────────────────── */
function DCAChart() {
  const data=[];
  let lump=100000,dca=0;
  for(let yr=0;yr<=20;yr++){
    const r=0.08;
    data.push({year:yr,lump:Math.round(lump),dca:Math.round(dca)});
    lump*=(1+r);
    dca=dca*(1+r)+5000;
  }
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)"/>
        <XAxis dataKey="year" tickFormatter={v=>`Yr ${v}`} tick={{ fill:"var(--text-3)",fontSize:9 }}/>
        <YAxis tickFormatter={v=>`$${(v/1000).toFixed(0)}K`} tick={{ fill:"var(--text-3)",fontSize:9 }}/>
        <Tooltip formatter={(v)=>fmt(v)}
          contentStyle={{ background:"var(--elevated)",border:"1px solid var(--border-c)",borderRadius:6,fontSize:"0.6875rem",color:"var(--text-1)" }}
          itemStyle={{ color:"var(--text-1)" }}/>
        <Line type="monotone" dataKey="lump" name="Lump Sum $100K at start" stroke={GOLD} strokeWidth={2} dot={false}/>
        <Line type="monotone" dataKey="dca"  name="DCA $5K/yr over 20 years" stroke={BLUE} strokeWidth={2} dot={false}/>
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ── Time in market ──────────────────────────────────────────────── */
function TimeInMarketChart() {
  // Miss the 10 best days cost
  const data=[
    {scenario:"Fully invested",  final:Math.round(100000*Math.pow(1.095,20))},
    {scenario:"Miss 10 best days",final:Math.round(100000*Math.pow(1.062,20))},
    {scenario:"Miss 20 best days",final:Math.round(100000*Math.pow(1.038,20))},
    {scenario:"Miss 30 best days",final:Math.round(100000*Math.pow(1.016,20))},
    {scenario:"Miss 40 best days",final:Math.round(100000*Math.pow(0.996,20))},
  ];
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" vertical={false}/>
        <XAxis type="number" tickFormatter={v=>fmt(v)} tick={{ fill:"var(--text-3)",fontSize:9 }}/>
        <YAxis type="category" dataKey="scenario" width={130} tick={{ fill:"var(--text-2)",fontSize:9 }}/>
        <Tooltip formatter={(v)=>fmt(v)}
          contentStyle={{ background:"var(--elevated)",border:"1px solid var(--border-c)",borderRadius:6,fontSize:"0.6875rem",color:"var(--text-1)" }}
          itemStyle={{ color:"var(--text-1)" }}/>
        <Bar dataKey="final" name="Portfolio Value" radius={[0,4,4,0]}>
          {data.map((e,i)=><Cell key={i} fill={i===0?GREEN:i===1?YELLOW:i===2?"#f97316":RED}/>)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ── Diversification chart ───────────────────────────────────────── */
function DiversificationChart() {
  const data=Array.from({length:20},(_,i)=>({
    stocks:i+1,
    portfolioVol:30/Math.sqrt(i+1)+8,
    marketVol:15,
  }));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)"/>
        <XAxis dataKey="stocks" label={{ value:"# of Stocks", position:"insideBottom",
          offset:-4, fill:"var(--text-3)", fontSize:9 }} tick={{ fill:"var(--text-3)",fontSize:9 }}/>
        <YAxis tickFormatter={v=>v+"%"} tick={{ fill:"var(--text-3)",fontSize:9 }}/>
        <Tooltip formatter={(v)=>[v.toFixed(1)+"%",""]}
          contentStyle={{ background:"var(--elevated)",border:"1px solid var(--border-c)",borderRadius:6,fontSize:"0.6875rem",color:"var(--text-1)" }}
          itemStyle={{ color:"var(--text-1)" }}/>
        <ReferenceLine y={15} stroke={YELLOW} strokeDasharray="4 4"
          label={{ value:"Market (Systematic) Risk", position:"right", fill:YELLOW, fontSize:9 }}/>
        <Area type="monotone" dataKey="portfolioVol" name="Portfolio Volatility"
          fill={`${GOLD}20`} stroke={GOLD} strokeWidth={2}/>
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ── Factor returns chart ────────────────────────────────────────── */
function FactorChart() {
  const data=[
    {factor:"Market",        premium:6.8,color:"#22c55e"},
    {factor:"Value",         premium:3.2,color:"#3b82f6"},
    {factor:"Size (Small Cap)",premium:2.8,color:GOLD},
    {factor:"Profitability", premium:2.4,color:"#a855f7"},
    {factor:"Investment",    premium:2.1,color:"#f97316"},
    {factor:"Momentum",      premium:4.6,color:"#14b8a6"},
    {factor:"Low Volatility",premium:1.8,color:"#84cc16"},
  ];
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" vertical={false}/>
        <XAxis type="number" tickFormatter={v=>v+"%"} tick={{ fill:"var(--text-3)",fontSize:9 }}/>
        <YAxis type="category" dataKey="factor" width={100} tick={{ fill:"var(--text-2)",fontSize:9 }}/>
        <Tooltip formatter={(v)=>[v+"%","Avg Annual Premium"]}
          contentStyle={{ background:"var(--elevated)",border:"1px solid var(--border-c)",borderRadius:6,fontSize:"0.6875rem",color:"var(--text-1)" }}
          itemStyle={{ color:"var(--text-1)" }}/>
        <Bar dataKey="premium" name="Risk Premium" radius={[0,4,4,0]}>
          {data.map((e,i)=><Cell key={i} fill={e.color}/>)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ── 4% Rule chart ───────────────────────────────────────────────── */
function FourPctChart() {
  const data=[];
  let v=1000000;
  for(let yr=0;yr<=30;yr++){
    data.push({year:yr,value:Math.max(0,Math.round(v))});
    v=v*1.07-40000;
  }
  const bear=[];
  let vb=1000000;
  for(let yr=0;yr<=30;yr++){
    bear.push({year:yr,value:Math.max(0,Math.round(vb))});
    vb=vb*(1+(yr<5?-0.05:0.09))-40000;
  }
  const combo=data.map((d,i)=>({...d,bear:bear[i].value}));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={combo}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)"/>
        <XAxis dataKey="year" tickFormatter={v=>`Yr ${v}`} tick={{ fill:"var(--text-3)",fontSize:9 }}/>
        <YAxis tickFormatter={v=>`$${(v/1000).toFixed(0)}K`} tick={{ fill:"var(--text-3)",fontSize:9 }} width={55}/>
        <ReferenceLine y={0} stroke={RED} strokeDasharray="4 4"/>
        <Tooltip formatter={(v)=>fmt(v)}
          contentStyle={{ background:"var(--elevated)",border:"1px solid var(--border-c)",borderRadius:6,fontSize:"0.6875rem",color:"var(--text-1)" }}
          itemStyle={{ color:"var(--text-1)" }}/>
        <Line type="monotone" dataKey="value" name="Bull market (7% avg)" stroke={GREEN} strokeWidth={2} dot={false}/>
        <Line type="monotone" dataKey="bear"  name="Bear early (seq. risk)" stroke={RED} strokeWidth={2} dot={false}/>
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ── Main ─────────────────────────────────────────────────────────── */
export default function TabEducation() {
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:"0.75rem" }}>
      <div style={{ fontSize:"0.5625rem",color:"var(--text-3)",padding:"0.5rem 0",letterSpacing:"0.06em" }}>
        Click any topic to expand the full explanation with interactive charts.
      </div>

      <Section title="Standard Deviation & Volatility" icon={<BarChart2 size={18} color={GOLD} />}
        subtitle="Why volatility is the price of returns — and how to measure it">
        <P>Standard deviation measures how much an investment's returns vary around its average. A portfolio with 10% annual volatility can swing ±10% from its expected return in a typical year.</P>
        <Formula>Volatility = √( Σ(return - avg)² / n )</Formula>
        <VolChart/>
        <div style={{ marginTop:"0.75rem" }}>
          <KeyPoint color={RED}>High volatility = wider range of outcomes = more emotional challenge</KeyPoint>
          <KeyPoint color={GREEN}>Low volatility = smoother ride, but typically lower long-run returns</KeyPoint>
          <KeyPoint>A 60/40 portfolio averages ~10% annual vol. A 100% equity portfolio ~17-22% vol.</KeyPoint>
          <KeyPoint>Institutional investors like pension funds target maximum return at a specified volatility budget.</KeyPoint>
        </div>
      </Section>

      <Section title="Sharpe Ratio" icon={<Zap size={18} color={GOLD} />}
        subtitle="The gold standard of risk-adjusted return measurement">
        <P>The Sharpe Ratio measures return earned <em>per unit of risk taken</em>. A higher Sharpe means you earned more return for each percent of volatility you accepted.</P>
        <Formula>Sharpe Ratio = (Portfolio Return - Risk-Free Rate) / Portfolio Volatility</Formula>
        <P>Example: A portfolio returning 10% with 12% volatility, versus a 5% risk-free rate: Sharpe = (10-5)/12 = 0.42</P>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8,margin:"0.75rem 0" }}>
          {[["< 0","Negative"],["0–0.5","Poor"],["0.5–1.0","Acceptable"],["1.0–2.0","Good"],["2.0+","Excellent"]].map(([r,q])=>(
            <div key={r} style={{ textAlign:"center",padding:"0.5rem",background:"var(--elevated)",borderRadius:6 }}>
              <div style={{ fontSize:"0.875rem",fontWeight:800,color:
                r==="2.0+"?GREEN:r==="1.0–2.0"?"#84cc16":r==="0.5–1.0"?YELLOW:r==="0–0.5"?"#f97316":RED }}>{r}</div>
              <div style={{ fontSize:"0.5rem",color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"0.06em",marginTop:2 }}>{q}</div>
            </div>
          ))}
        </div>
        <KeyPoint color={GREEN}>Most diversified equity portfolios target 0.7–1.0 Sharpe over full market cycles.</KeyPoint>
        <KeyPoint>The Sortino Ratio is a variant that only penalizes downside volatility (ignores positive returns variation).</KeyPoint>
      </Section>

      <Section title="Beta & Alpha" icon="α β"
        subtitle="Measuring market sensitivity and manager skill">
        <P><strong style={{ color:GOLD }}>Beta</strong> measures how much a portfolio moves relative to the market. Beta of 1.0 = moves exactly with the S&P 500. Beta of 1.5 = moves 50% more. Beta of 0.5 = moves half as much.</P>
        <Formula>Beta = Covariance(portfolio, market) / Variance(market)</Formula>
        <P><strong style={{ color:GOLD }}>Alpha</strong> measures excess return above what Beta alone predicts. Positive alpha means the manager added value beyond market exposure. Most passive funds have alpha near zero.</P>
        <Formula>Alpha = Portfolio Return - (Risk-Free Rate + Beta × (Market Return - Risk-Free Rate))</Formula>
        <div style={{ marginTop:"0.5rem" }}>
          <KeyPoint color={RED}>High beta (>1.2) = amplified market swings in both directions</KeyPoint>
          <KeyPoint color={GREEN}>Low beta (0.3–0.6) = defensive portfolios (bonds, utilities, gold)</KeyPoint>
          <KeyPoint>Most retail investors should focus on beta management, not chasing alpha.</KeyPoint>
          <KeyPoint>R-Squared (0–100) measures how much of portfolio movement is explained by the market benchmark.</KeyPoint>
        </div>
      </Section>

      <Section title="Modern Portfolio Theory (MPT)" icon={<Target size={18} color={GOLD} />}
        subtitle="Markowitz 1952 — the math behind diversification">
        <P>Harry Markowitz proved in 1952 that by combining assets with low correlations, investors can reduce portfolio risk without sacrificing return. This is the mathematical proof of "don't put all your eggs in one basket."</P>
        <P>The <strong style={{ color:GOLD }}>Efficient Frontier</strong> is the set of portfolios that maximize return for each level of risk. No rational investor should hold a portfolio below the frontier.</P>
        <DiversificationChart/>
        <div style={{ marginTop:"0.75rem" }}>
          <KeyPoint color={GREEN}>Adding uncorrelated assets reduces total portfolio volatility</KeyPoint>
          <KeyPoint>Two assets with -1.0 correlation can theoretically eliminate all risk</KeyPoint>
          <KeyPoint>Real diversification requires assets that behave differently in crisis periods</KeyPoint>
          <KeyPoint>The 2022 bear market showed stocks AND bonds both fell — MPT assumptions were tested</KeyPoint>
        </div>
      </Section>

      <Section title="Factor Investing (Smart Beta)" icon={<Search size={18} color={GOLD} />}
        subtitle="Fama-French, momentum, quality — the science of excess returns">
        <P>Academic research identified specific characteristics (factors) that have historically delivered excess returns over the market. Factor investing tilts portfolios toward these characteristics systematically.</P>
        <FactorChart/>
        <div style={{ marginTop:"0.75rem" }}>
          <KeyPoint color={GOLD}>Value: Companies trading below intrinsic value outperform growth over long periods</KeyPoint>
          <KeyPoint color={"#3b82f6"}>Size: Small cap stocks outperform large caps with higher volatility</KeyPoint>
          <KeyPoint color={"#a855f7"}>Momentum: Recent winners tend to keep winning (6-12 month effect)</KeyPoint>
          <KeyPoint color={GREEN}>Profitability: High-profit firms outperform low-profit firms</KeyPoint>
          <KeyPoint>Factor premiums are real but disappear for years — requires discipline and long horizon</KeyPoint>
        </div>
      </Section>

      <Section title="The 4% Withdrawal Rule" icon={<Umbrella size={18} color={GOLD} />}
        subtitle="How much can you safely withdraw in retirement — the Trinity Study">
        <P>The 4% Rule (Bengen 1994, Trinity Study 1998): A retiree can withdraw 4% of their starting portfolio annually (inflation-adjusted) with high probability of the portfolio lasting 30 years, based on historical US market returns.</P>
        <FourPctChart/>
        <P>Starting with $1,000,000 → $40,000/year withdrawal. With average 7% returns this works. Sequence of returns risk is the key threat.</P>
        <div style={{ marginTop:"0.5rem" }}>
          <KeyPoint color={GREEN}>3% withdrawal rate: ~99% historical success rate over 30 years</KeyPoint>
          <KeyPoint color={GOLD}>4% withdrawal rate: ~90% historical success rate over 30 years</KeyPoint>
          <KeyPoint color={YELLOW}>5% withdrawal rate: ~74% historical success rate — elevated risk</KeyPoint>
          <KeyPoint color={RED}>The 4% rule may be too high for 40-50 year retirements or low-return environments</KeyPoint>
          <KeyPoint>Dynamic withdrawal (reduce in down years) significantly improves success rates</KeyPoint>
        </div>
      </Section>

      <Section title="Dollar Cost Averaging vs Lump Sum" icon={<Calendar size={18} color={GOLD} />}
        subtitle="When to invest all at once vs spreading it out">
        <P>Research shows lump sum investing outperforms dollar cost averaging (DCA) approximately two-thirds of the time, because markets trend upward over time. However, DCA reduces regret and sequence of returns risk for risk-averse investors.</P>
        <DCAChart/>
        <div style={{ marginTop:"0.75rem" }}>
          <KeyPoint color={GREEN}>Lump sum wins ~67% of the time over 12-month DCA windows (Vanguard, 2012)</KeyPoint>
          <KeyPoint>DCA wins when markets decline after investment — reduces regret and emotional damage</KeyPoint>
          <KeyPoint color={GOLD}>For regular wage earners, DCA is automatic via paycheck contributions — this is optimal</KeyPoint>
          <KeyPoint>For windfall (inheritance, bonus, stock options): lump sum if you can handle volatility</KeyPoint>
        </div>
      </Section>

      <Section title="Time in Market vs Market Timing" icon={<Clock size={18} color={GOLD} />}
        subtitle="Why missing the best days is catastrophic">
        <P>Missing just the 10 best trading days over 20 years can cut your final portfolio value by nearly half. The best days often occur during extreme volatility — when panic sellers are out of the market.</P>
        <TimeInMarketChart/>
        <div style={{ marginTop:"0.75rem" }}>
          <KeyPoint color={RED}>Attempting to time the market consistently requires being right twice (when to exit AND when to re-enter)</KeyPoint>
          <KeyPoint color={GREEN}>Staying fully invested through all market conditions is the most reliable strategy for most investors</KeyPoint>
          <KeyPoint>The best 10 days over 20 years often cluster around the worst periods (COVID 2020, GFC 2008-09)</KeyPoint>
          <KeyPoint>Professional traders who attempt market timing underperform passive indices ~85% of the time over 10 years</KeyPoint>
        </div>
      </Section>

      <Section title="Maximum Drawdown & Recovery" icon={<TrendingDown size={18} color={GOLD} />}
        subtitle="Understanding the true cost of portfolio losses">
        <P>Maximum drawdown is the largest peak-to-trough decline in portfolio history. It measures the worst experience a long-term investor would have faced. Understanding recovery math is critical: a 50% loss requires a 100% gain to recover.</P>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:6,margin:"0.75rem 0" }}>
          {[[-10,11.1],[-20,25],[-30,42.9],[-40,66.7],[-50,100],[-60,150],[-80,400],[-89,809]].map(([l,r])=>(
            <div key={l} style={{ textAlign:"center",padding:"0.5rem",background:"var(--elevated)",borderRadius:6 }}>
              <div style={{ fontSize:"0.875rem",fontWeight:900,color:RED }}>{l}%</div>
              <div style={{ fontSize:"0.5rem",color:"var(--text-3)",margin:"2px 0" }}>loss</div>
              <div style={{ fontSize:"0.75rem",fontWeight:700,color:GREEN }}>+{r}%</div>
              <div style={{ fontSize:"0.5rem",color:"var(--text-3)" }}>needed to recover</div>
            </div>
          ))}
        </div>
        <KeyPoint color={GREEN}>A diversified 60/40 portfolio's worst drawdown was -22% in 2022 vs S&P 500 -57% in GFC</KeyPoint>
        <KeyPoint color={RED}>The S&P 500 fell -89% in the Great Depression and took 25 years to recover in real terms</KeyPoint>
        <KeyPoint>Volatility harvesting (rebalancing during drawdowns) can reduce recovery time</KeyPoint>
      </Section>

      {/* ════════════════════════════════════════════════════════════
          INVESTMENT EDUCATION — ASSET CLASSES & ACCOUNTS
      ════════════════════════════════════════════════════════════ */}
      <div style={{ margin:"0.75rem 0 0.25rem",padding:"0.5rem 0.75rem",
        border:`1px solid rgba(201,169,110,0.2)`,background:"rgba(201,169,110,0.05)",borderRadius:6,borderTop:`2px solid ${GOLD}` }}>
        <div style={{ fontSize:"0.5625rem",fontWeight:800,letterSpacing:"0.12em",
          textTransform:"uppercase",color:GOLD }}>Asset Classes, Account Types & Tax Strategy</div>
        <div style={{ fontSize:"0.5625rem",color:"var(--text-3)",marginTop:2 }}>
          Everything you need to know about what to invest in, where to hold it, and how it's taxed
        </div>
      </div>

      <Section title="Asset Classes & Risk Spectrum" icon={<Layers size={18} color={GOLD} />}
        subtitle="Stocks, ETFs, bonds, REITs, crypto, metals — risk rated and explained">
        <AssetClassSpectrum />
      </Section>

      <Section title="Investment Account Types — Complete Breakdown" icon={<Landmark size={18} color={GOLD} />}
        subtitle="Roth IRA, Traditional IRA, 401k, Roth 401k, Brokerage — rules, limits & tax treatment">
        <AccountTypeBreakdown />
      </Section>

      <Section title="Asset Location Strategy — What Goes Where" icon={<MapPin size={18} color={GOLD} />}
        subtitle="Maximize after-tax returns by putting the right investments in the right accounts">
        <AssetLocation />
      </Section>

      <Section title="The Investment Priority Ladder — What to Fund First" icon={<Layers size={18} color={GOLD} />}
        subtitle="The optimal order to fund each account for maximum lifetime wealth">
        <PriorityLadder />
      </Section>

      <Section title="Roth 401k vs Traditional 401k — Deep Dive" icon={<Scale size={18} color={GOLD} />}
        subtitle="Marginal tax rates, when each wins, and how to split contributions intelligently">
        <RothVsTraditional />
      </Section>

      <Section title="How Each Account Gets Taxed — The Full Picture" icon={<Receipt size={18} color={GOLD} />}
        subtitle="Contribution tax, growth tax, withdrawal tax, penalties, RMDs — all accounts side by side">
        <TaxDeepDive />
      </Section>

    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ASSET CLASS SPECTRUM
══════════════════════════════════════════════════════════════════ */
const ASSET_CLASSES = [
  {
    name: "Cash & CDs",
    risk: 1, riskLabel: "Near Zero",
    color: "#64748b",
    return: "4–5%",
    volatility: "~0%",
    taxNote: "Interest taxed as ordinary income",
    bestFor: "Emergency fund, short-term goals (<2 yrs)",
    watchOut: "Inflation erosion — 3% inflation destroys purchasing power",
    examples: "HYSA, Treasury bills, money market funds",
  },
  {
    name: "Government Bonds",
    risk: 2, riskLabel: "Very Low",
    color: TEAL,
    return: "4–5%",
    volatility: "2–5%",
    taxNote: "Federal taxable, state tax-exempt (Treasuries)",
    bestFor: "Capital preservation, income, portfolio ballast",
    watchOut: "Interest rate risk — bond prices fall when rates rise",
    examples: "TLT, BND, I-Bonds, TIPS, 2/10/30-yr Treasuries",
  },
  {
    name: "Corporate & Muni Bonds",
    risk: 3, riskLabel: "Low",
    color: "#06b6d4",
    return: "4–7%",
    volatility: "3–8%",
    taxNote: "Corp: ordinary income. Muni: federal tax-exempt (often state too)",
    bestFor: "Income generation, tax-advantaged accounts or high brackets",
    watchOut: "Credit risk (default), call risk on munis",
    examples: "AGG, LQD, MUB, HYG (high yield = higher risk)",
  },
  {
    name: "Structured Notes (Growth & Principal)",
    risk: 3, riskLabel: "Low–Medium",
    color: "#818cf8",
    return: "5–15% (capped)",
    volatility: "Buffered",
    taxNote: "Gains taxed as ordinary income at maturity unless structured differently",
    bestFor: "Investors wanting market upside with downside protection",
    watchOut: "Issuer credit risk, illiquid, complex tax treatment, early exit penalties",
    examples: "Buffer ETFs (BJUL, PJUL), bank-issued structured notes",
  },
  {
    name: "REITs",
    risk: 4, riskLabel: "Medium",
    color: ORANGE,
    return: "7–12%",
    volatility: "12–20%",
    taxNote: "Dividends mostly ordinary income (not qualified) — hold in IRA/401k",
    bestFor: "Real estate exposure without buying property; high income",
    watchOut: "Rate sensitive (price drops when rates rise), high tax drag in taxable accounts",
    examples: "VNQ, O (Realty Income), SPG, VICI, AMT",
  },
  {
    name: "Mutual Funds",
    risk: 4, riskLabel: "Varies",
    color: "#a78bfa",
    return: "6–12%",
    volatility: "10–20%",
    taxNote: "Capital gains distributions taxable even if you didn't sell — tax-inefficient",
    bestFor: "Retirement accounts (401k, IRA) where distributions don't trigger tax events",
    watchOut: "Higher expense ratios than ETFs/index funds; tax drag in brokerage",
    examples: "VTSAX, FXAIX, PRWCX, PIMCO Total Return",
  },
  {
    name: "Index Funds / ETFs",
    risk: 4, riskLabel: "Medium",
    color: BLUE,
    return: "8–11% (SP500 historical)",
    volatility: "15–18%",
    taxNote: "Low turnover = minimal capital gains distributions. Very tax-efficient.",
    bestFor: "Core of any portfolio — all account types. Best cost/return ratio available.",
    watchOut: "No downside protection — you ride the market all the way down",
    examples: "SPY, VOO, VTI, SCHB, QQQ, VXF, VXUS",
  },
  {
    name: "Dividend Stocks",
    risk: 4, riskLabel: "Medium",
    color: GREEN,
    return: "6–10% (price + dividend)",
    volatility: "12–18%",
    taxNote: "Qualified dividends: 0%/15%/20%. Non-qualified: ordinary income. Hold in IRA to defer.",
    bestFor: "Income generation; hold in Roth for tax-free dividend compounding",
    watchOut: "Dividend cuts hurt price; concentrated sector exposure (utilities, financials)",
    examples: "SCHD, VYM, JEPI, JNJ, KO, Realty Income",
  },
  {
    name: "Growth Stocks",
    risk: 5, riskLabel: "High",
    color: GOLD,
    return: "0–40%+ (high variance)",
    volatility: "25–60%",
    taxNote: "Hold >1yr for long-term capital gains (0%/15%/20%). Short-term = ordinary income.",
    bestFor: "Long-term growth; Roth IRA is ideal — gains never taxed",
    watchOut: "Extreme volatility; many companies fail; emotional discipline required",
    examples: "AAPL, NVDA, MSFT, TSLA, AMZN — individual selection risk",
  },
  {
    name: "Sector ETFs",
    risk: 5, riskLabel: "High",
    color: "#f43f5e",
    return: "Varies widely by cycle",
    volatility: "20–35%",
    taxNote: "Same as ETFs — generally tax-efficient; dividends may be ordinary income",
    bestFor: "Tactical overweights when you have conviction on a sector cycle",
    watchOut: "Concentration risk; timing sectors is difficult even for professionals",
    examples: "XLK (tech), XLE (energy), XLF (financials), ARKK (speculative)",
  },
  {
    name: "Precious Metals",
    risk: 5, riskLabel: "High",
    color: "#fbbf24",
    return: "2–8% long term",
    volatility: "15–25%",
    taxNote: "Physical gold/silver taxed as collectibles — 28% max rate. ETFs vary.",
    bestFor: "Inflation hedge, crisis insurance, portfolio diversifier (5–10% max)",
    watchOut: "No cash flow or dividends; storage costs for physical; underperforms stocks long-term",
    examples: "GLD, SLV, IAU, physical gold coins, mining stocks (GDX)",
  },
  {
    name: "Cryptocurrency",
    risk: 7, riskLabel: "Extreme",
    color: "#f97316",
    return: "-80% to +1000% (single year range)",
    volatility: "60–150%+",
    taxNote: "Every sale/trade/swap is a taxable event. Short-term gains = ordinary income. Long-term = capital gains.",
    bestFor: "Pure speculation with money you can afford to lose entirely; 1–5% max allocation",
    watchOut: "Regulatory risk, hack risk, exchange collapse (FTX), 80%+ drawdowns common",
    examples: "BTC, ETH — everything else is speculative. Use cold storage.",
  },
];

function RiskBar({ level }) {
  const max = 7;
  return (
    <div style={{ display:"flex",gap:2,alignItems:"center" }}>
      {Array.from({length:max},(_,i)=>(
        <div key={i} style={{
          width:14,height:6,borderRadius:2,
          background: i < level
            ? (level<=2 ? TEAL : level<=3 ? BLUE : level<=5 ? GOLD : level===6 ? ORANGE : RED)
            : "var(--border-alt)",
        }}/>
      ))}
    </div>
  );
}

function AssetClassSpectrum() {
  const [selected, setSelected] = useState(null);
  const ac = selected !== null ? ASSET_CLASSES[selected] : null;

  return (
    <div>
      <P>Every investment sits on a risk-return spectrum. Understanding where each asset class falls — and why — is the foundation of smart portfolio construction. Click any asset class to see the full breakdown.</P>

      {/* Risk ladder cards */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:8,marginBottom:"1rem" }}>
        {ASSET_CLASSES.map((a,i)=>(
          <button key={i} onClick={()=>setSelected(selected===i?null:i)} style={{
            textAlign:"left",padding:"0.625rem 0.75rem",borderRadius:7,cursor:"pointer",
            border:`1px solid ${selected===i ? a.color : "var(--border-c)"}`,
            background: selected===i ? `${a.color}12` : "var(--elevated)",
            transition:"all 0.15s",
          }}>
            <div style={{ fontSize:"0.6875rem",fontWeight:700,color:a.color,marginBottom:4 }}>{a.name}</div>
            <RiskBar level={a.risk}/>
            <div style={{ fontSize:"0.5rem",color:"var(--text-3)",marginTop:3,letterSpacing:"0.05em" }}>
              RISK: {a.riskLabel} · RETURN: {a.return}
            </div>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      {ac && (
        <div style={{ background:"var(--elevated)",borderRadius:10,border:`1px solid ${ac.color}40`,padding:"1rem",marginTop:"0.5rem" }}>
          <div style={{ display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.875rem" }}>
            <div style={{ width:4,height:36,background:ac.color,borderRadius:2,flexShrink:0 }}/>
            <div>
              <div style={{ fontSize:"0.875rem",fontWeight:800,color:ac.color }}>{ac.name}</div>
              <RiskBar level={ac.risk}/>
            </div>
            <div style={{ marginLeft:"auto",textAlign:"right" }}>
              <div style={{ fontSize:"0.5rem",color:"var(--text-3)",letterSpacing:"0.08em" }}>TYPICAL ANNUAL RETURN</div>
              <div style={{ fontSize:"1.25rem",fontWeight:800,fontFamily:"monospace",color:ac.color }}>{ac.return}</div>
            </div>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem" }}>
            <InfoBox label="Examples" value={ac.examples} color={ac.color}/>
            <InfoBox label="Volatility" value={ac.volatility} color={ac.color}/>
            <InfoBox label="Tax Treatment" value={ac.taxNote} color={ORANGE}/>
            <InfoBox label="Best For" value={ac.bestFor} color={GREEN}/>
            <div style={{ gridColumn:"1/-1" }}>
              <InfoBox label="Watch Out For" value={ac.watchOut} color={RED}/>
            </div>
          </div>
        </div>
      )}

      {/* Risk spectrum legend */}
      <div style={{ display:"flex",alignItems:"center",gap:"0.5rem",marginTop:"1rem",flexWrap:"wrap" }}>
        <span style={{ fontSize:"0.5rem",color:"var(--text-3)",letterSpacing:"0.08em" }}>RISK SCALE →</span>
        {[[1,TEAL,"Near Zero"],[2,TEAL,"Very Low"],[3,BLUE,"Low"],[4,GOLD,"Medium"],[5,ORANGE,"High"],[6,RED,"Very High"],[7,RED,"Extreme"]].map(([l,c,lbl])=>(
          <div key={l} style={{ display:"flex",alignItems:"center",gap:3 }}>
            <div style={{ width:12,height:12,borderRadius:2,background:c,opacity:l/7+0.3 }}/>
            <span style={{ fontSize:"0.5rem",color:"var(--text-3)" }}>{lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoBox({ label, value, color }) {
  return (
    <div style={{ padding:"0.5rem 0.625rem",background:"var(--elevated)",borderRadius:6,border:"1px solid var(--border-c)" }}>
      <div style={{ fontSize:"0.5rem",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color,marginBottom:3 }}>{label}</div>
      <div style={{ fontSize:"0.6875rem",color:"var(--text-2)",lineHeight:1.5 }}>{value}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ACCOUNT TYPE BREAKDOWN
══════════════════════════════════════════════════════════════════ */
const ACCOUNTS = [
  {
    key:"roth_ira",
    name:"Roth IRA",
    color:GREEN,
    icon: TrendingUp,
    limit:"$7,000/yr ($8,000 if 50+) — 2024",
    incomeLimit:"Phase out: $146K–$161K (single) / $230K–$240K (married) — 2024",
    contribution:"After-tax dollars — you pay tax NOW, never again",
    growth:"100% tax-free forever",
    withdrawal:"Contributions: anytime, no tax/penalty. Earnings: tax-free after age 59½ (and 5-yr rule met)",
    rmd:"No RMDs during your lifetime — money compounds forever if not needed",
    earlyPenalty:"Contributions can be withdrawn anytime penalty-free. Earnings withdrawn early = 10% penalty + income tax",
    bestAssets:["Individual growth stocks (NVDA, TSLA, AMZN)", "Small-cap ETFs", "Aggressive REITs", "Crypto (if allowed)", "High-growth funds"],
    rationale:"You want your highest-growth assets in Roth because every dollar of gain is 100% tax-free. A stock that 10x's in a Roth = zero tax ever.",
    proTips:[
      "Backdoor Roth IRA: if income is too high, contribute to Traditional IRA then convert — no income limit on conversions",
      "5-year rule: Roth must be open 5 years before earnings can be withdrawn tax-free",
      "Roth is your most valuable account — fund it every year even if it means sacrificing elsewhere",
      "Inherited Roth IRAs: non-spouse heirs must empty within 10 years, but still tax-free",
    ],
  },
  {
    key:"trad_ira",
    name:"Traditional IRA",
    color:BLUE,
    icon: BookOpen,
    limit:"$7,000/yr ($8,000 if 50+) — 2024",
    incomeLimit:"Deductibility phases out if you have a 401k: $77K–$87K (single) / $123K–$143K (married)",
    contribution:"Pre-tax if deductible (tax deduction now). After-tax if non-deductible.",
    growth:"Tax-deferred — grows without annual tax drag",
    withdrawal:"All withdrawals taxed as ordinary income at your tax rate in retirement",
    rmd:"RMDs begin at age 73 (SECURE 2.0). Must withdraw a % each year based on life expectancy tables.",
    earlyPenalty:"10% penalty + ordinary income tax on withdrawals before 59½ (exceptions: first home, disability, substantially equal payments)",
    bestAssets:["Bonds (defer ordinary income tax)", "REITs (defer ordinary income)", "High-dividend funds", "Active mutual funds (prevent tax drag)"],
    rationale:"Bond interest and REIT dividends are taxed as ordinary income. Holding them in a Traditional IRA defers that tax until retirement when you may be in a lower bracket.",
    proTips:[
      "Non-deductible contributions create 'basis' — track Form 8606 or you'll pay double tax",
      "Rollovers from 401k are penalty-free — great strategy when changing jobs",
      "Roth conversion ladder: convert Traditional IRA to Roth in low-income years (early retirement, career break)",
      "Unlike Roth, heirs pay income tax on inherited Traditional IRA withdrawals",
    ],
  },
  {
    key:"k401",
    name:"Traditional 401k",
    color:GOLD,
    icon: Building2,
    limit:"$23,000/yr employee ($30,500 if 50+) + employer match. Total: $69,000 — 2024",
    incomeLimit:"No income limits — available to all employees of participating employers",
    contribution:"Pre-tax — reduces your taxable income in the year of contribution",
    growth:"Tax-deferred — no annual tax on dividends, interest, or capital gains",
    withdrawal:"All withdrawals taxed as ordinary income — treated just like a paycheck",
    rmd:"RMDs begin at age 73 (still employed at plan sponsor = can delay). Must take required minimum each year.",
    earlyPenalty:"10% penalty + income tax before 59½. Rule of 55: if you leave employer in year you turn 55, no penalty.",
    bestAssets:["Bond funds (AGG, BND)", "REITs (VNQ)", "Active mutual funds", "High-dividend stocks", "TIPS (inflation-protected bonds)"],
    rationale:"Tax-inefficient assets (bonds, REITs, active funds) benefit most from tax deferral. Let them compound without annual tax drag.",
    proTips:[
      "Always contribute at least enough to get the full employer match — it's an instant 50–100% return",
      "401k loans: can borrow up to 50% of balance ($50K max). Risk: if you leave job, loan becomes due immediately",
      "In-service distribution: some plans allow rolling to IRA while still employed after 59½",
      "After-tax contributions + Mega Backdoor Roth: contribute up to $69K total, convert after-tax portion to Roth (if plan allows)",
    ],
  },
  {
    key:"roth_401k",
    name:"Roth 401k",
    color:"#a855f7",
    icon: Heart,
    limit:"Same as Traditional 401k: $23,000 ($30,500 if 50+) — COMBINED limit with Traditional 401k",
    incomeLimit:"No income limits — unlike Roth IRA, anyone can contribute regardless of income",
    contribution:"After-tax dollars — taxed upfront, never taxed again",
    growth:"100% tax-free — identical to Roth IRA",
    withdrawal:"Contributions and earnings: tax-free after 59½ (and 5-yr rule). Employer match goes to Traditional side (taxed at withdrawal).",
    rmd:"SECURE 2.0 (2024): Roth 401k RMDs eliminated — same as Roth IRA now. Major benefit.",
    earlyPenalty:"Same as Traditional 401k: 10% penalty + income tax on earnings withdrawn before 59½",
    bestAssets:["Same as Roth IRA — highest growth assets you own", "Individual stocks if plan allows brokerage window", "Small-cap funds", "Growth ETFs"],
    rationale:"No income limit means high earners who can't use Roth IRA can still get Roth treatment. Particularly powerful when you're young and in a lower bracket than you'll be at retirement.",
    proTips:[
      "You can split contributions between Traditional and Roth 401k in the same year — total can't exceed $23K",
      "High earners: if income >$161K (single), Roth 401k is the ONLY way to get new Roth contributions without backdoor",
      "Upon leaving employer, roll Roth 401k to Roth IRA to eliminate RMDs and gain more investment flexibility",
      "Employer match always goes to Traditional 401k side — even if your contributions are 100% Roth",
    ],
  },
  {
    key:"brokerage",
    name:"Taxable Brokerage",
    color:ORANGE,
    icon: BarChart2,
    limit:"Unlimited contributions — no cap",
    incomeLimit:"No restrictions. Available to anyone.",
    contribution:"After-tax — no deduction, no tax benefit upfront",
    growth:"Taxable each year: dividends taxed annually. Capital gains taxed when you sell.",
    withdrawal:"Withdraw anytime — no penalties, no age restrictions, no RMDs",
    rmd:"No RMDs ever. No restrictions on access.",
    earlyPenalty:"No penalties — access at any age without restriction",
    bestAssets:["Tax-efficient index ETFs (SPY, VTI, QQQ)", "Growth stocks held long-term (buy and hold)", "Municipal bonds (tax-exempt interest)", "Buy-and-hold individual stocks — defer gains indefinitely"],
    rationale:"Tax efficiency is critical here. Index ETFs rarely distribute capital gains. Growth stocks held >1yr qualify for long-term capital gains rates (0–20%) vs ordinary income rates (up to 37%).",
    proTips:[
      "Tax-loss harvesting: sell losers to offset gains. You can harvest losses and immediately buy a similar (not identical) ETF.",
      "Step-up in basis: assets inherited by heirs receive a new cost basis = fair market value at death. Eliminates capital gains tax permanently.",
      "Long-term capital gains rates (2024): 0% up to $47K income (single), 15% up to $518K, 20% above that",
      "Qualified dividends: taxed at capital gains rates (0/15/20%), not ordinary income — must hold stock 60+ days",
      "Brokerage provides flexibility for early retirement (access before 59½) and estate planning",
    ],
  },
];

function AccountTypeBreakdown() {
  const [active, setActive] = useState("roth_ira");
  const acc = ACCOUNTS.find(a=>a.key===active);

  return (
    <div>
      <P>Each account type has distinct rules for contributions, growth, and withdrawals. Knowing how each one is taxed at every stage lets you build a tax-efficient wealth engine.</P>

      {/* Tab selector */}
      <div style={{ display:"flex",gap:6,marginBottom:"1rem",flexWrap:"wrap",
        background:"var(--elevated)",border:"1px solid var(--border-c)",
        borderRadius:12,padding:5 }}>
        {ACCOUNTS.map(a=>(
          <button key={a.key} onClick={()=>setActive(a.key)} style={{
            padding:"0.4375rem 0.875rem",borderRadius:9,border:`1px solid ${active===a.key ? a.color+"40" : "transparent"}`,cursor:"pointer",
            fontSize:"0.6875rem",fontWeight:700,
            background: active===a.key ? `${a.color}18` : "transparent",
            color: active===a.key ? a.color : "var(--text-3)",
            transition:"all 0.15s",display:"flex",alignItems:"center",gap:4,
          }}>
            {(() => { const AI = a.icon; return <AI size={13} />; })()} {a.name}
          </button>
        ))}
      </div>

      {acc && (
        <div style={{ border:`1px solid ${acc.color}30`,borderRadius:10,overflow:"hidden" }}>
          {/* Header */}
          <div style={{ background:`${acc.color}10`,padding:"1rem 1.25rem",borderBottom:`1px solid ${acc.color}20`,
            display:"flex",alignItems:"center",gap:"0.75rem" }}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"center" }}>{(() => { const AccI = acc.icon; return <AccI size={28} color={acc.color} />; })()}</div>
            <div>
              <div style={{ fontSize:"1rem",fontWeight:800,color:acc.color }}>{acc.name}</div>
              <div style={{ fontSize:"0.6875rem",color:"var(--text-3)" }}>{acc.limit}</div>
            </div>
          </div>

          <div style={{ padding:"1rem 1.25rem" }}>
            {/* Tax timeline */}
            <div style={{ marginBottom:"1rem" }}>
              <div style={{ fontSize:"0.5625rem",fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",
                color:"var(--text-3)",marginBottom:"0.5rem" }}>Tax Timeline</div>
              <div style={{ display:"flex",gap:0,alignItems:"stretch" }}>
                {[
                  { label:"CONTRIBUTION", detail:acc.contribution, step:1 },
                  { label:"GROWTH PHASE", detail:acc.growth, step:2 },
                  { label:"WITHDRAWAL", detail:acc.withdrawal, step:3 },
                ].map((s,i)=>{
                  const taxed = s.detail.toLowerCase().includes("tax") && !s.detail.toLowerCase().includes("tax-free") && !s.detail.toLowerCase().includes("no tax");
                  const free = s.detail.toLowerCase().includes("tax-free") || s.detail.toLowerCase().includes("never taxed");
                  const c = free ? GREEN : s.detail.toLowerCase().includes("after-tax") && i===0 ? ORANGE : s.detail.toLowerCase().includes("pre-tax") ? GOLD : taxed ? ORANGE : BLUE;
                  return (
                    <React.Fragment key={i}>
                      <div style={{ flex:1,padding:"0.625rem 0.75rem",background:`${c}08`,
                        border:`1px solid ${c}30`,borderRadius: i===0?"6px 0 0 6px":i===2?"0 6px 6px 0":"0" }}>
                        <div style={{ fontSize:"0.45rem",fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",color:c,marginBottom:4 }}>
                          Step {s.step}: {s.label}
                        </div>
                        <div style={{ fontSize:"0.5625rem",color:"var(--text-2)",lineHeight:1.5 }}>{s.detail}</div>
                      </div>
                      {i<2 && <div style={{ width:2,background:`${c}20`,flexShrink:0 }}/>}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Key rules grid */}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:"1rem" }}>
              <InfoBox label="Income / Eligibility Limits" value={acc.incomeLimit} color={acc.color}/>
              <InfoBox label="RMD Rules" value={acc.rmd} color={ORANGE}/>
              <InfoBox label="Early Withdrawal (before 59½)" value={acc.earlyPenalty} color={RED}/>
              <InfoBox label="Best Asset Types To Hold Here" value={acc.bestAssets.join(", ")} color={GREEN}/>
            </div>

            {/* Rationale */}
            <div style={{ padding:"0.75rem",background:`${acc.color}06`,borderRadius:6,
              border:`1px solid ${acc.color}20`,marginBottom:"0.875rem" }}>
              <div style={{ fontSize:"0.5625rem",fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase",color:acc.color,marginBottom:4 }}>
                Why hold these assets here?
              </div>
              <div style={{ fontSize:"0.6875rem",color:"var(--text-2)",lineHeight:1.6 }}>{acc.rationale}</div>
            </div>

            {/* Pro tips */}
            <div style={{ fontSize:"0.5625rem",fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase",
              color:"var(--text-3)",marginBottom:"0.375rem" }}>Pro Tips</div>
            {acc.proTips.map((t,i)=>(
              <KeyPoint key={i} color={acc.color}>{t}</KeyPoint>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ASSET LOCATION
══════════════════════════════════════════════════════════════════ */
function AssetLocation() {
  const rows = [
    {
      asset:"Bonds / Bond Funds (AGG, BND, TLT)",
      taxDrag:"High — interest = ordinary income every year",
      best:"Traditional 401k or Traditional IRA",
      ok:"Roth IRA (if no other option)",
      avoid:"Taxable brokerage — annual tax drag destroys returns",
      reason:"Defer ordinary income tax. Bonds are least tax-efficient.",
    },
    {
      asset:"REITs (VNQ, O, VICI)",
      taxDrag:"High — dividends mostly non-qualified ordinary income",
      best:"Roth IRA or Traditional IRA/401k",
      ok:"Any tax-advantaged account",
      avoid:"Taxable brokerage — REIT dividends taxed at up to 37%",
      reason:"REIT dividends are taxed as ordinary income — shelter them.",
    },
    {
      asset:"Active Mutual Funds",
      taxDrag:"High — capital gain distributions each year even if you didn't sell",
      best:"Traditional IRA or 401k",
      ok:"Roth IRA",
      avoid:"Taxable brokerage — uncontrollable tax distributions",
      reason:"You get taxed on the fund's internal trades. Defer this.",
    },
    {
      asset:"Index ETFs / Index Funds (SPY, VTI, SCHB)",
      taxDrag:"Low — minimal distributions, very tax-efficient",
      best:"Taxable brokerage (most flexible) or any account",
      ok:"Any account works well",
      avoid:"Nothing — ETFs are tax-efficient everywhere",
      reason:"Low turnover = few capital gains events. Fine in taxable.",
    },
    {
      asset:"Growth Stocks (held long-term)",
      taxDrag:"Low if held >1 year — long-term capital gains rates",
      best:"Roth IRA (gains never taxed) or brokerage (long-term cap gains)",
      ok:"Any account",
      avoid:"Traditional IRA/401k — converts favorable cap gains rates to ordinary income at withdrawal",
      reason:"Long-term cap gains rates (0–20%) beat ordinary income (up to 37%). Keep in Roth or brokerage.",
    },
    {
      asset:"High-Dividend Stocks (SCHD, JEPI)",
      taxDrag:"Medium — qualified dividends at 0/15/20%",
      best:"Roth IRA (never taxed) or Traditional IRA (defer)",
      ok:"Taxable if low income (0% rate on qualified divs under $47K single)",
      avoid:"None specifically, but Roth maximizes long-term compounding",
      reason:"Shelter dividend income in tax-advantaged accounts for compounding.",
    },
    {
      asset:"Municipal Bonds (MUB)",
      taxDrag:"None federally — interest is tax-exempt",
      best:"Taxable brokerage — you're already getting tax-free income",
      ok:"Low income investors (may not need the tax exemption)",
      avoid:"IRA/401k — wastes the tax exemption inside an already tax-sheltered account",
      reason:"Munis are self-sheltering. Putting them in an IRA wastes the benefit.",
    },
    {
      asset:"Precious Metals / Commodity ETFs (GLD, SLV)",
      taxDrag:"High — taxed as collectibles at 28% max rate",
      best:"Traditional IRA or Roth IRA",
      ok:"401k (if available)",
      avoid:"Taxable brokerage — collectible tax rate is punishing",
      reason:"Defer or eliminate collectible tax treatment inside retirement accounts.",
    },
    {
      asset:"Cryptocurrency",
      taxDrag:"Extreme — every transaction is taxable",
      best:"Roth IRA (via crypto-capable custodian like Alto or iTrustCapital)",
      ok:"Traditional IRA",
      avoid:"Taxable brokerage unless you're a disciplined buy-and-hold investor",
      reason:"Every crypto trade is a taxable event in a brokerage. Roth eliminates this entirely.",
    },
  ];

  return (
    <div>
      <P>Asset location is the strategy of placing each investment in the account where it generates the least tax drag. The same investment can have dramatically different after-tax returns depending on where you hold it.</P>
      <div style={{ background:"rgba(201,169,110,0.06)",borderRadius:7,padding:"0.625rem 0.875rem",
        border:"1px solid rgba(201,169,110,0.2)",marginBottom:"1rem" }}>
        <div style={{ fontSize:"0.6875rem",fontWeight:700,color:GOLD,marginBottom:2 }}>The Core Rule</div>
        <div style={{ fontSize:"0.6875rem",color:"var(--text-2)",lineHeight:1.6 }}>
          Tax-inefficient assets (bonds, REITs, active funds) → Tax-advantaged accounts (IRA, 401k, Roth).
          Tax-efficient assets (index ETFs, buy-and-hold stocks) → Taxable brokerage.
          Your highest-growth assets → Roth (gains are never taxed).
        </div>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
        {rows.map((r,i)=>(
          <AssetLocationRow key={i} {...r}/>
        ))}
      </div>
    </div>
  );
}

function AssetLocationRow({ asset, taxDrag, best, ok, avoid, reason }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background:"var(--elevated)",borderRadius:7,overflow:"hidden",border:"1px solid var(--border-c)" }}>
      <button onClick={()=>setOpen(o=>!o)} style={{
        width:"100%",textAlign:"left",padding:"0.625rem 0.875rem",
        background:"none",border:"none",cursor:"pointer",
        display:"grid",gridTemplateColumns:"2fr 1fr 1fr auto",gap:"0.5rem",alignItems:"center",
      }}>
        <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)" }}>{asset}</div>
        <div style={{ fontSize:"0.5625rem",color:ORANGE }}>{taxDrag}</div>
        <div style={{ fontSize:"0.5625rem",color:GREEN }}>✓ {best.split("(")[0].trim()}</div>
        {open ? <ChevronUp size={12} style={{ color:"var(--text-3)" }}/> : <ChevronDown size={12} style={{ color:"var(--text-3)" }}/>}
      </button>
      {open && (
        <div style={{ padding:"0 0.875rem 0.875rem",borderTop:"1px solid var(--border-c)" }}>
          <div style={{ paddingTop:"0.625rem",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:"0.625rem" }}>
            <InfoBox label="Best Account" value={best} color={GREEN}/>
            <InfoBox label="✓ Also Fine" value={ok} color={BLUE}/>
            <InfoBox label="Avoid" value={avoid} color={RED}/>
          </div>
          <div style={{ fontSize:"0.6875rem",color:"var(--text-3)",fontStyle:"italic",lineHeight:1.5 }}>
            {reason}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   INVESTMENT PRIORITY LADDER
══════════════════════════════════════════════════════════════════ */
function PriorityLadder() {
  const steps = [
    {
      step:1, icon: Target, title:"401k — Up to Employer Match",
      color:GOLD,
      why:"Free money. If your employer matches 50¢ per dollar up to 6% of salary, that's an instant 50% return on your contribution before any market growth.",
      how:"Contribute exactly enough to capture 100% of the employer match. Not a dollar less.",
      numbers:"Example: $80K salary with 4% match = contribute $3,200 minimum to get $3,200 free from employer.",
      skip:"If you skip the match, you're leaving guaranteed money on the table. This is the only investment with a 100% guaranteed first-year return.",
    },
    {
      step:2, icon: HeartPulse, title:"HSA — Health Savings Account (if eligible)",
      color:"#14b8a6",
      why:"The only triple-tax-advantaged account in existence: deductible contributions, tax-free growth, tax-free withdrawals for medical expenses. After 65, use for anything (like a Traditional IRA).",
      how:"Must have a High-Deductible Health Plan (HDHP). 2024 limits: $4,150 individual / $8,300 family.",
      numbers:"A 30-year-old who maxes HSA annually and invests the balance could accumulate $500K+ tax-free by retirement.",
      skip:"If you don't have an HDHP, skip to step 3.",
    },
    {
      step:3, icon: TrendingUp, title:"Roth IRA — Max It Out",
      color:GREEN,
      why:"Tax-free growth forever, no RMDs, most flexible retirement account. Your most valuable long-term account.",
      how:"$7,000/yr ($8,000 if 50+). Income limits apply — use backdoor Roth if over the limit. Invest in your highest-growth assets here.",
      numbers:"$7K/yr for 30 years at 8% return = $854K all completely tax-free.",
      skip:"If your income exceeds limits and backdoor Roth feels complex, skip to step 4 and revisit.",
    },
    {
      step:4, icon: Building2, title:"401k / Roth 401k — Max the Rest",
      color:BLUE,
      why:"$23,000/yr of tax-advantaged space is massive. After getting the match and funding Roth IRA, fill the remaining 401k space.",
      how:"$23,000 total (Traditional + Roth 401k combined). Choose Traditional vs Roth based on your marginal tax rate (see next section).",
      numbers:"Maxing 401k at $23K/yr for 30 years at 8% = $2.8M before taxes. After-tax depends on bracket at withdrawal.",
      skip:"If cash flow is tight after steps 1–3, contribute what you can. Even $100/mo extra matters.",
    },
    {
      step:5, icon: BarChart2, title:"Taxable Brokerage — No Limit",
      color:ORANGE,
      why:"After maxing tax-advantaged accounts, a taxable brokerage provides unlimited investment capacity, full liquidity, and long-term capital gains treatment.",
      how:"Invest in tax-efficient vehicles: index ETFs, buy-and-hold individual stocks, municipal bonds. Avoid frequent trading.",
      numbers:"No contribution limits. $10K/yr at 8% for 30 years = $1.2M, taxed at capital gains rates (not ordinary income).",
      skip:"This is for extra savings beyond retirement account limits. Also the vehicle for early retirement (no age restrictions).",
    },
    {
      step:6, icon: GraduationCap, title:"529 / Education Accounts (if applicable)",
      color:"#a855f7",
      why:"If you have children or plan to fund education, 529 plans grow tax-free when used for qualified education expenses. Also useful for estate planning.",
      how:"No federal limit but state deduction limits vary. Invest in age-based portfolios. SECURE 2.0: unused 529 funds can roll to Roth IRA (lifetime $35K limit).",
      numbers:"$500/mo for 18 years at 7% = $197K for education — all withdrawals tax-free if used for education.",
      skip:"Optional if no education funding goals. Can be funded after steps 1–5.",
    },
  ];

  return (
    <div>
      <P>The order in which you fund investment accounts dramatically affects your lifetime wealth. This ladder maximizes tax advantages, captures free money, and ensures you don't miss critical opportunities at each stage.</P>
      <div style={{ display:"flex",flexDirection:"column",gap:"0.625rem" }}>
        {steps.map((s,i)=><PriorityStep key={i} {...s} last={i===steps.length-1}/>)}
      </div>
      <div style={{ marginTop:"1rem",padding:"0.75rem",background:"rgba(34,197,94,0.06)",
        borderRadius:7,border:"1px solid rgba(34,197,94,0.2)" }}>
        <div style={{ fontSize:"0.6875rem",fontWeight:700,color:GREEN,marginBottom:4 }}>The Bottom Line</div>
        <div style={{ fontSize:"0.6875rem",color:"var(--text-2)",lineHeight:1.6 }}>
          A 30-year-old who follows this ladder from day one — capturing employer match, maxing HSA + Roth IRA + 401k —
          and invests in low-cost index funds at historical returns could accumulate $3–5M+ by retirement.
          The most important variable is starting. Not the market. Not the fund selection. Starting early.
        </div>
      </div>
    </div>
  );
}

function PriorityStep({ step, icon, title, color, why, how, numbers, skip, last }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display:"flex",gap:"0.75rem",alignItems:"flex-start" }}>
      {/* Step indicator */}
      <div style={{ display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0 }}>
        <div style={{ width:36,height:36,borderRadius:"50%",background:`${color}20`,
          border:`2px solid ${color}`,display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:"0.8125rem",fontWeight:800,color,flexShrink:0 }}>
          {step}
        </div>
        {!last && <div style={{ width:2,flex:1,minHeight:16,background:`${color}30`,marginTop:4 }}/>}
      </div>

      {/* Content */}
      <div style={{ flex:1,background:"var(--elevated)",borderRadius:8,overflow:"hidden",
        border:`1px solid ${color}30`,marginBottom: last?0:"0.25rem" }}>
        <button onClick={()=>setOpen(o=>!o)} style={{
          width:"100%",textAlign:"left",padding:"0.75rem 0.875rem",
          background:"none",border:"none",cursor:"pointer",
          display:"flex",alignItems:"center",gap:"0.5rem",
        }}>
          {(() => { const SI = icon; return <SI size={18} color={color} />; })()}
          <div style={{ flex:1 }}>
            <div style={{ fontSize:"0.75rem",fontWeight:800,color }}>{title}</div>
          </div>
          {open ? <ChevronUp size={13} style={{ color:"var(--text-3)" }}/> : <ChevronDown size={13} style={{ color:"var(--text-3)" }}/>}
        </button>
        {open && (
          <div style={{ padding:"0 0.875rem 0.875rem",borderTop:`1px solid ${color}20` }}>
            <div style={{ paddingTop:"0.625rem",display:"flex",flexDirection:"column",gap:6 }}>
              <InfoBox label="Why This Step" value={why} color={color}/>
              <InfoBox label="How to Execute" value={how} color={BLUE}/>
              <InfoBox label="The Numbers" value={numbers} color={GREEN}/>
              <InfoBox label="When to Skip / Modify" value={skip} color={ORANGE}/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ROTH vs TRADITIONAL 401k
══════════════════════════════════════════════════════════════════ */
function RothVsTraditional() {
  const [salary, setSalary] = useState(100000);
  const [bracket, setBracket] = useState(22);
  const [retireBracket, setRetireBracket] = useState(22);
  const contrib = 10000;

  // TVM comparison: $10K Roth vs $10K Traditional (same pre-tax earnings)
  const years = 30;
  const r = 0.08;
  // Roth: invest $10K after-tax. Pay tax now at currentBracket.
  // Traditional: invest $10K pre-tax. After-tax "cost" is $10K × (1 - currentBracket/100)
  // To compare fairly on same after-tax cost:
  const afterTaxCost = contrib * (1 - bracket / 100);
  const rothFV = contrib * Math.pow(1 + r, years); // no tax at withdrawal
  const tradFV = (contrib / (1 - bracket / 100)) * Math.pow(1 + r, years) * (1 - retireBracket / 100); // larger contribution, taxed at retirement
  const rothWins = rothFV > tradFV;

  const BRACKETS_2024 = [
    { rate:10,  single:"$0 – $11,600",     married:"$0 – $23,200",        color:"#22c55e" },
    { rate:12,  single:"$11,601 – $47,150", married:"$23,201 – $94,300",   color:"#84cc16" },
    { rate:22,  single:"$47,151 – $100,525",married:"$94,301 – $201,050",  color:GOLD },
    { rate:24,  single:"$100,526 – $191,950",married:"$201,051 – $383,900",color:ORANGE },
    { rate:32,  single:"$191,951 – $243,725",married:"$383,901 – $487,450",color:"#f97316" },
    { rate:35,  single:"$243,726 – $609,350",married:"$487,451 – $731,200",color:RED },
    { rate:37,  single:"$609,351+",          married:"$731,201+",          color:"#7f1d1d" },
  ];

  const fmtK = (n) => `$${(n/1000).toFixed(0)}K`;

  return (
    <div>
      <P>The most common question in retirement planning: should I contribute to a Roth 401k or Traditional 401k? The answer depends entirely on one thing: will your marginal tax rate be higher today or in retirement?</P>

      {/* Core concept */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem",marginBottom:"1rem" }}>
        <div style={{ padding:"0.875rem",borderRadius:8,background:"rgba(201,169,110,0.08)",border:"1px solid rgba(201,169,110,0.25)" }}>
          <div style={{ fontSize:"0.6875rem",fontWeight:800,color:GOLD,marginBottom:6 }}>Traditional 401k</div>
          <div style={{ fontSize:"0.625rem",color:"var(--text-2)",lineHeight:1.7 }}>
            Pay tax <strong>LATER</strong> at retirement rates. Best when:<br/>
            • You're in a high bracket now (22%+)<br/>
            • You expect a lower bracket in retirement<br/>
            • You want to reduce taxable income this year<br/>
            • You're close to a bracket cutoff
          </div>
        </div>
        <div style={{ padding:"0.875rem",borderRadius:8,background:"rgba(168,85,247,0.08)",border:"1px solid rgba(168,85,247,0.25)" }}>
          <div style={{ fontSize:"0.6875rem",fontWeight:800,color:"#a855f7",marginBottom:6 }}>Roth 401k</div>
          <div style={{ fontSize:"0.625rem",color:"var(--text-2)",lineHeight:1.7 }}>
            Pay tax <strong>NOW</strong> at current rates. Best when:<br/>
            • You're in a low bracket now (10–22%)<br/>
            • You expect a higher bracket in retirement<br/>
            • You want tax-free income in retirement<br/>
            • You're young and decades from retirement
          </div>
        </div>
      </div>

      {/* Interactive tax bracket display */}
      <div style={{ marginBottom:"1rem" }}>
        <div style={{ fontSize:"0.5625rem",fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",
          color:"var(--text-3)",marginBottom:"0.5rem" }}>2024 Federal Tax Brackets (Taxable Income)</div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%",borderCollapse:"collapse",minWidth:500 }}>
            <thead>
              <tr>
                {["Rate","Single Filer","Married Filing Jointly","Tax on Last Dollar"].map(h=>(
                  <th key={h} style={{ padding:"6px 10px",fontSize:"0.5rem",letterSpacing:"0.07em",
                    color:"var(--text-3)",textTransform:"uppercase",textAlign:"left",
                    borderBottom:"1px solid var(--border-c)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BRACKETS_2024.map(b=>(
                <tr key={b.rate} style={{ background: b.rate===bracket ? `${b.color}10` : "transparent" }}>
                  <td style={{ padding:"7px 10px",borderBottom:"1px solid var(--border-c)" }}>
                    <span style={{ fontFamily:"monospace",fontWeight:800,fontSize:"0.8125rem",color:b.color }}>{b.rate}%</span>
                  </td>
                  <td style={{ padding:"7px 10px",fontSize:"0.625rem",color:"var(--text-2)",borderBottom:"1px solid var(--border-c)" }}>{b.single}</td>
                  <td style={{ padding:"7px 10px",fontSize:"0.625rem",color:"var(--text-2)",borderBottom:"1px solid var(--border-c)" }}>{b.married}</td>
                  <td style={{ padding:"7px 10px",borderBottom:"1px solid var(--border-c)" }}>
                    <div style={{ height:6,background:"var(--border-c)",borderRadius:3,width:120,overflow:"hidden" }}>
                      <div style={{ height:"100%",width:`${(b.rate/37)*100}%`,background:b.color,borderRadius:3 }}/>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize:"0.5625rem",color:"var(--text-3)",marginTop:4 }}>
          Remember: Tax brackets are <strong>marginal</strong> — only income within each bracket is taxed at that rate. A $100K salary does NOT mean 22% tax on the whole $100K.
        </div>
      </div>

      {/* Interactive comparison */}
      <div style={{ background:"var(--elevated)",borderRadius:10,padding:"1rem",
        border:"1px solid var(--border-c)",marginBottom:"1rem" }}>
        <div style={{ fontSize:"0.6875rem",fontWeight:800,letterSpacing:"0.06em",textTransform:"uppercase",
          color:"var(--text-2)",marginBottom:"0.875rem" }}>Roth vs Traditional: $10,000 Contribution Comparison</div>

        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"0.875rem" }}>
          <div>
            <div style={{ fontSize:"0.5625rem",color:"var(--text-3)",fontWeight:600,marginBottom:4 }}>
              Your current marginal tax bracket
            </div>
            <div style={{ display:"flex",gap:4,flexWrap:"wrap" }}>
              {[10,12,22,24,32,35,37].map(b=>(
                <button key={b} onClick={()=>setBracket(b)} style={{
                  padding:"3px 8px",borderRadius:4,border:"none",cursor:"pointer",fontSize:"0.6875rem",fontWeight:700,
                  background: bracket===b ? GOLD : "var(--surface)",
                  color: bracket===b ? "#07080a" : "var(--text-3)",
                }}>
                  {b}%
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize:"0.5625rem",color:"var(--text-3)",fontWeight:600,marginBottom:4 }}>
              Expected tax bracket in retirement
            </div>
            <div style={{ display:"flex",gap:4,flexWrap:"wrap" }}>
              {[10,12,22,24,32,35,37].map(b=>(
                <button key={b} onClick={()=>setRetireBracket(b)} style={{
                  padding:"3px 8px",borderRadius:4,border:"none",cursor:"pointer",fontSize:"0.6875rem",fontWeight:700,
                  background: retireBracket===b ? "#a855f7" : "var(--surface)",
                  color: retireBracket===b ? "#fff" : "var(--text-3)",
                }}>
                  {b}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result cards */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0.625rem",marginTop:"0.5rem" }}>
          <div style={{ padding:"0.75rem",borderRadius:7,background:"rgba(201,169,110,0.08)",
            border:`2px solid ${rothWins ? "var(--border-c)" : GOLD}` }}>
            <div style={{ fontSize:"0.5625rem",color:GOLD,fontWeight:700,marginBottom:6 }}>TRADITIONAL 401k</div>
            <div style={{ fontFamily:"monospace",fontSize:"1.25rem",fontWeight:800,color:rothWins ? "var(--text-2)" : GOLD }}>
              {fmtK(tradFV)}
            </div>
            <div style={{ fontSize:"0.5625rem",color:"var(--text-3)",marginTop:4 }}>
              After-tax in retirement (taxed at {retireBracket}%)<br/>
              Tax deduction saves {fmtK(contrib*bracket/100)} today
            </div>
            {!rothWins && <div style={{ fontSize:"0.5625rem",fontWeight:700,color:GOLD,marginTop:6 }}>✓ WINNER at these rates</div>}
          </div>
          <div style={{ padding:"0.75rem",borderRadius:7,background:"rgba(168,85,247,0.08)",
            border:`2px solid ${rothWins ? "#a855f7" : "var(--border-c)"}` }}>
            <div style={{ fontSize:"0.5625rem",color:"#a855f7",fontWeight:700,marginBottom:6 }}>ROTH 401k</div>
            <div style={{ fontFamily:"monospace",fontSize:"1.25rem",fontWeight:800,color:rothWins ? "#a855f7" : "var(--text-2)" }}>
              {fmtK(rothFV)}
            </div>
            <div style={{ fontSize:"0.5625rem",color:"var(--text-3)",marginTop:4 }}>
              Tax-free at retirement (no tax ever)<br/>
              Costs {fmtK(contrib*bracket/100)} more in taxes today
            </div>
            {rothWins && <div style={{ fontSize:"0.5625rem",fontWeight:700,color:"#a855f7",marginTop:6 }}>✓ WINNER at these rates</div>}
          </div>
          <div style={{ padding:"0.75rem",borderRadius:7,background:"rgba(34,197,94,0.06)",
            border:"1px solid rgba(34,197,94,0.2)" }}>
            <div style={{ fontSize:"0.5625rem",color:GREEN,fontWeight:700,marginBottom:6 }}>DIFFERENCE</div>
            <div style={{ fontFamily:"monospace",fontSize:"1.25rem",fontWeight:800,
              color: Math.abs(rothFV-tradFV) < 1000 ? "var(--text-3)" : rothWins ? "#a855f7" : GOLD }}>
              {fmtK(Math.abs(rothFV-tradFV))}
            </div>
            <div style={{ fontSize:"0.5625rem",color:"var(--text-3)",marginTop:4 }}>
              Over 30 years at 8% growth<br/>
              {bracket === retireBracket ? "Same bracket = same result — split contributions" :
               bracket < retireBracket ? "Lower bracket now → Roth wins" : "Higher bracket now → Traditional wins"}
            </div>
          </div>
        </div>

        <div style={{ marginTop:"0.75rem",padding:"0.625rem",borderRadius:6,
          background:"var(--elevated)",border:"1px solid var(--border-c)",
          fontSize:"0.5625rem",color:"var(--text-3)",lineHeight:1.7 }}>
          <strong style={{ color:"var(--text-2)" }}>Methodology:</strong> Assuming $10,000 Roth contribution (after-tax) vs equivalent Traditional (pre-tax).
          Both grow at 8%/yr for 30 years. Traditional amount scaled to same after-tax cost at current bracket, then taxed at retirement bracket.
          Ignores state taxes, investment return variance, and actual tax bracket changes over time.
        </div>
      </div>

      {/* Split strategy */}
      <div style={{ padding:"0.875rem",background:"rgba(20,184,166,0.06)",borderRadius:8,
        border:"1px solid rgba(20,184,166,0.25)",marginBottom:"0.875rem" }}>
        <div style={{ fontSize:"0.6875rem",fontWeight:800,color:TEAL,marginBottom:"0.5rem" }}>
          The Smart Strategy: Tax Diversification (Split Your Contributions)
        </div>
        <div style={{ fontSize:"0.6875rem",color:"var(--text-2)",lineHeight:1.7 }}>
          Nobody knows what tax rates will be in 30 years. The smartest approach is to build balances in BOTH account types.
          Split your $23K limit — e.g., $12K Traditional + $11K Roth — to create tax flexibility in retirement.
          In retirement, you can pull from Traditional in low-income years (staying in lower brackets) and from Roth in high-income years (avoiding higher brackets).
          This is called a "tax diversification" strategy and is recommended by most CFPs.
        </div>
      </div>

      {/* When to choose */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem" }}>
        <div>
          <div style={{ fontSize:"0.5625rem",fontWeight:800,letterSpacing:"0.08em",color:GOLD,marginBottom:4 }}>CHOOSE TRADITIONAL WHEN:</div>
          {[
            "You're in the 24%+ bracket today",
            "You expect to retire in a lower bracket (< current)",
            "You need to reduce AGI to qualify for tax credits or ACA subsidies",
            "You're close to retirement and need the deduction now",
            "Your employer doesn't offer Roth 401k",
          ].map((t,i)=><KeyPoint key={i} color={GOLD}>{t}</KeyPoint>)}
        </div>
        <div>
          <div style={{ fontSize:"0.5625rem",fontWeight:800,letterSpacing:"0.08em",color:"#a855f7",marginBottom:4 }}>CHOOSE ROTH 401k WHEN:</div>
          {[
            "You're in the 10–22% bracket today",
            "You're young (20s–30s) with decades for tax-free growth",
            "You expect to be in a higher bracket in retirement",
            "You want flexibility — no RMDs (post SECURE 2.0)",
            "You earn too much for Roth IRA — Roth 401k has no income limit",
          ].map((t,i)=><KeyPoint key={i} color="#a855f7">{t}</KeyPoint>)}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   TAX DEEP DIVE
══════════════════════════════════════════════════════════════════ */
function TaxDeepDive() {
  const cols = [
    { key:"roth_ira",   label:"Roth IRA",         color:GREEN },
    { key:"trad_ira",   label:"Trad IRA",          color:BLUE },
    { key:"k401",       label:"401k (Trad)",        color:GOLD },
    { key:"roth_401k",  label:"Roth 401k",          color:"#a855f7" },
    { key:"brokerage",  label:"Brokerage",          color:ORANGE },
  ];

  const rows = [
    {
      category:"Contribution Tax",
      roth_ira:"After-tax. No deduction.",
      trad_ira:"Pre-tax if deductible. Reduces taxable income.",
      k401:"Pre-tax. Reduces W-2 taxable income immediately.",
      roth_401k:"After-tax. No deduction. Same W-2 income.",
      brokerage:"After-tax. No deduction.",
    },
    {
      category:"Annual Tax on Growth",
      roth_ira:"None — zero tax on dividends, interest, gains",
      trad_ira:"None — full tax deferral",
      k401:"None — full tax deferral",
      roth_401k:"None — full tax deferral",
      brokerage:"Yes — dividends taxed annually; cap gains at sale",
    },
    {
      category:"Qualified Withdrawal Tax",
      roth_ira:"Zero — 100% tax-free after 59½ + 5-yr rule",
      trad_ira:"Ordinary income tax at your rate in retirement",
      k401:"Ordinary income tax at your rate in retirement",
      roth_401k:"Zero — 100% tax-free after 59½ + 5-yr rule",
      brokerage:"Long-term cap gains (0/15/20%) or short-term (ordinary income)",
    },
    {
      category:"Early Withdrawal (before 59½)",
      roth_ira:"Contributions: anytime, no tax/penalty. Earnings: 10% penalty + income tax",
      trad_ira:"10% penalty + ordinary income tax. Exceptions: disability, SEPP, first home ($10K), medical",
      k401:"10% penalty + income tax. Rule of 55 exception. 72(t) SEPP.",
      roth_401k:"10% penalty + income tax on earnings. Contributions: check plan rules.",
      brokerage:"No penalty ever — sell anytime. Just pay capital gains tax on gains.",
    },
    {
      category:"Required Minimum Distributions",
      roth_ira:"None during owner's lifetime — only inherited Roth has 10-yr rule",
      trad_ira:"Yes — begin at age 73. Amount based on IRS life expectancy table.",
      k401:"Yes — begin at age 73 (or later if still employed at that employer)",
      roth_401k:"No RMDs as of 2024 (SECURE 2.0 eliminated them for Roth 401k)",
      brokerage:"None — withdraw on your schedule, leave to heirs",
    },
    {
      category:"Contribution Limits (2024)",
      roth_ira:"$7,000 ($8,000 age 50+). Income limits apply.",
      trad_ira:"$7,000 ($8,000 age 50+). Deductibility has income limits.",
      k401:"$23,000 employee ($30,500 age 50+). Total with employer: $69,000.",
      roth_401k:"Combined with Traditional 401k: $23,000 total ($30,500 age 50+)",
      brokerage:"Unlimited — no caps",
    },
    {
      category:"Income Limits",
      roth_ira:"Phase out $146K–$161K (single) / $230K–$240K (married). Backdoor available.",
      trad_ira:"No limit to contribute. Deductibility phases out with workplace plan.",
      k401:"None — available to all plan participants",
      roth_401k:"None — available to all employees regardless of income",
      brokerage:"None — anyone can open and fund",
    },
    {
      category:"Beneficiary / Inheritance Tax",
      roth_ira:"Heirs inherit tax-free growth. Must empty in 10 years (SECURE 2.0) — but no income tax on distributions.",
      trad_ira:"Heirs pay ordinary income tax on all distributions. Must empty in 10 years.",
      k401:"Heirs pay ordinary income tax. Roll to inherited IRA or take lump sum (taxable).",
      roth_401k:"Roll to inherited Roth IRA. Tax-free distributions. 10-year rule applies.",
      brokerage:"Step-up in basis at death — heirs pay NO capital gains tax on pre-death gains. Most powerful estate planning tool.",
    },
    {
      category:"Best Tax Strategy",
      roth_ira:"Max every year. Put highest-growth assets here. Never withdraw early. Roll over old 401k if converting.",
      trad_ira:"Use when you need deduction or doing Roth conversion in low-income years.",
      k401:"Always capture employer match first. Traditional if in 24%+ bracket. Max after Roth IRA.",
      roth_401k:"High earners who exceed Roth IRA limits. Young investors who expect higher future rates. Roll to Roth IRA at job change.",
      brokerage:"Hold tax-efficient ETFs. Tax-loss harvest annually. Use for early retirement access. Let appreciated assets pass to heirs.",
    },
  ];

  const cellColor = (key, val) => {
    const v = val.toLowerCase();
    if (v.includes("none") || v.includes("zero") || v.includes("tax-free") || v.includes("no tax") || v.includes("no penalty") || v.includes("no rmd") || v.includes("no limit") || v.includes("unlimited")) return GREEN;
    if (v.includes("penalty") || v.includes("ordinary income tax") || v.includes("income tax")) return ORANGE;
    return "var(--text-2)";
  };

  return (
    <div>
      <P>This is the complete tax picture for every account type. Understanding when your money is taxed — and at what rate — is the key to minimizing lifetime taxes and maximizing the wealth you actually keep.</P>

      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%",borderCollapse:"collapse",minWidth:800 }}>
          <thead>
            <tr style={{ background:"var(--elevated)" }}>
              <th style={{ padding:"10px 12px",fontSize:"0.5625rem",letterSpacing:"0.08em",textTransform:"uppercase",
                color:"var(--text-3)",textAlign:"left",borderBottom:"2px solid var(--border-c)",width:160 }}>Tax Dimension</th>
              {cols.map(c=>(
                <th key={c.key} style={{ padding:"10px 12px",fontSize:"0.5625rem",letterSpacing:"0.08em",
                  textTransform:"uppercase",color:c.color,fontWeight:800,textAlign:"left",
                  borderBottom:`2px solid ${c.color}`,minWidth:160 }}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row,i)=>(
              <tr key={i} style={{ background: i%2===0 ? "transparent" : "rgba(255,255,255,0.015)" }}>
                <td style={{ padding:"10px 12px",fontSize:"0.5625rem",fontWeight:800,letterSpacing:"0.06em",
                  textTransform:"uppercase",color:"var(--text-3)",borderBottom:"1px solid var(--border-c)",
                  verticalAlign:"top" }}>
                  {row.category}
                </td>
                {cols.map(c=>(
                  <td key={c.key} style={{ padding:"10px 12px",fontSize:"0.5625rem",
                    color:cellColor(c.key, row[c.key]),
                    lineHeight:1.6,borderBottom:"1px solid var(--border-c)",verticalAlign:"top" }}>
                    {row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Capital gains reference */}
      <div style={{ marginTop:"1rem",background:"var(--elevated)",borderRadius:8,padding:"0.875rem",
        border:"1px solid var(--border-c)" }}>
        <div style={{ fontSize:"0.6875rem",fontWeight:800,color:ORANGE,marginBottom:"0.5rem" }}>
          Capital Gains Tax Rates (2024) — Brokerage Account
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem" }}>
          <div>
            <div style={{ fontSize:"0.5rem",color:"var(--text-3)",marginBottom:4,letterSpacing:"0.08em",textTransform:"uppercase" }}>
              Long-Term (held &gt;1 year)
            </div>
            {[
              {rate:"0%",single:"Up to $47,025",married:"Up to $94,050",color:GREEN},
              {rate:"15%",single:"$47,026–$518,900",married:"$94,051–$583,750",color:GOLD},
              {rate:"20%",single:"$518,901+",married:"$583,751+",color:RED},
            ].map(r=>(
              <div key={r.rate} style={{ display:"flex",gap:"0.5rem",alignItems:"center",marginBottom:4 }}>
                <span style={{ fontFamily:"monospace",fontWeight:800,color:r.color,width:30 }}>{r.rate}</span>
                <span style={{ fontSize:"0.5625rem",color:"var(--text-2)" }}>Single: {r.single} · Married: {r.married}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize:"0.5rem",color:"var(--text-3)",marginBottom:4,letterSpacing:"0.08em",textTransform:"uppercase" }}>
              Short-Term (held ≤1 year)
            </div>
            <div style={{ fontSize:"0.5625rem",color:RED,lineHeight:1.7 }}>
              Taxed as ordinary income — same as your regular tax bracket (10% – 37%).
              Holding an investment for 366+ days instead of 365 days can save you 10–20% in taxes.
            </div>
            <div style={{ marginTop:6,fontSize:"0.5625rem",color:GREEN,lineHeight:1.7 }}>
              <strong>Net Investment Income Tax (NIIT):</strong> +3.8% surcharge on investment income for high earners ($200K+ single / $250K+ married). Applies in brokerage, not in retirement accounts.
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop:"0.75rem",padding:"0.75rem",background:"rgba(201,169,110,0.05)",
        borderRadius:7,border:"1px solid rgba(201,169,110,0.2)" }}>
        <div style={{ fontSize:"0.5625rem",fontWeight:800,color:GOLD,marginBottom:4 }}>
          The Ideal Tax-Efficient Investor Playbook
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem" }}>
          {[
            ["During Accumulation","401k match → HSA → Roth IRA → max 401k → brokerage. Split 401k between Traditional and Roth for tax diversification."],
            ["Asset Location","Bonds + REITs in 401k/IRA. Index ETFs in brokerage. Highest growth assets in Roth. Munis in taxable if high bracket."],
            ["During Retirement","Withdraw from taxable first (lowest rate), fill brackets from Traditional IRA/401k, use Roth for top-bracket income. Never trigger unnecessary bracket jumps."],
            ["Estate Planning","Let appreciated brokerage assets pass to heirs (step-up basis erases gains). Roth is the best inheritance — heirs withdraw tax-free."],
          ].map(([title,body])=>(
            <div key={title}>
              <div style={{ fontSize:"0.5rem",fontWeight:800,color:"var(--text-3)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:3 }}>{title}</div>
              <div style={{ fontSize:"0.5625rem",color:"var(--text-2)",lineHeight:1.6 }}>{body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
