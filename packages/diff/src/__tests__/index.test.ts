import { describe, it, expect } from 'vitest';
import {
  parseUnifiedDiff,
  listChangedFiles,
  addedLinesByFile,
  removedLinesByFile
} from '../index';

describe('@kb-labs/shared-diff exports', () => {
  it('should export parseUnifiedDiff function', () => {
    expect(typeof parseUnifiedDiff).toBe('function');
  });

  it('should export listChangedFiles function', () => {
    expect(typeof listChangedFiles).toBe('function');
  });

  it('should export addedLinesByFile function', () => {
    expect(typeof addedLinesByFile).toBe('function');
  });

  it('should export removedLinesByFile function', () => {
    expect(typeof removedLinesByFile).toBe('function');
  });

  it('should export types', () => {
    // Test that types are properly exported by checking if we can use them
    const diff = `diff --git a/src/file.ts b/src/file.ts
--- a/src/file.ts
+++ b/src/file.ts
@@ -1,2 +1,3 @@
 line1
+new line
 line2`;

    const parsed = parseUnifiedDiff(diff);
    const files = listChangedFiles(diff);
    const added = addedLinesByFile(diff);
    const removed = removedLinesByFile(diff);

    expect(parsed.files).toEqual(['src/file.ts']);
    expect(files).toEqual(['src/file.ts']);
    expect(added['src/file.ts']).toEqual([
      { line: 2, text: 'new line' }
    ]);
    expect(removed['src/file.ts']).toEqual([]);
  });

  it('should work with all exported functions together', () => {
    const diff = `diff --git a/src/file1.ts b/src/file1.ts
--- a/src/file1.ts
+++ b/src/file1.ts
@@ -1,3 +1,4 @@
 line1
-old line
+new line
 line2

diff --git a/src/file2.ts b/src/file2.ts
--- a/src/file2.ts
+++ b/src/file2.ts
@@ -1,2 +1,3 @@
 line1
+added line
 line2`;

    const parsed = parseUnifiedDiff(diff);
    const files = listChangedFiles(diff);
    const added = addedLinesByFile(diff);
    const removed = removedLinesByFile(diff);

    // All functions should return consistent results
    expect(parsed.files).toEqual(['src/file1.ts', 'src/file2.ts']);
    expect(files).toEqual(['src/file1.ts', 'src/file2.ts']);

    expect(added['src/file1.ts']).toEqual([
      { line: 2, text: 'new line' }
    ]);
    expect(added['src/file2.ts']).toEqual([
      { line: 2, text: 'added line' }
    ]);

    expect(removed['src/file1.ts']).toEqual([
      { line: 2, text: 'old line' }
    ]);
    expect(removed['src/file2.ts']).toEqual([]);
  });
});
