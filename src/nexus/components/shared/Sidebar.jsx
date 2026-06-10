import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

const NexusLogo = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="var(--gold)" strokeWidth="1.5"/>
    <polygon points="14,7 21,11 21,17 14,21 7,17 7,11" fill="none" stroke="var(--gold)" strokeWidth="1" opacity="0.5"/>
    <circle cx="14" cy="14" r="2.5" fill="var(--gold)"/>
  </svg>
)

export function AdvisorSidebar({ unreadTotal }) {
  const { logout } = useApp()
  const navigate = useNavigate()

  const navItems = [
    { to: '/nexus/advisor',           label: 'Overview',    icon: GridIcon,       exact: true  },
    { to: '/nexus/advisor/clients',   label: 'Clients',     icon: UsersIcon                    },
    { to: '/nexus/advisor/messages',  label: 'Broadcast',   icon: MegaphoneIcon                },
    { to: '/nexus/advisor/documents', label: 'Documents',   icon: FolderIcon                   },
  ]

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoWrap}>
        <NexusLogo />
        <div>
          <div style={styles.logoText}>NEXUS</div>
          <div style={styles.logoSub}>Advisor Portal</div>
        </div>
      </div>

      <nav style={styles.nav}>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            style={({ isActive }) => ({ ...styles.navItem, ...(isActive ? styles.navItemActive : {}) })}
          >
            {({ isActive }) => (
              <>
                <item.icon size={15} color={isActive ? 'var(--gold)' : 'var(--text-tertiary)'} />
                <span style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {item.label}
                </span>
                {item.label === 'Broadcast' && unreadTotal > 0 && (
                  <span className="notif-badge" style={{ marginLeft: 'auto' }}>{unreadTotal}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div style={styles.bottom}>
        <div style={styles.divider}/>
        <div style={styles.advisorCard}>
          <div style={styles.avatar}>MC</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Marcus Chen</div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>CFP® · CFA</div>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/') }}
          style={styles.logoutBtn}
        >
          <LogoutIcon size={13} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

export function ClientSidebar({ client, unreadCount }) {
  const { logout } = useApp()
  const navigate = useNavigate()

  const navItems = [
    { to: '/nexus/client',              label: 'Dashboard',   icon: GridIcon,   exact: true },
    { to: '/nexus/client/portfolio',    label: 'Portfolio',   icon: ChartIcon               },
    { to: '/nexus/client/goals',        label: 'Goals',       icon: TargetIcon              },
    { to: '/nexus/client/life-events',  label: 'Life Events', icon: HeartIcon               },
    { to: '/nexus/client/agenda',       label: 'Meeting',     icon: CalendarIcon            },
    { to: '/nexus/client/messages',     label: 'Messages',    icon: MessageIcon             },
    { to: '/nexus/client/documents',    label: 'Documents',   icon: FolderIcon              },
  ]

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoWrap}>
        <NexusLogo />
        <div>
          <div style={styles.logoText}>NEXUS</div>
          <div style={styles.logoSub}>Client Portal</div>
        </div>
      </div>

      <nav style={styles.nav}>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            style={({ isActive }) => ({ ...styles.navItem, ...(isActive ? styles.navItemActive : {}) })}
          >
            {({ isActive }) => (
              <>
                <item.icon size={15} color={isActive ? 'var(--gold)' : 'var(--text-tertiary)'} />
                <span style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {item.label}
                </span>
                {item.label === 'Messages' && unreadCount > 0 && (
                  <span className="notif-badge" style={{ marginLeft: 'auto' }}>{unreadCount}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div style={styles.bottom}>
        <div style={styles.divider}/>
        {client && (
          <div style={styles.advisorCard}>
            <div style={{ ...styles.avatar, background: 'var(--bg-surface-3)', color: 'var(--text-secondary)' }}>
              {client.initials}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{client.firstName}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{client.riskProfile}</div>
            </div>
          </div>
        )}
        <button
          onClick={() => { logout(); navigate('/') }}
          style={styles.logoutBtn}
        >
          <LogoutIcon size={13} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

// ─── Inline SVG Icons (avoiding import issues) ────
const GridIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
)
const UsersIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const MegaphoneIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l19-9-9 19-2-8-8-2z"/>
  </svg>
)
const FolderIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
)
const ChartIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
)
const TargetIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
)
const HeartIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)
const CalendarIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const MessageIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)
const LogoutIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

const styles = {
  sidebar: {
    width: 'var(--sidebar-width)',
    minWidth: 'var(--sidebar-width)',
    height: '100vh',
    background: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    flexShrink: 0,
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '18px 16px 16px',
    borderBottom: '1px solid var(--border)',
  },
  logoText: {
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    fontSize: 15,
    letterSpacing: '0.2em',
    color: 'var(--gold)',
    lineHeight: 1,
  },
  logoSub: {
    fontSize: 10,
    color: 'var(--text-tertiary)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  nav: {
    flex: 1,
    padding: '12px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    overflowY: 'auto',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    padding: '8px 10px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 13,
    fontWeight: 500,
    transition: 'all 0.15s',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  navItemActive: {
    background: 'var(--gold-glow)',
    borderRadius: 6,
  },
  bottom: {
    padding: '0 8px 16px',
  },
  divider: {
    borderTop: '1px solid var(--border)',
    margin: '12px 0',
  },
  advisorCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 10px',
    marginBottom: 4,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    background: 'var(--gold-glow)',
    border: '1px solid var(--gold-dim)',
    color: 'var(--gold)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 700,
    flexShrink: 0,
    letterSpacing: '0.05em',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    width: '100%',
    padding: '7px 10px',
    borderRadius: 'var(--radius-sm)',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-tertiary)',
    fontSize: 12,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
}
