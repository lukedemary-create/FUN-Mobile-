import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Calculator } from "lucide-react";
import ReactMarkdown from "react-markdown";
import GlassCard from "../shared/GlassCard";
import CompoundInterestCalc from "../calculators/CompoundInterestCalc";
import RetirementCalc from "../calculators/RetirementCalc";
import MortgageCalc from "../calculators/MortgageCalc";
import TaxSavingsCalc from "../calculators/TaxSavingsCalc";

export default function DoTab({ pillar, pillarLabel }) {
  const [scenario, setScenario] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runScenario = async () => {
    if (!scenario.trim()) return;
    setLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are MoneyTalks, a financial education AI. The user wants to explore an interactive scenario related to "${pillarLabel}" planning.

Their scenario/question: "${scenario}"

Provide:
1. A detailed walkthrough of the scenario with numbers and calculations
2. Step-by-step breakdown
3. What-if variations (show 2-3 different outcomes)
4. Key takeaways
5. Important considerations they might be missing

Use real-world examples, approximate calculations, and credible source references. Use plain language. This is educational, not personal advice.`,
      add_context_from_internet: true
    });
    setResult(res);
    setLoading(false);
  };

  const sampleScenarios = {
    estate: "I have $500K in assets. What does an estate plan look like?",
    taxes: "I earn $85K/year. How can I reduce my tax burden legally?",
    trust: "When does it make sense to set up a living trust?",
    financial: "I'm 30 with $50K savings. How should I allocate my investments?",
    retirement: "I'm 25, contributing 6% to my 401(k). Am I on track?",
    insurance: "What types of insurance does a family of 4 typically need?"
  };

  // Map pillar to calculator component
  const getCalculator = () => {
    if (pillar === "financial") return <CompoundInterestCalc />;
    if (pillar === "retirement") return <RetirementCalc />;
    if (pillar === "taxes") return <TaxSavingsCalc />;
    return null;
  };

  const calculator = getCalculator();

  return (
    <div>
      {calculator && (
        <div className="mb-8">
          {calculator}
        </div>
      )}

      <GlassCard className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-[#00d4aa]" />
          <h3 className="text-lg font-semibold text-white">AI Scenario Analysis</h3>
        </div>
        <p className="text-sm text-[#94a3b8] mb-4">
          Describe a scenario and get a detailed walkthrough with calculations and what-if analysis.
        </p>
        <div className="space-y-3">
          <Label className="text-[#94a3b8] text-xs">Your Scenario</Label>
          <Input
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            placeholder={sampleScenarios[pillar] || "Describe your scenario..."}
            className="bg-[#0a0e17] border-[#1e293b] text-white placeholder:text-[#64748b]"
          />
          <div className="flex gap-2">
            <Button onClick={runScenario} disabled={loading || !scenario.trim()} className="bg-[#00d4aa] hover:bg-[#00d4aa]/80 text-black">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Run Scenario
            </Button>
            <Button variant="outline" onClick={() => setScenario(sampleScenarios[pillar] || "")} className="border-[#1e293b] text-[#94a3b8] hover:text-white hover:bg-[#1e293b]">
              Try Example
            </Button>
          </div>
        </div>
      </GlassCard>

      {result && (
        <GlassCard>
          <ReactMarkdown className="prose prose-sm prose-invert max-w-none prose-headings:text-white prose-p:text-[#e2e8f0] prose-strong:text-[#00d4aa]">
            {result}
          </ReactMarkdown>
        </GlassCard>
      )}
    </div>
  );
}