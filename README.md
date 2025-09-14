# KB Labs Shared

A collection of **shared utilities and libraries** for KB Labs products under the **@kb-labs** namespace.  
This monorepo provides reusable packages for common development tasks across multiple projects.

**Goals:** Fast bootstrap, unified quality rules, simple publishing, and reusable core utilities.

## 📁 Repository Structure

```
apps/
├── demo/                    # Example app / playground
packages/
├── boundaries/              # Module import boundary checker
├── diff/                    # Unified diff parser and utilities
├── profiles/                # Project profile management
└── textops/                 # Text processing utilities
docs/
└── adr/                     # Architecture Decision Records (ADRs)
```

## 🚀 Quick Start

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev         # Parallel dev mode for selected packages/apps
pnpm build       # Build all packages
pnpm test        # Run tests
pnpm lint        # Lint code
```

### Available Packages

- **[@kb-labs/shared-boundaries](./packages/boundaries/)** — Module import boundary checker with configurable rules
- **[@kb-labs/shared-diff](./packages/diff/)** — Unified diff parser and analysis utilities
- **[@kb-labs/shared-profiles](./packages/profiles/)** — Project profile management and resolution
- **[@kb-labs/shared-textops](./packages/textops/)** — Text processing, normalization, and similarity utilities

### Creating a New Package

```bash
# Copy an existing package as template
cp -r packages/textops packages/<new-package-name>
# Update package.json metadata and imports
```

## 🛠️ Available Scripts

| Script             | Description                                |
| ------------------ | ------------------------------------------ |
| `pnpm dev`         | Start development mode for all packages    |
| `pnpm build`       | Build all packages                         |
| `pnpm build:clean` | Clean and build all packages               |
| `pnpm test`        | Run all tests                              |
| `pnpm test:watch`  | Run tests in watch mode                    |
| `pnpm lint`        | Lint all code                              |
| `pnpm lint:fix`    | Fix linting issues                         |
| `pnpm type-check`  | TypeScript type checking                   |
| `pnpm check`       | Run lint, type-check, and tests            |
| `pnpm ci`          | Full CI pipeline (clean, build, check)     |
| `pnpm clean`       | Clean build artifacts                      |
| `pnpm clean:all`   | Clean all node_modules and build artifacts |

## 📋 Development Policies

- **Code Style:** ESLint + Prettier, TypeScript strict mode
- **Testing:** Vitest with fixtures for integration testing
- **Versioning:** SemVer with automated releases through Changesets
- **Architecture:** Document decisions in ADRs (see `docs/adr/`)

## 🔧 Requirements

- **Node.js:** >= 18.18.0
- **pnpm:** >= 9.0.0

## 📄 License

MIT © KB Labs
