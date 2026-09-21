# Build GoPay Self-Serve ReKYC Demo — Consumer VAC, Dira, Capture, EMoney Portal

## Mission

Scaffold a production-quality **GoPay consumer ReKYC UI clone** for demo purposes that looks and feels like the GoPay / GoPay ID app and implements the **exact flow in the Self Serve ReKYC (Consumer) PRD** (attached PDF). Dummy data, mock auth, local JSON + localStorage. No real Dukcapil, FR, OCR, or partner APIs.

Figma reference (auth failed in this run; match PRD copy + GoPay consumer visual language): `https://www.figma.com/design/6SMD3nZMBcbDhDjfY8vzyL/GoPay-ID?node-id=0-1`

**Deliverable:** a single PR against `main` in demo-monorepo with:
1. A complete, lint-clean, build-passing app under `apps/gopay/`
2. A computer-use screen recording of testing the running app (plus key screenshots)
3. PR description covering summary, fidelity, verification, test plan, demo credentials, and limitations

## Company profile

- **Product:** GoPay is GoTo’s Indonesian e-money wallet (GoPay Plus after KYC). This demo is the **self-serve ReKYC** path so users can update stale e-KTP data without CCU downgrading GoPay Plus.
- **Primary users:** GoPay Plus consumers (approved KYC) and KYC review agents on the EMoney portal.
- **Core surfaces to clone:** Pusat Akun Terverifikasi (VAC), Dira help chatbot, e-KTP review, on-demand FR, OneKYC capture onboarding + KTP capture, EDD, pending/reject, success toast back to VAC, ODD reminder/confirm (Phase 2), EMoney submission list, partner callback log.
- **Dummy-data theme:** Indonesian GoPay Plus customers in Jakarta / Bandung / Surabaya; realistic NIK, alamat, pekerjaan, status perkawinan; agent queue of initial KYC + reverification submissions.

## Repo context

- Repo: `demo-monorepo`
- Existing Vite + React 19 apps (gojek, paytm, commbank, …). Add `apps/gopay/` as a sibling; wire `dev:gopay` / `build:gopay` in root `package.json`, `AGENTS.md`, and `README.md`. Do not fold this into `apps/gojek` (that is the corporate site).

## Target tech stack (mimic neighboring Gojek Vite app)

| Layer | Technology |
|-------|------------|
| Framework | Vite 6 + React 19 + TypeScript + react-router-dom |
| Styling | Tailwind v4 `@theme` in `src/index.css` |
| Components | Local primitives (Button, Field, PhoneShell, DataTable) |
| Icons | lucide-react (`aria-hidden="true"` on decorative icons) |
| Forms | react-hook-form + zod |
| Tables | @tanstack/react-table (EMoney list) |
| State | React context + hooks |
| Data | Local JSON/TS seed + localStorage persistence |
| Auth | Mock session in localStorage (any email/password) |
| API | In-app modules (no real HTTP backends) |
| Tests | Vitest + React Testing Library |
| Lint/format | ESLint + Prettier |

Explicitly DO NOT integrate real databases, Dukcapil, face-recognition vendors, OCR, OAuth, or payment providers. Simulate with timers and demo flags.

## Brand assets — source real files (do this first)

**Sources to try (in order):**
1. `https://gopay.co.id/assets/img/logo/gopay.webp`
2. `https://gopay.co.id/media-kit`
3. Recreate the public GoPay wordmark as committed SVG using Gojek/GoPay published green `#00AA13` and payments cyan `#00AED6` if CDN is blocked.

**Required files in `public/brand/`:**
- `logo-green.svg` — wordmark on light
- `logo-white.svg` — wordmark on green
- `mark.svg` — app icon (rounded green tile)
- `favicon.svg`
- `brand-assets.json`

Fetch with curl into `public/brand/`, write `brand-assets.json`, add `scripts/fetch-brand-assets.sh`, wire favicon + header logo. No external hotlinks. Never invent a fake third-party logo pack.

## Design system — match the real UI

Consumer GoPay app: white sheets, Asphalt green CTAs `#00AA13` / `#008A0F`, payments cyan `#00AED6`, ink `#1A1A1A`, muted `#6B6B6B`, hairline `#E8E8E8`, surface `#F5F6F5`, full-width pill buttons, 16–24px card radii, Plus Jakarta Sans (self-hosted `@fontsource/plus-jakarta-sans`). Mobile-first **phone chrome** (390×844) on a gray studio background; EMoney portal is a desktop agent console on the same tokens.

Do not copy kddi/naukri/seek palettes. Put tokens in `@theme` with a comment citing Gojek brand / Asphalt.

Reusable primitives: PhoneShell, AppHeader, BottomNav, Button, Field, Badge, Toast, EmptyState, LoadingSkeleton, IdentityCard, DataTable.

## Application structure

```
apps/gopay/
  src/
    pages/ login signup home vac rekyc/* dira help settings notifications emoney odd
    components/ layout ui vac rekyc dira emoney odd
    lib/ auth mask rekyc-engine storage format
    data/ copy-config identity submissions partners
    hooks/ useAuth useRekyc useToast useDemoFlags
    test/
  public/brand/
  content/landing/
```

Class joiner: `cn` from `@demo/ui/cn` re-exported at `src/lib/cn.ts`. DemoRibbon on marketing/login/portal chrome.

## Pages — detailed requirements (PRD fidelity)

Language: Indonesian product copy (as in GoPay), with bilingual NIK-mismatch strings **exactly** as specified.

### Marketing landing (`/`)
Hero for unofficial GoPay ReKYC demo, CTAs to open the consumer app (`/login`) and EMoney portal (`/emoney`). Disclaimer. Responsive.

### Login / Signup
Demo mode: any credentials. Prefill `sari.wulandari@gopay.id` / `demo1234`. Login → wallet home `/app`.

### Wallet home (`/app`)
GoPay Plus home with balance, Genie-style banner slot, security pill. ODD reminder banner when due (Phase 2). Nav to VAC, Dira, Settings.

### Pusat Akun Terverifikasi (`/app/vac`) — 4.1 + success
- Card **Identitas terverifikasi**.
- Default collapsed: masked NIK + Full name only; expand to address, occupation, marital status.
- Row/button to start ReKYC.
- After successful ReKYC: land here with toast **“Data KYC kamu sudah diperbarui ✅”** (Genie). Simulated push copy: “Data KYC diperbarui — akunmu udah aktif lagi. Yuk transaksi seperti biasa.”

### Dira (`/app/dira`) — 4.1
Chat: if user asks about updating KTP / KYC data, Dira replies with an entry point into ReKYC (not a CCU ticket). Other intents get generic help.

### e-KTP data review (`/app/rekyc`) — 4.2
1. Explanatory line: this is e-KTP data currently on file; continue only if it no longer matches the physical e-KTP.
2. Collapsed: name, NIK, DOB, occupation, address, marital status — **masked per Masking Details** — control “See more data”.
3. Expand: RT/RW, kelurahan, kecamatan, religion, gender (still masked where required); control becomes “See less data”.
4. Exactly one primary CTA: **“I need to update my e-KTP data”** (ID: “Saya perlu perbarui data e-KTP”).
5. CTA launches on-demand FR **before** any KTP capture screen.
6. Back/close: no session, no write-back, no status change.

Masking:
- NIK, full name, DOB, address, RT/RW, kelurahan, kecamatan — masked
- Occupation, marital status, religion, gender — shown in full

“This e-KTP is not mine”: do **not** start session / FR / capture / Dukcapil; open in-app help article.

### On-demand FR (`/app/rekyc/fr`)
Live selfie simulation (camera permission optional; demo capture with timer). Pass threshold → KTP capture, no extra confirmation. Fail → cannot reach capture; on-file record untouched. Demo flags can force fail.

### Capture onboarding + KTP (`/app/rekyc/onboarding`, `/app/rekyc/capture`)
Reuse OneKYC-style screens; **copy config keyed by context** (`rekyc` vs `kyc`) so eyebrow/title/body/CTA say updating, not registering. Skip extra selfie: reuse FR image. OCR NIK:
- mismatch vs on-file NIK → local reject `rekyc_id_mismatch`, **no Dukcapil**
  - EN: `Because eKTP did not match with the current eKTP that registered. Please resubmit and ensure you use the same eKTP.`
  - ID: `Soalnya eKTP kamu tidak sesuai dengan eKTP yang terdaftar saat ini. Mohon submit ulang dan gunakan eKTP yang sama dengan yang sekarang terdaftar.`
- low OCR confidence → pending/manual review, not rejection
- NIK match → name screening + fresh risk score (never reuse cache)
- high risk → EDD must complete before approval
- Dukcapil cache: above threshold skip and keep data; below → re-run; verified replace; not verified reject. Failed Dukcapil does **not** downgrade GoPay Plus.

### Success / data model
No dedicated success screen. Redirect VAC + toast. Submissions are **append-only**; one approved per account; approving supersedes previous with `superseded_by_newer_approval`. Rejected ReKYC does not change account status / data in use / review date / risk tier. Risk score stored on the submission; account tier read from approved submission.

### EMoney portal (`/emoney`)
Chronological list of initial KYC + reverification; type column + filter; documents, date, status, Level 1, Level 2, system details. Agent can override decision without creating a new submission. Partner callback log: on approve/unapprove send account id + event + timestamp only.

### Phase 2 ODD
Reminder banner N days before due; CTA → confirmation (masked NIK, name, address, occupation, marital). Confirm same vs changed. Toggleable block enforcement + risk/overdue scoping. Blocked users see blocking screen in GoPay app; wallet still usable elsewhere (shown as copy).

## Env vars (`.env.example`)
```
VITE_APP_NAME=GoPay
VITE_APP_URL=http://localhost:5184
DEMO_AUTH_SECRET=change-me
DEMO_ADMIN_EMAIL=sari.wulandari@gopay.id
DEMO_ADMIN_PASSWORD=demo1234
```

## Tests (minimum)
masking, rekyc-engine (NIK mismatch, FR fail, approve supersede, pending OCR), auth encode/decode, VAC collapse/expand + CTA, EMoney type filter, Dira ReKYC intent. `"test": "vitest run"`.

## Computer-use verification
Landing → login demo creds → VAC expand → start ReKYC → FR pass → capture matching NIK → land VAC with toast. Also Dira entry and EMoney list filter. Record video.

## README
Unofficial demo disclaimer (not affiliated with GoPay / Gojek / GoTo), setup, credentials, structure, JSON/localStorage notes, scripts.

## Constraints
- No lorem ipsum.
- No real secrets.
- Exhaustive `never` default on unions.
- Imports at top of file.
- Comments only for non-obvious why.

**Success criteria:** `pnpm --filter gopay-rekyc-demo test` and lint pass; login reaches wallet; ReKYC happy path returns to VAC with toast; official-style logo under `public/brand/`; PR open with verification artifacts.
