import { useState, useCallback, useEffect } from 'react'
import { useDebounce } from '@/shared/hooks/use-debounce'
import { useAsyncCallback } from '@/shared/hooks/use-async'
import { githubApiService } from '../services/github-api.service'
import { clientConfig } from '@/core/config/client.config'
import type { GitHubUser, GitHubSearchParams } from '../types/github.types'

/**
 * GitHub search hook state
 */
export interface UseGitHubSearchState {
  users: GitHubUser[]
  loading: boolean
  error: string | null
  hasSearched: boolean
}

/**
 * GitHub search hook options
 */
export interface UseGitHubSearchOptions {
  debounceMs?: number
  minSearchLength?: number
  autoSearch?: boolean
}

/**
 * Custom hook for GitHub user search with debouncing and state management
 */
export function useGitHubSearch(options: UseGitHubSearchOptions = {}) {
  const {
    debounceMs = clientConfig.features.search.debounceMs,
    minSearchLength = clientConfig.features.search.minCharacters,
    autoSearch = true,
  } = options

  const [query, setQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const debouncedQuery = useDebounce(query, debounceMs)

  const {
    data: users,
    loading,
    error,
    execute: executeSearch,
    reset,
  } = useAsyncCallback(
    async (searchQuery: string) => {
      const params: GitHubSearchParams = {
        query: searchQuery,
        sort: 'followers',
        order: 'desc',
        per_page: 10,
      }

      const result = await githubApiService.searchUsers(params)
      setHasSearched(true)
      return result.items
    },
    [debouncedQuery],
  )

  // Auto-search when debounced query changes
  useEffect(() => {
    if (
      autoSearch &&
      debouncedQuery &&
      debouncedQuery.length >= minSearchLength &&
      debouncedQuery.trim() !== ''
    ) {
      executeSearch(debouncedQuery).catch(() => {
        // Error is handled by the useAsyncCallback hook
      })
    }
  }, [debouncedQuery, minSearchLength, autoSearch, executeSearch])

  const search = useCallback(
    async (searchQuery?: string) => {
      const queryToUse = searchQuery ?? query
      if (queryToUse && queryToUse.length >= minSearchLength) {
        await executeSearch(queryToUse)
      }
    },
    [query, minSearchLength, executeSearch],
  )

  const clearSearch = useCallback(() => {
    setQuery('')
    setHasSearched(false)
    reset()
  }, [reset])

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery)
  }, [])

  return {
    // State
    query,
    users: users || [],
    loading,
    error,
    hasSearched,

    // Actions
    search,
    clearSearch,
    updateQuery,

    // Computed
    hasResults: (users?.length || 0) > 0,
    isEmpty: hasSearched && (users?.length || 0) === 0,
    canSearch: query.length >= minSearchLength,
  }
}
