import { describe, it, expect } from 'vitest';
import { makeImportChecker } from '../checker';
import type { ModuleBoundariesSpec } from '../types';

describe('makeImportChecker', () => {
  it('should allow imports when no rules match the from path', () => {
    const spec: ModuleBoundariesSpec = {
      version: 1,
      rules: [
        {
          id: 'utils',
          files: ['src/utils/**'],
          allowedImports: ['src/types/**']
        }
      ]
    };

    const checker = makeImportChecker(spec);

    // File not covered by any rule should allow any import
    expect(checker('src/other/file.ts', 'anything')).toBe(true);
  });

  it('should allow all imports when allowedImports is empty', () => {
    const spec: ModuleBoundariesSpec = {
      version: 1,
      rules: [
        {
          id: 'utils',
          files: ['src/utils/**'],
          allowedImports: []
        }
      ]
    };

    const checker = makeImportChecker(spec);

    expect(checker('src/utils/helper.ts', 'anything')).toBe(true);
  });

  it('should allow imports when no allowedImports property', () => {
    const spec: ModuleBoundariesSpec = {
      version: 1,
      rules: [
        {
          id: 'utils',
          files: ['src/utils/**']
        }
      ]
    };

    const checker = makeImportChecker(spec);

    expect(checker('src/utils/helper.ts', 'anything')).toBe(true);
  });

  it('should match exact file patterns', () => {
    const spec: ModuleBoundariesSpec = {
      version: 1,
      rules: [
        {
          id: 'utils',
          files: ['src/utils/helper.ts'],
          allowedImports: ['src/types/**']
        }
      ]
    };

    const checker = makeImportChecker(spec);

    expect(checker('src/utils/helper.ts', 'src/types/user.ts')).toBe(true);
    expect(checker('src/utils/helper.ts', 'src/other/file.ts')).toBe(false);
  });

  it('should match files starting with pattern', () => {
    const spec: ModuleBoundariesSpec = {
      version: 1,
      rules: [
        {
          id: 'utils',
          files: ['src/utils'],
          allowedImports: ['src/types']
        }
      ]
    };

    const checker = makeImportChecker(spec);

    expect(checker('src/utils/helper.ts', 'src/types/user.ts')).toBe(true);
    expect(checker('src/utils/deep/file.ts', 'src/types/deep/user.ts')).toBe(true);
    expect(checker('src/utils/helper.ts', 'src/other/file.ts')).toBe(false);
  });

  it('should match wildcard patterns ending with /**', () => {
    const spec: ModuleBoundariesSpec = {
      version: 1,
      rules: [
        {
          id: 'utils',
          files: ['src/utils/**'],
          allowedImports: ['src/types/**']
        }
      ]
    };

    const checker = makeImportChecker(spec);

    expect(checker('src/utils/helper.ts', 'src/types/user.ts')).toBe(true);
    expect(checker('src/utils/deep/nested/file.ts', 'src/types/deep/user.ts')).toBe(true);
    expect(checker('src/utils/helper.ts', 'src/other/file.ts')).toBe(false);
  });

  it('should match wildcard patterns ending with /*', () => {
    const spec: ModuleBoundariesSpec = {
      version: 1,
      rules: [
        {
          id: 'utils',
          files: ['src/utils/*'],
          allowedImports: ['src/types/*']
        }
      ]
    };

    const checker = makeImportChecker(spec);

    expect(checker('src/utils/helper.ts', 'src/types/user.ts')).toBe(true);
    expect(checker('src/utils/deep/file.ts', 'src/types/user.ts')).toBe(true); // too deep but still matches
    expect(checker('src/utils/helper.ts', 'src/types/deep/user.ts')).toBe(false); // too deep
    expect(checker('src/utils/helper.ts', 'src/other/file.ts')).toBe(false);
  });

  it('should handle multiple rules', () => {
    const spec: ModuleBoundariesSpec = {
      version: 1,
      rules: [
        {
          id: 'utils',
          files: ['src/utils/**'],
          allowedImports: ['src/types/**']
        },
        {
          id: 'api',
          files: ['src/api/**'],
          allowedImports: ['src/utils/**', 'src/types/**']
        }
      ]
    };

    const checker = makeImportChecker(spec);

    // Utils can only import from types
    expect(checker('src/utils/helper.ts', 'src/types/user.ts')).toBe(true);
    expect(checker('src/utils/helper.ts', 'src/api/endpoint.ts')).toBe(false);

    // API can import from utils and types
    expect(checker('src/api/endpoint.ts', 'src/utils/helper.ts')).toBe(true);
    expect(checker('src/api/endpoint.ts', 'src/types/user.ts')).toBe(true);
    expect(checker('src/api/endpoint.ts', 'src/other/file.ts')).toBe(false);
  });

  it('should handle edge cases with empty strings', () => {
    const spec: ModuleBoundariesSpec = {
      version: 1,
      rules: [
        {
          id: 'utils',
          files: ['src/utils/**'],
          allowedImports: ['src/types/**']
        }
      ]
    };

    const checker = makeImportChecker(spec);

    expect(checker('', 'src/types/user.ts')).toBe(true); // empty from path
    expect(checker('src/utils/helper.ts', '')).toBe(false); // empty to path
  });

  it('should handle patterns with a/ and b/ prefixes', () => {
    const spec: ModuleBoundariesSpec = {
      version: 1,
      rules: [
        {
          id: 'utils',
          files: ['a/src/utils/**', 'b/src/utils/**'],
          allowedImports: ['src/types/**']
        }
      ]
    };

    const checker = makeImportChecker(spec);

    expect(checker('a/src/utils/helper.ts', 'src/types/user.ts')).toBe(true);
    expect(checker('b/src/utils/helper.ts', 'src/types/user.ts')).toBe(true);
    expect(checker('src/utils/helper.ts', 'src/types/user.ts')).toBe(true); // no prefix but still matches
  });

  it('should handle namespace in spec', () => {
    const spec: ModuleBoundariesSpec = {
      version: 1,
      namespace: 'my-project',
      rules: [
        {
          id: 'utils',
          files: ['src/utils/**'],
          allowedImports: ['src/types/**']
        }
      ]
    };

    const checker = makeImportChecker(spec);

    // Namespace should not affect functionality
    expect(checker('src/utils/helper.ts', 'src/types/user.ts')).toBe(true);
    expect(checker('src/utils/helper.ts', 'src/other/file.ts')).toBe(false);
  });
});
