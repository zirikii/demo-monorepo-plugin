import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "success" | "warning" | "danger" | "info" | "neutral";

const TONES: Record<BadgeTone, string> = {
  success: "bg-state-success-tint text-state-success",
  warning: "bg-state-warning-tint text-state-warning",
  danger: "bg-state-danger-tint text-state-danger",
  info: "bg-state-info-tint text-gopay-deep",
  neutral: "bg-surface-deep text-ink-soft",
};

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
