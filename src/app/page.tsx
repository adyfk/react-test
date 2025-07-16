import GitHubExplorer from '@/features/github/components/github-explorer'
import { clientEnv } from '@/core/config/client.config'
import type { Metadata } from 'next'

// Page-specific metadata
export const metadata: Metadata = {
  title: 'GitHub Explorer - Discover GitHub Users and Repositories',
  description: 'Search and explore GitHub users, their repositories, and contributions. Get insights into developer profiles, popular repositories, and coding statistics.',
  openGraph: {
    title: 'GitHub Explorer - Discover GitHub Users and Repositories',
    description: 'Search and explore GitHub users, their repositories, and contributions. Get insights into developer profiles, popular repositories, and coding statistics.',
    url: '/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitHub Explorer - Discover GitHub Users and Repositories',
    description: 'Search and explore GitHub users, their repositories, and contributions. Get insights into developer profiles, popular repositories, and coding statistics.',
  },
}

// Structured data for SEO
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'GitHub Explorer',
  description: 'Discover GitHub users and explore their repositories with advanced search features, real-time data, and comprehensive user insights.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  url: clientEnv.NEXT_PUBLIC_SITE_URL,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Search GitHub users',
    'Explore user repositories',
    'View repository statistics',
    'Real-time data updates',
    'Responsive design',
    'Dark/Light theme support',
  ],
  author: {
    '@type': 'Organization',
    name: 'GitHub Explorer Team',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '1250',
  },
}

// This is the root page of the application
export default async function RootPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <div className="space-y-6">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            GitHub Explorer
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Discover GitHub users and explore their repositories
          </p>
        </header>
        <main>
          <GitHubExplorer />
        </main>
      </div>
    </>
  )
}
