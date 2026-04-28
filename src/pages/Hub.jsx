import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, CalendarDays, BarChart2, Sparkles, Settings, Brain,
  LayoutDashboard, MonitorDot, History, PieChart, SlidersHorizontal,
  Coins, Newspaper, Zap, Users, ShoppingCart, Home, ShieldAlert, Star,
  Eye, Landmark, Wallet, LineChart, Calculator, GraduationCap,
  HeartPulse, BookUser, BookOpen, Target, Receipt, ShieldCheck,
  ChevronDown, ChevronRight, HelpCircle,
} from 'lucide-react';

/* ─── Section definitions ─────────────────────────────────────────── */
const SECTIONS = [
  {
    id: 'markets',
    label: 'Markets',
    icon: TrendingUp,
    color: '#00b899',
    colorRgb: '0,184,153',
    description: 'Live dashboards, real-time price data, sector heatmaps, top movers, crypto, and global market news.',
    items: [
      { label: 'Dashboard',       path: '/dashboard',        icon: LayoutDashboard,   tip: 'Live market overview with indices, movers, and summary stats.' },
      { label: 'Terminal',        path: '/terminal',         icon: MonitorDot,        tip: 'Full-featured trading terminal with charting and depth data.' },
      { label: 'Market History',  path: '/MarketHistory',    icon: History,           tip: 'Long-term historical returns, drawdowns, and cycle analysis.' },
      { label: 'Sectors',         path: '/sectors',          icon: PieChart,          tip: 'S&P 500 sector breakdown, heat maps, and relative performance.' },
      { label: 'Top Performers',  path: '/top-performers',   icon: TrendingUp,        tip: 'Daily and weekly top-gaining and top-losing stocks.' },
      { label: 'Stock Screener',  path: '/stock-screener',   icon: SlidersHorizontal, tip: 'Filter stocks by fundamentals, technicals, and sector.' },
      { label: 'Crypto Markets',  path: '/crypto',           icon: Coins,             tip: 'Cryptocurrency prices, market cap rankings, and trends.' },
      { label: 'Market News',     path: '/market-news',      icon: Newspaper,         tip: 'Real-time financial headlines from major news sources.' },
    ],
  },
  {
    id: 'macro',
    label: 'Macro',
    icon: CalendarDays,
    color: '#c9a84c',
    colorRgb: '224,217,204',
    description: 'Economic indicators, Fed watch, labor trends, energy markets, consumer spending, and real estate data.',
    items: [
      { label: 'Economic Calendar', path: '/economic-calendar', icon: CalendarDays, tip: 'Upcoming economic events, earnings dates, and Fed meetings.' },
      { label: 'Energy Markets',    path: '/energy',            icon: Zap,          tip: 'Oil, gas, and energy commodity prices and supply data.' },
      { label: 'Labor Markets',     path: '/labor',             icon: Users,        tip: 'Jobs reports, unemployment, wage growth, and participation rates.' },
      { label: 'The Consumer',      path: '/consumer',          icon: ShoppingCart, tip: 'Consumer confidence, spending, retail sales, and sentiment.' },
      { label: 'Real Estate',       path: '/real-estate',       icon: Home,         tip: 'Housing market trends, mortgage rates, and inventory data.' },
    ],
  },
  {
    id: 'analysis',
    label: 'Analysis',
    icon: BarChart2,
    color: '#4c9cf0',
    colorRgb: '76,156,240',
    description: 'Risk tools, watchlist management, market breadth, political intelligence, and insider trading filings.',
    items: [
      { label: 'Risk Analysis',          path: '/RiskAnalysis',    icon: ShieldAlert, tip: 'Portfolio risk models, stress tests, and allocation analysis.' },
      { label: 'Watchlist',              path: '/watchlist',       icon: Star,        tip: 'Track your favorite stocks and get price movement alerts.' },
      { label: 'Market Breadth',         path: '/market-breadth',  icon: BarChart2,   tip: 'Advance-decline ratios, new highs/lows, and breadth indicators.' },
      { label: 'Political Intelligence', path: '/PoliticsEconomy', icon: Landmark,    tip: 'How policy, elections, and geopolitics move markets.' },
      { label: 'Insider Trading',        path: '/insider-trading', icon: Eye,         tip: 'SEC Form 4 filings tracking executive buys and sells.' },
    ],
  },
  {
    id: 'wealth',
    label: 'Wealth',
    icon: Wallet,
    color: '#9b6cdb',
    colorRgb: '155,108,219',
    description: 'Personal finance tools — budget planner, net worth tracker, future planning, tax strategy, and more.',
    items: [
      { label: 'Budget Planner',    path: '/BudgetPlanner',   icon: Wallet,       tip: 'Build a detailed monthly budget and track income vs. spending.' },
      { label: 'Net Worth Tracker', path: '/net-worth',       icon: Target,       tip: 'Add assets and liabilities to see your true net worth over time.' },
      { label: 'Future Planning',   path: '/FuturePlanning',  icon: LineChart,    tip: 'Retirement projections, savings goals, and long-term planning.' },
      { label: 'Tax Planning',      path: '/tax-planning',    icon: Receipt,      tip: 'Tax bracket analysis, deduction strategies, and Roth vs. trad.' },
      { label: 'Life Insurance',    path: '/life-insurance',  icon: HeartPulse,   tip: 'Coverage calculators and term vs. permanent insurance guides.' },
      { label: 'Social Security',   path: '/social-security', icon: ShieldCheck,  tip: 'Benefit estimator and optimal claiming strategy analysis.' },
      { label: 'Calculators',       path: '/Calculators',     icon: Calculator,   tip: 'Compound interest, mortgage, loan, and retirement calculators.' },
      { label: 'Education',         path: '/education',       icon: GraduationCap,tip: 'Structured courses on investing, markets, and personal finance.' },
      { label: 'Wealth Counsel',    path: '/WealthCounsel',   icon: BookUser,     tip: 'Connect with vetted financial advisors for personalized guidance.' },
      { label: 'Brokerage Guide',   path: '/brokerage-guide', icon: BookOpen,     tip: 'Compare brokerages and find the right account type for you.' },
    ],
  },
  {
    id: 'ai',
    label: 'AI',
    icon: Sparkles,
    color: '#c084fc',
    colorRgb: '192,132,252',
    description: 'AI-powered financial analysis — personalized breakdown reports and intelligent wealth advisory tools.',
    items: [
      { label: 'Planora AI',        path: '/planora-ai',   icon: Brain,    tip: 'Conversational AI financial assistant for questions and guidance.' },
      { label: 'Breakdown Reports', path: '/AIAdvisor',    icon: Sparkles, tip: 'Generate personalized financial reports across 5 report types.' },
      { label: 'Wealth Counsel',    path: '/WealthCounsel',icon: BookUser, tip: 'AI-matched advisor recommendations and wealth planning tools.' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    color: '#8a96a8',
    colorRgb: '138,150,168',
    description: 'Manage your account preferences, customize the terminal display, and configure your workspace.',
    items: [
      { label: 'Settings', path: '/Settings', icon: Settings, tip: 'Theme, display preferences, and account configuration.' },
    ],
  },
];

/* ─── Decorative SVG backgrounds ─────────────────────────────────── */
function DecoMarkets() {
  return (
    <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="mkt-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="currentColor" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* Grid lines */}
      <line x1="0" y1="45"  x2="280" y2="45"  stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.5"/>
      <line x1="0" y1="90"  x2="280" y2="90"  stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.5"/>
      <line x1="0" y1="135" x2="280" y2="135" stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.5"/>
      <line x1="56"  y1="0" x2="56"  y2="180" stroke="currentColor" strokeOpacity="0.12" strokeWidth="0.5"/>
      <line x1="112" y1="0" x2="112" y2="180" stroke="currentColor" strokeOpacity="0.12" strokeWidth="0.5"/>
      <line x1="168" y1="0" x2="168" y2="180" stroke="currentColor" strokeOpacity="0.12" strokeWidth="0.5"/>
      <line x1="224" y1="0" x2="224" y2="180" stroke="currentColor" strokeOpacity="0.12" strokeWidth="0.5"/>
      {/* Area fill */}
      <path
        d="M0,155 C15,155 22,130 40,120 C58,110 62,135 82,95 C102,55 108,100 132,58 C156,16 162,70 188,38 C210,10 228,48 280,42 L280,180 L0,180 Z"
        fill="url(#mkt-fill)"
      />
      {/* Price line */}
      <path
        d="M0,155 C15,155 22,130 40,120 C58,110 62,135 82,95 C102,55 108,100 132,58 C156,16 162,70 188,38 C210,10 228,48 280,42"
        stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Candlestick hints */}
      <rect x="36" y="112" width="8" height="16" rx="1" fill="currentColor" fillOpacity="0.5"/>
      <line x1="40" y1="108" x2="40" y2="132" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1"/>
      <rect x="80" y="86" width="8" height="18" rx="1" fill="currentColor" fillOpacity="0.5"/>
      <line x1="84" y1="80" x2="84" y2="108" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1"/>
      <rect x="130" y="50" width="8" height="16" rx="1" fill="currentColor" fillOpacity="0.5"/>
      <line x1="134" y1="44" x2="134" y2="70" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1"/>
      <rect x="186" y="30" width="8" height="18" rx="1" fill="currentColor" fillOpacity="0.5"/>
      <line x1="190" y1="24" x2="190" y2="52" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1"/>
      {/* Highlight dot on last point */}
      <circle cx="280" cy="42" r="4" fill="currentColor" fillOpacity="0.9"/>
      <circle cx="280" cy="42" r="8" fill="currentColor" fillOpacity="0.15"/>
    </svg>
  );
}

function DecoMacro() {
  return (
    <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Globe sphere */}
      <circle cx="120" cy="100" r="80" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7"/>
      {/* Latitude arcs */}
      <ellipse cx="120" cy="68"  rx="67" ry="18" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.45"/>
      <ellipse cx="120" cy="100" rx="80" ry="22" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.45"/>
      <ellipse cx="120" cy="132" rx="67" ry="18" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.45"/>
      {/* Longitude arcs */}
      <path d="M120,20 Q158,100 120,180" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" fill="none"/>
      <path d="M120,20 Q82,100 120,180"  stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" fill="none"/>
      <line x1="120" y1="20" x2="120" y2="180" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4"/>
      <path d="M120,20 Q188,80 176,140"  stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.35" fill="none"/>
      <path d="M120,20 Q52,80 64,140"   stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.35" fill="none"/>
      {/* Continent blobs */}
      <path d="M100,62 L112,56 L128,59 L138,68 L135,82 L124,86 L108,82 L100,74 Z"
        fill="currentColor" fillOpacity="0.28" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.4"/>
      <path d="M88,95 L98,92 L104,100 L100,110 L90,108 Z"
        fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.35"/>
      <path d="M128,100 L140,97 L148,104 L145,114 L134,116 L126,110 Z"
        fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.35"/>
      {/* Glint */}
      <circle cx="88" cy="65" r="6" fill="currentColor" fillOpacity="0.12"/>
      <circle cx="88" cy="65" r="3" fill="currentColor" fillOpacity="0.2"/>
    </svg>
  );
}

function DecoAnalysis() {
  // Radar / spider chart
  const cx = 120, cy = 100, r = 72;
  const levels = [1, 0.66, 0.33];
  const axes = 6;
  const pts = (scale) =>
    Array.from({ length: axes }, (_, i) => {
      const a = (i * Math.PI * 2) / axes - Math.PI / 2;
      return [cx + Math.cos(a) * r * scale, cy + Math.sin(a) * r * scale];
    });

  const polyStr = (scale) => pts(scale).map(p => p.join(',')).join(' ');

  // Score shape - irregular to look realistic
  const scoreScales = [0.9, 0.65, 0.82, 0.55, 0.78, 0.88];
  const scorePts = scoreScales.map((s, i) => {
    const a = (i * Math.PI * 2) / axes - Math.PI / 2;
    return [cx + Math.cos(a) * r * s, cy + Math.sin(a) * r * s];
  });
  const scoreStr = scorePts.map(p => p.join(',')).join(' ');

  return (
    <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Grid hexagons */}
      {levels.map((s, i) => (
        <polygon key={i} points={polyStr(s)}
          stroke="currentColor" strokeWidth={i === 0 ? 1.5 : 0.75}
          strokeOpacity={i === 0 ? 0.6 : 0.3} fill="none"/>
      ))}
      {/* Spokes */}
      {pts(1).map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p[0]} y2={p[1]}
          stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.3"/>
      ))}
      {/* Score fill */}
      <polygon points={scoreStr}
        fill="currentColor" fillOpacity="0.14"
        stroke="currentColor" strokeWidth="2" strokeOpacity="0.7"
        strokeLinejoin="round"/>
      {/* Score dots */}
      {scorePts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="currentColor" fillOpacity="0.9"/>
      ))}
      {/* Center */}
      <circle cx={cx} cy={cy} r="4" fill="currentColor" fillOpacity="0.6"/>
    </svg>
  );
}

function DecoWealth() {
  const bars = [
    { x: 28,  h: 70,  o: 0.28 },
    { x: 62,  h: 95,  o: 0.35 },
    { x: 96,  h: 118, o: 0.42 },
    { x: 130, h: 105, o: 0.38 },
    { x: 164, h: 140, o: 0.5  },
    { x: 198, h: 125, o: 0.44 },
  ];
  const base = 165;

  return (
    <svg viewBox="0 0 260 190" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="wlth-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1"/>
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.4"/>
        </linearGradient>
      </defs>
      {/* Axis */}
      <line x1="16" y1="20"  x2="16"  y2={base} stroke="currentColor" strokeOpacity="0.25" strokeWidth="1"/>
      <line x1="16" y1={base} x2="244" y2={base} stroke="currentColor" strokeOpacity="0.25" strokeWidth="1"/>
      {/* Horizontal guides */}
      <line x1="16" y1="60"  x2="244" y2="60"  stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" strokeDasharray="4 4"/>
      <line x1="16" y1="100" x2="244" y2="100" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" strokeDasharray="4 4"/>
      {/* Bars */}
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={base - b.h} width="26" height={b.h} rx="4"
          fill="url(#wlth-bar)" fillOpacity={b.o}/>
      ))}
      {/* Trend line */}
      <path
        d="M41,152 C70,128 100,110 143,75 C175,48 212,40 224,36"
        stroke="currentColor" strokeWidth="2" fill="none"
        strokeLinecap="round" strokeDasharray="5 3" strokeOpacity="0.7"/>
      {/* Trend dots */}
      {[{x:41,y:152},{x:143,y:75},{x:224,y:36}].map((p,i)=>(
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="currentColor" fillOpacity="0.8"/>
      ))}
    </svg>
  );
}

function DecoAI() {
  const inputY  = [28, 62, 96, 130, 164];
  const hiddenY = [18, 50, 90, 130, 162];
  const outputY = [45, 92, 139];
  const x1 = 44, x2 = 138, x3 = 230;

  return (
    <svg viewBox="0 0 280 190" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Input → Hidden connections */}
      {inputY.map((iy, ii) =>
        hiddenY.map((hy, hi) => (
          <line key={`ih-${ii}-${hi}`} x1={x1} y1={iy} x2={x2} y2={hy}
            stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.18"/>
        ))
      )}
      {/* Hidden → Output connections */}
      {hiddenY.map((hy, hi) =>
        outputY.map((oy, oi) => (
          <line key={`ho-${hi}-${oi}`} x1={x2} y1={hy} x2={x3} y2={oy}
            stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.22"/>
        ))
      )}
      {/* Highlighted paths */}
      <line x1={x1} y1={96}  x2={x2} y2={90}  stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.55"/>
      <line x1={x2} y1={90}  x2={x3} y2={92}  stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.55"/>
      <line x1={x1} y1={62}  x2={x2} y2={50}  stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4"/>
      <line x1={x2} y1={50}  x2={x3} y2={45}  stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4"/>
      {/* Input nodes */}
      {inputY.map((y, i) => (
        <g key={`in-${i}`}>
          <circle cx={x1} cy={y} r="7" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5"/>
          <circle cx={x1} cy={y} r="3" fill="currentColor" fillOpacity="0.7"/>
        </g>
      ))}
      {/* Hidden nodes */}
      {hiddenY.map((y, i) => (
        <g key={`hn-${i}`}>
          <circle cx={x2} cy={y} r="8" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.55"/>
          <circle cx={x2} cy={y} r="3.5" fill="currentColor" fillOpacity="0.8"/>
        </g>
      ))}
      {/* Output nodes */}
      {outputY.map((y, i) => (
        <g key={`on-${i}`}>
          <circle cx={x3} cy={y} r="10" fill="currentColor" fillOpacity="0.16" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.65"/>
          <circle cx={x3} cy={y} r="4"  fill="currentColor" fillOpacity="0.9"/>
          <circle cx={x3} cy={y} r="14" fill="currentColor" fillOpacity="0.06"/>
        </g>
      ))}
    </svg>
  );
}

function DecoSettings() {
  return (
    <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Outer ring with gear teeth */}
      <circle cx="120" cy="100" r="78" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5"/>
      <circle cx="120" cy="100" r="68" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.25"/>
      {/* Gear teeth - 12 teeth */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI * 2) / 12;
        const r1 = 78, r2 = 90;
        const w = 0.18; // half-width in radians
        const x1 = 120 + Math.cos(a - w) * r1, y1 = 100 + Math.sin(a - w) * r1;
        const x2 = 120 + Math.cos(a - w) * r2, y2 = 100 + Math.sin(a - w) * r2;
        const x3 = 120 + Math.cos(a + w) * r2, y3 = 100 + Math.sin(a + w) * r2;
        const x4 = 120 + Math.cos(a + w) * r1, y4 = 100 + Math.sin(a + w) * r1;
        return (
          <path key={i} d={`M${x1},${y1} L${x2},${y2} L${x3},${y3} L${x4},${y4} Z`}
            fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.4"/>
        );
      })}
      {/* Middle ring */}
      <circle cx="120" cy="100" r="50" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4"/>
      <circle cx="120" cy="100" r="36" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.3"/>
      {/* Inner ring + crosshair */}
      <circle cx="120" cy="100" r="20" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.55"/>
      <circle cx="120" cy="100" r="8"  fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6"/>
      {/* Crosshair lines */}
      <line x1="120" y1="22" x2="120" y2="80"  stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.75"/>
      <line x1="120" y1="120" x2="120" y2="178" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.75"/>
      <line x1="42"  y1="100" x2="100" y2="100" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.75"/>
      <line x1="140" y1="100" x2="198" y2="100" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.75"/>
    </svg>
  );
}

const DECO_MAP = {
  markets:  DecoMarkets,
  macro:    DecoMacro,
  analysis: DecoAnalysis,
  wealth:   DecoWealth,
  ai:       DecoAI,
  settings: DecoSettings,
};

/* ─── Tooltip ─────────────────────────────────────────────────────── */
function Tooltip({ text, children }) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef(null);

  const show = () => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ top: r.top - 8, left: r.left + r.width / 2 });
    setVisible(true);
  };

  return (
    <span ref={ref} onMouseEnter={show} onMouseLeave={() => setVisible(false)}
      style={{ display: 'inline-flex', alignItems: 'center', cursor: 'default' }}>
      {children}
      {visible && (
        <div style={{
          position: 'fixed',
          top: pos.top,
          left: pos.left,
          transform: 'translate(-50%, -100%)',
          zIndex: 9999,
          background: '#1a1f2e',
          border: '1px solid rgba(201,168,76,0.2)',
          borderRadius: 8,
          padding: '0.5rem 0.75rem',
          maxWidth: 220,
          fontSize: '0.75rem',
          color: 'var(--text-2)',
          lineHeight: 1.55,
          pointerEvents: 'none',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          whiteSpace: 'normal',
          textAlign: 'center',
        }}>
          {text}
          <div style={{
            position: 'absolute', bottom: -5, left: '50%',
            transform: 'translateX(-50%)',
            width: 8, height: 8,
            background: '#1a1f2e',
            border: '1px solid rgba(201,168,76,0.2)',
            borderTop: 'none', borderLeft: 'none',
            rotate: '45deg',
          }}/>
        </div>
      )}
    </span>
  );
}

/* ─── Hub Card ────────────────────────────────────────────────────── */
function HubCard({ section, index }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const Icon = section.icon;
  const Deco = DECO_MAP[section.id];

  return (
    <div
      style={{
        position: 'relative',
        background: 'var(--surface)',
        border: `1px solid rgba(${section.colorRgb},0.2)`,
        borderRadius: 18,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 260,
        transition: 'border-color 0.2s, box-shadow 0.2s',
        animation: 'hubCardDrop 0.4s ease forwards',
        animationDelay: `${index * 0.07}s`,
        opacity: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `rgba(${section.colorRgb},0.42)`;
        e.currentTarget.style.boxShadow = `0 8px 32px rgba(${section.colorRgb},0.1), 0 2px 8px rgba(0,0,0,0.3)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = `rgba(${section.colorRgb},0.2)`;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Top accent bar */}
      <div style={{
        height: 3,
        background: `linear-gradient(90deg, ${section.color} 0%, rgba(${section.colorRgb},0.2) 70%, transparent 100%)`,
        flexShrink: 0,
      }}/>

      {/* Decorative SVG background */}
      <div style={{
        position: 'absolute',
        right: -16,
        bottom: 0,
        width: '68%',
        height: '90%',
        color: section.color,
        opacity: 0.13,
        pointerEvents: 'none',
        zIndex: 0,
      }}>
        <Deco />
      </div>

      {/* Left-to-right fade so text stays readable */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(to right, var(--surface) 38%, rgba(var(--surface-rgb, 18,22,34),0) 75%)`,
        zIndex: 1,
        pointerEvents: 'none',
      }}/>

      {/* Card content */}
      <div style={{ position: 'relative', zIndex: 2, padding: '1.75rem 1.75rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Icon + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
          <div style={{
            width: 44, height: 44,
            background: `rgba(${section.colorRgb},0.12)`,
            border: `1px solid rgba(${section.colorRgb},0.25)`,
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon size={20} color={section.color}/>
          </div>
          <h2 style={{
            margin: 0,
            fontSize: '1.125rem',
            fontWeight: 800,
            color: 'var(--text-1)',
            letterSpacing: '-0.02em',
          }}>
            {section.label}
          </h2>
        </div>

        {/* Description */}
        <p style={{
          margin: '0 0 1.5rem 0',
          fontSize: '0.875rem',
          color: 'var(--text-2)',
          lineHeight: 1.7,
          maxWidth: '62%',
        }}>
          {section.description}
        </p>

        {/* Explore button */}
        <div style={{ marginTop: 'auto' }}>
          <button
            onClick={() => setExpanded(x => !x)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.5625rem 1rem',
              background: `rgba(${section.colorRgb},0.1)`,
              border: `1px solid rgba(${section.colorRgb},0.28)`,
              borderRadius: 9,
              cursor: 'pointer',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: section.color,
              letterSpacing: '0.02em',
              transition: 'background 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = `rgba(${section.colorRgb},0.2)`;
              e.currentTarget.style.borderColor = `rgba(${section.colorRgb},0.5)`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = `rgba(${section.colorRgb},0.1)`;
              e.currentTarget.style.borderColor = `rgba(${section.colorRgb},0.28)`;
            }}
          >
            {expanded ? <><ChevronDown size={13}/> Collapse</> : <>Explore <ChevronRight size={13}/></>}
          </button>
        </div>
      </div>

      {/* Expandable sub-pages */}
      <div style={{
        position: 'relative', zIndex: 2,
        maxHeight: expanded ? `${section.items.length * 50}px` : '0px',
        overflow: 'hidden',
        transition: 'max-height 0.32s ease',
      }}>
        <div style={{ borderTop: `1px solid rgba(${section.colorRgb},0.14)`, padding: '0.375rem 0' }}>
          {section.items.map((item, i) => {
            const ItemIcon = item.icon;
            return (
              <button
                key={item.path + i}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  width: '100%', padding: '0.625rem 1.75rem',
                  background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left', transition: 'background 0.12s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = `rgba(${section.colorRgb},0.07)`}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <ItemIcon size={13} color={`rgba(${section.colorRgb},0.8)`} style={{ flexShrink: 0 }}/>
                <span style={{ flex: 1, fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-2)' }}>
                  {item.label}
                </span>
                <Tooltip text={item.tip}>
                  <HelpCircle size={12} color="var(--text-3)" style={{ flexShrink: 0, opacity: 0.55 }}/>
                </Tooltip>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Hub page ────────────────────────────────────────────────────── */
export default function Hub() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          margin: '0 0 0.25rem 0',
          fontSize: '1.375rem',
          fontWeight: 900,
          color: 'var(--text-1)',
          letterSpacing: '-0.025em',
          lineHeight: 1.1,
        }}>
          Planora Terminal
        </h1>
        <p style={{
          margin: 0,
          fontSize: '0.8125rem',
          color: 'var(--text-3)',
          letterSpacing: '0.04em',
          fontWeight: 500,
        }}>
          Select a section to explore
        </p>
      </div>

      {/* 2×3 card grid */}
      <div className="hub-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.125rem',
      }}>
        {SECTIONS.map((section, i) => (
          <HubCard key={section.id} section={section} index={i}/>
        ))}
      </div>

      {/* Disclaimer */}
      <p style={{
        marginTop: '2rem',
        fontSize: '0.6875rem',
        color: 'var(--text-3)',
        textAlign: 'center',
        letterSpacing: '0.02em',
        lineHeight: 1.6,
      }}>
        For educational purposes only &mdash; not financial, investment, tax, or legal advice.
      </p>

      <style>{`
        @keyframes hubCardDrop {
          from { opacity: 0; transform: translateY(-28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 960px) {
          .hub-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .hub-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
