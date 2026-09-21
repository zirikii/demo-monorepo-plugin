import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "positive" | "critical" | "caution" | "info";
}) {
  const tones = {
    neutral: "bg-line-soft text-ink-soft",
    positive: "bg-gopay-tint text-gopay-deep",
    critical: "bg-danger-tint text-danger",
    caution: "bg-warn-tint text-warn",
    info: "bg-pay-tint text-pay-deep",
  } as const;
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}
