import { useNavigate } from 'react-router-dom'
import {
  Briefcase, Building2, Receipt, TrendingUp, Shield, Users,
  FileText, BarChart2, ChevronRight, ArrowRight, Zap,
} from 'lucide-react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MSectionHeader } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'

const FEATURED = [
  {
    path: '/business/structure',
    Icon: Building2,
    label: 'Business Structure',
    sub: 'LLC · S-Corp · C-Corp',
    color: C.amber,
    dim: C.amberDim,
    bdr: C.amberBdr,
  },
  {
    path: '/business/tax',
    Icon: Receipt,
    label: 'Owner Tax Strategy',
    sub: 'Deductions · QBI · planning',
    color: C.amber,
    dim: C.amberDim,
    bdr: C.amberBdr,
  },
  {
    path: '/business/growth',
    Icon: TrendingUp,
    label: 'Growth & Funding',
    sub: 'Capital · loans · equity',
    color: C.amber,
    dim: C.amberDim,
    bdr: C.amberBdr,
  },
  {
    path: '/business/exit',
    Icon: ArrowRight,
    label: 'Exit Strategy',
    sub: 'Sale · succession · wind-down',
    color: C.amber,
    dim: C.amberDim,
    bdr: C.amberBdr,
  },
]

const ALL_MODULES = [
  { path: '/business/structure',    Icon: Building2,  label: 'Business Structure',       sub: 'Entity type & registration'       },
  { path: '/business/tax',          Icon: Receipt,    label: 'Owner Tax Strategy',        sub: 'Deductions, QBI, tax planning'    },
  { path: '/business/growth',       Icon: TrendingUp, label: 'Growth & Funding',          sub: 'Revenue, capital, equity'         },
  { path: '/business/exit',         Icon: ArrowRight, label: 'Exit Strategy',             sub: 'Sale, succession, wind-down'      },
  { path: '/business/protection',   Icon: Shield,     label: 'Asset Protection',          sub: 'Insurance, liability, shielding'  },
  { path: '/business/retirement',   Icon: Users,      label: 'Owner Retirement Plans',    sub: 'SEP-IRA, Solo 401k, SIMPLE'       },
  { path: '/business/employees',    Icon: Users,      label: 'Employees & Benefits',      sub: 'Hiring, comp, benefits design'    },
  { path: '/business/financial',    Icon: BarChart2,  label: 'Financial Statements',      sub: 'P&L, cash flow, balance sheet'    },
]

const OWNER_TOOLS = [
  { path: '/business/assess',       Icon: FileText,   label: 'Owner Assessment',          sub: 'Where your business stands today' },
  { path: '/business/plan',         Icon: Briefcase,  label: 'My Business Plan',          sub: 'Custom roadmap & action items'    },
]

const STEPS = [
  'Complete the owner assessment',
  'Get your business health score',
  'Review 8 core planning modules',
  'Build your custom business plan',
  'Connect with a business advisor',
]

export default function BusinessHome() {
  const nav = useNavigate()

  return (
    <div style={{ background: C.bg, minHeight: '100dvh', paddingBottom: 80 }}>
      <ScreenHeader title="Business" subtitle="Owner Planning" accent={C.amber} />

      {/* Live badge */}
      <div style={{ padding: '10px 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.amber, display: 'inline-block' }} />
        <span style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>Education, planning, and strategy for business owners.</span>
      </div>

      {/* Hero — Assessment Card */}
      <div style={{ padding: '12px 16px 0' }}>
        <div style={{
          background: `linear-gradient(135deg, rgba(232,168,56,0.14) 0%, rgba(232,168,56,0.04) 100%)`,
          border: `1px solid ${C.amberBdr}`,
          borderRadius: 18,
          padding: '20px 18px 18px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(232,168,56,0.07)', pointerEvents: 'none' }} />

          <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: C.amber, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8 }}>
            BUSINESS OWNER PLANNING
          </div>
          <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 700, color: C.t1, lineHeight: 1.25, marginBottom: 8 }}>
            Build a smarter business foundation
          </div>
          <div style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.65, marginBottom: 16 }}>
            From entity structure to exit strategy — a complete framework for owners at every stage.
          </div>

          {/* 5-step process */}
          <div style={{ marginBottom: 18 }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < STEPS.length - 1 ? 8 : 0 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'rgba(232,168,56,0.18)', border: `1px solid ${C.amberBdr}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: C.amber }}>{i + 1}</span>
                </div>
                <span style={{ fontFamily: UI, fontSize: 12, color: C.t2 }}>{step}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => nav('/business/assess')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: C.amber, border: 'none', borderRadius: 10,
              padding: '11px 20px', cursor: 'pointer',
            }}
          >
            <Zap size={14} color="#1a1410" />
            <span style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: '#1a1410' }}>Start Assessment</span>
          </button>
        </div>
      </div>

      {/* Featured Modules — 2×2 Grid */}
      <MSectionHeader label="Featured Modules" />
      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {FEATURED.map(({ path, Icon, label, sub, color, dim, bdr }) => (
          <div
            key={path}
            onClick={() => nav(path)}
            style={{ background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 16, padding: '16px 14px', cursor: 'pointer' }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: dim, border: `1px solid ${bdr}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
            }}>
              <Icon size={17} color={color} />
            </div>
            <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 3 }}>{label}</div>
            <div style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* All 8 Modules */}
      <MSectionHeader label="All Modules" />
      <div style={{ padding: '0 16px' }}>
        <div style={{ background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 16, overflow: 'hidden' }}>
          {ALL_MODULES.map(({ path, Icon, label, sub }, i) => (
            <div
              key={path}
              onClick={() => nav(path)}
              style={{
                display: 'flex', alignItems: 'center', padding: '13px 16px',
                borderBottom: i < ALL_MODULES.length - 1 ? `1px solid ${C.b1}` : 'none',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: C.amberDim, border: `1px solid ${C.amberBdr}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, flexShrink: 0,
              }}>
                <Icon size={14} color={C.amber} />
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

      {/* Owner Tools */}
      <MSectionHeader label="Owner Tools" />
      <div style={{ padding: '0 16px' }}>
        <div style={{ background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 16, overflow: 'hidden' }}>
          {OWNER_TOOLS.map(({ path, Icon, label, sub }, i) => (
            <div
              key={path}
              onClick={() => nav(path)}
              style={{
                display: 'flex', alignItems: 'center', padding: '13px 16px',
                borderBottom: i < OWNER_TOOLS.length - 1 ? `1px solid ${C.b1}` : 'none',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: C.amberDim, border: `1px solid ${C.amberBdr}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, flexShrink: 0,
              }}>
                <Icon size={14} color={C.amber} />
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
        <span style={{ fontFamily: UI, fontSize: 10, color: C.t3 }}>⊙ Built for owners at every stage</span>
      </div>
    </div>
  )
}
