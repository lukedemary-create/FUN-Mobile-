// ─────────────────────────────────────────────────────────────────────
// Layout.jsx — Planora Terminal · Command Rail Navigation
// Redesigned from scratch · Dark #0a0a0f · Gold #F5A623
// ─────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useCallback } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, LayoutDashboard, CalendarDays, ShieldAlert, Wallet, Settings,
  MonitorDot, History, PieChart, TrendingUp, SlidersHorizontal, Coins,
  Newspaper, Zap, Users, ShoppingCart, Home, Star, BarChart2, Landmark,
  Eye, Sparkles, LineChart, Calculator, GraduationCap, HeartPulse,
  BookUser, BookOpen, Target, Receipt, ShieldCheck, X, ChevronRight,
  Menu,
} from "lucide-react";

const RAIL_W  = 56;
const PANEL_W = 248;

// ── Nav data ───────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: "ai", label: "Planora AI", icon: Brain,
    items: [{ label: "Planora AI", icon: Brain, path: "/planora-ai" }],
  },
  {
    id: "markets", label: "Markets", icon: LayoutDashboard,
    items: [
      { label: "Dashboard",      icon: LayoutDashboard,   path: "/dashboard"      },
      { label: "Terminal",       icon: MonitorDot,        path: "/terminal"       },
      { label: "Market History", icon: History,           path: "/MarketHistory"  },
      { label: "Sectors",        icon: PieChart,          path: "/sectors"        },
      { label: "Top Performers", icon: TrendingUp,        path: "/top-performers" },
      { label: "Stock Screener", icon: SlidersHorizontal, path: "/stock-screener" },
      { label: "Crypto Markets", icon: Coins,             path: "/crypto"         },
      { label: "Market News",    icon: Newspaper,         path: "/market-news"    },
    ],
  },
  {
    id: "macro", label: "Macro", icon: CalendarDays,
    items: [
      { label: "Economic Calendar", icon: CalendarDays, path: "/economic-calendar" },
      { label: "Energy Markets",    icon: Zap,          path: "/energy"           },
      { label: "Labor Markets",     icon: Users,        path: "/labor"            },
      { label: "The Consumer",      icon: ShoppingCart, path: "/consumer"         },
      { label: "Real Estate",       icon: Home,         path: "/real-estate"      },
    ],
  },
  {
    id: "analysis", label: "Analysis", icon: ShieldAlert,
    items: [
      { label: "Risk Analysis",          icon: ShieldAlert, path: "/RiskAnalysis"     },
      { label: "Watchlist",              icon: Star,        path: "/watchlist"         },
      { label: "Market Breadth",         icon: BarChart2,   path: "/market-breadth"   },
      { label: "Political Intelligence", icon: Landmark,    path: "/PoliticsEconomy"  },
      { label: "Insider Trading",        icon: Eye,         path: "/insider-trading"  },
    ],
  },
  {
    id: "wealth", label: "Wealth", icon: Wallet,
    items: [
      { label: "Breakdown Reports", icon: Sparkles,      path: "/AIAdvisor"      },
      { label: "Budget Planner",    icon: Wallet,        path: "/BudgetPlanner"  },
      { label: "Future Planning",   icon: LineChart,     path: "/FuturePlanning" },
      { label: "Calculators",       icon: Calculator,    path: "/Calculators"    },
      { label: "Education",         icon: GraduationCap, path: "/education"      },
      { label: "Life Insurance",    icon: HeartPulse,    path: "/life-insurance" },
      { label: "Wealth Counsel",    icon: BookUser,      path: "/WealthCounsel"  },
      { label: "Brokerage Guide",   icon: BookOpen,      path: "/brokerage-guide"},
      { label: "Net Worth Tracker", icon: Target,        path: "/net-worth"      },
      { label: "Tax Planning",      icon: Receipt,       path: "/tax-planning"   },
      { label: "Social Security",   icon: ShieldCheck,   path: "/social-security"},
    ],
  },
  {
    id: "settings", label: "Settings", icon: Settings,
    items: [{ label: "Settings", icon: Settings, path: "/Settings" }],
  },
];

const ALL_ITEMS = SECTIONS.flatMap(s => s.items);

function useActiveSection() {
  const { pathname } = useLocation();
  return SECTIONS.find(s =>
    s.items.some(i => pathname === i.path || pathname.startsWith(i.path + "/"))
  ) ?? null;
}

function usePageTitle() {
  const { pathname } = useLocation();
  return ALL_ITEMS.find(i => pathname === i.path || pathname.startsWith(i.path + "/"))?.label ?? "Planora";
}

// ── Individual nav item (handles hover state internally) ───────────────
function NavItem({ item, onClose }) {
  const [hov, setHov] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const Icon = item.icon;
  const isActive = pathname === item.path || pathname.startsWith(item.path + "/");

  function handleClick() {
    onClose();
    navigate(item.path);
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "9px 16px",
        cursor: "pointer",
        background: isActive ? "rgba(245,166,35,0.09)" : hov ? "rgba(255,255,255,0.04)" : "transparent",
        borderLeft: `2px solid ${isActive ? "#F5A623" : "transparent"}`,
        color: isActive ? "#F5A623" : "#94a3b8",
        fontSize: 13,
        fontWeight: isActive ? 600 : 400,
        fontFamily: "'Inter', -apple-system, sans-serif",
        transition: "background 0.12s",
        letterSpacing: "-0.01em",
      }}
    >
      <Icon size={14} style={{ flexShrink: 0 }}/>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</span>
    </div>
  );
}

// ── Icon Rail ──────────────────────────────────────────────────────────
function Rail({ activeSection, openSectionId, onSectionClick }) {
  const navigate = useNavigate();
  const mainSections = SECTIONS.filter(s => s.id !== "settings");

  return (
    <div
      id="planora-rail"
      style={{
        position: "fixed", top: 0, left: 0, bottom: 0,
        width: RAIL_W,
        background: "#0a0a0f",
        borderRight: "1px solid #1e2028",
        display: "flex", flexDirection: "column", alignItems: "center",
        zIndex: 60,
      }}
    >
      {/* Logo mark */}
      <button
        onClick={() => navigate("/hub")}
        title="Planora Hub"
        style={{
          width: RAIL_W, height: 52, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "none", border: "none", cursor: "pointer",
          borderBottom: "1px solid #1e2028",
        }}
      >
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: 28, height: 28, background: "#F5A623", borderRadius: 7,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 900, color: "#0a0a0f", lineHeight: 1 }}>P</span>
        </motion.div>
      </button>

      {/* Section icons */}
      <nav style={{ flex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 0", gap: 1 }}>
        {mainSections.map(section => {
          const Icon = section.icon;
          const isActive  = activeSection?.id === section.id;
          const isOpen    = openSectionId === section.id;

          return (
            <div key={section.id} style={{ position: "relative", width: "100%" }}>
              {/* Active gold pip */}
              {isActive && (
                <motion.div
                  layoutId="rail-active-pip"
                  style={{
                    position: "absolute", left: 0, top: 6, bottom: 6,
                    width: 2, background: "#F5A623", borderRadius: "0 2px 2px 0",
                  }}
                />
              )}
              <button
                onClick={() => onSectionClick(section.id)}
                title={section.label}
                style={{
                  width: "100%", height: 44,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: isOpen
                    ? "rgba(245,166,35,0.12)"
                    : isActive
                    ? "rgba(245,166,35,0.06)"
                    : "transparent",
                  border: "none", cursor: "pointer",
                  transition: "background 0.15s",
                  position: "relative",
                }}
                onMouseEnter={e => { if (!isOpen && !isActive) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={e => { if (!isOpen && !isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <Icon
                  size={17}
                  color={isActive || isOpen ? "#F5A623" : "#4a5568"}
                  style={{ transition: "color 0.15s" }}
                />
              </button>
            </div>
          );
        })}
      </nav>

      {/* Bottom controls */}
      <div style={{ width: "100%", borderTop: "1px solid #1e2028", padding: "6px 0" }}>
        {/* Settings */}
        {(() => {
          const s = SECTIONS.find(x => x.id === "settings");
          const isActive = activeSection?.id === "settings";
          const isOpen   = openSectionId === "settings";
          return (
            <button
              onClick={() => onSectionClick("settings")}
              title="Settings"
              style={{
                width: "100%", height: 40,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isOpen || isActive ? "rgba(245,166,35,0.08)" : "transparent",
                border: "none", cursor: "pointer", transition: "background 0.15s",
              }}
              onMouseEnter={e => { if (!isOpen && !isActive) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { if (!isOpen && !isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <Settings size={16} color={isActive || isOpen ? "#F5A623" : "#4a5568"}/>
            </button>
          );
        })()}

        {/* Home */}
        <button
          onClick={() => navigate("/")}
          title="Back to Home"
          style={{
            width: "100%", height: 38,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "transparent", border: "none", cursor: "pointer", transition: "background 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <svg width="14" height="14" viewBox="0 0 52 52" fill="none">
            <polygon points="26,3 49,14 49,38 26,49 3,38 3,14" fill="none" stroke="#4a5568" strokeWidth="4"/>
            <circle cx="26" cy="26" r="6" fill="#4a5568"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Flyout Panel ───────────────────────────────────────────────────────
function FlyoutPanel({ section, onClose }) {
  return (
    <AnimatePresence>
      {section && (
          <motion.div
            key="panel"
            onClick={e => e.stopPropagation()}
            initial={{ x: -(PANEL_W + 10), opacity: 0 }}
            animate={{ x: 0, opacity: 1, transition: { type: "spring", stiffness: 420, damping: 38, mass: 0.75 } }}
            exit={{ x: -(PANEL_W + 10), opacity: 0, transition: { duration: 0.12, ease: "easeIn" } }}
            style={{
              position: "fixed", top: 0, left: RAIL_W, bottom: 0,
              width: PANEL_W,
              background: "#111318",
              borderRight: "1px solid #1e2028",
              zIndex: 56,
              display: "flex", flexDirection: "column",
              overflow: "hidden",
              boxShadow: "8px 0 40px rgba(0,0,0,0.5)",
            }}
          >
            {/* Panel header */}
            <div style={{
              height: 52, flexShrink: 0,
              display: "flex", alignItems: "center",
              padding: "0 14px 0 16px",
              borderBottom: "1px solid #1e2028",
              gap: 8,
            }}>
              <div style={{ width: 2, height: 16, background: "#F5A623", borderRadius: 1, flexShrink: 0 }}/>
              <span style={{
                flex: 1, fontSize: 11, fontWeight: 700,
                letterSpacing: "0.15em", textTransform: "uppercase",
                color: "#f1f5f9",
                fontFamily: "'Inter', sans-serif",
              }}>
                {section.label}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                style={{
                  background: "rgba(255,255,255,0.05)", border: "1px solid #1e2028",
                  borderRadius: 6, cursor: "pointer",
                  width: 26, height: 26,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#64748b",
                }}
              >
                <X size={12}/>
              </button>
            </div>

            {/* Items */}
            <nav style={{ flex: 1, overflowY: "auto", padding: "6px 0" }}>
              {section.items.map((item) => (
                <NavItem key={item.path} item={item} onClose={onClose} />
              ))}
            </nav>

            {/* Footer */}
            <div style={{
              padding: "10px 16px",
              borderTop: "1px solid #1e2028",
              flexShrink: 0,
            }}>
              <p style={{ fontSize: 9.5, color: "#4a5568", lineHeight: 1.6, margin: 0, letterSpacing: "0.02em" }}>
                For educational purposes only · Not financial advice
              </p>
            </div>
          </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Top Bar ────────────────────────────────────────────────────────────
function TopBar({ onMobileMenu }) {
  const [clock, setClock] = useState("");
  const activeSection = useActiveSection();
  const pageTitle     = usePageTitle();

  useEffect(() => {
    const tick = () => {
      setClock(new Date().toLocaleTimeString("en-US", {
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
      }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      id="planora-topbar"
      style={{
        position: "fixed", top: 0, left: RAIL_W, right: 0,
        height: 48,
        background: "rgba(10,10,15,0.94)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid #1e2028",
        display: "flex", alignItems: "center",
        padding: "0 20px 0 16px",
        gap: 10,
        zIndex: 40,
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Mobile hamburger */}
      <button
        id="mobile-menu-btn"
        onClick={onMobileMenu}
        style={{
          display: "none", background: "none", border: "none",
          cursor: "pointer", color: "#94a3b8", padding: 4,
          alignItems: "center", justifyContent: "center",
        }}
      >
        <Menu size={18}/>
      </button>

      {/* Breadcrumb */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
        {activeSection && (
          <>
            <span style={{ fontSize: 11, color: "#4a5568", fontWeight: 500 }}>{activeSection.label}</span>
            <ChevronRight size={11} color="#1e2028"/>
          </>
        )}
        <span style={{
          fontSize: 13, fontWeight: 700, color: "#f1f5f9",
          letterSpacing: "-0.01em",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {pageTitle}
        </span>
      </div>

      {/* Clock */}
      <span style={{
        fontSize: 12, color: "#64748b",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontVariantNumeric: "tabular-nums",
        letterSpacing: "0.04em",
        flexShrink: 0,
      }}>
        {clock}
      </span>

      {/* LIVE pill */}
      <div style={{
        display: "flex", alignItems: "center", gap: 5,
        padding: "3px 9px",
        background: "rgba(16,185,129,0.08)",
        border: "1px solid rgba(16,185,129,0.2)",
        borderRadius: 99,
        flexShrink: 0,
      }}>
        <div style={{
          width: 5, height: 5, borderRadius: "50%", background: "#10b981",
          animation: "liveGlow 2s ease infinite",
        }}/>
        <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.12em", color: "#10b981", textTransform: "uppercase" }}>
          LIVE
        </span>
      </div>

      <style>{`
        @keyframes liveGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.5); }
          50%       { box-shadow: 0 0 0 4px rgba(16,185,129,0); }
        }
        @media (max-width: 768px) {
          #planora-rail    { display: none !important; }
          #planora-topbar  { left: 0 !important; }
          #planora-main    { margin-left: 0 !important; padding-bottom: 64px !important; }
          #mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

// ── Mobile full menu overlay ───────────────────────────────────────────
function MobileMenuOverlay({ open, onClose }) {
  const navigate = useNavigate();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ type: "spring", stiffness: 400, damping: 38 }}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "#111318",
            overflowY: "auto",
            paddingBottom: 80,
          }}
        >
          {/* Header */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "16px 20px",
            borderBottom: "1px solid #1e2028",
          }}>
            <div style={{ width: 28, height: 28, background: "#F5A623", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 900, color: "#0a0a0f" }}>P</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#f1f5f9" }}>PLANORA</div>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#F5A623", marginTop: 1 }}>TERMINAL</div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: 4 }}>
              <X size={18}/>
            </button>
          </div>
          {/* All sections */}
          {SECTIONS.map(section => (
            <div key={section.id}>
              <div style={{ padding: "12px 20px 4px", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#4a5568" }}>
                {section.label}
              </div>
              {section.items.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); onClose(); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      width: "100%", padding: "10px 20px",
                      background: "none", border: "none", cursor: "pointer",
                      color: "#94a3b8", fontSize: 14, fontFamily: "inherit", textAlign: "left",
                    }}
                  >
                    <Icon size={15}/>
                    {item.label}
                  </button>
                );
              })}
            </div>
          ))}
          <div style={{ padding: "16px 20px", borderTop: "1px solid #1e2028", marginTop: 8 }}>
            <button
              onClick={() => { navigate("/"); onClose(); }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "none", border: "1px solid #1e2028",
                borderRadius: 8, padding: "10px 14px",
                cursor: "pointer", color: "#64748b", fontSize: 13, fontFamily: "inherit",
              }}
            >
              Switch to Home
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Mobile Bottom Nav ──────────────────────────────────────────────────
const MOBILE_QUICK = [
  { label: "Markets",  icon: LayoutDashboard, path: "/dashboard"         },
  { label: "Macro",    icon: CalendarDays,    path: "/economic-calendar" },
  { label: "Analysis", icon: ShieldAlert,     path: "/RiskAnalysis"      },
  { label: "Wealth",   icon: Wallet,          path: "/BudgetPlanner"     },
  { label: "AI",       icon: Brain,           path: "/planora-ai"        },
];

function MobileNav() {
  const { pathname } = useLocation();
  return (
    <nav
      id="t-mobile-bottom-nav"
      style={{
        display: "none",
        position: "fixed", bottom: 0, left: 0, right: 0, height: 58,
        background: "#111318",
        borderTop: "1px solid #1e2028",
        zIndex: 50, flexDirection: "row",
      }}
    >
      {MOBILE_QUICK.map(item => {
        const Icon = item.icon;
        const active = pathname === item.path || pathname.startsWith(item.path + "/");
        return (
          <NavLink
            key={item.path}
            to={item.path}
            style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 3,
              textDecoration: "none",
              color: active ? "#F5A623" : "#4a5568",
              borderTop: `2px solid ${active ? "#F5A623" : "transparent"}`,
              paddingTop: 2,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <Icon size={17}/>
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{item.label}</span>
          </NavLink>
        );
      })}
      <style>{`@media (max-width: 768px) { #t-mobile-bottom-nav { display: flex !important; } }`}</style>
    </nav>
  );
}

// ── Welcome Modal ──────────────────────────────────────────────────────
const WELCOME_KEY  = "planora_welcome_seen";

const FEATURE_CARDS = [
  { icon: TrendingUp,  color: "#10b981", bg: "rgba(16,185,129,0.07)",  border: "rgba(16,185,129,0.18)",  title: "Markets",  desc: "Live dashboards, sector heatmaps, stock screener, crypto, top performers, and real-time market news." },
  { icon: CalendarDays, color: "#F5A623", bg: "rgba(245,166,35,0.07)", border: "rgba(245,166,35,0.2)",   title: "Macro",    desc: "Economic calendar, Fed watch, labor markets, energy prices, consumer spending, and real estate trends." },
  { icon: BarChart2,   color: "#818cf8", bg: "rgba(129,140,248,0.07)", border: "rgba(129,140,248,0.18)", title: "Analysis", desc: "Risk analysis, watchlist, market breadth, political intelligence, and insider trading filings." },
  { icon: Sparkles,    color: "#00B4C6", bg: "rgba(0,180,198,0.07)",   border: "rgba(0,180,198,0.18)",   title: "Wealth",   desc: "Budget planner, calculators, future planning, tax strategy, net worth tracker, and brokerage guides." },
];

function WelcomeModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(5,7,14,0.92)",
        backdropFilter: "blur(16px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 340, damping: 32, delay: 0.08 }}
        style={{
          background: "#111318",
          border: "1px solid #1e2028",
          borderRadius: 18, width: "100%", maxWidth: 660,
          maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(245,166,35,0.06)",
        }}
      >
        {/* Gold top stripe */}
        <div style={{ height: 2, background: "linear-gradient(90deg, #F5A623 0%, #00B4C6 60%, transparent 100%)", borderRadius: "18px 18px 0 0" }} />

        <div style={{ padding: "2rem" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.5rem" }}>
            <div style={{ width: 44, height: 44, background: "#F5A623", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 30px rgba(245,166,35,0.25)" }}>
              <span style={{ fontSize: "1.375rem", fontWeight: 900, color: "#07080a", lineHeight: 1 }}>P</span>
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: "1rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#f1f5f9", lineHeight: 1.1 }}>PLANORA</div>
              <div style={{ fontSize: "0.5625rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#F5A623", marginTop: 2 }}>FINANCIAL TERMINAL</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 99 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981", animation: "liveGlow 2s ease infinite" }}/>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: "#10b981", textTransform: "uppercase" }}>LIVE</span>
            </div>
          </div>

          <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.03em", margin: "0 0 0.75rem 0", lineHeight: 1.25 }}>
            Welcome to your personal<br/>
            <span style={{ background: "linear-gradient(135deg, #F5A623, #d4a555)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              financial intelligence hub.
            </span>
          </h2>

          <p style={{ fontSize: "0.9375rem", color: "#94a3b8", lineHeight: 1.75, margin: "0 0 1.5rem 0" }}>
            Planora Terminal brings together tools, data, and education once reserved for Wall Street professionals — putting them directly in your hands. Track markets, plan for retirement, understand tax strategy, or start learning how money works.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem", marginBottom: "1.25rem" }}>
            {FEATURE_CARDS.map(card => {
              const Icon = card.icon;
              return (
                <div key={card.title} style={{ background: card.bg, border: `1px solid ${card.border}`, borderRadius: 10, padding: "0.875rem 1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <Icon size={14} color={card.color}/>
                    <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: card.color, letterSpacing: "0.02em" }}>{card.title}</span>
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: "#94a3b8", lineHeight: 1.55, margin: 0 }}>{card.desc}</p>
                </div>
              );
            })}
          </div>

          <div style={{ background: "rgba(245,166,35,0.05)", border: "1px solid rgba(245,166,35,0.15)", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "0.8125rem", color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>
              <span style={{ color: "#F5A623", fontWeight: 700 }}>For educational purposes only.</span> Planora Terminal is designed to help you understand financial concepts, explore market data, and plan your personal finances. It is not a licensed financial advisor and nothing here constitutes investment, tax, or legal advice.
            </p>
          </div>

          <motion.button
            whileHover={{ filter: "brightness(1.1)", transform: "translateY(-1px)" }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            style={{
              width: "100%", padding: "0.9375rem",
              background: "linear-gradient(135deg, #F5A623 0%, #c8881e 100%)",
              border: "none", borderRadius: 10, cursor: "pointer",
              fontSize: "0.9375rem", fontWeight: 800,
              color: "#07080a", letterSpacing: "0.05em",
              textTransform: "uppercase",
              fontFamily: "'Inter', sans-serif",
              boxShadow: "0 0 30px rgba(245,166,35,0.3)",
            }}
          >
            Enter Terminal →
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Layout ─────────────────────────────────────────────────────────────
export default function Layout({ children }) {
  const [openSectionId,  setOpenSectionId]  = useState(null);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [showWelcome,    setShowWelcome]    = useState(() => !sessionStorage.getItem(WELCOME_KEY));
  const activeSection = useActiveSection();
  const { pathname }  = useLocation();

  // Close flyout on navigation
  useEffect(() => { setOpenSectionId(null); }, [pathname]);

  const handleSectionClick = useCallback((id) => {
    setOpenSectionId(prev => (prev === id ? null : id));
  }, []);

  const closeFlyout = useCallback(() => setOpenSectionId(null), []);

  const closeWelcome = useCallback(() => {
    sessionStorage.setItem(WELCOME_KEY, "1");
    setShowWelcome(false);
  }, []);

  const openSection = SECTIONS.find(s => s.id === openSectionId) ?? null;

  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Welcome */}
      <AnimatePresence>
        {showWelcome && <WelcomeModal onClose={closeWelcome} />}
      </AnimatePresence>

      {/* Icon Rail (desktop) */}
      <Rail
        activeSection={activeSection}
        openSectionId={openSectionId}
        onSectionClick={handleSectionClick}
      />

      {/* Flyout panel */}
      <FlyoutPanel section={openSection} onClose={closeFlyout} />

      {/* Top bar */}
      <TopBar onMobileMenu={() => setMobileOpen(true)} />

      {/* Mobile overlay menu */}
      <MobileMenuOverlay open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main content */}
      <main
        id="planora-main"
        onClick={() => { if (openSectionId) closeFlyout(); }}
        style={{
          marginLeft: RAIL_W,
          paddingTop: 48,
          minHeight: "100vh",
          background: "#0a0a0f",
        }}
      >
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{ padding: "1.25rem 1.25rem 2rem", maxWidth: 1400, margin: "0 auto" }}
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
