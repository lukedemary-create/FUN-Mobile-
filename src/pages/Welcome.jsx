import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/AuthContext'
import { BarChart2, Users, GraduationCap, ArrowRight } from 'lucide-react'

const DISPLAY = "'Playfair Display', Georgia, serif"
const UI      = "'Inter', system-ui, sans-serif"
const MONO    = "'JetBrains Mono', monospace"

const C = {
  bg:      '#1a1410',
  surf:    '#231c16',
  raise:   '#2d2419',
  b1:      '#2a2018',
  b2:      '#3d3028',
  gold:    '#c9a96e',
  goldDim: 'rgba(201,169,110,0.08)',
  goldBdr: 'rgba(201,169,110,0.22)',
  t1:      '#f0e8d8',
  t2:      '#a89070',
  t3:      '#6b5540',
  teal:    '#00B4C6',
  tealDim: 'rgba(0,180,198,0.08)',
  tealBdr: 'rgba(0,180,198,0.22)',
  indigo:  '#818cf8',
  indigoDim: 'rgba(129,140,248,0.08)',
  indigoBdr: 'rgba(129,140,248,0.22)',
}

const PLATFORMS = [
  {
    icon: BarChart2,
    label: 'Planora Terminal',
    color: C.gold,
    bg: C.goldDim,
    bdr: C.goldBdr,
    desc: 'Institutional-grade market intelligence. Live dashboards, sector analysis, macro data, risk modeling, and wealth planning tools — the full suite used by Wall Street, built for everyone.',
    href: '/terminal-hub',
  },
  {
    icon: Users,
    label: 'Wealth Counsel',
    color: C.teal,
    bg: C.tealDim,
    bdr: C.tealBdr,
    desc: 'A dedicated space for advisors and clients to collaborate. Manage portfolios, track life events, share plans, and stay aligned — all in one secure platform.',
    href: '/wealth-counsel',
  },
  {
    icon: GraduationCap,
    label: 'FUN — Financial Education',
    color: C.indigo,
    bg: C.indigoDim,
    bdr: C.indigoBdr,
    desc: 'Your guided path to financial literacy. From budgeting basics to tax strategy and investing fundamentals — interactive modules, calculators, and real-world concepts explained clearly.',
    href: '/education-hub',
  },
]

export default function Welcome() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const firstName = user?.user_metadata?.first_name
    || user?.user_metadata?.full_name?.split(' ')[0]
    || user?.email?.split('@')[0]
    || 'there'

  return (
    <div style={{
      minHeight: '100vh', background: C.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px', fontFamily: UI,
    }}>
      <div style={{ width: '100%', maxWidth: 700 }}>

        {/* Card */}
        <div style={{
          background: C.surf,
          border: `1px solid ${C.b2}`,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.55)',
        }}>

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 28px',
            borderBottom: `1px solid ${C.b1}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: C.gold,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ fontFamily: DISPLAY, fontSize: 18, fontWeight: 900, color: C.bg, lineHeight: 1 }}>P</span>
              </div>
              <div>
                <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 800, color: C.t1, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Planora</div>
                <div style={{ fontFamily: UI, fontSize: 9, fontWeight: 600, color: C.t3, letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 1 }}>Financial Education</div>
              </div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(0,180,198,0.10)',
              border: '1px solid rgba(0,180,198,0.25)',
              borderRadius: 20, padding: '5px 12px',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.teal }} />
              <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: C.teal, letterSpacing: '0.1em' }}>LIVE</span>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '36px 28px 28px' }}>

            {/* Headline */}
            <h1 style={{
              fontFamily: DISPLAY,
              fontSize: 'clamp(22px, 4vw, 30px)',
              fontWeight: 700, color: C.t1,
              margin: '0 0 10px',
              lineHeight: 1.25, letterSpacing: '-0.02em',
            }}>
              Welcome{firstName !== 'there' ? `, ${firstName}` : ''} to Planora.
            </h1>
            <p style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: C.gold, margin: '0 0 20px', letterSpacing: '0.01em' }}>
              Your complete financial education and planning platform.
            </p>
            <p style={{ fontFamily: UI, fontSize: 14, color: C.t2, lineHeight: 1.75, margin: '0 0 28px', maxWidth: 600 }}>
              Planora brings together three platforms in one ecosystem — designed to help you understand how money works, build a plan, and make better decisions at every stage of your financial life.
            </p>

            {/* Platform cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {PLATFORMS.map(p => (
                <button
                  key={p.label}
                  onClick={() => navigate(p.href)}
                  style={{
                    background: p.bg, border: `1px solid ${p.bdr}`,
                    borderRadius: 12, padding: '18px 20px',
                    textAlign: 'left', cursor: 'pointer',
                    transition: 'filter 0.18s',
                    display: 'flex', gap: 16, alignItems: 'flex-start',
                  }}
                  onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.15)'}
                  onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                    background: p.color + '18',
                    border: `1px solid ${p.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginTop: 2,
                  }}>
                    <p.icon size={16} color={p.color} />
                  </div>
                  <div>
                    <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: p.color, marginBottom: 5 }}>{p.label}</div>
                    <p style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65, margin: 0 }}>{p.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Disclaimer */}
            <div style={{
              background: C.goldDim, border: `1px solid ${C.goldBdr}`,
              borderRadius: 10, padding: '14px 18px', marginBottom: 24,
            }}>
              <p style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65, margin: 0 }}>
                <span style={{ fontWeight: 700, color: C.gold }}>For educational purposes only.</span>{' '}
                Planora is designed to help you understand financial concepts, explore market data, and plan your personal finances. It is not a licensed financial advisor and nothing here constitutes investment, tax, or legal advice.
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate('/')}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                background: C.gold, border: 'none', borderRadius: 12,
                padding: '16px 0', cursor: 'pointer',
                fontFamily: UI, fontSize: 15, fontWeight: 700, color: C.bg,
                transition: 'filter 0.18s',
              }}
              onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.08)'}
              onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
            >
              Explore Planora <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
