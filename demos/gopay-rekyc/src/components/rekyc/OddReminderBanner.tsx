import { CalendarClock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { S } from "@/data/strings";
import { daysUntilDue } from "@/domain/odd";
import { useDemo } from "@/state/useDemo";

/** Shows from a set number of days before the ODD due date until the review is completed. */
export function OddReminderBanner() {
  const { state, t } = useDemo();
  const navigate = useNavigate();
  const days = daysUntilDue(state.now, state.ledger.account.oddDueAt);
  const overdue = days < 0;

  return (
    <button
      type="button"
      onClick={() => navigate("/app/odd/confirm")}
      data-testid="odd-reminder-banner"
      className="flex w-full items-start gap-3 rounded-2xl border border-state-warning/30 bg-state-warning-tint px-4 py-3 text-left"
    >
      <CalendarClock size={18} className="mt-0.5 shrink-0 text-state-warning" />
      <span className="min-w-0">
        <span className="block text-sm font-bold text-ink">{t(S.oddBannerTitle)}</span>
        <span className="mt-0.5 block text-xs text-ink-soft">{t(S.oddBannerBody)}</span>
        <span className="mt-1 block text-xs font-bold text-state-warning">
          {overdue
            ? state.locale === "id"
              ? `Lewat ${Math.abs(days)} hari dari tenggat`
              : `${Math.abs(days)} days past due`
            : state.locale === "id"
              ? `Tenggat dalam ${days} hari`
              : `Due in ${days} days`}
          {" · "}
          {t(S.oddBannerCta)}
        </span>
      </span>
    </button>
  );
}
