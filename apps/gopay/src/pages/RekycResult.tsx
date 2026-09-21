import { useLocation, useNavigate } from "react-router-dom";
import { ConsumerLayout } from "@/components/layout/ConsumerLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/Button";
import { NIK_MISMATCH } from "@/lib/rekyc-engine";

export function RekycRejectPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const code = (location.state as { code?: string } | null)?.code;
  const isNik = code === NIK_MISMATCH.code || code === undefined;
  return (
    <ConsumerLayout title="Ditolak" showNav={false}>
      <AppHeader title="Tidak bisa diperbarui" onBack={() => navigate("/app/vac")} />
      <div className="flex flex-1 flex-col px-5 py-6">
        <p className="text-xs font-bold uppercase tracking-wide text-danger">
          {isNik ? NIK_MISMATCH.code : "dukcapil_not_verified"}
        </p>
        <p className="mt-3 text-base font-semibold text-ink">
          {isNik ? NIK_MISMATCH.id : "Dukcapil tidak memverifikasi data baru. GoPay Plus kamu tetap aktif."}
        </p>
        <p className="mt-4 text-sm text-ink-soft">{isNik ? NIK_MISMATCH.en : null}</p>
        <Button className="mt-auto w-full" onClick={() => navigate("/app/vac")}>
          Kembali ke akun terverifikasi
        </Button>
      </div>
    </ConsumerLayout>
  );
}

export function RekycPendingPage() {
  const navigate = useNavigate();
  return (
    <ConsumerLayout title="Pending" showNav={false}>
      <AppHeader title="Sedang ditinjau" onBack={() => navigate("/app/vac")} />
      <div className="px-5 py-6">
        <p className="text-base font-semibold">Foto e-KTP kurang jelas dibaca sistem.</p>
        <p className="mt-2 text-sm text-ink-soft">
          Sesi masuk antrean tinjauan manual — ini status pending, bukan penolakan. GoPay Plus tidak
          berubah.
        </p>
        <Button className="mt-8 w-full" onClick={() => navigate("/app/vac")}>
          Mengerti
        </Button>
      </div>
    </ConsumerLayout>
  );
}
