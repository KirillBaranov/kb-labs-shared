import { describe, it, expect } from 'vitest';
import { takeContext } from '../snippet';

describe('takeContext', () => {
  const testText = `line1
line2
line3
line4
line5
line6
line7
line8
line9
line10`;

  it('should extract context around a line number', () => {
    const result = takeContext(testText, 5);

    expect(result.start).toBe(3);
    expect(result.end).toBe(7);
    expect(result.lines).toEqual(['line3', 'line4', 'line5', 'line6', 'line7']);
  });

  it('should handle default context (2 before, 2 after)', () => {
    const result = takeContext(testText, 5);

    expect(result.start).toBe(3);
    expect(result.end).toBe(7);
    expect(result.lines).toHaveLength(5);
  });

  it('should handle custom context parameters', () => {
    const result = takeContext(testText, 5, 1, 1);

    expect(result.start).toBe(4);
    expect(result.end).toBe(6);
    expect(result.lines).toEqual(['line4', 'line5', 'line6']);
  });

  it('should handle line at the beginning of text', () => {
    const result = takeContext(testText, 1);

    expect(result.start).toBe(1);
    expect(result.end).toBe(3);
    expect(result.lines).toEqual(['line1', 'line2', 'line3']);
  });

  it('should handle line at the end of text', () => {
    const result = takeContext(testText, 10);

    expect(result.start).toBe(8);
    expect(result.end).toBe(10);
    expect(result.lines).toEqual(['line8', 'line9', 'line10']);
  });

  it('should handle line number less than 1', () => {
    const result = takeContext(testText, 0);

    expect(result.start).toBe(1);
    expect(result.end).toBe(3);
    expect(result.lines).toEqual(['line1', 'line2', 'line3']);
  });

  it('should handle line number greater than text length', () => {
    const result = takeContext(testText, 15);

    expect(result.start).toBe(8);
    expect(result.end).toBe(10);
    expect(result.lines).toEqual(['line8', 'line9', 'line10']);
  });

  it('should handle zero context', () => {
    const result = takeContext(testText, 5, 0, 0);

    expect(result.start).toBe(5);
    expect(result.end).toBe(5);
    expect(result.lines).toEqual(['line5']);
  });

  it('should handle large context that exceeds text bounds', () => {
    const result = takeContext(testText, 5, 10, 10);

    expect(result.start).toBe(1);
    expect(result.end).toBe(10);
    expect(result.lines).toHaveLength(10);
  });

  it('should handle single line text', () => {
    const singleLineText = 'single line';
    const result = takeContext(singleLineText, 1);

    expect(result.start).toBe(1);
    expect(result.end).toBe(1);
    expect(result.lines).toEqual(['single line']);
  });

  it('should handle empty text', () => {
    const result = takeContext('', 1);

    expect(result.start).toBe(1);
    expect(result.end).toBe(0);
    expect(result.lines).toEqual([]);
  });

  it('should handle text with CRLF line endings', () => {
    const crlfText = 'line1\r\nline2\r\nline3';
    const result = takeContext(crlfText, 2);

    expect(result.start).toBe(1);
    expect(result.end).toBe(3);
    expect(result.lines).toEqual(['line1', 'line2', 'line3']);
  });

  it('should handle text with mixed line endings', () => {
    const mixedText = 'line1\nline2\r\nline3';
    const result = takeContext(mixedText, 2);

    expect(result.start).toBe(1);
    expect(result.end).toBe(3);
    expect(result.lines).toEqual(['line1', 'line2', 'line3']);
  });

  it('should handle context that spans entire text', () => {
    const shortText = 'line1\nline2\nline3';
    const result = takeContext(shortText, 2);

    expect(result.start).toBe(1);
    expect(result.end).toBe(3);
    expect(result.lines).toEqual(['line1', 'line2', 'line3']);
  });

  it('should handle asymmetric context', () => {
    const result = takeContext(testText, 5, 3, 1);

    expect(result.start).toBe(2);
    expect(result.end).toBe(6);
    expect(result.lines).toEqual(['line2', 'line3', 'line4', 'line5', 'line6']);
  });

  it('should handle negative line numbers', () => {
    const result = takeContext(testText, -1);

    expect(result.start).toBe(1);
    expect(result.end).toBe(3);
    expect(result.lines).toEqual(['line1', 'line2', 'line3']);
  });
});
