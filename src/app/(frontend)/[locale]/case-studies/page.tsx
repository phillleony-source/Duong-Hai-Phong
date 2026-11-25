import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProjectGrid, SiteFrame } from '@/components/site'
import { demoMode, getProjectPage, getWebsite } from '@/lib/content'
import { isLocale, labels, type Locale } from '@/lib/i18n'
import { metadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ page?: string | string[] }> }

async function route({ params, searchParams }: Props) {
  const [{ locale }, { page }] = await Promise.all([params, searchParams])
  if (!isLocale(locale)) notFound()
  if (page !== undefined && (typeof page !== 'string' || !/^[1-9]\d{0,8}$/.test(page))) notFound()
  const pageNumber = page === undefined ? 1 : Number(page)
  const { docs, totalPages } = await getProjectPage(locale, pageNumber)
  if (pageNumber > Math.max(1, totalPages)) notFound()
  return { locale, page: pageNumber, docs, totalPages }
}

function catalogPath(page: number) {
  return '/case-studies' + (page > 1 ? `?page=${page}` : '')
}

export async function generateMetadata(props: Props) {
  const { locale, page } = await route(props)
  const { site } = await getWebsite(locale)
  return metadata(locale, catalogPath(page), null, site.workHeading || labels[locale].projectIndex,
    site.workDescription, demoMode() || !!site.isDemo)
}

export default async function Projects(props: Props) {
  const { locale, page, docs, totalPages } = await route(props)
  const data = await getWebsite(locale)
  const t = labels[locale]
  return <SiteFrame locale={locale} data={data} alternate={`/${locale === 'en' ? 'vi' : 'en'}${catalogPath(page)}`}>
    <section className="shell section-pad project-index">
      <header className="detail-heading">
        <nav className="breadcrumb" aria-label={t.explore}><Link href={`/${locale}`}>{t.home}</Link><span aria-hidden="true">/</span><span>{t.projectIndex}</span></nav>
        {data.site.workEyebrow && <p className="eyebrow">{data.site.workEyebrow}</p>}
        <h1>{data.site.workHeading || t.projectIndex}</h1>
        {data.site.workDescription && <p>{data.site.workDescription}</p>}
      </header>
      <ProjectGrid entries={docs} locale={locale} columns={3} />
      {totalPages > 1 && <CatalogPagination locale={locale} page={page} totalPages={totalPages} />}
    </section>
  </SiteFrame>
}

function pageNumbers(current: number, total: number): Array<number | 'ellipsis'> {
  if (total <= 7) return Array.from({ length: total }, (_, idx) => idx + 1)
  const pages: Array<number | 'ellipsis'> = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) pages.push('ellipsis')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push('ellipsis')
  pages.push(total)
  return pages
}

function CatalogPagination({ locale, page, totalPages }: { locale: Locale; page: number; totalPages: number }) {
  const t = labels[locale]
  const href = (index: number) => `/${locale}${catalogPath(index)}`
  const numbers = pageNumbers(page, totalPages)
  return <nav className="catalog-pagination" aria-label={t.projectPages}>
    <div>{page > 1 && <Link className="button button-outline" rel="prev" href={href(page - 1)}>{t.previous}</Link>}</div>
    <div className="catalog-pages">
      {numbers.map((item, idx) => item === 'ellipsis'
        ? <span key={`ellipsis-${idx}`} className="catalog-ellipsis" aria-hidden="true">…</span>
        : <Link
            key={item}
            href={href(item)}
            className={`catalog-page-btn${item === page ? ' is-active' : ''}`}
            aria-current={item === page ? 'page' : undefined}
            aria-label={`${t.page} ${item}`}
          >
            {item}
          </Link>)}
    </div>
    <div>{page < totalPages && <Link className="button button-outline" rel="next" href={href(page + 1)}>{t.next}</Link>}</div>
  </nav>
}
