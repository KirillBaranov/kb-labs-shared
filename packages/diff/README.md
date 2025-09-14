# @kb-labs/shared-diff

A neutral unified diff parser and analysis utilities for working with Git diffs and patch files in TypeScript/JavaScript projects.

## Features

- **Complete Diff Parsing**: Parse unified diff format with full support for Git features
- **File Analysis**: Extract changed files, added/removed lines, and file statistics
- **Cross-Platform**: Handles different line endings (LF, CRLF) and file paths
- **TypeScript Support**: Full type definitions for all parsed structures
- **Framework Agnostic**: Pure utilities with no external dependencies

## Installation

```bash
pnpm add @kb-labs/shared-diff
```

## Quick Start

```typescript
import {
  parseUnifiedDiff,
  listChangedFiles,
  addedLinesByFile,
  removedLinesByFile,
} from "@kb-labs/shared-diff";

const diffText = `
diff --git a/src/utils.ts b/src/utils.ts
index 1234567..abcdefg 100644
--- a/src/utils.ts
+++ b/src/utils.ts
@@ -1,3 +1,4 @@
 export function hello() {
   return "Hello";
+  // Added comment
 }
`;

// Parse the diff
const parsed = parseUnifiedDiff(diffText);

// Get list of changed files
const changedFiles = listChangedFiles(diffText);
// Returns: ['src/utils.ts']

// Get added lines by file
const addedLines = addedLinesByFile(diffText);
// Returns: { 'src/utils.ts': ['  // Added comment'] }

// Get removed lines by file
const removedLines = removedLinesByFile(diffText);
// Returns: {}
```

## API Reference

### Core Functions

- **`parseUnifiedDiff(diff: string)`** → `ParsedDiff`
  - Parses a unified diff string into a structured format
  - Returns files, hunks, and line-by-line changes

- **`listChangedFiles(diff: string)`** → `string[]`
  - Extracts list of file paths that were modified
  - Handles renames and new/deleted files

- **`addedLinesByFile(diff: string)`** → `Record<string, string[]>`
  - Returns added lines grouped by file path
  - Useful for analyzing new code additions

- **`removedLinesByFile(diff: string)`** → `Record<string, string[]>`
  - Returns removed lines grouped by file path
  - Useful for analyzing code deletions

### Supported Diff Features

- **Git Diffs**: Full support for `git diff` output format
- **File Headers**: `---/+++` file markers and timestamps
- **Special Files**: `/dev/null` for new/deleted files
- **Renames**: File rename detection and tracking
- **Binary Files**: Binary file markers and handling
- **Line Endings**: Automatic CRLF/LF normalization

## Use Cases

- **Code Review Tools**: Analyze changes in pull requests
- **Documentation**: Generate change summaries and release notes
- **Testing**: Verify expected changes in test outputs
- **CI/CD**: Automated change analysis and reporting
- **Migration Tools**: Track code changes during refactoring

## Type Definitions

```typescript
interface ParsedDiff {
  files: DiffFile[];
  metadata?: DiffMetadata;
}

interface DiffFile {
  path: string;
  oldPath?: string; // For renames
  hunks: DiffHunk[];
  isBinary?: boolean;
  isNew?: boolean;
  isDeleted?: boolean;
}

interface DiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: DiffLine[];
}
```

## License

MIT © KB Labs
