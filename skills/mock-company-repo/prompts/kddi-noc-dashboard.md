# Build KDDI Network Operations Status Dashboard — Internal NOC Demo

## Mission

Scaffold a production-quality **KDDI Network Operations Status Dashboard** — an internal-looking NOC (Network Operations Center) tool for demo purposes. This is a UI/UX fidelity demo for live agent workflows, not a production app: dummy data, mock backends, local JSON persistence. No real external services, SNMP, or live network feeds.

**Deliverable:** a single PR against `main` with a complete, lint-clean, build-passing codebase that runs locally via `npm install && npm run dev`.

**Demo intent:** The app ships with a working alert feed and a **mostly complete escalation flow**. The **Assignee field is intentionally omitted** (placeholder UI only) so a live demo can add it in real time as a multi-file agent edit. Everything else in escalation (team picker, priority, note, notify) must be fully wired.

## Company profile

- **Product:** KDDI operates Japan's second-largest telecommunications network (au mobile, fixed internet, global data centers under Telehouse). Internal NOC teams monitor backbone routers, BGP sessions, latency, capacity, and regional outages 24/7 from Tokyo/Osaka operation centers.
- **Primary users:** NOC engineers, infrastructure on-call, security incident responders — operators who triage alerts, escalate to specialist teams, and track regional health at a glance.
- **Core surfaces to clone:**
  1. **Regional status bar** — health cards for Kanto, Kansai, Kyushu, Overseas/Telehouse
  2. **Live alert feed** — scrollable event list with severity badges, timestamps, region tags
  3. **Escalation modal** — team picker (NOC / Security / Infrastructure), priority, note, notify action (assignee deliberately stubbed)
  4. **Escalation history panel** — sidebar or tab showing past escalations persisted to JSON
  5. **Alert detail drawer** — expanded view of a single event (affected nodes, metric sparkline mock, related alerts)
- **Dummy-data theme:** Realistic Japanese telecom network events — BGP flaps on `tky-core-rt-01`, latency spikes on `osaka-pe-03`, fiber cut warnings in Kyushu, Telehouse London capacity thresholds, au 5G core packet loss, DNS resolver degradation. Use real-ish hostnames (`*.kddi.net`, `telehouse.net`), ASN references, and JST timestamps.

## Repo context

- Repo: `kddi-noc-dashboard`
- **New repo — scaffold from scratch** with Vite + React. Do not use Next.js; keep the structure flat and demo-friendly.

## Target tech stack (mimic KDDI engineering signals)

KDDI groups use React, TypeScript, and Tailwind CSS in production (au PAY, Engineer Portal). For this demo, use a lightweight Vite SPA — faster `npm run dev`, easier for live agent iteration and browser-loop demos.

| Layer | Technology |
|-------|------------|
| Bundler | Vite 6 |
| Framework | React 19 |
| Language | JavaScript (`.jsx`) — keep approachable for live demo; JSDoc types optional |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |
| Forms | Controlled React state in modal (no heavy form lib needed) |
| State | React `useState` + `useContext` for escalations |
| Data | Local `src/data/mockAlerts.js` seed + `data/escalations.json` runtime store |
| API | None required — read/write JSON via Vite-friendly local helpers or simple `fetch` to a tiny Express stub **only if needed**; prefer in-memory + `localStorage` sync for zero-backend simplicity |
| Tests | Vitest + React Testing Library |
| Lint/format | ESLint + Prettier |

Explicitly DO NOT integrate real databases, SNMP, Grafana, PagerDuty, Slack APIs, OAuth, or cloud providers.

## Brand assets — source real KDDI files (do this first)

Before writing UI code, fetch and commit **official KDDI brand assets** so the dashboard looks exactly like a KDDI internal tool — not a generic dark theme with a fake "K" icon.

### Sources (try in this order)

1. **KDDI corporate logo guidelines (official ZIP)**
   - https://www.kddi.com/brand/guideline-kddi/
   - https://brand.kddi.com/ (Brand Book — logo guidelines)
   - Page has "ダウンロードZIPファイルをダウンロード" — fetch the ZIP, extract SVG/PNG logo variants

2. **KDDI Visual Identity hub** (corporate + sub-brands)
   - https://www.kddi.com/brand/visual-identity/
   - KDDI BUSINESS: https://www.kddi.com/brand/guideline-kddibusiness/ (if business-line branding fits the NOC context)

3. **Live website assets** — inspect `https://www.kddi.com/` and `https://www.kddi.com/english/`:
   - View page source + network tab for header logo `<img src="...">`, `link[rel="icon"]`, SVG sprites
   - `curl` each discovered URL into `public/brand/`

4. **Telehouse sub-brand** (for Overseas region card / global context)
   - https://www.telehouse.net/ — inspect header logo for `telehouse-logo.svg` or equivalent

5. **Google Images fallback** — search `site:kddi.com logo svg` or `site:kddi.com favicon` only if steps 1–3 fail; prefer files hosted on `kddi.com` or `kddi-web.com` CDN domains

### Required files in `public/brand/`

```
public/brand/
  kddi-logo.svg              # primary color logo (header)
  kddi-logo-white.svg        # reversed/white variant for dark NOC header
  kddi-logo-mark.svg         # icon-only if available in ZIP
  favicon.ico                # from kddi.com or extracted from ZIP
  telehouse-logo.svg         # optional — Overseas/Telehouse region card
  brand-assets.json          # manifest: { file, sourceUrl, fetchedAt }
scripts/
  fetch-brand-assets.sh      # idempotent curl script for all assets
```

### Agent instructions (must execute, not skip)

1. Run `scripts/fetch-brand-assets.sh` (create it) — use `curl -L` for each URL discovered
2. If ZIP requires a consent page, use browser automation to download once, extract to `public/brand/`, and document the source in `brand-assets.json`
3. Wire in `index.html`: `<link rel="icon" href="/brand/favicon.ico">`
4. Wire in `Header.jsx`: `<img src="/brand/kddi-logo-white.svg" alt="KDDI" className="h-7" />` on the KDDI Blue (`#0E0D6A`) bar — match clear-space from guidelines (do not crop, recolor, rotate, or add effects to the logo)
5. **No external hotlinks** in the UI — all assets self-hosted under `/brand/`
6. README disclaimer: unofficial demo; logos sourced from public KDDI brand pages for visual fidelity only; not affiliated with KDDI Corporation

### Example `fetch-brand-assets.sh` skeleton

```bash
#!/usr/bin/env bash
set -euo pipefail
mkdir -p public/brand
# Replace URLs after inspecting kddi.com network requests / brand ZIP contents:
curl -L -o public/brand/favicon.ico "https://www.kddi.com/<discovered-favicon-path>"
curl -L -o public/brand/kddi-logo.svg "https://www.kddi.com/<discovered-logo-path>"
# ... add all discovered URLs
echo '{"fetchedAt":"'$(date -Iseconds)'","assets":[...]}' > public/brand/brand-assets.json
```

## Design system — match a real internal NOC console

Blend **KDDI corporate identity** with **dark ops-console** conventions (like Grafana/Datadog internal dashboards KDDI engineers would recognize):

### Brand accents (KDDI official)
- **KDDI Blue (primary):** `#0E0D6A` (RGB 14, 13, 106) — header bar, primary buttons, active nav
- **KDDI arc accent (light blue):** `#4A90D9` — decorative arc element in header (subtle orbital arc behind logo text, echoing KDDI logo)
- **White on dark:** `#EDECEC` body text on dark surfaces

### NOC console palette
- **Background:** `#0F1117` (main), `#1A1D27` (cards/panels), `#252836` (elevated/hover)
- **Borders:** `#2E3344` subtle dividers
- **Severity badges:**
  - Critical: `#DC2626` bg `#7F1D1D/30` border — BGP down, total outage
  - Warning: `#F59E0B` bg `#78350F/30` border — latency spike, capacity warning
  - Info: `#3B82F6` bg `#1E3A5F/30` border — maintenance, config drift
- **Region health cards:** green `#22C55E` (healthy), amber `#F59E0B` (degraded), red `#EF4444` (critical) — dot + label + metric count
- **Typography:** `Inter` or system-ui for UI; `JetBrains Mono` or `IBM Plex Mono` for timestamps, hostnames, ASN codes
- **Component style:** Dense information layout, compact rows (36–44px), sticky header, no marketing fluff. Looks like something deployed on an internal `noc.kddi.internal` hostname.

Build reusable primitives: `AppShell`, `Header`, `StatusBar`, `AlertFeed`, `AlertRow`, `SeverityBadge`, `RegionTag`, `EscalateModal`, `EscalationHistory`, `AlertDetailDrawer`, `EmptyState`, `Toast`, `LoadingSkeleton`.

## Application structure

Build a navigable codebase (~40–70 files) organized by feature. Start from the **required starter skeleton** and expand:

```
kddi-noc-dashboard/
  index.html
  vite.config.js
  package.json
  tailwind.config.js  (or @tailwindcss/vite)
  src/
    main.jsx
    App.jsx                    ← main layout, imports components
    index.css                  ← Tailwind + NOC dark theme tokens
    components/
      layout/
        AppShell.jsx
        Header.jsx
      status/
        StatusBar.jsx          ← 4 region health cards at the top
        RegionCard.jsx
      alerts/
        AlertFeed.jsx          ← scrollable list of events
        AlertRow.jsx           ← single event row with severity badge + Escalate btn
        AlertDetailDrawer.jsx
        SeverityBadge.jsx
        RegionTag.jsx
      escalation/
        EscalateModal.jsx      ← team, priority, note, notify — NO assignee logic yet
        EscalateButton.jsx
        TeamSelector.jsx
        PrioritySelector.jsx
        AssigneePlaceholder.jsx  ← visible stub: "Assignee — coming soon" or disabled dropdown
        EscalationHistory.jsx
      ui/
        Button.jsx
        Badge.jsx
        Modal.jsx
        Toast.jsx
        Select.jsx
        Textarea.jsx
    context/
      EscalationContext.jsx
      ToastContext.jsx
    data/
      mockAlerts.js            ← 10–15 fake network events, typed with severity/region/time
      mockRegions.js           ← Kanto, Kansai, Kyushu, Overseas/Telehouse health
      teams.js                 ← NOC, Security, Infrastructure + mock capacity metadata
    hooks/
      useAlerts.js
      useEscalations.js
      useAutoRefresh.js        ← simulates "live" feed (inject new alert every 30–60s)
    lib/
      storage.js               ← localStorage read/write for escalations
      formatters.js            ← JST time, duration-ago, severity labels (日本語 + EN)
      constants.js
  data/
    escalations.json           ← seed file for persisted escalations
  public/
    brand/
      kddi-logo.svg            ← official logo from brand guidelines / kddi.com
      kddi-logo-white.svg      ← white variant for dark header
      kddi-logo-mark.svg       ← icon-only (if available)
      favicon.ico              ← from kddi.com
      telehouse-logo.svg       ← optional, for Overseas region
      brand-assets.json        ← manifest with source URLs
  scripts/
    fetch-brand-assets.sh      ← reproducible asset download script
```

## Pages — detailed requirements

### Main dashboard (`/`)

Single-page NOC console — no marketing site, no auth gate (internal tool assumed already behind VPN).

**Layout (top to bottom):**
1. **Header** — KDDI Blue (`#0E0D6A`) bar with **official white logo** (`/brand/kddi-logo-white.svg`) left-aligned, "Network Operations" product title beside it, mock operator name (`Tanaka, Yuki`), shift indicator (`Day Shift · NOC Tokyo`), live clock (JST), connection status dot ("Feed: Live · Mock")
2. **StatusBar** — 4 `RegionCard` components:
   - **Kanto** (東京/関東) — mobile + backbone
   - **Kansai** (大阪/関西)
   - **Kyushu** (九州)
   - **Overseas / Telehouse** (グローバル/テレハウス) — optional small Telehouse logo from `/brand/telehouse-logo.svg`
   Each card: region name, health dot, active alert count, last incident time, mini sparkline or bar (CSS-only mock)
3. **Toolbar** — filter by severity (All / Critical / Warning / Info), filter by region, search hostname, "Auto-refresh" toggle, alert count badge
4. **Main content (2-column on desktop):**
   - **Left (65%):** `AlertFeed` — scrollable list, newest first
   - **Right (35%):** `EscalationHistory` — recent escalations with team, priority, timestamp, truncated note

### Alert feed (`AlertFeed` + `AlertRow`)

Each row shows:
- Severity badge (Critical / Warning / Info) — bilingual label OK: `重大` / `警告` / `情報`
- Event title (e.g., "BGP session flap — tky-core-rt-01 ↔ AS2516")
- Region tag
- Relative timestamp + absolute JST on hover
- Affected asset / circuit ID
- **Escalate** button (outline, KDDI blue) — opens `EscalateModal` pre-filled with alert context

Clicking a row (not the button) opens `AlertDetailDrawer` with:
- Full description, mock metric chart (div-based bars), related alerts list, raw event JSON collapsible

### Escalation modal (`EscalateModal`) — **build everything except assignee**

When operator clicks **Escalate** on an alert row:

**Modal fields (all functional except assignee):**
1. **Alert summary** (read-only) — title, severity, region, timestamp
2. **Team** (`TeamSelector`) — radio or dropdown: **NOC**, **Security**, **Infrastructure**
   - Show mock team capacity under each option (e.g., "NOC — 3/5 on-call slots available") — this is what the live browser-loop demo will refine
3. **Priority** (`PrioritySelector`) — P1 (Immediate), P2 (High), P3 (Normal)
4. **Assignee** (`AssigneePlaceholder`) — **INTENTIONALLY INCOMPLETE**
   - Render a visible disabled dropdown or dashed-border field labeled "Assignee" with helper text: `Assignee selection — to be added in live demo`
   - Do NOT wire this to state or persistence
   - Add a `// TODO(live-demo): wire assignee picker` comment in `EscalateModal.jsx`
5. **Note** (`Textarea`) — required, min 10 chars, placeholder in Japanese: `エスカレーション理由を入力...`
6. **Notify** checkbox — "Send notification to team channel" (mock — shows toast on submit)
7. **Actions:** Cancel | **Escalate** (primary, KDDI blue)

**On submit:**
- Validate team, priority, note (not assignee)
- Append to `EscalationContext` + persist via `localStorage` / `data/escalations.json` pattern
- Show success toast: `Escalated to {team} · {priority}`
- Close modal; alert row shows small "Escalated" chip if already escalated
- Disable double-escalation or allow re-escalate with confirmation — pick one, document in README

### Live feed simulation (`useAutoRefresh`)

Every 45 seconds (configurable), prepend a new random alert from a pool of templates to simulate a live NOC feed. Show a subtle slide-in animation. Toggle off via toolbar.

## Data layer

### `src/data/mockAlerts.js` — seed 12–15 events

```js
// Example shape — implement fully
export const mockAlerts = [
  {
    id: 'evt-001',
    severity: 'critical',       // 'critical' | 'warning' | 'info'
    title: 'BGP session down',
    description: 'eBGP session to AS2516 (NTT) flapped 3x in 5 min on tky-core-rt-01',
    region: 'kanto',
    asset: 'tky-core-rt-01',
    circuitId: 'CKT-TKY-OSK-014',
    timestamp: '2026-06-24T14:32:00+09:00',
    escalated: false,
    tags: ['bgp', 'backbone'],
  },
  // ... latency spike kansai, capacity warning kyushu, telehouse london, etc.
];
```

Include event types: BGP flaps, latency spikes (>50ms), partial outages, capacity warnings (>85% utilization), scheduled maintenance (info), DNS degradation, 5G core packet loss.

### `src/data/mockRegions.js`

Health status per region derived from alert severities (computed, not static).

### `src/data/teams.js`

```js
export const teams = [
  { id: 'noc', name: 'NOC', nameJa: 'ネットワーク運用', capacity: { onCall: 3, total: 5 } },
  { id: 'security', name: 'Security', nameJa: 'セキュリティ', capacity: { onCall: 1, total: 3 } },
  { id: 'infrastructure', name: 'Infrastructure', nameJa: 'インフラ', capacity: { onCall: 2, total: 4 } },
];
```

### Escalation persistence

Store escalations in `localStorage` key `kddi-noc-escalations` with shape:
```js
{ id, alertId, team, priority, note, notify, createdAt, alertSnapshot }
```
No `assignee` field yet — schema should allow adding it later without migration pain.

## Env vars (`.env.example`)

```
VITE_APP_NAME=KDDI Network Operations
VITE_AUTO_REFRESH_INTERVAL_MS=45000
```

## Code quality

- ESLint clean, build clean (`npm run build`), Prettier formatted
- Accessible: modal focus trap, Escape to close, aria labels on severity badges and Escalate buttons, keyboard-navigable feed
- Responsive: usable on 1280px+ (primary); collapses to single column on tablet
- No console errors on happy paths
- Comments only for non-obvious logic (especially the assignee TODO)

## Tests (minimum)

Vitest + RTL covering:
- `formatters.js` — JST formatting, time-ago
- `SeverityBadge` — renders correct styles per severity
- `AlertRow` — renders event data, Escalate button calls handler
- `EscalateModal` — validates note required, submits with team+priority, assignee field is disabled/absent from payload
- `StatusBar` — renders 4 regions with health derived from alerts
- `useAlerts` filter logic

Add `"test": "vitest run"` script.

## README

Replace default README with:
- **Disclaimer:** Unofficial demo, not affiliated with KDDI Corporation
- Prerequisites (Node 20+)
- Setup: `npm install && npm run dev` → open `http://localhost:5173`
- Demo walkthrough: alert feed → escalate flow → note the **missing assignee field** for live demo extension
- Project structure tour
- How escalation persistence works (localStorage)
- Scripts table
- **Live demo script** section: suggested agent prompts for adding assignee picker, centering modal, showing team capacity in dropdown

## Implementation order

1. **`scripts/fetch-brand-assets.sh`** — download official KDDI logo, favicon, Telehouse mark → `public/brand/` + `brand-assets.json`
2. `npm create vite@latest` scaffold (react template) + Tailwind + lucide-react
3. Design tokens in `index.css` (KDDI blue from brand guidelines, NOC dark theme, severity colors)
4. Seed data: `mockAlerts.js`, `mockRegions.js`, `teams.js`
5. UI primitives: `Modal`, `Button`, `Badge`, `Toast`, `Select`, `Textarea`
6. **Starter skeleton (must exist early):** `App.jsx`, `StatusBar.jsx`, `AlertFeed.jsx`, `AlertRow.jsx` — app renders with events visible
7. `Header` (real KDDI logo), `AppShell`, filters, `useAutoRefresh`
8. `EscalateModal` with team, priority, note, notify — **assignee placeholder only**
9. `EscalationContext` + persistence + `EscalationHistory`
10. `AlertDetailDrawer`
11. Tests, README, lint/build/test, PR

## PR requirements

- Branch: `feat/kddi-noc-dashboard`
- Run `npm run lint`, `npm run build`, `npm test` — all pass
- PR title: **feat: KDDI NOC status dashboard — alert feed and escalation demo**
- PR body must include:
  - **Summary** (3–5 bullets)
  - **Screenshots** or notes on NOC console fidelity
  - **Test plan** checklist
  - **Live demo notes:** assignee field deliberately stubbed; suggested agent prompt to add it
  - **Known limitations** (mock data, no real auth, no assignee, localStorage only)

## Constraints

- No lorem ipsum — use realistic Japanese telecom / network operations copy (日本語 labels welcome alongside English)
- No real secrets in committed files
- No real integrations — simulate notifications with toasts
- Prefer many small focused files over monoliths
- **Do not implement assignee selection** — placeholder UI only
- The starter files (`App.jsx`, `StatusBar`, `AlertFeed`, `AlertRow`, `mockAlerts.js`) must exist and work before escalation is added
- Commit incrementally; if blocked, make a reasonable decision, document it, and keep going

## Visual fidelity checklist

- [ ] **Official KDDI logo** in header (`/brand/kddi-logo-white.svg`) — not a placeholder or hand-drawn mark
- [ ] **Official favicon** in browser tab (`/brand/favicon.ico`)
- [ ] `brand-assets.json` documents source URL for each committed file
- [ ] Dark NOC console background, not a marketing landing page
- [ ] KDDI Blue (`#0E0D6A`) in header and primary actions — exact brand guideline hex
- [ ] 4 region status cards across the top with health indicators
- [ ] Alert feed with Critical / Warning / Info severity badges
- [ ] Monospace timestamps and hostnames
- [ ] Escalate button on every alert row
- [ ] Modal with team picker showing capacity hints, priority, note, notify
- [ ] Assignee field visibly stubbed (disabled / "coming soon")
- [ ] App feels like an internal tool KDDI could deploy, not a tutorial project

**Success criteria:** `npm install && npm run dev` → browser tab shows KDDI favicon, header shows **official KDDI logo** on brand-blue bar → dashboard loads with regional status cards and a scrolling alert feed → click **Escalate** → complete escalation (team, priority, note, notify) → toast confirms → history panel updates. Assignee field is present but non-functional, ready for live demo extension.
