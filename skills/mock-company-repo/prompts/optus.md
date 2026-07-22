# Build Optus Demo — Full Landing, Auth, and My Optus Dashboard

## Mission

Scaffold a production-quality **Optus UI clone** for demo purposes that looks and feels like the real Australian telco consumer experience at `https://www.optus.com.au/`. This is a UI/UX fidelity demo, not a production app: dummy data, mock auth, local env vars, markdown/JSON persistence. No real external services.

**Deliverable:** a single PR against `main` with a complete, lint-clean, build-passing Next.js app under `apps/optus/` in this pnpm monorepo, runnable via `pnpm install && pnpm --filter optus-demo dev` (or `pnpm dev:optus`).

## Company profile

- **Product:** Optus (Singtel Optus) is Australia’s second-largest telco — mobile plans, home internet (NBN/5G Home), devices, entertainment (Optus Sport), and the **My Optus** self-serve account portal.
- **Primary users:** Australian consumers shopping mobile/home plans; existing customers managing services, usage, bills, and add-ons in My Optus.
- **Core surfaces to clone:** Marketing homepage (hero); Mobile plans; Home internet; Phones; Entertainment; Support teaser; login/signup; My Optus dashboard (services, usage, bills, plans, add-ons); account settings.
- **Dummy-data theme:** Australian places (Sydney, Melbourne, Brisbane, Perth, Adelaide), AUD pricing, postpaid mobile ($45–$99/mo), NBN home internet, iPhone/Samsung devices, Optus Sport, data usage in GB, bill cycles in AUD.

## Repo context

- Repo: monorepo `demo-monorepo`
- Scaffold **`apps/optus/`** and wire into the workspace (`package.json` root scripts `dev:optus` / `build:optus`, `@demo/ui` dependency, update root `README.md` + `AGENTS.md`). Do not dump at repo root.
- Follow existing Next demo patterns from `apps/spark` and `apps/seek` (transpilePackages `@demo/ui`, re-export `cn` from `@demo/ui/cn`, optional `DemoRibbon`).
- Port default `3000`; document `PORT=3003` when colliding with naukri/seek/spark.

## Target tech stack (mimic Optus web / My Optus React)

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v3 with Optus design tokens |
| Components | Lightweight custom primitives (Button, Accordion, Badge, DataTable) — shadcn-style patterns OK |
| Icons | lucide-react |
| Forms | react-hook-form + zod |
| Tables | @tanstack/react-table (bills / usage history) |
| State | React context + hooks |
| Data | Local JSON seed files + markdown content |
| Auth | Mock session via HTTP-only signed cookie + middleware |
| API | Route handlers reading/writing local files |
| Tests | Vitest + React Testing Library |
| Lint/format | ESLint + Prettier |
| Shared | `@demo/ui` workspace package |

Explicitly DO NOT integrate real databases, cloud providers, CMS APIs, OAuth, Adobe AEM, or payment providers.

## Brand assets — source real files (do this first)

Before writing UI code, commit official brand assets so the app looks **exactly** like an Optus-branded product.

**Sources to try (in order):**
1. **User-provided Optus wordmark SVG** (run attachment / prompt logo) — primary source when live CDN is unreachable
2. Official media centre logos: `https://www.optus.com.au/about/media-centre/multimedia/logos`
3. Homepage CDN — inspect `https://www.optus.com.au/` for `<img>` / favicon paths (`.svg`, `.ico`, `.png`)
4. Favicon: `https://www.optus.com.au/favicon.ico` (or path discovered from homepage `<link rel="icon">`)

**Note for agents in restricted egress:** If `optus.com.au` is not reachable, commit the user-provided wordmark as `logo.svg` (fill `#00A3AD`) and `logo-white.svg` (fill `#FFFFFF`), generate a simple teal favicon/mark, and document the limitation in README + `brand-assets.json`. Do **not** invent a fake logo wordmark.

**Required files in `apps/optus/public/brand/`:**
- `logo.svg` — primary teal Optus wordmark (header)
- `logo-white.svg` — for dark footer / dark banners
- `logo-mark.svg` — circular “O” mark derived from brand if full mark unavailable
- `favicon.ico` / `favicon.png`
- Optional section photography under `public/brand/photos/` when fetchable; otherwise use CSS gradient / pattern heroes matching brand teal (document fallback)
- `brand-assets.json` — manifest with source URLs + fetch date

**How to fetch (agent must execute, not skip):**
1. Prefer `curl -L -o` from optus.com.au when allowed.
2. Always write `scripts/fetch-brand-assets.sh` (idempotent) that embeds the committed SVG content or curl URLs.
3. Wire favicon + header `<img src="/brand/logo.svg">` — **no external hotlinks**.
4. Match clear-space; do not recolor/distort the logo beyond official teal/white variants.

Fonts: Optus uses a proprietary brand sans. Use **Montserrat** via `next/font` as a geometric substitute and note the substitution in README.

## Design system — match the real UI

Optus consumer site cues:

- **Primary teal:** `#00A3AD`
- **Teal dark:** `#007A82`
- **Teal light / surfaces:** `#E6F7F8` / `#F0FBFC`
- **Accent yellow (legacy/energy):** `#FFD100` — use sparingly for highlights / promo chips
- **Ink / near-black:** `#1A1A1A`
- **White / off-white:** `#FFFFFF`, `#F5F7F8`
- Sticky white header with teal logo left; nav (Mobile, Home Internet, Phones, Entertainment, Support, My Optus)
- Full-bleed or strong teal-gradient hero with clear headline + one CTA group
- Teal primary CTAs, generous whitespace, rounded cards only where interactive
- Footer: dark with white logo + utility links + Traditional Custodians acknowledgement (short, respectful)

Build reusable primitives: `SiteHeader`, `SiteFooter`, `HeroBanner`, `QuickLinkGrid`, `PlanCard`, `ServiceCard`, `Accordion`, `Button`, `PageHeader`, `AppShell` (My Optus), `DataTable`, `Badge`, `EmptyState`, `LoadingSkeleton`, `Toast`.

### Visual-fidelity checklist (homepage `/`)

- [ ] Official logo + favicon in `public/brand/`, rendered in header and browser tab
- [ ] Hero: strong Optus brand presence + headline about staying connected / plans + primary CTA to Mobile or My Optus
- [ ] Quick links: Mobile plans, Home internet, Phones, Entertainment, Support, My Optus
- [ ] Featured mobile plan cards (AUD, realistic inclusions)
- [ ] Home internet teaser (NBN / 5G Home)
- [ ] Entertainment / Optus Sport teaser
- [ ] Download My Optus app band
- [ ] Demo ribbon marking unofficial demo

## Application structure

Build a large, navigable codebase (~90–130 files):

```
apps/optus/
  app/
    page.tsx                          # marketing homepage (hero)
    mobile-plans/page.tsx
    home-internet/page.tsx
    phones/page.tsx
    entertainment/page.tsx
    support/page.tsx
    pricing/page.tsx
    login/  signup/
    (myoptus)/                        # authenticated
      layout.tsx
      dashboard/page.tsx
      usage/page.tsx
      plans/page.tsx
      add-ons/page.tsx
      bills/page.tsx
      settings/
        page.tsx  account/  profile/  team/  integrations/
    api/  auth/  plans/  bills/  add-ons/  usage/  settings/
  components/  ui/ layout/ marketing/ myoptus/ plans/
  lib/  auth/ data/ types/ utils/ constants/
  hooks/
  content/  landing/ legal/
  data/  *.json
  middleware.ts
  public/brand/
  scripts/fetch-brand-assets.sh
```

## Pages — detailed requirements

### Marketing landing (`/`) — **hero fidelity screen**
1. Hero — brand-first Optus wordmark presence; headline about mobile & home connectivity; short supporting sentence; CTAs: Shop mobile / Go to My Optus
2. Quick-link grid
3. Popular mobile plans (3–4 cards from JSON)
4. Home internet section
5. Entertainment / Optus Sport teaser
6. My Optus app download band
7. Why Optus / support teaser
8. Footer with acknowledgement

### Pricing (`/pricing`)
Tiered mobile + home comparison, FAQ accordion, CTA → signup.

### Login / Signup
Centered card; any credentials work in demo mode (muted hint). Login sets mock cookie → `/dashboard`. Signup writes `data/users.json` and auto-logs in.

### My Optus shell (authenticated routes)
Persistent side/top nav: Dashboard, Usage, Plans, Add-ons, Bills, Settings. Real logo in header. Logout clears cookie.

### Core product screens
- **Dashboard:** greeting, active services (mobile + home), usage snapshot rings/bars, next bill due, quick actions
- **Usage:** data/voice/SMS period bars + history table (25+ rows)
- **Plans:** current plan + upgrade cards from JSON
- **Add-ons:** data packs / roaming / entertainment toggles persisted via API
- **Bills:** paginated table with status badges; pay simulation toast

### Settings
Account, Profile, Team (members table roles/badges/pagination), Integrations (connect/disconnect toggles → JSON).

## Data layer
- Realistic AU dummy data: enough rows for pagination/filtering (25+ bills/usage).
- API routes read/write JSON via `fs/promises`; atomic writes (temp + rename).
- Markdown in `content/` with frontmatter.

## Env vars (`.env.example`)
```
NEXT_PUBLIC_APP_NAME=Optus
NEXT_PUBLIC_APP_URL=http://localhost:3000
DEMO_AUTH_SECRET=change-me
DEMO_ADMIN_EMAIL=admin@optus-demo.au
DEMO_ADMIN_PASSWORD=demo
```

## Auth (mock)
`middleware.ts` protects My Optus routes; unauthenticated → `/login?redirect=...`. Session in signed HTTP-only cookie (jose HS256 with `DEMO_AUTH_SECRET`). Logout clears cookie.

## Code quality
TypeScript strict (avoid `any`), ESLint clean, build clean, Prettier formatted, accessible, responsive, no console errors on happy paths, comments only for non-obvious logic.

## Tests (minimum)
Vitest + RTL covering: formatters, auth token encode/decode, a hero plan/table component, nav active state, and one API route (GET/POST). Add `"test": "vitest run"` script.

## README
Unofficial demo disclaimer (not affiliated with Singtel Optus Pty Limited), prerequisites, setup, demo credentials, structure tour, JSON persistence, scripts, brand asset notes (including egress fallback if applicable).

## Implementation order
1. **Fetch/commit brand assets** → `public/brand/` + `scripts/fetch-brand-assets.sh`
2. Install deps / wire workspace scripts
3. Design tokens + global CSS + component lib
4. Types, seed data, content
5. Mock auth + middleware
6. App shell + nav (real logo)
7. **Hero product screen (homepage)**
8. Remaining marketing + My Optus screens
9. Settings
10. API routes wired to JSON
11. Tests
12. README + lint/build/test + PR

## PR requirements
Branch per cloud agent convention (`cursor/optus-demo-…`). Run lint, build, test — all pass. Open PR titled **feat: Optus demo — landing, auth, and My Optus dashboard** with: Summary, fidelity notes, Test plan, Demo credentials, Known limitations.

## Constraints
- No lorem ipsum — use realistic AU telco copy.
- No real secrets in committed files.
- No real AI/integrations — simulate.
- Prefer many small files over monoliths.
- Commit incrementally; if blocked (e.g. brand CDN egress), make a reasonable decision, document it, and keep going.

**Success criteria:** `pnpm install && pnpm dev:optus`, log in with demo credentials, land on My Optus dashboard, and see a UI that closely matches Optus branding — including the **official wordmark and favicon** under `public/brand/`, not placeholders. The codebase is large enough that exploring it requires reading across multiple directories.
