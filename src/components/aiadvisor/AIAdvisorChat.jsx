import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import GlassCard from "../shared/GlassCard";
import { Send, Loader2, Sparkles, User, Download, CheckCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function AIAdvisorChat({ advisor }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationPhase, setConversationPhase] = useState("intake");
  const [collectedData, setCollectedData] = useState({});
  const [language, setLanguage] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    startConversation();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const detectLanguage = (text) => {
    const spanishPatterns = /\b(soy|tengo|quiero|necesito|mi|mis|años|ingresos|gastos|deuda|ahorro)\b/i;
    return spanishPatterns.test(text) ? 'es' : 'en';
  };

  const startConversation = () => {
    const greeting = `Hi! I'm your **${advisor.name}**.\n\nTo create your comprehensive financial analysis, I'll ask you a few questions to understand your situation. Let's start:\n\n**What is your age or age range?**`;
    setMessages([{ role: "assistant", content: greeting }]);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    console.log("Sending message:", userMessage);
    setInput("");
    
    // Detect language on first user message
    if (!language) {
      setLanguage(detectLanguage(userMessage));
    }

    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      console.log("Calling InvokeLLM...");
      const fullPrompt = `${advisor.masterPrompt}\n\n${advisor.systemPrompt}`;
      
      const conversationHistory = messages.map(m => 
        `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`
      ).join("\n\n");

      const prompt = `${fullPrompt}

CONVERSATION HISTORY:
${conversationHistory}

USER'S NEW MESSAGE: ${userMessage}

PHASE: ${conversationPhase}

INSTRUCTIONS:
${conversationPhase === "intake" ? `You are gathering required information. Ask your next batch of 2-3 questions. Once you have ALL required inputs, confirm the information with the user before building the report.` : conversationPhase === "confirmation" ? `User has provided info. Summarize what you know and ask: "Is this correct, or would you like to adjust anything before I build your report?"` : `Answer the user's follow-up question based on the report you generated.`}

${language === 'es' ? 'RESPOND IN SPANISH.' : 'RESPOND IN ENGLISH.'}`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        model: "claude_sonnet_4_6"
      });

      console.log("Got LLM response:", response);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);

      // Check if confirmation is being asked
      if (conversationPhase === "intake" && (response.toLowerCase().includes("is this correct") || response.toLowerCase().includes("please review") || response.toLowerCase().includes("before i build") || response.toLowerCase().includes("antes de generar"))) {
        setConversationPhase("confirmation");
      }

    } catch (error) {
      console.error("ERROR in sendMessage:", error);
      console.error("Error details:", error.message, error.stack);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `❌ Error: ${error.message || "I apologize, but I encountered an error. Please try again."}`
      }]);
    }

    setLoading(false);
  };

  const generateReport = async () => {
    setLoading(true);
    
    try {
      // Show generating message immediately
      const generatingMsg = language === 'es' 
        ? "📄 Generando su informe profesional en PDF..." 
        : "📄 Generating your professional PDF report...";
      
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: generatingMsg
      }]);

      // Generate report content from conversation
      const conversationHistory = messages.map(m => 
        `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`
      ).join("\n\n");

      const prompt = `You are generating a professional financial advisory report based on the following conversation.

${advisor.systemPrompt}

CONVERSATION HISTORY:
${conversationHistory}

TASK: Generate a complete, comprehensive, professional-grade report in clean markdown format following the exact structure specified in your advisor instructions above.

CRITICAL RULES:
- Output ONLY markdown text - NO JSON, NO function calls, NO code blocks
- Include ALL required sections from the advisor's report structure
- Use ## for main sections, ### for subsections
- Include specific numbers, dollar amounts, timelines from the conversation
- End with exactly 3 prioritized actions labeled CRITICAL, HIGH, and MEDIUM
- Be detailed and specific to THIS client's situation

${language === 'es' ? 'GENERATE THE ENTIRE REPORT IN SPANISH.' : 'GENERATE THE ENTIRE REPORT IN ENGLISH.'}`;

      const reportContent = await base44.integrations.Core.InvokeLLM({
        prompt,
        model: "claude_sonnet_4_6"
      });

      // Map advisor ID from advisor object
      const advisorIdMap = {
        'wealth_diagnostic': 1,
        'retirement_calculator': 2,
        'portfolio_architect': 3,
        'tax_optimizer': 4,
        'debt_eliminator': 5,
        'cash_strategy': 6,
        'insurance_audit': 7,
        'college_savings': 8,
        'estate_planning': 9,
        'real_estate': 10,
        'budget_builder': 11,
        'lifetime_roadmap': 12
      };

      const advisorId = advisorIdMap[advisor.id] || 1;

      // Generate PDF via backend (returns base64)
      const response = await base44.functions.invoke('generateAdvisorReport', {
        advisorId,
        reportContent,
        language: language || 'en'
      });

      // Decode base64 to binary
      const pdfData = response.data;
      if (!pdfData.pdf) {
        throw new Error('No PDF data received from server');
      }
      
      const binaryString = atob(pdfData.pdf);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const blob = new Blob([bytes], { type: 'application/pdf' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = pdfData.fileName || `${advisor.name.replace(/\s+/g, "_")}_Report.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Show success message with option to chat more
      const successMsg = language === 'es'
        ? "✅ **Informe descargado exitosamente**\n\nSu informe profesional en PDF se ha descargado. Puede hacer preguntas de seguimiento sobre el informe o solicitar aclaraciones sobre cualquier sección."
        : "✅ **Report Downloaded Successfully**\n\nYour professional PDF report has been downloaded. You can ask follow-up questions about the report or request clarification on any section.";
      
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: successMsg,
        isReport: true
      }]);
      
      setConversationPhase("followup");

    } catch (error) {
      console.error("Error:", error);
      const errorMsg = language === 'es'
        ? "Lo siento, encontré un error al generar su informe. Por favor, intente nuevamente."
        : "I apologize, but I encountered an error generating your report. Please try again.";
      
      setMessages(prev => [...prev, {
        role: "assistant",
        content: errorMsg
      }]);
    }
    setLoading(false);
  };



  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const showGenerateButton = conversationPhase === "confirmation" && !messages.some(m => m.isReport);

  return (
    <div className="max-w-4xl mx-auto">
      <GlassCard className="mb-4 border-2" style={{ borderColor: `${advisor.color}30` }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${advisor.color}15` }}>
            <advisor.icon className="w-6 h-6" style={{ color: advisor.color }} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{advisor.name}</h2>
            <p className="text-xs text-[#94a3b8]">Powered by Claude AI • Professional PDF reports</p>
          </div>
          {conversationPhase !== "intake" && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/30">
              <CheckCircle className="w-3 h-3 text-[#00d4aa]" />
              <span className="text-xs text-[#00d4aa] font-semibold">
                {conversationPhase === "confirmation" ? "Review" : "Report Ready"}
              </span>
            </div>
          )}
        </div>
      </GlassCard>

      <GlassCard className="mb-4 h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {messages.map((message, idx) => (
            <div key={idx} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1" style={{ background: `${advisor.color}20` }}>
                  <Sparkles className="w-4 h-4" style={{ color: advisor.color }} />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === "user" 
                  ? "bg-[#00d4aa] text-white" 
                  : message.isReport 
                    ? "bg-gradient-to-br from-[#111827] to-[#1a2332] border-2 border-[#00d4aa]/30"
                    : "bg-[#111827] border border-[#1e293b]"
              }`}>
                {message.role === "user" ? (
                  <p className="text-sm leading-relaxed">{message.content}</p>
                ) : (
                  <ReactMarkdown 
                    className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                    components={{
                      p: ({ children }) => <p className="text-sm text-[#e2e8f0] leading-relaxed mb-3 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="text-sm text-[#e2e8f0] space-y-1 mb-3 ml-4 list-disc">{children}</ul>,
                      ol: ({ children }) => <ol className="text-sm text-[#e2e8f0] space-y-1 mb-3 ml-4 list-decimal">{children}</ol>,
                      li: ({ children }) => <li className="text-[#e2e8f0]">{children}</li>,
                      strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                      h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-3 mt-4 first:mt-0">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xl font-bold text-white mb-2 mt-3 first:mt-0">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-base font-semibold text-white mb-2 mt-3 first:mt-0">{children}</h3>,
                      code: ({ children }) => <code className="bg-[#0a0e17] px-1.5 py-0.5 rounded text-xs text-[#00d4aa]">{children}</code>,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-lg bg-[#1e293b] flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-[#94a3b8]" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${advisor.color}20` }}>
                <Sparkles className="w-4 h-4" style={{ color: advisor.color }} />
              </div>
              <div className="bg-[#111827] border border-[#1e293b] rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#64748b] animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-[#64748b] animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <div className="w-2 h-2 rounded-full bg-[#64748b] animate-bounce" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="space-y-2">
          {showGenerateButton && (
            <div className="space-y-2">
              <div className="px-3 py-2 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/30">
                <p className="text-xs text-[#f59e0b] text-center">
                  ⏱️ PDF generation could take up to 5 minutes to develop
                </p>
              </div>
              <Button
                onClick={generateReport}
                className="w-full text-white font-semibold"
                style={{ background: advisor.color }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate My Complete Report
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                conversationPhase === "intake" 
                  ? "Answer the questions above..." 
                  : conversationPhase === "confirmation"
                    ? "Confirm or adjust your information..."
                    : "Ask follow-up questions... (Shift+Enter for new line)"
              }
              className="bg-[#0a0e17] border-[#1e293b] text-white resize-none"
              rows={3}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="h-full px-6"
              style={{ background: advisor.color }}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </GlassCard>

      <div className="text-center text-xs text-[#64748b] max-w-2xl mx-auto">
        This is educational guidance only, not personalized financial advice. Always consult a certified professional (CFP, CPA, attorney) before making financial decisions.
      </div>
    </div>
  );
}