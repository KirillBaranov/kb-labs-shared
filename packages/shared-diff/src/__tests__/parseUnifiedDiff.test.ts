import { describe, it, expect } from 'vitest';
import { parseUnifiedDiff } from '../parseUnifiedDiff';

describe('parseUnifiedDiff', () => {
  it('should parse a simple diff with additions and deletions', () => {
    const diff = `diff --git a/src/file.ts b/src/file.ts
index 1234567..abcdefg 100644
--- a/src/file.ts
+++ b/src/file.ts
@@ -1,3 +1,4 @@
 line1
-line2
+new line
+another line
 line3`;

    const result = parseUnifiedDiff(diff);

    expect(result.files).toEqual(['src/file.ts']);
    expect(result.addedByFile['src/file.ts']).toEqual([
      { line: 2, text: 'new line' },
      { line: 3, text: 'another line' }
    ]);
    expect(result.removedByFile['src/file.ts']).toEqual([
      { line: 2, text: 'line2' }
    ]);
    expect(result.hunksByFile['src/file.ts']).toEqual([
      {
        header: '@@ -1,3 +1,4 @@',
        oldStart: 1,
        oldLines: 3,
        newStart: 1,
        newLines: 4
      }
    ]);
  });

  it('should handle multiple files', () => {
    const diff = `diff --git a/src/file1.ts b/src/file1.ts
--- a/src/file1.ts
+++ b/src/file1.ts
@@ -1,2 +1,3 @@
 line1
+new line
 line2

diff --git a/src/file2.ts b/src/file2.ts
--- a/src/file2.ts
+++ b/src/file2.ts
@@ -1,2 +1,2 @@
-line1
+modified line
 line2`;

    const result = parseUnifiedDiff(diff);

    expect(result.files).toEqual(['src/file1.ts', 'src/file2.ts']);
    expect(result.addedByFile['src/file1.ts']).toEqual([
      { line: 2, text: 'new line' }
    ]);
    expect(result.removedByFile['src/file2.ts']).toEqual([
      { line: 1, text: 'line1' }
    ]);
    expect(result.addedByFile['src/file2.ts']).toEqual([
      { line: 1, text: 'modified line' }
    ]);
  });

  it('should handle new files (+++ /dev/null)', () => {
    const diff = `diff --git a/src/newfile.ts b/src/newfile.ts
new file mode 100644
index 0000000..1234567
--- /dev/null
+++ b/src/newfile.ts
@@ -0,0 +1,2 @@
+line1
+line2`;

    const result = parseUnifiedDiff(diff);

    expect(result.files).toEqual(['src/newfile.ts']);
    expect(result.addedByFile['src/newfile.ts']).toEqual([
      { line: 1, text: 'line1' },
      { line: 2, text: 'line2' }
    ]);
    expect(result.removedByFile['src/newfile.ts']).toEqual([]);
  });

  it('should handle deleted files (--- /dev/null)', () => {
    const diff = `diff --git a/src/oldfile.ts b/src/oldfile.ts
deleted file mode 100644
index 1234567..0000000
--- a/src/oldfile.ts
+++ /dev/null
@@ -1,2 +0,0 @@
-line1
-line2`;

    const result = parseUnifiedDiff(diff);

    expect(result.files).toEqual([]);
    expect(result.addedByFile).toEqual({});
    expect(result.removedByFile).toEqual({});
    expect(result.hunksByFile).toEqual({});
  });

  it('should handle rename operations', () => {
    const diff = `diff --git a/src/oldname.ts b/src/newname.ts
similarity index 95%
rename from src/oldname.ts
rename to src/newname.ts
index 1234567..abcdefg 100644
--- a/src/oldname.ts
+++ b/src/newname.ts
@@ -1,2 +1,2 @@
 line1
-modified line
+updated line
 line3`;

    const result = parseUnifiedDiff(diff);

    expect(result.files).toEqual(['src/newname.ts']);
    expect(result.removedByFile['src/newname.ts']).toEqual([
      { line: 2, text: 'modified line' }
    ]);
    expect(result.addedByFile['src/newname.ts']).toEqual([
      { line: 2, text: 'updated line' }
    ]);
  });

  it('should handle binary files', () => {
    const diff = `diff --git a/binary.bin b/binary.bin
index 1234567..abcdefg 100644
Binary files a/binary.bin and b/binary.bin differ`;

    const result = parseUnifiedDiff(diff);

    expect(result.files).toEqual([]);
  });

  it('should handle CRLF line endings', () => {
    const diff = `diff --git a/src/file.ts b/src/file.ts\r\n--- a/src/file.ts\r\n+++ b/src/file.ts\r\n@@ -1,2 +1,3 @@\r\n line1\r\n+new line\r\n line2`;

    const result = parseUnifiedDiff(diff);

    expect(result.files).toEqual(['src/file.ts']);
    expect(result.addedByFile['src/file.ts']).toEqual([
      { line: 2, text: 'new line' }
    ]);
  });

  it('should handle empty diff', () => {
    const result = parseUnifiedDiff('');

    expect(result.files).toEqual([]);
    expect(result.addedByFile).toEqual({});
    expect(result.removedByFile).toEqual({});
    expect(result.hunksByFile).toEqual({});
  });

  it('should handle hunk headers without line counts', () => {
    const diff = `diff --git a/src/file.ts b/src/file.ts
--- a/src/file.ts
+++ b/src/file.ts
@@ -1 +1,2 @@
 line1
+new line`;

    const result = parseUnifiedDiff(diff);

    expect(result.hunksByFile['src/file.ts']).toEqual([
      {
        header: '@@ -1 +1,2 @@',
        oldStart: 1,
        oldLines: undefined,
        newStart: 1,
        newLines: 2
      }
    ]);
  });

  it('should handle context lines', () => {
    const diff = `diff --git a/src/file.ts b/src/file.ts
--- a/src/file.ts
+++ b/src/file.ts
@@ -1,5 +1,6 @@
 line1
 line2
+new line
 line3
 line4
 line5`;

    const result = parseUnifiedDiff(diff);

    expect(result.addedByFile['src/file.ts']).toEqual([
      { line: 3, text: 'new line' }
    ]);
    expect(result.removedByFile['src/file.ts']).toEqual([]);
  });

  it('should handle file paths with a/ and b/ prefixes', () => {
    const diff = `diff --git a/src/file.ts b/src/file.ts
--- a/src/file.ts
+++ b/src/file.ts
@@ -1,2 +1,3 @@
 line1
+new line
 line2`;

    const result = parseUnifiedDiff(diff);

    expect(result.files).toEqual(['src/file.ts']);
  });

  it('should handle malformed diff gracefully', () => {
    const diff = `not a proper diff
some random content
+++ b/src/file.ts
+added line`;

    const result = parseUnifiedDiff(diff);

    expect(result.files).toEqual(['src/file.ts']);
    expect(result.addedByFile['src/file.ts']).toEqual([
      { line: 0, text: 'added line' }
    ]);
  });
});
