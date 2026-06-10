import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calculator, ChevronRight, TrendingUp, DollarSign,
  BarChart2, Shield, PieChart, RefreshCw,
} from 'lucide-react';

const TEAL  = '#00B4C6';
const NAVY  = '#f0e8d8';
const BG    = '#1a1410';

/* ── Shared ───────────────────────────────────────────────────────── */
function Card({ children, style = {} }) {
  return (
    <div style={{ background:'#231c16', border:'1px solid #2a2018', borderRadius:16, padding:'1.5rem', ...style }}>
      {children}
    </div>
  );
}

function Label({ children }) {
  return <label style={{ display:'block', fontSize:'0.8125rem', fontWeight:600, color:NAVY, marginBottom:'0.375rem', fontFamily:"'Inter',system-ui,sans-serif" }}>{children}</label>;
}

function NumInput({ label, value, onChange, prefix='$', suffix, min=0, step=1000, hint, max }) {
  return (
    <div style={{ marginBottom:'1rem' }}>
      {label && <Label>{label}</Label>}
      <div style={{ position:'relative' }}>
        {prefix && <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#6b5540', fontSize:'0.875rem', pointerEvents:'none' }}>{prefix}</span>}
        <input type="number" value={value} min={min} max={max} step={step} onChange={e => onChange(Number(e.target.value))}
          style={{ width:'100%', padding:`9px ${suffix?'2.25rem':'0.75rem'} 9px ${prefix?'1.5rem':'0.75rem'}`, border:'1.5px solid #2a2018', borderRadius:9, fontSize:'1rem', fontFamily:"'Inter',system-ui,sans-serif", color:NAVY, fontWeight:600, background:'#2d2419', boxSizing:'border-box' }}
          onFocus={e => e.target.style.borderColor=TEAL} onBlur={e => e.target.style.borderColor='#2a2018'}/>
        {suffix && <span style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', color:'#6b5540', fontSize:'0.875rem', pointerEvents:'none' }}>{suffix}</span>}
      </div>
      {hint && <p style={{ margin:'0.25rem 0 0', fontSize:'0.75rem', color:'#6b5540', fontFamily:"'Inter',system-ui,sans-serif" }}>{hint}</p>}
    </div>
  );
}

function Stat({ label, value, color = TEAL, size = 'md' }) {
  return (
    <div style={{ background:`${color}0d`, border:`1px solid ${color}22`, borderRadius:12, padding: size==='lg'?'1.25rem':'0.875rem 1rem', textAlign:'center' }}>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize: size==='lg'?'1.875rem':'1.25rem', fontWeight:700, color, letterSpacing:'-0.02em', lineHeight:1.1 }}>{value}</div>
      <div style={{ fontSize:'0.75rem', color:'#6b5540', marginTop:4, fontFamily:"'Inter',system-ui,sans-serif", fontWeight:500 }}>{label}</div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle, color = TEAL }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:'1rem' }}>
      <div style={{ width:38, height:38, borderRadius:10, background:`${color}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <Icon size={18} color={color}/>
      </div>
      <div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.125rem', fontWeight:700, color:NAVY, letterSpacing:'-0.01em' }}>{title}</div>
        {subtitle && <div style={{ fontFamily:"'Inter',system-ui,sans-serif", fontSize:'0.8125rem', color:'#6b5540', lineHeight:1.5, marginTop:2 }}>{subtitle}</div>}
      </div>
    </div>
  );
}

function Divider() {
  return <div style={{ borderTop:'1px solid #2a2018', margin:'1.75rem 0' }}/>;
}

function fmt(n, decimals = 0) {
  if (n >= 1e6) return '$' + (n/1e6).toFixed(2) + 'M';
  if (n >= 1e3) return '$' + Math.round(n).toLocaleString();
  return '$' + n.toFixed(decimals);
}
function fmtPlain(n) { return '$' + Math.round(Math.abs(n)).toLocaleString(); }

/* ══════════════════════════════════════════════════════════════════
   1. COMPOUND INTEREST
══════════════════════════════════════════════════════════════════ */
function CompoundInterest() {
  const [principal,  setPrincipal]  = useState(10000);
  const [monthly,    setMonthly]    = useState(500);
  const [rate,       setRate]       = useState(7);
  const [years,      setYears]      = useState(30);

  const r = rate / 100 / 12;
  const n = years * 12;
  const fvP = principal * Math.pow(1 + rate/100, years);
  const fvM = r > 0 ? monthly * ((Math.pow(1+r,n)-1)/r) : monthly*n;
  const total = fvP + fvM;
  const contributed = principal + monthly * n;
  const growth = total - contributed;

  const milestones = [5,10,20,30].filter(y => y <= years);
  const fvAt = (y) => {
    const nn = y*12;
    return principal * Math.pow(1+rate/100,y) + (r > 0 ? monthly*((Math.pow(1+r,nn)-1)/r) : monthly*nn);
  };

  return (
    <div>
      <SectionHeader icon={TrendingUp} title="Compound Interest Calculator" subtitle="See how your money grows over time with regular contributions." color={TEAL}/>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 1.25rem' }}>
        <NumInput label="Starting Amount" value={principal} onChange={setPrincipal}/>
        <NumInput label="Monthly Contribution" value={monthly} onChange={setMonthly} step={50}/>
        <NumInput label="Annual Return Rate" value={rate} onChange={setRate} prefix="" suffix="%" step={0.5} min={0} max={20} hint="Historical stock market avg: ~7% after inflation"/>
        <div style={{ marginBottom:'1rem' }}>
          <Label>Time Period: {years} years</Label>
          <input type="range" min={1} max={50} step={1} value={years} onChange={e => setYears(Number(e.target.value))} style={{ width:'100%', accentColor:TEAL }}/>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'#6b5540', fontFamily:"'Inter',system-ui,sans-serif", marginTop:2 }}>
            <span>1yr</span><span>50yr</span>
          </div>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.625rem', marginBottom:'1.25rem' }}>
        <Stat label="Total Contributions" value={fmtPlain(contributed)} color='#6b5540'/>
        <Stat label="Interest Earned" value={fmtPlain(growth)} color='#22c55e'/>
        <Stat label="Final Balance" value={fmt(total)} color={TEAL} size="lg"/>
      </div>
      {milestones.length > 0 && (
        <>
          <div style={{ fontFamily:"'Inter',system-ui,sans-serif", fontSize:'0.8125rem', fontWeight:700, color:NAVY, marginBottom:'0.625rem' }}>Balance at milestones</div>
          <div style={{ display:'grid', gridTemplateColumns:`repeat(${milestones.length},1fr)`, gap:'0.5rem' }}>
            {milestones.map(y => (
              <div key={y} style={{ background:`${TEAL}08`, border:`1px solid ${TEAL}20`, borderRadius:10, padding:'0.625rem 0.5rem', textAlign:'center' }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', fontWeight:700, color:TEAL }}>{fmt(fvAt(y))}</div>
                <div style={{ fontFamily:"'Inter',system-ui,sans-serif", fontSize:'0.75rem', color:'#6b5540', marginTop:2 }}>Year {y}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   2. INFLATION IMPACT
══════════════════════════════════════════════════════════════════ */
function InflationCalc() {
  const [amount,    setAmount]    = useState(50000);
  const [inflation, setInflation] = useState(3.0);
  const [years,     setYears]     = useState(20);

  const futureNeeded = amount * Math.pow(1 + inflation/100, years);
  const purchasingPower = amount / Math.pow(1 + inflation/100, years);
  const lost = amount - purchasingPower;

  return (
    <div>
      <SectionHeader icon={BarChart2} title="Inflation Impact Calculator" subtitle="See how inflation erodes purchasing power — and what you need to keep up." color='#f59e0b'/>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 1.25rem' }}>
        <NumInput label="Dollar Amount Today" value={amount} onChange={setAmount}/>
        <NumInput label="Inflation Rate" value={inflation} onChange={setInflation} prefix="" suffix="%" step={0.25} min={0} max={15} hint="US historical avg: ~3%"/>
        <div style={{ marginBottom:'1rem', gridColumn:'1/-1' }}>
          <Label>Years into the future: {years}</Label>
          <input type="range" min={1} max={50} step={1} value={years} onChange={e => setYears(Number(e.target.value))} style={{ width:'100%', accentColor:'#f59e0b' }}/>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'#6b5540', fontFamily:"'Inter',system-ui,sans-serif", marginTop:2 }}>
            <span>1yr</span><span>50yr</span>
          </div>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.625rem', marginBottom:'1rem' }}>
        <Stat label={`What ${fmtPlain(amount)} today buys in ${years}yr`} value={fmtPlain(purchasingPower)} color='#ef4444'/>
        <Stat label="Purchasing Power Lost" value={fmtPlain(lost)} color='#f59e0b'/>
        <Stat label={`You'd need in ${years}yr to match today`} value={fmtPlain(futureNeeded)} color='#22c55e' size="lg"/>
      </div>
      <div style={{ background:'#fffbeb', border:'1px solid #fde68a', borderRadius:10, padding:'0.75rem 0.875rem', fontFamily:"'Inter',system-ui,sans-serif", fontSize:'0.8125rem', color:'#374151', lineHeight:1.7 }}>
        At {inflation}% inflation, {fmtPlain(amount)} today will only buy what {fmtPlain(purchasingPower)} buys now — in {years} years. This is why keeping large sums in cash long-term is risky. Investments need to outpace inflation to preserve real wealth.
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   3. NET WORTH
══════════════════════════════════════════════════════════════════ */
function NetWorthCalc() {
  const assetFields = [
    { key:'checking',    label:'Checking & Savings' },
    { key:'investments', label:'Investment / Brokerage Accounts' },
    { key:'retirement',  label:'Retirement Accounts (401k, IRA)' },
    { key:'home',        label:'Home Value' },
    { key:'vehicles',    label:'Vehicle Value' },
    { key:'other',       label:'Other Assets' },
  ];
  const liabFields = [
    { key:'mortgage',  label:'Mortgage Balance' },
    { key:'auto',      label:'Auto Loans' },
    { key:'student',   label:'Student Loans' },
    { key:'credit',    label:'Credit Card Balances' },
    { key:'personal',  label:'Personal Loans / Other Debt' },
  ];

  const [assets,  setAssets]  = useState({ checking:5000, investments:20000, retirement:40000, home:0, vehicles:15000, other:0 });
  const [liabs,   setLiabs]   = useState({ mortgage:0, auto:8000, student:25000, credit:2000, personal:0 });

  const totalAssets = Object.values(assets).reduce((s,v)=>s+v,0);
  const totalLiabs  = Object.values(liabs).reduce((s,v)=>s+v,0);
  const netWorth    = totalAssets - totalLiabs;
  const color       = netWorth >= 0 ? TEAL : '#ef4444';

  return (
    <div>
      <SectionHeader icon={DollarSign} title="Net Worth Calculator" subtitle="Your total assets minus all liabilities. The single most important financial number to track." color='#8b5cf6'/>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 1.5rem' }}>
        <div>
          <div style={{ fontFamily:"'Inter',system-ui,sans-serif", fontSize:'0.8125rem', fontWeight:700, color:'#22c55e', marginBottom:'0.75rem', textTransform:'uppercase', letterSpacing:'0.04em' }}>Assets</div>
          {assetFields.map(f => (
            <NumInput key={f.key} label={f.label} value={assets[f.key]} onChange={v => setAssets(a=>({...a,[f.key]:v}))} step={500}/>
          ))}
        </div>
        <div>
          <div style={{ fontFamily:"'Inter',system-ui,sans-serif", fontSize:'0.8125rem', fontWeight:700, color:'#ef4444', marginBottom:'0.75rem', textTransform:'uppercase', letterSpacing:'0.04em' }}>Liabilities</div>
          {liabFields.map(f => (
            <NumInput key={f.key} label={f.label} value={liabs[f.key]} onChange={v => setLiabs(l=>({...l,[f.key]:v}))} step={500}/>
          ))}
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.625rem' }}>
        <Stat label="Total Assets" value={fmtPlain(totalAssets)} color='#22c55e'/>
        <Stat label="Total Liabilities" value={fmtPlain(totalLiabs)} color='#ef4444'/>
        <Stat label="Net Worth" value={netWorth < 0 ? `-${fmtPlain(Math.abs(netWorth))}` : fmtPlain(netWorth)} color={color} size="lg"/>
      </div>
      <div style={{ marginTop:'1rem', fontFamily:"'Inter',system-ui,sans-serif", fontSize:'0.8125rem', color:'#6b5540', lineHeight:1.65 }}>
        {netWorth < 0
          ? 'A negative net worth is common early in life — especially with student loans. The goal is a consistent upward trend over time.'
          : 'Track your net worth quarterly. Consistent upward movement — not any single number — is the real measure of financial progress.'
        }
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   4. EMERGENCY FUND
══════════════════════════════════════════════════════════════════ */
function EmergencyFundCalc() {
  const [housing,    setHousing]    = useState(1500);
  const [food,       setFood]       = useState(500);
  const [transport,  setTransport]  = useState(400);
  const [utilities,  setUtilities]  = useState(200);
  const [insurance,  setInsurance]  = useState(250);
  const [minDebt,    setMinDebt]    = useState(300);
  const [other,      setOther]      = useState(200);
  const [months,     setMonths]     = useState(6);
  const [saved,      setSaved]      = useState(3000);
  const [monthlySave,setMonthlySave]= useState(300);

  const essential = housing + food + transport + utilities + insurance + minDebt + other;
  const target    = essential * months;
  const gap       = Math.max(0, target - saved);
  const moToGoal  = monthlySave > 0 ? Math.ceil(gap / monthlySave) : null;

  const pct = Math.min(100, (saved / target) * 100);
  const barColor = pct >= 100 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div>
      <SectionHeader icon={Shield} title="Emergency Fund Calculator" subtitle="How much you need and how long it'll take to get there." color='#22c55e'/>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 1.25rem' }}>
        <div>
          <div style={{ fontFamily:"'Inter',system-ui,sans-serif", fontSize:'0.8125rem', fontWeight:700, color:NAVY, marginBottom:'0.75rem' }}>Monthly Essential Expenses</div>
          <NumInput label="Housing" value={housing} onChange={setHousing} step={50}/>
          <NumInput label="Food & Groceries" value={food} onChange={setFood} step={50}/>
          <NumInput label="Transportation" value={transport} onChange={setTransport} step={50}/>
          <NumInput label="Utilities" value={utilities} onChange={setUtilities} step={25}/>
          <NumInput label="Insurance" value={insurance} onChange={setInsurance} step={25}/>
          <NumInput label="Minimum Debt Payments" value={minDebt} onChange={setMinDebt} step={25}/>
          <NumInput label="Other Essentials" value={other} onChange={setOther} step={25}/>
        </div>
        <div>
          <div style={{ fontFamily:"'Inter',system-ui,sans-serif", fontSize:'0.8125rem', fontWeight:700, color:NAVY, marginBottom:'0.75rem' }}>Your Savings</div>
          <div style={{ marginBottom:'1rem' }}>
            <Label>Months of coverage: {months}</Label>
            <input type="range" min={1} max={12} step={1} value={months} onChange={e=>setMonths(Number(e.target.value))} style={{ width:'100%', accentColor:'#22c55e' }}/>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'#6b5540', fontFamily:"'Inter',system-ui,sans-serif", marginTop:2 }}>
              <span>1 month</span><span style={{ color:'#22c55e', fontWeight:700 }}>{months} months</span><span>12 months</span>
            </div>
          </div>
          <NumInput label="Currently Saved" value={saved} onChange={setSaved} step={500}/>
          <NumInput label="Can Save Per Month" value={monthlySave} onChange={setMonthlySave} step={50}/>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.625rem', marginBottom:'1.25rem' }}>
        <Stat label="Monthly Essentials" value={fmtPlain(essential)} color='#6b5540'/>
        <Stat label="Target Fund" value={fmtPlain(target)} color='#22c55e' size="lg"/>
        <Stat label={pct >= 100 ? 'Fully Funded!' : 'Still Needed'} value={pct >= 100 ? '✓' : fmtPlain(gap)} color={pct >= 100 ? '#22c55e' : '#ef4444'}/>
      </div>
      <div style={{ marginBottom:'0.5rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'#6b5540', fontFamily:"'Inter',system-ui,sans-serif", marginBottom:6 }}>
          <span>Progress: {pct.toFixed(0)}%</span>
          {moToGoal && gap > 0 && <span>~{moToGoal} months to goal at {fmtPlain(monthlySave)}/mo</span>}
        </div>
        <div style={{ background:'#2d2419', borderRadius:99, height:10, overflow:'hidden' }}>
          <div style={{ width:`${pct}%`, background:barColor, height:'100%', borderRadius:99, transition:'width 0.3s' }}/>
        </div>
      </div>
      <div style={{ marginTop:'1rem', fontFamily:"'Inter',system-ui,sans-serif", fontSize:'0.8125rem', color:'#6b5540', lineHeight:1.65 }}>
        Keep your emergency fund in a <strong style={{ color:NAVY }}>high-yield savings account</strong> earning 4–5% APY. It should be accessible within 1–2 business days but not so easy to spend that you dip into it for non-emergencies.
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   5. TAX BRACKET ESTIMATOR (2024)
══════════════════════════════════════════════════════════════════ */
const BRACKETS_SINGLE = [
  { min:0,        max:11600,   rate:0.10 },
  { min:11600,    max:47150,   rate:0.12 },
  { min:47150,    max:100525,  rate:0.22 },
  { min:100525,   max:191950,  rate:0.24 },
  { min:191950,   max:243725,  rate:0.32 },
  { min:243725,   max:609350,  rate:0.35 },
  { min:609350,   max:Infinity,rate:0.37 },
];
const BRACKETS_MFJ = [
  { min:0,        max:23200,   rate:0.10 },
  { min:23200,    max:94300,   rate:0.12 },
  { min:94300,    max:201050,  rate:0.22 },
  { min:201050,   max:383900,  rate:0.24 },
  { min:383900,   max:487450,  rate:0.32 },
  { min:487450,   max:731200,  rate:0.35 },
  { min:731200,   max:Infinity,rate:0.37 },
];
const STD_DEDUCTION = { single:14600, mfj:29200 };

function calcTax(income, brackets) {
  let tax = 0;
  for (const b of brackets) {
    if (income <= b.min) break;
    const taxable = Math.min(income, b.max) - b.min;
    tax += taxable * b.rate;
  }
  return tax;
}

function TaxBracketCalc() {
  const [grossIncome, setGrossIncome] = useState(75000);
  const [status,      setStatus]      = useState('single');
  const [pretax401k,  setPretax401k]  = useState(6000);
  const [hsaContrib,  setHsaContrib]  = useState(0);

  const stdDed    = STD_DEDUCTION[status];
  const brackets  = status === 'single' ? BRACKETS_SINGLE : BRACKETS_MFJ;
  const agi       = Math.max(0, grossIncome - pretax401k - hsaContrib);
  const taxable   = Math.max(0, agi - stdDed);
  const totalTax  = calcTax(taxable, brackets);
  const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;
  const marginalBracket = brackets.find(b => taxable > b.min && taxable <= b.max) || brackets[brackets.length-1];
  const marginalRate = taxable > 0 ? marginalBracket.rate * 100 : 10;
  const takeHome  = grossIncome - totalTax;

  const breakdown = brackets.filter(b => taxable > b.min).map(b => {
    const amt = (Math.min(taxable, b.max) - b.min) * b.rate;
    return { rate: b.rate, tax: amt };
  });

  return (
    <div>
      <SectionHeader icon={PieChart} title="Tax Bracket Estimator" subtitle="Estimate your 2024 federal income tax, effective rate, and take-home pay." color='#8b5cf6'/>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 1.25rem' }}>
        <NumInput label="Gross Annual Income" value={grossIncome} onChange={setGrossIncome} step={1000}/>
        <div style={{ marginBottom:'1rem' }}>
          <Label>Filing Status</Label>
          <div style={{ display:'flex', gap:'0.5rem' }}>
            {[{id:'single',label:'Single'},{id:'mfj',label:'Married Filing Jointly'}].map(s => (
              <button key={s.id} onClick={() => setStatus(s.id)} style={{ flex:1, padding:'9px 8px', borderRadius:9, border:`1.5px solid ${status===s.id?'#8b5cf6':'#2a2018'}`, background: status===s.id?'#8b5cf6':'#2d2419', color: status===s.id?'#fff':NAVY, fontFamily:"'Inter',system-ui,sans-serif", fontSize:'0.8rem', fontWeight:700, cursor:'pointer' }}>{s.label}</button>
            ))}
          </div>
        </div>
        <NumInput label="Pre-tax 401(k) Contributions" value={pretax401k} onChange={setPretax401k} step={500} hint="Reduces your taxable income"/>
        <NumInput label="HSA Contributions" value={hsaContrib} onChange={setHsaContrib} step={100} hint="Also reduces taxable income"/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.625rem', marginBottom:'1.25rem' }}>
        <Stat label="Taxable Income" value={fmtPlain(taxable)} color='#6b5540'/>
        <Stat label="Federal Tax Owed" value={fmtPlain(totalTax)} color='#ef4444'/>
        <Stat label="Marginal Rate" value={`${marginalRate.toFixed(0)}%`} color='#8b5cf6'/>
        <Stat label="Effective Rate" value={`${effectiveRate.toFixed(1)}%`} color={TEAL} size="lg"/>
      </div>

      <div style={{ fontFamily:"'Inter',system-ui,sans-serif", fontSize:'0.8125rem', fontWeight:700, color:NAVY, marginBottom:'0.625rem' }}>Tax by bracket</div>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.375rem', marginBottom:'1rem' }}>
        {breakdown.map((b, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontFamily:"'Inter',system-ui,sans-serif", fontSize:'0.8rem', color:'#6b5540', minWidth:32 }}>{(b.rate*100).toFixed(0)}%</span>
            <div style={{ flex:1, background:'#2d2419', borderRadius:99, height:7, overflow:'hidden' }}>
              <div style={{ width:`${Math.min(100,(b.tax/totalTax)*100)}%`, background:'#8b5cf6', height:'100%', borderRadius:99 }}/>
            </div>
            <span style={{ fontFamily:"'Inter',system-ui,sans-serif", fontSize:'0.8rem', fontWeight:600, color:NAVY, minWidth:70, textAlign:'right' }}>{fmtPlain(b.tax)}</span>
          </div>
        ))}
      </div>

      <div style={{ background:`${TEAL}0d`, border:`1px solid ${TEAL}22`, borderRadius:12, padding:'0.875rem 1rem', fontFamily:"'Inter',system-ui,sans-serif", fontSize:'0.8125rem', color:'#374151', lineHeight:1.7 }}>
        <strong style={{ color:NAVY }}>Estimated annual take-home: {fmtPlain(takeHome)}</strong> ({fmtPlain(takeHome/12)}/month). This is federal only — subtract state income tax, FICA (7.65%), and any local taxes for your true net pay.
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   6. ROTH VS TRADITIONAL
══════════════════════════════════════════════════════════════════ */
function RothVsTraditional() {
  const [annual,       setAnnual]       = useState(7000);
  const [years,        setYears]        = useState(30);
  const [returnRate,   setReturnRate]   = useState(7);
  const [currentRate,  setCurrentRate]  = useState(22);
  const [retireRate,   setRetireRate]   = useState(22);

  const r = returnRate / 100;

  // Traditional: contribute pre-tax, grow, pay tax on withdrawal
  const tradFV = annual * ((Math.pow(1+r,years)-1)/r) * (1+r);
  const tradAfterTax = tradFV * (1 - retireRate/100);
  const tradTaxSaved = annual * (currentRate/100) * years;

  // Roth: contribute after-tax, grow, no tax on withdrawal
  const rothAfterTax = annual * (1 - currentRate/100) * ((Math.pow(1+r,years)-1)/r) * (1+r);
  // Equivalent Roth contribution (same after-tax dollars)
  const rothFV = annual * (1 - currentRate/100) * ((Math.pow(1+r,years)-1)/r) * (1+r);

  // For fair comparison: invest same gross dollars
  // Trad: $7K pre-tax → full $7K invested, taxed at retirement
  // Roth: $7K pre-tax but only (7K*(1-currentRate)) invested after tax
  // OR: invest $7K into Roth (the limit) meaning you're putting in more after-tax dollars
  // Best comparison: same contribution limit amount
  const tradFVFull    = tradFV;
  const tradAfterFull = tradFVFull * (1 - retireRate/100);
  const rothFVFull    = annual * ((Math.pow(1+r,years)-1)/r) * (1+r); // $7K into Roth, no tax ever

  const rothWins = rothFVFull > tradAfterFull;
  const diff = Math.abs(rothFVFull - tradAfterFull);

  return (
    <div>
      <SectionHeader icon={RefreshCw} title="Roth vs. Traditional IRA Comparison" subtitle="Which account wins depends on whether your tax rate is higher now or in retirement." color='#22c55e'/>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 1.25rem' }}>
        <NumInput label="Annual Contribution" value={annual} onChange={setAnnual} step={500} hint="2024 IRA limit: $7,000 ($8,000 if 50+)"/>
        <div style={{ marginBottom:'1rem' }}>
          <Label>Investment Period: {years} years</Label>
          <input type="range" min={5} max={50} step={1} value={years} onChange={e=>setYears(Number(e.target.value))} style={{ width:'100%', accentColor:'#22c55e' }}/>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'#6b5540', fontFamily:"'Inter',system-ui,sans-serif", marginTop:2 }}>
            <span>5yr</span><span>50yr</span>
          </div>
        </div>
        <NumInput label="Expected Annual Return" value={returnRate} onChange={setReturnRate} prefix="" suffix="%" step={0.5} min={1} max={15}/>
        <NumInput label="Current Tax Rate" value={currentRate} onChange={setCurrentRate} prefix="" suffix="%" step={1} min={0} max={50} hint="Your marginal federal bracket today"/>
        <NumInput label="Expected Retirement Tax Rate" value={retireRate} onChange={setRetireRate} prefix="" suffix="%" step={1} min={0} max={50} hint="Your expected bracket in retirement"/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'1.25rem' }}>
        <div style={{ background:'#8b5cf615', border:'1.5px solid #8b5cf630', borderRadius:12, padding:'1rem', textAlign:'center' }}>
          <div style={{ fontFamily:"'Inter',system-ui,sans-serif", fontSize:'0.8125rem', fontWeight:700, color:'#8b5cf6', marginBottom:6 }}>Traditional IRA</div>
          <div style={{ fontFamily:"'Inter',system-ui,sans-serif", fontSize:'0.75rem', color:'#6b5540', marginBottom:4 }}>After-tax value at withdrawal</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.75rem', fontWeight:700, color:'#8b5cf6' }}>{fmt(tradAfterFull)}</div>
          <div style={{ fontFamily:"'Inter',system-ui,sans-serif", fontSize:'0.75rem', color:'#6b5540', marginTop:4 }}>Gross: {fmt(tradFVFull)} — taxed at {retireRate}%</div>
        </div>
        <div style={{ background:'#22c55e15', border:'1.5px solid #22c55e30', borderRadius:12, padding:'1rem', textAlign:'center' }}>
          <div style={{ fontFamily:"'Inter',system-ui,sans-serif", fontSize:'0.8125rem', fontWeight:700, color:'#22c55e', marginBottom:6 }}>Roth IRA</div>
          <div style={{ fontFamily:"'Inter',system-ui,sans-serif", fontSize:'0.75rem', color:'#6b5540', marginBottom:4 }}>Tax-free value at withdrawal</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.75rem', fontWeight:700, color:'#22c55e' }}>{fmt(rothFVFull)}</div>
          <div style={{ fontFamily:"'Inter',system-ui,sans-serif", fontSize:'0.75rem', color:'#6b5540', marginTop:4 }}>No taxes owed at withdrawal</div>
        </div>
      </div>

      <div style={{ background: (rothWins ? '#22c55e' : '#8b5cf6') + '0d', border:`1.5px solid ${rothWins ? '#22c55e' : '#8b5cf6'}30`, borderRadius:12, padding:'1rem', fontFamily:"'Inter',system-ui,sans-serif" }}>
        <div style={{ fontSize:'0.875rem', fontWeight:700, color: rothWins ? '#22c55e' : '#8b5cf6', marginBottom:4 }}>
          {rothWins ? 'Roth IRA wins' : 'Traditional IRA wins'} by {fmt(diff)}
        </div>
        <div style={{ fontSize:'0.8125rem', color:'#374151', lineHeight:1.65 }}>
          {currentRate === retireRate
            ? 'When tax rates are equal, the Roth wins slightly because you contribute after-tax dollars to the limit — effectively sheltering more. The real Roth advantage grows when your retirement rate rises.'
            : rothWins
            ? `Your current tax rate (${currentRate}%) is lower than your expected retirement rate (${retireRate}%). Pay taxes now at the lower rate — the Roth is the better choice.`
            : `Your expected retirement tax rate (${retireRate}%) is lower than today (${currentRate}%). Defer taxes now and pay at the lower rate in retirement — Traditional wins.`
          }
        </div>
      </div>

      <div style={{ marginTop:'1rem', fontFamily:"'Inter',system-ui,sans-serif", fontSize:'0.8125rem', color:'#6b5540', lineHeight:1.65 }}>
        <strong style={{ color:NAVY }}>Rule of thumb:</strong> If you're in the 22% bracket or below, lean Roth. If you're in the 32%+ bracket, lean Traditional. If unsure, split contributions — hedge against future tax uncertainty.
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CALC NAV
══════════════════════════════════════════════════════════════════ */
const CALCS = [
  { id:'compound',   label:'Compound Interest', icon:TrendingUp,  color:TEAL       },
  { id:'inflation',  label:'Inflation Impact',  icon:BarChart2,   color:'#f59e0b'  },
  { id:'networth',   label:'Net Worth',          icon:DollarSign,  color:'#8b5cf6'  },
  { id:'emergency',  label:'Emergency Fund',     icon:Shield,      color:'#22c55e'  },
  { id:'tax',        label:'Tax Brackets',       icon:PieChart,    color:'#8b5cf6'  },
  { id:'rothvtrad',  label:'Roth vs Traditional',icon:RefreshCw,   color:'#22c55e'  },
];

const CONTENT = {
  compound:  <CompoundInterest/>,
  inflation: <InflationCalc/>,
  networth:  <NetWorthCalc/>,
  emergency: <EmergencyFundCalc/>,
  tax:       <TaxBracketCalc/>,
  rothvtrad: <RothVsTraditional/>,
};

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
export default function Calculators() {
  const navigate  = useNavigate();
  const [active, setActive] = useState('compound');

  const calc = CALCS.find(c => c.id === active);

  return (
    <div style={{ minHeight:'100vh', background:BG, fontFamily:"'Inter',system-ui,sans-serif" }}>

      {/* Header */}
      <div style={{ background:NAVY, padding:'2rem 2.5rem 1.5rem' }}>
        <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.35)', marginBottom:'1rem', display:'flex', alignItems:'center', gap:6 }}>
          <button onClick={() => navigate('/fun')} style={{ background:'none', border:'none', cursor:'pointer', color:TEAL, fontSize:'0.75rem', fontFamily:"'Inter',system-ui,sans-serif", padding:0 }}>Dashboard</button>
          <ChevronRight size={12} color="rgba(255,255,255,0.25)"/>
          <span>Calculator Hub</span>
        </div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2rem', fontWeight:700, color:'#fff', margin:'0 0 0.5rem', letterSpacing:'-0.025em', lineHeight:1.2 }}>
          Calculator Hub
        </h1>
        <p style={{ margin:0, fontSize:'1rem', color:'rgba(255,255,255,0.55)', lineHeight:1.65, maxWidth:560, fontFamily:"'Inter',system-ui,sans-serif" }}>
          Core financial calculators for the numbers that matter most. All calculations happen in your browser — nothing is saved or sent anywhere.
        </p>
      </div>

      <div style={{ display:'flex', gap:'1.5rem', padding:'2rem 2.5rem', maxWidth:1060, margin:'0 auto' }}>

        {/* Sidebar nav */}
        <div style={{ width:210, flexShrink:0 }}>
          <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:14, padding:'0.5rem', boxShadow:'0 1px 4px rgba(0,0,0,0.04)', position:'sticky', top:24 }}>
            {CALCS.map(c => {
              const Icon = c.icon;
              const isActive = active === c.id;
              return (
                <button key={c.id} onClick={() => setActive(c.id)} style={{
                  display:'flex', alignItems:'center', gap:10, width:'100%',
                  padding:'0.625rem 0.75rem', borderRadius:10, border:'none',
                  background: isActive ? `${c.color}12` : 'transparent',
                  cursor:'pointer', textAlign:'left', transition:'background 0.13s',
                  marginBottom:2,
                }}
                onMouseEnter={e => { if(!isActive) e.currentTarget.style.background='#f9fafb'; }}
                onMouseLeave={e => { if(!isActive) e.currentTarget.style.background='transparent'; }}
                >
                  <Icon size={14} color={isActive ? c.color : '#6b5540'} style={{ flexShrink:0 }}/>
                  <span style={{ fontFamily:"'Inter',system-ui,sans-serif", fontSize:'0.8125rem', fontWeight: isActive ? 700 : 400, color: isActive ? c.color : '#6b5540', lineHeight:1.3 }}>{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Calculator content */}
        <div style={{ flex:1, minWidth:0 }}>
          <Card>
            {CONTENT[active]}
          </Card>
        </div>

      </div>
    </div>
  );
}
