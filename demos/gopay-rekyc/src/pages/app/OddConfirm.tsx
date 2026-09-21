import { CalendarClock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IdentityList } from "@/components/rekyc/IdentityList";
import { PhoneAppBar, PhoneBody, PhoneFooter } from "@/components/phone/PhoneScreen";
import { Button } from "@/components/ui/Button";
import { VAC_DEFAULT_FIELDS, VAC_MORE_FIELDS } from "@/data/fields";
import { S } from "@/data/strings";
import { identityInUse } from "@/domain/ledger";
import { useDemo } from "@/state/useDemo";

/**
 * Phase 2 appendix: the reminder banner's CTA lands here. The user either confirms the data is
 * unchanged or declares a change, which hands over to the same re-KYC flow.
 */
export function OddConfirm() {
  const { state, dispatch, t } = useDemo();
  const navigate = useNavigate();
  const identity = identityInUse(state.ledger);

  function confirmUnchanged() {
    dispatch({ type: "confirmOddUnchanged" });
    navigate("/app/vac");
  }

  return (
    <>
      <PhoneAppBar title={t(S.oddConfirmTitle)} onBack={() => navigate("/app")} />
      <PhoneBody className="space-y-4">
        <div className="flex items-start gap-3 rounded-2xl bg-state-warning-tint px-4 py-3">
          <CalendarClock size={18} className="mt-0.5 shrink-0 text-state-warning" />
          <p className="text-xs text-ink-soft">{t(S.oddBannerBody)}</p>
        </div>
        <h2 className="text-lg font-extrabold leading-snug">{t(S.oddConfirmTitle)}</h2>
        {identity ? (
          <section className="rounded-2xl border border-line bg-card px-4 py-2">
            <IdentityList
              identity={identity}
              fields={[...VAC_DEFAULT_FIELDS, ...VAC_MORE_FIELDS]}
              locale={state.locale}
              dense
            />
          </section>
        ) : null}
      </PhoneBody>
      <PhoneFooter>
        <Button
          block
          size="lg"
          data-testid="odd-changed"
          onClick={() =>
            navigate("/app/rekyc/review", { state: { entryPoint: "odd_reminder" } })
          }
        >
          {t(S.oddConfirmChanged)}
        </Button>
        <Button
          block
          size="lg"
          variant="secondary"
          data-testid="odd-same"
          onClick={confirmUnchanged}
        >
          {t(S.oddConfirmSame)}
        </Button>
      </PhoneFooter>
    </>
  );
}
