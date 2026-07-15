import React, { useState } from 'react'
import {
  Baby, GraduationCap, Calculator, Heart, CheckCircle2, ChevronDown,
} from 'lucide-react'
import { C, UI, MONO, DISPLAY } from '../../tokens'
import { MCard, MSectionHeader } from '../../components/MCard'
import ScreenHeader from '../../navigation/ScreenHeader'

// ─── Local color constants (not in mobile token file) ────────────────
const TEAL_DIM  = 'rgba(0,180,198,0.10)'
const TEAL_BDR  = 'rgba(0,180,198,0.22)'
const SAGE_DIM  = 'rgba(122,176,138,0.15)'
const SAGE_BDR  = 'rgba(122,176,138,0.30)'
const TANG_DIM  = 'rgba(232,120,60,0.13)'
const TANG_BDR  = 'rgba(232,120,60,0.30)'
const PLUM_DIM  = 'rgba(107,58,92,0.12)'
const PLUM_BDR  = 'rgba(107,58,92,0.25)'
const UP_DIM    = 'rgba(74,124,89,0.12)'
const DOWN_DIM  = 'rgba(192,57,43,0.12)'

// ─── Helpers ──────────────────────────────────────────────────────────
const fmt  = n => '$' + Math.round(n || 0).toLocaleString()
const fmtM = n => '$' + Math.round(n || 0).toLocaleString() + '/mo'

// ─── Shared sub-components ────────────────────────────────────────────
function MSlider({ label, value, min, max, step = 1, format, onChange, note }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontFamily: UI, fontSize: 12, color: C.t2 }}>{label}</span>
        <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: C.teal }}>
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: C.teal, cursor: 'pointer' }}
      />
      {note && (
        <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, marginTop: 4, fontStyle: 'italic', lineHeight: 1.4 }}>
          {note}
        </div>
      )}
    </div>
  )
}

function StatPill({ label, value, accent }) {
  const color = accent || C.teal
  return (
    <div style={{
      background: color + '18',
      border: `1px solid ${color}30`,
      borderRadius: 10,
      padding: '10px 12px',
      textAlign: 'center',
      flex: 1,
    }}>
      <div style={{ fontFamily: MONO, fontSize: 15, fontWeight: 700, color, lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontFamily: UI, fontSize: 10, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>{label}</div>
    </div>
  )
}

function ToggleGroup({ label, options, value, onChange, accent }) {
  const ac = accent || C.teal
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, marginBottom: 8 }}>{label}</div>}
      <div style={{ display: 'flex', gap: 6 }}>
        {options.map(([v, l]) => (
          <button key={v} onClick={() => onChange(v)} style={{
            flex: 1, padding: '8px 4px', borderRadius: 8,
            border: `1px solid ${value === v ? ac : C.b2}`,
            background: value === v ? ac + '18' : 'transparent',
            color: value === v ? ac : C.t3,
            fontFamily: UI, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
          }}>{l}</button>
        ))}
      </div>
    </div>
  )
}

// ─── Tab 1: Cost of Raising a Child ──────────────────────────────────
function CostCalculator() {
  const [income,    setIncome]    = useState(95000)
  const [location,  setLocation]  = useState('suburban')
  const [childcare, setChildcare] = useState(18000)
  const [kids,      setKids]      = useState(1)
  const [gender,    setGender]    = useState('both')

  const locationMult = { urban: 1.18, suburban: 1.0, rural: 0.82 }[location]
  const BASE_ANNUAL  = 16005 * locationMult

  const PHASES = [
    { phase: 'Infancy (0–2)',       annual: BASE_ANNUAL * 1.30, years: 3, genderDiff: { boy: 0,    girl: 150  } },
    { phase: 'Toddler (3–5)',       annual: BASE_ANNUAL * 1.15, years: 3, genderDiff: { boy: 200,  girl: 400  } },
    { phase: 'Elementary (6–11)',   annual: BASE_ANNUAL * 1.00, years: 6, genderDiff: { boy: 400,  girl: 600  } },
    { phase: 'Middle School (12–14)', annual: BASE_ANNUAL * 1.10, years: 3, genderDiff: { boy: 600, girl: 1200 } },
    { phase: 'High School (15–17)', annual: BASE_ANNUAL * 1.25, years: 3, genderDiff: { boy: 1200, girl: 800  } },
  ]

  const genderMult   = gender === 'boy' ? 0 : gender === 'girl' ? 1 : 0.5
  const totalByPhase = PHASES.map(p => {
    const gd = p.genderDiff.boy * (1 - genderMult) + p.genderDiff.girl * genderMult
    return { phase: p.phase, annual: p.annual + gd, years: p.years }
  })
  const total18  = totalByPhase.reduce((s, p) => s + p.annual * p.years, 0) * kids
  const perMonth = total18 / 18 / 12

  return (
    <div style={{ padding: '0 16px' }}>
      <MCard>
        <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 14 }}>Your Situation</div>
        <MSlider label="Annual Household Income" value={income} min={30000} max={400000} step={5000}
          format={v => '$' + (v / 1000).toFixed(0) + 'K'} onChange={setIncome} />
        <MSlider label="Number of Children" value={kids} min={1} max={5}
          format={v => v + (v === 1 ? ' child' : ' children')} onChange={setKids} />
        <MSlider label="Annual Childcare / Daycare Cost" value={childcare} min={0} max={40000} step={500}
          format={v => '$' + (v / 1000).toFixed(1) + 'K/yr'} onChange={setChildcare}
          note="National average: $16,000–$22,000/yr (varies widely by state)" />
        <ToggleGroup label="Location Type"
          options={[['urban', 'Urban'], ['suburban', 'Suburban'], ['rural', 'Rural']]}
          value={location} onChange={setLocation} />
        <ToggleGroup label="Child Gender (affects some costs)"
          options={[['boy', 'Boy'], ['girl', 'Girl'], ['both', 'Average']]}
          value={gender} onChange={setGender} />
        <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, fontStyle: 'italic', marginTop: -6 }}>
          Girls tend to cost more in clothing; boys more in food and sports during teen years
        </div>
      </MCard>

      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <StatPill label="Total Birth–18"   value={fmt(total18)} />
        <StatPill label="Monthly Average"  value={fmtM(perMonth)} accent={C.sage} />
        <StatPill label="% of Income"      value={Math.round(perMonth * 12 / income * 100) + '%'} accent={C.t2} />
      </div>

      <MCard>
        <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 14 }}>Cost by Life Phase</div>
        {totalByPhase.map(p => (
          <div key={p.phase} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, gap: 8 }}>
              <span style={{ fontFamily: UI, fontSize: 13, fontWeight: 600, color: C.t1 }}>{p.phase}</span>
              <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: C.teal, flexShrink: 0 }}>
                {fmt(p.annual * p.years * kids)}
              </span>
            </div>
            <div style={{ height: 5, background: C.raise, borderRadius: 3, marginBottom: 3 }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, p.annual / 30000 * 100)}%`,
                background: C.teal, borderRadius: 3,
              }} />
            </div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: C.t3 }}>{fmtM(p.annual * kids / 12)} per month avg</div>
          </div>
        ))}
      </MCard>

      <div style={{
        background: TEAL_DIM, border: `1px solid ${TEAL_BDR}`,
        borderRadius: 12, padding: '14px 16px', marginBottom: 10,
      }}>
        <div style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, color: C.teal, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Not included above
        </div>
        <div style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.65 }}>
          College costs ($120K–$320K+), lost income during parental leave, home upgrades for space, and inheritance planning changes.
          Adding college savings adds $300–$600/mo to this estimate.
        </div>
      </div>
    </div>
  )
}

// ─── Tab 2: College Savings (529) ─────────────────────────────────────
function CollegeSavings() {
  const [childAge,   setChildAge]   = useState(0)
  const [monthly,    setMonthly]    = useState(400)
  const [type,       setType]       = useState('public')
  const [returnRate, setReturnRate] = useState(7)
  const [existing,   setExisting]   = useState(0)

  const yearsToCollege = Math.max(1, 18 - childAge)
  const months         = yearsToCollege * 12
  const mo             = returnRate / 100 / 12

  const fvContributions = monthly * ((Math.pow(1 + mo, months) - 1) / mo)
  const fvExisting      = existing * Math.pow(1 + mo, months)
  const projected       = fvContributions + fvExisting

  const costs  = { public: 115000, private: 240000, community: 40000 }
  const target = costs[type] * Math.pow(1.05, yearsToCollege)
  const gap    = Math.max(0, target - projected)
  const funded = Math.min(100, (projected / target) * 100)

  const neededMo = gap > 0 && months > 0
    ? gap / ((Math.pow(1 + mo, months) - 1) / mo)
    : 0

  const barColor = funded >= 80 ? C.up : funded >= 50 ? C.gold : C.down

  const SCHOOL_TYPES = [
    { id: 'public',    label: '4-Yr Public',           cost: costs.public,    note: 'In-state, includes room & board' },
    { id: 'private',   label: '4-Yr Private',          cost: costs.private,   note: 'Full cost of attendance, avg.' },
    { id: 'community', label: 'Community + Transfer',   cost: costs.community, note: '2-yr then transfer to 4-yr' },
  ]

  return (
    <div style={{ padding: '0 16px' }}>
      <MCard>
        <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 14 }}>529 Plan Projection</div>
        <MSlider label="Child's Current Age" value={childAge} min={0} max={17}
          format={v => v === 0 ? 'Newborn' : v + ' yrs'} onChange={setChildAge} />
        <MSlider label="Monthly Contribution" value={monthly} min={0} max={2000} step={25}
          format={fmtM} onChange={setMonthly} />
        <MSlider label="Existing 529 Balance" value={existing} min={0} max={200000} step={1000}
          format={fmt} onChange={setExisting} />
        <MSlider label="Expected Annual Return" value={returnRate} min={3} max={12} step={0.5}
          format={v => v.toFixed(1) + '%'} onChange={setReturnRate}
          note="Age-based funds average ~7% when child is young, then de-risk toward bonds" />

        <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, marginBottom: 8 }}>School Type</div>
        {SCHOOL_TYPES.map(s => (
          <button key={s.id} onClick={() => setType(s.id)} style={{
            width: '100%', marginBottom: 6, padding: '10px 14px', borderRadius: 9,
            border: `1px solid ${type === s.id ? C.teal : C.b2}`,
            background: type === s.id ? TEAL_DIM : 'transparent',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            cursor: 'pointer', textAlign: 'left', WebkitTapHighlightColor: 'transparent',
          }}>
            <div>
              <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: type === s.id ? C.teal : C.t1 }}>{s.label}</div>
              <div style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>{s.note}</div>
            </div>
            <span style={{ fontFamily: MONO, fontSize: 12, color: type === s.id ? C.teal : C.t3, fontWeight: 700, marginLeft: 8 }}>
              {fmt(s.cost)}/yr
            </span>
          </button>
        ))}
      </MCard>

      <MCard>
        <div style={{ fontFamily: UI, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: C.t3, marginBottom: 6 }}>
          Projected 529 Balance at Age 18
        </div>
        <div style={{ fontFamily: DISPLAY, fontSize: 32, fontWeight: 700, color: C.teal, letterSpacing: '-0.02em', marginBottom: 4 }}>
          {fmt(projected)}
        </div>
        <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, marginBottom: 16 }}>
          in {yearsToCollege} year{yearsToCollege !== 1 ? 's' : ''} at {returnRate}% avg annual return
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: UI, fontSize: 12, color: C.t2 }}>Funding progress</span>
            <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: barColor }}>{funded.toFixed(0)}%</span>
          </div>
          <div style={{ height: 8, background: C.raise, borderRadius: 4 }}>
            <div style={{ height: '100%', width: `${funded}%`, background: barColor, borderRadius: 4 }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: gap > 0 ? 12 : 0 }}>
          <div style={{ flex: 1, background: C.raise, borderRadius: 10, padding: '12px' }}>
            <div style={{ fontFamily: UI, fontSize: 10, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Target (inflated)</div>
            <div style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: C.t1 }}>{fmt(target)}</div>
          </div>
          <div style={{
            flex: 1,
            background: gap > 0 ? DOWN_DIM : UP_DIM,
            border: `1px solid ${gap > 0 ? C.down : C.up}33`,
            borderRadius: 10, padding: '12px',
          }}>
            <div style={{ fontFamily: UI, fontSize: 10, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
              {gap > 0 ? 'Funding Gap' : 'Surplus'}
            </div>
            <div style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: gap > 0 ? C.down : C.up }}>
              {fmt(Math.abs(gap))}
            </div>
          </div>
        </div>

        {gap > 0 && (
          <div style={{ background: TEAL_DIM, border: `1px solid ${TEAL_BDR}`, borderRadius: 10, padding: '12px' }}>
            <div style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.6 }}>
              To fully fund: add{' '}
              <span style={{ color: C.teal, fontWeight: 700 }}>{fmtM(neededMo)}</span> more per month, or a lump sum of{' '}
              <span style={{ color: C.teal, fontWeight: 700 }}>
                {fmt(gap / Math.pow(1 + returnRate / 100, yearsToCollege))}
              </span>{' '}
              today.
            </div>
          </div>
        )}
      </MCard>

      <MCard>
        <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 12 }}>
          Why a 529 Beats a Regular Savings Account
        </div>
        {[
          { label: 'Tax-free growth',     desc: 'Contributions grow tax-deferred; qualified withdrawals (tuition, fees, room & board) are 100% tax-free.' },
          { label: 'State tax deduction', desc: '34 states offer deductions or credits for 529 contributions — free money on top of the growth.' },
          { label: 'Flexible use',        desc: 'Covers K-12 tuition ($10K/yr), trade schools, community college, and student loan repayment ($10K lifetime).' },
          { label: 'Transferable',        desc: 'Unused funds can roll to a sibling, cousin, or yourself — or convert to a Roth IRA (up to $35K lifetime, per 2024 rules).' },
        ].map(r => (
          <div key={r.label} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
            <CheckCircle2 size={14} color={C.up} style={{ marginTop: 3, flexShrink: 0 }} />
            <div>
              <span style={{ fontFamily: UI, fontSize: 13, fontWeight: 600, color: C.t1 }}>{r.label}: </span>
              <span style={{ fontFamily: UI, fontSize: 12.5, color: C.t2 }}>{r.desc}</span>
            </div>
          </div>
        ))}
      </MCard>
    </div>
  )
}

// ─── Tab 3: Budget Impact ─────────────────────────────────────────────
function BudgetImpact() {
  const [income,  setIncome]  = useState(95000)
  const [savings, setSavings] = useState(15)
  const [kids,    setKids]    = useState(1)
  const [ages,    setAges]    = useState('infant')

  const childcareMap  = { infant: 1600, toddler: 1200, school: 600,  teen: 200  }
  const foodMap       = { infant: 250,  toddler: 300,  school: 400,  teen: 600  }
  const clothingMap   = { infant: 80,   toddler: 90,   school: 110,  teen: 160  }
  const healthMap     = { infant: 180,  toddler: 130,  school: 110,  teen: 150  }
  const activitiesMap = { infant: 0,    toddler: 100,  school: 350,  teen: 500  }

  const perKid         = childcareMap[ages] + foodMap[ages] + clothingMap[ages] + healthMap[ages] + activitiesMap[ages]
  const totalKidCost   = perKid * kids
  const moIncome       = income / 12
  const currentSavings = moIncome * (savings / 100)
  const newSavings     = Math.max(0, currentSavings - totalKidCost)
  const newSavingsRate = (newSavings / moIncome) * 100

  const savingsColor = newSavingsRate >= 10 ? C.up : newSavingsRate >= 5 ? C.gold : C.down

  const PHASES_INFO = [
    { id: 'infant',  label: 'Infant (0–2)',        note: 'Childcare is the dominant cost' },
    { id: 'toddler', label: 'Toddler / Preschool', note: 'Preschool + growing activity costs' },
    { id: 'school',  label: 'School Age (6–12)',    note: 'After-school care + sports' },
    { id: 'teen',    label: 'Teenager (13–18)',     note: 'Car, food, and social costs spike' },
  ]

  return (
    <div style={{ padding: '0 16px' }}>
      <MCard>
        <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 14 }}>Your Financial Situation</div>
        <MSlider label="Annual Household Income" value={income} min={30000} max={400000} step={5000}
          format={v => '$' + (v / 1000).toFixed(0) + 'K'} onChange={setIncome} />
        <MSlider label="Current Monthly Savings Rate" value={savings} min={0} max={50}
          format={v => v + '%'} onChange={setSavings} />
        <MSlider label="Number of Children" value={kids} min={1} max={5}
          format={v => v + (v === 1 ? ' child' : ' children')} onChange={setKids} />

        <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, marginBottom: 8 }}>Child's Age Stage</div>
        {PHASES_INFO.map(p => (
          <button key={p.id} onClick={() => setAges(p.id)} style={{
            width: '100%', marginBottom: 6, padding: '10px 14px', borderRadius: 8,
            border: `1px solid ${ages === p.id ? C.teal : C.b2}`,
            background: ages === p.id ? TEAL_DIM : 'transparent',
            display: 'flex', justifyContent: 'flex-start', alignItems: 'center',
            cursor: 'pointer', textAlign: 'left', WebkitTapHighlightColor: 'transparent',
          }}>
            <div>
              <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: ages === p.id ? C.teal : C.t1 }}>{p.label}</div>
              <div style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>{p.note}</div>
            </div>
          </button>
        ))}
      </MCard>

      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <StatPill label="Monthly Kid Cost"  value={fmtM(totalKidCost)} />
        <StatPill label="New Savings Rate"  value={newSavingsRate.toFixed(1) + '%'} accent={savingsColor} />
      </div>

      <MCard>
        <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 12 }}>Monthly Budget: Before vs. After</div>
        {[
          { label: 'Monthly Take-Home (est.)',                         before: moIncome * 0.78, after: moIncome * 0.78 },
          { label: `Child Expenses (${kids} child${kids > 1 ? 'ren' : ''})`, before: 0, after: -totalKidCost },
          { label: 'Savings / Investing',                              before: currentSavings,  after: newSavings },
        ].map(r => (
          <div key={r.label} style={{ padding: '10px 0', borderBottom: `1px solid ${C.b1}` }}>
            <div style={{ fontFamily: UI, fontSize: 12.5, color: C.t2, marginBottom: 6 }}>{r.label}</div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: UI, fontSize: 10, color: C.t3, marginBottom: 2 }}>Before</div>
                <div style={{ fontFamily: MONO, fontSize: 13, color: C.t3 }}>
                  {r.before < 0 ? '-' : ''}{fmt(Math.abs(r.before))}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: UI, fontSize: 10, color: C.t3, marginBottom: 2 }}>After</div>
                <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: r.after < 0 ? C.down : C.teal }}>
                  {r.after < 0 ? '-' : ''}{fmt(Math.abs(r.after))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </MCard>

      <MCard>
        <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 12 }}>Monthly Cost Breakdown</div>
        {[
          { label: 'Childcare / After-School',      value: childcareMap[ages]  * kids },
          { label: 'Food & Groceries',               value: foodMap[ages]       * kids },
          { label: 'Clothing',                       value: clothingMap[ages]   * kids },
          { label: 'Healthcare & Copays',            value: healthMap[ages]     * kids },
          { label: 'Activities & Extracurriculars',  value: activitiesMap[ages] * kids },
        ].map(r => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${C.b1}` }}>
            <span style={{ fontFamily: UI, fontSize: 13, color: C.t2 }}>{r.label}</span>
            <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: C.t1 }}>{fmtM(r.value)}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10 }}>
          <span style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: C.t1 }}>Monthly Total</span>
          <span style={{ fontFamily: MONO, fontSize: 15, fontWeight: 700, color: C.teal }}>{fmtM(totalKidCost)}</span>
        </div>
      </MCard>
    </div>
  )
}

// ─── Tab 4: Planning by Stage ─────────────────────────────────────────
function PlanningGuide() {
  const [openStage, setOpenStage] = useState(0)

  const stages = [
    {
      phase: "Before You're Pregnant",
      color: C.teal, dim: TEAL_DIM, bdr: TEAL_BDR,
      steps: [
        { label: 'Build a 6-month emergency fund',    desc: "Before adding a child, you need financial stability. Parental leave, unexpected medical costs, and one-time expenses demand a buffer." },
        { label: 'Review your health insurance',      desc: "Understand your maternity/delivery deductible (average out-of-pocket: $4,000–$8,000). NICU costs can exceed $10,000/day without good coverage." },
        { label: 'Max out tax-advantaged accounts',   desc: "Front-load retirement savings now. A child will likely reduce your savings rate for years. The earlier you compound, the less catching up you'll need." },
        { label: 'Open a 529 before baby arrives',    desc: "Every year of compounding matters. A 529 opened at birth with $200/mo grows to ~$90K by college at 7%. Started at age 5, it grows to ~$55K." },
        { label: 'Create or update your will',        desc: "Once you have a child, a will is not optional. Name a guardian explicitly — without one, the state decides." },
      ],
    },
    {
      phase: '0–3 Years (Infant & Toddler)',
      color: C.tangerine, dim: TANG_DIM, bdr: TANG_BDR,
      steps: [
        { label: 'Childcare is your largest new expense',       desc: "Average infant daycare: $1,300–$2,200/mo. In high-cost cities (NYC, SF, Boston) expect $2,500–$4,000. Budget this before anything else." },
        { label: 'Take full parental leave if available',       desc: "Many parents leave money on the table by returning early. Paid leave is deferred compensation — use it." },
        { label: 'Add child to health insurance within 30 days', desc: "Missing the 30-day window after birth means waiting until open enrollment. Do this the week you come home." },
        { label: 'Increase life insurance now',                 desc: "A term policy for both parents should cover 10–12x income. Rates are cheapest before age 40." },
        { label: 'Update beneficiary designations',             desc: "Your 401(k), IRA, and life insurance beneficiaries supersede your will. Update them to include a trust if your child is a minor." },
      ],
    },
    {
      phase: '4–12 Years (School Age)',
      color: C.sage, dim: SAGE_DIM, bdr: SAGE_BDR,
      steps: [
        { label: 'Establish a family budget baseline',          desc: "Activities, school supplies, and sports compound quickly. Budget annually for irregular expenses like gear, camps, and class trips." },
        { label: 'Talk to your kids about money early',         desc: "Financial literacy correlates with better adult outcomes. A weekly allowance with a 3-jar system (spend, save, give) builds lifelong habits." },
        { label: 'Review 529 performance and contributions',    desc: "As college gets closer, gradually shift 529 allocations from growth to conservative. Most plans offer age-based funds that do this automatically." },
        { label: 'UTMA/UGMA accounts for taxable investing',    desc: "Teach kids to invest with a custodial brokerage account. The first $1,300 in gains is tax-free; the next $1,300 taxed at the child's rate (often 0%)." },
        { label: 'Update estate plan as assets grow',           desc: "If your net worth has grown significantly, revisit your will, trusts, and guardian designations. Life changes fast between 30 and 45." },
      ],
    },
    {
      phase: '13–18 Years (Teen & College Prep)',
      color: C.plum, dim: PLUM_DIM, bdr: PLUM_BDR,
      steps: [
        { label: 'College planning starts at 9th grade',      desc: "FAFSA calculations look at the prior-prior year tax return. Your income at 16 affects aid eligibility at 18. Plan accordingly." },
        { label: 'Roth IRA for working teens',                desc: "If your teenager earns income, they can contribute to a Roth IRA — up to earned income or $7,000 (whichever is less). 50 years of compounding starts now." },
        { label: 'Car costs are a major budget item',         desc: "Teen driver insurance adds $1,500–$4,000/yr to premiums. Include vehicle depreciation, gas, and maintenance: $400–$700/mo per teen driver." },
        { label: 'FAFSA strategy: reduce countable assets',   desc: "529 plans owned by parents count at 5.64% against aid. Cash in savings counts at 20%. Roth IRA assets are not counted at all on the FAFSA." },
        { label: 'Have the money conversation before college', desc: "Spell out exactly what you will and won't pay for. Students with financial skin in the game graduate on time at higher rates." },
      ],
    },
  ]

  return (
    <div style={{ padding: '0 16px' }}>
      {stages.map((s, idx) => (
        <MCard key={s.phase} style={{ marginBottom: 10 }}>
          <button
            onClick={() => setOpenStage(openStage === idx ? -1 : idx)}
            style={{
              width: '100%', background: 'none', border: 'none', padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
              <span style={{ fontFamily: UI, fontSize: 14, fontWeight: 700, color: C.t1, textAlign: 'left' }}>{s.phase}</span>
            </div>
            <ChevronDown
              size={16}
              color={C.t3}
              style={{
                transform: openStage === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                flexShrink: 0,
              }}
            />
          </button>

          {openStage === idx && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.b1}` }}>
              {s.steps.map(step => (
                <div key={step.label} style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start' }}>
                  <CheckCircle2 size={14} color={s.color} style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 3 }}>{step.label}</div>
                    <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.6 }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </MCard>
      ))}
    </div>
  )
}

// ─── Tab definitions ──────────────────────────────────────────────────
const TABS = [
  { id: 'cost',    label: 'Cost',     icon: Baby          },
  { id: 'college', label: '529',      icon: GraduationCap },
  { id: 'budget',  label: 'Budget',   icon: Calculator    },
  { id: 'guide',   label: 'Stages',   icon: Heart         },
]

// ─── Main Export ──────────────────────────────────────────────────────
export default function MFamilyPlanning() {
  const [tab, setTab] = useState('cost')

  return (
    <div style={{ background: C.bg, minHeight: '100dvh', paddingBottom: 88 }}>
      <ScreenHeader title="Family Planning" subtitle="Planning" accent={C.teal} />

      {/* Hero Banner */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{
          background: C.ink,
          borderRadius: 16,
          padding: '18px 20px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -40, right: -30,
            width: 160, height: 160,
            background: 'radial-gradient(circle, rgba(0,180,198,0.14) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Baby size={16} color={C.teal} />
            <span style={{ fontFamily: UI, fontSize: 11, fontWeight: 700, color: C.teal, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Children & Family
            </span>
          </div>
          <div style={{ fontFamily: DISPLAY, fontSize: 20, fontWeight: 700, color: '#f0e8d8', lineHeight: 1.2, marginBottom: 6 }}>
            The Full Cost of a Child
          </div>
          <div style={{ fontFamily: UI, fontSize: 13, color: '#a89070', lineHeight: 1.6 }}>
            The USDA estimates{' '}
            <span style={{ color: C.teal, fontWeight: 700 }}>$310,605</span>{' '}
            to raise a child to age 18 — not including college. Plan every phase.
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ padding: '12px 16px 0', display: 'flex', gap: 6 }}>
        {TABS.map(t => {
          const Icon   = t.icon
          const active = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '10px 4px', borderRadius: 10,
                background: active ? C.teal : C.surf,
                border: `1px solid ${active ? C.teal : C.b1}`,
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <Icon size={15} color={active ? '#ffffff' : C.t3} />
              <span style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: active ? '#ffffff' : C.t3 }}>
                {t.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div style={{ paddingTop: 14 }}>
        {tab === 'cost'    && <CostCalculator />}
        {tab === 'college' && <CollegeSavings />}
        {tab === 'budget'  && <BudgetImpact />}
        {tab === 'guide'   && <PlanningGuide />}
      </div>
    </div>
  )
}
