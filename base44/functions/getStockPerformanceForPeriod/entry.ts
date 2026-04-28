import { createClientFromRequest } from "npm:@base44/sdk@0.8.6";
import YahooFinance from "npm:yahoo-finance2";

const yahooFinance = new YahooFinance();

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    await base44.auth.me();

    const { ticker, startDate, endDate } = await req.json();

    if (!ticker || !startDate || !endDate) {
      return Response.json({ error: "ticker, startDate, and endDate are required" }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    try {
      const chart = await yahooFinance.chart(ticker, {
        period1: start,
        period2: end,
        interval: '1d'
      });

      const quotes = chart.quotes.filter(q => q.close);
      
      if (quotes.length === 0) {
        return Response.json({ 
          error: `No data available for ${ticker} during this period` 
        }, { status: 404 });
      }

      const startPrice = quotes[0].close;
      const endPrice = quotes[quotes.length - 1].close;
      const returnPct = ((endPrice - startPrice) / startPrice * 100).toFixed(2);
      const highPrice = Math.max(...quotes.map(q => q.high));
      const lowPrice = Math.min(...quotes.map(q => q.low));

      return Response.json({
        ticker: ticker.toUpperCase(),
        companyName: chart.meta.symbol,
        startPrice: startPrice.toFixed(2),
        endPrice: endPrice.toFixed(2),
        return: `${returnPct >= 0 ? '+' : ''}${returnPct}%`,
        returnValue: parseFloat(returnPct),
        highPrice: highPrice.toFixed(2),
        lowPrice: lowPrice.toFixed(2),
        startDate,
        endDate
      });

    } catch (error) {
      return Response.json({ 
        error: `Unable to find data for ticker ${ticker}. Please verify the ticker symbol.` 
      }, { status: 404 });
    }

  } catch (error) {
    console.error("Error fetching stock performance:", error);
    return Response.json({ 
      error: error.message || "Failed to fetch stock performance" 
    }, { status: 500 });
  }
});