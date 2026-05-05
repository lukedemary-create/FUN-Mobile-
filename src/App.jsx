import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import ErrorBoundary from '@/lib/ErrorBoundary';
import Layout from './Layout';
import './nexus/styles/globals.css';
import { AppProvider, useApp } from './nexus/context/AppContext';
import { AdvisorSidebar, ClientSidebar } from './nexus/components/shared/Sidebar';
import { clients } from './nexus/data/demoData';

/* ─── Existing pages ─────────────────────────────────────────────── */
const PageNotFound       = lazy(() => import('./lib/PageNotFound'));
const Dashboard          = lazy(() => import('./pages/Dashboard'));
const SixPillars         = lazy(() => import('./pages/SixPillars'));
const AIAdvisor          = lazy(() => import('./pages/AIAdvisor'));
const AdvisorMarketplace = lazy(() => import('./pages/AdvisorMarketplace'));
const BudgetPlanner      = lazy(() => import('./pages/BudgetPlanner'));
const Calculators        = lazy(() => import('./pages/Calculators'));
const FuturePlanning     = lazy(() => import('./pages/FuturePlanning'));
const MarketHistory      = lazy(() => import('./pages/MarketHistory'));
const PoliticsEconomy    = lazy(() => import('./pages/PoliticsEconomy'));
const RiskAnalysis       = lazy(() => import('./pages/RiskAnalysis'));
const StockLookup        = lazy(() => import('./pages/StockLookup'));
const TickerLookup       = lazy(() => import('./pages/TickerLookup'));
const Settings           = lazy(() => import('./pages/Settings'));

/* ─── Education pages ────────────────────────────────────────────── */
const Education          = lazy(() => import('./pages/Education'));
const EducationTopic     = lazy(() => import('./pages/EducationTopic'));

/* ─── New pages ──────────────────────────────────────────────────── */
const Terminal           = lazy(() => import('./pages/Terminal'));
const Sectors            = lazy(() => import('./pages/Sectors'));
const TopPerformers      = lazy(() => import('./pages/TopPerformers'));
const EconomicCalendar   = lazy(() => import('./pages/EconomicCalendar'));
const Energy             = lazy(() => import('./pages/Energy'));
const Labor              = lazy(() => import('./pages/Labor'));
const Watchlist          = lazy(() => import('./pages/Watchlist'));
const MarketBreadth      = lazy(() => import('./pages/MarketBreadth'));
const LifeInsurance      = lazy(() => import('./pages/LifeInsurance'));
const WealthCounsel      = lazy(() => import('./pages/WealthCounsel'));
const Landing            = lazy(() => import('./pages/Landing'));
const Consumer           = lazy(() => import('./pages/Consumer'));
const PlonoraAI          = lazy(() => import('./pages/PlonoraAI'));
const BrokerageGuide     = lazy(() => import('./pages/BrokerageGuide'));
const StockScreener      = lazy(() => import('./pages/StockScreener'));
const CryptoDashboard    = lazy(() => import('./pages/CryptoDashboard'));
const MarketNews         = lazy(() => import('./pages/MarketNews'));
const RealEstate         = lazy(() => import('./pages/RealEstate'));
const InsiderTrading     = lazy(() => import('./pages/InsiderTrading'));
const NetWorthTracker    = lazy(() => import('./pages/NetWorthTracker'));
const TaxPlanning        = lazy(() => import('./pages/TaxPlanning'));
const SocialSecurity     = lazy(() => import('./pages/SocialSecurity'));
const Hub                = lazy(() => import('./pages/Hub'));
const Privacy            = lazy(() => import('./pages/Privacy'));
const Terms              = lazy(() => import('./pages/Terms'));

/* ─── FUN app ────────────────────────────────────────────────────── */
const FunApp             = lazy(() => import('./fun/FunApp'));

/* ─── Nexus pages (imported directly to avoid nested Routes issues) ── */
const NexusRoleSelector  = lazy(() => import('./nexus/pages/RoleSelector'));
const AdvisorDashboard   = lazy(() => import('./nexus/pages/advisor/AdvisorDashboard'));
const ClientList         = lazy(() => import('./nexus/pages/advisor/ClientList'));
const ClientDetail       = lazy(() => import('./nexus/pages/advisor/ClientDetail'));
const BroadcastMessages  = lazy(() => import('./nexus/pages/advisor/BroadcastMessages'));
const AdvisorDocuments   = lazy(() => import('./nexus/pages/advisor/AdvisorDocuments'));
const ClientDashboard    = lazy(() => import('./nexus/pages/client/ClientDashboard'));
const ClientPortfolio    = lazy(() => import('./nexus/pages/client/ClientPortfolio'));
const Goals              = lazy(() => import('./nexus/pages/client/Goals'));
const LifeEvents         = lazy(() => import('./nexus/pages/client/LifeEvents'));
const MeetingAgenda      = lazy(() => import('./nexus/pages/client/MeetingAgenda'));
const ClientMessages     = lazy(() => import('./nexus/pages/client/ClientMessages'));
const ClientDocuments    = lazy(() => import('./nexus/pages/client/ClientDocuments'));

/* ─── Loading fallback ───────────────────────────────────────────── */
const Loader = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "40vh" }}>
    <div style={{ width: 32, height: 32, border: "3px solid rgba(201,168,76,0.15)", borderTopColor: "#c9a84c", borderRadius: "50%", animation: "tSpin 0.7s linear infinite" }} />
    <style>{`@keyframes tSpin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

/* ─── Nexus layout wrappers ──────────────────────────────────────── */
function AdvisorLayout() {
  const { role, totalUnread } = useApp();
  if (role !== 'advisor') return <Navigate to="/nexus" replace />;
  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden' }}>
      <AdvisorSidebar unreadTotal={totalUnread()} />
      <main style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <Outlet />
      </main>
    </div>
  );
}

function ClientLayout() {
  const { role, selectedClientId, unreadCount } = useApp();
  if (role !== 'client') return <Navigate to="/nexus" replace />;
  const client = clients.find(c => c.id === selectedClientId);
  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden' }}>
      <ClientSidebar client={client} unreadCount={unreadCount(selectedClientId)} />
      <main style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <Outlet />
      </main>
    </div>
  );
}

/* ─── Routes ─────────────────────────────────────────────────────── */
function AppRoutes() {
  const { isLoadingAuth, isLoadingPublicSettings } = useAuth();

  if (isLoadingAuth || isLoadingPublicSettings) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          {/* Gold P logo mark */}
          <div
            style={{
              width: 36,
              height: 36,
              background: "var(--gold, #c9a84c)",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: "1.125rem", fontWeight: 900, color: "#07080a", lineHeight: 1 }}>P</span>
          </div>
          <div
            style={{
              width: 32,
              height: 32,
              border: "2px solid rgba(201,168,76,0.15)",
              borderTopColor: "#c9a84c",
              borderRadius: "50%",
              animation: "tSpin 0.7s linear infinite",
            }}
          />
          <style>{`@keyframes tSpin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* ── Landing ── */}
        <Route path="/" element={<Landing />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        {/* ── FUN (own full-page layout) ── */}
        <Route path="/fun/*" element={<FunApp />} />

        {/* ── Nexus (own layouts, AppProvider wraps all) ── */}
        <Route path="/nexus" element={<NexusRoleSelector />} />
        <Route path="/nexus/advisor" element={<AdvisorLayout />}>
          <Route index element={<AdvisorDashboard />} />
          <Route path="clients" element={<ClientList />} />
          <Route path="clients/:id" element={<ClientDetail />} />
          <Route path="messages" element={<BroadcastMessages />} />
          <Route path="documents" element={<AdvisorDocuments />} />
        </Route>
        <Route path="/nexus/client" element={<ClientLayout />}>
          <Route index element={<ClientDashboard />} />
          <Route path="portfolio" element={<ClientPortfolio />} />
          <Route path="goals" element={<Goals />} />
          <Route path="life-events" element={<LifeEvents />} />
          <Route path="agenda" element={<MeetingAgenda />} />
          <Route path="messages" element={<ClientMessages />} />
          <Route path="documents" element={<ClientDocuments />} />
        </Route>

        {/* ── Planora AI (fullscreen — own layout) ── */}
        <Route path="/planora-ai" element={<PlonoraAI />} />

        {/* ── Planora Terminal (Layout sidebar) ── */}
        <Route element={<Layout><Outlet /></Layout>}>
          <Route path="/hub"                 element={<Hub />} />
          <Route path="/dashboard"           element={<Dashboard />} />
          <Route path="/Dashboard"           element={<Dashboard />} />
          <Route path="/SixPillars"          element={<SixPillars />} />
          <Route path="/AIAdvisor"           element={<AIAdvisor />} />
          <Route path="/AdvisorMarketplace"  element={<AdvisorMarketplace />} />
          <Route path="/BudgetPlanner"       element={<BudgetPlanner />} />
          <Route path="/Calculators"         element={<Calculators />} />
          <Route path="/FuturePlanning"      element={<FuturePlanning />} />
          <Route path="/MarketHistory"       element={<MarketHistory />} />
          <Route path="/PoliticsEconomy"     element={<PoliticsEconomy />} />
          <Route path="/RiskAnalysis"        element={<RiskAnalysis />} />
          <Route path="/StockLookup"         element={<StockLookup />} />
          <Route path="/TickerLookup"        element={<TickerLookup />} />
          <Route path="/Settings"            element={<Settings />} />
          <Route path="/terminal"            element={<Terminal />} />
          <Route path="/sectors"             element={<Sectors />} />
          <Route path="/top-performers"      element={<TopPerformers />} />
          <Route path="/economic-calendar"   element={<EconomicCalendar />} />
          <Route path="/energy"              element={<Energy />} />
          <Route path="/labor"               element={<Labor />} />
          <Route path="/watchlist"           element={<Watchlist />} />
          <Route path="/market-breadth"      element={<MarketBreadth />} />
          <Route path="/life-insurance"      element={<LifeInsurance />} />
          <Route path="/WealthCounsel"       element={<WealthCounsel />} />
          <Route path="/consumer"            element={<Consumer />} />
          <Route path="/education"           element={<Education />} />
          <Route path="/education/:topicId"  element={<EducationTopic />} />
          <Route path="/brokerage-guide"     element={<BrokerageGuide />} />
          <Route path="/stock-screener"     element={<StockScreener />} />
          <Route path="/crypto"             element={<CryptoDashboard />} />
          <Route path="/market-news"        element={<MarketNews />} />
          <Route path="/real-estate"        element={<RealEstate />} />
          <Route path="/insider-trading"    element={<InsiderTrading />} />
          <Route path="/net-worth"          element={<NetWorthTracker />} />
          <Route path="/tax-planning"       element={<TaxPlanning />} />
          <Route path="/social-security"    element={<SocialSecurity />} />
          <Route path="*"                    element={<PageNotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

/* ─── App ────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AppProvider>
              <AppRoutes />
            </AppProvider>
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
