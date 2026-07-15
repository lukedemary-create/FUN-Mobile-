import { useState, useMemo } from 'react'
import { CheckCircle2, XCircle, ArrowRight, AlertCircle, Home, Car, Target, TrendingUp, ExternalLink } from 'lucide-react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'

const fmt = n => '$' + Math.round(n||0).toLocaleString()

function PillTabs({ tabs, active, onChange, accent = C.gold }) {
  return (
    <div style={{ display:'flex', gap:7, overflowX:'auto', scrollbarWidth:'none', padding:'0 16px' }}>
      {tabs.map(t => (
        <button key={t} onClick={()=>onChange(t)} style={{
          flexShrink:0, padding:'7px 14px', borderRadius:20,
          border:`1px solid ${active===t ? accent : C.b2}`,
          background: active===t ? `${accent}18` : C.surf, cursor:'pointer',
          fontFamily:UI, fontSize:12, fontWeight:active===t?700:500,
          color: active===t ? accent : C.t3,
        }}>{t}</button>
      ))}
    </div>
  )
}

function InfoBox({ color=C.gold, children }) {
  return (
    <div style={{ display:'flex', gap:8, padding:'10px 12px', background:`${color}0d`,
      border:`1px solid ${color}25`, borderRadius:9, marginTop:8 }}>
      <AlertCircle size={13} color={color} style={{ flexShrink:0, marginTop:1 }}/>
      <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65 }}>{children}</div>
    </div>
  )
}

/* ── Mortgage calculator ────────────────────────────────────── */
function calcMortgage(principal, annualRate, months) {
  if (!principal || months <= 0) return 0
  if (annualRate === 0) return principal / months
  const r = annualRate / 100 / 12
  return principal * (r * Math.pow(1+r, months)) / (Math.pow(1+r, months) - 1)
}

/* ── Main component ─────────────────────────────────────────── */
export default function MMajorPurchases() {
  const [mainTab, setMainTab]   = useState('Learn')
  const [learnTab, setLearnTab] = useState('Home Buying')
  const [calcTab, setCalcTab]   = useState('Mortgage')

  // Mortgage calculator state
  const [income,    setIncome]    = useState(90000)
  const [homePrice, setHomePrice] = useState(400000)
  const [downPct,   setDownPct]   = useState(20)
  const [rate,      setRate]      = useState(7.0)
  const [termYrs,   setTermYrs]   = useState(30)
  const [propTax,   setPropTax]   = useState(1.2)
  const [insurance, setInsurance] = useState(150)

  const mortgageResult = useMemo(() => {
    const down  = homePrice * downPct / 100
    const loan  = homePrice - down
    const n     = termYrs * 12
    const pi    = calcMortgage(loan, rate, n)
    const tax   = homePrice * propTax / 100 / 12
    const pmi   = downPct < 20 ? loan * 0.008 / 12 : 0
    const total = pi + tax + insurance + pmi
    const grossMo = income / 12
    const ratio = total / grossMo
    const totalInterest = pi * n - loan
    const closingLow  = homePrice * 0.02
    const closingHigh = homePrice * 0.05
    return { down, loan, pi, tax, pmi, total, ratio, totalInterest, closingLow, closingHigh, affordable:ratio<=0.28 }
  }, [income, homePrice, downPct, rate, termYrs, propTax, insurance])

  // Goal savings calculator
  const [goalAmt,     setGoalAmt]    = useState(80000)
  const [goalSaved,   setGoalSaved]  = useState(10000)
  const [goalMonthly, setGoalMo]     = useState(1000)
  const [goalApy,     setGoalApy]    = useState(4.5)

  const goalResult = useMemo(() => {
    const r = goalApy / 100 / 12
    const remaining = Math.max(0, goalAmt - goalSaved)
    let months = 0
    if (remaining > 0) {
      let bal = goalSaved
      let m = 0
      while (bal < goalAmt && m < 1200) { bal = bal * (1+r) + goalMonthly; m++ }
      months = m
    }
    const interestEarned = goalAmt - (goalSaved + goalMonthly * months)
    const calcMo = (targetMos) => {
      if (targetMos <= 0) return 0
      if (r > 0) {
        const fvSaved = goalSaved * Math.pow(1+r, targetMos)
        const needed  = goalAmt - fvSaved
        return needed > 0 ? needed / ((Math.pow(1+r,targetMos)-1)/r) : 0
      }
      return Math.max(0, (goalAmt - goalSaved) / targetMos)
    }
    return { months, years:Math.floor(months/12), remMos:months%12, interestEarned, calcMo }
  }, [goalAmt, goalSaved, goalMonthly, goalApy])

  return (
    <div style={{ background:C.bg, minHeight:'100dvh', paddingBottom:88 }}>
      <ScreenHeader title="Major Purchases" subtitle="Learn" accent={C.gold}/>

      {/* Main tabs */}
      <div style={{ display:'flex', borderBottom:`1px solid ${C.b2}`, padding:'0 16px', marginBottom:14 }}>
        {['Learn','Calculate','Resources'].map(t => (
          <button key={t} onClick={()=>setMainTab(t)} style={{
            flex:1, padding:'11px 0', background:'none', border:'none', cursor:'pointer',
            borderBottom:`2px solid ${mainTab===t ? C.gold : 'transparent'}`,
            color:mainTab===t ? C.gold : C.t3, fontFamily:UI, fontSize:13, fontWeight:600,
          }}>{t}</button>
        ))}
      </div>

      {/* ── LEARN ──────────────────────────────────────────── */}
      {mainTab === 'Learn' && (
        <>
          <PillTabs
            tabs={['Home Buying','Rent vs. Buy','Vehicle','Goals']}
            active={learnTab} onChange={setLearnTab} accent={C.gold}
          />
          <div style={{ marginTop:12 }}/>

          {/* ── Home Buying ── */}
          {learnTab === 'Home Buying' && (
            <>
              <MSectionHeader label="How Much House Can You Afford?"/>
              <div style={{ padding:'0 16px' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
                  {[
                    { rule:'28% Rule',    color:C.teal,    desc:'Total housing payment (PITI) should not exceed 28% of gross monthly income.' },
                    { rule:'36% Rule',    color:'#8b5cf6', desc:'Total debt (housing + all other) should not exceed 36% of gross income.' },
                    { rule:'20% Down',    color:'#22c55e', desc:'Putting 20% down eliminates PMI and gets you the best interest rate.' },
                    { rule:'3–5× Income', color:'#f59e0b', desc:'Conservative rule: home price should be no more than 3–5× annual household income.' },
                  ].map(r => (
                    <div key={r.rule} style={{ background:`${r.color}0d`, border:`1px solid ${r.color}20`, borderRadius:10, padding:'10px 12px' }}>
                      <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:r.color, marginBottom:4 }}>{r.rule}</div>
                      <div style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.6 }}>{r.desc}</div>
                    </div>
                  ))}
                </div>
                <InfoBox color='#ef4444'>Lenders will often approve you for more than you should borrow. "Can I afford the payment" is not the same as "can I afford the house." Budget for all true costs, not just the mortgage.</InfoBox>
              </div>

              <MSectionHeader label="Mortgage Types"/>
              <div style={{ padding:'0 16px' }}>
                {[
                  { name:'30-Year Fixed',  badge:'Most Common',      color:C.teal,    summary:'Fixed rate and payment for 30 years. Predictable, lower monthly payments, but more total interest paid.',                                                     best:'Buyers who value stability and plan to stay long-term.' },
                  { name:'15-Year Fixed',  badge:'Best Rate',         color:'#22c55e', summary:'Paid off in half the time. ~40–50% higher monthly payment but dramatically less interest overall.',                                                             best:'Buyers with strong income who want equity fast and to eliminate the mortgage before retirement.' },
                  { name:'ARM (3/5/7/10)', badge:'Variable Risk',     color:'#f59e0b', summary:'Lower initial rate fixed for 3–10 years, then adjusts annually based on a market index.',                                                                      best:"Buyers certain they'll sell or refinance before the adjustment period ends." },
                  { name:'FHA Loan',       badge:'Low Down Payment',  color:'#8b5cf6', summary:'Government-backed, as low as 3.5% down. More flexible credit (580+ score). Requires MIP for life of loan if down < 10%.',                                      best:'First-time buyers with limited savings or lower credit scores.' },
                  { name:'VA Loan',        badge:'Veterans Only',     color:'#ec4899', summary:'No down payment, no PMI, competitive rates. For eligible veterans, active duty, and surviving spouses.',                                                         best:'Any eligible veteran or active duty service member — use this if you qualify.' },
                ].map(m => (
                  <div key={m.name} style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:12, padding:14, marginBottom:8 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                      <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.t1 }}>{m.name}</div>
                      <div style={{ padding:'2px 8px', borderRadius:20, background:`${m.color}15`, color:m.color, fontFamily:UI, fontSize:10, fontWeight:700 }}>{m.badge}</div>
                    </div>
                    <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.6, marginBottom:5 }}>{m.summary}</div>
                    <div style={{ fontFamily:UI, fontSize:11, color:C.t3 }}><span style={{ color:m.color, fontWeight:700 }}>Best for: </span>{m.best}</div>
                  </div>
                ))}
              </div>

              <MSectionHeader label="Hidden Costs of Homeownership"/>
              <div style={{ padding:'0 16px' }}>
                <MCard style={{ background:C.raise, padding:0, overflow:'hidden' }}>
                  {[
                    { item:'Property taxes',       range:'1–2% of value/year',  note:'A $400K home in a high-tax area: $8,000+/year.' },
                    { item:'Homeowners insurance',  range:'$1,000–$3,000/year',  note:'Higher in flood/hurricane/wildfire zones.' },
                    { item:'PMI (if < 20% down)',   range:'0.5–1.5% of loan/yr', note:'Adds $100–500/mo. Cancels at 20% equity.' },
                    { item:'HOA fees',              range:'$0–$1,000+/month',    note:'Can increase over time and carry special assessments.' },
                    { item:'Maintenance & repairs', range:'1–2% of value/year',  note:'Budget $4,000–8,000/year on a $400K home.' },
                    { item:'Closing costs',         range:'2–5% of price',       note:'On $400K: $8,000–$20,000 paid at closing.' },
                    { item:'Utilities',             range:'$200–500+/month',     note:'Often higher than renting — you pay it all.' },
                  ].map((c,i,arr) => (
                    <div key={c.item} style={{ padding:'10px 14px', borderBottom:i<arr.length-1?`1px solid ${C.b1}`:'none' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:3 }}>
                        <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.t1 }}>{c.item}</div>
                        <div style={{ fontFamily:MONO, fontSize:11, fontWeight:700, color:C.teal }}>{c.range}</div>
                      </div>
                      <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.55 }}>{c.note}</div>
                    </div>
                  ))}
                </MCard>
              </div>
              <div style={{ height:8 }}/>
            </>
          )}

          {/* ── Rent vs. Buy ── */}
          {learnTab === 'Rent vs. Buy' && (
            <>
              <div style={{ padding:'0 16px', marginBottom:12 }}>
                <div style={{ fontFamily:UI, fontSize:13, color:C.t2, lineHeight:1.75 }}>
                  Renting vs. buying is one of the most personal financial decisions you'll make. Neither is universally better — it depends on your timeline, market, income, and lifestyle. Make the decision intentionally, not by default.
                </div>
              </div>

              <MSectionHeader label="Consider Buying When…"/>
              <div style={{ padding:'0 16px' }}>
                <MCard style={{ borderColor:`${C.teal}40` }}>
                  {[
                    { label:'You plan to stay 5+ years',               note:'It takes 3–7 years to break even on buying due to closing costs and early mortgage interest.' },
                    { label:'You have stable income and an emergency fund', note:'Homeownership comes with unexpected costs. You need reserves beyond the down payment.' },
                    { label:'You want to build equity and net worth',   note:'Mortgage payments build ownership; rent payments do not. But equity is not guaranteed.' },
                    { label:'You want stability and control',           note:'Renovations, pets, long-term plans — ownership gives freedom renters don\'t have.' },
                    { label:'Home values are reasonable vs. rents',     note:'In expensive cities, renting and investing the difference can outperform buying financially.' },
                  ].map((f,i,arr) => (
                    <div key={f.label} style={{ display:'flex', gap:10, alignItems:'flex-start', padding:'9px 0', borderBottom:i<arr.length-1?`1px solid ${C.b1}`:'none' }}>
                      <CheckCircle2 size={13} color={C.teal} style={{ flexShrink:0, marginTop:2 }}/>
                      <div>
                        <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.t1, marginBottom:2 }}>{f.label}</div>
                        <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.55 }}>{f.note}</div>
                      </div>
                    </div>
                  ))}
                </MCard>
              </div>

              <MSectionHeader label="Consider Renting When…"/>
              <div style={{ padding:'0 16px' }}>
                <MCard style={{ borderColor:'#8b5cf640' }}>
                  {[
                    { label:'You may move within 3–5 years',            note:'Selling quickly means losing money to closing costs, agent fees (5–6%), and limited appreciation.' },
                    { label:'Your city has extremely high home prices',  note:'In markets like NYC or SF, the price-to-rent ratio makes renting more financially efficient.' },
                    { label:'You\'re in a transitional life phase',      note:'New job, relationship changes, career uncertainty — renting preserves flexibility.' },
                    { label:'You can invest the difference aggressively',note:'If you\'d put 20% down and invest that instead, market returns can match or beat home equity gains.' },
                    { label:'Maintenance stress doesn\'t fit your life', note:'Not everyone wants to be a homeowner. Renting is a completely valid long-term choice.' },
                  ].map((f,i,arr) => (
                    <div key={f.label} style={{ display:'flex', gap:10, alignItems:'flex-start', padding:'9px 0', borderBottom:i<arr.length-1?`1px solid ${C.b1}`:'none' }}>
                      <CheckCircle2 size={13} color='#8b5cf6' style={{ flexShrink:0, marginTop:2 }}/>
                      <div>
                        <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.t1, marginBottom:2 }}>{f.label}</div>
                        <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.55 }}>{f.note}</div>
                      </div>
                    </div>
                  ))}
                </MCard>
              </div>

              <MSectionHeader label="The Break-Even Rule"/>
              <div style={{ padding:'0 16px' }}>
                <MCard>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
                    {[
                      { label:'Typical Break-Even', value:'4–7 Years', color:C.gold,    note:'When total buying costs finally beat total renting costs.' },
                      { label:'High-Cost Markets',  value:'7–10+ Years', color:'#8b5cf6', note:'NYC, SF, Boston — longer payback due to price-to-rent ratios.' },
                    ].map(s => (
                      <div key={s.label} style={{ background:`${s.color}09`, border:`1px solid ${s.color}25`, borderRadius:10, padding:'10px 12px', textAlign:'center' }}>
                        <div style={{ fontFamily:MONO, fontSize:16, fontWeight:800, color:s.color, marginBottom:4 }}>{s.value}</div>
                        <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:C.t3, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:4 }}>{s.label}</div>
                        <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.5 }}>{s.note}</div>
                      </div>
                    ))}
                  </div>
                  <InfoBox>The break-even point is when cumulative buying costs (mortgage interest, taxes, maintenance, closing) equal cumulative renting costs. Use the NYT Rent vs. Buy Calculator (in Resources) to estimate yours precisely.</InfoBox>
                </MCard>

                <MSectionHeader label="What the Math Usually Misses"/>
                <MCard style={{ background:C.raise }}>
                  {[
                    ['Transaction costs are huge', 'Buying and selling a home costs 7–10% of the home value. Realtor fees (5–6%), closing costs (2–5%), and moving expenses add up fast.'],
                    ['Opportunity cost of down payment', 'A $80,000 down payment invested in index funds at 7% annual return = $160,000 in 10 years. That\'s real money foregone.'],
                    ['Maintenance is unpredictable', 'Budget 1–2% of home value per year, but a new roof or HVAC system can cost $10,000–$20,000 in a single year.'],
                    ['Equity ≠ liquid net worth', 'Home equity is illiquid. You can\'t spend it without selling or taking on debt (HELOC). Renters who invest the difference can have more accessible wealth.'],
                  ].map(([l,v],i,arr) => (
                    <div key={l} style={{ padding:'9px 0', borderBottom:i<arr.length-1?`1px solid ${C.b1}`:'none' }}>
                      <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.gold, marginBottom:3 }}>{l}</div>
                      <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.6 }}>{v}</div>
                    </div>
                  ))}
                </MCard>
              </div>
              <div style={{ height:8 }}/>
            </>
          )}

          {/* ── Vehicle ── */}
          {learnTab === 'Vehicle' && (
            <>
              <MSectionHeader label="New vs. Used vs. CPO"/>
              <div style={{ padding:'0 16px' }}>
                {[
                  {
                    type:'New', badge:'Highest Cost', color:'#ef4444',
                    pros:['Full manufacturer warranty','Latest safety & tech features','No unknown history','Manufacturer rebates/incentives'],
                    cons:['Loses 15–25% of value in year one','Higher insurance premiums','Pays full sticker price','Emotional purchase trap'],
                  },
                  {
                    type:'Certified Pre-Owned (CPO)', badge:'Best Value', color:C.teal,
                    pros:['Manufacturer-backed warranty','Inspected & reconditioned','Lower depreciation hit','Low mileage (typically under 60K)'],
                    cons:['More expensive than private used','Limited selection','May still have early depreciation'],
                  },
                  {
                    type:'Used (Private Party)', badge:'Lowest Cost', color:'#22c55e',
                    pros:['Lowest price','Depreciation absorbed by first owner','Pay cash — no interest','Best financial outcome if chosen well'],
                    cons:['No warranty (usually)','Unknown history — get Carfax','Financing harder/more expensive'],
                  },
                ].map(t => (
                  <div key={t.type} style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:12, padding:14, marginBottom:8 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                      <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.t1 }}>{t.type}</div>
                      <div style={{ padding:'2px 8px', borderRadius:20, background:`${t.color}15`, color:t.color, fontFamily:UI, fontSize:10, fontWeight:700 }}>{t.badge}</div>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                      <div>
                        {t.pros.map((p,i) => (
                          <div key={i} style={{ display:'flex', gap:6, alignItems:'flex-start', marginBottom:4 }}>
                            <CheckCircle2 size={11} color='#22c55e' style={{ flexShrink:0, marginTop:2 }}/>
                            <span style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.5 }}>{p}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        {t.cons.map((co,i) => (
                          <div key={i} style={{ display:'flex', gap:6, alignItems:'flex-start', marginBottom:4 }}>
                            <XCircle size={11} color='#ef4444' style={{ flexShrink:0, marginTop:2 }}/>
                            <span style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.5 }}>{co}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <MSectionHeader label="True Cost of Car Ownership"/>
              <div style={{ padding:'0 16px' }}>
                <MCard style={{ background:C.raise, padding:0, overflow:'hidden' }}>
                  {[
                    { item:'Depreciation',        impact:'Highest',  color:'#ef4444', note:'New cars lose 15–25% in year one, 50%+ by year 5. The biggest cost most people ignore.' },
                    { item:'Loan interest',        impact:'High',     color:'#f59e0b', note:'$35K at 7% for 60 months = $6,600+ in interest. Longer loans mean more total cost.' },
                    { item:'Insurance',            impact:'High',     color:'#f59e0b', note:'$1,500–$3,000+/year for a new car. Varies by vehicle, age, and driving record.' },
                    { item:'Fuel',                 impact:'Moderate', color:C.teal,   note:'$1,500–$3,000+/year depending on MPG and miles driven.' },
                    { item:'Maintenance',          impact:'Moderate', color:C.teal,   note:'New: $500–1,000/yr. Older or luxury: $1,500–3,000+/yr.' },
                    { item:'Registration & taxes', impact:'Low',      color:C.t3,     note:'$100–$1,000/year depending on state and vehicle value.' },
                  ].map((co,i,arr) => (
                    <div key={co.item} style={{ padding:'10px 14px', borderBottom:i<arr.length-1?`1px solid ${C.b1}`:'none' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:3 }}>
                        <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.t1 }}>{co.item}</div>
                        <div style={{ padding:'2px 8px', borderRadius:20, background:`${co.color}15`, color:co.color, fontFamily:UI, fontSize:10, fontWeight:700 }}>{co.impact}</div>
                      </div>
                      <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.55 }}>{co.note}</div>
                    </div>
                  ))}
                </MCard>
                <InfoBox>A common guideline: total car expenses (payment + insurance + gas + maintenance) should not exceed 15–20% of take-home pay. Keep total car value under 50% of your annual income.</InfoBox>
              </div>

              <MSectionHeader label="Car Buying Rules That Save You Money"/>
              <div style={{ padding:'0 16px' }}>
                <MCard>
                  {[
                    { rule:'Get pre-approved before the dealer',    note:'Know your rate before you walk in. Having your own financing offer removes the dealer\'s most profitable tool.' },
                    { rule:'Negotiate total price, not payment',     note:'Dealers love stretching loans to 72–84 months. Focus on the out-the-door price, not the monthly payment.' },
                    { rule:'Skip the dealer add-ons',               note:'Extended warranties, paint protection, gap insurance — all high-margin upsells. Evaluate each independently.' },
                    { rule:'Get a pre-purchase inspection',         note:'A $100–150 independent mechanic check on a used car can save thousands. Never skip this.' },
                    { rule:'Avoid rolling negative equity',         note:'Trading in an underwater car and adding that balance to your new loan is a compounding debt trap.' },
                  ].map((r,i,arr) => (
                    <div key={r.rule} style={{ display:'flex', gap:10, alignItems:'flex-start', padding:'10px 0', borderBottom:i<arr.length-1?`1px solid ${C.b1}`:'none' }}>
                      <ArrowRight size={13} color={C.gold} style={{ flexShrink:0, marginTop:2 }}/>
                      <div>
                        <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.t1, marginBottom:2 }}>{r.rule}</div>
                        <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.6 }}>{r.note}</div>
                      </div>
                    </div>
                  ))}
                </MCard>
              </div>
              <div style={{ height:8 }}/>
            </>
          )}

          {/* ── Goals ── */}
          {learnTab === 'Goals' && (
            <>
              <MSectionHeader label="The Sinking Fund Method"/>
              <div style={{ padding:'0 16px' }}>
                <div style={{ background:`${C.teal}0d`, border:`1px solid ${C.teal}25`, borderRadius:12, padding:14, marginBottom:10 }}>
                  <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.t1, marginBottom:6 }}>How It Works</div>
                  <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65 }}>
                    A sinking fund is a dedicated savings account for a specific goal. Calculate the total cost, divide by months until you need it, and automatically transfer that amount each month. When it's time to spend, the money is already there — no debt, no stress.
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                  {[
                    { step:'1', label:'Set the goal',      detail:'Total cost + target date',         color:'#22c55e' },
                    { step:'2', label:'Calculate monthly', detail:'Total ÷ months = monthly savings',  color:C.teal },
                    { step:'3', label:'Automate it',       detail:'Auto-transfer on payday',           color:'#8b5cf6' },
                  ].map(s => (
                    <div key={s.step} style={{ background:`${s.color}0d`, border:`1px solid ${s.color}20`, borderRadius:10, padding:'10px 8px', textAlign:'center' }}>
                      <div style={{ fontFamily:DISPLAY, fontSize:20, fontWeight:700, color:s.color, marginBottom:4 }}>{s.step}</div>
                      <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.t1, marginBottom:3 }}>{s.label}</div>
                      <div style={{ fontFamily:UI, fontSize:10, color:C.t3, lineHeight:1.4 }}>{s.detail}</div>
                    </div>
                  ))}
                </div>
              </div>

              <MSectionHeader label="Where to Keep Goal Savings"/>
              <div style={{ padding:'0 16px' }}>
                <MCard style={{ padding:0, overflow:'hidden' }}>
                  {[
                    { goal:'Emergency Fund',      timeline:'Now',        color:'#ef4444', where:'HYSA',                      note:'3–6 months of expenses. Build this before saving for anything else.' },
                    { goal:'Down Payment (Home)', timeline:'2–7 years',  color:'#f59e0b', where:'HYSA or short-term bonds',   note:"Keep it safe and liquid. Don't put a down payment in stocks." },
                    { goal:'Car Purchase',        timeline:'1–3 years',  color:C.teal,    where:'HYSA or money market',       note:'Save the full amount or as large a down payment as possible.' },
                    { goal:'Wedding / Event',     timeline:'1–3 years',  color:'#8b5cf6', where:'Dedicated HYSA bucket',      note:'Set a budget first, then reverse-engineer the monthly savings needed.' },
                    { goal:'Education / College', timeline:'5–18 years', color:'#ec4899', where:'529 Plan',                   note:'529 contributions grow tax-free for qualified education expenses.' },
                    { goal:'Vacation',            timeline:'< 1 year',   color:'#22c55e', where:'Dedicated savings account',  note:'Sinking fund: divide total cost by months. Automate the transfer.' },
                  ].map((g,i,arr) => (
                    <div key={g.goal} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'10px 14px', borderBottom:i<arr.length-1?`1px solid ${C.b1}`:'none' }}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:g.color, marginTop:5, flexShrink:0 }}/>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:2 }}>
                          <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.t1 }}>{g.goal}</div>
                          <div style={{ fontFamily:UI, fontSize:10, color:g.color, fontWeight:600 }}>{g.timeline}</div>
                        </div>
                        <div style={{ fontFamily:UI, fontSize:11, color:C.teal, marginBottom:2 }}>→ {g.where}</div>
                        <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.55 }}>{g.note}</div>
                      </div>
                    </div>
                  ))}
                </MCard>
                <InfoBox>Many online banks (Ally, Marcus, SoFi) allow multiple savings "buckets" in one account. Name each bucket after your goal and automate transfers — what you don't see, you won't spend.</InfoBox>
              </div>

              <MSectionHeader label="Universal Financing Rules"/>
              <div style={{ padding:'0 16px' }}>
                <MCard style={{ background:C.raise }}>
                  {[
                    ['Never finance depreciating assets at high rates', 'Vehicles, furniture, electronics — if you need a loan at 8%+ for it, reconsider the purchase.'],
                    ['Build the down payment first',                    'It reduces the loan amount, monthly cost, and total interest paid.'],
                    ['Emergency fund stays untouched',                  "Don't drain savings to buy something. Emergency fund is sacred."],
                    ['Compare total cost, not monthly payment',         'A longer loan term has lower payments but higher total cost — always compare total dollars out the door.'],
                  ].map(([l,v],i,arr) => (
                    <div key={l} style={{ padding:'10px 0', borderBottom:i<arr.length-1?`1px solid ${C.b1}`:'none' }}>
                      <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.gold, marginBottom:3 }}>{l}</div>
                      <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.6 }}>{v}</div>
                    </div>
                  ))}
                </MCard>
              </div>
              <div style={{ height:8 }}/>
            </>
          )}
        </>
      )}

      {/* ── CALCULATE ──────────────────────────────────────── */}
      {mainTab === 'Calculate' && (
        <>
          <PillTabs tabs={['Mortgage','Goal Savings']}
            active={calcTab} onChange={setCalcTab} accent={C.gold}/>
          <div style={{ marginTop:12 }}/>

          {/* Mortgage Calculator */}
          {calcTab === 'Mortgage' && (
            <>
              <MSectionHeader label="Mortgage Affordability Calculator"/>
              <div style={{ padding:'0 16px' }}>
                <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.6, marginBottom:12 }}>
                  See your full monthly housing cost and whether the home fits your income.
                </div>
                <MCard>
                  {[
                    { l:'Annual Gross Income',        v:income,    sv:setIncome,    min:30000,  max:500000,  step:5000,  fmt:v=>fmt(v)               },
                    { l:'Home Price',                  v:homePrice, sv:setHomePrice, min:100000, max:2000000, step:10000, fmt:v=>fmt(v)               },
                    { l:`Down Payment (${downPct}%)`, v:downPct,   sv:setDownPct,   min:3,      max:50,      step:1,     fmt:v=>`${v}% — ${fmt(homePrice*v/100)}` },
                    { l:'Interest Rate',               v:rate,      sv:setRate,      min:3,      max:12,      step:0.25,  fmt:v=>`${v}%`              },
                    { l:'Property Tax Rate',           v:propTax,   sv:setPropTax,   min:0.3,    max:4,       step:0.1,   fmt:v=>`${v}%/yr`           },
                    { l:'Homeowners Ins. ($/mo)',      v:insurance, sv:setInsurance, min:50,     max:600,     step:25,    fmt:v=>fmt(v)+'/mo'         },
                  ].map(({l,v,sv,min,max,step,fmt:f}) => (
                    <div key={l} style={{ marginBottom:14 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                        <span style={{ fontFamily:UI, fontSize:12, color:C.t2, fontWeight:600 }}>{l}</span>
                        <span style={{ fontFamily:MONO, fontSize:12, color:C.gold, fontWeight:700 }}>{f(v)}</span>
                      </div>
                      <input type="range" min={min} max={max} step={step} value={v} onChange={e=>sv(+e.target.value)} style={{ width:'100%', accentColor:C.gold }}/>
                    </div>
                  ))}
                  <div style={{ display:'flex', gap:8, marginBottom:14 }}>
                    <div style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:C.t2, alignSelf:'center' }}>Loan Term:</div>
                    {[15,20,30].map(y => (
                      <button key={y} onClick={()=>setTermYrs(y)} style={{
                        flex:1, padding:'8px', borderRadius:9,
                        border:`1.5px solid ${termYrs===y?C.gold:C.b2}`,
                        background:termYrs===y?`${C.gold}18`:C.raise,
                        color:termYrs===y?C.gold:C.t3, fontFamily:UI, fontSize:13, fontWeight:700, cursor:'pointer',
                      }}>{y}yr</button>
                    ))}
                  </div>
                </MCard>

                {/* Results */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 }}>
                  {[
                    ['P&I',           fmt(mortgageResult.pi),                  C.teal],
                    ['Taxes + Ins.',  fmt(mortgageResult.tax+insurance),        '#8b5cf6'],
                    mortgageResult.pmi > 0 ? ['PMI', fmt(mortgageResult.pmi), '#f59e0b'] : null,
                    ['Total Monthly', fmt(mortgageResult.total),                C.gold],
                  ].filter(Boolean).map(([l,v,co]) => (
                    <div key={l} style={{ background:`${co}09`, border:`1px solid ${co}25`, borderRadius:10, padding:'10px', textAlign:'center' }}>
                      <div style={{ fontFamily:UI, fontSize:9, color:C.t3, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:3 }}>{l}</div>
                      <div style={{ fontFamily:MONO, fontSize:17, fontWeight:800, color:co }}>{v}</div>
                    </div>
                  ))}
                </div>

                {/* 28% indicator */}
                <div style={{
                  background:mortgageResult.affordable?`#22c55e0d`:`#ef44440d`,
                  border:`1px solid ${mortgageResult.affordable?'#22c55e':'#ef4444'}30`,
                  borderRadius:10, padding:'12px 14px', marginBottom:8,
                }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                    <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:mortgageResult.affordable?'#22c55e':'#ef4444' }}>
                      {mortgageResult.affordable ? 'Within 28% guideline' : 'Above 28% guideline'}
                    </div>
                    <div style={{ fontFamily:MONO, fontSize:16, fontWeight:800, color:mortgageResult.affordable?'#22c55e':'#ef4444' }}>
                      {(mortgageResult.ratio*100).toFixed(1)}%
                    </div>
                  </div>
                  <div style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.55 }}>
                    {mortgageResult.affordable
                      ? `Your ${fmt(mortgageResult.total)}/month total payment is within the recommended 28% of gross income.`
                      : `${fmt(mortgageResult.total)}/month is ${(mortgageResult.ratio*100).toFixed(1)}% of gross income. Consider a lower price or larger down payment.`}
                  </div>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  {[
                    ['Total Interest',    fmt(mortgageResult.totalInterest),                                             '#ef4444'],
                    ['Closing Costs Est.',`${fmt(mortgageResult.closingLow)}–${fmt(mortgageResult.closingHigh)}`, '#f59e0b'],
                  ].map(([l,v,co]) => (
                    <div key={l} style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:10, padding:'10px', textAlign:'center' }}>
                      <div style={{ fontFamily:UI, fontSize:9, color:C.t3, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:3 }}>{l}</div>
                      <div style={{ fontFamily:MONO, fontSize:14, fontWeight:700, color:co }}>{v}</div>
                    </div>
                  ))}
                </div>
                <InfoBox>Does not include HOA, maintenance (budget 1–2% of home value/year), or utilities. Add those to get your true monthly homeownership cost.</InfoBox>
              </div>
            </>
          )}

          {/* Goal Savings Calculator */}
          {calcTab === 'Goal Savings' && (
            <>
              <MSectionHeader label="Goal Savings Planner"/>
              <div style={{ padding:'0 16px' }}>
                <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.6, marginBottom:12 }}>
                  Find out when you'll reach your goal, or how much you need to save each month to hit it on time.
                </div>
                <MCard>
                  {[
                    { l:'Goal Amount',          v:goalAmt,     sv:setGoalAmt,    min:1000,  max:500000, step:1000, fmt:v=>fmt(v)  },
                    { l:'Already Saved',        v:goalSaved,   sv:setGoalSaved,  min:0,     max:200000, step:500,  fmt:v=>fmt(v)  },
                    { l:'Monthly Contribution', v:goalMonthly, sv:setGoalMo,     min:50,    max:10000,  step:50,   fmt:v=>fmt(v)  },
                    { l:'Savings APY',          v:goalApy,     sv:setGoalApy,    min:0,     max:8,      step:0.25, fmt:v=>`${v}%` },
                  ].map(({l,v,sv,min,max,step,fmt:f}) => (
                    <div key={l} style={{ marginBottom:14 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                        <span style={{ fontFamily:UI, fontSize:12, color:C.t2, fontWeight:600 }}>{l}</span>
                        <span style={{ fontFamily:MONO, fontSize:12, color:C.gold, fontWeight:700 }}>{f(v)}</span>
                      </div>
                      <input type="range" min={min} max={max} step={step} value={v} onChange={e=>sv(+e.target.value)} style={{ width:'100%', accentColor:C.gold }}/>
                    </div>
                  ))}
                </MCard>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:10 }}>
                  {[
                    ['Still Need',     fmt(Math.max(0,goalAmt-goalSaved)),                                          '#f59e0b'],
                    ['Time to Goal',   goalResult.months < 1200 ? `${goalResult.years>0?goalResult.years+'y ':''} ${goalResult.remMos}m` : '—', C.t1],
                    ['Interest Earned',goalResult.interestEarned > 0 ? fmt(goalResult.interestEarned) : '$0',        C.teal],
                  ].map(([l,v,co]) => (
                    <div key={l} style={{ background:`${co}09`, border:`1px solid ${co}25`, borderRadius:10, padding:'10px', textAlign:'center' }}>
                      <div style={{ fontFamily:UI, fontSize:9, color:C.t3, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:3 }}>{l}</div>
                      <div style={{ fontFamily:MONO, fontSize:15, fontWeight:800, color:co }}>{v}</div>
                    </div>
                  ))}
                </div>

                <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.t1, marginBottom:8 }}>Monthly savings needed to reach goal in:</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6 }}>
                  {[12,24,36,60].map(mo => (
                    <div key={mo} style={{ background:`${C.gold}0d`, border:`1px solid ${C.gold}20`, borderRadius:9, padding:'8px 6px', textAlign:'center' }}>
                      <div style={{ fontFamily:MONO, fontSize:13, fontWeight:700, color:C.gold }}>{fmt(Math.ceil(goalResult.calcMo(mo)))}</div>
                      <div style={{ fontFamily:UI, fontSize:10, color:C.t3, marginTop:2 }}>{mo<12?mo+'mo':mo/12+'yr'}</div>
                    </div>
                  ))}
                </div>
                <InfoBox>Open a dedicated HYSA and name it after your goal. Automate the monthly transfer on payday. What you don't see, you won't spend.</InfoBox>
              </div>
            </>
          )}
        </>
      )}

      {/* ── RESOURCES ──────────────────────────────────────── */}
      {mainTab === 'Resources' && (
        <>
          <MSectionHeader label="Home Buying"/>
          <div style={{ padding:'0 16px' }}>
            <MCard style={{ background:C.raise, padding:0, overflow:'hidden' }}>
              {[
                { name:'CFPB — Buying a House',             desc:'Step-by-step guide to the mortgage process, closing costs, and buyer rights.',          url:'https://www.consumerfinance.gov/owning-a-home/' },
                { name:'Bankrate Mortgage Calculator',       desc:'Current mortgage rates and detailed payment breakdowns.',                                url:'https://www.bankrate.com/mortgages/mortgage-calculator/' },
                { name:'HUD Approved Housing Counselors',   desc:'Free or low-cost homebuying counseling from HUD-approved agencies.',                     url:'https://www.hud.gov/findacounselor' },
                { name:'NYT Rent vs. Buy Calculator',       desc:'The most comprehensive rent vs. buy calculator accounting for all real costs.',          url:'https://www.nytimes.com/interactive/2014/upshot/buy-rent-calculator.html' },
              ].map((r,i,arr) => (
                <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
                  style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:10, padding:'11px 14px', borderBottom:i<arr.length-1?`1px solid ${C.b1}`:'none', textDecoration:'none' }}>
                  <div>
                    <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.teal, marginBottom:3 }}>{r.name}</div>
                    <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.55 }}>{r.desc}</div>
                  </div>
                  <ExternalLink size={13} color={C.t3} style={{ flexShrink:0, marginTop:2 }}/>
                </a>
              ))}
            </MCard>
          </div>

          <MSectionHeader label="Car Buying"/>
          <div style={{ padding:'0 16px' }}>
            <MCard style={{ background:C.raise, padding:0, overflow:'hidden' }}>
              {[
                { name:'Consumer Reports Car Guide',  desc:'Reliability ratings, true cost of ownership, and pricing data for new and used cars.',    url:'https://www.consumerreports.org/cars/' },
                { name:'Edmunds True Market Value',   desc:'See what others are actually paying for the car you want. Essential before negotiating.', url:'https://www.edmunds.com/tmv.html' },
                { name:'Carfax',                      desc:'Vehicle history reports — check before buying any used car.',                              url:'https://www.carfax.com' },
              ].map((r,i,arr) => (
                <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
                  style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:10, padding:'11px 14px', borderBottom:i<arr.length-1?`1px solid ${C.b1}`:'none', textDecoration:'none' }}>
                  <div>
                    <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.gold, marginBottom:3 }}>{r.name}</div>
                    <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.55 }}>{r.desc}</div>
                  </div>
                  <ExternalLink size={13} color={C.t3} style={{ flexShrink:0, marginTop:2 }}/>
                </a>
              ))}
            </MCard>
          </div>

          <MSectionHeader label="Goal Savings"/>
          <div style={{ padding:'0 16px' }}>
            <MCard style={{ background:C.raise, padding:0, overflow:'hidden' }}>
              {[
                { name:'NerdWallet Best HYSA Rates',  desc:'Current high-yield savings account rates updated regularly.',                                       url:'https://www.nerdwallet.com/best/banking/high-yield-online-savings-accounts' },
                { name:'Savingforcollege.com',         desc:'Compare 529 plans by state, investment options, and tax benefits.',                                 url:'https://www.savingforcollege.com' },
                { name:'Ally Bank Savings Buckets',    desc:'Create multiple named savings "buckets" in one account for each goal. Available inside Ally Bank.', url:'https://www.ally.com/bank/online-savings-account/' },
                { name:'Marcus by Goldman Sachs',      desc:'High-yield savings with competitive APY and no fees.',                                              url:'https://www.marcus.com/us/en' },
              ].map((r,i,arr) => (
                <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
                  style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:10, padding:'11px 14px', borderBottom:i<arr.length-1?`1px solid ${C.b1}`:'none', textDecoration:'none' }}>
                  <div>
                    <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.indigo, marginBottom:3 }}>{r.name}</div>
                    <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.55 }}>{r.desc}</div>
                  </div>
                  <ExternalLink size={13} color={C.t3} style={{ flexShrink:0, marginTop:2 }}/>
                </a>
              ))}
            </MCard>
          </div>
          <div style={{ height:8 }}/>
        </>
      )}
    </div>
  )
}
