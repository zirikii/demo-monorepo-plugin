import { Clock } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { PhoneAppBar, PhoneBody, PhoneFooter } from "@/components/phone/PhoneScreen";
import { Button } from "@/components/ui/Button";
import { S } from "@/data/strings";
import { useDemo } from "@/state/useDemo";

/** Low OCR confidence or a screening hit produce an explicit pending state, not a rejection. */
export function OutcomePending() {
  const { state, t } = useDemo();
  const navigate = useNavigate();
  const session = state.session;

  if (!session?.result) return <Navigate to="/app/vac" replace />;

  const trigger =
    session.result.decision.kind === "manual_review" ? session.result.decision.trigger : null;

  return (
    <>
      <PhoneAppBar title={t(S.pendingTitle)} />
      <PhoneBody className="flex flex-col items-center justify-center gap-4 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-state-warning-tint text-state-warning">
          <Clock size={30} />
        </span>
        <h2 className="text-lg font-extrabold">{t(S.pendingTitle)}</h2>
        <p className="text-sm text-ink-soft">{t(S.pendingBody)}</p>
        <p className="rounded-xl bg-surface px-3 py-2 font-mono text-[11px] text-ink-soft">
          status: pending_review{trigger ? ` · ${trigger}` : ""}
        </p>
      </PhoneBody>
      <PhoneFooter>
        <Button block size="lg" onClick={() => navigate("/app/vac")}>
          {t(S.backToVac)}
        </Button>
      </PhoneFooter>
    </>
  );
}
