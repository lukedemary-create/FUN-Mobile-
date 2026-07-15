import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy, useState } from 'react'
import MobileLayout from './mobile/MobileLayout'
import { C } from './mobile/tokens'
import { userKey } from './mobile/utils/auth'

const LoginScreen = lazy(() => import('./mobile/screens/auth/LoginScreen'))

const Loader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', background: C.bg }}>
    <div style={{ width: 28, height: 28, border: `2px solid ${C.b1}`, borderTopColor: C.indigo, borderRadius: '50%', animation: 'tSpin 0.7s linear infinite' }} />
    <style>{`@keyframes tSpin { to { transform: rotate(360deg); } }`}</style>
  </div>
)

// ── Home + You + AI ───────────────────────────────────────────────────
const FunHome            = lazy(() => import('./mobile/screens/fun/FunHome'))
const FunYou             = lazy(() => import('./mobile/screens/fun/FunYou'))
const MHealthAssessment  = lazy(() => import('./mobile/screens/fun/MHealthAssessment'))
const MPlonoraAI         = lazy(() => import('./mobile/screens/more/MPlonoraAI'))

// ── Wealth Counsel ────────────────────────────────────────────────────
const MWealthCounsel     = lazy(() => import('./mobile/screens/more/MWealthCounsel'))
const MMatchMe           = lazy(() => import('./mobile/screens/more/MMatchMe'))
const MPrepHub           = lazy(() => import('./mobile/screens/more/MPrepHub'))
const MAdvisorProfile    = lazy(() => import('./mobile/screens/more/MAdvisorProfile'))

// ── Learn hub + education modules ─────────────────────────────────────
const FunLearn           = lazy(() => import('./mobile/screens/fun/FunLearn'))
const MBudgeting         = lazy(() => import('./mobile/screens/learn/MBudgeting'))
const MDebtCredit        = lazy(() => import('./mobile/screens/learn/MDebtCredit'))
const MInvesting         = lazy(() => import('./mobile/screens/learn/MInvesting'))
const MPortfolio         = lazy(() => import('./mobile/screens/learn/MPortfolio'))
const MInsurance         = lazy(() => import('./mobile/screens/learn/MInsurance'))
const MEstate            = lazy(() => import('./mobile/screens/learn/MEstate'))
const MRetirement        = lazy(() => import('./mobile/screens/learn/MRetirement'))
const MMajorPurchases    = lazy(() => import('./mobile/screens/learn/MMajorPurchases'))
const MBuyRentLease      = lazy(() => import('./mobile/screens/learn/MBuyRentLease'))
const MLifeEvents        = lazy(() => import('./mobile/screens/learn/MLifeEvents'))
const MTaxFun            = lazy(() => import('./mobile/screens/learn/MTaxFun'))
const MResources         = lazy(() => import('./mobile/screens/learn/MResources'))

// ── Plan hub + planning tools ──────────────────────────────────────────
const FunPlan            = lazy(() => import('./mobile/screens/fun/FunPlan'))
const MBudgetPlanner     = lazy(() => import('./mobile/screens/planning/MBudgetPlanner'))
const MNetWorth          = lazy(() => import('./mobile/screens/planning/MNetWorth'))
const MRetirementPlanning= lazy(() => import('./mobile/screens/planning/MRetirementPlanning'))
const MTaxPlanning       = lazy(() => import('./mobile/screens/planning/MTaxPlanning'))
const MLifeInsurance     = lazy(() => import('./mobile/screens/planning/MLifeInsurance'))
const MSocialSecurity    = lazy(() => import('./mobile/screens/planning/MSocialSecurity'))
const MRealEstatePlanning= lazy(() => import('./mobile/screens/planning/MRealEstatePlanning'))
const MFamilyPlanning    = lazy(() => import('./mobile/screens/planning/MFamilyPlanning'))
const MEstatePlanning    = lazy(() => import('./mobile/screens/planning/MEstatePlanning'))
const MCalculators       = lazy(() => import('./mobile/screens/planning/MCalculators'))

/* ── HomeGuard re-evaluates localStorage on every render ─── */
function HomeGuard() {
  return !localStorage.getItem(userKey('fun-onboarding-v1'))
    ? <Navigate to="/assessment" replace />
    : <FunHome />
}

export default function App() {
  const [hasAuth, setHasAuth] = useState(() => !!localStorage.getItem('planora_auth_v1'))

  if (!hasAuth) {
    return (
      <Suspense fallback={<Loader />}>
        <LoginScreen onComplete={() => setHasAuth(true)} />
      </Suspense>
    )
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route element={<MobileLayout />}>

            {/* ── Home — guard re-evaluates on every navigation */}
            <Route path="/" element={<HomeGuard />} />

            {/* ── Learn */}
            <Route path="/learn"                  element={<FunLearn />} />
            <Route path="/learn/budgeting"        element={<MBudgeting />} />
            <Route path="/learn/debt"             element={<MDebtCredit />} />
            <Route path="/learn/investing"        element={<MInvesting />} />
            <Route path="/learn/portfolio"        element={<MPortfolio />} />
            <Route path="/learn/insurance"        element={<MInsurance />} />
            <Route path="/learn/estate"           element={<MEstate />} />
            <Route path="/learn/retirement"       element={<MRetirement />} />
            <Route path="/learn/purchases"        element={<MMajorPurchases />} />
            <Route path="/learn/buy-rent-lease"   element={<MBuyRentLease />} />
            <Route path="/learn/life-events"      element={<MLifeEvents />} />
            <Route path="/learn/tax"              element={<MTaxFun />} />
            <Route path="/learn/resources"        element={<MResources />} />

            {/* ── Plan */}
            <Route path="/plan"                   element={<FunPlan />} />
            <Route path="/plan/budget"            element={<MBudgetPlanner />} />
            <Route path="/plan/networth"          element={<MNetWorth />} />
            <Route path="/plan/retirement"        element={<MRetirementPlanning />} />
            <Route path="/plan/tax"               element={<MTaxPlanning />} />
            <Route path="/plan/insurance"         element={<MLifeInsurance />} />
            <Route path="/plan/social-security"   element={<MSocialSecurity />} />
            <Route path="/plan/real-estate"       element={<MRealEstatePlanning />} />
            <Route path="/plan/family"            element={<MFamilyPlanning />} />
            <Route path="/plan/estate"            element={<MEstatePlanning />} />
            <Route path="/plan/calculators"       element={<MCalculators />} />
            <Route path="/plan/buy-rent-lease"    element={<MBuyRentLease />} />
            <Route path="/plan/purchases"         element={<MMajorPurchases />} />

            {/* ── AI */}
            <Route path="/ai" element={<MPlonoraAI />} />

            {/* ── Assessment */}
            <Route path="/assessment" element={<MHealthAssessment />} />

            {/* ── Wealth Counsel */}
            <Route path="/wealth-counsel"              element={<MWealthCounsel />} />
            <Route path="/wealth-counsel/match"        element={<MMatchMe />} />
            <Route path="/wealth-counsel/prep"         element={<MPrepHub />} />
            <Route path="/wealth-counsel/advisor/:id"  element={<MAdvisorProfile />} />

            {/* ── You */}
            <Route path="/you" element={<FunYou />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
