// Analytics utilities for tracking user behavior
export const analytics = {
  // Initialize analytics (called once in app initialization)
  init: () => {
    if (typeof window !== 'undefined') {
      // Initialize your analytics service here
      // Example: gtag('config', 'GA_TRACKING_ID')
      // Example: posthog.init('API_KEY')
      console.log('Analytics initialized')
    }
  },

  // Track page views
  trackPageView: (path: string, title?: string) => {
    if (typeof window !== 'undefined') {
      console.log(`Page view: ${path}`, { title })
      // Replace with your analytics service
      // Example: gtag('config', 'GA_TRACKING_ID', { page_path: path })
      // Example: posthog.capture('$pageview', { $current_url: path })
    }
  },

  // Track user actions
  trackAction: (action: string, category?: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined') {
      console.log(`Action: ${action}`, { category, label, value })
      // Replace with your analytics service
      // Example: gtag('event', action, { event_category: category, event_label: label, value })
      // Example: posthog.capture(action, { category, label, value })
    }
  },

  // Track user properties
  identifyUser: (userId: string, properties?: Record<string, unknown>) => {
    if (typeof window !== 'undefined') {
      console.log(`User identified: ${userId}`, properties)
      // Replace with your analytics service
      // Example: gtag('config', 'GA_TRACKING_ID', { user_id: userId })
      // Example: posthog.identify(userId, properties)
    }
  },

  // Track conversions
  trackConversion: (eventName: string, value?: number, currency?: string) => {
    if (typeof window !== 'undefined') {
      console.log(`Conversion: ${eventName}`, { value, currency })
      // Replace with your analytics service
      // Example: gtag('event', 'purchase', { transaction_id: eventName, value, currency })
      // Example: posthog.capture('conversion', { event: eventName, value, currency })
    }
  },

  // Track feature usage
  trackFeature: (featureName: string, properties?: Record<string, unknown>) => {
    if (typeof window !== 'undefined') {
      console.log(`Feature used: ${featureName}`, properties)
      // Replace with your analytics service
      // Example: posthog.capture('feature_used', { feature: featureName, ...properties })
    }
  },
}

// Hook for tracking page views in Next.js
export const usePageTracking = () => {
  if (typeof window !== 'undefined') {
    const trackPageView = (url: string) => {
      analytics.trackPageView(url)
    }

    return trackPageView
  }

  return () => { }
}

// Common tracking functions
export const trackThemeChange = (theme: string) => {
  analytics.trackAction('theme_change', 'ui', theme)
}

export const trackLanguageChange = (language: string) => {
  analytics.trackAction('language_change', 'i18n', language)
}

export const trackButtonClick = (buttonId: string, _location?: string) => {
  analytics.trackAction('button_click', 'interaction', buttonId)
}

export const trackFormSubmit = (formName: string, success: boolean) => {
  analytics.trackAction('form_submit', 'form', formName, success ? 1 : 0)
}

export const trackError = (errorType: string, _errorMessage: string) => {
  analytics.trackAction('error', 'error', errorType)
}

// Usage examples:
// analytics.init()
// analytics.trackPageView('/home', 'Home Page')
// analytics.trackAction('click', 'button', 'signup')
// analytics.identifyUser('user123', { plan: 'premium' })
// trackThemeChange('dark')
// trackLanguageChange('es')
// trackButtonClick('header-login', 'navigation')
