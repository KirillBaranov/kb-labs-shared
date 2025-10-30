/**
 * Minimalist color utilities for CLI output
 * Uses strategic color application - only for status, not decoration
 */

export const colors = {
  // Success states - green
  success: (s: string) => `\x1b[32m${s}\x1b[0m`,
  
  // Error states - red  
  error: (s: string) => `\x1b[31m${s}\x1b[0m`,
  
  // Warning states - yellow
  warning: (s: string) => `\x1b[33m${s}\x1b[0m`,
  
  // Info/Progress - cyan
  info: (s: string) => `\x1b[36m${s}\x1b[0m`,
  
  // Subtle details - dim gray
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
  
  // Emphasis - bold
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
};

// Common symbols with colors
export const symbols = {
  success: colors.success('✓'),
  error: colors.error('✗'),
  warning: colors.warning('⚠'),
  info: colors.info('→'),
  bullet: colors.dim('•'),
};

// Check if colors are supported
export const supportsColor = (() => {
  if (typeof process === 'undefined') {return false;}
  
  // Check for NO_COLOR environment variable
  if (process.env.NO_COLOR) {return false;}
  
  // Check if stdout is a TTY
  if (process.stdout && !process.stdout.isTTY) {return false;}
  
  // Check TERM environment variable
  if (process.env.TERM === 'dumb') {return false;}
  
  return true;
})();

// Color functions that respect NO_COLOR
export const safeColors = {
  success: (s: string) => supportsColor ? colors.success(s) : s,
  error: (s: string) => supportsColor ? colors.error(s) : s,
  warning: (s: string) => supportsColor ? colors.warning(s) : s,
  info: (s: string) => supportsColor ? colors.info(s) : s,
  dim: (s: string) => supportsColor ? colors.dim(s) : s,
  bold: (s: string) => supportsColor ? colors.bold(s) : s,
};

export const safeSymbols = {
  success: supportsColor ? symbols.success : '✓',
  error: supportsColor ? symbols.error : '✗',
  warning: supportsColor ? symbols.warning : '⚠',
  info: supportsColor ? symbols.info : '→',
  bullet: supportsColor ? symbols.bullet : '•',
};
