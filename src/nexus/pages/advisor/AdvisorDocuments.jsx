import React, { useState } from 'react'
import { Header } from '../../components/shared/Header'
import { clients, fmt } from '../../data/demoData'
import { Folder } from 'lucide-react'

const ALL_DOCS = clients.flatMap(c =>
  (c.documents || []).map(d => ({ ...d, clientName: c.name, clientId: c.id, clientInitials: c.initials }))
).sort((a, b) => new Date(b.date) - new Date(a.date))

const CATEGORIES = ['All', 'reports', 'planning', 'tax', 'agreements', 'analysis', 'memo']

export default function AdvisorDocuments() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [clientFilter, setClientFilter] = useState('All')
  const [dragging, setDragging] = useState(false)

  const filtered = ALL_DOCS.filter(d => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.clientName.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || d.category === category
    const matchClient = clientFilter === 'All' || d.clientId === clientFilter
    return matchSearch && matchCat && matchClient
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Header
        title="Document Vault"
        subtitle={`${ALL_DOCS.length} documents across all clients`}
        actions={
          <button className="btn btn-primary">
            <UploadIcon />
            Upload Document
          </button>
        }
      />
      <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>

        {/* Upload Zone */}
        <div
          style={{
            ...styles.dropZone,
            ...(dragging ? styles.dropZoneActive : {}),
          }}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false) }}
        >
          <UploadIcon size={20} />
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Drop files here to upload, or{' '}
            <span style={{ color: 'var(--gold)', cursor: 'pointer' }}>browse files</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>PDF, DOCX, XLSX up to 25MB</div>
        </div>

        {/* Filters */}
        <div style={styles.filters}>
          <div style={{ position: 'relative' }}>
            <SearchIcon />
            <input
              className="input"
              style={{ paddingLeft: 30, width: 220 }}
              placeholder="Search documents…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="btn btn-ghost btn-sm"
                style={{
                  ...(category === cat ? { background: 'var(--gold-glow)', borderColor: 'var(--gold-dim)', color: 'var(--gold)' } : {}),
                  textTransform: cat === 'All' ? 'none' : 'capitalize',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <select
            className="input"
            style={{ width: 'auto', padding: '6px 12px' }}
            value={clientFilter}
            onChange={e => setClientFilter(e.target.value)}
          >
            <option value="All">All Clients</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Document Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.map(doc => (
            <div key={`${doc.clientId}-${doc.id}`} className="card" style={styles.docRow}>
              <div style={styles.docIconWrap}>
                <DocIcon type={doc.type} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>{doc.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={styles.clientBubble}>{doc.clientInitials}</div>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{doc.clientName}</span>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{doc.sizeMb} MB</span>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{fmt.date(doc.date)}</span>
                  <span className="tag">{doc.category}</span>
                  <span style={{ fontSize: 11, color: doc.sharedBy === 'advisor' ? 'var(--gold)' : 'var(--text-tertiary)' }}>
                    {doc.sharedBy === 'advisor' ? '↑ You shared' : '↓ Client shared'}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-ghost btn-sm"><EyeIcon />View</button>
                <button className="btn btn-ghost btn-sm"><DownloadIcon />Download</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="empty-state">
              <Folder size={32} color="var(--text-tertiary)" />
              <div>No documents match your filters.</div>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div style={styles.statsRow}>
          {[
            { label: 'Total Documents', value: ALL_DOCS.length },
            { label: 'Shared by You', value: ALL_DOCS.filter(d => d.sharedBy === 'advisor').length },
            { label: 'From Clients', value: ALL_DOCS.filter(d => d.sharedBy === 'client').length },
            { label: 'Reports', value: ALL_DOCS.filter(d => d.category === 'reports').length },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--gold)' }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const DocIcon = ({ type }) => {
  const color = { report: '#c9a84c', policy: '#4a8fff', analysis: '#2dd4a4', memo: '#a78bfa', document: '#7a8fad' }[type] || '#7a8fad'
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
    </svg>
  )
}
const UploadIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}>
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const DownloadIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)
const EyeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)

const styles = {
  dropZone: {
    border: '2px dashed var(--border)',
    borderRadius: 12,
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: 'var(--text-tertiary)',
  },
  dropZoneActive: {
    borderColor: 'var(--gold-dim)',
    background: 'var(--gold-glow)',
  },
  filters: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  docRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '12px 16px',
    transition: 'border-color 0.15s',
  },
  docIconWrap: {
    width: 40,
    height: 40,
    background: 'var(--bg-surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  clientBubble: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: 'var(--bg-surface-3)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 9,
    fontWeight: 700,
    color: 'var(--text-secondary)',
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 48,
    marginTop: 20,
    padding: '16px',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
  },
}
