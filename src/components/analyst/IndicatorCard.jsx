import React, { useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function IndicatorCard({ indicator, categoryColor }) {
  const [showDetail, setShowDetail] = useState(false);

  const formatValue = (value, unit) => {
    if (value === null || value === undefined || isNaN(value)) return "N/A";
    const sign = value < 0 ? "-" : "";
    const abs = Math.abs(value);
    if (unit === "T") return `${sign}$${(abs / 1000).toFixed(2)}T`;
    if (unit === "B") {
      if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(2)}T`;
      return `${sign}$${abs.toFixed(1)}B`;
    }
    if (unit === "K") {
      if (abs >= 1000) return `${(value / 1000).toFixed(1)}M`;
      return `${value.toFixed(0)}K`;
    }
    if (unit === "%") return `${value.toFixed(2)}%`;
    if (unit === "idx") return value.toFixed(1);
    if (unit.startsWith("$")) return `${sign}${unit}${abs.toFixed(2)}`;
    if (unit.includes("¢")) return `${abs.toFixed(0)}${unit}`;
    return `${value.toFixed(2)} ${unit}`;
  };

  const changeVal = indicator.change && !isNaN(indicator.change) ? indicator.change : null;
  const changeColor = !changeVal ? "var(--text-3)" : changeVal > 0 ? "var(--up)" : "var(--down)";
  const ChangIcon = !changeVal ? Minus : changeVal > 0 ? TrendingUp : TrendingDown;

  return (
    <>
      <button
        onClick={() => setShowDetail(true)}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border-c)",
          borderRadius: "0.875rem",
          padding: "1.125rem 1.25rem",
          textAlign: "left",
          width: "100%",
          cursor: "pointer",
          transition: "border-color 0.15s, box-shadow 0.15s, transform 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = `${categoryColor}40`; e.currentTarget.style.transform = "translateY(-1px)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-c)"; e.currentTarget.style.transform = "none"; }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <span style={{
            fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em",
            padding: "2px 8px", borderRadius: "20px",
            background: `${categoryColor}15`, color: categoryColor,
            border: `1px solid ${categoryColor}25`
          }}>
            {indicator.category}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "3px", color: changeColor }}>
            <ChangIcon size={13} />
            <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>
              {changeVal ? `${Math.abs(changeVal).toFixed(2)}%` : "—"}
            </span>
          </div>
        </div>

        <div className="tabnum" style={{ fontSize: "1.625rem", fontWeight: 800, letterSpacing: "-0.025em", color: "var(--text-1)", lineHeight: 1.2, marginBottom: "0.375rem" }}>
          {formatValue(indicator.value, indicator.unit)}
        </div>

        <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-2)", marginBottom: "0.2rem" }}>{indicator.name}</div>
        <div style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>Updated {indicator.updated} · {indicator.source}</div>
      </button>

      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent style={{ background: "var(--surface)", border: "1px solid var(--border-c)", color: "var(--text-1)" }}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-1)" }}>{indicator.name}</DialogTitle>
          </DialogHeader>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.75rem" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-3)", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>Current Value</div>
              <div className="tabnum" style={{ fontSize: "2rem", fontWeight: 800, color: categoryColor, letterSpacing: "-0.025em" }}>
                {formatValue(indicator.value, indicator.unit)}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div style={{ background: "var(--elevated)", borderRadius: "0.75rem", padding: "0.875rem" }}>
                <div style={{ fontSize: "0.6875rem", color: "var(--text-3)", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>Change</div>
                <div className="tabnum" style={{ fontSize: "1.25rem", fontWeight: 700, color: changeColor }}>
                  {changeVal ? `${changeVal > 0 ? "+" : ""}${changeVal.toFixed(2)}%` : "N/A"}
                </div>
              </div>
              <div style={{ background: "var(--elevated)", borderRadius: "0.75rem", padding: "0.875rem" }}>
                <div style={{ fontSize: "0.6875rem", color: "var(--text-3)", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>Source</div>
                <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-1)" }}>{indicator.source}</div>
              </div>
            </div>
            <div style={{ background: "var(--elevated)", borderRadius: "0.75rem", padding: "0.875rem" }}>
              <div style={{ fontSize: "0.6875rem", color: "var(--text-3)", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>Series ID</div>
              <div style={{ fontSize: "0.8rem", fontFamily: "monospace", color: "var(--blue)" }}>{indicator.seriesId}</div>
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>Last updated: {indicator.updated}</div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
