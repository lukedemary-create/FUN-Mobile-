import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("t-skeleton", className)}
      {...props}
    />
  );
}

export { Skeleton }
