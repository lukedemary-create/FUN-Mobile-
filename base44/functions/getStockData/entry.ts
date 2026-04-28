import { createClientFromRequest } from "npm:@base44/sdk@0.8.6";
import YahooFinance from "npm:yahoo-finance2";

const yahooFinance = new YahooFinance();

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    await base44.auth.me();
    
    const { ticker } = await req.json();
    
    if (!ticker) {
      return Response.json({ error: "Ticker is required" }, { status: 400 });
    }

    const endDate = new Date();

    // Fetch quote data
    const quote = await yahooFinance.quote(ticker);
    
    // 1) Weekly price history for ALL/5Y views (full history)
    const chartAll = await yahooFinance.chart(ticker, {
      period1: '1970-01-01',
      period2: endDate,
      interval: '1wk'
    });

    // 2) Daily price history for 1Y/YTD/1M/5D views (last 2 years)
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    const chartDaily = await yahooFinance.chart(ticker, {
      period1: twoYearsAgo,
      period2: endDate,
      interval: '1d'
    });

    // 3) 15-minute intraday data for 1D view (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const chartIntraday = await yahooFinance.chart(ticker, {
      period1: sevenDaysAgo,
      period2: endDate,
      interval: '15m'
    });
    
    // Fetch comprehensive company info
    const quoteSummary = await yahooFinance.quoteSummary(ticker, {
      modules: ['assetProfile', 'financialData', 'defaultKeyStatistics', 'summaryDetail']
    });
    
    // Process weekly price history (5Y/ALL)
    const priceHistory = chartAll.quotes
      .filter(item => item.close != null)
      .map(item => ({
        date: new Date(item.date).toISOString().split('T')[0],
        price: item.close
      }));

    // Process daily price history (1Y/YTD/1M/5D)
    const priceHistoryDaily = chartDaily.quotes
      .filter(item => item.close != null)
      .map(item => ({
        date: new Date(item.date).toISOString().split('T')[0],
        price: item.close
      }));

    // Process intraday price history (1D) — store full ISO for frontend timezone formatting
    const priceHistoryIntraday = chartIntraday.quotes
      .filter(item => item.close != null)
      .map(item => ({
        date: new Date(item.date).toISOString(),
        price: item.close
      }));
    
    // Fetch revenue + earnings data (annual + quarterly)
    let revenueAnnual = [];
    let revenueQuarterly = [];
    
    try {
      const fundamentals = await yahooFinance.quoteSummary(ticker, {
        modules: ['incomeStatementHistory', 'incomeStatementHistoryQuarterly']
      });
      
      // Annual data
      if (fundamentals.incomeStatementHistory?.incomeStatementHistory) {
        fundamentals.incomeStatementHistory.incomeStatementHistory.forEach(item => {
          if (item.endDate) {
            const year = new Date(item.endDate).getFullYear();
            revenueAnnual.push({
              displayDate: year.toString(),
              year,
              revenue: item.totalRevenue?.raw ?? item.totalRevenue ?? 0,
              earnings: item.netIncome?.raw ?? item.netIncome ?? 0
            });
          }
        });
        revenueAnnual.sort((a, b) => a.year - b.year);
      }
      
      // Quarterly data
      if (fundamentals.incomeStatementHistoryQuarterly?.incomeStatementHistory) {
        fundamentals.incomeStatementHistoryQuarterly.incomeStatementHistory.forEach(item => {
          if (item.endDate) {
            const date = new Date(item.endDate);
            const year = date.getFullYear();
            const quarter = Math.floor(date.getMonth() / 3) + 1;
            revenueQuarterly.push({
              displayDate: `Q${quarter}'${year.toString().slice(2)}`,
              year,
              quarter,
              revenue: item.totalRevenue?.raw ?? item.totalRevenue ?? 0,
              earnings: item.netIncome?.raw ?? item.netIncome ?? 0
            });
          }
        });
        revenueQuarterly.sort((a, b) => a.year !== b.year ? a.year - b.year : a.quarter - b.quarter);
      }
      
    } catch (e) {
      console.log("Revenue data not available:", e.message);
    }
    
    // Extract revenue
    const revenue = quoteSummary.financialData?.totalRevenue?.raw || 
                   quoteSummary.financialData?.totalRevenue ||
                   quote.totalRevenue;
    
    // Extract beta
    const beta = quoteSummary.summaryDetail?.beta?.raw ||
                quoteSummary.summaryDetail?.beta ||
                quoteSummary.defaultKeyStatistics?.beta?.raw || 
                quoteSummary.defaultKeyStatistics?.beta ||
                quote.beta;
    
    const response = {
      company_name: quote.longName || quote.shortName || ticker,
      ticker: quote.symbol,
      sector: quote.sector || quoteSummary.assetProfile?.sector || "N/A",
      industry: quote.industry || quoteSummary.assetProfile?.industry || "N/A",
      description: quoteSummary.assetProfile?.longBusinessSummary || "No description available",
      current_price: quote.regularMarketPrice,
      pe_ratio: (quote.trailingPE || quoteSummary.defaultKeyStatistics?.trailingPE?.raw)?.toFixed(2) || "N/A",
      market_cap: formatMarketCap(quote.marketCap || quoteSummary.summaryDetail?.marketCap?.raw),
      revenue: formatRevenue(revenue),
      dividend_yield: (() => {
        let divYield = null;
        if (quoteSummary.summaryDetail?.dividendYield != null && quoteSummary.summaryDetail.dividendYield !== 0) {
          divYield = quoteSummary.summaryDetail.dividendYield;
        } else if (quoteSummary.summaryDetail?.trailingAnnualDividendYield != null && quoteSummary.summaryDetail.trailingAnnualDividendYield !== 0) {
          divYield = quoteSummary.summaryDetail.trailingAnnualDividendYield;
        } else if (quoteSummary.summaryDetail?.dividendRate && quote.regularMarketPrice) {
          divYield = quoteSummary.summaryDetail.dividendRate / quote.regularMarketPrice;
        }
        if (!divYield || divYield === 0) return "N/A";
        return (divYield * 100).toFixed(2) + "%";
      })(),
      eps: (quote.epsTrailingTwelveMonths || quoteSummary.defaultKeyStatistics?.trailingEps?.raw)?.toFixed(2) || "N/A",
      beta: beta ? beta.toFixed(2) : "N/A",
      one_year_target: (() => {
        const target = quote.targetMeanPrice || quoteSummary.financialData?.targetMeanPrice;
        return target ? `$${target.toFixed(2)}` : "N/A";
      })(),
      fifty_two_week_high: quote.fiftyTwoWeekHigh,
      fifty_two_week_low: quote.fiftyTwoWeekLow,
      avg_volume: quote.averageDailyVolume10Day,
      price_history: priceHistory,
      price_history_daily: priceHistoryDaily,
      price_history_intraday: priceHistoryIntraday,
      revenue_annual: revenueAnnual,
      revenue_quarterly: revenueQuarterly,
      website: quoteSummary.assetProfile?.website || null,
      employees: quoteSummary.assetProfile?.fullTimeEmployees || null
    };
    
    return Response.json(response);
    
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return Response.json({ 
      error: error.message || "Failed to fetch stock data" 
    }, { status: 500 });
  }
});

function formatMarketCap(marketCap) {
  if (!marketCap) return "N/A";
  if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
  if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
  if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
  return `$${marketCap.toFixed(2)}`;
}

function formatRevenue(revenue) {
  if (!revenue) return "N/A";
  if (revenue >= 1e9) return `$${(revenue / 1e9).toFixed(2)}B`;
  if (revenue >= 1e6) return `$${(revenue / 1e6).toFixed(2)}M`;
  return `$${revenue.toFixed(2)}`;
}