import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals'
import { analytics } from './analytics'

// Performance monitoring utilities
export const performanceMonitor = {
  // Track page load performance
  trackPageLoad: (pageName: string) => {
    if (typeof window !== 'undefined') {
      // Core Web Vitals tracking
      onCLS((metric) => {
        analytics.trackAction('core_web_vitals', 'performance', 'CLS', metric.value)
        console.log(`Performance: CLS: ${metric.value} on ${pageName}`, metric)
      })

      onINP((metric) => {
        analytics.trackAction('core_web_vitals', 'performance', 'INP', metric.value)
        console.log(`Performance: INP: ${metric.value} on ${pageName}`, metric)
      })

      onFCP((metric) => {
        analytics.trackAction('core_web_vitals', 'performance', 'FCP', metric.value)
        console.log(`Performance: FCP: ${metric.value} on ${pageName}`, metric)
      })

      onLCP((metric) => {
        analytics.trackAction('core_web_vitals', 'performance', 'LCP', metric.value)
        console.log(`Performance: LCP: ${metric.value} on ${pageName}`, metric)
      })

      onTTFB((metric) => {
        analytics.trackAction('core_web_vitals', 'performance', 'TTFB', metric.value)
        console.log(`Performance: TTFB: ${metric.value} on ${pageName}`, metric)
      })
    }
  },

  // Track custom events
  trackEvent: (eventName: string, properties?: Record<string, unknown>) => {
    if (typeof window !== 'undefined') {
      analytics.trackAction(eventName, 'custom_event', undefined, undefined)
      console.log(`Custom Event: ${eventName}`, properties || {})
    }
  },

  // Track errors
  trackError: (error: Error, context?: Record<string, unknown>) => {
    if (typeof window !== 'undefined') {
      console.error('Error tracked:', error.message, context || {})
      // In the future, third-party error tracking can be added here
    }
  },

  // Track user interactions
  trackInteraction: (element: string, action: string) => {
    if (typeof window !== 'undefined') {
      analytics.trackAction('user_interaction', 'interaction', `${action}_on_${element}`)
    }
  },
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
