import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, ChevronRight, Info, CheckCircle2, AlertCircle,
  BookOpen, Calculator, ExternalLink, ArrowRight,
  Heart, Baby, Briefcase, Home, DollarSign, Users, TrendingUp, Shield,
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

function NumInput({ label, value, onChange, prefix='$', suffix, min=0, step=100, hint, max }) {
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

function fmt(n) { return '$' + Math.round(Math.abs(n)).toLocaleString(); }

/* ══════════════════════════════════════════════════════════════════
   LEARN — MARRIAGE & COMBINING FINANCES
══════════════════════════════════════════════════════════════════ */
function MarriageLearn() {
  const tasks = [
    { category:'Immediately', color:'#ef4444', items:[
      'Update beneficiary designations on all accounts (IRA, 401k, life insurance)',
      'Add spouse to health insurance during open enrollment or qualifying life event window (30–60 days)',
      'Update emergency contacts and authorized users',
      'Review and update your will — or create one if you don\'t have it',
    ]},
    { category:'Within 3 months', color:'#f59e0b', items:[
      'Decide on a money management approach (joint, separate, or hybrid)',
      'Combine or coordinate auto and renters/homeowners insurance for multi-policy discounts',
      'Discuss financial goals, debts, and net worth — full financial transparency',
      'Update your tax withholding (W-4) — marriage changes your tax bracket potentially',
    ]},
    { category:'Within 6 months', color:TEAL, items:[
      'Create a joint budget that reflects combined income and expenses',
      'Evaluate whether to file taxes jointly or separately (usually jointly is better)',
      'Update healthcare proxy and power of attorney to reflect marriage',
      'If one spouse has significant debt, discuss a payoff strategy',
    ]},
  ];

  const approaches = [
    { name:'Fully Joint', color:'#22c55e', desc:'All income goes into shared accounts. All expenses paid jointly. Maximum simplicity and transparency. Requires alignment on spending habits.' },
    { name:'Fully Separate', color:'#8b5cf6', desc:'Each person maintains their own accounts and splits shared expenses. Maximum independence. Can create friction on joint goals and big purchases.' },
    { name:'Hybrid (Most Popular)', color:TEAL, desc:'Each person contributes proportionally (or equally) to a joint account for shared expenses and goals. Each keeps their own account for personal spending. Balances transparency with autonomy.' },
  ];

  return (
    <div>
      <p style={{ margin:'0 0 1.25rem', fontSize:'0.9375rem', color:'#374151', lineHeight:1.75, fontFamily:"'DM Sans',sans-serif" }}>
        Marriage is one of the most significant financial events of your life. Getting the financial integration right early prevents conflicts and missed opportunities down the road.
      </p>

      <SectionCard title="Money Management Approaches">
        {approaches.map(a => (
          <div key={a.name} style={{ padding:'0.75rem 0', borderBottom:'1px solid #f3f4f6' }}>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', fontWeight:700, color:a.color, marginBottom:4 }}>{a.name}</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', color:'#374151', lineHeight:1.65 }}>{a.desc}</div>
          </div>
        ))}
        <InfoBox>There is no universally right answer. The best system is the one you'll both actually follow. Have the conversation before the wedding — discussing money openly is a relationship skill that pays dividends for decades.</InfoBox>
      </SectionCard>

      <SectionCard title="Financial To-Do List After Marriage">
        {tasks.map(t => (
          <div key={t.category} style={{ marginBottom:'1rem' }}>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', fontWeight:700, color:t.color, marginBottom:'0.5rem', textTransform:'uppercase', letterSpacing:'0.04em' }}>{t.category}</div>
            {t.items.map(item => (
              <div key={item} style={{ display:'flex', gap:8, alignItems:'flex-start', marginBottom:6 }}>
                <CheckCircle2 size={13} color={t.color} style={{ flexShrink:0, marginTop:2 }}/>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8375rem', color:'#374151', lineHeight:1.6 }}>{item}</div>
              </div>
            ))}
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Prenuptial Agreements — Who Needs One?">
        {[
          { label:'Significant asset disparity', note:'If one partner has substantially more assets, investments, or business interests, a prenup clarifies what remains separate.' },
          { label:'Children from a prior relationship', note:'A prenup can ensure assets intended for your children from a previous relationship are protected.' },
          { label:'Significant debt disparity', note:'If one partner has large student loans or other debt, a prenup can prevent that debt from becoming the other spouse\'s responsibility.' },
          { label:'Family inheritance expectations', note:'If you expect to inherit a family business or significant assets, a prenup protects those from being considered marital property.' },
        ].map(r => (
          <div key={r.label} style={{ padding:'0.625rem 0', borderBottom:'1px solid #f3f4f6' }}>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', fontWeight:700, color:NAVY, marginBottom:2 }}>{r.label}</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', color:'#6b7280', lineHeight:1.65 }}>{r.note}</div>
          </div>
        ))}
        <InfoBox color='#8b5cf6'>Prenups require independent legal counsel for both parties and full financial disclosure to be enforceable. They are not just for the wealthy — they're a financial planning tool.</InfoBox>
      </SectionCard>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LEARN — HAVING A BABY
══════════════════════════════════════════════════════════════════ */
function BabyLearn() {
  const costs = [
    { item:'Hospital birth (vaginal)', range:'$5,000–$15,000', note:'After insurance. C-section typically $10,000–$25,000. Varies enormously by location and plan.' },
    { item:'Childcare (0–5 years)', range:'$10,000–$30,000/year', note:'The largest ongoing expense. Infant care in major cities can exceed $2,500/month.' },
    { item:'Baby gear (first year)', range:'$5,000–$10,000', note:'Crib, stroller, car seat, monitor, feeding supplies, clothing, diapers. Buy used where safe to do so.' },
    { item:'Healthcare', range:'$2,000–$5,000/year', note:'Pediatric visits, vaccines, sick visits. Add baby to your health plan within 30 days of birth.' },
    { item:'Food (after breastfeeding)', range:'$1,500–$3,000/year', note:'Formula alone can cost $1,500+/year. Solid foods add ongoing grocery costs.' },
    { item:'College savings (18 years)', range:'$200–$500+/month', note:'Starting at birth and saving $300/month at 6% return reaches ~$100K by age 18.' },
  ];

  const tasks = [
    'Add baby to health insurance within 30 days of birth (qualifying life event)',
    'Update beneficiary designations on all accounts to include the child or a trust',
    'Create or update your will — and name a guardian',
    'Review and increase life insurance coverage (10× income minimum)',
    'Open a 529 college savings plan — even small contributions compound significantly',
    'Apply for Social Security number (at the hospital or separately)',
    'Understand your employer\'s parental leave policy and plan your finances around it',
    'Build 3–6 months emergency fund before the birth if not already done',
    'Review disability insurance — your income matters more now than ever',
  ];

  return (
    <div>
      <p style={{ margin:'0 0 1.25rem', fontSize:'0.9375rem', color:'#374151', lineHeight:1.75, fontFamily:"'DM Sans',sans-serif" }}>
        A new child is one of the most joyful — and financially significant — events in life. The USDA estimates the average cost of raising a child to age 18 exceeds <strong>$310,000</strong>. Planning ahead makes the difference between thriving and just surviving.
      </p>

      <SectionCard title="First-Year & Ongoing Costs">
        {costs.map(c => (
          <div key={c.item} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'0.625rem 0', borderBottom:'1px solid #f3f4f6' }}>
            <div style={{ minWidth:175, fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', fontWeight:700, color:NAVY, paddingTop:1 }}>{c.item}</div>
            <div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', fontWeight:600, color:TEAL, marginBottom:2 }}>{c.range}</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8rem', color:'#6b7280', lineHeight:1.55 }}>{c.note}</div>
            </div>
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Financial Checklist: New Baby">
        {tasks.map(t => (
          <div key={t} style={{ display:'flex', gap:8, alignItems:'flex-start', padding:'0.4375rem 0', borderBottom:'1px solid #f3f4f6' }}>
            <CheckCircle2 size={13} color={TEAL} style={{ flexShrink:0, marginTop:2 }}/>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8375rem', color:'#374151', lineHeight:1.6 }}>{t}</div>
          </div>
        ))}
        <InfoBox color='#ec4899'>The 529 college savings plan is one of the most underutilized accounts in America. Contributions grow tax-free for education, and many states offer a deduction. Starting the day your child is born gives 18 full years of compounding.</InfoBox>
      </SectionCard>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LEARN — JOB LOSS
══════════════════════════════════════════════════════════════════ */
function JobLossLearn() {
  const immediate = [
    { step:'File for unemployment', note:'Do it immediately — there is typically a 1-week waiting period and you don\'t know how long the job search will take. Benefits vary by state but can replace 40–50% of wages.' },
    { step:'Calculate your runway', note:'Total liquid savings ÷ monthly essential expenses = months of runway. This is your timeline. Know it exactly.' },
    { step:'Switch to essential spending only', note:'Cancel or pause all non-essential subscriptions. Reduce to bare minimum. You\'re in preservation mode.' },
    { step:'Do NOT touch retirement accounts', note:'Early withdrawal costs 10% penalty + income taxes. It destroys years of compounding. Exhaust all other options first.' },
    { step:'Evaluate health insurance options', note:'COBRA allows you to keep your current plan (up to 18 months) but you pay the full premium — often $500–$700+/month. ACA marketplace plans may be cheaper, especially with the income change.' },
    { step:'Pause extra debt payments', note:'Keep up minimum payments to protect your credit score, but redirect extra payments to your emergency fund or basic needs.' },
  ];

  return (
    <div>
      <p style={{ margin:'0 0 1.25rem', fontSize:'0.9375rem', color:'#374151', lineHeight:1.75, fontFamily:"'DM Sans',sans-serif" }}>
        Losing a job is a financial emergency. The first 72 hours matter — moving quickly on the right steps protects your credit, preserves your savings, and maximizes your options.
      </p>

      <SectionCard title="Immediate Steps (First Week)">
        {immediate.map((s, i) => (
          <div key={s.step} style={{ display:'flex', gap:12, padding:'0.75rem 0', borderBottom:'1px solid #f3f4f6', alignItems:'flex-start' }}>
            <div style={{ width:26, height:26, borderRadius:'50%', background: i < 2 ? '#ef4444' : TEAL, color:'#fff', fontWeight:700, fontSize:'0.8125rem', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:"'DM Sans',sans-serif" }}>{i+1}</div>
            <div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', fontWeight:700, color:NAVY, marginBottom:2 }}>{s.step}</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', color:'#6b7280', lineHeight:1.6 }}>{s.note}</div>
            </div>
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Health Insurance Options After Job Loss">
        {[
          { option:'COBRA', timeframe:'Up to 18 months', cost:'Full premium (employer + employee share) + 2% admin fee', note:'Most expensive option but keeps your exact same coverage and network. Valuable if you have ongoing medical needs.' },
          { option:'ACA Marketplace Plan', timeframe:'Enroll within 60 days of job loss', cost:'Varies — subsidies available based on income', note:'Often the best value after job loss. Losing employer coverage is a Special Enrollment Period. Lower income = larger subsidies.' },
          { option:'Spouse/Partner\'s Plan', timeframe:'Enroll within 30–60 days', cost:'Employer-sponsored rate', note:'Job loss is a qualifying life event for your partner\'s plan. Often the most affordable option.' },
          { option:'Medicaid', timeframe:'Anytime if income qualifies', cost:'Free or very low cost', note:'If your income drops below ~138% of the federal poverty level (in expansion states), you may qualify immediately.' },
        ].map(o => (
          <div key={o.option} style={{ padding:'0.75rem 0', borderBottom:'1px solid #f3f4f6' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:4, marginBottom:4 }}>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', fontWeight:700, color:NAVY }}>{o.option}</span>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.75rem', color:'#6b7280' }}>{o.timeframe}</span>
            </div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', fontWeight:600, color:TEAL, marginBottom:3 }}>{o.cost}</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8rem', color:'#6b7280', lineHeight:1.55 }}>{o.note}</div>
          </div>
        ))}
      </SectionCard>

      <SectionCard title="What to Do with Your Old 401(k)">
        {[
          { action:'Roll over to an IRA', recommended:true, note:'Best option for most people. Open a Traditional IRA at a low-cost brokerage (Fidelity, Vanguard, Schwab) and roll the funds directly. No taxes, no penalties, full investment control.' },
          { action:'Leave it in your old employer\'s plan', recommended:true, note:'Fine if the plan has good low-cost funds. Can be rolled over later. Avoid if the plan has high fees.' },
          { action:'Roll into your new employer\'s 401(k)', recommended:true, note:'Makes sense if the new plan has good funds and you want simplicity. Consolidates accounts.' },
          { action:'Cash it out', recommended:false, note:'Lose 10% penalty + income taxes immediately. A $50,000 balance can become $32,000 after taxes and penalties. Almost never the right choice.' },
        ].map(a => (
          <div key={a.action} style={{ display:'flex', gap:10, padding:'0.625rem 0', borderBottom:'1px solid #f3f4f6', alignItems:'flex-start' }}>
            {a.recommended
              ? <CheckCircle2 size={14} color='#22c55e' style={{ flexShrink:0, marginTop:2 }}/>
              : <AlertCircle size={14} color='#ef4444' style={{ flexShrink:0, marginTop:2 }}/>
            }
            <div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', fontWeight:700, color: a.recommended ? NAVY : '#ef4444', marginBottom:2 }}>{a.action}</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', color:'#6b7280', lineHeight:1.6 }}>{a.note}</div>
            </div>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LEARN — INHERITANCE
══════════════════════════════════════════════════════════════════ */
function InheritanceLearn() {
  return (
    <div>
      <p style={{ margin:'0 0 1.25rem', fontSize:'0.9375rem', color:'#374151', lineHeight:1.75, fontFamily:"'DM Sans',sans-serif" }}>
        Receiving an inheritance is often accompanied by grief. The financial decisions that follow can be life-changing — for better or worse. The single most important rule: <strong>slow down</strong>.
      </p>

      <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:12, padding:'1rem 1.125rem', marginBottom:'1.25rem', display:'flex', gap:10 }}>
        <AlertCircle size={16} color='#ef4444' style={{ flexShrink:0, marginTop:2 }}/>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', color:'#374151', lineHeight:1.65 }}>
          <strong style={{ color:'#ef4444' }}>The 1-year rule:</strong> Do not make any major financial decisions — buying a house, quitting your job, giving large gifts — for at least 6–12 months after receiving an inheritance. Park the money in a HYSA and let the grief process first.
        </div>
      </div>

      <SectionCard title="Inherited Account Rules">
        {[
          { type:'Inherited IRA (from non-spouse)', rule:'10-year rule', detail:'Must fully withdraw the account within 10 years of the original owner\'s death. Each withdrawal is taxable income. Strategize withdrawals to avoid bracket creep.' },
          { type:'Inherited IRA (from spouse)', rule:'More flexibility', detail:'Spouses can roll the inherited IRA into their own IRA and treat it as their own — no 10-year rule. Most beneficial option for spousal inheritance.' },
          { type:'Inherited Roth IRA', rule:'10-year rule (tax-free)', detail:'Must be distributed within 10 years but withdrawals are tax-free. Let it grow as long as possible and take the full distribution in year 10.' },
          { type:'Inherited brokerage account', rule:'Step-up in basis', detail:'The cost basis resets to the value at the date of death. Assets sold shortly after inherit may have little to no capital gains tax owed.' },
          { type:'Inherited real estate', rule:'Step-up in basis', detail:'Same step-up in basis. If you sell immediately, capital gains tax may be minimal. If you keep it, you inherit the maintenance and tax obligations.' },
        ].map(r => (
          <div key={r.type} style={{ padding:'0.75rem 0', borderBottom:'1px solid #f3f4f6' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', fontWeight:700, color:NAVY }}>{r.type}</span>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.75rem', fontWeight:700, color:TEAL, background:`${TEAL}15`, padding:'2px 8px', borderRadius:20 }}>{r.rule}</span>
            </div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', color:'#6b7280', lineHeight:1.65 }}>{r.detail}</div>
          </div>
        ))}
      </SectionCard>

      <SectionCard title="What to Do With a Lump Sum">
        {[
          { step:'1', label:'Park it safely', note:'Move to a HYSA immediately. Earn 4–5% while you think. Don\'t feel pressure to "do something" with it right away.', color:'#22c55e' },
          { step:'2', label:'Pay off high-interest debt', note:'Any debt above 6–7% interest should be eliminated. The guaranteed return of debt payoff beats most investments.', color:TEAL },
          { step:'3', label:'Max tax-advantaged accounts', note:'Max out Roth IRA, 401(k), and HSA for the year if you haven\'t. This is a rare opportunity to fully fund these accounts.', color:'#8b5cf6' },
          { step:'4', label:'Invest the remainder', note:'In a low-cost index fund portfolio at a brokerage like Fidelity or Vanguard. Don\'t try to time the market — dollar-cost average over 12 months if the sum is large.', color:'#f59e0b' },
          { step:'5', label:'Consider a fee-only advisor', note:'For inheritances above $100K, a one-time consultation with a fiduciary CFP is worth the cost for tax planning and investment guidance.', color:'#ec4899' },
        ].map(row => (
          <div key={row.step} style={{ display:'flex', gap:12, padding:'0.625rem 0', borderBottom:'1px solid #f3f4f6', alignItems:'flex-start' }}>
            <div style={{ width:26, height:26, borderRadius:'50%', background:row.color, color:'#fff', fontWeight:700, fontSize:'0.8125rem', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:"'DM Sans',sans-serif" }}>{row.step}</div>
            <div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', fontWeight:700, color:NAVY, marginBottom:2 }}>{row.label}</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', color:'#6b7280', lineHeight:1.6 }}>{row.note}</div>
            </div>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LEARN — DIVORCE
══════════════════════════════════════════════════════════════════ */
function DivorceLearn() {
  const tasks = [
    { label:'Open individual accounts immediately', note:'Open checking, savings, and credit card accounts in your name only. You need your own credit history and financial base.', urgent:true },
    { label:'Pull your credit reports', note:'Review all accounts, authorized users, and joint debts. Know exactly what you\'re responsible for.', urgent:true },
    { label:'Update beneficiary designations', note:'Your ex-spouse may still be named on your 401(k), IRA, and life insurance. These override your will — update them as soon as legally permissible.', urgent:true },
    { label:'Document all marital assets and debts', note:'Gather account statements, property records, tax returns, and debt balances. This is your negotiating foundation.', urgent:false },
    { label:'Understand marital vs. separate property', note:'Assets brought into the marriage or received as inheritance may be considered separate property. The rules vary significantly by state.', urgent:false },
    { label:'QDRO for retirement accounts', note:'A Qualified Domestic Relations Order (QDRO) is required to divide a 401(k) or pension in a divorce without triggering taxes and penalties.', urgent:false },
    { label:'Update estate plan and will', note:'Your divorce decree may not automatically update your will or POA. Have an attorney revise your estate documents.', urgent:false },
    { label:'Rebuild your emergency fund', note:'Two households are more expensive than one. Build a new 3–6 month fund as quickly as possible.', urgent:false },
    { label:'Review health insurance', note:'If you were on a spouse\'s plan, you have 60 days to find new coverage via COBRA or the ACA marketplace.', urgent:true },
  ];

  return (
    <div>
      <p style={{ margin:'0 0 1.25rem', fontSize:'0.9375rem', color:'#374151', lineHeight:1.75, fontFamily:"'DM Sans',sans-serif" }}>
        Divorce is one of the most financially disruptive life events. The financial decisions made during and immediately after can have decade-long consequences. Knowledge and preparation protect your interests.
      </p>

      <SectionCard title="Financial Checklist: Divorce">
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.75rem', color:'#9ca3af', marginBottom:'0.75rem' }}>
          <span style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:4, padding:'2px 6px', color:'#ef4444', fontWeight:700, marginRight:8 }}>URGENT</span>
          Items marked urgent should be addressed within the first 30 days.
        </div>
        {tasks.map(t => (
          <div key={t.label} style={{ display:'flex', gap:10, padding:'0.625rem 0', borderBottom:'1px solid #f3f4f6', alignItems:'flex-start' }}>
            {t.urgent
              ? <AlertCircle size={14} color='#ef4444' style={{ flexShrink:0, marginTop:2 }}/>
              : <CheckCircle2 size={14} color={TEAL} style={{ flexShrink:0, marginTop:2 }}/>
            }
            <div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', fontWeight:700, color: t.urgent ? '#ef4444' : NAVY, marginBottom:2 }}>{t.label}</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', color:'#6b7280', lineHeight:1.6 }}>{t.note}</div>
            </div>
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Asset Division: What to Know">
        {[
          { label:'Community property states (9 states)', detail:'AZ, CA, ID, LA, NV, NM, TX, WA, WI — assets acquired during marriage are generally split 50/50 regardless of who earned them.' },
          { label:'Equitable distribution states (most states)', detail:'Assets are divided "fairly" but not necessarily equally. Courts consider income, earning potential, length of marriage, and contributions.' },
          { label:'Marital home', detail:'Options: one spouse buys out the other, sell and split proceeds, or defer sale (common when children are involved). Keeping the home when you can\'t afford it alone is a common financial mistake.' },
          { label:'Social Security benefits', detail:'If married 10+ years, you may be entitled to up to 50% of your ex\'s Social Security benefit at FRA, without reducing their benefit.' },
        ].map(r => (
          <div key={r.label} style={{ padding:'0.625rem 0', borderBottom:'1px solid #f3f4f6' }}>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', fontWeight:700, color:NAVY, marginBottom:2 }}>{r.label}</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', color:'#6b7280', lineHeight:1.65 }}>{r.detail}</div>
          </div>
        ))}
        <InfoBox color='#8b5cf6'>A Certified Divorce Financial Analyst (CDFA) is a specialist who can model the long-term financial impact of different settlement options. This analysis often pays for itself many times over.</InfoBox>
      </SectionCard>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CALCULATOR — Job Loss Runway
══════════════════════════════════════════════════════════════════ */
function RunwayCalc() {
  const [savings,      setSavings]      = useState(20000);
  const [housing,      setHousing]      = useState(1800);
  const [food,         setFood]         = useState(600);
  const [transport,    setTransport]    = useState(400);
  const [utilities,    setUtilities]    = useState(200);
  const [insurance,    setInsurance]    = useState(300);
  const [minDebt,      setMinDebt]      = useState(300);
  const [other,        setOther]        = useState(200);
  const [unemployment, setUnemployment] = useState(1800);

  const essential = housing + food + transport + utilities + insurance + minDebt + other;
  const netMonthly = Math.max(0, essential - unemployment);
  const runway = netMonthly > 0 ? savings / netMonthly : 999;
  const runwayRounded = Math.floor(runway * 10) / 10;

  const color = runway >= 6 ? '#22c55e' : runway >= 3 ? '#f59e0b' : '#ef4444';

  return (
    <SectionCard title="Job Loss Runway Calculator" subtitle="How many months can you cover essential expenses with your current savings and unemployment benefits?">
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 1.25rem' }}>
        <div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', fontWeight:700, color:NAVY, marginBottom:'0.75rem' }}>Monthly Essential Expenses</div>
          <NumInput label="Housing (rent/mortgage)" value={housing} onChange={setHousing} step={50}/>
          <NumInput label="Food & Groceries" value={food} onChange={setFood} step={50}/>
          <NumInput label="Transportation" value={transport} onChange={setTransport} step={50}/>
          <NumInput label="Utilities" value={utilities} onChange={setUtilities} step={25}/>
          <NumInput label="Health Insurance" value={insurance} onChange={setInsurance} step={25}/>
          <NumInput label="Minimum Debt Payments" value={minDebt} onChange={setMinDebt} step={25}/>
          <NumInput label="Other Essentials" value={other} onChange={setOther} step={25}/>
        </div>
        <div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', fontWeight:700, color:NAVY, marginBottom:'0.75rem' }}>Your Situation</div>
          <NumInput label="Liquid Savings (emergency fund)" value={savings} onChange={setSavings} step={500}/>
          <NumInput label="Expected Unemployment Benefits ($/mo)" value={unemployment} onChange={setUnemployment} step={100} hint="Typically 40–50% of prior wages, up to state maximums"/>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.75rem', margin:'0.5rem 0 1.25rem' }}>
        <ResultBox label="Monthly Essential Spend" value={fmt(essential)} color='#f59e0b'/>
        <ResultBox label="Net Monthly Gap" value={fmt(netMonthly)} color={netMonthly > 0 ? '#ef4444' : '#22c55e'}/>
        <ResultBox label="Months of Runway" value={runway >= 100 ? '∞' : `${runwayRounded}mo`} color={color} size="lg"/>
      </div>

      <div style={{ background:`${color}0d`, border:`1px solid ${color}25`, borderRadius:12, padding:'1rem', fontFamily:"'DM Sans',sans-serif" }}>
        <div style={{ fontSize:'0.875rem', fontWeight:700, color, marginBottom:4 }}>
          {runway >= 6 ? 'Good runway — focus on your search' : runway >= 3 ? 'Limited runway — act quickly' : 'Critical — take action immediately'}
        </div>
        <div style={{ fontSize:'0.8125rem', color:'#374151', lineHeight:1.65 }}>
          {runway >= 100
            ? 'Unemployment benefits cover your essential expenses. Your savings remain untouched — focus your full energy on the job search without financial panic.'
            : runway >= 6
            ? `You have approximately ${runwayRounded} months before savings run out. Use this time wisely — job search intensively but you\'re not in crisis.`
            : runway >= 3
            ? `${runwayRounded} months of runway. Start cutting all non-essential spending immediately and file for unemployment if you haven\'t. Intensify your job search now.`
            : `Less than 3 months. This is a financial emergency. Cut everything non-essential, contact lenders about hardship programs, and explore all income options including gig work.`
          }
        </div>
      </div>

      <InfoBox color='#8b5cf6'>Most job searches take 3–6 months. A 6-month emergency fund gives you the negotiating leverage to find the right job — not just any job. File for unemployment the same week you lose your job.</InfoBox>
    </SectionCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CALCULATOR — Life Event Checklist
══════════════════════════════════════════════════════════════════ */
function EventChecklist() {
  const events = {
    marriage: {
      label: 'Getting Married',
      color: '#ec4899',
      items: [
        'Update beneficiary designations on retirement accounts and life insurance',
        'Add spouse to health insurance within 30–60 days',
        'Decide on joint, separate, or hybrid money management',
        'Update W-4 tax withholding with employer',
        'Create or update wills and healthcare directives',
        'Combine or coordinate auto and renters/homeowners insurance',
        'File taxes jointly (usually) in first married tax year',
      ],
    },
    baby: {
      label: 'Having a Baby',
      color: '#f59e0b',
      items: [
        'Add baby to health insurance within 30 days of birth',
        'Apply for Social Security number',
        'Update beneficiary designations to include child',
        'Update or create a will naming a guardian',
        'Review and increase life insurance coverage',
        'Open a 529 college savings plan',
        'Review and increase disability insurance',
        'Update emergency fund target (3–6 months of new expenses)',
      ],
    },
    jobloss: {
      label: 'Job Loss',
      color: '#ef4444',
      items: [
        'File for unemployment immediately',
        'Switch to essential spending only',
        'Evaluate health insurance (COBRA vs ACA vs spouse\'s plan)',
        'Calculate monthly runway',
        'Do NOT withdraw from retirement accounts',
        'Contact lenders if payments are at risk',
        'Decide what to do with old 401(k) — roll to IRA',
        'Update resume and LinkedIn immediately',
      ],
    },
    inheritance: {
      label: 'Receiving an Inheritance',
      color: '#8b5cf6',
      items: [
        'Park funds in HYSA — do not make major decisions for 6–12 months',
        'Understand what you inherited (IRA rules, step-up in basis, etc.)',
        'Consult a tax advisor before taking IRA distributions',
        'Pay off high-interest debt first',
        'Max out tax-advantaged accounts for the year',
        'Invest remainder in a diversified portfolio',
        'Consider a fee-only financial advisor for large amounts',
      ],
    },
    divorce: {
      label: 'Going Through Divorce',
      color: '#6b7280',
      items: [
        'Open individual checking and savings accounts immediately',
        'Pull credit reports and document all joint accounts',
        'Update beneficiary designations as soon as legally possible',
        'Secure copies of all financial documents',
        'Review health insurance options — 60 days to enroll',
        'Understand QDRO requirements for splitting retirement accounts',
        'Update will, healthcare directive, and power of attorney',
        'Rebuild emergency fund for single-income household',
      ],
    },
  };

  const [activeEvent, setActiveEvent] = useState('marriage');
  const [checked, setChecked] = useState({});
  const toggle = (id) => setChecked(c => ({ ...c, [id]: !c[id] }));

  const evt = events[activeEvent];
  const doneCount = evt.items.filter((_, i) => checked[`${activeEvent}-${i}`]).length;

  return (
    <SectionCard title="Life Event Financial Checklist" subtitle="Select a life event and track your financial to-dos.">
      <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'1.25rem' }}>
        {Object.entries(events).map(([key, e]) => (
          <button key={key} onClick={() => setActiveEvent(key)} style={{
            padding:'7px 14px', borderRadius:99, border:`1.5px solid ${activeEvent===key ? e.color : '#e5e7eb'}`,
            background: activeEvent===key ? e.color : '#fff', cursor:'pointer',
            fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem',
            fontWeight: activeEvent===key ? 700 : 500, color: activeEvent===key ? '#fff' : '#6b7280',
            transition:'all 0.15s', whiteSpace:'nowrap',
          }}>{e.label}</button>
        ))}
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:'1rem' }}>
        <div style={{ flex:1, background:'#f3f4f6', borderRadius:99, height:8, overflow:'hidden' }}>
          <div style={{ width:`${(doneCount/evt.items.length)*100}%`, background:evt.color, height:'100%', borderRadius:99, transition:'width 0.3s' }}/>
        </div>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', fontWeight:700, color:NAVY, whiteSpace:'nowrap' }}>{doneCount} / {evt.items.length}</span>
      </div>

      {evt.items.map((item, i) => {
        const id = `${activeEvent}-${i}`;
        return (
          <div key={id} onClick={() => toggle(id)}
            style={{ display:'flex', gap:12, padding:'0.625rem 0', borderBottom:'1px solid #f3f4f6', cursor:'pointer', alignItems:'flex-start' }}>
            <div style={{ width:20, height:20, borderRadius:6, border:`2px solid ${checked[id] ? evt.color : '#d1d5db'}`, background: checked[id] ? evt.color : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1, transition:'all 0.15s' }}>
              {checked[id] && <CheckCircle2 size={12} color='#fff'/>}
            </div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8375rem', color: checked[id] ? '#9ca3af' : '#374151', lineHeight:1.6, textDecoration: checked[id] ? 'line-through' : 'none' }}>{item}</div>
          </div>
        );
      })}
    </SectionCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
   RESOURCES
══════════════════════════════════════════════════════════════════ */
function ResourcesTab() {
  const resources = [
    {
      category: 'Job Loss & Unemployment',
      color: '#ef4444',
      items: [
        { name:'CareerOneStop — Unemployment Benefits Finder', desc:'Find your state\'s unemployment benefit information and filing links.', url:'https://www.careeronestop.org/LocalHelp/UnemploymentBenefits/find-unemployment-benefits.aspx' },
        { name:'HealthCare.gov — Special Enrollment', desc:'Apply for ACA health coverage after losing job-based insurance.', url:'https://www.healthcare.gov/coverage-outside-open-enrollment/special-enrollment-period/' },
        { name:'COBRA Information (DOL)', desc:'Official Department of Labor guide to COBRA continuation coverage.', url:'https://www.dol.gov/general/topic/health-plans/cobra' },
      ],
    },
    {
      category: 'Marriage & Family',
      color: '#ec4899',
      items: [
        { name:'IRS — Newlyweds Tax Guide', desc:'Tax implications of marriage, filing status changes, and W-4 updates.', url:'https://www.irs.gov/newsroom/tax-tips-for-newlyweds' },
        { name:'Savingforcollege.com — 529 Plan Comparison', desc:'Compare 529 plans by state, performance, and tax benefits.', url:'https://www.savingforcollege.com/529-plans/' },
        { name:'CFPB — Having a Baby Financial Checklist', desc:'Consumer Financial Protection Bureau guide to financial steps for new parents.', url:'https://www.consumerfinance.gov/consumer-tools/money-as-you-grow/' },
      ],
    },
    {
      category: 'Divorce & Inheritance',
      color: '#8b5cf6',
      items: [
        { name:'Institute for Divorce Financial Analysts', desc:'Find a Certified Divorce Financial Analyst (CDFA) near you.', url:'https://institutedfa.com/finding-a-cdfa/' },
        { name:'IRS — Inherited IRA Rules', desc:'Official IRS guidance on inherited IRA distribution requirements.', url:'https://www.irs.gov/retirement-plans/inherited-iras' },
        { name:'FINRA — Inherited Accounts Guide', desc:'What to know when you inherit a brokerage account.', url:'https://www.finra.org/investors/insights/4-things-know-if-you-inherit-brokerage-account' },
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
  { id:'marriage',    label:'Marriage',     icon:Heart     },
  { id:'baby',        label:'New Baby',     icon:Baby      },
  { id:'jobloss',     label:'Job Loss',     icon:Briefcase },
  { id:'inheritance', label:'Inheritance',  icon:DollarSign},
  { id:'divorce',     label:'Divorce',      icon:Users     },
];

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
export default function LifeEvents() {
  const navigate   = useNavigate();
  const [tab,      setTab]     = useState('learn');
  const [learnTab, setLearnTab]= useState('marriage');

  const learnContent = {
    marriage:    <MarriageLearn/>,
    baby:        <BabyLearn/>,
    jobloss:     <JobLossLearn/>,
    inheritance: <InheritanceLearn/>,
    divorce:     <DivorceLearn/>,
  };

  const learnTitles = {
    marriage:    { title:'Getting Married',    sub:'Combining finances, updating accounts, and setting up for financial success as a couple.' },
    baby:        { title:'Having a Baby',      sub:'The real costs of a new child and the financial steps to take before and after the birth.' },
    jobloss:     { title:'Job Loss',           sub:'The first steps to take, how to stretch your savings, and what to do with your old 401(k).' },
    inheritance: { title:'Receiving an Inheritance', sub:'The 1-year rule, inherited account rules, and how to handle a lump sum wisely.' },
    divorce:     { title:'Going Through Divorce', sub:'Protecting your finances, dividing assets correctly, and rebuilding after separation.' },
  };

  return (
    <div style={{ minHeight:'100vh', background:BG, fontFamily:"'DM Sans',sans-serif" }}>

      <div style={{ background:NAVY, padding:'2rem 2.5rem 0' }}>
        <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.35)', marginBottom:'1rem', display:'flex', alignItems:'center', gap:6 }}>
          <button onClick={() => navigate('/fun')} style={{ background:'none', border:'none', cursor:'pointer', color:TEAL, fontSize:'0.75rem', fontFamily:"'DM Sans',sans-serif", padding:0 }}>Dashboard</button>
          <ChevronRight size={12} color="rgba(255,255,255,0.25)"/>
          <span style={{ fontFamily:"'DM Sans',sans-serif" }}>Life Events</span>
        </div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2rem', fontWeight:700, color:'#fff', margin:'0 0 0.5rem', letterSpacing:'-0.025em', lineHeight:1.2 }}>
          Life Events Planning
        </h1>
        <p style={{ margin:'0 0 1.75rem', fontSize:'1rem', color:'rgba(255,255,255,0.55)', lineHeight:1.65, maxWidth:580, fontFamily:"'DM Sans',sans-serif" }}>
          Life doesn't follow a financial plan — but your finances can be ready for whatever life brings. Know the right moves for each major event before it happens.
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
            <RunwayCalc/>
            <EventChecklist/>
          </>
        )}

        {tab === 'resources' && <ResourcesTab/>}

      </div>
    </div>
  );
}
