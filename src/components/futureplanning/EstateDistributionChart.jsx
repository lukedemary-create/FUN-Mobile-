import React from "react";
import { ArrowRight, User, DollarSign } from "lucide-react";
import GlassCard from "../shared/GlassCard";

export default function EstateDistributionChart({ assets, beneficiaries, trustType }) {
  const totalValue = assets.reduce((sum, a) => sum + (a.value || 0), 0);

  const trustTypeNames = {
    revocable_living: "Revocable Living Trust",
    irrevocable: "Irrevocable Trust",
    special_needs: "Special Needs Trust",
    charitable: "Charitable Trust",
    testamentary: "Testamentary Trust"
  };

  return (
    <GlassCard>
      <h3 className="text-lg font-semibold text-white mb-6">Estate Distribution Flow</h3>

      <div className="space-y-8">
        {/* Your Estate */}
        <div className="flex items-center justify-center">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#8b5cf6]/20 to-[#3b82f6]/20 border border-[#8b5cf6]/30 text-center min-w-[280px]">
            <p className="text-xs text-[#94a3b8] mb-1">Your Estate</p>
            <p className="text-3xl font-bold text-white mb-2">${totalValue.toLocaleString()}</p>
            <p className="text-xs text-[#8b5cf6]">{assets.length} Assets</p>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center">
          <ArrowRight className="w-8 h-8 text-[#64748b]" />
        </div>

        {/* Trust */}
        {trustType && (
          <>
            <div className="flex items-center justify-center">
              <div className="p-5 rounded-xl bg-[#0a0e17] border border-[#1e293b] text-center min-w-[280px]">
                <p className="text-sm font-semibold text-white mb-1">
                  {trustTypeNames[trustType] || "Trust"}
                </p>
                <p className="text-xs text-[#94a3b8]">
                  {trustType === "revocable_living" && "Avoids probate, maintains flexibility"}
                  {trustType === "irrevocable" && "Tax benefits, asset protection"}
                  {trustType === "special_needs" && "Preserves government benefits"}
                  {trustType === "charitable" && "Tax deduction, legacy giving"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <ArrowRight className="w-8 h-8 text-[#64748b]" />
            </div>
          </>
        )}

        {/* Beneficiaries */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {beneficiaries.map((beneficiary, idx) => {
            const inheritanceAmount = (totalValue * beneficiary.percentage) / 100;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-gradient-to-br from-[#00d4aa]/10 to-[#3b82f6]/10 border border-[#00d4aa]/20"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#00d4aa]/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-[#00d4aa]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{beneficiary.name}</p>
                    <p className="text-xs text-[#64748b] capitalize">{beneficiary.relationship}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#94a3b8]">Share:</span>
                    <span className="text-sm font-bold text-[#00d4aa]">{beneficiary.percentage}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#94a3b8]">Amount:</span>
                    <span className="text-sm font-bold text-white">
                      ${inheritanceAmount.toLocaleString()}
                    </span>
                  </div>

                  {beneficiary.age && beneficiary.age < 18 && (
                    <div className="pt-2 border-t border-[#1e293b]">
                      <p className="text-xs text-[#f59e0b]">
                        Minor — {beneficiary.guardian ? `Guardian: ${beneficiary.guardian}` : "Needs guardian"}
                      </p>
                    </div>
                  )}

                  {beneficiary.notes && (
                    <div className="pt-2 border-t border-[#1e293b]">
                      <p className="text-xs text-[#94a3b8]">{beneficiary.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="pt-6 border-t border-[#1e293b]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-[#64748b] mb-1">Total Distributed</p>
              <p className="text-xl font-bold text-[#00d4aa]">${totalValue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-[#64748b] mb-1">Beneficiaries</p>
              <p className="text-xl font-bold text-[#3b82f6]">{beneficiaries.length}</p>
            </div>
            <div>
              <p className="text-xs text-[#64748b] mb-1">Est. Probate Savings</p>
              <p className="text-xl font-bold text-[#8b5cf6]">
                {trustType === "revocable_living" || trustType === "irrevocable"
                  ? `$${((totalValue * 0.03) + 5000).toLocaleString()}`
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}