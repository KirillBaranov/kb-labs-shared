import { describe, it, expect } from 'vitest';
import { makeImportChecker } from '../src/index';
import type { ModuleBoundariesSpec } from '../src/types';

describe('@kb-labs/shared-boundaries integration', () => {
  it('should work with real usage scenario', () => {
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

    // Utils can import from types
    expect(checker('src/utils/helper.ts', 'src/types/user.ts')).toBe(true);

    // Utils cannot import from api
    expect(checker('src/utils/helper.ts', 'src/api/endpoint.ts')).toBe(false);

    // API can import from utils and types
    expect(checker('src/api/endpoint.ts', 'src/utils/helper.ts')).toBe(true);
    expect(checker('src/api/endpoint.ts', 'src/types/user.ts')).toBe(true);

    // API cannot import from other modules
    expect(checker('src/api/endpoint.ts', 'src/other/file.ts')).toBe(false);
  });
});
