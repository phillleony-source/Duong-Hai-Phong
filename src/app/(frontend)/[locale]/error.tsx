'use client'

import { useParams } from 'next/navigation'
import { isLocale, labels } from '@/lib/i18n'

export default function ErrorPage({ reset }: { reset: () => void }) {
  const { locale } = useParams<{ locale: string }>()
  const language = isLocale(locale) ? locale : 'en'
  return <main className="shell section-pad empty-intro">
    <h1>{labels[language].unavailable}</h1>
    <button className="button" onClick={reset}>{language === 'vi' ? 'Thử lại' : 'Try again'}</button>
  </main>
}
