import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { ConsumerLayout } from "@/components/layout/ConsumerLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/Button";
import { useRekyc } from "@/hooks/useRekyc";

export function RekycFrPage() {
  const { session, setSession, scenario } = useRekyc();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const navigate = useNavigate();

  function capture() {
    setBusy(true);
    window.setTimeout(() => {
      if (!scenario.frPass) {
        setFailed(true);
        setBusy(false);
        return;
      }
      setSession({
        ...(session ?? { id: `rekyc_${Date.now()}`, startedAt: new Date().toISOString() }),
        frPassedAt: new Date().toISOString(),
        frSelfieDataUrl: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>",
      });
      navigate("/app/rekyc/onboarding");
    }, 900);
  }

  return (
    <ConsumerLayout title="Verifikasi wajah" showNav={false}>
      <AppHeader title="Pastikan ini kamu" onBack={() => navigate("/app/rekyc")} />
      <div className="flex flex-1 flex-col items-center px-6 py-8">
        <div className="flex h-56 w-44 items-center justify-center rounded-[120px] border-4 border-gopay bg-gopay-tint">
          {busy ? <Loader2 className="h-8 w-8 animate-spin text-gopay" aria-hidden="true" /> : null}
        </div>
        <p className="mt-6 text-center text-sm text-ink-soft">
          Selfie live dicocokkan dengan wajah di berkas. Kalau gagal, foto e-KTP tidak dibuka dan data
          lama tidak berubah.
        </p>
        {failed ? (
          <p className="mt-4 text-center text-sm font-semibold text-danger">
            Wajah tidak cocok. Coba lagi atau batalkan — data e-KTP tidak diubah.
          </p>
        ) : null}
        <Button className="mt-8 w-full" onClick={capture} disabled={busy}>
          {busy ? "Mencocokkan…" : "Ambil selfie"}
        </Button>
      </div>
    </ConsumerLayout>
  );
}
