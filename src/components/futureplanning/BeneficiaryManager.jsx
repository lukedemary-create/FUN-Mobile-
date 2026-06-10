import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MobileSelect, MobileSelectItem, MobileSelectContent } from "@/components/ui/mobile-select";
import { Plus, Trash2, Users, User, Baby } from "lucide-react";
import GlassCard from "../shared/GlassCard";

export default function BeneficiaryManager({ beneficiaries, onUpdate, onNext, onBack }) {
  const [newBeneficiary, setNewBeneficiary] = useState({
    name: "",
    relationship: "",
    age: "",
    percentage: "",
    guardian: "",
    notes: ""
  });

  const addBeneficiary = () => {
    if (!newBeneficiary.name || !newBeneficiary.relationship || !newBeneficiary.percentage) {
      alert("Please fill in name, relationship, and allocation percentage");
      return;
    }
    onUpdate([...beneficiaries, { ...newBeneficiary, age: parseInt(newBeneficiary.age) || null, percentage: parseFloat(newBeneficiary.percentage) }]);
    setNewBeneficiary({ name: "", relationship: "", age: "", percentage: "", guardian: "", notes: "" });
  };

  const removeBeneficiary = (index) => {
    onUpdate(beneficiaries.filter((_, i) => i !== index));
  };

  const totalPercentage = beneficiaries.reduce((sum, b) => sum + (b.percentage || 0), 0);

  return (
    <div className="space-y-6">
      <GlassCard>
        <h3 className="text-lg font-semibold text-white mb-4">Add Beneficiaries</h3>
        <p className="text-sm text-[#94a3b8] mb-6">
          List the people or organizations who will inherit your estate. Specify what percentage each beneficiary receives.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label className="text-white text-sm mb-2 block font-medium">Full Name</Label>
            <Input
              value={newBeneficiary.name}
              onChange={(e) => setNewBeneficiary({ ...newBeneficiary, name: e.target.value })}
              placeholder="John Doe"
              className="bg-[#0a0e17] border-[#1e293b] text-white"
              aria-label="Beneficiary full name"
            />
          </div>

          <div>
            <Label className="text-white text-sm mb-2 block font-medium">Relationship</Label>
            <Select value={newBeneficiary.relationship} onValueChange={(value) => setNewBeneficiary({ ...newBeneficiary, relationship: value })}>
              <SelectTrigger className="bg-[#0a0e17] border-[#1e293b] text-white">
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent className="bg-[#111827] border-[#1e293b]">
                <SelectItem value="spouse" className="text-white hover:bg-[#1e293b]">Spouse</SelectItem>
                <SelectItem value="child" className="text-white hover:bg-[#1e293b]">Child</SelectItem>
                <SelectItem value="parent" className="text-white hover:bg-[#1e293b]">Parent</SelectItem>
                <SelectItem value="sibling" className="text-white hover:bg-[#1e293b]">Sibling</SelectItem>
                <SelectItem value="grandchild" className="text-white hover:bg-[#1e293b]">Grandchild</SelectItem>
                <SelectItem value="friend" className="text-white hover:bg-[#1e293b]">Friend</SelectItem>
                <SelectItem value="charity" className="text-white hover:bg-[#1e293b]">Charity/Organization</SelectItem>
                <SelectItem value="other" className="text-white hover:bg-[#1e293b]">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-white text-sm mb-2 block font-medium">Age (Optional)</Label>
            <Input
              type="number"
              value={newBeneficiary.age}
              onChange={(e) => setNewBeneficiary({ ...newBeneficiary, age: e.target.value })}
              placeholder="25"
              className="bg-[#0a0e17] border-[#1e293b] text-white"
              aria-label="Beneficiary age"
            />
          </div>

          <div>
            <Label className="text-white text-sm mb-2 block font-medium">Allocation (%)</Label>
            <Input
              type="number"
              value={newBeneficiary.percentage}
              onChange={(e) => setNewBeneficiary({ ...newBeneficiary, percentage: e.target.value })}
              placeholder="25"
              className="bg-[#0a0e17] border-[#1e293b] text-white"
              aria-label="Allocation percentage"
            />
          </div>

          <div>
            <Label className="text-white text-sm mb-2 block font-medium">Guardian (if minor)</Label>
            <Input
              value={newBeneficiary.guardian}
              onChange={(e) => setNewBeneficiary({ ...newBeneficiary, guardian: e.target.value })}
              placeholder="Jane Doe"
              className="bg-[#0a0e17] border-[#1e293b] text-white"
              aria-label="Guardian name for minor beneficiary"
            />
          </div>

          <div>
            <Label className="text-white text-sm mb-2 block font-medium">Special Instructions</Label>
            <Input
              value={newBeneficiary.notes}
              onChange={(e) => setNewBeneficiary({ ...newBeneficiary, notes: e.target.value })}
              placeholder="e.g., distribute at age 25"
              className="bg-[#0a0e17] border-[#1e293b] text-white"
              aria-label="Special instructions for beneficiary"
            />
          </div>
        </div>

        <Button onClick={addBeneficiary} className="bg-[#8b5cf6] hover:bg-[#8b5cf6]/80 w-full md:w-auto touch-manipulation active:scale-95" aria-label="Add beneficiary to estate plan">
          <Plus className="w-4 h-4 mr-2" />
          Add Beneficiary
        </Button>
      </GlassCard>

      {beneficiaries.length > 0 && (
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Your Beneficiaries</h3>
            <div className="text-right">
              <p className="text-xs text-[#94a3b8]">Total Allocated</p>
              <p className={`text-2xl font-bold ${totalPercentage === 100 ? "text-[#00d4aa]" : "text-[#f59e0b]"}`}>
                {totalPercentage}%
              </p>
            </div>
          </div>

          {totalPercentage !== 100 && (
            <div className="mb-4 p-3 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/30">
              <p className="text-xs text-[#f59e0b]">
                Total allocation should equal 100%. Currently: {totalPercentage}%
              </p>
            </div>
          )}

          <div className="space-y-3">
            {beneficiaries.map((beneficiary, idx) => {
              const getIcon = () => {
                if (beneficiary.age && beneficiary.age < 18) return Baby;
                if (beneficiary.relationship === "spouse") return Users;
                return User;
              };
              const Icon = getIcon();

              return (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-xl bg-[#0a0e17] border border-[#1e293b]"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#3b82f6]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-white">{beneficiary.name}</h4>
                        <p className="text-xs text-[#64748b] capitalize">
                          {beneficiary.relationship}
                          {beneficiary.age ? ` • Age ${beneficiary.age}` : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#00d4aa]">{beneficiary.percentage}%</p>
                      </div>
                    </div>
                    {beneficiary.guardian && (
                      <p className="text-xs text-[#94a3b8] mt-2">Guardian: {beneficiary.guardian}</p>
                    )}
                    {beneficiary.notes && (
                      <p className="text-xs text-[#94a3b8] mt-1">{beneficiary.notes}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBeneficiary(idx)}
                    className="text-[#ef4444] hover:text-[#ef4444] hover:bg-[#ef4444]/10"
                    aria-label={`Remove ${beneficiary.name} as beneficiary`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline" className="border-[#1e293b] text-[#94a3b8] touch-manipulation active:scale-95" aria-label="Go back to assets step">
          Back to Assets
        </Button>
        <Button
          onClick={onNext}
          disabled={beneficiaries.length === 0 || totalPercentage !== 100}
          className="bg-[#8b5cf6] hover:bg-[#8b5cf6]/80 touch-manipulation active:scale-95"
          aria-label="Continue to trust selection step"
        >
          Continue to Trust Selection
        </Button>
      </div>
    </div>
  );
}