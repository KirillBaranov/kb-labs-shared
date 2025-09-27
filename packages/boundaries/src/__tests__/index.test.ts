import { describe, it, expect } from 'vitest';
import { makeImportChecker } from '../index';
import type { ModuleBoundariesSpec } from '../types';

describe('@kb-labs/shared-boundaries exports', () => {
  it('should export makeImportChecker function', () => {
    expect(typeof makeImportChecker).toBe('function');
  });

  it('should export types', () => {
    // Test that types are properly exported by checking if we can use them
    const spec: ModuleBoundariesSpec = {
      version: 1,
      rules: [
        {
          id: 'test',
          files: ['src/**']
        }
      ]
    };

    const checker = makeImportChecker(spec);
    expect(typeof checker).toBe('function');
  });

  it('should work with exported function', () => {
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
    expect(checker('src/utils/helper.ts', 'src/other/file.ts')).toBe(false);
  });
});
