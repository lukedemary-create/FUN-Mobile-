import React from "react";
import { DollarSign, TrendingDown } from "lucide-react";

export default function NationalDebtCard({ indicators }) {
  const debt = indicators.find(i => i?.seriesId === "GFDEBTN");
  const deficit = indicators.find(i => i?.seriesId === "MTSDS133FMS");

  if (!debt) {
    return (
      <div className="t-card t-card-p" style={{ padding: "1.5rem" }}>
        <div style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-1)", marginBottom: "0.5rem" }}>National Debt</div>
        <div style={{ fontSize: "0.8125rem", color: "var(--text-3)" }}>Loading data...</div>
      </div>
    );
  }

  const debtTrillions = debt.value / 1000;
  const deficitBillions = deficit ? deficit.value : null;
  const isDeficit = deficitBillions !== null && deficitBillions < 0;

  return (
    <div className="t-card t-card-hover" style={{ padding: "1.5rem", cursor: "pointer" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <span style={{
          fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
          padding: "3px 10px", borderRadius: "20px",
          background: "#ef444418", color: "#ef4444", border: "1px solid #ef444430"
        }}>
          Government
        </span>
        <DollarSign size={16} style={{ color: "#ef4444" }} />
      </div>

      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ fontSize: "0.75rem", color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600, marginBottom: "0.375rem" }}>Total National Debt</div>
        <div className="tabnum" style={{ fontSize: "3rem", fontWeight: 800, letterSpacing: "-0.04em", color: "#ef4444", lineHeight: 1 }}>
          ${debtTrillions.toFixed(2)}T
        </div>
      </div>

      {deficitBillions !== null && (
        <div style={{ background: "var(--elevated)", borderRadius: "0.75rem", padding: "0.875rem", border: "1px solid var(--border-c)", marginBottom: "0.75rem" }}>
          <div style={{ fontSize: "0.625rem", color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600, marginBottom: "0.25rem" }}>
            Monthly {isDeficit ? "Deficit" : "Surplus"}
          </div>
          <div className="tabnum" style={{ fontSize: "1.5rem", fontWeight: 800, color: isDeficit ? "var(--down)" : "var(--up)" }}>
            {isDeficit ? "-" : "+"}${Math.abs(deficitBillions).toFixed(1)}B
          </div>
        </div>
      )}

      <div style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>Source: FRED / US Treasury</div>
    </div>
  );
}
