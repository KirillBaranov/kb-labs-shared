/**
 * Progress indicators and loaders for CLI operations
 */

import { safeColors, safeSymbols } from './colors';

export interface LoaderOptions {
  /** Text to show while loading */
  text?: string;
  /** Whether to show spinner (true) or progress bar (false) */
  spinner?: boolean;
  /** Total items for progress bar */
  total?: number;
  /** Current item for progress bar */
  current?: number;
  /** Whether JSON mode is enabled (disables all visual feedback) */
  jsonMode?: boolean;
}

export class Loader {
  private interval: NodeJS.Timeout | null = null;
  private isActive = false;
  private spinnerChars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  private spinnerIndex = 0;
  private options: LoaderOptions;

  constructor(options: LoaderOptions = {}) {
    this.options = {
      text: 'Loading...',
      spinner: true,
      jsonMode: false,
      ...options,
    };
  }

  start(): void {
    if (this.options.jsonMode || this.isActive) return;
    
    this.isActive = true;
    this.spinnerIndex = 0;
    
    if (this.options.spinner) {
      this.startSpinner();
    } else if (this.options.total !== undefined) {
      this.updateProgress();
    }
  }

  update(options: Partial<LoaderOptions>): void {
    this.options = { ...this.options, ...options };
    
    if (!this.isActive || this.options.jsonMode) return;
    
    if (this.options.spinner) {
      // Spinner updates automatically
    } else if (this.options.total !== undefined) {
      this.updateProgress();
    }
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isActive = false;
    
    if (!this.options.jsonMode) {
      // Clear the line
      process.stdout.write('\r\x1b[K');
    }
  }

  succeed(message?: string): void {
    this.stop();
    if (!this.options.jsonMode && message) {
      console.log(`\r${safeSymbols.success} ${message}`);
    }
  }

  fail(message?: string): void {
    this.stop();
    if (!this.options.jsonMode && message) {
      console.log(`\r${safeSymbols.error} ${message}`);
    }
  }

  private startSpinner(): void {
    this.interval = setInterval(() => {
      if (!this.isActive) return;
      
      const char = this.spinnerChars[this.spinnerIndex] ?? '⠋';
      const text = this.options.text ?? 'Loading...';
      
      process.stdout.write(`\r${safeColors.info(char)} ${text}`);
      
      this.spinnerIndex = (this.spinnerIndex + 1) % this.spinnerChars.length;
    }, 100);
  }

  private updateProgress(): void {
    if (this.options.total === undefined || this.options.current === undefined) return;
    
    const current = this.options.current;
    const total = this.options.total;
    const percentage = Math.round((current / total) * 100);
    const barLength = 20;
    const filledLength = Math.round((current / total) * barLength);
    
    const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
    const text = this.options.text || 'Progress';
    
    process.stdout.write(`\r${safeColors.info('→')} ${text}... ${bar} ${percentage}% (${current}/${total})`);
  }
}

/**
 * Create a simple spinner
 */
export function createSpinner(text: string, jsonMode = false): Loader {
  return new Loader({ text, spinner: true, jsonMode });
}

/**
 * Create a progress bar
 */
export function createProgressBar(text: string, total: number, jsonMode = false): Loader {
  return new Loader({ text, spinner: false, total, current: 0, jsonMode });
}

/**
 * Simple loading message without spinner
 */
export function showLoading(text: string, jsonMode = false): void {
  if (!jsonMode) {
    console.log(`${safeColors.info('→')} ${text}...`);
  }
}

/**
 * Show completion message
 */
export function showSuccess(text: string, jsonMode = false): void {
  if (!jsonMode) {
    console.log(`${safeSymbols.success} ${text}`);
  }
}

/**
 * Show error message
 */
export function showError(text: string, jsonMode = false): void {
  if (!jsonMode) {
    console.log(`${safeSymbols.error} ${text}`);
  }
}
