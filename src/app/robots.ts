import type { MetadataRoute } from 'next'
import { demoMode, getWebsite } from '@/lib/content'
import { siteUrl } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export default async function robots(): Promise<MetadataRoute.Robots> {
  if (demoMode() || (await getWebsite('en')).site.isDemo) return { rules: { userAgent: '*', disallow: '/' } }
  return { rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/en/preview', '/vi/preview'] }, sitemap: new URL('/sitemap.xml', siteUrl()).href }
}
