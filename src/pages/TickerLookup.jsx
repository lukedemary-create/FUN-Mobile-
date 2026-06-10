import React, { useState } from "react";
import { TrendingUp } from "lucide-react";
import StockTab from "../components/tickerlookup/StockTab";
import ETFTab from "../components/tickerlookup/ETFTab";
import BondTab from "../components/tickerlookup/BondTab";
import MutualFundTab from "../components/tickerlookup/MutualFundTab";
import SectorExplorer from "../components/tickerlookup/SectorExplorer";

const ACCENT = "#c9a96e";

const TABS = [
  { value: "stocks", label: "Stocks" },
  { value: "etfs", label: "ETFs" },
  { value: "bonds", label: "Bonds" },
  { value: "mutual-funds", label: "Mutual Funds" },
  { value: "sectors", label: "Sector Explorer" },
];

export default function TickerLookup() {
  const [activeTab, setActiveTab] = useState("stocks");
  const [selectedTicker, setSelectedTicker] = useState(null);

  const handleTickerSelect = (ticker, tabType) => {
    setSelectedTicker(ticker);
    setActiveTab(tabType);
  };

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Hero Banner */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border-c)",
        borderRadius: 20, padding: "1.75rem 2.25rem", marginBottom: "1.25rem",
        position: "relative", overflow: "hidden",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 var(--border-c)",
      }}>
        <div style={{ position: "absolute", top: -50, right: -30, width: 260, height: 260, background: "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <p style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "0 0 0.625rem", fontFamily: "'Inter', system-ui, sans-serif", fontSize: "0.5625rem", fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--gold)" }}>
            <span style={{ display: "inline-block", width: 20, height: 1, background: "var(--gold)", opacity: 0.7 }} />
            Markets · Research
          </p>
          <h1 style={{ margin: "0 0 0.625rem", fontSize: "1.35rem", fontWeight: 700, color: "var(--text-1)", letterSpacing: "-0.01em", fontFamily: "'Inter', system-ui, sans-serif" }}>
            TICKER{" "}
            <em style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", color: "var(--gold)", fontWeight: 400, fontSize: "1.5rem" }}>Lookup</em>
          </h1>
          <p style={{ margin: "0 0 1rem", color: "var(--text-2)", fontSize: "0.875rem", lineHeight: 1.65, maxWidth: 520 }}>
            Deep research on stocks, ETFs, bonds, and mutual funds. Fundamental data, analyst targets, and sector exploration in one tool.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {["Stocks", "ETFs", "Bonds", "Mutual Funds", "Sector Explorer"].map(tag => (
              <span key={tag} style={{ fontSize: "0.6875rem", fontWeight: 700, padding: "3px 10px", borderRadius: 99, letterSpacing: "0.04em", background: "rgba(201,169,110,0.10)", border: "1px solid rgba(201,169,110,0.25)", color: "var(--gold)" }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.25rem", background: "var(--surface)", padding: "0.3rem", borderRadius: 10, border: "1px solid var(--border-c)", overflowX: "auto", backdropFilter: "blur(12px)", marginBottom: "1.25rem" }}>
        {TABS.map(t => {
          const active = activeTab === t.value;
          return (
            <button
              key={t.value}
              onClick={() => setActiveTab(t.value)}
              style={{ padding: "0.45rem 0.85rem", borderRadius: 7, border: active ? "1px solid rgba(201,169,110,0.3)" : "1px solid transparent", cursor: "pointer", background: active ? "rgba(201,169,110,0.18)" : "transparent", color: active ? "var(--gold)" : "var(--text-3)", fontWeight: active ? 700 : 500, fontSize: "0.75rem", whiteSpace: "nowrap", flexShrink: 0 }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {activeTab === "stocks" && <StockTab prefilledTicker={selectedTicker} onTickerAnalyzed={() => setSelectedTicker(null)} />}
      {activeTab === "etfs" && <ETFTab prefilledTicker={selectedTicker} onTickerAnalyzed={() => setSelectedTicker(null)} />}
      {activeTab === "bonds" && <BondTab prefilledTicker={selectedTicker} onTickerAnalyzed={() => setSelectedTicker(null)} />}
      {activeTab === "mutual-funds" && <MutualFundTab prefilledTicker={selectedTicker} onTickerAnalyzed={() => setSelectedTicker(null)} />}
      {activeTab === "sectors" && <SectorExplorer onTickerSelect={handleTickerSelect} />}
    </div>
  );
}
