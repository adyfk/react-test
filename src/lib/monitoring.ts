// Performance monitoring utilities
export const performanceMonitor = {
  // Track page load performance
  trackPageLoad: (_pageName: string) => {
    if (typeof window !== 'undefined') {
      // Core Web Vitals
      import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
        onCLS(console.log)
        onINP(console.log)
        onFCP(console.log)
        onLCP(console.log)
        onTTFB(console.log)
      })
    }
  },

  // Track custom events
  trackEvent: (eventName: string, properties?: Record<string, unknown>) => {
    if (typeof window !== 'undefined') {
      console.log(`Event: ${eventName}`, properties)
      // Replace with your analytics service
      // Example: gtag('event', eventName, properties)
      // Example: posthog.capture(eventName, properties)
    }
  },

  // Track errors
  trackError: (error: Error, context?: Record<string, unknown>) => {
    if (typeof window !== 'undefined') {
      console.error('Error tracked:', error, context)
      // Replace with your error tracking service
      // Example: Sentry.captureException(error, { extra: context })
    }
  },

  // Track user interactions
  trackInteraction: (element: string, action: string) => {
    if (typeof window !== 'undefined') {
      console.log(`Interaction: ${action} on ${element}`)
      // Replace with your analytics service
    }
  },
}

// Error boundary for React components
export class ErrorBoundary extends Error {
  constructor(message: string, public context?: Record<string, unknown>) {
    super(message)
    this.name = 'ErrorBoundary'
  }
}

// Performance measurement utilities
export const measurePerformance = {
  // Measure function execution time
  measureAsync: async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
    const start = performance.now()
    try {
      const result = await fn()
      const end = performance.now()
      console.log(`${name} took ${end - start} milliseconds`)
      return result
    } catch (error) {
      const end = performance.now()
      console.log(`${name} failed after ${end - start} milliseconds`)
      throw error
    }
  },

  // Measure component render time
  measureRender: (componentName: string) => {
    const start = performance.now()
    return () => {
      const end = performance.now()
      console.log(`${componentName} rendered in ${end - start} milliseconds`)
    }
  },
}

// Usage examples:
// performanceMonitor.trackPageLoad('Home')
// performanceMonitor.trackEvent('button_click', { buttonId: 'submit' })
// performanceMonitor.trackError(new Error('Something went wrong'), { userId: '123' })
// await measurePerformance.measureAsync('API Call', () => fetchData())
// const endMeasure = measurePerformance.measureRender('MyComponent')
// // ... component render logic
// endMeasure()
