# @kb-labs/shared-boundaries

> **Package boundary validation utilities for KB Labs, ensuring proper module dependencies.** A neutral module import boundary checker with configurable rules for enforcing architectural constraints in TypeScript/JavaScript projects.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18.18.0+-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-9.0.0+-orange.svg)](https://pnpm.io/)

## 🎯 Vision & Purpose

**@kb-labs/shared-boundaries** provides module import boundary checking utilities for KB Labs products. It enforces architectural constraints by validating that imports follow defined rules, preventing circular dependencies and maintaining clean architecture boundaries.

### What Problem Does This Solve?

- **Architectural Constraints**: Projects need to enforce layer boundaries - boundaries provides validation
- **Circular Dependencies**: Need to prevent circular dependencies - boundaries detects violations
- **Clean Architecture**: Need to maintain separation of concerns - boundaries enforces rules
- **Code Quality**: Need to catch architectural violations early - boundaries provides checking

### Why Does This Package Exist?

- **Unified Boundary Checking**: All KB Labs products use the same boundary checking logic
- **Code Reuse**: Avoid duplicating boundary validation code
- **Consistency**: Ensure consistent architectural enforcement across products
- **Pure Functions**: No side effects, easy to test

### What Makes This Package Unique?

- **Configurable Rules**: Flexible rule-based boundary checking
- **Pattern Matching**: Prefix-based and glob pattern matching
- **Pure Functions**: No side effects, no external dependencies
- **TypeScript First**: Full type definitions

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

- **Test Coverage**: ~85% (target: 90%)
- **TypeScript Coverage**: 100% (target: 100%)
- **Documentation Coverage**: 70% (target: 100%)
- **API Stability**: Stable
- **Breaking Changes**: None in last 6 months
- **Last Major Version**: 0.1.0
- **Next Major Version**: 1.0.0

### Production Readiness

- [x] **API Stability**: API is stable
- [x] **Error Handling**: Comprehensive error handling
- [x] **Logging**: N/A (pure functions)
- [x] **Testing**: Unit tests present
- [x] **Performance**: Efficient pattern matching
- [x] **Security**: Input validation
- [x] **Documentation**: API documentation and examples
- [x] **Migration Guide**: N/A (no breaking changes)

## 🏗️ Architecture

### High-Level Architecture

The boundaries package provides boundary checking:

```
Boundary Checker
    │
    ├──► Rule Specification (define boundaries)
    ├──► Pattern Matching (match files and imports)
    └──► Validation (check if import is allowed)
```

### Core Components

#### Import Checker

- **Purpose**: Check if imports follow boundary rules
- **Responsibilities**: Pattern matching, rule validation
- **Dependencies**: None (pure function)

#### Rule Specification

- **Purpose**: Define boundary rules
- **Responsibilities**: Rule structure, pattern definitions
- **Dependencies**: None

### Design Patterns

- **Strategy Pattern**: Different matching strategies
- **Utility Pattern**: Pure utility functions

### Data Flow

```
makeImportChecker(spec)
    │
    ├──► Parse rules
    ├──► Build checker function
    └──► return checker

checker(fromPath, toPath)
    │
    ├──► Find matching rule for fromPath
    ├──► Check if toPath matches allowedImports
    └──► return boolean
```

## 🚀 Quick Start

### Installation

```bash
pnpm add @kb-labs/shared-boundaries
```

### Basic Usage

```typescript
import { makeImportChecker } from '@kb-labs/shared-boundaries';

const checker = makeImportChecker(spec);
const isAllowed = checker('src/ui/Button.tsx', 'src/business/UserService.ts');
```

## ✨ Features

- **Simple Configuration**: Define boundary rules with file patterns and allowed imports
- **Flexible Matching**: Prefix-based pattern matching with optional glob/regex support
- **TypeScript Support**: Full TypeScript definitions and type safety
- **Framework Agnostic**: No product or domain-specific semantics

## 📦 API Reference

### Main Exports

#### `makeImportChecker(spec: ModuleBoundariesSpec): (fromPath: string, toPath: string) => boolean`

Creates a boundary checker function that validates imports.

**Parameters:**
- `spec` (`ModuleBoundariesSpec`): Boundary specification with rules

**Returns:**
- `(fromPath: string, toPath: string) => boolean`: Checker function that returns true if import is allowed

### Types & Interfaces

#### `ModuleBoundaryRule`

```typescript
interface ModuleBoundaryRule {
  id: string; // Unique identifier for the rule
  files: string[]; // File patterns this rule applies to
  allowedImports?: string[]; // Allowed import patterns (optional)
}
```

#### `ModuleBoundariesSpec`

```typescript
interface ModuleBoundariesSpec {
  version: number; // Specification version
  namespace?: string; // Optional namespace to disambiguate multiple specs
  rules: ModuleBoundaryRule[]; // Array of boundary rules
}
```

### Pattern Matching

Patterns use simple prefix-based matching:
- `**` matches any directory depth
- `*` matches single directory level
- Exact matches and prefix matches are supported

## 🔧 Configuration

### Configuration Options

Boundary rules are defined in the specification object.

### Rule Structure

```typescript
const spec: ModuleBoundariesSpec = {
  version: 1.0,
  namespace: "@myapp",
  rules: [
    {
      id: "ui-layer",
      files: ["src/ui/**/*"],
      allowedImports: ["src/shared/**/*", "src/types/**/*"],
    },
  ],
};
```

## 🔗 Dependencies

### Runtime Dependencies

None (pure functions, no external dependencies).

### Development Dependencies

- `@types/node` (`^24.3.3`): Node.js types
- `tsup` (`^8.5.0`): TypeScript bundler
- `typescript` (`^5.6.3`): TypeScript compiler
- `vitest` (`^3.2.4`): Test runner

## 🧪 Testing

### Test Structure

```
src/__tests__/
├── checker.test.ts
└── index.test.ts
```

### Test Coverage

- **Current Coverage**: ~85%
- **Target Coverage**: 90%

## 📈 Performance

### Performance Characteristics

- **Time Complexity**: O(n*m) where n = number of rules, m = pattern length
- **Space Complexity**: O(n) where n = number of rules
- **Bottlenecks**: Pattern matching for large rule sets

## 🔒 Security

### Security Considerations

- **Input Validation**: All inputs validated
- **No Side Effects**: Pure functions
- **Path Validation**: Path patterns validated

### Known Vulnerabilities

- None

## 🐛 Known Issues & Limitations

### Known Issues

- None currently

### Limitations

- **Simple Matching**: Prefix-based matching (not full glob)
- **No Regex**: Regex patterns not supported (use custom layer)

### Future Improvements

- **Full Glob Support**: Support for full glob patterns
- **Regex Support**: Support for regex patterns
- **Performance**: Optimize for large rule sets

## 🔄 Migration & Breaking Changes

### Migration from Previous Versions

No breaking changes in current version (0.1.0).

### Breaking Changes in Future Versions

- None planned

## 📚 Examples

### Example 1: Layered Architecture

```typescript
import { makeImportChecker, type ModuleBoundariesSpec } from '@kb-labs/shared-boundaries';

const spec: ModuleBoundariesSpec = {
  version: 1.0,
  rules: [
    {
      id: "ui-layer",
      files: ["src/ui/**/*"],
      allowedImports: ["src/shared/**/*", "src/types/**/*"],
    },
    {
      id: "business-layer",
      files: ["src/business/**/*"],
      allowedImports: ["src/shared/**/*", "src/types/**/*", "src/data/**/*"],
    },
  ],
};

const checker = makeImportChecker(spec);
const isAllowed = checker("src/ui/Button.tsx", "src/business/UserService.ts");
// Returns false - UI layer cannot import business layer
```

### Example 2: Package Boundaries

```typescript
const spec: ModuleBoundariesSpec = {
  version: 1.0,
  rules: [
    {
      id: "package-a",
      files: ["packages/a/**/*"],
      allowedImports: ["packages/shared/**/*"],
    },
    {
      id: "package-b",
      files: ["packages/b/**/*"],
      allowedImports: ["packages/shared/**/*"],
    },
  ],
};
```

## Use Cases

- **Layered Architecture**: Enforce separation between UI, business, and data layers
- **Package Boundaries**: Prevent circular dependencies between packages
- **Domain Boundaries**: Maintain clean domain separation in large applications
- **Legacy Migration**: Gradually introduce architectural constraints

## 🤝 Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development guidelines.

## 📄 License

MIT © KB Labs
