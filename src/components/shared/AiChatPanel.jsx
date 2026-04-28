import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Bot, User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function AiChatPanel({ topic, systemContext }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const conversationHistory = messages.map(m => `${m.role}: ${m.content}`).join("\n");

    const prompt = `You are Planora, a professional financial education assistant.
Context: ${systemContext || topic || "General financial education"}

Previous conversation:
${conversationHistory}

User question: ${userMsg.content}

Respond in this format:
1. Quick Summary (1-2 sentences)
2. Deeper Explanation (bullet points)
3. Actionable Takeaway
4. Source References (cite credible sources)

Always use plain language. Define any jargon. Never give personalized financial advice - recommend consulting a CFP, CPA, or attorney for specific situations.`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true
    });

    setMessages(prev => [...prev, { role: "assistant", content: response }]);
    setLoading(false);
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: 520,
      borderRadius: "1rem", border: "1px solid var(--border-c)",
      background: "var(--surface)", overflow: "hidden"
    }}>
      {/* Header */}
      <div style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid var(--border-c)", display: "flex", alignItems: "center", gap: "0.625rem" }}>
        <div style={{ width: 28, height: 28, borderRadius: "8px", background: "var(--teal)18", border: "1px solid var(--teal)30", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Sparkles size={14} style={{ color: "var(--teal)" }} />
        </div>
        <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-1)" }}>Ask Planora</span>
        <span style={{ fontSize: "0.8125rem", color: "var(--text-3)" }}>—</span>
        <span style={{ fontSize: "0.8125rem", color: "var(--text-2)" }}>{topic}</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
        {messages.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", opacity: 0.5 }}>
            <Bot size={36} style={{ color: "var(--teal)", marginBottom: "0.75rem" }} />
            <p style={{ fontSize: "0.875rem", color: "var(--text-3)" }}>Ask any question about {topic}</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", gap: "0.625rem", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            {msg.role === "assistant" && (
              <div style={{ width: 28, height: 28, borderRadius: "8px", background: "var(--teal)18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                <Bot size={14} style={{ color: "var(--teal)" }} />
              </div>
            )}
            <div style={{
              maxWidth: "80%", borderRadius: "1rem", padding: "0.75rem 1rem",
              fontSize: "0.875rem", lineHeight: 1.6,
              background: msg.role === "user" ? "var(--blue)" : "var(--elevated)",
              color: "var(--text-1)",
            }}>
              {msg.role === "assistant" ? (
                <ReactMarkdown className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 prose-p:my-1 prose-li:my-0 prose-ul:my-1 prose-ol:my-1">
                  {msg.content}
                </ReactMarkdown>
              ) : (
                <p style={{ margin: 0 }}>{msg.content}</p>
              )}
            </div>
            {msg.role === "user" && (
              <div style={{ width: 28, height: 28, borderRadius: "8px", background: "var(--blue)20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                <User size={14} style={{ color: "var(--blue)" }} />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: "0.625rem" }}>
            <div style={{ width: 28, height: 28, borderRadius: "8px", background: "var(--teal)18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Loader2 size={14} style={{ color: "var(--teal)", animation: "spin 1s linear infinite" }} />
            </div>
            <div style={{ background: "var(--elevated)", borderRadius: "1rem", padding: "0.875rem 1.125rem", display: "flex", gap: "4px", alignItems: "center" }}>
              {[0, 0.15, 0.3].map((delay, i) => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--teal)", animation: `bounce 1s ${delay}s infinite` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid var(--border-c)" }}>
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} style={{ display: "flex", gap: "0.5rem" }}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            style={{ background: "var(--bg)", border: "1px solid var(--border-c)", color: "var(--text-1)", flex: 1, height: 40 }}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              width: 40, height: 40, borderRadius: "0.625rem", border: "none",
              background: input.trim() && !loading ? "var(--teal)" : "var(--elevated)",
              color: input.trim() && !loading ? "#000" : "var(--text-3)",
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              transition: "background 0.15s"
            }}
          >
            <Send size={15} />
          </button>
        </form>
      </div>

      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }`}</style>
    </div>
  );
}
