import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Action, PortfolioCard, ProjectGrid, SiteFrame } from './site'
import { Editorial } from './editorial'
import { Photo } from './media'
import { categoryName, demoMode, getEntry, getProjectNavigation, getWebsite, videoUrl, type PortfolioEntry, type Website } from '@/lib/content'
import { isLocale, labels, type Locale } from '@/lib/i18n'
import { metadata } from '@/lib/seo'

type Kind = 'services' | 'case-studies'
type DetailProps = { params: Promise<{ locale: string; slug: string }> }

export function detailRoute(kind: Kind) {
  async function load(params: DetailProps['params']) {
    const { locale, slug } = await params
    if (!isLocale(locale)) notFound()
    const [data, item] = await Promise.all([getWebsite(locale), getEntry(locale, kind, slug)])
    if (!item) notFound()
    return { locale, data, item }
  }
  return {
    async generateMetadata({ params }: DetailProps) {
      const { locale, data, item } = await load(params)
      return metadata(locale, `/${kind}/${item.slug}`, { ...item.seo, image: item.seo?.image || item.cover },
        item.title + (data.site.name ? ' | ' + data.site.name : ''), item.summary, demoMode() || !!data.site.isDemo)
    },
    async Page({ params }: DetailProps) {
      return <Detail {...await load(params)} kind={kind} />
    },
  }
}

export async function Detail({ locale, data, item, kind, preview }: { locale: Locale; data: Website; item: PortfolioEntry; kind: Kind; preview?: boolean }) {
  const service = kind === 'services'
  const t = labels[locale]
  const entries = service ? data.services : await getProjectNavigation(locale)
  const position = entries.findIndex(entry => entry.id === item.id)
  const previous = !service && position > 0 ? entries[position - 1] : undefined
  const next = !service && position >= 0 ? entries[position + 1] : undefined
  const ids = new Set(item.related?.map(relation => typeof relation === 'number' ? relation : relation.id))
  const category = categoryName(item.category)
  const candidates = entries.filter(entry => entry.id !== item.id)
  const matches = ids.size ? candidates.filter(entry => ids.has(entry.id)) : candidates.filter(entry => category && categoryName(entry.category) === category)
  const related = (matches.length || service ? matches : candidates).slice(0, 3)
  const href = (slug: string) => `/${locale}/${kind}/${slug}`
  const date = item.projectDate || item.publishedAt
  const video = videoUrl(item.coverVideo)
  const contactCTA = item.cta?.href && item.cta.label ? {
    label: item.cta.label,
    href: item.cta.href.startsWith('#') ? `/${locale}${item.cta.href}` : item.cta.href,
  } : data.contact.visible && data.contact.heading ? { href: `/${locale}#contact`, label: t.contact } : undefined
  const credits = locale === 'vi'
    ? [['Khách hàng', item.client], ['Nhiếp ảnh', item.photographer], ['Người mẫu', item.model], ['Stylist', item.stylist], ['Trang điểm', item.makeup], ['Cộng tác', item.collaborators]]
    : [['Client', item.client], ['Photography', item.photographer], ['Model', item.model], ['Styling', item.stylist], ['Makeup', item.makeup], ['Collaborators', item.collaborators]]
  return <SiteFrame locale={locale} data={data} alternate={preview ? `/${locale === 'en' ? 'vi' : 'en'}/preview/${kind}/${item.id}` : `/${locale === 'en' ? 'vi' : 'en'}/${kind}/${item.slug}`}>
    {preview && <p className="preview-notice">{locale === 'vi' ? 'Bản xem trước dành cho nhân viên' : 'Staff preview'}</p>}
    <article className="shell detail-article">
      <header className="detail-heading">
        <nav className="breadcrumb" aria-label={locale === 'vi' ? 'Đường dẫn' : 'Breadcrumb'}>
          <Link href={`/${locale}`}>{t.home}</Link><span aria-hidden="true">/</span>
          <Link href={service ? `/${locale}#services` : `/${locale}/case-studies`}>{service ? t.services : t.work}</Link>
        </nav>
        {(category || date) && <p className="eyebrow">{[category, date && new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(date))].filter(Boolean).join(' / ')}</p>}
        <h1>{item.title}</h1>
        {item.summary && <p>{item.summary}</p>}
      </header>
      {video ? <video className="detail-cover" controls playsInline preload="metadata" src={video} poster={typeof item.cover === 'object' ? item.cover?.url ?? undefined : undefined} />
        : <Photo media={item.cover} className="detail-cover" sizes="(max-width: 700px) 100vw, 85vw" />}
      {credits.some(([, value]) => value) && <dl className="credits">{credits.map(([label, value]) => value && <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
      <Editorial blocks={service ? [{ blockType: 'richText', body: item.body }, ...(item.gallery?.length ? [{ blockType: 'imageGallery' as const, images: item.gallery }] : [])] : item.content ?? []} />
      <div className="detail-bottom">
        <Action cta={contactCTA} />
      </div>
      {(previous || next) && <nav className="detail-navigation" aria-label={t.work}>
        {previous && <Link href={href(previous.slug)}>{t.previous} · {previous.title}</Link>}
        {next && <Link href={href(next.slug)}>{t.next} · {next.title}</Link>}
      </nav>}
    </article>
    {!!related.length && <section className="shell section-pad">
      <div className="section-title"><h2>{service ? t.services : t.related}</h2></div>
      {service ? <div className="work-grid">{related.map(entry => <PortfolioCard key={entry.id} item={entry} kind={kind} locale={locale} />)}</div>
        : <ProjectGrid entries={related} locale={locale} />}
    </section>}
  </SiteFrame>
}
