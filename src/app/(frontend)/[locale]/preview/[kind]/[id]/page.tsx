import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { Detail } from '@/components/detail'
import { cms, demoMode, getWebsite } from '@/lib/content'
import { isLocale } from '@/lib/i18n'

export const dynamic = 'force-dynamic'
export const metadata = { robots: { index: false, follow: false } }

export default async function Preview({ params }: { params: Promise<{ locale: string; kind: string; id: string }> }) {
  const { locale, kind, id } = await params
  if (demoMode() || !isLocale(locale) || (kind !== 'services' && kind !== 'case-studies') || !/^\d+$/.test(id)) notFound()
  const payload = await cms()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) notFound()
  const item = await payload.findByID({ collection: kind, id: Number(id), locale, draft: true, depth: 2, overrideAccess: false, user, disableErrors: true })
  if (!item) notFound()
  return <Detail locale={locale} data={await getWebsite(locale)} item={item} kind={kind} preview />
}
