const ACCOUNTS_KEY = 'planora_accounts_v1'
const SESSION_KEY  = 'planora_auth_v1'

/* ── accounts registry ───────────────────────────────────── */
function getAccounts() {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]') } catch { return [] }
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

/* ── session ─────────────────────────────────────────────── */
export function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) } catch { return null }
}

export function getCurrentUserId() {
  return getSession()?.id || 'guest'
}

/* ── user-namespaced key helper ──────────────────────────── */
export function userKey(key) {
  return `${getCurrentUserId()}_${key}`
}

/* ── sign up ─────────────────────────────────────────────── */
export function signUp({ name, email, password }) {
  const accounts = getAccounts()
  const lower = email.toLowerCase().trim()

  if (accounts.find(a => a.email === lower)) {
    return { error: 'An account with this email already exists. Sign in instead.' }
  }

  const id      = `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const account = { id, name: name.trim(), email: lower, password, createdAt: Date.now() }
  accounts.push(account)
  saveAccounts(accounts)

  const session = { id, name: account.name, email: lower, createdAt: account.createdAt }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return { user: session }
}

/* ── sign in ─────────────────────────────────────────────── */
export function signIn({ email, password }) {
  const accounts = getAccounts()
  const lower    = email.toLowerCase().trim()
  const account  = accounts.find(a => a.email === lower)

  if (!account) {
    return { error: 'No account found with that email address.' }
  }
  if (account.password !== password) {
    return { error: 'Incorrect password. Please try again.' }
  }

  const session = { id: account.id, name: account.name, email: account.email, createdAt: account.createdAt }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return { user: session }
}

/* ── guest session ───────────────────────────────────────── */
export function signInAsGuest() {
  const session = { id: 'guest', name: 'Guest', email: 'guest@planora.app', createdAt: Date.now(), isGuest: true }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return { user: session }
}

/* ── sign out ────────────────────────────────────────────── */
export function signOut() {
  localStorage.removeItem(SESSION_KEY)
}
