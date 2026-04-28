import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MobileSelect, MobileSelectItem, MobileSelectContent } from "@/components/ui/mobile-select";
import { Badge } from "@/components/ui/badge";
import GlassCard from "../shared/GlassCard";
import { Plus, Trash2, Tag } from "lucide-react";

const EXPENSE_SUGGESTIONS = {
  need: [
    "Rent / Mortgage", "Property Tax", "HOA Fees", "Home Insurance", "Electric", "Gas / Heating",
    "Water / Sewer", "Internet", "Cell Phone", "Health Insurance", "Car Payment", "Car Insurance",
    "Groceries", "Prescriptions", "Child Care / Daycare", "Student Loan", "Minimum Debt Payments", "Life Insurance"
  ],
  want: [
    "Restaurants / Dining Out", "Coffee Shops", "Netflix", "Hulu / Disney+", "Spotify / Music",
    "Amazon Prime", "Gym Membership", "Hobbies", "Clothing / Shopping", "Entertainment / Events",
    "Travel / Vacations", "Books / Games / Apps", "Personal Care / Beauty", "Pet Expenses",
    "Subscriptions (Other)", "Alcohol / Bars", "Gifts", "Charity / Donations"
  ],
  saving: [
    "401k / 403b Contribution", "Roth IRA", "Traditional IRA", "Emergency Fund", "Brokerage Account",
    "529 Education Fund", "HSA Contribution", "Home Down Payment Fund", "Car Replacement Fund",
    "Vacation Fund", "Wedding Fund", "Business Fund"
  ],
  debt: [
    "Credit Card #1", "Credit Card #2", "Personal Loan", "Medical Debt", "Back Taxes / IRS",
    "Collections Payment", "Home Equity Loan", "Second Mortgage"
  ]
};

const TYPE_COLORS = {
  need: { bg: "bg-[#3b82f6]/10", text: "text-[#3b82f6]", border: "border-[#3b82f6]/20" },
  want: { bg: "bg-[#f59e0b]/10", text: "text-[#f59e0b]", border: "border-[#f59e0b]/20" },
  saving: { bg: "bg-[#00d4aa]/10", text: "text-[#00d4aa]", border: "border-[#00d4aa]/20" },
  debt: { bg: "bg-[#ef4444]/10", text: "text-[#ef4444]", border: "border-[#ef4444]/20" }
};

function toMonthly(amount, frequency) {
  if (!amount) return 0;
  const a = parseFloat(amount) || 0;
  if (frequency === "annual") return a / 12;
  if (frequency === "weekly") return a * 4.33;
  return a;
}

export default function ExpensesTab({ expenses = [], onChange }) {
  const [activeType, setActiveType] = useState("need");
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newFreq, setNewFreq] = useState("monthly");

  const addExpense = (name = newName) => {
    if (!name) return;
    const item = {
      id: Date.now().toString(),
      category: activeType,
      name,
      amount: parseFloat(newAmount) || 0,
      frequency: newFreq,
      type: activeType
    };
    onChange([...expenses, item]);
    setNewName("");
    setNewAmount("");
    setNewFreq("monthly");
  };

  const removeExpense = (id) => onChange(expenses.filter(e => e.id !== id));

  const updateExpense = (id, field, value) => {
    onChange(expenses.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const byType = (type) => expenses.filter(e => e.type === type);
  const totalMonthly = (type) => byType(type).reduce((s, e) => s + toMonthly(e.amount, e.frequency), 0);
  const grandTotal = expenses.reduce((s, e) => s + toMonthly(e.amount, e.frequency), 0);

  const usedSuggestions = expenses.map(e => e.name);
  const availableSuggestions = (EXPENSE_SUGGESTIONS[activeType] || []).filter(s => !usedSuggestions.includes(s));

  return (
    <div>
      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {["need", "want", "saving", "debt"].map(type => (
          <div key={type} className={`rounded-xl p-4 border ${TYPE_COLORS[type].bg} ${TYPE_COLORS[type].border}`}>
            <p className={`text-xs uppercase tracking-wider mb-1 ${TYPE_COLORS[type].text}`}>{type}s</p>
            <p className="text-xl font-bold text-white">${totalMonthly(type).toFixed(0)}<span className="text-xs text-[#64748b]">/mo</span></p>
            <p className="text-xs text-[#64748b]">{byType(type).length} items</p>
          </div>
        ))}
      </div>

      {/* Type tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["need", "want", "saving", "debt"].map(type => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all capitalize touch-manipulation active:scale-95 min-h-[44px] ${
              activeType === type
                ? `${TYPE_COLORS[type].bg} ${TYPE_COLORS[type].text} ${TYPE_COLORS[type].border}`
                : "border-[#1e293b] text-[#64748b] hover:text-white"
            }`}
            aria-label={`View ${type} expenses`}
            aria-pressed={activeType === type}
          >
            {type}s · ${totalMonthly(type).toFixed(0)}/mo
          </button>
        ))}
      </div>

      {/* Add new */}
      <GlassCard className="mb-4 p-4">
        <p className="text-xs text-[#64748b] mb-3 uppercase tracking-wider">Add Expense — {activeType}</p>
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Expense name..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addExpense()}
            className="bg-[#0a0e17] border-[#1e293b] text-white flex-1"
          />
          <Input
            placeholder="Amount"
            type="number"
            value={newAmount}
            onChange={e => setNewAmount(e.target.value)}
            className="bg-[#0a0e17] border-[#1e293b] text-white w-28"
          />
          <MobileSelect value={newFreq} onValueChange={setNewFreq} placeholder="Frequency" className="bg-[#0a0e17] border-[#1e293b] text-white w-32">
            <MobileSelectContent>
              <MobileSelectItem value="monthly">Monthly</MobileSelectItem>
              <MobileSelectItem value="annual">Annual</MobileSelectItem>
              <MobileSelectItem value="weekly">Weekly</MobileSelectItem>
            </MobileSelectContent>
          </MobileSelect>
          <Button onClick={() => addExpense()} className="bg-[#00d4aa] hover:bg-[#00d4aa]/80 text-black touch-manipulation active:scale-95" aria-label="Add expense">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {/* Quick-add suggestions */}
        <div className="flex flex-wrap gap-2">
          {availableSuggestions.slice(0, 8).map(s => (
            <button
              key={s}
              onClick={() => { setNewName(s); }}
              className="px-2 py-1 rounded-lg text-xs border border-[#1e293b] text-[#64748b] hover:text-white hover:border-[#00d4aa]/40 transition-all touch-manipulation active:scale-95 min-h-[44px]"
              aria-label={`Add ${s} to expenses`}
            >
              + {s}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Expense list for active type */}
      <div className="space-y-2">
        {byType(activeType).length === 0 && (
          <div className="text-center py-10 text-[#64748b]">
            <Tag className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>No {activeType}s yet. Add one above or pick from suggestions.</p>
          </div>
        )}
        {byType(activeType).map(expense => (
          <div key={expense.id} className="flex items-center gap-3 bg-[#111827] rounded-xl px-4 py-3 border border-[#1e293b] group">
            <div className="flex-1 min-w-0">
              <Input
                value={expense.name}
                onChange={e => updateExpense(expense.id, "name", e.target.value)}
                className="bg-transparent border-none text-white p-0 h-auto text-sm font-medium focus-visible:ring-0"
                aria-label={`Edit ${expense.name} name`}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#64748b]">$</span>
              <Input
                type="number"
                value={expense.amount}
                onChange={e => updateExpense(expense.id, "amount", parseFloat(e.target.value) || 0)}
                className="bg-[#0a0e17] border-[#1e293b] text-white w-24 h-8 text-sm"
                aria-label={`Edit ${expense.name} amount`}
              />
              <MobileSelect value={expense.frequency || "monthly"} onValueChange={v => updateExpense(expense.id, "frequency", v)} placeholder="Frequency" className="bg-[#0a0e17] border-[#1e293b] text-[#94a3b8] w-28 h-8">
                <MobileSelectContent>
                  <MobileSelectItem value="monthly">/ mo</MobileSelectItem>
                  <MobileSelectItem value="annual">/ yr</MobileSelectItem>
                  <MobileSelectItem value="weekly">/ wk</MobileSelectItem>
                </MobileSelectContent>
              </MobileSelect>
              <span className="text-xs text-[#00d4aa] w-20 text-right">
                ${toMonthly(expense.amount, expense.frequency).toFixed(0)}/mo
              </span>
              <button 
                onClick={() => removeExpense(expense.id)} 
                className="text-[#ef4444] opacity-0 group-hover:opacity-100 transition-opacity ml-1 min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation active:scale-95"
                aria-label={`Remove ${expense.name} expense`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {expenses.length > 0 && (
        <div className="mt-4 p-4 bg-[#111827] rounded-xl border border-[#1e293b] flex justify-between items-center">
          <span className="text-[#94a3b8]">Total Monthly Expenses</span>
          <span className="text-xl font-bold text-white">${grandTotal.toFixed(0)}</span>
        </div>
      )}
    </div>
  );
}