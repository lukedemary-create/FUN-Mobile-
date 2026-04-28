import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, TrendingUp, Percent, DollarSign, BarChart3, Maximize2, Minimize2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import GlassCard from "../shared/GlassCard";
import StatCard from "../shared/StatCard";
import AiChatPanel from "../shared/AiChatPanel";

export default function ETFTab({ prefilledTicker, onTickerAnalyzed }) {
  const [ticker, setTicker] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [priceTimeframe, setPriceTimeframe] = useState("5y");
  const [priceExpanded, setPriceExpanded] = useState(false);

  React.useEffect(() => {
    if (prefilledTicker) {
      setTicker(prefilledTicker);
      lookupETFWithTicker(prefilledTicker);
    }
  }, [prefilledTicker]);

  const lookupETFWithTicker = async (tickerSymbol) => {
    if (!tickerSymbol.trim()) return;
    setLoading(true);
    setShowChat(false);
    setData(null);

    try {
      const { data: priceData } = await base44.functions.invoke('getStockData', { ticker: tickerSymbol.toUpperCase() });
      
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a financial data API. Look up the ETF ticker ${tickerSymbol.toUpperCase()} and return ONLY accurate, real data.

Return this exact JSON structure with real numbers:
{
  "name": "Full ETF name",
  "ticker": "TICKER",
  "description": "What this ETF tracks (2-3 sentences)",
  "net_assets": "Dollar amount like $50.2B",
  "expense_ratio": "Percentage like 0.03%",
  "dividend_yield": "Percentage like 1.5%",
  "pe_ratio": "Number like 25.3 or N/A",
  "top_holdings": ["Company 1", "Company 2", "Company 3", "Company 4", "Company 5"],
  "sector_allocation": {"Technology": 30, "Healthcare": 20, "Finance": 15, "Consumer": 10, "Other": 25},
  "ytd_return": "Percentage like +12.5%",
  "one_year_return": "Percentage like +18.2%",
  "inception_date": "YYYY-MM-DD",
  "analysis": "2-3 sentences about what this ETF is good for, risk level, and typical use case"
}

Use real, current data from your knowledge. If the ticker doesn't exist, set all values to "N/A" and analysis to "ETF not found".`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            ticker: { type: "string" },
            description: { type: "string" },
            net_assets: { type: "string" },
            expense_ratio: { type: "string" },
            dividend_yield: { type: "string" },
            pe_ratio: { type: "string" },
            top_holdings: { type: "array", items: { type: "string" } },
            sector_allocation: { type: "object" },
            ytd_return: { type: "string" },
            one_year_return: { type: "string" },
            inception_date: { type: "string" },
            analysis: { type: "string" }
          }
        }
      });

      if (response.analysis === "ETF not found") {
        throw new Error("ETF not found. Please check the ticker symbol.");
      }

      setData({
        ...response,
        price_history: priceData?.price_history || [],
        price_history_daily: priceData?.price_history_daily || [],
        price_history_intraday: priceData?.price_history_intraday || []
      });

      if (onTickerAnalyzed) onTickerAnalyzed();
    } catch (error) {
      console.error("Error fetching ETF data:", error);
      alert(error.message || "Failed to fetch ETF data. Please try again.");
    }
    
    setLoading(false);
  };

  const lookupETF = async () => {
    lookupETFWithTicker(ticker);
  };

  const getPriceChartData = (stockData, timeframe) => {
    if (!stockData) return [];
    const now = new Date();

    if (timeframe === "1d") {
      const intradayData = stockData.price_history_intraday || [];
      if (intradayData.length === 0) return [];
      const lastEntry = intradayData[intradayData.length - 1];
      const lastDateStr = new Date(lastEntry.date).toISOString().split('T')[0];
      const dayData = intradayData.filter(item => item.date.startsWith(lastDateStr));
      return dayData.map(item => ({
        ...item,
        label: new Date(item.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/New_York' })
      }));
    }

    if (timeframe === "5d") {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 5);
      const data = (stockData.price_history_intraday || []).filter(item => new Date(item.date) >= cutoff);
      return data.map(item => ({
        ...item,
        label: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' +
               new Date(item.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      }));
    }

    if (timeframe === "1m") {
      const cutoff = new Date();
      cutoff.setMonth(cutoff.getMonth() - 1);
      return (stockData.price_history_daily || []).filter(item => new Date(item.date) >= cutoff).map(item => ({ ...item, label: item.date }));
    }

    if (timeframe === "ytd") {
      const cutoff = new Date(now.getFullYear(), 0, 1);
      return (stockData.price_history_daily || []).filter(item => new Date(item.date) >= cutoff).map(item => ({ ...item, label: item.date }));
    }

    if (timeframe === "1y") {
      const cutoff = new Date();
      cutoff.setFullYear(cutoff.getFullYear() - 1);
      return (stockData.price_history_daily || []).filter(item => new Date(item.date) >= cutoff).map(item => ({ ...item, label: item.date }));
    }

    if (timeframe === "5y") {
      const cutoff = new Date();
      cutoff.setFullYear(cutoff.getFullYear() - 5);
      return (stockData.price_history || []).filter(item => new Date(item.date) >= cutoff).map(item => ({ ...item, label: item.date }));
    }

    return (stockData.price_history || []).map(item => ({ ...item, label: item.date }));
  };

  return (
    <div>
      {/* Search */}
      <GlassCard className="mb-8">
        <form onSubmit={(e) => { e.preventDefault(); lookupETF(); }} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
            <Input
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="Enter ETF ticker symbol (e.g., SPY, QQQ, VTI)"
              className="pl-10 bg-[#0a0e17] border-[#1e293b] text-white placeholder:text-[#64748b] text-lg"
            />
          </div>
          <Button type="submit" disabled={loading || !ticker.trim()} className="bg-[#00d4aa] hover:bg-[#00d4aa]/80 text-black px-6">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Analyze"}
          </Button>
        </form>
      </GlassCard>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-[#00d4aa] animate-spin mb-4" />
          <p className="text-[#94a3b8]">Analyzing {ticker}...</p>
        </div>
      )}

      {data && !loading && (
        <div>
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">{data.name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[#00d4aa] font-mono font-bold">{data.ticker}</span>
              <span className="text-[#64748b]">•</span>
              <span className="text-sm text-[#94a3b8]">ETF</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <StatCard label="Net Assets" value={data.net_assets} icon={DollarSign} color="#00d4aa" />
            <StatCard label="Expense Ratio" value={data.expense_ratio} icon={Percent} color="#3b82f6" />
            <StatCard label="Dividend Yield" value={data.dividend_yield} icon={TrendingUp} color="#8b5cf6" />
            <StatCard label="P/E Ratio" value={data.pe_ratio} icon={BarChart3} color="#f59e0b" />
          </div>

          {/* Description */}
          <GlassCard className="mb-6">
            <h3 className="text-sm font-semibold text-white mb-2">About</h3>
            <p className="text-sm text-[#e2e8f0] leading-relaxed">{data.description}</p>
          </GlassCard>

          {/* Price History Chart */}
          <GlassCard className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-semibold text-white">Price History</h3>
                <button
                  onClick={() => setPriceExpanded(!priceExpanded)}
                  className="p-1.5 hover:bg-[#1e293b] rounded-lg transition-colors"
                >
                  {priceExpanded ? <Minimize2 className="w-4 h-4 text-[#94a3b8]" /> : <Maximize2 className="w-4 h-4 text-[#94a3b8]" />}
                </button>
              </div>
              <div className="flex gap-1 flex-wrap justify-end">
                {[
                  { label: "1D", val: "1d" },
                  { label: "5D", val: "5d" },
                  { label: "1M", val: "1m" },
                  { label: "YTD", val: "ytd" },
                  { label: "1Y", val: "1y" },
                  { label: "5Y", val: "5y" },
                  { label: "ALL", val: "all" }
                ].map(({ label, val }) => (
                  <button
                    key={val}
                    onClick={() => setPriceTimeframe(val)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      priceTimeframe === val
                        ? "bg-[#00d4aa] text-black"
                        : "bg-[#1e293b] text-[#94a3b8] hover:bg-[#1e293b]/70"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {(() => {
              const chartData = getPriceChartData(data, priceTimeframe);
              const is1D = priceTimeframe === "1d";
              const openPrice = is1D && chartData.length > 0 ? chartData[0].price : null;
              const lastPrice = is1D && chartData.length > 0 ? chartData[chartData.length - 1].price : null;
              const isUp = is1D ? lastPrice >= openPrice : true;
              const lineColor = is1D ? (isUp ? "#00d4aa" : "#ef4444") : "#00d4aa";
              const gradId = is1D ? (isUp ? "priceGradGreenETF" : "priceGradRedETF") : "priceGradGreenETF";

              return chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={priceExpanded ? 500 : 250}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="priceGradGreenETF" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00d4aa" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#00d4aa" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="priceGradRedETF" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: "#64748b", fontSize: 10 }}
                      interval="preserveStartEnd"
                      tickCount={6}
                    />
                    <YAxis
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      tickFormatter={(v) => `$${v.toFixed(0)}`}
                      width={55}
                    />
                    <Tooltip
                      contentStyle={{ background: "#111827", border: "1px solid #1e293b", borderRadius: "12px", color: "#fff" }}
                      formatter={(value) => [`$${value.toFixed(2)}`, "Price"]}
                      labelFormatter={(label) => label}
                    />
                    {is1D && openPrice && (
                      <ReferenceLine
                        y={openPrice}
                        stroke="#64748b"
                        strokeDasharray="4 3"
                        label={{ value: `Open $${openPrice.toFixed(2)}`, fill: "#64748b", fontSize: 10, position: "insideTopLeft" }}
                      />
                    )}
                    <Area type="monotone" dataKey="price" stroke={lineColor} fill={`url(#${gradId})`} strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-[#64748b] text-sm">
                  No price data available for this timeframe
                </div>
              );
            })()}
          </GlassCard>

          {/* Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <GlassCard>
              <h3 className="text-sm font-semibold text-white mb-3">Performance</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#94a3b8]">YTD Return</span>
                  <span className="text-sm font-semibold text-white">{data.ytd_return}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#94a3b8]">1-Year Return</span>
                  <span className="text-sm font-semibold text-white">{data.one_year_return}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#94a3b8]">Inception Date</span>
                  <span className="text-sm font-semibold text-white">{data.inception_date}</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-sm font-semibold text-white mb-3">Top Holdings</h3>
              <div className="space-y-1">
                {data.top_holdings?.map((holding, i) => (
                  <div key={i} className="text-sm text-[#94a3b8]">
                    {i + 1}. {holding}
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Sector Allocation */}
          <GlassCard className="mb-6">
            <h3 className="text-sm font-semibold text-white mb-3">Sector Allocation</h3>
            <div className="space-y-2">
              {Object.entries(data.sector_allocation || {}).map(([sector, percent]) => (
                <div key={sector} className="flex items-center gap-3">
                  <span className="text-sm text-[#94a3b8] w-32">{sector}</span>
                  <div className="flex-1 bg-[#1e293b] rounded-full h-2 overflow-hidden">
                    <div className="bg-[#00d4aa] h-full rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="text-sm text-white font-semibold w-12 text-right">{percent}%</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Analysis */}
          <GlassCard className="mb-6">
            <h3 className="text-sm font-semibold text-[#00d4aa] mb-2">Analysis</h3>
            <p className="text-sm text-[#e2e8f0] leading-relaxed">{data.analysis}</p>
          </GlassCard>

          {/* AI Chat */}
          <div className="mb-4">
            <Button onClick={() => setShowChat(!showChat)} variant="outline" className="border-[#1e293b] text-[#94a3b8] hover:text-white hover:bg-[#1e293b]">
              {showChat ? "Hide" : "Ask"} More About {data.ticker}
            </Button>
          </div>
          {showChat && (
            <AiChatPanel topic={`${data.name} (${data.ticker})`} systemContext={`ETF analysis for ${data.name}. Expense ratio: ${data.expense_ratio}. Net assets: ${data.net_assets}.`} />
          )}
        </div>
      )}
    </div>
  );
}