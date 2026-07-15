import { useState } from 'react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader, MBadge } from '../../components/MCard'
import { C, UI, MONO } from '../../tokens'

const EVENTS = [
  { date:'Mon Jun 30', time:'8:30 AM', event:'PCE Price Index', impact:'high', prev:'2.6%', est:'2.5%', actual:'-' },
  { date:'Mon Jun 30', time:'9:45 AM', event:'Chicago PMI', impact:'medium', prev:'45.4', est:'46.2', actual:'-' },
  { date:'Tue Jul 1',  time:'10:00 AM',event:'ISM Manufacturing PMI', impact:'high', prev:'48.7', est:'49.0', actual:'-' },
  { date:'Tue Jul 1',  time:'10:00 AM',event:'JOLTS Job Openings', impact:'high', prev:'7.19M', est:'7.30M', actual:'-' },
  { date:'Wed Jul 2',  time:'8:15 AM', event:'ADP Nonfarm Employment', impact:'high', prev:'152K', est:'160K', actual:'-' },
  { date:'Wed Jul 2',  time:'10:00 AM',event:'ISM Services PMI', impact:'high', prev:'51.6', est:'52.0', actual:'-' },
  { date:'Thu Jul 3',  time:'8:30 AM', event:'Jobless Claims', impact:'medium', prev:'233K', est:'228K', actual:'-' },
  { date:'Thu Jul 3',  time:'8:30 AM', event:'Trade Balance', impact:'medium', prev:'-$74.6B', est:'-$73.0B', actual:'-' },
  { date:'Fri Jul 4',  time:'—',       event:'Independence Day — Markets Closed', impact:'holiday', prev:'', est:'', actual:'-' },
  { date:'Fri Jul 5',  time:'8:30 AM', event:'Nonfarm Payrolls', impact:'high', prev:'139K', est:'155K', actual:'-' },
  { date:'Fri Jul 5',  time:'8:30 AM', event:'Unemployment Rate', impact:'high', prev:'4.2%', est:'4.2%', actual:'-' },
]

const impactColor = { high: C.danger, medium: C.warning, holiday: C.t3 }
const impactLabel = { high: 'High', medium: 'Med', holiday: 'Holiday' }

export default function MEconomicCalendar() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? EVENTS : EVENTS.filter(e => e.impact === filter)

  let lastDate = ''
  return (
    <div style={{ background:C.bg, minHeight:'100dvh' }}>
      <ScreenHeader title="Economic Calendar" subtitle="Macro Events" accent={C.teal} />

      <div style={{ display:'flex', gap:8, padding:'12px 16px 0' }}>
        {['all','high','medium'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:'7px 14px', borderRadius:8, cursor:'pointer',
            border:`1px solid ${filter===f ? C.teal : C.b2}`,
            background: filter===f ? C.tealDim : 'transparent',
            color: filter===f ? C.teal : C.t3,
            fontFamily:UI, fontSize:12, fontWeight:600,
          }}>{f==='all'?'All Events':f==='high'?'High Impact':'Medium'}</button>
        ))}
      </div>

      <div style={{ padding:'12px 16px 0' }}>
        {filtered.map((ev, i) => {
          const showDate = ev.date !== lastDate
          if (showDate) lastDate = ev.date
          return (
            <div key={i}>
              {showDate && (
                <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.t3, textTransform:'uppercase', letterSpacing:'0.12em', padding:'14px 0 6px' }}>
                  {ev.date}
                </div>
              )}
              <div style={{
                background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14,
                padding:'14px', marginBottom:8,
                borderLeft: ev.impact==='high' ? `3px solid ${C.danger}` : ev.impact==='medium' ? `3px solid ${C.warning}` : `3px solid ${C.b2}`,
              }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:UI, fontSize:14, fontWeight:600, color:C.t1 }}>{ev.event}</div>
                    <div style={{ fontFamily:MONO, fontSize:11, color:C.t3, marginTop:2 }}>{ev.time}</div>
                  </div>
                  <MBadge color={impactColor[ev.impact]}>{impactLabel[ev.impact]}</MBadge>
                </div>
                {ev.prev && (
                  <div style={{ display:'flex', gap:16, marginTop:10 }}>
                    {[['Previous',ev.prev],['Estimate',ev.est],['Actual',ev.actual]].map(([l,v])=>(
                      <div key={l}>
                        <div style={{ fontFamily:UI, fontSize:9, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em' }}>{l}</div>
                        <div style={{ fontFamily:MONO, fontSize:13, fontWeight:700, color: l==='Actual' && v!=='-' ? C.gold : C.t1 }}>{v||'—'}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ height:20 }} />
    </div>
  )
}
