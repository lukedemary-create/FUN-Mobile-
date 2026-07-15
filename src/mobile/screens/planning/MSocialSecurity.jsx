import { useState } from 'react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader, MResultRow } from '../../components/MCard'
import { C, UI, MONO } from '../../tokens'

const fmt = n => '$' + Math.round(n||0).toLocaleString()

function estimateBenefit(age, currentAge, pia) {
  if (age < 62) return 0
  if (age === 67) return pia
  if (age < 67) {
    const monthsEarly = (67 - age) * 12
    const reduction = monthsEarly <= 36 ? monthsEarly * (5/9) / 100 : (36 * (5/9) + (monthsEarly - 36) * (5/12)) / 100
    return pia * (1 - reduction)
  }
  const monthsLate = (age - 67) * 12
  return pia * (1 + (monthsLate * 0.00667))
}

export default function MSocialSecurity() {
  const [currentAge, setCurrentAge] = useState(55)
  const [claimAge, setClaimAge] = useState(67)
  const [pia, setPia] = useState(2800)

  const benefit = estimateBenefit(claimAge, currentAge, pia)
  const earlyBenefit = estimateBenefit(62, currentAge, pia)
  const fullBenefit = estimateBenefit(67, currentAge, pia)
  const lateBenefit = estimateBenefit(70, currentAge, pia)

  const compareData = [
    { age:62, label:'Age 62 (Early)', benefit:earlyBenefit, note:'Permanent reduction up to 30%' },
    { age:67, label:'Age 67 (FRA)', benefit:fullBenefit, note:'Full Retirement Age — 2026 cohort' },
    { age:70, label:'Age 70 (Delayed)', benefit:lateBenefit, note:'Maximum benefit — +24% over FRA' },
  ]

  return (
    <div style={{ background:C.bg, minHeight:'100dvh' }}>
      <ScreenHeader title="Social Security" subtitle="Planning" accent={C.gold} />

      {/* Result */}
      <div style={{ padding:'14px 16px 0' }}>
        <MCard>
          <div style={{ fontFamily:UI, fontSize:11, color:C.t3, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:4 }}>
            Your Monthly Benefit at Age {claimAge}
          </div>
          <div style={{ fontFamily:MONO, fontSize:36, fontWeight:700, color:C.gold }}>{fmt(benefit)}/mo</div>
          <div style={{ fontFamily:UI, fontSize:13, color:C.t2, marginTop:4 }}>
            {fmt(benefit * 12)}/year · {fmt(benefit * 12 * (90 - claimAge))} lifetime (to 90)
          </div>
        </MCard>
      </div>

      {/* Sliders */}
      <MSectionHeader label="Your Inputs" />
      <div style={{ padding:'0 16px' }}>
        <MCard>
          {[
            { l:'Current Age', v:currentAge, set:setCurrentAge, min:30, max:69, step:1, display:`${currentAge}` },
            { l:'Claim Age', v:claimAge, set:setClaimAge, min:62, max:70, step:1, display:`${claimAge}` },
            { l:'Estimated PIA', v:pia, set:setPia, min:500, max:4000, step:50, display:fmt(pia) },
          ].map(({ l, v, set:sv, min, max, step, display }) => (
            <div key={l} style={{ marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                <span style={{ fontFamily:UI, fontSize:12, color:C.t2, fontWeight:600 }}>{l}</span>
                <span style={{ fontFamily:MONO, fontSize:13, color:C.gold, fontWeight:700 }}>{display}</span>
              </div>
              <input type="range" min={min} max={max} step={step} value={v} onChange={e => sv(+e.target.value)}
                style={{ width:'100%', accentColor:C.gold }} />
            </div>
          ))}
        </MCard>
      </div>

      {/* Claiming strategy comparison */}
      <MSectionHeader label="Claiming Strategy Comparison" />
      <div style={{ padding:'0 16px' }}>
        {compareData.map(d => (
          <div key={d.age} style={{
            background: d.age===claimAge ? C.goldDim : C.surf,
            border:`1px solid ${d.age===claimAge ? C.gold : C.b2}`,
            borderRadius:14, padding:'14px', marginBottom:8,
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
              <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color: d.age===claimAge ? C.gold : C.t1 }}>{d.label}</div>
              <div style={{ fontFamily:MONO, fontSize:16, fontWeight:700, color: d.age===claimAge ? C.gold : C.t1 }}>{fmt(d.benefit)}/mo</div>
            </div>
            <div style={{ fontFamily:UI, fontSize:11, color:C.t3 }}>{d.note}</div>
          </div>
        ))}
      </div>

      <div style={{ padding:'0 16px 20px' }}>
        <MCard style={{ background:C.raise }}>
          <div style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:C.gold, marginBottom:6 }}>The Break-Even Analysis</div>
          <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.7 }}>
            Delaying from 62 to 70 increases your monthly benefit by ~76%. The break-even age for delaying from 62 vs 70 is approximately 82. If you expect to live beyond 82, delayed claiming typically maximizes lifetime benefits.
          </div>
        </MCard>
      </div>
    </div>
  )
}
