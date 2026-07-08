# demo-monorepo-plugin

A Cursor plugin that keeps agents aligned with the conventions of the [demo-monorepo](https://github.com/zirikii/demo-monorepo) when building or changing its apps (kddi, naukri, seek, nab) — whether the agent runs locally or in the cloud.

## What it does

When an agent makes UI or feature changes to a demo-monorepo app, the plugin's rule routes it to the right skills so changes stay on-brand and on-pattern: correct design tokens, the app's component/state conventions, accessibility patterns, and the repo's testing and lint gates.

## Components

### Rule

- `rules/monorepo-alignment.mdc` (always applied) — routes agents to the relevant skill before UI changes and enforces the hard boundaries (per-app token systems, `cx` vs `cn`, generated nab HTML, mock-only auth/data).

### Skills

| Skill | Use when |
| --- | --- |
| `monorepo-alignment` | Any change to any app — cross-cutting principles, shared `@demo/ui` package, hard boundaries |
| `design-tokens` | Picking any color, radius, font, or spacing value |
| `kddi-conventions` | Changing the kddi NOC dashboard (Vite + React 19, Tailwind v4, JS) |
| `naukri-conventions` | Changing the naukri job portal (Next.js 14, shadcn/ui, TS) |
| `seek-conventions` | Changing the seek marketplace (Next.js 15, Braid palette, TS, en-AU) |
| `nab-conventions` | Changing the nab static site (generated HTML, Adobe Client Data Layer) |
| `testing-and-quality` | Before finishing any change — Vitest suites, lint/typecheck, definition of done |

## Installation

### Local use

Clone into Cursor's local plugin directory:

```bash
git clone https://github.com/zirikii/demo-monorepo-plugin.git ~/.cursor/plugins/local/demo-monorepo-plugin
```

The plugin is picked up automatically; no install step needed.

### Cloud agents

Add this repository as an additional repo when launching a cloud agent against the demo-monorepo, so the skills are available alongside the code being changed.

## Keeping it current

The skills describe the monorepo as it exists today (token values, file paths, script names). When the monorepo's conventions change — new tokens, renamed scripts, new apps — update the corresponding skill in the same PR or shortly after, and bump the version in `.cursor-plugin/plugin.json`.

## License

MIT
