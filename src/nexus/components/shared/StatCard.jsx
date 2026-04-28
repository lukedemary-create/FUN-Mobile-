import React from 'react'

export function StatCard({ label, value, change, changeLabel, accent, sub, icon }) {
  const isPositive = change > 0
  const isNegative = change < 0

  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
      {accent && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: accent, borderRadius: '12px 12px 0 0',
        }} />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="stat-label">{label}</div>
        {icon && <div style={{ color: 'var(--text-tertiary)', opacity: 0.7 }}>{icon}</div>}
      </div>
      <div className="stat-value" style={{ marginTop: 8 }}>{value}</div>
      {(change !== undefined || sub) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          {change !== undefined && (
            <span
              className="stat-change"
              style={{ color: isPositive ? 'var(--success)' : isNegative ? 'var(--danger)' : 'var(--text-secondary)' }}
            >
              {isPositive ? '▲' : isNegative ? '▼' : '—'} {Math.abs(change).toFixed(1)}%
            </span>
          )}
          {changeLabel && (
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{changeLabel}</span>
          )}
          {sub && !change && (
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{sub}</span>
          )}
        </div>
      )}
    </div>
  )
}

export function MetricRow({ label, value, mono, color, border }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '9px 0',
      borderBottom: border ? '1px solid var(--border)' : 'none',
    }}>
      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{
        fontSize: 13,
        fontWeight: 500,
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
        color: color || 'var(--text-primary)',
      }}>
        {value}
      </span>
    </div>
  )
}
