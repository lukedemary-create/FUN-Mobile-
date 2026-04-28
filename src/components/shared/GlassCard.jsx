import React from "react";
import { cn } from "@/lib/utils";

export default function GlassCard({ children, className, hover = false, onClick, gradient, role, tabIndex, onKeyDown, style, ...props }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "t-card t-card-p",
        hover && "t-card-hover cursor-pointer",
        className
      )}
      role={role}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
