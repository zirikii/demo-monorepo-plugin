import { Check, IdCard } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { PhoneAppBar, PhoneBody, PhoneFooter } from "@/components/phone/PhoneScreen";
import { Button } from "@/components/ui/Button";
import { ONBOARDING_COPY } from "@/domain/copy";
import { useDemo } from "@/state/useDemo";

/**
 * The existing OneKYC capture onboarding screen. Nothing new is built for re-KYC — only the copy
 * config keyed by entry context changes.
 */
export function CaptureOnboarding() {
  const { state, t } = useDemo();
  const navigate = useNavigate();
  const copy = ONBOARDING_COPY[state.session ? "rekyc" : "initial_kyc"];

  if (state.session && state.session.frPassed !== true) {
    return <Navigate to="/app/rekyc/fr" replace />;
  }

  return (
    <>
      <PhoneAppBar onBack={() => navigate("/app/rekyc/review")} />
      <PhoneBody className="space-y-5">
        <span className="inline-block rounded-full bg-gopay-tint px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-gopay-deep">
          {t(copy.eyebrow)}
        </span>
        <div className="grid h-40 place-items-center rounded-3xl bg-surface text-gopay-deep">
          <IdCard size={64} strokeWidth={1.2} />
        </div>
        <h2 className="text-xl font-extrabold leading-snug" data-testid="onboarding-title">
          {t(copy.title)}
        </h2>
        <ul className="space-y-3">
          {copy.bodyItems.map((item, index) => (
            <li key={index} className="flex gap-2.5 text-sm text-ink-soft">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gojek-tint text-gojek-deep">
                <Check size={13} strokeWidth={3} />
              </span>
              {t(item)}
            </li>
          ))}
        </ul>
      </PhoneBody>
      <PhoneFooter>
        <Button
          block
          size="lg"
          data-testid="onboarding-cta"
          onClick={() => navigate("/app/rekyc/capture/ktp")}
        >
          {t(copy.primaryCta)}
        </Button>
      </PhoneFooter>
    </>
  );
}
