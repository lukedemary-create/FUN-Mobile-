import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/AuthContext'
import { TrendingUp, CalendarDays, BarChart2, Sparkles, ArrowRight } from 'lucide-react'

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
  teal:    '#4a9d8f',
  indigo:  '#7c85d4',
}

const CARDS = [
  {
    icon: TrendingUp,
    label: 'Markets',
    color: C.gold,
    desc: 'Live dashboards, sector heatmaps, stock screener, crypto, top performers, and real-time news.',
    href: '/markets',
  },
  {
    icon: CalendarDays,
    label: 'Macro',
    color: C.gold,
    desc: 'Economic calendar, Fed watch, labor markets, energy prices, and real estate trends.',
    href: '/macro',
  },
  {
    icon: BarChart2,
    label: 'Analysis',
    color: C.indigo,
    desc: 'Risk analysis, watchlist, market breadth, political intelligence, and insider filings.',
    href: '/RiskAnalysis',
  },
  {
    icon: Sparkles,
    label: 'Wealth',
    color: C.teal,
    desc: 'Budget planner, calculators, future planning, tax strategy, net worth, and brokerage guides.',
    href: '/wealth',
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
      <div style={{ width: '100%', maxWidth: 680 }}>

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
                <div style={{ fontFamily: UI, fontSize: 9, fontWeight: 600, color: C.t3, letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 1 }}>Financial Terminal</div>
              </div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(74,157,143,0.12)',
              border: '1px solid rgba(74,157,143,0.25)',
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
              Welcome{firstName !== 'there' ? `, ${firstName}` : ''} to your personal financial intelligence hub.
            </h1>
            <p style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: C.gold, margin: '0 0 20px', letterSpacing: '0.01em' }}>
              Institutional-grade tools. Built for everyone.
            </p>
            <p style={{ fontFamily: UI, fontSize: 14, color: C.t2, lineHeight: 1.75, margin: '0 0 32px', maxWidth: 580 }}>
              Planora Terminal brings together tools, data, and education once reserved for Wall Street professionals — putting them directly in your hands. Track markets, plan for retirement, understand tax strategy, or start learning how money works.
            </p>

            {/* Section cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }} className="welcome-grid">
              {CARDS.map(card => (
                <button
                  key={card.label}
                  onClick={() => navigate(card.href)}
                  style={{
                    background: C.raise, border: `1px solid ${C.b2}`,
                    borderRadius: 12, padding: '18px 20px',
                    textAlign: 'left', cursor: 'pointer',
                    transition: 'border-color 0.18s, background 0.18s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = card.color + '55'; e.currentTarget.style.background = '#332619'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.b2; e.currentTarget.style.background = C.raise; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <card.icon size={14} color={card.color} />
                    <span style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: card.color }}>{card.label}</span>
                  </div>
                  <p style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
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
                Planora Terminal is designed to help you understand financial concepts, explore market data, and plan your personal finances. It is not a licensed financial advisor and nothing here constitutes investment, tax, or legal advice.
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
              Enter Planora <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 560px) {
          .welcome-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
