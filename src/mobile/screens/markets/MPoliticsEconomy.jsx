import { useState } from 'react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader, MBadge } from '../../components/MCard'
import { C, UI, MONO } from '../../tokens'

const EVENTS = [
  { date:'Jun 26', title:'Fed Chair Testimony — Senate Banking Committee', impact:'high', note:'Powell signals patient approach; markets price out September cut' },
  { date:'Jun 24', title:'House Passes Budget Reconciliation Bill', impact:'high', note:'$4.5T in tax and spending provisions; CBO scores $2.3T deficit increase over 10 years' },
  { date:'Jun 20', title:'US-China Trade Framework Talks Resume', impact:'medium', note:'Agricultural and semiconductor sectors watching closely' },
  { date:'Jun 18', title:'FOMC Meeting — Rates Held at 4.25–4.50%', impact:'high', note:'2 dissents; dot plot revised to 1 cut in 2026 vs 2 previously' },
  { date:'Jun 15', title:'Infrastructure Investment Act — Phase II Funding Released', impact:'medium', note:'$280B in clean energy and grid modernization over 5 years' },
  { date:'Jun 12', title:'CPI Comes in at 3.1% YoY — Below Consensus', impact:'high', note:'Core services inflation slowing; shelter component key to watch' },
]
const INDICATORS = [
  { label:'Fed Funds Rate',    value:'4.25–4.50%' },
  { label:'Next FOMC',        value:'Jul 29–30' },
  { label:'Rate Cut Prob.',   value:'18% (Sep)' },
  { label:'10Y Treasury',     value:'4.318%' },
  { label:'30Y Treasury',     value:'4.512%' },
  { label:'Dollar Index (DXY)', value:'104.82' },
]

const impactColor = { high: C.danger, medium: C.warning }

export default function MPoliticsEconomy() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? EVENTS : EVENTS.filter(e => e.impact === filter)

  return (
    <div style={{ background:C.bg, minHeight:'100dvh' }}>
      <ScreenHeader title="Political Intelligence" subtitle="Policy & Markets" accent={C.teal} />

      <div style={{ padding:'12px 16px 0', display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
        {INDICATORS.map(m => (
          <div key={m.label} style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:12, padding:'11px' }}>
            <div style={{ fontFamily:UI, fontSize:9, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:3 }}>{m.label}</div>
            <div style={{ fontFamily:MONO, fontSize:15, fontWeight:700, color:C.teal }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:8, padding:'14px 16px 0' }}>
        {['all','high','medium'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:'6px 12px', borderRadius:8, cursor:'pointer',
            border:`1px solid ${filter===f ? C.teal : C.b2}`,
            background: filter===f ? C.tealDim : 'transparent',
            color: filter===f ? C.teal : C.t3,
            fontFamily:UI, fontSize:12, fontWeight:600,
          }}>{f==='all'?'All Events':f==='high'?'High':'Medium'}</button>
        ))}
      </div>

      <div style={{ padding:'8px 16px 0' }}>
        {filtered.map((ev, i) => (
          <div key={i} style={{
            background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14,
            padding:'14px', marginBottom:8,
            borderLeft:`3px solid ${impactColor[ev.impact] || C.b2}`,
          }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, marginBottom:6 }}>
              <MBadge color={impactColor[ev.impact]}>{ev.impact.toUpperCase()}</MBadge>
              <span style={{ fontFamily:MONO, fontSize:10, color:C.t3 }}>{ev.date}</span>
            </div>
            <div style={{ fontFamily:UI, fontSize:13, fontWeight:600, color:C.t1, marginBottom:6 }}>{ev.title}</div>
            <div style={{ fontFamily:UI, fontSize:12, color:C.t3, lineHeight:1.6 }}>{ev.note}</div>
          </div>
        ))}
      </div>
      <div style={{ height:20 }} />
    </div>
  )
}
