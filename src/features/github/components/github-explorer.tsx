'use client'

import { useState } from 'react'
import { Github } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorBoundary } from '@/components/error-boundary'
import UserSearch from './user-search'
import RepositoryDisplay from './repository-display'
import type { GitHubUser } from '../types/github.types'
import { ModeToggle } from '@/components/ui/mode-toggle'

/**
 * Main GitHub Explorer component with enterprise-grade architecture
 */
export default function GitHubExplorer() {
  const [selectedUser, setSelectedUser] = useState<GitHubUser | null>(null)

  const handleUserSelect = (user: GitHubUser) => {
    setSelectedUser(user)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-dashed">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Github className="h-6 w-6" />
              GitHub User Explorer
            </CardTitle>
            <ModeToggle />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Search for GitHub users by username and explore their public repositories.
            This application demonstrates an enterprise-grade React architecture with
            proper separation of concerns, error handling, and performance optimization.
          </p>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - User Search */}
        <div className="space-y-4">
          <ErrorBoundary
            name="UserSearch"
            level="component"
            onError={(error, errorInfo) => {
              console.error('User search component error:', error, errorInfo)
            }}
          >
            <UserSearch
              onUserSelect={handleUserSelect}
              selectedUser={selectedUser}
            />
          </ErrorBoundary>
        </div>

        {/* Right Column - Repository Display */}
        <div className="space-y-4">
          <ErrorBoundary
            name="RepositoryDisplay"
            level="component"
            onError={(error, errorInfo) => {
              console.error('Repository display component error:', error, errorInfo)
            }}
          >
            <RepositoryDisplay user={selectedUser} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}
