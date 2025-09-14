# @kb-labs/shared-boundaries

A neutral module import boundary checker with configurable rules for enforcing architectural constraints in TypeScript/JavaScript projects.

## Features

- **Simple Configuration**: Define boundary rules with file patterns and allowed imports
- **Flexible Matching**: Prefix-based pattern matching with optional glob/regex support
- **TypeScript Support**: Full TypeScript definitions and type safety
- **Framework Agnostic**: No product or domain-specific semantics

## Installation

```bash
pnpm add @kb-labs/shared-boundaries
```

## Quick Start

```typescript
import {
  makeImportChecker,
  type ModuleBoundariesSpec,
} from "@kb-labs/shared-boundaries";

const spec: ModuleBoundariesSpec = {
  version: "1.0",
  namespace: "@myapp",
  rules: [
    {
      id: "ui-layer",
      files: ["src/ui/**/*"],
      allowedImports: ["src/shared/**/*", "src/types/**/*"],
    },
    {
      id: "business-layer",
      files: ["src/business/**/*"],
      allowedImports: ["src/shared/**/*", "src/types/**/*", "src/data/**/*"],
    },
  ],
};

const checker = makeImportChecker(spec);

// Check if import is allowed
const isAllowed = checker("src/ui/Button.tsx", "src/business/UserService.ts");
// Returns false - UI layer cannot import business layer
```

## API Reference

### Types

- **`ModuleBoundaryRule`**: `{ id: string, files: string[], allowedImports?: string[] }`
- **`ModuleBoundariesSpec`**: `{ version: string, namespace?: string, rules: ModuleBoundaryRule[] }`

### Functions

- **`makeImportChecker(spec)`**: Creates a boundary checker function `(fromPath: string, toPath: string) => boolean`

## Configuration

### Rule Structure

```typescript
interface ModuleBoundaryRule {
  id: string; // Unique identifier for the rule
  files: string[]; // File patterns this rule applies to
  allowedImports?: string[]; // Allowed import patterns (optional)
}
```

### Pattern Matching

Patterns use simple prefix-based matching by default. For more complex requirements, you can integrate your own glob or regex matching layer.

## Use Cases

- **Layered Architecture**: Enforce separation between UI, business, and data layers
- **Package Boundaries**: Prevent circular dependencies between packages
- **Domain Boundaries**: Maintain clean domain separation in large applications
- **Legacy Migration**: Gradually introduce architectural constraints

## License

MIT © KB Labs
