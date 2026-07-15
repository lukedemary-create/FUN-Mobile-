import { useState } from 'react'
import {
  ScrollText, Shield, User, Heart, FileText, Scale, Landmark,
  ChevronDown, ChevronRight, CheckCircle2, XCircle, AlertCircle,
  BookOpen, Calculator, ExternalLink, ArrowRight, Info, DollarSign,
} from 'lucide-react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader, MResultRow } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'

/* ── Palette shortcuts ────────────────────────────────────────── */
const GOLD   = C.gold
const GREEN  = '#4a7c59'
const RED    = '#c0392b'
const AMBER  = '#f59e0b'
const PURPLE = '#8b5cf6'
const PINK   = '#ec4899'

/* ── Shared primitives ────────────────────────────────────────── */
function InfoBox({ children, color = GOLD }) {
  return (
    <div style={{
      display: 'flex', gap: 10,
      padding: '10px 12px',
      background: color + '12',
      border: `1px solid ${color}30`,
      borderRadius: 10,
      marginTop: 10,
    }}>
      <Info size={13} color={color} style={{ flexShrink: 0, marginTop: 2 }} />
      <p style={{ margin: 0, fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.7 }}>{children}</p>
    </div>
  )
}

function WarnBox({ children }) {
  return (
    <div style={{
      display: 'flex', gap: 10,
      padding: '10px 12px',
      background: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: 10,
      marginBottom: 12,
    }}>
      <AlertCircle size={13} color={RED} style={{ flexShrink: 0, marginTop: 2 }} />
      <p style={{ margin: 0, fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.7 }}>{children}</p>
    </div>
  )
}

function Pill({ text, color = C.t3 }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 20,
      background: color + '18', color, fontFamily: UI,
      fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
    }}>{text}</span>
  )
}

function ProConList({ pros, cons }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
      <div>
        <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, color: GREEN, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pros</div>
        {pros.map(p => (
          <div key={p} style={{ display: 'flex', gap: 5, marginBottom: 4, alignItems: 'flex-start' }}>
            <CheckCircle2 size={11} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.55 }}>{p}</span>
          </div>
        ))}
      </div>
      <div>
        <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, color: RED, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cons</div>
        {cons.map(c => (
          <div key={c} style={{ display: 'flex', gap: 5, marginBottom: 4, alignItems: 'flex-start' }}>
            <XCircle size={11} color={RED} style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.55 }}>{c}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CoversList({ covers, doesnt }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
      <div>
        <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, color: GREEN, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Covers</div>
        {covers.map(c => (
          <div key={c} style={{ display: 'flex', gap: 5, marginBottom: 4, alignItems: 'flex-start' }}>
            <CheckCircle2 size={11} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.55 }}>{c}</span>
          </div>
        ))}
      </div>
      <div>
        <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, color: RED, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Does NOT cover</div>
        {doesnt.map(d => (
          <div key={d} style={{ display: 'flex', gap: 5, marginBottom: 4, alignItems: 'flex-start' }}>
            <XCircle size={11} color={RED} style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.55 }}>{d}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Accordion wrapper ────────────────────────────────────────── */
function Accordion({ icon: Icon, title, color = GOLD, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      background: C.surf,
      border: `1px solid ${open ? color + '40' : C.b2}`,
      borderRadius: 14,
      marginBottom: 8,
      overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 16px', background: 'none', border: 'none',
          cursor: 'pointer', textAlign: 'left', WebkitTapHighlightColor: 'transparent',
        }}
      >
        <span style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          background: color + '15', border: `1px solid ${color}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={15} color={color} />
        </span>
        <span style={{ fontFamily: UI, fontSize: 14, fontWeight: 700, color: C.t1, flex: 1 }}>{title}</span>
        {open
          ? <ChevronDown size={16} color={C.t3} />
          : <ChevronRight size={16} color={C.t3} />}
      </button>
      {open && (
        <div style={{ padding: '0 16px 16px' }}>
          {children}
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   LEARN SECTIONS
══════════════════════════════════════════════════════════════ */

function WillsContent() {
  return (
    <>
      <p style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.75, margin: '0 0 12px' }}>
        A will is the cornerstone of any estate plan. Without one, the state decides who gets your assets and who raises your children — a process called <strong>intestacy</strong>.
      </p>

      <WarnBox>
        <strong style={{ color: RED }}>Dying intestate (without a will)</strong> means a probate court applies your state's default rules. Your assets may go to relatives you wouldn't choose, and a judge picks your children's guardian.
      </WarnBox>

      {/* Last Will */}
      <div style={{ border: `1.5px solid ${C.teal}30`, borderRadius: 12, padding: '12px 14px', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, color: C.t1, fontSize: 14 }}>Last Will &amp; Testament</span>
          <Pill text="Most common" color={C.teal} />
        </div>
        <p style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65, margin: '0 0 8px' }}>
          A legal document that states how you want your assets distributed after death, who raises your minor children, and who manages your estate (executor).
        </p>
        <CoversList
          covers={['Distribution of property and assets', 'Appointment of guardians for minor children', 'Naming an executor', 'Specific bequests (heirlooms, etc.)']}
          doesnt={['Avoid probate — wills go through court', 'Cover accounts with named beneficiaries', 'Take effect while you are alive']}
        />
      </div>

      {/* Living Will */}
      <div style={{ border: `1.5px solid ${PURPLE}30`, borderRadius: 12, padding: '12px 14px', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, color: C.t1, fontSize: 14 }}>Living Will (Advance Directive)</span>
          <Pill text="Different from a will" color={PURPLE} />
        </div>
        <p style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65, margin: '0 0 8px' }}>
          NOT about money. Tells doctors what medical treatment you want if you become incapacitated. It's about end-of-life healthcare decisions.
        </p>
        <CoversList
          covers={['Resuscitation preferences (DNR)', 'Life support / ventilator decisions', 'Feeding tube preferences', 'Organ donation wishes']}
          doesnt={['Distribute property or assets', 'Name guardians for children', 'Have effect after you recover or die']}
        />
      </div>

      {/* Who needs a will */}
      <div style={{ background: C.raise, border: `1px solid ${C.b1}`, borderRadius: 12, padding: '12px 14px' }}>
        <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Who Needs a Will Right Now?</div>
        {[
          { group: 'Parents of minor children', urgency: 'Immediately', color: RED, note: 'If you die without naming a guardian, a judge decides who raises your children.' },
          { group: 'Anyone who owns property', urgency: 'High', color: AMBER, note: 'Real estate, vehicles, and accounts without beneficiaries go through probate.' },
          { group: 'Unmarried couples', urgency: 'High', color: AMBER, note: 'Without a will, your partner receives nothing — state gives assets to blood relatives.' },
          { group: 'Anyone with specific wishes', urgency: 'Moderate', color: GOLD, note: 'Heirlooms, charitable gifts, or leaving someone out requires explicit instruction.' },
          { group: 'Young singles / few assets', urgency: 'Lower', color: C.t3, note: 'Still valuable, but less urgent. At minimum, name beneficiaries on accounts.' },
        ].map(row => (
          <div key={row.group} style={{ padding: '8px 0', borderBottom: `1px solid ${C.b1}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <span style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: row.color, background: row.color + '18', padding: '1px 7px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0 }}>{row.urgency}</span>
              <span style={{ fontFamily: UI, fontSize: 13, fontWeight: 600, color: C.t1 }}>{row.group}</span>
            </div>
            <p style={{ fontFamily: UI, fontSize: 12, color: C.t3, lineHeight: 1.55, margin: '0 0 0 2px' }}>{row.note}</p>
          </div>
        ))}
        <InfoBox>A basic will can be created for $100–$300 through an attorney, or $20–$100 using reputable online services (Trust &amp; Will, LegalZoom). Free options exist through legal aid for qualifying individuals.</InfoBox>
      </div>
    </>
  )
}

function TrustsContent() {
  const types = [
    {
      name: 'Revocable Living Trust',
      color: C.teal,
      badge: 'Most common',
      summary: 'You transfer assets into the trust while alive, remain in full control, and can change or revoke it at any time. At death, assets pass directly to beneficiaries — no probate.',
      pros: ['Avoids probate — faster and private', 'Works across multiple states', 'Continues to manage assets if you become incapacitated', 'Can include guardian designations via a pour-over will'],
      cons: ['More expensive to set up ($1,000–$3,000+)', 'Must actually transfer assets ("funding") — often forgotten', 'No tax advantages — treated same as personal assets by IRS'],
      best: 'Anyone with significant assets, property in multiple states, privacy concerns, or who wants to avoid the time and cost of probate.',
    },
    {
      name: 'Irrevocable Trust',
      color: AMBER,
      badge: 'Advanced planning',
      summary: 'Once created, you give up control over the assets. In exchange, assets are generally protected from creditors and removed from your taxable estate.',
      pros: ['Removes assets from your taxable estate', 'Asset protection from creditors and lawsuits', 'Can be used for Medicaid planning', 'Special needs trusts protect beneficiaries with disabilities'],
      cons: ['Cannot be changed or revoked — you give up ownership', 'Complex — requires an experienced estate attorney', 'Ongoing administration costs and tax filings'],
      best: 'High-net-worth individuals with estate tax concerns, those doing Medicaid planning, or parents of children with special needs.',
    },
  ]

  return (
    <>
      <p style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.75, margin: '0 0 12px' }}>
        A trust is a legal arrangement where you (the <strong>grantor</strong>) transfer assets to a trustee to manage for your beneficiaries. Trusts offer more control, privacy, and flexibility than a will alone.
      </p>

      <InfoBox color={C.teal}>
        <strong>Will vs. Trust:</strong> A will only takes effect <em>after</em> you die and must go through probate court. A trust takes effect <em>immediately</em>, works while you're alive, and passes assets at death without court involvement.
      </InfoBox>

      <div style={{ marginTop: 12 }}>
        {types.map(t => (
          <div key={t.name} style={{ border: `1.5px solid ${t.color}30`, borderRadius: 12, padding: '12px 14px', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: DISPLAY, fontWeight: 700, color: C.t1, fontSize: 14 }}>{t.name}</span>
              <Pill text={t.badge} color={t.color} />
            </div>
            <p style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65, margin: '0 0 8px' }}>{t.summary}</p>
            <ProConList pros={t.pros} cons={t.cons} />
            <div style={{ background: t.color + '12', border: `1px solid ${t.color}25`, borderRadius: 8, padding: '8px 10px', marginTop: 10 }}>
              <span style={{ fontFamily: UI, fontSize: 12, color: t.color, fontWeight: 700 }}>Best for: </span>
              <span style={{ fontFamily: UI, fontSize: 12, color: C.t2 }}>{t.best}</span>
            </div>
          </div>
        ))}
      </div>

      <InfoBox>Most people with straightforward estates don't need a trust — a well-drafted will with proper beneficiary designations accomplishes the same goals. Consult an estate planning attorney if your estate exceeds $500K, you own property in multiple states, or you have complex family situations.</InfoBox>
    </>
  )
}

function POAContent() {
  const types = [
    {
      name: 'Durable Financial POA',
      icon: DollarSign,
      color: GOLD,
      badge: 'Essential',
      what: 'Grants someone legal authority to manage your finances — pay bills, manage investments, file taxes, handle real estate — if you become incapacitated.',
      key: '"Durable" means it remains effective even if you lose mental capacity. A regular POA would automatically terminate at incapacity — exactly when you need it most.',
      warning: 'Choose your agent carefully. They have broad legal authority over your finances. Name a successor agent in case your first choice is unavailable.',
    },
    {
      name: 'Healthcare Power of Attorney',
      icon: Heart,
      color: PINK,
      badge: 'Essential',
      what: 'Designates someone to make medical decisions on your behalf if you cannot communicate. Also called a healthcare proxy or healthcare agent.',
      key: 'Your agent speaks for you when doctors need consent for procedures or treatment decisions. They interpret your living will and fill in gaps it doesn\'t address.',
      warning: 'This is separate from your living will. The living will states your wishes; the healthcare POA names who enforces them.',
    },
    {
      name: 'Limited / Special POA',
      icon: FileText,
      color: C.t3,
      badge: 'Situational',
      what: 'Grants authority for a specific transaction or time period — for example, closing on a real estate sale while you\'re traveling.',
      key: 'Automatically expires after the specified event or date. Does not continue through incapacity.',
      warning: null,
    },
  ]

  return (
    <>
      <p style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.75, margin: '0 0 12px' }}>
        A Power of Attorney (POA) authorizes someone to act on your behalf. Unlike a will (which works after death), a POA is critical <strong>while you're alive but incapacitated</strong>.
      </p>

      <WarnBox>
        <strong style={{ color: RED }}>Without a POA:</strong> If you become incapacitated, your family may need to petition a court for <strong>guardianship or conservatorship</strong> — a costly, public, and time-consuming legal process — just to manage your finances or make medical decisions.
      </WarnBox>

      {types.map(t => {
        const Icon = t.icon
        return (
          <div key={t.name} style={{ border: `1.5px solid ${t.color}30`, borderRadius: 12, padding: '12px 14px', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
              <Icon size={14} color={t.color} />
              <span style={{ fontFamily: DISPLAY, fontWeight: 700, color: C.t1, fontSize: 14 }}>{t.name}</span>
              <Pill text={t.badge} color={t.color} />
            </div>
            <p style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65, margin: '0 0 8px' }}>{t.what}</p>
            <div style={{ background: t.color + '12', border: `1px solid ${t.color}25`, borderRadius: 8, padding: '8px 10px', marginBottom: t.warning ? 8 : 0 }}>
              <span style={{ fontFamily: UI, fontSize: 12, color: t.color, fontWeight: 700 }}>Key point: </span>
              <span style={{ fontFamily: UI, fontSize: 12, color: C.t2 }}>{t.key}</span>
            </div>
            {t.warning && (
              <div style={{ display: 'flex', gap: 8, padding: '8px 10px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8 }}>
                <AlertCircle size={12} color={AMBER} style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontFamily: UI, fontSize: 12, color: C.t2 }}>{t.warning}</span>
              </div>
            )}
          </div>
        )
      })}

      <InfoBox>A financial and healthcare POA can typically be added to your estate plan for little additional cost when working with an attorney. Both documents should be signed, witnessed, and notarized according to your state's requirements.</InfoBox>
    </>
  )
}

function DirectivesContent() {
  const decisions = [
    { q: 'CPR & Resuscitation', detail: 'Do you want CPR attempted if your heart stops? A DNR (Do Not Resuscitate) order tells medical staff not to perform CPR.' },
    { q: 'Mechanical Ventilation', detail: 'If you cannot breathe on your own, do you want a ventilator to breathe for you? For how long?' },
    { q: 'Artificial Nutrition & Hydration', detail: 'If you cannot eat or drink, do you want feeding tubes or IV fluids to sustain you?' },
    { q: 'Dialysis', detail: 'If your kidneys fail, do you want dialysis to filter your blood?' },
    { q: 'Comfort Care Only (Palliative)', detail: 'Focusing only on pain management and dignity, without life-prolonging intervention.' },
    { q: 'Organ & Tissue Donation', detail: 'Your wishes for donation after death. Register with your state donor registry and note it in your directive.' },
  ]

  return (
    <>
      <p style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.75, margin: '0 0 12px' }}>
        Healthcare directives communicate your medical wishes when you can't speak for yourself. They relieve your family of the burden of making these decisions during a crisis.
      </p>

      <div style={{ background: C.raise, border: `1px solid ${C.b1}`, borderRadius: 12, padding: '12px 14px', marginBottom: 12 }}>
        <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>The Three Core Documents</div>
        {[
          { name: 'Living Will / Advance Directive', color: C.teal, desc: 'Written instructions to doctors about what treatments you do or don\'t want in end-of-life scenarios.' },
          { name: 'Healthcare Power of Attorney', color: PINK, desc: 'Names the person who makes medical decisions when you can\'t communicate. They interpret and apply your living will.' },
          { name: 'POLST / MOLST Form', color: AMBER, desc: 'Physician Orders for Life-Sustaining Treatment — a medical order (not just a directive) that travels with you across care settings. For those with serious illness.' },
        ].map(d => (
          <div key={d.name} style={{ padding: '8px 0', borderBottom: `1px solid ${C.b1}` }}>
            <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: d.color, marginBottom: 3 }}>{d.name}</div>
            <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.6 }}>{d.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 12, padding: '12px 14px' }}>
        <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Decisions to Address in Your Directive</div>
        {decisions.map(d => (
          <div key={d.q} style={{ padding: '8px 0', borderBottom: `1px solid ${C.b1}` }}>
            <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 2 }}>{d.q}</div>
            <div style={{ fontFamily: UI, fontSize: 12, color: C.t3, lineHeight: 1.6 }}>{d.detail}</div>
          </div>
        ))}
        <InfoBox color={PURPLE}>These conversations are hard but necessary. Tell your healthcare agent and family where your documents are stored. A directive no one can find doesn't help anyone.</InfoBox>
      </div>
    </>
  )
}

function BeneficiariesContent() {
  const mistakes = [
    { mistake: 'Not naming a beneficiary at all', impact: 'Critical', color: RED, fix: 'Assets go through probate, delaying distribution by months or years, and may override your will.' },
    { mistake: 'Naming your estate as beneficiary', impact: 'Critical', color: RED, fix: 'Forces retirement accounts and life insurance through probate, causing massive tax and delay problems.' },
    { mistake: 'Naming a minor child directly', impact: 'High', color: AMBER, fix: 'Courts appoint a guardian to control the funds until age 18. Use a trust instead.' },
    { mistake: 'Never updating after life changes', impact: 'High', color: AMBER, fix: 'Ex-spouses, deceased relatives, or estranged family can still inherit. Beneficiary designations supersede your will.' },
    { mistake: 'No contingent (backup) beneficiary', impact: 'Moderate', color: GOLD, fix: 'If your primary beneficiary dies before you and there\'s no contingent, the asset goes through probate.' },
    { mistake: 'Inconsistent designations across accounts', impact: 'Moderate', color: GOLD, fix: 'Different beneficiaries on different accounts leads to unintended outcomes. Audit all accounts together.' },
  ]

  return (
    <>
      <div style={{ background: RED + '10', border: `1px solid ${RED}25`, borderRadius: 12, padding: '12px 14px', marginBottom: 12 }}>
        <p style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.7, margin: 0 }}>
          Beneficiary designations <strong style={{ color: C.t1 }}>override your will</strong>. It doesn't matter what your will says — whoever is named on your accounts, retirement plans, and life insurance receives those assets directly.
        </p>
      </div>

      <div style={{ background: C.raise, border: `1px solid ${C.b1}`, borderRadius: 12, padding: '12px 14px', marginBottom: 12 }}>
        <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Assets Controlled by Beneficiary Designation</div>
        {[
          '401(k), 403(b), 457 plans', 'Traditional & Roth IRAs',
          'Life insurance policies', 'Annuities',
          'Payable-on-Death (POD) bank accounts', 'Transfer-on-Death (TOD) investment accounts',
          'HSAs and FSAs', 'Pension survivor benefits',
        ].map(a => (
          <div key={a} style={{ display: 'flex', gap: 7, alignItems: 'center', marginBottom: 5 }}>
            <CheckCircle2 size={12} color={GOLD} style={{ flexShrink: 0 }} />
            <span style={{ fontFamily: UI, fontSize: 12, color: C.t2 }}>{a}</span>
          </div>
        ))}
        <InfoBox>For most people, beneficiary designations control more wealth than their will. Review and update after every major life event: marriage, divorce, birth of a child, or death of a named beneficiary.</InfoBox>
      </div>

      <div style={{ background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 12, padding: '12px 14px' }}>
        <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Common Beneficiary Mistakes</div>
        {mistakes.map(m => (
          <div key={m.mistake} style={{ padding: '8px 0', borderBottom: `1px solid ${C.b1}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: m.color, background: m.color + '18', padding: '1px 7px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.impact}</span>
              <span style={{ fontFamily: UI, fontSize: 13, fontWeight: 600, color: C.t1 }}>{m.mistake}</span>
            </div>
            <div style={{ fontFamily: UI, fontSize: 12, color: C.t3, lineHeight: 1.6 }}>{m.fix}</div>
          </div>
        ))}
      </div>
    </>
  )
}

function ProbateContent() {
  const goesThrough = [
    'Assets in your name alone with no beneficiary designation',
    'Bank accounts without a TOD (Transfer on Death) designation',
    'Solely-owned real estate not held in a trust',
    'Vehicles and personal property (furniture, jewelry, collectibles)',
    'Business interests owned individually',
  ]

  const avoidMethods = [
    { method: 'Beneficiary designations', how: '401(k), IRA, and life insurance pass directly to named beneficiaries — completely bypassing probate.', color: GREEN },
    { method: 'Joint ownership (JTWROS)', how: 'Joint Tenants with Right of Survivorship — the surviving owner inherits automatically at death, no court needed.', color: C.teal },
    { method: 'TOD / POD designations', how: 'Add Transfer on Death to brokerage accounts and Payable on Death to bank accounts through your institution.', color: PURPLE },
    { method: 'Revocable living trust', how: 'Assets held in a funded trust skip probate entirely — the trustee distributes directly to beneficiaries.', color: AMBER },
  ]

  return (
    <>
      <p style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.75, margin: '0 0 12px' }}>
        Probate is the court-supervised process of validating your will and distributing your estate. It is <strong>public, slow, and expensive</strong> — typically 6–18 months and 2–5% of your estate value in legal and court fees.
      </p>

      <WarnBox>
        <strong style={{ color: RED }}>Probate is public record.</strong> Anyone can look up your will, see what you owned, who your beneficiaries are, and what debts you had. A revocable living trust avoids this entirely — trust distributions are completely private.
      </WarnBox>

      <div style={{ background: C.raise, border: `1px solid ${C.b1}`, borderRadius: 12, padding: '12px 14px', marginBottom: 12 }}>
        <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>What Goes Through Probate</div>
        <p style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65, margin: '0 0 10px' }}>
          Only assets solely in your name with no designated beneficiary and not held in a trust require probate.
        </p>
        {goesThrough.map(item => (
          <div key={item} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
            <AlertCircle size={12} color={RED} style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontFamily: UI, fontSize: 12, color: C.t2 }}>{item}</span>
          </div>
        ))}
        <InfoBox>The good news: most assets people care most about — retirement accounts, life insurance, jointly held property — already avoid probate through beneficiary designations and titling. Probate mostly catches assets people forgot to plan for.</InfoBox>
      </div>

      <div style={{ background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 12, padding: '12px 14px', marginBottom: 12 }}>
        <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Four Ways to Avoid Probate</div>
        {avoidMethods.map(m => (
          <div key={m.method} style={{ padding: '8px 0', borderBottom: `1px solid ${C.b1}` }}>
            <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: m.color, marginBottom: 3 }}>{m.method}</div>
            <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.6 }}>{m.how}</div>
          </div>
        ))}
      </div>

      <div style={{ background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 12, padding: '12px 14px' }}>
        <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Small Estate Shortcuts</div>
        <p style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65, margin: '0 0 10px' }}>
          Most states have simplified probate procedures for small estates (typically under $100K–$200K). These "summary administration" processes take weeks instead of a year.
        </p>
        {[
          { label: 'California', detail: 'Estates under $184,500 can use a simplified affidavit procedure 40 days after death.' },
          { label: 'Texas', detail: 'Estates under $75,000 can use a small estate affidavit. Texas also has relatively simple full probate.' },
          { label: 'Florida', detail: 'Estates under $75,000 (summary administration) or insolvent estates have a simplified process.' },
          { label: 'Your state', detail: 'Search "[your state] small estate affidavit" to find your state\'s threshold and procedure.' },
        ].map(r => (
          <div key={r.label} style={{ display: 'flex', gap: 10, padding: '6px 0', borderBottom: `1px solid ${C.b1}` }}>
            <span style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1, minWidth: 80 }}>{r.label}</span>
            <span style={{ fontFamily: UI, fontSize: 12, color: C.t3, lineHeight: 1.55 }}>{r.detail}</span>
          </div>
        ))}
        <InfoBox color={AMBER}>If your estate is modest and straightforward, good beneficiary hygiene on all your accounts may be all you need. A living trust isn't always necessary.</InfoBox>
      </div>
    </>
  )
}

function EstateTaxContent() {
  const stateTaxStates = [
    { state: 'Massachusetts / Oregon', exemption: '$1M', note: 'Lowest thresholds in the US.' },
    { state: 'Washington', exemption: '$2.19M', note: 'Progressive rate up to 20%.' },
    { state: 'Minnesota', exemption: '$3M', note: 'Tax on estates above $3M.' },
    { state: 'Illinois', exemption: '$4M', note: 'Graduated rates up to 16%.' },
    { state: 'New York', exemption: '$6.94M', note: 'Cliff tax: if estate exceeds 105% of exemption, entire estate is taxable.' },
    { state: 'Connecticut', exemption: '$13.61M', note: 'Matches near the federal exemption.' },
  ]

  return (
    <>
      <p style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.75, margin: '0 0 12px' }}>
        The federal estate tax applies only to estates above the exemption threshold — and very few estates qualify. Less than 0.2% of estates owe federal estate tax.
      </p>

      {/* 2026 stats */}
      <div style={{ background: C.raise, border: `1px solid ${C.b1}`, borderRadius: 12, padding: '12px 14px', marginBottom: 12 }}>
        <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Federal Estate Tax — 2026 Numbers</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
          {[
            { label: 'Federal Exemption', value: '$15M', sub: 'Per person', color: GOLD },
            { label: 'Married Couple', value: '$30M', sub: 'With portability election', color: GREEN },
            { label: 'Tax Rate', value: '40%', sub: 'On excess above exemption', color: RED },
          ].map(s => (
            <div key={s.label} style={{ background: s.color + '12', border: `1px solid ${s.color}25`, borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
              <div style={{ fontFamily: MONO, fontSize: 16, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: UI, fontSize: 9, color: C.t3, marginTop: 3, lineHeight: 1.3 }}>{s.sub}</div>
              <div style={{ fontFamily: UI, fontSize: 9, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ background: GOLD + '10', border: `1px solid ${GOLD}25`, borderRadius: 9, padding: '9px 12px' }}>
          <p style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65, margin: 0 }}>
            <strong style={{ color: C.t1 }}>The reality for most people:</strong> If your net worth is under $10M, federal estate tax is not your primary concern. Focus instead on income tax planning for your heirs.
          </p>
        </div>
      </div>

      {/* Income taxes for heirs */}
      <div style={{ background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 12, padding: '12px 14px', marginBottom: 12 }}>
        <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>What Your Heirs Will Actually Pay — Income Taxes</div>
        {[
          {
            title: 'Inherited IRAs — The 10-Year Rule (SECURE 2.0)',
            color: RED,
            desc: 'Non-spouse beneficiaries must empty the entire account within 10 years. Every dollar they withdraw is taxed as ordinary income. A $1M inherited IRA could generate $350K+ in taxes for your heirs.',
          },
          {
            title: 'Step-Up in Basis — Your Most Powerful Gift',
            color: GREEN,
            desc: 'When heirs inherit appreciated assets (stocks, real estate) held in a taxable brokerage or real estate — not an IRA — they get a new cost basis at the date of your death. They pay zero capital gains tax on all pre-death appreciation.',
          },
          {
            title: 'Roth Conversion Strategy',
            color: GOLD,
            desc: 'Converting traditional IRA funds to Roth before death means your heirs inherit tax-free money. Even though they still must empty the Roth within 10 years, all growth and withdrawals are tax-free.',
          },
        ].map(item => (
          <div key={item.title} style={{ padding: '8px 0', borderBottom: `1px solid ${C.b1}` }}>
            <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: item.color, marginBottom: 3 }}>{item.title}</div>
            <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.6 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      {/* State estate taxes */}
      <div style={{ background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 12, padding: '12px 14px' }}>
        <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>State Estate Taxes</div>
        <p style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65, margin: '0 0 10px' }}>
          12 states + D.C. have their own estate taxes with exemptions far below the federal level.
        </p>
        {stateTaxStates.map(r => (
          <div key={r.state} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 8, padding: '6px 0', borderBottom: `1px solid ${C.b1}` }}>
            <div>
              <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1 }}>{r.state}</div>
              <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, lineHeight: 1.45 }}>{r.note}</div>
            </div>
            <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: GOLD, textAlign: 'right', alignSelf: 'center' }}>{r.exemption}</div>
          </div>
        ))}
        <InfoBox color={AMBER}>Annual gift tax exclusion: $19,000 per recipient in 2026. A couple can give $38,000 per recipient per year — tax-free and it reduces your taxable estate.</InfoBox>
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════════════════════
   TOOLS TAB
══════════════════════════════════════════════════════════════ */

function EstateTaxEstimator() {
  const [assets, setAssets] = useState({
    home: 400000, retirement: 300000, brokerage: 100000,
    lifeInsurance: 500000, bankAccounts: 50000, other: 0,
  })
  const [debts, setDebts] = useState(300000)

  const totalAssets = Object.values(assets).reduce((s, v) => s + v, 0)
  const netEstate = Math.max(0, totalAssets - debts)
  const FEDERAL_EXEMPTION = 15000000
  const federalTaxable = Math.max(0, netEstate - FEDERAL_EXEMPTION)
  const federalTax = federalTaxable > 0 ? federalTaxable * 0.40 : 0
  const pctOfExemption = Math.min(100, (netEstate / FEDERAL_EXEMPTION) * 100)
  const fmt = v => '$' + Math.round(v).toLocaleString()
  const fmtM = v => '$' + (v / 1e6).toFixed(2) + 'M'

  const AssetInput = ({ label: lbl, field }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{lbl}</div>
      <div style={{ display: 'flex', alignItems: 'center', background: C.bg, border: `1px solid ${C.b2}`, borderRadius: 9, padding: '0 12px' }}>
        <span style={{ fontFamily: UI, fontSize: 13, color: C.t3, marginRight: 4 }}>$</span>
        <input
          type="number"
          value={field === 'debts' ? debts : assets[field]}
          min={0}
          step={10000}
          onChange={e => {
            const v = Number(e.target.value)
            if (field === 'debts') setDebts(v)
            else setAssets(a => ({ ...a, [field]: v }))
          }}
          style={{
            flex: 1, background: 'none', border: 'none', outline: 'none',
            fontFamily: MONO, fontSize: 14, color: C.t1, fontWeight: 600, padding: '10px 0',
          }}
        />
      </div>
    </div>
  )

  return (
    <MCard>
      <div style={{ fontFamily: DISPLAY, fontSize: 15, fontWeight: 700, color: C.t1, marginBottom: 4 }}>Estate Size Estimator</div>
      <div style={{ fontFamily: UI, fontSize: 12, color: C.t3, marginBottom: 14, lineHeight: 1.5 }}>Estimate your gross estate and see where you stand relative to the federal estate tax threshold.</div>

      <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, color: C.t3, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Assets</div>
      <AssetInput label="Primary Home / Real Estate" field="home" />
      <AssetInput label="Retirement Accounts (401k, IRA)" field="retirement" />
      <AssetInput label="Brokerage / Investment Accounts" field="brokerage" />
      <AssetInput label="Life Insurance Death Benefit" field="lifeInsurance" />
      <AssetInput label="Bank / Savings Accounts" field="bankAccounts" />
      <AssetInput label="Other Assets (business, vehicles, etc.)" field="other" />

      <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, color: C.t3, margin: '4px 0 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Liabilities</div>
      <AssetInput label="Total Debts (mortgage, loans, etc.)" field="debts" />

      {/* Results */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4, marginBottom: 12 }}>
        <div style={{ background: GOLD + '12', border: `1px solid ${GOLD}25`, borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
          <div style={{ fontFamily: MONO, fontSize: 16, fontWeight: 700, color: GOLD }}>{fmtM(totalAssets)}</div>
          <div style={{ fontFamily: UI, fontSize: 10, color: C.t3, marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Gross Estate</div>
        </div>
        <div style={{ background: C.t1 + '08', border: `1px solid ${C.b2}`, borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
          <div style={{ fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.t1 }}>{fmtM(netEstate)}</div>
          <div style={{ fontFamily: UI, fontSize: 10, color: C.t3, marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Net Estate</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: UI, fontSize: 11, color: C.t3, marginBottom: 5 }}>
          <span>{pctOfExemption.toFixed(1)}% of $15M federal exemption</span>
          <span>$15M</span>
        </div>
        <div style={{ background: C.b1, borderRadius: 99, height: 8, overflow: 'hidden' }}>
          <div style={{
            width: `${pctOfExemption}%`, height: '100%', borderRadius: 99,
            background: pctOfExemption >= 90 ? RED : pctOfExemption >= 60 ? AMBER : GOLD,
            transition: 'width 0.3s',
          }} />
        </div>
      </div>

      {federalTax > 0 ? (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '12px 14px' }}>
          <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: RED, marginBottom: 3 }}>Potential Federal Estate Tax Exposure</div>
          <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700, color: RED, marginBottom: 4 }}>{fmt(federalTax)}</div>
          <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.6 }}>Consult an estate planning attorney. Strategies like irrevocable trusts, gifting, and charitable giving can reduce this.</div>
        </div>
      ) : (
        <div style={{ background: GREEN + '10', border: `1px solid ${GREEN}25`, borderRadius: 12, padding: '12px 14px' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <CheckCircle2 size={15} color={GREEN} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 3 }}>Below Federal Estate Tax Threshold</div>
              <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.6 }}>Your estimated estate is below the $15M federal exemption. Federal estate tax is not a concern at this size. Note: some states have lower thresholds.</div>
            </div>
          </div>
        </div>
      )}
    </MCard>
  )
}

function DocumentChecklist() {
  const docs = [
    { id: 'will', label: 'Last Will & Testament', priority: 'Essential', color: RED, detail: 'Distributes assets, names guardian for minor children, appoints executor.' },
    { id: 'poa_fin', label: 'Durable Financial Power of Attorney', priority: 'Essential', color: RED, detail: 'Lets your agent manage finances if you become incapacitated.' },
    { id: 'poa_hc', label: 'Healthcare Power of Attorney', priority: 'Essential', color: RED, detail: 'Designates who makes medical decisions on your behalf.' },
    { id: 'living_will', label: 'Living Will / Advance Directive', priority: 'Essential', color: RED, detail: 'Documents your end-of-life medical treatment preferences.' },
    { id: 'beneficiaries', label: 'Beneficiary Designations Updated', priority: 'Essential', color: RED, detail: 'All accounts (IRA, 401k, insurance, bank) have current beneficiaries.' },
    { id: 'trust', label: 'Revocable Living Trust', priority: 'Recommended $500k+', color: AMBER, detail: 'Avoids probate and manages assets during incapacity.' },
    { id: 'hipaa', label: 'HIPAA Authorization', priority: 'Recommended', color: AMBER, detail: 'Allows healthcare providers to share medical info with designated people.' },
    { id: 'letter', label: 'Letter of Instruction', priority: 'Helpful', color: GOLD, detail: 'Non-legal document with account info, passwords, funeral wishes, and personal messages.' },
    { id: 'digital', label: 'Digital Asset Inventory', priority: 'Helpful', color: GOLD, detail: 'List of online accounts, passwords (in a password manager), crypto wallets, and access instructions.' },
  ]

  const [checked, setChecked] = useState({})
  const toggle = id => setChecked(c => ({ ...c, [id]: !c[id] }))
  const done = Object.values(checked).filter(Boolean).length

  return (
    <MCard>
      <div style={{ fontFamily: DISPLAY, fontSize: 15, fontWeight: 700, color: C.t1, marginBottom: 4 }}>Estate Plan Checklist</div>
      <div style={{ fontFamily: UI, fontSize: 12, color: C.t3, marginBottom: 14 }}>Track which documents you have in place.</div>

      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ flex: 1, background: C.b1, borderRadius: 99, height: 7, overflow: 'hidden' }}>
          <div style={{ width: `${(done / docs.length) * 100}%`, background: GOLD, height: '100%', borderRadius: 99, transition: 'width 0.3s' }} />
        </div>
        <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: GOLD, whiteSpace: 'nowrap' }}>{done} / {docs.length}</span>
      </div>

      {docs.map(d => (
        <div
          key={d.id}
          onClick={() => toggle(d.id)}
          style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: `1px solid ${C.b1}`, cursor: 'pointer', alignItems: 'flex-start' }}
        >
          <div style={{
            width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
            border: `2px solid ${checked[d.id] ? GOLD : C.b2}`,
            background: checked[d.id] ? GOLD : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}>
            {checked[d.id] && <CheckCircle2 size={11} color="#fff" />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 2 }}>
              <span style={{
                fontFamily: UI, fontSize: 13, fontWeight: 600,
                color: checked[d.id] ? C.t3 : C.t1,
                textDecoration: checked[d.id] ? 'line-through' : 'none',
              }}>{d.label}</span>
              <span style={{
                fontFamily: UI, fontSize: 9, fontWeight: 700, color: d.color,
                background: d.color + '18', border: `1px solid ${d.color}30`,
                borderRadius: 5, padding: '1px 6px', textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>{d.priority}</span>
            </div>
            <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, lineHeight: 1.5 }}>{d.detail}</div>
          </div>
        </div>
      ))}
    </MCard>
  )
}

function BeneficiaryReminders() {
  return (
    <MCard>
      <div style={{ fontFamily: DISPLAY, fontSize: 15, fontWeight: 700, color: C.t1, marginBottom: 4 }}>Beneficiary Designation Guide</div>
      <div style={{ fontFamily: UI, fontSize: 12, color: C.t3, marginBottom: 12 }}>When to review and update your designations.</div>

      <div style={{ background: RED + '10', border: `1px solid ${RED}25`, borderRadius: 10, padding: '10px 12px', marginBottom: 12 }}>
        <p style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.7, margin: 0 }}>
          <strong style={{ color: C.t1 }}>Beneficiary designations override your will.</strong> It doesn't matter what your will says — whoever is named on your accounts receives those assets directly.
        </p>
      </div>

      <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, color: C.t3, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>When to Update</div>
      {[
        'After getting married or divorced',
        'After the birth or adoption of a child',
        'If a named beneficiary dies before you',
        'After a significant change in your estate plan',
        'If you change employers or roll over a retirement account',
        'At minimum — every 3–5 years as part of your annual financial review',
      ].map(r => (
        <div key={r} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
          <CheckCircle2 size={13} color={GOLD} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.5 }}>{r}</span>
        </div>
      ))}

      <InfoBox>This is a personal reference tool only. Actual beneficiary designations must be updated directly with each financial institution. A designation on file with the institution is the only one that counts legally.</InfoBox>
    </MCard>
  )
}

/* ══════════════════════════════════════════════════════════════
   RESOURCES TAB
══════════════════════════════════════════════════════════════ */

function ResourcesContent() {
  const resources = [
    {
      category: 'Free & Low-Cost Will Tools',
      color: GOLD,
      items: [
        { name: 'Trust & Will', desc: 'Online wills, trusts, and POA documents. State-specific. $39–$199.', url: 'https://trustandwill.com' },
        { name: 'Nolo WillMaker', desc: 'Desktop/online software for wills, healthcare directives, and more. $99.', url: 'https://www.nolo.com/products/willmaker-trust' },
        { name: 'FreeWill', desc: 'Truly free online will creation. Partnered with nonprofits. Simple estates.', url: 'https://www.freewill.com' },
        { name: 'LegalZoom', desc: 'Online legal documents including wills and trusts. Attorney review available.', url: 'https://www.legalzoom.com' },
      ],
    },
    {
      category: 'Healthcare Directives',
      color: PINK,
      items: [
        { name: 'Five Wishes', desc: 'Nationally recognized advance directive covering medical, personal, and spiritual wishes.', url: 'https://fivewishes.org' },
        { name: 'CaringInfo (NHPCO)', desc: 'Free state-specific advance directive forms for all 50 states.', url: 'https://www.caringinfo.org/planning/advance-directives/' },
        { name: 'Prepare for Your Care', desc: 'Step-by-step guide to advance care planning with printable forms.', url: 'https://www.prepareforyourcare.org' },
      ],
    },
    {
      category: 'Estate Planning Education',
      color: PURPLE,
      items: [
        { name: 'IRS Estate & Gift Tax', desc: 'Official IRS guidance on estate tax rules, exemptions, and filing requirements.', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/estate-and-gift-taxes' },
        { name: 'NAELA Attorney Finder', desc: 'Find attorneys specializing in estate planning, elder law, and special needs trusts.', url: 'https://www.naela.org' },
        { name: 'Nolo Estate Planning Guide', desc: 'Free articles on wills, trusts, probate, and estate planning strategies.', url: 'https://www.nolo.com/legal-encyclopedia/estate-planning' },
      ],
    },
  ]

  return (
    <>
      {resources.map(section => (
        <MCard key={section.category}>
          <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, color: section.color, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{section.category}</div>
          {section.items.map(item => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10,
                padding: '10px 0', borderBottom: `1px solid ${C.b1}`, textDecoration: 'none',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: section.color, marginBottom: 2 }}>{item.name}</div>
                <div style={{ fontFamily: UI, fontSize: 12, color: C.t3, lineHeight: 1.5 }}>{item.desc}</div>
              </div>
              <ExternalLink size={13} color={C.t3} style={{ flexShrink: 0, marginTop: 3 }} />
            </a>
          ))}
        </MCard>
      ))}

      <MCard>
        <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, color: GOLD, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>When to Hire an Attorney</div>
        {[
          'Estate exceeds $1M or may exceed future federal/state exemptions',
          'You own a business or have complex assets',
          'You have children with special needs requiring a special needs trust',
          'Blended family or complex beneficiary situations',
          'You own property in multiple states',
          'Significant charitable giving goals',
        ].map(r => (
          <div key={r} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '5px 0' }}>
            <ArrowRight size={12} color={GOLD} style={{ flexShrink: 0, marginTop: 3 }} />
            <span style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.55 }}>{r}</span>
          </div>
        ))}
        <InfoBox>A comprehensive estate plan from an attorney typically costs $1,000–$3,000 for an individual or $1,500–$5,000 for a couple with trusts. It's a one-time cost that protects everything you've built.</InfoBox>
      </MCard>
    </>
  )
}

/* ══════════════════════════════════════════════════════════════
   TAB BAR
══════════════════════════════════════════════════════════════ */
const TABS = [
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'tools', label: 'Tools', icon: Calculator },
  { id: 'resources', label: 'Resources', icon: ExternalLink },
]

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function MEstatePlanning() {
  const [tab, setTab] = useState('learn')

  return (
    <div style={{ background: C.bg, minHeight: '100dvh', fontFamily: UI }}>
      <ScreenHeader title="Estate Planning" subtitle="Planning" accent={GOLD} />

      {/* Key numbers banner */}
      <div style={{ padding: '12px 16px 0' }}>
        <div style={{ background: C.t1, borderRadius: 14, padding: '14px 16px' }}>
          <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>2026 Key Numbers</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
            {[
              { label: 'Federal Exemption', value: '$15M' },
              { label: 'Annual Gift Limit', value: '$19K' },
              { label: 'Estate Tax Rate', value: '40%' },
              { label: 'Married (Portability)', value: '$30M' },
            ].map(({ label: lbl, value }) => (
              <div key={lbl} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: GOLD, lineHeight: 1 }}>{value}</div>
                <div style={{ fontFamily: UI, fontSize: 9, color: 'rgba(250,246,237,0.45)', marginTop: 3, lineHeight: 1.3 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{ display: 'flex', background: C.raise, borderRadius: 12, padding: 3, border: `1px solid ${C.b2}` }}>
          {TABS.map(t => {
            const Icon = t.icon
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 5, padding: '8px 4px',
                  background: active ? C.surf : 'transparent',
                  border: active ? `1px solid ${C.b2}` : '1px solid transparent',
                  borderRadius: 9, cursor: 'pointer',
                  fontFamily: UI, fontSize: 12, fontWeight: active ? 700 : 500,
                  color: active ? GOLD : C.t3,
                  boxShadow: active ? '0 1px 4px rgba(28,21,16,0.07)' : 'none',
                  transition: 'all 0.15s',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <Icon size={13} />
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px 88px' }}>

        {/* ── LEARN TAB ───────────────────────────────────────────── */}
        {tab === 'learn' && (
          <>
            <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
              Tap a topic to expand
            </div>

            <Accordion icon={ScrollText} title="Wills & Living Wills" color={GOLD}>
              <WillsContent />
            </Accordion>

            <Accordion icon={Shield} title="Trusts (Revocable & Irrevocable)" color={C.teal}>
              <TrustsContent />
            </Accordion>

            <Accordion icon={User} title="Power of Attorney" color={GOLD}>
              <POAContent />
            </Accordion>

            <Accordion icon={Heart} title="Healthcare Directives" color={PINK}>
              <DirectivesContent />
            </Accordion>

            <Accordion icon={FileText} title="Beneficiary Designations" color={PURPLE}>
              <BeneficiariesContent />
            </Accordion>

            <Accordion icon={Scale} title="Probate — What It Is & How to Avoid It" color={AMBER}>
              <ProbateContent />
            </Accordion>

            <Accordion icon={Landmark} title="Estate Taxes & Heir Income Taxes" color={GREEN}>
              <EstateTaxContent />
            </Accordion>
          </>
        )}

        {/* ── TOOLS TAB ───────────────────────────────────────────── */}
        {tab === 'tools' && (
          <>
            <BeneficiaryReminders />
            <EstateTaxEstimator />
            <DocumentChecklist />
          </>
        )}

        {/* ── RESOURCES TAB ───────────────────────────────────────── */}
        {tab === 'resources' && <ResourcesContent />}

      </div>
    </div>
  )
}
