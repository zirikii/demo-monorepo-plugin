import { AlertCircle, Check, Clock, Minus, X } from "lucide-react";
import type { PipelineStep, PipelineStepStatus } from "@/domain/pipeline";
import type { Locale } from "@/domain/types";
import { pick } from "@/data/strings";
import { cn } from "@/lib/cn";

const ICONS: Record<PipelineStepStatus, typeof Check> = {
  passed: Check,
  failed: X,
  skipped: Minus,
  waiting: Clock,
  not_reached: AlertCircle,
};

const STYLES: Record<PipelineStepStatus, string> = {
  passed: "bg-state-success-tint text-state-success",
  failed: "bg-state-danger-tint text-state-danger",
  skipped: "bg-surface-deep text-ink-faint",
  waiting: "bg-state-warning-tint text-state-warning",
  not_reached: "bg-surface-deep text-ink-faint",
};

export function PipelineTrace({
  steps,
  locale,
  visibleCount,
}: {
  steps: PipelineStep[];
  locale: Locale;
  visibleCount?: number;
}) {
  const shown = visibleCount === undefined ? steps : steps.slice(0, visibleCount);
  return (
    <ol className="space-y-3">
      {shown.map((step) => {
        const Icon = ICONS[step.status];
        return (
          <li key={step.id} className="flex gap-3" data-testid={`pipeline-step-${step.id}`}>
            <span
              className={cn("mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full", STYLES[step.status])}
            >
              <Icon size={14} strokeWidth={3} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">{pick(step.label, locale)}</p>
              <p className="text-xs text-ink-soft">{pick(step.detail, locale)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
