'use client'

import React from 'react'
import { ExternalLink, GitFork, Star, Calendar, Code, BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import { useGitHubRepositories } from '../hooks/use-github-repositories'
import type { GitHubUser, GitHubRepository } from '../types/github.types'

/**
 * Repository display component props
 */
export interface RepositoryDisplayProps {
  user: GitHubUser | null
}

/**
 * Repository item component
 */
interface RepositoryItemProps {
  repository: GitHubRepository
}

function RepositoryItem({ repository }: RepositoryItemProps) {
  return (
    <Card className="hover:shadow-md transition-shadow gap-0">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{repository.name}</span>
              {repository.private && (
                <Badge variant="secondary" className="text-xs">
                  Private
                </Badge>
              )}
              {repository.fork && (
                <Badge variant="outline" className="text-xs">
                  Fork
                </Badge>
              )}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 ml-2"
            asChild
          >
            <a
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${repository.name} on GitHub`}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {repository.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {repository.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {repository.language && (
            <div className="flex items-center gap-1">
              <Code className="h-3 w-3" />
              <span>{repository.language}</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            <span>{repository.stargazers_count}</span>
          </div>

          <div className="flex items-center gap-1">
            <GitFork className="h-3 w-3" />
            <span>{repository.forks_count}</span>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              {new Date(repository.updated_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {repository.topics && repository.topics.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {repository.topics.slice(0, 3).map((topic) => (
              <Badge key={topic} variant="outline" className="text-xs">
                {topic}
              </Badge>
            ))}
            {repository.topics.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{repository.topics.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Loading skeleton for repositories
 */
function RepositoriesSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

/**
 * Empty state for no user selected
 */
function NoUserSelected() {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          No User Selected
        </h3>
        <p className="text-muted-foreground">
          Select a user from the search results to view their repositories
        </p>
      </CardContent>
    </Card>
  )
}

/**
 * Empty state for no repositories
 */
function NoRepositories({ username }: { username: string }) {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          No Public Repositories
        </h3>
        <p className="text-muted-foreground">
          {username} doesn&apos;t have any public repositories
        </p>
      </CardContent>
    </Card>
  )
}

/**
 * Repository statistics component
 */
function RepositoryStats({
  repositoryCount,
  totalStars,
  totalForks,
  languages,
}: {
  repositoryCount: number
  totalStars: number
  totalForks: number
  languages: string[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Repository Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{repositoryCount}</div>
            <div className="text-sm text-muted-foreground">Repositories</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{totalStars}</div>
            <div className="text-sm text-muted-foreground">Total Stars</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{totalForks}</div>
            <div className="text-sm text-muted-foreground">Total Forks</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{languages.length}</div>
            <div className="text-sm text-muted-foreground">Languages</div>
          </div>
        </div>

        {languages.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Top Languages</h4>
            <div className="flex flex-wrap gap-1">
              {languages.slice(0, 5).map((language) => (
                <Badge key={language} variant="secondary" className="text-xs">
                  {language}
                </Badge>
              ))}
              {languages.length > 5 && (
                <Badge variant="secondary" className="text-xs">
                  +{languages.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Enhanced repository display component with improved UX
 */
export default function RepositoryDisplay({ user }: RepositoryDisplayProps) {
  const {
    repositories,
    loading,
    error,
    hasRepositories,
    isEmpty,
    repositoryCount,
    totalStars,
    totalForks,
    languages,
    refetch,
  } = useGitHubRepositories(user)

  // No user selected state
  if (!user) {
    return <NoUserSelected />
  }

  return (
    <div className="space-y-4">
      {/* User Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Image
                src={user.avatar_url}
                alt={`${user.login}'s avatar`}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full"
                priority
              />
              {user.login}&apos;s Repositories
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              disabled={loading}
            >
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Statistics */}
      {hasRepositories && !loading && (
        <RepositoryStats
          repositoryCount={repositoryCount}
          totalStars={totalStars}
          totalForks={totalForks}
          languages={languages}
        />
      )}

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-destructive">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={refetch}
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && <RepositoriesSkeleton />}

      {/* Empty State */}
      {!loading && isEmpty && <NoRepositories username={user.login} />}

      {/* Repositories List */}
      {!loading && hasRepositories && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              Public Repositories ({repositoryCount})
            </h3>
          </div>

          <div className="space-y-4">
            {repositories.map((repository) => (
              <RepositoryItem
                key={repository.id}
                repository={repository}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
