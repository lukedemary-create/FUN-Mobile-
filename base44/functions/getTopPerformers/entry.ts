import { createClientFromRequest } from "npm:@base44/sdk@0.8.6";
import YahooFinance from "npm:yahoo-finance2";

const yahooFinance = new YahooFinance();

// S&P 500 major stocks - representative sample for performance tracking
const SP500_STOCKS = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "BRK-B", "UNH", "JNJ",
  "XOM", "V", "PG", "JPM", "MA", "HD", "CVX", "MRK", "ABBV", "PFE",
  "KO", "PEP", "AVGO", "COST", "TMO", "MCD", "ABT", "CSCO", "ACN", "DHR",
  "NEE", "LIN", "NKE", "VZ", "ADBE", "CRM", "TXN", "WMT", "BMY", "UPS",
  "QCOM", "PM", "RTX", "HON", "INTU", "AMGN", "LOW", "UNP", "SBUX", "IBM",
  "BA", "CAT", "GS", "SPGI", "DE", "AXP", "BLK", "ELV", "MDT", "GILD",
  "AMT", "MMC", "LMT", "CVS", "BKNG", "SYK", "PLD", "CI", "ADP", "TJX",
  "MDLZ", "ZTS", "C", "REGN", "CB", "MMM", "SO", "ADI", "MO", "DUK",
  "ISRG", "EOG", "TGT", "USB", "SLB", "CL", "PNC", "BDX", "NSC", "ITW",
  "GE", "CSX", "CME", "APD", "SCHW", "AON", "WM", "COP", "ETN", "F"
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    await base44.auth.me();

    const { startDate, endDate } = await req.json();

    if (!startDate || !endDate) {
      return Response.json({ error: "startDate and endDate are required" }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Fetch performance for all stocks in parallel
    const performancePromises = SP500_STOCKS.map(async (ticker) => {
      try {
        const chart = await yahooFinance.chart(ticker, {
          period1: start,
          period2: end,
          interval: '1wk'
        });

        const quotes = chart.quotes.filter(q => q.close);
        if (quotes.length < 2) return null;

        const startPrice = quotes[0].close;
        const endPrice = quotes[quotes.length - 1].close;
        const returnPct = ((endPrice - startPrice) / startPrice * 100);

        return {
          ticker,
          company: chart.meta.longName || ticker,
          return: `${returnPct >= 0 ? '+' : ''}${returnPct.toFixed(2)}%`,
          returnValue: returnPct
        };
      } catch (error) {
        return null;
      }
    });

    const results = (await Promise.all(performancePromises)).filter(r => r !== null);
    
    // Sort by performance
    const sorted = results.sort((a, b) => b.returnValue - a.returnValue);
    
    // Get top 10 best and worst
    const bestPerformers = sorted.slice(0, 10);
    const worstPerformers = sorted.slice(-10).reverse();

    return Response.json({ 
      bestPerformers,
      worstPerformers,
      totalAnalyzed: results.length
    });

  } catch (error) {
    console.error("Error fetching top performers:", error);
    return Response.json({ 
      error: error.message || "Failed to fetch top performers" 
    }, { status: 500 });
  }
});