import { useState, useRef, useEffect } from 'react'
import { C, UI, MONO, DISPLAY } from '../../tokens'
import { Menu, X, Plus, Trash2, MessageSquare } from 'lucide-react'

/* ── Groq API ────────────────────────────────────────────────────── */
const GROQ_KEY   = import.meta.env.VITE_GROQ_API_KEY
const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

const SYSTEM_PROMPT = `You are Planora AI, a knowledgeable and approachable financial education assistant built into the Planora financial platform. You help users understand financial concepts, planning strategies, investment basics, taxes, insurance, budgeting, retirement, and all other personal finance topics.

Guidelines:
- Answer any financial or general question clearly and thoroughly
- Use plain language — explain jargon when you use it
- Structure longer answers with bullet points or numbered lists for readability
- When relevant, mention that users can connect with a fee-only fiduciary advisor through Wealth Counsel for personalized advice
- Be warm, direct, and educational — never condescending
- For non-financial questions, answer helpfully and naturally
- Never refuse to answer a question unless it involves something illegal or harmful
- Today's date is ${new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}`

async function callGroq(messages) {
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(m => ({ role: m.role, content: m.text })),
      ],
      temperature: 0.7,
      max_tokens: 1500,
    }),
  })
  if (!res.ok) {
    const err = await res.text().catch(() => '')
    throw new Error(`Groq API error ${res.status}: ${err.slice(0, 200)}`)
  }
  const data = await res.json()
  return data.choices?.[0]?.message?.content || 'Sorry, I couldn\'t generate a response. Please try again.'
}

/* ── constants ───────────────────────────────────────────────────── */
const LS_KEY = 'planora_ai_chats_v1'

const QUICK_PROMPTS = [
  'How much should I have in an emergency fund?',
  'What is a Roth IRA conversion ladder?',
  'Explain the 4% retirement withdrawal rule',
  'How do I build a budget from scratch?',
  'What\'s the difference between a Roth and Traditional IRA?',
  'How does tax-loss harvesting work?',
]

const WELCOME = 'Hi! I\'m Planora AI — your personal financial education assistant. I can explain financial concepts, help you understand planning strategies, and answer any question you have.\n\nWhat would you like to know today?'

/* ── Text renderer ───────────────────────────────────────────────── */
function formatMessage(text) {
  return text.split('\n').map((line, i) => {
    if (!line) return <div key={i} style={{ height: 6 }} />
    if (line.startsWith('### '))
      return <div key={i} style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.t1, textTransform:'uppercase', letterSpacing:'0.08em', marginTop:8, marginBottom:3 }}>{line.slice(4)}</div>
    if (line.startsWith('## '))
      return <div key={i} style={{ fontFamily:DISPLAY, fontSize:15, fontWeight:700, color:C.t1, marginTop:10, marginBottom:4 }}>{line.slice(3)}</div>
    if (line.startsWith('# '))
      return <div key={i} style={{ fontFamily:DISPLAY, fontSize:17, fontWeight:700, color:C.t1, marginTop:10, marginBottom:4 }}>{line.slice(2)}</div>
    if (line.startsWith('- ') || line.startsWith('* '))
      return (
        <div key={i} style={{ display:'flex', gap:7, marginBottom:3 }}>
          <span style={{ color:C.indigo, fontWeight:700, flexShrink:0, marginTop:1 }}>•</span>
          <span>{renderInline(line.slice(2))}</span>
        </div>
      )
    if (/^\d+\./.test(line)) {
      const m = line.match(/^(\d+)\.\s*(.*)/)
      return (
        <div key={i} style={{ display:'flex', gap:7, marginBottom:3 }}>
          <span style={{ color:C.indigo, fontWeight:700, flexShrink:0, minWidth:16, fontFamily:MONO, fontSize:11 }}>{m[1]}.</span>
          <span>{renderInline(m[2])}</span>
        </div>
      )
    }
    return <p key={i} style={{ margin:'0 0 5px' }}>{renderInline(line)}</p>
  })
}

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/)
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**'))
      return <strong key={i} style={{ color:C.t1, fontWeight:700 }}>{p.slice(2,-2)}</strong>
    if (p.startsWith('*') && p.endsWith('*'))
      return <em key={i} style={{ color:C.t1 }}>{p.slice(1,-1)}</em>
    if (p.startsWith('`') && p.endsWith('`'))
      return <code key={i} style={{ fontFamily:MONO, fontSize:11, background:'rgba(129,140,248,0.12)', padding:'1px 5px', borderRadius:4, color:C.indigo }}>{p.slice(1,-1)}</code>
    return <span key={i}>{p}</span>
  })
}

/* ── localStorage helpers ────────────────────────────────────────── */
function loadChats() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || [] } catch { return [] }
}
function saveChats(chats) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(chats)) } catch {}
}
function newChat() {
  return { id: Date.now().toString(), title: 'New Chat', messages: [{ role:'assistant', text: WELCOME }], createdAt: Date.now() }
}
function relativeTime(ts) {
  const diff = Date.now() - ts
  if (diff < 60000)    return 'Just now'
  if (diff < 3600000)  return `${Math.floor(diff/60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`
  return `${Math.floor(diff/86400000)}d ago`
}

/* ── Sidebar ─────────────────────────────────────────────────────── */
function Sidebar({ open, onClose, chats, activeId, onSelect, onNew, onDelete }) {
  return (
    <>
      {open && (
        <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(28,21,16,0.45)', zIndex:200, backdropFilter:'blur(2px)', WebkitBackdropFilter:'blur(2px)' }} />
      )}
      <div style={{
        position:'fixed', top:0, left:0, bottom:0, zIndex:201, width:280,
        background:C.surf, borderRight:`1px solid ${C.b2}`,
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
        display:'flex', flexDirection:'column',
        boxShadow: open ? '8px 0 32px rgba(28,21,16,0.18)' : 'none',
      }}>
        <div style={{ padding:'52px 16px 14px', borderBottom:`1px solid ${C.b1}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:C.indigo, marginBottom:2 }}>Planora AI</div>
            <div style={{ fontFamily:DISPLAY, fontSize:17, fontWeight:600, color:C.t1 }}>Chats</div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', padding:6, borderRadius:8 }}>
            <X size={18} color={C.t3} />
          </button>
        </div>

        <div style={{ padding:'12px 12px 8px' }}>
          <button onClick={() => { onNew(); onClose() }} style={{
            width:'100%', display:'flex', alignItems:'center', gap:8,
            background:'rgba(129,140,248,0.10)', border:`1px solid rgba(129,140,248,0.25)`,
            borderRadius:12, padding:'10px 14px', cursor:'pointer',
            fontFamily:UI, fontSize:13, fontWeight:700, color:C.indigo,
          }}>
            <Plus size={15} color={C.indigo} />
            New Chat
          </button>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'0 8px 16px' }}>
          {chats.length === 0 ? (
            <div style={{ padding:'32px 16px', textAlign:'center', fontFamily:UI, fontSize:12, color:C.t3 }}>No previous chats yet.</div>
          ) : (
            chats.map(chat => {
              const isActive = chat.id === activeId
              const lastUser = [...chat.messages].reverse().find(m => m.role === 'user')
              return (
                <div key={chat.id} onClick={() => { onSelect(chat.id); onClose() }}
                  style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px', borderRadius:12, marginBottom:2, cursor:'pointer', background: isActive ? 'rgba(129,140,248,0.10)' : 'transparent', border:`1px solid ${isActive ? 'rgba(129,140,248,0.25)' : 'transparent'}` }}>
                  <div style={{ width:28, height:28, borderRadius:8, background: isActive ? 'rgba(129,140,248,0.15)' : C.raise, border:`1px solid ${isActive ? 'rgba(129,140,248,0.22)' : C.b1}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                    <MessageSquare size={12} color={isActive ? C.indigo : C.t3} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:UI, fontSize:12, fontWeight:isActive ? 700 : 500, color:isActive ? C.indigo : C.t1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:2 }}>{chat.title}</div>
                    <div style={{ fontFamily:UI, fontSize:11, color:C.t3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:2 }}>{lastUser ? lastUser.text : 'No messages yet'}</div>
                    <div style={{ fontFamily:MONO, fontSize:9, color:C.t3 }}>{relativeTime(chat.createdAt)}</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); onDelete(chat.id) }}
                    style={{ background:'none', border:'none', cursor:'pointer', padding:4, borderRadius:6, opacity:0.4, flexShrink:0 }}>
                    <Trash2 size={12} color={C.t3} />
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}

/* ── Main component ──────────────────────────────────────────────── */
export default function MPlonoraAI() {
  const [chats, setChats]         = useState(() => { const c = loadChats(); return c.length ? c : [newChat()] })
  const [activeId, setActiveId]   = useState(() => { const c = loadChats(); return c.length ? c[0].id : null })
  const [sidebarOpen, setSidebar] = useState(false)
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const bottomRef                 = useRef(null)

  const activeChat = chats.find(c => c.id === activeId) || chats[0]
  const messages   = activeChat?.messages || []

  useEffect(() => {
    if (!activeId && chats.length) setActiveId(chats[0].id)
  }, [chats, activeId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [messages, loading])

  function updateChat(id, updater) {
    setChats(prev => {
      const next = prev.map(c => c.id === id ? updater(c) : c)
      saveChats(next)
      return next
    })
  }

  async function send(text) {
    if (!text.trim() || !activeChat || loading) return
    const userMsg  = { role:'user', text: text.trim() }
    const isFirst  = activeChat.messages.filter(m => m.role === 'user').length === 0
    const snapshot = [...activeChat.messages, userMsg]

    updateChat(activeChat.id, c => ({
      ...c,
      title:    isFirst ? text.trim().slice(0, 44) : c.title,
      messages: snapshot,
      createdAt: isFirst ? Date.now() : c.createdAt,
    }))
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const reply = await callGroq(snapshot)
      updateChat(activeChat.id, c => ({ ...c, messages: [...c.messages, { role:'assistant', text: reply }] }))
    } catch (err) {
      const errMsg = GROQ_KEY
        ? 'Something went wrong connecting to Planora AI. Please try again.'
        : 'API key not configured. Add VITE_GROQ_API_KEY to your .env file.'
      setError(errMsg)
    } finally {
      setLoading(false)
    }
  }

  function handleNew() {
    const chat = newChat()
    setChats(prev => { const next = [chat, ...prev]; saveChats(next); return next })
    setActiveId(chat.id)
    setInput('')
    setError(null)
  }

  function handleDelete(id) {
    setChats(prev => {
      const next = prev.filter(c => c.id !== id)
      if (!next.length) { const fresh = newChat(); saveChats([fresh]); setActiveId(fresh.id); return [fresh] }
      saveChats(next)
      if (id === activeId) setActiveId(next[0].id)
      return next
    })
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', background:C.bg, height:'100dvh', overflow:'hidden' }}>
      <Sidebar
        open={sidebarOpen} onClose={() => setSidebar(false)}
        chats={[...chats].sort((a,b) => b.createdAt - a.createdAt)}
        activeId={activeId}
        onSelect={id => { setActiveId(id); setInput(''); setError(null) }}
        onNew={handleNew}
        onDelete={handleDelete}
      />

      {/* Header */}
      <div style={{ padding:'52px 16px 14px', borderBottom:`1px solid ${C.b1}`, background:'rgba(250,246,237,0.94)', backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)', zIndex:10, display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
        <button onClick={() => setSidebar(true)} style={{ width:36, height:36, borderRadius:10, background:C.surf, border:`1px solid ${C.b1}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
          <Menu size={17} color={C.t2} />
        </button>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:C.indigo, marginBottom:1 }}>Planora AI</div>
          <div style={{ fontFamily:DISPLAY, fontSize:17, fontWeight:600, color:C.t1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {activeChat?.title || 'New Chat'}
          </div>
        </div>
        <button onClick={handleNew} style={{ width:36, height:36, borderRadius:10, background:'rgba(129,140,248,0.10)', border:`1px solid rgba(129,140,248,0.25)`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
          <Plus size={17} color={C.indigo} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'14px 16px 8px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom:14, display:'flex', flexDirection:'column', alignItems: m.role==='user' ? 'flex-end' : 'flex-start' }}>
            {m.role === 'assistant' && (
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5 }}>
                <div style={{ width:20, height:20, borderRadius:'50%', background:'rgba(129,140,248,0.18)', border:`1px solid ${C.indigo}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontFamily:MONO, fontSize:9, fontWeight:700, color:C.indigo }}>AI</span>
                </div>
                <span style={{ fontFamily:UI, fontSize:10, color:C.t3 }}>Planora AI</span>
              </div>
            )}
            <div style={{
              maxWidth:'88%', padding:'12px 14px',
              borderRadius: m.role==='user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
              background: m.role==='user' ? 'rgba(129,140,248,0.13)' : C.surf,
              border:`1px solid ${m.role==='user' ? 'rgba(129,140,248,0.28)' : C.b2}`,
              fontFamily:UI, fontSize:13, color:C.t2, lineHeight:1.65,
            }}>
              {formatMessage(m.text)}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:14 }}>
            <div style={{ width:20, height:20, borderRadius:'50%', background:'rgba(129,140,248,0.18)', border:`1px solid ${C.indigo}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontFamily:MONO, fontSize:9, fontWeight:700, color:C.indigo }}>AI</span>
            </div>
            <div style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:'4px 16px 16px 16px', padding:'12px 16px' }}>
              <div style={{ display:'flex', gap:4 }}>
                {[0,1,2].map(i => <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:C.indigo, opacity:0.5, animation:`dot 1.2s ${i*0.2}s infinite ease-in-out` }} />)}
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ margin:'0 0 14px', padding:'10px 14px', borderRadius:12, background:'rgba(239,68,68,0.08)', border:`1px solid rgba(239,68,68,0.22)`, fontFamily:UI, fontSize:12, color:'#ef4444' }}>
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick prompts — only on fresh chat */}
      {messages.length <= 1 && (
        <div style={{ padding:'0 16px 10px', display:'flex', gap:8, overflowX:'auto', scrollbarWidth:'none', flexShrink:0 }}>
          {QUICK_PROMPTS.map(p => (
            <button key={p} onClick={() => send(p)} style={{ flexShrink:0, background:C.surf, border:`1px solid ${C.b2}`, borderRadius:10, padding:'8px 12px', fontFamily:UI, fontSize:11, color:C.t2, cursor:'pointer', maxWidth:200, textAlign:'left', lineHeight:1.4 }}>
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding:'8px 16px 100px', borderTop:`1px solid ${C.b1}`, display:'flex', gap:10, flexShrink:0 }}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
          placeholder="Ask anything about money, investing, or finance..."
          style={{ flex:1, background:C.surf, border:`1px solid ${C.b2}`, borderRadius:12, padding:'12px 14px', fontFamily:UI, fontSize:14, color:C.t1, outline:'none' }}
        />
        <button onClick={() => send(input)} disabled={!input.trim() || loading}
          style={{ width:44, height:44, borderRadius:12, background: input.trim() && !loading ? C.indigo : C.b2, border:'none', cursor: input.trim() && !loading ? 'pointer' : 'default', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, color:'#fff', flexShrink:0, transition:'background 0.15s' }}>
          {loading ? <div style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} /> : '↑'}
        </button>
      </div>

      <style>{`
        @keyframes dot  { 0%,80%,100%{opacity:0.3} 40%{opacity:1} }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
