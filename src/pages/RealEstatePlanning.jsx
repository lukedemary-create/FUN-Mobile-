import React, { useState, useMemo } from "react";
import { Home, DollarSign, TrendingUp, Calculator, CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

/* ─── Design Tokens ─────────────────────────────────────────────── */
const C = {
  bg: "#1a1410", surface: "#231c16", raised: "#2d2419",
  b1: "var(--border-c)", b2: "#3d3028",
  gold: "#c9a96e", goldDim: "rgba(201,169,110,0.10)", goldBdr: "rgba(201,169,110,0.22)",
  t1: "#f0e8d8", t2: "#a89070", t3: "#6b5540",
  up: "#4a7c59", upDim: "rgba(74,124,89,0.12)",
  down: "#c0392b", downDim: "rgba(192,57,43,0.12)",
  warn: "#d4a017", warnDim: "rgba(212,160,23,0.12)",
};
const DISPLAY = "'Playfair Display', Georgia, serif";
const UI      = "'Inter', system-ui, sans-serif";
const MONO    = "'JetBrains Mono', monospace";

/* ─── Helpers ───────────────────────────────────────────────────── */
const fmt  = (n) => "$" + Math.round(n || 0).toLocaleString();
const fmtM = (n) => "$" + Math.round(n || 0).toLocaleString() + "/mo";
const pct  = (n) => (n || 0).toFixed(1) + "%";

function Slider({ label, value, min, max, step = 1, format, onChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: UI, fontSize: 12, color: C.t2 }}>{label}</span>
        <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: C.gold }}>{format ? format(value) : value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: C.gold, cursor: "pointer" }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontFamily: UI, fontSize: 10, color: C.t3 }}>{format ? format(min) : min}</span>
        <span style={{ fontFamily: UI, fontSize: 10, color: C.t3 }}>{format ? format(max) : max}</span>
      </div>
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.b1}`, borderRadius: 14, padding: "1.5rem", ...style }}>
      {children}
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <h3 style={{ fontFamily: DISPLAY, fontSize: "1.125rem", fontWeight: 700, color: C.t1, margin: "0 0 0.875rem", letterSpacing: "-0.01em" }}>
      {children}
    </h3>
  );
}

function StatBadge({ label, value, color = C.gold, dim = C.goldDim }) {
  return (
    <div style={{ background: dim, border: `1px solid ${color}33`, borderRadius: 10, padding: "0.875rem 1rem", textAlign: "center" }}>
      <div style={{ fontFamily: MONO, fontSize: "1.25rem", fontWeight: 700, color, marginBottom: 4 }}>{value}</div>
      <div style={{ fontFamily: UI, fontSize: "0.6875rem", color: C.t3, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
    </div>
  );
}

/* ─── Tab 1: Rent vs. Buy ───────────────────────────────────────── */
function RentVsBuy() {
  const [income,    setIncome]    = useState(85000);
  const [rent,      setRent]      = useState(2200);
  const [homePrice, setHomePrice] = useState(420000);
  const [downPct,   setDownPct]   = useState(20);
  const [rate,      setRate]      = useState(7.0);
  const [years,     setYears]     = useState(7);
  const [appRate,   setAppRate]   = useState(4.0);
  const [taxBracket, setTaxBracket] = useState(24);

  const results = useMemo(() => {
    const down      = homePrice * (downPct / 100);
    const loan      = homePrice - down;
    const mo        = rate / 100 / 12;
    const n         = 30 * 12;
    const mortgage  = loan * (mo * Math.pow(1 + mo, n)) / (Math.pow(1 + mo, n) - 1);
    const propTax   = homePrice * 0.012 / 12;
    const insurance = homePrice * 0.005 / 12;
    const maintenance = homePrice * 0.01 / 12;
    const pmi       = downPct < 20 ? (loan * 0.008 / 12) : 0;
    const totalBuy  = mortgage + propTax + insurance + maintenance + pmi;
    const buyToIncomeRatio = totalBuy / (income / 12);

    // Opportunity cost of down payment
    const oppCost = down * Math.pow(1.07, years) - down;

    // Equity built over horizon
    let balance = loan;
    for (let i = 0; i < years * 12; i++) {
      const interest = balance * mo;
      const principal = mortgage - interest;
      balance -= principal;
    }
    const equityFromPayments = loan - balance;
    const appreciation = homePrice * (Math.pow(1 + appRate / 100, years) - 1);
    const saleProceeds = homePrice * Math.pow(1 + appRate / 100, years) - balance - (homePrice * Math.pow(1 + appRate / 100, years) * 0.06);
    const totalBuyCost = down + (totalBuy * 12 * years) + (homePrice * 0.03); // closing costs
    const buyNetGain   = saleProceeds - totalBuyCost + down;

    // Rent scenario — invest down payment at 7% instead
    const rentInvested = down * Math.pow(1.07, years);
    const rentTotal    = rent * 12 * years * Math.pow(1.025, years / 2); // avg rent increases
    const buyMonthly = totalBuy;
    const rentMonthly = rent;
    const diff = buyMonthly - rentMonthly;
    const savedByRenting = diff > 0 ? diff * 12 * years * Math.pow(1.05, years / 2) : 0;

    const breakEvenYears = (() => {
      for (let y = 1; y <= 30; y++) {
        let bal = loan;
        let eq = 0;
        for (let i = 0; i < y * 12; i++) {
          const int = bal * mo; const prin = mortgage - int; bal -= prin; eq += prin;
        }
        const appr = homePrice * (Math.pow(1 + appRate / 100, y) - 1);
        const netEq = eq + appr - homePrice * 0.03 - homePrice * Math.pow(1 + appRate / 100, y) * 0.06;
        const rentCumul = rent * 12 * y;
        const buyCumul  = down + totalBuy * 12 * y;
        if (netEq + down > buyCumul - rentCumul) return y;
      }
      return ">30";
    })();

    return { mortgage, propTax, insurance, maintenance, pmi, totalBuy, buyToIncomeRatio,
      equityFromPayments, appreciation, saleProceeds, breakEvenYears, oppCost, down, loan };
  }, [income, rent, homePrice, downPct, rate, years, appRate, taxBracket]);

  const dtiOk = results.buyToIncomeRatio <= 0.28;
  const dtiWarn = results.buyToIncomeRatio > 0.28 && results.buyToIncomeRatio <= 0.36;
  const verdict = dtiOk ? "buy" : dtiWarn ? "caution" : "rent";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 20 }}>
      {/* Inputs */}
      <Card>
        <SectionHeading>Your Situation</SectionHeading>
        <Slider label="Annual Household Income" value={income} min={40000} max={400000} step={5000} format={fmt} onChange={setIncome} />
        <Slider label="Current / Target Monthly Rent" value={rent} min={800} max={8000} step={50} format={fmtM} onChange={setRent} />
        <Slider label="Target Home Price" value={homePrice} min={100000} max={2000000} step={10000} format={fmt} onChange={setHomePrice} />
        <Slider label="Down Payment" value={downPct} min={3} max={40} step={1} format={v => v + "%"} onChange={setDownPct} />
        <Slider label="Mortgage Rate" value={rate} min={3.0} max={12.0} step={0.1} format={v => v.toFixed(1) + "%"} onChange={setRate} />
        <Slider label="Years Before You'd Sell / Move" value={years} min={1} max={30} format={v => v + " yrs"} onChange={setYears} />
        <Slider label="Expected Annual Appreciation" value={appRate} min={0} max={10} step={0.5} format={v => v.toFixed(1) + "%"} onChange={setAppRate} />
      </Card>

      {/* Results */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Verdict */}
        <div style={{
          background: verdict === "buy" ? C.upDim : verdict === "caution" ? C.warnDim : C.downDim,
          border: `1px solid ${verdict === "buy" ? C.up : verdict === "caution" ? C.warn : C.down}44`,
          borderRadius: 14, padding: "1.25rem 1.5rem",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          {verdict === "buy" ? <CheckCircle2 size={22} color={C.up} /> : verdict === "caution" ? <AlertTriangle size={22} color={C.warn} /> : <XCircle size={22} color={C.down} />}
          <div>
            <div style={{ fontFamily: DISPLAY, fontSize: "1.0625rem", fontWeight: 700, color: C.t1, marginBottom: 3 }}>
              {verdict === "buy" ? "Buying looks favorable for your situation" : verdict === "caution" ? "Buying is possible but stretching your budget" : "Renting is likely the smarter financial move right now"}
            </div>
            <div style={{ fontFamily: UI, fontSize: "0.8125rem", color: C.t2 }}>
              Housing cost is {pct(results.buyToIncomeRatio * 100)} of gross income · guideline is ≤28%
            </div>
          </div>
        </div>

        {/* Monthly cost breakdown */}
        <Card>
          <SectionHeading>Monthly Cost Breakdown</SectionHeading>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Mortgage (P+I)", value: results.mortgage },
              { label: "Property Tax (~1.2%)", value: results.propTax },
              { label: "Homeowners Insurance", value: results.insurance },
              { label: "Maintenance Reserve (1%)", value: results.maintenance },
              ...(results.pmi > 0 ? [{ label: "PMI (down <20%)", value: results.pmi }] : []),
            ].map(row => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.b1}` }}>
                <span style={{ fontFamily: UI, fontSize: 13, color: C.t2 }}>{row.label}</span>
                <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: C.t1 }}>{fmtM(row.value)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 0" }}>
              <span style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: C.t1 }}>Total Monthly (Own)</span>
              <span style={{ fontFamily: MONO, fontSize: 15, fontWeight: 700, color: C.gold }}>{fmtM(results.totalBuy)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0 0" }}>
              <span style={{ fontFamily: UI, fontSize: 13, color: C.t2 }}>vs. Renting</span>
              <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: C.t2 }}>{fmtM(rent)}</span>
            </div>
          </div>
        </Card>

        {/* Key metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <StatBadge label="Break-Even" value={typeof results.breakEvenYears === "number" ? results.breakEvenYears + " yrs" : results.breakEvenYears} />
          <StatBadge label="Down Payment" value={fmt(results.down)} />
          <StatBadge label="Loan Amount" value={fmt(results.loan)} color={C.t2} dim="rgba(168,144,112,0.1)" />
        </div>
        {downPct < 20 && (
          <div style={{ background: C.warnDim, border: `1px solid ${C.warn}44`, borderRadius: 10, padding: "0.875rem 1rem", display: "flex", gap: 10 }}>
            <AlertTriangle size={16} color={C.warn} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontFamily: UI, fontSize: 12.5, color: C.t2, lineHeight: 1.6 }}>
              With less than 20% down you'll pay PMI ({fmtM(results.pmi)}/mo) until you reach 20% equity. Getting to 20% eliminates this cost permanently.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Tab 2: Affordability ──────────────────────────────────────── */
function Affordability() {
  const [income,   setIncome]   = useState(90000);
  const [debt,     setDebt]     = useState(500);
  const [rate,     setRate]     = useState(7.0);
  const [downAmt,  setDownAmt]  = useState(60000);
  const [taxes,    setTaxes]    = useState(400);
  const [insurance,setInsurance]= useState(150);

  const mo = income / 12;
  const maxFrontEnd = mo * 0.28;
  const maxBackEnd  = mo * 0.36;
  const maxPITI     = Math.min(maxFrontEnd, maxBackEnd - debt - taxes - insurance);
  const moRate      = rate / 100 / 12;
  const n           = 360;
  const maxLoan     = maxPITI > 0 ? maxPITI * ((Math.pow(1 + moRate, n) - 1) / (moRate * Math.pow(1 + moRate, n))) : 0;
  const maxPrice    = maxLoan + downAmt;

  const rules = [
    { rule: "28% Front-End Rule", limit: mo * 0.28, desc: "Max PITI (mortgage + taxes + insurance) as % of gross monthly income" },
    { rule: "36% Back-End Rule",  limit: mo * 0.36 - debt, desc: "Max total debt payments including all monthly obligations" },
    { rule: "Conservative (25%)",  limit: mo * 0.25, desc: "Dave Ramsey / conservative guideline — more financial breathing room" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 20 }}>
      <Card>
        <SectionHeading>Your Financial Profile</SectionHeading>
        <Slider label="Annual Gross Income" value={income} min={30000} max={500000} step={5000} format={fmt} onChange={setIncome} />
        <Slider label="Monthly Debt Payments (car, student loans, credit cards)" value={debt} min={0} max={3000} step={50} format={fmtM} onChange={setDebt} />
        <Slider label="Mortgage Interest Rate" value={rate} min={3.0} max={12.0} step={0.1} format={v => v.toFixed(1) + "%"} onChange={setRate} />
        <Slider label="Down Payment Available" value={downAmt} min={5000} max={500000} step={5000} format={fmt} onChange={setDownAmt} />
        <Slider label="Est. Monthly Property Tax" value={taxes} min={0} max={3000} step={25} format={fmtM} onChange={setTaxes} />
        <Slider label="Est. Monthly Insurance" value={insurance} min={50} max={500} step={10} format={fmtM} onChange={setInsurance} />
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Card>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: UI, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: C.t3, marginBottom: 8 }}>Maximum Affordable Home Price</div>
            <div style={{ fontFamily: DISPLAY, fontSize: "2.5rem", fontWeight: 700, color: C.gold, letterSpacing: "-0.02em" }}>{fmt(maxPrice)}</div>
            <div style={{ fontFamily: UI, fontSize: 12.5, color: C.t2, marginTop: 6 }}>Based on the 28% front-end rule · {fmt(downAmt)} down payment included</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {rules.map(r => {
              const ratio = Math.min(1, maxPITI / r.limit);
              const ok = maxPITI <= r.limit;
              return (
                <div key={r.rule} style={{ background: C.raised, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontFamily: UI, fontSize: 12, fontWeight: 600, color: C.t1 }}>{r.rule}</span>
                    <span style={{ fontFamily: MONO, fontSize: 12, color: ok ? C.up : C.down, fontWeight: 700 }}>{fmtM(r.limit)}/mo max</span>
                  </div>
                  <div style={{ height: 5, background: C.b2, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${ratio * 100}%`, background: ok ? C.up : C.down, borderRadius: 3, transition: "width 0.4s" }} />
                  </div>
                  <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, marginTop: 5 }}>{r.desc}</div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <SectionHeading>What Kills Affordability</SectionHeading>
          {[
            { label: "Rate +1%", impact: `Cuts buying power by ~${pct(10)}` },
            { label: "Existing debt $500/mo", impact: "Reduces max loan by ~$75K" },
            { label: "Skipping 20% down", impact: "Adds PMI + higher rate risk" },
            { label: "Buying at the top of budget", impact: "No buffer for job loss or rate reset" },
          ].map(r => (
            <div key={r.label} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
              <XCircle size={14} color={C.down} style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                <span style={{ fontFamily: UI, fontSize: 13, color: C.t1, fontWeight: 600 }}>{r.label}: </span>
                <span style={{ fontFamily: UI, fontSize: 13, color: C.t2 }}>{r.impact}</span>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* ─── Tab 3: True Cost ──────────────────────────────────────────── */
function TrueCost() {
  const [price, setPrice] = useState(400000);
  const [rate,  setRate]  = useState(7.0);
  const [down,  setDown]  = useState(20);
  const [years, setYears] = useState(10);

  const loan     = price * (1 - down / 100);
  const mo       = rate / 100 / 12;
  const n        = 360;
  const mortgage = loan * (mo * Math.pow(1 + mo, n)) / (Math.pow(1 + mo, n) - 1);
  const closing  = price * 0.03;
  const propTax  = price * 0.012 / 12;
  const insurance= price * 0.005 / 12;
  const maint    = price * 0.01 / 12;
  const pmi      = down < 20 ? (loan * 0.008 / 12) : 0;
  const hoa      = 200;
  const totalMo  = mortgage + propTax + insurance + maint + pmi + hoa;
  const totalPaid = closing + price * (down / 100) + totalMo * 12 * years;
  const appValue = price * Math.pow(1.04, years);
  let bal = loan;
  for (let i = 0; i < years * 12; i++) { const int = bal * mo; bal -= (mortgage - int); }
  const equity = appValue - bal;

  const costs = [
    { label: "Mortgage (P+I)", mo: mortgage, annual: mortgage * 12, icon: "🏠" },
    { label: "Property Tax", mo: propTax, annual: propTax * 12, icon: "🏛" },
    { label: "Homeowners Insurance", mo: insurance, annual: insurance * 12, icon: "🛡" },
    { label: "Maintenance & Repairs (1%/yr)", mo: maint, annual: maint * 12, icon: "🔧" },
    { label: "HOA (est.)", mo: hoa, annual: hoa * 12, icon: "🏘" },
    ...(pmi > 0 ? [{ label: "PMI", mo: pmi, annual: pmi * 12, icon: "⚠️" }] : []),
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 20 }}>
      <Card>
        <SectionHeading>Home Details</SectionHeading>
        <Slider label="Home Purchase Price" value={price} min={100000} max={2000000} step={10000} format={fmt} onChange={setPrice} />
        <Slider label="Mortgage Rate" value={rate} min={3.0} max={12.0} step={0.1} format={v => v.toFixed(1) + "%"} onChange={setRate} />
        <Slider label="Down Payment" value={down} min={3} max={40} format={v => v + "%"} onChange={setDown} />
        <Slider label="Holding Period" value={years} min={1} max={30} format={v => v + " years"} onChange={setYears} />

        <div style={{ marginTop: 24, padding: "1rem", background: C.raised, borderRadius: 10 }}>
          <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>One-Time Buying Costs</div>
          {[
            { label: "Down Payment", value: price * (down / 100) },
            { label: "Closing Costs (~3%)", value: closing },
            { label: "Moving + Setup", value: 5000 },
          ].map(r => (
            <div key={r.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontFamily: UI, fontSize: 12, color: C.t2 }}>{r.label}</span>
              <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: C.t1 }}>{fmt(r.value)}</span>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${C.b2}`, marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: UI, fontSize: 12, fontWeight: 700, color: C.t1 }}>Total to Close</span>
            <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: C.gold }}>{fmt(price * (down / 100) + closing + 5000)}</span>
          </div>
        </div>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <StatBadge label="True Monthly Cost" value={fmtM(totalMo)} />
          <StatBadge label="Projected Equity" value={fmt(equity)} color={C.up} dim={C.upDim} />
        </div>

        <Card>
          <SectionHeading>Monthly Cost Breakdown</SectionHeading>
          {costs.map(c => (
            <div key={c.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.b1}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14 }}>{c.icon}</span>
                <span style={{ fontFamily: UI, fontSize: 12.5, color: C.t2 }}>{c.label}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: C.t1 }}>{fmtM(c.mo)}</div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: C.t3 }}>{fmt(c.annual)}/yr</div>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10 }}>
            <span style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: C.t1 }}>Total Monthly</span>
            <span style={{ fontFamily: MONO, fontSize: 15, fontWeight: 700, color: C.gold }}>{fmtM(totalMo)}</span>
          </div>
        </Card>

        <Card>
          <SectionHeading>Over {years} Years</SectionHeading>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Total Cash Out-of-Pocket", value: fmt(totalPaid), color: C.down },
              { label: `Home Value at ${years} Yrs (4% appreciation)`, value: fmt(appValue), color: C.up },
              { label: "Projected Equity (value − remaining loan)", value: fmt(equity), color: C.up },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.b1}` }}>
                <span style={{ fontFamily: UI, fontSize: 12.5, color: C.t2 }}>{r.label}</span>
                <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: r.color }}>{r.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ─── Education Cards ────────────────────────────────────────────── */
function Education() {
  const cards = [
    {
      title: "Conventional Loan",
      badge: "Most Common",
      badgeColor: C.up,
      points: [
        "Requires 620+ credit score (740+ for best rates)",
        "20% down avoids PMI; 3–5% programs available",
        "Conforming limit: $766,550 (2024)",
        "Fixed or adjustable rate options",
        "Best for: buyers with strong credit and stable income",
      ],
    },
    {
      title: "FHA Loan",
      badge: "Low Down Payment",
      badgeColor: C.gold,
      points: [
        "3.5% down with 580+ credit score",
        "MIP (mortgage insurance) required for life of loan if <10% down",
        "Loan limits vary by county (~$498K–$1.15M in 2024)",
        "More flexible debt-to-income ratios",
        "Best for: first-time buyers with limited savings or lower credit",
      ],
    },
    {
      title: "VA Loan",
      badge: "Veterans Only",
      badgeColor: "#818cf8",
      points: [
        "0% down payment required — no PMI ever",
        "Competitive rates, flexible credit requirements",
        "One-time funding fee (1.25–3.3%) rolled into loan",
        "Must be primary residence; service requirement applies",
        "Best for: eligible veterans and active service members",
      ],
    },
    {
      title: "Key Ratios to Know",
      badge: "Core Concept",
      badgeColor: C.t3,
      points: [
        "DTI (Debt-to-Income): total monthly debt ÷ gross income",
        "LTV (Loan-to-Value): loan amount ÷ home value",
        "Front-end ratio: housing costs only ≤28%",
        "Back-end ratio: all debt ≤36–43%",
        "DSCR: used for investment properties (NOI ÷ debt service ≥1.25)",
      ],
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {cards.map(c => (
        <Card key={c.title}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <SectionHeading>{c.title}</SectionHeading>
            <span style={{ marginLeft: "auto", fontFamily: UI, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: c.badgeColor, background: `${c.badgeColor}18`, border: `1px solid ${c.badgeColor}33`, borderRadius: 5, padding: "2px 8px", whiteSpace: "nowrap" }}>{c.badge}</span>
          </div>
          {c.points.map(p => (
            <div key={p} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.gold, marginTop: 6, flexShrink: 0 }} />
              <span style={{ fontFamily: UI, fontSize: 12.5, color: C.t2, lineHeight: 1.6 }}>{p}</span>
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────── */
const TABS = [
  { id: "rentbuy",    label: "Rent vs. Buy",       icon: Home },
  { id: "afford",     label: "Affordability",       icon: Calculator },
  { id: "truecost",   label: "True Cost of Ownership", icon: DollarSign },
  { id: "education",  label: "Loan Types & Concepts",  icon: Info },
];

export default function RealEstatePlanning() {
  const [tab, setTab] = useState("rentbuy");

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Hero */}
      <div style={{ background: C.surface, border: "1px solid var(--border-c)", borderRadius: 20, padding: "2rem 2.25rem", marginBottom: "1.25rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -40, width: 300, height: 300, background: "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.625rem" }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: C.goldDim, border: `1px solid ${C.goldBdr}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Home size={14} color={C.gold} />
          </div>
          <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: "var(--text-1)", fontFamily: UI }}>
            REAL ESTATE{" "}
            <em style={{ fontFamily: DISPLAY, fontStyle: "italic", color: C.gold, fontWeight: 400, fontSize: "1.5rem" }}>Planning</em>
          </h1>
        </div>
        <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.65, maxWidth: 580, margin: "0 0 1rem", fontFamily: UI }}>
          Determine when to buy or rent, how much house you can truly afford, and what homeownership actually costs beyond the mortgage payment.
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {["Rent vs. Buy", "28% Rule", "True Cost", "Mortgage Types", "Down Payment Strategy"].map(t => (
            <span key={t} style={{ fontSize: "0.6875rem", fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: C.goldDim, border: `1px solid ${C.goldBdr}`, color: C.gold, fontFamily: UI }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: "1.25rem", background: C.surface, border: "1px solid var(--border-c)", borderRadius: 12, padding: 4 }}>
        {TABS.map(t => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "0.5rem 0.75rem", borderRadius: 8, border: "none", cursor: "pointer",
              background: active ? C.raised : "transparent",
              color: active ? C.gold : C.t3, fontFamily: UI, fontSize: 13, fontWeight: active ? 700 : 500,
              transition: "all 0.18s",
            }}>
              <Icon size={14} />{t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {tab === "rentbuy"   && <RentVsBuy />}
      {tab === "afford"    && <Affordability />}
      {tab === "truecost"  && <TrueCost />}
      {tab === "education" && <Education />}
    </div>
  );
}
