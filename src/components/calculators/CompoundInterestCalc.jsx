import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MobileSelect, MobileSelectItem, MobileSelectContent } from "@/components/ui/mobile-select";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import GlassCard from "../shared/GlassCard";
import { Calculator, TrendingUp } from "lucide-react";

export default function CompoundInterestCalc() {
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("30");
  const [contribution, setContribution] = useState("500");
  const [frequency, setFrequency] = useState("monthly");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const p = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const t = parseInt(years) || 0;
    const pmt = parseFloat(contribution) || 0;
    const n = frequency === "monthly" ? 12 : frequency === "quarterly" ? 4 : frequency === "yearly" ? 1 : 12;

    let chartData = [];
    let totalContributions = p;
    
    for (let year = 0; year <= t; year++) {
      const periods = year * n;
      const fv = p * Math.pow(1 + r/n, periods) + pmt * ((Math.pow(1 + r/n, periods) - 1) / (r/n));
      const contributed = p + (pmt * periods);
      const interest = fv - contributed;
      
      chartData.push({
        year,
        total: Math.round(fv),
        contributed: Math.round(contributed),
        interest: Math.round(interest)
      });
    }

    const final = chartData[chartData.length - 1];
    setResult({
      finalValue: final.total,
      totalContributed: final.contributed,
      totalInterest: final.interest,
      chartData
    });
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-[#00d4aa]" />
        <h3 className="text-lg font-semibold text-white">Compound Interest Calculator</h3>
      </div>

      <GlassCard className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label className="text-[#94a3b8] text-xs mb-1">Initial Investment ($)</Label>
            <Input value={principal} onChange={(e) => setPrincipal(e.target.value)} type="number" className="bg-[#0a0e17] border-[#1e293b] text-white" />
          </div>
          <div>
            <Label className="text-[#94a3b8] text-xs mb-1">Annual Interest Rate (%)</Label>
            <Input value={rate} onChange={(e) => setRate(e.target.value)} type="number" step="0.1" className="bg-[#0a0e17] border-[#1e293b] text-white" />
          </div>
          <div>
            <Label className="text-[#94a3b8] text-xs mb-1">Time Period (years)</Label>
            <Input value={years} onChange={(e) => setYears(e.target.value)} type="number" className="bg-[#0a0e17] border-[#1e293b] text-white" />
          </div>
          <div>
            <Label className="text-[#94a3b8] text-xs mb-1">Regular Contribution ($)</Label>
            <Input value={contribution} onChange={(e) => setContribution(e.target.value)} type="number" className="bg-[#0a0e17] border-[#1e293b] text-white" />
          </div>
          <div>
            <Label className="text-[#94a3b8] text-xs mb-1">Contribution Frequency</Label>
            <MobileSelect value={frequency} onValueChange={setFrequency} placeholder="Frequency" className="bg-[#0a0e17] border-[#1e293b] text-white">
              <MobileSelectContent>
                <MobileSelectItem value="monthly">Monthly</MobileSelectItem>
                <MobileSelectItem value="quarterly">Quarterly</MobileSelectItem>
                <MobileSelectItem value="yearly">Yearly</MobileSelectItem>
              </MobileSelectContent>
            </MobileSelect>
          </div>
        </div>
        <Button onClick={calculate} className="bg-[#00d4aa] hover:bg-[#00d4aa]/80 text-black w-full md:w-auto">
          Calculate
        </Button>
      </GlassCard>

      {result && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <GlassCard>
              <p className="text-xs text-[#64748b] uppercase tracking-wider mb-1">Final Value</p>
              <p className="text-2xl font-bold text-[#00d4aa]">${result.finalValue.toLocaleString()}</p>
            </GlassCard>
            <GlassCard>
              <p className="text-xs text-[#64748b] uppercase tracking-wider mb-1">Total Contributed</p>
              <p className="text-2xl font-bold text-[#3b82f6]">${result.totalContributed.toLocaleString()}</p>
            </GlassCard>
            <GlassCard>
              <p className="text-xs text-[#64748b] uppercase tracking-wider mb-1">Interest Earned</p>
              <p className="text-2xl font-bold text-[#f59e0b]">${result.totalInterest.toLocaleString()}</p>
            </GlassCard>
          </div>

          <GlassCard>
            <h4 className="text-sm font-semibold text-white mb-4">Growth Over Time</h4>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={result.chartData}>
                <defs>
                  <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00d4aa" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#00d4aa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid #1e293b", borderRadius: "12px", color: "#fff" }} formatter={(v) => `$${v.toLocaleString()}`} />
                <Area type="monotone" dataKey="total" stroke="#00d4aa" fill="url(#totalGrad)" strokeWidth={2} name="Total Value" />
                <Area type="monotone" dataKey="contributed" stroke="#3b82f6" fill="none" strokeWidth={1} strokeDasharray="5 5" name="Contributions" />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
      )}
    </div>
  );
}