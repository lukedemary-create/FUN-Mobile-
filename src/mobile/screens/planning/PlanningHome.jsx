import { useNavigate } from 'react-router-dom'
import { Users, UserCheck, ClipboardList, HelpCircle, Building2, ChevronRight, Star, ArrowRight, FileText, Shield, CheckCircle2 } from 'lucide-react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { C, UI, MONO, DISPLAY } from '../../tokens'

const GRID = [
  { path: '/wealth/roster',    Icon: Users,        label: 'Advisor Roster',     sub: 'Browse vetted advisors',         color: C.teal },
  { path: '/wealth/intake',    Icon: ClipboardList,label: 'Intake Form',        sub: 'Your financial profile',         color: C.teal },
  { path: '/wealth/grill',     Icon: HelpCircle,   label: 'Grill Your Advisor', sub: 'Questions to ask first',         color: C.teal },
  { path: '/wealth/brokerage', Icon: Building2,    label: 'Brokerage Guide',    sub: 'Compare major firms',            color: C.teal },
]

const STEPS = [
  'Complete your intake form',
  'Browse matched advisors',
  'Grill candidates with smart questions',
  'Review brokerage options',
  'Schedule your first meeting',
  'Start your wealth journey',
]

const WHY_POINTS = [
  { icon: Star,         text: 'Vetted fiduciary advisors only — no commission hunters' },
  { icon: ClipboardList,text: 'Structured intake process that protects your interests' },
  { icon: HelpCircle,   text: '25 questions every investor should ask before hiring' },
  { icon: Building2,    text: 'Unbiased comparison of Fidelity, Schwab, Vanguard & more' },
]

export default function PlanningHome() {
  const nav = useNavigate()

  return (
    <div style={{ background: C.bg, minHeight: '100dvh', paddingBottom: 80 }}>
      <ScreenHeader title="Wealth Counsel" subtitle="Find the right advisor" accent={C.teal} />

      {/* Live badge */}
      <div style={{ padding: '10px 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.teal, display: 'inline-block' }} />
        <span style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>Connect with a vetted financial advisor.</span>
      </div>

      {/* Hero — Match Card */}
      <div style={{ padding: '12px 16px 0' }}>
        <div style={{
          background: '#ffffff',
          border: `1px solid ${C.tealBdr}`,
          borderRadius: 20,
          padding: '20px 18px 18px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,180,198,0.10)',
        }}>
          {/* Teal accent top bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.teal}66)`, borderRadius: '20px 20px 0 0' }} />
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(0,180,198,0.06)', pointerEvents: 'none' }} />

          <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: C.teal, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8 }}>
            WEALTH COUNSEL
          </div>
          <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 700, color: C.t1, lineHeight: 1.25, marginBottom: 8 }}>
            Get matched to the right advisor
          </div>
          <div style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.65, marginBottom: 18 }}>
            Our structured process helps you find, vet, and connect with a fiduciary advisor aligned to your goals — before you ever write a check.
          </div>

          {/* 6-step process */}
          <div style={{ marginBottom: 20 }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < STEPS.length - 1 ? 9 : 0 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  background: C.tealDim, border: `1px solid ${C.tealBdr}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: C.teal }}>{i + 1}</span>
                </div>
                <span style={{ fontFamily: UI, fontSize: 12.5, color: C.t2 }}>{step}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => nav('/wealth/match')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: C.teal, border: 'none', borderRadius: 10,
              padding: '12px 22px', cursor: 'pointer',
            }}
          >
            <UserCheck size={15} color="#ffffff" />
            <span style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: '#ffffff' }}>Start Match</span>
            <ArrowRight size={14} color="#ffffff" />
          </button>
        </div>
      </div>

      {/* 2×2 Grid */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: C.t3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>
          Wealth Counsel Tools
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {GRID.map(({ path, Icon, label, sub, color }) => (
            <div
              key={path}
              onClick={() => nav(path)}
              style={{
                background: '#ffffff', border: `1px solid ${C.b1}`,
                borderRadius: 16, padding: '16px 14px', cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(26,20,16,0.06)',
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: C.tealDim, border: `1px solid ${C.tealBdr}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
              }}>
                <Icon size={17} color={color} />
              </div>
              <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 3 }}>{label}</div>
              <div style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Planning Letter */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: C.t3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>
          Planning Tools
        </div>
        <div
          onClick={() => nav('/wealth/letter')}
          style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '15px 16px',
            background: '#ffffff', border: `1px solid ${C.b1}`, borderRadius: 16, cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(26,20,16,0.06)',
          }}
        >
          <div style={{ width: 38, height: 38, borderRadius: 10, background: C.tealDim, border: `1px solid ${C.tealBdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FileText size={17} color={C.teal} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: UI, fontSize: 14, fontWeight: 600, color: C.t1 }}>Planning Letter</div>
            <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, marginTop: 1 }}>Generate a personalized financial planning document</div>
          </div>
          <ChevronRight size={15} color={C.t3} />
        </div>
      </div>

      {/* Why Wealth Counsel */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: C.t3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>
          Why Wealth Counsel
        </div>
        <div style={{ background: '#ffffff', border: `1px solid ${C.b1}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(26,20,16,0.06)' }}>
          {WHY_POINTS.map(({ icon: Icon, text }, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px',
                borderBottom: i < WHY_POINTS.length - 1 ? `1px solid ${C.b1}` : 'none',
              }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 9, background: C.tealDim, border: `1px solid ${C.tealBdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={14} color={C.teal} />
              </div>
              <span style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.45 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px', textAlign: 'center' }}>
        <span style={{ fontFamily: UI, fontSize: 10, color: C.t3 }}>All advisors are independently vetted</span>
      </div>
    </div>
  )
}
