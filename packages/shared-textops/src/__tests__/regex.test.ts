import { describe, it, expect } from 'vitest';
import { escapeRegExp, safeMatchAll, highlightMatches } from '../regex';

describe('escapeRegExp', () => {
  it('should escape regex special characters', () => {
    expect(escapeRegExp('hello.world')).toBe('hello\\.world');
  });

  it('should escape all regex special characters', () => {
    const input = '.*+?^${}()|[\\';
    const expected = '\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\\\';
    expect(escapeRegExp(input)).toBe(expected);
  });

  it('should handle empty string', () => {
    expect(escapeRegExp('')).toBe('');
  });

  it('should handle string with no special characters', () => {
    expect(escapeRegExp('hello world')).toBe('hello world');
  });

  it('should handle multiple occurrences', () => {
    expect(escapeRegExp('hello.world.test')).toBe('hello\\.world\\.test');
  });

  it('should handle mixed content', () => {
    expect(escapeRegExp('hello.world+test')).toBe('hello\\.world\\+test');
  });
});

describe('safeMatchAll', () => {
  it('should return all matches as array', () => {
    const result = safeMatchAll('hello world hello', /hello/g);
    expect(result).toHaveLength(2);
    expect(result[0]![0]).toBe('hello');
    expect(result[1]![0]).toBe('hello');
  });

  it('should add global flag if not present', () => {
    const result = safeMatchAll('hello world hello', /hello/);
    expect(result).toHaveLength(2);
  });

  it('should return empty array for no matches', () => {
    const result = safeMatchAll('hello world', /xyz/);
    expect(result).toEqual([]);
  });

  it('should handle empty string', () => {
    const result = safeMatchAll('', /hello/);
    expect(result).toEqual([]);
  });

  it('should handle complex regex', () => {
    const result = safeMatchAll('abc123def456', /\d+/g);
    expect(result).toHaveLength(2);
    expect(result[0]![0]).toBe('123');
    expect(result[1]![0]).toBe('456');
  });

  it('should handle regex with groups', () => {
    const result = safeMatchAll('hello world', /(\w+)/g);
    expect(result).toHaveLength(2);
    expect(result[0]![0]).toBe('hello');
    expect(result[0]![1]).toBe('hello');
    expect(result[1]![0]).toBe('world');
    expect(result[1]![1]).toBe('world');
  });

  it('should handle regex that would throw', () => {
    // This should not throw even with problematic regex
    // /.*/ with global flag matches the entire string and then empty string at the end
    const result = safeMatchAll('test', /.*/);
    expect(result).toHaveLength(2);
    expect(result[0]![0]).toBe('test');
    expect(result[1]![0]).toBe('');
  });

  it('should preserve existing flags', () => {
    const result = safeMatchAll('HELLO world', /hello/gi);
    expect(result).toHaveLength(1);
    expect(result[0]![0]).toBe('HELLO');
  });
});

describe('highlightMatches', () => {
  it('should highlight matches with default markers', () => {
    const result = highlightMatches('hello world hello', /hello/g);
    expect(result).toBe('[[hello]] world [[hello]]');
  });

  it('should highlight matches with custom markers', () => {
    const result = highlightMatches('hello world', /hello/, '<mark>', '</mark>');
    expect(result).toBe('<mark>hello</mark> world');
  });

  it('should return original string for no matches', () => {
    const result = highlightMatches('hello world', /xyz/);
    expect(result).toBe('hello world');
  });

  it('should handle empty string', () => {
    const result = highlightMatches('', /hello/);
    expect(result).toBe('');
  });

  it('should handle overlapping matches correctly', () => {
    const result = highlightMatches('aaaa', /aa/g);
    expect(result).toBe('[[aa]][[aa]]');
  });

  it('should handle complex regex patterns', () => {
    const result = highlightMatches('abc123def456', /\d+/g, '<num>', '</num>');
    expect(result).toBe('abc<num>123</num>def<num>456</num>');
  });

  it('should handle multiple different matches', () => {
    const result = highlightMatches('hello 123 world', /hello|\d+/g);
    expect(result).toBe('[[hello]] [[123]] world');
  });

  it('should handle matches at the beginning and end', () => {
    const result = highlightMatches('hello world test', /hello|test/g);
    expect(result).toBe('[[hello]] world [[test]]');
  });

  it('should handle single character matches', () => {
    const result = highlightMatches('hello', /l/g, '*', '*');
    expect(result).toBe('he*l**l*o');
  });

  it('should handle regex with groups', () => {
    const result = highlightMatches('hello world', /(\w+)/g);
    expect(result).toBe('[[hello]] [[world]]');
  });

  it('should handle empty matches', () => {
    const result = highlightMatches('hello world', /(?=hello)/g);
    expect(result).toBe('[[]][[]]hello world');
  });

  it('should handle unicode characters', () => {
    const result = highlightMatches('café', /é/g);
    expect(result).toBe('caf[[é]]');
  });
});
