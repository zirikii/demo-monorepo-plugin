# Build Optus Demo — Full Landing, Auth, and My Optus Dashboard

## Mission

Scaffold a production-quality **Optus UI clone** for demo purposes that looks and feels like the real Australian telco consumer experience at `https://www.optus.com.au/`. Rebuild the full public marketing site plus authenticated **My Optus** account portal. This is a UI/UX fidelity demo, not a production app: dummy data, mock auth, local env vars, markdown/JSON persistence. No real external services.

**Deliverable:** a single PR against `main` with a complete, lint-clean, build-passing Next.js app under `apps/optus/` in this pnpm monorepo, runnable via `pnpm install && pnpm --filter optus-demo dev` (or `pnpm dev:optus`).

## Company profile

- **Product:** Optus (Singtel Optus) is Australia’s second-largest telco — mobile plans, home internet (NBN/5G Home), devices, entertainment (Optus Sport), prepaid/recharge, Living Network features, and the **My Optus** self-serve account portal.
- **Primary users:** Australian consumers shopping mobile/home plans; existing customers managing services, usage, bills, add-ons, and network tools in My Optus.
- **Core surfaces to clone:** Marketing homepage (hero); Mobile plans / SIM offers; Home internet; Phones; Entertainment / Optus Sport; Prepaid & recharge; Living Network; Trade-in; Support; login/signup; My Optus (dashboard, usage, plans, add-ons, bills, network tools, settings).
- **Dummy-data theme:** Australian places (Sydney, Melbourne, Brisbane, Perth, Adelaide, Hobart, Darwin, Canberra), AUD pricing, postpaid mobile ($45–$99/mo), SIM-only promos, NBN / 5G Home Internet, iPhone/Samsung devices, Optus Sport, data usage in GB, bill cycles in AUD, Unlimited Data Day / Network Pulse / Donate Data / Scamwise mocks.

## Repo context

- Repo: monorepo `demo-monorepo`
- Scaffold or **rebuild** **`apps/optus/`** and wire into the workspace (`package.json` root scripts `dev:optus` / `build:optus`, `@demo/ui` dependency, update root `README.md` + `AGENTS.md`). Do not dump at repo root.
- Follow existing Next demo patterns from `apps/spark` and `apps/seek` (transpilePackages `@demo/ui`, re-export `cn` from `@demo/ui/cn`, optional `DemoRibbon`).
- Port default `3000`; document `PORT=3003` when colliding with naukri/seek/spark.

## Target tech stack (mimic Optus web / My Optus React + LUX-inspired tokens)

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

Explicitly DO NOT integrate real databases, cloud providers, CMS APIs, OAuth, Adobe AEM, Salesforce Commerce Cloud, or payment providers.

## Brand assets — source real files (do this first)

Before writing UI code, commit official brand assets so the app looks **exactly** like an Optus-branded product.

**Sources to try (in order):**
1. **User-provided Optus wordmark SVG** (exact path geometry from the run) — primary source when live CDN is unreachable
2. Official media centre logos: `https://www.optus.com.au/about/media-centre/multimedia/logos`
3. Homepage CDN — inspect `https://www.optus.com.au/` for `<img>` / favicon paths (`.svg`, `.ico`, `.png`)
4. Favicon: `https://www.optus.com.au/favicon.ico` (or path discovered from homepage `<link rel="icon">`)

**User-provided wordmark (commit as-is):**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160.6 31.7"><path d="M120.3 18.6c0 4.2-2.6 6.2-6.4 6.2s-6.2-2-6.2-6.2V1.7c0-.7-.1-1.1-.9-1.4-.6-.2-1.6-.4-3-.4s-2.4.2-3 .4c-.8.3-.9.7-.9 1.4v17.1c0 8.5 5.3 13 14 13 8.8 0 14.1-4.6 14.1-13V1.7c0-.7-.1-1.1-.9-1.4-.6-.2-1.6-.4-3-.4s-2.3.2-3 .4c-.8.2-.9.6-.9 1.4v16.9zM81.8 31.7c1.4 0 2.4-.2 3-.4.8-.2.9-.6.9-1.4V7.4h8.1c.8 0 1.1-.3 1.3-.9.2-.5.3-1.4.3-2.5s-.2-2.1-.3-2.5c-.2-.6-.5-.9-1.3-.9h-24c-.8 0-1.1.3-1.3.9-.2.5-.3 1.4-.3 2.5s.2 2.1.3 2.5c.2.6.5.9 1.3.9h8.1V30c0 .7.1 1.1.9 1.4.6.1 1.7.3 3 .3M17-.1C7-.1 0 6.7 0 15.9s7 16 17 16 17-6.8 17-16-7-16-17-16m0 24.9c-5.2 0-8.9-3.7-8.9-8.9C8.1 10.6 11.8 7 17 7s8.9 3.7 8.9 8.9c-.1 5.3-3.7 8.9-8.9 8.9M53.2.5H40.3c-.6 0-1 .4-1 1V30c0 .7.1 1.1.9 1.4.6.2 1.6.4 3 .4s2.4-.2 3-.4c.8-.2.9-.6.9-1.4v-7.9h6.2c8 0 12.3-4.3 12.3-10.7C65.5 4.8 61.3.5 53.2.5M53 15.6h-5.9V7.1H53c2.8 0 4.6 1.4 4.6 4.2s-1.8 4.3-4.6 4.3m80.1 12.6c4 2.5 9.1 3.7 13.7 3.7 8 0 13.7-4 13.7-10.6 0-5-3.7-7.7-10.5-8.9l-1.4-.2c-5.2-.9-6.6-1.6-6.6-3 0-1.7 1.9-2.6 5.3-2.6 2.7 0 5.3.6 8 1.8.7.3 1.1.3 1.6-.2.8-.8 2-2.9 2.4-4.4q.3-1.05-.6-1.5c-3.3-1.6-7.3-2.5-11.4-2.5-8.3 0-13.4 3.7-13.5 9.8-.1 5.5 3.6 8.2 10.3 9.2l1.6.2c5 .8 6.5 1.4 6.5 3 0 1.8-2 3-5.5 3-3.2 0-6.4-1.1-10.2-3-.7-.4-1-.3-1.6.2-.8.8-2 3-2.4 4.4-.2.9.1 1.3.6 1.6"></path></svg>
```
Use fill `#00A3AD` for primary and `#FFFFFF` for reverse.

**Note for agents in restricted egress:** If `optus.com.au` is not reachable, commit the user-provided wordmark as `logo.svg` / `logo-white.svg`, generate a simple teal favicon/mark, and document the limitation in README + `brand-assets.json`. Do **not** invent a fake logo wordmark.

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
- **Accent yellow (energy / Yes):** `#FFD100` — use sparingly for promo chips and primary secondary CTAs
- **Ink / near-black:** `#1A1A1A`
- **White / off-white:** `#FFFFFF`, `#F5F7F8`
- Sticky white header with teal logo left; primary nav (Mobile, Home internet, Phones, Entertainment, Prepaid, Network, Support) + My Optus / Sign in
- **Full-bleed hero** (edge-to-edge teal gradient / lifestyle plane). Brand wordmark is hero-level. One headline, one short supporting line, one CTA group. **No cards, badges, or snapshot panels in the hero.**
- Teal primary CTAs, generous whitespace, rounded cards only where interactive
- Tone: upbeat, straightforward Aussie telco (“Yes” energy without overusing the mark)
- Footer: dark with white logo + utility links + short Traditional Custodians acknowledgement

Build reusable primitives: `SiteHeader`, `SiteFooter`, `HeroBanner`, `PromoStrip`, `QuickLinkGrid`, `UtilityActions`, `PlanCard`, `ServiceCard`, `Accordion`, `Button`, `PageHeader`, `AppShell` (My Optus), `DataTable`, `Badge`, `EmptyState`, `LoadingSkeleton`, `Toast`.

### Visual-fidelity checklist (homepage `/`)

- [ ] Official logo + favicon in `public/brand/`, rendered in header and browser tab
- [ ] Full-bleed hero: Optus wordmark + headline about staying connected / fastest 5G + primary CTAs (Shop SIM / Shop phones) — no inset hero cards
- [ ] Promo strip (e.g. SIM-only save offer) below hero
- [ ] Utility actions mirroring live site: Pay bills, My Account, Recharge, Change plan, Moving home, Activate SIM, Help & Support, Network status
- [ ] Quick links: Mobile plans, Home internet, Phones, Entertainment, Prepaid, Network, Support, My Optus
- [ ] Featured mobile plan cards (AUD, realistic inclusions)
- [ ] Home internet teaser (NBN / 5G Home)
- [ ] Entertainment / Optus Sport teaser
- [ ] Why Optus: Australia’s Fastest 5G, Trade-in, Real 24/7 support
- [ ] Download My Optus app band
- [ ] Demo ribbon marking unofficial demo

## Application structure

Build a large, navigable codebase (~100–150 files):

```
apps/optus/
  app/
    page.tsx                          # marketing homepage (hero)
    mobile-plans/page.tsx
    home-internet/page.tsx
    phones/page.tsx
    entertainment/page.tsx
    prepaid/page.tsx
    network/page.tsx
    trade-in/page.tsx
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
      network-tools/page.tsx
      settings/
        page.tsx  account/  profile/  team/  integrations/
    api/  auth/  plans/  bills/  add-ons/  usage/  settings/  network-tools/
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
1. Full-bleed hero — brand-first white Optus wordmark; headline about mobile & home connectivity / fastest 5G; short supporting sentence; CTAs: Shop SIM offer / Shop mobile phones. No hero cards.
2. Yellow/teal promo strip for SIM-only offer
3. Utility action row (Pay bills, Recharge, My Account, …)
4. Shop quick-link grid
5. Popular mobile plans (3–4 cards from JSON)
6. Home internet section + address check
7. Entertainment / Optus Sport teaser
8. Why Optus (Fastest 5G / Trade-in / Support)
9. My Optus app download band
10. Coverage / Living Network teaser
11. Footer with acknowledgement

### Pricing (`/pricing`)
Tiered mobile + home comparison, FAQ accordion, CTA → signup.

### Prepaid (`/prepaid`)
Recharge-style plans, AUD amounts, activate-SIM CTA → My Optus / signup.

### Network (`/network`)
Living Network feature cards: Unlimited Data Day, Donate Your Data, Scamwise, Network Pulse — all mock/toggleable via JSON in My Optus.

### Trade-in (`/trade-in`)
Simple trade-in estimator UI (device select + mock credit) writing nothing external.

### Login / Signup
Centered card; any credentials work in demo mode (muted hint). Login sets mock cookie → `/dashboard`. Signup writes `data/users.json` and auto-logs in.

### My Optus shell (authenticated routes)
Persistent side/top nav: Dashboard, Usage, Plans, Add-ons, Bills, Network tools, Settings. Real logo in header. Logout clears cookie.

### Core product screens
- **Dashboard:** greeting, active services (mobile + home), usage snapshot bars, next bill due, quick actions, network-tools shortcuts
- **Usage:** data/voice/SMS period bars + history table (25+ rows)
- **Plans:** current plan + upgrade cards from JSON
- **Add-ons:** data packs / roaming / entertainment toggles persisted via API
- **Bills:** paginated table with status badges (25+ rows); pay simulation toast
- **Network tools:** mock Unlimited Data Day activate, Donate Data, Scamwise report form (local only), Network Pulse status

### Settings
Account, Profile, Team (members table roles/badges/pagination), Integrations (connect/disconnect toggles → JSON).

## Data layer
- Realistic AU dummy data: enough rows for pagination/filtering (25+ bills/usage history).
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
TypeScript strict (avoid `any`), ESLint clean, build clean, Prettier formatted, accessible, responsive, no console errors on happy paths, comments only for non-obvious logic. Prefer many small files. Ship 2–3 intentional CSS motions (fade-up hero, promo strip slide, usage bar fill).

## Tests (minimum)
Vitest + RTL covering: formatters, auth token encode/decode, PlanCard / nav active state, and one API route (GET/POST). Add `"test": "vitest run"` script.

## README
Unofficial demo disclaimer (not affiliated with Singtel Optus Pty Limited), prerequisites, setup, demo credentials, structure tour, JSON persistence, scripts, brand asset notes (including egress fallback if applicable).

## Implementation order
1. **Fetch/commit brand assets** → `public/brand/` + `scripts/fetch-brand-assets.sh`
2. Install deps / wire workspace scripts
3. Design tokens + global CSS + component lib
4. Types, seed data, content
5. Mock auth + middleware
6. App shell + nav (real logo)
7. **Hero product screen (homepage)** — full-bleed, brand-first, no hero cards
8. Remaining marketing + My Optus screens (incl. network / prepaid / trade-in)
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

**Success criteria:** `pnpm install && pnpm dev:optus`, log in with demo credentials, land on My Optus dashboard, and see a UI that closely matches Optus branding — including the **official wordmark and favicon** under `public/brand/`, not placeholders. Exploring the codebase requires reading across multiple directories.
