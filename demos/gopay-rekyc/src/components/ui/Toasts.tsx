import { useEffect } from "react";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { useDemo } from "@/state/useDemo";
import type { ToastMessage } from "@/state/types";

const TONE_STYLES: Record<ToastMessage["tone"], string> = {
  success: "bg-ink text-white",
  info: "bg-ink text-white",
  danger: "bg-state-danger text-white",
};

const TONE_ICON = {
  success: CheckCircle2,
  info: Info,
  danger: XCircle,
};

/** Toasts render inside the phone frame, which is where the PRD's success toast belongs. */
export function Toasts({ className }: { className?: string }) {
  const { state, dispatch } = useDemo();

  useEffect(() => {
    if (state.toasts.length === 0) return;
    const timers = state.toasts.map((toast) =>
      window.setTimeout(() => dispatch({ type: "dismissToast", id: toast.id }), 6000),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [state.toasts, dispatch]);

  if (state.toasts.length === 0) return null;

  return (
    <div className={cn("pointer-events-none absolute inset-x-3 bottom-24 z-30 space-y-2", className)}>
      {state.toasts.map((toast) => {
        const Icon = TONE_ICON[toast.tone];
        return (
          <div
            key={toast.id}
            role="status"
            className={cn(
              "animate-fade-up flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-float",
              TONE_STYLES[toast.tone],
            )}
          >
            <Icon size={18} className="shrink-0" />
            <span>{toast.text}</span>
          </div>
        );
      })}
    </div>
  );
}
