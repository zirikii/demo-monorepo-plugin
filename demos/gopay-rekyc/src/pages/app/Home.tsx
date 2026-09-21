import { ArrowDownToLine, ArrowUpRight, Bell, QrCode, ShieldCheck, Wallet } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { GoPayLogo } from "@/components/brand/GoPayLogo";
import { GenieBanner } from "@/components/rekyc/GenieBanner";
import { OddReminderBanner } from "@/components/rekyc/OddReminderBanner";
import { PhoneBody } from "@/components/phone/PhoneScreen";
import { PhoneBottomNav } from "@/components/phone/PhoneBottomNav";
import { S } from "@/data/strings";
import { shouldShowReminder } from "@/domain/odd";
import { formatRupiah } from "@/lib/format";
import { useDemo } from "@/state/useDemo";

const QUICK_ACTIONS = [
  { icon: QrCode, label: { id: "Bayar", en: "Pay" } },
  { icon: ArrowUpRight, label: { id: "Transfer", en: "Transfer" } },
  { icon: ArrowDownToLine, label: { id: "Top Up", en: "Top Up" } },
  { icon: Wallet, label: { id: "Riwayat", en: "History" } },
];

export function Home() {
  const { state, t } = useDemo();
  const navigate = useNavigate();
  const showReminder =
    state.oddConfirmedAt === null &&
    shouldShowReminder(state.now, state.ledger.account.oddDueAt);

  return (
    <>
      <PhoneBody className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <GoPayLogo />
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => navigate("/app/notifications")}
              className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-surface"
            >
              <Bell size={18} />
              {state.pushNotifications.length > 0 ? (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-state-danger" />
              ) : null}
            </button>
          </div>
        </div>

        <section className="rounded-3xl bg-gradient-to-br from-gopay to-gopay-deep px-5 py-4 text-white">
          <p className="text-xs opacity-80">
            {state.locale === "id" ? "GoPay Coins & saldo" : "GoPay Coins & balance"}
          </p>
          <p className="mt-1 text-2xl font-extrabold">{formatRupiah(842_500)}</p>
          <Link
            to="/app/vac"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold"
            data-testid="security-pill"
          >
            <ShieldCheck size={14} />
            {state.ledger.account.kycStatus === "approved" ? t(S.gopayPlus) : t(S.gopayBasic)}
          </Link>
        </section>

        <section className="grid grid-cols-4 gap-2">
          {QUICK_ACTIONS.map((action) => (
            <div key={action.label.en} className="flex flex-col items-center gap-1.5">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gopay-tint text-gopay-deep">
                <action.icon size={20} />
              </span>
              <span className="text-[11px] font-semibold text-ink-soft">{t(action.label)}</span>
            </div>
          ))}
        </section>

        <GenieBanner />
        {showReminder ? <OddReminderBanner /> : null}

        <section className="space-y-2">
          <h2 className="text-sm font-bold">{state.locale === "id" ? "Untuk kamu" : "For you"}</h2>
          <Link
            to="/app/vac"
            className="flex items-center gap-3 rounded-2xl border border-line bg-card px-4 py-3"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gojek-tint text-gojek-deep">
              <ShieldCheck size={18} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold">{t(S.vacTitle)}</span>
              <span className="block text-xs text-ink-soft">{t(S.vacSubtitle)}</span>
            </span>
          </Link>
        </section>
      </PhoneBody>
      <PhoneBottomNav />
    </>
  );
}
