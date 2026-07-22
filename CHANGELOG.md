# Changelog

## 0.3.0 — 2026-07-22

- Remove per-app convention skills (`kddi-conventions`, `naukri-conventions`, `seek-conventions`, `nab-conventions`).
- Reframe the plugin around team-level `mock-company-repo` for scaffolding demos into demo-monorepo; keep shared `monorepo-alignment`, `design-tokens`, and `testing-and-quality`.
- Update always-applied rule and README accordingly.
- Clear historical files under `skills/mock-company-repo/prompts/`; prompts are per-run build specs only.
- Update `mock-company-repo` so generate-and-build requires **computer-use screen recording** of the running app and a **PR** with verification artifacts.

## 0.2.0 — 2026-07-16

- Move `mock-company-repo` skill (and its `prompts/` examples) from demo-monorepo into this plugin.
- Prompt output path is now `skills/mock-company-repo/prompts/`.

## 0.1.0 — 2026-07-08

- Initial release.
- Always-applied `monorepo-alignment` rule routing agents to the right skill.
- Skills: `monorepo-alignment`, `design-tokens`, `kddi-conventions`, `naukri-conventions`, `seek-conventions`, `nab-conventions`, `testing-and-quality`.
