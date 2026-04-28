import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../../components/shared/Header'
import { StatCard } from '../../components/shared/StatCard'
import { useApp } from '../../context/AppContext'
import { clients, advisor, fmt, engagementColor, engagementLabel, categoryIcon, totalAUM } from '../../data/demoData'

export default function AdvisorDashboard() {
  const { clientData } = useApp()
  const navigate = useNavigate()

  const avgYTD = (clients.reduce((s, c) => s + c.ytdReturn, 0) / clients.length).toFixed(1)
  const avgEngagement = Math.round(clients.reduce((s, c) => s + c.engagementScore, 0) / clients.length)

  // Gather all life events across clients, sorted by date
  const allLifeEvents = clients.flatMap(c =>
    (clientData[c.id]?.lifeEvents || c.lifeEvents).map(le => ({ ...le, clientName: c.firstName, clientId: c.id }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

  // Clients needing attention (low engagement)
  const needsAttention = clients.filter(c => c.engagementScore < 70).sort((a, b) => a.engagementScore - b.engagementScore)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Header
        title="Overview"
        subtitle={`${advisor.firm} · ${advisor.name}`}
        liveLabel="LIVE"
      />
      <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>

        {/* AUM Ticker */}
        <div style={styles.aumBar}>
          <div>
            <div style={styles.aumLabel}>TOTAL ASSETS UNDER MANAGEMENT</div>
            <div style={styles.aumValue}>{fmt.currency(totalAUM)}</div>
          </div>
          <div style={styles.aumDivider} />
          <div style={styles.aumMeta}>
            <div>
              <div style={styles.aumLabel}>YTD PORTFOLIO RETURN (AVG)</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 600, color: 'var(--success)', marginTop: 3 }}>
                +{avgYTD}%
              </div>
            </div>
            <div>
              <div style={styles.aumLabel}>BENCHMARK (S&P 500 EQ)</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 3 }}>
                +7.1%
              </div>
            </div>
            <div>
              <div style={styles.aumLabel}>ALPHA GENERATED</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 600, color: 'var(--gold)', marginTop: 3 }}>
                +{(avgYTD - 7.1).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={styles.statsGrid}>
          <StatCard
            label="Active Clients"
            value={advisor.clientCount}
            sub="4 shown in demo"
            accent="var(--gold)"
          />
          <StatCard
            label="Avg Engagement Score"
            value={`${avgEngagement}/100`}
            change={avgEngagement >= 70 ? 2.4 : -8.1}
            changeLabel="vs last quarter"
            accent={engagementColor(avgEngagement)}
          />
          <StatCard
            label="Messages Sent (30d)"
            value="14"
            sub="2 broadcasts, 12 direct"
            accent="var(--info)"
          />
          <StatCard
            label="Meetings Scheduled"
            value="4"
            sub="Next 30 days"
            accent="var(--purple)"
          />
        </div>

        <div style={styles.twoCol}>
          {/* Client Engagement Roster */}
          <div className="card" style={{ flex: 1.4 }}>
            <div className="section-header">
              <div className="section-title">Client Engagement</div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/nexus/advisor/clients')}>
                View All
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {clients.map(client => (
                <div
                  key={client.id}
                  onClick={() => navigate(`/nexus/advisor/clients/${client.id}`)}
                  style={styles.clientRow}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={styles.clientAvatar}>{client.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {client.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginLeft: 8 }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 12,
                          fontWeight: 600,
                          color: engagementColor(client.engagementScore),
                        }}>
                          {client.engagementScore}
                        </span>
                        <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>/ 100</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                      <div className="score-bar">
                        <div style={{
                          height: '100%',
                          width: `${client.engagementScore}%`,
                          background: engagementColor(client.engagementScore),
                          borderRadius: 2,
                          transition: 'width 0.4s ease',
                        }} />
                      </div>
                      <span style={{ fontSize: 10, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                        {fmt.relDate(client.lastInteraction)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Life Events Feed */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card" style={{ flex: 1 }}>
              <div className="section-header">
                <div className="section-title">Recent Life Events</div>
                <span className="badge badge-gold">
                  {allLifeEvents.length} new
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {allLifeEvents.map((ev, i) => (
                  <div
                    key={ev.id}
                    onClick={() => navigate(`/nexus/advisor/clients/${ev.clientId}`)}
                    style={{
                      ...styles.eventRow,
                      borderBottom: i < allLifeEvents.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={styles.eventEmoji}>{categoryIcon[ev.category] || '📌'}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                          {ev.clientName}: {ev.title}
                        </div>
                        <span style={{ fontSize: 10, color: 'var(--text-tertiary)', whiteSpace: 'nowrap', marginTop: 1 }}>
                          {fmt.relDate(ev.date)}
                        </span>
                      </div>
                      {ev.advisorNote && (
                        <div style={{ fontSize: 11, color: 'var(--gold)', marginTop: 3, lineHeight: 1.4 }}>
                          ↗ {ev.advisorNote.slice(0, 70)}{ev.advisorNote.length > 70 ? '…' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Needs Attention */}
            {needsAttention.length > 0 && (
              <div className="card" style={{ background: 'rgba(240,96,96,0.04)', borderColor: 'rgba(240,96,96,0.2)' }}>
                <div className="section-header" style={{ marginBottom: 10 }}>
                  <div className="section-title" style={{ color: 'var(--danger)' }}>Needs Attention</div>
                  <span className="badge badge-danger">{needsAttention.length}</span>
                </div>
                {needsAttention.map(c => (
                  <div
                    key={c.id}
                    onClick={() => navigate(`/nexus/advisor/clients/${c.id}`)}
                    style={{ ...styles.attentionRow, cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    <div style={styles.clientAvatar}>{c.initials}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                        Last contact: {fmt.relDate(c.lastInteraction)} · Score: {c.engagementScore}/100
                      </div>
                    </div>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={e => { e.stopPropagation(); navigate(`/nexus/advisor/clients/${c.id}`) }}
                      style={{ color: 'var(--danger)', borderColor: 'rgba(240,96,96,0.3)', fontSize: 11 }}
                    >
                      Reach Out
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="card" style={{ marginTop: 16 }}>
          <div className="section-header">
            <div className="section-title">Upcoming Meetings</div>
          </div>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
            {clients
              .filter(c => c.nextMeeting)
              .sort((a, b) => new Date(a.nextMeeting) - new Date(b.nextMeeting))
              .map(c => (
                <div
                  key={c.id}
                  onClick={() => navigate(`/nexus/advisor/clients/${c.id}`)}
                  style={styles.meetingCard}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.background = 'var(--bg-surface-3)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-surface-2)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={styles.clientAvatar}>{c.initials}</div>
                    <span className="badge badge-gold" style={{ fontSize: 10 }}>{c.nextMeetingType}</span>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{c.firstName}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{c.name}</div>
                  </div>
                  <div style={{ marginTop: 10, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--gold)' }}>
                    {fmt.meetingDate(c.nextMeeting)}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{c.nextMeetingLocation}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  aumBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 28,
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderLeft: '3px solid var(--gold)',
    borderRadius: 12,
    padding: '18px 24px',
    marginBottom: 20,
  },
  aumLabel: {
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--text-tertiary)',
    marginBottom: 2,
  },
  aumValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: 28,
    fontWeight: 700,
    color: 'var(--gold)',
    letterSpacing: '-0.02em',
    lineHeight: 1,
  },
  aumDivider: {
    width: 1,
    height: 48,
    background: 'var(--border)',
  },
  aumMeta: {
    display: 'flex',
    gap: 32,
    flex: 1,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 12,
    marginBottom: 16,
  },
  twoCol: {
    display: 'flex',
    gap: 16,
    alignItems: 'flex-start',
  },
  clientRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 8px',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'background 0.1s',
    marginBottom: 2,
  },
  clientAvatar: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'var(--bg-surface-3)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text-secondary)',
    flexShrink: 0,
    letterSpacing: '0.05em',
  },
  eventRow: {
    display: 'flex',
    gap: 10,
    padding: '10px 4px',
    cursor: 'pointer',
    borderRadius: 6,
    transition: 'background 0.1s',
  },
  eventEmoji: {
    fontSize: 18,
    flexShrink: 0,
    lineHeight: 1.3,
  },
  attentionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 4px',
    borderRadius: 6,
    transition: 'opacity 0.15s',
  },
  meetingCard: {
    flexShrink: 0,
    width: 200,
    background: 'var(--bg-surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '14px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
}
