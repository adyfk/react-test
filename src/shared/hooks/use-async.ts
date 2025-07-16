import { useState, useEffect, useCallback, useRef } from 'react'
import { getErrorMessage } from '@/core/errors/base.error'

/**
 * Async state interface
 */
export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

/**
 * Async hook options
 */
export interface UseAsyncOptions {
  immediate?: boolean
  onSuccess?: (data: unknown) => void
  onError?: (error: unknown) => void
}

/**
 * Custom hook for managing async operations
 * @param asyncFunction - The async function to execute
 * @param options - Configuration options
 * @returns Async state and control functions
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions = {},
) {
  const { immediate = false, onSuccess, onError } = options
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const mountedRef = useRef(true)
  const asyncFunctionRef = useRef(asyncFunction)

  // Update the async function ref when it changes
  useEffect(() => {
    asyncFunctionRef.current = asyncFunction
  }, [asyncFunction])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const execute = useCallback(async (): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const data = await asyncFunctionRef.current()

      if (mountedRef.current) {
        setState({ data, loading: false, error: null })
        onSuccess?.(data)
      }

      return data
    } catch (error) {
      const errorMessage = getErrorMessage(error)

      if (mountedRef.current) {
        setState(prev => ({ ...prev, loading: false, error: errorMessage }))
        onError?.(error)
      }

      throw error
    }
  }, [onSuccess, onError])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute().catch(() => {
        // Error is already handled in execute function
      })
    }
  }, [immediate, execute])

  return {
    ...state,
    execute,
    reset,
  }
}

/**
 * Custom hook for async operations that depend on parameters
 * @param asyncFunction - The async function that takes parameters
 * @param dependencies - Dependencies that trigger re-execution
 * @param options - Configuration options
 * @returns Async state and control functions
 */
export function useAsyncCallback<T, P extends unknown[]>(
  asyncFunction: (...params: P) => Promise<T>,
  dependencies: React.DependencyList = [],
  options: UseAsyncOptions = {},
) {
  const { onSuccess, onError } = options
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const mountedRef = useRef(true)
  const asyncFunctionRef = useRef(asyncFunction)
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError)

  // Update refs when functions change
  useEffect(() => {
    asyncFunctionRef.current = asyncFunction
    onSuccessRef.current = onSuccess
    onErrorRef.current = onError
  })

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const execute = useCallback(
    async (...params: P): Promise<T | null> => {
      setState(prev => ({ ...prev, loading: true, error: null }))

      try {
        const data = await asyncFunctionRef.current(...params)

        if (mountedRef.current) {
          setState({ data, loading: false, error: null })
          onSuccessRef.current?.(data)
        }

        return data
      } catch (error) {
        const errorMessage = getErrorMessage(error)

        if (mountedRef.current) {
          setState(prev => ({ ...prev, loading: false, error: errorMessage }))
          onErrorRef.current?.(error)
        }

        throw error
      }
    },
    // Only depend on the dependencies array, not the functions
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dependencies,
  )

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}
