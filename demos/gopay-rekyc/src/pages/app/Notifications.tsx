import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PhoneAppBar, PhoneBody } from "@/components/phone/PhoneScreen";
import { PhoneBottomNav } from "@/components/phone/PhoneBottomNav";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDateTime } from "@/lib/format";
import { useDemo } from "@/state/useDemo";

export function Notifications() {
  const { state } = useDemo();
  const navigate = useNavigate();

  return (
    <>
      <PhoneAppBar
        title={state.locale === "id" ? "Notifikasi" : "Notifications"}
        onBack={() => navigate("/app")}
      />
      <PhoneBody className="space-y-3">
        {state.pushNotifications.length === 0 ? (
          <EmptyState
            title={state.locale === "id" ? "Belum ada notifikasi" : "No notifications yet"}
            description={
              state.locale === "id"
                ? "Notifikasi sukses re-KYC akan muncul di sini."
                : "The re-KYC success notification lands here."
            }
          />
        ) : (
          state.pushNotifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => navigate("/app/vac")}
              className="flex w-full gap-3 rounded-2xl border border-line bg-card px-4 py-3 text-left"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gopay-tint text-gopay-deep">
                <Bell size={16} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold">{notification.title}</span>
                <span className="block text-xs text-ink-soft">{notification.body}</span>
                <span className="mt-1 block text-[10px] text-ink-faint">
                  {formatDateTime(notification.sentAt, state.locale)} ·{" "}
                  {notification.apps.join(" · ")}
                </span>
              </span>
            </button>
          ))
        )}
      </PhoneBody>
      <PhoneBottomNav />
    </>
  );
}
