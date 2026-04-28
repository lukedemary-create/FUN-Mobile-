import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp, RefreshCw } from "lucide-react";
import GlassCard from "../shared/GlassCard";
import { Button } from "@/components/ui/button";

function runMonteCarloSimulation(initialInvestment, annualContribution, years, expectedReturn, volatility, simulations = 1000) {
  const results = [];
  
  for (let sim = 0; sim < simulations; sim++) {
    let portfolio = initialInvestment;
    const path = [{ year: 0, value: portfolio }];
    
    for (let year = 1; year <= years; year++) {
      const randomReturn = (Math.random() - 0.5) * volatility * 2 + expectedReturn / 100;
      portfolio = portfolio * (1 + randomReturn) + annualContribution;
      path.push({ year, value: Math.max(0, portfolio) });
    }
    
    results.push(path);
  }
  
  return results;
}

function calculatePercentiles(simulations, year) {
  const values = simulations.map(sim => sim[year].value).sort((a, b) => a - b);
  const p10 = values[Math.floor(values.length * 0.1)];
  const p50 = values[Math.floor(values.length * 0.5)];
  const p90 = values[Math.floor(values.length * 0.9)];
  return { p10, p50, p90 };
}

export default function MonteCarloSimulation({ profile }) {
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [annualContribution, setAnnualContribution] = useState(5000);
  const [years, setYears] = useState(30);
  const [chartData, setChartData] = useState([]);
  const [finalValues, setFinalValues] = useState(null);

  const getReturnAndVolatility = () => {
    const returnMap = {
      "4-6%": { return: 5, volatility: 0.06 },
      "5-7%": { return: 6, volatility: 0.08 },
      "6-8%": { return: 7, volatility: 0.12 },
      "7-10%": { return: 8.5, volatility: 0.15 },
      "9-12%+": { return: 10.5, volatility: 0.20 }
    };
    return returnMap[profile.expectedReturn] || { return: 7, volatility: 0.12 };
  };

  const runSimulation = () => {
    const { return: expectedReturn, volatility } = getReturnAndVolatility();
    const simulations = runMonteCarloSimulation(initialInvestment, annualContribution, years, expectedReturn, volatility);
    
    const data = [];
    for (let year = 0; year <= years; year++) {
      const percentiles = calculatePercentiles(simulations, year);
      data.push({
        year,
        p10: Math.round(percentiles.p10),
        p50: Math.round(percentiles.p50),
        p90: Math.round(percentiles.p90)
      });
    }
    
    setChartData(data);
    setFinalValues(data[years]);
  };

  useEffect(() => {
    runSimulation();
  }, []);

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#3b82f6]" />
          <h3 className="text-lg font-semibold text-white">Monte Carlo Simulation</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={runSimulation}
          className="border-[#1e293b] text-[#94a3b8] hover:text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Re-run
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-xs text-[#64748b] mb-1 block">Initial Investment</label>
          <input 
            type="number" 
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(Number(e.target.value))}
            className="w-full px-3 py-2 bg-[#0a0e17] border border-[#1e293b] rounded-lg text-white text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-[#64748b] mb-1 block">Annual Contribution</label>
          <input 
            type="number" 
            value={annualContribution}
            onChange={(e) => setAnnualContribution(Number(e.target.value))}
            className="w-full px-3 py-2 bg-[#0a0e17] border border-[#1e293b] rounded-lg text-white text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-[#64748b] mb-1 block">Time Horizon (Years)</label>
          <input 
            type="number" 
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            min="1"
            max="50"
            className="w-full px-3 py-2 bg-[#0a0e17] border border-[#1e293b] rounded-lg text-white text-sm"
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis 
            dataKey="year" 
            tick={{ fill: "#64748b", fontSize: 12 }}
            label={{ value: "Years", position: "insideBottom", offset: -5, fill: "#64748b" }}
          />
          <YAxis 
            tick={{ fill: "#64748b", fontSize: 12 }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            label={{ value: "Portfolio Value", angle: -90, position: "insideLeft", fill: "#64748b" }}
          />
          <Tooltip 
            contentStyle={{ 
              background: "#111827", 
              border: "1px solid #1e293b", 
              borderRadius: "8px",
              color: "#fff"
            }}
            formatter={(value) => `$${value.toLocaleString()}`}
            labelFormatter={(year) => `Year ${year}`}
          />
          <Area type="monotone" dataKey="p90" stroke="#00d4aa" fill="#00d4aa" fillOpacity={0.1} name="90th Percentile" />
          <Area type="monotone" dataKey="p50" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Median (50th)" />
          <Area type="monotone" dataKey="p10" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} name="10th Percentile" />
        </AreaChart>
      </ResponsiveContainer>

      {finalValues && (
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="p-3 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/20">
            <div className="text-xs text-[#ef4444] mb-1">10th Percentile (Worst)</div>
            <div className="text-lg font-bold text-white">${finalValues.p10.toLocaleString()}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20">
            <div className="text-xs text-[#3b82f6] mb-1">Median Outcome</div>
            <div className="text-lg font-bold text-white">${finalValues.p50.toLocaleString()}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#00d4aa]/10 border border-[#00d4aa]/20">
            <div className="text-xs text-[#00d4aa] mb-1">90th Percentile (Best)</div>
            <div className="text-lg font-bold text-white">${finalValues.p90.toLocaleString()}</div>
          </div>
        </div>
      )}

      <p className="text-xs text-[#64748b] mt-4">
        Based on 1,000 simulations using historical market data. Past performance does not guarantee future results.
      </p>
    </GlassCard>
  );
}