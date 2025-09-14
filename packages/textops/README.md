# @kb-labs/shared-textops

A comprehensive collection of neutral text processing utilities for TypeScript/JavaScript projects. Provides normalization, pattern matching, similarity analysis, and text manipulation functions.

## Features

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

## Type Definitions

```typescript
interface MarkdownSection {
  level: number;
  title: string;
  content: string;
  startLine: number;
  endLine: number;
}

interface TruncateOptions {
  preserveLines?: boolean;
  ellipsis?: string;
}
```

## License

MIT © KB Labs
