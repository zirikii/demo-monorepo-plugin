# Build GoPay ID — Self-Serve re-KYC (Consumer) flow replica

## Mission

Build a runnable, high-fidelity replica of the **Self-Serve re-KYC (Consumer)** flow specified in the
GoPay/DAB PRD `Self_Serve_ReKYC_Consumer_0870.pdf`. The deliverable is an interactive demo that lets a
reviewer walk every branch of the PRD — entry points, the re-KYC happy path, every rejection and pending
state, the submission ledger rules, the E-Money Portal agent view, partner callbacks, and the Phase 2 ODD
blocking appendix.

**Fidelity target is the PRD's acceptance criteria, not pixel-matching Figma.** The Figma file
(`GoPay-ID`, node `19988-87560`) is not reachable from the build environment, so brand values come from
Gojek's published guidelines and GoPay's payments palette. Screens are reconstructed from the written ACs.

## Repo context

- Target home: `demo-monorepo` `apps/gopay-rekyc/`. Built here under `demos/gopay-rekyc/` because the
  build agent has no push access to demo-monorepo. Layout, scripts, and tooling match the monorepo's
  Vite apps so the folder is a drop-in move.

## Tech stack (match demo-monorepo Vite apps: gojek, changi, commbank)

| Layer | Technology |
| --- | --- |
| Framework | Vite 6 + React 19 + TypeScript (strict) |
| Routing | react-router-dom 7 |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite`, tokens in `@theme` |
| Fonts | `@fontsource/plus-jakarta-sans` (self-hosted) |
| Icons | `lucide-react` |
| State | React context + reducer, persisted to `localStorage` |
| Data | Local TS seed modules; no network calls |
| Tests | Vitest + jsdom + Testing Library |
| Lint | ESLint 9 flat config + Prettier |

No real databases, auth, OCR, face recognition, or Dukcapil calls. Every external system is simulated
behind a configurable scenario switch.

## Design tokens

Own `@theme` block (apps never share token systems):

- `--color-gopay: #00aed6` (Gojek payments vertical primary), `--color-gopay-deep: #0091b4`,
  `--color-gopay-tint: #e6f8fc`
- `--color-gojek: #00aa13` (Gojek green, published brand guideline value), `--color-gojek-tint: #e6f6e8`
- Neutrals mirroring `apps/gojek`: ink `#1a1a1a`, ink-soft `#5a5a5a`, ink-faint `#8c8c8c`,
  line `#e6e6e6`, surface `#f6f7f6`, card `#ffffff`
- Status: success `#00aa13`, warning `#ef6a00`, danger `#ee2737`, info `#00aed6`
- Font: Plus Jakarta Sans

Class joiner: local `cn` in `src/lib/cn.ts`.

## Surfaces to build

1. **GoPay app simulator** (phone frame, Indonesian copy with EN toggle)
   - Home with security pill, ODD reminder banner, Genie banner
   - Pusat Akun Terverifikasi (VAC) with the `Identitas terverifikasi` card
   - Dira chatbot entry point
   - e-KTP data review screen (collapsed/expanded masking, single CTA, "bukan milik saya")
   - In-app browser help article
   - On-demand FR gate, OneKYC capture onboarding (config-driven copy), KTP capture, selfie capture
     (skipped when the FR selfie is reused)
   - Pipeline processing screen, EDD questionnaire, pending/rejected outcomes, success toast on VAC
   - Phase 2: ODD confirmation screen and the block-enforcement screen
2. **E-Money Portal** — agent submission list (chronological, type column + filter), submission detail
   with documents, Level 1 / Level 2 / system details, and agent override (approve/reject)
3. **Partner console** — callback event log (account id + event + timestamp only) and the Pull API viewer
4. **Scenario console** — every simulated decision point: FR result, OCR NIK match, OCR confidence,
   screening hit, risk tier, Dukcapil face confidence + verification result, ODD due date, block
   enforcement toggle and scope
5. **Flow diagram + requirement traceability page** mapping each PRD acceptance criterion to its
   implementation

## Domain rules that must be encoded (not just drawn)

- Masking: NIK, full name, DOB, address, RT/RW, kelurahan, kecamatan masked; occupation, marital status,
  religion, gender shown in full
- Submission ledger: one submission per attempt, immutable data, at most one approved per account,
  approval supersedes the prior approved row with `superseded_by_newer_approval` in one transaction,
  rejecting the approved row downgrades the account, approving on a downgraded account restores it,
  risk score/tier stored on the submission, tier read from the approved submission
- Pipeline order: FR gate → capture → OCR → local NIK match (`rekyc_id_mismatch`, no Dukcapil call) →
  OCR confidence gate (manual review, pending) → name screening → fresh risk scoring → EDD when high
  risk → Dukcapil cache decision tree → decision
- ODD interval reset from the newly assessed risk tier
- Partner notify on approval carries no identity data; Pull API returns the approved submission's data
  or a no-data response

## Quality gates

- `pnpm test` (Vitest) green, covering masking, ledger invariants, every pipeline branch, ODD/blocking
  scope, partner payloads, plus component tests for the review screen and rejection copy
- `pnpm lint`, `pnpm typecheck`, `pnpm build` clean
- README with the unofficial-demo disclaimer, scenario walkthrough, and PRD traceability
- Computer-use walkthrough recorded before the PR
