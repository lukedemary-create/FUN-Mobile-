import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ScrollText, ChevronRight, Info, CheckCircle2, XCircle,
  AlertCircle, BookOpen, Calculator, ExternalLink, ArrowRight,
  User, FileText, Heart, DollarSign, Shield,
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

function NumInput({ label, value, onChange, prefix='$', suffix, min=0, step=1000, hint }) {
  return (
    <div style={{ marginBottom:'1rem' }}>
      {label && <label style={{ display:'block', fontSize:'0.8125rem', fontWeight:600, color:NAVY, marginBottom:'0.375rem', fontFamily:"'DM Sans',sans-serif" }}>{label}</label>}
      <div style={{ position:'relative' }}>
        {prefix && <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#9ca3af', fontSize:'0.875rem', pointerEvents:'none' }}>{prefix}</span>}
        <input type="number" value={value} min={min} step={step} onChange={e => onChange(Number(e.target.value))}
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

/* ══════════════════════════════════════════════════════════════════
   LEARN — WILLS
══════════════════════════════════════════════════════════════════ */
function WillsLearn() {
  const types = [
    {
      name: 'Last Will & Testament',
      color: TEAL,
      badge: 'Most common',
      what: 'A legal document that states how you want your assets distributed after death, who raises your minor children (guardian), and who manages your estate (executor).',
      covers: ['Distribution of property and assets', 'Appointment of guardians for minor children', 'Naming an executor to carry out your wishes', 'Specific bequests (jewelry, heirlooms, etc.)'],
      doesnt: ['Avoid probate — wills go through court', 'Cover assets with named beneficiaries (retirement accounts, life insurance)', 'Take effect while you are alive'],
    },
    {
      name: 'Living Will (Advance Directive)',
      color: '#8b5cf6',
      badge: 'Different from a will',
      what: 'NOT about money. A living will tells doctors what medical treatment you want (or don\'t want) if you become incapacitated. It\'s about end-of-life healthcare decisions.',
      covers: ['Resuscitation preferences (DNR)', 'Life support and ventilator decisions', 'Feeding tube and hydration preferences', 'Organ and tissue donation wishes'],
      doesnt: ['Distribute property or assets', 'Name guardians for children', 'Have any effect after you recover or die'],
    },
  ];

  return (
    <div>
      <p style={{ margin:'0 0 1.25rem', fontSize:'0.9375rem', color:'#374151', lineHeight:1.75, fontFamily:"'DM Sans',sans-serif" }}>
        A will is the cornerstone of any estate plan. Without one, the state decides who gets your assets and who raises your children — a process called <strong>intestacy</strong>. Even a simple will gives you control.
      </p>

      <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:12, padding:'1rem 1.125rem', marginBottom:'1.25rem', display:'flex', gap:10 }}>
        <AlertCircle size={16} color='#ef4444' style={{ flexShrink:0, marginTop:2 }}/>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', color:'#374151', lineHeight:1.65 }}>
          <strong style={{ color:'#ef4444' }}>Dying intestate (without a will)</strong> means a probate court applies your state's default rules. Your assets may go to relatives you wouldn't choose, and a judge — not you — picks your children's guardian.
        </div>
      </div>

      <div style={{ display:'grid', gap:'1rem', marginBottom:'1.25rem' }}>
        {types.map(t => (
          <div key={t.name} style={{ border:`1.5px solid ${t.color}30`, borderRadius:12, padding:'1rem 1.125rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
              <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, color:NAVY, fontSize:'1rem' }}>{t.name}</span>
              <Pill text={t.badge} color={t.color}/>
            </div>
            <p style={{ margin:'0 0 0.75rem', fontSize:'0.8375rem', color:'#374151', lineHeight:1.65, fontFamily:"'DM Sans',sans-serif" }}>{t.what}</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.625rem', fontSize:'0.8rem', fontFamily:"'DM Sans',sans-serif" }}>
              <div>
                <div style={{ fontWeight:700, color:'#22c55e', marginBottom:4 }}>Covers</div>
                {t.covers.map(c => (
                  <div key={c} style={{ display:'flex', gap:6, alignItems:'flex-start', marginBottom:3, color:'#374151' }}>
                    <CheckCircle2 size={12} color='#22c55e' style={{ flexShrink:0, marginTop:2 }}/>{c}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontWeight:700, color:'#ef4444', marginBottom:4 }}>Does NOT cover</div>
                {t.doesnt.map(d => (
                  <div key={d} style={{ display:'flex', gap:6, alignItems:'flex-start', marginBottom:3, color:'#374151' }}>
                    <XCircle size={12} color='#ef4444' style={{ flexShrink:0, marginTop:2 }}/>{d}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <SectionCard title="Who Needs a Will Right Now?">
        {[
          { group:'Parents of minor children', urgency:'Immediately', color:'#ef4444', note:'If you die without naming a guardian, a judge decides who raises your children.' },
          { group:'Anyone who owns property', urgency:'High', color:'#f59e0b', note:'Real estate, vehicles, and bank accounts without named beneficiaries go through probate.' },
          { group:'Unmarried couples', urgency:'High', color:'#f59e0b', note:'Without a will, your partner receives nothing — the state gives assets to blood relatives.' },
          { group:'Anyone with specific wishes', urgency:'Moderate', color:TEAL, note:'Heirlooms, charitable gifts, or leaving someone out requires explicit instruction.' },
          { group:'Young singles with few assets', urgency:'Lower', color:'#6b7280', note:'Still valuable, but less urgent. At minimum name beneficiaries on accounts.' },
        ].map(row => (
          <div key={row.group} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'0.625rem 0', borderBottom:'1px solid #f3f4f6' }}>
            <span style={{ minWidth:90, fontFamily:"'DM Sans',sans-serif", fontSize:'0.75rem', fontWeight:700, color:row.color, paddingTop:1 }}>{row.urgency}</span>
            <div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', fontWeight:600, color:NAVY }}>{row.group}</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', color:'#6b7280', lineHeight:1.6 }}>{row.note}</div>
            </div>
          </div>
        ))}
        <InfoBox>A basic will can be created for $100–$300 through an attorney, or $20–$100 using reputable online services (Nolo, Trust & Will, LegalZoom). Free options exist through legal aid for qualifying individuals.</InfoBox>
      </SectionCard>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LEARN — TRUSTS
══════════════════════════════════════════════════════════════════ */
function TrustsLearn() {
  const types = [
    {
      name: 'Revocable Living Trust',
      color: TEAL,
      badge: 'Most common',
      summary: 'You transfer assets into the trust while alive, remain in full control, and can change or revoke it at any time. At death, assets pass directly to beneficiaries — no probate.',
      pros: ['Avoids probate — faster and private transfer of assets', 'Works across multiple states (important for real estate in different states)', 'Continues to manage assets if you become incapacitated', 'Can still include guardian designations via a pour-over will'],
      cons: ['More expensive to set up ($1,000–$3,000+ with attorney)', 'Must actually transfer assets into the trust ("funding") — often forgotten', 'No tax advantages — treated same as personal assets by the IRS'],
      best: 'Anyone with significant assets, property in multiple states, privacy concerns, or who wants to avoid the time and cost of probate.',
    },
    {
      name: 'Irrevocable Trust',
      color: '#f59e0b',
      badge: 'Advanced planning',
      summary: 'Once created, you give up control over the assets. In exchange, those assets are generally protected from creditors and removed from your taxable estate.',
      pros: ['Removes assets from your taxable estate (estate tax planning)', 'Asset protection from creditors and lawsuits', 'Can be used for Medicaid planning', 'Special needs trusts protect beneficiaries with disabilities'],
      cons: ['Cannot be changed or revoked — you give up ownership', 'Complex — requires an experienced estate planning attorney', 'Ongoing administration costs and tax filings'],
      best: 'High-net-worth individuals with estate tax concerns, those doing Medicaid planning, or parents of children with special needs.',
    },
  ];

  return (
    <div>
      <p style={{ margin:'0 0 1.25rem', fontSize:'0.9375rem', color:'#374151', lineHeight:1.75, fontFamily:"'DM Sans',sans-serif" }}>
        A trust is a legal arrangement where you (the <strong>grantor</strong>) transfer assets to a trustee to manage for your beneficiaries. Trusts offer more control, privacy, and flexibility than a will alone.
      </p>

      <div style={{ background:`${TEAL}0d`, border:`1px solid ${TEAL}25`, borderRadius:12, padding:'1rem 1.125rem', marginBottom:'1.25rem', fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', color:'#374151', lineHeight:1.65 }}>
        <strong style={{ color:NAVY }}>Will vs. Trust — The key difference:</strong> A will only takes effect <em>after</em> you die and must go through probate court. A trust takes effect <em>immediately</em>, works while you're alive, and passes assets at death without court involvement.
      </div>

      <div style={{ display:'grid', gap:'1rem', marginBottom:'1.25rem' }}>
        {types.map(t => (
          <div key={t.name} style={{ border:`1.5px solid ${t.color}30`, borderRadius:12, padding:'1.125rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
              <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, color:NAVY, fontSize:'1rem' }}>{t.name}</span>
              <Pill text={t.badge} color={t.color}/>
            </div>
            <p style={{ margin:'0 0 0.75rem', fontSize:'0.8375rem', color:'#374151', lineHeight:1.65, fontFamily:"'DM Sans',sans-serif" }}>{t.summary}</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.625rem', fontSize:'0.8rem', fontFamily:"'DM Sans',sans-serif", marginBottom:'0.75rem' }}>
              <div>
                <div style={{ fontWeight:700, color:'#22c55e', marginBottom:4 }}>Pros</div>
                {t.pros.map(p => (
                  <div key={p} style={{ display:'flex', gap:6, alignItems:'flex-start', marginBottom:3, color:'#374151' }}>
                    <CheckCircle2 size={12} color='#22c55e' style={{ flexShrink:0, marginTop:2 }}/>{p}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontWeight:700, color:'#ef4444', marginBottom:4 }}>Cons</div>
                {t.cons.map(c => (
                  <div key={c} style={{ display:'flex', gap:6, alignItems:'flex-start', marginBottom:3, color:'#374151' }}>
                    <XCircle size={12} color='#ef4444' style={{ flexShrink:0, marginTop:2 }}/>{c}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:`${t.color}0d`, border:`1px solid ${t.color}20`, borderRadius:8, padding:'0.5rem 0.75rem', fontSize:'0.8rem', color:'#374151', fontFamily:"'DM Sans',sans-serif" }}>
              <strong style={{ color:t.color }}>Best for: </strong>{t.best}
            </div>
          </div>
        ))}
      </div>

      <InfoBox>Most people with straightforward estates don't need a trust — a well-drafted will with proper beneficiary designations accomplishes the same goals. Consult an estate planning attorney if your estate exceeds $500K, you own property in multiple states, or you have complex family situations.</InfoBox>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LEARN — POWER OF ATTORNEY
══════════════════════════════════════════════════════════════════ */
function POALearn() {
  const types = [
    {
      name: 'Durable Financial POA',
      icon: DollarSign,
      color: TEAL,
      badge: 'Essential',
      what: 'Grants someone (your "agent") legal authority to manage your finances — pay bills, manage investments, file taxes, handle real estate — if you become incapacitated.',
      key: '"Durable" means it remains effective even if you lose mental capacity. A regular POA would automatically terminate at incapacity — exactly when you need it most.',
      warning: 'Choose your agent carefully. They have broad legal authority over your finances. Name a successor agent in case your first choice is unavailable.',
    },
    {
      name: 'Healthcare Power of Attorney',
      icon: Heart,
      color: '#ec4899',
      badge: 'Essential',
      what: 'Designates someone to make medical decisions on your behalf if you cannot communicate. Also called a healthcare proxy or healthcare agent.',
      key: 'Your agent speaks for you when doctors need consent for procedures, surgeries, or treatment decisions. They interpret your living will and fill in gaps it doesn\'t address.',
      warning: 'This is separate from your living will. The living will states your wishes; the healthcare POA names who enforces them.',
    },
    {
      name: 'Limited / Special POA',
      icon: FileText,
      color: '#6b7280',
      badge: 'Situational',
      what: 'Grants authority for a specific transaction or time period — for example, allowing someone to close on a real estate sale while you\'re traveling.',
      key: 'Automatically expires after the specified event or date. Does not continue through incapacity.',
      warning: null,
    },
  ];

  return (
    <div>
      <p style={{ margin:'0 0 1.25rem', fontSize:'0.9375rem', color:'#374151', lineHeight:1.75, fontFamily:"'DM Sans',sans-serif" }}>
        A Power of Attorney (POA) is a legal document that authorizes someone to act on your behalf. Unlike a will (which works after death), a POA is critical <strong>while you're alive but incapacitated</strong>.
      </p>

      <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:12, padding:'1rem 1.125rem', marginBottom:'1.25rem', display:'flex', gap:10 }}>
        <AlertCircle size={16} color='#ef4444' style={{ flexShrink:0, marginTop:2 }}/>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', color:'#374151', lineHeight:1.65 }}>
          <strong style={{ color:'#ef4444' }}>Without a POA:</strong> If you become incapacitated, your family may need to petition a court for <strong>guardianship or conservatorship</strong> — a costly, public, and time-consuming legal process — just to manage your finances or make medical decisions.
        </div>
      </div>

      <div style={{ display:'grid', gap:'1rem', marginBottom:'1.25rem' }}>
        {types.map(t => {
          const Icon = t.icon;
          return (
            <div key={t.name} style={{ border:`1.5px solid ${t.color}30`, borderRadius:12, padding:'1.125rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                <Icon size={16} color={t.color}/>
                <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, color:NAVY, fontSize:'1rem' }}>{t.name}</span>
                <Pill text={t.badge} color={t.color}/>
              </div>
              <p style={{ margin:'0 0 0.625rem', fontSize:'0.8375rem', color:'#374151', lineHeight:1.65, fontFamily:"'DM Sans',sans-serif" }}>{t.what}</p>
              <div style={{ background:`${t.color}0d`, border:`1px solid ${t.color}20`, borderRadius:8, padding:'0.5rem 0.75rem', fontSize:'0.8rem', color:'#374151', fontFamily:"'DM Sans',sans-serif", marginBottom: t.warning ? '0.5rem' : 0 }}>
                <strong style={{ color:t.color }}>Key point: </strong>{t.key}
              </div>
              {t.warning && (
                <div style={{ display:'flex', gap:8, padding:'0.5rem 0.75rem', background:'#fffbeb', border:'1px solid #fde68a', borderRadius:8, fontSize:'0.8rem', color:'#374151', fontFamily:"'DM Sans',sans-serif" }}>
                  <AlertCircle size={13} color='#f59e0b' style={{ flexShrink:0, marginTop:1 }}/>{t.warning}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <InfoBox>A financial and healthcare POA can typically be added to your estate plan for little additional cost when working with an attorney. Both documents should be signed, witnessed, and notarized according to your state's requirements.</InfoBox>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LEARN — HEALTHCARE DIRECTIVES
══════════════════════════════════════════════════════════════════ */
function DirectivesLearn() {
  const decisions = [
    { q:'CPR & Resuscitation', detail:'Do you want CPR attempted if your heart stops? A DNR (Do Not Resuscitate) order tells medical staff not to perform CPR.' },
    { q:'Mechanical Ventilation', detail:'If you cannot breathe on your own, do you want a ventilator to breathe for you? For how long?' },
    { q:'Artificial Nutrition & Hydration', detail:'If you cannot eat or drink, do you want feeding tubes or IV fluids to sustain you?' },
    { q:'Dialysis', detail:'If your kidneys fail, do you want dialysis to filter your blood?' },
    { q:'Comfort Care Only (Palliative)', detail:'Focusing only on pain management and dignity, without life-prolonging intervention.' },
    { q:'Organ & Tissue Donation', detail:'Your wishes for donation after death. Register with your state donor registry and note it in your directive.' },
  ];

  return (
    <div>
      <p style={{ margin:'0 0 1.25rem', fontSize:'0.9375rem', color:'#374151', lineHeight:1.75, fontFamily:"'DM Sans',sans-serif" }}>
        Healthcare directives are legal documents that communicate your medical wishes when you can't speak for yourself. They relieve your family of the burden of making these decisions during a crisis.
      </p>

      <SectionCard title="The Three Core Documents">
        {[
          { name:'Living Will / Advance Directive', color:TEAL, desc:'Written instructions to doctors about what treatments you do or don\'t want in specific end-of-life scenarios. Speaks for you directly.' },
          { name:'Healthcare Power of Attorney', color:'#ec4899', desc:'Names the person who makes medical decisions when you can\'t communicate. They interpret and apply your living will.' },
          { name:'POLST / MOLST Form', color:'#f59e0b', desc:'Physician Orders for Life-Sustaining Treatment. A medical order (not just a directive) that travels with you across care settings. For those with serious illness.' },
        ].map(d => (
          <div key={d.name} style={{ padding:'0.75rem 0', borderBottom:'1px solid #f3f4f6' }}>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', fontWeight:700, color:d.color, marginBottom:3 }}>{d.name}</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', color:'#374151', lineHeight:1.65 }}>{d.desc}</div>
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Decisions to Address in Your Directive">
        {decisions.map(d => (
          <div key={d.q} style={{ padding:'0.625rem 0', borderBottom:'1px solid #f3f4f6' }}>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', fontWeight:700, color:NAVY, marginBottom:2 }}>{d.q}</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', color:'#6b7280', lineHeight:1.65 }}>{d.detail}</div>
          </div>
        ))}
        <InfoBox color='#8b5cf6'>These conversations are hard but necessary. Tell your healthcare agent and family where your documents are stored. A directive no one can find doesn't help anyone.</InfoBox>
      </SectionCard>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LEARN — BENEFICIARIES
══════════════════════════════════════════════════════════════════ */
function BeneficiariesLearn() {
  const mistakes = [
    { mistake:'Not naming a beneficiary at all', impact:'Critical', color:'#ef4444', fix:'Assets go through probate, delays distribution by months or years, and may override your will.' },
    { mistake:'Naming your estate as beneficiary', impact:'Critical', color:'#ef4444', fix:'Forces retirement accounts and life insurance through probate, causing massive tax and delay problems.' },
    { mistake:'Naming a minor child directly', impact:'High', color:'#f59e0b', fix:'Courts appoint a guardian to control the funds until age 18 — they may spend it differently than you\'d want. Use a trust instead.' },
    { mistake:'Never updating after life changes', impact:'High', color:'#f59e0b', fix:'Ex-spouses, deceased relatives, or estranged family can still inherit if you don\'t update designations. Supersedes your will.' },
    { mistake:'No contingent (backup) beneficiary', impact:'Moderate', color:TEAL, fix:'If your primary beneficiary dies before you and there\'s no contingent, the asset goes through probate.' },
    { mistake:'Inconsistent designations across accounts', impact:'Moderate', color:TEAL, fix:'Different beneficiaries on different accounts leads to unintended outcomes. Audit all accounts together.' },
  ];

  return (
    <div>
      <p style={{ margin:'0 0 1rem', fontSize:'0.9375rem', color:'#374151', lineHeight:1.75, fontFamily:"'DM Sans',sans-serif" }}>
        Beneficiary designations <strong>override your will</strong>. It doesn't matter what your will says — whoever is named on your accounts, retirement plans, and life insurance receives those assets directly.
      </p>

      <SectionCard title="Assets Controlled by Beneficiary Designation">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem', marginBottom:'1rem' }}>
          {[
            '401(k), 403(b), 457 plans','Traditional & Roth IRAs',
            'Life insurance policies','Annuities',
            'Payable-on-Death (POD) bank accounts','Transfer-on-Death (TOD) investment accounts',
            'HSAs and FSAs','Pension survivor benefits',
          ].map(a => (
            <div key={a} style={{ display:'flex', gap:7, alignItems:'center', fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', color:'#374151' }}>
              <CheckCircle2 size={13} color={TEAL} style={{ flexShrink:0 }}/>{a}
            </div>
          ))}
        </div>
        <InfoBox>For most people, beneficiary designations control more wealth than their will. Review and update them after every major life event: marriage, divorce, birth of a child, or death of a named beneficiary.</InfoBox>
      </SectionCard>

      <SectionCard title="Common Beneficiary Mistakes">
        {mistakes.map(m => (
          <div key={m.mistake} style={{ padding:'0.75rem 0', borderBottom:'1px solid #f3f4f6' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.6875rem', fontWeight:700, color:m.color, background:`${m.color}15`, padding:'2px 8px', borderRadius:20, textTransform:'uppercase', letterSpacing:'0.04em' }}>{m.impact}</span>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', fontWeight:700, color:NAVY }}>{m.mistake}</span>
            </div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', color:'#6b7280', lineHeight:1.65, paddingLeft:2 }}>{m.fix}</div>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CALCULATOR — Estate Tax Threshold
══════════════════════════════════════════════════════════════════ */
function EstateTaxCalc() {
  const [assets, setAssets] = useState({
    home: 400000, retirement: 300000, brokerage: 100000,
    lifeInsurance: 500000, bankAccounts: 50000, other: 0,
  });
  const [debts, setDebts] = useState(300000);

  const totalAssets = Object.values(assets).reduce((s, v) => s + v, 0);
  const netEstate   = Math.max(0, totalAssets - debts);
  const FEDERAL_EXEMPTION = 15000000; // 2026 federal exemption
  const federalTaxable = Math.max(0, netEstate - FEDERAL_EXEMPTION);
  const federalTax = federalTaxable > 0 ? federalTaxable * 0.40 : 0;

  const pctOfExemption = Math.min(100, (netEstate / FEDERAL_EXEMPTION) * 100);

  return (
    <SectionCard title="Estate Size Estimator" subtitle="Estimate your gross estate and see where you stand relative to federal estate tax thresholds.">
      <div style={{ marginBottom:'1.25rem' }}>
        <div style={{ fontSize:'0.8125rem', fontWeight:700, color:NAVY, fontFamily:"'DM Sans',sans-serif", marginBottom:'0.75rem' }}>Assets</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 1.25rem' }}>
          <NumInput label="Primary Home / Real Estate" value={assets.home} onChange={v => setAssets(a => ({...a, home:v}))}/>
          <NumInput label="Retirement Accounts (401k, IRA)" value={assets.retirement} onChange={v => setAssets(a => ({...a, retirement:v}))}/>
          <NumInput label="Brokerage / Investment Accounts" value={assets.brokerage} onChange={v => setAssets(a => ({...a, brokerage:v}))}/>
          <NumInput label="Life Insurance Death Benefit" value={assets.lifeInsurance} onChange={v => setAssets(a => ({...a, lifeInsurance:v}))} hint="Included in estate unless held in an irrevocable trust"/>
          <NumInput label="Bank / Savings Accounts" value={assets.bankAccounts} onChange={v => setAssets(a => ({...a, bankAccounts:v}))}/>
          <NumInput label="Other Assets (business, vehicles, etc.)" value={assets.other} onChange={v => setAssets(a => ({...a, other:v}))}/>
        </div>
        <div style={{ fontSize:'0.8125rem', fontWeight:700, color:NAVY, fontFamily:"'DM Sans',sans-serif", margin:'0.5rem 0 0.75rem' }}>Debts & Liabilities</div>
        <NumInput label="Total Debts (mortgage, loans, etc.)" value={debts} onChange={setDebts}/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.75rem', marginBottom:'1.25rem' }}>
        <ResultBox label="Gross Estate" value={`$${(totalAssets/1e6).toFixed(2)}M`} color={TEAL}/>
        <ResultBox label="Net Estate" value={`$${(netEstate/1e6).toFixed(2)}M`} color={NAVY} size="lg"/>
        <ResultBox label="Federal Exemption" value="$15M" color='#6b7280'/>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom:'1.25rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'#6b7280', fontFamily:"'DM Sans',sans-serif", marginBottom:6 }}>
          <span>Your estate: {pctOfExemption.toFixed(1)}% of federal exemption</span>
          <span>$15M threshold</span>
        </div>
        <div style={{ background:'#f3f4f6', borderRadius:99, height:10, overflow:'hidden' }}>
          <div style={{ width:`${pctOfExemption}%`, background: pctOfExemption >= 90 ? '#ef4444' : pctOfExemption >= 60 ? '#f59e0b' : TEAL, height:'100%', borderRadius:99, transition:'width 0.3s' }}/>
        </div>
      </div>

      {federalTax > 0 ? (
        <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:12, padding:'1rem', fontFamily:"'DM Sans',sans-serif" }}>
          <div style={{ fontSize:'0.875rem', fontWeight:700, color:'#ef4444', marginBottom:4 }}>Potential Federal Estate Tax Exposure</div>
          <div style={{ fontSize:'1.5rem', fontWeight:700, color:'#ef4444', fontFamily:"'Playfair Display',serif" }}>${federalTax.toLocaleString()}</div>
          <div style={{ fontSize:'0.8125rem', color:'#374151', marginTop:4 }}>Consult an estate planning attorney. Strategies like irrevocable trusts, gifting, and charitable giving can reduce this.</div>
        </div>
      ) : (
        <div style={{ background:`${TEAL}0d`, border:`1px solid ${TEAL}25`, borderRadius:12, padding:'1rem', fontFamily:"'DM Sans',sans-serif" }}>
          <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
            <CheckCircle2 size={16} color={TEAL} style={{ flexShrink:0, marginTop:2 }}/>
            <div>
              <div style={{ fontSize:'0.875rem', fontWeight:700, color:NAVY, marginBottom:3 }}>Below Federal Estate Tax Threshold</div>
              <div style={{ fontSize:'0.8125rem', color:'#374151', lineHeight:1.65 }}>Your estimated estate is below the $15M federal exemption. Federal estate tax is not a concern at this size. Note: some states have lower thresholds — check your state's rules.</div>
            </div>
          </div>
        </div>
      )}

      <InfoBox color='#f59e0b'>The 2026 federal exemption is $15,000,000 per person ($30M for married couples with portability election). Gift tax annual exclusion is $19,000 per recipient. Note: some states have much lower exemptions — check your state's rules.</InfoBox>
    </SectionCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CALCULATOR — Estate Document Checklist
══════════════════════════════════════════════════════════════════ */
function DocumentChecklist() {
  const docs = [
    { id:'will', label:'Last Will & Testament', priority:'Essential', color:'#ef4444', detail:'Distributes assets, names guardian for minor children, appoints executor.' },
    { id:'poa_fin', label:'Durable Financial Power of Attorney', priority:'Essential', color:'#ef4444', detail:'Lets your agent manage finances if you become incapacitated.' },
    { id:'poa_hc', label:'Healthcare Power of Attorney', priority:'Essential', color:'#ef4444', detail:'Designates who makes medical decisions on your behalf.' },
    { id:'living_will', label:'Living Will / Advance Directive', priority:'Essential', color:'#ef4444', detail:'Documents your end-of-life medical treatment preferences.' },
    { id:'beneficiaries', label:'Beneficiary Designations Updated', priority:'Essential', color:'#ef4444', detail:'All accounts (IRA, 401k, insurance, bank) have current beneficiaries.' },
    { id:'trust', label:'Revocable Living Trust', priority:'Recommended 500k+', color:'#f59e0b', detail:'Avoids probate and manages assets during incapacity.' },
    { id:'hipaa', label:'HIPAA Authorization', priority:'Recommended', color:'#f59e0b', detail:'Allows healthcare providers to share medical info with designated people.' },
    { id:'letter', label:'Letter of Instruction', priority:'Helpful', color:TEAL, detail:'Non-legal document with account info, passwords, funeral wishes, and personal messages.' },
    { id:'digital', label:'Digital Asset Inventory', priority:'Helpful', color:TEAL, detail:'List of online accounts, passwords (in a password manager), crypto wallets, and access instructions.' },
  ];

  const [checked, setChecked] = useState({});
  const toggle = id => setChecked(c => ({ ...c, [id]: !c[id] }));
  const done = Object.values(checked).filter(Boolean).length;

  return (
    <SectionCard title="Estate Plan Document Checklist" subtitle="Track which documents you have in place.">
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:'1.25rem' }}>
        <div style={{ flex:1, background:'#f3f4f6', borderRadius:99, height:8, overflow:'hidden' }}>
          <div style={{ width:`${(done/docs.length)*100}%`, background:TEAL, height:'100%', borderRadius:99, transition:'width 0.3s' }}/>
        </div>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8125rem', fontWeight:700, color:NAVY, whiteSpace:'nowrap' }}>{done} / {docs.length}</span>
      </div>

      {docs.map(d => (
        <div key={d.id}
          onClick={() => toggle(d.id)}
          style={{ display:'flex', gap:12, padding:'0.75rem 0', borderBottom:'1px solid #f3f4f6', cursor:'pointer', alignItems:'flex-start' }}
        >
          <div style={{ width:20, height:20, borderRadius:6, border:`2px solid ${checked[d.id] ? TEAL : '#d1d5db'}`, background: checked[d.id] ? TEAL : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1, transition:'all 0.15s' }}>
            {checked[d.id] && <CheckCircle2 size={12} color='#fff'/>}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', fontWeight:600, color: checked[d.id] ? '#9ca3af' : NAVY, textDecoration: checked[d.id] ? 'line-through' : 'none' }}>{d.label}</span>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.6875rem', fontWeight:700, color:d.color, background:`${d.color}15`, padding:'1px 7px', borderRadius:20, textTransform:'uppercase', letterSpacing:'0.04em' }}>{d.priority}</span>
            </div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8rem', color:'#6b7280', lineHeight:1.55, marginTop:2 }}>{d.detail}</div>
          </div>
        </div>
      ))}
    </SectionCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
   RESOURCES
══════════════════════════════════════════════════════════════════ */
function ResourcesTab() {
  const resources = [
    {
      category: 'Free & Low-Cost Will Tools',
      color: TEAL,
      items: [
        { name:'Trust & Will', desc:'Online wills, trusts, and POA documents. State-specific. $39–$199.', url:'https://trustandwill.com' },
        { name:'Nolo WillMaker', desc:'Desktop/online software for wills, healthcare directives, and more. $99.', url:'https://www.nolo.com/products/willmaker-trust' },
        { name:'FreeWill', desc:'Truly free online will creation. Partnered with nonprofits. Simple estates.', url:'https://www.freewill.com' },
        { name:'LegalZoom', desc:'Online legal documents including wills and trusts. Attorney review available.', url:'https://www.legalzoom.com' },
      ],
    },
    {
      category: 'Healthcare Directives',
      color: '#ec4899',
      items: [
        { name:'Five Wishes', desc:'Nationally recognized advance directive covering medical, personal, and spiritual wishes.', url:'https://fivewishes.org' },
        { name:'CaringInfo (NHPCO)', desc:'Free state-specific advance directive forms for all 50 states.', url:'https://www.caringinfo.org/planning/advance-directives/' },
        { name:'Prepare for Your Care', desc:'Step-by-step guide to advance care planning with printable forms.', url:'https://www.prepareforyourcare.org' },
      ],
    },
    {
      category: 'Estate Planning Education',
      color: '#8b5cf6',
      items: [
        { name:'IRS Estate & Gift Tax', desc:'Official IRS guidance on estate tax rules, exemptions, and filing requirements.', url:'https://www.irs.gov/businesses/small-businesses-self-employed/estate-and-gift-taxes' },
        { name:'National Academy of Elder Law Attorneys', desc:'Find attorneys specializing in estate planning, elder law, and special needs trusts.', url:'https://www.naela.org' },
        { name:'Nolo Estate Planning Guide', desc:'Free articles on wills, trusts, probate, and estate planning strategies.', url:'https://www.nolo.com/legal-encyclopedia/estate-planning' },
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
      <SectionCard title="When to Hire an Attorney">
        {[
          'Estate exceeds $1M or may exceed future federal/state exemptions',
          'You own a business or have complex assets',
          'You have children with special needs requiring a special needs trust',
          'Blended family or complex beneficiary situations',
          'You own property in multiple states',
          'Significant charitable giving goals',
        ].map(r => (
          <div key={r} style={{ display:'flex', gap:8, alignItems:'flex-start', padding:'0.375rem 0', fontFamily:"'DM Sans',sans-serif", fontSize:'0.8375rem', color:'#374151' }}>
            <ArrowRight size={13} color={TEAL} style={{ flexShrink:0, marginTop:3 }}/>{r}
          </div>
        ))}
        <InfoBox>A comprehensive estate plan from an attorney typically costs $1,000–$3,000 for an individual or $1,500–$5,000 for a couple with trusts. It's a one-time cost that protects everything you've built.</InfoBox>
      </SectionCard>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN TABS CONFIG
══════════════════════════════════════════════════════════════════ */
const MAIN_TABS = [
  { id:'learn',       label:'Learn',       icon:BookOpen   },
  { id:'calculators', label:'Calculators', icon:Calculator },
  { id:'resources',   label:'Resources',   icon:ExternalLink },
];

const LEARN_TABS = [
  { id:'wills',        label:'Wills',                icon:ScrollText },
  { id:'trusts',       label:'Trusts',               icon:Shield     },
  { id:'poa',          label:'Power of Attorney',    icon:User       },
  { id:'directives',   label:'Healthcare Directives',icon:Heart      },
  { id:'beneficiaries',label:'Beneficiaries',        icon:FileText   },
];

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
export default function Estate() {
  const navigate  = useNavigate();
  const [tab,       setTab]      = useState('learn');
  const [learnTab,  setLearnTab] = useState('wills');

  const learnContent = {
    wills:         <WillsLearn/>,
    trusts:        <TrustsLearn/>,
    poa:           <POALearn/>,
    directives:    <DirectivesLearn/>,
    beneficiaries: <BeneficiariesLearn/>,
  };

  const learnTitles = {
    wills:         { title:'Wills',                sub:'What a will does, when you need one, and what happens without one.' },
    trusts:        { title:'Trusts',               sub:'Revocable and irrevocable trusts — when they make sense and when they don\'t.' },
    poa:           { title:'Power of Attorney',    sub:'Who manages your finances and makes medical decisions if you can\'t.' },
    directives:    { title:'Healthcare Directives',sub:'Document your end-of-life medical wishes so loved ones aren\'t left guessing.' },
    beneficiaries: { title:'Beneficiary Designations', sub:'The designations that override your will — and the costly mistakes people make.' },
  };

  return (
    <div style={{ minHeight:'100vh', background:BG, fontFamily:"'DM Sans',sans-serif" }}>

      {/* Header */}
      <div style={{ background:NAVY, padding:'2rem 2.5rem 0' }}>
        <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.35)', marginBottom:'1rem', display:'flex', alignItems:'center', gap:6 }}>
          <button onClick={() => navigate('/fun')} style={{ background:'none', border:'none', cursor:'pointer', color:TEAL, fontSize:'0.75rem', fontFamily:"'DM Sans',sans-serif", padding:0 }}>Dashboard</button>
          <ChevronRight size={12} color="rgba(255,255,255,0.25)"/>
          <span style={{ fontFamily:"'DM Sans',sans-serif" }}>Estate & Wills</span>
        </div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2rem', fontWeight:700, color:'#fff', margin:'0 0 0.5rem', letterSpacing:'-0.025em', lineHeight:1.2 }}>
          Estate Planning & Wills
        </h1>
        <p style={{ margin:'0 0 1.75rem', fontSize:'1rem', color:'rgba(255,255,255,0.55)', lineHeight:1.65, maxWidth:580, fontFamily:"'DM Sans',sans-serif" }}>
          Estate planning isn't just for the wealthy. It's about making sure your wishes are honored, your loved ones are protected, and your assets go exactly where you intend.
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

        {/* LEARN TAB */}
        {tab === 'learn' && (
          <>
            {/* Sub-tabs */}
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

            <SectionCard
              title={learnTitles[learnTab].title}
              subtitle={learnTitles[learnTab].sub}
            >
              {learnContent[learnTab]}
            </SectionCard>
          </>
        )}

        {/* CALCULATORS TAB */}
        {tab === 'calculators' && (
          <>
            <EstateTaxCalc/>
            <DocumentChecklist/>
          </>
        )}

        {/* RESOURCES TAB */}
        {tab === 'resources' && <ResourcesTab/>}

      </div>
    </div>
  );
}
