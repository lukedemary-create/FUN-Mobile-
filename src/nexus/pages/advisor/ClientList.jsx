import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../../components/shared/Header'
import { clients, fmt, engagementColor, engagementLabel } from '../../data/demoData'

export default function ClientList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('engagementScore')
  const [sortDir, setSortDir] = useState('desc')

  const filtered = clients
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.employer.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let va = a[sortBy], vb = b[sortBy]
      if (typeof va === 'string') va = va.toLowerCase(), vb = vb.toLowerCase()
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1)
    })

  function handleSort(col) {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(col); setSortDir('desc') }
  }

  const SortArrow = ({ col }) => {
    if (sortBy !== col) return <span style={{ color: 'var(--border-light)', marginLeft: 3 }}>↕</span>
    return <span style={{ color: 'var(--gold)', marginLeft: 3 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Header
        title="Client Roster"
        subtitle={`${clients.length} clients · ${fmt.compact(clients.reduce((s,c) => s+c.portfolioValue,0))} AUM`}
        actions={
          <div style={{ position: 'relative' }}>
            <SearchIcon style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              className="input"
              style={{ paddingLeft: 30, width: 220 }}
              placeholder="Search clients…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        }
      />
      <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table table-clickable">
            <thead>
              <tr>
                <th>Client</th>
                <th onClick={() => handleSort('portfolioValue')} style={{ cursor: 'pointer' }}>
                  Portfolio Value <SortArrow col="portfolioValue" />
                </th>
                <th onClick={() => handleSort('ytdReturn')} style={{ cursor: 'pointer' }}>
                  YTD Return <SortArrow col="ytdReturn" />
                </th>
                <th>vs Benchmark</th>
                <th onClick={() => handleSort('engagementScore')} style={{ cursor: 'pointer' }}>
                  Engagement <SortArrow col="engagementScore" />
                </th>
                <th>Risk Profile</th>
                <th onClick={() => handleSort('lastInteraction')} style={{ cursor: 'pointer' }}>
                  Last Contact <SortArrow col="lastInteraction" />
                </th>
                <th>Next Meeting</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map(client => {
                const alpha = client.ytdReturn - client.benchmarkReturn
                return (
                  <tr key={client.id} onClick={() => navigate(`/nexus/advisor/clients/${client.id}`)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={styles.avatar}>{client.initials}</div>
                        <div>
                          <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: 13 }}>{client.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{client.occupation} · {client.location}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>
                        {fmt.compact(client.portfolioValue)}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--success)', fontSize: 13 }}>
                        +{client.ytdReturn}%
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12,
                        color: alpha >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                        {alpha >= 0 ? '+' : ''}{alpha.toFixed(1)}%
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 60, height: 4, background: 'var(--bg-surface-3)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ width: `${client.engagementScore}%`, height: '100%', background: engagementColor(client.engagementScore), borderRadius: 2 }} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: engagementColor(client.engagementScore) }}>
                          {client.engagementScore}
                        </span>
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>{engagementLabel(client.engagementScore)}</div>
                    </td>
                    <td>
                      <span className="tag">{client.riskProfile}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{fmt.relDate(client.lastInteraction)}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                        {fmt.meetingDate(client.nextMeeting).split(' at ')[0]}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: 18, color: 'var(--text-tertiary)' }}>›</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div style={styles.summary}>
          <div style={styles.summaryItem}>
            <div className="stat-label">Total AUM</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 600, color: 'var(--gold)', marginTop: 2 }}>
              {fmt.compact(clients.reduce((s,c) => s+c.portfolioValue,0))}
            </div>
          </div>
          <div style={styles.summaryItem}>
            <div className="stat-label">Avg YTD Return</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 600, color: 'var(--success)', marginTop: 2 }}>
              +{(clients.reduce((s,c) => s+c.ytdReturn,0)/clients.length).toFixed(1)}%
            </div>
          </div>
          <div style={styles.summaryItem}>
            <div className="stat-label">Avg Engagement</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
              {Math.round(clients.reduce((s,c) => s+c.engagementScore,0)/clients.length)}/100
            </div>
          </div>
          <div style={styles.summaryItem}>
            <div className="stat-label">Clients Below 70</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 600, color: 'var(--danger)', marginTop: 2 }}>
              {clients.filter(c => c.engagementScore < 70).length}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const SearchIcon = ({ style }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

const styles = {
  avatar: {
    width: 34,
    height: 34,
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
  },
  summary: {
    display: 'flex',
    gap: 24,
    padding: '14px 20px',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    marginTop: 12,
  },
  summaryItem: {
    display: 'flex',
    flexDirection: 'column',
  },
}
