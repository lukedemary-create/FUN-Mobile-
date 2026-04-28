import React, { useState } from 'react'
import { Header } from '../../components/shared/Header'
import { clients, broadcastMessages, fmt } from '../../data/demoData'

const TEMPLATES = {
  'Q1 Market Update': {
    subject: 'Q1 2026 Market Recap & Your Portfolio',
    body: `Dear {{firstName}},

I wanted to share some thoughts on Q1 2026 as markets navigated continued rate uncertainty with more resilience than expected.

Your {{riskProfile}} portfolio returned {{ytdReturn}}% YTD, {{vsLabel}} the benchmark by {{alphaBps}} basis points.

A few highlights:
• Fixed income sleeve performed well as rates stabilized
• International equity diversification proved its value in February
• Cash position being deployed selectively

I've posted the full Q1 report to your document vault. Looking forward to reviewing everything at our next meeting.

Best regards,
Marcus Chen, CFP® · CFA`,
  },
  'Tax Season': {
    subject: 'Year-End Tax Documents Available',
    body: `Dear {{firstName}},

Your year-end tax documents are now available in your NEXUS document vault, including:

• Form 1099-DIV
• Form 1099-B (Realized Gains/Losses)
• Year-End Portfolio Summary

Please share these with your tax professional. If you have any questions, don't hesitate to reach out.

Best,
Marcus`,
  },
  'Market Volatility': {
    subject: "Today's Market — What It Means for You",
    body: `Dear {{firstName}},

Markets are experiencing elevated volatility today, and I want to proactively share my perspective.

Your {{riskProfile}} portfolio is positioned for exactly this type of environment. The diversification we've built is doing its job.

My recommendation: stay the course. Short-term volatility is the price we pay for long-term returns. If you have questions or concerns, I'm available for a call.

Marcus`,
  },
}

export default function BroadcastMessages() {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [selectedClients, setSelectedClients] = useState(new Set(clients.map(c => c.id)))
  const [template, setTemplate] = useState('')
  const [sent, setSent] = useState(false)
  const [previewClient, setPreviewClient] = useState(clients[0].id)

  function applyTemplate(name) {
    if (!name) return
    const t = TEMPLATES[name]
    setSubject(t.subject)
    setBody(t.body)
    setTemplate(name)
  }

  function personalizeFor(clientId, text) {
    const c = clients.find(cl => cl.id === clientId)
    if (!c) return text
    const alpha = c.ytdReturn - c.benchmarkReturn
    return text
      .replace(/\{\{firstName\}\}/g, c.firstName)
      .replace(/\{\{riskProfile\}\}/g, c.riskProfile)
      .replace(/\{\{ytdReturn\}\}/g, `+${c.ytdReturn}%`)
      .replace(/\{\{vsLabel\}\}/g, alpha >= 0 ? 'outperforming' : 'underperforming')
      .replace(/\{\{alphaBps\}\}/g, Math.abs(Math.round(alpha * 100)))
  }

  function toggleClient(id) {
    setSelectedClients(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  function handleSend() {
    if (!subject || !body || selectedClients.size === 0) return
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  const previewC = clients.find(c => c.id === previewClient)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Header
        title="Broadcast Messages"
        subtitle="Send personalized messages to one or all clients"
        actions={
          <button
            className="btn btn-primary"
            onClick={handleSend}
            disabled={!subject || !body || selectedClients.size === 0}
          >
            <SendIcon />
            Send to {selectedClients.size} {selectedClients.size === 1 ? 'Client' : 'Clients'}
          </button>
        }
      />

      {sent && (
        <div style={styles.sentBanner}>
          <CheckIcon /> Message sent successfully to {selectedClients.size} client{selectedClients.size !== 1 ? 's' : ''}.
        </div>
      )}

      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ display: 'flex', height: '100%' }}>

          {/* Left: Compose */}
          <div style={styles.composePane}>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={styles.label}>Template</label>
                <select className="input" value={template} onChange={e => applyTemplate(e.target.value)}>
                  <option value="">— Start from scratch —</option>
                  {Object.keys(TEMPLATES).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label style={styles.label}>Subject Line</label>
                <input className="input" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Message subject…" />
              </div>

              <div>
                <label style={styles.label}>
                  Message Body
                  <span style={{ color: 'var(--text-tertiary)', fontWeight: 400, marginLeft: 8, fontSize: 10 }}>
                    Use {'{{firstName}}'}, {'{{riskProfile}}'}, {'{{ytdReturn}}'} for personalization
                  </span>
                </label>
                <textarea
                  className="input"
                  style={{ minHeight: 280, resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.7 }}
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  placeholder="Write your message here…"
                />
              </div>

              {/* Recipients */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={styles.label}>Recipients ({selectedClients.size} selected)</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setSelectedClients(new Set(clients.map(c => c.id)))}>All</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setSelectedClients(new Set())}>None</button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {clients.map(c => (
                    <label key={c.id} style={styles.recipientRow}>
                      <input
                        type="checkbox"
                        checked={selectedClients.has(c.id)}
                        onChange={() => toggleClient(c.id)}
                        style={{ accentColor: 'var(--gold)' }}
                      />
                      <div style={{ ...styles.miniAvatar }}>{c.initials}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{c.email}</div>
                      </div>
                      <button
                        onClick={(e) => { e.preventDefault(); setPreviewClient(c.id) }}
                        className="btn btn-ghost btn-sm"
                        style={{ fontSize: 10 }}
                      >
                        Preview
                      </button>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Middle divider */}
          <div style={styles.divider} />

          {/* Right: Preview + History */}
          <div style={styles.rightPane}>
            {/* Preview */}
            <div style={{ padding: '20px 20px 0' }}>
              <div style={styles.previewHeader}>
                <div className="section-title">Preview</div>
                <select
                  className="input"
                  style={{ width: 'auto', padding: '4px 10px', fontSize: 11 }}
                  value={previewClient}
                  onChange={e => setPreviewClient(e.target.value)}
                >
                  {clients.map(c => <option key={c.id} value={c.id}>{c.firstName}</option>)}
                </select>
              </div>
              <div style={styles.previewBox}>
                {subject || body ? (
                  <>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                      {personalizeFor(previewClient, subject)}
                    </div>
                    <pre style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                      {personalizeFor(previewClient, body)}
                    </pre>
                    <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--text-tertiary)' }}>
                      Sent via NEXUS Platform · Nexus Capital Management
                    </div>
                  </>
                ) : (
                  <div className="empty-state" style={{ padding: 32 }}>
                    <span style={{ fontSize: 28 }}>✉</span>
                    <div>Start typing to preview the message</div>
                  </div>
                )}
              </div>
            </div>

            {/* Sent History */}
            <div style={{ padding: '20px' }}>
              <div className="section-title" style={{ marginBottom: 12 }}>Message History</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {broadcastMessages.map(msg => (
                  <div key={msg.id} className="card" style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{msg.subject}</div>
                      <span className="badge badge-success">{msg.openRate}% opened</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 5, lineHeight: 1.4 }}>
                      {msg.preview}
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 11, color: 'var(--text-tertiary)' }}>
                      <span>{fmt.date(msg.sentDate)}</span>
                      <span>→ {msg.recipientIds.length} recipients</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const SendIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const styles = {
  composePane: {
    width: 440,
    flexShrink: 0,
    borderRight: '1px solid var(--border)',
    overflowY: 'auto',
  },
  divider: {
    width: 1,
    background: 'var(--border)',
    flexShrink: 0,
  },
  rightPane: {
    flex: 1,
    overflowY: 'auto',
  },
  label: {
    display: 'block',
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-tertiary)',
    marginBottom: 6,
  },
  recipientRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '7px 10px',
    background: 'var(--bg-surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 6,
    cursor: 'pointer',
  },
  miniAvatar: {
    width: 26,
    height: 26,
    borderRadius: '50%',
    background: 'var(--bg-surface-3)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    fontWeight: 600,
    color: 'var(--text-secondary)',
    flexShrink: 0,
  },
  previewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewBox: {
    background: 'var(--bg-surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '16px 18px',
    minHeight: 220,
    marginBottom: 20,
  },
  sentBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 24px',
    background: 'var(--success-dim)',
    borderBottom: '1px solid rgba(45,212,164,0.2)',
    fontSize: 13,
    color: 'var(--success)',
    fontWeight: 500,
  },
}
