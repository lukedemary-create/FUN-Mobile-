import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Info } from "lucide-react";
import GlassCard from "../shared/GlassCard";
import { base44 } from "@/api/base44Client";

export default function TrustProjections({ assets, trustType }) {
  const [projections, setProjections] = useState(null);
  const [loading, setLoading] = useState(false);

  const investableAssets = assets.filter(
    (a) => a.type === "investment_account" || a.type === "retirement_account" || a.type === "bank_account"
  );
  const totalInvestable = investableAssets.reduce((sum, a) => sum + a.value, 0);

  useEffect(() => {
    if (totalInvestable > 0) {
      generateProjections();
    }
  }, [assets, trustType]);

  const generateProjections = async () => {
    setLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Calculate trust investment projections for these assets:
${investableAssets.map((a) => `${a.name}: $${a.value.toLocaleString()}`).join("\n")}
Total Investable: $${totalInvestable.toLocaleString()}
Trust Type: ${trustType}

Provide year-by-year projections for 30 years assuming:
- Conservative allocation (5% annual return)
- Moderate allocation (7% annual return)
- Growth allocation (9% annual return)

Account for:
- Trust management fees (0.5-1% annually)
- Required distributions if applicable
- Estate tax impacts
- Inflation

Return projections for each year (year 0 to 30) with conservative, moderate, and growth scenarios.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          projections: {
            type: "array",
            items: {
              type: "object",
              properties: {
                year: { type: "number" },
                conservative: { type: "number" },
                moderate: { type: "number" },
                growth: { type: "number" }
              }
            }
          },
          conservative_total: { type: "string" },
          moderate_total: { type: "string" },
          growth_total: { type: "string" },
          assumptions: { type: "string" }
        }
      }
    });
    setProjections(res);
    setLoading(false);
  };

  if (totalInvestable === 0) {
    return (
      <GlassCard>
        <div className="text-center py-8">
          <Info className="w-12 h-12 text-[#64748b] mx-auto mb-3" />
          <p className="text-sm text-[#94a3b8]">
            No investable assets detected. Add investment accounts, retirement accounts, or bank accounts to see projections.
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-[#00d4aa]" />
        <h3 className="text-lg font-semibold text-white">Trust Investment Projections</h3>
      </div>

      <p className="text-sm text-[#94a3b8] mb-6">
        30-year growth projections for ${totalInvestable.toLocaleString()} in investable trust assets
      </p>

      {projections && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-center">
              <p className="text-xs text-[#94a3b8] mb-1">Conservative (5%)</p>
              <p className="text-xl font-bold text-[#3b82f6]">{projections.conservative_total}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#00d4aa]/10 border border-[#00d4aa]/20 text-center">
              <p className="text-xs text-[#94a3b8] mb-1">Moderate (7%)</p>
              <p className="text-xl font-bold text-[#00d4aa]">{projections.moderate_total}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#ec4899]/10 border border-[#ec4899]/20 text-center">
              <p className="text-xs text-[#94a3b8] mb-1">Growth (9%)</p>
              <p className="text-xl font-bold text-[#ec4899]">{projections.growth_total}</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={projections.projections}>
              <defs>
                <linearGradient id="conservativeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="moderateGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d4aa" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00d4aa" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 11 }} label={{ value: "Years", position: "insideBottom", offset: -5, fill: "#64748b" }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
              <Tooltip
                contentStyle={{
                  background: "#111827",
                  border: "1px solid #1e293b",
                  borderRadius: "12px",
                  color: "#fff"
                }}
                formatter={(v) => `$${v.toLocaleString()}`}
              />
              <Legend />
              <Area type="monotone" dataKey="conservative" stroke="#3b82f6" fill="url(#conservativeGrad)" strokeWidth={2} name="Conservative" />
              <Area type="monotone" dataKey="moderate" stroke="#00d4aa" fill="url(#moderateGrad)" strokeWidth={2} name="Moderate" />
              <Area type="monotone" dataKey="growth" stroke="#ec4899" fill="url(#growthGrad)" strokeWidth={2} name="Growth" />
            </AreaChart>
          </ResponsiveContainer>

          <div className="mt-6 p-4 rounded-xl bg-[#0a0e17] border border-[#1e293b]">
            <p className="text-xs font-semibold text-[#94a3b8] mb-2">Key Assumptions:</p>
            <p className="text-xs text-[#94a3b8] leading-relaxed">{projections.assumptions}</p>
          </div>
        </>
      )}
    </GlassCard>
  );
}