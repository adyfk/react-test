import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook that debounces a value
 * @param value - The value to debounce
 * @param delay - The debounce delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Custom hook that provides a debounced callback
 * @param callback - The callback function to debounce
 * @param delay - The debounce delay in milliseconds
 * @param deps - Dependencies array for the callback
 * @returns The debounced callback function
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
  deps: React.DependencyList = [],
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedCallback = useCallback(callback, deps)
  const [debouncedCallback, setDebouncedCallback] = useState<T>(() => memoizedCallback)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCallback(() => memoizedCallback)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [memoizedCallback, delay])

  return debouncedCallback
}
