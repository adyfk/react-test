import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GitHub Explorer',
    short_name: 'GitHubExplorer',
    description: 'Discover GitHub users and explore their repositories with advanced search features, real-time data, and comprehensive user insights.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
    categories: ['developer', 'productivity', 'utilities'],
    orientation: 'portrait-primary',
    lang: 'en',
    scope: '/',
  }
}
