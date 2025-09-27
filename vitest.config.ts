import { defineConfig } from 'vitest/config'
import nodePreset from '@kb-labs/devkit/vitest/node.js'

export default defineConfig({
  ...nodePreset,
  test: {
    ...nodePreset.test,
    include: [
      'packages/**/src/**/*.spec.ts',
      'packages/**/src/**/*.test.ts',
      'packages/**/tests/**/*.test.ts',
      'apps/**/src/**/*.spec.ts',
      'apps/**/src/**/*.test.ts',
    ],
    coverage: {
      ...nodePreset.test?.coverage,
      enabled: true,
      exclude: [
        '**/dist/**',
        '**/fixtures/**',
        '**/__tests__/**',
        '**/*.spec.*',
        '**/*.test.*',
        // non-source and config files
        'eslint.config.js',
        '**/vitest.config.ts',
        '**/tsup.config.ts',
        '**/tsconfig*.json',
        'apps/**',
        // coverage reports
        '**/coverage/**',
        // barrel files / types
        '**/index.ts',
        '**/types.ts',
        '**/types/**',
        // devkit scripts
        'scripts/devkit-sync.mjs',
        // test files and directories
        '**/tests/**',
        '**/test/**',
      ],
    },
  },
})