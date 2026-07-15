export const GOAL_LABELS = {
  'emergency-fund': 'Build an Emergency Fund',
  'pay-debt':       'Pay Off Debt',
  'save-home':      'Save for a Home',
  'invest':         'Invest & Grow Wealth',
  'retirement':     'Retire Comfortably',
  'protect':        'Protect What I Have',
}

export const SEV_STYLE = {
  Critical: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.22)', dot: '#ef4444', label: 'Critical' },
  Moderate: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.22)', dot: '#f59e0b', label: 'Moderate' },
  Low:      { bg: 'rgba(100,116,139,0.07)', border: 'rgba(100,116,139,0.18)', dot: '#94a3b8', label: 'Low Priority' },
}

export function generateBriefing(answers) {
  const accs = answers.accounts  || []
  const ins  = answers.insurance || []
  const strengths = []
  const gaps      = []
  const guide     = []

  // ── Emergency fund ───────────────────────────────────────
  if (['6plus','3-6'].includes(answers.emergency)) {
    strengths.push({ area: 'Emergency Reserves', text: answers.emergency === '6plus'
      ? 'Liquid reserves exceed the CFP-recommended 3–6 month standard, providing robust protection against income disruption and eliminating the need to liquidate investments during emergencies.'
      : '3–6 month emergency fund meets the CFP baseline threshold and forms a solid foundation for all other financial planning decisions.'
    })
  } else {
    gaps.push({ severity: (answers.emergency === 'none' || answers.emergency === '1month') ? 'Critical' : 'Moderate',
      area: 'Emergency Reserves',
      text: answers.emergency === 'none'
        ? 'No liquid reserves exist. Any unexpected expense forces high-interest debt at 20–29% APR, disrupting every other financial priority. This is the single highest-leverage first action.'
        : answers.emergency === '1month'
        ? 'Less than one month of reserves creates acute financial fragility. A single car repair or medical bill could trigger a debt spiral before any planning can take hold.'
        : '1–3 months of reserves falls below the CFP minimum. Extended job disruption or a medical event lasting 3+ months would exhaust these funds before recovery.'
    })
  }

  // ── Debt ─────────────────────────────────────────────────
  if (['none','mortgage-only'].includes(answers.debt)) {
    strengths.push({ area: 'Debt Position', text: answers.debt === 'none'
      ? 'No significant debt — a position that maximizes investable cash flow and eliminates guaranteed-loss drag on net worth from consumer interest rates.'
      : 'Mortgage is the only liability — leverage on a tangible asset. The absence of consumer debt puts this household ahead of the majority at this income level.'
    })
  } else {
    gaps.push({ severity: ['significant-cc','multiple'].includes(answers.debt) ? 'Critical' : 'Moderate',
      area: 'Consumer Debt',
      text: answers.debt === 'significant-cc'
        ? 'Significant credit card balances at 19–29% APR represent a guaranteed negative return that no legitimate investment strategy can reliably offset. Elimination takes priority over all investing beyond employer match.'
        : answers.debt === 'multiple'
        ? 'Multiple debt types create competing high-interest obligations. A structured payoff sequence — avalanche by interest rate — is mathematically optimal and should be modeled with an advisor.'
        : answers.debt === 'student-loans'
        ? 'Federal student loan debt may qualify for income-driven repayment caps or forgiveness programs. Optimal strategy depends on loan type, servicer, employment sector, and projected income trajectory.'
        : 'Manageable credit card balances still carry 19–29% interest. Each dollar carried on a balance costs 20× what a 1% savings account returns. Systematic paydown is high-ROI by definition.'
    })
  }

  // ── Retirement accounts ──────────────────────────────────
  if (accs.includes('401k')) {
    strengths.push({ area: 'Employer Retirement Plan', text: '401(k) or employer plan is active. This captures tax-deferred compounding and potentially employer matching — one of the highest-return, lowest-risk financial moves available. The key question is Traditional vs. Roth election given current and expected future tax brackets.' })
  } else {
    gaps.push({ severity: 'Moderate', area: 'No Employer Retirement Plan', text: 'Without a 401(k) or similar plan, employer matching contributions (effectively 50–100% instant returns on matched amounts) may be forfeited. This gap also leaves significant taxable income undeferred.' })
  }

  if (accs.includes('ira')) {
    strengths.push({ area: 'Individual Retirement Account', text: 'An IRA provides an additional $7,000/year (2026) of tax-advantaged compounding independent of employer plans. Roth IRAs offer unique after-tax compounding — tax-free growth and withdrawals — that becomes increasingly valuable over long time horizons.' })
  } else {
    gaps.push({ severity: 'Moderate', area: 'No IRA', text: 'An IRA adds $7,000/year (2026) of tax-advantaged space beyond employer plans. Roth eligibility phases out at higher incomes — a backdoor Roth conversion strategy may apply depending on income level.' })
  }

  if (accs.includes('hsa')) {
    strengths.push({ area: 'Health Savings Account', text: 'The HSA is the only triple-tax-advantaged vehicle available: pre-tax contributions, tax-free growth, tax-free withdrawals for qualified expenses. Investing HSA funds rather than spending them creates a de facto secondary retirement account accessible at 65 for any purpose.' })
  }

  if (accs.includes('brokerage')) {
    strengths.push({ area: 'Taxable Brokerage', text: 'A taxable brokerage account provides flexibility beyond retirement account limits — accessible for pre-59½ goals, eligible for preferential long-term capital gains rates, and enables tax-loss harvesting strategies not available in tax-advantaged accounts.' })
  }

  // ── Insurance ────────────────────────────────────────────
  if (ins.includes('health')) {
    strengths.push({ area: 'Health Coverage', text: 'Health insurance is in place — the single most important risk transfer in personal finance. A major medical event without coverage remains the leading cause of personal bankruptcy in the U.S., with average hospital stays generating $30,000–$150,000 in charges.' })
  } else {
    gaps.push({ severity: 'Critical', area: 'No Health Insurance', text: 'No health coverage exists. A single hospitalization without insurance can generate $50,000–$500,000+ in liability, wiping out any accumulated savings. ACA marketplace plans, Medicaid eligibility, or employer-sponsored options should be explored as the highest-priority action after emergency reserves.' })
  }

  if (!ins.includes('disability')) {
    gaps.push({ severity: 'Moderate', area: 'No Disability Income Protection', text: 'A 35-year-old has a 1-in-4 statistical probability of a disabling event before age 65 (Society of Actuaries). Without own-occupation disability coverage, earned income — the most valuable asset in an accumulation-phase household — is entirely unprotected. Employer group plans, if available, are the lowest-cost entry point.' })
  } else {
    strengths.push({ area: 'Disability Insurance', text: 'Disability coverage is in place, protecting income — statistically the most valuable asset over a 30-year career. Critical policy terms to review with an advisor: benefit period, elimination period, and own-occupation vs. any-occupation definition.' })
  }

  if (ins.includes('life')) {
    strengths.push({ area: 'Life Insurance', text: 'Life insurance provides income replacement and debt coverage. Term coverage is typically the most cost-efficient structure for most households in the accumulation phase. Coverage adequacy should be revisited at each major life event.' })
  }

  // ── Estate ───────────────────────────────────────────────
  if (['complete','basic'].includes(answers.estate)) {
    strengths.push({ area: 'Estate Documents', text: answers.estate === 'complete'
      ? 'A comprehensive estate plan — will, trust, healthcare proxy, and durable POA — is established. This ensures assets transfer according to stated wishes and protects the family from the time and cost of probate.'
      : 'A basic will is in place, putting this household ahead of the 60%+ of Americans with no estate documents. Priority additions: durable POA, healthcare proxy, and a beneficiary designation audit across all accounts.'
    })
  } else {
    gaps.push({ severity: answers.estate === 'none' ? 'Moderate' : 'Low', area: 'No Estate Plan',
      text: answers.estate === 'none'
        ? 'Without a will, state intestacy laws — not personal preference — determine who inherits assets and who gains guardianship of minor children. A basic will, healthcare proxy, and durable POA can typically be completed in a single attorney session for $500–$1,500.'
        : 'An estate plan is intended but not yet established. Priority minimum documents: will (asset distribution), healthcare proxy (medical decisions if incapacitated), durable POA (financial decisions if incapacitated).'
    })
  }

  if (['overwhelmed','not-confident'].includes(answers.confidence)) {
    gaps.push({ severity: 'Low', area: 'Financial Confidence', text: 'Low financial confidence is extremely common and not reflective of capability. A good CFP-credentialed advisor will prioritize explanation and understanding over product sales. Ask them to quantify every recommendation in concrete dollars-and-cents terms before agreeing to anything.' })
  }

  // ── Advisor Discussion Guide ─────────────────────────────
  guide.push({ topic: 'Cash Flow & Emergency Reserves', questions: [
    'What account type is optimal for my emergency fund in the current rate environment — HYSA, money market, or short-duration T-bills?',
    'How much total liquid reserve is appropriate given my specific income stability and industry concentration risk?',
    'Should I tier my reserves — fully liquid core + slightly higher-yield secondary tranche?',
  ]})

  if (!['none'].includes(answers.debt)) {
    guide.push({ topic: 'Debt Payoff Strategy', questions: [
      'Model my complete debt payoff projection using the avalanche method — what is my projected debt-free date?',
      'Are there balance transfer or refinancing opportunities that would meaningfully reduce my blended interest rate today?',
      answers.debt === 'student-loans' ? 'Am I eligible for PSLF, income-driven repayment caps, or any federal forgiveness programs given my employer and loan type?' : null,
      'At what remaining balance or interest rate threshold does the math favor shifting from debt payoff to investing?',
    ].filter(Boolean)})
  }

  guide.push({ topic: 'Retirement Account Optimization', questions: [
    accs.includes('401k') ? 'Am I capturing the full employer match, and what is the vesting schedule on employer contributions?' : 'What employer-sponsored plan options exist for me, and what is the employer matching structure?',
    'Should I direct contributions to Traditional or Roth within my retirement accounts given my current income, expected retirement income, and projected tax bracket trajectory?',
    'Am I eligible to contribute directly to a Roth IRA, or is a backdoor Roth conversion strategy more appropriate given my income?',
    'What is my retirement number, and am I on track given my current savings rate, asset allocation, and target retirement date?',
    accs.includes('hsa') ? 'Should I pay current medical expenses out-of-pocket and leave HSA funds invested to maximize tax-free compounding?' : null,
  ].filter(Boolean)})

  guide.push({ topic: 'Investment Allocation & Tax Efficiency', questions: [
    'What is the appropriate equity/fixed income/alternative allocation for my age, risk tolerance, time horizon, and goal structure?',
    'How should I allocate assets across account types — which asset classes belong in tax-advantaged vs. taxable accounts for maximum tax efficiency?',
    accs.includes('brokerage') ? 'How should I approach tax-lot selection and tax-loss harvesting in my taxable account?' : null,
    'What is a realistic long-term real return assumption for my proposed allocation, and how does inflation affect my projections?',
  ].filter(Boolean)})

  guide.push({ topic: 'Insurance Gap Analysis', questions: [
    !ins.includes('disability') ? 'What disability benefit amount, elimination period, and definition — own-occupation vs. any-occupation — is appropriate for my occupation and income level?' : 'What is the own-occupation definition and benefit period on my current disability policy, and are there gaps in coverage I should address?',
    !ins.includes('life') ? 'Do I have a life insurance need given my current dependents, outstanding debts, and income replacement requirement?' : 'When was my life coverage last reviewed against my current income, liabilities, and dependent structure?',
    'Audit my complete insurance picture — am I carrying any unnecessary coverage, and where are my largest uninsured risks?',
    'At what net worth level does a personal umbrella liability policy become essential for my risk profile?',
  ]})

  guide.push({ topic: 'Estate & Legal Priorities', questions: [
    answers.estate === 'none' ? 'What are the minimum estate documents I need — will, healthcare proxy, durable POA — and what is a realistic cost with a local estate attorney?' : 'Are my current estate documents still consistent with my wishes, and when were beneficiary designations on all accounts last audited?',
    'Are beneficiary designations on all retirement accounts, life insurance policies, and financial accounts current and consistent with my will?',
    'At what asset level does a revocable living trust offer meaningful advantages over a simple will in my state of residence?',
    'Who is named as my healthcare proxy and durable POA, and are they aware of and prepared for those responsibilities?',
  ]})

  guide.push({ topic: 'Tax Planning', questions: [
    'What is my effective vs. marginal tax rate, and how should this inform Traditional vs. Roth elections across all accounts?',
    'Am I positioned to benefit from Roth conversions during lower-income years before Required Minimum Distributions create forced taxable income?',
    'What deductions or credits am I likely leaving on the table at my income level, filing status, and life stage?',
    'How does my primary financial goal affect my near-term tax planning approach?',
  ]})

  const GOAL_Qs = {
    'emergency-fund': ['At my current savings rate, what is the specific timeline to reach a fully-funded 3-month reserve?', 'Should I prioritize the emergency fund completely before employer match, or run them in parallel?'],
    'pay-debt':       ['Walk me through my complete debt-free projection with the avalanche method — give me a specific payoff date.', 'At what debt balance should I begin investing beyond the employer match?'],
    'save-home':      ['How much total capital do I need — down payment, closing costs, prepaid items, and post-closing cash reserves — before it is prudent to purchase?', 'How does a home purchase affect my overall balance sheet and retirement savings trajectory?', 'Is my current DTI ratio and credit profile positioned for the price range I am targeting?'],
    'invest':         ['What is a defensible long-term return assumption for my proposed allocation, net of fees and taxes?', 'How do I evaluate whether I am taking appropriate risk relative to my time horizon?'],
    'retirement':     ['What is my retirement number and am I on track given my current trajectory?', 'What savings rate increase is required to retire by my target date?', 'How should I think about sequence-of-returns risk as I approach the transition into retirement?'],
    'protect':        ['Rank my uninsured risks from highest to lowest financial exposure — where is my biggest vulnerability?', 'At what net worth level do umbrella liability and excess coverage become essential?'],
  }
  if (answers.goal && GOAL_Qs[answers.goal]) {
    guide.push({ topic: `Priority: ${GOAL_LABELS[answers.goal]}`, questions: GOAL_Qs[answers.goal], highlight: true })
  }

  return { strengths, gaps, guide }
}
