import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function GroceryPricesCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroceryData();
  }, []);

  const fetchGroceryData = async () => {
    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Fetch current US average retail grocery prices from USDA ERS. Return ONLY a JSON object with these exact fields:
        {
          "eggs_per_dozen": <number>,
          "milk_per_gallon": <number>,
          "ground_beef_per_lb": <number>,
          "chicken_breast_per_lb": <number>,
          "bread_per_loaf": <number>,
          "butter_per_lb": <number>
        }
        Use the latest USDA Economic Research Service data.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            eggs_per_dozen: { type: "number" },
            milk_per_gallon: { type: "number" },
            ground_beef_per_lb: { type: "number" },
            chicken_breast_per_lb: { type: "number" },
            bread_per_loaf: { type: "number" },
            butter_per_lb: { type: "number" }
          }
        }
      });
      setData(response);
    } catch (error) {
      console.error("Grocery data fetch error:", error);
    }
    setLoading(false);
  };

  const items = [
    { label: "Eggs / dozen", value: data?.eggs_per_dozen, icon: "🥚" },
    { label: "Milk / gallon", value: data?.milk_per_gallon, icon: "🥛" },
    { label: "Ground Beef / lb", value: data?.ground_beef_per_lb, icon: "🥩" },
    { label: "Chicken Breast / lb", value: data?.chicken_breast_per_lb, icon: "🍗" },
    { label: "Bread / loaf", value: data?.bread_per_loaf, icon: "🍞" },
    { label: "Butter / lb", value: data?.butter_per_lb, icon: "🧈" },
  ];

  return (
    <div className="t-card t-card-p" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.25rem" }}>
        <div style={{ width: 34, height: 34, borderRadius: "9px", background: "#84cc1618", border: "1px solid #84cc1630", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ShoppingCart size={16} style={{ color: "#84cc16" }} />
        </div>
        <div>
          <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-1)" }}>Grocery Prices</div>
          <div style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>USDA ERS</div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 64, borderRadius: "0.625rem" }} />
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {items.map((item, i) => (
            <div key={i} style={{ background: "var(--elevated)", borderRadius: "0.625rem", padding: "0.75rem", border: "1px solid var(--border-c)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.25rem" }}>
                <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                <span style={{ fontSize: "0.625rem", color: "var(--text-3)", fontWeight: 500, lineHeight: 1.3 }}>{item.label}</span>
              </div>
              <div className="tabnum" style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-1)" }}>
                ${(item.value || 0).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
