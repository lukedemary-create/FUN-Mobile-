import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { clients } from '../data/demoData'

const NexusLogo = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <polygon points="26,3 49,14 49,38 26,49 3,38 3,14" fill="none" stroke="#c9a84c" strokeWidth="1.5"/>
    <polygon points="26,12 40,19.5 40,32.5 26,40 12,32.5 12,19.5" fill="none" stroke="#c9a84c" strokeWidth="1" opacity="0.45"/>
    <polygon points="26,19 34,23.5 34,28.5 26,33 18,28.5 18,23.5" fill="none" stroke="#c9a84c" strokeWidth="1" opacity="0.25"/>
    <circle cx="26" cy="26" r="4" fill="#c9a84c"/>
  </svg>
)

export default function RoleSelector() {
  const { enterAdvisor, enterClient } = useApp()
  const navigate = useNavigate()
  const [selectedClient, setSelectedClient] = useState(clients[0].id)
  const [hovering, setHovering] = useState(null)

  function handleAdvisor() {
    enterAdvisor()
    navigate('/nexus/advisor')
  }

  function handleClient() {
    enterClient(selectedClient)
    navigate('/nexus/client')
  }

  return (
    <div style={styles.root}>
      {/* Background grid */}
      <div style={styles.grid} />

      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <NexusLogo />
          <div>
            <div style={styles.logoText}>NEXUS</div>
            <div style={styles.logoTagline}>Wealth Management Platform</div>
          </div>
        </div>
        <div style={styles.firmBadge}>
          <span>Nexus Capital Management</span>
        </div>
      </div>

      {/* Main content */}
      <div style={styles.content}>
        <div style={styles.hero}>
          <div style={styles.pill}>
            <span className="live-dot" />
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--success)', letterSpacing: '0.06em' }}>
              SECURE SESSION
            </span>
          </div>
          <h1 style={styles.heading}>Select your workspace</h1>
          <p style={styles.subheading}>
            Private advisor-client platform for the modern wealth management practice.
          </p>
        </div>

        <div style={styles.cards}>
          {/* Advisor Card */}
          <div
            style={{
              ...styles.card,
              ...(hovering === 'advisor' ? styles.cardHover : {}),
            }}
            onMouseEnter={() => setHovering('advisor')}
            onMouseLeave={() => setHovering(null)}
          >
            <div style={styles.cardAccent} />
            <div style={styles.cardIcon}>
              <AdvisorIcon />
            </div>
            <div style={styles.cardLabel}>ADVISOR PORTAL</div>
            <div style={styles.cardTitle}>Command Center</div>
            <div style={styles.cardDesc}>
              Manage your entire book of business. Track engagement, send personalized
              updates, view all client portfolios, and run your practice from one workspace.
            </div>
            <div style={styles.features}>
              {['Client portfolio overview', 'Engagement scoring', 'Broadcast messaging', 'Document vault'].map(f => (
                <div key={f} style={styles.featureItem}>
                  <CheckIcon />
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <div style={styles.cardMeta}>
              <div style={styles.metaRow}>
                <span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>Logged in as</span>
                <span style={{ color: 'var(--text-primary)', fontSize: 12, fontWeight: 500 }}>Marcus Chen, CFP® · CFA</span>
              </div>
              <div style={styles.metaRow}>
                <span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>AUM</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold)', fontSize: 13, fontWeight: 500 }}>$47.5M</span>
              </div>
              <div style={styles.metaRow}>
                <span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>Clients</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontSize: 13 }}>23</span>
              </div>
            </div>
            <button style={styles.cardBtn} onClick={handleAdvisor}>
              Enter Advisor Portal
              <ArrowIcon />
            </button>
          </div>

          {/* Client Card */}
          <div
            style={{
              ...styles.card,
              ...styles.cardClient,
              ...(hovering === 'client' ? styles.cardClientHover : {}),
            }}
            onMouseEnter={() => setHovering('client')}
            onMouseLeave={() => setHovering(null)}
          >
            <div style={{ ...styles.cardAccent, background: 'var(--text-tertiary)' }} />
            <div style={styles.cardIcon}>
              <ClientIcon />
            </div>
            <div style={styles.cardLabel}>CLIENT PORTAL</div>
            <div style={styles.cardTitle}>Your Financial World</div>
            <div style={styles.cardDesc}>
              Your private view of your portfolio, advisor relationship, goals, and
              financial life — always current, always secure.
            </div>
            <div style={styles.features}>
              {['Live portfolio dashboard', 'Goal tracking', 'Life event logging', 'Secure messaging'].map(f => (
                <div key={f} style={styles.featureItem}>
                  <CheckIcon color="var(--text-secondary)" />
                  <span style={{ color: 'var(--text-secondary)' }}>{f}</span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Select Demo Client
              </div>
              <select
                value={selectedClient}
                onChange={e => setSelectedClient(e.target.value)}
                className="input"
                style={{ background: 'var(--bg-surface-3)', cursor: 'pointer' }}
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            {(() => {
              const c = clients.find(cl => cl.id === selectedClient)
              return c ? (
                <div style={styles.cardMeta}>
                  <div style={styles.metaRow}>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>Portfolio Value</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 500 }}>
                      ${(c.portfolioValue / 1_000_000).toFixed(2)}M
                    </span>
                  </div>
                  <div style={styles.metaRow}>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>YTD Return</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--success)', fontSize: 13 }}>+{c.ytdReturn}%</span>
                  </div>
                  <div style={styles.metaRow}>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>Risk Profile</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{c.riskProfile}</span>
                  </div>
                </div>
              ) : null
            })()}
            <button style={{ ...styles.cardBtn, ...styles.cardBtnClient }} onClick={handleClient}>
              Enter Client Portal
              <ArrowIcon />
            </button>
          </div>
        </div>

        <div style={styles.footer}>
          <div style={styles.footerDivider} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
            {['Bank-Grade Encryption', '256-bit TLS', 'SOC 2 Compliant', 'FINRA Registered'].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <ShieldIcon />
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const AdvisorIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3h7v7H3z"/><path d="M14 3h7v7h-7z"/><path d="M3 14h7v7H3z"/><path d="M14 17.5h7"/><path d="M17.5 14v7"/>
  </svg>
)
const ClientIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const CheckIcon = ({ color = 'var(--gold)' }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const ArrowIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)
const ShieldIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

const styles = {
  root: {
    minHeight: '100vh',
    background: 'var(--bg-primary)',
    position: 'relative',
    overflow: 'hidden',
  },
  grid: {
    position: 'absolute', inset: 0,
    backgroundImage: `
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px)
    `,
    backgroundSize: '48px 48px',
    opacity: 0.35,
    pointerEvents: 'none',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px 40px',
    borderBottom: '1px solid var(--border)',
    background: 'rgba(8,13,26,0.8)',
    backdropFilter: 'blur(12px)',
    position: 'relative',
    zIndex: 1,
  },
  logoText: {
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    fontSize: 24,
    letterSpacing: '0.3em',
    color: 'var(--gold)',
    lineHeight: 1,
  },
  logoTagline: {
    fontSize: 11,
    color: 'var(--text-tertiary)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  firmBadge: {
    padding: '6px 14px',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 100,
    fontSize: 12,
    color: 'var(--text-secondary)',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    maxWidth: 960,
    margin: '0 auto',
    padding: '60px 24px 40px',
  },
  hero: {
    textAlign: 'center',
    marginBottom: 52,
  },
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '5px 14px',
    background: 'var(--success-dim)',
    border: '1px solid rgba(45,212,164,0.2)',
    borderRadius: 100,
    marginBottom: 20,
  },
  heading: {
    fontSize: 38,
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
    lineHeight: 1.15,
    marginBottom: 14,
  },
  subheading: {
    fontSize: 15,
    color: 'var(--text-secondary)',
    maxWidth: 440,
    margin: '0 auto',
    lineHeight: 1.6,
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
  },
  card: {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    padding: 28,
    position: 'relative',
    overflow: 'hidden',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHover: {
    borderColor: 'var(--gold-dim)',
    boxShadow: 'var(--shadow-gold)',
  },
  cardClient: {
    borderColor: 'var(--border)',
  },
  cardClientHover: {
    borderColor: 'var(--border-light)',
    boxShadow: '0 0 30px rgba(255,255,255,0.04)',
  },
  cardAccent: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 2,
    background: 'var(--gold)',
    borderRadius: '16px 16px 0 0',
  },
  cardIcon: {
    width: 52,
    height: 52,
    background: 'var(--bg-surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.12em',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.01em',
    marginBottom: 12,
  },
  cardDesc: {
    fontSize: 13,
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    marginBottom: 20,
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 20,
    flex: 1,
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 12,
    color: 'var(--text-primary)',
  },
  cardMeta: {
    background: 'var(--bg-surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '10px 14px',
    marginBottom: 18,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '12px 20px',
    background: 'var(--gold)',
    color: '#09111f',
    border: 'none',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '0.01em',
    transition: 'background 0.15s',
    width: '100%',
  },
  cardBtnClient: {
    background: 'var(--bg-surface-3)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-light)',
  },
  footer: {
    marginTop: 52,
  },
  footerDivider: {
    borderTop: '1px solid var(--border)',
    marginBottom: 20,
  },
}
