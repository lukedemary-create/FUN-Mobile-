import React, { useState } from "react";
import { ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import GlassCard from "../shared/GlassCard";
import { Maximize2, Minimize2, X } from "lucide-react";

const dowHistory = [
  { year: 1900, dow: 66 }, { year: 1901, dow: 64 }, { year: 1902, dow: 68 },
  { year: 1903, dow: 49 }, { year: 1904, dow: 70 }, { year: 1905, dow: 96 },
  { year: 1906, dow: 94 }, { year: 1907, dow: 53 }, { year: 1908, dow: 86 },
  { year: 1909, dow: 99 }, { year: 1910, dow: 81 }, { year: 1911, dow: 81 },
  { year: 1912, dow: 87 }, { year: 1913, dow: 78 }, { year: 1914, dow: 53 },
  { year: 1915, dow: 99 }, { year: 1916, dow: 96 }, { year: 1917, dow: 74 },
  { year: 1918, dow: 82 }, { year: 1919, dow: 108 }, { year: 1920, dow: 71 },
  { year: 1921, dow: 81 }, { year: 1922, dow: 103 }, { year: 1923, dow: 95 },
  { year: 1924, dow: 120 }, { year: 1925, dow: 156 }, { year: 1926, dow: 157 },
  { year: 1927, dow: 202 }, { year: 1928, dow: 300 }, { year: 1929, dow: 248 },
  { year: 1930, dow: 164 }, { year: 1931, dow: 77 }, { year: 1932, dow: 60 },
  { year: 1933, dow: 99 }, { year: 1934, dow: 104 }, { year: 1935, dow: 150 },
  { year: 1936, dow: 184 }, { year: 1937, dow: 120 }, { year: 1938, dow: 154 },
  { year: 1939, dow: 150 }, { year: 1940, dow: 131 }, { year: 1941, dow: 113 },
  { year: 1942, dow: 119 }, { year: 1943, dow: 136 }, { year: 1944, dow: 152 },
  { year: 1945, dow: 192 }, { year: 1946, dow: 177 }, { year: 1947, dow: 181 },
  { year: 1948, dow: 177 }, { year: 1949, dow: 200 }, { year: 1950, dow: 235 },
  { year: 1951, dow: 269 }, { year: 1952, dow: 292 }, { year: 1953, dow: 281 },
  { year: 1954, dow: 404 }, { year: 1955, dow: 488 }, { year: 1956, dow: 499 },
  { year: 1957, dow: 436 }, { year: 1958, dow: 584 }, { year: 1959, dow: 679 },
  { year: 1960, dow: 616 }, { year: 1961, dow: 731 }, { year: 1962, dow: 652 },
  { year: 1963, dow: 762 }, { year: 1964, dow: 874 }, { year: 1965, dow: 969 },
  { year: 1966, dow: 786 }, { year: 1967, dow: 905 }, { year: 1968, dow: 943 },
  { year: 1969, dow: 800 }, { year: 1970, dow: 839 }, { year: 1971, dow: 890 },
  { year: 1972, dow: 1020 }, { year: 1973, dow: 851 }, { year: 1974, dow: 616 },
  { year: 1975, dow: 852 }, { year: 1976, dow: 1005 }, { year: 1977, dow: 831 },
  { year: 1978, dow: 805 }, { year: 1979, dow: 838 }, { year: 1980, dow: 964 },
  { year: 1981, dow: 875 }, { year: 1982, dow: 1047 }, { year: 1983, dow: 1259 },
  { year: 1984, dow: 1212 }, { year: 1985, dow: 1547 }, { year: 1986, dow: 1896 },
  { year: 1987, dow: 1939 }, { year: 1988, dow: 2169 }, { year: 1989, dow: 2753 },
  { year: 1990, dow: 2634 }, { year: 1991, dow: 3169 }, { year: 1992, dow: 3301 },
  { year: 1993, dow: 3754 }, { year: 1994, dow: 3834 }, { year: 1995, dow: 5117 },
  { year: 1996, dow: 6448 }, { year: 1997, dow: 7908 }, { year: 1998, dow: 9181 },
  { year: 1999, dow: 11497 }, { year: 2000, dow: 10787 }, { year: 2001, dow: 10022 },
  { year: 2002, dow: 8342 }, { year: 2003, dow: 10454 }, { year: 2004, dow: 10783 },
  { year: 2005, dow: 10718 }, { year: 2006, dow: 12463 }, { year: 2007, dow: 13265 },
  { year: 2008, dow: 8776 }, { year: 2009, dow: 10428 }, { year: 2010, dow: 11578 },
  { year: 2011, dow: 12218 }, { year: 2012, dow: 13104 }, { year: 2013, dow: 16577 },
  { year: 2014, dow: 17823 }, { year: 2015, dow: 17425 }, { year: 2016, dow: 19763 },
  { year: 2017, dow: 24719 }, { year: 2018, dow: 23327 }, { year: 2019, dow: 28538 },
  { year: 2020, dow: 30606 }, { year: 2021, dow: 36338 }, { year: 2022, dow: 33147 },
  { year: 2023, dow: 37690 }, { year: 2024, dow: 42544 }, { year: 2025, dow: 41800 },
  { year: 2026, dow: 42100 },
];

const majorEvents = [
  {
    year: 1907,
    label: "Panic of 1907",
    description: "Failed copper speculation triggered nationwide bank runs. J.P. Morgan personally orchestrated a bailout to prevent total collapse. This crisis led directly to the creation of the Federal Reserve System in 1913 to prevent future panics.",
    change: "-48%", positive: false
  },
  {
    year: 1914,
    label: "World War I Begins",
    description: "The NYSE closed for over 4 months — the longest closure in its history. European nations liquidated U.S. investments to fund the war, threatening a market collapse. When the exchange reopened in December, it had avoided catastrophe.",
    change: "NYSE closed 4 months", positive: false
  },
  {
    year: 1929,
    label: "Black Tuesday — Great Crash",
    description: "October 29, 1929: The DOW lost 12% in a single session. The crash wiped out millions of investors and triggered the Great Depression. From peak (381) to trough (41) in 1932, the market fell 89% — a recovery that took until 1954.",
    change: "-89% peak to trough", positive: false
  },
  {
    year: 1932,
    label: "Great Depression Bottom",
    description: "The DOW hit 41.22 on July 8, 1932 — down 89% from 1929. One-third of all U.S. banks had failed. FDR's New Deal stabilized the financial system, but full recovery of pre-crash highs didn't come until 1954 — 25 years later.",
    change: "DOW bottomed at 41", positive: false
  },
  {
    year: 1941,
    label: "Pearl Harbor Attack",
    description: "Japan's surprise attack on December 7, 1941 drew the U.S. into WWII. Markets fell briefly but stabilized rapidly as wartime manufacturing drove explosive economic growth, setting the stage for the post-war American boom.",
    change: "U.S. enters WWII", positive: false
  },
  {
    year: 1966,
    label: "DOW First Crosses 1,000",
    description: "The Dow crossed 1,000 for the first time in January 1966 — a milestone 66 years in the making. The market then entered a long 'sideways' period of stagflation and oil shocks, not sustainably holding 1,000 until 1982.",
    change: "Milestone: 1,000", positive: true
  },
  {
    year: 1974,
    label: "OPEC Oil Crisis",
    description: "The 1973 OPEC oil embargo quadrupled gasoline prices, creating stagflation — simultaneously high inflation AND recession. The DOW plunged 45% from 1973–1974. This ended the post-WWII economic boom and ushered in a decade of pain.",
    change: "-45%", positive: false
  },
  {
    year: 1987,
    label: "Black Monday",
    description: "October 19, 1987: The DOW crashed 22.6% in a single session — still the largest one-day percentage drop in history. Computerized 'program trading' amplified the cascade. Remarkably, the market recovered all losses within just 2 years.",
    change: "-22.6% in one day", positive: false
  },
  {
    year: 2000,
    label: "Dot-Com Bubble Burst",
    description: "March 2000: The NASDAQ peaked at 5,048 after years of irrational tech speculation. Companies with no earnings traded at extreme valuations. The bust wiped out $5 trillion in market value. The NASDAQ fell 78%, DOW fell ~38% by 2002.",
    change: "-38% (DOW)", positive: false
  },
  {
    year: 2001,
    label: "9/11 Attacks",
    description: "The September 11 attacks closed the NYSE for 6 trading days — the longest shutdown since WWI. Upon reopening, the DOW fell 7.1% (-684 points). The attacks deepened the ongoing dot-com recession and reshaped global security forever.",
    change: "-7.1% on reopening", positive: false
  },
  {
    year: 2008,
    label: "Global Financial Crisis",
    description: "Lehman Brothers filed for bankruptcy on September 15, 2008 — the largest in U.S. history. The subprime mortgage crisis froze global credit markets. The DOW fell 54% from peak (Oct 2007) to trough (Mar 2009). Congress passed $700B TARP.",
    change: "-54% peak to trough", positive: false
  },
  {
    year: 2020,
    label: "COVID-19 Crash & Recovery",
    description: "The DOW fell 37% in just 33 days (Feb–March 2020) — the fastest bear market in history. The Fed slashed rates to zero and Congress passed $2.2 trillion in CARES Act stimulus. The market recovered all losses within an unprecedented 5 months.",
    change: "-37% then full recovery", positive: false
  },
  {
    year: 2022,
    label: "Fed Rate Hike Bear Market",
    description: "To combat 40-year-high inflation (9.1% CPI), the Fed raised rates 11 times in 2022–2023. The DOW fell ~20%, the S&P 500 ~25%, and the NASDAQ ~33%. It was the worst year for a traditional 60/40 portfolio in modern history.",
    change: "-20%", positive: false
  },
  {
    year: 2024,
    label: "AI Boom — DOW Hits 40,000",
    description: "The DOW crossed 40,000 for the first time on May 16, 2024, driven by the artificial intelligence revolution, strong corporate earnings, and Federal Reserve rate-cut expectations. NVIDIA surged 200%+ as AI infrastructure spending exploded globally.",
    change: "+20%", positive: true
  },
];

const chartData = dowHistory.map(d => {
  const event = majorEvents.find(e => e.year === d.year);
  return event ? { ...d, ...event } : d;
});

const EventDot = (props) => {
  const { cx, cy, payload } = props;
  if (!payload?.label) return <g />;
  return (
    <g key={`dot-${payload.year}`}>
      <circle cx={cx} cy={cy} r={13} fill="#f59e0b" fillOpacity={0.2} />
      <circle cx={cx} cy={cy} r={6} fill="#f59e0b" stroke="#0a0e17" strokeWidth={2.5} />
    </g>
  );
};

export default function DowJonesTimeline() {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleChartClick = (e) => {
    const payload = e?.activePayload?.[0]?.payload;
    if (payload?.label) setSelected(payload);
  };

  return (
    <GlassCard className="mb-8">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="text-base font-bold text-white">Dow Jones Industrial Average: 1900 – Present</h3>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            126 years of market history &nbsp;•&nbsp; Click the{" "}
            <span className="text-[#f59e0b] font-semibold">● yellow dots</span> to explore major events
          </p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 hover:bg-[#1e293b] rounded-lg transition-colors flex-shrink-0"
          title={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? <Minimize2 className="w-4 h-4 text-[#94a3b8]" /> : <Maximize2 className="w-4 h-4 text-[#94a3b8]" />}
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#f59e0b] shadow-sm shadow-[#f59e0b]/50" />
          <span className="text-xs text-[#64748b]">Major market-moving event</span>
        </div>
        <span className="text-xs text-[#1e293b] bg-[#1e293b] px-2 py-0.5 rounded-full text-[#64748b]">Log scale</span>
      </div>

      <ResponsiveContainer width="100%" height={expanded ? 600 : 360}>
        <ComposedChart
          data={chartData}
          margin={{ top: 10, right: 20, bottom: 10, left: 10 }}
          onClick={handleChartClick}
          style={{ cursor: "crosshair" }}
        >
          <defs>
            <linearGradient id="dowGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="year"
            type="number"
            domain={[1900, 2026]}
            tickCount={14}
            tick={{ fill: "#64748b", fontSize: 10 }}
            tickFormatter={(v) => `${v}`}
          />
          <YAxis
            scale="log"
            domain={[40, 60000]}
            ticks={[50, 100, 500, 1000, 5000, 10000, 30000]}
            tick={{ fill: "#64748b", fontSize: 10 }}
            tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `${v}`)}
            width={42}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0]?.payload;
              return (
                <div className="bg-[#111827] border border-[#1e293b] rounded-xl p-3 shadow-xl text-xs">
                  <p className="text-[#94a3b8]">{d.year}</p>
                  <p className="text-white font-bold mt-0.5">DOW: {d.dow.toLocaleString()}</p>
                  {d.label && (
                    <>
                      <p className="text-[#f59e0b] font-semibold mt-1.5">{d.label}</p>
                      <p className="text-[#64748b] mt-0.5 italic">Click to expand</p>
                    </>
                  )}
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="dow"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#dowGradient)"
            dot={<EventDot />}
            activeDot={{ r: 4, fill: "#60a5fa", stroke: "#1e3a5f", strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Selected event detail */}
      {selected && (
        <div className="mt-5 p-4 rounded-xl bg-[#f59e0b]/5 border border-[#f59e0b]/25 relative animate-in fade-in duration-200">
          <button
            onClick={() => setSelected(null)}
            className="absolute top-3 right-3 p-1 hover:bg-[#1e293b] rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-[#64748b]" />
          </button>
          <div className="flex items-start gap-3 pr-8">
            <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] mt-1.5 flex-shrink-0 shadow shadow-[#f59e0b]/40" />
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <p className="text-[#f59e0b] font-bold text-sm">{selected.year} — {selected.label}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                  selected.positive
                    ? "bg-[#00d4aa]/10 text-[#00d4aa] border-[#00d4aa]/20"
                    : "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20"
                }`}>
                  {selected.change}
                </span>
              </div>
              <p className="text-[#e2e8f0] text-sm leading-relaxed">{selected.description}</p>
              <p className="text-xs text-[#64748b] mt-2">DOW year-end value: <span className="text-[#94a3b8] font-medium">{selected.dow.toLocaleString()}</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Event index */}
      <div className="mt-4 pt-4 border-t border-[#1e293b]">
        <p className="text-xs text-[#64748b] mb-2 uppercase tracking-wider">All Events</p>
        <div className="flex flex-wrap gap-2">
          {majorEvents.map((e) => (
            <button
              key={e.year}
              onClick={() => setSelected(chartData.find(d => d.year === e.year))}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                selected?.year === e.year
                  ? "bg-[#f59e0b]/15 border-[#f59e0b]/40 text-[#f59e0b]"
                  : "bg-[#1e293b]/50 border-[#1e293b] text-[#64748b] hover:text-[#94a3b8] hover:border-[#f59e0b]/20"
              }`}
            >
              {e.year} · {e.label}
            </button>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}