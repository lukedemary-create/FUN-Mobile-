import { useState, useEffect } from 'react'
import { Search, RefreshCw } from 'lucide-react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MBadge, MLoader } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

const TICKERS = [
  { sym:'SPY',  price:'584.12', chg:'+0.43%', vol:'48.2M', dir:'up'  },
  { sym:'QQQ',  price:'493.88', chg:'+0.71%', vol:'32.1M', dir:'up'  },
  { sym:'AAPL', price:'195.84', chg:'+1.23%', vol:'62.4M', dir:'up'  },
  { sym:'MSFT', price:'421.17', chg:'+0.84%', vol:'21.3M', dir:'up'  },
  { sym:'NVDA', price:'127.44', chg:'+3.21%', vol:'88.7M', dir:'up'  },
  { sym:'TSLA', price:'248.32', chg:'-1.07%', vol:'94.1M', dir:'down'},
  { sym:'AMZN', price:'199.78', chg:'+0.55%', vol:'29.4M', dir:'up'  },
  { sym:'META', price:'584.19', chg:'+1.44%', vol:'17.8M', dir:'up'  },
  { sym:'GOOGL',price:'186.33', chg:'+0.22%', vol:'24.5M', dir:'up'  },
  { sym:'JPM',  price:'258.41', chg:'-0.31%', vol:'12.2M', dir:'down'},
  { sym:'GLD',  price:'241.87', chg:'+0.68%', vol:'9.4M',  dir:'up'  },
  { sym:'TLT',  price:'97.22',  chg:'-0.14%', vol:'18.3M', dir:'down'},
]

function genChart(base, up) {
  return Array.from({ length: 20 }, (_, i) => ({
    t: i,
    v: base + (up ? 1 : -1) * Math.random() * base * 0.015 * (i / 5),
  }))
}

export default function MTerminal() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [chartData, setChartData] = useState([])

  const filtered = TICKERS.filter(t =>
    t.sym.toLowerCase().includes(search.toLowerCase())
  )

  const selectTicker = (t) => {
    setSelected(t)
    setChartData(genChart(parseFloat(t.price), t.dir === 'up'))
  }

  return (
    <div style={{ background: C.bg, minHeight: '100dvh' }}>
      <ScreenHeader title="Terminal" subtitle="Live Tickers" accent={C.gold} />

      {/* Search */}
      <div style={{ padding: '12px 16px 0' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: C.surf,
          border: `1px solid ${C.b2}`,
          borderRadius: 12,
          padding: '10px 14px',
        }}>
          <Search size={16} color={C.t3} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search ticker..."
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontFamily: MONO, fontSize: 14, color: C.t1,
            }}
          />
        </div>
      </div>

      {/* Chart panel when selected */}
      {selected && (
        <div style={{ padding: '12px 16px 0' }}>
          <MCard>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700, color: C.gold }}>{selected.sym}</div>
                <div style={{ fontFamily: MONO, fontSize: 24, fontWeight: 900, color: C.t1, marginTop: 2 }}>${selected.price}</div>
              </div>
              <MBadge color={selected.dir === 'up' ? C.up : C.down}>{selected.chg}</MBadge>
            </div>
            <div style={{ height: 120 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.b1} />
                  <XAxis dataKey="t" hide />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{ background: C.raise, border: `1px solid ${C.b2}`, borderRadius: 8 }}
                    labelStyle={{ display: 'none' }}
                    formatter={v => [`$${v.toFixed(2)}`]}
                  />
                  <Line type="monotone" dataKey="v" stroke={selected.dir === 'up' ? C.up : C.down} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
              {[['Volume', selected.vol], ['Change', selected.chg], ['Direction', selected.dir.toUpperCase()]].map(([l, v]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: UI, fontSize: 10, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{l}</div>
                  <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: C.t1, marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>
          </MCard>
        </div>
      )}

      {/* Ticker list */}
      <div style={{ padding: '10px 16px 0' }}>
        <MCard style={{ padding: 0, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            padding: '10px 16px',
            borderBottom: `1px solid ${C.b2}`,
            background: C.raise,
          }}>
            {['Symbol', 'Price', 'Change'].map(h => (
              <div key={h} style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: h === 'Change' ? 'right' : 'left' }}>{h}</div>
            ))}
          </div>
          {filtered.map((t, i) => (
            <div
              key={t.sym}
              onClick={() => selectTicker(t)}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                padding: '12px 16px',
                borderBottom: i < filtered.length - 1 ? `1px solid ${C.b1}` : 'none',
                cursor: 'pointer',
                background: selected?.sym === t.sym ? C.goldDim : 'transparent',
              }}
            >
              <div style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: C.gold }}>{t.sym}</div>
              <div style={{ fontFamily: MONO, fontSize: 14, fontWeight: 600, color: C.t1 }}>${t.price}</div>
              <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: t.dir === 'up' ? C.up : C.down, textAlign: 'right' }}>{t.chg}</div>
            </div>
          ))}
        </MCard>
      </div>
      <div style={{ height: 20 }} />
    </div>
  )
}
