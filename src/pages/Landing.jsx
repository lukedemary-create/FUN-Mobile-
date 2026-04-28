import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GOLD = "#c9a84c";
const GREEN = "#2dd4a4";

/* ── Logos ───────────────────────────────────────────────────────── */
const PlonoraLogo = () => (
  <div style={{
    width: 52, height: 52, background: GOLD, borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "#07080a", lineHeight: 1 }}>P</span>
  </div>
);

const NexusLogo = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <polygon points="26,3 49,14 49,38 26,49 3,38 3,14" fill="none" stroke={GOLD} strokeWidth="1.5"/>
    <polygon points="26,12 40,19.5 40,32.5 26,40 12,32.5 12,19.5" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.45"/>
    <polygon points="26,19 34,23.5 34,28.5 26,33 18,28.5 18,23.5" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.25"/>
    <circle cx="26" cy="26" r="4" fill={GOLD}/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const CheckIcon = ({ color = GOLD }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

export default function Landing() {
  const navigate = useNavigate();
  const [hovering, setHovering] = useState(null);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060912",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: "#dde6f5",
    }}>
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
        pointerEvents: "none",
      }} />

      {/* Subtle glow */}
      <div style={{
        position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)",
        width: 800, height: 400,
        background: `radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Header */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 40px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(6,9,18,0.8)",
        backdropFilter: "blur(12px)",
        position: "relative", zIndex: 1,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%", background: GREEN,
            boxShadow: `0 0 8px ${GREEN}`,
            animation: "pulse 2s ease infinite",
          }} />
          <span style={{ fontSize: 11, color: GREEN, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Secure Session
          </span>
        </div>
        <div style={{
          padding: "5px 14px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 100,
          fontSize: 12, color: "rgba(255,255,255,0.4)",
        }}>
          Planora Financial Suite
        </div>
      </header>

      {/* Main content */}
      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: 1000, margin: "0 auto",
        padding: "64px 24px 48px",
      }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h1 style={{
            fontSize: 42, fontWeight: 800, letterSpacing: "-0.03em",
            color: "#dde6f5", lineHeight: 1.15, marginBottom: 14,
          }}>
            Choose your workspace
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", maxWidth: 420, margin: "0 auto", lineHeight: 1.6 }}>
            Two platforms. One ecosystem. Built for the future of wealth management.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* ── Planora Terminal Card ── */}
          <div
            onClick={() => navigate("/dashboard")}
            onMouseEnter={() => setHovering("planora")}
            onMouseLeave={() => setHovering(null)}
            style={{
              background: hovering === "planora" ? "#0d1526" : "#0a1020",
              border: `1px solid ${hovering === "planora" ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.07)"}`,
              borderRadius: 16, padding: 28,
              cursor: "pointer", position: "relative", overflow: "hidden",
              transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
              boxShadow: hovering === "planora" ? "0 0 40px rgba(201,168,76,0.1)" : "none",
              display: "flex", flexDirection: "column",
            }}>
            {/* Gold top bar */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: GOLD, borderRadius: "16px 16px 0 0" }} />

            <div style={{ marginBottom: 18 }}><PlonoraLogo /></div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 6 }}>
              Research & Intelligence
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#dde6f5", letterSpacing: "-0.01em", marginBottom: 12 }}>
              Planora Terminal
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.65, marginBottom: 24 }}>
              Institutional-grade market intelligence, portfolio risk analysis, financial education, and wealth planning tools — all in one terminal.
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24, flex: 1 }}>
              {[
                "Planora AI — Bloomberg Terminal × BlackRock advisor",
                "Live market data, sectors & macro intelligence",
                "Risk analysis with Monte Carlo simulation",
                "Budget planner, future planning & calculators",
                "Financial education & Wealth Counsel",
              ].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                  <CheckIcon color={GOLD} />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 8, padding: "10px 14px",
              marginBottom: 18, display: "flex", flexDirection: "column", gap: 5,
            }}>
              {[
                ["Status", "Live Data Active"],
                ["Modules", "19 sections"],
                ["Access", "Open Platform"],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{l}</span>
                  <span style={{ fontSize: 12, color: "#dde6f5", fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>

            <button style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "12px 20px",
              background: GOLD, color: "#09111f",
              border: "none", borderRadius: 8,
              fontSize: 13, fontWeight: 700, cursor: "pointer", width: "100%",
              letterSpacing: "0.01em",
            }}>
              Enter Terminal <ArrowIcon />
            </button>
          </div>

          {/* ── Nexus Card ── */}
          <div
            onClick={() => navigate("/nexus")}
            onMouseEnter={() => setHovering("nexus")}
            onMouseLeave={() => setHovering(null)}
            style={{
              background: hovering === "nexus" ? "#0d1526" : "#0a1020",
              border: `1px solid ${hovering === "nexus" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)"}`,
              borderRadius: 16, padding: 28,
              cursor: "pointer", position: "relative", overflow: "hidden",
              transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
              boxShadow: hovering === "nexus" ? "0 0 40px rgba(255,255,255,0.04)" : "none",
              display: "flex", flexDirection: "column",
            }}>
            {/* Subtle top bar */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.12)", borderRadius: "16px 16px 0 0" }} />

            <div style={{ marginBottom: 18 }}><NexusLogo /></div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 6 }}>
              Advisor · Client Platform
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#dde6f5", letterSpacing: "-0.01em", marginBottom: 12 }}>
              Nexus
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.65, marginBottom: 24 }}>
              The private two-sided workspace between advisor and client. Live shared dashboards, life event tracking, secure messaging, and real-time portfolio visibility.
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24, flex: 1 }}>
              {[
                "Advisor command center — manage all clients",
                "Client portal — live portfolio & goals",
                "Life event logging & planning triggers",
                "Broadcast messaging with personalization",
                "Shared meeting agenda & action items",
              ].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                  <CheckIcon color="rgba(255,255,255,0.35)" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 8, padding: "10px 14px",
              marginBottom: 18, display: "flex", flexDirection: "column", gap: 5,
            }}>
              {[
                ["Advisor", "Marcus Chen, CFP® · CFA"],
                ["AUM", "$47.5M"],
                ["Clients", "23 active"],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{l}</span>
                  <span style={{ fontSize: 12, color: l === "AUM" ? GOLD : "#dde6f5", fontWeight: 500, fontFamily: l === "AUM" ? "'JetBrains Mono',monospace" : "inherit" }}>{v}</span>
                </div>
              ))}
            </div>

            <button style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "12px 20px",
              background: "rgba(255,255,255,0.06)", color: "#dde6f5",
              border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8,
              fontSize: 13, fontWeight: 600, cursor: "pointer", width: "100%",
            }}>
              Enter Nexus <ArrowIcon />
            </button>
          </div>
        </div>

        {/* Footer trust bar */}
        <div style={{ marginTop: 48, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28, flexWrap: "wrap" }}>
            {["Bank-Grade Encryption", "256-bit TLS", "SOC 2 Compliant", "FINRA Registered"].map(s => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <ShieldIcon />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
