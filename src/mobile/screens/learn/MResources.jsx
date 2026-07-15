import { useState } from 'react'
import {
  BookOpen, ExternalLink, Search,
  Wallet, CreditCard, TrendingUp, Shield, ScrollText,
  Clock, Home, Calendar, Headphones, BookMarked, Globe,
} from 'lucide-react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'

const CATEGORIES = [
  { id:'all',            label:'All Resources',     Icon:BookOpen,   color:C.t1         },
  { id:'budgeting',      label:'Budgeting',          Icon:Wallet,     color:'#22c55e'    },
  { id:'debt',           label:'Debt & Credit',      Icon:CreditCard, color:'#ef4444'    },
  { id:'investing',      label:'Investing',           Icon:TrendingUp, color:C.teal      },
  { id:'insurance',      label:'Insurance',           Icon:Shield,     color:'#8b5cf6'   },
  { id:'estate',         label:'Estate Planning',     Icon:ScrollText, color:'#f59e0b'   },
  { id:'retirement',     label:'Retirement',          Icon:Clock,      color:'#ec4899'   },
  { id:'majorpurchases', label:'Major Purchases',     Icon:Home,       color:C.t3        },
  { id:'lifeevents',     label:'Life Events',         Icon:Calendar,   color:'#f97316'   },
  { id:'books',          label:'Books',               Icon:BookMarked, color:'#0ea5e9'   },
  { id:'podcasts',       label:'Podcasts',            Icon:Headphones, color:'#a855f7'   },
  { id:'government',     label:'Government Tools',    Icon:Globe,      color:'#14b8a6'   },
]

const RESOURCES = [
  // BUDGETING
  { id:'ynab',       category:'budgeting', type:'Tool',
    name:'YNAB (You Need a Budget)',
    desc:'The gold standard budgeting app. Based on zero-based budgeting — every dollar gets a job. Paid subscription but most users find it pays for itself quickly.',
    url:'https://www.youneedabudget.com', tags:['budgeting','zero-based','app'] },
  { id:'monarch',    category:'budgeting', type:'Tool',
    name:'Monarch Money',
    desc:'Comprehensive budgeting and net worth tracking app. Connects to accounts, tracks spending automatically, and shows trends over time.',
    url:'https://www.monarchmoney.com', tags:['budgeting','tracking','net worth'] },
  { id:'cfpb-budget',category:'budgeting', type:'Guide',
    name:'CFPB — Making a Budget',
    desc:'Free, official guide to creating a household budget from the Consumer Financial Protection Bureau. Includes worksheets.',
    url:'https://www.consumerfinance.gov/consumer-tools/budget/', tags:['budgeting','free','government'] },
  { id:'nw-5030',    category:'budgeting', type:'Guide',
    name:'NerdWallet — 50/30/20 Budget Rule',
    desc:'Plain-language explanation of the 50/30/20 budgeting framework — needs, wants, and savings.',
    url:'https://www.nerdwallet.com/article/finance/nerdwallet-budget-calculator', tags:['budgeting','50/30/20','framework'] },

  // DEBT & CREDIT
  { id:'annualcredit',category:'debt', type:'Tool',
    name:'AnnualCreditReport.com',
    desc:'The only official site for free credit reports from all three bureaus. You\'re entitled to one from each bureau every year by federal law.',
    url:'https://www.annualcreditreport.com', tags:['credit','free','government','report'] },
  { id:'creditkarma', category:'debt', type:'Tool',
    name:'Credit Karma',
    desc:'Free credit score monitoring with TransUnion and Equifax. Shows factors affecting your score and flags changes.',
    url:'https://www.creditkarma.com', tags:['credit','free','monitoring','score'] },
  { id:'nfcc',        category:'debt', type:'Service',
    name:'NFCC — Credit Counseling',
    desc:'Find nonprofit credit counselors who can help with debt management plans, budgeting, and student loan counseling. Low-cost or free.',
    url:'https://www.nfcc.org', tags:['debt','counseling','nonprofit','free'] },
  { id:'studentaid',  category:'debt', type:'Tool',
    name:'Federal Student Aid — IDR Plans',
    desc:'Official tool to explore income-driven repayment plans, PSLF eligibility, and federal loan management.',
    url:'https://studentaid.gov/manage-loans/repayment/plans/income-driven', tags:['debt','student loans','repayment','government'] },
  { id:'cfpb-debt',   category:'debt', type:'Guide',
    name:'CFPB — Debt Collection Rights',
    desc:'Know your rights under the Fair Debt Collection Practices Act. What collectors can and cannot do.',
    url:'https://www.consumerfinance.gov/consumer-tools/debt-collection/', tags:['debt','rights','government'] },

  // INVESTING
  { id:'bogleheads',  category:'investing', type:'Community',
    name:'Bogleheads Wiki',
    desc:'The most comprehensive free resource on index fund investing, asset allocation, and long-term wealth building. Based on John Bogle\'s philosophy.',
    url:'https://www.bogleheads.org/wiki/Main_Page', tags:['investing','index funds','education','free'] },
  { id:'investor-gov',category:'investing', type:'Tool',
    name:'Investor.gov (SEC)',
    desc:'Official SEC investor education site. Includes compound interest calculator, broker check tool, and guides on investment fraud.',
    url:'https://www.investor.gov', tags:['investing','government','SEC','education'] },
  { id:'brokercheck', category:'investing', type:'Tool',
    name:'FINRA BrokerCheck',
    desc:'Verify the credentials and disciplinary history of any financial advisor or broker before working with them. Free and essential.',
    url:'https://brokercheck.finra.org', tags:['investing','advisor','verification','free'] },
  { id:'etfdb',       category:'investing', type:'Tool',
    name:'ETF Database (ETF.com)',
    desc:'Research and compare ETFs by category, expense ratio, holdings, and performance. Essential for building an index fund portfolio.',
    url:'https://www.etf.com', tags:['investing','ETF','research'] },
  { id:'pf-wiki',     category:'investing', type:'Guide',
    name:'r/personalfinance Wiki',
    desc:'Community-maintained guide covering the "prime directive" — an ordered flowchart for what to do with your money.',
    url:'https://www.reddit.com/r/personalfinance/wiki/index/', tags:['investing','budgeting','framework','free'] },

  // INSURANCE
  { id:'naic',         category:'insurance', type:'Tool',
    name:'NAIC Consumer Tools',
    desc:'The National Association of Insurance Commissioners\' consumer portal. Look up your state\'s insurance department, file complaints, and compare insurers.',
    url:'https://content.naic.org/consumer', tags:['insurance','government','comparison'] },
  { id:'policygenius', category:'insurance', type:'Tool',
    name:'Policygenius',
    desc:'Compare life, disability, home, and auto insurance quotes across multiple insurers in one place. Independent broker — not tied to one company.',
    url:'https://www.policygenius.com', tags:['insurance','comparison','quotes','life'] },
  { id:'healthcare-gov',category:'insurance', type:'Tool',
    name:'HealthCare.gov',
    desc:'Official ACA marketplace for health insurance. Compare plans, check eligibility for subsidies, and enroll during open enrollment or SEP.',
    url:'https://www.healthcare.gov', tags:['insurance','health','ACA','government'] },
  { id:'diquote',      category:'insurance', type:'Tool',
    name:'DI Quote (Disability Insurance)',
    desc:'Independent resource for comparing disability insurance quotes. Disability insurance is notoriously hard to shop — use an independent broker.',
    url:'https://www.diaquote.com', tags:['insurance','disability','quotes'] },

  // ESTATE
  { id:'trustandwill', category:'estate', type:'Tool',
    name:'Trust & Will',
    desc:'Online platform for creating wills, trusts, POAs, and healthcare directives. State-specific documents. $39–$199.',
    url:'https://trustandwill.com', tags:['estate','will','trust','POA'] },
  { id:'freewill',     category:'estate', type:'Tool',
    name:'FreeWill',
    desc:'Truly free online will creation tool. Simple estates. Partnered with nonprofits for charitable giving integration.',
    url:'https://www.freewill.com', tags:['estate','will','free'] },
  { id:'caringinfo',   category:'estate', type:'Tool',
    name:'CaringInfo — Advance Directives',
    desc:'Free state-specific advance directive forms for all 50 states from the National Hospice and Palliative Care Organization.',
    url:'https://www.caringinfo.org/planning/advance-directives/', tags:['estate','healthcare directive','free'] },
  { id:'naela',        category:'estate', type:'Service',
    name:'NAELA — Elder Law Attorneys',
    desc:'Find attorneys specializing in estate planning, elder law, special needs trusts, and Medicaid planning.',
    url:'https://www.naela.org', tags:['estate','attorney','elder law'] },

  // RETIREMENT
  { id:'ssa',          category:'retirement', type:'Tool',
    name:'SSA My Account',
    desc:'See your complete earnings history and projected Social Security benefits at ages 62, 67, and 70. Essential for retirement planning.',
    url:'https://www.ssa.gov/myaccount/', tags:['retirement','social security','government','free'] },
  { id:'firecalc',     category:'retirement', type:'Tool',
    name:'FIRECalc',
    desc:'Historical retirement success calculator. Tests your withdrawal rate against every 30-year market period in history.',
    url:'https://firecalc.com', tags:['retirement','calculator','withdrawal','free'] },
  { id:'newretirement',category:'retirement', type:'Tool',
    name:'NewRetirement',
    desc:'Comprehensive retirement planning platform. Models Social Security, taxes, RMDs, spending, and Monte Carlo scenarios. Free tier available.',
    url:'https://www.newretirement.com', tags:['retirement','planning','social security'] },
  { id:'irs-retirement',category:'retirement', type:'Guide',
    name:'IRS Retirement Plans',
    desc:'Official IRS guidance on contribution limits, plan rules, RMDs, and rollover requirements for all retirement account types.',
    url:'https://www.irs.gov/retirement-plans', tags:['retirement','IRA','401k','government'] },

  // MAJOR PURCHASES
  { id:'cfpb-home',    category:'majorpurchases', type:'Guide',
    name:'CFPB — Owning a Home',
    desc:'Step-by-step guide to the homebuying process, mortgage types, closing costs, and your rights as a buyer.',
    url:'https://www.consumerfinance.gov/owning-a-home/', tags:['home','mortgage','buying','government'] },
  { id:'edmunds',      category:'majorpurchases', type:'Tool',
    name:'Edmunds True Market Value',
    desc:'See what others are actually paying for any car — new or used. Essential before walking into any dealership.',
    url:'https://www.edmunds.com/tmv.html', tags:['car','pricing','negotiation'] },
  { id:'carfax',       category:'majorpurchases', type:'Tool',
    name:'Carfax Vehicle History',
    desc:'Check accident history, odometer readings, ownership records, and title issues on any used vehicle. Always check before buying used.',
    url:'https://www.carfax.com', tags:['car','used','history','research'] },
  { id:'nyt-rentbuy',  category:'majorpurchases', type:'Tool',
    name:'NYT Rent vs. Buy Calculator',
    desc:'The most comprehensive rent vs. buy analysis available. Accounts for opportunity cost, appreciation, taxes, and all true costs.',
    url:'https://www.nytimes.com/interactive/2014/upshot/buy-rent-calculator.html', tags:['home','rent vs buy','calculator'] },
  { id:'hysa',         category:'majorpurchases', type:'Tool',
    name:'NerdWallet — Best HYSA Rates',
    desc:'Current high-yield savings account rates updated regularly. Use for goal savings, down payments, and emergency funds.',
    url:'https://www.nerdwallet.com/best/banking/high-yield-online-savings-accounts', tags:['savings','HYSA','rates'] },

  // LIFE EVENTS
  { id:'careeronestop',category:'lifeevents', type:'Tool',
    name:'CareerOneStop — Unemployment',
    desc:'Find your state\'s unemployment benefits information, filing instructions, and career resources.',
    url:'https://www.careeronestop.org/LocalHelp/UnemploymentBenefits/find-unemployment-benefits.aspx', tags:['job loss','unemployment','government'] },
  { id:'healthcare-sep',category:'lifeevents', type:'Tool',
    name:'HealthCare.gov — Special Enrollment',
    desc:'Enroll in ACA health coverage after a qualifying life event (job loss, marriage, birth, divorce). 60-day window.',
    url:'https://www.healthcare.gov/coverage-outside-open-enrollment/special-enrollment-period/', tags:['life events','health insurance','ACA'] },
  { id:'cdfa',          category:'lifeevents', type:'Service',
    name:'Institute for Divorce Financial Analysts',
    desc:'Find a Certified Divorce Financial Analyst (CDFA) who can model the long-term financial impact of different settlement scenarios.',
    url:'https://institutedfa.com/finding-a-cdfa/', tags:['divorce','financial planning','specialist'] },
  { id:'529-compare',   category:'lifeevents', type:'Tool',
    name:'Savingforcollege.com — 529 Plans',
    desc:'Compare 529 college savings plans by state, investment options, performance, and tax benefits.',
    url:'https://www.savingforcollege.com/529-plans/', tags:['baby','college','529','savings'] },

  // BOOKS
  { id:'total-money',   category:'books', type:'Book',
    name:'The Total Money Makeover — Dave Ramsey',
    desc:'Straightforward debt elimination framework. Best for people motivated by a structured, step-by-step plan. Heavy on motivation, light on investing nuance.',
    url:'https://www.amazon.com/Total-Money-Makeover-Classic-Financial/dp/1595555277', tags:['books','debt','budgeting','beginner'] },
  { id:'psych-money',   category:'books', type:'Book',
    name:'The Psychology of Money — Morgan Housel',
    desc:'The best book on how human behavior affects financial decisions. Short essays, highly readable, and genuinely changes how you think about wealth.',
    url:'https://www.amazon.com/Psychology-Money-Timeless-lessons-happiness/dp/0857197681', tags:['books','mindset','investing','behavior'] },
  { id:'little-book',   category:'books', type:'Book',
    name:'The Little Book of Common Sense Investing — John Bogle',
    desc:'The definitive case for index fund investing by the founder of Vanguard. Short, evidence-based, and changed how millions invest.',
    url:'https://www.amazon.com/Little-Book-Common-Sense-Investing/dp/1119404509', tags:['books','investing','index funds','beginner'] },
  { id:'richest-man',   category:'books', type:'Book',
    name:'The Richest Man in Babylon — George S. Clason',
    desc:'Timeless financial principles told through ancient Babylonian parables. Pay yourself first, avoid debt, invest wisely. Easy read with lasting impact.',
    url:'https://www.amazon.com/Richest-Man-Babylon-George-Clason/dp/1505339111', tags:['books','fundamentals','beginner','classic'] },
  { id:'iw',            category:'books', type:'Book',
    name:'I Will Teach You to Be Rich — Ramit Sethi',
    desc:'Practical, no-BS guide for young adults. Covers automating finances, credit cards, investing basics, and negotiating. Opinionated and entertaining.',
    url:'https://www.amazon.com/Will-Teach-You-Rich-Second/dp/1523505745', tags:['books','young adults','automation','investing','beginner'] },
  { id:'millionaire',   category:'books', type:'Book',
    name:'The Millionaire Next Door — Thomas Stanley',
    desc:'Research-based look at how real millionaires actually live and build wealth — often not what you\'d expect. Great for reframing what financial success looks like.',
    url:'https://www.amazon.com/Millionaire-Next-Door-Surprising-Americas/dp/1589795474', tags:['books','wealth','mindset','research'] },

  // PODCASTS
  { id:'planet-money',  category:'podcasts', type:'Podcast',
    name:'Planet Money — NPR',
    desc:'Short, story-driven episodes explaining economic and financial concepts in an entertaining way. Great for building broad financial literacy.',
    url:'https://www.npr.org/sections/money/', tags:['podcasts','economics','education','free'] },
  { id:'motley-fool',   category:'podcasts', type:'Podcast',
    name:'Motley Fool Money',
    desc:'Weekly investing podcast covering markets, individual stocks, and personal finance. Good for staying informed on investing topics.',
    url:'https://www.fool.com/podcasts/motley-fool-money/', tags:['podcasts','investing','markets'] },
  { id:'bigger-pockets',category:'podcasts', type:'Podcast',
    name:'BiggerPockets Money',
    desc:'Financial independence, FIRE movement, and money mindset. Interviews with people who achieved financial independence at various income levels.',
    url:'https://www.biggerpockets.com/podcasts/money', tags:['podcasts','FIRE','financial independence','investing'] },
  { id:'afford-anything',category:'podcasts', type:'Podcast',
    name:'Afford Anything — Paula Pant',
    desc:'Thoughtful interviews on financial independence, real estate, and building a life by design. One of the best for nuanced financial thinking.',
    url:'https://affordanything.com/podcast/', tags:['podcasts','financial independence','real estate','FIRE'] },
  { id:'choosefi',      category:'podcasts', type:'Podcast',
    name:'ChooseFI',
    desc:'Community-focused financial independence podcast. Covers investing, travel hacking, frugality, and alternative income streams.',
    url:'https://www.choosefi.com/podcast/', tags:['podcasts','FIRE','financial independence','frugality'] },

  // GOVERNMENT
  { id:'irs',           category:'government', type:'Tool',
    name:'IRS.gov',
    desc:'Official tax authority. Tax brackets, deductions, withholding calculator, forms, and publications. The primary source for tax law.',
    url:'https://www.irs.gov', tags:['government','tax','official'] },
  { id:'sec',           category:'government', type:'Tool',
    name:'SEC.gov — Investor Education',
    desc:'Official investor education from the Securities and Exchange Commission. Investment basics, fraud alerts, and public company filings (EDGAR).',
    url:'https://www.sec.gov/investor', tags:['government','investing','SEC','fraud'] },
  { id:'cfpb',          category:'government', type:'Tool',
    name:'Consumer Financial Protection Bureau',
    desc:'Federal agency protecting consumers in financial markets. Submit complaints, read your rights, and access free financial education tools.',
    url:'https://www.consumerfinance.gov', tags:['government','consumer rights','complaints','education'] },
  { id:'mymoney',       category:'government', type:'Tool',
    name:'MyMoney.gov',
    desc:'Official U.S. government financial literacy portal. Guides on budgeting, credit, housing, retirement, and more across all life stages.',
    url:'https://www.mymoney.gov', tags:['government','financial literacy','education','free'] },
  { id:'dol',           category:'government', type:'Tool',
    name:'Dept. of Labor — Benefits & Retirement',
    desc:'Official guidance on 401(k) rules, ERISA protections, pension rights, COBRA, and retirement plan disclosures.',
    url:'https://www.dol.gov/agencies/ebsa', tags:['government','401k','retirement','ERISA'] },
]

const TYPE_META = {
  Tool:      { bg:'rgba(3,105,161,0.10)',  color:'#0369a1'  },
  Guide:     { bg:'rgba(74,124,89,0.10)',  color:'#4a7c59'  },
  Book:      { bg:'rgba(133,77,14,0.10)',  color:'#854d0e'  },
  Podcast:   { bg:'rgba(126,34,206,0.10)', color:'#7e22ce'  },
  Service:   { bg:'rgba(190,18,60,0.10)',  color:'#be123c'  },
  Community: { bg:'rgba(22,101,52,0.10)',  color:'#166534'  },
}

const GLOSSARY = [
  { t:'APR', d:'Annual Percentage Rate — total yearly cost of borrowing including fees and interest.' },
  { t:'Asset Allocation', d:'How you divide investments among asset classes (stocks, bonds, cash, alternatives).' },
  { t:'Basis Points (bps)', d:'1/100th of a percent. 100 basis points = 1%. Used in rate discussions.' },
  { t:'CAGR', d:'Compound Annual Growth Rate — the year-over-year growth rate over a specified period.' },
  { t:'Capital Gains', d:'Profit from selling an asset above purchase price. Short-term (<1yr) taxed as ordinary income, long-term at 0/15/20%.' },
  { t:'Dollar-Cost Averaging', d:'Investing a fixed amount at regular intervals regardless of market price.' },
  { t:'EBITDA', d:'Earnings Before Interest, Taxes, Depreciation, and Amortization. Common profitability metric.' },
  { t:'Expense Ratio', d:'Annual fund management fee as a percentage of assets. Index funds: 0.03–0.20%. Actively managed: 0.5–1.5%.' },
  { t:'FDIC Insurance', d:'Federal Deposit Insurance covers bank deposits up to $250K per depositor per institution.' },
  { t:'Fiduciary', d:'Legal obligation to act in the client\'s best interest. CFPs and RIAs have fiduciary duty; brokers may not.' },
  { t:'HELOC', d:'Home Equity Line of Credit — revolving credit line secured by home equity.' },
  { t:'Inflation', d:'Rate at which the purchasing power of money decreases over time. Fed target: ~2%.' },
  { t:'Liquidity', d:'How easily an asset can be converted to cash without significant loss of value.' },
  { t:'Net Worth', d:'Total assets minus total liabilities. The foundational measure of financial health.' },
  { t:'PMI', d:'Private Mortgage Insurance — required when down payment is below 20%. Cancels at 80% LTV.' },
  { t:'Rebalancing', d:'Restoring a portfolio to its target allocation by selling overweight and buying underweight assets.' },
  { t:'REIT', d:'Real Estate Investment Trust — publicly traded companies owning income-producing real estate.' },
  { t:'Risk Tolerance', d:'Your ability and willingness to endure portfolio fluctuations without selling at a loss.' },
  { t:'Time Value of Money', d:'A dollar today is worth more than a dollar in the future due to its earning potential.' },
  { t:'Vesting Schedule', d:'Timeline over which employer contributions to a retirement plan become fully yours.' },
]

const FORMULAS = [
  { f:'Net Worth',              eq:'Total Assets − Total Liabilities'                      },
  { f:'Savings Rate',           eq:'Monthly Savings ÷ Monthly Income × 100'                },
  { f:'Debt-to-Income (DTI)',   eq:'Monthly Debt Payments ÷ Gross Monthly Income'          },
  { f:'Emergency Fund Target',  eq:'Monthly Expenses × 3 to 6'                             },
  { f:'Rule of 72',             eq:'72 ÷ Annual Return Rate = Years to Double'              },
  { f:'4% Rule',                eq:'Annual Withdrawal = Portfolio × 0.04'                  },
  { f:'FIRE Number',            eq:'Annual Expenses × 25'                                   },
  { f:'PMI Required',           eq:'Home Price × (1 − Down %) > 80% LTV'                  },
  { f:'Mortgage Affordability', eq:'Annual Gross Income × 2.5–3.5'                         },
  { f:'Effective Tax Rate',     eq:'Total Tax ÷ Gross Income × 100'                        },
]

const TABS = [
  { key:'resources', label:'Resources'  },
  { key:'glossary',  label:'Glossary'   },
  { key:'formulas',  label:'Formulas'   },
]

export default function MResources() {
  const [tab, setTab]       = useState('resources')
  const [cat, setCat]       = useState('all')
  const [query, setQuery]   = useState('')

  const filtered = RESOURCES.filter(r => {
    const matchCat = cat === 'all' || r.category === cat
    const q = query.toLowerCase()
    const matchQ = !q || r.name.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q) || r.tags.some(t => t.includes(q))
    return matchCat && matchQ
  })

  const activeCat = CATEGORIES.find(c => c.id === cat)

  return (
    <div style={{ background:C.bg, minHeight:'100dvh', paddingBottom:88 }}>
      <ScreenHeader title="Resource Directory" subtitle="Learn" accent={C.teal} />

      {/* Top tab bar */}
      <div style={{ display:'flex', borderBottom:`1px solid ${C.b2}`, background:C.bg }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex:1, padding:'11px 0', background:'none', border:'none', cursor:'pointer',
            borderBottom:`2px solid ${tab === t.key ? C.teal : 'transparent'}`,
            fontFamily:UI, fontSize:12, fontWeight:600,
            color: tab === t.key ? C.teal : C.t3,
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── RESOURCES TAB ─────────────────────────────────────── */}
      {tab === 'resources' && (
        <div>
          {/* Search */}
          <div style={{ padding:'12px 16px 0' }}>
            <div style={{ position:'relative' }}>
              <Search size={14} color={C.t3} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search resources, tools, books..."
                style={{ width:'100%', boxSizing:'border-box', background:C.surf, border:`1px solid ${C.b2}`, borderRadius:12, padding:'11px 12px 11px 34px', fontFamily:UI, fontSize:13, color:C.t1, outline:'none' }}
              />
            </div>
          </div>

          {/* Category filter */}
          <div style={{ padding:'10px 16px 0', display:'flex', gap:7, overflowX:'auto', scrollbarWidth:'none' }}>
            {CATEGORIES.map(c => {
              const Icon = c.Icon
              const active = cat === c.id
              return (
                <button key={c.id} onClick={() => setCat(c.id)} style={{
                  flexShrink:0, display:'flex', alignItems:'center', gap:5,
                  padding:'6px 11px', borderRadius:20,
                  border:`1.5px solid ${active ? c.color : C.b2}`,
                  background: active ? `${c.color}12` : C.surf,
                  cursor:'pointer', fontFamily:UI, fontSize:11, fontWeight:active ? 700 : 500,
                  color: active ? c.color : C.t3,
                }}>
                  <Icon size={11} color={active ? c.color : C.t3} />
                  {c.label}
                </button>
              )
            })}
          </div>

          {/* Results count */}
          <div style={{ padding:'10px 16px 4px', fontFamily:UI, fontSize:11, color:C.t3 }}>
            {filtered.length} {filtered.length === 1 ? 'resource' : 'resources'}
            {activeCat && cat !== 'all' ? ` in ${activeCat.label}` : ''}
          </div>

          {/* Resource cards */}
          <div style={{ padding:'0 16px 12px' }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign:'center', padding:'40px 20px', color:C.t3, fontFamily:UI, fontSize:13 }}>No resources found for "{query}"</div>
            ) : (
              filtered.map(r => {
                const tm = TYPE_META[r.type] || TYPE_META.Tool
                return (
                  <div key={r.id} style={{ background:C.surf, border:`1px solid ${C.b1}`, borderRadius:16, padding:'13px 14px', marginBottom:8, boxShadow:'0 1px 6px rgba(28,21,16,0.05)' }}>
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10, marginBottom:6 }}>
                      <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.t1, lineHeight:1.3, flex:1 }}>{r.name}</div>
                      <span style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:tm.color, background:tm.bg, borderRadius:5, padding:'2px 6px', flexShrink:0, textTransform:'uppercase', letterSpacing:'0.07em' }}>{r.type}</span>
                    </div>
                    <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65, marginBottom:10 }}>{r.desc}</div>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <div style={{ display:'flex', gap:5, flexWrap:'wrap', flex:1, minWidth:0 }}>
                        {r.tags.slice(0,3).map(tag => (
                          <span key={tag} style={{ fontFamily:UI, fontSize:9, color:C.t3, background:C.raise, border:`1px solid ${C.b1}`, borderRadius:5, padding:'2px 6px' }}>{tag}</span>
                        ))}
                      </div>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ display:'flex', alignItems:'center', gap:4, padding:'6px 10px', borderRadius:8, background:`${C.teal}12`, border:`1px solid ${C.teal}28`, textDecoration:'none', flexShrink:0, marginLeft:8 }}>
                        <span style={{ fontFamily:UI, fontSize:11, fontWeight:600, color:C.teal }}>Open</span>
                        <ExternalLink size={10} color={C.teal} />
                      </a>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* ── GLOSSARY TAB ─────────────────────────────────────── */}
      {tab === 'glossary' && (
        <div style={{ padding:'12px 16px 0' }}>
          <div style={{ fontFamily:UI, fontSize:12, color:C.t3, marginBottom:12, lineHeight:1.6 }}>
            {GLOSSARY.length} essential financial terms defined in plain language.
          </div>
          <div style={{ background:C.surf, border:`1px solid ${C.b1}`, borderRadius:16, overflow:'hidden', boxShadow:'0 1px 6px rgba(28,21,16,0.05)' }}>
            {GLOSSARY.map((item, i) => (
              <div key={item.t} style={{ padding:'12px 14px', borderBottom: i < GLOSSARY.length - 1 ? `1px solid ${C.b1}` : 'none' }}>
                <div style={{ fontFamily:MONO, fontSize:12, fontWeight:700, color:C.teal, marginBottom:3 }}>{item.t}</div>
                <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.6 }}>{item.d}</div>
              </div>
            ))}
          </div>
          <div style={{ height:8 }} />
        </div>
      )}

      {/* ── FORMULAS TAB ─────────────────────────────────────── */}
      {tab === 'formulas' && (
        <div style={{ padding:'12px 16px 0' }}>
          <div style={{ fontFamily:UI, fontSize:12, color:C.t3, marginBottom:12, lineHeight:1.6 }}>
            The essential financial formulas every person should know.
          </div>
          <div style={{ background:C.surf, border:`1px solid ${C.b1}`, borderRadius:16, overflow:'hidden', boxShadow:'0 1px 6px rgba(28,21,16,0.05)' }}>
            {FORMULAS.map((f, i) => (
              <div key={f.f} style={{ padding:'12px 14px', borderBottom: i < FORMULAS.length - 1 ? `1px solid ${C.b1}` : 'none' }}>
                <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.teal, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:5 }}>{f.f}</div>
                <div style={{ fontFamily:MONO, fontSize:12, color:C.t1, background:C.raise, borderRadius:8, padding:'7px 10px' }}>{f.eq}</div>
              </div>
            ))}
          </div>
          <div style={{ height:8 }} />
        </div>
      )}
    </div>
  )
}
