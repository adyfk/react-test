/* eslint-disable indent */
import { InfrastructureError } from './base.error'

/**
 * HTTP status codes enum
 */
export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

/**
 * API error class for HTTP-related errors
 */
export class ApiError extends InfrastructureError {
  public readonly status: number
  public readonly statusText: string
  public readonly url?: string | undefined
  public readonly method?: string | undefined
  public readonly responseBody?: unknown

  constructor(
    status: number,
    statusText: string,
    message: string,
    options?: {
      url?: string | undefined
      method?: string | undefined
      responseBody?: unknown
      context?: Record<string, unknown> | undefined
    },
  ) {
    const retryable = ApiError.isRetryableStatus(status)

    super(message, `API_ERROR_${status}`, retryable, {
      status,
      statusText,
      url: options?.url,
      method: options?.method,
      responseBody: options?.responseBody,
      ...options?.context,
    })

    this.status = status
    this.statusText = statusText
    this.url = options?.url
    this.method = options?.method
    this.responseBody = options?.responseBody
  }

  /**
   * Check if the HTTP status code indicates a retryable error
   */
  static isRetryableStatus(status: number): boolean {
    return [
      HttpStatusCode.TOO_MANY_REQUESTS,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      HttpStatusCode.BAD_GATEWAY,
      HttpStatusCode.SERVICE_UNAVAILABLE,
      HttpStatusCode.GATEWAY_TIMEOUT,
    ].includes(status)
  }

  /**
   * Create ApiError from Response object
   */
  static async fromResponse(
    response: Response,
    options?: {
      url?: string | undefined
      method?: string | undefined
    },
  ): Promise<ApiError> {
    let responseBody: unknown
    let message = `HTTP ${response.status}: ${response.statusText}`

    try {
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        responseBody = await response.json()

        // Try to extract error message from common API error formats
        if (typeof responseBody === 'object' && responseBody !== null) {
          const errorObj = responseBody as Record<string, unknown>
          message = (errorObj.message || errorObj.error || errorObj.detail || message) as string
        }
      } else {
        responseBody = await response.text()
        if (typeof responseBody === 'string' && responseBody.length > 0) {
          message = responseBody
        }
      }
    } catch {
      // If parsing fails, use the default message
    }

    return new ApiError(
      response.status,
      response.statusText,
      message,
      {
        url: options?.url || response.url,
        method: options?.method,
        responseBody,
      },
    )
  }

  override getUserMessage(): string {
    switch (this.status) {
      case HttpStatusCode.BAD_REQUEST:
        return 'Invalid request. Please check your input and try again.'
      case HttpStatusCode.UNAUTHORIZED:
        return 'Authentication required. Please sign in.'
      case HttpStatusCode.FORBIDDEN:
        return 'You do not have permission to perform this action.'
      case HttpStatusCode.NOT_FOUND:
        return 'The requested resource was not found.'
      case HttpStatusCode.CONFLICT:
        return 'A conflict occurred. The resource may have been modified.'
      case HttpStatusCode.UNPROCESSABLE_ENTITY:
        return 'Invalid data provided. Please check your input.'
      case HttpStatusCode.TOO_MANY_REQUESTS:
        return 'Too many requests. Please wait a moment and try again.'
      case HttpStatusCode.INTERNAL_SERVER_ERROR:
        return 'A server error occurred. Please try again later.'
      case HttpStatusCode.SERVICE_UNAVAILABLE:
        return 'Service temporarily unavailable. Please try again later.'
      default:
        if (this.status >= 500) {
          return 'A server error occurred. Please try again later.'
        }
        if (this.status >= 400) {
          return 'A client error occurred. Please check your request.'
        }
        return 'An unexpected error occurred.'
    }
  }
}

/**
 * Network error for cases where no response is received
 */
export class NetworkError extends InfrastructureError {
  public override readonly cause?: Error | undefined

  constructor(message: string, cause?: Error | undefined) {
    super(message, 'NETWORK_ERROR', true, { cause: cause?.message })
    this.cause = cause
  }

  override getUserMessage(): string {
    return 'Network error. Please check your connection and try again.'
  }
}

/**
 * Timeout error for requests that take too long
 */
export class TimeoutError extends InfrastructureError {
  public readonly timeout: number

  constructor(timeout: number) {
    super(`Request timed out after ${timeout}ms`, 'TIMEOUT_ERROR', true, { timeout })
    this.timeout = timeout
  }

  override getUserMessage(): string {
    return 'Request timed out. Please try again.'
  }
}

/**
 * Type guard to check if error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

/**
 * Type guard to check if error is a NetworkError
 */
export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError
}

/**
 * Type guard to check if error is a TimeoutError
 */
export function isTimeoutError(error: unknown): error is TimeoutError {
  return error instanceof TimeoutError
}
