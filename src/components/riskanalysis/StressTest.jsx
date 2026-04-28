import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import GlassCard from "../shared/GlassCard";
import stressTestData from "../../data/stressTests.json";

export default function StressTest({ profile }) {
  const [expandedScenario, setExpandedScenario] = useState(null);
  
  const scenarios = stressTestData.scenarios.map(scenario => ({
    ...scenario,
    estimatedDrawdown: profile.stressTest[scenario.id]?.estimatedDrawdown || "N/A",
    notes: profile.stressTest[scenario.id]?.notes || ""
  }));

  const chartData = scenarios.map(s => ({
    name: s.name,
    impact: parseFloat(s.estimatedDrawdown.replace(/[^0-9.-]/g, ''))
  }));

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="w-5 h-5 text-[#f59e0b]" />
        <h3 className="text-lg font-semibold text-white">Historical Stress Test Analysis</h3>
      </div>

      <p className="text-sm text-[#94a3b8] mb-6">
        How your {profile.name} portfolio would have performed during major market crises:
      </p>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis 
            type="number" 
            tick={{ fill: "#64748b", fontSize: 12 }}
            label={{ value: "Estimated Drawdown (%)", position: "insideBottom", offset: -5, fill: "#64748b" }}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            tick={{ fill: "#64748b", fontSize: 11 }}
            width={160}
          />
          <Tooltip 
            contentStyle={{ 
              background: "#111827", 
              border: "1px solid #1e293b", 
              borderRadius: "8px",
              color: "#fff"
            }}
            labelStyle={{ color: "#fff" }}
            itemStyle={{ color: "#fff" }}
            formatter={(value) => [`${value > 0 ? '+' : ''}${value}%`, "Drawdown"]}
          />
          <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.impact >= 0 ? "#00d4aa" : "#ef4444"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
        {scenarios.map((scenario, idx) => (
          <div key={idx} className="rounded-xl bg-[#0a0e17] border border-[#1e293b] overflow-hidden">
            <button
              onClick={() => setExpandedScenario(expandedScenario === idx ? null : idx)}
              className="w-full p-4 text-left hover:bg-[#1e293b]/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white mb-1">{scenario.name}</div>
                  <div className="text-xs text-[#64748b]">{scenario.dateRange}</div>
                  <div className={`text-xl font-bold mt-2 ${parseFloat(scenario.estimatedDrawdown.replace(/[^0-9.-]/g, '')) >= 0 ? "text-[#00d4aa]" : "text-[#ef4444]"}`}>
                    {scenario.estimatedDrawdown}
                  </div>
                </div>
                {expandedScenario === idx ? (
                  <ChevronUp className="w-5 h-5 text-[#64748b]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#64748b]" />
                )}
              </div>
            </button>
            
            {expandedScenario === idx && (
              <div className="p-4 pt-0 space-y-3 border-t border-[#1e293b]">
                <div>
                  <div className="text-xs font-semibold text-[#64748b] mb-1">Portfolio Notes</div>
                  <p className="text-sm text-[#94a3b8]">{scenario.notes}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#64748b] mb-1">Historical Impact</div>
                  <p className="text-sm text-[#94a3b8]">{scenario.peakTrough}</p>
                  <p className="text-xs text-[#64748b] mt-1">{scenario.duration} • {scenario.recoveryTime}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#64748b] mb-1">What Happened</div>
                  <p className="text-sm text-[#94a3b8]">{scenario.triggerSummary}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#00d4aa] mb-1">What Held Up</div>
                  <div className="flex flex-wrap gap-1">
                    {scenario.whatHeld.map((item, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/20">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#ef4444] mb-1">What Fell</div>
                  <div className="flex flex-wrap gap-1">
                    {scenario.whatFell.map((item, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-[#1e293b]">
                  <div className="text-xs font-semibold text-[#f59e0b] mb-1">Key Lesson</div>
                  <p className="text-sm text-[#94a3b8] italic">{scenario.recoveryLesson}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/20">
        <p className="text-sm text-[#e2e8f0]">
          <strong className="text-[#f59e0b]">Important:</strong> These are estimated drawdowns based on the portfolio's asset allocation and historical data. 
          Your actual results may vary based on specific holdings, market conditions, timing, and portfolio rebalancing discipline.
        </p>
      </div>
    </GlassCard>
  );
}