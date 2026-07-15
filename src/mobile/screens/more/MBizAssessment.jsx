import { useState } from 'react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard } from '../../components/MCard'
import { C, UI, MONO } from '../../tokens'

const QUESTIONS = [
  { q:'What type of business entity are you currently?', opts:['Sole Proprietorship','LLC','S-Corporation','C-Corporation','Partnership','Not yet formed'] },
  { q:'What is your approximate annual business revenue?', opts:['Under $50K','$50K–$250K','$250K–$1M','$1M–$5M','Over $5M'] },
  { q:'Do you have a business succession or exit plan?', opts:['Yes, documented','Thinking about it','No, not yet','Considering selling in 5 years','Planning to pass to family'] },
  { q:'Do you have a retirement plan specifically for your business?', opts:['Yes, Solo 401k','Yes, SEP-IRA','Yes, SIMPLE IRA','Yes, Defined Benefit Plan','No retirement plan yet'] },
  { q:'Do you have key person life or disability insurance?', opts:['Yes, both','Life only','Disability only','Neither','Not sure what that is'] },
  { q:'Do you have a buy-sell agreement with your partners?', opts:['Yes, funded with insurance','Yes, but not funded','We\'ve discussed it','No partners / sole owner','No, not yet'] },
]

const RECS = {
  'Sole Proprietorship':'Consider forming an LLC or S-Corp. At your income level, an S-Corp election may save significant self-employment taxes.',
  'LLC':'Your entity is appropriate. Review whether an S-Corp election makes sense based on your net income.',
  'S-Corporation':'Excellent structure. Ensure your reasonable salary is properly set to optimize SE tax savings.',
  'default':'Consult with a CPA and CFP® who specialize in business owner planning to optimize your entity and tax strategy.',
}

export default function MBizAssessment() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [done, setDone] = useState(false)

  function handleSelect(opt) {
    const newAnswers = { ...answers, [step]: opt }
    setAnswers(newAnswers)
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1)
    } else {
      setDone(true)
    }
  }

  const entityRec = RECS[answers[0]] || RECS.default

  if (done) {
    const score = Object.values(answers).filter((a, i) => {
      if (i===2) return !a.includes('No') && !a.includes('not yet')
      if (i===3) return !a.includes('No') && !a.includes('not yet')
      if (i===4) return !a.includes('Neither') && !a.includes('Not sure')
      if (i===5) return a.includes('funded')
      return true
    }).length

    const rating = score >= 5 ? 'Well Prepared' : score >= 3 ? 'Moderate Gaps' : 'Significant Gaps'
    const ratingColor = score >= 5 ? C.teal : score >= 3 ? C.gold : '#c0392b'

    return (
      <div style={{ background:C.bg, minHeight:'100dvh' }}>
        <ScreenHeader title="Assessment Results" subtitle="Business Planning" accent={C.gold} />
        <div style={{ padding:'16px 16px 0' }}>
          <MCard style={{ background:C.raise, textAlign:'center', padding:'24px' }}>
            <div style={{ fontFamily:UI, fontSize:12, color:C.t3, marginBottom:6 }}>Your Business Planning Score</div>
            <div style={{ fontFamily:MONO, fontSize:40, fontWeight:700, color:ratingColor }}>{score}/{QUESTIONS.length}</div>
            <div style={{ fontFamily:UI, fontSize:14, fontWeight:700, color:ratingColor, marginTop:4 }}>{rating}</div>
          </MCard>

          <MCard>
            <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.gold, marginBottom:6 }}>Entity Recommendation</div>
            <div style={{ fontFamily:UI, fontSize:13, color:C.t2, lineHeight:1.65 }}>{entityRec}</div>
          </MCard>

          {QUESTIONS.map((q, i) => (
            <MCard key={i}>
              <div style={{ fontFamily:UI, fontSize:11, color:C.t3, marginBottom:3 }}>{q.q}</div>
              <div style={{ fontFamily:UI, fontSize:13, fontWeight:600, color:C.t1 }}>{answers[i]}</div>
            </MCard>
          ))}

          <button onClick={() => { setStep(0); setAnswers({}); setDone(false) }} style={{ width:'100%', marginTop:4, padding:'13px', background:'transparent', border:`1px solid ${C.b2}`, borderRadius:12, fontFamily:UI, fontSize:13, fontWeight:600, color:C.t3, cursor:'pointer' }}>
            Retake Assessment
          </button>
        </div>
        <div style={{ height:24 }} />
      </div>
    )
  }

  return (
    <div style={{ background:C.bg, minHeight:'100dvh' }}>
      <ScreenHeader title="Business Assessment" subtitle="Business Planning" accent={C.gold} />
      <div style={{ padding:'16px 16px 0' }}>
        <div style={{ display:'flex', gap:4, marginBottom:20 }}>
          {QUESTIONS.map((_, i) => (
            <div key={i} style={{ flex:1, height:4, borderRadius:4, background: i <= step ? C.gold : C.b2 }} />
          ))}
        </div>
        <div style={{ fontFamily:UI, fontSize:11, color:C.t3, marginBottom:10 }}>Question {step+1} of {QUESTIONS.length}</div>
        <div style={{ fontFamily:'Playfair Display, Georgia, serif', fontSize:18, fontWeight:700, color:C.t1, lineHeight:1.4, marginBottom:20 }}>
          {QUESTIONS[step].q}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {QUESTIONS[step].opts.map(opt => (
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
