import { useState } from 'react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader, MResultRow } from '../../components/MCard'
import { C, UI, MONO } from '../../tokens'

const fmt = n => '$' + Math.round(n||0).toLocaleString()
const fmtp = n => `${(n*100).toFixed(1)}%`

function calcMortgage(principal, rate, years) {
  const r = rate / 100 / 12
  const n = years * 12
  if (r === 0) return principal / n
  return principal * r * Math.pow(1+r,n) / (Math.pow(1+r,n)-1)
}

export default function MRealEstatePlanning() {
  const [price, setPrice] = useState(450000)
  const [down, setDown] = useState(20)
  const [rate, setRate] = useState(6.82)
  const [years, setYears] = useState(30)
  const [tax, setTax] = useState(6000)
  const [insurance, setInsurance] = useState(1800)
  const [rent, setRent] = useState(2800)
  const [tab, setTab] = useState('buy')

  const downAmt = price * down / 100
  const loan = price - downAmt
  const monthly = calcMortgage(loan, rate, years)
  const totalMonthly = monthly + (tax + insurance) / 12
  const totalCost = totalMonthly * years * 12 + downAmt
  const buyVsRent = totalMonthly - rent

  return (
    <div style={{ background:C.bg, minHeight:'100dvh' }}>
      <ScreenHeader title="Real Estate Planning" subtitle="Planning" accent={C.gold} />

      <div style={{ display:'flex', borderBottom:`1px solid ${C.b2}`, padding:'0 16px' }}>
        {['buy','compare','tips'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex:1, padding:'11px 0', background:'none', border:'none', cursor:'pointer',
            borderBottom:`2px solid ${tab===t ? C.gold : 'transparent'}`,
            color: tab===t ? C.gold : C.t3,
            fontFamily:UI, fontSize:12, fontWeight:600, textTransform:'capitalize',
          }}>{t==='compare'?'Buy vs Rent':t.charAt(0).toUpperCase()+t.slice(1)}</button>
        ))}
      </div>

      {tab === 'buy' && (
        <div style={{ padding:'12px 16px 0' }}>
          <MCard>
            <MResultRow label="Monthly Payment (P&I)" value={fmt(monthly)} highlight accent={C.gold} mono />
            <MResultRow label="Total Monthly Cost" value={fmt(totalMonthly)} mono />
            <MResultRow label="Down Payment" value={fmt(downAmt)} mono />
            <MResultRow label="Loan Amount" value={fmt(loan)} mono />
            <MResultRow label="Total Interest Paid" value={fmt(monthly*years*12 - loan)} mono />
            <MResultRow label="Total Cost of Ownership" value={fmt(totalCost)} mono />
          </MCard>

          <MCard>
            {[
              { l:'Home Price', v:price, set:setPrice, min:100000, max:2000000, step:5000, d:fmt(price) },
              { l:'Down Payment', v:down, set:setDown, min:3, max:50, step:1, d:`${down}%` },
              { l:'Interest Rate', v:rate, set:setRate, min:3, max:12, step:0.1, d:`${rate}%` },
              { l:'Loan Term (years)', v:years, set:setYears, min:10, max:30, step:5, d:`${years} yr` },
            ].map(({ l, v, set:sv, min, max, step, d }) => (
              <div key={l} style={{ marginBottom:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                  <span style={{ fontFamily:UI, fontSize:12, color:C.t2, fontWeight:600 }}>{l}</span>
                  <span style={{ fontFamily:MONO, fontSize:13, color:C.gold, fontWeight:700 }}>{d}</span>
                </div>
                <input type="range" min={min} max={max} step={step} value={v} onChange={e => sv(+e.target.value)} style={{ width:'100%', accentColor:C.gold }} />
              </div>
            ))}
          </MCard>
        </div>
      )}

      {tab === 'compare' && (
        <div style={{ padding:'12px 16px 0' }}>
          <MCard>
            <div style={{ fontFamily:UI, fontSize:13, color:C.t2, marginBottom:14 }}>Compare the true cost of buying vs renting</div>
            <MResultRow label="Monthly Ownership Cost" value={fmt(totalMonthly)} mono />
            <MResultRow label="Monthly Rent" value={fmt(rent)} mono />
            <MResultRow label="Monthly Difference" value={`${buyVsRent > 0 ? '+' : ''}${fmt(buyVsRent)}`} highlight accent={buyVsRent > 0 ? C.down : C.up} mono />
          </MCard>

          <div style={{ marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
              <span style={{ fontFamily:UI, fontSize:12, color:C.t2, fontWeight:600 }}>Monthly Rent</span>
              <span style={{ fontFamily:MONO, fontSize:13, color:C.gold, fontWeight:700 }}>{fmt(rent)}</span>
            </div>
            <input type="range" min={500} max={8000} step={50} value={rent} onChange={e => setRent(+e.target.value)} style={{ width:'100%', accentColor:C.gold }} />
          </div>

          <MCard style={{ background:C.raise }}>
            <div style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:C.gold, marginBottom:6 }}>Key Consideration</div>
            <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.7 }}>
              Ownership costs more monthly but builds equity over time. The {buyVsRent > 0 ? 'extra' : 'savings'} {fmt(Math.abs(buyVsRent))}/mo needs to be weighed against the equity buildup of ~{fmt(loan * 0.04)}/year in principal paydown in year 1.
            </div>
          </MCard>
        </div>
      )}

      {tab === 'tips' && (
        <div style={{ padding:'12px 16px 0' }}>
          {[
            { tip:'28/36 Qualifying Rule', body:'Lenders prefer housing costs ≤28% of gross income and total debt ≤36%. At $120K income, target ≤$2,800/mo for housing.' },
            { tip:'3–5% Down vs 20% Down', body:'20% down avoids PMI (~$100–200/mo). But 3–5% down programs (FHA, conventional 97) allow faster market entry. PMI cancels once equity hits 20%.' },
            { tip:'Emergency Fund First', body:'Keep 3–6 months of expenses in cash before buying. Homeownership has unexpected costs: repairs, appliances, maintenance average 1–2% of home value annually.' },
            { tip:'Points and Rate Buydowns', body:'1 discount point = 1% of loan = ~0.25% rate reduction. Break-even on points: divide point cost by monthly savings. Usually 3–5 years.' },
          ].map(({ tip, body }) => (
            <MCard key={tip}>
              <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.gold, marginBottom:6 }}>{tip}</div>
              <div style={{ fontFamily:UI, fontSize:13, color:C.t2, lineHeight:1.7 }}>{body}</div>
            </MCard>
          ))}
        </div>
      )}
      <div style={{ height:24 }} />
    </div>
  )
}
