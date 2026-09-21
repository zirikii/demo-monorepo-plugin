import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

export function AppHeader({
  title,
  onBack,
  right,
}: {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
}) {
  return (
    <header className="flex items-center gap-2 border-b border-line-soft px-3 py-3">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="rounded-full p-1.5 text-ink hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gopay"
          aria-label="Kembali"
        >
          <ChevronLeft className="h-6 w-6" aria-hidden="true" />
        </button>
      ) : (
        <span className="w-9" />
      )}
      <h1 className="flex-1 text-center text-[16px] font-bold tracking-tight text-ink">{title}</h1>
      <div className="flex min-w-9 justify-end">{right}</div>
    </header>
  );
}
