import React from 'react'
import { fmt } from '../../data/demoData'

export function Header({ title, subtitle, actions, liveLabel }) {
  const now = new Date('2026-04-04T09:41:00')
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <h1 style={styles.title}>{title}</h1>
        {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
      </div>
      <div style={styles.right}>
        {liveLabel && (
          <div style={styles.liveChip}>
            <span className="live-dot" />
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--success)' }}>
              {liveLabel}
            </span>
          </div>
        )}
        {actions}
        <div style={styles.clock}>
          <span style={styles.time}>{timeStr}</span>
          <span style={styles.date}>{dateStr}</span>
        </div>
      </div>
    </header>
  )
}

const styles = {
  header: {
    height: 'var(--header-height)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 28px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-secondary)',
    flexShrink: 0,
    gap: 16,
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--text-primary)',
    letterSpacing: '-0.01em',
    lineHeight: 1,
  },
  subtitle: {
    fontSize: 11,
    color: 'var(--text-tertiary)',
    marginTop: 3,
    letterSpacing: '0.02em',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  liveChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 10px',
    background: 'var(--success-dim)',
    border: '1px solid rgba(45,212,164,0.2)',
    borderRadius: 100,
  },
  clock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 1,
  },
  time: {
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--text-primary)',
    lineHeight: 1,
  },
  date: {
    fontSize: 10,
    color: 'var(--text-tertiary)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
}
