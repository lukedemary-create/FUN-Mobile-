import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MobileNativeSelect } from "@/components/ui/mobile-native-select";

import GlassCard from "../shared/GlassCard";
import { Plus, Trash2, Building2, TrendingUp, Home, Landmark, LinkIcon, Briefcase } from "lucide-react";

const ACCOUNT_TYPES = {
  bank: {
    label: "Bank Accounts",
    icon: Building2,
    color: "#3b82f6",
    types: ["Checking", "Savings", "Money Market", "CD", "HSA", "Cash"]
  },
  investment: {
    label: "Investment Accounts",
    icon: TrendingUp,
    color: "#00d4aa",
    types: ["401k", "403b", "457b", "IRA", "Roth IRA", "Brokerage", "529 Plan", "Pension", "Annuity", "Crypto"]
  },
  real_estate: {
    label: "Real Estate",
    icon: Home,
    color: "#f59e0b",
    types: ["Primary Home", "Rental Property", "Commercial", "Land", "REIT", "Vacation Property"]
  }
};

function formatBalance(n) {
  if (!n) return "$0";
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

export default function AccountsTab({ accounts = [], liabilities = [], onChange, onLiabilitiesChange }) {
  const [activeSection, setActiveSection] = useState("bank");

  // Load portfolios from My Portfolio
  const { data: portfolios = [] } = useQuery({
    queryKey: ["portfolios-for-budget"],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Portfolio.filter({ created_by: user.email });
    }
  });

  // Import a portfolio as an investment account
  const importPortfolio = (portfolio) => {
    const alreadyLinked = accounts.find(a => a.linked_portfolio_id === portfolio.id);
    if (alreadyLinked) return;
    const item = {
      id: Date.now().toString(),
      name: portfolio.name,
      account_type: "Brokerage",
      institution: "",
      balance: portfolio.total_invested || 0,
      interest_rate: 0,
      asset_category: "investment",
      linked_portfolio_id: portfolio.id
    };
    onChange([...accounts, item]);
  };

  const linkedPortfolioIds = accounts.filter(a => a.linked_portfolio_id).map(a => a.linked_portfolio_id);

  const addAccount = () => {
    const cat = activeSection;
    const item = {
      id: Date.now().toString(),
      name: ACCOUNT_TYPES[cat].types[0],
      account_type: ACCOUNT_TYPES[cat].types[0],
      institution: "",
      balance: 0,
      interest_rate: 0,
      asset_category: cat
    };
    onChange([...accounts, item]);
  };

  const addLiability = () => {
    const item = {
      id: Date.now().toString(),
      name: "Mortgage",
      liability_type: "Mortgage",
      balance: 0,
      interest_rate: 0,
      monthly_payment: 0
    };
    onLiabilitiesChange([...liabilities, item]);
  };

  const removeAccount = (id) => onChange(accounts.filter(a => a.id !== id));
  const removeLiability = (id) => onLiabilitiesChange(liabilities.filter(l => l.id !== id));
  const updateAccount = (id, field, value) => onChange(accounts.map(a => a.id === id ? { ...a, [field]: value } : a));
  const updateLiability = (id, field, value) => onLiabilitiesChange(liabilities.map(l => l.id === id ? { ...l, [field]: value } : l));

  const byCategory = (cat) => accounts.filter(a => a.asset_category === cat);
  const totalAssets = accounts.reduce((s, a) => s + (parseFloat(a.balance) || 0), 0);
  const totalLiabilities = liabilities.reduce((s, l) => s + (parseFloat(l.balance) || 0), 0);
  const netWorth = totalAssets - totalLiabilities;

  return (
    <div>
      {/* Net Worth Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <GlassCard className="p-4 text-center">
          <p className="text-xs text-[#00d4aa] uppercase tracking-wider mb-1">Total Assets</p>
          <p className="text-xl font-bold text-white">{formatBalance(totalAssets)}</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <p className="text-xs text-[#ef4444] uppercase tracking-wider mb-1">Total Liabilities</p>
          <p className="text-xl font-bold text-white">{formatBalance(totalLiabilities)}</p>
        </GlassCard>
        <GlassCard className={`p-4 text-center ${netWorth >= 0 ? "border-[#00d4aa]/20" : "border-[#ef4444]/20"}`}>
          <p className="text-xs text-[#94a3b8] uppercase tracking-wider mb-1">Net Worth</p>
          <p className={`text-xl font-bold ${netWorth >= 0 ? "text-[#00d4aa]" : "text-[#ef4444]"}`}>{formatBalance(netWorth)}</p>
        </GlassCard>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {Object.entries(ACCOUNT_TYPES).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all touch-manipulation active:scale-95 min-h-[44px] ${
                activeSection === key
                  ? "bg-[#1e293b] text-white border-[#334155]"
                  : "border-[#1e293b] text-[#64748b] hover:text-white"
              }`}
              aria-label={`View ${cfg.label}`}
              aria-pressed={activeSection === key}
            >
              <Icon className="w-4 h-4" style={{ color: activeSection === key ? cfg.color : undefined }} />
              {cfg.label} ({byCategory(key).length})
            </button>
          );
        })}
        <button
          onClick={() => setActiveSection("liabilities")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all touch-manipulation active:scale-95 min-h-[44px] ${
            activeSection === "liabilities"
              ? "bg-[#1e293b] text-white border-[#334155]"
              : "border-[#1e293b] text-[#64748b] hover:text-white"
          }`}
          aria-label="View liabilities"
          aria-pressed={activeSection === "liabilities"}
        >
          <Landmark className="w-4 h-4" style={{ color: activeSection === "liabilities" ? "#ef4444" : undefined }} />
          Liabilities ({liabilities.length})
        </button>
      </div>

      {/* Account list */}
      {activeSection !== "liabilities" && (
        <>
          <div className="flex gap-2 mb-4 flex-wrap">
            <Button onClick={addAccount} size="sm" className="bg-[#1e293b] hover:bg-[#334155] text-white border border-[#334155] touch-manipulation active:scale-95" aria-label={`Add ${ACCOUNT_TYPES[activeSection]?.label}`}>
              <Plus className="w-4 h-4 mr-2" /> Add {ACCOUNT_TYPES[activeSection]?.label?.replace(" Accounts", "").replace(" Estate", " Estate Property")}
            </Button>

            {/* Import from My Portfolio — only show for investment section */}
            {activeSection === "investment" && portfolios.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {portfolios.map(p => {
                  const linked = linkedPortfolioIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => !linked && importPortfolio(p)}
                      disabled={linked}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border transition-all touch-manipulation active:scale-95 min-h-[44px] ${
                        linked
                          ? "border-[#00d4aa]/20 text-[#00d4aa] bg-[#00d4aa]/5 cursor-default"
                          : "border-[#3b82f6]/30 text-[#3b82f6] hover:bg-[#3b82f6]/10"
                      }`}
                      aria-label={linked ? `${p.name} already linked` : `Import ${p.name} portfolio`}
                    >
                      {linked ? <LinkIcon className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                      {linked ? "Linked: " : "Import: "}{p.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="space-y-3">
            {byCategory(activeSection).length === 0 && (
            <div className="text-center py-10 text-[#64748b]">
              <div className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>No {ACCOUNT_TYPES[activeSection].label.toLowerCase()} added yet.</p>
              </div>
            )}
            {byCategory(activeSection).map(account => (
              <div key={account.id} className={`bg-[#111827] rounded-xl p-4 border group ${account.linked_portfolio_id ? "border-[#3b82f6]/20" : "border-[#1e293b]"}`}>
                {account.linked_portfolio_id && (
                  <div className="flex items-center gap-1 mb-2">
                    <LinkIcon className="w-3 h-3 text-[#3b82f6]" />
                    <span className="text-xs text-[#3b82f6]">Linked from My Portfolio — {portfolios.find(p => p.id === account.linked_portfolio_id)?.name}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-center">
                  <div>
                    <p className="text-sm text-white mb-1 font-medium">Account Name</p>
                    <Input
                      value={account.name}
                      onChange={e => updateAccount(account.id, "name", e.target.value)}
                      className="bg-[#0a0e17] border-[#1e293b] text-white h-8 text-sm"
                      aria-label="Account name"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-white mb-1 font-medium">Type</p>
                    <MobileNativeSelect
                      value={account.account_type}
                      onChange={(value) => updateAccount(account.id, "account_type", value)}
                      options={ACCOUNT_TYPES[activeSection].types.map(t => ({ value: t, label: t }))}
                      placeholder="Select type"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-white mb-1 font-medium">Institution</p>
                    <Input
                      value={account.institution}
                      onChange={e => updateAccount(account.id, "institution", e.target.value)}
                      placeholder="Bank / Broker"
                      className="bg-[#0a0e17] border-[#1e293b] text-white h-8 text-sm"
                      aria-label="Financial institution name"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <p className="text-sm text-white mb-1 font-medium">Balance / Value ($)</p>
                      <Input
                        type="number"
                        value={account.balance}
                        onChange={e => updateAccount(account.id, "balance", parseFloat(e.target.value) || 0)}
                        className="bg-[#0a0e17] border-[#1e293b] text-white h-8 text-sm"
                        aria-label="Account balance"
                      />
                    </div>
                    <button 
                      onClick={() => removeAccount(account.id)} 
                      className="text-[#ef4444] opacity-0 group-hover:opacity-100 transition-opacity mb-0.5 min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation active:scale-95"
                      aria-label={`Remove ${account.name} account`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {activeSection === "bank" && (
                  <div className="mt-2">
                    <p className="text-sm text-white mb-1 font-medium">Interest Rate (%)</p>
                    <Input
                      type="number"
                      value={account.interest_rate}
                      onChange={e => updateAccount(account.id, "interest_rate", parseFloat(e.target.value) || 0)}
                      className="bg-[#0a0e17] border-[#1e293b] text-white h-8 text-sm w-32"
                      aria-label="Account interest rate percentage"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Liabilities */}
      {activeSection === "liabilities" && (
        <>
          <Button onClick={addLiability} size="sm" className="mb-4 bg-[#1e293b] hover:bg-[#334155] text-white border border-[#334155] touch-manipulation active:scale-95" aria-label="Add liability">
            <Plus className="w-4 h-4 mr-2" /> Add Liability
          </Button>
          <div className="space-y-3">
            {liabilities.length === 0 && (
              <div className="text-center py-10 text-[#64748b]">
                <Landmark className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>No liabilities added. Great shape or add yours!</p>
              </div>
            )}
            {liabilities.map(l => (
              <div key={l.id} className="bg-[#111827] rounded-xl p-4 border border-[#1e293b] group">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-center">
                  <div>
                    <p className="text-sm text-white mb-1 font-medium">Name</p>
                    <Input value={l.name} onChange={e => updateLiability(l.id, "name", e.target.value)} className="bg-[#0a0e17] border-[#1e293b] text-white h-8 text-sm" aria-label="Liability name" />
                  </div>
                  <div>
                    <p className="text-sm text-white mb-1 font-medium">Type</p>
                    <MobileNativeSelect
                      value={l.liability_type}
                      onChange={(value) => updateLiability(l.id, "liability_type", value)}
                      options={["Mortgage", "Car Loan", "Student Loan", "Credit Card", "Personal Loan", "Medical Debt", "Business Loan", "Other"].map(t => ({ value: t, label: t }))}
                      placeholder="Select type"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-white mb-1 font-medium">Balance ($)</p>
                    <Input type="number" value={l.balance} onChange={e => updateLiability(l.id, "balance", parseFloat(e.target.value) || 0)} className="bg-[#0a0e17] border-[#1e293b] text-white h-8 text-sm" aria-label="Liability balance" />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <p className="text-sm text-white mb-1 font-medium">Monthly Payment ($)</p>
                      <Input type="number" value={l.monthly_payment} onChange={e => updateLiability(l.id, "monthly_payment", parseFloat(e.target.value) || 0)} className="bg-[#0a0e17] border-[#1e293b] text-white h-8 text-sm" aria-label="Monthly payment amount" />
                    </div>
                    <button 
                      onClick={() => removeLiability(l.id)} 
                      className="text-[#ef4444] opacity-0 group-hover:opacity-100 transition-opacity mb-0.5 min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation active:scale-95"
                      aria-label={`Remove ${l.name} liability`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-white mb-1 font-medium">Interest Rate (%)</p>
                  <Input type="number" value={l.interest_rate} onChange={e => updateLiability(l.id, "interest_rate", parseFloat(e.target.value) || 0)} className="bg-[#0a0e17] border-[#1e293b] text-white h-8 text-sm w-32" aria-label="Liability interest rate percentage" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}