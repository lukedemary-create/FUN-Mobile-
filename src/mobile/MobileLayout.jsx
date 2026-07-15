import { useState, useRef } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Home, BookOpen, Target, User, Sparkles } from 'lucide-react'
import { C, UI } from './tokens'

const PILL_H      = 64
const PILL_BOTTOM = 20
const CONTENT_PAD = PILL_H + PILL_BOTTOM + 16

const TABS = [
  { path: '/',      label: 'Home',  Icon: Home,     match: p => p === '/' },
  { path: '/learn', label: 'Learn', Icon: BookOpen,  match: p => p === '/learn' || p.startsWith('/learn/') },
  { path: '/ai',    label: 'AI',    Icon: Sparkles,  match: p => p === '/ai',    accent: C.indigo },
  { path: '/plan',  label: 'Plan',  Icon: Target,    match: p => p === '/plan'  || p.startsWith('/plan/')  },
  { path: '/you',   label: 'You',   Icon: User,      match: p => p === '/you'   || p.startsWith('/you/')   },
]

/* ── Bottom pill nav ─────────────────────────────────────── */
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
        const bg     = isActive ? (accent ?? C.tangerine) : 'transparent'
        const shadow = isActive
          ? accent ? '0 4px 12px rgba(129,140,248,0.40)' : '0 4px 12px rgba(232,120,60,0.35)'
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
            <Icon size={18} color={isActive ? '#fff' : 'rgba(255,255,255,0.45)'} strokeWidth={isActive ? 2.3 : 1.8} />
            {isActive && (
              <span style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>
                {label}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}

/* ── FUN floating orb ────────────────────────────────────── */
const ORB   = 52   // size in px
const PEEK  = 22   // px visible when pushed off screen

function FUNOrb() {
  const navigate        = useNavigate()
  const [hidden, setHidden]   = useState(false)
  const [dragX,  setDragX]    = useState(0)
  const [active, setActive]   = useState(false)
  const startX = useRef(null)

  // translateX when fully hidden (only PEEK px shows from right edge)
  const HIDE_X = ORB + 16 - PEEK  // 52 + 16 - 22 = 46

  // clamp drag direction based on current state
  const clampedDrag = hidden ? Math.min(0, dragX) : Math.max(0, dragX)
  const tx = hidden ? HIDE_X + clampedDrag : clampedDrag

  return (
    <div
      onTouchStart={e => {
        startX.current = e.touches[0].clientX
        setActive(true)
        setDragX(0)
      }}
      onTouchMove={e => {
        if (startX.current === null) return
        const dx = e.touches[0].clientX - startX.current
        setDragX(hidden ? Math.min(0, dx) : Math.max(0, dx))
      }}
      onTouchEnd={() => {
        const dx = dragX
        setActive(false)
        setDragX(0)
        startX.current = null

        if (!hidden && dx > 48) {
          setHidden(true)
        } else if (hidden && dx < -48) {
          setHidden(false)
        } else if (Math.abs(dx) < 8 && !hidden) {
          navigate('/')
        }
      }}
      style={{
        position: 'fixed',
        right: 16,
        bottom: 102,
        zIndex: 200,
        width: ORB,
        height: ORB,
        borderRadius: '50%',
        background: '#818cf8',
        boxShadow: '0 4px 20px rgba(129,140,248,0.45), 0 2px 8px rgba(0,0,0,0.25)',
        transform: `translateX(${tx}px)`,
        transition: active ? 'none' : 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'pan-x',
        userSelect: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Sparkles size={20} color="#fff" strokeWidth={1.8} />
    </div>
  )
}

/* ── Layout ──────────────────────────────────────────────── */
export default function MobileLayout() {
  return (
    <div style={{ background: C.bg, minHeight: '100dvh' }}>
      <main style={{ paddingBottom: CONTENT_PAD, minHeight: '100dvh' }}>
        <Outlet />
      </main>
      <FloatingNav />
      <FUNOrb />
    </div>
  )
}
