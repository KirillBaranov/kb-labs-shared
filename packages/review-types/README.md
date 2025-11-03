# @kb-labs/shared-review-types

Neutral TypeScript types for code review systems. Provides common interfaces for rules, findings, severity levels, and review results.

## Installation

```bash
pnpm add @kb-labs/shared-review-types
```

## Usage

```typescript
import type { 
  Severity, 
  RuleItem, 
  ReviewFinding, 
  RulesJson,
  ReviewJson 
} from '@kb-labs/shared-review-types';

const rule: RuleItem = {
  id: 'style.no-todo-comment',
  area: 'DX',
  severity: 'minor',
  description: 'Avoid TODO comments in code',
  link: 'docs/handbook/style.md#no-todo',
};

const finding: ReviewFinding = {
  rule: 'style.no-todo-comment',
  area: 'DX',
  severity: 'minor',
  file: 'src/utils.ts',
  locator: 'L42',
  finding: ['[L42] TODO comment found: // TODO: remove later'],
  why: 'Inline TODOs get stale and hide tech debt.',
  suggestion: 'Replace with a link to a tracked ticket.',
  fingerprint: 'abc123...',
};
```

## Types

- **`Severity`**: `'critical' | 'major' | 'minor' | 'info'`
- **`RuleItem`**: Rule definition with id, severity, description, trigger configuration
- **`ReviewFinding`**: Individual finding with rule, location, message, and fingerprint
- **`RulesJson`**: Complete rules configuration file format
- **`ReviewJson`**: Review output format with findings array

## License

MIT © KB Labs

