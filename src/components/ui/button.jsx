import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-manipulation",
  {
    variants: {
      variant: {
        default:
          "bg-[#c9a96e] text-[#07080a] font-semibold rounded-md hover:bg-[#d4901e]",
        destructive:
          "bg-[#ef4444] text-white rounded-md hover:bg-[#dc2626]",
        outline:
          "border border-[rgba(201,169,110,0.4)] text-[#c9a96e] bg-transparent rounded-md hover:border-[#c9a96e] hover:bg-[rgba(201,169,110,0.04)]",
        secondary:
          "bg-[#16181f] border border-[#2a2d38] text-[#94a3b8] rounded-md hover:bg-[#1a1d25] hover:text-[#f1f5f9]",
        ghost:
          "bg-transparent text-[#64748b] hover:text-[#f1f5f9]",
        link:
          "text-[#c9a96e] underline-offset-4 hover:underline bg-transparent",
      },
      size: {
        default: "h-9 px-4 py-2 min-h-[36px] text-[13px]",
        sm:      "h-8 px-3 min-h-[32px] text-[12px] rounded",
        lg:      "h-10 px-6 min-h-[40px] text-[13px]",
        icon:    "h-9 w-9 min-h-[36px] min-w-[36px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }