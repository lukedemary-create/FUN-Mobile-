import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Calculator, ExternalLink, ChevronRight, ArrowRight,
  Info, CheckCircle2, XCircle, AlertCircle, Shield, Heart,
  Car, Home, Clock, Activity,
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
function fmt(n) { return '$' + Math.round(Math.abs(n)).toLocaleString(); }

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

function ResultBox({ label, value, color = TEAL, size = 'md' }) {
  return (
    <div style={{ background:`${color}0d`, border:`1px solid ${color}25`, borderRadius:12, padding: size==='lg'?'1.25rem':'0.875rem 1rem', textAlign:'center' }}>
      <div style={{ fontFamily:DISP, fontSize: size==='lg'?'2rem':'1.375rem', fontWeight:700, color, letterSpacing:'-0.02em', lineHeight:1.1 }}>{value}</div>
      <div style={{ fontSize:'0.75rem', color:T3, marginTop:4, fontFamily:UI, fontWeight:500 }}>{label}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LEARN — LIFE INSURANCE
══════════════════════════════════════════════════════════════════ */
function LifeInsuranceLearn() {
  const types = [
    {
      name:'Term Life', color:'#22c55e', badge:'Most recommended',
      cost:'$25–$50/mo', coverage:'10–30 years',
      pros:['Pure protection — low cost for high coverage','Ideal for income replacement during working years','Simple to understand and compare'],
      cons:['Expires — no payout if you outlive it','No cash value or investment component','Premiums rise significantly if you renew after expiration'],
      best:'Young families needing maximum coverage at minimum cost. The right choice for 90% of people.',
    },
    {
      name:'Whole Life', color:'#f59e0b', badge:'Most expensive',
      cost:'$300–$600/mo', coverage:'Lifetime',
      pros:['Permanent — guaranteed payout whenever you die','Builds cash value you can borrow against','Premium never increases'],
      cons:['5–15× more expensive than equivalent term coverage','Cash value growth is slow and tax-inefficient vs investing','Often sold aggressively — commissions are very high'],
      best:'Very high net worth individuals with estate planning needs, or those with permanent dependents (special needs child). Not for most people.',
    },
    {
      name:'Universal Life', color:'#8b5cf6', badge:'Most complex',
      cost:'$100–$400/mo', coverage:'Flexible',
      pros:['Flexible premiums and adjustable death benefit','Can accumulate cash value','Some versions (IUL) link to market index gains'],
      cons:['Extremely complex — hard to evaluate and compare','Many policies lapse when market underperforms','High internal costs eat into returns'],
      best:'Sophisticated buyers with specific estate or business planning needs who have exhausted all other tax-advantaged options.',
    },
  ];

  const stages = [
    { stage:'Single, no dependents', need:'Low', color:'#22c55e', note:'Mainly for final expenses or leaving something to parents. $50–100K is sufficient if at all.' },
    { stage:'Married, no children', need:'Moderate', color:TEAL, note:'Replace your income if your spouse relies on it for mortgage, lifestyle, or their own retirement savings.' },
    { stage:'Young family, mortgage', need:'High', color:'#f59e0b', note:'Peak need. Cover: income × years until financial independence + mortgage + education costs for children.' },
    { stage:'Empty nesters, building wealth', need:'Declining', color:'#8b5cf6', note:'Term may be expiring. If assets are built up, need decreases. Evaluate whether coverage is still necessary.' },
    { stage:'Retired, financially independent', need:'Low–None', color:T3, note:'If assets exceed liabilities and can support surviving spouse, life insurance may no longer be needed.' },
  ];

  const premiumData = [
    { age:'30', health:'Excellent', term:'20-yr', coverage:'$500K', monthly:'~$25' },
    { age:'35', health:'Excellent', term:'20-yr', coverage:'$500K', monthly:'~$32' },
    { age:'40', health:'Good',      term:'20-yr', coverage:'$500K', monthly:'~$55' },
    { age:'45', health:'Good',      term:'20-yr', coverage:'$500K', monthly:'~$95' },
    { age:'50', health:'Good',      term:'20-yr', coverage:'$500K', monthly:'~$165' },
    { age:'55', health:'Average',   term:'20-yr', coverage:'$500K', monthly:'~$320' },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
      {/* Type comparison */}
      <div>
        <h4 style={{ fontFamily:DISP, fontSize:'1rem', fontWeight:700, color:NAVY, margin:'0 0 0.875rem' }}>Term vs. Whole vs. Universal Life</h4>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          {types.map(t => (
            <div key={t.name} style={{ border:`1.5px solid ${t.color}30`, borderRadius:12, overflow:'hidden' }}>
              <div style={{ padding:'0.75rem 1rem', background:`${t.color}08`, borderBottom:`1px solid ${t.color}18`, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontFamily:DISP, fontSize:'0.9375rem', fontWeight:700, color:NAVY }}>{t.name}</span>
                  <span style={{ padding:'2px 9px', background:`${t.color}18`, border:`1px solid ${t.color}35`, borderRadius:100, fontSize:'0.6875rem', fontWeight:700, color:t.color, fontFamily:UI }}>{t.badge}</span>
                </div>
                <div style={{ display:'flex', gap:'1rem', fontSize:'0.8125rem', fontFamily:UI }}>
                  <span style={{ color:T3 }}>Cost: <strong style={{ color:NAVY }}>{t.cost}</strong></span>
                  <span style={{ color:T3 }}>Duration: <strong style={{ color:NAVY }}>{t.coverage}</strong></span>
                </div>
              </div>
              <div style={{ padding:'0.875rem 1rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 1.25rem' }}>
                <div>
                  {t.pros.map((p, i) => (
                    <div key={i} style={{ display:'flex', gap:7, alignItems:'flex-start', marginBottom:'0.375rem' }}>
                      <CheckCircle2 size={12} color='#22c55e' style={{ flexShrink:0, marginTop:2 }}/>
                      <span style={{ fontSize:'0.8125rem', color:T2, lineHeight:1.6, fontFamily:UI }}>{p}</span>
                    </div>
                  ))}
                </div>
                <div>
                  {t.cons.map((c, i) => (
                    <div key={i} style={{ display:'flex', gap:7, alignItems:'flex-start', marginBottom:'0.375rem' }}>
                      <XCircle size={12} color='#ef4444' style={{ flexShrink:0, marginTop:2 }}/>
                      <span style={{ fontSize:'0.8125rem', color:T2, lineHeight:1.6, fontFamily:UI }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding:'0.5rem 1rem 0.875rem', fontSize:'0.8125rem', color:T2, fontFamily:UI }}>
                <strong style={{ color:NAVY }}>Best for:</strong> {t.best}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Life stages */}
      <div>
        <h4 style={{ fontFamily:DISP, fontSize:'1rem', fontWeight:700, color:NAVY, margin:'0 0 0.875rem' }}>Coverage Need by Life Stage</h4>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
          {stages.map((s, i) => (
            <div key={i} style={{ display:'flex', gap:'0.875rem', alignItems:'flex-start', padding:'0.75rem 0.875rem', background:RAISE, borderRadius:10, border:'1px solid #f0f0f0' }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:s.color, flexShrink:0, marginTop:6 }}/>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                  <span style={{ fontWeight:700, color:NAVY, fontSize:'0.875rem', fontFamily:UI }}>{s.stage}</span>
                  <span style={{ padding:'1px 8px', background:`${s.color}15`, borderRadius:100, fontSize:'0.6875rem', fontWeight:700, color:s.color, fontFamily:UI }}>{s.need} need</span>
                </div>
                <span style={{ fontSize:'0.8125rem', color:T3, lineHeight:1.6, fontFamily:UI }}>{s.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium table */}
      <div>
        <h4 style={{ fontFamily:DISP, fontSize:'1rem', fontWeight:700, color:NAVY, margin:'0 0 0.875rem' }}>Sample Term Life Premiums — $500K, 20-Year Term</h4>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:UI, fontSize:'0.875rem' }}>
            <thead>
              <tr style={{ borderBottom:'2px solid #e5e7eb' }}>
                {['Age','Health','Term','Coverage','Est. Monthly'].map(h => (
                  <th key={h} style={{ padding:'0.5rem 0.75rem', textAlign:'left', fontSize:'0.75rem', fontWeight:700, color:T3, textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {premiumData.map((row, i) => (
                <tr key={i} style={{ borderBottom:'1px solid #f0f0f0', background: i%2===0?'#fafafa':'#fff' }}>
                  <td style={{ padding:'0.625rem 0.75rem', fontWeight:700, color:NAVY }}>{row.age}</td>
                  <td style={{ padding:'0.625rem 0.75rem', color:T2 }}>{row.health}</td>
                  <td style={{ padding:'0.625rem 0.75rem', color:T2 }}>{row.term}</td>
                  <td style={{ padding:'0.625rem 0.75rem', color:T2 }}>{row.coverage}</td>
                  <td style={{ padding:'0.625rem 0.75rem', fontWeight:700, color:TEAL }}>{row.monthly}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <InfoBox color="#f59e0b">Every year you wait to buy term life insurance increases your premium — and a health event could make you uninsurable. Lock in rates while you're young and healthy.</InfoBox>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LEARN — HEALTH INSURANCE
══════════════════════════════════════════════════════════════════ */
function HealthInsuranceLearn() {
  const plans = [
    { name:'HMO', color:TEAL, best:'Lowest cost, OK with a primary care gatekeeper', pros:['Lowest premiums','Lowest out-of-pocket costs','Predictable copays'], cons:['Requires referrals to see specialists','Must stay in-network (except emergencies)','Less flexibility in choosing providers'] },
    { name:'PPO', color:'#3b82f6', best:'Flexibility to see any doctor without referrals', pros:['No referrals needed','In-network AND out-of-network coverage','Largest provider networks'], cons:['Higher premiums and deductibles','More complex billing','Out-of-network care is expensive'] },
    { name:'HDHP + HSA', color:'#8b5cf6', best:'Healthy, high earners who can invest the HSA', pros:['Lowest premiums of any plan','Unlocks HSA (triple tax advantage)','Great for healthy people with few claims'], cons:['High deductible — $1,600+ individual','You pay full cost until deductible is met','Not ideal if you use healthcare frequently'] },
  ];

  const terms = [
    { term:'Deductible', color:'#ef4444', def:'Amount you pay before insurance kicks in. Example: $1,500 deductible means you pay the first $1,500 of covered costs each year.' },
    { term:'Premium', color:'#f59e0b', def:'Monthly payment to maintain insurance coverage. Paid regardless of whether you use healthcare.' },
    { term:'Copay', color:TEAL, def:'Fixed amount you pay per visit after the deductible (or sometimes without meeting deductible). Example: $25 copay for primary care.' },
    { term:'Coinsurance', color:'#3b82f6', def:'Your percentage share of costs after meeting your deductible. Example: 20% coinsurance means you pay 20%, insurance pays 80%.' },
    { term:'Out-of-Pocket Max', color:'#22c55e', def:'The most you\'ll pay in a year. After hitting this, insurance covers 100% of covered expenses. Critical protection against catastrophic costs.' },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
      <div>
        <h4 style={{ fontFamily:DISP, fontSize:'1rem', fontWeight:700, color:NAVY, margin:'0 0 0.875rem' }}>HMO vs PPO vs HDHP</h4>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          {plans.map(p => (
            <div key={p.name} style={{ border:`1.5px solid ${p.color}30`, borderRadius:12, overflow:'hidden' }}>
              <div style={{ padding:'0.75rem 1rem', background:`${p.color}08`, borderBottom:`1px solid ${p.color}15`, display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontFamily:DISP, fontWeight:700, fontSize:'0.9375rem', color:NAVY }}>{p.name}</span>
                <span style={{ fontSize:'0.8125rem', color:T3, fontFamily:UI }}>— {p.best}</span>
              </div>
              <div style={{ padding:'0.875rem 1rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 1rem' }}>
                <div>
                  {p.pros.map((x, i) => <div key={i} style={{ display:'flex', gap:7, marginBottom:'0.3rem' }}><CheckCircle2 size={12} color='#22c55e' style={{ flexShrink:0, marginTop:2 }}/><span style={{ fontSize:'0.8125rem', color:T2, lineHeight:1.6, fontFamily:UI }}>{x}</span></div>)}
                </div>
                <div>
                  {p.cons.map((x, i) => <div key={i} style={{ display:'flex', gap:7, marginBottom:'0.3rem' }}><XCircle size={12} color='#ef4444' style={{ flexShrink:0, marginTop:2 }}/><span style={{ fontSize:'0.8125rem', color:T2, lineHeight:1.6, fontFamily:UI }}>{x}</span></div>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 style={{ fontFamily:DISP, fontSize:'1rem', fontWeight:700, color:NAVY, margin:'0 0 0.875rem' }}>Health Plan Anatomy — Key Terms</h4>
        {/* Visual flow */}
        <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'1rem', padding:'1rem', background:RAISE, borderRadius:12 }}>
          <div style={{ textAlign:'center', fontSize:'0.75rem', fontWeight:700, color:T3, letterSpacing:'0.06em', textTransform:'uppercase', fontFamily:UI, marginBottom:'0.5rem' }}>Your cost journey in a year</div>
          {[
            { label:'You pay 100% of costs', sub:'Until you meet your deductible', color:'#ef4444', pct:35 },
            { label:'You pay your coinsurance %', sub:'Insurance pays the rest (e.g. 20% you / 80% insurer)', color:'#f59e0b', pct:35 },
            { label:'Insurance pays 100%', sub:'After you hit your out-of-pocket maximum', color:'#22c55e', pct:30 },
          ].map((s, i) => (
            <div key={i} style={{ display:'flex', gap:'0.75rem', alignItems:'center' }}>
              <div style={{ width:`${s.pct}%`, maxWidth:120, height:28, background:s.color, borderRadius:7, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:'0.6875rem', fontWeight:700, color:'#fff', fontFamily:UI }}>Phase {i+1}</span>
              </div>
              <div>
                <div style={{ fontSize:'0.8125rem', fontWeight:700, color:NAVY, fontFamily:UI }}>{s.label}</div>
                <div style={{ fontSize:'0.75rem', color:T3, fontFamily:UI }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
          {terms.map((t, i) => (
            <div key={i} style={{ display:'flex', gap:'0.875rem', padding:'0.625rem 0.875rem', background:SURF, border:`1px solid ${B1}`, borderRadius:10 }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:t.color, flexShrink:0, marginTop:6 }}/>
              <div>
                <span style={{ fontWeight:700, color:NAVY, fontSize:'0.875rem', fontFamily:UI }}>{t.term}: </span>
                <span style={{ fontSize:'0.875rem', color:T2, lineHeight:1.65, fontFamily:UI }}>{t.def}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LEARN — AUTO INSURANCE
══════════════════════════════════════════════════════════════════ */
function AutoInsuranceLearn() {
  const coverages = [
    { name:'Liability', color:TEAL, required:'Required in most states', desc:'Pays for damage you cause to others — their car, property, and medical bills. Bodily Injury + Property Damage. State minimums are often dangerously low. Carry at least $100K/$300K.', tip:'State minimums like 25/50/25 are barely enough. A single serious accident can exceed limits and put your assets at risk.' },
    { name:'Collision', color:'#3b82f6', required:'Optional', desc:'Pays to repair or replace YOUR car after a collision, regardless of fault. Subject to your deductible. Required by lenders if you have a car loan or lease.', tip:'If your car\'s value is less than 10× your annual premium, dropping collision may make financial sense.' },
    { name:'Comprehensive', color:'#8b5cf6', required:'Optional', desc:'Covers non-collision damage: theft, vandalism, weather, fire, floods, hitting an animal. Often cheaper than collision. Also required by lenders.', tip:'Comprehensive is typically inexpensive ($100–200/yr). Usually worth keeping even on older cars.' },
    { name:'Uninsured/Underinsured Motorist', color:'#f59e0b', required:'Required in ~20 states', desc:'Protects you if you\'re hit by a driver with no insurance or not enough coverage. About 13% of US drivers are uninsured. Critical protection.', tip:'Always carry UM/UIM at least equal to your liability limits. It\'s usually very cheap to add.' },
    { name:'Personal Injury Protection (PIP)', color:'#ef4444', required:'Required in no-fault states', desc:'Covers your medical expenses and lost wages after an accident, regardless of fault. Required in no-fault states (FL, NY, NJ, MI, etc.).', tip:'In no-fault states, PIP is mandatory. In other states, medical payments coverage provides similar but more limited protection.' },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
      <p style={{ fontSize:'0.875rem', color:T3, margin:'0 0 0.5rem', lineHeight:1.7, fontFamily:UI }}>
        Auto insurance is bundled from several types of coverage. Understanding each helps you build the right policy — not just the cheapest.
      </p>
      {coverages.map(c => (
        <div key={c.name} style={{ border:`1.5px solid ${c.color}25`, borderRadius:12, overflow:'hidden' }}>
          <div style={{ padding:'0.75rem 1rem', background:`${c.color}08`, borderBottom:`1px solid ${c.color}18`, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
            <span style={{ fontFamily:DISP, fontWeight:700, fontSize:'0.9375rem', color:NAVY }}>{c.name}</span>
            <span style={{ padding:'2px 10px', background:`${c.color}15`, border:`1px solid ${c.color}30`, borderRadius:100, fontSize:'0.6875rem', fontWeight:700, color:c.color, fontFamily:UI }}>{c.required}</span>
          </div>
          <div style={{ padding:'0.75rem 1rem' }}>
            <p style={{ margin:'0 0 0.5rem', fontSize:'0.875rem', color:T2, lineHeight:1.7, fontFamily:UI }}>{c.desc}</p>
            <div style={{ display:'flex', gap:7, padding:'0.5rem 0.75rem', background:`${c.color}0a`, borderRadius:8 }}>
              <Info size={12} color={c.color} style={{ flexShrink:0, marginTop:2 }}/>
              <p style={{ margin:0, fontSize:'0.8rem', color:'#4b5563', lineHeight:1.6, fontFamily:UI }}>{c.tip}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LEARN — HOME / RENTERS
══════════════════════════════════════════════════════════════════ */
function HomeInsuranceLearn() {
  const covered    = ['Damage from fire and smoke','Theft and vandalism','Wind and hail damage','Water damage from burst pipes','Lightning strikes','Falling objects','Liability if someone is injured on your property','Additional living expenses if home is uninhabitable'];
  const notCovered = ['Flooding (requires separate NFIP or private flood policy)','Earthquakes (separate policy required)','Gradual wear and tear','Pest/termite damage','Sewer backup (often available as rider)','Mold (usually excluded unless caused by covered event)','High-value jewelry/art beyond standard limits','Business equipment or home business liability'];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.875rem' }}>
        <div style={{ border:'1.5px solid #22c55e30', borderRadius:12, overflow:'hidden' }}>
          <div style={{ padding:'0.625rem 0.875rem', background:'rgba(34,197,94,0.08)', borderBottom:'1px solid rgba(34,197,94,0.15)' }}>
            <span style={{ fontFamily:DISP, fontWeight:700, fontSize:'0.9375rem', color:NAVY }}>Typically Covered</span>
          </div>
          <div style={{ padding:'0.75rem 0.875rem' }}>
            {covered.map((x, i) => <div key={i} style={{ display:'flex', gap:7, marginBottom:'0.375rem' }}><CheckCircle2 size={12} color='#22c55e' style={{ flexShrink:0, marginTop:2 }}/><span style={{ fontSize:'0.8125rem', color:T2, lineHeight:1.6, fontFamily:UI }}>{x}</span></div>)}
          </div>
        </div>
        <div style={{ border:'1.5px solid #ef444430', borderRadius:12, overflow:'hidden' }}>
          <div style={{ padding:'0.625rem 0.875rem', background:'rgba(239,68,68,0.06)', borderBottom:'1px solid rgba(239,68,68,0.15)' }}>
            <span style={{ fontFamily:DISP, fontWeight:700, fontSize:'0.9375rem', color:NAVY }}>Not Covered</span>
          </div>
          <div style={{ padding:'0.75rem 0.875rem' }}>
            {notCovered.map((x, i) => <div key={i} style={{ display:'flex', gap:7, marginBottom:'0.375rem' }}><XCircle size={12} color='#ef4444' style={{ flexShrink:0, marginTop:2 }}/><span style={{ fontSize:'0.8125rem', color:T2, lineHeight:1.6, fontFamily:UI }}>{x}</span></div>)}
          </div>
        </div>
      </div>

      <div>
        <h4 style={{ fontFamily:DISP, fontSize:'1rem', fontWeight:700, color:NAVY, margin:'0 0 0.875rem' }}>Replacement Cost vs Actual Cash Value (ACV)</h4>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.875rem' }}>
          {[
            { type:'Replacement Cost', color:'#22c55e', desc:'Pays what it costs to rebuild or replace at TODAY\'s prices. A 10-year-old roof destroyed in a storm gets a new roof. Always choose this if you can.', example:'Roof cost today: $15,000 → Insurer pays: $15,000' },
            { type:'Actual Cash Value', color:'#f59e0b', desc:'Pays replacement cost MINUS depreciation. A 10-year-old roof has depreciated significantly — you may get far less than replacement cost.', example:'Roof cost today: $15,000 − $8,000 depreciation → Insurer pays: $7,000' },
          ].map(t => (
            <div key={t.type} style={{ padding:'1rem', background:`${t.color}08`, border:`1.5px solid ${t.color}25`, borderRadius:12 }}>
              <div style={{ fontFamily:DISP, fontWeight:700, color:NAVY, marginBottom:6, fontSize:'0.9375rem' }}>{t.type}</div>
              <p style={{ margin:'0 0 0.625rem', fontSize:'0.8125rem', color:T2, lineHeight:1.65, fontFamily:UI }}>{t.desc}</p>
              <div style={{ padding:'0.5rem 0.75rem', background:'rgba(255,255,255,0.7)', borderRadius:8, fontSize:'0.8rem', color:'#4b5563', fontFamily:UI, fontWeight:600 }}>{t.example}</div>
            </div>
          ))}
        </div>
        <InfoBox>Renters insurance is remarkably cheap ($15–30/month) and covers your personal property AND liability. If you rent and don't have it, get it today.</InfoBox>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LEARN — LONG-TERM CARE
══════════════════════════════════════════════════════════════════ */
function LTCLearn() {
  const costs = [
    { type:'Adult Day Health Care',  daily:'$95',   monthly:'$2,000–$2,500',  annual:'$24,000–$30,000' },
    { type:'Home Health Aide',       daily:'$175',  monthly:'$4,500–$5,200',  annual:'$54,000–$62,400' },
    { type:'Assisted Living Facility',daily:'$165', monthly:'$4,500–$5,500',  annual:'$54,000–$66,000' },
    { type:'Nursing Home (Semi-private)',daily:'$295',monthly:'$8,000–$9,500',annual:'$96,000–$114,000' },
    { type:'Nursing Home (Private)',  daily:'$335', monthly:'$9,500–$11,000', annual:'$114,000–$132,000' },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
      <p style={{ fontSize:'0.875rem', color:T3, margin:0, lineHeight:1.7, fontFamily:UI }}>
        About <strong style={{ color:NAVY }}>70% of people over 65</strong> will need some form of long-term care. Medicare covers very little (only short-term skilled care). Medicaid requires spending down nearly all assets first. LTC insurance bridges the gap.
      </p>

      <div>
        <h4 style={{ fontFamily:DISP, fontSize:'1rem', fontWeight:700, color:NAVY, margin:'0 0 0.875rem' }}>National Average LTC Costs (2024)</h4>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:UI, fontSize:'0.875rem' }}>
            <thead>
              <tr style={{ borderBottom:'2px solid #e5e7eb' }}>
                {['Care Type','Daily Cost','Monthly Cost','Annual Cost'].map(h => (
                  <th key={h} style={{ padding:'0.5rem 0.75rem', textAlign:'left', fontSize:'0.75rem', fontWeight:700, color:T3, textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {costs.map((row, i) => (
                <tr key={i} style={{ borderBottom:'1px solid #f0f0f0', background: i%2===0?'#fafafa':'#fff' }}>
                  <td style={{ padding:'0.625rem 0.75rem', fontWeight:600, color:NAVY }}>{row.type}</td>
                  <td style={{ padding:'0.625rem 0.75rem', color:T2 }}>{row.daily}</td>
                  <td style={{ padding:'0.625rem 0.75rem', color:T2 }}>{row.monthly}</td>
                  <td style={{ padding:'0.625rem 0.75rem', fontWeight:700, color:'#ef4444' }}>{row.annual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h4 style={{ fontFamily:DISP, fontSize:'1rem', fontWeight:700, color:NAVY, margin:'0 0 0.875rem' }}>When to Buy LTC Insurance</h4>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
          {[
            { age:'Under 50', rec:'Too early', color:T3, note:'Premiums are low but you\'ll pay them for decades. Most advisors suggest waiting.' },
            { age:'50–55', rec:'Sweet spot', color:'#22c55e', note:'Best balance of affordable premiums and insurability. Buy here if LTC is in your plan.' },
            { age:'55–65', rec:'Optimal window', color:TEAL, note:'Still insurable for most. Premiums rising but still manageable. Act before health issues arise.' },
            { age:'65–70', rec:'Possible but expensive', color:'#f59e0b', note:'Premiums are high. Health screening may disqualify you. Hybrid life/LTC policies may be better.' },
            { age:'Over 70', rec:'Very difficult', color:'#ef4444', note:'Most traditional LTC policies unavailable or unaffordable. Self-insuring or Medicaid planning are alternatives.' },
          ].map((s, i) => (
            <div key={i} style={{ display:'flex', gap:'0.875rem', alignItems:'center', padding:'0.625rem 0.875rem', background:RAISE, borderRadius:9, border:'1px solid #f0f0f0' }}>
              <div style={{ width:60, textAlign:'center' }}>
                <div style={{ fontWeight:800, color:NAVY, fontSize:'0.875rem', fontFamily:UI }}>{s.age}</div>
              </div>
              <div style={{ width:2, height:32, background:'#e5e7eb' }}/>
              <div style={{ flex:1 }}>
                <span style={{ padding:'2px 9px', background:`${s.color}15`, borderRadius:100, fontSize:'0.6875rem', fontWeight:700, color:s.color, fontFamily:UI, marginBottom:4, display:'inline-block' }}>{s.rec}</span>
                <div style={{ fontSize:'0.8125rem', color:T3, lineHeight:1.6, fontFamily:UI }}>{s.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LEARN — DISABILITY INSURANCE
══════════════════════════════════════════════════════════════════ */
function DisabilityLearn() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
      <p style={{ fontSize:'0.875rem', color:T3, margin:0, lineHeight:1.7, fontFamily:UI }}>
        A 35-year-old has a <strong style={{ color:NAVY }}>1 in 4 chance</strong> of becoming disabled before retirement. Yet most people insure their car and phone while leaving their income — their most valuable asset — completely unprotected.
      </p>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.875rem' }}>
        {[
          {
            type:'Short-Term Disability (STD)',
            color:TEAL,
            duration:'3–6 months',
            wait:'0–14 days',
            covers:'60–70% of income',
            points:['Often provided by employers at low/no cost','Covers maternity leave, surgeries, temporary illness','Gap between injury and LTD benefit start','Usually Group policy — not portable if you leave'],
          },
          {
            type:'Long-Term Disability (LTD)',
            color:NAVY,
            duration:'2 years to age 65+',
            wait:'90–180 days (elimination period)',
            covers:'50–70% of income',
            points:['Most critical coverage — replaces income for years','Group LTD through employer is affordable but limited','Own-Occupation vs Any-Occupation definitions matter enormously','Individual policies are portable and offer stronger protections'],
          },
        ].map(t => (
          <div key={t.type} style={{ border:`1.5px solid ${t.color}30`, borderRadius:12, overflow:'hidden' }}>
            <div style={{ padding:'0.75rem 1rem', background:`${t.color}0c`, borderBottom:`1px solid ${t.color}18` }}>
              <div style={{ fontFamily:DISP, fontWeight:700, fontSize:'0.875rem', color:NAVY, marginBottom:6 }}>{t.type}</div>
              <div style={{ display:'flex', flexDirection:'column', gap:3, fontSize:'0.75rem', fontFamily:UI }}>
                <span style={{ color:T3 }}>Duration: <strong style={{ color:NAVY }}>{t.duration}</strong></span>
                <span style={{ color:T3 }}>Wait period: <strong style={{ color:NAVY }}>{t.wait}</strong></span>
                <span style={{ color:T3 }}>Typical coverage: <strong style={{ color:t.color }}>{t.covers}</strong></span>
              </div>
            </div>
            <div style={{ padding:'0.75rem 1rem' }}>
              {t.points.map((p, i) => <div key={i} style={{ display:'flex', gap:7, marginBottom:'0.35rem' }}><div style={{ width:5, height:5, borderRadius:'50%', background:t.color, flexShrink:0, marginTop:5 }}/><span style={{ fontSize:'0.8125rem', color:T2, lineHeight:1.6, fontFamily:UI }}>{p}</span></div>)}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding:'0.875rem 1rem', background:'rgba(0,180,198,0.07)', border:'1px solid rgba(0,180,198,0.2)', borderRadius:12 }}>
        <div style={{ fontFamily:DISP, fontWeight:700, color:NAVY, marginBottom:6, fontSize:'0.9375rem' }}>Own-Occupation vs Any-Occupation — The Most Important Distinction</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', fontSize:'0.8125rem', fontFamily:UI }}>
          <div style={{ padding:'0.625rem 0.75rem', background:'rgba(34,197,94,0.08)', borderRadius:9, color:T2 }}>
            <strong style={{ color:'#22c55e' }}>Own-Occupation:</strong> Pays benefits if you can't perform <em>your specific job</em>. A surgeon who can't operate collects benefits even if they could work in another capacity. Always buy this.
          </div>
          <div style={{ padding:'0.625rem 0.75rem', background:'rgba(239,68,68,0.07)', borderRadius:9, color:T2 }}>
            <strong style={{ color:'#ef4444' }}>Any-Occupation:</strong> Only pays if you're unable to perform <em>any</em> job. Much harder to qualify. Often what group LTD policies use. Weaker protection.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CALCULATE — DIME Life Insurance Calculator
══════════════════════════════════════════════════════════════════ */
function DIMECalc() {
  const [debt,        setDebt]        = useState(15000);
  const [income,      setIncome]      = useState(75000);
  const [incomeYears, setIncomeYears] = useState(20);
  const [mortgage,    setMortgage]    = useState(250000);
  const [education,   setEducation]   = useState(120000);
  const [existing,    setExisting]    = useState(0);

  const D = debt;
  const I = income * incomeYears;
  const M = mortgage;
  const E = education;
  const total = D + I + M + E;
  const needed = Math.max(0, total - existing);

  const items = [
    { label:'D — Debt', value:D, color:'#ef4444', desc:'All debts excluding mortgage (credit cards, car, student loans)' },
    { label:'I — Income', value:I, color:'#f59e0b', desc:`${incomeYears} years × ${fmt(income)}/yr annual income to replace` },
    { label:'M — Mortgage', value:M, color:TEAL, desc:'Outstanding mortgage balance' },
    { label:'E — Education', value:E, color:'#8b5cf6', desc:'Estimated education costs for all dependents' },
  ];

  return (
    <div>
      <p style={{ fontSize:'0.875rem', color:T3, marginBottom:'1.25rem', lineHeight:1.65, fontFamily:UI }}>
        The <strong style={{ color:NAVY }}>DIME method</strong> estimates how much life insurance you need by adding four components: Debt, Income replacement, Mortgage, and Education costs.
      </p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 1rem' }}>
        <NumInput label="Outstanding Debts (excl. mortgage)" value={debt} onChange={setDebt} min={0} step={1000}/>
        <NumInput label="Annual Income to Replace" value={income} onChange={setIncome} min={0} step={1000}/>
      </div>
      <div style={{ marginBottom:'1rem' }}>
        <label style={{ display:'block', fontSize:'0.8125rem', fontWeight:600, color:NAVY, marginBottom:'0.375rem', fontFamily:UI }}>Income Replacement Years — {incomeYears} years</label>
        <input type="range" min={5} max={40} step={1} value={incomeYears} onChange={e=>setIncomeYears(Number(e.target.value))} style={{ width:'100%', accentColor:TEAL, cursor:'pointer' }}/>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.6875rem', color:T3, fontFamily:UI, marginTop:2 }}>
          <span>5</span><span>10</span><span>20</span><span>30</span><span>40</span>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 1rem' }}>
        <NumInput label="Mortgage Balance" value={mortgage} onChange={setMortgage} min={0} step={5000}/>
        <NumInput label="Education Costs (all children)" value={education} onChange={setEducation} min={0} step={5000} hint="~$30K/yr × 4 yrs per child"/>
      </div>
      <NumInput label="Existing Life Insurance Coverage" value={existing} onChange={setExisting} min={0} step={10000} hint="From employer group policy or existing individual policy"/>

      <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'1rem' }}>
        {items.map(it => (
          <div key={it.label} style={{ display:'flex', alignItems:'center', gap:'0.875rem', padding:'0.625rem 0.875rem', background:RAISE, borderRadius:9 }}>
            <div style={{ width:10, height:10, borderRadius:3, background:it.color, flexShrink:0 }}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'0.8125rem', fontWeight:700, color:NAVY, fontFamily:UI }}>{it.label}</div>
              <div style={{ fontSize:'0.75rem', color:T3, fontFamily:UI }}>{it.desc}</div>
            </div>
            <div style={{ fontFamily:DISP, fontSize:'1rem', fontWeight:700, color:it.color }}>{fmt(it.value)}</div>
          </div>
        ))}
        {existing > 0 && (
          <div style={{ display:'flex', alignItems:'center', gap:'0.875rem', padding:'0.625rem 0.875rem', background:'#f0fdff', borderRadius:9, border:'1px solid rgba(0,180,198,0.2)' }}>
            <div style={{ width:10, height:10, borderRadius:3, background:'#22c55e', flexShrink:0 }}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'0.8125rem', fontWeight:700, color:NAVY, fontFamily:UI }}>Minus existing coverage</div>
            </div>
            <div style={{ fontFamily:DISP, fontSize:'1rem', fontWeight:700, color:'#22c55e' }}>−{fmt(existing)}</div>
          </div>
        )}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
        <ResultBox label="Total DIME" value={fmt(total)} color="#6b7280"/>
        <ResultBox label="Additional Coverage Needed" value={fmt(needed)} color={needed > 0 ? TEAL : '#22c55e'} size="lg"/>
      </div>
      <InfoBox>This is a starting estimate. A licensed insurance professional can refine it based on your spouse's income, Social Security survivor benefits, and your specific financial situation.</InfoBox>
    </div>
  );
}

/* ── Auto Deductible Break-Even ─────────────────────────────────── */
function AutoDeductibleCalc() {
  const [currentDed, setCurrentDed] = useState(500);
  const [newDed,     setNewDed]     = useState(1000);
  const [savings,    setSavings]    = useState(150);

  const dedIncrease  = Math.max(0, newDed - currentDed);
  const breakEven    = savings > 0 ? (dedIncrease / savings).toFixed(1) : '—';
  const fiveYearSave = savings * 5 - (dedIncrease > 0 ? 0 : 0); // assuming no claims

  return (
    <div>
      <p style={{ fontSize:'0.875rem', color:T3, marginBottom:'1.25rem', lineHeight:1.65, fontFamily:UI }}>
        Raising your deductible lowers your premium but increases your out-of-pocket risk per claim. This calculator shows when the switch pays off.
      </p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 1rem' }}>
        <NumInput label="Current Deductible" value={currentDed} onChange={setCurrentDed} min={0} step={100}/>
        <NumInput label="New (Higher) Deductible" value={newDed} onChange={v=>setNewDed(Math.max(currentDed, v))} min={currentDed} step={100}/>
      </div>
      <NumInput label="Estimated Annual Premium Savings" value={savings} onChange={setSavings} min={0} step={25} hint="Get a quote from your insurer or use Insurify to compare"/>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.625rem' }}>
        <ResultBox label="Deductible Increase" value={fmt(dedIncrease)} color="#f59e0b"/>
        <ResultBox label="Break-Even Point" value={`${breakEven} yrs`} color={Number(breakEven) <= 3 ? '#22c55e' : '#ef4444'} size="lg"/>
        <ResultBox label="5-Year Premium Savings" value={fmt(fiveYearSave)} color={TEAL}/>
      </div>
      <InfoBox color={Number(breakEven) <= 3 ? '#22c55e' : '#f59e0b'}>
        {Number(breakEven) <= 3
          ? `A ${breakEven}-year break-even is excellent. If you go more than ${breakEven} years without a claim, the higher deductible pays off.`
          : `A ${breakEven}-year break-even is long. Only switch if you have a solid emergency fund to cover the higher deductible.`}
      </InfoBox>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   RESOURCES
══════════════════════════════════════════════════════════════════ */
const RESOURCES = [
  { category:'Life Insurance', color:'#ef4444', providers:[
    { name:'Policygenius', badge:'Best comparison tool', desc:'Compares quotes from 30+ life insurance carriers in minutes. Independent — not tied to one insurer. Excellent for term life shopping.' },
    { name:'Haven Life',   badge:'Best digital term',   desc:'100% online term life from MassMutual. Instant decision for healthy applicants under 45. No medical exam required for many policies.' },
    { name:'Northwestern Mutual', badge:'Best whole life', desc:'Top-rated whole life and permanent insurance. Works through advisors. Best for complex planning needs, not simple term coverage.' },
  ]},
  { category:'Auto Insurance', color:'#3b82f6', providers:[
    { name:'Insurify', badge:'Best comparison tool', desc:'AI-powered comparison engine for auto insurance. Shows real quotes from 40+ carriers instantly without sharing your info with everyone.' },
    { name:'Progressive', badge:'Best for high-risk drivers', desc:'Name Your Price tool. Snapshot telematics program can significantly reduce premiums for safe drivers.' },
    { name:'State Farm', badge:'Best for bundling', desc:'Largest US auto insurer. Excellent bundling discounts with homeowners. Strong agent network for in-person service.' },
  ]},
  { category:'Home & Renters Insurance', color:'#22c55e', providers:[
    { name:'Lemonade', badge:'Best for renters', desc:'AI-powered, instant renters and homeowners coverage. Renters policies from $5/mo. Digital-first experience. B Corp certified.' },
    { name:'Policygenius', badge:'Best for homeowners comparison', desc:'Compares homeowners rates from top carriers. Especially strong if you want to bundle home + auto quotes.' },
  ]},
  { category:'Long-Term Care', color:'#8b5cf6', providers:[
    { name:'AALTCI (American Association for LTC Insurance)', badge:'Best educational resource', desc:'Independent trade association providing LTC insurance education, comparison resources, and cost data by state.' },
    { name:'Mutual of Omaha', badge:'Best LTC provider', desc:'One of the largest LTC insurance providers with strong financial stability ratings. Offers traditional and hybrid policies.' },
  ]},
];

function ResourcesTab() {
  return (
    <div>
      <div style={{ padding:'0.875rem 1rem', background:'rgba(0,180,198,0.06)', border:'1px solid rgba(0,180,198,0.2)', borderRadius:12, marginBottom:'1.25rem', display:'flex', gap:10 }}>
        <Info size={15} color={TEAL} style={{ flexShrink:0, marginTop:1 }}/>
        <p style={{ margin:0, fontSize:'0.875rem', color:T2, lineHeight:1.7, fontFamily:UI }}>
          <strong>Always compare quotes</strong> from multiple providers before buying. Premiums for the same coverage can vary 30–50% between insurers. Use independent comparison tools rather than going directly to one carrier.
        </p>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
        {RESOURCES.map(cat => (
          <div key={cat.category}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'0.75rem' }}>
              <div style={{ width:10, height:10, borderRadius:3, background:cat.color }}/>
              <span style={{ fontFamily:DISP, fontWeight:700, color:NAVY, fontSize:'1rem' }}>{cat.category}</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.625rem' }}>
              {cat.providers.map(p => (
                <div key={p.name} style={{ background:SURF, border:`1px solid ${B1}`, borderRadius:12, padding:'0.875rem 1.125rem', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                    <span style={{ fontFamily:DISP, fontWeight:700, color:NAVY, fontSize:'0.9375rem' }}>{p.name}</span>
                    <span style={{ padding:'2px 9px', background:`${cat.color}15`, border:`1px solid ${cat.color}30`, borderRadius:100, fontSize:'0.6875rem', fontWeight:700, color:cat.color, fontFamily:UI }}>{p.badge}</span>
                  </div>
                  <p style={{ margin:0, fontSize:'0.875rem', color:T2, lineHeight:1.65, fontFamily:UI }}>{p.desc}</p>
                </div>
              ))}
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
const INSURANCE_TYPES = [
  { id:'life',       label:'Life',       icon: Heart    },
  { id:'health',     label:'Health',     icon: Activity },
  { id:'auto',       label:'Auto',       icon: Car      },
  { id:'home',       label:'Home',       icon: Home     },
  { id:'ltc',        label:'LTC',        icon: Clock    },
  { id:'disability', label:'Disability', icon: Shield   },
];

const MAIN_TABS = [
  { id:'learn',     label:'Learn',     icon: BookOpen    },
  { id:'calc',      label:'Calculate', icon: Calculator  },
  { id:'resources', label:'Resources', icon: ExternalLink },
];

export default function Insurance() {
  const navigate = useNavigate();
  const [tab,     setTab]     = useState('learn');
  const [insType, setInsType] = useState('life');

  const learnContent = {
    life:       <LifeInsuranceLearn/>,
    health:     <HealthInsuranceLearn/>,
    auto:       <AutoInsuranceLearn/>,
    home:       <HomeInsuranceLearn/>,
    ltc:        <LTCLearn/>,
    disability: <DisabilityLearn/>,
  };

  const learnTitles = {
    life:       { title:'Life Insurance', sub:'Term vs whole vs universal — most people only need term life.' },
    health:     { title:'Health Insurance', sub:'HMO, PPO, HDHP — choosing the right plan for your situation.' },
    auto:       { title:'Auto Insurance', sub:'Coverage types, what\'s required, and what\'s worth carrying.' },
    home:       { title:'Homeowners & Renters Insurance', sub:'What\'s covered, what\'s not, and how coverage amounts are calculated.' },
    ltc:        { title:'Long-Term Care Insurance', sub:'What it covers, what care costs, and the ideal window to buy.' },
    disability: { title:'Disability Insurance', sub:'The most overlooked coverage — protecting your income, your most valuable asset.' },
  };

  return (
    <div style={{ minHeight:'100vh', background:BG, fontFamily:UI }}>

      <div style={{ background:SURF, borderBottom:`1px solid `, padding:'2rem 2.5rem 0' }}>
        <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.35)', marginBottom:'1rem', display:'flex', alignItems:'center', gap:6 }}>
          <button onClick={() => navigate('/fun')} style={{ background:'none', border:'none', cursor:'pointer', color:TEAL, fontSize:'0.75rem', fontFamily:UI, padding:0 }}>Dashboard</button>
          <ChevronRight size={12} color="rgba(255,255,255,0.25)"/>
          <span style={{ fontFamily:UI }}>Insurance Planning</span>
        </div>
        <h1 style={{ fontFamily:DISP, fontSize:'2rem', fontWeight:700, color:'#fff', margin:'0 0 0.5rem', letterSpacing:'-0.025em', lineHeight:1.2 }}>
          Insurance Planning
        </h1>
        <p style={{ margin:'0 0 1.75rem', fontSize:'1rem', color:'rgba(255,255,255,0.55)', lineHeight:1.65, maxWidth:580, fontFamily:UI }}>
          Insurance is the foundation of any financial plan. The right coverage protects everything you've built — from your income to your home to your family's future.
        </p>
        <div style={{ display:'flex', gap:0, borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
          {MAIN_TABS.map(t => {
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
            {/* Insurance type sub-tabs */}
            <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'1.25rem' }}>
              {INSURANCE_TYPES.map(t => {
                const Icon = t.icon;
                const active = insType === t.id;
                return (
                  <button key={t.id} onClick={() => setInsType(t.id)} style={{
                    display:'flex', alignItems:'center', gap:6,
                    padding:'6px 14px', borderRadius:100,
                    border:`1.5px solid ${active?TEAL:'#e5e7eb'}`,
                    background: active?'rgba(0,180,198,0.1)':'#fff',
                    color: active?TEAL:'#6b7280',
                    fontSize:'0.8125rem', fontWeight:active?700:500,
                    cursor:'pointer', fontFamily:UI,
                    transition:'all 0.13s',
                  }}>
                    <Icon size={13}/>{t.label}
                  </button>
                );
              })}
            </div>

            <SectionCard
              title={learnTitles[insType].title}
              subtitle={learnTitles[insType].sub}
            >
              {learnContent[insType]}
            </SectionCard>
          </>
        )}

        {tab === 'calc' && (
          <>
            <SectionCard title="Life Insurance Needs — DIME Method" subtitle="Calculate how much life insurance coverage your family needs using the four key components.">
              <DIMECalc/>
            </SectionCard>
            <SectionCard title="Auto Insurance Deductible Break-Even" subtitle="Should you raise your deductible to lower your premium? See how long it takes to break even.">
              <AutoDeductibleCalc/>
            </SectionCard>
          </>
        )}

        {tab === 'resources' && <ResourcesTab/>}

        <div onClick={() => navigate('/fun/estate')} style={{ marginTop:'2rem', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 1.25rem', background:RAISE, borderRadius:12, cursor:'pointer', transition:'opacity 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.opacity='0.88'} onMouseLeave={e => e.currentTarget.style.opacity='1'}>
          <div>
            <div style={{ fontSize:'0.6875rem', color:'rgba(255,255,255,0.4)', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:3, fontFamily:UI }}>Next section</div>
            <div style={{ fontFamily:DISP, fontSize:'1rem', fontWeight:600, color:'#fff' }}>Estate Planning & Wills</div>
          </div>
          <ArrowRight size={18} color={TEAL}/>
        </div>

        <p style={{ marginTop:'2rem', fontSize:'0.6875rem', color:T3, textAlign:'center', lineHeight:1.6, fontFamily:UI }}>
          For educational purposes only — not insurance, financial, or legal advice. Consult a licensed professional.
        </p>
      </div>
    </div>
  );
}
