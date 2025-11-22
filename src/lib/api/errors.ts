/**
 * Error handling utilities for API operations
 * Provides consistent error formatting, logging, and categorization
 */

export type ErrorType = 'network' | 'http' | 'sse' | 'validation' | 'unknown';

export interface FormattedError {
  type: ErrorType;
  message: string;
  userMessage: string;
  originalError?: Error;
  status?: number;
  timestamp: Date;
}

/**
 * Format an error into a user-friendly message
 * Handles different error types (network, HTTP, SSE, validation)
 */
export function formatErrorMessage(error: unknown): FormattedError {
  const timestamp = new Date();

  // Network errors (connection failures, timeouts)
  if (error instanceof Error) {
    if (error.name === 'AbortError' || error.message.includes('timed out')) {
      return {
        type: 'network',
        message: error.message,
        userMessage:
          'The request timed out. Please check your connection and try again.',
        originalError: error,
        timestamp,
      };
    }

    if (
      error.message.includes('Failed to fetch') ||
      error.message.includes('Network request failed') ||
      error.message.includes('connection')
    ) {
      return {
        type: 'network',
        message: error.message,
        userMessage:
          'Unable to connect to the server. Please check your internet connection and try again.',
        originalError: error,
        timestamp,
      };
    }

    // SSE connection errors
    if (
      error.message.includes('SSE') ||
      error.message.includes('EventSource')
    ) {
      return {
        type: 'sse',
        message: error.message,
        userMessage:
          'Connection to the server was interrupted. Please try again.',
        originalError: error,
        timestamp,
      };
    }

    // Validation errors
    if (
      error.message.includes('validation') ||
      error.message.includes('invalid')
    ) {
      return {
        type: 'validation',
        message: error.message,
        userMessage: error.message, // Validation errors are already user-friendly
        originalError: error,
        timestamp,
      };
    }

    // HTTP errors with status codes
    const statusMatch = error.message.match(/HTTP (\d+)/);
    if (statusMatch) {
      const status = parseInt(statusMatch[1], 10);
      return formatHTTPError(status, error.message, error, timestamp);
    }

    // Generic error with message
    return {
      type: 'unknown',
      message: error.message,
      userMessage: error.message,
      originalError: error,
      timestamp,
    };
  }

  // Unknown error type
  return {
    type: 'unknown',
    message: String(error),
    userMessage: 'An unexpected error occurred. Please try again.',
    timestamp,
  };
}

/**
 * Format HTTP errors based on status code
 */
function formatHTTPError(
  status: number,
  message: string,
  originalError: Error,
  timestamp: Date
): FormattedError {
  let userMessage: string;

  if (status >= 400 && status < 500) {
    // Client errors
    if (status === 400) {
      userMessage = 'Invalid request. Please check your input and try again.';
    } else if (status === 401) {
      userMessage = 'Authentication required. Please log in and try again.';
    } else if (status === 403) {
      userMessage = "You don't have permission to perform this action.";
    } else if (status === 404) {
      userMessage = 'The requested resource was not found.';
    } else if (status === 429) {
      userMessage = 'Too many requests. Please wait a moment and try again.';
    } else {
      userMessage = 'Invalid request. Please try again.';
    }
  } else if (status >= 500) {
    // Server errors
    userMessage =
      'The server encountered an error. Please try again in a few moments.';
  } else {
    userMessage = 'An error occurred. Please try again.';
  }

  return {
    type: 'http',
    message,
    userMessage,
    originalError,
    status,
    timestamp,
  };
}

/**
 * Log detailed error information for debugging
 * Logs to console in development, can be extended to send to logging service
 */
export function logError(
  error: FormattedError,
  context?: Record<string, unknown>
): void {
  const logData = {
    type: error.type,
    message: error.message,
    userMessage: error.userMessage,
    status: error.status,
    timestamp: error.timestamp.toISOString(),
    context,
    stack: error.originalError?.stack,
  };

  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.error('[API Error]', logData);
  }

  // In production, you could send to a logging service
  // Example: sendToLoggingService(logData);
}

/**
 * Create a formatted error from an API response
 */
export function createAPIError(
  status: number,
  detail: string,
  originalError?: Error
): FormattedError {
  const timestamp = new Date();
  const message = `HTTP ${status}: ${detail}`;
  const error = originalError || new Error(message);

  return formatHTTPError(status, message, error, timestamp);
}
