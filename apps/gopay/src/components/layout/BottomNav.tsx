import { NavLink } from "react-router-dom";
import { Home, ShieldCheck, MessageCircle, Settings } from "lucide-react";
import { cn } from "@/lib/cn";

const items = [
  { to: "/app", label: "Home", icon: Home, end: true },
  { to: "/app/vac", label: "Akun", icon: ShieldCheck, end: false },
  { to: "/app/dira", label: "Dira", icon: MessageCircle, end: false },
  { to: "/app/settings", label: "Setelan", icon: Settings, end: false },
];

export function BottomNav() {
  return (
    <nav aria-label="Utama" className="mt-auto border-t border-line-soft bg-white">
      <ul className="grid grid-cols-4">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }: { isActive: boolean }) =>
                cn(
                  "flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold",
                  isActive ? "text-gopay" : "text-ink-faint",
                )
              }
            >
              {({ isActive }: { isActive: boolean }) => (
                <>
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                  <span aria-current={isActive ? "page" : undefined}>{item.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
