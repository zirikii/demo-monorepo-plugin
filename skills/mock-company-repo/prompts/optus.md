# Build Optus Demo — Full Landing, Auth, and My Optus Dashboard

## Mission

Scaffold a production-quality **Optus UI clone** for demo purposes that looks and feels like [optus.com.au](https://www.optus.com.au/) — consumer marketing site plus My Optus account portal. This is a UI/UX fidelity demo, not a production app: dummy data, mock auth, local env vars, markdown/JSON persistence. No real external services.

**Deliverable:** a single PR against `main` with a complete, lint-clean, build-passing Next.js app under `apps/optus/` in this pnpm monorepo, runnable via `pnpm install && pnpm --filter optus-web-demo dev` (or `pnpm dev:optus`).

## Company profile

- **Product:** Optus is a major Australian telecommunications brand (Singtel Optus) — mobile postpaid/prepaid, nbn® / 5G Home Internet, phones & devices, entertainment (Optus Sport), and the My Optus self-serve account app/portal.
- **Primary users:** AU consumers shopping mobile/home internet plans; existing customers managing usage, bills, add-ons, and plan details in My Optus.
- **Core surfaces to clone:** Marketing homepage (hero + shop categories); Mobile plans; Home Internet (nbn); Phones & devices; Deals; Optus Sport teaser; Login/Signup; My Optus dashboard (usage, plans, add-ons, bills); Account settings.
- **Dummy-data theme:** Australian places (Sydney, Melbourne, Brisbane, Perth, Adelaide), AUD pricing, Choice / Promo mobile plans, nbn Home Broadband tiers, iPhone/Samsung devices, Optus Sport, Endless Data / Data Boost add-ons, My Optus app language (“Yes”).

## Repo context

- Repo: monorepo `demo-monorepo`
- Scaffold **`apps/optus/`** and wire into the workspace (`package.json` root scripts `dev:optus` / `build:optus`, `@demo/ui` dependency, update root `README.md` + `AGENTS.md`). Do not dump at repo root.
- Follow existing Next demo patterns from `apps/spark` and `apps/seek` (transpilePackages `@demo/ui`, re-export `cn` from `@demo/ui/cn`, optional `DemoRibbon`).
- Default port: **3003** (avoid collision with naukri/seek/spark on 3000). Document `PORT=3003` if needed.

## Target tech stack (mimic modern Optus consumer web)

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v3 with Optus design tokens |
| Components | Lightweight custom primitives (Button, Accordion, Card, DataTable) — shadcn-style patterns OK |
| Icons | lucide-react |
| Forms | react-hook-form + zod |
| Tables | @tanstack/react-table (bills / add-ons history) |
| State | React context + hooks |
| Data | Local JSON seed files + markdown content |
| Auth | Mock session via HTTP-only signed cookie + middleware |
| API | Route handlers reading/writing local files |
| Tests | Vitest + React Testing Library |
| Lint/format | ESLint + Prettier |
| Shared | `@demo/ui` workspace package |

Explicitly DO NOT integrate real databases, cloud providers, CMS APIs, OAuth, Adobe AEM, or payment providers.

## Brand assets — source real files (do this first)

Before writing UI code, fetch and commit official brand assets so the app looks **exactly** like an Optus-branded product.

**Sources to try (in order):**
1. Official media logos: `https://www.optus.com.au/about/media-centre/multimedia/logos`
2. Homepage / CDN logo + favicon from `https://www.optus.com.au/` (inspect `<img>`, `<link rel="icon">`)
3. Wikimedia Commons SVG fallback: `https://upload.wikimedia.org/wikipedia/commons/c/ca/Optus_logo.svg` (if optus.com.au egress is blocked)
4. Google s2 favicon: `https://www.google.com/s2/favicons?domain=optus.com.au&sz=128`

**Required files in `apps/optus/public/brand/`:**
- `logo.svg` — primary teal Optus wordmark (header)
- `logo-white.svg` — for dark footer / dark banners
- `logo-mark.svg` — compact mark / “Yes” bubble if available
- `yes-mark.svg` — yellow “Yes” calligraphy accent
- `favicon.ico` / `favicon.png`
- Optional lifestyle photos under `public/brand/photos/`
- `brand-assets.json` — manifest with source URLs + fetch date

**How to fetch (agent must execute, not skip):**
1. Prefer `curl -L -o` from optus.com.au media centre / homepage CDN.
2. If egress blocks `optus.com.au`, use Wikimedia Commons SVG + document the limitation in README; still ship a faithful teal wordmark and yellow Yes mark under `public/brand/`.
3. Write `scripts/fetch-brand-assets.sh` (idempotent) that tries official URLs then fallbacks.
4. Wire favicon + header `<img src="/brand/logo.svg">` — **no external hotlinks**.
5. Match clear-space; do not recolor/distort the official logo when a real file is obtained.

Fonts: Optus uses bespoke type. Use **Nunito Sans** or **Outfit** via `next/font` as a close friendly rounded substitute and note the substitution in README.

## Design system — match the real UI

Optus consumer site cues:

- **Primary teal:** `#00A3AD`
- **Teal dark:** `#007A82`
- **Teal light / soft:** `#E6F7F8`
- **Yes yellow:** `#FECD03` (also `#FFD100` accents)
- **Ink / near-black:** `#1A1A1A` / `#222222`
- **White / off-white surfaces:** `#FFFFFF`, `#F5F7F8`, `#EEF1F2`
- **Lines:** `#E2E6E8`
- Sticky white header with teal logo left; nav (Mobile, Home Internet, Phones, Deals, Entertainment); Sign in → My Optus
- Full-bleed hero with teal gradient / lifestyle atmosphere and bold headline + primary CTA
- Yellow “Yes” accent chips / secondary CTAs
- Footer: dark teal/ink with white logo + utility links
- Locale: `lang="en-AU"`, AUD via `Intl.NumberFormat('en-AU')`

Build reusable primitives: `SiteHeader`, `SiteFooter`, `HeroBanner`, `QuickLinkGrid`, `PromoSection`, `PlanCard`, `DeviceCard`, `Accordion`, `Button`, `PageHeader`, `AppShell` (My Optus), `DataTable`, `Badge`, `EmptyState`, `LoadingSkeleton`, `Toast`.

### Visual-fidelity checklist (homepage `/`)

- [ ] Official (or Commons-sourced) logo + favicon in `public/brand/`, rendered in header and browser tab
- [ ] Hero: Optus-forward brand treatment + one headline + supporting sentence + CTA group
- [ ] Quick links: Mobile plans, Home Internet, Phones, Deals, Optus Sport, My Optus
- [ ] Featured mobile plans grid with AUD pricing
- [ ] Home Internet / nbn teaser section
- [ ] Entertainment / Optus Sport band
- [ ] Download My Optus app CTA
- [ ] Dark footer with disclaimer (unofficial demo)

## Application structure

Build a large, navigable codebase (~80–150 files) organized by feature:

```
app/
  (marketing pages at root)/
  login/  signup/
  (myoptus)/              # authenticated layout group
    dashboard/
    usage/
    plans/
    add-ons/
    bills/
    settings/             # account, profile, team, integrations
  api/                    # route handlers wired to JSON persistence
components/  ui/ layout/ marketing/ myoptus/ plans/
lib/        auth/ data/ types/ utils/ constants/
hooks/
content/    landing/ legal/
data/       *.json seed + runtime store
middleware.ts             # protect My Optus routes
```

## Pages — detailed requirements

### Marketing landing (`/`)
Hero with headline + CTAs, quick links, featured plans, home internet teaser, entertainment band, app download, footer. Original copy in `content/landing/*.md`. Responsive with mobile nav.

### Mobile plans (`/mobile`)
Plan cards (e.g. Choice Lite / Choice / Choice Plus style naming), comparison notes, FAQ accordion, CTA → signup / My Optus.

### Home Internet (`/home-internet`)
nbn / 5G Home Broadband tiers, address-check mock form (client-only dummy), FAQ.

### Phones (`/phones`)
Device grid with AUD from/prices, filter chips (brand), link to deals.

### Deals (`/deals`)
Promo cards with yellow Yes accents.

### Entertainment (`/entertainment`)
Optus Sport teaser + inclusions list (dummy).

### Login / Signup
Centered card; any credentials work in demo mode (show a muted hint). Login sets mock cookie → `/dashboard`. Signup writes to `data/users.json` and auto-logs in.

### My Optus shell (all authenticated routes)
Persistent nav: Dashboard, Usage, Plans, Add-ons, Bills, Settings. Match teal brand.

### Core product screens
- **Dashboard:** usage % ring/bar, next bill, active plan summary, quick actions (boost data, view bills)
- **Usage:** data / calls / SMS breakdown with progress bars; period selector (mock)
- **Plans:** current plan details + CIS-style dummy fields; change-plan table of alternatives
- **Add-ons:** Data Boost / Unlimited Data Day / Endless Data toggles persisted via API
- **Bills:** `@tanstack/react-table` of invoices (25+ rows), status badges, pay mock toast
- **Settings:** Account, Profile, Team (members table), Integrations (toggles → JSON)

## Data layer
- Realistic AU dummy data: enough rows to exercise pagination/filtering (25+ bills).
- API routes read/write JSON via `fs/promises` (route handlers only); atomic writes (temp file + rename).
- Markdown content in `content/` with frontmatter.

## Env vars (`.env.example`)
```
NEXT_PUBLIC_APP_NAME=Optus
NEXT_PUBLIC_APP_URL=http://localhost:3003
DEMO_AUTH_SECRET=change-me
DEMO_ADMIN_EMAIL=admin@optus-demo.au
DEMO_ADMIN_PASSWORD=demo
```

## Auth (mock)
`middleware.ts` protects My Optus routes; unauthenticated → `/login?redirect=...`. Session in signed HTTP-only cookie (HMAC/jose with `DEMO_AUTH_SECRET`). Logout clears cookie.

## Code quality
TypeScript strict (avoid `any`), ESLint clean, build clean, Prettier formatted, accessible (semantic HTML, aria labels, keyboard nav), responsive, no console errors on happy paths, comments only for non-obvious logic.

## Tests (minimum)
Vitest + RTL covering: formatters (AUD), auth token encode/decode, a plan card component, My Optus nav active state, and one API route (GET/POST add-ons or bills). Add `"test": "vitest run"` script.

## README
Replace default README: overview (unofficial demo, not affiliated with Optus / Singtel Optus), prerequisites, setup (`cp .env.example .env.local && pnpm install && pnpm --filter optus-web-demo dev`), demo credentials, project structure tour, how JSON persistence works, scripts, brand asset sourcing notes.

## Implementation order
1. **Fetch brand assets** → `public/brand/` + `scripts/fetch-brand-assets.sh`
2. Install deps
3. Design tokens + global CSS + component lib init (exact brand hex)
4. Types, seed data, content
5. Mock auth + middleware
6. App shell + nav (real logo in header)
7. **Hero product / marketing homepage**
8. Remaining product screens
9. Settings
10. Marketing + auth pages
11. API routes wired to JSON
12. Tests
13. README + lint/build/test + PR

## PR requirements
Branch `cursor/optus-website-demo-dd22` (cloud) / `feat/optus-demo`. Run lint, build, test — all pass. Open PR titled **feat: Optus demo — landing, auth, and My Optus dashboard** with: Summary, Screenshots/notes on fidelity, Test plan checklist, Demo credentials, Known limitations (including egress/asset fallbacks if any). Attach computer-vision walkthrough video when recorded.

## Constraints
- No lorem ipsum — use realistic AU telco copy.
- No real secrets in committed files.
- No real AI/integrations — simulate.
- Prefer many small files over monoliths.
- Commit incrementally; if blocked, make a reasonable decision, document it, and keep going — do not stop early.

**Success criteria:** `pnpm install && pnpm --filter optus-web-demo dev`, log in with demo credentials, land on My Optus dashboard, and see a UI that closely matches Optus branding — including logo and favicon under `public/brand/`. The codebase is large enough that exploring it requires reading across multiple directories.
