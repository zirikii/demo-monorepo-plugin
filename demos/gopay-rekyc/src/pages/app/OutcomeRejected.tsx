import { XCircle } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { PhoneAppBar, PhoneBody, PhoneFooter } from "@/components/phone/PhoneScreen";
import { Button } from "@/components/ui/Button";
import { S } from "@/data/strings";
import { REJECTION_COPY } from "@/domain/rejection";
import { useDemo } from "@/state/useDemo";

export function OutcomeRejected() {
  const { state, t } = useDemo();
  const navigate = useNavigate();
  const decision = state.session?.result?.decision;

  if (!decision || decision.kind !== "rejected") return <Navigate to="/app/vac" replace />;

  return (
    <>
      <PhoneAppBar title={t(S.rejectedTitle)} />
      <PhoneBody className="flex flex-col items-center justify-center gap-4 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-state-danger-tint text-state-danger">
          <XCircle size={30} />
        </span>
        <h2 className="text-lg font-extrabold">{t(S.rejectedTitle)}</h2>
        <p className="text-sm text-ink-soft" data-testid="rejection-copy">
          {t(REJECTION_COPY[decision.reason])}
        </p>
        <p
          className="rounded-xl bg-surface px-3 py-2 font-mono text-[11px] text-ink-soft"
          data-testid="rejection-reason-code"
        >
          {decision.reason}
        </p>
        <p className="text-xs text-ink-faint">
          {state.locale === "id"
            ? "Status akun, data yang dipakai, dan level GoPay Plus kamu tidak berubah."
            : "Your account status, the data in use, and your GoPay Plus level are unchanged."}
        </p>
      </PhoneBody>
      <PhoneFooter>
        <Button
          block
          size="lg"
          onClick={() => navigate("/app/rekyc/review", { state: { entryPoint: "verified_account_center" } })}
        >
          {t(S.tryAgain)}
        </Button>
        <Button block size="lg" variant="ghost" onClick={() => navigate("/app/vac")}>
          {t(S.backToVac)}
        </Button>
      </PhoneFooter>
    </>
  );
}
