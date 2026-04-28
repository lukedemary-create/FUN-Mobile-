import { createClientFromRequest } from "npm:@base44/sdk@0.8.6";
import YahooFinance from "npm:yahoo-finance2";

const yahooFinance = new YahooFinance();

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    await base44.auth.me();

    const { startDate, endDate, index = "^GSPC" } = await req.json();

    if (!startDate || !endDate) {
      return Response.json({ error: "startDate and endDate are required" }, { status: 400 });
    }

    // Fetch real market data from Yahoo Finance
    // Default to S&P 500 (^GSPC), but allow other indices:
    // ^DJI = Dow Jones, ^IXIC = NASDAQ, ^GSPC = S&P 500
    const realData = await fetchRealMarketData(index, startDate, endDate);
    return Response.json(realData);

  } catch (error) {
    console.error("Error fetching market history:", error);
    return Response.json({ 
      error: error.message || "Failed to fetch market history" 
    }, { status: 500 });
  }
});

async function fetchRealMarketData(ticker, startDate, endDate) {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Fetch historical data from Yahoo Finance
    const chart = await yahooFinance.chart(ticker, {
      period1: start,
      period2: end,
      interval: '1wk' // Weekly data for better performance
    });
    
    // Process the data
    const data = chart.quotes.map(quote => ({
      date: new Date(quote.date).toISOString().split('T')[0],
      value: parseFloat(quote.close?.toFixed(2) || 0),
      high: parseFloat(quote.high?.toFixed(2) || 0),
      low: parseFloat(quote.low?.toFixed(2) || 0),
      open: parseFloat(quote.open?.toFixed(2) || 0),
      volume: quote.volume || 0
    })).filter(item => item.value > 0); // Filter out invalid data points
    
    if (data.length === 0) {
      throw new Error("No valid data retrieved for the specified date range");
    }
    
    // Calculate statistics
    const startValue = data[0]?.value || null;
    const endValue = data[data.length - 1]?.value || null;
    const minValue = Math.min(...data.map(d => d.low));
    const maxValue = Math.max(...data.map(d => d.high));
    const change = startValue && endValue 
      ? ((endValue - startValue) / startValue * 100).toFixed(2)
      : null;
    
    return {
      data,
      startValue,
      endValue,
      minValue,
      maxValue,
      change,
      indexName: getIndexName(ticker)
    };
  } catch (error) {
    console.error("Error in fetchRealMarketData:", error);
    throw error;
  }
}

function getIndexName(ticker) {
  const indexNames = {
    "^GSPC": "S&P 500",
    "^DJI": "Dow Jones Industrial Average",
    "^IXIC": "NASDAQ Composite",
    "^RUT": "Russell 2000",
    "^VIX": "CBOE Volatility Index"
  };
  return indexNames[ticker] || ticker;
}