import { notFound } from 'next/navigation'
import { Landing } from '@/components/site'
import { demoMode, getSelectedProjects, getWebsite } from '@/lib/content'
import { isLocale } from '@/lib/i18n'
import { metadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'
type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const { site } = await getWebsite(locale)
  return metadata(locale, '', site.seo, site.name || 'Portfolio', site.tagline, demoMode() || !!site.isDemo)
}

export default async function Home({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const [data, projects] = await Promise.all([getWebsite(locale), getSelectedProjects(locale)])
  return <Landing locale={locale} data={data} projects={projects} />
}
