import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/lib/AuthContext'

const DISPLAY = "'Playfair Display', Georgia, serif"
const UI      = "'Inter', system-ui, sans-serif"
const MONO    = "'JetBrains Mono', monospace"
const EASE    = [0.32, 0.72, 0, 1]

const C = {
  bg:      '#1a1410',
  surf:    '#231c16',
  raise:   '#2d2419',
  b1:      '#2a2018',
  b2:      '#3d3028',
  gold:    '#c9a96e',
  goldDim: 'rgba(201,169,110,0.08)',
  goldBdr: 'rgba(201,169,110,0.22)',
  t1:      '#f0e8d8',
  t2:      '#a89070',
  t3:      '#6b5540',
  err:     '#c0392b',
  errDim:  'rgba(192,57,43,0.1)',
  ok:      '#4a7c59',
}


/* ── Input field ──────────────────────────────────────────────────── */
function Field({ icon: Icon, type, placeholder, value, onChange, error, right }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        background: focused ? '#271f18' : C.raise,
        border: `1px solid ${error ? C.err : focused ? C.goldBdr : C.b2}`,
        borderRadius: 10, padding: '0 14px',
        transition: 'all 0.18s ease',
      }}>
        <Icon size={15} color={focused ? C.gold : C.t3} style={{ flexShrink: 0, transition: 'color 0.18s' }} />
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{
            flex: 1, background: 'none', border: 'none', outline: 'none',
            fontFamily: UI, fontSize: 14, color: C.t1,
            padding: '13px 0',
          }}
        />
        {right}
      </div>
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
          <AlertCircle size={12} color={C.err} />
          <span style={{ fontFamily: UI, fontSize: 11, color: C.err }}>{error}</span>
        </div>
      )}
    </div>
  )
}

/* ── Login form ───────────────────────────────────────────────────── */
function LoginForm({ onSwitch }) {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from || '/'

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [errors,   setErrors]   = useState({})
  const [loading,  setLoading]  = useState(false)
  const [apiErr,   setApiErr]   = useState('')

  const validate = () => {
    const e = {}
    if (!email.trim())    e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email'
    if (!password)        e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setApiErr('')
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setLoading(true)
    try {
      await login(email.trim(), password)
      navigate('/welcome', { replace: true })
    } catch (err) {
      setApiErr(err.message || 'Invalid email or password.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field
        icon={Mail} type="email" placeholder="Email address"
        value={email} onChange={e => setEmail(e.target.value)} error={errors.email}
      />
      <Field
        icon={Lock} type={showPw ? 'text' : 'password'} placeholder="Password"
        value={password} onChange={e => setPassword(e.target.value)} error={errors.password}
        right={
          <button type="button" onClick={() => setShowPw(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: C.t3, display: 'flex' }}>
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        }
      />

      {apiErr && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.errDim, border: `1px solid rgba(192,57,43,0.25)`, borderRadius: 8, padding: '10px 14px' }}>
          <AlertCircle size={14} color={C.err} style={{ flexShrink: 0 }} />
          <span style={{ fontFamily: UI, fontSize: 13, color: C.err }}>{apiErr}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          background: loading ? C.b2 : C.gold,
          border: 'none', borderRadius: 10,
          padding: '14px 0', cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: UI, fontSize: 14, fontWeight: 700,
          color: loading ? C.t3 : C.bg,
          transition: 'all 0.18s ease',
          marginTop: 4,
        }}
      >
        {loading ? 'Signing in…' : <><span>Sign In</span><ArrowRight size={15} /></>}
      </button>

      <div style={{ textAlign: 'center', marginTop: 4 }}>
        <span style={{ fontFamily: UI, fontSize: 13, color: C.t3 }}>
          Don't have an account?{' '}
          <button type="button" onClick={onSwitch}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: UI, fontSize: 13, fontWeight: 600, color: C.gold, padding: 0 }}>
            Create one
          </button>
        </span>
      </div>
    </form>
  )
}

/* ── Signup form ──────────────────────────────────────────────────── */
function SignupForm({ onSwitch }) {
  const { signup } = useAuth()
  const navigate   = useNavigate()

  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [errors,   setErrors]   = useState({})
  const [loading,  setLoading]  = useState(false)
  const [apiErr,   setApiErr]   = useState('')
  const [success,  setSuccess]  = useState(false)

  const pwStrength = password.length === 0 ? 0
    : password.length < 6 ? 1
    : password.length < 10 ? 2
    : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColor = ['', C.err, '#c9862e', C.gold, C.ok]

  const validate = () => {
    const e = {}
    if (!name.trim())  e.name = 'Name is required'
    if (!email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email'
    if (!password)     e.password = 'Password is required'
    else if (password.length < 6) e.password = 'Must be at least 6 characters'
    if (password !== confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setApiErr('')
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setLoading(true)
    try {
      const nameParts = name.trim().split(' ')
      const firstName = nameParts[0]
      const lastName  = nameParts.slice(1).join(' ') || ''
      await signup(email.trim(), password, firstName, lastName)
      setSuccess(true)
      await new Promise(r => setTimeout(r, 1200))
      navigate('/welcome', { replace: true })
    } catch (err) {
      setApiErr(err.message || 'Could not create account. Try again.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '24px 0', textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(74,124,89,0.15)', border: '1px solid rgba(74,124,89,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle2 size={24} color={C.ok} />
        </div>
        <div>
          <div style={{ fontFamily: DISPLAY, fontSize: 20, fontWeight: 700, color: C.t1, marginBottom: 6 }}>Account created</div>
          <div style={{ fontFamily: UI, fontSize: 13, color: C.t2 }}>Signing you in…</div>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Field
        icon={User} type="text" placeholder="Full name"
        value={name} onChange={e => setName(e.target.value)} error={errors.name}
      />
      <Field
        icon={Mail} type="email" placeholder="Email address"
        value={email} onChange={e => setEmail(e.target.value)} error={errors.email}
      />
      <Field
        icon={Lock} type={showPw ? 'text' : 'password'} placeholder="Create a password"
        value={password} onChange={e => setPassword(e.target.value)} error={errors.password}
        right={
          <button type="button" onClick={() => setShowPw(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: C.t3, display: 'flex' }}>
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        }
      />

      {/* Password strength bar */}
      {password.length > 0 && (
        <div style={{ marginTop: -4 }}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= pwStrength ? strengthColor[pwStrength] : C.b2, transition: 'background 0.2s' }} />
            ))}
          </div>
          <span style={{ fontFamily: UI, fontSize: 11, color: strengthColor[pwStrength] }}>{strengthLabel[pwStrength]}</span>
        </div>
      )}

      <Field
        icon={Lock} type={showPw ? 'text' : 'password'} placeholder="Confirm password"
        value={confirm} onChange={e => setConfirm(e.target.value)} error={errors.confirm}
      />

      {apiErr && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.errDim, border: `1px solid rgba(192,57,43,0.25)`, borderRadius: 8, padding: '10px 14px' }}>
          <AlertCircle size={14} color={C.err} style={{ flexShrink: 0 }} />
          <span style={{ fontFamily: UI, fontSize: 13, color: C.err }}>{apiErr}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          background: loading ? C.b2 : C.gold,
          border: 'none', borderRadius: 10,
          padding: '14px 0', cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: UI, fontSize: 14, fontWeight: 700,
          color: loading ? C.t3 : C.bg,
          transition: 'all 0.18s ease',
          marginTop: 4,
        }}
      >
        {loading ? 'Creating account…' : <><span>Create Account</span><ArrowRight size={15} /></>}
      </button>

      <div style={{ textAlign: 'center', marginTop: 2 }}>
        <span style={{ fontFamily: UI, fontSize: 13, color: C.t3 }}>
          Already have an account?{' '}
          <button type="button" onClick={onSwitch}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: UI, fontSize: 13, fontWeight: 600, color: C.gold, padding: 0 }}>
            Sign in
          </button>
        </span>
      </div>
    </form>
  )
}

/* ── Page ─────────────────────────────────────────────────────────── */
export default function Login() {
  const [tab, setTab] = useState('login')
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh', background: C.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px', position: 'relative', overflow: 'hidden',
      fontFamily: UI,
    }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '60%', height: '50%', background: 'radial-gradient(ellipse at top, rgba(201,169,110,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ textAlign: 'center', marginBottom: 40 }}
        >
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 28, fontWeight: 700, color: C.gold, letterSpacing: '-0.01em' }}>Planora</div>
            <div style={{ fontFamily: UI, fontSize: 11, color: C.t3, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4 }}>Institutional Intelligence. Personal Impact.</div>
          </button>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
          style={{
            background: C.surf,
            border: `1px solid ${C.b2}`,
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          }}
        >
          {/* Tab switcher */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: `1px solid ${C.b1}` }}>
            {['login', 'signup'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  background: tab === t ? C.raise : 'transparent',
                  border: 'none', cursor: 'pointer',
                  padding: '16px 0',
                  fontFamily: UI, fontSize: 13, fontWeight: tab === t ? 700 : 400,
                  color: tab === t ? C.t1 : C.t3,
                  borderBottom: tab === t ? `2px solid ${C.gold}` : '2px solid transparent',
                  transition: 'all 0.18s ease',
                }}
              >
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Form area */}
          <div style={{ padding: '28px 28px 32px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: tab === 'login' ? -12 : 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: tab === 'login' ? 12 : -12 }}
                transition={{ duration: 0.22, ease: EASE }}
              >
                <div style={{ marginBottom: 24 }}>
                  <h1 style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 700, color: C.t1, margin: '0 0 6px', letterSpacing: '-0.01em' }}>
                    {tab === 'login' ? 'Welcome back' : 'Get started'}
                  </h1>
                  <p style={{ fontFamily: UI, fontSize: 13, color: C.t3, margin: 0 }}>
                    {tab === 'login'
                      ? 'Sign in to access your Planora dashboard.'
                      : 'Create your account to save your financial data.'}
                  </p>
                </div>

                {tab === 'login'
                  ? <LoginForm onSwitch={() => setTab('signup')} />
                  : <SignupForm onSwitch={() => setTab('login')} />
                }
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div style={{ borderTop: `1px solid ${C.b1}`, padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>
              By continuing you agree to our{' '}
              <button onClick={() => navigate('/terms')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: UI, fontSize: 11, color: C.t2, padding: 0, textDecoration: 'underline' }}>Terms</button>
              {' & '}
              <button onClick={() => navigate('/privacy')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: UI, fontSize: 11, color: C.t2, padding: 0, textDecoration: 'underline' }}>Privacy Policy</button>
            </span>
            <button
              onClick={() => navigate('/')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: UI, fontSize: 11, color: C.t3, padding: 0 }}
            >
              Continue as guest →
            </button>
          </div>
        </motion.div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ textAlign: 'center', marginTop: 28 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: C.goldDim, border: `1px solid ${C.goldBdr}`, borderRadius: 100, padding: '5px 14px' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.ok }} />
            <span style={{ fontFamily: UI, fontSize: 11, color: C.t2 }}>Your data is stored locally on this device</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
