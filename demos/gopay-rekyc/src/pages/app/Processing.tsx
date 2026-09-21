import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { PhoneAppBar, PhoneBody } from "@/components/phone/PhoneScreen";
import { PipelineTrace } from "@/components/rekyc/PipelineTrace";
import { S } from "@/data/strings";
import { useDemo } from "@/state/useDemo";

const STEP_INTERVAL_MS = 420;

/** Runs the verification sequence and routes to the outcome the pipeline decided. */
export function Processing() {
  const { state, dispatch, t } = useDemo();
  const navigate = useNavigate();
  const started = useRef(false);
  const [visibleCount, setVisibleCount] = useState(1);
  const session = state.session;
  const result = session?.result ?? null;

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    dispatch({ type: "runVerification" });
  }, [dispatch]);

  useEffect(() => {
    if (!result) return;
    const reached = result.steps.filter((step) => step.status !== "not_reached").length;
    if (visibleCount >= reached) return;
    const timer = window.setTimeout(() => setVisibleCount((count) => count + 1), STEP_INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [result, visibleCount]);

  useEffect(() => {
    if (!result) return;
    const reached = result.steps.filter((step) => step.status !== "not_reached").length;
    if (visibleCount < reached) return;
    const timer = window.setTimeout(() => {
      switch (result.decision.kind) {
        case "approved":
          navigate("/app/vac");
          break;
        case "rejected":
          navigate("/app/rekyc/result/rejected");
          break;
        case "manual_review":
          navigate("/app/rekyc/result/pending");
          break;
        case "edd_required":
          navigate("/app/rekyc/edd");
          break;
        default: {
          const exhaustive: never = result.decision;
          throw new Error(`unhandled decision ${JSON.stringify(exhaustive)}`);
        }
      }
    }, 700);
    return () => window.clearTimeout(timer);
  }, [result, visibleCount, navigate]);

  if (!session) return <Navigate to="/app/vac" replace />;

  return (
    <>
      <PhoneAppBar title={t(S.processingTitle)} />
      <PhoneBody className="space-y-5 pt-4">
        <div className="flex items-center gap-3 rounded-2xl bg-gopay-tint px-4 py-3">
          <Loader2 size={18} className="animate-spin text-gopay-deep" />
          <p className="text-xs text-ink-soft">{t(S.processingBody)}</p>
        </div>
        {result ? (
          <PipelineTrace steps={result.steps} locale={state.locale} visibleCount={visibleCount} />
        ) : null}
      </PhoneBody>
    </>
  );
}
