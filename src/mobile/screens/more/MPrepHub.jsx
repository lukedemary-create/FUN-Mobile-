import { useState } from 'react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader } from '../../components/MCard'
import { C, UI, MONO } from '../../tokens'

const QUESTIONS = [
  'What are your credentials and years of experience?',
  'Are you a fiduciary at all times, for all advice?',
  'How are you compensated? (fee-only, AUM, commissions)',
  'What is your investment philosophy?',
  'How often will we meet and in what format?',
  'Who else might work on my account?',
  'What types of clients do you typically serve?',
  'Do you have experience with my specific situation? (business, divorce, inheritance, etc.)',
  'What is your client-to-advisor ratio?',
  'How do you handle conflicts of interest?',
  'What technology platforms do you use for client reporting?',
  'How do you measure success for your clients?',
]

const DOCS = [
  { title:'Recent Tax Returns', why:'Advisor needs to understand income, capital gains, deductions, and carryforwards.' },
  { title:'Investment Account Statements', why:'Current allocation, cost basis, unrealized gains/losses across all accounts.' },
  { title:'401(k) / Retirement Plan Statements', why:'Balance, investment options, employer match details, vesting schedule.' },
  { title:'Insurance Policies', why:'Life, disability, long-term care — coverage amounts, premiums, beneficiaries.' },
  { title:'Estate Planning Documents', why:'Existing will, trust, POA, healthcare directive, beneficiary designations.' },
  { title:'Mortgage / Debt Summary', why:'Outstanding balances, interest rates, remaining terms.' },
  { title:'Business Documents (if applicable)', why:'Business income, ownership structure, buy-sell agreement, key person insurance.' },
  { title:'Social Security Statement', why:'Projected benefit at 62, FRA, and 70. Available at ssa.gov/myaccount.' },
]

const GOALS_WORKSHEET = [
  { q:'In 5 years, I want to...', placeholder:'e.g., be fully debt-free except mortgage' },
  { q:'My biggest financial worry is...', placeholder:'e.g., not having enough for retirement' },
  { q:'My annual savings goal is...', placeholder:'e.g., $30,000/year' },
  { q:'I would describe my risk tolerance as...', placeholder:'e.g., moderate — I can handle short-term losses' },
]

export default function MPrepHub() {
  const [tab, setTab] = useState('questions')
  const [answers, setAnswers] = useState({})

  return (
    <div style={{ background:C.bg, minHeight:'100dvh' }}>
      <ScreenHeader title="Advisor Prep Hub" subtitle="Wealth Counsel" accent={C.teal} />

      <div style={{ display:'flex', borderBottom:`1px solid ${C.b2}`, padding:'0 16px' }}>
        {[['questions','Questions'],['docs','Documents'],['goals','Goals']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ flex:1, padding:'11px 0', background:'none', border:'none', cursor:'pointer', borderBottom:`2px solid ${tab===k ? C.teal : 'transparent'}`, color: tab===k ? C.teal : C.t3, fontFamily:UI, fontSize:12, fontWeight:600 }}>{l}</button>
        ))}
      </div>

      {tab === 'questions' && (
        <>
          <div style={{ padding:'12px 16px 0' }}>
            <MCard style={{ background:C.raise }}>
              <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65 }}>
                These are the 12 questions every investor should ask a financial advisor before hiring them. The quality of the answers — and how comfortable you feel with them — tells you everything.
              </div>
            </MCard>
          </div>
          <MSectionHeader label="12 Questions to Ask" />
          <div style={{ padding:'0 16px' }}>
            <MCard style={{ padding:0, overflow:'hidden' }}>
              {QUESTIONS.map((q, i) => (
                <div key={i} style={{ display:'flex', gap:12, padding:'12px 16px', borderBottom: i < QUESTIONS.length-1 ? `1px solid ${C.b1}` : 'none' }}>
                  <span style={{ fontFamily:MONO, fontSize:11, fontWeight:700, color:C.teal, flexShrink:0, marginTop:1 }}>{String(i+1).padStart(2,'0')}</span>
                  <span style={{ fontFamily:UI, fontSize:13, color:C.t2, lineHeight:1.55 }}>{q}</span>
                </div>
              ))}
            </MCard>
          </div>
        </>
      )}

      {tab === 'docs' && (
        <>
          <div style={{ padding:'12px 16px 0' }}>
            <MCard style={{ background:C.raise }}>
              <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65 }}>
                Gather these documents before your first meeting. Arriving prepared shows the advisor you're serious and maximizes the value of your time together.
              </div>
            </MCard>
          </div>
          <MSectionHeader label="Documents to Bring" />
          <div style={{ padding:'0 16px' }}>
            {DOCS.map((d, i) => (
              <MCard key={d.title}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                  <span style={{ fontSize:18, flexShrink:0 }}>📄</span>
                  <div>
                    <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.t1, marginBottom:4 }}>{d.title}</div>
                    <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.55 }}>{d.why}</div>
                  </div>
                </div>
              </MCard>
            ))}
          </div>
        </>
      )}

      {tab === 'goals' && (
        <>
          <div style={{ padding:'12px 16px 0' }}>
            <MCard style={{ background:C.raise }}>
              <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65 }}>
                Clarifying your own goals before the meeting makes the conversation far more productive. Write your answers here — you can reference these in your first advisor meeting.
              </div>
            </MCard>
          </div>
          <MSectionHeader label="Goals Worksheet" />
          <div style={{ padding:'0 16px' }}>
            {GOALS_WORKSHEET.map((g, i) => (
              <MCard key={g.q}>
                <div style={{ fontFamily:UI, fontSize:13, fontWeight:600, color:C.teal, marginBottom:8 }}>{g.q}</div>
                <textarea
                  value={answers[i] || ''}
                  onChange={e => setAnswers({...answers, [i]: e.target.value})}
                  placeholder={g.placeholder}
                  rows={3}
                  style={{ width:'100%', boxSizing:'border-box', background:C.raise, border:`1px solid ${C.b2}`, borderRadius:10, padding:'10px 12px', fontFamily:UI, fontSize:13, color:C.t1, resize:'none', outline:'none' }}
                />
              </MCard>
            ))}
          </div>
        </>
      )}
      <div style={{ height:24 }} />
    </div>
  )
}
