/**
 * Output formatting utilities for structured CLI output
 */

import { safeColors, safeSymbols } from './colors';

/**
 * Create a boxed section with title
 */
export function box(title: string, content: string[]): string {
  const lines = content.length > 0 ? content : [''];
  const maxWidth = Math.max(title.length + 2, ...lines.map(line => line.length));
  
  const topBorder = `┌─ ${title}${' '.repeat(Math.max(0, maxWidth - title.length - 2))}`;
  const bottomBorder = `└─ ${safeSymbols.success} Done`;
  
  const middleLines = lines.map(line => `│  ${line}`);
  
  return [topBorder, ...middleLines, bottomBorder].join('\n');
}

/**
 * Add consistent indentation to lines
 */
export function indent(lines: string[], level = 1): string[] {
  const prefix = '  '.repeat(level);
  return lines.map(line => `${prefix}${line}`);
}

/**
 * Create a section with header and content
 */
export function section(header: string, content: string[]): string[] {
  return [
    '',
    safeColors.bold(header),
    ...indent(content),
  ];
}

/**
 * Format a table with consistent spacing
 */
export function table(rows: (string | number)[][], headers?: string[]): string[] {
  if (rows.length === 0) {return [];}
  
  // Calculate column widths
  const allRows = headers ? [headers, ...rows] : rows;
  if (allRows.length === 0) {return [];}
  
  const columnWidths = allRows[0]!.map((_, colIndex) => 
    Math.max(...allRows.map(row => String(row[colIndex] || '').length))
  );
  
  // Format rows
  const formattedRows = allRows.map(row => {
    return row.map((cell, colIndex) => 
      String(cell || '').padEnd(columnWidths[colIndex] || 0)
    ).join('  ');
  });
  
  return formattedRows;
}

/**
 * Format key-value pairs
 */
export function keyValue(pairs: Record<string, string | number>): string[] {
  const maxKeyLength = Math.max(...Object.keys(pairs).map(key => key.length));
  
  return Object.entries(pairs).map(([key, value]) => {
    const paddedKey = key.padEnd(maxKeyLength);
    return `${paddedKey}: ${value}`;
  });
}

/**
 * Format a list with bullets
 */
export function bulletList(items: string[]): string[] {
  return items.map(item => `${safeSymbols.bullet} ${item}`);
}

/**
 * Format file size
 */
export function formatSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

/**
 * Format relative time
 */
export function formatRelativeTime(timestamp: string | Date): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {return text;}
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Pad string to specific width
 */
export function pad(text: string, width: number, align: 'left' | 'right' | 'center' = 'left'): string {
  if (text.length >= width) {return text;}
  
  const padding = width - text.length;
  
  switch (align) {
    case 'right':
      return ' '.repeat(padding) + text;
    case 'center':
      const leftPad = Math.floor(padding / 2);
      const rightPad = padding - leftPad;
      return ' '.repeat(leftPad) + text + ' '.repeat(rightPad);
    default:
      return text + ' '.repeat(padding);
  }
}
