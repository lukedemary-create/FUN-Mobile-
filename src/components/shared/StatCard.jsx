import React from "react";

export default function StatCard({ label, value, change, changeLabel, hero = false }) {
  const isPositive = change !== undefined && change !== null && !String(change).startsWith("-");
  const changeColor = isPositive ? "var(--up)" : "var(--down)";

  return (
    <div className="t-card" style={{ padding: "1.5rem 1.75rem" }}>
      <p style={{
        fontSize: "0.5625rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.2em",
        color: "var(--text-3)",
        marginBottom: "0.75rem",
      }}>
        {label}
      </p>

      <p style={{
        fontSize: hero ? "2.5rem" : "1.75rem",
        fontWeight: 900,
        letterSpacing: hero ? "-0.05em" : "-0.04em",
        lineHeight: 1,
        color: hero ? "var(--gold)" : "var(--text-1)",
        fontFamily: "'JetBrains Mono','Fira Code',monospace",
        fontVariantNumeric: "tabular-nums",
        marginBottom: change !== undefined ? "0.5rem" : 0,
      }}>
        {value}
      </p>

      {change !== undefined && change !== null && (
        <p style={{
          fontSize: "0.75rem",
          fontWeight: 500,
          color: changeColor,
          fontFamily: "'JetBrains Mono','Fira Code',monospace",
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
        }}>
          {isPositive ? "+" : ""}{change}
          {changeLabel && (
            <span style={{ color: "var(--text-3)", fontWeight: 400, fontFamily: "inherit" }}>
              {" "}{changeLabel}
            </span>
          )}
        </p>
      )}
    </div>
  );
}
