import { useState } from "react";
import { ChevronDown, ChevronRight, FileCheck2, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IdentityList } from "@/components/rekyc/IdentityList";
import { PhoneAppBar, PhoneBody } from "@/components/phone/PhoneScreen";
import { PhoneBottomNav } from "@/components/phone/PhoneBottomNav";
import { Badge } from "@/components/ui/Badge";
import { VAC_DEFAULT_FIELDS, VAC_MORE_FIELDS } from "@/data/fields";
import { S } from "@/data/strings";
import { identityInUse, canStartReKyc } from "@/domain/ledger";
import { useDemo } from "@/state/useDemo";

export function VerifiedAccountCenter() {
  const { state, t } = useDemo();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const identity = identityInUse(state.ledger);
  const eligible = canStartReKyc(state.ledger);

  /** The review screen is a context screen — the session only starts once its CTA is tapped. */
  function openReview() {
    navigate("/app/rekyc/review", { state: { entryPoint: "verified_account_center" } });
  }

  return (
    <>
      <PhoneAppBar title={t(S.vacTitle)} onBack={() => navigate("/app")} />
      <PhoneBody className="space-y-4">
        <p className="text-xs text-ink-soft">{t(S.vacSubtitle)}</p>

        <section className="rounded-2xl border border-line bg-card">
          <header className="flex items-center gap-3 border-b border-line-soft px-4 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gojek-tint text-gojek-deep">
              <ShieldCheck size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold">{t(S.identityCardTitle)}</h2>
              <p className="text-xs text-ink-soft">
                {state.ledger.account.kycStatus === "approved" ? t(S.gopayPlus) : t(S.gopayBasic)}
              </p>
            </div>
            <Badge tone={state.ledger.account.kycStatus === "approved" ? "success" : "danger"}>
              {state.ledger.account.kycStatus === "approved"
                ? t(S.identityCardBadge)
                : state.locale === "id"
                  ? "Turun level"
                  : "Downgraded"}
            </Badge>
          </header>

          {identity ? (
            <div className="px-4 py-2">
              <IdentityList
                identity={identity}
                fields={expanded ? [...VAC_DEFAULT_FIELDS, ...VAC_MORE_FIELDS] : VAC_DEFAULT_FIELDS}
                locale={state.locale}
                dense
              />
              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                aria-expanded={expanded}
                data-testid="vac-expand"
                className="flex w-full items-center justify-center gap-1 border-t border-line-soft py-2.5 text-xs font-bold text-gopay-deep"
              >
                {expanded ? t(S.seeLessData) : t(S.seeMoreData)}
                <ChevronDown
                  size={14}
                  className={expanded ? "rotate-180 transition-transform" : "transition-transform"}
                />
              </button>
            </div>
          ) : (
            <p className="px-4 py-6 text-center text-xs text-ink-soft">
              {state.locale === "id"
                ? "Belum ada data identitas yang disetujui."
                : "No approved identity data on file."}
            </p>
          )}

          <button
            type="button"
            onClick={openReview}
            disabled={!eligible}
            data-testid="vac-update-row"
            className="flex w-full items-center gap-3 border-t border-line px-4 py-3.5 text-left disabled:opacity-50"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gopay-tint text-gopay-deep">
              <FileCheck2 size={17} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold">{t(S.updateRow)}</span>
              <span className="block text-xs text-ink-soft">{t(S.updateRowHint)}</span>
            </span>
            <ChevronRight size={18} className="shrink-0 text-ink-faint" />
          </button>
        </section>

        {!eligible ? (
          <p className="rounded-xl bg-state-warning-tint px-4 py-3 text-xs text-ink-soft">
            {state.locale === "id"
              ? "Perbaruan data mandiri hanya tersedia untuk akun dengan status KYC disetujui. Akun yang turun level harus melalui KYC dari awal."
              : "Self-serve updates are only available while the account's KYC status is approved. A downgraded account goes through KYC from the start."}
          </p>
        ) : null}
      </PhoneBody>
      <PhoneBottomNav />
    </>
  );
}
