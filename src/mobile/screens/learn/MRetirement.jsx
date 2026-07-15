import { useState, useMemo } from 'react'
import {
  CheckCircle2, XCircle, AlertCircle, ArrowRight,
  Users, DollarSign, ExternalLink,
} from 'lucide-react'
import {
  AreaChart, Area, CartesianGrid, XAxis, YAxis,
  Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'

const fmt  = n => '$' + Math.round(Math.abs(n || 0)).toLocaleString()
const fmtK = n => {
  const a = Math.abs(n || 0)
  if (a >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M'
  if (a >= 1_000)     return '$' + (n / 1_000).toFixed(1) + 'K'
  return '$' + Math.round(n || 0).toLocaleString()
}

/* ─── Account Types ───────────────────────────────────────────── */
const ACCOUNTS = [
  {
    key: '401k', label: '401(k) / 403(b)', badge: 'Employer plan', color: C.teal,
    limit: '$24,500 ($32,500 if 50+; ages 60–63: $35,750)',
    tax: 'Pre-tax (Traditional) or After-tax (Roth)',
    match: true,
    pros: ['Highest contribution limits', 'Employer match is free money — always capture it first', 'Automatic payroll deduction', '403(b) for nonprofits, 457 for government workers'],
    cons: ['Limited to plan investment options', 'RMDs required at age 73', '10% early withdrawal penalty before 59½'],
    best: 'Your first stop. Max the employer match before anything else.',
  },
  {
    key: 'tira', label: 'Traditional IRA', badge: 'Individual account', color: '#8b5cf6',
    limit: '$7,500 ($8,600 if 50+)',
    tax: 'Pre-tax (may be deductible)',
    match: false,
    pros: ['Open at any brokerage — full investment control', 'Tax-deductible if income limits met', 'Wider investment selection than 401(k)', 'Rollover destination for old 401(k)s'],
    cons: ['Lower limit than 401(k)', 'Deductibility phases out at higher incomes', 'RMDs required at age 73', '10% early withdrawal penalty before 59½'],
    best: 'Good secondary account after capturing employer match. Ideal for rollovers.',
  },
  {
    key: 'rira', label: 'Roth IRA', badge: 'Best for most', color: '#22c55e',
    limit: '$7,500 ($8,600 if 50+)',
    tax: 'After-tax — tax-free growth & withdrawals',
    match: false,
    pros: ['Tax-free growth and tax-free withdrawals', 'No RMDs — money grows indefinitely', 'Contributions (not earnings) withdrawable anytime penalty-free', 'Most flexible retirement account'],
    cons: ['Income limits: phases out $153K–$168K (single)', 'No upfront tax deduction', 'Lower limit than 401(k)', 'Earnings penalized if withdrawn early before 5-year rule'],
    best: 'Most powerful for most people. Prioritize after getting the employer match.',
  },
  {
    key: 'sep', label: 'SEP IRA', badge: 'Self-employed', color: '#f59e0b',
    limit: 'Up to $72,000 (25% of net self-employment income)',
    tax: 'Pre-tax',
    match: false,
    pros: ['Massive limits for high-earning self-employed', 'Simple to open and administer', 'Tax-deductible contributions', 'No annual filing requirements'],
    cons: ['Must contribute same % for all eligible employees', 'No Roth option', 'RMDs at 73', 'Contribution based on net self-employment income'],
    best: 'Freelancers, consultants, sole proprietors with high income and no employees.',
  },
  {
    key: 'solo', label: 'Solo 401(k)', badge: 'Self-employed', color: '#ec4899',
    limit: 'Up to $72,000 ($80,000 if 50+)',
    tax: 'Pre-tax or Roth',
    match: false,
    pros: ['Highest limits of any self-employed option', 'Both employee + employer contributions', 'Roth option available', 'Loan provisions available'],
    cons: ['No full-time employees except spouse', 'More administrative complexity than SEP IRA', 'Form 5500 required when assets exceed $250K'],
    best: 'Self-employed with no employees wanting to maximize contributions.',
  },
]

function AccountTypesLearn() {
  const [active, setActive] = useState('401k')
  const acct = ACCOUNTS.find(a => a.key === active)

  return (
    <div style={{ paddingBottom: 8 }}>
      <div style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.65, padding: '12px 16px 8px' }}>
        Retirement accounts are the most powerful wealth-building tools available — either tax-deferred (Traditional) or tax-free (Roth). The right mix depends on your income and tax situation.
      </div>

      {/* Pill selector */}
      <div style={{ display: 'flex', gap: 6, padding: '0 16px 10px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {ACCOUNTS.map(a => (
          <button key={a.key} onClick={() => setActive(a.key)} style={{
            padding: '6px 12px', borderRadius: 99, whiteSpace: 'nowrap', flexShrink: 0,
            border: `1.5px solid ${active === a.key ? a.color : C.b2}`,
            background: active === a.key ? `${a.color}18` : C.raise,
            color: active === a.key ? a.color : C.t3,
            fontFamily: UI, fontSize: 11, fontWeight: active === a.key ? 700 : 500, cursor: 'pointer',
          }}>{a.label}</button>
        ))}
      </div>

      {/* Account detail card */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ background: C.surf, border: `1.5px solid ${acct.color}30`, borderRadius: 16, padding: '16px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 15, fontWeight: 700, color: C.t1 }}>{acct.label}</div>
            <span style={{ background: `${acct.color}18`, border: `1px solid ${acct.color}30`, borderRadius: 99, padding: '2px 8px', fontFamily: UI, fontSize: 9, fontWeight: 700, color: acct.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{acct.badge}</span>
          </div>

          {/* Limit + Tax */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
            {[['2026 Limit', acct.limit], ['Tax Treatment', acct.tax]].map(([l, v]) => (
              <div key={l} style={{ background: C.raise, borderRadius: 9, padding: '8px 10px' }}>
                <div style={{ fontFamily: UI, fontSize: 9, color: C.t3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{l}</div>
                <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, color: C.t1, lineHeight: 1.4 }}>{v}</div>
              </div>
            ))}
          </div>

          {acct.match && (
            <div style={{ display: 'flex', gap: 8, background: 'rgba(74,124,89,0.09)', border: '1px solid rgba(74,124,89,0.25)', borderRadius: 8, padding: '8px 10px', marginBottom: 10 }}>
              <CheckCircle2 size={13} color="#22c55e" style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ fontFamily: UI, fontSize: 11, color: '#4a7c59', fontWeight: 600, lineHeight: 1.5 }}>Employer match available — always contribute enough to get 100% of the match. It's an instant 50–100% return.</div>
            </div>
          )}

          {/* Pros / Cons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div>
              <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: '#22c55e', marginBottom: 5 }}>Pros</div>
              {acct.pros.map(p => (
                <div key={p} style={{ display: 'flex', gap: 5, marginBottom: 4, alignItems: 'flex-start' }}>
                  <CheckCircle2 size={11} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.5 }}>{p}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: '#ef4444', marginBottom: 5 }}>Cons</div>
              {acct.cons.map(c => (
                <div key={c} style={{ display: 'flex', gap: 5, marginBottom: 4, alignItems: 'flex-start' }}>
                  <XCircle size={11} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.5 }}>{c}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: `${acct.color}0d`, border: `1px solid ${acct.color}20`, borderRadius: 8, padding: '8px 10px' }}>
            <span style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, color: acct.color }}>Best for: </span>
            <span style={{ fontFamily: UI, fontSize: 11, color: C.t2 }}>{acct.best}</span>
          </div>
        </div>
      </div>

      {/* Priority Order */}
      <MSectionHeader label="Priority Order: Where to Put Money First" />
      <div style={{ padding: '0 16px' }}>
        <MCard>
          {[
            { step: '1', label: '401(k) up to employer match', color: '#22c55e', note: 'Free money. Always capture 100% of any employer match before doing anything else.' },
            { step: '2', label: 'Max your Roth IRA ($7,500)', color: C.teal, note: 'Tax-free growth for life. Most flexible and powerful long-term account for most people.' },
            { step: '3', label: 'Max your 401(k) ($24,500)', color: '#8b5cf6', note: 'After the Roth, go back and fill up your 401(k) to the annual limit.' },
            { step: '4', label: 'Taxable brokerage account', color: '#f59e0b', note: 'Once tax-advantaged accounts are maxed, invest in a regular brokerage with index funds.' },
          ].map((row, i) => (
            <div key={row.step} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < 3 ? `1px solid ${C.b1}` : 'none', alignItems: 'flex-start' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: row.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: '#1a1410' }}>{row.step}</span>
              </div>
              <div>
                <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1, marginBottom: 2 }}>{row.label}</div>
                <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, lineHeight: 1.5 }}>{row.note}</div>
              </div>
            </div>
          ))}
        </MCard>
      </div>
    </div>
  )
}

/* ─── Social Security Learn ───────────────────────────────────── */
function SocialSecurityLearn() {
  return (
    <div style={{ paddingBottom: 8 }}>
      <div style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.65, padding: '12px 16px 8px' }}>
        Social Security is a guaranteed, inflation-adjusted income stream for life. The difference between claiming at 62 vs 70 can exceed <strong style={{ color: C.t1 }}>$200,000 in lifetime benefits</strong>.
      </div>

      <MSectionHeader label="When to Claim: The Age Decision" />
      <div style={{ padding: '0 16px' }}>
        <MCard>
          {[
            { age: '62', label: 'Early (reduced)', color: '#ef4444', benefit: 'Up to 30% permanent reduction from your full benefit.', when: 'Health concerns, no other income, or need the money. The reduction is permanent.' },
            { age: '67', label: 'Full Retirement Age', color: C.teal, benefit: '100% of your earned benefit. The standard baseline for planning.', when: 'Average health and have assets to bridge the gap. Default benchmark.' },
            { age: '70', label: 'Maximum benefit', color: '#22c55e', benefit: '+8% per year delayed credit from FRA — up to 24–32% more than FRA benefit.', when: 'Good health, assets to live on, expect average or longer lifespan. Break-even ~age 80–82.' },
          ].map((a, i) => (
            <div key={a.age} style={{ padding: '12px 0', borderBottom: i < 2 ? `1px solid ${C.b1}` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 700, color: a.color }}>{a.age}</div>
                <span style={{ background: `${a.color}18`, border: `1px solid ${a.color}30`, borderRadius: 99, padding: '2px 8px', fontFamily: UI, fontSize: 9, fontWeight: 700, color: a.color, textTransform: 'uppercase' }}>{a.label}</span>
              </div>
              <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.6, marginBottom: 3 }}>{a.benefit}</div>
              <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, lineHeight: 1.5 }}>
                <span style={{ color: C.t1, fontWeight: 600 }}>Choose this if: </span>{a.when}
              </div>
            </div>
          ))}
        </MCard>
      </div>

      <MSectionHeader label="Key Social Security Facts" />
      <div style={{ padding: '0 16px' }}>
        <MCard>
          {[
            { label: 'Benefit calculation', detail: 'Based on your highest 35 years of earnings. Years with no income count as $0 — work at least 35 years to avoid zeros dragging down your average.' },
            { label: 'COLA adjustments', detail: 'SS benefits increase annually with inflation (COLA). Benefits are inflation-protected income for life — a core advantage.' },
            { label: 'Spousal benefit', detail: 'A non-working or lower-earning spouse can claim up to 50% of the higher earner\'s FRA benefit, even without their own work record.' },
            { label: 'Survivor benefit', detail: 'If your spouse dies, the survivor receives the higher of the two benefit amounts. This makes delaying the higher earner\'s benefit especially valuable.' },
            { label: 'Earnings test (before FRA)', detail: 'If you claim before FRA and continue working, benefits are temporarily reduced if earnings exceed $24,480 (2026). Goes away at FRA.' },
            { label: 'Taxation of benefits', detail: 'Up to 85% of SS benefits may be taxable if combined income exceeds $34K (single) or $44K (married). Plan withdrawals accordingly.' },
          ].map((f, i) => (
            <div key={f.label} style={{ padding: '10px 0', borderBottom: i < 5 ? `1px solid ${C.b1}` : 'none' }}>
              <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1, marginBottom: 3 }}>{f.label}</div>
              <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, lineHeight: 1.6 }}>{f.detail}</div>
            </div>
          ))}
          <div style={{ marginTop: 10, padding: '8px 10px', background: `${C.teal}0d`, border: `1px solid ${C.tealBdr}`, borderRadius: 8 }}>
            <div style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.6 }}>Create a free account at <strong style={{ color: C.teal }}>ssa.gov/myaccount</strong> to see your earnings history and projected benefit estimates at 62, 67, and 70.</div>
          </div>
        </MCard>
      </div>
    </div>
  )
}

/* ─── Withdrawal Rules ────────────────────────────────────────── */
function WithdrawalLearn() {
  return (
    <div style={{ paddingBottom: 8 }}>
      <div style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.65, padding: '12px 16px 8px' }}>
        Knowing when and how to withdraw — and in what order — is just as important as saving. Poor withdrawal sequencing can cost tens of thousands in unnecessary taxes.
      </div>

      <MSectionHeader label="Early Withdrawal (Before Age 59½)" />
      <div style={{ padding: '0 16px' }}>
        <MCard>
          <div style={{ display: 'flex', gap: 8, background: 'rgba(192,57,43,0.09)', border: '1px solid rgba(192,57,43,0.25)', borderRadius: 8, padding: '10px', marginBottom: 12 }}>
            <AlertCircle size={14} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
            <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.5 }}>Withdrawing from a Traditional 401(k) or IRA before 59½ triggers a <strong style={{ color: '#ef4444' }}>10% penalty plus ordinary income tax</strong>. On a $50,000 withdrawal, you could lose $20,000+.</div>
          </div>
          <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, color: C.t1, marginBottom: 8 }}>Exceptions to the 10% penalty:</div>
          {[
            'Death or permanent disability',
            'Substantially Equal Periodic Payments (SEPP / Rule 72(t))',
            'First-time home purchase (IRA only, up to $10,000 lifetime)',
            'Higher education expenses (IRA only)',
            'Medical expenses exceeding 7.5% of AGI',
            'Health insurance premiums while unemployed (IRA only)',
            'Age 55 separation from service (401(k) only)',
            'Qualified domestic relations order (divorce)',
          ].map(e => (
            <div key={e} style={{ display: 'flex', gap: 7, marginBottom: 5, alignItems: 'flex-start' }}>
              <CheckCircle2 size={12} color={C.teal} style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.5 }}>{e}</span>
            </div>
          ))}
          <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.22)', borderRadius: 8 }}>
            <div style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.6 }}>Roth IRA contributions (not earnings) can always be withdrawn penalty-free at any age — a great emergency backstop.</div>
          </div>
        </MCard>
      </div>

      <MSectionHeader label="Required Minimum Distributions (RMDs)" />
      <div style={{ padding: '0 16px' }}>
        <MCard>
          {[
            { label: 'Applies to', detail: 'Traditional IRA, 401(k), 403(b), 457, SEP IRA, SIMPLE IRA. NOT Roth IRAs (but Roth 401(k)s had RMDs until 2024).' },
            { label: 'Starting age', detail: 'Age 73 if born 1951–1959. Age 75 if born 1960 or later (under SECURE 2.0).' },
            { label: 'Penalty for missing', detail: '25% excise tax on the amount you should have withdrawn (reduced to 10% if corrected timely).' },
            { label: 'Strategy', detail: 'Consider Roth conversions in your 60s to reduce Traditional IRA balances and future RMD amounts before they start.' },
          ].map((r, i) => (
            <div key={r.label} style={{ padding: '10px 0', borderBottom: i < 3 ? `1px solid ${C.b1}` : 'none' }}>
              <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1, marginBottom: 3 }}>{r.label}</div>
              <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, lineHeight: 1.6 }}>{r.detail}</div>
            </div>
          ))}
        </MCard>
      </div>

      <MSectionHeader label="Withdrawal Order Strategy" />
      <div style={{ padding: '0 16px' }}>
        <MCard>
          <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.6, marginBottom: 10 }}>The sequence you withdraw from accounts matters for taxes. A common tax-efficient approach:</div>
          {[
            { step: '1', label: 'RMDs first', note: 'If age 73+, take required minimums from Traditional accounts to avoid the penalty.', color: '#ef4444' },
            { step: '2', label: 'Taxable brokerage accounts', note: 'Favorable long-term capital gains rates if held 1+ year.', color: '#f59e0b' },
            { step: '3', label: 'Traditional IRA / 401(k)', note: 'Taxed as ordinary income. Withdraw enough to fill lower tax brackets efficiently.', color: C.teal },
            { step: '4', label: 'Roth IRA last', note: 'Let tax-free money grow as long as possible. No RMDs. Ideal for legacy or late-retirement withdrawals.', color: '#22c55e' },
          ].map((row, i) => (
            <div key={row.step} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: i < 3 ? `1px solid ${C.b1}` : 'none', alignItems: 'flex-start' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: row.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: '#1a1410' }}>{row.step}</span>
              </div>
              <div>
                <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1, marginBottom: 2 }}>{row.label}</div>
                <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, lineHeight: 1.5 }}>{row.note}</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 10, padding: '8px 10px', background: `${C.teal}0d`, border: `1px solid ${C.tealBdr}`, borderRadius: 8 }}>
            <div style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.6 }}>Roth conversions in your 60s — before RMDs and Social Security begin — can dramatically reduce lifetime taxes.</div>
          </div>
        </MCard>
      </div>
    </div>
  )
}

/* ─── Retirement Income Learn ─────────────────────────────────── */
function IncomeLearn() {
  return (
    <div style={{ paddingBottom: 8 }}>
      <div style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.65, padding: '12px 16px 8px' }}>
        Accumulating a nest egg is only half the challenge. The other half is making it last 20–30+ years through a safe withdrawal strategy.
      </div>

      <MSectionHeader label="The 4% Rule" />
      <div style={{ padding: '0 16px' }}>
        <MCard>
          <div style={{ background: `${C.teal}0d`, border: `1px solid ${C.tealBdr}`, borderRadius: 10, padding: '10px 12px', marginBottom: 12 }}>
            <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1, marginBottom: 4 }}>What it says</div>
            <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65 }}>
              Withdraw 4% of your portfolio in year one, then adjust for inflation each year. Historically this lasts 30 years with high probability of success — even through major downturns.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
            {[
              { spend: '$40K/yr', need: '$1.0M', color: '#22c55e' },
              { spend: '$60K/yr', need: '$1.5M', color: C.teal },
              { spend: '$80K/yr', need: '$2.0M', color: '#8b5cf6' },
              { spend: '$100K/yr', need: '$2.5M', color: '#f59e0b' },
              { spend: '$120K/yr', need: '$3.0M', color: '#ec4899' },
              { spend: '$150K/yr', need: '$3.75M', color: '#ef4444' },
            ].map(r => (
              <div key={r.spend} style={{ background: `${r.color}0d`, border: `1px solid ${r.color}20`, borderRadius: 9, padding: '8px', textAlign: 'center' }}>
                <div style={{ fontFamily: UI, fontSize: 10, color: C.t3, marginBottom: 2 }}>Spend {r.spend}</div>
                <div style={{ fontFamily: DISPLAY, fontSize: 14, fontWeight: 700, color: r.color }}>{r.need}</div>
                <div style={{ fontFamily: UI, fontSize: 9, color: C.t3 }}>needed</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, padding: '8px 10px' }}>
            <div style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.6 }}>The 4% rule assumes a 30-year retirement. If retiring early, consider 3–3.5%. If retiring at 65+ with other income streams, 4–5% may be appropriate.</div>
          </div>
        </MCard>
      </div>

      <MSectionHeader label="Retirement Income Stack" />
      <div style={{ padding: '0 16px' }}>
        <MCard>
          {[
            { source: 'Social Security', type: 'Guaranteed', color: '#22c55e', note: 'Inflation-adjusted for life. Delay to 70 for maximum benefit. Forms the base of most income plans.' },
            { source: 'Pension (if applicable)', type: 'Guaranteed', color: '#22c55e', note: 'Defined benefit plan. Increasingly rare. Consider survivor benefit options carefully.' },
            { source: 'Traditional IRA / 401(k)', type: 'Taxable', color: C.teal, note: 'Taxed as ordinary income when withdrawn. RMDs start at 73. Most common savings vehicle.' },
            { source: 'Roth IRA', type: 'Tax-free', color: '#8b5cf6', note: 'Tax-free withdrawals. No RMDs. Best used last to maximize tax-free compounding.' },
            { source: 'Taxable Brokerage', type: 'Cap gains', color: '#f59e0b', note: 'Favorable long-term capital gains rates. Flexible — no withdrawal restrictions. Good bridge account.' },
            { source: 'Part-time work', type: 'Earned', color: C.t3, note: 'Even $10–20K/year dramatically reduces portfolio withdrawal needs in early retirement.' },
          ].map((r, i) => (
            <div key={r.source} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: i < 5 ? `1px solid ${C.b1}` : 'none', alignItems: 'flex-start' }}>
              <span style={{ background: `${r.color}18`, border: `1px solid ${r.color}30`, borderRadius: 99, padding: '2px 7px', fontFamily: UI, fontSize: 9, fontWeight: 700, color: r.color, textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0, marginTop: 2 }}>{r.type}</span>
              <div>
                <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1, marginBottom: 2 }}>{r.source}</div>
                <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, lineHeight: 1.5 }}>{r.note}</div>
              </div>
            </div>
          ))}
        </MCard>
      </div>
    </div>
  )
}

/* ─── Retirement Goal Calculator ──────────────────────────────── */
function RetirementCalc() {
  const [currentAge,     setCurrentAge]     = useState(35)
  const [retireAge,      setRetireAge]      = useState(65)
  const [currentSaved,   setCurrentSaved]   = useState(50000)
  const [monthlyContrib, setMonthlyContrib] = useState(1000)
  const [annualReturn,   setAnnualReturn]   = useState(7)
  const [desiredIncome,  setDesiredIncome]  = useState(70000)
  const [ssEstimate,     setSsEstimate]     = useState(20000)

  const years = Math.max(0, retireAge - currentAge)
  const r = annualReturn / 100 / 12
  const n = years * 12

  const fvCurrent = currentSaved * Math.pow(1 + annualReturn / 100, years)
  const fvContribs = r > 0 ? monthlyContrib * ((Math.pow(1 + r, n) - 1) / r) : monthlyContrib * n
  const total = fvCurrent + fvContribs

  const neededIncome = Math.max(0, desiredIncome - ssEstimate)
  const needed = neededIncome / 0.04
  const gap = needed - total
  const onTrack = gap <= 0

  const monthlyNeeded = gap > 0 && r > 0 && n > 0
    ? gap / ((Math.pow(1 + r, n) - 1) / r)
    : 0

  const inputStyle = {
    width: '100%', padding: '9px 10px', border: `1.5px solid ${C.b2}`,
    borderRadius: 8, fontSize: 14, fontFamily: UI, color: C.t1,
    fontWeight: 600, background: C.raise, boxSizing: 'border-box',
  }

  return (
    <div style={{ padding: '0 16px', paddingBottom: 16 }}>
      <MCard>
        <div style={{ fontFamily: DISPLAY, fontSize: 16, fontWeight: 700, color: C.t1, marginBottom: 4 }}>Retirement Goal Calculator</div>
        <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.5, marginBottom: 14 }}>Estimate how much you'll have at retirement and whether you're on track.</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
          {[
            ['Current Age', currentAge, setCurrentAge, 1, 18, 80, false, ''],
            ['Retire Age', retireAge, setRetireAge, 1, 50, 80, false, ''],
            ['Current Savings', currentSaved, setCurrentSaved, 5000, 0, null, true, ''],
            ['Monthly Contribution', monthlyContrib, setMonthlyContrib, 100, 0, null, true, ''],
            ['Expected Return', annualReturn, setAnnualReturn, 0.5, 1, 15, false, '%'],
            ['Desired Annual Income', desiredIncome, setDesiredIncome, 5000, 0, null, true, ''],
            ['Expected SS Annual', ssEstimate, setSsEstimate, 1000, 0, null, true, ''],
          ].map(([label, val, setter, step, min, max, isDollar, suffix]) => (
            <div key={label} style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 600, color: C.t2, marginBottom: 4 }}>{label}</div>
              <div style={{ position: 'relative' }}>
                {isDollar && <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.t3, fontSize: 13, pointerEvents: 'none' }}>$</span>}
                <input type="number" value={val} min={min} max={max || undefined} step={step}
                  onChange={e => setter(Number(e.target.value))}
                  style={{ ...inputStyle, paddingLeft: isDollar ? 22 : 10, paddingRight: suffix ? 26 : 10 }}
                />
                {suffix && <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: C.t3, fontSize: 13 }}>{suffix}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Results */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, margin: '4px 0 14px' }}>
          {[
            ['Projected Portfolio', `$${(total / 1e6).toFixed(2)}M`, C.teal],
            ['Needed (4% rule)', `$${(needed / 1e6).toFixed(2)}M`, C.t1],
            [onTrack ? 'Surplus' : 'Gap', `$${(Math.abs(gap) / 1e6).toFixed(2)}M`, onTrack ? '#22c55e' : '#ef4444'],
          ].map(([label, value, color]) => (
            <div key={label} style={{ background: `${color}0d`, border: `1px solid ${color}25`, borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 16, fontWeight: 700, color, lineHeight: 1.1 }}>{value}</div>
              <div style={{ fontFamily: UI, fontSize: 9, color: C.t3, marginTop: 3, fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>

        {onTrack ? (
          <div style={{ background: 'rgba(74,124,89,0.09)', border: '1px solid rgba(74,124,89,0.25)', borderRadius: 10, padding: '12px' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <CheckCircle2 size={14} color="#22c55e" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: '#4a7c59', marginBottom: 3 }}>You're on track!</div>
                <div style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.6 }}>
                  Projected <strong>{fmt(total)}</strong> exceeds the <strong>{fmt(needed)}</strong> needed to support {fmt(neededIncome)}/year after Social Security.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: 'rgba(192,57,43,0.09)', border: '1px solid rgba(192,57,43,0.25)', borderRadius: 10, padding: '12px' }}>
            <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: '#ef4444', marginBottom: 4 }}>Savings Gap: {fmt(gap)}</div>
            <div style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.6, marginBottom: 6 }}>
              To close this gap, increase monthly contributions by approximately <strong style={{ color: '#ef4444' }}>{fmt(monthlyNeeded)}/month</strong> — or adjust your retirement age, income goal, or return assumption.
            </div>
            <div style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>Options: delay retirement, reduce income goal, work part-time early in retirement, or max all tax-advantaged accounts.</div>
          </div>
        )}
      </MCard>
    </div>
  )
}

/* ─── SS Optimizer ────────────────────────────────────────────── */
const HEALTH_MAP = {
  excellent:     { label: 'Excellent (90+)',          age: 92 },
  good:          { label: 'Good (82–90)',              age: 86 },
  average:       { label: 'Average (78–82)',           age: 80 },
  below_average: { label: 'Below Average (under 78)', age: 76 },
}

function SSTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 8, padding: '8px 10px', fontSize: 11 }}>
      <div style={{ fontWeight: 700, color: C.t1, marginBottom: 3, fontFamily: UI }}>Age {label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color, marginBottom: 2, fontFamily: MONO }}>{p.name}: {fmtK(p.value)}</div>
      ))}
    </div>
  )
}

function SSOptimizer() {
  const RED    = '#ef4444'
  const GREEN  = '#22c55e'
  const PURPLE = '#818cf8'

  const [fraMonthly,    setFraMonthly]    = useState(2400)
  const [health,        setHealth]        = useState('good')
  const [maritalStatus, setMaritalStatus] = useState('single')
  const [spouseFra,     setSpouseFra]     = useState(1800)
  const [otherIncome,   setOtherIncome]   = useState(20000)

  const calc = useMemo(() => {
    const fra  = Math.max(0, fraMonthly)
    const m62  = fra * 0.70
    const m67  = fra
    const m70  = fra * 1.24
    const lifeAge = HEALTH_MAP[health].age

    const lt = (monthly, claimAge) => monthly * Math.max(0, (lifeAge - claimAge) * 12)
    const lt62 = lt(m62, 62)
    const lt67 = lt(m67, 67)
    const lt70 = lt(m70, 70)

    const maxLT = Math.max(lt62, lt67, lt70)
    let winner = '67'
    if (lt62 === maxLT) winner = '62'
    else if (lt70 === maxLT) winner = '70'

    let be6267 = null, be6770 = null, be6270 = null
    for (let age = 62; age <= 100; age += 0.01) {
      const t62 = m62 * Math.max(0, (age - 62) * 12)
      const t67 = m67 * Math.max(0, (age - 67) * 12)
      const t70 = m70 * Math.max(0, (age - 70) * 12)
      if (!be6267 && t67 >= t62) be6267 = +age.toFixed(1)
      if (!be6770 && t70 >= t67) be6770 = +age.toFixed(1)
      if (!be6270 && t70 >= t62) be6270 = +age.toFixed(1)
      if (be6267 && be6770 && be6270) break
    }

    const chartData = []
    for (let age = 62; age <= 95; age++) {
      chartData.push({
        age,
        'Age 62': Math.round(m62 * Math.max(0, (age - 62) * 12)),
        'Age 67': Math.round(m67 * Math.max(0, (age - 67) * 12)),
        'Age 70': Math.round(m70 * Math.max(0, (age - 70) * 12)),
      })
    }

    const selfFra       = fra
    const spFra         = Math.max(0, spouseFra)
    const higherFra     = Math.max(selfFra, spFra)
    const lowerFra      = Math.min(selfFra, spFra)
    const spousalBenefit = Math.max(lowerFra, higherFra * 0.5)
    const spousalExtra  = Math.max(0, spousalBenefit - lowerFra)
    const survivorBenefit = higherFra * 1.24

    const annualSS = m67 * 12
    const combinedIncome = otherIncome + annualSS * 0.5
    let taxablePct = 0
    if (combinedIncome > 34000) taxablePct = 0.85
    else if (combinedIncome > 25000) taxablePct = 0.50
    const taxableAmount = annualSS * taxablePct

    return { m62, m67, m70, lt62, lt67, lt70, winner, lifeAge, be6267, be6770, be6270, chartData, spousalBenefit, spousalExtra, survivorBenefit, annualSS, taxablePct, taxableAmount, combinedIncome }
  }, [fraMonthly, health, spouseFra, otherIncome])

  const inputStyle = {
    width: '100%', padding: '9px 10px 9px 22px', border: `1.5px solid ${C.b2}`,
    borderRadius: 8, fontSize: 14, fontFamily: UI, color: C.t1,
    fontWeight: 600, background: C.raise, boxSizing: 'border-box',
  }

  return (
    <div style={{ padding: '0 16px', paddingBottom: 16 }}>
      <MCard>
        <div style={{ fontFamily: DISPLAY, fontSize: 16, fontWeight: 700, color: C.t1, marginBottom: 4 }}>Social Security Optimizer</div>
        <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.5, marginBottom: 12 }}>Find the optimal claiming age to maximize your lifetime benefits.</div>

        {/* Key stat badges */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
          {[
            ['Full Retirement Age', 'Age 67', C.teal],
            ['Early Penalty', '−30%', RED],
            ['Delayed Bonus/Year', '+8%', GREEN],
            ['Max Monthly 2026', '$4,873', '#f59e0b'],
          ].map(([l, v, c]) => (
            <div key={l} style={{ background: `${c}10`, border: `1px solid ${c}30`, borderRadius: 8, padding: '8px 10px' }}>
              <div style={{ fontFamily: MONO, fontSize: 16, fontWeight: 800, color: c, lineHeight: 1 }}>{v}</div>
              <div style={{ fontFamily: UI, fontSize: 9, color: C.t3, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* FRA input */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 600, color: C.t2, marginBottom: 4 }}>Monthly Benefit at FRA (Age 67)</div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.t3, fontSize: 13 }}>$</span>
            <input type="number" value={fraMonthly} min={0} step={100} onChange={e => setFraMonthly(Number(e.target.value))} style={inputStyle} />
          </div>
          <div style={{ fontFamily: UI, fontSize: 10, color: C.t3, marginTop: 3 }}>Find your estimate at ssa.gov/myaccount</div>
        </div>

        {/* Health */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 600, color: C.t2, marginBottom: 6 }}>Health / Life Expectancy</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {Object.entries(HEALTH_MAP).map(([key, { label }]) => (
              <button key={key} onClick={() => setHealth(key)} style={{
                background: health === key ? `${C.teal}18` : C.raise,
                border: `1.5px solid ${health === key ? C.teal : C.b2}`,
                borderRadius: 8, padding: '7px 10px',
                color: health === key ? C.teal : C.t3,
                fontFamily: UI, fontSize: 11, fontWeight: health === key ? 700 : 400,
                cursor: 'pointer', textAlign: 'left',
              }}>{label}</button>
            ))}
          </div>
        </div>

        {/* Marital status */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 600, color: C.t2, marginBottom: 6 }}>Marital Status</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['single', 'married'].map(s => (
              <button key={s} onClick={() => setMaritalStatus(s)} style={{
                flex: 1, background: maritalStatus === s ? `${C.teal}18` : C.raise,
                border: `1.5px solid ${maritalStatus === s ? C.teal : C.b2}`,
                borderRadius: 8, padding: '8px',
                color: maritalStatus === s ? C.teal : C.t3,
                fontFamily: UI, fontSize: 12, fontWeight: maritalStatus === s ? 700 : 400,
                cursor: 'pointer', textTransform: 'capitalize',
              }}>{s}</button>
            ))}
          </div>
        </div>

        {maritalStatus === 'married' && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 600, color: C.t2, marginBottom: 4 }}>Spouse's Monthly Benefit at FRA</div>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.t3, fontSize: 13 }}>$</span>
              <input type="number" value={spouseFra} min={0} step={100} onChange={e => setSpouseFra(Number(e.target.value))} style={inputStyle} />
            </div>
          </div>
        )}

        {/* Scenario comparison */}
        <div style={{ fontFamily: UI, fontSize: 9, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
          Claiming Age Comparison · Life expectancy: Age {calc.lifeAge}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
          {[
            { age: '62', sub: '−30% perm.', color: RED,   monthly: calc.m62, lt: calc.lt62, w: calc.winner === '62' },
            { age: '67', sub: 'FRA',        color: C.teal, monthly: calc.m67, lt: calc.lt67, w: calc.winner === '67' },
            { age: '70', sub: '+24% perm.', color: GREEN,  monthly: calc.m70, lt: calc.lt70, w: calc.winner === '70' },
          ].map(sc => (
            <div key={sc.age} style={{
              background: C.raise, border: `${sc.w ? 2 : 1}px solid ${sc.w ? sc.color : C.b2}`,
              borderRadius: 12, padding: '10px', position: 'relative',
            }}>
              {sc.w && (
                <div style={{
                  position: 'absolute', top: -9, left: '50%', transform: 'translateX(-50%)',
                  background: sc.color, color: '#000', fontSize: 8, fontWeight: 800,
                  padding: '2px 6px', borderRadius: 99, letterSpacing: '0.06em',
                  textTransform: 'uppercase', whiteSpace: 'nowrap', fontFamily: UI,
                }}>Best</div>
              )}
              <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <div style={{ fontFamily: DISPLAY, fontSize: 13, fontWeight: 700, color: sc.color }}>Age {sc.age}</div>
                <div style={{ fontFamily: UI, fontSize: 9, color: C.t3 }}>{sc.sub}</div>
              </div>
              {[
                ['Monthly', fmt(sc.monthly)],
                ['Lifetime', fmtK(sc.lt)],
              ].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: `1px solid ${C.b1}` }}>
                  <span style={{ fontFamily: UI, fontSize: 9, color: C.t3 }}>{l}</span>
                  <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: sc.color }}>{v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Breakeven */}
        <div style={{ fontFamily: UI, fontSize: 9, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Breakeven Analysis</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
          {[
            { label: '62 vs 67', age: calc.be6267, color: C.teal },
            { label: '67 vs 70', age: calc.be6770, color: GREEN },
            { label: '62 vs 70', age: calc.be6270, color: '#f59e0b' },
          ].map(({ label, age, color }) => (
            <div key={label} style={{ background: C.raise, borderRadius: 10, border: `1px solid ${C.b2}`, padding: '10px 8px' }}>
              <div style={{ fontFamily: UI, fontSize: 8, fontWeight: 700, color: C.t3, textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
              <div style={{ fontFamily: MONO, fontSize: 18, fontWeight: 900, color, lineHeight: 1 }}>Age {age ?? '—'}</div>
            </div>
          ))}
        </div>

        {/* Cumulative Chart */}
        <div style={{ fontFamily: UI, fontSize: 9, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Cumulative Lifetime Benefits</div>
        <div style={{ fontFamily: UI, fontSize: 10, color: C.t3, marginBottom: 10 }}>Lines cross at breakeven ages</div>
        <div style={{ marginBottom: 14 }}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={calc.chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <defs>
                {[['ssG62', RED], ['ssG67', C.teal], ['ssG70', GREEN]].map(([id, color]) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={color} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid stroke={C.b1} strokeOpacity={0.4} />
              <XAxis dataKey="age" tick={{ fontSize: 9, fill: C.t3, fontFamily: MONO }} />
              <YAxis tickFormatter={v => fmtK(v)} tick={{ fontSize: 9, fill: C.t3, fontFamily: MONO }} width={50} />
              <Tooltip content={<SSTooltip />} />
              <Legend wrapperStyle={{ fontSize: 10, paddingTop: 4, fontFamily: UI }} />
              <Area type="monotone" dataKey="Age 62" stroke={RED}    fill="url(#ssG62)" strokeWidth={1.5} dot={false} />
              <Area type="monotone" dataKey="Age 67" stroke={C.teal} fill="url(#ssG67)" strokeWidth={1.5} dot={false} />
              <Area type="monotone" dataKey="Age 70" stroke={GREEN}  fill="url(#ssG70)" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Spousal & Survivor */}
        {maritalStatus === 'married' && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Users size={13} color={PURPLE} />
              <span style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Spousal & Survivor Benefits</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
              {[
                ['Spousal Benefit', `${fmt(calc.spousalBenefit)}/mo`, PURPLE, 'Lower-earning spouse can claim up to 50% of higher earner\'s FRA benefit.'],
                ['Survivor Benefit', `${fmt(calc.survivorBenefit)}/mo`, C.teal, 'Surviving spouse receives deceased\'s benefit. Delaying to 70 maximizes this permanently.'],
              ].map(([l, v, c, d]) => (
                <div key={l} style={{ background: C.raise, borderRadius: 10, border: `1px solid ${C.b2}`, padding: '10px' }}>
                  <div style={{ fontFamily: UI, fontSize: 9, fontWeight: 700, color: C.t3, textTransform: 'uppercase', marginBottom: 4 }}>{l}</div>
                  <div style={{ fontFamily: MONO, fontSize: 14, fontWeight: 800, color: c, marginBottom: 4 }}>{v}</div>
                  <div style={{ fontFamily: UI, fontSize: 10, color: C.t3, lineHeight: 1.5 }}>{d}</div>
                </div>
              ))}
            </div>
            <div style={{ background: `${PURPLE}0d`, border: `1px solid ${PURPLE}25`, borderRadius: 8, padding: '8px 10px' }}>
              <div style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.6 }}>Strategy: lower-earning spouse claims early (62–65) to bring income in, while higher-earning spouse delays to 70 to maximize the survivor benefit.</div>
            </div>
          </div>
        )}

        {/* Tax on SS */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <DollarSign size={13} color={C.teal} />
            <span style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tax on Social Security Benefits</span>
          </div>

          <div style={{ marginBottom: 10 }}>
            <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 600, color: C.t2, marginBottom: 6 }}>Income Thresholds (Single Filers)</div>
            {[
              ['Under $25,000',   '0% taxable',        GREEN],
              ['$25K–$34K',       'Up to 50% taxable', '#f59e0b'],
              ['Over $34,000',    'Up to 85% taxable', RED],
            ].map(([range, pct, color]) => (
              <div key={range} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: `1px solid ${C.b1}` }}>
                <span style={{ fontFamily: UI, fontSize: 11, color: C.t2 }}>{range}</span>
                <span style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color, background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 99, padding: '2px 7px' }}>{pct}</span>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 10 }}>
            <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 600, color: C.t2, marginBottom: 4 }}>Other Annual Income</div>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.t3, fontSize: 13 }}>$</span>
              <input type="number" value={otherIncome} min={0} step={1000} onChange={e => setOtherIncome(Number(e.target.value))}
                style={{ width: '100%', padding: '9px 10px 9px 22px', border: `1.5px solid ${C.b2}`, borderRadius: 8, fontSize: 14, fontFamily: UI, color: C.t1, fontWeight: 600, background: C.raise, boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ background: C.raise, borderRadius: 8, border: `1px solid ${C.b2}`, padding: '10px' }}>
            {[
              ['Annual SS at FRA',  fmt(calc.annualSS),       C.t1, false],
              ['Combined Income',   fmt(calc.combinedIncome), C.t1, false],
              ['Taxable Portion',   `${Math.round(calc.taxablePct * 100)}%`, calc.taxablePct > 0 ? RED : GREEN, true],
              ['Taxable SS Amount', `${fmt(calc.taxableAmount)}/yr`, calc.taxablePct > 0 ? RED : GREEN, true],
            ].map(([l, v, c, bold]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: `1px solid ${C.b1}` }}>
                <span style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>{l}</span>
                <span style={{ fontFamily: MONO, fontSize: bold ? 13 : 11, fontWeight: bold ? 700 : 600, color: c }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 12, background: `${C.teal}0d`, border: `1px solid ${C.tealBdr}`, borderRadius: 8, padding: '8px 10px' }}>
          <div style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.6 }}>For accurate benefit estimates, create a free account at <strong style={{ color: C.teal }}>ssa.gov/myaccount</strong>. Consider a fee-only CFP for a personalized claiming strategy.</div>
        </div>
      </MCard>
    </div>
  )
}

/* ─── Resources ───────────────────────────────────────────────── */
function ResourcesTab() {
  const sections = [
    {
      category: 'Government & Official Tools', color: C.teal,
      items: [
        { name: 'SSA My Account', desc: 'See your full earnings history and projected SS benefits at 62, 67, and 70.', url: 'https://www.ssa.gov/myaccount/' },
        { name: 'IRS Retirement Plans', desc: 'Official IRS guidance on contribution limits, rules, and plan types.', url: 'https://www.irs.gov/retirement-plans' },
        { name: 'DOL Retirement Resources', desc: 'Resources on 401(k) rules, ERISA protections, and fee disclosures.', url: 'https://www.dol.gov/general/topic/retirement' },
      ],
    },
    {
      category: 'Planning & Calculators', color: '#8b5cf6',
      items: [
        { name: 'FIRECalc', desc: 'Tests your plan against every 30-year period in market history.', url: 'https://firecalc.com' },
        { name: 'cFIREsim', desc: 'Monte Carlo and historical simulation for retirement portfolios. Free.', url: 'https://cfiresim.com' },
        { name: 'NewRetirement', desc: 'Comprehensive retirement planning tool with free tier.', url: 'https://www.newretirement.com' },
      ],
    },
    {
      category: 'Education', color: '#f59e0b',
      items: [
        { name: 'Bogleheads Wiki', desc: 'Community-driven guide to index fund investing and retirement planning.', url: 'https://www.bogleheads.org/wiki/Retirement' },
        { name: 'SSA Publications', desc: 'Free official guides to Social Security, spousal benefits, and survivor benefits.', url: 'https://www.ssa.gov/pubs/' },
      ],
    },
  ]

  return (
    <div style={{ paddingBottom: 8 }}>
      {sections.map(s => (
        <div key={s.category}>
          <MSectionHeader label={s.category} />
          <div style={{ padding: '0 16px' }}>
            <MCard>
              {s.items.map((item, i) => (
                <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: i < s.items.length - 1 ? `1px solid ${C.b1}` : 'none', textDecoration: 'none' }}>
                  <div>
                    <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: s.color, marginBottom: 2 }}>{item.name}</div>
                    <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                  <ExternalLink size={13} color={C.t3} style={{ flexShrink: 0, marginTop: 2 }} />
                </a>
              ))}
            </MCard>
          </div>
        </div>
      ))}

      <MSectionHeader label="When to Hire a Financial Planner" />
      <div style={{ padding: '0 16px' }}>
        <MCard>
          {[
            'Within 5 years of retirement and haven\'t stress-tested your income plan',
            'Have a pension with complex survivor benefit decisions',
            'Combined retirement assets exceed $500K',
            'Want a Social Security claiming strategy for you and a spouse',
            'Need Roth conversion planning to reduce future RMDs and taxes',
            'Self-employed and want to maximize retirement account options',
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '7px 0', borderBottom: i < 5 ? `1px solid ${C.b1}` : 'none' }}>
              <ArrowRight size={12} color={C.teal} style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.5 }}>{r}</span>
            </div>
          ))}
          <div style={{ marginTop: 10, background: `${C.teal}0d`, border: `1px solid ${C.tealBdr}`, borderRadius: 8, padding: '8px 10px' }}>
            <div style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.6 }}>Look for a <strong style={{ color: C.teal }}>fee-only, fiduciary CFP</strong>. They charge for advice only — no commissions — so recommendations aren't influenced by products they sell.</div>
          </div>
        </MCard>
      </div>
    </div>
  )
}

/* ─── Main Component ──────────────────────────────────────────── */
const LEARN_SUBS = [
  { key: 'accounts',   label: 'Accounts'   },
  { key: 'ss',         label: 'Soc. Sec.'  },
  { key: 'withdrawal', label: 'Withdrawals' },
  { key: 'income',     label: 'Income'     },
]

export default function MRetirement() {
  const [tab,      setTab]      = useState('learn')
  const [learnSub, setLearnSub] = useState('accounts')
  const [calcSub,  setCalcSub]  = useState('retirement')

  return (
    <div style={{ background: C.bg, minHeight: '100dvh', paddingBottom: 80 }}>
      <ScreenHeader title="Retirement Planning" subtitle="Learn" accent={C.indigo} />

      {/* Main tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${C.b2}`, padding: '0 16px' }}>
        {[['learn', 'Learn'], ['calculate', 'Calculate'], ['resources', 'Resources']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            flex: 1, padding: '11px 0', background: 'none', border: 'none', cursor: 'pointer',
            borderBottom: `2px solid ${tab === k ? C.indigo : 'transparent'}`,
            color: tab === k ? C.indigo : C.t3,
            fontFamily: UI, fontSize: 12, fontWeight: 600,
          }}>{l}</button>
        ))}
      </div>

      {/* Learn sub-tabs */}
      {tab === 'learn' && (
        <>
          <div style={{ display: 'flex', gap: 6, padding: '10px 16px 0', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {LEARN_SUBS.map(s => (
              <button key={s.key} onClick={() => setLearnSub(s.key)} style={{
                padding: '6px 12px', borderRadius: 99, whiteSpace: 'nowrap', flexShrink: 0,
                border: `1px solid ${learnSub === s.key ? C.indigo : C.b2}`,
                background: learnSub === s.key ? `${C.indigo}18` : C.raise,
                color: learnSub === s.key ? C.indigo : C.t3,
                fontFamily: UI, fontSize: 11, fontWeight: learnSub === s.key ? 700 : 500, cursor: 'pointer',
              }}>{s.label}</button>
            ))}
          </div>
          {learnSub === 'accounts'   && <AccountTypesLearn />}
          {learnSub === 'ss'         && <SocialSecurityLearn />}
          {learnSub === 'withdrawal' && <WithdrawalLearn />}
          {learnSub === 'income'     && <IncomeLearn />}
        </>
      )}

      {/* Calculate sub-tabs */}
      {tab === 'calculate' && (
        <>
          <div style={{ display: 'flex', gap: 8, padding: '10px 16px 0' }}>
            {[['retirement', 'Retirement Goal'], ['ss', 'SS Optimizer']].map(([k, l]) => (
              <button key={k} onClick={() => setCalcSub(k)} style={{
                padding: '6px 14px', borderRadius: 99,
                border: `1px solid ${calcSub === k ? C.indigo : C.b2}`,
                background: calcSub === k ? `${C.indigo}18` : C.raise,
                color: calcSub === k ? C.indigo : C.t3,
                fontFamily: UI, fontSize: 11, fontWeight: calcSub === k ? 700 : 500, cursor: 'pointer',
              }}>{l}</button>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            {calcSub === 'retirement' && <RetirementCalc />}
            {calcSub === 'ss'         && <SSOptimizer />}
          </div>
        </>
      )}

      {tab === 'resources' && <ResourcesTab />}
    </div>
  )
}
