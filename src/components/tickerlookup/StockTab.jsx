import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, BarChart3, DollarSign, Users, Activity, TrendingDown, Maximize2, Minimize2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ReferenceLine } from "recharts";
import GlassCard from "../shared/GlassCard";
import StatCard from "../shared/StatCard";
import AiChatPanel from "../shared/AiChatPanel";

export default function StockTab({ prefilledTicker, onTickerAnalyzed }) {
  const [ticker, setTicker] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [priceTimeframe, setPriceTimeframe] = useState("5y");
  const [revenueView, setRevenueView] = useState("annual");
  const [priceExpanded, setPriceExpanded] = useState(false);
  const [revenueExpanded, setRevenueExpanded] = useState(false);

  React.useEffect(() => {
    if (prefilledTicker) {
      setTicker(prefilledTicker);
      lookupStockWithTicker(prefilledTicker);
    }
  }, [prefilledTicker]);

  const lookupStockWithTicker = async (tickerSymbol) => {
    if (!tickerSymbol.trim()) return;
    setLoading(true);
    setShowChat(false);
    setData(null);

    try {
      const { data: stockData } = await base44.functions.invoke('getStockData', { ticker: tickerSymbol.toUpperCase() });
      
      if (!stockData || stockData.error) {
        throw new Error(stockData?.error || "Invalid ticker or data not available");
      }

      const aiAnalysis = await base44.integrations.Core.InvokeLLM({
        prompt: `You are Planora, a financial education AI. Provide educational analysis for ${stockData.company_name} (${stockData.ticker}).

Given this data:
- Sector: ${stockData.sector}
- Industry: ${stockData.industry}
- P/E Ratio: ${stockData.pe_ratio}
- Beta: ${stockData.beta}

Provide:
1. Sentiment: Current market sentiment (bullish/bearish) with brief reasoning
2. Risk Level: Low/Medium/High with explanation
3. Historical Performance: How this sector/company performed during major events (2008 crisis, COVID, etc.)
4. Sector Analysis: How this sector performs in different market conditions
5. Rebound History: Typical recovery patterns for this sector

Keep each section to 2-3 sentences. Educational only, not advice.`,
        response_json_schema: {
          type: "object",
          properties: {
            sentiment: { type: "string" },
            sentiment_detail: { type: "string" },
            risk_level: { type: "string" },
            historical_performance: { type: "string" },
            sector_analysis: { type: "string" },
            rebound_history: { type: "string" }
          }
        }
      });
      
      setData({
        ...stockData,
        ...aiAnalysis,
        sources: ["Yahoo Finance"]
      });

      if (onTickerAnalyzed) onTickerAnalyzed();
      
    } catch (error) {
      console.error("Error fetching stock data:", error);
      const errorMsg = error.message || "Failed to fetch stock data. Please check the ticker symbol and try again.";
      alert(errorMsg);
    }
    
    setLoading(false);
  };

  const lookupStock = async () => {
    lookupStockWithTicker(ticker);
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

  const formatMoney = (value) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value}`;
  };

  return (
    <div>
      {/* Search */}
      <GlassCard className="mb-8">
        <form onSubmit={(e) => { e.preventDefault(); lookupStock(); }} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
            <Input
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="Enter stock ticker symbol (e.g., AAPL, TSLA, MSFT)"
              className="pl-10 bg-[#0a0e17] border-[#1e293b] text-white placeholder:text-[#64748b] text-lg"
            />
          </div>
          <Button type="submit" disabled={loading || !ticker.trim()} className="bg-[#3b82f6] hover:bg-[#3b82f6]/80 text-white px-6">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Analyze"}
          </Button>
        </form>
      </GlassCard>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-[#3b82f6] animate-spin mb-4" />
          <p className="text-[#94a3b8]">Analyzing {ticker}...</p>
        </div>
      )}

      {data && !loading && (
        <div>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">{data.company_name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[#3b82f6] font-mono font-bold">{data.ticker}</span>
                <span className="text-[#64748b]">•</span>
                <span className="text-sm text-[#94a3b8]">{data.sector} — {data.industry}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 md:mt-0">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                data.risk_level?.toLowerCase() === "high" ? "bg-[#ef4444]/10 text-[#ef4444]" :
                data.risk_level?.toLowerCase() === "low" ? "bg-[#00d4aa]/10 text-[#00d4aa]" :
                "bg-[#f59e0b]/10 text-[#f59e0b]"
              }`}>
                {data.risk_level} Risk
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                data.sentiment?.toLowerCase().includes("bull") ? "bg-[#00d4aa]/10 text-[#00d4aa]" :
                "bg-[#ef4444]/10 text-[#ef4444]"
              }`}>
                {data.sentiment}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <StatCard label="P/E Ratio" value={data.pe_ratio} icon={BarChart3} color="#3b82f6" />
            <StatCard label="Market Cap" value={data.market_cap} icon={DollarSign} color="#00d4aa" />
            <StatCard label="1Y Target" value={data.one_year_target} icon={Activity} color="#f59e0b" />
            <StatCard label="Dividend" value={data.dividend_yield || "N/A"} icon={Users} color="#8b5cf6" />
            <StatCard label="Beta" value={data.beta} icon={TrendingDown} color="#ef4444" />
          </div>

          {/* Description */}
          <GlassCard className="mb-6">
            <p className="text-sm text-[#e2e8f0] leading-relaxed">{data.description}</p>
          </GlassCard>

          {/* Charts */}
          <div className={`grid gap-6 mb-6 ${priceExpanded || revenueExpanded ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
            {/* Price History Chart */}
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-semibold text-white">Price History</h3>
                  <button
                    onClick={() => setPriceExpanded(!priceExpanded)}
                    className="p-1.5 hover:bg-[#1e293b] rounded-lg transition-colors touch-manipulation active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label={priceExpanded ? "Minimize price chart" : "Expand price chart"}
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
                      className={`px-2 py-1 text-xs rounded transition-colors touch-manipulation active:scale-95 min-h-[44px] ${
                        priceTimeframe === val
                          ? "bg-[#3b82f6] text-white"
                          : "bg-[#1e293b] text-[#94a3b8] hover:bg-[#1e293b]/70"
                      }`}
                      aria-label={`View ${label} price history`}
                      aria-pressed={priceTimeframe === val}
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
                const lineColor = is1D ? (isUp ? "#00d4aa" : "#ef4444") : "#3b82f6";
                const gradId = is1D ? (isUp ? "priceGradGreen" : "priceGradRed") : "priceGradBlue";

                return chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={priceExpanded ? 500 : 250}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="priceGradBlue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="priceGradGreen" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00d4aa" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#00d4aa" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="priceGradRed" x1="0" y1="0" x2="0" y2="1">
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
                        domain={is1D ? ['auto', 'auto'] : ['auto', 'auto']}
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
                    No data available for this timeframe
                  </div>
                );
              })()}
            </GlassCard>

            {/* Revenue + Earnings Chart */}
            {(data.revenue_annual?.length > 0 || data.revenue_quarterly?.length > 0) && (
              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-semibold text-white">Revenue & Earnings</h3>
                    <button
                      onClick={() => setRevenueExpanded(!revenueExpanded)}
                      className="p-1.5 hover:bg-[#1e293b] rounded-lg transition-colors touch-manipulation active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      aria-label={revenueExpanded ? "Minimize revenue chart" : "Expand revenue chart"}
                    >
                      {revenueExpanded ? <Minimize2 className="w-4 h-4 text-[#94a3b8]" /> : <Maximize2 className="w-4 h-4 text-[#94a3b8]" />}
                    </button>
                  </div>
                  <div className="flex gap-1">
                    {["annual", "quarterly"].map(v => (
                      <button
                        key={v}
                        onClick={() => setRevenueView(v)}
                        className={`px-3 py-1 text-xs rounded transition-colors capitalize touch-manipulation active:scale-95 min-h-[44px] ${
                          revenueView === v
                            ? "bg-[#00d4aa] text-black font-semibold"
                            : "bg-[#1e293b] text-[#94a3b8] hover:bg-[#1e293b]/70"
                        }`}
                        aria-label={`View ${v} revenue data`}
                        aria-pressed={revenueView === v}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-[#00d4aa]" />
                    <span className="text-xs text-[#94a3b8]">Revenue</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-[#3b82f6]" />
                    <span className="text-xs text-[#94a3b8]">Net Income</span>
                  </div>
                </div>
                {(() => {
                  const chartData = revenueView === "annual" ? (data.revenue_annual || []) : (data.revenue_quarterly || []);
                  return chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={revenueExpanded ? 500 : 250}>
                      <BarChart data={chartData} barCategoryGap="25%">
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="displayDate" tick={{ fill: "#64748b", fontSize: 11 }} />
                        <YAxis
                          tick={{ fill: "#64748b", fontSize: 11 }}
                          tickFormatter={formatMoney}
                        />
                        <Tooltip
                          contentStyle={{ background: "#111827", border: "1px solid #1e293b", borderRadius: "12px", color: "#fff" }}
                          formatter={(value, name) => [formatMoney(value), name === "revenue" ? "Revenue" : "Net Income"]}
                        />
                        <Bar dataKey="revenue" fill="#00d4aa" radius={[3, 3, 0, 0]} name="revenue" />
                        <Bar dataKey="earnings" fill="#3b82f6" radius={[3, 3, 0, 0]} name="earnings" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-[#64748b] text-sm">
                      No data available
                    </div>
                  );
                })()}
              </GlassCard>
            )}
          </div>

          {/* Analysis Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <GlassCard>
              <h3 className="text-sm font-semibold text-[#f59e0b] mb-3">Sentiment Analysis</h3>
              <ReactMarkdown className="prose prose-sm prose-invert max-w-none prose-p:text-[#e2e8f0]">{data.sentiment_detail}</ReactMarkdown>
            </GlassCard>
            <GlassCard>
              <h3 className="text-sm font-semibold text-[#8b5cf6] mb-3">Sector Analysis</h3>
              <ReactMarkdown className="prose prose-sm prose-invert max-w-none prose-p:text-[#e2e8f0]">{data.sector_analysis}</ReactMarkdown>
            </GlassCard>
            <GlassCard>
              <h3 className="text-sm font-semibold text-[#ef4444] mb-3">Historical Performance</h3>
              <ReactMarkdown className="prose prose-sm prose-invert max-w-none prose-p:text-[#e2e8f0]">{data.historical_performance}</ReactMarkdown>
            </GlassCard>
            <GlassCard>
              <h3 className="text-sm font-semibold text-[#00d4aa] mb-3">Rebound History</h3>
              <ReactMarkdown className="prose prose-sm prose-invert max-w-none prose-p:text-[#e2e8f0]">{data.rebound_history}</ReactMarkdown>
            </GlassCard>
          </div>

          {/* Sources */}
          {data.sources?.length > 0 && (
            <GlassCard className="mb-6">
              <h4 className="text-xs uppercase tracking-wider text-[#64748b] mb-2">Sources</h4>
              <div className="flex flex-wrap gap-2">
                {data.sources.map((s, i) => (
                  <span key={i} className="text-xs text-[#94a3b8] px-2 py-1 bg-[#0a0e17] rounded-lg border border-[#1e293b]">{s}</span>
                ))}
              </div>
            </GlassCard>
          )}

          {/* AI Chat */}
          <div className="mb-4">
            <Button onClick={() => setShowChat(!showChat)} variant="outline" className="border-[#1e293b] text-[#94a3b8] hover:text-white hover:bg-[#1e293b]">
              {showChat ? "Hide" : "Ask"} More About {data.ticker}
            </Button>
          </div>
          {showChat && (
            <AiChatPanel topic={`${data.company_name} (${data.ticker})`} systemContext={`Stock analysis for ${data.company_name}. Sector: ${data.sector}. P/E: ${data.pe_ratio}. Market Cap: ${data.market_cap}.`} />
          )}
        </div>
      )}
    </div>
  );
}