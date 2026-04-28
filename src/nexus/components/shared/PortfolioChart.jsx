import React from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { fmt } from '../../data/demoData'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-surface-2)',
      border: '1px solid var(--border-light)',
      borderRadius: 8,
      padding: '10px 14px',
      fontSize: 12,
    }}>
      <div style={{ color: 'var(--text-tertiary)', marginBottom: 6, fontWeight: 500 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, display: 'flex', gap: 8, justifyContent: 'space-between', marginBottom: 2 }}>
          <span style={{ color: 'var(--text-secondary)' }}>{p.name}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{fmt.compact(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export function PerformanceChart({ data, height = 200 }) {
  const min = Math.min(...data.flatMap(d => [d.value, d.benchmark])) * 0.97
  const max = Math.max(...data.flatMap(d => [d.value, d.benchmark])) * 1.01

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#c9a84c" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#c9a84c" stopOpacity={0.01} />
          </linearGradient>
          <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#4a8fff" stopOpacity={0.08} />
            <stop offset="95%" stopColor="#4a8fff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 10, fill: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
          axisLine={false}
          tickLine={false}
          interval={1}
        />
        <YAxis
          domain={[min, max]}
          tickFormatter={v => fmt.compact(v)}
          tick={{ fontSize: 10, fill: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
          axisLine={false}
          tickLine={false}
          width={52}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="benchmark"
          name="Benchmark"
          stroke="#4a8fff"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          fill="url(#blueGrad)"
          dot={false}
          activeDot={{ r: 4, fill: '#4a8fff' }}
        />
        <Area
          type="monotone"
          dataKey="value"
          name="Portfolio"
          stroke="#c9a84c"
          strokeWidth={2}
          fill="url(#goldGrad)"
          dot={false}
          activeDot={{ r: 5, fill: '#c9a84c', stroke: 'var(--bg-surface)', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

const RADIAN = Math.PI / 180
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
  if (value < 5) return null
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="rgba(255,255,255,0.8)" textAnchor="middle" dominantBaseline="central"
      fontSize={11} fontFamily="var(--font-mono)" fontWeight={500}>
      {value}%
    </text>
  )
}

export function AllocationPie({ data, size = 180 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
      <PieChart width={size} height={size}>
        <Pie
          data={data}
          cx={size/2 - 2}
          cy={size/2 - 2}
          innerRadius={size * 0.28}
          outerRadius={size * 0.46}
          paddingAngle={2}
          dataKey="value"
          labelLine={false}
          label={renderCustomLabel}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} stroke="var(--bg-surface)" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            const d = payload[0].payload
            return (
              <div style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-light)', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
                <div style={{ color: d.color, fontWeight: 600 }}>{d.name}</div>
                <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                  {d.value}% · {fmt.compact(d.amount)}
                </div>
              </div>
            )
          }}
        />
      </PieChart>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 120 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{d.name}</span>
                <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 500 }}>
                  {d.value}%
                </span>
              </div>
              <div className="progress-bar" style={{ marginTop: 3 }}>
                <div className="progress-fill" style={{ width: `${d.value}%`, background: d.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
