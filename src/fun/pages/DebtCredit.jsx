import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTip, ResponsiveContainer, Cell,
} from 'recharts';
import {
  BookOpen, Calculator, ExternalLink, ChevronRight, ArrowRight,
  Info, CheckCircle2, AlertCircle, Plus, Trash2, CreditCard,
  GraduationCap, TrendingDown, Award,
} from 'lucide-react';

const TEAL  = '#00B4C6';
const NAVY  = '#0A1F44';
const LIGHT = '#5BC8E2';
const BG    = '#F4F7FA';

/* ── Shared primitives ────────────────────────────────────────────── */
function fmt(n)  { return '$' + Math.round(Math.abs(n)).toLocaleString(); }
function fmtR(n) { return n.toFixed(2); }

function SectionCard({ title, subtitle, children }) {
  return (
    <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:16, padding:'1.5rem', boxShadow:'0 1px 6px rgba(0,0,0,0.05)', marginBottom:'1.25rem' }}>
      {(title || subtitle) && (
        <div style={{ marginBottom:'1.25rem' }}>
          {title && <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'1.25rem', fontWeight:700, color:NAVY, margin:'0 0 0.25rem', letterSpacing:'-0.02em' }}>{title}</h3>}
          {subtitle && <p style={{ margin:0, fontSize:'0.875rem', color:'#6b7280', lineHeight:1.65, fontFamily:"'DM Sans',sans-serif" }}>{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

function InfoBox({ children, color = TEAL }) {
  return (
    <div style={{ display:'flex', gap:10, padding:'0.75rem 0.875rem', background:`${color}0d`, border:`1px solid ${color}25`, borderRadius:10, marginTop:'0.875rem' }}>
      <Info size={14} color={color} style={{ flexShrink:0, marginTop:2 }}/>
      <p style={{ margin:0, fontSize:'0.8125rem', color:'#374151', lineHeight:1.7, fontFamily:"'DM Sans',sans-serif" }}>{children}</p>
    </div>
  );
}

function NumInput({ label, value, onChange, prefix='$', suffix, min=0, step=1, hint, small }) {
  return (
    <div style={{ marginBottom: small ? '0.5rem' : '1rem' }}>
      {label && <label style={{ display:'block', fontSize:'0.8125rem', fontWeight:600, color:NAVY, marginBottom:'0.375rem', fontFamily:"'DM Sans',sans-serif" }}>{label}</label>}
      <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
        {prefix && <span style={{ position:'absolute', left:10, color:'#9ca3af', fontSize:'0.875rem', pointerEvents:'none' }}>{prefix}</span>}
        <input
          type="number" value={value} min={min} step={step}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            width:'100%', padding:`${small?'5px':'9px'} ${suffix?'2.5rem':'0.75rem'} ${small?'5px':'9px'} ${prefix?'1.5rem':'0.75rem'}`,
            border:'1.5px solid #e5e7eb', borderRadius:9,
            fontSize: small ? '0.875rem' : '1rem',
            fontFamily:"'DM Sans',sans-serif", color:NAVY, fontWeight:600,
            background:'#fafafa', boxSizing:'border-box',
          }}
          onFocus={e => e.target.style.borderColor = TEAL}
          onBlur={e  => e.target.style.borderColor = '#e5e7eb'}
        />
        {suffix && <span style={{ position:'absolute', right:10, color:'#9ca3af', fontSize:'0.875rem', pointerEvents:'none' }}>{suffix}</span>}
      </div>
      {hint && <p style={{ margin:'0.25rem 0 0', fontSize:'0.75rem', color:'#9ca3af', fontFamily:"'DM Sans',sans-serif" }}>{hint}</p>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LEARN — FICO Score Breakdown
══════════════════════════════════════════════════════════════════ */
const FICO_FACTORS = [
  {
    label: 'Payment History',
    pct: 35,
    color: TEAL,
    desc: 'Whether you pay on time is the single biggest factor. Even one 30-day late payment can drop your score by 50–100 points. Set up autopay for at least the minimum on every account.',
    tip: 'A single missed payment can stay on your report for 7 years.',
  },
  {
    label: 'Amounts Owed (Utilization)',
    pct: 30,
    color: '#3b82f6',
    desc: 'Your credit utilization ratio — how much of your available credit you\'re using. Keep it below 30% for a good score, below 10% for an excellent score. This includes per-card ratios too.',
    tip: 'Paying down balances before the statement closing date (not just the due date) lowers reported utilization.',
  },
  {
    label: 'Length of Credit History',
    pct: 15,
    color: '#8b5cf6',
    desc: 'Longer history = higher score. FICO considers age of oldest account, newest account, and average age of all accounts. Avoid closing old cards — even unused ones.',
    tip: 'Keep your oldest credit card open even if you rarely use it. Use it for one small purchase per year.',
  },
  {
    label: 'Credit Mix',
    pct: 10,
    color: '#f59e0b',
    desc: 'Having both revolving credit (cards) and installment loans (mortgage, auto, student) shows you can manage different types of debt responsibly.',
    tip: 'Don\'t open new accounts just to diversify. The benefit is small and new accounts lower your average age.',
  },
  {
    label: 'New Credit (Inquiries)',
    pct: 10,
    color: '#ef4444',
    desc: 'Applying for new credit triggers a hard inquiry, which can lower your score by 5–10 points temporarily. Multiple mortgage/auto inquiries within 14–45 days count as one.',
    tip: 'Rate-shopping for mortgages or car loans within a short window is treated as a single inquiry.',
  },
];

const SCORE_RANGES = [
  { range:'300–579', label:'Poor',      color:'#ef4444' },
  { range:'580–669', label:'Fair',      color:'#f59e0b' },
  { range:'670–739', label:'Good',      color:LIGHT     },
  { range:'740–799', label:'Very Good', color:TEAL      },
  { range:'800–850', label:'Excellent', color:'#22c55e' },
];

function CreditScoreVisual() {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <p style={{ fontSize:'0.875rem', color:'#6b7280', marginBottom:'1.25rem', lineHeight:1.7, fontFamily:"'DM Sans',sans-serif" }}>
        Your <strong style={{ color:NAVY }}>FICO® Score</strong> (the most widely used credit score) is calculated from five factors. Each carries a different weight — knowing this lets you prioritize what to improve.
      </p>

      {/* Score range bar */}
      <div style={{ marginBottom:'1.5rem' }}>
        <div style={{ display:'flex', height:10, borderRadius:99, overflow:'hidden', marginBottom:6 }}>
          {SCORE_RANGES.map(s => <div key={s.label} style={{ flex:1, background:s.color }}/>)}
        </div>
        <div style={{ display:'flex' }}>
          {SCORE_RANGES.map(s => (
            <div key={s.label} style={{ flex:1, textAlign:'center' }}>
              <div style={{ fontSize:'0.6875rem', fontWeight:700, color:s.color, fontFamily:"'DM Sans',sans-serif" }}>{s.label}</div>
              <div style={{ fontSize:'0.625rem', color:'#9ca3af', fontFamily:"'DM Sans',sans-serif" }}>{s.range}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Factor bars */}
      <div style={{ display:'flex', flexDirection:'column', gap:'0.625rem' }}>
        {FICO_FACTORS.map((f, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{ width:'100%', background:'none', border:'none', cursor:'pointer', textAlign:'left', padding:0 }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:5 }}>
                <span style={{ fontSize:'0.875rem', fontWeight:600, color:NAVY, flex:1, fontFamily:"'DM Sans',sans-serif" }}>{f.label}</span>
                <span style={{ fontSize:'0.875rem', fontWeight:800, color:f.color, fontFamily:"'DM Sans',sans-serif", width:36, textAlign:'right' }}>{f.pct}%</span>
              </div>
              <div style={{ height:8, background:'#f0f0f0', borderRadius:99, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${f.pct / 35 * 100}%`, background:f.color, borderRadius:99, transition:'width 0.6s ease' }}/>
              </div>
            </button>
            {open === i && (
              <div style={{ marginTop:'0.5rem', padding:'0.75rem 0.875rem', background:`${f.color}08`, border:`1px solid ${f.color}20`, borderRadius:9 }}>
                <p style={{ margin:'0 0 0.5rem', fontSize:'0.8125rem', color:'#374151', lineHeight:1.7, fontFamily:"'DM Sans',sans-serif" }}>{f.desc}</p>
                <div style={{ display:'flex', gap:7, alignItems:'flex-start' }}>
                  <Award size={12} color={f.color} style={{ flexShrink:0, marginTop:2 }}/>
                  <p style={{ margin:0, fontSize:'0.775rem', color:'#4b5563', lineHeight:1.6, fontFamily:"'DM Sans',sans-serif" }}><strong>Pro tip:</strong> {f.tip}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <InfoBox>Click any factor above to expand details and improvement tips. Focus on Payment History and Utilization first — together they're 65% of your score.</InfoBox>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LEARN — Avalanche vs Snowball Explainer
══════════════════════════════════════════════════════════════════ */
const EXAMPLE_DEBTS = [
  { name: 'Credit Card A', balance: 2000, rate: 24 },
  { name: 'Credit Card B', balance: 5000, rate: 18 },
  { name: 'Student Loan',  balance: 1500, rate:  6 },
];

function MethodCard({ method, order, color, badge, tagline, pro, con }) {
  return (
    <div style={{ flex:1, border:`1.5px solid ${color}30`, borderRadius:14, overflow:'hidden' }}>
      <div style={{ padding:'0.875rem 1rem', background:`${color}0c`, borderBottom:`1px solid ${color}20` }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', fontWeight:700, color:NAVY }}>{method}</span>
          <span style={{ padding:'2px 10px', background:`${color}18`, border:`1px solid ${color}35`, borderRadius:100, fontSize:'0.6875rem', fontWeight:700, color, fontFamily:"'DM Sans',sans-serif" }}>{badge}</span>
        </div>
        <p style={{ margin:0, fontSize:'0.8125rem', color:'#6b7280', fontFamily:"'DM Sans',sans-serif" }}>{tagline}</p>
      </div>
      <div style={{ padding:'0.875rem 1rem' }}>
        <div style={{ fontSize:'0.75rem', fontWeight:700, color:'#9ca3af', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:'0.625rem', fontFamily:"'DM Sans',sans-serif" }}>Payment order</div>
        {order.map((d, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.625rem', marginBottom:'0.5rem' }}>
            <div style={{ width:22, height:22, borderRadius:'50%', background:color, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.6875rem', fontWeight:800, flexShrink:0, fontFamily:"'DM Sans',sans-serif" }}>{i+1}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'0.8125rem', fontWeight:600, color:NAVY, fontFamily:"'DM Sans',sans-serif" }}>{d.name}</div>
              <div style={{ fontSize:'0.75rem', color:'#9ca3af', fontFamily:"'DM Sans',sans-serif" }}>${d.balance.toLocaleString()} @ {d.rate}% APR</div>
            </div>
            {i === 0 && <span style={{ fontSize:'0.6875rem', fontWeight:700, color, background:`${color}15`, padding:'2px 7px', borderRadius:100, fontFamily:"'DM Sans',sans-serif" }}>First target</span>}
          </div>
        ))}
        <div style={{ borderTop:'1px solid #f0f0f0', marginTop:'0.75rem', paddingTop:'0.75rem', display:'flex', flexDirection:'column', gap:'0.375rem' }}>
          <div style={{ display:'flex', gap:7, alignItems:'flex-start' }}>
            <CheckCircle2 size={13} color='#22c55e' style={{ flexShrink:0, marginTop:1 }}/>
            <span style={{ fontSize:'0.8125rem', color:'#374151', fontFamily:"'DM Sans',sans-serif" }}>{pro}</span>
          </div>
          <div style={{ display:'flex', gap:7, alignItems:'flex-start' }}>
            <AlertCircle size={13} color='#f59e0b' style={{ flexShrink:0, marginTop:1 }}/>
            <span style={{ fontSize:'0.8125rem', color:'#374151', fontFamily:"'DM Sans',sans-serif" }}>{con}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AvalancheVsSnowball() {
  const snowballOrder  = [...EXAMPLE_DEBTS].sort((a, b) => a.balance - b.balance);
  const avalancheOrder = [...EXAMPLE_DEBTS].sort((a, b) => b.rate - a.rate);
  return (
    <div>
      <p style={{ fontSize:'0.875rem', color:'#6b7280', marginBottom:'1.25rem', lineHeight:1.7, fontFamily:"'DM Sans',sans-serif" }}>
        Both strategies use the same total monthly payment — the difference is <em>which debt you attack first</em>.
        Using the same three example debts below, see how the order changes depending on your goal.
      </p>
      <div style={{ display:'flex', gap:'0.875rem', flexWrap:'wrap' }}>
        <MethodCard
          method="Debt Snowball"
          order={snowballOrder}
          color="#8b5cf6"
          badge="Motivation-first"
          tagline="Target the lowest balance first — rack up quick wins."
          pro="Psychological momentum — you see debts disappear faster"
          con="Costs more in total interest — you may ignore high-rate debt longer"
        />
        <MethodCard
          method="Debt Avalanche"
          order={avalancheOrder}
          color={TEAL}
          badge="Math-optimal"
          tagline="Target the highest interest rate first — minimize total cost."
          pro="Minimizes total interest paid — the mathematically optimal method"
          con="Can feel slow if the high-rate debt has a large balance"
        />
      </div>
      <InfoBox>
        <strong>Bottom line:</strong> Avalanche saves more money. Snowball provides faster motivation.
        Research shows people who use snowball are more likely to stick with their payoff plan.
        Pick the method you'll actually follow through on — or use the calculator below to see the exact dollar difference for your situation.
      </InfoBox>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LEARN — Student Loan Explainer
══════════════════════════════════════════════════════════════════ */
function StudentLoans() {
  const [activeTab, setTab] = useState('types');
  const tabs = [
    { id:'types', label:'Federal vs Private' },
    { id:'ibr',   label:'Income-Driven Repayment' },
    { id:'pslf',  label:'PSLF' },
  ];

  return (
    <div>
      <div style={{ display:'flex', gap:0, borderBottom:'1px solid #e5e7eb', marginBottom:'1.25rem' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding:'0.5rem 1rem', background:'none', border:'none',
            borderBottom:`2px solid ${activeTab===t.id ? TEAL : 'transparent'}`,
            cursor:'pointer', fontSize:'0.8125rem', fontWeight:activeTab===t.id?700:500,
            color:activeTab===t.id ? TEAL : '#6b7280', fontFamily:"'DM Sans',sans-serif",
            transition:'color 0.13s', whiteSpace:'nowrap', marginBottom:-1,
          }}>{t.label}</button>
        ))}
      </div>

      {activeTab === 'types' && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.875rem', marginBottom:'1rem' }}>
            {[
              {
                title:'Federal Loans', color:TEAL,
                points:[
                  'Fixed interest rates set by Congress',
                  'Income-driven repayment (IDR) plans available',
                  'Access to PSLF and other forgiveness programs',
                  'Deferment and forbearance options',
                  'No credit check for most federal loans',
                  'Discharge options in extreme hardship cases',
                ],
              },
              {
                title:'Private Loans', color:'#ef4444',
                points:[
                  'Variable or fixed rates based on creditworthiness',
                  'No income-driven repayment options',
                  'No access to federal forgiveness programs',
                  'Limited hardship relief — depends on lender',
                  'Credit check required; may need a cosigner',
                  'Refinancing can lower rates but loses federal benefits',
                ],
              },
            ].map(s => (
              <div key={s.title} style={{ border:`1.5px solid ${s.color}25`, borderRadius:12, overflow:'hidden' }}>
                <div style={{ padding:'0.75rem 0.875rem', background:`${s.color}0c`, borderBottom:`1px solid ${s.color}18` }}>
                  <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'0.9375rem', fontWeight:700, color:NAVY }}>{s.title}</span>
                </div>
                <div style={{ padding:'0.625rem 0.875rem' }}>
                  {s.points.map((p, i) => (
                    <div key={i} style={{ display:'flex', gap:7, alignItems:'flex-start', marginBottom:'0.4rem' }}>
                      <div style={{ width:6, height:6, borderRadius:'50%', background:s.color, flexShrink:0, marginTop:5 }}/>
                      <span style={{ fontSize:'0.8125rem', color:'#374151', lineHeight:1.6, fontFamily:"'DM Sans',sans-serif" }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <InfoBox color="#f59e0b">Never refinance federal loans into private loans unless you're certain you won't need IDR, PSLF, or any federal protections. You can't convert them back.</InfoBox>
        </div>
      )}

      {activeTab === 'ibr' && (
        <div>
          <p style={{ fontSize:'0.875rem', color:'#6b7280', marginBottom:'1rem', lineHeight:1.7, fontFamily:"'DM Sans',sans-serif" }}>
            Income-Driven Repayment plans cap your monthly payment as a percentage of discretionary income and forgive remaining balances after 20–25 years.
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            {[
              { name:'SAVE (Saving on a Valuable Education)', pct:'5–10%', forgive:'20–25 years', note:'Newest plan. Unpaid interest doesn\'t capitalize. Best for most borrowers.' },
              { name:'PAYE (Pay As You Earn)', pct:'10%', forgive:'20 years', note:'Must be a new borrower after Oct 2007 and have received a disbursement after Oct 2011.' },
              { name:'IBR (Income-Based Repayment)', pct:'10–15%', forgive:'20–25 years', note:'Available to almost all federal borrowers. 10% if new borrower, 15% if older loans.' },
              { name:'ICR (Income-Contingent Repayment)', pct:'20%', forgive:'25 years', note:'The original IDR plan. Less favorable but available for Parent PLUS loans after consolidation.' },
            ].map((p, i) => (
              <div key={i} style={{ padding:'0.875rem 1rem', background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:10 }}>
                <div style={{ fontWeight:700, color:NAVY, fontSize:'0.875rem', marginBottom:6, fontFamily:"'DM Sans',sans-serif" }}>{p.name}</div>
                <div style={{ display:'grid', gridTemplateColumns:'auto auto 1fr', gap:'0.25rem 1rem', fontSize:'0.8125rem', fontFamily:"'DM Sans',sans-serif" }}>
                  <span style={{ color:'#9ca3af' }}>Payment cap</span><span style={{ fontWeight:600, color:TEAL }}>{p.pct} of discretionary income</span><span/>
                  <span style={{ color:'#9ca3af' }}>Forgiveness</span><span style={{ fontWeight:600, color:NAVY }}>{p.forgive}</span><span/>
                </div>
                <p style={{ margin:'0.5rem 0 0', fontSize:'0.775rem', color:'#6b7280', lineHeight:1.6, fontFamily:"'DM Sans',sans-serif" }}>{p.note}</p>
              </div>
            ))}
          </div>
          <InfoBox>Forgiveness under IDR plans (other than PSLF) is currently taxable as income. Plan ahead — you may owe a large tax bill in the forgiveness year.</InfoBox>
        </div>
      )}

      {activeTab === 'pslf' && (
        <div>
          <p style={{ fontSize:'0.875rem', color:'#6b7280', marginBottom:'1rem', lineHeight:1.7, fontFamily:"'DM Sans',sans-serif" }}>
            <strong style={{ color:NAVY }}>Public Service Loan Forgiveness (PSLF)</strong> forgives remaining federal loan balances after 10 years (120 payments) of qualifying employment and payments. Unlike IDR forgiveness, PSLF is <strong>tax-free</strong>.
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.625rem', marginBottom:'1rem' }}>
            {[
              { title:'Qualifying Employer', detail:'Government (federal, state, local), 501(c)(3) nonprofits, and some other public service organizations.' },
              { title:'Qualifying Loans', detail:'Direct Loans only. FFEL or Perkins loans must be consolidated into a Direct Consolidation Loan first.' },
              { title:'Qualifying Repayment Plan', detail:'Must be on an income-driven repayment plan or the 10-year Standard Repayment Plan.' },
              { title:'120 Qualifying Payments', detail:'Must make 120 on-time, full monthly payments. Payments don\'t need to be consecutive.' },
              { title:'Employment Certification', detail:'Submit the Employment Certification Form (ECF) annually — don\'t wait until 120 payments.' },
            ].map((r, i) => (
              <div key={i} style={{ display:'flex', gap:'0.75rem', alignItems:'flex-start', padding:'0.625rem 0.875rem', background:'rgba(0,180,198,0.05)', borderRadius:9, border:'1px solid rgba(0,180,198,0.15)' }}>
                <CheckCircle2 size={15} color={TEAL} style={{ flexShrink:0, marginTop:1 }}/>
                <div>
                  <div style={{ fontSize:'0.875rem', fontWeight:700, color:NAVY, marginBottom:2, fontFamily:"'DM Sans',sans-serif" }}>{r.title}</div>
                  <div style={{ fontSize:'0.8125rem', color:'#4b5563', lineHeight:1.6, fontFamily:"'DM Sans',sans-serif" }}>{r.detail}</div>
                </div>
              </div>
            ))}
          </div>
          <InfoBox color="#22c55e">PSLF is one of the most powerful financial tools available to public servants. A doctor, teacher, or social worker with $200,000 in debt can have it entirely forgiven tax-free after 10 years of qualifying payments.</InfoBox>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CALCULATE — Debt Payoff Calculator
══════════════════════════════════════════════════════════════════ */
function runPayoff(debts, extraMonthly, method) {
  if (!debts.length || debts.every(d => d.balance <= 0)) return { months:0, totalInterest:0 };
  const totalMin   = debts.reduce((s, d) => s + d.minPayment, 0);
  const monthlyBudget = totalMin + extraMonthly;
  let rem = debts.map(d => ({ ...d, balance: d.balance }));
  let month = 0, totalInterest = 0;
  const MAX = 600;
  while (rem.some(d => d.balance > 0.01) && month < MAX) {
    month++;
    // Apply interest
    rem.forEach(d => {
      if (d.balance > 0.01) {
        const int = d.balance * (d.rate / 100 / 12);
        d.balance += int;
        totalInterest += int;
      }
    });
    // Pay all minimums first
    let leftover = monthlyBudget;
    rem.forEach(d => {
      if (d.balance > 0.01) {
        const pay = Math.min(d.minPayment, d.balance);
        d.balance -= pay;
        leftover  -= pay;
        if (d.balance < 0.01) d.balance = 0;
      }
    });
    // Apply extra to target
    const active = rem.filter(d => d.balance > 0.01);
    if (active.length && leftover > 0) {
      const target = method === 'avalanche'
        ? active.slice().sort((a,b) => b.rate - a.rate)[0]
        : active.slice().sort((a,b) => a.balance - b.balance)[0];
      const extra = Math.min(leftover, target.balance);
      target.balance -= extra;
      if (target.balance < 0.01) target.balance = 0;
    }
  }
  return { months: month, totalInterest: Math.round(totalInterest) };
}

const DEFAULT_DEBTS = [
  { id:1, name:'Credit Card A', balance:3500, rate:24.99, minPayment:70  },
  { id:2, name:'Student Loan',  balance:12000, rate:6.5,  minPayment:130 },
  { id:3, name:'Car Loan',      balance:8000,  rate:7.9,  minPayment:180 },
];

let nextId = 10;

function DebtPayoffCalc() {
  const [debts, setDebts]   = useState(DEFAULT_DEBTS);
  const [extra, setExtra]   = useState(100);

  const addDebt = () => {
    setDebts(prev => [...prev, { id: nextId++, name:`Debt ${prev.length+1}`, balance:1000, rate:10, minPayment:25 }]);
  };
  const removeDebt = id => setDebts(prev => prev.filter(d => d.id !== id));
  const updateDebt = (id, field, val) => setDebts(prev => prev.map(d => d.id === id ? { ...d, [field]: val } : d));

  const snowball  = runPayoff(debts, extra, 'snowball');
  const avalanche = runPayoff(debts, extra, 'avalanche');
  const saved     = snowball.totalInterest - avalanche.totalInterest;
  const monthSaved = snowball.months - avalanche.months;

  const chartData = [
    { name:'Snowball',  interest: snowball.totalInterest,  months: snowball.months  },
    { name:'Avalanche', interest: avalanche.totalInterest, months: avalanche.months },
  ];

  return (
    <div>
      {/* Debt list */}
      <div style={{ marginBottom:'1rem' }}>
        <div style={{ fontSize:'0.8125rem', fontWeight:700, color:NAVY, marginBottom:'0.625rem', fontFamily:"'DM Sans',sans-serif" }}>Your Debts</div>
        {debts.map(d => (
          <div key={d.id} style={{ display:'grid', gridTemplateColumns:'1.5fr 90px 80px 90px 32px', gap:'0.5rem', alignItems:'end', marginBottom:'0.625rem' }}>
            <div>
              <label style={{ display:'block', fontSize:'0.6875rem', color:'#9ca3af', fontWeight:600, marginBottom:3, fontFamily:"'DM Sans',sans-serif" }}>Name</label>
              <input
                value={d.name}
                onChange={e => updateDebt(d.id,'name',e.target.value)}
                style={{ width:'100%', padding:'6px 8px', border:'1.5px solid #e5e7eb', borderRadius:8, fontSize:'0.8125rem', color:NAVY, fontFamily:"'DM Sans',sans-serif", background:'#fafafa', boxSizing:'border-box' }}
                onFocus={e => e.target.style.borderColor = TEAL}
                onBlur={e  => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            <div>
              <label style={{ display:'block', fontSize:'0.6875rem', color:'#9ca3af', fontWeight:600, marginBottom:3, fontFamily:"'DM Sans',sans-serif" }}>Balance</label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:7, top:'50%', transform:'translateY(-50%)', color:'#9ca3af', fontSize:'0.8125rem' }}>$</span>
                <input type="number" min={0} value={d.balance} onChange={e => updateDebt(d.id,'balance',Number(e.target.value))}
                  style={{ width:'100%', padding:'6px 6px 6px 18px', border:'1.5px solid #e5e7eb', borderRadius:8, fontSize:'0.8125rem', color:NAVY, fontFamily:"'DM Sans',sans-serif", background:'#fafafa', boxSizing:'border-box' }}
                  onFocus={e => e.target.style.borderColor = TEAL} onBlur={e => e.target.style.borderColor = '#e5e7eb'}/>
              </div>
            </div>
            <div>
              <label style={{ display:'block', fontSize:'0.6875rem', color:'#9ca3af', fontWeight:600, marginBottom:3, fontFamily:"'DM Sans',sans-serif" }}>APR %</label>
              <div style={{ position:'relative' }}>
                <input type="number" min={0} step={0.1} value={d.rate} onChange={e => updateDebt(d.id,'rate',Number(e.target.value))}
                  style={{ width:'100%', padding:'6px 20px 6px 8px', border:'1.5px solid #e5e7eb', borderRadius:8, fontSize:'0.8125rem', color:NAVY, fontFamily:"'DM Sans',sans-serif", background:'#fafafa', boxSizing:'border-box' }}
                  onFocus={e => e.target.style.borderColor = TEAL} onBlur={e => e.target.style.borderColor = '#e5e7eb'}/>
                <span style={{ position:'absolute', right:7, top:'50%', transform:'translateY(-50%)', color:'#9ca3af', fontSize:'0.8125rem' }}>%</span>
              </div>
            </div>
            <div>
              <label style={{ display:'block', fontSize:'0.6875rem', color:'#9ca3af', fontWeight:600, marginBottom:3, fontFamily:"'DM Sans',sans-serif" }}>Min. Payment</label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:7, top:'50%', transform:'translateY(-50%)', color:'#9ca3af', fontSize:'0.8125rem' }}>$</span>
                <input type="number" min={0} value={d.minPayment} onChange={e => updateDebt(d.id,'minPayment',Number(e.target.value))}
                  style={{ width:'100%', padding:'6px 6px 6px 18px', border:'1.5px solid #e5e7eb', borderRadius:8, fontSize:'0.8125rem', color:NAVY, fontFamily:"'DM Sans',sans-serif", background:'#fafafa', boxSizing:'border-box' }}
                  onFocus={e => e.target.style.borderColor = TEAL} onBlur={e => e.target.style.borderColor = '#e5e7eb'}/>
              </div>
            </div>
            <button onClick={() => removeDebt(d.id)} disabled={debts.length <= 1}
              style={{ height:32, width:32, border:'1px solid #fee2e2', borderRadius:8, background:'#fff', cursor:debts.length>1?'pointer':'default', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:1 }}>
              <Trash2 size={13} color={debts.length>1?'#ef4444':'#d1d5db'}/>
            </button>
          </div>
        ))}
        {debts.length < 8 && (
          <button onClick={addDebt} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 14px', background:'none', border:`1.5px dashed ${TEAL}50`, borderRadius:9, cursor:'pointer', fontSize:'0.8125rem', color:TEAL, fontWeight:600, fontFamily:"'DM Sans',sans-serif" }}>
            <Plus size={13}/> Add another debt
          </button>
        )}
      </div>

      <NumInput label="Extra Monthly Payment (above minimums)" value={extra} onChange={setExtra} min={0} step={25} hint="Even $50 extra per month makes a significant difference"/>

      {/* Results */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'1rem' }}>
        {[
          { label:'Snowball', data:snowball, color:'#8b5cf6', sub:'Lowest balance first' },
          { label:'Avalanche', data:avalanche, color:TEAL, sub:'Highest rate first' },
        ].map(m => (
          <div key={m.label} style={{ background:'#fff', border:`1.5px solid ${m.color}25`, borderRadius:12, padding:'1rem', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize:'0.75rem', fontWeight:700, color:m.color, textTransform:'uppercase', letterSpacing:'0.06em', fontFamily:"'DM Sans',sans-serif", marginBottom:3 }}>{m.label}</div>
            <div style={{ fontSize:'0.75rem', color:'#9ca3af', fontFamily:"'DM Sans',sans-serif", marginBottom:'0.75rem' }}>{m.sub}</div>
            <div style={{ marginBottom:'0.5rem' }}>
              <div style={{ fontSize:'0.6875rem', color:'#9ca3af', fontFamily:"'DM Sans',sans-serif" }}>Payoff time</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.375rem', fontWeight:700, color:NAVY }}>{m.data.months} months <span style={{ fontSize:'0.875rem', color:'#9ca3af', fontWeight:400 }}>({(m.data.months/12).toFixed(1)} yrs)</span></div>
            </div>
            <div>
              <div style={{ fontSize:'0.6875rem', color:'#9ca3af', fontFamily:"'DM Sans',sans-serif" }}>Total interest paid</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.375rem', fontWeight:700, color:m.color }}>{fmt(m.data.totalInterest)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Interest comparison chart */}
      <div style={{ height:180, marginBottom:'0.875rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={48}>
            <XAxis dataKey="name" tick={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fill:'#6b7280' }} axisLine={false} tickLine={false}/>
            <YAxis hide/>
            <RechartsTip
              formatter={(v) => [`$${Math.round(v).toLocaleString()}`, 'Total Interest']}
              contentStyle={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, borderRadius:8, border:'1px solid #e5e7eb' }}
            />
            <Bar dataKey="interest" radius={[6,6,0,0]}>
              <Cell fill="#8b5cf6"/>
              <Cell fill={TEAL}/>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {saved > 0 && (
        <div style={{ padding:'1rem 1.125rem', background:'rgba(0,180,198,0.07)', border:'1.5px solid rgba(0,180,198,0.2)', borderRadius:12, display:'flex', gap:'1.25rem', flexWrap:'wrap', alignItems:'center', justifyContent:'center' }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', fontWeight:700, color:TEAL }}>{fmt(saved)}</div>
            <div style={{ fontSize:'0.75rem', color:'#6b7280', fontFamily:"'DM Sans',sans-serif" }}>saved using Avalanche vs Snowball</div>
          </div>
          {monthSaved > 0 && (
            <div style={{ textAlign:'center' }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', fontWeight:700, color:NAVY }}>{monthSaved} mo</div>
              <div style={{ fontSize:'0.75rem', color:'#6b7280', fontFamily:"'DM Sans',sans-serif" }}>faster debt-free with Avalanche</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CALCULATE — Credit Card Interest Calculator
══════════════════════════════════════════════════════════════════ */
function CreditCardCalc() {
  const [balance,  setBalance]  = useState(3000);
  const [apr,      setApr]      = useState(24.99);
  const [payment,  setPayment]  = useState(100);

  const monthlyRate = apr / 100 / 12;
  const minPay = Math.max(balance * 0.02, 25); // typical minimum (2% of balance)

  function calcPayoff(bal, rate, pay) {
    if (pay <= bal * rate) return { months: Infinity, interest: Infinity }; // never pays off
    let b = bal, interest = 0, months = 0;
    while (b > 0.01 && months < 600) {
      const int = b * rate;
      b += int;
      interest += int;
      b -= Math.min(pay, b);
      months++;
    }
    return { months, interest: Math.round(interest) };
  }

  const withPayment = calcPayoff(balance, monthlyRate, payment);
  const withMin     = calcPayoff(balance, monthlyRate, minPay);

  const payable  = withPayment.months < 600;
  const interestSaved = payable && withMin.months < 600 ? withMin.interest - withPayment.interest : null;

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 1rem' }}>
        <NumInput label="Current Balance" value={balance} onChange={setBalance} min={0} step={100}/>
        <NumInput label="Annual Interest Rate (APR)" value={apr} onChange={setApr} min={0} step={0.1} prefix="" suffix="%"/>
      </div>

      <div style={{ marginBottom:'1.25rem' }}>
        <label style={{ display:'block', fontSize:'0.8125rem', fontWeight:600, color:NAVY, marginBottom:'0.375rem', fontFamily:"'DM Sans',sans-serif" }}>
          Monthly Payment — <span style={{ color:TEAL }}>{fmt(payment)}/mo</span>
          <span style={{ fontWeight:400, color:'#9ca3af', fontSize:'0.75rem', marginLeft:8 }}>minimum ≈ {fmt(minPay)}/mo</span>
        </label>
        <input type="range" min={Math.ceil(minPay)} max={Math.max(balance, payment*2)} step={5} value={payment}
          onChange={e => setPayment(Number(e.target.value))}
          style={{ width:'100%', accentColor:TEAL, cursor:'pointer' }}/>
      </div>

      {!payable ? (
        <div style={{ padding:'0.875rem 1rem', background:'#fef2f2', border:'1px solid #fee2e2', borderRadius:10, display:'flex', gap:8 }}>
          <AlertCircle size={15} color="#ef4444" style={{ flexShrink:0, marginTop:1 }}/>
          <p style={{ margin:0, fontSize:'0.8125rem', color:'#991b1b', lineHeight:1.65, fontFamily:"'DM Sans',sans-serif" }}>
            At {fmt(payment)}/month, you'll <strong>never pay off this balance</strong> — the interest each month exceeds your payment. Increase your payment to at least {fmt(Math.ceil(balance * monthlyRate) + 1)}/mo to make progress.
          </p>
        </div>
      ) : (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.625rem', marginBottom:'0.875rem' }}>
            <div style={{ textAlign:'center', padding:'0.875rem 0.5rem', background:'rgba(0,180,198,0.07)', border:'1px solid rgba(0,180,198,0.18)', borderRadius:11 }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.375rem', fontWeight:700, color:TEAL }}>{withPayment.months}</div>
              <div style={{ fontSize:'0.75rem', color:'#6b7280', fontFamily:"'DM Sans',sans-serif" }}>months to payoff</div>
            </div>
            <div style={{ textAlign:'center', padding:'0.875rem 0.5rem', background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.18)', borderRadius:11 }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.375rem', fontWeight:700, color:'#ef4444' }}>{fmt(withPayment.interest)}</div>
              <div style={{ fontSize:'0.75rem', color:'#6b7280', fontFamily:"'DM Sans',sans-serif" }}>total interest</div>
            </div>
            <div style={{ textAlign:'center', padding:'0.875rem 0.5rem', background:'rgba(10,31,68,0.05)', border:'1px solid rgba(10,31,68,0.12)', borderRadius:11 }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.375rem', fontWeight:700, color:NAVY }}>{fmt(balance + withPayment.interest)}</div>
              <div style={{ fontSize:'0.75rem', color:'#6b7280', fontFamily:"'DM Sans',sans-serif" }}>total paid</div>
            </div>
          </div>

          {interestSaved !== null && interestSaved > 0 && (
            <div style={{ padding:'0.75rem 0.875rem', background:'rgba(34,197,94,0.07)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:10, display:'flex', gap:8, alignItems:'flex-start' }}>
              <CheckCircle2 size={14} color="#22c55e" style={{ flexShrink:0, marginTop:1 }}/>
              <p style={{ margin:0, fontSize:'0.8125rem', color:'#374151', lineHeight:1.65, fontFamily:"'DM Sans',sans-serif" }}>
                By paying <strong>{fmt(payment)}/mo</strong> instead of the minimum (<strong>{fmt(minPay)}/mo</strong>), you save <strong style={{ color:'#22c55e' }}>{fmt(interestSaved)}</strong> in interest and pay off the card <strong>{withMin.months - withPayment.months} months</strong> sooner.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   RESOURCES
══════════════════════════════════════════════════════════════════ */
const RESOURCES = [
  {
    name: 'Credit Karma',
    badge: 'Best free monitoring',
    badgeColor: '#22c55e',
    desc: 'Free credit scores (VantageScore from TransUnion and Equifax), credit report monitoring, and personalized recommendations. Not a FICO score, but great for tracking trends.',
    best: 'Anyone who wants ongoing credit monitoring at no cost',
    cost: 'Free',
  },
  {
    name: 'Experian',
    badge: 'Best for FICO scores',
    badgeColor: TEAL,
    desc: 'One of the three major bureaus. Free Experian account gives you your actual FICO® Score 8, plus one free credit report. Experian Boost lets you add utilities and streaming to improve your score.',
    best: 'People who want their real FICO score and report',
    cost: 'Free (basic) / $24.99/mo for premium monitoring',
  },
  {
    name: 'National Foundation for Credit Counseling (NFCC)',
    badge: 'Best for debt help',
    badgeColor: '#8b5cf6',
    desc: 'Non-profit network of accredited credit counselors. Offers Debt Management Plans (DMPs) that can reduce interest rates and consolidate payments. Free or low-cost counseling sessions.',
    best: 'Anyone struggling with significant debt who needs a structured plan',
    cost: 'Free counseling / DMP fees ~$25–50/month',
  },
  {
    name: 'NerdWallet',
    badge: 'Best for research',
    badgeColor: '#f59e0b',
    desc: 'Comprehensive comparison tool for credit cards, loans, and financial products. Free credit score monitoring, personalized card recommendations, and deep editorial content on debt strategies.',
    best: 'Comparison shopping for credit cards or loans',
    cost: 'Free',
  },
];

function ResourcesTab() {
  return (
    <div>
      <div style={{ padding:'0.875rem 1rem', background:'rgba(0,180,198,0.06)', border:'1px solid rgba(0,180,198,0.2)', borderRadius:12, marginBottom:'1.25rem', display:'flex', gap:10, alignItems:'flex-start' }}>
        <Info size={15} color={TEAL} style={{ flexShrink:0, marginTop:1 }}/>
        <p style={{ margin:0, fontSize:'0.875rem', color:'#374151', lineHeight:1.7, fontFamily:"'DM Sans',sans-serif" }}>
          <strong>You're entitled to one free credit report from each bureau per year</strong> at AnnualCreditReport.com (the only federally mandated free report site). Review all three — Equifax, Experian, and TransUnion — for errors.
        </p>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        {RESOURCES.map((r, i) => (
          <div key={i} style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ padding:'0.875rem 1.125rem', borderBottom:'1px solid #f0f0f0', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', fontWeight:700, color:NAVY }}>{r.name}</span>
                <span style={{ padding:'2px 10px', background:`${r.badgeColor}15`, border:`1px solid ${r.badgeColor}35`, borderRadius:100, fontSize:'0.6875rem', fontWeight:700, color:r.badgeColor, fontFamily:"'DM Sans',sans-serif", letterSpacing:'0.03em' }}>{r.badge}</span>
              </div>
            </div>
            <div style={{ padding:'0.875rem 1.125rem' }}>
              <p style={{ margin:'0 0 0.75rem', fontSize:'0.875rem', color:'#374151', lineHeight:1.7, fontFamily:"'DM Sans',sans-serif" }}>{r.desc}</p>
              <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:'0.25rem 0.75rem', fontSize:'0.8125rem', fontFamily:"'DM Sans',sans-serif" }}>
                <span style={{ color:'#9ca3af', fontWeight:600 }}>Best for</span><span style={{ color:'#374151' }}>{r.best}</span>
                <span style={{ color:'#9ca3af', fontWeight:600 }}>Cost</span><span style={{ color:'#374151' }}>{r.cost}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════ */
const TABS = [
  { id:'learn',     label:'Learn',     icon: BookOpen    },
  { id:'calc',      label:'Calculate', icon: Calculator  },
  { id:'resources', label:'Resources', icon: ExternalLink },
];

export default function DebtCredit() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('learn');

  return (
    <div style={{ minHeight:'100vh', background:BG, fontFamily:"'DM Sans',sans-serif" }}>

      {/* Header */}
      <div style={{ background:NAVY, padding:'2rem 2.5rem 0' }}>
        <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.35)', marginBottom:'1rem', display:'flex', alignItems:'center', gap:6, fontFamily:"'DM Sans',sans-serif" }}>
          <button onClick={() => navigate('/fun')} style={{ background:'none', border:'none', cursor:'pointer', color:TEAL, fontSize:'0.75rem', fontFamily:"'DM Sans',sans-serif", padding:0 }}>Dashboard</button>
          <ChevronRight size={12} color="rgba(255,255,255,0.25)"/>
          <span>Debt & Credit</span>
        </div>
        <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'2rem', fontWeight:700, color:'#fff', margin:'0 0 0.5rem', letterSpacing:'-0.025em', lineHeight:1.2 }}>
          Debt & Credit
        </h1>
        <p style={{ margin:'0 0 1.75rem', fontSize:'1rem', color:'rgba(255,255,255,0.55)', lineHeight:1.65, maxWidth:580, fontFamily:"'DM Sans',sans-serif" }}>
          Understand your credit score, build a strategic payoff plan, and break free from high-interest debt faster than you think.
        </p>
        <div style={{ display:'flex', gap:0, borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
          {TABS.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                display:'flex', alignItems:'center', gap:7,
                padding:'0.75rem 1.25rem', background:'none', border:'none',
                borderBottom:`2px solid ${active ? TEAL : 'transparent'}`,
                cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem',
                fontWeight: active ? 700 : 500, color: active ? TEAL : 'rgba(255,255,255,0.45)',
                marginBottom:-1, transition:'color 0.15s', whiteSpace:'nowrap',
              }}>
                <Icon size={14}/>{t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding:'2rem 2.5rem', maxWidth:860, margin:'0 auto' }}>

        {tab === 'learn' && (
          <>
            <SectionCard title="Your FICO® Credit Score — Decoded" subtitle="Five factors determine your score. Click any factor to expand tips on how to improve it.">
              <CreditScoreVisual/>
            </SectionCard>
            <SectionCard title="Debt Avalanche vs. Debt Snowball" subtitle="Both methods use the same monthly payment — only the target order changes. The right method is the one you'll stick with.">
              <AvalancheVsSnowball/>
            </SectionCard>
            <SectionCard title="Student Loan Guide" subtitle="Federal loans, income-driven repayment, and Public Service Loan Forgiveness — explained clearly.">
              <StudentLoans/>
            </SectionCard>
          </>
        )}

        {tab === 'calc' && (
          <>
            <SectionCard title="Debt Payoff Calculator" subtitle="Enter your debts below and see exactly how avalanche vs snowball compare for your situation — with real dollar savings.">
              <DebtPayoffCalc/>
            </SectionCard>
            <SectionCard title="Credit Card Interest Calculator" subtitle="See how much interest you're really paying — and how much you save by paying more than the minimum.">
              <CreditCardCalc/>
            </SectionCard>
          </>
        )}

        {tab === 'resources' && <ResourcesTab/>}

        {/* Next section */}
        <div onClick={() => navigate('/fun/investing')} style={{ marginTop:'2rem', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 1.25rem', background:NAVY, borderRadius:12, cursor:'pointer', transition:'opacity 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.opacity='0.88'} onMouseLeave={e => e.currentTarget.style.opacity='1'}>
          <div>
            <div style={{ fontSize:'0.6875rem', color:'rgba(255,255,255,0.4)', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:3, fontFamily:"'DM Sans',sans-serif" }}>Next section</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', fontWeight:600, color:'#fff' }}>Investing & Accounts</div>
          </div>
          <ArrowRight size={18} color={TEAL}/>
        </div>

        <p style={{ marginTop:'2rem', fontSize:'0.6875rem', color:'#d1d5db', textAlign:'center', lineHeight:1.6, fontFamily:"'DM Sans',sans-serif" }}>
          For educational purposes only — not financial, tax, or legal advice.
        </p>
      </div>
    </div>
  );
}
