import { useNavigate } from 'react-router-dom'
import { BarChart2, Search, Star, TrendingUp, Activity, Newspaper, Calendar, Cpu, Users, Zap, Globe, Home, ChevronRight, Flame } from 'lucide-react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MSectionHeader } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'

const INDICES = [
  { sym: 'S&P 500',  val: '5,842.31',  chg: '+0.62%', up: true  },
  { sym: 'NASDAQ',   val: '18,974.05', chg: '+0.91%', up: true  },
  { sym: 'DOW',      val: '42,181.44', chg: '-0.14%', up: false },
  { sym: 'RUSSELL',  val: '2,318.90',  chg: '+1.08%', up: true  },
]

const SECTORS = [
  { name: 'Technology',     chg: +1.42 },
  { name: 'Communication',  chg: +0.98 },
  { name: 'Financials',     chg: +0.61 },
  { name: 'Consumer Disc.', chg: +0.34 },
  { name: 'Materials',      chg: +0.12 },
  { name: 'Healthcare',     chg: -0.08 },
  { name: 'Utilities',      chg: -0.24 },
  { name: 'Energy',         chg: -0.71 },
]

const MOVERS = [
  { sym: 'NVDA', name: 'NVIDIA Corp.',   price: '$142.31', chg: '+3.42%', up: true  },
  { sym: 'AAPL', name: 'Apple Inc.',     price: '$228.44', chg: '+1.87%', up: true  },
  { sym: 'MSFT', name: 'Microsoft Corp.',price: '$415.20', chg: '+1.24%', up: true  },
  { sym: 'TSLA', name: 'Tesla Inc.',     price: '$248.10', chg: '-2.18%', up: false },
]

const EXPLORE = [
  { path: '/markets/dashboard',    Icon: BarChart2, label: 'Dashboard',       sub: 'Command center'  },
  { path: '/markets/stock-lookup', Icon: Search,    label: 'Stock Lookup',    sub: 'Any ticker'      },
  { path: '/markets/watchlist',    Icon: Star,      label: 'Watchlist',       sub: 'Your list'       },
  { path: '/markets/performers',   Icon: TrendingUp,label: 'Top Performers',  sub: 'Gain / Loss / Vol'},
  { path: '/markets/sectors',      Icon: Activity,  label: 'Sectors',         sub: 'All 11 GICS'     },
]

const RESEARCH = [
  { path: '/markets/news',     label: 'Market News',        sub: 'Curated feed · updated hourly' },
  { path: '/markets/calendar', label: 'Economic Calendar',  sub: 'CPI · FOMC · NFP'             },
  { path: '/markets/breadth',  label: 'Market Breadth',     sub: 'A/D · New H/L · VIX'          },
  { path: '/markets/risk',     label: 'Risk Analysis',      sub: 'Stress-test · drawdown · beta' },
  { path: '/markets/insights', label: 'Featured Insights',  sub: 'Curated commentary & deep dives'},
  { path: '/markets/feed',     label: 'The Feed',           sub: 'Live financial news & analysis' },
]

const MACRO = [
  { path: '/markets/labor',       label: 'Labor Markets',     sub: 'Jobs · wages · unemployment' },
  { path: '/markets/consumer',    label: 'The Consumer',      sub: 'Retail · sentiment · spending'},
  { path: '/markets/energy',      label: 'Energy',            sub: 'Oil · gas · utilities'        },
  { path: '/markets/politics',    label: 'Politics & Economy',sub: 'Policy · trade · geopolitical'},
  { path: '/markets/real-estate', label: 'Real Estate',       sub: 'Housing · mortgage rates'     },
]

const BEHAVIORAL = [
  { path: '/markets/history',      label: 'Market History',          sub: '100-year log chart'              },
  { path: '/markets/elastic-band', label: 'Lesson 1 · The Elastic Band', sub: 'Why markets snap back'     },
  { path: '/markets/best-days',    label: 'Lesson 2 · The Best Days',    sub: 'Missing 10 days destroys wealth'},
  { path: '/markets/horizon-flip', label: 'Lesson 3 · The Horizon Flip', sub: 'Time changes everything'   },
  { path: '/markets/perfect-time', label: 'Lesson 4 · Perfect Time Illusion', sub: 'Waiting costs more than bad timing' },
  { path: '/markets/doom-loop',    label: 'Lesson 5 · The Doom-Loop',   sub: 'Media fear cycles vs. real returns' },
]

const maxAbs = Math.max(...SECTORS.map(s => Math.abs(s.chg)))

export default function MarketsHome() {
  const nav = useNavigate()

  return (
    <div style={{ background: C.bg, minHeight: '100dvh', paddingBottom: 80 }}>
      <ScreenHeader title="Markets" subtitle="Planora Terminal" accent={C.gold} />

      {/* Live badge */}
      <div style={{ padding: '10px 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.up, display: 'inline-block' }} />
        <span style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>Live indices, sectors, breadth, and news.</span>
      </div>

      {/* 2×2 Index Cards */}
      <div style={{ padding: '12px 16px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {INDICES.map(d => (
          <div key={d.sym} style={{ background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 14, padding: '14px 14px 12px' }}>
            <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{d.sym}</div>
            <div style={{ fontFamily: MONO, fontSize: 18, fontWeight: 700, color: C.t1, marginBottom: 4 }}>{d.val}</div>
            <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: d.up ? C.up : C.down }}>{d.chg}</div>
          </div>
        ))}
      </div>

      {/* Sector Heatmap */}
      <MSectionHeader label="Sector Heatmap" />
      <div style={{ padding: '0 16px' }}>
        <div style={{ background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 16, padding: '14px 16px' }}>
          {SECTORS.map((s, i) => {
            const pct = Math.abs(s.chg) / maxAbs
            const up = s.chg >= 0
            return (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < SECTORS.length - 1 ? 10 : 0 }}>
                <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, width: 110, flexShrink: 0 }}>{s.name}</div>
                <div style={{ flex: 1, height: 6, background: C.raise, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${pct * 100}%`, height: '100%', background: up ? C.up : C.down, borderRadius: 3 }} />
                </div>
                <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: up ? C.up : C.down, width: 52, textAlign: 'right', flexShrink: 0 }}>
                  {up ? '+' : ''}{s.chg.toFixed(2)}%
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top Movers */}
      <MSectionHeader label="Top Movers" action="See all" onAction={() => nav('/markets/performers')} />
      <div style={{ padding: '0 16px' }}>
        <div style={{ background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 16, overflow: 'hidden' }}>
          {MOVERS.map((m, i) => (
            <div key={m.sym} style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', borderBottom: i < MOVERS.length - 1 ? `1px solid ${C.b1}` : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: C.raise, border: `1px solid ${C.b2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, flexShrink: 0 }}>
                <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: C.gold }}>{m.sym.slice(0,2)}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: C.t1 }}>{m.sym}</div>
                <div style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>{m.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: C.t1 }}>{m.price}</div>
                <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: m.up ? C.up : C.down }}>{m.chg}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explore */}
      <MSectionHeader label="Explore" />
      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {EXPLORE.map(({ path, Icon, label, sub }) => (
          <div key={path} onClick={() => nav(path)} style={{ background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 16, padding: '16px 14px', cursor: 'pointer' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: C.goldDim, border: `1px solid ${C.goldBdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Icon size={17} color={C.gold} />
            </div>
            <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 3 }}>{label}</div>
            <div style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Research */}
      <MSectionHeader label="Research" />
      <div style={{ padding: '0 16px' }}>
        <div style={{ background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 16, overflow: 'hidden' }}>
          {RESEARCH.map((r, i) => (
            <div key={r.path} onClick={() => nav(r.path)} style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', borderBottom: i < RESEARCH.length - 1 ? `1px solid ${C.b1}` : 'none', cursor: 'pointer' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: UI, fontSize: 14, fontWeight: 600, color: C.t1 }}>{r.label}</div>
                <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, marginTop: 2 }}>{r.sub}</div>
              </div>
              <ChevronRight size={15} color={C.t3} />
            </div>
          ))}
        </div>
      </div>

      {/* Macro Research */}
      <MSectionHeader label="Macro Research" />
      <div style={{ padding: '0 16px' }}>
        <div style={{ background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 16, overflow: 'hidden' }}>
          {MACRO.map((r, i) => (
            <div key={r.path} onClick={() => nav(r.path)} style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', borderBottom: i < MACRO.length - 1 ? `1px solid ${C.b1}` : 'none', cursor: 'pointer' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: UI, fontSize: 14, fontWeight: 600, color: C.t1 }}>{r.label}</div>
                <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, marginTop: 2 }}>{r.sub}</div>
              </div>
              <ChevronRight size={15} color={C.t3} />
            </div>
          ))}
        </div>
      </div>

      {/* Behavioral Finance */}
      <MSectionHeader label="Behavioral Finance" />
      <div style={{ padding: '0 16px' }}>
        <div style={{ background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 16, overflow: 'hidden' }}>
          {BEHAVIORAL.map((r, i) => (
            <div key={r.path} onClick={() => nav(r.path)} style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', borderBottom: i < BEHAVIORAL.length - 1 ? `1px solid ${C.b1}` : 'none', cursor: 'pointer' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: UI, fontSize: 14, fontWeight: 600, color: C.t1 }}>{r.label}</div>
                <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, marginTop: 2 }}>{r.sub}</div>
              </div>
              <ChevronRight size={15} color={C.t3} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px', textAlign: 'center' }}>
        <span style={{ fontFamily: UI, fontSize: 10, color: C.t3 }}>⊙ Data refreshed just now</span>
      </div>
    </div>
  )
}
