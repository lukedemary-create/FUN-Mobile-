import { createClientFromRequest } from "npm:@base44/sdk@0.8.6";
import YahooFinance from "npm:yahoo-finance2";

const yahooFinance = new YahooFinance();

// Map sectors to their corresponding ETFs
const SECTOR_ETFS = {
  "Technology": "XLK",
  "Healthcare": "XLV",
  "Financial": "XLF",
  "Energy": "XLE",
  "Consumer Discretionary": "XLY",
  "Consumer Staples": "XLP",
  "Industrials": "XLI",
  "Real Estate": "XLRE",
  "Utilities": "XLU",
  "Materials": "XLB",
  "Communication": "XLC"
};

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

    // Fetch performance for all sectors in parallel
    const sectorPromises = Object.entries(SECTOR_ETFS).map(async ([name, ticker]) => {
      try {
        const chart = await yahooFinance.chart(ticker, {
          period1: start,
          period2: end,
          interval: '1wk'
        });

        const quotes = chart.quotes.filter(q => q.close);
        if (quotes.length === 0) {
          return { name, return: "N/A", error: true };
        }

        const startPrice = quotes[0].close;
        const endPrice = quotes[quotes.length - 1].close;
        const returnPct = ((endPrice - startPrice) / startPrice * 100).toFixed(2);

        return {
          name,
          return: `${returnPct >= 0 ? '+' : ''}${returnPct}%`,
          returnValue: parseFloat(returnPct),
          startPrice: startPrice.toFixed(2),
          endPrice: endPrice.toFixed(2),
          ticker
        };
      } catch (error) {
        console.error(`Error fetching ${name} (${ticker}):`, error.message);
        return { name, return: "N/A", error: true };
      }
    });

    const sectorPerformance = await Promise.all(sectorPromises);
    
    // Sort by performance (best to worst)
    const sortedPerformance = sectorPerformance
      .filter(s => !s.error)
      .sort((a, b) => b.returnValue - a.returnValue);

    return Response.json({ 
      sectors: sortedPerformance,
      period: `${startDate} to ${endDate}`
    });

  } catch (error) {
    console.error("Error fetching sector performance:", error);
    return Response.json({ 
      error: error.message || "Failed to fetch sector performance" 
    }, { status: 500 });
  }
});