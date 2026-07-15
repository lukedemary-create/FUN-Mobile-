import { useNavigate } from 'react-router-dom'
import {
  BookOpen, TrendingUp, CreditCard, Shield, FileText, Clock,
  Home, Users, Heart, BarChart2, Calculator, Library,
  CheckCircle, ChevronRight, Zap,
} from 'lucide-react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MSectionHeader } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'

const PILLARS = [
  { path: '/learn/budgeting',     Icon: BookOpen,   label: 'Budgeting',       sub: 'Foundations',         color: C.indigo, dim: C.indigoDim, bdr: C.indigoBdr },
  { path: '/learn/debt',          Icon: CreditCard, label: 'Debt & Credit',   sub: 'Score & payoff',      color: C.gold,   dim: C.goldDim,   bdr: C.goldBdr   },
  { path: '/learn/investing',     Icon: TrendingUp, label: 'Investing',       sub: 'Markets & assets',    color: C.teal,   dim: C.tealDim,   bdr: C.tealBdr   },
  { path: '/learn/insurance',     Icon: Shield,     label: 'Insurance',       sub: 'Protect what matters',color: C.indigo, dim: C.indigoDim, bdr: C.indigoBdr },
  { path: '/learn/retirement',    Icon: Clock,      label: 'Retirement',      sub: '401k · IRA',          color: C.gold,   dim: C.goldDim,   bdr: C.goldBdr   },
  { path: '/learn/estate',        Icon: FileText,   label: 'Estate',          sub: 'Wills & trusts',      color: C.teal,   dim: C.tealDim,   bdr: C.tealBdr   },
]

const EDUCATION_SECTIONS = [
  { path: '/learn/portfolio',   Icon: BarChart2,  label: 'Portfolio Structure',  sub: 'ETFs · allocation · rebalancing', color: C.indigo },
  { path: '/learn/life-events', Icon: Users,      label: 'Life Events',          sub: 'Marriage · divorce · career',     color: C.teal   },
  { path: '/learn/family',      Icon: Users,      label: 'Family Planning',      sub: 'Kids · college · insurance',      color: C.gold   },
  { path: '/learn/purchases',   Icon: Home,       label: 'Major Purchases',      sub: 'Home · auto · big decisions',     color: C.indigo },
  { path: '/learn/tax',         Icon: FileText,   label: 'Tax Planning',         sub: 'Save more · owe less',            color: C.teal   },
  { path: '/learn/resources',   Icon: BookOpen,   label: 'Resources & Tools',    sub: 'Guides · glossary · links',       color: C.gold   },
]

const PLANNING_TOOLS = [
  { path: '/learn/budget-tool',   Icon: Calculator, label: 'Budget Planner',         sub: 'Income & expense tracking'    },
  { path: '/learn/networth',      Icon: TrendingUp, label: 'Net Worth Tracker',       sub: 'Assets & liabilities'         },
  { path: '/learn/retirement-tool',Icon: Clock,     label: 'Retirement Calculator',   sub: 'Nest egg projections'         },
  { path: '/learn/tax-tool',      Icon: FileText,   label: 'Tax Planning Tool',       sub: '2026 tax optimization'        },
  { path: '/learn/buy-rent-lease',Icon: Home,       label: 'Buy vs. Rent vs. Lease',  sub: 'The real comparison'          },
  { path: '/learn/social-security',Icon: Shield,    label: 'Social Security',         sub: 'Benefit strategy'             },
  { path: '/learn/life-insurance',Icon: Heart,      label: 'Life Insurance',          sub: 'Coverage analysis'            },
  { path: '/learn/real-estate',   Icon: Home,       label: 'Real Estate Planning',    sub: 'Buy & invest strategy'        },
  { path: '/learn/family',        Icon: Users,      label: 'Family Planning',         sub: 'Milestone financial prep'     },
  { path: '/learn/estate-tool',   Icon: FileText,   label: 'Estate Planning',         sub: 'Wealth transfer strategy'     },
]

const LIBRARY = [
  { path: '/learn/resources',     Icon: BookOpen,  label: 'Resources & Tools',       sub: 'Guides, glossary, links'      },
  { path: '/learn/library',       Icon: Library,   label: "Learner's Library",       sub: 'All topics in one place'      },
  { path: '/learn/calculators',   Icon: Calculator,label: 'Calculators',             sub: '35+ financial calculators'    },
]

export default function LearnHome() {
  const nav = useNavigate()

  return (
    <div style={{ background: C.bg, minHeight: '100dvh', paddingBottom: 80 }}>
      <ScreenHeader title="Learn" subtitle="FUN · Financial Education" accent={C.indigo} />

      {/* Live badge */}
      <div style={{ padding: '10px 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.indigo, display: 'inline-block' }} />
        <span style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>Modules, tools, and planning resources.</span>
      </div>

      {/* Financial Health Assessment Hero */}
      <div style={{ padding: '12px 16px 0' }}>
        <div style={{
          background: `linear-gradient(135deg, rgba(129,140,248,0.14) 0%, rgba(129,140,248,0.04) 100%)`,
          border: `1px solid ${C.indigoBdr}`,
          borderRadius: 18,
          padding: '20px 18px 18px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(129,140,248,0.07)', pointerEvents: 'none' }} />

          <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: C.indigo, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8 }}>
            FINANCIAL EDUCATION NETWORK
          </div>
          <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 700, color: C.t1, lineHeight: 1.25, marginBottom: 8 }}>
            Financial Health Assessment
          </div>
          <div style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.65, marginBottom: 16 }}>
            Find out where you stand across the six pillars of financial health — then get a guided learning path built for you.
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
            {[['6', 'Pillars'], ['13', 'Modules'], ['45+', 'Topics']].map(([v, l]) => (
              <div key={l} style={{
                flex: 1, textAlign: 'center',
                background: 'rgba(129,140,248,0.08)', border: `1px solid ${C.indigoBdr}`,
                borderRadius: 10, padding: '8px 4px',
              }}>
                <div style={{ fontFamily: MONO, fontSize: 15, fontWeight: 700, color: C.indigo }}>{v}</div>
                <div style={{ fontFamily: UI, fontSize: 10, color: C.t3 }}>{l}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => nav('/learn/assessment')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: C.indigo, border: 'none', borderRadius: 10,
              padding: '11px 20px', cursor: 'pointer',
            }}
          >
            <Zap size={14} color="#1a1410" />
            <span style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: '#1a1410' }}>Start Assessment</span>
          </button>
        </div>
      </div>

      {/* Six Pillars — 3×2 Grid */}
      <MSectionHeader label="Six Pillars of Financial Health" />
      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 9 }}>
        {PILLARS.map(({ path, Icon, label, sub, color, dim, bdr }) => (
          <div
            key={path}
            onClick={() => nav(path)}
            style={{ background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 14, padding: '14px 12px', cursor: 'pointer' }}
          >
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: dim, border: `1px solid ${bdr}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10,
            }}>
              <Icon size={15} color={color} />
            </div>
            <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, color: C.t1, marginBottom: 2, lineHeight: 1.3 }}>{label}</div>
            <div style={{ fontFamily: UI, fontSize: 10, color: C.t3 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Education Sections — 2×2 Grid */}
      <MSectionHeader label="Education Sections" />
      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {EDUCATION_SECTIONS.map(({ path, Icon, label, sub, color }) => (
          <div
            key={path}
            onClick={() => nav(path)}
            style={{ background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 16, padding: '16px 14px', cursor: 'pointer' }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: C.indigoDim, border: `1px solid ${C.indigoBdr}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
            }}>
              <Icon size={16} color={color} />
            </div>
            <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 3 }}>{label}</div>
            <div style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Planning Tools */}
      <MSectionHeader label="Planning Tools" />
      <div style={{ padding: '0 16px' }}>
        <div style={{ background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 16, overflow: 'hidden' }}>
          {PLANNING_TOOLS.map(({ path, Icon, label, sub }, i) => (
            <div
              key={path}
              onClick={() => nav(path)}
              style={{
                display: 'flex', alignItems: 'center', padding: '13px 16px',
                borderBottom: i < PLANNING_TOOLS.length - 1 ? `1px solid ${C.b1}` : 'none',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: C.indigoDim, border: `1px solid ${C.indigoBdr}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, flexShrink: 0,
              }}>
                <Icon size={14} color={C.indigo} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 600, color: C.t1 }}>{label}</div>
                <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, marginTop: 1 }}>{sub}</div>
              </div>
              <ChevronRight size={15} color={C.t3} />
            </div>
          ))}
        </div>
      </div>

      {/* Library & Tools */}
      <MSectionHeader label="Library & Tools" />
      <div style={{ padding: '0 16px' }}>
        <div style={{ background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 16, overflow: 'hidden' }}>
          {LIBRARY.map(({ path, Icon, label, sub }, i) => (
            <div
              key={path}
              onClick={() => nav(path)}
              style={{
                display: 'flex', alignItems: 'center', padding: '13px 16px',
                borderBottom: i < LIBRARY.length - 1 ? `1px solid ${C.b1}` : 'none',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: C.indigoDim, border: `1px solid ${C.indigoBdr}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, flexShrink: 0,
              }}>
                <Icon size={14} color={C.indigo} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 600, color: C.t1 }}>{label}</div>
                <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, marginTop: 1 }}>{sub}</div>
              </div>
              <ChevronRight size={15} color={C.t3} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px', textAlign: 'center' }}>
        <span style={{ fontFamily: UI, fontSize: 10, color: C.t3 }}>⊙ Free. Always.</span>
      </div>
    </div>
  )
}
