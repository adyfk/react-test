/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use client'

import React from 'react'
import { logger } from '@/core/logging/logger'
import { performanceMonitor } from '@/core/monitoring/monitoring'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
  errorId?: string
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  level?: 'page' | 'component' | 'feature'
  name?: string
}

interface ErrorFallbackProps {
  error: Error
  errorInfo: React.ErrorInfo
  resetError: () => void
  errorId: string
  level: string
}

/**
 * Enhanced React Error Boundary with comprehensive error handling
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryCount = 0
  private maxRetries = 3

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state to show the fallback UI
    return {
      hasError: true,
      error,
    }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorId = this.generateErrorId()
    const context = {
      errorId,
      componentStack: errorInfo.componentStack,
      errorBoundary: this.props.name || 'Unknown',
      level: this.props.level || 'component',
      retryCount: this.retryCount,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    }

    // Log error with context
    logger.error('React Error Boundary caught error', error, context)

    // Track error in monitoring
    performanceMonitor.trackError(error, context)

    // Update state with error info
    this.setState({
      errorInfo,
      errorId,
    })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private resetError = () => {
    this.retryCount += 1

    if (this.retryCount <= this.maxRetries) {
      logger.info(`Attempting to recover from error (retry ${this.retryCount}/${this.maxRetries})`, {
        errorId: this.state.errorId,
        retryCount: this.retryCount,
      })

      this.setState({
        hasError: false,
      })
    } else {
      logger.error('Max retry attempts reached, displaying persistent error state', new Error('Max retry attempts reached'), {
        errorId: this.state.errorId,
        retryCount: this.retryCount,
        maxRetries: this.maxRetries,
      })
    }
  }

  private reloadPage = () => {
    logger.info('User requested page reload after error', {
      errorId: this.state.errorId,
    })

    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  override render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback component if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return (
          <FallbackComponent
            error={this.state.error}
            errorInfo={this.state.errorInfo!}
            resetError={this.resetError}
            errorId={this.state.errorId!}
            level={this.props.level || 'component'}
          />
        )
      }

      // Default fallback UI
      return (
        <DefaultErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo!}
          resetError={this.resetError}
          errorId={this.state.errorId!}
          level={this.props.level || 'component'}
          canRetry={this.retryCount < this.maxRetries}
          onReload={this.reloadPage}
        />
      )
    }

    return this.props.children
  }
}

/**
 * Default Error Fallback Component
 */
interface DefaultErrorFallbackProps extends ErrorFallbackProps {
  canRetry: boolean
  onReload: () => void
}

function DefaultErrorFallback({
  error,
  errorId,
  level,
  resetError,
  canRetry,
  onReload,
}: DefaultErrorFallbackProps) {
  const isPageLevel = level === 'page'

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <h2 className="text-lg font-semibold">
            {isPageLevel ? 'Page Error' : 'Component Error'}
          </h2>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {isPageLevel
              ? 'An error occurred while loading this page. Please try again or reload the page.'
              : 'An error occurred in this component. You can try to reload it or refresh the page.'}
          </p>

          {process.env.NODE_ENV === 'development' && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-xs font-mono text-red-700 break-all">
                {error.message}
              </p>
              <p className="text-xs text-red-600 mt-1">
                Error ID: {errorId}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            {canRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetError}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            )}

            <Button
              variant="default"
              size="sm"
              onClick={onReload}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reload Page
            </Button>
          </div>

          {!canRetry && (
            <p className="text-xs text-red-600">
              Maximum retry attempts reached. Please reload the page.
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}

/**
 * Higher-order component to wrap components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: React.ComponentType<ErrorFallbackProps>
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void
    name?: string
    level?: 'page' | 'component' | 'feature'
  },
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary
      {...(options?.fallback && { fallback: options.fallback })}
      {...(options?.onError && { onError: options.onError })}
      name={options?.name || Component.displayName || Component.name}
      level={options?.level || 'component'}
    >
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  return WrappedComponent
}

/**
 * Hook to trigger error boundary from within functional components
 */
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null)

  const captureError = React.useCallback((error: Error) => {
    setError(error)
  }, [])

  if (error) {
    throw error
  }

  return captureError
}

// Usage examples:
//
// // Basic usage:
// <ErrorBoundary>
//   <MyComponent />
// </ErrorBoundary>
//
// // With custom fallback and error handling:
// <ErrorBoundary
//   fallback={CustomErrorFallback}
//   onError={(error, errorInfo) => console.log('Custom error handler', error)}
//   name="MyFeature"
//   level="feature"
// >
//   <MyFeature />
// </ErrorBoundary>
//
// // Using HOC:
// const SafeComponent = withErrorBoundary(MyComponent, {
//   name: 'MyComponent',
//   level: 'component'
// })
//
// // Using hook in functional component:
// function MyComponent() {
//   const captureError = useErrorBoundary()
//
//   const handleClick = () => {
//     try {
//       // risky operation
//     } catch (error) {
//       captureError(error)
//     }
//   }
// }
