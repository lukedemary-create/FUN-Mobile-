import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import {
  LayoutDashboard, Wallet, CreditCard, TrendingUp, Shield,
  ScrollText, Clock, Home, Calendar, BookOpen,
  ChevronLeft, Menu, X,
} from 'lucide-react';

const FunDashboard   = lazy(() => import('./pages/FunDashboard'));
const Budgeting      = lazy(() => import('./pages/Budgeting'));
const DebtCredit     = lazy(() => import('./pages/DebtCredit'));
const Investing      = lazy(() => import('./pages/Investing'));
const Insurance      = lazy(() => import('./pages/Insurance'));
const Estate         = lazy(() => import('./pages/Estate'));
const Retirement     = lazy(() => import('./pages/Retirement'));
const MajorPurchases = lazy(() => import('./pages/MajorPurchases'));
const LifeEvents     = lazy(() => import('./pages/LifeEvents'));
const Resources      = lazy(() => import('./pages/Resources'));
const FunComingSoon  = lazy(() => import('./pages/FunComingSoon'));

const TEAL  = '#00B4C6';
const NAVY  = '#0A1F44';
const LIGHT = '#5BC8E2';

const NAV = [
  { path: '',                label: 'Dashboard',                  icon: LayoutDashboard },
  { path: 'budgeting',       label: 'Budgeting & Foundations',    icon: Wallet          },
  { path: 'debt-credit',     label: 'Debt & Credit',              icon: CreditCard      },
  { path: 'investing',       label: 'Investing & Accounts',       icon: TrendingUp      },
  { path: 'insurance',       label: 'Insurance Planning',         icon: Shield          },
  { path: 'estate',          label: 'Estate & Wills',             icon: ScrollText      },
  { path: 'retirement',      label: 'Retirement Planning',        icon: Clock           },
  { path: 'major-purchases', label: 'Major Purchases',            icon: Home            },
  { path: 'life-events',     label: 'Life Events',                icon: Calendar        },
  { path: 'resources',       label: 'Resource Directory',         icon: BookOpen        },
];

function FunLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="17" stroke={TEAL} strokeWidth="1.5" fill="none" opacity="0.6"/>
      <circle cx="18" cy="6"  r="4" fill={TEAL}/>
      <circle cx="6"  cy="27" r="4" fill={TEAL} opacity="0.85"/>
      <circle cx="30" cy="27" r="4" fill={TEAL} opacity="0.85"/>
      <line x1="18" y1="10" x2="6"  y2="23" stroke={LIGHT} strokeWidth="1.5" opacity="0.7"/>
      <line x1="18" y1="10" x2="30" y2="23" stroke={LIGHT} strokeWidth="1.5" opacity="0.7"/>
      <line x1="6"  y1="27" x2="30" y2="27" stroke={LIGHT} strokeWidth="1.5" opacity="0.7"/>
    </svg>
  );
}

function Loader() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'40vh' }}>
      <div style={{ width:28, height:28, border:`3px solid rgba(0,180,198,0.2)`, borderTopColor:TEAL, borderRadius:'50%', animation:'funSpin 0.7s linear infinite' }}/>
      <style>{`@keyframes funSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Sidebar({ collapsed, onToggle }) {
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  // Derive active segment from /fun/xxx
  const segment = pathname.replace(/^\/fun\/?/, '').split('/')[0];

  return (
    <div style={{
      width: collapsed ? 60 : 256,
      minHeight: '100vh',
      background: NAVY,
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      transition: 'width 0.22s ease',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      position: 'relative',
      zIndex: 10,
    }}>
      {/* Header */}
      <div style={{
        padding: collapsed ? '18px 12px' : '20px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        minHeight: 72,
      }}>
        <div style={{ flexShrink: 0 }}><FunLogo /></div>
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.1875rem',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.01em',
              lineHeight: 1.1,
            }}>FUN</div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.5625rem',
              color: TEAL,
              fontWeight: 600,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              marginTop: 3,
              lineHeight: 1.3,
            }}>Financial Understanding Network</div>
          </div>
        )}
        <button
          onClick={onToggle}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: 'none',
            borderRadius: 7,
            padding: '5px 6px',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.45)',
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          {collapsed ? <Menu size={15}/> : <X size={15}/>}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 0', overflowY: 'auto', overflowX: 'hidden' }}>
        {NAV.map(item => {
          const Icon = item.icon;
          const isActive = segment === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(`/fun/${item.path}`)}
              title={collapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                width: '100%',
                padding: collapsed ? '11px 18px' : '10px 18px',
                background: isActive ? 'rgba(0,180,198,0.1)' : 'transparent',
                border: 'none',
                borderLeft: `3px solid ${isActive ? TEAL : 'transparent'}`,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.13s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={16} color={isActive ? TEAL : 'rgba(255,255,255,0.45)'} style={{ flexShrink: 0 }}/>
              {!collapsed && (
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.8125rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Back to Planora */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '8px 0' }}>
        <button
          onClick={() => navigate('/')}
          title={collapsed ? 'Back to Planora' : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            width: '100%',
            padding: collapsed ? '11px 18px' : '10px 18px',
            background: 'transparent',
            border: 'none',
            borderLeft: '3px solid transparent',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <ChevronLeft size={16} color="rgba(255,255,255,0.28)" style={{ flexShrink: 0 }}/>
          {!collapsed && (
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.8125rem',
              color: 'rgba(255,255,255,0.28)',
            }}>Back to Planora</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default function FunApp() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const id = 'fun-google-fonts';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F4F7FA' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)}/>
      <main style={{ flex: 1, overflowY: 'auto', minHeight: '100vh' }}>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route index                  element={<FunDashboard />} />
            <Route path="budgeting"       element={<Budgeting />} />
            <Route path="debt-credit"     element={<DebtCredit />} />
            <Route path="investing"       element={<Investing />} />
            <Route path="insurance"       element={<Insurance />} />
            <Route path="estate"          element={<Estate />} />
            <Route path="retirement"      element={<Retirement />} />
            <Route path="major-purchases" element={<MajorPurchases />} />
            <Route path="life-events"     element={<LifeEvents />} />
            <Route path="resources"       element={<Resources />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
