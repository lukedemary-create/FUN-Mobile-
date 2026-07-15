import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader } from '../../components/MCard'
import { C, UI, MONO } from '../../tokens'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts'

const payrollData = [
  { m:'Jan', v:256 },{ m:'Feb', v:231 },{ m:'Mar', v:189 },{ m:'Apr', v:177 },
  { m:'May', v:139 },{ m:'Jun', v:147 },
]
const unempData = [
  { m:'Jan', v:4.0 },{ m:'Feb', v:4.1 },{ m:'Mar', v:4.1 },{ m:'Apr', v:4.2 },
  { m:'May', v:4.2 },{ m:'Jun', v:4.2 },
]
const METRICS = [
  { label:'Unemployment Rate', value:'4.2%',   chg:'+0.1', note:'May 2026' },
  { label:'Nonfarm Payrolls',  value:'+139K',  chg:'-16K', note:'May 2026 (MoM)' },
  { label:'Avg Hourly Wage',   value:'+3.9%',  chg:'-0.1', note:'YoY growth' },
  { label:'Labor Force Part.', value:'62.6%',  chg:'0.0',  note:'Participation rate' },
  { label:'U-6 Rate',          value:'7.8%',   chg:'+0.1', note:'Broad underemployment' },
  { label:'JOLTS Openings',    value:'7.19M',  chg:'-0.3M',note:'April 2026' },
]

export default function MLabor() {
  return (
    <div style={{ background:C.bg, minHeight:'100dvh' }}>
      <ScreenHeader title="Labor Markets" subtitle="Employment Data" accent={C.teal} />

      <div style={{ padding:'12px 16px 0', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {METRICS.map(m => (
          <div key={m.label} style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, padding:'13px' }}>
            <div style={{ fontFamily:UI, fontSize:10, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>{m.label}</div>
            <div style={{ fontFamily:MONO, fontSize:20, fontWeight:700, color:C.teal }}>{m.value}</div>
            <div style={{ fontFamily:MONO, fontSize:11, color:C.t3, marginTop:3 }}>{m.chg} · {m.note}</div>
          </div>
        ))}
      </div>

      <MSectionHeader label="Nonfarm Payrolls (K)" />
      <div style={{ padding:'0 16px' }}>
        <MCard>
          <div style={{ height:140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payrollData} margin={{ left:-20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.b1} />
                <XAxis dataKey="m" tick={{ fontFamily:MONO, fontSize:10, fill:C.t3 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily:MONO, fontSize:10, fill:C.t3 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background:C.raise, border:`1px solid ${C.b2}`, borderRadius:8 }} formatter={v=>[`${v}K`]} />
                <Bar dataKey="v" fill={C.teal} radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </MCard>
      </div>

      <MSectionHeader label="Unemployment Rate (%)" />
      <div style={{ padding:'0 16px' }}>
        <MCard>
          <div style={{ height:120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={unempData} margin={{ left:-20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.b1} />
                <XAxis dataKey="m" tick={{ fontFamily:MONO, fontSize:10, fill:C.t3 }} axisLine={false} tickLine={false} />
                <YAxis domain={[3.5, 4.5]} tick={{ fontFamily:MONO, fontSize:10, fill:C.t3 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background:C.raise, border:`1px solid ${C.b2}`, borderRadius:8 }} formatter={v=>[`${v}%`]} />
                <Line type="monotone" dataKey="v" stroke={C.warning} strokeWidth={2.5} dot={{ fill:C.warning, r:3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </MCard>
      </div>
      <div style={{ height:20 }} />
    </div>
  )
}
