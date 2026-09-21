import type { ReactNode } from "react";
import { BatteryFull, Signal, Wifi } from "lucide-react";
import { cn } from "@/lib/cn";
import { Toasts } from "@/components/ui/Toasts";

export function PhoneFrame({
  children,
  statusTone = "light",
}: {
  children: ReactNode;
  statusTone?: "light" | "dark";
}) {
  return (
    <div className="relative mx-auto w-[390px] shrink-0">
      <div className="relative h-[812px] overflow-hidden rounded-[44px] border-[10px] border-[#101314] bg-white shadow-phone">
        <div className="pointer-events-none absolute left-1/2 top-0 z-30 h-7 w-40 -translate-x-1/2 rounded-b-2xl bg-[#101314]" />
        <div
          className={cn(
            "absolute inset-x-0 top-0 z-20 flex h-11 items-end justify-between px-6 pb-1 text-[11px] font-bold",
            statusTone === "dark" ? "text-white" : "text-ink",
          )}
        >
          <span>09.41</span>
          <span className="flex items-center gap-1">
            <Signal size={13} />
            <Wifi size={13} />
            <BatteryFull size={15} />
          </span>
        </div>
        <div className="relative flex h-full flex-col pt-11">{children}</div>
        <Toasts />
        <div className="pointer-events-none absolute bottom-2 left-1/2 z-30 h-1.5 w-32 -translate-x-1/2 rounded-full bg-ink/25" />
      </div>
    </div>
  );
}
