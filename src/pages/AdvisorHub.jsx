import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Users, MessageSquare, FileText, Calendar, Target, Shield,
  ChevronRight, ArrowUpRight, CheckCircle2, XCircle, BarChart2,
  Briefcase, Heart, Lock,
} from 'lucide-react'

const DISPLAY = "'Playfair Display', Georgia, serif"
const UI      = "'Inter', system-ui, sans-serif"
const MONO    = "'JetBrains Mono', monospace"
const EASE    = [0.32, 0.72, 0, 1]

const C = {
  bg:      '#1a1410',
  surf:    '#231c16',
  raise:   '#2d2419',
  b1:      '#2a2018',
  b2:      '#3d3028',
  acc:     '#00B4C6',
  accDim:  'rgba(0,180,198,0.08)',
  accBdr:  'rgba(0,180,198,0.20)',
  t1:      '#f0e8d8',
  t2:      '#a89070',
  t3:      '#6b5540',
  up:      '#4a7c59',
  upDim:   'rgba(74,124,89,0.15)',
}

const FADE    = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}
const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

const STATS = [
  { value: '+3%',   label: 'Annual alpha added by a good financial advisor', source: 'Vanguard Advisor\'s Alpha' },
  { value: '74%',   label: 'Of advised clients feel confident about retirement', source: 'LIMRA Research' },
  { value: '$350K', label: 'Average wealth gap between advised and unadvised households', source: 'Russell Investments' },
  { value: '4×',    label: 'More likely to stay the course during market downturns', source: 'Dalbar QAIB' },
]

const COMPARE = {
  with: [
    'Personalized plan built around your specific goals and timeline',
    'Proactive tax-loss harvesting and Roth conversion strategies',
    'Behavioral coaching that prevents costly panic decisions',
    'Life event planning integrated with portfolio management',
    'Clear accountability and regular progress check-ins',
    'Estate and insurance reviewed as circumstances change',
  ],
  without: [
    'Generic allocation with no connection to real goals',
    'Tax efficiency left entirely on the table',
    'Emotional decisions that cost an average 1.5% per year',
    'Life changes handled reactively, often too late',
    'No one measuring progress against a defined target',
    'Insurance gaps and estate errors discovered at the worst time',
  ],
}

const PILLARS = [
  {
    icon: Target,
    title: 'Advice Is About Behavior First',
    body: 'Research consistently shows that the largest value an advisor adds is not security selection — it is behavioral coaching. The average investor underperforms the market by 1.5% per year through bad timing. An advisor\'s primary job is to keep clients from being their own worst enemy during volatility.',
    stat: '1.5% avg annual loss from emotional trading (Dalbar)',
  },
  {
    icon: Shield,
    title: 'Comprehensive Planning Beats Portfolio Management',
    body: 'A portfolio manager optimizes returns. A financial advisor optimizes your life. That means integrating tax planning, estate planning, insurance, life events, and cash flow into a coherent system. The best advisors think in decades, not quarters.',
    stat: 'Vanguard: 3% annual value from comprehensive advice',
  },
  {
    icon: Heart,
    title: 'The Advisor-Client Relationship Is the Product',
    body: 'Trust, communication cadence, and shared context make or break an advisory relationship. Clients who feel heard and informed are far more likely to follow through on plans. Nexus is built around this truth — giving advisors and clients a secure, shared workspace that deepens the relationship over time.',
    stat: '95% retention rate for clients with structured communication',
  },
]

const SECTIONS = [
  {
    icon: Users,
    title: 'Advisor Dashboard',
    desc: 'Full practice overview — client list, AUM, upcoming tasks, and communication queue in one view.',
    href: '/nexus/advisor',
    accent: C.acc,
  },
  {
    icon: Briefcase,
    title: 'Client Portal',
    desc: 'Each client\'s dedicated portal for portfolio data, goals, documents, and meeting prep.',
    href: '/nexus/client',
    accent: C.acc,
  },
  {
    icon: Heart,
    title: 'Life Events',
    desc: 'Track major milestones — marriage, divorce, birth, death, job change, inheritance — and update the plan accordingly.',
    href: '/nexus/client/life-events',
    accent: C.acc,
  },
  {
    icon: MessageSquare,
    title: 'Secure Messaging',
    desc: 'Encrypted advisor-client messaging with file sharing and conversation threading.',
    href: '/nexus/client/messages',
    accent: C.acc,
  },
  {
    icon: FileText,
    title: 'Document Vault',
    desc: 'Centralized repository for account statements, planning docs, signed agreements, and estate paperwork.',
    href: '/nexus/client/documents',
    accent: C.acc,
  },
  {
    icon: Calendar,
    title: 'Meeting Agenda',
    desc: 'Structured meeting prep and follow-up tracking. Clients arrive informed. Advisors arrive prepared.',
    href: '/nexus/client/agenda',
    accent: C.acc,
  },
  {
    icon: Target,
    title: 'Goals Tracker',
    desc: 'Define, quantify, and monitor every financial goal — from emergency fund to legacy transfer.',
    href: '/nexus/client/goals',
    accent: C.acc,
  },
  {
    icon: Lock,
    title: 'Broadcast Center',
    desc: 'Send targeted market commentary, planning updates, or event invitations to your full client book.',
    href: '/nexus/advisor/messages',
    accent: C.acc,
  },
]

/* ── Top bar ──────────────────────────────────────────────────────── */
function TopBar() {
  const navigate = useNavigate()
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'rgba(26,20,16,0.92)', backdropFilter: 'blur(16px)',
      borderBottom: `1px solid ${C.b1}`,
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '0 24px', height: 52,
    }}>
      <button
        onClick={() => navigate('/hub')}
        style={{
          width: 30, height: 30, borderRadius: 8,
          background: C.acc, border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0,
          boxShadow: `0 0 12px rgba(0,180,198,0.3)`,
        }}
        title="Hub"
      >
        <span style={{ fontFamily: DISPLAY, fontSize: 14, fontWeight: 800, color: '#fff', lineHeight: 1 }}>P</span>
      </button>

      <ChevronRight size={13} color={C.t3} style={{ flexShrink: 0 }} />
      <span style={{ fontFamily: UI, fontSize: 13, color: C.t2 }}>Advisor &amp; Client</span>

      <div style={{ flex: 1 }} />

      <button
        onClick={() => navigate('/nexus')}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: C.accDim, border: `1px solid ${C.accBdr}`,
          borderRadius: 8, padding: '6px 14px',
          cursor: 'pointer', color: C.acc,
          fontFamily: UI, fontSize: 12, fontWeight: 600,
        }}
      >
        Enter Nexus <ArrowUpRight size={12} />
      </button>
    </div>
  )
}

/* ── Hero ─────────────────────────────────────────────────────────── */
function Hero() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section ref={ref} style={{
      background: C.bg, padding: '80px 40px 64px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '50%', height: '100%',
        background: `radial-gradient(ellipse at top right, rgba(0,180,198,0.06) 0%, transparent 65%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        <motion.div
          variants={STAGGER} initial="hidden" animate={inView ? 'show' : 'hidden'}
        >
          <motion.div variants={FADE} style={{ marginBottom: 24 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: C.accDim, border: `1px solid ${C.accBdr}`,
              borderRadius: 100, padding: '4px 14px',
              fontFamily: UI, fontSize: 10, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.18em', color: C.acc,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.acc, display: 'inline-block' }} />
              Nexus Platform
            </span>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }} className="advisor-hero-grid">
            <div>
              <motion.h1 variants={FADE} style={{
                fontFamily: DISPLAY, fontSize: 'clamp(36px,4vw,58px)',
                fontWeight: 700, color: C.t1, lineHeight: 1.08,
                letterSpacing: '-0.02em', margin: '0 0 20px',
              }}>
                The relationship between
                <em style={{ display: 'block', color: C.acc, fontStyle: 'italic' }}>advisor and client</em>
                is everything.
              </motion.h1>

              <motion.p variants={FADE} style={{
                fontFamily: UI, fontSize: 15, color: C.t2,
                lineHeight: 1.75, maxWidth: 460, margin: '0 0 32px',
              }}>
                Nexus is the secure workspace where advisors and clients collaborate, communicate, and plan together — from onboarding through estate transfer.
              </motion.p>

              <motion.div variants={FADE} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  onClick={() => window.location.href = '/nexus/advisor'}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: C.acc, border: 'none', borderRadius: 10,
                    padding: '12px 22px', cursor: 'pointer',
                    fontFamily: UI, fontSize: 13, fontWeight: 700, color: '#0d1f22',
                  }}
                >
                  Advisor View <ArrowUpRight size={14} />
                </button>
                <button
                  onClick={() => window.location.href = '/nexus/client'}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'transparent', border: `1px solid ${C.b2}`,
                    borderRadius: 10, padding: '12px 22px', cursor: 'pointer',
                    fontFamily: UI, fontSize: 13, fontWeight: 600, color: C.t2,
                  }}
                >
                  Client View <ArrowUpRight size={14} />
                </button>
              </motion.div>
            </div>

            {/* Right — advisor value breakdown */}
            <motion.div variants={FADE} style={{
              background: C.surf, border: `1px solid ${C.b2}`,
              borderRadius: 16, padding: '28px 28px',
              boxShadow: `0 0 40px rgba(0,180,198,0.05)`,
            }}>
              <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: C.t3, marginBottom: 20 }}>
                Where advisor value comes from
              </div>
              {[
                { label: 'Behavioral coaching',        pct: 150, note: '1.5% avg' },
                { label: 'Asset location strategy',    pct: 75,  note: '0.75%' },
                { label: 'Rebalancing discipline',     pct: 35,  note: '0.35%' },
                { label: 'Spending strategy',          pct: 70,  note: '0.70%' },
                { label: 'Tax-loss harvesting',        pct: 50,  note: '0.50%' },
              ].map(item => (
                <div key={item.label} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontFamily: UI, fontSize: 12, color: C.t2 }}>{item.label}</span>
                    <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: C.acc }}>{item.note}</span>
                  </div>
                  <div style={{ height: 3, background: C.raise, borderRadius: 2 }}>
                    <div style={{
                      height: '100%', borderRadius: 2,
                      width: `${item.pct / 1.5}%`,
                      background: `linear-gradient(90deg, ${C.acc}, rgba(0,180,198,0.4))`,
                    }} />
                  </div>
                </div>
              ))}
              <div style={{
                marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.b1}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              }}>
                <span style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>Total potential value added</span>
                <span style={{ fontFamily: MONO, fontSize: 16, fontWeight: 800, color: C.acc }}>~3% / yr</span>
              </div>
              <div style={{ fontFamily: UI, fontSize: 10, color: C.t3, marginTop: 6, fontStyle: 'italic' }}>
                Source: Vanguard Advisor's Alpha research
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style>{`@media(max-width:768px){.advisor-hero-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}

/* ── Stats strip ──────────────────────────────────────────────────── */
function StatsStrip() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <section ref={ref} style={{
      background: C.surf,
      borderTop: `1px solid ${C.b1}`, borderBottom: `1px solid ${C.b1}`,
      padding: '0 40px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          variants={STAGGER} initial="hidden" animate={inView ? 'show' : 'hidden'}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}
          className="advisor-stats-grid"
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.value}
              variants={FADE}
              style={{
                padding: '32px 28px',
                borderRight: i < 3 ? `1px solid ${C.b1}` : 'none',
              }}
            >
              <div style={{ fontFamily: MONO, fontSize: 36, fontWeight: 800, color: C.acc, lineHeight: 1, marginBottom: 8 }}>
                {s.value}
              </div>
              <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.55, marginBottom: 6 }}>
                {s.label}
              </div>
              <div style={{ fontFamily: UI, fontSize: 10, color: C.t3, fontStyle: 'italic' }}>
                {s.source}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <style>{`@media(max-width:700px){.advisor-stats-grid{grid-template-columns:repeat(2,1fr)!important}}`}</style>
    </section>
  )
}

/* ── Pillars ──────────────────────────────────────────────────────── */
function Pillars() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} style={{ background: C.bg, padding: '80px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div variants={FADE} initial="hidden" animate={inView ? 'show' : 'hidden'} style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: C.t3, marginBottom: 12 }}>
            Why it matters
          </div>
          <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(26px,3vw,38px)', fontWeight: 700, color: C.t1, margin: 0, letterSpacing: '-0.02em' }}>
            Three principles behind great advice
          </h2>
        </motion.div>

        <motion.div
          variants={STAGGER} initial="hidden" animate={inView ? 'show' : 'hidden'}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}
          className="advisor-pillars-grid"
        >
          {PILLARS.map(p => {
            const Icon = p.icon
            return (
              <motion.div key={p.title} variants={FADE} style={{
                background: C.surf, border: `1px solid ${C.b2}`,
                borderRadius: 16, padding: '28px 24px',
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 11,
                  background: C.accDim, border: `1px solid ${C.accBdr}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20,
                }}>
                  <Icon size={18} color={C.acc} />
                </div>
                <h3 style={{ fontFamily: DISPLAY, fontSize: 18, fontWeight: 700, color: C.t1, margin: '0 0 12px', lineHeight: 1.3 }}>
                  {p.title}
                </h3>
                <p style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.75, margin: '0 0 16px' }}>
                  {p.body}
                </p>
                <div style={{
                  background: C.raise, border: `1px solid ${C.b1}`,
                  borderRadius: 8, padding: '8px 12px',
                  fontFamily: MONO, fontSize: 11, color: C.acc, fontWeight: 600,
                }}>
                  {p.stat}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
      <style>{`@media(max-width:768px){.advisor-pillars-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}

/* ── Compare ──────────────────────────────────────────────────────── */
function Compare() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} style={{ background: C.surf, borderTop: `1px solid ${C.b1}`, padding: '80px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div variants={FADE} initial="hidden" animate={inView ? 'show' : 'hidden'} style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: C.t3, marginBottom: 12 }}>
            The difference
          </div>
          <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(26px,3vw,38px)', fontWeight: 700, color: C.t1, margin: 0, letterSpacing: '-0.02em' }}>
            Advised vs. unadvised household
          </h2>
        </motion.div>

        <motion.div
          variants={STAGGER} initial="hidden" animate={inView ? 'show' : 'hidden'}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}
          className="advisor-compare-grid"
        >
          {/* With advisor */}
          <motion.div variants={FADE} style={{
            background: 'rgba(0,180,198,0.04)', border: `1px solid ${C.accBdr}`,
            borderRadius: 16, padding: '28px 24px',
          }}>
            <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: C.acc, marginBottom: 20 }}>
              With a financial advisor
            </div>
            {COMPARE.with.map(item => (
              <div key={item} style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start' }}>
                <CheckCircle2 size={14} color={C.acc} style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.55 }}>{item}</span>
              </div>
            ))}
          </motion.div>

          {/* Without advisor */}
          <motion.div variants={FADE} style={{
            background: 'rgba(192,57,43,0.04)', border: '1px solid rgba(192,57,43,0.18)',
            borderRadius: 16, padding: '28px 24px',
          }}>
            <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8b3a3a', marginBottom: 20 }}>
              Without a financial advisor
            </div>
            {COMPARE.without.map(item => (
              <div key={item} style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start' }}>
                <XCircle size={14} color="#8b3a3a" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.55 }}>{item}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <style>{`@media(max-width:640px){.advisor-compare-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}

/* ── Pull quote ───────────────────────────────────────────────────── */
function Quote() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} style={{
      background: C.bg, borderTop: `1px solid ${C.b1}`,
      padding: '80px 40px',
    }}>
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ height: 1, background: `linear-gradient(to right, transparent, rgba(0,180,198,0.4), transparent)`, marginBottom: 48, transformOrigin: 'center' }}
        />
        <motion.div variants={FADE} initial="hidden" animate={inView ? 'show' : 'hidden'}
          style={{ fontFamily: DISPLAY, fontSize: 72, lineHeight: 0.6, color: C.acc, opacity: 0.2, marginBottom: 20, userSelect: 'none' }}>
          &ldquo;
        </motion.div>
        <motion.blockquote
          variants={FADE} initial="hidden" animate={inView ? 'show' : 'hidden'}
          style={{ fontFamily: DISPLAY, fontSize: 'clamp(20px,2.5vw,30px)', fontStyle: 'italic', fontWeight: 500, color: C.t1, lineHeight: 1.55, margin: '0 0 28px', letterSpacing: '-0.01em' }}>
          A good financial advisor earns their fee by keeping you from making expensive mistakes when markets are frightening and opportunities are obvious.
        </motion.blockquote>
        <motion.div variants={FADE} initial="hidden" animate={inView ? 'show' : 'hidden'}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 20, height: 1, background: 'rgba(0,180,198,0.4)', marginBottom: 8 }} />
          <span style={{ fontFamily: UI, fontSize: 12, color: C.t2, fontWeight: 600, letterSpacing: '0.06em' }}>Planora Nexus</span>
          <span style={{ fontFamily: UI, fontSize: 11, color: C.t3, fontStyle: 'italic' }}>Built for the advisor-client relationship</span>
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          style={{ height: 1, background: `linear-gradient(to right, transparent, rgba(0,180,198,0.4), transparent)`, marginTop: 48, transformOrigin: 'center' }}
        />
      </div>
    </section>
  )
}

/* ── Sub-sections grid ────────────────────────────────────────────── */
function SubSections() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const navigate = useNavigate()

  return (
    <section ref={ref} style={{ background: C.surf, borderTop: `1px solid ${C.b1}`, padding: '80px 40px 100px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div variants={FADE} initial="hidden" animate={inView ? 'show' : 'hidden'} style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: C.t3, marginBottom: 12 }}>
            Nexus tools
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, color: C.t1, margin: 0, letterSpacing: '-0.02em' }}>
              Everything built for the
              <em style={{ color: C.acc, fontStyle: 'italic' }}> relationship</em>
            </h2>
            <p style={{ fontFamily: UI, fontSize: 13, color: C.t3, maxWidth: 360, lineHeight: 1.65, margin: 0 }}>
              Eight purpose-built tools that work together — from first meeting through lifetime planning.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={STAGGER} initial="hidden" animate={inView ? 'show' : 'hidden'}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}
          className="advisor-sections-grid"
        >
          {SECTIONS.map(sec => {
            const Icon = sec.icon
            return (
              <motion.button
                key={sec.title}
                variants={FADE}
                onClick={() => navigate(sec.href)}
                style={{
                  background: C.raise, border: `1px solid ${C.b2}`,
                  borderRadius: 14, padding: '22px 18px',
                  textAlign: 'left', cursor: 'pointer', width: '100%',
                  display: 'flex', flexDirection: 'column', gap: 12,
                  transition: 'all 0.2s cubic-bezier(0.32,0.72,0,1)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = C.accBdr
                  e.currentTarget.style.background = '#1f2a2b'
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.35), 0 0 0 1px ${C.accBdr}`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = C.b2
                  e.currentTarget.style.background = C.raise
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: C.accDim, border: `1px solid ${C.accBdr}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={15} color={C.acc} />
                  </div>
                  <ArrowUpRight size={13} color={C.t3} />
                </div>
                <div>
                  <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 6 }}>
                    {sec.title}
                  </div>
                  <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.6 }}>
                    {sec.desc}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </motion.div>
      </div>

      <style>{`
        @media(max-width:900px){.advisor-sections-grid{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:500px){.advisor-sections-grid{grid-template-columns:1fr!important}}
      `}</style>
    </section>
  )
}

/* ── Page ─────────────────────────────────────────────────────────── */
export default function AdvisorHub() {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: UI }}>
      <TopBar />
      <Hero />
      <StatsStrip />
      <Pillars />
      <Compare />
      <Quote />
      <SubSections />
    </div>
  )
}
