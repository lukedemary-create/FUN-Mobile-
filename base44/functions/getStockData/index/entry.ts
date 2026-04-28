import { createClientFromRequest } from "npm:@base44/sdk";
import yahooFinance from "npm:yahoo-finance2";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    await base44.auth.me(); // Verify user is authenticated
    
    const { ticker } = await req.json();
    
    if (!ticker) {
      return Response.json({ error: "Ticker is required" }, { status: 400 });
    }

    // Fetch quote data
    const quote = await yahooFinance.quote(ticker);
    
    // Fetch historical price data (5 years)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 5);
    
    const historical = await yahooFinance.historical(ticker, {
      period1: startDate,
      period2: endDate,
      interval: '1wk'
    });
    
    // Fetch company info
    const quoteSummary = await yahooFinance.quoteSummary(ticker, {
      modules: ['assetProfile', 'financialData', 'defaultKeyStatistics', 'incomeStatementHistory', 'incomeStatementHistoryQuarterly']
    });
    
    // Process price history
    const priceHistory = historical.map(item => ({
      date: item.date.toISOString().split('T')[0],
      price: item.close
    }));
    
    // Process revenue history from income statements
    const revenueHistory: Array<{date: string, revenue: number}> = [];
    
    if (quoteSummary.incomeStatementHistoryQuarterly?.incomeStatementHistory) {
      quoteSummary.incomeStatementHistoryQuarterly.incomeStatementHistory.forEach(statement => {
        if (statement.endDate && statement.totalRevenue) {
          revenueHistory.push({
            date: statement.endDate.value.toISOString().split('T')[0],
            revenue: statement.totalRevenue.raw
          });
        }
      });
    }
    
    // Sort revenue by date
    revenueHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Build response
    const response = {
      company_name: quote.longName || quote.shortName || ticker,
      ticker: quote.symbol,
      sector: quote.sector || quoteSummary.assetProfile?.sector || "N/A",
      industry: quote.industry || quoteSummary.assetProfile?.industry || "N/A",
      description: quoteSummary.assetProfile?.longBusinessSummary || "No description available",
      current_price: quote.regularMarketPrice,
      pe_ratio: quote.trailingPE?.toFixed(2) || "N/A",
      market_cap: formatMarketCap(quote.marketCap),
      revenue: formatRevenue(quote.totalRevenue),
      dividend_yield: quote.dividendYield ? parseFloat(quote.dividendYield.toFixed(2)) + "%" : "N/A",
      eps: quote.epsTrailingTwelveMonths?.toFixed(2) || "N/A",
      beta: quote.beta?.toFixed(2) || quoteSummary.defaultKeyStatistics?.beta?.raw?.toFixed(2) || "N/A",
      fifty_two_week_high: quote.fiftyTwoWeekHigh,
      fifty_two_week_low: quote.fiftyTwoWeekLow,
      avg_volume: quote.averageDailyVolume10Day,
      price_history: priceHistory,
      revenue_history: revenueHistory,
      website: quoteSummary.assetProfile?.website || null,
      employees: quoteSummary.assetProfile?.fullTimeEmployees || null
    };
    
    return Response.json(response);
    
  } catch (error: any) {
    console.error("Error fetching stock data:", error);
    return Response.json({ 
      error: error.message || "Failed to fetch stock data" 
    }, { status: 500 });
  }
});

function formatMarketCap(marketCap: number | undefined): string {
  if (!marketCap) return "N/A";
  if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
  if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
  if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
  return `$${marketCap.toFixed(2)}`;
}

function formatRevenue(revenue: number | undefined): string {
  if (!revenue) return "N/A";
  if (revenue >= 1e9) return `$${(revenue / 1e9).toFixed(2)}B`;
  if (revenue >= 1e6) return `$${(revenue / 1e6).toFixed(2)}M`;
  return `$${revenue.toFixed(2)}`;
}