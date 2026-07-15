import { useState, useMemo } from 'react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip as ReTip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts'
import {
  ChevronDown, ChevronUp, Target, Shield, TrendingUp,
  BarChart2, Activity, BookOpen, CheckCircle2, AlertCircle,
} from 'lucide-react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'

const fmt  = n => '$' + Math.round(Math.abs(n||0)).toLocaleString()
const fmtK = n => n >= 1000000 ? `$${(n/1000000).toFixed(1)}M` : `$${(n/1000).toFixed(0)}K`

/* ── Pill tabs ──────────────────────────────────────────────── */
function PillTabs({ tabs, active, onChange, accent = C.indigo }) {
  return (
    <div style={{ display:'flex', gap:7, overflowX:'auto', scrollbarWidth:'none', padding:'0 16px' }}>
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)} style={{
          flexShrink:0, padding:'7px 14px', borderRadius:20,
          border:`1px solid ${active===t ? accent : C.b2}`,
          background: active===t ? `${accent}18` : C.surf, cursor:'pointer',
          fontFamily:UI, fontSize:12, fontWeight:active===t ? 700 : 500,
          color: active===t ? accent : C.t3,
        }}>{t}</button>
      ))}
    </div>
  )
}

/* ── Expand card ────────────────────────────────────────────── */
function ExpandCard({ title, subtitle, accent = C.indigo, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      border:`1px solid ${open ? accent+'50' : C.b2}`, borderRadius:12,
      overflow:'hidden', marginBottom:8,
    }}>
      <button onClick={() => setOpen(o=>!o)} style={{
        width:'100%', textAlign:'left', padding:'12px 14px', background:open ? `${accent}0c` : C.surf,
        border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:10,
      }}>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:open?C.t1:C.t2 }}>{title}</div>
          {subtitle && <div style={{ fontFamily:UI, fontSize:11, color:C.t3, marginTop:2 }}>{subtitle}</div>}
        </div>
        {open ? <ChevronUp size={14} color={accent}/> : <ChevronDown size={14} color={C.t3}/>}
      </button>
      {open && (
        <div style={{ padding:'12px 14px', borderTop:`1px solid ${accent}20`, background:'#1e1912' }}>
          {children}
        </div>
      )}
    </div>
  )
}

function InfoBox({ color=C.indigo, children }) {
  return (
    <div style={{ display:'flex', gap:8, padding:'10px 12px', background:`${color}0d`,
      border:`1px solid ${color}25`, borderRadius:9, marginTop:8 }}>
      <AlertCircle size={13} color={color} style={{ flexShrink:0, marginTop:1 }}/>
      <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65 }}>{children}</div>
    </div>
  )
}

/* ── Asset classes data ─────────────────────────────────────── */
const ASSET_CLASSES = [
  { name:'Cash & CDs',      risk:1, riskLabel:'Near Zero', color:'#64748b', return:'4–5%',          volatility:'~0%',      taxNote:'Interest taxed as ordinary income',                                         bestFor:'Emergency fund, goals under 2 years',            watchOut:'Inflation erosion. 3% inflation destroys purchasing power slowly.',  examples:['SGOV','BIL','SHV','VMFXX','SPAXX','T-Bills'] },
  { name:'Gov\'t Bonds',   risk:2, riskLabel:'Very Low',  color:C.teal,    return:'4–5%',          volatility:'2–5%',     taxNote:'Federal taxable, state tax-exempt (Treasuries)',                             bestFor:'Capital preservation, portfolio ballast',        watchOut:'Interest rate risk — prices fall when rates rise.',           examples:['TLT','IEF','SHY','BND','VGIT','GOVT'] },
  { name:'Corporate Bonds',risk:3, riskLabel:'Low',       color:'#06b6d4', return:'4–7%',          volatility:'3–8%',     taxNote:'Interest taxed as ordinary income',                                         bestFor:'Income generation, stable accounts',             watchOut:'Credit risk (default), especially high-yield.',              examples:['LQD','VCIT','HYG','JNK','IGIB','USIG'] },
  { name:'Index ETFs',     risk:4, riskLabel:'Medium',    color:'#3b82f6', return:'8–11%',         volatility:'15–18%',   taxNote:'Low turnover = minimal cap gain distributions. Very tax-efficient.',         bestFor:'Core of any portfolio — all account types. Best cost/return ratio.', watchOut:'No downside protection — you ride the market all the way down.', examples:['SPY','VOO','VTI','QQQ','DIA','IVV','SCHB'] },
  { name:'Dividend Stocks',risk:4, riskLabel:'Medium',    color:'#22c55e', return:'6–10%',         volatility:'12–18%',   taxNote:'Qualified divs: 0/15/20%. Non-qualified: ordinary income.',                 bestFor:'Income generation; Roth for tax-free compounding',watchOut:'Dividend cuts hurt price; sector concentration risk.',        examples:['SCHD','VYM','JEPI','DVY','KO','JNJ','PG'] },
  { name:'REITs',          risk:4, riskLabel:'Medium',    color:'#f97316', return:'7–12%',         volatility:'12–20%',   taxNote:'Dividends mostly ordinary income — hold in IRA/401k',                       bestFor:'Real estate exposure without buying property',   watchOut:'Rate sensitive, high tax drag in taxable accounts.',          examples:['VNQ','O','SCHH','IYR','REET','AMT','PLD'] },
  { name:'Growth Stocks',  risk:5, riskLabel:'High',      color:C.gold,    return:'0–40%+',        volatility:'25–60%',   taxNote:'Hold >1yr for LTCG rates. Short-term = ordinary income.',                  bestFor:'Long-term growth; Roth IRA is ideal',            watchOut:'Extreme volatility; many companies fail; requires discipline.', examples:['QQQ','VUG','NVDA','AAPL','MSFT','TSLA','AMZN'] },
  { name:'Precious Metals',risk:5, riskLabel:'High',      color:'#fbbf24', return:'2–8%',          volatility:'15–25%',   taxNote:'Physical gold taxed as collectibles — 28% max rate.',                       bestFor:'Inflation hedge, portfolio diversifier (5–10% max)',watchOut:'No cash flow; underperforms stocks long-term.',             examples:['GLD','IAU','SLV','PPLT','SGDM','GLDM'] },
  { name:'Cryptocurrency', risk:7, riskLabel:'Extreme',   color:'#ef4444', return:'-80% to +1000%',volatility:'60–150%+', taxNote:'Every trade is a taxable event. Very complex tax treatment.',               bestFor:'Speculation only — 1–5% max of portfolio',      watchOut:'Regulatory risk, 80%+ drawdowns common, exchange failures.',  examples:['IBIT','FBTC','ETHA','BTC','ETH','SOL'] },
]

function RiskDots({ level }) {
  return (
    <div style={{ display:'flex', gap:2 }}>
      {Array.from({length:7}, (_,i) => (
        <div key={i} style={{
          width:8, height:4, borderRadius:1,
          background: i < level ? (level<=2?C.teal:level<=3?'#3b82f6':level<=5?C.gold:level===6?'#f97316':'#ef4444') : C.b2,
        }}/>
      ))}
    </div>
  )
}

/* ── Asset location data ────────────────────────────────────── */
const LOCATION_ROWS = [
  { asset:'Bonds / Bond Funds (BND, TLT)',       taxDrag:'High — interest = ordinary income',      best:'Traditional 401k or IRA',          avoid:'Taxable brokerage',     why:'Defer ordinary income tax. Bonds generate the most annual tax drag.' },
  { asset:'REITs (VNQ, O)',                       taxDrag:'High — dividends = ordinary income',     best:'Roth IRA or Traditional IRA',      avoid:'Taxable brokerage',     why:'REIT dividends taxed at up to 37% — must shelter them.' },
  { asset:'Active Mutual Funds',                  taxDrag:'High — cap gain distributions annually', best:'Traditional IRA or 401k',          avoid:'Taxable brokerage',     why:'You get taxed on the fund\'s internal trades even if you don\'t sell.' },
  { asset:'Index ETFs (SPY, VTI, SCHB)',          taxDrag:'Low — minimal distributions',           best:'Taxable brokerage (or any acct)',   avoid:'Nothing — ETFs fine anywhere', why:'Low turnover = few taxable events. Works in any account.' },
  { asset:'Growth Stocks (held long-term)',        taxDrag:'Low if held >1yr',                      best:'Roth IRA (gains never taxed)',      avoid:'Traditional IRA/401k', why:'Long-term cap gains (0–20%) beat ordinary income (up to 37%).' },
  { asset:'High-Dividend Stocks (SCHD, JEPI)',    taxDrag:'Medium — qualified divs 0/15/20%',      best:'Roth IRA or Traditional IRA',      avoid:'Taxable if high income', why:'Shelter dividend income for long-term compounding.' },
  { asset:'Municipal Bonds (MUB)',                taxDrag:'None — interest is tax-exempt',         best:'Taxable brokerage',                avoid:'IRA/401k',              why:'Munis are self-sheltering. IRA wastes the tax exemption.' },
  { asset:'Cryptocurrency',                       taxDrag:'Extreme — every trade is taxable',      best:'Roth IRA (via crypto custodian)',   avoid:'Taxable brokerage',     why:'Every crypto trade in a brokerage is a taxable event. Roth eliminates this.' },
]

/* ── Priority ladder data ───────────────────────────────────── */
const LADDER = [
  { step:1, title:'401k — Employer Match', color:C.gold, Icon:Target,
    why:'Free money. A 50¢ match on 6% of $80K salary = $2,400 free each year. Instant 50% return.',
    how:'Contribute exactly enough to get 100% of employer match. Not a dollar less.',
    numbers:'$80K salary, 4% match → contribute $3,200, get $3,200 free. Best ROI in finance.' },
  { step:2, title:'HSA — Triple Tax Advantage', color:C.teal, Icon:Shield,
    why:'Only account with deductible contributions, tax-free growth, AND tax-free withdrawals for medical.',
    how:'Requires HDHP. 2026 limits: $4,400 individual / $8,750 family (+$1,000 catch-up age 55+).',
    numbers:'30-yr-old who maxes HSA and invests balance could accumulate $500K+ tax-free.' },
  { step:3, title:'Roth IRA — Max It Out', color:'#22c55e', Icon:TrendingUp,
    why:'Tax-free growth forever, no RMDs, most flexible account you\'ll ever have.',
    how:'2026: $7,500/yr ($8,600 if 50+). Income limits: $153K–$168K single / $242K–$252K MFJ.',
    numbers:'$7,500/yr for 30 years at 8% = $916K — completely tax-free.' },
  { step:4, title:'401k / Roth 401k — Fill the Rest', color:'#3b82f6', Icon:BarChart2,
    why:'$24,500/yr of tax-advantaged space. After match + Roth IRA, max the rest.',
    how:'$24,500 total 2026. $32,500 if 50+. Choose Traditional vs Roth based on your tax bracket.',
    numbers:'$24,500/yr for 30 years at 8% = $3.0M pre-tax.' },
  { step:5, title:'Taxable Brokerage — No Limit', color:'#f97316', Icon:Activity,
    why:'After maxing tax-advantaged accounts, brokerage offers unlimited capacity + full liquidity.',
    how:'Use tax-efficient vehicles: index ETFs, buy-and-hold stocks, municipal bonds. Avoid frequent trading.',
    numbers:'No contribution limit. Best for early retirement — no age restrictions.' },
  { step:6, title:'529 — Education Savings', color:'#a855f7', Icon:BookOpen,
    why:'Tax-free growth when used for qualified education expenses.',
    how:'No federal limit. Annual gift exclusion: $19,000/yr per beneficiary (2026).',
    numbers:'$500/mo for 18 years at 7% = $197K. SECURE 2.0: rollover $35K unused to Roth IRA.' },
]

/* ── Allocation models ──────────────────────────────────────── */
const MODELS = [
  { name:'Conservative', stocks:20, bonds:60, cash:10, alt:10, color:'#22c55e',
    desc:'Capital preservation focus. Minimal volatility. Suitable for short horizons or very risk-averse investors.',
    return:'4–6%', drawdown:'-10 to -15%', horizon:'0–5 years' },
  { name:'Moderate',     stocks:50, bonds:40, cash:5,  alt:5,  color:C.teal,
    desc:'Balanced growth and income. The classic 60/40 variant. Good for medium-term investors.',
    return:'6–8%', drawdown:'-20 to -30%', horizon:'5–10 years' },
  { name:'Aggressive',   stocks:80, bonds:15, cash:2,  alt:3,  color:C.indigo,
    desc:'Maximum long-term growth. High volatility tolerance required. 10+ year horizon.',
    return:'8–10%', drawdown:'-35 to -50%', horizon:'10–20 years' },
  { name:'All-Equity',   stocks:95, bonds:0,  cash:2,  alt:3,  color:C.gold,
    desc:'Pure equities for maximum compounding. Only suitable for long horizons with very high risk tolerance.',
    return:'9–11%', drawdown:'-40 to -57%', horizon:'20+ years' },
]

/* ── Charts ─────────────────────────────────────────────────── */
function DiversificationChart() {
  const data = Array.from({length:20}, (_,i) => ({
    assets: i+1, risk: Math.round(22/Math.sqrt(i+1) + (i===0?0:4))
  }))
  return (
    <ResponsiveContainer width="100%" height={140}>
      <AreaChart data={data} margin={{top:4,right:4,bottom:0,left:0}}>
        <CartesianGrid strokeDasharray="3 3" stroke={C.b1}/>
        <XAxis dataKey="assets" label={{value:'# Assets', position:'insideBottom', offset:-2, fill:C.t3, fontSize:9}} tick={{fill:C.t3,fontSize:9,fontFamily:MONO}}/>
        <YAxis tickFormatter={v=>`${v}%`} tick={{fill:C.t3,fontSize:9,fontFamily:MONO}} width={32}/>
        <ReTip formatter={v=>`${v}%`} contentStyle={{background:C.raise,border:`1px solid ${C.b2}`,borderRadius:6,fontFamily:UI,fontSize:11,color:C.t1}}/>
        <defs>
          <linearGradient id="divGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.indigo} stopOpacity={0.35}/>
            <stop offset="100%" stopColor={C.indigo} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="risk" name="Portfolio Volatility" stroke={C.indigo} strokeWidth={2} fill="url(#divGrad)" dot={false}/>
      </AreaChart>
    </ResponsiveContainer>
  )
}

function TimeInMarketChart() {
  const data = [
    { scenario:'Fully Invested', value:Math.round(100000*Math.pow(1.095,20)), color:'#22c55e' },
    { scenario:'Miss 10 Best',   value:Math.round(100000*Math.pow(1.062,20)), color:C.gold    },
    { scenario:'Miss 20 Best',   value:Math.round(100000*Math.pow(1.038,20)), color:'#f97316'  },
    { scenario:'Miss 30 Best',   value:Math.round(100000*Math.pow(1.016,20)), color:'#ef4444'  },
    { scenario:'Miss 40 Best',   value:Math.round(100000*Math.pow(0.996,20)), color:'#7f1d1d'  },
  ]
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} layout="vertical" margin={{top:4,right:4,bottom:0,left:0}}>
        <CartesianGrid strokeDasharray="3 3" stroke={C.b1} vertical={false}/>
        <XAxis type="number" tickFormatter={v=>fmtK(v)} tick={{fill:C.t3,fontSize:9,fontFamily:MONO}}/>
        <YAxis type="category" dataKey="scenario" width={90} tick={{fill:C.t2,fontSize:9,fontFamily:UI}}/>
        <ReTip formatter={v=>fmt(v)} contentStyle={{background:C.raise,border:`1px solid ${C.b2}`,borderRadius:6,fontFamily:UI,fontSize:11,color:C.t1}}/>
        <Bar dataKey="value" name="Final Value" radius={[0,4,4,0]}>
          {data.map((d,i) => <Cell key={i} fill={d.color}/>)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

/* ── Main component ─────────────────────────────────────────── */
export default function MPortfolio() {
  const [mainTab, setMainTab]   = useState('Learn')
  const [learnTab, setLearnTab] = useState('Models')
  const [calcTab, setCalcTab]   = useState('Drawdown')
  const [model, setModel]       = useState(1)

  // Models tab
  const m = MODELS[model]
  const pieSlices = [
    { name:'Stocks', value:m.stocks, color:m.color },
    { name:'Bonds',  value:m.bonds,  color:C.teal  },
    { name:'Cash',   value:m.cash,   color:'#22c55e' },
    { name:'Alt',    value:m.alt,    color:C.gold  },
  ].filter(d=>d.value>0)

  // Asset class selected
  const [selAC, setSelAC]     = useState(null)

  // Drawdown calc
  const [loss, setLoss]       = useState(30)
  const needed = ((1/(1-loss/100))-1)*100
  const historicalDrawdowns = [
    { label:'2022 Bear',       drawdown:-27, recovery:14  },
    { label:'2020 COVID',      drawdown:-34, recovery:5   },
    { label:'2018 Q4',         drawdown:-20, recovery:6   },
    { label:'2008–09 GFC',     drawdown:-57, recovery:48  },
    { label:'2000–02 Dot-com', drawdown:-49, recovery:84  },
    { label:'1987 Black Mon.', drawdown:-34, recovery:19  },
  ]

  // DCA vs Lump Sum calc
  const [amount, setAmount]   = useState(60000)
  const [dcaMonths, setDcaM]  = useState(12)
  const [retRate, setRet]     = useState(8)
  const [horizon, setHorizon] = useState(20)

  const dcaResult = useMemo(() => {
    const r = retRate/100
    const lumpFV = amount * Math.pow(1+r, horizon)
    const monthly = amount/dcaMonths
    let dcaFV = 0
    for (let mo=0; mo<dcaMonths; mo++) {
      const yrsRemaining = horizon - mo/12
      dcaFV += monthly * Math.pow(1+r, yrsRemaining)
    }
    return { lumpFV:Math.round(lumpFV), dcaFV:Math.round(dcaFV), diff:Math.round(lumpFV-dcaFV) }
  }, [amount, dcaMonths, retRate, horizon])

  return (
    <div style={{ background:C.bg, minHeight:'100dvh', paddingBottom:88 }}>
      <ScreenHeader title="Portfolio Management" subtitle="Learn" accent={C.indigo}/>

      {/* Main tabs */}
      <div style={{ display:'flex', borderBottom:`1px solid ${C.b2}`, padding:'0 16px', marginBottom:14 }}>
        {['Learn','Calculate'].map(t => (
          <button key={t} onClick={()=>setMainTab(t)} style={{
            flex:1, padding:'11px 0', background:'none', border:'none', cursor:'pointer',
            borderBottom:`2px solid ${mainTab===t ? C.indigo : 'transparent'}`,
            color:mainTab===t ? C.indigo : C.t3, fontFamily:UI, fontSize:13, fontWeight:600,
          }}>{t}</button>
        ))}
      </div>

      {/* ── LEARN ──────────────────────────────────────────── */}
      {mainTab === 'Learn' && (
        <>
          <PillTabs tabs={['Models','Asset Classes','Asset Location','Priority Ladder']}
            active={learnTab} onChange={setLearnTab} accent={C.indigo}/>
          <div style={{ marginTop:12 }}/>

          {/* Models */}
          {learnTab === 'Models' && (
            <>
              <div style={{ padding:'0 16px', display:'flex', gap:7, flexWrap:'wrap', marginBottom:10 }}>
                {MODELS.map((mod,i) => (
                  <button key={mod.name} onClick={()=>setModel(i)} style={{
                    padding:'7px 13px', borderRadius:10, border:`1px solid ${model===i?mod.color:C.b2}`,
                    background:model===i?`${mod.color}18`:C.surf, cursor:'pointer',
                    fontFamily:UI, fontSize:12, fontWeight:600, color:model===i?mod.color:C.t3,
                  }}>{mod.name}</button>
                ))}
              </div>
              <div style={{ padding:'0 16px' }}>
                <div style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, padding:14 }}>
                  <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:12 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:m.color, marginBottom:4 }}>{m.name} Portfolio</div>
                      <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.6 }}>{m.desc}</div>
                    </div>
                  </div>
                  {/* Allocation bars */}
                  {pieSlices.map(s => (
                    <div key={s.name} style={{ marginBottom:7 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                        <span style={{ fontFamily:UI, fontSize:11, color:C.t2 }}>{s.name}</span>
                        <span style={{ fontFamily:MONO, fontSize:12, fontWeight:700, color:s.color }}>{s.value}%</span>
                      </div>
                      <div style={{ height:5, background:C.b1, borderRadius:3 }}>
                        <div style={{ height:5, width:`${s.value}%`, background:s.color, borderRadius:3 }}/>
                      </div>
                    </div>
                  ))}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginTop:12 }}>
                    {[['Est. Return',m.return,C.indigo],['Max Drawdown',m.drawdown,'#ef4444'],['Horizon',m.horizon,C.gold]].map(([l,v,c])=>(
                      <div key={l} style={{ background:C.raise, borderRadius:9, padding:'8px 10px', textAlign:'center', border:`1px solid ${C.b2}` }}>
                        <div style={{ fontFamily:MONO, fontSize:12, fontWeight:700, color:c }}>{v}</div>
                        <div style={{ fontFamily:UI, fontSize:9, color:C.t3, marginTop:2, textTransform:'uppercase', letterSpacing:'0.06em' }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <MSectionHeader label="Why Diversification Works"/>
              <div style={{ padding:'0 16px' }}>
                <div style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, padding:14 }}>
                  <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.6, marginBottom:10 }}>
                    Portfolio volatility drops dramatically as you add uncorrelated assets — but the benefit plateaus around 20–30 holdings. Beyond that, diversification gains are minimal.
                  </div>
                  <DiversificationChart/>
                  <div style={{ fontFamily:UI, fontSize:11, color:C.t3, textAlign:'center', marginTop:6 }}>
                    Risk reduction vs. number of holdings
                  </div>
                </div>
              </div>

              <MSectionHeader label="Time in Market vs. Timing the Market"/>
              <div style={{ padding:'0 16px' }}>
                <div style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, padding:14 }}>
                  <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.6, marginBottom:10 }}>
                    Missing just the 10 best days in the market over 20 years nearly halves your final portfolio value. Those best days almost always follow the worst days — panic selling locks in losses and guarantees you miss the recovery.
                  </div>
                  <TimeInMarketChart/>
                  <div style={{ fontFamily:UI, fontSize:11, color:C.t3, textAlign:'center', marginTop:6 }}>
                    $100K invested for 20 years (S&P 9.5% avg) — impact of missing best days
                  </div>
                </div>
              </div>

              <MSectionHeader label="Rebalancing Strategies"/>
              <div style={{ padding:'0 16px' }}>
                {[
                  { t:'Calendar Rebalancing', d:'Rebalance quarterly or annually on a fixed schedule regardless of drift. Simple and systematic — takes emotion out of the decision.', c:C.indigo },
                  { t:'Threshold Rebalancing', d:'Rebalance when any asset class drifts ±5% from target. More responsive to market moves, fewer unnecessary trades in calm periods.', c:C.teal },
                  { t:'Opportunistic Rebalancing', d:'Combine rebalancing with tax-loss harvesting after major market moves. Requires more active monitoring but maximizes tax efficiency.', c:C.gold },
                ].map(item => (
                  <div key={item.t} style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:12, padding:14, marginBottom:8 }}>
                    <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:item.c, marginBottom:4 }}>{item.t}</div>
                    <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.6 }}>{item.d}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Asset Classes */}
          {learnTab === 'Asset Classes' && (
            <>
              <div style={{ padding:'0 16px', marginBottom:10 }}>
                <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.6 }}>
                  Every investment sits on a risk-return spectrum. Understanding where each asset class falls — and why — is the foundation of smart portfolio construction. Tap any card to see the full breakdown.
                </div>
              </div>
              <div style={{ padding:'0 16px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
                {ASSET_CLASSES.map((a,i) => (
                  <button key={i} onClick={()=>setSelAC(selAC===i?null:i)} style={{
                    textAlign:'left', padding:'10px 12px', borderRadius:10, cursor:'pointer',
                    border:`1px solid ${selAC===i?a.color:C.b2}`,
                    background:selAC===i?`${a.color}12`:C.surf,
                  }}>
                    <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:a.color, marginBottom:5 }}>{a.name}</div>
                    <RiskDots level={a.risk}/>
                    <div style={{ fontFamily:MONO, fontSize:10, color:C.t3, marginTop:4 }}>{a.return}</div>
                  </button>
                ))}
              </div>
              {selAC !== null && (
                <div style={{ padding:'0 16px', marginBottom:12 }}>
                  <div style={{ background:C.raise, border:`1px solid ${ASSET_CLASSES[selAC].color}40`, borderRadius:12, padding:14 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                      <div style={{ fontFamily:UI, fontSize:14, fontWeight:700, color:ASSET_CLASSES[selAC].color }}>{ASSET_CLASSES[selAC].name}</div>
                      <div style={{ fontFamily:MONO, fontSize:15, fontWeight:900, color:ASSET_CLASSES[selAC].color }}>{ASSET_CLASSES[selAC].return}</div>
                    </div>
                    <RiskDots level={ASSET_CLASSES[selAC].risk}/>
                    <div style={{ fontFamily:UI, fontSize:10, color:C.t3, marginBottom:10, marginTop:2 }}>RISK: {ASSET_CLASSES[selAC].riskLabel} · VOL: {ASSET_CLASSES[selAC].volatility}</div>
                    {[
                      ['Tax Treatment', ASSET_CLASSES[selAC].taxNote,   '#f97316'],
                      ['Best For',      ASSET_CLASSES[selAC].bestFor,   '#22c55e'],
                      ['Watch Out For', ASSET_CLASSES[selAC].watchOut,  '#ef4444'],
                    ].map(([l,v,c]) => (
                      <div key={l} style={{ background:C.surf, borderRadius:8, padding:'8px 10px', marginBottom:6, border:`1px solid ${C.b1}` }}>
                        <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:c, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:3 }}>{l}</div>
                        <div style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.55 }}>{v}</div>
                      </div>
                    ))}
                    {/* Example securities */}
                    <div style={{ background:C.surf, borderRadius:8, padding:'8px 10px', border:`1px solid ${C.b1}` }}>
                      <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:ASSET_CLASSES[selAC].color, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>Example Securities</div>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                        {ASSET_CLASSES[selAC].examples.map(ticker => (
                          <span key={ticker} style={{
                            fontFamily:MONO, fontSize:11, fontWeight:700,
                            color:ASSET_CLASSES[selAC].color,
                            background:`${ASSET_CLASSES[selAC].color}14`,
                            border:`1px solid ${ASSET_CLASSES[selAC].color}30`,
                            borderRadius:6, padding:'3px 8px',
                          }}>{ticker}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <InfoBox color={C.indigo}>
                Rule of thumb: match asset class risk level to your time horizon. For money you need in under 3 years, stay in cash/bonds. For 10+ years, equities win almost every time.
              </InfoBox>
              <div style={{ height:8 }}/>
            </>
          )}

          {/* Asset Location */}
          {learnTab === 'Asset Location' && (
            <>
              <div style={{ padding:'0 16px', marginBottom:10 }}>
                <div style={{ background:`${C.indigo}0d`, borderRadius:10, padding:'10px 12px', border:`1px solid ${C.indigo}22`, marginBottom:10 }}>
                  <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.indigo, marginBottom:3 }}>The Core Rule</div>
                  <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.6 }}>
                    Tax-inefficient assets (bonds, REITs, active funds) → Tax-advantaged accounts. Tax-efficient assets (index ETFs) → Taxable brokerage. Your highest-growth assets → Roth (gains never taxed).
                  </div>
                </div>
              </div>
              <div style={{ padding:'0 16px' }}>
                {LOCATION_ROWS.map((r,i) => (
                  <ExpandCard key={i} title={r.asset} subtitle={`Tax drag: ${r.taxDrag}`} accent={C.indigo}>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7 }}>
                      {[['Best Account',r.best,'#22c55e'],['Avoid',r.avoid,'#ef4444'],['Why',r.why,C.indigo]].map(([l,v,c])=>(
                        <div key={l} style={{ background:C.surf, borderRadius:7, padding:'7px 9px', border:`1px solid ${C.b1}` }}>
                          <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:c, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:2 }}>{l}</div>
                          <div style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.55 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </ExpandCard>
                ))}
              </div>
              <div style={{ height:8 }}/>
            </>
          )}

          {/* Priority Ladder */}
          {learnTab === 'Priority Ladder' && (
            <>
              <div style={{ padding:'0 16px', marginBottom:10 }}>
                <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65 }}>
                  The order in which you fund investment accounts dramatically affects your lifetime wealth. Follow this ladder to capture free money, maximize tax advantages, and never miss a critical opportunity.
                </div>
              </div>
              <div style={{ padding:'0 16px' }}>
                {LADDER.map((s, i) => {
                  const Icon = s.Icon
                  return (
                    <div key={s.step} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:6 }}>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                        <div style={{ width:32, height:32, borderRadius:'50%', background:`${s.color}20`, border:`2px solid ${s.color}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:UI, fontSize:13, fontWeight:800, color:s.color }}>{s.step}</div>
                        {i < LADDER.length-1 && <div style={{ width:2, height:20, background:`${s.color}30`, marginTop:4 }}/>}
                      </div>
                      <div style={{ flex:1 }}>
                        <ExpandCard title={s.title} accent={s.color}>
                          <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                            {[['Why This Step',s.why,s.color],['How',s.how,'#3b82f6'],['The Numbers',s.numbers,'#22c55e']].map(([l,v,c])=>(
                              <div key={l} style={{ background:C.surf, borderRadius:7, padding:'8px 10px', border:`1px solid ${C.b1}` }}>
                                <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:c, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:3 }}>{l}</div>
                                <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.55 }}>{v}</div>
                              </div>
                            ))}
                          </div>
                        </ExpandCard>
                      </div>
                    </div>
                  )
                })}
                <div style={{ background:`#22c55e09`, borderRadius:10, padding:'10px 12px', border:`1px solid #22c55e22`, marginTop:8 }}>
                  <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:'#22c55e', marginBottom:4 }}>The Bottom Line</div>
                  <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.6 }}>
                    A 30-year-old who follows this ladder — capturing employer match, maxing HSA + Roth IRA + 401k, investing in low-cost index funds — could accumulate $3–5M+ by retirement. The most important variable is starting. Not the market. Not fund selection. Starting early.
                  </div>
                </div>
              </div>
              <div style={{ height:8 }}/>
            </>
          )}
        </>
      )}

      {/* ── CALCULATE ──────────────────────────────────────── */}
      {mainTab === 'Calculate' && (
        <>
          <PillTabs tabs={['Drawdown Recovery','DCA vs Lump Sum']}
            active={calcTab} onChange={setCalcTab} accent={C.indigo}/>
          <div style={{ marginTop:12 }}/>

          {/* Drawdown Recovery */}
          {calcTab === 'Drawdown Recovery' && (
            <>
              <MSectionHeader label="Drawdown Recovery Calculator"/>
              <div style={{ padding:'0 16px' }}>
                <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.6, marginBottom:12 }}>
                  A 50% loss requires a 100% gain to recover. The math of losses is asymmetric — which is why avoiding catastrophic drawdowns matters as much as chasing returns.
                </div>
                <MCard style={{ background:C.raise }}>
                  <div style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:C.t1, marginBottom:6 }}>
                    Market Drawdown: <span style={{ fontFamily:MONO, color:'#ef4444' }}>{loss}%</span>
                  </div>
                  <input type="range" min={5} max={89} value={loss} onChange={e=>setLoss(+e.target.value)} style={{ width:'100%', accentColor:'#ef4444', marginBottom:12 }}/>
                  <div style={{ background:'#ef444409', border:'1px solid #ef444425', borderRadius:10, padding:'12px', textAlign:'center' }}>
                    <div style={{ fontFamily:UI, fontSize:10, color:C.t3, marginBottom:4, textTransform:'uppercase', letterSpacing:'0.08em' }}>Gain Required to Recover</div>
                    <div style={{ fontFamily:MONO, fontSize:28, fontWeight:900, color:'#ef4444' }}>+{needed.toFixed(1)}%</div>
                  </div>
                </MCard>
                <MSectionHeader label="Historical Drawdowns & Recovery Times"/>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  {historicalDrawdowns.map((d,i) => (
                    <div key={i} style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:10, padding:'10px 12px' }}>
                      <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.t1, marginBottom:6 }}>{d.label}</div>
                      <div style={{ display:'flex', justifyContent:'space-between' }}>
                        <div>
                          <div style={{ fontFamily:UI, fontSize:9, color:C.t3, textTransform:'uppercase' }}>Drawdown</div>
                          <div style={{ fontFamily:MONO, fontSize:16, fontWeight:800, color:'#ef4444' }}>{d.drawdown}%</div>
                        </div>
                        <div style={{ textAlign:'right' }}>
                          <div style={{ fontFamily:UI, fontSize:9, color:C.t3, textTransform:'uppercase' }}>Recovery</div>
                          <div style={{ fontFamily:MONO, fontSize:16, fontWeight:800, color:C.gold }}>{d.recovery}mo</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* DCA vs Lump Sum */}
          {calcTab === 'DCA vs Lump Sum' && (
            <>
              <MSectionHeader label="DCA vs. Lump Sum Calculator"/>
              <div style={{ padding:'0 16px' }}>
                <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.6, marginBottom:12 }}>
                  Research shows lump sum investing outperforms DCA approximately 2/3 of the time. But DCA reduces emotional risk in volatile markets. See how your numbers compare.
                </div>
                <MCard>
                  {[
                    { l:'Total Amount to Invest', v:amount,   sv:setAmount,   min:10000, max:500000, step:5000,  fmt:v=>`$${(v/1000).toFixed(0)}K` },
                    { l:'DCA Period (months)',    v:dcaMonths, sv:setDcaM,     min:1,     max:36,     step:1,     fmt:v=>`${v} mo` },
                    { l:'Annual Return (%)',      v:retRate,   sv:setRet,      min:1,     max:15,     step:0.5,   fmt:v=>`${v}%` },
                    { l:'Time Horizon (years)',   v:horizon,   sv:setHorizon,  min:5,     max:40,     step:1,     fmt:v=>`${v} yr` },
                  ].map(({l,v,sv,min,max,step,fmt:f}) => (
                    <div key={l} style={{ marginBottom:14 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                        <span style={{ fontFamily:UI, fontSize:12, color:C.t2, fontWeight:600 }}>{l}</span>
                        <span style={{ fontFamily:MONO, fontSize:13, color:C.indigo, fontWeight:700 }}>{f(v)}</span>
                      </div>
                      <input type="range" min={min} max={max} step={step} value={v} onChange={e=>sv(+e.target.value)} style={{ width:'100%', accentColor:C.indigo }}/>
                    </div>
                  ))}
                </MCard>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 }}>
                  {[
                    ['Lump Sum Value', fmtK(dcaResult.lumpFV), C.gold],
                    ['DCA Final Value', fmtK(dcaResult.dcaFV), '#3b82f6'],
                  ].map(([l,v,c]) => (
                    <div key={l} style={{ background:`${c}09`, border:`1px solid ${c}25`, borderRadius:10, padding:'10px', textAlign:'center' }}>
                      <div style={{ fontFamily:UI, fontSize:9, color:C.t3, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:3 }}>{l}</div>
                      <div style={{ fontFamily:MONO, fontSize:18, fontWeight:800, color:c }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background:dcaResult.diff>0?`${C.gold}09`:`#3b82f609`, border:`1px solid ${dcaResult.diff>0?C.gold:'#3b82f6'}25`, borderRadius:10, padding:'10px', textAlign:'center' }}>
                  <div style={{ fontFamily:UI, fontSize:9, color:C.t3, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:3 }}>
                    {dcaResult.diff>0 ? 'Lump Sum Advantage' : 'DCA Advantage'}
                  </div>
                  <div style={{ fontFamily:MONO, fontSize:22, fontWeight:900, color:dcaResult.diff>0?C.gold:'#3b82f6' }}>
                    {dcaResult.diff>0?'+':''}{fmtK(dcaResult.diff)}
                  </div>
                </div>
                <InfoBox color={C.indigo}>
                  Lump sum wins ~67% of the time historically. If you have the money, invest it. DCA is appropriate when you're genuinely uncertain about near-term volatility or need time to accumulate the capital.
                </InfoBox>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
