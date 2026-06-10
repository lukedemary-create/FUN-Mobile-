import React from "react";
import { motion } from "framer-motion";

const EASE_OUT = [0.23, 1, 0.32, 1];

export default function SectionHeader({ title, subtitle, eyebrow, action, accent }) {
  const accentColor = accent || "var(--gold)";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
      style={{
        marginBottom: "2rem",
        display: "flex", alignItems: "flex-end",
        justifyContent: "space-between", gap: "1rem",
      }}
    >
      <div>
        {eyebrow && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.75rem" }}>
            <div style={{ width: 20, height: 1, background: accentColor, opacity: 0.55, flexShrink: 0 }} />
            <p style={{
              fontSize: "0.5625rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.24em",
              color: accentColor,
              margin: 0,
              fontFamily: "'Inter', system-ui, sans-serif",
            }}>
              {eyebrow}
            </p>
          </div>
        )}
        <h1 style={{
          fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          color: "var(--text-1)",
          lineHeight: 1.05,
          margin: 0,
          fontFamily: "'Inter', system-ui, sans-serif",
          display: "flex", alignItems: "baseline", gap: "0.375rem", flexWrap: "wrap",
        }}>
          {typeof title === "string"
            ? title.split(" ").map((word, i, arr) =>
                i === arr.length - 1 ? (
                  <em key={i} style={{
                    fontStyle: "italic",
                    color: accentColor,
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}>
                    {word}
                  </em>
                ) : (
                  <span key={i}>{word}</span>
                )
              )
            : title}
        </h1>
        {subtitle && (
          <p style={{
            fontSize: "0.875rem",
            color: "var(--text-3)",
            lineHeight: 1.75,
            marginTop: "0.5rem",
            maxWidth: "560px",
            fontFamily: "'Inter', system-ui, sans-serif",
          }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div style={{ flexShrink: 0 }}>
          {action}
        </div>
      )}
    </motion.div>
  );
}
