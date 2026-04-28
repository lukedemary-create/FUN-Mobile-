import React from "react";
import { MessageCircle, BookOpen, Play, ClipboardList } from "lucide-react";

const tabs = [
  { key: "ask", label: "Ask", icon: MessageCircle },
  { key: "learn", label: "Learn", icon: BookOpen },
  { key: "do", label: "Do", icon: Play },
  { key: "plan", label: "Plan", icon: ClipboardList },
];

export default function PillarTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex gap-1 p-1 rounded-xl bg-[#0a0e17] border border-[#1e293b] mb-6">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onTabChange(t.key)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium flex-1 justify-center transition-all touch-manipulation active:scale-95 min-h-[44px] ${
            activeTab === t.key
              ? "bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/20"
              : "text-[#64748b] hover:text-white"
          }`}
          aria-label={`View ${t.label} section`}
          aria-pressed={activeTab === t.key}
        >
          <t.icon className="w-4 h-4" />
          <span className="hidden sm:inline">{t.label}</span>
        </button>
      ))}
    </div>
  );
}