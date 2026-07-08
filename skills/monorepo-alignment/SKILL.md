---
name: monorepo-alignment
description: Cross-cutting principles for the demo-monorepo (kddi, naukri, seek, nab, @demo/ui). Read this first before any UI or feature change, then read the app-specific conventions skill.
---

# Demo monorepo alignment

The demo-monorepo is a pnpm workspace (Node >= 20, pnpm 10) with four independent demo apps and one shared package:

| App | Stack | Dev script | Port | Package name |
| --- | --- | --- | --- | --- |
| `apps/kddi` | Vite + React 19, Tailwind v4, JS | `pnpm dev:kddi` | 5173 | `kddi-noc-dashboard` |
| `apps/naukri` | Next.js 14, Tailwind v3, TS | `pnpm dev:naukri` | 3000 | `naukri-job-portal` |
| `apps/seek` | Next.js 15, Tailwind v3, TS | `pnpm dev:seek` | 3000 | `seek-marketplace-demo` |
| `apps/nab` | Generated static HTML/CSS/JS | `pnpm dev:nab` | 8080 | `nab-landing` |
| `packages/ui` | Shared tokens + utilities | — | — | `@demo/ui` |

naukri and seek collide on port 3000. Run the second one with `PORT=3001 pnpm --filter seek-marketplace-demo dev`. Never pass `-p 3001` through the root dev scripts — `next dev` mis-parses the extra args.

## Shared package `@demo/ui`

- `@demo/ui/cn` — `cn(...)` (clsx + tailwind-merge). Used by naukri and seek via re-exports at `lib/utils/cn.ts`.
- `@demo/ui/cx` — dependency-free `cx(...)`. Used by kddi via `src/lib/cx.js`.
- `@demo/ui/tokens` — TS token object; `@demo/ui/tokens.css` — CSS custom properties (`--demo-accent: #f54e00`, `--demo-ink: #26251e`, `--demo-bg: #f7f7f4`, radii `--demo-radius-sm/md/lg/full`).
- nab consumes only `tokens.css`, copied at build time by `apps/nab/scripts/sync-tokens.js`.
- Next apps must keep `@demo/ui` in `transpilePackages` in `next.config.mjs`.

## Hard boundaries (never cross)

1. Each app has its own brand token system. Never share Tailwind configs or copy one app's palette into another.
2. Use the app's class joiner: `cx` in kddi, `cn` in naukri/seek. Do not import clsx/classnames directly.
3. nab's `*.html` files are generated. Edit `apps/nab/scripts/pages.js`, `scripts/sections.js`, or `templates/*.html`, then rebuild. Never hand-edit output HTML.
4. Do not add React components to nab; it only syncs CSS tokens from `@demo/ui`.
5. No real database. Persistence is JSON files (naukri/seek) and localStorage (kddi).
6. Do not tighten auth. Login is intentionally mock: any email/password is accepted, sessions are `jose` HS256 JWTs signed with `DEMO_AUTH_SECRET` (fallback `"change-me"`).
7. kddi's assignee field is intentionally stubbed (`AssigneePlaceholder.jsx`) — leave it unless explicitly asked.
8. When changing nab interactive elements, preserve Adobe Client Data Layer events (see `nab-conventions`).

## Cross-app UI conventions

- Icons: `lucide-react` in all React apps, with `aria-hidden="true"` on decorative icons. Spinners use `<Loader2 className="h-4 w-4 animate-spin" />`.
- Dates/numbers: native `Intl` APIs only — no date-fns, dayjs, or moment. kddi formats in JST (`Asia/Tokyo`), seek in `en-AU`.
- Animation: no framer-motion. naukri/seek use `tailwindcss-animate`; kddi uses custom keyframes in `src/index.css`; nab uses plain CSS transitions.
- Forms (Next apps): `react-hook-form` + `zod` via `@hookform/resolvers`, inline errors as `text-xs text-destructive`. Demo forms pre-fill credentials and show a "demo mode" callout.
- Tables: `@tanstack/react-table` for dense data views.
- Accessibility baseline: `focus-visible` rings on all interactive controls, `aria-pressed` on toggles, `aria-current="page"` on active nav links, `role="dialog"` + `aria-modal` + focus trap on dialogs, `aria-label` on `<nav>` and icon-only buttons.
- Each app is an unofficial brand demo. Keep the disclaimer language in READMEs and don't present the apps as affiliated with the real brands. Brand assets live in `public/brand/` with `brand-assets.json` manifests.

## Workflow

1. Read the app-specific skill (`kddi-conventions`, `naukri-conventions`, `seek-conventions`, `nab-conventions`).
2. Pick colors/radii/fonts from `design-tokens` — never invent hex values.
3. Follow `testing-and-quality` before finishing: per-app Vitest + `pnpm lint`.
4. When pushing from a cloud agent and origin is Bitbucket, use `scripts/git-push.sh -u origin <branch>` (fixes `x-token-auth` username) instead of raw `git push`.
