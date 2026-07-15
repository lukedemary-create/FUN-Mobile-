import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { C, UI, MONO, DISPLAY } from '../../tokens'
import {
  Wallet, CreditCard, LineChart, PieChart,
  HeartHandshake, Compass, ChevronRight, Bookmark, BookmarkCheck,
} from 'lucide-react'
import useUserLS from '../../hooks/useUserLS'

const TOPICS = [
  { path: '/learn/budgeting',   Icon: Wallet,         label: 'Budgeting & Foundations', desc: 'Cash flow, emergency funds, the 50/30/20 rule, and building your financial base.',                      tint: C.butterBg    },
  { path: '/learn/debt',        Icon: CreditCard,     label: 'Debt & Credit',           desc: 'Credit scores, debt payoff strategies, interest rates, and smart borrowing habits.',                     tint: C.skyBg       },
  { path: '/learn/investing',   Icon: LineChart,      label: 'Investing & Accounts',    desc: 'Compound interest, index funds, brokerage accounts, dollar-cost averaging, and more.',                  tint: C.sageBg      },
  { path: '/learn/portfolio',   Icon: PieChart,       label: 'Portfolio Structure',     desc: 'Asset allocation, diversification, rebalancing, and building a long-term portfolio.',                   tint: C.tangerineBg },
  { path: '/learn/life-events', Icon: HeartHandshake, label: 'Life Events',             desc: 'Financial planning for marriage, children, job changes, divorce, and major transitions.',               tint: C.plumBg      },
  { path: '/learn/resources',   Icon: Compass,        label: 'Resource Directory',      desc: 'Curated tools, calculators, government links, and trusted third-party resources.',                      tint: C.butterBg    },
]

const CHIPS = ['All', 'In Progress', 'Bookmarked', 'Not Started']

function ChipRow({ active, setActive }) {
  return (
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
      {CHIPS.map((c, i) => (
        <button
          key={c}
          onClick={() => setActive(i)}
          style={{
            flexShrink: 0,
            padding: '7px 16px',
            borderRadius: 100,
            fontFamily: UI, fontSize: 12.5, fontWeight: 600,
            background: active === i ? C.ink : C.surf,
            color: active === i ? C.cream : C.t2,
            border: `1px solid ${active === i ? C.ink : C.b1}`,
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {c}
        </button>
      ))}
    </div>
  )
}

function TopicCard({ topic, index, visited, bookmarked, onBookmark, onClick }) {
  const { Icon, label, desc, tint } = topic
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'stretch', gap: 12,
        background: C.surf,
        border: `1px solid ${C.b1}`,
        borderRadius: 24, padding: '12px',
        cursor: 'pointer', textAlign: 'left', width: '100%',
        boxShadow: '0 1px 6px rgba(28,21,16,0.05)',
        WebkitTapHighlightColor: 'transparent',
        position: 'relative',
      }}
    >
      {/* Colored icon panel */}
      <div style={{
        width: 88, borderRadius: 16,
        background: tint,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, minHeight: 90,
      }}>
        <Icon size={26} color={C.t1} strokeWidth={1.8} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '4px 4px 4px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.t3 }}>
            Topic {String(index).padStart(2, '0')}
          </div>
          {visited && (
            <span style={{ fontFamily: UI, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.tangerine, background: 'rgba(232,120,60,0.12)', border: '1px solid rgba(232,120,60,0.22)', borderRadius: 20, padding: '1px 6px' }}>
              In Progress
            </span>
          )}
        </div>
        <div style={{ fontFamily: DISPLAY, fontSize: 15.5, fontWeight: 600, color: C.t1, lineHeight: 1.25 }}>
          {label}
        </div>
        <div style={{ fontFamily: UI, fontSize: 12, color: C.t3, lineHeight: 1.5 }}>
          {desc}
        </div>
      </div>

      {/* Right col: bookmark + chevron */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', paddingRight: 2, flexShrink: 0 }}>
        <button
          onClick={e => { e.stopPropagation(); onBookmark() }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, WebkitTapHighlightColor: 'transparent' }}
        >
          {bookmarked
            ? <BookmarkCheck size={17} color={C.indigo} strokeWidth={2} />
            : <Bookmark size={17} color={C.t3} strokeWidth={1.6} />}
        </button>
        <ChevronRight size={16} color={C.t3} />
      </div>
    </button>
  )
}

export default function FunLearn() {
  const navigate = useNavigate()
  const [chip, setChip] = useState(0)
  const [visited,    setVisited]    = useUserLS('fun_visited_v1',    {})
  const [bookmarks,  setBookmarks]  = useUserLS('fun_bookmarks_v1',  {})

  const toggleBookmark = path => {
    setBookmarks(prev => ({ ...prev, [path]: !prev[path] }))
  }

  const markVisited = path => {
    setVisited(prev => ({ ...prev, [path]: true }))
  }

  const filtered = useMemo(() => {
    if (chip === 0) return TOPICS
    if (chip === 1) return TOPICS.filter(t => visited[t.path])
    if (chip === 2) return TOPICS.filter(t => bookmarks[t.path])
    if (chip === 3) return TOPICS.filter(t => !visited[t.path])
    return TOPICS
  }, [chip, visited, bookmarks])

  return (
    <div style={{ background: C.bg, minHeight: '100dvh' }}>

      {/* ── Top bar ──────────────────────────────────────────── */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '52px 20px 16px',
        borderBottom: `1px solid ${C.b1}`,
        background: 'rgba(250,246,237,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        position: 'sticky', top: 0, zIndex: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/fun-logo.png" alt="FUN logo" style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover', objectPosition: 'center' }} />
          <div>
            <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.t3 }}>Financial Understanding Network</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 20, fontWeight: 600, color: C.t1, lineHeight: 1.1 }}>Learn</div>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 16px 0' }}>

        {/* ── Curriculum card ──────────────────────────────────── */}
        <div style={{
          background: C.surf,
          border: `1px solid ${C.b1}`,
          borderRadius: 24, padding: '20px',
          boxShadow: '0 1px 6px rgba(28,21,16,0.05)',
        }}>
          <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.t3, marginBottom: 4 }}>
            Curriculum
          </div>
          <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 600, color: C.t1, lineHeight: 1.2, marginBottom: 8 }}>
            Six topics. Every fundamental you need.
          </div>
          <div style={{ fontFamily: UI, fontSize: 12, color: C.t3, lineHeight: 1.6 }}>
            Bookmark topics to save them. Tap any section to start exploring.
          </div>
        </div>

        {/* ── Filter chips ──────────────────────────────────────── */}
        <ChipRow active={chip} setActive={setChip} />

        {/* ── Empty state ───────────────────────────────────────── */}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: C.t3, fontFamily: UI, fontSize: 13, lineHeight: 1.6 }}>
            {chip === 1 && 'No topics started yet.\nTap any topic below to begin.'}
            {chip === 2 && 'No bookmarks yet.\nTap the bookmark icon on any topic to save it.'}
            {chip === 3 && 'You\'ve visited all topics — great work!'}
          </div>
        )}

        {/* ── Topic list ────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 24 }}>
          {filtered.map((topic, i) => (
            <TopicCard
              key={topic.path}
              topic={topic}
              index={TOPICS.indexOf(topic) + 1}
              visited={!!visited[topic.path]}
              bookmarked={!!bookmarks[topic.path]}
              onBookmark={() => toggleBookmark(topic.path)}
              onClick={() => { markVisited(topic.path); navigate(topic.path) }}
            />
          ))}
        </div>

      </div>
    </div>
  )
}
