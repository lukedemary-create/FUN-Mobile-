import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { forceRefresh = false } = await req.json().catch(() => ({}));

    // Check cache first
    if (!forceRefresh) {
      const cached = await base44.asServiceRole.entities.AnalystCache.filter({ cache_key: "analyst_data" });
      if (cached.length > 0) {
        const cacheAge = Date.now() - new Date(cached[0].last_updated).getTime();
        const oneHour = 60 * 60 * 1000;
        if (cacheAge < oneHour) {
          return Response.json({
            ...cached[0].data,
            cached: true,
            last_updated: cached[0].last_updated
          });
        }
      }
    }

    // Fetch fresh data
    const fredKey = Deno.env.get("FRED_KEY");
    const eiaKey = Deno.env.get("EIA_KEY");
    
    console.log("FRED_KEY exists:", !!fredKey, "length:", fredKey?.length);
    console.log("EIA_KEY exists:", !!eiaKey, "length:", eiaKey?.length);
    
    if (!fredKey || !eiaKey) {
      return Response.json({ 
        error: "Missing API keys. Set FRED_KEY and EIA_KEY in environment variables." 
      }, { status: 500 });
    }

    // FRED series
    const fredSeries = [
      "GFDEBTN", "MTSDS133FMS", "WALCL", "FEDFUNDS", "DGS10", "DGS2", "T10Y2Y", "M2SL",
      "CPIAUCSL", "CPILFESL", "PCE", "PPIACO", "UNRATE", "PAYEMS", "JTSJOL", "CES0500000003",
      "CIVPART", "MORTGAGE30US", "MORTGAGE15US", "CSUSHPINSA", "HOUST", "PERMIT", "EXHOSLUSM495S",
      "RSAFS", "REVOLSL", "PSAVERT", "UMCSENT", "SLOAS", "TERMCBCCALLNS", "A191RL1Q225SBEA",
      "INDPRO", "BOPGSTB", "DTWEXBGS", "BAMLH0A0HYM2"
    ];

    const fredResults = await Promise.allSettled(
      fredSeries.map(async (series) => {
        try {
          // For CPI, get 13 months of data to calculate year-over-year inflation
          const limit = series === "CPIAUCSL" ? 13 : 2;
          const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${series}&api_key=${fredKey}&sort_order=desc&limit=${limit}&file_type=json`;
          const res = await fetch(url);
          const data = await res.json();
          
          console.log(`FRED ${series}: status=${res.status}, hasError=${!!data.error_message}`);
          
          if (data.error_message) {
            console.error(`FRED API error for ${series}:`, data.error_message, 'Full response:', JSON.stringify(data));
            return { series, data: null };
          }
          
          if (!data.observations || data.observations.length === 0) {
            console.warn(`No observations for ${series}`);
            return { series, data: null };
          }
          
          const current = parseFloat(data.observations[0].value);
          if (isNaN(current) || data.observations[0].value === '.') {
            return { series, data: null };
          }
          
          let previous, change, changePct;
          
          // Special handling for CPI - calculate year-over-year inflation
          if (series === "CPIAUCSL" && data.observations.length >= 13) {
            const yearAgo = parseFloat(data.observations[12].value);
            change = current - yearAgo;
            changePct = yearAgo !== 0 ? (change / yearAgo * 100) : 0;
            previous = yearAgo;
          } else {
            previous = data.observations.length > 1 ? parseFloat(data.observations[1].value) : current;
            change = current - previous;
            changePct = previous !== 0 ? (change / previous * 100) : 0;
          }
          
          return {
            series,
            data: {
              value: current,
              previous,
              date: data.observations[0].date,
              change: parseFloat(change.toFixed(4)),
              changePct: parseFloat(changePct.toFixed(2))
            }
          };
        } catch (error) {
          console.error(`Error fetching ${series}:`, error.message);
          return { series, data: null };
        }
      })
    );

    // Yahoo tickers
    const yahooTickers = [
      "GC=F", "SI=F", "HG=F", "CL=F", "NG=F", "ZW=F", "ZC=F",
      "LBS=F", "^GSPC", "^IXIC", "^DJI", "^VIX",
      "BTC-USD", "ETH-USD"
    ];

    const yahooResults = await Promise.allSettled(
      yahooTickers.map(async (ticker, index) => {
        try {
          // Add staggered delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, index * 150));
          
          const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=5d`);
          const data = await res.json();
          
          console.log(`Yahoo ${ticker}: status=${res.status}, hasResult=${!!data.chart?.result?.[0]}`);
          
          const result = data.chart?.result?.[0];
          if (!result) {
            console.warn(`No result for ${ticker}`);
            return { ticker, data: null };
          }
          
          const meta = result.meta;
          const quotes = result.indicators?.quote?.[0]?.close;
          
          if (!meta || !quotes || quotes.length === 0) {
            console.warn(`Missing data for ${ticker}`);
            return { ticker, data: null };
          }
          
          const current = meta.regularMarketPrice;
          const validQuotes = quotes.filter(q => q !== null && !isNaN(q));
          const previous = validQuotes.length > 1 ? validQuotes[validQuotes.length - 2] : current;
          const change = current - previous;
          const changePct = previous !== 0 ? (change / previous * 100) : 0;
          
          return {
            ticker,
            data: {
              value: parseFloat(current.toFixed(4)),
              previous: parseFloat(previous.toFixed(4)),
              date: new Date(meta.regularMarketTime * 1000).toISOString().split('T')[0],
              change: parseFloat(change.toFixed(4)),
              changePct: parseFloat(changePct.toFixed(2))
            }
          };
        } catch (error) {
          console.error(`Error fetching Yahoo ${ticker}:`, error.message);
          return { ticker, data: null };
        }
      })
    );

    // EIA series
    const eiaSeries = [
      { id: "PET.EMM_EPMR_PTE_NUS_DPG.W", key: "gasoline" },
      { id: "PET.EMM_EPPP_PTE_NUS_DPG.W", key: "premium_gas" },
      { id: "PET.EMM_EPD2D_PTE_NUS_DPG.W", key: "diesel" },
      { id: "PET.W_EPD2F_PRS_NUS_DPG.W", key: "heating_oil" }
    ];

    const eiaResults = await Promise.allSettled(
      eiaSeries.map(async ({ id, key }) => {
        const res = await fetch(`https://api.eia.gov/v2/seriesid/${id}?api_key=${eiaKey}&data[0]=value&sort[0][column]=period&sort[0][direction]=desc&length=2`);
        const data = await res.json();
        if (!data.response?.data || data.response.data.length === 0) return { key, data: null };
        const current = parseFloat(data.response.data[0].value);
        const previous = data.response.data.length > 1 ? parseFloat(data.response.data[1].value) : current;
        const change = current - previous;
        const changePct = previous !== 0 ? (change / previous * 100) : 0;
        return {
          key,
          data: {
            value: current,
            previous,
            date: data.response.data[0].period,
            change: parseFloat(change.toFixed(4)),
            changePct: parseFloat(changePct.toFixed(2))
          }
        };
      })
    );

    // Build response objects
    const fred = {};
    fredResults.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        fred[result.value.series] = result.value.data;
      }
    });

    const yahoo = {};
    yahooResults.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        yahoo[result.value.ticker] = result.value.data;
      }
    });

    const eia = {};
    eiaResults.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        eia[result.value.key] = result.value.data;
      }
    });

    // Calculate Misery Index
    const unemploymentRate = fred.UNRATE?.value || 0;
    const cpiYoY = fred.CPIAUCSL?.value || 0;
    const miseryValue = unemploymentRate + cpiYoY;
    let level = "low";
    let label = "Low — Strong economy";
    if (miseryValue >= 15) {
      level = "severe";
      label = "Severe — Economic crisis";
    } else if (miseryValue >= 10) {
      level = "high";
      label = "High — Significant strain";
    } else if (miseryValue >= 6) {
      level = "moderate";
      label = "Moderate — Some economic strain";
    }

    const responseData = {
      fred,
      yahoo,
      eia,
      miseryIndex: {
        value: parseFloat(miseryValue.toFixed(2)),
        label,
        level
      },
      cached: false,
      last_updated: new Date().toISOString()
    };

    // Clear old cache and create fresh one
    const existing = await base44.asServiceRole.entities.AnalystCache.filter({ cache_key: "analyst_data" });
    if (existing.length > 0) {
      await base44.asServiceRole.entities.AnalystCache.delete(existing[0].id);
    }
    await base44.asServiceRole.entities.AnalystCache.create({
      cache_key: "analyst_data",
      data: responseData,
      last_updated: new Date().toISOString()
    });

    return Response.json(responseData);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});