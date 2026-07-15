// FUN — Design Tokens
// Warm editorial palette inspired by Lovable design

export const C = {
  // Page & surfaces
  bg:        '#faf6ed',   // cream — warm off-white page background
  surf:      '#ffffff',   // white card surface
  raise:     '#f5f0e6',   // slightly elevated inner surface

  // Borders
  b1:        '#e8e0d4',   // light border
  b2:        '#d4c8b8',   // stronger border

  // Text
  t1:        '#1c1510',   // ink — dark warm primary text
  t2:        '#5a4a38',   // warm dark brown secondary
  t3:        '#9a8878',   // muted warm brown labels

  // Brand palette
  ink:       '#1c1510',   // near-black (hero card backgrounds)
  cream:     '#faf6ed',   // same as bg
  butter:    '#f5e6b3',   // warm yellow
  tangerine: '#e8783c',   // orange — primary action / active state
  sage:      '#7ab08a',   // muted green
  plum:      '#6b3a5c',   // dark plum
  sky:       '#7ab8d4',   // sky blue

  // Tint backgrounds (for colored cards)
  butterBg:     'rgba(245,230,179,0.80)',
  tangerineBg:  'rgba(232,120,60,0.22)',
  sageBg:       'rgba(122,176,138,0.35)',
  plumBg:       'rgba(107,58,92,0.14)',
  skyBg:        'rgba(122,184,212,0.45)',

  // Semantic
  up:      '#4a7c59',
  down:    '#c0392b',
  success: '#10b981',
  warning: '#f59e0b',
  danger:  '#ef4444',

  // Legacy accent compat
  gold:      '#c9a96e',
  teal:      '#00B4C6',
  indigo:    '#818cf8',
  indigoDim: 'rgba(129,140,248,0.10)',
}

export const DISPLAY = "'Fraunces', Georgia, serif"
export const UI      = "'Plus Jakarta Sans', system-ui, sans-serif"
export const MONO    = "'JetBrains Mono', 'Courier New', monospace"

export const BOTTOM_TAB_HEIGHT = 90

export const card = {
  background:   '#ffffff',
  border:       `1px solid #e8e0d4`,
  borderRadius: 24,
  padding:      '16px',
  marginBottom: 12,
  boxShadow:    '0 1px 6px rgba(28,21,16,0.06)',
}

export const label = {
  fontFamily:    "'Plus Jakarta Sans', system-ui, sans-serif",
  fontSize:      10,
  fontWeight:    700,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color:         '#9a8878',
}
