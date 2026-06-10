import React, { useState, useEffect, useRef } from 'react'
import { Header } from '../../components/shared/Header'
import { useApp } from '../../context/AppContext'
import { advisor, fmt } from '../../data/demoData'
import { MessageSquare } from 'lucide-react'

export default function ClientMessages() {
  const { selectedClientId, getClientData, sendMessage, markMessagesRead } = useApp()
  const client = getClientData(selectedClientId)
  const [text, setText] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    markMessagesRead(selectedClientId)
  }, [selectedClientId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [client.messages])

  function handleSend() {
    if (!text.trim()) return
    sendMessage(selectedClientId, text.trim(), 'client')
    setText('')
  }

  const messages = client.messages || []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Header
        title="Messages"
        subtitle={`Secure channel with ${advisor.name}`}
        liveLabel="ENCRYPTED"
        actions={
          <div style={styles.advisorInfo}>
            <div style={styles.advisorAvatar}>MC</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{advisor.name}</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {advisor.credentials.map(c => (
                  <span key={c} className="badge badge-gold" style={{ fontSize: 9 }}>{c}</span>
                ))}
              </div>
            </div>
          </div>
        }
      />

      <div style={{ flex: 1, overflow: 'auto', padding: '24px 24px 0' }}>
        {messages.length === 0 ? (
          <div className="empty-state" style={{ height: '100%' }}>
            <MessageSquare size={40} color="var(--text-tertiary)" />
            <div style={{ fontSize: 14, fontWeight: 500 }}>No messages yet</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Start the conversation with your advisor.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 720, margin: '0 auto' }}>
            {/* Date header */}
            <div style={styles.dateHeader}>
              <div style={styles.dateLine} />
              <span style={styles.dateLabel}>Recent Messages</span>
              <div style={styles.dateLine} />
            </div>

            {messages.map((msg, i) => {
              const isAdvisor = msg.sender === 'advisor'
              const showAvatar = i === 0 || messages[i - 1].sender !== msg.sender
              return (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: isAdvisor ? 'flex-start' : 'flex-end' }}>
                  {showAvatar && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2, ...(isAdvisor ? {} : { flexDirection: 'row-reverse' }) }}>
                      <div style={isAdvisor ? styles.advisorAvatarSm : styles.clientAvatarSm}>
                        {isAdvisor ? 'MC' : client.initials}
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: isAdvisor ? 'var(--gold)' : 'var(--text-secondary)' }}>
                        {isAdvisor ? advisor.name : client.firstName}
                      </span>
                    </div>
                  )}
                  <div style={{ maxWidth: '72%' }}>
                    <div className={`message-bubble ${isAdvisor ? 'advisor' : 'client'}`}>
                      {msg.text}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 4, textAlign: isAdvisor ? 'left' : 'right' }}>
                      {fmt.relDate(msg.timestamp)}
                      {!msg.read && !isAdvisor && (
                        <span style={{ color: 'var(--gold)', marginLeft: 6 }}>Sent</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={styles.inputArea}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <textarea
              className="input"
              style={{ resize: 'none', minHeight: 52, maxHeight: 120 }}
              placeholder={`Message ${advisor.name}…`}
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && e.metaKey) handleSend()
              }}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={handleSend}
            disabled={!text.trim()}
            style={{ padding: '14px 20px', alignSelf: 'flex-end' }}
          >
            <SendIcon />
            Send
          </button>
        </div>
        <div style={{ maxWidth: 720, margin: '6px auto 0', fontSize: 10, color: 'var(--text-tertiary)' }}>
          ⌘+Enter to send · Messages are end-to-end encrypted
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

const styles = {
  advisorInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '6px 12px',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 8,
  },
  advisorAvatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'var(--gold-glow)',
    border: '2px solid var(--gold-dim)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--gold)',
    flexShrink: 0,
  },
  advisorAvatarSm: {
    width: 26,
    height: 26,
    borderRadius: '50%',
    background: 'var(--gold-glow)',
    border: '1px solid var(--gold-dim)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 9,
    fontWeight: 700,
    color: 'var(--gold)',
    flexShrink: 0,
  },
  clientAvatarSm: {
    width: 26,
    height: 26,
    borderRadius: '50%',
    background: 'var(--bg-surface-3)',
    border: '1px solid var(--border-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 9,
    fontWeight: 700,
    color: 'var(--text-secondary)',
    flexShrink: 0,
  },
  dateHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  dateLine: {
    flex: 1,
    height: 1,
    background: 'var(--border)',
  },
  dateLabel: {
    fontSize: 10,
    color: 'var(--text-tertiary)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  inputArea: {
    padding: '12px 24px 16px',
    borderTop: '1px solid var(--border)',
    background: 'var(--bg-secondary)',
  },
}
