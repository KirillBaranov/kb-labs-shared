import { describe, it, expect } from 'vitest';
import { normalizeGlob, matchGlob, dedupGlobs } from '../glob';

describe('normalizeGlob', () => {
  it('should normalize backslashes to forward slashes', () => {
    expect(normalizeGlob('path\\to\\file')).toBe('path/to/file');
  });

  it('should collapse multiple slashes', () => {
    expect(normalizeGlob('path//to///file')).toBe('path/to/file');
  });

  it('should remove dot segments', () => {
    expect(normalizeGlob('./path/./to/./file')).toBe('/path/to/file');
    expect(normalizeGlob('path/./to/./file')).toBe('path/to/file');
    expect(normalizeGlob('path/to/./file')).toBe('path/to/file');
  });

  it('should handle root dot segments', () => {
    expect(normalizeGlob('/./path')).toBe('/path');
    expect(normalizeGlob('./path')).toBe('/path');
  });

  it('should handle trailing dots', () => {
    expect(normalizeGlob('path/to/./')).toBe('path/to/');
  });

  it('should handle empty string', () => {
    expect(normalizeGlob('')).toBe('');
  });

  it('should handle single dot', () => {
    expect(normalizeGlob('.')).toBe('');
  });

  it('should handle complex path', () => {
    expect(normalizeGlob('.//path\\to\\file.')).toBe('/path/to/file.');
  });
});

describe('matchGlob', () => {
  it('should match exact paths', () => {
    expect(matchGlob('src/file.ts', ['src/file.ts'])).toBe(true);
  });

  it('should not match different paths', () => {
    expect(matchGlob('src/file.ts', ['src/other.ts'])).toBe(false);
  });

  it('should match wildcard * in single segment', () => {
    expect(matchGlob('src/file.ts', ['src/*.ts'])).toBe(true);
    expect(matchGlob('src/file.ts', ['src/*'])).toBe(true);
    expect(matchGlob('src/file.ts', ['*.ts'])).toBe(false);
  });

  it('should match question mark for single character', () => {
    expect(matchGlob('src/file.ts', ['src/file.??'])).toBe(true);
    expect(matchGlob('src/file.ts', ['src/file.???'])).toBe(false);
    expect(matchGlob('src/file.ts', ['src/file.?'])).toBe(false);
  });

  it('should match ** across segments', () => {
    expect(matchGlob('src/utils/helper.ts', ['src/**'])).toBe(true);
    expect(matchGlob('src/utils/helper.ts', ['**/*.ts'])).toBe(true);
    expect(matchGlob('src/utils/helper.ts', ['src/**/*.ts'])).toBe(true);
  });

  it('should match ** at the beginning', () => {
    expect(matchGlob('deep/nested/file.ts', ['**/file.ts'])).toBe(true);
  });

  it('should match ** at the end', () => {
    expect(matchGlob('src/utils/helper.ts', ['src/**'])).toBe(true);
  });

  it('should match multiple patterns', () => {
    expect(matchGlob('src/file.ts', ['src/*.ts', 'lib/*.js'])).toBe(true);
    expect(matchGlob('src/file.ts', ['lib/*.js', 'test/*.ts'])).toBe(false);
  });

  it('should handle empty patterns array', () => {
    expect(matchGlob('src/file.ts', [])).toBe(false);
  });

  it('should handle complex patterns', () => {
    expect(matchGlob('packages/utils/src/helper.ts', ['packages/*/src/*.ts'])).toBe(true);
    expect(matchGlob('packages/utils/src/helper.ts', ['packages/**/*.ts'])).toBe(true);
  });

  it('should handle special characters in paths', () => {
    expect(matchGlob('src/file-with-dash.ts', ['src/file-*.ts'])).toBe(true);
    expect(matchGlob('src/file_with_underscore.ts', ['src/file_*.ts'])).toBe(true);
  });

  it('should normalize paths before matching', () => {
    expect(matchGlob('src//file.ts', ['src/file.ts'])).toBe(true);
    expect(matchGlob('src/file.ts', ['src//file.ts'])).toBe(true);
  });

  it('should handle regex special characters', () => {
    expect(matchGlob('src/file[1].ts', ['src/file[1].ts'])).toBe(true);
    expect(matchGlob('src/file(1).ts', ['src/file(1).ts'])).toBe(true);
    expect(matchGlob('src/file.ts', ['src/file[1].ts'])).toBe(false);
  });

  it('should handle edge cases with **', () => {
    expect(matchGlob('file.ts', ['**/file.ts'])).toBe(true);
    expect(matchGlob('deep/nested/path/file.ts', ['**/file.ts'])).toBe(true);
    expect(matchGlob('file.ts', ['**'])).toBe(true);
  });

  it('should handle trailing slashes', () => {
    expect(matchGlob('src/', ['src/'])).toBe(true);
    expect(matchGlob('src/', ['src/**'])).toBe(true);
  });
});

describe('dedupGlobs', () => {
  it('should remove duplicate patterns', () => {
    expect(dedupGlobs(['src/*.ts', 'src/*.ts'])).toEqual(['src/*.ts']);
  });

  it('should preserve order of first occurrence', () => {
    expect(dedupGlobs(['src/*.ts', 'lib/*.js', 'src/*.ts'])).toEqual(['src/*.ts', 'lib/*.js']);
  });

  it('should handle empty array', () => {
    expect(dedupGlobs([])).toEqual([]);
  });

  it('should normalize patterns before deduplication', () => {
    expect(dedupGlobs(['src//*.ts', 'src/*.ts'])).toEqual(['src/*.ts']);
  });

  it('should handle multiple duplicates', () => {
    expect(dedupGlobs(['src/*.ts', 'lib/*.js', 'src/*.ts', 'lib/*.js'])).toEqual(['src/*.ts', 'lib/*.js']);
  });

  it('should handle complex patterns', () => {
    expect(dedupGlobs([
      'src/**/*.ts',
      'src/**/*.ts',
      'lib/**/*.js',
      'src/**/*.ts'
    ])).toEqual(['src/**/*.ts', 'lib/**/*.js']);
  });

  it('should handle patterns with different normalization', () => {
    expect(dedupGlobs(['src\\*.ts', 'src/*.ts'])).toEqual(['src/*.ts']);
  });
});
