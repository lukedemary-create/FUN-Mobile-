import { useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import {
  CheckCircle2, AlertCircle, Info, ChevronDown, ChevronUp,
  TrendingUp, Shield, Zap, DollarSign, ArrowRight, ExternalLink,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'

/* ── 2026 CFP Tax Data ─────────────────────────────────────────── */
const BRACKETS = {
  single: [
    { rate: 0.10, min: 0,       max: 12400   },
    { rate: 0.12, min: 12400,   max: 50400   },
    { rate: 0.22, min: 50400,   max: 105700  },
    { rate: 0.24, min: 105700,  max: 201775  },
    { rate: 0.32, min: 201775,  max: 256225  },
    { rate: 0.35, min: 256225,  max: 640600  },
    { rate: 0.37, min: 640600,  max: Infinity },
  ],
  mfj: [
    { rate: 0.10, min: 0,       max: 24800   },
    { rate: 0.12, min: 24800,   max: 100800  },
    { rate: 0.22, min: 100800,  max: 211400  },
    { rate: 0.24, min: 211400,  max: 403550  },
    { rate: 0.32, min: 403550,  max: 512450  },
    { rate: 0.35, min: 512450,  max: 768700  },
    { rate: 0.37, min: 768700,  max: Infinity },
  ],
  hoh: [
    { rate: 0.10, min: 0,       max: 17700   },
    { rate: 0.12, min: 17700,   max: 67450   },
    { rate: 0.22, min: 67450,   max: 105700  },
    { rate: 0.24, min: 105700,  max: 201750  },
    { rate: 0.32, min: 201750,  max: 256200  },
    { rate: 0.35, min: 256200,  max: 640600  },
    { rate: 0.37, min: 640600,  max: Infinity },
  ],
  mfs: [
    { rate: 0.10, min: 0,       max: 12400   },
    { rate: 0.12, min: 12400,   max: 50400   },
    { rate: 0.22, min: 50400,   max: 105700  },
    { rate: 0.24, min: 105700,  max: 201775  },
    { rate: 0.32, min: 201775,  max: 256225  },
    { rate: 0.35, min: 256225,  max: 384350  },
    { rate: 0.37, min: 384350,  max: Infinity },
  ],
}

const STD_DED   = { single: 16100, mfj: 32200, hoh: 24150, mfs: 16100 }
const STATUS_LBL = { single: 'Single', mfj: 'Married (MFJ)', hoh: 'Head of Household', mfs: 'Married (MFS)' }
const BRACKET_COLORS = ['#94a3b8','#60a5fa','#34d399','#fbbf24','#f97316','#f87171','#e879f9']

function calcTax(taxable, status) {
  let tax = 0
  for (const b of BRACKETS[status]) {
    if (taxable <= b.min) break
    tax += (Math.min(taxable, b.max) - b.min) * b.rate
  }
  return tax
}

function marginalRate(taxable, status) {
  for (const b of [...BRACKETS[status]].reverse()) {
    if (taxable > b.min) return b.rate
  }
  return 0.10
}

const fmt  = n => '$' + Math.round(n || 0).toLocaleString()
const fmtP = n => (n * 100).toFixed(1) + '%'

/* ── Sub-component helpers ─────────────────────────────────────── */
function InfoBox({ children, color = C.gold, icon: Icon = Info }) {
  return (
    <div style={{ display:'flex', gap:8, padding:'10px 12px', background:`${color}12`, border:`1px solid ${color}28`, borderRadius:10, marginTop:10 }}>
      <Icon size={13} color={color} style={{ flexShrink:0, marginTop:1 }} />
      <p style={{ margin:0, fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.7 }}>{children}</p>
    </div>
  )
}

function PillTabs({ tabs, active, onSelect }) {
  return (
    <div style={{ display:'flex', gap:6, padding:'10px 16px', overflowX:'auto', scrollbarWidth:'none' }}>
      {tabs.map(([k, l]) => (
        <button key={k} onClick={() => onSelect(k)} style={{
          flexShrink:0, padding:'6px 14px', borderRadius:20,
          border:`1px solid ${active===k ? C.gold : C.b2}`,
          background: active===k ? `rgba(201,169,110,0.14)` : C.surf,
          fontFamily:UI, fontSize:12, fontWeight:600,
          color: active===k ? C.gold : C.t3, cursor:'pointer',
        }}>{l}</button>
      ))}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   LEARN TAB — Brackets
════════════════════════════════════════════════════════════════ */
function LearnBrackets() {
  const [status, setStatus] = useState('single')

  return (
    <>
      {/* Filing status selector */}
      <div style={{ padding:'10px 16px 0', display:'flex', gap:6, flexWrap:'wrap' }}>
        {Object.entries(STATUS_LBL).map(([k, l]) => (
          <button key={k} onClick={() => setStatus(k)} style={{
            padding:'6px 12px', borderRadius:8,
            border:`1px solid ${status===k ? C.gold : C.b2}`,
            background: status===k ? `rgba(201,169,110,0.12)` : C.surf,
            fontFamily:UI, fontSize:11, fontWeight:600,
            color: status===k ? C.gold : C.t3, cursor:'pointer',
          }}>{l}</button>
        ))}
      </div>

      <MSectionHeader label={`2026 Brackets — ${STATUS_LBL[status]}`} />
      <div style={{ padding:'0 16px' }}>
        <MCard style={{ padding:0, overflow:'hidden' }}>
          <div style={{ display:'grid', gridTemplateColumns:'48px 1fr 1fr', background:C.raise, padding:'8px 12px', borderBottom:`1px solid ${C.b2}` }}>
            {['Rate','From','To'].map(h => (
              <span key={h} style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em' }}>{h}</span>
            ))}
          </div>
          {BRACKETS[status].map((b, i) => (
            <div key={i} style={{ display:'grid', gridTemplateColumns:'48px 1fr 1fr', padding:'9px 12px', borderBottom: i < BRACKETS[status].length-1 ? `1px solid ${C.b1}` : 'none' }}>
              <span style={{ fontFamily:MONO, fontSize:12, fontWeight:700, color:BRACKET_COLORS[i] }}>{(b.rate*100).toFixed(0)}%</span>
              <span style={{ fontFamily:MONO, fontSize:11, color:C.t2 }}>{fmt(b.min)}</span>
              <span style={{ fontFamily:MONO, fontSize:11, color:C.t2 }}>{b.max === Infinity ? '∞' : fmt(b.max)}</span>
            </div>
          ))}
        </MCard>
        <InfoBox>U.S. taxes are <strong style={{ color:C.t1 }}>marginal</strong> — only dollars within each bracket are taxed at that rate. Being in the 24% bracket does NOT mean you owe 24% of all income.</InfoBox>
      </div>

      {/* Key distinctions */}
      <MSectionHeader label="Marginal vs. Effective Rate" />
      <div style={{ padding:'0 16px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
        <div style={{ background:`rgba(239,68,68,0.08)`, border:`1px solid rgba(239,68,68,0.2)`, borderRadius:12, padding:'12px 14px' }}>
          <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:'#ef4444', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:6 }}>Misconception</div>
          <p style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.65, margin:0 }}>"I'm in the 24% bracket so I owe 24% of my income." This is wrong.</p>
        </div>
        <div style={{ background:`rgba(74,124,89,0.1)`, border:`1px solid rgba(74,124,89,0.25)`, borderRadius:12, padding:'12px 14px' }}>
          <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.up, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:6 }}>Reality</div>
          <p style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.65, margin:0 }}>You pay each rate only on dollars in that bracket. A raise never lowers take-home pay.</p>
        </div>
      </div>

      {/* Standard deductions + key limits */}
      <MSectionHeader label="2026 Standard Deductions" />
      <div style={{ padding:'0 16px' }}>
        <MCard style={{ padding:0, overflow:'hidden' }}>
          {[
            ['Single', '$16,100', '+$2,050 if age 65+ or blind'],
            ['Married Filing Jointly', '$32,200', '+$1,650 per spouse 65+'],
            ['Head of Household', '$24,150', '2026 CFP figure'],
            ['Married Filing Separately', '$16,100', '+$2,050 if age 65+ or blind'],
          ].map(([s, v, n], i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', borderBottom: i < 3 ? `1px solid ${C.b1}` : 'none' }}>
              <div>
                <div style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:C.t1 }}>{s}</div>
                <div style={{ fontFamily:UI, fontSize:10, color:C.t3, marginTop:1 }}>{n}</div>
              </div>
              <span style={{ fontFamily:MONO, fontSize:13, fontWeight:700, color:C.gold }}>{v}</span>
            </div>
          ))}
        </MCard>
      </div>

      {/* Long-term capital gains */}
      <MSectionHeader label="Long-Term Capital Gains 2026" />
      <div style={{ padding:'0 16px' }}>
        <MCard style={{ padding:0, overflow:'hidden' }}>
          <div style={{ background:C.raise, padding:'8px 14px', borderBottom:`1px solid ${C.b2}` }}>
            <span style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em' }}>Single filer (hold &gt;12 months)</span>
          </div>
          {[
            ['0%',  'Up to $49,450',          C.up],
            ['15%', '$49,451 – $545,500',     C.gold],
            ['20%', 'Over $545,500',           C.down],
          ].map(([r, rng, col], i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', borderBottom: i < 2 ? `1px solid ${C.b1}` : 'none' }}>
              <span style={{ fontFamily:MONO, fontSize:14, fontWeight:700, color:col }}>{r}</span>
              <span style={{ fontFamily:MONO, fontSize:11, color:C.t2 }}>{rng}</span>
            </div>
          ))}
        </MCard>
        <InfoBox color={C.up} icon={CheckCircle2}>Taxable income below $49,450 (single) = <strong style={{ color:C.t1 }}>0% federal tax</strong> on long-term capital gains. Realize gains strategically in low-income years tax-free.</InfoBox>
      </div>

      {/* Key limits grid */}
      <MSectionHeader label="2026 Contribution Limits" />
      <div style={{ padding:'0 16px' }}>
        <MCard style={{ padding:0, overflow:'hidden' }}>
          {[
            ['401(k) / 403(b) Limit',            '$24,500', C.gold],
            ['Catch-Up Age 50–59, 64+',           '+$8,000', C.gold],
            ['Super Catch-Up Age 60–63',          '+$11,250', C.gold],
            ['IRA / Roth IRA Limit',              '$7,500', C.up],
            ['IRA Catch-Up Age 50+',              '+$1,100', C.up],
            ['HSA Self-Only',                     '$4,400', '#4ade80'],
            ['HSA Family',                        '$8,750', '#4ade80'],
            ['Annual Gift Exclusion',             '$19,000', '#fbbf24'],
            ['Lifetime Estate Exemption',         '$15,000,000', '#fbbf24'],
            ['SS Wage Base',                      '$184,500', C.teal],
          ].map(([l, v, col], i, arr) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 14px', borderBottom: i < arr.length-1 ? `1px solid ${C.b1}` : 'none' }}>
              <span style={{ fontFamily:UI, fontSize:12, color:C.t2 }}>{l}</span>
              <span style={{ fontFamily:MONO, fontSize:12, fontWeight:700, color:col }}>{v}</span>
            </div>
          ))}
        </MCard>
      </div>

      {/* FICA */}
      <MSectionHeader label="FICA Payroll Taxes 2026" />
      <div style={{ padding:'0 16px 4px' }}>
        <MCard style={{ padding:0, overflow:'hidden' }}>
          {[
            ['Social Security', '6.2%', '$184,500 wage base'],
            ['Medicare', '1.45%', 'No limit'],
            ['Add\'l Medicare', '0.9%', 'Over $200K (S) / $250K (MFJ)'],
            ['NIIT', '3.8%', 'Investment income over $200K (S)'],
          ].map(([t, r, n], i) => (
            <div key={i} style={{ padding:'10px 14px', borderBottom: i < 3 ? `1px solid ${C.b1}` : 'none' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                <span style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:C.t1 }}>{t}</span>
                <span style={{ fontFamily:MONO, fontSize:12, fontWeight:700, color:C.gold }}>{r}</span>
              </div>
              <div style={{ fontFamily:UI, fontSize:10, color:C.t3 }}>{n}</div>
            </div>
          ))}
        </MCard>
      </div>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════
   LEARN TAB — Account Types
════════════════════════════════════════════════════════════════ */
function LearnAccounts() {
  const [open, setOpen] = useState(null)
  const toggle = k => setOpen(p => p === k ? null : k)

  const ASSET_LOC = [
    {
      key:'taxable', label:'Taxable Brokerage', color:'#fbbf24',
      icon: TrendingUp,
      best: ['Index funds (low turnover)','ETFs (tax-efficient)','Municipal bonds','Growth stocks held long-term'],
      avoid: ['High-yield bonds','REITs','Active funds with high turnover'],
      why: 'Subject to capital gains tax on sales and dividends. Use tax-efficient vehicles to minimize annual drag.',
    },
    {
      key:'trad', label:'Traditional IRA / 401(k)', color:C.gold,
      icon: Shield,
      best: ['High-yield bonds','REITs (ordinary income)','Active funds','TIPS (inflation-protected bonds)'],
      avoid: ['Municipal bonds (tax benefit wasted)','Growth stocks (converts LTCG to ordinary income)'],
      why: 'Withdrawals taxed as ordinary income. Best for high-income-generating assets.',
    },
    {
      key:'roth', label:'Roth IRA / Roth 401(k)', color:C.teal,
      icon: Zap,
      best: ['Highest-growth potential assets','Small-cap / emerging market stocks','Speculative growth plays'],
      avoid: ['Bonds / stable value (waste of tax-free growth)','Cash or money markets'],
      why: 'Every dollar of growth is permanently tax-free. Reserve for highest-upside assets.',
    },
  ]

  return (
    <>
      {/* Roth vs Traditional */}
      <MSectionHeader label="Roth vs. Traditional 401(k)" />
      <div style={{ padding:'0 16px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          <div style={{ background:`rgba(0,180,198,0.08)`, border:`1px solid ${C.tealBdr}`, borderRadius:12, padding:'14px 12px' }}>
            <div style={{ fontFamily:UI, fontSize:9, fontWeight:800, color:C.teal, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:10 }}>Roth 401(k)</div>
            {[
              ['Contributions', 'After-tax'],
              ['Growth', 'Tax-free'],
              ['Withdrawals', 'Tax-free'],
              ['RMDs', 'None'],
              ['Best for', 'Lower bracket now'],
            ].map(([k,v],i) => (
              <div key={i} style={{ paddingBottom:5, marginBottom:5, borderBottom: i<4 ? `1px solid ${C.b1}` : 'none' }}>
                <div style={{ fontFamily:UI, fontSize:9, color:C.t3 }}>{k}</div>
                <div style={{ fontFamily:UI, fontSize:11, color:C.t1, fontWeight:500 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ background:`rgba(201,169,110,0.08)`, border:`1px solid ${C.goldBdr}`, borderRadius:12, padding:'14px 12px' }}>
            <div style={{ fontFamily:UI, fontSize:9, fontWeight:800, color:C.gold, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:10 }}>Traditional 401(k)</div>
            {[
              ['Contributions', 'Pre-tax'],
              ['Growth', 'Tax-deferred'],
              ['Withdrawals', 'Taxed as income'],
              ['RMDs', 'Age 73'],
              ['Best for', 'Higher bracket now'],
            ].map(([k,v],i) => (
              <div key={i} style={{ paddingBottom:5, marginBottom:5, borderBottom: i<4 ? `1px solid ${C.b1}` : 'none' }}>
                <div style={{ fontFamily:UI, fontSize:9, color:C.t3 }}>{k}</div>
                <div style={{ fontFamily:UI, fontSize:11, color:C.t1, fontWeight:500 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <InfoBox color='#fbbf24' icon={AlertCircle}>Nobody knows their retirement tax rate. CFPs call splitting between both account types <strong style={{ color:C.t1 }}>"tax bracket management"</strong> — the safest hedge.</InfoBox>
      </div>

      {/* When to choose each */}
      <MSectionHeader label="When to Choose Each" />
      <div style={{ padding:'0 16px' }}>
        <MCard>
          <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.teal, marginBottom:8 }}>Choose Roth When...</div>
          {['Early career (low income now)','Expect higher tax rate in retirement','20+ years of tax-free compounding','Want no RMDs in retirement','Low-income year (sabbatical, career gap)'].map((item, i) => (
            <div key={i} style={{ display:'flex', gap:8, marginBottom:6 }}>
              <CheckCircle2 size={12} color={C.teal} style={{ flexShrink:0, marginTop:1 }} />
              <span style={{ fontFamily:UI, fontSize:12, color:C.t2 }}>{item}</span>
            </div>
          ))}
          <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.gold, margin:'12px 0 8px' }}>Choose Traditional When...</div>
          {['In a high bracket now (32%+)','Expect significantly less income in retirement','Need deduction to qualify for tax credits','Reduce MAGI for Roth IRA eligibility','Within 10 years of retirement'].map((item, i) => (
            <div key={i} style={{ display:'flex', gap:8, marginBottom:6 }}>
              <CheckCircle2 size={12} color={C.gold} style={{ flexShrink:0, marginTop:1 }} />
              <span style={{ fontFamily:UI, fontSize:12, color:C.t2 }}>{item}</span>
            </div>
          ))}
        </MCard>
      </div>

      {/* Asset Location */}
      <MSectionHeader label="Asset Location Strategy" />
      <div style={{ padding:'0 16px' }}>
        {ASSET_LOC.map(({ key, label, color, icon: Icon, best, avoid, why }) => (
          <div key={key} style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, marginBottom:8, overflow:'hidden' }}>
            <button onClick={() => toggle(key)} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 14px', background:'none', border:'none', cursor:'pointer', textAlign:'left' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:28, height:28, borderRadius:8, background:`${color}18`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={13} color={color} />
                </div>
                <span style={{ fontFamily:UI, fontSize:13, fontWeight:700, color: open===key ? C.t1 : C.t2 }}>{label}</span>
              </div>
              {open===key ? <ChevronUp size={13} color={color} /> : <ChevronDown size={13} color={C.t3} />}
            </button>
            {open===key && (
              <div style={{ padding:'0 14px 14px', borderTop:`1px solid ${C.b1}` }}>
                <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.up, textTransform:'uppercase', letterSpacing:'0.1em', margin:'10px 0 6px' }}>Place Here</div>
                {best.map((item, i) => (
                  <div key={i} style={{ display:'flex', gap:6, marginBottom:4 }}>
                    <span style={{ color:C.up, fontSize:11, flexShrink:0 }}>+</span>
                    <span style={{ fontFamily:UI, fontSize:11, color:C.t2 }}>{item}</span>
                  </div>
                ))}
                <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.down, textTransform:'uppercase', letterSpacing:'0.1em', margin:'10px 0 6px' }}>Avoid Here</div>
                {avoid.map((item, i) => (
                  <div key={i} style={{ display:'flex', gap:6, marginBottom:4 }}>
                    <span style={{ color:C.down, fontSize:11, flexShrink:0 }}>–</span>
                    <span style={{ fontFamily:UI, fontSize:11, color:C.t2 }}>{item}</span>
                  </div>
                ))}
                <p style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.6, margin:'10px 0 0', borderTop:`1px solid ${C.b1}`, paddingTop:8 }}>{why}</p>
              </div>
            )}
          </div>
        ))}
        <InfoBox color={C.up} icon={CheckCircle2}>Strategic asset location adds an estimated <strong style={{ color:C.t1 }}>0.10%–0.45%/year</strong> in after-tax alpha — equivalent to a significant expense ratio reduction with zero investment risk.</InfoBox>
      </div>

      {/* HSA */}
      <MSectionHeader label="HSA — Triple Tax Advantage" />
      <div style={{ padding:'0 16px' }}>
        <div style={{ background:`rgba(74,222,128,0.08)`, border:`1px solid rgba(74,222,128,0.2)`, borderRadius:16, padding:'16px 14px' }}>
          <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:'#4ade80', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:10 }}>The Only Account With Three Tax Advantages</div>
          {[
            'Contributions are tax-deductible (or pre-tax via payroll)',
            'Invested funds grow completely tax-free',
            'Withdrawals for qualified medical expenses are tax-free',
            'At age 65, works like a Traditional IRA for any use',
            'No "use it or lose it" — balances roll over indefinitely',
          ].map((item, i) => (
            <div key={i} style={{ display:'flex', gap:8, marginBottom:6 }}>
              <CheckCircle2 size={12} color='#4ade80' style={{ flexShrink:0, marginTop:1 }} />
              <span style={{ fontFamily:UI, fontSize:12, color:C.t2 }}>{item}</span>
            </div>
          ))}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:12 }}>
            {[['Self-Only 2026','$4,400'],['Family 2026','$8,750'],['Catch-Up 55+','+$1,000'],['Effective Savings','~30%+']].map(([l,v]) => (
              <div key={l} style={{ background:C.raise, borderRadius:8, padding:'8px 10px' }}>
                <div style={{ fontFamily:UI, fontSize:9, color:C.t3, marginBottom:2 }}>{l}</div>
                <div style={{ fontFamily:MONO, fontSize:13, fontWeight:700, color:'#4ade80' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <InfoBox color='#4ade80' icon={Info}>
          <strong style={{ color:C.t1 }}>HSA Power Move:</strong> Pay medical expenses out-of-pocket now, keep receipts, invest the HSA. Decades later, reimburse all accumulated expenses tax-free. There is no time limit on reimbursements.
        </InfoBox>
      </div>

      {/* Roth IRA phase-outs */}
      <MSectionHeader label="Roth IRA Income Phase-Outs 2026" />
      <div style={{ padding:'0 16px 4px' }}>
        <MCard style={{ padding:0, overflow:'hidden' }}>
          {[
            ['Single', '$153,000 – $168,000'],
            ['Married Filing Jointly', '$242,000 – $252,000'],
            ['Married Filing Separately', '$0 – $10,000'],
          ].map(([s, r], i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', borderBottom: i < 2 ? `1px solid ${C.b1}` : 'none' }}>
              <span style={{ fontFamily:UI, fontSize:12, color:C.t2 }}>{s}</span>
              <span style={{ fontFamily:MONO, fontSize:11, fontWeight:700, color:C.teal }}>{r}</span>
            </div>
          ))}
        </MCard>
        <InfoBox>Above these MAGI limits you cannot contribute directly to a Roth IRA. <strong style={{ color:C.t1 }}>Backdoor Roth conversion</strong> is the alternative for high earners.</InfoBox>
      </div>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════
   LEARN TAB — Equity Compensation
════════════════════════════════════════════════════════════════ */
function LearnEquity() {
  const [sub, setSub] = useState('rsu')

  const RSU_TIMELINE = [
    { label: 'Grant Date',               desc: 'Company awards you X shares. No tax event — just a promise.', color: C.t3 },
    { label: 'Vesting Date',             desc: 'Shares vest (become yours). FMV per share on this day is ordinary income. Employer withholds — often at the 22% supplemental rate, which may be below your actual bracket.', color: C.down, highlight: true },
    { label: 'Holding Period Begins',    desc: 'Cost basis = FMV at vesting. The 12-month clock starts for long-term vs. short-term capital gains.', color: '#fbbf24' },
    { label: 'Sale — Short-Term (<12mo)', desc: 'Gain above FMV at vesting is taxed as ordinary income (up to 37%). Generally a poor time to sell.', color: C.down },
    { label: 'Sale — Long-Term (>12mo)', desc: 'Gain above FMV at vesting taxed at LTCG rates (0%, 15%, 20%). Much better outcome.', color: C.up },
  ]

  return (
    <>
      <div style={{ padding:'10px 16px 0', display:'flex', gap:6 }}>
        {[['rsu','RSUs'],['espp','ESPP'],['iso','ISO / NSO']].map(([k,l]) => (
          <button key={k} onClick={() => setSub(k)} style={{
            flex:1, padding:'8px 4px', borderRadius:10,
            border:`1px solid ${sub===k ? C.gold : C.b2}`,
            background: sub===k ? `rgba(201,169,110,0.12)` : C.surf,
            fontFamily:UI, fontSize:11, fontWeight:600,
            color: sub===k ? C.gold : C.t3, cursor:'pointer',
          }}>{l}</button>
        ))}
      </div>

      {sub === 'rsu' && (
        <>
          <MSectionHeader label="Restricted Stock Units (RSUs)" />
          <div style={{ padding:'0 16px' }}>
            <MCard>
              <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.t1, marginBottom:12 }}>Tax Timeline</div>
              {RSU_TIMELINE.map((step, i) => (
                <div key={i} style={{ display:'flex', gap:10, marginBottom: i < RSU_TIMELINE.length-1 ? 10 : 0 }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:step.color, marginTop:4 }} />
                    {i < RSU_TIMELINE.length-1 && <div style={{ width:1, flex:1, background:C.b2, marginTop:2 }} />}
                  </div>
                  <div style={{ background: step.highlight ? `rgba(192,57,43,0.08)` : C.raise, border:`1px solid ${step.highlight ? 'rgba(192,57,43,0.25)' : C.b2}`, borderRadius:10, padding:'10px 12px', flex:1, marginBottom:2 }}>
                    <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:step.color, marginBottom:3 }}>{step.label}</div>
                    <p style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.65, margin:0 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </MCard>

            <div style={{ background:`rgba(192,57,43,0.08)`, border:`1px solid rgba(192,57,43,0.22)`, borderRadius:12, padding:'12px 14px', marginTop:8 }}>
              <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.down, marginBottom:6 }}>The Withholding Gap — A Common Tax Trap</div>
              <p style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.65, margin:0 }}>Employers withhold at the <strong style={{ color:C.t1 }}>22% supplemental rate</strong> on RSU income. If you're in the 32–37% bracket, you can owe $20,000–$100,000+ at tax time. Set quarterly estimated payments or request additional withholding.</p>
            </div>

            <MCard style={{ marginTop:8 }}>
              <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.teal, marginBottom:8 }}>RSU Planning Strategies</div>
              {[
                'Basis = FMV at each vest date, not grant date',
                'Hold 12+ months from vest for LTCG treatment on appreciation',
                'Donate appreciated shares to charity — avoid capital gains entirely',
                'Request sell-to-cover withholding to avoid surprise tax bills',
                'Consider a 10b5-1 plan for systematic, schedule-based selling',
              ].map((item, i) => (
                <div key={i} style={{ display:'flex', gap:8, marginBottom:6 }}>
                  <CheckCircle2 size={12} color={C.teal} style={{ flexShrink:0, marginTop:1 }} />
                  <span style={{ fontFamily:UI, fontSize:11, color:C.t2 }}>{item}</span>
                </div>
              ))}
            </MCard>
          </div>
        </>
      )}

      {sub === 'espp' && (
        <>
          <MSectionHeader label="Employee Stock Purchase Plans (ESPP)" />
          <div style={{ padding:'0 16px' }}>
            <MCard>
              <p style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65, margin:'0 0 12px' }}>ESPPs let employees purchase company stock at a discount (typically 5–15%). A qualifying Section 423 ESPP has unique tax rules.</p>
              {[
                ['Discount', 'Up to 15% off lower of: price at start or end of offering period'],
                ['Qualifying Disposition', 'Held 2yr from offering + 1yr from purchase → discount taxed as ordinary income; rest as LTCG'],
                ['Disqualifying Disposition', 'Sold earlier → entire gain taxed as ordinary income'],
                ['Look-Back Provision', 'Some plans use the lower of the start or end price — can create significant immediate gain'],
                ['Key Risk', 'Concentration risk — selling promptly after purchase reduces company stock exposure'],
              ].map(([k, v], i) => (
                <div key={i} style={{ paddingBottom:8, marginBottom:8, borderBottom: i < 4 ? `1px solid ${C.b1}` : 'none' }}>
                  <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.gold, marginBottom:2 }}>{k}</div>
                  <div style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.55 }}>{v}</div>
                </div>
              ))}
            </MCard>
            <InfoBox>If your ESPP offers a 15% discount with a look-back provision, the <strong style={{ color:C.t1 }}>minimum guaranteed return</strong> is ~17.6% even if stock price doesn't move. Always contribute up to the maximum allowed.</InfoBox>
          </div>
        </>
      )}

      {sub === 'iso' && (
        <>
          <MSectionHeader label="Incentive Stock Options (ISO) & Non-Qualified (NSO)" />
          <div style={{ padding:'0 16px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 }}>
              <div style={{ background:`rgba(0,180,198,0.08)`, border:`1px solid ${C.tealBdr}`, borderRadius:12, padding:'12px 12px' }}>
                <div style={{ fontFamily:UI, fontSize:9, fontWeight:800, color:C.teal, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>ISO</div>
                {[
                  ['Exercise', 'No regular income tax — but may trigger AMT'],
                  ['Qualifying Sale', 'LTCG on full gain if held 2yr from grant, 1yr from exercise'],
                  ['Disqualifying', 'Spread at exercise = ordinary income'],
                  ['AMT Risk', 'Spread at exercise is AMT preference item'],
                  ['Annual Limit', '$100K vesting per year at FMV'],
                ].map(([k,v],i) => (
                  <div key={i} style={{ marginBottom:5 }}>
                    <div style={{ fontFamily:UI, fontSize:9, color:C.t3 }}>{k}</div>
                    <div style={{ fontFamily:UI, fontSize:10, color:C.t1 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:`rgba(201,169,110,0.08)`, border:`1px solid ${C.goldBdr}`, borderRadius:12, padding:'12px 12px' }}>
                <div style={{ fontFamily:UI, fontSize:9, fontWeight:800, color:C.gold, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>NSO</div>
                {[
                  ['Exercise', 'Spread = ordinary income + FICA at exercise'],
                  ['Post-Exercise', 'Appreciation after exercise = capital gain'],
                  ['Hold 12+ months', 'Post-exercise gain taxed at LTCG rates'],
                  ['Who Gets Them', 'Employees, consultants, board members'],
                  ['AMT Risk', 'None — taxed as ordinary income at exercise'],
                ].map(([k,v],i) => (
                  <div key={i} style={{ marginBottom:5 }}>
                    <div style={{ fontFamily:UI, fontSize:9, color:C.t3 }}>{k}</div>
                    <div style={{ fontFamily:UI, fontSize:10, color:C.t1 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <InfoBox color='#fbbf24' icon={AlertCircle}>ISO exercises near year-end can create large AMT liability. Model AMT before exercising ISOs in a high-income year — consult a CPA or CFP.</InfoBox>
            <MCard style={{ marginTop:8 }}>
              <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.teal, marginBottom:8 }}>83(b) Election — Early Exercise Strategy</div>
              <p style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.65, margin:0 }}>If options are exercisable before vesting, filing an 83(b) election within 30 days of grant starts the capital gains holding period immediately. If the company succeeds, most of the gain qualifies as LTCG. Must be filed within <strong style={{ color:C.t1 }}>30 days of grant</strong> — no extensions.</p>
            </MCard>
          </div>
        </>
      )}
    </>
  )
}

/* ════════════════════════════════════════════════════════════════
   LEARN TAB — Strategies
════════════════════════════════════════════════════════════════ */
const STRATEGIES = [
  { name:'Maximize Pre-Tax Retirement', save:'$24,500 × your tax rate', icon: Shield, desc:'401(k) contributions directly reduce taxable income. At 24% bracket, maxing out saves $5,880 in federal tax annually.' },
  { name:'HSA Triple Tax Advantage', save:'$4,400 self / $8,750 family', icon: Zap, desc:'Pre-tax in, grows tax-free, tax-free out for medical. The single most tax-efficient account in the U.S. tax code.' },
  { name:'Tax-Loss Harvesting', save:'Offsets capital gains + $3K/yr', icon: TrendingUp, desc:'Sell losing positions to offset realized gains. Up to $3,000 of net losses offset ordinary income per year. Unused losses carry forward indefinitely.' },
  { name:'Roth Conversions', save:'Long-term bracket management', icon: ArrowRight, desc:'Convert to Roth in low-income years — sabbatical, early retirement, career transition — and pay tax at lower rates permanently.' },
  { name:'Bunch Deductions', save:'Exceed standard deduction', desc:'Concentrate charitable giving and other deductions into alternate years to exceed the standard deduction threshold. Use a Donor-Advised Fund to give a lump sum and distribute over years.' },
  { name:'QBI Deduction', save:'20% of qualifying income', desc:'Pass-through business owners (S-corps, LLCs, sole props) can deduct 20% of qualified business income. Subject to W-2 wage limitations above ~$383K (MFJ).' },
  { name:'LTCG Rate Management', save:'0% rate if income is low', desc:'Hold investments >12 months for preferential LTCG rates. If taxable income is below $49,450 (single), long-term gains are 0% federal. Never sell and rebuy within 30 days (wash sale rule).' },
]

function LearnStrategies() {
  const [open, setOpen] = useState(null)

  return (
    <>
      <MSectionHeader label="7 Core Tax Reduction Strategies" />
      <div style={{ padding:'0 16px' }}>
        {STRATEGIES.map((s, i) => (
          <div key={i} style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, marginBottom:8, overflow:'hidden' }}>
            <button onClick={() => setOpen(p => p===i ? null : i)} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'13px 14px', background:'none', border:'none', cursor:'pointer', textAlign:'left' }}>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color: open===i ? C.t1 : C.t2 }}>{s.name}</div>
                <div style={{ fontFamily:MONO, fontSize:10, color:C.teal, marginTop:2 }}>{s.save}</div>
              </div>
              {open===i ? <ChevronUp size={13} color={C.gold} /> : <ChevronDown size={13} color={C.t3} />}
            </button>
            {open===i && (
              <div style={{ padding:'0 14px 14px', borderTop:`1px solid ${C.b1}` }}>
                <p style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.7, margin:'10px 0 0' }}>{s.desc}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tax timeline */}
      <MSectionHeader label="Tax Planning Calendar" />
      <div style={{ padding:'0 16px 4px' }}>
        <MCard style={{ padding:0, overflow:'hidden' }}>
          {[
            ['Jan–Mar', 'Prior-year contributions to IRA/Roth (until April 15). Review W-4 withholding.'],
            ['Apr–Jun', 'Q1 estimated tax payment due (April 15). Review YTD income projections.'],
            ['Jul–Sep', 'Q2/Q3 estimated tax payments. Midyear review with advisor.'],
            ['Oct–Dec', 'Max 401(k) contributions. Tax-loss harvesting window. Roth conversion planning. Charitable bunching.'],
          ].map(([period, actions], i) => (
            <div key={i} style={{ padding:'10px 14px', borderBottom: i < 3 ? `1px solid ${C.b1}` : 'none' }}>
              <div style={{ fontFamily:MONO, fontSize:10, fontWeight:700, color:C.gold, marginBottom:3 }}>{period}</div>
              <div style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.55 }}>{actions}</div>
            </div>
          ))}
        </MCard>
      </div>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════
   CALCULATE TAB — Tax Calculator
════════════════════════════════════════════════════════════════ */
function CalcTaxCalc() {
  const [gross, setGross]     = useState(95000)
  const [status, setStatus]   = useState('single')
  const [itemized, setItemized] = useState(0)

  const stdDed     = STD_DED[status]
  const deduction  = Math.max(stdDed, itemized)
  const taxable    = Math.max(0, gross - deduction)
  const tax        = calcTax(taxable, status)
  const marginal   = marginalRate(taxable, status)
  const effective  = gross > 0 ? tax / gross : 0

  const breakdown = useMemo(() => {
    return BRACKETS[status].map((b, i) => {
      const inBracket = Math.max(0, Math.min(taxable, b.max) - b.min)
      return { rate: (b.rate*100).toFixed(0)+'%', income: inBracket, tax: inBracket * b.rate, color: BRACKET_COLORS[i] }
    }).filter(b => b.income > 0)
  }, [taxable, status])

  const barData = breakdown.map(b => ({ name: b.rate, tax: Math.round(b.tax) }))

  return (
    <div style={{ padding:'12px 16px 0' }}>
      {/* Filing status */}
      <div style={{ display:'flex', gap:6, marginBottom:12, flexWrap:'wrap' }}>
        {Object.entries(STATUS_LBL).map(([k, l]) => (
          <button key={k} onClick={() => setStatus(k)} style={{
            padding:'6px 10px', borderRadius:8,
            border:`1px solid ${status===k ? C.gold : C.b2}`,
            background: status===k ? `rgba(201,169,110,0.12)` : C.surf,
            fontFamily:UI, fontSize:11, fontWeight:600,
            color: status===k ? C.gold : C.t3, cursor:'pointer',
          }}>{l}</button>
        ))}
      </div>

      {/* Results */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
        {[
          { l:'Federal Tax Owed', v:fmt(tax), col:C.down },
          { l:'Effective Rate', v:fmtP(effective), col:'#fbbf24' },
          { l:'Marginal Rate', v:fmtP(marginal), col:'#fbbf24' },
          { l:'After-Tax Income', v:fmt(gross - tax), col:C.up },
          { l:'Taxable Income', v:fmt(taxable), col:C.teal },
          { l:'Deduction Used', v:fmt(deduction), col:C.teal },
        ].map(({ l, v, col }) => (
          <div key={l} style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:10, padding:'10px 12px' }}>
            <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.t3, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>{l}</div>
            <div style={{ fontFamily:MONO, fontSize:14, fontWeight:700, color:col }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Sliders */}
      <div style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, padding:'14px', marginBottom:12 }}>
        {[
          { l:'Gross Income', v:gross, set:setGross, min:0, max:600000, step:5000, d:fmt(gross) },
          { l:'Itemized Deductions', v:itemized, set:setItemized, min:0, max:100000, step:500, d:fmt(itemized) },
        ].map(({ l, v, set, min, max, step, d }) => (
          <div key={l} style={{ marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
              <span style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:C.t2 }}>{l}</span>
              <span style={{ fontFamily:MONO, fontSize:12, fontWeight:700, color:C.gold }}>{d}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={v} onChange={e => set(+e.target.value)} style={{ width:'100%', accentColor:C.gold }} />
          </div>
        ))}
        <p style={{ fontFamily:UI, fontSize:10, color:C.t3, margin:0 }}>Standard deduction ({STATUS_LBL[status]}: {fmt(stdDed)}) is used automatically if higher than itemized.</p>
      </div>

      {/* Bracket breakdown bars */}
      {breakdown.length > 0 && (
        <div style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, padding:'14px', marginBottom:12 }}>
          <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.t2, marginBottom:10 }}>Tax by Bracket</div>
          {breakdown.map((b, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
              <span style={{ minWidth:30, fontFamily:MONO, fontSize:11, fontWeight:700, color:b.color }}>{b.rate}</span>
              <div style={{ flex:1, background:C.b2, borderRadius:4, height:7, overflow:'hidden' }}>
                <div style={{ width:`${Math.min(100, (b.income / taxable) * 100)}%`, height:'100%', background:b.color, borderRadius:4 }} />
              </div>
              <span style={{ minWidth:60, fontFamily:MONO, fontSize:10, color:C.t2, textAlign:'right' }}>{fmt(b.tax)}</span>
            </div>
          ))}
        </div>
      )}

      {barData.length > 0 && (
        <div style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, padding:'14px', marginBottom:12 }}>
          <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.t2, marginBottom:10 }}>Tax Owed per Bracket</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={barData} margin={{ top:4, right:4, bottom:0, left:0 }}>
              <XAxis dataKey="name" tick={{ fontFamily:MONO, fontSize:9, fill:C.t3 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily:MONO, fontSize:9, fill:C.t3 }} axisLine={false} tickLine={false} tickFormatter={v => '$'+Math.round(v/1000)+'k'} width={34} />
              <Tooltip contentStyle={{ background:C.raise, border:`1px solid ${C.b2}`, borderRadius:8, fontFamily:UI, fontSize:11 }} formatter={v => [fmt(v), 'Tax']} />
              <Bar dataKey="tax" radius={[3,3,0,0]}>
                {barData.map((_, i) => <Cell key={i} fill={BRACKET_COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <InfoBox icon={AlertCircle} color='#fbbf24'>
        <strong style={{ color:C.t1 }}>Federal income tax only.</strong> Add state income tax (0%–13.3%), FICA (7.65%), and NIIT (3.8%) where applicable for a complete picture.
      </InfoBox>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   CALCULATE TAB — Roth vs Traditional
════════════════════════════════════════════════════════════════ */
function CalcRothVsTrad() {
  const [contrib, setContrib] = useState(10000)
  const [years,   setYears]   = useState(30)
  const [growth,  setGrowth]  = useState(7)
  const [nowRate, setNowRate] = useState(22)
  const [futRate, setFutRate] = useState(24)

  const fv = (pv, r, n) => pv * Math.pow(1 + r / 100, n)

  const tradFV      = fv(contrib, growth, years)
  const tradAfter   = tradFV * (1 - futRate / 100)
  const rothAfterTax = contrib * (1 - nowRate / 100)
  const rothFV      = fv(rothAfterTax, growth, years)
  const rothWins    = rothFV > tradAfter

  return (
    <div style={{ padding:'12px 16px 0' }}>
      {/* Sliders */}
      <div style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, padding:'14px', marginBottom:12 }}>
        {[
          { l:'Annual Contribution', v:contrib, set:setContrib, min:500, max:24500, step:500, d:fmt(contrib) },
          { l:'Years Until Retirement', v:years, set:setYears, min:5, max:45, step:1, d:`${years} yrs` },
          { l:'Annual Growth Rate', v:growth, set:setGrowth, min:1, max:12, step:0.5, d:`${growth}%` },
          { l:'Current Tax Rate', v:nowRate, set:setNowRate, min:10, max:37, step:1, d:`${nowRate}%` },
          { l:'Retirement Tax Rate', v:futRate, set:setFutRate, min:10, max:37, step:1, d:`${futRate}%` },
        ].map(({ l, v, set, min, max, step, d }) => (
          <div key={l} style={{ marginBottom:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
              <span style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:C.t2 }}>{l}</span>
              <span style={{ fontFamily:MONO, fontSize:12, fontWeight:700, color:C.gold }}>{d}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={v} onChange={e => set(+e.target.value)} style={{ width:'100%', accentColor:C.gold }} />
          </div>
        ))}
      </div>

      {/* Results */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
        <div style={{ background:`rgba(0,180,198,0.08)`, border:`1px solid ${C.tealBdr}`, borderRadius:12, padding:'12px 14px' }}>
          <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.teal, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>Roth After-Tax Value</div>
          <div style={{ fontFamily:MONO, fontSize:18, fontWeight:800, color:C.teal }}>{fmt(rothFV)}</div>
          <div style={{ fontFamily:UI, fontSize:10, color:C.t3, marginTop:2 }}>100% tax-free in retirement</div>
        </div>
        <div style={{ background:`rgba(201,169,110,0.08)`, border:`1px solid ${C.goldBdr}`, borderRadius:12, padding:'12px 14px' }}>
          <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.gold, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>Traditional After-Tax</div>
          <div style={{ fontFamily:MONO, fontSize:18, fontWeight:800, color:C.gold }}>{fmt(tradAfter)}</div>
          <div style={{ fontFamily:UI, fontSize:10, color:C.t3, marginTop:2 }}>After {futRate}% retirement tax</div>
        </div>
      </div>

      {/* Verdict */}
      <div style={{ background: rothWins ? `rgba(74,124,89,0.12)` : `rgba(251,191,36,0.1)`, border:`1px solid ${rothWins ? 'rgba(74,124,89,0.3)' : 'rgba(251,191,36,0.3)'}`, borderRadius:12, padding:'14px', marginBottom:12, textAlign:'center' }}>
        <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, color: rothWins ? C.up : '#fbbf24', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:4 }}>
          {rothWins ? 'Roth Wins' : 'Traditional Wins'}
        </div>
        <div style={{ fontFamily:MONO, fontSize:16, fontWeight:800, color: rothWins ? C.up : '#fbbf24' }}>
          By {fmt(Math.abs(rothFV - tradAfter))}
        </div>
        <div style={{ fontFamily:UI, fontSize:11, color:C.t3, marginTop:3 }}>
          with these inputs
        </div>
      </div>

      <InfoBox color='#fbbf24' icon={AlertCircle}>
        <strong style={{ color:C.t1 }}>The great uncertainty:</strong> No one knows their retirement tax rate. CFPs recommend splitting between both for "tax bracket management" — the most resilient strategy.
      </InfoBox>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   RESOURCES TAB
════════════════════════════════════════════════════════════════ */
function TabResources() {
  const CATS = [
    {
      label: 'Official IRS Resources',
      color: C.gold,
      items: [
        { name:'IRS.gov', desc:'Tax forms, publications, free filing options', url:'https://www.irs.gov' },
        { name:'IRS Free File', desc:'Free federal filing if income ≤ $79,000', url:'https://www.irs.gov/filing/free-file-do-your-federal-taxes-for-free' },
        { name:'IRS Withholding Estimator', desc:'Adjust W-4 to avoid underpayment', url:'https://www.irs.gov/individuals/tax-withholding-estimator' },
      ],
    },
    {
      label: 'Planning & Education',
      color: C.teal,
      items: [
        { name:'Tax Foundation', desc:'Independent tax policy research & calculators', url:'https://taxfoundation.org' },
        { name:'NerdWallet Tax Center', desc:'Guides on deductions, credits, and planning', url:'https://www.nerdwallet.com/taxes' },
        { name:'Bogleheads Tax Guide', desc:'Community-driven tax optimization guides', url:'https://www.bogleheads.org/wiki/Tax_planning' },
      ],
    },
    {
      label: 'Professional Help',
      color: C.indigo,
      items: [
        { name:'Find a CPA', desc:'AICPA directory of licensed CPAs', url:'https://www.aicpa.org/forthepublic/findacpa' },
        { name:'Find a CFP', desc:'CFP Board advisor search', url:'https://www.cfp.net/find-a-cfp-professional' },
        { name:'NFCC', desc:'Non-profit financial counseling & tax guidance', url:'https://www.nfcc.org' },
      ],
    },
  ]

  return (
    <>
      {CATS.map(({ label, color, items }) => (
        <div key={label}>
          <MSectionHeader label={label} />
          <div style={{ padding:'0 16px' }}>
            <MCard style={{ padding:0, overflow:'hidden' }}>
              {items.map(({ name, desc }, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderBottom: i < items.length-1 ? `1px solid ${C.b1}` : 'none' }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
                      <span style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.t1 }}>{name}</span>
                      <ExternalLink size={10} color={C.t3} />
                    </div>
                    <div style={{ fontFamily:UI, fontSize:11, color:C.t3 }}>{desc}</div>
                  </div>
                  <ArrowRight size={14} color={color} />
                </div>
              ))}
            </MCard>
          </div>
        </div>
      ))}

      <MSectionHeader label="When to Hire a CPA or CFP" />
      <div style={{ padding:'0 16px 4px' }}>
        <MCard>
          {[
            'You received RSUs, stock options, or ESPP income',
            'You are self-employed or have pass-through business income',
            'You had a major life event: marriage, divorce, inheritance, home sale',
            'You are doing a Roth conversion or backdoor Roth',
            'You hold foreign accounts or have foreign income',
            'Your income is near AMT or NIIT thresholds',
            'You are doing estate planning or charitable giving strategies',
          ].map((item, i) => (
            <div key={i} style={{ display:'flex', gap:8, marginBottom:i < 6 ? 7 : 0 }}>
              <CheckCircle2 size={12} color={C.gold} style={{ flexShrink:0, marginTop:1 }} />
              <span style={{ fontFamily:UI, fontSize:12, color:C.t2 }}>{item}</span>
            </div>
          ))}
        </MCard>
      </div>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════
   ROOT COMPONENT
════════════════════════════════════════════════════════════════ */
const LEARN_TABS = [['brackets','Brackets'],['accounts','Accounts'],['equity','Equity Comp'],['strategies','Strategies']]
const CALC_TABS  = [['taxcalc','Tax Calculator'],['rothvtrad','Roth vs Trad']]
const MAIN_TABS  = [['learn','Learn'],['calc','Calculate'],['resources','Resources']]

export default function MTaxFun() {
  const { state: navState } = useLocation()
  const [mainTab, setMainTab] = useState(navState?.mainTab   || 'learn')
  const [learnSub, setLearnSub] = useState(navState?.learnSub || 'brackets')
  const [calcSub, setCalcSub]   = useState('taxcalc')

  return (
    <div style={{ background:C.bg, minHeight:'100dvh', paddingBottom:88 }}>
      <ScreenHeader title="Tax Planning" subtitle="Learn" accent={C.gold} />

      {/* Main tabs */}
      <div style={{ display:'flex', borderBottom:`1px solid ${C.b2}`, background:C.bg }}>
        {MAIN_TABS.map(([k, l]) => (
          <button key={k} onClick={() => setMainTab(k)} style={{
            flex:1, padding:'11px 0', background:'none', border:'none', cursor:'pointer',
            borderBottom:`2px solid ${mainTab===k ? C.gold : 'transparent'}`,
            fontFamily:UI, fontSize:12, fontWeight:600,
            color: mainTab===k ? C.gold : C.t3,
          }}>{l}</button>
        ))}
      </div>

      {/* Learn sub-tabs */}
      {mainTab === 'learn' && (
        <>
          <PillTabs tabs={LEARN_TABS} active={learnSub} onSelect={setLearnSub} />
          {learnSub === 'brackets'   && <LearnBrackets />}
          {learnSub === 'accounts'   && <LearnAccounts />}
          {learnSub === 'equity'     && <LearnEquity />}
          {learnSub === 'strategies' && <LearnStrategies />}
        </>
      )}

      {/* Calculate sub-tabs */}
      {mainTab === 'calc' && (
        <>
          <PillTabs tabs={CALC_TABS} active={calcSub} onSelect={setCalcSub} />
          {calcSub === 'taxcalc'   && <CalcTaxCalc />}
          {calcSub === 'rothvtrad' && <CalcRothVsTrad />}
        </>
      )}

      {/* Resources */}
      {mainTab === 'resources' && <TabResources />}
    </div>
  )
}
