# demo-monorepo-plugin

A Cursor plugin for the [demo-monorepo](https://github.com/zirikii/demo-monorepo). Its primary team skill is **`mock-company-repo`**: research a company, generate a build prompt, scaffold a realistic look-alike demo into the monorepo, verify with computer use, and open a PR. Shared alignment skills cover hard boundaries, design tokens, and quality gates when editing existing apps.

## What it does

- **`mock-company-repo`** — the team workflow for creating new company demos (prompt → build → computer-use verification → PR in demo-monorepo).
- **Alignment skills** — keep edits to existing apps on-pattern: monorepo hard boundaries, design tokens, testing/lint gates.

There are **no per-app convention skills**. App-specific detail lives in each app's `AGENTS.md` / `README.md` inside demo-monorepo, and in the prompts under `skills/mock-company-repo/prompts/`.

## Components

### Rule

- `rules/monorepo-alignment.mdc` (always applied) — points agents at the shared skills and hard boundaries; routes new demos to `mock-company-repo`.

### Skills

| Skill | Use when |
| --- | --- |
| `mock-company-repo` | Scaffold (or regenerate) a company demo into demo-monorepo — research, prompt, build, verify, PR |
| `monorepo-alignment` | Any change to an existing app — cross-cutting principles, shared `@demo/ui`, hard boundaries |
| `design-tokens` | Picking any color, radius, font, or spacing value |
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

Update `design-tokens` / `testing-and-quality` / `monorepo-alignment` when monorepo conventions change (new tokens, renamed scripts). New company demos go through `mock-company-repo` — do not add per-app skills here. Bump the version in `.cursor-plugin/plugin.json` when you ship plugin changes.

## License

MIT
