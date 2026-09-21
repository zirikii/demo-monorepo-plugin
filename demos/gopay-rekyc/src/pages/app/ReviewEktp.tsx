import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { IdentityList } from "@/components/rekyc/IdentityList";
import { PhoneAppBar, PhoneBody, PhoneFooter } from "@/components/phone/PhoneScreen";
import { Button } from "@/components/ui/Button";
import { REVIEW_COLLAPSED_FIELDS, REVIEW_EXPANDED_FIELDS } from "@/data/fields";
import { S } from "@/data/strings";
import { identityInUse } from "@/domain/ledger";
import type { EntryPoint } from "@/domain/types";
import { useDemo } from "@/state/useDemo";

/**
 * The context screen a user lands on before anything is captured. Leaving it must not start a
 * session, write anything back, or change verification status.
 */
export function ReviewEktp() {
  const { state, dispatch, t } = useDemo();
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const identity = identityInUse(state.ledger);
  const entryPoint =
    (location.state as { entryPoint?: EntryPoint } | null)?.entryPoint ?? "verified_account_center";

  function exitWithoutStarting() {
    dispatch({ type: "abandonSession" });
    navigate("/app/vac");
  }

  /** The on-demand FR step is launched before any KTP capture screen is shown. */
  function startUpdate() {
    dispatch({ type: "startSession", entryPoint });
    navigate("/app/rekyc/fr");
  }

  if (!identity) {
    return (
      <>
        <PhoneAppBar title={t(S.reviewTitle)} onBack={exitWithoutStarting} />
        <PhoneBody>
          <p className="text-sm text-ink-soft">
            {state.locale === "id"
              ? "Tidak ada data e-KTP yang disetujui untuk ditinjau."
              : "There is no approved e-KTP record to review."}
          </p>
        </PhoneBody>
      </>
    );
  }

  return (
    <>
      <PhoneAppBar
        title={t(S.reviewTitle)}
        onBack={exitWithoutStarting}
        onClose={exitWithoutStarting}
      />
      <PhoneBody className="space-y-4">
        <p className="flex gap-2 rounded-2xl bg-gopay-tint px-3.5 py-3 text-xs leading-relaxed text-ink-soft">
          <Info size={15} className="mt-0.5 shrink-0 text-gopay-deep" />
          <span data-testid="review-explainer">{t(S.reviewExplainer)}</span>
        </p>

        <section className="rounded-2xl border border-line bg-card px-4 py-2">
          <IdentityList
            identity={identity}
            fields={
              expanded
                ? [...REVIEW_COLLAPSED_FIELDS, ...REVIEW_EXPANDED_FIELDS]
                : REVIEW_COLLAPSED_FIELDS
            }
            locale={state.locale}
          />
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            data-testid="review-expand"
            className="flex w-full items-center justify-center gap-1 border-t border-line-soft py-2.5 text-xs font-bold text-gopay-deep"
          >
            {expanded ? t(S.seeLessData) : t(S.seeMoreData)}
            <ChevronDown
              size={14}
              className={expanded ? "rotate-180 transition-transform" : "transition-transform"}
            />
          </button>
        </section>

        <p className="text-[11px] text-ink-faint">{t(S.maskedNote)}</p>
      </PhoneBody>
      <PhoneFooter>
        <Button block size="lg" data-testid="review-cta" onClick={startUpdate}>
          {t(S.reviewCta)}
        </Button>
        {state.scenario.notMineEntryEnabled ? (
          <button
            type="button"
            data-testid="review-not-mine"
            onClick={() => navigate("/app/rekyc/help/not-mine")}
            className="w-full py-1 text-center text-xs font-bold text-ink-soft underline underline-offset-4"
          >
            {t(S.notMineCta)}
          </button>
        ) : null}
      </PhoneFooter>
    </>
  );
}
