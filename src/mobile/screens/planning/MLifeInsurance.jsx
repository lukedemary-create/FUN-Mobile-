import { useState } from 'react'
import { CheckCircle2, XCircle, AlertTriangle, Info, AlertCircle, ExternalLink } from 'lucide-react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader, MResultRow } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'

const fmt = n => '$' + Math.round(Math.abs(n || 0)).toLocaleString()

function InfoBox({ children, color }) {
  const c = color || C.teal
  return (
    <div style={{ display:'flex', gap:8, padding:'10px 12px', background:`${c}12`, border:`1px solid ${c}28`, borderRadius:10, marginTop:10 }}>
      <Info size={13} color={c} style={{ flexShrink:0, marginTop:1 }} />
      <p style={{ margin:0, fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.7 }}>{children}</p>
    </div>
  )
}

function Accordion({ title, color, badge, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background:C.surf, border:`1px solid ${open ? color + '40' : C.b1}`, borderRadius:14, marginBottom:8, overflow:'hidden' }}>
      <button onClick={() => setOpen(v => !v)} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 14px', background:'none', border:'none', cursor:'pointer' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, flex:1, minWidth:0 }}>
          {badge && <span style={{ fontFamily:UI, fontSize:9, fontWeight:700, color, background:`${color}14`, border:`1px solid ${color}28`, borderRadius:20, padding:'2px 7px', letterSpacing:'0.08em', textTransform:'uppercase', flexShrink:0 }}>{badge}</span>}
          <span style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.t1 }}>{title}</span>
        </div>
        <span style={{ fontFamily:MONO, fontSize:14, color:C.t3, marginLeft:8 }}>{open ? '−' : '+'}</span>
      </button>
      {open && <div style={{ padding:'0 14px 14px', borderTop:`1px solid ${C.b1}` }}>{children}</div>}
    </div>
  )
}

/* ── Life Insurance Tab ─────────────────────────────────────── */
const POLICIES = [
  {
    key:'term', label:'Term Life', color:'#4c9fcf', badge:'TERM',
    summary:'Pure protection for a fixed period. Most affordable. Best for most people.',
    desc:'Term life provides a death benefit for a fixed period — 10, 15, 20, or 30 years. If you die during the term, beneficiaries receive the payout. If you outlive it, coverage ends.',
    pros:['Lowest cost for highest coverage','Simple to understand','Level premiums guaranteed','Ideal for income replacement','Covers dependents while kids are young'],
    cons:['No cash value accumulation','Coverage ends at term expiration','Premiums increase significantly upon renewal','Cannot borrow against policy'],
    example:'35-year-old non-smoker, Preferred health, $500K → ~$25–$35/month',
    best:'Most people. Income replacement, mortgage protection, family protection during working years.',
  },
  {
    key:'whole', label:'Whole Life', color:'#c9a84c', badge:'WHOLE LIFE',
    summary:'Permanent coverage with guaranteed cash value. 8–15× more expensive than term.',
    desc:'Whole life provides permanent coverage — it never expires. Premiums are split between insurance cost and a cash value account that grows at a guaranteed rate. Many policies pay annual dividends.',
    pros:['Permanent — never expires','Guaranteed cash value growth','Can borrow against cash value tax-free','Dividend-paying policies from top carriers','Estate planning tool for high net worth'],
    cons:['8–15× more expensive than term','Cash value growth is slow early on','Surrender charges if cancelled early','Complex dividend structure'],
    example:'35-year-old, $500K policy → ~$400–$600/month (vs $25 for term)',
    best:'High net worth individuals using it for estate planning or guaranteed cash accumulation.',
  },
  {
    key:'ul', label:'Universal Life', color:'#9b6cdb', badge:'UNIVERSAL',
    summary:'Flexible premiums and adjustable death benefit. Permanent coverage.',
    desc:'Universal life separates the insurance cost from the savings component, giving you flexibility to adjust premiums and death benefit over time. Cash value earns interest at a credited rate.',
    pros:['Flexible premium payments','Adjustable death benefit up or down','Cash value earns credited interest rate','Good for changing income situations'],
    cons:['Policy can lapse if underfunded — major risk','Interest credited rate can decrease','More complex than term or whole life','Requires monitoring to stay in force'],
    example:'Warning: millions of UL policies have lapsed on policyholders who didn\'t monitor them.',
    best:'Business owners or those with variable income who need flexible premiums.',
  },
  {
    key:'iul', label:'IUL', color:'#4caf7d', badge:'IUL',
    summary:'S&P 500 linked with 0% floor and ~10% cap. Tax-deferred cash value.',
    desc:'Indexed Universal Life links your cash value growth to a stock market index (like the S&P 500) with a floor (can\'t lose in down markets) and a cap (gains limited ~10–12%/year).',
    pros:['0% floor — never lose money in down markets','Upside participation in market gains','Tax-deferred cash value growth','Tax-free loans against cash value'],
    cons:['Caps limit upside (typically 10–12%)','High internal fees reduce returns','Very complex product','Aggressive sales practices in industry'],
    example:'In 2022 (S&P −18.1%), IUL credited 0%. In 2021 (S&P +28.7%), IUL credited the 10% cap.',
    best:'People who want market-linked growth with downside protection and are comfortable with complexity.',
  },
  {
    key:'var', label:'Variable Life', color:'#e07c3a', badge:'VARIABLE',
    summary:'Investment subaccounts. Highest risk/reward. Death benefit can decrease.',
    desc:'Variable life lets you invest cash value in stock/bond subaccounts (like mutual funds). Your death benefit and cash value fluctuate with market performance — you can lose money.',
    pros:['Highest potential cash value growth','Wide investment selection','Can outperform all other types in bull markets'],
    cons:['Death benefit can decrease with poor performance','Highest fees of all policy types','Requires active investment management'],
    example:'Not recommended for most people. Consider max-funding a 401k and Roth IRA first.',
    best:'Risk-tolerant investors who have maxed all tax-advantaged accounts and want additional tax-deferred growth.',
  },
]

const COMPARISON = [
  { attr:'Monthly Premium ($500K)', term:'~$25', whole:'~$400', universal:'~$150', iul:'~$200', variable:'~$175' },
  { attr:'Cash Value', term:'None', whole:'Guaranteed', universal:'Interest-based', iul:'Index-linked', variable:'Market-based' },
  { attr:'Complexity', term:'Low', whole:'Low', universal:'Medium', iul:'High', variable:'High' },
  { attr:'Risk Level', term:'None', whole:'None', universal:'Low-Med', iul:'Low (floor=0%)', variable:'High' },
  { attr:'Best For', term:'Most people', whole:'Estate planning', universal:'Flexible needs', iul:'Growth+protect', variable:'Risk-tolerant' },
]

const RIDERS = [
  { name:'Waiver of Premium', desc:'Premiums waived if you become totally disabled. Highly recommended.' },
  { name:'Accelerated Death Benefit', desc:'Access a portion of death benefit if terminally ill. Usually included free.' },
  { name:'Child Rider', desc:'Small death benefit coverage for dependent children. Inexpensive add-on.' },
  { name:'Return of Premium', desc:'Refunds all premiums if you outlive the term. Significantly higher premium.' },
  { name:'Guaranteed Insurability', desc:'Purchase additional coverage in the future without a new medical exam.' },
  { name:'Long-Term Care Rider', desc:'Access death benefit to pay for long-term care. Hybrid approach to LTC planning.' },
]

function LifeTab() {
  const [active, setActive] = useState('term')
  const policy = POLICIES.find(p => p.key === active)

  return (
    <div style={{ padding:'12px 16px 0' }}>
      {/* Policy selector */}
      <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:12 }}>
        {POLICIES.map(p => (
          <button key={p.key} onClick={() => setActive(p.key)} style={{
            padding:'5px 11px', borderRadius:20, border:`1.5px solid ${active === p.key ? p.color : C.b2}`,
            background: active === p.key ? p.color : 'transparent',
            fontFamily:UI, fontSize:10, fontWeight:active === p.key ? 700 : 500,
            color: active === p.key ? '#fff' : C.t3, cursor:'pointer',
          }}>{p.label}</button>
        ))}
      </div>

      {/* Policy detail */}
      <div style={{ background:C.surf, border:`1.5px solid ${policy.color}35`, borderRadius:16, padding:'14px', marginBottom:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
          <span style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:policy.color, background:`${policy.color}14`, border:`1px solid ${policy.color}28`, borderRadius:20, padding:'2px 7px', textTransform:'uppercase', letterSpacing:'0.08em' }}>{policy.badge}</span>
          <div style={{ fontFamily:DISPLAY, fontSize:16, fontWeight:700, color:C.t1 }}>{policy.label} Insurance</div>
        </div>
        <p style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.7, margin:'0 0 12px' }}>{policy.desc}</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
          <div>
            <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:C.up, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>Pros</div>
            {policy.pros.map(p => (
              <div key={p} style={{ display:'flex', gap:6, alignItems:'flex-start', marginBottom:5 }}>
                <CheckCircle2 size={11} color={C.up} style={{ flexShrink:0, marginTop:2 }} />
                <span style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.5 }}>{p}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:C.down, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>Cons</div>
            {policy.cons.map(c => (
              <div key={c} style={{ display:'flex', gap:6, alignItems:'flex-start', marginBottom:5 }}>
                <AlertTriangle size={11} color={C.down} style={{ flexShrink:0, marginTop:2 }} />
                <span style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.5 }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background:`${policy.color}10`, border:`1px solid ${policy.color}22`, borderRadius:8, padding:'8px 10px', marginBottom:6 }}>
          <div style={{ fontFamily:UI, fontSize:10, color:policy.color, fontWeight:700, marginBottom:2 }}>Real Example</div>
          <div style={{ fontFamily:UI, fontSize:11, color:C.t2 }}>{policy.example}</div>
        </div>
        <div style={{ fontFamily:UI, fontSize:11, color:C.t3 }}><strong style={{ color:C.t2 }}>Best for: </strong>{policy.best}</div>
      </div>

      {/* Comparison table */}
      <MSectionHeader label="Side-by-Side Comparison" />
      <div style={{ overflowX:'auto', marginBottom:12 }}>
        <table style={{ width:'100%', minWidth:480, borderCollapse:'collapse', fontFamily:UI }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${C.b2}`, background:C.raise }}>
              <th style={{ padding:'8px 10px', textAlign:'left', fontSize:10, fontWeight:700, color:C.t3, textTransform:'uppercase', letterSpacing:'0.07em' }}>Feature</th>
              {POLICIES.map(p => (
                <th key={p.key} style={{ padding:'8px 8px', textAlign:'left', fontSize:10, fontWeight:700, color:p.color, textTransform:'uppercase', letterSpacing:'0.06em' }}>{p.badge.split(' ')[0]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map((row, i) => (
              <tr key={row.attr} style={{ borderBottom:`1px solid ${C.b1}`, background: i % 2 === 0 ? C.raise : C.surf }}>
                <td style={{ padding:'8px 10px', fontWeight:600, color:C.t1, fontSize:11 }}>{row.attr}</td>
                <td style={{ padding:'8px 8px', color:'#4c9fcf', fontSize:10 }}>{row.term}</td>
                <td style={{ padding:'8px 8px', color:'#c9a84c', fontSize:10 }}>{row.whole}</td>
                <td style={{ padding:'8px 8px', color:'#9b6cdb', fontSize:10 }}>{row.universal}</td>
                <td style={{ padding:'8px 8px', color:'#4caf7d', fontSize:10 }}>{row.iul}</td>
                <td style={{ padding:'8px 8px', color:'#e07c3a', fontSize:10 }}>{row.variable}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <MSectionHeader label="Policy Riders" />
      <MCard style={{ padding:0, overflow:'hidden' }}>
        {RIDERS.map((r, i) => (
          <div key={r.name} style={{ padding:'11px 14px', borderBottom: i < RIDERS.length - 1 ? `1px solid ${C.b1}` : 'none' }}>
            <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.teal, marginBottom:3 }}>{r.name}</div>
            <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.6 }}>{r.desc}</div>
          </div>
        ))}
      </MCard>
      <div style={{ height:8 }} />
    </div>
  )
}

/* ── Health Insurance Tab ───────────────────────────────────── */
const HEALTH_PLANS = [
  { name:'HMO', color:'#00B4C6', best:'Lowest cost, OK with a primary care gatekeeper',
    pros:['Lowest premiums','Lowest out-of-pocket costs','Predictable copays'],
    cons:['Requires referrals to see specialists','Must stay in-network (except emergencies)','Less provider flexibility'] },
  { name:'PPO', color:'#3b82f6', best:'Flexibility to see any doctor without referrals',
    pros:['No referrals needed','In-network AND out-of-network coverage','Largest provider networks'],
    cons:['Higher premiums and deductibles','More complex billing','Out-of-network care is expensive'] },
  { name:'HDHP + HSA', color:'#818cf8', best:'Healthy, high earners who can invest the HSA',
    pros:['Lowest premiums of any plan','Unlocks HSA (triple tax advantage)','Great for healthy people with few claims'],
    cons:['High deductible — $1,600+ individual','You pay full cost until deductible is met','Not ideal if you use healthcare frequently'] },
]

const HEALTH_TERMS = [
  { term:'Deductible', color:C.down, def:'Amount you pay before insurance kicks in. Example: $1,500 deductible means you pay the first $1,500 each year.' },
  { term:'Premium', color:'#f59e0b', def:'Monthly payment to keep coverage active. Paid regardless of whether you use healthcare.' },
  { term:'Copay', color:C.teal, def:'Fixed amount per visit. Example: $25 copay for primary care, $50 for specialist.' },
  { term:'Coinsurance', color:'#3b82f6', def:'Your % share after meeting deductible. 20% coinsurance means you pay 20%, insurance pays 80%.' },
  { term:'Out-of-Pocket Max', color:C.up, def:'The most you\'ll pay in a year. After hitting this, insurance covers 100% of covered expenses.' },
]

function HealthTab() {
  return (
    <div style={{ padding:'12px 16px 0' }}>
      <MSectionHeader label="Plan Types: HMO vs PPO vs HDHP" />
      {HEALTH_PLANS.map(p => (
        <div key={p.name} style={{ background:C.surf, border:`1.5px solid ${p.color}28`, borderRadius:14, marginBottom:8, overflow:'hidden' }}>
          <div style={{ padding:'10px 14px', background:`${p.color}08`, borderBottom:`1px solid ${p.color}18` }}>
            <div style={{ fontFamily:DISPLAY, fontSize:15, fontWeight:700, color:C.t1, marginBottom:2 }}>{p.name}</div>
            <div style={{ fontFamily:UI, fontSize:11, color:C.t3 }}>{p.best}</div>
          </div>
          <div style={{ padding:'12px 14px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 10px' }}>
            <div>
              {p.pros.map(x => (
                <div key={x} style={{ display:'flex', gap:6, marginBottom:5 }}>
                  <CheckCircle2 size={11} color={C.up} style={{ flexShrink:0, marginTop:2 }} />
                  <span style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.5 }}>{x}</span>
                </div>
              ))}
            </div>
            <div>
              {p.cons.map(x => (
                <div key={x} style={{ display:'flex', gap:6, marginBottom:5 }}>
                  <XCircle size={11} color={C.down} style={{ flexShrink:0, marginTop:2 }} />
                  <span style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.5 }}>{x}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      <InfoBox color={'#818cf8'}>If you choose an HDHP, open and max your HSA immediately. Contributions are pre-tax, grow tax-free, and withdraw tax-free for medical expenses — the only triple tax-advantaged account in the US.</InfoBox>

      <MSectionHeader label="Key Terms — Know Before You Choose" />
      <MCard style={{ padding:0, overflow:'hidden' }}>
        {HEALTH_TERMS.map((t, i) => (
          <div key={t.term} style={{ display:'flex', gap:10, padding:'11px 14px', borderBottom: i < HEALTH_TERMS.length - 1 ? `1px solid ${C.b1}` : 'none', alignItems:'flex-start' }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:t.color, flexShrink:0, marginTop:4 }} />
            <div>
              <span style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.t1 }}>{t.term}: </span>
              <span style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.6 }}>{t.def}</span>
            </div>
          </div>
        ))}
      </MCard>

      <MSectionHeader label="HSA: The Triple Tax Advantage" />
      <MCard>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
          {[['2026 Individual Limit','$4,300'],['2026 Family Limit','$8,550'],['Catch-up (55+)','$1,000 extra'],['Invests & grows','Tax-free']].map(([l,v]) => (
            <div key={l} style={{ background:C.raise, borderRadius:8, padding:'8px 10px' }}>
              <div style={{ fontFamily:UI, fontSize:9, color:C.t3, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:2 }}>{l}</div>
              <div style={{ fontFamily:MONO, fontSize:14, fontWeight:700, color:'#818cf8' }}>{v}</div>
            </div>
          ))}
        </div>
        {['Contributions are pre-tax (or tax-deductible)','Grows tax-free with investments','Withdrawals tax-free for medical expenses','After 65, use for ANY purpose (taxed like Traditional IRA, no penalty)','Rolls over year to year — no use-it-or-lose-it'].map(pt => (
          <div key={pt} style={{ display:'flex', gap:7, alignItems:'flex-start', marginBottom:6 }}>
            <CheckCircle2 size={11} color={'#818cf8'} style={{ flexShrink:0, marginTop:2 }} />
            <span style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.5 }}>{pt}</span>
          </div>
        ))}
      </MCard>
      <div style={{ height:8 }} />
    </div>
  )
}

/* ── Auto & Home Tab ────────────────────────────────────────── */
const AUTO_COVERAGES = [
  { name:'Liability', color:C.teal, required:'Required in most states',
    desc:'Pays for damage you cause to others — their car, property, and medical bills. State minimums are dangerously low. Carry at least $100K/$300K.',
    tip:'State minimums like 25/50/25 barely protect you. A serious accident can exceed limits and put all your assets at risk.' },
  { name:'Collision', color:'#3b82f6', required:'Optional (required with loan/lease)',
    desc:'Pays to repair/replace YOUR car after a collision, regardless of fault. Required by lenders if you have a car loan.',
    tip:'If your car\'s value is less than 10× your annual collision premium, dropping it may make financial sense.' },
  { name:'Comprehensive', color:'#818cf8', required:'Optional (required with loan/lease)',
    desc:'Covers non-collision damage: theft, vandalism, weather, fire, flood, hitting an animal. Often just $100–200/year.',
    tip:'Comprehensive is typically very inexpensive. Usually worth keeping even on older cars.' },
  { name:'Uninsured Motorist (UM/UIM)', color:'#f59e0b', required:'Required in ~20 states',
    desc:'Protects you if hit by an uninsured or underinsured driver. About 13% of US drivers have no insurance.',
    tip:'Always carry UM/UIM at least equal to your liability limits. It\'s very cheap to add.' },
  { name:'PIP / Medical Payments', color:C.down, required:'Required in no-fault states',
    desc:'Covers your medical expenses after an accident regardless of fault. Required in FL, NY, NJ, MI and other no-fault states.',
    tip:'In no-fault states, PIP is mandatory. Elsewhere, medical payments coverage provides similar but limited protection.' },
]

const HOME_COVERED = [
  'Damage from fire and smoke','Theft and vandalism','Wind and hail damage',
  'Water damage from burst pipes','Lightning strikes','Falling objects',
  'Liability if someone is injured on your property','Additional living expenses if home is uninhabitable',
]
const HOME_NOT_COVERED = [
  'Flooding (requires separate NFIP or private flood policy)','Earthquakes (separate policy)',
  'Gradual wear and tear','Pest/termite damage','Sewer backup (often available as rider)',
  'High-value jewelry/art beyond standard limits',
]

function AutoHomeTab() {
  return (
    <div style={{ padding:'12px 16px 0' }}>
      <MSectionHeader label="Auto Insurance Coverage Types" />
      {AUTO_COVERAGES.map(c => (
        <Accordion key={c.name} title={c.name} color={c.color} badge={c.required}>
          <div style={{ marginTop:10 }}>
            <p style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.7, margin:'0 0 8px' }}>{c.desc}</p>
            <div style={{ display:'flex', gap:7, padding:'8px 10px', background:`${c.color}10`, border:`1px solid ${c.color}25`, borderRadius:8 }}>
              <Info size={12} color={c.color} style={{ flexShrink:0, marginTop:2 }} />
              <span style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.6 }}>{c.tip}</span>
            </div>
          </div>
        </Accordion>
      ))}
      <InfoBox>Review your auto policy limits annually. Many people are dramatically underinsured — they chose state minimums years ago and never updated.</InfoBox>

      <MSectionHeader label="Home & Renters Insurance" />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
        <div style={{ background:C.surf, border:'1.5px solid rgba(74,124,89,0.25)', borderRadius:14, overflow:'hidden' }}>
          <div style={{ padding:'10px 12px', background:'rgba(74,124,89,0.08)', borderBottom:'1px solid rgba(74,124,89,0.15)' }}>
            <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.up }}>Typically Covered</div>
          </div>
          <div style={{ padding:'10px 12px' }}>
            {HOME_COVERED.map(x => (
              <div key={x} style={{ display:'flex', gap:5, marginBottom:5 }}>
                <CheckCircle2 size={10} color={C.up} style={{ flexShrink:0, marginTop:2 }} />
                <span style={{ fontFamily:UI, fontSize:10, color:C.t2, lineHeight:1.5 }}>{x}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background:C.surf, border:'1.5px solid rgba(192,57,43,0.22)', borderRadius:14, overflow:'hidden' }}>
          <div style={{ padding:'10px 12px', background:'rgba(192,57,43,0.06)', borderBottom:'1px solid rgba(192,57,43,0.15)' }}>
            <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.down }}>Not Covered</div>
          </div>
          <div style={{ padding:'10px 12px' }}>
            {HOME_NOT_COVERED.map(x => (
              <div key={x} style={{ display:'flex', gap:5, marginBottom:5 }}>
                <XCircle size={10} color={C.down} style={{ flexShrink:0, marginTop:2 }} />
                <span style={{ fontFamily:UI, fontSize:10, color:C.t2, lineHeight:1.5 }}>{x}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MCard>
        <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.t1, marginBottom:10 }}>Replacement Cost vs Actual Cash Value (ACV)</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          {[
            { type:'Replacement Cost', color:C.up, desc:'Pays what it costs to rebuild at TODAY\'s prices. A 10-year-old roof gets a new roof. Always choose this.', ex:'Roof today: $15K → Insurer pays: $15K' },
            { type:'Actual Cash Value', color:'#f59e0b', desc:'Pays replacement cost MINUS depreciation. You may get far less than needed to replace.', ex:'Roof today: $15K − $8K depreciation → Insurer pays: $7K' },
          ].map(t => (
            <div key={t.type} style={{ background:`${t.color}08`, border:`1px solid ${t.color}22`, borderRadius:10, padding:'10px 12px' }}>
              <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:t.color, marginBottom:4 }}>{t.type}</div>
              <div style={{ fontFamily:UI, fontSize:10, color:C.t2, lineHeight:1.6, marginBottom:6 }}>{t.desc}</div>
              <div style={{ fontFamily:UI, fontSize:10, color:C.t3, background:C.raise, borderRadius:6, padding:'5px 8px' }}>{t.ex}</div>
            </div>
          ))}
        </div>
        <InfoBox>Renters insurance is $15–30/month and covers your personal property AND liability. If you rent and don't have it, get it today.</InfoBox>
      </MCard>
      <div style={{ height:8 }} />
    </div>
  )
}

/* ── Disability & LTC Tab ───────────────────────────────────── */
const LTC_COSTS = [
  { type:'Adult Day Care',          daily:'$95',  annual:'$24,000–$30,000' },
  { type:'Home Health Aide',        daily:'$175', annual:'$54,000–$62,000' },
  { type:'Assisted Living',         daily:'$165', annual:'$54,000–$66,000' },
  { type:'Nursing Home (Semi)',     daily:'$295', annual:'$96,000–$114,000' },
  { type:'Nursing Home (Private)',  daily:'$335', annual:'$114,000–$132,000' },
]

const LTC_TIMING = [
  { age:'Under 50', rec:'Too early', color:C.t3, note:'Premiums are low but you\'ll pay them for decades.' },
  { age:'50–55', rec:'Sweet spot', color:C.up, note:'Best balance of affordable premiums and insurability.' },
  { age:'55–65', rec:'Optimal window', color:C.teal, note:'Still insurable. Act before health issues arise.' },
  { age:'65–70', rec:'Possible, expensive', color:'#f59e0b', note:'High premiums. Hybrid life/LTC policies may be better.' },
  { age:'Over 70', rec:'Very difficult', color:C.down, note:'Most traditional LTC policies unavailable. Self-insure or Medicaid planning.' },
]

function DisabilityLTCTab() {
  return (
    <div style={{ padding:'12px 16px 0' }}>
      <MSectionHeader label="Disability Insurance" />
      <div style={{ background:C.raise, border:`1px solid ${C.b2}`, borderRadius:12, padding:'12px 14px', marginBottom:10 }}>
        <div style={{ fontFamily:UI, fontSize:13, color:C.t2, lineHeight:1.7 }}>
          A 35-year-old has a <strong style={{ color:C.t1 }}>1 in 4 chance</strong> of becoming disabled before retirement. Yet most people insure their car and phone while leaving their income — their most valuable asset — unprotected.
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
        {[
          { type:'Short-Term (STD)', color:C.teal, duration:'3–6 months', wait:'0–14 days', covers:'60–70% of income',
            points:['Often provided by employers free','Covers maternity, surgeries, temp illness','Not portable if you leave job'] },
          { type:'Long-Term (LTD)', color:'#818cf8', duration:'2 years to age 65+', wait:'90–180 days',covers:'50–70% of income',
            points:['Most critical coverage','Own-occupation definition is key','Individual policies are portable','Critical for high earners'] },
        ].map(t => (
          <div key={t.type} style={{ background:C.surf, border:`1.5px solid ${t.color}28`, borderRadius:14, overflow:'hidden' }}>
            <div style={{ padding:'10px 12px', background:`${t.color}08`, borderBottom:`1px solid ${t.color}18` }}>
              <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:t.color, marginBottom:4 }}>{t.type}</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                {[['Duration', t.duration],['Wait', t.wait],['Covers', t.covers]].map(([l,v]) => (
                  <div key={l}>
                    <div style={{ fontFamily:UI, fontSize:9, color:C.t3, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:1 }}>{l}</div>
                    <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:C.t1 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding:'10px 12px' }}>
              {t.points.map(pt => (
                <div key={pt} style={{ display:'flex', gap:5, marginBottom:5 }}>
                  <CheckCircle2 size={10} color={t.color} style={{ flexShrink:0, marginTop:2 }} />
                  <span style={{ fontFamily:UI, fontSize:10, color:C.t2, lineHeight:1.5 }}>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <InfoBox color={'#818cf8'}>Own-Occupation LTD pays if you can't do YOUR specific job (e.g., a surgeon who can't operate). Any-Occupation only pays if you can't do ANY job. Own-Occ is dramatically better — and worth the higher premium.</InfoBox>

      <MSectionHeader label="Long-Term Care Insurance" />
      <div style={{ background:C.raise, border:`1px solid ${C.b2}`, borderRadius:12, padding:'12px 14px', marginBottom:12 }}>
        <div style={{ fontFamily:UI, fontSize:13, color:C.t2, lineHeight:1.7 }}>
          About <strong style={{ color:C.t1 }}>70% of people over 65</strong> will need some form of long-term care. Medicare covers very little. Medicaid requires spending down nearly all assets first.
        </div>
      </div>

      <MSectionHeader label="National Average LTC Costs (2024)" />
      <MCard style={{ padding:0, overflow:'hidden' }}>
        {LTC_COSTS.map((r, i) => (
          <div key={r.type} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', borderBottom: i < LTC_COSTS.length - 1 ? `1px solid ${C.b1}` : 'none' }}>
            <div>
              <div style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:C.t1 }}>{r.type}</div>
              <div style={{ fontFamily:UI, fontSize:10, color:C.t3 }}>Daily: {r.daily}</div>
            </div>
            <div style={{ fontFamily:MONO, fontSize:12, fontWeight:700, color:C.down, textAlign:'right', flexShrink:0 }}>{r.annual}/yr</div>
          </div>
        ))}
      </MCard>

      <MSectionHeader label="When to Buy LTC Insurance" />
      {LTC_TIMING.map((s, i) => (
        <div key={s.age} style={{ display:'flex', gap:10, alignItems:'center', padding:'10px 14px', background:C.surf, border:`1px solid ${C.b1}`, borderRadius:10, marginBottom:6 }}>
          <div style={{ width:60, flexShrink:0 }}>
            <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.t1 }}>{s.age}</div>
          </div>
          <div style={{ flex:1 }}>
            <span style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:s.color, background:`${s.color}14`, border:`1px solid ${s.color}28`, borderRadius:20, padding:'2px 7px', textTransform:'uppercase', letterSpacing:'0.07em', display:'inline-block', marginBottom:3 }}>{s.rec}</span>
            <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.55 }}>{s.note}</div>
          </div>
        </div>
      ))}
      <div style={{ height:8 }} />
    </div>
  )
}

/* ── Calculator Tab ─────────────────────────────────────────── */
function CalcTab() {
  const [income, setIncome] = useState(120000)
  const [debts, setDebts] = useState(350000)
  const [years, setYears] = useState(20)
  const [existing, setExisting] = useState(0)

  const dimeMethod = income * 10 + debts
  const incomeMethod = income * years
  const humanLife = income * 25
  const recommended = Math.max(dimeMethod, incomeMethod) - existing

  return (
    <div style={{ padding:'12px 16px 0' }}>
      <MCard>
        <div style={{ fontFamily:UI, fontSize:12, color:C.t2, marginBottom:14, lineHeight:1.65 }}>
          How much life insurance coverage do you actually need?
        </div>
        {[
          { l:'Annual Income', v:income, set:setIncome, max:500000, step:5000, disp:fmt(income) },
          { l:'Total Debts & Mortgage', v:debts, set:setDebts, max:2000000, step:10000, disp:fmt(debts) },
          { l:'Years to Cover', v:years, set:setYears, max:40, step:1, disp:`${years} years` },
          { l:'Existing Coverage', v:existing, set:setExisting, max:2000000, step:10000, disp:fmt(existing) },
        ].map(({ l, v, set:sv, max, step, disp }) => (
          <div key={l} style={{ marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
              <span style={{ fontFamily:UI, fontSize:12, color:C.t2, fontWeight:600 }}>{l}</span>
              <span style={{ fontFamily:MONO, fontSize:13, color:C.teal, fontWeight:700 }}>{disp}</span>
            </div>
            <input type="range" min={0} max={max} step={step} value={v} onChange={e => sv(+e.target.value)} style={{ width:'100%', accentColor:C.teal }} />
          </div>
        ))}
      </MCard>

      <MCard>
        <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:10 }}>Coverage Estimates</div>
        <MResultRow label="DIME Method (10× income + debts)" value={fmt(dimeMethod)} mono />
        <MResultRow label="Income Replacement Method" value={fmt(incomeMethod)} mono />
        <MResultRow label="Human Life Value (25× income)" value={fmt(humanLife)} mono />
        <MResultRow label="Recommended Coverage (after existing)" value={fmt(recommended)} highlight accent={C.teal} mono />
      </MCard>

      <MCard>
        <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.t1, marginBottom:8 }}>Estimated Monthly Premium — $500K, 20-Year Term</div>
        {[
          { age:'25–30', rate:'$14–$22', color:C.up },
          { age:'31–35', rate:'$22–$35', color:C.up },
          { age:'36–40', rate:'$35–$55', color:C.teal },
          { age:'41–45', rate:'$55–$90', color:'#f59e0b' },
          { age:'46–50', rate:'$90–$150', color:'#f59e0b' },
          { age:'51–55', rate:'$150–$260', color:C.down },
        ].map((r, i) => (
          <div key={r.age} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom: i < 5 ? `1px solid ${C.b1}` : 'none' }}>
            <span style={{ fontFamily:UI, fontSize:12, color:C.t2 }}>Age {r.age}</span>
            <span style={{ fontFamily:MONO, fontSize:13, fontWeight:700, color:r.color }}>{r.rate}/mo</span>
          </div>
        ))}
        <InfoBox>Rates are for non-smoker, Preferred health class. Smokers pay 2–3× more. Get quotes from multiple insurers — pricing varies significantly.</InfoBox>
      </MCard>
      <div style={{ height:8 }} />
    </div>
  )
}

/* ── Root ─────────────────────────────────────────────────────── */
const TABS = [
  { key:'life',     label:'Life' },
  { key:'health',   label:'Health' },
  { key:'auto',     label:'Auto & Home' },
  { key:'dis',      label:'Disability & LTC' },
  { key:'calc',     label:'Calculator' },
]

export default function MLifeInsurance() {
  const [tab, setTab] = useState('life')

  return (
    <div style={{ background:C.bg, minHeight:'100dvh', paddingBottom:88 }}>
      <ScreenHeader title="Insurance Planning" subtitle="Planning" accent={C.teal} />

      {/* Tab bar */}
      <div style={{ display:'flex', borderBottom:`1px solid ${C.b2}`, background:C.bg, overflowX:'auto', scrollbarWidth:'none' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flexShrink:0, padding:'11px 14px', background:'none', border:'none', cursor:'pointer',
            borderBottom:`2px solid ${tab === t.key ? C.teal : 'transparent'}`,
            fontFamily:UI, fontSize:12, fontWeight:600,
            color: tab === t.key ? C.teal : C.t3,
          }}>{t.label}</button>
        ))}
      </div>

      {tab === 'life'   && <LifeTab />}
      {tab === 'health' && <HealthTab />}
      {tab === 'auto'   && <AutoHomeTab />}
      {tab === 'dis'    && <DisabilityLTCTab />}
      {tab === 'calc'   && <CalcTab />}
    </div>
  )
}
