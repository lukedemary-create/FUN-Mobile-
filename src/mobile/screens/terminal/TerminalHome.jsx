import { useNavigate } from 'react-router-dom'
import { BarChart2, Search, TrendingUp, Calendar, Users, ShoppingCart, Home, Shield, Activity, Flag, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MSectionHeader } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'

const MARKET_QUOTES = [
  { label:'S&P 500',  val:'5,892.14', chg:'+0.74%', up:true  },
  { label:'NASDAQ',   val:'19,243.5', chg:'+1.12%', up:true  },
  { label:'DOW',      val:'43,118.9', chg:'-0.18%', up:false },
  { label:'10Y',      val:'4.312%',   chg:'+0.04',  up:false },
  { label:'VIX',      val:'16.42',    chg:'-1.23%', up:true  },
  { label:'DXY',      val:'103.87',   chg:'+0.31%', up:false },
]

const SECTIONS = [
  { path:'/terminal/dashboard',   Icon:BarChart2,    label:'Market Dashboard',      sub:'Indices, sectors & movers',     accent:C.gold  },
  { path:'/terminal/ticker',      Icon:Search,       label:'Ticker Lookup',         sub:'Deep dive any stock',           accent:C.gold  },
  { path:'/terminal/history',     Icon:TrendingUp,   label:'Market History',        sub:'Long-run price & cycle data',   accent:C.gold  },
  { path:'/terminal/calendar',    Icon:Calendar,     label:'Economic Calendar',     sub:'Fed events, CPI, NFP & more',   accent:C.gold  },
  { path:'/terminal/labor',       Icon:Users,        label:'Labor Market',          sub:'Jobs, wages, unemployment',     accent:C.teal  },
  { path:'/terminal/consumer',    Icon:ShoppingCart, label:'Consumer',              sub:'Spending, sentiment, retail',   accent:C.teal  },
  { path:'/terminal/real-estate', Icon:Home,         label:'Real Estate',           sub:'Housing starts, prices, rates', accent:C.teal  },
  { path:'/terminal/risk',        Icon:Shield,       label:'Risk Analysis',         sub:'Volatility, credit & macro',    accent:C.gold  },
  { path:'/terminal/breadth',     Icon:Activity,     label:'Market Breadth',        sub:'A/D line, new highs, McClellan', accent:C.gold },
  { path:'/terminal/politics',    Icon:Flag,         label:'Politics & Economy',    sub:'Policy, legislation, outlook',  accent:C.teal  },
]

export default function TerminalHome() {
  const navigate = useNavigate()

  return (
    <div style={{ background:C.bg, minHeight:'100dvh' }}>
      <ScreenHeader title="Terminal" subtitle="Planora" accent={C.gold} />

      {/* Live ticker strip */}
      <div style={{ overflowX:'auto', scrollbarWidth:'none', padding:'10px 16px 0' }}>
        <div style={{ display:'flex', gap:8, minWidth:'max-content' }}>
          {MARKET_QUOTES.map(q => (
            <div key={q.label} style={{
              background:C.surf, border:`1px solid ${C.b2}`, borderRadius:10,
              padding:'10px 12px', minWidth:88,
            }}>
              <div style={{ fontFamily:UI, fontSize:9, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:3 }}>{q.label}</div>
              <div style={{ fontFamily:MONO, fontSize:13, fontWeight:700, color:C.t1 }}>{q.val}</div>
              <div style={{ display:'flex', alignItems:'center', gap:3, marginTop:3 }}>
                {q.up
                  ? <ArrowUp size={10} color={C.up} />
                  : <ArrowDown size={10} color={C.down} />
                }
                <span style={{ fontFamily:MONO, fontSize:10, color: q.up ? C.up : C.down }}>{q.chg}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market status badge */}
      <div style={{ padding:'12px 16px 0', display:'flex', alignItems:'center', gap:8 }}>
        <div style={{ width:7, height:7, borderRadius:'50%', background:C.up, boxShadow:`0 0 6px ${C.up}` }} />
        <span style={{ fontFamily:UI, fontSize:11, color:C.t3 }}>US Markets Open · Jun 28, 2026 · 2:14 PM ET</span>
      </div>

      <MSectionHeader label="Data & Analytics" />
      <div style={{ padding:'0 16px' }}>
        {SECTIONS.map(({ path, Icon, label, sub, accent }) => (
          <div
            key={path}
            onClick={() => navigate(path)}
            style={{
              display:'flex', alignItems:'center', gap:12, padding:'13px 14px',
              background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14,
              marginBottom:8, cursor:'pointer',
            }}
          >
            <span style={{
              width:38, height:38, borderRadius:10,
              background: accent+'18', border:`1px solid ${accent}30`,
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
            }}>
              <Icon size={17} color={accent} />
            </span>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:UI, fontSize:14, fontWeight:600, color:C.t1 }}>{label}</div>
              <div style={{ fontFamily:UI, fontSize:12, color:C.t3, marginTop:1 }}>{sub}</div>
            </div>
            <ChevronRight size={15} color={C.t3} />
          </div>
        ))}
      </div>
      <div style={{ height:20 }} />
    </div>
  )
}
