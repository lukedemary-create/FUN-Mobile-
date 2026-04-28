import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain, Send, Plus, Trash2, ChevronRight, Loader2,
  TrendingUp, DollarSign, BarChart2, Globe, Shield, BookOpen,
  Copy, Check, RefreshCw, Search, ChevronLeft,
} from 'lucide-react';

const SERVER = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const SUGGESTED_PROMPTS = [
  { icon: TrendingUp,  text: "What is the Fed's current stance and what does it mean for stocks and bonds?" },
  { icon: DollarSign,  text: "How should I think about portfolio allocation in today's rate environment?" },
  { icon: Globe,       text: "How do tariffs and geopolitical tensions typically impact markets?" },
  { icon: BarChart2,   text: "Walk me through how to analyze a company's financial statements like a pro" },
  { icon: Shield,      text: "What are the biggest macro risks to watch right now and how do I hedge?" },
  { icon: BookOpen,    text: "Explain the yield curve, what an inversion means, and why it matters" },
];

const STOCK_QUICK_PROMPTS = [
  'AAPL', 'NVDA', 'TSLA', 'MSFT', 'AMZN', 'META', 'GOOGL', 'JPM',
];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function generateTitle(content) {
  const cleaned = content.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  const words = cleaned.split(/\s+/).slice(0, 6).join(' ');
  return words.length > 3 ? words : 'New Conversation';
}

function formatTime(ts) {
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function MessageContent({ content }) {
  const lines = content.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-base font-bold text-white mt-4 mb-2">{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-sm font-bold text-blue-300 mt-3 mb-1">{line.slice(4)}</h3>);
    } else if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      elements.push(<p key={i} className="font-semibold text-white mt-2">{line.slice(2, -2)}</p>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const bulletLines = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        bulletLines.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside space-y-1 my-2 text-gray-200">
          {bulletLines.map((b, j) => (
            <li key={j} className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: b.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
          ))}
        </ul>
      );
      continue;
    } else if (/^\d+\./.test(line)) {
      const numLines = [];
      while (i < lines.length && /^\d+\./.test(lines[i])) {
        numLines.push(lines[i].replace(/^\d+\.\s*/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal list-inside space-y-1 my-2 text-gray-200">
          {numLines.map((b, j) => (
            <li key={j} className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: b.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
          ))}
        </ol>
      );
      continue;
    } else if (line.startsWith('---')) {
      elements.push(<hr key={i} className="border-gray-700 my-3" />);
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-1" />);
    } else {
      elements.push(
        <p key={i} className="text-sm text-gray-200 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
      );
    }
    i++;
  }

  return <div className="space-y-1">{elements}</div>;
}

export default function PlonoraAI() {
  const [chats, setChats] = useState(() => {
    try { return JSON.parse(localStorage.getItem('planora_ai_chats') || '[]'); } catch { return []; }
  });
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState('');
  const [copied, setCopied] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  const activeChat = chats.find(c => c.id === activeChatId) || null;
  const messages = activeChat?.messages || [];

  useEffect(() => {
    localStorage.setItem('planora_ai_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamBuffer]);

  function newChat() {
    setActiveChatId(null);
    setStreamBuffer('');
    setInput('');
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function deleteChat(id, e) {
    e.stopPropagation();
    setChats(prev => prev.filter(c => c.id !== id));
    if (activeChatId === id) setActiveChatId(null);
  }

  function selectChat(id) {
    setActiveChatId(id);
    setStreamBuffer('');
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || streaming) return;
    setInput('');

    let chatId = activeChatId;
    let chatMessages = messages;

    if (!chatId) {
      chatId = generateId();
      const newChatObj = {
        id: chatId,
        title: generateTitle(trimmed),
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setChats(prev => [newChatObj, ...prev]);
      setActiveChatId(chatId);
      chatMessages = [];
    }

    const userMsg = { role: 'user', content: trimmed, id: generateId(), ts: Date.now() };
    const updatedMessages = [...chatMessages, userMsg];

    setChats(prev => prev.map(c => c.id === chatId
      ? { ...c, messages: updatedMessages, updatedAt: Date.now() }
      : c
    ));

    setStreaming(true);
    setStreamBuffer('');

    try {
      const controller = new AbortController();
      abortRef.current = controller;

      const res = await fetch(`${SERVER}/api/planora-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages.map(m => ({ role: m.role, content: m.content })) }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error || 'Request failed');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      let lineBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        lineBuffer += decoder.decode(value, { stream: true });
        const lines = lineBuffer.split('\n');
        lineBuffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;
          try {
            const json = JSON.parse(data);
            if (json.type === 'content_block_delta' && json.delta?.type === 'text_delta') {
              fullText += json.delta.text;
              setStreamBuffer(fullText);
            }
            if (json.error) throw new Error(json.error);
          } catch {}
        }
      }

      const assistantMsg = { role: 'assistant', content: fullText, id: generateId(), ts: Date.now() };
      setChats(prev => prev.map(c => c.id === chatId
        ? { ...c, messages: [...updatedMessages, assistantMsg], updatedAt: Date.now() }
        : c
      ));
      setStreamBuffer('');
    } catch (e) {
      if (e.name !== 'AbortError') {
        const errMsg = { role: 'assistant', content: `Something went wrong: ${e.message}. Please try again.`, id: generateId(), ts: Date.now(), error: true };
        setChats(prev => prev.map(c => c.id === chatId
          ? { ...c, messages: [...updatedMessages, errMsg], updatedAt: Date.now() }
          : c
        ));
        setStreamBuffer('');
      }
    } finally {
      setStreaming(false);
    }
  }, [input, activeChatId, messages, streaming]);

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function copyMessage(content, id) {
    navigator.clipboard.writeText(content);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  function stopStreaming() {
    abortRef.current?.abort();
    setStreaming(false);
  }

  return (
    <div className="flex bg-gray-950 text-white overflow-hidden" style={{ height: '100vh', width: '100vw', position: 'fixed', inset: 0 }}>

      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <div className="w-64 flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* Back to Terminal */}
        <div className="px-3 pt-3 pb-2 border-b border-gray-800/50">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors group"
          >
            <ChevronLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
            <span
              style={{
                fontWeight: 700,
                fontSize: '0.6rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'inherit',
              }}
            >
              Planora Terminal
            </span>
          </Link>
        </div>

        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Brain size={16} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Planora AI</div>
              <div className="text-xs text-gray-400">Financial Intelligence</div>
            </div>
          </div>
          <button
            onClick={newChat}
            className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={14} />
            New Conversation
          </button>
        </div>

        <div className="px-4 py-2 border-b border-gray-800">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-400">Live market data injected</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {chats.length === 0 ? (
            <div className="text-center text-gray-600 text-xs mt-8 px-4">
              Start a conversation to see it here
            </div>
          ) : (
            <div className="space-y-1">
              {chats.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => selectChat(chat.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg group flex items-start justify-between gap-2 transition-colors ${
                    activeChatId === chat.id ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{chat.title}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{formatTime(chat.updatedAt)}</div>
                  </div>
                  <button
                    onClick={(e) => deleteChat(chat.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all flex-shrink-0 mt-0.5"
                  >
                    <Trash2 size={12} />
                  </button>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-gray-800">
          <div className="text-xs text-gray-600 text-center">Bloomberg Terminal × BlackRock Advisor</div>
        </div>
      </div>

      {/* ── Main Area ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Empty state */}
        {!activeChat && (
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-8 py-10">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-5">
              <Brain size={32} className="text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Planora AI</h1>
            <p className="text-gray-400 text-center max-w-lg mb-2 text-sm leading-relaxed">
              Bloomberg Terminal meets BlackRock advisor. Ask anything about markets, stocks, economics, financial planning, or how world events move money.
            </p>
            <p className="text-xs text-green-400/70 mb-8 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
              Live market data · Fed rates · CPI · S&P 500 · Treasury yields injected automatically
            </p>

            {/* Stock quick-analyze */}
            <div className="w-full max-w-2xl mb-6">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Search size={11} />
                Quick Stock Analysis — click any ticker or type $TICKER
              </div>
              <div className="flex flex-wrap gap-2">
                {STOCK_QUICK_PROMPTS.map(ticker => (
                  <button
                    key={ticker}
                    onClick={() => sendMessage(`Give me a full analysis of $${ticker} — current price, valuation, key fundamentals, strengths, risks, and your outlook.`)}
                    className="px-3 py-1.5 bg-gray-800 hover:bg-blue-600/20 border border-gray-700 hover:border-blue-500/50 text-gray-300 hover:text-white text-xs font-mono font-medium rounded-lg transition-all"
                  >
                    ${ticker}
                  </button>
                ))}
              </div>
            </div>

            {/* Suggested prompts */}
            <div className="w-full max-w-2xl">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Suggested Questions</div>
              <div className="grid grid-cols-1 gap-2">
                {SUGGESTED_PROMPTS.map(({ icon: Icon, text }, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(text)}
                    className="flex items-center gap-3 px-4 py-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 rounded-xl text-left transition-all group"
                  >
                    <Icon size={16} className="text-blue-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{text}</span>
                    <ChevronRight size={14} className="text-gray-600 flex-shrink-0 ml-auto group-hover:text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {activeChat && (
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 border border-gray-700'
                  }`}>
                    {msg.role === 'user' ? 'You' : <Brain size={14} className="text-blue-400" />}
                  </div>

                  <div className={`max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div className={`rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-sm'
                        : msg.error
                          ? 'bg-red-900/30 border border-red-800 text-red-300 rounded-tl-sm'
                          : 'bg-gray-800/80 border border-gray-700/50 rounded-tl-sm'
                    }`}>
                      {msg.role === 'user' ? (
                        <p className="text-sm">{msg.content}</p>
                      ) : (
                        <MessageContent content={msg.content} />
                      )}
                    </div>

                    {msg.role === 'assistant' && !msg.error && (
                      <button
                        onClick={() => copyMessage(msg.content, msg.id)}
                        className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-400 transition-colors px-1"
                      >
                        {copied === msg.id ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
                        {copied === msg.id ? 'Copied' : 'Copy'}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Streaming */}
              {streaming && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg flex-shrink-0 bg-gray-800 border border-gray-700 flex items-center justify-center">
                    <Brain size={14} className="text-blue-400" />
                  </div>
                  <div className="max-w-[85%]">
                    <div className="bg-gray-800/80 border border-gray-700/50 rounded-2xl rounded-tl-sm px-4 py-3">
                      {streamBuffer ? (
                        <MessageContent content={streamBuffer} />
                      ) : (
                        <div className="flex items-center gap-2 text-gray-400">
                          <Loader2 size={14} className="animate-spin" />
                          <span className="text-sm">Fetching live data &amp; analyzing...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="border-t border-gray-800 bg-gray-900/50 px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-3 bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 focus-within:border-blue-500/50 transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about markets, stocks ($AAPL), economics, or financial planning..."
                rows={1}
                style={{ resize: 'none', minHeight: '24px', maxHeight: '160px' }}
                className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none leading-relaxed"
                onInput={e => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
                }}
              />
              {streaming ? (
                <button
                  onClick={stopStreaming}
                  className="flex-shrink-0 w-8 h-8 rounded-xl bg-red-600 hover:bg-red-500 flex items-center justify-center transition-colors"
                  title="Stop"
                >
                  <RefreshCw size={14} className="text-white" />
                </button>
              ) : (
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim()}
                  className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    input.trim()
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Send size={14} />
                </button>
              )}
            </div>
            <p className="text-xs text-gray-600 text-center mt-2">
              Mention <span className="font-mono text-gray-500">$AAPL</span> or any ticker — Planora AI fetches live price &amp; fundamentals automatically · Enter to send
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
