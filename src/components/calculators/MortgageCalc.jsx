import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import GlassCard from "../shared/GlassCard";
import { Home, DollarSign } from "lucide-react";

export default function MortgageCalc() {
  const [homePrice, setHomePrice] = useState("300000");
  const [downPayment, setDownPayment] = useState("60000");
  const [interestRate, setInterestRate] = useState("6.5");
  const [loanTerm, setLoanTerm] = useState("30");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const price = parseFloat(homePrice) || 0;
    const down = parseFloat(downPayment) || 0;
    const principal = price - down;
    const rate = (parseFloat(interestRate) || 0) / 100 / 12;
    const months = (parseInt(loanTerm) || 0) * 12;

    const monthlyPayment = principal * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    const totalPaid = monthlyPayment * months;
    const totalInterest = totalPaid - principal;
    const downPercent = (down / price) * 100;

    setResult({
      monthlyPayment: Math.round(monthlyPayment),
      totalPaid: Math.round(totalPaid),
      totalInterest: Math.round(totalInterest),
      principal: Math.round(principal),
      downPercent: Math.round(downPercent)
    });
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Home className="w-5 h-5 text-[#3b82f6]" />
        <h3 className="text-lg font-semibold text-white">Mortgage Calculator</h3>
      </div>

      <GlassCard className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label className="text-[#94a3b8] text-xs mb-1">Home Price ($)</Label>
            <Input value={homePrice} onChange={(e) => setHomePrice(e.target.value)} type="number" className="bg-[#0a0e17] border-[#1e293b] text-white" />
          </div>
          <div>
            <Label className="text-[#94a3b8] text-xs mb-1">Down Payment ($)</Label>
            <Input value={downPayment} onChange={(e) => setDownPayment(e.target.value)} type="number" className="bg-[#0a0e17] border-[#1e293b] text-white" />
          </div>
          <div>
            <Label className="text-[#94a3b8] text-xs mb-1">Interest Rate (%)</Label>
            <Input value={interestRate} onChange={(e) => setInterestRate(e.target.value)} type="number" step="0.1" className="bg-[#0a0e17] border-[#1e293b] text-white" />
          </div>
          <div>
            <Label className="text-[#94a3b8] text-xs mb-1">Loan Term (years)</Label>
            <Input value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} type="number" className="bg-[#0a0e17] border-[#1e293b] text-white" />
          </div>
        </div>
        <Button onClick={calculate} className="bg-[#3b82f6] hover:bg-[#3b82f6]/80 text-white w-full md:w-auto">
          Calculate Payment
        </Button>
      </GlassCard>

      {result && (
        <div>
          <GlassCard className="mb-4">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#1e293b]">
              <div>
                <p className="text-xs text-[#64748b] uppercase tracking-wider mb-1">Monthly Payment</p>
                <p className="text-4xl font-bold text-[#3b82f6]">${result.monthlyPayment.toLocaleString()}</p>
              </div>
              <DollarSign className="w-12 h-12 text-[#3b82f6]/20" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#64748b]">Loan Amount</p>
                <p className="text-white font-semibold">${result.principal.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[#64748b]">Down Payment</p>
                <p className="text-white font-semibold">${downPayment} ({result.downPercent}%)</p>
              </div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard>
              <p className="text-xs text-[#64748b] uppercase tracking-wider mb-1">Total Amount Paid</p>
              <p className="text-2xl font-bold text-[#f59e0b]">${result.totalPaid.toLocaleString()}</p>
              <p className="text-xs text-[#94a3b8] mt-1">Over {loanTerm} years</p>
            </GlassCard>
            <GlassCard>
              <p className="text-xs text-[#64748b] uppercase tracking-wider mb-1">Total Interest Paid</p>
              <p className="text-2xl font-bold text-[#ef4444]">${result.totalInterest.toLocaleString()}</p>
              <p className="text-xs text-[#94a3b8] mt-1">{((result.totalInterest / result.principal) * 100).toFixed(0)}% of loan amount</p>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}