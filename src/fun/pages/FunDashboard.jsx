import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, RotateCcw, CheckCircle2,
  Clock, TrendingUp, Shield, ScrollText, Wallet, CreditCard,
  ArrowRight, LayoutDashboard,
} from 'lucide-react';

// Arche warm-dark tokens
const C = {
  bg:      '#1a1410',
  surface: '#231c16',
  raised:  '#2d2419',
  b1:      '#2a2018',
  b2:      '#3d3028',
  teal:    '#00B4C6',
  tealDim: 'rgba(0,180,198,0.08)',
  tealBdr: 'rgba(0,180,198,0.22)',
  gold:    '#c9a96e',
  goldDim: 'rgba(201,169,110,0.08)',
  t1:      '#f0e8d8',
  t2:      '#a89070',
  t3:      '#6b5540',
};

const UI      = "'Inter', system-ui, sans-serif";
const DISPLAY = "'Playfair Display', Georgia, serif";
const MONO    = "'JetBrains Mono', monospace";
const STORAGE_KEY = 'fun-onboarding-v1';

/* ── Score utilities ───────────────────────────────────────────────── */
function scoreColor(s) {
  if (s < 40) return '#c0392b';
  if (s < 62) return '#d4a017';
  if (s < 80) return C.teal;
  return '#4a7c59';
}

function scoreLabel(s) {
  if (s < 40) return 'Needs Attention';
  if (s < 62) return 'Building Momentum';
  if (s < 80) return 'On Track';
  return 'Financially Strong';
}

function calculateHealthScore(a) {
  const accts = a.accounts || [];
  const ins   = a.insurance || [];

  const hasRet = accts.includes('401k') || accts.includes('ira');
  const ageMult = { 'under-25': 1.0, '25-34': 0.92, '35-44': 0.82, '45-54': 0.75, '55-64': 0.68, '65+': 0.6 };
  const retScore = Math.round((hasRet ? 28 : 6) * (ageMult[a.age] ?? 0.8));

  const debtMap = { none: 22, 'mortgage-only': 20, 'some-cc': 11, 'significant-cc': 3, 'student-loans': 13, multiple: 6 };
  const debtScore = debtMap[a.debt] ?? 10;

  let insScore = ins.includes('health') ? 9 : 0;
  insScore += ['auto', 'home', 'life'].filter(i => ins.includes(i)).length * 3;
  insScore += ['disability', 'ltc'].filter(i => ins.includes(i)).length * 1;
  insScore = Math.min(20, insScore);

  const estMap = { complete: 15, basic: 10, planning: 4, none: 0 };
  const estScore = estMap[a.estate] ?? 0;

  let acctScore = accts.includes('checking') ? 5 : 0;
  acctScore += accts.includes('brokerage') ? 5 : 0;
  acctScore += accts.includes('hsa') ? 3 : 0;
  acctScore += accts.includes('529') ? 2 : 0;
  acctScore = Math.min(15, acctScore);

  const score = Math.min(100, retScore + debtScore + insScore + estScore + acctScore);
  return {
    score,
    cats: {
      retirement: { score: retScore, max: 28, label: 'Retirement', icon: Clock,       path: 'investing' },
      debt:       { score: debtScore, max: 22, label: 'Debt',       icon: CreditCard,  path: 'debt-credit' },
      insurance:  { score: insScore,  max: 20, label: 'Insurance',  icon: Shield,      path: 'insurance' },
      estate:     { score: estScore,  max: 15, label: 'Estate',     icon: ScrollText,  path: 'estate' },
      accounts:   { score: acctScore, max: 15, label: 'Accounts',   icon: TrendingUp,  path: 'investing' },
    },
  };
}

function generateRoadmap(a, cats) {
  const items = [];
  if (cats.estate.score < 8)
    items.push({ priority: 'high', title: 'Create an estate plan', desc: "A basic will takes 1–2 hours and costs $100–400. It's one of the highest-impact actions you can take.", path: 'estate', section: 'Estate & Wills' });
  if (cats.insurance.score < 12)
    items.push({ priority: 'high', title: 'Review your insurance gaps', desc: 'Missing health, life, or disability coverage can derail your financial plan in an instant.', path: 'insurance', section: 'Insurance Planning' });
  if (cats.retirement.score < 18)
    items.push({ priority: 'medium', title: 'Boost retirement savings', desc: 'Open or increase contributions to a 401(k) or IRA to capture tax advantages and compound growth.', path: 'investing', section: 'Investing & Accounts' });
  if (cats.debt.score < 15)
    items.push({ priority: 'medium', title: 'Build a debt payoff plan', desc: 'Use the debt avalanche method to eliminate high-interest debt first and save thousands in interest.', path: 'debt-credit', section: 'Debt & Credit' });
  if (cats.accounts.score < 8)
    items.push({ priority: 'low', title: 'Diversify your accounts', desc: 'Consider opening a taxable brokerage or HSA to grow wealth outside retirement account limits.', path: 'investing', section: 'Investing & Accounts' });
  items.push({ priority: 'low', title: 'Build a solid budget foundation', desc: 'Review the 50/30/20 rule, calculate your savings rate, and set up an emergency fund.', path: 'budgeting', section: 'Budgeting & Foundations' });
  return items.slice(0, 4);
}

/* ── Health Score Gauge ─────────────────────────────────────────────── */
function HealthGauge({ score }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const duration = 1100;
    const animate = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * score));
      if (t < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [score]);

  const cx = 150, cy = 150, r = 110;
  const arcLen = Math.PI * r;
  const fill   = (display / 100) * arcLen;
  const ang = Math.PI * (1 - display / 100);
  const nx  = cx + r * Math.cos(ang);
  const ny  = cy - r * Math.sin(ang);
  const col = scoreColor(display);

  return (
    <div style={{ textAlign: 'center' }}>
      <svg viewBox="0 32 300 128" style={{ width: '100%', maxWidth: 280 }}>
        {/* Zone track backgrounds — dark adapted */}
        <path d="M 40 150 A 110 110 0 0 0 94 56"  fill="none" stroke="rgba(192,57,43,0.18)"  strokeWidth={14} strokeLinecap="round"/>
        <path d="M 94 56 A 110 110 0 0 0 206 55"  fill="none" stroke="rgba(212,160,23,0.18)" strokeWidth={14} strokeLinecap="round"/>
        <path d="M 206 55 A 110 110 0 0 0 260 150" fill="none" stroke="rgba(74,124,89,0.18)"  strokeWidth={14} strokeLinecap="round"/>
        {/* Track */}
        <path d="M 40 150 A 110 110 0 0 0 260 150" fill="none" stroke={C.b2} strokeWidth={14} strokeLinecap="round"/>
        {/* Score fill */}
        <path
          d="M 40 150 A 110 110 0 0 0 260 150"
          fill="none" stroke={col} strokeWidth={14} strokeLinecap="round"
          strokeDasharray={`${fill} ${arcLen}`} strokeDashoffset={0}
        />
        {/* Needle */}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={C.t2} strokeWidth={2.5} strokeLinecap="round"/>
        {/* Pivot */}
        <circle cx={cx} cy={cy} r={8} fill={C.raised} stroke={C.b2} strokeWidth={2}/>
        <circle cx={cx} cy={cy} r={3.5} fill={col}/>
        {/* Labels */}
        <text x="36"  y="148" textAnchor="middle" style={{ font: `600 9px ${UI}`, fill: C.t3 }}>0</text>
        <text x="264" y="148" textAnchor="middle" style={{ font: `600 9px ${UI}`, fill: C.t3 }}>100</text>
      </svg>

      <div style={{ marginTop: '-10px' }}>
        <div style={{
          fontFamily: MONO,
          fontSize: '3rem', fontWeight: 800,
          color: col, lineHeight: 1, letterSpacing: '-0.04em',
        }}>{display}</div>
        <div style={{ fontSize: '0.75rem', color: C.t3, fontFamily: UI, marginTop: 2 }}>out of 100</div>
        <div style={{
          fontFamily: DISPLAY, fontSize: '1rem', fontWeight: 600,
          color: col, marginTop: 6, letterSpacing: '-0.01em',
        }}>{scoreLabel(display)}</div>
      </div>
    </div>
  );
}

/* ── Category bar ─────────────────────────────────────────────────── */
function CatBar({ label, score, max, icon: Icon, path, navigate }) {
  const pct = Math.round((score / max) * 100);
  const col  = scoreColor(pct);
  return (
    <div
      onClick={() => navigate(`/fun/${path}`)}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.875rem',
        padding: '0.625rem 0.75rem',
        borderRadius: 9, cursor: 'pointer',
        transition: 'background 0.13s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(240,232,216,0.04)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{
        width: 32, height: 32,
        background: `${col}18`,
        border: `1px solid ${col}30`,
        borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={14} color={col}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: C.t1, fontFamily: UI }}>{label}</span>
          <span style={{ fontSize: '0.75rem', color: col, fontWeight: 700, fontFamily: MONO }}>{pct}%</span>
        </div>
        <div style={{ height: 4, background: C.b2, borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: col, borderRadius: 99,
            transition: 'width 0.8s ease',
          }}/>
        </div>
      </div>
      <ChevronRight size={12} color={C.t3}/>
    </div>
  );
}

/* ── Roadmap card ─────────────────────────────────────────────────── */
function RoadmapCard({ item, navigate }) {
  const priorityCol = item.priority === 'high' ? '#c0392b' : item.priority === 'medium' ? '#d4a017' : C.t3;
  const priorityDim = item.priority === 'high' ? 'rgba(192,57,43,0.1)' : item.priority === 'medium' ? 'rgba(212,160,23,0.1)' : 'rgba(107,85,64,0.1)';

  return (
    <div
      onClick={() => navigate(`/fun/${item.path}`)}
      style={{
        background: C.raised,
        border: `1px solid ${C.b2}`,
        borderRadius: 12, padding: '1rem 1.125rem',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
        display: 'flex', gap: '0.875rem', alignItems: 'flex-start',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = C.tealBdr}
      onMouseLeave={e => e.currentTarget.style.borderColor = C.b2}
    >
      <div style={{
        padding: '3px 8px',
        background: priorityDim,
        border: `1px solid ${priorityCol}30`,
        borderRadius: 6,
        fontSize: '0.5625rem', fontWeight: 700,
        color: priorityCol, letterSpacing: '0.07em',
        textTransform: 'uppercase', flexShrink: 0,
        marginTop: 2, fontFamily: UI, whiteSpace: 'nowrap',
      }}>
        {item.priority === 'high' ? 'High' : item.priority === 'medium' ? 'Medium' : 'Low'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: UI, fontSize: '0.875rem', fontWeight: 700,
          color: C.t1, marginBottom: 4,
        }}>{item.title}</div>
        <div style={{ fontSize: '0.8rem', color: C.t2, lineHeight: 1.65, fontFamily: UI }}>
          {item.desc}
        </div>
        <div style={{
          marginTop: 8, fontSize: '0.75rem', color: C.teal, fontWeight: 600,
          fontFamily: UI, display: 'flex', alignItems: 'center', gap: 4,
        }}>
          Go to {item.section} <ArrowRight size={11}/>
        </div>
      </div>
    </div>
  );
}

/* ── Onboarding wizard ────────────────────────────────────────────── */
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
      { v: 'under-30k', l: 'Under $30,000' },
      { v: '30-60k',    l: '$30,000 – $60,000' },
      { v: '60-100k',   l: '$60,000 – $100,000' },
      { v: '100-150k',  l: '$100,000 – $150,000' },
      { v: '150-300k',  l: '$150,000 – $300,000' },
      { v: '300k+',     l: '$300,000+' },
    ],
  },
  {
    id: 'accounts', q: 'Which accounts do you currently have?',
    sub: "Check all that apply. Don't worry if you're just starting out.",
    type: 'multi',
    options: [
      { v: 'checking',  l: 'Checking & Savings Account' },
      { v: '401k',      l: '401(k) or employer retirement plan' },
      { v: 'ira',       l: 'IRA (Traditional or Roth)' },
      { v: 'brokerage', l: 'Taxable Brokerage Account' },
      { v: 'hsa',       l: 'Health Savings Account (HSA)' },
      { v: '529',       l: '529 College Savings Plan' },
    ],
  },
  {
    id: 'debt', q: 'Your current debt situation?',
    sub: "Be honest — this stays private and shapes your action plan.",
    type: 'single',
    options: [
      { v: 'none',           l: 'Debt-free',                     d: 'No significant outstanding debt' },
      { v: 'mortgage-only',  l: 'Mortgage only',                 d: 'No consumer debt beyond a home loan' },
      { v: 'some-cc',        l: 'Some credit card debt',         d: "Manageable balances I'm working on" },
      { v: 'significant-cc', l: 'Significant credit card debt',  d: 'High balances at high interest rates' },
      { v: 'student-loans',  l: 'Student loan debt',             d: 'Federal or private student loans' },
      { v: 'multiple',       l: 'Multiple types of debt',        d: 'Credit cards, loans, and more' },
    ],
  },
  {
    id: 'insurance', q: 'Which insurance policies do you have?',
    sub: 'Check all that apply.',
    type: 'multi',
    options: [
      { v: 'health',     l: 'Health Insurance' },
      { v: 'life',       l: 'Life Insurance' },
      { v: 'auto',       l: 'Auto Insurance' },
      { v: 'home',       l: 'Homeowners or Renters Insurance' },
      { v: 'disability', l: 'Disability Insurance' },
      { v: 'ltc',        l: 'Long-Term Care Insurance' },
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
];

function Onboarding({ onComplete }) {
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState({});
  const [multiSel, setMulti]  = useState([]);
  const [exiting, setExiting] = useState(false);

  const current = STEPS[step];
  const total   = STEPS.length;

  function advance(newAnswers) {
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      if (step + 1 < total) { setStep(step + 1); setMulti([]); }
      else { onComplete(newAnswers); }
    }, 220);
  }

  function pickSingle(v) {
    const updated = { ...answers, [current.id]: v };
    setAnswers(updated);
    advance(updated);
  }

  function toggleMulti(v) {
    setMulti(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  }

  function submitMulti() {
    const updated = { ...answers, [current.id]: multiSel };
    setAnswers(updated);
    advance(updated);
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1.5rem',
      fontFamily: UI,
      background: C.bg,
    }}>
      {/* Header logo */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{
          fontFamily: DISPLAY, fontSize: '1.25rem', fontWeight: 700,
          color: C.teal, letterSpacing: '-0.01em',
        }}>FUN</div>
        <div style={{ fontSize: 9, color: C.t3, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 }}>
          Financial Understanding Network
        </div>
      </div>

      {/* Progress */}
      <div style={{ width: '100%', maxWidth: 520, marginBottom: '2.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: '0.75rem', color: C.t3, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Step {step + 1} of {total}
          </span>
          <span style={{ fontSize: '0.75rem', color: C.teal, fontWeight: 700, fontFamily: MONO }}>
            {Math.round(((step + 1) / total) * 100)}%
          </span>
        </div>
        <div style={{ height: 3, background: C.b2, borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${((step + 1) / total) * 100}%`,
            background: C.teal, borderRadius: 99,
            transition: 'width 0.35s ease',
          }}/>
        </div>
      </div>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 520,
        background: C.surface,
        border: `1px solid ${C.b1}`,
        borderRadius: 20,
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        padding: '2.25rem',
        opacity: exiting ? 0 : 1,
        transform: exiting ? 'translateY(10px)' : 'translateY(0)',
        transition: 'opacity 0.18s ease, transform 0.18s ease',
      }}>
        {/* Teal accent stripe */}
        <div style={{ height: 1, background: `linear-gradient(90deg, ${C.teal} 0%, rgba(0,180,198,0.15) 55%, transparent 100%)`, marginBottom: '1.5rem', marginLeft: '-2.25rem', marginRight: '-2.25rem', marginTop: '-2.25rem', borderRadius: '20px 20px 0 0' }} />

        <h2 style={{
          fontFamily: DISPLAY, fontSize: '1.5rem', fontWeight: 700,
          color: C.t1, margin: '0 0 0.5rem', lineHeight: 1.25, letterSpacing: '-0.02em',
        }}>{current.q}</h2>
        <p style={{ fontSize: '0.875rem', color: C.t2, margin: '0 0 1.75rem', lineHeight: 1.65, fontFamily: UI }}>
          {current.sub}
        </p>

        {/* Single select */}
        {current.type === 'single' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {current.options.map(opt => (
              <button
                key={opt.v}
                onClick={() => pickSingle(opt.v)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.875rem 1rem',
                  background: C.raised, border: `1px solid ${C.b2}`,
                  borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                  transition: 'border-color 0.13s, background 0.13s',
                  fontFamily: UI,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.tealBdr; e.currentTarget.style.background = 'rgba(0,180,198,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.b2; e.currentTarget.style.background = C.raised; }}
              >
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: C.t1 }}>{opt.l}</div>
                  {opt.d && <div style={{ fontSize: '0.75rem', color: C.t3, marginTop: 2 }}>{opt.d}</div>}
                </div>
                <ChevronRight size={14} color={C.t3}/>
              </button>
            ))}
          </div>
        )}

        {/* Multi select */}
        {current.type === 'multi' && (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {current.options.map(opt => {
                const sel = multiSel.includes(opt.v);
                return (
                  <button
                    key={opt.v}
                    onClick={() => toggleMulti(opt.v)}
                    style={{
                      padding: '0.5rem 0.875rem',
                      background: sel ? C.tealDim : C.raised,
                      border: `1px solid ${sel ? C.teal : C.b2}`,
                      borderRadius: 100, cursor: 'pointer',
                      fontSize: '0.8125rem', fontWeight: sel ? 600 : 400,
                      color: sel ? C.teal : C.t2,
                      transition: 'all 0.13s', fontFamily: UI,
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    {sel && <CheckCircle2 size={12} color={C.teal}/>}
                    {opt.l}
                  </button>
                );
              })}
            </div>
            <button
              onClick={submitMulti}
              style={{
                width: '100%', padding: '0.875rem',
                background: C.teal, color: '#1a1410',
                border: 'none', borderRadius: 10, cursor: 'pointer',
                fontSize: '0.9375rem', fontWeight: 700, fontFamily: UI,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.87'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {multiSel.length === 0 ? 'None of these — continue' : `Continue with ${multiSel.length} selected`}
              <ChevronRight size={16}/>
            </button>
          </>
        )}
      </div>

      {step > 0 && (
        <button
          onClick={() => { setStep(s => s - 1); setMulti([]); }}
          style={{
            marginTop: '1.25rem', background: 'none', border: 'none',
            cursor: 'pointer', fontSize: '0.8125rem', color: C.t3, fontFamily: UI,
          }}
        >
          Back
        </button>
      )}
    </div>
  );
}

/* ── Dashboard ─────────────────────────────────────────────────────── */
function Dashboard({ answers, onReset }) {
  const navigate = useNavigate();
  const { score, cats } = calculateHealthScore(answers);
  const roadmap  = generateRoadmap(answers, cats);
  const col      = scoreColor(score);
  const ageLabels = { 'under-25':'Under 25','25-34':'25–34','35-44':'35–44','45-54':'45–54','55-64':'55–64','65+':'65+' };

  const sections = [
    { path:'budgeting',       label:'Budgeting',     icon: Wallet     },
    { path:'debt-credit',     label:'Debt & Credit', icon: CreditCard },
    { path:'investing',       label:'Investing',     icon: TrendingUp },
    { path:'insurance',       label:'Insurance',     icon: Shield     },
    { path:'estate',          label:'Estate & Wills',icon: ScrollText },
    { path:'retirement',      label:'Retirement',    icon: Clock      },
  ];

  return (
    <div style={{ padding: '2rem 2rem 3rem', fontFamily: UI, maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: C.t3, marginBottom: 8, fontFamily: UI,
          }}>
            Financial Understanding Network
          </div>
          <h1 style={{
            fontFamily: DISPLAY, fontSize: '1.875rem', fontWeight: 700,
            color: C.t1, margin: '0 0 0.25rem', letterSpacing: '-0.025em',
          }}>
            Your Financial Health{' '}
            <em style={{ fontStyle: 'italic', color: C.teal }}>Dashboard</em>
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: C.t2, fontFamily: UI }}>
            Based on your profile · Age {ageLabels[answers.age] || '—'} · Click any category to explore
          </p>
        </div>
        <button
          onClick={onReset}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', background: 'none',
            border: `1px solid ${C.b2}`, borderRadius: 8,
            cursor: 'pointer', fontSize: '0.8rem', color: C.t3, fontFamily: UI,
            transition: 'border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.b1; e.currentTarget.style.color = C.t2; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.b2; e.currentTarget.style.color = C.t3; }}
        >
          <RotateCcw size={12}/> Retake assessment
        </button>
      </div>

      {/* Main grid */}
      <div className="fun-main-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(260px,320px) 1fr', gap: '1.25rem', alignItems: 'start' }}>

        {/* Left — gauge card */}
        <div style={{
          background: C.surface, border: `1px solid ${C.b1}`,
          borderRadius: 18, padding: '1.75rem 1.5rem 1.5rem',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
        }}>
          <div style={{ fontSize: '0.625rem', fontWeight: 700, color: C.t3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '1rem', fontFamily: UI }}>
            Financial Health Score
          </div>
          <HealthGauge score={score}/>

          {/* Interpretation */}
          <div style={{
            marginTop: '1.5rem', padding: '0.875rem',
            background: `${col}0c`, border: `1px solid ${col}28`,
            borderRadius: 10, fontSize: '0.8rem', color: C.t2,
            lineHeight: 1.7, fontFamily: UI,
          }}>
            {score < 40 && "Your score suggests several high-priority gaps. Start with estate planning and insurance coverage — both have outsized impact."}
            {score >= 40 && score < 62 && "You're building a solid foundation. Focus on closing your insurance gaps and accelerating retirement contributions."}
            {score >= 62 && score < 80 && "You're on a strong trajectory. Fine-tuning your estate plan and investment diversification will push you to the next level."}
            {score >= 80 && "Excellent financial health. Your focus should shift to optimization — tax efficiency, wealth transfer, and long-term care planning."}
          </div>
        </div>

        {/* Right — categories + roadmap */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Category scores */}
          <div style={{
            background: C.surface, border: `1px solid ${C.b1}`,
            borderRadius: 18, padding: '1.25rem 0.75rem',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
          }}>
            <div style={{ fontSize: '0.625rem', fontWeight: 700, color: C.t3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.75rem', paddingLeft: '0.75rem', fontFamily: UI }}>
              Category Breakdown
            </div>
            {Object.values(cats).map(cat => (
              <CatBar key={cat.label} {...cat} navigate={navigate}/>
            ))}
          </div>

          {/* Action roadmap */}
          <div style={{
            background: C.surface, border: `1px solid ${C.b1}`,
            borderRadius: 18, padding: '1.25rem',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
          }}>
            <div style={{ fontSize: '0.625rem', fontWeight: 700, color: C.t3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '1rem', fontFamily: UI }}>
              Your Priority Roadmap
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {roadmap.map((item, i) => (
                <RoadmapCard key={i} item={item} navigate={navigate}/>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section explorer */}
      <div style={{ marginTop: '1.75rem' }}>
        <div style={{ fontSize: '0.625rem', fontWeight: 700, color: C.t3, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '1rem', fontFamily: UI }}>
          Explore All Sections
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))', gap: '0.75rem' }}>
          {sections.map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.path}
                onClick={() => navigate(`/fun/${s.path}`)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10,
                  padding: '1rem', background: C.surface,
                  border: `1px solid ${C.b1}`, borderRadius: 12,
                  cursor: 'pointer', textAlign: 'left', fontFamily: UI,
                  transition: 'border-color 0.15s, transform 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.tealBdr; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.b1; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{
                  width: 32, height: 32,
                  background: C.tealDim, border: `1px solid ${C.tealBdr}`,
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={15} color={C.teal}/>
                </div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: C.t1 }}>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p style={{
        marginTop: '2.5rem', fontSize: '0.6875rem', color: C.t3,
        textAlign: 'center', lineHeight: 1.6, fontFamily: UI,
      }}>
        For educational purposes only — not financial, investment, tax, or legal advice.
      </p>

      <style>{`
        @media (max-width: 700px) { .fun-main-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

/* ── Root export ─────────────────────────────────────────────────── */
export default function FunDashboard() {
  const [answers, setAnswers] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null; }
    catch { return null; }
  });

  function handleComplete(a) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
    setAnswers(a);
  }

  function handleReset() {
    localStorage.removeItem(STORAGE_KEY);
    setAnswers(null);
  }

  if (!answers) return <Onboarding onComplete={handleComplete}/>;
  return <Dashboard answers={answers} onReset={handleReset}/>;
}
