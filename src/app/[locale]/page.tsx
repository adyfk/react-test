import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Home() {
  const t = useTranslations('home')

  const features = [
    {
      key: 'testing',
      icon: '🧪',
    },
    {
      key: 'i18n',
      icon: '🌐',
    },
    {
      key: 'theme',
      icon: '🌙',
    },
    {
      key: 'typescript',
      icon: '💪',
    },
    {
      key: 'tailwind',
      icon: '🎨',
    },
    {
      key: 'components',
      icon: '🧩',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t('subtitle')}</p>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t('description')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="text-2xl">{t('features.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.key} className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <h3 className="font-semibold">{t(`features.${feature.key}`)}</h3>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Testing</CardTitle>
            <CardDescription>Comprehensive testing setup</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant="secondary">Jest</Badge>
              <Badge variant="secondary">React Testing Library</Badge>
              <Badge variant="secondary">Playwright</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Internationalization</CardTitle>
            <CardDescription>Multi-language support</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant="secondary">next-intl</Badge>
              <Badge variant="secondary">4 Languages</Badge>
              <Badge variant="secondary">Type-safe</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Modern Stack</CardTitle>
            <CardDescription>Latest technologies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant="secondary">Next.js 15</Badge>
              <Badge variant="secondary">React 19</Badge>
              <Badge variant="secondary">TypeScript</Badge>
              <Badge variant="secondary">Tailwind CSS</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
