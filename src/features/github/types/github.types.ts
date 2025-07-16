/**
 * Core GitHub user interface
 */
export interface GitHubUser {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  user_view_type: string
  site_admin: boolean
  score?: number
}

/**
 * GitHub user search result
 */
export interface GitHubUserSearchResult {
  total_count: number
  incomplete_results: boolean
  items: GitHubUser[]
}

/**
 * Core GitHub repository interface
 */
export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  clone_url: string
  git_url: string
  ssh_url: string
  language: string | null
  stargazers_count: number
  watchers_count: number
  forks_count: number
  size: number
  default_branch: string
  open_issues_count: number
  topics: string[]
  created_at: string
  updated_at: string
  pushed_at: string
  private: boolean
  fork: boolean
  archived: boolean
  disabled: boolean
  visibility: string
  license: GitHubLicense | null
  owner: GitHubUser
}

/**
 * GitHub license interface
 */
export interface GitHubLicense {
  key: string
  name: string
  spdx_id: string
  url: string
  node_id?: string
}

/**
 * GitHub rate limit information
 */
export interface GitHubRateLimit {
  limit: number
  remaining: number
  reset: number
  used: number
  resource?: string
}

/**
 * GitHub API response wrapper
 */
export interface GitHubApiResponse<T> {
  data: T
  status: number
  headers: Record<string, string>
  rateLimit?: GitHubRateLimit
}

/**
 * GitHub search parameters
 */
export interface GitHubSearchParams {
  query: string
  sort?: 'followers' | 'repositories' | 'joined'
  order?: 'asc' | 'desc'
  per_page?: number
  page?: number
}

/**
 * GitHub repository search parameters
 */
export interface GitHubRepoSearchParams {
  username: string
  type?: 'owner' | 'member' | 'collaborator'
  sort?: 'created' | 'updated' | 'pushed' | 'full_name'
  direction?: 'asc' | 'desc'
  per_page?: number
  page?: number
}

/**
 * GitHub API error response
 */
export interface GitHubApiErrorResponse {
  message: string
  documentation_url?: string
  errors?: Array<{
    resource: string
    field: string
    code: string
  }>
}

/**
 * GitHub feature state interface
 */
export interface GitHubState {
  users: GitHubUser[]
  repositories: GitHubRepository[]
  selectedUser: GitHubUser | null
  isSearching: boolean
  isLoadingRepos: boolean
  error: string | null
  searchQuery: string
  pagination: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    currentPage: number
    totalPages?: number
  }
}

/**
 * Type guards
 */
export function isGitHubUser(obj: unknown): obj is GitHubUser {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'login' in obj &&
    'avatar_url' in obj
  )
}

export function isGitHubRepository(obj: unknown): obj is GitHubRepository {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'full_name' in obj &&
    'owner' in obj
  )
}

/**
 * Type aliases for common use cases
 */
export type GitHubUserSummary = Pick<GitHubUser, 'id' | 'login' | 'avatar_url' | 'html_url'>
export type GitHubRepoSummary = Pick<GitHubRepository, 'id' | 'name' | 'full_name' | 'description' | 'language' | 'stargazers_count'>
