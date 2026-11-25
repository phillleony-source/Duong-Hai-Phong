import '@fontsource-variable/playfair-display'
import '@fontsource-variable/playfair-display/wght-italic.css'
import '@fontsource/be-vietnam-pro/400.css'
import '@fontsource/be-vietnam-pro/500.css'
import '@fontsource/be-vietnam-pro/600.css'
import '@/styles/site.css'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { isLocale } from '@/lib/i18n'
import { getWebsite } from '@/lib/content'
import { SiteDock } from '@/components/site'

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const data = await getWebsite(locale)
  return <html lang={locale}><body>{children}<SiteDock locale={locale} data={data} /></body></html>
}
