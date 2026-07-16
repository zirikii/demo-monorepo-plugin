# Build Naukri.com Demo — Full Landing, Auth, and Job-Seeker Dashboard

## Mission

Scaffold a production-quality **Naukri.com UI clone** for demo purposes that looks and feels like the real product (India's largest job portal). This is a UI/UX fidelity demo, not a production app: dummy data, mock auth, local env vars, markdown/JSON persistence. No real external services.

**Deliverable:** a single PR against `main` with a complete, lint-clean, build-passing codebase that runs locally via `npm install && npm run dev`.

## Company profile

- **Product:** Naukri.com (by Info Edge) is India's largest online job portal. It connects job seekers with recruiters: job search, personalized recommendations, profile/resume management, recruiter messages, profile performance analytics, and "Naukri 360" AI career tools (resume builder, interview prep).
- **Primary users:** Indian job seekers (freshers to experienced professionals) searching and applying for jobs, managing their profile, and tracking recruiter interest. Secondary: recruiters posting jobs and reviewing applies.
- **Core surfaces to clone:** Marketing home with the signature job-search hero, Search Results Page (SRP) with faceted filters, Job Description (JD) detail page, "My Naukri" dashboard, Profile editor, Recruiter Messages inbox, Applied/Saved jobs, and Settings / Job Preferences.
- **Dummy-data theme:** Indian job market — realistic Indian candidate names (e.g. Aarav Sharma, Priya Nair, Rohan Mehta), Indian employers (TCS, Infosys, Wipro, Flipkart, Zomato, Swiggy, Paytm, HDFC Bank, Reliance Jio, Tech Mahindra, Razorpay, Freshworks), Indian cities (Bengaluru, Mumbai, Delhi NCR, Hyderabad, Pune, Chennai, Gurugram, Noida), salaries in **₹ LPA**, experience in years, departments (Engineering – Software, Sales & BD, Finance, HR, Marketing), and tech/role skill tags (React, Java, Python, SQL, Node.js, AWS, etc.).

## Repo context

- Repo: `naukri-job-portal`
- New repo — scaffold from scratch. If a bare starter already exists, evolve it in place; do not delete and restart.

## Target tech stack (mimic Naukri's React + TypeScript stack)

Naukri's real frontend is a React + TypeScript micro-frontend platform (CRA/Webpack origins, Context API + useReducer for state, SCSS with a central theme, in-house component library, route-based code splitting). To match that component-driven, type-safe feel while keeping routing/auth/middleware clean for a demo, build on **Next.js App Router**.

| Layer | Technology |
|-------|------------|
| Framework | Next.js (App Router) + React + TypeScript (strict) |
| Styling | Tailwind CSS with a central theme of Naukri design tokens (CSS variables) |
| Components | shadcn/ui primitives + in-house reusable components |
| Icons | lucide-react |
| Forms | react-hook-form + zod |
| Tables | @tanstack/react-table |
| State | React context + hooks (useReducer where it mirrors Naukri's pattern) |
| Data | Local JSON seed files + markdown content |
| Auth | Mock session via HTTP-only signed cookie + middleware |
| API | Route handlers reading/writing local files |
| Tests | Vitest + React Testing Library |
| Lint/format | ESLint + Prettier |

Explicitly DO NOT integrate real databases, cloud providers, CMS APIs, OAuth, or payment providers.

## Brand assets — source real files (do this first)

Before writing UI code, fetch and commit official brand assets so the app looks **exactly** like a Naukri-branded product. Naukri refreshed its identity in 2024 to a modern, vibrant avatar: a lowercase geometric sans-serif **"naukri"** wordmark with a round dot on the "i", paired with a stylized human-figure mark in a blue circle.

**Sources to try (in order):**
1. **Naukri CDN (`static.naukimg.com`)** — inspect the live homepage source for the global-nav logo SVG (paths under `static.naukimg.com/s/.../naukri-identity/` or `.../i/naukri_Logo*.svg` / `naukri_gnb_logo.svg`). `curl` the SVG/PNG directly.
2. **Live homepage / login page** (`https://www.naukri.com/` and `https://www.naukri.com/nlogin/login`) — fetch HTML, grep `<img>`, `<link rel="icon">`, CSS `background-image`, and network requests for logo + favicon asset URLs on the `naukimg.com` CDN, then download them.
3. **seeklogo** (`https://seeklogo.com/vector-logo/616457/naukri`) and **logowik** (`https://logowik.com/naukri-logo-vector-78154.html`) — community vector SVG/PNG fallbacks.
4. **Wikimedia Commons** (`File:Naukri_Logo.png`) — last-resort raster fallback.

Prefer the SVG from the live CDN over any third-party copy. Never invent or AI-generate a fake logo.

**Required files in `public/brand/`:**
- `logo.svg` — primary full-color naukri wordmark + mark (for light header)
- `logo-white.svg` — reversed/white variant for dark or blue backgrounds
- `logo-mark.svg` — icon-only human-figure mark (for compact nav / app icon)
- `favicon.ico` — browser tab icon
- `brand-assets.json` — manifest: filename, source URL, fetched date

**How to fetch (agent must execute, not skip):**
1. `curl -I`/`curl -o` the homepage and login page; inspect source and network for logo, favicon, and icon SVG/PNG paths on `static.naukimg.com`.
2. Download each asset with `curl -L -o public/brand/<name> "<url>"`.
3. If only a PNG is available, also keep an SVG fallback from seeklogo/logowik.
4. Write `public/brand/brand-assets.json` listing each file, original source URL, and fetch date.
5. Add `scripts/fetch-brand-assets.sh` that reproduces all downloads (idempotent).
6. Wire assets in `app/layout.tsx`: favicon metadata, header `<img src="/brand/logo.svg">`, login page logo. **No external hotlinks** — only `/brand/...` paths.
7. Preserve logo clear-space and colors — do not recolor, rotate, or distort the wordmark.

Fallback: if a specific asset is behind a consent gate the agent cannot pass, document it in README and use the closest asset from the live website header — never invent a fake logo.

## Design system — match the real UI

Naukri's modern theme reads as clean, trustworthy, and information-dense, with a vibrant blue primary and soft blue/teal supporting tones on a light background. Reproduce these tokens (CSS variables in `globals.css`, wired into Tailwind):

- **Primary blue:** `#1875E5` (naukri blue) — primary buttons, links, active states, brand accents.
- **Primary hover/dark:** `#046C9A` / `#0F5BB5` for hover and emphasis.
- **Sky/teal accents:** `#0CADF3`, `#56C3E1` for highlights, info chips, illustrations.
- **Neutrals:** near-black text `#243C42`, secondary text/grey `#7A8484`, light borders `#E3E7EA`, page background `#F7F8FA`, card background `#FFFFFF`.
- **Status colors:** success green for "Applied", amber for "Action pending", subtle red for alerts; gold/amber stars for company/applicant ratings.
- **Typography:** clean sans-serif (use Inter or a close geometric sans as the closest available match); generous use of medium weights for headings, regular for body. Slightly rounded corners (6–8px) and soft shadows on cards.
- **Layout:** sticky top global nav with logo + search + nav links + profile menu; content-dense pages with left filter rails and central card lists (SRP); right-rail widgets on the dashboard.

Build reusable primitives: AppShell, GlobalNav (top bar with embedded search), Sidebar/FilterRail, PageHeader, JobCard, DataTable, Badge/Chip, StarRating, Button variants, Dialog/Sheet, EmptyState, LoadingSkeleton, Toast, ProfileCompletenessRing.

## Application structure

Build a large, navigable codebase (~120–160 files) organized by feature:

```
app/
  (marketing)/            # landing (/), about, employers teaser
    page.tsx
  login/  register/
  jobs/                   # public search + detail
    page.tsx              # SRP (search results)
    [slug]/page.tsx       # JD (job detail)
  (app)/                  # authenticated layout group ("My Naukri")
    dashboard/            # My Naukri home
    profile/              # profile view + edit sections
    applied/              # applied jobs + status
    saved/                # saved jobs
    messages/             # recruiter messages inbox
    recommendations/      # recommended jobs
    naukri-360/           # AI career tools (simulated)
    settings/             # job preferences, account, alerts, privacy
  api/                    # route handlers wired to JSON persistence
components/  ui/ layout/ marketing/ jobs/ profile/ dashboard/ messages/
lib/        auth/ data/ types/ utils/ constants/
hooks/
content/    landing/ legal/ help/
data/       *.json seed + runtime store
middleware.ts             # protect (app) routes
```

## Pages — detailed requirements

### Marketing landing (`/`)
Signature Naukri hero with a prominent **job-search bar**: keyword/designation/company input, an "Experience" dropdown (Fresher → 15+ years), and a "Location" input with a blue **Search** button. Below: trending/quick-search chips (e.g. "Remote", "MNC", "Engineering", "Fresher", "Work from home"), a logo bar of top companies hiring, a "Browse jobs by category" grid (department/role/location/skill), a Naukri 360 promo band, testimonials, and a footer with job-seeker + recruiter columns. Original copy in `content/landing/*.md`. Responsive with mobile nav and a collapsible search.

### Search Results Page (`/jobs`)
Core screen — make it precise. Left **filter rail** with collapsible facets: Experience, Salary (₹ LPA ranges), Location, Work mode (Remote/Hybrid/Office), Department/Role category, Industry, Company type, Education, Posted (last 1/3/7/15 days), Stipend/Freshness. Center **job card list**: each `JobCard` shows company logo, job title, company name with star rating, experience range, salary, location(s), a 1–2 line description snippet, key-skill tags/chips, "Posted N days ago / Just now", and **Save** + **Apply** actions. Sort dropdown (Relevance / Date), result count header, applied-filter chips with clear-all, and pagination. Filters update results client-side from JSON via API; reflect filter state in the URL query.

### Job Description page (`/jobs/[slug]`)
Full JD: title, company + rating, experience, salary, location, posted date, openings, applicants count, Apply + Save buttons (sticky on scroll). Sections: Job description (rich text from markdown), Role/Key responsibilities, Key skills (chips), Role details (Role, Industry type, Department, Employment type, Education), About company, and a "Similar jobs" rail. Apply opens a confirm dialog → writes to `data/applications.json` → toast + status reflected on `/applied`.

### Login / Register
Centered card with the Naukri logo; right side an illustration/value-prop panel (blue gradient). Any credentials work in demo mode (muted hint shown). Login sets the mock cookie → redirect to `/dashboard`. Register writes to `data/users.json` (name, email, experience, current location, key skills) and auto-logs in. Show the demo admin credentials hint.

### My Naukri dashboard (`/dashboard`)
The authenticated home. Left/main column: profile summary card with a **profile-completeness ring** + "Add missing details" prompts, a **Recommended jobs** carousel/list (reuse JobCard), and recent **recruiter actions**. Right rail widgets: **Profile performance** (search appearances, recruiter views, contact details viewed — with small counters/sparklines), Applied jobs status summary, and a Naukri 360 promo. Persistent global nav with the search bar and a profile dropdown.

### Profile (`/profile`)
View + inline-edit sections matching Naukri: Resume headline, Key skills, Employment (timeline), Education, Projects, Certifications, IT skills, Personal details, and Career profile (preferred location/industry/role/salary, notice period). Each section editable via Dialog/Sheet with react-hook-form + zod, persisting to `data/profile.json`. Show a completeness meter that updates as sections are filled.

### Applied jobs (`/applied`) & Saved jobs (`/saved`)
Tables/lists of applied jobs with status pipeline (Applied → Application viewed → Shortlisted → Not selected) using badges; saved jobs with quick Apply/Remove. Both backed by JSON via API.

### Recruiter Messages (`/messages`)
Inbox of recruiter messages: list of conversations (recruiter name, company logo, snippet, unread dot, timestamp) + a reading pane showing the full message (job invite / chat), with Reply (writes to JSON) and "View job" link. Mark-as-read updates state.

### Recommendations (`/recommendations`)
A fuller recommended-jobs page (filterable subset of the SRP scored against the user's profile preferences) with "Why recommended" hints.

### Naukri 360 (`/naukri-360`)
Simulated AI career tools landing: Resume Builder, Interview Prep, Career News/Insights, Coding practice — as cards. Each opens a simulated flow using timers + dummy generated text + toggles (no real AI). Clearly demo-only.

### Settings (`/settings`)
Tabs/sections: **Job Preferences** (desired roles, locations, industries, expected salary, work mode, availability to join), Account (email/password), Job Alerts (create/manage saved searches → JSON), Notifications, and Privacy (profile visibility to recruiters). All persisted via API with toasts.

## Data layer
- Realistic dummy data themed as the Indian job market: **40+ jobs** across departments/cities, **15+ companies** (with ratings + logos via initials/colored avatars if real logos aren't fetched), recommended-job scoring, applications, saved jobs, recruiter messages (10+), and a seeded user profile. Enough rows to exercise filtering/pagination (25+ where relevant).
- API routes read/write JSON via `fs/promises` (route handlers only); atomic writes (temp file + rename).
- Markdown content in `content/` with frontmatter; render legal/help/long-form via a markdown parser.

## Env vars (`.env.example`)
```
NEXT_PUBLIC_APP_NAME=Naukri
NEXT_PUBLIC_APP_URL=http://localhost:3000
DEMO_AUTH_SECRET=change-me
DEMO_ADMIN_EMAIL=admin@example.com
DEMO_ADMIN_PASSWORD=demo
```

## Auth (mock)
`middleware.ts` protects `(app)` routes; unauthenticated → `/login?redirect=...`. Session in a signed HTTP-only cookie (HMAC via `jose` with `DEMO_AUTH_SECRET`). Logout clears the cookie. Public routes: `/`, `/jobs`, `/jobs/[slug]`, `/login`, `/register`.

## Code quality
TypeScript strict (avoid `any`), ESLint clean, build clean, Prettier formatted, accessible (semantic HTML, aria labels, keyboard nav on dialogs/menus/filters), responsive (mobile filter drawer for SRP), no console errors on happy paths, comments only for non-obvious logic.

## Tests (minimum)
Vitest + RTL covering: formatters (salary ₹ LPA, "posted N days ago", experience range), auth token encode/decode, the `JobCard` component (title/rating/skills/save+apply states), SRP filter reducer (applying/clearing a facet narrows results), nav active state, and one API route (GET jobs with query filter + POST application). Add `"test": "vitest run"` script.

## README
Replace default README: overview (unofficial demo, **not affiliated with Naukri.com / Info Edge**), prerequisites, setup (`cp .env.example .env.local && npm install && npm run dev`), demo credentials, project structure tour, how JSON persistence works, brand-asset sourcing note (public assets for visual fidelity only), and scripts.

## Implementation order
1. **Fetch brand assets** → `public/brand/` + `scripts/fetch-brand-assets.sh`  2. Install deps  3. Design tokens + global CSS + component lib init (use exact brand hex: `#1875E5` primary)  4. Types, seed data (jobs/companies/profile/messages), content  5. Mock auth + middleware  6. App shell + GlobalNav with embedded search (real logo in header)  7. **SRP `/jobs` with filter rail + JobCard (hero screen — match the real layout)**  8. JD `/jobs/[slug]`  9. My Naukri dashboard + profile-performance widgets  10. Profile editor  11. Applied/Saved/Messages/Recommendations/Naukri 360  12. Settings  13. Marketing landing + auth pages  14. API routes wired to JSON  15. Tests  16. README + lint/build/test + PR.

## PR requirements
Branch `feat/naukri-job-portal-demo`. Run lint, build, test — all pass. Open PR titled **feat: Naukri demo — landing, auth, and job-seeker dashboard** with: Summary, Screenshots/notes on fidelity, Test plan checklist, Demo credentials, Known limitations.

## Constraints
- No lorem ipsum — use realistic Indian-job-market copy (₹ LPA salaries, Indian cities/companies/names).
- No real secrets in committed files.
- No real AI/integrations — simulate Naukri 360 with timers/dummy text/toggles.
- Prefer many small files over monoliths.
- Commit incrementally; if blocked, make a reasonable decision, document it, and keep going — do not stop early.

**Success criteria:** `npm install && npm run dev`, log in with demo credentials, land on the My Naukri dashboard, browse `/jobs` with working faceted filters and JobCards, open a JD and apply, and see a UI that closely matches the real Naukri product — including the **official logo and favicon** committed under `public/brand/`, not placeholders. The codebase is large enough that exploring it requires reading across multiple directories.
