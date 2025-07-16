import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

/**
 * Client-side environment configuration
 * Only contains NEXT_PUBLIC_ variables that are safe to expose to the client bundle
 */
export const clientEnv = createEnv({
  client: {
    NEXT_PUBLIC_APP_NAME: z.string().optional().default('GitHub Explorer'),
    NEXT_PUBLIC_API_BASE_URL: z.string().url().optional().default('https://api.github.com'),
    NEXT_PUBLIC_ENABLE_ANALYTICS: z.boolean().optional().default(false),
    NEXT_PUBLIC_SITE_URL: z.string().url().optional().default('https://github-explorer.app'),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
})

/**
 * Client-side application configuration
 * Safe to use in client components and server components
 */
export const clientConfig = {
  app: {
    name: clientEnv.NEXT_PUBLIC_APP_NAME,
    version: '1.0.0',
  },
  api: {
    baseUrl: clientEnv.NEXT_PUBLIC_API_BASE_URL,
    timeout: 10000,
    retries: 3,
  },
  github: {
    apiVersion: 'v3',
    // userAgent: `${clientEnv.NEXT_PUBLIC_APP_NAME}/1.0.0`,
    defaultPerPage: 30,
    maxPerPage: 100,
  },
  features: {
    analytics: clientEnv.NEXT_PUBLIC_ENABLE_ANALYTICS,
    darkMode: true,
    search: {
      debounceMs: 300,
      minCharacters: 2,
    },
  },
  ui: {
    theme: {
      defaultMode: 'system' as const,
    },
    animations: {
      duration: 200,
    },
  },
} as const

export type ClientConfig = typeof clientConfig
export type ClientEnv = typeof clientEnv
