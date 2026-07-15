import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Home, BookOpen, Target, User, Sparkles } from 'lucide-react'
import { C, UI, DISPLAY } from './tokens'

const PILL_H = 64
const PILL_BOTTOM = 20
const CONTENT_PAD = PILL_H + PILL_BOTTOM + 16

const TABS = [
  { path: '/',      label: 'Home',  Icon: Home,     match: p => p === '/' },
  { path: '/learn', label: 'Learn', Icon: BookOpen,  match: p => p === '/learn' || p.startsWith('/learn/') },
  { path: '/ai',    label: 'AI',    Icon: Sparkles,  match: p => p === '/ai',     accent: C.indigo },
  { path: '/plan',  label: 'Plan',  Icon: Target,    match: p => p === '/plan'  || p.startsWith('/plan/')  },
  { path: '/you',   label: 'You',   Icon: User,      match: p => p === '/you'   || p.startsWith('/you/')   },
]

function FloatingNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const activeTab = (TABS.find(t => t.match(pathname)) || TABS[0]).path

  return (
    <nav style={{
      position: 'fixed',
      bottom: PILL_BOTTOM,
      left: 16,
      right: 16,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 4,
      background: 'rgba(28,21,16,0.96)',
      borderRadius: 100,
      padding: '8px',
      paddingBottom: `calc(8px + env(safe-area-inset-bottom, 0px))`,
      boxShadow: '0 20px 40px -16px rgba(28,21,16,0.55)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
    }}>
      {TABS.map(({ path, label, Icon, accent }) => {
        const isActive = activeTab === path
        const bg = isActive ? (accent ?? C.tangerine) : 'transparent'
        const shadow = isActive
          ? accent
            ? '0 4px 12px rgba(129,140,248,0.40)'
            : '0 4px 12px rgba(232,120,60,0.35)'
          : 'none'
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '10px 8px',
              borderRadius: 100,
              background: bg,
              border: 'none',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
              boxShadow: shadow,
            }}
          >
            <Icon
              size={18}
              color={isActive ? '#fff' : 'rgba(255,255,255,0.45)'}
              strokeWidth={isActive ? 2.3 : 1.8}
            />
            {isActive && (
              <span style={{
                fontFamily: UI,
                fontSize: 13,
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '0.01em',
                whiteSpace: 'nowrap',
              }}>
                {label}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}

export default function MobileLayout() {
  return (
    <div style={{ background: C.bg, minHeight: '100dvh' }}>
      <main style={{ paddingBottom: CONTENT_PAD, minHeight: '100dvh' }}>
        <Outlet />
      </main>
      <FloatingNav />
    </div>
  )
}
