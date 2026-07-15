import { useState, useMemo } from 'react'
import {
  Home, Car, Anchor, Wrench, Package, Settings, Monitor, MapPin, RefreshCw,
  CheckCircle2, XCircle, ChevronLeft,
} from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'

/* ── helpers ─────────────────────────────────────────────── */
const fmt = n => new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', maximumFractionDigits:0 }).format(n||0)
function calcPMT(principal, annRate, months) {
  if (!principal || months <= 0) return 0
  if (annRate === 0) return principal / months
  const r = annRate / 100 / 12
  return principal * (r * Math.pow(1+r,months)) / (Math.pow(1+r,months) - 1)
}

/* ── shared UI atoms ─────────────────────────────────────── */
function BackBtn({ onBack }) {
  return (
    <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', padding:'0 0 14px', WebkitTapHighlightColor:'transparent' }}>
      <ChevronLeft size={16} color={C.t3} />
      <span style={{ fontFamily:UI, fontSize:13, color:C.t3 }}>All Tools</span>
    </button>
  )
}

function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display:'flex', borderBottom:`1px solid ${C.b2}`, overflowX:'auto', scrollbarWidth:'none', marginBottom:14, background:C.bg }}>
      {tabs.map(t => (
        <button key={t.key} onClick={() => onChange(t.key)} style={{
          flexShrink:0, padding:'10px 14px', background:'none', border:'none', cursor:'pointer',
          borderBottom:`2px solid ${active===t.key ? C.teal : 'transparent'}`,
          fontFamily:UI, fontSize:11, fontWeight:600,
          color: active===t.key ? C.teal : C.t3,
        }}>{t.label}</button>
      ))}
    </div>
  )
}

function Slider({ label, value, min, max, step, disp, onChange, accent }) {
  return (
    <div style={{ marginBottom:11 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
        <span style={{ fontFamily:UI, fontSize:12, color:C.t2 }}>{label}</span>
        <span style={{ fontFamily:MONO, fontSize:12, fontWeight:700, color:C.t1 }}>{disp}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(+e.target.value)}
        style={{ width:'100%', accentColor: accent||C.teal }} />
    </div>
  )
}

function StatRow({ label, value, accent }) {
  return (
    <div style={{ background:C.surf, border:`1px solid ${C.b1}`, borderRadius:12, padding:'10px 12px', textAlign:'center' }}>
      <div style={{ fontFamily:MONO, fontSize:14, fontWeight:900, color:accent||C.teal, marginBottom:3 }}>{value}</div>
      <div style={{ fontFamily:UI, fontSize:9, color:C.t3, textTransform:'uppercase', letterSpacing:'0.07em' }}>{label}</div>
    </div>
  )
}

function ProConList({ pros, cons, buyLabel='Buying', rentLabel='Renting' }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
      <div style={{ background:C.surf, border:`1px solid ${C.b1}`, borderRadius:14, overflow:'hidden' }}>
        <div style={{ padding:'10px 12px', background:'rgba(201,169,110,0.08)', borderBottom:`1px solid ${C.b1}` }}>
          <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:C.gold, textTransform:'uppercase', letterSpacing:'0.08em' }}>{buyLabel}</div>
        </div>
        <div style={{ padding:'10px 12px' }}>
          {pros.map(p => (
            <div key={p} style={{ display:'flex', gap:5, marginBottom:5 }}>
              <CheckCircle2 size={10} color={C.up} style={{ flexShrink:0, marginTop:2 }} />
              <span style={{ fontFamily:UI, fontSize:10, color:C.t2, lineHeight:1.5 }}>{p}</span>
            </div>
          ))}
          <div style={{ borderTop:`1px solid ${C.b1}`, marginTop:8, paddingTop:8 }}>
            {(pros._cons||[]).map(p => (
              <div key={p} style={{ display:'flex', gap:5, marginBottom:5 }}>
                <XCircle size={10} color={C.down} style={{ flexShrink:0, marginTop:2 }} />
                <span style={{ fontFamily:UI, fontSize:10, color:C.t2, lineHeight:1.5 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ background:C.surf, border:`1px solid ${C.b1}`, borderRadius:14, overflow:'hidden' }}>
        <div style={{ padding:'10px 12px', background:`${C.teal}08`, borderBottom:`1px solid ${C.b1}` }}>
          <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:C.teal, textTransform:'uppercase', letterSpacing:'0.08em' }}>{rentLabel}</div>
        </div>
        <div style={{ padding:'10px 12px' }}>
          {cons.map(p => (
            <div key={p} style={{ display:'flex', gap:5, marginBottom:5 }}>
              <CheckCircle2 size={10} color={C.teal} style={{ flexShrink:0, marginTop:2 }} />
              <span style={{ fontFamily:UI, fontSize:10, color:C.t2, lineHeight:1.5 }}>{p}</span>
            </div>
          ))}
          <div style={{ borderTop:`1px solid ${C.b1}`, marginTop:8, paddingTop:8 }}>
            {(cons._cons||[]).map(p => (
              <div key={p} style={{ display:'flex', gap:5, marginBottom:5 }}>
                <XCircle size={10} color={C.down} style={{ flexShrink:0, marginTop:2 }} />
                <span style={{ fontFamily:UI, fontSize:10, color:C.t2, lineHeight:1.5 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function BTooltip({ active, payload, label }) {
  if (!active||!payload?.length) return null
  return (
    <div style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:8, padding:'8px 12px' }}>
      <div style={{ fontFamily:UI, fontSize:10, color:C.t3, marginBottom:4 }}>{label}</div>
      {payload.map(p => <div key={p.name} style={{ fontFamily:MONO, fontSize:11, color:p.fill, fontWeight:700 }}>{p.name}: {fmt(p.value)}</div>)}
    </div>
  )
}

function LearnSection({ title, intro, points }) {
  return (
    <>
      <MCard>
        <div style={{ fontFamily:DISPLAY, fontSize:16, fontWeight:700, color:C.t1, marginBottom:8 }}>{title}</div>
        <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.7 }}>{intro}</div>
      </MCard>
      {points.map(p => (
        <div key={p.label} style={{ background:C.surf, border:`1px solid ${C.b1}`, borderRadius:12, padding:'11px 13px', marginBottom:8 }}>
          <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:C.teal, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>{p.label}</div>
          <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65 }}>{p.body}</div>
        </div>
      ))}
    </>
  )
}

function WhenList({ buyItems, rentItems, buyLabel='Buying', rentLabel='Renting' }) {
  return (
    <MCard style={{ padding:0, overflow:'hidden' }}>
      <div style={{ padding:'10px 14px', background:'rgba(201,169,110,0.08)', borderBottom:`1px solid ${C.b1}` }}>
        <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.gold }}>When {buyLabel} makes sense</div>
      </div>
      <div style={{ padding:'10px 14px', borderBottom:`1px solid ${C.b1}` }}>
        {buyItems.map(item => (
          <div key={item} style={{ display:'flex', gap:7, marginBottom:5 }}>
            <div style={{ width:5, height:5, borderRadius:'50%', background:C.gold, flexShrink:0, marginTop:5 }} />
            <span style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.55 }}>{item}</span>
          </div>
        ))}
      </div>
      <div style={{ padding:'10px 14px', background:`${C.teal}06`, borderBottom:`1px solid ${C.b1}` }}>
        <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.teal }}>When {rentLabel} makes sense</div>
      </div>
      <div style={{ padding:'10px 14px' }}>
        {rentItems.map(item => (
          <div key={item} style={{ display:'flex', gap:7, marginBottom:5 }}>
            <div style={{ width:5, height:5, borderRadius:'50%', background:C.teal, flexShrink:0, marginTop:5 }} />
            <span style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.55 }}>{item}</span>
          </div>
        ))}
      </div>
    </MCard>
  )
}

/* ═══════════════════════════════════════════════════════════
   HUB SCREEN
══════════════════════════════════════════════════════════════ */
const TOOLS = [
  { key:'house',   Icon:Home,      label:'Buy or Rent a House',         desc:'Break-even analysis, equity modeling, opportunity cost of down payment.', badge:'Primary Residence' },
  { key:'car',     Icon:Car,       label:'Buy or Lease a Car',          desc:'Total cost of ownership: depreciation, loan interest, and lease cost comparison.', badge:'Vehicle' },
  { key:'recr',    Icon:Anchor,    label:'Recreational & Personal Items', desc:'Boats, OHVs, RVs, jet skis, snowmobiles, motorcycles, campers.', badge:'Lifestyle' },
  { key:'equip',   Icon:Wrench,    label:'Buy or Rent Equipment',       desc:'Determine when purchasing beats rental based on usage frequency.', badge:'Business' },
  { key:'furn',    Icon:Package,   label:'Buy or Rent Furniture',       desc:'For renters and frequent movers — when buying beats rental costs.', badge:'Home' },
  { key:'heavy',   Icon:Settings,  label:'Tools & Heavy Equipment',     desc:'Three-way comparison for contractors: buy vs. lease vs. rent.', badge:'Business' },
  { key:'tech',    Icon:Monitor,   label:'Buy or Subscribe to Tech',    desc:'Lifetime cost of owned technology versus subscription models.', badge:'Technology' },
  { key:'vac',     Icon:MapPin,    label:'Vacation Property',           desc:'True cost of vacation home ownership versus booking, with rental income modeling.', badge:'Real Estate' },
  { key:'sub',     Icon:RefreshCw, label:'Buy Once vs Subscribe',       desc:'Universal calculator — find the exact break-even month for any product.', badge:'Any Purchase' },
]

function HubScreen({ onSelect }) {
  return (
    <div style={{ padding:'12px 16px 0' }}>
      <MCard>
        <div style={{ fontFamily:DISPLAY, fontSize:16, fontWeight:700, color:C.t1, marginBottom:6 }}>Buy, Rent or Lease</div>
        <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65 }}>
          Nine decision tools that walk you through the math, pros and cons, and a personalized verdict for every major acquisition in your life.
        </div>
      </MCard>
      {TOOLS.slice(0,3).map(t => (
        <button key={t.key} onClick={() => onSelect(t.key)} style={{ width:'100%', display:'flex', alignItems:'flex-start', gap:12, background:C.surf, border:`1px solid ${C.b1}`, borderRadius:16, padding:'14px', marginBottom:10, cursor:'pointer', textAlign:'left', WebkitTapHighlightColor:'transparent' }}>
          <div style={{ width:42, height:42, borderRadius:12, background:`${C.teal}12`, border:`1px solid ${C.teal}28`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <t.Icon size={18} color={C.teal} />
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.teal, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:3 }}>{t.badge} · Featured Tool</div>
            <div style={{ fontFamily:DISPLAY, fontSize:15, fontWeight:700, color:C.t1, marginBottom:4 }}>{t.label}</div>
            <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.5 }}>{t.desc}</div>
          </div>
        </button>
      ))}
      <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em', padding:'4px 2px 10px' }}>More Tools</div>
      {TOOLS.slice(3).map(t => (
        <button key={t.key} onClick={() => onSelect(t.key)} style={{ width:'100%', display:'flex', alignItems:'center', gap:12, background:C.surf, border:`1px solid ${C.b1}`, borderRadius:14, padding:'12px 14px', marginBottom:8, cursor:'pointer', textAlign:'left', WebkitTapHighlightColor:'transparent' }}>
          <div style={{ width:36, height:36, borderRadius:10, background:`${C.gold}10`, border:`1px solid ${C.gold}25`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <t.Icon size={15} color={C.gold} />
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:DISPLAY, fontSize:13, fontWeight:700, color:C.t1, marginBottom:2 }}>{t.label}</div>
            <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.4 }}>{t.desc}</div>
          </div>
        </button>
      ))}
      <div style={{ height:20 }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   HOUSE TOOL
══════════════════════════════════════════════════════════════ */
function buildHouseData(price, dpPct, rate, termYrs, rent0, appPct, rentIncPct, investRet) {
  const dp = price * dpPct / 100
  const principal = price - dp
  const monthly = calcPMT(principal, rate, termYrs * 12)
  let balance = principal, homeValue = price, cumBuy = dp, cumRent = 0, rentNow = rent0
  const data = []
  for (let yr = 1; yr <= 30; yr++) {
    for (let mo = 0; mo < 12; mo++) {
      const interest = balance * (rate / 100 / 12)
      const prinPaid = Math.min(monthly - interest, balance)
      balance = Math.max(0, balance - prinPaid)
      cumBuy += monthly + price * 0.012 / 12 + price * 0.010 / 12
    }
    homeValue *= (1 + appPct / 100)
    cumRent += rentNow * 12
    rentNow *= (1 + rentIncPct / 100)
    const oppCost = dp * (Math.pow(1 + investRet / 100, yr) - 1)
    const equity = homeValue - Math.max(0, balance)
    data.push({ year: yr, Buy: Math.round(cumBuy - equity + oppCost), Rent: Math.round(cumRent), equity: Math.round(equity) })
  }
  const crossover = data.find(d => d.Buy <= d.Rent)
  return { data, breakEven: crossover?.year ?? null, finalEquity: data[29]?.equity ?? 0 }
}

function HouseTool({ onBack }) {
  const [tab, setTab] = useState('learn')
  const [price, setPrice] = useState(400000)
  const [dpPct, setDpPct] = useState(10)
  const [rate, setRate] = useState(6.8)
  const [termYrs, setTermYrs] = useState(30)
  const [rent0, setRent0] = useState(2200)
  const [appPct, setAppPct] = useState(3)
  const [rentIncPct, setRentIncPct] = useState(3)
  const [investRet, setInvestRet] = useState(7)

  const { data, breakEven, finalEquity } = useMemo(() => buildHouseData(price, dpPct, rate, termYrs, rent0, appPct, rentIncPct, investRet), [price, dpPct, rate, termYrs, rent0, appPct, rentIncPct, investRet])
  const monthly = calcPMT(price * (1 - dpPct / 100), rate, termYrs * 12)
  const yr30buy = data[29]?.Buy ?? 0, yr30rent = data[29]?.Rent ?? 0
  const verdictBuy = yr30buy < yr30rent
  const diff30 = Math.abs(yr30buy - yr30rent)

  const TABS = [
    { key:'learn', label:'Learn' },
    { key:'calc', label:'Rent vs Buy' },
    { key:'afford', label:'Affordability' },
    { key:'pros', label:'Pros & Cons' },
    { key:'when', label:'When' },
    { key:'verdict', label:'Verdict' },
  ]

  const [income, setIncome] = useState(90000)
  const [debts, setDebts] = useState(500)
  const [aRate, setARate] = useState(7.0)
  const [down, setDown] = useState(60000)
  const [taxes, setTaxes] = useState(400)
  const [ins, setIns] = useState(150)
  const mo = income / 12, moRate = aRate / 100 / 12
  const maxPITI = Math.min(mo * 0.28, Math.max(0, mo * 0.36 - debts - taxes - ins))
  const maxLoan = maxPITI > 0 ? maxPITI * ((Math.pow(1+moRate,360)-1)/(moRate*Math.pow(1+moRate,360))) : 0
  const maxPrice = maxLoan + down

  return (
    <div style={{ paddingBottom:88 }}>
      <div style={{ padding:'12px 16px 0' }}><BackBtn onBack={onBack} /></div>
      <div style={{ padding:'0 16px 10px' }}>
        <div style={{ fontFamily:DISPLAY, fontSize:20, fontWeight:700, color:C.t1 }}>Buy or Rent a House</div>
        <div style={{ fontFamily:UI, fontSize:12, color:C.t3, marginTop:2 }}>Break-even analysis, equity modeling, affordability</div>
      </div>
      <TabBar tabs={TABS} active={tab} onChange={setTab} />
      <div style={{ padding:'0 16px' }}>
        {tab === 'learn' && (
          <LearnSection
            title="How the Math Really Works"
            intro="Buying a home is the largest financial decision most people ever make — yet most compare only rent vs. mortgage payment. The real analysis includes equity growth, appreciation, property taxes, maintenance, and the opportunity cost of your down payment."
            points={[
              { label:'Monthly Mortgage (PMT)', body:'Your payment is P × r(1+r)ⁿ / ((1+r)ⁿ−1). Early payments are mostly interest — equity builds faster over time as the principal balance drops.' },
              { label:'Equity Accumulation', body:'Equity = current home value minus remaining loan balance. As you pay down principal and the home appreciates, equity compounds. After 30 years you own the asset outright.' },
              { label:'Opportunity Cost', body:'Your down payment could be invested in the market instead. This calculator subtracts that foregone investment return to give you the true net cost of buying vs. renting.' },
              { label:'Break-Even Year', body:'The year when cumulative net cost of buying drops below cumulative rent paid. Before that year, renting has been cheaper in total dollars.' },
              { label:'Property Tax & Maintenance', body:'Assumes 1.2% annual property tax and 1% maintenance cost on home value. These are real costs renters don\'t pay.' },
              { label:'Rent Increases', body:'A 3% annual increase is historically typical. A $2,000 rent becomes $2,688/month after 10 years — which strengthens the buying case over time.' },
            ]}
          />
        )}
        {tab === 'calc' && (
          <>
            <MCard>
              <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:10 }}>Home Purchase</div>
              <Slider label="Home Price" value={price} min={100000} max={1500000} step={10000} disp={fmt(price)} onChange={setPrice} />
              <Slider label="Down Payment" value={dpPct} min={3} max={30} step={0.5} disp={`${dpPct}%`} onChange={setDpPct} />
              <Slider label="Interest Rate" value={rate} min={2} max={12} step={0.1} disp={`${rate.toFixed(1)}%`} onChange={setRate} />
              <Slider label="Loan Term" value={termYrs} min={10} max={30} step={5} disp={`${termYrs} yrs`} onChange={setTermYrs} />
            </MCard>
            <MCard>
              <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:10 }}>Market Assumptions</div>
              <Slider label="Monthly Rent (equiv.)" value={rent0} min={500} max={8000} step={50} disp={fmt(rent0)+'/mo'} onChange={setRent0} />
              <Slider label="Annual Home Appreciation" value={appPct} min={0} max={8} step={0.5} disp={`${appPct}%`} onChange={setAppPct} />
              <Slider label="Annual Rent Increase" value={rentIncPct} min={0} max={8} step={0.5} disp={`${rentIncPct}%`} onChange={setRentIncPct} />
              <Slider label="Investment Return (opp. cost)" value={investRet} min={2} max={12} step={0.5} disp={`${investRet}%`} onChange={setInvestRet} />
            </MCard>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:12 }}>
              <StatRow label="Monthly Payment" value={fmt(monthly)} accent={C.gold} />
              <StatRow label="Break-Even Yr" value={breakEven ? `Yr ${breakEven}` : '30+'} accent={C.teal} />
              <StatRow label="30-yr Equity" value={fmt(finalEquity)} accent={C.up} />
            </div>
            <MCard>
              <div style={{ fontFamily:UI, fontSize:10, color:C.t3, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Net Cost: Buy vs Rent (30 yrs)</div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data} margin={{ top:4, right:8, bottom:0, left:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.b1} />
                  <XAxis dataKey="year" tick={{ fill:C.t3, fontFamily:MONO, fontSize:9 }} tickLine={false} />
                  <YAxis tickFormatter={n=>`$${Math.round(n/1000)}k`} tick={{ fill:C.t3, fontFamily:MONO, fontSize:9 }} tickLine={false} axisLine={false} />
                  <Tooltip content={({ active, payload, label }) => active&&payload?.length ? <div style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:8, padding:'7px 10px' }}><div style={{ fontFamily:UI, fontSize:9, color:C.t3, marginBottom:3 }}>Year {label}</div>{payload.map(p=><div key={p.name} style={{ fontFamily:MONO, fontSize:11, color:p.color, fontWeight:700 }}>{p.name}: {fmt(p.value)}</div>)}</div> : null} />
                  <Legend wrapperStyle={{ fontFamily:UI, fontSize:10 }} />
                  {breakEven && <ReferenceLine x={breakEven} stroke={C.up} strokeDasharray="4 3" />}
                  <Line type="monotone" dataKey="Buy" stroke={C.gold} strokeWidth={2} dot={false} name="Buy (net)" />
                  <Line type="monotone" dataKey="Rent" stroke={C.teal} strokeWidth={2} dot={false} name="Rent" />
                </LineChart>
              </ResponsiveContainer>
            </MCard>
          </>
        )}
        {tab === 'afford' && (
          <>
            <MCard>
              <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:10 }}>Your Financial Profile</div>
              <Slider label="Annual Gross Income" value={income} min={30000} max={500000} step={5000} disp={fmt(income)} onChange={setIncome} />
              <Slider label="Monthly Debt Payments" value={debts} min={0} max={3000} step={50} disp={fmt(debts)+'/mo'} onChange={setDebts} />
              <Slider label="Mortgage Rate" value={aRate} min={3} max={12} step={0.1} disp={`${aRate.toFixed(1)}%`} onChange={setARate} />
              <Slider label="Down Payment" value={down} min={5000} max={500000} step={5000} disp={fmt(down)} onChange={setDown} />
              <Slider label="Est. Monthly Property Tax" value={taxes} min={0} max={3000} step={25} disp={fmt(taxes)+'/mo'} onChange={setTaxes} />
              <Slider label="Est. Monthly Insurance" value={ins} min={50} max={500} step={10} disp={fmt(ins)+'/mo'} onChange={setIns} />
            </MCard>
            <div style={{ background:C.surf, border:`1.5px solid ${C.gold}35`, borderRadius:16, padding:'14px', marginBottom:12, textAlign:'center' }}>
              <div style={{ fontFamily:UI, fontSize:10, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>Maximum Affordable Home Price</div>
              <div style={{ fontFamily:MONO, fontSize:28, fontWeight:900, color:C.gold, marginBottom:4 }}>{fmt(maxPrice)}</div>
              <div style={{ fontFamily:UI, fontSize:11, color:C.t3 }}>28% front-end rule · {fmt(down)} down included</div>
            </div>
            {[
              { rule:'28% Front-End Rule', limit:mo*0.28, desc:'Max housing cost as % of gross income' },
              { rule:'36% Back-End Rule', limit:Math.max(0,mo*0.36-debts), desc:'Max total debt payments' },
              { rule:'Conservative (25%)', limit:mo*0.25, desc:'Most conservative guideline' },
            ].map(r => {
              const ratio = Math.min(1, Math.max(0, maxPITI / Math.max(1, r.limit)))
              return (
                <div key={r.rule} style={{ background:C.surf, border:`1px solid ${C.b1}`, borderRadius:12, padding:'10px 12px', marginBottom:8 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                    <span style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:C.t1 }}>{r.rule}</span>
                    <span style={{ fontFamily:MONO, fontSize:11, color:C.gold, fontWeight:700 }}>{fmt(r.limit)}/mo</span>
                  </div>
                  <div style={{ height:4, background:C.b1, borderRadius:2, overflow:'hidden', marginBottom:4 }}>
                    <div style={{ height:'100%', width:`${ratio*100}%`, background:C.teal, borderRadius:2 }} />
                  </div>
                  <div style={{ fontFamily:UI, fontSize:10, color:C.t3 }}>{r.desc}</div>
                </div>
              )
            })}
          </>
        )}
        {tab === 'pros' && (
          <ProConList
            buyLabel="Buying" rentLabel="Renting"
            pros={Object.assign(['Build equity with every payment','Home appreciation benefits','Fixed payment never increases','Renovate freely','Forced savings mechanism'],{_cons:['Large upfront capital needed','Responsible for all repairs','Less mobility for job changes','Illiquid asset']})}
            cons={Object.assign(['No down payment — invest capital','Geographic flexibility','Landlord handles repairs','No exposure to home declines','Lower upfront costs'],{_cons:['No equity — rent is sunk cost','Rent can increase annually','Landlord can not renew lease','Limited ability to customize']})}
          />
        )}
        {tab === 'when' && (
          <WhenList
            buyLabel="Buying" rentLabel="Renting"
            buyItems={['You plan to stay 7+ years','You have 10–20% down without depleting savings','Income is stable, you qualify for a competitive rate','Local rent increases exceed 3%/year consistently']}
            rentItems={['You expect to relocate within 1–5 years','Home prices are far above historical rent ratios','You want to invest the down payment in the market','You live in a high-cost city where renting is rational']}
          />
        )}
        {tab === 'verdict' && (
          <div style={{ background:C.surf, border:`1.5px solid ${verdictBuy ? C.gold : C.teal}35`, borderRadius:16, padding:'16px' }}>
            <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:verdictBuy ? C.gold : C.teal, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>Personalized Verdict</div>
            <div style={{ fontFamily:DISPLAY, fontSize:16, fontWeight:700, color:C.t1, marginBottom:8 }}>
              {verdictBuy ? 'Buying comes out ahead over 30 years' : 'Renting has the financial edge with your inputs'}
            </div>
            <div style={{ fontFamily:UI, fontSize:13, color:C.t2, lineHeight:1.65 }}>
              {verdictBuy
                ? `Over 30 years, buying saves you ${fmt(diff30)} compared to renting, accounting for equity built and ${appPct}% appreciation. Break-even is Year ${breakEven ?? 'unknown'}.`
                : `With ${appPct}% appreciation and ${investRet}% investment return, opportunity cost keeps renting ahead by ${fmt(diff30)} over 30 years. Lower the investment return assumption to shift this.`}
            </div>
          </div>
        )}
        <div style={{ height:20 }} />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   CAR TOOL
══════════════════════════════════════════════════════════════ */
function CarTool({ onBack }) {
  const [tab, setTab] = useState('learn')
  const [buyPrice, setBuyPrice] = useState(35000)
  const [buyDown, setBuyDown] = useState(5000)
  const [buyRate, setBuyRate] = useState(6.5)
  const [buyTermMos, setBuyTermMos] = useState(60)
  const [annIns, setAnnIns] = useState(1800)
  const [annMaint, setAnnMaint] = useState(800)
  const [leaseMo, setLeaseMo] = useState(450)
  const [leaseTerm, setLeaseTerm] = useState(36)
  const [leaseCapRed, setLeaseCapRed] = useState(3000)
  const [leaseFees, setLeaseFees] = useState(800)

  function carValue(yrs) {
    let v = buyPrice
    for (let y=0;y<yrs;y++) v *= y===0?0.85:y===1?0.88:y<=4?0.90:0.92
    return Math.max(v, buyPrice*0.05)
  }
  function buyTCO(yrs) {
    const monthly = calcPMT(buyPrice-buyDown,buyRate,buyTermMos)
    let balance=buyPrice-buyDown, paid=buyDown
    for (let m=0;m<Math.min(yrs*12,buyTermMos);m++) {
      const int=balance*(buyRate/100/12), prin=Math.min(monthly-int,balance)
      balance=Math.max(0,balance-prin); paid+=monthly
    }
    return Math.round(paid+annIns*yrs+annMaint*yrs-carValue(yrs))
  }
  function leaseTCO(yrs) {
    const months=yrs*12, comp=Math.floor(months/leaseTerm), rem=months%leaseTerm
    let total=0
    for (let i=0;i<comp;i++) total+=leaseCapRed+leaseMo*leaseTerm+leaseFees
    if (rem>0) total+=leaseCapRed+leaseMo*rem
    return Math.round(total+annIns*yrs)
  }

  const barData = [
    { period:'3 Yrs', Buy:buyTCO(3), Lease:leaseTCO(3) },
    { period:'5 Yrs', Buy:buyTCO(5), Lease:leaseTCO(5) },
    { period:'7 Yrs', Buy:buyTCO(7), Lease:leaseTCO(7) },
    { period:'10 Yrs', Buy:buyTCO(10), Lease:leaseTCO(10) },
  ]
  const tco5buy=buyTCO(5), tco5lease=leaseTCO(5), buyWins5=tco5buy<tco5lease
  const monthlyBuy=calcPMT(buyPrice-buyDown,buyRate,buyTermMos)

  const TABS = [
    { key:'learn', label:'Learn' }, { key:'calc', label:'Calculator' },
    { key:'pros', label:'Pros & Cons' }, { key:'when', label:'When' }, { key:'verdict', label:'Verdict' },
  ]

  return (
    <div style={{ paddingBottom:88 }}>
      <div style={{ padding:'12px 16px 0' }}><BackBtn onBack={onBack} /></div>
      <div style={{ padding:'0 16px 10px' }}>
        <div style={{ fontFamily:DISPLAY, fontSize:20, fontWeight:700, color:C.t1 }}>Buy or Lease a Car</div>
        <div style={{ fontFamily:UI, fontSize:12, color:C.t3, marginTop:2 }}>Total cost of ownership analysis</div>
      </div>
      <TabBar tabs={TABS} active={tab} onChange={setTab} />
      <div style={{ padding:'0 16px' }}>
        {tab === 'learn' && (
          <LearnSection
            title="The Math Behind Buying vs. Leasing"
            intro="Most shoppers compare monthly payments — leases have lower payments because you only pay for the depreciation during the lease period, not the full car. The real question is total cost of ownership."
            points={[
              { label:'Depreciation Curve', body:'New vehicles lose ~15% in year one, 12% in year two, 8–10%/year after. A $40K car is worth ~$21K after 5 years. When you buy, you absorb this loss. Leasing prices it in via residual value.' },
              { label:'Money Factor vs APR', body:'Leases use a "money factor." Convert it by multiplying by 2,400 to get the equivalent APR. A money factor of 0.00250 = 6.0% APR. Always compare apples to apples.' },
              { label:'Total Cost of Ownership', body:'TCO = all payments + down + fees + insurance + maintenance − final vehicle value. Buying wins long-term because once the loan ends, you stop making payments but still own an asset.' },
              { label:'Lease Penalty Costs', body:'Leases charge per-mile overages ($0.15–$0.25/mile), wear-and-tear fees, and a disposition fee at turn-in ($300–$500). These add thousands to actual lease cost.' },
              { label:'Break-Even Horizon', body:'Buying typically becomes cheaper than leasing around year 4–6 — when loan payments end but ownership continues.' },
            ]}
          />
        )}
        {tab === 'calc' && (
          <>
            <MCard>
              <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.gold, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Buy Inputs</div>
              <Slider label="Vehicle Price" value={buyPrice} min={10000} max={120000} step={500} disp={fmt(buyPrice)} onChange={setBuyPrice} accent={C.gold} />
              <Slider label="Down Payment" value={buyDown} min={0} max={20000} step={500} disp={fmt(buyDown)} onChange={setBuyDown} accent={C.gold} />
              <Slider label="Loan Rate" value={buyRate} min={1} max={15} step={0.1} disp={`${buyRate.toFixed(1)}%`} onChange={setBuyRate} accent={C.gold} />
              <Slider label="Loan Term" value={buyTermMos} min={24} max={84} step={12} disp={`${buyTermMos} mos`} onChange={setBuyTermMos} accent={C.gold} />
              <Slider label="Annual Insurance" value={annIns} min={500} max={5000} step={100} disp={fmt(annIns)+'/yr'} onChange={setAnnIns} accent={C.gold} />
              <Slider label="Annual Maintenance" value={annMaint} min={0} max={5000} step={100} disp={fmt(annMaint)+'/yr'} onChange={setAnnMaint} accent={C.gold} />
            </MCard>
            <MCard>
              <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.teal, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Lease Inputs</div>
              <Slider label="Monthly Lease Payment" value={leaseMo} min={150} max={1500} step={10} disp={fmt(leaseMo)+'/mo'} onChange={setLeaseMo} />
              <Slider label="Lease Term" value={leaseTerm} min={24} max={60} step={12} disp={`${leaseTerm} mos`} onChange={setLeaseTerm} />
              <Slider label="Cap Reduction (down)" value={leaseCapRed} min={0} max={10000} step={250} disp={fmt(leaseCapRed)} onChange={setLeaseCapRed} />
              <Slider label="Acquisition Fees" value={leaseFees} min={0} max={2000} step={50} disp={fmt(leaseFees)} onChange={setLeaseFees} />
            </MCard>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8, marginBottom:12 }}>
              <StatRow label="Monthly Buy Payment" value={fmt(monthlyBuy)} accent={C.gold} />
              <StatRow label="Monthly Lease" value={fmt(leaseMo)+'/mo'} accent={C.teal} />
              <StatRow label="Buy TCO (5 yr)" value={fmt(tco5buy)} accent={buyWins5?C.up:C.t2} />
              <StatRow label="Lease TCO (5 yr)" value={fmt(tco5lease)} accent={!buyWins5?C.up:C.t2} />
            </div>
            <MCard>
              <div style={{ fontFamily:UI, fontSize:10, color:C.t3, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Total Cost of Ownership Comparison</div>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={barData} margin={{ top:4, right:8, bottom:0, left:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.b1} />
                  <XAxis dataKey="period" tick={{ fill:C.t3, fontFamily:UI, fontSize:9 }} tickLine={false} />
                  <YAxis tickFormatter={n=>`$${Math.round(n/1000)}k`} tick={{ fill:C.t3, fontFamily:MONO, fontSize:9 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<BTooltip />} />
                  <Legend wrapperStyle={{ fontFamily:UI, fontSize:10 }} />
                  <Bar dataKey="Buy" fill={C.gold} radius={[4,4,0,0]} name="Buy TCO" />
                  <Bar dataKey="Lease" fill={C.teal} radius={[4,4,0,0]} name="Lease TCO" />
                </BarChart>
              </ResponsiveContainer>
            </MCard>
          </>
        )}
        {tab === 'pros' && (
          <ProConList
            buyLabel="Buying" rentLabel="Leasing"
            pros={Object.assign(['Own an asset with residual resale value','No mileage restrictions','Zero monthly payments once loan ends','Freedom to modify or sell at any time'],{_cons:['Higher monthly payments during loan','You absorb full depreciation loss','Maintenance costs increase as vehicle ages']})}
            cons={Object.assign(['Lower monthly payments — pay only for depreciation','New car every 2–3 years with latest features','Maintenance often under warranty','Lower down payment required'],{_cons:['Never own the vehicle — perpetual payments','Mileage limits with costly overages','Locked in — early termination fees are severe']})}
          />
        )}
        {tab === 'when' && (
          <WhenList
            buyLabel="Buying" rentLabel="Leasing"
            buyItems={['You drive 15,000+ miles/year and would exceed lease limits','You plan to keep the vehicle for 6+ years','You want to modify or customize the vehicle','Long-term TCO is your primary decision factor']}
            rentItems={['You prefer a new vehicle every 2–3 years','You drive fewer than 12,000 miles/year','You want lower, predictable monthly payments','Business use with deductible lease payments']}
          />
        )}
        {tab === 'verdict' && (
          <div style={{ background:C.surf, border:`1.5px solid ${buyWins5?C.gold:C.teal}35`, borderRadius:16, padding:'16px' }}>
            <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:buyWins5?C.gold:C.teal, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>5-Year Verdict</div>
            <div style={{ fontFamily:DISPLAY, fontSize:16, fontWeight:700, color:C.t1, marginBottom:8 }}>
              {buyWins5 ? 'Buying has a lower total cost at 5 years' : 'Leasing is cheaper through 5 years'}
            </div>
            <div style={{ fontFamily:UI, fontSize:13, color:C.t2, lineHeight:1.65 }}>
              {buyWins5
                ? `Buying saves ${fmt(tco5lease-tco5buy)} over 5 years when factoring in vehicle residual value.`
                : `Leasing saves ${fmt(tco5buy-tco5lease)} over 5 years. Buying wins around year 4–6 for most people once the loan is paid off.`}
            </div>
          </div>
        )}
        <div style={{ height:20 }} />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   GENERIC TOOL (Equipment, Furniture, Tech, Vacation, Subscribe)
══════════════════════════════════════════════════════════════ */
function GenericTool({ onBack, title, subtitle, learn, sliders, calcFn, prosData, consData, buyLabel='Buying', rentLabel='Renting', whenBuy, whenRent }) {
  const [tab, setTab] = useState('learn')
  const initVals = {}
  sliders.forEach(g => g.rows.forEach(r => { initVals[r.key] = r.default }))
  const [vals, setVals] = useState(initVals)
  const set = key => v => setVals(p=>({...p,[key]:v}))
  const result = useMemo(() => calcFn(vals), [vals])

  const TABS = [
    { key:'learn', label:'Learn' }, { key:'calc', label:'Calculator' },
    { key:'pros', label:'Pros & Cons' }, { key:'when', label:'When' }, { key:'verdict', label:'Verdict' },
  ]

  return (
    <div style={{ paddingBottom:88 }}>
      <div style={{ padding:'12px 16px 0' }}><BackBtn onBack={onBack} /></div>
      <div style={{ padding:'0 16px 10px' }}>
        <div style={{ fontFamily:DISPLAY, fontSize:20, fontWeight:700, color:C.t1 }}>{title}</div>
        <div style={{ fontFamily:UI, fontSize:12, color:C.t3, marginTop:2 }}>{subtitle}</div>
      </div>
      <TabBar tabs={TABS} active={tab} onChange={setTab} />
      <div style={{ padding:'0 16px' }}>
        {tab === 'learn' && <LearnSection title={learn.title} intro={learn.intro} points={learn.points} />}
        {tab === 'calc' && (
          <>
            {sliders.map(g => (
              <MCard key={g.label}>
                <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:g.color||C.teal, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>{g.label}</div>
                {g.rows.map(r => (
                  <Slider key={r.key} label={r.label} value={vals[r.key]} min={r.min} max={r.max} step={r.step}
                    disp={r.fmt ? r.fmt(vals[r.key]) : `${vals[r.key]}${r.unit||''}`}
                    onChange={set(r.key)} accent={g.color||C.teal} />
                ))}
              </MCard>
            ))}
            <div style={{ display:'grid', gridTemplateColumns:`repeat(${result.stats.length},1fr)`, gap:8, marginBottom:12 }}>
              {result.stats.map(s => <StatRow key={s.label} label={s.label} value={s.value} accent={s.accent} />)}
            </div>
            <MCard>
              <div style={{ fontFamily:UI, fontSize:10, color:C.t3, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Cost Comparison Over Time</div>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={result.barData} margin={{ top:4, right:8, bottom:0, left:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.b1} />
                  <XAxis dataKey="period" tick={{ fill:C.t3, fontFamily:UI, fontSize:9 }} tickLine={false} />
                  <YAxis tickFormatter={n=>`$${Math.round(n/1000)}k`} tick={{ fill:C.t3, fontFamily:MONO, fontSize:9 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<BTooltip />} />
                  <Legend wrapperStyle={{ fontFamily:UI, fontSize:10 }} />
                  <Bar dataKey="Buy" fill={C.gold} radius={[4,4,0,0]} name={buyLabel} />
                  <Bar dataKey="Rent" fill={C.teal} radius={[4,4,0,0]} name={rentLabel} />
                </BarChart>
              </ResponsiveContainer>
            </MCard>
          </>
        )}
        {tab === 'pros' && <ProConList buyLabel={buyLabel} rentLabel={rentLabel} pros={prosData} cons={consData} />}
        {tab === 'when' && <WhenList buyLabel={buyLabel} rentLabel={rentLabel} buyItems={whenBuy} rentItems={whenRent} />}
        {tab === 'verdict' && (
          <div style={{ background:C.surf, border:`1.5px solid ${result.buyWins?C.gold:C.teal}35`, borderRadius:16, padding:'16px' }}>
            <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:result.buyWins?C.gold:C.teal, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>Personalized Verdict</div>
            <div style={{ fontFamily:DISPLAY, fontSize:16, fontWeight:700, color:C.t1, marginBottom:8 }}>
              {result.buyWins ? `${buyLabel} is the stronger financial choice` : `${rentLabel} wins with your current inputs`}
            </div>
            <div style={{ fontFamily:UI, fontSize:13, color:C.t2, lineHeight:1.65 }}>{result.verdictText}</div>
            {result.disclaimer && <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.6, marginTop:12, padding:'10px 12px', background:C.raise, borderRadius:8 }}>{result.disclaimer}</div>}
          </div>
        )}
        <div style={{ height:20 }} />
      </div>
    </div>
  )
}

/* ── Equipment ──────────────────────────────────────────── */
function EquipmentTool({ onBack }) {
  return (
    <GenericTool onBack={onBack} title="Buy or Rent Equipment" subtitle="Usage-based break-even analysis" buyLabel="Buy" rentLabel="Rent"
      learn={{ title:'When to Buy vs Rent Equipment', intro:'For business owners, contractors, and professionals — the break-even analysis is straightforward: divide purchase price by annual rental cost. If you will rent it for more than its purchase price over its useful life, buying wins.',
        points:[
          { label:'Usage-Based Decision', body:'Calculate: Purchase Price ÷ (Daily Rental × Days/Year). Above that threshold, buying is almost always cheaper.' },
          { label:'Residual Value', body:'Well-maintained equipment often retains 20–40% of its value. Account for resale when calculating total ownership cost.' },
          { label:'Storage & Insurance', body:'Owned equipment requires storage space and insurance. Rentals include these costs in the rate.' },
          { label:'Technology Obsolescence', body:'For fast-evolving tech equipment, renting provides access to current models. For hand tools, obsolescence is rarely a concern.' },
        ]}}
      sliders={[
        { label:'Purchase Inputs', color:C.gold, rows:[
          { key:'purchasePrice', label:'Purchase Price', min:500, max:100000, step:500, default:8000, fmt },
          { key:'annualMaintenance', label:'Annual Maintenance', min:0, max:5000, step:100, default:400, fmt },
          { key:'residualPct', label:'Residual Value at End', min:0, max:60, step:5, default:20, unit:'%' },
        ]},
        { label:'Rental Inputs', color:C.teal, rows:[
          { key:'dailyRentalRate', label:'Daily Rental Rate', min:20, max:1500, step:10, default:120, fmt },
          { key:'daysPerYear', label:'Days Used Per Year', min:1, max:365, step:1, default:30, unit:' days' },
          { key:'rentalDelivery', label:'Monthly Delivery/Pickup Fee', min:0, max:500, step:10, default:80, fmt },
        ]},
      ]}
      calcFn={v => {
        const resid = v.purchasePrice * v.residualPct / 100
        const barData = [1,3,5,10].map(yrs=>({ period:`${yrs} Yr${yrs>1?'s':''}`,
          Buy: Math.round(v.purchasePrice+v.annualMaintenance*yrs-resid),
          Rent: Math.round((v.dailyRentalRate*v.daysPerYear+v.rentalDelivery*12)*yrs) }))
        const buy3=barData[1].Buy, rent3=barData[1].Rent, buy5=barData[2].Buy, rent5=barData[2].Rent
        const breakEven = v.purchasePrice / (v.dailyRentalRate*v.daysPerYear+v.rentalDelivery*12-v.annualMaintenance)
        return {
          barData, buyWins: buy5<rent5,
          stats:[
            { label:'3-Year Buy Cost', value:fmt(buy3), accent:buy3<rent3?C.up:C.t2 },
            { label:'3-Year Rent Cost', value:fmt(rent3), accent:rent3<buy3?C.up:C.t2 },
            { label:'Break-Even', value:breakEven>0?`Yr ${breakEven.toFixed(1)}`:'Never', accent:C.teal },
          ],
          verdictText: buy5<rent5
            ? `Purchasing costs ${fmt(buy5)} over 5 years vs. ${fmt(rent5)} in rental fees, saving ${fmt(rent5-buy5)}. Break-even at year ${breakEven.toFixed(1)}.`
            : `Renting saves ${fmt(buy5-rent5)} over 5 years at your usage rate of ${v.daysPerYear} days/year. Increase usage to shift this calculation.`,
          disclaimer:'Does not include financing costs if purchased on credit.',
        }
      }}
      prosData={Object.assign(['Own the asset — resale value recovers capital','Available immediately without scheduling','Customize for your specific needs','Tax deduction via Section 179 expensing'],{_cons:['High upfront capital','Responsible for all maintenance','Obsolete equipment can be hard to sell']})}
      consData={Object.assign(['No capital tied up in idle equipment','Always get current, maintained models','No storage or insurance overhead','Scale up or down with project demand'],{_cons:['Ongoing cost that never stops','Scheduling conflicts during peak seasons','Delivery fees add up']})}
      whenBuy={['You use equipment more than 30 days per year','Rental market in your area is constrained','You need immediate 24/7 availability','Section 179 deduction makes first-year cost tax-efficient']}
      whenRent={['Usage is seasonal or under 20 days/year','Specialized equipment for a one-time project','Capital preservation is critical','Equipment evolves rapidly and current models matter']}
    />
  )
}

/* ── Furniture ──────────────────────────────────────────── */
function FurnitureTool({ onBack }) {
  return (
    <GenericTool onBack={onBack} title="Buy or Rent Furniture" subtitle="Home & office furnishings decision" buyLabel="Buy" rentLabel="Rent"
      learn={{ title:'Furniture: Own It or Rent It?', intro:'Furniture rental is most popular with people in transition — new graduates, corporate relocations, staged homes. The math almost always favors buying for stays longer than 18 months.',
        points:[
          { label:'Quality Retention', body:'Well-made furniture (solid wood, quality upholstery) retains 40–70% of purchase price when resold. Flat-pack furniture depreciates much faster.' },
          { label:'Break-Even Month', body:'Simply divide purchase price by monthly rental rate. If your tenancy ends before that month, renting may have been cheaper.' },
          { label:'Corporate Relocation', body:'Many companies reimburse furniture rental for relocations. Check your package before committing to purchase.' },
          { label:'Flexibility Premium', body:'Rental includes delivery, setup, and pickup. If you move frequently, this convenience has real value beyond the dollar comparison.' },
        ]}}
      sliders={[
        { label:'Purchase Inputs', color:C.gold, rows:[
          { key:'purchasePrice', label:'Total Purchase Price', min:500, max:25000, step:250, default:3500, fmt },
          { key:'qualityRetentionPct', label:'Resale Value Retention', min:10, max:80, step:5, default:60, unit:'%' },
        ]},
        { label:'Rental Inputs', color:C.teal, rows:[
          { key:'monthlyRental', label:'Monthly Rental Cost', min:50, max:1500, step:25, default:180, fmt },
          { key:'rentalTermMonths', label:'Expected Stay (months)', min:1, max:60, step:1, default:24, unit:' mos' },
          { key:'deliverySetup', label:'Delivery & Setup Fee', min:0, max:500, step:25, default:150, fmt },
        ]},
      ]}
      calcFn={v => {
        const periods = [{ period:'1 Yr', mos:12 },{ period:'2 Yrs', mos:24 },{ period:'3 Yrs', mos:36 },{ period:'5 Yrs', mos:60 }]
        const barData = periods.map(p => ({
          period: p.period,
          Buy: Math.round(v.purchasePrice - v.purchasePrice*v.qualityRetentionPct/100*(p.mos/60)),
          Rent: Math.round(v.monthlyRental*p.mos + v.deliverySetup),
        }))
        const buy3=barData[2].Buy, rent3=barData[2].Rent, buy5=barData[3].Buy, rent5=barData[3].Rent
        const breakEvenMos = Math.ceil(v.purchasePrice/v.monthlyRental)
        return {
          barData, buyWins: buy5<rent5,
          stats:[
            { label:'3-Year Buy Cost', value:fmt(buy3), accent:buy3<rent3?C.up:C.t2 },
            { label:'3-Year Rent Cost', value:fmt(rent3), accent:rent3<buy3?C.up:C.t2 },
            { label:'Break-Even Month', value:`Mo ${breakEvenMos}`, accent:C.teal },
          ],
          verdictText: buy5<rent5
            ? `Buying furniture saves ${fmt(rent5-buy5)} over 5 years. Quality furniture retaining ${v.qualityRetentionPct}% value beats perpetual payments. Break-even is month ${breakEvenMos}.`
            : `At ${fmt(v.monthlyRental)}/month, renting saves ${fmt(buy5-rent5)} over 5 years — likely because you're renting short-term where the purchase price hasn't been recovered.`,
          disclaimer:'Resale value assumes quality, well-maintained furniture sold via marketplace.',
        }
      }}
      prosData={Object.assign(['Own an asset you can resell or move with you','One-time cost — no ongoing payments','Choose exactly what you want','Pride of ownership'],{_cons:['Moving costs money when you relocate','Risk of buying wrong item for a space','Storage costs if between homes']})}
      consData={Object.assign(['No upfront capital required','Move out with zero effort — company handles everything','Ideal for stays under 18 months','No concern about damage beyond normal wear'],{_cons:['More expensive per month than equivalent purchase','Limited selection vs. retail','No ownership or residual value']})}
      whenBuy={['You are staying in one place for 18+ months','You have storage or are moving to a permanent home','You want quality pieces that last 10+ years','Resale value of quality furniture matters to you']}
      whenRent={['Corporate relocation or short assignment under 12 months','Staging a home for sale','Just moved to a new city and haven\'t settled','Company is paying through relocation package']}
    />
  )
}

/* ── Tools & Heavy Equipment ────────────────────────────── */
function HeavyToolsTool({ onBack }) {
  return (
    <GenericTool onBack={onBack} title="Tools & Heavy Equipment" subtitle="Buy vs. lease vs. rent — three-way comparison" buyLabel="Buy" rentLabel="Lease/Rent"
      learn={{ title:'Three Ways to Acquire Heavy Equipment', intro:'For contractors, farmers, and businesses managing capital equipment — the choice between buying, leasing, and renting is a core financial decision. Each option suits different usage patterns and cash flow needs.',
        points:[
          { label:'Buying', body:'Best for high-utilization, long-life equipment. Section 179 allows full expensing in year one. Ownership means full flexibility, but you absorb depreciation and must manage maintenance.' },
          { label:'Leasing', body:'Keeps equipment off your balance sheet, preserves credit lines, and often includes maintenance. Best for equipment that needs regular upgrading.' },
          { label:'Renting', body:'Lowest commitment — ideal for project-based or seasonal use. No capital required, no maintenance overhead. Most expensive per day, but cheapest total if infrequent.' },
          { label:'Break-Even Usage', body:'Calculate annual usage days where rental cost equals purchase price divided by useful life in years. Below that threshold, renting is cheaper.' },
        ]}}
      sliders={[
        { label:'Buy Inputs', color:C.gold, rows:[
          { key:'purchasePrice', label:'Purchase Price', min:5000, max:500000, step:2500, default:25000, fmt },
          { key:'annualMaintenance', label:'Annual Maintenance', min:0, max:20000, step:250, default:1200, fmt },
          { key:'storageCost', label:'Monthly Storage/Insurance', min:0, max:1000, step:25, default:150, fmt },
          { key:'residualPct', label:'Residual Value (%)', min:0, max:70, step:5, default:35, unit:'%' },
        ]},
        { label:'Lease Inputs', color:C.teal, rows:[
          { key:'monthlyLease', label:'Monthly Lease Payment', min:100, max:10000, step:50, default:600, fmt },
        ]},
        { label:'Rent Inputs', color:C.t2, rows:[
          { key:'dailyRent', label:'Daily Rental Rate', min:50, max:3000, step:25, default:250, fmt },
          { key:'daysPerYear', label:'Days Used Per Year', min:1, max:365, step:5, default:40, unit:' days' },
        ]},
      ]}
      calcFn={v => {
        const buy5 = Math.round(v.purchasePrice+(v.annualMaintenance+v.storageCost*12)*5-v.purchasePrice*v.residualPct/100)
        const lease5 = Math.round(v.monthlyLease*12*5)
        const rent5 = Math.round(v.dailyRent*v.daysPerYear*5)
        const winner = Math.min(buy5,lease5,rent5)
        const barData = [1,3,5].map(yrs=>({
          period:`${yrs} Yr${yrs>1?'s':''}`,
          Buy: Math.round(v.purchasePrice+(v.annualMaintenance+v.storageCost*12)*yrs-v.purchasePrice*v.residualPct/100),
          Rent: Math.min(Math.round(v.monthlyLease*12*yrs), Math.round(v.dailyRent*v.daysPerYear*yrs)),
        }))
        return {
          barData, buyWins: winner===buy5,
          stats:[
            { label:'5-Yr Buy Cost', value:fmt(buy5), accent:winner===buy5?C.up:C.t2 },
            { label:'5-Yr Lease Cost', value:fmt(lease5), accent:winner===lease5?C.up:C.t2 },
            { label:'5-Yr Rent Cost', value:fmt(rent5), accent:winner===rent5?C.up:C.t2 },
          ],
          verdictText: winner===buy5
            ? `Purchasing is cheapest over 5 years at ${fmt(buy5)}, saving ${fmt(Math.min(lease5,rent5)-buy5)} versus your next best option.`
            : winner===lease5
            ? `Leasing at ${fmt(v.monthlyLease)}/month is cheapest over 5 years at ${fmt(lease5)}, especially if maintenance is included.`
            : `Renting at ${v.daysPerYear} days/year costs ${fmt(rent5)} over 5 years — most economical at your usage level. Increase usage to make buying attractive.`,
          disclaimer: null,
        }
      }}
      prosData={Object.assign(['Full ownership — modify, customize, or sell at will','Section 179 and bonus depreciation tax advantages','Available 24/7 without scheduling','Long-term cheapest for high-utilization equipment'],{_cons:['Large upfront capital requirement','Responsible for all maintenance, repairs, storage','Obsolete equipment ties up capital']})}
      consData={Object.assign(['No capital tied up — preserve liquidity','Always access current, maintained equipment','No storage, insurance, or residual value risk','Scale fleet up or down by project demand'],{_cons:['Rental is most expensive per day','Scheduling conflicts during peak season','Lease: locked in whether you use it or not']})}
      whenBuy={['You use equipment 150+ days per year','Long useful life (10+ years) with manageable maintenance','You need 24/7 availability and custom configuration','Section 179 expensing is significant for your business']}
      whenRent={['Usage is under 60 days/year (rent daily)','Project-based work with no ongoing equipment need','Capital preservation and cash flow are top priority (lease)','Equipment needs to be current model — lease for regular upgrades']}
    />
  )
}

/* ── Tech ───────────────────────────────────────────────── */
function TechTool({ onBack }) {
  return (
    <GenericTool onBack={onBack} title="Buy or Subscribe to Tech" subtitle="Hardware & software acquisition analysis" buyLabel="Buy" rentLabel="Subscribe"
      learn={{ title:'Ownership vs. Subscription in the Digital Age', intro:'The shift to subscription software has made this one of the most relevant financial decisions of the decade. Subscriptions offer lower upfront cost and flexibility — but they never end. Ownership has a defined payoff point.',
        points:[
          { label:'Break-Even Calculation', body:'Divide upfront purchase price by monthly subscription cost. That is your break-even month. Before that month, subscribing has cost less cumulative total.' },
          { label:'Upgrade Cycle Reality', body:'Technology is not "owned forever." Laptops need replacement every 3–5 years. Software purchased outright often lacks updates after a few years. Factor in upgrade costs honestly.' },
          { label:'Subscription Price Creep', body:'Subscription prices rarely stay flat. A 5% annual increase on $100/month becomes $162/month in 10 years. Model this realistically.' },
          { label:'Bundle Value', body:'Many subscriptions bundle multiple services. Compare the full bundle to equivalent purchased software — not just the headline app.' },
        ]}}
      sliders={[
        { label:'Buy Inputs', color:C.gold, rows:[
          { key:'upfrontCost', label:'Upfront Purchase Cost', min:100, max:10000, step:100, default:2500, fmt },
          { key:'annualUpgrade', label:'Annual Upgrade Budget', min:0, max:2000, step:50, default:600, fmt },
          { key:'usefulLifeYears', label:'Useful Life Before Replacement', min:1, max:10, step:1, default:4, unit:' yrs' },
          { key:'residualPct', label:'Resale Value at End of Life', min:0, max:50, step:5, default:15, unit:'%' },
        ]},
        { label:'Subscribe Inputs', color:C.teal, rows:[
          { key:'monthlySubscription', label:'Monthly Subscription Cost', min:5, max:500, step:5, default:85, fmt },
          { key:'annualPriceIncrease', label:'Annual Price Increase', min:0, max:15, step:0.5, default:5, unit:'%' },
        ]},
      ]}
      calcFn={v => {
        function buyCost(yrs) {
          const replacements = Math.floor(yrs/v.usefulLifeYears)
          let total = v.upfrontCost + v.annualUpgrade*yrs + replacements*v.upfrontCost
          total -= v.upfrontCost*v.residualPct/100
          return Math.round(total)
        }
        function subCost(yrs) {
          let total=0, monthly=v.monthlySubscription
          for (let y=0;y<yrs;y++) { total+=monthly*12; monthly*=(1+v.annualPriceIncrease/100) }
          return Math.round(total)
        }
        const barData = [1,3,5,10].map(yrs=>({ period:`${yrs} Yr${yrs>1?'s':''}`, Buy:buyCost(yrs), Rent:subCost(yrs) }))
        const buy5=buyCost(5), sub5=subCost(5)
        const breakEvenMos = Math.ceil(v.upfrontCost/v.monthlySubscription)
        return {
          barData, buyWins: buy5<sub5,
          stats:[
            { label:'5-Year Buy Cost', value:fmt(buy5), accent:buy5<sub5?C.up:C.t2 },
            { label:'5-Year Sub Cost', value:fmt(sub5), accent:sub5<buy5?C.up:C.t2 },
            { label:'Break-Even Month', value:`Mo ${breakEvenMos}`, accent:C.teal },
          ],
          verdictText: buy5<sub5
            ? `Buying costs ${fmt(buy5)} over 5 years vs. ${fmt(sub5)} subscribing — savings of ${fmt(sub5-buy5)}. Purchase pays for itself by month ${breakEvenMos}.`
            : `Subscribing at ${fmt(v.monthlySubscription)}/month saves ${fmt(buy5-sub5)} over 5 years. However, if prices increase ${v.annualPriceIncrease}%/year, the long-term gap reverses.`,
          disclaimer:'Subscription analysis includes compounding annual price increases. Buy analysis includes periodic upgrades.',
        }
      }}
      prosData={Object.assign(['Fixed cost — no ongoing payments after purchase','Works offline without internet dependency','Data privacy — no vendor lock-in','One-time expensing for business'],{_cons:['Higher upfront cost','You manage your own updates','Technology becomes outdated']})}
      consData={Object.assign(['Always on the latest version','Lower upfront cost — accessible immediately','Cancel anytime without a stranded asset','Support and cloud backup often included'],{_cons:['Perpetual payments — you never own anything','Price increases beyond your control','Cancel and lose all access immediately']})}
      whenBuy={['You use the software or hardware for 5+ years','Offline access and data privacy are important','You are price-sensitive to subscription increases','Business expensing or depreciation provides significant tax benefit']}
      whenRent={['You need the latest features and automatic updates','Upfront cost is a barrier','Team collaboration where licenses simplify access','You are uncertain about long-term need — test before committing']}
    />
  )
}

/* ── Vacation Property ──────────────────────────────────── */
function VacationTool({ onBack }) {
  return (
    <GenericTool onBack={onBack} title="Vacation Property" subtitle="Buy vs. booking vacation rentals" buyLabel="Buy" rentLabel="Book Vacations"
      learn={{ title:'Vacation Home Ownership: The Full Picture', intro:'A vacation home can generate rental income when you are not using it, which dramatically changes the financial analysis. The key metrics are net cost after rental income, personal use nights, and market appreciation.',
        points:[
          { label:'Net Cost After Rental Income', body:'If you rent the property when not using it, rental income offsets ownership costs. In popular markets, a well-priced vacation rental generates $20,000–$60,000/year.' },
          { label:'The Augusta Rule', body:'The IRS allows rental income to be tax-free if you rent for 14 days or fewer per year. Many vacation homeowners use exactly this strategy.' },
          { label:'Personal Use Limit', body:'To qualify for rental deductions, personal use cannot exceed 14 days or 10% of rental days — whichever is greater. Exceeding this converts it to a personal residence for tax purposes.' },
          { label:'Market Selection', body:'Location drives appreciation and rental demand. A beachfront property in a constrained coastal market has very different economics from a mountain cabin 3 hours from a city.' },
        ]}}
      sliders={[
        { label:'Property Inputs', color:C.gold, rows:[
          { key:'propPrice', label:'Property Price', min:100000, max:2000000, step:10000, default:350000, fmt },
          { key:'dpPct', label:'Down Payment', min:10, max:40, step:5, default:20, unit:'%' },
          { key:'mortgageRate', label:'Mortgage Rate', min:3, max:12, step:0.1, default:7, unit:'%' },
          { key:'hoaMonthly', label:'HOA Monthly', min:0, max:2000, step:25, default:300, fmt },
          { key:'maintenancePct', label:'Annual Maintenance %', min:0.5, max:4, step:0.25, default:1.5, unit:'%' },
        ]},
        { label:'Rental Income', color:C.up, rows:[
          { key:'rentalNightlyIncome', label:'Nightly Rental Rate', min:50, max:2000, step:25, default:200, fmt },
          { key:'rentalNightsPerYear', label:'Rental Nights Per Year', min:0, max:300, step:5, default:90, unit:' nights' },
        ]},
        { label:'Vacation Booking Comparison', color:C.teal, rows:[
          { key:'vacNightlyRate', label:'Nightly Rate (booking)', min:50, max:2000, step:25, default:180, fmt },
          { key:'vacNightsPerYear', label:'Nights Vacationed/Year', min:5, max:120, step:5, default:30, unit:' nights' },
        ]},
      ]}
      calcFn={v => {
        const dp=v.propPrice*v.dpPct/100
        const principal=v.propPrice-dp
        const monthlyMortgage=calcPMT(principal,v.mortgageRate,360)
        const annualRentalIncome=v.rentalNightlyIncome*v.rentalNightsPerYear
        const netAnnualOwn=monthlyMortgage*12+v.propPrice*0.012+v.hoaMonthly*12+v.propPrice*v.maintenancePct/100-annualRentalIncome
        const annualVacRent=v.vacNightlyRate*v.vacNightsPerYear
        const barData=[1,3,5,10].map(yrs=>({
          period:`${yrs} Yr${yrs>1?'s':''}`,
          Buy: Math.round(netAnnualOwn*yrs+dp),
          Rent: Math.round(annualVacRent*yrs),
        }))
        const buy5=barData[2].Buy, rent5=barData[2].Rent
        return {
          barData, buyWins: buy5<rent5,
          stats:[
            { label:'Net Monthly Own Cost', value:fmt(netAnnualOwn/12), accent:C.gold },
            { label:'Annual Vacation Cost', value:fmt(annualVacRent), accent:C.teal },
            { label:'Annual Rental Income', value:fmt(annualRentalIncome), accent:C.up },
          ],
          verdictText: buy5<rent5
            ? `After rental income of ${fmt(annualRentalIncome)}/year, net annual ownership cost is ${fmt(netAnnualOwn)}. Over 5 years this is ${fmt(buy5)} vs. ${fmt(rent5)} just booking — owning wins financially and you build equity.`
            : `Net annual ownership cost is ${fmt(netAnnualOwn)} — more than booking ${v.vacNightsPerYear} nights at ${fmt(v.vacNightlyRate)}/night. Increase rental nights or raise the nightly rate to improve the math.`,
          disclaimer:'Does not include federal/state income tax on rental income. Rental income may be tax-free up to 14 days/year under the Augusta Rule. Consult a tax advisor.',
        }
      }}
      prosData={Object.assign(['Build equity in a desirable real estate market','Rental income offsets ownership costs significantly','Your vacation is always available — no booking uncertainty','Appreciation potential in sought-after markets'],{_cons:['Large down payment (typically 20–25%)','Property management is time-consuming','Seasonal markets mean lumpy rental income']})}
      consData={Object.assign(['No down payment or mortgage commitment','Vacation anywhere — total flexibility each year','No maintenance headaches or HOA drama','No exposure to local market downturns'],{_cons:['No equity built from vacation spending','Prime properties sell out at peak times','Prices increase during school breaks and holidays']})}
      whenBuy={['Your vacation destination is consistent and you go 30+ nights/year','Strong short-term rental market can offset majority of ownership costs','You want a legacy property to pass to family','Market fundamentals favor appreciation']}
      whenRent={['You vacation in different places each year','Capital would work harder in other investments','You want zero property management responsibility','Vacation frequency is low or unpredictable']}
    />
  )
}

/* ── Subscribe ──────────────────────────────────────────── */
function SubscribeTool({ onBack }) {
  return (
    <GenericTool onBack={onBack} title="Buy Once vs Subscribe" subtitle="Universal ownership vs. subscription calculator" buyLabel="Buy" rentLabel="Subscribe"
      learn={{ title:'The Subscription Economy: Do the Math', intro:'The subscription model converts large one-time purchases into perpetual monthly revenue. For consumers, subscriptions offer low-friction access — but over time they often cost far more than ownership. This calculator works for any product.',
        points:[
          { label:'The Break-Even Formula', body:'Break-even month = Purchase Price ÷ Monthly Fee. Before that month, subscribing has cost less. After it, buying is the better financial choice.' },
          { label:'Price Creep', body:'Subscription prices rarely stay flat. Netflix, Spotify, and most SaaS have increased prices 40–80% over 5 years. Model realistic annual increases.' },
          { label:'Depreciation Reality', body:'Owned products depreciate, but many retain meaningful value for years. A $500 product retaining 50% value after 5 years effectively costs you only $250.' },
          { label:'Accumulation Effect', body:'The average American subscribes to 12+ services. Even modest subscriptions ($10–$30/month each) accumulate to $1,500–$4,000/year. Audit annually.' },
        ]}}
      sliders={[
        { label:'Buy Inputs', color:C.gold, rows:[
          { key:'purchasePrice', label:'Purchase Price', min:10, max:5000, step:10, default:500, fmt },
          { key:'depreciationPct', label:'Annual Depreciation Rate', min:0, max:60, step:5, default:20, unit:'%' },
          { key:'yearsToReplace', label:'Years Until Replacement', min:1, max:15, step:1, default:5, unit:' yrs' },
        ]},
        { label:'Subscribe Inputs', color:C.teal, rows:[
          { key:'monthlyFee', label:'Monthly Fee', min:1, max:500, step:1, default:30, fmt },
          { key:'annualIncrease', label:'Annual Price Increase', min:0, max:20, step:0.5, default:4, unit:'%' },
        ]},
      ]}
      calcFn={v => {
        function buyCost(yrs) {
          const replacements=Math.floor(yrs/v.yearsToReplace)
          const totalPurchases=(replacements+1)*v.purchasePrice
          const finalDep=v.purchasePrice*Math.pow(1-v.depreciationPct/100, yrs%v.yearsToReplace||v.yearsToReplace)
          return Math.round(totalPurchases-finalDep)
        }
        function subCost(yrs) {
          let total=0, mo=v.monthlyFee
          for (let y=0;y<yrs;y++) { total+=mo*12; mo*=(1+v.annualIncrease/100) }
          return Math.round(total)
        }
        const breakEvenMos=Math.ceil(v.purchasePrice/v.monthlyFee)
        const barData=[1,2,3,5,10].map(yrs=>({ period:`${yrs}yr`, Buy:buyCost(yrs), Rent:subCost(yrs) }))
        const buy5=buyCost(5), sub5=subCost(5)
        return {
          barData, buyWins: buy5<sub5,
          stats:[
            { label:'Break-Even Month', value:`Month ${breakEvenMos}`, accent:C.teal },
            { label:'5-Yr Buy Cost', value:fmt(buy5), accent:buy5<sub5?C.up:C.t2 },
            { label:'5-Yr Sub Cost', value:fmt(sub5), accent:sub5<buy5?C.up:C.t2 },
          ],
          verdictText: buy5<sub5
            ? `Buying outright costs ${fmt(buy5)} over 5 years vs. ${fmt(sub5)} subscribing — saving ${fmt(sub5-buy5)}. Your break-even is month ${breakEvenMos}.`
            : `Subscribing at ${fmt(v.monthlyFee)}/month costs ${fmt(sub5)} over 5 years vs. ${fmt(buy5)} buying — saving ${fmt(buy5-sub5)}. This advantage shrinks as subscription prices increase ${v.annualIncrease}%/year.`,
          disclaimer: null,
        }
      }}
      prosData={Object.assign(['Defined cost — no ongoing payments','Works offline without internet or vendor','Resale value recovers a portion of cost','No forced upgrades or feature deprecation'],{_cons:['Higher upfront cost','Stuck with same version until you pay to upgrade','No cross-device cloud sync in some products']})}
      consData={Object.assign(['Low barrier — start immediately for a few dollars','Automatic updates and new features included','Cancel anytime — no stranded asset','Support often included'],{_cons:['Perpetual cost that never ends','Price increases compound over time','Cancel and lose all access immediately']})}
      whenBuy={['You use the product consistently for 2+ years','Break-even month is within 18 months','Offline access or data ownership matters','You are consolidating and cutting recurring expenses']}
      whenRent={['You only need it temporarily','Upfront cost is a real barrier right now','Latest features and version matter critically','You are unsure about long-term use — test before committing']}
    />
  )
}

/* ═══════════════════════════════════════════════════════════
   RECREATIONAL TOOL
══════════════════════════════════════════════════════════════ */
const RECR_ITEMS = [
  { id:'boat', emoji:'⛵', label:'Powerboat',
    defaults:{ purchasePrice:45000,downPct:20,loanRate:7.5,loanYears:10,annIns:2200,annMaint:1800,storageMo:200,fuelAnnual:1200,regAnnual:350,depRate:12,daysPerYear:25,dailyRental:400 },
    learn:{ title:'The True Cost of Boat Ownership', intro:'The marine industry joke: "The two happiest days of a boat owner\'s life are the day they buy the boat and the day they sell it." That\'s only funny if you haven\'t modeled the real numbers first.',
      points:[
        { label:'The 10% Rule', body:'Budget 10% of the boat\'s purchase price per year for ongoing costs. On a $45,000 boat, that\'s $4,500/year — before fuel and loan payments.' },
        { label:'Depreciation Curve', body:'Powerboats depreciate 15–20% in year one, then 8–12% annually. After 10 years, a $45,000 boat may be worth $12,000–$16,000. Engine hours drive value more than age alone.' },
        { label:'Storage Costs', body:'Wet slip marina storage runs $200–$800/month depending on location. Dry storage is cheaper but adds launch logistics.' },
        { label:'Fuel Reality', body:'A 200-hp sterndrive at cruise burns 10–14 GPH. At $4.50/gallon, a full day easily costs $180–$280 in fuel alone.' },
        { label:'Insurance', body:'Marine insurance typically runs 1.5–2.5% of boat value annually. Factor in liability, towing, and personal property coverage.' },
      ]},
    pros:['Your schedule — launch whenever you want','Customize and personalize — truly yours','Host friends and family — social asset','Freedom to explore beyond rental fleet routes'],
    cons:['No storage, maintenance, or winterization hassle','Rent different boat types for different activities','Zero depreciation exposure','Charter services include captain, fuel, and insurance'],
    whenBuy:['You use a boat 30+ days/year and rental costs exceed $10,000/year','You have secure, affordable storage nearby','You\'re experienced and can perform basic maintenance','Supports a lifestyle central to your identity'],
    whenRent:['Usage under 15 days/year — rental almost always wins','You want to use different boats for different activities','Storage in your area is expensive or unavailable','You\'re new to boating — rent to find what you like first'],
  },
  { id:'rv', emoji:'🚐', label:'RV / Motor Home',
    defaults:{ purchasePrice:120000,downPct:20,loanRate:7.5,loanYears:15,annIns:3200,annMaint:3500,storageMo:180,fuelAnnual:2400,regAnnual:800,depRate:10,daysPerYear:30,dailyRental:250 },
    learn:{ title:'The Full Picture on RV Ownership', intro:'RVs combine the complexity of a vehicle with the maintenance demands of a home — on wheels. They offer extraordinary freedom, but carry substantial ongoing costs that catch many buyers off guard.',
      points:[
        { label:'Depreciation Pattern', body:'Class A motor homes depreciate 20–25% the first year and 10% annually after. Fifth wheels hold value better. After 5 years, expect 45–55% original value retained.' },
        { label:'Fuel Cost Reality', body:'Class A diesel pushers get 6–10 MPG. At $4.50/gallon, a 200-mile day costs $90–$150 in fuel. A 4,000-mile trip fuel bill alone can be $1,800–$3,000.' },
        { label:'Storage When Not in Use', body:'Most HOAs prohibit RV storage on residential property. Self-storage runs $100–$300/month. This is a major recurring fixed cost even when you\'re not traveling.' },
        { label:'Rental Income Option', body:'Platforms like Outdoorsy and RVshare let you rent your RV. Earning $100–$250/night for 40+ nights/year can meaningfully offset ownership costs.' },
      ]},
    pros:['Travel on your own schedule','Home comforts anywhere — your bed, kitchen, setup','Offset costs via peer-to-peer rental platforms','Total freedom for extended trips or full-time living'],
    cons:['No depreciation, insurance, storage, or maintenance','Rent exactly the size you need for each trip','Try full-timing before committing to ownership','Ideal for occasional travel — 1–3 trips/year'],
    whenBuy:['You travel 45+ nights per year by RV','You plan to keep it for 10+ years','You have an affordable storage solution','Full-time or seasonal living is the goal'],
    whenRent:['Fewer than 20 nights/year — rental economics win clearly','You want to try RVing before major financial commitment','Different trips require different unit sizes','No storage solution available near your home'],
  },
  { id:'motorcycle', emoji:'🏍', label:'Motorcycle',
    defaults:{ purchasePrice:12000,downPct:20,loanRate:7.5,loanYears:5,annIns:900,annMaint:600,storageMo:40,fuelAnnual:700,regAnnual:200,depRate:12,daysPerYear:60,dailyRental:120 },
    learn:{ title:'Motorcycle Ownership Economics', intro:'Motorcycles are one of the more financially efficient recreational vehicles — high usage days, excellent fuel economy, and lower storage/insurance costs than other recreational assets.',
      points:[
        { label:'Commuter vs Recreation', body:'Motorcycles used for commuting can log 5,000–15,000 miles/year with significantly better economics than cars. A recreational-only bike at 1,500 miles/year looks very different on paper.' },
        { label:'License Requirements', body:'A motorcycle endorsement (M class) is required in all states. MSF Basic RiderCourse costs $250–$350. Factor gear costs: helmet ($200–$800), jacket, gloves, boots.' },
        { label:'Depreciation Pattern', body:'Sport bikes depreciate 12–18%/year. Cruisers and tourers hold value better — a well-maintained Harley can retain 60–70% after 5 years.' },
        { label:'Insurance Variance', body:'Sport bikes for riders under 30 can run $1,500–$2,500/year. Cruisers for experienced riders average $500–$1,200/year.' },
      ]},
    pros:['Excellent fuel economy — 40–65 MPG','Lower insurance and operating cost at high usage','Commuting viability — reduces car wear','Community and lifestyle — rallies, clubs, group rides'],
    cons:['No license required for many rental programs','Rent exactly the style for each trip','Ideal for vacation destination riding','No storage, seasonal prep, or maintenance overhead'],
    whenBuy:['You have your M endorsement and genuine experience','You plan to ride 40+ days/year or use as commuter','You have secure storage at home or work','You live in a year-round or long-season riding climate'],
    whenRent:['You want to try riding before committing to license and ownership','Vacation or destination riding only — 1–3 trips/year','No secure storage available','You\'re early in learning — rental schools offer training bikes'],
  },
  { id:'pwc', emoji:'🌊', label:'Jet Ski / PWC',
    defaults:{ purchasePrice:12000,downPct:20,loanRate:8.0,loanYears:5,annIns:700,annMaint:600,storageMo:80,fuelAnnual:500,regAnnual:100,depRate:14,daysPerYear:20,dailyRental:180 },
    learn:{ title:'Jet Ski & PWC Ownership', intro:'Personal watercraft (PWC) — Jet Skis, WaveRunners, Sea-Doos — are high-fun, high-depreciation assets with significant seasonal limitations. They\'re also among the easiest recreational items to rent at marinas.',
      points:[
        { label:'Rapid Depreciation', body:'PWC depreciate 14–18% in year one, then 10–12% annually. Supercharged models depreciate faster due to engine wear concerns.' },
        { label:'Seasonal Asset', body:'In most of the US, PWC can only be ridden 4–6 months/year. You pay for insurance and storage 12 months for 4–6 months of potential use.' },
        { label:'Rental Availability', body:'PWC are among the most widely available rental items at lakes, rivers, and beaches — typically $80–$200/hour. This strong rental market gives you a clear comparison baseline.' },
        { label:'Trailer Required', body:'Most PWC owners need a trailer ($1,200–$3,000) unless they have a marina slip. Factor total system cost.' },
      ]},
    pros:['Go when you want — no reservations or time limits','Much cheaper per-use at high usage vs. hourly rentals','Two-up riding and towing water toys is more practical','Strong resale market if well-maintained'],
    cons:['No storage, winterization, or off-season costs','Rental fleets widely available at popular destinations','Rent the newer model every time','No trailer or towing vehicle needed'],
    whenBuy:['You live on or near a lake, river, or coast with easy water access','You ride 25+ days per season','You have secure, inexpensive storage nearby','Multiple family members will ride — cost-per-user improves significantly'],
    whenRent:['Usage under 15 days/year — hourly rental is clearly cheaper','You visit different bodies of water each season','No easy storage or trailering solution','Seasonal restrictions limit your access window significantly'],
  },
  { id:'camper', emoji:'🏕', label:'Camper Trailer',
    defaults:{ purchasePrice:35000,downPct:20,loanRate:7.5,loanYears:10,annIns:1000,annMaint:1000,storageMo:120,fuelAnnual:0,regAnnual:300,depRate:10,daysPerYear:25,dailyRental:180 },
    learn:{ title:'Travel Trailer & Fifth Wheel Ownership', intro:'Towable campers — travel trailers, fifth wheels, and pop-ups — offer a more affordable entry into RV camping than motorized units and hold value better. But they still require a compatible tow vehicle.',
      points:[
        { label:'Tow Vehicle Requirements', body:'Most travel trailers require a half-ton or three-quarter-ton pickup. If you don\'t own a capable tow vehicle, add $35,000–$70,000 to your total system cost.' },
        { label:'Better Value Than Motorized', body:'Towables depreciate at 10–12%/year vs. 20–25% for motor homes. A well-maintained 3-year-old travel trailer retains 60–70% of its value.' },
        { label:'Storage Reality', body:'Most HOAs prohibit on-property trailer storage. Self-storage runs $100–$200/month uncovered. Budget 12 months of storage even if camping is seasonal.' },
        { label:'Rental Comparison', body:'Travel trailer rentals run $80–$200/night through Outdoorsy/RVshare. At 25 nights/year, rental costs $2,000–$5,000. This is your true comparison baseline.' },
      ]},
    pros:['Consistent camp setup — your kitchen, your bed, your layout','Build memories over years in a familiar, personalized space','More space and amenities than tent camping','Great for family — sleeping arrangements grow with you'],
    cons:['No storage, maintenance, or winterization responsibility','Rent different sizes and floor plans for different trips','No tow vehicle required — many rental companies deliver','Ideal if you camp fewer than 15 nights/year'],
    whenBuy:['You already own a qualified tow vehicle','You camp 30+ nights/year and have affordable storage','Family size justifies dedicated sleeping space','You plan to keep and maintain it for 8+ years'],
    whenRent:['Under 20 nights/year — rental math is clearly better','No tow vehicle or inadequate tow rating','No storage solution at reasonable cost','You prefer flexibility — different destinations each year'],
  },
]

function RecrTool({ onBack }) {
  const [tab, setTab] = useState('learn')
  const [itemId, setItemId] = useState('boat')
  const item = RECR_ITEMS.find(m=>m.id===itemId)
  const [vals, setVals] = useState(item.defaults)

  function switchItem(id) {
    const next = RECR_ITEMS.find(m=>m.id===id)
    setItemId(id); setVals(next.defaults); setTab('learn')
  }
  const set = key => v => setVals(p=>({...p,[key]:v}))

  const calc = useMemo(() => {
    const v=vals
    const loan=v.purchasePrice*(1-v.downPct/100)
    const monthly=calcPMT(loan,v.loanRate,v.loanYears*12)
    function ownCost(yrs) {
      const loanPaid=Math.min(yrs,v.loanYears)*monthly*12
      const residual=v.purchasePrice*Math.pow(1-v.depRate/100,yrs)
      const annRecur=v.annIns+v.annMaint+v.storageMo*12+v.fuelAnnual+v.regAnnual
      return Math.round(v.purchasePrice*v.downPct/100+loanPaid+annRecur*yrs-residual)
    }
    function rentCost(yrs) { return Math.round(v.daysPerYear*v.dailyRental*yrs) }
    const barData=[1,3,5,10].map(yrs=>({ period:`${yrs} Yr${yrs>1?'s':''}`, Buy:ownCost(yrs), Rent:rentCost(yrs) }))
    const own5=ownCost(5), rent5=rentCost(5)
    const annRecur=v.annIns+v.annMaint+v.storageMo*12+v.fuelAnnual+v.regAnnual
    return {
      barData, buyWins5:own5<rent5, own5, rent5,
      costPerDay: v.daysPerYear>0 ? Math.round((own5/5)/v.daysPerYear) : 0,
      annRecur: Math.round(annRecur), monthly: Math.round(monthly),
    }
  }, [vals])

  const TABS=[
    { key:'learn', label:'Learn' }, { key:'calc', label:'Calculator' },
    { key:'pros', label:'Pros & Cons' }, { key:'when', label:'When' }, { key:'verdict', label:'Verdict' },
  ]

  return (
    <div style={{ paddingBottom:88 }}>
      <div style={{ padding:'12px 16px 0' }}><BackBtn onBack={onBack} /></div>
      <div style={{ padding:'0 16px 10px' }}>
        <div style={{ fontFamily:DISPLAY, fontSize:20, fontWeight:700, color:C.t1 }}>Recreational & Personal Items</div>
        <div style={{ fontFamily:UI, fontSize:12, color:C.t3, marginTop:2 }}>Should you buy that boat, RV, or jet ski?</div>
      </div>
      <div style={{ display:'flex', gap:8, overflowX:'auto', scrollbarWidth:'none', padding:'0 16px 12px' }}>
        {RECR_ITEMS.map(m => (
          <button key={m.id} onClick={()=>switchItem(m.id)} style={{ flexShrink:0, padding:'6px 12px', borderRadius:20, cursor:'pointer', background:itemId===m.id?C.gold:C.surf, border:`1px solid ${itemId===m.id?C.gold:C.b2}`, color:itemId===m.id?'#1a1410':C.t2, fontFamily:UI, fontSize:11, fontWeight:itemId===m.id?700:400, WebkitTapHighlightColor:'transparent' }}>
            {m.emoji} {m.label}
          </button>
        ))}
      </div>
      <TabBar tabs={TABS} active={tab} onChange={setTab} />
      <div style={{ padding:'0 16px' }}>
        {tab === 'learn' && <LearnSection title={item.learn.title} intro={item.learn.intro} points={item.learn.points} />}
        {tab === 'calc' && (
          <>
            <MCard>
              <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.gold, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Purchase & Financing</div>
              <Slider label="Purchase Price" value={vals.purchasePrice} min={1000} max={500000} step={500} disp={fmt(vals.purchasePrice)} onChange={set('purchasePrice')} accent={C.gold} />
              <Slider label="Down Payment" value={vals.downPct} min={0} max={50} step={5} disp={`${vals.downPct}%`} onChange={set('downPct')} accent={C.gold} />
              <Slider label="Loan Rate" value={vals.loanRate} min={3} max={16} step={0.25} disp={`${vals.loanRate}%`} onChange={set('loanRate')} accent={C.gold} />
              <Slider label="Loan Term" value={vals.loanYears} min={1} max={20} step={1} disp={`${vals.loanYears} yrs`} onChange={set('loanYears')} accent={C.gold} />
            </MCard>
            <MCard>
              <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.teal, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Annual Recurring Costs</div>
              <Slider label="Annual Insurance" value={vals.annIns} min={0} max={10000} step={50} disp={fmt(vals.annIns)} onChange={set('annIns')} />
              <Slider label="Annual Maintenance" value={vals.annMaint} min={0} max={15000} step={100} disp={fmt(vals.annMaint)} onChange={set('annMaint')} />
              <Slider label="Monthly Storage" value={vals.storageMo} min={0} max={1000} step={10} disp={fmt(vals.storageMo)+'/mo'} onChange={set('storageMo')} />
              <Slider label="Annual Fuel" value={vals.fuelAnnual} min={0} max={10000} step={100} disp={fmt(vals.fuelAnnual)} onChange={set('fuelAnnual')} />
              <Slider label="Annual Registration" value={vals.regAnnual} min={0} max={2000} step={25} disp={fmt(vals.regAnnual)} onChange={set('regAnnual')} />
            </MCard>
            <MCard>
              <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.t2, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Usage & Depreciation</div>
              <Slider label="Days Used Per Year" value={vals.daysPerYear} min={1} max={200} step={1} disp={`${vals.daysPerYear} days`} onChange={set('daysPerYear')} accent={C.t2} />
              <Slider label="Annual Depreciation Rate" value={vals.depRate} min={3} max={25} step={0.5} disp={`${vals.depRate}%`} onChange={set('depRate')} accent={C.t2} />
              <Slider label="Daily Rental Alternative" value={vals.dailyRental} min={25} max={2000} step={25} disp={fmt(vals.dailyRental)+'/day'} onChange={set('dailyRental')} accent={C.t2} />
            </MCard>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:12 }}>
              <StatRow label="Monthly Payment" value={fmt(calc.monthly)+'/mo'} accent={C.gold} />
              <StatRow label="Annual Recurring" value={fmt(calc.annRecur)} accent={C.teal} />
              <StatRow label="Cost per Day" value={fmt(calc.costPerDay)} accent={C.t1} />
            </div>
            <MCard>
              <div style={{ fontFamily:UI, fontSize:10, color:C.t3, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Own vs. Rent Over Time</div>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={calc.barData} margin={{ top:4, right:8, bottom:0, left:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.b1} />
                  <XAxis dataKey="period" tick={{ fill:C.t3, fontFamily:UI, fontSize:9 }} tickLine={false} />
                  <YAxis tickFormatter={n=>`$${Math.round(n/1000)}k`} tick={{ fill:C.t3, fontFamily:MONO, fontSize:9 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<BTooltip />} />
                  <Legend wrapperStyle={{ fontFamily:UI, fontSize:10 }} />
                  <Bar dataKey="Buy" fill={C.gold} radius={[4,4,0,0]} name="Own" />
                  <Bar dataKey="Rent" fill={C.teal} radius={[4,4,0,0]} name="Rent/Charter" />
                </BarChart>
              </ResponsiveContainer>
            </MCard>
          </>
        )}
        {tab === 'pros' && (
          <ProConList
            buyLabel="Owning" rentLabel="Renting/Chartering"
            pros={Object.assign([...item.pros],{_cons:item.whenRent.slice(0,3)})}
            cons={Object.assign([...item.cons],{_cons:item.whenBuy.slice(0,3)})}
          />
        )}
        {tab === 'when' && (
          <WhenList buyLabel="Owning" rentLabel="Renting" buyItems={item.whenBuy} rentItems={item.whenRent} />
        )}
        {tab === 'verdict' && (
          <div style={{ background:C.surf, border:`1.5px solid ${calc.buyWins5?C.gold:C.teal}35`, borderRadius:16, padding:'16px' }}>
            <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:calc.buyWins5?C.gold:C.teal, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>5-Year Verdict</div>
            <div style={{ fontFamily:DISPLAY, fontSize:16, fontWeight:700, color:C.t1, marginBottom:8 }}>
              {calc.buyWins5 ? `Owning the ${item.label} is the better financial choice` : `Renting beats ownership over 5 years with your inputs`}
            </div>
            <div style={{ fontFamily:UI, fontSize:13, color:C.t2, lineHeight:1.65 }}>
              {calc.buyWins5
                ? `Owning costs ${fmt(calc.own5)} over 5 years vs. ${fmt(calc.rent5)} renting at ${vals.daysPerYear} days/year — saving ${fmt(calc.rent5-calc.own5)}. Your effective cost per use day is ${fmt(calc.costPerDay)}.`
                : `Renting at ${vals.daysPerYear} days/year costs ${fmt(calc.rent5)} over 5 years vs. ${fmt(calc.own5)} owning — saving ${fmt(calc.own5-calc.rent5)}. Increase usage days to make ownership financially attractive.`}
            </div>
          </div>
        )}
        <div style={{ height:20 }} />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════ */
export default function MBuyRentLease() {
  const [view, setView] = useState('hub')

  return (
    <div style={{ background:C.bg, minHeight:'100dvh', paddingBottom:view==='hub'?88:0 }}>
      <ScreenHeader title="Buy, Rent or Lease" subtitle="Planning" accent={C.teal} />
      {view==='hub'    && <HubScreen onSelect={setView} />}
      {view==='house'  && <HouseTool onBack={()=>setView('hub')} />}
      {view==='car'    && <CarTool onBack={()=>setView('hub')} />}
      {view==='recr'   && <RecrTool onBack={()=>setView('hub')} />}
      {view==='equip'  && <EquipmentTool onBack={()=>setView('hub')} />}
      {view==='furn'   && <FurnitureTool onBack={()=>setView('hub')} />}
      {view==='heavy'  && <HeavyToolsTool onBack={()=>setView('hub')} />}
      {view==='tech'   && <TechTool onBack={()=>setView('hub')} />}
      {view==='vac'    && <VacationTool onBack={()=>setView('hub')} />}
      {view==='sub'    && <SubscribeTool onBack={()=>setView('hub')} />}
    </div>
  )
}
