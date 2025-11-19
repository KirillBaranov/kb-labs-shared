# Package Architecture Description: @kb-labs/shared-repo

**Version**: 0.1.0
**Last Updated**: 2025-11-16

## Executive Summary

**@kb-labs/shared-repo** provides repository utilities for KB Labs products. It includes repository root discovery by detecting repository markers (`.git`, `pnpm-workspace.yaml`, `package.json`) and provides utilities for working with repository structure.

## 1. Package Overview

### 1.1 Purpose & Scope

**Primary Purpose**: Provide repository root discovery utilities.

**Scope Boundaries**:
- **In Scope**: Repository root discovery, marker detection
- **Out of Scope**: Git operations, repository analysis

**Domain**: Shared Utilities / Repository Utilities

### 1.2 Key Responsibilities

1. **Repository Discovery**: Detect repository root via markers
2. **Root Resolution**: Resolve repository root directory
3. **Marker Detection**: Check for repository markers

## 2. High-Level Architecture

### 2.1 Architecture Diagram

```
Repository Utilities
    │
    └──► Repository Root Discovery (detect markers)
```

### 2.2 Architectural Style

- **Style**: Utility Pattern
- **Rationale**: Simple utility function for repository detection

## 3. Component Architecture

### 3.1 Component: Repository Root Discovery

- **Purpose**: Find repository root directory
- **Responsibilities**: Detect markers, return root path
- **Dependencies**: None (pure function)

## 4. Data Flow

```
findRepoRoot(startDir)
    │
    ├──► Walk up directory tree
    ├──► Check for markers
    └──► Return repository root
```

## 5. Design Patterns

- **Utility Pattern**: Pure utility functions
- **Strategy Pattern**: Multiple detection strategies

## 6. Performance Architecture

- **Time Complexity**: O(n) where n = directory depth
- **Space Complexity**: O(1)
- **Bottlenecks**: File system access

## 7. Security Architecture

- **Path Validation**: All paths validated
- **No Side Effects**: Pure functions

---

**Last Updated**: 2025-11-16

