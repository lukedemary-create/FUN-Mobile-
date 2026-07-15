import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader } from '../../components/MCard'
import { C, UI, MONO } from '../../tokens'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts'

const sectorData = [
  { sector:'Tech',     chg:1.84 }, { sector:'Finance',  chg:0.42 }, { sector:'Health',   chg:0.21 },
  { sector:'Energy',  chg:-0.63 }, { sector:'Utilities',chg:0.78 }, { sector:'Consumer', chg:0.33 },
  { sector:'RE',      chg:-0.44 }, { sector:'Mater.',   chg:0.59 }, { sector:'Industrials',chg:0.15 },
  { sector:'Comm.',   chg:1.22 }, { sector:'Staples',  chg:-0.19 },
]
const adData = [
  { d:'M', adv:2340, dec:1180 }, { d:'T', adv:2180, dec:1340 }, { d:'W', adv:1890, dec:1630 },
  { d:'Th', adv:2450, dec:1070 }, { d:'F', adv:2620, dec:900 },
]
const METRICS = [
  { label:'% Above 200-DMA',  value:'67.4%', good:true },
  { label:'% Above 50-DMA',   value:'58.2%', good:true },
  { label:'New 52W Highs',    value:'184',   good:true },
  { label:'New 52W Lows',     value:'42',    good:true },
  { label:'McClellan Osc.',   value:'+48.3', good:true },
  { label:'Arms Index (TRIN)',value:'0.74',  good:true },
]

export default function MMarketBreadth() {
  return (
    <div style={{ background:C.bg, minHeight:'100dvh' }}>
      <ScreenHeader title="Market Breadth" subtitle="Advance / Decline" accent={C.gold} />

      <div style={{ padding:'12px 16px 0', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {METRICS.map(m => (
          <div key={m.label} style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, padding:'13px' }}>
            <div style={{ fontFamily:UI, fontSize:10, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>{m.label}</div>
            <div style={{ fontFamily:MONO, fontSize:18, fontWeight:700, color: m.good ? C.up : C.down }}>{m.value}</div>
          </div>
        ))}
      </div>

      <MSectionHeader label="Sector Performance (Today %)" />
      <div style={{ padding:'0 16px' }}>
        <MCard>
          <div style={{ height:200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData} margin={{ left:-20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.b1} />
                <XAxis dataKey="sector" tick={{ fontFamily:MONO, fontSize:9, fill:C.t3 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily:MONO, fontSize:9, fill:C.t3 }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`} />
                <Tooltip contentStyle={{ background:C.raise, border:`1px solid ${C.b2}`, borderRadius:8 }} formatter={v=>[`${v}%`]} />
                <Bar dataKey="chg" fill={C.gold} radius={[4,4,0,0]}
                  label={false}
                  cells={sectorData.map((d,i) => (
                    <cell key={i} fill={d.chg >= 0 ? C.up : C.down} />
                  ))}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </MCard>
      </div>

      <MSectionHeader label="Advance / Decline (Week)" />
      <div style={{ padding:'0 16px' }}>
        <MCard>
          <div style={{ height:130 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adData} margin={{ left:-20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.b1} />
                <XAxis dataKey="d" tick={{ fontFamily:MONO, fontSize:10, fill:C.t3 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily:MONO, fontSize:10, fill:C.t3 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background:C.raise, border:`1px solid ${C.b2}`, borderRadius:8 }} />
                <Bar dataKey="adv" fill={C.up} radius={[4,4,0,0]} stackId="a" />
                <Bar dataKey="dec" fill={C.down} radius={[4,4,0,0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </MCard>
      </div>
      <div style={{ height:20 }} />
    </div>
  )
}
