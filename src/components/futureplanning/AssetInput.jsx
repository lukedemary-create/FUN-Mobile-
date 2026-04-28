import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MobileNativeSelect } from "@/components/ui/mobile-native-select";
import { Plus, Trash2, Home, Briefcase, DollarSign, Car, Heart, Building } from "lucide-react";
import GlassCard from "../shared/GlassCard";

const assetTypes = [
  { value: "house", label: "Primary Residence", icon: Home },
  { value: "investment_account", label: "Investment Account", icon: DollarSign },
  { value: "retirement_account", label: "Retirement Account (401k/IRA)", icon: Briefcase },
  { value: "business", label: "Business Ownership", icon: Building },
  { value: "vehicle", label: "Vehicle", icon: Car },
  { value: "life_insurance", label: "Life Insurance Policy", icon: Heart },
  { value: "bank_account", label: "Bank Account", icon: DollarSign },
  { value: "personal_property", label: "Personal Property", icon: Home },
  { value: "other", label: "Other", icon: DollarSign }
];

export default function AssetInput({ assets, onUpdate, onNext }) {
  const [newAsset, setNewAsset] = useState({
    type: "",
    name: "",
    value: "",
    notes: ""
  });

  const addAsset = () => {
    if (!newAsset.type || !newAsset.name || !newAsset.value) {
      alert("Please fill in asset type, name, and value");
      return;
    }
    onUpdate([...assets, { ...newAsset, value: parseFloat(newAsset.value) }]);
    setNewAsset({ type: "", name: "", value: "", notes: "" });
  };

  const removeAsset = (index) => {
    onUpdate(assets.filter((_, i) => i !== index));
  };

  const totalValue = assets.reduce((sum, a) => sum + (a.value || 0), 0);

  return (
    <div className="space-y-6">
      <GlassCard>
        <h3 className="text-lg font-semibold text-white mb-4">Add Your Assets</h3>
        <p className="text-sm text-[#94a3b8] mb-6">
          List all assets you want to include in your estate plan. Be as detailed as possible.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label className="text-white text-sm mb-2 block font-medium">Asset Type</Label>
            <MobileNativeSelect
              value={newAsset.type}
              onChange={(value) => setNewAsset({ ...newAsset, type: value })}
              options={assetTypes.map(t => ({ value: t.value, label: t.label }))}
              placeholder="Select asset type"
            />
          </div>

          <div>
            <Label className="text-white text-sm mb-2 block font-medium">Asset Name/Description</Label>
            <Input
              value={newAsset.name}
              onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
              placeholder="e.g., 123 Main St, John's IRA, Tesla Model 3"
              className="bg-[#0a0e17] border-[#1e293b] text-white"
              aria-label="Asset name or description"
            />
          </div>

          <div>
            <Label className="text-white text-sm mb-2 block font-medium">Estimated Value ($)</Label>
            <Input
              type="number"
              value={newAsset.value}
              onChange={(e) => setNewAsset({ ...newAsset, value: e.target.value })}
              placeholder="500000"
              className="bg-[#0a0e17] border-[#1e293b] text-white"
              aria-label="Estimated asset value in dollars"
            />
          </div>

          <div>
            <Label className="text-white text-sm mb-2 block font-medium">Additional Notes</Label>
            <Input
              value={newAsset.notes}
              onChange={(e) => setNewAsset({ ...newAsset, notes: e.target.value })}
              placeholder="Any relevant details"
              className="bg-[#0a0e17] border-[#1e293b] text-white"
              aria-label="Additional asset notes"
            />
          </div>
        </div>

        <Button onClick={addAsset} className="bg-[#8b5cf6] hover:bg-[#8b5cf6]/80 w-full md:w-auto touch-manipulation active:scale-95" aria-label="Add asset to estate plan">
          <Plus className="w-4 h-4 mr-2" />
          Add Asset
        </Button>
      </GlassCard>

      {assets.length > 0 && (
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Your Assets</h3>
            <div className="text-right">
              <p className="text-xs text-[#94a3b8]">Total Estate Value</p>
              <p className="text-2xl font-bold text-[#00d4aa]">${totalValue.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-3">
            {assets.map((asset, idx) => {
              const assetType = assetTypes.find((t) => t.value === asset.type);
              const Icon = assetType?.icon || DollarSign;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-xl bg-[#0a0e17] border border-[#1e293b]"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#8b5cf6]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-white">{asset.name}</h4>
                        <p className="text-xs text-[#64748b]">
                          {assetTypes.find((t) => t.value === asset.type)?.label}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-bold text-[#00d4aa]">
                          ${asset.value.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {asset.notes && (
                      <p className="text-xs text-[#94a3b8] mt-2">{asset.notes}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAsset(idx)}
                    className="text-[#ef4444] hover:text-[#ef4444] hover:bg-[#ef4444]/10"
                    aria-label={`Remove ${asset.name} from estate plan`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={assets.length === 0}
          className="bg-[#8b5cf6] hover:bg-[#8b5cf6]/80 touch-manipulation active:scale-95"
          aria-label="Continue to beneficiaries step"
        >
          Continue to Beneficiaries
        </Button>
      </div>
    </div>
  );
}