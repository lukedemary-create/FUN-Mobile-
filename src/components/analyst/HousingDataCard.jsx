import React, { useState, useEffect } from "react";
import { Home } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function HousingDataCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHousingData();
  }, []);

  const fetchHousingData = async () => {
    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Fetch the latest US housing market data. Return ONLY a JSON object with these exact fields:
        {
          "zillow_median_home_value": <number>,
          "zillow_median_rent": <number>,
          "zillow_rent_yoy_change": <number (percent)>,
          "redfin_median_sale_price": <number>,
          "redfin_days_on_market": <number>,
          "redfin_homes_above_asking_pct": <number (percent)>,
          "redfin_sale_to_list_ratio": <number (as decimal, e.g. 0.98)>
        }
        Use current data from Zillow ZHVI, ZORI, and Redfin reports.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            zillow_median_home_value: { type: "number" },
            zillow_median_rent: { type: "number" },
            zillow_rent_yoy_change: { type: "number" },
            redfin_median_sale_price: { type: "number" },
            redfin_days_on_market: { type: "number" },
            redfin_homes_above_asking_pct: { type: "number" },
            redfin_sale_to_list_ratio: { type: "number" }
          }
        }
      });
      setData(response);
    } catch (error) {
      console.error("Housing data fetch error:", error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-[#111827] rounded-2xl p-6 border border-[#1e293b] lg:col-span-1">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-[#a855f7] animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-[#a855f7] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 rounded-full bg-[#a855f7] animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <div className="text-xl font-bold text-white mb-2">Zillow + Redfin Housing</div>
        <div className="text-sm text-[#94a3b8]">Fetching live data from Zillow & Redfin...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#111827] rounded-2xl p-6 border border-[#1e293b] hover:border-[#a855f7] transition-all hover:-translate-y-0.5 lg:col-span-1 cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "#a855f720", color: "#a855f7" }}>
          Housing
        </span>
        <Home className="w-5 h-5" style={{ color: "#a855f7" }} />
      </div>

      <div className="text-xl font-bold text-white mb-4">Zillow + Redfin Housing</div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#1a2332] rounded-xl p-3 border border-[#1e293b]">
          <div className="text-xs text-[#94a3b8] mb-1">Zillow Home Value</div>
          <div className="text-lg font-bold text-white">${(data?.zillow_median_home_value || 0).toLocaleString()}</div>
        </div>
        <div className="bg-[#1a2332] rounded-xl p-3 border border-[#1e293b]">
          <div className="text-xs text-[#94a3b8] mb-1">Zillow Rent</div>
          <div className="text-lg font-bold text-white">${(data?.zillow_median_rent || 0).toLocaleString()}</div>
          <div className="text-xs text-[#00d4aa]">+{(data?.zillow_rent_yoy_change || 0).toFixed(1)}% YoY</div>
        </div>
        <div className="bg-[#1a2332] rounded-xl p-3 border border-[#1e293b]">
          <div className="text-xs text-[#94a3b8] mb-1">Redfin Sale Price</div>
          <div className="text-lg font-bold text-white">${(data?.redfin_median_sale_price || 0).toLocaleString()}</div>
        </div>
        <div className="bg-[#1a2332] rounded-xl p-3 border border-[#1e293b]">
          <div className="text-xs text-[#94a3b8] mb-1">Days on Market</div>
          <div className="text-lg font-bold text-white">{(data?.redfin_days_on_market || 0).toFixed(0)}</div>
        </div>
        <div className="bg-[#1a2332] rounded-xl p-3 border border-[#1e293b]">
          <div className="text-xs text-[#94a3b8] mb-1">Above Asking</div>
          <div className="text-lg font-bold text-white">{(data?.redfin_homes_above_asking_pct || 0).toFixed(1)}%</div>
        </div>
        <div className="bg-[#1a2332] rounded-xl p-3 border border-[#1e293b]">
          <div className="text-xs text-[#94a3b8] mb-1">Sale/List Ratio</div>
          <div className="text-lg font-bold text-white">{((data?.redfin_sale_to_list_ratio || 0) * 100).toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
}