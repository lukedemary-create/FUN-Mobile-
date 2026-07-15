import { useState, useCallback } from 'react'
import { userKey } from '../utils/auth'

export default function useUserLS(key, def) {
  const prefixed = userKey(key)

  const [v, set] = useState(() => {
    try {
      const r = localStorage.getItem(prefixed)
      return r ? JSON.parse(r) : def
    } catch { return def }
  })

  const update = useCallback(val => {
    const next = typeof val === 'function' ? val(v) : val
    set(next)
    try { localStorage.setItem(prefixed, JSON.stringify(next)) } catch {}
  }, [v, prefixed])

  return [v, update]
}
