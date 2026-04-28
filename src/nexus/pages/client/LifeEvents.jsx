import React, { useState } from 'react'
import { Header } from '../../components/shared/Header'
import { useApp } from '../../context/AppContext'
import { fmt, categoryIcon } from '../../data/demoData'

const CATEGORIES = ['family', 'career', 'financial', 'health', 'education', 'travel']

const CAT_COLORS = {
  family: 'var(--success)',
  career: 'var(--gold)',
  financial: 'var(--info)',
  health: 'var(--danger)',
  education: 'var(--purple)',
  travel: 'var(--warning)',
}

export default function LifeEvents() {
  const { selectedClientId, getClientData, addLifeEvent } = useApp()
  const client = getClientData(selectedClientId)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ category: 'family', title: '', description: '', date: new Date().toISOString().split('T')[0] })
  const [submitting, setSubmitting] = useState(false)

  const events = [...(client.lifeEvents || [])].sort((a, b) => new Date(b.date) - new Date(a.date))

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    setSubmitting(true)
    setTimeout(() => {
      addLifeEvent(selectedClientId, { ...form, advisorNote: null, actionCreated: false })
      setForm({ category: 'family', title: '', description: '', date: new Date().toISOString().split('T')[0] })
      setShowForm(false)
      setSubmitting(false)
    }, 600)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Header
        title="Life Events"
        subtitle="Share what's happening in your life — your advisor will be notified"
        actions={
          <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
            + Log Life Event
          </button>
        }
      />
      <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>

        {showForm && (
          <div className="card" style={{ marginBottom: 20, borderColor: 'var(--gold-dim)' }}>
            <div className="section-title" style={{ marginBottom: 16 }}>Log a New Life Event</div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Category</label>
                  <select
                    className="input"
                    value={form.category}
                    onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c} style={{ textTransform: 'capitalize' }}>
                        {categoryIcon[c]} {c.charAt(0).toUpperCase() + c.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Date</label>
                  <input
                    type="date"
                    className="input"
                    value={form.date}
                    onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label style={styles.label}>Title</label>
                <input
                  className="input"
                  placeholder="e.g., New job offer, baby due, sold the house…"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label style={styles.label}>Details (optional)</label>
                <textarea
                  className="input"
                  style={{ minHeight: 72, resize: 'none' }}
                  placeholder="Add any details that might be helpful for your advisor…"
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                />
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button className="btn btn-primary" type="submit" disabled={submitting || !form.title.trim()}>
                  {submitting ? 'Notifying advisor…' : 'Submit & Notify Advisor'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginLeft: 8 }}>
                  Your advisor will receive an immediate notification.
                </span>
              </div>
            </form>
          </div>
        )}

        {/* Info Banner */}
        <div style={styles.infoBanner}>
          <span style={{ fontSize: 18 }}>💡</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>
              Why log life events?
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Life changes create financial planning opportunities. When you share what's happening, your advisor
              can proactively surface the right strategies — before you even have to ask.
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          {events.length > 0 && (
            <div style={styles.timelineLine} />
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {events.map((ev, i) => (
              <div key={ev.id} style={styles.timelineItem}>
                {/* Dot */}
                <div style={styles.timelineDotWrap}>
                  <div style={{ ...styles.timelineDot, borderColor: CAT_COLORS[ev.category] || 'var(--border-light)' }}>
                    <span style={{ fontSize: 14 }}>{categoryIcon[ev.category] || '📌'}</span>
                  </div>
                </div>

                {/* Card */}
                <div className="card" style={{ ...styles.eventCard, borderLeft: `3px solid ${CAT_COLORS[ev.category] || 'var(--border)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{ev.title}</div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{fmt.date(ev.date)}</span>
                        <span className="tag" style={{ textTransform: 'capitalize' }}>{ev.category}</span>
                      </div>
                    </div>
                  </div>

                  {ev.description && (
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: ev.advisorNote ? 12 : 0 }}>
                      {ev.description}
                    </div>
                  )}

                  {ev.advisorNote && (
                    <div style={styles.advisorNote}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                        <div style={styles.advisorDot}>MC</div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--gold)' }}>Marcus Chen · Advisor Note</span>
                        {ev.actionCreated && <span className="badge badge-success" style={{ fontSize: 9 }}>Action Created</span>}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {ev.advisorNote}
                      </div>
                    </div>
                  )}

                  {!ev.advisorNote && (
                    <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                      Pending advisor review…
                    </div>
                  )}
                </div>
              </div>
            ))}

            {events.length === 0 && (
              <div className="empty-state">
                <span style={{ fontSize: 40 }}>🌱</span>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>No life events logged yet</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', maxWidth: 320, textAlign: 'center' }}>
                  Life events help your advisor give you proactive, relevant guidance. Log your first event to get started.
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>Log Your First Event</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  label: {
    display: 'block',
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-tertiary)',
    marginBottom: 6,
  },
  infoBanner: {
    display: 'flex',
    gap: 14,
    alignItems: 'flex-start',
    padding: '14px 18px',
    background: 'var(--info-dim)',
    border: '1px solid rgba(74,143,255,0.2)',
    borderRadius: 10,
    marginBottom: 24,
  },
  timelineLine: {
    position: 'absolute',
    left: 23,
    top: 30,
    bottom: 30,
    width: 1,
    background: 'var(--border)',
    zIndex: 0,
  },
  timelineItem: {
    display: 'flex',
    gap: 20,
    alignItems: 'flex-start',
    marginBottom: 16,
    position: 'relative',
    zIndex: 1,
  },
  timelineDotWrap: {
    flexShrink: 0,
    paddingTop: 14,
  },
  timelineDot: {
    width: 46,
    height: 46,
    borderRadius: '50%',
    background: 'var(--bg-surface)',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventCard: {
    flex: 1,
    padding: '16px 18px',
  },
  advisorNote: {
    marginTop: 12,
    padding: '10px 14px',
    background: 'var(--gold-glow)',
    border: '1px solid var(--gold-dim)',
    borderRadius: 8,
  },
  advisorDot: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: 'var(--gold-dim)',
    border: '1px solid var(--gold)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 8,
    fontWeight: 700,
    color: 'var(--gold)',
    flexShrink: 0,
  },
}
