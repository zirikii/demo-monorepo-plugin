import type { ReactNode } from "react";
import { ChevronLeft, X } from "lucide-react";
import { cn } from "@/lib/cn";

export function PhoneAppBar({
  title,
  onBack,
  onClose,
  tone = "light",
}: {
  title?: string;
  onBack?: () => void;
  onClose?: () => void;
  tone?: "light" | "dark";
}) {
  return (
    <header
      className={cn(
        "flex h-12 shrink-0 items-center gap-2 px-3",
        tone === "dark" ? "text-white" : "text-ink",
      )}
    >
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5"
        >
          <ChevronLeft size={22} />
        </button>
      ) : (
        <span className="w-9" />
      )}
      <h1 className="flex-1 truncate text-base font-bold">{title}</h1>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5"
        >
          <X size={20} />
        </button>
      ) : null}
    </header>
  );
}

export function PhoneBody({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("phone-scroll flex-1 overflow-y-auto px-4 pb-4", className)}>{children}</div>
  );
}

export function PhoneFooter({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "shrink-0 space-y-2 border-t border-line bg-white px-4 pb-7 pt-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
