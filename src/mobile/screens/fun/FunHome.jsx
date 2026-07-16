import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { C, UI, DISPLAY, MONO } from '../../tokens'
import { userKey } from '../../utils/auth'
import {
  Flame, Sparkles, ArrowUpRight, CreditCard, Umbrella, ChevronRight,
  Users, X, TrendingUp, Shield, PieChart, Clock, FileText,
  Home, BookOpen, GraduationCap, Briefcase, BarChart2, Heart, RefreshCw,
} from 'lucide-react'

/* ── Week helpers ────────────────────────────────────────────────── */
function getWeekOfYear() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  return Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000))
}
function daysUntilMonday() {
  const day = new Date().getDay() // 0=Sun … 6=Sat
  return day === 1 ? 7 : (8 - day) % 7
}

/* ── Rotation schedule — one pair per week, loops every 7 weeks ──── */
const WEEKLY_PAIRS = [
  ['debt',       'insurance'],
  ['budgeting',  'emergency'],
  ['investing',  'retirement'],
  ['tax',        'homebuying'],
  ['estate',     'socialsecurity'],
  ['studentloans','sideincome'],
  ['indexfunds', 'hsa'],
]

function getWeekPair() {
  return WEEKLY_PAIRS[getWeekOfYear() % WEEKLY_PAIRS.length]
}

/* ── All focus topic content ─────────────────────────────────────── */
const FOCUS_DATA = {

  /* ────────────────────────────── DEBT & CREDIT ── */
  debt: {
    title: 'Debt & Credit', Icon: CreditCard, tint: C.skyBg,
    tabs: [
      {
        label: 'Good vs Bad Debt', icon: '⚖️',
        headline: 'Not All Debt Is Created Equal',
        body: 'Debt itself isn\'t the enemy — the type matters. Good debt builds wealth. Bad debt funds consumption.',
        sections: [
          { title: 'Good Debt', color: '#4a7c59', items: ['Mortgage — builds equity over time', 'Student loans — if the career ROI is positive', 'Business loans — funds income-generating assets'] },
          { title: 'Bad Debt', color: '#c0392b', items: ['Credit cards at 20–30% APR', 'Payday loans — average 400% APR', 'Auto loans on depreciating luxury cars'] },
        ],
        callout: { label: 'The Rule', text: 'If the asset it buys earns more than the interest costs — it\'s good debt. If it doesn\'t — it\'s bad debt.' },
      },
      {
        label: 'Build Credit Fast', icon: '📈',
        headline: 'Your Credit Score in 5 Moves',
        body: 'FICO scores are built from 5 factors. Focus on the highest-weight ones first.',
        pills: [
          { pct: '35%', label: 'Payment History', tip: 'Pay every bill on time, every month. One late payment can drop your score 60–110 points.' },
          { pct: '30%', label: 'Credit Utilization', tip: 'Keep balances below 10% of your limit — not 30%. 10% is the real sweet spot for top scores.' },
          { pct: '15%', label: 'Length of History', tip: 'Never close your oldest card. Even unused, it holds your credit age.' },
          { pct: '10%', label: 'Credit Mix', tip: 'Having both revolving credit (cards) and installment loans helps your score.' },
          { pct: '10%', label: 'New Inquiries', tip: 'Every hard inquiry drops your score ~5 pts. Don\'t apply for multiple cards at once.' },
        ],
        callout: { label: 'Fast Track', text: 'Become an authorized user on a family member\'s old, low-balance card. You inherit their history instantly.' },
      },
      {
        label: 'Pay It Off', icon: '🏔️',
        headline: 'Avalanche vs Snowball',
        body: 'Both methods work. The right one is the one you\'ll actually stick to.',
        sections: [
          { title: 'Avalanche — Saves Most Money', color: '#4a7c59', items: ['Pay minimums on all debts', 'Throw every extra dollar at the highest APR debt', 'When paid off, attack the next highest', 'Mathematically optimal — costs you the least'] },
          { title: 'Snowball — Best for Motivation', color: '#7ab8d4', items: ['Pay minimums on all debts', 'Throw every extra dollar at the smallest balance', 'When paid off, roll that payment to the next smallest', 'Fastest psychological wins — keeps you going'] },
        ],
        callout: { label: 'Which to Pick', text: 'If you\'ve quit before — choose Snowball. The wins keep you going. If motivation isn\'t an issue — Avalanche saves more money.' },
      },
    ],
  },

  /* ────────────────────────────── INSURANCE ── */
  insurance: {
    title: 'Insurance', Icon: Umbrella, tint: C.sageBg,
    tabs: [
      {
        label: 'What You Need', icon: '🛡️',
        headline: 'The Coverage Stack',
        body: 'Insurance protects everything you\'re building. These are the non-negotiables.',
        sections: [
          { title: 'Non-Negotiable', color: '#4a7c59', items: ['Health — one ER visit can cost $30,000+', 'Auto — legally required in most states', 'Renters/homeowners — protects your stuff and liability', 'Disability — the most overlooked policy there is'] },
          { title: 'If You Have Dependents', color: '#7ab8d4', items: ['Term life insurance — 10–12x your annual income', 'Umbrella policy — adds $1–5M liability cheaply'] },
        ],
        callout: { label: 'The Stat', text: '1 in 4 workers will become disabled before retirement. Most have no long-term disability coverage.' },
      },
      {
        label: 'Life Insurance', icon: '❤️',
        headline: 'Term vs Whole Life',
        body: 'The insurance industry loves selling whole life. Here\'s what you actually need.',
        pills: [
          { pct: 'TERM', label: 'Best for Most People', tip: 'Pure death benefit for 10, 20, or 30 years. 5–15x cheaper than whole life. Healthy 35-year-old gets $1M for ~$50/month.' },
          { pct: 'WHOLE', label: 'Rarely the Right Call', tip: 'Permanent coverage + cash value. Sounds great — grows slowly, and agents earn high commissions selling it.' },
        ],
        sections: [
          { title: 'How Much Do You Need?', color: '#4a7c59', items: ['10–12x your annual income is the standard rule', 'DIME: Debt + Income×years + Mortgage + Education', 'Only necessary if someone depends on your income', 'Stay-at-home parents need it too — childcare has a cost'] },
        ],
        callout: { label: 'The Consensus', text: 'Buy term life. Invest the premium difference in an index fund. You\'ll almost certainly come out ahead.' },
      },
      {
        label: 'Disability', icon: '🩺',
        headline: 'The Coverage Nobody Has',
        body: 'Your ability to earn is your biggest financial asset. Disability insurance protects it.',
        sections: [
          { title: 'Short-Term Disability', color: '#7ab8d4', items: ['Covers 60–70% of income for 3–6 months', 'Kicks in after a 0–14 day elimination period', 'Often provided by employers'] },
          { title: 'Long-Term Disability', color: '#4a7c59', items: ['Covers 60–70% of income for years — until retirement', 'Elimination period: typically 90 days', 'Own-occupation: pays if you can\'t do YOUR job', 'Any-occupation: only pays if you can\'t work at all (harder to collect)'] },
        ],
        callout: { label: 'Key Move', text: 'If your employer offers long-term disability as a voluntary benefit, enroll. Group rates are far cheaper than buying individual coverage on the open market.' },
      },
    ],
  },

  /* ────────────────────────────── BUDGETING ── */
  budgeting: {
    title: 'Budgeting', Icon: PieChart, tint: C.butterBg,
    tabs: [
      {
        label: '50/30/20 Rule', icon: '🥧',
        headline: 'The Simplest Budget That Works',
        body: 'You don\'t need a spreadsheet with 47 categories. This one ratio covers most people\'s lives.',
        sections: [
          { title: '50% — Needs', color: '#4a7c59', items: ['Rent or mortgage', 'Groceries, utilities, transportation', 'Minimum debt payments', 'Health insurance premiums'] },
          { title: '30% — Wants', color: '#7ab8d4', items: ['Dining out, entertainment, subscriptions', 'Travel and hobbies', 'Clothing beyond basics', 'Anything you\'d survive without'] },
          { title: '20% — Savings & Debt', color: '#c9a96e', items: ['Emergency fund building', 'Retirement contributions', 'Extra debt payments', 'Investing beyond retirement'] },
        ],
        callout: { label: 'If 50% Doesn\'t Fit', text: 'If your needs eat more than 50% of take-home, adjust wants first — not savings. Protect the 20% at all costs.' },
      },
      {
        label: 'Zero-Based Budget', icon: '🎯',
        headline: 'Give Every Dollar a Job',
        body: 'Income minus all assigned expenses equals zero. Not because you spend everything — because every dollar has a purpose before the month starts.',
        sections: [
          { title: 'How to Build One', color: '#4a7c59', items: ['Start with your monthly take-home income', 'List every expected expense that month', 'Assign money to savings and investing first', 'Allocate what\'s left to discretionary spending', 'If the math goes negative, cut a want — not a need'] },
          { title: 'Why It Works', color: '#7ab8d4', items: ['Eliminates unconscious spending', 'Forces intentional decisions on every dollar', 'Works with irregular income (freelancers, tips)', 'You see where every cent goes'] },
        ],
        callout: { label: 'The Key Shift', text: 'Most people budget what\'s left after spending. Zero-based budgets what\'s left after saving. That single reversal changes everything.' },
      },
      {
        label: 'Track & Fix', icon: '🔍',
        headline: 'You Can\'t Change What You Don\'t Measure',
        body: 'One month of honest tracking reveals patterns you didn\'t know existed.',
        sections: [
          { title: 'What to Track', color: '#4a7c59', items: ['Every transaction — no exceptions', 'Subscription list audit (most people are shocked)', 'Food spending — usually the biggest surprise', 'ATM cash withdrawals — the money that disappears'] },
          { title: 'Simple Methods', color: '#7ab8d4', items: ['App-based: Copilot, YNAB, or Monarch Money', 'Spreadsheet: Google Sheets with one row per transaction', 'Envelope method: cash divided into labeled envelopes', 'Bank export: download CSV and sum by category'] },
        ],
        callout: { label: 'The 30-Day Rule', text: 'Track everything for one full month before making any budget decisions. You\'ll see the truth — and it\'s usually surprising.' },
      },
    ],
  },

  /* ────────────────────────────── EMERGENCY FUND ── */
  emergency: {
    title: 'Emergency Fund', Icon: Shield, tint: C.tangerineBg,
    tabs: [
      {
        label: 'How Much?', icon: '🎯',
        headline: 'Calculate Your Number',
        body: '3–6 months sounds simple. Your actual number depends on your situation.',
        sections: [
          { title: 'Use 3 Months If...', color: '#4a7c59', items: ['You have a stable salaried job', 'Dual income household', 'Low debt and strong job market in your field', 'Employer-provided disability insurance'] },
          { title: 'Use 6 Months If...', color: '#c0392b', items: ['Self-employed or freelance income', 'Single income household', 'Commission-based pay', 'Specialized role that takes time to replace', 'Health conditions or older dependents'] },
        ],
        callout: { label: 'The Right Number', text: 'Calculate your bare-bones monthly expenses — not income. Rent, food, utilities, minimums, transport. That\'s the number. Multiply by 3 or 6.' },
      },
      {
        label: 'Where to Keep It', icon: '🏦',
        headline: 'Not Checking. Not Invested.',
        body: 'An emergency fund in the wrong place is an emergency fund that fails when you need it.',
        pills: [
          { pct: '✓', label: 'High-Yield Savings Account', tip: 'Current rates: 4.5–5.0% APY (2026). Liquid, FDIC insured, earns real money while it waits. Use Marcus, SoFi, or Ally.' },
          { pct: '✓', label: 'Money Market Account', tip: 'Similar rates to HYSA, sometimes with check-writing ability. Good alternative at credit unions.' },
          { pct: '✗', label: 'Checking Account', tip: 'Earns near 0% and is too easy to spend. The mental separation matters.' },
          { pct: '✗', label: 'Invested in Stocks', tip: 'What happens if the market drops 40% the same week you lose your job? This is the exact scenario an emergency fund prevents.' },
        ],
        callout: { label: 'The Name Matters', text: 'Name your HYSA "Emergency Fund Only." Studies show labeled savings accounts are withdrawn from far less often than unnamed ones.' },
      },
      {
        label: 'Build It Fast', icon: '⚡',
        headline: 'From $0 to Fully Funded',
        body: 'The hardest part is starting. These are the fastest paths to your target.',
        sections: [
          { title: 'Immediate Moves', color: '#4a7c59', items: ['Open a HYSA today — it takes 10 minutes', 'Set up automatic transfer on payday — before you can spend it', 'Start with 10% of each paycheck', 'Split direct deposit: 90% to checking, 10% to HYSA'] },
          { title: 'Accelerate With Windfalls', color: '#7ab8d4', items: ['Tax refund → emergency fund first', '50% of any bonus to the fund until fully funded', 'Sell unused items — most people have $200–500 in stuff', 'One no-spend weekend per month — save the difference'] },
        ],
        callout: { label: 'The Milestone Method', text: 'Start with a $1,000 starter emergency fund first. That one milestone stops most financial spirals. Then build to the full 3–6 months.' },
      },
    ],
  },

  /* ────────────────────────────── INVESTING ── */
  investing: {
    title: 'Investing Basics', Icon: TrendingUp, tint: C.plumBg,
    tabs: [
      {
        label: 'Compound Interest', icon: '❄️',
        headline: 'The 8th Wonder of the World',
        body: 'Einstein allegedly said this. Whether he did or not, the math is undeniable.',
        sections: [
          { title: 'How It Works', color: '#4a7c59', items: ['You earn returns on your original investment', 'Then you earn returns on those returns', 'Then returns on those returns — and so on', 'Time is the key ingredient, not the amount'] },
          { title: 'The Numbers Are Wild', color: '#7ab8d4', items: ['$10,000 at 8% for 10 years = $21,589', '$10,000 at 8% for 30 years = $100,626', '$10,000 at 8% for 40 years = $217,245', 'Starting 10 years earlier roughly doubles the outcome'] },
        ],
        callout: { label: 'Rule of 72', text: 'Divide 72 by your annual return to get years to double your money. At 8%: 72 ÷ 8 = 9 years to double. At 6%: 72 ÷ 6 = 12 years.' },
      },
      {
        label: 'Risk vs Return', icon: '⚖️',
        headline: 'No Return Without Risk',
        body: 'Every investment sits somewhere on the risk-return spectrum. Understanding where you are is the first step.',
        pills: [
          { pct: 'LOW', label: 'Cash & CDs', tip: 'FDIC insured, no risk of loss. Yields: 4–5% today. Real risk: inflation eats your purchasing power over time.' },
          { pct: 'MED', label: 'Bonds', tip: 'Loan to a government or company. Get paid interest. If they default, you lose. Less volatile than stocks but more return than cash.' },
          { pct: 'HIGH', label: 'Stocks', tip: 'Ownership in a company. Historical average: ~10%/year (S&P 500). Can drop 40–50% in a bad year. Rewarding over long periods.' },
          { pct: 'VAR', label: 'Real Estate', tip: 'Tangible asset, rental income, tax benefits. Illiquid, requires management, location-dependent. High variance across markets.' },
        ],
        callout: { label: 'Time Horizon Is Everything', text: 'Money needed in under 3 years should not be in stocks. Money you won\'t touch for 15+ years should almost all be in stocks.' },
      },
      {
        label: 'Your First Move', icon: '🚀',
        headline: 'The Right Order of Operations',
        body: 'Where you put money first matters more than which specific investments you choose.',
        sections: [
          { title: 'The Priority Order', color: '#4a7c59', items: ['1. Emergency fund (3–6 months) — do this first', '2. 401k up to employer match — it\'s a 50–100% instant return', '3. Pay off high-interest debt (15%+ APR)', '4. Max HSA if eligible ($4,300 individual / $8,550 family 2026)', '5. Max Roth IRA ($7,000 or $8,000 if 50+)', '6. Max 401k beyond match', '7. Taxable brokerage account with anything left'] },
        ],
        callout: { label: 'Don\'t Overthink It', text: 'A broad market index fund (like VTI or FSKAX) inside your 401k or Roth IRA is one of the most powerful financial moves available to any person at any income level.' },
      },
    ],
  },

  /* ────────────────────────────── RETIREMENT ACCOUNTS ── */
  retirement: {
    title: 'Retirement Accounts', Icon: Clock, tint: C.skyBg,
    tabs: [
      {
        label: '401k vs IRA', icon: '🏛️',
        headline: 'Know Your Account Types',
        body: 'These two account types are the foundation of almost every American\'s retirement plan.',
        sections: [
          { title: '401k / 403b', color: '#4a7c59', items: ['Offered through your employer', '2026 contribution limit: $23,500 (under 50)', 'Catch-up: $31,000 if 50+', 'Pre-tax (Traditional) or post-tax (Roth) versions', 'Employer match is free money — always capture it first'] },
          { title: 'IRA (Individual)', color: '#7ab8d4', items: ['Open it yourself at any brokerage', '2026 contribution limit: $7,000 (under 50)', 'Catch-up: $8,000 if 50+', 'Traditional: tax deduction now, taxed in retirement', 'Roth: no deduction now, tax-FREE in retirement'] },
        ],
        callout: { label: 'Roth vs Traditional', text: 'If you\'re young and in a low tax bracket now — Roth wins. You pay tax at today\'s rate and never pay again. If you\'re in your peak earning years — Traditional may save more today.' },
      },
      {
        label: 'The 4% Rule', icon: '📐',
        headline: 'How Much Do You Need to Retire?',
        body: 'The 4% rule gives you a simple way to calculate your retirement number.',
        sections: [
          { title: 'The Formula', color: '#4a7c59', items: ['Annual expenses in retirement × 25 = your FIRE number', 'You can withdraw 4% per year with high confidence it lasts 30+ years', 'This is based on historical US stock/bond returns', 'Adjust: use 3.5% rule for 35–40 year retirements to be safer'] },
          { title: 'Example', color: '#7ab8d4', items: ['Spend $60,000/year → need $1,500,000', 'Spend $80,000/year → need $2,000,000', 'Spend $100,000/year → need $2,500,000', 'Social Security income reduces how much you need'] },
        ],
        callout: { label: 'The Key Lever', text: 'Your spending in retirement matters more than your income before retirement. Reducing annual expenses by $10,000 means you need $250,000 less saved.' },
      },
      {
        label: 'Start Now', icon: '⏰',
        headline: 'Why a 25-Year-Old Beats a 35-Year-Old',
        body: 'The cost of waiting a decade is enormous. The numbers speak for themselves.',
        pills: [
          { pct: '25', label: 'Invests $5,000/yr for 10 years then stops', tip: 'Total invested: $50,000. Value at 65 (8% avg): ~$787,000. The 40 years of compounding does most of the work.' },
          { pct: '35', label: 'Invests $5,000/yr for 30 years straight', tip: 'Total invested: $150,000. Value at 65 (8% avg): ~$566,000. More money invested, but started too late.' },
          { pct: '⚡', label: 'The Lesson', tip: 'The 25-year-old invested $100,000 LESS and still came out $221,000 ahead. Time is the most powerful force in investing.' },
        ],
        callout: { label: 'Best Time to Start', text: 'Twenty years ago. Second best time: today. Even $50/month started now beats $500/month started in 10 years.' },
      },
    ],
  },

  /* ────────────────────────────── TAX STRATEGY ── */
  tax: {
    title: 'Tax Strategy', Icon: FileText, tint: C.sageBg,
    tabs: [
      {
        label: 'How Brackets Work', icon: '📊',
        headline: 'Marginal vs Effective Rate',
        body: 'One of the most misunderstood concepts in personal finance. Your tax bracket is NOT your tax rate on all your income.',
        sections: [
          { title: '2026 Brackets (Single Filer)', color: '#4a7c59', items: ['10%: $0 – $11,925', '12%: $11,926 – $48,475', '22%: $48,476 – $103,350', '24%: $103,351 – $197,300', '32%: $197,301 – $250,525', '35%: $250,526 – $626,350', '37%: over $626,350'] },
          { title: 'How to Read This', color: '#7ab8d4', items: ['You pay 10% only on the first $11,925', 'You pay 12% only on income between $11,926–$48,475', 'Being "in the 22% bracket" doesn\'t mean paying 22% on everything', 'Your effective rate is the weighted average — usually much lower'] },
        ],
        callout: { label: 'Example', text: 'On $60,000 income: you pay ~$8,800 in federal tax. That\'s a 14.6% effective rate — even though you\'re "in" the 22% bracket.' },
      },
      {
        label: 'Deductions & Credits', icon: '✂️',
        headline: 'Two Ways to Reduce Your Tax Bill',
        body: 'Deductions reduce taxable income. Credits reduce taxes owed dollar-for-dollar. Credits are more powerful.',
        sections: [
          { title: 'Common Deductions', color: '#4a7c59', items: ['Standard deduction 2026: $15,000 single / $30,000 married', 'Student loan interest: up to $2,500 above-the-line', 'IRA contributions (Traditional): deductible if eligible', '401k contributions: pre-tax, reduces your W-2 income', 'HSA contributions: always deductible regardless of itemizing'] },
          { title: 'Common Credits', color: '#7ab8d4', items: ['Child Tax Credit: $2,000 per qualifying child', 'Earned Income Credit: up to $7,830 (low-moderate income)', 'Saver\'s Credit: up to $1,000 for retirement contributions', 'Child & Dependent Care Credit: childcare expenses'] },
        ],
        callout: { label: 'Above-the-Line Is Best', text: 'Above-the-line deductions (401k, IRA, HSA, student loan interest) work even if you take the standard deduction. These are your most accessible tax levers.' },
      },
      {
        label: 'Tax-Advantaged Stack', icon: '🏗️',
        headline: 'The Accounts That Cut Your Tax Bill',
        body: 'The government rewards certain financial behaviors with permanent tax advantages. Use them all.',
        pills: [
          { pct: '401k', label: 'Pre-Tax Growth', tip: 'Contributions lower your taxable income this year. Grows tax-deferred. Pay tax only when you withdraw in retirement. 2026 limit: $23,500.' },
          { pct: 'Roth', label: 'Tax-Free Growth', tip: 'Contribute after-tax dollars. Grows completely tax-free. Withdrawals in retirement are 100% tax-free. Best when young or in low brackets.' },
          { pct: 'HSA', label: 'Triple Tax Advantage', tip: 'Pre-tax in. Tax-free growth. Tax-free withdrawals for medical. After 65: spend on anything (taxed like 401k). The most powerful account available.' },
          { pct: '529', label: 'Education Tax-Free', tip: 'After-tax contributions. Tax-free growth. Tax-free withdrawals for education. Unused funds can now roll to a Roth IRA (up to $35,000 lifetime).' },
        ],
        callout: { label: 'Max the Stack First', text: 'Before investing in a taxable brokerage account, fully fund your 401k, Roth IRA, and HSA. These give you the same market returns but with permanent tax advantages.' },
      },
    ],
  },

  /* ────────────────────────────── HOME BUYING ── */
  homebuying: {
    title: 'Home Buying', Icon: Home, tint: C.butterBg,
    tabs: [
      {
        label: 'Rent vs Buy', icon: '🏠',
        headline: 'The Question Everyone Gets Wrong',
        body: 'Buying isn\'t always better than renting. It depends entirely on how long you stay.',
        sections: [
          { title: 'The 5% Rule (Ben Felix)', color: '#4a7c59', items: ['Multiply home price × 5%', 'Divide by 12 = your monthly "cost of ownership"', 'If rent is lower than this, renting may be better', 'Example: $400,000 home × 5% = $20,000/yr = $1,667/mo'] },
          { title: 'The 5% Covers', color: '#7ab8d4', items: ['~1% property tax (varies by location)', '~1% maintenance and repairs (often underestimated)', '~3% cost of capital (mortgage interest or opportunity cost'] },
        ],
        callout: { label: 'Break-Even Horizon', text: 'Most analysis shows you need to stay 5–7 years to outperform renting after transaction costs. If you might move sooner, renting may be smarter.' },
      },
      {
        label: 'How Much House?', icon: '📏',
        headline: 'The Rules Lenders Use',
        body: 'Lenders will give you more than you should borrow. Use these rules to set your own limits.',
        pills: [
          { pct: '28%', label: 'Front-End Ratio', tip: 'Your monthly housing payment (PITI: principal, interest, taxes, insurance) should be no more than 28% of gross monthly income.' },
          { pct: '36%', label: 'Back-End Ratio (Total Debt)', tip: 'All monthly debt payments (housing + car + student loans + credit cards) should stay under 36% of gross income.' },
          { pct: '20%', label: 'Down Payment Target', tip: 'Putting down 20% eliminates PMI (private mortgage insurance), which costs 0.5–1.5% of your loan per year — often $100–300/month wasted.' },
        ],
        sections: [
          { title: 'Hidden Costs New Buyers Miss', color: '#c0392b', items: ['Closing costs: 2–5% of loan amount', 'Moving costs: $1,000–5,000+', 'Immediate repairs and updates', 'HOA fees (can be $200–800/month)', 'Higher utility costs than renting'] },
        ],
        callout: { label: 'The Real Budget', text: 'A lender approving you for $500,000 doesn\'t mean you should spend $500,000. Approve yourself — using your own comfort level, not theirs.' },
      },
      {
        label: 'The Mortgage', icon: '📝',
        headline: 'Fixed, ARM, and the Points Game',
        body: 'Choosing the wrong mortgage type or missing key details can cost tens of thousands over time.',
        sections: [
          { title: '30-Year Fixed', color: '#4a7c59', items: ['Predictable payment forever', 'Higher rate than 15-year', 'Best if you plan to stay long-term', 'Lower monthly payment = more breathing room'] },
          { title: '15-Year Fixed', color: '#7ab8d4', items: ['Lower interest rate', 'Build equity twice as fast', 'Monthly payment ~40% higher than 30-year', 'Best if you can comfortably afford it'] },
          { title: 'Adjustable Rate (ARM)', color: '#c0392b', items: ['Lower rate initially (5/1 or 7/1)', 'Rate adjusts after fixed period', 'Risky if you can\'t handle rate increases', 'Can make sense if selling before adjustment'] },
        ],
        callout: { label: 'On Points', text: 'Buying points (prepaid interest) lowers your rate. Each point = 1% of loan = ~0.25% rate reduction. Calculate your break-even — usually 5–7 years. Only worth it if you\'re keeping the loan that long.' },
      },
    ],
  },

  /* ────────────────────────────── ESTATE PLANNING ── */
  estate: {
    title: 'Estate Planning', Icon: BookOpen, tint: C.plumBg,
    tabs: [
      {
        label: 'Why It Matters Now', icon: '📋',
        headline: 'Not Just for the Wealthy or Old',
        body: 'If you have a bank account, a car, a dog, or a preference about your medical care — you need an estate plan.',
        sections: [
          { title: 'Without a Plan', color: '#c0392b', items: ['Your state decides who gets your assets', 'Probate court process can take 1–2 years', 'Probate can consume 3–7% of your estate in fees', 'Your minor children\'s guardian is decided by a judge', 'Doctors may not know your end-of-life wishes'] },
          { title: 'With a Plan', color: '#4a7c59', items: ['Assets go to exactly who you choose', 'Transfers can happen in days, not months', 'Costs are minimized', 'You choose guardians for your children', 'Your healthcare wishes are legally documented'] },
        ],
        callout: { label: 'The Easiest Win', text: 'Update your beneficiary designations today. 401k, IRA, and life insurance pass outside your will — they go directly to whoever is named. Outdated beneficiaries override everything.' },
      },
      {
        label: 'The Core 4', icon: '📄',
        headline: 'The 4 Documents Everyone Needs',
        body: 'You don\'t need a trust to have an estate plan. These four documents cover most people completely.',
        pills: [
          { pct: '1', label: 'Last Will & Testament', tip: 'Names who gets your stuff. Names guardians for minor children. Without one, your state\'s laws decide — and they may not match your wishes.' },
          { pct: '2', label: 'Durable Power of Attorney', tip: 'Names who makes financial decisions if you\'re incapacitated. Without one, your family may need court approval to pay your bills.' },
          { pct: '3', label: 'Healthcare Directive', tip: 'Specifies your medical wishes if you can\'t communicate. Includes DNR preferences, life support, organ donation. Removes impossible burden from family.' },
          { pct: '4', label: 'Beneficiary Designations', tip: 'Update these on all financial accounts. They override your will entirely. Check them after every major life event: marriage, divorce, birth, death.' },
        ],
        callout: { label: 'Where to Start', text: 'Online services like Trust & Will or Fabric can create a will and POA for $100–200. A full estate attorney costs $1,000–3,000 but is worth it for complex situations.' },
      },
      {
        label: 'Trusts', icon: '🏛️',
        headline: 'What a Trust Actually Does',
        body: 'A trust isn\'t just for rich people. It\'s a powerful tool for anyone who wants to control how their assets transfer.',
        sections: [
          { title: 'Revocable Living Trust', color: '#4a7c59', items: ['You create it now, control it while alive', 'Assets in the trust avoid probate entirely', 'Transfers immediately at death — no court delays', 'Can be changed or cancelled anytime', 'Doesn\'t provide asset protection from creditors'] },
          { title: 'When a Trust Makes Sense', color: '#7ab8d4', items: ['You own real estate in multiple states', 'You want to keep finances private (wills are public record)', 'You have minor children and want to control when they inherit', 'Blended family — specific inheritance instructions needed', 'Estate value over $500,000'] },
        ],
        callout: { label: 'Trust vs Will', text: 'A will goes through probate — public, slow, expensive. A trust doesn\'t — private, fast, cheap. The trade-off: a trust costs more to set up ($1,500–3,000) but saves more on the back end.' },
      },
    ],
  },

  /* ────────────────────────────── SOCIAL SECURITY ── */
  socialsecurity: {
    title: 'Social Security', Icon: Users, tint: C.skyBg,
    tabs: [
      {
        label: 'How It Works', icon: '🏛️',
        headline: 'You\'ve Been Paying In — Here\'s What You Get',
        body: 'Social Security is funded by the 6.2% payroll tax on your wages. Here\'s how your benefit is calculated.',
        sections: [
          { title: 'Earning Credits', color: '#4a7c59', items: ['You need 40 work credits to qualify for benefits', '4 credits maximum per year', 'In 2026: earn $1,730 per credit', '10 years of work = eligible for benefits'] },
          { title: 'How the Benefit Is Calculated', color: '#7ab8d4', items: ['SSA takes your highest 35 years of earnings', 'Adjusts for inflation (AIME calculation)', 'Applies a progressive formula (bend points)', 'Replaces more income for lower earners proportionally', 'Check your estimate at SSA.gov — make an account'] },
        ],
        callout: { label: 'Key Check', text: 'Create a my Social Security account at ssa.gov. Your projected benefit at 62, 67, and 70 is listed there. Most people never look at this — and are surprised by what they find.' },
      },
      {
        label: 'When to Claim', icon: '⏱️',
        headline: 'The $100,000+ Decision',
        body: 'The month you choose to claim Social Security can change your lifetime benefit by six figures.',
        pills: [
          { pct: '62', label: 'Early — Permanent Reduction', tip: 'Claim at 62 and your benefit is permanently reduced by up to 30%. The trade-off: you collect for more years. Better if health is poor or you really need the income.' },
          { pct: '67', label: 'Full Retirement Age', tip: 'Born after 1960: your FRA is 67. You receive 100% of your calculated benefit. The middle path — no reduction, no bonus.' },
          { pct: '70', label: 'Maximum — Delayed Credits', tip: 'For every year you wait past FRA, your benefit grows 8%. From 67 to 70 = 24% more per month, guaranteed, for life. Best if you\'re healthy and have other income.' },
        ],
        callout: { label: 'Break-Even', text: 'Delaying from 62 to 70 typically has a break-even around age 80. If you expect to live past 80, waiting pays off significantly. If not — claiming earlier makes sense.' },
      },
      {
        label: 'Spousal & Survivor', icon: '👫',
        headline: 'Benefits Beyond Your Own Record',
        body: 'Social Security has rules most married couples don\'t know about that can significantly increase household income.',
        sections: [
          { title: 'Spousal Benefits', color: '#4a7c59', items: ['Spouse can claim up to 50% of your benefit at their FRA', 'Available even if they never worked', 'Must be married at least 1 year', 'Divorced spouses may qualify if married 10+ years', 'Does NOT increase if you delay past FRA (unlike your own)'] },
          { title: 'Survivor Benefits', color: '#7ab8d4', items: ['Surviving spouse can claim up to 100% of deceased spouse\'s benefit', 'Can switch to survivor benefit if it\'s larger than your own', 'Available as early as age 60 (reduced)', 'Strategy: claim your own benefit early, switch to survivor later', 'The higher earner\'s decision most impacts survivor benefits'] },
        ],
        callout: { label: 'Household Strategy', text: 'In most dual-income households: the lower earner claims first (at 62 or 67), the higher earner delays to 70. This maximizes lifetime household income and the survivor benefit.' },
      },
    ],
  },

  /* ────────────────────────────── STUDENT LOANS ── */
  studentloans: {
    title: 'Student Loans', Icon: GraduationCap, tint: C.sageBg,
    tabs: [
      {
        label: 'Federal vs Private', icon: '🎓',
        headline: 'Not All Student Loans Are Equal',
        body: 'Federal loans come with protections private loans don\'t. Know what you have before making any decisions.',
        sections: [
          { title: 'Federal Loans — Keep These', color: '#4a7c59', items: ['Income-driven repayment options (IDR)', 'Public Service Loan Forgiveness (PSLF) eligible', 'Deferment and forbearance available', 'Fixed interest rates', 'Forgiven after 20–25 years on IDR plans'] },
          { title: 'Private Loans — Handle Carefully', color: '#c0392b', items: ['No income-driven repayment options', 'No federal forgiveness programs', 'Variable rates possible — can rise significantly', 'Less flexible in hardship', 'Can refinance, but you lose federal protections'] },
        ],
        callout: { label: 'Critical Warning', text: 'Never refinance federal loans into private without understanding what you\'re giving up. You permanently lose IDR options, PSLF eligibility, and federal hardship protections.' },
      },
      {
        label: 'Repayment Plans', icon: '📋',
        headline: 'Your Income, Your Payment',
        body: 'Federal income-driven repayment plans cap your payment as a percentage of your discretionary income.',
        pills: [
          { pct: 'SAVE', label: 'Current Best Plan (2026)', tip: 'Caps payment at 5% of discretionary income for undergrad loans. Forgiveness after 10 years if balance ≤ $12,000. Check current status — this plan has faced legal challenges.' },
          { pct: 'IBR', label: 'Income-Based Repayment', tip: 'Payment = 10–15% of discretionary income depending on when you borrowed. Forgiveness after 20–25 years. Most stable option currently.' },
          { pct: 'PSLF', label: 'Public Service Forgiveness', tip: 'Work for government or eligible nonprofit + 120 qualifying payments (10 years) = complete forgiveness. Tax-free. Requires specific repayment plans and employer certification.' },
        ],
        callout: { label: 'Apply at Studentaid.gov', text: 'All federal loan repayment plan applications, PSLF certification, and IDR enrollment happen at studentaid.gov. It\'s free. No third party needed — avoid companies charging fees for this.' },
      },
      {
        label: 'Pay It Off Fast', icon: '⚡',
        headline: 'When Aggressive Payoff Makes Sense',
        body: 'Not everyone should pursue forgiveness. For some borrowers, aggressive payoff wins.',
        sections: [
          { title: 'Aggressively Pay Off If...', color: '#4a7c59', items: ['Private sector career (no PSLF path)', 'High income relative to loan balance', 'Rate is above 6% — the psychological and financial cost is real', 'Debt is causing serious anxiety — peace of mind has value'] },
          { title: 'Pursue Forgiveness If...', color: '#7ab8d4', items: ['Working in public service or nonprofit', 'High balance relative to income', 'On IDR: balance is growing, not shrinking (forgiveness wins)', 'Rate is low (under 4%) — you can invest the difference instead'] },
        ],
        callout: { label: 'The Math Check', text: 'Run both scenarios: total paid under aggressive payoff vs total paid under IDR + forgiveness. The lower number wins. studentaid.gov\'s Loan Simulator does this for you in minutes.' },
      },
    ],
  },

  /* ────────────────────────────── SIDE INCOME ── */
  sideincome: {
    title: 'Side Income', Icon: Briefcase, tint: C.butterBg,
    tabs: [
      {
        label: 'Side Hustle vs Passive', icon: '💼',
        headline: 'Trading Time vs Building Assets',
        body: 'Not all extra income is created equal. Know what you\'re actually building.',
        sections: [
          { title: 'Active Side Hustle', color: '#4a7c59', items: ['You trade time for money', 'Income stops when you stop', 'Fast to start, immediate cash', 'Examples: freelancing, driving, tutoring, consulting'] },
          { title: 'Passive Income', color: '#7ab8d4', items: ['Earn from assets you\'ve built or bought', 'Ongoing income with less active time', 'Takes longer to build, front-loaded effort', 'Examples: rental property, dividends, digital products, content'] },
        ],
        callout: { label: 'The Reality', text: 'True passive income takes years to build. Most "passive income" still requires management time. The best side income matches your existing skills and has a path to scale.' },
      },
      {
        label: 'Taxes on Side Income', icon: '🧾',
        headline: 'Self-Employment Adds a Tax Layer',
        body: 'Side income isn\'t taxed like a W-2 paycheck. Understanding this upfront prevents a painful surprise in April.',
        sections: [
          { title: 'What\'s Different', color: '#c0392b', items: ['Self-employment tax: 15.3% on net earnings (Social Security + Medicare)', 'You pay both the employee AND employer portion', 'No withholding — you owe it all at tax time', 'Must pay quarterly estimated taxes if you\'ll owe $1,000+'] },
          { title: 'How to Handle It', color: '#4a7c59', items: ['Set aside 25–30% of every side income payment', 'Open a separate savings account for this money', 'Pay quarterly (April 15, June 15, Sept 15, Jan 15)', 'Deduct business expenses: equipment, home office, mileage, software'] },
        ],
        callout: { label: 'Silver Lining', text: 'Self-employment income lets you contribute to a SEP-IRA or Solo 401k. A Solo 401k lets you shelter up to $70,000/year (2026) in tax-advantaged retirement savings.' },
      },
      {
        label: 'Best Side Hustles', icon: '⭐',
        headline: 'Ranked by Return on Time',
        body: 'The best side hustle is one that uses your existing skills and has a clear path to growth.',
        pills: [
          { pct: '💡', label: 'Skills-Based Freelancing', tip: 'Consulting, copywriting, design, development, accounting. Highest hourly rate because clients pay for expertise. Platforms: Upwork, Toptal, direct outreach.' },
          { pct: '📚', label: 'Teaching & Coaching', tip: 'Tutoring, online courses, career coaching. Scalable over time. Platforms: Teachable, Kajabi, direct booking.' },
          { pct: '🏠', label: 'Asset Rental', tip: 'Spare room, car, parking spot, storage space, equipment. Leverages what you already own. Truly passive once set up.' },
          { pct: '📦', label: 'Service-Based Local', tip: 'Dog walking, handyman, cleaning, lawn care. Low barrier to entry, immediate local demand. Apps: Rover, TaskRabbit, Angi.' },
        ],
        callout: { label: 'The Best First Step', text: 'Before starting anything new, make a list of skills you already get paid for at your job. Someone will pay for those skills independently — usually at a much higher hourly rate.' },
      },
    ],
  },

  /* ────────────────────────────── INDEX FUNDS ── */
  indexfunds: {
    title: 'Index Funds', Icon: BarChart2, tint: C.plumBg,
    tabs: [
      {
        label: 'Why Index Wins', icon: '📈',
        headline: 'The Math Against Active Management',
        body: 'The data is decades deep and nearly universal. Index funds beat the vast majority of actively managed funds over time.',
        sections: [
          { title: 'The Numbers', color: '#4a7c59', items: ['80–90% of active fund managers underperform their index over 15 years (SPIVA report)', 'The few that do outperform don\'t repeat it reliably', 'A manager who beats the market can\'t be identified in advance', 'Past performance genuinely does not predict future results'] },
          { title: 'Why This Happens', color: '#7ab8d4', items: ['Active funds charge 0.5–1.5% fees — that\'s a huge hurdle to clear', 'Markets are highly efficient — information is priced in fast', 'Even skilled managers make human errors in timing', 'The more trades, the more tax events'] },
        ],
        callout: { label: 'Buffett\'s Bet', text: 'Warren Buffett bet $1M that an S&P 500 index fund would beat any hedge fund portfolio over 10 years. He won by a landslide. The S&P returned 125.8%. The hedge funds averaged 36.3%.' },
      },
      {
        label: 'The 3-Fund Portfolio', icon: '🏗️',
        headline: 'Three Funds Cover the Entire World',
        body: 'You don\'t need 20 funds. Three low-cost index funds can hold every publicly traded company on Earth.',
        pills: [
          { pct: 'VTI', label: 'US Total Market', tip: 'Holds all ~3,700 US publicly traded stocks. Large, mid, and small cap. One fund = the entire US market. Expense ratio: 0.03%. (FSKAX is the Fidelity equivalent)' },
          { pct: 'VXUS', label: 'International Total Market', tip: 'Holds ~8,000 stocks from 47 countries outside the US. Diversifies currency and geographic risk. Expense ratio: 0.07%. (FTIHX is the Fidelity equivalent)' },
          { pct: 'BND', label: 'US Total Bond Market', tip: 'Holds thousands of US government and corporate bonds. Reduces portfolio volatility. As you near retirement, shift more here. Expense ratio: 0.03%.' },
        ],
        callout: { label: 'Simple Allocation', text: 'Age 25–40: 80–90% stocks (VTI/VXUS split), 10–20% bonds. Age 50+: gradually shift to 60/40 or 50/50 as you approach retirement and need stability.' },
      },
      {
        label: 'Expense Ratios', icon: '🔬',
        headline: 'The Fee That Quietly Destroys Wealth',
        body: 'A 1% annual fee sounds small. Over 30 years it can cost you 25% of your final portfolio value.',
        sections: [
          { title: 'What 1% Actually Costs', color: '#c0392b', items: ['$100,000 invested at 8% for 30 years = $906,000 with no fees', 'Same investment with 1% annual fee = $724,000', 'That fee cost you $182,000 — not $30,000 in nominal fees', 'The compounding of fees works against you just like compound growth works for you'] },
          { title: 'What to Look For', color: '#4a7c59', items: ['Vanguard index funds: 0.03–0.07%', 'Fidelity Zero funds: 0.00%', 'Schwab index funds: 0.03%', 'Target date funds: 0.10–0.15% (reasonable for simplicity)', 'Actively managed funds: 0.50–1.50% (avoid if possible)'] },
        ],
        callout: { label: 'The Rule', text: 'For broad market index funds, never pay more than 0.20% expense ratio. For anything actively managed, ask what it has returned NET of fees over 15+ years versus its index benchmark. Usually the answer ends the conversation.' },
      },
    ],
  },

  /* ────────────────────────────── HSA ── */
  hsa: {
    title: 'HSA & Benefits', Icon: Heart, tint: C.tangerineBg,
    tabs: [
      {
        label: 'Triple Tax Win', icon: '🏆',
        headline: 'The Most Powerful Account You\'re Probably Ignoring',
        body: 'The Health Savings Account has a tax advantage no other account can match — triple tax free.',
        sections: [
          { title: 'The Triple Tax Advantage', color: '#4a7c59', items: ['Contributions are pre-tax (or tax-deductible)', 'Money grows completely tax-free inside the account', 'Withdrawals for qualified medical expenses are tax-free', 'No other account type offers all three simultaneously'] },
          { title: '2026 Contribution Limits', color: '#7ab8d4', items: ['Individual: $4,300', 'Family: $8,550', 'Catch-up (55+): add $1,000 more', 'Employer contributions count toward this limit', 'Unused funds roll over every year — there\'s no "use it or lose it"'] },
        ],
        callout: { label: 'After 65', text: 'At age 65, your HSA works like a traditional IRA — withdraw for anything, pay ordinary income tax (no penalty). Before 65: non-medical withdrawals trigger a 20% penalty. After 65: no penalty, just tax.' },
      },
      {
        label: 'Invest Your HSA', icon: '📈',
        headline: 'Stop Using It Like a Spending Account',
        body: 'Most people use their HSA like a checking account for copays. The powerful move is to invest it and let it compound for decades.',
        sections: [
          { title: 'The Strategy', color: '#4a7c59', items: ['Contribute the maximum every year', 'Invest contributions in low-cost index funds', 'Pay medical expenses OUT OF POCKET now (save receipts)', 'Let the HSA grow tax-free for decades', 'Reimburse yourself later — there\'s no time limit on reimbursements'] },
          { title: 'Why This Works', color: '#7ab8d4', items: ['A receipt from 2026 can be reimbursed in 2041', 'You get the growth tax-free, then pull out a lump sum tax-free', 'By retirement: $4,300/year × 30 years at 8% = ~$488,000 tax-free', 'Most powerful if you have low medical costs now'] },
        ],
        callout: { label: 'Save Every Receipt', text: 'Keep a folder (digital or physical) of every qualified medical expense you pay out of pocket. IRS defines qualified broadly: prescriptions, dental, vision, therapy, and more. These become your future tax-free withdrawals.' },
      },
      {
        label: 'HSA vs FSA', icon: '⚖️',
        headline: 'Know the Difference Before You Enroll',
        body: 'Open enrollment happens once a year. Choosing wrong costs you real money.',
        pills: [
          { pct: 'HSA', label: 'Health Savings Account', tip: 'Requires a High Deductible Health Plan (HDHP). Rolls over every year — forever. Portable: stays with you when you change jobs. Can be invested. No expiration.' },
          { pct: 'FSA', label: 'Flexible Spending Account', tip: 'Available with most health plans. "Use it or lose it" — most funds expire December 31. Small grace period or rollover ($640 in 2026) at employer discretion. Not portable.' },
          { pct: 'LPFSA', label: 'Limited Purpose FSA', tip: 'Paired with HSA — covers only dental and vision. Lets you keep your HSA intact while still getting FSA tax savings on dental and vision expenses.' },
        ],
        callout: { label: 'HDHP Check', text: 'HSA eligibility requires an HDHP: 2026 minimum deductible is $1,650 individual / $3,300 family. If your plan qualifies, opening an HSA should be a top priority. If your employer contributes — that\'s free money before you invest a dollar.' },
      },
    ],
  },
}

/* ── Streak logic ────────────────────────────────────────────────── */
function computeAndSaveStreak() {
  const key = userKey('fun_streak_v1')
  const todayStr     = new Date().toISOString().split('T')[0]
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  let stored = null
  try { stored = JSON.parse(localStorage.getItem(key)) } catch {}

  let next
  if (!stored?.lastDate) {
    next = { count: 1, lastDate: todayStr }
  } else if (stored.lastDate === todayStr) {
    next = stored                                              // already stamped today
  } else if (stored.lastDate === yesterdayStr) {
    next = { count: (stored.count || 0) + 1, lastDate: todayStr }  // consecutive day
  } else {
    next = { count: 1, lastDate: todayStr }                  // streak broken, restart
  }

  if (next !== stored) {
    try { localStorage.setItem(key, JSON.stringify(next)) } catch {}
  }
  return next.count
}

/* ── Quote rotation ──────────────────────────────────────────────── */
const DAILY_QUOTES = [
  { q: "The stock market is a device for transferring money from the impatient to the patient.", a: "Warren Buffett" },
  { q: "An investment in knowledge pays the best interest.", a: "Benjamin Franklin" },
  { q: "Someone is sitting in the shade today because someone planted a tree a long time ago.", a: "Warren Buffett" },
  { q: "The investor's chief problem — and even his worst enemy — is likely to be himself.", a: "Benjamin Graham" },
  { q: "Do not save what is left after spending, but spend what is left after saving.", a: "Warren Buffett" },
  { q: "Risk comes from not knowing what you're doing.", a: "Warren Buffett" },
  { q: "Buy land, they're not making it anymore.", a: "Mark Twain" },
  { q: "The avoidance of taxes is the only intellectual pursuit that carries any reward.", a: "John Maynard Keynes" },
  { q: "Compound interest is the eighth wonder of the world.", a: "Albert Einstein" },
  { q: "The only certainties in life are death and taxes.", a: "Benjamin Franklin" },
  { q: "Time in the market beats timing the market.", a: "Ken Fisher" },
  { q: "It's not what you earn, it's what you keep.", a: "Unknown" },
  { q: "The best time to plant a tree was twenty years ago. The second best time is now.", a: "Chinese Proverb" },
]
function getDailyQuote() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  return DAILY_QUOTES[Math.floor((now - start) / 86400000) % DAILY_QUOTES.length]
}
function getGreeting() {
  const h = new Date().getHours()
  if (h >= 5  && h < 12) return 'Good morning'
  if (h >= 12 && h < 17) return 'Good afternoon'
  if (h >= 17 && h < 21) return 'Good evening'
  return 'Welcome back'
}

/* ── FocusModal ──────────────────────────────────────────────────── */
function FocusModal({ topicKey, onClose }) {
  const [activeTab, setActiveTab] = useState(0)
  const touchStartX = useRef(null)
  const data = FOCUS_DATA[topicKey]
  const tab  = data.tabs[activeTab]

  function handleTouchStart(e) { touchStartX.current = e.touches[0].clientX }
  function handleTouchEnd(e) {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) < 40) return
    if (dx < 0 && activeTab < data.tabs.length - 1) setActiveTab(t => t + 1)
    if (dx > 0 && activeTab > 0)                    setActiveTab(t => t - 1)
    touchStartX.current = null
  }

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(28,21,16,0.45)', zIndex:400, backdropFilter:'blur(3px)', WebkitBackdropFilter:'blur(3px)' }} />
      <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:401, background:C.bg, borderRadius:'28px 28px 0 0', maxHeight:'88vh', display:'flex', flexDirection:'column', boxShadow:'0 -20px 60px rgba(28,21,16,0.20)' }}>
        <div style={{ width:40, height:4, background:C.b2, borderRadius:99, margin:'12px auto 4px', flexShrink:0 }} />

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 20px 0', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:12, background:data.tint, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <data.Icon size={17} color={C.t1} />
            </div>
            <div style={{ fontFamily:DISPLAY, fontSize:20, fontWeight:700, color:C.t1 }}>{data.title}</div>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:'50%', background:C.raise, border:`1px solid ${C.b1}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
            <X size={15} color={C.t3} />
          </button>
        </div>

        {/* Pill tabs */}
        <div style={{ display:'flex', gap:8, padding:'14px 20px 0', overflowX:'auto', scrollbarWidth:'none', flexShrink:0 }}>
          {data.tabs.map((t, i) => (
            <button key={i} onClick={() => setActiveTab(i)} style={{
              flexShrink:0, padding:'8px 16px', borderRadius:99, cursor:'pointer',
              background: i === activeTab ? C.ink : C.surf,
              border:`1px solid ${i === activeTab ? C.ink : C.b1}`,
              fontFamily:UI, fontSize:13, fontWeight:700,
              color: i === activeTab ? C.cream : C.t2,
              transition:'all 0.18s',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Dot indicators */}
        <div style={{ display:'flex', gap:5, justifyContent:'center', padding:'10px 0 2px', flexShrink:0 }}>
          {data.tabs.map((_, i) => (
            <div key={i} onClick={() => setActiveTab(i)} style={{ width: i === activeTab ? 18 : 6, height:6, borderRadius:99, background: i === activeTab ? C.ink : C.b2, transition:'all 0.2s', cursor:'pointer' }} />
          ))}
        </div>

        {/* Content */}
        <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} style={{ flex:1, overflowY:'auto', padding:'12px 20px 120px' }}>
          <div style={{ textAlign:'center', marginBottom:18 }}>
            <div style={{ fontSize:36, marginBottom:8 }}>{tab.icon}</div>
            <div style={{ fontFamily:DISPLAY, fontSize:20, fontWeight:700, color:C.t1, lineHeight:1.25, marginBottom:8 }}>{tab.headline}</div>
            <div style={{ fontFamily:UI, fontSize:13, color:C.t2, lineHeight:1.6 }}>{tab.body}</div>
          </div>

          {tab.sections?.map((sec, si) => (
            <div key={si} style={{ marginBottom:14, background:C.surf, border:`1px solid ${C.b1}`, borderRadius:18, padding:'14px 16px', borderLeft:`3px solid ${sec.color}` }}>
              <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:sec.color, marginBottom:10 }}>{sec.title}</div>
              {sec.items.map((item, ii) => (
                <div key={ii} style={{ display:'flex', gap:8, marginBottom:6 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:sec.color, flexShrink:0, marginTop:5 }} />
                  <div style={{ fontFamily:UI, fontSize:13, color:C.t2, lineHeight:1.5 }}>{item}</div>
                </div>
              ))}
            </div>
          ))}

          {tab.pills?.map((pill, pi) => (
            <div key={pi} style={{ background:C.surf, border:`1px solid ${C.b1}`, borderRadius:18, padding:'14px 16px', marginBottom:10, display:'flex', gap:14, alignItems:'flex-start' }}>
              <div style={{ background:C.ink, borderRadius:10, padding:'6px 10px', flexShrink:0, minWidth:48, textAlign:'center' }}>
                <div style={{ fontFamily:MONO, fontSize:12, fontWeight:700, color:C.cream }}>{pill.pct}</div>
              </div>
              <div>
                <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.t1, marginBottom:3 }}>{pill.label}</div>
                <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.5 }}>{pill.tip}</div>
              </div>
            </div>
          ))}

          {tab.callout && (
            <div style={{ background:'rgba(232,120,60,0.09)', border:`1px solid rgba(232,120,60,0.25)`, borderRadius:18, padding:'14px 16px', marginTop:4 }}>
              <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:C.tangerine, marginBottom:6 }}>{tab.callout.label}</div>
              <div style={{ fontFamily:UI, fontSize:13, color:C.t2, lineHeight:1.6 }}>{tab.callout.text}</div>
            </div>
          )}

          <div style={{ textAlign:'center', marginTop:20 }}>
            <div style={{ fontFamily:UI, fontSize:11, color:C.t3 }}>← Swipe or tap tabs to explore →</div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ── Sub-components ──────────────────────────────────────────────── */
function SectionHeader({ title, badge }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
      <div style={{ fontFamily:DISPLAY, fontSize:18, fontWeight:600, color:C.t1 }}>{title}</div>
      {badge && (
        <div style={{ display:'flex', alignItems:'center', gap:5, background:C.raise, border:`1px solid ${C.b1}`, borderRadius:99, padding:'4px 10px' }}>
          <RefreshCw size={10} color={C.t3} />
          <span style={{ fontFamily:UI, fontSize:10, fontWeight:600, color:C.t3 }}>{badge}</span>
        </div>
      )}
    </div>
  )
}

function FocusCard({ topicKey, onOpen }) {
  const data = FOCUS_DATA[topicKey]
  return (
    <button onClick={() => onOpen(topicKey)} style={{
      background:data.tint, borderRadius:24, padding:'16px',
      display:'flex', flexDirection:'column', justifyContent:'space-between',
      minHeight:140, border:'none', cursor:'pointer', textAlign:'left', width:'100%',
      WebkitTapHighlightColor:'transparent',
    }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ width:36, height:36, borderRadius:12, background:'rgba(255,255,255,0.6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <data.Icon size={17} color={C.t1} />
        </div>
        <ChevronRight size={14} color={C.t3} />
      </div>
      <div style={{ marginTop:24 }}>
        <div style={{ fontFamily:DISPLAY, fontSize:15, fontWeight:600, color:C.t1, marginBottom:4 }}>{data.title}</div>
        <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.45 }}>3 lessons · tap to explore</div>
      </div>
    </button>
  )
}

/* ── Main ────────────────────────────────────────────────────────── */
export default function FunHome() {
  const navigate    = useNavigate()
  const dailyQuote  = getDailyQuote()
  const [focusTopic, setFocusTopic] = useState(null)
  const weekPair    = getWeekPair()
  const daysLeft    = daysUntilMonday()
  const [streak]    = useState(() => computeAndSaveStreak())

  return (
    <div style={{ background:C.bg, minHeight:'100dvh', paddingBottom:8 }}>
      {focusTopic && <FocusModal topicKey={focusTopic} onClose={() => setFocusTopic(null)} />}

      {/* ── Top bar ──────────────────────────────────────────── */}
      <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'52px 20px 16px', borderBottom:`1px solid ${C.b1}`, background:C.bg }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <img src="/fun-logo.png" alt="FUN logo" style={{ width:44, height:44, borderRadius:12, objectFit:'cover', objectPosition:'center' }} />
          <div>
            <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:C.t3 }}>Financial Understanding Network</div>
            <div style={{ fontFamily:DISPLAY, fontSize:20, fontWeight:600, color:C.t1, lineHeight:1.1 }}>Today</div>
          </div>
        </div>
      </header>

      <div style={{ display:'flex', flexDirection:'column', gap:20, padding:'20px 16px 0' }}>

        {/* ── Daily Quote Hero ─────────────────────────────────── */}
        <section style={{ position:'relative', overflow:'hidden', background:C.ink, borderRadius:28, padding:'28px 24px', boxShadow:'0 20px 50px -24px rgba(28,21,16,0.55)' }}>
          <div style={{ position:'absolute', top:-40, right:-40, width:192, height:192, borderRadius:'50%', background:'rgba(201,169,110,0.35)', filter:'blur(48px)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:-60, left:-40, width:200, height:200, borderRadius:'50%', background:'rgba(122,176,138,0.25)', filter:'blur(56px)', pointerEvents:'none' }} />
          <div style={{ position:'relative' }}>
            <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, letterSpacing:'0.20em', textTransform:'uppercase', color:'rgba(201,169,110,0.60)', marginBottom:16 }}>{getGreeting()} · Quote of the Day</div>
            <div style={{ fontFamily:DISPLAY, fontSize:72, lineHeight:0.7, color:'rgba(201,169,110,0.18)', marginBottom:12, userSelect:'none' }}>&ldquo;</div>
            <blockquote style={{ margin:0, marginBottom:20 }}>
              <div style={{ fontFamily:DISPLAY, fontSize:22, fontStyle:'italic', fontWeight:500, color:C.cream, lineHeight:1.45, letterSpacing:'-0.01em' }}>{dailyQuote.q}</div>
            </blockquote>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:24, height:1, background:'rgba(201,169,110,0.45)' }} />
              <span style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:'rgba(201,169,110,0.75)', letterSpacing:'0.04em' }}>{dailyQuote.a}</span>
            </div>
          </div>
        </section>

        {/* ── Streak + Assessment ───────────────────────────────── */}
        <section style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div style={{ background:C.butterBg, borderRadius:24, padding:'16px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
              <Flame size={15} color={C.tangerine} />
              <span style={{ fontFamily:UI, fontSize:10, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:C.t2 }}>Streak</span>
            </div>
            <div style={{ fontFamily:DISPLAY, fontSize:28, fontWeight:600, color:C.t1, marginBottom:4 }}>{streak} {streak === 1 ? 'day' : 'days'}</div>
            <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.4 }}>{streak === 1 ? 'Day 1 — keep it going!' : 'Keep it warm — 3 mins today.'}</div>
          </div>
          <button onClick={() => navigate('/assessment')} style={{ background:C.tangerine, borderRadius:24, padding:'16px', display:'flex', flexDirection:'column', justifyContent:'space-between', textAlign:'left', cursor:'pointer', border:'none', minHeight:0, boxShadow:'0 8px 24px rgba(232,120,60,0.30)' }}>
            <Sparkles size={18} color="#fff" />
            <div style={{ marginTop:16 }}>
              <div style={{ fontFamily:DISPLAY, fontSize:16, fontWeight:600, color:'#fff', lineHeight:1.2, marginBottom:8 }}>View Your Briefing</div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
                <span style={{ fontFamily:UI, fontSize:11, color:'rgba(255,255,255,0.85)' }}>Advisor report</span>
                <ArrowUpRight size={12} color="rgba(255,255,255,0.85)" />
              </div>
            </div>
          </button>
        </section>

        {/* ── Find Your Professional ───────────────────────────── */}
        <section>
          <SectionHeader title="Find Your Professional" />
          <button onClick={() => navigate('/wealth-counsel')} style={{ display:'flex', alignItems:'stretch', gap:12, background:C.surf, border:`1px solid ${C.b1}`, borderRadius:24, padding:'12px', cursor:'pointer', textAlign:'left', width:'100%', boxShadow:'0 1px 6px rgba(28,21,16,0.05)', WebkitTapHighlightColor:'transparent' }}>
            <div style={{ width:88, borderRadius:16, background:'rgba(0,180,198,0.12)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, minHeight:90 }}>
              <Users size={26} color={C.teal} strokeWidth={1.8} />
            </div>
            <div style={{ flex:1, padding:'4px 4px 4px 0', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
              <div>
                <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:C.t3, marginBottom:3 }}>Wealth Counsel</div>
                <div style={{ fontFamily:DISPLAY, fontSize:15.5, fontWeight:600, color:C.t1, lineHeight:1.25, marginBottom:3 }}>Find Your Financial Advisor</div>
                <div style={{ fontFamily:UI, fontSize:12, color:C.t3 }}>200+ advisors · Fee-only fiduciaries</div>
              </div>
              <div style={{ marginTop:10 }}>
                <div style={{ height:5, background:C.raise, borderRadius:10 }} />
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', paddingRight:4, flexShrink:0 }}>
              <ChevronRight size={16} color={C.t3} />
            </div>
          </button>
        </section>

        {/* ── Focus This Week ───────────────────────────────────── */}
        <section style={{ paddingBottom:8 }}>
          <SectionHeader
            title="Focus this week"
            badge={`New topics in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`}
          />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {weekPair.map(key => (
              <FocusCard key={key} topicKey={key} onOpen={setFocusTopic} />
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
