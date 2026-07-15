import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, CheckCircle2, ArrowLeft, RotateCcw } from 'lucide-react'
import { C, UI, MONO, DISPLAY } from '../../tokens'
import { userKey } from '../../utils/auth'
import { generateBriefing, GOAL_LABELS, SEV_STYLE } from '../../utils/briefing'

const STEPS = [
  {
    id: 'age', q: 'How old are you?',
    sub: "We'll tailor your financial roadmap to your life stage.",
    type: 'single',
    options: [
      { v: 'under-25', l: 'Under 25',    d: 'Early career — building your foundation' },
      { v: '25-34',    l: '25 – 34',     d: 'Growth phase — major milestones ahead' },
      { v: '35-44',    l: '35 – 44',     d: 'Peak earning & family planning years' },
      { v: '45-54',    l: '45 – 54',     d: 'Wealth accumulation & protection phase' },
      { v: '55-64',    l: '55 – 64',     d: 'Pre-retirement transition' },
      { v: '65+',      l: '65 or older', d: 'Retirement & legacy planning' },
    ],
  },
  {
    id: 'income', q: 'Annual household income?',
    sub: 'Helps us calibrate savings targets and tax strategies.',
    type: 'single',
    options: [
      { v: 'under-30k', l: 'Under $30,000'        },
      { v: '30-60k',    l: '$30,000 – $60,000'     },
      { v: '60-100k',   l: '$60,000 – $100,000'    },
      { v: '100-150k',  l: '$100,000 – $150,000'   },
      { v: '150-300k',  l: '$150,000 – $300,000'   },
      { v: '300k+',     l: '$300,000+'             },
    ],
  },
  {
    id: 'emergency', q: 'Do you have an emergency fund?',
    sub: 'A 3–6 month safety net is the cornerstone of every financial plan.',
    type: 'single',
    options: [
      { v: '6plus',  l: '6+ months of expenses',  d: 'Fully funded and stable' },
      { v: '3-6',    l: '3–6 months of expenses', d: 'Solid foundation in place' },
      { v: '1-3',    l: '1–3 months of expenses', d: "Building — not quite there yet" },
      { v: '1month', l: 'Less than 1 month',      d: 'Just getting started' },
      { v: 'none',   l: 'No emergency fund',      d: "Haven't started one yet" },
    ],
  },
  {
    id: 'accounts', q: 'Which accounts do you currently have?',
    sub: "Check all that apply. Don't worry if you're just starting out.",
    type: 'multi',
    options: [
      { v: 'checking',  l: 'Checking & Savings Account'    },
      { v: '401k',      l: '401(k) or employer plan'       },
      { v: 'ira',       l: 'IRA (Traditional or Roth)'     },
      { v: 'brokerage', l: 'Taxable Brokerage Account'     },
      { v: 'hsa',       l: 'Health Savings Account (HSA)'  },
      { v: '529',       l: '529 College Savings Plan'      },
    ],
  },
  {
    id: 'debt', q: 'Your current debt situation?',
    sub: "Be honest — this stays private and shapes your action plan.",
    type: 'single',
    options: [
      { v: 'none',           l: 'Debt-free',                    d: 'No significant outstanding debt' },
      { v: 'mortgage-only',  l: 'Mortgage only',                d: 'No consumer debt beyond a home loan' },
      { v: 'some-cc',        l: 'Some credit card debt',        d: "Manageable balances I'm working on" },
      { v: 'significant-cc', l: 'Significant credit card debt', d: 'High balances at high interest rates' },
      { v: 'student-loans',  l: 'Student loan debt',            d: 'Federal or private student loans' },
      { v: 'multiple',       l: 'Multiple types of debt',       d: 'Credit cards, loans, and more' },
    ],
  },
  {
    id: 'goal', q: "What's your #1 financial priority right now?",
    sub: "This shapes your personalized roadmap and curated learning path.",
    type: 'single',
    options: [
      { v: 'emergency-fund', l: 'Build an emergency fund', d: 'Establish a 3–6 month safety net first' },
      { v: 'pay-debt',       l: 'Pay off debt',            d: 'Eliminate high-interest debt fast' },
      { v: 'save-home',      l: 'Save for a home',         d: 'Building a down payment' },
      { v: 'invest',         l: 'Invest & grow wealth',    d: 'Maximize long-term returns' },
      { v: 'retirement',     l: 'Retire comfortably',      d: 'Build a secure retirement nest egg' },
      { v: 'protect',        l: 'Protect what I have',     d: 'Insurance, estate, and risk management' },
    ],
  },
  {
    id: 'insurance', q: 'Which insurance policies do you have?',
    sub: 'Check all that apply.',
    type: 'multi',
    options: [
      { v: 'health',     l: 'Health Insurance'                },
      { v: 'life',       l: 'Life Insurance'                  },
      { v: 'auto',       l: 'Auto Insurance'                  },
      { v: 'home',       l: 'Homeowners or Renters Insurance' },
      { v: 'disability', l: 'Disability Insurance'            },
      { v: 'ltc',        l: 'Long-Term Care Insurance'        },
    ],
  },
  {
    id: 'estate', q: 'Do you have a will or estate plan?',
    sub: 'Estate planning matters at every life stage — even in your 20s.',
    type: 'single',
    options: [
      { v: 'complete', l: 'Yes — complete estate plan', d: 'Will, trust, POA, healthcare directives' },
      { v: 'basic',    l: 'Yes — basic will',           d: 'At least a simple will in place' },
      { v: 'planning', l: 'Not yet, but I plan to',     d: "It's on my radar" },
      { v: 'none',     l: 'No',                         d: "Haven't gotten to it yet" },
    ],
  },
  {
    id: 'confidence', q: 'How confident do you feel managing your finances?',
    sub: "Honest self-assessment helps us calibrate where you're starting from.",
    type: 'single',
    options: [
      { v: 'very-confident',     l: 'Very confident',     d: 'I have a plan and follow it consistently' },
      { v: 'somewhat-confident', l: 'Somewhat confident', d: "I have the basics down but want to improve" },
      { v: 'neutral',            l: 'Neutral',            d: "I get by but don't really think about it" },
      { v: 'not-confident',      l: 'Not very confident', d: "I know I should do more but don't know where to start" },
      { v: 'overwhelmed',        l: 'Overwhelmed',        d: 'Finance feels stressful and confusing' },
    ],
  },
]

/* ── advisor briefing generator ────────────────────────── */
/* ── Results screen — Advisor Briefing ─────────────────── */

function Results({ answers, onRetake }) {
  const navigate = useNavigate()
  const { strengths, gaps, guide } = generateBriefing(answers)
  const today = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })

  return (
    <div style={{ background: C.bg, minHeight: '100dvh', paddingBottom: 48 }}>

      {/* ── Header ────────────────────────────────────────── */}
      <div style={{ background: C.ink, padding: '48px 20px 28px' }}>
        <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', marginBottom: 10 }}>
          Financial Health Assessment
        </div>
        <div style={{ fontFamily: DISPLAY, fontSize: 27, fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 8 }}>
          Your Advisor{' '}
          <em style={{ fontStyle: 'italic', color: C.tangerine }}>Briefing</em>
        </div>
        <div style={{ fontFamily: UI, fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 20 }}>
          A professional summary of your financial position, prepared for your next conversation with a CFP or CFA advisor.
        </div>

        {/* Meta row */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '7px 12px' }}>
            <div style={{ fontFamily: UI, fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>Prepared</div>
            <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{today}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '7px 12px' }}>
            <div style={{ fontFamily: UI, fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>Strengths</div>
            <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: '#4ade80' }}>{strengths.length} identified</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '7px 12px' }}>
            <div style={{ fontFamily: UI, fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>Gaps</div>
            <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: C.tangerine }}>{gaps.length} identified</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>

        {/* ── Strengths ─────────────────────────────────── */}
        {strengths.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 12 }}>
              ✓ Strengths
            </div>
            {strengths.map((s, i) => (
              <div key={i} style={{ background: 'rgba(74,124,89,0.07)', border: '1px solid rgba(74,124,89,0.20)', borderRadius: 14, padding: '14px 16px', marginBottom: 8 }}>
                <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: '#4a7c59', marginBottom: 5 }}>{s.area}</div>
                <div style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.65 }}>{s.text}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── Gaps & Risks ──────────────────────────────── */}
        {gaps.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 12 }}>
              Gaps & Risks
            </div>
            {gaps.map((g, i) => {
              const sty = SEV_STYLE[g.severity] || SEV_STYLE.Low
              return (
                <div key={i} style={{ background: sty.bg, border: `1px solid ${sty.border}`, borderRadius: 14, padding: '14px 16px', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: sty.dot, flexShrink: 0 }} />
                    <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: sty.dot, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{sty.label}</div>
                    <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1, marginLeft: 2 }}>{g.area}</div>
                  </div>
                  <div style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.65 }}>{g.text}</div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── Advisor Discussion Guide ───────────────────── */}
        <div style={{ marginTop: 28 }}>
          <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 4 }}>
            Advisor Discussion Guide
          </div>
          <div style={{ fontFamily: UI, fontSize: 12, color: C.t3, marginBottom: 14, lineHeight: 1.6 }}>
            Bring these questions to your next meeting with a CFP or CFA. The more specific your questions, the more value you extract from professional advice.
          </div>

          {guide.map((section, si) => (
            <div key={si} style={{
              background: section.highlight ? 'rgba(201,169,110,0.07)' : C.surf,
              border: `1px solid ${section.highlight ? 'rgba(201,169,110,0.25)' : C.b1}`,
              borderRadius: 16, padding: '16px', marginBottom: 10,
              boxShadow: '0 1px 6px rgba(28,21,16,0.04)',
            }}>
              <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: section.highlight ? C.gold : C.indigo, marginBottom: 12 }}>
                {section.topic}
              </div>
              {section.questions.map((q, qi) => (
                <div key={qi} style={{ display: 'flex', gap: 10, marginBottom: qi < section.questions.length - 1 ? 10 : 0 }}>
                  <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: section.highlight ? C.gold : C.indigo, flexShrink: 0, marginTop: 1 }}>{qi + 1}.</div>
                  <div style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.65 }}>{q}</div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ── Actions ───────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 28 }}>
          <button onClick={onRetake} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '13px', background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 14, cursor: 'pointer', fontFamily: UI, fontSize: 13, fontWeight: 600, color: C.t2, boxShadow: '0 1px 6px rgba(28,21,16,0.05)' }}>
            <RotateCcw size={14} color={C.t2} /> Retake
          </button>
          <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '13px', background: C.tangerine, border: 'none', borderRadius: 14, cursor: 'pointer', fontFamily: UI, fontSize: 13, fontWeight: 700, color: '#fff', boxShadow: '0 4px 16px rgba(232,120,60,0.30)' }}>
            Done <ChevronRight size={14} color="#fff" />
          </button>
        </div>

        <p style={{ fontFamily: UI, fontSize: 10, color: C.t3, textAlign: 'center', lineHeight: 1.6, marginTop: 16 }}>
          For educational purposes only. This briefing does not constitute financial, investment, tax, or legal advice. Consult a licensed CFP or CFA before acting on any planning recommendations.
        </p>
      </div>
    </div>
  )
}

/* ── Main Assessment Component ─────────────────────────── */
export default function MHealthAssessment() {
  const navigate = useNavigate()
  const [step, setStep]       = useState(0)
  const [answers, setAnswers] = useState({})
  const [multiSel, setMulti]  = useState([])
  const [done, setDone]       = useState(() => {
    try { return !!localStorage.getItem(userKey('fun-onboarding-v1')) } catch { return false }
  })
  const [finalAnswers, setFinalAnswers] = useState(() => {
    try {
      const s = localStorage.getItem(userKey('fun-onboarding-v1'))
      return s ? JSON.parse(s) : null
    } catch { return null }
  })

  const current = STEPS[step]
  const total   = STEPS.length
  const pct     = Math.round(((step + 1) / total) * 100)

  function advance(newAnswers) {
    if (step + 1 < total) {
      setStep(s => s + 1)
      setMulti([])
    } else {
      try { localStorage.setItem(userKey('fun-onboarding-v1'), JSON.stringify(newAnswers)) } catch {}
      setFinalAnswers(newAnswers)
      setDone(true)
    }
  }

  function pickSingle(v) {
    const updated = { ...answers, [current.id]: v }
    setAnswers(updated)
    advance(updated)
  }

  function toggleMulti(v) {
    setMulti(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])
  }

  function submitMulti() {
    const updated = { ...answers, [current.id]: multiSel }
    setAnswers(updated)
    advance(updated)
  }

  function retake() {
    try { localStorage.removeItem(userKey('fun-onboarding-v1')) } catch {}
    setStep(0); setAnswers({}); setMulti([]); setDone(false); setFinalAnswers(null)
  }

  if (done && finalAnswers) return <Results answers={finalAnswers} onRetake={retake} />

  return (
    <div style={{ background: C.bg, minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* Nav bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: `1px solid ${C.b1}`, background: C.bg }}>
        <button onClick={() => step > 0 ? (setStep(s => s - 1), setMulti([])) : navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}>
          <ArrowLeft size={16} color={C.t3} />
          <span style={{ fontFamily: UI, fontSize: 13, color: C.t3 }}>{step > 0 ? 'Back' : 'Cancel'}</span>
        </button>
        <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Health Assessment</div>
        <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: C.tangerine }}>{pct}%</div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: C.b1 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: C.tangerine, transition: 'width 0.35s ease' }} />
      </div>

      <div style={{ flex: 1, padding: '28px 20px', maxWidth: 520, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        {/* Step counter */}
        <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
          Question {step + 1} of {total}
        </div>

        {/* Question */}
        <h2 style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 700, color: C.t1, margin: '0 0 6px', lineHeight: 1.25 }}>
          {current.q}
        </h2>
        <p style={{ fontFamily: UI, fontSize: 13, color: C.t3, margin: '0 0 22px', lineHeight: 1.6 }}>
          {current.sub}
        </p>

        {/* Single select */}
        {current.type === 'single' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {current.options.map(opt => (
              <button key={opt.v} onClick={() => pickSingle(opt.v)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '13px 14px', background: C.surf, border: `1px solid ${C.b1}`,
                borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                boxShadow: '0 1px 4px rgba(28,21,16,0.05)',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 600, color: C.t1 }}>{opt.l}</div>
                  {opt.d && <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, marginTop: 2, lineHeight: 1.5 }}>{opt.d}</div>}
                </div>
                <ChevronRight size={14} color={C.t3} style={{ flexShrink: 0, marginLeft: 10 }} />
              </button>
            ))}
          </div>
        )}

        {/* Multi select */}
        {current.type === 'multi' && (
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {current.options.map(opt => {
                const sel = multiSel.includes(opt.v)
                return (
                  <button key={opt.v} onClick={() => toggleMulti(opt.v)} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '9px 14px', borderRadius: 100,
                    background: sel ? `${C.tangerine}15` : C.surf,
                    border: `1.5px solid ${sel ? C.tangerine : C.b2}`,
                    cursor: 'pointer', fontFamily: UI, fontSize: 13,
                    fontWeight: sel ? 700 : 500,
                    color: sel ? C.tangerine : C.t2,
                  }}>
                    {sel && <CheckCircle2 size={13} color={C.tangerine} />}
                    {opt.l}
                  </button>
                )
              })}
            </div>
            <button onClick={submitMulti} style={{
              width: '100%', padding: '14px', background: C.tangerine, border: 'none',
              borderRadius: 12, cursor: 'pointer', fontFamily: UI, fontSize: 14,
              fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8, boxShadow: '0 4px 16px rgba(232,120,60,0.30)',
            }}>
              {multiSel.length === 0 ? 'None of these — continue' : `Continue with ${multiSel.length} selected`}
              <ChevronRight size={16} color="#fff" />
            </button>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <p style={{ fontFamily: UI, fontSize: 10, color: C.t3, textAlign: 'center', padding: '0 20px 24px', lineHeight: 1.6 }}>
        For educational purposes only. This does not constitute financial advice.
      </p>
    </div>
  )
}
