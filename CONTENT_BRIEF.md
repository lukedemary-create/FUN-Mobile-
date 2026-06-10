
# Planora V2 — Content & Function Brief
# What every section does, what it shows, what the user accomplishes with it

===========================================================
PLANORA TERMINAL — MARKET INTELLIGENCE PLATFORM
===========================================================

---

MARKET OVERVIEW
Purpose: Give the user an instant read on the entire market the moment they open the platform.

Shows:
- Live prices and daily change for all major indices: S&P 500, Nasdaq 100, Dow Jones, Russell 2000, and international benchmarks like FTSE 100, Nikkei 225, and DAX
- VIX (market fear index) with a plain-language label showing what the current reading means — low fear, elevated fear, or extreme fear
- 10-Year Treasury yield with its change from yesterday in basis points, because this drives mortgage rates, stock valuations, and credit costs
- Dollar Index (DXY) showing the strength of the US dollar against a basket of currencies, because a strong dollar affects multinational company earnings and commodity prices
- Crude oil price and gold price as macro sentiment indicators
- Top 5 biggest gaining stocks today with ticker, company name, price, and percentage up
- Top 5 biggest losing stocks today with the same fields
- Advance/Decline ratio showing how many stocks across the entire NYSE are up versus down today, which tells you if the market move is broad or concentrated in a few names
- New 52-week highs and new 52-week lows counts, another breadth indicator
- S&P 500 chart showing price history across any time range the user selects from 1 day to 5 years
- Fear and Greed Index scored 0-100 with historical readings from one week ago and one month ago so the user sees the trend in investor sentiment

What the user accomplishes: In under 60 seconds they know if today is a risk-on or risk-off market, which direction sentiment is moving, and whether the market move is broad-based or being driven by just a handful of large-cap stocks.

---

SECTOR AND INDUSTRY ANALYSIS
Purpose: Let the user see exactly where money is flowing inside the market — which sectors and industries are being bought and which are being sold.

Shows:
- All 11 S&P 500 sectors with their percentage return for any selected time period: today, this week, this month, 3 months, YTD, 1 year
- A breakdown inside each sector into its sub-industries — for example Technology breaks into Semiconductors, Software, Hardware, IT Services — so the user can see if the entire sector is moving or just one pocket of it
- Sector rotation chart showing which sectors are leading, weakening, lagging, or recovering using a four-quadrant momentum model — this is the same tool institutional portfolio managers use to understand where we are in the market cycle
- Relative strength of each sector versus the S&P 500 over time as a line chart, so a user can see whether a sector is outperforming or underperforming the broad market and for how long
- Top 5 stocks within each sector with their contribution to the sector's overall move, so the user knows if a sector's gain is being driven by one giant stock or by many stocks moving together
- Money flow data showing estimated net buying or selling in each sector over the past week

What the user accomplishes: They understand where institutional money is moving and can position their portfolio to align with or trade against those trends. They can spot early rotations from growth to value, from cyclicals to defensives, or from domestic to international before they become obvious.

---

PORTFOLIO ANALYTICS
Purpose: Give the user a complete picture of everything they own — how it is performing, how it is weighted, and how it compares to benchmarks.

Shows:
- Total portfolio value with today's dollar and percentage change
- Total return since inception in both dollars and percentage
- Annualized return (what the portfolio has averaged per year), which is more meaningful than total return alone because it accounts for how long the money has been invested
- Benchmark comparison showing portfolio return versus S&P 500 over multiple time periods — 1 month, 3 months, YTD, 1 year, 3 years — so the user knows if they are beating or lagging the market
- Full holdings table with every position: ticker, company name, sector, number of shares, average cost basis, current price, current market value, unrealized gain or loss in dollars, unrealized gain or loss in percentage, today's change, and position weight as a percentage of total portfolio
- Portfolio allocation breakdown by asset class, sector, geography, and market cap size — four different views of the same portfolio showing different dimensions of diversification
- Dividend income section showing which holdings pay dividends, the annual dividend amount from each, total annual dividend income, and the portfolio's overall dividend yield
- Transaction history log showing every buy and sell with date, ticker, shares, price paid, and total cost

What the user accomplishes: They see exactly what they own, how much they paid, what it is worth, whether they are beating the market, and where their portfolio is concentrated. They can identify positions where they have large unrealized gains or losses and make informed decisions about whether to hold, add, or trim.

---

RISK ANALYSIS
Purpose: Tell the user not just how their portfolio has performed but how much risk they took to get that performance, and where the vulnerabilities in their portfolio are.

Shows:
- Overall risk score from 0 to 100 with a plain-language explanation of what is driving it — for example "Your portfolio's risk is elevated primarily because of a 38% concentration in technology stocks and a beta of 1.4 versus the S&P 500"
- Portfolio Beta: how much the portfolio moves relative to the market. A beta of 1.4 means if the S&P drops 10%, this portfolio would be expected to drop 14%. Shown with a plain-language translation.
- Standard Deviation: how much the portfolio's value fluctuates over time, shown as an annualized percentage and compared to the S&P 500's standard deviation so the user can calibrate whether they are taking more or less volatility than the index
- Sharpe Ratio: the return per unit of risk. A Sharpe of 1.5 means the portfolio generates 1.5 units of return for every unit of risk. Compared to the S&P 500 over the same period.
- Max Drawdown: the worst peak-to-valley decline the portfolio has experienced, the date range when it happened, and how long the full recovery took
- Value at Risk (VaR): a statistical estimate of how much the portfolio could lose on its worst 5% of days — shown as a dollar amount — so the user understands the realistic downside in a bad market environment
- Correlation matrix: a grid showing how correlated each pair of holdings is on a scale from -1 to +1, revealing which positions move together (reducing diversification) and which move independently (providing true diversification)
- Sector concentration chart showing what percentage of the portfolio is in each sector versus the S&P 500's sector weights — highlighting any significant over or underweights
- Stress test results showing how the portfolio would have performed during five historical events: the 2008 financial crisis, the 2020 COVID crash, the 2022 rate hike cycle, the 2000 dot-com bust, and the 1987 Black Monday crash
- Monte Carlo simulation running 1,000 scenarios for the portfolio over 10, 20, and 30 years and showing the range of possible outcomes with projected values at the 10th percentile (bad scenario), 50th percentile (base case), and 90th percentile (good scenario)

What the user accomplishes: They understand the full risk profile of their portfolio beyond just its return history. They can see hidden concentration risks, understand how the portfolio might behave in a crisis, and decide whether the level of risk they are taking is appropriate for their situation.

---

TAX PLANNING CENTER
Purpose: Help the user minimize the tax drag on their investment portfolio and optimize their overall tax situation across accounts and income sources.

Shows:
- Tax lot viewer: for every holding, shows all the individual tax lots — the date each batch of shares was purchased, the number of shares in each lot, the cost basis per share, whether the lot is short-term (held less than 1 year, taxed as ordinary income) or long-term (held more than 1 year, taxed at lower capital gains rates)
- Unrealized gains and losses breakdown: separates all positions into four buckets — short-term gains, short-term losses, long-term gains, long-term losses — and shows the net tax impact if the user were to sell everything today
- Tax-loss harvesting opportunities: identifies positions currently sitting at a loss and calculates the tax savings from harvesting that loss, factoring in the wash-sale rule (you cannot buy back the same or substantially identical security within 30 days)
- Capital gains projection: estimates the total capital gains the user will realize this year based on sales already made and any planned future sales, and shows the estimated tax bill at both federal and state rates
- Roth conversion optimizer: takes the user's current income, their traditional IRA or 401k balance, their tax bracket, and their expected income in retirement, and calculates the optimal amount to convert to Roth this year to minimize lifetime taxes — shows a comparison of total taxes paid under different conversion strategies over 20-30 years
- Asset location recommendations: analyzes which of the user's holdings are most tax-efficient (ETFs, index funds, growth stocks) and which are least tax-efficient (high-dividend stocks, bonds, REITs that generate ordinary income), then recommends where to hold each type — tax-advantaged accounts like 401k and IRA for the least efficient, taxable accounts for the most efficient
- Estimated quarterly tax payments: for users with investment income, calculates the recommended quarterly estimated tax payment to avoid underpayment penalties
- Year-end tax planning checklist: as December approaches, shows specific actions the user should consider before year-end — harvesting specific losses, making charitable contributions, maximizing retirement contributions, deferring income

What the user accomplishes: They stop leaving money on the table through unnecessary taxes. They understand which holdings to sell first when they need cash, how to offset gains with losses, whether a Roth conversion makes sense this year, and how to structure their accounts for maximum after-tax wealth accumulation.

---

RETIREMENT PLANNING
Purpose: Show the user with precision whether they are on track for retirement and what specific actions will make the biggest difference.

Shows:
- Current retirement savings total across all accounts — 401k, IRA, Roth IRA, pension, and other retirement assets
- Projected retirement balance at the user's target retirement age under three return scenarios: conservative (5%), base case (7%), and optimistic (9%)
- The income their projected balance will generate in retirement, calculated using a 4% safe withdrawal rate, shown as a monthly income number so it is easy to compare to their current lifestyle expenses
- The gap or surplus: if the projected monthly income is below the user's stated retirement income goal, the gap is shown as a dollar amount and as a monthly contribution increase needed to close it
- Social Security integration: the user inputs their estimated Social Security benefit (pulled from their SSA.gov statement), and the tool adds this to their projected retirement income and shows the combined monthly retirement income
- Break-even age analysis for Social Security: shows the age at which taking Social Security early at 62 versus waiting until 67 versus waiting until 70 produces the same lifetime total — helping the user decide the optimal claiming strategy based on their health and financial situation
- 401k contribution optimizer: shows the user's current contribution rate, their employer match structure, and whether they are leaving any employer match on the table — the single highest return action available to most workers
- Required Minimum Distribution (RMD) calculator: for users approaching 73, shows the RMD they will be required to take from traditional retirement accounts each year and the estimated tax impact of those distributions
- Sequence of returns risk analysis: shows how devastating a market crash in the first 5 years of retirement can be compared to the same crash 15 years into retirement — and what strategies like bond tent or bucket strategy can reduce this risk
- Retirement income projection chart showing month-by-month projected account balance from today through age 90, with the balance declining as withdrawals begin at retirement

What the user accomplishes: They know with specificity whether they will have enough money to retire when they want to at the lifestyle they want. They know exactly which actions will have the biggest impact on closing any gap, and they understand the trade-offs in decisions like Social Security timing and Roth conversion.

---

WEALTH PLANNING
Purpose: Give the user a complete picture of their total financial life — not just investments but all assets, all debts, all income, all goals — and a clear roadmap for building and protecting wealth.

Shows:
- Net worth tracker showing total assets broken into every category (brokerage accounts, retirement accounts, real estate equity, cash and savings, business equity, vehicle value, other assets) and total liabilities broken into every category (mortgage balance, student loans, auto loans, personal loans, credit card debt, other debt) with net worth as the difference — updated as the user enters changes and tracked month over month
- Cash flow analysis showing monthly take-home income, all fixed expenses, all variable expenses, all savings contributions, all debt payments, and the net monthly surplus or deficit
- Goal tracker for up to 10 financial goals simultaneously — each goal has a name, a target dollar amount, a target date, the current saved amount, the monthly contribution, and a calculation showing whether the current contribution will hit the goal on time or whether they need to save more
- Emergency fund tracker showing the target amount based on their monthly essential expenses, the current balance, the funding gap, and the projected date when the fund will be fully funded at the current contribution rate
- Insurance gap analysis: for each type of insurance (life, disability, long-term care, umbrella), shows the recommended coverage amount based on the user's income, debts, and dependents versus what they currently have, flagging any significant gaps
- Estate planning checklist showing which documents are in place (will, healthcare proxy, power of attorney, beneficiary designations updated) and which are missing, with the impact of not having each one explained in plain language
- Milestone timeline showing all the user's major financial milestones — when the emergency fund will be complete, when each debt will be paid off, when each goal will be fully funded, when they can retire — plotted on a single timeline so they can see the sequence of their financial journey
- Life insurance needs calculator: takes the user's income, number of years dependents need support, mortgage balance, other debts, and existing savings, and calculates the recommended life insurance coverage amount and shows the gap versus current coverage

What the user accomplishes: They see every aspect of their financial life in one place and understand the complete picture. They can make trade-off decisions — for example deciding whether to pay down debt faster or fund a goal more aggressively — with full visibility into the impact on their overall plan.

---

FIXED INCOME AND BOND ANALYSIS
Purpose: Help users who hold bonds or bond funds understand their fixed income exposure and evaluate bonds as an investment.

Shows:
- Current holdings in fixed income: each bond or bond fund with its coupon rate, maturity date, credit rating, current yield, duration, and current market value
- Portfolio duration: the weighted average duration of all fixed income holdings, which measures sensitivity to interest rate changes — for example a duration of 7 means a 1% rise in rates would cause approximately a 7% decline in value
- Yield curve chart: plots the current US Treasury yield from 1 month to 30 years, showing whether the curve is normal (longer maturities yield more), inverted (short rates higher than long rates — historically a recession indicator), or flat
- Credit quality distribution: shows what percentage of the fixed income portfolio is in each credit rating tier — AAA, AA, A, BBB, BB, B, and below — with the associated default risk for each tier
- Bond screener: lets the user filter available bonds by maturity range, credit rating, yield range, sector, and issuer type to find bonds that match their criteria
- Interest rate sensitivity analysis: shows how the total fixed income portfolio value would change under three rate scenarios — rates rise 1%, rates stay flat, rates fall 1%
- Maturity ladder chart: shows when each bond in the portfolio matures, letting the user see if they have a healthy distribution of maturities or are dangerously concentrated in one maturity window

What the user accomplishes: They understand how rising or falling interest rates affect their bond holdings, whether their credit quality is appropriate for their risk tolerance, and how to construct a bond ladder that provides predictable income without excessive rate risk.

---

DIVIDEND AND INCOME TRACKING
Purpose: Help income-focused investors track, project, and optimize their dividend income across their portfolio.

Shows:
- Total annual dividend income from all holdings shown as a yearly number and a monthly average
- Portfolio dividend yield: total annual dividends divided by total portfolio value
- Dividend income by holding: every dividend-paying position with its annual dividend per share, number of shares, total annual dividend from that position, and that position's individual dividend yield
- Dividend calendar showing the ex-dividend date and payment date for every holding's upcoming dividend payment — the user always knows when money is coming in
- Dividend growth chart showing how the portfolio's total annual dividend income has grown year over year — income investors care deeply about dividend growth as it is the primary driver of long-term income compounding
- Dividend safety analysis for each holding: shows the payout ratio (what percentage of earnings are being paid as dividends) — a payout ratio above 80-90% is a warning sign the dividend may not be sustainable
- Dividend reinvestment projector: shows what the total portfolio value and annual dividend income would be in 10, 20, and 30 years if all dividends are reinvested versus taken as cash, illustrating the compounding power of reinvestment

What the user accomplishes: Income investors have a dedicated tool that treats dividend income as seriously as capital appreciation. They never miss a dividend payment, always know the sustainability of each dividend, and can project their future income stream with precision.

---

STOCK SCREENER AND RESEARCH
Purpose: Let users find stocks that match specific criteria and do deep research on individual companies before investing.

Shows:
- Screener with filters across four categories:
  - Fundamental filters: P/E ratio range, P/B ratio range, revenue growth rate, earnings growth rate, profit margin, debt-to-equity ratio, dividend yield range, market cap range
  - Technical filters: 52-week high/low proximity, relative strength index (RSI) range, moving average crossover conditions, volume relative to average
  - Quality filters: credit rating, return on equity, return on invested capital, free cash flow yield, earnings consistency (how many of the last 10 years had positive earnings growth)
  - ESG filters: environmental score, social score, governance score for users who want to align their portfolio with their values
- Individual stock deep-dive page for any company showing:
  - Business description: what the company does, how it makes money, its competitive position
  - 10 years of financial data: revenue, operating income, net income, EPS, free cash flow, dividends, and debt — all shown as bar charts so trends are visual
  - Valuation metrics: current P/E versus its 5-year average, versus the sector average, and versus the S&P 500 average — showing whether the stock is cheap or expensive relative to history and peers
  - Analyst ratings: the number of analysts with Buy, Hold, and Sell ratings, the average price target, the highest and lowest price target, and the percentage upside or downside to the consensus target from the current price
  - Institutional ownership: what percentage of the company is owned by institutional investors, whether that percentage is increasing or decreasing, and the largest institutional shareholders
  - Insider activity: recent buys and sells by company executives and board members — because insiders buying their own stock is a meaningful signal
  - News and earnings history: last 8 quarters of earnings with beat or miss, and recent company-specific news

What the user accomplishes: They can find investment ideas that match their specific investment style and criteria, and then do thorough research on any individual company before committing capital. They make investment decisions based on data rather than headlines or tips.

---

ECONOMIC DASHBOARD
Purpose: Show the user the state of the broader economy through the key indicators that drive markets and investment returns.

Shows:
- GDP growth rate: the current reading and the trend over the past 8 quarters shown as a bar chart, with a label for which phase of the economic cycle we appear to be in (expansion, peak, contraction, recovery)
- Inflation: CPI and PCE readings over the past 24 months as a line chart, with the Fed's 2% target marked as a reference line so the user can see how far inflation is above or below the target
- Employment: monthly non-farm payrolls additions as a bar chart, unemployment rate over time as a line, and the labor force participation rate — the combination of these three tells a more complete story than any one number alone
- Federal Reserve: the current Federal Funds Rate, the full history of rate changes over the past 5 years, and the market-implied probability of rate hikes or cuts at the next several Fed meetings (derived from Fed Funds futures) — this tells the user what the market is expecting before it happens
- Housing market: median home price, month-over-month and year-over-year change, existing home sales volume, new home starts, and the 30-year mortgage rate — all relevant for users planning a home purchase or tracking real estate as an asset class
- Manufacturing and services PMI: the Purchasing Managers Index for both manufacturing and services sectors, which is a leading indicator of economic expansion or contraction. Above 50 means the sector is expanding, below 50 means contracting.
- Consumer confidence index over time as a line chart — consumers feeling good about the economy tends to precede stronger spending and earnings
- Yield curve chart plotting all US Treasury maturities — when this chart shows an inversion (short-term rates higher than long-term rates), it has historically preceded recessions by 12-18 months
- Global economic comparison showing GDP growth rates for the US, Eurozone, China, Japan, UK, and Emerging Markets side by side, so users with international exposure understand the relative economic strength of different regions

What the user accomplishes: They understand the macroeconomic environment their portfolio is operating in, can anticipate how Fed policy changes will affect their holdings, and can make asset allocation decisions that account for where the economy appears to be in its cycle.

===========================================================
NEXUS — ADVISOR-CLIENT PLATFORM
===========================================================

---

ADVISOR PRACTICE DASHBOARD
Purpose: Give the advisor a complete operational overview of their entire practice every time they log in.

Shows:
- Total client count and change from last month
- Total assets under management and change in dollar and percentage terms from last month — change comes from both market movement and client contributions or withdrawals
- Revenue this month based on AUM-based advisory fees, with year-to-date total and comparison to same period last year
- Number of tasks overdue, due today, and due this week — broken out so the advisor immediately knows their urgency level
- Number of unread client messages
- Recent client portal activity — which clients logged in recently, what they viewed or did, flagging any clients who have been inactive for an extended period as they may need outreach
- Upcoming client meetings for today and tomorrow with preparation status shown — a green check if the advisor has reviewed that client's materials, a warning if they have not
- Client milestone alerts — automated notifications when a client hits a significant milestone like their portfolio crossing a round number threshold, a goal being fully funded, a debt being paid off, or a birthday that triggers a financial planning action like a Medicare eligibility reminder
- Market conditions summary showing how the major indices performed today and whether any significant economic data was released that advisors should be aware of before client conversations
- Compliance alerts for any regulatory deadlines, required disclosures, or annual review requirements approaching

What the advisor accomplishes: They start each day with complete situational awareness. No client falls through the cracks, no task gets forgotten, no compliance deadline is missed, and they walk into every meeting prepared.

---

CLIENT RELATIONSHIP MANAGEMENT (CRM)
Purpose: Store and organize everything the advisor knows about each client in one place, accessible instantly.

Shows:
- Full client list with quick-view columns: name, AUM, risk profile, last contact date, next meeting date, relationship tier (A/B/C client), and a health indicator showing whether the relationship is active and the plan is current
- Individual client profile containing:
  - Personal information: age, date of birth, marital status, number of dependents, employer, income, tax filing status, state of residence
  - Family map: spouse or partner information, children's names and ages (relevant for education planning), parents if elder care is a consideration
  - Financial snapshot: all account balances, net worth, monthly cash flow, insurance coverage summary, estate planning document status
  - Risk profile: their stated risk tolerance, their investment objective (growth, income, balanced, preservation), time horizon, and any specific investment constraints or preferences (no tobacco stocks, no fossil fuels, etc.)
  - Goals: every financial goal on file with current status and funding progress
  - Life events history: every major life event recorded with date and the actions taken in response
  - Contact preferences: preferred communication method, best time to reach them, how often they want to meet, whether they prefer detailed reports or high-level summaries
  - Notes: running log of every advisor note from every client interaction — phone calls, meetings, emails, and what was discussed and decided
  - Relationship history: date the client relationship began, how they were referred, any family members also working with the advisor

What the advisor accomplishes: Every piece of client knowledge is captured and retrievable in seconds. New advisors joining the practice can get fully up to speed on any client. No client ever has to repeat themselves. The advisor always knows the full context of the relationship before any conversation.

---

CLIENT PORTAL (CLIENT VIEW)
Purpose: Give the client a secure, private window into their own financial life and a direct line to their advisor.

Shows:
- Portfolio value updated as of the last market close with today's change and a 90-day performance chart
- Account list showing every account the advisor manages with current balance and account type
- Goal progress for every financial goal — each goal shows the name, target amount, current amount, progress bar, target date, and whether they are on track
- Net worth summary showing total assets and total liabilities and the resulting net worth, updated as the advisor enters changes
- Document library showing every document the advisor has shared: statements, financial plans, tax documents, proposals, educational materials — each with a name, date, and download button, and a "New" badge on anything not yet viewed
- Messages showing the full message history with their advisor and a compose field to send a new message
- Meeting history showing past meetings and a summary of what was discussed and what actions were agreed upon, so the client always has a record of what their advisor recommended and why
- Upcoming meeting details with the date, time, format, and a Join button for video meetings
- Educational resources their advisor has specifically assigned to them — courses or guides from the FUN platform that the advisor has flagged as relevant to their situation

What the client accomplishes: They always know where they stand financially without having to call their advisor for every question. They feel engaged in their own financial plan rather than handing their money to someone and hoping for the best. The transparency builds trust.

---

WORKFLOW AND TASK CENTER
Purpose: Ensure that every action item related to every client is captured, tracked, and completed.

Shows:
- Kanban board with four columns — To Do, In Progress, In Review, Complete — showing all tasks across all clients
- Each task card shows: task name, which client it is for, due date, priority level, who the task is assigned to (for practices with multiple staff members), and a category tag (planning, compliance, administrative, investment, communication)
- Task templates for common advisory workflows — for example "New Client Onboarding" generates a pre-built task list with every step from gathering documents to delivering the first financial plan, so the advisor never has to remember all the steps manually
- Workflow automation triggers — for example when a life event of type "New Baby" is recorded for a client, the system automatically generates a suggested task list covering life insurance review, beneficiary update, 529 account opening, and estate plan update
- Filter and search across all tasks by client name, due date, priority, category, or assigned team member
- Task due date reporting showing how many tasks are overdue, due today, due this week, and coming up — color coded by urgency
- Completed task log showing everything that has been done with the date completed and any notes added upon completion

What the advisor accomplishes: Nothing slips through the cracks. Large complex engagements like new client onboarding or estate plan implementation are managed systematically rather than from memory. Multiple staff members can work on the same client without stepping on each other.

---

DOCUMENT VAULT
Purpose: Store, organize, and share every document related to every client in one secure location.

Shows:
- Document library organized by client and by document category: Financial Plans, Investment Policy Statements, Tax Documents, Insurance Policies, Estate Documents, Meeting Notes, Proposals, Statements, and Compliance Records
- For each document: file name, category, date uploaded, who uploaded it, whether the client has viewed it, and file size
- Version history for documents that go through multiple drafts — the advisor can see every previous version with the date and what changed
- Document request workflow: the advisor can request specific documents from a client (for example "Please upload your most recent tax return"), the client receives a notification, and when they upload it the document appears in the vault automatically tagged to that request
- Shared vs private designation: the advisor can mark any document as shared with the client so it appears in their portal, or keep it as internal-only
- Search across all documents by name, client, category, or date range
- Bulk operations: download a full client document package, share multiple documents at once, or archive documents from closed client relationships

What the advisor accomplishes: A fully paperless, organized document practice. Clients can securely submit documents without emailing sensitive files. Regulatory audits are straightforward because every document is organized, dated, and traceable.

---

MEETING PREPARATION AND NOTES
Purpose: Help advisors prepare for client meetings and capture everything discussed so nothing is lost.

Shows:
- Meeting prep package generated automatically for each scheduled meeting: shows the client's current portfolio performance since the last meeting, goal progress updates, any market events that may be relevant to discuss, tasks that were agreed upon in the last meeting and whether they are complete, and any life events or changes recorded since the last meeting
- Pre-meeting notes field where the advisor prepares their talking points and agenda for the specific meeting
- During the meeting: a notes capture area where the advisor types or dictates meeting notes in real time
- Action items captured during the meeting: as the advisor records what was agreed upon, each item becomes a task automatically added to the workflow center with the client linked and a due date
- Post-meeting summary automatically generated from the notes that can be sent to the client as a follow-up email through the secure messaging system so the client has a written record of what was discussed and decided
- Meeting history showing all past meetings with the date, type, notes, and action items from each one

What the advisor accomplishes: Meetings are more productive because the advisor walks in fully prepared. Nothing decided in a meeting ever gets forgotten. Clients receive a written summary so they always know what the advisor is doing for them and why.

---

LIFE EVENTS TRACKER
Purpose: Capture the major life changes that drive financial planning needs and connect them to the right planning actions.

Shows:
- Timeline of every life event recorded for every client: marriage, divorce, new child, child leaving for college, job change, promotion, layoff, business ownership, home purchase, home sale, inheritance, death of spouse, retirement, disability, health diagnosis — each with the date, the client, and a status
- For each life event: what financial planning actions are triggered by that event, shown as a checklist — for example a new child triggers life insurance review, beneficiary designation update, estate plan review, and 529 college savings account opening
- Integration with the task center: each triggered action from a life event can be converted into a task with one click
- Life event timeline view across the advisor's entire client base — showing which clients have had significant life events recently and which planning actions are still outstanding, so the advisor can prioritize who needs attention most urgently

What the advisor accomplishes: Life events are the moments when financial planning matters most, and they are often the moments when advisors with poor systems drop the ball. This tracker ensures every life event triggers the right response.

---

COMPLIANCE AND REPORTING CENTER
Purpose: Keep the advisory practice compliant with regulatory requirements and generate the reports advisors are required to produce.

Shows:
- Annual review tracker showing which clients have had their required annual review this year and which have not, with a due date for each outstanding review
- Required disclosure log: tracks which regulatory disclosures have been delivered to each client and when, with the ability to generate a delivery record
- Investment policy statement status for each client: whether one is on file, the date it was last updated, and whether it has been reviewed this year
- Performance reporting: generates compliant performance reports for any client for any time period, showing portfolio return net of fees, benchmark comparison, and risk statistics formatted to regulatory standards
- Fee billing report: shows advisory fees charged to each client for any billing period with the calculation method and the AUM that the fee was based on
- Audit log: a complete record of every action taken by every advisor and staff member in the system — every document viewed, every task completed, every message sent — providing the trail needed for regulatory audits

What the advisor accomplishes: They run a compliant practice without having to maintain separate spreadsheets and paper records. Regulatory audits become manageable because everything is documented and traceable automatically.

===========================================================
FUN — FINANCIAL UNDERSTANDING NETWORK
===========================================================

---

LEARNING HUB
Purpose: Orient users to everything available to learn and make it easy to find content relevant to their situation.

Shows:
- Featured course prominently displayed with the title, what the course covers, the number of lessons, estimated time to complete, and difficulty level
- Eight content categories with the number of courses in each: Investing Basics, Retirement Planning, Tax Strategy, Budgeting and Cash Flow, Real Estate, Insurance and Protection, Estate Planning, and Credit and Debt
- Continue Learning section showing the user's in-progress courses with exact progress percentage and a direct link back to where they left off
- Recently completed courses showing what the user has finished with the date completed and their quiz score
- Recommended For You showing courses selected based on their assessment results — the courses target the specific areas where their assessment revealed gaps
- Financial news explained simply: a feed of 3-5 current financial news events with a plain-language explanation of what they mean for everyday investors. For example "The Fed raised rates by 0.25% — here is what that means for your mortgage, your savings account, and your stock portfolio" — not a news feed, but a translation service that makes financial headlines understandable

What the user accomplishes: They can quickly find what they need to learn, pick up exactly where they left off, and understand what is happening in the financial world without needing a finance degree to interpret the news.

---

INVESTING BASICS COURSE TRACK
Purpose: Take someone from zero financial knowledge to a confident understanding of how investing works and why it works.

Lessons cover:
- What a stock is: ownership in a company, what drives a stock price up or down, how to read a stock quote, the difference between market price and intrinsic value
- What a bond is: a loan to a company or government, how coupon payments work, why bond prices move opposite to interest rates, credit ratings and what they mean
- What a mutual fund and ETF are: pooled investment vehicles, the difference between active and passive management, why expense ratios matter so much over time, how to buy and sell them
- How stock market indices work: what the S&P 500, Nasdaq, and Dow actually measure, why they are not the same thing, how they are calculated and why the Dow Jones is a flawed measure
- Compound interest and the time value of money: why starting early matters more than the amount invested, the actual math behind compounding with real examples
- Asset allocation: what it means to diversify, why different asset classes perform differently in different economic environments, how to think about the right mix for your situation and time horizon
- Dollar cost averaging: why investing a fixed amount regularly in a falling market actually works in your favor, how it removes the timing risk from investing
- What inflation does to money: the real return calculation (nominal return minus inflation rate), why money sitting in a savings account is actually losing purchasing power in a high inflation environment
- How to evaluate a stock: price-to-earnings ratio, what it means, what a high or low P/E implies, the PEG ratio that adjusts for growth, why you can't use P/E alone
- Market cycles: what a bull market and bear market are, the historical average duration of each, why trying to time the market underperforms staying invested, the data on what happens to investors who miss the 10 best days by trying to get out at the right time

---

RETIREMENT PLANNING COURSE TRACK
Purpose: Walk users through every decision they need to make to retire with financial security.

Lessons cover:
- How much money you need to retire: the 4% withdrawal rule, the research behind it, what it means in practice, and how to calculate your number
- 401k explained: contribution limits, employer matching (and why not contributing enough to get the full match is the single biggest financial mistake most people make), traditional versus Roth 401k and how to decide between them, investment options and how to choose
- IRA explained: traditional versus Roth IRA, income limits that affect deductibility, contribution limits, backdoor Roth strategy for high earners
- Roth conversion strategy: when it makes sense to pay taxes now to avoid taxes later, how to calculate the break-even point, how a conversion ladder works for early retirees
- Social Security: how your benefit is calculated from your earnings history, how claiming age (62 versus 67 versus 70) affects your monthly benefit, the break-even age analysis, spousal benefits and survivor benefits
- Medicare: when coverage begins, the difference between Medicare Part A, B, C, and D, what is covered and what is not, the income-related premium surcharge (IRMAA) and how investment income can trigger it
- Required Minimum Distributions: what they are, when they start, how they are calculated, why they matter for tax planning, and how Roth accounts avoid them entirely
- Sequence of returns risk: why a market crash in the early years of retirement is far more damaging than the same crash 20 years into retirement, and what strategies (bucket strategy, bond tent, flexible withdrawal rates) can reduce this risk
- Healthcare costs in retirement: the single largest expense most people underestimate, how to plan for them, long-term care insurance and when it makes sense
- The retirement income plan: how to structure withdrawals across taxable, tax-deferred, and tax-free accounts to minimize lifetime taxes while maintaining enough liquidity for short-term expenses

---

TAX STRATEGY COURSE TRACK
Purpose: Teach users how the tax system actually works and how to legally pay less of it.

Lessons cover:
- How tax brackets actually work: the marginal versus effective tax rate distinction with visual examples, why earning more never results in taking home less
- Standard deduction versus itemizing: what qualifies as an itemized deduction, who benefits from itemizing (and it is far fewer people than before the 2017 tax law changes), the strategy of bunching deductions in alternate years
- Capital gains taxes: the difference between short-term (taxed as ordinary income) and long-term (taxed at 0%, 15%, or 20% depending on income) capital gains, how the 0% long-term capital gains bracket is one of the most powerful tax planning opportunities available
- Tax-loss harvesting: how selling losing positions to offset gains works, the wash-sale rule and what triggers it, how to harvest losses without disrupting your investment thesis by replacing with a similar but not identical fund
- Retirement account tax strategy: traditional accounts give you a deduction now, Roth accounts give you tax-free growth — which is better depends on whether you expect to be in a higher or lower tax bracket in retirement
- The backdoor Roth: why high earners cannot contribute directly to a Roth IRA, how the backdoor contribution works step by step, the pro-rata rule that can create a tax trap and how to avoid it
- Tax-efficient investing: why index funds and ETFs are more tax-efficient than active funds, why holding bonds in a taxable account is a poor choice, how to structure which holdings go in which type of account
- Self-employment taxes: how FICA taxes work for self-employed people, the deductions available (home office, business expenses, health insurance), the SEP-IRA and Solo 401k as powerful retirement and tax-reduction tools for freelancers and business owners
- Charitable giving strategies: qualified charitable distributions from IRAs, donor-advised funds, appreciated stock donations, and how each can result in significant tax savings
- Estate and gift taxes: the annual gift exclusion, the lifetime exemption, how to use gifts to transfer wealth without triggering estate taxes

---

BUDGETING AND CASH FLOW COURSE TRACK
Purpose: Help users understand where their money is going and build a system for controlling it.

Lessons cover:
- The 50/30/20 framework: 50% of take-home pay to needs, 30% to wants, 20% to savings — what counts in each category, why this framework is a starting point not a rule, and how to adjust it for different income levels and life situations
- Pay yourself first: the principle of automating savings before spending, why this approach works psychologically where willpower-based budgeting fails, how to automate it practically
- Emergency fund: why 3-6 months of expenses is the standard but why the right number varies by job stability, income source, and family situation, where to keep it (high-yield savings versus money market), and the psychological benefit of having it
- Debt versus investing: how to decide whether to pay down debt faster or invest the extra money, the mathematical answer (compare the debt interest rate to expected investment returns), and why the psychological comfort of debt freedom sometimes justifies the mathematically suboptimal choice
- Fixed versus variable expenses: how to identify which expenses are truly fixed (rent, insurance, loan minimums) versus variable (food, entertainment, clothing), why variable expenses are where all the budget flexibility lives
- Lifestyle inflation: what it is, why income increases tend to automatically get consumed by more spending, and how to capture a portion of every raise for savings before it disappears into lifestyle
- Cash flow projection: how to forecast income and expenses 3 months forward, why having a view of your future cash flow prevents the surprise cash crunches that drive bad financial decisions like credit card debt
- Sinking funds: the practice of saving monthly for predictable large irregular expenses (car registration, holiday gifts, annual subscriptions, home repairs) so they never feel like emergencies when they arrive

---

REAL ESTATE COURSE TRACK
Purpose: Give users the tools to make informed decisions about buying, selling, or investing in property.

Lessons cover:
- Rent versus buy analysis: the full financial comparison including the opportunity cost of the down payment (what that money would earn if invested), property tax, maintenance, insurance, and transaction costs versus the savings from not paying rent — and why buying is not always the better financial choice
- How a mortgage works: principal and interest, amortization (why so much of early payments go to interest), points (paying upfront to get a lower rate), APR versus interest rate, and how to shop and compare mortgage offers meaningfully
- The true cost of homeownership: property taxes, HOA fees, insurance, maintenance (the 1% rule of annual maintenance costs), utilities, and how these stack up against the quoted mortgage payment
- How home equity works: the difference between home price appreciation and equity building, how leverage amplifies returns in rising markets and losses in falling markets, the risks of treating home equity as a guaranteed investment
- Investment properties: how to calculate the cap rate and cash-on-cash return for a rental property, what makes a market attractive for rental investment, the responsibilities of being a landlord, and how to evaluate whether a property will actually cash flow positively after all expenses
- REITs explained: how real estate investment trusts let investors own a diversified portfolio of commercial properties without being a landlord, the different types (office, retail, residential, industrial, healthcare), and how they behave differently from stocks and bonds in a portfolio
- Refinancing: when refinancing makes sense, the break-even calculation (closing costs divided by monthly savings equals months to break even), and the situations where refinancing is actually a trap that extends debt and increases total interest paid
- Home equity lines of credit (HELOC): how they work, the risks of using home equity for non-home purposes, when they are a legitimate financial tool versus a dangerous way to convert unsecured consumer debt into debt secured by your home

---

INSURANCE AND PROTECTION COURSE TRACK
Purpose: Help users understand what risks in their financial life need to be insured and how to evaluate coverage.

Lessons cover:
- Life insurance: term versus whole life, why term is almost always the right choice for working-age people with dependents, how to calculate how much coverage you need (income replacement approach versus needs-based approach), when whole life can make sense (specific estate planning situations for high-net-worth individuals)
- Disability insurance: why disability is far more likely than death during working years and why most people are dangerously underinsured, the difference between short-term and long-term disability, own-occupation versus any-occupation definitions, how to supplement employer coverage
- Health insurance: how deductibles, copays, coinsurance, and out-of-pocket maximums work, how to evaluate an HSA-eligible high-deductible health plan versus a traditional plan, how an HSA works as a triple-tax-advantaged account (pre-tax contributions, tax-free growth, tax-free withdrawals for medical expenses)
- Homeowner's and renter's insurance: what is covered and what is not, the difference between replacement cost and actual cash value coverage, when umbrella insurance makes sense, why renter's insurance is one of the most cost-effective insurance purchases available
- Long-term care insurance: what it covers (nursing home care, in-home care, assisted living), at what age it makes sense to purchase it, the hybrid life/LTC policies as an alternative, and how to think about self-insuring through savings versus transferring the risk to an insurer
- Auto insurance: the coverage types (liability, collision, comprehensive, uninsured motorist), how to set deductibles strategically, when dropping collision coverage on an older vehicle makes financial sense, and how factors like credit score and claim history affect premiums

---

ESTATE PLANNING COURSE TRACK
Purpose: Teach users how to ensure their wishes are carried out and their family is protected when they die or become incapacitated.

Lessons cover:
- Why everyone needs a will: what happens to your assets if you die without one (intestate succession laws that may not match your wishes), who should be the executor, how to name a guardian for minor children
- Beneficiary designations: why these override your will entirely on retirement accounts, life insurance, and many bank accounts, the common mistake of leaving an ex-spouse or deceased parent as a beneficiary, the importance of reviewing these after every major life event
- Power of attorney: financial POA (who manages your money and makes financial decisions if you are incapacitated) and healthcare POA (who makes medical decisions), why these are equally important to a will and often more immediately relevant
- Revocable living trust: how it works, how it differs from a will, when it is worth the additional cost and complexity (primarily to avoid probate), what assets need to be retitled into the trust to actually avoid probate
- Irrevocable trusts: when and why families use them, the trade-off between giving up control and protecting assets from estate taxes and creditors, the specific types most commonly used (irrevocable life insurance trust, spousal lifetime access trust)
- Estate taxes: the current federal exemption amount, the difference between estate tax and inheritance tax, the states that have their own estate taxes at lower exemption levels, and the strategies used to reduce the taxable estate (gifting, charitable giving, life insurance)
- Gifting strategies: the annual gift exclusion (currently $18,000 per recipient per year), direct payments to educational or medical institutions as an unlimited exclusion, 529 superfunding as a way to front-load five years of gifts at once

---

CALCULATORS HUB
Purpose: Let users answer specific financial questions with their own numbers instantly.

The 12 calculators available:

1. Compound Interest Calculator — Enter starting amount, monthly contributions, annual return rate, and time period. See the final value, total contributed, and total growth earned. The chart shows the exponential growth curve and visually separates contributions from growth so users feel the impact of compounding.

2. Retirement Savings Calculator — Enter current age, retirement age, current savings, monthly contribution, expected return, and desired monthly retirement income. See projected balance at retirement, projected monthly income at a 4% withdrawal rate, the gap or surplus, and the contribution increase needed to close any gap.

3. Roth Conversion Optimizer — Enter current income, current tax bracket, traditional IRA/401k balance, expected retirement income and tax bracket. See the optimal conversion amount this year, the tax cost of converting, and the long-term tax savings from converting — shown as a comparison of total lifetime taxes paid with versus without the conversion over 20 and 30 year horizons.

4. Mortgage Calculator — Enter home price, down payment, loan term, interest rate, property tax rate, and insurance estimate. See monthly payment broken into all components, total interest paid over the life of the loan, total amount paid, and the payoff date. Also shows how much interest is saved by making one extra payment per year or by adding any amount to monthly payments.

5. Rent vs Buy Calculator — Enter rent amount, home price being considered, down payment, mortgage rate, expected annual home appreciation, property tax rate, insurance, HOA, expected investment return on the down payment if not used, and expected tenure in the home. See the break-even year after which buying becomes financially superior, and the total cost comparison over 5, 10, and 20 years.

6. Debt Payoff Calculator — Enter up to 8 debts with balance, interest rate, and minimum payment. Enter extra monthly payment amount. See the Avalanche method (highest rate first) and Snowball method (smallest balance first) side by side with payoff date, total interest paid, and a timeline chart of each debt being eliminated. Shows exactly how much interest Avalanche saves and how many months faster it finishes.

7. Emergency Fund Calculator — Enter monthly essential expenses and current saved amount. See the 3-month, 6-month, and 9-month targets, the gap to each, and with a monthly savings contribution entered, the number of months until each target is reached.

8. College Savings Calculator — Enter child's current age, expected enrollment age, annual cost of the target school today, expected annual cost increase, current 529 balance, and monthly contribution. See the total projected cost at enrollment, the projected 529 balance, the gap or surplus, and the required monthly contribution to fully fund four years.

9. Tax Bracket Calculator — Enter gross income, filing status, state of residence, pre-tax retirement contributions, and itemized deductions if applicable. See the federal and state tax owed, the effective tax rate, the marginal rate, after-tax income, and a breakdown bar chart showing exactly which dollars fall into which bracket.

10. Social Security Timing Calculator — Enter estimated Social Security benefit at full retirement age. See the monthly benefit at age 62 (reduced), age 67 (full), and age 70 (maximum), and the break-even age for each claiming decision — the age at which waiting longer produces more lifetime income despite the years of missed payments.

11. Investment Return Calculator — Enter initial amount, annual return, time period, and annual contribution. See final value under three scenarios simultaneously: conservative (5%), the entered rate, and optimistic (10%), so users see the full range of outcomes depending on investment choices.

12. Net Worth Calculator — Enter all assets across categories and all liabilities across categories. See total assets, total liabilities, and net worth, with a visual bar comparing assets to liabilities and a donut chart showing asset allocation by category.

---

VISUAL GUIDES
Purpose: Explain financial concepts that are hard to understand from text alone through step-by-step visual diagrams.

The guides available:

How Compound Interest Works — A step-by-step diagram starting with $10,000. Year 1: earns $700 at 7%, total becomes $10,700. Year 2: earns $749 because the base is now larger. The key insight shown visually is that by year 30, the interest earned on prior interest vastly exceeds the original principal. Side by side comparison with the same $10,000 in a savings account at 0.5% over 30 years makes the gap undeniable. The diagram also shows the same comparison with $200 monthly contributions added, to show that starting now even with small amounts matters more than starting later with larger amounts.

How Tax Brackets Work — A vertical diagram showing a person earning $80,000. Each slice of income is a different color corresponding to its bracket. The diagram shows visually that only the income above each threshold gets taxed at the higher rate — not all income. Shows effective rate (15.8% for this example) versus the 22% marginal rate and explains why people confuse these two numbers.

The Stock Market Explained — A diagram showing how a company issues shares, what each share represents in ownership, and why the price changes (earnings growth, sentiment, interest rates, competition). Shows the difference between a stock and a bond using a visual analogy. Shows what the S&P 500 index is (a weighted basket of 500 companies) and why it is different from the Dow Jones (only 30 companies, price-weighted not market-cap-weighted).

Asset Allocation Through Time — A diagram showing three investor profiles (Conservative, Moderate, Aggressive) as pie charts at ages 30, 50, and 65. Shows how the allocation should shift as the person approaches retirement. Then shows how each allocation performed in the 2008 crash — the aggressive portfolio lost more, the conservative portfolio lost less, and the moderate portfolio was in between. Shows the subsequent recovery. The point: higher risk tolerance means higher highs but also lower lows, and your time horizon determines how much of that volatility you can afford.

Debt Avalanche vs Snowball — Shows the same four debts side by side under each strategy. Debt 1: $8,000 at 22% (credit card). Debt 2: $3,000 at 7% (personal loan). Debt 3: $15,000 at 4.5% (auto loan). Debt 4: $40,000 at 5.8% (student loan). Avalanche pays Debt 1 first (highest rate), Snowball pays Debt 2 first (smallest balance). Shows which debts disappear in which order on a timeline for each strategy. Shows total interest paid: Avalanche $6,200, Snowball $7,800. Shows payoff date: Avalanche 4 years 2 months, Snowball 4 years 8 months. The conclusion is visual and clear.

How a Mortgage Amortizes — Shows a $400,000 mortgage at 6.5% over 30 years. In month 1 of payments, shows that $2,528 is the monthly payment, $2,167 goes to interest, and only $361 goes to principal. Shows this ratio gradually shifting over time until in the last year, most of each payment is principal. Shows the total interest paid over 30 years: $510,000 on a $400,000 loan — a number that consistently shocks people who have never looked at an amortization table. Shows how an extra $200 per month eliminates 5 years of payments and saves $87,000 in interest.

The Four Phases of the Market Cycle — A circular diagram showing Expansion (economy growing, stocks rising), Peak (growth slowing, valuations stretched), Contraction (recession, stocks falling), and Recovery (economy bottoming, stocks beginning to rise). For each phase shows which asset classes tend to perform best (cyclicals and growth stocks in expansion, defensives and bonds in contraction, value stocks and commodities in recovery), and which economic indicators signal each phase (GDP growth, unemployment, yield curve, PMI).

---

FINANCIAL HEALTH ASSESSMENT
Purpose: Evaluate a user's current financial habits and knowledge across five areas and use the results to guide their learning and planning priorities.

The assessment has 15 questions across five categories:

Spending and Cash Flow (3 questions): what percentage of income goes to savings, whether spending is tracked, whether the user knows their monthly essential expenses within $200

Emergency Preparedness (3 questions): number of months of expenses saved in liquid accounts, whether the emergency fund is in a separate account, whether the user knows exactly how long their savings would last if income stopped

Investing Behavior (3 questions): how retirement savings are invested, whether the user knows their portfolio's expense ratios, whether they have invested outside of employer retirement accounts

Debt Management (3 questions): total non-mortgage debt, interest rates on all outstanding debts, whether the user knows the payoff date of each debt at the current payment rate

Retirement Readiness (3 questions): whether the user has calculated their retirement number, whether they are contributing enough to get the full employer match, whether they have a Roth IRA or traditional IRA in addition to their employer plan

Results show:
- Overall financial health score 0-100 with a label
- Score in each of the five categories out of 20
- For each category scoring below 12: a specific one-sentence insight explaining what the low score means in practical terms
- Three recommended courses directly tied to the lowest-scoring categories, with a one-sentence explanation of why this specific course addresses their gap
- The ability to save results and share them with their Nexus advisor so the advisor can see where the client has gaps before their next planning meeting
- Retake available at any time with previous results saved for comparison so users can see their improvement over time
