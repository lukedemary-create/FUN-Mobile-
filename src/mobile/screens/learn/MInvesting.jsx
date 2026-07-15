import { useState, useMemo } from 'react'
import { CheckCircle2, Info, ChevronDown, ChevronUp, ArrowRight, ExternalLink } from 'lucide-react'
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'

const fmt  = n => '$' + Math.round(Math.abs(n || 0)).toLocaleString()
const fmtK = n => {
  const a = Math.abs(n || 0)
  if (a >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M'
  if (a >= 1_000)     return '$' + (n / 1_000).toFixed(0) + 'K'
  return '$' + Math.round(n || 0).toLocaleString()
}

/* ─── Master Account Data ─────────────────────────────────────── */
const ACCOUNTS = [
  {
    key: '401k', name: '401(k) Traditional', group: 'Employer', color: C.gold,
    limit: '$24,500/yr | $32,500 if 50+ | $70,000 total with employer',
    tax: 'Pre-Tax → Taxable at withdrawal',
    highlight: 'Employer match is free money — always contribute enough to capture 100% of the match first.',
    bestFor: 'All employees with access to a 401(k), especially those with employer matching.',
    incomeLimit: 'No income limits — available to all employees of participating employers.',
    rmd: 'RMDs begin at age 73 (SECURE 2.0).',
    earlyPenalty: '10% penalty + ordinary income tax before age 59½. Exception: Rule of 55 if you leave the employer at 55+.',
    bestAssets: 'Bond funds (AGG, BND), REITs (VNQ), active mutual funds, high-dividend stocks, TIPS.',
    rationale: 'Tax-inefficient assets (bonds, REITs) benefit most from deferral. Hold them here so they compound without annual tax drag.',
    proTips: [
      'Mega Backdoor Roth: some plans allow after-tax contributions up to $70K total limit, then convert to Roth (check if plan allows in-plan Roth conversions)',
      '401k loan: can borrow up to 50% of balance or $50K — if you leave the job, the loan becomes due immediately or is treated as a distribution',
      'Check expense ratios — if plan fees exceed 0.5%, an IRA after the match may make more sense',
    ],
  },
  {
    key: 'roth401k', name: 'Roth 401(k)', group: 'Employer', color: '#a855f7',
    limit: '$24,500/yr — COMBINED with Traditional 401(k) | $32,500 if 50+',
    tax: 'After-Tax → Tax-free growth & withdrawals',
    highlight: 'High earners above the Roth IRA income limit ($168K single) — this is the ONLY direct path to new Roth contributions without the backdoor strategy.',
    bestFor: 'High earners over Roth IRA income limits, young investors expecting higher future tax brackets.',
    incomeLimit: 'No income limits — anyone can contribute regardless of income (unlike Roth IRA).',
    rmd: 'SECURE 2.0 (2024): Roth 401k RMDs eliminated. Roll to Roth IRA upon leaving employer to eliminate RMDs entirely.',
    earlyPenalty: '10% penalty + income tax on earnings before 59½. Contributions can be withdrawn penalty-free. Both 59½ and 5-year rule must be met for earnings.',
    bestAssets: 'Highest-growth assets you own — individual growth stocks, small-cap ETFs, aggressive sector funds.',
    rationale: 'Put your best-performing assets here. Gains inside are never taxed. No income limit makes this the only way for high earners to access Roth without backdoor.',
    proTips: [
      'You can split contributions between Traditional and Roth 401k — combined total cannot exceed $24,500',
      'Upon leaving employer, roll Roth 401k → Roth IRA to gain flexibility and eliminate RMDs',
      'Employer match always goes to the Traditional (pre-tax) side, even if your contributions are 100% Roth',
    ],
  },
  {
    key: 'rothira', name: 'Roth IRA', group: 'Individual', color: '#22c55e',
    limit: '$7,500/yr | $8,600 if 50+ (2026)',
    tax: 'After-Tax → 100% tax-free growth & withdrawals',
    highlight: 'The most flexible account in personal finance — no RMDs, contributions withdrawable anytime penalty-free, and no taxes on earnings in retirement.',
    bestFor: 'Young investors, those expecting higher future tax rates, high earners using Backdoor Roth, anyone wanting tax-free wealth transfer.',
    incomeLimit: 'Phase-out: $153K–$168K single | $242K–$252K MFJ (2026). Above limit: use Backdoor Roth strategy.',
    rmd: 'No RMDs during the owner\'s lifetime. Money can compound indefinitely — ideal for estate planning.',
    earlyPenalty: 'Contributions: no penalty ever. Earnings before 59½ or 5-year rule: 10% penalty + income tax. Exceptions: disability, first home ($10K lifetime).',
    bestAssets: 'Individual growth stocks, small-cap ETFs, aggressive sector funds, REITs — anything with greatest expected long-term gain.',
    rationale: 'Put your highest-growth assets here. A stock that 10x\'s inside a Roth IRA = zero tax ever on those gains.',
    proTips: [
      'Backdoor Roth: contribute to a non-deductible Traditional IRA then convert. No income limit on conversions. Watch for the pro-rata rule.',
      '5-year rule: Roth must be open at least 5 years for earnings to be tax-free — open one as early as possible',
      'Roth conversion ladder: convert Traditional IRA/401k to Roth in low-income years — each conversion is penalty-free after 5 years',
    ],
  },
  {
    key: 'tradira', name: 'Traditional IRA', group: 'Individual', color: '#3b82f6',
    limit: '$7,500/yr | $8,600 if 50+ (2026)',
    tax: 'Pre-Tax* → Taxable at withdrawal',
    highlight: 'Deductibility phases out at $81K–$87K (single) if you have a workplace plan — but anyone can contribute regardless of income.',
    bestFor: 'People without a 401(k), those below the deductibility threshold, or doing Roth conversions.',
    incomeLimit: 'Deductibility phases out: $81K–$87K single | $129K–$143K MFJ with workplace plan (2026). Anyone can contribute regardless.',
    rmd: 'RMDs begin at age 73 (SECURE 2.0).',
    earlyPenalty: '10% penalty + ordinary income tax before 59½. Exceptions: first home ($10K lifetime), disability, substantially equal payments (72t).',
    bestAssets: 'Bond funds, REITs, active mutual funds, high-dividend funds — tax-inefficient assets that generate ordinary income.',
    rationale: 'Bond interest and REIT dividends taxed as ordinary income each year in a taxable account. Hold them here to defer that tax until retirement.',
    proTips: [
      'Non-deductible contributions create "basis" — track it on IRS Form 8606 every year or you\'ll pay taxes twice on the same money',
      '401k rollover to IRA: penalty-free when changing jobs. Consolidates accounts and gains better investment options',
      'Pro-rata rule: if you have both deductible and non-deductible IRA balances, each conversion is partially taxable — complicates Backdoor Roth',
    ],
  },
  {
    key: 'hsa', name: 'HSA', group: 'Individual', color: '#8b5cf6',
    limit: '$4,400 self-only | $8,750 family (2026) | +$1,000 catch-up if 55+',
    tax: 'Triple Tax: Pre-tax in → Tax-free growth → Tax-free out for medical',
    highlight: 'The only account with a triple tax advantage. Invest the balance — pay medical costs out-of-pocket to preserve the tax-free compounding.',
    bestFor: 'Anyone with an HDHP who can afford to pay current medical costs out-of-pocket and invest the HSA balance.',
    incomeLimit: 'Must be enrolled in a High-Deductible Health Plan (HDHP). Cannot contribute if enrolled in Medicare.',
    rmd: 'No RMDs ever. Funds roll over year to year — no "use it or lose it." Balance can compound indefinitely.',
    earlyPenalty: 'Non-medical before 65: 20% penalty + income tax. After 65: no penalty, just income tax (functions like a Traditional IRA). Medical expenses: never penalized.',
    bestAssets: 'Growth ETFs and index funds — triple tax advantage maximizes benefit of appreciation.',
    rationale: 'The HSA triple tax advantage is most powerful with high-growth investments. Pay medical out-of-pocket and let the HSA compound tax-free.',
    proTips: [
      'Save all medical receipts permanently — there is NO time limit to reimburse yourself. Contribute now, reimburse years later.',
      'Invest the full balance — most providers offer investment options once balance exceeds $1,000–$2,000',
      'FICA tax savings: payroll HSA contributions avoid Social Security and Medicare taxes (2.9–7.65% savings)',
    ],
  },
  {
    key: '529', name: '529 Education Plan', group: 'Individual', color: '#f59e0b',
    limit: 'No annual limit. Gift exclusion: $19,000/yr per beneficiary. Superfunding: $95,000 lump sum.',
    tax: 'After-Tax (state deduction) → Tax-free growth → Tax-free for qualified education',
    highlight: 'SECURE 2.0: unused 529 funds can now be rolled to a Roth IRA for the beneficiary — lifetime max $35,000, eliminating the "overfunding" risk.',
    bestFor: 'Parents saving for children\'s education — open one when the child is born to maximize growth years.',
    incomeLimit: 'No income limits — anyone can open and contribute regardless of income.',
    rmd: 'No RMDs. Funds can be kept indefinitely. Beneficiary can be changed to any family member.',
    earlyPenalty: 'Non-qualified withdrawals: 10% penalty + income tax on earnings only. Contributions (already taxed) are never penalized.',
    bestAssets: 'Age-based index fund portfolios. Broad market index funds when beneficiary is young; conservative/bond funds as college approaches.',
    rationale: 'Tax-free growth on education savings. The earlier you open and fund it, the more years of tax-free compounding you get.',
    proTips: [
      'Superfunding: contribute 5 years of annual exclusion gifts at once ($95K per beneficiary in 2026) — removes from your estate immediately',
      'SECURE 2.0: after 15 years, unused 529 → Roth IRA for beneficiary (lifetime max $35K, subject to Roth IRA annual limits)',
      'Change beneficiary to any family member — siblings, cousins, even yourself — if original beneficiary doesn\'t need it',
    ],
  },
  {
    key: 'brokerage', name: 'Taxable Brokerage', group: 'Individual', color: '#f97316',
    limit: 'Unlimited — no contribution caps, no income limits, no restrictions.',
    tax: 'After-Tax → Capital gains tax only when you sell',
    highlight: 'Step-up in basis at death eliminates all embedded capital gains for heirs — the most powerful estate planning feature of any taxable account.',
    bestFor: 'Anyone who has maxed tax-advantaged accounts, needs flexibility before retirement age, or saving toward goals with no timeline restrictions.',
    incomeLimit: 'None. Available to anyone at any age.',
    rmd: 'No RMDs ever. Withdraw on your schedule. Assets can be held indefinitely.',
    earlyPenalty: 'No penalties of any kind at any age. Capital gains tax applies but no penalty surcharge.',
    bestAssets: 'Tax-efficient index ETFs (VTI, SPY, QQQ) — minimal capital gain distributions. Growth stocks held long-term for LTCG rates.',
    rationale: 'Tax efficiency is everything here. Index ETFs rarely distribute capital gains. LTCG rates (0–20%) vs ordinary income (up to 37%) make buy-and-hold powerful.',
    proTips: [
      'Tax-loss harvesting: sell a losing position to realize a deductible loss, immediately buy a similar ETF — wash-sale rule is 30 days',
      '2026 LTCG rates (single): 0% if income ≤$49,450 | 15% up to $545,500 | 20% above',
      'Qualified dividends (held 60+ days) taxed at LTCG rates, not ordinary income — most major U.S. stock dividends qualify',
    ],
  },
  {
    key: 'sepira', name: 'SEP IRA', group: 'Self-Employed', color: C.gold,
    limit: '25% of compensation OR $70,000 (2026) — whichever is less',
    tax: 'Pre-Tax → Taxable at withdrawal',
    highlight: 'The simplest high-contribution retirement account for self-employed. Contribution deadline is your tax filing deadline — giving you until October 15 to decide.',
    bestFor: 'Freelancers and self-employed with high income who want maximum contribution room with minimal administrative complexity.',
    incomeLimit: 'No income limits. Available to self-employed, freelancers, sole proprietors, small business owners.',
    rmd: 'RMDs begin at age 73 — same rules as Traditional IRA.',
    earlyPenalty: '10% penalty + ordinary income tax before 59½. Same exceptions as Traditional IRA.',
    bestAssets: 'Bond funds, REITs, active funds — same tax-inefficient assets as Traditional IRA/401k.',
    rationale: 'Same asset location logic as a Traditional IRA. The large contribution limit makes this a powerful wealth-building tool for high-earning self-employed.',
    proTips: [
      'Contribution is discretionary each year — you can contribute $0 in a bad year. Ideal for variable income businesses.',
      'If you have employees, you must contribute the same % of compensation to their SEP IRAs as you contribute for yourself',
      'Solo 401k advantage: for most self-employed, Solo 401k allows higher contributions at lower income levels than SEP IRA',
    ],
  },
]

const GROUP_COLORS = { Employer: C.teal, Individual: C.indigo, 'Self-Employed': C.gold }

/* ─── Account Master Section ──────────────────────────────────── */
function AccountMasterSection() {
  const [filter, setFilter] = useState('All')
  const [open,   setOpen]   = useState(null)

  const groups = ['All', 'Employer', 'Individual', 'Self-Employed']
  const shown = filter === 'All' ? ACCOUNTS : ACCOUNTS.filter(a => a.group === filter)

  return (
    <div style={{ paddingBottom: 8 }}>
      <div style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.65, padding: '12px 16px 8px' }}>
        Retirement and investment accounts are the most powerful wealth-building tools available. Each account has unique tax rules — knowing the differences can save you tens of thousands over a lifetime.
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 6, padding: '0 16px 10px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {groups.map(g => (
          <button key={g} onClick={() => { setFilter(g); setOpen(null) }} style={{
            padding: '6px 12px', borderRadius: 99, whiteSpace: 'nowrap', flexShrink: 0,
            border: `1.5px solid ${filter === g ? C.teal : C.b2}`,
            background: filter === g ? `${C.teal}18` : C.raise,
            color: filter === g ? C.teal : C.t3,
            fontFamily: UI, fontSize: 11, fontWeight: filter === g ? 700 : 500, cursor: 'pointer',
          }}>{g}</button>
        ))}
      </div>

      {/* Accordion */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {shown.map(a => {
          const isOpen = open === a.key
          return (
            <div key={a.key} style={{ border: `1.5px solid ${isOpen ? a.color + '50' : C.b1}`, borderRadius: 14, overflow: 'hidden' }}>
              {/* Header */}
              <button onClick={() => setOpen(isOpen ? null : a.key)} style={{
                width: '100%', background: isOpen ? `${a.color}08` : C.surf, border: 'none',
                cursor: 'pointer', textAlign: 'left', padding: '12px 14px',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: DISPLAY, fontSize: 14, fontWeight: 700, color: C.t1 }}>{a.name}</span>
                    <span style={{ background: `${a.color}18`, border: `1px solid ${a.color}35`, borderRadius: 99, padding: '2px 7px', fontFamily: UI, fontSize: 9, fontWeight: 700, color: a.color, textTransform: 'uppercase' }}>{a.tax.split('→')[0].trim()}</span>
                    <span style={{ background: `${GROUP_COLORS[a.group] || C.t3}12`, border: `1px solid ${GROUP_COLORS[a.group] || C.t3}25`, borderRadius: 99, padding: '2px 6px', fontFamily: UI, fontSize: 8, fontWeight: 600, color: GROUP_COLORS[a.group] || C.t3, textTransform: 'uppercase' }}>{a.group}</span>
                  </div>
                  <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, lineHeight: 1.4 }}>{a.limit}</div>
                </div>
                {isOpen ? <ChevronUp size={15} color={a.color} /> : <ChevronDown size={15} color={C.t3} />}
              </button>

              {/* Expanded */}
              {isOpen && (
                <div style={{ borderTop: `1px solid ${a.color}20`, padding: '14px', background: C.surf }}>
                  {/* Highlight */}
                  <div style={{ display: 'flex', gap: 8, padding: '8px 10px', background: `${a.color}12`, border: `1px solid ${a.color}30`, borderRadius: 9, marginBottom: 12 }}>
                    <Info size={12} color={a.color} style={{ flexShrink: 0, marginTop: 2 }} />
                    <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 600, color: C.t1, lineHeight: 1.55 }}>{a.highlight}</div>
                  </div>

                  {/* Tax Treatment */}
                  <div style={{ fontFamily: UI, fontSize: 9, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Tax Treatment</div>
                  <div style={{ fontFamily: UI, fontSize: 11, color: C.t1, lineHeight: 1.5, marginBottom: 12, padding: '8px 12px', background: C.raise, borderRadius: 9, border: `1px solid ${C.b1}` }}>{a.tax}</div>

                  {/* Rules grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                    {[
                      ['Income / Eligibility', a.incomeLimit, a.color],
                      ['RMD Rules', a.rmd, '#f59e0b'],
                      ['Early Withdrawal', a.earlyPenalty, '#ef4444'],
                      ['Best Assets Here', a.bestAssets, '#22c55e'],
                    ].map(([l, v, c]) => (
                      <div key={l} style={{ padding: '10px 11px', background: C.raise, borderRadius: 10, border: `1px solid ${C.b1}` }}>
                        <div style={{ fontFamily: UI, fontSize: 8, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: c, marginBottom: 4 }}>{l}</div>
                        <div style={{ fontFamily: UI, fontSize: 10.5, fontWeight: 500, color: C.t1, lineHeight: 1.55 }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Why hold these assets */}
                  <div style={{ padding: '10px 12px', background: `${a.color}10`, border: `1px solid ${a.color}28`, borderRadius: 10, marginBottom: 12 }}>
                    <div style={{ fontFamily: UI, fontSize: 8, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: a.color, marginBottom: 4 }}>Why Hold These Assets Here?</div>
                    <div style={{ fontFamily: UI, fontSize: 11, color: C.t1, lineHeight: 1.6 }}>{a.rationale}</div>
                  </div>

                  {/* Best for */}
                  <div style={{ display: 'flex', gap: 7, padding: '9px 12px', background: `${C.teal}10`, border: `1px solid ${C.teal}30`, borderRadius: 10, marginBottom: 12 }}>
                    <CheckCircle2 size={12} color={C.teal} style={{ flexShrink: 0, marginTop: 2 }} />
                    <div style={{ fontFamily: UI, fontSize: 11 }}>
                      <span style={{ fontWeight: 700, color: C.t1 }}>Best for: </span>
                      <span style={{ color: C.t1 }}>{a.bestFor}</span>
                    </div>
                  </div>

                  {/* Pro Tips */}
                  <div style={{ fontFamily: UI, fontSize: 8, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.t3, marginBottom: 8 }}>Pro Tips</div>
                  {a.proTips.map((tip, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: a.color, flexShrink: 0, marginTop: 5 }} />
                      <div style={{ fontFamily: UI, fontSize: 11.5, color: C.t1, lineHeight: 1.6 }}>{tip}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Funding Waterfall ───────────────────────────────────────── */
const WATERFALL = [
  { n: 1, title: 'Capture the full employer 401(k) match', badge: 'Always first', color: '#22c55e', desc: 'A 50–100% instant return on your contribution. No investment beats free money. If your employer matches 4%, contribute at least 4%.' },
  { n: 2, title: 'Max your HSA (if you have an HDHP)',    badge: 'Triple tax win', color: '#8b5cf6', desc: 'Triple tax advantage: pre-tax in, tax-free growth, tax-free out for medical. After 65 it works like a Traditional IRA. Invest the balance.' },
  { n: 3, title: 'Max your Roth IRA',                     badge: '$7,500/yr',     color: C.teal,    desc: 'Tax-free growth forever, no RMDs, and you can withdraw contributions anytime. Backdoor Roth if you earn too much.' },
  { n: 4, title: 'Maximize your 401(k)',                   badge: '$24,500/yr',    color: '#3b82f6', desc: 'After maxing the Roth IRA, go back and max the 401(k). Whether Traditional or Roth depends on your current vs future tax situation.' },
  { n: 5, title: 'Taxable brokerage account',              badge: 'No limit',      color: C.t3,      desc: 'No tax advantages, but no restrictions either. Use tax-efficient index ETFs, harvest losses strategically, hold for LTCG rates.' },
]

function FundingWaterfall() {
  return (
    <div style={{ paddingBottom: 8 }}>
      <div style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.65, padding: '12px 16px 8px' }}>
        When you have money to invest, <em>where</em> you put it matters as much as <em>how much</em>. Follow this priority order to maximize every tax advantage before moving to the next step.
      </div>
      <div style={{ padding: '0 16px' }}>
        <MCard>
          {WATERFALL.map((s, i) => (
            <div key={s.n} style={{ display: 'flex', gap: 14, paddingBottom: i < WATERFALL.length - 1 ? 0 : 0, position: 'relative' }}>
              {/* Connector line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 36, flexShrink: 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                  <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 800, color: '#1a1410' }}>{s.n}</span>
                </div>
                {i < WATERFALL.length - 1 && (
                  <div style={{ width: 2, flex: 1, background: `linear-gradient(${s.color}, ${WATERFALL[i + 1].color})`, minHeight: 20, margin: '3px 0' }} />
                )}
              </div>
              {/* Content */}
              <div style={{ flex: 1, paddingBottom: i < WATERFALL.length - 1 ? 12 : 0, paddingTop: 4 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: C.t1 }}>{s.title}</span>
                  <span style={{ background: `${s.color}18`, border: `1px solid ${s.color}35`, borderRadius: 99, padding: '2px 7px', fontFamily: UI, fontSize: 9, fontWeight: 700, color: s.color, whiteSpace: 'nowrap' }}>{s.badge}</span>
                </div>
                <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </MCard>
      </div>
    </div>
  )
}

/* ─── Asset Classes ───────────────────────────────────────────── */
const ASSETS = [
  { name: 'Stocks (Equities)', risk: 'High', ret: '7–10% historical avg', color: C.teal, desc: 'Ownership shares in a company. Highest long-term return potential but most volatile. Best held in diversified funds, not individual picks.', examples: 'S&P 500 index funds, growth ETFs, dividend stocks', tip: 'Over any 20-year period in history, the S&P 500 has never lost money.' },
  { name: 'Bonds (Fixed Income)', risk: 'Low–Medium', ret: '2–5%', color: '#3b82f6', desc: 'Loans to governments or corporations that pay regular interest. Lower returns than stocks but provide stability and income. Critical for retirees.', examples: 'US Treasury bonds, municipal bonds, BND, AGG', tip: 'When interest rates rise, bond prices fall — and vice versa. Duration risk matters.' },
  { name: 'ETFs (Exchange-Traded Funds)', risk: 'Varies', ret: 'Mirrors underlying index', color: '#8b5cf6', desc: 'Baskets of securities that trade like stocks. Usually track an index (S&P 500, total market, bonds). Low costs, instant diversification, tax-efficient.', examples: 'VTI, VOO, BND, QQQ, SPY', tip: 'A single total market ETF (like VTI) gives you 3,700+ stocks in one trade for 0.03%/year.' },
  { name: 'Mutual Funds', risk: 'Varies', ret: 'Varies by type', color: '#f59e0b', desc: 'Pooled investment vehicles priced once per day at close. Most are actively managed — evidence shows most underperform index funds over time.', examples: 'Fidelity 500 Index Fund (FXAIX), American Funds', tip: 'Check the expense ratio. A 1% fund costs 10x more than a 0.1% index fund over 30 years.' },
  { name: 'REITs', risk: 'Medium–High', ret: '5–8%', color: '#ef4444', desc: 'Companies that own income-producing real estate. Must distribute 90%+ of taxable income as dividends. Provides real estate exposure without buying property.', examples: 'VNQ (Vanguard REIT ETF), O (Realty Income)', tip: 'REITs often generate ordinary income dividends — best held in tax-advantaged accounts.' },
]

function AssetClasses() {
  const [open, setOpen] = useState(null)

  return (
    <div style={{ paddingBottom: 8 }}>
      <div style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.65, padding: '12px 16px 8px' }}>
        When you invest, you're buying one of these underlying asset types. Each has a different risk/return profile. Most portfolios combine multiple asset classes.
      </div>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {ASSETS.map((a, i) => {
          const isOpen = open === i
          return (
            <div key={i} style={{ border: `1.5px solid ${isOpen ? a.color + '50' : C.b1}`, borderRadius: 14, overflow: 'hidden' }}>
              <button onClick={() => setOpen(isOpen ? null : i)} style={{ width: '100%', background: isOpen ? `${a.color}10` : C.surf, border: 'none', cursor: 'pointer', textAlign: 'left', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: DISPLAY, fontSize: 14, fontWeight: 700, color: C.t1, marginBottom: 3 }}>{a.name}</div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <span style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>Risk: <strong style={{ color: a.risk === 'Low–Medium' ? '#22c55e' : a.risk === 'Medium–High' ? '#f59e0b' : a.risk === 'High' ? '#ef4444' : C.t2 }}>{a.risk}</strong></span>
                    <span style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>· Avg Return: <strong style={{ color: C.t1 }}>{a.ret}</strong></span>
                  </div>
                </div>
                {isOpen ? <ChevronUp size={15} color={a.color} /> : <ChevronDown size={15} color={C.t3} />}
              </button>
              {isOpen && (
                <div style={{ borderTop: `1px solid ${C.b1}`, padding: '14px', background: C.surf }}>
                  <div style={{ fontFamily: UI, fontSize: 12.5, color: C.t1, lineHeight: 1.65, marginBottom: 10 }}>{a.desc}</div>
                  <div style={{ fontFamily: UI, fontSize: 11.5, color: C.t1, marginBottom: 12 }}>
                    <strong style={{ color: C.t2 }}>Examples:</strong> {a.examples}
                  </div>
                  <div style={{ display: 'flex', gap: 8, padding: '9px 12px', background: `${a.color}12`, border: `1px solid ${a.color}28`, borderRadius: 10 }}>
                    <Info size={12} color={a.color} style={{ flexShrink: 0, marginTop: 2 }} />
                    <div style={{ fontFamily: UI, fontSize: 11.5, color: C.t1, lineHeight: 1.6 }}><strong>Key insight:</strong> {a.tip}</div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Risk Quiz ───────────────────────────────────────────────── */
const QUIZ = [
  {
    q: 'When do you expect to need this money?',
    opts: [{ label: 'Within 5 years', pts: 0 }, { label: '5–10 years', pts: 2 }, { label: '10–20 years', pts: 4 }, { label: '20+ years', pts: 6 }],
  },
  {
    q: 'If your portfolio dropped 30%, you would:',
    opts: [{ label: 'Sell — I can\'t handle that loss', pts: 0 }, { label: 'Worry a lot, but hold', pts: 2 }, { label: 'Stay the course calmly', pts: 4 }, { label: 'Buy more — great opportunity', pts: 6 }],
  },
  {
    q: 'Your primary investment goal is:',
    opts: [{ label: 'Preserve my capital — safety first', pts: 0 }, { label: 'Modest growth with limited downside', pts: 2 }, { label: 'Strong growth — I can handle volatility', pts: 4 }],
  },
  {
    q: 'Your investment experience level:',
    opts: [{ label: 'None — just starting out', pts: 0 }, { label: 'Some — I understand basics', pts: 1 }, { label: 'Experienced — comfortable with markets', pts: 2 }],
  },
]

const ALLOCATIONS = [
  { label: 'Conservative',          range: [0, 5],   color: '#3b82f6', stocks: 25, bonds: 55, cash: 20, desc: 'Prioritizes stability over growth. Suitable for short time horizons or very low risk tolerance.' },
  { label: 'Moderately Conservative', range: [6, 8],  color: '#8b5cf6', stocks: 45, bonds: 45, cash: 10, desc: 'Some growth with significant downside protection. Good for 5–10 year horizons.' },
  { label: 'Moderate',              range: [9, 12],  color: C.teal,    stocks: 60, bonds: 35, cash: 5,  desc: 'Balanced between growth and stability. The classic 60/40 portfolio.' },
  { label: 'Moderately Aggressive', range: [13, 15], color: '#f59e0b', stocks: 75, bonds: 20, cash: 5,  desc: 'Growth-oriented with some ballast. Good for 10–20 year horizons.' },
  { label: 'Aggressive',            range: [16, 20], color: '#22c55e', stocks: 90, bonds: 7,  cash: 3,  desc: 'Maximum growth focus. Suitable for 20+ year horizons and investors who won\'t panic during crashes.' },
]

function RiskQuiz() {
  const [answers, setAnswers] = useState({})
  const [done, setDone] = useState(false)

  const total = Object.values(answers).reduce((s, v) => s + v, 0)
  const alloc = done ? (ALLOCATIONS.find(a => total >= a.range[0] && total <= a.range[1]) || ALLOCATIONS[2]) : null

  const pieData = alloc ? [
    { name: 'Stocks', value: alloc.stocks, color: alloc.color },
    { name: 'Bonds',  value: alloc.bonds,  color: '#3b82f6' },
    { name: 'Cash',   value: alloc.cash,   color: '#94a3b8' },
  ] : []

  function pick(qi, pts) {
    const updated = { ...answers, [qi]: pts }
    setAnswers(updated)
    if (Object.keys(updated).length === QUIZ.length) setDone(true)
  }

  function reset() { setAnswers({}); setDone(false) }

  return (
    <div style={{ padding: '0 16px', paddingBottom: 16 }}>
      <MCard>
        <div style={{ fontFamily: DISPLAY, fontSize: 15, fontWeight: 700, color: C.t1, marginBottom: 4 }}>Risk Tolerance Quiz</div>
        <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.5, marginBottom: 14 }}>Answer 4 questions to get a personalized asset allocation suggestion.</div>

        {!done ? (
          QUIZ.map((q, qi) => (
            <div key={qi} style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1, marginBottom: 8 }}>{qi + 1}. {q.q}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {q.opts.map((o, oi) => {
                  const sel = answers[qi] === o.pts
                  return (
                    <button key={oi} onClick={() => pick(qi, o.pts)} style={{
                      padding: '9px 12px', background: sel ? `${C.teal}10` : C.raise,
                      border: `1.5px solid ${sel ? C.teal : C.b2}`, borderRadius: 9,
                      cursor: 'pointer', textAlign: 'left', fontFamily: UI, fontSize: 12,
                      fontWeight: sel ? 600 : 400, color: sel ? C.teal : C.t1,
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                      {sel && <CheckCircle2 size={13} color={C.teal} />}
                      {o.label}
                    </button>
                  )
                })}
              </div>
            </div>
          ))
        ) : (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <div style={{ fontFamily: UI, fontSize: 9, fontWeight: 700, color: C.t3, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Suggested Allocation</div>
              <div style={{ fontFamily: DISPLAY, fontSize: 20, fontWeight: 700, color: alloc.color, marginBottom: 4 }}>{alloc.label}</div>
              <div style={{ fontFamily: UI, fontSize: 12, color: C.t3, lineHeight: 1.6 }}>{alloc.desc}</div>
            </div>

            <div style={{ height: 180, marginBottom: 12 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                    {pieData.map((d, i) => <Cell key={i} fill={d.color} stroke="none" />)}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: UI }} formatter={v => <span style={{ color: C.t1 }}>{v}</span>} />
                  <Tooltip formatter={(v, n) => [`${v}%`, n]} contentStyle={{ background: C.raise, border: `1px solid ${C.b2}`, borderRadius: 8, fontFamily: UI, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
              {pieData.map((d, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '8px', background: `${d.color}10`, border: `1px solid ${d.color}25`, borderRadius: 10 }}>
                  <div style={{ fontFamily: DISPLAY, fontSize: 18, fontWeight: 700, color: d.color }}>{d.value}%</div>
                  <div style={{ fontFamily: UI, fontSize: 10, color: C.t3 }}>{d.name}</div>
                </div>
              ))}
            </div>

            <div style={{ background: `${C.teal}0d`, border: `1px solid ${C.tealBdr}`, borderRadius: 8, padding: '8px 10px', marginBottom: 10 }}>
              <div style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.6 }}>This is a starting point, not a prescription. Revisit your allocation annually and as your life changes. Gradually shift to more bonds as you approach retirement.</div>
            </div>

            <button onClick={reset} style={{ display: 'block', width: '100%', padding: '9px', background: 'none', border: `1px solid ${C.b2}`, borderRadius: 9, cursor: 'pointer', fontFamily: UI, fontSize: 12, color: C.t3 }}>
              Retake quiz
            </button>
          </div>
        )}
      </MCard>
    </div>
  )
}

/* ─── Compound Calculator ─────────────────────────────────────── */
function buildGrowthData(initial, monthly, rate, years) {
  const r = rate / 100 / 12
  const data = [{ year: 0, balance: Math.round(initial), contributed: Math.round(initial), growth: 0 }]
  let bal = initial, contributed = initial
  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) { bal = bal * (1 + r) + monthly; contributed += monthly }
    data.push({ year: y, balance: Math.round(bal), contributed: Math.round(contributed), growth: Math.round(bal - contributed) })
  }
  return data
}

function CompoundCalc() {
  const [initial, setInitial] = useState(10000)
  const [monthly, setMonthly] = useState(500)
  const [rate,    setRate]    = useState(7)
  const [years,   setYears]   = useState(30)

  const data   = useMemo(() => buildGrowthData(initial, monthly, rate, years), [initial, monthly, rate, years])
  const final  = data[data.length - 1]

  return (
    <div style={{ padding: '0 16px', paddingBottom: 16 }}>
      <MCard>
        <div style={{ fontFamily: DISPLAY, fontSize: 15, fontWeight: 700, color: C.t1, marginBottom: 4 }}>Compound Interest Calculator</div>
        <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.5, marginBottom: 14 }}>See how initial investment + monthly contributions grow over time.</div>

        {/* Results */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
          {[
            ['Final Balance',    fmtK(final.balance),     C.teal],
            ['Total Contributed', fmtK(final.contributed), C.t1],
            ['Investment Growth', fmtK(final.growth),      '#22c55e'],
          ].map(([l, v, c]) => (
            <div key={l} style={{ textAlign: 'center', padding: '10px 6px', background: `${c}09`, border: `1px solid ${c}25`, borderRadius: 10 }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 15, fontWeight: 700, color: c }}>{v}</div>
              <div style={{ fontFamily: UI, fontSize: 9, color: C.t3 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{ height: 180, marginBottom: 14 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.teal} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.teal} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="conGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.t1} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={C.t1} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" tick={{ fontSize: 9, fill: C.t3, fontFamily: MONO }} tickFormatter={v => `Yr ${v}`} interval={Math.floor(years / 5)} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: C.t3, fontFamily: MONO }} tickFormatter={v => fmtK(v)} width={46} axisLine={false} tickLine={false} />
              <Tooltip formatter={v => fmt(v)} contentStyle={{ background: C.raise, border: `1px solid ${C.b2}`, borderRadius: 8, fontFamily: UI, fontSize: 11 }} />
              <Area type="monotone" dataKey="contributed" name="Contributed" stroke={C.t1} strokeWidth={1.5} fill="url(#conGrad)" strokeDasharray="4 2" dot={false} />
              <Area type="monotone" dataKey="balance"     name="Balance"     stroke={C.teal} strokeWidth={2}   fill="url(#balGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sliders */}
        {[
          { l: 'Initial Investment', v: initial, set: setInitial, min: 0, max: 100000, step: 1000, d: `$${initial.toLocaleString()}` },
          { l: 'Monthly Contribution', v: monthly, set: setMonthly, min: 0, max: 5000, step: 50, d: `$${monthly.toLocaleString()}` },
          { l: 'Annual Return', v: rate, set: setRate, min: 1, max: 15, step: 0.5, d: `${rate}%` },
          { l: 'Years', v: years, set: setYears, min: 1, max: 50, step: 1, d: `${years} yr` },
        ].map(({ l, v, set: sv, min, max, step, d }) => (
          <div key={l} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontFamily: UI, fontSize: 12, color: C.t2, fontWeight: 600 }}>{l}</span>
              <span style={{ fontFamily: MONO, fontSize: 13, color: C.indigo, fontWeight: 700 }}>{d}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={v} onChange={e => sv(+e.target.value)} style={{ width: '100%', accentColor: C.indigo }} />
          </div>
        ))}

        <div style={{ background: `${C.teal}0d`, border: `1px solid ${C.tealBdr}`, borderRadius: 8, padding: '8px 10px', marginTop: 4 }}>
          <div style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.6 }}>The gap between what you contribute (dashed) and your balance (solid) is the power of compounding. The longer you wait to start, the harder it is to catch up.</div>
        </div>
      </MCard>
    </div>
  )
}

/* ─── Fee Impact Calculator ───────────────────────────────────── */
const FEE_LEVELS = [
  { fee: 0.03, label: '0.03% — Index ETF', color: '#22c55e' },
  { fee: 0.5,  label: '0.50% — Low-cost fund', color: C.teal },
  { fee: 1.0,  label: '1.00% — Typical active', color: '#f59e0b' },
  { fee: 2.0,  label: '2.00% — High-fee advisor', color: '#ef4444' },
]

function FeeCalc() {
  const [initial, setInitial] = useState(50000)
  const [monthly, setMonthly] = useState(500)
  const [gross,   setGross]   = useState(8)
  const [years,   setYears]   = useState(30)

  const data = useMemo(() => Array.from({ length: years + 1 }, (_, y) => {
    const point = { year: y }
    FEE_LEVELS.forEach(fl => {
      const r = (gross - fl.fee) / 100 / 12
      let bal = initial
      for (let m = 0; m < y * 12; m++) bal = bal * (1 + r) + monthly
      point[`f${fl.fee}`] = Math.round(bal)
    })
    return point
  }), [initial, monthly, gross, years])

  const final = data[data.length - 1]
  const best  = final[`f${FEE_LEVELS[0].fee}`]
  const worst = final[`f${FEE_LEVELS[FEE_LEVELS.length - 1].fee}`]
  const drag  = best - worst

  return (
    <div style={{ padding: '0 16px', paddingBottom: 16 }}>
      <MCard>
        <div style={{ fontFamily: DISPLAY, fontSize: 15, fontWeight: 700, color: C.t1, marginBottom: 4 }}>Fee Impact Calculator</div>
        <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.5, marginBottom: 14 }}>Fees are silent killers of long-term wealth. See how 0.03% vs 2% expense ratios compound against you over decades.</div>

        {/* Results grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          {FEE_LEVELS.map(fl => (
            <div key={fl.fee} style={{ padding: '8px 10px', background: `${fl.color}0d`, border: `1px solid ${fl.color}25`, borderRadius: 9 }}>
              <div style={{ fontFamily: UI, fontSize: 9, color: C.t3, marginBottom: 2 }}>{fl.label}</div>
              <div style={{ fontFamily: DISPLAY, fontSize: 16, fontWeight: 700, color: fl.color }}>{fmtK(final[`f${fl.fee}`])}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{ height: 180, marginBottom: 14 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <XAxis dataKey="year" tick={{ fontSize: 9, fill: C.t3, fontFamily: MONO }} tickFormatter={v => `Yr ${v}`} interval={Math.floor(years / 5)} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: C.t3, fontFamily: MONO }} tickFormatter={v => fmtK(v)} width={46} axisLine={false} tickLine={false} />
              <Tooltip formatter={v => fmt(v)} contentStyle={{ background: C.raise, border: `1px solid ${C.b2}`, borderRadius: 8, fontFamily: UI, fontSize: 11 }} />
              {FEE_LEVELS.map(fl => (
                <Line key={fl.fee} type="monotone" dataKey={`f${fl.fee}`} name={fl.label} stroke={fl.color} strokeWidth={fl.fee === 0.03 ? 2.5 : 1.5} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sliders */}
        {[
          { l: 'Starting Balance', v: initial, set: setInitial, min: 0, max: 200000, step: 5000, d: `$${initial.toLocaleString()}` },
          { l: 'Monthly Contribution', v: monthly, set: setMonthly, min: 0, max: 5000, step: 50, d: `$${monthly.toLocaleString()}` },
          { l: 'Gross Annual Return', v: gross, set: setGross, min: 4, max: 12, step: 0.5, d: `${gross}%` },
          { l: 'Years', v: years, set: setYears, min: 5, max: 40, step: 1, d: `${years} yr` },
        ].map(({ l, v, set: sv, min, max, step, d }) => (
          <div key={l} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontFamily: UI, fontSize: 12, color: C.t2, fontWeight: 600 }}>{l}</span>
              <span style={{ fontFamily: MONO, fontSize: 13, color: C.indigo, fontWeight: 700 }}>{d}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={v} onChange={e => sv(+e.target.value)} style={{ width: '100%', accentColor: C.indigo }} />
          </div>
        ))}

        <div style={{ padding: '10px 12px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10 }}>
          <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65 }}>
            Over {years} years, paying <strong>2% vs 0.03%</strong> in fees costs you <strong style={{ color: '#ef4444' }}>{fmtK(drag)}</strong> in lost returns. Fees are the only investment variable you control completely — minimize them relentlessly.
          </div>
        </div>
      </MCard>
    </div>
  )
}

/* ─── Roth vs Traditional ─────────────────────────────────────── */
const BRACKETS = [10, 12, 22, 24, 32, 35, 37]

function RothVsTraditional() {
  const [invest,    setInvest]    = useState(7000)
  const [years,     setYears]     = useState(25)
  const [nowBracket, setNow]      = useState(22)
  const [retBracket, setRet]      = useState(22)
  const [returnPct, setReturnPct] = useState(7)

  const growth       = Math.pow(1 + returnPct / 100, years)
  const traditional  = invest * growth * (1 - retBracket / 100)
  const roth         = invest * (1 - nowBracket / 100) * growth
  const rothBetter   = roth > traditional
  const diff         = Math.abs(traditional - roth)

  const selectStyle = {
    width: '100%', padding: '9px 10px', border: `1.5px solid ${C.b2}`,
    borderRadius: 8, fontSize: 13, color: C.t1, fontFamily: UI,
    background: C.raise, fontWeight: 600,
  }

  return (
    <div style={{ padding: '0 16px', paddingBottom: 16 }}>
      <MCard>
        <div style={{ fontFamily: DISPLAY, fontSize: 15, fontWeight: 700, color: C.t1, marginBottom: 4 }}>Roth vs Traditional IRA</div>
        <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.5, marginBottom: 14 }}>Which gives you more money after tax? It depends on your current vs expected future tax bracket.</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 600, color: C.t2, marginBottom: 4 }}>Current Tax Bracket</div>
            <select value={nowBracket} onChange={e => setNow(Number(e.target.value))} style={selectStyle}>
              {BRACKETS.map(b => <option key={b} value={b}>{b}%</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 600, color: C.t2, marginBottom: 4 }}>Retirement Bracket</div>
            <select value={retBracket} onChange={e => setRet(Number(e.target.value))} style={selectStyle}>
              {BRACKETS.map(b => <option key={b} value={b}>{b}%</option>)}
            </select>
          </div>
        </div>

        {[
          { l: 'Annual Contribution', v: invest, set: setInvest, min: 0, max: 30000, step: 500, d: `$${invest.toLocaleString()}` },
          { l: 'Investment Return', v: returnPct, set: setReturnPct, min: 3, max: 12, step: 0.5, d: `${returnPct}%` },
          { l: 'Years Until Retirement', v: years, set: setYears, min: 5, max: 40, step: 1, d: `${years} yr` },
        ].map(({ l, v, set: sv, min, max, step, d }) => (
          <div key={l} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontFamily: UI, fontSize: 12, color: C.t2, fontWeight: 600 }}>{l}</span>
              <span style={{ fontFamily: MONO, fontSize: 13, color: C.indigo, fontWeight: 700 }}>{d}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={v} onChange={e => sv(+e.target.value)} style={{ width: '100%', accentColor: C.indigo }} />
          </div>
        ))}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          {[
            { label: 'Traditional IRA', sub: 'Taxed at withdrawal', value: traditional, color: '#22c55e', better: !rothBetter },
            { label: 'Roth IRA',        sub: 'Tax-free at withdrawal', value: roth, color: C.teal, better: rothBetter },
          ].map(s => (
            <div key={s.label} style={{ padding: '12px', background: s.better ? `${s.color}0d` : C.raise, border: `1.5px solid ${s.better ? s.color + '40' : C.b2}`, borderRadius: 12 }}>
              <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: s.better ? s.color : C.t3, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
                {s.label} {s.better && '✓'}
              </div>
              <div style={{ fontFamily: UI, fontSize: 10, color: C.t3, marginBottom: 6 }}>{s.sub}</div>
              <div style={{ fontFamily: DISPLAY, fontSize: 18, fontWeight: 700, color: s.better ? s.color : C.t1 }}>{fmtK(s.value)}</div>
              <div style={{ fontFamily: UI, fontSize: 9, color: C.t3 }}>after-tax at retirement</div>
            </div>
          ))}
        </div>

        <div style={{ padding: '10px 12px', background: rothBetter ? `${C.teal}09` : 'rgba(34,197,94,0.07)', border: `1px solid ${rothBetter ? C.teal + '30' : '#22c55e30'}`, borderRadius: 10 }}>
          <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65 }}>
            With your current ({nowBracket}%) vs retirement ({retBracket}%) brackets, the <strong style={{ color: rothBetter ? C.teal : '#22c55e' }}>{rothBetter ? 'Roth' : 'Traditional'} IRA</strong> gives you <strong>{fmtK(diff)} more</strong> after tax over {years} years.
            {nowBracket === retBracket && ' When brackets are equal, Roth is generally preferred for its flexibility and no RMD requirement.'}
          </div>
        </div>
      </MCard>
    </div>
  )
}

/* ─── Resources ───────────────────────────────────────────────── */
const BROKERS = [
  { name: 'Vanguard',       badge: 'Best for index funds',     badgeColor: '#22c55e', desc: 'The original low-cost index fund company invented by Jack Bogle. Customer-owned structure — costs stay razor thin. The gold standard for long-term investors.', cost: 'No minimums for most ETFs; mutual funds from $1,000', best: 'Long-term, buy-and-hold index investors' },
  { name: 'Fidelity',       badge: 'Best overall broker',      badgeColor: C.teal,    desc: 'Zero-fee index funds (FZROX, FZILX), $0 commissions, fractional shares, and excellent research tools. No account minimums. Best all-around brokerage for most people.', cost: '$0 commissions, zero-fee index funds available', best: 'Most investors — especially beginners' },
  { name: 'Charles Schwab', badge: 'Best for full service',    badgeColor: '#3b82f6', desc: '$0 commissions, fractional shares, excellent customer service, and full banking suite. Schwab Index Funds rival Vanguard on cost. Also owns thinkorswim trading platform.', cost: '$0 commissions; ETFs from $1', best: 'Investors who also want banking services' },
  { name: 'Betterment',     badge: 'Best robo-advisor',        badgeColor: '#8b5cf6', desc: 'Automated investing using low-cost ETFs. Handles asset allocation, rebalancing, and tax-loss harvesting automatically. Perfect for hands-off investors.', cost: '0.25%/yr (0.40% for premium with advisor)', best: 'Hands-off investors who want automation' },
  { name: 'M1 Finance',     badge: 'Best custom portfolios',   badgeColor: '#ef4444', desc: 'Build a custom "pie" portfolio of stocks and ETFs, then automate contributions into it. No management fee. Fractional shares.', cost: 'Free ($3/mo for M1 Plus)', best: 'DIY investors who want automation without losing control' },
]

function ResourcesSection() {
  return (
    <div style={{ paddingBottom: 8 }}>
      <div style={{ padding: '10px 16px', background: `${C.teal}0d`, border: `1px solid ${C.tealBdr}`, margin: '12px 16px 0', borderRadius: 12 }}>
        <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65 }}>
          <strong style={{ color: C.t1 }}>How to choose:</strong> For most investors, a simple 3-fund portfolio (US stocks, international stocks, bonds) at Fidelity or Vanguard beats 90% of actively managed strategies. Complexity is not sophistication.
        </div>
      </div>

      <MSectionHeader label="Brokerages & Platforms" />
      <div style={{ padding: '0 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {BROKERS.map(r => (
            <div key={r.name} style={{ background: C.surf, border: `1px solid ${C.b1}`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '12px 14px', borderBottom: `1px solid ${C.b1}`, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: DISPLAY, fontSize: 14, fontWeight: 700, color: C.t1 }}>{r.name}</span>
                <span style={{ background: `${r.badgeColor}15`, border: `1px solid ${r.badgeColor}35`, borderRadius: 99, padding: '2px 8px', fontFamily: UI, fontSize: 9, fontWeight: 700, color: r.badgeColor }}>{r.badge}</span>
              </div>
              <div style={{ padding: '10px 14px' }}>
                <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65, marginBottom: 8 }}>{r.desc}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '3px 10px', fontFamily: UI, fontSize: 11 }}>
                  <span style={{ color: C.t3, fontWeight: 600 }}>Cost</span><span style={{ color: C.t2 }}>{r.cost}</span>
                  <span style={{ color: C.t3, fontWeight: 600 }}>Best for</span><span style={{ color: C.t2 }}>{r.best}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Main Component ──────────────────────────────────────────── */
const LEARN_SUBS = [
  { key: 'accounts',  label: 'Accounts'   },
  { key: 'waterfall', label: 'Waterfall'  },
  { key: 'assets',    label: 'Asset Types' },
  { key: 'quiz',      label: 'Risk Quiz'  },
]

const CALC_SUBS = [
  { key: 'compound', label: 'Compound' },
  { key: 'fees',     label: 'Fee Impact' },
  { key: 'roth',     label: 'Roth vs Trad' },
]

export default function MInvesting() {
  const [tab,      setTab]      = useState('learn')
  const [learnSub, setLearnSub] = useState('accounts')
  const [calcSub,  setCalcSub]  = useState('compound')

  return (
    <div style={{ background: C.bg, minHeight: '100dvh', paddingBottom: 80 }}>
      <ScreenHeader title="Investing & Accounts" subtitle="Learn" accent={C.indigo} />

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
          {learnSub === 'accounts'  && <AccountMasterSection />}
          {learnSub === 'waterfall' && <FundingWaterfall />}
          {learnSub === 'assets'    && <AssetClasses />}
          {learnSub === 'quiz'      && <RiskQuiz />}
        </>
      )}

      {/* Calculate sub-tabs */}
      {tab === 'calculate' && (
        <>
          <div style={{ display: 'flex', gap: 6, padding: '10px 16px 0', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {CALC_SUBS.map(s => (
              <button key={s.key} onClick={() => setCalcSub(s.key)} style={{
                padding: '6px 12px', borderRadius: 99, whiteSpace: 'nowrap', flexShrink: 0,
                border: `1px solid ${calcSub === s.key ? C.indigo : C.b2}`,
                background: calcSub === s.key ? `${C.indigo}18` : C.raise,
                color: calcSub === s.key ? C.indigo : C.t3,
                fontFamily: UI, fontSize: 11, fontWeight: calcSub === s.key ? 700 : 500, cursor: 'pointer',
              }}>{s.label}</button>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            {calcSub === 'compound' && <CompoundCalc />}
            {calcSub === 'fees'     && <FeeCalc />}
            {calcSub === 'roth'     && <RothVsTraditional />}
          </div>
        </>
      )}

      {tab === 'resources' && <ResourcesSection />}
    </div>
  )
}
