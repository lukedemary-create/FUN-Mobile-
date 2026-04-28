import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useNavigation } from "../MobileStackManager";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MobileSelect, MobileSelectItem, MobileSelectContent } from "@/components/ui/mobile-select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import GlassCard from "../shared/GlassCard";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Wallet, Target, Loader2, Sparkles, TrendingUp, Trash2, ExternalLink, CheckCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { stripSources } from "@/utils/stripSources";

const EXPENSE_COLORS = ["#00d4aa", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

export default function BudgetAssistant() {
  const queryClient = useQueryClient();
  const { navigate } = useNavigation();
  const [editMode, setEditMode] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Primary: load from Budget Planner (FinancialPlan entity)
  const { data: financialPlan } = useQuery({
    queryKey: ["financialPlan"],
    queryFn: async () => {
      const user = await base44.auth.me();
      const plans = await base44.entities.FinancialPlan.filter({ created_by: user.email });
      return plans[0] || null;
    }
  });

  // Fallback: legacy UserBudget
  const { data: budgets = [] } = useQuery({
    queryKey: ["userbudget"],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.UserBudget.filter({ created_by: user.email });
    }
  });

  // Derive a unified budget view from FinancialPlan if available
  const planBudget = financialPlan ? (() => {
    // Calculate total monthly income
    const additionalMonthly = (financialPlan.additional_income || []).reduce((sum, inc) => {
      const amt = inc.amount || 0;
      if (inc.frequency === "annual") return sum + amt / 12;
      if (inc.frequency === "weekly") return sum + amt * 4.33;
      if (inc.frequency === "bi-weekly") return sum + amt * 2.17;
      return sum + amt;
    }, 0);
    const totalIncome = (financialPlan.monthly_income || 0) + additionalMonthly;

    // Build expense breakdown from expenses array
    const expensesByCategory = {};
    const expensesList = [];
    (financialPlan.expenses || []).forEach(exp => {
      const amt = exp.frequency === "annual" ? (exp.amount || 0) / 12 :
                  exp.frequency === "weekly" ? (exp.amount || 0) * 4.33 : (exp.amount || 0);
      const cat = exp.category || exp.name || "other";
      expensesByCategory[cat] = (expensesByCategory[cat] || 0) + amt;
      expensesList.push({ name: exp.name || cat, value: amt });
    });

    return {
      monthly_salary: totalIncome,
      monthly_expenses: expensesByCategory,
      budgeting_plan: "Budget Planner",
      _expensesList: expensesList,
      _fromFinancialPlan: true,
      _planName: financialPlan.plan_name,
      _goals: financialPlan.goals || [],
      _accounts: financialPlan.accounts || [],
      _liabilities: financialPlan.liabilities || []
    };
  })() : null;

  const budget = planBudget || budgets[0];

  const [formData, setFormData] = useState({
    monthly_salary: "",
    housing: "",
    transportation: "",
    food: "",
    utilities: "",
    insurance: "",
    debt_payments: "",
    entertainment: "",
    other: "",
    budgeting_plan: "50/30/20",
    custom_expenses: [] // Array of {name: string, amount: number}
  });

  React.useEffect(() => {
    if (budget && editMode) {
      setFormData({
        monthly_salary: budget.monthly_salary || "",
        housing: budget.monthly_expenses?.housing || "",
        transportation: budget.monthly_expenses?.transportation || "",
        food: budget.monthly_expenses?.food || "",
        utilities: budget.monthly_expenses?.utilities || "",
        insurance: budget.monthly_expenses?.insurance || "",
        debt_payments: budget.monthly_expenses?.debt_payments || "",
        entertainment: budget.monthly_expenses?.entertainment || "",
        other: budget.monthly_expenses?.other || "",
        budgeting_plan: budget.budgeting_plan || "50/30/20",
        custom_expenses: budget.monthly_expenses?.custom_expenses || []
      });
    }
  }, [budget, editMode]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      
      // Build monthly_expenses object with standard + custom expenses
      const monthly_expenses = {
        housing: parseFloat(data.housing) || 0,
        transportation: parseFloat(data.transportation) || 0,
        food: parseFloat(data.food) || 0,
        utilities: parseFloat(data.utilities) || 0,
        insurance: parseFloat(data.insurance) || 0,
        debt_payments: parseFloat(data.debt_payments) || 0,
        entertainment: parseFloat(data.entertainment) || 0,
        other: parseFloat(data.other) || 0,
        custom_expenses: data.custom_expenses || []
      };

      const payload = {
        monthly_salary: parseFloat(data.monthly_salary) || 0,
        monthly_expenses,
        budgeting_plan: data.budgeting_plan,
        liabilities: budget?.liabilities || [],
        savings_goals: budget?.savings_goals || []
      };
      if (budget) {
        return base44.entities.UserBudget.update(budget.id, payload);
      } else {
        return base44.entities.UserBudget.create(payload);
      }
    },
    onMutate: async (newData) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries(["userbudget"]);
      
      // Snapshot previous value
      const previousBudgets = queryClient.getQueryData(["userbudget"]);
      
      // Optimistically update
      const optimisticBudget = {
        ...budget,
        monthly_salary: parseFloat(newData.monthly_salary) || 0,
        monthly_expenses: {
          housing: parseFloat(newData.housing) || 0,
          transportation: parseFloat(newData.transportation) || 0,
          food: parseFloat(newData.food) || 0,
          utilities: parseFloat(newData.utilities) || 0,
          insurance: parseFloat(newData.insurance) || 0,
          debt_payments: parseFloat(newData.debt_payments) || 0,
          entertainment: parseFloat(newData.entertainment) || 0,
          other: parseFloat(newData.other) || 0,
          custom_expenses: newData.custom_expenses || []
        },
        budgeting_plan: newData.budgeting_plan,
      };
      
      if (budget) {
        queryClient.setQueryData(["userbudget"], (old) => 
          old.map(b => b.id === budget.id ? optimisticBudget : b)
        );
      } else {
        queryClient.setQueryData(["userbudget"], (old) => [...old, optimisticBudget]);
      }
      
      return { previousBudgets };
    },
    onError: (err, newData, context) => {
      // Rollback on error
      queryClient.setQueryData(["userbudget"], context.previousBudgets);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userbudget"]);
      setEditMode(false);
    }
  });

  const analyzeGoals = async () => {
    if (!budget) return;
    setAnalyzing(true);

    try {
      const discretionary = budget.monthly_salary - totalExpenses;

      const goalsText = budget._goals?.length > 0
        ? `\nFinancial Goals:\n${budget._goals.map(g => `- ${g.name}: target $${g.target_amount?.toLocaleString()}, current $${g.current_amount?.toLocaleString()}, monthly contribution $${g.monthly_contribution}`).join('\n')}`
        : '';

      const prompt = `You are a financial planning assistant. Analyze this budget and provide goal planning advice:

Monthly Income: $${budget.monthly_salary?.toLocaleString()}
Monthly Expenses: $${totalExpenses?.toLocaleString()}
Discretionary Income: $${discretionary?.toLocaleString()}

Expense Breakdown:
${expenseData.map(e => `- ${e.name}: $${e.value?.toFixed(0)}`).join('\n')}
${goalsText}

Provide:
1. Budget Health Assessment (1-2 sentences)
2. Recommended Savings Rate (with explanation)
3. Three Specific Goal Ideas (emergency fund, retirement, etc.) with monthly amounts
4. One Expense Optimization Tip

Keep it concise and actionable. Use plain language.`;

      const response = await base44.integrations.Core.InvokeLLM({ prompt });
      setAiAnalysis(stripSources(response));
    } catch (error) {
      console.error("Error analyzing goals:", error);
      setAiAnalysis("Unable to generate analysis. Please try again.");
    }
    setAnalyzing(false);
  };

  if (!budget && !editMode) {
    return (
      <GlassCard>
        <div className="text-center py-8">
          <Wallet className="w-12 h-12 text-[#00d4aa] mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">Budget Assistant</h3>
          <p className="text-sm text-[#94a3b8] mb-4">Set up your budget in the Budget Planner and it will appear here automatically</p>
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={() => navigate("/BudgetPlanner")} 
              className="bg-[#00d4aa] hover:bg-[#00d4aa]/80 text-black touch-manipulation active:scale-95"
              aria-label="Go to Budget Planner"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Go to Budget Planner
            </Button>
          </div>
        </div>
      </GlassCard>
    );
  }

  const totalExpenses = budget ? 
    Object.entries(budget.monthly_expenses || {})
      .filter(([key]) => key !== 'custom_expenses')
      .reduce((sum, [_, value]) => sum + (typeof value === 'number' ? value : 0), 0) +
    (budget.monthly_expenses?.custom_expenses || []).reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0)
    : 0;
  const discretionary = budget ? budget.monthly_salary - totalExpenses : 0;
  const savingsRate = budget && budget.monthly_salary > 0 ? ((discretionary / budget.monthly_salary) * 100).toFixed(1) : 0;

  const expenseData = budget ? (
    budget._fromFinancialPlan
      ? (budget._expensesList || []).filter(e => e.value > 0)
      : [
          ...Object.entries(budget.monthly_expenses || {})
            .filter(([key, value]) => key !== 'custom_expenses' && typeof value === 'number' && value > 0)
            .map(([key, value]) => ({ name: key.replace(/_/g, ' '), value })),
          ...(budget.monthly_expenses?.custom_expenses || [])
            .filter(exp => parseFloat(exp.amount) > 0)
            .map(exp => ({ name: exp.name, value: parseFloat(exp.amount) }))
        ]
  ) : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Wallet className="w-5 h-5 text-[#00d4aa]" />
          <h3 className="text-lg font-semibold text-white">Budget Assistant</h3>
          {budget?._fromFinancialPlan && (
            <span className="flex items-center gap-1 text-xs text-[#00d4aa] bg-[#00d4aa]/10 px-2 py-0.5 rounded-full border border-[#00d4aa]/20">
              <CheckCircle className="w-3 h-3" /> Synced from Budget Planner
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {budget?._fromFinancialPlan ? (
            <Button 
              onClick={() => navigate("/BudgetPlanner")} 
              size="sm" 
              variant="outline" 
              className="border-[#1e293b] text-[#00d4aa] touch-manipulation active:scale-95"
              aria-label="Edit budget in Budget Planner"
            >
              <ExternalLink className="w-3 h-3 mr-1" /> Edit in Budget Planner
            </Button>
          ) : (
            <Dialog open={editMode} onOpenChange={setEditMode}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="border-[#1e293b] text-[#00d4aa]">
                  {budget ? "Edit Budget" : "Set Up"}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#111827] border-[#1e293b] text-white max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Budget Setup</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label className="text-[#94a3b8]">Monthly Take-Home Income ($)</Label>
                    <Input
                      type="number"
                      value={formData.monthly_salary}
                      onChange={(e) => setFormData({ ...formData, monthly_salary: e.target.value })}
                      className="bg-[#0a0e17] border-[#1e293b] text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-[#94a3b8] mb-2 block">Monthly Expenses</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {["housing", "transportation", "food", "utilities", "insurance", "debt_payments", "entertainment", "other"].map(key => (
                        <div key={key}>
                          <Label className="text-xs text-[#64748b]">{key.replace(/_/g, ' ')}</Label>
                          <Input
                            type="number"
                            value={formData[key]}
                            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                            className="bg-[#0a0e17] border-[#1e293b] text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-[#94a3b8]">Custom Expense Categories</Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setFormData({ ...formData, custom_expenses: [...(formData.custom_expenses || []), { name: "", amount: "" }] })}
                        className="border-[#00d4aa] text-[#00d4aa] hover:bg-[#00d4aa]/10 text-xs"
                      >
                        + Add Category
                      </Button>
                    </div>
                    {formData.custom_expenses?.length > 0 && (
                      <div className="space-y-2">
                        {formData.custom_expenses.map((expense, idx) => (
                          <div key={idx} className="flex gap-2">
                            <Input
                              placeholder="Category name"
                              value={expense.name}
                              onChange={(e) => {
                                const updated = [...formData.custom_expenses];
                                updated[idx].name = e.target.value;
                                setFormData({ ...formData, custom_expenses: updated });
                              }}
                              className="bg-[#0a0e17] border-[#1e293b] text-white flex-1"
                            />
                            <Input
                              type="number"
                              placeholder="Amount"
                              value={expense.amount}
                              onChange={(e) => {
                                const updated = [...formData.custom_expenses];
                                updated[idx].amount = e.target.value;
                                setFormData({ ...formData, custom_expenses: updated });
                              }}
                              className="bg-[#0a0e17] border-[#1e293b] text-white w-28"
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => setFormData({ ...formData, custom_expenses: formData.custom_expenses.filter((_, i) => i !== idx) })}
                              className="text-[#ef4444] hover:bg-[#ef4444]/10"
                              aria-label={`Remove ${expense.name || 'custom expense'}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="text-[#94a3b8]">Budgeting Method</Label>
                    <MobileSelect 
                      value={formData.budgeting_plan} 
                      onValueChange={(val) => setFormData({ ...formData, budgeting_plan: val })}
                      placeholder="Select budgeting method"
                      className="bg-[#0a0e17] border-[#1e293b] text-white"
                    >
                      <MobileSelectContent>
                        <MobileSelectItem value="50/30/20">50/30/20 Rule</MobileSelectItem>
                        <MobileSelectItem value="zero_based">Zero-Based Budget</MobileSelectItem>
                        <MobileSelectItem value="envelope">Envelope Method</MobileSelectItem>
                        <MobileSelectItem value="pay_yourself_first">Pay Yourself First</MobileSelectItem>
                      </MobileSelectContent>
                    </MobileSelect>
                  </div>
                  <Button onClick={() => saveMutation.mutate(formData)} className="bg-[#00d4aa] hover:bg-[#00d4aa]/80 text-black w-full">
                    Save Budget
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {budget && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <GlassCard>
            <p className="text-xs text-[#64748b] uppercase tracking-wider mb-1">Monthly Income</p>
            <p className="text-2xl font-bold text-[#00d4aa]">${budget.monthly_salary?.toLocaleString()}</p>
          </GlassCard>
          <GlassCard>
            <p className="text-xs text-[#64748b] uppercase tracking-wider mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-[#ef4444]">${totalExpenses.toLocaleString()}</p>
          </GlassCard>
          <GlassCard>
            <p className="text-xs text-[#64748b] uppercase tracking-wider mb-1">Discretionary</p>
            <p className="text-2xl font-bold text-[#3b82f6]">${discretionary.toLocaleString()}</p>
            <p className="text-xs text-[#94a3b8] mt-1">{savingsRate}% savings rate</p>
          </GlassCard>
        </div>
      )}

      {budget && expenseData.length > 0 && (
        <GlassCard className="mb-4">
          <h4 className="text-sm font-semibold text-white mb-4">Expense Breakdown</h4>
          <div className="w-full overflow-x-hidden">
            <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 300 : 340}>
              <PieChart margin={{ top: window.innerWidth < 768 ? 10 : 20, right: window.innerWidth < 768 ? 10 : 30, bottom: window.innerWidth < 768 ? 10 : 20, left: window.innerWidth < 768 ? 10 : 30 }}>
                <Pie 
                  data={expenseData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy={window.innerWidth < 768 ? "42%" : "45%"}
                  innerRadius={window.innerWidth < 768 ? 50 : 60}
                  outerRadius={window.innerWidth < 768 ? 75 : 90}
                  paddingAngle={3}
                  label={({ percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
                    const RADIAN = Math.PI / 180;
                    const labelOffset = window.innerWidth < 768 ? 18 : 28;
                    const radius = outerRadius + labelOffset;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    const fontSize = window.innerWidth < 768 ? 12 : 14;
                    return (
                      <text 
                        x={x} 
                        y={y} 
                        fill="#f1f5f9" 
                        textAnchor={x > cx ? 'start' : 'end'} 
                        dominantBaseline="central"
                        fontSize={fontSize}
                        fontWeight="600"
                      >
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                  labelLine={{ stroke: "#64748b", strokeWidth: 1 }}
                >
                  {expenseData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]}
                      stroke="#0a0e17"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: "#111827", 
                    border: "1px solid #1e293b", 
                    borderRadius: "12px",
                    padding: "12px",
                    color: "#f1f5f9"
                  }}
                  itemStyle={{ color: "#f1f5f9" }}
                  labelStyle={{ color: "#f1f5f9" }}
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={window.innerWidth < 768 ? 60 : 36}
                  wrapperStyle={{ fontSize: window.innerWidth < 768 ? "11px" : "13px", paddingTop: "20px" }}
                  formatter={(value) => {
                    const formatted = value.charAt(0).toUpperCase() + value.slice(1);
                    return window.innerWidth < 768 ? formatted.substring(0, 12) : formatted;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}

      {budget && (
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#3b82f6]" />
              <h4 className="text-sm font-semibold text-white">AI Goal Planning</h4>
            </div>
            <Button onClick={analyzeGoals} disabled={analyzing} size="sm" className="bg-[#3b82f6] hover:bg-[#3b82f6]/80 text-white">
              {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {analyzing ? "Analyzing..." : "Get Goal Plan"}
            </Button>
          </div>

          {aiAnalysis && (
            <div className="bg-[#0a0e17] rounded-xl p-4 border border-[#1e293b]">
              <ReactMarkdown className="prose prose-sm prose-invert max-w-none text-[#e2e8f0] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                {aiAnalysis}
              </ReactMarkdown>
            </div>
          )}

          {!aiAnalysis && (
            <p className="text-sm text-[#94a3b8] text-center py-4">
              Click "Get Goal Plan" for personalized savings recommendations and goal ideas based on your budget.
            </p>
          )}
        </GlassCard>
      )}
    </div>
  );
}