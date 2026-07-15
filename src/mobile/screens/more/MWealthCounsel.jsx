import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, MapPin, Star, ChevronRight, ChevronLeft, X,
  Phone, Mail, Globe, Award, Clock, BookOpen, FileText,
  DollarSign, Heart, Sliders, RotateCcw, BadgeCheck,
  User, Shield, Briefcase,
} from 'lucide-react'
import { C, UI, MONO, DISPLAY } from '../../tokens'

const TEAL = C.teal
const GOLD = '#c9a86e'

/* ── Full advisor data (matches website exactly) ─────────────────── */
const ADVISORS = [
  {
    id:1, name:'Sarah Chen, CFP® CPA', photo:'https://i.pravatar.cc/200?img=47',
    title:'Senior Wealth Advisor', firm:'Horizon Wealth Partners', firmType:'RIA – Fee-Only',
    location:'San Francisco, CA', state:'CA',
    phone:'(415) 555-0182', email:'s.chen@horizonwp.com', website:'horizonwealthpartners.com',
    credentials:['CFP®','CPA'], specialties:['Tech Executive Wealth','Equity Compensation','Tax Planning','Retirement'],
    aumMin:500000, aumDisplay:'$500K minimum', yearsExp:18,
    bio:'Sarah specializes in comprehensive financial planning for technology executives navigating complex equity compensation structures — RSUs, ISOs, and NQSOs. With 18 years in financial services and a background in tax advisory, she brings a holistic approach that integrates tax efficiency, investment strategy, and long-term planning.',
    approach:'Tax-first, fee-only planning with no product sales. Every recommendation is made solely in the client\'s best interest.',
    education:'BS Finance, UC Berkeley · MBA, Stanford GSB',
    clientFocus:'Tech executives, startup founders, dual-income professionals',
    rating:4.9, reviews:47, languages:['English','Mandarin'],
    awards:['Forbes Best-In-State 2024','Five Star Professional 2022–2024'],
    fee:'1% AUM / Flat fee available',
  },
  {
    id:2, name:'Michael Torres, CFP® CFA', photo:'https://i.pravatar.cc/200?img=52',
    title:'Managing Director, Wealth Management', firm:'Atlas Capital Advisors', firmType:'RIA – Fee-Only',
    location:'New York, NY', state:'NY',
    phone:'(212) 555-0374', email:'m.torres@atlascapital.com', website:'atlascapitaladvisors.com',
    credentials:['CFP®','CFA'], specialties:['Portfolio Management','Retirement Planning','Institutional','Alternative Investments'],
    aumMin:1000000, aumDisplay:'$1M minimum', yearsExp:24,
    bio:'Michael brings institutional investment discipline to individual and family wealth. Before founding Atlas Capital, he spent 12 years managing a $2B endowment portfolio at a major university. He applies the same evidence-based, low-cost investment philosophy to his private clients.',
    approach:'Evidence-based, factor-driven investing. No proprietary products. Full fiduciary standard.',
    education:'BS Economics, Columbia University · CFA Charterholder',
    clientFocus:'High-net-worth individuals, family offices, executives in transition',
    rating:4.8, reviews:62, languages:['English','Spanish'],
    awards:['Barron\'s Top 1,200 Advisors 2023','NAPFA Member of the Year 2021'],
    fee:'0.75–1% AUM tiered',
  },
  {
    id:3, name:'Jennifer Walsh, JD CFP®', photo:'https://i.pravatar.cc/200?img=49',
    title:'Estate & Trust Specialist', firm:'Covenant Estate Planning Group', firmType:'Fee-Only RIA + Legal',
    location:'Chicago, IL', state:'IL',
    phone:'(312) 555-0219', email:'j.walsh@covenantestate.com', website:'covenantestateplanning.com',
    credentials:['JD','CFP®','CTFA'], specialties:['Estate Planning','Trusts & Wills','Tax-Efficient Transfers','Business Succession'],
    aumMin:250000, aumDisplay:'$250K minimum', yearsExp:21,
    bio:'Jennifer is one of the few advisors who holds both a law degree and a CFP® designation, allowing her to provide truly integrated estate and financial planning under one roof. She focuses on multi-generational wealth transfer, business succession, and complex trust structures.',
    approach:'Legal precision meets financial planning. Every estate plan is built to survive tax law changes and family transitions.',
    education:'BA Political Science, Northwestern · JD, University of Chicago Law',
    clientFocus:'Business owners, multi-generational families, retirees with complex estates',
    rating:5.0, reviews:38, languages:['English'],
    awards:['Illinois Super Lawyers 2019–2024','CFP Board Distinguished Advisor 2022'],
    fee:'Flat fee / Hourly available',
  },
  {
    id:4, name:'Robert Kim, CFP® CPWA®', photo:'https://i.pravatar.cc/200?img=53',
    title:'Ultra-High-Net-Worth Advisor', firm:'Pacific Crest Family Office', firmType:'Multi-Family Office',
    location:'Los Angeles, CA', state:'CA',
    phone:'(310) 555-0447', email:'r.kim@pacificcrestfo.com', website:'pacificcrestfamilyoffice.com',
    credentials:['CFP®','CPWA®','CFA'], specialties:['Ultra-HNW Planning','Private Equity','Real Assets','Family Governance'],
    aumMin:5000000, aumDisplay:'$5M minimum', yearsExp:27,
    bio:'Robert leads the wealth advisory practice at Pacific Crest, serving families with $10M–$200M+ in assets. His team provides full family office services including investment management, tax coordination, estate planning, philanthropy, and family governance frameworks.',
    approach:'Institutional-grade strategy tailored to each family\'s values, legacy goals, and generational objectives.',
    education:'BA Economics, UCLA · MBA Finance, Wharton',
    clientFocus:'Ultra-high-net-worth families, entertainment/media executives, real estate dynasties',
    rating:4.9, reviews:22, languages:['English','Korean'],
    awards:['Worth Magazine Top Advisors 2022–2024','CPWA Designation Holder'],
    fee:'Custom family office retainer',
  },
  {
    id:5, name:'Amanda Foster, CFP®', photo:'https://i.pravatar.cc/200?img=44',
    title:'Business Owner & Retirement Specialist', firm:'Frontier Financial Planning', firmType:'RIA – Fee-Only',
    location:'Dallas, TX', state:'TX',
    phone:'(214) 555-0293', email:'a.foster@frontierfinancial.com', website:'frontierfinancialplanning.com',
    credentials:['CFP®','ChFC®'], specialties:['Business Owner Planning','Exit Strategies','Solo 401k','Retirement Income'],
    aumMin:300000, aumDisplay:'$300K minimum', yearsExp:15,
    bio:'Amanda built her practice serving the unique needs of small and mid-size business owners — from setting up tax-efficient retirement plans to structuring profitable exits. She understands that for most business owners, the business IS the retirement plan, and she helps bridge that gap.',
    approach:'Practical, owner-first planning. No jargon, no product pushing — just clear strategies that protect what you\'ve built.',
    education:'BBA Finance, University of Texas at Austin · CFP® Designation 2009',
    clientFocus:'Small business owners, medical practices, entrepreneurs, franchise operators',
    rating:4.9, reviews:56, languages:['English'],
    awards:['DFW Best Financial Advisors 2023','NAPFA Member'],
    fee:'Flat annual fee',
  },
  {
    id:6, name:'David Patel, CFA CFP®', photo:'https://i.pravatar.cc/200?img=57',
    title:'Director of Investments', firm:'Beacon Institutional Advisors', firmType:'RIA – Institutional',
    location:'Boston, MA', state:'MA',
    phone:'(617) 555-0511', email:'d.patel@beaconadvisors.com', website:'beaconinstitutional.com',
    credentials:['CFA','CFP®','CAIA'], specialties:['Endowment Strategy','ESG Investing','Factor Investing','Alternatives'],
    aumMin:750000, aumDisplay:'$750K minimum', yearsExp:20,
    bio:'David applies endowment-style investment principles to private client portfolios. Before Beacon, he was the Chief Investment Officer for a $1.4B foundation, where he pioneered their sustainable investment policy. He now brings that institutional rigor to families who want their wealth aligned with their values.',
    approach:'Evidence-based, factor-tilted investing with a strong emphasis on ESG integration and alternative assets.',
    education:'BS Mathematics, MIT · MS Finance, Boston College',
    clientFocus:'Values-aligned investors, foundations, physicians, academics',
    rating:4.8, reviews:31, languages:['English','Hindi','Gujarati'],
    awards:['CFA Institute Excellence Award 2021','Morningstar ESG Leader'],
    fee:'0.85% AUM',
  },
  {
    id:7, name:'Lisa Montgomery, CFP® ChFC®', photo:'https://i.pravatar.cc/200?img=48',
    title:'Retirement Income Specialist', firm:'Suncoast Wealth Advisors', firmType:'RIA – Fee-Only',
    location:'Miami, FL', state:'FL',
    phone:'(305) 555-0126', email:'l.montgomery@suncoastwealthadv.com', website:'suncoastwealthadvisors.com',
    credentials:['CFP®','ChFC®','RICP®'], specialties:['Retirement Income','Social Security Optimization','Long-Term Care','Medicare Planning'],
    aumMin:200000, aumDisplay:'$200K minimum', yearsExp:19,
    bio:'Lisa specializes exclusively in the transition into and through retirement. From the complex decision of when to claim Social Security to building a tax-efficient income plan that lasts 30+ years, she helps retirees navigate the financial and emotional shift from accumulation to distribution.',
    approach:'Retirement is about income, not just assets. Every plan is built around sustainable cash flow that covers the life you want.',
    education:'BA Economics, University of Florida · RICP® from The American College',
    clientFocus:'Pre-retirees 55–65, recent retirees, snowbirds, widows/widowers in transition',
    rating:4.9, reviews:74, languages:['English','Spanish'],
    awards:['Forbes Best-In-State Advisors 2023','Five Star Professional 2020–2024'],
    fee:'Flat annual fee / Hourly',
  },
  {
    id:8, name:'James Okafor, CFP®', photo:'https://i.pravatar.cc/200?img=55',
    title:'Wealth Advisor & Financial Educator', firm:'Meridian Wealth Strategies', firmType:'RIA – Fee-Only',
    location:'Atlanta, GA', state:'GA',
    phone:'(404) 555-0388', email:'j.okafor@meridianwealthstrat.com', website:'meridianwealthstrategies.com',
    credentials:['CFP®','AFC®'], specialties:['First-Generation Wealth','Student Debt Strategy','Wealth Building','Insurance Planning'],
    aumMin:100000, aumDisplay:'$100K minimum', yearsExp:12,
    bio:'James is passionate about making comprehensive financial planning accessible to first-generation wealth builders. He works with professionals who are building wealth for the first time in their families, helping them navigate everything from student debt to investment accounts to protecting their growing net worth.',
    approach:'Education-first planning. Every client understands exactly why they\'re doing what they\'re doing — no black boxes.',
    education:'BS Finance, Morehouse College · AFC® Designation',
    clientFocus:'First-gen professionals, physicians in training, young families, minority business owners',
    rating:5.0, reviews:83, languages:['English'],
    awards:['Financial Planning Association Next Gen Award 2022','Atlanta Business Chronicle 40 Under 40'],
    fee:'Flat monthly retainer',
  },
  {
    id:9, name:'Rachel Greene, CFP® JD', photo:'https://i.pravatar.cc/200?img=45',
    title:'Tech Equity & Concentrated Position Advisor', firm:'Cascade Wealth Management', firmType:'RIA – Fee-Only',
    location:'Seattle, WA', state:'WA',
    phone:'(206) 555-0264', email:'r.greene@cascadewm.com', website:'cascadewealthmanagement.com',
    credentials:['CFP®','JD'], specialties:['Concentrated Stock','Options Strategy','IPO Planning','Charitable Giving'],
    aumMin:500000, aumDisplay:'$500K minimum', yearsExp:16,
    bio:'Rachel\'s practice is built around one of the most complex problems in wealth management: what to do with a highly concentrated stock position. Working primarily with Amazon, Microsoft, and Boeing employees, she designs tax-smart diversification strategies that protect wealth without triggering unnecessary tax events.',
    approach:'Concentrated risk is the enemy of long-term wealth. My job is to help you diversify intelligently, not all at once.',
    education:'BA Economics, University of Washington · JD, Seattle University School of Law',
    clientFocus:'Big tech employees, pre-IPO employees, executives with large RSU grants',
    rating:4.8, reviews:41, languages:['English'],
    awards:['Seattle Business Magazine Top Advisors 2023'],
    fee:'1% AUM / Flat project fees',
  },
  {
    id:10, name:'Thomas Nguyen, CFP® CPA', photo:'https://i.pravatar.cc/200?img=56',
    title:'Tax-Efficient Wealth Strategist', firm:'Summit Tax & Wealth', firmType:'Hybrid RIA + CPA Firm',
    location:'Denver, CO', state:'CO',
    phone:'(720) 555-0437', email:'t.nguyen@summitwealthco.com', website:'summittaxandwealth.com',
    credentials:['CFP®','CPA','PFS'], specialties:['Tax Planning','Roth Conversion Strategy','Real Estate Investors','Crypto Taxation'],
    aumMin:350000, aumDisplay:'$350K minimum', yearsExp:14,
    bio:'Thomas integrates tax strategy directly into the investment management process — something most financial advisors lack the credentials to do. By holding both a CPA and CFP®, he offers true one-stop financial and tax planning, eliminating the coordination gap between your accountant and your financial advisor.',
    approach:'Every investment decision is a tax decision. Most people leave thousands on the table every year through poor coordination.',
    education:'BS Accounting, University of Denver · MS Taxation, University of Colorado',
    clientFocus:'Real estate investors, cryptocurrency holders, S-Corp owners, high-income W-2 earners',
    rating:4.9, reviews:58, languages:['English','Vietnamese'],
    awards:['Colorado Society of CPAs Outstanding Member 2022','Five Star Professional 2021–2024'],
    fee:'Flat fee (planning + tax prep bundled)',
  },
  {
    id:11, name:'Maria Santos, CFP®', photo:'https://i.pravatar.cc/200?img=46',
    title:'Family Wealth Advisor', firm:'Vía Financial Planning', firmType:'RIA – Fee-Only',
    location:'Phoenix, AZ', state:'AZ',
    phone:'(602) 555-0319', email:'m.santos@viafinancial.com', website:'viafinancialplanning.com',
    credentials:['CFP®','AFC®'], specialties:['Bilingual Planning','Immigration & Finance','Multi-Cultural Families','Remittances & Cross-Border'],
    aumMin:150000, aumDisplay:'$150K minimum', yearsExp:11,
    bio:'Maria serves Latino and immigrant families who often face unique financial challenges — navigating the US financial system for the first time, managing cross-border financial ties, and building wealth across two countries. She conducts planning sessions in both English and Spanish, ensuring nothing is lost in translation.',
    approach:'Financial planning should reflect your whole life — including family abroad, cultural values, and the journey that brought you here.',
    education:'BS Finance, Arizona State University · CFP® Designation 2013',
    clientFocus:'Latino families, first-generation immigrants, cross-border professionals, DACA recipients',
    rating:5.0, reviews:91, languages:['English','Spanish'],
    awards:['CFP Board Diversity Scholarship Alumni','Phoenix Business Journal Rising Star 2021'],
    fee:'Flat monthly retainer',
  },
  {
    id:12, name:'William Brooks, CFP® CFA CIMA®', photo:'https://i.pravatar.cc/200?img=54',
    title:'Executive Compensation Advisor', firm:'Brooks & Whitmore Wealth', firmType:'Independent RIA',
    location:'Charlotte, NC', state:'NC',
    phone:'(704) 555-0552', email:'w.brooks@bwwealth.com', website:'brookswhitmorewealth.com',
    credentials:['CFP®','CFA','CIMA®'], specialties:['Deferred Compensation','Executive Benefits','NQDCs','Bank Executive Wealth'],
    aumMin:500000, aumDisplay:'$500K minimum', yearsExp:22,
    bio:'William focuses on the unique financial planning needs of banking and financial services executives — professionals who often have significant wealth tied up in employer stock, deferred compensation plans, and complex benefits packages.',
    approach:'Banking executives face unique conflicts others don\'t. From FINRA compliance to deferred comp timing, the details matter enormously.',
    education:'BA Finance, Duke University · MBA, UNC Kenan-Flagler',
    clientFocus:'Bank executives, C-suite leaders in financial services, Fortune 500 senior management',
    rating:4.8, reviews:33, languages:['English'],
    awards:['Charlotte Business Journal Top Advisor 2022–2023','IMCA Member of Distinction'],
    fee:'1% AUM / Retainer hybrid',
  },
]

const ADVISOR_QUESTIONS = {
  1:["Given my ISO grants, how do you model the AMT crossover point to determine the optimal exercise quantity in a given tax year?","What is the difference between a sell-to-cover RSU strategy versus a 10b5-1 plan for systematic diversification — and which applies to my situation?","How do you structure a tax-efficient glide path from a heavily concentrated employer stock position into a diversified portfolio over 3–5 years?","My company offers a Mega Backdoor Roth. How does that interact with my equity compensation and overall tax plan?","If I leave my employer pre-IPO with vested ISOs, what is the 90-day exercise deadline risk and how do we quantify the after-tax cost of early exercise?"],
  2:["How do you construct a factor-tilted portfolio to capture the size and value premiums without introducing unnecessary tax drag for a taxable account?","What is the sequence-of-returns risk specific to our asset level and time horizon — and how do you model it across Monte Carlo simulations?","At what point do alternatives (private equity, infrastructure, real assets) justify the illiquidity premium for a private client versus an endowment?","How does direct indexing compare to traditional index investing for tax-loss harvesting efficiency at our asset level?","How do you stress-test a retirement portfolio against the worst historical drawdown sequences — for example, a 2000–2010 lost-decade scenario?"],
  3:["With the estate tax exemption scheduled to sunset to approximately $7M per person in 2026, what specific steps should we take before year-end to lock in the current exclusion?","How does an intentionally defective grantor trust (IDGT) allow me to transfer appreciating assets to my heirs while removing them from my taxable estate?","What is a Grantor Retained Annuity Trust (GRAT) and under what interest rate environment does it most effectively transfer appreciation to the next generation?","In a business succession where some children are active in the business and others are not, how do you structure a transfer that is both equitable and tax-efficient?","What is the qualified small business stock (QSBS) exclusion under Section 1202, and how does it affect my exit strategy if I hold C-Corp shares?"],
  4:["For a portfolio above $10M, how do you structure the family governance framework and investment policy statement to survive a generational transfer intact?","How do you access institutional co-investment opportunities in private equity, and what due diligence process do you apply to direct deal flow?","What dynasty trust structure works best for removing assets from the estate tax system across multiple generations without triggering generation-skipping transfer tax?","How do you coordinate a multi-entity tax return — trust, LLC, holding company, and personal return — to optimize the consolidated picture?","If we receive a $20M+ liquidity event from a business sale, what is the week-by-week playbook from closing day through the first 12 months of portfolio construction?"],
  5:["What is the after-tax difference between an asset sale and a stock sale in my business exit — and which structure does my buyer prefer and why?","At my current EBITDA, would a Cash Balance Plan allow me to shelter significantly more income than a Solo 401(k) alone, and how do you model the break-even?","How do I structure an installment sale to spread capital gains recognition from the business exit across multiple tax years without triggering OID issues?","What role does a Qualified Opportunity Zone fund play as a capital gains deferral vehicle when reinvesting proceeds from my business sale?","How should a buy-sell agreement be funded — life insurance, cross-purchase, or entity-redemption — given my partner structure, estate size, and age difference?"],
  6:["How do you integrate ESG screens into a factor-based portfolio without significantly degrading value or profitability factor exposure?","What peer-reviewed evidence supports your specific factor tilts, and how do you distinguish genuine risk factors from data-mined anomalies that don't hold out-of-sample?","At what asset level do the fees, complexity, and manager-selection risk of alternatives begin to be justified by improved risk-adjusted returns for a private client?","How do you measure impact in an ESG portfolio, and what reporting standards do you use — SASB, GRI, or proprietary metrics?","How does your approach compare to the Yale Endowment model, and which elements of an endowment allocation are transferable to a private client portfolio?"],
  7:["What is the break-even age for delaying Social Security to 70 versus claiming at 62, adjusted for my health history, existing assets, and survivor benefit picture?","How do you build a 'retirement income floor' using Social Security, a possible annuity, and fixed income to cover essential expenses without stock market dependency?","What is the optimal Roth conversion ladder in the window between my retirement date and age 73 to reduce the lifetime tax burden of my RMDs?","How does Medicare IRMAA work, and how do we manage income in the 2-year look-back window to avoid the surcharges throughout retirement?","If I am widowed, how does my Social Security benefit change — and what survivor benefit elections should my spouse and I make now to maximize our combined lifetime benefit?"],
  8:["What is the optimal student loan repayment strategy for my loan type and income level — income-driven repayment, PSLF, refinancing, or aggressive payoff?","At what monthly savings rate and investment allocation does a 20-year wealth-building plan realistically reach $1M+, net of inflation?","How do I execute a Backdoor Roth IRA contribution correctly and avoid the pro-rata rule given my existing traditional IRA balance?","At what income level does investing in a taxable brokerage account make more sense than making additional after-tax 401(k) contributions?","How do I structure my insurance coverage — term life, own-occupation disability, and umbrella liability — to protect my earning power as my net worth grows?"],
  9:["What is the actual after-tax cost of liquidating my entire concentrated position all at once versus a systematic 5-year diversification plan — including state taxes?","How does a 10b5-1 trading plan work for a corporate insider, and what are the new SEC Rule 10b5-1 plan requirements after the 2023 amendments?","If I have pre-IPO ISOs with a $0.001 strike and a $50 409A valuation, when is the right time to exercise — and what is the precise AMT cost calculation?","How do exchange funds work as a tax-deferred alternative to an outright sale for diversifying a concentrated single-stock position?","What is the most tax-efficient structure for donating highly appreciated shares — direct charitable gift, donor-advised fund, or charitable remainder trust — given my income and giving goals?"],
  10:["What is the precise Roth conversion amount that minimizes my lifetime tax burden, given my current bracket, projected RMDs at 73, and state tax situation?","How do I structure real estate holdings across an LLC, a self-directed Solo 401(k), and my personal return to maximize depreciation while maintaining liability protection?","What specific crypto tax optimization strategies — HIFO lot identification, tax-loss harvesting, wash sale avoidance — apply to my portfolio size?","How do I qualify as a Real Estate Professional under IRC Section 469, and what level of documentation and time-tracking is required to withstand an audit?","What are the mechanics of a cost segregation study, and at what property value does the cost of the study justify the accelerated depreciation benefit?"],
  11:["How do I correctly report foreign bank accounts under FBAR and FATCA, and what are the penalty structures for prior-year non-compliance?","As a Green Card holder, what happens to my US assets if I die before becoming a citizen — does the estate tax unlimited marital deduction apply?","How do I structure international wire transfers and remittances to family abroad in a way that is both tax-compliant and cost-efficient?","If I hold investment accounts in my home country in addition to the US, how does the foreign tax credit prevent double taxation — and are there treaty provisions that help?","If I eventually split residency between countries or return home, what are the US expatriation tax implications and how do we plan for that scenario now?"],
  12:["How do I optimize my NQDC plan elections — deferral percentage, contribution timing, investment options, and distribution schedule — given my projected retirement income and tax bracket?","What is the counterparty risk of my non-qualified deferred compensation plan and how do I protect my deferred balance from the risk of employer insolvency?","How do the IRC Section 409A regulations govern my distribution election timing, and what happens to my deferrals in a change-of-control or merger event?","As a regulated financial professional, how do FINRA holding period requirements and pre-clearance rules affect my ability to actively manage my personal brokerage account?","How do I manage total employer concentration risk across my 401(k), NQDC plan, RSU grants, and deferred bonus — and at what threshold does the concentration become dangerous?"],
}

const ADVISOR_TAGS = {
  1: { challenges:['equity','tax'],               taxProfiles:['equity_amt','w2'],           philosophy:['passive','no_preference'],      concerns:['estate_trust','business_succession'] },
  2: { challenges:['retirement_income','concentrated'], taxProfiles:['w2','equity_amt'],      philosophy:['passive','alternatives'],        concerns:['estate_trust','ss_medicare'] },
  3: { challenges:['estate','transition'],         taxProfiles:['complex','w2'],              philosophy:['no_preference','passive'],       concerns:['estate_trust','business_succession','charitable'] },
  4: { challenges:['estate','tax','concentrated'], taxProfiles:['complex','w2'],              philosophy:['alternatives','passive'],        concerns:['estate_trust','charitable','business_succession'] },
  5: { challenges:['exit','tax'],                  taxProfiles:['selfemployed','complex'],    philosophy:['passive','no_preference'],       concerns:['business_succession','insurance','estate_trust'] },
  6: { challenges:['wealth_building','concentrated'],taxProfiles:['w2','complex'],            philosophy:['esg','passive','alternatives'],  concerns:['charitable','estate_trust'] },
  7: { challenges:['retirement_income','transition'],taxProfiles:['rmds','w2'],              philosophy:['passive','no_preference'],       concerns:['ss_medicare','insurance','estate_trust'] },
  8: { challenges:['wealth_building','transition'],taxProfiles:['w2','selfemployed'],         philosophy:['passive','no_preference'],       concerns:['insurance','education','estate_trust'] },
  9: { challenges:['concentrated','equity'],       taxProfiles:['equity_amt','complex'],      philosophy:['passive','no_preference'],       concerns:['charitable','estate_trust'] },
  10:{ challenges:['tax','wealth_building'],       taxProfiles:['complex','selfemployed','rmds'],philosophy:['passive','no_preference'],   concerns:['estate_trust','charitable'] },
  11:{ challenges:['transition','wealth_building'],taxProfiles:['w2','complex'],              philosophy:['passive','no_preference'],       concerns:['insurance','education','estate_trust'] },
  12:{ challenges:['equity','tax'],                taxProfiles:['equity_amt','w2'],           philosophy:['passive','no_preference'],       concerns:['estate_trust','business_succession'] },
}

const MATCH_QUIZ = [
  { id:'challenge', q:"What's your primary financial challenge?", sub:'Select the situation that best describes where you need the most guidance.', type:'single', options:[
    { v:'equity',            l:'Equity Compensation & RSUs/ISOs',    d:'Managing vesting, taxes, and diversification from employer stock' },
    { v:'exit',              l:'Business Exit / Succession Planning', d:'Preparing to sell a business or transition ownership' },
    { v:'concentrated',      l:'Concentrated Stock Position',         d:'Large single-stock position creating risk and tax complexity' },
    { v:'retirement_income', l:'Retirement Income Planning',          d:'Sequencing withdrawals, Social Security timing, and RMDs' },
    { v:'estate',            l:'Estate Planning & Wealth Transfer',   d:'Trusts, gifting strategies, reducing estate taxes, legacy goals' },
    { v:'tax',               l:'Tax Reduction & Optimization',        d:'Minimizing taxes across all income sources and account types' },
    { v:'transition',        l:'Major Life Transition',               d:'Divorce, inheritance, death of spouse, or career change' },
    { v:'wealth_building',   l:'Building Wealth from Scratch',        d:'First-generation wealth, debt management, investment foundation' },
  ]},
  { id:'tax_complexity', q:'What best describes your tax situation?', sub:'Your tax profile determines which advisor\'s expertise matters most.', type:'single', options:[
    { v:'w2',          l:'Standard W-2 Income',                    d:'Salary and bonus — relatively straightforward filing' },
    { v:'equity_amt',  l:'Equity Comp with AMT Exposure',          d:'ISOs, RSUs, NQSOs — complex equity taxation' },
    { v:'selfemployed',l:'Self-Employed / S-Corp Owner',           d:'Business income, pass-through entity, estimated taxes' },
    { v:'complex',     l:'Complex: K-1s, Crypto, or Real Estate',  d:'Passive income, digital assets, depreciation strategies' },
    { v:'rmds',        l:'Managing RMDs & Retirement Distributions',d:'Age 73+, required minimum distributions, IRMAA planning' },
  ]},
  { id:'philosophy', q:'What investment approach resonates most with you?', sub:'Matching your philosophy to your advisor\'s avoids constant friction over strategy.', type:'single', options:[
    { v:'passive',      l:'Evidence-Based / Passive Investing', d:'Low-cost index funds, factor tilts, tax-efficient, minimal trading' },
    { v:'active',       l:'Active / Fundamental Research',      d:'Individual security selection, manager-driven alpha' },
    { v:'alternatives', l:'Alternatives & Private Markets',     d:'Private equity, real assets, hedge funds, direct investments' },
    { v:'esg',          l:'ESG / Values-Aligned Investing',     d:'Environmental, social, and governance criteria matter to me' },
    { v:'no_preference',l:'No Strong Preference',               d:'Open to my advisor\'s evidence-based recommendation' },
  ]},
  { id:'non_invest_concern', q:'Beyond investments, which planning area is most urgent?', sub:'Great advisors plan far beyond portfolio management.', type:'single', options:[
    { v:'estate_trust',        l:'Estate & Trust Structure',          d:'Wills, trusts, beneficiary designations, transfer planning' },
    { v:'business_succession', l:'Business Succession',               d:'Buy-sell agreements, exit planning, key-person risk' },
    { v:'insurance',           l:'Insurance & Risk Management',       d:'Life, disability, long-term care, umbrella coverage gaps' },
    { v:'ss_medicare',         l:'Social Security & Medicare Timing', d:'Optimizing benefits and avoiding IRMAA surcharges' },
    { v:'charitable',          l:'Charitable Giving & Legacy',        d:'Donor-advised funds, CRTs, foundation, and impact planning' },
    { v:'education',           l:'Education Funding',                 d:'529 plans, UGMA/UTMA, financial aid optimization' },
  ]},
  { id:'asset_level', q:'Approximate investable asset level?', sub:'This helps match you to advisors whose minimums and expertise fit your stage.', type:'single', options:[
    { v:250000,   l:'Under $250K',   d:'Building wealth — early accumulation phase' },
    { v:750000,   l:'$250K – $750K', d:'Mid-accumulation, growing complexity' },
    { v:2000000,  l:'$750K – $2M',   d:'Significant wealth, tax planning becomes critical' },
    { v:5000000,  l:'$2M – $5M',     d:'High net worth, multi-faceted planning required' },
    { v:10000000, l:'$5M+',          d:'Ultra-high net worth — family office territory' },
  ]},
  { id:'credential', q:'Which professional credential matters most to you?', sub:'Each designation signals a distinct depth of expertise.', type:'single', options:[
    { v:'CFP®',l:'CFP® — Certified Financial Planner', d:'Comprehensive financial planning across all disciplines' },
    { v:'CFA', l:'CFA — Chartered Financial Analyst',  d:'Investment management and portfolio theory depth' },
    { v:'CPA', l:'CPA / PFS — Tax Planning Focus',     d:'Integrated tax strategy and financial planning' },
    { v:'JD',  l:'JD — Legal / Estate Planning Focus', d:'Attorney credentials for estate or business law' },
    { v:'none',l:'No Strong Preference',               d:'Trust the match algorithm to find the right fit' },
  ]},
]

function scoreAdvisors(answers) {
  return ADVISORS.map(a => {
    const tags = ADVISOR_TAGS[a.id] || {}
    let score = 0; const reasons = []
    if (answers.challenge && tags.challenges?.includes(answers.challenge)) { score += 3; reasons.push('Strong specialty alignment with your primary financial challenge') }
    if (answers.tax_complexity && tags.taxProfiles?.includes(answers.tax_complexity)) { score += 2; reasons.push('Experienced with your specific tax complexity') }
    if (answers.philosophy && tags.philosophy?.includes(answers.philosophy)) { score += 1; reasons.push('Investment philosophy closely aligns with your preferences') }
    if (answers.non_invest_concern && tags.concerns?.includes(answers.non_invest_concern)) { score += 2; reasons.push('Specializes in your most urgent non-investment planning area') }
    if (answers.asset_level != null && a.aumMin <= answers.asset_level) { score += 2; reasons.push('Works with clients at your asset level') }
    if (answers.credential) {
      if (answers.credential === 'none') { score += 1; reasons.push('Holds recognized professional designations') }
      else if (answers.credential === 'CPA' && a.credentials.some(c => c === 'CPA' || c.includes('PFS'))) { score += 2; reasons.push('Holds the CPA/PFS designation you prioritized') }
      else if (a.credentials.some(c => c.startsWith(answers.credential.replace('®','')))) { score += 2; reasons.push(`Holds the ${answers.credential} designation you prioritized`) }
    }
    return { ...a, matchScore: score, matchPct: Math.round((score / 12) * 100), matchReasons: reasons }
  }).sort((a, b) => b.matchScore - a.matchScore)
}

/* ── Advisor Profile ─────────────────────────────────────────────── */
function AdvisorProfile({ advisor, onClose }) {
  const qs = ADVISOR_QUESTIONS[advisor.id] || []
  return (
    <div style={{ background: C.bg, minHeight: '100dvh' }}>
      {/* Sticky header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(250,246,237,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.b1}`, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <ChevronLeft size={18} color={C.t3} />
          <span style={{ fontFamily: UI, fontSize: 13, color: C.t3 }}>Directory</span>
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{advisor.name}</div>
        <div style={{ width: 60 }} />
      </div>

      <div style={{ padding: '16px 16px 100px' }}>
        {/* Hero card */}
        <div style={{ background: C.surf, border: `1px solid ${C.b1}`, borderRadius: 20, padding: 18, marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
            <img src={advisor.photo} alt={advisor.name}
              style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${TEAL}`, flexShrink: 0 }}
              onError={e => { e.target.style.display = 'none' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: UI, fontSize: 15, fontWeight: 800, color: C.t1, lineHeight: 1.2, marginBottom: 2 }}>{advisor.name}</div>
              <div style={{ fontFamily: UI, fontSize: 11, color: TEAL, marginBottom: 2 }}>{advisor.title}</div>
              <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, marginBottom: 6 }}>{advisor.firm} · {advisor.firmType}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {advisor.credentials.map(c => (
                  <span key={c} style={{ fontFamily: UI, fontSize: 9, fontWeight: 700, color: TEAL, background: 'rgba(0,180,198,0.1)', border: '1px solid rgba(0,180,198,0.25)', borderRadius: 4, padding: '2px 6px' }}>{c}</span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 14, paddingTop: 10, borderTop: `1px solid ${C.b1}` }}>
            {[[MapPin, advisor.location],[Clock, `${advisor.yearsExp} yrs exp`],[Star, `${advisor.rating} (${advisor.reviews} reviews)`]].map(([Icon, val], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Icon size={10} color={i === 2 ? GOLD : C.t3} fill={i === 2 ? GOLD : 'none'} />
                <span style={{ fontFamily: UI, fontSize: 11, color: i === 2 ? GOLD : C.t3, fontWeight: i === 2 ? 700 : 400 }}>{val}</span>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div style={{ background: C.raise, borderRadius: 12, padding: '10px 12px' }}>
            <div style={{ fontFamily: UI, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.t3, marginBottom: 8 }}>Contact</div>
            {[[Phone, advisor.phone],[Mail, advisor.email],[Globe, advisor.website]].map(([Icon, val]) => (
              <div key={val} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Icon size={11} color={C.t3} />
                <span style={{ fontFamily: UI, fontSize: 12, color: C.t2 }}>{val}</span>
              </div>
            ))}
            <button style={{ width: '100%', marginTop: 8, background: TEAL, color: '#fff', border: 'none', borderRadius: 10, padding: '11px', fontFamily: UI, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              Connect with {advisor.name.split(' ')[0]}
            </button>
          </div>
        </div>

        {/* About */}
        <div style={{ background: C.surf, border: `1px solid ${C.b1}`, borderRadius: 16, padding: '14px 16px', marginBottom: 10 }}>
          <div style={{ fontFamily: UI, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.t3, marginBottom: 8 }}>About</div>
          <p style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.7, margin: 0 }}>{advisor.bio}</p>
        </div>

        {/* Planning approach */}
        <div style={{ background: C.surf, border: `1px solid ${C.b1}`, borderRadius: 16, padding: '14px 16px', marginBottom: 10 }}>
          <div style={{ fontFamily: UI, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.t3, marginBottom: 8 }}>Planning Approach</div>
          <div style={{ background: 'rgba(0,180,198,0.06)', border: '1px solid rgba(0,180,198,0.18)', borderRadius: 10, padding: '10px 12px' }}>
            <p style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>{advisor.approach}</p>
          </div>
        </div>

        {/* Specialties */}
        <div style={{ background: C.surf, border: `1px solid ${C.b1}`, borderRadius: 16, padding: '14px 16px', marginBottom: 10 }}>
          <div style={{ fontFamily: UI, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.t3, marginBottom: 10 }}>Specialties</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {advisor.specialties.map(s => (
              <span key={s} style={{ fontFamily: UI, fontSize: 11, color: C.t2, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.18)', borderRadius: 5, padding: '3px 9px' }}>{s}</span>
            ))}
          </div>
        </div>

        {/* Details */}
        <div style={{ background: C.surf, border: `1px solid ${C.b1}`, borderRadius: 16, padding: '14px 16px', marginBottom: 10 }}>
          <div style={{ fontFamily: UI, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.t3, marginBottom: 10 }}>Details</div>
          {[['Client Focus', advisor.clientFocus],['Education', advisor.education],['Languages', advisor.languages.join(', ')],['Minimum', advisor.aumDisplay],['Fee Structure', advisor.fee]].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
              <span style={{ fontFamily: UI, fontSize: 11, color: C.t3, minWidth: 90, flexShrink: 0 }}>{l}</span>
              <span style={{ fontFamily: UI, fontSize: 11, color: C.t1, fontWeight: 600, lineHeight: 1.5 }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Awards */}
        <div style={{ background: C.surf, border: `1px solid ${C.b1}`, borderRadius: 16, padding: '14px 16px', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Award size={12} color={GOLD} />
            <div style={{ fontFamily: UI, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.t3 }}>Recognition</div>
          </div>
          {advisor.awards.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
              <Star size={10} color={GOLD} fill={GOLD} style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontFamily: UI, fontSize: 12, color: C.t2 }}>{a}</span>
            </div>
          ))}
        </div>

        {/* Questions to ask */}
        {qs.length > 0 && (
          <div style={{ background: C.surf, border: `1px solid ${C.b1}`, borderRadius: 16, padding: '16px', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(0,180,198,0.1)', border: '1px solid rgba(0,180,198,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <BookOpen size={15} color={TEAL} />
              </div>
              <div>
                <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 800, color: C.t1 }}>What to Ask {advisor.name.split(' ')[0]}</div>
                <div style={{ fontFamily: UI, fontSize: 10, color: C.t3, marginTop: 2 }}>Specialty-mapped questions at CFP/CFA depth — for your first meeting</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {qs.map((q, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', background: C.raise, border: `1px solid ${C.b1}`, borderRadius: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(0,180,198,0.1)', border: '1px solid rgba(0,180,198,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 900, color: TEAL }}>{i + 1}</span>
                  </div>
                  <span style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.65 }}>{q}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prep reminder */}
        <div style={{ background: 'rgba(0,180,198,0.06)', border: '1px solid rgba(0,180,198,0.2)', borderRadius: 14, padding: '14px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <FileText size={18} color={TEAL} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: TEAL, marginBottom: 4 }}>Ready to meet {advisor.name.split(' ')[0]}?</div>
            <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.6 }}>Head to the <strong>Prep Hub</strong> to check off your document list and prep your questions before your first meeting.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Directory tab ───────────────────────────────────────────────── */
function TabDirectory() {
  const [search, setSearch]   = useState('')
  const [stateF, setStateF]   = useState('All')
  const [specF, setSpecF]     = useState('All')
  const [feeF, setFeeF]       = useState('All')
  const [selected, setSelected] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  const states = ['All', ...[...new Set(ADVISORS.map(a => a.state))].sort()]
  const specs  = ['All','Retirement','Tax Planning','Estate Planning','Business Owner','Tech Executives','First-Gen Wealth','ESG Investing','Concentrated Stock']
  const fees   = ['All','Fee-Only','Flat Fee','AUM-Based','Retainer']

  const filtered = useMemo(() => ADVISORS.filter(a => {
    const q = search.toLowerCase()
    const ms = !q || a.name.toLowerCase().includes(q) || a.location.toLowerCase().includes(q) || a.firm.toLowerCase().includes(q) || a.specialties.some(s => s.toLowerCase().includes(q))
    const mState = stateF === 'All' || a.state === stateF
    const mSpec  = specF  === 'All' || a.specialties.some(s => s.includes(specF))
    const mFee   = feeF   === 'All' ||
      (feeF === 'Fee-Only'  && a.firmType.includes('Fee-Only')) ||
      (feeF === 'Flat Fee'  && a.fee.toLowerCase().includes('flat')) ||
      (feeF === 'AUM-Based' && a.fee.includes('AUM')) ||
      (feeF === 'Retainer'  && a.fee.toLowerCase().includes('retainer'))
    return ms && mState && mSpec && mFee
  }), [search, stateF, specF, feeF])

  if (selected) return <AdvisorProfile advisor={selected} onClose={() => setSelected(null)} />

  return (
    <div style={{ padding: '12px 16px 100px' }}>
      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 10 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.t3 }} />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, location, firm, or specialty..."
          style={{ width: '100%', background: C.surf, border: `1px solid ${C.b1}`, borderRadius: 12, padding: '11px 12px 11px 36px', fontFamily: UI, fontSize: 13, color: C.t1, outline: 'none', boxSizing: 'border-box' }} />
        {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><X size={14} color={C.t3} /></button>}
      </div>

      {/* Filter toggle */}
      <button onClick={() => setShowFilters(f => !f)}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: showFilters ? 'rgba(0,180,198,0.1)' : C.surf, border: `1px solid ${showFilters ? 'rgba(0,180,198,0.35)' : C.b1}`, borderRadius: 10, padding: '8px 14px', fontFamily: UI, fontSize: 12, fontWeight: 600, color: showFilters ? TEAL : C.t2, cursor: 'pointer', marginBottom: 10 }}>
        <Sliders size={13} color={showFilters ? TEAL : C.t3} />
        Filters
        {(stateF !== 'All' || specF !== 'All' || feeF !== 'All') && (
          <span style={{ background: TEAL, color: '#fff', borderRadius: '50%', width: 16, height: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700 }}>
            {[stateF, specF, feeF].filter(f => f !== 'All').length}
          </span>
        )}
      </button>

      {showFilters && (
        <div style={{ background: C.surf, border: `1px solid ${C.b1}`, borderRadius: 14, padding: '14px', marginBottom: 12 }}>
          {[['State', stateF, setStateF, states], ['Specialty', specF, setSpecF, specs], ['Fee Type', feeF, setFeeF, fees]].map(([label, val, setter, opts]) => (
            <div key={label} style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: UI, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.t3, marginBottom: 6 }}>{label}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {opts.map(o => (
                  <button key={o} onClick={() => setter(o)}
                    style={{ padding: '6px 12px', borderRadius: 20, fontFamily: UI, fontSize: 11, fontWeight: val === o ? 700 : 500, background: val === o ? 'rgba(0,180,198,0.12)' : C.raise, border: `1px solid ${val === o ? 'rgba(0,180,198,0.35)' : C.b2}`, color: val === o ? TEAL : C.t2, cursor: 'pointer' }}>
                    {o === 'All' && label === 'State' ? 'All States' : o}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {(stateF !== 'All' || specF !== 'All' || feeF !== 'All') && (
            <button onClick={() => { setStateF('All'); setSpecF('All'); setFeeF('All') }}
              style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', fontFamily: UI, fontSize: 11, color: C.t3, cursor: 'pointer', padding: 0 }}>
              <RotateCcw size={11} /> Clear all filters
            </button>
          )}
        </div>
      )}

      <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, marginBottom: 12 }}>
        {filtered.length} advisor{filtered.length !== 1 ? 's' : ''} found
      </div>

      {/* Info banner */}
      <div style={{ background: 'rgba(0,180,198,0.06)', border: '1px solid rgba(0,180,198,0.18)', borderRadius: 12, padding: '10px 14px', marginBottom: 14, fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.6 }}>
        <strong style={{ color: TEAL }}>Demo Directory</strong> — These are illustrative advisor profiles. All advisors shown are fiduciaries or fee-only planners.
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', fontFamily: UI, fontSize: 13, color: C.t3 }}>
          No advisors match your filters. Try adjusting your search.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(a => (
            <button key={a.id} onClick={() => setSelected(a)}
              style={{ display: 'flex', flexDirection: 'column', background: C.surf, border: `1px solid ${C.b1}`, borderRadius: 18, padding: '14px', cursor: 'pointer', textAlign: 'left', width: '100%', WebkitTapHighlightColor: 'transparent' }}>
              {/* Top row */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 8 }}>
                <img src={a.photo} alt={a.name}
                  style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: `1.5px solid ${C.b2}`, flexShrink: 0 }}
                  onError={e => { e.target.style.display = 'none' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 800, color: C.t1, lineHeight: 1.2, marginBottom: 1 }}>{a.name}</div>
                  <div style={{ fontFamily: UI, fontSize: 11, color: TEAL, marginBottom: 1 }}>{a.firm}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={9} color={C.t3} />
                    <span style={{ fontFamily: UI, fontSize: 10, color: C.t3 }}>{a.location}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: GOLD }}>★ {a.rating}</div>
                  <div style={{ fontFamily: UI, fontSize: 10, color: C.t3 }}>{a.reviews} reviews</div>
                </div>
              </div>

              {/* Credentials */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                {a.credentials.map(c => (
                  <span key={c} style={{ fontFamily: UI, fontSize: 9, fontWeight: 700, color: TEAL, background: 'rgba(0,180,198,0.1)', border: '1px solid rgba(0,180,198,0.22)', borderRadius: 4, padding: '2px 6px' }}>{c}</span>
                ))}
                <span style={{ fontFamily: UI, fontSize: 9, color: C.t3, background: C.raise, border: `1px solid ${C.b2}`, borderRadius: 4, padding: '2px 6px' }}>{a.firmType}</span>
              </div>

              {/* Specialties */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                {a.specialties.slice(0, 3).map(s => (
                  <span key={s} style={{ fontFamily: UI, fontSize: 10, color: C.t2, background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.16)', borderRadius: 4, padding: '2px 7px' }}>{s}</span>
                ))}
                {a.specialties.length > 3 && <span style={{ fontFamily: UI, fontSize: 10, color: C.t3 }}>+{a.specialties.length - 3} more</span>}
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${C.b1}`, paddingTop: 8 }}>
                <span style={{ fontFamily: UI, fontSize: 10, color: C.t3 }}>{a.aumDisplay}</span>
                <span style={{ fontFamily: UI, fontSize: 10, color: C.t3 }}>{a.yearsExp} yrs exp</span>
                <span style={{ fontFamily: UI, fontSize: 10, color: C.t3 }}>{a.fee}</span>
                <ChevronRight size={14} color={C.t3} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Match Me tab ────────────────────────────────────────────────── */
function TabMatchMe() {
  const [step, setStep]     = useState(0)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState(null)
  const [selectedAdvisor, setSelectedAdvisor] = useState(null)
  const total = MATCH_QUIZ.length

  function handleAnswer(qid, value) {
    const next = { ...answers, [qid]: value }
    setAnswers(next)
    if (step < total - 1) setStep(step + 1)
    else { setResults(scoreAdvisors(next)); setStep(total) }
  }

  if (selectedAdvisor) return <AdvisorProfile advisor={selectedAdvisor} onClose={() => setSelectedAdvisor(null)} />

  if (step === 0 && !results) return (
    <div style={{ padding: '20px 16px 100px' }}>
      <div style={{ background: C.surf, border: `1px solid ${C.b1}`, borderRadius: 20, padding: '24px', textAlign: 'center', marginBottom: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(0,180,198,0.1)', border: '1px solid rgba(0,180,198,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Sliders size={22} color={TEAL} />
        </div>
        <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 700, color: C.t1, marginBottom: 8, lineHeight: 1.2 }}>Find Your Advisor Match</div>
        <p style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.7, margin: '0 0 20px' }}>Answer 6 questions about your financial situation. We'll rank your top matches with specific reasons why they fit your needs.</p>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
          {['6 Questions','~3 Minutes','Ranked Results','Explained Matches'].map(b => (
            <span key={b} style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, color: TEAL, background: 'rgba(0,180,198,0.1)', border: '1px solid rgba(0,180,198,0.2)', borderRadius: 99, padding: '3px 10px' }}>{b}</span>
          ))}
        </div>
        <button onClick={() => setStep(1)} style={{ background: TEAL, color: '#fff', border: 'none', borderRadius: 12, padding: '13px 28px', fontFamily: UI, fontWeight: 800, fontSize: 14, cursor: 'pointer', width: '100%' }}>
          Start the Match Quiz →
        </button>
      </div>
      {[
        { t:'CFP/CFA-Level Precision', b:'Questions built around real scenarios that distinguish great advisors — equity comp, business exits, concentrated stock, estate planning, and tax complexity.' },
        { t:'Ranked & Explained',      b:'Your top 3 matches are presented with specific reasons for each recommendation, not just a score.' },
        { t:'Specialty-Mapped Scoring',b:'Every advisor profile is tagged across specialty dimensions. Your answers score directly against each dimension.' },
      ].map(({ t, b }) => (
        <div key={t} style={{ background: C.surf, border: `1px solid ${C.b1}`, borderRadius: 14, padding: '14px', marginBottom: 10 }}>
          <div style={{ height: 2, background: TEAL, borderRadius: 99, marginBottom: 10 }} />
          <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 4 }}>{t}</div>
          <p style={{ fontFamily: UI, fontSize: 12, color: C.t3, lineHeight: 1.65, margin: 0 }}>{b}</p>
        </div>
      ))}
    </div>
  )

  if (results) {
    const top3 = results.slice(0, 3), rest = results.slice(3)
    return (
      <div style={{ padding: '16px 16px 100px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: DISPLAY, fontSize: 18, fontWeight: 700, color: C.t1 }}>Your Advisor Matches</div>
            <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, marginTop: 2 }}>Ranked by specialty fit, credential match, and asset level alignment</div>
          </div>
          <button onClick={() => { setStep(0); setAnswers({}); setResults(null) }}
            style={{ display: 'flex', alignItems: 'center', gap: 5, background: C.surf, border: `1px solid ${C.b1}`, borderRadius: 10, padding: '7px 12px', fontFamily: UI, fontSize: 11, color: C.t3, cursor: 'pointer' }}>
            <RotateCcw size={11} /> Retake
          </button>
        </div>

        <div style={{ fontFamily: UI, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.t3, marginBottom: 10 }}>Top Matches</div>

        {top3.map((a, idx) => (
          <div key={a.id} onClick={() => setSelectedAdvisor(a)}
            style={{ background: C.surf, border: `1.5px solid ${idx === 0 ? 'rgba(0,180,198,0.5)' : C.b1}`, borderRadius: 18, padding: '14px', marginBottom: 10, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
            {idx === 0 && (
              <div style={{ position: 'absolute', top: 12, right: 12, fontFamily: UI, fontSize: 9, fontWeight: 800, color: '#fff', background: TEAL, borderRadius: 4, padding: '2px 8px', letterSpacing: '0.08em' }}>BEST MATCH</div>
            )}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
              <img src={a.photo} alt={a.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${idx === 0 ? TEAL : C.b2}`, flexShrink: 0 }} onError={e => { e.target.style.display = 'none' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 800, color: C.t1 }}>{a.name}</div>
                <div style={{ fontFamily: UI, fontSize: 11, color: TEAL }}>{a.firm}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: MONO, fontSize: 15, fontWeight: 900, color: idx === 0 ? TEAL : C.t2 }}>{a.matchPct}%</div>
                <div style={{ fontFamily: UI, fontSize: 9, color: C.t3 }}>match</div>
              </div>
            </div>
            {a.matchReasons.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
                {a.matchReasons.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                    <BadgeCheck size={11} color={TEAL} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontFamily: UI, fontSize: 11, color: C.t2, lineHeight: 1.5 }}>{r}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${C.b1}`, paddingTop: 8 }}>
              <span style={{ fontFamily: UI, fontSize: 10, color: C.t3 }}>{a.aumDisplay} · {a.fee}</span>
              <ChevronRight size={14} color={C.t3} />
            </div>
          </div>
        ))}

        {rest.length > 0 && (
          <>
            <div style={{ fontFamily: UI, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.t3, margin: '16px 0 10px' }}>Other Advisors</div>
            {rest.map(a => (
              <button key={a.id} onClick={() => setSelectedAdvisor(a)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, background: C.surf, border: `1px solid ${C.b1}`, borderRadius: 14, padding: '12px', marginBottom: 8, cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                <img src={a.photo} alt={a.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: `1px solid ${C.b2}`, flexShrink: 0 }} onError={e => { e.target.style.display = 'none' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1 }}>{a.name}</div>
                  <div style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>{a.firm}</div>
                </div>
                <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: C.t2 }}>{a.matchPct}%</div>
                <ChevronRight size={13} color={C.t3} />
              </button>
            ))}
          </>
        )}
      </div>
    )
  }

  const q = MATCH_QUIZ[step - 1]
  const pct = Math.round((step / total) * 100)
  return (
    <div style={{ padding: '16px 16px 100px' }}>
      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>Question {step} of {total}</span>
        <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: TEAL }}>{pct}%</span>
      </div>
      <div style={{ height: 4, background: C.b1, borderRadius: 2, marginBottom: 22 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: TEAL, borderRadius: 2, transition: 'width 0.3s ease' }} />
      </div>

      <div style={{ fontFamily: DISPLAY, fontSize: 20, fontWeight: 700, color: C.t1, lineHeight: 1.25, marginBottom: 6 }}>{q.q}</div>
      <div style={{ fontFamily: UI, fontSize: 12, color: C.t3, lineHeight: 1.55, marginBottom: 20 }}>{q.sub}</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {q.options.map(opt => (
          <button key={opt.v} onClick={() => handleAnswer(q.id, opt.v)}
            style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', background: C.surf, border: `1px solid ${C.b1}`, borderRadius: 14, cursor: 'pointer', textAlign: 'left', WebkitTapHighlightColor: 'transparent' }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', border: `1.5px solid ${C.b2}`, flexShrink: 0, marginTop: 1 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 2 }}>{opt.l}</div>
              {opt.d && <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, lineHeight: 1.5 }}>{opt.d}</div>}
            </div>
            <ChevronRight size={14} color={C.t3} style={{ flexShrink: 0, marginTop: 2 }} />
          </button>
        ))}
      </div>

      {step > 1 && (
        <button onClick={() => setStep(s => s - 1)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', fontFamily: UI, fontSize: 12, color: C.t3, cursor: 'pointer', marginTop: 16, padding: 0 }}>
          <ChevronLeft size={14} /> Back
        </button>
      )}
    </div>
  )
}

/* ── Main component ──────────────────────────────────────────────── */
const TABS = ['Directory', 'Match Me']

export default function MWealthCounsel() {
  const [tab, setTab] = useState(0)

  return (
    <div style={{ background: C.bg, minHeight: '100dvh' }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 0', background: C.bg, borderBottom: `1px solid ${C.b1}` }}>
        <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: TEAL, marginBottom: 4 }}>Wealth Counsel</div>
        <div style={{ fontFamily: DISPLAY, fontSize: 26, fontWeight: 700, color: C.t1, lineHeight: 1.15, marginBottom: 4 }}>Find Your Financial Advisor</div>
        <div style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.55, marginBottom: 16 }}>Connect with fee-only fiduciary advisors vetted for transparency, credentials, and client satisfaction.</div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[['200+','Advisors'],['98%','Fiduciary'],['4.8★','Avg Rating']].map(([v, l]) => (
            <div key={l} style={{ flex: 1, textAlign: 'center', background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 10, padding: '8px 4px' }}>
              <div style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: TEAL }}>{v}</div>
              <div style={{ fontFamily: UI, fontSize: 9, color: C.t3 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 4 }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              style={{ flex: 1, padding: '9px', background: 'none', border: 'none', borderBottom: `2px solid ${tab === i ? TEAL : 'transparent'}`, fontFamily: UI, fontSize: 13, fontWeight: tab === i ? 700 : 500, color: tab === i ? TEAL : C.t3, cursor: 'pointer', transition: 'all 0.15s' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab === 0 ? <TabDirectory /> : <TabMatchMe />}
    </div>
  )
}
