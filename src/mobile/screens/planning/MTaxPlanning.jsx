import { useState, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTip, ResponsiveContainer, Legend,
} from 'recharts'
import {
  Info, CheckCircle2, AlertCircle, ChevronDown, ChevronUp,
  TrendingUp, Shield, Clock, Layers, BookOpen,
  ArrowRight, Zap, RefreshCw,
} from 'lucide-react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'

// ── 2026 CFP Tax Data ──────────────────────────────────────────────
const BRACKETS = {
  single: [
    { rate: 0.10, min: 0,       max: 12400    },
    { rate: 0.12, min: 12400,   max: 50400    },
    { rate: 0.22, min: 50400,   max: 105700   },
    { rate: 0.24, min: 105700,  max: 201775   },
    { rate: 0.32, min: 201775,  max: 256225   },
    { rate: 0.35, min: 256225,  max: 640600   },
    { rate: 0.37, min: 640600,  max: Infinity },
  ],
  mfj: [
    { rate: 0.10, min: 0,       max: 24800    },
    { rate: 0.12, min: 24800,   max: 100800   },
    { rate: 0.22, min: 100800,  max: 211400   },
    { rate: 0.24, min: 211400,  max: 403550   },
    { rate: 0.32, min: 403550,  max: 512450   },
    { rate: 0.35, min: 512450,  max: 768700   },
    { rate: 0.37, min: 768700,  max: Infinity },
  ],
  hoh: [
    { rate: 0.10, min: 0,       max: 17700    },
    { rate: 0.12, min: 17700,   max: 67450    },
    { rate: 0.22, min: 67450,   max: 105700   },
    { rate: 0.24, min: 105700,  max: 201750   },
    { rate: 0.32, min: 201750,  max: 256200   },
    { rate: 0.35, min: 256200,  max: 640600   },
    { rate: 0.37, min: 640600,  max: Infinity },
  ],
  mfs: [
    { rate: 0.10, min: 0,       max: 12400    },
    { rate: 0.12, min: 12400,   max: 50400    },
    { rate: 0.22, min: 50400,   max: 105700   },
    { rate: 0.24, min: 105700,  max: 201775   },
    { rate: 0.32, min: 201775,  max: 256225   },
    { rate: 0.35, min: 256225,  max: 384350   },
    { rate: 0.37, min: 384350,  max: Infinity },
  ],
}

const STD_DED = { single: 16100, mfj: 32200, hoh: 24150, mfs: 16100 }

const LTCG_BRACKETS = {
  single: [{ rate: '0%', max: '$49,450' }, { rate: '15%', max: '$545,500' }, { rate: '20%', max: 'Over $545,500' }],
  mfj:    [{ rate: '0%', max: '$98,900' }, { rate: '15%', max: '$613,700' }, { rate: '20%', max: 'Over $613,700' }],
  hoh:    [{ rate: '0%', max: '$66,200' }, { rate: '15%', max: '$579,600' }, { rate: '20%', max: 'Over $579,600' }],
  mfs:    [{ rate: '0%', max: '$49,450' }, { rate: '15%', max: '$306,850' }, { rate: '20%', max: 'Over $306,850' }],
}

const RMD_TABLE = {
  72:27.4,73:26.5,74:25.5,75:24.6,76:23.7,77:22.9,78:22.0,79:21.1,
  80:20.2,81:19.4,82:18.5,83:17.7,84:16.8,85:16.0,86:15.2,87:14.4,
  88:13.7,89:12.9,90:12.2,91:11.5,92:10.8,93:10.1,94:9.5, 95:8.9,
  96:8.4, 97:7.8, 98:7.3, 99:6.8,100:6.4,
}

function calcTax(taxableIncome, filingStatus) {
  const brackets = BRACKETS[filingStatus] || BRACKETS.single
  let tax = 0
  for (const b of brackets) {
    if (taxableIncome <= b.min) break
    const taxable = Math.min(taxableIncome, b.max) - b.min
    tax += taxable * b.rate
  }
  return tax
}

function marginalRate(taxableIncome, filingStatus) {
  const brackets = BRACKETS[filingStatus] || BRACKETS.single
  for (const b of [...brackets].reverse()) {
    if (taxableIncome > b.min) return b.rate
  }
  return 0.10
}

const fmt   = n => '$' + Math.round(n || 0).toLocaleString()
const fmtPct = n => (n * 100).toFixed(1) + '%'
const BRACKET_COLORS = ['#94a3b8','#60a5fa','#34d399','#fbbf24','#f97316','#f87171','#e879f9']
const GOLD = C.gold
const TEAL = C.teal
const GREEN = C.success
const RED   = C.down
const AMBER = C.warning

// ── Shared sub-components ──────────────────────────────────────────
function InfoBox({ children, color, icon: Icon = Info }) {
  const c = color || GOLD
  return (
    <div style={{
      display: 'flex', gap: 9, padding: '10px 12px',
      background: c + '14', border: `1px solid ${c}30`, borderRadius: 10, marginTop: 10,
    }}>
      <Icon size={13} color={c} style={{ flexShrink: 0, marginTop: 2 }} />
      <span style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65 }}>{children}</span>
    </div>
  )
}

function MiniStat({ label, value, color, sub }) {
  return (
    <div style={{
      background: C.raise, border: `1px solid ${C.b2}`, borderRadius: 12, padding: '11px 13px',
    }}>
      <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: C.t3, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: MONO, fontSize: 17, fontWeight: 800, color: color || GOLD, lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontFamily: UI, fontSize: 10, color: C.t3, marginTop: 3 }}>{sub}</div>}
    </div>
  )
}

function Accordion({ title, children, defaultOpen = false, accent }) {
  const [open, setOpen] = useState(defaultOpen)
  const a = accent || GOLD
  return (
    <div style={{ border: `1px solid ${C.b2}`, borderRadius: 12, overflow: 'hidden', marginBottom: 8 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '13px 16px', background: open ? a + '10' : C.raise,
          border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{ fontFamily: UI, fontSize: 13, fontWeight: 600, color: open ? C.t1 : C.t2 }}>{title}</span>
        {open
          ? <ChevronUp size={14} color={a} />
          : <ChevronDown size={14} color={C.t3} />}
      </button>
      {open && (
        <div style={{ padding: '14px 16px', background: a + '06', borderTop: `1px solid ${C.b2}` }}>
          {children}
        </div>
      )}
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.t3, marginBottom: 8 }}>
      {children}
    </div>
  )
}

function CheckRow({ text, color }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
      <CheckCircle2 size={12} color={color || GOLD} style={{ flexShrink: 0, marginTop: 2 }} />
      <span style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.6 }}>{text}</span>
    </div>
  )
}

function BulletRow({ text, color }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
      <ArrowRight size={11} color={color || GOLD} style={{ flexShrink: 0, marginTop: 3 }} />
      <span style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.6 }}>{text}</span>
    </div>
  )
}

// ── Tab: Calculator ────────────────────────────────────────────────
function TabCalculator() {
  const [gross,    setGross]    = useState(120000)
  const [filing,   setFiling]   = useState('single')
  const [itemized, setItemized] = useState(0)

  const stdDed    = STD_DED[filing]
  const deduction = Math.max(stdDed, itemized)
  const taxable   = Math.max(0, gross - deduction)
  const tax       = calcTax(taxable, filing)
  const marginal  = marginalRate(taxable, filing)
  const effective = gross > 0 ? tax / gross : 0

  const bracketBreakdown = useMemo(() => {
    return BRACKETS[filing]
      .map(b => ({
        rate:   b.rate,
        income: Math.max(0, Math.min(taxable, b.max) - b.min),
        tax:    Math.max(0, Math.min(taxable, b.max) - b.min) * b.rate,
      }))
      .filter(b => b.income > 0)
  }, [taxable, filing])

  const statusLabels = { single: 'Single', mfj: 'Married Jointly', hoh: 'Head of HH', mfs: 'Married Sep.' }

  return (
    <div style={{ paddingBottom: 8 }}>
      {/* Filing status pill bar */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        {Object.entries(statusLabels).map(([k, l]) => (
          <button key={k} onClick={() => setFiling(k)} style={{
            padding: '6px 11px', borderRadius: 20, cursor: 'pointer',
            border: `1px solid ${filing === k ? GOLD : C.b2}`,
            background: filing === k ? GOLD + '15' : 'transparent',
            color: filing === k ? GOLD : C.t3,
            fontFamily: UI, fontSize: 11, fontWeight: 600,
          }}>{l}</button>
        ))}
      </div>

      {/* Inputs */}
      <MCard>
        <SectionLabel>Income & Deductions</SectionLabel>
        {[
          { label: 'Gross Income', val: gross,    set: setGross,    max: 500000, step: 1000  },
          { label: 'Itemized Deductions', val: itemized, set: setItemized, max: 100000, step: 500 },
        ].map(({ label, val, set, max, step }) => (
          <div key={label} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontFamily: UI, fontSize: 12, fontWeight: 600, color: C.t2 }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: GOLD }}>{fmt(val)}</span>
            </div>
            <input type="range" min={0} max={max} step={step} value={val}
              onChange={e => set(+e.target.value)}
              style={{ width: '100%', accentColor: GOLD }} />
          </div>
        ))}
        <div style={{ background: C.raise, borderRadius: 8, padding: '8px 12px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>Deduction used</span>
          <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: C.t2 }}>
            {fmt(deduction)} ({itemized > stdDed ? 'Itemized' : 'Standard'})
          </span>
        </div>
      </MCard>

      {/* Result stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
        <MiniStat label="Taxable Income" value={fmt(taxable)} color={C.t1} />
        <MiniStat label="Federal Tax" value={fmt(tax)} color={RED} />
        <MiniStat label="Marginal Rate" value={fmtPct(marginal)} color={AMBER} sub="Top bracket" />
        <MiniStat label="Effective Rate" value={fmtPct(effective)} color={GREEN} sub="Average on all income" />
      </div>
      <MCard style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: UI, fontSize: 12, color: C.t2 }}>After-Tax Income</span>
          <span style={{ fontFamily: MONO, fontSize: 18, fontWeight: 800, color: GREEN }}>{fmt(gross - tax)}</span>
        </div>
        <div style={{ fontFamily: UI, fontSize: 10, color: C.t3, marginTop: 3 }}>Before FICA & state taxes</div>
      </MCard>

      {/* Bracket breakdown bars */}
      <MCard>
        <SectionLabel>Tax by Bracket</SectionLabel>
        {bracketBreakdown.map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
            <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: BRACKET_COLORS[i], minWidth: 32 }}>
              {(b.rate * 100).toFixed(0)}%
            </span>
            <div style={{ flex: 1, background: C.b1, borderRadius: 4, height: 7, overflow: 'hidden' }}>
              <div style={{
                width: `${Math.min(100, (b.income / (taxable || 1)) * 100)}%`,
                height: '100%', background: BRACKET_COLORS[i], borderRadius: 4,
              }} />
            </div>
            <span style={{ fontFamily: MONO, fontSize: 10, color: C.t3, minWidth: 52, textAlign: 'right' }}>{fmt(b.tax)}</span>
          </div>
        ))}
        {bracketBreakdown.length === 0 && (
          <div style={{ fontFamily: UI, fontSize: 12, color: C.t3, textAlign: 'center', padding: '12px 0' }}>
            Enter income above to see bracket breakdown
          </div>
        )}
      </MCard>

      {/* Marginal vs effective education */}
      <MCard>
        <SectionLabel>Marginal vs. Effective Rate</SectionLabel>
        <div style={{ background: RED + '10', border: `1px solid ${RED}25`, borderRadius: 10, padding: '10px 12px', marginBottom: 8 }}>
          <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: RED, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 5 }}>Common Misconception</div>
          <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65 }}>
            "I'm in the 24% bracket so I owe 24% of my total income." This is wrong — and causes people to fear raises.
          </div>
        </div>
        <div style={{ background: GREEN + '10', border: `1px solid ${GREEN}25`, borderRadius: 10, padding: '10px 12px' }}>
          <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: GREEN, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 5 }}>The Reality</div>
          <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65 }}>
            Only the dollars in each bracket are taxed at that rate. Your effective rate is almost always well below your marginal bracket. A raise will never reduce your take-home pay.
          </div>
        </div>
      </MCard>

      <InfoBox color={AMBER} icon={AlertCircle}>
        Federal income tax only. Add state income tax (0%–13.3%), FICA (7.65%), and NIIT if applicable for a complete picture.
      </InfoBox>
    </div>
  )
}

// ── Tab: Brackets & Key Numbers ────────────────────────────────────
function TabBrackets() {
  const [view, setView] = useState('brackets')

  const views = [
    { k: 'brackets', l: 'Brackets' },
    { k: 'ltcg',     l: 'Cap. Gains' },
    { k: 'numbers',  l: 'Key Numbers' },
    { k: 'limits',   l: 'Plan Limits' },
  ]

  return (
    <div style={{ paddingBottom: 8 }}>
      {/* Sub-tab bar */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        {views.map(({ k, l }) => (
          <button key={k} onClick={() => setView(k)} style={{
            padding: '6px 13px', borderRadius: 20, cursor: 'pointer',
            border: `1px solid ${view === k ? GOLD : C.b2}`,
            background: view === k ? GOLD + '15' : 'transparent',
            color: view === k ? GOLD : C.t3,
            fontFamily: UI, fontSize: 11, fontWeight: 600,
          }}>{l}</button>
        ))}
      </div>

      {view === 'brackets' && (
        <div>
          {[
            { key: 'single', label: 'Single' },
            { key: 'mfj',    label: 'Married Filing Jointly' },
            { key: 'hoh',    label: 'Head of Household' },
            { key: 'mfs',    label: 'Married Filing Separately' },
          ].map(({ key, label }) => (
            <MCard key={key} style={{ marginBottom: 10 }}>
              <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>{label}</div>
              <div style={{ display: 'flex', padding: '0 0 6px', borderBottom: `1px solid ${C.b1}`, marginBottom: 4 }}>
                <span style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: C.t3, letterSpacing: '0.08em', textTransform: 'uppercase', flex: '0 0 40px' }}>Rate</span>
                <span style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: C.t3, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Income Range</span>
              </div>
              {BRACKETS[key].map((b, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '6px 0', borderBottom: i < BRACKETS[key].length - 1 ? `1px solid ${C.b1}` : 'none',
                }}>
                  <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 800, color: BRACKET_COLORS[i], minWidth: 44 }}>
                    {(b.rate * 100).toFixed(0)}%
                  </span>
                  <span style={{ fontFamily: UI, fontSize: 11, color: C.t2 }}>
                    {b.max === Infinity
                      ? `Over ${fmt(b.min)}`
                      : `${fmt(b.min)} – ${fmt(b.max)}`}
                  </span>
                </div>
              ))}
              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: GOLD + '12', borderRadius: 8 }}>
                <span style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>Standard Deduction</span>
                <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: GOLD }}>{fmt(STD_DED[key])}</span>
              </div>
            </MCard>
          ))}
          <InfoBox>
            The U.S. uses a progressive marginal system. Only the income in each bracket is taxed at that rate. Standard deduction reduces your taxable income before any brackets apply.
          </InfoBox>
        </div>
      )}

      {view === 'ltcg' && (
        <div>
          <MCard style={{ marginBottom: 10 }}>
            <SectionLabel>Long-Term Capital Gains Rates 2026</SectionLabel>
            <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.6, marginBottom: 12 }}>
              Applies to assets held more than 12 months. Significantly lower than ordinary income rates.
            </div>
            {[
              { key: 'single', label: 'Single' },
              { key: 'mfj',    label: 'Married Filing Jointly' },
              { key: 'hoh',    label: 'Head of Household' },
              { key: 'mfs',    label: 'Married Filing Separately' },
            ].map(({ key, label }) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
                {LTCG_BRACKETS[key].map((row, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', padding: '7px 10px',
                    background: i % 2 === 0 ? C.raise : 'transparent', borderRadius: 7, marginBottom: 3,
                  }}>
                    <span style={{
                      fontFamily: MONO, fontSize: 15, fontWeight: 800,
                      color: i === 0 ? GREEN : i === 1 ? AMBER : RED,
                    }}>{row.rate}</span>
                    <span style={{ fontFamily: UI, fontSize: 11, color: C.t2 }}>Up to {row.max}</span>
                  </div>
                ))}
              </div>
            ))}
            <InfoBox color={GREEN} icon={CheckCircle2}>
              If taxable income is below $49,450 (single) or $98,900 (MFJ), you pay 0% federal tax on long-term capital gains. Strategic realizations in low-income years can be completely tax-free. Note: 25% rate on Section 1250 recapture; 28% on collectibles.
            </InfoBox>
          </MCard>

          <MCard>
            <SectionLabel>Short-Term vs Long-Term</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div style={{ background: RED + '10', border: `1px solid ${RED}25`, borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: RED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Short-Term (&lt;12 mo)</div>
                <div style={{ fontFamily: MONO, fontSize: 18, fontWeight: 800, color: RED }}>10–37%</div>
                <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, marginTop: 4 }}>Taxed as ordinary income</div>
              </div>
              <div style={{ background: GREEN + '10', border: `1px solid ${GREEN}25`, borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Long-Term (&gt;12 mo)</div>
                <div style={{ fontFamily: MONO, fontSize: 18, fontWeight: 800, color: GREEN }}>0–20%</div>
                <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, marginTop: 4 }}>Preferential LTCG rates</div>
              </div>
            </div>
          </MCard>

          <MCard>
            <SectionLabel>Roth IRA Income Phase-Out 2026</SectionLabel>
            <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.6, marginBottom: 10 }}>
              Above these MAGI ranges you cannot contribute directly to a Roth IRA.
            </div>
            {[
              { label: 'Single',                  range: '$153,000 – $168,000' },
              { label: 'Married Filing Jointly',  range: '$242,000 – $252,000' },
              { label: 'Married Filing Separately', range: '$0 – $10,000' },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 0', borderBottom: i < 2 ? `1px solid ${C.b1}` : 'none',
              }}>
                <span style={{ fontFamily: UI, fontSize: 12, color: C.t2 }}>{row.label}</span>
                <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: TEAL }}>{row.range}</span>
              </div>
            ))}
            <InfoBox color={TEAL}>
              Backdoor Roth is an alternative for high earners above the phase-out — contribute non-deductible to Traditional IRA, then convert to Roth.
            </InfoBox>
          </MCard>

          <MCard>
            <SectionLabel>FICA Taxes 2026</SectionLabel>
            {[
              { name: 'Social Security',         rate: '6.2%',  note: 'On wages up to $184,500 wage base. Employer also pays 6.2%.' },
              { name: 'Medicare',                rate: '1.45%', note: 'No wage base limit. Employer also pays 1.45%.' },
              { name: 'Additional Medicare',     rate: '0.9%',  note: 'On income over $200K (Single) / $250K (MFJ). Employee only.' },
              { name: 'Net Investment Income',   rate: '3.8%',  note: 'On NII over $200K (S) / $250K (MFJ). Does not apply to wages.' },
            ].map((row, i) => (
              <div key={i} style={{ padding: '9px 0', borderBottom: i < 3 ? `1px solid ${C.b1}` : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontFamily: UI, fontSize: 12, fontWeight: 600, color: C.t1 }}>{row.name}</span>
                  <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 800, color: GOLD }}>{row.rate}</span>
                </div>
                <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, lineHeight: 1.5 }}>{row.note}</div>
              </div>
            ))}
          </MCard>
        </div>
      )}

      {view === 'numbers' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
            {[
              { label: 'Std. Ded. — Single',   value: '$16,100', sub: '+$2,050 if 65+ or blind',       color: GOLD  },
              { label: 'Std. Ded. — MFJ',      value: '$32,200', sub: '+$1,650 per spouse 65+',        color: GOLD  },
              { label: 'Std. Ded. — HoH',      value: '$24,150', sub: '2026 CFP Board figure',         color: GOLD  },
              { label: '401(k)/403(b)/457',     value: '$24,500', sub: '+$8,000 catch-up age 50–59/64+', color: TEAL },
              { label: 'Super Catch-Up 60–63',  value: '$11,250', sub: 'SECURE 2.0 — total $35,750',    color: TEAL },
              { label: 'IRA / Roth IRA',        value: '$7,500',  sub: '+$1,100 catch-up age 50+',      color: TEAL },
              { label: 'HSA — Self-Only',        value: '$4,400',  sub: '+$1,000 catch-up age 55+',      color: GREEN },
              { label: 'HSA — Family',           value: '$8,750',  sub: '+$1,000 catch-up age 55+',      color: GREEN },
              { label: 'SS Wage Base',           value: '$184,500', sub: '6.2% SS tax on wages up to this', color: C.sky },
              { label: 'Annual Gift Exclusion',  value: '$19,000', sub: 'Per recipient, per year',       color: AMBER },
              { label: 'Estate Exemption',       value: '$15M',    sub: 'Applicable exclusion 2026',     color: AMBER },
              { label: 'NIIT Threshold (S/HoH)', value: '$200,000', sub: '3.8% on net investment income', color: RED  },
            ].map(({ label, value, sub, color }) => (
              <MiniStat key={label} label={label} value={value} color={color} sub={sub} />
            ))}
          </div>

          <MCard>
            <SectionLabel>2026 AMT Exemptions</SectionLabel>
            {[
              ['Single & HoH',          '$90,100',  'Phase-out at $500,000'    ],
              ['Married Filing Jointly', '$140,200', 'Phase-out at $1,000,000'  ],
              ['Married Filing Sep.',    '$70,100',  'Phase-out at $500,000'    ],
              ['Trusts & Estates',       '$31,400',  'Phase-out at $104,800'    ],
            ].map(([status, ex, po], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < 3 ? `1px solid ${C.b1}` : 'none' }}>
                <span style={{ fontFamily: UI, fontSize: 12, color: C.t2 }}>{status}</span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: AMBER }}>{ex}</div>
                  <div style={{ fontFamily: UI, fontSize: 10, color: C.t3 }}>{po}</div>
                </div>
              </div>
            ))}
            <InfoBox color={AMBER} icon={AlertCircle}>
              AMT rates: 26% on AMTI up to $244,500; 28% above. Phase-out reduces exemption $0.25 per $1 over threshold.
            </InfoBox>
          </MCard>

          <MCard>
            <SectionLabel>Education & Other Phase-Outs 2026</SectionLabel>
            {[
              ['EE Bonds Education',          '$101,800–$116,800',  '$152,650–$182,650'],
              ['Coverdell ESA',               '$95,000–$110,000',   '$190,000–$220,000'],
              ['Lifetime Learning Credit',    '$80,000–$90,000',    '$160,000–$180,000'],
              ['American Opportunity Credit', '$80,000–$90,000',    '$160,000–$180,000'],
              ['Student Loan Interest',       '$85,000–$100,000',   '$175,000–$205,000'],
              ['Child Tax Credit (begins)',   '$200,000',           '$400,000'],
            ].map(([benefit, single, mfj], i) => (
              <div key={i} style={{ padding: '8px 0', borderBottom: i < 5 ? `1px solid ${C.b1}` : 'none' }}>
                <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 600, color: C.t1, marginBottom: 4 }}>{benefit}</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div>
                    <div style={{ fontFamily: UI, fontSize: 9, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Single</div>
                    <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: TEAL }}>{single}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: UI, fontSize: 9, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>MFJ</div>
                    <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: TEAL }}>{mfj}</div>
                  </div>
                </div>
              </div>
            ))}
          </MCard>
        </div>
      )}

      {view === 'limits' && (
        <MCard>
          <SectionLabel>2026 Retirement Plan Contribution Limits</SectionLabel>
          {[
            ['401(k) / 403(b) / 457 deferrals',       '$24,500', TEAL ],
            ['Catch-up age 50–59, 64+',                '$8,000',  TEAL ],
            ['Super catch-up ages 60–63',              '$11,250', TEAL ],
            ['Defined contribution plan limit',        '$72,000', GOLD ],
            ['Defined benefit plan limit',             '$290,000', GOLD ],
            ['SIMPLE elective deferral',               '$17,000', C.sky ],
            ['SIMPLE catch-up age 50+',                '$4,000',  C.sky ],
            ['SIMPLE catch-up ages 60–63',             '$5,250',  C.sky ],
            ['SEP contribution limit',                 '$72,000', GOLD ],
            ['Maximum includible compensation',        '$360,000', C.t2 ],
            ['Highly compensated employee',            '$160,000', AMBER ],
            ['Key employee (top-heavy plan)',          '>$235,000', AMBER ],
            ['IRA / Roth IRA contribution',            '$7,500',  GREEN ],
            ['IRA / Roth IRA catch-up (50+)',          '$1,100',  GREEN ],
            ['IRA deduction phase-out (Single/HoH)',   '$81,000–$91,000', C.t2 ],
            ['IRA deduction phase-out (MFJ)',          '$129,000–$149,000', C.t2 ],
            ['Roth IRA phase-out (Single)',            '$153,000–$168,000', GREEN ],
            ['Roth IRA phase-out (MFJ)',               '$242,000–$252,000', GREEN ],
            ['Roth IRA phase-out (MFS)',               '$0–$10,000', GREEN ],
          ].map(([label, value, color], i, arr) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 0', borderBottom: i < arr.length - 1 ? `1px solid ${C.b1}` : 'none',
              background: i % 2 === 0 ? 'transparent' : C.raise + '60',
            }}>
              <span style={{ fontFamily: UI, fontSize: 12, color: C.t2, flex: 1, paddingRight: 8 }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color, flexShrink: 0 }}>{value}</span>
            </div>
          ))}
        </MCard>
      )}
    </div>
  )
}

// ── Tab: Strategies ────────────────────────────────────────────────
function TabStrategies() {
  const [contrib, setContrib] = useState(10000)
  const [years,   setYears]   = useState(30)
  const [growth,  setGrowth]  = useState(7)
  const [nowRate, setNowRate] = useState(22)
  const [futRate, setFutRate] = useState(24)

  const fv = (pv, r, n) => pv * Math.pow(1 + r / 100, n)
  const tradFV    = fv(contrib, growth, years)
  const tradAfter = tradFV * (1 - futRate / 100)
  const rothAfterTax = contrib * (1 - nowRate / 100)
  const rothFV    = fv(rothAfterTax, growth, years)
  const rothWins  = rothFV > tradAfter

  return (
    <div style={{ paddingBottom: 8 }}>

      {/* HSA Triple Advantage */}
      <MCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: GREEN + '18', border: `1px solid ${GREEN}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={15} color={GREEN} />
          </div>
          <div>
            <div style={{ fontFamily: UI, fontSize: 14, fontWeight: 700, color: C.t1 }}>HSA — Triple Tax Advantage</div>
            <div style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>The only triple tax-advantaged account</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
          <MiniStat label="Self-Only 2026" value="$4,400" color={GREEN} sub="HDHP min ded: $1,700" />
          <MiniStat label="Family 2026"    value="$8,750" color={GREEN} sub="Catch-up +$1,000 at 55" />
        </div>
        {[
          'Contributions are tax-deductible (or pre-tax via payroll)',
          'Invested funds grow completely tax-free',
          'Withdrawals for qualified medical expenses are tax-free',
          'At age 65, functions like a Traditional IRA for any use',
          'No "use it or lose it" — balances roll over indefinitely',
        ].map((item, i) => <CheckRow key={i} text={item} color={GREEN} />)}
        <InfoBox color={GREEN} icon={CheckCircle2}>
          HSA Power Strategy: Pay medical expenses out-of-pocket now, save every receipt, invest the HSA in index funds. Reimburse yourself years later — tax-free — while growth compounds. No time limit on reimbursements.
        </InfoBox>
      </MCard>

      {/* Roth vs Traditional */}
      <MCard>
        <div style={{ fontFamily: DISPLAY, fontSize: 16, fontWeight: 700, color: C.t1, marginBottom: 4 }}>Roth vs. Traditional 401(k)</div>
        <div style={{ fontFamily: UI, fontSize: 12, color: C.t3, marginBottom: 12 }}>Key question: will your tax rate be higher now or in retirement?</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
          <div style={{ background: TEAL + '10', border: `1px solid ${TEAL}30`, borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 800, color: TEAL, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Roth 401(k)</div>
            {[['After-tax', 'Contributions'], ['Tax-free', 'Growth'], ['Tax-free', 'Withdrawals'], ['None', 'RMDs'], ['No limit', 'Income limits']].map(([v, k], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: i < 4 ? `1px solid ${C.b1}` : 'none' }}>
                <span style={{ fontFamily: UI, fontSize: 10, color: C.t3 }}>{k}</span>
                <span style={{ fontFamily: UI, fontSize: 10, fontWeight: 600, color: TEAL }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ background: GOLD + '10', border: `1px solid ${GOLD}30`, borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 800, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Traditional 401(k)</div>
            {[['Pre-tax', 'Contributions'], ['Deferred', 'Growth'], ['Taxed', 'Withdrawals'], ['Age 73', 'RMDs'], ['None', 'Income limits']].map(([v, k], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: i < 4 ? `1px solid ${C.b1}` : 'none' }}>
                <span style={{ fontFamily: UI, fontSize: 10, color: C.t3 }}>{k}</span>
                <span style={{ fontFamily: UI, fontSize: 10, fontWeight: 600, color: GOLD }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive comparison */}
        <SectionLabel>Interactive Comparison</SectionLabel>
        {[
          { label: 'Annual Contribution', val: contrib, set: setContrib, max: 30000, step: 500,  fmt: v => fmt(v) },
          { label: 'Years to Retirement', val: years,   set: setYears,   max: 40,    step: 1,    fmt: v => v + ' yrs' },
          { label: 'Annual Growth Rate',  val: growth,  set: setGrowth,  max: 12,    step: 0.5,  fmt: v => v + '%' },
          { label: 'Current Tax Rate',    val: nowRate, set: setNowRate, max: 40,    step: 1,    fmt: v => v + '%' },
          { label: 'Retirement Tax Rate', val: futRate, set: setFutRate, max: 40,    step: 1,    fmt: v => v + '%' },
        ].map(({ label, val, set, max, step, fmt: f }) => (
          <div key={label} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: GOLD }}>{f(val)}</span>
            </div>
            <input type="range" min={0} max={max} step={step} value={val}
              onChange={e => set(Number(e.target.value))}
              style={{ width: '100%', accentColor: GOLD }} />
          </div>
        ))}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
          <div style={{ background: TEAL + '12', border: `1px solid ${TEAL}30`, borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
            <div style={{ fontFamily: UI, fontSize: 9, color: TEAL, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Roth Value</div>
            <div style={{ fontFamily: MONO, fontSize: 14, fontWeight: 800, color: TEAL, marginTop: 4 }}>{fmt(rothFV)}</div>
          </div>
          <div style={{ background: GOLD + '12', border: `1px solid ${GOLD}30`, borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
            <div style={{ fontFamily: UI, fontSize: 9, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Trad. Value</div>
            <div style={{ fontFamily: MONO, fontSize: 14, fontWeight: 800, color: GOLD, marginTop: 4 }}>{fmt(tradAfter)}</div>
          </div>
          <div style={{
            background: (rothWins ? GREEN : AMBER) + '12',
            border: `1px solid ${rothWins ? GREEN : AMBER}30`, borderRadius: 10, padding: '10px 8px', textAlign: 'center',
          }}>
            <div style={{ fontFamily: UI, fontSize: 9, color: rothWins ? GREEN : AMBER, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Verdict</div>
            <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 800, color: rothWins ? GREEN : AMBER, marginTop: 4 }}>
              {rothWins ? 'Roth' : 'Trad.'} wins
            </div>
          </div>
        </div>
      </MCard>

      {/* Asset Location */}
      <MCard>
        <div style={{ fontFamily: DISPLAY, fontSize: 16, fontWeight: 700, color: C.t1, marginBottom: 4 }}>Asset Location Strategy</div>
        <div style={{ fontFamily: UI, fontSize: 12, color: C.t3, marginBottom: 12, lineHeight: 1.6 }}>
          Place the right investments in the right account type to minimize lifetime taxes. Estimated benefit: 0.10–0.45%/year in after-tax alpha.
        </div>
        {[
          {
            label: 'Taxable Brokerage', color: AMBER, icon: TrendingUp,
            place:  ['Index funds (low turnover)', 'ETFs', 'Municipal bonds', 'Growth stocks held long-term'],
            avoid:  ['High-yield bonds', 'REITs', 'Active high-turnover funds'],
          },
          {
            label: 'Traditional IRA / 401(k)', color: GOLD, icon: Shield,
            place:  ['High-yield bonds', 'REITs', 'TIPS', 'Active funds', 'Commodities'],
            avoid:  ['Municipal bonds (exempt income wasted)', 'Growth stocks (converts LTCG to ordinary)'],
          },
          {
            label: 'Roth IRA / Roth 401(k)', color: TEAL, icon: Zap,
            place:  ['Highest-growth potential assets', 'Small-cap / emerging markets', 'Speculative growth', 'QSBS'],
            avoid:  ['Bonds / stable value (wastes tax-free growth)', 'Cash'],
          },
        ].map(({ label, color, icon: Icon, place, avoid }) => (
          <div key={label} style={{ background: C.raise, border: `1px solid ${C.b2}`, borderRadius: 12, padding: '12px', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <Icon size={13} color={color} />
              <span style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color }}>{label}</span>
            </div>
            <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>Place Here</div>
            {place.map((item, i) => <CheckRow key={i} text={item} color={GREEN} />)}
            <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: RED, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '8px 0 5px' }}>Avoid Here</div>
            {avoid.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 7, marginBottom: 4 }}>
                <span style={{ color: RED, fontSize: 12, flexShrink: 0 }}>–</span>
                <span style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        ))}
      </MCard>

      {/* Tax reduction quick list */}
      <MCard>
        <div style={{ fontFamily: DISPLAY, fontSize: 16, fontWeight: 700, color: C.t1, marginBottom: 12 }}>Top Tax Reduction Strategies</div>
        {[
          { label: 'Max 401(k)/403(b)', note: 'Reduce taxable income by up to $24,500 ($35,750 ages 60–63)', color: TEAL },
          { label: 'Fund HSA Fully',    note: '$4,400 self-only / $8,750 family — triple tax advantage',     color: GREEN },
          { label: 'Max IRA / Roth',    note: '$7,500 limit ($8,600 age 50+) — pick based on rate',        color: GOLD },
          { label: 'Tax-Loss Harvest',  note: 'Offset gains and up to $3,000 ordinary income annually',      color: AMBER },
          { label: '529 Education',     note: 'State deduction varies — up to $10,000/yr K-12 use',         color: C.sky },
          { label: 'Donor-Advised Fund', note: 'Bunch multiple years of giving in a single high-income year', color: TEAL },
          { label: 'Roth Conversions',  note: 'Convert in low-income years to reduce future RMDs',          color: GOLD },
          { label: 'QBI Deduction',     note: 'Pass-through owners: up to 20% deduction on qualified income', color: GREEN },
        ].map(({ label, note, color }, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, padding: '9px 0', borderBottom: i < 7 ? `1px solid ${C.b1}` : 'none' }}>
            <div style={{ width: 4, borderRadius: 2, background: color, flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 2 }}>{label}</div>
              <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, lineHeight: 1.5 }}>{note}</div>
            </div>
          </div>
        ))}
      </MCard>

      {/* Standard vs Itemized */}
      <MCard>
        <div style={{ fontFamily: DISPLAY, fontSize: 16, fontWeight: 700, color: C.t1, marginBottom: 10 }}>Standard vs. Itemized</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
          <div style={{ background: GOLD + '10', border: `1px solid ${GOLD}30`, borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Standard</div>
            {['Simple — no tracking required', 'Single: $16,100', 'MFJ: $32,200', 'HoH: $24,150', 'Extra if 65+ or blind'].map((t, i) => (
              <div key={i} style={{ fontFamily: UI, fontSize: 11, color: C.t2, marginBottom: 3 }}>{t}</div>
            ))}
          </div>
          <div style={{ background: TEAL + '10', border: `1px solid ${TEAL}30`, borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: TEAL, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Itemized</div>
            {['Requires documentation', 'Mortgage interest', 'State & local taxes (SALT cap $10K)', 'Charitable contributions', 'Medical expenses >7.5% AGI'].map((t, i) => (
              <div key={i} style={{ fontFamily: UI, fontSize: 11, color: C.t2, marginBottom: 3 }}>{t}</div>
            ))}
          </div>
        </div>
        <InfoBox>
          Choose itemized only if your deductible expenses exceed the standard deduction. Most taxpayers benefit more from the standard deduction after TCJA.
        </InfoBox>
      </MCard>

    </div>
  )
}

// ── Tab: Advanced ──────────────────────────────────────────────────
function TabAdvanced() {
  // Roth Conversion Analyzer state
  const [rcBalance,      setRcBalance]      = useState(250000)
  const [rcCurrentAge,   setRcCurrentAge]   = useState(45)
  const [rcRetireAge,    setRcRetireAge]     = useState(65)
  const [rcCurrentIncome, setRcCurrentIncome] = useState(95000)
  const [rcConvert,      setRcConvert]      = useState(20000)
  const [rcRetireIncome, setRcRetireIncome] = useState(60000)
  const [rcFiling,       setRcFiling]       = useState('single')

  // RMD Calculator state
  const [rmdBalance,    setRmdBalance]    = useState(850000)
  const [rmdAge,        setRmdAge]        = useState(74)
  const [rmdOtherInc,   setRmdOtherInc]   = useState(45000)
  const [rmdFiling,     setRmdFiling]     = useState('single')

  const stdDed = STD_DED[rcFiling]
  const conversionTaxCost =
    calcTax(Math.max(0, rcCurrentIncome + rcConvert - stdDed), rcFiling) -
    calcTax(Math.max(0, rcCurrentIncome - stdDed), rcFiling)
  const yearsToRetire  = Math.max(1, rcRetireAge - rcCurrentAge)
  const retireTaxOnTrad =
    calcTax(Math.max(0, rcRetireIncome + rcConvert - stdDed), rcFiling) -
    calcTax(Math.max(0, rcRetireIncome - stdDed), rcFiling)
  const netBenefit = retireTaxOnTrad - conversionTaxCost

  const projData = Array.from({ length: Math.min(yearsToRetire + 1, 21) }, (_, i) => ({
    yr:   rcCurrentAge + i,
    trad: Math.round(rcConvert * Math.pow(1.07, i)),
    roth: Math.round((rcConvert - conversionTaxCost) * Math.pow(1.07, i)),
  }))

  // RMD calc
  const rmdDivisor  = RMD_TABLE[Math.min(Math.max(rmdAge, 72), 100)] || 6.4
  const rmdAmount   = rmdBalance / rmdDivisor
  const taxOnRMD    =
    calcTax(Math.max(0, rmdOtherInc + rmdAmount - STD_DED[rmdFiling]), rmdFiling) -
    calcTax(Math.max(0, rmdOtherInc - STD_DED[rmdFiling]), rmdFiling)
  const rmdPenalty  = rmdAmount * 0.25

  const futureRMDs = Array.from({ length: 8 }, (_, i) => {
    const a   = rmdAge + i
    const div = RMD_TABLE[Math.min(a, 100)] || 6.4
    const bal = Math.max(0, rmdBalance * Math.pow(1.05, i) - (rmdBalance / rmdDivisor) * i)
    return { age: a, bal: Math.round(bal), rmd: Math.round(bal / div), div }
  })

  const FilingPills = ({ value, onChange }) => (
    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
      {[['single','Single'],['mfj','MFJ'],['hoh','HOH'],['mfs','MFS']].map(([v, l]) => (
        <button key={v} onClick={() => onChange(v)} style={{
          padding: '5px 12px', borderRadius: 20, cursor: 'pointer',
          border: `1px solid ${value === v ? TEAL : C.b2}`,
          background: value === v ? TEAL + '15' : 'transparent',
          color: value === v ? TEAL : C.t3,
          fontFamily: UI, fontSize: 11, fontWeight: 600,
        }}>{l}</button>
      ))}
    </div>
  )

  const Slider = ({ label, val, set, min = 0, max, step = 1000, fmtFn }) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>{label}</span>
        <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: GOLD }}>
          {fmtFn ? fmtFn(val) : fmt(val)}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={val}
        onChange={e => set(Number(e.target.value))}
        style={{ width: '100%', accentColor: GOLD }} />
    </div>
  )

  return (
    <div style={{ paddingBottom: 8 }}>

      {/* Tax-Loss Harvesting */}
      <Accordion title="Tax-Loss Harvesting" accent={TEAL}>
        <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65, marginBottom: 10 }}>
          Deliberately realizing investment losses to offset capital gains — one of the few legal ways to time the tax code in your favor.
        </div>
        {[
          'Sell a position that is down from your purchase price',
          'Realized loss offsets capital gains dollar-for-dollar',
          'Up to $3,000 of net losses can offset ordinary income per year',
          'Unused losses carry forward indefinitely',
          'Immediately reinvest in a similar (not identical) asset to maintain exposure',
          'Net effect: defer or eliminate taxes without leaving the market',
        ].map((item, i) => <BulletRow key={i} text={item} color={TEAL} />)}
        <div style={{ background: RED + '10', border: `1px solid ${RED}25`, borderRadius: 10, padding: '10px 12px', marginTop: 10 }}>
          <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, color: RED, marginBottom: 5 }}>The Wash Sale Rule</div>
          <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65 }}>
            Cannot claim a loss if you buy a substantially identical security within 30 days before or after the sale (61-day window). The wash sale rule applies across all accounts including IRAs. Workaround: sell VTSAX, buy VTI — different funds tracking same index are generally not identical.
          </div>
        </div>
      </Accordion>

      {/* Backdoor Roth */}
      <Accordion title="Backdoor Roth IRA" accent={GREEN}>
        <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65, marginBottom: 10 }}>
          For high earners who exceed the Roth IRA income limits. A fully legal two-step conversion strategy.
        </div>
        {[
          { step: '1', label: 'Contribute to Traditional IRA', desc: 'Make a non-deductible contribution (up to $7,500). File Form 8606 to document the basis.', color: TEAL },
          { step: '2', label: 'Do Not Invest Yet', desc: 'Leave as cash to avoid gains before conversion, which could complicate the math.', color: TEAL },
          { step: '3', label: 'Convert to Roth IRA', desc: 'Convert the Traditional IRA to Roth. Since no deduction was taken, only any growth is taxable.', color: GREEN },
          { step: '4', label: 'Pay Tax on Gains Only', desc: 'If done quickly, almost no tax owed. All future growth is permanently tax-free.', color: GREEN },
        ].map(({ step, label, desc, color }) => (
          <div key={step} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: color + '20', border: `1px solid ${color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 800, color }}>{step}</span>
            </div>
            <div>
              <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1, marginBottom: 2 }}>{label}</div>
              <div style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.55 }}>{desc}</div>
            </div>
          </div>
        ))}
        <InfoBox color={RED} icon={AlertCircle}>
          <strong>The Pro-Rata Rule:</strong> If you have pre-tax Traditional IRA balances, the IRS treats ALL your IRAs as one pool. Most of the conversion becomes taxable. Solution: roll existing pre-tax IRAs into your employer 401(k) first.
        </InfoBox>
      </Accordion>

      {/* NIIT */}
      <Accordion title="Net Investment Income Tax (NIIT)" accent={RED}>
        <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65, marginBottom: 8 }}>
          A 3.8% surcharge on investment income for higher earners. Thresholds: $250,000 MFJ / $200,000 Single/HoH / $125,000 MFS.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          <div>
            <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: RED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Triggers NIIT</div>
            {['Interest income', 'Dividends', 'Capital gains', 'Rental income', 'Royalties', 'Passive income'].map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 5, marginBottom: 3 }}>
                <span style={{ color: RED, fontSize: 11 }}>•</span>
                <span style={{ fontFamily: UI, fontSize: 11, color: C.t2 }}>{t}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Excluded</div>
            {['Wages & SE income', 'Social Security', 'Muni bond interest', '401(k)/IRA distributions', 'Roth distributions', 'Active business income'].map((t, i) => (
              <CheckRow key={i} text={t} color={GREEN} />
            ))}
          </div>
        </div>
        <div style={{ background: C.raise, border: `1px solid ${C.b2}`, borderRadius: 10, padding: '10px 12px' }}>
          <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1, marginBottom: 6 }}>Effective LTCG Rate at Top (CA example)</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[['LTCG Rate','20.0%',AMBER],['+ NIIT','3.8%',RED],['+ State CA','13.3%',RED],['= Total','37.1%',RED]].map(([l,v,c]) => (
              <div key={l} style={{ background: C.bg, borderRadius: 8, padding: '6px 10px', textAlign: 'center' }}>
                <div style={{ fontFamily: UI, fontSize: 9, color: C.t3 }}>{l}</div>
                <div style={{ fontFamily: MONO, fontSize: 14, fontWeight: 800, color: c }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </Accordion>

      {/* Charitable Giving */}
      <Accordion title="Charitable Giving Strategies" accent={TEAL}>
        {[
          { label: 'Donate Appreciated Stock', color: TEAL,
            points: ['Deduct full FMV — not your cost basis', 'Zero capital gains tax on the appreciation', 'Must hold 12+ months for LTCG treatment'] },
          { label: 'Donor-Advised Fund (DAF)', color: GREEN,
            points: ['Contribute assets now, grant to charity later', 'Immediate full deduction in year of contribution', '"Bunching" strategy: multiple years of giving in one'] },
          { label: 'Qualified Charitable Distribution (QCD)', color: GOLD,
            points: ['Age 70½+: up to $105,000/yr directly from IRA to charity', 'Counts toward RMD but excluded from income', 'Reduces MAGI — can lower Medicare IRMAA premiums'] },
          { label: 'Charitable Remainder Trust (CRT)', color: AMBER,
            points: ['Trust sells appreciated asset — no capital gains tax', 'Receive income stream for life or term', 'Remainder passes to charity at end'] },
        ].map(({ label, color, points }) => (
          <div key={label} style={{ background: C.raise, border: `1px solid ${C.b2}`, borderRadius: 10, padding: '10px 12px', marginBottom: 8 }}>
            <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color, marginBottom: 8 }}>{label}</div>
            {points.map((p, i) => <CheckRow key={i} text={p} color={color} />)}
          </div>
        ))}
      </Accordion>

      {/* Equity Compensation */}
      <Accordion title="Equity Compensation (RSU / ESPP / ISO)" accent={AMBER}>
        <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: AMBER, marginBottom: 8 }}>RSUs — Restricted Stock Units</div>
        {[
          { label: 'Grant Date',   desc: 'No tax event. Just a promise of future shares.', color: C.t3 },
          { label: 'Vesting Date', desc: 'FMV on vest date = ordinary income. Employer withholds at 22% supplemental — often under your actual bracket. High earners may owe $20K–$100K+ extra at tax time.', color: RED },
          { label: 'Sale &lt;12 mo', desc: 'Gain above FMV at vest taxed as ordinary income (up to 37%).', color: RED },
          { label: 'Sale &gt;12 mo', desc: 'Gain above FMV at vest taxed at preferential LTCG rates (0/15/20%). Much better.', color: GREEN },
        ].map(({ label, desc, color }) => (
          <div key={label} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 3, borderRadius: 2, background: color, flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, color, marginBottom: 2 }}
                dangerouslySetInnerHTML={{ __html: label }} />
              <div style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.55 }}>{desc}</div>
            </div>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${C.b1}`, paddingTop: 10, marginTop: 4 }}>
          <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: TEAL, marginBottom: 6 }}>RSU Planning Strategies</div>
          {['Track basis carefully — FMV at each vest date', 'Hold 12+ months for LTCG treatment on appreciation', 'Donate appreciated shares to charity (avoid cap gains)', 'Consider 10b5-1 plan for systematic selling'].map((t, i) => <CheckRow key={i} text={t} color={TEAL} />)}
        </div>
        <div style={{ borderTop: `1px solid ${C.b1}`, paddingTop: 10, marginTop: 4 }}>
          <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: GREEN, marginBottom: 6 }}>ESPP</div>
          <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65, marginBottom: 6 }}>
            Employee Stock Purchase Plans typically offer a 15% discount with lookback. Maximize contributions — even immediate sale locks in a guaranteed 15–35% effective return. For qualifying disposition treatment, hold 2 years from grant + 1 year from purchase.
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${C.b1}`, paddingTop: 10, marginTop: 4 }}>
          <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: AMBER, marginBottom: 6 }}>ISO vs. NSO</div>
          {[
            ['ISOs: Employee only', 'No regular tax at exercise (AMT preference item)', 'LTCG on all gain if qualifying hold'],
            ['NSOs: Anyone', 'Ordinary income on spread at exercise', 'LTCG only on post-exercise gain after 1 yr'],
          ].map(([title, t1, t2], i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, color: i === 0 ? GREEN : C.t2, marginBottom: 3 }}>{title}</div>
              <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, marginBottom: 1 }}>{t1}</div>
              <div style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>{t2}</div>
            </div>
          ))}
          <InfoBox color={AMBER} icon={AlertCircle}>
            ISO exercise spreads are AMT preference items. Large ISO exercises in one year can trigger AMT even with no cash received. Work with a CPA before exercising large grants.
          </InfoBox>
        </div>
        <div style={{ borderTop: `1px solid ${C.b1}`, paddingTop: 10, marginTop: 4 }}>
          <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: TEAL, marginBottom: 4 }}>QSBS — Section 1202</div>
          <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65, marginBottom: 6 }}>
            Up to $10M (or 10x basis) in gains excluded from federal tax on qualifying C-corp stock held 5+ years. One of the most powerful benefits for startup founders.
          </div>
          {['C-corp at time of issuance', 'Gross assets ≤ $50M at issuance', 'Active trade or business', 'Must be original-issue shares', '100% exclusion if acquired after 9/27/2010'].map((t, i) => <CheckRow key={i} text={t} color={GREEN} />)}
        </div>
      </Accordion>

      {/* Roth Conversion Analyzer */}
      <MCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <RefreshCw size={15} color={GOLD} />
          <div style={{ fontFamily: DISPLAY, fontSize: 16, fontWeight: 700, color: C.t1 }}>Roth Conversion Analyzer</div>
        </div>
        <div style={{ fontFamily: UI, fontSize: 12, color: C.t3, lineHeight: 1.6, marginBottom: 12 }}>
          Should you convert IRA/401(k) funds to Roth now? Calculates whether paying taxes today saves more than deferring to retirement.
        </div>

        <FilingPills value={rcFiling} onChange={setRcFiling} />

        <Slider label="Conversion Amount This Year" val={rcConvert} set={setRcConvert} max={200000} />
        <Slider label="Current Annual Income" val={rcCurrentIncome} set={setRcCurrentIncome} max={400000} step={2000} />
        <Slider label="Expected Retirement Income" val={rcRetireIncome} set={setRcRetireIncome} max={300000} step={2000} />
        <Slider label="Current Age" val={rcCurrentAge} set={setRcCurrentAge} min={22} max={72} step={1} fmtFn={v => v + ' yrs'} />
        <Slider label="Retirement Age" val={rcRetireAge} set={setRcRetireAge} min={50} max={80} step={1} fmtFn={v => v + ' yrs'} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          <div style={{ background: RED + '0c', border: `1px solid ${RED}28`, borderRadius: 12, padding: '10px 12px', textAlign: 'center' }}>
            <div style={{ fontFamily: MONO, fontSize: 18, fontWeight: 800, color: RED }}>{fmt(conversionTaxCost)}</div>
            <div style={{ fontFamily: UI, fontSize: 10, color: C.t3, marginTop: 4 }}>Tax Cost Now</div>
          </div>
          <div style={{ background: GREEN + '0c', border: `1px solid ${GREEN}28`, borderRadius: 12, padding: '10px 12px', textAlign: 'center' }}>
            <div style={{ fontFamily: MONO, fontSize: 18, fontWeight: 800, color: GREEN }}>{fmt(retireTaxOnTrad)}</div>
            <div style={{ fontFamily: UI, fontSize: 10, color: C.t3, marginTop: 4 }}>Tax Saved in Retirement</div>
          </div>
        </div>

        <div style={{
          padding: '10px 12px', borderRadius: 12, marginBottom: 12,
          background: (netBenefit > 0 ? GREEN : RED) + '0c',
          border: `1px solid ${netBenefit > 0 ? GREEN : RED}28`,
        }}>
          <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: netBenefit > 0 ? GREEN : RED, marginBottom: 4 }}>
            {netBenefit > 0 ? 'Conversion Recommended' : 'Conversion May Not Be Optimal'}
          </div>
          <div style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.6 }}>
            {netBenefit > 0
              ? `Converting saves ${fmt(netBenefit)} in lifetime taxes. Current rate is lower than projected retirement rate.`
              : `You are in a higher bracket now than projected retirement. Deferring keeps more money working tax-deferred.`}
          </div>
        </div>

        <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
          Growth Projection
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={projData}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.b1} />
            <XAxis dataKey="yr" tick={{ fontSize: 9, fill: C.t3, fontFamily: MONO }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: C.t3 }} axisLine={false} tickLine={false} tickFormatter={v => '$'+(v/1000).toFixed(0)+'k'} />
            <RechartsTip
              contentStyle={{ background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 8, fontSize: 11, fontFamily: UI }}
              formatter={v => [fmt(v)]}
            />
            <Legend wrapperStyle={{ fontSize: 10, fontFamily: UI }} />
            <Line type="monotone" dataKey="trad" name="If Taxed Later" stroke={RED} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="roth" name="Roth After-Tax" stroke={GREEN} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <InfoBox color={TEAL}>
          Best candidates for Roth conversion: low-income years, early retirement before RMDs, large deduction years. Never convert into a bracket higher than expected in retirement.
        </InfoBox>
      </MCard>

      {/* RMD Calculator */}
      <MCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Clock size={15} color={GOLD} />
          <div style={{ fontFamily: DISPLAY, fontSize: 16, fontWeight: 700, color: C.t1 }}>RMD Calculator</div>
        </div>
        <div style={{ fontFamily: UI, fontSize: 12, color: C.t3, lineHeight: 1.6, marginBottom: 12 }}>
          Required Minimum Distributions begin at age 73 (SECURE 2.0). Missing your RMD triggers a 25% penalty on the amount not withdrawn.
        </div>

        <FilingPills value={rmdFiling} onChange={setRmdFiling} />
        <Slider label="IRA / 401(k) Balance" val={rmdBalance} set={setRmdBalance} max={5000000} step={10000} />
        <Slider label="Other Annual Income" val={rmdOtherInc} set={setRmdOtherInc} max={200000} step={1000} />
        <Slider label="Your Age" val={rmdAge} set={setRmdAge} min={72} max={100} step={1} fmtFn={v => v + ' yrs'} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          <MiniStat label="RMD This Year"    value={fmt(rmdAmount)} color={GOLD}  />
          <MiniStat label="IRS Life Divisor" value={rmdDivisor}    color={TEAL} />
          <MiniStat label="Est. Tax on RMD"  value={fmt(taxOnRMD)} color={RED}  />
          <MiniStat label="Miss RMD Penalty" value={fmt(rmdPenalty)} color={RED} />
        </div>

        <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
          8-Year RMD Projection (5% annual growth)
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: UI, minWidth: 300 }}>
            <thead>
              <tr style={{ background: C.raise }}>
                {['Age','Balance','RMD','Divisor'].map((h, i) => (
                  <th key={h} style={{ padding: '6px 8px', textAlign: i === 0 ? 'left' : 'right', fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {futureRMDs.map((row, i) => (
                <tr key={row.age} style={{ background: i % 2 === 0 ? C.raise + '60' : 'transparent', borderBottom: `1px solid ${C.b1}` }}>
                  <td style={{ padding: '6px 8px', fontFamily: MONO, fontSize: 12, fontWeight: i === 0 ? 700 : 400, color: i === 0 ? GOLD : C.t2 }}>
                    {row.age}{i === 0 ? ' ←' : ''}
                  </td>
                  <td style={{ padding: '6px 8px', textAlign: 'right', fontFamily: MONO, fontSize: 11, color: C.t2 }}>{fmt(row.bal)}</td>
                  <td style={{ padding: '6px 8px', textAlign: 'right', fontFamily: MONO, fontSize: 11, fontWeight: 700, color: i === 0 ? RED : C.t2 }}>{fmt(row.rmd)}</td>
                  <td style={{ padding: '6px 8px', textAlign: 'right', fontSize: 11, color: C.t3 }}>{row.div}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, color: C.t1, marginBottom: 8 }}>RMD Reduction Strategies</div>
          {[
            { strategy: 'Roth Conversions Before 73', desc: 'Reduces your future taxable RMD balance permanently.', color: GREEN },
            { strategy: 'QCD (Age 70½+)', desc: 'Direct up to $105,000/yr from IRA to charity. Counts toward RMD but excluded from income.', color: TEAL },
            { strategy: 'Still Working Exception', desc: "Current employer's 401(k) may be RMD-exempt if still employed at 73+. IRAs are not exempt.", color: GOLD },
            { strategy: 'Aggregate Multiple IRAs', desc: 'Total RMD from multiple IRAs can come from any one account — no need to pull from each separately.', color: AMBER },
          ].map(({ strategy, desc, color }) => (
            <div key={strategy} style={{ display: 'flex', gap: 8, padding: '8px 0', borderBottom: `1px solid ${C.b1}` }}>
              <div style={{ width: 3, borderRadius: 2, background: color, flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1, marginBottom: 2 }}>{strategy}</div>
                <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </MCard>

      {/* Opportunity Zones */}
      <Accordion title="Qualified Opportunity Zones (QOZ)" accent={GREEN}>
        <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65, marginBottom: 10 }}>
          Invest capital gains into a Qualified Opportunity Fund within 180 days of the gain event. Benefits are tiered by hold period.
        </div>
        {[
          { hold: '&lt; 5 years', benefit: 'Defer original gain; limited benefit for most new investments', color: C.t3 },
          { hold: '5–9 years',   benefit: 'Defer gain until sale; no step-up for most new investments',   color: AMBER },
          { hold: '10+ years',   benefit: 'Eliminate all capital gains on the QOZ investment itself — gains above original deferred amount are tax-free', color: GREEN },
        ].map((row, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < 2 ? `1px solid ${C.b1}` : 'none' }}>
            <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: row.color, minWidth: 72 }}
              dangerouslySetInnerHTML={{ __html: row.hold }} />
            <span style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.55 }}>{row.benefit}</span>
          </div>
        ))}
      </Accordion>

      {/* Roth Conversion Ladder */}
      <Accordion title="Roth Conversion Ladder" accent={TEAL}>
        <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65, marginBottom: 10 }}>
          Convert just enough Traditional IRA/401(k) to Roth each year to fill up lower brackets without pushing into a higher one. Most powerful in low-income years between retirement and Social Security.
        </div>
        {[
          { label: 'Best window', value: 'Age 59½–72 (before RMDs force income)', color: TEAL },
          { label: 'Target', value: 'Fill up 12% or 22% bracket each year', color: TEAL },
          { label: 'Benefit', value: 'Reduce future RMDs and their tax drag', color: GREEN },
          { label: 'Roth 5-year rule', value: 'Each conversion has its own 5-year clock for penalty-free withdrawal of converted amounts', color: AMBER },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: C.raise, border: `1px solid ${C.b2}`, borderRadius: 8, padding: '8px 10px', marginBottom: 6 }}>
            <div style={{ fontFamily: UI, fontSize: 10, color: C.t3, marginBottom: 2 }}>{label}</div>
            <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 600, color }}>{value}</div>
          </div>
        ))}
        <InfoBox color={TEAL} icon={BookOpen}>
          The Roth conversion ladder is central to FIRE planning. Convert during low-income years pre-59½ and wait 5 years per conversion to access funds before traditional retirement age with minimal tax.
        </InfoBox>
      </Accordion>

      {/* Tax Calendar */}
      <MCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Clock size={15} color={GOLD} />
          <div style={{ fontFamily: DISPLAY, fontSize: 16, fontWeight: 700, color: C.t1 }}>Key Tax Deadlines</div>
        </div>
        {[
          { date: 'Jan 15',  event: 'Q4 estimated tax payment due' },
          { date: 'Jan 31',  event: 'W-2s and 1099s issued by employers / brokerages' },
          { date: 'Apr 15',  event: 'Tax filing deadline + Q1 estimated tax payment' },
          { date: 'Apr 15',  event: 'IRA / HSA contribution deadline for prior year' },
          { date: 'Jun 15',  event: 'Q2 estimated tax payment due' },
          { date: 'Sep 15',  event: 'Q3 estimated tax payment due' },
          { date: 'Oct 15',  event: 'Extended return deadline' },
          { date: 'Nov–Dec', event: 'Tax-loss harvesting window (before year end)' },
          { date: 'Dec 31',  event: 'RMD deadline; Roth conversion deadline; annual gift deadline' },
          { date: 'Dec 31',  event: '401(k)/403(b) employee contribution deadline' },
          { date: 'Dec 31',  event: 'QCD must be completed; FSA use-it-or-lose-it deadline' },
        ].map(({ date, event }, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < 10 ? `1px solid ${C.b1}` : 'none' }}>
            <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: TEAL, minWidth: 52, flexShrink: 0 }}>{date}</span>
            <span style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.5 }}>{event}</span>
          </div>
        ))}
      </MCard>

      <InfoBox color={AMBER} icon={AlertCircle}>
        For educational purposes only. Tax laws change frequently and individual situations vary. Always consult a CPA, CFP, or tax attorney before making tax-related financial decisions.
      </InfoBox>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────
const MAIN_TABS = [
  { key: 'calc',       label: 'Calculator' },
  { key: 'brackets',   label: 'Brackets'   },
  { key: 'strategies', label: 'Strategies' },
  { key: 'advanced',   label: 'Advanced'   },
]

export default function MTaxPlanning() {
  const [tab, setTab] = useState('calc')

  return (
    <div style={{ background: C.bg, minHeight: '100dvh' }}>
      <ScreenHeader title="Tax Planning" subtitle="2026 Tax Year" accent={C.gold} />

      {/* Main tab bar */}
      <div style={{
        display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none',
        background: C.surf, borderBottom: `1px solid ${C.b1}`,
        paddingLeft: 16, paddingRight: 16,
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        {MAIN_TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              padding: '12px 14px', background: 'none', border: 'none',
              borderBottom: `2.5px solid ${tab === key ? GOLD : 'transparent'}`,
              color: tab === key ? GOLD : C.t3,
              fontFamily: UI, fontSize: 12, fontWeight: tab === key ? 700 : 500,
              cursor: 'pointer', whiteSpace: 'nowrap',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px 88px' }}>
        {tab === 'calc'       && <TabCalculator />}
        {tab === 'brackets'   && <TabBrackets />}
        {tab === 'strategies' && <TabStrategies />}
        {tab === 'advanced'   && <TabAdvanced />}
      </div>
    </div>
  )
}
