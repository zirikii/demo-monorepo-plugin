import { useEffect, useState } from "react";
import { ScanFace, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CameraViewport } from "@/components/rekyc/CameraViewport";
import { PhoneAppBar, PhoneBody, PhoneFooter } from "@/components/phone/PhoneScreen";
import { Button } from "@/components/ui/Button";
import { S } from "@/data/strings";
import { REJECTION_COPY } from "@/domain/rejection";
import { useDemo } from "@/state/useDemo";

type Phase = "intro" | "scanning" | "failed";

/**
 * On-demand FR gate. A live selfie is matched against the on-file face record before any capture
 * screen is reachable; a failure ends the flow with the on-file record untouched.
 */
export function FaceRecognitionGate() {
  const { state, dispatch, t } = useDemo();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("intro");
  const passed = state.session?.frPassed;

  useEffect(() => {
    if (phase !== "scanning") return;
    const timer = window.setTimeout(() => dispatch({ type: "completeFr" }), 1800);
    return () => window.clearTimeout(timer);
  }, [phase, dispatch]);

  useEffect(() => {
    if (phase !== "scanning" || passed === null || passed === undefined) return;
    if (passed) {
      navigate("/app/rekyc/onboarding");
    } else {
      setPhase("failed");
    }
  }, [phase, passed, navigate]);

  if (phase === "failed") {
    return (
      <>
        <PhoneAppBar title={t(S.frFailedTitle)} />
        <PhoneBody className="flex flex-col items-center justify-center gap-4 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-state-danger-tint text-state-danger">
            <ShieldAlert size={30} />
          </span>
          <h2 className="text-lg font-extrabold">{t(S.frFailedTitle)}</h2>
          <p className="text-sm text-ink-soft">{t(S.frFailedBody)}</p>
          <p className="rounded-xl bg-surface px-3 py-2 font-mono text-[11px] text-ink-soft">
            {t(REJECTION_COPY.rekyc_fr_failed)}
          </p>
        </PhoneBody>
        <PhoneFooter>
          <Button block size="lg" variant="secondary" onClick={() => navigate("/app/vac")}>
            {t(S.backToVac)}
          </Button>
        </PhoneFooter>
      </>
    );
  }

  return (
    <>
      <PhoneAppBar title={t(S.frTitle)} onBack={() => navigate("/app/rekyc/review")} />
      <PhoneBody className="space-y-4">
        <CameraViewport shape="face" scanning={phase === "scanning"}>
          <ScanFace size={40} className="mx-auto opacity-80" />
        </CameraViewport>
        <h2 className="text-lg font-extrabold">{t(S.frTitle)}</h2>
        <p className="text-sm leading-relaxed text-ink-soft">{t(S.frBody)}</p>
        {phase === "scanning" ? (
          <p className="text-sm font-bold text-gopay-deep" role="status">
            {t(S.frScanning)}
          </p>
        ) : null}
      </PhoneBody>
      <PhoneFooter>
        <Button
          block
          size="lg"
          data-testid="fr-start"
          disabled={phase === "scanning"}
          onClick={() => setPhase("scanning")}
        >
          {t(S.frCta)}
        </Button>
      </PhoneFooter>
    </>
  );
}
