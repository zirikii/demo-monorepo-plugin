import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PhoneFrame } from "@/components/phone/PhoneFrame";
import { reportedTier } from "@/domain/ledger";
import { evaluateBlock } from "@/domain/odd";
import { useDemo } from "@/state/useDemo";
import { SessionInspector } from "./SessionInspector";

/** Routes the user may still reach while block enforcement is active. */
const ALLOWED_WHILE_BLOCKED = ["/app/blocked", "/app/rekyc", "/app/odd"];

export function PhoneLayout() {
  const { state } = useDemo();
  const location = useLocation();
  const decision = evaluateBlock(
    state.now,
    state.ledger.account.oddDueAt,
    reportedTier(state.ledger),
    state.scenario.block,
  );

  const escapeHatch = ALLOWED_WHILE_BLOCKED.some((prefix) => location.pathname.startsWith(prefix));

  return (
    <div className="flex flex-wrap items-start justify-center gap-8 px-6 py-8">
      <PhoneFrame>
        {decision.blocked && !escapeHatch ? <Navigate to="/app/blocked" replace /> : <Outlet />}
      </PhoneFrame>
      <SessionInspector />
    </div>
  );
}
