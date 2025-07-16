import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

/**
 * Server-side environment configuration
 * Contains server-only variables that should NEVER be exposed to the client bundle
 * Only import this file in server-side code (API routes, server components, etc.)
 */
export const serverEnv = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).optional().default('info'),
    // Add other server-only variables here
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    LOG_LEVEL: process.env.LOG_LEVEL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
})

/**
 * Server-side application configuration
 * Only use this in server-side code (API routes, server actions, etc.)
 */
export const serverConfig = {
  app: {
    environment: serverEnv.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
  },
  logging: {
    level: serverEnv.LOG_LEVEL,
    enableConsole: serverEnv.NODE_ENV === 'development',
  },
} as const

/**
 * Server-side utility functions
 */
export const isDevelopment = (): boolean => serverEnv.NODE_ENV === 'development'
export const isProduction = (): boolean => serverEnv.NODE_ENV === 'production'
export const isTest = (): boolean => serverEnv.NODE_ENV === 'test'

export type ServerConfig = typeof serverConfig
export type ServerEnv = typeof serverEnv
