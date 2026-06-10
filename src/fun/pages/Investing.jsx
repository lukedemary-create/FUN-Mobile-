import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip as RechartsTip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  BookOpen, Calculator, ExternalLink, ChevronRight, ArrowRight,
  Info, CheckCircle2, AlertCircle, TrendingUp, ChevronDown, ChevronUp,
  Shield, Building, User, Landmark, Users, Layers,
} from 'lucide-react';

const TEAL  = '#00B4C6';
const NAVY  = '#f0e8d8';
const BG    = '#1a1410';
const SURF  = '#231c16';
const RAISE = '#2d2419';
const B1    = '#2a2018';
const B2    = '#3d3028';
const T2    = '#a89070';
const T3    = '#6b5540';
const UI    = "'Inter', system-ui, sans-serif";
const DISP  = "'Playfair Display', Georgia, serif";
const LIGHT = '#5BC8E2';

/* ── Shared ───────────────────────────────────────────────────────── */
function fmt(n)  { return '$' + Math.round(Math.abs(n)).toLocaleString(); }
function fmtK(n) { return n >= 1000000 ? `$${(n/1000000).toFixed(2)}M` : n >= 1000 ? `$${(n/1000).toFixed(0)}K` : `$${Math.round(n)}`; }

function SectionCard({ title, subtitle, children }) {
  return (
    <div style={{ background:SURF, border:`1px solid ${B1}`, borderRadius:16, padding:'1.5rem', boxShadow:'0 1px 6px rgba(0,0,0,0.05)', marginBottom:'1.25rem' }}>
      {(title||subtitle) && (
        <div style={{ marginBottom:'1.25rem' }}>
          {title && <h3 style={{ fontFamily:DISP, fontSize:'1.25rem', fontWeight:700, color:NAVY, margin:'0 0 0.25rem', letterSpacing:'-0.02em' }}>{title}</h3>}
          {subtitle && <p style={{ margin:0, fontSize:'0.875rem', color:T3, lineHeight:1.65, fontFamily:UI }}>{subtitle}</p>}
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
      <p style={{ margin:0, fontSize:'0.8125rem', color:T2, lineHeight:1.7, fontFamily:UI }}>{children}</p>
    </div>
  );
}

function NumInput({ label, value, onChange, prefix='$', suffix, min=0, step=1, hint }) {
  return (
    <div style={{ marginBottom:'1rem' }}>
      {label && <label style={{ display:'block', fontSize:'0.8125rem', fontWeight:600, color:NAVY, marginBottom:'0.375rem', fontFamily:UI }}>{label}</label>}
      <div style={{ position:'relative' }}>
        {prefix && <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:T3, fontSize:'0.875rem', pointerEvents:'none' }}>{prefix}</span>}
        <input type="number" value={value} min={min} step={step} onChange={e => onChange(Number(e.target.value))}
          style={{ width:'100%', padding:`9px ${suffix?'2.25rem':'0.75rem'} 9px ${prefix?'1.5rem':'0.75rem'}`, border:`1.5px solid ${B2}`, borderRadius:9, fontSize:'1rem', fontFamily:UI, color:NAVY, fontWeight:600, background:RAISE, boxSizing:'border-box' }}
          onFocus={e => e.target.style.borderColor=TEAL} onBlur={e => e.target.style.borderColor=B2}/>
        {suffix && <span style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', color:T3, fontSize:'0.875rem', pointerEvents:'none' }}>{suffix}</span>}
      </div>
      {hint && <p style={{ margin:'0.25rem 0 0', fontSize:'0.75rem', color:T3, fontFamily:UI }}>{hint}</p>}
    </div>
  );
}

const CustomTip = ({ active, payload, label, valueFormatter }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:SURF, border:`1px solid ${B1}`, borderRadius:10, padding:'0.625rem 0.875rem', boxShadow:'0 4px 16px rgba(0,0,0,0.1)', fontFamily:UI }}>
      <div style={{ fontWeight:700, color:NAVY, marginBottom:4, fontSize:'0.8125rem' }}>Year {label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize:'0.8125rem', color:p.color || NAVY, display:'flex', gap:8, marginBottom:2 }}>
          <span>{p.name}:</span>
          <span style={{ fontWeight:700 }}>{valueFormatter ? valueFormatter(p.value) : fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   LEARN — Account Types
══════════════════════════════════════════════════════════════════ */
const ACCOUNTS = [
  {
    name: '401(k) — Traditional',
    group: 'employer',
    limit: '$24,500/yr ($32,500 if 50+; ages 60–63: $35,750)',
    tax: 'Pre-tax',
    taxColor: '#22c55e',
    highlight: 'Employer match is free money — always capture it first.',
    details: [
      'Contributions reduce your taxable income today',
      'Grows tax-deferred; withdrawals taxed as ordinary income in retirement',
      'Required Minimum Distributions (RMDs) start at age 73',
      'Early withdrawal penalty: 10% before age 59½ (plus taxes)',
      'Many plans offer a Roth 401(k) option within the same account',
    ],
    bestFor: 'Employees at companies offering retirement plans — especially those with a match',
  },
  {
    name: 'Roth 401(k)',
    group: 'employer',
    limit: '$24,500/yr ($32,500 if 50+; ages 60–63: $35,750)',
    tax: 'Post-tax',
    taxColor: TEAL,
    highlight: 'Tax-free in retirement. Same limit as Traditional 401(k) — combined.',
    details: [
      'Contributions made with after-tax dollars — no tax break today',
      'Grows tax-free; qualified withdrawals in retirement are 100% tax-free',
      'RMDs required (unlike Roth IRA) — roll to Roth IRA to avoid',
      'Same contribution limit shared with Traditional 401(k)',
      'Employer match goes into traditional (pre-tax) account regardless',
    ],
    bestFor: 'People who expect to be in a higher tax bracket in retirement',
  },
  {
    name: 'Traditional IRA',
    group: 'individual',
    limit: '$7,500/yr ($8,600 if 50+)',
    tax: 'Pre-tax*',
    taxColor: '#22c55e',
    highlight: 'Deductibility phases out if you have a workplace plan and earn above $81K (single) / $129K (MFJ).',
    details: [
      'Contributions may be tax-deductible depending on income and workplace plan',
      'Grows tax-deferred; withdrawals in retirement taxed as ordinary income',
      'RMDs start at age 73',
      '10% penalty for withdrawals before 59½ (with exceptions)',
      'Income limits only affect deductibility — anyone can contribute',
    ],
    bestFor: 'People without a 401(k) or who earn under the deductibility threshold',
  },
  {
    name: 'Roth IRA',
    group: 'individual',
    limit: '$7,500/yr ($8,600 if 50+)',
    tax: 'Post-tax',
    taxColor: TEAL,
    highlight: 'The most flexible account in personal finance. Income limits apply ($153K–$168K single, $242K–$252K MFJ).',
    details: [
      'After-tax contributions — no deduction today',
      'Tax-free growth and tax-free qualified withdrawals in retirement',
      'No RMDs during owner\'s lifetime — great for wealth transfer',
      'Contributions (not earnings) can be withdrawn anytime penalty-free',
      'Backdoor Roth available for high earners who exceed income limits',
    ],
    bestFor: 'Young investors, those expecting higher future taxes, and high earners doing backdoor Roth',
  },
  {
    name: 'HSA (Health Savings Account)',
    group: 'individual',
    limit: '$4,400 single / $8,750 family (2026)',
    tax: 'Triple tax advantage',
    taxColor: '#8b5cf6',
    highlight: 'The only account with a triple tax advantage — the Holy Grail of tax-advantaged investing.',
    details: [
      'Contributions are pre-tax (or deductible if made directly)',
      'Grows tax-free (invest the balance — don\'t let it sit in cash)',
      'Withdrawals tax-free for qualified medical expenses at any age',
      'After 65: withdraw for any purpose (taxed as income, like Traditional IRA)',
      'Must be enrolled in a High-Deductible Health Plan (HDHP) to contribute',
    ],
    bestFor: 'Anyone with an HDHP who can afford to pay medical costs out-of-pocket and invest the HSA balance',
  },
  {
    name: '529 Education Savings Plan',
    group: 'individual',
    limit: 'No annual limit (gift tax: $19K/yr)',
    tax: 'Post-tax (state deduction varies)',
    taxColor: '#f59e0b',
    highlight: 'Unused funds can now be rolled to a Roth IRA (lifetime max $35K, 15-year rule applies).',
    details: [
      'Contributions not federally deductible; many states offer deductions',
      'Grows tax-free; withdrawals tax-free for qualified education expenses',
      'Qualified expenses: tuition, room & board, books, K-12 (up to $10K/yr)',
      'Can change beneficiary to another family member at any time',
      'Superfunding: contribute 5 years of gifts at once ($95K per beneficiary)',
    ],
    bestFor: 'Parents saving for children\'s education — open one when child is born',
  },
  {
    name: 'Taxable Brokerage Account',
    group: 'individual',
    limit: 'No limit',
    tax: 'Taxable',
    taxColor: '#6b7280',
    highlight: 'No restrictions on withdrawals. Essential after maxing tax-advantaged accounts.',
    details: [
      'No contribution limits, no income restrictions, no early withdrawal penalties',
      'Dividends and interest taxed in the year earned',
      'Capital gains taxed when you sell — 0%, 15%, or 20% if held over 1 year',
      'Step-up in basis at death eliminates embedded capital gains for heirs',
      'Tax-loss harvesting can reduce your taxable gains',
    ],
    bestFor: 'Anyone who has maxed tax-advantaged accounts, or needs flexibility before retirement age',
  },
  {
    name: 'SEP IRA',
    group: 'self-employed',
    limit: '25% of compensation or $72,000 (2026)',
    tax: 'Pre-tax',
    taxColor: '#22c55e',
    highlight: 'The simplest high-limit retirement account for self-employed individuals and small business owners.',
    details: [
      'Employer (self) contributions only — employees cannot contribute',
      'Grows tax-deferred; withdrawals in retirement taxed as ordinary income',
      'Contribution deadline: tax filing deadline including extensions',
      'RMDs start at age 73',
      'No catch-up contributions for those 50+',
    ],
    bestFor: 'Freelancers and self-employed with high income who want maximum contribution room',
  },
  {
    name: 'SIMPLE IRA',
    group: 'self-employed',
    limit: '$17,000/yr ($21,000 if 50+; ages 60–63: $22,250)',
    tax: 'Pre-tax',
    taxColor: '#22c55e',
    highlight: 'Designed for small businesses. Employer must contribute 2–3% match or 2% non-elective.',
    details: [
      'Available to businesses with 100 or fewer employees',
      'Employee elective deferrals + required employer contributions',
      'Early withdrawal in first 2 years: 25% penalty (not 10%)',
      'Grows tax-deferred; taxed in retirement',
      'Cannot have other retirement plans simultaneously (usually)',
    ],
    bestFor: 'Small business owners who want a simple retirement plan with mandatory employer contributions',
  },
];

const GROUP_ICONS = { employer: Building, individual: User, 'self-employed': Landmark };
const GROUP_LABELS = { employer: 'Employer-Sponsored', individual: 'Individual', 'self-employed': 'Self-Employed' };

function AccountCards() {
  const [open, setOpen] = useState(null);
  const [filter, setFilter] = useState('all');

  const groups = ['employer', 'individual', 'self-employed'];
  const shown  = ACCOUNTS.filter(a => filter === 'all' || a.group === filter);

  return (
    <div>
      {/* Filter tabs */}
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.25rem', flexWrap:'wrap' }}>
        {['all', ...groups].map(g => (
          <button key={g} onClick={() => setFilter(g)} style={{
            padding:'5px 14px', borderRadius:100, border:`1.5px solid ${filter===g ? TEAL : '#2a2018'}`,
            background: filter===g ? `rgba(0,180,198,0.1)` : '#2a2018',
            color: filter===g ? TEAL : '#a89070', fontSize:'0.8125rem', fontWeight: filter===g ? 700 : 500,
            cursor:'pointer', fontFamily:UI, transition:'all 0.13s',
          }}>
            {g === 'all' ? 'All Accounts' : GROUP_LABELS[g]}
          </button>
        ))}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'0.625rem' }}>
        {shown.map((acct, i) => {
          const isOpen = open === acct.name;
          return (
            <div key={acct.name} style={{ border:`1.5px solid ${isOpen ? TEAL+'50' : '#2a2018'}`, borderRadius:12, overflow:'hidden', transition:'border-color 0.15s' }}>
              <button
                onClick={() => setOpen(isOpen ? null : acct.name)}
                style={{ width:'100%', background: isOpen ? 'rgba(0,180,198,0.06)' : '#231c16', border:'none', cursor:'pointer', textAlign:'left', padding:'0.875rem 1rem', display:'flex', alignItems:'center', gap:'0.875rem' }}
              >
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.625rem', flexWrap:'wrap', marginBottom:4 }}>
                    <span style={{ fontFamily:DISP, fontSize:'0.9375rem', fontWeight:700, color:NAVY }}>{acct.name}</span>
                    <span style={{ padding:'2px 9px', background:`${acct.taxColor}15`, border:`1px solid ${acct.taxColor}35`, borderRadius:100, fontSize:'0.6875rem', fontWeight:700, color:acct.taxColor, fontFamily:UI }}>{acct.tax}</span>
                  </div>
                  <div style={{ fontSize:'0.8125rem', color:T3, fontFamily:UI }}>
                    <span style={{ fontWeight:600, color:NAVY }}>{acct.limit}</span>
                  </div>
                </div>
                {isOpen ? <ChevronUp size={16} color={TEAL}/> : <ChevronDown size={16} color="#9ca3af"/>}
              </button>

              {isOpen && (
                <div style={{ borderTop:'1px solid #2a2018', padding:'0.875rem 1rem', background:'#1e1912' }}>
                  <div style={{ display:'flex', gap:8, marginBottom:'0.75rem', padding:'0.5rem 0.75rem', background:`${TEAL}0d`, borderRadius:8 }}>
                    <TrendingUp size={13} color={TEAL} style={{ flexShrink:0, marginTop:2 }}/>
                    <p style={{ margin:0, fontSize:'0.8125rem', fontWeight:600, color:NAVY, lineHeight:1.6, fontFamily:UI }}>{acct.highlight}</p>
                  </div>
                  <ul style={{ margin:'0 0 0.875rem', paddingLeft:'1.25rem' }}>
                    {acct.details.map((d, j) => (
                      <li key={j} style={{ fontSize:'0.8125rem', color:T2, lineHeight:1.7, marginBottom:4, fontFamily:UI }}>{d}</li>
                    ))}
                  </ul>
                  <div style={{ padding:'0.5rem 0.75rem', background:'rgba(0,180,198,0.08)', borderRadius:8, fontSize:'0.8125rem', color:T2, fontFamily:UI }}>
                    <strong style={{ color:NAVY }}>Best for:</strong> {acct.bestFor}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LEARN — Funding Waterfall
══════════════════════════════════════════════════════════════════ */
const WATERFALL_STEPS = [
  { n:1, title:'Capture the full employer 401(k) match', color:'#22c55e', badge:'Always first', desc:'A 50–100% instant return on your contribution. No investment beats free money. If your employer matches 4%, contribute at least 4%.' },
  { n:2, title:'Max your HSA (if you have an HDHP)', color:'#8b5cf6', badge:'Triple tax win', desc:'Triple tax advantage: pre-tax in, tax-free growth, tax-free out for medical. After 65 it works like a Traditional IRA. Invest the balance — don\'t let it sit in cash.' },
  { n:3, title:'Max your Roth IRA', color:TEAL, badge:'$7,500/yr', desc:'Tax-free growth forever, no RMDs, and you can withdraw contributions anytime. Backdoor Roth available if you earn too much. The most flexible retirement account there is.' },
  { n:4, title:'Maximize your 401(k)', color:'#3b82f6', badge:'$24,500/yr', desc:'After maxing the Roth IRA, go back and max the 401(k). Whether Traditional or Roth depends on your current vs future tax situation.' },
  { n:5, title:'Taxable brokerage account', color:T3, badge:'No limit', desc:'No tax advantages, but no restrictions either. Use tax-efficient funds (index ETFs), harvest losses strategically, and hold for long-term capital gains rates.' },
];

function FundingWaterfall() {
  return (
    <div>
      <p style={{ fontSize:'0.875rem', color:T3, marginBottom:'1.5rem', lineHeight:1.7, fontFamily:UI }}>
        When you have money to invest, <em>where</em> you put it matters as much as <em>how much</em>. Follow this priority order to maximize every tax advantage before moving to the next step.
      </p>
      <div style={{ position:'relative' }}>
        {WATERFALL_STEPS.map((s, i) => (
          <div key={i} style={{ display:'flex', gap:'1rem', marginBottom: i < WATERFALL_STEPS.length-1 ? 0 : 0, position:'relative' }}>
            {/* Left: number + connector */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:40, flexShrink:0 }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:s.color, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'1rem', fontFamily:UI, zIndex:1, boxShadow:`0 2px 8px ${s.color}50` }}>
                {s.n}
              </div>
              {i < WATERFALL_STEPS.length - 1 && (
                <div style={{ width:2, flex:1, background:`linear-gradient(${s.color}, ${WATERFALL_STEPS[i+1].color})`, minHeight:32, margin:'4px 0' }}/>
              )}
            </div>
            {/* Right: content */}
            <div style={{ flex:1, paddingBottom: i < WATERFALL_STEPS.length-1 ? '1rem' : 0, paddingTop:4 }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.625rem', marginBottom:'0.375rem', flexWrap:'wrap' }}>
                <span style={{ fontFamily:DISP, fontSize:'0.9375rem', fontWeight:700, color:NAVY }}>{s.title}</span>
                <span style={{ padding:'2px 9px', background:`${s.color}18`, border:`1px solid ${s.color}35`, borderRadius:100, fontSize:'0.6875rem', fontWeight:700, color:s.color, fontFamily:UI }}>{s.badge}</span>
              </div>
              <p style={{ margin:0, fontSize:'0.8125rem', color:T3, lineHeight:1.7, fontFamily:UI }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LEARN — Asset Classes
══════════════════════════════════════════════════════════════════ */
const ASSETS = [
  { name:'Stocks (Equities)', icon: TrendingUp, risk:'High', return:'High (7–10% historical avg)', color:TEAL, desc:'Ownership shares in a company. Highest long-term return potential but most volatile. Best held in diversified funds, not individual picks.', examples:'S&P 500 index funds, growth ETFs, dividend stocks', tip:'Over any 20-year period in history, the S&P 500 has never lost money.' },
  { name:'Bonds (Fixed Income)', icon: Landmark, risk:'Low–Medium', return:'Low–Medium (2–5%)', color:'#3b82f6', desc:'Loans to governments or corporations that pay regular interest. Lower returns than stocks but provide stability and income. Critical for retirees and conservative investors.', examples:'US Treasury bonds, municipal bonds, corporate bond ETFs', tip:'When interest rates rise, bond prices fall — and vice versa. Duration risk matters.' },
  { name:'ETFs (Exchange-Traded Funds)', icon: Layers, risk:'Varies', return:'Mirrors underlying index', color:'#8b5cf6', desc:'Baskets of securities that trade like stocks on an exchange. Usually track an index (S&P 500, total market, bonds). Low costs, instant diversification, tax-efficient.', examples:'VTI, VOO, BND, QQQ, SPY', tip:'A single total market ETF (like VTI) gives you 3,700+ stocks in one trade for 0.03% per year.' },
  { name:'Mutual Funds', icon: Users, risk:'Varies', return:'Varies by type', color:'#f59e0b', desc:'Pooled investment vehicles that are priced once per day at close. Most are actively managed — attempting to beat the market. Evidence shows most underperform index funds over time.', examples:'Fidelity 500 Index Fund (FXAIX), American Funds Growth Fund', tip:'Check the expense ratio. A 1% fund costs 10x more than a 0.1% index fund over 30 years.' },
  { name:'REITs (Real Estate Investment Trusts)', icon: Building, risk:'Medium–High', return:'Medium–High (5–8%)', color:'#ef4444', desc:'Companies that own income-producing real estate. Must distribute 90%+ of taxable income as dividends. Provides real estate exposure without buying property. Highly liquid.', examples:'VNQ (Vanguard REIT ETF), O (Realty Income), Simon Property Group', tip:'REITs often generate ordinary income dividends (taxed as income) — best held in tax-advantaged accounts.' },
];

function AssetClasses() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'0.625rem' }}>
      {ASSETS.map((a, i) => {
        const isOpen = open === i;
        return (
          <div key={i} style={{ border:`1.5px solid ${isOpen ? a.color+'50' : '#2a2018'}`, borderRadius:12, overflow:'hidden', transition:'border-color 0.15s' }}>
            <button onClick={() => setOpen(isOpen ? null : i)} style={{ width:'100%', background:isOpen?`${a.color}10`:'#231c16', border:'none', cursor:'pointer', textAlign:'left', padding:'0.875rem 1rem', display:'flex', alignItems:'center', gap:'0.875rem' }}>
              {(() => { const AI = a.icon; return <AI size={22} color={a.color} />; })()}
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexWrap:'wrap', marginBottom:3 }}>
                  <span style={{ fontFamily:DISP, fontSize:'0.9375rem', fontWeight:700, color:NAVY }}>{a.name}</span>
                </div>
                <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                  <span style={{ fontSize:'0.75rem', fontFamily:UI, color:T3 }}>Risk: <strong style={{ color: a.risk==='Low–Medium'?'#22c55e':a.risk==='Medium–High'?'#f59e0b':a.risk==='High'?'#ef4444':a.color }}>{a.risk}</strong></span>
                  <span style={{ fontSize:'0.75rem', color:T3 }}>·</span>
                  <span style={{ fontSize:'0.75rem', fontFamily:UI, color:T3 }}>Return: <strong style={{ color:NAVY }}>{a.return}</strong></span>
                </div>
              </div>
              {isOpen ? <ChevronUp size={15} color={TEAL}/> : <ChevronDown size={15} color="#9ca3af"/>}
            </button>
            {isOpen && (
              <div style={{ borderTop:'1px solid #2a2018', padding:'0.875rem 1rem', background:'#1e1912' }}>
                <p style={{ margin:'0 0 0.625rem', fontSize:'0.875rem', color:T2, lineHeight:1.7, fontFamily:UI }}>{a.desc}</p>
                <div style={{ fontSize:'0.8125rem', color:T3, fontFamily:UI, marginBottom:'0.625rem' }}>
                  <strong style={{ color:NAVY }}>Examples:</strong> {a.examples}
                </div>
                <div style={{ display:'flex', gap:7, padding:'0.5rem 0.75rem', background:`${a.color}0d`, borderRadius:8 }}>
                  <Info size={12} color={a.color} style={{ flexShrink:0, marginTop:2 }}/>
                  <p style={{ margin:0, fontSize:'0.8rem', color:T2, lineHeight:1.6, fontFamily:UI }}><strong>Key insight:</strong> {a.tip}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LEARN — Risk Tolerance Quiz
══════════════════════════════════════════════════════════════════ */
const QUIZ = [
  {
    q: 'When do you expect to need this money?',
    opts: [
      { label:'Within 5 years', pts:0 },
      { label:'5–10 years',     pts:2 },
      { label:'10–20 years',    pts:4 },
      { label:'20+ years',      pts:6 },
    ],
  },
  {
    q: 'If your portfolio dropped 30% in a market crash, you would:',
    opts: [
      { label:'Sell — I can\'t handle that loss', pts:0 },
      { label:'Worry a lot, but hold',            pts:2 },
      { label:'Stay the course calmly',           pts:4 },
      { label:'Buy more — great opportunity',     pts:6 },
    ],
  },
  {
    q: 'Your primary investment goal is:',
    opts: [
      { label:'Preserve my capital — safety first',      pts:0 },
      { label:'Modest growth with limited downside',     pts:2 },
      { label:'Strong growth — I can handle volatility', pts:4 },
    ],
  },
  {
    q: 'Your investment experience level:',
    opts: [
      { label:'None — just starting out', pts:0 },
      { label:'Some — I understand basics', pts:1 },
      { label:'Experienced — comfortable with markets', pts:2 },
    ],
  },
];

const ALLOCATIONS = [
  {
    label:'Conservative',   range:[0,5],  color:'#3b82f6',
    stocks:25, bonds:55, cash:20,
    desc:'Prioritizes stability over growth. Suitable for short time horizons or very low risk tolerance.',
  },
  {
    label:'Moderately Conservative', range:[6,8], color:'#8b5cf6',
    stocks:45, bonds:45, cash:10,
    desc:'Some growth with significant downside protection. Good for 5–10 year horizons.',
  },
  {
    label:'Moderate',       range:[9,12], color:TEAL,
    stocks:60, bonds:35, cash:5,
    desc:'Balanced between growth and stability. The classic 60/40 portfolio. Suitable for most investors.',
  },
  {
    label:'Moderately Aggressive', range:[13,15], color:'#f59e0b',
    stocks:75, bonds:20, cash:5,
    desc:'Growth-oriented with some ballast. Good for 10–20 year horizons with above-average risk tolerance.',
  },
  {
    label:'Aggressive',     range:[16,20], color:'#22c55e',
    stocks:90, bonds:7, cash:3,
    desc:'Maximum growth focus. Suitable for 20+ year horizons and investors who won\'t panic during market crashes.',
  },
];

function RiskQuiz() {
  const [answers, setAnswers] = useState({});
  const [done,    setDone]    = useState(false);

  const total = Object.values(answers).reduce((s, v) => s + v, 0);
  const alloc = done ? ALLOCATIONS.find(a => total >= a.range[0] && total <= a.range[1]) || ALLOCATIONS[2] : null;

  const pieData = alloc ? [
    { name:'Stocks', value:alloc.stocks, color:alloc.color },
    { name:'Bonds',  value:alloc.bonds,  color:'#3b82f6'   },
    { name:'Cash',   value:alloc.cash,   color:'#94a3b8'   },
  ] : [];

  function pick(qi, pts) {
    const updated = { ...answers, [qi]: pts };
    setAnswers(updated);
    if (Object.keys(updated).length === QUIZ.length) setDone(true);
  }

  function reset() { setAnswers({}); setDone(false); }

  return (
    <div>
      {!done ? (
        <>
          <p style={{ fontSize:'0.875rem', color:T3, marginBottom:'1.25rem', lineHeight:1.65, fontFamily:UI }}>
            Answer 4 questions to get a personalized asset allocation suggestion.
          </p>
          {QUIZ.map((q, qi) => (
            <div key={qi} style={{ marginBottom:'1.25rem' }}>
              <div style={{ fontSize:'0.875rem', fontWeight:700, color:NAVY, marginBottom:'0.625rem', fontFamily:UI }}>
                {qi + 1}. {q.q}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.375rem' }}>
                {q.opts.map((o, oi) => {
                  const sel = answers[qi] === o.pts;
                  return (
                    <button key={oi} onClick={() => pick(qi, o.pts)} style={{
                      padding:'0.625rem 0.875rem', background: sel ? 'rgba(0,180,198,0.1)' : '#231c16',
                      border:`1.5px solid ${sel ? TEAL : '#2a2018'}`, borderRadius:9,
                      cursor:'pointer', textAlign:'left', fontSize:'0.875rem', fontWeight: sel ? 600 : 400,
                      color: sel ? TEAL : NAVY, fontFamily:UI, transition:'all 0.13s',
                      display:'flex', alignItems:'center', gap:8,
                    }}>
                      {sel && <CheckCircle2 size={14} color={TEAL}/>}
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </>
      ) : (
        <div>
          <div style={{ textAlign:'center', marginBottom:'1.25rem' }}>
            <div style={{ fontSize:'0.75rem', fontWeight:700, color:T3, letterSpacing:'0.08em', textTransform:'uppercase', fontFamily:UI, marginBottom:4 }}>Suggested allocation</div>
            <div style={{ fontFamily:DISP, fontSize:'1.625rem', fontWeight:700, color:alloc.color }}>{alloc.label}</div>
            <p style={{ fontSize:'0.875rem', color:T3, lineHeight:1.65, margin:'0.5rem 0 0', fontFamily:UI }}>{alloc.desc}</p>
          </div>

          <div style={{ height:220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={88} paddingAngle={3} dataKey="value" animationBegin={0} animationDuration={800}>
                  {pieData.map((d, i) => <Cell key={i} fill={d.color} stroke="none"/>)}
                </Pie>
                <Legend formatter={(v) => <span style={{ fontFamily:UI, fontSize:'0.8125rem', color:NAVY }}>{v}</span>}/>
                <RechartsTip formatter={(v, n) => [`${v}%`, n]} contentStyle={{ fontFamily:UI, fontSize:12, borderRadius:8 }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.625rem', marginBottom:'1rem' }}>
            {pieData.map((d, i) => (
              <div key={i} style={{ textAlign:'center', padding:'0.75rem', background:`${d.color}10`, border:`1px solid ${d.color}25`, borderRadius:10 }}>
                <div style={{ fontFamily:DISP, fontSize:'1.375rem', fontWeight:700, color:d.color }}>{d.value}%</div>
                <div style={{ fontSize:'0.75rem', color:T3, fontFamily:UI }}>{d.name}</div>
              </div>
            ))}
          </div>

          <InfoBox>This is a starting point, not a prescription. Revisit your allocation annually and as your life changes. Gradually shift to more bonds as you approach retirement.</InfoBox>
          <button onClick={reset} style={{ marginTop:'0.875rem', display:'block', width:'100%', padding:'0.625rem', background:'none', border:`1px solid ${B1}`, borderRadius:9, cursor:'pointer', fontSize:'0.8125rem', color:T3, fontFamily:UI }}>
            Retake quiz
          </button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CALCULATE — Compound Interest Calculator
══════════════════════════════════════════════════════════════════ */
function buildGrowthData(initial, monthly, annualRate, years) {
  const r = annualRate / 100 / 12;
  const data = [{ year:0, balance:Math.round(initial), contributed:Math.round(initial), growth:0 }];
  let bal = initial, contributed = initial;
  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      bal = bal * (1 + r) + monthly;
      contributed += monthly;
    }
    data.push({ year:y, balance:Math.round(bal), contributed:Math.round(contributed), growth:Math.round(bal - contributed) });
  }
  return data;
}

function CompoundCalc() {
  const [initial,  setInitial]  = useState(10000);
  const [monthly,  setMonthly]  = useState(500);
  const [rate,     setRate]     = useState(7);
  const [years,    setYears]    = useState(30);

  const data      = useMemo(() => buildGrowthData(initial, monthly, rate, years), [initial, monthly, rate, years]);
  const final     = data[data.length - 1];
  const totalContr = final.contributed;
  const totalGrowth = final.growth;

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 1rem' }}>
        <NumInput label="Initial Investment" value={initial} onChange={setInitial} min={0} step={1000}/>
        <NumInput label="Monthly Contribution" value={monthly} onChange={setMonthly} min={0} step={50}/>
      </div>

      <div style={{ marginBottom:'1rem' }}>
        <label style={{ display:'block', fontSize:'0.8125rem', fontWeight:600, color:NAVY, marginBottom:'0.375rem', fontFamily:UI }}>
          Annual Return — <span style={{ color:TEAL }}>{rate}%</span>
          <span style={{ fontWeight:400, color:T3, fontSize:'0.75rem', marginLeft:8 }}>S&P 500 historical avg ~10% (7% inflation-adjusted)</span>
        </label>
        <input type="range" min={1} max={15} step={0.5} value={rate} onChange={e => setRate(Number(e.target.value))} style={{ width:'100%', accentColor:TEAL, cursor:'pointer' }}/>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.6875rem', color:T3, fontFamily:UI, marginTop:3 }}>
          <span>1%</span><span>5%</span><span>7% (real)</span><span>10% (nominal)</span><span>15%</span>
        </div>
      </div>

      <div style={{ marginBottom:'1.25rem' }}>
        <label style={{ display:'block', fontSize:'0.8125rem', fontWeight:600, color:NAVY, marginBottom:'0.375rem', fontFamily:UI }}>
          Time Horizon — <span style={{ color:TEAL }}>{years} years</span>
        </label>
        <input type="range" min={1} max={50} step={1} value={years} onChange={e => setYears(Number(e.target.value))} style={{ width:'100%', accentColor:TEAL, cursor:'pointer' }}/>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.6875rem', color:T3, fontFamily:UI, marginTop:3 }}>
          <span>1</span><span>10</span><span>20</span><span>30</span><span>40</span><span>50</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.625rem', marginBottom:'1.25rem' }}>
        {[
          { label:'Final Balance', value:fmtK(final.balance), color:TEAL },
          { label:'Total Contributed', value:fmtK(totalContr), color:NAVY },
          { label:'Investment Growth', value:fmtK(totalGrowth), color:'#22c55e' },
        ].map(s => (
          <div key={s.label} style={{ textAlign:'center', padding:'0.875rem 0.5rem', background:`${s.color}09`, border:`1px solid ${s.color}25`, borderRadius:11 }}>
            <div style={{ fontFamily:DISP, fontSize:'1.25rem', fontWeight:700, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:'0.75rem', color:T3, fontFamily:UI }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ height:220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top:4, right:4, left:0, bottom:0 }}>
            <defs>
              <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={TEAL} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={TEAL} stopOpacity={0.02}/>
              </linearGradient>
              <linearGradient id="contrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={NAVY} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={NAVY} stopOpacity={0.02}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="year" tick={{ fontFamily:UI, fontSize:11, fill:'#6b5540' }} axisLine={false} tickLine={false} tickFormatter={v => `Yr ${v}`} interval={Math.floor(years/5)}/>
            <YAxis tick={{ fontFamily:UI, fontSize:11, fill:'#6b5540' }} axisLine={false} tickLine={false} tickFormatter={v => fmtK(v)} width={52}/>
            <RechartsTip content={<CustomTip valueFormatter={fmt}/>}/>
            <Area type="monotone" dataKey="contributed" name="Contributed" stroke={NAVY} strokeWidth={1.5} fill="url(#contrGrad)" strokeDasharray="4 2"/>
            <Area type="monotone" dataKey="balance"     name="Balance"     stroke={TEAL} strokeWidth={2}   fill="url(#growthGrad)"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <InfoBox>The gap between the blue line (what you put in) and the teal area (your balance) is the power of compounding. The longer you wait to start, the harder it is to catch up.</InfoBox>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CALCULATE — Fee Impact Calculator
══════════════════════════════════════════════════════════════════ */
const FEE_LEVELS = [
  { fee:0.03,  label:'0.03% — Index ETF (Vanguard)',    color:'#22c55e' },
  { fee:0.5,   label:'0.50% — Low-cost mutual fund',    color:TEAL      },
  { fee:1.0,   label:'1.00% — Typical active fund',     color:'#f59e0b' },
  { fee:2.0,   label:'2.00% — High-fee advisor + fund', color:'#ef4444' },
];

function FeeImpactCalc() {
  const [initial, setInitial] = useState(50000);
  const [monthly, setMonthly] = useState(500);
  const [gross,   setGross]   = useState(8);
  const [years,   setYears]   = useState(30);

  const data = useMemo(() => {
    return Array.from({ length: years + 1 }, (_, y) => {
      const point = { year:y };
      FEE_LEVELS.forEach(fl => {
        const r = (gross - fl.fee) / 100 / 12;
        let bal = initial;
        for (let m = 0; m < y * 12; m++) bal = bal * (1 + r) + monthly;
        point[`f${fl.fee}`] = Math.round(bal);
      });
      return point;
    });
  }, [initial, monthly, gross, years]);

  const final = data[data.length - 1];
  const best  = final[`f${FEE_LEVELS[0].fee}`];
  const worst = final[`f${FEE_LEVELS[FEE_LEVELS.length-1].fee}`];
  const drag  = best - worst;

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 1rem' }}>
        <NumInput label="Starting Balance" value={initial} onChange={setInitial} min={0} step={5000}/>
        <NumInput label="Monthly Contribution" value={monthly} onChange={setMonthly} min={0} step={50}/>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 1rem' }}>
        <div style={{ marginBottom:'1rem' }}>
          <label style={{ display:'block', fontSize:'0.8125rem', fontWeight:600, color:NAVY, marginBottom:'0.375rem', fontFamily:UI }}>Gross Annual Return — {gross}%</label>
          <input type="range" min={4} max={12} step={0.5} value={gross} onChange={e=>setGross(Number(e.target.value))} style={{ width:'100%', accentColor:TEAL, cursor:'pointer' }}/>
        </div>
        <div style={{ marginBottom:'1rem' }}>
          <label style={{ display:'block', fontSize:'0.8125rem', fontWeight:600, color:NAVY, marginBottom:'0.375rem', fontFamily:UI }}>Time Horizon — {years} years</label>
          <input type="range" min={5} max={40} step={1} value={years} onChange={e=>setYears(Number(e.target.value))} style={{ width:'100%', accentColor:TEAL, cursor:'pointer' }}/>
        </div>
      </div>

      <div style={{ height:220, marginBottom:'1rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top:4, right:4, left:0, bottom:0 }}>
            <XAxis dataKey="year" tick={{ fontFamily:UI, fontSize:11, fill:'#6b5540' }} axisLine={false} tickLine={false} tickFormatter={v=>`Yr ${v}`} interval={Math.floor(years/5)}/>
            <YAxis tick={{ fontFamily:UI, fontSize:11, fill:'#6b5540' }} axisLine={false} tickLine={false} tickFormatter={v=>fmtK(v)} width={52}/>
            <RechartsTip content={<CustomTip valueFormatter={fmt}/>}/>
            {FEE_LEVELS.map(fl => (
              <Line key={fl.fee} type="monotone" dataKey={`f${fl.fee}`} name={fl.label} stroke={fl.color} strokeWidth={fl.fee===0.03?2.5:1.5} dot={false}/>
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'0.5rem', marginBottom:'0.875rem' }}>
        {FEE_LEVELS.map(fl => (
          <div key={fl.fee} style={{ padding:'0.625rem 0.875rem', background:`${fl.color}0d`, border:`1px solid ${fl.color}25`, borderRadius:9 }}>
            <div style={{ fontSize:'0.6875rem', color:T3, fontFamily:UI, marginBottom:2 }}>{fl.label}</div>
            <div style={{ fontFamily:DISP, fontSize:'1.125rem', fontWeight:700, color:fl.color }}>{fmtK(final[`f${fl.fee}`])}</div>
          </div>
        ))}
      </div>

      <div style={{ padding:'0.875rem 1rem', background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:10 }}>
        <p style={{ margin:0, fontSize:'0.875rem', color:T2, lineHeight:1.7, fontFamily:UI }}>
          Over {years} years, paying <strong>2% in fees vs 0.03%</strong> costs you <strong style={{ color:'#ef4444' }}>{fmtK(drag)}</strong> in lost returns. Fees are the only investment variable you control completely — minimize them relentlessly.
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CALCULATE — Roth vs Traditional
══════════════════════════════════════════════════════════════════ */
const BRACKETS = [
  { label:'10%', rate:10 }, { label:'12%', rate:12 },
  { label:'22%', rate:22 }, { label:'24%', rate:24 },
  { label:'32%', rate:32 }, { label:'35%', rate:35 },
  { label:'37%', rate:37 },
];

function RothVsTraditional() {
  const [invest,   setInvest]   = useState(7000);
  const [years,    setYears]    = useState(25);
  const [nowBracket, setNow]    = useState(22);
  const [retBracket, setRet]    = useState(22);
  const [returnPct, setReturn]  = useState(7);

  const growth  = Math.pow(1 + returnPct/100, years);
  const traditional = invest * growth * (1 - retBracket/100); // pay tax at withdrawal
  const roth        = invest * (1 - nowBracket/100) * growth; // pay tax now, withdraw free

  const rothBetter = traditional > roth;
  const diff       = Math.abs(traditional - roth);

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 1rem' }}>
        <NumInput label="Annual Contribution" value={invest} onChange={setInvest} min={0} step={500}/>
        <div style={{ marginBottom:'1rem' }}>
          <label style={{ display:'block', fontSize:'0.8125rem', fontWeight:600, color:NAVY, marginBottom:'0.375rem', fontFamily:UI }}>Investment Return — {returnPct}%</label>
          <input type="range" min={3} max={12} step={0.5} value={returnPct} onChange={e=>setReturn(Number(e.target.value))} style={{ width:'100%', accentColor:TEAL }}/>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 1rem', marginBottom:'0.5rem' }}>
        <div>
          <label style={{ display:'block', fontSize:'0.8125rem', fontWeight:600, color:NAVY, marginBottom:'0.375rem', fontFamily:UI }}>Your Current Tax Bracket</label>
          <select value={nowBracket} onChange={e=>setNow(Number(e.target.value))} style={{ width:'100%', padding:'8px 10px', border:`1.5px solid ${B2}`, borderRadius:9, fontSize:'0.9375rem', color:NAVY, fontFamily:UI, background:RAISE, fontWeight:600 }}
            onFocus={e=>e.target.style.borderColor=TEAL} onBlur={e=>e.target.style.borderColor=B2}>
            {BRACKETS.map(b => <option key={b.rate} value={b.rate}>{b.label}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display:'block', fontSize:'0.8125rem', fontWeight:600, color:NAVY, marginBottom:'0.375rem', fontFamily:UI }}>Expected Retirement Tax Bracket</label>
          <select value={retBracket} onChange={e=>setRet(Number(e.target.value))} style={{ width:'100%', padding:'8px 10px', border:`1.5px solid ${B2}`, borderRadius:9, fontSize:'0.9375rem', color:NAVY, fontFamily:UI, background:RAISE, fontWeight:600 }}
            onFocus={e=>e.target.style.borderColor=TEAL} onBlur={e=>e.target.style.borderColor=B2}>
            {BRACKETS.map(b => <option key={b.rate} value={b.rate}>{b.label}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginBottom:'1.25rem' }}>
        <label style={{ display:'block', fontSize:'0.8125rem', fontWeight:600, color:NAVY, marginBottom:'0.375rem', fontFamily:UI }}>Years Until Retirement — {years}</label>
        <input type="range" min={5} max={40} step={1} value={years} onChange={e=>setYears(Number(e.target.value))} style={{ width:'100%', accentColor:TEAL }}/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'1rem' }}>
        {[
          { label:'Traditional IRA', sub:'Pre-tax now, taxed at withdrawal', value:traditional, color:'#22c55e', better:rothBetter===false },
          { label:'Roth IRA',        sub:'Taxed now, tax-free at withdrawal', value:roth,        color:TEAL,      better:rothBetter===true  },
        ].map(s => (
          <div key={s.label} style={{ padding:'1rem', background: s.better?`${s.color}0d`:'#231c16', border:`1.5px solid ${s.better?s.color+'40':'#2a2018'}`, borderRadius:12 }}>
            <div style={{ fontSize:'0.75rem', fontWeight:700, color:s.better?s.color:T3, textTransform:'uppercase', letterSpacing:'0.06em', fontFamily:UI, marginBottom:4 }}>
              {s.label} {s.better && '✓ Better'}
            </div>
            <div style={{ fontSize:'0.75rem', color:T3, fontFamily:UI, marginBottom:8 }}>{s.sub}</div>
            <div style={{ fontFamily:DISP, fontSize:'1.5rem', fontWeight:700, color:s.better?s.color:NAVY }}>{fmtK(s.value)}</div>
            <div style={{ fontSize:'0.75rem', color:T3, fontFamily:UI }}>after-tax value at retirement</div>
          </div>
        ))}
      </div>

      <div style={{ padding:'0.875rem 1rem', background: rothBetter?'rgba(0,180,198,0.07)':'rgba(34,197,94,0.07)', border:`1px solid ${rothBetter?TEAL+'30':'#22c55e30'}`, borderRadius:10 }}>
        <p style={{ margin:0, fontSize:'0.875rem', color:T2, lineHeight:1.7, fontFamily:UI }}>
          With your current ({nowBracket}%) vs retirement ({retBracket}%) brackets, the <strong style={{ color: rothBetter?TEAL:'#22c55e' }}>{rothBetter?'Roth':'Traditional'} IRA</strong> gives you <strong>{fmtK(diff)} more</strong> after tax over {years} years.
          {nowBracket === retBracket && ' When brackets are equal, Roth is generally preferred for its flexibility and no RMD requirement.'}
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   RESOURCES
══════════════════════════════════════════════════════════════════ */
const RESOURCES = [
  { name:'Vanguard',    badge:'Best for index funds',      badgeColor:'#22c55e', desc:'The original low-cost index fund company. Invented by Jack Bogle. Customer-owned structure means no profit motive — costs stay razor thin. The gold standard for long-term investors.', cost:'No minimums for most ETFs; mutual funds from $1,000', best:'Long-term, buy-and-hold index investors' },
  { name:'Fidelity',    badge:'Best overall broker',       badgeColor:TEAL,      desc:'Zero-fee index funds (FZROX, FZILX), $0 commissions, fractional shares, and excellent research tools. No account minimums. Best all-around brokerage for most people.', cost:'$0 commissions, zero-fee index funds available', best:'Most investors — especially beginners' },
  { name:'Charles Schwab', badge:'Best for full service', badgeColor:'#3b82f6', desc:'$0 commissions, fractional shares, excellent customer service, and a full banking suite. Schwab Index Funds rival Vanguard on cost. Also owns TD Ameritrade\'s thinkorswim platform.', cost:'$0 commissions; ETFs from $1', best:'Investors who also want banking services' },
  { name:'Betterment',  badge:'Best robo-advisor',         badgeColor:'#8b5cf6', desc:'Automated investing using low-cost ETFs. Handles asset allocation, rebalancing, and tax-loss harvesting automatically. Perfect for hands-off investors who don\'t want to pick funds.', cost:'0.25%/yr (0.40% for premium with advisor access)', best:'Hands-off investors who want automation' },
  { name:'Wealthfront', badge:'Best for tax optimization', badgeColor:'#f59e0b', desc:'Robo-advisor with sophisticated tax-loss harvesting, direct indexing for larger accounts, and a 5% APY cash account. More tech-focused than Betterment with similar core offering.', cost:'0.25%/yr management fee', best:'Tech-savvy investors wanting automated tax optimization' },
  { name:'M1 Finance',  badge:'Best for custom portfolios',badgeColor:'#ef4444', desc:'Hybrid between robo-advisor and DIY broker. Build a custom "pie" portfolio of stocks and ETFs, then automate contributions into it. No management fee. Fractional shares.', cost:'Free ($3/mo for M1 Plus with cash account)', best:'DIY investors who want automation without surrendering control' },
];

function ResourcesTab() {
  return (
    <div>
      <div style={{ padding:'0.875rem 1rem', background:'rgba(0,180,198,0.06)', border:'1px solid rgba(0,180,198,0.2)', borderRadius:12, marginBottom:'1.25rem', display:'flex', gap:10, alignItems:'flex-start' }}>
        <Info size={15} color={TEAL} style={{ flexShrink:0, marginTop:1 }}/>
        <p style={{ margin:0, fontSize:'0.875rem', color:T2, lineHeight:1.7, fontFamily:UI }}>
          <strong>How to choose:</strong> For most investors, a simple 3-fund portfolio (US stocks, international stocks, bonds) at Fidelity or Vanguard beats 90% of actively managed strategies. Complexity is not sophistication.
        </p>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        {RESOURCES.map((r, i) => (
          <div key={i} style={{ background:SURF, border:`1px solid ${B1}`, borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ padding:'0.875rem 1.125rem', borderBottom:'1px solid #f0f0f0', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontFamily:DISP, fontSize:'1rem', fontWeight:700, color:NAVY }}>{r.name}</span>
                <span style={{ padding:'2px 10px', background:`${r.badgeColor}15`, border:`1px solid ${r.badgeColor}35`, borderRadius:100, fontSize:'0.6875rem', fontWeight:700, color:r.badgeColor, fontFamily:UI, letterSpacing:'0.03em' }}>{r.badge}</span>
              </div>
            </div>
            <div style={{ padding:'0.875rem 1.125rem' }}>
              <p style={{ margin:'0 0 0.75rem', fontSize:'0.875rem', color:T2, lineHeight:1.7, fontFamily:UI }}>{r.desc}</p>
              <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:'0.25rem 0.75rem', fontSize:'0.8125rem', fontFamily:UI }}>
                <span style={{ color:T3, fontWeight:600 }}>Cost</span><span style={{ color:T2 }}>{r.cost}</span>
                <span style={{ color:T3, fontWeight:600 }}>Best for</span><span style={{ color:T2 }}>{r.best}</span>
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
  { id:'learn',     label:'Learn',     icon: BookOpen     },
  { id:'calc',      label:'Calculate', icon: Calculator   },
  { id:'resources', label:'Resources', icon: ExternalLink },
];

export default function Investing() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('learn');

  return (
    <div style={{ minHeight:'100vh', background:BG, fontFamily:UI }}>

      <div style={{ background:SURF, borderBottom:`1px solid `, padding:'2rem 2.5rem 0' }}>
        <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.35)', marginBottom:'1rem', display:'flex', alignItems:'center', gap:6 }}>
          <button onClick={() => navigate('/fun')} style={{ background:'none', border:'none', cursor:'pointer', color:TEAL, fontSize:'0.75rem', fontFamily:UI, padding:0 }}>Dashboard</button>
          <ChevronRight size={12} color="rgba(255,255,255,0.25)"/>
          <span style={{ fontFamily:UI }}>Investing & Accounts</span>
        </div>
        <h1 style={{ fontFamily:DISP, fontSize:'2rem', fontWeight:700, color:'#fff', margin:'0 0 0.5rem', letterSpacing:'-0.025em', lineHeight:1.2 }}>
          Investing & Accounts
        </h1>
        <p style={{ margin:'0 0 1.75rem', fontSize:'1rem', color:'rgba(255,255,255,0.55)', lineHeight:1.65, maxWidth:580, fontFamily:UI }}>
          Master every account type, learn what to invest in, discover the right order to fund your accounts, and see how compounding and fees shape your future.
        </p>
        <div style={{ display:'flex', gap:0, borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
          {TABS.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                display:'flex', alignItems:'center', gap:7, padding:'0.75rem 1.25rem',
                background:'none', border:'none', borderBottom:`2px solid ${active?TEAL:'transparent'}`,
                cursor:'pointer', fontFamily:UI, fontSize:'0.875rem',
                fontWeight:active?700:500, color:active?TEAL:'rgba(255,255,255,0.45)',
                marginBottom:-1, transition:'color 0.15s', whiteSpace:'nowrap',
              }}><Icon size={14}/>{t.label}</button>
            );
          })}
        </div>
      </div>

      <div style={{ padding:'2rem 2.5rem', maxWidth:860, margin:'0 auto' }}>

        {tab === 'learn' && (
          <>
            <SectionCard title="Account Types — Complete Guide" subtitle="Click any account to expand contribution limits, tax treatment, withdrawal rules, and who it's best for.">
              <AccountCards/>
            </SectionCard>
            <SectionCard title="Which Account Should I Fund First?" subtitle="Follow this waterfall to maximize every tax advantage before moving to the next step.">
              <FundingWaterfall/>
            </SectionCard>
            <SectionCard title="Asset Classes Explained" subtitle="What are you actually buying when you invest? Click each asset class to learn what it is, its risk/return profile, and key insights.">
              <AssetClasses/>
            </SectionCard>
            <SectionCard title="Risk Tolerance Quiz" subtitle="Answer 4 questions to get a suggested asset allocation tailored to your time horizon and comfort with volatility.">
              <RiskQuiz/>
            </SectionCard>
          </>
        )}

        {tab === 'calc' && (
          <>
            <SectionCard title="Compound Interest Calculator" subtitle="See how your money grows over time with initial investment, monthly contributions, and a given annual return.">
              <CompoundCalc/>
            </SectionCard>
            <SectionCard title="Investment Fee Impact Calculator" subtitle="Fees are silent killers of long-term wealth. See how 0.03% vs 2% expense ratios compound against you over decades.">
              <FeeImpactCalc/>
            </SectionCard>
            <SectionCard title="Roth vs Traditional IRA Comparison" subtitle="Which gives you more money after tax? It depends on your current vs expected future tax bracket.">
              <RothVsTraditional/>
            </SectionCard>
          </>
        )}

        {tab === 'resources' && <ResourcesTab/>}

        <div onClick={() => navigate('/fun/insurance')} style={{ marginTop:'2rem', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 1.25rem', background:RAISE, borderRadius:12, cursor:'pointer', transition:'opacity 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.opacity='0.88'} onMouseLeave={e => e.currentTarget.style.opacity='1'}>
          <div>
            <div style={{ fontSize:'0.6875rem', color:'rgba(255,255,255,0.4)', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:3, fontFamily:UI }}>Next section</div>
            <div style={{ fontFamily:DISP, fontSize:'1rem', fontWeight:600, color:'#fff' }}>Insurance Planning</div>
          </div>
          <ArrowRight size={18} color={TEAL}/>
        </div>

        <p style={{ marginTop:'2rem', fontSize:'0.6875rem', color:T3, textAlign:'center', lineHeight:1.6, fontFamily:UI }}>
          For educational purposes only — not financial, investment, tax, or legal advice.
        </p>
      </div>
    </div>
  );
}
