import { describe, it, expect } from 'vitest';
import { listChangedFiles } from '../listChangedFiles';

describe('listChangedFiles', () => {
  it('should extract changed files from a simple diff', () => {
    const diff = `diff --git a/src/file.ts b/src/file.ts
index 1234567..abcdefg 100644
--- a/src/file.ts
+++ b/src/file.ts
@@ -1,2 +1,3 @@
 line1
+new line
 line2`;

    const result = listChangedFiles(diff);

    expect(result).toEqual(['src/file.ts']);
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
+another line
 line2

diff --git a/src/file3.ts b/src/file3.ts
--- a/src/file3.ts
+++ b/src/file3.ts
@@ -1,2 +1,3 @@
 line1
+third line
 line2`;

    const result = listChangedFiles(diff);

    expect(result).toEqual(['src/file1.ts', 'src/file2.ts', 'src/file3.ts']);
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

    const result = listChangedFiles(diff);

    expect(result).toEqual(['src/newfile.ts']);
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

    const result = listChangedFiles(diff);

    expect(result).toEqual([]);
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

    const result = listChangedFiles(diff);

    expect(result).toEqual(['src/newname.ts']);
  });

  it('should handle empty diff', () => {
    const result = listChangedFiles('');

    expect(result).toEqual([]);
  });

  it('should deduplicate files', () => {
    const diff = `diff --git a/src/file.ts b/src/file.ts
--- a/src/file.ts
+++ b/src/file.ts
@@ -1,2 +1,3 @@
 line1
+new line
 line2

diff --git a/src/file.ts b/src/file.ts
--- a/src/file.ts
+++ b/src/file.ts
@@ -1,3 +1,4 @@
 line1
 new line
+another line
 line2`;

    const result = listChangedFiles(diff);

    expect(result).toEqual(['src/file.ts']);
  });

  it('should handle file paths with a/ and b/ prefixes', () => {
    const diff = `diff --git a/src/file.ts b/src/file.ts
--- a/src/file.ts
+++ b/src/file.ts
@@ -1,2 +1,3 @@
 line1
+new line
 line2`;

    const result = listChangedFiles(diff);

    expect(result).toEqual(['src/file.ts']);
  });

  it('should handle file paths with trailing whitespace', () => {
    const diff = `diff --git a/src/file.ts b/src/file.ts
--- a/src/file.ts
+++ b/src/file.ts   
@@ -1,2 +1,3 @@
 line1
+new line
 line2`;

    const result = listChangedFiles(diff);

    expect(result).toEqual(['src/file.ts']);
  });

  it('should handle malformed diff gracefully', () => {
    const diff = `not a proper diff
some random content
+++ b/src/file.ts
+added line`;

    const result = listChangedFiles(diff);

    expect(result).toEqual(['src/file.ts']);
  });

  it('should handle files with special characters in paths', () => {
    const diff = `diff --git a/src/file-with-dash.ts b/src/file-with-dash.ts
--- a/src/file-with-dash.ts
+++ b/src/file-with-dash.ts
@@ -1,2 +1,3 @@
 line1
+new line
 line2

diff --git a/src/file_with_underscore.ts b/src/file_with_underscore.ts
--- a/src/file_with_underscore.ts
+++ b/src/file_with_underscore.ts
@@ -1,2 +1,3 @@
 line1
+new line
 line2

diff --git a/src/file.with.dots.ts b/src/file.with.dots.ts
--- a/src/file.with.dots.ts
+++ b/src/file.with.dots.ts
@@ -1,2 +1,3 @@
 line1
+new line
 line2`;

    const result = listChangedFiles(diff);

    expect(result).toEqual([
      'src/file-with-dash.ts',
      'src/file_with_underscore.ts',
      'src/file.with.dots.ts'
    ]);
  });

  it('should handle nested directory paths', () => {
    const diff = `diff --git a/packages/utils/src/helper.ts b/packages/utils/src/helper.ts
--- a/packages/utils/src/helper.ts
+++ b/packages/utils/src/helper.ts
@@ -1,2 +1,3 @@
 line1
+new line
 line2

diff --git a/apps/web/src/components/Button.tsx b/apps/web/src/components/Button.tsx
--- a/apps/web/src/components/Button.tsx
+++ b/apps/web/src/components/Button.tsx
@@ -1,2 +1,3 @@
 line1
+new line
 line2`;

    const result = listChangedFiles(diff);

    expect(result).toEqual([
      'packages/utils/src/helper.ts',
      'apps/web/src/components/Button.tsx'
    ]);
  });
});
