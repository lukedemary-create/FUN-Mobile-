import React, { useState, lazy, Suspense } from "react";
import {
  ShieldAlert, LayoutDashboard, Briefcase, User, BookOpen,
  GitCompare, BarChart2, Zap, TrendingUp, Settings2, GraduationCap, FlaskConical,
} from "lucide-react";

const TabCommandCenter    = lazy(() => import("./risk/TabCommandCenter"));
const TabPortfolio        = lazy(() => import("./risk/TabPortfolio"));
const TabInvestorProfile  = lazy(() => import("./risk/TabInvestorProfile"));
const TabModelLibrary     = lazy(() => import("./risk/TabModelLibrary"));
const TabComparison       = lazy(() => import("./risk/TabComparison"));
const TabHistorical       = lazy(() => import("./risk/TabHistorical"));
const TabStressTest       = lazy(() => import("./risk/TabStressTest"));
const TabMonteCarlo       = lazy(() => import("./risk/TabMonteCarlo"));
const TabOptimization     = lazy(() => import("./risk/TabOptimization"));
const TabEducation        = lazy(() => import("./risk/TabEducation"));
const TabPortfolioAnalyzer= lazy(() => import("./risk/TabPortfolioAnalyzer"));

const TABS = [
  { key: "command",   label: "Command Center",      icon: LayoutDashboard },
  { key: "portfolio", label: "My Portfolio",         icon: Briefcase },
  { key: "analyzer",  label: "Portfolio Analyzer",   icon: FlaskConical },
  { key: "profile",   label: "Investor Profile",     icon: User },
  { key: "library",   label: "Model Library",        icon: BookOpen },
  { key: "compare",   label: "Model Comparison",     icon: GitCompare },
  { key: "history",   label: "Historical Returns",   icon: BarChart2 },
  { key: "stress",    label: "Stress Tests",         icon: Zap },
  { key: "monte",     label: "Monte Carlo",          icon: TrendingUp },
  { key: "optimize",  label: "Optimization",         icon: Settings2 },
  { key: "education", label: "Education",            icon: GraduationCap },
];

const Loader = () => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:300 }}>
    <div style={{ width:32,height:32,border:"3px solid rgba(201,168,76,0.15)",
      borderTopColor:"#c9a84c",borderRadius:"50%",animation:"tSpin 0.7s linear infinite" }} />
    <style>{`@keyframes tSpin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

/* Shared context so tabs can read/write portfolio & profile */
export const RiskContext = React.createContext({});

export default function RiskAnalysis() {
  const [activeTab, setActiveTab] = useState("command");
  const [portfolio, setPortfolio] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ra_portfolio") || "[]"); }
    catch { return []; }
  });
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ra_profile") || "null"); }
    catch { return null; }
  });

  const savePortfolio = (p) => {
    setPortfolio(p);
    localStorage.setItem("ra_portfolio", JSON.stringify(p));
  };
  const saveProfile = (p) => {
    setProfile(p);
    localStorage.setItem("ra_profile", JSON.stringify(p));
  };

  return (
    <RiskContext.Provider value={{ portfolio, savePortfolio, profile, saveProfile }}>
      <div style={{ maxWidth: 1400 }}>
        {/* ── Hero Banner ─────────────────────────────────────────── */}
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border-c)",
          borderRadius: 16,
          padding: "1.75rem 2rem",
          marginBottom: "1.25rem",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -60, right: -40,
            width: 320, height: 320,
            background: "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", position: "relative" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.625rem" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <ShieldAlert size={14} style={{ color: "var(--gold)" }} />
                </div>
                <h1 className="t-page-title" style={{ margin: 0 }}>RISK ANALYSIS</h1>
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.65, maxWidth: 560, margin: "0 0 1rem" }}>
                Institutional-grade risk analytics for your portfolio. Run Monte Carlo simulations, stress tests, and scenario analysis to understand your true downside exposure.
              </p>
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                {["Monte Carlo", "Value at Risk", "Sharpe Ratio", "Drawdown Analysis"].map((label) => (
                  <span key={label} style={{
                    fontSize: "0.6875rem", fontWeight: 700, padding: "3px 10px",
                    borderRadius: 99, letterSpacing: "0.04em",
                    background: "rgba(201,168,76,0.10)",
                    border: "1px solid rgba(201,168,76,0.25)",
                    color: "var(--gold)",
                  }}>{label}</span>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", flexShrink: 0 }}>
              {[
                { icon: Zap, label: "Monte Carlo Sim", sub: "Probability-weighted outcomes", color: "#3b82f6" },
                { icon: ShieldAlert, label: "Portfolio Stress Test", sub: "Crisis scenario analysis", color: "var(--gold)" },
                { icon: BarChart2, label: "VaR Analysis", sub: "Value at Risk modeling", color: "var(--teal)" },
                { icon: GitCompare, label: "Correlation Matrix", sub: "Asset correlation heat map", color: "#f59e0b" },
              ].map(({ icon: Icon, label, sub, color }) => (
                <div key={label} style={{
                  display: "flex", alignItems: "center", gap: "0.625rem",
                  padding: "0.625rem 0.875rem",
                  background: "var(--bg)", border: "1px solid var(--border-c)",
                  borderRadius: 10, minWidth: 170,
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                    background: `color-mix(in srgb, ${color} 14%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
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

        {/* ── Tab Bar ── */}
        <div style={{
          display:"flex",gap:"2px",overflowX:"auto",marginBottom:"1.25rem",
          background:"var(--surface)",borderRadius:8,padding:"4px",
          border:"1px solid var(--border-c)",
        }}>
          {TABS.map(tab => {
            const active = activeTab === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display:"flex",alignItems:"center",gap:"0.375rem",
                  padding:"0.5rem 0.75rem",borderRadius:6,border:"none",cursor:"pointer",
                  whiteSpace:"nowrap",flexShrink:0,fontSize:"0.6875rem",fontWeight:600,
                  letterSpacing:"0.02em",transition:"all 0.15s",
                  background: active ? "rgba(201,168,76,0.12)" : "transparent",
                  color: active ? "#c9a84c" : "var(--text-3)",
                  borderBottom: active ? "2px solid #c9a84c" : "2px solid transparent",
                }}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Tab Content ── */}
        <Suspense fallback={<Loader />}>
          {activeTab === "command"   && <TabCommandCenter />}
          {activeTab === "portfolio" && <TabPortfolio />}
          {activeTab === "analyzer"  && <TabPortfolioAnalyzer />}
          {activeTab === "profile"   && <TabInvestorProfile />}
          {activeTab === "library"   && <TabModelLibrary />}
          {activeTab === "compare"   && <TabComparison />}
          {activeTab === "history"   && <TabHistorical />}
          {activeTab === "stress"    && <TabStressTest />}
          {activeTab === "monte"     && <TabMonteCarlo />}
          {activeTab === "optimize"  && <TabOptimization />}
          {activeTab === "education" && <TabEducation />}
        </Suspense>
      </div>
    </RiskContext.Provider>
  );
}
