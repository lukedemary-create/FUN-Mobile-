import { useState } from 'react'
import { Eye, EyeOff, ArrowRight, User, Mail, Lock, ShieldCheck, MailCheck, X, FileText, CheckSquare, Square } from 'lucide-react'
import { C, UI, MONO, DISPLAY } from '../../tokens'
import { signUp, signIn, signInAsGuest } from '../../utils/auth'
import TermsContent from './TermsContent'

/* ── helpers ──────────────────────────────────────────────── */
function Field({ icon: Icon, placeholder, value, onChange, type = 'text', rightEl }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
        <Icon size={16} color={C.t3} strokeWidth={1.8} />
      </div>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={type === 'password' ? 'current-password' : type === 'email' ? 'email' : 'name'}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '13px 44px 13px 44px',
          background: '#f5f1eb',
          border: `1.5px solid ${C.b1}`,
          borderRadius: 12,
          fontFamily: UI,
          fontSize: 14,
          color: C.t1,
          outline: 'none',
          WebkitAppearance: 'none',
        }}
      />
      {rightEl && (
        <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
          {rightEl}
        </div>
      )}
    </div>
  )
}

/* ── decorative bg blobs ──────────────────────────────────── */
function BgBlobs() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -80, right: -60, width: 260, height: 260, borderRadius: '50%', background: 'rgba(129,140,248,0.07)' }} />
      <div style={{ position: 'absolute', bottom: 60, left: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(0,180,198,0.06)' }} />
      <div style={{ position: 'absolute', top: '40%', right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(201,169,110,0.05)' }} />
    </div>
  )
}

/* ── main ─────────────────────────────────────────────────── */
export default function LoginScreen({ onComplete }) {
  const [tab, setTab]               = useState('signin')
  const [name, setName]             = useState('')
  const [email, setEmail]           = useState('')
  const [password, setPass]         = useState('')
  const [showPw, setShowPw]         = useState(false)
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)
  const [exiting, setExiting]       = useState(false)
  const [awaitingEmail, setAwaiting] = useState(false)
  const [termsAccepted, setTerms]   = useState(false)
  const [showTerms, setShowTerms]   = useState(false)

  const isSignUp = tab === 'signup'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email.trim()) { setError('Email is required.'); return }
    if (!password.trim()) { setError('Password is required.'); return }
    if (isSignUp && !name.trim()) { setError('Please enter your name.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (isSignUp && !termsAccepted) { setError('Please accept the Terms of Use & Privacy Policy to continue.'); return }

    setLoading(true)

    const result = isSignUp
      ? await signUp({ name: name.trim(), email: email.trim(), password })
      : await signIn({ email: email.trim(), password })

    if (result.error) {
      setLoading(false)
      setError(result.error)
      return
    }

    if (result.needsConfirmation) {
      setLoading(false)
      setAwaiting(true)
      return
    }

    // Slide out, hand off
    setTimeout(() => {
      setExiting(true)
      setTimeout(onComplete, 380)
    }, 280)
  }

  function handleGuest() {
    signInAsGuest()
    setExiting(true)
    setTimeout(onComplete, 380)
  }

  // ── Email confirmation waiting screen ─────────────────────
  if (awaitingEmail) {
    return (
      <div style={{ position:'fixed', inset:0, background:C.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'0 28px' }}>
        <BgBlobs />
        <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:380, textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:72, height:72, background:`${C.indigo}14`, border:`1.5px solid ${C.indigo}30`, borderRadius:24, marginBottom:24 }}>
            <MailCheck size={32} color={C.indigo} strokeWidth={1.6} />
          </div>
          <h2 style={{ fontFamily:DISPLAY, fontSize:26, fontWeight:700, color:C.t1, margin:'0 0 10px', lineHeight:1.2 }}>Check your inbox</h2>
          <p style={{ fontFamily:UI, fontSize:14, color:C.t2, lineHeight:1.65, margin:'0 0 28px' }}>
            We sent a confirmation link to <strong style={{ color:C.t1 }}>{email}</strong>. Click it to activate your account, then come back and sign in.
          </p>
          <button
            onClick={() => { setAwaiting(false); setTab('signin'); setPass('') }}
            style={{ width:'100%', padding:'14px 0', background:C.indigo, border:'none', borderRadius:14, fontFamily:UI, fontSize:14, fontWeight:700, color:'#fff', cursor:'pointer', boxShadow:`0 4px 20px ${C.indigo}44` }}
          >
            Back to Sign In
          </button>
          <p style={{ fontFamily:UI, fontSize:11, color:C.t3, marginTop:16, lineHeight:1.5 }}>
            Didn't get it? Check your spam folder or try signing up again.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: C.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '0 20px',
      overflowY: 'auto',
      transform: exiting ? 'translateX(100vw)' : 'translateX(0)',
      transition: exiting ? 'transform 0.38s cubic-bezier(0.55,0,1,0.45)' : 'none',
    }}>
      <BgBlobs />

      <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>

        {/* ── Brand header ──────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <img
              src="/fun-logo.png"
              alt="Planora"
              style={{ width: 56, height: 56, borderRadius: 16, objectFit: 'cover', objectPosition: 'center', boxShadow: '0 4px 20px rgba(129,140,248,0.22)' }}
            />
          </div>

          <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.indigo, marginBottom: 6 }}>
            Financial Understanding Network
          </div>

          <h1 style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 700, color: C.t1, margin: '0 0 6px', lineHeight: 1.15 }}>
            {isSignUp ? 'Create your account.' : 'Welcome back.'}
          </h1>

          <p style={{ fontFamily: UI, fontSize: 14, color: C.t2, margin: 0, lineHeight: 1.6 }}>
            {isSignUp
              ? 'Start building your financial future today.'
              : 'Your personalized financial journey awaits.'}
          </p>
        </div>

        {/* ── Floating tab pill ─────────────────────── */}
        <div style={{
          display: 'flex',
          background: '#ede9e0',
          borderRadius: 14,
          padding: 4,
          marginBottom: 20,
          position: 'relative',
        }}>
          {[['signin', 'Sign In'], ['signup', 'Create Account']].map(([t, label]) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError('') }}
              style={{
                flex: 1,
                padding: '9px 0',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                fontFamily: UI,
                fontSize: 13,
                fontWeight: tab === t ? 700 : 500,
                color: tab === t ? C.t1 : C.t3,
                background: tab === t ? '#fff' : 'transparent',
                boxShadow: tab === t ? '0 1px 6px rgba(28,21,16,0.10)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Floating card ─────────────────────────── */}
        <div style={{
          background: '#ffffff',
          border: `1px solid ${C.b1}`,
          borderRadius: 24,
          padding: '24px 20px',
          boxShadow: '0 8px 48px rgba(28,21,16,0.10), 0 2px 12px rgba(28,21,16,0.06)',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {isSignUp && (
              <Field
                icon={User}
                placeholder="Full name"
                value={name}
                onChange={setName}
              />
            )}

            <Field
              icon={Mail}
              placeholder="Email address"
              value={email}
              onChange={setEmail}
              type="email"
            />

            <Field
              icon={Lock}
              placeholder="Password"
              value={password}
              onChange={setPass}
              type={showPw ? 'text' : 'password'}
              rightEl={
                <button type="button" onClick={() => setShowPw(v => !v)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  {showPw
                    ? <EyeOff size={16} color={C.t3} strokeWidth={1.8} />
                    : <Eye size={16} color={C.t3} strokeWidth={1.8} />}
                </button>
              }
            />

            {/* Terms checkbox — sign up only */}
            {isSignUp && (
              <div style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'4px 2px' }}>
                <button
                  type="button"
                  onClick={() => setTerms(v => !v)}
                  style={{ background:'none', border:'none', padding:0, cursor:'pointer', flexShrink:0, marginTop:1, display:'flex' }}
                >
                  {termsAccepted
                    ? <CheckSquare size={20} color={C.indigo} strokeWidth={1.8} />
                    : <Square size={20} color={C.t3} strokeWidth={1.8} />}
                </button>
                <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.6 }}>
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    style={{ background:'none', border:'none', padding:0, cursor:'pointer', fontFamily:UI, fontSize:12, fontWeight:700, color:C.indigo, textDecoration:'underline', textUnderlineOffset:2 }}
                  >
                    Terms of Use & Privacy Policy
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div style={{ fontFamily: UI, fontSize: 12, color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)', borderRadius: 8, padding: '8px 12px', lineHeight: 1.5 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (isSignUp && !termsAccepted)}
              style={{
                marginTop: 4,
                width: '100%',
                padding: '14px 0',
                background: loading || (isSignUp && !termsAccepted) ? 'rgba(129,140,248,0.4)' : C.indigo,
                border: 'none',
                borderRadius: 14,
                cursor: loading || (isSignUp && !termsAccepted) ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontFamily: UI,
                fontSize: 14,
                fontWeight: 700,
                color: '#fff',
                boxShadow: loading || (isSignUp && !termsAccepted) ? 'none' : '0 4px 20px rgba(129,140,248,0.32)',
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Setting up your account…
                </>
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight size={16} color="#fff" />
                </>
              )}
            </button>

          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: C.b1 }} />
            <span style={{ fontFamily: UI, fontSize: 11, color: C.t3 }}>or</span>
            <div style={{ flex: 1, height: 1, background: C.b1 }} />
          </div>

          {/* Guest access */}
          <button
            onClick={handleGuest}
            style={{
              width: '100%',
              padding: '12px 0',
              background: 'transparent',
              border: `1.5px solid ${C.b2}`,
              borderRadius: 14,
              cursor: 'pointer',
              fontFamily: UI,
              fontSize: 13,
              fontWeight: 600,
              color: C.t2,
            }}
          >
            Continue as Guest
          </button>
        </div>

        {/* ── Privacy note ──────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20 }}>
          <ShieldCheck size={13} color={C.t3} strokeWidth={1.8} />
          <span style={{ fontFamily: UI, fontSize: 11, color: C.t3, lineHeight: 1.5 }}>
            Your data stays private. No account required to explore.
          </span>
        </div>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: ${C.t3}; opacity: 0.8; }
        input:focus { border-color: ${C.indigo} !important; outline: none; box-shadow: 0 0 0 3px rgba(129,140,248,0.12); }
      `}</style>

      {/* ── Terms modal ───────────────────────────────── */}
      {showTerms && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(20,15,10,0.55)',
          display: 'flex', alignItems: 'flex-end',
        }}
          onClick={e => { if (e.target === e.currentTarget) setShowTerms(false) }}
        >
          <div style={{
            width: '100%', maxHeight: '90dvh',
            background: '#faf7f2',
            borderRadius: '24px 24px 0 0',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 -8px 40px rgba(28,21,16,0.18)',
          }}>
            {/* Modal header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 20px 14px',
              borderBottom: '1px solid #e8e0d4',
              flexShrink: 0,
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <FileText size={18} color={C.indigo} strokeWidth={1.8} />
                <span style={{ fontFamily:UI, fontSize:15, fontWeight:700, color:C.t1 }}>Terms of Use & Privacy Policy</span>
              </div>
              <button onClick={() => setShowTerms(false)} style={{ background:'none', border:'none', cursor:'pointer', padding:4, display:'flex', alignItems:'center' }}>
                <X size={20} color={C.t3} strokeWidth={1.8} />
              </button>
            </div>

            {/* Scrollable body */}
            <div style={{ overflowY: 'auto', flex: 1, padding: '16px 20px 8px', WebkitOverflowScrolling: 'touch' }}>
              <TermsContent />
            </div>

            {/* Accept button */}
            <div style={{ padding: '14px 20px 28px', borderTop: '1px solid #e8e0d4', flexShrink: 0 }}>
              <button
                onClick={() => { setTerms(true); setShowTerms(false) }}
                style={{
                  width: '100%', padding: '14px 0',
                  background: C.indigo, border: 'none', borderRadius: 14,
                  fontFamily: UI, fontSize: 14, fontWeight: 700, color: '#fff',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(129,140,248,0.32)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <CheckSquare size={16} color="#fff" strokeWidth={2} />
                I Accept These Terms
              </button>
              <button
                onClick={() => setShowTerms(false)}
                style={{ width:'100%', padding:'10px 0', marginTop:8, background:'none', border:'none', fontFamily:UI, fontSize:13, color:C.t3, cursor:'pointer' }}
              >
                Close Without Accepting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
