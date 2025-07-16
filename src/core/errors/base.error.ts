/**
 * Base error class for application errors
 */
export abstract class BaseError extends Error {
  public readonly timestamp: Date
  public readonly code: string
  public readonly context?: Record<string, unknown> | undefined

  constructor(
    message: string,
    code: string,
    context?: Record<string, unknown> | undefined,
  ) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.context = context
    this.timestamp = new Date()

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor)
  }

  /**
   * Convert error to a plain object for logging
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
      stack: this.stack,
    }
  }

  /**
   * Get user-friendly error message
   */
  abstract getUserMessage(): string
}

/**
 * Application-level business logic errors
 */
export class ApplicationError extends BaseError {
  constructor(
    message: string,
    code: string = 'APPLICATION_ERROR',
    context?: Record<string, unknown> | undefined,
  ) {
    super(message, code, context)
  }

  getUserMessage(): string {
    return 'An application error occurred. Please try again.'
  }
}

/**
 * Domain-specific business rule errors
 */
export class DomainError extends BaseError {
  constructor(
    message: string,
    code: string = 'DOMAIN_ERROR',
    context?: Record<string, unknown> | undefined,
  ) {
    super(message, code, context)
  }

  getUserMessage(): string {
    return this.message
  }
}

/**
 * Infrastructure-level errors (API, database, etc.)
 */
export class InfrastructureError extends BaseError {
  public readonly retryable: boolean

  constructor(
    message: string,
    code: string = 'INFRASTRUCTURE_ERROR',
    retryable: boolean = false,
    context?: Record<string, unknown> | undefined,
  ) {
    super(message, code, context)
    this.retryable = retryable
  }

  getUserMessage(): string {
    if (this.retryable) {
      return 'A temporary error occurred. Please try again in a moment.'
    }
    return 'A system error occurred. Please contact support if the problem persists.'
  }
}

/**
 * Validation errors for user input
 */
export class ValidationError extends BaseError {
  public readonly field?: string | undefined

  constructor(
    message: string,
    field?: string | undefined,
    context?: Record<string, unknown> | undefined,
  ) {
    super(message, 'VALIDATION_ERROR', context)
    this.field = field
  }

  getUserMessage(): string {
    return this.message
  }
}

/**
 * Not found errors
 */
export class NotFoundError extends BaseError {
  constructor(
    resource: string,
    identifier?: string | undefined,
    context?: Record<string, unknown> | undefined,
  ) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`

    super(message, 'NOT_FOUND', context)
  }

  getUserMessage(): string {
    return 'The requested item could not be found.'
  }
}

/**
 * Type guard to check if error is a BaseError
 */
export function isBaseError(error: unknown): error is BaseError {
  return error instanceof BaseError
}

/**
 * Extract error message with fallback
 */
export function getErrorMessage(error: unknown): string {
  if (isBaseError(error)) {
    return error.getUserMessage()
  }

  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'An unexpected error occurred'
}

/**
 * Extract error code with fallback
 */
export function getErrorCode(error: unknown): string {
  if (isBaseError(error)) {
    return error.code
  }

  return 'UNKNOWN_ERROR'
}
