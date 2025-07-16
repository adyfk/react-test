import { ApiError, NetworkError, TimeoutError } from '@/core/errors/api.error'
import { createChildLogger } from '@/core/logging/logger'
import { githubApiClient } from '../api/github-api.client'
import type {
  GitHubUser,
  GitHubUserSearchResult,
  GitHubRepository,
  GitHubRateLimit,
  GitHubSearchParams,
  GitHubRepoSearchParams,
} from '../types/github.types'

/**
 * GitHub API service for interacting with GitHub API
 */
export class GitHubApiService {
  private readonly logger = createChildLogger({ service: 'GitHubApiService' })
  private readonly client = githubApiClient

  /**
   * Search for GitHub users
   */
  async searchUsers(params: GitHubSearchParams): Promise<GitHubUserSearchResult> {
    const { query, sort, order, per_page = 30, page = 1 } = params

    this.logger.info('Searching GitHub users', { query, sort, order, per_page, page })

    try {
      const result = await this.client.searchUsers({
        query,
        ...(sort && { sort }),
        ...(order && { order }),
        per_page,
        page,
      })

      this.logger.info('Users search completed', {
        query,
        totalResults: result.total_count,
        resultsReturned: result.items.length,
      })

      return result
    } catch (error) {
      this.logger.error('GitHub users search failed', error as Error, {
        query,
        sort,
        order,
        per_page,
        page,
      })

      if (error instanceof Error) {
        throw this.handleApiError(error)
      }
      throw error
    }
  }

  /**
   * Get a specific user by username
   */
  async getUser(username: string): Promise<GitHubUser> {
    this.logger.info('Retrieving GitHub user', { username })

    try {
      const user = await this.client.getUser(username)

      this.logger.info('User profile retrieved', {
        username,
        userId: user.id,
      })

      return user
    } catch (error) {
      this.logger.error('GitHub user retrieval failed', error as Error, { username })

      if (error instanceof Error) {
        throw this.handleApiError(error)
      }
      throw error
    }
  }

  /**
   * Get user repositories
   */
  async getUserRepositories(params: GitHubRepoSearchParams): Promise<GitHubRepository[]> {
    const { username, type = 'owner', sort = 'updated', direction = 'desc', per_page = 30, page = 1 } = params

    this.logger.info('Retrieving user repositories', { username, type, sort, direction, per_page, page })

    try {
      const repositories = await this.client.getUserRepositories({
        username,
        type,
        sort,
        direction,
        per_page,
        page,
      })

      this.logger.info('User repositories retrieved', {
        username,
        repositoryCount: repositories.length,
      })

      return repositories
    } catch (error) {
      this.logger.error('GitHub repositories retrieval failed', error as Error, {
        username,
        type,
        sort,
        direction,
        per_page,
        page,
      })

      if (error instanceof Error) {
        throw this.handleApiError(error)
      }
      throw error
    }
  }

  /**
   * Get a specific repository
   */
  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    this.logger.info('Retrieving GitHub repository', { owner, repo })

    try {
      const repository = await this.client.getRepository(owner, repo)

      this.logger.info('Repository retrieved', {
        owner,
        repo,
        repositoryId: repository.id,
      })

      return repository
    } catch (error) {
      this.logger.error('GitHub repository retrieval failed', error as Error, { owner, repo })

      if (error instanceof Error) {
        throw this.handleApiError(error)
      }
      throw error
    }
  }

  /**
   * Get rate limit information
   */
  async getRateLimit(): Promise<GitHubRateLimit> {
    this.logger.info('Retrieving GitHub rate limit')

    try {
      const rateLimit = await this.client.getRateLimit()

      this.logger.info('Rate limit retrieved', {
        limit: rateLimit.limit,
        remaining: rateLimit.remaining,
        reset: rateLimit.reset,
      })

      return rateLimit
    } catch (error) {
      this.logger.error('GitHub rate limit retrieval failed', error as Error)

      if (error instanceof Error) {
        throw this.handleApiError(error)
      }
      throw error
    }
  }

  /**
   * Validate search parameters
   */
  validateSearchParams(params: GitHubSearchParams): { isValid: boolean; error?: string } {
    const { query } = params

    if (query.length < 1) {
      return {
        isValid: false,
        error: 'Search query must be at least 1 character(s)',
      }
    }

    if (query.length > 256) {
      return {
        isValid: false,
        error: 'Search query must be no more than 256 characters',
      }
    }

    return {
      isValid: true,
    }
  }

  /**
   * Handle API errors and convert them to application errors
   */
  private handleApiError(error: Error): Error {
    if (error.name === 'AbortError') {
      return new TimeoutError(10000)
    }

    if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
      return new NetworkError('Network error occurred')
    }

    if (error.message.includes('400')) {
      return new ApiError(400, 'Bad Request', error.message)
    }

    if (error.message.includes('401')) {
      return new ApiError(401, 'Unauthorized', error.message)
    }

    if (error.message.includes('403')) {
      return new ApiError(403, 'Forbidden', error.message)
    }

    if (error.message.includes('404')) {
      return new ApiError(404, 'Not Found', error.message)
    }

    if (error.message.includes('429')) {
      return new ApiError(429, 'Too Many Requests', error.message)
    }

    if (error.message.includes('500')) {
      return new ApiError(500, 'Internal Server Error', error.message)
    }

    return new ApiError(500, 'Unknown Error', error.message)
  }
}

// Singleton instance
export const githubApiService = new GitHubApiService()
