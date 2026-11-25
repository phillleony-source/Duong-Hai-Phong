/* eslint-disable @next/next/no-img-element -- Payload supplies optimized responsive image variants. */
import type { CSSProperties, ReactNode } from 'react'
import Link from 'next/link'
import { labels, type Locale } from '@/lib/i18n'
import { categoryName, demoMode, videoUrl, type CTA, type PortfolioEntry, type Social, type Website } from '@/lib/content'
import { safeHref } from '@/lib/urls'
import { Carousel, ContactForm, Header, HeroMedia, ProcessSection, Reveal, SocialDock } from './interactive'
import { Photo, sources } from './media'
import { RichCopy } from './editorial'

function navItems(locale: Locale, data: Website) {
  const t = labels[locale]
  return [
    { id: 'home', label: t.home, visible: true },
    { id: 'about', label: t.about, visible: data.about.visible && data.about.heading },
    { id: 'services', label: t.services, visible: !!data.services.length },
    { id: 'process', label: locale === 'vi' ? 'Quy trình' : 'Process', visible: !!(data.process?.visible && data.process?.heading) },
    { id: 'work', label: t.work, visible: !!data.site.workHeading },
    { id: 'contact', label: t.contact, visible: data.contact.visible && data.contact.heading },
  ].filter(item => item.visible)
}

export function Action({ cta, className = 'button' }: { cta?: CTA; className?: string }) {
  const href = safeHref(cta?.href)
  return href && cta?.label ? <Link href={href} className={className}>{cta.label}</Link> : null
}

const icons: Record<string, ReactNode> = {
  email: <><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 6 9 7 9-7"/></>,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></>,
  phone: <path d="M7 3H4a1 1 0 0 0-1 1c0 9 7 16 16 16a1 1 0 0 0 1-1v-3l-5-2-2 2a13 13 0 0 1-5-5l2-2-3-6Z"/>,
  whatsapp: <><path d="M5 19l1-4a8 8 0 1 1 3 3Z"/><path d="M9 8c0 4 3 7 7 7l1-2-3-1-1 1-2-2 1-1-1-3Z"/></>,
  facebook: <path d="M14 21v-9h3l1-4h-4V6c0-1 1-2 3-1V2h-3c-3 0-5 2-5 5v1H6v4h3v9"/>,
  tiktok: <path d="M14 3h3a5 5 0 0 0 4 4v3a8 8 0 0 1-4-1.4V16a5 5 0 1 1-5-5v3a2 2 0 1 0 2 2Z"/>,
  behance: <><path d="M3 6h5a3 3 0 0 1 0 6H3m0-6v12h6a3 3 0 0 0 0-6H3m11 3h7a3.5 3.5 0 1 0-7 0c0 3 4 4 6 2m-5-9h5"/></>,
  zalo: <path d="M4 5h16v13H9l-5 3V5Zm5 4h6l-6 5h6"/>,
  threads: <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10 3.25 0 6.14-1.55 7.97-3.95l-1.58-1.2A7.95 7.95 0 0 1 12 20c-4.411 0-8-3.589-8-8s3.589-8 8-8c4.32 0 7.85 3.43 7.99 7.72h-1.99c-.14-3.21-2.73-5.72-5.99-5.72-3.309 0-6 2.691-6 6s2.691 6 6 6c1.69 0 3.22-.71 4.31-1.85l1.42 1.41C16.37 18.79 14.3 19.6 12 19.6" />,
  flickr: <><circle cx="7" cy="12" r="4"/><circle cx="17" cy="12" r="4"/></>,
  external: <path d="M13 4h7v7m0-7-9 9m7 0v7H4V6h7"/>,
}
function publicDestination(value?: string | null) {
  const href = safeHref(value, false)
  return href?.toLowerCase() === 'mailto:studio@example.com' ? undefined : href
}

export function SocialLinks({ links }: { links: Social[] }) {
  return <ul className="social-text">{links.map(link => {
    const href = publicDestination(link.href)
    return href && <li key={link.id}><a href={href} title={link.tooltip || link.label}>{link.label}</a></li>
  })}</ul>
}

const dockPlatforms = [
  { platform: 'facebook', label: 'Facebook' },
  { platform: 'instagram', label: 'Instagram' },
  { platform: 'tiktok', label: 'TikTok' },
  { platform: 'zalo', label: 'Zalo' },
] as const

export function SiteDock({ locale, data }: { locale: Locale; data: Website }) {
  const links = data.social.filter(link => publicDestination(link.href))
  const pending = locale === 'vi' ? 'Chưa có liên kết' : 'Link not configured'
  const items = [
    ...dockPlatforms.map(option => links.find(link => link.platform === option.platform) ?? {
      id: option.platform, platform: option.platform, label: option.label, href: '', icon: undefined, tooltip: undefined,
    }),
    ...links.filter(link => !dockPlatforms.some(option => option.platform === link.platform)),
  ]
  return <SocialDock locale={locale}>
    <ul className="social-icons">{items.map(link => {
      const href = publicDestination(link.href)
      const icon = link.icon || link.platform
      const tooltip = href ? link.tooltip || link.label : `${link.label} · ${pending}`
      const content = <>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{Object.hasOwn(icons, icon) ? icons[icon] : icons.external}</svg>
        <span className="social-tooltip" aria-hidden="true">{tooltip}</span>
      </>
      return <li key={link.id}>{href
        ? <a className="social-item" href={href} aria-label={link.label}>{content}</a>
        : <button className="social-item" type="button" aria-disabled="true" aria-label={tooltip}>{content}</button>}
      </li>
    })}</ul>
  </SocialDock>
}

export function SiteFrame({ locale, data, children, overlay, alternate }: { locale: Locale; data: Website; children: ReactNode; overlay?: boolean; alternate?: string }) {
  const t = labels[locale]
  const items = navItems(locale, data)
  const logo = sources(data.site.logo)
  const name = data.site.name || 'Dương Hải Phong'
  const copyright = data.site.copyright || 'DHP Photos'
  const establishedYear = data.site.establishedYear || '2016'
  const hasAnnouncement = !!(data.announcement?.visible && data.announcement?.text)
  const isVi = locale === 'vi'

  const policyItems = isVi ? [
    { label: 'Chính sách bảo mật', href: `/${locale}/policies/security-policy` },
    { label: 'Chính sách quyền riêng tư', href: `/${locale}/policies/privacy-policy` },
    { label: 'Điều khoản dịch vụ', href: `/${locale}/policies/terms-of-service` },
    { label: 'Chính sách cookie', href: `/${locale}/policies/cookie-policy` },
    { label: 'Cấp phép hình ảnh', href: `/${locale}/policies/image-licensing` },
  ] : [
    { label: 'Data Protection', href: `/${locale}/policies/security-policy` },
    { label: 'Privacy Policy', href: `/${locale}/policies/privacy-policy` },
    { label: 'Terms of Service', href: `/${locale}/policies/terms-of-service` },
    { label: 'Cookie Policy', href: `/${locale}/policies/cookie-policy` },
    { label: 'Image Licensing', href: `/${locale}/policies/image-licensing` },
  ]

  const footerPlatforms = ['facebook', 'instagram', 'threads', 'tiktok', 'flickr', 'zalo'] as const

  return <>
    <a href="#main" className="skip-link">{t.skip}</a>
    <Header locale={locale} overlay={overlay} alternate={alternate} items={items} announcement={data.announcement} logo={logo
      ? <img src={logo.src} alt={logo.alt || name} />
      : <><span>{data.site.shortName || name}</span>{data.site.descriptor && <small>{data.site.descriptor}</small>}</>} />
    <main id="main" className={overlay ? undefined : hasAnnouncement ? 'main-offset main-offset-announcement' : 'main-offset'}>{children}</main>
    <footer className="footer-wrap">
      <div className="shell">
        <div className="footer-panel" id="policies">
          {/* Tier 1: Social channels */}
          <div className="footer-tier footer-tier-social">
            {footerPlatforms.map(platform => {
              const item = data.social.find(s => s.platform === platform)
              const href = publicDestination(item?.href) || `https://${platform === 'zalo' ? 'zalo.me' : platform + '.com'}`
              const label = item?.label || (platform === 'threads' ? 'Threads' : platform === 'flickr' ? 'Flickr' : platform === 'zalo' ? 'Zalo' : platform.charAt(0).toUpperCase() + platform.slice(1))
              return (
                <a key={platform} href={href} target="_blank" rel="noopener noreferrer" className="footer-social-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {icons[platform] || icons.external}
                  </svg>
                  <span>{label}</span>
                </a>
              )
            })}
          </div>

          {/* Tier 2: Policies */}
          <nav className="footer-tier footer-tier-policies" aria-label="Policies">
            {policyItems.map(p => (
              <Link key={p.href} href={p.href} className="footer-policy-link">
                {p.label}
              </Link>
            ))}
          </nav>

          {/* Tier 3: Bottom info & Scroll to Top */}
          <div className="footer-tier footer-tier-bottom">
            <div className="footer-bottom-info">
              <p className="footer-copyright">{`Copyright © ${new Date().getUTCFullYear()} | ${copyright}. All rights reserved.`}</p>
              <p className="footer-ownership">{isVi ? `Website & nội dung trên Website thuộc quyền sở hữu của ${name}.` : `Website & content are property of ${name}.`}</p>
              <p className="footer-year">{isVi ? `Được xây dựng & phát triển từ năm ${establishedYear}` : `Built & developed since ${establishedYear}`}</p>
            </div>
            <a href="#main" className="footer-scroll-top" aria-label={t.top} title={t.top}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </>
}

export const showHero = (data: Website) => !!(data.hero.visible && data.hero.headline)

export function Landing({ locale, data, projects }: { locale: Locale; data: Website; projects: PortfolioEntry[] }) {
  const { hero, about, site, contact } = data
  const t = labels[locale]
  const firstSection = about.visible && about.heading ? 'about' : data.services.length ? 'services' : 'work'
  const aboutVideo = videoUrl(about.video)
  return <SiteFrame locale={locale} data={data} overlay={showHero(data)}>
    {showHero(data) ? <section id="home" className={`hero ${hero.alignment === 'center' ? 'hero-centered' : ''}`}
      style={{ '--hero-opacity': (hero.overlay ?? 45) / 100 } as CSSProperties}>
      <HeroMedia locale={locale} desktop={sources(hero.desktopImage) ?? sources(hero.poster)} mobile={sources(hero.mobileImage)}
        fallback={sources(hero.fallback) ?? sources(hero.poster)} poster={sources(hero.poster)?.src}
        desktopVideo={hero.mediaType === 'video' ? videoUrl(hero.desktopVideo) : undefined}
        mobileVideo={hero.mediaType === 'video' ? videoUrl(hero.mobileVideo) : undefined}
        loop={hero.loop ?? true} sound={!!hero.sound} />
      <div className="shell hero-layout"><div className="hero-copy">
        {hero.eyebrow && <p className="eyebrow hero-eyebrow">{hero.eyebrow}</p>}
        <h1>{hero.headline}{hero.accent && <> <em>{hero.accent}</em></>}</h1>
        {hero.description && <p className="hero-description">{hero.description}</p>}
        <div className="actions"><Action cta={hero.primary} className="button button-light" /><Action cta={hero.secondary} className="button button-ghost" /></div>
      </div></div>
      <div className="shell hero-bottom">
        {firstSection && <a href={`#${firstSection}`}><span aria-hidden="true">↓</span>{t.scroll}</a>}
        {(demoMode() || site.isDemo) && <p>{t.demo}</p>}
      </div>
    </section> : <section id="home" className="shell empty-intro"><h1>{site.name || t.home}</h1></section>}

    {about.visible && about.heading && <section id="about" className="shell section-pad about-section">
      {sources(about.portrait) && <Photo media={about.portrait} className="about-photo" sizes="(max-width: 760px) 95vw, 42vw" />}
      <div className="about-copy"><Reveal>
        {about.subtitle && <p className="eyebrow">{about.subtitle}</p>}
        <h2>{about.heading}</h2>
        {about.featuredStatement && <p className="about-statement">{about.featuredStatement}</p>}
        <div className="about-body">
          {about.editorialBody?.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          <RichCopy state={about.biography} />
        </div>
        {about.closingStatement && <p className="about-closing">{about.closingStatement}</p>}
        <Action cta={about.cta} className="text-link" />
        {!!about.links?.length && <ul className="social-text">{about.links.map(link => {
          const href = safeHref(link.href, false)
          return href && link.label && <li key={link.id ?? href}><a href={href}>{link.label}</a></li>
        })}</ul>}
      </Reveal></div>
      {(!!about.images?.length || aboutVideo) && <div className="about-extras">
        {about.images?.map((item, index) => <Photo media={item} key={index} />)}
        {aboutVideo && <video controls playsInline preload="none" src={aboutVideo} />}
      </div>}
    </section>}

    {!!data.services.length && <section id="services" className="services-section"><div className="shell section-pad">
      <div className="section-title"><h2>{site.servicesHeading || t.services}</h2>{site.servicesDescription && <p>{site.servicesDescription}</p>}</div>
      <Carousel locale={locale} count={data.services.length} autoPlay>{data.services.map(item => <div className="carousel-slide" key={item.id}>
        <PortfolioCard item={item} locale={locale} kind="services" />
      </div>)}</Carousel>
    </div></section>}

    {data.process?.visible && !!data.process.steps?.length && <ProcessSection process={data.process} locale={locale} />}

    <section id="work" className="work-section"><div className="shell section-pad">
      <div className="section-title work-title">
        <div>{site.workEyebrow && <p className="eyebrow">{site.workEyebrow}</p>}<h2>{site.workHeading || t.work}</h2></div>
        {site.workDescription && <p>{site.workDescription}</p>}
      </div>
      {projects.length ? <div className="project-carousel">
        <Carousel locale={locale} count={projects.length} label={t.work} controlsFirst>
          {projects.map(item => <div className="carousel-slide" key={item.id}>
            <PortfolioCard item={item} locale={locale} kind="case-studies" />
          </div>)}
        </Carousel>
      </div> : <p className="project-empty">{t.noProjects}</p>}
      {!!projects.length && <div className="work-actions"><Link className="button button-outline" href={`/${locale}/case-studies`}>{site.workAction}</Link></div>}
    </div></section>

    <section className="slogan-section" aria-label={locale === 'vi' ? 'Tuyên ngôn nhiếp ảnh' : 'Photography Philosophy'}>
      <div className="shell slogan-inner">
        <span className="slogan-mark" aria-hidden="true">✦</span>
        <blockquote className="slogan-quote">
          {site.sloganQuote || (locale === 'vi'
            ? '“Một bức ảnh không chỉ là khoảnh khắc được giữ lại, mà còn là câu chuyện tiếp tục sống mãi cùng cảm xúc.”'
            : '“A photograph is not merely a moment kept still, but a story that lives on through emotion.”')}
        </blockquote>
        <p className="slogan-author">{site.sloganAuthor || `DHP — ${locale === 'vi' ? 'Nghệ thuật của một góc nhìn khác' : 'The Art of Another Perspective'}`}</p>
      </div>
    </section>

    {contact.visible && contact.heading && <section id="contact" className="contact-section">
      <div className="shell section-pad">
        <div className="contact-panel">
          {/* Left Column: Basic Contact Info */}
          <div className="contact-info-col">
            <span className="contact-badge-pill">{contact.eyebrow || (locale === 'vi' ? 'Thông tin liên hệ' : 'Contact Information')}</span>
            <h2 className="contact-main-heading">{contact.heading || (locale === 'vi' ? 'Thông tin liên hệ cơ bản' : 'Basic Contact Information')}</h2>
            {contact.description && <p className="contact-lead-desc">{contact.description}</p>}

            {/* 3 Quick Social Buttons: Facebook, Instagram, TikTok */}
            <div className="contact-quick-socials">
              {(['facebook', 'instagram', 'tiktok'] as const).map(platform => {
                const item = data.social.find(s => s.platform === platform)
                const href = publicDestination(item?.href) || `https://${platform}.com`
                const label = item?.label || platform.charAt(0).toUpperCase() + platform.slice(1)
                return (
                  <a key={platform} href={href} target="_blank" rel="noopener noreferrer" className="contact-quick-btn">
                    <span className="contact-quick-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        {icons[platform] || icons.external}
                      </svg>
                    </span>
                    <span className="contact-quick-label">{label}</span>
                  </a>
                )
              })}
            </div>

            {/* Google Maps Studio Card */}
            <div className="contact-maps-card">
              <div className="maps-card-head">
                <div className="maps-head-info">
                  <h4 className="maps-head-title">Google Maps</h4>
                  <p className="maps-head-sub">{locale === 'vi' ? 'Xem nhanh vị trí studio theo tên doanh nghiệp đã đăng trên Google Maps.' : 'Quickly view the studio location on Google Maps.'}</p>
                </div>
                <a href={contact.googleMapsUrl || 'https://maps.google.com'} target="_blank" rel="noopener noreferrer" className="maps-btn-open">
                  {locale === 'vi' ? 'Mở bản đồ' : 'Open Map'}
                </a>
              </div>
              <div className="maps-card-canvas">
                <div className="maps-pin-circle">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
                  </svg>
                </div>
                <h5 className="maps-canvas-title">{contact.studioAddress || (locale === 'vi' ? 'Địa chỉ được thể hiện qua Google Maps' : 'Studio address shown on Google Maps')}</h5>
                <p className="maps-canvas-hint">{locale === 'vi' ? 'Bạn vẫn có thể xem Google Maps khi nhấn nút phía dưới' : 'You can view Google Maps by clicking the button below'}</p>
                <a href={contact.googleMapsUrl || 'https://maps.google.com'} target="_blank" rel="noopener noreferrer" className="maps-btn-view">
                  {locale === 'vi' ? 'Xem bản đồ tại đây' : 'View map here'}
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Card */}
          {contact.formVisible && (
            <div className="contact-form-col">
              <div className="contact-form-card" id="consultation-form">
                <h3 className="contact-form-card-title">{locale === 'vi' ? 'Đăng ký tư vấn' : 'Consultation Request'}</h3>
                <ContactForm
                  locale={locale}
                  submitLabel={contact.submitLabel || (locale === 'vi' ? 'Tư vấn ngay' : 'Consult Now')}
                  preview={demoMode()}
                  services={data.services.map(({ id, title }) => ({ id, title }))}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>}
  </SiteFrame>
}

export function ProjectGrid({ entries, locale, columns = 2 }: { entries: PortfolioEntry[]; locale: Locale; columns?: 2 | 3 }) {
  if (!entries.length) return <p className="project-empty">{labels[locale].noProjects}</p>
  const fullIndex = columns === 3 || entries.length % 2 === 0 ? -1
    : entries.length === 3 ? 2 : Math.floor(entries.length / 4) * 2
  const cardSizes = columns === 3 ? '(max-width: 760px) 90vw, (max-width: 1020px) 45vw, 30vw' : undefined
  return <div className={`work-grid${columns === 3 ? ' work-grid-3' : ''}`}>{entries.map((item, index) => <PortfolioCard key={item.id} item={item}
    locale={locale} kind="case-studies" wide={index === fullIndex} sizes={cardSizes} />)}</div>
}

export function PortfolioCard({ item, locale, kind, wide, sizes }: { item: PortfolioEntry; locale: Locale; kind: 'services' | 'case-studies'; wide?: boolean; sizes?: string }) {
  const t = labels[locale]
  const year = item.projectDate && new Date(item.projectDate).getUTCFullYear()
  const category = categoryName(item.category)
  return <article className={`portfolio-card ${kind === 'services' ? 'service-card' : 'work-card'}${wide ? ' work-card-wide' : ''}`}>
    <Link href={`/${locale}/${kind}/${item.slug}`} className="card-link">
      <Photo media={item.cover} sizes={sizes ?? (wide ? '(max-width: 760px) 95vw, 88vw' : '(max-width: 760px) 90vw, 45vw')} />
      <div className="card-copy">
        {(category || year) && <p className="eyebrow">{[category, year].filter(Boolean).join(' / ')}</p>}
        <h3>{item.title}</h3>
        {kind === 'services' && item.summary && <p>{item.summary}</p>}
        <span className="text-link">{kind === 'services' ? t.details : t.project}</span>
      </div>
    </Link>
  </article>
}
