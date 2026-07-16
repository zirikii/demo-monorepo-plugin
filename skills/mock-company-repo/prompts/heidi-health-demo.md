# Build Heidi Health Demo — Full Landing, Auth, and Dashboard

## Mission

Transform the existing `heidi-health-demo` repository from a bare Next.js starter into a production-quality **Heidi Health UI clone** for demo purposes. The app must look and feel like the real Heidi product (see reference screenshot at `assets/image-f715bce6-ad56-4bf3-b242-199f743e7867.png` in the workspace).

This is a **UI/UX fidelity demo**, not a production app. Use dummy data, mock auth, local env vars, and markdown/JSON files for persistence. No real external services (no MongoDB, no AWS, no Sanity API, no Stripe).

**Deliverable:** A single PR against `main` with a complete, lint-clean, build-passing codebase that runs locally via `npm install && npm run dev`.

---

## Existing Repo Context

- Repo: `heidi-health-demo`
- Current stack: Next.js 15.5, React 19, TypeScript, Tailwind CSS v4, App Router
- Current state: placeholder `app/page.tsx` only
- Do NOT delete the repo and start over — evolve it in place

---

## Target Tech Stack (mimic Heidi Health)

Match Heidi's public-facing and product engineering stack as closely as practical:

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 App Router, React 19, TypeScript (strict) |
| Styling | Tailwind CSS v4, CSS variables for design tokens |
| Components | shadcn/ui (Radix UI primitives) — install via CLI |
| Icons | lucide-react |
| Forms | react-hook-form + zod |
| Tables | @tanstack/react-table |
| Fonts | Inter (or similar clean sans) via `next/font` |
| State | React context + hooks; no Redux |
| Data | Local JSON seed files + markdown content files |
| Auth | Mock session via HTTP-only cookie + middleware |
| API | Next.js Route Handlers (`app/api/...`) reading/writing local files |
| Tests | Vitest + React Testing Library (unit + component tests) |
| Lint/format | ESLint (existing), add Prettier config |

**Explicitly do NOT integrate:** MongoDB, AWS, Sanity CMS API, real OAuth, real payment providers, or any paid third-party service.

---

## Design System — Match the Screenshot

Study `assets/image-f715bce6-ad56-4bf3-b242-199f743e7867.png` and replicate this visual language across the entire app.

### Layout

- Fixed left sidebar (~240px), white/light gray background
- Main content: white card on very light gray (`#F9FAFB` / `#F7F7F4`-ish) canvas
- Rounded outer container feel; generous whitespace; subtle `border-gray-100` dividers
- App shell persists across all authenticated routes

### Colors

- Primary text: near-black charcoal (`#1a1a1a`)
- Secondary text: `text-gray-500` at ~60% opacity feel
- Active nav item: light blue pill background + blue text (e.g. `bg-blue-50 text-blue-700`)
- Primary CTA buttons: solid black (`bg-gray-900 text-white`)
- Destructive actions: red text links (`text-red-500`), not filled buttons
- Heidi logo: stylized lowercase "heidi" in blue/purple gradient or brand blue
- Disabled states: light gray text

### Typography

- Clean sans-serif (Inter)
- Page titles: `text-2xl font-semibold`
- Table headers: `text-sm font-medium text-gray-500`
- Body/table cells: `text-sm`

### Components to build (reusable)

- `AppShell` — sidebar + main layout
- `Sidebar` — collapsible Settings submenu, bottom links
- `PageHeader` — title + optional edit pencil + right-aligned actions
- `StatBar` — horizontal subscription summary (Pro tier / Total cost / Next payment / action)
- `DataTable` — sortable, paginated, with custom cell renderers (badges, inline buttons)
- `Badge` — Admin, Pro, Not registered, etc.
- `Button` variants — primary (black), secondary (outline), ghost, destructive link
- `Dialog` / `Sheet` — add team member, edit clinic name, confirm remove
- `EmptyState`, `LoadingSkeleton`, `Toast` notifications

---

## Application Structure

Build a **large, navigable codebase** (~80–150+ files) organized by feature. Aim for depth, not just page count.

```
app/
  (marketing)/
    page.tsx                    # Landing page
    pricing/page.tsx
    about/page.tsx
    careers/page.tsx
  login/page.tsx
  signup/page.tsx
  (app)/                        # Authenticated layout group
    layout.tsx                  # AppShell wrapper
    sessions/
      new/page.tsx              # New session (recording UI mock)
      page.tsx                  # Past sessions list
      [id]/page.tsx             # Session detail / note editor
    settings/
      account/page.tsx
      profile/page.tsx
      session-settings/page.tsx
      personalisation/page.tsx
      team/page.tsx             # MUST match screenshot closely
      integrations/page.tsx
    refer/page.tsx
    roadmap/page.tsx
  api/
    auth/login/route.ts
    auth/logout/route.ts
    auth/session/route.ts
    team/route.ts
    team/[id]/route.ts
    sessions/route.ts
    sessions/[id]/route.ts
    clinic/route.ts
    templates/route.ts
components/
  ui/                           # shadcn primitives
  layout/                       # AppShell, Sidebar, TopBar
  marketing/                    # Hero, FeatureGrid, Testimonials, Footer
  sessions/                     # SessionCard, TranscriptPanel, NoteEditor
  team/                         # TeamTable, AddMemberDialog, BillingBar
  settings/                     # SettingsNav, FormSections
lib/
  auth/                         # mock session helpers
  data/                         # seed loaders, file read/write
  types/                        # shared TypeScript types
  utils/                        # cn(), formatters, pagination
  constants/                    # nav items, specialties, tiers
hooks/
  use-team.ts, use-sessions.ts, use-clinic.ts, use-toast.ts
content/                        # Markdown content (not in DB)
  landing/                      # hero copy, feature descriptions
  legal/privacy.md, terms.md
  templates/                    # note template markdown files
data/                           # JSON seed + runtime mutation store
  team-members.json
  sessions.json
  clinic.json
  integrations.json
  users.json
middleware.ts                   # Protect /(app) routes
```

---

## Pages — Detailed Requirements

### 1. Marketing Landing Page (`/`)

Build a polished Heidi-style marketing site (inspired by heidihealth.com, but original copy):

- **Hero:** "The AI scribe for every clinician" headline, subtext, CTA buttons ("Start for free", "Watch demo"), product screenshot mock
- **Logo bar:** placeholder clinic/hospital logos (SVG placeholders)
- **Features grid:** 6 cards — ambient listening, note generation, templates, team collaboration, EHR integrations, compliance badges (HIPAA, SOC2, ISO 27001 as static badges)
- **How it works:** 3-step flow
- **Testimonials:** 3 quote cards with name, specialty, country
- **Pricing teaser:** link to `/pricing`
- **Footer:** Product, Company, Legal links; social icons
- All marketing copy stored in `content/landing/*.md` and loaded at build/render time
- Responsive: mobile hamburger nav, stacked sections

### 2. Pricing Page (`/pricing`)

- Free / Pro / Enterprise tiers
- Feature comparison table
- FAQ accordion
- CTA → `/signup`

### 3. Login (`/login`) and Signup (`/signup`)

- Centered card on light background
- Email + password fields (any credentials work in demo mode)
- Demo hint: "Use any email / password" shown in muted text
- On login: set mock session cookie, redirect to `/sessions/new`
- Signup: collect name, email, password, specialty dropdown → create entry in `data/users.json` → auto-login
- "Forgot password" link → static page saying demo mode

### 4. Dashboard Shell (all `(app)` routes)

**Sidebar navigation** (match screenshot exactly):

Top:

- heidi logo → `/sessions/new`
- **New session** (+ icon)
- **Past sessions** (user icon, expandable)
- **Settings** (gear icon, expandable submenu):
  - Account
  - Profile
  - Session settings
  - Personalisation
  - **Team** ← active state styling per screenshot
  - Integrations

Bottom (pinned):

- Refer a colleague
- Roadmap
- Log out

### 5. Team Page (`/settings/team`) — CRITICAL, match screenshot

This page is the visual north star. Replicate:

**Header:**

- "Opal's Vet Clinic" title with pencil edit icon (inline rename via dialog)
- "Do more with your team" outline button (opens help dialog with markdown content)
- "+ Add team member" black primary button (opens dialog: name, email, specialty, tier)

**Subscription bar:**

- Pro tier: 23 seats | Total cost: $2500/year | Next payment: 5th July 2024 | "Manage billing" button

**Table columns:** Name | Email address | Tier | Cost | Specialty | Actions

**Rows (seed from `data/team-members.json`):**

- Tom Kelly — Admin badge, admin@opalvets.com, Pro, $699/y, Veterinarian — disabled gray "Remove"
- Kate Bennett, Andrea Hoeg, etc. — active members with red "Remove" link
- 2 "Not registered" rows — "Resend invite" button next to email, "7 day free trial" in Cost column

**Pagination:** "Page 1 of 3" with prev/next arrows (functional pagination over seed data)

**Interactions:**

- Remove → confirm dialog → DELETE via API → toast
- Resend invite → toast "Invite resent"
- Add member → POST via API → append to JSON → refresh table
- Edit clinic name → PATCH `/api/clinic` → update `data/clinic.json`

### 6. New Session (`/sessions/new`)

Mock the core Heidi product experience:

- Patient name input, session type dropdown
- Large "Start session" button
- After start: fake waveform animation, timer, "Recording…" state
- Transcript panel fills with streamed dummy text (typewriter effect, no real mic)
- Right panel: generated SOAP note from `content/templates/soap-note.md` placeholder
- Toolbar: Pause, Stop, Generate note, Copy, Export
- Stop → saves session to `data/sessions.json` → redirect to session detail

### 7. Past Sessions (`/sessions`)

- Search/filter bar (by patient name, date, specialty)
- Session cards or table: date, patient, duration, note preview, status badge
- Click → `/sessions/[id]`

### 8. Session Detail (`/sessions/[id]`)

- Split view: transcript left, structured note right
- Editable note sections (Subjective, Objective, Assessment, Plan)
- "Regenerate section" button (swaps in alternate markdown snippet)
- Share / Export / Delete actions

### 9. Settings Pages (all functional UI, mock backends)

| Page | Key UI |
|------|--------|
| Account | Clinic name, timezone, language, delete account (confirm dialog) |
| Profile | Avatar placeholder, name, email, specialty, credentials |
| Session settings | Default note format, auto-start, consent banner toggle |
| Personalisation | Template library list, create/edit template (markdown editor textarea) |
| Integrations | Grid of EHR logos (Epic, Cerner, Best Practice, etc.) with Connected/Connect toggle states stored in JSON |

### 10. Refer a Colleague (`/refer`)

- Referral link copy field, email invite form, rewards explainer

### 11. Roadmap (`/roadmap`)

- Kanban-style or timeline of upcoming features loaded from `content/roadmap.md`

---

## Data Layer

### Seed files (`data/*.json`)

Create realistic veterinary clinic dummy data (Opal's Vet Clinic theme from screenshot). Include at least:

- 25 team members (for pagination)
- 15 past sessions with transcripts and notes
- 1 clinic config object
- 5 note templates
- 8 integrations with mixed connected/disconnected states

### Persistence

- API routes read/write JSON files on disk (use `fs/promises` in Route Handlers only)
- File writes should be atomic (write to temp file, rename)
- Add `.gitignore` entry for `data/*.local.json` if you want runtime mutations to not dirty git — OR commit seed data and accept mutations during dev (document choice in README)

### Markdown content (`content/`)

- Landing page sections as `.md` with frontmatter (title, order)
- Legal pages rendered via simple markdown parser (`react-markdown` or similar)
- Note templates as `.md` files

### Environment variables (`.env.example`)

```
NEXT_PUBLIC_APP_NAME=Heidi
NEXT_PUBLIC_APP_URL=http://localhost:3000
DEMO_AUTH_SECRET=change-me-in-production
DEMO_ADMIN_EMAIL=admin@opalvets.com
DEMO_ADMIN_PASSWORD=demo
```

---

## Auth (Mock)

- `middleware.ts` protects all routes under `/(app)`
- Unauthenticated → redirect to `/login?redirect=...`
- Login route validates against `data/users.json` OR accepts any email/password in demo mode (document behavior)
- Session stored in signed/HTTP-only cookie (use `jose` or simple HMAC with `DEMO_AUTH_SECRET`)
- Logout clears cookie → `/login`

---

## Code Quality Requirements

1. **TypeScript strict** — no `any` except where unavoidable; shared types in `lib/types/`
2. **ESLint clean** — `npm run lint` passes
3. **Build clean** — `npm run build` passes
4. **Prettier** — add `.prettierrc`, format all files
5. **Accessibility** — semantic HTML, aria labels on icon buttons, keyboard nav on dialogs/menus
6. **Responsive** — dashboard usable at 1280px+; marketing pages work on mobile
7. **No console errors** in happy path flows
8. **Comments** — only for non-obvious business logic; no noise

---

## Tests (minimum coverage)

Add Vitest + RTL. At least:

- `lib/utils/format.test.ts` — currency/date formatters
- `lib/auth/session.test.ts` — token encode/decode
- `components/team/TeamTable.test.tsx` — renders rows, admin badge, disabled remove
- `components/layout/Sidebar.test.tsx` — active state for Team nav item
- `app/api/team/route.test.ts` — GET returns members, POST adds member

Add `"test": "vitest run"` and `"test:watch": "vitest"` scripts.

---

## README

Replace the default README with:

1. Project overview (demo app, not affiliated with Heidi Health)
2. Prerequisites (Node 20+)
3. Setup: `cp .env.example .env.local && npm install && npm run dev`
4. Demo credentials
5. Project structure tour
6. How data persistence works (JSON files)
7. Scripts: dev, build, lint, test
8. Screenshot or note that Team page matches reference design

---

## PR Requirements

When complete:

1. Ensure all changes are committed on a branch named `feat/heidi-health-demo-full-app`
2. Run `npm run lint`, `npm run build`, and `npm run test` — all must pass
3. Open a PR against `main` with title: **feat: Heidi Health demo — landing, auth, and dashboard**
4. PR body must include:
   - ## Summary (3–5 bullets)
   - ## Screenshots (describe pages built; note Team page fidelity to reference)
   - ## Test plan (checklist of flows to verify locally)
   - ## Demo credentials
   - ## Known limitations (mock auth, file-based storage, no real AI)

---

## Implementation Order

Work in this sequence to de-risk the overnight run:

1. Install dependencies (shadcn, lucide, zod, rhf, tanstack table, vitest, etc.)
2. Design tokens + global CSS + shadcn init
3. Shared types, seed data, content markdown files
4. Mock auth + middleware
5. App shell (Sidebar, layout) — get navigation working first
6. **Team page** — match screenshot precisely before other settings pages
7. Sessions flow (new → list → detail)
8. Remaining settings pages
9. Marketing landing + pricing + login/signup
10. API routes wired to JSON persistence
11. Tests
12. README, .env.example, lint/build/test, PR

---

## Visual Fidelity Checklist (Team Page)

Before opening the PR, verify against `assets/image-f715bce6-ad56-4bf3-b242-199f743e7867.png`:

- [ ] Sidebar width, logo placement, and Settings submenu indentation match
- [ ] "Team" nav item has blue pill active state
- [ ] Header: clinic name + pencil, two right-aligned buttons with correct styles
- [ ] Subscription stat bar layout and "Manage billing" button placement
- [ ] Table column headers, row spacing, and border style
- [ ] "Admin" gray badge next to Tom Kelly
- [ ] Disabled gray "Remove" on admin row vs red "Remove" on others
- [ ] "Not registered" rows with "Resend invite" button and "7 day free trial"
- [ ] Pagination "Page 1 of 3" bottom-right

---

## Constraints

- Do not use placeholder lorem ipsum in UI — use realistic healthcare/veterinary copy
- Do not add real API keys or secrets to committed files
- Do not scope-creep into real AI/transcription — simulate with timers and dummy text
- Prefer many small focused files over monolithic components
- Match existing repo conventions (App Router, Tailwind v4 syntax)
- Commit incrementally with clear messages as you go
- If blocked, make a reasonable decision and document it in the PR — do not stop early

**Success criteria:** I can `git checkout feat/heidi-health-demo-full-app && npm install && npm run dev`, log in with demo credentials, land on the dashboard, navigate to Settings → Team, and see a UI that closely matches the reference screenshot. The codebase should be large enough that exploring it requires reading across multiple directories and layers.
