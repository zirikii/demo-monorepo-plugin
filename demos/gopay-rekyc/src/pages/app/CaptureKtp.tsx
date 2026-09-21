import { useEffect, useState } from "react";
import { IdCard } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { CameraViewport } from "@/components/rekyc/CameraViewport";
import { PhoneAppBar, PhoneBody, PhoneFooter } from "@/components/phone/PhoneScreen";
import { Button } from "@/components/ui/Button";
import { S } from "@/data/strings";
import { useDemo } from "@/state/useDemo";

export function CaptureKtp() {
  const { state, dispatch, t } = useDemo();
  const navigate = useNavigate();
  const [capturing, setCapturing] = useState(false);
  const session = state.session;

  useEffect(() => {
    if (!capturing) return;
    const timer = window.setTimeout(() => dispatch({ type: "captureKtp" }), 1200);
    return () => window.clearTimeout(timer);
  }, [capturing, dispatch]);

  useEffect(() => {
    if (!capturing || !session?.ktpImageId) return;
    navigate(session.selfieSource === "fr_reuse" ? "/app/rekyc/processing" : "/app/rekyc/capture/selfie");
  }, [capturing, session, navigate]);

  if (!session || session.frPassed !== true) {
    return <Navigate to="/app/rekyc/fr" replace />;
  }

  return (
    <>
      <PhoneAppBar title={t(S.captureKtpTitle)} onBack={() => navigate("/app/rekyc/onboarding")} />
      <PhoneBody className="space-y-4">
        <CameraViewport shape="card" scanning={capturing}>
          <IdCard size={38} className="mx-auto opacity-80" />
        </CameraViewport>
        <p className="text-sm text-ink-soft">{t(S.captureKtpHint)}</p>
        {state.scenario.reuseFrSelfie ? (
          <p className="rounded-xl bg-gojek-tint px-3 py-2 text-xs font-semibold text-gojek-deep">
            {t(S.captureSelfieSkipped)}
          </p>
        ) : null}
      </PhoneBody>
      <PhoneFooter>
        <Button
          block
          size="lg"
          data-testid="capture-ktp"
          disabled={capturing}
          onClick={() => setCapturing(true)}
        >
          {t(S.captureKtpCta)}
        </Button>
      </PhoneFooter>
    </>
  );
}
