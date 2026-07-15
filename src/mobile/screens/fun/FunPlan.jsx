import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { C, UI, DISPLAY } from '../../tokens'
import {
  Umbrella, Landmark, Receipt, ScrollText,
  ShoppingBag, KeyRound, Baby, ArrowUpRight, Sparkles,
} from 'lucide-react'

const TOOLS = [
  { path: '/plan/insurance',       Icon: Umbrella,    label: 'Insurance Planning', desc: 'Cover what matters, skip what doesn\'t.', tint: C.skyBg      },
  { path: '/plan/retirement',      Icon: Landmark,    label: 'Retirement Planning', desc: 'Map the runway to future you.',          tint: C.sageBg     },
  { path: '/plan/tax',             Icon: Receipt,     label: 'Tax Planning',        desc: 'Keep more of what you make.',            tint: C.butterBg   },
  { path: '/plan/estate',          Icon: ScrollText,  label: 'Estate & Wills',      desc: 'Peace of mind, written down.',           tint: C.plumBg     },
  { path: '/plan/purchases',       Icon: ShoppingBag, label: 'Major Purchases',     desc: 'Big buys, calmly decided.',              tint: C.tangerineBg},
  { path: '/plan/buy-rent-lease',  Icon: KeyRound,    label: 'Buy, Rent or Lease',  desc: 'Run the math before you sign.',         tint: C.skyBg      },
  { path: '/plan/family',          Icon: Baby,        label: 'Family Planning',     desc: 'Money conversations, made easier.',      tint: C.sageBg     },
]

const CHIPS = ['All', 'Recommended', 'Short (5m)', 'Deep dive']

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

function PlanCard({ tool, onClick }) {
  const { Icon, label, desc, tint } = tool
  return (
    <button
      onClick={onClick}
      style={{
        background: tint,
        borderRadius: 24, padding: '16px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        minHeight: 150, textAlign: 'left',
        cursor: 'pointer', border: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 14,
          background: 'rgba(255,255,255,0.65)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={19} color={C.t1} strokeWidth={1.8} />
        </div>
        <ArrowUpRight size={15} color={C.t3} />
      </div>
      <div style={{ marginTop: 16 }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 15, fontWeight: 600, color: C.t1, lineHeight: 1.25, marginBottom: 4 }}>
          {label}
        </div>
        <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, lineHeight: 1.4 }}>
          {desc}
        </div>
      </div>
    </button>
  )
}

export default function FunPlan() {
  const navigate = useNavigate()
  const [chip, setChip] = useState(0)

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
            <div style={{ fontFamily: DISPLAY, fontSize: 20, fontWeight: 600, color: C.t1, lineHeight: 1.1 }}>Plan</div>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 16px 0' }}>

        {/* ── Hero card ─────────────────────────────────────────── */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          background: C.sageBg,
          borderRadius: 24, padding: '20px',
        }}>
          <div style={{
            position: 'absolute', top: -24, right: -24,
            width: 128, height: 128, borderRadius: '50%',
            background: C.butterBg,
            filter: 'blur(32px)', pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.t3, marginBottom: 4 }}>
              Planning
            </div>
            <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 600, color: C.t1, lineHeight: 1.2, marginBottom: 6 }}>
              Turn what you know into a real plan.
            </div>
            <div style={{ fontFamily: UI, fontSize: 13, color: C.t2, lineHeight: 1.5 }}>
              Seven guided tools that walk you decision by decision.
            </div>
          </div>
        </div>

        {/* ── Filter chips ──────────────────────────────────────── */}
        <ChipRow active={chip} setActive={setChip} />

        {/* ── Tool grid ─────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {TOOLS.map(tool => (
            <PlanCard key={tool.path} tool={tool} onClick={() => navigate(tool.path)} />
          ))}
        </div>

        {/* ── Assessment CTA ────────────────────────────────────── */}
        <div style={{
          background: C.surf,
          border: `1.5px dashed ${C.b2}`,
          borderRadius: 24, padding: '20px',
          marginBottom: 8,
        }}>
          <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.t3, marginBottom: 4 }}>
            Your Assessment
          </div>
          <div style={{ fontFamily: DISPLAY, fontSize: 20, fontWeight: 600, color: C.t1, lineHeight: 1.2, marginBottom: 6 }}>
            Rebuild your Financial Health Report
          </div>
          <div style={{ fontFamily: UI, fontSize: 13, color: C.t3, lineHeight: 1.5, marginBottom: 16 }}>
            Answer a few questions and we'll refresh your focus areas.
          </div>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: C.ink, borderRadius: 100,
              padding: '10px 18px', border: 'none', cursor: 'pointer',
            }}
          >
            <Sparkles size={14} color="#fff" />
            <span style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: '#fff' }}>Start assessment</span>
            <ArrowUpRight size={14} color="#fff" />
          </button>
        </div>

      </div>
    </div>
  )
}
