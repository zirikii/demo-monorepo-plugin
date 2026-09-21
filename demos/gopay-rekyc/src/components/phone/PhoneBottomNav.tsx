import { Home, MessageCircle, ShieldCheck, Wallet } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/cn";

const ITEMS = [
  { to: "/app", label: "Home", icon: Home, end: true },
  { to: "/app/dira", label: "Dira", icon: MessageCircle, end: false },
  { to: "/app/vac", label: "Akun", icon: ShieldCheck, end: false },
  { to: "/app/wallet", label: "Dompet", icon: Wallet, end: false },
];

export function PhoneBottomNav() {
  return (
    <nav className="shrink-0 border-t border-line bg-white px-2 pb-6 pt-2">
      <ul className="flex items-center justify-around">
        {ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex w-16 flex-col items-center gap-1 rounded-lg py-1 text-[10px] font-bold",
                  isActive ? "text-gopay-deep" : "text-ink-faint",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
                  {item.label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
