import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './src/i18n/config'

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // The default locale is used when no locale is specified in the URL
  localePrefix: 'as-needed',
})

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(de|en|es|fr)/:path*'],
}
