import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteFrame } from '@/components/site'
import { demoMode, getWebsite } from '@/lib/content'
import { isLocale, labels } from '@/lib/i18n'
import { getAllPolicies, getPolicy } from '@/lib/policies'
import { metadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type PolicyProps = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: PolicyProps) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const policy = getPolicy(locale, slug)
  if (!policy) notFound()
  const data = await getWebsite(locale)
  return metadata(
    locale,
    `/policies/${policy.slug}`,
    undefined,
    `${policy.title}${data.site.name ? ' | ' + data.site.name : ''}`,
    policy.summary,
    demoMode() || !!data.site.isDemo,
  )
}

export default async function PolicyPage({ params }: PolicyProps) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const policy = getPolicy(locale, slug)
  if (!policy) notFound()

  const data = await getWebsite(locale)
  const allPolicies = getAllPolicies(locale)
  const t = labels[locale]
  const isVi = locale === 'vi'

  return (
    <SiteFrame
      locale={locale}
      data={data}
      alternate={`/${locale === 'en' ? 'vi' : 'en'}/policies/${policy.slug}`}
    >
      <article className="shell policy-page">
        <header className="detail-heading">
          <nav className="breadcrumb" aria-label={isVi ? 'Đường dẫn' : 'Breadcrumb'}>
            <Link href={`/${locale}`}>{t.home}</Link>
            <span>/</span>
            <Link href={`/${locale}#policies`}>{isVi ? 'Chính sách' : 'Policies'}</Link>
            <span>/</span>
            <span>{policy.title}</span>
          </nav>
          <p className="eyebrow">{policy.eyebrow}</p>
          <h1>{policy.title}</h1>
          <p>{policy.summary}</p>
          <p className="policy-updated">{policy.updatedAt}</p>
        </header>

        <nav className="policy-tabs" aria-label={isVi ? 'Danh sách chính sách' : 'Policy list'}>
          {allPolicies.map(item => (
            <Link
              key={item.slug}
              href={`/${locale}/policies/${item.slug}`}
              className={`policy-tab${item.slug === policy.slug ? ' is-active' : ''}`}
              aria-current={item.slug === policy.slug ? 'page' : undefined}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="policy-card">
          {policy.sections.map(section => (
            <section key={section.heading} className="policy-section">
              <h2>{section.heading}</h2>
              {section.paragraphs.map((text, idx) => (
                <p key={idx}>{text}</p>
              ))}
              {!!section.bullets?.length && (
                <ul>
                  {section.bullets.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="policy-actions">
          <Link href={`/${locale}#contact`} className="button button-dark">
            {isVi ? 'Liên hệ tư vấn' : 'Contact Us'}
          </Link>
          <Link href={`/${locale}`} className="button button-outline">
            {isVi ? 'Về trang chủ' : 'Back to Home'}
          </Link>
        </div>
      </article>
    </SiteFrame>
  )
}
