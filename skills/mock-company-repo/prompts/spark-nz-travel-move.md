# Build Spark NZ Demo — Travel & Move Promo, Auth, and MySpark Dashboard

## Mission

Scaffold a production-quality **Spark NZ UI clone** focused on the **Travel & Move** promotions experience at `https://www.spark.co.nz/online/shop/promotions/travel-and-move`. Match that page’s content, layout rhythm, and brand language as closely as possible. This is a UI/UX fidelity demo, not a production app: dummy data, mock auth, local env vars, markdown/JSON persistence. No real external services.

**Deliverable:** a single PR against `main` with a complete, lint-clean, build-passing Next.js app under `apps/spark/` in this pnpm monorepo, runnable via `pnpm install && pnpm --filter spark-nz-demo dev` (or `pnpm dev:spark`).

## Company profile

- **Product:** Spark NZ is New Zealand’s major telco — mobile, broadband, prepaid travel SIMs, entertainment benefits, and the MySpark self-serve account portal.
- **Primary users:** Visitors to Aotearoa (≤90 days) shopping Travel Packs / eSIM; people moving to NZ who need Endless mobile + Fibre/Wireless broadband; existing customers managing MySpark.
- **Core surfaces to clone:** Travel & Move promo homepage (hero); Travel Packs plan cards; Moving to NZ mobile/broadband CTAs; marketing supporting pages; login/signup; MySpark dashboard (usage, plans, top-up, bills); account settings.
- **Dummy-data theme:** NZ places (Auckland, Wellington, Queenstown, Christchurch), NZD pricing, Travel Packs ($29/$49/$79/$129), Endless mobile from $45, Fibre/Wireless broadband, Opensignal #1 coverage claim, entertainment (Netflix/Spotify/NEON), Spark Arena / Parent Hub / Spark Foundation teasers.

## Repo context

- Repo: monorepo `demo-monorepo`
- Scaffold **`apps/spark/`** and wire into the workspace (`package.json` root scripts `dev:spark` / `build:spark`, `@demo/ui` dependency, update root `README.md` + `AGENTS.md`). Do not dump at repo root.
- Follow existing Next demo patterns from `apps/seek` and `apps/naukri` (transpilePackages `@demo/ui`, re-export `cn` from `@demo/ui/cn`, optional `DemoRibbon`).

## Target tech stack (mimic Spark SPA / modern React)

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v3 with Spark design tokens |
| Components | Lightweight custom primitives (Button, Accordion, Card, DataTable) — shadcn-style patterns OK |
| Icons | lucide-react |
| Forms | react-hook-form + zod |
| Tables | @tanstack/react-table (bills / top-ups history) |
| State | React context + hooks |
| Data | Local JSON seed files + markdown content |
| Auth | Mock session via HTTP-only signed cookie + middleware |
| API | Route handlers reading/writing local files |
| Tests | Vitest + React Testing Library |
| Lint/format | ESLint + Prettier |
| Shared | `@demo/ui` workspace package |

Explicitly DO NOT integrate real databases, cloud providers, CMS APIs, OAuth, Adobe AEM, or payment providers.

## Brand assets — source real files (do this first)

Before writing UI code, fetch and commit official brand assets.

**Sources to try (in order):**
1. Official logo SVG: `https://www.spark.co.nz/content/dam/sparkdigital/images/logo/purple.svg` (primary purple wordmark + spark mark, fill `#5F259F`)
2. White logo: `https://www.spark.co.nz/content/dam/sparkdigital/images/logo/white.svg`
3. Favicon: `https://www.spark.co.nz/favicon_128.png`
4. Photography / icons from the live Travel & Move AEM model (`*.model.json`), e.g.:
   - Hero: `/content/dam/spark/images/spark-photography/consumer/2025-collection/digital/friend-group-hanging-on-grass-1920x1280.jpg`
   - App CTA: `girls-on-phone-landscape-banner-asset.png`
   - Coverage tile: `network-coverage-tile-2025-desktop.png`
   - Helpful teasers + Why choose Spark lifestyle photos under `/content/dam/spark/images/spark-photography/...`
5. User-provided Spark NZ logo (purple starburst + “Spark NZ” wordmark) — if present in the run attachments, prefer it for the header; otherwise use the official `purple.svg` from spark.co.nz (same brand mark).

**Required files in `apps/spark/public/brand/`:**
- `logo.svg` — primary purple Spark logo (header)
- `logo-white.svg` — for dark footer / dark banners
- `logo-mark.svg` — spark-only mark if extractable (optional)
- `favicon.ico` / `favicon.png`
- Hero + section photography under `public/brand/photos/`
- Quick-link icons under `public/brand/icons/`
- `brand-assets.json` — manifest with source URLs + fetch date

**How to fetch (agent must execute, not skip):**
1. `curl -L -o` each asset from spark.co.nz.
2. Write `scripts/fetch-brand-assets.sh` (idempotent).
3. Wire favicon + header `<img src="/brand/logo.svg">` — **no external hotlinks**.
4. Match clear-space; do not recolor/distort the logo.

Fonts: Spark uses **Avenir Next** (not freely redistributable). Use **Nunito Sans** or **Montserrat** via `next/font` as a close geometric/humanist substitute and note the substitution in README.

## Design system — match the real UI

Spark consumer site cues (from live CSS + brand):

- **Primary purple:** `#5F259F`
- **Accent pink:** `#EC008C`
- **Accent orange:** `#FF9B00`
- **Accent green:** `#00AF55`
- **Black / near-black:** `#000000` / `#1A1A1A` (New Zealand Black)
- **White / off-white surfaces:** `#FFFFFF`, light grey sections `#F5F5F5` / `#F0F0F0`
- **Theme color meta:** `#000000`
- Full-bleed hero photography with dark gradient overlay and **light text**
- Sticky white header with purple logo left; nav links (Shop, Help, Benefits, MySpark); cart/search icons
- Quick-link icon grid under hero
- Large section titles, purple primary CTAs, generous whitespace
- Footer: dark/black with white logo + utility links

Build reusable primitives: `SiteHeader`, `SiteFooter`, `HeroBanner`, `QuickLinkGrid`, `PromoSection`, `TeaserCard`, `PlanCard`, `Accordion`, `Button`, `PageHeader`, `AppShell` (MySpark), `DataTable`, `Badge`, `EmptyState`, `LoadingSkeleton`, `Toast`.

### Visual-fidelity checklist (Travel & Move `/`)

- [ ] Official logo + favicon in `public/brand/`, rendered in header and browser tab
- [ ] Hero: **Travelling to New Zealand** + supporting sentence about visiting or staying + friend-group grass photo background
- [ ] Quick links: Mobile Travel Packs, Mobile plans, Broadband plans, Mobile phones, Deals, MySpark
- [ ] **Travel packs for visitors** copy + “View Mobile Travel Packs” CTA + international footnote
- [ ] **Moving to New Zealand?** with Endless mobile + Broadband columns + CTAs
- [ ] Download the Spark app band
- [ ] #1 mobile network coverage in NZ* teaser (Opensignal Oct 2025)
- [ ] Helpful things to know: Setting up / Spark Arena / Spark store / Tech & accessories
- [ ] Why choose Spark: Entertainment / Spark Foundation / Parent Hub
- [ ] Demo ribbon marking unofficial demo

## Application structure

Build a large, navigable codebase (~90–130 files):

```
apps/spark/
  app/
    (marketing)/
      page.tsx                          # Travel & Move (hero screen)
      travel-packs/page.tsx
      mobile-plans/page.tsx
      broadband/page.tsx
      phones/page.tsx
      deals/page.tsx
      entertainment/page.tsx
      parent-hub/page.tsx
      foundation/page.tsx
      pricing/page.tsx                  # optional teaser
    login/  signup/
    (myspark)/                          # authenticated
      layout.tsx
      dashboard/page.tsx
      usage/page.tsx
      plans/page.tsx
      top-up/page.tsx
      bills/page.tsx
      settings/
        page.tsx  account/  profile/  team/  integrations/
    api/  auth/  travel-packs/  plans/  bills/  top-up/  users/  settings/
  components/  ui/ layout/ marketing/ myspark/ plans/
  lib/  auth/ data/ types/ utils/ constants/
  hooks/
  content/  landing/ legal/
  data/  *.json
  middleware.ts
  public/brand/
  scripts/fetch-brand-assets.sh
```

## Pages — detailed requirements

### Travel & Move landing (`/`) — **hero fidelity screen**
Reproduce the live promo page structure and copy (from AEM model “Travel homepage”):

1. Hero banner — title **Travelling to New Zealand**; description **Whether you're visiting Aotearoa (New Zealand) or are planning to stay, stay connected with our mobile and broadband plans.**
2. Quick link cards (6)
3. Travel packs for visitors — full prepaid/eSIM copy from live site; CTA → `/travel-packs`
4. Moving to New Zealand? — Endless mobile + Broadband columns
5. Download Spark app CTA band
6. Coverage #1 teaser
7. Helpful things to know (4 teasers)
8. Why choose Spark (Entertainment, Foundation, Parent Hub)
9. Footer

Original copy in `content/landing/*.md` as well as typed constants for the page.

### Travel Packs (`/travel-packs`)
Plan cards matching NZ Travel Packs:
| Price | Data | Talk | Text |
|------|------|------|------|
| $29 | 2GB | 200 NZ / 100 Int’l | 200 NZ / 100 Int’l |
| $49 | 10GB | 200 NZ / 200 Int’l | 200 NZ / 200 Int’l |
| $79 | 50GB | Unlimited NZ / 200 Int’l | Unlimited NZ / 200 Int’l |
| $129 | Endless (speed reduced after 100GB) | Unlimited NZ / 300 Int’l | Unlimited NZ / 300 Int’l |

Each: “Plan lasts for three months”, Physical Trio SIM or eSIM, Free Hotspot, Click & collect (demo). FAQ accordion (how packs work, run out, expire, standard rates, Endless Q&A, terms). Seed in `data/travel-packs.json`.

### Supporting marketing
Mobile plans, broadband address-check tease, phones grid, deals, entertainment, foundation, parent-hub — realistic NZD dummy content, not lorem.

### Login / Signup
Centered card; any credentials work; muted demo hint. Cookie session → `/dashboard`. Signup writes `data/users.json`.

### MySpark shell
Left or top nav: Dashboard, Usage, Plans, Top up, Bills, Settings. Use white logo on purple accent bar optional; primary logo in header. Protect with middleware.

### Settings
Account, Profile, Team (members table + roles), Integrations toggles persisted to JSON.

## Data layer
- `data/travel-packs.json`, `plans.json`, `bills.json`, `top-ups.json`, `users.json`, `settings.json`, `stores.json` (25+ stores for finder demo)
- API routes via `fs/promises` + atomic writes
- Markdown in `content/` with frontmatter

## Env vars (`.env.example`)
```
NEXT_PUBLIC_APP_NAME=Spark NZ
NEXT_PUBLIC_APP_URL=http://localhost:3000
DEMO_AUTH_SECRET=change-me
DEMO_ADMIN_EMAIL=admin@spark-demo.nz
DEMO_ADMIN_PASSWORD=demo
```

## Auth (mock)
`middleware.ts` protects `(myspark)` routes; unauthenticated → `/login?redirect=...`. Signed HTTP-only cookie (jose/HMAC with `DEMO_AUTH_SECRET`). Logout clears cookie.

## Monorepo alignment
- Package name: `spark-nz-demo`
- Depend on `@demo/ui` (`workspace:*`); re-export `cn` from `@demo/ui/cn`; `transpilePackages: ["@demo/ui"]`
- Show `<DemoRibbon />` in header
- Root `package.json`: `"dev:spark"`, `"build:spark"`
- Update root `README.md` and `AGENTS.md` (port 3000 note — use `PORT=3002` if colliding)
- App `README.md`: unofficial demo disclaimer

## Code quality
TypeScript strict, ESLint clean, build clean, accessible, responsive, no console errors on happy paths.

## Tests (minimum)
Vitest + RTL: formatters (NZD), auth encode/decode, TravelPackCard / plan table, nav active state, one API route GET/POST. Script `"test": "vitest run"`.

## README
Unofficial demo / not affiliated with Spark NZ; setup; demo credentials; structure; JSON persistence; brand asset sources; font substitution note.

## Implementation order
1. Fetch brand assets → `public/brand/` + `scripts/fetch-brand-assets.sh`
2. Install deps / wire monorepo
3. Design tokens + global CSS + primitives
4. Types, seed data, content
5. Mock auth + middleware
6. Site header/footer with real logo
7. **Travel & Move landing (match live page)**
8. Travel packs + supporting marketing pages
9. MySpark dashboard + settings
10. Auth pages
11. API routes
12. Tests
13. README + lint/build/test + PR + computer-vision screenshots of key screens

## PR requirements
Branch `cursor/spark-nz-travel-move-906e`. Title: **feat: Spark NZ demo — Travel & Move, auth, and MySpark**. Include Summary, fidelity notes, Test plan, Demo credentials, Known limitations. Attach or link CV testing screenshots under artifacts.

## Constraints
- No lorem ipsum — use realistic NZ telco copy from the live page where known.
- No real secrets.
- No real payments / AEM / analytics — simulate.
- Prefer many small files.
- Commit incrementally; if blocked, decide, document, continue.

**Success criteria:** `pnpm --filter spark-nz-demo dev`, open `/`, see Travel & Move UI with official Spark logo, browse Travel Packs, log in to MySpark, tests/lint/build pass.
