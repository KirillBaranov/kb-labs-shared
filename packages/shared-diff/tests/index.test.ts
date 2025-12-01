import { describe, it, expect } from 'vitest';
import { parseUnifiedDiff, listChangedFiles, addedLinesByFile, removedLinesByFile } from '../src/index';

describe('@kb-labs/shared-diff integration', () => {
  it('should work with real git diff scenario', () => {
    const diff = `diff --git a/src/file1.ts b/src/file1.ts
index 1234567..abcdefg 100644
--- a/src/file1.ts
+++ b/src/file1.ts
@@ -1,3 +1,4 @@
 line1
-old line
+new line
 line2

diff --git a/src/file2.ts b/src/file2.ts
new file mode 100644
index 0000000..1234567
--- /dev/null
+++ b/src/file2.ts
@@ -0,0 +1,2 @@
+new file line1
+new file line2`;

    const parsed = parseUnifiedDiff(diff);
    const files = listChangedFiles(diff);
    const added = addedLinesByFile(diff);
    const removed = removedLinesByFile(diff);

    expect(files).toEqual(['src/file1.ts', 'src/file2.ts']);
    expect(parsed.files).toEqual(['src/file1.ts', 'src/file2.ts']);
    expect(added['src/file1.ts']).toEqual([{ line: 2, text: 'new line' }]);
    expect(added['src/file2.ts']).toEqual([
      { line: 1, text: 'new file line1' },
      { line: 2, text: 'new file line2' }
    ]);
    expect(removed['src/file1.ts']).toEqual([{ line: 2, text: 'old line' }]);
    expect(removed['src/file2.ts']).toEqual([]);
  });
});
