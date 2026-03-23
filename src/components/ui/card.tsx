import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_18px_50px_-28px_rgba(16,42,67,0.45)]",
      className,
    )}
    {...props}
  />
);
