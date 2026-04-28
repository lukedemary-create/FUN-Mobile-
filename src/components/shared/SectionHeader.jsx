import React from "react";

export default function SectionHeader({ title, subtitle, icon: Icon, accent = "var(--blue)" }) {
  return (
    <div style={{ marginBottom: "1.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.375rem" }}>
        {Icon && (
          <div style={{ width: 38, height: 38, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: `${accent}15`, border: `1px solid ${accent}20`, flexShrink: 0 }}>
            <Icon size={18} style={{ color: accent }} />
          </div>
        )}
        <h1 style={{ fontSize: "clamp(1.375rem, 3vw, 1.75rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "var(--text-1)", lineHeight: 1.2 }}>
          {title}
        </h1>
      </div>
      {subtitle && (
        <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.65, marginLeft: Icon ? "3.125rem" : 0, maxWidth: "560px" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
