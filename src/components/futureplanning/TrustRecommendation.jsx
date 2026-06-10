import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Heart, Gift, CheckCircle2, Info } from "lucide-react";
import GlassCard from "../shared/GlassCard";
import { base44 } from "@/api/base44Client";
import { stripSources } from "@/utils/stripSources";

const trustTypes = [
  {
    id: "revocable_living",
    name: "Revocable Living Trust",
    icon: Shield,
    color: "#00d4aa",
    pros: [
      "Avoid probate court",
      "Maintain control - can modify anytime",
      "Privacy - not public record",
      "Easy to manage during lifetime",
      "Flexibility to change beneficiaries"
    ],
    cons: [
      "No estate tax benefits",
      "Assets still in your taxable estate",
      "Requires ongoing management",
      "Must retitle assets into trust"
    ],
    bestFor: "Most people wanting to avoid probate and maintain flexibility",
    afterDeath: "Assets pass directly to beneficiaries, no probate, you maintain full control until death"
  },
  {
    id: "irrevocable",
    name: "Irrevocable Trust",
    icon: Lock,
    color: "#3b82f6",
    pros: [
      "Estate tax reduction",
      "Asset protection from creditors",
      "Medicaid planning benefits",
      "Reduce estate taxes for high net worth",
      "Protects assets from lawsuits"
    ],
    cons: [
      "Cannot be changed or revoked",
      "Lose control of assets",
      "Complex to establish",
      "May trigger gift taxes",
      "Less flexibility"
    ],
    bestFor: "High net worth estates ($13M+) or asset protection needs",
    afterDeath: "Assets removed from taxable estate, distributed per trust terms, creditor protected"
  },
  {
    id: "special_needs",
    name: "Special Needs Trust",
    icon: Heart,
    color: "#ec4899",
    pros: [
      "Preserve government benefits",
      "Supplement SSI/Medicaid",
      "Professional trustee management",
      "Protect vulnerable beneficiaries",
      "Tax advantages"
    ],
    cons: [
      "Complex rules and regulations",
      "Requires specialized attorney",
      "Trustee management fees",
      "Limited spending flexibility"
    ],
    bestFor: "Beneficiaries with disabilities receiving government aid",
    afterDeath: "Funds managed for disabled beneficiary without affecting benefits"
  },
  {
    id: "charitable",
    name: "Charitable Trust",
    icon: Gift,
    color: "#f59e0b",
    pros: [
      "Immediate tax deduction",
      "Avoid capital gains tax",
      "Support causes you care about",
      "Receive income for life",
      "Estate tax benefits"
    ],
    cons: [
      "Irrevocable commitment",
      "Complex setup",
      "Assets go to charity eventually",
      "Minimum funding requirements"
    ],
    bestFor: "Philanthropic goals with significant assets",
    afterDeath: "Remaining assets go to charity, family gets income stream first"
  }
];

export default function TrustRecommendation({ assets, beneficiaries, totalValue, onSelectTrust, selectedTrust, onNext, onBack }) {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  const hasMinors = beneficiaries.some(b => b.age && b.age < 18);
  const hasSpecialNeeds = beneficiaries.some(b => b.notes?.toLowerCase().includes("special needs") || b.notes?.toLowerCase().includes("disability"));
  const isHighNetWorth = totalValue > 13000000;

  useEffect(() => {
    getRecommendation();
  }, []);

  const getRecommendation = async () => {
    setLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an estate planning advisor. Based on this information, recommend the best trust type and explain why:

Total Estate Value: $${totalValue.toLocaleString()}
Assets: ${assets.map(a => `${a.name} ($${a.value.toLocaleString()})`).join(", ")}
Beneficiaries: ${beneficiaries.map(b => `${b.name} (${b.relationship}, age ${b.age || "adult"})`).join(", ")}
Has minors: ${hasMinors}
Has special needs beneficiaries: ${hasSpecialNeeds}
High net worth (>$13M): ${isHighNetWorth}

Recommend one of: Revocable Living Trust, Irrevocable Trust, Special Needs Trust, or Charitable Trust.
Explain in 2-3 paragraphs why this is best for their situation.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          recommended_trust: { type: "string" },
          reasoning: { type: "string" },
          key_considerations: { type: "array", items: { type: "string" } },
          next_steps: { type: "array", items: { type: "string" } }
        }
      }
    });
    // Strip sources from AI response
    if (res) {
      res.reasoning = stripSources(res.reasoning);
      if (res.key_considerations) {
        res.key_considerations = res.key_considerations.map(item => stripSources(item));
      }
      if (res.next_steps) {
        res.next_steps = res.next_steps.map(item => stripSources(item));
      }
    }
    setRecommendation(res);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {recommendation && (
        <GlassCard className="border-[#8b5cf6]/30">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-5 h-5 text-[#8b5cf6] mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Recommendation</h3>
              <p className="text-sm text-[#e2e8f0] mb-3">{recommendation.reasoning}</p>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#94a3b8]">Key Considerations:</p>
                <ul className="space-y-1">
                  {recommendation.key_considerations?.map((item, idx) => (
                    <li key={idx} className="text-xs text-[#94a3b8] flex items-start gap-2">
                      <span className="text-[#8b5cf6]">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      <h3 className="text-xl font-bold text-white">Choose Your Trust Type</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trustTypes.map((trust) => {
          const Icon = trust.icon;
          const isSelected = selectedTrust === trust.id;
          const isRecommended = recommendation?.recommended_trust?.toLowerCase().includes(trust.id.replace("_", " "));

          return (
            <GlassCard
              key={trust.id}
              className={`cursor-pointer transition-all touch-manipulation active:scale-95 ${
                isSelected
                  ? "border-[#8b5cf6]/50 bg-[#8b5cf6]/5"
                  : "hover:border-[#8b5cf6]/30"
              }`}
              onClick={() => onSelectTrust(trust.id, {})}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectTrust(trust.id, {})}
              aria-label={`Select ${trust.name} trust type`}
              aria-pressed={isSelected}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${trust.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: trust.color }} />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white">{trust.name}</h4>
                    {isRecommended && (
                      <span className="text-xs text-[#8b5cf6] font-semibold">Recommended</span>
                    )}
                  </div>
                </div>
                {isSelected && <CheckCircle2 className="w-6 h-6 text-[#8b5cf6]" />}
              </div>

              <p className="text-xs text-[#94a3b8] mb-3">{trust.bestFor}</p>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-[#00d4aa] mb-1">Pros:</p>
                  <ul className="space-y-1">
                    {trust.pros.slice(0, 3).map((pro, idx) => (
                      <li key={idx} className="text-xs text-[#e2e8f0] flex items-start gap-1">
                        <span className="text-[#00d4aa]">✓</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#ef4444] mb-1">Cons:</p>
                  <ul className="space-y-1">
                    {trust.cons.slice(0, 2).map((con, idx) => (
                      <li key={idx} className="text-xs text-[#94a3b8] flex items-start gap-1">
                        <span className="text-[#ef4444]">✗</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-[#1e293b]">
                  <p className="text-xs font-semibold text-[#f59e0b] mb-1">After Death:</p>
                  <p className="text-xs text-[#94a3b8]">{trust.afterDeath}</p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline" className="border-[#1e293b] text-[#94a3b8] touch-manipulation active:scale-95" aria-label="Go back to beneficiaries step">
          Back to Beneficiaries
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedTrust}
          className="bg-[#8b5cf6] hover:bg-[#8b5cf6]/80 touch-manipulation active:scale-95"
          aria-label="Review estate plan"
        >
          Review Estate Plan
        </Button>
      </div>
    </div>
  );
}