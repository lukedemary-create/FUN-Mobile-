import React, { useContext, useState, useMemo, useRef } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { Plus, Trash2, Edit3, Check, X, Search, Loader, CheckCircle } from "lucide-react";
import { RiskContext } from "../RiskAnalysis";
import { ASSET_CLASS_OPTIONS, ACCOUNT_TYPES, GOLD, GREEN, RED, YELLOW, riskColor } from "./riskData";

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const fmt    = (n) => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:0,maximumFractionDigits:0}).format(n);
const fmt2   = (n) => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
const fmtPct = (n) => (n >= 0 ? "+" : "") + n.toFixed(2) + "%";

/* ── Sector → Asset Class mapping ───────────────────────────────── */
function sectorToAssetClass(sector, name = "", ticker = "") {
  const s = (sector || "").toLowerCase();
  const n = (name || "").toLowerCase();
  const t = (ticker || "").toLowerCase();
  if (s === "real estate") return "Real Estate / REIT";
  if (n.includes("reit") || n.includes("real estate")) return "Real Estate / REIT";
  if (n.includes("treasury") || n.includes("t-bill") || n.includes("t-bond") || t==="bil"||t==="shv"||t==="shy"||t==="tlt"||t==="ief") return "US Government Bond";
  if (n.includes("bond") || n.includes("income") || n.includes("fixed")) {
    if (n.includes("high yield") || n.includes("junk")) return "High Yield Bond";
    if (n.includes("municipal") || n.includes("muni")) return "Municipal Bond";
    if (n.includes("tips") || n.includes("inflation")) return "TIPS (Inflation Protected)";
    if (n.includes("international") || n.includes("global")) return "International Bond";
    return "Investment Grade Corporate Bond";
  }
  if (n.includes("gold") || n.includes("silver") || n.includes("precious metal")) return "Gold / Precious Metals";
  if (n.includes("commodity") || n.includes("commodities") || n.includes("oil") || n.includes("energy fund")) return "Commodity";
  if (n.includes("emerging market")) return "Emerging Markets Stock";
  if (n.includes("international") || n.includes("global") || n.includes("world") || n.includes("foreign")) return "International Developed Stock";
  if (n.includes("small cap") || n.includes("small-cap")) return "US Small Cap Stock";
  if (n.includes("mid cap") || n.includes("mid-cap")) return "US Mid Cap Stock";
  if (n.includes("money market") || n.includes("cash")) return "Money Market / Cash";
  if (n.includes("crypto") || n.includes("bitcoin") || n.includes("ethereum")) return "Cryptocurrency";
  if (n.includes("preferred")) return "Preferred Stock";
  // Sector-based fallback for individual stocks
  if (s && s !== "n/a" && s !== "") return "US Large Cap Stock";
  return "US Large Cap Stock";
}

/* ── Blank form ──────────────────────────────────────────────────── */
const blank = () => ({
  id: Date.now() + Math.random(),
  ticker: "", name: "", assetClass: "US Large Cap Stock",
  shares: "", price: "", value: "", cost: "", accountType: "Taxable Brokerage",
  beta: "", expenseRatio: "", yield: "",
  _autoFilled: false,
});

/* ── Colors ──────────────────────────────────────────────────────── */
const COLORS = ["#22c55e","#3b82f6","#f97316","#a855f7","#c9a84c",
                "#84cc16","#ef4444","#0ea5e9","#14b8a6","#6366f1","#94a3b8","#ec4899"];

/* ── Bucket helpers ──────────────────────────────────────────────── */
function getBucket(ac) {
  if (!ac) return "Other";
  if (ac.includes("US Large")||ac.includes("US Mid")||ac.includes("US Small")) return "US Stocks";
  if (ac.includes("International Dev")) return "Intl Stocks";
  if (ac.includes("Emerging")) return "EM Stocks";
  if (ac.includes("Frontier")) return "Frontier";
  if (ac.includes("Government")||ac.includes("Treasury")||ac.includes("T-Bill")||ac.includes("T-Bond")||ac.includes("T-Note")) return "US Govt Bonds";
  if (ac.includes("Investment Grade Corp")) return "IG Corp Bonds";
  if (ac.includes("High Yield")) return "HY Bonds";
  if (ac.includes("Municipal")) return "Muni Bonds";
  if (ac.includes("TIPS")||ac.includes("I-Bond")) return "Inflation Bonds";
  if (ac.includes("Intl Bond")||ac.includes("EM Bond")) return "Intl Bonds";
  if (ac.includes("Real Estate")||ac.includes("REIT")) return "REITs";
  if (ac.includes("Commodity")||ac.includes("Gold")) return "Commodities";
  if (ac.includes("Money Market")||ac.includes("Cash")||ac.includes("CD")) return "Cash";
  if (ac.includes("Crypto")) return "Crypto";
  if (ac.includes("Preferred")) return "Preferred";
  if (ac.includes("Alternative")||ac.includes("Private")) return "Alternatives";
  return "Other";
}

function getGeoBucket(ac) {
  if (!ac) return "Other";
  if (ac.includes("US")||ac.includes("Treasury")||ac.includes("Government")||
      ac.includes("Municipal")||ac.includes("TIPS")||ac.includes("I-Bond")||
      ac.includes("Money Market")||ac.includes("CD")||ac.includes("Preferred")) return "United States";
  if (ac.includes("Emerging")||ac.includes("EM ")) return "Emerging Markets";
  if (ac.includes("International")||ac.includes("Intl")) return "International Dev";
  if (ac.includes("Frontier")) return "Frontier";
  if (ac.includes("Crypto")) return "Crypto";
  return "United States";
}

/* ── Portfolio stats ─────────────────────────────────────────────── */
function computeStats(portfolio) {
  const totalVal  = portfolio.reduce((s,h) => s+(parseFloat(h.value)||0), 0);
  const totalCost = portfolio.reduce((s,h) => s+(parseFloat(h.cost)||parseFloat(h.value)||0), 0);
  const wBeta     = totalVal > 0
    ? portfolio.reduce((s,h) => s+(parseFloat(h.value)||0)/totalVal*(parseFloat(h.beta)||1),0) : 1;
  const wExpRatio = totalVal > 0
    ? portfolio.reduce((s,h) => s+(parseFloat(h.value)||0)/totalVal*(parseFloat(h.expenseRatio)||0),0) : 0;
  const wYield    = totalVal > 0
    ? portfolio.reduce((s,h) => s+(parseFloat(h.value)||0)/totalVal*(parseFloat(h.yield)||0),0) : 0;
  const maxWt = totalVal > 0
    ? Math.max(...portfolio.map(h => (parseFloat(h.value)||0)/totalVal*100)) : 0;
  const equityWt = portfolio.reduce((s,h) => {
    const b = getBucket(h.assetClass);
    if (["US Stocks","Intl Stocks","EM Stocks","Frontier"].includes(b)) return s+(parseFloat(h.value)||0);
    return s;
  },0)/(totalVal||1);
  const bondWt = portfolio.reduce((s,h) => {
    const b = getBucket(h.assetClass);
    if (b.includes("Bond")||b.includes("Bonds")||b.includes("Cash")||b.includes("Inflation")) return s+(parseFloat(h.value)||0);
    return s;
  },0)/(totalVal||1);
  const vol    = 2 + equityWt * 18 + (maxWt > 25 ? 3 : 0);
  const sharpe = totalVal > 0 ? +((equityWt * 9 + bondWt * 3 - 5) / vol).toFixed(2) : 0;
  const maxDD  = -(equityWt * 45 + 5);
  const varD   = vol / Math.sqrt(252) * 1.645;
  const divScore = Math.max(0, Math.min(100,
    100 - maxWt * 1.2 + portfolio.length * 2 - (portfolio.length === 1 ? 40 : 0)));
  return {
    totalVal, totalCost,
    gainLoss: totalVal - totalCost,
    gainLossPct: totalCost > 0 ? (totalVal - totalCost) / totalCost * 100 : 0,
    wBeta: +wBeta.toFixed(2), wExpRatio: +wExpRatio.toFixed(3), wYield: +wYield.toFixed(2),
    maxWt: +maxWt.toFixed(1), vol: +vol.toFixed(1),
    sharpe: Math.max(-2, Math.min(3, sharpe)), maxDD: +maxDD.toFixed(1),
    varD: +varD.toFixed(2), divScore: +divScore.toFixed(0),
    equityPct: +(equityWt*100).toFixed(1), bondPct: +(bondWt*100).toFixed(1),
  };
}

function makeDonut(portfolio, fn) {
  const totalVal = portfolio.reduce((s,h) => s+(parseFloat(h.value)||0), 0);
  if (!totalVal) return [];
  const buckets = {};
  portfolio.forEach(h => { const b = fn(h.assetClass); buckets[b]=(buckets[b]||0)+(parseFloat(h.value)||0); });
  return Object.entries(buckets)
    .map(([name,val],i) => ({ name, value: +(val/totalVal*100).toFixed(1), color: COLORS[i%COLORS.length] }))
    .sort((a,b) => b.value - a.value);
}

/* ── Form field components ───────────────────────────────────────── */
const FieldLabel = ({ children, auto }) => (
  <div style={{ display:"flex",alignItems:"center",gap:4,marginBottom:3 }}>
    <label style={{ fontSize:"0.5rem",color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"0.08em" }}>
      {children}
    </label>
    {auto && (
      <span style={{ fontSize:"0.4375rem",color:GREEN,background:"rgba(34,197,94,0.1)",
        border:"1px solid rgba(34,197,94,0.2)",borderRadius:3,padding:"0px 4px",
        letterSpacing:"0.06em",textTransform:"uppercase",fontWeight:700 }}>
        AUTO
      </span>
    )}
  </div>
);

const Field = ({ label, value, onChange, placeholder, type="text", disabled=false, auto=false, style={} }) => (
  <div style={{ display:"flex",flexDirection:"column",...style }}>
    <FieldLabel auto={auto}>{label}</FieldLabel>
    <input
      type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} disabled={disabled}
      style={{
        background: disabled ? "var(--surface)" : "var(--elevated)",
        border: auto ? "1px solid rgba(34,197,94,0.25)" : "1px solid var(--border-c)",
        borderRadius:5, padding:"6px 9px",
        color: disabled ? "var(--text-3)" : "var(--text-1)",
        fontSize:"0.75rem", outline:"none",
        fontFamily:"'JetBrains Mono','Fira Code',monospace",
        cursor: disabled ? "default" : "text",
      }}
    />
  </div>
);

const SelectField = ({ label, value, onChange, options, auto=false, style={} }) => (
  <div style={{ display:"flex",flexDirection:"column",...style }}>
    <FieldLabel auto={auto}>{label}</FieldLabel>
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{
        background:"var(--elevated)",
        border: auto ? "1px solid rgba(34,197,94,0.25)" : "1px solid var(--border-c)",
        borderRadius:5, padding:"6px 9px",
        color:"var(--text-1)", fontSize:"0.75rem", outline:"none", cursor:"pointer",
      }}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

/* ── Ticker lookup ───────────────────────────────────────────────── */
async function lookupTicker(ticker) {
  const res = await fetch(`${BASE}/functions/getStockData`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticker: ticker.toUpperCase() }),
  });
  if (!res.ok) throw new Error("Lookup failed");
  return res.json();
}

/* ── Main component ──────────────────────────────────────────────── */
export default function TabPortfolio() {
  const { portfolio, savePortfolio } = useContext(RiskContext);
  const [form, setForm]       = useState(blank());
  const [editId, setEditId]   = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [sortCol, setSortCol] = useState("value");
  const [lookupState, setLookupState] = useState("idle"); // idle | loading | done | error
  const [lookupMsg, setLookupMsg]     = useState("");
  const tickerRef = useRef(null);

  const stats     = useMemo(() => computeStats(portfolio), [portfolio]);
  const allocAC   = useMemo(() => makeDonut(portfolio, getBucket), [portfolio]);
  const allocGeo  = useMemo(() => makeDonut(portfolio, getGeoBucket), [portfolio]);
  const allocAcct = useMemo(() => {
    const tv = portfolio.reduce((s,h)=>s+(parseFloat(h.value)||0),0);
    if (!tv) return [];
    const b = {};
    portfolio.forEach(h => { const k=h.accountType||"Taxable"; b[k]=(b[k]||0)+(parseFloat(h.value)||0); });
    return Object.entries(b).map(([name,val],i)=>({name,value:+(val/tv*100).toFixed(1),color:COLORS[i%COLORS.length]}));
  }, [portfolio]);

  const top10 = useMemo(() => {
    const tv = portfolio.reduce((s,h)=>s+(parseFloat(h.value)||0),0);
    return [...portfolio]
      .sort((a,b)=>(parseFloat(b.value)||0)-(parseFloat(a.value)||0))
      .slice(0,10)
      .map(h=>({ name:h.ticker||h.name||"?", value:tv>0?+(parseFloat(h.value||0)/tv*100).toFixed(1):0, color:COLORS[portfolio.indexOf(h)%COLORS.length] }));
  },[portfolio]);

  const sorted = useMemo(() => {
    const tv = portfolio.reduce((s,h)=>s+(parseFloat(h.value)||0),0);
    return [...portfolio]
      .map(h => ({
        ...h,
        _val: parseFloat(h.value)||0,
        _wt: tv > 0 ? (parseFloat(h.value)||0)/tv*100 : 0,
        _gl: (parseFloat(h.value)||0) - (parseFloat(h.cost)||parseFloat(h.value)||0),
        _glpct: h.cost && parseFloat(h.cost) > 0
          ? ((parseFloat(h.value)||0)-(parseFloat(h.cost)||0))/(parseFloat(h.cost)||1)*100 : 0,
      }))
      .sort((a,b) => {
        if (sortCol==="ticker") return (a.ticker||"").localeCompare(b.ticker||"");
        if (sortCol==="weight") return b._wt - a._wt;
        if (sortCol==="gl") return b._gl - a._gl;
        return b._val - a._val;
      });
  },[portfolio,sortCol]);

  const setField = (k,v) => setForm(f => ({...f,[k]:v}));

  /* ── Auto-calculate value when shares or price changes ── */
  const handleShares = (v) => {
    const shares = parseFloat(v) || 0;
    const price  = parseFloat(form.price) || 0;
    const newVal = shares && price ? (shares * price).toFixed(2) : form.value;
    setForm(f => ({...f, shares: v, value: newVal}));
  };

  const handlePrice = (v) => {
    const price  = parseFloat(v) || 0;
    const shares = parseFloat(form.shares) || 0;
    const newVal = shares && price ? (shares * price).toFixed(2) : form.value;
    setForm(f => ({...f, price: v, value: newVal}));
  };

  /* ── Ticker lookup handler ── */
  const doLookup = async () => {
    if (!form.ticker || form.ticker.length < 1) return;
    setLookupState("loading");
    setLookupMsg("");
    try {
      const data = await lookupTicker(form.ticker);
      if (data.error) throw new Error(data.error);

      const price      = data.current_price || 0;
      const shares     = parseFloat(form.shares) || 0;
      const autoValue  = shares && price ? (shares * price).toFixed(2) : "";
      const assetClass = sectorToAssetClass(data.sector, data.company_name, form.ticker);
      const betaVal    = data.beta != null ? String(data.beta.toFixed(2)) : "";
      const yieldVal   = data.dividend_yield != null ? String(data.dividend_yield.toFixed(2)) : "0";

      setForm(f => ({
        ...f,
        name:        data.company_name || f.name,
        price:       price ? String(price) : f.price,
        value:       autoValue || f.value,
        assetClass,
        beta:        betaVal,
        yield:       yieldVal,
        expenseRatio: f.expenseRatio || "0",
        _autoFilled: true,
        _livePrice:  price,
      }));

      setLookupState("done");
      setLookupMsg(`${data.company_name} · ${fmt2(price)} · ${data.sector || "N/A"}`);
    } catch (err) {
      setLookupState("error");
      setLookupMsg("Could not fetch ticker data. Check symbol or try again.");
    }
  };

  const handleTickerKeyDown = (e) => {
    if (e.key === "Enter") doLookup();
  };

  const startEdit = (h) => {
    setForm({ ...h, _autoFilled: false });
    setEditId(h.id);
    setShowForm(true);
    setLookupState("idle");
    setLookupMsg("");
  };

  const saveHolding = () => {
    if (!form.ticker && !form.name) return;
    const id = editId || Date.now() + Math.random();
    const holding = {
      ...form, id,
      // Coerce numeric strings to numbers so all tabs compute correctly
      shares:       parseFloat(form.shares)       || 0,
      price:        parseFloat(form.price)        || 0,
      value:        parseFloat(form.value)        || 0,
      cost:         parseFloat(form.cost)         || 0,
      beta:         parseFloat(form.beta)         || 0,
      yield:        parseFloat(form.yield)        || 0,
      expenseRatio: parseFloat(form.expenseRatio) || 0,
    };
    if (editId) {
      savePortfolio(portfolio.map(h => h.id === editId ? holding : h));
    } else {
      savePortfolio([...portfolio, holding]);
    }
    setForm(blank());
    setEditId(null);
    setShowForm(false);
    setLookupState("idle");
    setLookupMsg("");
  };

  const deleteHolding = (id) => savePortfolio(portfolio.filter(h => h.id !== id));

  const cancelForm = () => {
    setForm(blank()); setEditId(null);
    setShowForm(false); setLookupState("idle"); setLookupMsg("");
  };

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:"1rem" }}>

      {/* ── Add / Edit Form ── */}
      <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem" }}>
        {/* Header */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.875rem" }}>
          <div>
            <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",
              letterSpacing:"0.06em",textTransform:"uppercase" }}>
              {editId ? "Edit Holding" : "Portfolio Builder"}
            </div>
            <div style={{ fontSize:"0.625rem",color:"var(--text-3)",marginTop:2 }}>
              Enter a ticker — stock data auto-fills from live market data
            </div>
          </div>
          <div style={{ display:"flex",gap:6 }}>
            {showForm ? (
              <>
                <button onClick={saveHolding} disabled={!form.ticker && !form.name} style={{
                  display:"flex",alignItems:"center",gap:4,padding:"5px 14px",
                  background:"rgba(34,197,94,0.12)",border:"1px solid rgba(34,197,94,0.3)",
                  borderRadius:6,color:GREEN,fontSize:"0.75rem",fontWeight:700,
                  cursor:(!form.ticker&&!form.name)?"not-allowed":"pointer",
                  opacity:(!form.ticker&&!form.name)?0.5:1,
                }}><Check size={13}/> Save Holding</button>
                <button onClick={cancelForm} style={{
                  display:"flex",alignItems:"center",gap:4,padding:"5px 10px",
                  background:"none",border:"1px solid var(--border-c)",
                  borderRadius:6,color:"var(--text-3)",fontSize:"0.75rem",cursor:"pointer",
                }}><X size={13}/></button>
              </>
            ) : (
              <button onClick={() => { setShowForm(true); setLookupState("idle"); }} style={{
                display:"flex",alignItems:"center",gap:6,padding:"6px 14px",
                background:"rgba(201,169,110,0.12)",border:"1px solid rgba(201,169,110,0.3)",
                borderRadius:6,color:GOLD,fontSize:"0.75rem",fontWeight:700,cursor:"pointer",
              }}>
                <Plus size={14}/> Add Holding
              </button>
            )}
          </div>
        </div>

        {showForm && (
          <>
            {/* ── Step 1: Ticker lookup ── */}
            <div style={{ marginBottom:"1rem",padding:"0.875rem",
              background:"rgba(201,169,110,0.04)",border:"1px solid rgba(201,169,110,0.15)",borderRadius:8 }}>
              <div style={{ fontSize:"0.5rem",color:GOLD,letterSpacing:"0.12em",textTransform:"uppercase",
                fontWeight:700,marginBottom:"0.625rem" }}>
                Step 1 — Enter Ticker Symbol
              </div>
              <div style={{ display:"flex",gap:"0.625rem",alignItems:"flex-end",flexWrap:"wrap" }}>
                {/* Ticker input */}
                <div style={{ display:"flex",flexDirection:"column",gap:3 }}>
                  <label style={{ fontSize:"0.5rem",color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"0.08em" }}>
                    Ticker Symbol
                  </label>
                  <input
                    ref={tickerRef}
                    value={form.ticker}
                    onChange={e => {
                      setField("ticker", e.target.value.toUpperCase());
                      setLookupState("idle");
                      setLookupMsg("");
                    }}
                    onKeyDown={handleTickerKeyDown}
                    placeholder="AAPL, VTI, BND, QQQ…"
                    style={{
                      background:"var(--elevated)",border:"1px solid var(--border-c)",borderRadius:5,
                      padding:"7px 10px",color:"var(--text-1)",fontSize:"0.875rem",outline:"none",
                      fontFamily:"monospace",fontWeight:800,width:160,letterSpacing:"0.04em",
                    }}
                  />
                </div>

                {/* Lookup button */}
                <button
                  onClick={doLookup}
                  disabled={!form.ticker || lookupState === "loading"}
                  style={{
                    display:"flex",alignItems:"center",gap:6,padding:"7px 16px",
                    background: lookupState==="done" ? "rgba(34,197,94,0.12)" : "rgba(201,169,110,0.12)",
                    border: lookupState==="done" ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(201,169,110,0.3)",
                    borderRadius:6,
                    color: lookupState==="done" ? GREEN : GOLD,
                    fontSize:"0.75rem",fontWeight:700,
                    cursor:(!form.ticker||lookupState==="loading")?"not-allowed":"pointer",
                    opacity:(!form.ticker||lookupState==="loading")?0.6:1,
                  }}
                >
                  {lookupState === "loading"
                    ? <><Loader size={13} style={{ animation:"tSpin 0.8s linear infinite" }}/> Fetching…</>
                    : lookupState === "done"
                    ? <><CheckCircle size={13}/> Data Loaded</>
                    : <><Search size={13}/> Lookup Stock Data</>
                  }
                </button>

                {/* Tip */}
                <div style={{ fontSize:"0.5625rem",color:"var(--text-3)",alignSelf:"center" }}>
                  or press <kbd style={{ background:"var(--elevated)",border:"1px solid var(--border-c)",
                    borderRadius:3,padding:"1px 5px",fontSize:"0.5rem",color:"var(--text-2)" }}>Enter</kbd> after typing
                </div>
              </div>

              {/* Lookup result banner */}
              {lookupMsg && (
                <div style={{
                  marginTop:"0.625rem",padding:"6px 10px",borderRadius:6,fontSize:"0.625rem",
                  background: lookupState==="error" ? "rgba(239,68,68,0.07)" : "rgba(34,197,94,0.07)",
                  border: `1px solid ${lookupState==="error" ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`,
                  color: lookupState==="error" ? RED : GREEN,
                }}>
                  {lookupState === "done" && "✓ "}{lookupMsg}
                </div>
              )}
            </div>

            {/* ── Step 2: Your information ── */}
            <div style={{ marginBottom:"0.875rem" }}>
              <div style={{ fontSize:"0.5rem",color:"var(--text-3)",letterSpacing:"0.12em",textTransform:"uppercase",
                fontWeight:700,marginBottom:"0.625rem" }}>
                Step 2 — Your Position Details
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:"0.625rem" }}>
                <Field label="Shares Owned" value={form.shares}
                  onChange={handleShares} placeholder="100" type="number"/>
                <Field label="Cost Basis ($)" value={form.cost}
                  onChange={v=>setField("cost",v)} placeholder="8,500.00" type="number"/>
                <SelectField label="Account Type" value={form.accountType}
                  onChange={v=>setField("accountType",v)} options={ACCOUNT_TYPES}/>
              </div>
            </div>

            {/* ── Step 3: Auto-filled data ── */}
            <div>
              <div style={{ fontSize:"0.5rem",color:"var(--text-3)",letterSpacing:"0.12em",textTransform:"uppercase",
                fontWeight:700,marginBottom:"0.625rem" }}>
                Step 3 — Market Data{" "}
                <span style={{ color:"var(--text-3)",fontWeight:400,textTransform:"none",letterSpacing:0 }}>
                  (auto-filled from live data · you can adjust)
                </span>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:"0.625rem" }}>
                <Field label="Company / Fund Name" value={form.name}
                  onChange={v=>setField("name",v)} placeholder="Apple Inc."
                  auto={form._autoFilled && !!form.name}/>
                <Field label="Current Price ($)" value={form.price}
                  onChange={handlePrice} placeholder="182.50" type="number"
                  auto={form._autoFilled && !!form.price}/>
                <Field label="Current Value ($)" value={form.value}
                  onChange={v=>setField("value",v)} placeholder="auto-calculated"
                  auto={form._autoFilled && !!form.value}/>
                <SelectField label="Asset Class" value={form.assetClass}
                  onChange={v=>setField("assetClass",v)} options={ASSET_CLASS_OPTIONS}
                  auto={form._autoFilled} style={{ gridColumn:"span 2" }}/>
                <Field label="Beta" value={form.beta}
                  onChange={v=>setField("beta",v)} placeholder="1.00" type="number"
                  auto={form._autoFilled && !!form.beta}/>
                <Field label="Dividend Yield (%)" value={form.yield}
                  onChange={v=>setField("yield",v)} placeholder="1.50" type="number"
                  auto={form._autoFilled}/>
                <Field label="Expense Ratio (%)" value={form.expenseRatio}
                  onChange={v=>setField("expenseRatio",v)} placeholder="0.03" type="number"/>
              </div>

              {form._autoFilled && (
                <div style={{ marginTop:"0.625rem",fontSize:"0.5625rem",color:"var(--text-3)",
                  display:"flex",alignItems:"center",gap:4 }}>
                  <div style={{ width:5,height:5,borderRadius:"50%",background:GREEN }}/>
                  Fields marked <strong style={{ color:GREEN }}>AUTO</strong> were populated from live market data.
                  You can edit any field before saving.
                </div>
              )}
            </div>
          </>
        )}

        {!showForm && portfolio.length === 0 && (
          <div style={{ textAlign:"center",padding:"1.75rem 1rem",color:"var(--text-3)",fontSize:"0.75rem",lineHeight:1.7 }}>
            Click <strong style={{ color:GOLD }}>Add Holding</strong> to start building your portfolio.<br/>
            Just enter a <strong style={{ color:"var(--text-2)" }}>ticker symbol</strong> and shares — we fetch everything else automatically.
          </div>
        )}
      </div>

      {/* ── Holdings Table ── */}
      {portfolio.length > 0 && (
        <>
          <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem" }}>
            <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:"0.75rem",
              letterSpacing:"0.06em",textTransform:"uppercase" }}>
              Holdings ({portfolio.length})
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%",borderCollapse:"collapse",fontSize:"0.6875rem" }}>
                <thead>
                  <tr style={{ borderBottom:"1px solid var(--border-c)" }}>
                    {[["Ticker","ticker"],["Name","name"],["Asset Class","class"],["Account","acct"],
                      ["Price","price"],["Value","value"],["Weight %","weight"],
                      ["Gain/Loss","gl"],["G/L %","glpct"],
                      ["Beta","beta"],["Exp Ratio","exp"],["Yield","yld"],["","actions"]].map(([h,k]) => (
                      <th key={k} onClick={() => !["actions","class","acct"].includes(k) && setSortCol(k)}
                        style={{ padding:"5px 8px",textAlign:"left",color:"var(--text-3)",
                          fontWeight:600,fontSize:"0.5rem",letterSpacing:"0.08em",textTransform:"uppercase",
                          cursor:!["actions","class","acct"].includes(k)?"pointer":"default",whiteSpace:"nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map(h => (
                    <tr key={h.id} style={{ borderBottom:"1px solid var(--elevated)" }}>
                      <td style={{ padding:"7px 8px",fontWeight:800,color:GOLD,fontFamily:"monospace" }}>{h.ticker||"—"}</td>
                      <td style={{ padding:"7px 8px",color:"var(--text-1)",maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{h.name||"—"}</td>
                      <td style={{ padding:"7px 8px",color:"var(--text-3)",fontSize:"0.5625rem",whiteSpace:"nowrap" }}>{h.assetClass}</td>
                      <td style={{ padding:"7px 8px",color:"var(--text-3)",fontSize:"0.5625rem",whiteSpace:"nowrap" }}>{h.accountType}</td>
                      <td style={{ padding:"7px 8px",color:"var(--text-2)",fontFamily:"monospace" }}>
                        {h.price ? fmt2(parseFloat(h.price)) : "—"}
                      </td>
                      <td style={{ padding:"7px 8px",color:"var(--text-1)",fontWeight:600,fontFamily:"monospace" }}>{fmt(h._val)}</td>
                      <td style={{ padding:"7px 8px",color:GOLD,fontWeight:700 }}>{h._wt.toFixed(1)}%</td>
                      <td style={{ padding:"7px 8px",color:h._gl>=0?GREEN:RED,fontFamily:"monospace" }}>
                        {h._gl>=0?"+":""}{fmt(h._gl)}
                      </td>
                      <td style={{ padding:"7px 8px",color:h._glpct>=0?GREEN:RED,fontFamily:"monospace" }}>
                        {h._glpct===0?"—":fmtPct(h._glpct)}
                      </td>
                      <td style={{ padding:"7px 8px",color:"var(--text-2)" }}>{parseFloat(h.beta)||"—"}</td>
                      <td style={{ padding:"7px 8px",color:"var(--text-2)" }}>{h.expenseRatio||0}%</td>
                      <td style={{ padding:"7px 8px",color:"var(--text-2)" }}>{h.yield||0}%</td>
                      <td style={{ padding:"7px 8px" }}>
                        <div style={{ display:"flex",gap:4 }}>
                          <button onClick={() => startEdit(h)} title="Edit"
                            style={{ background:"none",border:"none",cursor:"pointer",color:"var(--text-3)",padding:2 }}>
                            <Edit3 size={12}/>
                          </button>
                          <button onClick={() => deleteHolding(h.id)} title="Delete"
                            style={{ background:"none",border:"none",cursor:"pointer",color:RED,padding:2 }}>
                            <Trash2 size={12}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Portfolio Statistics ── */}
          <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem" }}>
            <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:"0.75rem",
              letterSpacing:"0.06em",textTransform:"uppercase" }}>Portfolio Statistics</div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:"0.5rem" }}>
              {[
                ["Total Portfolio Value",    fmt(stats.totalVal),                  GOLD],
                ["Total Cost Basis",         fmt(stats.totalCost),                 "var(--text-1)"],
                ["Unrealized Gain / Loss",   (stats.gainLoss>=0?"+":"")+fmt(stats.gainLoss), stats.gainLoss>=0?GREEN:RED],
                ["Total Return on Cost",     fmtPct(stats.gainLossPct),            stats.gainLossPct>=0?GREEN:RED],
                ["Portfolio Volatility",     stats.vol+"%",                        stats.vol>15?RED:YELLOW],
                ["Sharpe Ratio (RF=5%)",     stats.sharpe,                         stats.sharpe>=0.8?GREEN:YELLOW],
                ["Weighted Avg Beta",        stats.wBeta,                          "var(--text-1)"],
                ["Weighted Avg Exp Ratio",   stats.wExpRatio+"%",                  "var(--text-1)"],
                ["Weighted Avg Yield",       stats.wYield+"%",                     GREEN],
                ["Number of Holdings",       portfolio.length,                     "var(--text-1)"],
                ["Largest Position",         stats.maxWt+"%",                      stats.maxWt>20?RED:YELLOW],
                ["Diversification Score",    stats.divScore+"/100",                stats.divScore>=70?GREEN:stats.divScore>=40?YELLOW:RED],
                ["Max Drawdown (Est.)",      stats.maxDD+"%",                      RED],
                ["VaR 95% Daily",            "-"+stats.varD+"%",                   RED],
                ["Equity Allocation",        stats.equityPct+"%",                  "var(--text-1)"],
                ["Fixed Income Allocation",  stats.bondPct+"%",                    "var(--text-1)"],
              ].map(([l,v,c],i)=>(
                <div key={i} style={{ padding:"0.5rem 0.75rem",background:"var(--elevated)",
                  borderRadius:6,border:"1px solid var(--border-c)" }}>
                  <div style={{ fontSize:"0.5rem",color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"0.06em" }}>{l}</div>
                  <div style={{ fontSize:"0.9375rem",fontWeight:800,color:c,marginTop:2 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Allocation Charts ── */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1rem" }}>
            {[
              ["By Asset Class", allocAC],
              ["By Geography",   allocGeo],
              ["By Account Type",allocAcct],
            ].map(([title,data]) => (
              <div key={title} style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem" }}>
                <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:"0.75rem",
                  letterSpacing:"0.06em",textTransform:"uppercase" }}>{title}</div>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                      dataKey="value" paddingAngle={2}>
                      {data.map((e,i)=><Cell key={i} fill={e.color}/>)}
                    </Pie>
                    <Tooltip formatter={v=>[v+"%",""]}
                      contentStyle={{ background:"var(--elevated)",border:"1px solid var(--border-c)",borderRadius:6,fontSize:"0.625rem",color:"var(--text-1)" }}
                      itemStyle={{ color:"var(--text-1)" }}/>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display:"flex",flexDirection:"column",gap:2,marginTop:4 }}>
                  {data.map((d,i)=>(
                    <div key={i} style={{ display:"flex",alignItems:"center",gap:4,fontSize:"0.5625rem",color:"var(--text-2)" }}>
                      <div style={{ width:6,height:6,borderRadius:"50%",background:d.color,flexShrink:0 }}/>
                      <span style={{ flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{d.name}</span>
                      <span style={{ fontWeight:700,color:"var(--text-1)" }}>{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── Concentration Chart ── */}
          {top10.length > 0 && (
            <div style={{ background:"var(--surface)",border:"1px solid var(--border-c)",borderRadius:8,padding:"1rem" }}>
              <div style={{ fontSize:"0.6875rem",fontWeight:700,color:"var(--text-1)",marginBottom:4,
                letterSpacing:"0.06em",textTransform:"uppercase" }}>Concentration Risk — Top 10 Holdings</div>
              <div style={{ fontSize:"0.625rem",color:"var(--text-3)",marginBottom:"0.75rem" }}>
                Any single position above 20% represents meaningful concentration risk
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={top10} layout="vertical" margin={{left:10,right:30,top:0,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-c)" horizontal={false}/>
                  <XAxis type="number" tick={{ fill:"var(--text-3)",fontSize:10 }} tickFormatter={v=>v+"%"}/>
                  <YAxis type="category" dataKey="name" width={60} tick={{ fill:"var(--text-2)",fontSize:11,fontWeight:600 }}/>
                  <Tooltip formatter={v=>[v+"%","Weight"]}
                    contentStyle={{ background:"var(--elevated)",border:"1px solid var(--border-c)",borderRadius:6,fontSize:"0.6875rem",color:"var(--text-1)" }}
                    itemStyle={{ color:"var(--text-1)" }}/>
                  <Bar dataKey="value" radius={[0,4,4,0]}>
                    {top10.map((e,i)=>(
                      <Cell key={i} fill={e.value>20?RED:e.value>10?YELLOW:GREEN}/>
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}

      <style>{`@keyframes tSpin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
