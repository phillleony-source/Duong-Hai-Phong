import type { Metadata } from 'next'
import { imageAsset, type SEO } from './content'
import type { Locale } from './i18n'

export const siteUrl = () => new URL(process.env.SITE_URL || 'http://localhost:3000')

export function metadata(locale: Locale, suffix: string, seo: SEO | undefined, title: string, description?: string | null, noindex = false): Metadata {
  const canonical = `/${locale}${suffix}`
  const image = imageAsset(seo?.image)
  return {
    metadataBase: siteUrl(),
    title: seo?.title || title,
    description: seo?.description || description || undefined,
    alternates: { canonical, languages: { en: `/en${suffix}`, vi: `/vi${suffix}`, 'x-default': `/en${suffix}` } },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: seo?.title || title, description: seo?.description || description || undefined,
      url: canonical, locale: locale === 'en' ? 'en_US' : 'vi_VN', alternateLocale: locale === 'en' ? 'vi_VN' : 'en_US',
      images: image?.url ? [{ url: image.url, alt: image.alt || title }] : undefined,
      type: 'website',
    },
    twitter: { card: 'summary_large_image', images: image?.url ? [image.url] : undefined },
  }
}
