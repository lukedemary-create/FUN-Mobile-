import React, { useState } from 'react'
import { Header } from '../../components/shared/Header'
import { useApp } from '../../context/AppContext'
import { fmt } from '../../data/demoData'
import { BarChart2, Folder } from 'lucide-react'

const CATEGORIES = ['All', 'reports', 'planning', 'tax', 'agreements', 'analysis', 'memo']

export default function ClientDocuments() {
  const { selectedClientId, getClientData } = useApp()
  const client = getClientData(selectedClientId)
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [dragging, setDragging] = useState(false)

  const docs = client.documents || []
  const filtered = docs.filter(d => {
    const matchCat = category === 'All' || d.category === category
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Header
        title="Document Vault"
        subtitle={`${docs.length} documents shared between you and Marcus`}
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
          style={{ ...styles.dropZone, ...(dragging ? styles.dropZoneActive : {}) }}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false) }}
        >
          <UploadIcon size={18} />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Drop files here, or <span style={{ color: 'var(--gold)', cursor: 'pointer' }}>browse</span>
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Upload tax docs, statements, or any file to share with Marcus</span>
        </div>

        {/* Filters */}
        <div style={styles.filters}>
          <div style={{ position: 'relative', flex: 1 }}>
            <SearchIcon />
            <input
              className="input"
              style={{ paddingLeft: 30 }}
              placeholder="Search documents…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className="btn btn-ghost btn-sm"
                style={{
                  textTransform: c === 'All' ? 'none' : 'capitalize',
                  ...(category === c ? { background: 'var(--gold-glow)', borderColor: 'var(--gold-dim)', color: 'var(--gold)' } : {}),
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Latest Reports Banner */}
        {filtered.filter(d => d.category === 'reports').length > 0 && (
          <div style={styles.reportsBanner}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <BarChart2 size={16} color="var(--gold)" />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                  Latest: {filtered.find(d => d.category === 'reports')?.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  Your most recent portfolio report is ready to view.
                </div>
              </div>
            </div>
            <button className="btn btn-primary btn-sm">
              <DownloadIcon />
              Download
            </button>
          </div>
        )}

        {/* Documents List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.map(doc => (
            <div key={doc.id} className="card" style={styles.docRow}>
              <div style={styles.docIcon}>
                <FileIcon type={doc.type} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>
                  {doc.name}
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{doc.sizeMb} MB</span>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{fmt.date(doc.date)}</span>
                  <span className="tag">{doc.category}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {doc.sharedBy === 'advisor' ? (
                      <>
                        <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--gold-glow)', border: '1px solid var(--gold-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 700, color: 'var(--gold)' }}>
                          MC
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--gold)' }}>Shared by Marcus</span>
                      </>
                    ) : (
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Uploaded by you</span>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-ghost btn-sm"><EyeIcon />View</button>
                <button className="btn btn-ghost btn-sm"><DownloadIcon />Save</button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="empty-state">
              <Folder size={32} color="var(--text-tertiary)" />
              <div>No documents match your search.</div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div style={styles.summary}>
          {[
            { label: 'Total Documents', value: docs.length },
            { label: 'From Marcus', value: docs.filter(d => d.sharedBy === 'advisor').length },
            { label: 'Uploaded by You', value: docs.filter(d => d.sharedBy === 'client').length },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--gold)' }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const FileIcon = ({ type }) => {
  const color = { report: '#c9a84c', policy: '#4a8fff', analysis: '#2dd4a4', memo: '#a78bfa', document: '#7a8fad' }[type] || '#7a8fad'
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
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
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
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
    gap: 10,
    marginBottom: 14,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  reportsBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: 'var(--gold-glow)',
    border: '1px solid var(--gold-dim)',
    borderRadius: 10,
    marginBottom: 12,
    gap: 12,
  },
  docRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '12px 16px',
  },
  docIcon: {
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
  summary: {
    display: 'flex',
    justifyContent: 'center',
    gap: 48,
    marginTop: 20,
    padding: '14px',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
  },
}
