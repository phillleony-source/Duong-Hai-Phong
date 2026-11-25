import type { MetadataRoute } from 'next'
import { demoMode, getProjectSlugs, getWebsite } from '@/lib/content'
import { locales } from '@/lib/i18n'
import { siteUrl } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (demoMode()) return []
  const data = await getWebsite('en')
  if (data.site.isDemo) return []
  const projects = await getProjectSlugs('en')
  const base = siteUrl()
  const paths = ['', '/case-studies', ...data.services.map(item => '/services/' + item.slug), ...projects.map(slug => '/case-studies/' + slug)]
  return paths.flatMap(path => locales.map(locale => ({
    url: new URL('/' + locale + path, base).href,
    alternates: { languages: Object.fromEntries(locales.map(code => [code, new URL('/' + code + path, base).href])) },
  })))
}
