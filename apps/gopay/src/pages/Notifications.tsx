import { useNavigate } from "react-router-dom";
import { ConsumerLayout } from "@/components/layout/ConsumerLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { useRekyc } from "@/hooks/useRekyc";

export function NotificationsPage() {
  const { store } = useRekyc();
  const navigate = useNavigate();
  return (
    <ConsumerLayout title="Notifikasi">
      <AppHeader title="Notifikasi" onBack={() => navigate("/app")} />
      <ul className="divide-y divide-line-soft px-4">
        {store.notifications.length === 0 ? (
          <li className="py-8 text-center text-sm text-ink-faint">Belum ada notifikasi</li>
        ) : (
          store.notifications.map((n) => (
            <li key={n.id} className="py-3">
              <p className="text-[11px] font-bold uppercase text-gopay">{n.channel}</p>
              <p className="text-sm">{n.body}</p>
            </li>
          ))
        )}
      </ul>
    </ConsumerLayout>
  );
}
