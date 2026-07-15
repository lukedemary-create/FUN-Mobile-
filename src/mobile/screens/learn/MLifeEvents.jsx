import { useState, useMemo } from 'react'
import { CheckCircle2, AlertCircle, Info, ArrowRight, ExternalLink, Heart, Baby, GraduationCap, Scissors, Briefcase, Home, DollarSign, Feather, Sunset } from 'lucide-react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'

const fmt = n => '$' + Math.round(n || 0).toLocaleString()
const fmtFV = (pv, r, n) => pv * Math.pow(1 + r / 100, n)

function InfoBox({ children, color = C.teal, icon: Icon = Info }) {
  return (
    <div style={{ display:'flex', gap:8, padding:'10px 12px', background:`${color}12`, border:`1px solid ${color}28`, borderRadius:10, marginTop:10 }}>
      <Icon size={13} color={color} style={{ flexShrink:0, marginTop:1 }} />
      <p style={{ margin:0, fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.7 }}>{children}</p>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   EVENT DATA
════════════════════════════════════════════════════════════════ */
const EVENTS = [
  {
    key:'marriage', icon:Heart, name:'Getting Married', color:C.gold,
    intro:'Marriage is one of the most significant financial events of your life. Getting integration right early prevents conflicts and missed opportunities.',
    tasks:[
      { urgency:'Immediately', color:C.down, items:[
        'Update beneficiary designations on all accounts (IRA, 401k, life insurance)',
        'Add spouse to health insurance within qualifying event window (30–60 days)',
        'Update emergency contacts and authorized users',
        'Create or update will — or create one if you don\'t have it',
      ]},
      { urgency:'Within 3 Months', color:'#f59e0b', items:[
        'Decide on money management approach (joint, separate, or hybrid)',
        'Combine or coordinate auto and homeowners insurance for multi-policy discounts',
        'Discuss debts, net worth, and financial goals — full transparency',
        'Update W-4 withholding — marriage may change your tax bracket',
      ]},
      { urgency:'Within 6 Months', color:C.teal, items:[
        'Create a joint budget reflecting combined income and expenses',
        'Evaluate whether to file taxes jointly vs. separately (usually jointly is better)',
        'Update healthcare proxy and power of attorney',
        'If one spouse has significant debt, create a payoff strategy together',
      ]},
    ],
    extra: {
      title:'Money Management Approaches',
      items:[
        { name:'Fully Joint', color:C.up, desc:'All income goes into shared accounts. Maximum simplicity and transparency. Requires alignment on spending habits.' },
        { name:'Fully Separate', color:C.indigo, desc:'Each maintains own accounts and splits shared expenses. Maximum independence — can create friction on big goals.' },
        { name:'Hybrid (Most Popular)', color:C.teal, desc:'Each contributes proportionally to a joint account for shared expenses and goals. Personal accounts for discretionary spending. Balances transparency with autonomy.' },
      ]
    },
    prenup: [
      { label:'Significant asset disparity', note:'If one partner has substantially more assets or a business, a prenup clarifies what remains separate.' },
      { label:'Children from a prior relationship', note:'Protects assets intended for your children from a previous relationship.' },
      { label:'Significant debt disparity', note:'Prevents a spouse\'s large student loans from becoming the other\'s responsibility.' },
      { label:'Family inheritance expectations', note:'Protects expected inherited family businesses or assets from being considered marital property.' },
    ],
  },
  {
    key:'baby', icon:Baby, name:'Having a Baby', color:C.teal,
    intro:'The USDA estimates the average cost of raising a child to age 18 exceeds $310,000. Planning ahead makes the difference between thriving and surviving.',
    costs:[
      { item:'Hospital birth', range:'$5,000–$15,000', note:'After insurance. C-section: $10,000–$25,000.' },
      { item:'Childcare (0–5 years)', range:'$10,000–$30,000/yr', note:'Infant care in major cities can exceed $2,500/month.' },
      { item:'Baby gear (first year)', range:'$5,000–$10,000', note:'Crib, stroller, car seat, monitor, diapers. Buy used where safe.' },
      { item:'Healthcare', range:'$2,000–$5,000/yr', note:'Pediatric visits, vaccines. Add baby to your plan within 30 days.' },
      { item:'College savings (18 years)', range:'$200–$500+/mo', note:'$300/month at 6% return reaches ~$100K by age 18.' },
    ],
    tasks:[
      { urgency:'Immediately', color:C.down, items:[
        'Add baby to health insurance within 30 days of birth (qualifying life event)',
        'Apply for Social Security number (at the hospital)',
        'Update beneficiary designations — name child or a trust',
        'Review and increase life insurance (10× income minimum)',
      ]},
      { urgency:'Within 3 Months', color:'#f59e0b', items:[
        'Create or update will — name a guardian for the child',
        'Open a 529 college savings plan — even $50/month compounds significantly',
        'Understand employer\'s parental leave policy and plan budget around it',
        'Build 3–6 month emergency fund if not already done',
      ]},
      { urgency:'Ongoing', color:C.teal, items:[
        'Review disability insurance — your income matters more now than ever',
        'Explore dependent care FSA if both parents work',
        'Adjust W-4 for child tax credit',
        'Revisit budget as childcare costs evolve',
      ]},
    ],
  },
  {
    key:'career', icon:GraduationCap, name:'Starting Career', color:C.indigo,
    intro:'Day one of your career is your most powerful financial moment. The decisions you make now compound for 40 years.',
    tasks:[
      { urgency:'Day One', color:C.down, items:[
        'Enroll in employer benefits — don\'t miss the enrollment window (often 30 days)',
        'Contribute at least enough to get the full 401(k) employer match — it\'s a 50–100% instant return',
        'Understand your health plan (deductible, OOP max, HSA eligibility)',
        'Set up direct deposit',
      ]},
      { urgency:'First Month', color:'#f59e0b', items:[
        'Open a Roth IRA — you\'re likely in the lowest tax bracket you\'ll ever be in',
        'Build 3-month emergency fund before aggressive investing',
        'Set up automatic savings (pay yourself first on payday)',
        'Get renters insurance — very cheap and often overlooked',
      ]},
      { urgency:'First 6 Months', color:C.teal, items:[
        'Understand student loan repayment options — income-driven repayment if federal loans',
        'Review PSLF eligibility if working in public service or non-profit',
        'Refinance private student loans if you have strong credit',
        'Learn your company\'s equity/vesting schedule if applicable',
      ]},
    ],
    insight:[
      { title:'The 401(k) Match Hack', desc:'A 50% employer match on the first 6% of salary = a guaranteed 50% return. Not capturing this is leaving money on the table. Always contribute at least enough to get the full match.' },
      { title:'Roth IRA Urgency', desc:'At 22–28 years old, you\'re almost certainly in the 10–22% bracket. Every dollar in a Roth IRA now grows tax-free for 40+ years. This window closes as income rises.' },
    ],
  },
  {
    key:'divorce', icon:Scissors, name:'Getting Divorced', color:'#c0392b',
    intro:'Divorce is a financial emergency. Moving quickly on the right steps protects your credit, assets, and future.',
    tasks:[
      { urgency:'Immediately — Urgent', color:C.down, items:[
        'Open individual accounts in your name only — checking, savings, credit card',
        'Pull your credit reports — know all accounts, authorized users, and joint debts',
        'Update beneficiary designations — ex-spouse may still be named, and these override your will',
        'Change passwords and remove access to financial accounts',
        'Evaluate health insurance — COBRA or ACA marketplace within 60 days',
      ]},
      { urgency:'During the Process', color:'#f59e0b', items:[
        'Document all marital assets and debts — gather account statements and tax returns',
        'Understand marital vs. separate property rules in your state',
        'QDRO (Qualified Domestic Relations Order) required to split 401(k) or pension without taxes/penalties',
        'Evaluate whether to keep the marital home — factor in mortgage qualification solo',
        'Refinance joint mortgage or car loans if keeping those assets',
      ]},
      { urgency:'After the Decree', color:C.teal, items:[
        'Update will, healthcare POA, and power of attorney — divorce decree may not do this automatically',
        'File taxes as single or head of household depending on your situation',
        'Rebuild emergency fund — two households are more expensive than one',
        'Review and adjust investment/retirement strategy for single income',
      ]},
    ],
  },
  {
    key:'jobloss', icon:Briefcase, name:'Job Loss', color:C.gold,
    intro:'Losing a job is a financial emergency. The first 72 hours matter — moving quickly on the right steps protects your credit and maximizes your options.',
    tasks:[
      { urgency:'First Week', color:C.down, items:[
        'File for unemployment immediately — there is typically a 1-week waiting period',
        'Calculate your runway: liquid savings ÷ monthly essential expenses = months left',
        'Switch to essential spending only — cancel non-essential subscriptions',
        'Do NOT touch retirement accounts — 10% penalty + taxes destroys compounding',
        'Evaluate health insurance: COBRA vs. ACA marketplace vs. spouse\'s plan',
      ]},
      { urgency:'First Month', color:'#f59e0b', items:[
        'Negotiate severance if applicable — it is usually negotiable',
        'Pause extra debt payments — keep minimums to protect credit score',
        'Redirect extra cash to emergency fund or essential needs',
        'Update employer-sponsored life insurance beneficiaries (coverage ends with job)',
        'Review all recurring charges and subscriptions',
      ]},
    ],
    healthcare:[
      { option:'COBRA', timeframe:'Up to 18 months', cost:'Full premium + 2% admin fee — $500–$700+/mo', note:'Keeps exact same coverage and network. Best if you have ongoing medical needs.' },
      { option:'ACA Marketplace', timeframe:'Enroll within 60 days of job loss', cost:'Often cheaper — subsidies based on new lower income', note:'Job loss is a Special Enrollment Period. Lower income = larger subsidies.' },
      { option:'Spouse/Partner\'s Plan', timeframe:'30–60 days', cost:'Employer-sponsored rate — usually most affordable', note:'Job loss qualifies as a life event on your partner\'s plan.' },
      { option:'Medicaid', timeframe:'Anytime if income qualifies', cost:'Free or very low cost', note:'In expansion states, income below ~138% of federal poverty level qualifies.' },
    ],
    rollover:[
      { action:'Roll over to IRA', ok:true, note:'Best for most. Open at Fidelity/Vanguard/Schwab, direct rollover = zero taxes or penalties, full investment control.' },
      { action:'Leave in old plan', ok:true, note:'Fine if the plan has good low-cost funds. Can roll over later.' },
      { action:'Roll into new employer\'s 401(k)', ok:true, note:'Good if new plan has strong funds. Simplifies account management.' },
      { action:'Cash it out', ok:false, note:'Lose 10% penalty + income taxes. A $50K balance becomes ~$32K. Almost never the right choice.' },
    ],
  },
  {
    key:'home', icon:Home, name:'Buying a Home', color:C.teal,
    intro:'A home is the largest purchase most people make. The decisions in the months before buying have as much impact as the negotiations on the day.',
    tasks:[
      { urgency:'6–12 Months Before', color:C.teal, items:[
        'Check and improve credit score — target 720+ for best rates',
        'Save for down payment + closing costs (2–5% of purchase price separately)',
        'Eliminate high-interest debt to improve debt-to-income ratio',
        'Avoid opening new credit lines or making large purchases',
      ]},
      { urgency:'At Purchase', color:'#f59e0b', items:[
        'Get pre-approved (not pre-qualified) — this defines your real budget',
        'Home inspection is non-negotiable — never waive it',
        'Negotiate after inspection — repair credits are common',
        'Review title insurance and what\'s covered',
      ]},
      { urgency:'After Closing', color:C.down, items:[
        'Update homeowners insurance and beneficiary designations',
        'Budget for property taxes, HOA, and 1–2% home value/year for maintenance',
        'Update address with IRS, Social Security, banks, brokerage',
        'Begin building a home repair emergency fund',
      ]},
    ],
  },
  {
    key:'inheritance', icon:DollarSign, name:'Receiving Inheritance', color:C.gold,
    intro:'Receiving an inheritance is often accompanied by grief. The single most important rule: slow down. Do not make major financial decisions for 6–12 months.',
    accounts:[
      { type:'Inherited IRA (non-spouse)', rule:'10-Year Rule', detail:'Must fully withdraw within 10 years of original owner\'s death. Each withdrawal is taxable income. Strategize withdrawals to avoid bracket creep — spread over all 10 years.' },
      { type:'Inherited IRA (spouse)', rule:'Maximum Flexibility', detail:'Spouses can roll into their own IRA and treat it as their own — no 10-year rule. The most beneficial option for spousal inheritance.' },
      { type:'Inherited Roth IRA', rule:'10-Year Rule (Tax-Free)', detail:'Must distribute within 10 years but withdrawals are tax-free. Let it grow as long as possible — maximize the 10th year distribution.' },
      { type:'Inherited Brokerage', rule:'Step-Up in Basis', detail:'Cost basis resets to fair market value at date of death. Selling shortly after death may trigger little to no capital gains tax.' },
      { type:'Inherited Real Estate', rule:'Step-Up in Basis', detail:'Same step-up in basis. If you sell immediately, gains may be minimal. Keeping it means inheriting maintenance and tax obligations.' },
    ],
    steps:[
      { num:'1', label:'Park it safely', note:'Move to a HYSA earning 4–5% while you think. Never feel pressure to "do something" immediately.', color:C.up },
      { num:'2', label:'Pay off high-interest debt', note:'Any debt above 6–7% should be eliminated. Guaranteed return of debt payoff beats most investments.', color:C.teal },
      { num:'3', label:'Max tax-advantaged accounts', note:'Max Roth IRA, 401(k), and HSA for the year. Rare opportunity to fully fund these.', color:C.indigo },
      { num:'4', label:'Invest the remainder', note:'Low-cost index fund portfolio at Fidelity, Vanguard, or Schwab. Dollar-cost average over 12 months for large sums.', color:'#f59e0b' },
      { num:'5', label:'Consider a fee-only CFP', note:'For inheritances above $100K, a one-time fiduciary consultation is worth the cost for tax planning and investment guidance.', color:'#ec4899' },
    ],
  },
  {
    key:'loss', icon:Feather, name:'Losing a Loved One', color:C.t3,
    intro:'When a spouse or family member dies, there are financial steps that must happen on specific timelines. Having a checklist reduces the cognitive burden during grief.',
    tasks:[
      { urgency:'Within First Week', color:C.down, items:[
        'Obtain death certificates — you need 10–15 copies for various institutions',
        'Notify Social Security Administration',
        'Contact life insurance companies and file for benefits',
        'Secure the deceased\'s property and financial documents',
        'Notify banks and brokerage firms',
      ]},
      { urgency:'Within First Month', color:'#f59e0b', items:[
        'File for survivor benefits (Social Security, pension, employer benefits)',
        'Retitle or transfer accounts, vehicle titles, and property deeds',
        'Consult estate attorney if no trust was in place (probate process)',
        'Notify IRS if the deceased will have final tax returns to file',
        'Cancel unnecessary subscriptions and memberships',
      ]},
      { urgency:'Within 6 Months', color:C.teal, items:[
        'Review and update your own estate plan, beneficiaries, and will',
        'Adjust your financial plan for single-income or single-person reality',
        'Evaluate whether to keep or sell the marital home',
        'Consider grief counseling — financial decisions made in acute grief often go poorly',
      ]},
    ],
  },
  {
    key:'retirement', icon:Sunset, name:'Retiring', color:C.gold,
    intro:'The transition into retirement requires carefully sequencing several financial decisions. The order matters enormously.',
    tasks:[
      { urgency:'1–2 Years Before', color:'#f59e0b', items:[
        'Decide on Social Security filing strategy — delaying to 70 maximizes lifetime benefit',
        'Review Medicare enrollment timeline (Part A & B — 3 months before age 65)',
        'Create a retirement income plan — which accounts to draw from in which order',
        'Consider Roth conversion window before RMDs begin at age 73',
      ]},
      { urgency:'At Retirement', color:C.down, items:[
        'File for Social Security if starting at 62 or your chosen date',
        'Enroll in Medicare (Part B must be elected within enrollment window)',
        'Roll any 401(k) to IRA for more investment options and control',
        'Establish a systematic withdrawal strategy (4% rule starting point)',
      ]},
      { urgency:'Ongoing in Retirement', color:C.teal, items:[
        'Review Medicare annually during Open Enrollment (Oct 15 – Dec 7)',
        'Track RMDs starting at age 73 — penalties for missed withdrawals are 25%',
        'Revisit estate plan as tax law changes',
        'Consider long-term care planning if not already in place',
      ]},
    ],
  },
]

/* ════════════════════════════════════════════════════════════════
   CALCULATE — 529 College Savings Projector
════════════════════════════════════════════════════════════════ */
function Calc529() {
  const [monthly, setMonthly]     = useState(300)
  const [currentAge, setAge]      = useState(0)
  const [growth, setGrowth]       = useState(6)
  const [existingBal, setExisting] = useState(0)

  const years = Math.max(0, 18 - currentAge)
  const monthlyRate = growth / 100 / 12
  const months = years * 12
  const fvContribs = months > 0
    ? monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
    : 0
  const fvExisting = existingBal * Math.pow(1 + growth / 100, years)
  const totalAt18 = fvContribs + fvExisting

  const COST_ESTIMATES = [
    ['Public In-State (4yr)', 110000],
    ['Public Out-of-State (4yr)', 180000],
    ['Private University (4yr)', 260000],
  ]

  return (
    <div style={{ padding:'12px 16px 0' }}>
      <div style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, padding:'14px', marginBottom:12 }}>
        {[
          { l:'Monthly Contribution', v:monthly, set:setMonthly, min:25, max:2000, step:25, d:fmt(monthly) },
          { l:'Child\'s Current Age', v:currentAge, set:setAge, min:0, max:17, step:1, d:`${currentAge} yrs` },
          { l:'Expected Annual Return', v:growth, set:setGrowth, min:2, max:10, step:0.5, d:`${growth}%` },
          { l:'Existing Balance', v:existingBal, set:setExisting, min:0, max:100000, step:1000, d:fmt(existingBal) },
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

      {/* Result */}
      <div style={{ background:`rgba(201,169,110,0.1)`, border:`1px solid ${C.goldBdr}`, borderRadius:14, padding:'14px', textAlign:'center', marginBottom:12 }}>
        <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:C.gold, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:4 }}>Projected at Age 18</div>
        <div style={{ fontFamily:MONO, fontSize:28, fontWeight:800, color:C.gold }}>{fmt(totalAt18)}</div>
        <div style={{ fontFamily:UI, fontSize:11, color:C.t3, marginTop:3 }}>{years} years of growth at {growth}%/yr</div>
      </div>

      {/* College cost comparison */}
      <MCard>
        <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.t2, marginBottom:10 }}>How Far Does It Go?</div>
        {COST_ESTIMATES.map(([label, cost], i) => {
          const covered = totalAt18 >= cost
          const pct = Math.min(100, (totalAt18 / cost) * 100)
          return (
            <div key={i} style={{ marginBottom: i < 2 ? 12 : 0 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <span style={{ fontFamily:UI, fontSize:11, color:C.t2 }}>{label}</span>
                <span style={{ fontFamily:MONO, fontSize:11, fontWeight:700, color: covered ? C.up : C.down }}>{fmt(cost)}</span>
              </div>
              <div style={{ background:C.b2, borderRadius:4, height:6, overflow:'hidden' }}>
                <div style={{ width:`${pct}%`, height:'100%', background: covered ? C.up : C.gold, borderRadius:4 }} />
              </div>
              <div style={{ fontFamily:UI, fontSize:10, color:C.t3, marginTop:2 }}>
                {covered ? 'Fully covered' : `${Math.round(pct)}% covered — gap: ${fmt(cost - totalAt18)}`}
              </div>
            </div>
          )
        })}
      </MCard>

      <InfoBox color='#ec4899' icon={Info}>The 529 is one of the most underutilized accounts in America. Contributions grow tax-free for education, and many states offer an income tax deduction. Starting at birth gives 18 full years of compounding.</InfoBox>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   CALCULATE — Emergency Fund Calculator
════════════════════════════════════════════════════════════════ */
function CalcEmergency() {
  const [monthlyExpenses, setExpenses] = useState(4500)
  const [targetMonths, setTarget]      = useState(6)
  const [currentSaved, setSaved]       = useState(5000)
  const [monthlyAdd, setAdd]           = useState(500)

  const targetAmount = monthlyExpenses * targetMonths
  const gap          = Math.max(0, targetAmount - currentSaved)
  const monthsToGoal = gap > 0 ? Math.ceil(gap / monthlyAdd) : 0

  return (
    <div style={{ padding:'12px 16px 0' }}>
      <div style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, padding:'14px', marginBottom:12 }}>
        {[
          { l:'Monthly Essential Expenses', v:monthlyExpenses, set:setExpenses, min:1000, max:20000, step:250, d:fmt(monthlyExpenses) },
          { l:'Target Coverage (months)', v:targetMonths, set:setTarget, min:1, max:12, step:1, d:`${targetMonths} months` },
          { l:'Currently Saved', v:currentSaved, set:setSaved, min:0, max:100000, step:500, d:fmt(currentSaved) },
          { l:'Monthly Addition', v:monthlyAdd, set:setAdd, min:25, max:5000, step:25, d:fmt(monthlyAdd) },
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
          { l:'Target Fund', v:fmt(targetAmount), col:C.gold },
          { l:'Currently Saved', v:fmt(currentSaved), col:C.up },
          { l:'Gap Remaining', v:fmt(gap), col: gap > 0 ? C.down : C.up },
          { l:'Months to Goal', v: monthsToGoal > 0 ? `${monthsToGoal} mo` : 'Funded!', col: monthsToGoal > 0 ? '#f59e0b' : C.up },
        ].map(({ l, v, col }) => (
          <div key={l} style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:10, padding:'10px 12px' }}>
            <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.t3, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>{l}</div>
            <div style={{ fontFamily:MONO, fontSize:14, fontWeight:700, color:col }}>{v}</div>
          </div>
        ))}
      </div>

      <MCard>
        <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.gold, marginBottom:8 }}>Emergency Fund Tiers</div>
        {[
          ['1 month', 'Bare minimum — dangerous for most people'],
          ['3 months', 'Baseline standard — covers average job search'],
          ['6 months', 'Strong — recommended for most households'],
          ['12 months', 'Very strong — business owners, single income, variable pay'],
        ].map(([t, d], i) => (
          <div key={i} style={{ display:'flex', gap:10, padding:'7px 0', borderBottom: i < 3 ? `1px solid ${C.b1}` : 'none' }}>
            <span style={{ fontFamily:MONO, fontSize:11, fontWeight:700, color:C.gold, minWidth:70 }}>{t}</span>
            <span style={{ fontFamily:UI, fontSize:11, color:C.t2 }}>{d}</span>
          </div>
        ))}
      </MCard>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   EVENT DETAIL COMPONENT
════════════════════════════════════════════════════════════════ */
function EventDetail({ event }) {
  return (
    <>
      {/* Intro */}
      <div style={{ padding:'12px 16px 0' }}>
        <p style={{ fontFamily:UI, fontSize:13, color:C.t2, lineHeight:1.7, margin:0 }}>{event.intro}</p>
      </div>

      {/* Cost table for baby */}
      {event.costs && (
        <>
          <MSectionHeader label="First-Year & Ongoing Costs" />
          <div style={{ padding:'0 16px' }}>
            <MCard style={{ padding:0, overflow:'hidden' }}>
              {event.costs.map(({ item, range, note }, i) => (
                <div key={i} style={{ padding:'10px 14px', borderBottom: i < event.costs.length-1 ? `1px solid ${C.b1}` : 'none' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                    <span style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:C.t1 }}>{item}</span>
                    <span style={{ fontFamily:MONO, fontSize:11, fontWeight:700, color:C.teal }}>{range}</span>
                  </div>
                  <div style={{ fontFamily:UI, fontSize:10, color:C.t3 }}>{note}</div>
                </div>
              ))}
            </MCard>
          </div>
        </>
      )}

      {/* Task checklists */}
      {event.tasks && event.tasks.map((group, gi) => (
        <div key={gi}>
          <MSectionHeader label={group.urgency} />
          <div style={{ padding:'0 16px' }}>
            <MCard style={{ padding:0, overflow:'hidden' }}>
              {group.items.map((task, i) => (
                <div key={i} style={{ display:'flex', gap:10, padding:'11px 14px', borderBottom: i < group.items.length-1 ? `1px solid ${C.b1}` : 'none' }}>
                  <div style={{ width:20, height:20, borderRadius:6, border:`1px solid ${group.color}40`, background:`${group.color}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <span style={{ fontFamily:MONO, fontSize:9, fontWeight:700, color:group.color }}>{i+1}</span>
                  </div>
                  <span style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.55 }}>{task}</span>
                </div>
              ))}
            </MCard>
          </div>
        </div>
      ))}

      {/* Marriage: money approaches + prenup */}
      {event.extra && (
        <>
          <MSectionHeader label={event.extra.title} />
          <div style={{ padding:'0 16px' }}>
            <MCard style={{ padding:0, overflow:'hidden' }}>
              {event.extra.items.map(({ name, color, desc }, i) => (
                <div key={i} style={{ padding:'12px 14px', borderBottom: i < event.extra.items.length-1 ? `1px solid ${C.b1}` : 'none' }}>
                  <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color, marginBottom:3 }}>{name}</div>
                  <p style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.6, margin:0 }}>{desc}</p>
                </div>
              ))}
            </MCard>
            <InfoBox>There is no universally right answer. The best system is the one you\'ll both follow. Have the conversation before the wedding — discussing money openly is a relationship skill that pays dividends for decades.</InfoBox>
          </div>
        </>
      )}

      {event.prenup && (
        <>
          <MSectionHeader label="When a Prenup Makes Sense" />
          <div style={{ padding:'0 16px' }}>
            <MCard style={{ padding:0, overflow:'hidden' }}>
              {event.prenup.map(({ label, note }, i) => (
                <div key={i} style={{ padding:'11px 14px', borderBottom: i < event.prenup.length-1 ? `1px solid ${C.b1}` : 'none' }}>
                  <div style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:C.t1, marginBottom:2 }}>{label}</div>
                  <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.5 }}>{note}</div>
                </div>
              ))}
            </MCard>
            <InfoBox color={C.indigo}>Prenups require independent legal counsel for both parties and full financial disclosure to be enforceable. They are not just for the wealthy — they're a financial planning tool.</InfoBox>
          </div>
        </>
      )}

      {/* Career: key insights */}
      {event.insight && (
        <>
          <MSectionHeader label="Key Insights" />
          <div style={{ padding:'0 16px' }}>
            {event.insight.map(({ title, desc }, i) => (
              <MCard key={i}>
                <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.indigo, marginBottom:6 }}>{title}</div>
                <p style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65, margin:0 }}>{desc}</p>
              </MCard>
            ))}
          </div>
        </>
      )}

      {/* Job loss: healthcare options */}
      {event.healthcare && (
        <>
          <MSectionHeader label="Health Insurance After Job Loss" />
          <div style={{ padding:'0 16px' }}>
            <MCard style={{ padding:0, overflow:'hidden' }}>
              {event.healthcare.map(({ option, timeframe, cost, note }, i) => (
                <div key={i} style={{ padding:'12px 14px', borderBottom: i < event.healthcare.length-1 ? `1px solid ${C.b1}` : 'none' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:3 }}>
                    <span style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.t1 }}>{option}</span>
                    <span style={{ fontFamily:UI, fontSize:10, color:C.t3 }}>{timeframe}</span>
                  </div>
                  <div style={{ fontFamily:MONO, fontSize:10, fontWeight:700, color:C.teal, marginBottom:3 }}>{cost}</div>
                  <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.5 }}>{note}</div>
                </div>
              ))}
            </MCard>
          </div>
        </>
      )}

      {/* Job loss: 401k rollover */}
      {event.rollover && (
        <>
          <MSectionHeader label="What to Do with Your Old 401(k)" />
          <div style={{ padding:'0 16px' }}>
            <MCard style={{ padding:0, overflow:'hidden' }}>
              {event.rollover.map(({ action, ok, note }, i) => (
                <div key={i} style={{ display:'flex', gap:10, padding:'11px 14px', borderBottom: i < event.rollover.length-1 ? `1px solid ${C.b1}` : 'none' }}>
                  {ok ? <CheckCircle2 size={13} color={C.up} style={{ flexShrink:0, marginTop:1 }} /> : <AlertCircle size={13} color={C.down} style={{ flexShrink:0, marginTop:1 }} />}
                  <div>
                    <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color: ok ? C.t1 : C.down, marginBottom:2 }}>{action}</div>
                    <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.5 }}>{note}</div>
                  </div>
                </div>
              ))}
            </MCard>
          </div>
        </>
      )}

      {/* Inheritance: inherited account rules */}
      {event.accounts && (
        <>
          <MSectionHeader label="Inherited Account Rules" />
          <div style={{ padding:'0 16px' }}>
            <MCard style={{ padding:0, overflow:'hidden' }}>
              {event.accounts.map(({ type, rule, detail }, i) => (
                <div key={i} style={{ padding:'12px 14px', borderBottom: i < event.accounts.length-1 ? `1px solid ${C.b1}` : 'none' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:4, flexWrap:'wrap' }}>
                    <span style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.t1 }}>{type}</span>
                    <span style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.teal, background:`rgba(0,180,198,0.12)`, border:`1px solid ${C.tealBdr}`, borderRadius:20, padding:'1px 6px' }}>{rule}</span>
                  </div>
                  <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.55 }}>{detail}</div>
                </div>
              ))}
            </MCard>
          </div>
          <MSectionHeader label="What to Do With a Lump Sum" />
          <div style={{ padding:'0 16px' }}>
            <MCard style={{ padding:0, overflow:'hidden' }}>
              {event.steps.map(({ num, label, note, color }, i) => (
                <div key={i} style={{ display:'flex', gap:10, padding:'11px 14px', borderBottom: i < event.steps.length-1 ? `1px solid ${C.b1}` : 'none' }}>
                  <div style={{ width:24, height:24, borderRadius:'50%', background:color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <span style={{ fontFamily:MONO, fontSize:11, fontWeight:700, color:'#1a1410' }}>{num}</span>
                  </div>
                  <div>
                    <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.t1, marginBottom:2 }}>{label}</div>
                    <div style={{ fontFamily:UI, fontSize:11, color:C.t3, lineHeight:1.55 }}>{note}</div>
                  </div>
                </div>
              ))}
            </MCard>
            <div style={{ background:`rgba(192,57,43,0.08)`, border:`1px solid rgba(192,57,43,0.22)`, borderRadius:12, padding:'12px 14px', marginTop:8 }}>
              <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.down, marginBottom:4 }}>The 6–12 Month Rule</div>
              <p style={{ fontFamily:UI, fontSize:11, color:C.t2, lineHeight:1.65, margin:0 }}>Do not make any major financial decisions — buying a house, quitting your job, giving large gifts — for at least 6–12 months after receiving an inheritance. Park the money in a HYSA and let the grief process first.</p>
            </div>
          </div>
        </>
      )}

      <div style={{ height:8 }} />
    </>
  )
}

/* ════════════════════════════════════════════════════════════════
   ROOT COMPONENT
════════════════════════════════════════════════════════════════ */
const MAIN_TABS  = [['events','Events'],['calc','Calculate']]
const CALC_TABS  = [['529','529 College Savings'],['emergency','Emergency Fund']]

export default function MLifeEvents() {
  const [mainTab, setMainTab]   = useState('events')
  const [selected, setSelected] = useState(0)
  const [calcSub, setCalcSub]   = useState('529')

  const event = EVENTS[selected]

  return (
    <div style={{ background:C.bg, minHeight:'100dvh', paddingBottom:88 }}>
      <ScreenHeader title="Life Events" subtitle="Learn" accent={C.indigo} />

      {/* Main tabs */}
      <div style={{ display:'flex', borderBottom:`1px solid ${C.b2}`, background:C.bg }}>
        {MAIN_TABS.map(([k, l]) => (
          <button key={k} onClick={() => setMainTab(k)} style={{
            flex:1, padding:'11px 0', background:'none', border:'none', cursor:'pointer',
            borderBottom:`2px solid ${mainTab===k ? C.indigo : 'transparent'}`,
            fontFamily:UI, fontSize:12, fontWeight:600,
            color: mainTab===k ? C.indigo : C.t3,
          }}>{l}</button>
        ))}
      </div>

      {mainTab === 'events' && (
        <>
          {/* Event grid selector */}
          <div style={{ padding:'12px 16px 0', display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8 }}>
            {EVENTS.map((e, i) => (
              <button key={e.key} onClick={() => setSelected(i)} style={{
                background: selected===i ? `${e.color}18` : C.surf,
                border:`1px solid ${selected===i ? e.color : C.b2}`,
                borderRadius:12, padding:'10px 4px', cursor:'pointer', textAlign:'center',
              }}>
                <div style={{ marginBottom:4, display:'flex', justifyContent:'center' }}>
                  <e.icon size={18} color={selected===i ? e.color : C.t3} />
                </div>
                <div style={{ fontFamily:UI, fontSize:9, fontWeight:600, color: selected===i ? e.color : C.t3, lineHeight:1.3 }}>
                  {e.name.length > 12 ? e.name.slice(0,11)+'…' : e.name}
                </div>
              </button>
            ))}
          </div>

          {/* Event header */}
          <div style={{ padding:'14px 16px 0', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:44, height:44, borderRadius:14, background:`${event.color}14`, border:`1px solid ${event.color}28`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <event.icon size={22} color={event.color} />
            </div>
            <div>
              <div style={{ fontFamily:DISPLAY, fontSize:20, fontWeight:700, color:event.color }}>{event.name}</div>
              <div style={{ fontFamily:UI, fontSize:11, color:C.t3 }}>
                {event.tasks ? `${event.tasks.reduce((a, g) => a + g.items.length, 0)} financial action items` : 'Financial guidance'}
              </div>
            </div>
          </div>

          <EventDetail event={event} />
        </>
      )}

      {mainTab === 'calc' && (
        <>
          <div style={{ display:'flex', gap:6, padding:'10px 16px', overflowX:'auto', scrollbarWidth:'none' }}>
            {CALC_TABS.map(([k, l]) => (
              <button key={k} onClick={() => setCalcSub(k)} style={{
                flexShrink:0, padding:'6px 14px', borderRadius:20,
                border:`1px solid ${calcSub===k ? C.indigo : C.b2}`,
                background: calcSub===k ? `rgba(129,140,248,0.14)` : C.surf,
                fontFamily:UI, fontSize:12, fontWeight:600,
                color: calcSub===k ? C.indigo : C.t3, cursor:'pointer',
              }}>{l}</button>
            ))}
          </div>
          {calcSub === '529'       && <Calc529 />}
          {calcSub === 'emergency' && <CalcEmergency />}
        </>
      )}
    </div>
  )
}
