import { useLocation, useNavigate } from 'react-router-dom'
import { BarChart2, Users, GraduationCap, Briefcase, MoreHorizontal } from 'lucide-react'
import { C, UI, BOTTOM_TAB_HEIGHT } from '../tokens'

const TABS = [
  { path: '/markets',  label: 'Markets',  Icon: BarChart2,      color: C.gold   },
  { path: '/planning', label: 'Planning', Icon: Users,          color: C.teal   },
  { path: '/learn',    label: 'Learn',    Icon: GraduationCap,  color: C.indigo },
  { path: '/business', label: 'Business', Icon: Briefcase,      color: C.amber  },
  { path: '/more',     label: 'More',     Icon: MoreHorizontal, color: C.t2     },
]

export default function BottomTabBar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const activeTab = TABS.find(t => pathname === t.path || pathname.startsWith(t.path + '/'))?.path || '/markets'

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      zIndex: 100,
      background: 'rgba(22,17,12,0.98)',
      borderTop: `1px solid #2a2018`,
      display: 'flex',
      height: BOTTOM_TAB_HEIGHT,
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }}>
      {TABS.map(({ path, label, Icon, color }) => {
        const active = activeTab === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 3, background: 'none', border: 'none',
              padding: '6px 0 2px', cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
              position: 'relative',
            }}
          >
            {active && (
              <span style={{
                position: 'absolute', top: 0, left: '50%',
                transform: 'translateX(-50%)',
                width: 24, height: 2,
                background: color,
                borderRadius: '0 0 4px 4px',
              }} />
            )}
            <Icon size={20} color={active ? color : C.t3} strokeWidth={active ? 2.2 : 1.8} />
            <span style={{
              fontFamily: UI, fontSize: 10,
              fontWeight: active ? 700 : 400,
              color: active ? color : C.t3,
              letterSpacing: '0.02em',
            }}>
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
