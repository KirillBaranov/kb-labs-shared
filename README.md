# KB Labs Shared (@kb-labs/shared)

> **Shared utilities and libraries for KB Labs products.** A collection of common types and utilities without side effects for the **@kb-labs** ecosystem.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18.18.0+-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-9.0.0+-orange.svg)](https://pnpm.io/)

## 🎯 Vision

KB Labs Shared provides common types and utilities without side effects for all KB Labs products. It enables fast bootstrap, unified quality rules, simple publishing, and reusable core utilities across the ecosystem. This project serves as the shared foundation for product-agnostic domain utilities.

The project solves the problem of code duplication across KB Labs products by providing reusable utilities that don't introduce side effects or dependencies on external services. All packages in Shared are pure, testable, and can be used in any context without concerns about async operations or external state.

This project is part of the **@kb-labs** ecosystem and is used by all KB Labs products as a foundation for common operations like diff parsing, text processing, boundary checking, and profile management.

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start development mode for all packages
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint
```

### Basic Usage

```typescript
// Using diff parser
import { parseUnifiedDiff, listChangedFiles } from '@kb-labs/shared-diff';

const diff = await parseUnifiedDiff(diffString);
const changedFiles = await listChangedFiles(diff);

// Using text operations
import { normalizeText, similarity } from '@kb-labs/shared-textops';

const normalized = normalizeText(text);
const score = similarity(text1, text2);

// Using boundaries checker
import { checkBoundaries } from '@kb-labs/shared-boundaries';

const violations = await checkBoundaries({
  rules: boundaryRules,
  files: sourceFiles
});
```

## ✨ Features

- **Zero Side Effects**: All utilities are pure functions without external dependencies
- **Module Boundary Checking**: Enforce import boundaries with configurable rules
- **Diff Parsing**: Unified diff parser with file change detection
- **Text Processing**: Normalization, similarity, and text operation utilities
- **CLI UI Utilities**: Shared CLI output formatting and command discovery
- **Repository Utilities**: Git repository metadata and utilities
- **Review Types**: Shared types for review systems

## 📁 Repository Structure

```
kb-labs-shared/
├── apps/                    # Example applications
│   └── demo/                # Example app / playground
├── packages/                # Shared packages
│   ├── boundaries/          # Module import boundary checker
│   ├── cli-ui/              # CLI UI utilities (output formatting, command discovery)
│   ├── diff/                # Unified diff parser and utilities
│   ├── repo/                # Repository utilities
│   ├── review-types/        # Review system types
│   └── textops/             # Text processing utilities
├── docs/                    # Documentation
│   └── adr/                 # Architecture Decision Records
└── scripts/                 # Utility scripts
```

### Directory Descriptions

- **`apps/`** - Example applications demonstrating shared utilities usage
- **`packages/`** - Individual shared packages, each providing specific domain utilities
- **`docs/`** - Documentation including ADRs and guides

## 📦 Packages

| Package | Description |
|---------|-------------|
| [@kb-labs/shared-boundaries](./packages/boundaries/) | Module import boundary checker with configurable rules |
| [@kb-labs/shared-cli-ui](./packages/cli-ui/) | CLI UI utilities for output formatting, command discovery, and auto-suggestions |
| [@kb-labs/shared-diff](./packages/diff/) | Unified diff parser and analysis utilities |
| [@kb-labs/shared-repo](./packages/repo/) | Repository utilities for Git metadata and operations |
| [@kb-labs/shared-review-types](./packages/review-types/) | Shared TypeScript types for review systems |
| [@kb-labs/shared-textops](./packages/textops/) | Text processing, normalization, and similarity utilities |

### Package Details

**@kb-labs/shared-boundaries** provides module boundary checking:
- Configurable rules for import boundaries
- Detection of boundary violations
- Support for wildcard patterns and exceptions

**@kb-labs/shared-cli-ui** provides CLI user interface utilities:
- Output formatting (tables, colors, timing)
- Command discovery and auto-suggestions
- Manifest parsing for CLI commands
- Artifacts display utilities

**@kb-labs/shared-diff** provides unified diff parsing:
- Parse unified diff format
- List changed files
- Extract added/removed lines by file
- Diff analysis utilities

**@kb-labs/shared-repo** provides repository utilities:
- Git repository metadata
- Repository information extraction
- Git operations utilities

**@kb-labs/shared-review-types** provides shared types:
- TypeScript types for review systems
- Common interfaces and types
- Type definitions for review workflows

**@kb-labs/shared-textops** provides text processing:
- Text normalization
- Similarity calculation
- Text comparison utilities
- String manipulation helpers

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development mode for all packages |
| `pnpm build` | Build all packages |
| `pnpm build:clean` | Clean and build all packages |
| `pnpm test` | Run all tests |
| `pnpm test:coverage` | Run tests with coverage reporting |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm lint` | Lint all code |
| `pnpm lint:fix` | Fix linting issues |
| `pnpm format` | Format code with Prettier |
| `pnpm type-check` | TypeScript type checking |
| `pnpm check` | Run lint, type-check, and tests |
| `pnpm ci` | Full CI pipeline (clean, build, check) |
| `pnpm clean` | Clean build artifacts |
| `pnpm clean:all` | Clean all node_modules and build artifacts |

## 📋 Development Policies

- **Code Style**: ESLint + Prettier, TypeScript strict mode
- **Testing**: Vitest with fixtures for integration testing
- **Versioning**: SemVer with automated releases through Changesets
- **Architecture**: Document decisions in ADRs (see `docs/adr/`)
- **Pure Functions**: All utilities must be pure (no side effects)
- **No Dependencies**: Minimize external dependencies, prefer zero side effects

## 🔧 Requirements

- **Node.js**: >= 18.18.0
- **pnpm**: >= 9.0.0

## 📚 Documentation

- [Documentation Standard](./docs/DOCUMENTATION.md) - Full documentation guidelines
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute
- [Architecture Decisions](./docs/adr/) - ADRs for this project

## 🔗 Related Packages

### Dependencies

- None (shared utilities only, no external dependencies with side effects)

### Used By

- [@kb-labs/core](https://github.com/KirillBaranov/kb-labs-core) - Core utilities
- [@kb-labs/cli](https://github.com/KirillBaranov/kb-labs-cli) - CLI wrapper
- [@kb-labs/ai-review](https://github.com/KirillBaranov/kb-labs-ai-review) - AI Review
- All other KB Labs products

### Ecosystem

- [KB Labs](https://github.com/KirillBaranov/kb-labs) - Main ecosystem repository

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines and contribution process.

## 📄 License

MIT © KB Labs

---

**See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines and contribution process.**


## License

MIT License - see [LICENSE](LICENSE) for details.
