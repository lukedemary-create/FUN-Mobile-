import { useState } from 'react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader, MBadge } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

const radarData = [
  { subject: 'Volatility', A: 62 },
  { subject: 'Liquidity', A: 78 },
  { subject: 'Concentration', A: 44 },
  { subject: 'Correlation', A: 57 },
  { subject: 'Drawdown', A: 69 },
  { subject: 'Beta', A: 55 },
]
const stressData = [
  { scenario: '2020 Covid', drawdown: -34 },
  { scenario: '2022 Bear', drawdown: -24 },
  { scenario: '2008 GFC', drawdown: -52 },
  { scenario: 'Rate +2%', drawdown: -14 },
  { scenario: 'Inflation', drawdown: -18 },
]
const METRICS = [
  { label:'Portfolio Beta',     value:'0.84',  note:'vs S&P 500', color: C.t1 },
  { label:'Sharpe Ratio',      value:'1.42',  note:'Risk-adjusted return', color: C.up },
  { label:'Max Drawdown (1Y)', value:'-12.4%', note:'Peak to trough', color: C.down },
  { label:'Volatility (Ann.)', value:'14.2%', note:'Annualized std dev', color: C.warning },
]

export default function MRiskAnalysis() {
  const [tab, setTab] = useState('overview')
  return (
    <div style={{ background:C.bg, minHeight:'100dvh' }}>
      <ScreenHeader title="Risk Analysis" subtitle="Portfolio Risk" accent={C.gold} />

      <div style={{ display:'flex', gap:8, padding:'12px 16px 0' }}>
        {['overview','stress','radar'].map(t => (
          <button key={t} onClick={()=>setTab(t)} style={{
            padding:'7px 14px', borderRadius:8, cursor:'pointer',
            border:`1px solid ${tab===t ? C.gold : C.b2}`,
            background: tab===t ? C.goldDim : 'transparent',
            color: tab===t ? C.gold : C.t3,
            fontFamily:UI, fontSize:12, fontWeight:600, textTransform:'capitalize',
          }}>{t==='radar'?'Radar':t==='stress'?'Stress Test':'Overview'}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div style={{ padding:'12px 16px 0' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
            {METRICS.map(m => (
              <div key={m.label} style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, padding:'14px' }}>
                <div style={{ fontFamily:UI, fontSize:10, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>{m.label}</div>
                <div style={{ fontFamily:MONO, fontSize:22, fontWeight:700, color:m.color }}>{m.value}</div>
                <div style={{ fontFamily:UI, fontSize:10, color:C.t3, marginTop:3 }}>{m.note}</div>
              </div>
            ))}
          </div>
          <MCard style={{ background:C.raise }}>
            <div style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:C.gold, marginBottom:6 }}>Risk Summary</div>
            <div style={{ fontFamily:UI, fontSize:13, color:C.t2, lineHeight:1.7 }}>
              Your portfolio carries below-market beta (0.84), suggesting moderate defensiveness. The Sharpe ratio of 1.42 indicates efficient risk-adjusted returns. Concentration risk is the primary area for attention — top 3 holdings represent 41% of portfolio.
            </div>
          </MCard>
        </div>
      )}

      {tab === 'stress' && (
        <div style={{ padding:'12px 16px 0' }}>
          <MCard>
            <div style={{ fontFamily:UI, fontSize:12, color:C.t3, marginBottom:10 }}>Estimated portfolio drawdown under historical stress scenarios</div>
            <div style={{ height:200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stressData} layout="vertical" margin={{ left:0, right:20 }}>
                  <XAxis type="number" tick={{ fontFamily:MONO, fontSize:10, fill:C.t3 }} tickFormatter={v=>`${v}%`} axisLine={false} tickLine={false} />
                  <YAxis dataKey="scenario" type="category" tick={{ fontFamily:UI, fontSize:10, fill:C.t2 }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip contentStyle={{ background:C.raise, border:`1px solid ${C.b2}`, borderRadius:8 }} formatter={v=>[`${v}%`]} />
                  <Bar dataKey="drawdown" fill={C.down} radius={[0,4,4,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </MCard>
        </div>
      )}

      {tab === 'radar' && (
        <div style={{ padding:'12px 16px 0' }}>
          <MCard>
            <div style={{ height:260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke={C.b2} />
                  <PolarAngleAxis dataKey="subject" tick={{ fontFamily:UI, fontSize:10, fill:C.t2 }} />
                  <Radar name="Portfolio" dataKey="A" stroke={C.gold} fill={C.gold} fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </MCard>
        </div>
      )}
      <div style={{ height:20 }} />
    </div>
  )
}
