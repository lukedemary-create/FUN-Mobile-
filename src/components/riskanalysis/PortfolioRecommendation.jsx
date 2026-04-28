import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { TrendingUp, Shield, Zap, Award, DollarSign, Info } from "lucide-react";
import GlassCard from "../shared/GlassCard";
import { Badge } from "@/components/ui/badge";
import StatCard from "../shared/StatCard";
import MonteCarloSimulation from "./MonteCarloSimulation";
import StressTest from "./StressTest";
import { getArchetypeForScore } from "../../lib/riskScoringEngine";

const CATEGORY_COLORS = {
  "Fixed Income & Cash": "#3b82f6",
  "Fixed Income": "#3b82f6",
  "Equities": "#00d4aa",
  "Equities (Defensive)": "#4CAF50",
  "Alternatives": "#f59e0b",
  "Alternatives & Inflation Hedges": "#ec4899"
};



export default function PortfolioRecommendation({ riskProfile }) {
  const profile = getArchetypeForScore(riskProfile.score);
  const score = riskProfile.score;
  
  // Group allocations by category and assign colors
  const allocationsWithColors = profile.allocation.map(item => ({
    ...item,
    color: CATEGORY_COLORS[item.category] || "#64748b"
  }));

  return (
    <div className="space-y-6">
      <GlassCard className="border-[#00d4aa]/30">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{profile.name} Portfolio</h2>
            <p className="text-[#94a3b8]">{profile.description}</p>
          </div>
          <Badge className="bg-[#00d4aa]/20 text-[#00d4aa] border-[#00d4aa]/30 px-4 py-1">
            <Shield className="w-4 h-4 mr-1" />
            {profile.riskLevel} Risk
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          <StatCard label="Risk Score" value={`${score}/100`} icon={Shield} color="#ec4899" />
          <StatCard label="Expected Return" value={profile.expectedAnnualReturn} icon={TrendingUp} color="#00d4aa" />
          <StatCard label="Volatility" value={profile.expectedVolatility} icon={Zap} color="#f59e0b" />
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Allocation Chart */}
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4">Asset Allocation</h3>
          <div className="w-full overflow-visible">
            <ResponsiveContainer width="100%" height={500}>
              <PieChart margin={{ top: 30, right: 30, bottom: 80, left: 30 }}>
                <Pie
                  data={profile.allocation}
                  cx="50%"
                  cy="35%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="percent"
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = outerRadius + 35;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text 
                        x={x} 
                        y={y} 
                        fill="#f1f5f9" 
                        textAnchor={x > cx ? 'start' : 'end'} 
                        dominantBaseline="central"
                        className="text-sm font-bold"
                        style={{ fontSize: '14px' }}
                      >
                        {`${percent}%`}
                      </text>
                    );
                  }}
                  labelLine={{ stroke: "#64748b", strokeWidth: 1.5 }}
                >
                  {allocationsWithColors.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke="#0a0e17"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: "#111827", 
                    border: "1px solid #1e293b", 
                    borderRadius: "12px",
                    padding: "12px",
                    color: "#f1f5f9"
                  }}
                  itemStyle={{ color: "#f1f5f9" }}
                  labelStyle={{ color: "#f1f5f9" }}
                  formatter={(value, name, props) => [
                    `${value}% - ${props.payload.rationale}`,
                    props.payload.name
                  ]}
                />
                <Legend 
                  verticalAlign="bottom"
                  height={80}
                  wrapperStyle={{ 
                    fontSize: "11px", 
                    paddingTop: "30px",
                    width: "100%",
                    overflow: "visible"
                  }}
                  iconSize={10}
                  layout="horizontal"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Allocation Breakdown */}
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4">Portfolio Holdings</h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {allocationsWithColors.map((asset, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#0a0e17] border border-[#1e293b]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-[#64748b]">{asset.category}</span>
                  <span className="text-sm font-bold" style={{ color: asset.color }}>{asset.percent}%</span>
                </div>
                <div className="font-semibold text-sm text-white mb-1">{asset.name}</div>
                <p className="text-xs text-[#94a3b8]">{asset.rationale}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Portfolio Insights */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-[#00d4aa]" />
          <h3 className="text-lg font-semibold text-white">Portfolio Characteristics</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#0a0e17] border border-[#1e293b]">
            <div className="text-xs text-[#64748b] mb-1">Max Historical Drawdown</div>
            <div className="text-xl font-bold text-[#ef4444]">{profile.maxHistoricalDrawdown}</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0a0e17] border border-[#1e293b]">
            <div className="text-xs text-[#64748b] mb-1">Risk Label</div>
            <div className="text-xl font-bold" style={{ color: profile.colorCode }}>{profile.riskLabel}</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0a0e17] border border-[#1e293b]">
            <div className="text-xs text-[#64748b] mb-1">Score Range</div>
            <div className="text-xl font-bold text-white">{profile.scoreRange.min}–{profile.scoreRange.max}</div>
          </div>
        </div>
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-[#00d4aa]/5 to-[#3b82f6]/5 border border-[#00d4aa]/20">
          <p className="text-sm text-[#e2e8f0] italic">"{profile.tagline}"</p>
        </div>
      </GlassCard>

      {/* Strategy Notes */}
      <GlassCard className="bg-gradient-to-br from-[#00d4aa]/5 to-[#3b82f6]/5 border-[#00d4aa]/20">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-[#00d4aa] mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-white mb-2">Portfolio Strategy Notes</h4>
            <ul className="space-y-2 text-sm text-[#94a3b8]">
              <li>• Rebalance quarterly or when allocations drift 5%+ from targets</li>
              <li>• Consider tax-loss harvesting opportunities in taxable accounts</li>
              <li>• Keep 3-6 months expenses in cash/equivalents as emergency fund</li>
              <li>• Adjust allocation as you age or goals change</li>
              <li>• Review and update annually with a certified financial advisor</li>
            </ul>
          </div>
        </div>
      </GlassCard>

      {/* Monte Carlo Simulation */}
      <MonteCarloSimulation profile={profile} />

      {/* Stress Test */}
      <StressTest profile={profile} />
    </div>
  );
}