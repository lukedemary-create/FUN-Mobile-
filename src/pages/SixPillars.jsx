import React, { useState } from "react";
import { BookOpen, ScrollText, Receipt, Shield, Wallet, Clock, HeartPulse, ArrowLeft } from "lucide-react";
import PillarTabs from "../components/pillars/PillarTabs";
import LearnTab from "../components/pillars/LearnTab";
import DoTab from "../components/pillars/DoTab";
import PlanTab from "../components/pillars/PlanTab";
import AiChatPanel from "../components/shared/AiChatPanel";

const pillars = [
  { key: "estate", label: "Estate Planning", icon: ScrollText, color: "#00d4aa", desc: "Wills, beneficiaries, power of attorney & asset distribution" },
  { key: "taxes", label: "Tax Planning", icon: Receipt, color: "#3b82f6", desc: "Deductions, credits, strategies & tax-efficient investing" },
  { key: "trust", label: "Trust Planning", icon: Shield, color: "#8b5cf6", desc: "Living trusts, irrevocable trusts & asset protection" },
  { key: "financial", label: "Financial Planning", icon: Wallet, color: "#f59e0b", desc: "Budgeting, saving, investing & building wealth" },
  { key: "retirement", label: "Retirement Planning", icon: Clock, color: "#ef4444", desc: "401(k), IRA, Social Security & withdrawal strategies" },
  { key: "insurance", label: "Insurance Planning", icon: HeartPulse, color: "#06b6d4", desc: "Life, health, disability, long-term care & property" },
];

export default function SixPillars() {
  const [selectedPillar, setSelectedPillar] = useState(null);
  const [activeTab, setActiveTab] = useState("ask");

  if (!selectedPillar) {
    return (
      <div style={{ maxWidth: 1200 }}>
        {/* Header */}
        <div className="t-card t-card-p" style={{ padding: "1.5rem", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
            <div style={{ width: 44, height: 44, borderRadius: "12px", background: "var(--blue)18", border: "1px solid var(--blue)30", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen size={20} style={{ color: "var(--blue)" }} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.025em", color: "var(--text-1)" }}>
                Six Pillars of <span style={{ color: "var(--blue)" }}>Planning</span>
              </h1>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", marginTop: 2 }}>Master the foundations of comprehensive financial planning</p>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "0.875rem" }}>
          {pillars.map((p) => (
            <button
              key={p.key}
              onClick={() => setSelectedPillar(p)}
              style={{
                background: "var(--surface)", border: "1px solid var(--border-c)",
                borderRadius: "0.875rem", padding: "1.5rem",
                textAlign: "left", cursor: "pointer",
                transition: "border-color 0.15s, transform 0.15s"
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${p.color}40`; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-c)"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ width: 46, height: 46, borderRadius: "12px", background: `${p.color}18`, border: `1px solid ${p.color}25`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                <p.icon size={22} style={{ color: p.color }} />
              </div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-1)", marginBottom: "0.375rem" }}>{p.label}</h3>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", lineHeight: 1.6, marginBottom: "1rem" }}>{p.desc}</p>
              <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
                {["Ask AI", "Learn", "Do", "Plan"].map((t) => (
                  <span key={t} style={{
                    fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em",
                    padding: "2px 7px", borderRadius: "20px",
                    background: `${p.color}12`, color: p.color, border: `1px solid ${p.color}20`
                  }}>{t}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <button
        onClick={() => { setSelectedPillar(null); setActiveTab("ask"); }}
        style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--text-3)", background: "none", border: "none", cursor: "pointer", marginBottom: "1rem", padding: 0 }}
      >
        <ArrowLeft size={14} /> Back to Pillars
      </button>

      {/* Pillar Header */}
      <div className="t-card t-card-p" style={{ padding: "1.5rem", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
          <div style={{ width: 44, height: 44, borderRadius: "12px", background: `${selectedPillar.color}18`, border: `1px solid ${selectedPillar.color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <selectedPillar.icon size={20} style={{ color: selectedPillar.color }} />
          </div>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.025em", color: "var(--text-1)" }}>{selectedPillar.label}</h1>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", marginTop: 2 }}>{selectedPillar.desc}</p>
          </div>
        </div>
      </div>

      <PillarTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "ask" && <AiChatPanel topic={selectedPillar.label} systemContext={`${selectedPillar.label} - ${selectedPillar.desc}`} />}
      {activeTab === "learn" && <LearnTab pillar={selectedPillar.key} pillarLabel={selectedPillar.label} />}
      {activeTab === "do" && <DoTab pillar={selectedPillar.key} pillarLabel={selectedPillar.label} />}
      {activeTab === "plan" && <PlanTab pillar={selectedPillar.key} pillarLabel={selectedPillar.label} />}
    </div>
  );
}
