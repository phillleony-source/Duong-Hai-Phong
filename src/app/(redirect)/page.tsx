import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { isLocale } from '@/lib/i18n'

export default async function Home() {
  const selected = (await cookies()).get('portfolio-locale')?.value
  redirect(selected && isLocale(selected) ? `/${selected}` : '/en')
}
