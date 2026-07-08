---
name: naukri-conventions
description: Conventions for apps/naukri (Next.js 14 job portal, Tailwind v3 + shadcn/ui, TypeScript). Read before changing naukri UI, routes, data, or auth.
---

# naukri conventions

Next.js 14 App Router job portal in TypeScript. Dev: `pnpm dev:naukri` on port 3000. `.env.local` is optional (`DEMO_AUTH_SECRET` falls back to `"change-me"`).

## Routes (`apps/naukri/app/`)

- `(marketing)/` — public pages (landing, about, employers).
- `(app)/` — auth-gated (dashboard, profile, applied, saved, messages, recommendations, naukri-360, settings); layout redirects without a session and `middleware.ts` protects the prefixes.
- `jobs/` — public search results + `[slug]` job detail.
- `login/`, `register/` — auth pages.
- `api/` — JSON CRUD route handlers (the only write path to data files).

## Rules

1. PascalCase `.tsx` with **named exports** (`export function JobCard`).
2. Class joiner is `cn` from `lib/utils/cn.ts` (re-export of `@demo/ui/cn`).
3. shadcn/ui is official here: `components.json` exists, primitives live in `components/ui/` (21 of them), variants via `class-variance-authority`. Button variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`, `success`. Add new primitives via the shadcn pattern, keeping aliases `@/components/ui` and `@/lib/utils/cn`.
4. Use semantic Tailwind classes backed by HSL vars in `app/globals.css` (`bg-primary` = `#1875E5`, `text-muted-foreground`, `border-border`, `bg-background`). Helper classes: `.surface-card`, `.skeleton`.
5. Feature components group under `components/<feature>/` (layout, marketing, jobs, profile, dashboard, messages, naukri360, settings, common, auth).
6. State: `SessionProvider` (`hooks/use-session.tsx`, server-hydrated), `ToastProvider` (`hooks/use-toast.tsx`), Radix `TooltipProvider` in `app/providers.tsx`. Complex filter state uses `useReducer` (see `components/jobs/SearchResults.tsx`).
7. Data: JSON files under `data/` read via `readData<T>(key)` in `lib/data/store.ts` and written atomically (temp file + rename). Server reads go through `lib/data/queries.ts`. Reset with `git checkout data/` or `scripts/generate-seed.mjs`.
8. Auth is mock: `jose` HS256 JWT in the `naukri_session` cookie; any email/password is accepted (demo creds `admin@example.com` / `demo`). Never tighten this.
9. Forms: `react-hook-form` + `zod` resolvers, inline errors as `text-xs text-destructive`, demo-mode callout on auth forms.
10. Markdown content lives in `content/`, parsed with `gray-matter` + `react-markdown` + `remark-gfm`.
11. Lint: `next/core-web-vitals` + `next/typescript` + prettier, `@typescript-eslint/no-explicit-any` is an **error**, unused vars error (prefix `_` to ignore). `prettier-plugin-tailwindcss` sorts classes. TS is `strict` with `noUncheckedIndexedAccess`.

## Accessibility patterns to keep

- `JobCard` save button: `aria-label` + `aria-pressed`.
- Active nav links: `aria-current="page"` (tested in `GlobalNav.test.tsx`).
- `CompletenessRing`: `role="img"` + `aria-label="{value}% {label}"`. `Pagination`: `aria-label="Pagination"`.
- shadcn Dialog/Sheet close buttons keep `<span className="sr-only">Close</span>`.

## Testing

Vitest (`vitest.config.ts`, jsdom, `vitest.setup.ts` mocks `server-only`, `matchMedia`, `ResizeObserver`). Tests are mixed: co-located component tests (`JobCard.test.tsx`), `lib/` unit tests (`format.test.ts`, `session.test.ts` with `@vitest-environment node`), and API route tests (`app/api/jobs/route.test.ts`). Run `pnpm --filter naukri-job-portal test`. When adding an API route, add a route test covering GET filtering and POST mutations.
