import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded px-3 py-2 text-[13px] font-normal",
        "bg-[rgba(255,255,255,0.025)] text-[#f1f5f9] placeholder:text-[#64748b]",
        "border border-[#1e2028] border-b-[#2a2d38]",
        "outline-none transition-colors duration-150",
        "focus:border-[#1e2028] focus:border-b-[#c9a96e] focus:bg-[rgba(201,169,110,0.025)]",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "touch-manipulation",
        className
      )}
      ref={ref}
      {...props}
    />
  );
})
Input.displayName = "Input"

export { Input }