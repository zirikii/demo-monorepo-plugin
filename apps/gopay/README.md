# GoPay ReKYC demo (unofficial)

This is an **unofficial** look-alike of GoPay’s **self-serve ReKYC** consumer flow
(Pusat Akun Terverifikasi → Dira → FR → e-KTP capture → EMoney agent list). It is
**not affiliated with GoPay, Gojek, or GoTo**.

Figma file referenced by the PRD could not be read in this environment (MCP auth
failed). Screens follow the [Self Serve ReKYC (Consumer) PRD](https://www.figma.com/design/6SMD3nZMBcbDhDjfY8vzyL/GoPay-ID) copy and GoPay / Asphalt tokens (`#00AA13`, `#00AED6`).

## Setup

From this folder:

```bash
pnpm install
pnpm dev
```

App: http://localhost:5184

## Demo credentials

| Role | Email | Password |
| --- | --- | --- |
| Consumer (Sari) | `sari.wulandari@gopay.id` | `demo1234` (any password works) |
| Agent | `agent.kyc@gopay.id` | `demo1234` |

## Happy path

1. Login → Home → **Pusat Akun Terverifikasi**
2. Expand identity card → **Perbarui data e-KTP**
3. Review masked data → CTA → selfie FR → onboarding copy (update, not register)
4. Capture matching NIK → land back on VAC with toast *Data KYC kamu sudah diperbarui ✅*
5. Optional: Dira “perbarui KTP”; EMoney `/emoney` type filter

Demo flags live under **Setelan** (FR fail, high-risk EDD, overdue block). Capture screen also has NIK-mismatch and low-OCR shortcuts.

## Persistence

Account, submissions, partner callbacks, and demo flags are stored in
`localStorage` (`gopay-rekyc-store`). Seed data is in `src/data/`. No real
Dukcapil, OCR, FR, or partner APIs.

## Scripts

| Script | What |
| --- | --- |
| `pnpm dev` | Vite on 5184 |
| `pnpm test` | Vitest |
| `pnpm lint` | ESLint |
| `pnpm build` | Production build |
