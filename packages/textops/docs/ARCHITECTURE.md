# Package Architecture Description: @kb-labs/shared-textops

**Version**: 0.1.0
**Last Updated**: 2025-11-16

## Executive Summary

**@kb-labs/shared-textops** provides comprehensive text processing utilities for KB Labs products. It includes normalization, pattern matching, similarity analysis, token estimation, and text manipulation functions. All utilities are pure functions with no side effects.

## 1. Package Overview

### 1.1 Purpose & Scope

**Primary Purpose**: Provide text processing utilities for KB Labs products.

**Scope Boundaries**:
- **In Scope**: Text normalization, pattern matching, similarity, token estimation
- **Out of Scope**: File I/O, network operations

**Domain**: Shared Utilities / Text Processing

### 1.2 Key Responsibilities

1. **Text Normalization**: Normalize line endings, whitespace
2. **Pattern Matching**: Safe regex and glob matching
3. **Similarity Analysis**: Levenshtein distance, similarity scoring
4. **Token Estimation**: Estimate tokens for LLMs

## 2. High-Level Architecture

### 2.1 Architecture Diagram

```
Text Processing Utilities
    │
    ├──► Normalization (line endings, whitespace)
    ├──► Pattern Matching (regex, glob)
    ├──► Similarity Analysis (Levenshtein)
    ├──► Token Estimation (LLM tokens)
    └──► Text Manipulation (snippets, highlighting)
```

### 2.2 Architectural Style

- **Style**: Utility Library Pattern
- **Rationale**: Pure functions for maximum reusability

## 3. Component Architecture

### 3.1 Component: Normalization

- **Purpose**: Normalize text
- **Responsibilities**: Line ending conversion, whitespace handling
- **Dependencies**: None

### 3.2 Component: Pattern Matching

- **Purpose**: Safe regex and glob matching
- **Responsibilities**: Regex escaping, safe matching
- **Dependencies**: None

### 3.3 Component: Similarity Analysis

- **Purpose**: Calculate text similarity
- **Responsibilities**: Levenshtein distance, similarity scoring
- **Dependencies**: None

## 4. Data Flow

```
normalizeLineEndings(text)
    │
    ├──► Detect line endings
    ├──► Normalize to LF
    └──► return normalized text

similarity(text1, text2)
    │
    ├──► Calculate Levenshtein distance
    ├──► Normalize to 0-1 range
    └──► return similarity score
```

## 5. Design Patterns

- **Utility Pattern**: Pure utility functions
- **Functional Pattern**: Stateless functions

## 6. Performance Architecture

- **Time Complexity**: O(n) for most operations, O(n*m) for Levenshtein
- **Space Complexity**: O(n) for most operations, O(n*m) for Levenshtein
- **Bottlenecks**: Levenshtein for very long strings

## 7. Security Architecture

- **Input Validation**: All inputs validated
- **No Side Effects**: Pure functions
- **Regex Safety**: Safe regex operations

---

**Last Updated**: 2025-11-16

