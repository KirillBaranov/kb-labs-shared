# @kb-labs/shared-cli-ui

Shared CLI utilities for KB Labs ecosystem, including command suggestions, validation, and multi-CLI support.

## Features

- **Command Suggestions**: Generate contextual suggestions for CLI commands
- **Command Validation**: Check if commands are available before suggesting them
- **Multi-CLI Support**: Manage suggestions across multiple CLI packages
- **Manifest Parsing**: Extract command information from CLI manifests
- **Consistent UX**: Shared UI components and styling

## Quick Start

### Basic Command Suggestions

```typescript
import { 
  createCommandRegistry, 
  generateDevlinkSuggestions 
} from '@kb-labs/shared-cli-ui';

// Create a registry of available commands
const registry = createCommandRegistry([
  'devlink:apply',
  'devlink:clean',
  'devlink:plan'
]);

// Generate suggestions based on warnings
const suggestions = generateDevlinkSuggestions(
  new Set(['LOCK_MISMATCH']),
  { undo: { available: true } },
  registry
);
```

### Multi-CLI Integration

```typescript
import { MultiCLISuggestions } from '@kb-labs/shared-cli-ui';

// Create a multi-CLI manager
const manager = new MultiCLISuggestions();

// Register your CLI package
manager.registerPackage({
  name: 'my-cli',
  group: 'my-cli',
  commands: myCommands,
  priority: 80
});

// Generate suggestions from all registered packages
const suggestions = manager.generateAllSuggestions({
  warningCodes: new Set(['MY_WARNING']),
  undo: { available: true }
});
```

## Integration Guide

### 1. Create CLI Suggestions Module

Create a `cli-suggestions.ts` file in your CLI package:

```typescript
import { 
  MultiCLISuggestions, 
  type CommandSuggestion 
} from '@kb-labs/shared-cli-ui';
import { commands } from './cli.manifest.js';

export function generateMyCLISuggestions(
  warningCodes: Set<string>,
  context: any
): CommandSuggestion[] {
  const suggestions: CommandSuggestion[] = [];

  if (warningCodes.has('MY_WARNING')) {
    suggestions.push({
      id: 'MY_COMMAND',
      command: 'kb my-cli command',
      args: [],
      description: 'Execute my command',
      impact: 'safe',
      when: 'MY_WARNING',
      available: true
    });
  }

  return suggestions;
}

export function createMyCLISuggestions(): MultiCLISuggestions {
  const manager = new MultiCLISuggestions();
  
  manager.registerPackage({
    name: 'my-cli',
    group: 'my-cli',
    commands,
    priority: 80
  });

  return manager;
}
```

### 2. Register with Main CLI

In your main CLI (e.g., devlink), register the package:

```typescript
import { MultiCLISuggestions } from '@kb-labs/shared-cli-ui';
import { createMyCLISuggestions } from '@kb-labs/my-cli/cli-suggestions';

const multiCLI = new MultiCLISuggestions();

// Register all CLI packages
multiCLI.registerPackage(devlinkPackage);
multiCLI.registerPackage(myCLIPackage);

// Generate suggestions
const suggestions = multiCLI.generateAllSuggestions(context);
```

### 3. Command Priority

Set priority for your CLI package:
- **100**: Core tools (devlink)
- **80**: Important tools (mind)
- **70**: Utility tools (tox)
- **50**: Optional tools (ai-review)

## API Reference

### CommandSuggestion

```typescript
interface CommandSuggestion {
  id: string;
  command: string;
  args: string[];
  description: string;
  impact: 'safe' | 'disruptive';
  when: string;
  available?: boolean;
}
```

### MultiCLISuggestions

```typescript
class MultiCLISuggestions {
  registerPackage(pkg: CLIPackage): void;
  generateAllSuggestions(context: MultiCLIContext): CommandSuggestion[];
  generateGroupSuggestions(group: string, context: MultiCLIContext): CommandSuggestion[];
  getAvailableCommands(group: string): string[];
}
```

### Command Registry

```typescript
function createCommandRegistry(commands: string[]): CommandRegistry;
function isCommandAvailable(command: string, registry: CommandRegistry): boolean;
function validateSuggestions(suggestions: CommandSuggestion[], registry: CommandRegistry): CommandSuggestion[];
```

## Artifacts Display

The artifacts display system provides consistent, beautiful display of generated files and artifacts across all CLI commands.

### Features

- **Consistent Formatting**: Unified display format across all CLI packages
- **Multiple Display Modes**: Compact, detailed, and grouped views
- **Smart Sorting**: By time (newest first) by default, with type and custom options
- **Size & Time Info**: Human-readable file sizes and relative timestamps
- **Path Normalization**: Shows relative paths for better readability
- **Federal Sorting**: All CLI packages automatically get time-based sorting

### Usage

```typescript
import { 
  displayArtifacts,
  displayArtifactsCompact,
  displaySingleArtifact,
  type ArtifactInfo 
} from '@kb-labs/shared-cli-ui';

// Define artifacts
const artifacts: ArtifactInfo[] = [
  {
    name: 'Plan',
    path: '/path/to/.kb/devlink/last-plan.json',
    size: 1024,
    modified: new Date(),
    description: 'Last generated plan'
  },
  {
    name: 'Lock',
    path: '/path/to/.kb/devlink/lock.json',
    size: 2048,
    modified: new Date(Date.now() - 3600000),
    description: 'Dependency lock file'
  }
];

// Display in compact format (for status-like displays)
const compactDisplay = displayArtifactsCompact(artifacts, { 
  maxItems: 5,
  showSize: true 
});

// Display with full details
const fullDisplay = displayArtifacts(artifacts, {
  showSize: true,
  showTime: true,
  showDescription: true,
  maxItems: 10,
  title: 'Generated Files',
  groupBy: 'type'
});

// Display single artifact
const singleDisplay = displaySingleArtifact(artifacts[0], 'Latest Artifact');
```

### Display Options

```typescript
interface ArtifactDisplayOptions {
  showSize?: boolean;        // Show file sizes (default: true)
  showTime?: boolean;        // Show modification times (default: true)
  showDescription?: boolean; // Show descriptions (default: false)
  maxItems?: number;         // Maximum items to show (default: 10)
  title?: string;            // Section title (default: 'Generated Artifacts')
  groupBy?: 'none' | 'type' | 'time'; // Grouping strategy (default: 'none')
}
```

### Integration in CLI Commands

```typescript
import { displayArtifactsCompact } from '@kb-labs/shared-cli-ui';
import { discoverArtifacts } from './my-artifact-discovery';

export const run: CommandModule['run'] = async (ctx, _argv, flags) => {
  // ... your command logic ...
  
  // Show artifacts after operation
  const artifacts = await discoverArtifacts(process.cwd());
  const artifactsInfo = displayArtifactsCompact(artifacts, { maxItems: 5 });
  
  const output = box('My Command', [
    ...summary,
    ...artifactsInfo
  ]);
  
  ctx.presenter.write(output);
};
```

## Examples

See the following packages for integration examples:
- `kb-labs-mind/packages/mind-cli/src/cli-suggestions.ts`
- `kb-labs-tox/packages/tox-cli/src/cli-suggestions.ts`
- `kb-labs-ai-review/packages/ai-review/src/cli-suggestions.ts`
