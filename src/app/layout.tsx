import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ErrorBoundary } from '@/components/error-boundary'
import { clientEnv } from '@/core/config/client.config'
import { analytics } from '@/core/monitoring/analytics'
import { performanceMonitor } from '@/core/monitoring/monitoring'
import type { Metadata, Viewport } from 'next'

// Initialize analytics and monitoring
if (typeof window !== 'undefined') {
  analytics.init()
  performanceMonitor.trackPageLoad('root')
}

type Props = {
  children: React.ReactNode
}

// SEO Metadata configuration
export const metadata: Metadata = {
  title: {
    default: 'GitHub Explorer - Discover GitHub Users and Repositories',
    template: '%s | GitHub Explorer',
  },
  description: 'Discover GitHub users and explore their repositories with advanced search features, real-time data, and comprehensive user insights.',
  keywords: ['GitHub', 'developer', 'repositories', 'user search', 'code exploration', 'open source', 'git', 'programming'],
  authors: [{ name: 'GitHub Explorer Team' }],
  creator: 'GitHub Explorer',
  publisher: 'GitHub Explorer',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(clientEnv.NEXT_PUBLIC_SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'GitHub Explorer - Discover GitHub Users and Repositories',
    description: 'Discover GitHub users and explore their repositories with advanced search features, real-time data, and comprehensive user insights.',
    url: '/',
    siteName: 'GitHub Explorer',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'GitHub Explorer - Discover GitHub Users and Repositories',
    description: 'Discover GitHub users and explore their repositories with advanced search features, real-time data, and comprehensive user insights.',
    creator: '@githubexplorer',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

// This is the root layout that will be applied to all routes
export default async function RootLayout({
  children,
}: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="min-h-screen bg-background font-sans antialiased">
        <ErrorBoundary
          name="RootLayout"
          level="page"
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen flex flex-col">
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
              >
                Skip to main content
              </a>
              <main id="main-content" className="flex-1 container mx-auto px-4 py-6" role="main">
                <ErrorBoundary
                  name="MainContent"
                  level="page"
                >
                  {children}
                </ErrorBoundary>
              </main>
              <footer className="border-t border-border py-4 mt-auto">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                  <p>
                    Built with ❤️ for developers • Powered by{' '}
                    <a
                      href="https://github.com"
                      className="hover:text-foreground transition-colors"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      GitHub API
                    </a>
                  </p>
                </div>
              </footer>
            </div>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
