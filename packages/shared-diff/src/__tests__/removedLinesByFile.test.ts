import { describe, it, expect } from 'vitest';
import { removedLinesByFile } from '../removedLinesByFile';

describe('removedLinesByFile', () => {
  it('should extract removed lines from a simple diff', () => {
    const diff = `diff --git a/src/file.ts b/src/file.ts
index 1234567..abcdefg 100644
--- a/src/file.ts
+++ b/src/file.ts
@@ -1,3 +1,2 @@
 line1
-line2
-line3
+new line`;

    const result = removedLinesByFile(diff);

    expect(result).toEqual({
      'src/file.ts': [
        { line: 2, text: 'line2' },
        { line: 3, text: 'line3' }
      ]
    });
  });

  it('should handle multiple files', () => {
    const diff = `diff --git a/src/file1.ts b/src/file1.ts
--- a/src/file1.ts
+++ b/src/file1.ts
@@ -1,3 +1,2 @@
 line1
-old line
 line2

diff --git a/src/file2.ts b/src/file2.ts
--- a/src/file2.ts
+++ b/src/file2.ts
@@ -1,3 +1,2 @@
 line1
-another old line
 line2`;

    const result = removedLinesByFile(diff);

    expect(result).toEqual({
      'src/file1.ts': [
        { line: 2, text: 'old line' }
      ],
      'src/file2.ts': [
        { line: 2, text: 'another old line' }
      ]
    });
  });

  it('should handle new files', () => {
    const diff = `diff --git a/src/newfile.ts b/src/newfile.ts
new file mode 100644
index 0000000..1234567
--- /dev/null
+++ b/src/newfile.ts
@@ -0,0 +1,2 @@
+line1
+line2`;

    const result = removedLinesByFile(diff);

    expect(result).toEqual({
      'src/newfile.ts': []
    });
  });

  it('should handle deleted files', () => {
    const diff = `diff --git a/src/oldfile.ts b/src/oldfile.ts
deleted file mode 100644
index 1234567..0000000
--- a/src/oldfile.ts
+++ /dev/null
@@ -1,2 +0,0 @@
-line1
-line2`;

    const result = removedLinesByFile(diff);

    expect(result).toEqual({});
  });

  it('should handle CRLF line endings', () => {
    const diff = `diff --git a/src/file.ts b/src/file.ts\r\n--- a/src/file.ts\r\n+++ b/src/file.ts\r\n@@ -1,2 +1,2 @@\r\n line1\r\n-old line\r\n+new line`;

    const result = removedLinesByFile(diff);

    expect(result).toEqual({
      'src/file.ts': [
        { line: 2, text: 'old line' }
      ]
    });
  });

  it('should handle empty diff', () => {
    const result = removedLinesByFile('');

    expect(result).toEqual({});
  });

  it('should handle context lines correctly', () => {
    const diff = `diff --git a/src/file.ts b/src/file.ts
--- a/src/file.ts
+++ b/src/file.ts
@@ -1,5 +1,4 @@
 line1
 line2
-old line
 line3
 line4`;

    const result = removedLinesByFile(diff);

    expect(result).toEqual({
      'src/file.ts': [
        { line: 3, text: 'old line' }
      ]
    });
  });

  it('should handle hunk headers without line counts', () => {
    const diff = `diff --git a/src/file.ts b/src/file.ts
--- a/src/file.ts
+++ b/src/file.ts
@@ -1,2 +1,1 @@
 line1
-old line`;

    const result = removedLinesByFile(diff);

    expect(result).toEqual({
      'src/file.ts': [
        { line: 2, text: 'old line' }
      ]
    });
  });

  it('should ignore lines starting with --- that are not file headers', () => {
    const diff = `diff --git a/src/file.ts b/src/file.ts
--- a/src/file.ts
+++ b/src/file.ts
@@ -1,2 +1,2 @@
 line1
-line with --- prefix
+new line`;

    const result = removedLinesByFile(diff);

    expect(result).toEqual({
      'src/file.ts': [
        { line: 2, text: 'line with --- prefix' }
      ]
    });
  });

  it('should handle malformed diff gracefully', () => {
    const diff = `not a proper diff
some random content
+++ b/src/file.ts
-removed line`;

    const result = removedLinesByFile(diff);

    expect(result).toEqual({
      'src/file.ts': [
        { line: 0, text: 'removed line' }
      ]
    });
  });

  it('should handle file paths with trailing whitespace', () => {
    const diff = `diff --git a/src/file.ts b/src/file.ts
--- a/src/file.ts
+++ b/src/file.ts   
@@ -1,2 +1,2 @@
 line1
-old line
+new line`;

    const result = removedLinesByFile(diff);

    expect(result).toEqual({
      'src/file.ts': [
        { line: 2, text: 'old line' }
      ]
    });
  });

  it('should handle mixed additions and deletions', () => {
    const diff = `diff --git a/src/file.ts b/src/file.ts
--- a/src/file.ts
+++ b/src/file.ts
@@ -1,4 +1,4 @@
 line1
-old line 1
+new line 1
-old line 2
+new line 2
 line3`;

    const result = removedLinesByFile(diff);

    expect(result).toEqual({
      'src/file.ts': [
        { line: 2, text: 'old line 1' },
        { line: 3, text: 'old line 2' }
      ]
    });
  });
});
