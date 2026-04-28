import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import GlassCard from "../shared/GlassCard";

export default function StockPerformance({ eventLabel, eventYear, bestPerformers, worstPerformers, sectorPerformance, startDate, endDate }) {
  const [searchTicker, setSearchTicker] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);

  const searchStock = async () => {
    if (!searchTicker.trim()) return;
    setSearching(true);
    setSearchResult(null);
    
    try {
      const { base44 } = await import("@/api/base44Client");
      const response = await base44.functions.invoke('getStockPerformanceForPeriod', {
        ticker: searchTicker.trim(),
        startDate,
        endDate
      });
      
      if (response.data.error) {
        setSearchResult(response.data.error);
      } else {
        const data = response.data;
        setSearchResult(
          `${data.ticker} ${data.companyName ? `(${data.companyName})` : ''} performance during ${eventLabel}:\n` +
          `• Start: $${data.startPrice} → End: $${data.endPrice}\n` +
          `• Return: ${data.return}\n` +
          `• High: $${data.highPrice} | Low: $${data.lowPrice}`
        );
      }
    } catch (error) {
      setSearchResult(`Error: ${error.message || 'Failed to fetch stock data'}`);
    }
    
    setSearching(false);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <GlassCard>
        <h4 className="text-sm font-semibold text-white mb-3">Search Stock Performance</h4>
        <div className="flex gap-2">
          <Input
            value={searchTicker}
            onChange={(e) => setSearchTicker(e.target.value.toUpperCase())}
            placeholder="Enter ticker (e.g., AAPL)"
            className="bg-[#0a0e17] border-[#1e293b] text-white"
          />
          <Button onClick={searchStock} disabled={searching} className="bg-[#3b82f6] hover:bg-[#3b82f6]/80">
            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>
        {searchResult && (
          <div className="mt-4 p-4 rounded-xl bg-[#0a0e17] border border-[#1e293b]">
            <p className="text-sm text-[#e2e8f0]">{searchResult}</p>
          </div>
        )}
      </GlassCard>

      {/* Best & Worst Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-[#00d4aa]" />
            <h4 className="text-sm font-semibold text-[#00d4aa]">Best Performers</h4>
          </div>
          <div className="space-y-2">
            {bestPerformers?.map((stock, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#0a0e17]">
                <span className="text-sm font-medium text-white">{stock.ticker}</span>
                <span className="text-sm text-[#00d4aa] font-semibold">{stock.return}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-4 h-4 text-[#ef4444]" />
            <h4 className="text-sm font-semibold text-[#ef4444]">Worst Performers</h4>
          </div>
          <div className="space-y-2">
            {worstPerformers?.map((stock, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#0a0e17]">
                <span className="text-sm font-medium text-white">{stock.ticker}</span>
                <span className="text-sm text-[#ef4444] font-semibold">{stock.return}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Sector Performance */}
      <GlassCard>
        <h4 className="text-sm font-semibold text-white mb-3">Sector Performance During {eventLabel}</h4>
        <div className="space-y-2">
          {sectorPerformance?.map((sector, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-[#0a0e17]">
              <span className="text-sm font-medium text-white">{sector.name}</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${parseFloat(sector.return) >= 0 ? "text-[#00d4aa]" : "text-[#ef4444]"}`}>
                  {sector.return}
                </span>
                <div className="w-24 h-2 bg-[#1e293b] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${parseFloat(sector.return) >= 0 ? "bg-[#00d4aa]" : "bg-[#ef4444]"}`}
                    style={{ width: `${Math.min(Math.abs(parseFloat(sector.return)), 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}