import React, { useState } from 'react'
import { Header } from '../../components/shared/Header'
import { useApp } from '../../context/AppContext'
import { advisor, fmt } from '../../data/demoData'

export default function MeetingAgenda() {
  const { selectedClientId, getClientData, toggleAgendaItem, addAgendaItem } = useApp()
  const client = getClientData(selectedClientId)
  const [newItem, setNewItem] = useState('')
  const [adding, setAdding] = useState(false)

  const agendaItems = client.agendaItems || []
  const completed = agendaItems.filter(i => i.completed).length
  const total = agendaItems.length

  function handleAddItem(e) {
    e.preventDefault()
    if (!newItem.trim()) return
    addAgendaItem(selectedClientId, newItem.trim(), 'client')
    setNewItem('')
    setAdding(false)
  }

  const daysDiff = Math.ceil((new Date(client.nextMeeting) - new Date('2026-04-04')) / 86400000)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Header
        title="Meeting Agenda"
        subtitle={`${client.nextMeetingType} · ${fmt.meetingDate(client.nextMeeting)}`}
      />
      <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>

        {/* Meeting Card */}
        <div style={styles.meetingHero}>
          <div style={styles.meetingLeft}>
            <div style={styles.countdown}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 48, fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>
                {Math.max(0, daysDiff)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Days Away
              </div>
            </div>
          </div>
          <div style={styles.meetingRight}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 8 }}>
              Upcoming Meeting
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
              {client.nextMeetingType}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={styles.metaRow}>
                <CalendarIcon />
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold)' }}>{fmt.meetingDate(client.nextMeeting)}</span>
              </div>
              <div style={styles.metaRow}>
                <LocationIcon />
                <span style={{ color: 'var(--text-secondary)' }}>{client.nextMeetingLocation}</span>
              </div>
              <div style={styles.metaRow}>
                <PersonIcon />
                <span style={{ color: 'var(--text-secondary)' }}>{advisor.name} · {advisor.title}</span>
              </div>
            </div>
          </div>
          <div style={styles.progressWrap}>
            <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Agenda Progress</div>
            <div style={{ position: 'relative', width: 80, height: 80 }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="var(--bg-surface-3)" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="32"
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth="6"
                  strokeDasharray={`${(completed / Math.max(total, 1)) * 201} 201`}
                  strokeDashoffset="50"
                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--gold)' }}>
                  {completed}/{total}
                </div>
                <div style={{ fontSize: 9, color: 'var(--text-tertiary)' }}>items</div>
              </div>
            </div>
          </div>
        </div>

        {/* Agenda Items */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="section-title">Shared Agenda</div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setAdding(v => !v)}
            >
              + Add Item
            </button>
          </div>

          {adding && (
            <form onSubmit={handleAddItem} style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <input
                className="input"
                placeholder="Add an agenda item…"
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
                autoFocus
              />
              <button className="btn btn-primary" type="submit" disabled={!newItem.trim()}>Add</button>
              <button className="btn btn-ghost" type="button" onClick={() => setAdding(false)}>Cancel</button>
            </form>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {agendaItems.length === 0 && (
              <div className="empty-state" style={{ padding: 24 }}>
                <span style={{ fontSize: 28 }}>📋</span>
                <div>No agenda items yet. Add something to discuss with Marcus.</div>
              </div>
            )}
            {agendaItems.map((item, i) => (
              <div
                key={item.id}
                style={{
                  ...styles.agendaItem,
                  background: item.completed ? 'var(--bg-surface-2)' : 'transparent',
                  opacity: item.completed ? 0.65 : 1,
                }}
              >
                <button
                  onClick={() => toggleAgendaItem(selectedClientId, item.id)}
                  style={{
                    ...styles.checkbox,
                    borderColor: item.completed ? 'var(--success)' : 'var(--border-light)',
                    background: item.completed ? 'var(--success)' : 'transparent',
                  }}
                >
                  {item.completed && <span style={{ color: '#fff', fontSize: 9, fontWeight: 700, lineHeight: 1 }}>✓</span>}
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: item.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
                    textDecoration: item.completed ? 'line-through' : 'none',
                  }}>
                    {item.text}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>
                    Added by {item.addedBy === 'advisor' ? advisor.name : 'you'}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {item.addedBy === 'advisor' && (
                    <div style={styles.advisorTag}>MC</div>
                  )}
                  {item.addedBy === 'client' && (
                    <div style={styles.clientTag}>{client.initials}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div style={styles.tipCard}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gold)', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Getting the Most From Your Meeting
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Add agenda items ahead of time so Marcus can prepare',
              'Check off items as you discuss them during the call',
              'Any life events logged before the meeting will be reviewed',
              'Action items from the meeting will appear in your dashboard',
            ].map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 1 }}>→</span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const LocationIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const PersonIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)

const styles = {
  meetingHero: {
    display: 'flex',
    gap: 0,
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderLeft: '3px solid var(--gold)',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  meetingLeft: {
    padding: '24px 28px',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdown: {
    textAlign: 'center',
  },
  meetingRight: {
    flex: 1,
    padding: '24px 28px',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 12,
  },
  progressWrap: {
    padding: '24px 28px',
    borderLeft: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  agendaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '11px 14px',
    borderRadius: 8,
    transition: 'all 0.15s',
    border: '1px solid transparent',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  advisorTag: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: 'var(--gold-glow)',
    border: '1px solid var(--gold-dim)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 8,
    fontWeight: 700,
    color: 'var(--gold)',
  },
  clientTag: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: 'var(--bg-surface-3)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 8,
    fontWeight: 700,
    color: 'var(--text-secondary)',
  },
  tipCard: {
    padding: '16px 20px',
    background: 'var(--gold-glow)',
    border: '1px solid var(--gold-dim)',
    borderRadius: 10,
  },
}
