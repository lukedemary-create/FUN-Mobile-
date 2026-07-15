import { useState } from 'react'
import useUserLS from '../../hooks/useUserLS'
import { Plus, Trash2 } from 'lucide-react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader, MPrimaryBtn, MInput } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const CATS_DEFAULT = [
  { name:'Housing', budget:2000, spent:1850, color:C.teal },
  { name:'Food', budget:800, spent:720, color:C.gold },
  { name:'Transport', budget:600, spent:534, color:C.indigo },
  { name:'Healthcare', budget:300, spent:215, color:C.up },
  { name:'Entertainment', budget:400, spent:380, color:C.warning },
  { name:'Savings', budget:1000, spent:1000, color:C.success },
]

const fmt = n => '$' + Math.round(n || 0).toLocaleString()

export default function MBudgetPlanner() {
  const [income, setIncome] = useUserLS('bp_mobile_income', 8500)
  const [cats, setCats] = useUserLS('bp_mobile_cats', CATS_DEFAULT)
  const [tab, setTab] = useState('overview')

  const totalBudget = cats.reduce((a, c) => a + c.budget, 0)
  const totalSpent = cats.reduce((a, c) => a + c.spent, 0)
  const remaining = income - totalSpent
  const savingsRate = income > 0 ? ((income - totalSpent) / income * 100).toFixed(1) : 0

  const pieData = cats.map(c => ({ name: c.name, value: c.spent, color: c.color }))

  return (
    <div style={{ background:C.bg, minHeight:'100dvh' }}>
      <ScreenHeader title="Budget Planner" subtitle="Planning" accent={C.gold} />

      {/* Tab bar */}
      <div style={{ display:'flex', borderBottom:`1px solid ${C.b2}`, padding:'0 16px' }}>
        {['overview','categories','income'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex:1, padding:'11px 0', background:'none', border:'none', cursor:'pointer',
            borderBottom:`2px solid ${tab===t ? C.gold : 'transparent'}`,
            color: tab===t ? C.gold : C.t3,
            fontFamily:UI, fontSize:13, fontWeight:600, textTransform:'capitalize',
          }}>{t}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          {/* Summary card */}
          <div style={{ padding:'14px 16px 0' }}>
            <MCard>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:14 }}>
                {[
                  { l:'Income', v:fmt(income), c:C.gold },
                  { l:'Spent', v:fmt(totalSpent), c:C.t1 },
                  { l:'Remaining', v:fmt(remaining), c: remaining >= 0 ? C.up : C.down },
                ].map(({ l, v, c }) => (
                  <div key={l} style={{ textAlign:'center' }}>
                    <div style={{ fontFamily:UI, fontSize:10, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em' }}>{l}</div>
                    <div style={{ fontFamily:MONO, fontSize:16, fontWeight:700, color:c, marginTop:4 }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Pie chart */}
              <div style={{ height:180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                      {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background:C.raise, border:`1px solid ${C.b2}`, borderRadius:8 }} formatter={v=>[fmt(v)]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={{ textAlign:'center', marginTop:6 }}>
                <div style={{ fontFamily:UI, fontSize:11, color:C.t3 }}>Savings Rate</div>
                <div style={{ fontFamily:MONO, fontSize:24, fontWeight:700, color:C.gold }}>{savingsRate}%</div>
              </div>
            </MCard>
          </div>

          {/* Category bars */}
          <MSectionHeader label="Spending Breakdown" />
          <div style={{ padding:'0 16px' }}>
            {cats.map(c => {
              const pct = Math.min((c.spent / c.budget) * 100, 100)
              const over = c.spent > c.budget
              return (
                <div key={c.name} style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:12, padding:'12px', marginBottom:8 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <div style={{ fontFamily:UI, fontSize:13, fontWeight:600, color:C.t1 }}>{c.name}</div>
                    <div style={{ fontFamily:MONO, fontSize:12, color: over ? C.down : C.t2 }}>
                      {fmt(c.spent)} / {fmt(c.budget)}
                    </div>
                  </div>
                  <div style={{ height:5, borderRadius:99, background:C.b2 }}>
                    <div style={{ height:'100%', borderRadius:99, width:`${pct}%`, background: over ? C.down : c.color, transition:'width 0.3s' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {tab === 'categories' && (
        <div style={{ padding:'12px 16px 0' }}>
          {cats.map((c, i) => (
            <MCard key={c.name}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:c.color, flexShrink:0 }} />
                <div style={{ fontFamily:UI, fontSize:14, fontWeight:600, color:C.t1, flex:1 }}>{c.name}</div>
                <button onClick={() => setCats(p => p.filter((_,j)=>j!==i))} style={{ background:'none', border:'none', cursor:'pointer' }}>
                  <Trash2 size={14} color={C.t3} />
                </button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {[['Budget', 'budget'], ['Spent', 'spent']].map(([l, k]) => (
                  <div key={k}>
                    <div style={{ fontFamily:UI, fontSize:10, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>{l}</div>
                    <input
                      type="number"
                      value={c[k]}
                      onChange={e => setCats(p => p.map((x,j) => j===i ? { ...x, [k]: +e.target.value } : x))}
                      style={{ width:'100%', background:C.bg, border:`1px solid ${C.b2}`, borderRadius:8, padding:'9px 10px', color:C.t1, fontFamily:MONO, fontSize:14, outline:'none' }}
                    />
                  </div>
                ))}
              </div>
            </MCard>
          ))}
        </div>
      )}

      {tab === 'income' && (
        <div style={{ padding:'16px 16px 0' }}>
          <MCard>
            <div style={{ fontFamily:UI, fontSize:13, color:C.t2, marginBottom:14, lineHeight:1.6 }}>
              Enter your monthly take-home income (after tax).
            </div>
            <div>
              <div style={{ fontFamily:UI, fontSize:11, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>Monthly Income</div>
              <div style={{ display:'flex', alignItems:'center', background:C.bg, border:`1px solid ${C.b2}`, borderRadius:10, padding:'0 12px' }}>
                <span style={{ fontFamily:MONO, fontSize:16, color:C.t3, marginRight:6 }}>$</span>
                <input
                  type="number"
                  value={income}
                  onChange={e => setIncome(+e.target.value || 0)}
                  style={{ flex:1, background:'none', border:'none', outline:'none', fontFamily:MONO, fontSize:18, color:C.t1, padding:'12px 0' }}
                />
              </div>
              <div style={{ fontFamily:UI, fontSize:12, color:C.t3, marginTop:8 }}>
                Annual income: {fmt(income * 12)}
              </div>
            </div>
          </MCard>
        </div>
      )}
      <div style={{ height:24 }} />
    </div>
  )
}
