import React, { useState, useMemo } from "react";
import GlassCard from "../shared/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, TrendingDown, Zap, Target, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function toMonthly(amount, frequency) {
  const a = parseFloat(amount) || 0;
  if (frequency === "annual") return a / 12;
  if (frequency === "weekly") return a * 4.33;
  if (frequency === "bi-weekly") return a * 2.17;
  return a;
}

function simulatePayoff(debts, extraMonthly, method) {
  const items = debts
    .filter(d => (parseFloat(d.balance) || 0) > 0)
    .map(d => ({
      name: d.name,
      remaining: parseFloat(d.balance) || 0,
      rate: parseFloat(d.interest_rate) || 0,
      minPayment: parseFloat(d.monthly_payment) || 0
    }));

  if (items.length === 0) return { months: 0, totalInterest: 0 };

  if (method === "avalanche") {
    items.sort((a, b) => b.rate - a.rate);
  } else {
    items.sort((a, b) => a.remaining - b.remaining);
  }

  const totalBudget = items.reduce((s, d) => s + d.minPayment, 0) + (parseFloat(extraMonthly) || 0);
  let totalInterest = 0;
  let month = 0;

  while (items.some(d => d.remaining > 0.01) && month < 600) {
    month++;

    items.forEach(d => {
      if (d.remaining <= 0) return;
      const interest = d.remaining * (d.rate / 100 / 12);
      totalInterest += interest;
      d.remaining += interest;
    });

    let budget = totalBudget;
    const target = items.find(d => d.remaining > 0);

    items.forEach(d => {
      if (d === target || d.remaining <= 0) return;
      const payment = Math.min(d.remaining, d.minPayment);
      d.remaining = Math.max(0, d.remaining - payment);
      budget -= payment;
    });

    if (target) {
      target.remaining = Math.max(0, target.remaining - budget);
    }

    items.forEach(d => { if (d.remaining < 0.01) d.remaining = 0; });
  }

  return { months: month, totalInterest: Math.round(totalInterest) };
}

function formatMonths(months) {
  if (!months || months <= 0) return "Debt Free!";
  const yrs = Math.floor(months / 12);
  const mos = months % 12;
  if (yrs === 0) return `${mos} months`;
  if (mos === 0) return `${yrs} years`;
  return `${yrs}yr ${mos}mo`;
}

function debtFreeDate(months) {
  if (!months || months <= 0) return "Now!";
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function DebtPayoffTab({ plan }) {
  const [extraPayment, setExtraPayment] = useState("");
  const [method, setMethod] = useState("avalanche");

  const liabilities = plan.liabilities || [];

  // Net cash flow for suggesting extra payment
  const monthlyIncome = (plan.monthly_income || 0) +
    (plan.additional_income || []).reduce((s, i) => s + toMonthly(i.amount, i.frequency), 0);
  const totalExpenses = (plan.expenses || []).reduce((s, e) => s + toMonthly(e.amount, e.frequency), 0);
  const goalsMonthly = (plan.goals || []).reduce((s, g) => s + (parseFloat(g.monthly_contribution) || 0), 0);
  const efContrib = parseFloat(plan.emergency_fund?.monthly_contribution) || 0;
  const netCashFlow = Math.max(0, monthlyIncome - totalExpenses - goalsMonthly - efContrib);

  const totalDebt = liabilities.reduce((s, d) => s + (parseFloat(d.balance) || 0), 0);
  const totalMinPayments = liabilities.reduce((s, d) => s + (parseFloat(d.monthly_payment) || 0), 0);
  const avgRate = liabilities.length > 0
    ? liabilities.reduce((s, d) => s + (parseFloat(d.interest_rate) || 0), 0) / liabilities.length
    : 0;

  const extra = parseFloat(extraPayment) || 0;
  const avalanche = useMemo(() => simulatePayoff(liabilities, extra, "avalanche"), [liabilities, extra]);
  const snowball = useMemo(() => simulatePayoff(liabilities, extra, "snowball"), [liabilities, extra]);
  const noExtra = useMemo(() => simulatePayoff(liabilities, 0, "avalanche"), [liabilities]);

  const interestSaved = Math.max(0, noExtra.totalInterest - avalanche.totalInterest);
  const monthsSaved = Math.max(0, noExtra.months - avalanche.months);

  const chartData = liabilities
    .filter(d => (parseFloat(d.balance) || 0) > 0)
    .map(d => ({
      name: (d.name || "Debt").length > 14 ? (d.name || "Debt").slice(0, 14) + "…" : (d.name || "Debt"),
      Balance: parseFloat(d.balance) || 0,
    }));

  if (liabilities.length === 0) {
    return (
      <div className="text-center py-20 text-[#64748b]">
        <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="text-lg font-semibold text-white mb-2">No Debts Entered</p>
        <p className="text-sm">Add your liabilities in the <span className="text-[#3b82f6]">Accounts & Net Worth</span> tab to use the debt payoff calculator.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <GlassCard className="p-4">
          <p className="text-xs text-[#64748b] uppercase tracking-wider mb-1">Total Debt</p>
          <p className="text-xl font-bold text-[#ef4444]">${totalDebt.toLocaleString()}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-xs text-[#64748b] uppercase tracking-wider mb-1">Min Payments</p>
          <p className="text-xl font-bold text-[#f59e0b]">${totalMinPayments.toLocaleString()}/mo</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-xs text-[#64748b] uppercase tracking-wider mb-1">Avg Interest Rate</p>
          <p className="text-xl font-bold text-[#3b82f6]">{avgRate.toFixed(1)}%</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-xs text-[#64748b] uppercase tracking-wider mb-1">Available Extra</p>
          <p className="text-xl font-bold text-[#00d4aa]">${netCashFlow.toFixed(0)}/mo</p>
          <p className="text-xs text-[#64748b]">from net cash flow</p>
        </GlassCard>
      </div>

      {/* Extra Payment Input */}
      <GlassCard>
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#f59e0b]" /> Extra Monthly Payment
        </h3>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <p className="text-xs text-[#64748b] mb-1">Extra Amount Above Minimums</p>
            <div className="flex items-center gap-2">
              <span className="text-[#94a3b8]">$</span>
              <Input
                type="number"
                value={extraPayment}
                onChange={e => setExtraPayment(e.target.value)}
                placeholder="0"
                className="bg-[#0a0e17] border-[#1e293b] text-white w-32"
                aria-label="Extra monthly debt payment amount"
              />
              <span className="text-xs text-[#64748b]">/mo</span>
            </div>
          </div>
          {netCashFlow > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setExtraPayment(String(Math.floor(netCashFlow)))}
              className="border-[#00d4aa]/30 text-[#00d4aa] hover:bg-[#00d4aa]/10 text-xs touch-manipulation active:scale-95"
              aria-label={`Apply ${Math.floor(netCashFlow)} dollars available cash to extra debt payment`}
            >
              Use available cash (${Math.floor(netCashFlow)}/mo)
            </Button>
          )}
        </div>
        {interestSaved > 0 && extra > 0 && (
          <div className="mt-3 p-3 bg-[#00d4aa]/10 rounded-xl border border-[#00d4aa]/20 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-[#00d4aa] flex-shrink-0" />
            <span className="text-sm text-[#00d4aa]">
              Adding ${extra}/mo extra saves <strong>${interestSaved.toLocaleString()}</strong> in interest and gets you debt-free <strong>{formatMonths(monthsSaved)} sooner</strong>
            </span>
          </div>
        )}
      </GlassCard>

      {/* Method Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            key: "avalanche",
            label: "Avalanche Method",
            description: "Highest interest rate first — saves the most money.",
            result: avalanche,
            color: "#ef4444",
            tag: "Best for Saving Money"
          },
          {
            key: "snowball",
            label: "Snowball Method",
            description: "Smallest balance first — builds momentum with quick wins.",
            result: snowball,
            color: "#3b82f6",
            tag: "Best for Motivation"
          }
        ].map(m => (
          <div
            key={m.key}
            onClick={() => setMethod(m.key)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setMethod(m.key)}
            className={`rounded-2xl border-2 p-5 cursor-pointer transition-all touch-manipulation active:scale-95 ${method === m.key ? "border-opacity-60" : "border-[#1e293b] bg-[#111827]"}`}
            style={method === m.key ? { borderColor: m.color + "60", background: "#111827" } : {}}
            aria-label={`Select ${m.label} debt payoff strategy`}
            aria-pressed={method === m.key}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-white">{m.label}</p>
                <p className="text-xs text-[#64748b] mt-0.5">{m.description}</p>
              </div>
              {method === m.key && (
                <span className="text-xs px-2 py-0.5 rounded-full border" style={{ color: m.color, borderColor: m.color + "40", background: m.color + "15" }}>
                  Selected
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0a0e17] rounded-xl p-3">
                <p className="text-xs text-[#64748b] mb-1">Payoff Time</p>
                <p className="text-base font-bold text-white">{formatMonths(m.result.months)}</p>
                <p className="text-xs text-[#64748b]">{debtFreeDate(m.result.months)}</p>
              </div>
              <div className="bg-[#0a0e17] rounded-xl p-3">
                <p className="text-xs text-[#64748b] mb-1">Total Interest</p>
                <p className="text-base font-bold" style={{ color: m.color }}>${m.result.totalInterest.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payoff Order */}
      <GlassCard>
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-[#06b6d4]" />
          Payoff Order — {method === "avalanche" ? "Avalanche (Highest Rate First)" : "Snowball (Smallest Balance First)"}
        </h3>
        <div className="space-y-2">
          {[...liabilities]
            .filter(d => (parseFloat(d.balance) || 0) > 0)
            .sort((a, b) => method === "avalanche"
              ? (parseFloat(b.interest_rate) || 0) - (parseFloat(a.interest_rate) || 0)
              : (parseFloat(a.balance) || 0) - (parseFloat(b.balance) || 0)
            )
            .map((debt, idx) => (
              <div key={debt.id || idx} className="flex items-center gap-3 bg-[#0a0e17] rounded-xl px-4 py-3 border border-[#1e293b]">
                <div className="w-7 h-7 rounded-full bg-[#1e293b] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{debt.name || `Debt ${idx + 1}`}</p>
                  <p className="text-xs text-[#64748b]">{debt.liability_type || "Debt"}</p>
                </div>
                <div className="text-right mr-2">
                  <p className="text-sm font-bold text-[#ef4444]">${(parseFloat(debt.balance) || 0).toLocaleString()}</p>
                  <p className="text-xs text-[#64748b]">{parseFloat(debt.interest_rate) || 0}% APR</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#94a3b8]">${(parseFloat(debt.monthly_payment) || 0).toLocaleString()}/mo</p>
                  <p className="text-xs text-[#64748b]">min payment</p>
                </div>
              </div>
            ))}
        </div>
      </GlassCard>

      {/* Balance Chart */}
      {chartData.length > 1 && (
        <GlassCard>
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#f59e0b]" /> Debt Balances Overview
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "#111827", border: "1px solid #1e293b", borderRadius: "8px", color: "#f1f5f9" }}
                itemStyle={{ color: "#f1f5f9" }}
                labelStyle={{ color: "#f1f5f9" }}
                formatter={v => [`$${v.toLocaleString()}`, "Balance"]}
              />
              <Bar dataKey="Balance" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      )}
    </div>
  );
}