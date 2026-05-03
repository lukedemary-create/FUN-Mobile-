import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, ChevronRight, Info, CheckCircle2, XCircle,
  AlertCircle, BookOpen, Calculator, ExternalLink, ArrowRight,
  TrendingUp, DollarSign, Calendar, Shield,
} from 'lucide-react';

const TEAL  = '#00B4C6';
const NAVY  = '#0A1F44';
const BG    = '#F4F7FA';

/* ── Shared ───────────────────────────────────────────────────────── */
function SectionCard({ title, subtitle, children }) {
  return (
    <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:16, padding:'1.5rem', boxShadow:'0 1px 6px rgba(0,0,0,0.05)', marginBottom:'1.25rem' }}>
      {(title||subtitle) && (
        <div style={{ marginBottom:'1.25rem' }}>
          {title && <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.25rem', fontWeight:700, color:NAVY, margin:'0 0 0.25rem', letterSpacing:'-0.02em' }}>{title}</h3>}
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

function NumInput({ label, value, onChange, prefix='$', suffix, min=0, step=1000, hint, max }) {
  return (
    <div style={{ marginBottom:'1rem' }}>
      {label && <label style={{ display:'block', fontSize:'0.8125rem', fontWeight:600, color:NAVY, marginBottom:'0.375rem', fontFamily:"'DM Sans',sans-serif" }}>{label}</label>}
      <div style={{ position:'relative' }}>
        {prefix && <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#9ca3af', fontSize:'0.875rem', pointerEvents:'none' }}>{prefix}</span>}
        <input type="number" value={value} min={min} max={max} step={step} onChange={e => onChange(Number(e.target.value))}
          style={{ width:'100%', padding:`9px ${suffix?'2.25rem':'0.75rem'} 9px ${prefix?'1.5rem':'0.75rem'}`, border:'1.5px solid #e5e7eb', borderRadius:9, fontSize:'1rem', fontFamily:"'DM Sans',sans-serif", color:NAVY, fontWeight:600, background:'#fafafa', boxSizing:'border-box' }}
          onFocus={e => e.target.style.borderColor=TEAL} onBlur={e => e.target.style.borderColor='#e5e7eb'}/>
        {suffix && <span style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', color:'#9ca3af', fontSize:'0.875rem', pointerEvents:'none' }}>{suffix}</span>}
      </div>
      {hint && <p style={{ margin:'0.25rem 0 0', fontSize:'0.75rem', color:'#9ca3af', fontFamily:"'DM Sans',sans-serif" }}>{hint}</p>}
    </div>
  );
}

function ResultBox({ label, value, color = TEAL, size = 'md' }) {
  return (
    <div style={{ background:`${color}0d`, border:`1px solid ${color}25`, borderRadius:12, padding: size==='lg'?'1.25rem':'0.875rem 1rem', textAlign:'center' }}>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize: size==='lg'?'2rem':'1.375rem', fontWeight:700, color, letterSpacing:'-0.02em', lineHeight:1.1 }}>{value}</div>
      <div style={{ fontSize:'0.75rem', color:'#6b7280', marginTop:4, fontFamily:"'DM Sans',sans-serif", fontWeight:500 }}>{label}</div>
    </div>
  );
}

function Pill({ text, color = '#6b7280' }) {
  return (
    <span style={{ display:'inline-block', padding:'2px 10px', borderRadius:20, background:`${color}15`, color, fontSize:'0.7rem', fontWeight:700, fontFamily:"'DM Sans',sans-serif", letterSpacing:'0.04em', textTransform:'uppercase' }}>{text}</span>
  );
}

function fmt(n) { return '$' + Math.round(Math.abs(n)).toLocaleString(); }

/* ══════════════════════════════════════════════════════════════════
   LEARN — ACCOUNT TYPES
══════════════════════════════════════════════════════════════════ */
function AccountTypesLearn() {
  const accounts = [
    {
      name: '401(k) / 403(b) / 457',
      color: TEAL,
      badge: 'Employer plan',
      limit2026: '$24,500 ($32,500 if 50+; ages 60–63: $35,750)',
      taxType: 'Pre-tax (Traditional) or After-tax (Roth)',
      match: true,
      pros: ['Highest contribution limits of any retirement account', 'Employer match is free money — always contribute enough to get the full match first', 'Automatic payroll deduction makes it effortless', '403(b) for nonprofits/schools, 457 for government workers'],
      cons: ['Investment options limited to what plan offers', 'Required Minimum Distributions (RMDs) at age 73', 'Early withdrawal penalty of 10% before age 59½'],
      best: 'Your first stop for retirement savings. Max the match before anything else.',
    },
    {
      name: 'Traditional IRA',
      color: '#8b5cf6',
      badge: 'Individual account',
      limit2026: '$7,500 ($8,600 if 50+)',
      taxType: 'Pre-tax (may be deductible)',
      match: false,
      pros: ['Open at any brokerage — full control over investments', 'Tax-deductible contributions (if income limits met)', 'Wider investment selection than most 401(k)s', 'Rollover destination for old 401(k)s'],
      cons: ['Lower contribution limit than 401(k)', 'Deductibility phases out at higher incomes if covered by workplace plan', 'RMDs required at age 73', '10% early withdrawal penalty before 59½'],
      best: 'Good secondary account after maxing employer match. Especially useful for rollovers.',
    },
    {
      name: 'Roth IRA',
      color: '#22c55e',
      badge: 'Best for most',
      limit2026: '$7,500 ($8,600 if 50+)',
      taxType: 'After-tax — tax-free growth & withdrawals',
      match: false,
      pros: ['Tax-free growth and tax-free withdrawals in retirement', 'No RMDs — money can grow indefinitely', 'Contributions (not earnings) can be withdrawn anytime penalty-free', 'More flexible than any other retirement account'],
      cons: ['Income limits: phases out at $153K–$168K (single) / $242K–$252K (married) in 2026', 'No upfront tax deduction', 'Lower contribution limit than 401(k)', 'Earnings subject to penalty if withdrawn before 59½ and 5-year rule'],
      best: 'The most powerful retirement account for most people. Prioritize after getting the employer match.',
    },
    {
      name: 'SEP IRA',
      color: '#f59e0b',
      badge: 'Self-employed',
      limit2026: 'Up to $72,000 (25% of net self-employment income)',
      taxType: 'Pre-tax',
      match: false,
      pros: ['Massive contribution limits for high-earning self-employed individuals', 'Simple to open and administer', 'Contributions are tax-deductible', 'No annual filing requirements'],
      cons: ['Must contribute same percentage for all eligible employees', 'No Roth option', 'RMDs required at 73', 'Contribution based on net self-employment income'],
      best: 'Freelancers, consultants, and sole proprietors with high income and no employees.',
    },
    {
      name: 'Solo 401(k)',
      color: '#ec4899',
      badge: 'Self-employed',
      limit2026: 'Up to $72,000 ($80,000 if 50+)',
      taxType: 'Pre-tax or Roth',
      match: false,
      pros: ['Highest limits of any self-employed option', 'Both employee and employer contributions', 'Roth option available', 'Loan provisions available'],
      cons: ['Must have no full-time employees (except spouse)', 'More administrative complexity than SEP IRA', 'Annual Form 5500 filing required when assets exceed $250K'],
      best: 'Self-employed with no employees who want to maximize contributions, especially at lower income levels where SEP IRA falls short.',
    },
  ];

  const [active, setActive] = useState('401k');
  const map = { '401k': accounts[0], 'tira': accounts[1], 'rira': accounts[2], 'sep': accounts[3], 'solo': accounts[4] };
  const keys = ['401k','tira','rira','sep','solo'];
  const labels = { '401k':'401(k)/403(b)', tira:'Traditional IRA', rira:'Roth IRA', sep:'SEP IRA', solo:'Solo 401(k)' };
  const acct = map[active];

  return (
    <div>
      <p style={{ margin:'0 0 1.25rem', fontSize:'0.9375rem', color:'#374151', lineHeight:1.75, fontFamily:"'DM Sans',sans-serif" }}>
        Retirement accounts are the most powerful wealth-building tools available. They offer tax advantages — either on contributions now (Traditional) or withdrawals later (Roth) — that dramatically accelerate compounding.
      </p>

      {/* Account selector */}
      <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginBottom:'1.25rem' }}>
        {keys.map(k => (
          <button key={k} onClick={() => setActive(k)} style={{
            padding:'7px 14px', borderRadius:99, border:`1.5px solid ${active===k ? map[k].color : '#e5e7eb'}`,
            background: active===k ? map[k].color : '#fff', cursor:'pointer',
            fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem',
            fontWeight: active===k ? 700 : 500, color: active===k ? '#fff' : '#6b7280',
            transition:'all 0.15s', whiteSpace:'nowrap',
          }}>{labels[k]}</button>
        ))}
      </div>

      {/* Account detail */}
      <div style={{ border:`1.5px solid ${acct.color}30`, borderRadius:14, padding:'1.25rem', marginBottom:'1.25rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
          <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, color:NAVY, fontSize:'1.125rem' }}>{acct.name}</span>
          <Pill text={acct.badge} color={acct.color}/>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem', marginBottom:'1rem', fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem' }}>
          <div style={{ background:'#f9fafb', borderRadius:9, padding:'0.625rem 0.75rem' }}>
            <div style={{ color:'#9ca3af', fontWeight:600, marginBottom:2 }}>2026 Limit</div>
            <div style={{ color:NAVY, fontWeight:700 }}>{acct.limit2026}</div>
          </div>
          <div style={{ background:'#f9fafb', borderRadius:9, padding:'0.625rem 0.75rem' }}>
            <div style={{ color:'#9ca3af', fontWeight:600, marginBottom:2 }}>Tax Treatment</div>
            <div style={{ color:NAVY, fontWeight:700 }}>{acct.taxType}</div>
          </div>
        </div>
        {acct.match && (
          <div style={{ display:'flex', gap:8, padding:'0.5rem 0.75rem', background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', color:'#374151', marginBottom:'0.875rem' }}>
            <CheckCircle2 size={14} color='#22c55e' style={{ flexShrink:0, marginTop:1 }}/>
            <strong style={{ color:'#15803d' }}>Employer match available — always contribute enough to get 100% of the match. It's an instant 50–100% return.</strong>
          </div>
        )}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', fontSize:'0.8rem', fontFamily:"'DM Sans',sans-serif" }}>
          <div>
            <div style={{ fontWeight:700, color:'#22c55e', marginBottom:4 }}>Pros</div>
            {acct.pros.map(p => (
              <div key={p} style={{ display:'flex', gap:6, alignItems:'flex-start', marginBottom:4, color:'#374151' }}>
                <CheckCircle2 size={12} color='#22c55e' style={{ flexShrink:0, marginTop:2 }}/>{p}
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight:700, color:'#ef4444', marginBottom:4 }}>Cons</div>
            {acct.cons.map(c => (
              <div key={c} style={{ display:'flex', gap:6, alignItems:'flex-start', marginBottom:4, color:'#374151' }}>
                <XCircle size={12} color='#ef4444' style={{ flexShrink:0, marginTop:2 }}/>{c}
              </div>
            ))}
          </div>
        </div>
        <div style={{ background:`${acct.color}0d`, border:`1px solid ${acct.color}20`, borderRadius:8, padding:'0.5rem 0.75rem', fontSize:'0.8rem', color:'#374151', fontFamily:"'DM Sans',sans-serif", marginTop:'0.875rem' }}>
          <strong style={{ color:acct.color }}>Best for: </strong>{acct.best}
        </div>
      </div>

      <SectionCard title="Priority Order: Where to Put Money First">
        {[
          { step:'1', label:'401(k) up to employer match', color:'#22c55e', note:'Free money. Always capture 100% of any employer match before doing anything else.' },
          { step:'2', label:'Max your Roth IRA ($7,500)', color:TEAL, note:'Tax-free growth for life. Most flexible and powerful long-term account for most people.' },
          { step:'3', label:'Max your 401(k) ($24,500)', color:'#8b5cf6', note:'After the Roth, go back and fill up your 401(k) to the annual limit.' },
          { step:'4', label:'Taxable brokerage account', color:'#f59e0b', note:'Once tax-advantaged accounts are maxed, invest in a regular brokerage. Still powerful with index funds.' },
        ].map(row => (
          <div key={row.step} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'0.625rem 0', borderBottom:'1px solid #f3f4f6' }}>
            <div style={{ width:26, height:26, borderRadius:'50%', background:row.color, color:'#fff', fontWeight:700, fontSize:'0.8125rem', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:"'DM Sans',sans-serif" }}>{row.step}</div>
            <div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', fontWeight:700, color:NAVY }}>{row.label}</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', color:'#6b7280', lineHeight:1.6 }}>{row.note}</div>
            </div>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LEARN — SOCIAL SECURITY
══════════════════════════════════════════════════════════════════ */
function SocialSecurityLearn() {
  const ages = [
    { age:'62', label:'Early (reduced)', color:'#ef4444', benefit:'Up to 30% permanent reduction from your full benefit. No earnings limit concerns after FRA.', when:'Only if you have health concerns, no other income, or need the money. The reduction is permanent.' },
    { age:'67', label:'Full Retirement Age (FRA)', color:TEAL, benefit:'100% of your earned benefit. The standard baseline for planning.', when:'The default benchmark. If you\'re in average health and have other income to bridge the gap, waiting longer still pays off.' },
    { age:'70', label:'Maximum benefit', color:'#22c55e', benefit:'8% per year delayed credit from FRA — up to 24–32% more than your FRA benefit.', when:'If you\'re in good health, have assets to live on, and expect an average or longer lifespan. The break-even is typically age 80–82.' },
  ];

  return (
    <div>
      <p style={{ margin:'0 0 1.25rem', fontSize:'0.9375rem', color:'#374151', lineHeight:1.75, fontFamily:"'DM Sans',sans-serif" }}>
        Social Security is a guaranteed, inflation-adjusted income stream you'll receive for life. When you claim matters enormously — the difference between claiming at 62 vs 70 can exceed <strong>$200,000 in lifetime benefits</strong>.
      </p>

      <SectionCard title="When to Claim: The Age Decision">
        {ages.map(a => (
          <div key={a.age} style={{ padding:'0.875rem 0', borderBottom:'1px solid #f3f4f6' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:5 }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', fontWeight:700, color:a.color }}>{a.age}</div>
              <Pill text={a.label} color={a.color}/>
            </div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8375rem', color:'#374151', lineHeight:1.65, marginBottom:4 }}>{a.benefit}</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8rem', color:'#6b7280', lineHeight:1.6 }}><strong style={{ color:NAVY }}>Choose this if:</strong> {a.when}</div>
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Key Social Security Facts">
        {[
          { label:'Benefit calculation', detail:'Based on your highest 35 years of earnings. Years with no income count as $0 — work at least 35 years to avoid zeros dragging down your average.' },
          { label:'Cost-of-living adjustments (COLA)', detail:'SS benefits increase annually with inflation (COLA). In 2024, the COLA was 3.2%. This is why SS is valuable — it\'s inflation-protected income for life.' },
          { label:'Spousal benefit', detail:'A non-working or lower-earning spouse can claim up to 50% of the higher earner\'s FRA benefit, even without their own work record.' },
          { label:'Survivor benefit', detail:'If your spouse dies, the survivor receives the higher of the two benefit amounts. This makes delaying the higher earner\'s benefit especially valuable.' },
          { label:'Earnings test (before FRA)', detail:'If you claim before FRA and continue working, benefits are temporarily reduced if earnings exceed $24,480 (2026). This goes away at FRA.' },
          { label:'Taxation of benefits', detail:'Up to 85% of SS benefits may be taxable if your combined income exceeds $34K (single) or $44K (married). Plan withdrawals from taxable accounts accordingly.' },
        ].map(f => (
          <div key={f.label} style={{ padding:'0.625rem 0', borderBottom:'1px solid #f3f4f6' }}>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', fontWeight:700, color:NAVY, marginBottom:2 }}>{f.label}</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', color:'#6b7280', lineHeight:1.65 }}>{f.detail}</div>
          </div>
        ))}
        <InfoBox>Create a free account at ssa.gov/myaccount to see your actual earnings history and projected benefit estimates at ages 62, 67, and 70.</InfoBox>
      </SectionCard>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LEARN — WITHDRAWAL RULES
══════════════════════════════════════════════════════════════════ */
function WithdrawalLearn() {
  return (
    <div>
      <p style={{ margin:'0 0 1.25rem', fontSize:'0.9375rem', color:'#374151', lineHeight:1.75, fontFamily:"'DM Sans',sans-serif" }}>
        Knowing when and how to withdraw from retirement accounts — and in what order — is just as important as saving. Poor withdrawal sequencing can cost tens of thousands in unnecessary taxes.
      </p>

      <SectionCard title="Early Withdrawal (Before Age 59½)">
        <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:10, padding:'0.875rem 1rem', marginBottom:'1rem', fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', color:'#374151', display:'flex', gap:10 }}>
          <AlertCircle size={16} color='#ef4444' style={{ flexShrink:0, marginTop:1 }}/>
          <div>Withdrawing from a Traditional 401(k) or IRA before 59½ triggers a <strong style={{ color:'#ef4444' }}>10% penalty plus ordinary income tax</strong>. On a $50,000 withdrawal, you could lose $20,000+.</div>
        </div>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', fontWeight:700, color:NAVY, marginBottom:8 }}>Exceptions to the 10% penalty:</div>
        {[
          'Death or permanent disability',
          'Substantially Equal Periodic Payments (SEPP / Rule 72(t))',
          'First-time home purchase (IRA only, up to $10,000 lifetime)',
          'Higher education expenses (IRA only)',
          'Medical expenses exceeding 7.5% of AGI',
          'Health insurance premiums while unemployed (IRA only)',
          'Age 55 separation from service (401(k) only)',
          'Qualified domestic relations order (divorce)',
        ].map(e => (
          <div key={e} style={{ display:'flex', gap:7, alignItems:'flex-start', marginBottom:5, fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', color:'#374151' }}>
            <CheckCircle2 size={13} color={TEAL} style={{ flexShrink:0, marginTop:2 }}/>{e}
          </div>
        ))}
        <InfoBox color='#8b5cf6'>Roth IRA contributions (not earnings) can always be withdrawn penalty-free at any age — this is one of the Roth's great advantages as an emergency backstop.</InfoBox>
      </SectionCard>

      <SectionCard title="Required Minimum Distributions (RMDs)">
        <p style={{ margin:'0 0 0.875rem', fontSize:'0.8375rem', color:'#374151', lineHeight:1.65, fontFamily:"'DM Sans',sans-serif" }}>
          The IRS requires you to start withdrawing from Traditional IRAs and 401(k)s at age 73 (SECURE 2.0 Act). RMDs are calculated based on your account balance and IRS life expectancy tables.
        </p>
        {[
          { label:'Applies to', detail:'Traditional IRA, 401(k), 403(b), 457, SEP IRA, SIMPLE IRA. NOT Roth IRAs (but Roth 401(k)s had RMDs until 2024).' },
          { label:'Starting age', detail:'Age 73 if born 1951–1959. Age 75 if born 1960 or later (under SECURE 2.0).' },
          { label:'Penalty for missing', detail:'25% excise tax on the amount you should have withdrawn (reduced to 10% if corrected timely).' },
          { label:'Strategy', detail:'Consider Roth conversions in your 60s to reduce Traditional IRA balances and future RMD amounts before they start.' },
        ].map(r => (
          <div key={r.label} style={{ padding:'0.625rem 0', borderBottom:'1px solid #f3f4f6' }}>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', fontWeight:700, color:NAVY, marginBottom:2 }}>{r.label}</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', color:'#6b7280', lineHeight:1.65 }}>{r.detail}</div>
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Withdrawal Order Strategy (Tax Efficiency)">
        <p style={{ margin:'0 0 0.875rem', fontSize:'0.8375rem', color:'#374151', lineHeight:1.65, fontFamily:"'DM Sans',sans-serif" }}>
          The sequence you withdraw from accounts matters for taxes. A common approach:
        </p>
        {[
          { step:'1', label:'RMDs first', note:'If age 73+, take required minimums from Traditional accounts to avoid the penalty.', color:'#ef4444' },
          { step:'2', label:'Taxable brokerage accounts', note:'Withdraw from taxable accounts next. Favorable long-term capital gains rates if held 1+ year.', color:'#f59e0b' },
          { step:'3', label:'Traditional IRA / 401(k)', note:'Taxed as ordinary income. Withdraw enough to fill lower tax brackets efficiently.', color:TEAL },
          { step:'4', label:'Roth IRA last', note:'Let tax-free money grow as long as possible. No RMDs. Ideal for legacy or late-retirement withdrawals.', color:'#22c55e' },
        ].map(row => (
          <div key={row.step} style={{ display:'flex', gap:12, padding:'0.625rem 0', borderBottom:'1px solid #f3f4f6', alignItems:'flex-start' }}>
            <div style={{ width:26, height:26, borderRadius:'50%', background:row.color, color:'#fff', fontWeight:700, fontSize:'0.8125rem', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:"'DM Sans',sans-serif" }}>{row.step}</div>
            <div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', fontWeight:700, color:NAVY }}>{row.label}</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', color:'#6b7280', lineHeight:1.6 }}>{row.note}</div>
            </div>
          </div>
        ))}
        <InfoBox>Roth conversions in your 60s — before RMDs and Social Security begin — can dramatically reduce lifetime taxes. This is a high-value strategy worth discussing with a tax advisor.</InfoBox>
      </SectionCard>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LEARN — THE 4% RULE & INCOME PLANNING
══════════════════════════════════════════════════════════════════ */
function IncomeLearn() {
  return (
    <div>
      <p style={{ margin:'0 0 1.25rem', fontSize:'0.9375rem', color:'#374151', lineHeight:1.75, fontFamily:"'DM Sans',sans-serif" }}>
        Accumulating a retirement nest egg is only half the challenge. The other half is making it last 20–30+ years. That requires understanding safe withdrawal rates and how to structure retirement income.
      </p>

      <SectionCard title="The 4% Rule">
        <div style={{ background:`${TEAL}0d`, border:`1px solid ${TEAL}25`, borderRadius:12, padding:'1rem 1.125rem', marginBottom:'1rem', fontFamily:"'DM Sans',sans-serif" }}>
          <div style={{ fontSize:'0.875rem', fontWeight:700, color:NAVY, marginBottom:6 }}>What it says</div>
          <div style={{ fontSize:'0.8375rem', color:'#374151', lineHeight:1.65 }}>
            If you withdraw 4% of your portfolio in year one, then adjust for inflation each year after, your portfolio has historically lasted 30 years with a high probability of success — even through major market downturns.
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.625rem', marginBottom:'1rem' }}>
          {[
            { spend:'$40,000/yr', need:'$1,000,000', color:'#22c55e' },
            { spend:'$60,000/yr', need:'$1,500,000', color:TEAL },
            { spend:'$80,000/yr', need:'$2,000,000', color:'#8b5cf6' },
            { spend:'$100,000/yr', need:'$2,500,000', color:'#f59e0b' },
            { spend:'$120,000/yr', need:'$3,000,000', color:'#ec4899' },
            { spend:'$150,000/yr', need:'$3,750,000', color:'#ef4444' },
          ].map(r => (
            <div key={r.spend} style={{ background:`${r.color}0d`, border:`1px solid ${r.color}20`, borderRadius:10, padding:'0.625rem 0.75rem', textAlign:'center' }}>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.75rem', color:'#6b7280', marginBottom:2 }}>Spend {r.spend}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', fontWeight:700, color:r.color }}>{r.need}</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.7rem', color:'#9ca3af' }}>needed</div>
            </div>
          ))}
        </div>
        <InfoBox color='#f59e0b'>The 4% rule assumes a 30-year retirement with a balanced portfolio. If you retire early (40s–50s) or want more safety, consider 3–3.5%. If retiring at 65+ with other income streams, 4–5% may be appropriate.</InfoBox>
      </SectionCard>

      <SectionCard title="Retirement Income Sources — Building the Stack">
        {[
          { source:'Social Security', type:'Guaranteed', color:'#22c55e', note:'Inflation-adjusted for life. Delay to 70 for maximum benefit. Forms the base of most retirement income plans.' },
          { source:'Pension (if applicable)', type:'Guaranteed', color:'#22c55e', note:'Defined benefit plan from an employer. Increasingly rare. Consider survivor benefit options carefully.' },
          { source:'Traditional IRA / 401(k)', type:'Taxable', color:TEAL, note:'Taxed as ordinary income when withdrawn. RMDs start at 73. The most common retirement savings vehicle.' },
          { source:'Roth IRA', type:'Tax-free', color:'#8b5cf6', note:'Tax-free withdrawals. No RMDs. Best used last to maximize tax-free compounding or as legacy assets.' },
          { source:'Taxable Brokerage', type:'Capital gains', color:'#f59e0b', note:'Favorable long-term capital gains rates. Flexible — no restrictions on withdrawals. Good bridge account.' },
          { source:'Rental Income', type:'Semi-passive', color:'#ec4899', note:'Inflation-hedged income if managed well. Requires active management or property manager costs.' },
          { source:'Part-time work', type:'Earned', color:'#6b7280', note:'Even $10–20K/year from part-time work dramatically reduces portfolio withdrawal needs in early retirement.' },
        ].map(r => (
          <div key={r.source} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'0.625rem 0', borderBottom:'1px solid #f3f4f6' }}>
            <Pill text={r.type} color={r.color}/>
            <div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', fontWeight:700, color:NAVY, marginBottom:2 }}>{r.source}</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', color:'#6b7280', lineHeight:1.6 }}>{r.note}</div>
            </div>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CALCULATOR — Retirement Savings Goal
══════════════════════════════════════════════════════════════════ */
function RetirementCalc() {
  const [currentAge,    setCurrentAge]    = useState(35);
  const [retireAge,     setRetireAge]     = useState(65);
  const [currentSaved,  setCurrentSaved]  = useState(50000);
  const [monthlyContrib,setMonthlyContrib]= useState(1000);
  const [annualReturn,  setAnnualReturn]  = useState(7);
  const [desiredIncome, setDesiredIncome] = useState(70000);
  const [ssEstimate,    setSsEstimate]    = useState(20000);

  const years = Math.max(0, retireAge - currentAge);
  const r = annualReturn / 100 / 12;
  const n = years * 12;

  // Future value of current savings
  const fvCurrent = currentSaved * Math.pow(1 + annualReturn/100, years);
  // Future value of monthly contributions
  const fvContribs = r > 0 ? monthlyContrib * ((Math.pow(1+r,n)-1)/r) : monthlyContrib*n;
  const total = fvCurrent + fvContribs;

  const neededIncome = Math.max(0, desiredIncome - ssEstimate);
  const needed = neededIncome / 0.04; // 4% rule
  const gap = needed - total;
  const onTrack = gap <= 0;

  // Monthly needed to close gap
  const monthlyNeeded = gap > 0 && r > 0 && n > 0
    ? gap / ((Math.pow(1+r,n)-1)/r)
    : 0;

  return (
    <SectionCard title="Retirement Savings Goal Calculator" subtitle="Estimate how much you'll have at retirement and whether you're on track.">
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 1.25rem' }}>
        <NumInput label="Current Age" value={currentAge} onChange={setCurrentAge} prefix="" step={1} min={18} max={80}/>
        <NumInput label="Target Retirement Age" value={retireAge} onChange={setRetireAge} prefix="" step={1} min={50} max={80}/>
        <NumInput label="Current Retirement Savings" value={currentSaved} onChange={setCurrentSaved}/>
        <NumInput label="Monthly Contribution" value={monthlyContrib} onChange={setMonthlyContrib} step={100}/>
        <NumInput label="Expected Annual Return" value={annualReturn} onChange={setAnnualReturn} prefix="" suffix="%" step={0.5} min={1} max={15} hint="Historical stock market average: ~7% after inflation"/>
        <NumInput label="Desired Annual Income in Retirement" value={desiredIncome} onChange={setDesiredIncome} hint="In today's dollars"/>
        <NumInput label="Expected Annual Social Security" value={ssEstimate} onChange={setSsEstimate} hint="Check ssa.gov/myaccount for your estimate"/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.75rem', margin:'0.5rem 0 1.25rem' }}>
        <ResultBox label="Projected Portfolio" value={`$${(total/1e6).toFixed(2)}M`} color={TEAL}/>
        <ResultBox label="Portfolio Needed (4% rule)" value={`$${(needed/1e6).toFixed(2)}M`} color={NAVY} size="lg"/>
        <ResultBox label={onTrack ? 'Surplus' : 'Gap'} value={`$${(Math.abs(gap)/1e6).toFixed(2)}M`} color={onTrack ? '#22c55e' : '#ef4444'}/>
      </div>

      {onTrack ? (
        <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:12, padding:'1rem', fontFamily:"'DM Sans',sans-serif" }}>
          <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
            <CheckCircle2 size={16} color='#22c55e' style={{ flexShrink:0, marginTop:2 }}/>
            <div>
              <div style={{ fontSize:'0.875rem', fontWeight:700, color:'#15803d', marginBottom:3 }}>You're on track!</div>
              <div style={{ fontSize:'0.8125rem', color:'#374151', lineHeight:1.65 }}>
                Your projected portfolio of <strong>{fmt(total)}</strong> exceeds the <strong>{fmt(needed)}</strong> needed to support {fmt(neededIncome)}/year in retirement income (after Social Security). Keep it up.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:12, padding:'1rem', fontFamily:"'DM Sans',sans-serif" }}>
          <div style={{ fontSize:'0.875rem', fontWeight:700, color:'#ef4444', marginBottom:4 }}>Savings Gap: {fmt(gap)}</div>
          <div style={{ fontSize:'0.8125rem', color:'#374151', lineHeight:1.65, marginBottom:8 }}>
            To close this gap, you'd need to increase monthly contributions by approximately <strong style={{ color:'#ef4444' }}>{fmt(monthlyNeeded)}/month</strong> — or adjust your retirement age, income goal, or return assumption.
          </div>
          <div style={{ fontSize:'0.8rem', color:'#6b7280' }}>Other options: delay retirement by a few years, reduce desired income, work part-time in early retirement, or maximize tax-advantaged accounts.</div>
        </div>
      )}

      <InfoBox color='#f59e0b'>This calculator uses the 4% rule and assumes constant returns. Real markets fluctuate. Run this alongside a detailed plan with a financial planner for accuracy.</InfoBox>
    </SectionCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CALCULATOR — Social Security Break-Even
══════════════════════════════════════════════════════════════════ */
function SSBreakEvenCalc() {
  const [fraMonthly, setFraMonthly] = useState(2000);
  const [claimAge,   setClaimAge]   = useState(62);

  // Simplified: FRA = 67
  const FRA = 67;
  const yearsEarly = Math.max(0, FRA - claimAge);
  const yearsLate  = Math.max(0, claimAge - FRA);

  let multiplier;
  if (claimAge <= FRA) {
    // Each year early reduces by ~6.67% (up to 36 months) then 5% after
    const months = yearsEarly * 12;
    const first36 = Math.min(36, months) * (5/9/100);
    const after36 = Math.max(0, months - 36) * (5/12/100);
    multiplier = 1 - first36 - after36;
  } else {
    multiplier = 1 + yearsLate * 0.08;
  }

  const adjustedMonthly = Math.round(fraMonthly * multiplier);
  const fraMonthlyVal   = fraMonthly;

  // Break-even vs FRA
  let breakEvenAge = null;
  if (claimAge !== FRA) {
    // cumulative diff: months claiming early * adjusted vs months at FRA
    // solve for age where cumulative = 0
    // If claiming early: adjustedMonthly * t = fraMonthly * (t - yearsEarly*12)
    // adjusted * t = fra * t - fra * yearsEarly*12
    // t(adjusted - fra) = -fra * yearsEarly * 12
    // t = fra * yearsEarly * 12 / (fra - adjusted)  months from claim start
    if (claimAge < FRA) {
      const monthsDiff = fraMonthly - adjustedMonthly;
      if (monthsDiff > 0) {
        const monthsToCatch = (adjustedMonthly * yearsEarly * 12) / monthsDiff;
        breakEvenAge = claimAge + monthsToCatch / 12;
      }
    } else {
      // claiming late: adjustedMonthly * t = fraMonthly * (t + yearsLate*12)
      // t(adjusted - fra) = fra * yearsLate * 12
      // t = fra * yearsLate * 12 / (adjusted - fra)
      const monthsDiff = adjustedMonthly - fraMonthly;
      if (monthsDiff > 0) {
        const monthsToCatch = (fraMonthly * yearsLate * 12) / monthsDiff;
        breakEvenAge = claimAge + monthsToCatch / 12;
      }
    }
  }

  const lifetime62to90 = claimAge <= 62 ? adjustedMonthly * 12 * (90 - 62) : (claimAge < 90 ? adjustedMonthly * 12 * (90 - claimAge) : 0);
  const lifetimeFRA90  = fraMonthlyVal * 12 * (90 - FRA);

  return (
    <SectionCard title="Social Security Claiming Age Comparison" subtitle="See how your monthly benefit changes based on when you claim, and when the break-even point occurs.">
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 1.25rem' }}>
        <NumInput label="Your FRA Monthly Benefit ($)" value={fraMonthly} onChange={setFraMonthly} step={100} hint="Find this at ssa.gov/myaccount"/>
        <div style={{ marginBottom:'1rem' }}>
          <label style={{ display:'block', fontSize:'0.8125rem', fontWeight:600, color:NAVY, marginBottom:'0.375rem', fontFamily:"'DM Sans',sans-serif" }}>Claim at Age</label>
          <input type="range" min={62} max={70} step={1} value={claimAge} onChange={e => setClaimAge(Number(e.target.value))}
            style={{ width:'100%', accentColor:TEAL }}/>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'#9ca3af', fontFamily:"'DM Sans',sans-serif", marginTop:4 }}>
            <span>62</span><span style={{ fontWeight:700, color:TEAL }}>Age {claimAge}</span><span>70</span>
          </div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.75rem', margin:'0.5rem 0 1.25rem' }}>
        <ResultBox label="Adjusted Monthly Benefit" value={fmt(adjustedMonthly)} color={claimAge < FRA ? '#ef4444' : claimAge > FRA ? '#22c55e' : TEAL} size="lg"/>
        <ResultBox label="vs. FRA Benefit" value={`${claimAge === FRA ? '—' : claimAge < FRA ? '-' : '+'}${Math.abs(Math.round((multiplier-1)*100))}%`} color={claimAge < FRA ? '#ef4444' : '#22c55e'}/>
        <ResultBox label="Annual Benefit" value={fmt(adjustedMonthly * 12)} color={NAVY}/>
      </div>

      {breakEvenAge && (
        <div style={{ background:`${TEAL}0d`, border:`1px solid ${TEAL}25`, borderRadius:12, padding:'1rem', fontFamily:"'DM Sans',sans-serif", marginBottom:'1rem' }}>
          <div style={{ fontSize:'0.875rem', fontWeight:700, color:NAVY, marginBottom:4 }}>Break-Even Age: ~{Math.round(breakEvenAge)}</div>
          <div style={{ fontSize:'0.8125rem', color:'#374151', lineHeight:1.65 }}>
            {claimAge < FRA
              ? `If you live past age ${Math.round(breakEvenAge)}, you would have received more lifetime income by waiting until FRA.`
              : `If you live past age ${Math.round(breakEvenAge)}, your larger benefit from waiting pays off more than claiming at FRA.`
            }
          </div>
        </div>
      )}

      <InfoBox>This is a simplified estimate. Actual benefits depend on your full earnings history. Always verify at ssa.gov/myaccount and consider a fee-only financial advisor for claiming strategy.</InfoBox>
    </SectionCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
   RESOURCES
══════════════════════════════════════════════════════════════════ */
function ResourcesTab() {
  const resources = [
    {
      category: 'Government & Official Tools',
      color: TEAL,
      items: [
        { name:'SSA My Account', desc:'See your full earnings history and projected SS benefits at 62, 67, and 70.', url:'https://www.ssa.gov/myaccount/' },
        { name:'IRS Retirement Plans', desc:'Official IRS guidance on contribution limits, rules, and plan types.', url:'https://www.irs.gov/retirement-plans' },
        { name:'Department of Labor — Retirement', desc:'Resources on 401(k) rules, ERISA protections, and fee disclosures.', url:'https://www.dol.gov/general/topic/retirement' },
      ],
    },
    {
      category: 'Planning & Calculators',
      color: '#8b5cf6',
      items: [
        { name:'FIRECalc', desc:'Historical retirement success calculator. Tests your plan against every 30-year period in market history.', url:'https://firecalc.com' },
        { name:'cFIREsim', desc:'Monte Carlo and historical simulation for retirement portfolios. Free and powerful.', url:'https://cfiresim.com' },
        { name:'NewRetirement', desc:'Comprehensive retirement planning tool. Free tier available.', url:'https://www.newretirement.com' },
      ],
    },
    {
      category: 'Education',
      color: '#f59e0b',
      items: [
        { name:'Bogleheads Wiki — Retirement', desc:'Community-driven guide to index fund investing and retirement planning.', url:'https://www.bogleheads.org/wiki/Retirement' },
        { name:'Nolo Retirement Guide', desc:'Plain-language articles on IRAs, 401(k)s, RMDs, and Social Security.', url:'https://www.nolo.com/legal-encyclopedia/retirement-plans-pensions' },
        { name:'Social Security Administration Publications', desc:'Free official guides to Social Security benefits, spousal benefits, and survivor benefits.', url:'https://www.ssa.gov/pubs/' },
      ],
    },
  ];

  return (
    <div>
      {resources.map(section => (
        <SectionCard key={section.category} title={section.category}>
          {section.items.map(item => (
            <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer"
              style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, padding:'0.75rem 0', borderBottom:'1px solid #f3f4f6', textDecoration:'none' }}>
              <div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', fontWeight:700, color:section.color, marginBottom:2 }}>{item.name}</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', color:'#6b7280', lineHeight:1.55 }}>{item.desc}</div>
              </div>
              <ExternalLink size={14} color='#d1d5db' style={{ flexShrink:0, marginTop:3 }}/>
            </a>
          ))}
        </SectionCard>
      ))}
      <SectionCard title="When to Hire a Financial Planner">
        {[
          'You\'re within 5 years of retirement and haven\'t stress-tested your income plan',
          'You have a pension with complex survivor benefit decisions',
          'Your combined retirement assets exceed $500K',
          'You want a Social Security claiming strategy for you and a spouse',
          'You need Roth conversion planning to reduce future RMDs and taxes',
          'You\'re self-employed and want to maximize retirement account options',
        ].map(r => (
          <div key={r} style={{ display:'flex', gap:8, alignItems:'flex-start', padding:'0.375rem 0', fontFamily:"'DM Sans',sans-serif", fontSize:'0.8375rem', color:'#374151' }}>
            <ArrowRight size={13} color={TEAL} style={{ flexShrink:0, marginTop:3 }}/>{r}
          </div>
        ))}
        <InfoBox>Look for a fee-only, fiduciary CFP (Certified Financial Planner). They charge for advice only — no commissions — so their recommendations aren't influenced by products they sell.</InfoBox>
      </SectionCard>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   TABS CONFIG
══════════════════════════════════════════════════════════════════ */
const MAIN_TABS = [
  { id:'learn',       label:'Learn',       icon:BookOpen    },
  { id:'calculators', label:'Calculators', icon:Calculator  },
  { id:'resources',   label:'Resources',   icon:ExternalLink },
];

const LEARN_TABS = [
  { id:'accounts',   label:'Account Types',      icon:DollarSign  },
  { id:'ss',         label:'Social Security',     icon:Shield      },
  { id:'withdrawal', label:'Withdrawal Rules',    icon:Calendar    },
  { id:'income',     label:'Retirement Income',   icon:TrendingUp  },
];

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
export default function Retirement() {
  const navigate  = useNavigate();
  const [tab,      setTab]     = useState('learn');
  const [learnTab, setLearnTab]= useState('accounts');

  const learnContent = {
    accounts:   <AccountTypesLearn/>,
    ss:         <SocialSecurityLearn/>,
    withdrawal: <WithdrawalLearn/>,
    income:     <IncomeLearn/>,
  };

  const learnTitles = {
    accounts:   { title:'Retirement Account Types', sub:'401(k), IRA, Roth IRA, SEP IRA — what each is, how they\'re taxed, and which to prioritize.' },
    ss:         { title:'Social Security', sub:'When to claim, how benefits are calculated, and strategies to maximize lifetime income.' },
    withdrawal: { title:'Withdrawal Rules', sub:'Early withdrawal penalties, RMDs, and the tax-efficient order to draw down your accounts.' },
    income:     { title:'Retirement Income Planning', sub:'The 4% rule, building an income stack, and making your money last 30+ years.' },
  };

  return (
    <div style={{ minHeight:'100vh', background:BG, fontFamily:"'DM Sans',sans-serif" }}>

      {/* Header */}
      <div style={{ background:NAVY, padding:'2rem 2.5rem 0' }}>
        <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.35)', marginBottom:'1rem', display:'flex', alignItems:'center', gap:6 }}>
          <button onClick={() => navigate('/fun')} style={{ background:'none', border:'none', cursor:'pointer', color:TEAL, fontSize:'0.75rem', fontFamily:"'DM Sans',sans-serif", padding:0 }}>Dashboard</button>
          <ChevronRight size={12} color="rgba(255,255,255,0.25)"/>
          <span style={{ fontFamily:"'DM Sans',sans-serif" }}>Retirement Planning</span>
        </div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2rem', fontWeight:700, color:'#fff', margin:'0 0 0.5rem', letterSpacing:'-0.025em', lineHeight:1.2 }}>
          Retirement Planning
        </h1>
        <p style={{ margin:'0 0 1.75rem', fontSize:'1rem', color:'rgba(255,255,255,0.55)', lineHeight:1.65, maxWidth:580, fontFamily:"'DM Sans',sans-serif" }}>
          Retirement isn't an age — it's a number. Learn which accounts to use, when to claim Social Security, how to withdraw efficiently, and how to make your money last.
        </p>
        <div style={{ display:'flex', gap:0, borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
          {MAIN_TABS.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                display:'flex', alignItems:'center', gap:7, padding:'0.75rem 1.25rem',
                background:'none', border:'none', borderBottom:`2px solid ${active?TEAL:'transparent'}`,
                cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem',
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
            <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
              {LEARN_TABS.map(t => {
                const Icon = t.icon;
                const active = learnTab === t.id;
                return (
                  <button key={t.id} onClick={() => setLearnTab(t.id)} style={{
                    display:'flex', alignItems:'center', gap:6, padding:'7px 14px',
                    borderRadius:99, border:`1.5px solid ${active ? TEAL : '#e5e7eb'}`,
                    background: active ? TEAL : '#fff', cursor:'pointer',
                    fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem',
                    fontWeight: active ? 700 : 500, color: active ? '#fff' : '#6b7280',
                    transition:'all 0.15s', whiteSpace:'nowrap',
                  }}>
                    <Icon size={13}/>{t.label}
                  </button>
                );
              })}
            </div>
            <SectionCard title={learnTitles[learnTab].title} subtitle={learnTitles[learnTab].sub}>
              {learnContent[learnTab]}
            </SectionCard>
          </>
        )}

        {tab === 'calculators' && (
          <>
            <RetirementCalc/>
            <SSBreakEvenCalc/>
          </>
        )}

        {tab === 'resources' && <ResourcesTab/>}

      </div>
    </div>
  );
}
