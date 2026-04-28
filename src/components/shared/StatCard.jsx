import React from "react";

export default function StatCard({ label, value, change, icon: Icon, color = "var(--blue)" }) {
  const isPositive = change && !change.startsWith("-");
  return (
    <div className="t-card t-card-p" style={{ padding: "1.25rem" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p className="metric-label" style={{ marginBottom: "0.375rem" }}>{label}</p>
          <p className="tabnum" style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-1)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{value}</p>
          {change && (
            <p style={{ fontSize: "0.75rem", marginTop: "0.25rem", fontWeight: 600, color: isPositive ? "var(--up)" : "var(--down)" }}>
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div style={{ width: 36, height: 36, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: `${color}15`, border: `1px solid ${color}20`, flexShrink: 0 }}>
            <Icon size={17} style={{ color }} />
          </div>
        )}
      </div>
    </div>
  );
}
