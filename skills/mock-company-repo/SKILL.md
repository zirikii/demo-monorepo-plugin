---
name: mock-company-repo
description: Research any company and generate a robust cloud-agent prompt that scaffolds a large, realistic mock/dummy repo mimicking that company's product, tech stack, and UI. On local runs it produces just the prompt; on cloud/background agent runs (or when asked to build) it generates the prompt and then immediately implements it end-to-end into a PR. Use when the user wants to spin up a demo clone of a company (e.g. "make a mock repo for <Company>"), generate a prompt for an overnight cloud agent run, or build a large look-alike codebase with dummy data for demos and codebase-exploration testing.
disable-model-invocation: true
---

# Mock Company Repo Prompt Generator

Generate a self-contained prompt that a cloud agent can run (often overnight) to scaffold a large, realistic look-alike app for a given company: marketing site, auth, and product dashboard, using dummy data and mock backends, ending in a PR.

This skill has **two modes**. By default (local/interactive runs) it produces **only a prompt file**. When it runs as a cloud/background agent — or when the user explicitly asks it to build — it generates the prompt and then **immediately executes it end-to-end** in the current repo, ending in a PR.

## Execution modes

Pick the mode at the start of the run and state which one you're in.

### Prompt-only mode (default)

Use for local/interactive runs where the user just wants the prompt. Research the company, write a single prompt file under `prompts/`, and hand off. **Do not** scaffold, build, or fetch assets.

### Generate-and-build mode

Use when **any** of these is true:
- You are running as a **cloud agent / background agent** (a headless run on its own branch that is expected to end in a PR). Treat this as the default trigger — the user set this skill up specifically so cloud runs build immediately.
- The user explicitly asks to "build it", "run the prompt", "implement it", "scaffold it", or similar.

In this mode:
1. **Still generate the prompt file first** (it is the source of truth and the spec you will follow) into `prompts/<slug>.md`.
2. Then **immediately implement everything in that generated prompt** in the current repo/branch — scaffold the app, fetch brand assets, build all screens, wire mock APIs, write tests, and open a PR.
3. Follow the generated prompt exactly as if you were the downstream agent it was written for. The "Do not build" restrictions below **do not apply** in this mode.
4. Do not stop after generating the prompt to ask for confirmation — the whole point of this mode is an unattended, end-to-end run. Only pause for a genuine blocker; otherwise make a reasonable decision, document it, and keep going.
5. **Monorepo placement:** if the current repo is a monorepo (e.g. it has an `apps/` workspace like this one), scaffold the new app under `apps/<slug>/` and wire it into the workspace (`pnpm-workspace.yaml`/root `package.json`) rather than dumping it at the repo root. If it's a standalone repo, build at the root as the prompt describes.

## Output scope (prompt-only mode)

These restrictions apply in **prompt-only mode**. In generate-and-build mode they are lifted (see above).

**Do:**
- Research the company (web search, screenshots, brand guidelines)
- Write a single prompt file under `prompts/` (see naming below)

**Do not:**
- `mkdir` an app project folder (e.g. `~/Projects/acme-demo/`)
- Initialize git, run `npm create`, or scaffold any app files
- Download logos or commit assets — describe asset-fetch steps **inside the prompt** for the downstream agent to run later
- Offer to "set up the starter repo" as part of this skill

### Where prompts live

All generated prompts are stored in:

```
skills/mock-company-repo/prompts/
```

Create this `prompts/` folder if it does not exist. In prompt-only mode this is the **only** directory this skill may create; in generate-and-build mode you also scaffold the app itself in the current repo.

### Prompt filename

Use a descriptive slug, not a generic `PROMPT.md`:

```
prompts/<slug>.md
```

Derive `<slug>` from the company or repo name — lowercase, hyphenated. Examples:
- `kddi-noc-dashboard.md`
- `heidi-health-demo.md`
- `linear.md`

If the user specifies a filename, use it inside `prompts/`. If a file with that slug already exists, ask before overwriting or append a version suffix (e.g. `linear-v2.md`).

## Inputs

Required:
- **Company name** (e.g. "Linear", "Ramp", "Notion")

Optional (ask only if it materially changes output, otherwise infer):
- Reference screenshot(s) of the real UI to match
- Specific product surface to focus on (e.g. dashboard, settings, inbox)
- Target tech stack override (otherwise mimic the company's real stack)
- Target repo state (new repo vs. evolve an existing starter)
- Size target (default: ~80–150+ files, "large enough to require cross-directory reading")

If a company name is missing, ask for it. Don't over-ask; pick reasonable defaults and note them.

## Workflow

### 1. Research the company

Use web search to build a profile. Search for:
- `<Company> tech stack frontend framework` (job posts and BuiltWith-style sites are gold)
- `<Company> product screenshots UI dashboard`
- `<Company> features` / what the product does and who uses it
- `<Company> brand colors logo` (and pull obvious cues from any provided screenshot)
- `<Company> brand guidelines logo download` / `<Company> visual identity assets`
- `<Company> site:company.com filetype:svg OR filetype:png logo` (surface CDN/asset URLs)

If a reference screenshot is provided, read it and extract layout, colors, typography, components, and key screens. The screenshot is the visual north star.

Prefer real signals (engineering job listings, public docs, the marketing site) over guesses. If the stack is unknown, default to **Next.js App Router + React + TypeScript + Tailwind + shadcn/ui** and say so.

### 1b. Research and source real brand assets

For every company, identify **downloadable brand assets** and bake explicit acquisition steps into the prompt. The goal is pixel-accurate branding — real logos, favicons, and fonts — not hand-drawn approximations.

**Source priority (best → fallback):**
1. **Official brand portal** — guidelines page with ZIP download (e.g. KDDI `kddi.com/brand/guideline-*`, Stripe press kit, Linear brand page)
2. **Company website CDN** — fetch the homepage or app login page, inspect `<img>`, `<link rel="icon">`, CSS `background-image`, and network requests for `.svg`, `.png`, `.webp` logo paths; `curl` them into the repo
3. **Official sub-brand / product sites** — e.g. Telehouse, au, KDDI BUSINESS if the demo references them
4. **Google Images** filtered to the company's domain — only as fallback; prefer SVG/PNG from `company.com` or their press/brand kit
5. **Never** use random third-party logo packs, Wikimedia substitutes, or AI-generated logos when a real asset is obtainable

**Assets to acquire (tailor per company):**
- Primary logo (color + white/reversed variants for dark headers)
- Favicon / app icon
- Sub-brand logos if the product uses them
- OG/social images only if useful for marketing pages
- Web fonts if publicly linked (e.g. Google Fonts, Adobe Fonts kit on their site — otherwise match with closest available)

**Commit in-repo** under `public/brand/` (or `src/assets/brand/` for Vite):
```
public/brand/
  logo.svg              # primary
  logo-white.svg        # for dark backgrounds
  logo-mark.svg         # icon-only if available
  favicon.ico
  telehouse-logo.svg    # sub-brands as needed
  brand-assets.json     # manifest: filename, source URL, fetched date
scripts/
  fetch-brand-assets.sh # curl/wget script reproducing the download
```

The implementing agent must **run the asset fetch as step 0** (before CSS/components), commit the files, and wire `<img src="/brand/logo.svg">` / `favicon` in layout. Do not hotlink external URLs in production UI — always self-host in `public/`.

Include a README note: unofficial demo, not affiliated; assets sourced from public brand pages for visual fidelity only.

### 2. Synthesize a profile

Capture, in 6–10 lines:
- What the product does + primary user persona
- Real (or best-guess) tech stack
- Core product surfaces to clone (3–6 screens)
- Visual language: layout, colors (hex), typography, component style
- **Brand assets to fetch:** logo URLs, brand guideline page, favicon, sub-brand marks, font families
- Realistic dummy-data theme (industry-appropriate names, not lorem ipsum)

### 3. Generate the prompt file

Write **one file only** to `skills/mock-company-repo/prompts/<slug>.md` using the template below, filled with researched specifics. Replace every `{{PLACEHOLDER}}`. The prompt must be standalone, robust, and unambiguous since it runs unattended.

Use the Write tool to create that file. Do not write prompts to the workspace root, app repos, or `~/Projects/` — only the skill's `prompts/` folder.

### 4. Hand off or build

**Prompt-only mode:** tell the user the saved path (e.g. `skills/mock-company-repo/prompts/kddi-noc-dashboard.md`) and how to run it downstream:
1. Create or open a target repo (user's job, not this skill's)
2. Copy the prompt file into that repo (as `PROMPT.md` or keep the slug name)
3. Attach any reference screenshot to the cloud-agent run
4. Point the cloud agent at the repo + branch with: *"Read PROMPT.md and implement everything described."*

Do not offer to scaffold the repo, commit for them, or create project folders unless they ask for that separately.

**Generate-and-build mode:** do not hand off — start building now.
1. Confirm the prompt file is written (it is your spec).
2. Create the feature branch `feat/{{REPO_NAME}}-demo`.
3. Implement the generated prompt end-to-end in the current repo, following its **Implementation order** exactly: fetch brand assets → install deps → design tokens → types/seed/content → mock auth + middleware → app shell → hero screen → remaining screens → settings → marketing/auth pages → API routes → tests → README.
4. Run lint, build, and tests until they pass.
5. Commit incrementally and open the PR described in the prompt's **PR requirements** (summary, fidelity notes, test plan, demo credentials, known limitations).
6. Report the branch name and PR link when done.

## Hard rules baked into every generated prompt

- **Dummy data only.** Local JSON seed files + markdown for content. No real external services, API keys, or paid providers (no real DB/auth/payments/CMS). Mock auth via signed cookie + middleware.
- **Look and feel first.** Match the real UI closely; use the screenshot as the visual north star when provided.
- **Real brand assets.** Download and commit official logos, favicons, and sub-brand marks from the company website or brand guidelines — self-host in `public/brand/`, never approximate with placeholder icons when real files are available.
- **Large codebase.** Many small focused files across `app/`, `components/`, `lib/`, `hooks/`, `content/`, `data/`. Aim for the size target so exploring it requires reading across directories.
- **Runnable + clean.** `npm install && npm run dev` works; lint, build, and tests pass.
- **Ends in a PR** on a feature branch with summary, test plan, demo credentials, and known limitations.
- **No scope-creep into real AI/ML/integrations** — simulate with timers, dummy text, and toggles.
- **Not affiliated** — the generated README must state it's an unofficial demo, not affiliated with the company.

## Prompt template

Fill placeholders, prune sections that don't apply to the company, and add company-specific screens. Keep it standalone.

````markdown
# Build {{COMPANY}} Demo — Full Landing, Auth, and Dashboard

## Mission

Scaffold a production-quality **{{COMPANY}} UI clone** for demo purposes that looks and feels like the real product{{REFERENCE_NOTE}}. This is a UI/UX fidelity demo, not a production app: dummy data, mock auth, local env vars, markdown/JSON persistence. No real external services.

**Deliverable:** a single PR against `main` with a complete, lint-clean, build-passing codebase that runs locally via `npm install && npm run dev`.

## Company profile

- **Product:** {{WHAT_IT_DOES}}
- **Primary users:** {{PERSONA}}
- **Core surfaces to clone:** {{CORE_SCREENS}}
- **Dummy-data theme:** {{DATA_THEME}}

## Repo context

- Repo: `{{REPO_NAME}}`
- {{REPO_STATE}}  <!-- e.g. "Bare Next.js starter — evolve it in place, do not delete and restart" or "New repo — scaffold from scratch" -->

## Target tech stack (mimic {{COMPANY}})

| Layer | Technology |
|-------|------------|
| Framework | {{FRAMEWORK}} |
| Styling | {{STYLING}} |
| Components | {{COMPONENTS}} |
| Icons | {{ICONS}} |
| Forms | react-hook-form + zod |
| Tables | @tanstack/react-table |
| State | React context + hooks |
| Data | Local JSON seed files + markdown content |
| Auth | Mock session via HTTP-only signed cookie + middleware |
| API | Route handlers reading/writing local files |
| Tests | Vitest + React Testing Library |
| Lint/format | ESLint + Prettier |

Explicitly DO NOT integrate real databases, cloud providers, CMS APIs, OAuth, or payment providers.

## Brand assets — source real files (do this first)

Before writing UI code, fetch and commit official brand assets so the app looks **exactly** like a {{COMPANY}}-branded product.

**Sources to try (in order):**
{{BRAND_ASSET_SOURCES}}  <!-- e.g. official brand guideline ZIP URL, homepage logo CDN paths, press kit -->

**Required files in `public/brand/`:**
{{BRAND_ASSET_LIST}}  <!-- e.g. logo.svg, logo-white.svg, favicon.ico -->

**How to fetch (agent must execute, not skip):**
1. Open the company homepage and brand guidelines page in a browser (or `curl -I` / `curl -o` for direct asset URLs).
2. Inspect page source and network requests for logo, favicon, and icon SVG/PNG paths.
3. Download each asset with `curl -L -o public/brand/<name> "<url>"`.
4. If the brand portal offers a ZIP (e.g. "Download logo data"), fetch and extract relevant SVG/PNG into `public/brand/`.
5. Write `public/brand/brand-assets.json` listing each file, original source URL, and fetch date.
6. Add `scripts/fetch-brand-assets.sh` that reproduces all downloads (idempotent).
7. Wire assets in `app/layout.tsx` / `index.html`: favicon, header `<img>`, login page logo. **No external hotlinks** — only `/brand/...` paths.
8. Match logo clear-space and colors per guidelines — do not recolor, rotate, or distort the logo.

Fallback: if a specific asset is behind a consent gate the agent cannot pass, document it in README and use the closest asset from the live website header — never invent a fake logo.

## Design system — match the real UI

{{DESIGN_NOTES}}  <!-- Layout, colors (hex), typography, component style. Reference the screenshot if provided. Use exact hex values from brand guidelines. -->

Build reusable primitives: AppShell, Sidebar/TopNav, PageHeader, DataTable, Badge, Button variants, Dialog/Sheet, EmptyState, LoadingSkeleton, Toast.

## Application structure

Build a large, navigable codebase (~{{SIZE_TARGET}} files) organized by feature:

```
app/
  (marketing)/            # landing, pricing, about
  login/  signup/
  (app)/                  # authenticated layout group
    {{PRODUCT_ROUTES}}
    settings/             # account, profile, team, integrations, ...
  api/                    # route handlers wired to JSON persistence
components/  ui/ layout/ marketing/ {{FEATURE_DIRS}}
lib/        auth/ data/ types/ utils/ constants/
hooks/
content/    landing/ legal/ {{CONTENT_DIRS}}
data/       *.json seed + runtime store
middleware.ts             # protect (app) routes
```

## Pages — detailed requirements

### Marketing landing (`/`)
Hero with headline + CTAs + product mock, logo bar, feature grid, how-it-works, testimonials, pricing teaser, footer. Original copy stored in `content/landing/*.md`. Responsive with mobile nav.

### Pricing (`/pricing`)
Tiered plans, comparison table, FAQ accordion, CTA → signup.

### Login / Signup
Centered card; any credentials work in demo mode (show a muted hint). Login sets mock cookie → redirect to the main product screen. Signup writes to `data/users.json` and auto-logs in.

### Dashboard shell (all `(app)` routes)
Persistent nav matching the real product. {{NAV_SPEC}}

### Core product screens
{{PRODUCT_SCREEN_SPECS}}  <!-- 3–6 screens with concrete UI + interactions, wired to JSON via API routes. Make the hero screen match the screenshot precisely. -->

### Settings screens
Account, Profile, Team (members table with roles/badges/pagination, add/remove via API + toasts), Integrations (connect/disconnect toggles persisted to JSON), plus any company-specific settings.

## Data layer
- Realistic dummy data themed as {{DATA_THEME}}: enough rows to exercise pagination/filtering (25+ where relevant).
- API routes read/write JSON via `fs/promises` (route handlers only); atomic writes (temp file + rename).
- Markdown content in `content/` with frontmatter; render legal/long-form via a markdown parser.

## Env vars (`.env.example`)
```
NEXT_PUBLIC_APP_NAME={{COMPANY}}
NEXT_PUBLIC_APP_URL=http://localhost:3000
DEMO_AUTH_SECRET=change-me
DEMO_ADMIN_EMAIL=admin@example.com
DEMO_ADMIN_PASSWORD=demo
```

## Auth (mock)
`middleware.ts` protects `(app)` routes; unauthenticated → `/login?redirect=...`. Session in signed HTTP-only cookie (HMAC/jose with `DEMO_AUTH_SECRET`). Logout clears cookie.

## Code quality
TypeScript strict (avoid `any`), ESLint clean, build clean, Prettier formatted, accessible (semantic HTML, aria labels, keyboard nav on dialogs/menus), responsive, no console errors on happy paths, comments only for non-obvious logic.

## Tests (minimum)
Vitest + RTL covering: formatters, auth token encode/decode, the hero table component (rows/badges/disabled states), nav active state, and one API route (GET/POST). Add `"test": "vitest run"` script.

## README
Replace default README: overview (unofficial demo, not affiliated with {{COMPANY}}), prerequisites, setup (`cp .env.example .env.local && npm install && npm run dev`), demo credentials, project structure tour, how JSON persistence works, scripts.

## Implementation order
1. **Fetch brand assets** → `public/brand/` + `scripts/fetch-brand-assets.sh`  2. Install deps  3. Design tokens + global CSS + component lib init (use exact brand hex)  4. Types, seed data, content  5. Mock auth + middleware  6. App shell + nav (real logo in header)  7. **Hero product screen (match screenshot)**  8. Remaining product screens  9. Settings  10. Marketing + auth pages  11. API routes wired to JSON  12. Tests  13. README + lint/build/test + PR.

## PR requirements
Branch `feat/{{REPO_NAME}}-demo`. Run lint, build, test — all pass. Open PR titled **feat: {{COMPANY}} demo — landing, auth, and dashboard** with: Summary, Screenshots/notes on fidelity, Test plan checklist, Demo credentials, Known limitations.

## Constraints
- No lorem ipsum — use realistic {{DATA_THEME}} copy.
- No real secrets in committed files.
- No real AI/integrations — simulate.
- Prefer many small files over monoliths.
- Commit incrementally; if blocked, make a reasonable decision, document it, and keep going — do not stop early.

**Success criteria:** `npm install && npm run dev`, log in with demo credentials, land on the dashboard, and see a UI that closely matches the real product{{REFERENCE_NOTE}} — including the **official logo and favicon** committed under `public/brand/`, not placeholders. The codebase is large enough that exploring it requires reading across multiple directories.
````

## Notes
- Choose the execution mode first (see **Execution modes**). Cloud/background agent runs default to generate-and-build; local/interactive runs default to prompt-only. State which mode you're in.
- Even in generate-and-build mode, always write the prompt file first — it is the spec you then implement, and it stays in the repo as a record of what was built.
- Keep the generated prompt standalone and decisive — it runs unattended.
- All prompt files live in `skills/mock-company-repo/prompts/` — never scatter them across app repos or the home directory.
- When a screenshot is provided, set `{{REFERENCE_NOTE}}` to reference its committed path and add an explicit visual-fidelity checklist for the hero screen.
- Tune `{{PRODUCT_ROUTES}}`, `{{PRODUCT_SCREEN_SPECS}}`, and `{{NAV_SPEC}}` to the actual product (e.g. an inbox app vs. an analytics dashboard vs. a CRM).
- Always populate `{{BRAND_ASSET_SOURCES}}` and `{{BRAND_ASSET_LIST}}` with company-specific URLs discovered during research — not generic placeholders.
- Add a visual-fidelity checklist item: "Official logo + favicon committed in `public/brand/`, rendered in header and browser tab."
