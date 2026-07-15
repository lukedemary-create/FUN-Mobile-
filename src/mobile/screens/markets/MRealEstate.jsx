import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader } from '../../components/MCard'
import { C, UI, MONO } from '../../tokens'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'

const priceData = [
  { m:'Jul\'25', v:425000 },{ m:'Aug', v:428000 },{ m:'Sep', v:421000 },{ m:'Oct', v:418000 },
  { m:'Nov', v:415000 },{ m:'Dec', v:413000 },{ m:'Jan\'26', v:416000 },{ m:'Feb', v:420000 },
  { m:'Mar', v:427000 },{ m:'Apr', v:432000 },{ m:'May', v:436000 },{ m:'Jun', v:438500 },
]
const METRICS = [
  { label:'Median Home Price',   value:'$438,500', note:'Jun 2026 (YoY +3.2%)' },
  { label:'30-Yr Fixed Rate',    value:'6.82%',    note:'Freddie Mac weekly avg' },
  { label:'Existing Home Sales', value:'4.09M',    note:'SAAR — May 2026' },
  { label:'New Home Sales',      value:'698K',     note:'SAAR — May 2026' },
  { label:'Housing Starts',      value:'1.41M',    note:'SAAR — May 2026' },
  { label:'Months of Supply',    value:'4.1',      note:'Existing homes inventory' },
]

export default function MRealEstate() {
  return (
    <div style={{ background:C.bg, minHeight:'100dvh' }}>
      <ScreenHeader title="Real Estate" subtitle="Housing Market" accent={C.teal} />

      <div style={{ padding:'12px 16px 0', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {METRICS.map(m => (
          <div key={m.label} style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, padding:'13px' }}>
            <div style={{ fontFamily:UI, fontSize:10, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>{m.label}</div>
            <div style={{ fontFamily:MONO, fontSize:m.value.length>7?15:18, fontWeight:700, color:C.teal }}>{m.value}</div>
            <div style={{ fontFamily:UI, fontSize:10, color:C.t3, marginTop:3 }}>{m.note}</div>
          </div>
        ))}
      </div>

      <MSectionHeader label="Median Home Price" />
      <div style={{ padding:'0 16px' }}>
        <MCard>
          <div style={{ height:160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceData} margin={{ left:-10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.b1} />
                <XAxis dataKey="m" tick={{ fontFamily:MONO, fontSize:9, fill:C.t3 }} axisLine={false} tickLine={false} interval={2} />
                <YAxis domain={[400000, 450000]} tick={{ fontFamily:MONO, fontSize:9, fill:C.t3 }} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ background:C.raise, border:`1px solid ${C.b2}`, borderRadius:8 }} formatter={v=>[`$${v.toLocaleString()}`]} />
                <Line type="monotone" dataKey="v" stroke={C.teal} strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </MCard>
      </div>

      <div style={{ padding:'0 16px 20px' }}>
        <MCard style={{ background: C.raise }}>
          <div style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:C.teal, marginBottom:8 }}>Market Insight</div>
          <div style={{ fontFamily:UI, fontSize:13, color:C.t2, lineHeight:1.7 }}>
            The housing market shows signs of stabilization as mortgage rates pull back from 2025 highs. Inventory remains below the 5-6 month equilibrium level, keeping upward pressure on prices despite affordability constraints.
          </div>
        </MCard>
      </div>
    </div>
  )
}
