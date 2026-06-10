import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, Clock } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, LineChart, Line, ReferenceLine, Legend,
  ScatterChart, Scatter, ZAxis, LabelList,
} from 'recharts'

const DISPLAY = "'Playfair Display', Georgia, serif"
const UI      = "'Inter', system-ui, sans-serif"
const MONO    = "'JetBrains Mono', monospace"
const EASE    = [0.32, 0.72, 0, 1]

const C = {
  bg:      '#1a1410',
  surf:    '#231c16',
  raise:   '#2d2419',
  b1:      '#2a2018',
  b2:      '#3d3028',
  gold:    '#c9a96e',
  goldDim: 'rgba(201,169,110,0.08)',
  goldBdr: 'rgba(201,169,110,0.20)',
  t1:      '#f0e8d8',
  t2:      '#a89070',
  t3:      '#6b5540',
  up:      '#4a7c59',
  down:    '#c0392b',
}

/* ─── Shared chart tooltip ─────────────────────────────────────── */
function ChartTip({ active, payload, label, prefix = '', suffix = '' }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: C.raise, border: `1px solid ${C.b2}`,
      borderRadius: 10, padding: '10px 14px', fontFamily: MONO,
    }}>
      <div style={{ fontSize: 11, color: C.t3, marginBottom: 6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ fontSize: 13, color: p.color || C.gold, fontWeight: 600 }}>
          {p.name}: {prefix}{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}{suffix}
        </div>
      ))}
    </div>
  )
}

/* ─── Article: Sharpe Ratio ─────────────────────────────────────── */
const SHARPE_COMPARISON = [
  { name: 'Portfolio A', return: 15, sharpe: 0.8, risk: 18.75 },
  { name: 'Portfolio B', return: 12, sharpe: 1.6, risk: 7.5 },
  { name: 'S&P 500 Avg', return: 10.5, sharpe: 0.95, risk: 11 },
  { name: 'Hedge Fund Top', return: 14, sharpe: 2.1, risk: 6.7 },
]
const SHARPE_RETURNS = [
  { name: 'Port. A\n(High Return)', return: 15, color: C.down },
  { name: 'Port. B\n(High Sharpe)', return: 12, color: C.gold },
]
const RISK_RETURN = [
  { risk: 5,  return: 3,  label: 'T-Bills'   },
  { risk: 8,  return: 7,  label: 'Bonds'     },
  { risk: 12, return: 10, label: 'S&P 500'   },
  { risk: 19, return: 15, label: 'Port. A'   },
  { risk: 8,  return: 12, label: 'Port. B'   },
  { risk: 25, return: 18, label: 'Small Cap' },
]

function SharpeArticle() {
  return (
    <>
      <Section title="Why Raw Returns Lie to You">
        <P>
          Every quarter, millions of investors open their brokerage statements and look at one number: return.
          They made 15%. Their neighbor made 12%. They won. End of story. Except — it isn't.
        </P>
        <P>
          That 15% return might have required twice the volatility, twice the sleepless nights, twice the drawdown
          risk. The 12% return might have been earned with a portfolio so well-constructed that it barely moved
          during the same period. The math behind which portfolio is actually superior isn't visible in the headline number.
        </P>
        <P>
          This is exactly the problem the Sharpe ratio was designed to solve. Developed by Nobel laureate William
          Sharpe in 1966, it answers a simple but profound question: <em>how much return are you getting for every
          unit of risk you're taking?</em>
        </P>
      </Section>

      <CalloutBox title="The Formula" color={C.gold}>
        <div style={{ fontFamily: MONO, fontSize: 15, color: C.t1, textAlign: 'center', padding: '12px 0' }}>
          Sharpe Ratio = (Portfolio Return − Risk-Free Rate) ÷ Standard Deviation
        </div>
        <P style={{ margin: '12px 0 0', fontSize: 13 }}>
          The risk-free rate is typically the current yield on 3-month U.S. Treasury bills — what you could earn
          with zero risk. Standard deviation measures how much your returns fluctuate. The higher the Sharpe, the
          more return you're generating per unit of volatility endured.
        </P>
      </CalloutBox>

      <Section title="Two Portfolios. One Clear Winner.">
        <P>
          Consider the two portfolios below. On the surface, Portfolio A looks better — it returned 15% versus 12%.
          But look at what that 3% premium cost in volatility and risk. Portfolio B earned less in raw terms but
          delivered far superior risk-adjusted performance.
        </P>

        <ChartContainer label="Portfolio Comparison — Return vs. Risk-Adjusted Return">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={SHARPE_COMPARISON} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.b2} />
              <XAxis dataKey="name" tick={{ fill: C.t3, fontSize: 11, fontFamily: MONO }} />
              <YAxis tick={{ fill: C.t3, fontSize: 11, fontFamily: MONO }} />
              <Tooltip content={<ChartTip suffix="%" />} />
              <Legend wrapperStyle={{ fontSize: 11, color: C.t3, fontFamily: UI }} />
              <Bar dataKey="return" name="Annualized Return (%)" fill={C.gold} opacity={0.85} radius={[4, 4, 0, 0]} />
              <Bar dataKey="sharpe" name="Sharpe Ratio" fill="#4a7c59" opacity={0.85} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <P>
          Portfolio A returned 15% but its standard deviation was 18.75% — meaning in a bad year, you could
          reasonably expect to lose nearly that much. Portfolio B returned 12% with a standard deviation of just
          7.5%. Its Sharpe ratio of 1.6 is double Portfolio A's 0.8. By every sophisticated measure, Portfolio B
          is the superior construction.
        </P>
      </Section>

      <Section title="Understanding the Numbers">
        <P>
          Sharpe ratios are not graded on an absolute scale — they're most useful in comparison. But there are
          general benchmarks that help frame your portfolio's efficiency:
        </P>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, margin: '24px 0' }} className="sharpe-grid">
          {[
            { label: 'Below 1.0', desc: 'Acceptable in some market conditions, but you may be taking on more risk than the return justifies.', color: C.down },
            { label: '1.0 – 2.0', desc: 'Good. You are being compensated reasonably well for each unit of volatility in your portfolio.', color: C.gold },
            { label: 'Above 2.0', desc: 'Exceptional. This is the territory of well-run hedge funds and expertly constructed institutional portfolios.', color: C.up },
          ].map(item => (
            <div key={item.label} style={{
              background: C.raise, border: `1px solid ${C.b2}`,
              borderRadius: 12, padding: 20,
            }}>
              <div style={{ fontFamily: MONO, fontSize: 16, fontWeight: 700, color: item.color, marginBottom: 8 }}>{item.label}</div>
              <div style={{ fontSize: 13, color: C.t2, lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Risk vs. Return: The Full Picture">
        <P>
          The chart below plots several asset classes and portfolios by their risk (standard deviation on the x-axis)
          and return (y-axis). Notice how Portfolio B sits above the general trend line — it earns more return per
          unit of risk than T-bills, bonds, or even the S&P 500 benchmark. Portfolio A, despite its higher absolute
          return, sits below Portfolio B on a risk-adjusted basis.
        </P>

        <ChartContainer label="Risk vs. Return Map">
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.b2} />
              <XAxis
                dataKey="risk"
                type="number"
                name="Risk"
                domain={[3, 28]}
                label={{ value: 'Risk — Std Dev %', position: 'insideBottom', offset: -12, fill: C.t3, fontSize: 11 }}
                tick={{ fill: C.t3, fontSize: 11, fontFamily: MONO }}
              />
              <YAxis
                dataKey="return"
                type="number"
                name="Return"
                domain={[0, 22]}
                label={{ value: 'Return %', angle: -90, position: 'insideLeft', fill: C.t3, fontSize: 11 }}
                tick={{ fill: C.t3, fontSize: 11, fontFamily: MONO }}
              />
              <ZAxis range={[60, 60]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const d = payload[0]?.payload
                  return (
                    <div style={{ background: C.raise, border: `1px solid ${C.b2}`, borderRadius: 10, padding: '10px 14px', fontFamily: MONO }}>
                      <div style={{ fontSize: 13, color: C.gold, fontWeight: 700, marginBottom: 4 }}>{d?.label}</div>
                      <div style={{ fontSize: 12, color: C.t2 }}>Risk: {d?.risk}% &nbsp;|&nbsp; Return: {d?.return}%</div>
                    </div>
                  )
                }}
              />
              <Scatter
                data={RISK_RETURN}
                fill={C.gold}
                opacity={0.85}
              >
                <LabelList dataKey="label" position="top" style={{ fill: C.t2, fontSize: 10, fontFamily: MONO }} />
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Section>

      <Section title="How to Improve Your Portfolio's Sharpe Ratio">
        <P>
          There are three levers you can pull to improve your risk-adjusted returns:
        </P>
        {[
          { n: '01', title: 'Diversify across uncorrelated assets', body: "Adding assets that don't move together reduces portfolio-level volatility without proportionally reducing returns. International equities, real assets, and bonds can all lower your standard deviation while preserving expected return." },
          { n: '02', title: 'Reduce unnecessary concentration', body: 'Single-stock concentration is the most common destroyer of Sharpe ratios in individual portfolios. A 30% position in one company may have worked — but it dramatically increased your standard deviation along the way.' },
          { n: '03', title: 'Mind your fees and taxes', body: 'Every basis point of fee and every dollar of avoidable tax reduces your net return without changing your risk profile. Eliminating a 1% management fee directly improves your Sharpe ratio by raising the numerator.' },
        ].map(item => (
          <div key={item.n} style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
            <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.gold, opacity: 0.4, flexShrink: 0, width: 36, paddingTop: 2 }}>{item.n}</div>
            <div>
              <div style={{ fontFamily: DISPLAY, fontSize: 17, fontWeight: 700, color: C.t1, marginBottom: 6 }}>{item.title}</div>
              <P style={{ margin: 0 }}>{item.body}</P>
            </div>
          </div>
        ))}
      </Section>

      <QuoteBlock quote="It is not about how much money you make, but about how much money you keep and how hard it works for you." attr="Robert Kiyosaki" />
    </>
  )
}

/* ─── Article: Tax Alpha ────────────────────────────────────────── */
const TAX_DRAG_DATA = Array.from({ length: 31 }, (_, i) => {
  const efficient  = Math.round(10000 * Math.pow(1.07, i))
  const inefficient = Math.round(10000 * Math.pow(1.045, i))
  return { year: `Yr ${i}`, efficient, inefficient }
})

const TAX_COST_DATA = [
  { name: 'Wrong asset location', cost: 0.8 },
  { name: 'No tax-loss harvesting', cost: 0.6 },
  { name: 'Short-term vs long-term', cost: 0.5 },
  { name: 'High-turnover funds', cost: 0.4 },
  { name: 'Dividend placement', cost: 0.3 },
]

function TaxAlphaArticle() {
  return (
    <>
      <Section title="The Hidden Tax on Your Returns">
        <P>
          Every year, the average investor quietly hands back 1.0 to 2.5% of their investment return to the
          government — not because they had to, but because they didn't know better. This is not a political
          statement. It's an accounting one. Tax drag is one of the most quantifiable and preventable sources
          of investment underperformance.
        </P>
        <P>
          Tax alpha is the financial planning term for the additional return generated by managing your
          investments tax-efficiently. It doesn't require you to take on more risk, pick better stocks, or
          time the market. It requires you to understand four rules that most retail investors never learn.
        </P>
      </Section>

      <Section title="The 30-Year Cost of Tax Inefficiency">
        <P>
          The chart below shows the same $10,000 invested over 30 years — one in a tax-efficient strategy
          generating an effective net return of 7%, and one suffering 2.5% of annual tax drag, netting 4.5%.
        </P>

        <ChartContainer label="$10,000 Invested Over 30 Years: Tax-Efficient vs. Tax-Inefficient">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={TAX_DRAG_DATA} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="effGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.up} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.up} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ineffGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.down} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={C.down} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.b2} />
              <XAxis dataKey="year" tick={{ fill: C.t3, fontSize: 10, fontFamily: MONO }} interval={4} />
              <YAxis tickFormatter={v => `$${(v/1000).toFixed(0)}k`} tick={{ fill: C.t3, fontSize: 11, fontFamily: MONO }} />
              <Tooltip content={<ChartTip prefix="$" />} />
              <Legend wrapperStyle={{ fontSize: 11, color: C.t3, fontFamily: UI }} />
              <Area type="monotone" dataKey="efficient" name="Tax-Efficient (7% net)" stroke={C.up} fill="url(#effGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="inefficient" name="Tax-Inefficient (4.5% net)" stroke={C.down} fill="url(#ineffGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        <CalloutBox title="The gap after 30 years" color={C.gold}>
          <P style={{ margin: 0 }}>
            Tax-efficient portfolio grows to <strong style={{ color: C.up }}>$76,123</strong>.
            Tax-inefficient portfolio grows to <strong style={{ color: C.down }}>$37,816</strong>.
            The difference — <strong style={{ color: C.gold }}>$38,307</strong> — is money that
            compounded in your favor instead of going to avoidable taxes. That gap is almost entirely
            made up of the power of not interrupting compounding.
          </P>
        </CalloutBox>
      </Section>

      <Section title="Where Tax Drag Comes From">
        <P>
          Tax drag is not one problem — it is five. Each one is independent, preventable, and quantifiable.
          The bar chart below shows the approximate annual return cost of each:
        </P>

        <ChartContainer label="Annual Return Lost to Avoidable Tax Costs (%)">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={TAX_COST_DATA} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.b2} horizontal={false} />
              <XAxis type="number" tickFormatter={v => `${v}%`} tick={{ fill: C.t3, fontSize: 11, fontFamily: MONO }} />
              <YAxis type="category" dataKey="name" width={180} tick={{ fill: C.t2, fontSize: 11, fontFamily: UI }} />
              <Tooltip content={<ChartTip suffix="% annual drag" />} />
              <Bar dataKey="cost" name="Annual Cost" fill={C.gold} opacity={0.8} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Section>

      <Section title="The Four Tax Alpha Strategies">
        {[
          {
            n: '01', title: 'Asset Location',
            body: 'Different accounts are taxed differently. Tax-inefficient assets — like bonds, REITs, and high-dividend stocks — belong in tax-advantaged accounts (401k, IRA). Tax-efficient assets — like index funds and growth stocks held long-term — belong in taxable accounts. Getting this wrong costs 0.6–0.8% per year.'
          },
          {
            n: '02', title: 'Tax-Loss Harvesting',
            body: 'When a position falls below your cost basis, you can sell it to realize a loss that offsets taxable gains elsewhere in your portfolio. You can immediately reinvest in a similar (not identical) security to maintain market exposure. Done systematically, this generates 0.5–1% of additional after-tax return annually.'
          },
          {
            n: '03', title: 'Long-Term vs. Short-Term Gains',
            body: 'Holding a position for more than 12 months before selling qualifies the gain for long-term capital gains treatment — taxed at 0%, 15%, or 20% depending on your income. Short-term gains are taxed as ordinary income, which can reach 37%. Patience is a tax strategy.'
          },
          {
            n: '04', title: 'Low-Turnover Fund Selection',
            body: 'When a mutual fund sells securities inside the fund, it distributes taxable capital gains to shareholders — even if you didn\'t personally sell anything. Index funds, with their low turnover, generate far fewer of these phantom tax events than actively managed funds.'
          },
        ].map(item => (
          <div key={item.n} style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
            <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.gold, opacity: 0.4, flexShrink: 0, width: 36, paddingTop: 2 }}>{item.n}</div>
            <div>
              <div style={{ fontFamily: DISPLAY, fontSize: 17, fontWeight: 700, color: C.t1, marginBottom: 6 }}>{item.title}</div>
              <P style={{ margin: 0 }}>{item.body}</P>
            </div>
          </div>
        ))}
      </Section>

      <QuoteBlock quote="An investment in knowledge pays the best interest." attr="Benjamin Franklin" />
    </>
  )
}

/* ─── Article: 4% Rule ──────────────────────────────────────────── */
const WITHDRAWAL_SCENARIOS = [
  { year: 0,  conservative: 1000000, moderate: 1000000, aggressive: 1000000 },
  { year: 5,  conservative: 920000,  moderate: 880000,  aggressive: 840000 },
  { year: 10, conservative: 830000,  moderate: 740000,  aggressive: 650000 },
  { year: 15, conservative: 730000,  moderate: 580000,  aggressive: 440000 },
  { year: 20, conservative: 620000,  moderate: 400000,  aggressive: 210000 },
  { year: 25, conservative: 500000,  moderate: 200000,  aggressive: 0 },
  { year: 30, conservative: 370000,  moderate: 0,       aggressive: 0 },
]

const EQUITY_IMPACT = [
  { allocation: '30/70', successRate: 71 },
  { allocation: '40/60', successRate: 82 },
  { allocation: '50/50', successRate: 90 },
  { allocation: '60/40', successRate: 95 },
  { allocation: '70/30', successRate: 97 },
  { allocation: '80/20', successRate: 96 },
  { allocation: '100/0', successRate: 89 },
]

function FourPercentArticle() {
  return (
    <>
      <Section title="The Research That Changed Retirement Planning">
        <P>
          In 1994, a financial planner named William Bengen sat down with decades of historical market and
          inflation data and asked a question that surprisingly hadn't been rigorously answered: how much
          can a retiree safely withdraw from their portfolio each year without running out of money?
        </P>
        <P>
          His answer — 4% of the initial portfolio value, adjusted for inflation each subsequent year — became
          one of the most cited and most misunderstood findings in personal finance. What the headlines turned
          into a rule, Bengen described as a floor: the worst-case historical scenario, not the expected outcome.
        </P>
      </Section>

      <CalloutBox title="The Original Finding" color={C.gold}>
        <P style={{ margin: 0 }}>
          Bengen studied every 30-year retirement period from 1926 to 1976. A retiree with a 50–75% equity
          allocation who withdrew 4% of their starting portfolio — and increased that dollar amount by inflation
          each year — never ran out of money in any historical 30-year window. The worst sequence was someone
          who retired in 1966, at the onset of stagflation. They made it. Barely. 4% held.
        </P>
      </CalloutBox>

      <Section title="What Happens at Different Withdrawal Rates">
        <P>
          The chart below shows three portfolios starting at $1,000,000 and being drawn down over 30 years
          at different rates, assuming average historical returns. Notice how the aggressive withdrawal rate
          depletes the portfolio within 25 years — an outcome that leaves a retiree entirely dependent on
          Social Security in their late 80s.
        </P>

        <ChartContainer label="$1M Portfolio Over 30 Years at Different Withdrawal Rates">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={WITHDRAWAL_SCENARIOS} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="consGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.up} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={C.up} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="modGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.gold} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={C.gold} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="aggGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.down} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={C.down} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.b2} />
              <XAxis dataKey="year" tickFormatter={v => `Yr ${v}`} tick={{ fill: C.t3, fontSize: 11, fontFamily: MONO }} />
              <YAxis tickFormatter={v => `$${(v/1000).toFixed(0)}k`} tick={{ fill: C.t3, fontSize: 11, fontFamily: MONO }} />
              <Tooltip content={<ChartTip prefix="$" />} />
              <Legend wrapperStyle={{ fontSize: 11, color: C.t3, fontFamily: UI }} />
              <Area type="monotone" dataKey="conservative" name="3% Withdrawal" stroke={C.up} fill="url(#consGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="moderate" name="4% Withdrawal" stroke={C.gold} fill="url(#modGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="aggressive" name="6% Withdrawal" stroke={C.down} fill="url(#aggGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Section>

      <Section title="Equity Allocation Changes the Math Significantly">
        <P>
          Bengen's research found that the success rate of the 4% rule was highly sensitive to equity
          allocation. Portfolios with too little equity failed because they couldn't keep up with inflation.
          Portfolios with too much equity failed because they experienced catastrophic early drawdowns.
          The sweet spot was 50–75% equity.
        </P>

        <ChartContainer label="30-Year Success Rate of 4% Rule by Equity Allocation (historical)">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={EQUITY_IMPACT} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.b2} />
              <XAxis dataKey="allocation" tick={{ fill: C.t3, fontSize: 11, fontFamily: MONO }} label={{ value: 'Stocks/Bonds', position: 'insideBottom', offset: -4, fill: C.t3, fontSize: 10 }} />
              <YAxis domain={[60, 100]} tickFormatter={v => `${v}%`} tick={{ fill: C.t3, fontSize: 11, fontFamily: MONO }} />
              <Tooltip content={<ChartTip suffix="% success rate" />} />
              <ReferenceLine y={95} stroke={C.gold} strokeDasharray="4 4" label={{ value: 'Target', fill: C.gold, fontSize: 10, fontFamily: MONO }} />
              <Bar dataKey="successRate" name="Success Rate" fill={C.gold} opacity={0.8} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Section>

      <Section title="What the Headlines Get Wrong">
        <P>
          The most common misapplication of the 4% rule is treating it as a universal prescription rather
          than a historical observation. Several variables change the math substantially:
        </P>
        {[
          { title: 'Time horizon', body: 'Bengen studied 30-year retirements. If you retire at 55, you may need a 40-year window. Research suggests the safe rate for a 40-year horizon is closer to 3.3–3.5%.' },
          { title: 'Current valuations', body: 'The 4% rule was derived from historical returns. When markets are highly valued at retirement (high CAPE ratio), forward 10-year returns have historically been lower. Some researchers recommend a valuation-adjusted withdrawal rate.' },
          { title: 'Spending flexibility', body: 'If you can reduce spending by 10–15% in bad market years, you can safely withdraw at higher rates in good years. Dynamic withdrawal strategies outperform rigid 4% rules in most Monte Carlo simulations.' },
          { title: 'Social Security and other income', body: 'The 4% rule assumes your portfolio is your only income. If Social Security covers 40% of your spending, your required portfolio withdrawal rate drops dramatically — and success rates improve accordingly.' },
        ].map((item, i) => (
          <div key={i} style={{ borderLeft: `2px solid ${C.b2}`, paddingLeft: 20, marginBottom: 24 }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 16, fontWeight: 700, color: C.t1, marginBottom: 6 }}>{item.title}</div>
            <P style={{ margin: 0 }}>{item.body}</P>
          </div>
        ))}
      </Section>

      <QuoteBlock quote="Someone is sitting in the shade today because someone planted a tree a long time ago." attr="Warren Buffett" />
    </>
  )
}

/* ─── Shared layout components ──────────────────────────────────── */
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 700, color: C.t1, margin: '0 0 18px', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

function P({ children, style = {} }) {
  return (
    <p style={{ fontSize: 15, color: C.t2, lineHeight: 1.85, margin: '0 0 16px', fontFamily: UI, ...style }}>
      {children}
    </p>
  )
}

function CalloutBox({ title, color, children }) {
  return (
    <div style={{
      background: C.raise, border: `1px solid ${color}30`,
      borderRadius: 14, padding: '20px 24px', margin: '24px 0 36px',
    }}>
      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.16em', color, fontWeight: 600, marginBottom: 10 }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function ChartContainer({ label, children }) {
  return (
    <div style={{ background: C.raise, border: `1px solid ${C.b2}`, borderRadius: 14, padding: '20px 16px 16px', margin: '24px 0 32px' }}>
      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.14em', color: C.t3, fontWeight: 600, marginBottom: 16, paddingLeft: 4 }}>
        {label}
      </div>
      {children}
    </div>
  )
}

function QuoteBlock({ quote, attr }) {
  return (
    <div style={{
      borderLeft: `3px solid ${C.gold}`, paddingLeft: 24,
      margin: '40px 0', background: C.goldDim, borderRadius: '0 10px 10px 0',
      padding: '20px 24px',
    }}>
      <p style={{ fontFamily: DISPLAY, fontSize: 18, fontStyle: 'italic', color: C.t1, margin: '0 0 10px', lineHeight: 1.5 }}>
        &ldquo;{quote}&rdquo;
      </p>
      <span style={{ fontSize: 12, color: C.t3, fontFamily: UI }}>— {attr}</span>
    </div>
  )
}

/* ─── Article registry ──────────────────────────────────────────── */
const ARTICLES = {
  'sharpe-ratio': {
    title:    "Understanding Risk-Adjusted Returns",
    subtitle: "What Your Portfolio's Sharpe Ratio Reveals",
    category: 'Market Intelligence',
    readTime: '5 min read',
    component: SharpeArticle,
  },
  'tax-alpha': {
    title:    "Tax Alpha",
    subtitle: "The Return Most Investors Leave on the Table Every Year",
    category: 'Tax Strategy',
    readTime: '7 min read',
    component: TaxAlphaArticle,
  },
  'four-percent-rule': {
    title:    "The 4% Rule",
    subtitle: "What Bengen's Research Actually Says About Retirement Income",
    category: 'Retirement Planning',
    readTime: '6 min read',
    component: FourPercentArticle,
  },
}

/* ─── Main export ───────────────────────────────────────────────── */
export default function InsightArticle() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const article  = ARTICLES[slug]

  if (!article) {
    return (
      <div style={{ background: C.bg, minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: UI }}>
        <div style={{ textAlign: 'center', color: C.t3 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>404</div>
          <button onClick={() => navigate('/insights')} style={{ color: C.gold, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>
            ← Back to Insights
          </button>
        </div>
      </div>
    )
  }

  const ArticleBody = article.component

  return (
    <div style={{ background: C.bg, minHeight: '100dvh', fontFamily: UI }}>

      {/* P button */}
      <button
        onClick={() => navigate('/')}
        title="Back to Home"
        style={{
          position: 'fixed', top: 20, right: 24, zIndex: 100,
          width: 38, height: 38, borderRadius: '50%',
          background: C.gold, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(201,169,110,0.3)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(201,169,110,0.45)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)';    e.currentTarget.style.boxShadow = '0 4px 16px rgba(201,169,110,0.3)' }}
      >
        <span style={{ fontFamily: DISPLAY, fontSize: 15, fontWeight: 800, color: '#1a1410', lineHeight: 1 }}>P</span>
      </button>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '64px 40px 100px' }}>

        {/* Back link */}
        <button
          onClick={() => navigate('/insights')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: C.t3, fontSize: 12, fontFamily: UI, fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase', padding: 0,
            marginBottom: 40, transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = C.gold}
          onMouseLeave={e => e.currentTarget.style.color = C.t3}
        >
          <ArrowLeft size={13} /> Back to Insights
        </button>

        {/* Article header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{
              fontSize: 10, color: C.gold, fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.12em', background: C.goldDim, border: `1px solid ${C.goldBdr}`,
              borderRadius: 6, padding: '4px 10px',
            }}>
              {article.category}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: C.t3, fontFamily: MONO }}>
              <Clock size={11} /> {article.readTime}
            </span>
          </div>

          <h1 style={{ fontFamily: DISPLAY, fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, color: C.t1, margin: '0 0 12px', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            {article.title}
          </h1>
          <p style={{ fontFamily: DISPLAY, fontStyle: 'italic', fontSize: 18, color: C.t2, margin: '0 0 48px', lineHeight: 1.4 }}>
            {article.subtitle}
          </p>

          <div style={{ height: 1, background: C.b2, marginBottom: 48 }} />
        </motion.div>

        {/* Article body */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
        >
          <ArticleBody />
        </motion.div>

        {/* Footer nav */}
        <div style={{ borderTop: `1px solid ${C.b2}`, paddingTop: 32, marginTop: 48 }}>
          <button
            onClick={() => navigate('/insights')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: C.goldDim, border: `1px solid ${C.goldBdr}`,
              borderRadius: 10, padding: '12px 20px',
              color: C.gold, fontSize: 13, fontWeight: 600, fontFamily: UI,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,169,110,0.14)'}
            onMouseLeave={e => e.currentTarget.style.background = C.goldDim}
          >
            <BookOpen size={14} /> Read more insights
          </button>
        </div>

      </div>

      <style>{`
        .sharpe-grid { grid-template-columns: repeat(3, 1fr) !important; }
        @media (max-width: 720px) {
          .sharpe-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          div[style*="padding: 64px 40px"] { padding: 48px 24px 80px !important; }
        }
      `}</style>
    </div>
  )
}
