'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { isLocale, labels } from '@/lib/i18n'

export default function NotFound() {
  const { locale } = useParams<{ locale: string }>()
  const language = isLocale(locale) ? locale : 'en'
  return <main className="shell section-pad empty-intro">
    <p className="eyebrow">404</p>
    <h1>{labels[language].missing}</h1>
    <div className="actions"><Link href={`/${language}`} className="button">{labels[language].return}</Link></div>
  </main>
}
