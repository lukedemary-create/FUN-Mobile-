import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { C, UI, DISPLAY } from '../tokens'

// Section home screens — back button not needed
const SECTION_ROOTS = ['/', '/learn', '/plan', '/you']

export default function ScreenHeader({ title, subtitle, accent, right }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isRoot = SECTION_ROOTS.some(r => pathname === r)

  return (
    <div style={{
      padding: '14px 16px 12px',
      borderBottom: `1px solid ${C.b2}`,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    }}>
      {!isRoot && (
        <button
          onClick={() => navigate(-1)}
          style={{
            width: 34, height: 34, borderRadius: 9,
            background: C.raise, border: `1px solid ${C.b2}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, cursor: 'pointer',
          }}
        >
          <ChevronLeft size={17} color={C.t2} />
        </button>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        {subtitle && (
          <div style={{
            fontFamily: UI, fontSize: 9, fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: accent || C.gold, marginBottom: 2,
          }}>
            {subtitle}
          </div>
        )}
        <div style={{
          fontFamily: DISPLAY,
          fontSize: isRoot ? 20 : 16,
          fontWeight: 700, color: C.t1, lineHeight: 1.15,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {title}
        </div>
      </div>

      {right && right}
    </div>
  )
}
