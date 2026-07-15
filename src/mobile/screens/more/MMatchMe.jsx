import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader } from '../../components/MCard'
import { C, UI, MONO } from '../../tokens'

const STEPS = [
  {
    q:'What best describes your primary financial goal right now?',
    options:['Retirement Planning','Investment Management','Tax Optimization','Estate Planning','Business Planning','Debt Reduction & Budgeting'],
  },
  {
    q:'What is your approximate investable asset level?',
    options:['Under $100K','$100K–$500K','$500K–$1M','$1M–$5M','Over $5M'],
  },
  {
    q:'What type of advisor relationship do you prefer?',
    options:['Fee-Only (hourly or flat fee)','AUM-based (% of portfolio)','Fee-Based (mix)','Commission-based','Not sure'],
  },
  {
    q:'How often would you want to meet with an advisor?',
    options:['Monthly check-ins','Quarterly reviews','Annually','As needed','Just for a one-time plan'],
  },
  {
    q:'Where are you located?',
    options:['Northeast (NY, NJ, CT, MA, etc.)','Southeast (FL, GA, NC, etc.)','Midwest','West Coast','Central / Mountain','No preference / Virtual OK'],
  },
]

const MATCHES = [
  { name:'Sarah Mitchell, CFP®', firm:'Meridian Wealth Partners', match:98, specialty:'Retirement · Estate', city:'New York, NY' },
  { name:'Jennifer Torres, CFP®', firm:'Torres Financial Group', match:94, specialty:'Business · Tax', city:'Austin, TX' },
  { name:'David Chen, CFA®', firm:'Pacific Crest Advisors', match:89, specialty:'Investments · Tax', city:'San Francisco, CA' },
]

export default function MMatchMe() {
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [done, setDone] = useState(false)

  function handleSelect(option) {
    const newAnswers = [...answers, option]
    setAnswers(newAnswers)
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      setDone(true)
    }
  }

  if (done) {
    return (
      <div style={{ background:C.bg, minHeight:'100dvh' }}>
        <ScreenHeader title="Your Matches" subtitle="Match Me" accent={C.teal} />
        <div style={{ padding:'16px 16px 0' }}>
          <MCard style={{ background:`linear-gradient(135deg, rgba(0,180,198,0.15) 0%, rgba(0,180,198,0.04) 100%)`, border:`1px solid rgba(0,180,198,0.25)`, marginBottom:16 }}>
            <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.teal, marginBottom:4 }}>Matching Complete</div>
            <div style={{ fontFamily:UI, fontSize:13, color:C.t2, lineHeight:1.6 }}>Based on your answers, here are your top advisor matches.</div>
          </MCard>

          {MATCHES.map((m, i) => (
            <div key={m.name} onClick={() => nav(`/more/wealth-counsel/advisor/${i+1}`, { state: m })} style={{ background:C.surf, border:`1px solid ${i===0 ? C.teal : C.b2}`, borderRadius:16, padding:'14px', marginBottom:10, cursor:'pointer' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                <div style={{ fontFamily:UI, fontSize:14, fontWeight:700, color:C.t1 }}>{m.name}</div>
                <div style={{ background:`rgba(0,180,198,0.15)`, border:`1px solid rgba(0,180,198,0.3)`, borderRadius:8, padding:'3px 8px' }}>
                  <span style={{ fontFamily:MONO, fontSize:13, fontWeight:700, color:C.teal }}>{m.match}%</span>
                </div>
              </div>
              <div style={{ fontFamily:UI, fontSize:12, color:C.teal, marginBottom:3 }}>{m.firm}</div>
              <div style={{ fontFamily:UI, fontSize:11, color:C.t3 }}>{m.specialty} · {m.city}</div>
            </div>
          ))}

          <button onClick={() => { setStep(0); setAnswers([]); setDone(false) }} style={{ width:'100%', marginTop:10, padding:'13px', background:'transparent', border:`1px solid ${C.b2}`, borderRadius:12, fontFamily:UI, fontSize:13, fontWeight:600, color:C.t3, cursor:'pointer' }}>
            Retake Assessment
          </button>
        </div>
        <div style={{ height:24 }} />
      </div>
    )
  }

  const current = STEPS[step]

  return (
    <div style={{ background:C.bg, minHeight:'100dvh' }}>
      <ScreenHeader title="Match Me" subtitle="Wealth Counsel" accent={C.teal} />

      <div style={{ padding:'16px 16px 0' }}>
        {/* Progress */}
        <div style={{ display:'flex', gap:4, marginBottom:20 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ flex:1, height:4, borderRadius:4, background: i <= step ? C.teal : C.b2, transition:'background 0.2s' }} />
          ))}
        </div>

        <div style={{ fontFamily:UI, fontSize:11, color:C.t3, marginBottom:10 }}>Question {step + 1} of {STEPS.length}</div>
        <div style={{ fontFamily:'Playfair Display, Georgia, serif', fontSize:18, fontWeight:700, color:C.t1, lineHeight:1.4, marginBottom:20 }}>
          {current.q}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {current.options.map(opt => (
            <button key={opt} onClick={() => handleSelect(opt)} style={{ width:'100%', padding:'14px 16px', textAlign:'left', background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, fontFamily:UI, fontSize:13, fontWeight:500, color:C.t1, cursor:'pointer' }}>
              {opt}
            </button>
          ))}
        </div>
      </div>
      <div style={{ height:24 }} />
    </div>
  )
}
