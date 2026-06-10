import React from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const GOLD = '#c9a84c';
const BLUE = '#3b82f6';
const GREEN = '#10b981';
const RED = '#ef4444';
const TEAL = '#14b8a6';
const PURPLE = '#8b5cf6';
const ORANGE = '#f97316';
const CHART_COLORS = [GOLD, BLUE, GREEN, TEAL, PURPLE, ORANGE, RED, '#ec4899'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusColor = (s) => s === 'good' ? GREEN : s === 'warning' ? GOLD : s === 'critical' ? RED : '#6b7280';
const priorityColor = (p) => p === 'CRITICAL' ? RED : p === 'HIGH' ? GOLD : GREEN;

const customTooltipStyle = {
  background: '#0f1117', border: '1px solid #1e2435',
  borderRadius: 6, fontSize: '0.75rem', color: '#e8eaed',
  padding: '8px 12px',
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={customTooltipStyle}>
      {label && <div style={{ color: '#9ca3af', marginBottom: 4 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || GOLD }}>
          {p.name}: <strong>{typeof p.value === 'number' && p.value > 999 ? '$' + p.value.toLocaleString() : p.value}</strong>
        </div>
      ))}
    </div>
  );
}

// ─── Score Gauge ──────────────────────────────────────────────────────────────

function ScoreGauge({ score, grade, label }) {
  const clamp = Math.max(0, Math.min(100, score));
  const angle = -135 + clamp * 2.7;
  const color = clamp >= 75 ? GREEN : clamp >= 55 ? GOLD : RED;
  const cx = 80, cy = 80, r = 60;

  const arc = (startAngle, endAngle, color) => {
    const s = (startAngle - 90) * Math.PI / 180;
    const e = (endAngle - 90) * Math.PI / 180;
    const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
    const large = (endAngle - startAngle) > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={160} height={100} viewBox="0 0 160 100">
        {/* Track */}
        <path d={arc(225, 315, '#1e2435')} fill="none" stroke="#1e2435" strokeWidth={10} strokeLinecap="round" />
        {/* Fill */}
        <path d={arc(225, 225 + clamp * 0.9, color)} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color}66)` }} />
        {/* Grade */}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize={26} fontWeight={900} fill={color} fontFamily="Inter,sans-serif">{grade}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize={11} fill="#6b7280" fontFamily="Inter,sans-serif">{clamp}/100</text>
      </svg>
      {label && <div style={{ fontSize: '0.6875rem', color: '#6b7280', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: -8 }}>{label}</div>}
    </div>
  );
}

// ─── Scorecard Metrics ────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, status }) {
  const c = statusColor(status);
  return (
    <div style={{
      background: '#0f1117', border: `1px solid ${c}33`,
      borderTop: `2px solid ${c}`, borderRadius: 8,
      padding: '0.875rem', flex: 1, minWidth: 0,
    }}>
      <div style={{ fontSize: '0.625rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: '1.375rem', fontWeight: 900, color: c, lineHeight: 1, fontFamily: 'monospace', marginBottom: 2 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.625rem', color: '#4b5563', lineHeight: 1.4 }}>{sub}</div>}
    </div>
  );
}

// ─── Chart Block ──────────────────────────────────────────────────────────────

function ChartBlock({ chart }) {
  const h = 220;
  const axisStyle = { fontSize: '0.625rem', fill: '#6b7280' };
  const gridStyle = { stroke: '#1e2435', strokeDasharray: '3 3' };

  const renderChart = () => {
    if (chart.type === 'pie' || chart.type === 'donut') {
      const inner = chart.type === 'donut' ? 55 : 0;
      return (
        <PieChart>
          <Pie data={chart.data} cx="50%" cy="50%" innerRadius={inner} outerRadius={85}
            dataKey="value" nameKey="name" paddingAngle={2}>
            {chart.data.map((entry, i) => (
              <Cell key={i} fill={entry.color || CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={(v) => <span style={{ fontSize: '0.625rem', color: '#9ca3af' }}>{v}</span>} />
        </PieChart>
      );
    }
    if (chart.type === 'bar') {
      return (
        <BarChart data={chart.data} barSize={chart.data.length > 6 ? 14 : 22}>
          <CartesianGrid {...gridStyle} />
          <XAxis dataKey={chart.xKey || 'name'} tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? '$' + (v / 1000).toFixed(0) + 'k' : v} />
          <Tooltip content={<CustomTooltip />} />
          {chart.bars?.map((b, i) => (
            <Bar key={i} dataKey={b.key} name={b.label} fill={b.color || CHART_COLORS[i]} radius={[3, 3, 0, 0]} />
          )) || <Bar dataKey="value" fill={GOLD} radius={[3, 3, 0, 0]} />}
          {chart.bars?.length > 1 && <Legend formatter={(v) => <span style={{ fontSize: '0.625rem', color: '#9ca3af' }}>{v}</span>} />}
        </BarChart>
      );
    }
    if (chart.type === 'area' || chart.type === 'line') {
      const Comp = chart.type === 'area' ? AreaChart : LineChart;
      return (
        <Comp data={chart.data}>
          <defs>
            {chart.lines?.map((l, i) => (
              <linearGradient key={i} id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={l.color || CHART_COLORS[i]} stopOpacity={0.25} />
                <stop offset="95%" stopColor={l.color || CHART_COLORS[i]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid {...gridStyle} />
          <XAxis dataKey={chart.xKey || 'year'} tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000000 ? '$' + (v / 1000000).toFixed(1) + 'M' : v >= 1000 ? '$' + (v / 1000).toFixed(0) + 'k' : v} />
          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={(v) => <span style={{ fontSize: '0.625rem', color: '#9ca3af' }}>{v}</span>} />
          {chart.lines?.map((l, i) => chart.type === 'area' ? (
            <Area key={i} type="monotone" dataKey={l.key} name={l.label} stroke={l.color || CHART_COLORS[i]} fill={`url(#grad${i})`} strokeWidth={2} dot={false} />
          ) : (
            <Line key={i} type="monotone" dataKey={l.key} name={l.label} stroke={l.color || CHART_COLORS[i]} strokeWidth={2} dot={false} />
          ))}
        </Comp>
      );
    }
    return null;
  };

  return (
    <div style={{ background: '#0f1117', border: '1px solid #1e2435', borderRadius: 8, padding: '1rem' }}>
      <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>{chart.title}</div>
      <ResponsiveContainer width="100%" height={h}>
        {renderChart() || <div />}
      </ResponsiveContainer>
    </div>
  );
}

// ─── Callout Box ──────────────────────────────────────────────────────────────

function Callout({ type, title, text }) {
  const colors = { good: GREEN, warning: GOLD, critical: RED, info: BLUE };
  const c = colors[type] || BLUE;
  return (
    <div style={{
      border: `1px solid ${c}38`, borderTop: `2px solid ${c}`, borderRadius: 6,
      background: `${c}0d`, padding: '0.75rem 1rem', marginBottom: '0.625rem',
    }}>
      {title && <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: c, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{title}</div>}
      <div style={{ fontSize: '0.8125rem', color: '#d1d5db', lineHeight: 1.6 }}>{text}</div>
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ label, value, max, pct: pctOverride, color, showValue, target }) {
  const pct = pctOverride !== undefined ? pctOverride : max > 0 ? Math.min(100, value / max * 100) : 0;
  const c = color || (pct >= 75 ? GREEN : pct >= 45 ? GOLD : RED);
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{label}</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: c }}>{showValue || `${pct.toFixed(0)}%`}</span>
      </div>
      <div style={{ height: 6, background: '#1e2435', borderRadius: 99, overflow: 'hidden', position: 'relative' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: c, borderRadius: 99, transition: 'width 0.6s ease', boxShadow: `0 0 6px ${c}66` }} />
        {target && <div style={{ position: 'absolute', top: 0, height: '100%', left: `${target}%`, width: 2, background: '#ffffff44' }} />}
      </div>
    </div>
  );
}

// ─── Big Number ───────────────────────────────────────────────────────────────

function BigNumber({ value, label, sub, color }) {
  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <div style={{ fontSize: '2rem', fontWeight: 900, color: color || GOLD, lineHeight: 1, fontFamily: 'monospace', letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: '0.625rem', color: '#4b5563', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// ─── Data Table ───────────────────────────────────────────────────────────────

function DataTable({ headers, rows, highlight }) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: 6, border: '1px solid #1e2435' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
        <thead>
          <tr style={{ background: '#0a0c12' }}>
            {headers.map((h, i) => (
              <th key={i} style={{ padding: '0.5rem 0.75rem', textAlign: i === 0 ? 'left' : 'right', color: GOLD, fontWeight: 700, fontSize: '0.625rem', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid #1e2435', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? '#0f1117' : '#0b0d13', borderBottom: '1px solid #1e243522' }}>
              {row.map((cell, ci) => (
                <td key={ci} style={{
                  padding: '0.5rem 0.75rem',
                  textAlign: ci === 0 ? 'left' : 'right',
                  color: highlight && ci === highlight ? GOLD : '#d1d5db',
                  fontWeight: highlight && ci === highlight ? 700 : 400,
                  fontFamily: ci > 0 ? 'monospace' : 'inherit',
                  fontSize: '0.75rem',
                  whiteSpace: 'nowrap',
                }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Section Block ────────────────────────────────────────────────────────────

function SectionBlock({ section }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        marginBottom: '1rem', paddingBottom: '0.625rem',
        borderBottom: '1px solid rgba(201,169,110,0.15)',
      }}>
        {section.icon && <span style={{ color: GOLD, fontSize: '0.875rem' }}>{section.icon}</span>}
        <h2 style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 800, color: GOLD, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{section.title}</h2>
      </div>

      {/* Progress bars */}
      {section.bars?.map((b, i) => <ProgressBar key={i} {...b} />)}

      {/* Big numbers row */}
      {section.bigNumbers?.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${section.bigNumbers.length}, 1fr)`, gap: '0.5rem', marginBottom: '1rem', background: '#0a0c12', borderRadius: 8, border: '1px solid #1e2435' }}>
          {section.bigNumbers.map((n, i) => <BigNumber key={i} {...n} />)}
        </div>
      )}

      {/* Content text */}
      {section.content && (
        <div style={{ fontSize: '0.8125rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: section.callouts?.length ? '1rem' : 0 }}
          dangerouslySetInnerHTML={{ __html: section.content.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#d1d5db">$1</strong>').replace(/\n/g, '<br/>') }}
        />
      )}

      {/* Callouts */}
      {section.callouts?.map((c, i) => <Callout key={i} {...c} />)}

      {/* Table */}
      {section.table && <div style={{ marginTop: '0.75rem' }}><DataTable {...section.table} /></div>}
    </div>
  );
}

// ─── Action Plan ──────────────────────────────────────────────────────────────

function ActionPlanSection({ actions }) {
  if (!actions?.length) return null;
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '0.625rem', borderBottom: '1px solid rgba(201,169,110,0.15)' }}>
        <span style={{ color: GOLD }}>◈</span>
        <h2 style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 800, color: GOLD, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Action Plan</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {actions.map((a, i) => {
          const c = priorityColor(a.priority);
          return (
            <div key={i} style={{ background: '#0f1117', border: `1px solid ${c}38`, borderTop: `2px solid ${c}`, borderRadius: 8, padding: '0.875rem 1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <span style={{ fontSize: '0.5rem', fontWeight: 800, color: c, letterSpacing: '0.08em', textTransform: 'uppercase', background: `${c}18`, padding: '2px 6px', borderRadius: 3 }}>{a.priority}</span>
                {a.timeline && <span style={{ fontSize: '0.5625rem', color: '#4b5563', whiteSpace: 'nowrap' }}>{a.timeline}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#e8eaed', marginBottom: 3 }}>{a.action}</div>
                {a.impact && <div style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.5 }}>{a.impact}</div>}
              </div>
              {a.amount && <div style={{ fontSize: '1rem', fontWeight: 900, color: c, fontFamily: 'monospace', flexShrink: 0 }}>{a.amount}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Scenarios ────────────────────────────────────────────────────────────────

function ScenariosSection({ scenarios }) {
  if (!scenarios?.length) return null;
  const colors = [RED, GOLD, GREEN];
  const labels = ['Conservative', 'Base Case', 'Optimistic'];
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '0.625rem', borderBottom: '1px solid rgba(201,169,110,0.15)' }}>
        <span style={{ color: GOLD }}>◈</span>
        <h2 style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 800, color: GOLD, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scenario Analysis</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
        {scenarios.map((s, i) => (
          <div key={i} style={{ background: '#0f1117', border: `1px solid ${colors[i]}33`, borderTop: `3px solid ${colors[i]}`, borderRadius: 8, padding: '1rem' }}>
            <div style={{ fontSize: '0.625rem', fontWeight: 800, color: colors[i], textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{labels[i]}</div>
            <div style={{ fontSize: '1.375rem', fontWeight: 900, color: colors[i], fontFamily: 'monospace', lineHeight: 1, marginBottom: 6 }}>{s.outcome}</div>
            <div style={{ fontSize: '0.6875rem', color: '#6b7280', lineHeight: 1.5 }}>{s.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Report Renderer ─────────────────────────────────────────────────────

export default function ReportRenderer({ data }) {
  if (!data) return null;

  return (
    <div style={{ padding: '1.5rem', maxWidth: '100%' }}>
      {/* Scorecard header */}
      <div style={{
        background: '#0a0c12', border: '1px solid #1e2435',
        borderRadius: 10, padding: '1.25rem', marginBottom: '1.5rem',
        display: 'flex', alignItems: 'center', gap: '1.5rem',
        flexWrap: 'wrap',
      }}>
        <ScoreGauge score={data.score} grade={data.grade} label="Overall Score" />
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ fontSize: '0.625rem', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>SUMMARY</div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#e8eaed', marginBottom: '0.5rem' }}>{data.headline}</div>
          <div style={{ fontSize: '0.8125rem', color: '#9ca3af', lineHeight: 1.6 }}>{data.summary}</div>
        </div>
      </div>

      {/* Key metrics row */}
      {data.scorecard?.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(4, data.scorecard.length)}, 1fr)`, gap: '0.625rem', marginBottom: '1.5rem' }}>
          {data.scorecard.map((m, i) => <MetricCard key={i} {...m} />)}
        </div>
      )}

      {/* Charts row */}
      {data.charts?.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: data.charts.length === 1 ? '1fr' : data.charts.length === 2 ? '1fr 1fr' : '1fr 1fr 1fr',
          gap: '0.75rem', marginBottom: '2rem',
        }}>
          {data.charts.map((chart, i) => <ChartBlock key={i} chart={chart} />)}
        </div>
      )}

      {/* Sections */}
      {data.sections?.map((section, i) => <SectionBlock key={i} section={section} />)}

      {/* Scenarios */}
      <ScenariosSection scenarios={data.scenarios} />

      {/* Action plan */}
      <ActionPlanSection actions={data.actions} />

      {/* Disclaimer */}
      <div style={{ padding: '0.875rem 1rem', background: '#0a0c12', borderRadius: 8, border: '1px solid #1e2435', fontSize: '0.6875rem', color: '#4b5563', lineHeight: 1.6 }}>
        <strong style={{ color: '#6b7280' }}>Educational Use Only —</strong> This report does not constitute financial, tax, legal, or investment advice. All projections are estimates based on your inputs and general assumptions. Consult qualified licensed professionals before making any financial decisions. Past performance does not guarantee future results.
      </div>
    </div>
  );
}
