import { ApiError, NetworkError, TimeoutError, isApiError, isNetworkError, isTimeoutError } from './api.error'
import {
  BaseError,
  ApplicationError,
  DomainError,
  InfrastructureError,
  ValidationError,
  NotFoundError,
  isBaseError,
  getErrorMessage,
  getErrorCode,
} from './base.error'

/**
 * Comprehensive error handling utilities
 */

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (isApiError(error)) {
    return error.retryable
  }

  if (isNetworkError(error)) {
    return error.retryable
  }

  if (isTimeoutError(error)) {
    return error.retryable
  }

  if (error instanceof InfrastructureError) {
    return error.retryable
  }

  return false
}

/**
 * Get error severity level
 */
export function getErrorSeverity(error: unknown): 'low' | 'medium' | 'high' | 'critical' {
  if (isApiError(error)) {
    if (error.status >= 500) return 'critical'
    if (error.status === 429) return 'high'
    if (error.status === 404) return 'medium'
    return 'low'
  }

  if (isNetworkError(error)) {
    return 'high'
  }

  if (isTimeoutError(error)) {
    return 'medium'
  }

  if (error instanceof ValidationError) {
    return 'low'
  }

  if (error instanceof NotFoundError) {
    return 'medium'
  }

  if (error instanceof DomainError) {
    return 'medium'
  }

  if (error instanceof ApplicationError) {
    return 'high'
  }

  return 'medium'
}

/**
 * Format error for logging
 */
export function formatErrorForLogging(error: unknown): Record<string, unknown> {
  if (isBaseError(error)) {
    return {
      ...error.toJSON(),
      severity: getErrorSeverity(error),
      retryable: isRetryableError(error),
    }
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      severity: getErrorSeverity(error),
      retryable: isRetryableError(error),
    }
  }

  return {
    error: String(error),
    timestamp: new Date().toISOString(),
    severity: 'medium',
    retryable: false,
  }
}

/**
 * Error handling for React components
 */
export function handleComponentError(error: unknown, _componentName: string): {
  message: string
  code: string
  retryable: boolean
  severity: 'low' | 'medium' | 'high' | 'critical'
} {
  return {
    message: getErrorMessage(error),
    code: getErrorCode(error),
    retryable: isRetryableError(error),
    severity: getErrorSeverity(error),
  }
}

/**
 * Create user-friendly error messages with context
 */
export function createUserFriendlyError(error: unknown, context?: string): string {
  const baseMessage = getErrorMessage(error)

  if (context) {
    return `${context}: ${baseMessage}`
  }

  return baseMessage
}

/**
 * Error aggregation for multiple errors
 */
export class ErrorAggregator {
  private errors: Array<{
    error: unknown
    context?: string
    timestamp: Date
  }> = []

  add(error: unknown, context?: string): void {
    this.errors.push({
      error,
      ...(context ? { context } : {}),
      timestamp: new Date(),
    })
  }

  getErrors(): Array<{
    error: unknown
    context?: string
    timestamp: Date
  }> {
    return [...this.errors]
  }

  hasErrors(): boolean {
    return this.errors.length > 0
  }

  getCount(): number {
    return this.errors.length
  }

  clear(): void {
    this.errors = []
  }

  getSummary(): {
    total: number
    byType: Record<string, number>
    bySeverity: Record<string, number>
    retryable: number
    // eslint-disable-next-line indent
  } {
    const byType: Record<string, number> = {}
    const bySeverity: Record<string, number> = {}
    let retryable = 0

    this.errors.forEach(({ error }) => {
      const errorType = isBaseError(error) ? error.constructor.name : error instanceof Error ? error.constructor.name : 'Unknown'
      const severity = getErrorSeverity(error)

      byType[errorType] = (byType[errorType] || 0) + 1
      bySeverity[severity] = (bySeverity[severity] || 0) + 1

      if (isRetryableError(error)) {
        retryable++
      }
    })

    return {
      total: this.errors.length,
      byType,
      bySeverity,
      retryable,
    }
  }
}

// Export all error classes for convenience
export {
  ApiError,
  NetworkError,
  TimeoutError,
  BaseError,
  ApplicationError,
  DomainError,
  InfrastructureError,
  ValidationError,
  NotFoundError,
  isApiError,
  isNetworkError,
  isTimeoutError,
  isBaseError,
  getErrorMessage,
  getErrorCode,
}
