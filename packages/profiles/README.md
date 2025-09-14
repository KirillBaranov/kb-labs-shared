# @kb-labs/shared-profiles

A neutral project profile management system for describing and resolving project structure, rules, and configuration across different environments and contexts.

## Features

- **Profile Resolution**: Hierarchical profile inheritance with environment-specific overrides
- **File System Integration**: Load profiles from JSON files with flexible directory structures
- **Validation**: Built-in profile validation with detailed error reporting
- **Merging**: Intelligent profile merging with array deduplication
- **TypeScript Support**: Full type definitions for all profile structures
- **Framework Agnostic**: No external dependencies or domain-specific logic

## Installation

```bash
pnpm add @kb-labs/shared-profiles
```

## Quick Start

```typescript
import {
  resolveProfile,
  loadProfileFileFromFS,
  mergeProfiles,
  validateProfile,
} from "@kb-labs/shared-profiles";

// Load and resolve a profile
const profile = await resolveProfile({
  repoRoot: "/path/to/project",
  profilesDir: "profiles",
  id: "development",
  envMapper: (env) => ({ NODE_ENV: env }),
  overrides: {
    sources: {
      tests: ["src/**/*.test.ts", "tests/**/*.ts"],
    },
  },
});

// Validate profile structure
const validation = validateProfile(profile);
if (!validation.valid) {
  console.error("Profile validation failed:", validation.errors);
}
```

## Profile Structure

```typescript
interface Profile {
  id: string;
  extends?: string | string[];
  sources: {
    rules?: string[];
    adr?: string[];
    docs?: string[];
    api?: string[];
    src?: string[];
    tests?: string[];
  };
  boundaries?: ModuleBoundariesSpec;
  policies?: {
    [key: string]: any;
  };
  meta?: {
    [key: string]: any;
  };
  schemaVersion: string;
}
```

## API Reference

### Core Functions

- **`resolveProfile(options)`** → `Promise<Profile>`
  - Resolves profile with inheritance chain: defaults → parents → self → envMapper → overrides
  - Handles profile extension and environment-specific overrides

- **`loadProfileFileFromFS({ repoRoot, profilesDir, id })`** → `Promise<Profile>`
  - Loads profile from file system
  - Supports multiple file naming conventions

- **`mergeProfiles(base, override)`** → `Profile`
  - Merges two profiles with intelligent array concatenation and deduplication
  - Preserves type safety and structure

- **`validateProfile(profile)`** → `ValidationResult`
  - Validates profile structure and required fields
  - Returns detailed error information

### Profile Resolution Order

1. **Defaults**: Built-in default profile values
2. **Parents**: Extended profiles (resolved recursively)
3. **Self**: Current profile values
4. **Environment**: Environment-specific overrides via `envMapper`
5. **Overrides**: Final override values

## File System Conventions

### Profile File Locations

Profiles are looked up in the following order:

1. `<repoRoot>/<profilesDir>/<id>/profile.json`
2. `<repoRoot>/<profilesDir>/<id>.profile.json`

### Example Structure

```
project/
├── profiles/
│   ├── default.profile.json
│   ├── development.profile.json
│   ├── production.profile.json
│   └── testing/
│       └── profile.json
└── src/
```

## Use Cases

- **Multi-Environment Configuration**: Different settings for dev/staging/production
- **Project Templates**: Reusable project structures and rules
- **Code Review Tools**: Consistent rules across different projects
- **CI/CD Pipelines**: Environment-specific build and deployment settings
- **Documentation Generation**: Automated docs based on project structure

## Profile Inheritance

```typescript
// base.profile.json
{
  "id": "base",
  "sources": {
    "src": ["src/**/*.ts"],
    "tests": ["**/*.test.ts"]
  },
  "schemaVersion": "1.0"
}

// development.profile.json
{
  "id": "development",
  "extends": "base",
  "sources": {
    "tests": ["**/*.test.ts", "**/*.spec.ts"]  // Extends base tests
  },
  "policies": {
    "strictMode": false
  }
}
```

## License

MIT © KB Labs
