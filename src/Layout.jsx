import React, { useState, useEffect, useCallback } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  MonitorDot,
  History,
  PieChart,
  TrendingUp,
  CalendarDays,
  Zap,
  Users,
  ShieldAlert,
  Star,
  BarChart2,
  Sparkles,
  Wallet,
  LineChart,
  Calculator,
  Settings,
  Menu,
  X,
  GraduationCap,
  HeartPulse,
  Landmark,
  BookUser,
  ShoppingCart,
  Brain,
  BookOpen,
  SlidersHorizontal,
  Coins,
  Newspaper,
  Home,
  Eye,
  Target,
  Receipt,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

/* ─── Nav structure ──────────────────────────────────────────────── */
const NAV_GROUPS = [
  {
    label: "Planora AI",
    items: [
      { label: "Planora AI", icon: Brain, path: "/planora-ai" },
    ],
  },
  {
    label: "Markets",
    items: [
      { label: "Dashboard",       icon: LayoutDashboard,    path: "/dashboard" },
      { label: "Terminal",        icon: MonitorDot,         path: "/terminal" },
      { label: "Market History",  icon: History,            path: "/MarketHistory" },
      { label: "Sectors",         icon: PieChart,           path: "/sectors" },
      { label: "Top Performers",  icon: TrendingUp,         path: "/top-performers" },
      { label: "Stock Screener",  icon: SlidersHorizontal,  path: "/stock-screener" },
      { label: "Crypto Markets",  icon: Coins,              path: "/crypto" },
      { label: "Market News",     icon: Newspaper,          path: "/market-news" },
    ],
  },
  {
    label: "Macro",
    items: [
      { label: "Economic Calendar", icon: CalendarDays, path: "/economic-calendar" },
      { label: "Energy Markets",    icon: Zap,          path: "/energy" },
      { label: "Labor Markets",     icon: Users,        path: "/labor" },
      { label: "The Consumer",      icon: ShoppingCart, path: "/consumer" },
      { label: "Real Estate",       icon: Home,         path: "/real-estate" },
    ],
  },
  {
    label: "Analysis",
    items: [
      { label: "Risk Analysis",          icon: ShieldAlert, path: "/RiskAnalysis" },
      { label: "Watchlist",              icon: Star,        path: "/watchlist" },
      { label: "Market Breadth",         icon: BarChart2,   path: "/market-breadth" },
      { label: "Political Intelligence", icon: Landmark,    path: "/PoliticsEconomy" },
      { label: "Insider Trading",        icon: Eye,         path: "/insider-trading" },
    ],
  },
  {
    label: "Wealth",
    items: [
      { label: "Breakdown Reports", icon: Sparkles,       path: "/AIAdvisor" },
      { label: "Budget Planner",    icon: Wallet,         path: "/BudgetPlanner" },
      { label: "Future Planning",   icon: LineChart,      path: "/FuturePlanning" },
      { label: "Calculators",       icon: Calculator,     path: "/Calculators" },
      { label: "Education",         icon: GraduationCap,  path: "/education" },
      { label: "Life Insurance",    icon: HeartPulse,     path: "/life-insurance" },
      { label: "Wealth Counsel",    icon: BookUser,       path: "/WealthCounsel" },
      { label: "Brokerage Guide",   icon: BookOpen,       path: "/brokerage-guide" },
      { label: "Net Worth Tracker", icon: Target,         path: "/net-worth" },
      { label: "Tax Planning",      icon: Receipt,        path: "/tax-planning" },
      { label: "Social Security",   icon: ShieldCheck,    path: "/social-security" },
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "Settings", icon: Settings, path: "/Settings" },
    ],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

/* ─── Page title helper ──────────────────────────────────────────── */
function usePageTitle() {
  const location = useLocation();
  const found = ALL_ITEMS.find((i) => {
    if (i.path === "/") return location.pathname === "/";
    return location.pathname === i.path || location.pathname.startsWith(i.path + "/");
  });
  return found?.label ?? "Planora";
}

/* ─── Sidebar ────────────────────────────────────────────────────── */
function Sidebar({ onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const activeGroupLabel = NAV_GROUPS.find(g =>
    g.items.some(i => location.pathname === i.path || location.pathname.startsWith(i.path + "/"))
  )?.label ?? null;

  const [openGroups, setOpenGroups] = useState(() => {
    try {
      const saved = localStorage.getItem("planora_nav_open");
      if (saved) return JSON.parse(saved);
    } catch {}
    return NAV_GROUPS.map(g => g.label);
  });

  useEffect(() => {
    if (activeGroupLabel && !openGroups.includes(activeGroupLabel)) {
      setOpenGroups(prev => {
        const next = [...prev, activeGroupLabel];
        localStorage.setItem("planora_nav_open", JSON.stringify(next));
        return next;
      });
    }
  }, [activeGroupLabel]); // eslint-disable-line

  const toggleGroup = useCallback((label) => {
    setOpenGroups(prev => {
      const next = prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label];
      localStorage.setItem("planora_nav_open", JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <aside className="t-sidebar">
      {/* Logo */}
      <div
        onClick={() => navigate('/hub')}
        style={{
          padding: "1rem 1rem 0.875rem",
          borderBottom: "1px solid var(--border-c)",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: "0.625rem",
          cursor: "pointer",
        }}
      >
        <div style={{
          width: 28, height: 28,
          background: "var(--gold)",
          borderRadius: "4px",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{
            fontSize: "0.9375rem", fontWeight: 900,
            color: "#07080a", lineHeight: 1,
            fontFamily: "'Inter', sans-serif",
          }}>P</span>
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{
            fontWeight: 900, fontSize: "0.875rem",
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "var(--text-1)", lineHeight: 1.1,
          }}>PLANORA</div>
          <div style={{
            fontSize: "0.5rem", fontWeight: 700,
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: "var(--gold)", marginTop: "1px", lineHeight: 1,
          }}>TERMINAL</div>
        </div>

        {onClose && (
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            style={{
              marginLeft: "auto", background: "none", border: "none",
              color: "var(--text-3)", cursor: "pointer",
              padding: "4px", display: "flex", alignItems: "center",
            }}
            aria-label="Close menu"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "0.375rem 0 1rem" }}>
        {NAV_GROUPS.map((group) => {
          const isOpen   = openGroups.includes(group.label);
          const isActive = group.label === activeGroupLabel;

          return (
            <div key={group.label}>
              <button
                onClick={() => toggleGroup(group.label)}
                style={{
                  display: "flex", alignItems: "center",
                  width: "100%", background: "none", border: "none",
                  padding: "0.875rem 1rem 0.25rem",
                  cursor: "pointer", gap: "0.375rem",
                }}
              >
                <span
                  className="t-nav-section"
                  style={{
                    padding: 0, flex: 1, textAlign: "left",
                    color: isActive ? "var(--gold)" : undefined,
                    transition: "color 0.15s",
                  }}
                >
                  {group.label}
                </span>
                <ChevronDown
                  size={11}
                  color={isActive ? "var(--gold)" : "var(--text-3)"}
                  style={{
                    flexShrink: 0,
                    transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>

              <div style={{
                overflow: "hidden",
                maxHeight: isOpen ? `${group.items.length * 40}px` : "0px",
                transition: "max-height 0.25s ease",
              }}>
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) => `t-nav-item${isActive ? " active" : ""}`}
                    onClick={onClose}
                    aria-label={item.label}
                  >
                    <item.icon size={14} style={{ flexShrink: 0 }} />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: "0.75rem 1rem",
        borderTop: "1px solid var(--border-c)",
        flexShrink: 0,
        display: "flex", flexDirection: "column", gap: "0.5rem",
      }}>
        <NavLink
          to="/nexus"
          style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            padding: "6px 10px", borderRadius: 6,
            border: "1px solid var(--border-c)",
            background: "transparent", color: "var(--text-3)",
            fontSize: "0.625rem", fontWeight: 600,
            letterSpacing: "0.06em", textTransform: "uppercase",
            textDecoration: "none", transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-c)"; e.currentTarget.style.color = "var(--text-3)"; }}
        >
          <svg width="12" height="12" viewBox="0 0 52 52" fill="none">
            <polygon points="26,3 49,14 49,38 26,49 3,38 3,14" fill="none" stroke="currentColor" strokeWidth="3"/>
            <circle cx="26" cy="26" r="5" fill="currentColor"/>
          </svg>
          Switch to Nexus
        </NavLink>
        <div style={{
          fontSize: "0.5rem", color: "var(--text-3)",
          lineHeight: 1.6, textAlign: "center", letterSpacing: "0.03em",
        }}>
          For educational purposes only · Not financial advice
        </div>
      </div>
    </aside>
  );
}

/* ─── Top bar ────────────────────────────────────────────────────── */
function TopBar({ onMenuClick }) {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  });

  const pageTitle = usePageTitle();

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    };
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="t-topbar">
      <button
        onClick={onMenuClick}
        className="t-topbar-menu-btn"
        aria-label="Open menu"
        style={{
          display: "none", background: "none", border: "none",
          color: "var(--text-2)", cursor: "pointer",
          padding: "5px", borderRadius: "4px",
          alignItems: "center", justifyContent: "center",
        }}
      >
        <Menu size={18} />
      </button>

      <div style={{ flex: 1 }}>
        <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-1)", letterSpacing: "-0.01em" }}>
          {pageTitle}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span
          className="t-mono"
          style={{ fontSize: "0.75rem", color: "var(--text-2)", fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em" }}
        >
          {time}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
          <div className="t-live" />
          <span style={{ fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--up)", textTransform: "uppercase" }}>
            LIVE
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .t-topbar-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

/* ─── Mobile bottom nav ──────────────────────────────────────────── */
const MOBILE_NAV_ITEMS = [
  { label: "Hub",      icon: LayoutDashboard, path: "/hub" },
  { label: "Markets",  icon: TrendingUp,      path: "/dashboard" },
  { label: "Macro",    icon: CalendarDays,    path: "/economic-calendar" },
  { label: "Analysis", icon: BarChart2,       path: "/RiskAnalysis" },
  { label: "Wealth",   icon: Wallet,          path: "/BudgetPlanner" },
];

function MobileNav() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <nav className="t-mobile-nav" style={{ display: "none" }} id="t-mobile-bottom-nav">
      {MOBILE_NAV_ITEMS.map((item) => {
        const active = isActive(item.path);
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={`t-mobile-nav-item${active ? " active" : ""}`}
          >
            <div className="t-mobile-nav-icon">
              <item.icon size={17} />
            </div>
            <span>{item.label}</span>
          </NavLink>
        );
      })}
      <style>{`
        @media (max-width: 768px) {
          #t-mobile-bottom-nav { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

/* ─── Welcome Modal ──────────────────────────────────────────────── */
const WELCOME_KEY = "planora_welcome_seen";

const FEATURE_CARDS = [
  {
    icon: TrendingUp,
    color: "var(--teal)",
    bg: "rgba(0,184,153,0.08)",
    border: "rgba(0,184,153,0.2)",
    title: "Markets",
    desc: "Live dashboards, sector heatmaps, stock screener, crypto, top performers, and real-time market news from global sources.",
  },
  {
    icon: CalendarDays,
    color: "var(--gold)",
    bg: "rgba(201,168,76,0.08)",
    border: "rgba(201,168,76,0.2)",
    title: "Macro",
    desc: "Economic calendar, Fed watch, labor markets, energy prices, consumer spending, and real estate trends — all in one place.",
  },
  {
    icon: BarChart2,
    color: "#4c9cf0",
    bg: "rgba(76,156,240,0.08)",
    border: "rgba(76,156,240,0.2)",
    title: "Analysis",
    desc: "Risk analysis, watchlist, market breadth, political intelligence, and insider trading filings to sharpen your edge.",
  },
  {
    icon: Sparkles,
    color: "#9b6cdb",
    bg: "rgba(155,108,219,0.08)",
    border: "rgba(155,108,219,0.2)",
    title: "Wealth",
    desc: "Budget planner, calculators, future planning, tax strategy, social security optimizer, net worth tracker, and brokerage guides.",
  },
];

function WelcomeModal({ onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(7,11,20,0.88)",
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1.5rem",
    }}>
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border-alt)",
        borderRadius: 16, width: "100%", maxWidth: 660,
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.08)",
        animation: "tFadeUp 0.3s ease forwards",
      }}>
        <div style={{ height: 3, background: "linear-gradient(90deg, var(--gold), var(--teal), transparent)", borderRadius: "16px 16px 0 0" }} />

        <div style={{ padding: "2rem 2rem 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.5rem" }}>
            <div style={{
              width: 44, height: 44, background: "var(--gold)", borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <span style={{ fontSize: "1.375rem", fontWeight: 900, color: "#07080a", lineHeight: 1 }}>P</span>
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: "1.125rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-1)", lineHeight: 1.1 }}>
                PLANORA
              </div>
              <div style={{ fontSize: "0.5625rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginTop: 2 }}>
                FINANCIAL TERMINAL
              </div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <div className="t-live" />
              <span style={{ fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--up)", textTransform: "uppercase" }}>LIVE</span>
            </div>
          </div>

          <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.03em", margin: "0 0 0.75rem 0", lineHeight: 1.25 }}>
            Welcome to your personal<br />
            <span style={{ background: "linear-gradient(135deg, var(--gold), #d4b56a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              financial intelligence hub.
            </span>
          </h2>

          <p style={{ fontSize: "0.9375rem", color: "var(--text-2)", lineHeight: 1.7, margin: "0 0 1.5rem 0" }}>
            Planora Terminal brings together the tools, data, and education that were once only available to Wall Street professionals — and puts them at your fingertips. Whether you're tracking markets, planning for retirement, understanding tax strategy, or just starting to learn how money works, Planora is built to help you make smarter financial decisions.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {FEATURE_CARDS.map(card => {
              const Icon = card.icon;
              return (
                <div key={card.title} style={{
                  background: card.bg, border: `1px solid ${card.border}`,
                  borderRadius: 10, padding: "0.875rem 1rem",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <Icon size={15} color={card.color} />
                    <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: card.color, letterSpacing: "0.02em" }}>
                      {card.title}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-2)", lineHeight: 1.55, margin: 0 }}>
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div style={{
            background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.18)",
            borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1.5rem",
            display: "flex", gap: "0.75rem", alignItems: "flex-start",
          }}>
            <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: 1 }}>📘</span>
            <p style={{ fontSize: "0.8125rem", color: "var(--gold)", lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
              <strong>For educational purposes only.</strong> Planora Terminal is designed to help you understand financial concepts, explore market data, and plan your personal finances. It is not a licensed financial advisor and nothing here constitutes investment, tax, or legal advice. Always consult a qualified professional before making major financial decisions.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              width: "100%", padding: "0.875rem",
              background: "linear-gradient(135deg, var(--gold) 0%, #a8882e 100%)",
              border: "none", borderRadius: 8, cursor: "pointer",
              fontSize: "0.9375rem", fontWeight: 800,
              color: "#07080a", letterSpacing: "0.04em",
              textTransform: "uppercase", transition: "filter 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.1)"}
            onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
          >
            Enter Terminal
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Layout ─────────────────────────────────────────────────────── */
export default function Layout({ children }) {
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => !sessionStorage.getItem(WELCOME_KEY));

  const closeWelcome = () => {
    sessionStorage.setItem(WELCOME_KEY, "1");
    setShowWelcome(false);
  };

  return (
    <div className="t-bg">
      {showWelcome && <WelcomeModal onClose={closeWelcome} />}

      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(7,11,20,0.8)",
              backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
              zIndex: 45,
            }}
          />
          <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: "var(--sidebar-w)", zIndex: 46 }}>
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
        </>
      )}

      <TopBar onMenuClick={() => setMobileOpen(true)} />

      <main className="t-main">
        <div style={{ padding: "1.25rem 1.25rem 2rem", maxWidth: "1400px", margin: "0 auto" }}>
          {children}
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
