import { useState } from 'react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader } from '../../components/MCard'
import { C, UI, MONO } from '../../tokens'

const fmt = n => '$' + Math.round(n||0).toLocaleString()

export default function MBizPlan() {
  const [revenue, setRevenue] = useState(250000)
  const [expenses, setExpenses] = useState(80000)
  const [salary, setSalary] = useState(60000)
  const [entity, setEntity] = useState('s-corp')

  const netIncome = revenue - expenses - salary
  const selfEmpTax = entity === 'sole-prop' ? Math.min(netIncome, 168600) * 0.153 + Math.max(0, netIncome - 168600) * 0.029 : 0
  const sCorp_SEtax = entity === 's-corp' ? Math.min(salary, 168600) * 0.153 + Math.max(0, salary - 168600) * 0.029 : 0
  const seComparison = selfEmpTax - sCorp_SEtax
  const qbi = entity !== 'c-corp' ? Math.max(0, netIncome) * 0.20 : 0

  const STRATEGIES = [
    { name:'S-Corp Election Savings', value:fmt(seComparison), desc:'SE tax savings by paying salary on $' + salary.toLocaleString() + ' vs full self-employment tax on all income.', color:C.gold },
    { name:'QBI Deduction', value:fmt(qbi), desc:'20% of qualified business income reduces taxable income. At 24% rate, this saves ' + fmt(qbi * 0.24) + '.', color:C.teal },
    { name:'Solo 401k Max Contribution', value:'$69,000', desc:'Employee deferral ($23,500) + 25% employer profit sharing. Massive retirement savings opportunity.', color:C.indigo },
    { name:'Health Insurance Deduction', value:'100% deductible', desc:'All health premiums for you and family reduce adjusted gross income dollar-for-dollar.', color:C.gold },
  ]

  return (
    <div style={{ background:C.bg, minHeight:'100dvh' }}>
      <ScreenHeader title="Build a Plan" subtitle="Business Planning" accent={C.gold} />

      <div style={{ padding:'14px 16px 0' }}>
        {/* Entity Toggle */}
        <div style={{ display:'flex', gap:8, marginBottom:14 }}>
          {[['sole-prop','Sole Prop'],['s-corp','S-Corp'],['c-corp','C-Corp']].map(([k,l]) => (
            <button key={k} onClick={() => setEntity(k)} style={{ flex:1, padding:'9px', borderRadius:10, border:`1px solid ${entity===k ? C.gold : C.b2}`, background: entity===k ? 'rgba(201,169,110,0.12)' : C.surf, cursor:'pointer', fontFamily:UI, fontSize:11, fontWeight:600, color: entity===k ? C.gold : C.t3 }}>{l}</button>
          ))}
        </div>

        {/* Summary */}
        <MCard style={{ background:C.raise }}>
          <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:C.gold, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:8 }}>Financial Summary</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[['Net Business Income', fmt(netIncome), C.gold],['Est. SE / Payroll Tax', fmt(entity==='s-corp' ? sCorp_SEtax : selfEmpTax), '#c0392b'],['QBI Deduction', fmt(qbi), C.teal],['After-Tax Savings vs Sole Prop', fmt(Math.max(0,seComparison)), C.up]].map(([l,v,c]) => (
              <div key={l}>
                <div style={{ fontFamily:UI, fontSize:10, color:C.t3, marginBottom:2 }}>{l}</div>
                <div style={{ fontFamily:MONO, fontSize:14, fontWeight:700, color:c }}>{v}</div>
              </div>
            ))}
          </div>
        </MCard>

        {/* Sliders */}
        <MCard>
          {[
            { l:'Annual Revenue', v:revenue, set:setRevenue, min:0, max:2000000, step:10000, d:fmt(revenue) },
            { l:'Business Expenses', v:expenses, set:setExpenses, min:0, max:500000, step:5000, d:fmt(expenses) },
            { l:'Owner Salary (S-Corp)', v:salary, set:setSalary, min:30000, max:300000, step:5000, d:fmt(salary), show: entity==='s-corp' },
          ].filter(f => f.show !== false).map(({ l, v, set:sv, min, max, step, d }) => (
            <div key={l} style={{ marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <span style={{ fontFamily:UI, fontSize:12, color:C.t2, fontWeight:600 }}>{l}</span>
                <span style={{ fontFamily:MONO, fontSize:13, color:C.gold, fontWeight:700 }}>{d}</span>
              </div>
              <input type="range" min={min} max={max} step={step} value={v} onChange={e => sv(+e.target.value)} style={{ width:'100%', accentColor:C.gold }} />
            </div>
          ))}
        </MCard>
      </div>

      <MSectionHeader label="Optimization Strategies" />
      <div style={{ padding:'0 16px' }}>
        {STRATEGIES.map(s => (
          <MCard key={s.name}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:5 }}>
              <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:s.color, flex:1 }}>{s.name}</div>
              <span style={{ fontFamily:MONO, fontSize:13, fontWeight:700, color:s.color, flexShrink:0, marginLeft:10 }}>{s.value}</span>
            </div>
            <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.6 }}>{s.desc}</div>
          </MCard>
        ))}
      </div>
      <div style={{ height:24 }} />
    </div>
  )
}
