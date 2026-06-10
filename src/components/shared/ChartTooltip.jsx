import React from "react";

const MONO = "'JetBrains Mono','Fira Code','Roboto Mono',monospace";

/**
 * Drop-in Recharts tooltip. Pass as:
 *   <Tooltip content={<ChartTooltip />} />
 *   <Tooltip content={<ChartTooltip formatter={(v) => `$${v}`} />} />
 */
export default function ChartTooltip({ active, payload, label, formatter, labelFormatter, unit = "" }) {
  if (!active || !payload || !payload.length) return null;

  const displayLabel = labelFormatter ? labelFormatter(label) : label;

  return (
    <div style={{
      background: "#111318",
      border: "1px solid rgba(201,169,110,0.35)",
      borderRadius: 6,
      padding: "8px 12px",
      boxShadow: "0 8px 40px rgba(0,0,0,0.7)",
      pointerEvents: "none",
      minWidth: 120,
    }}>
      {displayLabel !== undefined && displayLabel !== null && (
        <div style={{
          fontSize: 10,
          fontFamily: MONO,
          color: "#64748b",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: 6,
          borderBottom: "1px solid #1e2028",
          paddingBottom: 5,
        }}>
          {displayLabel}
        </div>
      )}
      {payload.map((entry, i) => {
        const raw = entry.value;
        const display = formatter ? formatter(raw, entry.name, entry) : `${raw}${unit}`;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginTop: i > 0 ? 3 : 0 }}>
            <span style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 5 }}>
              {payload.length > 1 && (
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: entry.color || "#c9a96e", display: "inline-block", flexShrink: 0 }} />
              )}
              {entry.name}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#f1f5f9", fontFamily: MONO, fontVariantNumeric: "tabular-nums" }}>
              {display}
            </span>
          </div>
        );
      })}
    </div>
  );
}
