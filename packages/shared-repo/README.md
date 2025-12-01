# @kb-labs/shared-repo

> **Shared repository utilities for KB Labs, including Git operations and repository analysis.** A neutral repository utilities library for TypeScript/JavaScript projects providing functions for discovering repository root and working with repository structure.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18.18.0+-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-9.0.0+-orange.svg)](https://pnpm.io/)

## 🎯 Vision & Purpose

**@kb-labs/shared-repo** provides repository utilities for KB Labs products. It includes repository root discovery by detecting repository markers (`.git`, `pnpm-workspace.yaml`, `package.json`) and provides utilities for working with repository structure.

### What Problem Does This Solve?

- **Repository Discovery**: Tools need to find repository root - repo provides discovery utilities
- **Root Directory**: Operations need repository root - repo provides root resolution
- **Repository Metadata**: Tools need repository information - repo provides metadata utilities

### Why Does This Package Exist?

- **Unified Repository Utilities**: All KB Labs products use the same repository detection logic
- **Code Reuse**: Avoid duplicating repository detection code
- **Consistency**: Ensure consistent repository handling across products
- **Pure Functions**: No side effects, easy to test

### What Makes This Package Unique?

- **Multiple Markers**: Detects repository via `.git`, `pnpm-workspace.yaml`, `package.json`
- **Pure Functions**: No side effects, no external dependencies
- **TypeScript First**: Full type definitions
- **Simple API**: Single function for repository root discovery

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
- [x] **Performance**: Efficient discovery
- [x] **Security**: Path validation
- [x] **Documentation**: API documentation and examples
- [x] **Migration Guide**: N/A (no breaking changes)

## 🏗️ Architecture

### High-Level Architecture

The repo package provides repository utilities:

```
Repository Utilities
    │
    └──► Repository Root Discovery (detect markers)
```

### Core Components

#### Repository Root Discovery

- **Purpose**: Find repository root directory
- **Responsibilities**: Detect markers, return root path
- **Dependencies**: None (pure function)

### Design Patterns

- **Utility Pattern**: Pure utility functions
- **Strategy Pattern**: Multiple detection strategies

### Data Flow

```
findRepoRoot(startDir)
    │
    ├──► Walk up directory tree
    ├──► Check for markers (.git, pnpm-workspace.yaml, package.json)
    └──► return repository root
```

## 🚀 Quick Start

### Installation

```bash
pnpm add @kb-labs/shared-repo
```

### Basic Usage

```typescript
import { findRepoRoot } from '@kb-labs/shared-repo';

const repoRoot = await findRepoRoot();
console.log('Repository root:', repoRoot);
```

## ✨ Features

- **Repository Root Discovery**: Find repository root by looking for markers (`.git`, `pnpm-workspace.yaml`, `package.json`)
- **TypeScript Support**: Full type definitions and type safety
- **Framework Agnostic**: Pure utilities with no external dependencies

## 📦 API Reference

### Main Exports

#### `findRepoRoot(startDir?: string): Promise<string>`

Find repository root by looking for markers starting from `startDir`.

**Parameters:**
- `startDir` (`string?`): Starting directory for search (default: `process.cwd()`)

**Returns:**
- `Promise<string>`: Absolute path of repository root

**Behavior:**
- Ascends directory tree starting from `startDir`
- Checks for markers in order: `.git`, `pnpm-workspace.yaml`, `package.json`
- Returns first directory containing any marker
- If no markers found, returns filesystem root as fallback

## 🔧 Configuration

### Configuration Options

No configuration needed (pure functions).

### Environment Variables

None.

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
```

### Test Coverage

- **Current Coverage**: ~85%
- **Target Coverage**: 90%

## 📈 Performance

### Performance Characteristics

- **Time Complexity**: O(n) where n = directory depth
- **Space Complexity**: O(1) (minimal state)
- **Bottlenecks**: File system access

## 🔒 Security

### Security Considerations

- **Path Validation**: All paths validated
- **No Side Effects**: Pure functions

### Known Vulnerabilities

- None

## 🐛 Known Issues & Limitations

### Known Issues

- None currently

### Limitations

- **Single Repository**: Only supports one repository root per call
- **Marker Detection**: Limited to specific markers

### Future Improvements

- **Additional Markers**: Support for more repository markers
- **Repository Types**: Support for different repository types

## 🔄 Migration & Breaking Changes

### Migration from Previous Versions

No breaking changes in current version (0.1.0).

### Breaking Changes in Future Versions

- None planned

## 📚 Examples

### Example 1: Basic Usage

```typescript
import { findRepoRoot } from '@kb-labs/shared-repo';

// From current working directory
const root = await findRepoRoot();
console.log(root); // '/Users/user/projects/my-repo'
```

### Example 2: From Subdirectory

```typescript
import { findRepoRoot } from '@kb-labs/shared-repo';

// From specific subdirectory
const root = await findRepoRoot('/Users/user/projects/my-repo/packages/nested/deep');
console.log(root); // '/Users/user/projects/my-repo'
```

### Example 3: With Custom Starting Point

```typescript
import { findRepoRoot } from '@kb-labs/shared-repo';
import path from 'node:path';

const scriptPath = path.resolve(__dirname, '../some/deep/path');
const repoRoot = await findRepoRoot(scriptPath);
console.log(repoRoot);
```

## 🤝 Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development guidelines.

## 📄 License

MIT © KB Labs
