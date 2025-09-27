import { describe, it, expect } from 'vitest';
import { addedLinesByFile } from '../addedLinesByFile';

describe('addedLinesByFile', () => {
  it('should extract added lines from a simple diff', () => {
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

    const result = addedLinesByFile(diff);

    expect(result).toEqual({
      'src/file.ts': [
        { line: 2, text: 'new line' },
        { line: 3, text: 'another line' }
      ]
    });
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
@@ -1,2 +1,3 @@
 line1
+another new line
 line2`;

    const result = addedLinesByFile(diff);

    expect(result).toEqual({
      'src/file1.ts': [
        { line: 2, text: 'new line' }
      ],
      'src/file2.ts': [
        { line: 2, text: 'another new line' }
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

    const result = addedLinesByFile(diff);

    expect(result).toEqual({
      'src/newfile.ts': [
        { line: 1, text: 'line1' },
        { line: 2, text: 'line2' }
      ]
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

    const result = addedLinesByFile(diff);

    expect(result).toEqual({});
  });

  it('should handle CRLF line endings', () => {
    const diff = `diff --git a/src/file.ts b/src/file.ts\r\n--- a/src/file.ts\r\n+++ b/src/file.ts\r\n@@ -1,2 +1,3 @@\r\n line1\r\n+new line\r\n line2`;

    const result = addedLinesByFile(diff);

    expect(result).toEqual({
      'src/file.ts': [
        { line: 2, text: 'new line' }
      ]
    });
  });

  it('should handle empty diff', () => {
    const result = addedLinesByFile('');

    expect(result).toEqual({});
  });

  it('should handle context lines correctly', () => {
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

    const result = addedLinesByFile(diff);

    expect(result).toEqual({
      'src/file.ts': [
        { line: 3, text: 'new line' }
      ]
    });
  });

  it('should handle hunk headers without line counts', () => {
    const diff = `diff --git a/src/file.ts b/src/file.ts
--- a/src/file.ts
+++ b/src/file.ts
@@ -1 +1,2 @@
 line1
+new line`;

    const result = addedLinesByFile(diff);

    expect(result).toEqual({
      'src/file.ts': [
        { line: 2, text: 'new line' }
      ]
    });
  });

  it('should ignore lines starting with +++ that are not file headers', () => {
    const diff = `diff --git a/src/file.ts b/src/file.ts
--- a/src/file.ts
+++ b/src/file.ts
@@ -1,2 +1,3 @@
 line1
+line with +++ prefix
 line2`;

    const result = addedLinesByFile(diff);

    expect(result).toEqual({
      'src/file.ts': [
        { line: 2, text: 'line with +++ prefix' }
      ]
    });
  });

  it('should handle malformed diff gracefully', () => {
    const diff = `not a proper diff
some random content
+++ b/src/file.ts
+added line`;

    const result = addedLinesByFile(diff);

    expect(result).toEqual({
      'src/file.ts': [
        { line: 0, text: 'added line' }
      ]
    });
  });

  it('should handle file paths with trailing whitespace', () => {
    const diff = `diff --git a/src/file.ts b/src/file.ts
--- a/src/file.ts
+++ b/src/file.ts   
@@ -1,2 +1,3 @@
 line1
+new line
 line2`;

    const result = addedLinesByFile(diff);

    expect(result).toEqual({
      'src/file.ts': [
        { line: 2, text: 'new line' }
      ]
    });
  });
});
