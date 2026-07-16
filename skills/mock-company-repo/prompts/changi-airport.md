# Build Changi Airport Demo — Full Landing, Auth, and Traveller Hub

## Mission

Scaffold a production-quality **Changi Airport** website clone for demo purposes that looks and feels like the real AU English homepage at https://www.changiairport.com/au/en.html (and its primary section pages). This is a UI/UX fidelity demo, not a production app: dummy data, mock auth, local env vars, markdown/JSON persistence. No real external services (do **not** call live Changi APIs, AppSync, or Adobe endpoints — even if keys appear in page source).

**Deliverable:** a single PR against `main` with a complete, lint-clean, build-passing codebase under `apps/changi/` in this pnpm monorepo. Run via `pnpm install && pnpm dev:changi`.

**Monorepo alignment (required):** Follow the same conventions as `apps/squiz` and `apps/paytm`:
- Vite + React 19 + TypeScript + Tailwind v4 (CSS-first `@theme`)
- Depend on `@demo/ui` via `workspace:*`; re-export `cn` from `@demo/ui/cn`; show `<DemoRibbon />` in the header
- Scripts: `dev`, `build`, `lint`, `typecheck`, `test` (Vitest), optional `video` (Playwright)
- Wire root `package.json` with `dev:changi` / `build:changi`; update root `README.md` and `AGENTS.md`
- Default port **5176** (avoid colliding with kddi 5173 / squiz 5175)
- Package name: `changi-airport-demo`

## Company profile

- **Product:** Singapore Changi Airport traveller website — flight info, terminal guides, dine & shop, attractions, happenings, Changi Rewards, and the Changi App.
- **Primary users:** Arriving / departing / transiting passengers and visitors planning a trip through Changi (AU English locale clone).
- **Core surfaces to clone:** Home (persona hero + What’s Happening + destinations), Fly (flight info + guides), At Changi, Dine & Shop, Experience, Happenings, Rewards, Help, Login/Signup (Changi Account).
- **Dummy-data theme:** Realistic Singapore Changi flights (SQ/QF/BA/etc.), terminal facilities, dining outlets, Jewel attractions, Rewards catalogue items — never lorem ipsum.

## Repo context

- Repo: `demo-monorepo` (pnpm workspace)
- New app under `apps/changi/` — do not dump at repo root. Evolve alongside existing apps; do not delete other apps.

## Target tech stack

| Layer | Technology |
|-------|------------|
| Framework | Vite 6 + React 19 + React Router 7 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) + CSS variables |
| Components | Custom primitives + lucide-react icons |
| Shared | `@demo/ui` (`cn`, `DemoRibbon`) |
| Forms | react-hook-form + zod |
| State | React context + hooks |
| Data | Local JSON seed files + markdown content |
| Auth | Mock session via `localStorage` + route guards (SPA; cookie optional) |
| API | Optional Vite middleware / mock fetch against JSON; prefer client reads of seed data for SPA |
| Tests | Vitest + React Testing Library |
| Lint/format | ESLint + Prettier |

Explicitly DO NOT integrate real databases, Adobe Experience Manager, AppSync, Scene7 hotlinks in production UI (self-host downloaded assets), OAuth, or payment providers.

## Brand assets — source real files (do this first)

Before writing UI code, fetch and commit official brand assets so the app looks **exactly** like a Changi-branded product.

**Sources to try (in order):**
1. User-attached Changi wordmark + ribbon-sphere mark (preferred for header) — match `Logo_CAG_Horizontal_RGB_Pos.svg` from the live site
2. https://www.changiairport.com/content/dam/changiairport/sg/airport/evergreen/homepage/Logo_CAG_Horizontal_RGB_Pos.svg
3. https://www.changiairport.com/content/dam/changiairport/common/header/logo-light.png (light header variant)
4. Favicon / app icons from `/etc.clientlibs/changiairport/clientlibs/clientlib-site/resources/icon-*.png`
5. Footer App Store / Google Play SVGs and social icons under `/content/dam/changiairport/common/footer/`
6. Homepage campaign imagery under `/content/dam/changiairport/sg/airport/seasonal/...` and Scene7 destination stills (`changiairport.scene7.com/is/image/changiairport/01 Kyoto` etc.)

**Required files in `public/brand/`:**
- `logo.svg` — primary CAG horizontal logo (colour mark + CHANGI airport singapore wordmark) used in header
- `logo-light.png` — light/white header variant if useful
- `favicon.ico` / `favicon.png` — from official icon set
- `globe.svg`, `search.svg` — header chrome icons
- `app-store.svg`, `google-play.svg` — footer badges
- Campaign + destination images under `public/brand/happenings/` and `public/brand/destinations/`
- `brand-assets.json` — manifest with source URL + fetch date
- `scripts/fetch-brand-assets.sh` — idempotent curl script

**How to fetch (agent must execute, not skip):**
1. `curl -L` each asset into `apps/changi/public/brand/...`
2. Wire favicon + header `<img src="/brand/logo.svg">` — **no external hotlinks**
3. Match logo clear-space — do not recolor, rotate, or distort the logo
4. README disclaimer: unofficial demo, not affiliated; assets from public pages for visual fidelity only

## Design system — match the real UI

Mirror https://www.changiairport.com/au/en.html:

- **Typography:** Lato (self-host via `@fontsource/lato`) for UI; clean sans, generous tracking on section labels
- **Colours (from live CSS):**
  - Ink / body: `#222222`, `#121212`
  - Brand purple accent: `#7A35B0` (links, “we are flying to”, accents)
  - Soft sand hero panel: `#F3EFE9`
  - Surfaces: `#FFFFFF`, `#F7F7F7`, `#EBEBEB`
  - Muted: `#999999`, `#ABABAB`, `#454545`
  - Logo wordmark taupe: `#7D6A55`
  - Ribbon sphere gradient: yellow `#E1D200` → red `#EE3424` → purple `#6C217F`
  - Occasional green/gold accents: `#008545`, `#F7C651`
- **Header:** White sticky bar — top utility (Changi Sites: Airport / Corporate / Careers / CAI / Jewel / Now Boarding), primary nav mega-menus (Fly, At Changi, Dine & Shop, Experience, Happenings, Changi Rewards, App & Help), search, language, logo left
- **Hero:** “I AM” + persona dropdown (ARRIVING / DEPARTING / TRANSITING / VISITING) over sand `#F3EFE9` panel with QUICK LINKS cards that swap by persona
- **What’s Happening:** Horizontal cards (Outlet Deals, Fly with Changi Rewards x SIA, Peanuts campaign, Jewel Blooms LEGO)
- **Destinations:** “Explore cities we are flying to today” + View All + carousel of city cards
- **Footer:** Mega footer columns matching live site, app download, social, legal, © year Changi Airport
- **Cookie banner:** Soft modal/banner matching “Let’s give you the best experience possible”
- Motion: subtle fade-up on sections, carousel slide, persona panel crossfade (2–3 intentional motions)

Build reusable primitives: SiteHeader, SiteFooter, MegaMenu, PersonaHero, QuickLinks, HappeningCard, DestinationCarousel, PageHero, Breadcrumb, DataTable (flights), Badge, Button, Dialog/Sheet, EmptyState, LoadingSkeleton, CookieBanner, Toast.

## Application structure

Build a large, navigable codebase (~100–140 files) organized by feature:

```
apps/changi/
  public/brand/…
  scripts/fetch-brand-assets.sh
  src/
    App.tsx
    main.tsx
    index.css
    components/
      ui/ layout/ marketing/ fly/ rewards/ …
    pages/          # Home, Fly, Flights, AtChangi, DineShop, Experience, Happenings, Rewards, Help, Login, Signup, Account, Settings, NotFound, …
    data/           # nav, flights, happenings, destinations, outlets, rewards, quicklinks, users seed
    content/        # markdown for legal / guides
    lib/            # cn, auth, format, storage
    hooks/
    test/
  e2e/              # Playwright walkthrough + screenshots for CV review
```

## Pages — detailed requirements

### Marketing home (`/`)
Exact structure of AU homepage: header, I AM persona hero + quick links, What’s Happening, Explore cities carousel, footer, cookie banner. Copy should match live site closely.

### Section hubs
- `/fly` — Flight Information CTA, Arrival/Departure/Transit guides, Lounges, Airlines
- `/fly/flights` — Mock arrivals/departures table (filter by status, search flight no / city), 25+ rows
- `/at-changi` — Terminals, maps, transport, special assistance, Jewel
- `/dine-and-shop` — Dining + shopping category grids from seed JSON
- `/experience` — Attractions / art / nature / movie theatres teasers
- `/happenings` — Events + promotions listing
- `/rewards` — Benefits, catalogue teasers, Changi Monarch
- `/help` — Assistance, Changi App, contact
- `/pricing` not required — replace with Rewards value props if needed

### Auth
- `/login`, `/signup` — Changi Account forms; any credentials work in demo mode (muted hint). Persist mock session; redirect to `/account`
- `/account` — Profile summary, pinned flights (mock), Rewards points
- `/settings` — Account, profile, notification toggles persisted to localStorage/JSON

### Legal
- `/privacy`, `/terms` — markdown content with realistic Changi-style policy summaries (not copied verbatim legalese if uncertain — write faithful paraphrases and label as demo)

## Data layer
- Seed JSON: flights, destinations, happenings, outlets, rewards, quicklinks-by-persona, nav mega-menus, team/users
- Client-side reads; optional `localStorage` writes for settings / favourites / session
- No live network calls to changiairport.com at runtime

## Env vars (`.env.example`)
```
VITE_APP_NAME=Changi Airport
VITE_APP_URL=http://localhost:5176
DEMO_AUTH_SECRET=change-me
DEMO_ADMIN_EMAIL=traveller@example.com
DEMO_ADMIN_PASSWORD=demo
```

## Code quality
TypeScript strict, ESLint clean, build clean, accessible mega-menus (keyboard + Escape), responsive, no console errors on happy paths.

## Tests (minimum)
Vitest + RTL: `cn`/formatters, auth session encode/decode, PersonaHero direction switch, flights table filter, Header logo + nav, one data module shape test. Script `"test": "vitest run"`.

## Computer-vision / visual QA
After `pnpm --filter changi-airport-demo dev` is up, run Playwright (or equivalent) to capture full-page screenshots of `/`, `/fly/flights`, `/dine-and-shop`, `/login`. Commit screenshots under `apps/changi/shots/` (or `/opt/cursor/artifacts/`) and review them visually for layout/brand fidelity. Include shots in the PR body.

## README
Unofficial demo disclaimer, setup, demo credentials, structure, scripts, brand asset provenance.

## Implementation order
1. Fetch brand assets → `public/brand/` + fetch script  
2. Scaffold Vite app + wire monorepo  
3. Design tokens + global CSS + primitives  
4. Types, seed data, content  
5. Mock auth + route guards  
6. Header/footer with real logo  
7. **Homepage (match live AU page)**  
8. Remaining product screens  
9. Account/settings  
10. Auth pages  
11. Tests + Playwright shots  
12. README + lint/build/test + PR  

## PR requirements
Branch `cursor/changi-airport-demo-ae17` (cloud agent naming). Title: **feat: Changi Airport demo — landing, auth, and traveller hub**. Include Summary, fidelity notes vs https://www.changiairport.com/au/en.html, Test plan, Demo credentials, Known limitations, and embedded vision-test screenshots.

## Constraints
- No lorem ipsum — Changi/Singapore travel copy only
- No real secrets — strip any live API keys found in page source
- Prefer many small files over monoliths
- Commit incrementally; if blocked, decide, document, continue

**Success criteria:** `pnpm install && pnpm dev:changi`, open home and see official logo in header + persona hero + happenings + destinations matching the live site closely; log in with demo credentials; lint/build/test pass; PR includes CV screenshots.
