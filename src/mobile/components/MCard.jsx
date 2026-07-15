import { C, UI, DISPLAY, MONO } from '../tokens'

// Base card
export function MCard({ children, style, onPress }) {
  return (
    <div
      onClick={onPress}
      style={{
        background: C.surf,
        border: `1px solid ${C.b2}`,
        borderRadius: 16,
        padding: '16px',
        marginBottom: 10,
        cursor: onPress ? 'pointer' : 'default',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// Navigation list item (arrow right)
export function MNavItem({ icon: Icon, label, sub, accent, onPress }) {
  return (
    <button
      onClick={onPress}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 16px',
        background: 'none',
        border: 'none',
        borderBottom: `1px solid ${C.b1}`,
        cursor: 'pointer',
        textAlign: 'left',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {Icon && (
        <span style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: accent ? accent + '18' : C.raise,
          border: `1px solid ${accent ? accent + '30' : C.b2}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={16} color={accent || C.t2} />
        </span>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: UI, fontSize: 14, fontWeight: 600, color: C.t1 }}>{label}</div>
        {sub && <div style={{ fontFamily: UI, fontSize: 12, color: C.t3, marginTop: 1 }}>{sub}</div>}
      </div>
      <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
        <path d="M1 1l5 5-5 5" stroke={C.t3} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}

// Stat card (number + label)
export function MStatCard({ value, label, change, changeDir, accent, mono }) {
  const isUp = changeDir === 'up'
  const isDown = changeDir === 'down'
  return (
    <div style={{
      background: C.raise,
      border: `1px solid ${C.b2}`,
      borderRadius: 12,
      padding: '12px 14px',
      flex: 1,
    }}>
      <div style={{
        fontFamily: DISPLAY,
        fontSize: 20,
        fontWeight: 700,
        color: accent || C.t1,
        lineHeight: 1.1,
        fontFamily: mono ? MONO : DISPLAY,
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: UI,
        fontSize: 11,
        color: C.t3,
        marginTop: 3,
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}>
        {label}
      </div>
      {change && (
        <div style={{
          fontFamily: MONO,
          fontSize: 11,
          fontWeight: 700,
          color: isUp ? C.up : isDown ? C.down : C.t2,
          marginTop: 4,
        }}>
          {change}
        </div>
      )}
    </div>
  )
}

// Section header
export function MSectionHeader({ label, action, onAction }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 16px 8px',
    }}>
      <span style={{
        fontFamily: UI,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: C.t3,
      }}>
        {label}
      </span>
      {action && (
        <button
          onClick={onAction}
          style={{
            fontFamily: UI,
            fontSize: 12,
            fontWeight: 600,
            color: C.gold,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          {action}
        </button>
      )}
    </div>
  )
}

// Badge
export function MBadge({ children, color = C.gold }) {
  return (
    <span style={{
      fontFamily: UI,
      fontSize: 10,
      fontWeight: 700,
      color,
      background: color + '18',
      border: `1px solid ${color}30`,
      borderRadius: 6,
      padding: '2px 7px',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
    }}>
      {children}
    </span>
  )
}

// Loader
export function MLoader({ accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 0' }}>
      <div style={{
        width: 24,
        height: 24,
        border: `2px solid ${C.b2}`,
        borderTopColor: accent || C.gold,
        borderRadius: '50%',
        animation: 'mSpin 0.7s linear infinite',
      }} />
      <style>{`@keyframes mSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// Primary button
export function MPrimaryBtn({ children, onClick, color, fullWidth, small }) {
  const bg = color || C.gold
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        background: bg,
        color: bg === C.gold ? '#1a1410' : C.t1,
        fontFamily: UI,
        fontSize: small ? 13 : 14,
        fontWeight: 700,
        border: 'none',
        borderRadius: small ? 8 : 10,
        padding: small ? '8px 16px' : '13px 20px',
        cursor: 'pointer',
        width: fullWidth ? '100%' : 'auto',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {children}
    </button>
  )
}

// Secondary/outline button
export function MOutlineBtn({ children, onClick, color, fullWidth }) {
  const c = color || C.gold
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        background: 'transparent',
        color: c,
        fontFamily: UI,
        fontSize: 14,
        fontWeight: 600,
        border: `1px solid ${c}50`,
        borderRadius: 10,
        padding: '12px 20px',
        cursor: 'pointer',
        width: fullWidth ? '100%' : 'auto',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {children}
    </button>
  )
}

// Input field
export function MInput({ label: lbl, value, onChange, type = 'text', placeholder, prefix, suffix }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {lbl && (
        <div style={{
          fontFamily: UI,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: C.t3,
          marginBottom: 6,
        }}>
          {lbl}
        </div>
      )}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: C.bg,
        border: `1px solid ${C.b2}`,
        borderRadius: 10,
        padding: '0 12px',
      }}>
        {prefix && <span style={{ fontFamily: UI, fontSize: 14, color: C.t3, marginRight: 6 }}>{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            fontFamily: UI,
            fontSize: 15,
            color: C.t1,
            padding: '11px 0',
          }}
        />
        {suffix && <span style={{ fontFamily: UI, fontSize: 14, color: C.t3, marginLeft: 6 }}>{suffix}</span>}
      </div>
    </div>
  )
}

// Result value display
export function MResultRow({ label: lbl, value, highlight, accent, mono }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: `1px solid ${C.b1}`,
    }}>
      <span style={{ fontFamily: UI, fontSize: 13, color: C.t2 }}>{lbl}</span>
      <span style={{
        fontFamily: mono ? MONO : UI,
        fontSize: highlight ? 16 : 14,
        fontWeight: highlight ? 700 : 600,
        color: highlight ? (accent || C.gold) : C.t1,
      }}>
        {value}
      </span>
    </div>
  )
}
