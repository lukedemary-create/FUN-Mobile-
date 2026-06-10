import React, { useState } from 'react';
import { generateReport } from '../data/reportGenerators';
import ReportRenderer from '../components/ReportRenderer';
import {
  BarChart3, TrendingUp, PiggyBank, Shield, Home, GraduationCap,
  Scale, Landmark, DollarSign, FileText, Heart, Target,
  X, ChevronLeft, ChevronRight, Download, Printer, Sparkles, AlertCircle,
  Brain, ClipboardList,
} from 'lucide-react';

// ─── Report Definitions ───────────────────────────────────────────────────────

const REPORTS = [
  {
    id: 'wealth_diagnostic',
    name: 'Wealth Diagnostic',
    tagline: 'Complete financial health score & roadmap',
    icon: BarChart3,
    color: '#c9a96e',
    category: 'Comprehensive',
    steps: [
      {
        title: 'Income & Assets',
        fields: [
          { id: 'annual_income', label: 'Annual Household Income', type: 'number', placeholder: '150000', prefix: '$' },
          { id: 'net_worth', label: 'Estimated Net Worth', type: 'number', placeholder: '500000', prefix: '$' },
          { id: 'liquid_assets', label: 'Liquid Assets (cash + savings)', type: 'number', placeholder: '50000', prefix: '$' },
          { id: 'investment_total', label: 'Total Investment Accounts', type: 'number', placeholder: '200000', prefix: '$' },
          { id: 'real_estate_value', label: 'Real Estate Value', type: 'number', placeholder: '400000', prefix: '$' },
        ],
      },
      {
        title: 'Debts & Liabilities',
        fields: [
          { id: 'mortgage_balance', label: 'Mortgage Balance', type: 'number', placeholder: '300000', prefix: '$' },
          { id: 'credit_card_debt', label: 'Credit Card Debt', type: 'number', placeholder: '8000', prefix: '$' },
          { id: 'student_loans', label: 'Student Loan Debt', type: 'number', placeholder: '25000', prefix: '$' },
          { id: 'other_debt', label: 'Other Debt (auto, personal)', type: 'number', placeholder: '15000', prefix: '$' },
          { id: 'monthly_debt_payments', label: 'Total Monthly Debt Payments', type: 'number', placeholder: '3200', prefix: '$' },
        ],
      },
      {
        title: 'Goals & Profile',
        fields: [
          { id: 'age', label: 'Your Age', type: 'number', placeholder: '38' },
          { id: 'retirement_age', label: 'Target Retirement Age', type: 'number', placeholder: '65' },
          { id: 'risk_tolerance', label: 'Risk Tolerance', type: 'select', options: ['Conservative', 'Moderate', 'Aggressive'] },
          { id: 'primary_goal', label: 'Primary Financial Goal', type: 'select', options: ['Retire early', 'Pay off all debt', 'Build long-term wealth', 'Buy a home', 'Achieve financial independence'] },
          { id: 'monthly_savings', label: 'Monthly Savings Amount', type: 'number', placeholder: '2000', prefix: '$' },
        ],
      },
    ],
    systemPrompt: `You are a Senior Private Wealth Advisor delivering a comprehensive Wealth Diagnostic Report. Analyze the client's complete financial picture with institutional precision.

Structure your report with these exact sections using ## for headers:

## EXECUTIVE SUMMARY
Overall Financial Health Score (A+ to F) with justification. Key strengths (2-3). Critical gaps (2-3). One-sentence verdict.

## NET WORTH ANALYSIS
Total net worth calculation. Asset breakdown (liquid, invested, real estate, other). Debt-to-asset ratio with benchmark comparison. Net worth percentile for their age group.

## CASH FLOW & SAVINGS ASSESSMENT
Annual income vs total annual debt payments. Savings rate percentage and benchmark comparison. Monthly free cash flow calculation. Optimization opportunities.

## DEBT HEALTH ANALYSIS
Total debt load. Debt-to-income ratio (DTI) with lender benchmarks. Debt composition analysis. High-priority payoff candidates.

## INVESTMENT READINESS
Investment assets as % of net worth. Asset allocation assessment. Retirement savings adequacy for their age and target date. Gap analysis with specific dollar amount needed.

## EMERGENCY FUND STATUS
Liquid assets as months of coverage. Recommendation (6 months minimum for their situation). Gap if applicable.

## ACTION PLAN
### CRITICAL (Within 30 Days)
- [3 specific actions with dollar amounts]

### HIGH PRIORITY (Within 90 Days)
- [3 specific actions]

### MEDIUM PRIORITY (Within 1 Year)
- [3 specific actions]

---
*This report is for educational purposes only and does not constitute financial, legal, or tax advice. Consult qualified licensed professionals before making any financial decisions.*`,
  },
  {
    id: 'tax_efficiency',
    name: 'Tax Efficiency Report',
    tagline: 'Identify tax leaks and optimization strategies',
    icon: DollarSign,
    color: '#3b82f6',
    category: 'Tax Planning',
    steps: [
      {
        title: 'Income Sources',
        fields: [
          { id: 'w2_income', label: 'W-2 Employment Income', type: 'number', placeholder: '120000', prefix: '$' },
          { id: 'self_employment', label: 'Self-Employment / 1099 Income', type: 'number', placeholder: '0', prefix: '$' },
          { id: 'investment_income', label: 'Investment Income (dividends, interest)', type: 'number', placeholder: '5000', prefix: '$' },
          { id: 'rental_income', label: 'Rental Income', type: 'number', placeholder: '0', prefix: '$' },
          { id: 'filing_status', label: 'Filing Status', type: 'select', options: ['Single', 'Married Filing Jointly', 'Married Filing Separately', 'Head of Household'] },
        ],
      },
      {
        title: 'Deductions & Accounts',
        fields: [
          { id: '401k_contribution', label: '401(k) / 403(b) Annual Contribution', type: 'number', placeholder: '23000', prefix: '$' },
          { id: 'ira_contribution', label: 'IRA Annual Contribution', type: 'number', placeholder: '7000', prefix: '$' },
          { id: 'hsa_contribution', label: 'HSA Annual Contribution', type: 'number', placeholder: '4000', prefix: '$' },
          { id: 'itemized_deductions', label: 'Itemized Deductions (mortgage int, charity, etc.)', type: 'number', placeholder: '0', prefix: '$' },
          { id: 'capital_gains', label: 'Capital Gains This Year', type: 'number', placeholder: '10000', prefix: '$' },
        ],
      },
      {
        title: 'Tax Strategy',
        fields: [
          { id: 'state', label: 'Your State', type: 'text', placeholder: 'California' },
          { id: 'has_business', label: 'Do You Have a Business / Side Income?', type: 'select', options: ['No', 'Yes — sole proprietor', 'Yes — LLC', 'Yes — S-Corp'] },
          { id: 'investment_accounts', label: 'Investment Account Types', type: 'select', options: ['Only taxable brokerage', '401k + IRA only', 'Mix of taxable + tax-advantaged', 'Roth accounts primarily'] },
          { id: 'tax_goal', label: 'Primary Tax Goal', type: 'select', options: ['Reduce this year\'s tax bill', 'Optimize long-term wealth', 'Plan for retirement distributions', 'Estate tax minimization'] },
        ],
      },
    ],
    systemPrompt: `You are a Senior Tax Strategist and CPA delivering a Tax Efficiency Report. Analyze the client's tax situation with forensic precision.

Structure your report using ## for headers:

## EXECUTIVE SUMMARY
Estimated effective tax rate. Estimated total tax burden (federal + state). Key tax optimization opportunities identified. Potential annual savings available.

## CURRENT TAX BURDEN ANALYSIS
Estimated federal taxable income calculation. Estimated federal tax (with bracket breakdown). Estimated state tax burden. Estimated effective rate vs marginal rate. Comparison to peers at same income level.

## TAX-ADVANTAGED ACCOUNT ANALYSIS
Current retirement contribution utilization vs maximum allowed. HSA utilization analysis. Estimated tax savings from current contributions. Additional tax savings available if maximized.

## CAPITAL GAINS STRATEGY
Short-term vs long-term gains analysis. Tax-loss harvesting opportunities. Optimal holding period recommendations. Asset location strategy (what belongs in taxable vs tax-advantaged).

## DEDUCTION OPPORTUNITIES
Standard vs itemized deduction analysis. Missed deduction categories to investigate. Business deduction opportunities if applicable. Charitable giving strategies (DAF, QCD if eligible).

## TOP TAX STRATEGIES
### Immediate Actions (This Tax Year)
- [3-4 specific strategies with estimated savings]

### Structural Changes (Next 12 Months)
- [3-4 strategies for longer-term optimization]

---
*This report is for educational purposes only and does not constitute tax advice. Consult a qualified CPA or tax attorney before implementing any tax strategies.*`,
  },
  {
    id: 'retirement_readiness',
    name: 'Retirement Readiness',
    tagline: 'Project your retirement gap and fix it',
    icon: Landmark,
    color: '#10b981',
    category: 'Retirement',
    steps: [
      {
        title: 'Current Retirement Savings',
        fields: [
          { id: 'age', label: 'Current Age', type: 'number', placeholder: '40' },
          { id: 'retirement_age', label: 'Target Retirement Age', type: 'number', placeholder: '65' },
          { id: 'retirement_savings', label: 'Total Retirement Savings Today', type: 'number', placeholder: '250000', prefix: '$' },
          { id: 'annual_401k', label: 'Annual 401(k) Contribution', type: 'number', placeholder: '20000', prefix: '$' },
          { id: 'employer_match', label: 'Annual Employer Match', type: 'number', placeholder: '5000', prefix: '$' },
        ],
      },
      {
        title: 'Income & Lifestyle',
        fields: [
          { id: 'current_income', label: 'Current Annual Income', type: 'number', placeholder: '130000', prefix: '$' },
          { id: 'desired_retirement_income', label: 'Desired Annual Retirement Income', type: 'number', placeholder: '90000', prefix: '$' },
          { id: 'social_security_estimate', label: 'Estimated Annual Social Security Benefit', type: 'number', placeholder: '25000', prefix: '$' },
          { id: 'pension', label: 'Annual Pension (if any)', type: 'number', placeholder: '0', prefix: '$' },
          { id: 'other_income', label: 'Other Retirement Income (rental, etc.)', type: 'number', placeholder: '0', prefix: '$' },
        ],
      },
      {
        title: 'Assumptions & Risk',
        fields: [
          { id: 'risk_tolerance', label: 'Investment Risk Tolerance', type: 'select', options: ['Conservative (5-6% return)', 'Moderate (7-8% return)', 'Aggressive (9-10% return)'] },
          { id: 'inflation_concern', label: 'Inflation Assumption', type: 'select', options: ['Low (2.5%)', 'Moderate (3.5%)', 'High (4.5%)'] },
          { id: 'healthcare_plan', label: 'Healthcare Coverage Plan', type: 'select', options: ['Medicare only', 'Medicare + supplement', 'Employer retiree coverage', 'Not sure yet'] },
          { id: 'longevity', label: 'Planning Horizon (age)', type: 'number', placeholder: '90' },
        ],
      },
    ],
    systemPrompt: `You are a Certified Financial Planner specializing in retirement income planning. Deliver a Retirement Readiness Report with precise projections.

Structure your report using ## for headers:

## EXECUTIVE SUMMARY
Retirement readiness score (0-100). On-track vs off-track verdict. Years to retirement. Most critical finding.

## RETIREMENT SAVINGS PROJECTION
Current savings with compound growth to retirement age (show at conservative, moderate, and target return assumptions). Future value calculation at retirement. Monthly savings shortfall or surplus.

## INCOME GAP ANALYSIS
Required income in retirement (inflation-adjusted to retirement date). Income sources breakdown: Social Security + pension + other = guaranteed income. Portfolio withdrawal required. Safe withdrawal rate (4% rule) applied. Gap between what portfolio can sustain and what's needed.

## THE CATCH-UP ANALYSIS
If behind: Exact monthly contribution needed to close the gap at each return assumption. If ahead: How early you could retire at current trajectory.

## PORTFOLIO STRATEGY
Recommended asset allocation for current age and retirement timeline (glide path). Target allocation at retirement. Key account types to prioritize (Roth vs Traditional vs taxable).

## SOCIAL SECURITY OPTIMIZATION
Optimal claiming strategy analysis. Difference between claiming at 62 vs 67 vs 70. Break-even age calculation.

## ACTION PLAN
### Top 5 Retirement Actions (Prioritized by Impact)
[Numbered list with specific dollar amounts]

---
*Projections are hypothetical and not guaranteed. This report is for educational purposes only. Consult a fiduciary financial advisor for personalized retirement planning.*`,
  },
  {
    id: 'portfolio_review',
    name: 'Portfolio Review',
    tagline: 'Allocation analysis, risk assessment, rebalancing plan',
    icon: TrendingUp,
    color: '#8b5cf6',
    category: 'Investing',
    steps: [
      {
        title: 'Current Holdings',
        fields: [
          { id: 'total_portfolio', label: 'Total Portfolio Value', type: 'number', placeholder: '300000', prefix: '$' },
          { id: 'us_stocks_pct', label: 'US Stocks (%)', type: 'number', placeholder: '60' },
          { id: 'international_pct', label: 'International Stocks (%)', type: 'number', placeholder: '15' },
          { id: 'bonds_pct', label: 'Bonds (%)', type: 'number', placeholder: '15' },
          { id: 'alternatives_pct', label: 'Alternatives / Real Estate / Cash (%)', type: 'number', placeholder: '10' },
        ],
      },
      {
        title: 'Investment Profile',
        fields: [
          { id: 'age', label: 'Your Age', type: 'number', placeholder: '42' },
          { id: 'investment_horizon', label: 'Investment Horizon', type: 'select', options: ['1-3 years', '3-7 years', '7-15 years', '15+ years'] },
          { id: 'risk_tolerance', label: 'Risk Tolerance', type: 'select', options: ['Conservative', 'Moderate-Conservative', 'Moderate', 'Moderate-Aggressive', 'Aggressive'] },
          { id: 'primary_accounts', label: 'Primary Account Types', type: 'select', options: ['401(k) / IRA only', 'Taxable brokerage only', 'Mix of taxable + retirement', 'All three types'] },
          { id: 'biggest_holding', label: 'Single Largest Holding (% of portfolio)', type: 'number', placeholder: '25' },
        ],
      },
      {
        title: 'Goals & Concerns',
        fields: [
          { id: 'primary_goal', label: 'Portfolio Primary Goal', type: 'select', options: ['Maximum growth', 'Growth with income', 'Capital preservation', 'Income generation', 'Retirement funding'] },
          { id: 'max_drawdown', label: 'Maximum Drawdown Tolerance (%)', type: 'number', placeholder: '25' },
          { id: 'annual_contribution', label: 'Annual New Contributions', type: 'number', placeholder: '24000', prefix: '$' },
          { id: 'concerns', label: 'Biggest Portfolio Concern', type: 'select', options: ['Too concentrated', 'Too conservative for my age', 'Not enough diversification', 'High fees', 'Don\'t know what I own'] },
        ],
      },
    ],
    systemPrompt: `You are a Portfolio Analyst at a top-tier asset management firm. Deliver a comprehensive Portfolio Review Report.

Structure your report using ## for headers:

## EXECUTIVE SUMMARY
Portfolio health assessment. Key risks identified. Recommended immediate actions.

## CURRENT ALLOCATION ANALYSIS
Breakdown of provided allocation. Comparison to target allocation for age/risk profile. Drift analysis. Concentration risk assessment.

## RISK ASSESSMENT
Estimated portfolio volatility (standard deviation range). Historical drawdown range for this allocation. Sharpe ratio estimation. Max drawdown scenario (2008, 2020-style events).

## BENCHMARK COMPARISON
Estimated performance vs S&P 500, 60/40 portfolio, and age-appropriate target date fund over standard time horizons.

## DIVERSIFICATION ANALYSIS
Geographic diversification. Sector concentration. Factor exposure (growth vs value, large vs small). Correlation analysis.

## RECOMMENDED TARGET ALLOCATION
Specific recommended allocation with percentages based on their age, risk tolerance, and goals. Implementation path from current to target. Specific ETF/fund categories to consider.

## REBALANCING STRATEGY
Specific rebalancing recommendations. Tax-efficient rebalancing approach (harvesting losses, using new contributions). Rebalancing triggers and schedule.

---
*This analysis is educational only. Past performance does not guarantee future results. Consult a fiduciary investment advisor before making changes to your portfolio.*`,
  },
  {
    id: 'debt_elimination',
    name: 'Debt Elimination Plan',
    tagline: 'Personalized payoff roadmap and interest savings',
    icon: Scale,
    color: '#ef4444',
    category: 'Debt Strategy',
    steps: [
      {
        title: 'Your Debts',
        fields: [
          { id: 'credit_card_balance', label: 'Credit Card Balances (total)', type: 'number', placeholder: '15000', prefix: '$' },
          { id: 'credit_card_rate', label: 'Average Credit Card APR (%)', type: 'number', placeholder: '22' },
          { id: 'student_loan_balance', label: 'Student Loan Balance', type: 'number', placeholder: '35000', prefix: '$' },
          { id: 'student_loan_rate', label: 'Student Loan Interest Rate (%)', type: 'number', placeholder: '6.5' },
          { id: 'auto_loan', label: 'Auto Loan Balance', type: 'number', placeholder: '18000', prefix: '$' },
        ],
      },
      {
        title: 'More Debts & Income',
        fields: [
          { id: 'personal_loan', label: 'Personal Loan Balance', type: 'number', placeholder: '0', prefix: '$' },
          { id: 'personal_loan_rate', label: 'Personal Loan Rate (%)', type: 'number', placeholder: '0' },
          { id: 'mortgage_balance', label: 'Mortgage Balance', type: 'number', placeholder: '280000', prefix: '$' },
          { id: 'monthly_income', label: 'Monthly Take-Home Income', type: 'number', placeholder: '8000', prefix: '$' },
          { id: 'monthly_expenses', label: 'Monthly Essential Expenses (excl. debt)', type: 'number', placeholder: '3500', prefix: '$' },
        ],
      },
      {
        title: 'Strategy Preferences',
        fields: [
          { id: 'extra_monthly', label: 'Extra Monthly Amount Available for Debt', type: 'number', placeholder: '500', prefix: '$' },
          { id: 'preferred_method', label: 'Preferred Payoff Method', type: 'select', options: ['Avalanche (highest rate first — saves most interest)', 'Snowball (smallest balance first — builds momentum)', 'Let the report recommend'] },
          { id: 'debt_consolidation', label: 'Open to Debt Consolidation?', type: 'select', options: ['Yes', 'No', 'Already tried it'] },
          { id: 'debt_goal', label: 'Primary Debt Goal', type: 'select', options: ['Be completely debt-free ASAP', 'Free up monthly cash flow', 'Improve credit score', 'Prepare for mortgage application'] },
        ],
      },
    ],
    systemPrompt: `You are a Debt Elimination Strategist. Deliver a precise, actionable Debt Elimination Plan with specific calculations.

Structure your report using ## for headers:

## EXECUTIVE SUMMARY
Total debt load. Total interest you will pay if minimum payments only. Estimated payoff date at current pace. Potential savings with optimized strategy.

## DEBT INVENTORY
Table of all debts: balance, rate, minimum payment, payoff time at minimums. Sort by interest rate. Highlight the most expensive debt.

## AVALANCHE VS SNOWBALL ANALYSIS
Avalanche method: payoff order, total interest, payoff date. Snowball method: payoff order, total interest, payoff date. Recommendation with reasoning. Estimated interest savings of avalanche vs snowball.

## OPTIMIZED PAYOFF PLAN
Month-by-month payoff sequence. How to apply the extra monthly amount. Payoff dates for each debt. Total interest saved vs minimum payments only. Total payoff date.

## CASH FLOW ANALYSIS
Current debt-to-income ratio. Post-payoff cash flow improvement. How freed-up payments should be redirected.

## ACCELERATORS
Specific strategies to pay off debt faster: balance transfer opportunities, refinancing analysis, lump sum opportunities, income acceleration ideas.

## CREDIT IMPACT
How the payoff plan will affect credit score. Actions to protect and improve credit during payoff.

---
*This plan is for educational purposes only. Interest calculations are estimates. Actual amounts will vary. Consult a credit counselor or financial advisor for personalized debt advice.*`,
  },
  {
    id: 'insurance_audit',
    name: 'Insurance Coverage Audit',
    tagline: 'Find gaps, eliminate waste, ensure protection',
    icon: Shield,
    color: '#06b6d4',
    category: 'Risk Management',
    steps: [
      {
        title: 'Current Coverage',
        fields: [
          { id: 'life_insurance', label: 'Life Insurance Coverage', type: 'select', options: ['None', 'Employer only', 'Term policy', 'Whole/Universal life', 'Multiple policies'] },
          { id: 'life_coverage_amount', label: 'Total Life Coverage Amount', type: 'number', placeholder: '500000', prefix: '$' },
          { id: 'disability_insurance', label: 'Disability Insurance', type: 'select', options: ['None', 'Employer short-term only', 'Employer long-term only', 'Both employer plans', 'Private policy'] },
          { id: 'health_insurance', label: 'Health Insurance Type', type: 'select', options: ['Employer PPO', 'Employer HMO', 'Employer HDHP + HSA', 'Marketplace/ACA', 'Medicare', 'None'] },
          { id: 'annual_health_premium', label: 'Annual Health Premium (employee share)', type: 'number', placeholder: '4800', prefix: '$' },
        ],
      },
      {
        title: 'Property & Liability',
        fields: [
          { id: 'home_auto', label: 'Home & Auto Insurance', type: 'select', options: ['Bundled with one insurer', 'Separate insurers', 'Renter\'s + auto', 'Auto only', 'None'] },
          { id: 'umbrella_policy', label: 'Personal Umbrella Policy', type: 'select', options: ['Yes', 'No', 'Not sure what this is'] },
          { id: 'long_term_care', label: 'Long-Term Care Insurance', type: 'select', options: ['Yes — private policy', 'Yes — employer benefit', 'No', 'Relying on savings'] },
          { id: 'annual_auto_home_premium', label: 'Annual Auto + Home/Renters Premium', type: 'number', placeholder: '3600', prefix: '$' },
        ],
      },
      {
        title: 'Life Situation',
        fields: [
          { id: 'age', label: 'Your Age', type: 'number', placeholder: '38' },
          { id: 'dependents', label: 'Number of Financial Dependents', type: 'number', placeholder: '2' },
          { id: 'annual_income', label: 'Annual Household Income', type: 'number', placeholder: '140000', prefix: '$' },
          { id: 'net_worth', label: 'Estimated Net Worth', type: 'number', placeholder: '400000', prefix: '$' },
          { id: 'biggest_concern', label: 'Biggest Insurance Concern', type: 'select', options: ['Am I underinsured?', 'Am I paying too much?', 'Do I need life insurance?', 'Protecting my assets', 'Planning for long-term care'] },
        ],
      },
    ],
    systemPrompt: `You are a Risk Management Specialist and insurance advisor. Deliver a comprehensive Insurance Coverage Audit Report.

Structure your report using ## for headers:

## EXECUTIVE SUMMARY
Overall insurance adequacy score (1-10). Critical coverage gaps identified. Estimated over-insurance / waste. Top 3 actions needed.

## LIFE INSURANCE ANALYSIS
Human Life Value calculation (10x income method). DIME formula analysis (Debt + Income + Mortgage + Education). Coverage adequacy assessment. Gap or excess calculation. Term vs permanent recommendation based on their situation.

## DISABILITY INSURANCE ANALYSIS
Short-term disability coverage gap. Long-term disability coverage assessment. Recommended coverage amount (60-70% of income). Private policy recommendation if needed.

## HEALTH INSURANCE OPTIMIZATION
Current plan cost vs alternatives. HSA optimization opportunity. High-deductible analysis. Out-of-pocket maximum exposure.

## PROPERTY & LIABILITY ASSESSMENT
Home/auto coverage adequacy. Liability coverage analysis. Umbrella policy recommendation and threshold (typically needed when net worth exceeds auto/home liability limits). Estimated annual savings from shopping coverage.

## LONG-TERM CARE ANALYSIS
Estimated LTC costs in their area. Self-insurance analysis (do they have enough assets?). Optimal age to purchase LTC insurance. Hybrid policy options.

## RECOMMENDED COVERAGE CHANGES
Priority-ordered list with specific coverage amounts and estimated annual costs.

---
*This audit is educational only. Insurance needs vary significantly based on individual circumstances. Consult a licensed independent insurance broker for actual policy recommendations.*`,
  },
  {
    id: 'emergency_fund',
    name: 'Emergency Fund Analysis',
    tagline: 'Liquidity assessment and optimization strategy',
    icon: PiggyBank,
    color: '#f59e0b',
    category: 'Financial Foundation',
    steps: [
      {
        title: 'Monthly Expenses',
        fields: [
          { id: 'monthly_housing', label: 'Monthly Housing (rent/mortgage)', type: 'number', placeholder: '2200', prefix: '$' },
          { id: 'monthly_food', label: 'Monthly Food & Groceries', type: 'number', placeholder: '600', prefix: '$' },
          { id: 'monthly_utilities', label: 'Monthly Utilities & Bills', type: 'number', placeholder: '300', prefix: '$' },
          { id: 'monthly_transport', label: 'Monthly Transportation', type: 'number', placeholder: '500', prefix: '$' },
          { id: 'monthly_insurance', label: 'Monthly Insurance Premiums', type: 'number', placeholder: '400', prefix: '$' },
        ],
      },
      {
        title: 'Current Savings & Income',
        fields: [
          { id: 'other_monthly_expenses', label: 'Other Essential Monthly Expenses', type: 'number', placeholder: '300', prefix: '$' },
          { id: 'current_emergency_fund', label: 'Current Emergency Fund Balance', type: 'number', placeholder: '10000', prefix: '$' },
          { id: 'other_liquid_savings', label: 'Other Liquid Savings Available', type: 'number', placeholder: '5000', prefix: '$' },
          { id: 'monthly_income', label: 'Monthly Take-Home Income', type: 'number', placeholder: '7500', prefix: '$' },
          { id: 'monthly_savings_capacity', label: 'Monthly Amount Available to Save', type: 'number', placeholder: '500', prefix: '$' },
        ],
      },
      {
        title: 'Risk Profile',
        fields: [
          { id: 'employment_stability', label: 'Employment Stability', type: 'select', options: ['Very stable (government, tenured)', 'Stable (large established company)', 'Moderate (medium company)', 'Variable (commission, freelance)', 'Self-employed / entrepreneur'] },
          { id: 'dependents', label: 'Number of Financial Dependents', type: 'number', placeholder: '1' },
          { id: 'health_risk', label: 'Health / Medical Risk Level', type: 'select', options: ['Healthy — low medical risk', 'Manageable chronic conditions', 'High medical expenses expected'] },
          { id: 'ef_goal', label: 'Emergency Fund Goal', type: 'select', options: ['Build from scratch', 'Grow existing fund', 'Optimize where to keep it', 'Determine correct target amount'] },
        ],
      },
    ],
    systemPrompt: `You are a Personal Finance Specialist focused on financial security foundations. Deliver a comprehensive Emergency Fund Analysis.

Structure your report using ## for headers:

## EXECUTIVE SUMMARY
Total monthly essential expenses calculated. Current months of coverage. Target months of coverage for their situation. Gap or surplus amount. Urgency rating (Critical / Moderate / On Track / Excessive).

## EXPENSE BASELINE CALCULATION
Itemized essential monthly expenses. Total essential monthly expenses. Annual essential expense total. Explanation of what counts as "essential" for emergency planning.

## COVERAGE ASSESSMENT
Current liquid assets available. Current months of coverage calculation. Standard benchmarks (3-6 months for dual income, 6-9 months for single income, 9-12 months for self-employed). Recommended target for their specific situation with reasoning.

## BUILD-UP PLAN
If behind: Monthly contribution needed. Target date to reach goal. Milestone schedule (1 month, 3 months, target). Total cash needed to add.
If ahead: Whether excess funds should be put to work elsewhere.

## WHERE TO KEEP YOUR EMERGENCY FUND
High-yield savings account analysis. Money market account comparison. Treasury bills / I-Bonds for larger funds. Tiered approach recommendation. Estimated annual interest earned.

## CASH FLOW OPTIMIZATION
How to free up more savings capacity. Side fund strategies. Automation recommendations.

---
*This analysis is for educational purposes only. Emergency fund needs vary by individual situation. Consult a financial advisor for personalized guidance.*`,
  },
  {
    id: 'estate_planning',
    name: 'Estate Planning Checklist',
    tagline: 'Legacy protection and wealth transfer strategy',
    icon: FileText,
    color: '#6366f1',
    category: 'Estate & Legacy',
    steps: [
      {
        title: 'Assets & Estate Size',
        fields: [
          { id: 'total_assets', label: 'Estimated Total Assets', type: 'number', placeholder: '800000', prefix: '$' },
          { id: 'real_estate', label: 'Real Estate Value', type: 'number', placeholder: '400000', prefix: '$' },
          { id: 'retirement_accounts', label: 'Retirement Accounts Total', type: 'number', placeholder: '300000', prefix: '$' },
          { id: 'life_insurance_face', label: 'Life Insurance Face Value', type: 'number', placeholder: '500000', prefix: '$' },
          { id: 'business_interests', label: 'Business Interests / Other Assets', type: 'number', placeholder: '0', prefix: '$' },
        ],
      },
      {
        title: 'Current Documents & Beneficiaries',
        fields: [
          { id: 'has_will', label: 'Do You Have a Will?', type: 'select', options: ['Yes — recently updated', 'Yes — more than 5 years old', 'No will', 'In progress'] },
          { id: 'has_trust', label: 'Do You Have a Trust?', type: 'select', options: ['Yes — revocable living trust', 'Yes — irrevocable trust', 'No trust', 'Under consideration'] },
          { id: 'has_poa', label: 'Power of Attorney', type: 'select', options: ['Yes — financial + healthcare', 'Financial POA only', 'Healthcare POA only', 'None'] },
          { id: 'beneficiaries_updated', label: 'Beneficiary Designations Status', type: 'select', options: ['All updated within 2 years', 'Partially updated', 'Not reviewed in 5+ years', 'Not sure'] },
          { id: 'has_advance_directive', label: 'Advanced Healthcare Directive / Living Will', type: 'select', options: ['Yes', 'No', 'Not sure'] },
        ],
      },
      {
        title: 'Family & Goals',
        fields: [
          { id: 'age', label: 'Your Age', type: 'number', placeholder: '55' },
          { id: 'marital_status', label: 'Marital Status', type: 'select', options: ['Married', 'Single', 'Divorced', 'Widowed', 'Domestic Partnership'] },
          { id: 'children', label: 'Number of Children / Heirs', type: 'number', placeholder: '2' },
          { id: 'minor_children', label: 'Any Minor Children?', type: 'select', options: ['Yes', 'No'] },
          { id: 'estate_goal', label: 'Primary Estate Planning Goal', type: 'select', options: ['Avoid probate', 'Minimize estate taxes', 'Provide for spouse/children', 'Charitable giving', 'Protect assets from creditors'] },
        ],
      },
    ],
    systemPrompt: `You are an Estate Planning Attorney and Wealth Transfer Specialist. Deliver a comprehensive Estate Planning Checklist and Analysis.

Structure your report using ## for headers:

## EXECUTIVE SUMMARY
Estate planning readiness score (1-10). Estate size vs federal exemption ($13.61M in 2024). State estate tax exposure. Most critical gaps. Top 3 immediate actions.

## ESTATE SIZE & TAX EXPOSURE
Total estimated estate value. Federal estate tax analysis (amount over exemption if applicable). State estate tax analysis for their state. Projected estate tax liability. Strategies to reduce exposure.

## DOCUMENT AUDIT
### Will Assessment
Current status analysis. What happens without an updated will. Specific updates needed.

### Trust Analysis
Whether a trust is recommended for their situation. Benefits of revocable living trust at their estate size. Trust types to consider.

### Power of Attorney & Healthcare Directives
Gaps identified. Consequences of not having these. Urgency assessment.

### Beneficiary Designations
Critical importance for retirement accounts and life insurance. Common mistakes to avoid. Review checklist.

## PROBATE ANALYSIS
Assets currently subject to probate. Assets that bypass probate. Estimated probate costs and timeline if they died today. How to minimize probate exposure.

## WEALTH TRANSFER STRATEGY
Annual gift tax exclusion utilization ($18,000 per recipient in 2024). Strategies for passing wealth efficiently. Life insurance in estate planning. Charitable strategies if applicable.

## PRIORITY ACTION CHECKLIST
[Comprehensive checkbox list organized by urgency, with specific attorney recommendations]

---
*This checklist is for educational purposes only and does not constitute legal advice. Estate planning laws vary by state. Consult a licensed estate planning attorney.*`,
  },
  {
    id: 'budget_optimization',
    name: 'Budget Optimization Report',
    tagline: 'Spending analysis with 50/30/20 breakdown',
    icon: Target,
    color: '#ec4899',
    category: 'Budgeting',
    steps: [
      {
        title: 'Monthly Income',
        fields: [
          { id: 'monthly_take_home', label: 'Monthly Take-Home Income', type: 'number', placeholder: '7000', prefix: '$' },
          { id: 'secondary_income', label: 'Secondary Income (side jobs, etc.)', type: 'number', placeholder: '0', prefix: '$' },
          { id: 'irregular_income', label: 'Average Monthly Irregular Income (bonuses, etc.)', type: 'number', placeholder: '0', prefix: '$' },
        ],
      },
      {
        title: 'Fixed Expenses',
        fields: [
          { id: 'housing', label: 'Housing (rent/mortgage)', type: 'number', placeholder: '1800', prefix: '$' },
          { id: 'car_payment', label: 'Car Payment(s)', type: 'number', placeholder: '450', prefix: '$' },
          { id: 'insurance_premiums', label: 'Insurance Premiums', type: 'number', placeholder: '400', prefix: '$' },
          { id: 'subscriptions', label: 'Subscriptions & Memberships', type: 'number', placeholder: '150', prefix: '$' },
          { id: 'minimum_debt_payments', label: 'Minimum Debt Payments', type: 'number', placeholder: '600', prefix: '$' },
        ],
      },
      {
        title: 'Variable Expenses',
        fields: [
          { id: 'food_dining', label: 'Food (groceries + dining out)', type: 'number', placeholder: '800', prefix: '$' },
          { id: 'utilities', label: 'Utilities & Phone', type: 'number', placeholder: '300', prefix: '$' },
          { id: 'entertainment', label: 'Entertainment & Hobbies', type: 'number', placeholder: '300', prefix: '$' },
          { id: 'shopping', label: 'Shopping & Personal Care', type: 'number', placeholder: '400', prefix: '$' },
          { id: 'current_savings', label: 'Current Monthly Savings & Investments', type: 'number', placeholder: '500', prefix: '$' },
        ],
      },
    ],
    systemPrompt: `You are a Personal Finance Coach and Certified Budget Analyst. Deliver a comprehensive Budget Optimization Report.

Structure your report using ## for headers:

## EXECUTIVE SUMMARY
Monthly income. Total monthly expenses. Monthly surplus or deficit. Overall budget health score (A-F). Biggest optimization opportunity.

## INCOME ANALYSIS
Total monthly income breakdown. Net vs gross consideration. Income stability assessment. Income growth opportunities.

## THE 50/30/20 FRAMEWORK APPLIED
Needs (50% target): Current needs spending, amount, % of income, variance from target.
Wants (30% target): Current wants spending, amount, % of income, variance from target.
Savings/Debt (20% target): Current savings rate, amount, % of income, variance from target.
Overall assessment of how their budget compares to this framework.

## EXPENSE DEEP DIVE
Fixed expenses analysis (% of income, benchmark). Variable expenses analysis. Discretionary spending assessment. Subscription audit — estimated waste. Housing cost ratio (should be under 30% of gross).

## SAVINGS RATE ANALYSIS
Current savings rate. Recommended savings rate for their income and goals. Gap analysis. Path to improvement.

## TOP OPTIMIZATION OPPORTUNITIES
[Ranked by potential monthly savings, with specific $ amounts for each opportunity]

## ZERO-BASED BUDGET TEMPLATE
Monthly income: [amount]
[Proposed budget allocation across all categories with specific amounts]
Remaining for additional savings: [amount]

## 30-60-90 DAY ACTION PLAN
[Specific actions to improve budget within each timeframe]

---
*This analysis is for educational purposes only. Budget needs vary by individual and location. Consult a financial advisor for personalized guidance.*`,
  },
  {
    id: 'net_worth_projection',
    name: 'Net Worth Projection',
    tagline: '10-year wealth trajectory and milestone mapping',
    icon: TrendingUp,
    color: '#14b8a6',
    category: 'Wealth Building',
    steps: [
      {
        title: 'Current Financial Position',
        fields: [
          { id: 'age', label: 'Current Age', type: 'number', placeholder: '35' },
          { id: 'current_net_worth', label: 'Current Net Worth', type: 'number', placeholder: '150000', prefix: '$' },
          { id: 'annual_income', label: 'Annual Gross Income', type: 'number', placeholder: '100000', prefix: '$' },
          { id: 'annual_savings', label: 'Annual Savings & Investments', type: 'number', placeholder: '18000', prefix: '$' },
          { id: 'total_debt', label: 'Total Debt', type: 'number', placeholder: '200000', prefix: '$' },
        ],
      },
      {
        title: 'Growth Assumptions',
        fields: [
          { id: 'income_growth', label: 'Expected Annual Income Growth (%)', type: 'number', placeholder: '3' },
          { id: 'investment_return', label: 'Expected Annual Investment Return (%)', type: 'number', placeholder: '7' },
          { id: 'home_value', label: 'Current Home Value (or 0 if renting)', type: 'number', placeholder: '350000', prefix: '$' },
          { id: 'home_appreciation', label: 'Expected Annual Home Appreciation (%)', type: 'number', placeholder: '3' },
          { id: 'debt_paydown_annual', label: 'Annual Debt Principal Paid Down', type: 'number', placeholder: '15000', prefix: '$' },
        ],
      },
      {
        title: 'Goals & Scenarios',
        fields: [
          { id: 'goal_net_worth', label: 'Target Net Worth Goal', type: 'number', placeholder: '1000000', prefix: '$' },
          { id: 'goal_year', label: 'Target Year to Reach Goal (age)', type: 'number', placeholder: '55' },
          { id: 'major_expense_1', label: 'Planned Major Expense (if any)', type: 'number', placeholder: '0', prefix: '$' },
          { id: 'major_expense_year', label: 'Year of Major Expense', type: 'number', placeholder: '2028' },
          { id: 'scenario_preference', label: 'Scenario to Analyze', type: 'select', options: ['Base case only', 'Conservative + Base + Optimistic', 'Focus on reaching $1M milestone', 'Early retirement scenario'] },
        ],
      },
    ],
    systemPrompt: `You are a Wealth Management Analyst specializing in long-term financial projections. Deliver a comprehensive Net Worth Projection Report.

Structure your report using ## for headers:

## EXECUTIVE SUMMARY
Current financial position. Target goal. Projected net worth at target date. Whether the goal is achievable at current trajectory. Key insight.

## STARTING POSITION ANALYSIS
Net worth breakdown (assets vs liabilities). Net worth-to-income ratio. Savings rate calculation. Wealth velocity (net worth growth rate).

## 10-YEAR NET WORTH PROJECTION TABLE
Year-by-year projection table showing:
Year | Age | Invested Assets | Home Equity | Other Assets | Total Debt | Net Worth
(Calculate for each year from current year to year 10 or goal year)

Show at least 3 scenarios: Conservative (bear case), Base Case, Optimistic (bull case).

## MILESTONE ANALYSIS
When will net worth hit $100K, $250K, $500K, $1M (whichever apply)?
What age does the client reach each milestone?
What changes would accelerate these timelines by 3 years?

## THE POWER OF INCREMENTAL CHANGES
What does adding $500/month in savings do to the projection?
What does a 1% increase in investment return do?
What does paying off debt 2 years faster do?

## GOAL ACHIEVEMENT ANALYSIS
Is the stated goal reachable by target date? If no: What changes are needed? What's a realistic revised timeline?
If yes: How much ahead of schedule are they?

## WEALTH-BUILDING ACTION PLAN
[Top 5 highest-impact actions to accelerate net worth growth]

---
*Projections are hypothetical estimates based on assumptions. Actual results will vary. This is not investment advice.*`,
  },
  {
    id: 'college_savings',
    name: 'College Savings Plan',
    tagline: '529 analysis and education funding roadmap',
    icon: GraduationCap,
    color: '#f97316',
    category: 'Education Planning',
    steps: [
      {
        title: 'Child & Cost Information',
        fields: [
          { id: 'child_age', label: "Child's Current Age", type: 'number', placeholder: '5' },
          { id: 'num_children', label: 'Number of Children to Plan For', type: 'number', placeholder: '1' },
          { id: 'target_school_type', label: 'Target School Type', type: 'select', options: ['Public in-state university', 'Public out-of-state university', 'Private university', 'Ivy League / elite private', 'Community college first', 'Not sure yet'] },
          { id: 'years_of_college', label: 'Expected Years of College', type: 'number', placeholder: '4' },
          { id: 'parent_contribution', label: 'Expected Parent Contribution (%)', type: 'number', placeholder: '50' },
        ],
      },
      {
        title: 'Current Savings',
        fields: [
          { id: 'current_529_balance', label: 'Current 529 Balance', type: 'number', placeholder: '15000', prefix: '$' },
          { id: 'monthly_529_contribution', label: 'Current Monthly 529 Contribution', type: 'number', placeholder: '200', prefix: '$' },
          { id: 'other_education_savings', label: 'Other Savings for Education', type: 'number', placeholder: '0', prefix: '$' },
          { id: 'parent_income', label: 'Annual Household Income (affects FAFSA)', type: 'number', placeholder: '120000', prefix: '$' },
        ],
      },
      {
        title: 'Strategy Preferences',
        fields: [
          { id: 'has_529', label: 'Do You Have a 529 Plan?', type: 'select', options: ['Yes — actively contributing', 'Yes — but rarely contribute', 'No — want to open one', 'No — considering alternatives'] },
          { id: 'state', label: 'Your State (for 529 tax deduction analysis)', type: 'text', placeholder: 'Texas' },
          { id: 'financial_aid_plan', label: 'Financial Aid Strategy', type: 'select', options: ['Maximize savings (worry about aid later)', 'Balance saving with aid eligibility', 'Primarily relying on financial aid + loans', 'Child expected to get scholarships'] },
          { id: 'savings_goal', label: 'Primary Goal', type: 'select', options: ['Fund 100% of college', 'Fund 50% of college', 'Get a head start', 'Catch up — started late'] },
        ],
      },
    ],
    systemPrompt: `You are a College Savings Specialist and Certified Education Financial Planner. Deliver a comprehensive College Savings Plan Report.

Structure your report using ## for headers:

## EXECUTIVE SUMMARY
Total estimated college cost (inflation-adjusted to when child starts). Current trajectory vs funding goal. Monthly contribution needed. Gap analysis.

## COLLEGE COST PROJECTION
Current average annual cost for target school type (tuition, room, board, fees). Inflation adjustment (5-7% college inflation rate) to matriculation year. Total 4-year cost in future dollars. Parent's share in future dollars.

## CURRENT SAVINGS TRAJECTORY
Current 529 balance. Projected balance at college age (at 6% growth assumption). Coverage percentage of total cost. Gap or surplus.

## 529 PLAN ANALYSIS
529 plan benefits specific to their state (tax deduction if applicable). Annual contribution optimization. Superfunding analysis ($18,000 x 5 = $90,000 lump sum option). Impact of contribution frequency on final balance.

## CONTRIBUTION SCENARIOS
Table showing outcomes at different monthly contribution amounts:
$100/month | $200/month | $300/month | $500/month | $750/month
Each showing: projected balance, % of cost covered, surplus/gap.

## FINANCIAL AID CONSIDERATIONS
How 529 assets affect FAFSA and CSS Profile. Asset protection strategies. Impact of parent vs student asset ownership. Strategic timing considerations.

## ALTERNATIVE STRATEGIES
UTMA/UGMA comparison. Roth IRA as college savings vehicle. Coverdell ESA analysis. I-Bonds for education expenses.

## ACTION PLAN
[Prioritized steps with specific dollar amounts and deadlines]

---
*College cost estimates are based on historical averages and are subject to significant variation. This report is educational only. Consult a financial advisor for personalized college planning.*`,
  },
  {
    id: 'buy_vs_rent',
    name: 'Buy vs. Rent Analysis',
    tagline: 'True cost comparison with break-even calculation',
    icon: Home,
    color: '#84cc16',
    category: 'Real Estate',
    steps: [
      {
        title: 'Property Details',
        fields: [
          { id: 'home_price', label: 'Target Home Purchase Price', type: 'number', placeholder: '450000', prefix: '$' },
          { id: 'down_payment', label: 'Available Down Payment', type: 'number', placeholder: '90000', prefix: '$' },
          { id: 'current_rent', label: 'Current Monthly Rent', type: 'number', placeholder: '2200', prefix: '$' },
          { id: 'estimated_mortgage', label: 'Estimated Monthly Mortgage (PITI)', type: 'number', placeholder: '3100', prefix: '$' },
          { id: 'location', label: 'City / Market', type: 'text', placeholder: 'Austin, TX' },
        ],
      },
      {
        title: 'Financial Situation',
        fields: [
          { id: 'annual_income', label: 'Annual Gross Household Income', type: 'number', placeholder: '130000', prefix: '$' },
          { id: 'interest_rate', label: 'Current Mortgage Interest Rate (%)', type: 'number', placeholder: '6.75' },
          { id: 'property_tax_rate', label: 'Estimated Annual Property Tax Rate (%)', type: 'number', placeholder: '1.2' },
          { id: 'credit_score_range', label: 'Credit Score Range', type: 'select', options: ['760+ (Excellent)', '720-759 (Very Good)', '680-719 (Good)', '640-679 (Fair)', 'Below 640'] },
          { id: 'investment_alternative', label: 'If Renting, Would You Invest the Difference?', type: 'select', options: ['Yes — consistently', 'Maybe — somewhat', 'Probably not', 'Already maxing out investments'] },
        ],
      },
      {
        title: 'Timeline & Goals',
        fields: [
          { id: 'planned_stay', label: 'How Long Do You Plan to Stay?', type: 'select', options: ['1-2 years', '3-5 years', '5-10 years', '10+ years', 'Uncertain'] },
          { id: 'home_appreciation', label: 'Expected Annual Home Appreciation (%)', type: 'number', placeholder: '3' },
          { id: 'rent_increase', label: 'Expected Annual Rent Increase (%)', type: 'number', placeholder: '4' },
          { id: 'primary_motivation', label: 'Primary Motivation for Buying', type: 'select', options: ['Build equity / wealth', 'Stability and roots', 'Investment / rental income', 'Stop paying rent', 'Family needs (schools, space)'] },
        ],
      },
    ],
    systemPrompt: `You are a Real Estate Financial Analyst specializing in residential buy vs. rent decisions. Deliver a comprehensive Buy vs. Rent Analysis Report.

Structure your report using ## for headers:

## EXECUTIVE SUMMARY
Recommendation: Buy or Rent? Overall assessment. Break-even timeline. Key deciding factors.

## TRUE COST OF BUYING
Monthly mortgage payment calculation. Property taxes. Insurance. HOA (if applicable). Maintenance (1-2% of home value annually). PMI if down payment under 20%. Total true monthly cost of ownership.

## TRUE COST OF RENTING
Current monthly rent. Renter's insurance. Total monthly cost of renting.
Monthly cost difference: Buy vs Rent.

## BREAK-EVEN ANALYSIS
The break-even year (when buying becomes cheaper than renting in total wealth terms). Calculation methodology explained. What happens at 3 years vs 5 years vs 10 years.

## EQUITY BUILD-UP PROJECTION
Year-by-year equity accumulation table (principal paydown + appreciation):
Year 1, 2, 3, 5, 7, 10: Home Value | Mortgage Balance | Equity | % Equity

## THE INVESTMENT ALTERNATIVE
If they rent and invest the monthly difference in the stock market (7% average return):
Investment portfolio value at same time horizons. Comparison to home equity at same years. Which path builds more wealth and when does the crossover happen?

## MARKET-SPECIFIC CONSIDERATIONS
Price-to-rent ratio analysis for their market (the ratio of home prices to annual rent). What this means for their specific city. Local market conditions assessment.

## DTI & QUALIFICATION ANALYSIS
Debt-to-income ratio with proposed mortgage. Front-end ratio (housing costs / income). Back-end ratio (all debts / income). Lender qualification assessment.

## FINAL RECOMMENDATION
[Clear, direct recommendation with the top 3 reasons, tailored to their specific numbers and timeline]

---
*Real estate values, rental rates, and investment returns are subject to significant variation. This analysis is educational only. Consult a real estate professional and mortgage lender for current market guidance.*`,
  },
];

// ─── Report Rendering ─────────────────────────────────────────────────────────

function renderMarkdown(text) {
  if (!text) return '';
  const lines = text.split('\n');
  let html = '';
  let inBullet = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      if (inBullet) { html += '</ul>'; inBullet = false; }
      html += `<h2 style="font-size:0.9375rem;font-weight:800;color:var(--gold);letter-spacing:0.06em;text-transform:uppercase;margin:1.75rem 0 0.75rem;padding-bottom:0.5rem;border-bottom:1px solid rgba(201,169,110,0.2)">${line.slice(3)}</h2>`;
    } else if (line.startsWith('### ')) {
      if (inBullet) { html += '</ul>'; inBullet = false; }
      html += `<h3 style="font-size:0.8125rem;font-weight:700;color:var(--text-1);letter-spacing:0.04em;margin:1.25rem 0 0.5rem;">${line.slice(4)}</h3>`;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inBullet) { html += '<ul style="margin:0.5rem 0;padding-left:1.25rem;list-style:none">'; inBullet = true; }
      const content = line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text-1)">$1</strong>');
      html += `<li style="margin:0.375rem 0;font-size:0.8125rem;color:var(--text-2);line-height:1.6;display:flex;gap:0.5rem"><span style="color:var(--gold);flex-shrink:0;margin-top:2px">◈</span><span>${content}</span></li>`;
    } else if (/^\d+\.\s/.test(line)) {
      if (inBullet) { html += '</ul>'; inBullet = false; }
      const content = line.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text-1)">$1</strong>');
      const num = line.match(/^(\d+)\./)?.[1];
      html += `<div style="display:flex;gap:0.75rem;margin:0.5rem 0;font-size:0.8125rem;color:var(--text-2);line-height:1.6"><span style="color:var(--gold);font-weight:700;min-width:20px">${num}.</span><span>${content}</span></div>`;
    } else if (line.startsWith('---')) {
      if (inBullet) { html += '</ul>'; inBullet = false; }
      html += `<hr style="border:none;border-top:1px solid var(--border-c);margin:1.5rem 0"/>`;
    } else if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
      if (inBullet) { html += '</ul>'; inBullet = false; }
      html += `<p style="font-size:0.75rem;color:var(--text-3);line-height:1.6;margin:0.5rem 0;font-style:italic">${line.slice(1, -1)}</p>`;
    } else if (line.trim() === '') {
      if (inBullet) { html += '</ul>'; inBullet = false; }
      html += '<div style="height:0.5rem"></div>';
    } else {
      if (inBullet) { html += '</ul>'; inBullet = false; }
      const content = line
        .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text-1)">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      html += `<p style="font-size:0.8125rem;color:var(--text-2);line-height:1.65;margin:0.25rem 0">${content}</p>`;
    }
  }

  if (inBullet) html += '</ul>';
  return html;
}

// ─── HTML Download Builder ─────────────────────────────────────────────────────

function buildDownloadHTML(reportName, reportContent, formData) {
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  function mdToHTML(text) {
    const lines = text.split('\n');
    let out = '';
    let inBullet = false;
    for (const line of lines) {
      if (line.startsWith('## ')) {
        if (inBullet) { out += '</ul>'; inBullet = false; }
        out += `<h2>${line.slice(3)}</h2>`;
      } else if (line.startsWith('### ')) {
        if (inBullet) { out += '</ul>'; inBullet = false; }
        out += `<h3>${line.slice(4)}</h3>`;
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        if (!inBullet) { out += '<ul>'; inBullet = true; }
        const c = line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        out += `<li>${c}</li>`;
      } else if (/^\d+\.\s/.test(line)) {
        if (inBullet) { out += '</ul>'; inBullet = false; }
        out += `<p class="numbered">${line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;
      } else if (line.startsWith('---')) {
        if (inBullet) { out += '</ul>'; inBullet = false; }
        out += '<hr>';
      } else if (line.trim() === '') {
        if (inBullet) { out += '</ul>'; inBullet = false; }
        out += '<div class="spacer"></div>';
      } else {
        if (inBullet) { out += '</ul>'; inBullet = false; }
        out += `<p>${line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')}</p>`;
      }
    }
    if (inBullet) out += '</ul>';
    return out;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Planora — ${reportName}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #07080a; color: #e8eaed; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 14px; line-height: 1.6; padding: 0; }
  .page { max-width: 860px; margin: 0 auto; padding: 2rem; }
  .header { display: flex; align-items: flex-start; justify-content: space-between; padding: 2rem; background: #0f1117; border-bottom: 2px solid #c9a96e; margin: -2rem -2rem 2rem; }
  .logo-block { display: flex; align-items: center; gap: 0.75rem; }
  .logo-p { width: 36px; height: 36px; background: #c9a96e; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 1.125rem; font-weight: 900; color: #07080a; flex-shrink: 0; }
  .logo-text { font-weight: 900; font-size: 0.875rem; letter-spacing: 0.18em; color: #e8eaed; text-transform: uppercase; }
  .logo-sub { font-size: 0.5rem; font-weight: 700; letter-spacing: 0.22em; color: #c9a96e; text-transform: uppercase; margin-top: 2px; }
  .header-right { text-align: right; }
  .report-name { font-size: 1.25rem; font-weight: 800; color: #c9a96e; letter-spacing: -0.01em; }
  .report-date { font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem; }
  .report-type { font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.1em; color: #4b5563; text-transform: uppercase; margin-top: 0.25rem; }
  .disclaimer-banner { background: rgba(201,169,110,0.08); border: 1px solid rgba(201,169,110,0.15); border-radius: 6px; padding: 0.75rem 1rem; margin-bottom: 1.5rem; font-size: 0.6875rem; color: #9ca3af; line-height: 1.5; }
  .disclaimer-banner strong { color: #c9a96e; }
  h2 { font-size: 0.875rem; font-weight: 800; color: #c9a96e; letter-spacing: 0.06em; text-transform: uppercase; margin: 2rem 0 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(201,169,110,0.2); }
  h3 { font-size: 0.8125rem; font-weight: 700; color: #e8eaed; margin: 1.25rem 0 0.5rem; }
  p { font-size: 0.8125rem; color: #9ca3af; line-height: 1.65; margin: 0.25rem 0; }
  p strong { color: #e8eaed; }
  ul { list-style: none; padding-left: 0; margin: 0.5rem 0; }
  ul li { padding: 0.375rem 0 0.375rem 1.25rem; position: relative; font-size: 0.8125rem; color: #9ca3af; line-height: 1.6; }
  ul li::before { content: '◈'; position: absolute; left: 0; color: #c9a96e; }
  .numbered { padding-left: 1.5rem; font-size: 0.8125rem; color: #9ca3af; margin: 0.4rem 0; }
  hr { border: none; border-top: 1px solid #1e2435; margin: 1.5rem 0; }
  .spacer { height: 0.5rem; }
  .footer { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #1e2435; font-size: 0.625rem; color: #4b5563; line-height: 1.6; }
  .footer strong { color: #6b7280; }
  @media print { body { background: white; color: #1a1a1a; } .header { background: #f9fafb; } h2 { color: #1d4ed8; } p, li { color: #374151; } }
  @media (max-width: 600px) { .page { padding: 1rem; } .header { flex-direction: column; gap: 1rem; } .header-right { text-align: left; } }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="logo-block">
      <div class="logo-p">P</div>
      <div>
        <div class="logo-text">PLANORA</div>
        <div class="logo-sub">TERMINAL</div>
      </div>
    </div>
    <div class="header-right">
      <div class="report-name">${reportName}</div>
      <div class="report-date">Generated ${date}</div>
      <div class="report-type">Institutional Research Report</div>
    </div>
  </div>
  <div class="disclaimer-banner">
    <strong>Important:</strong> This report is for educational purposes only and does not constitute financial, tax, legal, or investment advice. Consult qualified licensed professionals before making any financial decisions.
  </div>
  <div class="content">
    ${mdToHTML(reportContent)}
  </div>
  <div class="footer">
    <strong>PLANORA TERMINAL</strong> · Institutional Financial Education Platform<br>
    Report generated ${date} · For educational purposes only · Not financial advice<br>
    Past performance does not guarantee future results. All projections are hypothetical estimates.
  </div>
</div>
</body>
</html>`;
}

// ─── Form Field Component ──────────────────────────────────────────────────────

function FormField({ field, value, onChange }) {
  const inputStyle = {
    width: '100%',
    background: 'var(--elevated)',
    border: '1px solid var(--border-c)',
    borderRadius: '6px',
    color: 'var(--text-1)',
    fontSize: '0.8125rem',
    padding: '0.5rem 0.625rem',
    outline: 'none',
    transition: 'border-color 0.15s',
    fontFamily: 'inherit',
  };

  const labelStyle = {
    fontSize: '0.6875rem',
    fontWeight: 700,
    color: 'var(--text-2)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: '0.375rem',
    display: 'block',
  };

  if (field.type === 'select') {
    return (
      <div>
        <label style={labelStyle}>{field.label}</label>
        <select
          value={value || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          style={{ ...inputStyle, cursor: 'pointer' }}
        >
          <option value="">Select...</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      <label style={labelStyle}>{field.label}</label>
      <div style={{ position: 'relative' }}>
        {field.prefix && (
          <span style={{
            position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-3)', fontSize: '0.8125rem', pointerEvents: 'none',
          }}>
            {field.prefix}
          </span>
        )}
        <input
          type={field.type === 'number' ? 'number' : 'text'}
          value={value || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          placeholder={field.placeholder}
          style={{
            ...inputStyle,
            paddingLeft: field.prefix ? '1.5rem' : '0.625rem',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--gold)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--border-c)'; }}
        />
      </div>
    </div>
  );
}

// ─── Multi-Step Form ──────────────────────────────────────────────────────────

function ReportForm({ report, onSubmit, onClose }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});

  const steps = report.steps;
  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;
  const pct = Math.round(((step + 1) / (steps.length + 1)) * 100);

  const handleChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    if (isLastStep) {
      onSubmit(formData);
    } else {
      setStep((s) => s + 1);
    }
  };

  const canProceed = currentStep.fields.every((f) => {
    if (f.type === 'select') return formData[f.id] && formData[f.id] !== '';
    return formData[f.id] !== undefined && formData[f.id] !== '';
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Progress bar */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Step {step + 1} of {steps.length} — {currentStep.title}
          </span>
          <span style={{ fontSize: '0.6875rem', color: 'var(--gold)', fontWeight: 700 }}>{pct}%</span>
        </div>
        <div style={{ height: 3, background: 'var(--border-c)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'var(--gold)', borderRadius: 99, transition: 'width 0.3s ease' }} />
        </div>
        <div style={{ display: 'flex', gap: '4px', marginTop: '0.625rem' }}>
          {steps.map((s, i) => (
            <div
              key={i}
              style={{
                flex: 1, height: 3, borderRadius: 99,
                background: i <= step ? 'var(--gold)' : 'var(--border-c)',
                transition: 'background 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Fields */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {currentStep.fields.map((field) => (
          <FormField
            key={field.id}
            field={field}
            value={formData[field.id]}
            onChange={handleChange}
          />
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-c)' }}>
        <button
          onClick={step === 0 ? onClose : () => setStep((s) => s - 1)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'none', border: '1px solid var(--border-c)', color: 'var(--text-2)', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
        >
          <ChevronLeft size={14} />
          {step === 0 ? 'Cancel' : 'Back'}
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.375rem',
            background: canProceed ? 'var(--gold)' : 'var(--border-c)',
            color: canProceed ? '#07080a' : 'var(--text-3)',
            border: 'none', borderRadius: '6px', padding: '0.5rem 1.25rem',
            cursor: canProceed ? 'pointer' : 'not-allowed',
            fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase',
            transition: 'background 0.2s',
          }}
        >
          {isLastStep ? (
            <><Sparkles size={13} /> Generate Report</>
          ) : (
            <>Next <ChevronRight size={14} /></>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Loading View ─────────────────────────────────────────────────────────────

function LoadingView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', gap: '2rem' }}>
      <div style={{ position: 'relative' }}>
        <div style={{
          width: 72, height: 72,
          border: '3px solid rgba(201,169,110,0.1)',
          borderTopColor: 'var(--gold)',
          borderRadius: '50%',
          animation: 'tSpin 0.9s linear infinite',
        }} />
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Sparkles size={22} color="var(--gold)" />
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '0.5rem' }}>
          Generating Your Institutional Report
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-2)', lineHeight: 1.6 }}>
          Analyzing your data with institutional-grade precision...
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.375rem' }}>
          This may take 30–60 seconds
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--gold)',
              animation: `tPulse 1.4s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes tSpin { to { transform: rotate(360deg); } }
        @keyframes tPulse { 0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}

// ─── Report View ──────────────────────────────────────────────────────────────

function ReportView({ report, content, formData, onClose, onRegenerate }) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const scoreColor = (content.score || 0) >= 75 ? '#10b981' : (content.score || 0) >= 55 ? '#c9a96e' : '#ef4444';
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Planora — ${report.name}</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #07080a; color: #e8eaed; font-family: 'Inter', -apple-system, sans-serif; font-size: 14px; line-height: 1.6; }
.page { max-width: 900px; margin: 0 auto; padding: 2rem; }
.header { display: flex; align-items: flex-start; justify-content: space-between; padding: 1.5rem 2rem; background: #0f1117; border-bottom: 2px solid #c9a96e; margin: -2rem -2rem 2rem; }
.logo-p { width: 36px; height: 36px; background: #c9a96e; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 1.125rem; font-weight: 900; color: #07080a; display: inline-flex; }
.report-name { font-size: 1.25rem; font-weight: 800; color: #c9a96e; }
.score-hero { display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem; background: #0f1117; border: 1px solid #1e2435; border-radius: 8px; margin-bottom: 1.5rem; }
.score-circle { width: 80px; height: 80px; border-radius: 50%; border: 3px solid ${scoreColor}; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.scorecard { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.5rem; }
.metric { background: #0f1117; border: 1px solid #1e2435; border-radius: 6px; padding: 0.75rem; }
.metric-val { font-size: 1.125rem; font-weight: 800; color: #c9a96e; }
.metric-label { font-size: 0.625rem; color: #6b7280; text-transform: uppercase; letter-spacing: 0.08em; }
.section { margin-bottom: 1.5rem; }
.section-title { font-size: 0.8125rem; font-weight: 800; color: #c9a96e; letter-spacing: 0.06em; text-transform: uppercase; border-bottom: 1px solid rgba(201,169,110,0.2); padding-bottom: 0.5rem; margin-bottom: 0.75rem; }
p { font-size: 0.8125rem; color: #9ca3af; line-height: 1.65; margin: 0.5rem 0; }
p strong { color: #e8eaed; }
table { width: 100%; border-collapse: collapse; font-size: 0.8125rem; margin: 0.75rem 0; }
th { background: #0f1117; color: #6b7280; font-size: 0.625rem; text-transform: uppercase; letter-spacing: 0.06em; padding: 0.5rem 0.75rem; text-align: left; }
td { padding: 0.5rem 0.75rem; color: #9ca3af; border-bottom: 1px solid #1e2435; }
tr:nth-child(even) td { background: var(--surface); }
.action { padding: 0.75rem; border-radius: 8px; margin: 0.5rem 0; }
.action-CRITICAL { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); }
.action-HIGH { background: rgba(201,169,110,0.08); border: 1px solid rgba(201,169,110,0.25); }
.action-MEDIUM { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.22); }
.disclaimer { font-size: 0.6875rem; color: #4b5563; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #1e2435; }
@media print { body { background: white; color: #1a1a1a; } }
</style>
</head>
<body>
<div class="page">
<div class="header">
  <div style="display:flex;align-items:center;gap:0.75rem">
    <div class="logo-p">P</div>
    <div><div style="font-weight:900;font-size:0.875rem;letter-spacing:0.18em;text-transform:uppercase">PLANORA</div><div style="font-size:0.5rem;font-weight:700;letter-spacing:0.22em;color:#c9a96e;text-transform:uppercase">TERMINAL</div></div>
  </div>
  <div style="text-align:right"><div class="report-name">${report.name}</div><div style="font-size:0.75rem;color:#6b7280">Generated ${date}</div></div>
</div>
<div class="score-hero">
  <div class="score-circle"><span style="font-size:1.5rem;font-weight:900;color:${scoreColor}">${content.grade || 'B'}</span><span style="font-size:0.625rem;color:#6b7280">${content.score || 0}/100</span></div>
  <div><div style="font-size:1rem;font-weight:800;color:#e8eaed;margin-bottom:0.25rem">${content.headline || ''}</div><p>${content.summary || ''}</p></div>
</div>
${content.scorecard ? `<div class="scorecard">${content.scorecard.map(m => `<div class="metric"><div class="metric-val">${m.value}</div><div class="metric-label">${m.label}</div><div style="font-size:0.625rem;color:#4b5563">${m.sub || ''}</div></div>`).join('')}</div>` : ''}
${(content.sections || []).map(s => `<div class="section"><div class="section-title">${s.title}</div>${s.content ? `<p>${s.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>` : ''}${s.table ? `<table><thead><tr>${s.table.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${s.table.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>` : ''}</div>`).join('')}
${content.actions ? `<div class="section"><div class="section-title">Action Plan</div>${content.actions.map(a => `<div class="action action-${a.priority}"><strong style="color:${a.priority === 'CRITICAL' ? '#ef4444' : a.priority === 'HIGH' ? '#c9a96e' : '#10b981'}">[${a.priority}]</strong> ${a.action} · ${a.timeline} · Impact: ${a.impact}</div>`).join('')}</div>` : ''}
<div class="disclaimer">This report is for educational purposes only and does not constitute financial, tax, legal, or investment advice. Consult qualified licensed professionals. Generated by Planora Terminal · ${date}</div>
</div>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Planora_${report.id}_Report.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Report header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 1.25rem', background: 'var(--surface)',
        borderBottom: '1px solid var(--border-c)', gap: '1rem',
        flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
            Planora · Institutional Report
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-1)' }}>{report.name}</div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleDownload}
            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'var(--elevated)', border: '1px solid var(--border-c)', color: 'var(--text-1)', borderRadius: '6px', padding: '0.4375rem 0.875rem', cursor: 'pointer', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}
          >
            <Download size={12} /> Save HTML
          </button>
          <button
            onClick={handlePrint}
            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'var(--elevated)', border: '1px solid var(--border-c)', color: 'var(--text-1)', borderRadius: '6px', padding: '0.4375rem 0.875rem', cursor: 'pointer', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}
          >
            <Printer size={12} /> Print PDF
          </button>
          <button
            onClick={onClose}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, background: 'var(--elevated)', border: '1px solid var(--border-c)', color: 'var(--text-2)', borderRadius: '6px', cursor: 'pointer' }}
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{
        margin: '1rem 1.25rem 0',
        background: 'rgba(201,169,110,0.05)',
        border: '1px solid rgba(201,169,110,0.15)',
        borderRadius: '6px',
        padding: '0.625rem 0.875rem',
        fontSize: '0.6875rem',
        color: 'var(--text-3)',
        lineHeight: 1.5,
      }}>
        <span style={{ color: 'var(--gold)', fontWeight: 700 }}>Educational Use Only — </span>
        This report does not constitute financial, tax, legal, or investment advice. Consult qualified licensed professionals before making any financial decisions.
      </div>

      {/* Report content */}
      <div style={{ padding: '0 1.25rem 2rem' }}>
        <ReportRenderer data={content} />
      </div>
    </div>
  );
}

// ─── Report Modal ─────────────────────────────────────────────────────────────

function ReportModal({ report, onClose }) {
  const [state, setState] = useState('form'); // 'form' | 'loading' | 'report' | 'error'
  const [reportContent, setReportContent] = useState(null);
  const [formData, setFormData] = useState({});
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (data) => {
    setFormData(data);
    setState('loading');

    // Small delay for UX — feels intentional, not instant
    await new Promise(resolve => setTimeout(resolve, 1600));

    try {
      const content = generateReport(report.id, data);
      setReportContent(content);
      setState('report');
    } catch (err) {
      setErrorMsg(`Report generation failed: ${err.message}`);
      setState('error');
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(7,8,10,0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => { if (e.target === e.currentTarget && state !== 'loading') onClose(); }}
    >
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border-c)',
          borderRadius: '10px',
          width: '100%',
          maxWidth: state === 'report' ? 960 : 640,
          maxHeight: '92vh',
          overflow: state === 'report' ? 'auto' : 'visible',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Modal header (form/error states) */}
        {state !== 'report' && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border-c)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '8px',
                background: `${report.color}1a`,
                border: `1px solid ${report.color}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <report.icon size={16} color={report.color} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-1)' }}>{report.name}</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-3)' }}>{report.tagline}</div>
              </div>
            </div>
            {state !== 'loading' && (
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}>
                <X size={16} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, overflow: state === 'report' ? 'visible' : 'auto' }}>
          {state === 'form' && (
            <div style={{ padding: '1.25rem' }}>
              <ReportForm report={report} onSubmit={handleSubmit} onClose={onClose} />
            </div>
          )}
          {state === 'loading' && <LoadingView />}
          {state === 'report' && (
            <ReportView
              report={report}
              content={reportContent}
              formData={formData}
              onClose={onClose}
              onRegenerate={() => setState('form')}
            />
          )}
          {state === 'error' && (
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', marginBottom: '1.25rem' }}>
                <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.25rem' }}>Report Generation Failed</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-2)', lineHeight: 1.5 }}>{errorMsg}</div>
                  {errorMsg.includes('ANTHROPIC_API_KEY') && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.5rem', lineHeight: 1.5 }}>
                      To enable reports: Add your Anthropic API key to the <code style={{ background: 'var(--elevated)', padding: '1px 4px', borderRadius: '3px', color: 'var(--gold)' }}>.env</code> file as <code style={{ background: 'var(--elevated)', padding: '1px 4px', borderRadius: '3px', color: 'var(--gold)' }}>ANTHROPIC_API_KEY=sk-ant-...</code> and restart the server.
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setState('form')} className="t-btn t-btn-gold" style={{ flex: 1 }}>
                  Try Again
                </button>
                <button onClick={onClose} style={{ flex: 1, background: 'none', border: '1px solid var(--border-c)', color: 'var(--text-2)', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Example Report Data (Wealth Diagnostic sample) ─────────────────────────

const EXAMPLE_REPORT_DATA = {
  score: 71,
  grade: 'B',
  headline: 'Solid Foundation — Key Gaps in Tax Efficiency & Retirement Pace',
  summary:
    'John & Sarah Miller (ages 48 & 46) have built a strong financial base with $1.24M in net worth and no high-interest debt. However, retirement contributions are running below their target replacement rate, their taxable account holds significant unrealized gains that should be harvested, and their asset allocation drifted ~8% equity-heavy since last rebalance. Addressing these three areas could add an estimated $280,000+ in long-term wealth.',

  scorecard: [
    { label: 'Net Worth',     value: '$1.24M',  sub: '+12.4% YoY',          status: 'good' },
    { label: 'Retirement Pace', value: '74%',   sub: 'of target pace',       status: 'warning' },
    { label: 'Tax Efficiency',  value: '58/100', sub: 'Improvement available', status: 'warning' },
    { label: 'Debt Ratio',      value: '2.1%',   sub: 'Mortgage only',        status: 'good' },
  ],

  charts: [
    {
      title: 'ASSET ALLOCATION',
      type: 'donut',
      data: [
        { name: 'US Equities',       value: 44, color: '#c9a96e' },
        { name: 'Intl Equities',     value: 18, color: '#3b82f6' },
        { name: 'Fixed Income',      value: 22, color: '#10b981' },
        { name: 'Real Estate (REIT)',value: 9,  color: '#8b5cf6' },
        { name: 'Cash',              value: 7,  color: '#6b7280' },
      ],
    },
    {
      title: 'PROJECTED RETIREMENT WEALTH — 3 SCENARIOS',
      type: 'area',
      xKey: 'age',
      data: [
        { age: '50', conservative: 1380000, base: 1410000, optimistic: 1450000 },
        { age: '55', conservative: 1720000, base: 1890000, optimistic: 2110000 },
        { age: '60', conservative: 2050000, base: 2440000, optimistic: 2960000 },
        { age: '65', conservative: 2290000, base: 3120000, optimistic: 4010000 },
      ],
      lines: [
        { key: 'conservative', label: 'Conservative',  color: '#ef4444' },
        { key: 'base',         label: 'Base Case',     color: '#c9a96e' },
        { key: 'optimistic',   label: 'Optimistic',    color: '#10b981' },
      ],
    },
  ],

  sections: [
    {
      title: 'Net Worth Breakdown',
      icon: '◈',
      bigNumbers: [
        { value: '$1.24M', label: 'Total Net Worth',    sub: 'as of April 2026',    color: '#c9a96e' },
        { value: '$412k',  label: 'Retirement Accounts', sub: '401k + Roth IRA',    color: '#10b981' },
        { value: '$588k',  label: 'Home Equity',         sub: '$820k value / $232k mortgage', color: '#3b82f6' },
        { value: '$241k',  label: 'Taxable Brokerage',   sub: '$94k unrealized gains', color: '#8b5cf6' },
      ],
      callouts: [
        { type: 'good',    title: 'Strong Equity Base', text: 'Home equity provides a solid wealth anchor. Mortgage rate of 3.25% is below market — no refinance action needed.' },
        { type: 'warning', title: 'Cash Drag',          text: '$87,000 sitting in savings at 0.05% APY. Target 3–6 months expenses ($28k–$56k) in high-yield savings; invest the remainder.' },
      ],
    },
    {
      title: 'Retirement Savings Analysis',
      icon: '◈',
      bars: [
        { label: 'John — 401(k) Contribution Rate',  pct: 9,  color: '#c9a96e', showValue: '9% / 15% target' },
        { label: 'Sarah — Roth IRA Funded (2025)',    pct: 100, color: '#10b981', showValue: 'Maxed $7,000' },
        { label: 'Overall Retirement Pace Score',     pct: 74, color: '#3b82f6', showValue: '74 / 100' },
      ],
      content: `**Gap:** At current savings rate, projected retirement assets at age 65 reach $3.1M (base case), which replaces ~72% of pre-retirement income. A 15% 401(k) contribution would close this gap and add an estimated **$188,000** by retirement.

**Employer Match:** John is leaving **$4,200/year** in unmatched employer contributions on the table by contributing below the 15% match threshold. This should be the #1 priority action item.`,
      callouts: [
        { type: 'critical', title: 'Maximize 401(k) Match', text: "John's employer matches 100% up to 6% of salary ($70k). Contributing 6% captures the full match — currently only contributing 4%." },
      ],
    },
    {
      title: 'Tax Efficiency',
      icon: '◈',
      table: {
        headers: ['Account', 'Balance', 'Unrealized Gain', 'Rec. Action'],
        rows: [
          ['Taxable Brokerage', '$241,000', '$94,000', 'Harvest losses in bonds'],
          ['John 401(k)',       '$298,000', 'Tax-deferred', 'Rebalance internally — no tax event'],
          ['Sarah Roth IRA',   '$114,000', 'Tax-free',    'Hold growth assets here'],
          ['Joint HYSA',       '$87,000',  'N/A',         'Move $31k → brokerage'],
        ],
        highlight: 3,
      },
      callouts: [
        { type: 'warning', title: 'Tax-Loss Harvesting Opportunity', text: 'Three bond ETF positions show $8,200 in harvestable losses. Realizing these offsets $8,200 of the $94k in gains — saving approximately $1,230–$2,050 in federal taxes this year.' },
        { type: 'good',    title: 'Asset Location is Well-Structured', text: 'High-growth assets are correctly placed in Roth accounts; dividend-producing assets in 401(k). No asset location overhaul needed.' },
      ],
    },
  ],

  scenarios: [
    { outcome: '$2.29M',  description: 'No contribution changes, 4% avg. annual return, early partial retirement at 62' },
    { outcome: '$3.12M',  description: 'Increase 401k to 15%, 6.5% avg. return, retire at 65 as planned' },
    { outcome: '$4.01M',  description: 'Max all accounts, 8.5% avg. return, work to 67, HYSA surplus invested' },
  ],

  actions: [
    { priority: 'CRITICAL', action: 'Increase John\'s 401(k) to at least 6% to capture full employer match',      timeline: 'This week',    impact: 'Captures $4,200/year in free money; costs ~$110/month after-tax at current bracket', amount: '+$4.2k/yr' },
    { priority: 'HIGH',     action: 'Move $31,000 from HYSA into taxable brokerage — invest in index funds',       timeline: '30 days',      impact: 'Eliminates cash drag estimated at $1,850+/year in opportunity cost' },
    { priority: 'HIGH',     action: 'Harvest $8,200 in bond ETF losses before Dec 31',                             timeline: 'Q4 2026',      impact: 'Saves $1,230–$2,050 in federal taxes; wash-sale safe if repurchased after 30 days' },
    { priority: 'MEDIUM',   action: 'Rebalance equity allocation from 62% → 55% to match target risk profile',     timeline: '60–90 days',   impact: 'Reduces portfolio drawdown risk in down markets; improves Sharpe ratio' },
    { priority: 'MEDIUM',   action: 'Open a 529 plan for remaining $12k in earmarked college funds',               timeline: 'Next quarter', impact: 'State tax deduction on contributions; tax-free growth for education expenses' },
  ],
};

// ─── Example Report Modal ─────────────────────────────────────────────────────

function ExampleReportModal({ onClose }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(7,8,10,0.88)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border-c)',
          borderRadius: '10px',
          width: '100%',
          maxWidth: 960,
          maxHeight: '92vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-c)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '8px',
              background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles size={16} color="var(--gold)" />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-1)' }}>
                Example Report — Wealth Diagnostic
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-3)' }}>
                Sample output using fictional data · John & Sarah Miller · Apr 2026
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--gold)',
              background: 'rgba(201,169,110,0.10)',
              border: '1px solid rgba(201,169,110,0.25)',
              borderRadius: '4px', padding: '3px 8px',
            }}>
              DEMO · NOT REAL DATA
            </span>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Disclaimer strip */}
        <div style={{
          padding: '0.5rem 1.25rem',
          background: 'rgba(201,169,110,0.05)',
          borderBottom: '1px solid rgba(201,169,110,0.12)',
          fontSize: '0.6875rem', color: 'var(--text-3)', lineHeight: 1.5,
          flexShrink: 0,
        }}>
          <span style={{ color: 'var(--gold)', fontWeight: 700 }}>This is a sample only — </span>
          All names, figures, and data are fictional. Real reports are generated from your own inputs and are never stored.
        </div>

        {/* Scrollable report content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <ReportRenderer data={EXAMPLE_REPORT_DATA} />
        </div>
      </div>
    </div>
  );
}

// ─── Report Card ──────────────────────────────────────────────────────────────

function ReportCard({ report, onClick }) {
  const Icon = report.icon;
  return (
    <div
      className="t-card t-card-hover"
      onClick={onClick}
      style={{
        cursor: 'pointer',
        padding: '1.125rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{
          width: 40, height: 40, borderRadius: '8px',
          background: `${report.color}1a`,
          border: `1px solid ${report.color}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={17} color={report.color} />
        </div>
        <span style={{
          fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: report.color,
          background: `${report.color}14`,
          border: `1px solid ${report.color}25`,
          borderRadius: '4px', padding: '2px 6px',
        }}>
          {report.category}
        </span>
      </div>

      <div>
        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-1)', marginBottom: '0.25rem', lineHeight: 1.3 }}>
          {report.name}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', lineHeight: 1.5 }}>
          {report.tagline}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.375rem', borderTop: '1px solid var(--border-c)' }}>
        <span style={{ fontSize: '0.6875rem', color: 'var(--text-3)' }}>
          {report.steps.length} steps · AI-powered
        </span>
        <button
          className="t-btn t-btn-sm"
          style={{
            fontSize: '0.625rem', letterSpacing: '0.06em',
            background: `${report.color}1a`,
            border: `1px solid ${report.color}33`,
            color: report.color,
            padding: '3px 8px',
          }}
          onClick={(e) => { e.stopPropagation(); onClick(); }}
        >
          GENERATE →
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BreakdownReports() {
  const [activeReport, setActiveReport] = useState(null);
  const [showExample, setShowExample] = useState(false);

  const categories = [...new Set(REPORTS.map((r) => r.category))];

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border-c)",
        borderRadius: 20,
        padding: "2rem 2.25rem",
        marginBottom: "1.25rem",
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 var(--border-c)",
      }}>
        <div style={{
          position: "absolute", top: -60, right: -40,
          width: 320, height: 320,
          background: "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", position: "relative" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.625rem" }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Sparkles size={14} style={{ color: "var(--gold)" }} />
              </div>
              <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: "var(--text-1)", letterSpacing: "-0.01em", fontFamily: "'Inter', system-ui, sans-serif" }}>
                AI BREAKDOWN{" "}
                <em style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", color: "var(--gold)", fontWeight: 400, fontSize: "1.5rem" }}>Reports</em>
              </h1>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.65, maxWidth: 560, margin: "0 0 1rem" }}>
              Get institutional-quality financial analysis tailored to you. Our AI synthesizes your portfolio, tax situation, and goals into clear, actionable breakdown reports.
            </p>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              {["AI-Powered", "Personalized Reports", "Tax Strategies", "Actionable Insights"].map((label) => (
                <span key={label} style={{
                  fontSize: "0.6875rem", fontWeight: 700, padding: "3px 10px",
                  borderRadius: 99, letterSpacing: "0.04em",
                  background: "rgba(201,169,110,0.10)",
                  border: "1px solid rgba(201,169,110,0.25)",
                  color: "var(--gold)",
                }}>{label}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", flexShrink: 0 }}>
            {[
              { icon: Brain, label: "Portfolio Analysis", sub: "AI-driven allocation review", color: "#3b82f6" },
              { icon: DollarSign, label: "Tax Optimization", sub: "Loss harvesting & strategies", color: "var(--gold)" },
              { icon: Shield, label: "Risk Assessment", sub: "Exposure & hedging insights", color: "var(--teal)" },
              { icon: ClipboardList, label: "Personalized Insights", sub: "Tailored action steps", color: "#f59e0b" },
            ].map(({ icon: Icon, label, sub, color }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: "0.625rem",
                padding: "0.625rem 0.875rem",
                background: "var(--bg)", border: "1px solid var(--border-c)",
                borderRadius: 10, minWidth: 170,
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  background: "rgba(201,169,110,0.1)",
                  border: "1px solid rgba(201,169,110,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={14} style={{ color }} />
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-1)", lineHeight: 1 }}>{label}</div>
                  <div style={{ fontSize: "0.625rem", color: "var(--text-3)", marginTop: 2, lineHeight: 1.3 }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
        {[
          { value: '12', label: 'Report Types' },
          { value: 'AI', label: 'Powered' },
          { value: 'HTML', label: 'Download' },
          { value: '∞', label: 'Generates' },
        ].map((s) => (
          <div key={s.label} className="t-card t-card-p" style={{ textAlign: 'center' }}>
            <div className="t-mono" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--gold)', lineHeight: 1.1, marginBottom: '0.25rem' }}>{s.value}</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="t-card t-card-p" style={{ marginBottom: '2rem', border: "1px solid rgba(201,169,110,0.25)" }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            HOW IT WORKS
          </div>
          <button
            onClick={() => setShowExample(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.375rem',
              background: 'rgba(201,169,110,0.10)',
              border: '1px solid rgba(201,169,110,0.3)',
              color: 'var(--gold)',
              borderRadius: '6px',
              padding: '0.375rem 0.875rem',
              cursor: 'pointer',
              fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em',
              textTransform: 'uppercase',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(201,169,110,0.18)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(201,169,110,0.10)'}
          >
            <Sparkles size={12} /> See Example Report
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {[
            { step: '01', title: 'Choose a Report', desc: 'Select from 12 institutional-quality report types covering every area of personal finance.' },
            { step: '02', title: 'Answer the Questions', desc: 'Complete a 3-4 step form tailored to that specific report. All inputs are private and never stored.' },
            { step: '03', title: 'Get Your Report', desc: 'Receive a comprehensive AI-generated report you can download as HTML or print as PDF.' },
          ].map((item) => (
            <div key={item.step} style={{ display: 'flex', gap: '0.75rem' }}>
              <span className="t-mono" style={{ fontSize: '1.5rem', fontWeight: 900, color: 'rgba(201,169,110,0.25)', lineHeight: 1, flexShrink: 0 }}>{item.step}</span>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '0.25rem' }}>{item.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report grid */}
      <div className="t-section-title" style={{ marginBottom: '1rem' }}>
        CHOOSE A REPORT
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        {REPORTS.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            onClick={() => setActiveReport(report)}
          />
        ))}
      </div>

      {/* Disclaimer */}
      <div className="t-card t-card-p" style={{ border: "1px solid rgba(100,116,139,0.15)", background: "rgba(100,116,139,0.03)" }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          IMPORTANT DISCLAIMER
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', lineHeight: 1.6 }}>
          All reports generated by Planora Breakdown Reports are for <strong style={{ color: 'var(--text-2)' }}>educational purposes only</strong> and do not constitute financial, tax, legal, investment, or insurance advice. No data you enter is stored or transmitted outside of your current session. Consult qualified, licensed professionals before making any financial decisions. Past performance and projections are not guarantees of future results.
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .br-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 580px) {
          .br-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Report Modal */}
      {activeReport && (
        <ReportModal report={activeReport} onClose={() => setActiveReport(null)} />
      )}

      {/* Example Report Modal */}
      {showExample && (
        <ExampleReportModal onClose={() => setShowExample(false)} />
      )}
    </div>
  );
}
