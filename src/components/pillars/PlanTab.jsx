import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Loader2, ClipboardList, CheckSquare, Square } from "lucide-react";
import ReactMarkdown from "react-markdown";
import GlassCard from "../shared/GlassCard";

export default function PlanTab({ pillar, pillarLabel }) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checklist, setChecklist] = useState([]);
  const [checked, setChecked] = useState({});

  const generatePlan = async () => {
    setLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are MoneyTalks, a financial education AI. Generate a comprehensive planning checklist and action steps for "${pillarLabel}" planning.

Include:
1. A prioritized checklist of 10-15 action items
2. For each item, include: what to do, why it matters, and estimated time/cost
3. Key documents needed
4. Professionals to consult (CFP, CPA, attorney, etc.)
5. Common mistakes to avoid
6. Timeline recommendation

Format the checklist items clearly. This is educational, not personalized advice.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          overview: { type: "string" },
          checklist: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                priority: { type: "string" }
              }
            }
          },
          tips: { type: "string" }
        }
      }
    });
    setPlan(res);
    setChecklist(res.checklist || []);
    setLoading(false);
  };

  const toggleCheck = (i) => {
    setChecked(prev => ({ ...prev, [i]: !prev[i] }));
  };

  if (!plan && !loading) {
    return (
      <div className="text-center py-16">
        <ClipboardList className="w-12 h-12 text-[#00d4aa] mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold text-white mb-2">Your Planning Checklist</h3>
        <p className="text-sm text-[#94a3b8] mb-6">Get a personalized action plan for {pillarLabel}</p>
        <Button onClick={generatePlan} className="bg-[#00d4aa] hover:bg-[#00d4aa]/80 text-black font-medium">
          Generate Plan
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-[#00d4aa] animate-spin mb-3" />
        <p className="text-sm text-[#94a3b8]">Creating your plan...</p>
      </div>
    );
  }

  return (
    <div>
      {plan?.overview && (
        <GlassCard className="mb-6">
          <ReactMarkdown className="prose prose-sm prose-invert max-w-none prose-p:text-[#e2e8f0]">
            {plan.overview}
          </ReactMarkdown>
        </GlassCard>
      )}

      <div className="space-y-3 mb-6">
        {checklist.map((item, i) => (
          <GlassCard key={i} hover onClick={() => toggleCheck(i)} className="!p-4">
            <div className="flex items-start gap-3">
              {checked[i] ? (
                <CheckSquare className="w-5 h-5 text-[#00d4aa] flex-shrink-0 mt-0.5" />
              ) : (
                <Square className="w-5 h-5 text-[#64748b] flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`text-sm font-medium ${checked[i] ? "text-[#00d4aa] line-through" : "text-white"}`}>
                  {item.title}
                </p>
                <p className="text-xs text-[#94a3b8] mt-1">{item.description}</p>
                {item.priority && (
                  <span className={`inline-block mt-2 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                    item.priority === "high" ? "bg-[#ef4444]/10 text-[#ef4444]" :
                    item.priority === "medium" ? "bg-[#f59e0b]/10 text-[#f59e0b]" :
                    "bg-[#3b82f6]/10 text-[#3b82f6]"
                  }`}>
                    {item.priority}
                  </span>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {plan?.tips && (
        <GlassCard>
          <h4 className="text-sm font-semibold text-[#f59e0b] mb-2">Tips & Common Mistakes</h4>
          <ReactMarkdown className="prose prose-sm prose-invert max-w-none prose-p:text-[#e2e8f0]">
            {plan.tips}
          </ReactMarkdown>
        </GlassCard>
      )}
    </div>
  );
}