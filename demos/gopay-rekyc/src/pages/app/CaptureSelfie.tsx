import { useEffect, useState } from "react";
import { ScanFace } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { CameraViewport } from "@/components/rekyc/CameraViewport";
import { PhoneAppBar, PhoneBody, PhoneFooter } from "@/components/phone/PhoneScreen";
import { Button } from "@/components/ui/Button";
import { S } from "@/data/strings";
import { useDemo } from "@/state/useDemo";

/** Only reached when the FR selfie is not reused (scenario console toggle). */
export function CaptureSelfie() {
  const { state, dispatch, t } = useDemo();
  const navigate = useNavigate();
  const [capturing, setCapturing] = useState(false);
  const session = state.session;

  useEffect(() => {
    if (!capturing) return;
    const timer = window.setTimeout(() => dispatch({ type: "captureSelfie" }), 1200);
    return () => window.clearTimeout(timer);
  }, [capturing, dispatch]);

  useEffect(() => {
    if (capturing && session?.selfieImageId) navigate("/app/rekyc/processing");
  }, [capturing, session, navigate]);

  if (!session || session.frPassed !== true) {
    return <Navigate to="/app/rekyc/fr" replace />;
  }

  return (
    <>
      <PhoneAppBar title={t(S.captureSelfieTitle)} />
      <PhoneBody className="space-y-4">
        <CameraViewport shape="face" scanning={capturing}>
          <ScanFace size={38} className="mx-auto opacity-80" />
        </CameraViewport>
        <p className="text-sm text-ink-soft">
          {state.locale === "id"
            ? "Posisikan wajah di dalam lingkaran, lalu ambil foto."
            : "Line your face up inside the circle, then take the photo."}
        </p>
      </PhoneBody>
      <PhoneFooter>
        <Button
          block
          size="lg"
          data-testid="capture-selfie"
          disabled={capturing}
          onClick={() => setCapturing(true)}
        >
          {t(S.captureKtpCta)}
        </Button>
      </PhoneFooter>
    </>
  );
}
