---
name: design-tokens
description: Canonical color, radius, and font tokens for every app in the demo-monorepo. Use this whenever picking visual values so new UI stays on-brand; never invent hex values.
---

# Design tokens

Each app owns its palette. Use these exact values (or better, the token/utility names) — never hardcode new brand colors.

## Shared `@demo/ui` tokens (`packages/ui/src/tokens.ts`, `tokens.css`)

| Token | CSS var | Value |
| --- | --- | --- |
| accent | `--demo-accent` | `#f54e00` |
| accentInk | `--demo-accent-ink` | `#ffffff` |
| ink | `--demo-ink` | `#26251e` |
| inkSoft | `--demo-ink-soft` | `#4a4a4a` |
| bg | `--demo-bg` | `#f7f7f4` |
| card | `--demo-card` | `#f2f1ed` |
| line | `--demo-line` | `#e0ddd8` |
| radius | `--demo-radius-sm/md/lg/full` | `6px / 10px / 16px / 9999px` |

Fonts: sans `'Inter', system-ui, ...`; mono `'JetBrains Mono', ui-monospace, ...`.

## kddi (Tailwind v4 `@theme` in `apps/kddi/src/index.css` — no tailwind.config)

- Brand: `--color-kddi: #0e0d6a` (KDDI blue), `--color-kddi-arc: #4a90d9` (arc accent, also the focus ring color).
- Dark NOC surfaces: `--color-noc-bg: #0f1117`, `--color-noc-card: #1a1d27`, `--color-noc-elevated: #252836`, `--color-noc-border: #2e3344`, `--color-noc-muted: #8b90a0`.
- Severity: critical `#dc2626`, warning `#f59e0b`, info `#3b82f6` (each with `-bg`/`-border` variants).
- Region health: healthy `#22c55e`, degraded `#f59e0b`, critical `#ef4444`.
- Use utilities like `bg-noc-bg`, `text-kddi`, `text-sev-critical`, `bg-region-healthy`.
- Fonts self-hosted via `@fontsource/inter` and `@fontsource/jetbrains-mono` — do not add Google Fonts links.

## naukri (shadcn HSL vars in `apps/naukri/app/globals.css` + `tailwind.config.ts`)

- Primary `#1875E5` (`--primary: 213 81% 50%`), primary dark `#0F5BB5`, sky `#0CADF3`, soft sky `#56C3E1`.
- Text `#243C42` (`--foreground: 192 29% 20%`), grey `#7A8484` (`--muted-foreground`), border `#E3E7EA`, page bg `#F7F8FA`.
- `--radius: 0.5rem`. Container: centered, `1rem` padding, 2xl at `1280px`.
- Prefer semantic classes (`bg-primary`, `text-muted-foreground`, `border-border`) over raw hex. Helper classes: `.surface-card`, `.skeleton`.
- Font: Inter via `next/font/google` (`--font-inter`).

## seek (Braid-inspired palette in `apps/seek/tailwind.config.ts`)

- Pink: `seek.pink #E60278`, `seek.pink-dark #C2005F`, `seek.pink-light #FCE5F1`. `--primary: 327 99% 45%`.
- Navy: `seek.navy #2E3849`, `-dark #1F2733`, `-light #3D495C`.
- Ink: `#2E3849 / #505A6E / #6E7891`. Surfaces: `#FFFFFF / #F8F8F9 / #F4F4F6`. Lines: `#E4E5E7 / #CBCCD3`.
- Tones: positive `#108043`, critical `#D1373B`, caution `#B7791F`, info `#1C5FCB` (+ `-bg` variants).
- Radii hard-coded: `lg 12px`, `md 8px`, `sm 6px`. Utilities: `.focus-ring` (pink), `.container-page` (`max-w-[1200px]`).
- Locale: `lang="en-AU"`, AUD via `Intl.NumberFormat('en-AU')`.

## nab (`apps/nab/css/styles.css` `:root`)

- `--nab-red: #c80000`, `--nab-red-bright: #ed0000`, `--nab-red-dark: #a50000`.
- `--ink: #1a1a1a`, `--ink-soft: #4a4a4a`, `--line: #e0ddd8`, `--bg: #ffffff`, `--bg-tint: #f7f5f2`.
- `--radius: 12px`, `--radius-lg: 20px`, `--container: 1200px`, `--header-h: 72px`.
- Font stack: `"Helvetica Neue", Helvetica, Arial, "Segoe UI", Roboto, sans-serif`.
- `css/tokens.css` is generated from `@demo/ui` — edit the package, not the copy.

## Rules

1. Reference tokens by name (CSS var or Tailwind utility), not by hex, wherever possible.
2. If a needed value genuinely doesn't exist, add it to the app's token layer (`@theme`, `globals.css`, or `styles.css :root`) with a comment, then use it — don't inline it.
3. Never move a token from one app into another. Shared values belong in `@demo/ui`.
