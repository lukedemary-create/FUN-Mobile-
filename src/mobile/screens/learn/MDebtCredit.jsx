import { useState, useMemo } from 'react'
import { CheckCircle2, AlertCircle, Info, Plus, Trash2, ArrowRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'

const fmt = n => '$' + Math.round(Math.abs(n || 0)).toLocaleString()

/* ─── FICO Score Section ──────────────────────────────────────── */
const SCORE_RANGES = [
  { range: '300–579', label: 'Poor',      color: '#ef4444' },
  { range: '580–669', label: 'Fair',      color: '#f59e0b' },
  { range: '670–739', label: 'Good',      color: '#5BC8E2' },
  { range: '740–799', label: 'Very Good', color: C.teal },
  { range: '800–850', label: 'Excellent', color: '#22c55e' },
]

const FICO_FACTORS = [
  {
    label: 'Payment History', pct: 35, color: C.teal,
    desc: 'Whether you pay on time is the single biggest factor. Even one 30-day late payment can drop your score by 50–100 points. Set up autopay for at least the minimum on every account.',
    tip: 'A single missed payment can stay on your report for 7 years. Set autopay for minimums immediately.',
  },
  {
    label: 'Amounts Owed (Utilization)', pct: 30, color: '#3b82f6',
    desc: 'Your credit utilization ratio — how much of your available credit you\'re using. Keep it below 30% for a good score, below 10% for an excellent score. This includes per-card ratios too.',
    tip: 'Paying down balances before the statement closing date (not just the due date) lowers reported utilization.',
  },
  {
    label: 'Length of Credit History', pct: 15, color: '#8b5cf6',
    desc: 'Longer history = higher score. FICO considers age of oldest account, newest account, and average age of all accounts. Avoid closing old cards — even unused ones.',
    tip: 'Keep your oldest credit card open even if you rarely use it. Use it for one small purchase per year.',
  },
  {
    label: 'Credit Mix', pct: 10, color: '#f59e0b',
    desc: 'Having both revolving credit (cards) and installment loans (mortgage, auto, student) shows you can manage different types of debt responsibly.',
    tip: 'Don\'t open new accounts just to diversify. The benefit is small and new accounts lower your average age.',
  },
  {
    label: 'New Credit (Inquiries)', pct: 10, color: '#ef4444',
    desc: 'Applying for new credit triggers a hard inquiry, which can lower your score by 5–10 points temporarily. Multiple mortgage/auto inquiries within 14–45 days count as one.',
    tip: 'Rate-shopping for mortgages or car loans within a short window is treated as a single inquiry.',
  },
]

function CreditScoreSection() {
  const [open, setOpen] = useState(null)

  return (
    <div style={{ paddingBottom: 8 }}>
      <div style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.65, padding: '12px 16px 8px' }}>
        Your <strong style={{ color: C.t1 }}>FICO® Score</strong> is calculated from five factors. Each carries a different weight — knowing this lets you prioritize what to improve.
      </div>

      {/* Score range bar */}
      <div style={{ padding: '0 16px', marginBottom: 12 }}>
        <div style={{ display: 'flex', height: 10, borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
          {SCORE_RANGES.map(s => <div key={s.label} style={{ flex: 1, background: s.color }} />)}
        </div>
        <div style={{ display: 'flex' }}>
          {SCORE_RANGES.map(s => (
            <div key={s.label} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontFamily: UI, fontSize: 9, fontWeight: 700, color: s.color }}>{s.label}</div>
              <div style={{ fontFamily: MONO, fontSize: 8, color: C.t3 }}>{s.range}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Factor cards */}
      <div style={{ padding: '0 16px' }}>
        <MCard>
          {FICO_FACTORS.map((f, i) => (
            <div key={i} style={{ marginBottom: i < FICO_FACTORS.length - 1 ? 14 : 0 }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontFamily: UI, fontSize: 12, fontWeight: 600, color: C.t1 }}>{f.label}</span>
                  <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: f.color }}>{f.pct}%</span>
                </div>
                <div style={{ background: C.b1, borderRadius: 4, height: 6, marginBottom: 5 }}>
                  <div style={{ background: f.color, borderRadius: 4, height: 6, width: `${f.pct}%` }} />
                </div>
              </button>
              {open === i && (
                <div style={{ padding: '8px 10px', background: `${f.color}08`, border: `1px solid ${f.color}20`, borderRadius: 9 }}>
                  <div style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.65, marginBottom: 6 }}>{f.desc}</div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                    <CheckCircle2 size={11} color={f.color} style={{ flexShrink: 0, marginTop: 2 }} />
                    <div style={{ fontFamily: UI, fontSize: 10, color: C.t3, lineHeight: 1.6 }}><strong>Pro tip:</strong> {f.tip}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </MCard>
        <div style={{ marginTop: 10, padding: '8px 10px', background: `${C.teal}0d`, border: `1px solid ${C.tealBdr}`, borderRadius: 8 }}>
          <div style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.6 }}>Tap any factor above to expand details. Focus on Payment History and Utilization first — together they're <strong style={{ color: C.teal }}>65% of your score</strong>.</div>
        </div>
      </div>
    </div>
  )
}

/* ─── Avalanche vs Snowball ───────────────────────────────────── */
const EXAMPLE_DEBTS = [
  { name: 'Credit Card A', balance: 2000, rate: 24 },
  { name: 'Credit Card B', balance: 5000, rate: 18 },
  { name: 'Student Loan',  balance: 1500, rate: 6  },
]

function AvalancheVsSnowball() {
  const snowball  = [...EXAMPLE_DEBTS].sort((a, b) => a.balance - b.balance)
  const avalanche = [...EXAMPLE_DEBTS].sort((a, b) => b.rate - a.rate)

  return (
    <div style={{ paddingBottom: 8 }}>
      <div style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.65, padding: '12px 16px 8px' }}>
        Both strategies use the same total monthly payment — the difference is <em>which debt you attack first</em>. Both pay minimums on everything; the extra goes to the target.
      </div>

      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        {[
          { method: 'Debt Snowball', badge: 'Motivation-first', tagline: 'Target lowest balance first.', order: snowball, color: '#8b5cf6', pro: 'Psychological momentum — debts disappear faster', con: 'Pays more in total interest' },
          { method: 'Debt Avalanche', badge: 'Math-optimal', tagline: 'Target highest rate first.', order: avalanche, color: C.teal, pro: 'Minimizes total interest paid', con: 'Can feel slow if high-rate debt is large' },
        ].map(m => (
          <div key={m.method} style={{ border: `1.5px solid ${m.color}30`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '10px 12px', background: `${m.color}0c`, borderBottom: `1px solid ${m.color}20` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <span style={{ fontFamily: DISPLAY, fontSize: 13, fontWeight: 700, color: C.t1 }}>{m.method}</span>
                <span style={{ background: `${m.color}18`, border: `1px solid ${m.color}35`, borderRadius: 99, padding: '1px 6px', fontFamily: UI, fontSize: 8, fontWeight: 700, color: m.color }}>{m.badge}</span>
              </div>
              <div style={{ fontFamily: UI, fontSize: 10, color: C.t3 }}>{m.tagline}</div>
            </div>
            <div style={{ padding: '10px 12px' }}>
              <div style={{ fontFamily: UI, fontSize: 9, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Payment Order</div>
              {m.order.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 800, color: '#1a1410' }}>{i + 1}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 600, color: C.t1 }}>{d.name}</div>
                    <div style={{ fontFamily: MONO, fontSize: 9, color: C.t3 }}>${d.balance.toLocaleString()} @ {d.rate}%</div>
                  </div>
                  {i === 0 && <span style={{ fontFamily: UI, fontSize: 8, fontWeight: 700, color: m.color, background: `${m.color}15`, padding: '1px 5px', borderRadius: 99 }}>Target</span>}
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${C.b1}`, marginTop: 6, paddingTop: 6 }}>
                <div style={{ display: 'flex', gap: 5, alignItems: 'flex-start', marginBottom: 4 }}>
                  <CheckCircle2 size={10} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontFamily: UI, fontSize: 10, color: C.t2, lineHeight: 1.5 }}>{m.pro}</span>
                </div>
                <div style={{ display: 'flex', gap: 5, alignItems: 'flex-start' }}>
                  <AlertCircle size={10} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontFamily: UI, fontSize: 10, color: C.t2, lineHeight: 1.5 }}>{m.con}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '0 16px' }}>
        <div style={{ background: `${C.teal}0d`, border: `1px solid ${C.tealBdr}`, borderRadius: 10, padding: '10px 12px' }}>
          <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65 }}>
            <strong style={{ color: C.t1 }}>Bottom line:</strong> Avalanche saves more money. Snowball provides faster motivation. Research shows people who use snowball are more likely to stick with their plan. Pick the method you'll actually follow through on.
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Student Loans ───────────────────────────────────────────── */
function StudentLoans() {
  const [sub, setSub] = useState('types')

  return (
    <div style={{ paddingBottom: 8 }}>
      <div style={{ display: 'flex', gap: 6, padding: '10px 16px 0', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {[['types', 'Federal vs Private'], ['idr', 'Income-Driven'], ['pslf', 'PSLF']].map(([k, l]) => (
          <button key={k} onClick={() => setSub(k)} style={{
            padding: '6px 12px', borderRadius: 99, whiteSpace: 'nowrap', flexShrink: 0,
            border: `1px solid ${sub === k ? C.teal : C.b2}`,
            background: sub === k ? `${C.teal}18` : C.raise,
            color: sub === k ? C.teal : C.t3,
            fontFamily: UI, fontSize: 11, fontWeight: sub === k ? 700 : 500, cursor: 'pointer',
          }}>{l}</button>
        ))}
      </div>

      {sub === 'types' && (
        <div style={{ padding: '12px 16px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            {[
              {
                title: 'Federal Loans', color: C.teal,
                points: ['Fixed rates set by Congress', 'Income-driven repayment plans available', 'Access to PSLF and forgiveness programs', 'Deferment and forbearance options', 'No credit check for most loans', 'Discharge options in hardship cases'],
              },
              {
                title: 'Private Loans', color: '#ef4444',
                points: ['Variable or fixed rates based on credit', 'No income-driven repayment options', 'No access to federal forgiveness programs', 'Limited hardship relief', 'Credit check required; may need cosigner', 'Refinancing can lower rates but loses federal benefits'],
              },
            ].map(s => (
              <div key={s.title} style={{ border: `1.5px solid ${s.color}25`, borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '8px 10px', background: `${s.color}0c`, borderBottom: `1px solid ${s.color}18` }}>
                  <span style={{ fontFamily: DISPLAY, fontSize: 13, fontWeight: 700, color: C.t1 }}>{s.title}</span>
                </div>
                <div style={{ padding: '8px 10px' }}>
                  {s.points.map((p, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 5 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: s.color, flexShrink: 0, marginTop: 5 }} />
                      <span style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, padding: '8px 10px' }}>
            <div style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.6 }}>Never refinance federal loans into private loans unless you're certain you won't need IDR, PSLF, or any federal protections. You can't convert them back.</div>
          </div>
        </div>
      )}

      {sub === 'idr' && (
        <div style={{ padding: '12px 16px 0' }}>
          <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65, marginBottom: 12 }}>
            Income-Driven Repayment plans cap your monthly payment as a percentage of discretionary income and forgive remaining balances after 20–25 years.
          </div>
          {[
            { name: 'SAVE (Saving on a Valuable Education)', pct: '5–10%', forgive: '20–25 years', note: 'Newest plan. Unpaid interest doesn\'t capitalize. Best for most borrowers.' },
            { name: 'PAYE (Pay As You Earn)', pct: '10%', forgive: '20 years', note: 'Must be a new borrower after Oct 2007 and have received disbursement after Oct 2011.' },
            { name: 'IBR (Income-Based Repayment)', pct: '10–15%', forgive: '20–25 years', note: '10% if new borrower, 15% if older loans. Available to almost all federal borrowers.' },
            { name: 'ICR (Income-Contingent Repayment)', pct: '20%', forgive: '25 years', note: 'The original IDR plan. Less favorable but available for Parent PLUS loans after consolidation.' },
          ].map((p, i) => (
            <div key={i} style={{ padding: '10px 12px', background: C.raise, border: `1px solid ${C.b1}`, borderRadius: 10, marginBottom: 8 }}>
              <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1, marginBottom: 6 }}>{p.name}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '3px 10px', fontFamily: UI, fontSize: 11, marginBottom: 5 }}>
                <span style={{ color: C.t3 }}>Payment cap</span><span style={{ fontWeight: 600, color: C.teal }}>{p.pct} of discretionary income</span>
                <span style={{ color: C.t3 }}>Forgiveness</span><span style={{ fontWeight: 600, color: C.t1 }}>{p.forgive}</span>
              </div>
              <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, lineHeight: 1.55 }}>{p.note}</div>
            </div>
          ))}
          <div style={{ background: `${C.teal}0d`, border: `1px solid ${C.tealBdr}`, borderRadius: 8, padding: '8px 10px' }}>
            <div style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.6 }}>Forgiveness under IDR plans (other than PSLF) is currently taxable as income. You may owe a large tax bill in the forgiveness year — plan ahead.</div>
          </div>
        </div>
      )}

      {sub === 'pslf' && (
        <div style={{ padding: '12px 16px 0' }}>
          <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65, marginBottom: 12 }}>
            <strong style={{ color: C.t1 }}>Public Service Loan Forgiveness (PSLF)</strong> forgives remaining federal loan balances after 10 years (120 payments) of qualifying employment. Unlike IDR forgiveness, PSLF is <strong style={{ color: '#22c55e' }}>tax-free</strong>.
          </div>
          {[
            { title: 'Qualifying Employer', detail: 'Government (federal, state, local), 501(c)(3) nonprofits, and some other public service organizations.' },
            { title: 'Qualifying Loans', detail: 'Direct Loans only. FFEL or Perkins loans must be consolidated into a Direct Consolidation Loan first.' },
            { title: 'Qualifying Repayment Plan', detail: 'Must be on an income-driven repayment plan or the 10-year Standard Repayment Plan.' },
            { title: '120 Qualifying Payments', detail: 'Must make 120 on-time, full monthly payments. Payments don\'t need to be consecutive.' },
            { title: 'Employment Certification', detail: 'Submit the Employment Certification Form (ECF) annually — don\'t wait until 120 payments to submit.' },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 10px', background: `${C.teal}05`, borderRadius: 9, border: `1px solid ${C.tealBdr}`, marginBottom: 8 }}>
              <CheckCircle2 size={13} color={C.teal} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1, marginBottom: 2 }}>{r.title}</div>
                <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, lineHeight: 1.55 }}>{r.detail}</div>
              </div>
            </div>
          ))}
          <div style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, padding: '8px 10px' }}>
            <div style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.6 }}>PSLF is one of the most powerful financial tools available to public servants. A doctor, teacher, or social worker with $200,000 in debt can have it entirely forgiven tax-free after 10 years of qualifying payments.</div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Debt Payoff Calculator ──────────────────────────────────── */
function runPayoff(debts, extraMonthly, method) {
  if (!debts.length || debts.every(d => d.balance <= 0)) return { months: 0, totalInterest: 0 }
  const totalMin = debts.reduce((s, d) => s + d.minPayment, 0)
  const monthlyBudget = totalMin + extraMonthly
  let rem = debts.map(d => ({ ...d }))
  let month = 0, totalInterest = 0
  while (rem.some(d => d.balance > 0.01) && month < 600) {
    month++
    rem.forEach(d => {
      if (d.balance > 0.01) { const int = d.balance * (d.rate / 100 / 12); d.balance += int; totalInterest += int }
    })
    let leftover = monthlyBudget
    rem.forEach(d => {
      if (d.balance > 0.01) {
        const pay = Math.min(d.minPayment, d.balance)
        d.balance -= pay; leftover -= pay
        if (d.balance < 0.01) d.balance = 0
      }
    })
    const active = rem.filter(d => d.balance > 0.01)
    if (active.length && leftover > 0) {
      const target = method === 'avalanche'
        ? active.slice().sort((a, b) => b.rate - a.rate)[0]
        : active.slice().sort((a, b) => a.balance - b.balance)[0]
      const extra = Math.min(leftover, target.balance)
      target.balance -= extra
      if (target.balance < 0.01) target.balance = 0
    }
  }
  return { months: month, totalInterest: Math.round(totalInterest) }
}

const DEFAULT_DEBTS = [
  { id: 1, name: 'Credit Card A', balance: 3500,  rate: 24.99, minPayment: 70  },
  { id: 2, name: 'Student Loan',  balance: 12000, rate: 6.5,   minPayment: 130 },
  { id: 3, name: 'Car Loan',      balance: 8000,  rate: 7.9,   minPayment: 180 },
]

let nextId = 10

function DebtPayoffCalc() {
  const [debts, setDebts] = useState(DEFAULT_DEBTS)
  const [extra, setExtra] = useState(100)

  const addDebt   = () => setDebts(prev => [...prev, { id: nextId++, name: `Debt ${prev.length + 1}`, balance: 1000, rate: 10, minPayment: 25 }])
  const removeDebt = id => setDebts(prev => prev.filter(d => d.id !== id))
  const updateDebt = (id, field, val) => setDebts(prev => prev.map(d => d.id === id ? { ...d, [field]: val } : d))

  const snowball  = useMemo(() => runPayoff(debts, extra, 'snowball'),  [debts, extra])
  const avalanche = useMemo(() => runPayoff(debts, extra, 'avalanche'), [debts, extra])
  const saved     = snowball.totalInterest - avalanche.totalInterest
  const monthSaved = snowball.months - avalanche.months

  const chartData = [
    { name: 'Snowball',  interest: snowball.totalInterest },
    { name: 'Avalanche', interest: avalanche.totalInterest },
  ]

  const inStyle = {
    width: '100%', padding: '6px 6px 6px 18px', border: `1.5px solid ${C.b2}`,
    borderRadius: 8, fontSize: 12, color: C.t1, fontFamily: UI, background: C.raise, boxSizing: 'border-box',
  }

  return (
    <div style={{ padding: '0 16px', paddingBottom: 16 }}>
      <MCard>
        <div style={{ fontFamily: DISPLAY, fontSize: 15, fontWeight: 700, color: C.t1, marginBottom: 4 }}>Debt Payoff Calculator</div>
        <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.5, marginBottom: 14 }}>Enter your debts below and see exactly how Avalanche vs Snowball compare for your situation.</div>

        {/* Debt list */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, color: C.t1, marginBottom: 8 }}>Your Debts</div>
          {debts.map(d => (
            <div key={d.id} style={{ marginBottom: 8 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 4 }}>
                <div>
                  <div style={{ fontFamily: UI, fontSize: 9, color: C.t3, fontWeight: 600, marginBottom: 2 }}>Balance</div>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 7, top: '50%', transform: 'translateY(-50%)', color: C.t3, fontSize: 11 }}>$</span>
                    <input type="number" min={0} value={d.balance} onChange={e => updateDebt(d.id, 'balance', Number(e.target.value))} style={inStyle} />
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: UI, fontSize: 9, color: C.t3, fontWeight: 600, marginBottom: 2 }}>APR %</div>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 7, top: '50%', transform: 'translateY(-50%)', color: C.t3, fontSize: 11 }}>%</span>
                    <input type="number" min={0} step={0.1} value={d.rate} onChange={e => updateDebt(d.id, 'rate', Number(e.target.value))} style={{ ...inStyle, paddingLeft: 18 }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: UI, fontSize: 9, color: C.t3, fontWeight: 600, marginBottom: 2 }}>Min. Payment</div>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 7, top: '50%', transform: 'translateY(-50%)', color: C.t3, fontSize: 11 }}>$</span>
                    <input type="number" min={0} value={d.minPayment} onChange={e => updateDebt(d.id, 'minPayment', Number(e.target.value))} style={inStyle} />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input value={d.name} onChange={e => updateDebt(d.id, 'name', e.target.value)} style={{ flex: 1, padding: '5px 8px', border: `1.5px solid ${C.b2}`, borderRadius: 7, fontSize: 11, color: C.t1, fontFamily: UI, background: C.raise }} />
                <button onClick={() => removeDebt(d.id)} disabled={debts.length <= 1} style={{ width: 28, height: 28, border: `1px solid ${C.b2}`, borderRadius: 7, background: C.raise, cursor: debts.length > 1 ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Trash2 size={12} color={debts.length > 1 ? '#ef4444' : C.t3} />
                </button>
              </div>
            </div>
          ))}
          {debts.length < 8 && (
            <button onClick={addDebt} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'none', border: `1.5px dashed ${C.teal}50`, borderRadius: 9, cursor: 'pointer', fontFamily: UI, fontSize: 11, color: C.teal, fontWeight: 600 }}>
              <Plus size={12} /> Add debt
            </button>
          )}
        </div>

        {/* Extra payment */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontFamily: UI, fontSize: 12, color: C.t2, fontWeight: 600 }}>Extra Monthly Payment (above minimums)</span>
            <span style={{ fontFamily: MONO, fontSize: 13, color: C.gold, fontWeight: 700 }}>${extra}/mo</span>
          </div>
          <input type="range" min={0} max={500} step={25} value={extra} onChange={e => setExtra(+e.target.value)} style={{ width: '100%', accentColor: C.gold }} />
        </div>

        {/* Results */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          {[
            { label: 'Snowball', data: snowball, color: '#8b5cf6', sub: 'Lowest balance first' },
            { label: 'Avalanche', data: avalanche, color: C.teal, sub: 'Highest rate first' },
          ].map(m => (
            <div key={m.label} style={{ background: C.surf, border: `1.5px solid ${m.color}25`, borderRadius: 12, padding: '12px' }}>
              <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: m.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{m.label}</div>
              <div style={{ fontFamily: UI, fontSize: 10, color: C.t3, marginBottom: 8 }}>{m.sub}</div>
              <div style={{ marginBottom: 6 }}>
                <div style={{ fontFamily: UI, fontSize: 9, color: C.t3 }}>Payoff time</div>
                <div style={{ fontFamily: DISPLAY, fontSize: 16, fontWeight: 700, color: C.t1 }}>{m.data.months} mo</div>
                <div style={{ fontFamily: UI, fontSize: 9, color: C.t3 }}>({(m.data.months / 12).toFixed(1)} yrs)</div>
              </div>
              <div>
                <div style={{ fontFamily: UI, fontSize: 9, color: C.t3 }}>Total interest</div>
                <div style={{ fontFamily: DISPLAY, fontSize: 16, fontWeight: 700, color: m.color }}>{fmt(m.data.totalInterest)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{ height: 140, marginBottom: 12 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={48}>
              <XAxis dataKey="name" tick={{ fontFamily: UI, fontSize: 11, fill: C.t3 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={v => [`$${Math.round(v).toLocaleString()}`, 'Total Interest']} contentStyle={{ background: C.raise, border: `1px solid ${C.b2}`, borderRadius: 8, fontFamily: UI, fontSize: 11 }} />
              <Bar dataKey="interest" radius={[6, 6, 0, 0]}>
                <Cell fill="#8b5cf6" />
                <Cell fill={C.teal} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {saved > 0 && (
          <div style={{ padding: '10px 12px', background: `${C.teal}09`, border: `1px solid ${C.tealBdr}`, borderRadius: 10, display: 'flex', gap: 16, justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 18, fontWeight: 700, color: C.teal }}>{fmt(saved)}</div>
              <div style={{ fontFamily: UI, fontSize: 10, color: C.t3 }}>saved using Avalanche</div>
            </div>
            {monthSaved > 0 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: DISPLAY, fontSize: 18, fontWeight: 700, color: C.t1 }}>{monthSaved} mo</div>
                <div style={{ fontFamily: UI, fontSize: 10, color: C.t3 }}>faster debt-free</div>
              </div>
            )}
          </div>
        )}
      </MCard>
    </div>
  )
}

/* ─── Credit Card Calculator ──────────────────────────────────── */
function CreditCardCalc() {
  const [balance, setBalance] = useState(3000)
  const [apr,     setApr]     = useState(24.99)
  const [payment, setPayment] = useState(100)

  const monthlyRate = apr / 100 / 12
  const minPay = Math.max(balance * 0.02, 25)

  function calcPayoff(bal, rate, pay) {
    if (pay <= bal * rate) return { months: Infinity, interest: Infinity }
    let b = bal, interest = 0, months = 0
    while (b > 0.01 && months < 600) {
      const int = b * rate; b += int; interest += int; b -= Math.min(pay, b); months++
    }
    return { months, interest: Math.round(interest) }
  }

  const withPayment = calcPayoff(balance, monthlyRate, payment)
  const withMin     = calcPayoff(balance, monthlyRate, minPay)
  const payable     = withPayment.months < 600
  const interestSaved = payable && withMin.months < 600 ? withMin.interest - withPayment.interest : null

  return (
    <div style={{ padding: '0 16px', paddingBottom: 16 }}>
      <MCard>
        <div style={{ fontFamily: DISPLAY, fontSize: 15, fontWeight: 700, color: C.t1, marginBottom: 4 }}>Credit Card Interest Calculator</div>
        <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.5, marginBottom: 14 }}>See how much interest you're really paying — and how much you save by paying more than the minimum.</div>

        {[
          { l: 'Balance', v: balance, set: setBalance, min: 0, max: 50000, step: 100, d: fmt(balance) },
          { l: 'APR (%)', v: apr, set: setApr, min: 1, max: 40, step: 0.1, d: `${apr}%` },
          { l: `Monthly Payment (min ≈ ${fmt(minPay)}/mo)`, v: payment, set: setPayment, min: Math.ceil(minPay), max: Math.max(balance, payment * 2), step: 5, d: `${fmt(payment)}/mo` },
        ].map(({ l, v, set: sv, min, max, step, d }) => (
          <div key={l} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontFamily: UI, fontSize: 12, color: C.t2, fontWeight: 600 }}>{l}</span>
              <span style={{ fontFamily: MONO, fontSize: 13, color: C.gold, fontWeight: 700 }}>{d}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={v} onChange={e => sv(+e.target.value)} style={{ width: '100%', accentColor: C.gold }} />
          </div>
        ))}

        {!payable ? (
          <div style={{ display: 'flex', gap: 8, background: 'rgba(192,57,43,0.09)', border: '1px solid rgba(192,57,43,0.25)', borderRadius: 10, padding: '10px 12px' }}>
            <AlertCircle size={14} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
            <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.6 }}>
              At {fmt(payment)}/month, you'll <strong style={{ color: '#ef4444' }}>never pay off this balance</strong> — the interest exceeds your payment. Increase to at least {fmt(Math.ceil(balance * monthlyRate) + 1)}/mo.
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
              {[
                ['Months to Payoff', withPayment.months, C.teal],
                ['Total Interest', fmt(withPayment.interest), '#ef4444'],
                ['Total Paid', fmt(balance + withPayment.interest), C.t1],
              ].map(([l, v, c]) => (
                <div key={l} style={{ textAlign: 'center', padding: '10px 6px', background: `${c}09`, border: `1px solid ${c}25`, borderRadius: 10 }}>
                  <div style={{ fontFamily: DISPLAY, fontSize: 15, fontWeight: 700, color: c }}>{v}</div>
                  <div style={{ fontFamily: UI, fontSize: 9, color: C.t3 }}>{l}</div>
                </div>
              ))}
            </div>

            {interestSaved !== null && interestSaved > 0 && (
              <div style={{ display: 'flex', gap: 8, padding: '8px 10px', background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 9 }}>
                <CheckCircle2 size={13} color="#22c55e" style={{ flexShrink: 0, marginTop: 1 }} />
                <div style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.6 }}>
                  By paying <strong>{fmt(payment)}/mo</strong> instead of the minimum (<strong>{fmt(minPay)}/mo</strong>), you save <strong style={{ color: '#22c55e' }}>{fmt(interestSaved)}</strong> in interest and pay off the card <strong>{withMin.months - withPayment.months} months</strong> sooner.
                </div>
              </div>
            )}
          </>
        )}
      </MCard>
    </div>
  )
}

/* ─── Resources ───────────────────────────────────────────────── */
const RESOURCES = [
  { name: 'Credit Karma', badge: 'Best free monitoring', badgeColor: '#22c55e', desc: 'Free credit scores (VantageScore from TransUnion and Equifax), credit report monitoring, and personalized recommendations. Good for tracking trends — not a FICO score.', best: 'Anyone who wants ongoing credit monitoring at no cost', cost: 'Free' },
  { name: 'Experian', badge: 'Best for FICO scores', badgeColor: C.teal, desc: 'One of the three major bureaus. Free Experian account gives you your actual FICO® Score 8, plus one free credit report. Experian Boost lets you add utilities to improve your score.', best: 'People who want their real FICO score and report', cost: 'Free (basic) / $24.99/mo premium' },
  { name: 'NFCC (National Foundation for Credit Counseling)', badge: 'Best for debt help', badgeColor: '#8b5cf6', desc: 'Non-profit network of accredited credit counselors. Offers Debt Management Plans (DMPs) that can reduce interest rates and consolidate payments. Free or low-cost counseling.', best: 'Anyone struggling with significant debt who needs a structured plan', cost: 'Free counseling / DMP fees ~$25–50/mo' },
  { name: 'NerdWallet', badge: 'Best for research', badgeColor: '#f59e0b', desc: 'Comprehensive comparison tool for credit cards, loans, and financial products. Free credit score monitoring, card recommendations, and deep editorial content on debt strategies.', best: 'Comparison shopping for credit cards or loans', cost: 'Free' },
]

function ResourcesSection() {
  return (
    <div style={{ paddingBottom: 8 }}>
      <div style={{ margin: '12px 16px 0', padding: '10px 12px', background: `${C.teal}0d`, border: `1px solid ${C.tealBdr}`, borderRadius: 10 }}>
        <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65 }}>
          <strong style={{ color: C.t1 }}>Free tip:</strong> You're entitled to one free credit report from each bureau per year at <strong style={{ color: C.teal }}>AnnualCreditReport.com</strong> — the only federally mandated free report site. Review all three (Equifax, Experian, TransUnion) for errors.
        </div>
      </div>

      <MSectionHeader label="Credit & Debt Tools" />
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {RESOURCES.map(r => (
          <div key={r.name} style={{ background: C.surf, border: `1px solid ${C.b1}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '10px 14px', borderBottom: `1px solid ${C.b1}`, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: DISPLAY, fontSize: 14, fontWeight: 700, color: C.t1 }}>{r.name}</span>
              <span style={{ background: `${r.badgeColor}15`, border: `1px solid ${r.badgeColor}35`, borderRadius: 99, padding: '2px 7px', fontFamily: UI, fontSize: 9, fontWeight: 700, color: r.badgeColor }}>{r.badge}</span>
            </div>
            <div style={{ padding: '10px 14px' }}>
              <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65, marginBottom: 8 }}>{r.desc}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '3px 10px', fontFamily: UI, fontSize: 11 }}>
                <span style={{ color: C.t3, fontWeight: 600 }}>Best for</span><span style={{ color: C.t2 }}>{r.best}</span>
                <span style={{ color: C.t3, fontWeight: 600 }}>Cost</span><span style={{ color: C.t2 }}>{r.cost}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Main Component ──────────────────────────────────────────── */
export default function MDebtCredit() {
  const [tab,      setTab]      = useState('learn')
  const [learnSub, setLearnSub] = useState('fico')
  const [calcSub,  setCalcSub]  = useState('payoff')

  return (
    <div style={{ background: C.bg, minHeight: '100dvh', paddingBottom: 80 }}>
      <ScreenHeader title="Debt & Credit" subtitle="Learn" accent={C.gold} />

      {/* Main tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${C.b2}`, padding: '0 16px' }}>
        {[['learn', 'Learn'], ['calculate', 'Calculate'], ['resources', 'Resources']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            flex: 1, padding: '11px 0', background: 'none', border: 'none', cursor: 'pointer',
            borderBottom: `2px solid ${tab === k ? C.gold : 'transparent'}`,
            color: tab === k ? C.gold : C.t3,
            fontFamily: UI, fontSize: 12, fontWeight: 600,
          }}>{l}</button>
        ))}
      </div>

      {/* Learn sub-tabs */}
      {tab === 'learn' && (
        <>
          <div style={{ display: 'flex', gap: 6, padding: '10px 16px 0', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {[['fico', 'FICO Score'], ['methods', 'Payoff Methods'], ['student', 'Student Loans']].map(([k, l]) => (
              <button key={k} onClick={() => setLearnSub(k)} style={{
                padding: '6px 12px', borderRadius: 99, whiteSpace: 'nowrap', flexShrink: 0,
                border: `1px solid ${learnSub === k ? C.gold : C.b2}`,
                background: learnSub === k ? `${C.gold}18` : C.raise,
                color: learnSub === k ? C.gold : C.t3,
                fontFamily: UI, fontSize: 11, fontWeight: learnSub === k ? 700 : 500, cursor: 'pointer',
              }}>{l}</button>
            ))}
          </div>
          {learnSub === 'fico'    && <CreditScoreSection />}
          {learnSub === 'methods' && <AvalancheVsSnowball />}
          {learnSub === 'student' && <StudentLoans />}
        </>
      )}

      {/* Calculate sub-tabs */}
      {tab === 'calculate' && (
        <>
          <div style={{ display: 'flex', gap: 6, padding: '10px 16px 0' }}>
            {[['payoff', 'Debt Payoff'], ['cc', 'Credit Card']].map(([k, l]) => (
              <button key={k} onClick={() => setCalcSub(k)} style={{
                padding: '6px 14px', borderRadius: 99, whiteSpace: 'nowrap',
                border: `1px solid ${calcSub === k ? C.gold : C.b2}`,
                background: calcSub === k ? `${C.gold}18` : C.raise,
                color: calcSub === k ? C.gold : C.t3,
                fontFamily: UI, fontSize: 11, fontWeight: calcSub === k ? 700 : 500, cursor: 'pointer',
              }}>{l}</button>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            {calcSub === 'payoff' && <DebtPayoffCalc />}
            {calcSub === 'cc'     && <CreditCardCalc />}
          </div>
        </>
      )}

      {tab === 'resources' && <ResourcesSection />}
    </div>
  )
}
