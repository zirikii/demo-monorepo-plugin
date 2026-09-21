import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function PhoneShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="flex justify-center px-3 py-6 lg:py-10">
      <div
        className={cn(
          "relative flex h-[844px] w-full max-w-[390px] flex-col overflow-hidden rounded-[36px] border border-black/10 bg-white shadow-phone",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
