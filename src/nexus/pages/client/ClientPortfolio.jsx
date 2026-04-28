import React, { useState } from 'react'
import { Header } from '../../components/shared/Header'
import { PerformanceChart, AllocationPie } from '../../components/shared/PortfolioChart'
import { useApp } from '../../context/AppContext'
import { fmt } from '../../data/demoData'

const PERIODS = ['3M', '6M', 'YTD', '1Y', 'ALL']

export default function ClientPortfolio() {
  const { selectedClientId, getClientData } = useApp()
  const [period, setPeriod] = useState('1Y')
  const client = getClientData(selectedClientId)

  const alpha = client.ytdReturn - client.benchmarkReturn
  const periodData = {
    '3M': client.performanceHistory?.slice(-3),
    '6M': client.performanceHistory?.slice(-6),
    'YTD': client.performanceHistory?.slice(-3),
    '1Y': client.performanceHistory,
    'ALL': client.performanceHistory,
  }[period] || client.performanceHistory

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Header
        title="Portfolio"
        subtitle={`${client.riskProfile} · ${fmt.currency(client.portfolioValue)}`}
        liveLabel="LIVE"
      />
      <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>

        {/* Key Metrics */}
        <div style={styles.metricsRow}>
          {[
            { label: 'Total Value',    value: fmt.compact(client.portfolioValue), color: 'var(--gold)',    sub: fmt.currency(client.portfolioValue) },
            { label: 'YTD Return',     value: `+${client.ytdReturn}%`,            color: 'var(--success)', sub: 'vs +7.1% benchmark' },
            { label: 'Alpha',          value: `${alpha >= 0 ? '+' : ''}${alpha.toFixed(1)}%`, color: alpha >= 0 ? 'var(--success)' : 'var(--danger)', sub: 'vs S&P 500 eq.' },
            { label: 'Risk Profile',   value: client.riskProfile,                 color: 'var(--text-primary)', sub: 'Current classification' },
          ].map(m => (
            <div key={m.label} className="card" style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: m.color, opacity: 0.7 }} />
              <div className="stat-label">{m.label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: m.color, marginTop: 8, letterSpacing: '-0.01em' }}>
                {m.value}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 5 }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Performance Chart */}
        <div className="card" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div className="section-title">Performance</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 3 }}>
                Portfolio vs benchmark · {period} view
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {PERIODS.map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className="btn btn-ghost btn-sm"
                  style={{
                    ...(period === p ? { background: 'var(--gold-glow)', borderColor: 'var(--gold-dim)', color: 'var(--gold)' } : {}),
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <PerformanceChart data={periodData} height={220} />
          <div style={{ display: 'flex', gap: 20, marginTop: 16, justifyContent: 'center' }}>
            {[
              { color: 'var(--gold)', label: 'Your Portfolio', dash: false },
              { color: 'var(--info)', label: 'Benchmark (Blended)', dash: true },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                <div style={{ width: 24, height: 2, background: l.color, opacity: l.dash ? 0.7 : 1, backgroundImage: l.dash ? 'repeating-linear-gradient(90deg, var(--info) 0 4px, transparent 4px 7px)' : 'none' }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
          {/* Allocation */}
          <div className="card" style={{ flex: 1 }}>
            <div className="section-header" style={{ marginBottom: 16 }}>
              <div className="section-title">Asset Allocation</div>
            </div>
            <AllocationPie data={client.allocation} size={170} />
          </div>

          {/* Quick Stats */}
          <div className="card" style={{ width: 240, flexShrink: 0 }}>
            <div className="section-title" style={{ marginBottom: 14 }}>Portfolio Stats</div>
            {[
              { label: 'Total Value',      value: fmt.compact(client.portfolioValue), mono: true },
              { label: 'YTD Return',       value: `+${client.ytdReturn}%`,             mono: true, color: 'var(--success)' },
              { label: 'Benchmark',        value: `+${client.benchmarkReturn}%`,       mono: true, color: 'var(--text-secondary)' },
              { label: 'Alpha',            value: `+${alpha.toFixed(1)}%`,             mono: true, color: 'var(--success)' },
              { label: 'Holdings',         value: client.holdings?.length,             mono: true },
              { label: 'Risk Profile',     value: client.riskProfile },
              { label: 'Advisor',          value: 'Marcus Chen' },
              { label: 'Client Since',     value: new Date(client.joinDate).getFullYear(), mono: true },
            ].map((s, i, arr) => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{s.label}</span>
                <span style={{ fontSize: 12, fontFamily: s.mono ? 'var(--font-mono)' : 'var(--font-sans)', fontWeight: 500, color: s.color || 'var(--text-primary)' }}>
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Holdings Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="section-title">Holdings</div>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Prices as of market close</span>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Name</th>
                <th style={{ textAlign: 'right' }}>Value</th>
                <th style={{ textAlign: 'right' }}>Shares</th>
                <th style={{ textAlign: 'right' }}>Price</th>
                <th style={{ textAlign: 'right' }}>YTD Gain</th>
                <th style={{ textAlign: 'right' }}>Allocation</th>
              </tr>
            </thead>
            <tbody>
              {client.holdings?.map(h => (
                <tr key={h.ticker} style={{ cursor: 'default' }}>
                  <td><span className="ticker-chip">{h.ticker}</span></td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{h.name}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 13 }}>
                    {fmt.compact(h.value)}
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
                    {h.shares?.toLocaleString() ?? '—'}
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
                    ${h.price.toFixed(2)}
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--success)' }}>
                    +{h.gainPct}%
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                      <div style={{ width: 52, height: 3, background: 'var(--bg-surface-3)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${h.allocPct}%`, height: '100%', background: 'var(--gold)', borderRadius: 2 }} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', width: 32, textAlign: 'right' }}>
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
    </div>
  )
}

const styles = {
  metricsRow: {
    display: 'flex',
    gap: 12,
    marginBottom: 14,
  },
}
