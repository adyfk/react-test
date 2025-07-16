import { useEffect, useCallback } from 'react'
import { useAsyncCallback } from '@/shared/hooks/use-async'
import { githubApiService } from '../services/github-api.service'
import type { GitHubUser, GitHubRepoSearchParams } from '../types/github.types'
import { GitHubRepository } from '@/types/github'

/**
 * GitHub repositories hook options
 */
export interface UseGitHubRepositoriesOptions {
  autoFetch?: boolean
  sort?: GitHubRepoSearchParams['sort']
  direction?: GitHubRepoSearchParams['direction']
  perPage?: number
}

/**
 * Custom hook for managing GitHub repositories for a user
 */
export function useGitHubRepositories(
  user: GitHubUser | null,
  options: UseGitHubRepositoriesOptions = {},
) {
  const {
    autoFetch = true,
    sort = 'updated',
    direction = 'desc',
    perPage = 30,
  } = options

  // Memoize the async function to prevent recreation on every render
  const fetchRepositoriesCallback = useCallback(
    async (username: string) => {
      const params: GitHubRepoSearchParams = {
        username,
        sort,
        direction,
        per_page: perPage,
      }

      return await githubApiService.getUserRepositories(params)
    },
    [sort, direction, perPage],
  )

  const {
    data: repositories,
    loading,
    error,
    execute: fetchRepositories,
    reset,
  } = useAsyncCallback(
    fetchRepositoriesCallback,
    [sort, direction, perPage],
  )

  // Auto-fetch repositories when user changes
  useEffect(() => {
    if (autoFetch && user?.login) {
      fetchRepositories(user.login).catch(() => {
        // Error is handled by the useAsyncCallback hook
      })
    } else if (!user) {
      reset()
    }
    // We intentionally don't include 'user' in dependencies to prevent unnecessary re-renders
    // user?.login is sufficient to detect when the user changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.login, autoFetch, fetchRepositories, reset])

  const refetch = async () => {
    if (user?.login) {
      await fetchRepositories(user.login)
    }
  }

  return {
    // State
    repositories: repositories || [],
    loading,
    error,
    user,

    // Actions
    refetch,
    reset,

    // Computed
    hasRepositories: (repositories?.length || 0) > 0,
    isEmpty: !loading && (repositories?.length || 0) === 0,
    repositoryCount: repositories?.length || 0,

    // Repository statistics
    totalStars: repositories?.reduce((acc, repo) => acc + repo.stargazers_count, 0) || 0,
    totalForks: repositories?.reduce((acc, repo) => acc + repo.forks_count, 0) || 0,
    languages: repositories?.reduce((acc, repo) => {
      if (repo.language && !acc.includes(repo.language)) {
        acc.push(repo.language)
      }
      return acc
    }, [] as string[]) || [],

    // Most popular repository
    mostPopularRepo: repositories?.reduce((prev, current) =>
      (prev.stargazers_count > current.stargazers_count) ? prev : current,
      {} as GitHubRepository,
    ),
  }
}
