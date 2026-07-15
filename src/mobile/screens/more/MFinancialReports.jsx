import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader } from '../../components/MCard'
import { C, UI, MONO } from '../../tokens'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis } from 'recharts'

const fmt = n => '$' + Math.round(n||0).toLocaleString()

const NET_WORTH_TREND = [
  { mo:'Jan', v:485000 }, { mo:'Feb', v:491000 }, { mo:'Mar', v:478000 },
  { mo:'Apr', v:502000 }, { mo:'May', v:518000 }, { mo:'Jun', v:534000 },
]

const ASSETS = [
  { name:'Investments', value:320000, fill:C.indigo },
  { name:'Home Equity', value:145000, fill:C.teal },
  { name:'Retirement', value:210000, fill:C.gold },
  { name:'Cash', value:28000,  fill:'#4a7c59' },
]

const METRICS = [
  { label:'Net Worth', value:'$534,000', change:'+$49K YTD', up:true },
  { label:'Savings Rate', value:'18.4%', change:'+2.1% vs last yr', up:true },
  { label:'Debt-to-Income', value:'28%', change:'Target <36%', up:true },
  { label:'Emergency Fund', value:'4.2 mo', change:'Target 6 mo', up:false },
  { label:'Retirement Progress', value:'64%', change:'On track for 65', up:true },
  { label:'Insurance Coverage', value:'8.4x', change:'Target 10–12x', up:false },
]

export default function MFinancialReports() {
  const totalAssets = ASSETS.reduce((s, a) => s + a.value, 0)

  return (
    <div style={{ background:C.bg, minHeight:'100dvh' }}>
      <ScreenHeader title="Financial Reports" subtitle="More" accent={C.teal} />

      {/* Date */}
      <div style={{ padding:'10px 16px 0' }}>
        <div style={{ fontFamily:MONO, fontSize:11, color:C.t3 }}>Snapshot as of June 2026 · Illustrative</div>
      </div>

      {/* Net Worth Trend */}
      <div style={{ padding:'10px 16px 0' }}>
        <MCard>
          <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>Net Worth Trend (6M)</div>
          <div style={{ fontFamily:MONO, fontSize:28, fontWeight:700, color:C.teal, marginBottom:12 }}>$534,000</div>
          <div style={{ height:120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={NET_WORTH_TREND} margin={{ top:5, right:0, bottom:0, left:0 }}>
                <defs>
                  <linearGradient id="nwGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.teal} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={C.teal} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="mo" tick={{ fill:C.t3, fontFamily:MONO, fontSize:9 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={v => fmt(v)} contentStyle={{ background:C.raise, border:`1px solid ${C.b2}`, borderRadius:8, fontFamily:UI, fontSize:11 }} />
                <Area type="monotone" dataKey="v" stroke={C.teal} strokeWidth={2} fill="url(#nwGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </MCard>
      </div>

      {/* Asset Allocation */}
      <MSectionHeader label="Asset Allocation" />
      <div style={{ padding:'0 16px' }}>
        <MCard>
          <div style={{ display:'flex', gap:16, alignItems:'center' }}>
            <div style={{ width:130, height:130, flexShrink:0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={ASSETS} cx="50%" cy="50%" innerRadius={35} outerRadius={58} dataKey="value" stroke="none">
                    {ASSETS.map((a, i) => <Cell key={i} fill={a.fill} />)}
                  </Pie>
                  <Tooltip formatter={v => fmt(v)} contentStyle={{ background:C.raise, border:`1px solid ${C.b2}`, borderRadius:8, fontFamily:UI, fontSize:11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex:1 }}>
              {ASSETS.map(a => (
                <div key={a.name} style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <div style={{ width:8, height:8, borderRadius:2, background:a.fill, flexShrink:0 }} />
                    <span style={{ fontFamily:UI, fontSize:11, color:C.t2 }}>{a.name}</span>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:MONO, fontSize:11, fontWeight:700, color:C.t1 }}>{fmt(a.value)}</div>
                    <div style={{ fontFamily:MONO, fontSize:10, color:C.t3 }}>{(a.value/totalAssets*100).toFixed(0)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </MCard>
      </div>

      {/* Health Metrics */}
      <MSectionHeader label="Financial Health Metrics" />
      <div style={{ padding:'0 16px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {METRICS.map(m => (
          <div key={m.label} style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, padding:'13px 12px' }}>
            <div style={{ fontFamily:UI, fontSize:10, color:C.t3, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>{m.label}</div>
            <div style={{ fontFamily:MONO, fontSize:16, fontWeight:700, color:m.up ? C.teal : C.gold, marginBottom:3 }}>{m.value}</div>
            <div style={{ fontFamily:UI, fontSize:10, color: m.up ? '#4a7c59' : C.gold }}>{m.change}</div>
          </div>
        ))}
      </div>

      <div style={{ padding:'14px 16px 24px' }}>
        <div style={{ fontFamily:UI, fontSize:10, color:C.t3, lineHeight:1.6, padding:'10px', background:C.raise, borderRadius:8 }}>
          Data shown is illustrative and for educational purposes only. Connect your accounts for real-time personalized reporting.
        </div>
      </div>
    </div>
  )
}
