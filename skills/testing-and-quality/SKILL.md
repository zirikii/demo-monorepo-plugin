---
name: testing-and-quality
description: How to test, lint, and verify changes in the demo-monorepo before finishing. Covers per-app Vitest suites, the root test caveat, lint/typecheck strictness, and Prettier differences.
---

# Testing and quality gates

Run these before declaring any demo-monorepo change done.

## Test commands

Root `pnpm test` **fails by design** — `apps/nab`'s `test` script is a Playwright walkthrough recorder that needs browser binaries. Run suites per app instead:

```bash
pnpm --filter kddi-noc-dashboard test
pnpm --filter naukri-job-portal test
pnpm --filter seek-marketplace-demo test
```

All three are Vitest with jsdom, `globals: true`, `@testing-library/react`, and `@testing-library/jest-dom/vitest`.

| App | Config | Test location | Setup notes |
| --- | --- | --- | --- |
| kddi | `test` block in `vite.config.js` | `src/test/*.test.{js,jsx}` | clears localStorage after each test |
| naukri | `vitest.config.ts` | co-located + `lib/` + `app/api/` | mocks `server-only`, stubs `matchMedia`/`ResizeObserver` |
| seek | `vitest.config.ts` | `__tests__/` subdirectories | mocks `next/navigation`; excludes `e2e/`, `scripts/` |

## What to test when you change things

- New/changed formatters or utils → unit test (see `format.test.ts`, `formatters.test.js`, `filters.test.ts`).
- New/changed components → render + interaction test asserting content and aria state (`aria-pressed`, `aria-current`), following `JobCard.test.tsx`, `SeverityBadge.test.jsx`, `AppTopNav.test.tsx`.
- **Any new API route handler → a route test is mandatory** (GET filtering/pagination, POST mutations), following `app/api/jobs/route.test.ts`. Update existing route tests when you change an endpoint.
- Auth/session changes → node-environment tests with `process.env.DEMO_AUTH_SECRET = "test-secret"` and `@vitest-environment node` (see `session.test.ts`): round-trip encode/decode plus tamper rejection.

## Lint and typecheck

```bash
pnpm lint        # root: kddi + naukri + seek ESLint, @demo/ui tsc; nab has no linter
pnpm typecheck   # seek + @demo/ui only
```

Strictness to respect:

- naukri: `@typescript-eslint/no-explicit-any` is an **error**; unused vars error (prefix `_` to ignore).
- seek: same rules but unused vars **warn**; also `tsc --noEmit` via its `typecheck` script.
- kddi: ESLint 9 flat config, `no-unused-vars` error, `react/prop-types` off.
- TS everywhere is `strict: true` with `noUncheckedIndexedAccess: true` — index access returns `T | undefined`; handle it, don't `!` it away.

## Formatting

Root Prettier: `semi: true`, `singleQuote: false`, `trailingComma: "all"`, `printWidth: 100`. Exceptions: kddi uses `singleQuote: true`; naukri and seek run `prettier-plugin-tailwindcss`, so let Prettier order Tailwind classes.

## Optional browser tooling

`pnpm exec playwright install chromium` enables nab's walkthrough recorder and seek's `video` script. These are demo artifacts, not CI gates.

## Definition of done

1. App's Vitest suite passes.
2. `pnpm lint` passes at root (and `typecheck` for seek/@demo/ui changes).
3. New behavior has tests in the app's established location/style.
4. For nab: rebuilt output verified on `:8080` and `[adobeDataLayer]` console events still fire on the changed interactions.
