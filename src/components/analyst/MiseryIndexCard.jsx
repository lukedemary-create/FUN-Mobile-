import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function MiseryIndexCard({ indicators }) {
  const unemployment = indicators.find(i => i?.seriesId === "UNRATE");
  const cpi = indicators.find(i => i?.seriesId === "CPIAUCSL" || i?.name === "CPI Year over Year");

  if (!unemployment || !cpi) {
    return (
      <div className="t-card t-card-p" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <div className="skeleton" style={{ width: 8, height: 8, borderRadius: "50%" }} />
          <div className="skeleton" style={{ width: 8, height: 8, borderRadius: "50%" }} />
          <div className="skeleton" style={{ width: 8, height: 8, borderRadius: "50%" }} />
        </div>
        <div style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-1)", marginBottom: "0.5rem" }}>Misery Index</div>
        <div style={{ fontSize: "0.8125rem", color: "var(--text-3)" }}>Loading data...</div>
      </div>
    );
  }

  const cpiInflationRate = cpi.value || 0;
  const miseryIndex = unemployment.value + cpiInflationRate;

  const getColor = () => {
    if (miseryIndex < 6) return "var(--up)";
    if (miseryIndex <= 10) return "var(--gold)";
    return "var(--down)";
  };

  const color = getColor();
  const level = miseryIndex < 6 ? "Low" : miseryIndex <= 10 ? "Moderate" : "High";

  return (
    <div className="t-card t-card-hover" style={{ padding: "1.5rem", cursor: "pointer" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <span style={{
          fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
          padding: "3px 10px", borderRadius: "20px",
          background: "#ec489918", color: "#ec4899", border: "1px solid #ec489930"
        }}>
          Special Composite
        </span>
        <span style={{
          fontSize: "0.6875rem", fontWeight: 600, padding: "3px 10px", borderRadius: "20px",
          background: `${color}18`, color, border: `1px solid ${color}30`
        }}>{level}</span>
      </div>

      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ fontSize: "0.75rem", color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600, marginBottom: "0.375rem" }}>Misery Index</div>
        <div className="tabnum" style={{ fontSize: "3.25rem", fontWeight: 800, letterSpacing: "-0.04em", color, lineHeight: 1 }}>
          {miseryIndex.toFixed(2)}
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--text-3)", marginTop: "0.375rem" }}>Unemployment + CPI Inflation</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem", marginBottom: "0.75rem" }}>
        <div style={{ background: "var(--elevated)", borderRadius: "0.75rem", padding: "0.875rem", border: "1px solid var(--border-c)" }}>
          <div style={{ fontSize: "0.625rem", color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600, marginBottom: "0.25rem" }}>Unemployment</div>
          <div className="tabnum" style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text-1)" }}>{unemployment.value.toFixed(1)}%</div>
        </div>
        <div style={{ background: "var(--elevated)", borderRadius: "0.75rem", padding: "0.875rem", border: "1px solid var(--border-c)" }}>
          <div style={{ fontSize: "0.625rem", color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600, marginBottom: "0.25rem" }}>CPI Inflation</div>
          <div className="tabnum" style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text-1)" }}>{cpiInflationRate.toFixed(1)}%</div>
        </div>
      </div>

      <div style={{ background: "var(--elevated)", borderRadius: "0.625rem", padding: "0.625rem 0.875rem", border: "1px solid var(--border-c)" }}>
        <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>Historical avg ~8–9 · Peak: 21.9 in 1980</span>
      </div>
    </div>
  );
}
