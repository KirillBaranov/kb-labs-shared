# Module Boundaries (Shared)

Neutral spec + helper for module import boundaries.

- **ModuleBoundaryRule**: `{ id, files[], allowedImports? }`
- **ModuleBoundariesSpec**: `{ version, namespace?, rules[] }`
- **makeImportChecker(spec)**: `(fromPath, toPath) => boolean`

Patterns are kept intentionally simple (prefix-based).
Plug your own glob/regex layer if you need stricter matching.
No product/domain semantics here.