export interface GitHubUser {
  id: number
  login: string
  avatar_url: string
  html_url: string
  name?: string
  bio?: string
  public_repos: number
  followers: number
  following: number
  created_at: string
}

export interface GitHubUserSearchResult {
  total_count: number
  incomplete_results: boolean
  items: GitHubUser[]
}

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
  license: {
    key: string
    name: string
    spdx_id: string
    url: string
  } | null
  owner: {
    id: number
    login: string
    avatar_url: string
    html_url: string
  }
}

export interface GitHubApiError {
  message: string
  documentation_url?: string
  status?: number
}

export interface GitHubSearchState {
  users: GitHubUser[]
  repositories: GitHubRepository[]
  selectedUser: GitHubUser | null
  isSearching: boolean
  isLoadingRepos: boolean
  error: string | null
  searchQuery: string
}
