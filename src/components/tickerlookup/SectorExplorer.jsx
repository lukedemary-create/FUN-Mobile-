import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import GlassCard from "../shared/GlassCard";
import { ChevronRight, ArrowLeft, Loader2, TrendingUp, Building2, HeartPulse, Wrench, ShoppingBag, Milk, Zap, Package, Home, Droplets, Radio } from "lucide-react";

const GICS_SECTORS = [
  { id: "tech", name: "Information Technology", icon: Radio, color: "#3b82f6", desc: "Software, hardware, semiconductors, and IT services" },
  { id: "financials", name: "Financials", icon: Building2, color: "#00d4aa", desc: "Banks, investment services, insurance, and diversified financials" },
  { id: "healthcare", name: "Health Care", icon: HeartPulse, color: "#ef4444", desc: "Biotechnology, pharmaceuticals, and medical facilities" },
  { id: "industrials", name: "Industrials", icon: Wrench, color: "#f59e0b", desc: "Manufacturing, aerospace, defense, machinery, and transportation" },
  { id: "consumer_discretionary", name: "Consumer Discretionary", icon: ShoppingBag, color: "#8b5cf6", desc: "Non-essential goods like automobiles, retail, hotels, and restaurants" },
  { id: "consumer_staples", name: "Consumer Staples", icon: Milk, color: "#06b6d4", desc: "Essential items like food, beverages, household goods, and pharmacy" },
  { id: "energy", name: "Energy", icon: Zap, color: "#f59e0b", desc: "Oil and gas exploration, production, and consumable fuels" },
  { id: "materials", name: "Materials", icon: Package, color: "#64748b", desc: "Chemicals, mining, forestry, and packaging materials" },
  { id: "real_estate", name: "Real Estate", icon: Home, color: "#00d4aa", desc: "REITs and property management companies" },
  { id: "utilities", name: "Utilities", icon: Droplets, color: "#3b82f6", desc: "Providers of electricity, gas, and water" },
  { id: "communication", name: "Communication Services", icon: Radio, color: "#8b5cf6", desc: "Telecommunications, media, and entertainment services" }
];

export default function SectorExplorer({ onTickerSelect }) {
  const [selectedSector, setSelectedSector] = useState(null);
  const [tickers, setTickers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadSectorTickers = async (sector) => {
    setSelectedSector(sector);
    setLoading(true);
    setTickers([]);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a financial data expert. List ONLY the top 15-20 most popular and liquid tickers that are ACTUALLY in the ${sector.name} sector.

CRITICAL RULES:
1. Verify each ticker is in the correct GICS sector before including it
2. Do NOT include utilities in financials (e.g., LNT is utilities NOT financials)
3. Do NOT include random stocks that don't belong (e.g., FSV)
4. Include major sector-specific ETFs (e.g., FNCL for Financials, XLF for Financials, XLK for Technology)
5. Double-check GICS classification for every single ticker

Return this exact JSON structure:
{
  "tickers": [
    {"ticker": "AAPL", "name": "Apple Inc.", "type": "stock"},
    {"ticker": "XLK", "name": "Technology Select Sector SPDR Fund", "type": "etf"},
    ...
  ]
}

For ${sector.name}, include:
- The major companies that are ACTUALLY classified in this GICS sector
- The primary sector ETFs that track this specific sector
- Only stocks/ETFs that genuinely belong to ${sector.name}`,
        response_json_schema: {
          type: "object",
          properties: {
            tickers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  ticker: { type: "string" },
                  name: { type: "string" },
                  type: { type: "string" }
                }
              }
            }
          }
        }
      });

      setTickers(response.tickers || []);
    } catch (error) {
      console.error("Error loading sector tickers:", error);
      alert("Failed to load sector data. Please try again.");
    }

    setLoading(false);
  };

  if (selectedSector) {
    const SectorIcon = selectedSector.icon;
    
    return (
      <div>
        <Button 
          onClick={() => { setSelectedSector(null); setTickers([]); }} 
          variant="ghost" 
          className="mb-4 text-[#94a3b8] hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sectors
        </Button>

        <GlassCard className="mb-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${selectedSector.color}20` }}>
              <SectorIcon className="w-6 h-6" style={{ color: selectedSector.color }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{selectedSector.name}</h2>
              <p className="text-sm text-[#94a3b8]">{selectedSector.desc}</p>
            </div>
          </div>
        </GlassCard>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: selectedSector.color }} />
            <p className="text-[#94a3b8]">Loading sector tickers...</p>
          </div>
        )}

        {!loading && tickers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tickers.map((item, i) => (
              <GlassCard key={i} hover onClick={() => {
                const tabType = item.type === 'stock' ? 'stocks' : item.type === 'etf' ? 'etfs' : 'mutual-funds';
                onTickerSelect(item.ticker, tabType);
              }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-white">{item.ticker}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        item.type === 'stock' ? 'bg-[#3b82f6]/10 text-[#3b82f6]' :
                        item.type === 'etf' ? 'bg-[#00d4aa]/10 text-[#00d4aa]' :
                        'bg-[#f59e0b]/10 text-[#f59e0b]'
                      }`}>
                        {item.type.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-[#94a3b8]">{item.name}</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-[#64748b]" />
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Explore by GICS Sector</h2>
        <p className="text-sm text-[#94a3b8]">Browse stocks, ETFs, and mutual funds organized by the 11 Global Industry Classification Standard sectors</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {GICS_SECTORS.map((sector) => {
          const Icon = sector.icon;
          return (
            <GlassCard key={sector.id} hover onClick={() => loadSectorTickers(sector)}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${sector.color}20` }}>
                  <Icon className="w-6 h-6" style={{ color: sector.color }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{sector.name}</h3>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">{sector.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#64748b] flex-shrink-0 mt-1" />
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}