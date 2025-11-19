# @kb-labs/shared-textops

> **Text processing utilities for KB Labs, including parsing, formatting, and manipulation.** Comprehensive collection of neutral text processing utilities for TypeScript/JavaScript projects with normalization, pattern matching, similarity analysis, and text manipulation.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18.18.0+-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-9.0.0+-orange.svg)](https://pnpm.io/)

## 🎯 Vision & Purpose

**@kb-labs/shared-textops** provides comprehensive text processing utilities for KB Labs products. It includes normalization, pattern matching, similarity analysis, token estimation, and text manipulation functions. All utilities are pure functions with no side effects.

### What Problem Does This Solve?

- **Text Normalization**: Products need to normalize text (line endings, whitespace) - textops provides normalization utilities
- **Pattern Matching**: Products need safe regex and glob matching - textops provides pattern matching utilities
- **Similarity Analysis**: Products need to compare text similarity - textops provides similarity algorithms
- **Token Estimation**: Products need token counting for LLMs - textops provides token estimation
- **Text Manipulation**: Products need text operations - textops provides manipulation utilities

### Why Does This Package Exist?

- **Unified Text Utilities**: All KB Labs products use the same text processing utilities
- **Code Reuse**: Avoid duplicating text processing logic
- **Consistency**: Ensure consistent text handling across products
- **Pure Functions**: No side effects, easy to test

### What Makes This Package Unique?

- **Comprehensive Utilities**: Wide range of text processing functions
- **Pure Functions**: No side effects, no external dependencies
- **TypeScript First**: Full type definitions
- **Performance**: Efficient algorithms (Levenshtein, token estimation)

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
- [x] **Performance**: Efficient algorithms
- [x] **Security**: Input validation
- [x] **Documentation**: API documentation and examples
- [x] **Migration Guide**: N/A (no breaking changes)

## 🏗️ Architecture

### High-Level Architecture

The textops package provides text processing utilities:

```
Text Processing Utilities
    │
    ├──► Normalization (line endings, whitespace)
    ├──► Pattern Matching (regex, glob)
    ├──► Similarity Analysis (Levenshtein)
    ├──► Token Estimation (LLM tokens)
    └──► Text Manipulation (snippets, highlighting)
```

### Core Components

#### Normalization

- **Purpose**: Normalize text (line endings, whitespace)
- **Responsibilities**: Line ending conversion, whitespace handling
- **Dependencies**: None (pure functions)

#### Pattern Matching

- **Purpose**: Safe regex and glob matching
- **Responsibilities**: Regex escaping, safe matching, glob matching
- **Dependencies**: None

#### Similarity Analysis

- **Purpose**: Calculate text similarity
- **Responsibilities**: Levenshtein distance, similarity scoring
- **Dependencies**: None

#### Token Estimation

- **Purpose**: Estimate tokens for LLMs
- **Responsibilities**: Token counting, truncation
- **Dependencies**: None

### Design Patterns

- **Utility Pattern**: Pure utility functions
- **Functional Pattern**: Stateless functions

### Data Flow

```
normalizeLineEndings(text)
    │
    ├──► Detect line endings
    ├──► Normalize to LF
    └──► return normalized text

similarity(text1, text2)
    │
    ├──► Calculate Levenshtein distance
    ├──► Normalize to 0-1 range
    └──► return similarity score
```

## 🚀 Quick Start

### Installation

```bash
pnpm add @kb-labs/shared-textops
```

### Basic Usage

```typescript
import { normalizeLineEndings, similarity, estimateTokens } from '@kb-labs/shared-textops';

const normalized = normalizeLineEndings('Hello\r\nWorld');
const score = similarity('hello', 'helo');
const tokens = estimateTokens('Sample text');
```

## ✨ Features

- **Text Normalization**: Line ending normalization, whitespace handling, and encoding utilities
- **Pattern Matching**: Safe regex operations, glob matching, and text highlighting
- **Similarity Analysis**: Levenshtein distance, similarity scoring, and common substring detection
- **Token Management**: Token estimation and text truncation with line preservation
- **Markdown Processing**: Section splitting and structured text analysis
- **TypeScript Support**: Full type definitions and type safety
- **Framework Agnostic**: Pure utilities with no external dependencies

## Installation

```bash
pnpm add @kb-labs/shared-textops
```

## Quick Start

```typescript
import {
  normalizeLineEndings,
  stripAnsi,
  highlightMatches,
  similarity,
  estimateTokens,
  matchGlob,
} from "@kb-labs/shared-textops";

// Normalize text
const normalized = normalizeLineEndings("Hello\r\nWorld\r\n");
// Returns: 'Hello\nWorld\n'

// Remove ANSI escape codes
const clean = stripAnsi("\x1b[31mRed text\x1b[0m");
// Returns: 'Red text'

// Highlight matches
const highlighted = highlightMatches("Hello world", /world/gi);
// Returns: 'Hello <mark>world</mark>'

// Calculate similarity
const score = similarity("hello", "helo");
// Returns: 0.8

// Estimate tokens
const tokens = estimateTokens("This is a sample text");
// Returns: 6

// Match glob patterns
const matches = matchGlob("src/utils.ts", ["src/**/*.ts", "!src/**/*.test.ts"]);
// Returns: true
```

## API Reference

### Text Normalization

- **`normalizeLineEndings(str: string)`** → `string`
  - Converts all line endings to `\n`
  - Handles `\r\n`, `\r`, and mixed line endings

- **`stripAnsi(str: string)`** → `string`
  - Removes ANSI escape codes from strings
  - Useful for cleaning terminal output

- **`normalizeWhitespace(str: string)`** → `string`
  - Normalizes whitespace per line
  - Trims leading/trailing whitespace and normalizes internal spaces

- **`trimLines(str: string)`** → `string`
  - Trims whitespace from each line
  - Preserves line structure

- **`splitLines(str: string)`** → `string[]`
  - Splits text into lines with proper handling of different line endings

### Token Management

- **`estimateTokens(str: string)`** → `number`
  - Estimates token count for text (useful for LLM APIs)
  - Uses simple word-based estimation

- **`truncateByTokens(str: string, maxTokens: number, options?)`** → `string`
  - Truncates text to fit within token limit
  - Options: `preserveLines?: boolean`

### Markdown Processing

- **`splitMarkdownSections(md: string)`** → `MarkdownSection[]`
  - Splits markdown into structured sections
  - Returns headers and content blocks

### Pattern Matching & Highlighting

- **`escapeRegExp(str: string)`** → `string`
  - Escapes special regex characters
  - Safe for use in RegExp constructor

- **`safeMatchAll(str: string, regex: RegExp)`** → `RegExpMatchArray[]`
  - Safe version of `String.matchAll()` with error handling
  - Returns empty array on invalid regex

- **`highlightMatches(str: string, regex: RegExp, tag?: string)`** → `string`
  - Highlights regex matches with HTML tags
  - Default tag: `<mark>`

### Context & Snippets

- **`takeContext(text: string, line: number, before?: number, after?: number)`** → `string`
  - Extracts context around a specific line
  - Useful for error reporting and code snippets

### Glob Matching

- **`matchGlob(path: string, patterns: string[])`** → `boolean`
  - Matches file paths against glob patterns
  - Supports `*`, `?`, `**`, and negation patterns

- **`normalizeGlob(pattern: string)`** → `string`
  - Normalizes glob patterns for consistent matching

- **`dedupGlobs(patterns: string[])`** → `string[]`
  - Removes duplicate and redundant glob patterns

### Similarity Analysis

- **`levenshtein(a: string, b: string)`** → `number`
  - Calculates Levenshtein distance between strings
  - Returns minimum edit distance

- **`similarity(a: string, b: string)`** → `number`
  - Calculates similarity score (0-1) between strings
  - Based on Levenshtein distance

- **`longestCommonSubstr(a: string, b: string)`** → `string`
  - Finds the longest common substring
  - Useful for diff algorithms and text analysis

## Use Cases

- **Code Analysis**: Text processing for linters, formatters, and analyzers
- **Documentation**: Markdown processing and text normalization
- **Search & Highlighting**: Pattern matching and text highlighting
- **Similarity Detection**: Finding similar code blocks or text fragments
- **Token Management**: LLM integration and text truncation
- **File Processing**: Glob matching and path analysis
- **Error Reporting**: Context extraction and text formatting

## 📦 API Reference

### Main Exports

All functions are exported from the main entry point. See detailed API documentation above.

### Types & Interfaces

#### `MarkdownSection`

```typescript
interface MarkdownSection {
  level: number;
  title: string;
  content: string;
  startLine: number;
  endLine: number;
}
```

#### `TruncateOptions`

```typescript
interface TruncateOptions {
  preserveLines?: boolean;
  ellipsis?: string;
}
```

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
├── glob.test.ts
├── index.test.ts
├── normalize.test.ts
├── regex.test.ts
├── similarity.test.ts
└── snippet.test.ts
```

### Test Coverage

- **Current Coverage**: ~90%
- **Target Coverage**: 90%

## 📈 Performance

### Performance Characteristics

- **Time Complexity**: O(n) for most operations, O(n*m) for Levenshtein
- **Space Complexity**: O(n) for most operations, O(n*m) for Levenshtein
- **Bottlenecks**: Levenshtein distance for very long strings

## 🔒 Security

### Security Considerations

- **Input Validation**: All inputs validated
- **No Side Effects**: Pure functions
- **Regex Safety**: Safe regex operations with error handling

### Known Vulnerabilities

- None

## 🐛 Known Issues & Limitations

### Known Issues

- None currently

### Limitations

- **Token Estimation**: Simple word-based estimation (not exact)
- **Levenshtein**: O(n*m) complexity for large strings

### Future Improvements

- **Better Token Estimation**: Integration with actual tokenizers
- **Optimized Levenshtein**: Optimizations for large strings

## 🔄 Migration & Breaking Changes

### Migration from Previous Versions

No breaking changes in current version (0.1.0).

### Breaking Changes in Future Versions

- None planned

## 📚 Examples

### Example 1: Text Normalization

```typescript
import { normalizeLineEndings, stripAnsi } from '@kb-labs/shared-textops';

const normalized = normalizeLineEndings('Hello\r\nWorld\r\n');
const clean = stripAnsi('\x1b[31mRed text\x1b[0m');
```

### Example 2: Similarity Analysis

```typescript
import { similarity, levenshtein } from '@kb-labs/shared-textops';

const score = similarity('hello', 'helo'); // 0.8
const distance = levenshtein('hello', 'helo'); // 1
```

### Example 3: Token Management

```typescript
import { estimateTokens, truncateByTokens } from '@kb-labs/shared-textops';

const tokens = estimateTokens('This is a sample text');
const truncated = truncateByTokens(longText, 100, { preserveLines: true });
```

## Use Cases

- **Code Analysis**: Text processing for linters, formatters, and analyzers
- **Documentation**: Markdown processing and text normalization
- **Search & Highlighting**: Pattern matching and text highlighting
- **Similarity Detection**: Finding similar code blocks or text fragments
- **Token Management**: LLM integration and text truncation
- **File Processing**: Glob matching and path analysis
- **Error Reporting**: Context extraction and text formatting

## 🤝 Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development guidelines.

## 📄 License

MIT © KB Labs
