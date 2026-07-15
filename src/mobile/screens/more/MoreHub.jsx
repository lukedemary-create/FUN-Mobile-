import { useNavigate } from 'react-router-dom'
import {
  Bot, FileBarChart2, Lightbulb, Calculator, Building2,
  Settings, ChevronRight, Rss,
} from 'lucide-react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MSectionHeader } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'

const ASSISTANTS = [
  { path: '/more/ai',       Icon: Bot,           label: 'Planora AI',         sub: 'AI financial assistant',           color: C.indigo, dim: C.indigoDim, bdr: C.indigoBdr },
  { path: '/more/reports',  Icon: FileBarChart2, label: 'Financial Reports',  sub: 'Snapshot reports & summaries',     color: C.teal,   dim: C.tealDim,   bdr: C.tealBdr   },
  { path: '/more/insights', Icon: Lightbulb,     label: 'Insights',           sub: 'Featured market & planning ideas', color: C.gold,   dim: C.goldDim,   bdr: C.goldBdr   },
]

const LIBRARY = [
  { path: '/more/feed',      Icon: Rss,          label: 'The Feed',           sub: 'Curated financial insights'        },
  { path: '/more/calculators',Icon: Calculator,  label: 'Calculators',        sub: '35+ financial calculators'         },
  { path: '/more/brokerage', Icon: Building2,    label: 'Brokerage Guide',    sub: 'Compare major brokerages'          },
]

const ACCOUNT = [
  { path: '/more/settings',  Icon: Settings,     label: 'Settings',           sub: 'App preferences & account'         },
]

export default function MoreHub() {
  const nav = useNavigate()

  return (
    <div style={{ background: C.bg, minHeight: '100dvh', paddingBottom: 80 }}>
      <ScreenHeader title="More" subtitle="Planora" accent={C.t2} />

      {/* Planora identity card */}
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{
          background: `linear-gradient(135deg, rgba(201,169,110,0.12) 0%, rgba(0,180,198,0.08) 50%, rgba(129,140,248,0.06) 100%)`,
          border: `1px solid ${C.b2}`,
          borderRadius: 18,
          padding: '18px',
        }}>
          <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 700, color: C.t1, marginBottom: 4 }}>Planora</div>
          <div style={{ fontFamily: UI, fontSize: 12, color: C.t2, marginBottom: 14 }}>Institutional Intelligence. Personal Impact.</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[['Terminal', C.gold], ['Wealth Counsel', C.teal], ['FUN', C.indigo], ['Business', C.amber]].map(([l, c]) => (
              <div key={l} style={{
                flex: 1, textAlign: 'center',
                background: `${c}12`, border: `1px solid ${c}30`,
                borderRadius: 8, padding: '6px 2px',
              }}>
                <div style={{ fontFamily: UI, fontSize: 9, fontWeight: 700, color: c, lineHeight: 1.3 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assistants — 2×2 + 1 grid */}
      <MSectionHeader label="Assistants" />
      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {ASSISTANTS.map(({ path, Icon, label, sub, color, dim, bdr }) => (
          <div
            key={path}
            onClick={() => nav(path)}
            style={{ background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 16, padding: '16px 14px', cursor: 'pointer' }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: dim, border: `1px solid ${bdr}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
            }}>
              <Icon size={17} color={color} />
            </div>
            <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 700, color: C.t1, marginBottom: 3 }}>{label}</div>
            <div style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Library & Tools */}
      <MSectionHeader label="Library & Tools" />
      <div style={{ padding: '0 16px' }}>
        <div style={{ background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 16, overflow: 'hidden' }}>
          {LIBRARY.map(({ path, Icon, label, sub }, i) => (
            <div
              key={path}
              onClick={() => nav(path)}
              style={{
                display: 'flex', alignItems: 'center', padding: '13px 16px',
                borderBottom: i < LIBRARY.length - 1 ? `1px solid ${C.b1}` : 'none',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: C.goldDim, border: `1px solid ${C.goldBdr}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, flexShrink: 0,
              }}>
                <Icon size={14} color={C.gold} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 600, color: C.t1 }}>{label}</div>
                <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, marginTop: 1 }}>{sub}</div>
              </div>
              <ChevronRight size={15} color={C.t3} />
            </div>
          ))}
        </div>
      </div>

      {/* Account */}
      <MSectionHeader label="Account" />
      <div style={{ padding: '0 16px' }}>
        <div style={{ background: C.surf, border: `1px solid ${C.b2}`, borderRadius: 16, overflow: 'hidden' }}>
          {ACCOUNT.map(({ path, Icon, label, sub }, i) => (
            <div
              key={path}
              onClick={() => nav(path)}
              style={{
                display: 'flex', alignItems: 'center', padding: '13px 16px',
                borderBottom: i < ACCOUNT.length - 1 ? `1px solid ${C.b1}` : 'none',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: C.raise, border: `1px solid ${C.b2}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, flexShrink: 0,
              }}>
                <Icon size={14} color={C.t2} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 600, color: C.t1 }}>{label}</div>
                <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, marginTop: 1 }}>{sub}</div>
              </div>
              <ChevronRight size={15} color={C.t3} />
            </div>
          ))}
        </div>
      </div>

      {/* Version */}
      <div style={{ padding: '20px 16px 24px', textAlign: 'center' }}>
        <div style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>Planora Mobile v1.0 · Beta</div>
        <div style={{ fontFamily: UI, fontSize: 10, color: C.t3, marginTop: 3, opacity: 0.6 }}>All data for informational purposes only</div>
      </div>
    </div>
  )
}
