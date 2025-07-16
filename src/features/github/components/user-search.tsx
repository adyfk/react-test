'use client'

import React from 'react'
import { Search, X, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import { useGitHubSearch } from '../hooks/use-github-search'
import { analytics } from '@/core/monitoring/analytics'
import { performanceMonitor } from '@/core/monitoring/monitoring'
import type { GitHubUser } from '../types/github.types'

/**
 * User search component props
 */
export interface UserSearchProps {
  onUserSelect: (user: GitHubUser) => void
  selectedUser: GitHubUser | null
}

/**
 * User search item component
 */
interface UserSearchItemProps {
  user: GitHubUser
  isSelected: boolean
  onSelect: (user: GitHubUser) => void
}

function UserSearchItem({ user, isSelected, onSelect }: UserSearchItemProps) {
  return (
    <div
      className={`
        p-3 border rounded-lg cursor-pointer transition-colors
        ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
      `}
      onClick={() => {
        // Track user selection
        analytics.trackAction('github_user_selected', 'selection', user.login)
        performanceMonitor.trackEvent('github_user_selected', {
          userId: user.id,
          username: user.login,
        })

        onSelect(user)
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(user)
        }
      }}
      aria-label={`Select user ${user.login}`}
    >
      <div className="flex items-center gap-3">
        <Image
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full border"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground truncate">
              {user.login}
            </h3>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Loading skeleton for search results
 */
function SearchResultsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Empty state component
 */
function EmptyState({ hasSearched }: { hasSearched: boolean }) {
  if (!hasSearched) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <User className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p>Enter a username to search for GitHub users</p>
      </div>
    )
  }

  return (
    <div className="text-center py-8 text-muted-foreground">
      <User className="mx-auto h-12 w-12 mb-4 opacity-50" />
      <p>No users found matching your search</p>
      <p className="text-sm mt-1">Try adjusting your search terms</p>
    </div>
  )
}

/**
 * Enhanced user search component with improved UX
 */
export default function UserSearch({ onUserSelect, selectedUser }: UserSearchProps) {
  const {
    query,
    users,
    loading,
    error,
    hasSearched,
    search,
    clearSearch,
    updateQuery,
    hasResults,
    isEmpty,
    canSearch,
  } = useGitHubSearch()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (canSearch) {
      // Track search action
      analytics.trackAction('github_user_search', 'search', 'submit', query.length)
      performanceMonitor.trackEvent('github_search_initiated', { query: query.trim() })

      search().catch(() => {
        // Error is handled by the hook
      })
    }
  }

  const handleClear = () => {
    clearSearch()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search GitHub Users
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Enter GitHub username..."
              value={query}
              onChange={(e) => updateQuery(e.target.value)}
              className="pr-8"
              disabled={loading}
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                onClick={handleClear}
                disabled={loading}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
          <Button
            type="submit"
            disabled={!canSearch || loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </form>

        {/* Error State */}
        {error && (
          <div className="p-3 border border-destructive/20 rounded-lg bg-destructive/5">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Search Results */}
        <div className="space-y-3">
          {loading && <SearchResultsSkeleton />}

          {!loading && (hasResults || isEmpty) && (
            <div className="space-y-3">
              {hasResults && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Found {users.length} user{users.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}

              {users.map((user) => (
                <UserSearchItem
                  key={user.id}
                  user={user}
                  isSelected={selectedUser?.id === user.id}
                  onSelect={onUserSelect}
                />
              ))}

              {isEmpty && <EmptyState hasSearched={hasSearched} />}
            </div>
          )}

          {!loading && !hasSearched && !error && (
            <EmptyState hasSearched={false} />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
