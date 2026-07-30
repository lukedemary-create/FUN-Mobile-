# Planora Mobile — Content & Function Brief
# Covers: FUN Platform, Wealth Counsel, Planora AI, Navigation Assistant Chat
# Last updated: July 2026

===========================================================
FUN — FINANCIAL UNDERSTANDING NETWORK
===========================================================

Purpose: The financial education platform inside Planora. Indigo accent (#818cf8) throughout. Every section teaches a financial concept with real data, calculators embedded directly in content, and visual guides that make complex concepts immediately understandable. Educational tone — warm, clear, never condescending. Progress indicators on all learning modules.

---

FUN DASHBOARD (entry point)
Purpose: The personalized gateway into FUN. Assesses where the user is in their financial journey before showing them anything else, then builds a custom learning path based on their answers.

Shows:
- WelcomeScreen splash introducing the FUN platform with indigo branding and the educational mission statement
- 9-question onboarding assessment:
  1. How confident do you feel about your personal finances overall?
  2. What is your biggest financial challenge right now? (budgeting, debt, investing, retirement, home buying, etc.)
  3. What is your age range?
  4. What is your approximate household income?
  5. Do you currently contribute to a 401(k) or workplace retirement plan?
  6. Do you have an emergency fund of 3+ months of expenses?
  7. How comfortable are you with investing?
  8. Do you currently own or rent your home?
  9. What is your primary financial goal for the next 12 months?
- After completing: LearningPath component showing recommended modules in priority order based on answers
- Goal banner showing the user's stated primary goal
- Confidence banner calibrating their starting knowledge level
- Quick-access cards to all FUN modules
- Answers stored in localStorage under key: fun-onboarding-v1

What the user accomplishes: Instead of being dropped into a random menu they receive a personalized curriculum that starts exactly where they are.

---

EDUCATION HUB
Purpose: Central navigation for all FUN education modules — organized by topic so the user can browse and choose what to learn next.

Shows:
- Topic cards for every education module with title, description, estimated read/learn time, and what the user will be able to do after completing it
- Progress indicators on started modules
- Organized by: Foundations, Planning, Investing, Life Events

What the user accomplishes: They see the full FUN curriculum and choose their own learning path beyond the personalized recommendations.

---

BUDGETING (/fun/budgeting)
Purpose: Teach the user how to build and use a budget as a wealth-building tool — not just a constraint.

Shows:
- Three budgeting frameworks explained with visual breakdowns:
  - 50/30/20 Rule: 50% needs, 30% wants, 20% savings/debt — the most widely recommended starting framework
  - Zero-Based Budgeting: every dollar assigned a job, income minus all allocations equals zero
  - Envelope Method: cash divided into physical or digital envelopes by category, spending stops when envelope is empty
- Cash flow explainer: income vs. expenses, fixed vs. variable costs, one-time vs. recurring — with a visual flow diagram
- Budget builder calculator: user inputs their monthly take-home income and major expense categories, tool shows current allocation percentages vs. 50/30/20 targets and flags any categories over their recommended limit
- Savings rate tracker: what percentage of income is being saved and how that rate compounds over 10, 20, and 30 years shown as a line chart
- Six most common budget mistakes and exactly how to fix each one
- Sinking fund explainer: how to save for irregular expenses (car insurance, vacations, holiday gifts) by dividing the annual cost by 12 and setting that aside monthly

What the user accomplishes: They build their first real written budget, understand why every spending decision is actually an investment decision, and have a tool to track it going forward.

---

DEBT & CREDIT (/fun/debt-credit)
Purpose: Teach the user how debt works, how credit scores are calculated, and how to strategically eliminate debt while building credit simultaneously.

Shows:
- Types of debt explained with typical interest rates and balance sheet impact:
  - Credit card (revolving, 20–29% APR)
  - Student loans (federal vs. private, forgiveness programs)
  - Auto loans (simple interest, how dealer financing works)
  - Mortgage (amortization, how the early payments are mostly interest)
  - Personal loans
  - HELOCs (Home Equity Line of Credit)
- How credit scores are calculated — five factors with exact weightings:
  - Payment history: 35% (single biggest factor — one missed payment can drop a score 50–100 points)
  - Amounts owed / credit utilization: 30% (keeping utilization below 30% is the rule, below 10% is optimal)
  - Length of credit history: 15%
  - New credit / hard inquiries: 10%
  - Credit mix: 10%
- Credit score ranges with what each means for loan eligibility and interest rates: Poor (<580), Fair (580–669), Good (670–739), Very Good (740–799), Exceptional (800+)
- Debt payoff strategies side-by-side comparison:
  - Debt Avalanche: pay minimums on all debts, throw extra money at the highest interest rate — mathematically optimal, saves the most money
  - Debt Snowball: pay minimums on all debts, throw extra money at the smallest balance — psychologically satisfying, builds momentum
- Debt payoff calculator: user enters each debt (balance, interest rate, minimum payment), tool shows payoff date and total interest paid under both Avalanche and Snowball, side by side
- Credit utilization strategy: how to game utilization scores by paying balances before statement closing date, and requesting credit limit increases

What the user accomplishes: They know exactly what their debt is costing them in real dollars, which payoff strategy saves more, and how to improve their credit score without closing accounts or gimmicks.

---

INVESTING (/fun/investing)
Purpose: Build investing fundamentals from zero — what investment vehicles exist, how markets work, and how to start investing intelligently rather than reactively.

Shows:
- Asset classes explained with risk level, how returns are generated, and tax treatment:
  - Stocks (equity ownership, dividends + capital appreciation, long-term cap gains tax)
  - Bonds (debt instrument, coupon interest, ordinary income tax)
  - ETFs (basket of securities, low cost, tax-efficient via in-kind redemptions)
  - Mutual Funds (pooled vehicle, active vs. passive, higher expense ratios)
  - REITs (real estate exposure without direct ownership, high dividend yield)
  - Commodities (gold, oil, inflation hedge)
  - Cash Equivalents (money market, T-bills, HYSAs)
- How the stock market works: exchanges (NYSE, NASDAQ), market hours, order types (market order — executes immediately at current price, limit order — executes only at specified price or better, stop-loss — triggers a sell if price drops to a set level), bid-ask spread explained
- Index funds vs. actively managed funds with SPIVA data: over 15 years, 80%+ of actively managed funds underperform their benchmark index. Expense ratio drag — a 1% expense ratio on a $100,000 portfolio costs $30,000+ over 20 years in lost compounding
- Dollar-cost averaging: the mechanics (invest a fixed dollar amount on a fixed schedule regardless of price), the psychology (removes the paralysis of trying to pick the right moment), and a simulation chart showing DCA vs. lump sum performance over 20 years
- How to start investing step-by-step: open the right account type first (401k to get match → IRA → taxable brokerage), what to buy first (low-cost total market index fund), how much to invest, how to automate contributions so it requires no willpower

What the user accomplishes: They go from feeling confused and intimidated by investing to having a clear, data-supported first investing plan they can execute this week.

---

PORTFOLIO (/fun/portfolio)
Purpose: Teach the user how to build a properly structured, diversified portfolio — asset allocation, rebalancing, and the principles of portfolio construction used by institutional investors.

Shows:

Learn tab — four sub-sections:
- MODELS: Four standard portfolio models with exact allocation breakdowns, expected annual return, historical volatility, and worst historical 12-month loss:
  - Conservative (20% stocks / 70% bonds / 10% cash): ~5% expected return, low volatility, max drawdown ~-10%
  - Moderate (50% stocks / 40% bonds / 10% alternatives): ~7% expected return, medium volatility, max drawdown ~-25%
  - Balanced (70% stocks / 20% bonds / 10% alternatives): ~9% expected return, higher volatility, max drawdown ~-35%
  - Aggressive Growth (90% stocks / 10% alternatives): ~10.5% expected return, high volatility, max drawdown ~-50%
  - DiversificationChart (AreaChart) showing how adding uncorrelated assets reduces portfolio volatility over time
  - TimeInMarketChart (horizontal BarChart) showing 20-year wealth accumulation for fully invested vs. timing attempts
  - Rebalancing strategies: annual rebalancing vs. threshold rebalancing (rebalance when any asset class drifts more than 5% from target), tax-efficient rebalancing techniques (rebalance with new contributions first, use tax-loss harvesting, rebalance inside tax-advantaged accounts)

- ASSET CLASSES: 12 clickable asset class cards, each with RiskDots (visual risk level indicator), expandable detail panel showing:
  - Expected return range
  - Volatility level
  - Tax treatment note (capital gains, ordinary income, UBTI, etc.)
  - Best for: which investor profile this asset class suits
  - Watch out for: the key risk or mistake associated with this asset class
  - Asset classes covered: Cash/CDs, US Bonds, International Bonds, US Large Cap, US Small Cap, International Developed, Emerging Markets, REITs, Commodities, Gold, Private Equity, Crypto

- ASSET LOCATION: 9 expandable rows showing which account type is optimal for each asset class (tax efficiency optimization):
  - Best account: where to hold it for maximum tax efficiency
  - Avoid: which account type creates an unnecessary tax drag
  - Why: plain-language explanation of the tax logic
  - Key insight: bonds and REITs go in tax-deferred accounts (Traditional IRA/401k), Roth IRA is best for highest-growth assets, taxable brokerage is best for tax-efficient assets like index ETFs

- PRIORITY LADDER: 6-step investment priority order with expandable why/how/numbers for each step:
  1. Emergency fund (3–6 months expenses in HYSA) — foundation before any investing
  2. Employer 401k match (100% instant return — always capture the full match first)
  3. Pay off high-interest debt (>6–7% interest rate — guaranteed return beats market risk)
  4. HSA if eligible (triple tax advantage — pre-tax in, tax-free growth, tax-free withdrawals for medical)
  5. Max tax-advantaged accounts (max IRA, then back to 401k up to IRS limit)
  6. Taxable brokerage (invest additional savings in tax-efficient ETFs)

Calculate tab — two calculators:
- DRAWDOWN RECOVERY: slider inputs for loss percentage (10%–90%), shows required recovery percentage to break even, historical time to recovery for similar drawdowns, and a grid of 6 historical market crashes with drawdown depth and recovery timeline
- DCA vs LUMP SUM: four sliders (total investment amount, time horizon, expected return, monthly investment), calculates final value under DCA vs. investing everything immediately with side-by-side results

What the user accomplishes: They understand how to build and maintain an institutional-quality portfolio matched to their timeline, risk tolerance, and tax situation — and they have calculators to stress-test any scenario.

---

INSURANCE (/fun/insurance)
Purpose: Explain every type of insurance that belongs in a complete financial plan — what each covers, how much to carry, and how to evaluate policies without being oversold.

Shows:
- Life Insurance: term vs. whole vs. universal — what each type is, how premiums are calculated, when each makes sense. How to calculate how much coverage you need using the DIME method: Debt (all outstanding debts) + Income replacement (annual income × years until retirement) + Mortgage (remaining balance) + Education (cost to fund children's education). Life insurance needs calculator with those exact inputs.
- Health Insurance: deductibles (what you pay before insurance kicks in), copays (fixed amount per visit), coinsurance (your percentage share after deductible), out-of-pocket maximum (the most you can pay in a year), HSA-eligible HDHP plans (High Deductible Health Plans that allow Health Savings Account contributions), how to compare two plans by calculating total cost at low, medium, and high healthcare usage scenarios
- Disability Insurance: short-term (covers days 1–90 typically) vs. long-term (covers beyond 90 days, most important), own-occupation definition (pays if you can't do YOUR specific job) vs. any-occupation (only pays if you can't do ANY job — much harder to collect), why disability is statistically more likely than death before age 65 (1 in 4 workers will become disabled), how much to carry (60–70% of gross income)
- Umbrella Insurance: what it covers (excess liability beyond auto and homeowners policy limits), when you need it (anyone with meaningful assets or income), how it layers over existing policies, typical cost ($150–300/year for $1M of coverage)
- Homeowners and Renters Insurance: replacement cost vs. actual cash value (replacement cost pays what it costs to replace the item new — always choose this), what standard policies exclude (floods, earthquakes, sewer backup — require separate riders)
- Life insurance needs calculator embedded directly in the insurance section

What the user accomplishes: They know exactly which types of insurance they need, how much coverage is appropriate for their specific situation, and how to evaluate policies without being oversold expensive permanent life insurance when term is almost always the right choice.

---

ESTATE PLANNING (/fun/estate)
Purpose: Demystify estate planning — teach the user what documents they need, exactly what each document does, and what happens to their assets and family if they die without these documents in place.

Shows:
- The four core documents everyone needs, explained:
  1. Last Will and Testament: names who gets your assets, names guardians for minor children, names an executor to manage the process. Without a will: the state decides who gets your assets (intestate succession) and a court appoints a guardian for your children — not necessarily who you would choose.
  2. Durable Power of Attorney: names someone to make financial decisions on your behalf if you become incapacitated. Without this: family members must go to court to get a conservatorship, which is slow, expensive, and public.
  3. Healthcare Proxy / Advance Healthcare Directive (Living Will): names someone to make medical decisions for you and documents your wishes about life-sustaining treatment. Without this: hospitals default to keeping you alive by all means regardless of your wishes, and family members may disagree.
  4. Beneficiary Designations: these override your will on retirement accounts and life insurance — whoever is named as beneficiary gets the money regardless of what the will says. Common fatal mistakes: naming a minor as beneficiary (court must manage the money), leaving beneficiary blank (goes through probate), not updating after divorce.
- Probate explained: the court-supervised process of distributing assets named in a will. Takes 6 months to 2+ years, costs 3–7% of the estate in fees, is public record. A Revocable Living Trust avoids probate entirely.
- Types of trusts:
  - Revocable Living Trust: you control it during your life, assets pass to beneficiaries without probate, can be changed at any time. Best for most people.
  - Irrevocable Trust: once created it cannot be changed, but assets are protected from creditors and may reduce estate tax exposure.
  - Testamentary Trust: created inside a will, goes through probate but then controls how money is distributed to beneficiaries (useful for minor children).
- Estate tax thresholds: federal estate tax exemption for 2026 ($13.61M per person, $27.22M per couple), state-level estate taxes (12 states have their own estate tax with lower exemptions), portability between spouses
- Life stages — which documents are urgent at which age:
  - Age 18: Healthcare directive and POA (the moment someone turns 18, parents lose legal authority)
  - Age 25–35 with no dependents: basic will + beneficiary designations + POA + healthcare directive
  - Age 35+ with children: all of the above plus a living trust and life insurance
  - Age 55+: all of the above plus long-term care planning and advanced tax strategies

What the user accomplishes: They understand exactly which estate documents they need right now based on their life stage, and they understand the real human consequences of not having them — not just financial consequences.

---

RETIREMENT (/fun/retirement)
Purpose: Teach the complete retirement savings system — not just that you should save, but exactly how every account type works and how to optimize across all of them.

Shows:
- The retirement account universe — each explained with 2026 contribution limits, tax treatment (pre-tax vs. Roth vs. after-tax), withdrawal rules, and who each is designed for:
  - Traditional 401(k): pre-tax contributions reduce taxable income now, taxable on withdrawal, $23,500 employee limit in 2026 (+$7,500 catch-up over age 50)
  - Roth 401(k): after-tax contributions, tax-free growth and withdrawals, same contribution limits as Traditional, no income limits
  - Traditional IRA: pre-tax if income is below deductibility limit, $7,000 limit in 2026 (+$1,000 catch-up over 50), taxable on withdrawal
  - Roth IRA: after-tax, tax-free growth and withdrawals, $7,000 limit, income limits apply ($161K single / $240K married in 2026 for full contribution)
  - SEP IRA: for self-employed, up to 25% of compensation or $69,000, employer only
  - SIMPLE IRA: for small businesses with employees, $16,000 employee limit in 2026
  - HSA: triple tax advantage — pre-tax contributions, tax-free growth, tax-free withdrawals for medical expenses
- The power of employer match: illustrated with a concrete example — if your employer matches 100% of the first 6% of your salary and you make $75,000, not contributing enough to get the full match means leaving $4,500/year on the table. Over 30 years at 7% growth, that's $425,000 left behind.
- Roth conversion ladder: how to convert Traditional IRA money to Roth during low-income years (early retirement, career break, business loss year) at a lower tax rate than you would have paid during peak earning years
- Required Minimum Distributions (RMDs): what they are (mandatory withdrawals from tax-deferred accounts starting at age 73 under current law), how they're calculated (account balance divided by IRS life expectancy factor), what happens if you miss them (50% penalty on the amount not withdrawn), and strategies to reduce future RMDs (Roth conversions early, qualified charitable distributions after 70½)
- Sequence of returns risk: why the first 5–10 years of retirement are the most dangerous — a bear market early in retirement forces you to sell shares at low prices to fund living expenses, permanently reducing the number of shares that can recover when the market rebounds. Strategies: maintain a 1–2 year cash buffer, use a bucket strategy (short/medium/long term buckets)
- 4% withdrawal rule: the Bengen study — a portfolio of 50–75% stocks has historically supported 4% annual withdrawals (adjusted for inflation) for 30+ years without running out. When it works (30-year horizon, diversified portfolio). When it can fail (unusually high starting valuations, longer than 30-year retirement, concentrated portfolio).

What the user accomplishes: They understand the full retirement savings system with 2026 numbers, know exactly which accounts to fund in which order, and understand the key risks that can derail even a well-funded retirement plan.

---

MAJOR PURCHASES (/fun/major-purchases)
Purpose: Give the user a complete financial framework for the largest non-investment purchases in their life — homes and vehicles — so these decisions are made with data, not emotion.

Shows:

Learn tab:
- HOME BUYING section: Four affordability rules every buyer must know:
  1. Housing payment should not exceed 28% of gross monthly income (PITI — Principal, Interest, Taxes, Insurance)
  2. Total debt payments should not exceed 36% of gross income (the 36% back-end DTI ratio lenders use)
  3. Put down 20% to avoid PMI (Private Mortgage Insurance — an extra monthly cost of 0.5–1.5% of the loan amount annually that builds zero equity)
  4. Have 3–6 months emergency fund separate from the down payment before buying
  - Five mortgage types explained: 30-year fixed (most popular — predictable payment, higher rate), 15-year fixed (lower rate, larger payment, builds equity fast), 5/1 ARM (fixed for 5 years then adjusts — risky if rates rise), FHA loan (3.5% down for lower credit scores, permanent MIP), VA loan (0% down for veterans, no PMI, best deal in mortgages)
  - Seven hidden costs of homeownership: property taxes (1–2% of value annually), PMI (if under 20% down), HOA fees (if applicable), homeowners insurance, maintenance and repairs (budget 1–2% of home value annually — a $400K house costs $4,000–8,000/year in maintenance), closing costs (2–5% of purchase price paid at closing), moving costs

- VEHICLE section: New vs. Used vs. CPO (Certified Pre-Owned) pros/cons grid:
  - New: full warranty, latest features, can be financed easily — but depreciates 15–25% in year one
  - Used: lower price, depreciation already absorbed — but unknown history, potential hidden issues
  - CPO: manufacturer-inspected used vehicle with extended warranty — middle ground between new and used
  - Six true costs of vehicle ownership: depreciation (the largest cost — new cars lose 60% of value in 5 years), auto insurance, fuel, scheduled maintenance, financing interest, and annual registration
  - Five buying rules: negotiate out-the-door price (not monthly payment), get pre-approved from your bank before stepping in the dealership, research true market value on KBB and Edmunds first, never buy dealer extended warranties (they're overpriced — set that money aside yourself), understand total 5-year cost, not sticker price

- GOALS section: Sinking fund 3-step visual: name the goal → set the target date → divide total by months remaining = monthly savings amount. Six goal types with the right savings vehicle for each: emergency fund (HYSA), vacation (HYSA), car (HYSA), home down payment (HYSA or conservative brokerage), education (529 plan), wedding (HYSA).

Calculate tab:
- MORTGAGE CALCULATOR: inputs — home price, down payment percentage, annual interest rate, loan term (15 or 30 year), annual property tax rate, annual insurance cost. Outputs — monthly principal & interest, monthly property tax, monthly insurance, monthly PMI (if applicable), total monthly PITI payment, 28% affordability indicator (shows if payment is over or under 28% of needed income), total interest paid over the life of the loan, estimated closing cost range (2–5% of purchase price). Flags whether the payment meets the 28% rule with color-coded status.
- GOAL SAVINGS CALCULATOR: inputs — target amount, current savings toward the goal, expected annual return. Outputs — time to goal at current pace, and monthly savings needed to hit the goal in 1 year, 2 years, 3 years, and 5 years.

Resources tab: links to trusted external tools and further reading on home buying and vehicle purchases.

What the user accomplishes: They approach the largest purchases of their life with a complete financial framework — knowing the true cost, the right financing, the hidden expenses, and the exact monthly savings needed to be ready when the time comes.

---

BUY, RENT, OR LEASE (/fun/buy-rent-lease)
Purpose: Give the user a complete financial comparison framework for the most consequential financial decisions most people make — whether to buy or rent a home, and whether to buy or lease a vehicle.

Shows:

Housing tab — four sub-views:
- LEARN sub-view: the key variables that determine whether buying beats renting for any specific person — price-to-rent ratio (if annual rent exceeds 5% of purchase price, renting is likely cheaper), time horizon (buying only wins if you stay 5+ years to recoup transaction costs), opportunity cost of the down payment (what $80,000 down would grow to if invested instead), real tax benefits of homeownership (mortgage interest deduction only helps if you itemize, which most people don't after the 2017 tax law), and the hidden cost of maintenance that renters never face
- BREAK-EVEN CALCULATOR sub-view: inputs — home price, down payment %, interest rate, loan term, current monthly rent, expected home appreciation rate, expected rent increase rate per year, expected investment return on the down payment if rented. Outputs — a 30-year LineChart comparing cumulative net cost of buying vs. cumulative net cost of renting with a ReferenceLine annotation marking the exact year where buying becomes the cheaper option (break-even year). Also shows final equity built vs. final investment account value under the renting scenario.
- PROS & CONS sub-view: structured comparison of buying vs. renting across: equity building, monthly payment stability, flexibility to move, maintenance responsibility, tax benefits, and protection from landlord decisions
- WHEN TO CHOOSE sub-view: decision framework — buy when you plan to stay 5+ years, have 20% down or can absorb PMI, have stable income, and value equity building over flexibility. Rent when career flexibility matters more, you're in a high price-to-rent ratio market, you're saving toward a down payment, or your timeline is uncertain.

Auto tab — three sub-views:
- LEARN sub-view: how car ownership economics work — new cars depreciate 15–25% in year one and 50–60% over 5 years, making them one of the worst financial assets. Leasing is essentially renting the depreciation of the vehicle. Buying used means someone else absorbed the steepest depreciation. Total cost of ownership is the only metric that matters — not monthly payment.
- BUY VS. LEASE CALCULATOR sub-view: inputs — vehicle price, down payment, loan interest rate, loan term in months, estimated lease monthly payment, lease term, annual mileage. Outputs — total cost of buying over the ownership period vs. total cost of leasing including disposition fees and excess mileage charges, with a clear dollar comparison and which option is cheaper for the user's specific inputs.
- WHEN TO CHOOSE sub-view: buy when you drive more than 15,000 miles per year (leases charge per mile over the limit), keep cars for 7+ years, want to build equity, or modify your vehicle. Lease when you always want the latest model, drive under 12,000 miles per year, want the lowest monthly payment, and the vehicle is for business use (lease payments may be deductible).

Principles tab:
- Six universal financial frameworks that apply to any buy/rent/lease decision: total cost thinking (monthly payment is never the right metric), opportunity cost (every dollar deployed has an alternative use), time horizon alignment (the right choice depends entirely on how long you'll use it), liquidity preference (buying ties up capital, renting preserves flexibility), tax efficiency (understand the after-tax cost of every option), and lifestyle congruence (the cheapest financial choice isn't always right if it creates daily friction)
- Four common mistakes: optimizing for monthly payment instead of total cost, underestimating transaction and maintenance costs, making permanent financial decisions based on temporary life situations, and ignoring opportunity cost of capital

What the user accomplishes: They make the buy vs. rent and buy vs. lease decision based on their actual numbers and timeline rather than conventional wisdom, social pressure, or what a salesperson recommends.

---

LIFE EVENTS (/fun/life-events)
Purpose: Provide a complete financial playbook for every major life event — so when something big happens, the user knows exactly what to do financially and in what order.

Shows:
- Life event cards: Getting Married, Having a Child, Buying a Home, Starting a Business, Job Change / Career Transition, Divorce, Approaching Retirement, Receiving an Inheritance or Windfall, Death of a Spouse, Becoming an Empty Nester
- Each event expands into a full financial guide covering:
  - What changes in your financial picture immediately
  - Action items for the first 30 days
  - Action items for the first year
  - Tax implications of this life event
  - Insurance changes needed (new coverage, removed coverage, updated beneficiaries)
  - Estate document updates required
  - Common financial mistakes people make at this life stage and how to avoid them

Getting Married: combine or separate finances discussion (pros and cons of both), update beneficiary designations on all accounts and insurance policies, update estate documents (new will, new POA, new healthcare directive), file taxes jointly vs. separately analysis, review health insurance options (who has the better employer plan?), set shared financial goals

Having a Child: calculate true cost of childcare in your area, open 529 college savings plan and start contributing even small amounts early (the math is dramatic), purchase or increase life insurance (both parents), update will to name a guardian, add child to health insurance within 30 days of birth

Job Change: 401k decision — roll it over to new employer or IRA (don't cash it out), negotiate benefits before accepting the offer not after, check vesting schedule (don't leave unvested employer match on the table), COBRA vs. new employer health insurance comparison, tax impact of signing bonus

Divorce: update every beneficiary designation immediately (ex-spouse is still named on most accounts), understand QDRO (Qualified Domestic Relations Order) for splitting retirement accounts without penalty, tax implications of alimony and child support under current law, refinancing to remove ex-spouse from mortgage

Receiving an Inheritance: the 6-month rule (don't make any major financial decisions for 6 months), pay off high-interest debt first, fund emergency account to full target, then invest the remainder per your investment plan. Tax treatment of inherited assets — most inherited assets receive a stepped-up cost basis eliminating embedded capital gains.

What the user accomplishes: When a major life event happens — especially an unexpected or emotional one — they have a concrete financial checklist to execute rather than trying to figure it out while overwhelmed.

---

FAMILY PLANNING (/fun/family-planning)
Purpose: Help users financially plan for expanding their family — the true costs, the savings vehicles, the insurance needs, and the estate planning implications of having children.

Shows:
- True cost of raising a child to age 18: USDA estimate of approximately $300,000 (not including college), broken down by category — housing (29%), food (18%), childcare and education (16%), transportation (15%), healthcare (9%), clothing (6%), other (7%)
- Childcare cost context: national average for infant daycare is $1,200–2,000/month depending on location. Many families spend more on childcare than on their mortgage in the early years.
- 529 College Savings Plan explained in full: how they work (state-sponsored investment accounts), contribution limits (no annual federal limit, but gift tax rules apply above $18,000/year), tax advantages (contributions grow tax-free, withdrawals tax-free for qualified education expenses), who controls the account (the account owner, not the child — you can change beneficiaries), what qualified expenses include (tuition, fees, books, room and board, computers), what happens if child doesn't go to college (can change beneficiary to another family member, withdraw for non-education expenses with penalty and income tax on growth only, or roll over to Roth IRA under the SECURE 2.0 Act rules), 529 projection calculator showing how much monthly contributions at what age generate what college fund by age 18
- Life insurance with dependents: having children fundamentally changes the insurance calculation. Use the DIME method (Debt + Income replacement × years until youngest child is independent + Mortgage + Education fund) to calculate how much coverage each parent needs. Two-income families: both parents need coverage. Stay-at-home parent: also needs coverage (cost to replace their labor — childcare, household management — is substantial).
- Estate planning with minor children — why it cannot wait: a will is the only legal document where you name a guardian for your children. Without a will, a judge decides who raises them. Setting up a testamentary trust inside the will ensures children don't receive a large inheritance at age 18 — instead the trust controls distributions at specific ages or milestones. For larger estates, a revocable living trust is even better.

What the user accomplishes: They plan financially for their family's growth in advance rather than being financially blindsided by costs they could have prepared for.

---

TAX — FUN MODULE (/fun/tax-planning)
Purpose: The FUN platform's engaging visual tax education module — making tax concepts clear and actionable without requiring a CPA to decode.

Shows:
- 2026 federal tax brackets visualized as an interactive bar chart — demonstrating with a specific example that having income in the 22% bracket does NOT mean all income is taxed at 22%. The first $11,600 is taxed at 10%, the next slice at 12%, and only income above the 22% threshold is taxed at that rate. Effective rate vs. marginal rate made completely clear.
- Tax-advantaged accounts explained simply with the after-tax math:
  - Traditional 401k/IRA: contribute $500 pre-tax, it only costs $380 out of pocket if you're in the 24% bracket. Tax now is deferred to retirement.
  - Roth IRA: contribute $500 after-tax. Pay the tax now. Every dollar of growth and every dollar of withdrawal is tax-free forever.
  - HSA (Health Savings Account): the only triple-tax-advantaged account in existence — contributions are pre-tax (or tax-deductible), growth is tax-free, withdrawals for medical expenses are tax-free. After age 65 can withdraw for any reason like a Traditional IRA.
- Capital gains tax: short-term capital gains (assets held less than 1 year) taxed as ordinary income. Long-term capital gains (held 1+ year) taxed at 0%, 15%, or 20% depending on income. Concrete dollar example: selling $10,000 of stock bought for $6,000 — $4,000 gain. Short-term: $880 in tax at 22%. Long-term: $600 at 15%. Holding one more year saved $280 on one trade.
- Tax-loss harvesting step-by-step visual guide: what it is (selling investments that have dropped in value to generate a tax loss), how to use the loss (offset capital gains or deduct up to $3,000 of ordinary income per year), what to watch out for (the wash-sale rule — you can't buy back the same or substantially identical security within 30 days before or after the sale or the loss is disallowed)
- Standard vs. itemized deduction comparison for 2026: standard deduction is $14,600 for single, $29,200 for married. Most people don't itemize after the 2017 tax law increase. But if mortgage interest + state/local taxes + charitable donations exceed the standard deduction, itemizing saves money.
- Most commonly missed deductions checklist: student loan interest (up to $2,500 deductible even without itemizing), home office deduction for self-employed, self-employed health insurance premium deduction (100% deductible), educator expense deduction ($300 for teachers), HSA contribution deduction, IRA contribution deduction

What the user accomplishes: They understand how the tax system actually works (not how they assumed it worked), know which accounts reduce their taxes most, and have a concrete list of deductions to check before filing.

---

RESOURCES (/fun/resources)
Purpose: Curated library of external financial education resources — vetted books, websites, and tools that go deeper than the Planora platform itself.

Shows:
- Book recommendations organized by topic with brief description of what each book covers and who it's best for:
  - Personal Finance Foundations: The Total Money Makeover (Ramsey), I Will Teach You to Be Rich (Sethi), The Millionaire Next Door (Stanley)
  - Investing: The Intelligent Investor (Graham), A Random Walk Down Wall Street (Malkiel), The Little Book of Common Sense Investing (Bogle)
  - Behavioral Finance: Thinking Fast and Slow (Kahneman), Morgan Housel's The Psychology of Money, Predictably Irrational (Ariely)
  - Real Estate: Rich Dad Poor Dad (Kiyosaki — with appropriate caveats), The Book on Rental Property Investing (Turner)
  - Business / Advanced: Die With Zero (Perkins), The Millionaire Fastlane (DeMarco)
- Trusted free websites and tools: IRS.gov (tax guidance), SSA.gov (Social Security estimates — every worker should create an account), CFPB (Consumer Financial Protection Bureau — unbiased consumer financial guidance), SEC Investor Education (investor.gov), NerdWallet calculators, Bogleheads.org forum
- Government resources: how to get your free annual credit reports (AnnualCreditReport.com — the only federally mandated free source), how to check your Social Security earnings record, how to find a fee-only fiduciary advisor (NAPFA.org, CFP Board's advisor search)

What the user accomplishes: They have a trusted, curated starting point for going deeper on any financial topic — and they know which external sources are trustworthy vs. commercially biased.

---

LEARNER'S LIBRARY (/fun/learners-library)
Purpose: A structured self-study curriculum — all FUN content organized as a sequential learning library for users who want to work through financial education systematically rather than jumping around by topic.

Shows:
- All education modules organized as a numbered curriculum with clear progression from foundational to advanced
- Progress tracking — which modules are completed, in progress, or not yet started
- Time estimates for each module
- Recommended learning sequence for different user profiles: the "Starting from Zero" path, the "I have debt" path, the "Ready to invest" path, the "Approaching retirement" path

What the user accomplishes: They follow a structured financial education curriculum at their own pace with clear progress tracking.

---

===========================================================
WEALTH COUNSEL — ADVISOR-CLIENT PLATFORM
===========================================================

Purpose: The platform for finding, evaluating, and connecting with qualified financial advisors. Teal accent (#00B4C6) throughout. Trust-forward design — advisor cards and profiles feel premium and credential-verified. Client-facing — approachable but professional.

---

WEALTH COUNSEL HUB (/wealth-counsel-hub)
Purpose: The landing page for the Wealth Counsel platform. Establishes why working with a verified advisor matters and how Wealth Counsel closes the access gap.

Shows:
- Four institutional data points that make the case for advisor access:
  - $350K: average wealth gap between those with a fiduciary advisor and those without (Vanguard)
  - 3%: annual return added by a good advisor through behavioral coaching alone (Vanguard Advisor's Alpha study)
  - 74%: of Americans lack access to a fee-only fiduciary — Wealth Counsel closes that gap (NAPFA)
  - $0: cost to browse and compare verified CFP professionals on Wealth Counsel
- Three philosophy cards: "Verified Credentials, Not Sales Pitches" (every advisor shows their actual credentials — CFP, CFA, ChFC), "Matched to Your Goals, Not a Zip Code" (find the right advisor for your situation, not just the closest one), "Fee Transparency Before You Commit" (fee structure is disclosed upfront — no surprises)
- Sample advisor profile card showing a Wealth Strategist with credential badge, rating, client count, years of experience, and specialty areas
- CTA into the full Wealth Counsel platform

What the user accomplishes: They understand why advisor access matters, why most people don't have it, and how Wealth Counsel solves that.

---

WEALTH COUNSEL — MAIN PLATFORM (/wealth-counsel)
Purpose: The full four-tab advisor finding and preparation system.

ADVISOR DIRECTORY tab:
- Searchable, filterable directory of verified financial advisors
- Each advisor card shows: name, photo, full credential list (CFP, CFA, ChFC, etc.), firm name, location, years of experience, client rating (star rating), total number of clients, fee structure (AUM-based percentage, flat annual fee, hourly rate, or commission-free), and two to three specialty tags (retirement planning, business owners, real estate, tax strategy, divorce, estate planning, etc.)
- Filter sidebar: filter by specialty, location or virtual-only, minimum account size they work with, fee type, credentials held
- Click any advisor opens their full profile page: professional bio, complete services list, detailed fee schedule with example calculations, client testimonials, what their typical client looks like (so users can self-select for fit)

MATCH ME tab:
- Interactive matching wizard — the user answers questions to find their best-matched advisors:
  - What do you most need help with? (retirement planning, investment management, tax strategy, estate planning, debt management, business finances, general planning)
  - What is your approximate investable asset level?
  - Do you prefer to meet in-person, virtually, or either?
  - What fee structure are you most comfortable with?
  - Do you need an advisor who specializes in a specific life situation? (business owner, divorcee, recently widowed, inheritance recipient, federal employee, military, medical professional)
- AI-powered matching returns the top three advisor matches with a compatibility score for each, and a plain-language explanation of why each is a strong match
- Side-by-side comparison of the three matched advisors across specialty alignment, fee structure, and credentials

PREPARATION HUB tab:
- A complete guide to everything a user should do before their first advisor meeting:
  - Documents to gather: last 2 years of tax returns, all account statements (brokerage, retirement, bank), all insurance policy declarations, most recent Social Security statement (from SSA.gov), existing estate documents (will, trusts, POA), mortgage statement, any business financial statements if applicable
  - Questions to ask any advisor before hiring them:
    1. Are you a fiduciary at all times? (Some advisors are only fiduciaries sometimes — this is a red flag)
    2. How are you compensated? (Get the exact fee schedule in writing)
    3. What is your investment philosophy? (Should align with yours)
    4. How often will we meet and communicate?
    5. Who else at your firm would handle my account?
    6. What credentials do you hold and how do you stay current?
    7. Have you ever been disciplined by a regulator? (Check on FINRA BrokerCheck)
  - Red flags to watch for: can't clearly explain their fee structure, recommends high-commission products like whole life insurance or variable annuities in the first meeting, won't commit to fiduciary duty in writing, pressures you to make decisions quickly, can't show credentials when asked
  - First meeting agenda template: personal financial overview, current goals and timeline, biggest concerns and challenges, overview of existing accounts and policies, discussion of financial plan scope

MY ADVISORY FOLDER tab:
- Personal document and notes organizer for managing the advisor relationship over time
- Upload and store relevant financial documents securely
- Notes section for recording meeting summaries and action items
- Goal tracking panel to document and monitor financial goals between meetings
- Meeting history log with dates and key discussion points

What the user accomplishes: They find a qualified, verified advisor matched to their specific financial situation, arrive at their first meeting completely prepared and knowing what to ask, and have a system to manage the relationship over time. Instead of choosing an advisor based on a referral or advertising, they choose based on credentials, fee transparency, and specialty alignment.

---

===========================================================
PLANORA AI — FULL-SCREEN CHAT (/planora-ai)
===========================================================

Purpose: A dedicated full-screen AI financial assistant powered by Groq (llama-3.3-70b-versatile model, free tier). Users can ask any financial question and receive detailed, intelligent answers in real time.

Shows:
- Full-screen dark interface with Planora gold branding — the only full-screen page that doesn't use the main layout sidebar
- Streaming AI responses that appear word-by-word in real time via Server-Sent Events (SSE) — the response feels live and immediate, not like waiting for a complete answer to load
- System prompt configures the AI as a financial planning expert covering: budgeting, investing, retirement, taxes, insurance, real estate, market concepts, estate planning, and general personal finance
- Chat history preserved for the full session — scroll back to reference earlier answers
- Suggested starter questions displayed on the empty state to help users who don't know where to begin
- Send button and Enter key both submit questions

Technical: Backend server (`server/index.js`) receives the message, calls Groq API with the conversation history, streams the response back as SSE. Groq uses OpenAI-compatible API format; the server converts it to Anthropic SSE format so the frontend works without changes. API key stored as `GROQ_API_KEY` on the server — never exposed to the browser.

What the user accomplishes: They get detailed, personalized financial guidance at any time of day without needing to book an appointment, pay for premium access, or search through multiple articles. A user can describe their exact situation — "I'm 34, make $95,000, have $47,000 in student debt at 6.2%, and just got a $15,000 bonus — what should I do with it?" — and receive a specific, reasoned, prioritized answer instantly.

---

===========================================================
NAVIGATION ASSISTANT — FLOATING CHAT WIDGET
===========================================================

Purpose: A persistent floating chat button that appears in the bottom-right corner on every page of the platform. It's the "where do I go?" helper — when a user isn't sure which section covers what they're looking for, they describe it in plain English and the assistant routes them to the right place instantly.

Shows:
- Gold circular button with a sparkle (✦) icon fixed to the bottom-right corner of every page — visible at all times without interfering with page content
- Clicking the button opens a compact dark chat panel that slides up above the button
- The chat panel has: a header ("Planora Assistant"), a close button, a scrollable message area, and a text input with send button
- The assistant responds with: a direct answer to the user's question, and if the question is navigation-related, a clickable link card showing the section name and a "Go there →" button that navigates directly to the page
- The assistant uses a built-in route knowledge base covering every section of the platform — it matches keywords in the user's message to the right destination
- Example interactions:
  - User types "where do I find a financial advisor?" → Assistant responds with an explanation of Wealth Counsel and a link to /wealth-counsel
  - User types "I want to learn about index funds" → Assistant routes to /fun/investing
  - User types "how do I calculate my mortgage payment?" → Assistant routes to /fun/major-purchases (mortgage calculator tab)
  - User types "what's the market doing today?" → Assistant routes to /dashboard
  - User types "I want to understand my tax bracket" → Assistant routes to /fun/tax-planning
- The assistant's knowledge base covers every route in the platform: all FUN modules, Wealth Counsel, all Terminal sections, Planning hub, Markets hub, Business Planning, The Feed, Calculators, Planora AI, Economic Calendar, and more
- All navigation happens within the single-page app — no full page reload

Technical: Built as `NavAssistant.jsx`, rendered inside `App.jsx` so it persists across all routes. Uses local keyword matching against the ROUTES array — no external API call needed for navigation assistance. The widget is purely client-side and instant.

What the user accomplishes: They never get lost in the platform. No matter where they are or what they're trying to do, they can describe it in plain English and be taken directly to the right tool within seconds. This removes the most common friction point in complex platforms — users who have a question but don't know where the answer lives.
