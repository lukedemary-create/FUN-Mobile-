import React from "react";

/**
 * Typographic empty state. No illustrations, no icons, no marketing.
 * Usage:
 *   <EmptyState title="No positions" description="Add a ticker to get started." action="Add ticker" onAction={fn} />
 */
export default function EmptyState({ title, description, action, onAction }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "4rem 2rem",
      textAlign: "center",
    }}>
      <p style={{
        fontSize: "0.875rem",
        fontWeight: 600,
        color: "#f1f5f9",
        marginBottom: description ? "0.375rem" : action ? "1rem" : 0,
        letterSpacing: "-0.01em",
      }}>
        {title}
      </p>
      {description && (
        <p style={{
          fontSize: "0.8125rem",
          color: "#64748b",
          lineHeight: 1.7,
          maxWidth: 300,
          marginBottom: action ? "1.25rem" : 0,
        }}>
          {description}
        </p>
      )}
      {action && onAction && (
        <button
          onClick={onAction}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#c9a96e",
            fontSize: "0.8125rem",
            fontFamily: "inherit",
            textDecoration: "underline",
            textDecorationColor: "rgba(201,169,110,0.4)",
            textUnderlineOffset: 3,
            padding: 0,
          }}
        >
          {action}
        </button>
      )}
    </div>
  );
}
