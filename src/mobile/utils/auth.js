import { supabase } from '../../lib/supabase'

// Module-level cache — synchronous reads throughout the app
let _userId   = 'guest'
let _userMeta = { name: 'Member', email: '', createdAt: Date.now(), isGuest: false }

export function getCurrentUserId() { return _userId }
export function getCurrentUser()   { return { id: _userId, ..._userMeta } }
export function userKey(key)       { return `${_userId}_${key}` }

function applySession(session) {
  if (!session?.user) return
  const u = session.user
  _userId   = u.id
  _userMeta = {
    name:      u.user_metadata?.full_name || u.email?.split('@')[0] || 'Member',
    email:     u.email || '',
    createdAt: new Date(u.created_at).getTime(),
    isGuest:   false,
  }
}

/* ── Sign Up ──────────────────────────────────────────────── */
export async function signUp({ name, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email:    email.toLowerCase().trim(),
    password,
    options:  { data: { full_name: name.trim() } },
  })
  if (error) return { error: error.message }
  if (data.user) applySession(data.session || { user: data.user })
  // no session → Supabase requires email confirmation
  if (!data.session) return { user: data.user, needsConfirmation: true }
  return { user: data.user }
}

/* ── Sign In ──────────────────────────────────────────────── */
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email:    email.toLowerCase().trim(),
    password,
  })
  if (error) {
    const msg = error.message.toLowerCase()
    if (msg.includes('email not confirmed'))
      return { error: 'Please confirm your email before signing in. Check your inbox.' }
    if (msg.includes('invalid login credentials'))
      return { error: 'Incorrect email or password. Please try again.' }
    return { error: error.message }
  }
  applySession(data.session)
  return { user: data.user }
}

/* ── Guest ────────────────────────────────────────────────── */
export function signInAsGuest() {
  _userId   = 'guest'
  _userMeta = { name: 'Guest', email: '', createdAt: Date.now(), isGuest: true }
  localStorage.setItem('planora_guest_v1', '1')
  return { user: { id: 'guest', isGuest: true } }
}

/* ── Sign Out ─────────────────────────────────────────────── */
export async function signOut() {
  _userId   = 'guest'
  _userMeta = { name: 'Member', email: '', createdAt: Date.now(), isGuest: false }
  localStorage.removeItem('planora_guest_v1')
  await supabase.auth.signOut()
}

/* ── Init — called once on app startup ───────────────────── */
export async function getInitialSession() {
  // Guest bypass — no Supabase call needed
  if (localStorage.getItem('planora_guest_v1')) {
    _userId   = 'guest'
    _userMeta = { name: 'Guest', email: '', createdAt: Date.now(), isGuest: true }
    return { isGuest: true }
  }

  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {
    applySession(session)
    return { user: session.user }
  }
  return null
}

/* ── Called from App onAuthStateChange ───────────────────── */
export function handleAuthSession(session) {
  applySession(session)
}
