// Analytics utilities for tracking user behavior
export const analytics = {
  // Initialize analytics (called once in app initialization)
  init: () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics initialized (development mode)')
    }
  },

  // Track page views
  trackPageView: (path: string, title?: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics: Page view', { path, title })
    }
  },

  // Track user actions
  trackAction: (action: string, category?: string, label?: string, value?: number) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics: Action', { action, category, label, value })
    }
  },

  // Track user properties
  identifyUser: (userId: string, properties?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics: User identified', { userId, properties })
    }
  },

  // Track conversions
  trackConversion: (eventName: string, value?: number, currency?: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics: Conversion', { eventName, value, currency })
    }
  },

  // Track feature usage
  trackFeature: (featureName: string, properties?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics: Feature used', { featureName, properties })
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
