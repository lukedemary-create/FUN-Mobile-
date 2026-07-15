import { useState, useCallback } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Home, Utensils, Car, Zap, Heart, Coffee, Tv, ShoppingBag, PiggyBank, TrendingUp, Shield, Info, AlertCircle, CheckCircle2 } from 'lucide-react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { C, UI, MONO, DISPLAY } from '../../tokens'

/* ── helpers ─────────────────────────────────────────────────────── */
function fmt(n) { return '$' + Math.round(Math.abs(n)).toLocaleString() }
function pct(v, t) { return t ? Math.round((v / t) * 100) : 0 }

/* ── shared sub-components ──────────────────────────────────────── */
function InfoBox({ children, color = C.indigo }) {
  return (
    <div style={{ display:'flex', gap:9, padding:'10px 12px', background:`${color}10`, border:`1px solid ${color}28`, borderRadius:10, marginTop:10 }}>
      <Info size={13} color={color} style={{ flexShrink:0, marginTop:2 }} />
      <span style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65 }}>{children}</span>
    </div>
  )
}

function NumInput({ label, value, onChange, prefix='$', suffix, min=0, step=1, hint }) {
  return (
    <div style={{ marginBottom:12 }}>
      {label && <div style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:C.t1, marginBottom:5 }}>{label}</div>}
      <div style={{ position:'relative' }}>
        {prefix && <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:C.t3, fontSize:13, pointerEvents:'none' }}>{prefix}</span>}
        <input type="number" value={value} min={min} step={step} onChange={e => onChange(Number(e.target.value))}
          style={{ width:'100%', padding:`9px ${suffix?'2rem':'10px'} 9px ${prefix?'1.5rem':'10px'}`, border:`1.5px solid ${C.b2}`, borderRadius:9, fontSize:14, fontFamily:UI, color:C.t1, fontWeight:600, background:C.raise, boxSizing:'border-box' }} />
        {suffix && <span style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', color:C.t3, fontSize:12, pointerEvents:'none' }}>{suffix}</span>}
      </div>
      {hint && <div style={{ fontFamily:UI, fontSize:11, color:C.t3, marginTop:3 }}>{hint}</div>}
    </div>
  )
}

function ResultBadge({ label, value, color = C.indigo, large }) {
  return (
    <div style={{ background:`${color}10`, border:`1px solid ${color}28`, borderRadius:12, padding: large ? '14px 10px' : '10px 12px', textAlign:'center' }}>
      <div style={{ fontFamily:MONO, fontSize: large ? 26 : 18, fontWeight:700, color, lineHeight:1.1 }}>{value}</div>
      <div style={{ fontFamily:UI, fontSize:10, color:C.t3, marginTop:3 }}>{label}</div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   LEARN TAB
══════════════════════════════════════════════════════════════════ */

const PAYCHECK_SEGMENTS = [
  { label:'Net Pay (Take-Home)',   pct:70.7, color:C.teal,     desc:'What lands in your bank account after all deductions',           ex:'$3,535' },
  { label:'Federal Income Tax',   pct:12,   color:'#3b82f6',  desc:'Withheld based on your W-4 and marginal tax bracket',            ex:'$600' },
  { label:'FICA (SS + Medicare)', pct:7.65, color:'#8b5cf6',  desc:'Social Security 6.2% + Medicare 1.45% — always fixed',           ex:'$383' },
  { label:'State Income Tax',     pct:5,    color:'#f59e0b',  desc:'Varies by state — ranges from 0% (TX, FL) to 13%+ (CA)',         ex:'$250' },
  { label:'Benefits & 401(k)',    pct:4.65, color:C.t3,       desc:'Health insurance premiums + voluntary retirement contributions',  ex:'$232' },
]

function PaycheckDiagram() {
  const [hovered, setHovered] = useState(null)
  return (
    <div>
      <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65, marginBottom:12 }}>
        Your <strong style={{ color:C.t1 }}>gross pay</strong> is what you earn before deductions. Your <strong style={{ color:C.teal }}>net pay</strong> is what you actually take home. The gap can be surprisingly large.
        <em style={{ color:C.t3, fontSize:11 }}> Example based on $5,000/month gross income.</em>
      </div>
      <div style={{ display:'flex', height:44, borderRadius:8, overflow:'hidden', marginBottom:12 }}>
        {PAYCHECK_SEGMENTS.map((s, i) => (
          <div key={i} onTouchStart={() => setHovered(i)} onTouchEnd={() => setHovered(null)}
            style={{ width:`${s.pct}%`, background:s.color, display:'flex', alignItems:'center', justifyContent:'center',
              filter: hovered===i ? 'brightness(1.15)' : 'brightness(1)' }}>
            {s.pct > 8 && <span style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:'#fff' }}>{Math.round(s.pct)}%</span>}
          </div>
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {PAYCHECK_SEGMENTS.map((s, i) => (
          <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, padding:'6px 8px', borderRadius:8,
            background: hovered===i ? `${s.color}10` : 'transparent' }}>
            <div style={{ width:10, height:10, borderRadius:3, background:s.color, flexShrink:0, marginTop:3 }} />
            <div style={{ flex:1 }}>
              <span style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:C.t1 }}>{s.label}</span>
              <span style={{ fontFamily:UI, fontSize:11, color:C.t3 }}> — {s.desc}</span>
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div style={{ fontFamily:MONO, fontSize:12, fontWeight:700, color:s.color }}>{s.pct}%</div>
              <div style={{ fontFamily:MONO, fontSize:10, color:C.t3 }}>{s.ex}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const INCOME_TYPES = [
  { type:'W-2 (Employee)',       color:C.teal,    tags:['Most common','Taxes withheld automatically'],
    desc:'Your employer withholds taxes before paying you. You receive a W-2 at year end. Benefits like health insurance and 401(k) matching often included.',
    tip:'Max out your 401(k) match first — it\'s an instant 50–100% return on that money.' },
  { type:'1099 (Self-Employed)', color:'#8b5cf6', tags:['Freelance / contractor','Taxes NOT withheld'],
    desc:'You receive gross pay with no withholding. You owe self-employment tax (15.3% on top of income tax) and must make quarterly estimated payments.',
    tip:'Set aside 25–30% of every 1099 payment immediately. Open a SEP-IRA for significant tax deductions.' },
  { type:'Passive Income',       color:'#f59e0b', tags:['Rental, dividends, interest'],
    desc:'Income earned with minimal ongoing effort. Rental income, dividends, capital gains, and interest. Tax treatment varies by type.',
    tip:'Qualified dividends are taxed at preferential capital gains rates — often lower than ordinary income.' },
]

const PIE_DATA = [
  { name:'Needs — 50%',         value:50, color:'#4a7c59', desc:'Rent/mortgage, groceries, utilities, transportation, minimum debt payments, insurance' },
  { name:'Wants — 30%',         value:30, color:C.gold,    desc:'Dining out, streaming, hobbies, travel, shopping, gym memberships, entertainment' },
  { name:'Savings & Debt — 20%',value:20, color:C.indigo,  desc:'Emergency fund, retirement contributions, investments, extra debt payments, future goals' },
]

function LearnTab() {
  return (
    <div style={{ padding:'14px 16px 0' }}>

      {/* Gross vs Net Pay */}
      <div style={{ fontFamily:DISPLAY, fontSize:16, fontWeight:700, color:C.t1, marginBottom:4 }}>Gross vs. Net Pay</div>
      <div style={{ fontFamily:UI, fontSize:12, color:C.t3, marginBottom:12 }}>Understanding what you actually take home is the foundation of every budget.</div>
      <div style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, padding:'14px', marginBottom:16 }}>
        <PaycheckDiagram />
      </div>

      {/* Income Types */}
      <div style={{ fontFamily:DISPLAY, fontSize:16, fontWeight:700, color:C.t1, marginBottom:4 }}>Types of Income</div>
      <div style={{ fontFamily:UI, fontSize:12, color:C.t3, marginBottom:12 }}>Not all income is taxed the same way — knowing your type changes how you budget and plan.</div>
      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:16 }}>
        {INCOME_TYPES.map((t, i) => (
          <div key={i} style={{ border:`1.5px solid ${t.color}28`, borderRadius:12, overflow:'hidden' }}>
            <div style={{ padding:'10px 14px', background:`${t.color}08`, borderBottom:`1px solid ${t.color}18`, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:6 }}>
              <span style={{ fontFamily:DISPLAY, fontSize:14, fontWeight:700, color:C.t1 }}>{t.type}</span>
              <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                {t.tags.map(tag => (
                  <span key={tag} style={{ padding:'2px 8px', background:`${t.color}18`, border:`1px solid ${t.color}30`, borderRadius:100, fontFamily:UI, fontSize:10, fontWeight:700, color:t.color }}>{tag}</span>
                ))}
              </div>
            </div>
            <div style={{ padding:'10px 14px' }}>
              <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65, marginBottom:8 }}>{t.desc}</div>
              <div style={{ display:'flex', gap:7, padding:'8px 10px', background:`${t.color}0d`, borderRadius:8 }}>
                <Info size={12} color={t.color} style={{ flexShrink:0, marginTop:2 }} />
                <span style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.6 }}><strong>Pro tip:</strong> {t.tip}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 50/30/20 Rule */}
      <div style={{ fontFamily:DISPLAY, fontSize:16, fontWeight:700, color:C.t1, marginBottom:4 }}>The 50/30/20 Rule</div>
      <div style={{ fontFamily:UI, fontSize:12, color:C.t3, marginBottom:12 }}>Allocate 50% of take-home to needs, 30% to wants, 20% to savings and debt. A starting point — not a straitjacket.</div>
      <div style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, padding:'14px', marginBottom:16 }}>
        <div style={{ height:200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {PIE_DATA.map((d, i) => <Cell key={i} fill={d.color} stroke="none" />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background:C.raise, border:`1px solid ${C.b2}`, borderRadius:8, fontFamily:UI, fontSize:12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {PIE_DATA.map((d, i) => (
            <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
              <div style={{ width:12, height:12, borderRadius:3, background:d.color, flexShrink:0, marginTop:3 }} />
              <div>
                <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.t1, marginBottom:2 }}>{d.name}</div>
                <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.55 }}>{d.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   CALCULATE TAB — 5 calculators
══════════════════════════════════════════════════════════════════ */

/* Budget Builder */
const DEFAULT_CATS = [
  { id:'rent',   label:'Rent / Mortgage',    group:'needs',   Icon:Home,       default:1500 },
  { id:'food',   label:'Groceries',          group:'needs',   Icon:Utensils,   default:400  },
  { id:'trans',  label:'Transportation',     group:'needs',   Icon:Car,        default:350  },
  { id:'util',   label:'Utilities',          group:'needs',   Icon:Zap,        default:150  },
  { id:'health', label:'Healthcare',         group:'needs',   Icon:Heart,      default:200  },
  { id:'dining', label:'Dining Out',         group:'wants',   Icon:Coffee,     default:200  },
  { id:'ent',    label:'Entertainment',      group:'wants',   Icon:Tv,         default:100  },
  { id:'shop',   label:'Shopping',           group:'wants',   Icon:ShoppingBag,default:150  },
  { id:'subs',   label:'Subscriptions',      group:'wants',   Icon:Tv,         default:50   },
  { id:'efund',  label:'Emergency Fund',     group:'savings', Icon:Shield,     default:200  },
  { id:'invest', label:'Retirement / Invest.',group:'savings', Icon:TrendingUp, default:300  },
  { id:'goals',  label:'Other Goals',        group:'savings', Icon:PiggyBank,  default:100  },
]
const GROUP_META = {
  needs:   { label:'Needs',          target:0.50, color:'#4a7c59' },
  wants:   { label:'Wants',          target:0.30, color:C.gold    },
  savings: { label:'Savings & Debt', target:0.20, color:C.indigo  },
}

function BudgetBuilder() {
  const [income, setIncome] = useState(4000)
  const [cats, setCats] = useState(() => Object.fromEntries(DEFAULT_CATS.map(c => [c.id, c.default])))
  const update = useCallback((id, val) => setCats(prev => ({ ...prev, [id]: Math.max(0, val) })), [])

  const groupTotals = Object.fromEntries(
    ['needs','wants','savings'].map(g => [g, DEFAULT_CATS.filter(c => c.group===g).reduce((s,c) => s+(cats[c.id]||0), 0)])
  )
  const totalExp = Object.values(groupTotals).reduce((a,b) => a+b, 0)
  const surplus = income - totalExp
  const surplusPos = surplus >= 0

  return (
    <div>
      <NumInput label="Monthly Take-Home Income" value={income} onChange={setIncome} min={0} step={100} hint="Use your net (after-tax) income" />
      {['needs','wants','savings'].map(g => {
        const meta = GROUP_META[g]
        const target = income * meta.target
        const actual = groupTotals[g]
        const over = actual > target
        return (
          <div key={g} style={{ border:`1.5px solid ${meta.color}28`, borderRadius:12, overflow:'hidden', marginBottom:10 }}>
            <div style={{ padding:'8px 12px', background:`${meta.color}0c`, borderBottom:`1px solid ${meta.color}18`,
              display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <span style={{ fontFamily:UI, fontWeight:700, color:C.t1, fontSize:13 }}>{meta.label}</span>
                <span style={{ fontFamily:UI, fontSize:11, color:C.t3, marginLeft:6 }}>({Math.round(meta.target*100)}% target)</span>
              </div>
              <div style={{ textAlign:'right' }}>
                <span style={{ fontFamily:MONO, fontSize:13, fontWeight:800, color: over ? C.danger : meta.color }}>{fmt(actual)}</span>
                <span style={{ fontFamily:MONO, fontSize:10, color:C.t3, marginLeft:4 }}>/ {fmt(target)}</span>
              </div>
            </div>
            {/* progress bar */}
            <div style={{ margin:'6px 12px 0' }}>
              <div style={{ height:4, background:C.b2, borderRadius:99, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${Math.min((actual/target)*100,100)}%`, background: over ? C.danger : meta.color, borderRadius:99, transition:'width 0.3s' }} />
              </div>
            </div>
            <div style={{ padding:'4px 0 6px' }}>
              {DEFAULT_CATS.filter(c => c.group===g).map(cat => {
                const Icon = cat.Icon
                return (
                  <div key={cat.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 12px' }}>
                    <Icon size={12} color={meta.color} style={{ flexShrink:0 }} />
                    <span style={{ flex:1, fontFamily:UI, fontSize:12, color:C.t2 }}>{cat.label}</span>
                    <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                      <button onClick={() => update(cat.id, (cats[cat.id]||0)-25)}
                        style={{ width:22, height:22, border:`1px solid ${C.b2}`, borderRadius:6, background:C.raise, cursor:'pointer', color:C.t3, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>−</button>
                      <input type="number" value={cats[cat.id]||0} onChange={e => update(cat.id, Number(e.target.value))}
                        style={{ width:64, textAlign:'center', border:`1.5px solid ${C.b2}`, borderRadius:6, padding:'3px 4px', fontFamily:MONO, fontSize:12, fontWeight:600, color:C.t1, background:C.raise }} />
                      <button onClick={() => update(cat.id, (cats[cat.id]||0)+25)}
                        style={{ width:22, height:22, border:`1px solid ${C.b2}`, borderRadius:6, background:C.raise, cursor:'pointer', color:meta.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>+</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
      <div style={{ padding:'14px', background: surplusPos ? 'rgba(74,124,89,0.08)' : 'rgba(192,57,43,0.08)',
        border:`1.5px solid ${surplusPos ? '#4a7c5940' : '#c0392b40'}`, borderRadius:12,
        display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
        <div>
          <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:C.t3, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:3 }}>
            Monthly {surplusPos ? 'Surplus' : 'Deficit'}
          </div>
          <div style={{ fontFamily:MONO, fontSize:28, fontWeight:700, color: surplusPos ? '#4a7c59' : C.danger, letterSpacing:'-0.02em' }}>
            {surplusPos ? '+' : ''}{fmt(surplus)}
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <div style={{ textAlign:'center', padding:'8px 12px', background:C.raise, borderRadius:9, border:`1px solid ${C.b2}` }}>
            <div style={{ fontFamily:UI, fontSize:10, color:C.t3 }}>Total Expenses</div>
            <div style={{ fontFamily:MONO, fontSize:14, fontWeight:700, color:C.t1 }}>{fmt(totalExp)}</div>
          </div>
          <div style={{ textAlign:'center', padding:'8px 12px', background:C.raise, borderRadius:9, border:`1px solid ${C.b2}` }}>
            <div style={{ fontFamily:UI, fontSize:10, color:C.t3 }}>Savings Rate</div>
            <div style={{ fontFamily:MONO, fontSize:14, fontWeight:700, color:C.indigo }}>{pct(groupTotals.savings, income)}%</div>
          </div>
        </div>
      </div>
      {!surplusPos && (
        <div style={{ marginTop:10, display:'flex', gap:8, padding:'10px 12px', background:'rgba(192,57,43,0.06)', borderRadius:10, border:`1px solid rgba(192,57,43,0.25)` }}>
          <AlertCircle size={14} color={C.danger} style={{ flexShrink:0, marginTop:1 }} />
          <span style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.6 }}>Spending exceeds income. Reduce Wants first, then revisit fixed costs.</span>
        </div>
      )}
    </div>
  )
}

/* Emergency Fund */
function EmergencyFundCalc() {
  const [monthly, setMonthly] = useState(3000)
  const [months,  setMonths]  = useState(3)
  const [savePer, setSavePer] = useState(300)
  const target = monthly * months
  const toReach = savePer > 0 ? Math.ceil(target / savePer) : 0
  const recColor = months < 3 ? C.danger : months <= 6 ? C.teal : C.success
  const recLabel = months < 3 ? 'too low' : months <= 6 ? 'recommended' : 'very safe'
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 12px' }}>
        <NumInput label="Monthly Expenses" value={monthly} onChange={setMonthly} step={100} />
        <NumInput label="Monthly Contribution" value={savePer} onChange={setSavePer} step={50} hint="How much you can save/month" />
      </div>
      <div style={{ marginBottom:14 }}>
        <div style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:C.t1, marginBottom:6 }}>
          Months to cover: <span style={{ color:recColor, fontWeight:700 }}>{months} mo ({recLabel})</span>
        </div>
        <input type="range" min={1} max={12} step={1} value={months} onChange={e => setMonths(Number(e.target.value))}
          style={{ width:'100%', accentColor:C.teal }} />
        <div style={{ display:'flex', justifyContent:'space-between', fontFamily:UI, fontSize:10, color:C.t3, marginTop:3 }}>
          <span>1 mo</span><span>3 mo (min)</span><span>6 mo (ideal)</span><span>12 mo</span>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
        <ResultBadge label="Target Fund Size" value={fmt(target)} color={C.teal} large />
        <ResultBadge label="Months to Goal" value={savePer > 0 ? `${toReach} mo` : '—'} color={C.indigo} large />
      </div>
      <InfoBox color={C.teal}>
        <strong>Where to keep it:</strong> A high-yield savings account (HYSA) — currently 4.5–5% APY at online banks like Marcus, Ally, or SoFi. Keep it separate from checking.
      </InfoBox>
    </div>
  )
}

/* Savings Rate */
function SavingsRateCalc() {
  const [income,  setIncome]  = useState(4000)
  const [savings, setSavings] = useState(600)
  const rate = income > 0 ? Math.round((savings/income)*100) : 0
  const rateColor = rate < 10 ? C.danger : rate < 15 ? C.warning : rate < 20 ? C.teal : C.success
  const rateLabel = rate < 10 ? 'Below minimum' : rate < 15 ? 'Good start — push to 15%' : rate < 20 ? 'On track' : 'Excellent'
  const BENCHMARKS = [
    { label:'10%',  desc:'Bare minimum for long-term security',    pct:10, color:C.warning },
    { label:'15%',  desc:'Standard retirement recommendation',     pct:15, color:C.teal    },
    { label:'20%',  desc:'50/30/20 savings target',                pct:20, color:C.success },
    { label:'25%+', desc:'Financial independence accelerator',     pct:25, color:C.indigo  },
  ]
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 12px' }}>
        <NumInput label="Monthly Take-Home" value={income}  onChange={setIncome}  step={100} />
        <NumInput label="Monthly Savings"   value={savings} onChange={setSavings} step={25} hint="401(k) + IRA + brokerage + e-fund" />
      </div>
      <ResultBadge label={rateLabel} value={`${rate}%`} color={rateColor} large />
      <div style={{ marginTop:12, display:'flex', flexDirection:'column', gap:6 }}>
        {BENCHMARKS.map(b => {
          const achieved = rate >= b.pct
          return (
            <div key={b.label} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px',
              background: achieved ? `${b.color}0d` : C.raise, borderRadius:9, border:`1px solid ${achieved ? b.color+'28' : C.b2}` }}>
              {achieved ? <CheckCircle2 size={14} color={b.color} /> : <div style={{ width:14, height:14, borderRadius:'50%', border:`1.5px solid ${C.b2}`, flexShrink:0 }} />}
              <span style={{ fontFamily:MONO, fontSize:13, fontWeight:700, color:b.color, width:34, flexShrink:0 }}>{b.label}</span>
              <span style={{ fontFamily:UI, fontSize:12, color:C.t2, flex:1 }}>{b.desc}</span>
              {rate >= b.pct && (rate < 25 ? rate >= b.pct && rate < BENCHMARKS[BENCHMARKS.indexOf(b)+1]?.pct : b.pct===25) && (
                <span style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:b.color, background:`${b.color}18`, padding:'2px 7px', borderRadius:100, flexShrink:0 }}>You</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* DTI Calculator */
const DTI_CATS = [
  { id:'housing', label:'Rent / Mortgage'       },
  { id:'car',     label:'Car Loan / Lease'       },
  { id:'student', label:'Student Loans'          },
  { id:'cc',      label:'Credit Card Min.'       },
  { id:'other',   label:'Other Debt Payments'    },
]
function DTICalc() {
  const [gross, setGross] = useState(5000)
  const [debts, setDebts] = useState({ housing:1500, car:350, student:200, cc:50, other:0 })
  const totalDebt = Object.values(debts).reduce((a,b)=>a+b,0)
  const dti = gross > 0 ? Math.round((totalDebt/gross)*100) : 0
  const dtiColor = dti<=28 ? C.success : dti<=36 ? C.teal : dti<=50 ? C.warning : C.danger
  const dtiLabel = dti<=28 ? 'Excellent — lenders love this' : dti<=36 ? 'Good — qualifies for most loans' : dti<=50 ? 'Caution — debt is stretched' : 'High — focus on debt reduction'
  return (
    <div>
      <NumInput label="Monthly Gross Income (pre-tax)" value={gross} onChange={setGross} step={100} />
      <div style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:C.t1, marginBottom:8 }}>Monthly Debt Payments</div>
      {DTI_CATS.map(c => (
        <div key={c.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'5px 0' }}>
          <span style={{ flex:1, fontFamily:UI, fontSize:12, color:C.t2 }}>{c.label}</span>
          <div style={{ display:'flex', alignItems:'center', gap:4 }}>
            <span style={{ color:C.t3, fontSize:13 }}>$</span>
            <input type="number" min={0} value={debts[c.id]||0}
              onChange={e => setDebts(prev => ({ ...prev, [c.id]:Math.max(0, Number(e.target.value)) }))}
              style={{ width:80, border:`1.5px solid ${C.b2}`, borderRadius:7, padding:'5px 8px', fontFamily:MONO, fontSize:12, fontWeight:600, color:C.t1, background:C.raise }} />
          </div>
        </div>
      ))}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, margin:'12px 0' }}>
        <ResultBadge label="Total Monthly Debt" value={fmt(totalDebt)} color={C.t3} />
        <ResultBadge label={dtiLabel} value={`${dti}%`} color={dtiColor} large />
      </div>
      <div style={{ background:C.raise, borderRadius:10, padding:'12px' }}>
        <div style={{ display:'flex', height:7, borderRadius:99, overflow:'hidden', marginBottom:6 }}>
          <div style={{ flex:28, background:C.success }} />
          <div style={{ flex:8,  background:C.teal    }} />
          <div style={{ flex:14, background:C.warning }} />
          <div style={{ flex:50, background:C.danger  }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', fontFamily:UI, fontSize:9, color:C.t3, marginBottom:6 }}>
          <span>0%</span><span style={{color:C.success}}>≤28%</span><span style={{color:C.teal}}>≤36%</span><span style={{color:C.warning}}>≤50%</span><span style={{color:C.danger}}>50%+</span>
        </div>
        <div style={{ width:`${Math.min(dti,100)}%`, height:3, background:dtiColor, borderRadius:99, transition:'width 0.4s', marginBottom:8 }} />
        <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.6 }}>
          <strong>Why it matters:</strong> Lenders use DTI to approve loans. Most mortgages require DTI under 43%. Under 28% (housing only) puts you in the best position.
        </div>
      </div>
    </div>
  )
}

/* Financial Health Ratios */
function getStatus(value, thresholds, isLower=false) {
  for (const t of thresholds) {
    if (isLower) { if (t.max===undefined || value<=t.max) return t }
    else          { if (t.min===undefined || value>=t.min) return t }
  }
  return thresholds[thresholds.length-1]
}

function HealthRatios() {
  const [grossIncome,  setGross]    = useState(5000)
  const [netIncome,    setNet]      = useState(3800)
  const [housing,      setHousing]  = useState(1200)
  const [totalDebt,    setTDebt]    = useState(1600)
  const [nonHouseDebt, setNHDebt]   = useState(400)
  const [savings,      setSavings]  = useState(760)
  const [efund,        setEfund]    = useState(9000)
  const [monthlyExp,   setMExp]     = useState(3200)
  const [liquidAssets, setLiquid]   = useState(15000)

  const sr  = netIncome   > 0 ? (savings/netIncome)*100       : 0
  const hr  = grossIncome > 0 ? (housing/grossIncome)*100     : 0
  const dti = grossIncome > 0 ? (totalDebt/grossIncome)*100   : 0
  const ef  = monthlyExp  > 0 ? efund/monthlyExp              : 0
  const liq = monthlyExp  > 0 ? liquidAssets/monthlyExp       : 0
  const cdr = grossIncome > 0 ? (nonHouseDebt/grossIncome)*100: 0
  const ir  = grossIncome > 0 ? (savings/grossIncome)*100     : 0

  const RATIOS = [
    { label:'Savings Rate',       value:sr,  display:`${sr.toFixed(1)}%`,  target:'≥ 20% net income',      isLower:false,
      thresholds:[{min:20,color:C.success,label:'Excellent'},{min:15,color:C.teal,label:'Good'},{min:10,color:C.warning,label:'Building'},{color:C.danger,label:'Low'}] },
    { label:'Housing Cost Ratio', value:hr,  display:`${hr.toFixed(1)}%`,  target:'≤ 28% gross income',    isLower:true,
      thresholds:[{max:27.9,color:C.success,label:'Excellent'},{max:32.9,color:C.warning,label:'Borderline'},{color:C.danger,label:'Over limit'}] },
    { label:'DTI Ratio',          value:dti, display:`${dti.toFixed(1)}%`, target:'≤ 36% gross income',    isLower:true,
      thresholds:[{max:27.9,color:C.success,label:'Excellent'},{max:35.9,color:C.teal,label:'Good'},{max:49.9,color:C.warning,label:'High'},{color:C.danger,label:'Critical'}] },
    { label:'Emergency Fund',     value:ef,  display:`${ef.toFixed(1)} mo`,target:'3–6 months expenses',   isLower:false,
      thresholds:[{min:6,color:C.success,label:'Fully funded'},{min:3,color:C.teal,label:'On track'},{min:1,color:C.warning,label:'Building'},{color:C.danger,label:'At risk'}] },
    { label:'Liquidity Ratio',    value:liq, display:`${liq.toFixed(1)}×`, target:'≥ 3× monthly expenses', isLower:false,
      thresholds:[{min:6,color:C.success,label:'Very liquid'},{min:3,color:C.teal,label:'Liquid'},{min:1,color:C.warning,label:'Low'},{color:C.danger,label:'At risk'}] },
    { label:'Consumer Debt',      value:cdr, display:`${cdr.toFixed(1)}%`, target:'≤ 10–15% gross income', isLower:true,
      thresholds:[{max:9.9,color:C.success,label:'Excellent'},{max:14.9,color:C.teal,label:'Manageable'},{max:19.9,color:C.warning,label:'High'},{color:C.danger,label:'Concerning'}] },
    { label:'Investment Rate',    value:ir,  display:`${ir.toFixed(1)}%`,  target:'≥ 15% gross income',    isLower:false,
      thresholds:[{min:20,color:C.success,label:'Excellent'},{min:15,color:C.teal,label:'On track'},{min:10,color:C.warning,label:'Building'},{color:C.danger,label:'Low'}] },
  ]

  const scored = RATIOS.map(r => ({ ...r, status: getStatus(r.value, r.thresholds, r.isLower) }))
  const totalScore = Math.round((scored.reduce((s,r) => s+({Excellent:1,Good:0.7,'On track':0.7,'Fully funded':1,'Very liquid':1,Manageable:0.7,Building:0.3,Low:0,Borderline:0.3,'Over limit':0,'At risk':0,High:0.3,Critical:0,Concerning:0,Liquid:0.7}[r.status.label]||0), 0) / RATIOS.length) * 100)
  const scoreColor = totalScore>=75 ? C.success : totalScore>=50 ? C.teal : totalScore>=30 ? C.warning : C.danger
  const scoreLabel = totalScore>=75 ? 'Strong' : totalScore>=50 ? 'Good' : totalScore>=30 ? 'Fair' : 'Needs Work'

  return (
    <div>
      <div style={{ fontFamily:UI, fontSize:12, color:C.t3, marginBottom:12 }}>Enter monthly figures — all 7 ratios update instantly.</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 12px' }}>
        <NumInput label="Gross Income"      value={grossIncome} onChange={setGross}    step={100} hint="Before taxes" />
        <NumInput label="Net Income"        value={netIncome}   onChange={setNet}      step={100} hint="Take-home" />
        <NumInput label="Housing Cost"      value={housing}     onChange={setHousing}  step={50}  hint="Rent or mortgage" />
        <NumInput label="Total Debt Pmts"   value={totalDebt}   onChange={setTDebt}    step={50}  hint="All loans + cards" />
        <NumInput label="Non-Housing Debt"  value={nonHouseDebt}onChange={setNHDebt}   step={25}  hint="Car, student, cards" />
        <NumInput label="Monthly Savings"   value={savings}     onChange={setSavings}  step={50}  hint="401k + IRA + e-fund" />
        <NumInput label="Emergency Fund"    value={efund}       onChange={setEfund}    step={500} hint="Total liquid savings" prefix="$" />
        <NumInput label="Monthly Expenses"  value={monthlyExp}  onChange={setMExp}     step={100} hint="Essential spending" />
      </div>
      <NumInput label="Total Liquid Assets" value={liquidAssets} onChange={setLiquid} step={500} hint="Cash + savings accounts" />

      {/* Overall Score */}
      <div style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, padding:'14px', marginBottom:12,
        display:'flex', alignItems:'center', gap:14 }}>
        <div style={{ textAlign:'center', minWidth:72 }}>
          <div style={{ fontFamily:MONO, fontSize:36, fontWeight:800, color:scoreColor, lineHeight:1 }}>{totalScore}</div>
          <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.t3, textTransform:'uppercase', letterSpacing:'0.08em' }}>out of 100</div>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:DISPLAY, fontSize:15, fontWeight:700, color:C.t1, marginBottom:3 }}>
            Financial Health: <span style={{ color:scoreColor }}>{scoreLabel}</span>
          </div>
          <div style={{ height:6, background:C.raise, borderRadius:99, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${totalScore}%`, background:scoreColor, borderRadius:99, transition:'width 0.4s' }} />
          </div>
        </div>
      </div>

      {/* Ratio Cards 2-col grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
        {scored.map(r => (
          <div key={r.label} style={{ background:C.surf, border:`1.5px solid ${r.status.color}22`, borderRadius:12, padding:'12px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
              <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:C.t3, textTransform:'uppercase', letterSpacing:'0.07em', lineHeight:1.3, flex:1 }}>{r.label}</div>
              <span style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:r.status.color, background:`${r.status.color}15`, border:`1px solid ${r.status.color}28`, borderRadius:99, padding:'2px 6px', flexShrink:0, marginLeft:4 }}>{r.status.label}</span>
            </div>
            <div style={{ fontFamily:MONO, fontSize:20, fontWeight:800, color:r.status.color, lineHeight:1, marginBottom:2 }}>{r.display}</div>
            <div style={{ fontFamily:UI, fontSize:10, color:C.t3 }}>Target: <strong style={{ color:C.t2 }}>{r.target}</strong></div>
          </div>
        ))}
      </div>
      <InfoBox>These ratios are educational benchmarks. Use them as a diagnostic tool and work with a fee-only fiduciary advisor on personalized goals.</InfoBox>
    </div>
  )
}

function CalculateTab() {
  const CALCS = [
    { id:'budget',  label:'Budget Builder'     },
    { id:'efund',   label:'Emergency Fund'     },
    { id:'savings', label:'Savings Rate'       },
    { id:'dti',     label:'DTI Ratio'          },
    { id:'ratios',  label:'Health Ratios'      },
  ]
  const [calc, setCalc] = useState('budget')
  return (
    <div style={{ padding:'14px 16px 0' }}>
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:14 }}>
        {CALCS.map(c => (
          <button key={c.id} onClick={() => setCalc(c.id)}
            style={{ padding:'6px 14px', borderRadius:99, border:`1px solid ${calc===c.id ? C.indigo : C.b2}`,
              background: calc===c.id ? C.indigo : C.raise, fontFamily:UI, fontSize:12,
              fontWeight: calc===c.id ? 700 : 500, color: calc===c.id ? '#fff' : C.t3, cursor:'pointer' }}>
            {c.label}
          </button>
        ))}
      </div>
      {calc==='budget'  && <BudgetBuilder />}
      {calc==='efund'   && <EmergencyFundCalc />}
      {calc==='savings' && <SavingsRateCalc />}
      {calc==='dti'     && <DTICalc />}
      {calc==='ratios'  && <HealthRatios />}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   RESOURCES TAB
══════════════════════════════════════════════════════════════════ */
const APPS = [
  { name:'YNAB (You Need A Budget)', badge:'Best for deep budgeters', badgeColor:C.teal,
    desc:'Zero-based budgeting where every dollar gets a job. Steep learning curve but transformative for people serious about controlling spending.',
    cost:'$14.99/month or $99/year (34-day free trial)', best:'People who want full awareness of every dollar' },
  { name:'Monarch Money', badge:'Best overall', badgeColor:C.success,
    desc:'Modern replacement for Mint. Connects accounts, tracks spending automatically, supports net worth tracking and long-term goals. Clean UI.',
    cost:'$14.99/month or $99.99/year', best:'Most people — beautiful and comprehensive' },
  { name:'EveryDollar', badge:'Best for beginners', badgeColor:'#8b5cf6',
    desc:"Dave Ramsey's zero-based budgeting app. Simple and intuitive for first-time budgeters. Free version requires manual entry.",
    cost:'Free (manual) or $17.99/month with bank sync', best:'First-time budgeters and Dave Ramsey followers' },
  { name:'Copilot', badge:'Best design', badgeColor:C.gold,
    desc:'Apple-first app with AI-powered transaction categorization and a beautiful native experience. Automatically imports and organizes all accounts.',
    cost:'$8.99/month or $95.99/year', best:'iPhone users who value design and automation' },
]

function ResourcesTab() {
  return (
    <div style={{ padding:'14px 16px 0' }}>
      <InfoBox color={C.teal}>
        <strong>How to choose:</strong> Start with a free or low-cost app. The best budgeting app is the one you'll actually use. Try one for 30 days before committing — most offer free trials.
      </InfoBox>
      <div style={{ marginTop:14, display:'flex', flexDirection:'column', gap:12 }}>
        {APPS.map((r, i) => (
          <div key={i} style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, overflow:'hidden' }}>
            <div style={{ padding:'12px 14px', borderBottom:`1px solid ${C.b1}`, display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
              <span style={{ fontFamily:DISPLAY, fontSize:15, fontWeight:700, color:C.t1 }}>{r.name}</span>
              <span style={{ padding:'2px 9px', background:`${r.badgeColor}15`, border:`1px solid ${r.badgeColor}30`, borderRadius:100, fontFamily:UI, fontSize:10, fontWeight:700, color:r.badgeColor }}>{r.badge}</span>
            </div>
            <div style={{ padding:'12px 14px' }}>
              <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65, marginBottom:10 }}>{r.desc}</div>
              <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:'4px 10px', fontFamily:UI, fontSize:11 }}>
                <span style={{ color:C.t3, fontWeight:600 }}>Cost</span>
                <span style={{ color:C.t2 }}>{r.cost}</span>
                <span style={{ color:C.t3, fontWeight:600 }}>Best for</span>
                <span style={{ color:C.t2 }}>{r.best}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════════ */
const TABS = [
  { id:'learn',    label:'Learn'     },
  { id:'calc',     label:'Calculate' },
  { id:'resources',label:'Resources' },
]

export default function MBudgeting() {
  const [tab, setTab] = useState('learn')

  return (
    <div style={{ background:C.bg, minHeight:'100dvh' }}>
      <ScreenHeader title="Budgeting & Foundations" subtitle="FUN · Learn" accent={C.indigo} />

      {/* Sticky tab bar */}
      <div style={{ position:'sticky', top:0, zIndex:10, background:`${C.bg}f5`, backdropFilter:'blur(12px)',
        borderBottom:`1px solid ${C.b2}`, padding:'0 16px', display:'flex', gap:0 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex:1, padding:'11px 4px', background:'none', border:'none',
              borderBottom: tab===t.id ? `2px solid ${C.indigo}` : '2px solid transparent',
              fontFamily:UI, fontSize:13, fontWeight: tab===t.id ? 700 : 500,
              color: tab===t.id ? C.indigo : C.t3, cursor:'pointer', marginBottom:-1 }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab==='learn'    && <LearnTab />}
      {tab==='calc'     && <CalculateTab />}
      {tab==='resources'&& <ResourcesTab />}

      <div style={{ padding:'16px', textAlign:'center' }}>
        <span style={{ fontFamily:UI, fontSize:10, color:C.t3 }}>For educational purposes only · Not financial advice</span>
      </div>
    </div>
  )
}
