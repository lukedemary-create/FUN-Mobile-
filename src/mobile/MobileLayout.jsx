import { useState, useRef, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Home, BookOpen, Target, User, Sparkles, X, Send, ArrowUpRight } from 'lucide-react'
import { C, UI } from './tokens'

const PILL_H      = 64
const PILL_BOTTOM = 20
const CONTENT_PAD = PILL_H + PILL_BOTTOM + 16

const TABS = [
  { path: '/',      label: 'Home',  Icon: Home,     match: p => p === '/' },
  { path: '/learn', label: 'Learn', Icon: BookOpen,  match: p => p === '/learn' || p.startsWith('/learn/') },
  { path: '/ai',    label: 'AI',    Icon: Sparkles,  match: p => p === '/ai',    accent: C.indigo },
  { path: '/plan',  label: 'Plan',  Icon: Target,    match: p => p === '/plan'  || p.startsWith('/plan/')  },
  { path: '/you',   label: 'You',   Icon: User,      match: p => p === '/you'   || p.startsWith('/you/')   },
]

/* ── Route knowledge base ────────────────────────────────────── */
const ROUTES = [
  // ── Equity Compensation (highest priority — very specific)
  { keywords: ['rsu','rsus','restricted stock unit','restricted stock','rsu tax','rsu vesting','rsu sale','rsu withholding','espp','employee stock purchase','iso','nso','incentive stock option','non qualified option','equity compensation','stock vesting','vesting schedule','stock options','409a','83b election','sell to cover','supplemental withholding rate','equity income','company stock','grant date','vest date','how are rsus taxed','what is an rsu','what are rsus','sell my rsu','rsu sell','espp discount','exercising options','option exercise'], path: '/learn/tax', label: 'Equity Compensation — RSUs, ESPP & Options', state: { mainTab: 'learn', learnSub: 'equity' } },

  // ── Learn: Budgeting
  { keywords: ['budget','budgeting','50/30/20','cash flow','track expenses','sinking fund','savings rate','zero based','envelope method','where does my money go','how do i budget','how to budget','monthly budget','spending categories','how to save money','overspending','how much should i spend','needs wants savings'], path: '/learn/budgeting', label: 'Budgeting & Foundations' },

  // ── Learn: Emergency Fund
  { keywords: ['emergency fund','rainy day fund','3 months expenses','6 months expenses','how much emergency fund','where to keep emergency fund','hysa','high yield savings','liquid savings'], path: '/learn/budgeting', label: 'Budgeting & Foundations' },

  // ── Learn: Debt & Credit
  { keywords: ['debt','credit score','credit card debt','avalanche method','snowball method','pay off debt','credit utilization','fico score','apr','interest rate','balance transfer','how to improve credit','how to pay off debt','student loan','personal loan','debt payoff','minimum payment','how does credit work','what is apr','what is a credit score'], path: '/learn/debt', label: 'Debt & Credit' },

  // ── Learn: Investing
  { keywords: ['invest','investing','how to invest','start investing','index fund','etf','s&p 500','sp500','vti','vxus','bnd','brokerage account','vanguard','fidelity','schwab','dollar cost averaging','dca','compound interest','stock market','shares','dividend','mutual fund','what is an etf','what is an index fund','how do i start investing','robinhood','what should i invest in'], path: '/learn/investing', label: 'Investing & Accounts' },

  // ── Learn: Portfolio
  { keywords: ['portfolio','asset allocation','rebalance','asset class','bonds','equities','60/40','diversification','diversify','risk tolerance','growth portfolio','conservative portfolio','three fund','aggressive portfolio','how to build a portfolio','what should my portfolio look like'], path: '/learn/portfolio', label: 'Portfolio Structure' },

  // ── Learn: Insurance
  { keywords: ['insurance','life insurance','health insurance','disability insurance','long term disability','ltdi','coverage','insurance premium','term life','whole life','universal life','human life value','how much life insurance do i need','do i need life insurance','what type of insurance','umbrella policy','renters insurance','homeowners insurance'], path: '/learn/insurance', label: 'Insurance Basics' },

  // ── Learn: Estate
  { keywords: ['estate','will','trust','beneficiary','probate','power of attorney','executor','living will','inheritance','revocable trust','irrevocable trust','advance directive','do i need a will','what is a trust','estate planning basics','how to set up a will','who gets my money','guardianship','minor children inheritance'], path: '/learn/estate', label: 'Estate & Wills' },

  // ── Learn: Retirement
  { keywords: ['retirement','401k','401(k)','roth ira','roth 401k','traditional ira','ira','pension','fire','retire early','how to retire','what is a 401k','what is a roth ira','roth vs traditional','how much to retire','retirement savings','retirement account','compound interest retirement','when can i retire','how does retirement work','maxing out 401k','employer match'], path: '/learn/retirement', label: 'Retirement Basics' },

  // ── Learn: Major Purchases
  { keywords: ['buying a car','car loan','auto loan','buying a home','buy a house','first home','first time home buyer','down payment','fha loan','va loan','pmi','closing costs','mortgage basics','house','how much car can i afford','new car','used car','how to buy a house'], path: '/learn/purchases', label: 'Major Purchases' },

  // ── Learn: Buy Rent Lease
  { keywords: ['rent vs buy','buy or rent','lease vs buy','renting vs buying','should i rent or buy','rent or own','is it better to rent or buy','rent vs own'], path: '/learn/buy-rent-lease', label: 'Buy, Rent or Lease' },

  // ── Learn: Life Events
  { keywords: ['getting married','marriage finances','divorce finances','job loss','lost my job','layoff','new job','got a raise','having a baby','new baby','inherited money','windfall','career change','financial life event','major life change','got promoted'], path: '/learn/life-events', label: 'Life Events' },

  // ── Learn: Tax
  { keywords: ['tax','taxes','capital gains','tax loss harvesting','tax bracket','standard deduction','itemize deductions','write off','w2','w-2','1099','k-1','roth vs traditional tax','tax deferred','tax free growth','marginal tax rate','effective tax rate','how taxes work','how to lower taxes','federal income tax','state income tax','quarterly estimated tax','self employment tax'], path: '/learn/tax', label: 'Tax Fundamentals' },

  // ── Learn: Resources
  { keywords: ['resources','books about money','financial books','irs website','cfpb','finra','where to learn finance','recommended finance books','financial tools'], path: '/learn/resources', label: 'Resource Directory' },

  // ── Plan: Budget Planner
  { keywords: ['budget planner','budget tool','set up my budget','track my spending','income categories','monthly budget tool','make a budget','spending plan'], path: '/plan/budget', label: 'Budget Planner' },

  // ── Plan: Net Worth
  { keywords: ['net worth','my net worth','track net worth','assets and liabilities','balance sheet','how much am i worth','total wealth','wealth tracker','what is my net worth'], path: '/plan/networth', label: 'Net Worth Tracker' },

  // ── Plan: Retirement Planning
  { keywords: ['retirement plan','retirement calculator','retire at 55','retire at 60','retire at 65','when can i retire','4% rule','safe withdrawal','nest egg','retirement projection','how much do i need to retire','retirement number','am i on track for retirement'], path: '/plan/retirement', label: 'Retirement Planning Tool' },

  // ── Plan: Tax Planning
  { keywords: ['tax planning','tax strategy','reduce my taxes','tax optimization','withholding','estimated tax payments','quarterly taxes','minimize taxes','tax tool'], path: '/plan/tax', label: 'Tax Planning Tool' },

  // ── Plan: Life Insurance
  { keywords: ['how much life insurance do i need','life insurance calculator','term vs whole life','insurance calculator','dime method','income replacement insurance'], path: '/plan/insurance', label: 'Life Insurance Planner' },

  // ── Plan: Social Security
  { keywords: ['social security','ssa','when to take social security','social security calculator','full retirement age','fra','social security benefits','when to claim','social security strategy','spousal benefit'], path: '/plan/social-security', label: 'Social Security Planner' },

  // ── Plan: Real Estate
  { keywords: ['how much house can i afford','mortgage calculator','home affordability','real estate planning','home buying tool','house budget','property cost calculator'], path: '/plan/real-estate', label: 'Real Estate Planner' },

  // ── Plan: Family
  { keywords: ['529 plan','college savings','kids and money','childcare cost','family financial plan','having kids money','baby financial planning','dependent care','education savings'], path: '/plan/family', label: 'Family Planning Tool' },

  // ── Plan: Estate Planning
  { keywords: ['estate planning tool','will planning','trust setup','beneficiary planning','succession planning','who gets my assets'], path: '/plan/estate', label: 'Estate Planning Tool' },

  // ── Plan: Calculators
  { keywords: ['calculator','calculators','compound interest calculator','time value of money','loan amortization','calculate','run the numbers','future value calculator','present value','how much will i have','math'], path: '/plan/calculators', label: 'Financial Calculators' },

  // ── Wealth Counsel
  { keywords: ['find an advisor','find a financial advisor','wealth counsel','cfp','fiduciary','fee only advisor','financial planner','i need an advisor','talk to an advisor','connect with advisor'], path: '/wealth-counsel', label: 'Wealth Counsel' },
  { keywords: ['match me with advisor','advisor match','find my advisor','match advisor'], path: '/wealth-counsel/match', label: 'Advisor Match' },
  { keywords: ['prep hub','meeting prep','prepare for advisor meeting','questions for my advisor','advisor prep'], path: '/wealth-counsel/prep', label: 'Meeting Prep Hub' },

  // ── Assessment
  { keywords: ['assessment','financial health check','financial checkup','health score','take the quiz','financial quiz','how am i doing financially'], path: '/assessment', label: 'Financial Health Assessment' },

  // ── Hubs
  { keywords: ['planora ai','ai assistant','ask ai','chat ai','ai help'], path: '/ai', label: 'Planora AI' },
  { keywords: ['profile','my settings','notifications','my account'], path: '/you', label: 'Your Profile' },
  { keywords: ['learn hub','all topics','start learning','curriculum'], path: '/learn', label: 'Learn Hub' },
  { keywords: ['plan hub','all planning tools','planning hub'], path: '/plan', label: 'Planning Hub' },
  { keywords: ['home','go home','start over','main screen'], path: '/', label: 'Home' },
]

function findRoute(query) {
  const q = query.toLowerCase().trim()
  let best = null
  let bestScore = 0

  for (const route of ROUTES) {
    let score = 0
    for (const kw of route.keywords) {
      if (q.includes(kw)) score += kw.split(' ').length * 2  // weight multi-word matches higher
    }
    if (score > bestScore) { bestScore = score; best = route }
  }

  return bestScore > 0 ? best : null
}

const SUGGESTIONS = [
  'How do I start investing?',
  'What are RSUs?',
  'Build a budget',
  'Retirement planning',
  'How much life insurance?',
]

/* ── FUN Navigator floating panel ────────────────────────────── */
function FUNNavigator({ onClose }) {
  const navigate   = useNavigate()
  const [input,    setInput]    = useState('')
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! Tell me what you're looking for — try \"RSU\", \"retirement planning\", or \"how do I budget\"." },
  ])
  const [loading, setLoading] = useState(false)
  const inputRef  = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 150)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function send(q) {
    const text = q.trim()
    if (!text || loading) return
    setMessages(prev => [...prev, { role: 'user', text }])
    setInput('')
    setLoading(true)

    setTimeout(() => {
      const match = findRoute(text)
      if (match) {
        setMessages(prev => [...prev, { role: 'assistant', text: `Taking you to ${match.label}…`, nav: match }])
        setTimeout(() => { navigate(match.path, { state: match.state || {} }); onClose() }, 800)
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          text: "I'm going to direct you to the AI where I will be able to help you with this question.",
        }])
        setTimeout(() => { navigate('/ai', { state: { question: text } }); onClose() }, 1200)
      }
      setLoading(false)
    }, 350)
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
  }

  return (
    <>
      {/* Transparent hit area to close on tap outside */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 400 }} />

      {/* Floating card — dark warm palette matching website */}
      <div style={{
        position: 'fixed',
        bottom: 168,
        right: 12,
        width: '54vw',
        maxHeight: 400,
        background: '#231c16',
        border: '1px solid rgba(129,140,248,0.22)',
        borderRadius: 18,
        boxShadow: '0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(129,140,248,0.08)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 401,
        fontFamily: UI,
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 18px',
          borderBottom: '1px solid #2a2018',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#2d2419',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={13} color="#fff" strokeWidth={1.8} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f0e8d8', lineHeight: 1.2 }}>FUN Navigator</div>
              <div style={{ fontSize: 10, color: '#6b5540', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Ask me anything</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b5540', padding: 4, display: 'flex', alignItems: 'center', borderRadius: 6, WebkitTapHighlightColor: 'transparent' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '14px 14px 8px',
          display: 'flex', flexDirection: 'column', gap: 10,
          scrollbarWidth: 'none',
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role === 'assistant' ? (
                <div style={{ background: '#2d2419', border: '1px solid #2a2018', borderRadius: '12px 12px 12px 3px', padding: '9px 13px', maxWidth: '84%', fontSize: 13, color: '#a89070', lineHeight: 1.6 }}>
                  {msg.nav ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <ArrowUpRight size={13} color="#818cf8" />
                      <span>Taking you to <strong style={{ color: '#818cf8' }}>{msg.nav.label}</strong>…</span>
                    </div>
                  ) : msg.text}
                </div>
              ) : (
                <div style={{ background: '#818cf8', borderRadius: '12px 12px 3px 12px', padding: '9px 13px', maxWidth: '84%', fontSize: 13, color: '#fff', fontWeight: 600, lineHeight: 1.6 }}>
                  {msg.text}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ background: '#2d2419', border: '1px solid #2a2018', borderRadius: '12px 12px 12px 3px', padding: '10px 14px', display: 'flex', gap: 5, alignItems: 'center' }}>
                {[0, 1, 2].map(j => (
                  <div key={j} style={{ width: 5, height: 5, borderRadius: '50%', background: '#6b5540', animation: `funDot 1.2s ease-in-out ${j * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}

          {messages.length === 1 && (
            <div style={{ marginTop: 4 }}>
              <div style={{ fontSize: 10, color: '#6b5540', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 7 }}>Try asking</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    style={{ background: 'rgba(129,140,248,0.10)', border: '1px solid rgba(129,140,248,0.22)', borderRadius: 99, padding: '5px 10px', fontSize: 10.5, color: '#818cf8', cursor: 'pointer', fontFamily: UI, fontWeight: 500, WebkitTapHighlightColor: 'transparent', textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '10px 12px 14px', borderTop: '1px solid #2a2018', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Where do you want to go?"
            style={{ flex: 1, background: '#1a1410', border: '1.5px solid #3d3028', borderRadius: 10, padding: '9px 12px', fontSize: 13, color: '#f0e8d8', fontFamily: UI, outline: 'none' }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: input.trim() && !loading ? '#818cf8' : '#2d2419',
              border: `1px solid ${input.trim() && !loading ? '#818cf8' : '#2a2018'}`,
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <Send size={14} color={input.trim() && !loading ? '#fff' : '#6b5540'} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes funDot {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.85); }
          40%            { opacity: 1;   transform: scale(1.1);  }
        }
      `}</style>
    </>
  )
}

/* ── Bottom pill nav ─────────────────────────────────────────── */
function FloatingNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const activeTab = (TABS.find(t => t.match(pathname)) || TABS[0]).path

  return (
    <nav style={{
      position: 'fixed',
      bottom: PILL_BOTTOM,
      left: 16,
      right: 16,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 4,
      background: 'rgba(28,21,16,0.96)',
      borderRadius: 100,
      padding: '8px',
      paddingBottom: `calc(8px + env(safe-area-inset-bottom, 0px))`,
      boxShadow: '0 20px 40px -16px rgba(28,21,16,0.55)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
    }}>
      {TABS.map(({ path, label, Icon, accent }) => {
        const isActive = activeTab === path
        const bg     = isActive ? (accent ?? C.tangerine) : 'transparent'
        const shadow = isActive
          ? accent ? '0 4px 12px rgba(129,140,248,0.40)' : '0 4px 12px rgba(232,120,60,0.35)'
          : 'none'
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '10px 8px',
              borderRadius: 100,
              background: bg,
              border: 'none',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
              boxShadow: shadow,
            }}
          >
            <Icon size={18} color={isActive ? '#fff' : 'rgba(255,255,255,0.45)'} strokeWidth={isActive ? 2.3 : 1.8} />
            {isActive && (
              <span style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>
                {label}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}

/* ── FUN floating orb ────────────────────────────────────────── */
const ORB  = 52
const PEEK = 22

function FUNOrb() {
  const [open,    setOpen]    = useState(false)
  const [hidden,  setHidden]  = useState(false)
  const [tx,      setTx]      = useState(0)
  const [active,  setActive]  = useState(false)

  const startXRef  = useRef(null)
  const hiddenRef  = useRef(false)   // mirrors hidden without stale closure
  const currentDX  = useRef(0)       // live drag delta, no state lag
  const didTouch   = useRef(false)   // prevent onClick double-fire after touch

  const HIDE_X = ORB + 16 - PEEK    // 46

  function handleTouchStart(e) {
    startXRef.current = e.touches[0].clientX
    currentDX.current = 0
    didTouch.current  = false
    setActive(true)
  }

  function handleTouchMove(e) {
    if (startXRef.current === null) return
    const dx = e.touches[0].clientX - startXRef.current
    currentDX.current = dx
    const clamped = hiddenRef.current ? Math.min(0, dx) : Math.max(0, dx)
    setTx(hiddenRef.current ? HIDE_X + clamped : clamped)
  }

  function handleTouchEnd(e) {
    e.preventDefault()              // prevent ghost click on iOS
    const dx = currentDX.current
    setActive(false)
    startXRef.current = null
    currentDX.current = 0
    didTouch.current  = true

    if (!hiddenRef.current && dx > 48) {
      hiddenRef.current = true
      setHidden(true)
      setTx(HIDE_X)
    } else if (hiddenRef.current && dx < -48) {
      hiddenRef.current = false
      setHidden(false)
      setTx(0)
    } else {
      setTx(hiddenRef.current ? HIDE_X : 0)
      if (Math.abs(dx) < 10 && !hiddenRef.current) {
        setOpen(true)
      }
    }
  }

  function handleClick() {
    if (didTouch.current) { didTouch.current = false; return }
    if (!hidden) setOpen(true)
  }

  return (
    <>
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        style={{
          position: 'fixed',
          right: 16,
          bottom: 102,
          zIndex: 200,
          width: ORB,
          height: ORB,
          borderRadius: '50%',
          background: '#818cf8',
          boxShadow: '0 4px 20px rgba(129,140,248,0.45), 0 2px 8px rgba(0,0,0,0.25)',
          transform: `translateX(${tx}px)`,
          transition: active ? 'none' : 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'none',
          userSelect: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Sparkles size={20} color="#fff" strokeWidth={1.8} />
      </div>

      {open && <FUNNavigator onClose={() => setOpen(false)} />}
    </>
  )
}

/* ── Layout ──────────────────────────────────────────────────── */
export default function MobileLayout() {
  return (
    <div style={{ background: C.bg, minHeight: '100dvh' }}>
      <main style={{ paddingBottom: CONTENT_PAD, minHeight: '100dvh' }}>
        <Outlet />
      </main>
      <FloatingNav />
      <FUNOrb />
    </div>
  )
}
