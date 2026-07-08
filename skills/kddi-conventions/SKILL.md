---
name: kddi-conventions
description: Conventions for apps/kddi (Vite + React 19 NOC dashboard, Tailwind v4, JavaScript). Read before changing kddi UI, components, hooks, or data.
---

# kddi conventions

Vite + React 19 single-page NOC dashboard, plain JavaScript (no TypeScript). Dev: `pnpm dev:kddi` on port 5173. No env vars needed.

## Structure (`apps/kddi/src/`)

- `components/` grouped by feature: `alerts/`, `escalation/`, `layout/`, `status/`, `toolbar/`, and shared primitives in `ui/` (Button, Badge, Modal, Toast, Select, EmptyState, LoadingSkeleton, ...).
- `context/` — `ToastContext.jsx` (`push`/`dismiss`), `EscalationContext.jsx`.
- `hooks/` — `useAlerts`, `useEscalations`, `useAutoRefresh`, `useFocusTrap`, `useClock`.
- `data/` — mock data (`mockAlerts.js`, `mockRegions.js`, `teams.js`, `alertTemplates.js`).
- `lib/` — `cx.js` (re-export of `@demo/ui/cx`), `formatters.js`, `constants.js`, `storage.js`.
- `test/` — all tests live here, not next to components.

## Rules

1. PascalCase `.jsx` files with **default exports** for components.
2. Class joiner is `cx` from `src/lib/cx.js` — never `cn`, clsx, or template strings for conditional classes.
3. Styling is Tailwind v4 CSS-first: tokens live in `@theme` inside `src/index.css`. There is no `tailwind.config.*`; add new tokens to `@theme`, not a config file.
4. Use the NOC dark palette (`bg-noc-bg`, `bg-noc-card`, `border-noc-border`, `text-noc-muted`) and severity/region utilities (`text-sev-critical`, `bg-region-healthy`). Focus ring color is `kddi-arc` (`focus-visible:ring-kddi-arc`).
5. `components/ui/Button.jsx` variants: `primary`, `outline`, `ghost`, `danger`, `subtle`; sizes `sm`, `md`, `lg`. Extend it rather than creating new button styles.
6. State: React Context + custom hooks. No router, no external state library. Persistence goes through `lib/storage.js` (localStorage); escalations seed from `data/escalations.json`.
7. Dates render in JST via `lib/formatters.js` (`formatJST`, `formatJSTClock`, `timeAgo`) — `Intl.DateTimeFormat` with `timeZone: 'Asia/Tokyo'`.
8. Fonts are self-hosted (`@fontsource/inter`, `@fontsource/jetbrains-mono`).
9. The assignee field is intentionally stubbed (`AssigneePlaceholder.jsx`); do not wire it up unless explicitly asked.
10. Prettier here uses `singleQuote: true` (differs from repo root).

## Accessibility patterns to keep

- `SeverityBadge` exposes `aria-label="Severity: <level>"`.
- Live regions/feeds have `aria-label` (e.g. `AlertFeed` → "Live alert feed", `StatusBar` → "Regional network status").
- Modals: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title"`, close button `aria-label="Close dialog"`, focus trapped via `useFocusTrap`, Escape closes.

## Testing

Vitest config is in `vite.config.js` (`test` block), setup in `src/test/setup.js` (clears localStorage after each test). Tests match `src/**/*.{test,spec}.{js,jsx}` and live in `src/test/`. Run `pnpm --filter kddi-noc-dashboard test`. Typical coverage: badge labels/colors, modal behavior, row interactions, formatters, `useAlerts`.
