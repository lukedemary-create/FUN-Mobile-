import { useState } from 'react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader } from '../../components/MCard'
import { C, UI, MONO } from '../../tokens'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'

const PERIODS = ['1M','3M','6M','1Y','5Y','Max']

const histData = {
  '1M': Array.from({length:22},(_,i)=>({ d:`Jun ${i+1}`, sp: 5700+Math.sin(i/3)*80+i*6, nq: 18000+Math.sin(i/2.5)*200+i*18 })),
  '3M': Array.from({length:13},(_,i)=>({ d:`W${i+1}`, sp: 5500+i*28+Math.sin(i)*60, nq: 17400+i*75+Math.sin(i)*150 })),
  '6M': Array.from({length:26},(_,i)=>({ d:`W${i+1}`, sp: 5200+i*24+Math.sin(i)*80, nq: 16200+i*84+Math.sin(i)*200 })),
  '1Y': Array.from({length:12},(_,i)=>({ d:['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'][i], sp: 4800+i*88+Math.sin(i)*100, nq: 15000+i*280+Math.sin(i)*300 })),
  '5Y': Array.from({length:20},(_,i)=>({ d:`Q${(i%4)+1}'${21+Math.floor(i/4)}`, sp: 3500+i*120+Math.sin(i)*200, nq: 11000+i*370+Math.sin(i)*500 })),
  'Max': Array.from({length:20},(_,i)=>({ d:`${2005+i}`, sp: 1200+i*230+Math.sin(i)*300, nq: 2000+i*810+Math.sin(i)*700 })),
}

export default function MMarketHistory() {
  const [period, setPeriod] = useState('1Y')
  const [series, setSeries] = useState('sp')

  const data = histData[period]

  return (
    <div style={{ background: C.bg, minHeight: '100dvh' }}>
      <ScreenHeader title="Market History" subtitle="Historical Data" accent={C.gold} />

      {/* Period selector */}
      <div style={{ display:'flex', gap:6, padding:'12px 16px 0', overflowX:'auto' }}>
        {PERIODS.map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            style={{
              padding:'7px 14px',
              borderRadius:8,
              border:`1px solid ${period===p ? C.gold : C.b2}`,
              background: period===p ? C.goldDim : C.surf,
              color: period===p ? C.gold : C.t2,
              fontFamily:UI, fontSize:12, fontWeight:600,
              cursor:'pointer', flexShrink:0,
            }}
          >{p}</button>
        ))}
      </div>

      {/* Series toggle */}
      <div style={{ display:'flex', gap:8, padding:'10px 16px 0' }}>
        {[['sp','S&P 500',C.gold],['nq','Nasdaq',C.teal]].map(([k,l,c]) => (
          <button
            key={k}
            onClick={() => setSeries(k)}
            style={{
              padding:'6px 12px', borderRadius:8,
              border:`1px solid ${series===k ? c : C.b2}`,
              background: series===k ? c+'18' : 'transparent',
              color: series===k ? c : C.t3,
              fontFamily:UI, fontSize:12, fontWeight:600,
              cursor:'pointer',
            }}
          >{l}</button>
        ))}
      </div>

      {/* Chart */}
      <div style={{ padding:'12px 16px 0' }}>
        <MCard>
          <div style={{ height:220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left:-20, right:8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.b1} />
                <XAxis dataKey="d" tick={{ fontFamily:MONO, fontSize:9, fill:C.t3 }} axisLine={false} tickLine={false} interval={Math.floor(data.length/4)} />
                <YAxis tick={{ fontFamily:MONO, fontSize:9, fill:C.t3 }} axisLine={false} tickLine={false} tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}K`:v} />
                <Tooltip
                  contentStyle={{ background:C.raise, border:`1px solid ${C.b2}`, borderRadius:8 }}
                  formatter={v=>[`${v.toFixed(0)}`]}
                />
                <Line type="monotone" dataKey={series} stroke={series==='sp'?C.gold:C.teal} strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </MCard>
      </div>

      {/* Stats */}
      <div style={{ padding:'0 16px', display:'flex', gap:10 }}>
        {[
          { l:'Period High', v: Math.max(...data.map(d=>d[series])).toFixed(0) },
          { l:'Period Low',  v: Math.min(...data.map(d=>d[series])).toFixed(0) },
          { l:'Change',      v: `+${(((data[data.length-1][series]-data[0][series])/data[0][series])*100).toFixed(1)}%` },
        ].map(({ l, v }) => (
          <div key={l} style={{ flex:1, background:C.surf, border:`1px solid ${C.b2}`, borderRadius:12, padding:'12px', textAlign:'center' }}>
            <div style={{ fontFamily:UI, fontSize:10, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em' }}>{l}</div>
            <div style={{ fontFamily:MONO, fontSize:15, fontWeight:700, color:C.t1, marginTop:4 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ height:20 }} />
    </div>
  )
}
