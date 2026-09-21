import { useNavigate } from "react-router-dom";
import { Lightbulb, Glasses, HardHat, Loader2 } from "lucide-react";
import { useState } from "react";
import { ConsumerLayout } from "@/components/layout/ConsumerLayout";
import { Button } from "@/components/ui/Button";
import { useRekyc } from "@/hooks/useRekyc";

const readinessTiles = [
  { icon: Lightbulb, label: "Enough lighting" },
  { icon: Glasses, label: "No glasses" },
  { icon: HardHat, label: "Don't wear hat" },
];

export function RekycFrPage() {
  const { session, setSession, scenario } = useRekyc();
  const [stage, setStage] = useState<"ready" | "capturing">("ready");
  const [failed, setFailed] = useState(false);
  const navigate = useNavigate();

  function capture() {
    setStage("capturing");
    window.setTimeout(() => {
      if (!scenario.frPass) {
        setFailed(true);
        setStage("ready");
        return;
      }
      setSession({
        ...(session ?? { id: `rekyc_${Date.now()}`, startedAt: new Date().toISOString() }),
        frPassedAt: new Date().toISOString(),
        frSelfieDataUrl: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>",
      });
      navigate("/app/rekyc/onboarding");
    }, 1100);
  }

  return (
    <ConsumerLayout title="Verifikasi wajah" showNav={false}>
      <div className="relative flex h-full flex-col bg-[#3a3a3a]">
        <div className="flex items-center justify-between px-4 pb-2 pt-3 text-white">
          <button
            type="button"
            onClick={() => navigate("/app/rekyc")}
            className="text-sm font-semibold"
            aria-label="Kembali"
          >
            ←
          </button>
          <span className="text-sm font-bold">View Guides</span>
        </div>
        <p className="px-4 pt-4 text-center text-sm font-bold text-white">
          Fit your face in the photo area
        </p>
        <div className="relative mt-6 flex justify-center">
          <div className="flex h-64 w-52 items-center justify-center overflow-hidden rounded-[130px] border-4 border-gopay bg-gopay-tint">
            {stage === "capturing" ? (
              <Loader2 className="h-8 w-8 animate-spin text-gopay" aria-hidden="true" />
            ) : (
              <span className="px-6 text-center text-xs text-gopay-deep">Kamera selfie</span>
            )}
          </div>
        </div>

        <div className="mt-auto rounded-t-3xl bg-white px-4 pb-5 pt-5">
          <h2 className="text-lg font-extrabold text-ink">Get ready for face verification</h2>
          <div className="mt-4 grid grid-cols-3 gap-3 rounded-2xl border border-line bg-surface p-3">
            {readinessTiles.map((tile) => (
              <div key={tile.label} className="flex flex-col items-center gap-2 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pay-tint">
                  <tile.icon className="h-6 w-6 text-pay-deep" aria-hidden="true" />
                </span>
                <span className="text-[11px] font-medium text-ink-soft">{tile.label}</span>
              </div>
            ))}
          </div>
          {failed ? (
            <p className="mt-3 text-center text-sm font-semibold text-danger">
              Wajah tidak cocok. Data e-KTP tidak diubah — coba lagi atau batalkan.
            </p>
          ) : (
            <p className="mt-3 text-center text-xs text-ink-faint">
              Selfie live dicocokkan dengan wajah di berkas. Kalau gagal, foto e-KTP tidak dibuka.
            </p>
          )}
          <Button className="mt-4 w-full" onClick={capture} disabled={stage === "capturing"}>
            {stage === "capturing" ? "Mencocokkan…" : "Got it, I'm ready"}
          </Button>
        </div>
      </div>
    </ConsumerLayout>
  );
}
