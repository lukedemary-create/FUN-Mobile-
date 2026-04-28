import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../../components/shared/Header'
import { PerformanceChart } from '../../components/shared/PortfolioChart'
import { useApp } from '../../context/AppContext'
import { advisor, fmt, categoryIcon, goalCategoryColor } from '../../data/demoData'

export default function ClientDashboard() {
  const { selectedClientId, getClientData } = useApp()
  const navigate = useNavigate()
  const client = getClientData(selectedClientId)

  const alpha = client.ytdReturn - client.benchmarkReturn
  const unread = client.messages?.filter(m => !m.read && m.sender === 'advisor').length || 0
  const pendingItems = client.actionItems?.filter(i => !i.completed).length || 0
  const pendingAgenda = client.agendaItems?.filter(i => !i.completed).length || 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Header
        title={`Welcome back, ${client.firstName}`}
        subtitle={`${client.riskProfile} Portfolio · Nexus Capital Management`}
        liveLabel="LIVE DATA"
      />
      <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>

        {/* Portfolio Value Hero */}
        <div style={styles.hero}>
          <div style={styles.heroLeft}>
            <div style={styles.heroLabel}>TOTAL PORTFOLIO VALUE</div>
            <div style={styles.heroValue}>{fmt.currency(client.portfolioValue)}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
              <div style={styles.heroBadge}>
                <span style={{ color: 'var(--success)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  +{client.ytdReturn}%
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>YTD Return</span>
              </div>
              <div style={styles.heroBadge}>
                <span style={{ color: alpha >= 0 ? 'var(--success)' : 'var(--danger)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  {alpha >= 0 ? '+' : ''}{alpha.toFixed(1)}%
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>vs Benchmark</span>
              </div>
              <div style={styles.heroBadge}>
                <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  {client.riskProfile}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Risk Profile</span>
              </div>
            </div>
          </div>
          <div style={styles.heroChart}>
            <PerformanceChart data={client.performanceHistory} height={110} />
          </div>
        </div>

        {/* Alert Banners */}
        {unread > 0 && (
          <div style={styles.alertBanner} onClick={() => navigate('/nexus/client/messages')}>
            <span style={{ fontSize: 14 }}>💬</span>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>
              {unread} new message{unread > 1 ? 's' : ''} from {advisor.name}
            </span>
            <span style={{ fontSize: 12, color: 'var(--gold)' }}>View →</span>
          </div>
        )}

        {/* Main Grid */}
        <div style={styles.mainGrid}>

          {/* Advisor Card */}
          <div className="card" style={{ gridColumn: '1' }}>
            <div className="section-title" style={{ marginBottom: 14 }}>Your Advisor</div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
              <div style={styles.advisorAvatar}>MC</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{advisor.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{advisor.title}</div>
                <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                  {advisor.credentials.map(c => (
                    <span key={c} className="badge badge-gold">{c}</span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { label: 'Last Contact', value: fmt.relDate(client.lastInteraction) },
                { label: 'Next Meeting', value: fmt.meetingDate(client.nextMeeting) },
                { label: 'Meeting Type', value: client.nextMeetingType },
                { label: 'Location', value: client.nextMeetingLocation },
              ].map(r => (
                <div key={r.label} style={styles.metaRow}>
                  <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{r.label}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'right', maxWidth: 200 }}>{r.value}</span>
                </div>
              ))}
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 14, justifyContent: 'center' }}
              onClick={() => navigate('/nexus/client/messages')}
            >
              Message Marcus
            </button>
          </div>

          {/* Goals Summary */}
          <div className="card" style={{ gridColumn: '2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div className="section-title">Goal Progress</div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/nexus/client/goals')}>View All</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {client.goals?.map(g => (
                <div key={g.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{g.name}</span>
                    <span className={`badge ${g.onTrack ? 'badge-success' : 'badge-warning'}`}>
                      {g.onTrack ? 'On Track' : 'Behind'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: goalCategoryColor[g.category] || 'var(--gold)' }}>
                      {fmt.compact(g.current)}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-tertiary)' }}>
                      {Math.round((g.current / g.target) * 100)}% of {fmt.compact(g.target)}
                    </span>
                  </div>
                  <div className="progress-bar" style={{ height: 4 }}>
                    <div className="progress-fill" style={{
                      width: `${Math.min(100, (g.current / g.target) * 100)}%`,
                      background: g.onTrack ? 'var(--success)' : 'var(--warning)',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Items */}
          <div className="card" style={{ gridColumn: '3' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div className="section-title">Action Items</div>
              {pendingItems > 0 && <span className="badge badge-warning">{pendingItems} open</span>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {client.actionItems?.filter(i => !i.completed).slice(0, 4).map(item => (
                <div key={item.id} style={styles.actionItem}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 4,
                    background: item.priority === 'high' ? 'var(--danger)' : item.priority === 'medium' ? 'var(--warning)' : 'var(--text-tertiary)',
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.4 }}>{item.text}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>
                      Due {fmt.date(item.dueDate)} · {item.owner === 'client' ? 'Your action' : item.owner === 'advisor' ? "Marcus's action" : 'Both'}
                    </div>
                  </div>
                </div>
              ))}
              {pendingItems === 0 && (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-tertiary)', fontSize: 12 }}>
                  All caught up!
                </div>
              )}
            </div>
          </div>

          {/* Recent Life Events */}
          <div className="card" style={{ gridColumn: '1 / 3' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div className="section-title">Your Life Events</div>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/nexus/client/life-events')}>
                + Log Event
              </button>
            </div>
            {client.lifeEvents?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {client.lifeEvents.slice(0, 3).map((ev, i) => (
                  <div key={ev.id} style={{
                    display: 'flex',
                    gap: 12,
                    padding: '12px 0',
                    borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{ fontSize: 20 }}>{categoryIcon[ev.category] || '📌'}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{ev.title}</div>
                        <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{fmt.relDate(ev.date)}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.4 }}>{ev.description}</div>
                      {ev.advisorNote && (
                        <div style={{ fontSize: 11, color: 'var(--gold)', marginTop: 6 }}>↗ Marcus: {ev.advisorNote.slice(0, 80)}…</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '24px 0' }}>
                <div style={{ fontSize: 12 }}>No life events logged yet. Share what's happening in your life.</div>
              </div>
            )}
          </div>

          {/* Meeting Agenda Preview */}
          <div className="card" style={{ gridColumn: '3' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div className="section-title">Upcoming Meeting</div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/nexus/client/agenda')}>View</button>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--gold)', marginBottom: 4 }}>
                {fmt.meetingDate(client.nextMeeting)}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{client.nextMeetingType} · {client.nextMeetingLocation}</div>
            </div>
            {pendingAgenda > 0 && (
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>
                {pendingAgenda} agenda item{pendingAgenda !== 1 ? 's' : ''} to cover
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {client.agendaItems?.slice(0, 3).map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: 3,
                    border: `1px solid ${item.completed ? 'var(--success)' : 'var(--border-light)'}`,
                    background: item.completed ? 'var(--success)' : 'transparent',
                    flexShrink: 0, marginTop: 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {item.completed && <span style={{ color: '#fff', fontSize: 9, fontWeight: 700 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 12, color: item.completed ? 'var(--text-tertiary)' : 'var(--text-secondary)', textDecoration: item.completed ? 'line-through' : 'none' }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  hero: {
    display: 'flex',
    alignItems: 'center',
    gap: 24,
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderLeft: '3px solid var(--gold)',
    borderRadius: 12,
    padding: '20px 24px',
    marginBottom: 16,
  },
  heroLeft: {
    flexShrink: 0,
    width: 340,
  },
  heroLabel: {
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--text-tertiary)',
    marginBottom: 6,
  },
  heroValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: 34,
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
    lineHeight: 1,
  },
  heroBadge: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    padding: '6px 12px',
    background: 'var(--bg-surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 6,
  },
  heroChart: {
    flex: 1,
    height: 110,
  },
  alertBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 14px',
    background: 'var(--gold-glow)',
    border: '1px solid var(--gold-dim)',
    borderRadius: 8,
    marginBottom: 16,
    cursor: 'pointer',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 14,
  },
  advisorAvatar: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: 'var(--gold-glow)',
    border: '2px solid var(--gold-dim)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--gold)',
    flexShrink: 0,
    letterSpacing: '0.05em',
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '5px 0',
    borderBottom: '1px solid var(--border)',
  },
  actionItem: {
    display: 'flex',
    gap: 8,
    alignItems: 'flex-start',
  },
}
