/* eslint-disable indent */
import { BaseError } from '../errors/base.error'

/**
 * Log levels in order of severity
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * Logger interface
 */
export interface ILogger {
  debug(message: string, context?: Record<string, unknown>): void
  info(message: string, context?: Record<string, unknown>): void
  warn(message: string, context?: Record<string, unknown>): void
  error(message: string, error?: Error, context?: Record<string, unknown>): void
}

/**
 * Log entry structure
 */
export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  error?: Error | undefined
  context?: Record<string, unknown> | undefined
}

/**
 * Environment detection utility
 */
function isServer(): boolean {
  return typeof window === 'undefined'
}

function isDevelopment(): boolean {
  if (isServer()) {
    return process.env.NODE_ENV === 'development'
  }
  return window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.includes('dev')
}

/**
 * Get log level from environment
 */
function getLogLevelFromEnvironment(): LogLevel {
  if (isServer()) {
    const level = process.env.LOG_LEVEL || 'info'
    switch (level) {
      case 'debug': return LogLevel.DEBUG
      case 'info': return LogLevel.INFO
      case 'warn': return LogLevel.WARN
      case 'error': return LogLevel.ERROR
      default: return LogLevel.INFO
    }
  } else {
    // Client-side: use INFO in development, ERROR in production
    return isDevelopment() ? LogLevel.INFO : LogLevel.ERROR
  }
}

/**
 * Check if console logging should be enabled
 */
function shouldEnableConsole(): boolean {
  if (isServer()) {
    return process.env.NODE_ENV === 'development'
  }
  return isDevelopment()
}

/**
 * Console logger implementation
 */
class ConsoleLogger implements ILogger {
  private readonly minLevel: LogLevel
  private readonly enableConsole: boolean

  constructor() {
    this.minLevel = getLogLevelFromEnvironment()
    this.enableConsole = shouldEnableConsole()
  }

  private shouldLog(level: LogLevel): boolean {
    return this.enableConsole && level >= this.minLevel
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    error?: Error,
    context?: Record<string, unknown>,
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      error,
      context,
    }
  }

  private formatMessage(entry: LogEntry): string {
    const levelName = LogLevel[entry.level]
    const contextStr = entry.context ? ` | Context: ${JSON.stringify(entry.context)}` : ''
    const errorStr = entry.error ? ` | Error: ${entry.error.message}` : ''
    const errorCode = entry.error && 'code' in entry.error ? ` | Code: ${entry.error.code}` : ''

    return `[${entry.timestamp}] ${levelName} ${entry.message}${contextStr}${errorStr}${errorCode}`
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return

    const entry = this.createLogEntry(LogLevel.DEBUG, message, undefined, context)
    console.debug(this.formatMessage(entry))
  }

  info(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.INFO)) return

    const entry = this.createLogEntry(LogLevel.INFO, message, undefined, context)
    console.info(this.formatMessage(entry))
  }

  warn(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.WARN)) return

    const entry = this.createLogEntry(LogLevel.WARN, message, undefined, context)
    console.warn(this.formatMessage(entry))
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.ERROR)) return

    const entry = this.createLogEntry(LogLevel.ERROR, message, error, context)
    console.error(this.formatMessage(entry))

    if (error?.stack) {
      console.error('Stack trace:', error.stack)
    }

    // In the future, third-party error tracking can be added here
    // For now, we just log to console
  }
}

/**
 * Structured logger for production environments
 */
class StructuredLogger implements ILogger {
  private readonly minLevel: LogLevel

  constructor() {
    this.minLevel = getLogLevelFromEnvironment()
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    error?: Error,
    context?: Record<string, unknown>,
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      error,
      context,
    }
  }

  private outputStructuredLog(entry: LogEntry): void {
    const logData = {
      timestamp: entry.timestamp,
      level: LogLevel[entry.level],
      message: entry.message,
      context: entry.context,
      error: entry.error ? {
        message: entry.error.message,
        name: entry.error.name,
        stack: entry.error.stack,
        code: 'code' in entry.error ? entry.error.code : undefined,
      } : undefined,
    }

    // In production, you might want to send this to a logging service
    console.log(JSON.stringify(logData))
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return
    const entry = this.createLogEntry(LogLevel.DEBUG, message, undefined, context)
    this.outputStructuredLog(entry)
  }

  info(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.INFO)) return
    const entry = this.createLogEntry(LogLevel.INFO, message, undefined, context)
    this.outputStructuredLog(entry)
  }

  warn(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.WARN)) return
    const entry = this.createLogEntry(LogLevel.WARN, message, undefined, context)
    this.outputStructuredLog(entry)
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.ERROR)) return
    const entry = this.createLogEntry(LogLevel.ERROR, message, error, context)
    this.outputStructuredLog(entry)

    // In the future, third-party error tracking can be added here
    // For now, we just log structured output
  }
}

/**
 * Logger factory
 */
function createLogger(): ILogger {
  if (isDevelopment()) {
    return new ConsoleLogger()
  }
  return new StructuredLogger()
}

/**
 * Global logger instance
 */
export const logger = createLogger()

/**
 * Create a child logger with additional context
 */
export function createChildLogger(context: Record<string, unknown>): ILogger {
  const parentLogger = logger

  return {
    debug: (message: string, additionalContext?: Record<string, unknown>) => {
      parentLogger.debug(message, { ...context, ...additionalContext })
    },
    info: (message: string, additionalContext?: Record<string, unknown>) => {
      parentLogger.info(message, { ...context, ...additionalContext })
    },
    warn: (message: string, additionalContext?: Record<string, unknown>) => {
      parentLogger.warn(message, { ...context, ...additionalContext })
    },
    error: (message: string, error?: Error, additionalContext?: Record<string, unknown>) => {
      parentLogger.error(message, error, { ...context, ...additionalContext })
    },
  }
}

/**
 * Utility to get user-friendly error messages
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof BaseError) {
    return error.getUserMessage()
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred'
}

// Types are already exported above

