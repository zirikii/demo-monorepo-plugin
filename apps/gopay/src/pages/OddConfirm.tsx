import { useNavigate } from "react-router-dom";
import { ConsumerLayout } from "@/components/layout/ConsumerLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/Button";
import { IdentityCard } from "@/components/vac/IdentityCard";
import { useRekyc } from "@/hooks/useRekyc";
import { useState } from "react";

export function OddConfirmPage() {
  const { store } = useRekyc();
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();
  return (
    <ConsumerLayout title="ODD" showNav={false}>
      <AppHeader title="Data e-KTP masih sama?" onBack={() => navigate("/app")} />
      <div className="space-y-4 px-4 py-4">
        <p className="text-sm text-ink-soft">
          Bank Indonesia mewajibkan tinjauan berkala. Konfirmasi apakah data masih cocok dengan e-KTP
          fisik.
        </p>
        <IdentityCard
          identity={store.account.identityOnFile}
          expanded={expanded}
          onToggle={() => setExpanded((v) => !v)}
        />
        <Button className="w-full" onClick={() => navigate("/app/rekyc/fr")}>
          Data masih sama — lanjut FR
        </Button>
        <Button variant="secondary" className="w-full" onClick={() => navigate("/app/rekyc")}>
          Data sudah berubah — mulai ReKYC
        </Button>
      </div>
    </ConsumerLayout>
  );
}
