import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PhoneBody, PhoneFooter } from "@/components/phone/PhoneScreen";
import { Button } from "@/components/ui/Button";
import { S } from "@/data/strings";
import { reportedTier } from "@/domain/ledger";
import { evaluateBlock } from "@/domain/odd";
import { useDemo } from "@/state/useDemo";

/**
 * Phase 2 appendix: an overdue account inside the enforcement scope is blocked from the app. The
 * wallet still works everywhere else, so only this surface is gated.
 */
export function Blocked() {
  const { state, t } = useDemo();
  const navigate = useNavigate();
  const decision = evaluateBlock(
    state.now,
    state.ledger.account.oddDueAt,
    reportedTier(state.ledger),
    state.scenario.block,
  );

  return (
    <>
      <PhoneBody className="flex flex-col items-center justify-center gap-4 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-state-danger-tint text-state-danger">
          <Lock size={28} />
        </span>
        <h2 className="text-lg font-extrabold">{t(S.blockedTitle)}</h2>
        <p className="text-sm text-ink-soft">{t(S.blockedBody)}</p>
        <p className="rounded-xl bg-surface px-3 py-2 font-mono text-[11px] text-ink-soft">
          {decision.blocked
            ? `blocked · ${decision.daysPastDue}d past due · scope ${state.scenario.block.scopeTiers.join("/")}`
            : `not blocked · ${decision.reason}`}
        </p>
      </PhoneBody>
      <PhoneFooter>
        <Button
          block
          size="lg"
          data-testid="blocked-cta"
          onClick={() => navigate("/app/odd/confirm")}
        >
          {t(S.blockedCta)}
        </Button>
      </PhoneFooter>
    </>
  );
}
