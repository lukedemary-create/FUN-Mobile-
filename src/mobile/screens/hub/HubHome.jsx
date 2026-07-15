import { useNavigate } from 'react-router-dom'
import {
  BarChart2, Users, GraduationCap, Briefcase,
  Bot, FileBarChart2, Rss, Settings,
  ChevronRight, CheckCircle,
} from 'lucide-react'
import { C, UI, MONO, DISPLAY } from '../../tokens'

const PLATFORMS = [
  {
    path: '/markets',
    accent: C.gold,
    dim: C.goldDim,
    bdr: C.goldBdr,
    Icon: BarChart2,
    tag: 'PLANORA TERMINAL',
    label: 'Market Intelligence',
    sub: 'Institutional-grade analytics, live data, and behavioral finance',
    bullets: [
      'Live indices, sectors & top movers',
      'Macro research · Labor · Real Estate',
      'Risk analysis · Market breadth',
      'Market history & behavioral finance',
    ],
  },
  {
    path: '/planning',
    accent: C.teal,
    dim: C.tealDim,
    bdr: C.tealBdr,
    Icon: Users,
    tag: 'WEALTH COUNSEL',
    label: 'Advisor & Planning',
    sub: 'Connect with fiduciary advisors and get your planning documents',
    bullets: [
      'Advisor matching & roster',
      'Intake form & planning letter',
      'Grill your advisor · 25 questions',
      'Brokerage comparison guide',
    ],
  },
  {
    path: '/learn',
    accent: C.indigo,
    dim: C.indigoDim,
    bdr: C.indigoBdr,
    Icon: GraduationCap,
    tag: 'FUN · FINANCIAL EDUCATION',
    label: 'Learn & Plan',
    sub: 'Guided education modules and interactive planning tools',
    bullets: [
      '6 pillars of financial health',
      'Budgeting, investing & retirement',
      'Tax, estate & insurance planning',
      '10+ planning tools & calculators',
    ],
  },
  {
    path: '/business',
    accent: C.amber,
    dim: C.amberDim,
    bdr: C.amberBdr,
    Icon: Briefcase,
    tag: 'BUSINESS OWNER PLANNING',
    label: 'Business Planning',
    sub: 'Structure, tax strategy, growth, exit, and owner tools',
    bullets: [
      'Entity structure · LLC vs S-Corp',
      'Owner tax strategy & deductions',
      'Growth, funding & exit planning',
      'Business assessment & plan builder',
    ],
  },
]

const QUICK = [
  { path: '/more/ai',       Icon: Bot,          label: 'Planora AI',       color: C.indigo },
  { path: '/more/reports',  Icon: FileBarChart2, label: 'Reports',          color: C.teal   },
  { path: '/more/feed',     Icon: Rss,           label: 'The Feed',         color: C.gold   },
  { path: '/more/settings', Icon: Settings,      label: 'Settings',         color: C.t2     },
]

export default function HubHome() {
  const nav = useNavigate()

  return (
    <div style={{ background: C.bg, minHeight: '100dvh', paddingBottom: 32 }}>

      {/* Header */}
      <div style={{
        padding: `calc(env(safe-area-inset-top, 0px) + 14px) 16px 14px`,
        borderBottom: `1px solid ${C.b2}`,
        background: `${C.bg}f8`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 700, color: C.t1, lineHeight: 1.1 }}>Planora</div>
          <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: C.gold, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 2 }}>
            Institutional Intelligence. Personal Impact.
          </div>
        </div>
        {/* Live badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: 'rgba(74,124,89,0.10)', border: '1px solid rgba(74,124,89,0.22)', borderRadius: 99 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.up }} />
          <span style={{ fontFamily: UI, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: C.up, textTransform: 'uppercase' }}>LIVE</span>
        </div>
      </div>

      {/* Platform Cards */}
      <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {PLATFORMS.map(({ path, accent, dim, bdr, Icon, tag, label, sub, bullets }) => (
          <div
            key={path}
            onClick={() => nav(path)}
            style={{
              background: C.surf,
              border: `1px solid ${C.b2}`,
              borderRadius: 18,
              overflow: 'hidden',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            {/* Accent stripe */}
            <div style={{ height: 2, background: `linear-gradient(90deg, ${accent} 0%, ${dim} 70%, transparent 100%)` }} />

            <div style={{ padding: '16px 16px 14px' }}>
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                  background: dim, border: `1px solid ${bdr}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={19} color={accent} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: UI, fontSize: 9, fontWeight: 700, color: accent, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 3 }}>{tag}</div>
                  <div style={{ fontFamily: DISPLAY, fontSize: 17, fontWeight: 700, color: C.t1, lineHeight: 1.2 }}>{label}</div>
                </div>
                <div style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  background: dim, border: `1px solid ${bdr}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <ChevronRight size={14} color={accent} />
                </div>
              </div>

              {/* Sub */}
              <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.55, marginBottom: 12 }}>{sub}</div>

              {/* Bullet list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {bullets.map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <CheckCircle size={11} color={accent} style={{ flexShrink: 0, opacity: 0.8 }} />
                    <span style={{ fontFamily: UI, fontSize: 12, color: C.t2 }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Access Row */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: C.t3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>Quick Access</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {QUICK.map(({ path, Icon, label, color }) => (
            <div
              key={path}
              onClick={() => nav(path)}
              style={{
                background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 14,
                padding: '12px 8px', cursor: 'pointer', textAlign: 'center',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                <Icon size={18} color={color} />
              </div>
              <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 600, color: C.t2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ padding: '20px 16px 0', textAlign: 'center' }}>
        <span style={{ fontFamily: UI, fontSize: 10, color: C.t3 }}>For educational purposes only · Not financial advice</span>
      </div>
    </div>
  )
}
