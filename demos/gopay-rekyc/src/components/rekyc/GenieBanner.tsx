import { Sparkles, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SUCCESS_NOTIFICATIONS } from "@/domain/notifications";
import { S } from "@/data/strings";
import { useDemo } from "@/state/useDemo";

/** Genie: dismissible reassurance banner that deep-links to the Verified Account Center. */
export function GenieBanner() {
  const { state, dispatch, t } = useDemo();
  const navigate = useNavigate();
  const genie = SUCCESS_NOTIFICATIONS.find((item) => item.channel === "genie");

  if (!state.genieVisible || !genie) return null;

  return (
    <div
      data-testid="genie-banner"
      className="flex items-center gap-3 rounded-2xl border border-gojek/30 bg-gojek-tint px-4 py-3"
    >
      <Sparkles size={18} className="shrink-0 text-gojek-deep" />
      <button
        type="button"
        className="min-w-0 flex-1 text-left text-sm font-semibold text-ink"
        onClick={() => navigate("/app/vac")}
      >
        {t(genie.body)}
      </button>
      <button
        type="button"
        aria-label={t(S.genieDismiss)}
        onClick={() => dispatch({ type: "dismissGenie" })}
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-soft hover:bg-white/60"
      >
        <X size={15} />
      </button>
    </div>
  );
}
