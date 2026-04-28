import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MobileSelect, MobileSelectItem, MobileSelectContent } from "@/components/ui/mobile-select";
import GlassCard from "../shared/GlassCard";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Loader2, Sparkles, Shield, DollarSign } from "lucide-react";
import ReactMarkdown from "react-markdown";

function toMonthly(amount, frequency) {
  const a = parseFloat(amount) || 0;
  if (frequency === "annual") return a / 12;
  if (frequency === "weekly") return a * 4.33;
  if (frequency === "bi-weekly") return a * 2.17;
  return a;
}

export default function CashFlowTab({ plan, onChange }) {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGuidance, setAiGuidance] = useState(plan.ai_guidance || "");

  const monthlyIncome = (plan.monthly_income || 0) + 
    (plan.additional_income || []).reduce((s, i) => s + toMonthly(i.amount, i.frequency), 0);

  const needsTotal = (plan.expenses || []).filter(e => e.type === "need")
    .reduce((s, e) => s + toMonthly(e.amount, e.frequency), 0);
  const wantsTotal = (plan.expenses || []).filter(e => e.type === "want")
    .reduce((s, e) => s + toMonthly(e.amount, e.frequency), 0);
  const savingsTotal = (plan.expenses || []).filter(e => e.type === "saving")
    .reduce((s, e) => s + toMonthly(e.amount, e.frequency), 0);
  const debtTotal = (plan.expenses || []).filter(e => e.type === "debt")
    .reduce((s, e) => s + toMonthly(e.amount, e.frequency), 0);

  const efContrib = parseFloat(plan.emergency_fund?.monthly_contribution) || 0;
  const totalOut = needsTotal + wantsTotal + savingsTotal + debtTotal + efContrib;
  const netCashFlow = monthlyIncome - totalOut;

  const addIncomeSource = () => {
    const inc = [...(plan.additional_income || []), { id: Date.now().toString(), source: "", amount: 0, frequency: "monthly" }];
    onChange({ ...plan, additional_income: inc });
  };

  const removeIncome = (id) => onChange({ ...plan, additional_income: plan.additional_income.filter(i => i.id !== id) });
  const updateIncome = (id, field, value) => onChange({
    ...plan,
    additional_income: plan.additional_income.map(i => i.id === id ? { ...i, [field]: value } : i)
  });



  const runAiGuidance = async () => {
    setAiLoading(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a professional financial planner like NaviPlan / MoneyGuidePro. Analyze this client's cash flow and give prioritized, actionable guidance.

INCOME: $${monthlyIncome.toFixed(0)}/month total
  - Primary: $${plan.monthly_income || 0}/month
  - Other: ${(plan.additional_income || []).map(i => `${i.source} $${i.amount} ${i.frequency}`).join(", ") || "None"}

EXPENSES:
  - Needs: $${needsTotal.toFixed(0)}/mo | Wants: $${wantsTotal.toFixed(0)}/mo
  - Savings: $${savingsTotal.toFixed(0)}/mo | Debt Payments: $${debtTotal.toFixed(0)}/mo
  - Emergency Fund: $${efContrib}/mo

NET CASH FLOW: $${netCashFlow.toFixed(0)}/month

EMERGENCY FUND: Target ${plan.emergency_fund?.target_months || 0} months, Current $${plan.emergency_fund?.current_amount || 0}

GOALS:
${(plan.goals || []).map(g => `- ${g.name}: target $${g.target_amount} by ${g.target_date}, current $${g.current_amount}, contrib $${g.monthly_contribution}/mo, priority: ${g.priority}`).join("\n") || "None set"}

LIABILITIES: ${(plan.liabilities || []).map(l => `${l.name} $${l.balance} @ ${l.interest_rate}%`).join(", ") || "None"}

Please provide:
1. Cash flow health score (A-F) with explanation
2. Whether needs/wants/savings ratios are healthy (50/30/20 or pay-yourself-first analysis)
3. Emergency fund status and timeline to full funding
4. Goal priority order and where to direct available cash first (be specific: which goal, how much, why)
5. Debt payoff strategy if applicable (avalanche vs snowball recommendation)
6. Any red flags or immediate actions to take
7. 3 specific monthly optimizations with dollar amounts

Be specific, use the actual numbers, and direct the client clearly on where each dollar of the $${netCashFlow.toFixed(0)} net cash flow should go.`,
        response_json_schema: {
          type: "object",
          properties: {
            health_score: { type: "string" },
            summary: { type: "string" },
            ratio_analysis: { type: "string" },
            emergency_fund_guidance: { type: "string" },
            goal_priority_guidance: { type: "string" },
            debt_strategy: { type: "string" },
            red_flags: { type: "string" },
            optimizations: { type: "array", items: { type: "string" } },
            cash_allocation: { type: "string" }
          }
        }
      });
      const guidance = `## Cash Flow Score: ${res.health_score}

${res.summary}

### Needs/Wants/Savings Breakdown
${res.ratio_analysis}

### Emergency Fund
${res.emergency_fund_guidance}

### Goal Funding Priority
${res.goal_priority_guidance}

### Debt Strategy
${res.debt_strategy}

### Where Your Extra $${netCashFlow.toFixed(0)}/mo Should Go
${res.cash_allocation}

### Quick Wins (3 Monthly Optimizations)
${(res.optimizations || []).map((o, i) => `${i + 1}. ${o}`).join("\n")}

${res.red_flags ? `### ⚠️ Red Flags\n${res.red_flags}` : ""}`;
      setAiGuidance(guidance);
      onChange({ ...plan, ai_guidance: guidance });
    } catch (e) {
      console.error(e);
    }
    setAiLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Cash Flow Waterfall */}
      <GlassCard>
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[#00d4aa]" /> Monthly Cash Flow
        </h3>
        <div className="space-y-2">
          {[
            { label: "Total Income", value: monthlyIncome, color: "#00d4aa", positive: true },
            { label: "Needs", value: -needsTotal, color: "#3b82f6" },
            { label: "Wants", value: -wantsTotal, color: "#f59e0b" },
            { label: "Savings", value: -savingsTotal, color: "#8b5cf6" },
            { label: "Debt Payments", value: -debtTotal, color: "#ef4444" },
            { label: "Emergency Fund", value: -efContrib, color: "#ec4899" },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#1e293b] last:border-0">
              <span className="text-sm text-[#94a3b8]">{item.label}</span>
              <span className="text-sm font-semibold" style={{ color: item.value >= 0 ? "#00d4aa" : "#94a3b8" }}>
                {item.value >= 0 ? "+" : "-"}${Math.abs(item.value).toFixed(0)}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between py-3 mt-1">
            <span className="text-base font-bold text-white">Net Cash Flow</span>
            <span className={`text-xl font-bold ${netCashFlow >= 0 ? "text-[#00d4aa]" : "text-[#ef4444]"}`}>
              {netCashFlow >= 0 ? "+" : ""}${netCashFlow.toFixed(0)}/mo
            </span>
          </div>
        </div>
      </GlassCard>

      {/* Income Sources */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Income Sources</h3>
          <Button onClick={addIncomeSource} size="sm" className="bg-[#1e293b] hover:bg-[#334155] text-white text-xs border border-[#334155] touch-manipulation active:scale-95" aria-label="Add income source">
            <Plus className="w-3 h-3 mr-1" /> Add Source
          </Button>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1">
            <p className="text-sm text-white mb-1 font-medium">Primary Monthly Income</p>
            <div className="flex items-center gap-2">
              <span className="text-[#94a3b8] text-sm">$</span>
              <Input
                type="number"
                value={plan.monthly_income || ""}
                onChange={e => onChange({ ...plan, monthly_income: parseFloat(e.target.value) || 0 })}
                placeholder="Take-home pay"
                className="bg-[#0a0e17] border-[#1e293b] text-white"
                aria-label="Primary monthly income"
              />
              <span className="text-xs text-[#64748b]">/mo</span>
            </div>
          </div>
        </div>
        {(plan.additional_income || []).map(inc => (
          <div key={inc.id} className="flex items-center gap-2 mb-2 group">
            <Input value={inc.source} onChange={e => updateIncome(inc.id, "source", e.target.value)} placeholder="Source (e.g. rental, freelance)" className="bg-[#0a0e17] border-[#1e293b] text-white flex-1" aria-label="Income source name" />
            <Input type="number" value={inc.amount} onChange={e => updateIncome(inc.id, "amount", parseFloat(e.target.value) || 0)} className="bg-[#0a0e17] border-[#1e293b] text-white w-28" aria-label="Income amount" />
            <MobileSelect value={inc.frequency} onValueChange={v => updateIncome(inc.id, "frequency", v)} placeholder="Frequency" className="bg-[#0a0e17] border-[#1e293b] text-white w-28">
              <MobileSelectContent>
                <MobileSelectItem value="monthly">/ mo</MobileSelectItem>
                <MobileSelectItem value="annual">/ yr</MobileSelectItem>
                <MobileSelectItem value="weekly">/ wk</MobileSelectItem>
                <MobileSelectItem value="bi-weekly">bi-wk</MobileSelectItem>
              </MobileSelectContent>
            </MobileSelect>
            <button 
              onClick={() => removeIncome(inc.id)} 
              className="text-[#ef4444] opacity-0 group-hover:opacity-100 min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation active:scale-95"
              aria-label={`Remove ${inc.source} income source`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </GlassCard>

      {/* Emergency Fund */}
      <GlassCard>
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#ec4899]" /> Emergency Fund
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-sm text-white mb-1 font-medium">Target (months of expenses)</p>
            <Input type="number" value={plan.emergency_fund?.target_months || ""} onChange={e => onChange({ ...plan, emergency_fund: { ...plan.emergency_fund, target_months: parseInt(e.target.value) || 0 } })} placeholder="6" className="bg-[#0a0e17] border-[#1e293b] text-white" aria-label="Emergency fund target months" />
          </div>
          <div>
            <p className="text-sm text-white mb-1 font-medium">Current Amount ($)</p>
            <Input type="number" value={plan.emergency_fund?.current_amount || ""} onChange={e => onChange({ ...plan, emergency_fund: { ...plan.emergency_fund, current_amount: parseFloat(e.target.value) || 0 } })} className="bg-[#0a0e17] border-[#1e293b] text-white" aria-label="Current emergency fund amount" />
          </div>
          <div>
            <p className="text-sm text-white mb-1 font-medium">Monthly Contribution ($)</p>
            <Input type="number" value={plan.emergency_fund?.monthly_contribution || ""} onChange={e => onChange({ ...plan, emergency_fund: { ...plan.emergency_fund, monthly_contribution: parseFloat(e.target.value) || 0 } })} className="bg-[#0a0e17] border-[#1e293b] text-white" aria-label="Monthly emergency fund contribution" />
          </div>
        </div>
        {plan.emergency_fund?.target_months && needsTotal > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-[#64748b] mb-1">
              <span>Progress to {plan.emergency_fund.target_months}-month fund (${((needsTotal + debtTotal) * (plan.emergency_fund.target_months || 6)).toFixed(0)} target)</span>
              <span>{Math.min(100, ((plan.emergency_fund.current_amount || 0) / ((needsTotal + debtTotal) * (plan.emergency_fund.target_months || 6))) * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-[#0a0e17] rounded-full h-2">
              <div className="bg-[#ec4899] h-2 rounded-full" style={{ width: `${Math.min(100, ((plan.emergency_fund?.current_amount || 0) / ((needsTotal + debtTotal) * (plan.emergency_fund?.target_months || 6))) * 100)}%` }} />
            </div>
          </div>
        )}
      </GlassCard>

      {/* Cash Reserve */}
      <GlassCard>
        <h3 className="text-sm font-semibold text-white mb-3">Cash Reserve</h3>
        <p className="text-sm text-white mb-2 font-medium">Additional liquid cash buffer beyond emergency fund</p>
        <div className="flex items-center gap-3">
          <span className="text-[#94a3b8]">$</span>
          <Input type="number" value={plan.cash_reserve || ""} onChange={e => onChange({ ...plan, cash_reserve: parseFloat(e.target.value) || 0 })} placeholder="0" className="bg-[#0a0e17] border-[#1e293b] text-white w-40" aria-label="Cash reserve amount" />
        </div>
      </GlassCard>

      {/* AI Guidance */}
      <GlassCard className="border-[#8b5cf6]/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#8b5cf6] flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> AI Financial Planner Guidance
          </h3>
          <Button onClick={runAiGuidance} disabled={aiLoading} className="bg-[#8b5cf6] hover:bg-[#8b5cf6]/80 text-white text-xs touch-manipulation active:scale-95" aria-label={aiGuidance ? "Re-analyze cash flow" : "Analyze cash flow"}>
            {aiLoading ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Sparkles className="w-3 h-3 mr-2" />}
            {aiGuidance ? "Re-analyze" : "Analyze My Cash Flow"}
          </Button>
        </div>
        {aiLoading && (
          <div className="flex items-center gap-3 py-8 justify-center text-[#94a3b8]">
            <Loader2 className="w-5 h-5 animate-spin text-[#8b5cf6]" />
            <span>Analyzing your complete financial picture...</span>
          </div>
        )}
        {aiGuidance && !aiLoading && (
          <ReactMarkdown className="prose prose-sm prose-invert max-w-none prose-headings:text-[#e2e8f0] prose-p:text-[#94a3b8] prose-li:text-[#94a3b8]">
            {aiGuidance}
          </ReactMarkdown>
        )}
        {!aiGuidance && !aiLoading && (
          <p className="text-[#64748b] text-sm text-center py-6">Fill in your income, expenses, and goals then click Analyze to get personalized guidance on exactly where each dollar should go.</p>
        )}
      </GlassCard>
    </div>
  );
}