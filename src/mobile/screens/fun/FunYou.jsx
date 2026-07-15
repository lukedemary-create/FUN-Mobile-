import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { C, UI, MONO, DISPLAY } from '../../tokens'
import {
  ChevronRight, LogOut, Flame, ArrowLeft,
  FileText, Bell, Link2, Shield, HelpCircle,
  RotateCcw, CheckCircle2, ChevronDown, ChevronUp,
} from 'lucide-react'
import { signOut, userKey } from '../../utils/auth'
import { generateBriefing, SEV_STYLE } from '../../utils/briefing'
import useUserLS from '../../hooks/useUserLS'

const SETTINGS = [
  { key: 'briefing',      label: 'Advisor Briefing Report', Icon: FileText  },
  { key: 'notifications', label: 'Notifications',           Icon: Bell      },
  { key: 'connected',     label: 'Connected Accounts',      Icon: Link2     },
  { key: 'privacy',       label: 'Privacy & Data',          Icon: Shield    },
  { key: 'help',          label: 'Help & Support',          Icon: HelpCircle },
]

/* ── streak tracking ──────────────────────────────────────── */
function getStreak() {
  try {
    const key  = userKey('fun_streak_v1')
    const raw  = localStorage.getItem(key)
    const data = raw ? JSON.parse(raw) : { days: 0, lastVisit: null }
    const today = new Date().toISOString().slice(0, 10)
    if (data.lastVisit === today) return data.days
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    const days = data.lastVisit === yesterday ? data.days + 1 : 1
    localStorage.setItem(key, JSON.stringify({ days, lastVisit: today }))
    return days
  } catch { return 1 }
}

/* ── Shared panel header ─────────────────────────────────── */
function PanelHeader({ title, onBack }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '52px 20px 16px',
      borderBottom: `1px solid ${C.b1}`,
      background: 'rgba(250,246,237,0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      position: 'sticky', top: 0, zIndex: 20,
    }}>
      <button
        onClick={onBack}
        style={{ background: 'none', border: 'none', padding: '4px 4px 4px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', WebkitTapHighlightColor: 'transparent', flexShrink: 0 }}
      >
        <ArrowLeft size={22} color={C.t1} strokeWidth={2} />
      </button>
      <div style={{ fontFamily: DISPLAY, fontSize: 20, fontWeight: 600, color: C.t1 }}>{title}</div>
    </header>
  )
}

/* ── Advisor Briefing panel ──────────────────────────────── */
function BriefingPanel({ onBack }) {
  const navigate = useNavigate()
  const savedRaw = localStorage.getItem(userKey('fun-onboarding-v1'))
  const answers  = savedRaw ? JSON.parse(savedRaw) : null

  if (!answers) {
    return (
      <div style={{ background: C.bg, minHeight: '100dvh' }}>
        <PanelHeader title="Advisor Briefing" onBack={onBack} />
        <div style={{ padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: 24, background: 'rgba(232,120,60,0.10)', border: '1px solid rgba(232,120,60,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <FileText size={32} color={C.tangerine} strokeWidth={1.5} />
          </div>
          <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 600, color: C.t1, marginBottom: 10 }}>No Briefing Yet</div>
          <div style={{ fontFamily: UI, fontSize: 14, color: C.t3, lineHeight: 1.65, maxWidth: 280, margin: '0 auto 28px' }}>
            Complete the Financial Health Assessment to generate your personalized advisor briefing.
          </div>
          <button
            onClick={() => navigate('/assessment')}
            style={{ background: C.tangerine, border: 'none', borderRadius: 14, padding: '14px 28px', fontFamily: UI, fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer', boxShadow: '0 4px 16px rgba(232,120,60,0.30)' }}
          >
            Take Assessment
          </button>
        </div>
      </div>
    )
  }

  const { strengths, gaps, guide } = generateBriefing(answers)
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div style={{ background: C.bg, minHeight: '100dvh', paddingBottom: 48 }}>

      {/* Dark hero header */}
      <div style={{ background: C.ink, padding: '52px 20px 28px', position: 'relative' }}>
        <button
          onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: UI, fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.70)', marginBottom: 20, WebkitTapHighlightColor: 'transparent' }}
        >
          <ArrowLeft size={13} color="rgba(255,255,255,0.70)" /> Back
        </button>
        <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', marginBottom: 10 }}>
          Financial Health Assessment
        </div>
        <div style={{ fontFamily: DISPLAY, fontSize: 27, fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 8 }}>
          Your Advisor <em style={{ fontStyle: 'italic', color: C.tangerine }}>Briefing</em>
        </div>
        <div style={{ fontFamily: UI, fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 20 }}>
          A professional summary of your financial position, prepared for your next conversation with a CFP or CFA advisor.
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '7px 12px' }}>
            <div style={{ fontFamily: UI, fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>Prepared</div>
            <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.70)' }}>{today}</div>
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

        {/* Strengths */}
        {strengths.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 12 }}>✓ Strengths</div>
            {strengths.map((s, i) => (
              <div key={i} style={{ background: 'rgba(74,124,89,0.07)', border: '1px solid rgba(74,124,89,0.20)', borderRadius: 14, padding: '14px 16px', marginBottom: 8 }}>
                <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: '#4a7c59', marginBottom: 5 }}>{s.area}</div>
                <div style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.65 }}>{s.text}</div>
              </div>
            ))}
          </div>
        )}

        {/* Gaps */}
        {gaps.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 12 }}>Gaps & Risks</div>
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

        {/* Advisor Discussion Guide */}
        <div style={{ marginTop: 28 }}>
          <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 4 }}>Advisor Discussion Guide</div>
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

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 28 }}>
          <button
            onClick={() => navigate('/assessment')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '13px', background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 14, cursor: 'pointer', fontFamily: UI, fontSize: 13, fontWeight: 600, color: C.t2, boxShadow: '0 1px 6px rgba(28,21,16,0.05)' }}
          >
            <RotateCcw size={14} color={C.t2} /> Retake
          </button>
          <button
            onClick={onBack}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '13px', background: C.tangerine, border: 'none', borderRadius: 14, cursor: 'pointer', fontFamily: UI, fontSize: 13, fontWeight: 700, color: '#fff', boxShadow: '0 4px 16px rgba(232,120,60,0.28)' }}
          >
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

/* ── Notifications panel ─────────────────────────────────── */
const NOTIF_ITEMS = [
  { key: 'tax',       label: 'Tax Law Changes',    desc: 'IRS updates, contribution limits, bracket adjustments' },
  { key: 'fed',       label: 'Federal Reserve',    desc: 'Rate decisions, policy changes, inflation data' },
  { key: 'market',    label: 'Market Events',      desc: 'Major index moves and volatility alerts' },
  { key: 'reminders', label: 'Planning Reminders', desc: 'RMD dates, open enrollment, tax deadlines' },
  { key: 'content',   label: 'New FUN Content',    desc: 'New lessons, calculators, and planning tools' },
]

function NotificationsPanel({ onBack }) {
  const [prefs, setPrefs] = useUserLS('fun_notif_prefs_v1', { tax: true, fed: true, market: false, reminders: true, content: true })

  return (
    <div style={{ background: C.bg, minHeight: '100dvh', paddingBottom: 48 }}>
      <PanelHeader title="Notifications" onBack={onBack} />
      <div style={{ padding: '16px' }}>
        <div style={{ fontFamily: UI, fontSize: 14, color: C.t2, lineHeight: 1.65, marginBottom: 20 }}>
          Choose which financial updates you'd like to receive. Planora surfaces relevant information that may affect your financial plan.
        </div>

        <div style={{ background: C.surf, border: `1px solid ${C.b1}`, borderRadius: 20, overflow: 'hidden', boxShadow: '0 1px 6px rgba(28,21,16,0.05)' }}>
          {NOTIF_ITEMS.map((item, i) => (
            <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderBottom: i < NOTIF_ITEMS.length - 1 ? `1px solid ${C.b1}` : 'none' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: UI, fontSize: 14, fontWeight: 600, color: C.t1 }}>{item.label}</div>
                <div style={{ fontFamily: UI, fontSize: 12, color: C.t3, marginTop: 2, lineHeight: 1.45 }}>{item.desc}</div>
              </div>
              <button
                onClick={() => setPrefs(p => ({ ...p, [item.key]: !p[item.key] }))}
                style={{ flexShrink: 0, width: 46, height: 28, borderRadius: 14, background: prefs[item.key] ? C.tangerine : C.b2, border: 'none', cursor: 'pointer', position: 'relative', WebkitTapHighlightColor: 'transparent' }}
                aria-label={item.label}
              >
                <div style={{ position: 'absolute', top: 4, left: prefs[item.key] ? 22 : 4, width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.22)', transition: 'left 0.18s' }} />
              </button>
            </div>
          ))}
        </div>

        <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, textAlign: 'center', marginTop: 16, lineHeight: 1.65 }}>
          Preferences are saved locally. Push notifications available in a future update.
        </div>
      </div>
    </div>
  )
}

/* ── Connected Accounts panel ────────────────────────────── */
function ConnectedAccountsPanel({ onBack }) {
  return (
    <div style={{ background: C.bg, minHeight: '100dvh', paddingBottom: 48 }}>
      <PanelHeader title="Connected Accounts" onBack={onBack} />
      <div style={{ padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: 24, background: 'rgba(129,140,248,0.10)', border: '1px solid rgba(129,140,248,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Link2 size={30} color={C.indigo} strokeWidth={1.5} />
        </div>
        <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 600, color: C.t1, marginBottom: 10 }}>Coming Soon</div>
        <div style={{ fontFamily: UI, fontSize: 14, color: C.t3, lineHeight: 1.65, maxWidth: 280, margin: '0 auto 32px' }}>
          Securely link your financial accounts for automatic balance tracking and personalized insights.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
          {[
            'Bank checking & savings accounts',
            'Investment & brokerage accounts',
            '401(k) and IRA balances',
            'Credit card balances & credit score',
            'Mortgage and loan balances',
          ].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, background: C.surf, border: `1px solid ${C.b1}`, borderRadius: 12, padding: '12px 14px' }}>
              <CheckCircle2 size={15} color={C.sage} strokeWidth={2} />
              <span style={{ fontFamily: UI, fontSize: 13, color: C.t2 }}>{item}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, fontFamily: UI, fontSize: 12, color: C.t3, lineHeight: 1.65 }}>
          Powered by bank-grade 256-bit encryption. Your credentials are never stored on Planora servers.
        </div>
      </div>
    </div>
  )
}

/* ── Privacy & Data panel ────────────────────────────────── */
const PRIVACY_SECTIONS = [
  { heading: 'Information We Collect', body: 'Planora stores your financial health assessment answers and preference settings locally on your device. We do not collect, transmit, or store personally identifiable financial data on external servers without your explicit consent.' },
  { heading: 'How We Use Your Data', body: 'Assessment answers are used solely to generate your personalized Advisor Briefing and learning recommendations. This data never leaves your device and is not shared with third parties, advertisers, or analytics platforms.' },
  { heading: 'Local Storage', body: "All your data — assessment results, bookmarks, notification preferences, and planning inputs — is stored in your browser's local storage. Clearing browser data will remove this information permanently." },
  { heading: 'Advisor Matching', body: 'If you use Wealth Counsel to connect with a financial advisor, you choose what information to share. Planora does not share your assessment results with advisors without your explicit action.' },
  { heading: 'Your Rights', body: "You can delete all your data at any time by signing out and clearing your browser's local storage. You may also retake the assessment to update your financial profile." },
  { heading: 'Contact', body: 'Questions about privacy? Contact us at privacy@planorafinancial.com. We respond to all privacy inquiries within 5 business days.' },
]

function PrivacyPanel({ onBack }) {
  return (
    <div style={{ background: C.bg, minHeight: '100dvh', paddingBottom: 48 }}>
      <PanelHeader title="Privacy & Data" onBack={onBack} />
      <div style={{ padding: '16px' }}>
        {PRIVACY_SECTIONS.map((section, i) => (
          <div key={i} style={{ marginBottom: 22 }}>
            <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 6 }}>{section.heading}</div>
            <div style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.7 }}>{section.body}</div>
          </div>
        ))}
        <div style={{ fontFamily: UI, fontSize: 10, color: C.t3, textAlign: 'center', marginTop: 24, paddingTop: 16, borderTop: `1px solid ${C.b1}`, lineHeight: 1.6 }}>
          Last updated: July 2026 · Version 1.0
        </div>
      </div>
    </div>
  )
}

/* ── Help & Support panel ────────────────────────────────── */
const FAQ = [
  { q: 'Is my financial data secure?', a: 'Yes. All data is stored locally on your device and never transmitted to external servers. Your assessment answers and planning inputs remain completely private.' },
  { q: 'What is the Advisor Briefing?', a: 'The Advisor Briefing is a professional-quality summary of your financial strengths, gaps, and a curated list of questions to bring to your next meeting with a CFP or CFA advisor.' },
  { q: 'How do I view my Advisor Briefing?', a: 'Go to Settings → Advisor Briefing Report. Your briefing is generated from your assessment answers and available anytime after completing the Health Assessment.' },
  { q: 'Can I retake the assessment?', a: 'Yes. In the Advisor Briefing panel, tap Retake. Your new answers will replace the previous assessment. You can update anytime as your financial situation changes.' },
  { q: 'What is Wealth Counsel?', a: 'Wealth Counsel is Planora\'s advisor-matching platform. It helps you find, evaluate, and connect with CFP and CFA professionals who match your financial needs and goals.' },
  { q: 'How do I delete my data?', a: "Sign out and clear your browser's local storage, or see Settings → Privacy & Data for more information about managing your information." },
]

function HelpPanel({ onBack }) {
  const [openIdx, setOpenIdx] = useState(null)

  return (
    <div style={{ background: C.bg, minHeight: '100dvh', paddingBottom: 48 }}>
      <PanelHeader title="Help & Support" onBack={onBack} />
      <div style={{ padding: '16px' }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 20, fontWeight: 600, color: C.t1, marginBottom: 4 }}>Frequently Asked Questions</div>
        <div style={{ fontFamily: UI, fontSize: 13, color: C.t3, marginBottom: 20, lineHeight: 1.6 }}>
          Find answers to common questions about Planora.
        </div>

        <div style={{ background: C.surf, border: `1px solid ${C.b1}`, borderRadius: 20, overflow: 'hidden', boxShadow: '0 1px 6px rgba(28,21,16,0.05)', marginBottom: 16 }}>
          {FAQ.map((item, i) => (
            <div key={i} style={{ borderBottom: i < FAQ.length - 1 ? `1px solid ${C.b1}` : 'none' }}>
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 12, WebkitTapHighlightColor: 'transparent' }}
              >
                <span style={{ fontFamily: UI, fontSize: 14, fontWeight: 600, color: C.t1, lineHeight: 1.4 }}>{item.q}</span>
                {openIdx === i
                  ? <ChevronUp size={16} color={C.t3} strokeWidth={2} style={{ flexShrink: 0 }} />
                  : <ChevronDown size={16} color={C.t3} strokeWidth={2} style={{ flexShrink: 0 }} />
                }
              </button>
              {openIdx === i && (
                <div style={{ padding: '0 20px 16px', fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.7 }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ background: C.surf, border: `1px solid ${C.b1}`, borderRadius: 20, padding: '20px', boxShadow: '0 1px 6px rgba(28,21,16,0.05)' }}>
          <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 6 }}>Still have questions?</div>
          <div style={{ fontFamily: UI, fontSize: 13, color: C.t3, lineHeight: 1.65, marginBottom: 14 }}>
            Our team typically responds within one business day.
          </div>
          <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 600, color: C.tangerine }}>support@planorafinancial.com</div>
        </div>
      </div>
    </div>
  )
}

/* ── Main FunYou ─────────────────────────────────────────── */
export default function FunYou() {
  const [activePanel, setActivePanel] = useState(null)

  const authRaw    = localStorage.getItem('planora_auth_v1')
  const auth       = authRaw ? JSON.parse(authRaw) : {}
  const displayName = auth.name || 'Member'
  const initial    = displayName[0]?.toUpperCase() || 'M'
  const memberYear = new Date(auth.createdAt || Date.now()).getFullYear()
  const streak     = useMemo(getStreak, [])

  const hasBriefing = !!localStorage.getItem(userKey('fun-onboarding-v1'))

  // Panel routing
  if (activePanel === 'briefing')      return <BriefingPanel onBack={() => setActivePanel(null)} />
  if (activePanel === 'notifications') return <NotificationsPanel onBack={() => setActivePanel(null)} />
  if (activePanel === 'connected')     return <ConnectedAccountsPanel onBack={() => setActivePanel(null)} />
  if (activePanel === 'privacy')       return <PrivacyPanel onBack={() => setActivePanel(null)} />
  if (activePanel === 'help')          return <HelpPanel onBack={() => setActivePanel(null)} />

  return (
    <div style={{ background: C.bg, minHeight: '100dvh' }}>

      {/* ── Top bar ──────────────────────────────────────────── */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '52px 20px 16px',
        borderBottom: `1px solid ${C.b1}`,
        background: C.bg,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/fun-logo.png" alt="FUN logo" style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover', objectPosition: 'center' }} />
          <div>
            <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.t3 }}>Financial Understanding Network</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 20, fontWeight: 600, color: C.t1, lineHeight: 1.1 }}>You</div>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '16px 16px 0' }}>

        {/* ── Profile card ─────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          background: C.surf,
          border: `1px solid ${C.b1}`,
          borderRadius: 24, padding: '18px 16px',
          boxShadow: '0 1px 6px rgba(28,21,16,0.05)',
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: 20, flexShrink: 0,
            background: C.tangerine,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(232,120,60,0.28)',
          }}>
            <span style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 900, color: '#fff' }}>{initial}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 19, fontWeight: 600, color: C.t1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {displayName}
            </div>
            <div style={{ fontFamily: UI, fontSize: 12, color: C.t3, marginTop: 2 }}>Member since {memberYear}</div>
          </div>
          <div style={{
            flexShrink: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            background: 'rgba(232,120,60,0.10)',
            border: '1px solid rgba(232,120,60,0.22)',
            borderRadius: 14, padding: '8px 12px',
          }}>
            <Flame size={16} color={C.tangerine} strokeWidth={2} />
            <div style={{ fontFamily: MONO, fontSize: 16, fontWeight: 900, color: C.tangerine, lineHeight: 1.1, marginTop: 3 }}>{streak}</div>
            <div style={{ fontFamily: UI, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.t3, marginTop: 1 }}>day streak</div>
          </div>
        </div>

        {/* ── Briefing CTA (when assessment is done) ─────────── */}
        {hasBriefing && (
          <button
            onClick={() => setActivePanel('briefing')}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: C.ink, border: 'none',
              borderRadius: 20, padding: '16px 18px',
              cursor: 'pointer', textAlign: 'left',
              boxShadow: '0 4px 20px rgba(28,21,16,0.14)',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(232,120,60,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText size={17} color={C.tangerine} strokeWidth={1.8} />
              </div>
              <div>
                <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.40)', marginBottom: 2 }}>Advisor Briefing</div>
                <div style={{ fontFamily: DISPLAY, fontSize: 15, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>View Your Briefing</div>
              </div>
            </div>
            <ChevronRight size={16} color="rgba(255,255,255,0.45)" />
          </button>
        )}

        {/* ── Settings list ───────────────────────────────────── */}
        <div style={{
          background: C.surf,
          border: `1px solid ${C.b1}`,
          borderRadius: 24, overflow: 'hidden',
          boxShadow: '0 1px 6px rgba(28,21,16,0.05)',
        }}>
          {SETTINGS.map((row, i) => (
            <button
              key={row.key}
              onClick={() => setActivePanel(row.key)}
              style={{
                width: '100%', background: 'none', border: 'none',
                borderBottom: i < SETTINGS.length - 1 ? `1px solid ${C.b1}` : 'none',
                padding: '15px 20px',
                display: 'flex', alignItems: 'center', gap: 12,
                cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
              }}
            >
              <row.Icon size={17} color={C.t3} strokeWidth={1.8} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: UI, fontSize: 14.5, fontWeight: 500, color: C.t1, flex: 1, textAlign: 'left' }}>{row.label}</span>
              <ChevronRight size={16} color={C.t3} />
            </button>
          ))}
        </div>

        {/* ── Sign Out ─────────────────────────────────────────── */}
        <button
          onClick={() => { signOut(); window.location.href = '/' }}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '14px',
            background: 'transparent',
            border: `1.5px solid ${C.b2}`,
            borderRadius: 16,
            cursor: 'pointer',
            fontFamily: UI, fontSize: 14, fontWeight: 600, color: C.t3,
            marginBottom: 24,
          }}
        >
          <LogOut size={15} color={C.t3} strokeWidth={1.8} />
          Sign Out
        </button>

      </div>
    </div>
  )
}
