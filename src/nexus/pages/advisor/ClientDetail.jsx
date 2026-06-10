import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Header } from '../../components/shared/Header'
import { PerformanceChart, AllocationPie } from '../../components/shared/PortfolioChart'
import { MetricRow } from '../../components/shared/StatCard'
import { useApp } from '../../context/AppContext'
import { clients, fmt, engagementColor, engagementLabel, categoryIcon } from '../../data/demoData'
import { ClipboardList } from 'lucide-react'

const TABS = ['Overview', 'Portfolio', 'Life Events', 'Action Items', 'Messages', 'Documents']

export default function ClientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getClientData, toggleActionItem, sendMessage, markMessagesRead } = useApp()
  const [tab, setTab] = useState('Overview')
  const [messageText, setMessageText] = useState('')

  const baseClient = clients.find(c => c.id === id)
  if (!baseClient) return <div style={{ padding: 40, color: 'var(--text-secondary)' }}>Client not found.</div>

  const client = getClientData(id)
  const alpha = client.ytdReturn - client.benchmarkReturn

  function handleSendMessage() {
    if (!messageText.trim()) return
    sendMessage(id, messageText.trim(), 'advisor')
    setMessageText('')
  }

  React.useEffect(() => {
    markMessagesRead(id)
  }, [id])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Header
        title={client.name}
        subtitle={`${client.occupation} · ${client.employer} · ${client.location}`}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/nexus/advisor/clients')}>
              ← All Clients
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => setTab('Messages')}>
              Message Client
            </button>
          </div>
        }
      />

      {/* Tab Bar */}
      <div style={styles.tabBar}>
        <div style={{ display: 'flex', gap: 2 }}>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }}
            >
              {t}
              {t === 'Messages' && client.messages?.filter(m => !m.read && m.sender === 'client').length > 0 && (
                <span className="notif-badge" style={{ marginLeft: 6, fontSize: 9 }}>
                  {client.messages.filter(m => !m.read && m.sender === 'client').length}
                </span>
              )}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={styles.engBadge}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: engagementColor(client.engagementScore),
            }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: engagementColor(client.engagementScore) }}>
              {client.engagementScore}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>· {engagementLabel(client.engagementScore)}</span>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
            Next: {fmt.meetingDate(client.nextMeeting)}
          </span>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>

        {/* ── OVERVIEW ────────────────────────────────── */}
        {tab === 'Overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {[
                { label: 'Portfolio Value', value: fmt.compact(client.portfolioValue), color: 'var(--gold)' },
                { label: 'YTD Return', value: `+${client.ytdReturn}%`, color: 'var(--success)' },
                { label: 'vs Benchmark', value: `${alpha >= 0 ? '+' : ''}${alpha.toFixed(1)}%`, color: alpha >= 0 ? 'var(--success)' : 'var(--danger)' },
                { label: 'Client Since', value: new Date(client.joinDate).getFullYear(), color: 'var(--text-primary)' },
              ].map(s => (
                <div key={s.label} className="card">
                  <div className="stat-label">{s.label}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: s.color, marginTop: 8 }}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 16 }}>
              {/* Profile Card */}
              <div className="card" style={{ width: 260, flexShrink: 0 }}>
                <div style={{ textAlign: 'center', paddingBottom: 16, borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
                  <div style={styles.bigAvatar}>{client.initials}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginTop: 10 }}>{client.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>{client.occupation}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>{client.employer}</div>
                </div>
                <MetricRow label="Email" value={client.email} border />
                <MetricRow label="Phone" value={client.phone} mono border />
                <MetricRow label="Location" value={client.location} border />
                <MetricRow label="Age" value={client.age} mono border />
                <MetricRow label="Risk Profile" value={client.riskProfile} />
              </div>

              {/* Performance Chart */}
              <div className="card" style={{ flex: 1 }}>
                <div className="section-header">
                  <div className="section-title">12-Month Performance</div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 11 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 20, height: 2, background: 'var(--gold)' }} />
                      <span style={{ color: 'var(--text-secondary)' }}>Portfolio</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 20, height: 2, background: 'var(--info)', opacity: 0.7, backgroundImage: 'repeating-linear-gradient(90deg, var(--info) 0 4px, transparent 4px 7px)' }} />
                      <span style={{ color: 'var(--text-secondary)' }}>Benchmark</span>
                    </div>
                  </div>
                </div>
                <PerformanceChart data={client.performanceHistory} height={180} />
              </div>

              {/* Allocation */}
              <div className="card" style={{ width: 320, flexShrink: 0 }}>
                <div className="section-header" style={{ marginBottom: 16 }}>
                  <div className="section-title">Asset Allocation</div>
                </div>
                <AllocationPie data={client.allocation} size={160} />
              </div>
            </div>

            {/* Goals */}
            <div className="card">
              <div className="section-header">
                <div className="section-title">Financial Goals</div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                {client.goals.map(g => (
                  <div key={g.id} style={styles.goalCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{g.name}</div>
                      <span className={`badge ${g.onTrack ? 'badge-success' : 'badge-warning'}`}>
                        {g.onTrack ? 'On Track' : 'Behind'}
                      </span>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color: 'var(--gold)' }}>
                          {fmt.compact(g.current)}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-tertiary)' }}>
                          / {fmt.compact(g.target)}
                        </span>
                      </div>
                      <div className="progress-bar" style={{ height: 5 }}>
                        <div className="progress-fill" style={{
                          width: `${Math.min(100, (g.current / g.target) * 100)}%`,
                          background: g.onTrack ? 'var(--success)' : 'var(--warning)',
                        }} />
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 6 }}>
                        {Math.round((g.current / g.target) * 100)}% · Target {new Date(g.targetDate).getFullYear()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PORTFOLIO ───────────────────────────────── */}
        {tab === 'Portfolio' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <div className="card" style={{ flex: 2 }}>
                <div className="section-header">
                  <div className="section-title">12-Month Performance vs Benchmark</div>
                </div>
                <PerformanceChart data={client.performanceHistory} height={220} />
              </div>
              <div className="card" style={{ flex: 1 }}>
                <div className="section-header" style={{ marginBottom: 16 }}>
                  <div className="section-title">Asset Allocation</div>
                </div>
                <AllocationPie data={client.allocation} size={150} />
              </div>
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px 0', borderBottom: '1px solid var(--border)' }}>
                <div className="section-title">Holdings</div>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Ticker</th>
                    <th>Name</th>
                    <th style={{ textAlign: 'right' }}>Value</th>
                    <th style={{ textAlign: 'right' }}>Shares</th>
                    <th style={{ textAlign: 'right' }}>Price</th>
                    <th style={{ textAlign: 'right' }}>Gain YTD</th>
                    <th style={{ textAlign: 'right' }}>Allocation</th>
                  </tr>
                </thead>
                <tbody>
                  {client.holdings.map(h => (
                    <tr key={h.ticker} style={{ cursor: 'default' }}>
                      <td><span className="ticker-chip">{h.ticker}</span></td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{h.name}</td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        {fmt.compact(h.value)}
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                        {h.shares?.toLocaleString() ?? '—'}
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                        ${h.price.toFixed(2)}
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--success)', fontWeight: 600 }}>
                        +{h.gainPct}%
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                          <div style={{ width: 48, height: 3, background: 'var(--bg-surface-3)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ width: `${h.allocPct}%`, height: '100%', background: 'var(--gold)', borderRadius: 2 }} />
                          </div>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
                            {h.allocPct}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── LIFE EVENTS ─────────────────────────────── */}
        {tab === 'Life Events' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(client.lifeEvents || []).map(ev => (
                <div key={ev.id} className="card" style={{ border: `1px solid ${eventColor(ev.category)}38`, borderTop: `2px solid ${eventColor(ev.category)}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ fontSize: '0.5rem', fontWeight: 800, letterSpacing: '0.05em', color: 'var(--text-tertiary)', width: 32, textAlign: 'center', paddingTop: 2 }}>{categoryIcon[ev.category] || 'EVT'}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{ev.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
                          {ev.description}
                        </div>
                        {ev.advisorNote && (
                          <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--gold-glow)', border: '1px solid var(--gold-dim)', borderRadius: 6, fontSize: 12, color: 'var(--gold)' }}>
                            <strong>Advisor Note:</strong> {ev.advisorNote}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{fmt.date(ev.date)}</div>
                      <span className={`tag`} style={{ marginTop: 4, display: 'inline-block', textTransform: 'capitalize' }}>
                        {ev.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {(!client.lifeEvents || client.lifeEvents.length === 0) && (
                <div className="empty-state">
                  <ClipboardList size={32} color="var(--text-tertiary)" />
                  <div>No life events logged yet.</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ACTION ITEMS ────────────────────────────── */}
        {tab === 'Action Items' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(client.actionItems || []).map(item => (
                <div
                  key={item.id}
                  className="card"
                  style={{
                    ...styles.actionItem,
                    opacity: item.completed ? 0.6 : 1,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleActionItem(id, item.id)}
                    style={styles.checkbox}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: item.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                      textDecoration: item.completed ? 'line-through' : 'none',
                    }}>
                      {item.text}
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 5 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Due: {fmt.date(item.dueDate)}</span>
                      <span className={`badge ${ownerColor(item.owner)}`}>{item.owner}</span>
                      <span className={`badge ${priorityColor(item.priority)}`}>{item.priority}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MESSAGES ────────────────────────────────── */}
        {tab === 'Messages' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 700 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(client.messages || []).map(msg => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: msg.sender === 'advisor' ? 'flex-start' : 'flex-end' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 3, paddingLeft: msg.sender === 'advisor' ? 4 : 0, paddingRight: msg.sender === 'client' ? 4 : 0 }}>
                    {msg.sender === 'advisor' ? 'Marcus Chen' : client.firstName} · {fmt.relDate(msg.timestamp)}
                  </div>
                  <div className={`message-bubble ${msg.sender}`}>{msg.text}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <textarea
                className="input"
                style={{ minHeight: 80, flex: 1, resize: 'none' }}
                placeholder={`Message ${client.firstName}…`}
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSendMessage() }}
              />
              <button className="btn btn-primary" onClick={handleSendMessage} style={{ alignSelf: 'flex-end', padding: '10px 18px' }}>
                Send
              </button>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>⌘ + Enter to send</div>
          </div>
        )}

        {/* ── DOCUMENTS ───────────────────────────────── */}
        {tab === 'Documents' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(client.documents || []).map(doc => (
                <div key={doc.id} className="card" style={{ ...styles.docRow }}>
                  <div style={styles.docIcon}><DocIcon /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{doc.name}</div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{doc.sizeMb} MB</span>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{fmt.date(doc.date)}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Shared by {doc.sharedBy}</span>
                      <span className="tag">{doc.category}</span>
                    </div>
                  </div>
                  <button className="btn btn-ghost btn-sm">
                    <DownloadIcon />
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

const eventColor = (cat) => {
  const m = { family: 'var(--success)', career: 'var(--gold)', financial: 'var(--info)', health: 'var(--danger)', education: 'var(--purple)' }
  return m[cat] || 'var(--border-light)'
}
const ownerColor = (o) => ({ advisor: 'badge-info', client: 'badge-gold', both: 'badge-purple' }[o] || 'badge-info')
const priorityColor = (p) => ({ high: 'badge-danger', medium: 'badge-warning', low: 'badge-success' }[p] || 'badge-info')

const DocIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)
const DownloadIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

const styles = {
  tabBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-secondary)',
    flexShrink: 0,
    gap: 16,
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 14px',
    fontSize: 12,
    fontWeight: 500,
    color: 'var(--text-secondary)',
    background: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  },
  tabActive: {
    color: 'var(--text-primary)',
    borderBottomColor: 'var(--gold)',
  },
  engBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 10px',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 100,
  },
  bigAvatar: {
    width: 52,
    height: 52,
    borderRadius: '50%',
    background: 'var(--gold-glow)',
    border: '2px solid var(--gold-dim)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--gold)',
    margin: '0 auto',
    letterSpacing: '0.05em',
  },
  goalCard: {
    flex: 1,
    background: 'var(--bg-surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '14px 16px',
  },
  actionItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '14px 16px',
    transition: 'opacity 0.2s',
  },
  checkbox: {
    width: 16,
    height: 16,
    marginTop: 2,
    cursor: 'pointer',
    accentColor: 'var(--gold)',
  },
  docRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '12px 16px',
  },
  docIcon: {
    width: 38,
    height: 38,
    background: 'var(--bg-surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
}
