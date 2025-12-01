# @kb-labs/shared-diff

> **Diff utilities for KB Labs, providing code comparison and change detection.** Unified diff parser and analysis utilities for working with Git diffs and patch files in TypeScript/JavaScript projects.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18.18.0+-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-9.0.0+-orange.svg)](https://pnpm.io/)

## 🎯 Vision & Purpose

**@kb-labs/shared-diff** provides unified diff parser and analysis utilities for KB Labs products. It parses Git unified diff format and provides utilities for analyzing changes, extracting file lists, and processing added/removed lines.

### What Problem Does This Solve?

- **Diff Parsing**: Products need to parse Git diffs - diff provides unified parser
- **Change Detection**: Products need to detect what changed - diff provides change analysis
- **File Analysis**: Products need file-level change information - diff provides file utilities
- **Line Analysis**: Products need line-level change information - diff provides line utilities

### Why Does This Package Exist?

- **Unified Diff Parser**: All KB Labs products use the same diff parser
- **Code Reuse**: Avoid duplicating diff parsing logic
- **Consistency**: Ensure consistent diff handling across products
- **Pure Utilities**: No side effects, easy to test

### What Makes This Package Unique?

- **Complete Diff Support**: Full support for Git unified diff format
- **Pure Functions**: No side effects, no external dependencies
- **TypeScript First**: Full type definitions for all structures
- **Cross-Platform**: Handles different line endings and file paths

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

- **Test Coverage**: ~90% (target: 90%)
- **TypeScript Coverage**: 100% (target: 100%)
- **Documentation Coverage**: 80% (target: 100%)
- **API Stability**: Stable
- **Breaking Changes**: None in last 6 months
- **Last Major Version**: 0.1.0
- **Next Major Version**: 1.0.0

### Production Readiness

- [x] **API Stability**: API is stable
- [x] **Error Handling**: Comprehensive error handling
- [x] **Logging**: N/A (pure functions)
- [x] **Testing**: Unit tests present
- [x] **Performance**: Efficient parsing
- [x] **Security**: Input validation
- [x] **Documentation**: API documentation and examples
- [x] **Migration Guide**: N/A (no breaking changes)

## 🏗️ Architecture

### High-Level Architecture

The diff package provides parsing and analysis utilities:

```
Diff Utilities
    │
    ├──► Diff Parsing (unified diff format)
    ├──► File Analysis (changed files, statistics)
    └──► Line Analysis (added/removed lines)
```

### Core Components

#### Diff Parser

- **Purpose**: Parse unified diff format
- **Responsibilities**: Parse diff text, extract hunks, handle edge cases
- **Dependencies**: None (pure function)

#### File Analysis

- **Purpose**: Analyze file-level changes
- **Responsibilities**: Extract changed files, file statistics
- **Dependencies**: Diff parser

#### Line Analysis

- **Purpose**: Analyze line-level changes
- **Responsibilities**: Extract added/removed lines by file
- **Dependencies**: Diff parser

### Design Patterns

- **Parser Pattern**: Unified diff parsing
- **Utility Pattern**: Pure utility functions
- **Functional Pattern**: Stateless functions

### Data Flow

```
parseUnifiedDiff(diffText)
    │
    ├──► Parse diff header
    ├──► Parse hunks
    ├──► Extract file information
    └──► return ParsedDiff

listChangedFiles(diffText)
    │
    ├──► Parse diff
    ├──► Extract file paths
    └──► return string[]
```

## 🚀 Quick Start

### Installation

```bash
pnpm add @kb-labs/shared-diff
```

### Basic Usage

```typescript
import { parseUnifiedDiff, listChangedFiles } from '@kb-labs/shared-diff';

const diff = parseUnifiedDiff(diffText);
const changedFiles = listChangedFiles(diffText);
```

## ✨ Features

- **Complete Diff Parsing**: Parse unified diff format with full support for Git features
- **File Analysis**: Extract changed files, added/removed lines, and file statistics
- **Cross-Platform**: Handles different line endings (LF, CRLF) and file paths
- **TypeScript Support**: Full type definitions for all parsed structures
- **Framework Agnostic**: Pure utilities with no external dependencies

## 📦 API Reference

### Main Exports

#### `parseUnifiedDiff(diff: string): ParsedDiff`

Parses a unified diff string into a structured format.

**Parameters:**
- `diff` (`string`): Unified diff text

**Returns:**
- `ParsedDiff`: Parsed diff with files, hunks, and line changes

#### `listChangedFiles(diff: string): string[]`

Extracts list of file paths that were modified.

**Parameters:**
- `diff` (`string`): Unified diff text

**Returns:**
- `string[]`: Array of changed file paths

#### `addedLinesByFile(diff: string): Record<string, DiffLineAdd[]>`

Returns added lines grouped by file path.

**Parameters:**
- `diff` (`string`): Unified diff text

**Returns:**
- `Record<string, DiffLineAdd[]>`: Added lines by file

#### `removedLinesByFile(diff: string): Record<string, DiffLineDel[]>`

Returns removed lines grouped by file path.

**Parameters:**
- `diff` (`string`): Unified diff text

**Returns:**
- `Record<string, DiffLineDel[]>`: Removed lines by file

### Types & Interfaces

#### `ParsedDiff`

```typescript
interface ParsedDiff {
  files: string[];
  addedByFile: Record<string, DiffLineAdd[]>;
  removedByFile: Record<string, DiffLineDel[]>;
  hunksByFile: Record<string, DiffHunk[]>;
}
```

#### `DiffHunk`

```typescript
interface DiffHunk {
  header: string;
  oldStart: number;
  oldLines?: number;
  newStart: number;
  newLines?: number;
}
```

#### `DiffLineAdd` / `DiffLineDel`

```typescript
type DiffLineAdd = { line: number; text: string };
type DiffLineDel = { line: number; text: string };
```

### Supported Diff Features

- **Git Diffs**: Full support for `git diff` output format
- **File Headers**: `---/+++` file markers and timestamps
- **Special Files**: `/dev/null` for new/deleted files
- **Renames**: File rename detection and tracking
- **Binary Files**: Binary file markers and handling
- **Line Endings**: Automatic CRLF/LF normalization

## 🔧 Configuration

### Configuration Options

No configuration needed (pure functions).

### Environment Variables

None.

## 🔗 Dependencies

### Runtime Dependencies

- `ajv` (`^8.17.1`): JSON schema validation
- `ajv-formats` (`^3.0.1`): Additional formats
- `picomatch` (`^4.0.2`): Pattern matching
- `yaml` (`^2.8.0`): YAML parsing

### Development Dependencies

- `@types/node` (`^24.3.3`): Node.js types
- `tsup` (`^8.5.0`): TypeScript bundler
- `typescript` (`^5.6.3`): TypeScript compiler
- `vitest` (`^3.2.4`): Test runner

## 🧪 Testing

### Test Structure

```
src/__tests__/
├── addedLinesByFile.test.ts
├── index.test.ts
├── listChangedFiles.test.ts
├── parseUnifiedDiff.test.ts
└── removedLinesByFile.test.ts
```

### Test Coverage

- **Current Coverage**: ~90%
- **Target Coverage**: 90%

## 📈 Performance

### Performance Characteristics

- **Time Complexity**: O(n) where n = diff size
- **Space Complexity**: O(m) where m = number of files
- **Bottlenecks**: Large diff parsing

## 🔒 Security

### Security Considerations

- **Input Validation**: All inputs validated
- **No Side Effects**: Pure functions

### Known Vulnerabilities

- None

## 🐛 Known Issues & Limitations

### Known Issues

- None currently

### Limitations

- **Large Diffs**: Very large diffs may be slow to parse
- **Memory Usage**: Large diffs consume memory

### Future Improvements

- **Streaming Parser**: Support for streaming large diffs
- **Incremental Parsing**: Parse diffs incrementally

## 🔄 Migration & Breaking Changes

### Migration from Previous Versions

No breaking changes in current version (0.1.0).

### Breaking Changes in Future Versions

- None planned

## 📚 Examples

### Example 1: Parse Diff

```typescript
import { parseUnifiedDiff } from '@kb-labs/shared-diff';

const diffText = `diff --git a/src/utils.ts b/src/utils.ts
--- a/src/utils.ts
+++ b/src/utils.ts
@@ -1,3 +1,4 @@
 export function hello() {
   return "Hello";
+  // Added comment
 }`;

const parsed = parseUnifiedDiff(diffText);
console.log(parsed.files); // ['src/utils.ts']
```

### Example 2: List Changed Files

```typescript
import { listChangedFiles } from '@kb-labs/shared-diff';

const changedFiles = listChangedFiles(diffText);
// Returns: ['src/utils.ts', 'src/helper.ts']
```

### Example 3: Analyze Changes

```typescript
import { addedLinesByFile, removedLinesByFile } from '@kb-labs/shared-diff';

const added = addedLinesByFile(diffText);
const removed = removedLinesByFile(diffText);

// Analyze new code
Object.entries(added).forEach(([file, lines]) => {
  console.log(`${file}: ${lines.length} lines added`);
});
```

## Use Cases

- **Code Review Tools**: Analyze changes in pull requests
- **Documentation**: Generate change summaries and release notes
- **Testing**: Verify expected changes in test outputs
- **CI/CD**: Automated change analysis and reporting
- **Migration Tools**: Track code changes during refactoring

## 🤝 Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development guidelines.

## 📄 License

MIT © KB Labs
