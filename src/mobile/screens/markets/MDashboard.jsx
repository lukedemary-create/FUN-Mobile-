import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Star, TrendingUp, TrendingDown } from 'lucide-react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader, MStatCard, MBadge } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

const PORTFOLIO = [
  { month: 'Jan', val: 312000 }, { month: 'Feb', val: 318000 }, { month: 'Mar', val: 308000 },
  { month: 'Apr', val: 325000 }, { month: 'May', val: 334000 }, { month: 'Jun', val: 341200 },
]

const WATCHLIST = [
  { sym: 'AAPL', name: 'Apple Inc.', price: '195.84', chg: '+1.23%', dir: 'up' },
  { sym: 'MSFT', name: 'Microsoft', price: '421.17', chg: '+0.84%', dir: 'up' },
  { sym: 'NVDA', name: 'Nvidia', price: '127.44', chg: '+3.21%', dir: 'up' },
  { sym: 'TSLA', name: 'Tesla', price: '248.32', chg: '-1.07%', dir: 'down' },
  { sym: 'AMZN', name: 'Amazon', price: '199.78', chg: '+0.55%', dir: 'up' },
  { sym: 'META', name: 'Meta', price: '584.19', chg: '+1.44%', dir: 'up' },
]

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: C.raise, border: `1px solid ${C.b2}`, borderRadius: 8, padding: '7px 12px' }}>
      <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: C.gold }}>
        ${(payload[0].value / 1000).toFixed(0)}K
      </div>
    </div>
  )
}

export default function MDashboard() {
  const navigate = useNavigate()

  return (
    <div style={{ background: C.bg, minHeight: '100dvh' }}>
      <ScreenHeader title="Dashboard" subtitle="Portfolio Overview" accent={C.gold} />

      {/* Portfolio value */}
      <div style={{ padding: '16px 16px 0' }}>
        <MCard>
          <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
            Total Portfolio Value
          </div>
          <div style={{ fontFamily: DISPLAY, fontSize: 32, fontWeight: 700, color: C.t1 }}>$341,200</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <TrendingUp size={14} color={C.up} />
            <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: C.up }}>+$29,200 (9.36%) YTD</span>
          </div>
          <div style={{ marginTop: 16, height: 100 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PORTFOLIO}>
                <defs>
                  <linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.gold} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={C.gold} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontFamily: MONO, fontSize: 10, fill: C.t3 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="val" stroke={C.gold} strokeWidth={2} fill="url(#pGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </MCard>
      </div>

      {/* Stats row */}
      <div style={{ padding: '0 16px', display: 'flex', gap: 10, marginBottom: 10 }}>
        <MStatCard value="$22.4K" label="Gain/Month" change="+$1.2K" changeDir="up" accent={C.gold} />
        <MStatCard value="12.4%" label="Allocation" mono />
        <MStatCard value="0.84" label="Beta" mono />
      </div>

      {/* Watchlist */}
      <MSectionHeader label="Watchlist" action="+ Add" onAction={() => {}} />
      <div style={{ padding: '0 16px' }}>
        <MCard style={{ padding: 0, overflow: 'hidden' }}>
          {WATCHLIST.map((s, i) => (
            <div
              key={s.sym}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '13px 16px',
                borderBottom: i < WATCHLIST.length - 1 ? `1px solid ${C.b1}` : 'none',
              }}
            >
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: C.raise,
                border: `1px solid ${C.b2}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
                flexShrink: 0,
              }}>
                <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: C.gold }}>{s.sym.slice(0,2)}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: UI, fontSize: 14, fontWeight: 600, color: C.t1 }}>{s.sym}</div>
                <div style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>{s.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: C.t1 }}>${s.price}</div>
                <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: s.dir === 'up' ? C.up : C.down }}>
                  {s.chg}
                </div>
              </div>
            </div>
          ))}
        </MCard>
      </div>
      <div style={{ height: 20 }} />
    </div>
  )
}
