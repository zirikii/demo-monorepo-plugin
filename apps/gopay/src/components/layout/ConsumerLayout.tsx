import { DemoRibbon } from "@/components/ui/DemoRibbon";
import { PhoneShell } from "@/components/layout/PhoneShell";
import { BottomNav } from "@/components/layout/BottomNav";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import type { ReactNode } from "react";

export function ConsumerLayout({
  title,
  children,
  showNav = true,
}: {
  title: string;
  children: ReactNode;
  showNav?: boolean;
}) {
  useDocumentTitle(`${title} — GoPay (Demo)`);
  return (
    <RequireAuth>
      <div className="min-h-screen bg-[#dfe4da]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 pt-4">
          <img src="/brand/logo-green.svg" alt="GoPay" className="h-7" />
          <DemoRibbon label="Unofficial demo" className="border-line text-ink-faint" />
        </div>
        <PhoneShell>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
            {showNav ? <BottomNav /> : null}
          </div>
        </PhoneShell>
      </div>
    </RequireAuth>
  );
}
