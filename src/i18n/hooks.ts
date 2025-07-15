'use client'

import { useTranslations as useNextIntlTranslations } from 'next-intl'
import type {
  NamespaceKeys,
  Messages,
  TranslationKey,
  NestedKeys,
} from './generated-types'

// Simple type-safe wrapper for useTranslations
export function useTranslations<T extends NamespaceKeys>(namespace: T) {
  return useNextIntlTranslations(namespace)
}

// Export types for external use
export type {
  NamespaceKeys,
  NestedKeys,
  TranslationKey,
  Messages,
}
