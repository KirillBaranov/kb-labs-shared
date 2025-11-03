# @kb-labs/shared-repo

A neutral repository utilities library for TypeScript/JavaScript projects. Provides functions for discovering repository root and working with repository structure.

## Features

- **Repository Root Discovery**: Find repository root by looking for markers (`.git`, `pnpm-workspace.yaml`, `package.json`)
- **TypeScript Support**: Full type definitions and type safety
- **Framework Agnostic**: Pure utilities with no external dependencies

## Installation

```bash
pnpm add @kb-labs/shared-repo
```

## Quick Start

```typescript
import { findRepoRoot } from '@kb-labs/shared-repo';

// Find repository root from current directory
const repoRoot = await findRepoRoot();
// Returns: '/path/to/repo'

// Find repository root from specific directory
const repoRoot = await findRepoRoot('/path/to/some/subdirectory');
// Returns: '/path/to/repo' (if markers found)
```

## API Reference

### `findRepoRoot(startDir?: string)` → `Promise<string>`

Find repository root by looking for markers (`.git`, `pnpm-workspace.yaml`, `package.json`) starting from `startDir`.

**Parameters:**
- `startDir` (optional): Starting directory for search. Defaults to `process.cwd()`.

**Returns:** Promise resolving to absolute path of repository root.

**Behavior:**
- Ascends directory tree starting from `startDir`
- Checks for markers in order: `.git`, `pnpm-workspace.yaml`, `package.json`
- Returns first directory containing any marker
- If no markers found, eventually returns filesystem root as fallback

## Examples

### Basic Usage

```typescript
import { findRepoRoot } from '@kb-labs/shared-repo';

// From current working directory
const root = await findRepoRoot();
console.log(root); // '/Users/user/projects/my-repo'
```

### From Subdirectory

```typescript
import { findRepoRoot } from '@kb-labs/shared-repo';

// From specific subdirectory
const root = await findRepoRoot('/Users/user/projects/my-repo/packages/nested/deep');
console.log(root); // '/Users/user/projects/my-repo'
```

### With Custom Starting Point

```typescript
import { findRepoRoot } from '@kb-labs/shared-repo';
import path from 'node:path';

const scriptPath = path.resolve(__dirname, '../some/deep/path');
const repoRoot = await findRepoRoot(scriptPath);
console.log(repoRoot);
```

## License

MIT
