import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

export function DemoRibbon({
  label = "Demo",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: "var(--demo-accent, #00aa13)" }}
      />
      {label}
    </span>
  );
}
