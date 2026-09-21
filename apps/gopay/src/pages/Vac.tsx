import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { ConsumerLayout } from "@/components/layout/ConsumerLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { IdentityCard } from "@/components/vac/IdentityCard";
import { useRekyc } from "@/hooks/useRekyc";

export function VacPage() {
  const { store, setStore } = useRekyc();
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const toast = store.toast;

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setStore({ ...store, toast: undefined }), 4200);
    return () => window.clearTimeout(t);
  }, [toast, store, setStore]);

  return (
    <ConsumerLayout title="Pusat Akun Terverifikasi">
      <AppHeader title="Pusat Akun Terverifikasi" onBack={() => navigate("/app")} />
      {toast ? (
        <div
          role="status"
          className="mx-4 mt-3 rounded-2xl bg-gopay px-4 py-3 text-sm font-semibold text-white"
        >
          {toast}
        </div>
      ) : null}
      <div className="space-y-4 px-4 py-4">
        <IdentityCard
          identity={store.account.identityOnFile}
          expanded={expanded}
          onToggle={() => setExpanded((v) => !v)}
        />
        <button
          type="button"
          onClick={() => navigate("/app/rekyc")}
          className="flex w-full items-center justify-between rounded-2xl border border-line bg-card px-4 py-4 text-left"
        >
          <span>
            <span className="block text-sm font-bold">Perbarui data e-KTP</span>
            <span className="text-xs text-ink-soft">Self-serve ReKYC · tanpa turun Plus</span>
          </span>
          <ChevronRight className="h-5 w-5 text-ink-faint" aria-hidden="true" />
        </button>
      </div>
    </ConsumerLayout>
  );
}
