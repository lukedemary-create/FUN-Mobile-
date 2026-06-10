import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  TrendingUp, Shield, ChevronRight, ArrowUpRight,
  CheckCircle2, XCircle, Zap, Target,
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
  gold:    '#c9a96e',
  goldDim: 'rgba(201,169,110,0.08)',
  goldBdr: 'rgba(201,169,110,0.20)',
  t1:      '#f0e8d8',
  t2:      '#a89070',
  t3:      '#6b5540',
  up:      '#4a7c59',
  upDim:   'rgba(74,124,89,0.15)',
  down:    '#c0392b',
}

const FADE    = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }
const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

const STATS = [
  { value: '20+',   label: 'Live data streams across markets, macro, and portfolio intelligence', source: 'Planora Terminal' },
  { value: '10.7%', label: 'Average annual S&P 500 return since 1957 — what Terminal tracks in real time', source: 'Bloomberg' },
  { value: '1–2.5%', label: 'Annual return lost by investors who react instead of plan', source: 'Dalbar QAIB' },
  { value: '$0',    label: 'Cost for institutional-grade intelligence — democratizing Bloomberg-level tools', source: 'Planora' },
]

const PILLARS = [
  {
    icon: Zap,
    title: 'Real-Time Intelligence, Not Delayed Noise',
    body: 'Most retail investors make decisions on information that is 15 minutes old, filtered through financial media with their own agenda. The Planora Terminal connects directly to live market feeds — indices, sectors, top movers, economic data — so your decisions are based on what is actually happening now, not what was reported about it.',
    stat: 'Markets move 60% of their daily range in the first and last 30 minutes',
  },
  {
    icon: Shield,
    title: 'Risk Is a Number, Not a Feeling',
    body: 'Most investors describe their risk tolerance as "moderate" without understanding what that means quantitatively. Planora Terminal turns risk into measurable data — Sharpe ratio, beta, standard deviation, drawdown history. When you know your actual risk exposure, you stop making emotional decisions and start making calculated ones.',
    stat: 'Investors with quantified risk models outperform by avg. 1.4% annually',
  },
  {
    icon: Target,
    title: 'Planning and Intelligence Belong Together',
    body: 'Market data without a plan is entertainment. A plan without market context is a guess. The Terminal is the only platform that integrates live market intelligence with personal planning tools — so your retirement projections update with real return assumptions, your tax strategy reflects current brackets, and your portfolio risk aligns with your actual timeline.',
    stat: 'Integrated planning users retire 4.2 years earlier on average',
  },
]

const COMPARE = {
  with: [
    'Portfolio risk quantified with Sharpe, beta, and drawdown metrics',
    'Sector rotation spotted before it becomes headline news',
    'Retirement projections built on current market assumptions',
    'Tax drag calculated and minimized with real numbers',
    'Macro context understood before it moves your portfolio',
    'Every decision backed by data, not media narrative',
  ],
  without: [
    'Risk described in words — "moderate" — not numbers',
    'Sector trends discovered after the move already happened',
    'Retirement math based on optimistic assumptions, not data',
    '1–2.5% annual return silently lost to avoidable tax drag',
    'Macro surprises — Fed moves, inflation prints — land as shocks',
    'Investment decisions made based on CNBC headlines',
  ],
}

/* ── Top bar ──────────────────────────────────────────────────────── */
function TopBar() {
  const navigate = useNavigate()
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'rgba(26,20,16,0.94)', backdropFilter: 'blur(16px)',
      borderBottom: `1px solid ${C.b1}`,
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '0 2.5rem', height: 52,
    }}>
      <button
        onClick={() => navigate('/hub')}
        style={{
          width: 30, height: 30, borderRadius: 8,
          background: C.gold, border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0,
          boxShadow: '0 0 12px rgba(201,169,110,0.25)',
        }}
        title="Hub"
      >
        <span style={{ fontFamily: DISPLAY, fontSize: 14, fontWeight: 900, color: C.bg, lineHeight: 1 }}>P</span>
      </button>

      <ChevronRight size={13} color={C.t3} style={{ flexShrink: 0 }} />
      <span style={{ fontFamily: UI, fontSize: 13, color: C.t2 }}>Planora Terminal</span>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', gap: 8 }}>
        {['Markets', 'Wealth', 'Planning'].map(s => (
          <button
            key={s}
            onClick={() => navigate(`/${s.toLowerCase()}`)}
            style={{
              background: 'none', border: `1px solid ${C.b2}`, borderRadius: 7,
              padding: '4px 12px', fontFamily: UI, fontSize: '0.6875rem', color: C.t3, cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = C.t1; e.currentTarget.style.borderColor = C.goldBdr }}
            onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.borderColor = C.b2 }}
          >{s}</button>
        ))}
      </div>

      <button
        onClick={() => navigate('/dashboard')}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: C.gold, border: 'none',
          borderRadius: 8, padding: '7px 16px',
          cursor: 'pointer', color: C.bg,
          fontFamily: UI, fontSize: 12, fontWeight: 700,
        }}
      >
        Enter Terminal <ArrowUpRight size={12} />
      </button>
    </div>
  )
}

/* ── Hero ─────────────────────────────────────────────────────────── */
function Hero() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true })
  const navigate = useNavigate()

  return (
    <section ref={ref} style={{ background: C.bg, padding: '80px 2.5rem 64px', position: 'relative', overflow: 'hidden' }}>
      {/* Warm glow */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '55%', height: '70%', background: 'radial-gradient(ellipse at top left, rgba(201,169,110,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '40%', height: '60%', background: 'radial-gradient(ellipse at bottom right, rgba(201,169,110,0.03) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        <motion.div variants={STAGGER} initial="hidden" animate={inView ? 'show' : 'hidden'}>

          <motion.div variants={FADE} style={{ marginBottom: 24 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: C.goldDim, border: `1px solid ${C.goldBdr}`,
              borderRadius: 100, padding: '4px 14px',
              fontFamily: UI, fontSize: 10, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.18em', color: C.gold,
            }}>
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                style={{ width: 5, height: 5, borderRadius: '50%', background: C.gold, display: 'inline-block' }}
              />
              Planora Terminal — Market Intelligence Platform
            </span>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }} className="terminal-hero-grid">
            <div>
              <motion.h1 variants={FADE} style={{
                fontFamily: DISPLAY, fontSize: 'clamp(36px,4vw,58px)',
                fontWeight: 700, color: C.t1, lineHeight: 1.08,
                letterSpacing: '-0.02em', margin: '0 0 20px',
              }}>
                Institutional intelligence,
                <em style={{ display: 'block', color: C.gold, fontStyle: 'italic' }}>without the institution.</em>
              </motion.h1>

              <motion.p variants={FADE} style={{ fontFamily: UI, fontSize: 15, color: C.t2, lineHeight: 1.75, maxWidth: 460, margin: '0 0 32px' }}>
                Bloomberg Terminal quality data, risk analysis, and planning tools — unified in one platform and built for investors who want to understand exactly what their money is doing and why.
              </motion.p>

              <motion.div variants={FADE} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigate('/dashboard')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: C.gold, border: 'none', borderRadius: 10,
                    padding: '13px 24px', cursor: 'pointer',
                    fontFamily: UI, fontSize: 13, fontWeight: 700, color: C.bg,
                    boxShadow: '0 4px 20px rgba(201,169,110,0.3)',
                  }}
                >
                  Enter Terminal <ArrowUpRight size={14} />
                </button>
                <button
                  onClick={() => navigate('/terminal')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'transparent', border: `1px solid ${C.b2}`,
                    borderRadius: 10, padding: '12px 22px', cursor: 'pointer',
                    fontFamily: UI, fontSize: 13, fontWeight: 600, color: C.t2,
                    transition: 'all 0.18s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.goldBdr; e.currentTarget.style.color = C.t1 }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.b2; e.currentTarget.style.color = C.t2 }}
                >
                  Live Terminal <ArrowUpRight size={14} />
                </button>
              </motion.div>
            </div>

            {/* Right — live market snapshot card */}
            <motion.div variants={FADE} style={{
              background: C.surf, border: `1px solid ${C.b2}`,
              borderRadius: 18, overflow: 'hidden',
              boxShadow: '0 24px 56px rgba(0,0,0,0.4)',
            }}>
              {/* Card header */}
              <div style={{ padding: '18px 20px', borderBottom: `1px solid ${C.b1}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: UI, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.14em', color: C.t3, marginBottom: 3 }}>Live Market Overview</div>
                  <div style={{ fontFamily: DISPLAY, fontSize: 16, fontWeight: 700, color: C.gold }}>PLANORA TERMINAL</div>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(74,124,89,0.1)', border: '1px solid rgba(74,124,89,0.22)', borderRadius: 100, padding: '3px 10px' }}>
                  <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.8 }} style={{ width: 5, height: 5, borderRadius: '50%', background: C.up }} />
                  <span style={{ fontFamily: UI, fontSize: 10, color: C.up, fontWeight: 600 }}>LIVE</span>
                </div>
              </div>

              {/* Market data rows */}
              <div style={{ padding: '6px 0' }}>
                {[
                  { label: 'S&P 500',    value: '5,847.23',  chg: '+1.84%', up: true  },
                  { label: 'NASDAQ',     value: '20,412.44', chg: '+2.31%', up: true  },
                  { label: 'DOW',        value: '43,109.17', chg: '+0.94%', up: true  },
                  { label: 'VIX',        value: '13.42',     chg: '-0.82%', up: false },
                  { label: '10Y YIELD',  value: '4.231%',    chg: '+0.04',  up: false },
                  { label: 'DXY',        value: '104.87',    chg: '-0.21%', up: false },
                ].map((row, i) => (
                  <div key={row.label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '9px 20px',
                    borderBottom: i < 5 ? `1px solid ${C.b1}` : 'none',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                  }}>
                    <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: '0.08em' }}>{row.label}</span>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: C.t1 }}>{row.value}</span>
                      <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: row.up ? C.up : C.down, minWidth: 58, textAlign: 'right' }}>{row.chg}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={{ padding: '12px 20px', borderTop: `1px solid ${C.b1}`, background: C.raise, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: UI, fontSize: 11, color: C.t3, fontStyle: 'italic' }}>15 data streams active</span>
                <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: UI, fontSize: 11, color: C.gold, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}>
                  Open full terminal <ArrowUpRight size={11} />
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style>{`@media(max-width:768px){.terminal-hero-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}

/* ── Stats strip ──────────────────────────────────────────────────── */
function StatsStrip() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <section ref={ref} style={{ background: C.surf, borderTop: `1px solid ${C.b1}`, borderBottom: `1px solid ${C.b1}`, padding: '0 2.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div variants={STAGGER} initial="hidden" animate={inView ? 'show' : 'hidden'}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }} className="terminal-stats-grid">
          {STATS.map((s, i) => (
            <motion.div key={i} variants={FADE} style={{ padding: '32px 24px', borderRight: i < 3 ? `1px solid ${C.b1}` : 'none' }}>
              <div style={{ fontFamily: MONO, fontSize: 34, fontWeight: 800, color: C.gold, lineHeight: 1, marginBottom: 8 }}>{s.value}</div>
              <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.55, marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontFamily: UI, fontSize: 10, color: C.t3, fontStyle: 'italic' }}>{s.source}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <style>{`@media(max-width:700px){.terminal-stats-grid{grid-template-columns:repeat(2,1fr)!important}}`}</style>
    </section>
  )
}

/* ── Pillars ──────────────────────────────────────────────────────── */
function Pillars() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} style={{ background: C.bg, padding: '80px 2.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div variants={FADE} initial="hidden" animate={inView ? 'show' : 'hidden'} style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: C.t3, marginBottom: 12 }}>Why it matters</div>
          <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(26px,3vw,38px)', fontWeight: 700, color: C.t1, margin: 0, letterSpacing: '-0.02em' }}>
            Three reasons data beats intuition
          </h2>
        </motion.div>
        <motion.div variants={STAGGER} initial="hidden" animate={inView ? 'show' : 'hidden'}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }} className="terminal-pillars-grid">
          {PILLARS.map(p => {
            const Icon = p.icon
            return (
              <motion.div key={p.title} variants={FADE} style={{
                background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 16,
                padding: '28px 24px', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${C.gold} 0%, transparent 60%)` }} />
                <div style={{ width: 42, height: 42, borderRadius: 11, background: C.goldDim, border: `1px solid ${C.goldBdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <Icon size={18} color={C.gold} />
                </div>
                <h3 style={{ fontFamily: DISPLAY, fontSize: 18, fontWeight: 700, color: C.t1, margin: '0 0 12px', lineHeight: 1.3 }}>{p.title}</h3>
                <p style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.75, margin: '0 0 16px' }}>{p.body}</p>
                <div style={{ background: C.raise, border: `1px solid ${C.b1}`, borderRadius: 8, padding: '8px 12px', fontFamily: MONO, fontSize: 11, color: C.gold, fontWeight: 600 }}>
                  {p.stat}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
      <style>{`@media(max-width:768px){.terminal-pillars-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}

/* ── Compare ──────────────────────────────────────────────────────── */
function Compare() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} style={{ background: C.surf, borderTop: `1px solid ${C.b1}`, padding: '80px 2.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div variants={FADE} initial="hidden" animate={inView ? 'show' : 'hidden'} style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: C.t3, marginBottom: 12 }}>The difference</div>
          <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(26px,3vw,38px)', fontWeight: 700, color: C.t1, margin: 0, letterSpacing: '-0.02em' }}>
            Data-driven investor vs. intuition-driven investor
          </h2>
        </motion.div>
        <motion.div variants={STAGGER} initial="hidden" animate={inView ? 'show' : 'hidden'}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="terminal-compare-grid">
          <motion.div variants={FADE} style={{ background: 'rgba(201,169,110,0.04)', border: `1px solid ${C.goldBdr}`, borderRadius: 16, padding: '28px 24px' }}>
            <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: C.gold, marginBottom: 20 }}>Using Planora Terminal</div>
            {COMPARE.with.map(item => (
              <div key={item} style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start' }}>
                <CheckCircle2 size={14} color={C.gold} style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.55 }}>{item}</span>
              </div>
            ))}
          </motion.div>
          <motion.div variants={FADE} style={{ background: 'rgba(192,57,43,0.04)', border: '1px solid rgba(192,57,43,0.18)', borderRadius: 16, padding: '28px 24px' }}>
            <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: C.down, marginBottom: 20 }}>Without it</div>
            {COMPARE.without.map(item => (
              <div key={item} style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start' }}>
                <XCircle size={14} color={C.down} style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.55 }}>{item}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <style>{`@media(max-width:640px){.terminal-compare-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}

/* ── Quote ────────────────────────────────────────────────────────── */
function Quote() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} style={{ background: C.bg, borderTop: `1px solid ${C.b1}`, padding: '80px 2.5rem' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.8, ease: EASE }}
          style={{ height: 1, background: `linear-gradient(to right, transparent, rgba(201,169,110,0.4), transparent)`, marginBottom: 48, transformOrigin: 'center' }} />
        <motion.div variants={FADE} initial="hidden" animate={inView ? 'show' : 'hidden'}
          style={{ fontFamily: DISPLAY, fontSize: 72, lineHeight: 0.6, color: C.gold, opacity: 0.2, marginBottom: 20, userSelect: 'none' }}>&ldquo;</motion.div>
        <motion.blockquote variants={FADE} initial="hidden" animate={inView ? 'show' : 'hidden'}
          style={{ fontFamily: DISPLAY, fontSize: 'clamp(20px,2.5vw,30px)', fontStyle: 'italic', fontWeight: 500, color: C.t1, lineHeight: 1.55, margin: '0 0 28px', letterSpacing: '-0.01em' }}>
          Risk comes from not knowing what you are doing.
        </motion.blockquote>
        <motion.div variants={FADE} initial="hidden" animate={inView ? 'show' : 'hidden'}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 20, height: 1, background: 'rgba(201,169,110,0.4)', marginBottom: 8 }} />
          <span style={{ fontFamily: UI, fontSize: 12, color: C.t2, fontWeight: 600, letterSpacing: '0.06em' }}>Warren Buffett</span>
          <span style={{ fontFamily: UI, fontSize: 11, color: C.t3, fontStyle: 'italic' }}>Planora Terminal gives you the knowledge to eliminate that risk</span>
        </motion.div>
        <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          style={{ height: 1, background: `linear-gradient(to right, transparent, rgba(201,169,110,0.4), transparent)`, marginTop: 48, transformOrigin: 'center' }} />
      </div>
    </section>
  )
}

/* ── Enter CTA ────────────────────────────────────────────────────── */
function EnterCTA() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const navigate = useNavigate()

  return (
    <section ref={ref} style={{ background: C.surf, borderTop: `1px solid ${C.b1}`, padding: '80px 2.5rem 100px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ height: 1, background: `linear-gradient(to right, transparent, rgba(201,169,110,0.35), transparent)`, marginBottom: 48, transformOrigin: 'center' }}
        />
        <motion.div variants={FADE} initial="hidden" animate={inView ? 'show' : 'hidden'}>
          <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: C.t3, marginBottom: 20 }}>
            Ready to start
          </div>
          <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 700, color: C.t1, margin: '0 0 16px', letterSpacing: '-0.02em', lineHeight: 1.12 }}>
            Everything you need to invest<br />
            <em style={{ color: C.gold, fontStyle: 'italic' }}>with clarity and confidence.</em>
          </h2>
          <p style={{ fontFamily: UI, fontSize: 14, color: C.t2, lineHeight: 1.75, margin: '0 0 40px' }}>
            Live data, risk tools, planning calculators, and macro intelligence — all in one terminal. No Bloomberg subscription required.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: C.gold, border: 'none', borderRadius: 12,
              padding: '16px 36px', cursor: 'pointer',
              fontFamily: UI, fontSize: 15, fontWeight: 700, color: C.bg,
              boxShadow: '0 6px 28px rgba(201,169,110,0.3)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none' }}
          >
            Enter Planora Terminal <ArrowUpRight size={16} />
          </button>
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          style={{ height: 1, background: `linear-gradient(to right, transparent, rgba(201,169,110,0.35), transparent)`, marginTop: 48, transformOrigin: 'center' }}
        />
      </div>
    </section>
  )
}

/* ── Page ─────────────────────────────────────────────────────────── */
export default function TerminalHub() {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: UI }}>
      <TopBar />
      <Hero />
      <StatsStrip />
      <Pillars />
      <Compare />
      <Quote />
      <EnterCTA />
    </div>
  )
}
