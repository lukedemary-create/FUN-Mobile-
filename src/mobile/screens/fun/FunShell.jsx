import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Wallet, CreditCard, TrendingUp, PieChart, Shield, ScrollText,
  Clock, Home, Scale, CalendarDays, Baby, Receipt, BookOpen,
  GraduationCap, Calculator, Landmark, FileText,
  ChevronRight, BarChart2, Lightbulb, ChevronLeft,
} from 'lucide-react'
import { C, UI, MONO, DISPLAY } from '../../tokens'

// ── Rotating FUN Facts ─────────────────────────────────────────────────
const DAILY_FACTS = [
  { category: 'Compound Growth', value: '22×', fact: '$10,000 invested in the S&P 500 thirty years ago would be worth over $220,000 today — without adding a single dollar.' },
  { category: 'Opportunity Cost', value: '$1.8M', fact: 'The average American spends $18,000/year on non-essentials. Invested at 7%, that\'s $1.8 million foregone over 30 years.' },
  { category: 'Market Timing Risk', value: '~50%', fact: 'Missing just the 10 best market days in the last 30 years would have cut your returns nearly in half. Time in beats timing.' },
  { category: 'Expense Ratio Impact', value: '$147K', fact: 'A 1% fund fee on a $500,000 portfolio quietly costs you ~$147,000 in lost returns over 10 years.' },
  { category: 'Financial Literacy', value: '66%', fact: '2 out of 3 Americans cannot pass a basic financial literacy quiz. Knowledge is the single best investment you can make.' },
  { category: 'Rule of 72', value: '10.3 yrs', fact: 'At 7% annual return your money doubles every 10.3 years. At 10%, every 7.2 years. Time is the most powerful variable.' },
  { category: '401(k) Power', value: '$2.3M', fact: 'Maxing out a 401(k) at $23,000/year for 30 years at 7% returns builds $2.3 million — much of it tax-deferred.' },
  { category: 'Retirement Gap', value: '<$200K', fact: 'Most retirees need 70–90% of pre-retirement income. The median American retires with less than $200,000 saved.' },
  { category: 'Early Mortgage Payoff', value: '$118K', fact: 'Paying an extra $200/month on a $400,000 30-year mortgage saves over $118,000 in total interest.' },
  { category: 'Tax-Loss Harvesting', value: '+1.5%/yr', fact: 'Strategically harvesting tax losses can add 0.5–1.5% in after-tax returns annually — a free performance boost.' },
  { category: 'Lifetime Interest', value: '$524K', fact: 'The average American pays over $524,000 in interest over a lifetime across mortgages, auto loans, and credit cards.' },
  { category: 'Roth IRA Compounding', value: '$91K', fact: 'A single $6,000 Roth IRA contribution at age 22 grows to over $91,000 by retirement — completely tax-free.' },
  { category: '4% Withdrawal Rule', value: '4%', fact: 'Withdrawing just 4% of your portfolio annually at retirement has historically lasted 30+ years in nearly every market scenario.' },
  { category: 'Behavioral Finance', value: '−6.5%', fact: 'Frequent traders underperform buy-and-hold investors by 1.5–6.5% per year — emotion is the enemy of returns.' },
  { category: 'Cost of a Child', value: '$310K', fact: 'Raising one child to age 18 costs an average of $310,000 — before a single dollar of college tuition.' },
  { category: 'Asset Location', value: '+0.8%/yr', fact: 'Placing tax-inefficient assets in tax-advantaged accounts adds 0.2–0.8% in after-tax returns each year.' },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h >= 5  && h < 12) return 'Good morning'
  if (h >= 12 && h < 17) return 'Good afternoon'
  if (h >= 17 && h < 21) return 'Good evening'
  return 'Welcome back'
}

// ── Tab definitions ────────────────────────────────────────────────────
const TABS = ['Home', 'Learn', 'Plan']

// ── Learn modules ─────────────────────────────────────────────────────
const LEARN_GROUPS = [
  {
    label: 'FOUNDATIONS',
    items: [
      { path: '/fun/budgeting',      Icon: Wallet,       label: 'Budgeting & Foundations', sub: 'Build your financial base from scratch'       },
      { path: '/fun/debt',           Icon: CreditCard,   label: 'Debt & Credit',           sub: 'Credit scores, payoff strategy, and debt math' },
      { path: '/fun/investing',      Icon: TrendingUp,   label: 'Investing & Accounts',    sub: 'Markets, ETFs, and where to start'            },
      { path: '/fun/portfolio',      Icon: PieChart,     label: 'Portfolio Structure',     sub: 'Allocation, diversification, rebalancing'     },
    ],
  },
  {
    label: 'PROTECTION & LEGACY',
    items: [
      { path: '/fun/insurance',      Icon: Shield,       label: 'Insurance Planning',      sub: 'Life, health, disability — know what you need' },
      { path: '/fun/estate',         Icon: ScrollText,   label: 'Estate & Wills',          sub: 'Wills, trusts, and beneficiary planning'      },
    ],
  },
  {
    label: 'LONG-TERM PLANNING',
    items: [
      { path: '/fun/retirement',     Icon: Clock,        label: 'Retirement Planning',     sub: '401(k), IRA, Roth, pension — all of it'      },
      { path: '/fun/tax',            Icon: Receipt,      label: 'Tax Planning',            sub: 'Brackets, deductions, Roth vs. traditional'  },
    ],
  },
  {
    label: 'MAJOR DECISIONS',
    items: [
      { path: '/fun/purchases',      Icon: Home,         label: 'Major Purchases',         sub: 'Home buying, auto, mortgage affordability'   },
      { path: '/fun/buy-rent-lease', Icon: Scale,        label: 'Buy vs. Rent vs. Lease',  sub: 'Full financial comparison for big decisions'  },
    ],
  },
  {
    label: 'LIFE STAGES',
    items: [
      { path: '/fun/life-events',    Icon: CalendarDays, label: 'Life Events',             sub: 'Marriage, divorce, job change, inheritance'  },
      { path: '/fun/family',         Icon: Baby,         label: 'Family Planning',         sub: 'Kids, college savings, insurance needs'      },
    ],
  },
  {
    label: 'RESOURCES',
    items: [
      { path: '/fun/resources',      Icon: BookOpen,     label: 'Resources & Tools',       sub: 'Guides, glossary, links, and references'     },
      { path: '/fun/library',        Icon: GraduationCap,label: "Learner's Library",       sub: 'All topics organized in one place'           },
    ],
  },
]

// ── Planning tools ─────────────────────────────────────────────────────
const PLAN_GROUPS = [
  {
    label: 'BUDGETING & CASH FLOW',
    items: [
      { path: '/fun/budget-tool',      Icon: Wallet,     label: 'Budget Planner',           sub: 'Track income, expenses, and spending categories' },
      { path: '/fun/networth',         Icon: BarChart2,  label: 'Net Worth Tracker',         sub: 'Assets minus liabilities = your number'          },
    ],
  },
  {
    label: 'RETIREMENT & TAX',
    items: [
      { path: '/fun/retirement-tool',  Icon: Clock,      label: 'Retirement Calculator',    sub: 'Project your nest egg with real math'             },
      { path: '/fun/tax-tool',         Icon: Receipt,    label: 'Tax Planning Tool',        sub: '2026 brackets, deductions, optimization'          },
    ],
  },
  {
    label: 'PROTECTION',
    items: [
      { path: '/fun/life-insurance',   Icon: Shield,     label: 'Life Insurance Calculator', sub: 'How much coverage do you actually need?'         },
      { path: '/fun/social-security',  Icon: Landmark,   label: 'Social Security Planner',  sub: 'When to claim for maximum lifetime benefit'       },
    ],
  },
  {
    label: 'REAL ESTATE & FAMILY',
    items: [
      { path: '/fun/real-estate',      Icon: Home,       label: 'Real Estate Planning',     sub: 'Affordability, buy vs. rent, investment returns'  },
      { path: '/fun/family',           Icon: Baby,       label: 'Family Planning Tool',     sub: 'Children, 529 college savings, and family costs'  },
      { path: '/fun/estate-tool',      Icon: ScrollText, label: 'Estate Planning Tool',     sub: 'Wills, trusts, and wealth transfer strategy'      },
    ],
  },
  {
    label: 'CALCULATORS',
    items: [
      { path: '/fun/calculators',      Icon: Calculator, label: 'All Calculators (35+)',    sub: 'Compound growth, TVM, mortgage, and more'         },
    ],
  },
]

// ── Quick modules for Home tab ─────────────────────────────────────────
const QUICK_MODULES = [
  { path: '/fun/budgeting',  Icon: Wallet,      label: 'Budgeting',  color: C.indigo },
  { path: '/fun/investing',  Icon: TrendingUp,  label: 'Investing',  color: C.teal   },
  { path: '/fun/retirement', Icon: Clock,       label: 'Retirement', color: C.gold   },
  { path: '/fun/tax',        Icon: Receipt,     label: 'Tax',        color: C.indigo },
  { path: '/fun/debt',       Icon: CreditCard,  label: 'Debt',       color: C.teal   },
  { path: '/fun/estate',     Icon: ScrollText,  label: 'Estate',     color: C.gold   },
]

const SIX_PILLARS = [
  { Icon: Wallet,     label: 'Saving',     path: '/fun/budgeting',  color: C.indigo },
  { Icon: CreditCard, label: 'Debt',       path: '/fun/debt',       color: C.teal   },
  { Icon: TrendingUp, label: 'Investing',  path: '/fun/investing',  color: C.gold   },
  { Icon: Shield,     label: 'Protection', path: '/fun/insurance',  color: C.indigo },
  { Icon: Clock,      label: 'Retirement', path: '/fun/retirement', color: C.teal   },
  { Icon: ScrollText, label: 'Legacy',     path: '/fun/estate',     color: C.gold   },
]

// ── Welcome + Facts Banner ─────────────────────────────────────────────
function WelcomeBanner() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * DAILY_FACTS.length))

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % DAILY_FACTS.length), 9000)
    return () => clearInterval(t)
  }, [])

  const fact = DAILY_FACTS[idx]
  const catColors = {
    'Compound Growth': C.teal, 'Opportunity Cost': C.gold, 'Market Timing Risk': C.indigo,
    'Expense Ratio Impact': C.gold, 'Financial Literacy': C.indigo, 'Rule of 72': C.teal,
    '401(k) Power': C.gold, 'Retirement Gap': C.teal, 'Early Mortgage Payoff': C.indigo,
    'Tax-Loss Harvesting': C.gold, 'Lifetime Interest': C.teal, 'Roth IRA Compounding': C.indigo,
    '4% Withdrawal Rule': C.gold, 'Behavioral Finance': C.teal, 'Cost of a Child': C.indigo,
    'Asset Location': C.gold,
  }
  const accent = catColors[fact.category] || C.indigo

  return (
    <div style={{ padding: '16px 16px 0' }}>
      {/* Greeting */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: UI, fontSize: 12, color: C.t3, marginBottom: 2 }}>{getGreeting()}</div>
        <div style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 700, color: C.t1, lineHeight: 1.2 }}>
          Financial Understanding Network
        </div>
      </div>

      {/* Rotating FUN Fact Card */}
      <div style={{
        background: '#ffffff',
        border: `1px solid ${C.b1}`,
        borderRadius: 18,
        padding: '16px 16px 14px',
        boxShadow: '0 2px 12px rgba(26,20,16,0.07)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Accent top bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accent}, ${accent}88)`, borderRadius: '18px 18px 0 0' }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: `${accent}14`, border: `1px solid ${accent}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Lightbulb size={17} color={accent} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
              <span style={{ fontFamily: UI, fontSize: 9, fontWeight: 700, color: accent, letterSpacing: '0.12em', textTransform: 'uppercase' }}>FUN Fact</span>
              <span style={{ fontFamily: UI, fontSize: 9, color: C.t3, letterSpacing: '0.08em', textTransform: 'uppercase' }}>· {fact.category}</span>
            </div>
            <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 800, color: accent, lineHeight: 1, marginBottom: 6 }}>{fact.value}</div>
            <div style={{ fontFamily: UI, fontSize: 12.5, color: C.t2, lineHeight: 1.6 }}>{fact.fact}</div>
          </div>
        </div>

        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: 4, marginTop: 12, paddingLeft: 50 }}>
          {DAILY_FACTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width: i === idx ? 16 : 5, height: 5,
                borderRadius: 3, border: 'none', cursor: 'pointer', padding: 0,
                background: i === idx ? accent : C.b2,
                transition: 'all 0.25s',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────
function HomeTab({ nav }) {
  return (
    <div>
      {/* 6 Pillars */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: C.t3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>6 Pillars of Financial Health</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {SIX_PILLARS.map(({ Icon, label, path, color }) => (
            <div
              key={path}
              onClick={() => nav(path)}
              style={{
                background: '#ffffff', border: `1px solid ${C.b1}`,
                borderRadius: 14, padding: '14px 10px', cursor: 'pointer', textAlign: 'center',
                boxShadow: '0 1px 3px rgba(26,20,16,0.05)',
              }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                background: `${color}14`, border: `1px solid ${color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px',
              }}>
                <Icon size={15} color={color} />
              </div>
              <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 600, color: C.t1 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Jump Right In */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: C.t3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>Jump Right In</div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4, WebkitOverflowScrolling: 'touch' }}>
          {QUICK_MODULES.map(({ path, Icon, label, color }) => (
            <div
              key={path}
              onClick={() => nav(path)}
              style={{
                flexShrink: 0, width: 96, background: '#ffffff',
                border: `1px solid ${C.b1}`, borderRadius: 14,
                padding: '14px 10px', cursor: 'pointer', textAlign: 'center',
                boxShadow: '0 1px 3px rgba(26,20,16,0.05)',
              }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                background: `${color}14`, border: `1px solid ${color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px',
              }}>
                <Icon size={15} color={color} />
              </div>
              <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 600, color: C.t1 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Tools */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: C.t3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>Quick Tools</div>
        <div style={{ background: '#ffffff', border: `1px solid ${C.b1}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(26,20,16,0.06)' }}>
          {[
            { path: '/fun/budget-tool',     Icon: Wallet,     label: 'Budget Planner',        sub: 'Track your income & spending'    },
            { path: '/fun/networth',         Icon: BarChart2,  label: 'Net Worth Tracker',     sub: 'Know your number'                },
            { path: '/fun/retirement-tool',  Icon: Clock,      label: 'Retirement Calculator', sub: 'Project your future nest egg'    },
            { path: '/fun/calculators',      Icon: Calculator, label: 'All 35+ Calculators',   sub: 'Every financial calculation'     },
          ].map(({ path, Icon, label, sub }, i, arr) => (
            <div
              key={path}
              onClick={() => nav(path)}
              style={{
                display: 'flex', alignItems: 'center', padding: '13px 14px',
                borderBottom: i < arr.length - 1 ? `1px solid ${C.b1}` : 'none',
                cursor: 'pointer', gap: 10,
              }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                background: C.indigoDim, border: `1px solid ${C.indigoBdr}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={15} color={C.indigo} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 600, color: C.t1 }}>{label}</div>
                <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, marginTop: 1 }}>{sub}</div>
              </div>
              <ChevronRight size={14} color={C.t3} />
            </div>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['13', 'Modules'], ['35+', 'Calculators'], ['6', 'Pillars']].map(([v, l]) => (
            <div key={l} style={{
              flex: 1, textAlign: 'center', background: '#ffffff',
              border: `1px solid ${C.b1}`, borderRadius: 14,
              padding: '12px 6px', boxShadow: '0 1px 3px rgba(26,20,16,0.05)',
            }}>
              <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 800, color: C.indigo }}>{v}</div>
              <div style={{ fontFamily: UI, fontSize: 10, color: C.t3, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 16 }} />
    </div>
  )
}

function LearnTab({ nav }) {
  return (
    <div style={{ padding: '12px 0 16px' }}>
      {LEARN_GROUPS.map(({ label, items }) => (
        <div key={label}>
          <div style={{ padding: '14px 16px 6px', fontFamily: UI, fontSize: 9, fontWeight: 700, color: C.t3, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{label}</div>
          <div style={{ margin: '0 16px', background: '#ffffff', border: `1px solid ${C.b1}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(26,20,16,0.05)' }}>
            {items.map(({ path, Icon, label: l, sub }, i) => (
              <div
                key={path}
                onClick={() => nav(path)}
                style={{
                  display: 'flex', alignItems: 'center', padding: '13px 14px',
                  borderBottom: i < items.length - 1 ? `1px solid ${C.b1}` : 'none',
                  cursor: 'pointer', gap: 10,
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: C.indigoDim, border: `1px solid ${C.indigoBdr}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={15} color={C.indigo} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 600, color: C.t1 }}>{l}</div>
                  <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, marginTop: 1 }}>{sub}</div>
                </div>
                <ChevronRight size={14} color={C.t3} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function PlanTab({ nav }) {
  return (
    <div style={{ padding: '12px 0 16px' }}>
      {PLAN_GROUPS.map(({ label, items }) => (
        <div key={label}>
          <div style={{ padding: '14px 16px 6px', fontFamily: UI, fontSize: 9, fontWeight: 700, color: C.t3, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{label}</div>
          <div style={{ margin: '0 16px', background: '#ffffff', border: `1px solid ${C.b1}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(26,20,16,0.05)' }}>
            {items.map(({ path, Icon, label: l, sub }, i) => (
              <div
                key={path}
                onClick={() => nav(path)}
                style={{
                  display: 'flex', alignItems: 'center', padding: '13px 14px',
                  borderBottom: i < items.length - 1 ? `1px solid ${C.b1}` : 'none',
                  cursor: 'pointer', gap: 10,
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: C.indigoDim, border: `1px solid ${C.indigoBdr}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={15} color={C.indigo} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 600, color: C.t1 }}>{l}</div>
                  <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, marginTop: 1 }}>{sub}</div>
                </div>
                <ChevronRight size={14} color={C.t3} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Pill Tab Bar ───────────────────────────────────────────────────────
function PillTabs({ active, setActive }) {
  return (
    <div style={{ padding: '14px 16px 0' }}>
      <div style={{
        display: 'flex', background: C.raise,
        borderRadius: 12, padding: 3, gap: 2,
        border: `1px solid ${C.b1}`,
      }}>
        {TABS.map(tab => {
          const isActive = active === tab
          return (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              style={{
                flex: 1, padding: '9px 6px',
                background: isActive ? '#ffffff' : 'transparent',
                border: 'none', borderRadius: 9, cursor: 'pointer',
                fontFamily: UI, fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? C.t1 : C.t3,
                boxShadow: isActive ? '0 1px 4px rgba(26,20,16,0.10)' : 'none',
                transition: 'all 0.18s',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {tab}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Main Shell ─────────────────────────────────────────────────────────
export default function FunShell() {
  const [active, setActive] = useState('Home')
  const nav = useNavigate()

  return (
    <div style={{ background: C.bg, minHeight: '100dvh' }}>

      {/* Top safe area spacer */}
      <div style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 12px)' }} />

      {/* Welcome banner with rotating FUN fact */}
      <WelcomeBanner />

      {/* Pill tab switcher */}
      <PillTabs active={active} setActive={setActive} />

      {/* Tab content */}
      {active === 'Home'  && <HomeTab  nav={nav} />}
      {active === 'Learn' && <LearnTab nav={nav} />}
      {active === 'Plan'  && <PlanTab  nav={nav} />}

    </div>
  )
}
