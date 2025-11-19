# Package Architecture Description: @kb-labs/shared-diff

**Version**: 0.1.0
**Last Updated**: 2025-11-16

## Executive Summary

**@kb-labs/shared-diff** provides unified diff parser and analysis utilities for KB Labs products. It parses Git unified diff format and provides utilities for analyzing changes, extracting file lists, and processing added/removed lines. The package consists of pure functions with no side effects.

## 1. Package Overview

### 1.1 Purpose & Scope

**Primary Purpose**: Provide unified diff parser and analysis utilities.

**Scope Boundaries**:
- **In Scope**: Diff parsing, file analysis, line analysis
- **Out of Scope**: Git operations, file system operations

**Domain**: Shared Utilities / Diff Processing

### 1.2 Key Responsibilities

1. **Diff Parsing**: Parse unified diff format
2. **File Analysis**: Extract changed files
3. **Line Analysis**: Extract added/removed lines

## 2. High-Level Architecture

### 2.1 Architecture Diagram

```
Diff Utilities
    │
    ├──► Diff Parser (parseUnifiedDiff)
    ├──► File Analysis (listChangedFiles)
    └──► Line Analysis (addedLinesByFile, removedLinesByFile)
```

### 2.2 Architectural Style

- **Style**: Parser Pattern with Utility Functions
- **Rationale**: Pure functions for maximum reusability

## 3. Component Architecture

### 3.1 Component: Diff Parser

- **Purpose**: Parse unified diff format
- **Responsibilities**: Parse diff text, extract hunks, handle edge cases
- **Dependencies**: None (pure function)

### 3.2 Component: File Analysis

- **Purpose**: Analyze file-level changes
- **Responsibilities**: Extract changed files
- **Dependencies**: Diff parser

### 3.3 Component: Line Analysis

- **Purpose**: Analyze line-level changes
- **Responsibilities**: Extract added/removed lines
- **Dependencies**: Diff parser

## 4. Data Flow

```
parseUnifiedDiff(diffText)
    │
    ├──► Parse diff header
    ├──► Parse hunks
    ├──► Extract file information
    └──► return ParsedDiff

listChangedFiles(diffText)
    │
    ├──► Parse diff
    ├──► Extract file paths
    └──► return string[]
```

## 5. Design Patterns

- **Parser Pattern**: Unified diff parsing
- **Utility Pattern**: Pure utility functions
- **Functional Pattern**: Stateless functions

## 6. Performance Architecture

- **Time Complexity**: O(n) where n = diff size
- **Space Complexity**: O(m) where m = number of files
- **Bottlenecks**: Large diff parsing

## 7. Security Architecture

- **Input Validation**: All inputs validated
- **No Side Effects**: Pure functions

---

**Last Updated**: 2025-11-16

