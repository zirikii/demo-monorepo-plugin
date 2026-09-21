import { Home, MessageCircle, ShieldCheck, Wallet } from "lucide-react";
import { NavLink } from "react-router-dom";
import { S, pick } from "@/data/strings";
import { cn } from "@/lib/cn";
import { useDemo } from "@/state/useDemo";

const ITEMS = [
  { to: "/app", label: S.navHome, icon: Home, end: true },
  { to: "/app/dira", label: S.navDira, icon: MessageCircle, end: false },
  { to: "/app/vac", label: S.navAccount, icon: ShieldCheck, end: false },
  { to: "/app/wallet", label: S.navWallet, icon: Wallet, end: false },
];

export function PhoneBottomNav() {
  const { state } = useDemo();

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
                  {pick(item.label, state.locale)}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
