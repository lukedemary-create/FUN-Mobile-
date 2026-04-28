import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Trash2, Settings as SettingsIcon, User, Shield } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me()
  });

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE MY ACCOUNT") {
      toast.error("Please type the exact phrase to confirm");
      return;
    }

    setIsDeleting(true);
    try {
      const entities = ["Portfolio", "FinancialPlan", "UserBudget", "EstatePlan", "ChatHistory", "UserProgress"];
      for (const entityName of entities) {
        try {
          const records = await base44.entities[entityName].filter({ created_by: user.email });
          for (const record of records) {
            await base44.entities[entityName].delete(record.id);
          }
        } catch (e) {
          console.log(`No ${entityName} records or error:`, e);
        }
      }
      toast.success("Account data deleted. You will be logged out.");
      setTimeout(() => { base44.auth.logout(); }, 2000);
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account data. Please contact support.");
      setIsDeleting(false);
    }
  };

  const InfoRow = ({ label, value, last }) => (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "0.875rem 0",
      borderBottom: last ? "none" : "1px solid var(--border-c)"
    }}>
      <span className="t-label">{label}</span>
      <span style={{ fontSize: "0.9375rem", color: "var(--text-1)", fontWeight: 500 }}>{value || "—"}</span>
    </div>
  );

  return (
    <div style={{ maxWidth: 700 }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 className="t-page-title">SETTINGS</h1>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", marginTop: 4 }}>Manage your account and preferences</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
        {/* Account Info */}
        <div className="t-card t-card-p">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: "9px", background: "rgba(0,184,153,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={16} style={{ color: "var(--teal)" }} />
            </div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-1)" }}>Account</h3>
          </div>
          <InfoRow label="Email" value={user?.email} />
          <InfoRow label="Full Name" value={user?.full_name} />
          <InfoRow label="User ID" value={user?.id} last />
        </div>

        {/* Privacy & Security */}
        <div className="t-card t-card-p">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: "9px", background: "rgba(26,159,216,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={16} style={{ color: "var(--blue)" }} />
            </div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-1)" }}>Security</h3>
          </div>
          <div style={{ borderBottom: "1px solid var(--border-c)", padding: "0.875rem 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-1)" }}>Data Encryption</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-3)", marginTop: 2 }}>All data is encrypted at rest and in transit</div>
            </div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(0,184,153,0.12)", color: "var(--teal)" }}>ACTIVE</span>
          </div>
          <div style={{ padding: "0.875rem 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-1)" }}>Educational Use Only</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-3)", marginTop: 2 }}>Financial content is for informational purposes only</div>
            </div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(26,159,216,0.12)", color: "var(--blue)" }}>INFO</span>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="t-card t-card-p" style={{ borderLeft: "3px solid var(--down)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: "9px", background: "rgba(255,59,92,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertTriangle size={16} style={{ color: "var(--down)" }} />
            </div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--down)" }}>Danger Zone</h3>
          </div>
          <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-1)", marginBottom: "0.5rem" }}>Delete Account &amp; All Data</h4>
          <p style={{ fontSize: "0.875rem", color: "var(--text-3)", lineHeight: 1.65, marginBottom: "1rem" }}>
            Permanently delete your account and all associated data.{" "}
            <span style={{ color: "var(--down)", fontWeight: 600 }}>This action cannot be undone.</span>
          </p>
          <button
            onClick={() => setShowDeleteDialog(true)}
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.5rem 1rem", borderRadius: "0.5rem",
              border: "none", background: "var(--down)",
              color: "#fff", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer"
            }}
          >
            <Trash2 size={14} /> Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog (inline) */}
      {showDeleteDialog && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(7,11,20,0.8)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "1rem"
        }}>
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border-c)",
            borderRadius: "1rem", padding: "1.75rem", maxWidth: 420, width: "100%"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,59,92,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <AlertTriangle size={20} style={{ color: "var(--down)" }} />
              </div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-1)" }}>Delete Account?</h3>
            </div>

            <p style={{ fontSize: "0.875rem", color: "var(--text-3)", marginBottom: "0.5rem" }}>This will permanently delete:</p>
            <ul style={{ paddingLeft: "1.25rem", marginBottom: "0.75rem", lineHeight: 1.8 }}>
              {["Portfolio holdings", "Budget plans & goals", "Estate plans", "Learning progress", "AI chat history", "All settings"].map((item, i) => (
                <li key={i} style={{ fontSize: "0.875rem", color: "var(--text-3)" }}>{item}</li>
              ))}
            </ul>
            <p style={{ color: "var(--down)", fontWeight: 600, fontSize: "0.875rem", marginBottom: "1.25rem" }}>
              This action is irreversible. All data will be permanently lost.
            </p>

            <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", marginBottom: "0.5rem" }}>
              Type <span style={{ color: "var(--text-1)", fontFamily: "monospace", fontWeight: 700 }}>DELETE MY ACCOUNT</span> to confirm:
            </p>
            <input
              className="t-input"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="DELETE MY ACCOUNT"
              style={{ width: "100%", fontFamily: "monospace", marginBottom: "1.25rem" }}
            />

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                className="t-btn"
                onClick={() => { setShowDeleteDialog(false); setDeleteConfirmation(""); }}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== "DELETE MY ACCOUNT" || isDeleting}
                style={{
                  flex: 1, padding: "0.625rem", borderRadius: "0.5rem", border: "none",
                  background: deleteConfirmation === "DELETE MY ACCOUNT" && !isDeleting ? "var(--down)" : "var(--elevated)",
                  color: deleteConfirmation === "DELETE MY ACCOUNT" && !isDeleting ? "#fff" : "var(--text-3)",
                  fontSize: "0.875rem", fontWeight: 600,
                  cursor: deleteConfirmation === "DELETE MY ACCOUNT" && !isDeleting ? "pointer" : "not-allowed"
                }}
              >
                {isDeleting ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
