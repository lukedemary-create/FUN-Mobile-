import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader } from '../../components/MCard'
import { C, UI, MONO } from '../../tokens'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts'

const sentimentData = [
  { m:'Jan', v:73.2 },{ m:'Feb', v:70.1 },{ m:'Mar', v:67.5 },{ m:'Apr', v:65.2 },
  { m:'May', v:64.7 },{ m:'Jun', v:63.8 },
]
const spendingData = [
  { m:'Jan', v:0.8 },{ m:'Feb', v:0.5 },{ m:'Mar', v:0.3 },{ m:'Apr', v:0.6 },
  { m:'May', v:0.4 },{ m:'Jun', v:0.5 },
]
const METRICS = [
  { label:'Consumer Confidence', value:'98.7', note:'Conference Board — Jun 2026' },
  { label:'U. Michigan Sentiment', value:'63.8', note:'Prelim. Jun 2026' },
  { label:'Retail Sales (MoM)', value:'+0.4%', note:'May 2026' },
  { label:'Personal Spending', value:'+0.5%', note:'May 2026 (MoM)' },
  { label:'Savings Rate', value:'3.8%', note:'Personal savings rate' },
  { label:'Credit Card Delinquency', value:'3.21%', note:'Q1 2026' },
]

export default function MConsumer() {
  return (
    <div style={{ background:C.bg, minHeight:'100dvh' }}>
      <ScreenHeader title="The Consumer" subtitle="Spending & Sentiment" accent={C.teal} />

      <div style={{ padding:'12px 16px 0', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {METRICS.map(m => (
          <div key={m.label} style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, padding:'13px' }}>
            <div style={{ fontFamily:UI, fontSize:10, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>{m.label}</div>
            <div style={{ fontFamily:MONO, fontSize:18, fontWeight:700, color:C.teal }}>{m.value}</div>
            <div style={{ fontFamily:UI, fontSize:10, color:C.t3, marginTop:3 }}>{m.note}</div>
          </div>
        ))}
      </div>

      <MSectionHeader label="Consumer Sentiment" />
      <div style={{ padding:'0 16px' }}>
        <MCard>
          <div style={{ height:140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sentimentData} margin={{ left:-20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.b1} />
                <XAxis dataKey="m" tick={{ fontFamily:MONO, fontSize:10, fill:C.t3 }} axisLine={false} tickLine={false} />
                <YAxis domain={[58, 80]} tick={{ fontFamily:MONO, fontSize:10, fill:C.t3 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background:C.raise, border:`1px solid ${C.b2}`, borderRadius:8 }} />
                <Line type="monotone" dataKey="v" stroke={C.teal} strokeWidth={2.5} dot={{ fill:C.teal, r:3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </MCard>
      </div>

      <MSectionHeader label="Personal Spending MoM (%)" />
      <div style={{ padding:'0 16px' }}>
        <MCard>
          <div style={{ height:120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendingData} margin={{ left:-20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.b1} />
                <XAxis dataKey="m" tick={{ fontFamily:MONO, fontSize:10, fill:C.t3 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily:MONO, fontSize:10, fill:C.t3 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background:C.raise, border:`1px solid ${C.b2}`, borderRadius:8 }} formatter={v=>[`${v}%`]} />
                <Bar dataKey="v" fill={C.gold} radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </MCard>
      </div>
      <div style={{ height:20 }} />
    </div>
  )
}
