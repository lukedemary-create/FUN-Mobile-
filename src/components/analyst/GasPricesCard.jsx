import React, { useState, useEffect } from "react";
import { Fuel } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function GasPricesCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("price_desc");

  useEffect(() => {
    fetchGasData();
  }, []);

  const fetchGasData = async () => {
    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Fetch current AAA average gas prices for all 50 US states. Return ONLY a JSON object with these exact fields:
        {
          "national_average": <number>,
          "states": [
            { "state": "State Name", "price": <number> },
            ...
          ]
        }
        Include all 50 states with current AAA regular gas prices.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            national_average: { type: "number" },
            states: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  state: { type: "string" },
                  price: { type: "number" }
                }
              }
            }
          }
        }
      });
      setData(response);
    } catch (error) {
      console.error("Gas data fetch error:", error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="t-card t-card-p" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1rem" }}>
          <Fuel size={16} style={{ color: "#f97316" }} />
          <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-1)" }}>AAA Gas Prices by State</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.5rem" }}>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 60, borderRadius: "0.5rem" }} />
          ))}
        </div>
      </div>
    );
  }

  const national = data?.national_average || 0;
  const states = data?.states || [];

  const sortedStates = [...states].sort((a, b) => {
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "price_asc") return a.price - b.price;
    return a.state.localeCompare(b.state);
  });

  const getStateColor = (price) => {
    const diff = price - national;
    if (diff > 0.15) return "var(--down)";
    if (diff < -0.15) return "var(--up)";
    return "var(--text-2)";
  };

  return (
    <div className="t-card t-card-p" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div style={{ width: 34, height: 34, borderRadius: "9px", background: "#f9731618", border: "1px solid #f9731630", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Fuel size={16} style={{ color: "#f97316" }} />
          </div>
          <div>
            <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-1)" }}>AAA Gas Prices by State</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>
              National avg: <span className="tabnum" style={{ color: "var(--text-1)", fontWeight: 700 }}>${national.toFixed(2)}/gal</span>
            </div>
          </div>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            background: "var(--elevated)", border: "1px solid var(--border-c)", borderRadius: "0.5rem",
            padding: "0.375rem 0.75rem", fontSize: "0.8125rem", color: "var(--text-2)", cursor: "pointer"
          }}
        >
          <option value="price_desc">Highest First</option>
          <option value="price_asc">Lowest First</option>
          <option value="alpha">A–Z</option>
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "0.5rem", maxHeight: "360px", overflowY: "auto", paddingRight: "0.25rem" }}>
        {sortedStates.map((state, i) => (
          <div key={i} style={{ background: "var(--elevated)", borderRadius: "0.5rem", padding: "0.625rem 0.75rem", border: "1px solid var(--border-c)" }}>
            <div style={{ fontSize: "0.6875rem", color: "var(--text-3)", marginBottom: "0.2rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{state.state}</div>
            <div className="tabnum" style={{ fontSize: "1rem", fontWeight: 700, color: getStateColor(state.price) }}>
              ${state.price.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "1rem", marginTop: "0.875rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--down)" }} />
          <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>+15¢ above avg</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--up)" }} />
          <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>-15¢ below avg</span>
        </div>
      </div>
    </div>
  );
}
