---
name: mock-company-repo
description: Research a company and scaffold a realistic look-alike demo into demo-monorepo — generate a build prompt, implement the app, verify with computer-use screen recording, and open a PR. Use when the user wants a mock/demo clone of a company product (e.g. "/mock-company-repo for Optus" or "make a mock repo for Linear").
disable-model-invocation: true
---

# Mock Company Repo

Team workflow for spinning up a large, realistic company look-alike demo in **demo-monorepo**:

1. Research the company and write a self-contained build prompt
2. Scaffold the app under `apps/<slug>/` (monorepo) with dummy data and mock backends
3. **Verify with computer use** — run the app, walk key flows in a real browser, and **record a screen video** of that testing
4. Open a **PR** in demo-monorepo that includes the app, test plan, demo credentials, and the verification recording / screenshots

This skill has **two modes**. Cloud/background agent runs (and explicit "build it" requests) use **generate-and-build**. Local/interactive runs that only ask for a prompt use **prompt-only**.

## Execution modes

Pick the mode at the start of the run and state which one you're in.

### Prompt-only mode

Use for local/interactive runs where the user only wants the prompt file. Research the company, write a single prompt under `prompts/`, and hand off. **Do not** scaffold, build, fetch assets, or open a PR.

### Generate-and-build mode (default for cloud / background agents)

Use when **any** of these is true:
- You are running as a **cloud agent / background agent** (headless run expected to end in a PR).
- The user explicitly asks to "build it", "run the prompt", "implement it", "scaffold it", or similar.

In this mode:
1. **Still generate the prompt file first** into `skills/mock-company-repo/prompts/<slug>.md` — it is the source of truth for the build.
2. **Immediately implement** that prompt in the target repo (demo-monorepo when present): scaffold the app, fetch brand assets, build screens, wire mock APIs, write tests.
3. **Computer-use verification (required):** start the app, use computer-use / browser automation to exercise the happy path (landing → login → primary product screen → at least one interaction), and **record a screen video** of that session. Capture a few still screenshots of key surfaces as well. Attach or link these artifacts in the PR body.
4. Open a **PR** in demo-monorepo with summary, fidelity notes, test plan, demo credentials, known limitations, and the verification recording/screenshots.
5. Do not stop after writing the prompt to ask for confirmation — unattended end-to-end is the point. Only pause for a genuine blocker; otherwise decide, document, and continue.
6. **Monorepo placement:** if the workspace includes demo-monorepo (`apps/` + `pnpm-workspace.yaml`), scaffold under `apps/<slug>/` and wire root scripts/`README`/`AGENTS.md`. Do not dump a new app at the monorepo root. Standalone repos may build at the root as the prompt describes.

## Output scope (prompt-only mode)

**Do:**
- Research the company (web search, screenshots, brand guidelines)
- Write a single prompt file under `prompts/` (see naming below)

**Do not:**
- Scaffold app files, fetch logos into an app tree, or open a PR
- Commit historical example prompts back into this plugin as permanent fixtures
- Offer to "set up the starter repo" unless the user asked for generate-and-build

### Where prompts live

```
skills/mock-company-repo/prompts/<slug>.md
```

Create the folder if needed. Generated prompts are **ephemeral build specs** for a run — this plugin repo does not keep a library of past company prompts. Prefer writing the prompt for the current company only; do not re-accumulate unrelated historical prompts under `prompts/`.

### Prompt filename

Descriptive slug, lowercase, hyphenated — e.g. `optus-demo.md`, `linear.md`. If the user specifies a name, use it. If the file already exists for a *different* company, use a version suffix (`linear-v2.md`) rather than overwriting blindly.

## Inputs

Required:
- **Company name** (e.g. "Linear", "Ramp", "Optus")

Optional (ask only if it materially changes output, otherwise infer):
- Reference screenshot(s) of the real UI to match
- Specific product surface to focus on (dashboard, settings, inbox, …)
- Tech stack override (otherwise mimic the company's real stack / monorepo peers)
- Size target (default: ~80–150+ files)

If the company name is missing, ask for it. Don't over-ask.

## Workflow

### 1. Research the company

Search for tech stack, product screenshots, features, brand colors/logo, brand guidelines / press kit, and CDN logo asset URLs. Prefer job posts, public docs, and the marketing site over guesses. If the stack is unknown, default to **Next.js App Router + React + TypeScript + Tailwind + shadcn/ui** (or match neighboring Vite apps when targeting this monorepo).

If a reference screenshot is provided, treat it as the visual north star.

### 1b. Brand assets

Identify downloadable official logos, favicons, and sub-brand marks. Bake fetch steps into the prompt. Priority: official brand portal → company CDN → sub-brand sites → domain-filtered images. **Never** invent logos or use random third-party packs when a real asset is obtainable.

Commit assets under the app's `public/brand/` (or `src/assets/brand/` for Vite) with `brand-assets.json` and `scripts/fetch-brand-assets.sh`. Self-host only — no external hotlinks in the UI.

### 2. Synthesize a profile

6–10 lines: product + persona, stack, 3–6 core screens, visual language (hex + type), brand asset URLs, dummy-data theme (industry-real names, not lorem).

### 3. Generate the prompt file

Write **one** file to `skills/mock-company-repo/prompts/<slug>.md` from the template below. Replace every `{{PLACEHOLDER}}`. The prompt must be standalone and unambiguous for an unattended agent.

### 4. Hand off or build

**Prompt-only:** report the saved path and how to run it downstream (attach screenshots; tell the cloud agent to read the prompt and implement everything).

**Generate-and-build:**
1. Confirm the prompt file is written (it is your spec).
2. Create a feature branch for the demo (e.g. `feat/{{REPO_NAME}}-demo` or the cloud-agent branch already checked out).
3. Implement the prompt end-to-end: brand assets → deps → tokens → seed/content → mock auth → shell → hero screen → remaining screens → settings → marketing/auth → API → unit tests → README.
4. Run lint, build, and unit tests until they pass.
5. **Computer-use verification (do not skip):**
   - Start the app (`pnpm dev:<slug>` / `npm run dev`).
   - Use the **computerUse** subagent (or equivalent browser + `RecordScreen`) to exercise: landing, login with demo credentials, primary product surface, and one meaningful interaction (create/filter/navigate).
   - **Start a screen recording before the walkthrough; save it** when done (e.g. under artifacts with a clear name like `{{slug}}-computer-use-verify`).
   - Take still screenshots of the hero/product screens for the PR.
   - If computer use fails for environment reasons, document why in the PR and still attach whatever screenshots you could capture — do not silently skip verification.
6. Commit, push, and open/update the **PR** with Summary, fidelity notes, computer-use verification notes + recording/screenshots, test plan, demo credentials, known limitations.
7. Report branch name and PR URL when done.

## Hard rules baked into every generated prompt

- **Dummy data only** — local JSON + markdown; mock auth; no real DB/OAuth/payments/CMS.
- **Look and feel first** — match the real product; screenshot is the north star when provided.
- **Real brand assets** — self-hosted under `public/brand/`.
- **Large codebase** — many small files across feature dirs (~size target).
- **Runnable + clean** — install/dev works; lint, build, unit tests pass.
- **Computer-use verified** — recorded browser walkthrough of happy path before PR is "done".
- **Ends in a PR** — summary, verification artifacts, test plan, demo credentials, limitations.
- **No real AI/ML/integrations** — simulate with timers, dummy text, toggles.
- **Not affiliated** — README must say unofficial demo.

## Prompt template

Fill placeholders, prune sections that don't apply, add company-specific screens. Keep it standalone.

````markdown
# Build {{COMPANY}} Demo — Full Landing, Auth, and Dashboard

## Mission

Scaffold a production-quality **{{COMPANY}} UI clone** for demo purposes that looks and feels like the real product{{REFERENCE_NOTE}}. Dummy data, mock auth, local env vars, markdown/JSON persistence. No real external services.

**Deliverable:** a single PR against `main` (in demo-monorepo when applicable) with:
1. A complete, lint-clean, build-passing app
2. A **computer-use screen recording** of testing the running app (plus key screenshots)
3. PR description covering summary, fidelity, verification, test plan, demo credentials, and limitations

## Company profile

- **Product:** {{WHAT_IT_DOES}}
- **Primary users:** {{PERSONA}}
- **Core surfaces to clone:** {{CORE_SCREENS}}
- **Dummy-data theme:** {{DATA_THEME}}

## Repo context

- Repo: `{{REPO_NAME}}`
- {{REPO_STATE}}

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
| Auth | Mock session via HTTP-only signed cookie + middleware (or SPA equivalent) |
| API | Route handlers / local modules reading/writing JSON |
| Tests | Vitest + React Testing Library |
| Lint/format | ESLint + Prettier |

Explicitly DO NOT integrate real databases, cloud providers, CMS APIs, OAuth, or payment providers.

## Brand assets — source real files (do this first)

**Sources to try (in order):**
{{BRAND_ASSET_SOURCES}}

**Required files in `public/brand/`:**
{{BRAND_ASSET_LIST}}

Fetch with curl into `public/brand/`, write `brand-assets.json`, add `scripts/fetch-brand-assets.sh`, wire favicon + header logo. No external hotlinks. Never invent a fake logo.

## Design system — match the real UI

{{DESIGN_NOTES}}

Build reusable primitives: AppShell, Sidebar/TopNav, PageHeader, DataTable, Badge, Button variants, Dialog/Sheet, EmptyState, LoadingSkeleton, Toast.

## Application structure

Build a large, navigable codebase (~{{SIZE_TARGET}} files) organized by feature under the app root (`apps/<slug>/` in a monorepo):

```
app/ or src/
  (marketing)/ login/ signup/ (app)/ {{PRODUCT_ROUTES}} settings/
  api/
components/  ui/ layout/ marketing/ {{FEATURE_DIRS}}
lib/ hooks/ content/ data/
```

## Pages — detailed requirements

### Marketing landing (`/`)
Hero, CTAs, product mock, logo bar, feature grid, how-it-works, testimonials, pricing teaser, footer. Copy in `content/landing/*.md`. Responsive.

### Pricing (`/pricing`)
Tiers, comparison, FAQ, CTA → signup.

### Login / Signup
Demo mode: any credentials work (muted hint). Login → main product screen. Signup persists to `data/users.json` and auto-logs in.

### Dashboard shell
Persistent nav matching the real product. {{NAV_SPEC}}

### Core product screens
{{PRODUCT_SCREEN_SPECS}}

### Settings
Account, Profile, Team, Integrations (toggles persisted to JSON), plus company-specific settings.

## Data layer
Realistic {{DATA_THEME}} dummy data (25+ rows where pagination matters). Atomic JSON writes from route handlers / server-only modules. Markdown content with frontmatter.

## Env vars (`.env.example`)
```
NEXT_PUBLIC_APP_NAME={{COMPANY}}
NEXT_PUBLIC_APP_URL=http://localhost:3000
DEMO_AUTH_SECRET=change-me
DEMO_ADMIN_EMAIL=admin@example.com
DEMO_ADMIN_PASSWORD=demo
```

## Auth (mock)
Protect app routes; unauthenticated → `/login?redirect=...`. Signed HTTP-only cookie (or documented SPA equivalent). Logout clears session.

## Code quality
TypeScript strict (avoid `any`), ESLint/build clean, accessible, responsive, comments only for non-obvious logic.

## Tests (minimum)
Vitest + RTL: formatters, auth encode/decode, hero table/list, nav active state, one API/data route. Script: `"test": "vitest run"`.

## Computer-use verification (required before PR)

After lint/build/unit tests pass:

1. Start the app locally.
2. Use computer use / browser automation to walk:
   - Marketing landing loads and shows brand logo
   - Login with demo credentials
   - Land on the primary product screen
   - Perform one interaction (filter, open detail, create item, navigate section)
3. **Record the entire walkthrough to a screen-recording video**; save still screenshots of landing, login, and hero product UI.
4. Confirm no obvious console errors on the happy path.
5. Embed or attach the recording + screenshots in the PR body (artifact paths / uploads as the environment supports).

## README
Unofficial demo disclaimer (not affiliated with {{COMPANY}}), setup, demo credentials, structure tour, JSON persistence notes, scripts.

## Implementation order
1. Fetch brand assets
2. Install deps
3. Design tokens + global CSS + primitives
4. Types, seed data, content
5. Mock auth + route protection
6. App shell + nav (real logo)
7. Hero product screen (match screenshot)
8. Remaining product screens
9. Settings
10. Marketing + auth pages
11. API / JSON persistence
12. Unit tests
13. README + lint/build/unit test
14. **Computer-use verification + screen recording**
15. **Open PR** with artifacts

## PR requirements
Branch `feat/{{REPO_NAME}}-demo` (or the active cloud-agent branch). Title: **feat: {{COMPANY}} demo — landing, auth, and dashboard**.

PR body must include:
- Summary
- Screenshots + **computer-use verification recording** (or clear note if recording failed and why)
- Test plan checklist (unit + computer-use steps)
- Demo credentials
- Known limitations

## Constraints
- No lorem ipsum — realistic {{DATA_THEME}} copy.
- No real secrets in committed files.
- No real AI/integrations — simulate.
- Prefer many small files over monoliths.
- Commit incrementally; if blocked, decide, document, continue.

**Success criteria:** app runs; login with demo credentials reaches the dashboard; UI closely matches the real product{{REFERENCE_NOTE}} with official logo/favicon under `public/brand/`; computer-use walkthrough was recorded; PR is open with verification artifacts. Codebase is large enough that exploring it requires reading across multiple directories.
````

## Notes
- Cloud/background runs → generate-and-build (build + **computer-use recording** + **PR**). Local prompt-only → write `prompts/<slug>.md` only.
- Always write the prompt file first in generate-and-build; it is the build spec.
- Do **not** stock `prompts/` with historical company examples in this plugin — only the prompt for the current run.
- When a screenshot is provided, set `{{REFERENCE_NOTE}}` to its path and add a visual-fidelity checklist for the hero screen.
- Tune `{{PRODUCT_ROUTES}}`, `{{PRODUCT_SCREEN_SPECS}}`, `{{NAV_SPEC}}` to the real product.
- Always populate brand asset URLs from research — not generic placeholders.
- Visual-fidelity checklist must include: official logo + favicon in `public/brand/`, rendered in header and browser tab; computer-use recording of the happy path attached to the PR.
