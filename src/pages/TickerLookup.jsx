import React, { useState } from "react";
import { TrendingUp } from "lucide-react";
import StockTab from "../components/tickerlookup/StockTab";
import ETFTab from "../components/tickerlookup/ETFTab";
import BondTab from "../components/tickerlookup/BondTab";
import MutualFundTab from "../components/tickerlookup/MutualFundTab";
import SectorExplorer from "../components/tickerlookup/SectorExplorer";

const ACCENT = "#3b82f6";

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
      {/* Header */}
      <div className="t-card t-card-p" style={{ padding: "1.5rem", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
          <div style={{ width: 44, height: 44, borderRadius: "12px", background: `${ACCENT}18`, border: `1px solid ${ACCENT}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TrendingUp size={20} style={{ color: ACCENT }} />
          </div>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.025em", color: "var(--text-1)" }}>
              Ticker <span style={{ color: ACCENT }}>Lookup</span>
            </h1>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", marginTop: 2 }}>Stocks, ETFs, bonds, mutual funds, and sector exploration</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.375rem", marginBottom: "1.25rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
        {TABS.map(t => (
          <button
            key={t.value}
            onClick={() => setActiveTab(t.value)}
            style={{
              padding: "0.5rem 1rem", borderRadius: "0.5rem", whiteSpace: "nowrap",
              border: `1px solid ${activeTab === t.value ? `${ACCENT}40` : "var(--border-c)"}`,
              background: activeTab === t.value ? `${ACCENT}12` : "var(--surface)",
              color: activeTab === t.value ? ACCENT : "var(--text-2)",
              fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
              transition: "all 0.15s"
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "stocks" && <StockTab prefilledTicker={selectedTicker} onTickerAnalyzed={() => setSelectedTicker(null)} />}
      {activeTab === "etfs" && <ETFTab prefilledTicker={selectedTicker} onTickerAnalyzed={() => setSelectedTicker(null)} />}
      {activeTab === "bonds" && <BondTab prefilledTicker={selectedTicker} onTickerAnalyzed={() => setSelectedTicker(null)} />}
      {activeTab === "mutual-funds" && <MutualFundTab prefilledTicker={selectedTicker} onTickerAnalyzed={() => setSelectedTicker(null)} />}
      {activeTab === "sectors" && <SectorExplorer onTickerSelect={handleTickerSelect} />}
    </div>
  );
}
