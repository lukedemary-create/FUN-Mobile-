import { useNavigate } from 'react-router-dom'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'

const MODULES = [
  { id:1, title:'Business Entity Selection', desc:'LLC, S-Corp, C-Corp, Sole Prop — tax and liability implications of each structure.', icon:'🏢', mins:12 },
  { id:2, title:'Business Tax Strategies', desc:'Maximize deductions, QBI deduction, home office, retirement plans for owners.', icon:'🧾', mins:15 },
  { id:3, title:'Succession Planning', desc:'Buy-sell agreements, key person insurance, ownership transfer strategies.', icon:'🔄', mins:10 },
  { id:4, title:'Business Valuation', desc:'How businesses are valued — EBITDA multiples, DCF, asset-based approaches.', icon:'💰', mins:11 },
  { id:5, title:'Exit Strategy Planning', desc:'Strategic sale, private equity, ESOP, management buyout, family transfer.', icon:'🚪', mins:13 },
  { id:6, title:'Owner Compensation Strategy', desc:'Optimal salary vs distributions, fringe benefits, deferred compensation.', icon:'💼', mins:9 },
]

const QUICK_STATS = [
  { label:'Small Businesses in US', value:'33M+' },
  { label:'Fail in 5 Years', value:'50%' },
  { label:'w/o Succession Plan', value:'76%' },
  { label:'Owner Retirement Ready', value:'34%' },
]

export default function MBusinessPlanning() {
  const nav = useNavigate()
  return (
    <div style={{ background:C.bg, minHeight:'100dvh' }}>
      <ScreenHeader title="Business Planning" subtitle="More" accent={C.gold} />

      {/* Hero */}
      <div style={{ padding:'14px 16px 0' }}>
        <div style={{ background:`linear-gradient(135deg, rgba(201,169,110,0.14) 0%, rgba(201,169,110,0.04) 100%)`, border:`1px solid rgba(201,169,110,0.25)`, borderRadius:18, padding:'18px' }}>
          <div style={{ fontFamily:DISPLAY, fontSize:18, fontWeight:700, color:C.t1, lineHeight:1.3, marginBottom:6 }}>
            Business Owner Planning
          </div>
          <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65, marginBottom:14 }}>
            Financial planning for business owners is fundamentally different. Cover the gaps most financial advisors miss.
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={() => nav('/more/business/assess')} style={{ flex:1, padding:'10px', background:C.gold, border:'none', borderRadius:10, fontFamily:UI, fontSize:12, fontWeight:700, color:C.bg, cursor:'pointer' }}>Business Assessment</button>
            <button onClick={() => nav('/more/business/plan')} style={{ flex:1, padding:'10px', background:'transparent', border:`1px solid ${C.gold}`, borderRadius:10, fontFamily:UI, fontSize:12, fontWeight:700, color:C.gold, cursor:'pointer' }}>Build a Plan</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding:'12px 16px 0', display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
        {QUICK_STATS.map(s => (
          <div key={s.label} style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:12, padding:'12px' }}>
            <div style={{ fontFamily:MONO, fontSize:16, fontWeight:700, color:C.gold, marginBottom:2 }}>{s.value}</div>
            <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Education Modules */}
      <MSectionHeader label="Education Modules" />
      <div style={{ padding:'0 16px' }}>
        {MODULES.map(m => (
          <div key={m.id} onClick={() => nav(`/more/business/module/${m.id}`, { state: m })} style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:16, padding:'14px', marginBottom:10, cursor:'pointer', display:'flex', gap:12, alignItems:'flex-start' }}>
            <span style={{ fontSize:22, flexShrink:0 }}>{m.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.t1, marginBottom:4 }}>{m.title}</div>
              <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.5 }}>{m.desc}</div>
              <div style={{ marginTop:8 }}>
                <span style={{ fontFamily:MONO, fontSize:10, color:C.gold }}>{m.mins} min read</span>
              </div>
            </div>
            <span style={{ fontFamily:MONO, fontSize:16, color:C.gold, alignSelf:'center' }}>›</span>
          </div>
        ))}
      </div>
      <div style={{ height:24 }} />
    </div>
  )
}
