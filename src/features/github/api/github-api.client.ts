import { BaseApiClient } from '@/core/api/base-api.client'
import { ValidationError } from '@/core/errors/base.error'
import { clientConfig } from '@/core/config/client.config'
import type { GitHubUser, GitHubUserSearchResult, GitHubRepository, GitHubRateLimit } from '../types/github.types'

/**
 * GitHub API client configuration
 */
const GITHUB_CONFIG = {
  baseUrl: clientConfig.api.baseUrl,
  timeout: clientConfig.api.timeout,
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    // 'User-Agent': clientConfig.github.userAgent,
  },
}

/**
 * GitHub API endpoints
 */
const ENDPOINTS = {
  SEARCH_USERS: '/search/users',
  USERS: '/users',
  USER_REPOS: (username: string) => `/users/${username}/repos`,
  REPO: (owner: string, repo: string) => `/repos/${owner}/${repo}`,
  RATE_LIMIT: '/rate_limit',
} as const

/**
 * GitHub API validation
 */
const VALIDATION = {
  SEARCH_MIN_CHARS: 1,
  SEARCH_MAX_CHARS: 256,
} as const

/**
 * GitHub API client
 */
export class GitHubApiClient extends BaseApiClient {
  constructor() {
    super(GITHUB_CONFIG)
  }

  /**
   * Search for GitHub users
   */
  async searchUsers(params: {
    query: string
    sort?: 'followers' | 'repositories' | 'joined'
    order?: 'asc' | 'desc'
    per_page?: number
    page?: number
  }): Promise<GitHubUserSearchResult> {
    const { query, sort, order, per_page = clientConfig.github.defaultPerPage, page = 1 } = params

    // Validate query
    if (query.length < VALIDATION.SEARCH_MIN_CHARS) {
      throw new ValidationError(
        `Search query must be at least ${VALIDATION.SEARCH_MIN_CHARS} character(s)`,
        'query',
      )
    }
    if (query.length > VALIDATION.SEARCH_MAX_CHARS) {
      throw new ValidationError(
        `Search query must be no more than ${VALIDATION.SEARCH_MAX_CHARS} characters`,
        'query',
      )
    }

    const searchParams = new URLSearchParams({
      q: query,
      per_page: Math.min(per_page, clientConfig.github.maxPerPage).toString(),
      page: page.toString(),
    })

    if (sort) searchParams.set('sort', sort)
    if (order) searchParams.set('order', order)

    const response = await this.get<GitHubUserSearchResult>(
      `${ENDPOINTS.SEARCH_USERS}?${searchParams.toString()}`,
    )

    return response.data
  }

  /**
   * Get a specific user by username
   */
  async getUser(username: string): Promise<GitHubUser> {
    const response = await this.get<GitHubUser>(`${ENDPOINTS.USERS}/${encodeURIComponent(username)}`)
    return response.data
  }

  /**
   * Get user repositories
   */
  async getUserRepositories(params: {
    username: string
    type?: 'owner' | 'member' | 'collaborator'
    sort?: 'created' | 'updated' | 'pushed' | 'full_name'
    direction?: 'asc' | 'desc'
    per_page?: number
    page?: number
  }): Promise<GitHubRepository[]> {
    const {
      username,
      type = 'owner',
      sort = 'updated',
      direction = 'desc',
      per_page = clientConfig.github.defaultPerPage,
      page = 1,
    } = params

    const searchParams = new URLSearchParams({
      type,
      sort,
      direction,
      per_page: Math.min(per_page, clientConfig.github.maxPerPage).toString(),
      page: page.toString(),
    })

    const response = await this.get<GitHubRepository[]>(
      `${ENDPOINTS.USER_REPOS(encodeURIComponent(username))}?${searchParams.toString()}`,
    )

    return response.data
  }

  /**
   * Get a specific repository
   */
  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    const response = await this.get<GitHubRepository>(
      ENDPOINTS.REPO(encodeURIComponent(owner), encodeURIComponent(repo)),
    )
    return response.data
  }

  /**
   * Get rate limit information
   */
  async getRateLimit(): Promise<GitHubRateLimit> {
    const response = await this.get<{ rate: GitHubRateLimit }>(ENDPOINTS.RATE_LIMIT)
    return response.data.rate
  }
}

// Singleton instance
export const githubApiClient = new GitHubApiClient()
