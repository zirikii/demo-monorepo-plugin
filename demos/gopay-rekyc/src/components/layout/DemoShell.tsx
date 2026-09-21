import { NavLink, Outlet } from "react-router-dom";
import { GoPayLogo } from "@/components/brand/GoPayLogo";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { cn } from "@/lib/cn";
import { useDemo } from "@/state/useDemo";
import type { Locale } from "@/domain/types";

const NAV = [
  { to: "/", label: "Overview", end: true },
  { to: "/app", label: "GoPay app", end: false },
  { to: "/portal", label: "E-Money Portal", end: false },
  { to: "/partners", label: "Partners", end: false },
  { to: "/scenario", label: "Scenario", end: false },
  { to: "/flow", label: "Flow", end: false },
  { to: "/traceability", label: "PRD coverage", end: false },
];

export function DemoShell() {
  const { state, dispatch } = useDemo();

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <GoPayLogo />
            <span className="rounded-full bg-surface-deep px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-ink-soft">
              Self-Serve re-KYC demo
            </span>
          </div>
          <nav className="flex flex-1 flex-wrap items-center gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
                    isActive ? "bg-gopay-tint text-gopay-deep" : "text-ink-soft hover:bg-surface",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <SegmentedControl<Locale>
              ariaLabel="Language"
              value={state.locale}
              onChange={(locale) => dispatch({ type: "setLocale", locale })}
              options={[
                { value: "id", label: "ID" },
                { value: "en", label: "EN" },
              ]}
            />
            <button
              type="button"
              onClick={() => dispatch({ type: "resetDemo" })}
              className="rounded-lg border border-line px-3 py-1.5 text-xs font-bold text-ink-soft hover:bg-surface"
            >
              Reset demo
            </button>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-line bg-white px-6 py-4 text-center text-[11px] text-ink-faint">
        Unofficial demo built from a written PRD. Not affiliated with GoPay, Gojek, GoTo or DAB. No
        real identity data, face recognition, OCR, or Dukcapil integration.
      </footer>
    </div>
  );
}
