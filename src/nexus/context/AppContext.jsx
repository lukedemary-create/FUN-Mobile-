import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { clients as initialClients } from '../data/demoData'

const AppContext = createContext(null)

const LS = {
  get: (k, fallback) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback } catch { return fallback } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} },
}

export function AppProvider({ children }) {
  const [role, setRole] = useState(() => LS.get('nx_role', null))
  const [selectedClientId, setSelectedClientId] = useState(() => LS.get('nx_client_id', 'c1'))

  // Mutable client data (messages, action items, agenda, life events)
  const [clientData, setClientData] = useState(() => {
    const stored = LS.get('nx_client_data', null)
    if (stored) return stored
    const base = {}
    initialClients.forEach(c => {
      base[c.id] = {
        messages: c.messages,
        actionItems: c.actionItems,
        agendaItems: c.agendaItems,
        lifeEvents: c.lifeEvents,
      }
    })
    return base
  })

  useEffect(() => { LS.set('nx_role', role) }, [role])
  useEffect(() => { LS.set('nx_client_id', selectedClientId) }, [selectedClientId])
  useEffect(() => { LS.set('nx_client_data', clientData) }, [clientData])

  const enterAdvisor = useCallback(() => setRole('advisor'), [])
  const enterClient = useCallback((clientId) => {
    setSelectedClientId(clientId)
    setRole('client')
  }, [])
  const logout = useCallback(() => {
    setRole(null)
    LS.set('nx_role', null)
  }, [])

  // ─── Client data mutators ──────────────────────
  const sendMessage = useCallback((clientId, text, sender) => {
    setClientData(prev => {
      const msgs = prev[clientId]?.messages || []
      const newMsg = {
        id: 'm' + Date.now(),
        sender,
        text,
        timestamp: new Date().toISOString(),
        read: sender === 'advisor',
      }
      return { ...prev, [clientId]: { ...prev[clientId], messages: [...msgs, newMsg] } }
    })
  }, [])

  const toggleActionItem = useCallback((clientId, itemId) => {
    setClientData(prev => {
      const items = (prev[clientId]?.actionItems || []).map(i =>
        i.id === itemId ? { ...i, completed: !i.completed } : i
      )
      return { ...prev, [clientId]: { ...prev[clientId], actionItems: items } }
    })
  }, [])

  const toggleAgendaItem = useCallback((clientId, itemId) => {
    setClientData(prev => {
      const items = (prev[clientId]?.agendaItems || []).map(i =>
        i.id === itemId ? { ...i, completed: !i.completed } : i
      )
      return { ...prev, [clientId]: { ...prev[clientId], agendaItems: items } }
    })
  }, [])

  const addAgendaItem = useCallback((clientId, text, addedBy) => {
    setClientData(prev => {
      const items = prev[clientId]?.agendaItems || []
      return {
        ...prev,
        [clientId]: {
          ...prev[clientId],
          agendaItems: [...items, { id: 'ma' + Date.now(), text, completed: false, addedBy }]
        }
      }
    })
  }, [])

  const addLifeEvent = useCallback((clientId, event) => {
    setClientData(prev => {
      const events = prev[clientId]?.lifeEvents || []
      return {
        ...prev,
        [clientId]: {
          ...prev[clientId],
          lifeEvents: [{ id: 'le' + Date.now(), ...event }, ...events]
        }
      }
    })
  }, [])

  const markMessagesRead = useCallback((clientId) => {
    setClientData(prev => {
      const msgs = (prev[clientId]?.messages || []).map(m => ({ ...m, read: true }))
      return { ...prev, [clientId]: { ...prev[clientId], messages: msgs } }
    })
  }, [])

  const getClientData = useCallback((clientId) => {
    const base = initialClients.find(c => c.id === clientId) || {}
    const mutable = clientData[clientId] || {}
    return { ...base, ...mutable }
  }, [clientData])

  const unreadCount = useCallback((clientId) => {
    return (clientData[clientId]?.messages || []).filter(m => !m.read && m.sender === 'advisor').length
  }, [clientData])

  const totalUnread = useCallback(() => {
    return Object.keys(clientData).reduce((sum, cid) => {
      return sum + (clientData[cid]?.messages || []).filter(m => !m.read).length
    }, 0)
  }, [clientData])

  const value = {
    role,
    selectedClientId,
    setSelectedClientId,
    enterAdvisor,
    enterClient,
    logout,
    clientData,
    getClientData,
    sendMessage,
    toggleActionItem,
    toggleAgendaItem,
    addAgendaItem,
    addLifeEvent,
    markMessagesRead,
    unreadCount,
    totalUnread,
    initialClients,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
