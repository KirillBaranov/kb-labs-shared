# Shared TextOps

Neutral text utilities reused across products.

### Normalize
- `normalizeLineEndings(str)` → `\n`
- `stripAnsi(str)`
- `normalizeWhitespace(str)` (per-line)
- `trimLines(str)`
- `splitLines(str)`
- `estimateTokens(str)`, `truncateByTokens(str, maxTokens, {preserveLines?})`
- `splitMarkdownSections(md)`

### Regex & Highlight
- `escapeRegExp(str)`
- `safeMatchAll(str, /re/g)`
- `highlightMatches(str, /re/)`

### Snippets
- `takeContext(text, line, before?, after?)`

### Globs
- `matchGlob(path, patterns[])` (`*`, `?`, `**`)
- `normalizeGlob(pattern)`
- `dedupGlobs(patterns[])`

### Similarity
- `levenshtein(a,b)`, `similarity(a,b)`, `longestCommonSubstr(a,b)`

No domain semantics. Safe to use in core/shared/products.