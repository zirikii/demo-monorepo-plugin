# AGENTS.md — gopay-rekyc

Unofficial demo of the **Self-Serve re-KYC (Consumer)** PRD flow. Vite 6 + React 19 + TypeScript
strict + Tailwind v4 (`@theme` in `src/index.css`) + Vitest. Dev server on **5184**.

## Non-obvious things

- **The PRD's rules live in `src/domain/`, not in components.** If a change affects masking, the
  submission ledger, the verification pipeline, ODD intervals/blocking, partner payloads, reason
  codes, or notification copy, change it there and extend the unit test next to it. Components are
  presentation only.
- **`src/data/traceability.ts` is the contract with the PRD.** Any behaviour change that touches an
  acceptance criterion must update the matching entry (and its interpretation note). `/traceability`
  renders it, so drift is visible.
- **Session start timing is load-bearing.** The re-KYC session starts when the review screen's CTA
  is tapped, not when the screen opens — otherwise the "exit without starting" criterion breaks. The
  entry point travels as router location state until then.
- **Route guards enforce the FR gate.** `CaptureKtp` / `CaptureSelfie` redirect unless
  `session.frPassed === true`; do not weaken this, it is an acceptance criterion.
- **Every external system is fake and driven from `src/domain/scenario.ts`.** There is no camera,
  OCR, face matching, Dukcapil, database or auth. New branches belong in `SCENARIO_PRESETS` so they
  stay reachable from `/scenario`.
- **Class joiner is the local `cn` in `src/lib/cn.ts`.** Colours come from the app's own `@theme`
  tokens — never hardcode hex values in components.
- Copy is bilingual (`Bilingual { id, en }`) and resolved through `t()` from `useDemo()`. Add new
  strings to `src/data/strings.ts` rather than inlining them.

## Gates

```bash
npm test && npm run lint && npm run typecheck && npm run build
```

## Moving into demo-monorepo

Copy to `apps/gopay-rekyc/`, add a root `dev:gopay-rekyc` script, and align dependency versions with
the other Vite apps. Port 5184 is currently unused there.
