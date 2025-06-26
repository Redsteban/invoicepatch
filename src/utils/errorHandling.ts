// Error handling utilities for email/PDF flow

export enum ErrorTypes {
  Email = 'EmailError',
  PDF = 'PDFError',
  Network = 'NetworkError',
  Validation = 'ValidationError',
  RateLimit = 'RateLimitError',
  Unknown = 'UnknownError',
}

export interface AppError extends Error {
  type: ErrorTypes;
  originalError?: any;
}

export function handleError(error: any, fallback?: () => void) {
  logError(error);
  if (fallback) fallback();
}

export function getUserErrorMessage(error: any): string {
  if (!error) return 'An unknown error occurred.';
  if (typeof error === 'string') return error;
  if (error.type === ErrorTypes.Email) return 'Failed to send email. Please try again or download your invoice.';
  if (error.type === ErrorTypes.PDF) return 'Failed to generate PDF. Please try again.';
  if (error.type === ErrorTypes.Network) return 'Network error. Please check your connection and try again.';
  if (error.type === ErrorTypes.Validation) return 'Invalid input. Please check your data and try again.';
  if (error.type === ErrorTypes.RateLimit) return 'Too many requests. Please wait and try again later.';
  return error.message || 'An unexpected error occurred.';
}

export async function withRetry<T>(fn: () => Promise<T>, retries = 2, delayMs = 500): Promise<T> {
  let lastError;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      await new Promise(res => setTimeout(res, delayMs));
    }
  }
  throw lastError;
}

export function logError(error: any) {
  // Replace with real logging/monitoring integration
  if (typeof window !== 'undefined') {
    // Client-side
    // eslint-disable-next-line no-console
    console.error('[AppError]', error);
  } else {
    // Server-side
    // eslint-disable-next-line no-console
    console.error('[AppError]', error);
  }
}

export function getSupportContactInfo() {
  return {
    email: 'support@invoicepatch.com',
    url: 'https://invoicepatch.com/support',
  };
} 