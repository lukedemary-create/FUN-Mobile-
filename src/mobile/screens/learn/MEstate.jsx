import { useState } from 'react'
import {
  CheckCircle2, XCircle, AlertCircle, Info, ChevronDown, ChevronUp,
  FileText, Heart, DollarSign, Shield, Scale, Users, ExternalLink, ArrowRight,
} from 'lucide-react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'

const fmt  = n => '$' + Math.round(n || 0).toLocaleString()

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

/* ════════════════════════════════════════════════════════════════
   LEARN — Wills
════════════════════════════════════════════════════════════════ */
function LearnWills() {
  const types = [
    {
      name: 'Last Will & Testament',
      color: C.teal,
      badge: 'Most common',
      what: 'A legal document directing asset distribution after death, naming your executor, and designating guardians for minor children.',
      covers: ['Asset & property distribution', 'Guardian for minor children', 'Executor to carry out wishes', 'Specific bequests (heirlooms)'],
      doesnt: ['Avoid probate — wills go through court', 'Cover beneficiary-designated assets', 'Take effect while you are alive'],
    },
    {
      name: 'Living Will (Advance Directive)',
      color: C.indigo,
      badge: 'Not about money',
      what: 'NOT a property document. Tells doctors what medical treatment you want or don\'t want if incapacitated — end-of-life healthcare decisions only.',
      covers: ['Resuscitation preferences (DNR)', 'Life support & ventilator decisions', 'Feeding tube preferences', 'Organ donation wishes'],
      doesnt: ['Distribute any property or assets', 'Name guardians for children', 'Have any effect after death'],
    },
  ]

  return (
    <>
      <MSectionHeader label="Why You Need a Will" />
      <div style={{ padding:'0 16px' }}>
        <div style={{ background:`rgba(192,57,43,0.08)`, border:`1px solid rgba(192,57,43,0.22)`, borderRadius:12, padding:'12px 14px', marginBottom:8 }}>
          <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
            <AlertCircle size={13} color={C.down} style={{ flexShrink:0, marginTop:1 }} />
            <p style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65, margin:0 }}>
              <strong style={{ color:C.down }}>Dying intestate (without a will)</strong> means probate court applies your state's default rules. Your assets may go to people you wouldn't choose — and a judge picks your children's guardian.
            </p>
          </div>
        </div>

        {types.map(t => (
          <div key={t.name} style={{ background:C.surf, border:`1px solid ${t.color}28`, borderRadius:14, padding:'14px', marginBottom:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
              <span style={{ fontFamily:DISPLAY, fontWeight:700, color:C.t1, fontSize:14 }}>{t.name}</span>
              <span style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:t.color, background:`${t.color}18`, border:`1px solid ${t.color}30`, borderRadius:20, padding:'2px 7px', textTransform:'uppercase', letterSpacing:'0.06em' }}>{t.badge}</span>
            </div>
            <p style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65, margin:'0 0 10px' }}>{t.what}</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <div>
                <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.up, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>Covers</div>
                {t.covers.map((c, i) => (
                  <div key={i} style={{ display:'flex', gap:5, alignItems:'flex-start', marginBottom:4 }}>
                    <CheckCircle2 size={11} color={C.up} style={{ flexShrink:0, marginTop:1 }} />
                    <span style={{ fontFamily:UI, fontSize:10, color:C.t2 }}>{c}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.down, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>Does NOT cover</div>
                {t.doesnt.map((d, i) => (
                  <div key={i} style={{ display:'flex', gap:5, alignItems:'flex-start', marginBottom:4 }}>
                    <XCircle size={11} color={C.down} style={{ flexShrink:0, marginTop:1 }} />
                    <span style={{ fontFamily:UI, fontSize:10, color:C.t2 }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <MSectionHeader label="Who Needs a Will Right Now?" />
      <div style={{ padding:'0 16px' }}>
        <MCard style={{ padding:0, overflow:'hidden' }}>
          {[
            ['Immediately', 'Parents of minor children', 'A judge decides who raises your children without one.', C.down],
            ['High', 'Anyone who owns property', 'Real estate without named beneficiaries goes to probate.', C.warning],
            ['High', 'Unmarried couples', 'Without a will your partner receives nothing — state gives to blood relatives.', C.warning],
            ['Moderate', 'Anyone with specific wishes', 'Heirlooms, charities, or excluding someone requires explicit instruction.', C.teal],
            ['Lower', 'Young singles with few assets', 'Still valuable. At minimum, name beneficiaries on all accounts.', C.t3],
          ].map(([urg, grp, note, col], i) => (
            <div key={i} style={{ display:'flex', gap:10, padding:'11px 14px', borderBottom: i < 4 ? `1px solid ${C.b1}` : 'none' }}>
              <span style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:col, minWidth:70, paddingTop:1 }}>{urg}</span>
              <div>
                <div style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:C.t1 }}>{grp}</div>
                <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.5, marginTop:1 }}>{note}</div>
              </div>
            </div>
          ))}
        </MCard>
        <InfoBox>A basic will costs $100–$300 with an attorney, or $20–$100 using online services (Nolo, Trust & Will, LegalZoom). Free options exist through legal aid for qualifying individuals.</InfoBox>
      </div>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════
   LEARN — Trusts
════════════════════════════════════════════════════════════════ */
function LearnTrusts() {
  const [open, setOpen] = useState(null)

  const types = [
    {
      key:'revocable', name:'Revocable Living Trust', color:C.teal, badge:'Most common',
      summary:'Transfer assets into the trust while alive, stay in full control, change it anytime. At death, assets pass directly to beneficiaries — no probate.',
      pros:['Avoids probate — faster and private','Works across multiple states','Manages assets if you become incapacitated','Can still include a pour-over will'],
      cons:['More expensive to set up ($1,000–$3,000+)','Must fund the trust — often forgotten','No tax advantages vs. personal ownership'],
      best:'Assets in multiple states, significant wealth, privacy concerns, or desire to avoid probate delays.',
    },
    {
      key:'irrevocable', name:'Irrevocable Trust', color:'#f59e0b', badge:'Advanced',
      summary:'Once created, you give up control. In exchange, those assets are protected from creditors and removed from your taxable estate.',
      pros:['Removes assets from taxable estate','Asset protection from creditors/lawsuits','Can be used for Medicaid planning','Special needs trusts for disabled beneficiaries'],
      cons:['Cannot be changed — you lose ownership','Complex — requires experienced attorney','Ongoing administration costs and tax filings'],
      best:'High-net-worth individuals with estate tax concerns, Medicaid planning, or parents of children with special needs.',
    },
    {
      key:'testamentary', name:'Testamentary Trust', color:C.indigo, badge:'In your will',
      summary:'A trust created by your will that only comes into existence after your death. Used to manage assets for minor children or other beneficiaries.',
      pros:['Created within the will — no upfront cost','Controls when/how children receive assets','Can specify age or milestone for distribution'],
      cons:['Goes through probate (will must be validated first)','Does not protect assets from creditors','Less flexible than a living trust'],
      best:'Parents who want a simple way to protect minor children\'s inheritance without the upfront cost of a living trust.',
    },
  ]

  return (
    <>
      <MSectionHeader label="Will vs. Trust — Key Difference" />
      <div style={{ padding:'0 16px' }}>
        <div style={{ background:`rgba(0,180,198,0.08)`, border:`1px solid ${C.tealBdr}`, borderRadius:12, padding:'12px 14px', marginBottom:8 }}>
          <p style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65, margin:0 }}>
            <strong style={{ color:C.t1 }}>A will</strong> only takes effect after you die and must go through probate court. <strong style={{ color:C.teal }}>A trust</strong> takes effect immediately, works while you're alive, and passes assets at death without court involvement.
          </p>
        </div>

        {types.map(({ key, name, color, badge, summary, pros, cons, best }) => (
          <div key={key} style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, marginBottom:8, overflow:'hidden' }}>
            <button onClick={() => setOpen(p => p===key ? null : key)} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 14px', background:'none', border:'none', cursor:'pointer', textAlign:'left' }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:3 }}>
                  <span style={{ fontFamily:DISPLAY, fontSize:14, fontWeight:700, color: open===key ? C.t1 : C.t2 }}>{name}</span>
                  <span style={{ fontFamily:UI, fontSize:9, fontWeight:700, color, background:`${color}18`, border:`1px solid ${color}30`, borderRadius:20, padding:'1px 6px', textTransform:'uppercase', letterSpacing:'0.06em' }}>{badge}</span>
                </div>
                <p style={{ fontFamily:UI, fontSize:11, color:C.t3, margin:0, lineHeight:1.5 }}>{summary.slice(0, 60)}…</p>
              </div>
              {open===key ? <ChevronUp size={13} color={color} style={{ flexShrink:0 }} /> : <ChevronDown size={13} color={C.t3} style={{ flexShrink:0 }} />}
            </button>
            {open===key && (
              <div style={{ padding:'0 14px 14px', borderTop:`1px solid ${C.b1}` }}>
                <p style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65, margin:'10px 0 10px' }}>{summary}</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
                  <div>
                    <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.up, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>Pros</div>
                    {pros.map((p, i) => (
                      <div key={i} style={{ display:'flex', gap:5, marginBottom:4 }}>
                        <CheckCircle2 size={11} color={C.up} style={{ flexShrink:0, marginTop:1 }} />
                        <span style={{ fontFamily:UI, fontSize:10, color:C.t2 }}>{p}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.down, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>Cons</div>
                    {cons.map((c, i) => (
                      <div key={i} style={{ display:'flex', gap:5, marginBottom:4 }}>
                        <XCircle size={11} color={C.down} style={{ flexShrink:0, marginTop:1 }} />
                        <span style={{ fontFamily:UI, fontSize:10, color:C.t2 }}>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background:`${color}10`, border:`1px solid ${color}22`, borderRadius:8, padding:'8px 10px' }}>
                  <span style={{ fontFamily:UI, fontSize:10, fontWeight:700, color }}>Best for: </span>
                  <span style={{ fontFamily:UI, fontSize:10, color:C.t2 }}>{best}</span>
                </div>
              </div>
            )}
          </div>
        ))}
        <InfoBox>Most people with straightforward estates don't need a trust — a well-drafted will with proper beneficiary designations accomplishes the same goals. Consider a trust if your estate exceeds $500K, you own property in multiple states, or have complex family situations.</InfoBox>
      </div>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════
   LEARN — Power of Attorney
════════════════════════════════════════════════════════════════ */
function LearnPOA() {
  const types = [
    {
      name:'Durable Financial POA', icon:DollarSign, color:C.teal, badge:'Essential',
      what:'Grants your agent legal authority to manage your finances — pay bills, manage investments, file taxes, handle real estate — if you become incapacitated.',
      key:'"Durable" means it stays effective even after you lose mental capacity. A regular POA terminates at incapacity — exactly when you need it most.',
      warning:'Choose your agent carefully. They have broad legal authority over your finances. Name a successor agent as backup.',
    },
    {
      name:'Healthcare Power of Attorney', icon:Heart, color:'#ec4899', badge:'Essential',
      what:'Designates someone to make medical decisions on your behalf when you cannot communicate. Also called a healthcare proxy or healthcare agent.',
      key:'Your agent speaks for you when doctors need consent for procedures or treatment decisions. They interpret your living will and fill in gaps it doesn\'t address.',
      warning:'This is separate from your living will. The living will states your wishes; the healthcare POA names who enforces them.',
    },
    {
      name:'Limited / Special POA', icon:FileText, color:C.t3, badge:'Situational',
      what:'Grants authority for a specific transaction or time period — for example, closing on a real estate sale while you\'re traveling abroad.',
      key:'Automatically expires after the specified event or date. Does not continue through incapacity.',
      warning:null,
    },
  ]

  return (
    <>
      <MSectionHeader label="What Is a Power of Attorney?" />
      <div style={{ padding:'0 16px' }}>
        <div style={{ background:`rgba(192,57,43,0.08)`, border:`1px solid rgba(192,57,43,0.22)`, borderRadius:12, padding:'12px 14px', marginBottom:8 }}>
          <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
            <AlertCircle size={13} color={C.down} style={{ flexShrink:0, marginTop:1 }} />
            <p style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65, margin:0 }}>
              <strong style={{ color:C.down }}>Without a POA:</strong> Your family may need to petition a court for guardianship — a costly, public, and time-consuming process — just to manage your finances or make medical decisions.
            </p>
          </div>
        </div>

        {types.map(({ name, icon: Icon, color, badge, what, key, warning }) => (
          <div key={name} style={{ background:C.surf, border:`1px solid ${color}28`, borderRadius:14, padding:'14px', marginBottom:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
              <Icon size={14} color={color} />
              <span style={{ fontFamily:DISPLAY, fontSize:14, fontWeight:700, color:C.t1 }}>{name}</span>
              <span style={{ fontFamily:UI, fontSize:9, fontWeight:700, color, background:`${color}18`, border:`1px solid ${color}30`, borderRadius:20, padding:'1px 6px', textTransform:'uppercase', letterSpacing:'0.06em' }}>{badge}</span>
            </div>
            <p style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65, margin:'0 0 8px' }}>{what}</p>
            <div style={{ background:`${color}10`, border:`1px solid ${color}22`, borderRadius:8, padding:'8px 10px', marginBottom: warning ? 6 : 0 }}>
              <span style={{ fontFamily:UI, fontSize:10, fontWeight:700, color }}>Key point: </span>
              <span style={{ fontFamily:UI, fontSize:10, color:C.t2 }}>{key}</span>
            </div>
            {warning && (
              <div style={{ display:'flex', gap:7, padding:'8px 10px', background:`rgba(245,158,11,0.08)`, border:`1px solid rgba(245,158,11,0.22)`, borderRadius:8, marginTop:4 }}>
                <AlertCircle size={12} color='#f59e0b' style={{ flexShrink:0, marginTop:1 }} />
                <span style={{ fontFamily:UI, fontSize:11, color:C.t2 }}>{warning}</span>
              </div>
            )}
          </div>
        ))}
        <InfoBox>Financial and healthcare POAs can typically be added to your estate plan for little additional cost when working with an attorney. Both must be signed, witnessed, and notarized per your state's requirements.</InfoBox>
      </div>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════
   LEARN — Healthcare Directives
════════════════════════════════════════════════════════════════ */
function LearnDirectives() {
  const DOCS = [
    { name:'Living Will / Advance Directive', color:C.teal, desc:'Written instructions to doctors about what treatments you want or don\'t want. Speaks for you directly in specific scenarios.' },
    { name:'Healthcare Power of Attorney', color:'#ec4899', desc:'Names the person who makes medical decisions when you can\'t communicate. They interpret and apply your living will.' },
    { name:'POLST / MOLST Form', color:'#f59e0b', desc:'Physician Orders for Life-Sustaining Treatment — a medical order (not just a directive) that travels with you across care settings. For serious illness.' },
  ]

  const DECISIONS = [
    { q:'CPR & Resuscitation', d:'Do you want CPR attempted if your heart stops? A DNR order tells staff not to perform CPR.' },
    { q:'Mechanical Ventilation', d:'If you cannot breathe on your own, do you want a ventilator? For how long?' },
    { q:'Artificial Nutrition & Hydration', d:'If you cannot eat or drink, do you want feeding tubes or IV fluids?' },
    { q:'Dialysis', d:'If your kidneys fail, do you want dialysis to filter your blood?' },
    { q:'Comfort Care Only', d:'Focusing only on pain management and dignity, without life-prolonging intervention.' },
    { q:'Organ & Tissue Donation', d:'Register with your state donor registry and note wishes in your directive.' },
  ]

  return (
    <>
      <MSectionHeader label="Three Core Directive Documents" />
      <div style={{ padding:'0 16px' }}>
        <MCard style={{ padding:0, overflow:'hidden' }}>
          {DOCS.map(({ name, color, desc }, i) => (
            <div key={i} style={{ padding:'12px 14px', borderBottom: i < DOCS.length-1 ? `1px solid ${C.b1}` : 'none' }}>
              <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color, marginBottom:3 }}>{name}</div>
              <div style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.6 }}>{desc}</div>
            </div>
          ))}
        </MCard>
      </div>

      <MSectionHeader label="Decisions to Address" />
      <div style={{ padding:'0 16px' }}>
        <MCard style={{ padding:0, overflow:'hidden' }}>
          {DECISIONS.map(({ q, d }, i) => (
            <div key={i} style={{ padding:'11px 14px', borderBottom: i < DECISIONS.length-1 ? `1px solid ${C.b1}` : 'none' }}>
              <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.t1, marginBottom:2 }}>{q}</div>
              <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.55 }}>{d}</div>
            </div>
          ))}
        </MCard>
        <InfoBox color={C.teal}>Completing these documents is a gift to your family — it removes the burden of making impossible decisions in a crisis. Share your directive with your doctor, healthcare agent, and family members.</InfoBox>
      </div>

      <MSectionHeader label="HIPAA Authorization" />
      <div style={{ padding:'0 16px 4px' }}>
        <MCard>
          <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.gold, marginBottom:6 }}>Often Forgotten</div>
          <p style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65, margin:0 }}>A HIPAA authorization allows doctors to share your health information with designated family members. Without it, even your closest family may be denied information about your condition. Simple, free, and frequently overlooked — include it in your directive package.</p>
        </MCard>
      </div>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════
   CALCULATE — Estate Tax Calculator
════════════════════════════════════════════════════════════════ */
function CalcEstateTax() {
  const [estate, setEstate] = useState(3000000)
  const [marital, setMarital] = useState(false)
  const [gifts, setGifts] = useState(0)

  const EXEMPTION = 15000000
  const RATE = 0.40

  // Estate tax exemption (portability doubles for surviving spouse)
  const exemption   = marital ? EXEMPTION * 2 : EXEMPTION
  const netEstate   = Math.max(0, estate - gifts)
  const taxable     = Math.max(0, netEstate - exemption)
  const estateTax   = taxable * RATE
  const heirsReceive = estate - estateTax

  return (
    <div style={{ padding:'12px 16px 0' }}>
      <div style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, padding:'14px', marginBottom:12 }}>
        {[
          { l:'Gross Estate Value', v:estate, set:setEstate, min:0, max:50000000, step:100000, d:fmt(estate) },
          { l:'Prior Taxable Gifts Made', v:gifts, set:setGifts, min:0, max:10000000, step:50000, d:fmt(gifts) },
        ].map(({ l, v, set, min, max, step, d }) => (
          <div key={l} style={{ marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
              <span style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:C.t2 }}>{l}</span>
              <span style={{ fontFamily:MONO, fontSize:12, fontWeight:700, color:C.gold }}>{d}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={v} onChange={e => set(+e.target.value)} style={{ width:'100%', accentColor:C.gold }} />
          </div>
        ))}
        {/* Marital toggle */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:C.t2 }}>Married (portability applies)</span>
          <button onClick={() => setMarital(p => !p)} style={{
            width:44, height:24, borderRadius:12, border:'none', cursor:'pointer', padding:2, display:'flex', alignItems:'center',
            background: marital ? C.gold : C.b2, justifyContent: marital ? 'flex-end' : 'flex-start',
          }}>
            <div style={{ width:18, height:18, borderRadius:'50%', background: marital ? '#1a1410' : C.t3 }} />
          </button>
        </div>
      </div>

      {/* Results */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
        {[
          { l:'Federal Exemption', v:fmt(exemption), col:C.up },
          { l:'Taxable Estate', v:fmt(taxable), col: taxable > 0 ? C.down : C.up },
          { l:'Estate Tax Owed', v:fmt(estateTax), col: estateTax > 0 ? C.down : C.up },
          { l:'Heirs Receive', v:fmt(heirsReceive), col:C.teal },
        ].map(({ l, v, col }) => (
          <div key={l} style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:10, padding:'10px 12px' }}>
            <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.t3, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>{l}</div>
            <div style={{ fontFamily:MONO, fontSize:14, fontWeight:700, color:col }}>{v}</div>
          </div>
        ))}
      </div>

      {taxable <= 0 ? (
        <div style={{ background:`rgba(74,124,89,0.1)`, border:`1px solid rgba(74,124,89,0.25)`, borderRadius:12, padding:'12px 14px', textAlign:'center' }}>
          <div style={{ fontFamily:MONO, fontSize:16, fontWeight:700, color:C.up }}>No Federal Estate Tax</div>
          <div style={{ fontFamily:UI, fontSize:11, color:C.t3, marginTop:3 }}>Estate is below the {fmt(exemption)} exemption</div>
        </div>
      ) : (
        <div style={{ background:`rgba(192,57,43,0.08)`, border:`1px solid rgba(192,57,43,0.22)`, borderRadius:12, padding:'12px 14px', textAlign:'center' }}>
          <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:C.down, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:3 }}>Federal Estate Tax Exposure</div>
          <div style={{ fontFamily:MONO, fontSize:22, fontWeight:800, color:C.down }}>{fmt(estateTax)}</div>
          <div style={{ fontFamily:UI, fontSize:11, color:C.t3, marginTop:3 }}>40% on {fmt(taxable)} above exemption</div>
        </div>
      )}

      <div style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, padding:'14px', marginTop:12 }}>
        <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.gold, marginBottom:8 }}>2026 Key Numbers</div>
        {[
          ['Federal Estate Exemption', '$15,000,000'],
          ['Married (with portability)', '$30,000,000'],
          ['Estate & Gift Tax Rate', '40%'],
          ['Annual Gift Exclusion', '$19,000/recipient'],
          ['Lifetime Exemption Sunsets', '2030 (may revert to ~$7.5M)'],
        ].map(([l, v], i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom: i < 4 ? `1px solid ${C.b1}` : 'none' }}>
            <span style={{ fontFamily:UI, fontSize:11, color:C.t2 }}>{l}</span>
            <span style={{ fontFamily:MONO, fontSize:11, fontWeight:700, color:C.gold }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   CALCULATE — Gifting Strategy
════════════════════════════════════════════════════════════════ */
function CalcGifting() {
  const [recipients, setRecipients] = useState(3)
  const [years, setYears] = useState(5)

  const annualGift = 19000
  const totalAnnual = annualGift * recipients
  const totalOverYears = totalAnnual * years
  const taxSavedAt40 = totalOverYears * 0.40

  return (
    <div style={{ padding:'12px 16px 0' }}>
      <div style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, padding:'14px', marginBottom:12 }}>
        {[
          { l:'Number of Recipients', v:recipients, set:setRecipients, min:1, max:20, step:1, d:`${recipients}` },
          { l:'Years of Gifting', v:years, set:setYears, min:1, max:30, step:1, d:`${years} yrs` },
        ].map(({ l, v, set, min, max, step, d }) => (
          <div key={l} style={{ marginBottom:14 }}>
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
          { l:'Annual Gifting Total', v:fmt(totalAnnual), col:C.teal },
          { l:'Total Removed from Estate', v:fmt(totalOverYears), col:C.gold },
          { l:'Estate Tax Savings (40%)', v:fmt(taxSavedAt40), col:C.up },
          { l:'Per Gift', v:fmt(annualGift), col:C.t2 },
        ].map(({ l, v, col }) => (
          <div key={l} style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:10, padding:'10px 12px' }}>
            <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.t3, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>{l}</div>
            <div style={{ fontFamily:MONO, fontSize:14, fontWeight:700, color:col }}>{v}</div>
          </div>
        ))}
      </div>

      <MCard>
        <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.gold, marginBottom:8 }}>Advanced Estate Reduction Strategies</div>
        {[
          { name:'529 Superfunding', val:'$95,000 one-time', desc:'Front-load 5 years of gift exclusions into a 529 in one lump sum. Removed from estate immediately.' },
          { name:'ILIT', val:'Estate Tax Savings', desc:'Irrevocable Life Insurance Trust removes life insurance from taxable estate. Proceeds pass income- and estate-tax free.' },
          { name:'SLAT', val:'Couples Strategy', desc:'Spouse contributes assets to irrevocable trust for other spouse\'s benefit, removing from both estates.' },
          { name:'Charitable Remainder Trust (CRT)', val:'Income + Deduction', desc:'Receive income stream, take charitable deduction, and remove assets from taxable estate.' },
        ].map((s, i) => (
          <div key={i} style={{ paddingBottom:9, marginBottom:9, borderBottom: i < 3 ? `1px solid ${C.b1}` : 'none' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:3 }}>
              <span style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.t1 }}>{s.name}</span>
              <span style={{ fontFamily:MONO, fontSize:10, color:C.teal }}>{s.val}</span>
            </div>
            <p style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.6, margin:0 }}>{s.desc}</p>
          </div>
        ))}
      </MCard>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   RESOURCES TAB
════════════════════════════════════════════════════════════════ */
function TabResources() {
  return (
    <>
      <MSectionHeader label="Five Documents Everyone Needs" />
      <div style={{ padding:'0 16px' }}>
        <MCard style={{ padding:0, overflow:'hidden' }}>
          {[
            ['Last Will & Testament', 'Direct asset distribution and name guardians', C.down, 'Critical'],
            ['Durable Financial POA', 'Someone manages finances if incapacitated', C.down, 'Critical'],
            ['Healthcare POA', 'Someone makes medical decisions for you', C.down, 'Critical'],
            ['Healthcare Directive', 'Document your end-of-life treatment wishes', C.down, 'Critical'],
            ['Updated Beneficiaries', 'Review annually — overrides your will', C.warning, 'Review Annually'],
            ['Revocable Living Trust', 'Meaningful upgrade once assets warrant it', C.gold, 'Recommended'],
          ].map(([doc, desc, col, pri], i) => (
            <div key={i} style={{ padding:'11px 14px', borderBottom: i < 5 ? `1px solid ${C.b1}` : 'none' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div style={{ flex:1, marginRight:8 }}>
                  <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.t1, marginBottom:2 }}>{doc}</div>
                  <div style={{ fontFamily:UI, fontSize:11, color:C.t3 }}>{desc}</div>
                </div>
                <span style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:col, background:`${col}18`, border:`1px solid ${col}30`, borderRadius:6, padding:'2px 6px', flexShrink:0 }}>{pri}</span>
              </div>
            </div>
          ))}
        </MCard>
      </div>

      <MSectionHeader label="Probate — What It Is & How to Avoid It" />
      <div style={{ padding:'0 16px' }}>
        <MCard>
          {[
            { q:'What is probate?', a:'Court-supervised distribution of assets through a will. Public record, takes 6–24 months, costs 3–8% of estate value.' },
            { q:'How to avoid probate', a:'Funded revocable trust, joint tenancy with right of survivorship, TOD/POD designations, named beneficiaries on retirement and insurance accounts.' },
            { q:'What probate can\'t touch', a:'Assets with named beneficiaries (IRA, 401k, life insurance), joint tenancy property, and trust-held assets all bypass probate entirely.' },
          ].map(({ q, a }, i) => (
            <div key={i} style={{ paddingBottom:10, marginBottom:10, borderBottom: i < 2 ? `1px solid ${C.b1}` : 'none' }}>
              <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.gold, marginBottom:4 }}>{q}</div>
              <p style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65, margin:0 }}>{a}</p>
            </div>
          ))}
        </MCard>
      </div>

      <MSectionHeader label="Estate Planning Resources" />
      <div style={{ padding:'0 16px' }}>
        <MCard style={{ padding:0, overflow:'hidden' }}>
          {[
            { name:'Trust & Will', desc:'Online estate planning — wills, trusts, and healthcare directives' },
            { name:'Nolo', desc:'Self-help legal guides and document templates' },
            { name:'Find an Estate Attorney', desc:'Martindale-Hubbell directory of estate planning attorneys' },
            { name:'Find a CFP', desc:'CFP Board advisor search — estate planning specialists' },
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

      <MSectionHeader label="Step-Up in Basis — Critical Tax Concept" />
      <div style={{ padding:'0 16px 4px' }}>
        <MCard>
          <p style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65, margin:0 }}>
            When you inherit an asset, your cost basis is "stepped up" to the fair market value at the date of death — not what the deceased paid for it. This eliminates capital gains tax on a lifetime of appreciation. For example, if a parent bought stock for $10,000 and it's worth $200,000 at death, the heir's basis is $200,000 — selling immediately triggers zero capital gains tax.
          </p>
          <div style={{ background:`rgba(74,124,89,0.1)`, border:`1px solid rgba(74,124,89,0.22)`, borderRadius:8, padding:'8px 10px', marginTop:10 }}>
            <span style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.up }}>Implication: </span>
            <span style={{ fontFamily:UI, fontSize:11, color:C.t2 }}>Highly appreciated assets are often better to hold until death for the step-up in basis rather than gifting them while alive (gifts carry over the original cost basis).</span>
          </div>
        </MCard>
      </div>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════
   ROOT COMPONENT
════════════════════════════════════════════════════════════════ */
const LEARN_TABS = [['wills','Wills'],['trusts','Trusts'],['poa','Power of Attorney'],['directives','Directives']]
const CALC_TABS  = [['estate','Estate Tax'],['gifting','Gifting Strategy']]
const MAIN_TABS  = [['learn','Learn'],['calc','Calculate'],['resources','Resources']]

export default function MEstate() {
  const [mainTab, setMainTab] = useState('learn')
  const [learnSub, setLearnSub] = useState('wills')
  const [calcSub, setCalcSub]   = useState('estate')

  return (
    <div style={{ background:C.bg, minHeight:'100dvh', paddingBottom:88 }}>
      <ScreenHeader title="Estate Planning" subtitle="Learn" accent={C.gold} />

      {/* Key numbers banner */}
      <div style={{ padding:'12px 16px 0' }}>
        <div style={{ background:`linear-gradient(135deg, rgba(201,169,110,0.12) 0%, rgba(201,169,110,0.04) 100%)`, border:`1px solid ${C.goldBdr}`, borderRadius:16, padding:'14px 16px' }}>
          <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.gold, textTransform:'uppercase', letterSpacing:'0.14em', marginBottom:8 }}>2026 Key Numbers</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[['Federal Exemption','$15,000,000'],['Annual Gift Limit','$19,000/person'],['Estate/Gift Tax Rate','40%'],['Step-Up in Basis','At Death']].map(([l,v]) => (
              <div key={l}>
                <div style={{ fontFamily:UI, fontSize:9, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:2 }}>{l}</div>
                <div style={{ fontFamily:MONO, fontSize:13, fontWeight:700, color:C.gold }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main tabs */}
      <div style={{ display:'flex', borderBottom:`1px solid ${C.b2}`, background:C.bg, marginTop:12 }}>
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
          {learnSub === 'wills'      && <LearnWills />}
          {learnSub === 'trusts'     && <LearnTrusts />}
          {learnSub === 'poa'        && <LearnPOA />}
          {learnSub === 'directives' && <LearnDirectives />}
        </>
      )}

      {mainTab === 'calc' && (
        <>
          <PillTabs tabs={CALC_TABS} active={calcSub} onSelect={setCalcSub} />
          {calcSub === 'estate'   && <CalcEstateTax />}
          {calcSub === 'gifting'  && <CalcGifting />}
        </>
      )}

      {mainTab === 'resources' && <TabResources />}
    </div>
  )
}
