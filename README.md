# KB Labs Shared

> **Shared utilities and libraries for KB Labs plugins and products.** A collection of common types, UI helpers, platform composables, and testing utilities for the `@kb-labs` ecosystem.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20.0.0+-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-9.0.0+-orange.svg)](https://pnpm.io/)

## 🎯 Vision

KB Labs Shared provides the building blocks used by all KB Labs plugins. These packages are bundled into `@kb-labs/sdk` — plugin developers typically don't install them directly. Internal KB Labs products (CLI, REST API, etc.) use them as workspace dependencies.

## 🚀 Quick Start

```bash
pnpm install
pnpm build
pnpm test
```

## 📁 Repository Structure

```
kb-labs-shared/
├── packages/
│   ├── shared-command-kit/   # Platform composables, defineCommand, error factory
│   ├── shared-cli-ui/        # CLI output formatting, artifacts display, env system
│   ├── shared-perm-presets/  # Composable permission presets for plugins
│   ├── shared-testing/       # Mock builders (mockLLM, mockCache, testCommand)
│   └── shared-tool-kit/      # Tool factory (createTool) for agent tools
├── docs/
│   ├── DECLARATIVE-FLAGS-AND-ENV.md  # Flags & env system guide
│   ├── DOCUMENTATION.md              # Documentation standard
│   └── adr/                          # Architecture Decision Records
├── CONTRIBUTING.md
└── README.md
```

## 📦 Packages

| Package | Description |
|---------|-------------|
| [@kb-labs/shared-command-kit](./packages/shared-command-kit/) | Platform composables (`useLogger`, `useLLM`, `useCache`), `defineCommand`, error factory, schema builders |
| [@kb-labs/shared-cli-ui](./packages/shared-cli-ui/) | CLI output formatting (`box`, `table`, `keyValue`), artifacts display, declarative env system |
| [@kb-labs/perm-presets](./packages/shared-perm-presets/) | Composable permission presets for plugin manifests |
| [@kb-labs/shared-testing](./packages/shared-testing/) | Mock builders (`mockLLM`, `mockCache`, `mockLogger`), `testCommand`, `createTestContext` |
| [@kb-labs/shared-tool-kit](./packages/shared-tool-kit/) | Tool factory (`createTool`) for building agent tools |

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm build` | Build all packages |
| `pnpm test` | Run all tests |
| `pnpm lint` | Lint all code |
| `pnpm type-check` | TypeScript type checking |

## 📚 Documentation

- [Declarative Flags & Env](./docs/DECLARATIVE-FLAGS-AND-ENV.md) - Type-safe CLI flags and env variables
- [Documentation Standard](./docs/DOCUMENTATION.md) - Documentation guidelines
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute
- [Architecture Decisions](./docs/adr/) - ADRs for this project

## 🔗 Related Packages

### Used By

- [@kb-labs/sdk](https://github.com/KirillBaranov/kb-labs-sdk) - All packages bundled into the SDK
- All KB Labs plugins and internal products

### Ecosystem

- [KB Labs](https://github.com/KirillBaranov/kb-labs) - Main ecosystem repository

## 📋 Requirements

- **Node.js:** >= 20.0.0
- **pnpm:** >= 9.0.0

## 📄 License

MIT © KB Labs

---

**See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines and contribution process.**
