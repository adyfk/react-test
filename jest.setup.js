import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
    resolvedTheme: 'light',
  }),
  ThemeProvider: ({ children }) => children,
}))

// Mock next-intl with actual translations
const messages = {
  common: {
    theme: {
      toggle: 'Toggle theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
    },
    language: {
      switch: 'Switch language',
      english: 'English',
      spanish: 'Spanish',
      french: 'French',
      german: 'German',
    },
  },
  navigation: {
    home: 'Home',
    about: 'About',
    contact: 'Contact',
    settings: 'Settings',
  },
  home: {
    title: 'Welcome to React Test',
    subtitle: 'A modern React application with Next.js, TypeScript, and Tailwind CSS',
    description: 'This is a professional React setup with testing, internationalization, and modern development practices.',
    features: {
      title: 'Features',
      testing: 'Comprehensive Testing',
      i18n: 'Multi-language Support',
      theme: 'Dark/Light Theme',
      typescript: 'TypeScript Support',
      tailwind: 'Tailwind CSS',
      components: 'UI Components',
    },
  },
  errors: {
    generic: 'Something went wrong',
    notFound: 'Page not found',
    loading: 'Loading...',
    retry: 'Try again',
  },
}

// Helper function to get nested value from object
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

jest.mock('next-intl', () => ({
  useTranslations: (namespace) => (key) => {
    if (namespace) {
      const namespacedMessages = messages[namespace]
      if (namespacedMessages) {
        return getNestedValue(namespacedMessages, key) || key
      }
    }
    return getNestedValue(messages, key) || key
  },
  useLocale: () => 'en',
  NextIntlClientProvider: ({ children }) => children,
}))

// Mock custom i18n hooks
jest.mock('@/i18n/hooks', () => ({
  useTranslations: (namespace) => (key) => {
    if (namespace) {
      const namespacedMessages = messages[namespace]
      if (namespacedMessages) {
        return getNestedValue(namespacedMessages, key) || key
      }
    }
    return getNestedValue(messages, key) || key
  },
  useCommonTranslations: () => (key) => {
    return getNestedValue(messages.common, key) || key
  },
  useNavigationTranslations: () => (key) => {
    return getNestedValue(messages.navigation, key) || key
  },
  useHomeTranslations: () => (key) => {
    return getNestedValue(messages.home, key) || key
  },
  useErrorTranslations: () => (key) => {
    return getNestedValue(messages.errors, key) || key
  },
  useGlobalTranslations: () => (key) => {
    return getNestedValue(messages, key) || key
  },
}))

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
