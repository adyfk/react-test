'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { githubApiService } from '../services/github-api.service'
import type { GitHubRateLimit } from '../types/github.types'

export function RateLimitIndicator() {
  const [rateLimit, setRateLimit] = useState<GitHubRateLimit | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRateLimit = async () => {
      try {
        const limit = await githubApiService.getRateLimit()
        setRateLimit(limit)
      } catch (error) {
        console.error('Failed to fetch rate limit:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRateLimit()

    // Update rate limit every 5 minutes
    const interval = setInterval(fetchRateLimit, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading rate limit...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!rateLimit) {
    return null
  }

  const remainingPercentage = (rateLimit.remaining / rateLimit.limit) * 100
  const resetTime = new Date(rateLimit.reset * 1000)
  const timeUntilReset = Math.max(0, resetTime.getTime() - Date.now())
  const minutesUntilReset = Math.floor(timeUntilReset / (1000 * 60))

  const getStatusIcon = () => {
    if (remainingPercentage > 50) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    } else if (remainingPercentage > 20) {
      return <Clock className="h-4 w-4 text-yellow-500" />
    } else {
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = () => {
    if (remainingPercentage > 50) return 'default'
    if (remainingPercentage > 20) return 'secondary'
    return 'destructive'
  }

  return (
    <Card className="w-full">
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm font-medium">API Rate Limit</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusColor()} className="text-xs">
              {rateLimit.remaining}/{rateLimit.limit}
            </Badge>
            {minutesUntilReset > 0 && (
              <span className="text-xs text-muted-foreground">
                Resets in {minutesUntilReset}m
              </span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${remainingPercentage > 50 ? 'bg-green-500' : remainingPercentage > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${remainingPercentage}%` }}
          />
        </div>

        {remainingPercentage < 20 && (
          <p className="text-xs text-muted-foreground mt-1">
            API rate limit is running low. Consider waiting before making more requests.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
