import { Bell, ChevronRight, ShieldAlert } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ConsumerLayout } from "@/components/layout/ConsumerLayout";
import { useRekyc } from "@/hooks/useRekyc";
import { formatIdr } from "@/lib/format";

export function HomePage() {
  const { store } = useRekyc();
  const navigate = useNavigate();
  const due = new Date(store.account.oddDueAt).getTime();
  const lead = store.oddBannerLeadDays * 24 * 60 * 60 * 1000;
  const showOdd = Date.now() >= due - lead;
  const overdueDays = Math.floor((Date.now() - due) / (24 * 60 * 60 * 1000));
  const blocked =
    store.blockEnforcement &&
    overdueDays >= store.blockOverdueDays &&
    store.account.kycStatus === "approved";

  if (blocked) {
    return (
      <ConsumerLayout title="GoPay" showNav={false}>
        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
          <ShieldAlert className="h-12 w-12 text-warn" aria-hidden="true" />
          <h1 className="mt-4 text-xl font-extrabold">Selesaikan tinjauan ODD dulu</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Fitur di aplikasi GoPay ditahan. Saldo tetap bisa dipakai di Gojek atau merchant lain.
          </p>
          <button
            type="button"
            className="mt-6 w-full rounded-full bg-gopay py-3 font-semibold text-white"
            onClick={() => navigate("/app/odd")}
          >
            Lanjut tinjauan
          </button>
        </div>
      </ConsumerLayout>
    );
  }

  return (
    <ConsumerLayout title="GoPay">
      <div className="bg-gopay px-5 pb-8 pt-6 text-white">
        <div className="flex items-center justify-between">
          <p className="text-sm opacity-90">Halo, {store.account.displayName.split(" ")[0]}</p>
          <Link to="/app/notifications" aria-label="Notifikasi" className="rounded-full p-1">
            <Bell className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
        <p className="mt-6 text-xs font-medium uppercase tracking-wide opacity-80">Saldo GoPay Plus</p>
        <p className="mt-1 text-3xl font-extrabold">{formatIdr(store.account.balanceIdr)}</p>
      </div>
      {showOdd ? (
        <button
          type="button"
          onClick={() => navigate("/app/odd")}
          className="m-4 flex w-[calc(100%-2rem)] items-start gap-3 rounded-2xl bg-warn-tint px-4 py-3 text-left"
        >
          <ShieldAlert className="mt-0.5 h-5 w-5 text-warn" aria-hidden="true" />
          <span>
            <span className="block text-sm font-bold text-ink">Bank Indonesia mewajibkan tinjauan data</span>
            <span className="mt-0.5 block text-xs text-ink-soft">
              Cek apakah e-KTP kamu masih sama, biar akun tetap aktif.
            </span>
          </span>
        </button>
      ) : null}
      <div className="px-4 pb-6">
        <Link
          to="/app/vac"
          className="flex items-center justify-between rounded-2xl border border-line bg-card px-4 py-4"
        >
          <div>
            <p className="text-sm font-bold">Pusat Akun Terverifikasi</p>
            <p className="text-xs text-ink-soft">GoPay Plus · data e-KTP</p>
          </div>
          <ChevronRight className="h-5 w-5 text-ink-faint" aria-hidden="true" />
        </Link>
        <Link
          to="/app/dira"
          className="mt-3 flex items-center justify-between rounded-2xl border border-line bg-card px-4 py-4"
        >
          <div>
            <p className="text-sm font-bold">Dira</p>
            <p className="text-xs text-ink-soft">Bantuan update data KTP</p>
          </div>
          <ChevronRight className="h-5 w-5 text-ink-faint" aria-hidden="true" />
        </Link>
      </div>
    </ConsumerLayout>
  );
}
