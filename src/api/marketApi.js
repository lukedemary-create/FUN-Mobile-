// Planora Market API — client-side helper for backend endpoints
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// ─── Market data ──────────────────────────────────────────────────────────────
export const api = {
  // Indices: GET /api/indices
  indices: () => get('/api/indices'),

  // Market movers: GET /api/market/movers
  movers: () => get('/api/market/movers'),

  // Market breadth: GET /api/market/breadth
  breadth: () => get('/api/market/breadth'),

  // Sector heatmap: GET /api/sector/heatmap
  sectorHeatmap: () => get('/api/sector/heatmap'),

  // Watchlist quotes: GET /api/watchlist/quote?symbols=AAPL,MSFT
  watchlistQuotes: (symbols) => get(`/api/watchlist/quote?symbols=${symbols.join(',')}`),

  // Economic calendar: GET /api/economic-calendar
  economicCalendar: () => get('/api/economic-calendar'),

  // FRED series: GET /api/fred/:seriesId
  fred: (seriesId, limit = 100) => get(`/api/fred/${seriesId}?limit=${limit}`),

  // FRED multiple: GET /api/fred-multiple?series=GDP,UNRATE
  fredMultiple: (seriesIds, limit = 100) => get(`/api/fred-multiple?series=${seriesIds.join(',')}&limit=${limit}`),

  // EIA state retail gas prices
  eiaStateGas: () => get('/api/eia-state-gas'),

  // BLS: GET /api/bls?seriesIds=SERIES1,SERIES2
  bls: (seriesIds) => get(`/api/bls?seriesIds=${seriesIds.join(',')}`),

  // EIA: GET /api/eia/:route
  eia: (route) => get(`/api/eia/${encodeURIComponent(route)}`),

  // ─── Existing function-based endpoints ─────────────────────────────────────
  stockData: (ticker) => post('/functions/getStockData', { ticker }),
  marketHistory: (startDate, endDate, index = '^GSPC') => post('/functions/getMarketHistory', { startDate, endDate, index }),
  sectorPerformance: (startDate, endDate) => post('/functions/getSectorPerformance', { startDate, endDate }),
  topPerformers: (startDate, endDate) => post('/functions/getTopPerformers', { startDate, endDate }),
  stockPerformance: (tickers, startDate, endDate) => post('/functions/getStockPerformanceForPeriod', { tickers, startDate, endDate }),
  analystData: () => post('/functions/fetchAnalystData', {}),
  advisorReport: (params) => post('/functions/generateAdvisorReport', params),
  scrapeAdvisor: (params) => post('/functions/scrapeAdvisorData', params),
};

export default api;
