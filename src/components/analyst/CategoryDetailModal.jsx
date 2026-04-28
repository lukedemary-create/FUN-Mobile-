import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import IndicatorCard from "./IndicatorCard";

export default function CategoryDetailModal({ category, indicators, onClose, loading }) {
  if (!category) return null;

  const categoryIndicators = indicators.filter(ind => 
    ind !== null && ind.category === category.id
  );

  const getCategoryStats = () => {
    if (categoryIndicators.length === 0) return null;
    
    const avgChange = categoryIndicators.reduce((sum, ind) => sum + ind.change, 0) / categoryIndicators.length;
    const positiveCount = categoryIndicators.filter(ind => ind.change > 0).length;
    const negativeCount = categoryIndicators.filter(ind => ind.change < 0).length;
    
    return { avgChange, positiveCount, negativeCount, total: categoryIndicators.length };
  };

  const stats = getCategoryStats();

  return (
    <Dialog open={!!category} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0e17] border-[#1e293b] text-white max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold"
                style={{ background: `${category.color}20`, color: category.color }}
              >
                {category.name.substring(0, 1)}
              </div>
              <div>
                <DialogTitle className="text-3xl" style={{ color: category.color }}>
                  {category.name}
                </DialogTitle>
                <p className="text-sm text-[#94a3b8] mt-1">
                  {categoryIndicators.length} indicators • Live market data
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        {stats && (
          <div className="grid grid-cols-4 gap-4 mt-6 mb-8">
            <div className="bg-[#111827] rounded-xl p-4 border border-[#1e293b]">
              <div className="text-xs text-[#94a3b8] mb-1">Total Indicators</div>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </div>
            <div className="bg-[#111827] rounded-xl p-4 border border-[#1e293b]">
              <div className="text-xs text-[#94a3b8] mb-1">Avg Change</div>
              <div 
                className="text-2xl font-bold"
                style={{ color: stats.avgChange >= 0 ? "#00d4aa" : "#ef4444" }}
              >
                {stats.avgChange >= 0 ? "+" : ""}{stats.avgChange.toFixed(2)}%
              </div>
            </div>
            <div className="bg-[#111827] rounded-xl p-4 border border-[#1e293b]">
              <div className="text-xs text-[#94a3b8] mb-1">Rising</div>
              <div className="text-2xl font-bold text-[#00d4aa]">{stats.positiveCount}</div>
            </div>
            <div className="bg-[#111827] rounded-xl p-4 border border-[#1e293b]">
              <div className="text-xs text-[#94a3b8] mb-1">Falling</div>
              <div className="text-2xl font-bold text-[#ef4444]">{stats.negativeCount}</div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white mb-4">All {category.name} Indicators</h3>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#111827] rounded-2xl p-6 border border-[#1e293b] animate-pulse">
                  <div className="h-4 bg-[#1a2332] rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-[#1a2332] rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-[#1a2332] rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : categoryIndicators.length === 0 ? (
            <div className="text-center py-12 text-[#94a3b8]">
              <p>No indicators available for this category yet.</p>
              <p className="text-sm mt-2">Data is being loaded...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryIndicators.map((indicator, i) => (
                <IndicatorCard key={i} indicator={indicator} categoryColor={category.color} />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}