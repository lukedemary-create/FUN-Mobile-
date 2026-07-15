import { useState } from 'react'
import {
  CheckCircle2, XCircle, AlertCircle, Info, ChevronDown, ChevronUp,
  Shield, Heart, Car, Home, Clock, Activity, ArrowRight, ExternalLink,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid, ReferenceLine, Legend,
} from 'recharts'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'

const fmt = n => '$' + Math.round(n || 0).toLocaleString()

function InfoBox({ children, color = C.teal, icon: Icon = Info }) {
  return (
    <div style={{ display:'flex', gap:8, padding:'10px 12px', background:`${color}12`, border:`1px solid ${color}28`, borderRadius:10, marginTop:10 }}>
      <Icon size={13} color={color} style={{ flexShrink:0, marginTop:1 }} />
      <p style={{ margin:0, fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.7 }}>{children}</p>
    </div>
  )
}

function PillTabs({ tabs, active, onSelect }) {
  return (
    <div style={{ display:'flex', gap:6, padding:'10px 16px', overflowX:'auto', scrollbarWidth:'none' }}>
      {tabs.map(([k, l]) => (
        <button key={k} onClick={() => onSelect(k)} style={{
          flexShrink:0, padding:'6px 14px', borderRadius:20,
          border:`1px solid ${active===k ? C.gold : C.b2}`,
          background: active===k ? `rgba(201,169,110,0.14)` : C.surf,
          fontFamily:UI, fontSize:12, fontWeight:600,
          color: active===k ? C.gold : C.t3, cursor:'pointer',
        }}>{l}</button>
      ))}
    </div>
  )
}

function ExpandCard({ title, badge, badgeColor, summary, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background:C.surf, border:`1.5px solid ${badgeColor}28`, borderRadius:14, overflow:'hidden', marginBottom:8 }}>
      <div style={{ height:2, background:`linear-gradient(90deg, ${badgeColor} 0%, transparent 80%)` }} />
      <button onClick={() => setOpen(v => !v)} style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 14px', background:'none', border:'none', cursor:'pointer', textAlign:'left' }}>
        <div style={{ flex:1, marginRight:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:3, flexWrap:'wrap' }}>
            <span style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:badgeColor, background:`${badgeColor}18`, border:`1px solid ${badgeColor}30`, borderRadius:20, padding:'1px 7px', textTransform:'uppercase', letterSpacing:'0.07em' }}>{badge}</span>
            <span style={{ fontFamily:DISPLAY, fontSize:14, fontWeight:700, color: open ? C.t1 : C.t2 }}>{title}</span>
          </div>
          <span style={{ fontFamily:UI, fontSize:11, color:C.t3 }}>{summary}</span>
        </div>
        {open ? <ChevronUp size={13} color={badgeColor} style={{ flexShrink:0 }} /> : <ChevronDown size={13} color={C.t3} style={{ flexShrink:0 }} />}
      </button>
      {open && <div style={{ padding:'0 14px 14px', borderTop:`1px solid ${C.b1}` }}>{children}</div>}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   LEARN — Life Insurance
════════════════════════════════════════════════════════════════ */
const PBLUE   = '#4c9fcf'
const PGOLD   = '#c9a84c'
const PGREEN  = '#4caf7d'
const PPURPLE = '#9b6cdb'
const PORANGE = '#e07c3a'

function estimatePremium(coverage, age, policy = 'term') {
  const base = coverage / 1000
  const ageMult = age < 30 ? 0.5 : age < 35 ? 0.7 : age < 40 ? 1.0 : age < 45 ? 1.5 : age < 50 ? 2.2 : age < 55 ? 3.2 : 4.5
  const typeMult = { term:1.0, whole:8.0 }
  return Math.max(10, Math.round(base * 0.06 * ageMult * (typeMult[policy] || 1.0)))
}

function LearnLifeInsurance() {
  const AGE_DATA = [25, 30, 35, 40, 45, 50, 55].map(age => ({
    age, term: estimatePremium(500000, age, 'term'), whole: estimatePremium(500000, age, 'whole'),
  }))

  const IUL_DATA = [
    { year:'18', sp:26.5, iul:10 }, { year:'19', sp:31.5, iul:10 },
    { year:'20', sp:18.4, iul:10 }, { year:'21', sp:28.7, iul:10 },
    { year:'22', sp:-18.1, iul:0  }, { year:'23', sp:26.3, iul:10 },
  ]

  return (
    <>
      <MSectionHeader label="Life Insurance Types" />
      <div style={{ padding:'0 16px' }}>

        <ExpandCard title="Term Life Insurance" badge="TERM" badgeColor={PBLUE} summary="Pure protection · Most affordable · Best for most people">
          <p style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65, margin:'10px 0 10px' }}>Coverage for a fixed period (10–30 years). If you die during the term, beneficiaries receive the payout. Lowest cost for highest coverage.</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
            <div>
              <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.up, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>Pros</div>
              {['Lowest cost for maximum coverage','Simple — easy to understand','Level premiums guaranteed','Ideal for income replacement'].map((p,i) => (
                <div key={i} style={{ display:'flex', gap:5, marginBottom:4 }}><CheckCircle2 size={11} color={C.up} style={{ flexShrink:0, marginTop:1 }} /><span style={{ fontFamily:UI, fontSize:10, color:C.t2 }}>{p}</span></div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.down, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>Cons</div>
              {['No cash value accumulation','Coverage ends at expiration','Premiums spike upon renewal','Can\'t borrow against policy'].map((c,i) => (
                <div key={i} style={{ display:'flex', gap:5, marginBottom:4 }}><XCircle size={11} color={C.down} style={{ flexShrink:0, marginTop:1 }} /><span style={{ fontFamily:UI, fontSize:10, color:C.t2 }}>{c}</span></div>
              ))}
            </div>
          </div>
          <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>Premium by Age — $500K 20-Year Term</div>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={AGE_DATA} margin={{ top:4, right:4, bottom:0, left:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.b1} />
              <XAxis dataKey="age" tick={{ fontFamily:MONO, fontSize:9, fill:C.t3 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily:MONO, fontSize:9, fill:C.t3 }} axisLine={false} tickLine={false} tickFormatter={v => '$'+v} width={32} />
              <Tooltip contentStyle={{ background:C.raise, border:`1px solid ${C.b2}`, borderRadius:8, fontFamily:UI, fontSize:11 }} />
              <Line type="monotone" dataKey="term" name="Term/mo" stroke={PBLUE} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ background:`rgba(76,159,207,0.12)`, border:`1px solid rgba(76,159,207,0.25)`, borderRadius:8, padding:'8px 10px', marginTop:8 }}>
            <span style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:PBLUE }}>Real Example: </span>
            <span style={{ fontFamily:UI, fontSize:10, color:C.t2 }}>35-yr non-smoker, Preferred health, $500K ≈ <strong style={{ color:PGREEN }}>$25–$35/month</strong></span>
          </div>
        </ExpandCard>

        <ExpandCard title="Whole Life Insurance" badge="WHOLE LIFE" badgeColor={PGOLD} summary="Permanent · Cash value · Guaranteed · Higher cost">
          <p style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65, margin:'10px 0 10px' }}>Permanent coverage that never expires. Premium split between insurance cost and a cash value account growing at a guaranteed rate. Many policies pay annual dividends.</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
            <div>
              <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.up, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>Pros</div>
              {['Permanent — never expires','Guaranteed cash value growth','Borrow against value tax-free','Dividend-paying (major carriers)'].map((p,i) => (
                <div key={i} style={{ display:'flex', gap:5, marginBottom:4 }}><CheckCircle2 size={11} color={C.up} style={{ flexShrink:0, marginTop:1 }} /><span style={{ fontFamily:UI, fontSize:10, color:C.t2 }}>{p}</span></div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.down, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>Cons</div>
              {['8–15× more expensive than term','Cash value grows slowly at first','Surrender charges if cancelled early','Complex dividend structure'].map((c,i) => (
                <div key={i} style={{ display:'flex', gap:5, marginBottom:4 }}><XCircle size={11} color={C.down} style={{ flexShrink:0, marginTop:1 }} /><span style={{ fontFamily:UI, fontSize:10, color:C.t2 }}>{c}</span></div>
              ))}
            </div>
          </div>
          <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>Term vs Whole — Monthly Premium ($500K)</div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={AGE_DATA.slice(1, 5)} margin={{ top:4, right:4, bottom:0, left:0 }}>
              <XAxis dataKey="age" tick={{ fontFamily:MONO, fontSize:9, fill:C.t3 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily:MONO, fontSize:9, fill:C.t3 }} axisLine={false} tickLine={false} tickFormatter={v => '$'+v} width={32} />
              <Tooltip contentStyle={{ background:C.raise, border:`1px solid ${C.b2}`, borderRadius:8, fontFamily:UI, fontSize:11 }} />
              <Bar dataKey="term" name="Term" fill={PBLUE} radius={[3,3,0,0]} />
              <Bar dataKey="whole" name="Whole" fill={PGOLD} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ExpandCard>

        <ExpandCard title="Universal Life (UL)" badge="UNIVERSAL" badgeColor={PPURPLE} summary="Permanent · Flexible premiums · Adjustable death benefit">
          <p style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65, margin:'10px 0 10px' }}>Separates the insurance cost from the savings component, giving you flexibility to adjust premiums and death benefit over time. Cash value earns interest at a credited rate.</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
            <div>
              {['Flexible premium payments','Adjustable death benefit','Good for changing income situations'].map((p,i) => (
                <div key={i} style={{ display:'flex', gap:5, marginBottom:5 }}><CheckCircle2 size={11} color={C.up} style={{ flexShrink:0, marginTop:1 }} /><span style={{ fontFamily:UI, fontSize:10, color:C.t2 }}>{p}</span></div>
              ))}
            </div>
            <div>
              {['Policy can lapse if underfunded','Credited rate can decrease','Requires active monitoring'].map((c,i) => (
                <div key={i} style={{ display:'flex', gap:5, marginBottom:5 }}><XCircle size={11} color={C.down} style={{ flexShrink:0, marginTop:1 }} /><span style={{ fontFamily:UI, fontSize:10, color:C.t2 }}>{c}</span></div>
              ))}
            </div>
          </div>
          <div style={{ background:`rgba(224,124,58,0.1)`, border:`1px solid rgba(224,124,58,0.25)`, borderRadius:8, padding:'8px 10px' }}>
            <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:PORANGE, marginBottom:2 }}>Warning</div>
            <p style={{ fontFamily:UI, fontSize:11, color:C.t2, margin:0, lineHeight:1.6 }}>UL policies have lapsed on millions who underpaid premiums. Always run an in-force illustration before reducing payments.</p>
          </div>
        </ExpandCard>

        <ExpandCard title="Indexed Universal Life (IUL)" badge="IUL" badgeColor={PGREEN} summary="Permanent · S&P 500 linked · Floor 0% · Cap ~10–12%">
          <p style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65, margin:'10px 0 10px' }}>Links cash value growth to a stock index (typically S&P 500) with a floor (can't lose money in down markets) and a cap (gains limited to ~10–12%/year).</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
            <div>
              {['0% floor in down markets','Tax-deferred growth','Tax-free loans against cash value'].map((p,i) => (
                <div key={i} style={{ display:'flex', gap:5, marginBottom:5 }}><CheckCircle2 size={11} color={C.up} style={{ flexShrink:0, marginTop:1 }} /><span style={{ fontFamily:UI, fontSize:10, color:C.t2 }}>{p}</span></div>
              ))}
            </div>
            <div>
              {['Caps limit upside (~10–12%)','High internal fees','Very complex product'].map((c,i) => (
                <div key={i} style={{ display:'flex', gap:5, marginBottom:5 }}><XCircle size={11} color={C.down} style={{ flexShrink:0, marginTop:1 }} /><span style={{ fontFamily:UI, fontSize:10, color:C.t2 }}>{c}</span></div>
              ))}
            </div>
          </div>
          <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>S&P 500 vs IUL Credit (Floor 0% / Cap 10%)</div>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={IUL_DATA} margin={{ top:4, right:4, bottom:0, left:0 }}>
              <XAxis dataKey="year" tick={{ fontFamily:MONO, fontSize:9, fill:C.t3 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily:MONO, fontSize:9, fill:C.t3 }} axisLine={false} tickLine={false} tickFormatter={v => v+'%'} width={32} />
              <Tooltip contentStyle={{ background:C.raise, border:`1px solid ${C.b2}`, borderRadius:8, fontFamily:UI, fontSize:11 }} />
              <ReferenceLine y={0} stroke={C.t3} strokeDasharray="3 3" />
              <Bar dataKey="sp" name="S&P 500" fill={PBLUE} opacity={0.5} radius={[2,2,0,0]} />
              <Bar dataKey="iul" name="IUL Credit" fill={PGREEN} radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ExpandCard>

        {/* Comparison table */}
        <MCard style={{ marginBottom:0 }}>
          <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.t1, marginBottom:10 }}>Quick Comparison</div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', minWidth:320, borderCollapse:'collapse', fontFamily:UI, fontSize:10 }}>
              <thead>
                <tr style={{ background:C.raise }}>
                  {[['Feature',C.t3],['Term',PBLUE],['Whole',PGOLD],['UL',PPURPLE],['IUL',PGREEN]].map(([h,c]) => (
                    <th key={h} style={{ padding:'6px 8px', textAlign:'left', fontWeight:700, color:c, letterSpacing:'0.04em', textTransform:'uppercase', fontSize:9 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Monthly Cost','~$25','~$400','~$150','~$200'],
                  ['Cash Value','None','Guaranteed','Interest','Index-linked'],
                  ['Flexibility','Low','Low','High','Medium'],
                  ['Complexity','Low','Low','Medium','High'],
                  ['Best For','Most people','Estate plan','Flex needs','Growth+protect'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom:`1px solid ${C.b1}`, background: i%2===0 ? C.raise : 'transparent' }}>
                    <td style={{ padding:'6px 8px', color:C.t2, fontWeight:600 }}>{row[0]}</td>
                    <td style={{ padding:'6px 8px', color:PBLUE }}>{row[1]}</td>
                    <td style={{ padding:'6px 8px', color:PGOLD }}>{row[2]}</td>
                    <td style={{ padding:'6px 8px', color:PPURPLE }}>{row[3]}</td>
                    <td style={{ padding:'6px 8px', color:PGREEN }}>{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MCard>
      </div>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════
   LEARN — Health Insurance
════════════════════════════════════════════════════════════════ */
function LearnHealth() {
  const PLANS = [
    { name:'HMO', color:C.teal, best:'Lowest cost; OK with a PCP gatekeeper', pros:['Lowest premiums','Predictable copays','Lowest OOP costs'], cons:['Requires referrals for specialists','Must stay in-network','Less provider flexibility'] },
    { name:'PPO', color:'#3b82f6', best:'Flexibility — see any doctor, no referrals', pros:['No referrals needed','In-network + out-of-network coverage','Largest networks'], cons:['Higher premiums','More complex billing','Out-of-network very expensive'] },
    { name:'HDHP + HSA', color:'#8b5cf6', best:'Healthy high earners who can invest the HSA', pros:['Lowest premiums','Unlocks HSA (triple tax advantage)','Great if you rarely use healthcare'], cons:['High deductible ($1,600+)','You pay full cost until deductible','Not ideal for frequent healthcare users'] },
  ]

  return (
    <>
      <MSectionHeader label="Plan Types" />
      <div style={{ padding:'0 16px' }}>
        {PLANS.map(({ name, color, best, pros, cons }) => (
          <div key={name} style={{ background:C.surf, border:`1.5px solid ${color}28`, borderRadius:14, overflow:'hidden', marginBottom:8 }}>
            <div style={{ padding:'10px 14px', background:`${color}08`, borderBottom:`1px solid ${color}18` }}>
              <div style={{ fontFamily:DISPLAY, fontWeight:700, fontSize:14, color:C.t1 }}>{name}</div>
              <div style={{ fontFamily:UI, fontSize:11, color:C.t3 }}>{best}</div>
            </div>
            <div style={{ padding:'10px 14px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <div>
                {pros.map((p, i) => (
                  <div key={i} style={{ display:'flex', gap:5, marginBottom:4 }}><CheckCircle2 size={11} color={C.up} style={{ flexShrink:0, marginTop:1 }} /><span style={{ fontFamily:UI, fontSize:10, color:C.t2 }}>{p}</span></div>
                ))}
              </div>
              <div>
                {cons.map((c, i) => (
                  <div key={i} style={{ display:'flex', gap:5, marginBottom:4 }}><XCircle size={11} color={C.down} style={{ flexShrink:0, marginTop:1 }} /><span style={{ fontFamily:UI, fontSize:10, color:C.t2 }}>{c}</span></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <MSectionHeader label="How Cost-Sharing Works" />
      <div style={{ padding:'0 16px' }}>
        <MCard>
          <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.t2, marginBottom:10 }}>Your Cost Journey in a Year</div>
          {[
            { phase:'Phase 1', label:'You pay 100%', sub:'Until you meet your deductible', color:C.down },
            { phase:'Phase 2', label:'You pay coinsurance %', sub:'e.g. 20% you / 80% insurer', color:'#f59e0b' },
            { phase:'Phase 3', label:'Insurance pays 100%', sub:'After your out-of-pocket maximum', color:C.up },
          ].map(({ phase, label, sub, color }, i) => (
            <div key={i} style={{ display:'flex', gap:10, alignItems:'center', marginBottom: i < 2 ? 10 : 0 }}>
              <div style={{ width:60, height:28, borderRadius:8, background:color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:'#fff' }}>{phase}</span>
              </div>
              <div>
                <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.t1 }}>{label}</div>
                <div style={{ fontFamily:UI, fontSize:10, color:C.t3 }}>{sub}</div>
              </div>
            </div>
          ))}
        </MCard>
      </div>

      <MSectionHeader label="Key Health Insurance Terms" />
      <div style={{ padding:'0 16px 4px' }}>
        <MCard style={{ padding:0, overflow:'hidden' }}>
          {[
            { t:'Deductible', c:'#ef4444', d:'Amount you pay before insurance kicks in. Higher deductible = lower premium.' },
            { t:'Premium', c:'#f59e0b', d:'Monthly cost to maintain coverage. Paid whether or not you use healthcare.' },
            { t:'Copay', c:C.teal, d:'Fixed amount per visit (e.g. $30 for primary care). Often applies before deductible.' },
            { t:'Coinsurance', c:'#3b82f6', d:'Your % share after deductible (e.g. 20/80 plan = you pay 20%).' },
            { t:'Out-of-Pocket Max', c:C.up, d:'Annual cap on your costs. After hitting it, insurance covers 100% of covered expenses.' },
          ].map(({ t, c, d }, i) => (
            <div key={i} style={{ display:'flex', gap:10, padding:'11px 14px', borderBottom: i < 4 ? `1px solid ${C.b1}` : 'none' }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:c, flexShrink:0, marginTop:5 }} />
              <div>
                <span style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.t1 }}>{t}: </span>
                <span style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.6 }}>{d}</span>
              </div>
            </div>
          ))}
        </MCard>
      </div>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════
   LEARN — Disability Insurance
════════════════════════════════════════════════════════════════ */
function LearnDisability() {
  return (
    <>
      <MSectionHeader label="Your Most Valuable Asset Is Your Income" />
      <div style={{ padding:'0 16px' }}>
        <div style={{ background:`rgba(201,169,110,0.08)`, border:`1px solid ${C.goldBdr}`, borderRadius:12, padding:'12px 14px', marginBottom:8 }}>
          <p style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65, margin:0 }}>A 35-year-old has a <strong style={{ color:C.t1 }}>1 in 4 chance</strong> of becoming disabled before retirement. Yet most people insure their car and phone while leaving their income — their most valuable asset — completely unprotected.</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          <div style={{ background:`rgba(0,180,198,0.08)`, border:`1px solid ${C.tealBdr}`, borderRadius:12, padding:'12px 12px' }}>
            <div style={{ fontFamily:UI, fontSize:9, fontWeight:800, color:C.teal, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>Short-Term Disability</div>
            {[
              ['Duration', '3–6 months'],
              ['Wait Period', '0–14 days'],
              ['Covers', '60–70% income'],
              ['Source', 'Often employer-provided'],
            ].map(([k, v], i) => (
              <div key={i} style={{ marginBottom:5 }}>
                <div style={{ fontFamily:UI, fontSize:9, color:C.t3 }}>{k}</div>
                <div style={{ fontFamily:UI, fontSize:11, color:C.t1 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ background:`rgba(201,169,110,0.08)`, border:`1px solid ${C.goldBdr}`, borderRadius:12, padding:'12px 12px' }}>
            <div style={{ fontFamily:UI, fontSize:9, fontWeight:800, color:C.gold, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>Long-Term Disability</div>
            {[
              ['Duration', '2 yrs to age 65'],
              ['Wait Period', '90–180 days'],
              ['Covers', '50–70% income'],
              ['Most critical', 'Portable individual policy'],
            ].map(([k, v], i) => (
              <div key={i} style={{ marginBottom:5 }}>
                <div style={{ fontFamily:UI, fontSize:9, color:C.t3 }}>{k}</div>
                <div style={{ fontFamily:UI, fontSize:11, color:C.t1 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MSectionHeader label="Own-Occupation vs Any-Occupation" />
      <div style={{ padding:'0 16px' }}>
        <MCard>
          <p style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65, margin:'0 0 10px' }}>The definition of disability in your policy is critical — it determines whether you actually get paid.</p>
          {[
            { type:'Own-Occupation', color:C.up, desc:'You qualify for benefits if you cannot perform YOUR specific occupation. A surgeon who loses hand function collects full benefits, even if they could work as a consultant.' },
            { type:'Any-Occupation', color:C.down, desc:'You only qualify if you cannot perform ANY occupation for which you\'re reasonably suited by education or experience. Much harder to collect. Avoid this definition if possible.' },
          ].map(({ type, color, desc }, i) => (
            <div key={i} style={{ paddingBottom:i < 1 ? 10 : 0, marginBottom:i < 1 ? 10 : 0, borderBottom: i < 1 ? `1px solid ${C.b1}` : 'none' }}>
              <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color, marginBottom:4 }}>{type}</div>
              <p style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.65, margin:0 }}>{desc}</p>
            </div>
          ))}
        </MCard>
        <InfoBox>High earners (doctors, lawyers, engineers) should always insist on own-occupation coverage. Group LTD through an employer typically uses any-occupation after 24 months. Individual policies from carriers like Guardian, Principal, or MassMutual offer stronger own-occupation definitions.</InfoBox>
      </div>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════
   LEARN — Home & Auto
════════════════════════════════════════════════════════════════ */
function LearnHomeAuto() {
  const [sub, setSub] = useState('home')

  const HOME_COVERED = ['Fire and smoke damage','Theft and vandalism','Wind and hail damage','Burst pipe water damage','Lightning strikes','Liability if someone is injured']
  const HOME_NOT = ['Flooding (requires separate NFIP/private policy)','Earthquakes (separate policy required)','Gradual wear and tear','Pest/termite damage','Mold (usually excluded)','High-value jewelry beyond standard limits']

  const AUTO = [
    { name:'Liability', color:C.teal, req:'Required — most states', desc:'Pays for damage YOU cause to others — their car, property, medical bills. State minimums are often dangerously low. Carry at least $100K/$300K.', tip:'A single serious accident can exceed state minimum limits and expose personal assets.' },
    { name:'Collision', color:'#3b82f6', req:'Optional (required by lenders)', desc:'Repairs or replaces YOUR car after a collision, regardless of fault. Subject to your deductible.', tip:'If car value < 10× annual premium, dropping collision may make financial sense.' },
    { name:'Comprehensive', color:'#8b5cf6', req:'Optional (required by lenders)', desc:'Non-collision damage: theft, vandalism, weather, fire, flood, hitting an animal.', tip:'Usually $100–200/yr. Often worth keeping even on older vehicles.' },
    { name:'Uninsured Motorist', color:'#f59e0b', req:'Required in ~20 states', desc:'Protects you if hit by an uninsured or underinsured driver. ~13% of US drivers have no insurance.', tip:'Carry UM/UIM equal to your liability limits. It\'s usually very cheap to add.' },
    { name:'Umbrella Policy', color:C.gold, req:'Highly recommended', desc:'$1–5M extra liability over your auto and home policies. About $200–400/year. Essential for high earners.', tip:'A lawsuit can exceed your auto/home limits. Umbrella is the most underutilized protection for middle/upper incomes.' },
  ]

  return (
    <>
      <div style={{ padding:'10px 16px 0', display:'flex', gap:8 }}>
        {[['home','Home / Renters'],['auto','Auto']].map(([k,l]) => (
          <button key={k} onClick={() => setSub(k)} style={{
            flex:1, padding:'8px', borderRadius:10,
            border:`1px solid ${sub===k ? C.gold : C.b2}`,
            background: sub===k ? `rgba(201,169,110,0.12)` : C.surf,
            fontFamily:UI, fontSize:12, fontWeight:600,
            color: sub===k ? C.gold : C.t3, cursor:'pointer',
          }}>{l}</button>
        ))}
      </div>

      {sub === 'home' && (
        <>
          <MSectionHeader label="What Homeowners Insurance Covers" />
          <div style={{ padding:'0 16px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 }}>
              <div style={{ background:`rgba(74,124,89,0.08)`, border:`1px solid rgba(74,124,89,0.22)`, borderRadius:12, padding:'12px 12px' }}>
                <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.up, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>Typically Covered</div>
                {HOME_COVERED.map((x, i) => (
                  <div key={i} style={{ display:'flex', gap:5, marginBottom:5 }}><CheckCircle2 size={11} color={C.up} style={{ flexShrink:0, marginTop:1 }} /><span style={{ fontFamily:UI, fontSize:10, color:C.t2 }}>{x}</span></div>
                ))}
              </div>
              <div style={{ background:`rgba(192,57,43,0.06)`, border:`1px solid rgba(192,57,43,0.2)`, borderRadius:12, padding:'12px 12px' }}>
                <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.down, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>NOT Covered</div>
                {HOME_NOT.map((x, i) => (
                  <div key={i} style={{ display:'flex', gap:5, marginBottom:5 }}><XCircle size={11} color={C.down} style={{ flexShrink:0, marginTop:1 }} /><span style={{ fontFamily:UI, fontSize:10, color:C.t2 }}>{x}</span></div>
                ))}
              </div>
            </div>

            <MCard>
              <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.gold, marginBottom:8 }}>Replacement Cost vs Actual Cash Value (ACV)</div>
              {[
                { type:'Replacement Cost', color:C.up, desc:'Pays cost to rebuild at TODAY\'s prices. Destroyed 10-year-old roof → you get a new roof.', ex:'Roof cost today: $15,000 → Insurer pays: $15,000' },
                { type:'Actual Cash Value', color:'#f59e0b', desc:'Replacement cost minus depreciation. That same 10-year-old roof may be heavily depreciated.', ex:'$15,000 − $8,000 depreciation → Insurer pays: $7,000' },
              ].map(({ type, color, desc, ex }, i) => (
                <div key={i} style={{ paddingBottom: i < 1 ? 10 : 0, marginBottom: i < 1 ? 10 : 0, borderBottom: i < 1 ? `1px solid ${C.b1}` : 'none' }}>
                  <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color, marginBottom:3 }}>{type}</div>
                  <p style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.6, margin:'0 0 5px' }}>{desc}</p>
                  <div style={{ background:C.raise, borderRadius:6, padding:'5px 8px', fontFamily:MONO, fontSize:10, color:C.t2 }}>{ex}</div>
                </div>
              ))}
            </MCard>
            <InfoBox>Renters insurance is remarkably cheap ($15–30/month) and covers your personal property AND liability. If you rent and don't have it, get it today.</InfoBox>
          </div>
        </>
      )}

      {sub === 'auto' && (
        <>
          <MSectionHeader label="Auto Coverage Types" />
          <div style={{ padding:'0 16px 4px' }}>
            {AUTO.map(({ name, color, req, desc, tip }) => (
              <div key={name} style={{ background:C.surf, border:`1.5px solid ${color}22`, borderRadius:14, overflow:'hidden', marginBottom:8 }}>
                <div style={{ padding:'10px 14px', background:`${color}08`, borderBottom:`1px solid ${color}15`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontFamily:DISPLAY, fontSize:13, fontWeight:700, color:C.t1 }}>{name}</span>
                  <span style={{ fontFamily:UI, fontSize:9, fontWeight:700, color, background:`${color}18`, border:`1px solid ${color}30`, borderRadius:20, padding:'1px 7px', textTransform:'uppercase', letterSpacing:'0.06em' }}>{req}</span>
                </div>
                <div style={{ padding:'10px 14px' }}>
                  <p style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.6, margin:'0 0 6px' }}>{desc}</p>
                  <div style={{ display:'flex', gap:6, padding:'6px 8px', background:`${color}0a`, borderRadius:7 }}>
                    <Info size={11} color={color} style={{ flexShrink:0, marginTop:1 }} />
                    <span style={{ fontFamily:UI, fontSize:10, color:C.t3 }}>{tip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}

/* ════════════════════════════════════════════════════════════════
   LEARN — Long-Term Care
════════════════════════════════════════════════════════════════ */
function LearnLTC() {
  const COSTS = [
    ['Adult Day Health Care',      '$95',  '$2,000–$2,500',   '$24,000–$30,000'],
    ['Home Health Aide',           '$175', '$4,500–$5,200',   '$54,000–$62,400'],
    ['Assisted Living Facility',   '$165', '$4,500–$5,500',   '$54,000–$66,000'],
    ['Nursing Home (Semi-private)','$295', '$8,000–$9,500',   '$96,000–$114,000'],
    ['Nursing Home (Private)',     '$335', '$9,500–$11,000',  '$114,000–$132,000'],
  ]

  return (
    <>
      <MSectionHeader label="The LTC Reality" />
      <div style={{ padding:'0 16px' }}>
        <div style={{ background:`rgba(201,169,110,0.08)`, border:`1px solid ${C.goldBdr}`, borderRadius:12, padding:'12px 14px', marginBottom:8 }}>
          <p style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65, margin:0 }}><strong style={{ color:C.t1 }}>70% of people over 65</strong> will need some form of long-term care. Medicare covers only short-term skilled nursing care. Medicaid requires spending down nearly all assets first. LTC insurance bridges this gap.</p>
        </div>
      </div>

      <MSectionHeader label="National Average LTC Costs (2024)" />
      <div style={{ padding:'0 16px' }}>
        <MCard style={{ padding:0, overflow:'hidden' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr auto', background:C.raise, padding:'7px 12px', borderBottom:`1px solid ${C.b2}` }}>
            <span style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em' }}>Care Type</span>
            <span style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em' }}>Annual</span>
          </div>
          {COSTS.map(([type, daily, monthly, annual], i) => (
            <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr auto', padding:'9px 12px', borderBottom: i < COSTS.length-1 ? `1px solid ${C.b1}` : 'none' }}>
              <div>
                <div style={{ fontFamily:UI, fontSize:11, fontWeight:600, color:C.t1 }}>{type}</div>
                <div style={{ fontFamily:MONO, fontSize:10, color:C.t3 }}>{daily}/day · {monthly}/mo</div>
              </div>
              <span style={{ fontFamily:MONO, fontSize:11, fontWeight:700, color:C.down, textAlign:'right', alignSelf:'center' }}>{annual}</span>
            </div>
          ))}
        </MCard>
      </div>

      <MSectionHeader label="When to Buy LTC Insurance" />
      <div style={{ padding:'0 16px 4px' }}>
        <MCard style={{ padding:0, overflow:'hidden' }}>
          {[
            ['Under 50', 'Too early', C.t3, 'Premiums are low but you\'ll pay for decades. Most advisors suggest waiting.'],
            ['50–55', 'Sweet spot', C.up, 'Best balance of affordable premiums and insurability. Buy here if LTC is in your plan.'],
            ['55–65', 'Optimal window', C.teal, 'Still insurable for most. Premiums rising but manageable. Act before health issues arise.'],
            ['65–70', 'Possible but expensive', '#f59e0b', 'High premiums. Health screening may disqualify you. Consider hybrid life/LTC.'],
            ['Over 70', 'Very difficult', C.down, 'Traditional LTC mostly unavailable. Self-insuring or Medicaid planning are alternatives.'],
          ].map(([age, rec, col, note], i) => (
            <div key={i} style={{ display:'flex', gap:10, padding:'10px 14px', borderBottom: i < 4 ? `1px solid ${C.b1}` : 'none' }}>
              <div style={{ minWidth:52 }}>
                <div style={{ fontFamily:MONO, fontSize:11, fontWeight:700, color:C.t1 }}>{age}</div>
              </div>
              <div style={{ flex:1 }}>
                <span style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:col, background:`${col}18`, border:`1px solid ${col}30`, borderRadius:20, padding:'1px 7px', display:'inline-block', marginBottom:3 }}>{rec}</span>
                <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.5 }}>{note}</div>
              </div>
            </div>
          ))}
        </MCard>
      </div>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════
   CALCULATE — Life Insurance Needs
════════════════════════════════════════════════════════════════ */
function CalcLifeNeeds() {
  const [income, setIncome]       = useState(100000)
  const [years, setYears]         = useState(20)
  const [mortgage, setMortgage]   = useState(250000)
  const [education, setEducation] = useState(100000)
  const [existing, setExisting]   = useState(200000)

  const incomeReplacement = income * years
  const totalNeed         = incomeReplacement + mortgage + education
  const coverageGap       = Math.max(0, totalNeed - existing)
  const rule10x           = income * 10

  return (
    <div style={{ padding:'12px 16px 0' }}>
      <div style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, padding:'14px', marginBottom:12 }}>
        {[
          { l:'Annual Income', v:income, set:setIncome, min:0, max:500000, step:5000, d:fmt(income) },
          { l:'Years of Income to Replace', v:years, set:setYears, min:5, max:30, step:1, d:`${years} yrs` },
          { l:'Mortgage Balance', v:mortgage, set:setMortgage, min:0, max:2000000, step:10000, d:fmt(mortgage) },
          { l:'Education Fund (children)', v:education, set:setEducation, min:0, max:500000, step:10000, d:fmt(education) },
          { l:'Existing Coverage', v:existing, set:setExisting, min:0, max:2000000, step:25000, d:fmt(existing) },
        ].map(({ l, v, set, min, max, step, d }) => (
          <div key={l} style={{ marginBottom:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
              <span style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:C.t2 }}>{l}</span>
              <span style={{ fontFamily:MONO, fontSize:12, fontWeight:700, color:C.gold }}>{d}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={v} onChange={e => set(+e.target.value)} style={{ width:'100%', accentColor:C.gold }} />
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
        {[
          { l:'Income Replacement Need', v:fmt(incomeReplacement), col:C.gold },
          { l:'Total Need', v:fmt(totalNeed), col:C.gold },
          { l:'Existing Coverage', v:fmt(existing), col:C.up },
          { l:'Coverage Gap', v:fmt(coverageGap), col: coverageGap > 0 ? C.down : C.up },
        ].map(({ l, v, col }) => (
          <div key={l} style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:10, padding:'10px 12px' }}>
            <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.t3, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>{l}</div>
            <div style={{ fontFamily:MONO, fontSize:14, fontWeight:700, color:col }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:12, padding:'12px 14px', marginBottom:12 }}>
        <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.t2, marginBottom:6 }}>Rule of Thumb Check</div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontFamily:UI, fontSize:12, color:C.t2 }}>10× income rule suggests:</span>
          <span style={{ fontFamily:MONO, fontSize:13, fontWeight:700, color:C.teal }}>{fmt(rule10x)}</span>
        </div>
      </div>

      <InfoBox icon={AlertCircle} color='#fbbf24'>This is a simplified estimate. A CFP uses detailed needs analysis including debt, spouse income, Social Security survivor benefits, and inflation. Use this as a floor, not a ceiling.</InfoBox>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   CALCULATE — Disability Coverage Gap
════════════════════════════════════════════════════════════════ */
function CalcDisability() {
  const [income, setIncome]         = useState(100000)
  const [groupCoverage, setGroup]   = useState(0.60)
  const [eliminDays, setElimin]     = useState(90)
  const [monthlyExpenses, setExp]   = useState(5000)

  const monthlyIncome  = income / 12
  const groupBenefit   = monthlyIncome * groupCoverage
  const gap            = Math.max(0, monthlyExpenses - groupBenefit)
  const emergency      = monthlyExpenses * (eliminDays / 30)

  return (
    <div style={{ padding:'12px 16px 0' }}>
      <div style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, padding:'14px', marginBottom:12 }}>
        {[
          { l:'Annual Income', v:income, set:setIncome, min:20000, max:500000, step:5000, d:fmt(income) },
          { l:'Monthly Essential Expenses', v:monthlyExpenses, set:setExp, min:1000, max:20000, step:250, d:fmt(monthlyExpenses) },
          { l:'Elimination Period', v:eliminDays, set:setElimin, min:30, max:180, step:30, d:`${eliminDays} days` },
        ].map(({ l, v, set, min, max, step, d }) => (
          <div key={l} style={{ marginBottom:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
              <span style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:C.t2 }}>{l}</span>
              <span style={{ fontFamily:MONO, fontSize:12, fontWeight:700, color:C.gold }}>{d}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={v} onChange={e => set(+e.target.value)} style={{ width:'100%', accentColor:C.gold }} />
          </div>
        ))}
        <div style={{ marginBottom:8 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
            <span style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:C.t2 }}>Group LTD Coverage</span>
            <span style={{ fontFamily:MONO, fontSize:12, fontWeight:700, color:C.gold }}>{Math.round(groupCoverage*100)}%</span>
          </div>
          <input type="range" min={0.4} max={0.7} step={0.05} value={groupCoverage} onChange={e => setGroup(+e.target.value)} style={{ width:'100%', accentColor:C.gold }} />
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
        {[
          { l:'Monthly Group Benefit', v:fmt(groupBenefit), col:C.up },
          { l:'Monthly Expense Gap', v:fmt(gap), col: gap > 0 ? C.down : C.up },
          { l:'Emergency Fund Needed', v:fmt(emergency), col:'#f59e0b' },
          { l:'Annual Coverage Need', v:fmt(gap * 12), col: gap > 0 ? C.down : C.up },
        ].map(({ l, v, col }) => (
          <div key={l} style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:10, padding:'10px 12px' }}>
            <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.t3, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>{l}</div>
            <div style={{ fontFamily:MONO, fontSize:14, fontWeight:700, color:col }}>{v}</div>
          </div>
        ))}
      </div>

      <InfoBox>Most employer group LTD covers only 60% of base salary, doesn't include bonus/commission income, and is taxable if the employer pays the premium. Individual own-occupation policies fill these gaps.</InfoBox>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   RESOURCES TAB
════════════════════════════════════════════════════════════════ */
function TabResources() {
  return (
    <>
      <MSectionHeader label="Insurance Coverage Checklist" />
      <div style={{ padding:'0 16px' }}>
        {[
          { category:'Essential', color:C.down, items:['Term life (10–12× income if you have dependents)','Long-term disability — own-occupation definition','Health insurance — OOP max understood','Auto liability above state minimums'] },
          { category:'Strongly Recommended', color:C.gold, items:['Homeowners or renters insurance','Umbrella policy ($1M+ over auto/home)','HSA if on HDHP — invest, don\'t spend','Beneficiaries reviewed annually on all accounts'] },
          { category:'Situational', color:C.teal, items:['LTC insurance (ages 50–65)','Business owner / key person insurance','Life insurance as estate planning tool (high net worth)','Travel insurance for international trips'] },
        ].map(section => (
          <MCard key={section.category}>
            <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:section.color, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:10 }}>{section.category}</div>
            {section.items.map((item, i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, padding:'6px 0', borderTop:`1px solid ${C.b1}` }}>
                <span style={{ fontFamily:MONO, fontSize:11, color:section.color, flexShrink:0, marginTop:1 }}>□</span>
                <span style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.5 }}>{item}</span>
              </div>
            ))}
          </MCard>
        ))}
      </div>

      <MSectionHeader label="Find Insurance" />
      <div style={{ padding:'0 16px 4px' }}>
        <MCard style={{ padding:0, overflow:'hidden' }}>
          {[
            { name:'Policygenius', desc:'Compare life, disability, and home insurance quotes' },
            { name:'HealthCare.gov', desc:'ACA marketplace plans and premium tax credits' },
            { name:'NAIC Consumer Portal', desc:'Look up insurer financial ratings and complaints' },
            { name:'Find a CFP', desc:'CFP Board — advisors who provide fiduciary insurance guidance' },
          ].map(({ name, desc }, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderBottom: i < 3 ? `1px solid ${C.b1}` : 'none' }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
                  <span style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.t1 }}>{name}</span>
                  <ExternalLink size={10} color={C.t3} />
                </div>
                <div style={{ fontFamily:UI, fontSize:11, color:C.t3 }}>{desc}</div>
              </div>
              <ArrowRight size={14} color={C.gold} />
            </div>
          ))}
        </MCard>
      </div>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════
   ROOT COMPONENT
════════════════════════════════════════════════════════════════ */
const LEARN_TABS = [['life','Life Insurance'],['health','Health'],['disability','Disability'],['homeauto','Home & Auto'],['ltc','Long-Term Care']]
const CALC_TABS  = [['lifeneeds','Life Needs'],['disability','Disability Gap']]
const MAIN_TABS  = [['learn','Learn'],['calc','Calculate'],['resources','Resources']]

export default function MInsurance() {
  const [mainTab, setMainTab] = useState('learn')
  const [learnSub, setLearnSub] = useState('life')
  const [calcSub, setCalcSub]   = useState('lifeneeds')

  return (
    <div style={{ background:C.bg, minHeight:'100dvh', paddingBottom:88 }}>
      <ScreenHeader title="Insurance Planning" subtitle="Learn" accent={C.gold} />

      {/* Main tabs */}
      <div style={{ display:'flex', borderBottom:`1px solid ${C.b2}`, background:C.bg }}>
        {MAIN_TABS.map(([k, l]) => (
          <button key={k} onClick={() => setMainTab(k)} style={{
            flex:1, padding:'11px 0', background:'none', border:'none', cursor:'pointer',
            borderBottom:`2px solid ${mainTab===k ? C.gold : 'transparent'}`,
            fontFamily:UI, fontSize:12, fontWeight:600,
            color: mainTab===k ? C.gold : C.t3,
          }}>{l}</button>
        ))}
      </div>

      {mainTab === 'learn' && (
        <>
          <PillTabs tabs={LEARN_TABS} active={learnSub} onSelect={setLearnSub} />
          {learnSub === 'life'       && <LearnLifeInsurance />}
          {learnSub === 'health'     && <LearnHealth />}
          {learnSub === 'disability' && <LearnDisability />}
          {learnSub === 'homeauto'   && <LearnHomeAuto />}
          {learnSub === 'ltc'        && <LearnLTC />}
        </>
      )}

      {mainTab === 'calc' && (
        <>
          <PillTabs tabs={CALC_TABS} active={calcSub} onSelect={setCalcSub} />
          {calcSub === 'lifeneeds'  && <CalcLifeNeeds />}
          {calcSub === 'disability' && <CalcDisability />}
        </>
      )}

      {mainTab === 'resources' && <TabResources />}
    </div>
  )
}
