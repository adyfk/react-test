import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

// This is the root layout that will be applied to all routes
export default async function RootLayout({
  children,
  params,
}: Props) {
  const { locale } = await params
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  return children
}
