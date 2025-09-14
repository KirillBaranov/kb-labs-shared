# Shared Diff Utilities

Neutral unified-diff parser and helpers.

- **parseUnifiedDiff(diff)** → `ParsedDiff` (files, hunks, added/removed lines)
- **listChangedFiles(diff)** → `string[]`
- **addedLinesByFile(diff)** / **removedLinesByFile(diff)** → `Record<file, lines[]>`

Supports: `diff --git`, `---/+++`, `/dev/null`, rename markers, binary markers, CRLF.

No domain terms; pure AST you can reuse in review/docs/tests.