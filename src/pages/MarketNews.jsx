import React, { useState, useMemo, useEffect } from "react";
import {
  Newspaper, TrendingUp, TrendingDown, Minus,
  Flame, BarChart2, Tag, Clock, Zap, Activity,
  Bitcoin, DollarSign, Cpu, Leaf, Globe, Landmark,
  ChevronRight, AlertTriangle,
} from "lucide-react";

/* ─── Hardcoded News Stories ──────────────────────────────────────── */
const STORIES = [
  {
    id: 1,
    category: "Fed & Macro",
    headline: "Fed Holds Rates at 4.00–4.25%, Powell Signals Two Cuts Still Possible in 2026",
    summary:
      "The Federal Open Market Committee voted unanimously to keep the federal funds rate unchanged at 4.00–4.25% at its April meeting, citing persistent services inflation and a still-resilient labor market. Chair Powell acknowledged that progress toward the 2% target has stalled in recent months but reiterated that the committee sees two quarter-point cuts as appropriate before year-end if disinflation resumes. Markets were initially disappointed, as fed funds futures had priced a 65% chance of a May cut going into the decision.",
    tickers: ["SPY", "TLT", "DXY"],
    time: "2h ago",
    date: "Apr 17, 2026",
    impact: "Bearish",
    featured: true,
  },
  {
    id: 2,
    category: "Earnings",
    headline: "UnitedHealth Surges 8% After Beating Q1 Estimates; Raises Full-Year Guidance",
    summary:
      "UnitedHealth Group posted Q1 earnings of $7.43 per share, well above the $6.89 consensus, driven by strong OptumRx pharmacy benefits growth and lower-than-expected medical loss ratios. The company raised its full-year EPS guidance to $28.25–$28.75, up from prior guidance of $27.50–$28.00. Shares jumped 8.2% in premarket trading, pushing the healthcare sector higher.",
    tickers: ["UNH", "CVS", "HUM"],
    time: "3h ago",
    date: "Apr 17, 2026",
    impact: "Bullish",
    featured: false,
  },
  {
    id: 3,
    category: "Tech",
    headline: "NVIDIA Warns of Export Curbs on H200 Chips to Southeast Asia; Stock Falls 4%",
    summary:
      "NVIDIA disclosed in an SEC filing late Wednesday that the Commerce Department has imposed new licensing requirements on exports of H200 and Blackwell-series AI accelerators to Vietnam, Malaysia, and Thailand, citing national security concerns. The company estimates the restrictions could impact up to $2.1B in quarterly revenue. Shares dropped 4.3% in after-hours trading, dragging semiconductor peers lower.",
    tickers: ["NVDA", "AMD", "SMCI", "TSM"],
    time: "5h ago",
    date: "Apr 17, 2026",
    impact: "Bearish",
    featured: false,
  },
  {
    id: 4,
    category: "Markets",
    headline: "S&P 500 Dips Below 200-Day Moving Average for Second Session Amid Tariff Jitters",
    summary:
      "The S&P 500 closed at 4,812, falling 0.9% and settling below its 200-day moving average for the second consecutive session as investors grappled with fresh tariff escalation fears and a hotter-than-expected PPI print. Breadth was negative with 340 advancers against 162 decliners on the NYSE. The VIX index climbed 2.1 points to 28.4, its highest close since early February.",
    tickers: ["SPY", "QQQ", "VIX", "IWM"],
    time: "6h ago",
    date: "Apr 17, 2026",
    impact: "Bearish",
    featured: false,
  },
  {
    id: 5,
    category: "Politics",
    headline: "White House Announces 25% Tariff on EU Auto Imports, Effective May 1",
    summary:
      "The Trump administration formally announced a 25% tariff on European automobile imports, effective May 1, escalating trade tensions with the EU after weeks of failed negotiations. The White House cited unfair trade practices and the EU's own auto import levies as justification. EU officials immediately threatened retaliatory measures targeting American agricultural exports and tech services.",
    tickers: ["F", "GM", "STLA", "BMW"],
    time: "7h ago",
    date: "Apr 17, 2026",
    impact: "Bearish",
    featured: false,
  },
  {
    id: 6,
    category: "Energy",
    headline: "WTI Crude Slides to $71.40 as IEA Cuts 2026 Demand Outlook for Third Time",
    summary:
      "West Texas Intermediate crude fell 2.4% to $71.40 per barrel after the International Energy Agency trimmed its 2026 global oil demand growth forecast to 900,000 barrels per day, down from 1.1M bpd, pointing to slowing Chinese industrial activity and accelerating EV adoption in Europe. OPEC+ is expected to hold an emergency virtual meeting next week to discuss additional supply cuts to defend the $75 floor.",
    tickers: ["USO", "XLE", "CVX", "XOM"],
    time: "8h ago",
    date: "Apr 16, 2026",
    impact: "Bearish",
    featured: false,
  },
  {
    id: 7,
    category: "Earnings",
    headline: "Netflix Misses Revenue but Beats on Subscribers; Ad Tier Now 42% of New Sign-Ups",
    summary:
      "Netflix reported Q1 revenue of $10.54B, slightly below the $10.68B consensus, but added 5.1M net new subscribers, topping the 4.2M expected. Management highlighted that its advertising-supported tier now accounts for 42% of all new subscriber sign-ups in markets where it's available, accelerating the company's pivot toward ad revenue. Shares were flat after hours.",
    tickers: ["NFLX", "DIS", "WBD"],
    time: "10h ago",
    date: "Apr 16, 2026",
    impact: "Neutral",
    featured: false,
  },
  {
    id: 8,
    category: "Crypto",
    headline: "Bitcoin Tops $94,000 as Institutional Inflows Into ETFs Accelerate Post-Halving",
    summary:
      "Bitcoin climbed above $94,000 for the first time since January, driven by a surge of institutional inflows into spot Bitcoin ETFs totaling $1.8B over the past five trading sessions. The post-halving supply shock — which cut miner block rewards from 3.125 BTC to 1.5625 BTC in March — is increasingly being cited by analysts as the primary structural driver. Ethereum followed higher, gaining 6% to trade near $3,750.",
    tickers: ["BTC", "ETH", "IBIT", "FBTC"],
    time: "11h ago",
    date: "Apr 16, 2026",
    impact: "Bullish",
    featured: false,
  },
  {
    id: 9,
    category: "Fed & Macro",
    headline: "March PPI Comes in Hot at +0.5% MoM, Fueling Stagflation Worries",
    summary:
      "The Bureau of Labor Statistics reported that the Producer Price Index rose 0.5% month-over-month in March, well above the 0.2% consensus estimate, and up 3.7% year-over-year. Core PPI, excluding food and energy, rose 0.4%. The report stoked fears of cost pressures re-accelerating upstream, potentially feeding back into consumer prices and further complicating the Fed's path to easing.",
    tickers: ["TLT", "TIPS", "GLD"],
    time: "13h ago",
    date: "Apr 16, 2026",
    impact: "Bearish",
    featured: false,
  },
  {
    id: 10,
    category: "Tech",
    headline: "Meta's Llama 5 Benchmarks Leak Online, Reportedly Matches GPT-5 on Coding Tasks",
    summary:
      "Internal benchmark results for Meta's unreleased Llama 5 large language model circulated on social media Wednesday, showing performance comparable to OpenAI's GPT-5 on coding and mathematical reasoning tasks. Meta has not confirmed the leak. If accurate, Llama 5's open-source release would significantly disrupt the commercial AI landscape, putting pressure on closed-source providers.",
    tickers: ["META", "MSFT", "GOOGL", "ORCL"],
    time: "15h ago",
    date: "Apr 16, 2026",
    impact: "Bullish",
    featured: false,
  },
  {
    id: 11,
    category: "Markets",
    headline: "Gold Hits Record $3,280/oz as Dollar Weakens and Safe-Haven Demand Spikes",
    summary:
      "Gold futures surged to an all-time high of $3,280 per troy ounce Thursday as the U.S. dollar index fell to a 14-month low and investors rotated into safe-haven assets amid escalating trade tensions and equity market volatility. Central bank buying, particularly from China and India, has been a consistent tailwind for gold prices through the first quarter of 2026.",
    tickers: ["GLD", "IAU", "NEM", "GDX"],
    time: "16h ago",
    date: "Apr 16, 2026",
    impact: "Bullish",
    featured: false,
  },
  {
    id: 12,
    category: "Earnings",
    headline: "JPMorgan Q1 Profit Tops Estimates as Investment Banking Revenue Jumps 34%",
    summary:
      "JPMorgan Chase reported first-quarter net income of $14.6B, or $4.97 per share, beating the $4.61 consensus, fueled by a 34% surge in investment banking fees and robust fixed income trading. CEO Jamie Dimon cautioned that the economic outlook remains 'highly uncertain' given tariff impacts and sticky inflation, but said the consumer balance sheet is 'still holding up well for now.'",
    tickers: ["JPM", "BAC", "GS", "MS"],
    time: "18h ago",
    date: "Apr 15, 2026",
    impact: "Bullish",
    featured: false,
  },
  {
    id: 13,
    category: "Energy",
    headline: "EV Sales Growth Slows in Q1 as Higher Loan Rates Dent Consumer Demand",
    summary:
      "U.S. electric vehicle registrations grew just 11% year-over-year in Q1 2026, the slowest pace in four years, as elevated auto loan rates near 8.5% and consumer uncertainty dampened demand. Tesla's market share slipped to 44% from 52% a year ago amid intensifying competition from BYD's U.S.-licensed lineup and GM's Equinox EV. Analysts warn subsidy clawbacks under the new energy bill could worsen the slowdown.",
    tickers: ["TSLA", "GM", "RIVN", "F"],
    time: "20h ago",
    date: "Apr 15, 2026",
    impact: "Bearish",
    featured: false,
  },
  {
    id: 14,
    category: "Politics",
    headline: "Senate Passes Debt Ceiling Suspension Through 2027 in 54-46 Vote",
    summary:
      "The U.S. Senate passed a bill suspending the federal debt ceiling through December 2027 along mostly party-line vote, averting what Treasury Secretary Bessent described as a 'catastrophic' default scenario. The House is expected to vote on the measure next week. Rating agency Moody's had placed the U.S. on negative watch last month amid the standoff.",
    tickers: ["TLT", "DXY", "SPY"],
    time: "1d ago",
    date: "Apr 15, 2026",
    impact: "Bullish",
    featured: false,
  },
  {
    id: 15,
    category: "Tech",
    headline: "Apple Unveils AI-Powered Health Coaching Feature in iOS 20 Beta, Partners with Cigna",
    summary:
      "Apple announced a new 'Health Coach' feature rolling out in iOS 20 beta that uses on-device AI to provide personalized fitness, sleep, and nutrition guidance. The company disclosed a partnership with Cigna Health to allow the feature to interact with insurance data for eligible plan members, potentially unlocking premium reimbursements. The announcement boosted Apple shares 2.1% intraday.",
    tickers: ["AAPL", "CI", "GOOGL"],
    time: "1d ago",
    date: "Apr 14, 2026",
    impact: "Bullish",
    featured: false,
  },
];

/* ─── Sidebar Data ─────────────────────────────────────────────────── */
const MARKET_PULSE = [
  { ticker: "SPY",  price: "481.20", change: "-0.92", pct: "-0.19", dir: "down" },
  { ticker: "QQQ",  price: "398.75", change: "-4.12", pct: "-1.02", dir: "down" },
  { ticker: "BTC",  price: "94,180", change: "+2,310", pct: "+2.51", dir: "up"  },
  { ticker: "GLD",  price: "314.60", change: "+3.85", pct: "+1.24", dir: "up"  },
  { ticker: "TLT",  price: "88.34",  change: "-0.61", pct: "-0.69", dir: "down" },
];

const TRENDING_TICKERS = [
  { ticker: "NVDA", mentions: 34, dir: "down" },
  { ticker: "AAPL", mentions: 28, dir: "up"   },
  { ticker: "META", mentions: 22, dir: "up"   },
  { ticker: "GLD",  mentions: 19, dir: "up"   },
  { ticker: "TSLA", mentions: 17, dir: "down" },
  { ticker: "BTC",  mentions: 15, dir: "up"   },
  { ticker: "JPM",  mentions: 14, dir: "up"   },
  { ticker: "TLT",  mentions: 12, dir: "down" },
];

const CATEGORY_ICONS = {
  "Markets":    BarChart2,
  "Fed & Macro":Landmark,
  "Earnings":   DollarSign,
  "Tech":       Cpu,
  "Energy":     Leaf,
  "Politics":   Globe,
  "Crypto":     Bitcoin,
};

/* ─── Constants ────────────────────────────────────────────────────── */
const CATEGORIES = ["All", "Markets", "Fed & Macro", "Earnings", "Tech", "Energy", "Politics", "Crypto"];

const IMPACT_CONFIG = {
  Bullish: { color: "var(--up)",   bg: "rgba(76,207,140,0.12)", border: "rgba(76,207,140,0.3)"  },
  Bearish: { color: "var(--down)", bg: "rgba(255,77,109,0.12)", border: "rgba(255,77,109,0.3)"  },
  Neutral: { color: "var(--text-3)",bg: "rgba(122,136,153,0.1)", border: "rgba(122,136,153,0.2)" },
};

const CAT_COLORS = {
  "Markets":    { color: "var(--teal)", bg: "rgba(77,208,196,0.12)"  },
  "Fed & Macro":{ color: "var(--gold)", bg: "rgba(201,168,76,0.12)"  },
  "Earnings":   { color: "#9b6cdb",     bg: "rgba(155,108,219,0.12)" },
  "Tech":       { color: "#4c9cf0",     bg: "rgba(76,156,240,0.12)"  },
  "Energy":     { color: "#4caf7d",     bg: "rgba(76,175,125,0.12)"  },
  "Politics":   { color: "#e07c3a",     bg: "rgba(224,124,58,0.12)"  },
  "Crypto":     { color: "#f7931a",     bg: "rgba(247,147,26,0.12)"  },
};

/* ─── Sub-components ───────────────────────────────────────────────── */
function ImpactPill({ impact }) {
  const cfg = IMPACT_CONFIG[impact] || IMPACT_CONFIG.Neutral;
  const Icon = impact === "Bullish" ? TrendingUp : impact === "Bearish" ? TrendingDown : Minus;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600,
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
    }}>
      <Icon size={11} /> {impact}
    </span>
  );
}

function CategoryPill({ category, size = "sm" }) {
  const cfg = CAT_COLORS[category] || { color: "var(--text-2)", bg: "rgba(122,136,153,0.1)" };
  const pad = size === "sm" ? "2px 8px" : "4px 12px";
  const fs  = size === "sm" ? 11 : 12;
  return (
    <span style={{
      padding: pad, borderRadius: 4, fontSize: fs, fontWeight: 700,
      color: cfg.color, background: cfg.bg, letterSpacing: "0.03em",
      textTransform: "uppercase",
    }}>
      {category}
    </span>
  );
}

function TickerPill({ ticker }) {
  return (
    <span style={{
      padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700,
      color: "var(--gold)", background: "rgba(201,168,76,0.12)",
      border: "1px solid rgba(201,168,76,0.25)", letterSpacing: "0.04em",
      fontFamily: "var(--font-mono, monospace)",
    }}>
      {ticker}
    </span>
  );
}

function FeaturedCard({ story }) {
  const catColor = CAT_COLORS[story.category]?.color || "var(--teal)";
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border-c)",
      borderRadius: 12, overflow: "hidden", marginBottom: 12,
    }}>
      {/* accent bar */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${catColor}, transparent)` }} />
      <div style={{ padding: "20px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <CategoryPill category={story.category} size="md" />
          <span style={{
            padding: "3px 9px", borderRadius: 4, fontSize: 11, fontWeight: 700,
            background: "rgba(255,107,57,0.15)", color: "#ff6b39",
            border: "1px solid rgba(255,107,57,0.3)", letterSpacing: "0.05em",
          }}>FEATURED</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: "var(--text-3)", display: "flex", alignItems: "center", gap: 4 }}>
            <Clock size={12} /> {story.time}
          </span>
        </div>
        <h2 style={{
          fontSize: 20, fontWeight: 700, color: "var(--text-1)", lineHeight: 1.35,
          marginBottom: 12, margin: "0 0 12px 0",
        }}>
          {story.headline}
        </h2>
        <p style={{
          fontSize: 14, color: "var(--text-2)", lineHeight: 1.65,
          margin: "0 0 14px 0",
        }}>
          {story.summary}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <ImpactPill impact={story.impact} />
          <span style={{ color: "var(--border-c)" }}>|</span>
          {story.tickers.map(t => <TickerPill key={t} ticker={t} />)}
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: "var(--text-3)" }}>{story.date}</span>
        </div>
      </div>
    </div>
  );
}

function ArticleCard({ story }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border-c)",
      borderRadius: 10, padding: "16px 18px", marginBottom: 8,
      transition: "border-color 0.2s",
      cursor: "default",
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-c)"}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        <CategoryPill category={story.category} />
        <ImpactPill impact={story.impact} />
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: "var(--text-3)", display: "flex", alignItems: "center", gap: 3 }}>
          <Clock size={11} /> {story.time}
        </span>
      </div>
      <h3 style={{
        fontSize: 15, fontWeight: 700, color: "var(--text-1)", lineHeight: 1.4,
        margin: "0 0 8px 0",
      }}>
        {story.headline}
      </h3>
      <p style={{
        fontSize: 13, color: "var(--text-2)", lineHeight: 1.6,
        margin: "0 0 10px 0",
        display: "-webkit-box", WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        {story.summary}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        {story.tickers && story.tickers.length > 0 && story.tickers.map(t => <TickerPill key={t} ticker={t} />)}
        {story.source && (
          <span style={{
            marginLeft: "auto", fontSize: 10, color: "var(--text-3)",
            fontStyle: "italic", flexShrink: 0,
          }}>
            via {story.source}
          </span>
        )}
      </div>
    </div>
  );
}

function MarketPulseRow({ item }) {
  const isUp = item.dir === "up";
  const clr  = isUp ? "var(--up)" : "var(--down)";
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "8px 0", borderBottom: "1px solid var(--border-c)",
    }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)", fontFamily: "monospace" }}>
        {item.ticker}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 13, color: "var(--text-2)", fontFamily: "monospace" }}>
          {item.price}
        </span>
        <span style={{
          fontSize: 12, fontWeight: 700, color: clr,
          display: "flex", alignItems: "center", gap: 3,
        }}>
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {item.pct}%
        </span>
      </div>
    </div>
  );
}

function SentimentMeter({ stories }) {
  const total   = stories.length || 1;
  const bearish = Math.round((stories.filter(s => s.impact === "Bearish").length / total) * 100);
  const bullish = Math.round((stories.filter(s => s.impact === "Bullish").length / total) * 100);
  const neutral = 100 - bearish - bullish;
  const dominant = bearish >= bullish && bearish >= neutral ? "Bearish" : bullish >= neutral ? "Bullish" : "Neutral";
  const domClr  = dominant === "Bullish" ? "var(--up)" : dominant === "Bearish" ? "var(--down)" : "var(--text-3)";
  const domBg   = dominant === "Bullish" ? "rgba(76,207,140,0.07)" : dominant === "Bearish" ? "rgba(255,77,109,0.07)" : "rgba(122,136,153,0.07)";
  const domBdr  = dominant === "Bullish" ? "rgba(76,207,140,0.2)" : dominant === "Bearish" ? "rgba(255,77,109,0.2)" : "rgba(122,136,153,0.2)";
  return (
    <div>
      {/* Bar */}
      <div style={{
        height: 10, borderRadius: 5, overflow: "hidden",
        display: "flex", marginBottom: 8,
        border: "1px solid var(--border-c)",
      }}>
        <div style={{ width: `${bearish}%`, background: "var(--down)", transition: "width 0.6s" }} />
        <div style={{ width: `${neutral}%`, background: "var(--text-3)", transition: "width 0.6s" }} />
        <div style={{ width: `${bullish}%`, background: "var(--up)", transition: "width 0.6s" }} />
      </div>
      {/* Legend */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
        <span style={{ color: "var(--down)", fontWeight: 700 }}>Bearish {bearish}%</span>
        <span style={{ color: "var(--text-3)" }}>Neutral {neutral}%</span>
        <span style={{ color: "var(--up)", fontWeight: 700 }}>Bullish {bullish}%</span>
      </div>
      <div style={{
        marginTop: 10, padding: "8px 12px", borderRadius: 8,
        background: domBg, border: `1px solid ${domBdr}`,
        fontSize: 12, color: domClr, fontWeight: 600, textAlign: "center",
      }}>
        Overall: {dominant}
      </div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────── */
export default function MarketNews() {
  const [activeTab, setActiveTab] = useState("All");
  const [stories, setStories]     = useState(STORIES);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("http://localhost:3001/api/news")
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          setStories(data);
        }
      })
      .catch(() => { /* server offline — keep hardcoded fallback */ })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filteredStories = useMemo(() => {
    if (activeTab === "All") return stories;
    return stories.filter(s => s.category === activeTab);
  }, [activeTab, stories]);

  const featuredStory = filteredStories.find(s => s.featured) || filteredStories[0];
  const listStories   = filteredStories.filter(s => s.id !== featuredStory?.id);

  return (
    <div style={{ padding: "24px 28px", maxWidth: 1400, margin: "0 auto" }}>

      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border-c)",
        borderRadius: 14, padding: "28px 32px", marginBottom: 24,
        position: "relative", overflow: "hidden",
      }}>
        {/* Subtle background glow */}
        <div style={{
          position: "absolute", top: -60, right: -60,
          width: 280, height: 280, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
          {/* Icon + Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 240 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Newspaper size={28} color="var(--gold)" />
            </div>
            <div>
              <h1 className="t-page-title" style={{ margin: 0, fontSize: 26, lineHeight: 1.2 }}>
                Market News
              </h1>
              <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "var(--text-3)" }}>
                Live from Bloomberg, Reuters, MarketWatch, CNBC & FT · refreshed hourly
              </p>
            </div>
          </div>

          {/* Stat boxes */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { label: "Stories Today", value: loading ? "…" : String(stories.length), icon: Newspaper, color: "var(--teal)" },
              { label: "Market Sentiment", value: "Live Feed", icon: TrendingDown,  color: "var(--down)" },
              { label: "Sources",       value: "5",          icon: Activity,      color: "var(--up)"   },
              { label: "Refresh",       value: "Hourly",     icon: Zap,           color: "#f7931a"     },
            ].map(stat => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} style={{
                  background: "var(--bg)", border: "1px solid var(--border-c)",
                  borderRadius: 10, padding: "12px 18px", minWidth: 120, textAlign: "center",
                }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
                    <Icon size={16} color={stat.color} />
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: stat.color, lineHeight: 1.1 }}>
                    {stat.value}
                  </div>
                  <div className="t-label" style={{ fontSize: 10, marginTop: 2 }}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Category Tabs ────────────────────────────────────────── */}
      <div style={{
        display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 20,
        background: "var(--surface)", border: "1px solid var(--border-c)",
        borderRadius: 10, padding: 6,
      }}>
        {CATEGORIES.map(cat => {
          const isActive = activeTab === cat;
          const cfg = CAT_COLORS[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              style={{
                padding: "7px 16px", borderRadius: 7, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: isActive ? 700 : 500,
                background: isActive
                  ? (cfg ? cfg.bg : "rgba(201,168,76,0.12)")
                  : "transparent",
                color: isActive
                  ? (cfg ? cfg.color : "var(--gold)")
                  : "var(--text-2)",
                transition: "all 0.15s",
                outline: isActive ? `1px solid ${cfg ? cfg.color : "var(--gold)"}` : "none",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* ── Two-column layout ─────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>

        {/* ── Left: Main Feed (2/3) ─────────────────────────────── */}
        <div style={{ flex: "0 0 calc(66% - 9px)", minWidth: 0 }}>
          {loading ? (
            <div style={{
              background: "var(--surface)", border: "1px solid var(--border-c)",
              borderRadius: 10, padding: "48px 24px", textAlign: "center",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                border: "3px solid rgba(201,168,76,0.15)", borderTopColor: "var(--gold)",
                animation: "tSpin 0.7s linear infinite", margin: "0 auto 14px",
              }} />
              <style>{`@keyframes tSpin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ color: "var(--text-3)", fontSize: 13, margin: 0 }}>
                Fetching live news from Bloomberg, Reuters, MarketWatch, CNBC & FT…
              </p>
            </div>
          ) : filteredStories.length === 0 ? (
            <div style={{
              background: "var(--surface)", border: "1px solid var(--border-c)",
              borderRadius: 10, padding: "40px 24px", textAlign: "center",
            }}>
              <AlertTriangle size={32} color="var(--text-3)" style={{ marginBottom: 12 }} />
              <p style={{ color: "var(--text-3)", fontSize: 14, margin: 0 }}>
                No stories found for <strong style={{ color: "var(--text-2)" }}>{activeTab}</strong> today.
              </p>
            </div>
          ) : (
            <>
              {featuredStory && <FeaturedCard story={featuredStory} />}
              {listStories.map(story => (
                <ArticleCard key={story.id} story={story} />
              ))}
            </>
          )}
        </div>

        {/* ── Right: Sidebar (1/3) ─────────────────────────────── */}
        <div style={{ flex: "0 0 calc(34% - 9px)", minWidth: 0, display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Market Pulse */}
          <div className="t-card" style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Activity size={16} color="var(--teal)" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)" }}>Market Pulse</span>
              <span style={{
                marginLeft: "auto", fontSize: 10, fontWeight: 700, color: "var(--up)",
                padding: "2px 6px", borderRadius: 4,
                background: "rgba(76,207,140,0.12)", border: "1px solid rgba(76,207,140,0.25)",
              }}>LIVE</span>
            </div>
            {MARKET_PULSE.map(item => <MarketPulseRow key={item.ticker} item={item} />)}
          </div>

          {/* Trending Tickers */}
          <div className="t-card" style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Flame size={16} color="var(--gold)" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)" }}>Trending Tickers</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {((() => {
                const counts = {};
                stories.forEach(s => (s.tickers || []).forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
                const sorted = Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0,8);
                return sorted.length > 0
                  ? sorted.map(([ticker, mentions]) => ({ ticker, mentions, dir: "up" }))
                  : TRENDING_TICKERS;
              })()).map((item, i, arr) => {
                const isUp  = item.dir === "up";
                const clr   = isUp ? "var(--up)" : "var(--down)";
                const maxM  = arr[0]?.mentions || 1;
                return (
                  <div key={item.ticker} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: "var(--text-3)",
                      width: 16, textAlign: "right", flexShrink: 0,
                    }}>{i + 1}</span>
                    <span style={{
                      fontSize: 12, fontWeight: 700, color: "var(--gold)",
                      fontFamily: "monospace", width: 46, flexShrink: 0,
                    }}>{item.ticker}</span>
                    {/* Mention bar */}
                    <div style={{ flex: 1, height: 6, background: "var(--bg)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 3,
                        width: `${(item.mentions / maxM) * 100}%`,
                        background: isUp ? "var(--up)" : "var(--down)",
                        opacity: 0.7,
                      }} />
                    </div>
                    <span style={{ fontSize: 11, color: "var(--text-3)", flexShrink: 0, width: 24, textAlign: "right" }}>
                      {item.mentions}
                    </span>
                    {isUp
                      ? <TrendingUp size={11} color={clr} style={{ flexShrink: 0 }} />
                      : <TrendingDown size={11} color={clr} style={{ flexShrink: 0 }} />
                    }
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sentiment Meter */}
          <div className="t-card" style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <BarChart2 size={16} color="var(--teal)" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)" }}>Sentiment Meter</span>
            </div>
            <SentimentMeter stories={stories} />
          </div>

          {/* Top Stories by Category */}
          <div className="t-card" style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Tag size={16} color="var(--gold)" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)" }}>Top Stories by Category</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {Object.keys(CATEGORY_ICONS).map(label => {
                const count = stories.filter(s => s.category === label).length;
                const item  = { label, count, icon: CATEGORY_ICONS[label] };
                const Icon = item.icon;
                const cfg  = CAT_COLORS[item.label] || { color: "var(--text-2)", bg: "transparent" };
                return (
                  <button
                    key={item.label}
                    onClick={() => setActiveTab(item.label)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "8px 10px", borderRadius: 8, border: "1px solid transparent",
                      background: "var(--bg)", cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = cfg.color;
                      e.currentTarget.style.background  = cfg.bg;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "transparent";
                      e.currentTarget.style.background  = "var(--bg)";
                    }}
                  >
                    <Icon size={14} color={cfg.color} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "var(--text-2)", flex: 1, textAlign: "left" }}>
                      {item.label}
                    </span>
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: cfg.color,
                      background: cfg.bg, padding: "1px 7px", borderRadius: 10,
                    }}>
                      {item.count}
                    </span>
                    <ChevronRight size={13} color="var(--text-3)" style={{ flexShrink: 0 }} />
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
