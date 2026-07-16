# Build SEEK Demo — Full Landing, Auth, and Candidate Dashboard

## Mission

Scaffold a production-quality **SEEK UI clone** for demo purposes that looks and feels like the real product at `https://au.seek.com/` — Australia's #1 jobs marketplace. This is a UI/UX fidelity demo, not a production app: dummy data, mock auth, local env vars, markdown/JSON persistence. No real external services.

**Deliverable:** a single PR against `main` with a complete, lint-clean, build-passing codebase that runs locally via `npm install && npm run dev`.

## Company profile

- **Product:** Online employment marketplace connecting job seekers ("candidates") with employers. Candidates search/filter jobs, save them, set up saved searches + alerts, build a profile/resume, and track applications. Employers post ads and review applicants. This demo focuses on the **candidate-facing** experience.
- **Primary users:** Australian/NZ job seekers (candidates); secondary persona is the hirer.
- **Core surfaces to clone:** Marketing home with the prominent keyword + "Where" location search bar; job search results (list + detail split view); job details view (JDV); saved jobs; saved searches + job alerts; candidate profile / resume builder; applied jobs tracker; recommended jobs dashboard; account settings.
- **Dummy-data theme:** Realistic AU/NZ job market — roles like "Registered Nurse", "Software Engineer", "Administration Assistant", "Construction Project Manager"; employers like "Bupa", "ANZ", "Optus", "CommBank", "Mercy Health" (clearly fictional stand-ins / not affiliated); AU locations (Sydney NSW, Melbourne VIC, Brisbane QLD, Perth WA), salary ranges in AUD, classifications like "Healthcare & Medical", "Information & Communication Technology", "Administration & Office Support".

## Repo context

- Repo: `seek-marketplace-demo`
- New repo — scaffold from scratch.

## Target tech stack (mimic SEEK)

SEEK's real stack is **React + TypeScript + GraphQL + Node.js on AWS**, with its own open-source **Braid Design System** (themeable React components styled via vanilla-extract). Faithfully recreating Braid is out of scope; instead reproduce SEEK's *look and feel* with a modern, conventional stack and Braid-inspired design tokens.

| Layer | Technology |
|-------|------------|
| Framework | Next.js (App Router) + React + TypeScript |
| Styling | Tailwind CSS with Braid-inspired design tokens (see Design system) |
| Components | shadcn/ui as primitives, restyled to match SEEK |
| Icons | lucide-react |
| Forms | react-hook-form + zod |
| Tables | @tanstack/react-table (applied jobs, alerts management) |
| State | React context + hooks |
| Data | Local JSON seed files + markdown content |
| Auth | Mock session via HTTP-only signed cookie + middleware |
| API | Route handlers reading/writing local files |
| Tests | Vitest + React Testing Library |
| Lint/format | ESLint + Prettier |

Explicitly DO NOT integrate real databases, cloud providers, GraphQL servers, OAuth, or payment providers. Do not attempt to install or vendor the real `braid-design-system` package — emulate its visual style with Tailwind tokens instead.

## Brand assets — source real files (do this first)

Before writing UI code, fetch and commit brand assets so the app looks **exactly** like a SEEK-branded product. SEEK's logo is a **pink lowercase/uppercase "SEEK" wordmark** (SEEK Pink `#E60278`).

**Sources to try (in order):**
1. Live site header: open `https://www.seek.com.au/` and `https://au.seek.com/`, inspect page source and network requests for the logo SVG and `<link rel="icon">` / favicon paths (e.g. `https://www.seek.com.au/favicon.ico`). Download with `curl -L -o`.
2. App login page (`https://www.seek.com.au/oauth/login/`) header logo.
3. SEEK's open-source repos on GitHub (`github.com/seek-oss`) for any brand/logo SVG marks usable as reference.
4. Fallback (most likely needed — SEEK's logos are license-restricted and not on a public CDN): **recreate the SEEK wordmark as a clean SVG** — the word "SEEK" in a bold geometric sans-serif, color `#E60278`, plus a white/reversed variant for dark backgrounds. Recreate a simple favicon (pink "S" or "SEEK" mark on white/transparent). Clearly note in `brand-assets.json` and README that these are recreated approximations for an unaffiliated demo.

**Required files in `public/brand/`:**
- `logo.svg` — primary pink "SEEK" wordmark
- `logo-white.svg` — reversed/white wordmark for dark (navy) headers/footers
- `logo-mark.svg` — icon-only "S" mark if derivable
- `favicon.ico` (and/or `icon.svg`) — browser tab icon
- `brand-assets.json` — manifest: filename, source URL (or "recreated"), fetched/created date, note

**How to fetch (agent must execute, not skip):**
1. `curl -I`/`curl -L -o` the favicon and any discoverable logo asset from the live site.
2. Inspect HTML/network for SVG logo paths; download what's publicly available.
3. If assets are gated/unavailable, generate the recreated SVG wordmark + favicon as described above.
4. Write `public/brand/brand-assets.json` listing each file, its source/origin, and date.
5. Add `scripts/fetch-brand-assets.sh` that reproduces all downloads (idempotent; documents which files are recreated vs fetched).
6. Wire assets in `app/layout.tsx`: favicon metadata, header `<img src="/brand/logo.svg">`, login page logo, footer white logo. **No external hotlinks** — only `/brand/...` paths.
7. Do not recolor, rotate, or distort the wordmark; keep clear-space around it.

## Design system — match the real UI (Braid-inspired)

Reproduce SEEK's clean, friendly, high-contrast look:

- **Colors (exact hex):**
  - SEEK Pink (primary/accent, CTAs, links, active states): `#E60278`
  - SEEK Navy (headers, footer, primary text on light): `#2E3849`
  - Neutral text: `#2E3849` for headings, softer grey `#505A6E`-ish for secondary
  - Backgrounds: white `#FFFFFF` page surfaces, light grey `#F4F4F6`/`#F8F8F9` section/app backgrounds, subtle card borders `#E4E5E7`
  - Tones (Braid-style): positive/success green, critical/error red, caution/amber, info/blue — define a small token set.
- **Typography:** clean humanist sans-serif. Use a close web font (e.g. Inter or similar via next/font) since SEEK's exact typeface isn't publicly distributable. Large, confident headings; comfortable body sizing.
- **Components/layout:** rounded corners (medium radius), generous spacing, prominent pink primary buttons with secondary outline buttons, card-based job listings, a sticky top nav, and SEEK's signature **dual search bar** ("Enter Keywords" + "Enter Suburb, City, or Region" with a pink Search button). Job result cards show title, employer, location, salary, classification, short teaser, posted time, and a Save flag.

Build reusable primitives: AppShell, TopNav, Footer, PageHeader, SearchBar (keyword + location), JobCard, JobList, JobDetailPanel, DataTable, Badge/Tag (tones), Button variants, Dialog/Sheet/Drawer, EmptyState, LoadingSkeleton, Toast, SaveFlag toggle.

## Application structure

Build a large, navigable codebase (~120+ files) organized by feature:

```
app/
  (marketing)/            # landing (/), for-employers teaser, career-advice
    page.tsx
    career-advice/
    companies/            # company profiles browse
  oauth/login/  oauth/register/   # mirror SEEK's /oauth/login route feel
  (app)/                  # authenticated candidate layout group
    dashboard/            # recommended jobs + activity overview
    jobs/                 # search results (list + detail split)
      [jobId]/            # job details view (JDV)
    saved-jobs/
    saved-searches/       # manage saved searches + alerts
    applied/              # applied jobs tracker (table)
    profile/              # candidate profile / resume builder
    settings/             # account, email prefs, notifications, privacy
  api/                    # route handlers wired to JSON persistence
components/  ui/ layout/ marketing/ jobs/ profile/ search/
lib/        auth/ data/ types/ utils/ constants/
hooks/
content/    landing/ legal/ career-advice/
data/       jobs.json employers.json users.json saved.json searches.json applications.json profile.json
middleware.ts             # protect (app) routes
```

## Pages — detailed requirements

### Marketing landing (`/`)
SEEK-style hero: navy/white top nav with pink logo, big headline ("Australia's no. 1 jobs site" style original copy), the prominent **dual search bar** (keyword + location + pink Search button), quick-search chips (classifications, major cities), a "Find your next employer" company logo grid, value props, career-advice teaser cards, and a footer with navy background + white logo and link columns. Original copy in `content/landing/*.md`. Fully responsive with mobile nav drawer.

### Auth (`/oauth/login`, `/oauth/register`)
Centered card with SEEK logo; any credentials work in demo mode (show a muted "demo mode — any email/password works" hint). Login sets the mock cookie → redirect to `/dashboard` (or `?redirect=`). Register writes to `data/users.json` and auto-logs in. Include "Why sign in?" supporting copy like the real site.

### Candidate dashboard (`/dashboard`)
The signed-in home: "Recommended jobs for you" feed (cards), recent activity summary (saved count, applied count, profile strength meter), saved searches quick links, and prompts to complete the profile. This is a **hero screen** — make it polished.

### Job search results (`/jobs`)
The signature SEEK split layout: left column of job result cards (paginated, 25+ results), right column = sticky **Job Details View** for the selected job. Top filters: classification, work type (Full time/Part time/Contract/Casual), salary range, date listed, location. Each card has a Save flag that toggles and persists. Selecting a card updates the detail panel (and `/jobs/[jobId]` deep-links work directly). Show result count ("1-22 of 134 jobs"). Make this match SEEK precisely.

### Job details view (`/jobs/[jobId]`)
Full ad: title, employer + logo, location, salary, work type, posted date, classification breadcrumb, Save + Quick Apply (pink) buttons, rich description (rendered markdown), "what's on offer" bullets, and similar jobs below. Quick Apply opens a mock application drawer that records to `data/applications.json` and moves the job into Applied.

### Saved jobs (`/saved-jobs`)
List of saved jobs with per-job private notes (textarea, persisted), Delete, and "Start Application". Empty state when none saved.

### Saved searches & alerts (`/saved-searches`)
Table of saved searches (keywords, location, filters) with alert frequency toggle (Off/Daily/Weekly), edit, and delete. "Create alert" flow. Persist to `data/searches.json`.

### Applied jobs (`/applied`)
@tanstack/react-table tracker: job, employer, date applied, status badge (Submitted/Viewed/Shortlisted/Unsuccessful), with sorting + pagination. 90-day note like the real product.

### Profile / resume builder (`/profile`)
SEEK-style profile: personal details, career history, education, skills tags, licences/credentials, role preferences (work types, locations, salary expectation), and a **profile strength** progress bar that fills as sections complete. Edits persist to `data/profile.json`. Drawer/overlay editing where it matches SEEK's pattern.

### Settings (`/settings`)
Account (email/password), Email preferences & notifications (toggles persisted), Privacy/visibility to recruiters toggle, and Sign out. Use forms + toasts.

## Data layer
- Realistic AU/NZ dummy data: 30+ jobs across multiple classifications, 12+ employers with logos (use simple generated SVG/letter-mark placeholders committed under `public/employers/`), users, saved items, searches, applications, and a seeded candidate profile.
- API routes read/write JSON via `fs/promises` (route handlers only); atomic writes (temp file + rename).
- Markdown content in `content/` with frontmatter for landing sections, career-advice articles, and legal pages; render via a markdown parser.

## Env vars (`.env.example`)
```
NEXT_PUBLIC_APP_NAME=SEEK
NEXT_PUBLIC_APP_URL=http://localhost:3000
DEMO_AUTH_SECRET=change-me
DEMO_ADMIN_EMAIL=candidate@example.com
DEMO_ADMIN_PASSWORD=demo
```

## Auth (mock)
`middleware.ts` protects `(app)` routes; unauthenticated → `/oauth/login?redirect=...`. Session in a signed HTTP-only cookie (HMAC via `jose` with `DEMO_AUTH_SECRET`). Logout clears the cookie.

## Code quality
TypeScript strict (avoid `any`), ESLint clean, build clean, Prettier formatted, accessible (semantic HTML, aria labels, keyboard nav on dialogs/menus/save flags), responsive (mobile-first; SEEK is heavily mobile-used), no console errors on happy paths. Comments only for non-obvious logic.

## Tests (minimum)
Vitest + RTL covering: salary/date formatters, auth token encode/decode, the JobCard component (save toggle, badges, salary display), search filter logic, nav active state, and one API route (GET jobs + POST save/apply). Add `"test": "vitest run"` script.

## README
Replace default README: overview (**unofficial demo, not affiliated with SEEK Limited**; brand assets recreated/used for visual fidelity only), prerequisites, setup (`cp .env.example .env.local && npm install && npm run dev`), demo credentials, project structure tour, how JSON persistence works, and available scripts.

## Implementation order
1. **Fetch/recreate brand assets** → `public/brand/` + `scripts/fetch-brand-assets.sh`  2. Install deps  3. Braid-inspired design tokens + Tailwind config + global CSS + shadcn init (exact SEEK hex)  4. Types, seed data (jobs/employers/etc.), content  5. Mock auth + middleware  6. App shell + top nav + footer (pink logo in header, white in footer)  7. **Job search results split view + Job Details View (hero)**  8. Candidate dashboard (hero)  9. Saved jobs, saved searches/alerts, applied tracker, profile builder  10. Settings  11. Marketing landing + auth pages  12. API routes wired to JSON  13. Tests  14. README + lint/build/test + PR.

## PR requirements
Branch `feat/seek-marketplace-demo`. Run lint, build, test — all pass. Open PR titled **feat: SEEK demo — landing, auth, and candidate dashboard** with: Summary, Screenshots/notes on fidelity (call out the dual search bar, split-view job results, and JDV), Test plan checklist, Demo credentials, Known limitations.

## Constraints
- No lorem ipsum — use realistic AU/NZ job-market copy.
- No real secrets in committed files.
- No real AI/integrations (SEEK touts "AI insights") — simulate with dummy text/toggles.
- Prefer many small files over monoliths.
- Commit incrementally; if blocked, make a reasonable decision, document it, and keep going — do not stop early.

**Success criteria:** `npm install && npm run dev`, log in with demo credentials, land on the candidate dashboard, search jobs and browse the split-view results + Job Details View, save a job and see it under Saved jobs — all in a UI that closely matches `https://au.seek.com/`, including SEEK Pink `#E60278` / Navy `#2E3849` theming and the **SEEK wordmark logo + favicon committed under `public/brand/`**, not generic placeholders. The codebase is large enough that exploring it requires reading across multiple directories.
