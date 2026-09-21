# GoPay ID — Self-Serve re-KYC (Consumer) demo

An unofficial, runnable replica of the flow described in the PRD **Self-Serve re-KYC (Consumer)**.
Not affiliated with GoPay, Gojek, GoTo or DAB. There is no real identity data, camera, face
recognition, OCR, Dukcapil integration, database, or authentication anywhere in this repo.

The PRD describes a flow that lets a user whose e-KTP data has gone stale refresh it themselves
instead of asking CCU to downgrade their GoPay Plus and redo KYC by hand. This demo implements that
flow end to end: the consumer app, the agent portal, the partner integration, the submission ledger
rules, and the Phase 2 ODD reminder/blocking appendix.

## Run it

```bash
npm install
npm run dev        # http://localhost:5184
npm test           # Vitest
npm run lint
npm run build
```

No environment variables, no credentials. State lives in React state; the scenario config and the
language choice persist to `localStorage`.

## What is here

| Surface | Route | What it covers |
| --- | --- | --- |
| Overview | `/` | The problem the PRD describes and where to start |
| GoPay app | `/app` | Phone simulator: home, VAC, Dira, the whole re-KYC flow, ODD screens |
| E-Money Portal | `/portal` | Agent submission list, detail, and decision override |
| Partner console | `/partners` | Approval callbacks and the on-demand pull API |
| Scenario console | `/scenario` | Drives every simulated system so each PRD branch is reachable |
| Flow | `/flow` | The PRD's flow diagram, reconstructed |
| PRD coverage | `/traceability` | Each acceptance criterion mapped to the code that implements it |

The panel to the right of the phone shows the account state, the live session, and an effect log of
every ledger and partner write — the flow's side effects are the point, so they are visible.

## Walkthrough

1. `/app/vac` — the `Identitas terverifikasi` card shows NIK and full name masked; expand for
   address, occupation and marital status.
2. Tap **Perbarui data e-KTP** to reach the review screen. Nothing has started yet: leaving here
   writes nothing.
3. Tap **Data e-KTP saya perlu diperbarui** — this is where the session starts, and the on-demand
   face check runs before any capture screen.
4. Photograph the card. The selfie step is skipped because the FR image is reused.
5. Watch the verification sequence decide, then land back on the Verified Account Center with the
   success toast, the Genie banner and the push notification.
6. Check `/portal` for the new reverification row and the superseded initial KYC, and `/partners`
   for the callbacks.

Switch branches from `/scenario`: NIK mismatch, low OCR confidence, name screening hit, high-risk
EDD, Dukcapil re-run (verified and not), FR failure, and the Phase 2 overdue/blocked state.

## Where the rules live

The PRD's behaviour is encoded in `src/domain/`, not spread through components:

- `masking.ts` — which fields are masked and how
- `ledger.ts` — submissions, the one-approved-at-a-time transaction, supersede, downgrade/restore,
  immutability, partner notification
- `pipeline.ts` — FR gate → NIK match → OCR confidence → screening → risk → EDD → Dukcapil
- `odd.ts` — interval reset per tier, reminder window, toggleable and scoped block enforcement
- `partners.ts` — callback payload and the pull API
- `copy.ts`, `rejection.ts`, `notifications.ts` — config-driven copy, reason codes, notification matrix

Every one of those modules has a unit test next to it.

## Interpretation notes

The PRD is a written spec with a few gaps and one internal contradiction. Each judgement call is
listed on `/traceability`; the significant ones:

- **Ordering of the NIK match and the OCR confidence gate.** The PRD lists NIK matching first, so a
  mismatch rejects locally even on a low-confidence read. Flagging it because the safer product
  behaviour might be to check confidence first.
- **What a name screening hit does.** The PRD says screening and risk scoring run in sequence but
  never says what a hit causes. Here it routes to manual review rather than auto-rejecting.
- **"This e-KTP is not mine".** Section 4.2 specifies it; the 26 Aug meeting notes say to remove it
  from scope. It ships behind a toggle in the scenario console, on by default.
- **"Exactly one CTA".** Rendered as one primary button; the not-mine report is a secondary text
  link, since the same section requires both.
- **ODD cadence per tier** (36/24/12 months) is a demo assumption — the PRD only requires that the
  interval restarts from the newly assessed tier.
- **An FR failure writes no submission.** The ledger rule says a submission is created when an
  attempt "reaches a decision"; nothing was submitted, so the attempt is logged but no row is
  written.
- **Brand assets.** The real GoPay wordmark could not be fetched (the media kit is outside this
  environment's network allowlist), so the header uses an honest typographic stand-in rather than an
  invented look-alike. Colours come from the published Gojek brand palette: payments `#00aed6`,
  Gojek green `#00aa13`.

## Placement

Built to drop into `demo-monorepo` as `apps/gopay-rekyc/`: same Vite 6 + React 19 + Tailwind v4 +
Vitest tooling as the other Vite apps there, port 5184 (unused by the existing apps), and a local
`cn` joiner. Moving it means copying the folder, swapping `@fontsource`/React deps to
`workspace:*`-compatible versions where the monorepo pins them, and adding a `dev:gopay-rekyc`
root script.
