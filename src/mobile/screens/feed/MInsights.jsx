import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const MACRO_DATA = [
  { mo:'Jan', gdp:2.1, inf:3.1 }, { mo:'Feb', gdp:2.3, inf:3.2 }, { mo:'Mar', gdp:2.4, inf:3.5 },
  { mo:'Apr', gdp:2.2, inf:3.4 }, { mo:'May', gdp:2.5, inf:3.1 }, { mo:'Jun', gdp:2.6, inf:2.9 },
]

const SECTOR_DATA = [
  { sector:'Tech',     ytd:18.4, color:C.indigo },
  { sector:'Financials',ytd:14.2,color:C.teal },
  { sector:'Healthcare',ytd:9.8, color:'#27ae60' },
  { sector:'Energy',   ytd:6.1,  color:C.gold },
  { sector:'Utilities',ytd:-2.3, color:C.t3 },
  { sector:'REITs',    ytd:-4.1, color:'#c0392b' },
]

const VIEWS = [
  {
    title:'Macro Outlook: Soft Landing Holds',
    body:'GDP growth is holding above 2%, unemployment remains near cycle lows, and inflation continues its disinflationary trend. The probability of a hard recession has declined to ~20% per most institutional models.',
    signal:'Constructive',
    signalColor:C.teal,
  },
  {
    title:'Equity: Growth Outperforming Value',
    body:'Technology and communication services continue to lead YTD. The AI infrastructure build-out is providing durable revenue tailwinds for mega-cap tech. Value rotation risk remains if rates rise unexpectedly.',
    signal:'Overweight Growth',
    signalColor:C.indigo,
  },
  {
    title:'Fixed Income: Extend Duration Carefully',
    body:'With the Fed on pause, the yield curve remains inverted but flattening. Front-end yields remain attractive. We recommend adding intermediate duration (5–7 year) as insurance against rate cuts.',
    signal:'Tactical Add',
    signalColor:C.gold,
  },
  {
    title:'Dollar & International',
    body:'The US dollar has weakened modestly as rate differentials compress. This creates a tailwind for developed international equity (EAFE) and emerging markets, which have lagged US equities significantly.',
    signal:'International Opportunity',
    signalColor:C.teal,
  },
]

export default function MInsights() {
  return (
    <div style={{ background:C.bg, minHeight:'100dvh' }}>
      <ScreenHeader title="Market Insights" subtitle="Feed" accent={C.gold} />

      {/* Macro Chart */}
      <div style={{ padding:'14px 16px 0' }}>
        <MCard>
          <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:10 }}>GDP Growth vs Inflation (2026)</div>
          <div style={{ height:150 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MACRO_DATA} margin={{ top:5, right:0, bottom:0, left:0 }}>
                <XAxis dataKey="mo" tick={{ fill:C.t3, fontFamily:MONO, fontSize:9 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[1, 4]} />
                <Tooltip contentStyle={{ background:C.raise, border:`1px solid ${C.b2}`, borderRadius:8, fontFamily:UI, fontSize:11 }} />
                <Line type="monotone" dataKey="gdp" stroke={C.teal} strokeWidth={2} dot={false} name="GDP %" />
                <Line type="monotone" dataKey="inf" stroke={C.gold} strokeWidth={2} dot={false} name="CPI %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display:'flex', gap:16, justifyContent:'center', marginTop:6 }}>
            <div style={{ display:'flex', alignItems:'center', gap:5 }}><div style={{ width:10, height:2, background:C.teal }} /><span style={{ fontFamily:UI, fontSize:10, color:C.t3 }}>GDP Growth</span></div>
            <div style={{ display:'flex', alignItems:'center', gap:5 }}><div style={{ width:10, height:2, background:C.gold }} /><span style={{ fontFamily:UI, fontSize:10, color:C.t3 }}>Inflation (CPI)</span></div>
          </div>
        </MCard>
      </div>

      {/* Sector Performance */}
      <MSectionHeader label="Sector Performance YTD" />
      <div style={{ padding:'0 16px' }}>
        <MCard style={{ padding:0, overflow:'hidden' }}>
          {SECTOR_DATA.map((s, i) => (
            <div key={s.sector} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 16px', borderBottom: i < SECTOR_DATA.length-1 ? `1px solid ${C.b1}` : 'none' }}>
              <div style={{ fontFamily:UI, fontSize:13, fontWeight:600, color:C.t1, width:90, flexShrink:0 }}>{s.sector}</div>
              <div style={{ flex:1 }}>
                <div style={{ background:C.b1, borderRadius:4, height:5 }}>
                  <div style={{ background:s.color, borderRadius:4, height:5, width:`${Math.min(Math.abs(s.ytd) * 3, 100)}%`, marginLeft: s.ytd < 0 ? 'auto' : 0 }} />
                </div>
              </div>
              <span style={{ fontFamily:MONO, fontSize:13, fontWeight:700, color:s.color, minWidth:46, textAlign:'right' }}>{s.ytd > 0 ? '+' : ''}{s.ytd}%</span>
            </div>
          ))}
        </MCard>
      </div>

      {/* Weekly Views */}
      <MSectionHeader label="Weekly Views" />
      <div style={{ padding:'0 16px' }}>
        {VIEWS.map(v => (
          <MCard key={v.title}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
              <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.t1, flex:1, marginRight:10, lineHeight:1.3 }}>{v.title}</div>
              <span style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:v.signalColor, background:`${v.signalColor}15`, border:`1px solid ${v.signalColor}30`, borderRadius:6, padding:'2px 7px', flexShrink:0 }}>{v.signal}</span>
            </div>
            <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65 }}>{v.body}</div>
          </MCard>
        ))}
      </div>

      {/* Disclaimer */}
      <div style={{ padding:'0 16px 24px' }}>
        <div style={{ fontFamily:UI, fontSize:10, color:C.t3, lineHeight:1.6, padding:'12px', background:C.raise, borderRadius:10 }}>
          Planora Insights are for educational and informational purposes only. Not investment advice. Past performance does not guarantee future results. Consult a qualified financial advisor before making investment decisions.
        </div>
      </div>
    </div>
  )
}
