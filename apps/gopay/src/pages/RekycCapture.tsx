import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ConsumerLayout } from "@/components/layout/ConsumerLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/Button";
import { useRekyc } from "@/hooks/useRekyc";
import { applyDecision, evaluateRekyc, NIK_MISMATCH } from "@/lib/rekyc-engine";
import { updatedIdentity } from "@/data/identity";
import type { RekycDecision } from "@/types/rekyc";

export function RekycCapturePage() {
  const { store, setStore, session, setSession, scenario, setScenario } = useRekyc();
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  function finish(decision: RekycDecision) {
    if (!session?.frPassedAt) {
      navigate("/app/rekyc/fr");
      return;
    }
    if (decision.kind === "edd_required") {
      setSession({
        ...session,
        capturedNik: scenario.capturedNik,
        capturedIdentity: updatedIdentity,
      });
      navigate("/app/rekyc/edd");
      return;
    }
    const next = applyDecision({
      account: store.account,
      submissions: store.submissions,
      callbacks: store.callbacks,
      notifications: store.notifications,
      decision,
      proposedIdentity: updatedIdentity,
      scenario,
    });
    setStore({ ...store, ...next });
    setSession(null);
    switch (decision.kind) {
      case "nik_mismatch":
        navigate("/app/rekyc/reject", { state: { code: NIK_MISMATCH.code } });
        break;
      case "pending_review":
        navigate("/app/rekyc/pending");
        break;
      case "dukcapil_rejected":
        navigate("/app/rekyc/reject", { state: { code: "dukcapil_not_verified" } });
        break;
      case "approved":
        navigate("/app/vac");
        break;
      case "fr_failed":
      case "no_session":
        navigate("/app/rekyc/fr");
        break;
      default: {
        const _exhaustive: never = decision;
        throw new Error(String(_exhaustive));
      }
    }
  }

  function capture(nikOverride?: string) {
    setBusy(true);
    const nextScenario = nikOverride
      ? { ...scenario, capturedNik: nikOverride }
      : scenario;
    if (nikOverride) setScenario(nextScenario);
    window.setTimeout(() => {
      const decision = evaluateRekyc({
        account: store.account,
        session: {
          ...(session ?? { id: "x", startedAt: new Date().toISOString() }),
          frPassedAt: session?.frPassedAt ?? new Date().toISOString(),
        },
        scenario: nextScenario,
        proposedIdentity: updatedIdentity,
      });
      finish(decision);
      setBusy(false);
    }, 700);
  }

  return (
    <ConsumerLayout title="Foto e-KTP" showNav={false}>
      <AppHeader title="Foto e-KTP" onBack={() => navigate("/app/rekyc/onboarding")} />
      <div className="flex flex-1 flex-col px-5 py-6">
        <div className="flex aspect-[1.58] items-center justify-center rounded-2xl border-2 border-dashed border-gopay bg-gopay-tint text-sm font-semibold text-gopay">
          Bingkai e-KTP
        </div>
        <p className="mt-4 text-sm text-ink-soft">
          Selfie FR dipakai ulang. Tidak ada langkah foto wajah kedua.
        </p>
        <Button className="mt-6 w-full" disabled={busy} onClick={() => capture()}>
          {busy ? "Memproses OCR…" : "Gunakan e-KTP yang sama (NIK cocok)"}
        </Button>
        <Button
          variant="secondary"
          className="mt-3 w-full"
          disabled={busy}
          onClick={() => capture("0000000000000000")}
        >
          Simulasi NIK tidak cocok
        </Button>
        <Button
          variant="ghost"
          className="mt-2 w-full"
          disabled={busy}
          onClick={() => {
            setScenario({ ...scenario, ocrConfidence: 0.4 });
            capture();
          }}
        >
          Simulasi OCR rendah (pending)
        </Button>
      </div>
    </ConsumerLayout>
  );
}
