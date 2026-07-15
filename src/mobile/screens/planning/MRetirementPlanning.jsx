import { useState, useMemo } from 'react'
import { CheckCircle2, XCircle, AlertCircle, Info, ExternalLink, ArrowRight, TrendingUp, Shield, DollarSign, Calendar } from 'lucide-react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader, MResultRow } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import useUserLS from '../../hooks/useUserLS'

const fmt = n => '$' + Math.round(Math.abs(n || 0)).toLocaleString()
const fmtK = n => {
  const a = Math.abs(n || 0)
  if (a >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M'
  if (a >= 1_000) return '$' + (n / 1_000).toFixed(1) + 'K'
  return '$' + Math.round(n || 0).toLocaleString()
}

function InfoBox({ children, color }) {
  const c = color || C.teal
  return (
    <div style={{ display:'flex', gap:8, padding:'10px 12px', background:`${c}12`, border:`1px solid ${c}28`, borderRadius:10, marginTop:10 }}>
      <Info size={13} color={c} style={{ flexShrink:0, marginTop:1 }} />
      <p style={{ margin:0, fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.7 }}>{children}</p>
    </div>
  )
}

function Accordion({ title, color, badge, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background:C.surf, border:`1px solid ${open ? color+'40' : C.b1}`, borderRadius:14, marginBottom:8, overflow:'hidden' }}>
      <button onClick={() => setOpen(v => !v)} style={{
        width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'13px 14px', background:'none', border:'none', cursor:'pointer',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, flex:1, minWidth:0 }}>
          {badge && <span style={{ fontFamily:UI, fontSize:9, fontWeight:700, color, background:`${color}14`, border:`1px solid ${color}30`, borderRadius:20, padding:'2px 7px', letterSpacing:'0.08em', textTransform:'uppercase', flexShrink:0 }}>{badge}</span>}
          <span style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.t1, textAlign:'left' }}>{title}</span>
        </div>
        <span style={{ fontFamily:MONO, fontSize:14, color:C.t3, marginLeft:8 }}>{open ? '−' : '+'}</span>
      </button>
      {open && <div style={{ padding:'0 14px 14px', borderTop:`1px solid ${C.b1}` }}>{children}</div>}
    </div>
  )
}

/* ── dynamic safe withdrawal rate by retirement duration ────── */
function getSWR(retirementYears) {
  if (retirementYears <= 10) return 0.065
  if (retirementYears <= 15) return 0.055
  if (retirementYears <= 20) return 0.050
  if (retirementYears <= 25) return 0.045
  if (retirementYears <= 30) return 0.040
  if (retirementYears <= 35) return 0.036
  if (retirementYears <= 40) return 0.033
  if (retirementYears <= 45) return 0.030
  return 0.028
}

/* ── Projector ──────────────────────────────────────────────── */
function Projector() {
  const [p, setP] = useUserLS('rp_mobile', {
    currentAge:35, retireAge:65, lifeExpectancy:90,
    currentSavings:85000, monthlyContrib:1500,
    growthRate:7, desiredIncome:70000, ssEstimate:20000,
  })
  const set = k => e => setP(prev => ({ ...prev, [k]: +e.target.value || 0 }))

  const yearsToRetire   = Math.max(0, p.retireAge - p.currentAge)
  const retirementYears = Math.max(1, p.lifeExpectancy - p.retireAge)
  const swr             = getSWR(retirementYears)

  const r = p.growthRate / 100 / 12
  const n = yearsToRetire * 12
  const fvCurrent  = p.currentSavings * Math.pow(1 + p.growthRate / 100, yearsToRetire)
  const fvContribs = r > 0 ? p.monthlyContrib * ((Math.pow(1 + r, n) - 1) / r) : p.monthlyContrib * n
  const total        = fvCurrent + fvContribs
  const neededIncome = Math.max(0, p.desiredIncome - p.ssEstimate)
  const needed       = neededIncome / swr
  const gap          = needed - total
  const onTrack      = gap <= 0

  /* accumulation chart: current age → retirement */
  const accumData = []
  for (let y = 0; y <= yearsToRetire; y++) {
    const m = y * 12
    const v = p.currentSavings * Math.pow(1 + p.growthRate / 100, y) +
      (r > 0 ? p.monthlyContrib * ((Math.pow(1 + r, m) - 1) / r) : p.monthlyContrib * m)
    accumData.push({ age: p.currentAge + y, value: Math.round(v) })
  }

  /* drawdown chart: retirement age → life expectancy */
  const retireGrowthRate = Math.max(0, p.growthRate - 1.5) / 100 // conservative in retirement
  const drawData = []
  let bal = total
  for (let y = 0; y <= retirementYears; y++) {
    drawData.push({ age: p.retireAge + y, value: Math.max(0, Math.round(bal)) })
    bal = bal * (1 + retireGrowthRate) - neededIncome
  }
  const depleted     = drawData.findIndex(d => d.value === 0)
  const portfolioLasts = depleted === -1
    ? `Lasts past age ${p.lifeExpectancy}`
    : `Depletes at age ${p.retireAge + depleted}`

  const annualWithdrawal = total * swr
  const monthlyIncome    = annualWithdrawal / 12

  const fields = [
    { label:'Current Age',          key:'currentAge',      min:18,  max:80,      step:1 },
    { label:'Retirement Age',       key:'retireAge',       min:45,  max:85,      step:1 },
    { label:'Life Expectancy',      key:'lifeExpectancy',  min:60,  max:105,     step:1 },
    { label:'Current Savings',      key:'currentSavings',  min:0,   max:5000000, step:5000 },
    { label:'Monthly Contribution', key:'monthlyContrib',  min:0,   max:20000,   step:100 },
    { label:'Expected Return (%)',  key:'growthRate',      min:0,   max:15,      step:0.5 },
    { label:'Desired Annual Income',key:'desiredIncome',   min:0,   max:300000,  step:2000 },
    { label:'Expected SS (annual)', key:'ssEstimate',      min:0,   max:60000,   step:1000 },
  ]

  return (
    <div style={{ padding:'12px 16px 0' }}>

      {/* Hero result */}
      <MCard>
        <div style={{ fontFamily:UI, fontSize:10, color:C.t3, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:4 }}>Projected Nest Egg at Retirement</div>
        <div style={{ fontFamily:DISPLAY, fontSize:34, fontWeight:700, color:C.gold }}>{fmtK(total)}</div>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:4, flexWrap:'wrap' }}>
          <span style={{ fontFamily:UI, fontSize:13, color:C.t2 }}>
            {(swr * 100).toFixed(1)}% SWR → {fmt(monthlyIncome)}/mo
          </span>
          <span style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:portfolioLasts.includes('Depletes') ? C.down : C.up, background: portfolioLasts.includes('Depletes') ? 'rgba(192,57,43,0.10)' : 'rgba(74,124,89,0.10)', border:`1px solid ${portfolioLasts.includes('Depletes') ? 'rgba(192,57,43,0.25)' : 'rgba(74,124,89,0.25)'}`, borderRadius:20, padding:'2px 8px' }}>
            {portfolioLasts}
          </span>
        </div>

        {/* Accumulation chart */}
        <div style={{ marginTop:10, marginBottom:4 }}>
          <div style={{ fontFamily:UI, fontSize:9, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>Building Phase — age {p.currentAge} → {p.retireAge}</div>
          <div style={{ height:90 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={accumData}>
                <defs>
                  <linearGradient id="rpAccum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.gold} stopOpacity={0.28} />
                    <stop offset="95%" stopColor={C.gold} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="age" tick={{ fontFamily:MONO, fontSize:9, fill:C.t3 }} axisLine={false} tickLine={false} interval={Math.floor(accumData.length / 4)} />
                <YAxis hide domain={[0, 'auto']} />
                <Tooltip contentStyle={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:8, fontSize:11 }} formatter={v => [fmtK(v), 'Balance']} />
                <Area type="monotone" dataKey="value" stroke={C.gold} strokeWidth={2} fill="url(#rpAccum)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Drawdown chart */}
        <div style={{ marginTop:6 }}>
          <div style={{ fontFamily:UI, fontSize:9, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>Drawdown Phase — age {p.retireAge} → {p.lifeExpectancy}</div>
          <div style={{ height:90 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={drawData}>
                <defs>
                  <linearGradient id="rpDraw" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={portfolioLasts.includes('Depletes') ? C.down : C.teal} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={portfolioLasts.includes('Depletes') ? C.down : C.teal} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="age" tick={{ fontFamily:MONO, fontSize:9, fill:C.t3 }} axisLine={false} tickLine={false} interval={Math.floor(drawData.length / 4)} />
                <YAxis hide domain={[0, 'auto']} />
                <Tooltip contentStyle={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:8, fontSize:11 }} formatter={v => [fmtK(v), 'Balance']} />
                <Area type="monotone" dataKey="value" stroke={portfolioLasts.includes('Depletes') ? C.down : C.teal} strokeWidth={2} fill="url(#rpDraw)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </MCard>

      {/* On-track status */}
      <div style={{
        background: onTrack ? 'rgba(74,124,89,0.08)' : 'rgba(192,57,43,0.08)',
        border: `1px solid ${onTrack ? 'rgba(74,124,89,0.25)' : 'rgba(192,57,43,0.25)'}`,
        borderRadius:14, padding:'12px 14px', marginBottom:12,
      }}>
        <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:onTrack ? C.up : C.down, marginBottom:4 }}>
          {onTrack ? 'You\'re on track!' : `Savings Gap: ${fmtK(Math.abs(gap))}`}
        </div>
        <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65 }}>
          {onTrack
            ? `Your ${fmtK(total)} at retirement exceeds the ${fmtK(needed)} needed to fund ${retirementYears} years of withdrawals.`
            : `You need ${fmtK(needed)} to fund ${retirementYears} years (age ${p.retireAge}–${p.lifeExpectancy}) at ${fmt(neededIncome)}/yr. Increase contributions or adjust your plan.`}
        </div>
      </div>

      {/* Key metrics */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
        {[
          { l:'Projected Portfolio',     v:fmtK(total),               c:C.gold },
          { l:`Needed (${(swr*100).toFixed(1)}% SWR)`, v:fmtK(needed), c:C.t1 },
          { l:'Annual Withdrawal',       v:fmt(annualWithdrawal),      c:C.teal },
          { l:'Monthly Income',          v:fmt(monthlyIncome),         c:C.teal },
          { l:'Years in Retirement',     v:`${retirementYears} yrs`,   c:C.indigo },
          { l:'Safe Withdrawal Rate',    v:`${(swr*100).toFixed(1)}%`, c:C.indigo },
          { l:'Years to Retire',         v:`${yearsToRetire} yrs`,     c:C.t2 },
          { l:'Total Contributions',     v:fmtK(p.monthlyContrib * n), c:C.t2 },
        ].map(({ l, v, c }) => (
          <div key={l} style={{ background:C.raise, borderRadius:10, padding:'10px 12px', border:`1px solid ${C.b1}` }}>
            <div style={{ fontFamily:UI, fontSize:9, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:3 }}>{l}</div>
            <div style={{ fontFamily:MONO, fontSize:14, fontWeight:700, color:c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Sliders */}
      <MSectionHeader label="Your Numbers" />
      <MCard>
        {fields.map(({ label, key, min, max, step }) => (
          <div key={key} style={{ marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
              <span style={{ fontFamily:UI, fontSize:12, color:key === 'lifeExpectancy' ? C.indigo : C.t2, fontWeight:600 }}>{label}</span>
              <span style={{ fontFamily:MONO, fontSize:13, color: key === 'lifeExpectancy' ? C.indigo : C.gold, fontWeight:700 }}>
                {key.includes('Age') || key === 'lifeExpectancy' ? p[key] : key.includes('Rate') ? `${p[key]}%` : fmt(p[key])}
              </span>
            </div>
            <input type="range" min={min} max={max} step={step} value={p[key]} onChange={set(key)}
              style={{ width:'100%', accentColor: key === 'lifeExpectancy' ? C.indigo : C.gold }} />
          </div>
        ))}
      </MCard>
      <InfoBox color={C.gold}>Safe withdrawal rate adjusts automatically based on your retirement duration. Longer retirement = lower SWR. Assumes {(p.growthRate - 1.5).toFixed(1)}% real return in retirement.</InfoBox>
      <div style={{ height:8 }} />
    </div>
  )
}

/* ── Account Types ──────────────────────────────────────────── */
const ACCOUNTS = [
  {
    key:'k401', label:'401(k)/403(b)', color:'#00B4C6',
    badge:'Employer Plan',
    limit:'$24,500 ($32,500 if 50+; ages 60–63: $35,750)',
    tax:'Pre-tax or Roth (if available)',
    match:true,
    pros:['Highest contribution limits of any retirement account','Employer match is free money — always get the full match','Automatic payroll deduction','403(b) for nonprofits, 457 for government workers'],
    cons:['Investment options limited to plan offerings','RMDs required at age 73','10% penalty for early withdrawal before 59½'],
    best:'Your first stop. Max the employer match before anything else.',
  },
  {
    key:'tira', label:'Traditional IRA', color:'#818cf8',
    badge:'Individual',
    limit:'$7,500 ($8,600 if 50+) — 2026',
    tax:'Pre-tax (may be tax-deductible)',
    match:false,
    pros:['Open at any brokerage — full investment control','Tax-deductible contributions (if income limits met)','Wider investment options than most 401(k)s','Rollover destination for old 401(k)s'],
    cons:['Lower limit than 401(k)','Deductibility phases out at higher incomes','RMDs required at age 73','10% early withdrawal penalty before 59½'],
    best:'Good secondary account after maxing employer match. Great for rollovers.',
  },
  {
    key:'rira', label:'Roth IRA', color:'#22c55e',
    badge:'Best For Most',
    limit:'$7,500 ($8,600 if 50+) — 2026',
    tax:'After-tax — tax-free growth & withdrawals',
    match:false,
    pros:['Tax-free growth and tax-free withdrawals in retirement','No RMDs — money can grow indefinitely','Contributions can be withdrawn anytime penalty-free','Most flexible retirement account available'],
    cons:['Income limits: phases out $153K–$168K (single) / $242K–$252K (married)','No upfront tax deduction','Lower limit than 401(k)'],
    best:'The most powerful account for most people. Prioritize after getting the employer match.',
  },
  {
    key:'sep', label:'SEP IRA', color:'#f59e0b',
    badge:'Self-Employed',
    limit:'Up to $72,000 (25% of net SE income)',
    tax:'Pre-tax',
    match:false,
    pros:['Massive contribution limits for high-earning self-employed','Simple to open and administer','Tax-deductible contributions','No annual filing requirements'],
    cons:['Must contribute same % for all eligible employees','No Roth option','RMDs required at 73'],
    best:'Freelancers and consultants with high income and no employees.',
  },
  {
    key:'solo', label:'Solo 401(k)', color:'#ec4899',
    badge:'Self-Employed',
    limit:'Up to $72,000 ($80,000 if 50+)',
    tax:'Pre-tax or Roth',
    match:false,
    pros:['Highest limits of any self-employed option','Both employee and employer contributions','Roth option available','Loan provisions available'],
    cons:['Must have no full-time employees (except spouse)','More administrative complexity than SEP IRA','Form 5500 required when assets exceed $250K'],
    best:'Self-employed with no employees wanting to maximize contributions.',
  },
]

const PRIORITY = [
  { step:'1', label:'401(k) up to employer match', note:'Free money. Always get 100% of any employer match first.', color:'#22c55e' },
  { step:'2', label:'Max your Roth IRA ($7,500)', note:'Tax-free growth for life. Most flexible long-term account.', color:C.teal },
  { step:'3', label:'Max your 401(k) ($24,500)', note:'After Roth, go back and fill up your 401(k) to the limit.', color:'#818cf8' },
  { step:'4', label:'Taxable brokerage', note:'Once tax-advantaged accounts are maxed, invest in a regular brokerage.', color:'#f59e0b' },
]

function AccountsTab() {
  const [active, setActive] = useState('k401')
  const acct = ACCOUNTS.find(a => a.key === active)

  return (
    <div style={{ padding:'12px 16px 0' }}>
      {/* Account selector pills */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:14 }}>
        {ACCOUNTS.map(a => (
          <button key={a.key} onClick={() => setActive(a.key)} style={{
            padding:'6px 12px', borderRadius:20, border:`1.5px solid ${active === a.key ? a.color : C.b2}`,
            background: active === a.key ? a.color : 'transparent',
            fontFamily:UI, fontSize:11, fontWeight:active === a.key ? 700 : 500,
            color: active === a.key ? '#fff' : C.t3, cursor:'pointer',
          }}>{a.label}</button>
        ))}
      </div>

      {/* Account detail */}
      <div style={{ background:C.surf, border:`1.5px solid ${acct.color}35`, borderRadius:16, padding:'14px', marginBottom:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
          <div style={{ fontFamily:DISPLAY, fontSize:17, fontWeight:700, color:C.t1 }}>{acct.label}</div>
          <span style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:acct.color, background:`${acct.color}14`, border:`1px solid ${acct.color}30`, borderRadius:20, padding:'2px 7px', letterSpacing:'0.08em', textTransform:'uppercase' }}>{acct.badge}</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
          <div style={{ background:C.raise, borderRadius:10, padding:'10px 12px' }}>
            <div style={{ fontFamily:UI, fontSize:9, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:3 }}>2026 Limit</div>
            <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.t1 }}>{acct.limit}</div>
          </div>
          <div style={{ background:C.raise, borderRadius:10, padding:'10px 12px' }}>
            <div style={{ fontFamily:UI, fontSize:9, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:3 }}>Tax Treatment</div>
            <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.t1 }}>{acct.tax}</div>
          </div>
        </div>
        {acct.match && (
          <div style={{ display:'flex', gap:8, padding:'8px 10px', background:'rgba(74,124,89,0.08)', border:'1px solid rgba(74,124,89,0.22)', borderRadius:8, marginBottom:10 }}>
            <CheckCircle2 size={13} color={C.up} style={{ flexShrink:0, marginTop:1 }} />
            <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.55 }}><strong style={{ color:C.up }}>Employer match available.</strong> Always contribute enough to capture 100% of the match — it's an instant 50–100% return.</div>
          </div>
        )}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <div>
            <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:C.up, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>Pros</div>
            {acct.pros.map(p => (
              <div key={p} style={{ display:'flex', gap:6, alignItems:'flex-start', marginBottom:5 }}>
                <CheckCircle2 size={11} color={C.up} style={{ flexShrink:0, marginTop:2 }} />
                <span style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.5 }}>{p}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:C.down, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>Cons</div>
            {acct.cons.map(cn => (
              <div key={cn} style={{ display:'flex', gap:6, alignItems:'flex-start', marginBottom:5 }}>
                <XCircle size={11} color={C.down} style={{ flexShrink:0, marginTop:2 }} />
                <span style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.5 }}>{cn}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background:`${acct.color}10`, border:`1px solid ${acct.color}22`, borderRadius:8, padding:'8px 10px', marginTop:10 }}>
          <span style={{ fontFamily:UI, fontSize:11, color:acct.color, fontWeight:700 }}>Best for: </span>
          <span style={{ fontFamily:UI, fontSize:11, color:C.t2 }}>{acct.best}</span>
        </div>
      </div>

      <MSectionHeader label="Priority Order: Where to Put Money First" />
      <MCard style={{ padding:0, overflow:'hidden' }}>
        {PRIORITY.map(({ step, label, note, color }, i) => (
          <div key={step} style={{ display:'flex', gap:12, padding:'12px 14px', borderBottom: i < PRIORITY.length - 1 ? `1px solid ${C.b1}` : 'none', alignItems:'flex-start' }}>
            <div style={{ width:26, height:26, borderRadius:'50%', background:color, color:'#fff', fontWeight:700, fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:UI }}>{step}</div>
            <div>
              <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.t1, marginBottom:2 }}>{label}</div>
              <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.55 }}>{note}</div>
            </div>
          </div>
        ))}
      </MCard>
      <div style={{ height:8 }} />
    </div>
  )
}

/* ── Social Security ────────────────────────────────────────── */
const SS_AGES = [
  { age:'62', label:'Early (reduced)', color:C.down, benefit:'Up to 30% permanent reduction from your full benefit.', when:'Only if you have health concerns, no other income, or genuinely need the money now.' },
  { age:'67', label:'Full Retirement Age', color:C.teal, benefit:'100% of your earned benefit. The standard baseline.', when:'Default benchmark. If in average health with other bridge income, waiting still pays off.' },
  { age:'70', label:'Maximum benefit', color:C.up, benefit:'+8% per year delayed credit from FRA — up to 24–32% more.', when:'If in good health with assets to live on. Break-even is typically age 80–82.' },
]

const SS_FACTS = [
  { label:'Benefit calculation', detail:'Based on your highest 35 years of earnings. Years with no income count as $0 — work at least 35 years.' },
  { label:'COLA adjustments', detail:'SS benefits increase annually with inflation. In 2024, COLA was 3.2%. It\'s inflation-protected income for life.' },
  { label:'Spousal benefit', detail:'A lower-earning spouse can claim up to 50% of the higher earner\'s FRA benefit, even without their own work record.' },
  { label:'Survivor benefit', detail:'If your spouse dies, the survivor receives the higher of the two benefit amounts. This makes delaying the higher earner\'s benefit especially valuable.' },
  { label:'Earnings test (before FRA)', detail:'If you claim before FRA and continue working, benefits are temporarily reduced if earnings exceed $24,480 (2026).' },
  { label:'Taxation of benefits', detail:'Up to 85% of SS benefits may be taxable if combined income exceeds $34K (single) or $44K (married).' },
]

function SSTab() {
  const [fraMonthly, setFraMonthly] = useState(2400)
  const m62 = fraMonthly * 0.70
  const m67 = fraMonthly
  const m70 = fraMonthly * 1.24

  return (
    <div style={{ padding:'12px 16px 0' }}>
      {/* Key stats */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
        {[
          { l:'Full Retirement Age', v:'Age 67', c:C.teal },
          { l:'Early Penalty', v:'−30%', c:C.down },
          { l:'Delayed Bonus/Year', v:'+8%', c:C.up },
          { l:'Max Monthly 2026', v:'$4,873', c:C.gold },
        ].map(({ l, v, c }) => (
          <div key={l} style={{ background:`${c}10`, border:`1px solid ${c}28`, borderRadius:10, padding:'10px 12px', textAlign:'center' }}>
            <div style={{ fontFamily:MONO, fontSize:18, fontWeight:900, color:c, lineHeight:1 }}>{v}</div>
            <div style={{ fontFamily:UI, fontSize:9, color:C.t3, fontWeight:600, letterSpacing:'0.07em', textTransform:'uppercase', marginTop:4 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* FRA input */}
      <MCard>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
          <span style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:C.t2 }}>Your Monthly Benefit at FRA (Age 67)</span>
          <span style={{ fontFamily:MONO, fontSize:13, fontWeight:700, color:C.gold }}>{fmt(fraMonthly)}</span>
        </div>
        <input type="range" min={500} max={4873} step={50} value={fraMonthly} onChange={e => setFraMonthly(+e.target.value)} style={{ width:'100%', accentColor:C.gold }} />
        <div style={{ fontFamily:UI, fontSize:10, color:C.t3, marginTop:4 }}>Find your estimate at ssa.gov/myaccount</div>
      </MCard>

      {/* Claiming age comparison */}
      <MSectionHeader label="Claiming Age Comparison" />
      {SS_AGES.map(a => (
        <div key={a.age} style={{ background:C.surf, border:`1px solid ${a.color}28`, borderRadius:14, padding:'13px 14px', marginBottom:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
            <div style={{ fontFamily:DISPLAY, fontSize:22, fontWeight:700, color:a.color, lineHeight:1 }}>{a.age}</div>
            <span style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:a.color, background:`${a.color}14`, border:`1px solid ${a.color}30`, borderRadius:20, padding:'2px 7px', textTransform:'uppercase', letterSpacing:'0.07em' }}>{a.label}</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:8 }}>
            {[
              { l:'Monthly', v:fmt(a.age === '62' ? m62 : a.age === '67' ? m67 : m70) },
              { l:'Annual', v:fmt((a.age === '62' ? m62 : a.age === '67' ? m67 : m70) * 12) },
            ].map(({ l, v }) => (
              <div key={l} style={{ background:C.raise, borderRadius:8, padding:'8px 10px' }}>
                <div style={{ fontFamily:UI, fontSize:9, color:C.t3, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:2 }}>{l}</div>
                <div style={{ fontFamily:MONO, fontSize:13, fontWeight:700, color:a.color }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.6, marginBottom:4 }}>{a.benefit}</div>
          <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.55 }}><strong style={{ color:C.t2 }}>Choose this if:</strong> {a.when}</div>
        </div>
      ))}

      <MSectionHeader label="Key Social Security Facts" />
      <MCard style={{ padding:0, overflow:'hidden' }}>
        {SS_FACTS.map((f, i) => (
          <div key={f.label} style={{ padding:'11px 14px', borderBottom: i < SS_FACTS.length - 1 ? `1px solid ${C.b1}` : 'none' }}>
            <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.t1, marginBottom:3 }}>{f.label}</div>
            <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.6 }}>{f.detail}</div>
          </div>
        ))}
      </MCard>
      <InfoBox>Create a free account at ssa.gov/myaccount to see your actual earnings history and projected benefits at 62, 67, and 70.</InfoBox>
      <div style={{ height:8 }} />
    </div>
  )
}

/* ── Strategy Tab ────────────────────────────────────────────── */
const INCOME_SOURCES = [
  { source:'Social Security', type:'Guaranteed', color:'#22c55e', note:'Inflation-adjusted for life. Delay to 70 for maximum benefit. Forms the base of most plans.' },
  { source:'Pension', type:'Guaranteed', color:'#22c55e', note:'Defined benefit plan from employer. Increasingly rare. Consider survivor benefit options carefully.' },
  { source:'Traditional IRA / 401(k)', type:'Taxable', color:C.teal, note:'Taxed as ordinary income when withdrawn. RMDs start at 73. Most common vehicle.' },
  { source:'Roth IRA', type:'Tax-Free', color:'#818cf8', note:'Tax-free withdrawals. No RMDs. Best used last to maximize tax-free compounding.' },
  { source:'Taxable Brokerage', type:'Cap Gains', color:'#f59e0b', note:'Favorable long-term capital gains rates. Flexible — no restrictions.' },
  { source:'Part-time work', type:'Earned', color:C.t3, note:'Even $10–20K/year dramatically reduces portfolio withdrawal needs in early retirement.' },
]

const WITHDRAWAL_ORDER = [
  { step:'1', label:'RMDs first', note:'If 73+, take required minimums from Traditional accounts to avoid the 25% penalty.', color:C.down },
  { step:'2', label:'Taxable brokerage', note:'Favorable long-term capital gains rates if held 1+ year.', color:'#f59e0b' },
  { step:'3', label:'Traditional IRA / 401(k)', note:'Taxed as ordinary income. Withdraw enough to fill lower brackets efficiently.', color:C.teal },
  { step:'4', label:'Roth IRA last', note:'Let tax-free money grow as long as possible. No RMDs. Ideal for legacy.', color:'#22c55e' },
]

const RULE_4PCT = [
  { spend:'$40,000/yr', need:'$1,000,000', color:'#22c55e' },
  { spend:'$60,000/yr', need:'$1,500,000', color:C.teal },
  { spend:'$80,000/yr', need:'$2,000,000', color:'#818cf8' },
  { spend:'$100,000/yr', need:'$2,500,000', color:'#f59e0b' },
  { spend:'$120,000/yr', need:'$3,000,000', color:'#ec4899' },
]

function StrategyTab() {
  return (
    <div style={{ padding:'12px 16px 0' }}>
      <Accordion title="The 4% Rule" color={C.gold} badge="Core Concept">
        <div style={{ marginTop:10 }}>
          <p style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.7, margin:'0 0 12px' }}>
            Withdraw 4% of your portfolio in year one, then adjust for inflation each year. Your portfolio has historically lasted 30 years with high probability — even through major downturns.
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
            {RULE_4PCT.map(r => (
              <div key={r.spend} style={{ background:`${r.color}10`, border:`1px solid ${r.color}22`, borderRadius:10, padding:'10px 12px', textAlign:'center' }}>
                <div style={{ fontFamily:UI, fontSize:10, color:C.t3, marginBottom:3 }}>Spend {r.spend}</div>
                <div style={{ fontFamily:DISPLAY, fontSize:15, fontWeight:700, color:r.color }}>{r.need}</div>
                <div style={{ fontFamily:UI, fontSize:9, color:C.t3 }}>needed</div>
              </div>
            ))}
          </div>
          <InfoBox color={C.gold}>If you retire early (40s–50s), consider 3–3.5%. If retiring at 65+ with other income streams, 4–5% may be appropriate.</InfoBox>
        </div>
      </Accordion>

      <Accordion title="Retirement Income Stack" color={C.teal} badge="Income Planning">
        <div style={{ marginTop:10 }}>
          {INCOME_SOURCES.map((r, i) => (
            <div key={r.source} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'9px 0', borderBottom: i < INCOME_SOURCES.length - 1 ? `1px solid ${C.b1}` : 'none' }}>
              <span style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:r.color, background:`${r.color}14`, border:`1px solid ${r.color}28`, borderRadius:20, padding:'2px 7px', textTransform:'uppercase', letterSpacing:'0.06em', flexShrink:0, marginTop:1 }}>{r.type}</span>
              <div>
                <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.t1, marginBottom:2 }}>{r.source}</div>
                <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.55 }}>{r.note}</div>
              </div>
            </div>
          ))}
        </div>
      </Accordion>

      <Accordion title="Tax-Efficient Withdrawal Order" color={'#818cf8'} badge="Strategy">
        <div style={{ marginTop:10 }}>
          {WITHDRAWAL_ORDER.map(({ step, label, note, color }, i) => (
            <div key={step} style={{ display:'flex', gap:10, padding:'9px 0', borderBottom: i < WITHDRAWAL_ORDER.length - 1 ? `1px solid ${C.b1}` : 'none', alignItems:'flex-start' }}>
              <div style={{ width:24, height:24, borderRadius:'50%', background:color, color:'#fff', fontWeight:700, fontSize:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{step}</div>
              <div>
                <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.t1, marginBottom:2 }}>{label}</div>
                <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.55 }}>{note}</div>
              </div>
            </div>
          ))}
          <InfoBox>Roth conversions in your 60s — before RMDs and Social Security — can dramatically reduce lifetime taxes. A high-value strategy worth discussing with a tax advisor.</InfoBox>
        </div>
      </Accordion>

      <Accordion title="Required Minimum Distributions (RMDs)" color={C.down} badge="RMDs">
        <div style={{ marginTop:10 }}>
          <div style={{ display:'flex', gap:8, padding:'10px 12px', background:'rgba(192,57,43,0.08)', border:'1px solid rgba(192,57,43,0.22)', borderRadius:10, marginBottom:12 }}>
            <AlertCircle size={13} color={C.down} style={{ flexShrink:0, marginTop:1 }} />
            <p style={{ margin:0, fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65 }}>Missing an RMD triggers a <strong style={{ color:C.down }}>25% excise tax</strong> on the amount you should have withdrawn.</p>
          </div>
          {[
            { label:'Applies to', detail:'Traditional IRA, 401(k), 403(b), 457, SEP IRA. NOT Roth IRAs.' },
            { label:'Starting age', detail:'Age 73 if born 1951–1959. Age 75 if born 1960 or later (SECURE 2.0).' },
            { label:'Penalty for missing', detail:'25% excise tax on the amount not withdrawn (reduced to 10% if corrected timely).' },
            { label:'Strategy', detail:'Roth conversions in your 60s reduce Traditional IRA balances and future RMD amounts before they start.' },
          ].map((r, i) => (
            <div key={r.label} style={{ padding:'9px 0', borderBottom: i < 3 ? `1px solid ${C.b1}` : 'none' }}>
              <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.t1, marginBottom:2 }}>{r.label}</div>
              <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.6 }}>{r.detail}</div>
            </div>
          ))}
        </div>
      </Accordion>

      <Accordion title="Early Withdrawal Rules (Before 59½)" color={'#f59e0b'} badge="Penalties">
        <div style={{ marginTop:10 }}>
          <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65, marginBottom:10 }}>
            Withdrawing from a Traditional 401(k) or IRA before 59½ triggers a <strong>10% penalty plus ordinary income tax</strong>. On a $50K withdrawal you could lose $20,000+.
          </div>
          <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.t1, marginBottom:8 }}>Exceptions to the 10% penalty:</div>
          {['Death or permanent disability','Substantially Equal Periodic Payments (SEPP / Rule 72(t))','First-time home purchase (IRA only, up to $10,000 lifetime)','Higher education expenses (IRA only)','Medical expenses exceeding 7.5% of AGI','Age 55 separation from service (401(k) only)','Qualified domestic relations order (divorce)'].map(e => (
            <div key={e} style={{ display:'flex', gap:7, alignItems:'flex-start', marginBottom:5 }}>
              <CheckCircle2 size={11} color={C.teal} style={{ flexShrink:0, marginTop:2 }} />
              <span style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.55 }}>{e}</span>
            </div>
          ))}
          <InfoBox color={'#818cf8'}>Roth IRA contributions (not earnings) can always be withdrawn penalty-free at any age — a great emergency backstop.</InfoBox>
        </div>
      </Accordion>
      <div style={{ height:8 }} />
    </div>
  )
}

/* ── Resources ───────────────────────────────────────────────── */
const RESOURCES = [
  { category:'Government & Official', color:C.teal, items:[
    { name:'SSA My Account', desc:'See your earnings history and projected SS benefits at 62, 67, and 70.', url:'https://www.ssa.gov/myaccount/' },
    { name:'IRS Retirement Plans', desc:'Official guidance on contribution limits, rules, and plan types.', url:'https://www.irs.gov/retirement-plans' },
    { name:'DOL — Retirement', desc:'Resources on 401(k) rules, ERISA protections, and fee disclosures.', url:'https://www.dol.gov/general/topic/retirement' },
  ]},
  { category:'Planning Tools', color:'#818cf8', items:[
    { name:'FIRECalc', desc:'Tests your plan against every 30-year period in market history.', url:'https://firecalc.com' },
    { name:'cFIREsim', desc:'Monte Carlo and historical simulation for retirement portfolios. Free.', url:'https://cfiresim.com' },
    { name:'NewRetirement', desc:'Comprehensive retirement planning tool. Free tier available.', url:'https://www.newretirement.com' },
  ]},
  { category:'Education', color:'#f59e0b', items:[
    { name:'Bogleheads Wiki — Retirement', desc:'Community-driven guide to index fund investing and retirement planning.', url:'https://www.bogleheads.org/wiki/Retirement' },
    { name:'SSA Publications', desc:'Free official guides to SS benefits, spousal benefits, and survivor benefits.', url:'https://www.ssa.gov/pubs/' },
  ]},
]

const WHEN_CFP = [
  'You\'re within 5 years of retirement and haven\'t stress-tested your income plan',
  'You have a pension with complex survivor benefit decisions',
  'Your retirement assets exceed $500K',
  'You want a Social Security claiming strategy for you and a spouse',
  'You need Roth conversion planning to reduce future RMDs and taxes',
  'You\'re self-employed and want to maximize retirement account options',
]

function ResourcesTab() {
  return (
    <div style={{ padding:'12px 16px 0' }}>
      {RESOURCES.map(section => (
        <div key={section.category} style={{ marginBottom:14 }}>
          <MSectionHeader label={section.category} />
          <MCard style={{ padding:0, overflow:'hidden' }}>
            {section.items.map((item, i) => (
              <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer"
                style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, padding:'12px 14px', borderBottom: i < section.items.length - 1 ? `1px solid ${C.b1}` : 'none', textDecoration:'none' }}>
                <div>
                  <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:section.color, marginBottom:2 }}>{item.name}</div>
                  <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.55 }}>{item.desc}</div>
                </div>
                <ExternalLink size={13} color={C.t3} style={{ flexShrink:0, marginTop:2 }} />
              </a>
            ))}
          </MCard>
        </div>
      ))}

      <MSectionHeader label="When to Hire a CFP" />
      <MCard style={{ padding:0, overflow:'hidden' }}>
        {WHEN_CFP.map((r, i) => (
          <div key={i} style={{ display:'flex', gap:10, padding:'11px 14px', borderBottom: i < WHEN_CFP.length - 1 ? `1px solid ${C.b1}` : 'none', alignItems:'flex-start' }}>
            <ArrowRight size={12} color={C.teal} style={{ flexShrink:0, marginTop:2 }} />
            <span style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.55 }}>{r}</span>
          </div>
        ))}
      </MCard>
      <InfoBox>Look for a fee-only, fiduciary CFP. They charge for advice only — no commissions — so their recommendations aren't influenced by products they sell.</InfoBox>
      <div style={{ height:8 }} />
    </div>
  )
}

/* ── Root ─────────────────────────────────────────────────────── */
const TABS = [
  { key:'projector', label:'Projector' },
  { key:'accounts',  label:'Accounts' },
  { key:'ss',        label:'Soc. Security' },
  { key:'strategy',  label:'Strategy' },
  { key:'resources', label:'Resources' },
]

export default function MRetirementPlanning() {
  const [tab, setTab] = useState('projector')

  return (
    <div style={{ background:C.bg, minHeight:'100dvh', paddingBottom:88 }}>
      <ScreenHeader title="Retirement Planning" subtitle="Planning" accent={C.gold} />

      {/* Tab bar */}
      <div style={{ display:'flex', borderBottom:`1px solid ${C.b2}`, background:C.bg, overflowX:'auto', scrollbarWidth:'none' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flexShrink:0, padding:'11px 14px', background:'none', border:'none', cursor:'pointer',
            borderBottom:`2px solid ${tab === t.key ? C.gold : 'transparent'}`,
            fontFamily:UI, fontSize:12, fontWeight:600,
            color: tab === t.key ? C.gold : C.t3,
          }}>{t.label}</button>
        ))}
      </div>

      {tab === 'projector'  && <Projector />}
      {tab === 'accounts'   && <AccountsTab />}
      {tab === 'ss'         && <SSTab />}
      {tab === 'strategy'   && <StrategyTab />}
      {tab === 'resources'  && <ResourcesTab />}
    </div>
  )
}
