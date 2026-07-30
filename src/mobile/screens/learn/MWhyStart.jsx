import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import {
  Wallet, TrendingUp, Clock, Shield, FileText, Receipt, Home, CreditCard,
  ChevronDown, ChevronUp, AlertTriangle, ArrowRight, Flame, Zap,
} from 'lucide-react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { C, UI, MONO, DISPLAY } from '../../tokens'

const fmtK = n => {
  if (Math.abs(n) >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M'
  if (Math.abs(n) >= 1_000)     return '$' + Math.round(n / 1_000) + 'K'
  return '$' + Math.round(n).toLocaleString()
}

/* ── shared sub-components ─────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:C.t3, marginBottom:6 }}>
      {children}
    </div>
  )
}

function SectionHeadline({ children, color }) {
  return (
    <div style={{ fontFamily:DISPLAY, fontSize:22, fontWeight:700, color: color || C.t1, lineHeight:1.2, marginBottom:10 }}>
      {children}
    </div>
  )
}

function StatChip({ label, value, color }) {
  return (
    <div style={{ background:`${color}12`, border:`1px solid ${color}28`, borderRadius:12, padding:'10px 14px', textAlign:'center', flex:1 }}>
      <div style={{ fontFamily:MONO, fontSize:16, fontWeight:800, color, lineHeight:1 }}>{value}</div>
      <div style={{ fontFamily:UI, fontSize:10, color:C.t3, marginTop:4, lineHeight:1.3 }}>{label}</div>
    </div>
  )
}

function Callout({ icon: Icon, color, children }) {
  return (
    <div style={{ display:'flex', gap:10, padding:'12px 14px', background:`${color}10`, border:`1px solid ${color}28`, borderRadius:12, marginTop:12 }}>
      <Icon size={15} color={color} style={{ flexShrink:0, marginTop:1 }} />
      <p style={{ margin:0, fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65 }}>{children}</p>
    </div>
  )
}

function SliderRow({ label, value, min, max, step, onChange, display, color }) {
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
        <span style={{ fontFamily:UI, fontSize:12, color:C.t2, fontWeight:600 }}>{label}</span>
        <span style={{ fontFamily:MONO, fontSize:13, fontWeight:700, color: color || C.tangerine }}>{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(+e.target.value)}
        style={{ width:'100%', accentColor: color || C.tangerine }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION 1 — INFLATION
═══════════════════════════════════════════════════════════════════ */
function InflationSection() {
  const [rate, setRate] = useState(3)

  const data = useMemo(() => Array.from({ length: 31 }, (_, i) => ({
    yr:  i,
    two:   Math.round(100000 * Math.pow(0.98, i)),
    three: Math.round(100000 * Math.pow(0.97, i)),
    four:  Math.round(100000 * Math.pow(0.96, i)),
    six:   Math.round(100000 * Math.pow(0.94, i)),
  })), [])

  const chosen  = rate === 2 ? 'two' : rate === 3 ? 'three' : rate === 4 ? 'four' : 'six'
  const finalVal = data[30][chosen]
  const lost     = 100000 - finalVal

  const lineColor = rate === 2 ? C.sage : rate === 3 ? C.tangerine : rate === 4 ? '#e0573a' : C.down

  return (
    <div style={{ padding:'0 16px', marginBottom:28 }}>
      <SectionLabel>Section 1 of 3</SectionLabel>
      <SectionHeadline color={C.t1}>
        Your savings lose value every year — even in the bank.
      </SectionHeadline>
      <p style={{ fontFamily:UI, fontSize:13, color:C.t2, lineHeight:1.7, margin:'0 0 16px' }}>
        Inflation is the slow erosion of purchasing power. Even at a modest 3%, <strong>$100,000 today will only buy $41,000 worth of goods in 30 years.</strong> Your money isn't standing still — it's shrinking. The question is: are your investments outpacing that shrinkage?
      </p>

      {/* Rate selector */}
      <div style={{ display:'flex', gap:8, marginBottom:14 }}>
        {[2,3,4,6].map(r => (
          <button key={r} onClick={() => setRate(r)} style={{
            flex:1, padding:'8px 0', borderRadius:10,
            border:`1.5px solid ${rate === r ? lineColor : C.b1}`,
            background: rate === r ? `${lineColor}14` : C.surf,
            fontFamily:MONO, fontSize:12, fontWeight:700,
            color: rate === r ? lineColor : C.t3, cursor:'pointer',
          }}>{r}%</button>
        ))}
      </div>

      {/* Line chart */}
      <div style={{ height:180, marginBottom:10 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top:4, right:4, bottom:0, left:0 }}>
            <XAxis dataKey="yr" tick={{ fontFamily:MONO, fontSize:9, fill:C.t3 }} tickFormatter={v => v === 0 ? 'Now' : `${v}y`} axisLine={false} tickLine={false} interval={5} />
            <YAxis tick={{ fontFamily:MONO, fontSize:9, fill:C.t3 }} tickFormatter={fmtK} axisLine={false} tickLine={false} width={42} domain={[0, 100000]} />
            <Tooltip contentStyle={{ background:C.surf, border:`1px solid ${C.b1}`, borderRadius:8, fontFamily:UI, fontSize:11 }} labelStyle={{ color:C.t1, fontWeight:700 }} formatter={v => [fmtK(v), 'Purchasing Power']} labelFormatter={l => `Year ${l}`} />
            <ReferenceLine y={100000} stroke={C.b2} strokeDasharray="4 4" />
            <Line type="monotone" dataKey={chosen} stroke={lineColor} strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div style={{ display:'flex', gap:8, marginBottom:12 }}>
        <StatChip label="Started with" value="$100K" color={C.t2} />
        <StatChip label="Worth in 30 yrs" value={fmtK(finalVal)} color={lineColor} />
        <StatChip label="Lost to inflation" value={fmtK(lost)} color={C.down} />
      </div>

      <Callout icon={AlertTriangle} color={C.tangerine}>
        At {rate}% inflation over 30 years, you'd need <strong>${Math.round(100000 * Math.pow(1 + rate/100, 30)).toLocaleString()}</strong> just to match what $100,000 buys today. Keeping money in a low-yield savings account guarantees you fall behind.
      </Callout>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION 2 — COMPOUNDING
═══════════════════════════════════════════════════════════════════ */
function CompoundSection() {
  const [amount, setAmount] = useState(10000)
  const [years,  setYears]  = useState(30)

  const data = useMemo(() => Array.from({ length: years + 1 }, (_, i) => ({
    yr:   i,
    cons: Math.round(amount * Math.pow(1.05, i)),
    mod:  Math.round(amount * Math.pow(1.07, i)),
    aggr: Math.round(amount * Math.pow(1.10, i)),
  })), [amount, years])

  const end = data[years]

  return (
    <div style={{ padding:'0 16px', marginBottom:28 }}>
      <SectionLabel>Section 2 of 3</SectionLabel>
      <SectionHeadline>The snowball nobody tells you about.</SectionHeadline>
      <p style={{ fontFamily:UI, fontSize:13, color:C.t2, lineHeight:1.7, margin:'0 0 16px' }}>
        Compounding means your <em>returns earn returns</em>. The longer money grows, the faster it accelerates — not linearly, but exponentially. That's why starting early matters more than the amount you start with.
      </p>

      {/* Sliders */}
      <div style={{ background:C.surf, border:`1px solid ${C.b1}`, borderRadius:16, padding:'14px', marginBottom:14 }}>
        <SliderRow label="Starting Amount" value={amount} min={1000} max={100000} step={1000}
          onChange={setAmount} display={fmtK(amount)} color={C.tangerine} />
        <SliderRow label="Years" value={years} min={5} max={40} step={1}
          onChange={setYears} display={`${years} yrs`} color={C.indigo} />
      </div>

      {/* Chart */}
      <div style={{ height:190, marginBottom:12 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top:4, right:4, bottom:0, left:0 }}>
            <defs>
              <linearGradient id="gAggr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={C.sage}     stopOpacity={0.3} />
                <stop offset="95%" stopColor={C.sage}     stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gMod" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={C.tangerine} stopOpacity={0.25} />
                <stop offset="95%" stopColor={C.tangerine} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gCons" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={C.sky}      stopOpacity={0.3} />
                <stop offset="95%" stopColor={C.sky}      stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="yr" tick={{ fontFamily:MONO, fontSize:9, fill:C.t3 }} tickFormatter={v => `${v}y`} axisLine={false} tickLine={false} interval={Math.floor(years/4)} />
            <YAxis tick={{ fontFamily:MONO, fontSize:9, fill:C.t3 }} tickFormatter={fmtK} axisLine={false} tickLine={false} width={44} />
            <Tooltip contentStyle={{ background:C.surf, border:`1px solid ${C.b1}`, borderRadius:8, fontFamily:UI, fontSize:11 }}
              labelStyle={{ color:C.t1, fontWeight:700 }}
              formatter={(v, name) => [fmtK(v), name === 'aggr' ? '10% return' : name === 'mod' ? '7% return' : '5% return']}
              labelFormatter={l => `Year ${l}`} />
            <Area type="monotone" dataKey="aggr" stroke={C.sage}     strokeWidth={2} fill="url(#gAggr)" dot={false} />
            <Area type="monotone" dataKey="mod"  stroke={C.tangerine} strokeWidth={2} fill="url(#gMod)"  dot={false} />
            <Area type="monotone" dataKey="cons" stroke={C.sky}      strokeWidth={2} fill="url(#gCons)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend + results */}
      <div style={{ display:'flex', gap:8, marginBottom:12 }}>
        <div style={{ flex:1, background:`${C.sky}14`, border:`1px solid ${C.sky}30`, borderRadius:12, padding:'10px', textAlign:'center' }}>
          <div style={{ fontFamily:UI, fontSize:9, color:C.sky, fontWeight:700, marginBottom:2 }}>5% / yr</div>
          <div style={{ fontFamily:MONO, fontSize:14, fontWeight:800, color:C.t1 }}>{fmtK(end.cons)}</div>
        </div>
        <div style={{ flex:1, background:`${C.tangerine}12`, border:`1px solid ${C.tangerine}30`, borderRadius:12, padding:'10px', textAlign:'center' }}>
          <div style={{ fontFamily:UI, fontSize:9, color:C.tangerine, fontWeight:700, marginBottom:2 }}>7% / yr</div>
          <div style={{ fontFamily:MONO, fontSize:14, fontWeight:800, color:C.t1 }}>{fmtK(end.mod)}</div>
        </div>
        <div style={{ flex:1, background:`${C.sage}18`, border:`1px solid ${C.sage}30`, borderRadius:12, padding:'10px', textAlign:'center' }}>
          <div style={{ fontFamily:UI, fontSize:9, color:C.sage, fontWeight:700, marginBottom:2 }}>10% / yr</div>
          <div style={{ fontFamily:MONO, fontSize:14, fontWeight:800, color:C.t1 }}>{fmtK(end.aggr)}</div>
        </div>
      </div>

      <Callout icon={Zap} color={C.sage}>
        At 7% — the S&P 500's historical average after inflation — {fmtK(amount)} grows to <strong>{fmtK(end.mod)}</strong> in {years} years. You contributed {fmtK(amount)}. The market did the rest. Time is the ingredient money can't buy back.
      </Callout>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION 3 — START AGE EFFECT
═══════════════════════════════════════════════════════════════════ */
function StartAgeSection() {
  const [monthly, setMonthly] = useState(300)

  const r = 0.07 / 12

  const scenarios = useMemo(() => [
    { age:25, color: C.sage,      label:'Start at 25' },
    { age:35, color: C.tangerine, label:'Start at 35' },
    { age:45, color: C.indigo,    label:'Start at 45' },
  ].map(s => {
    const years = 65 - s.age
    const n = years * 12
    const fv = monthly * ((Math.pow(1 + r, n) - 1) / r)
    const contributed = monthly * n
    return { ...s, years, fv, contributed, growth: fv - contributed }
  }), [monthly])

  const maxFv = Math.max(...scenarios.map(s => s.fv))

  return (
    <div style={{ padding:'0 16px', marginBottom:28 }}>
      <SectionLabel>Section 3 of 3</SectionLabel>
      <SectionHeadline>Every year you wait is the most expensive decision you'll make.</SectionHeadline>
      <p style={{ fontFamily:UI, fontSize:13, color:C.t2, lineHeight:1.7, margin:'0 0 16px' }}>
        Investing the same amount monthly but starting a decade earlier can more than <em>double</em> your outcome by retirement. Not because of more money in — because of more <em>time</em> compounding.
      </p>

      <SliderRow label="Monthly Investment" value={monthly} min={50} max={2000} step={50}
        onChange={setMonthly} display={`$${monthly}/mo`} color={C.tangerine} />

      {/* Stat cards */}
      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:14 }}>
        {scenarios.map(s => (
          <div key={s.age} style={{ background:C.surf, border:`1.5px solid ${s.color}28`, borderRadius:14, padding:'14px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <div>
                <span style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:s.color, background:`${s.color}14`, borderRadius:20, padding:'2px 8px', marginRight:8 }}>{s.label}</span>
                <span style={{ fontFamily:UI, fontSize:11, color:C.t3 }}>{s.years} years of growth</span>
              </div>
              <div style={{ fontFamily:MONO, fontSize:17, fontWeight:800, color:s.color }}>{fmtK(s.fv)}</div>
            </div>
            {/* Bar */}
            <div style={{ height:8, background:C.raise, borderRadius:4, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${(s.fv/maxFv)*100}%`, background:s.color, borderRadius:4 }} />
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:5 }}>
              <span style={{ fontFamily:UI, fontSize:10, color:C.t3 }}>Contributed: <strong style={{ color:C.t2 }}>{fmtK(s.contributed)}</strong></span>
              <span style={{ fontFamily:UI, fontSize:10, color:C.t3 }}>Growth: <strong style={{ color:s.color }}>{fmtK(s.growth)}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* 10-year gap callout */}
      <div style={{ background:C.ink, borderRadius:16, padding:'16px', color:C.cream }}>
        <div style={{ fontFamily:DISPLAY, fontSize:17, fontWeight:700, marginBottom:6 }}>Starting at 25 vs 35</div>
        <div style={{ fontFamily:UI, fontSize:12, color:'rgba(250,246,237,0.75)', lineHeight:1.65, marginBottom:10 }}>
          Same ${monthly}/month. Same 7% return. Just 10 extra years.
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <div style={{ flex:1, background:'rgba(255,255,255,0.08)', borderRadius:10, padding:'10px', textAlign:'center' }}>
            <div style={{ fontFamily:MONO, fontSize:15, fontWeight:800, color:C.sage }}>{fmtK(scenarios[0].fv - scenarios[1].fv)}</div>
            <div style={{ fontFamily:UI, fontSize:10, color:'rgba(250,246,237,0.6)', marginTop:2 }}>extra at retirement</div>
          </div>
          <div style={{ flex:1, background:'rgba(255,255,255,0.08)', borderRadius:10, padding:'10px', textAlign:'center' }}>
            <div style={{ fontFamily:MONO, fontSize:15, fontWeight:800, color:C.tangerine }}>{fmtK(scenarios[1].contributed - scenarios[0].contributed > 0 ? 0 : scenarios[0].contributed - scenarios[1].contributed)}</div>
            <div style={{ fontFamily:UI, fontSize:10, color:'rgba(250,246,237,0.6)', marginTop:2 }}>less contributed</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION 4 — PLANNING MAP
═══════════════════════════════════════════════════════════════════ */
const CATEGORIES = [
  {
    Icon: Wallet, color: C.tangerine, tint: 'rgba(232,120,60,0.10)',
    title: 'Budgeting',
    sub: 'Tracking income vs. expenses to control active spending',
    bestFor: 'Anyone earning income — especially if you live paycheck to paycheck',
    why: [
      'Without a budget, lifestyle inflation silently consumes every raise you get',
      'Most people have no idea where 20–30% of their income actually goes',
      'A working budget is the foundation every other financial plan is built on',
    ],
    skip: 'Without it, you accumulate nothing — even on a high income. Debt fills the gaps.',
    path: '/learn/budgeting',
  },
  {
    Icon: TrendingUp, color: C.sage, tint: 'rgba(122,176,138,0.12)',
    title: 'Investing',
    sub: 'Growing wealth through stocks, bonds, and market assets',
    bestFor: 'Anyone with income they won\'t need for 5+ years',
    why: [
      'Savings accounts yield 4–5% max. Inflation runs 3%. You\'re barely breaking even.',
      'The S&P 500 has returned ~10%/yr historically — doubling every 7 years on average',
      'You don\'t need to pick stocks — index funds do the work for you',
    ],
    skip: 'You work for money your whole life. Investing is how you get money to work for you.',
    path: '/learn/investing',
  },
  {
    Icon: Clock, color: '#c9a96e', tint: 'rgba(201,169,110,0.12)',
    title: 'Retirement Planning',
    sub: 'Building the nest egg required for your post-work years',
    bestFor: 'Everyone with earned income — starting in your 20s is ideal, 30s is fine, 40s is urgent',
    why: [
      'Social Security replaces only ~30–40% of pre-retirement income — not enough',
      'The tax advantages of 401(k) and IRA accounts are worth tens of thousands over a lifetime',
      'Starting at 25 vs 35 can mean the difference between $1M and $500K at retirement',
    ],
    skip: 'You\'ll work until you physically can\'t — or depend on family and government support.',
    path: '/learn/retirement',
  },
  {
    Icon: Shield, color: C.sky, tint: 'rgba(122,184,212,0.12)',
    title: 'Insurance Planning',
    sub: 'Managing risk through life, health, and property coverage',
    bestFor: 'Anyone with dependents, a mortgage, or income others rely on',
    why: [
      'A single uninsured medical event costs an average of $30,000+ out of pocket',
      'If you die without life insurance, your family inherits your debt with no income to replace yours',
      'Disability is 3x more likely than death before retirement — most people have zero coverage',
    ],
    skip: 'One accident, illness, or death can erase decades of savings in months.',
    path: '/learn/insurance',
  },
  {
    Icon: FileText, color: C.plum, tint: 'rgba(107,58,92,0.10)',
    title: 'Estate Planning',
    sub: 'Structuring wills, trusts, and legacy wealth transfers',
    bestFor: 'Anyone with assets, children, or strong preferences about their legacy',
    why: [
      'Without a will, state intestacy laws decide who gets your assets — often not what you\'d choose',
      'Probate court can freeze your estate for 12–18 months, leaving family without access',
      'Trusts can pass assets directly to heirs, avoiding probate and reducing estate taxes',
    ],
    skip: 'The courts decide your legacy. The state becomes the executor. Family conflict follows.',
    path: '/learn/estate',
  },
  {
    Icon: Receipt, color: C.indigo, tint: 'rgba(129,140,248,0.10)',
    title: 'Tax Planning',
    sub: 'Minimizing lifetime tax burdens via strategic decisions',
    bestFor: 'Anyone who pays taxes — which is everyone with income',
    why: [
      'The average American pays 25–35% of their income to federal and state taxes',
      'Strategic use of Roth accounts, HSAs, and deductions can save $100K+ over a lifetime',
      'Tax-loss harvesting and bracket management are legal, powerful tools most people ignore',
    ],
    skip: 'You overpay taxes for decades — funding the government instead of your retirement.',
    path: '/learn/tax',
  },
  {
    Icon: Home, color: '#3b82f6', tint: 'rgba(59,130,246,0.10)',
    title: 'Real Estate Planning',
    sub: 'Managing primary home equity and investment properties',
    bestFor: 'Homeowners, aspiring buyers, or anyone considering real estate investment',
    why: [
      'Your home is likely your largest single asset — mismanaging it is costly',
      'Equity builds through appreciation and principal paydown — a forced savings mechanism',
      'Buying vs. renting is one of the most impactful financial decisions you\'ll make',
    ],
    skip: 'Underwater mortgage, missed equity growth, no exit strategy when you sell.',
    path: '/learn/purchases',
  },
  {
    Icon: CreditCard, color: C.down, tint: 'rgba(192,57,43,0.08)',
    title: 'Debt & Cash Flow Management',
    sub: 'Balancing liability payoffs while funding emergency reserves',
    bestFor: 'Anyone carrying consumer debt or without 3–6 months of expenses saved',
    why: [
      'Credit card interest at 20–25% APR is a guaranteed negative return — worse than any investment',
      'Without an emergency fund, one unexpected expense becomes a debt spiral',
      'Paying down high-interest debt is the highest guaranteed return available to you',
    ],
    skip: 'Interest compounds against you. One emergency triggers debt that takes years to escape.',
    path: '/learn/debt',
  },
]

function PlanCard({ cat, navigate }) {
  const [open, setOpen] = useState(false)
  const { Icon, color, tint, title, sub, bestFor, why, skip, path } = cat

  return (
    <div style={{ background:C.surf, border:`1.5px solid ${open ? color+'40' : C.b1}`, borderRadius:16, overflow:'hidden', marginBottom:8 }}>
      {/* Color bar */}
      <div style={{ height:3, background:`linear-gradient(90deg, ${color} 0%, transparent 70%)` }} />

      <button onClick={() => setOpen(v => !v)} style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'13px 14px', background:'none', border:'none', cursor:'pointer', textAlign:'left' }}>
        <div style={{ width:36, height:36, borderRadius:10, background:tint, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Icon size={17} color={color} strokeWidth={1.8} />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:UI, fontSize:14, fontWeight:700, color:C.t1, marginBottom:2 }}>{title}</div>
          <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.4, textOverflow:'ellipsis', overflow:'hidden', whiteSpace:'nowrap' }}>{sub}</div>
        </div>
        {open
          ? <ChevronUp size={15} color={color} style={{ flexShrink:0 }} />
          : <ChevronDown size={15} color={C.t3} style={{ flexShrink:0 }} />}
      </button>

      {open && (
        <div style={{ padding:'0 14px 14px', borderTop:`1px solid ${C.b1}` }}>
          {/* Best for */}
          <div style={{ marginTop:10, marginBottom:10, fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.55 }}>
            <span style={{ fontWeight:700, color:C.t1 }}>Best for: </span>{bestFor}
          </div>

          {/* Why list */}
          <div style={{ marginBottom:10 }}>
            {why.map((w, i) => (
              <div key={i} style={{ display:'flex', gap:8, alignItems:'flex-start', marginBottom:6 }}>
                <div style={{ width:5, height:5, borderRadius:'50%', background:color, flexShrink:0, marginTop:5 }} />
                <span style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.55 }}>{w}</span>
              </div>
            ))}
          </div>

          {/* Skip callout */}
          <div style={{ display:'flex', gap:8, padding:'10px 12px', background:'rgba(192,57,43,0.07)', border:'1px solid rgba(192,57,43,0.18)', borderRadius:10, marginBottom:12 }}>
            <AlertTriangle size={13} color={C.down} style={{ flexShrink:0, marginTop:1 }} />
            <p style={{ margin:0, fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.6 }}>
              <strong style={{ color:C.down }}>If you skip it: </strong>{skip}
            </p>
          </div>

          {/* Navigate */}
          <button onClick={() => navigate(path)} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, width:'100%', padding:'11px 0', background:color, border:'none', borderRadius:10, fontFamily:UI, fontSize:13, fontWeight:700, color:'#fff', cursor:'pointer' }}>
            Explore {title} <ArrowRight size={14} color="#fff" />
          </button>
        </div>
      )}
    </div>
  )
}

function PlanningMap({ navigate }) {
  return (
    <div style={{ padding:'0 16px', marginBottom:24 }}>
      <SectionLabel>Your Planning Map</SectionLabel>
      <SectionHeadline>Which areas apply to you — and why they matter.</SectionHeadline>
      <p style={{ fontFamily:UI, fontSize:13, color:C.t2, lineHeight:1.7, margin:'0 0 14px' }}>
        You don't need to tackle everything at once. Start with what's most relevant to your life right now. Tap each category to see why it matters and what happens if you skip it.
      </p>
      {CATEGORIES.map(cat => (
        <PlanCard key={cat.title} cat={cat} navigate={navigate} />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════════════ */
export default function MWhyStart() {
  const navigate = useNavigate()

  return (
    <div style={{ background:C.bg, minHeight:'100dvh', paddingBottom:100 }}>
      <ScreenHeader title="Why Should I Start?" subtitle="Learn" accent={C.tangerine} />

      {/* Intro hero */}
      <div style={{ margin:'16px 16px 20px', background:C.ink, borderRadius:20, padding:'22px 20px' }}>
        <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(250,246,237,0.5)', marginBottom:8 }}>
          The foundation
        </div>
        <div style={{ fontFamily:DISPLAY, fontSize:22, fontWeight:700, color:C.cream, lineHeight:1.25, marginBottom:10 }}>
          Your money is always moving. Make sure it's moving in the right direction.
        </div>
        <p style={{ fontFamily:UI, fontSize:12, color:'rgba(250,246,237,0.72)', lineHeight:1.7, margin:0 }}>
          Whether you know it or not, financial forces are already at work on your money — inflation, taxes, interest, and time. Understanding them is the difference between building wealth and watching it erode.
        </p>
        <div style={{ display:'flex', gap:8, marginTop:14, flexWrap:'wrap' }}>
          {['Inflation', 'Compounding', 'Starting Age', 'Your Plan'].map((label, i) => (
            <div key={i} style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:C.cream, background:'rgba(255,255,255,0.12)', borderRadius:20, padding:'4px 10px' }}>
              {i+1}. {label}
            </div>
          ))}
        </div>
      </div>

      <InflationSection />

      {/* Divider */}
      <div style={{ height:1, background:C.b1, margin:'0 16px 28px' }} />

      <CompoundSection />

      <div style={{ height:1, background:C.b1, margin:'0 16px 28px' }} />

      <StartAgeSection />

      <div style={{ height:1, background:C.b1, margin:'0 16px 28px' }} />

      <PlanningMap navigate={navigate} />
    </div>
  )
}
