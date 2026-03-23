import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const palette = {
  neutral: "bg-[rgba(16,42,67,0.08)] text-[var(--ink)]",
  success: "bg-[rgba(31,122,98,0.14)] text-[var(--success)]",
  warning: "bg-[rgba(181,122,22,0.16)] text-[var(--warning)]",
  danger: "bg-[rgba(191,59,59,0.14)] text-[var(--danger)]",
  accent: "bg-[rgba(183,93,42,0.12)] text-[var(--accent-strong)]",
};

export const Badge = ({
  className,
  color = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { color?: keyof typeof palette }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
      palette[color],
      className,
    )}
    {...props}
  />
);
