# @kb-labs/shared-review-types

> **Shared TypeScript types for code review functionality in KB Labs.** Neutral TypeScript types for code review systems providing common interfaces for rules, findings, severity levels, and review results.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18.18.0+-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-9.0.0+-orange.svg)](https://pnpm.io/)

## 🎯 Vision & Purpose

**@kb-labs/shared-review-types** provides shared TypeScript types for code review functionality in KB Labs products. It defines common interfaces for rules, findings, severity levels, and review results, ensuring type consistency across all review-related packages.

### What Problem Does This Solve?

- **Type Consistency**: Review packages need consistent types - review-types provides shared types
- **Type Safety**: Avoid type mismatches between review packages - review-types ensures compatibility
- **Single Source of Truth**: Review types should be defined once - review-types centralizes them
- **Code Reuse**: Avoid duplicating type definitions - review-types provides reusable types

### Why Does This Package Exist?

- **Unified Types**: All review packages use the same type definitions
- **Type Safety**: Ensures type compatibility across packages
- **Maintainability**: Single place to update types
- **Consistency**: Prevents type drift between packages

### What Makes This Package Unique?

- **Minimal Dependencies**: No runtime dependencies (types only)
- **Review Types**: Essential types for review systems
- **Type Safety**: Strong typing for review data structures

## 📊 Package Status

### Development Stage

- [x] **Experimental** - Early development, API may change
- [x] **Alpha** - Core features implemented, testing phase
- [x] **Beta** - Feature complete, API stable, production testing
- [x] **Stable** - Production ready, API frozen
- [ ] **Maintenance** - Bug fixes only, no new features
- [ ] **Deprecated** - Will be removed in future version

**Current Stage**: **Stable**

**Target Stage**: **Stable** (maintained)

### Maturity Indicators

- **Test Coverage**: N/A (types only, no runtime code)
- **TypeScript Coverage**: 100% (target: 100%)
- **Documentation Coverage**: 70% (target: 100%)
- **API Stability**: Stable
- **Breaking Changes**: None in last 6 months
- **Last Major Version**: 0.1.0
- **Next Major Version**: 1.0.0

### Production Readiness

- [x] **API Stability**: Types are stable
- [x] **Error Handling**: N/A (types only)
- [x] **Logging**: N/A (types only)
- [x] **Testing**: Type checking via TypeScript
- [x] **Performance**: N/A (compile-time only)
- [x] **Security**: N/A (types only)
- [x] **Documentation**: Type documentation
- [x] **Migration Guide**: N/A (no breaking changes)

## 🏗️ Architecture

### High-Level Architecture

The review-types package provides type definitions:

```
Type Definitions
    │
    ├──► Severity (union type)
    ├──► RuleItem (rule definition)
    ├──► ReviewFinding (finding structure)
    ├──► RulesJson (rules configuration)
    └──► ReviewJson (review output)
```

### Core Components

#### Type Definitions

- **Purpose**: Define shared types for review systems
- **Responsibilities**: Export types for use in other packages
- **Dependencies**: None (types only)

### Design Patterns

- **Type Library Pattern**: Centralized type definitions
- **Union Types**: Severity as union type for type safety

### Data Flow

```
Import from @kb-labs/shared-review-types
    │
    ├──► TypeScript compiler resolves types
    ├──► Types available at compile time
    └──► No runtime code
```

## 🚀 Quick Start

### Installation

```bash
pnpm add @kb-labs/shared-review-types
```

### Basic Usage

```typescript
import type { Severity, RuleItem, ReviewFinding } from '@kb-labs/shared-review-types';

const rule: RuleItem = {
  id: 'style.no-todo-comment',
  area: 'DX',
  severity: 'minor',
  description: 'Avoid TODO comments in code',
};
```

## ✨ Features

- **Type Definitions**: Complete type definitions for review systems
- **Severity Levels**: Union type for severity levels
- **Rule Definitions**: Comprehensive rule item interface
- **Review Findings**: Finding structure with fingerprinting
- **JSON Formats**: Rules and review JSON format types

## 📦 API Reference

### Main Exports

All types are exported from the main entry point:

```typescript
import type {
  Severity,
  RuleItem,
  ReviewFinding,
  RulesJson,
  ReviewJson
} from '@kb-labs/shared-review-types';
```

### Types & Interfaces

#### `Severity`

```typescript
type Severity = 'critical' | 'major' | 'minor' | 'info';
```

#### `RuleItem`

```typescript
interface RuleItem {
  id: string;
  area: string;
  severity: Severity;
  description: string;
  link: string;
  examples?: Record<string, string[]>;
  scope?: ('changed' | 'file' | 'module' | 'project')[];
  trigger?: {
    type: 'pattern' | 'heuristic' | 'llm' | 'hybrid';
    signals?: string[];
  };
  status?: 'active' | 'experimental' | 'deprecated';
  version?: number;
  experiments?: Record<string, unknown>;
  ask_feedback?: boolean;
}
```

#### `ReviewFinding`

```typescript
interface ReviewFinding {
  rule: string;
  area: string;
  severity: Severity;
  file: string;
  locator: string; // HUNK:@@ ... @@ | Lnum | Lstart-Lend | symbol:Name
  finding: string[]; // Each line starts with a locator
  why: string;
  suggestion: string;
  fingerprint: string; // sha1(rule + '\n' + file + '\n' + locator + '\n' + firstFinding)
}
```

#### `RulesJson`

```typescript
interface RulesJson {
  version: number;
  domain: string;
  metadata?: Record<string, unknown>;
  rules: RuleItem[];
}
```

#### `ReviewJson`

```typescript
interface ReviewJson {
  ai_review: {
    version: 1;
    run_id: string;
    findings: ReviewFinding[];
  };
}
```

## 🔧 Configuration

### Configuration Options

No configuration needed (types only).

### Environment Variables

None (compile-time only).

## 🔗 Dependencies

### Runtime Dependencies

None (types only, no runtime code).

### Development Dependencies

- `@types/node` (`^24.3.3`): Node.js types
- `tsup` (`^8.5.0`): TypeScript bundler
- `typescript` (`^5.6.3`): TypeScript compiler
- `vitest` (`^3.2.4`): Test runner

## 🧪 Testing

### Test Structure

No runtime tests (types only). Type checking is done via TypeScript compiler.

### Type Checking

```bash
# Type check
pnpm type-check

# Build (includes type checking)
pnpm build
```

## 📈 Performance

### Performance Characteristics

- **Compile Time**: Minimal (types only)
- **Runtime**: No runtime code (zero overhead)
- **Bundle Size**: Minimal (types stripped in production)

## 🔒 Security

### Security Considerations

- **Type Safety**: Prevents invalid values at compile time
- **No Runtime Code**: No security vulnerabilities possible

### Known Vulnerabilities

- None (types only)

## 🐛 Known Issues & Limitations

### Known Issues

- None currently

### Limitations

- **Type Only**: No runtime code or utilities
- **Review Types**: Must be updated when review format changes

### Future Improvements

- **Additional Types**: More review-related types as needed
- **Type Utilities**: Type utility functions if needed

## 🔄 Migration & Breaking Changes

### Migration from Previous Versions

No breaking changes in current version (0.1.0).

### Breaking Changes in Future Versions

- None planned

## 📚 Examples

### Example 1: Rule Definition

```typescript
import type { RuleItem, Severity } from '@kb-labs/shared-review-types';

const rule: RuleItem = {
  id: 'style.no-todo-comment',
  area: 'DX',
  severity: 'minor' as Severity,
  description: 'Avoid TODO comments in code',
  link: 'docs/handbook/style.md#no-todo',
  scope: ['changed', 'file'],
  trigger: {
    type: 'pattern',
    signals: ['TODO', 'FIXME'],
  },
};
```

### Example 2: Review Finding

```typescript
import type { ReviewFinding } from '@kb-labs/shared-review-types';

const finding: ReviewFinding = {
  rule: 'style.no-todo-comment',
  area: 'DX',
  severity: 'minor',
  file: 'src/utils.ts',
  locator: 'L42',
  finding: ['[L42] TODO comment found: // TODO: remove later'],
  why: 'Inline TODOs get stale and hide tech debt.',
  suggestion: 'Replace with a link to a tracked ticket.',
  fingerprint: 'abc123...',
};
```

### Example 3: Review JSON

```typescript
import type { ReviewJson } from '@kb-labs/shared-review-types';

const review: ReviewJson = {
  ai_review: {
    version: 1,
    run_id: 'run-123',
    findings: [/* ... findings ... */],
  },
};
```

## 🤝 Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development guidelines.

## 📄 License

MIT © KB Labs

