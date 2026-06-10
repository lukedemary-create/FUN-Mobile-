import React, { useState, useMemo } from "react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  ShieldCheck, Calendar, DollarSign, TrendingUp,
  Users, AlertCircle, CheckCircle, Info,
} from "lucide-react";

/* ─── Constants ─────────────────────────────────────────────────── */
const GOLD   = "#c9a84c";
const TEAL   = "#4dd0c4";
const GREEN  = "#4caf7d";
const RED    = "#e05c5c";
const BLUE   = "#4c9fcf";
const PURPLE = "#9b6cdb";

/* ─── Helpers ───────────────────────────────────────────────────── */
const fmt = (n) => "$" + Math.round(n || 0).toLocaleString();
const fmtK = (n) => {
  const abs = Math.abs(n || 0);
  if (abs >= 1_000_000) return "$" + (n / 1_000_000).toFixed(2) + "M";
  if (abs >= 1_000)     return "$" + (n / 1_000).toFixed(1) + "K";
  return "$" + Math.round(n || 0).toLocaleString();
};

/* ─── Life expectancy map ───────────────────────────────────────── */
const HEALTH_MAP = {
  excellent:     { label: "Excellent (90+)",         age: 92 },
  good:          { label: "Good (82–90)",             age: 86 },
  average:       { label: "Average (78–82)",          age: 80 },
  below_average: { label: "Below Average (under 78)", age: 76 },
};

/* ─── Benefit multipliers ───────────────────────────────────────── */
const MULT_62 = 0.70;
const MULT_67 = 1.00;
const MULT_70 = 1.24;

function calcLifetime(monthlyBenefit, claimAge, lifeAge) {
  const months = Math.max(0, (lifeAge - claimAge) * 12);
  return monthlyBenefit * months;
}

function calcBreakeven(monthly62, monthly67, monthly70) {
  // 62 vs 67
  let be6267 = null;
  for (let age = 62; age <= 100; age += 0.01) {
    const t62 = monthly62 * Math.max(0, (age - 62) * 12);
    const t67 = monthly67 * Math.max(0, (age - 67) * 12);
    if (t67 >= t62) { be6267 = +age.toFixed(1); break; }
  }
  // 67 vs 70
  let be6770 = null;
  for (let age = 67; age <= 100; age += 0.01) {
    const t67 = monthly67 * Math.max(0, (age - 67) * 12);
    const t70 = monthly70 * Math.max(0, (age - 70) * 12);
    if (t70 >= t67) { be6770 = +age.toFixed(1); break; }
  }
  // 62 vs 70
  let be6270 = null;
  for (let age = 62; age <= 100; age += 0.01) {
    const t62 = monthly62 * Math.max(0, (age - 62) * 12);
    const t70 = monthly70 * Math.max(0, (age - 70) * 12);
    if (t70 >= t62) { be6270 = +age.toFixed(1); break; }
  }
  return { be6267, be6770, be6270 };
}

function buildChartData(monthly62, monthly67, monthly70) {
  const data = [];
  for (let age = 62; age <= 95; age++) {
    data.push({
      age,
      "Claim at 62":  Math.round(monthly62 * Math.max(0, (age - 62) * 12)),
      "Claim at 67":  Math.round(monthly67 * Math.max(0, (age - 67) * 12)),
      "Claim at 70":  Math.round(monthly70 * Math.max(0, (age - 70) * 12)),
    });
  }
  return data;
}

/* ─── Custom Tooltip ────────────────────────────────────────────── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border-c)",
      borderRadius: 8, padding: "0.75rem 1rem", fontSize: "0.78rem",
    }}>
      <div style={{ fontWeight: 700, color: "var(--text-1)", marginBottom: "0.4rem" }}>
        Age {label}
      </div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color, marginBottom: "0.2rem" }}>
          {p.name}: {fmtK(p.value)}
        </div>
      ))}
    </div>
  );
}

/* ─── Scenario Card ─────────────────────────────────────────────── */
function ScenarioCard({ title, subtitle, color, monthly, lifeAge, isWinner }) {
  const annual   = monthly * 12;
  const lifetime = calcLifetime(monthly, parseInt(title.match(/\d+/)[0]), lifeAge);
  return (
    <div className="t-card" style={{
      padding: "1.25rem",
      border: isWinner ? `2px solid ${color}` : "1px solid var(--border-c)",
      position: "relative",
      flex: 1,
    }}>
      {isWinner && (
        <div style={{
          position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
          background: color, color: "#000", fontSize: "0.65rem", fontWeight: 800,
          padding: "0.2rem 0.75rem", borderRadius: 99, letterSpacing: "0.08em",
          textTransform: "uppercase", whiteSpace: "nowrap",
        }}>
          Best for You
        </div>
      )}
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <div style={{ fontSize: "1rem", fontWeight: 800, color }}>{title}</div>
        <div style={{ fontSize: "0.72rem", color: "var(--text-3)" }}>{subtitle}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        <Row label="Monthly Benefit" value={fmt(monthly)} color={color} />
        <Row label="Annual Benefit"  value={fmt(annual)}  color={color} />
        <Row label="Lifetime Total"  value={fmtK(lifetime)} color={color} large />
      </div>
    </div>
  );
}

function Row({ label, value, color, large }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: "0.73rem", color: "var(--text-3)" }}>{label}</span>
      <span className="t-mono" style={{
        color, fontWeight: large ? 800 : 600,
        fontSize: large ? "1.05rem" : "0.88rem",
      }}>
        {value}
      </span>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────── */
export default function SocialSecurity() {
  const [currentAge,    setCurrentAge]    = useState(58);
  const [fraMonthly,    setFraMonthly]    = useState(2400);
  const [health,        setHealth]        = useState("good");
  const [maritalStatus, setMaritalStatus] = useState("single");
  const [spouseFra,     setSpouseFra]     = useState(1800);
  const [otherIncome,   setOtherIncome]   = useState(20000);

  /* ─── Core calculations ─────────────────────────────────────── */
  const calc = useMemo(() => {
    const fra   = Math.max(0, fraMonthly);
    const m62   = fra * MULT_62;
    const m67   = fra * MULT_67;
    const m70   = fra * MULT_70;
    const lifeAge = HEALTH_MAP[health].age;

    const lt62 = calcLifetime(m62, 62, lifeAge);
    const lt67 = calcLifetime(m67, 67, lifeAge);
    const lt70 = calcLifetime(m70, 70, lifeAge);

    let winner = "67";
    const maxLT = Math.max(lt62, lt67, lt70);
    if (lt62 === maxLT) winner = "62";
    else if (lt70 === maxLT) winner = "70";

    const { be6267, be6770, be6270 } = calcBreakeven(m62, m67, m70);
    const chartData = buildChartData(m62, m67, m70);

    // Spousal
    const selfFra = fra;
    const spouseFraB = Math.max(0, spouseFra);
    const higherFra  = Math.max(selfFra, spouseFraB);
    const lowerFra   = Math.min(selfFra, spouseFraB);
    const spousalBenefit = Math.max(lowerFra, higherFra * 0.5);
    const spousalExtra   = Math.max(0, spousalBenefit - lowerFra);
    const survivorBenefit = higherFra * MULT_70; // if higher earner delays to 70

    // Tax calculation
    const annualSS  = m67 * 12;
    const combinedIncome = otherIncome + annualSS * 0.5;
    let taxablePct = 0;
    if (combinedIncome > 34_000) taxablePct = 0.85;
    else if (combinedIncome > 25_000) taxablePct = 0.50;
    const taxableAmount = annualSS * taxablePct;

    return {
      m62, m67, m70, lt62, lt67, lt70,
      winner, lifeAge,
      be6267, be6770, be6270,
      chartData,
      spousalBenefit, spousalExtra, survivorBenefit,
      annualSS, taxablePct, taxableAmount, combinedIncome,
    };
  }, [fraMonthly, health, spouseFra, otherIncome]);

  /* ─── Render ────────────────────────────────────────────────── */
  return (
    <div style={{ maxWidth: 1280 }}>

      {/* Hero Banner */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border-c)",
        borderRadius: 20, padding: "2rem 2.25rem", marginBottom: "1.5rem",
        position: "relative", overflow: "hidden",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 var(--border-c)",
      }}>
        <div style={{ position: "absolute", top: -60, right: -40, width: 320, height: 320, background: "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <p style={{ fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)", margin: "0 0 0.625rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ display: "inline-block", width: 18, height: 1, background: "var(--gold)", opacity: 0.6 }} />
            Wealth · Planning
          </p>
          <h1 style={{ margin: "0 0 0.5rem", fontSize: "1.35rem", fontWeight: 700, color: "var(--text-1)", letterSpacing: "-0.01em", fontFamily: "'Inter', system-ui, sans-serif" }}>
            Social Security{" "}
            <em style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", color: "var(--gold)", fontWeight: 400, fontSize: "1.5rem" }}>Optimizer</em>
          </h1>
          <p style={{ margin: "0 0 1.5rem", color: "var(--text-3)", fontSize: "0.875rem", lineHeight: 1.65, maxWidth: 560 }}>
            Find the optimal claiming age to maximize your lifetime Social Security benefits
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { label: "Full Retirement Age",    value: "Age 67",    color: GOLD   },
              { label: "Early Claiming Penalty", value: "−30%",      color: RED    },
              { label: "Delayed Bonus / Year",   value: "+8%",       color: GREEN  },
              { label: "Max Monthly 2025",       value: "$4,873",    color: TEAL   },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: `${color}10`, border: `1px solid ${color}30`, borderRadius: 8, padding: "0.5rem 0.875rem" }}>
                <div className="t-mono" style={{ fontSize: "1.25rem", fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 10, color: "var(--text-3)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "1.25rem", alignItems: "start" }}>

        {/* ── Inputs Panel ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="t-card t-card-p">
            <div style={{ fontWeight: 700, color: "var(--text-1)", marginBottom: "1rem", fontSize: "0.88rem" }}>
              Your Information
            </div>

            {/* Current Age */}
            <div style={{ marginBottom: "1.2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <label className="t-label">Current Age</label>
                <span className="t-mono" style={{ color: GOLD, fontWeight: 700 }}>{currentAge}</span>
              </div>
              <input
                type="range" min={45} max={69} value={currentAge}
                onChange={(e) => setCurrentAge(+e.target.value)}
                style={{ width: "100%", accentColor: GOLD }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "var(--text-3)", marginTop: "0.2rem" }}>
                <span>45</span><span>69</span>
              </div>
            </div>

            {/* FRA Benefit */}
            <div style={{ marginBottom: "1.2rem" }}>
              <label className="t-label" style={{ display: "block", marginBottom: "0.4rem" }}>
                Monthly Benefit at FRA (Age 67)
              </label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)",
                  color: "var(--text-3)", fontSize: "0.85rem",
                }}>$</span>
                <input
                  type="number" min={0} max={4873} value={fraMonthly}
                  onChange={(e) => setFraMonthly(+e.target.value)}
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "var(--bg)", border: "1px solid var(--border-c)",
                    borderRadius: 6, padding: "0.5rem 0.75rem 0.5rem 1.5rem",
                    color: "var(--text-1)", fontSize: "0.9rem",
                  }}
                />
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-3)", marginTop: "0.3rem" }}>
                Check your my Social Security account for your estimate
              </div>
            </div>

            {/* Health */}
            <div style={{ marginBottom: "1.2rem" }}>
              <label className="t-label" style={{ display: "block", marginBottom: "0.5rem" }}>
                Health / Life Expectancy
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {Object.entries(HEALTH_MAP).map(([key, { label }]) => (
                  <button
                    key={key}
                    onClick={() => setHealth(key)}
                    style={{
                      background: health === key ? "rgba(201,169,110,0.15)" : "var(--bg)",
                      border: health === key ? `1px solid ${GOLD}` : "1px solid var(--border-c)",
                      borderRadius: 6, padding: "0.45rem 0.75rem",
                      color: health === key ? GOLD : "var(--text-2)",
                      fontSize: "0.78rem", fontWeight: health === key ? 700 : 400,
                      cursor: "pointer", textAlign: "left", transition: "all 0.2s",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Marital Status */}
            <div style={{ marginBottom: "1.2rem" }}>
              <label className="t-label" style={{ display: "block", marginBottom: "0.5rem" }}>
                Marital Status
              </label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {["single", "married"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setMaritalStatus(s)}
                    style={{
                      flex: 1,
                      background: maritalStatus === s ? "rgba(77,208,196,0.15)" : "var(--bg)",
                      border: maritalStatus === s ? `1px solid ${TEAL}` : "1px solid var(--border-c)",
                      borderRadius: 6, padding: "0.45rem",
                      color: maritalStatus === s ? TEAL : "var(--text-2)",
                      fontSize: "0.78rem", fontWeight: maritalStatus === s ? 700 : 400,
                      cursor: "pointer", textTransform: "capitalize", transition: "all 0.2s",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Spouse FRA benefit */}
            {maritalStatus === "married" && (
              <div style={{ marginBottom: "1.2rem" }}>
                <label className="t-label" style={{ display: "block", marginBottom: "0.4rem" }}>
                  Spouse's Monthly Benefit at FRA
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{
                    position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)",
                    color: "var(--text-3)", fontSize: "0.85rem",
                  }}>$</span>
                  <input
                    type="number" min={0} max={4873} value={spouseFra}
                    onChange={(e) => setSpouseFra(+e.target.value)}
                    style={{
                      width: "100%", boxSizing: "border-box",
                      background: "var(--bg)", border: "1px solid var(--border-c)",
                      borderRadius: 6, padding: "0.5rem 0.75rem 0.5rem 1.5rem",
                      color: "var(--text-1)", fontSize: "0.9rem",
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Key Rules */}
          <div className="t-card t-card-p">
            <div style={{ fontWeight: 700, color: "var(--text-1)", marginBottom: "0.9rem", fontSize: "0.88rem" }}>
              Key Rules
            </div>
            {[
              { icon: AlertCircle, color: RED,    text: "Claiming at 62 permanently reduces your benefit by up to 30%." },
              { icon: TrendingUp,  color: GREEN,  text: "Each year delayed past FRA adds 8% permanently to your benefit." },
              { icon: DollarSign,  color: GOLD,   text: "Benefits receive annual COLA inflation adjustments." },
              { icon: Info,        color: BLUE,   text: "Working before FRA while claiming can reduce benefits (earnings test)." },
            ].map(({ icon: Icon, color, text }, i) => (
              <div key={i} style={{
                display: "flex", gap: "0.65rem", alignItems: "flex-start",
                padding: "0.65rem 0",
                borderBottom: i < 3 ? "1px solid var(--border-c)" : "none",
              }}>
                <Icon size={15} color={color} style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: "0.75rem", color: "var(--text-2)", lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Results Panel ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Scenario Cards */}
          <div className="t-card t-card-p">
            <div style={{ fontWeight: 700, color: "var(--text-1)", marginBottom: "0.4rem", fontSize: "0.88rem" }}>
              Claiming Age Comparison
            </div>
            <div style={{ fontSize: "0.73rem", color: "var(--text-3)", marginBottom: "1rem" }}>
              Lifetime totals based on life expectancy: Age {calc.lifeAge} ({HEALTH_MAP[health].label})
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <ScenarioCard
                title="Claim at 62 (Early)"
                subtitle="30% permanent reduction"
                color={RED}
                monthly={calc.m62}
                lifeAge={calc.lifeAge}
                isWinner={calc.winner === "62"}
              />
              <ScenarioCard
                title="Claim at 67 (FRA)"
                subtitle="Full Retirement Age benefit"
                color={GOLD}
                monthly={calc.m67}
                lifeAge={calc.lifeAge}
                isWinner={calc.winner === "67"}
              />
              <ScenarioCard
                title="Claim at 70 (Maximum)"
                subtitle="+24% permanent increase"
                color={GREEN}
                monthly={calc.m70}
                lifeAge={calc.lifeAge}
                isWinner={calc.winner === "70"}
              />
            </div>
          </div>

          {/* Breakeven Analysis */}
          <div className="t-card t-card-p">
            <div style={{ fontWeight: 700, color: "var(--text-1)", marginBottom: "1rem", fontSize: "0.88rem" }}>
              Breakeven Analysis
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
              {[
                {
                  label: "62 vs 67",
                  age: calc.be6267,
                  desc: `If you live past age ${calc.be6267 ?? "—"}, claiming at 67 pays more total than claiming at 62.`,
                  color: GOLD,
                },
                {
                  label: "67 vs 70",
                  age: calc.be6770,
                  desc: `If you live past age ${calc.be6770 ?? "—"}, claiming at 70 pays more total than claiming at 67.`,
                  color: GREEN,
                },
                {
                  label: "62 vs 70",
                  age: calc.be6270,
                  desc: `If you live past age ${calc.be6270 ?? "—"}, claiming at 70 pays more total than claiming at 62.`,
                  color: TEAL,
                },
              ].map(({ label, age, desc, color }) => (
                <div key={label} style={{
                  background: "var(--bg)", borderRadius: 8,
                  border: `1px solid var(--border-c)`, padding: "1rem",
                }}>
                  <div className="t-label" style={{ marginBottom: "0.4rem" }}>{label} Breakeven</div>
                  <div className="t-mono" style={{ fontSize: "1.6rem", fontWeight: 900, color, lineHeight: 1, marginBottom: "0.5rem" }}>
                    Age {age ?? "—"}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-3)", lineHeight: 1.5 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Cumulative Benefits Chart */}
          <div className="t-card t-card-p">
            <div style={{ fontWeight: 700, color: "var(--text-1)", marginBottom: "0.3rem", fontSize: "0.88rem" }}>
              Cumulative Lifetime Benefits
            </div>
            <div style={{ fontSize: "0.73rem", color: "var(--text-3)", marginBottom: "1rem" }}>
              Lines cross at breakeven ages — where a later claiming strategy overtakes an earlier one
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={calc.chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="g62" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={RED}   stopOpacity={0.25} />
                    <stop offset="95%" stopColor={RED}   stopOpacity={0.03} />
                  </linearGradient>
                  <linearGradient id="g67" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={GOLD}  stopOpacity={0.25} />
                    <stop offset="95%" stopColor={GOLD}  stopOpacity={0.03} />
                  </linearGradient>
                  <linearGradient id="g70" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={GREEN} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={GREEN} stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border-c)" strokeOpacity={0.4} />
                <XAxis
                  dataKey="age"
                  tick={{ fontSize: 11, fill: "var(--text-3)" }}
                  label={{ value: "Age", position: "insideBottom", offset: -2, fill: "var(--text-3)", fontSize: 11 }}
                />
                <YAxis
                  tickFormatter={(v) => fmtK(v)}
                  tick={{ fontSize: 11, fill: "var(--text-3)" }}
                  width={65}
                />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: "0.75rem", paddingTop: "0.5rem" }} />
                <Area type="monotone" dataKey="Claim at 62" stroke={RED}   fill="url(#g62)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="Claim at 67" stroke={GOLD}  fill="url(#g67)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="Claim at 70" stroke={GREEN} fill="url(#g70)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Spousal Benefits */}
          {maritalStatus === "married" && (
            <div className="t-card t-card-p">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <Users size={16} color={PURPLE} />
                <div style={{ fontWeight: 700, color: "var(--text-1)", fontSize: "0.88rem" }}>
                  Spousal &amp; Survivor Benefits
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                <div style={{ background: "var(--bg)", borderRadius: 8, border: "1px solid var(--border-c)", padding: "1rem" }}>
                  <div className="t-label" style={{ marginBottom: "0.4rem" }}>Spousal Benefit</div>
                  <div className="t-mono" style={{ fontSize: "1.3rem", fontWeight: 900, color: PURPLE, marginBottom: "0.4rem" }}>
                    {fmt(calc.spousalBenefit)}/mo
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-3)", lineHeight: 1.5 }}>
                    The lower-earning spouse may claim up to 50% of the higher earner's FRA benefit.
                    {calc.spousalExtra > 0 && ` That's ${fmt(calc.spousalExtra)}/mo more than their own benefit.`}
                  </div>
                </div>
                <div style={{ background: "var(--bg)", borderRadius: 8, border: "1px solid var(--border-c)", padding: "1rem" }}>
                  <div className="t-label" style={{ marginBottom: "0.4rem" }}>Survivor Benefit (if higher earner claims at 70)</div>
                  <div className="t-mono" style={{ fontSize: "1.3rem", fontWeight: 900, color: TEAL, marginBottom: "0.4rem" }}>
                    {fmt(calc.survivorBenefit)}/mo
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-3)", lineHeight: 1.5 }}>
                    The surviving spouse receives the deceased's benefit. Delaying the higher earner to 70 maximizes this amount permanently.
                  </div>
                </div>
              </div>
              <div style={{
                background: "rgba(155,108,219,0.08)", border: "1px solid rgba(155,108,219,0.3)",
                borderRadius: 8, padding: "0.85rem 1rem",
              }}>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                  <CheckCircle size={15} color={PURPLE} style={{ marginTop: 2, flexShrink: 0 }} />
                  <div style={{ fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.6 }}>
                    <strong style={{ color: PURPLE }}>Recommended married strategy:</strong> Have the lower-earning spouse claim early (at 62–65) to bring in income while the higher-earning spouse delays to age 70. This maximizes the survivor benefit the remaining spouse receives for life.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tax on Social Security */}
          <div className="t-card t-card-p">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <DollarSign size={16} color={GOLD} />
              <div style={{ fontWeight: 700, color: "var(--text-1)", fontSize: "0.88rem" }}>
                Tax on Social Security Benefits
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {/* Thresholds */}
              <div>
                <div className="t-label" style={{ marginBottom: "0.75rem" }}>Income Thresholds (Single Filers)</div>
                {[
                  { range: "Under $25,000",      pct: "0% taxable",       color: GREEN  },
                  { range: "$25,000 – $34,000",   pct: "Up to 50% taxable", color: GOLD  },
                  { range: "Over $34,000",        pct: "Up to 85% taxable", color: RED   },
                ].map(({ range, pct, color }) => (
                  <div key={range} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "0.55rem 0", borderBottom: "1px solid var(--border-c)",
                  }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-2)" }}>{range}</span>
                    <span className="t-badge" style={{ background: `${color}22`, color, border: `1px solid ${color}44`, fontSize: "0.68rem" }}>{pct}</span>
                  </div>
                ))}
                <div style={{ fontSize: "0.68rem", color: "var(--text-3)", marginTop: "0.5rem" }}>
                  Combined income = other income + 50% of SS benefits
                </div>
              </div>

              {/* Calculator */}
              <div>
                <div className="t-label" style={{ marginBottom: "0.5rem" }}>Your Tax Estimate</div>
                <div style={{ marginBottom: "0.75rem" }}>
                  <label style={{ fontSize: "0.73rem", color: "var(--text-3)", display: "block", marginBottom: "0.3rem" }}>
                    Other Annual Income (wages, pension, etc.)
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{
                      position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)",
                      color: "var(--text-3)", fontSize: "0.85rem",
                    }}>$</span>
                    <input
                      type="number" min={0} value={otherIncome}
                      onChange={(e) => setOtherIncome(+e.target.value)}
                      style={{
                        width: "100%", boxSizing: "border-box",
                        background: "var(--bg)", border: "1px solid var(--border-c)",
                        borderRadius: 6, padding: "0.5rem 0.75rem 0.5rem 1.5rem",
                        color: "var(--text-1)", fontSize: "0.9rem",
                      }}
                    />
                  </div>
                </div>
                <div style={{ background: "var(--bg)", borderRadius: 8, border: "1px solid var(--border-c)", padding: "0.85rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "0.73rem", color: "var(--text-3)" }}>Annual SS at FRA</span>
                      <span className="t-mono" style={{ fontSize: "0.82rem", color: "var(--text-1)" }}>{fmt(calc.annualSS)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "0.73rem", color: "var(--text-3)" }}>Combined Income</span>
                      <span className="t-mono" style={{ fontSize: "0.82rem", color: "var(--text-1)" }}>{fmt(calc.combinedIncome)}</span>
                    </div>
                    <div style={{ height: 1, background: "var(--border-c)" }} />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "0.73rem", color: "var(--text-3)" }}>Taxable Portion</span>
                      <span className="t-mono" style={{ fontSize: "0.88rem", fontWeight: 700, color: calc.taxablePct > 0 ? RED : GREEN }}>
                        {Math.round(calc.taxablePct * 100)}%
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "0.73rem", color: "var(--text-3)" }}>Taxable SS Amount</span>
                      <span className="t-mono" style={{ fontSize: "0.88rem", fontWeight: 700, color: calc.taxablePct > 0 ? RED : GREEN }}>
                        {fmt(calc.taxableAmount)}/yr
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
