---
name: seek-conventions
description: Conventions for apps/seek (Next.js 15 marketplace, Tailwind v3, TypeScript, en-AU). Read before changing seek UI, routes, data, or auth.
---

# seek conventions

Next.js 15 App Router marketplace in TypeScript, Australian locale (`lang="en-AU"`). Dev: `pnpm dev:seek` on port 3000; run alongside naukri with `PORT=3001 pnpm --filter seek-marketplace-demo dev`. `.env.local` optional.

## Routes (`apps/seek/app/`)

- `(marketing)/` — public (landing, career-advice, companies, legal).
- `oauth/` — login and register live here, **not** `/login`.
- `(app)/` — middleware-protected (dashboard, jobs, jobs/[jobId], saved-jobs, saved-searches, applied, profile, settings). Note `/jobs` is protected here, unlike naukri.
- `api/` — JSON persistence route handlers.

## Rules

1. PascalCase `.tsx` with named exports. Feature components under `components/<feature>/`; primitives under `components/ui/` (20 shadcn-style files, hand-maintained — there is **no** `components.json`, so don't run the shadcn CLI; copy/adapt primitives by hand in the existing style with `cva`).
2. Class joiner is `cn` from `lib/utils/cn.ts` (re-export of `@demo/ui/cn`).
3. Palette is SEEK/Braid in `tailwind.config.ts`: `seek.pink #E60278` (primary), `seek.navy #2E3849`, tone colors (`tone.positive`, `tone.critical`, `tone.caution`, `tone.info` + `-bg` variants). Radii are hard-coded `lg 12px / md 8px / sm 6px`. Utilities: `.focus-ring` (pink focus), `.container-page` (`max-w-[1200px]`).
4. Button variants (`components/ui/button.tsx`): `primary`, `secondary`, `outline`, `ghost`, `link`, `destructive`, `navy`. Focus ring is `focus-visible:ring-seek-pink`.
5. State: `AppDataProvider` (`components/providers/AppDataProvider.tsx`) holds client `savedIds`/`appliedIds` Sets with optimistic `toggleSave`/`apply` and fetch rollback. Session is server-side only — `requireSession()` in `(app)/layout.tsx` seeds saved/applied IDs into `AppShell`; there is no client SessionProvider. `Toaster` mounts at root layout.
6. Data: JSON files under `data/` (`jobs.json`, `employers.json`, `profile.json`, ...) via the atomic read/write store in `lib/data/`. Regenerate with `scripts/generate-seed-data.mjs`. Validation schemas in `lib/validation.ts`.
7. Auth is mock: `jose` HS256 JWT (with issuer/audience) in the `seek_demo_session` cookie; any credentials accepted (demo creds `candidate@example.com` / `demo`). Never tighten.
8. Locale formatting: AUD via `Intl.NumberFormat('en-AU')`, dates via `toLocaleDateString('en-AU')` in `lib/utils/format.ts` (`formatPostedAt`, `formatDate`).
9. Lint mirrors naukri (`next/core-web-vitals`, `next/typescript`, prettier, tailwind class sorting) but unused vars are warnings. TS: `strict`, `noUncheckedIndexedAccess`, `forceConsistentCasingInFileNames`. `pnpm --filter seek-marketplace-demo typecheck` runs `tsc --noEmit`.
10. `e2e/` holds the Playwright walkthrough/video recorder — it needs `pnpm exec playwright install chromium` and is not part of the unit suite.

## Accessibility patterns to keep

- `SaveFlag`: descriptive `aria-label` including the job title, plus `aria-pressed`.
- `SearchBar`: `role="search"` + `aria-label="Search jobs"`.
- Keyboard focus via the `.focus-ring` utility; active nav `aria-current="page"` (tested in `AppTopNav.test.tsx`).

## Testing

Vitest (`vitest.config.ts`, jsdom, mocks `next/navigation`, excludes `e2e/` and `scripts/`). Tests live in `__tests__/` subdirectories (`components/layout/__tests__/`, `lib/utils/__tests__/`, `app/api/__tests__/`, `lib/auth/__tests__/`). Run `pnpm --filter seek-marketplace-demo test`. When adding an API route, add a matching test in the route's `__tests__/` directory.
