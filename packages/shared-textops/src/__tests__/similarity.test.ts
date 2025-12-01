import { describe, it, expect } from 'vitest';
import { levenshtein, similarity, longestCommonSubstr } from '../similarity';

describe('levenshtein', () => {
  it('should return 0 for identical strings', () => {
    expect(levenshtein('hello', 'hello')).toBe(0);
  });

  it('should return length for empty string vs non-empty', () => {
    expect(levenshtein('', 'hello')).toBe(5);
    expect(levenshtein('hello', '')).toBe(5);
  });

  it('should return 0 for both empty strings', () => {
    expect(levenshtein('', '')).toBe(0);
  });

  it('should calculate distance for single character difference', () => {
    expect(levenshtein('hello', 'hallo')).toBe(1);
  });

  it('should calculate distance for multiple character differences', () => {
    expect(levenshtein('hello', 'world')).toBe(4);
  });

  it('should calculate distance for insertion', () => {
    expect(levenshtein('hello', 'hellos')).toBe(1);
  });

  it('should calculate distance for deletion', () => {
    expect(levenshtein('hello', 'hell')).toBe(1);
  });

  it('should calculate distance for substitution', () => {
    expect(levenshtein('hello', 'jello')).toBe(1);
  });

  it('should handle longer strings', () => {
    expect(levenshtein('kitten', 'sitting')).toBe(3);
  });

  it('should handle strings with different lengths', () => {
    expect(levenshtein('short', 'muchlonger')).toBe(8);
  });

  it('should handle unicode characters', () => {
    expect(levenshtein('café', 'cafe')).toBe(1);
  });
});

describe('similarity', () => {
  it('should return 1 for identical strings', () => {
    expect(similarity('hello', 'hello')).toBe(1);
  });

  it('should return 1 for both empty strings', () => {
    expect(similarity('', '')).toBe(1);
  });

  it('should return 0 for completely different strings', () => {
    expect(similarity('abc', 'xyz')).toBe(0);
  });

  it('should return similarity score between 0 and 1', () => {
    const result = similarity('hello', 'hallo');
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(1);
  });

  it('should return higher similarity for more similar strings', () => {
    const sim1 = similarity('hello', 'hallo');
    const sim2 = similarity('hello', 'world');
    expect(sim1).toBeGreaterThan(sim2);
  });

  it('should handle empty string vs non-empty', () => {
    expect(similarity('', 'hello')).toBe(0);
    expect(similarity('hello', '')).toBe(0);
  });

  it('should be symmetric', () => {
    expect(similarity('hello', 'world')).toBe(similarity('world', 'hello'));
  });

  it('should handle single character strings', () => {
    expect(similarity('a', 'a')).toBe(1);
    expect(similarity('a', 'b')).toBe(0);
  });

  it('should handle longer strings', () => {
    const result = similarity('kitten', 'sitting');
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(1);
  });
});

describe('longestCommonSubstr', () => {
  it('should return empty string for no common substring', () => {
    expect(longestCommonSubstr('abc', 'xyz')).toBe('');
  });

  it('should return empty string for empty inputs', () => {
    expect(longestCommonSubstr('', 'hello')).toBe('');
    expect(longestCommonSubstr('hello', '')).toBe('');
    expect(longestCommonSubstr('', '')).toBe('');
  });

  it('should return the string itself for identical strings', () => {
    expect(longestCommonSubstr('hello', 'hello')).toBe('hello');
  });

  it('should find common substring at the beginning', () => {
    expect(longestCommonSubstr('hello', 'help')).toBe('hel');
  });

  it('should find common substring at the end', () => {
    expect(longestCommonSubstr('world', 'hello world')).toBe('world');
  });

  it('should find common substring in the middle', () => {
    expect(longestCommonSubstr('abcdef', 'xyzdefghi')).toBe('def');
  });

  it('should return the longest common substring', () => {
    expect(longestCommonSubstr('abcdef', 'abcxyzdef')).toBe('abc');
  });

  it('should handle single character common substring', () => {
    expect(longestCommonSubstr('abc', 'xyz')).toBe('');
    expect(longestCommonSubstr('abc', 'axc')).toBe('a');
  });

  it('should handle multiple common substrings', () => {
    expect(longestCommonSubstr('abcdefgh', 'abcxyzgh')).toBe('abc');
  });

  it('should handle repeated characters', () => {
    expect(longestCommonSubstr('aaa', 'aaa')).toBe('aaa');
    expect(longestCommonSubstr('aaab', 'aaac')).toBe('aaa');
  });

  it('should handle unicode characters', () => {
    expect(longestCommonSubstr('café', 'cafe')).toBe('caf');
  });

  it('should handle case sensitivity', () => {
    expect(longestCommonSubstr('Hello', 'hello')).toBe('ello');
  });
});
