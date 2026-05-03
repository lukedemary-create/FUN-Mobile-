import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
  ResponsiveContainer,
} from 'recharts';
import {
  Activity, Shield, Users, BookOpen, TrendingUp,
  Lock, BarChart2, Globe, ArrowRight, Target,
} from 'lucide-react';

// ── Design tokens ──────────────────────────────────────────────────
const C = {
  bg:        '#0a0a0f',
  surface:   '#111318',
  elevated:  '#16181f',
  border:    '#1e2028',
  text:      '#f1f5f9',
  textSec:   '#94a3b8',
  textMuted: '#64748b',
  success:   '#10b981',
  warning:   '#f59e0b',
  danger:    '#ef4444',
  gold:      '#F5A623',
  teal:      '#00B4C6',
  indigo:    '#818cf8',
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = (delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: delay } },
});

// ─────────────────────────────────────────────────────────────────────
// Nav
// ─────────────────────────────────────────────────────────────────────
function Nav({ onEnter }) {
  const links = ['Platform', 'Solutions', 'Research', 'Wealth', 'Education', 'About'];
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10,10,15,0.88)',
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: 60,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, background: C.gold, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: '#0a0a0f', lineHeight: 1 }}>P</span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.text, letterSpacing: '-0.01em' }}>PLANORA</span>
          <span style={{ fontSize: 8, fontWeight: 600, color: C.gold, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.8 }}>TERMINAL</span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {links.map(l => (
            <button key={l} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 11px', borderRadius: 6, fontSize: 13, color: C.textSec, fontWeight: 500, fontFamily: 'inherit' }}
              onMouseEnter={e => e.currentTarget.style.color = C.text}
              onMouseLeave={e => e.currentTarget.style.color = C.textSec}
            >{l} ▾</button>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '7px 14px', fontSize: 13, color: C.textSec, fontFamily: 'inherit' }}>Sign In</button>
          <button onClick={onEnter} style={{
            background: C.gold, color: '#0a0a0f', border: 'none', borderRadius: 8,
            padding: '8px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit',
            boxShadow: `0 0 20px ${C.gold}30`,
          }}>Request Demo <ArrowRight size={13}/></button>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Hero Dashboard Mockup
// ─────────────────────────────────────────────────────────────────────
function HeroDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'relative' }}
    >
      <div style={{ position: 'absolute', inset: -40, background: `radial-gradient(ellipse at center, ${C.gold}10 0%, transparent 68%)`, pointerEvents: 'none' }}/>

      <div style={{
        background: '#0d1117', border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
      }}>
        {/* Chrome */}
        <div style={{ background: C.elevated, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: `1px solid ${C.border}` }}>
          {['#ef4444','#f59e0b','#10b981'].map((c,i) => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.8 }}/>)}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: '3px 20px', fontSize: 10, color: C.textMuted, fontFamily: 'monospace' }}>
              planora.app/dashboard
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.success }}/>
            <span style={{ fontSize: 9, color: C.success, fontFamily: 'monospace' }}>LIVE</span>
          </div>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', height: 320 }}>
          {/* Sidebar */}
          <div style={{ width: 46, background: C.bg, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', gap: 6 }}>
            <div style={{ width: 26, height: 26, background: C.gold, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 900, color: '#0a0a0f' }}>P</span>
            </div>
            {[true,false,false,false,false,false].map((active,i) => (
              <div key={i} style={{ width: 28, height: 28, borderRadius: 6, background: active ? `${C.gold}18` : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 13, height: 2, background: active ? C.gold : 'rgba(255,255,255,0.18)', borderRadius: 2 }}/>
              </div>
            ))}
          </div>

          {/* Main */}
          <div style={{ flex: 1, padding: '12px', overflow: 'hidden' }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.14em', color: C.textMuted, textTransform: 'uppercase', marginBottom: 8 }}>MARKETS OVERVIEW</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5, marginBottom: 8 }}>
              {[
                { sym: 'S&P 500',   val: '7,242.53',  chg: '+28.06',  pct: '+0.39%', up: true  },
                { sym: 'DOW JONES', val: '49,502.00', chg: '-163.00', pct: '-0.33%', up: false },
                { sym: 'NASDAQ',    val: '25,288.63', chg: '+248.38', pct: '+0.99%', up: true  },
              ].map(idx => (
                <div key={idx.sym} style={{ background: C.elevated, borderRadius: 6, padding: '7px 8px', border: `1px solid ${idx.up ? 'rgba(16,185,129,0.18)' : 'rgba(239,68,68,0.18)'}` }}>
                  <div style={{ fontSize: 7.5, color: C.textMuted, fontFamily: 'monospace', marginBottom: 2 }}>{idx.sym}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.text, fontFamily: 'monospace' }}>{idx.val}</div>
                  <div style={{ fontSize: 8.5, color: idx.up ? C.success : C.danger, fontFamily: 'monospace' }}>{idx.chg} ({idx.pct})</div>
                </div>
              ))}
            </div>

            <div style={{ background: C.elevated, borderRadius: 6, padding: '8px 10px', marginBottom: 8, border: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 8, color: C.textSec, fontFamily: 'monospace' }}>S&P 500 · 1D</span>
                <span style={{ fontSize: 8, color: C.success, fontFamily: 'monospace', fontWeight: 600 }}>+0.39%</span>
              </div>
              <svg width="100%" height="38" viewBox="0 0 260 38" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="hero-g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25"/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <polygon points="0,34 22,26 43,30 65,18 87,12 108,15 130,8 152,4 173,10 195,2 216,0 238,4 260,2 260,38 0,38" fill="url(#hero-g)"/>
                <polyline points="0,34 22,26 43,30 65,18 87,12 108,15 130,8 152,4 173,10 195,2 216,0 238,4 260,2" stroke="#10b981" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 3 }}>
              {[
                { sym:'XLK', pct:'+1.49%', up:true  },
                { sym:'XLF', pct:'-0.48%', up:false },
                { sym:'XLE', pct:'-1.34%', up:false },
                { sym:'XLV', pct:'-0.53%', up:false },
                { sym:'XLY', pct:'+0.24%', up:true  },
              ].map(s => (
                <div key={s.sym} style={{ background: s.up ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', borderRadius: 4, padding: '4px', textAlign: 'center', border: `1px solid ${s.up ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                  <div style={{ fontSize: 8, fontWeight: 700, color: C.text, fontFamily: 'monospace' }}>{s.sym}</div>
                  <div style={{ fontSize: 7.5, color: s.up ? C.success : C.danger, fontFamily: 'monospace' }}>{s.pct}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel */}
          <div style={{ width: 108, borderLeft: `1px solid ${C.border}`, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <div style={{ fontSize: 7.5, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Fear & Greed</div>
              <svg width="88" height="48" viewBox="0 0 88 48">
                <defs>
                  <linearGradient id="fg-g" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ef4444"/>
                    <stop offset="50%" stopColor="#f59e0b"/>
                    <stop offset="100%" stopColor="#10b981"/>
                  </linearGradient>
                </defs>
                <path d="M 7 43 A 37 37 0 0 1 81 43" stroke="#1e2028" strokeWidth="7" fill="none" strokeLinecap="round"/>
                <path d="M 7 43 A 37 37 0 0 1 81 43" stroke="url(#fg-g)" strokeWidth="7" fill="none" strokeLinecap="round" strokeDasharray="116" strokeDashoffset="30"/>
                <text x="44" y="41" textAnchor="middle" fontSize="16" fontWeight="800" fill={C.text} fontFamily="monospace">48</text>
              </svg>
              <div style={{ fontSize: 9, color: C.warning, fontWeight: 700, marginTop: -2 }}>Neutral</div>
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>
              <div style={{ fontSize: 7.5, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>Market Clock</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.danger }}/>
                <span style={{ fontSize: 9, color: C.danger, fontWeight: 700 }}>CLOSED</span>
              </div>
              <div style={{ fontSize: 11, color: C.text, fontFamily: 'monospace', fontWeight: 700 }}>01:45:12</div>
              <div style={{ fontSize: 8, color: C.textMuted, marginTop: 2 }}>Opens Mon 9:30</div>
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>
              <div style={{ fontSize: 7.5, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>VIX</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFamily: 'monospace' }}>18.42</div>
              <div style={{ fontSize: 8, color: C.success, fontFamily: 'monospace' }}>+0.00%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating card */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.55 }}
        style={{
          position: 'absolute', bottom: -18, left: -22,
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 10, padding: '10px 14px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}
      >
        <div style={{ width: 32, height: 32, background: 'rgba(16,185,129,0.12)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TrendingUp size={14} color={C.success}/>
        </div>
        <div>
          <div style={{ fontSize: 10, color: C.textSec }}>Portfolio Value</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: 'monospace' }}>$2,847,320</div>
        </div>
        <div style={{ fontSize: 11, color: C.success, fontFamily: 'monospace', fontWeight: 600 }}>+2.4%</div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Platform Cards
// ─────────────────────────────────────────────────────────────────────
function PlatformCards({ navigate }) {
  const [hov, setHov] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const platforms = [
    {
      id: 'terminal', accent: C.gold, route: '/dashboard',
      label: 'Market Intelligence Platform',
      name: 'Planora Terminal',
      desc: 'Institutional-grade analytics, live market data, risk modeling, and wealth planning tools — all in one terminal.',
      features: ['Real-time Data','Risk Analysis','Planning Tools','Wealth Counsel'],
      icon: (
        <div style={{ width: 44, height: 44, background: C.gold, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 20, fontWeight: 900, color: '#0a0a0f' }}>P</span>
        </div>
      ),
    },
    {
      id: 'nexus', accent: C.teal, route: '/nexus',
      label: 'Advisor-Client Platform',
      name: 'Nexus',
      desc: 'Secure collaboration hub for advisors and clients with shared dashboards, messaging, and portfolio oversight.',
      features: ['Client Portal','Workflow Center','Life Events','Secure Messaging'],
      icon: (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <polygon points="22,2 42,12 42,32 22,42 2,32 2,12" fill="none" stroke={C.teal} strokeWidth="1.5"/>
          <polygon points="22,10 34,17 34,27 22,34 10,27 10,17" fill="none" stroke={C.teal} strokeWidth="1" opacity="0.4"/>
          <circle cx="22" cy="22" r="5" fill={C.teal}/>
        </svg>
      ),
    },
    {
      id: 'fun', accent: C.indigo, route: '/fun',
      label: 'Financial Education Network',
      name: 'FUN',
      desc: 'Interactive learning, calculators, and planning modules to empower clients at every stage of their journey.',
      features: ['Education Modules','Calculators','Visual Guides','Assessments'],
      icon: (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <circle cx="22" cy="22" r="21" stroke={C.indigo} strokeWidth="1.5" fill="none" opacity="0.6"/>
          <circle cx="22" cy="7"  r="5" fill={C.indigo}/>
          <circle cx="7"  cy="35" r="5" fill={C.indigo} opacity="0.8"/>
          <circle cx="37" cy="35" r="5" fill={C.indigo} opacity="0.8"/>
          <line x1="22" y1="12" x2="7"  y2="30" stroke={C.indigo} strokeWidth="1.5" opacity="0.6"/>
          <line x1="22" y1="12" x2="37" y2="30" stroke={C.indigo} strokeWidth="1.5" opacity="0.6"/>
          <line x1="7"  y1="35" x2="37" y2="35" stroke={C.indigo} strokeWidth="1.5" opacity="0.6"/>
        </svg>
      ),
    },
  ];

  return (
    <section ref={ref} style={{ padding: '80px 0', background: C.bg }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'} style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: C.textMuted, textTransform: 'uppercase' }}>
            THREE PLATFORMS. ONE ECOSYSTEM.
          </div>
        </motion.div>

        <motion.div
          variants={stagger(0.1)} initial="hidden" animate={inView ? 'show' : 'hidden'}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}
        >
          {platforms.map(p => (
            <motion.div
              key={p.id}
              variants={fadeUp}
              onClick={() => navigate(p.route)}
              onMouseEnter={() => setHov(p.id)}
              onMouseLeave={() => setHov(null)}
              style={{
                background: C.surface,
                border: `1px solid ${hov === p.id ? p.accent + '55' : C.border}`,
                borderRadius: 16, padding: 28,
                cursor: 'pointer', position: 'relative', overflow: 'hidden',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxShadow: hov === p.id ? `0 0 40px ${p.accent}15` : 'none',
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: p.accent, borderRadius: '16px 16px 0 0' }}/>
              <div style={{ position: 'absolute', top: 20, right: 20 }}>
                <ArrowRight size={15} color={hov === p.id ? p.accent : C.textMuted} style={{ transition: 'color 0.2s' }}/>
              </div>
              <div style={{ marginBottom: 16 }}>{p.icon}</div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', color: p.accent, textTransform: 'uppercase', marginBottom: 6 }}>{p.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.text, letterSpacing: '-0.01em', marginBottom: 10 }}>{p.name}</div>
              <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.7, marginBottom: 22 }}>{p.desc}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: C.textSec }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: p.accent, flexShrink: 0 }}/>{f}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Feature Strip
// ─────────────────────────────────────────────────────────────────────
function FeatureStrip() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const features = [
    { icon: <Activity size={17} color={C.gold}/>,  title: 'Real-Time Intelligence',    desc: 'Live markets, news, and macro insights' },
    { icon: <BarChart2 size={17} color={C.gold}/>, title: 'Advanced Risk Analysis',    desc: 'Scenario modeling & Monte Carlo simulations' },
    { icon: <Target size={17} color={C.gold}/>,    title: 'Portfolio Optimization',    desc: 'Data-driven allocation & rebalancing tools' },
    { icon: <Globe size={17} color={C.gold}/>,     title: 'Wealth Planning',           desc: 'Cash flow, goals, estate & retirement' },
    { icon: <Users size={17} color={C.gold}/>,     title: 'Client Collaboration',      desc: 'Dashboards, tasks & secure communication' },
    { icon: <Lock size={17} color={C.gold}/>,      title: 'Secure by Design',          desc: 'Bank-grade security & enterprise infrastructure' },
  ];

  return (
    <section ref={ref} style={{ background: C.elevated, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '40px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <div style={{ flexShrink: 0, minWidth: 120 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: C.gold, textTransform: 'uppercase', lineHeight: 1.8 }}>BUILT FOR MODERN<br/>WEALTH MANAGERS</div>
          </div>
          <div style={{ width: 1, height: 50, background: C.border, flexShrink: 0 }}/>
          <motion.div
            variants={stagger(0)} initial="hidden" animate={inView ? 'show' : 'hidden'}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', flex: 1 }}
          >
            {features.map((f, i) => (
              <motion.div key={f.title} variants={fadeUp} style={{ padding: '0 18px', borderLeft: i > 0 ? `1px solid ${C.border}` : 'none' }}>
                <div style={{ marginBottom: 8 }}>{f.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 4, lineHeight: 1.3 }}>{f.title}</div>
                <div style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.5 }}>{f.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Dashboard Preview
// ─────────────────────────────────────────────────────────────────────
const gdpData = [
  { y:'2022', usa:2.1, eu:3.5, china:3.0 },
  { y:'2023', usa:2.5, eu:0.6, china:5.2 },
  { y:'2024', usa:2.8, eu:0.9, china:4.8 },
  { y:'2025', usa:2.4, eu:1.4, china:4.5 },
  { y:'2026', usa:2.6, eu:1.8, china:4.2 },
];

const allocData = [
  { name:'Equities',     value:58.2, color:C.gold   },
  { name:'Fixed Income', value:22.1, color:C.teal   },
  { name:'Alternatives', value:14.0, color:C.indigo },
  { name:'Real Estate',  value:2.0,  color:'#10b981'},
  { name:'Cash',         value:3.7,  color:'#64748b'},
];

const fpData = [
  {y:0,v:100000},{y:5,v:148000},{y:10,v:210000},
  {y:15,v:320000},{y:20,v:480000},{y:25,v:720000},{y:30,v:1100000},
];

function DashboardPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const card = { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 };

  return (
    <section ref={ref} style={{ padding: '80px 0', background: C.bg }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'} style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: C.textMuted, textTransform: 'uppercase', marginBottom: 10 }}>PLATFORM INTELLIGENCE</div>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: C.text, letterSpacing: '-0.02em', marginBottom: 10 }}>Every tool you need. All in one place.</h2>
          <p style={{ fontSize: 14, color: C.textSec, maxWidth: 480, lineHeight: 1.75 }}>Institutional-grade dashboards, research, and planning tools built for modern wealth management professionals.</p>
        </motion.div>

        <motion.div
          variants={stagger(0.05)} initial="hidden" animate={inView ? 'show' : 'hidden'}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}
        >
          {/* 1 — Portfolio Intelligence */}
          <motion.div variants={fadeUp} style={card}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.14em', color: C.textMuted, textTransform: 'uppercase', marginBottom: 12 }}>PORTFOLIO ALLOCATION</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
              <div style={{ width: 80, height: 80, flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={allocData} innerRadius={25} outerRadius={38} dataKey="value" strokeWidth={0}>
                      {allocData.map((e,i) => <Cell key={i} fill={e.color}/>)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.text, fontFamily: 'monospace', marginBottom: 2 }}>$28.7M</div>
                <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 8 }}>Total Value</div>
                {allocData.map(a => (
                  <div key={a.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 6, height: 6, borderRadius: 2, background: a.color, flexShrink: 0 }}/>
                      <span style={{ fontSize: 9, color: C.textSec }}>{a.name}</span>
                    </div>
                    <span style={{ fontSize: 9, color: C.text, fontFamily: 'monospace' }}>{a.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>Portfolio Intelligence</div>
            <div style={{ fontSize: 11, color: C.textSec, lineHeight: 1.55, marginBottom: 10 }}>Deep visibility into performance, allocation, and risk across all accounts.</div>
            <span style={{ fontSize: 11, color: C.gold, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>Learn more <ArrowRight size={11}/></span>
          </motion.div>

          {/* 2 — Macro Outlook */}
          <motion.div variants={fadeUp} style={card}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.14em', color: C.textMuted, textTransform: 'uppercase', marginBottom: 4 }}>MACRO OUTLOOK</div>
            <div style={{ fontSize: 11, color: C.textSec, marginBottom: 12 }}>Global GDP Growth Forecast</div>
            <div style={{ height: 90, marginBottom: 8 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gdpData} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
                  <Line type="monotone" dataKey="usa"   stroke={C.gold}   strokeWidth={1.5} dot={false}/>
                  <Line type="monotone" dataKey="eu"    stroke={C.teal}   strokeWidth={1.5} dot={false}/>
                  <Line type="monotone" dataKey="china" stroke={C.danger} strokeWidth={1.5} dot={false}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              {[['USA',C.gold],['Europe',C.teal],['China',C.danger]].map(([l,c]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, color: C.textSec }}>
                  <div style={{ width: 12, height: 2, background: c, borderRadius: 1 }}/>{l}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: C.textSec, lineHeight: 1.55, marginBottom: 10 }}>Macro insights from global markets, economy, and policy trends.</div>
            <span style={{ fontSize: 11, color: C.gold, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>Learn more <ArrowRight size={11}/></span>
          </motion.div>

          {/* 3 — Macro Research */}
          <motion.div variants={fadeUp} style={card}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.14em', color: C.textMuted, textTransform: 'uppercase', marginBottom: 12 }}>MACRO RESEARCH</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
              {[
                { label:'Fed Funds Rate', val:'4.25%', delta:'▼ -0.25%', color:C.success },
                { label:'CPI YoY',        val:'3.1%',  delta:'▼ -0.2%',  color:C.success },
                { label:'10Y Treasury',   val:'4.42%', delta:'▲ +0.08%', color:C.danger  },
                { label:'Unemployment',   val:'4.1%',  delta:'→ flat',   color:C.warning },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', background: C.elevated, borderRadius: 6 }}>
                  <span style={{ fontSize: 11, color: C.textSec }}>{r.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 10, color: r.color, fontFamily: 'monospace' }}>{r.delta}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.text, fontFamily: 'monospace' }}>{r.val}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: C.textSec, lineHeight: 1.55, marginBottom: 10 }}>Actionable insights from global markets, economy, and policy trends.</div>
            <span style={{ fontSize: 11, color: C.gold, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>Learn more <ArrowRight size={11}/></span>
          </motion.div>

          {/* 4 — Retirement Plan */}
          <motion.div variants={fadeUp} style={card}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.14em', color: C.textMuted, textTransform: 'uppercase', marginBottom: 12 }}>RETIREMENT PLAN</div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: C.textSec, marginBottom: 4 }}>Probability of Success</div>
              <div style={{ fontSize: 38, fontWeight: 800, color: C.success, fontFamily: 'monospace', letterSpacing: '-0.02em', lineHeight: 1 }}>92%</div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 10, color: C.textMuted }}>Target: 85%</span>
                <span style={{ fontSize: 10, color: C.success }}>On Track</span>
              </div>
              <div style={{ height: 6, background: C.elevated, borderRadius: 99 }}>
                <div style={{ width: '92%', height: '100%', background: `linear-gradient(90deg, ${C.success}, #34d399)`, borderRadius: 99 }}/>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: `1px solid ${C.border}`, marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: C.textMuted }}>Investable Assets</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.text, fontFamily: 'monospace' }}>$4,250,000</span>
            </div>
            <div style={{ fontSize: 11, color: C.textSec, lineHeight: 1.55, marginBottom: 10 }}>Model your retirement with Monte Carlo simulation and 2026 contribution limits.</div>
            <span style={{ fontSize: 11, color: C.gold, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>Learn more <ArrowRight size={11}/></span>
          </motion.div>

          {/* 5 — Future Planning */}
          <motion.div variants={fadeUp} style={card}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.14em', color: C.textMuted, textTransform: 'uppercase', marginBottom: 12 }}>FUTURE PLANNING</div>
            <div style={{ height: 80, marginBottom: 10 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={fpData} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fp-g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.indigo} stopOpacity="0.3"/>
                      <stop offset="100%" stopColor={C.indigo} stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke={C.indigo} strokeWidth={1.5} fill="url(#fp-g)" dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>Future Planning</div>
            <div style={{ fontSize: 11, color: C.textSec, lineHeight: 1.55, marginBottom: 10 }}>Model your future with confidence using goals-based planning tools with real-time projections.</div>
            <span style={{ fontSize: 11, color: C.gold, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>Learn more <ArrowRight size={11}/></span>
          </motion.div>

          {/* 6 — Client Engagement */}
          <motion.div variants={fadeUp} style={card}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.14em', color: C.textMuted, textTransform: 'uppercase', marginBottom: 12 }}>CLIENT ENGAGEMENT</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: `${C.gold}22`, border: `1px solid ${C.gold}40`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: C.gold, fontWeight: 700 }}>A</div>
                <div style={{ background: C.elevated, borderRadius: '8px 8px 8px 2px', padding: '7px 10px', flex: 1 }}>
                  <div style={{ fontSize: 9, color: C.gold, fontWeight: 600, marginBottom: 2 }}>Advisor · Today 10:30 AM</div>
                  <div style={{ fontSize: 11, color: C.textSec }}>Market update and portfolio review is ready.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: `${C.teal}22`, border: `1px solid ${C.teal}40`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: C.teal, fontWeight: 700 }}>C</div>
                <div style={{ background: `${C.teal}12`, borderRadius: '8px 8px 2px 8px', padding: '7px 10px', flex: 1 }}>
                  <div style={{ fontSize: 9, color: C.teal, fontWeight: 600, marginBottom: 2 }}>Client · 10:32 AM</div>
                  <div style={{ fontSize: 11, color: C.textSec }}>Great, thank you!</div>
                </div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: C.textSec, lineHeight: 1.55, marginBottom: 10 }}>Stronger relationships through transparency, communication, and proactive insights.</div>
            <span style={{ fontSize: 11, color: C.gold, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>Learn more <ArrowRight size={11}/></span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────────────
function Footer() {
  const [email, setEmail] = useState('');

  const cols = [
    { head: 'Platform',   links: ['Planora Terminal','Nexus','FUN','Integrations','Security'] },
    { head: 'Solutions',  links: ['Wealth Management','Family Office','RIAs','Institutions','Trust & Estates'] },
    { head: 'Research',   links: ['Market Insights','Macro Outlook','Sector Analysis','Reports','Data Providers'] },
    { head: 'Wealth',     links: ['Portfolio Tools','Risk Analysis','Financial Planning','Retirement','Tax Planning'] },
    { head: 'Education',  links: ['Courses','Calculators','Guides','Webinars','Resource Center'] },
    { head: 'Company',    links: ['About Us','Careers','Press','Partners','Contact'] },
  ];

  return (
    <footer style={{ background: C.elevated, borderTop: `1px solid ${C.border}`, padding: '60px 0 30px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 260px', gap: 48, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 30, height: 30, background: C.gold, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 900, color: '#0a0a0f' }}>P</span>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>PLANORA</div>
                <div style={{ fontSize: 8, color: C.gold, letterSpacing: '0.1em', textTransform: 'uppercase' }}>TERMINAL</div>
              </div>
            </div>
            <p style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.7, marginBottom: 20 }}>
              The unified ecosystem for institutional intelligence, advisor collaboration, and financial education.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {['in','tw','yt','⊕'].map(s => (
                <div key={s} style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: C.textMuted, cursor: 'pointer' }}>{s}</div>
              ))}
            </div>
          </div>

          {/* Nav cols */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8 }}>
            {cols.map(col => (
              <div key={col.head}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: C.text, textTransform: 'uppercase', marginBottom: 12 }}>{col.head}</div>
                {col.links.map(l => (
                  <div key={l} style={{ fontSize: 12, color: C.textMuted, marginBottom: 8, cursor: 'pointer', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = C.text}
                    onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
                  >{l}</div>
                ))}
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 6 }}>Stay ahead of the markets.</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 16, lineHeight: 1.65 }}>Get insights, updates, and platform news.</div>
            <div style={{ display: 'flex' }}>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRight: 'none', borderRadius: '8px 0 0 8px', padding: '10px 12px', fontSize: 12, color: C.text, outline: 'none', fontFamily: 'inherit' }}
              />
              <button style={{ background: C.gold, color: '#0a0a0f', border: 'none', borderRadius: '0 8px 8px 0', padding: '10px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 11, color: C.textMuted }}>© 2026 Planora Technologies, Inc. All rights reserved.</div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy','Terms of Service','Disclosure','Sitemap'].map(l => (
              <span key={l} style={{ fontSize: 11, color: C.textMuted, cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.color = C.text}
                onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
              >{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Landing
// ─────────────────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', -apple-system, sans-serif", color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #64748b; }
      `}</style>

      <Nav onEnter={() => navigate('/dashboard')} />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '100px 0 60px', position: 'relative', overflow: 'hidden' }}>
        {/* Grid bg */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.024) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.024) 1px, transparent 1px)`, backgroundSize: '48px 48px', pointerEvents: 'none' }}/>
        {/* Gold glow */}
        <div style={{ position: 'absolute', top: '20%', left: '5%', width: 600, height: 500, background: `radial-gradient(ellipse, ${C.gold}08 0%, transparent 65%)`, pointerEvents: 'none' }}/>

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 64, alignItems: 'center' }}>

            {/* Left */}
            <motion.div variants={stagger(0)} initial="hidden" animate="show">
              <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: `${C.gold}12`, border: `1px solid ${C.gold}30`, borderRadius: 100, padding: '5px 14px', marginBottom: 24 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.gold, boxShadow: `0 0 8px ${C.gold}` }}/>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.gold, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Institutional Intelligence. Personal Impact.</span>
              </motion.div>

              <motion.h1 variants={fadeUp} style={{ fontSize: 52, fontWeight: 800, letterSpacing: '-0.03em', color: C.text, lineHeight: 1.1, marginBottom: 20 }}>
                The Future of<br/>Wealth Management,<br/><span style={{ color: C.gold }}>Unified.</span>
              </motion.h1>

              <motion.p variants={fadeUp} style={{ fontSize: 16, color: C.textSec, lineHeight: 1.75, maxWidth: 460, marginBottom: 36 }}>
                Planora unifies institutional-grade market intelligence, advisor collaboration, and financial education in one connected ecosystem built for the next generation of wealth management.
              </motion.p>

              <motion.div variants={fadeUp} style={{ display: 'flex', gap: 12, marginBottom: 48 }}>
                <button
                  onClick={() => navigate('/dashboard')}
                  style={{ background: C.gold, color: '#0a0a0f', border: 'none', borderRadius: 10, padding: '14px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit', boxShadow: `0 0 30px ${C.gold}35`, transition: 'transform 0.15s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 0 48px ${C.gold}55`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 0 30px ${C.gold}35`; }}
                >
                  Enter Platform <ArrowRight size={15}/>
                </button>
                <button
                  onClick={() => navigate('/fun')}
                  style={{ background: 'transparent', color: C.text, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 0.2s, background 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.textMuted; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = 'transparent'; }}
                >
                  Explore Solutions
                </button>
              </motion.div>

              {/* Trust badges */}
              <motion.div variants={fadeUp} style={{ display: 'flex', gap: 0, borderTop: `1px solid ${C.border}`, paddingTop: 24 }}>
                {[
                  { icon: <Activity size={12} color={C.gold}/>,  label: 'Live Market Data'      },
                  { icon: <Shield   size={12} color={C.gold}/>,  label: 'Bank-Grade Security'   },
                  { icon: <Users    size={12} color={C.gold}/>,  label: 'Advisor & Client Tools'},
                  { icon: <BookOpen size={12} color={C.gold}/>,  label: 'Education & Planning'  },
                ].map((b, i) => (
                  <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 6, paddingRight: 18, marginRight: 18, borderRight: i < 3 ? `1px solid ${C.border}` : 'none' }}>
                    {b.icon}
                    <span style={{ fontSize: 11, color: C.textSec, whiteSpace: 'nowrap' }}>{b.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — mockup */}
            <HeroDashboard />
          </div>
        </div>
      </section>

      <PlatformCards navigate={navigate} />
      <FeatureStrip />
      <DashboardPreview />
      <Footer />
    </div>
  );
}
