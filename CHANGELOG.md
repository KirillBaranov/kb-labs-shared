# Changelog — @kb-labs/shared

## 1.0.0 — 2026-02-24

First stable release. Prior history represents internal R&D — this is the first versioned public release.

### Packages

| Package | Version |
|---------|---------|
| `@kb-labs/shared-cli-ui` | 1.0.0 |
| `@kb-labs/shared-command-kit` | 1.0.0 |
| `@kb-labs/shared-testing` | 1.0.0 |
| `@kb-labs/shared-tool-kit` | 1.0.0 |
| `@kb-labs/perm-presets` | 1.0.0 |

### What's included

**`@kb-labs/shared-cli-ui`** — CLI presentation layer: color utilities, progress bars, table rendering, debug output, sidebar layout. Used by all CLI commands for consistent visual output.

**`@kb-labs/shared-command-kit`** — High-level command building utilities: flag helpers, analytics integration, error formatting, LLM helpers, `useConfig`, `useLogger`, `useStorage` hooks. Reduces boilerplate in command handlers.

**`@kb-labs/perm-presets`** — Composable permission preset definitions and factories for plugin permission declarations. Used in plugin manifests to declare required platform access.

**`@kb-labs/shared-testing`** — Test utilities for plugin development: mock platform builders, test context factories, sandbox setup helpers.

**`@kb-labs/shared-tool-kit`** — Tool factory and mock utilities for agent tool development.

### Notes

- `shared-cli-ui` and `shared-command-kit` are the primary shared dependencies for all KB Labs plugins
- `shared-testing` is a dev dependency — not included in production builds
- `perm-presets` is the canonical way to declare plugin permissions in manifests
