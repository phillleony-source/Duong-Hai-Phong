'use client'

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import { motion, useReducedMotion } from 'motion/react'
import { labels, type Locale } from '@/lib/i18n'
import { contactSchema } from '@/lib/contact'
import type { Announcement, Process } from '@/lib/content'
import { safeHref } from '@/lib/urls'

export function AnnouncementMarquee({ announcement }: { announcement: Announcement; locale?: Locale }) {
  const { text, highlight, link, speed = 25 } = announcement
  if (!text) return null
  const href = safeHref(link)
  const duration = Math.max(10, Math.min(120, speed || 25))

  const itemContent = (
    <span className="announcement-item">
      {highlight && <span className="announcement-badge">{highlight}</span>}
      <span className="announcement-text">{text}</span>
      <span className="announcement-sep" aria-hidden="true">✦</span>
    </span>
  )

  const group = (
    <div className="announcement-group">
      {itemContent}
      {itemContent}
      {itemContent}
      {itemContent}
    </div>
  )

  const track = (
    <div className="announcement-track" style={{ '--marquee-speed': `${duration}s` } as CSSProperties}>
      {group}
      <div className="announcement-group" aria-hidden="true">
        {itemContent}
        {itemContent}
        {itemContent}
        {itemContent}
      </div>
    </div>
  )

  return (
    <aside className="announcement-bar" role="region" aria-label={highlight || 'Announcement'}>
      {href ? (
        <a href={href} className="announcement-link" title={text}>
          {track}
        </a>
      ) : (
        track
      )}
    </aside>
  )
}

type NavItem = { id: string; label: string }
export function Header({ locale, logo, items, overlay = false, alternate, announcement }: {
  locale: Locale; logo: ReactNode; items: NavItem[]; overlay?: boolean; alternate?: string; announcement?: Announcement | null
}) {
  const t = labels[locale]
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const trigger = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLElement>(null)
  const hasAnnouncement = !!(announcement?.visible && announcement?.text)
  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 45)
      let selected = 'home'
      for (const { id } of items) {
        const section = document.getElementById(id)
        if (section && section.getBoundingClientRect().top <= window.innerHeight * 0.39) selected = id
      }
      setActive(selected)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [items])
  useEffect(() => {
    if (!open) return
    menu.current?.querySelector('a')?.focus()
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus() }
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open])

  function remember(language: Locale) {
    document.cookie = `portfolio-locale=${language}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`
  }

  return <header className={`topbar ${hasAnnouncement ? 'topbar-has-announcement' : ''} ${overlay && !open && !scrolled ? 'topbar-overlay' : 'topbar-solid'}`}>
    {hasAnnouncement && <AnnouncementMarquee announcement={announcement} locale={locale} />}
    <div className="topbar-inner">
      <Link href={`/${locale}`} className="brand" onClick={() => setOpen(false)}>{logo}</Link>
      <nav className={`navigation ${open ? 'navigation-open' : ''}`} id="navigation" aria-label={t.menu} ref={menu}>
        {items.map(item => <Link key={item.id} href={`/${locale}#${item.id}`} onClick={() => setOpen(false)}
          aria-current={overlay && active === item.id ? 'location' : undefined}>{item.label}</Link>)}
      </nav>
      <div className="header-tools">
        <div className="languages">
          <Link lang="en" href={locale === 'en' ? '#' : alternate ?? '/en'} onClick={() => remember('en')} aria-current={locale === 'en' ? 'page' : undefined} aria-label="English">EN</Link>
          <span aria-hidden="true">/</span>
          <Link lang="vi" href={locale === 'vi' ? '#' : alternate ?? '/vi'} onClick={() => remember('vi')} aria-current={locale === 'vi' ? 'page' : undefined} aria-label="Tiếng Việt">VI</Link>
        </div>
        <button ref={trigger} className="menu-toggle" type="button" aria-expanded={open} aria-controls="navigation" aria-label={open ? t.close : t.menu} onClick={() => setOpen(!open)}>
          <span /><span />
        </button>
      </div>
    </div>
  </header>
}

type Source = { src: string; srcSet?: string; alt: string }
const HERO_SLIDES = [
  '/portfolio/hero-slide-1.webp',
  '/portfolio/hero-slide-2.webp',
  '/portfolio/hero-slide-3.webp',
]

export function HeroMedia({ desktop, mobile, fallback, desktopVideo, mobileVideo, poster, loop, sound, locale }: {
  desktop?: Source; mobile?: Source; fallback?: Source; desktopVideo?: string; mobileVideo?: string; poster?: string
  loop: boolean; sound: boolean; locale: Locale
}) {
  const [videoSource, setVideoSource] = useState<string>()
  const [failed, setFailed] = useState('')
  const [photoFailed, setPhotoFailed] = useState(false)
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const video = useRef<HTMLVideoElement>(null)
  const t = labels[locale]
  useEffect(() => {
    const narrow = matchMedia('(max-width: 700px)')
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setVideoSource(reduced.matches ? undefined : narrow.matches ? mobileVideo || desktopVideo : desktopVideo || mobileVideo)
    update()
    narrow.addEventListener('change', update)
    reduced.addEventListener('change', update)
    return () => { narrow.removeEventListener('change', update); reduced.removeEventListener('change', update) }
  }, [desktopVideo, mobileVideo])

  const hasVideo = Boolean(videoSource && failed !== videoSource)

  useEffect(() => {
    if (hasVideo || photoFailed) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    if (reduced.matches) return
    const timer = window.setInterval(() => {
      setActiveSlide(prev => (prev + 1) % HERO_SLIDES.length)
    }, 5500)
    return () => window.clearInterval(timer)
  }, [hasVideo, photoFailed])

  const defaultPhoto = photoFailed ? fallback : desktop ?? mobile ?? fallback
  return <>
    <div className="hero-media" aria-hidden="true">
      {!photoFailed
        ? HERO_SLIDES.map((src, index) => (
            // eslint-disable-next-line @next/next/no-img-element -- Pre-optimized static WebP hero slides.
            <img
              key={src}
              src={src}
              alt=""
              sizes="100vw"
              fetchPriority={index === 0 ? 'high' : 'auto'}
              className={`hero-slide${index === activeSlide ? ' is-active' : ''}`}
              onError={() => { if (index === 0) setPhotoFailed(true) }}
            />
          ))
        : defaultPhoto && <picture>
            {mobile && !photoFailed && <source media="(max-width: 700px)" srcSet={mobile.srcSet ?? mobile.src} sizes="100vw" />}
            <img {...defaultPhoto} alt="" sizes="100vw" fetchPriority="high" onError={() => setPhotoFailed(true)} />
          </picture>}
      {hasVideo && <video key={videoSource} ref={video} src={videoSource} poster={poster}
        muted={muted} autoPlay playsInline loop={loop} preload="metadata" onError={() => setFailed(videoSource!)}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />}
    </div>
    {!hasVideo && !photoFailed && (
      <div className="hero-slide-dots" role="tablist" aria-label="Hero slides">
        {HERO_SLIDES.map((src, index) => (
          <button
            key={src}
            type="button"
            role="tab"
            aria-selected={index === activeSlide}
            aria-label={`Slide ${index + 1}`}
            className={`hero-slide-dot${index === activeSlide ? ' is-active' : ''}`}
            onClick={() => setActiveSlide(index)}
          />
        ))}
      </div>
    )}
    {hasVideo && <div className="hero-controls">
      <button type="button" onClick={() => { if (video.current?.paused) void video.current.play().catch(() => {}); else video.current?.pause() }}>{playing ? t.pause : t.play}</button>
      {sound && <button type="button" onClick={() => setMuted(!muted)}>{muted ? t.unmute : t.mute}</button>}
    </div>}
  </>
}

export function Carousel({ children, locale, count, label, controlsFirst, autoPlay }: { children: ReactNode; locale: Locale; count: number; label?: string; controlsFirst?: boolean; autoPlay?: boolean }) {
  const reduced = useReducedMotion()
  const [viewport, api] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps', loop: Boolean(autoPlay && count > 1) })
  const [navigation, setNavigation] = useState({ previous: false, next: false })
  const [paused, setPaused] = useState(false)
  const update = useCallback(() => {
    if (api) setNavigation({ previous: api.canScrollPrev(), next: api.canScrollNext() })
  }, [api])
  useEffect(() => {
    if (!api) return
    const initial = requestAnimationFrame(update)
    api.on('select', update).on('reInit', update)
    return () => {
      cancelAnimationFrame(initial)
      api.off('select', update).off('reInit', update)
    }
  }, [api, update])
  useEffect(() => {
    if (!api || !autoPlay || count <= 1 || reduced || paused) return
    const timer = window.setInterval(() => {
      api.scrollNext()
    }, 3800)
    return () => window.clearInterval(timer)
  }, [api, autoPlay, count, reduced, paused])
  const t = labels[locale]
  const controls = count > 1 && <div className="carousel-controls">
      <button type="button" aria-label={t.previous} disabled={!navigation.previous} onClick={() => api?.scrollPrev(!!reduced)}>←</button>
      <button type="button" aria-label={t.next} disabled={!navigation.next} onClick={() => api?.scrollNext(!!reduced)}>→</button>
  </div>
  return <div
    className="carousel"
    role={label ? 'region' : undefined}
    aria-label={label}
    onMouseEnter={() => setPaused(true)}
    onMouseLeave={() => setPaused(false)}
    onFocusCapture={() => setPaused(true)}
    onBlurCapture={() => setPaused(false)}
  >
    {controlsFirst && controls}
    <div className="carousel-viewport" ref={viewport}><div className="carousel-track">{children}</div></div>
    {!controlsFirst && controls}
  </div>
}

export function Reveal({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  return <motion.div initial={false} whileInView={reduced ? undefined : { y: [12, 0] }} viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.55, ease: 'easeOut' }}>{children}</motion.div>
}

export function SocialDock({ locale, children }: { locale: Locale; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const button = useRef<HTMLButtonElement>(null)
  const dock = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !dock.current?.contains(event.target)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); button.current?.focus() }
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', escape)
    }
  }, [open])
  return <aside ref={dock} className={`social-dock ${open ? 'social-open' : ''}`}>
    <button className="social-toggle" ref={button} type="button" aria-expanded={open} aria-controls="social-dock-links" aria-label={labels[locale].social} onClick={() => setOpen(!open)}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 5h16v13H9l-5 3V5Z"/><path d="M8 10h8M8 13h6"/></svg>
    </button>
    <nav id="social-dock-links" aria-label={labels[locale].social} onClick={event => {
      if (event.target instanceof Element && event.target.closest('a')) setOpen(false)
    }}>{children}</nav>
  </aside>
}

export function ContactForm({ locale, services, submitLabel, preview }: { locale: Locale; services: { id: number; title: string }[]; submitLabel: string; preview: boolean }) {
  const t = labels[locale]
  const [status, setStatus] = useState<'sending' | 'success' | 'failure' | 'invalid' | 'limit'>()
  const [notification, setNotification] = useState<'sent' | 'unavailable' | 'failed'>()
  const [invalidFields, setInvalidFields] = useState<string[]>([])
  const baseId = useId()
  const pending = useRef(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending.current || preview) return
    const form = event.currentTarget
    const data = contactSchema.safeParse(Object.fromEntries(new FormData(form)))
    if (!data.success) {
      const fields = data.error.issues.flatMap(issue => typeof issue.path[0] === 'string' && issue.path[0] !== 'website' ? [issue.path[0]] : [])
      setInvalidFields(fields)
      setStatus('invalid')
      const first = form.elements.namedItem(fields[0] || '')
      if (first instanceof HTMLElement) first.focus()
      return
    }
    setInvalidFields([])
    setNotification(undefined)
    pending.current = true
    setStatus('sending')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.data),
      })
      if (response.ok) {
        const result = await response.json()
        if (!result.received) { setStatus('failure'); return }
        form.reset()
        setNotification(result.notification)
        setStatus('success')
      } else setStatus(response.status === 429 ? 'limit' : response.status === 400 ? 'invalid' : 'failure')
    } catch { setStatus('failure') }
    finally { pending.current = false }
  }
  const attributes = (field: string, label: string) => ({
    'aria-label': label,
    'aria-invalid': invalidFields.includes(field) || undefined,
    'aria-describedby': invalidFields.includes(field) ? baseId + '-' + field : undefined,
  })
  const error = (field: string) => invalidFields.includes(field) && <small className="field-error" id={baseId + '-' + field}>{t.fieldError}</small>

  const isVi = locale === 'vi'

  return <form className="contact-form" onSubmit={submit} noValidate aria-busy={status === 'sending'}>
    <div className="contact-form-row">
      <label className="contact-form-field">
        <span className="contact-form-label">{isVi ? 'Tên' : 'Name'}</span>
        <input
          name="name"
          autoComplete="name"
          required
          maxLength={100}
          placeholder={isVi ? 'Ví dụ: Nguyễn Minh Anh' : 'e.g. John Doe'}
          {...attributes('name', isVi ? 'Tên' : 'Name')}
        />
        {error('name')}
      </label>
      <label className="contact-form-field">
        <span className="contact-form-label">{isVi ? 'Số điện thoại' : 'Phone'}</span>
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          required
          maxLength={30}
          placeholder={isVi ? 'Ví dụ: 0909 123 456' : 'e.g. 0909 123 456'}
          {...attributes('phone', isVi ? 'Số điện thoại' : 'Phone')}
        />
        {error('phone')}
      </label>
    </div>

    <div className="contact-form-row">
      <label className="contact-form-field">
        <span className="contact-form-label">{isVi ? 'Email (nếu có)' : 'Email (optional)'}</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          maxLength={254}
          placeholder={isVi ? 'Ví dụ: ban@example.com' : 'e.g. you@example.com'}
          {...attributes('email', isVi ? 'Email' : 'Email')}
        />
        {error('email')}
      </label>
      <label className="contact-form-field">
        <span className="contact-form-label">{isVi ? 'URL Facebook (nếu có)' : 'Facebook URL (optional)'}</span>
        <input
          type="url"
          name="facebookUrl"
          maxLength={300}
          placeholder="https://facebook.com/..."
          {...attributes('facebookUrl', 'Facebook URL')}
        />
        {error('facebookUrl')}
      </label>
    </div>

    <div className="contact-form-field contact-form-full">
      <label className="contact-form-label" htmlFor={baseId + '-service'}>
        {isVi ? 'Thể loại concept' : 'Concept category'}
      </label>
      <div className="contact-select-wrap">
        <select id={baseId + '-service'} name="service">
          <option value="">{isVi ? 'Chọn thể loại đang quan tâm' : 'Select concept of interest'}</option>
          {services.map(item => <option value={item.id} key={item.id}>{item.title}</option>)}
        </select>
        <svg className="contact-select-arrow" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </div>
    </div>

    <div className="contact-form-field contact-form-full">
      <label className="contact-form-label" htmlFor={baseId + '-message'}>
        {isVi ? 'Nội dung (nếu có)' : 'Message (optional)'}
      </label>
      <textarea
        id={baseId + '-message'}
        name="message"
        maxLength={3000}
        rows={4}
        placeholder={isVi ? 'Có thể để trống hoặc chia sẻ thêm nhu cầu, concept mong muốn, thời gian dự kiến...' : 'Can be left blank or share more about your needs, desired concept, preferred timeline...'}
        {...attributes('message', isVi ? 'Nội dung' : 'Message')}
      />
      {error('message')}
    </div>

    <div className="contact-form-bottom">
      <label className="contact-consent-label">
        <input type="checkbox" name="consent" defaultChecked className="contact-consent-input" />
        <span className="contact-consent-checkbox" aria-hidden="true">
          <svg viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1.5 5 4.5 8 10.5 2" />
          </svg>
        </span>
        <span className="contact-consent-text">
          {isVi ? 'Tôi đồng ý cung cấp thông tin cá nhân để tiện liên lạc trao đổi.' : 'I agree to provide personal information for communication purposes.'}
        </span>
      </label>

      <button type="submit" className="contact-submit-btn" disabled={status === 'sending' || preview}>
        <span className="contact-submit-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </svg>
        </span>
        <span>{status === 'sending' ? (isVi ? 'Đang gửi...' : 'Sending...') : (submitLabel || (isVi ? 'Tư vấn ngay' : 'Consult Now'))}</span>
      </button>
    </div>

    <div className="contact-security-box">
      <span>
        {isVi ? 'Thông tin của bạn được bảo mật và chỉ sử dụng cho mục đích tư vấn dịch vụ. ' : 'Your information is confidential and used solely for consulting services. '}
        <a href="#policies">{isVi ? 'Xem thêm các chính sách tại đây' : 'View policies here'}</a>
      </span>
    </div>

    <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    {status && status !== 'sending' && <p className="contact-status-msg" role="status">{t[status]}</p>}
    {status === 'success' && notification && notification !== 'sent' && <p className="form-note">{notification === 'failed' ? t.noticeFailed : t.noticeUnavailable}</p>}
    {preview && <p className="form-note">{t.formPreview}</p>}
  </form>
}

export function ProcessSection({ process, locale }: { process: Process; locale: Locale }) {
  const steps = process.steps?.filter(s => s.title) ?? []
  const sectionRef = useRef<HTMLElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)

  const isPointerDown = useRef(false)
  const startX = useRef(0)
  const startScrollLeft = useRef(0)
  const isDragging = useRef(false)

  const updateScrollState = useCallback(() => {
    const container = carouselRef.current
    if (!container) return

    const maxScroll = container.scrollWidth - container.clientWidth
    setCanScrollPrev(container.scrollLeft > 10)
    setCanScrollNext(container.scrollLeft < maxScroll - 10)

    const cards = container.querySelectorAll<HTMLElement>('.process-card')
    let closestIndex = 0
    let minDiff = Infinity
    const containerLeft = container.getBoundingClientRect().left

    cards.forEach((card, idx) => {
      const cardLeft = card.getBoundingClientRect().left
      const diff = Math.abs(cardLeft - containerLeft)
      if (diff < minDiff) {
        minDiff = diff
        closestIndex = idx
      }
    })
    setSelectedIndex(closestIndex)
  }, [])

  useEffect(() => {
    const container = carouselRef.current
    const section = sectionRef.current
    if (!container || !section) return

    updateScrollState()

    const onScroll = () => {
      updateScrollState()
    }

    const onWheel = (e: WheelEvent) => {
      // If user swipes horizontally on trackpad, let browser handle it natively
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
      if (Math.abs(e.deltaY) < 2) return

      const maxScroll = container.scrollWidth - container.clientWidth
      if (maxScroll <= 0) return

      const delta = e.deltaY
      const atStart = container.scrollLeft <= 2 && delta < 0
      const atEnd = container.scrollLeft >= maxScroll - 2 && delta > 0

      // When rolling mouse wheel over the process section:
      // Scroll horizontally through all steps before continuing down the page!
      if (!atStart && !atEnd) {
        e.preventDefault()
        container.scrollLeft += delta
      }
    }

    container.addEventListener('scroll', onScroll, { passive: true })
    section.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('resize', onScroll)

    return () => {
      container.removeEventListener('scroll', onScroll)
      section.removeEventListener('wheel', onWheel)
      window.removeEventListener('resize', onScroll)
    }
  }, [updateScrollState])

  const scrollToStep = (index: number) => {
    const container = carouselRef.current
    if (!container) return
    const cards = container.querySelectorAll<HTMLElement>('.process-card')
    const target = cards[index]
    if (target) {
      const paddingLeft = parseFloat(getComputedStyle(container).paddingLeft) || 0
      container.scrollTo({
        left: target.offsetLeft - paddingLeft,
        behavior: 'smooth',
      })
    }
  }

  const scrollByCard = (direction: 'prev' | 'next') => {
    const container = carouselRef.current
    if (!container) return
    const card = container.querySelector<HTMLElement>('.process-card')
    const delta = (card?.offsetWidth ?? 360) + 24
    container.scrollBy({
      left: direction === 'next' ? delta : -delta,
      behavior: 'smooth',
    })
  }

  // Mouse drag support
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = carouselRef.current
    if (!container) return
    isPointerDown.current = true
    isDragging.current = false
    startX.current = e.pageX - container.offsetLeft
    startScrollLeft.current = container.scrollLeft
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPointerDown.current) return
    const container = carouselRef.current
    if (!container) return
    const x = e.pageX - container.offsetLeft
    const walk = (x - startX.current) * 1.2
    if (Math.abs(walk) > 4) {
      isDragging.current = true
      e.preventDefault()
      container.scrollLeft = startScrollLeft.current - walk
    }
  }

  const handleMouseUp = () => {
    isPointerDown.current = false
    setTimeout(() => {
      isDragging.current = false
    }, 50)
  }

  if (!steps.length) return null
  const t = labels[locale]

  return (
    <section id="process" className="process-section" ref={sectionRef}>
      <div className="shell section-pad">
        <div className="section-title process-title">
          <div>
            {process.eyebrow && <p className="eyebrow process-eyebrow">{process.eyebrow}</p>}
            <h2>{process.heading || (locale === 'vi' ? 'Quy trình làm việc' : 'Working Process')}</h2>
          </div>
          {process.description && <p className="process-lead">{process.description}</p>}
          <div className="carousel-controls process-controls">
            <button
              type="button"
              aria-label={t.previous}
              disabled={!canScrollPrev}
              onClick={() => scrollByCard('prev')}
            >
              ←
            </button>
            <button
              type="button"
              aria-label={t.next}
              disabled={!canScrollNext}
              onClick={() => scrollByCard('next')}
            >
              →
            </button>
          </div>
        </div>

        <div className="process-timeline" role="tablist" aria-label={process.heading || 'Process steps'}>
          <div className="process-timeline-bar" aria-hidden="true" />
          <div className="process-timeline-nodes">
            {steps.map((step, index) => {
              const num = step.stepNumber || String(index + 1).padStart(2, '0')
              const isActive = selectedIndex === index
              return (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`process-node ${isActive ? 'is-active' : ''}`}
                  onClick={() => scrollToStep(index)}
                >
                  <span className="process-node-bullet">{num}</span>
                  <span className="process-node-name">{step.title}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div
          className="process-carousel"
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="process-track">
            {steps.map((step, index) => {
              const num = step.stepNumber || String(index + 1).padStart(2, '0')
              const isActive = selectedIndex === index
              return (
                <div
                  key={index}
                  className={`process-card ${isActive ? 'is-active' : ''}`}
                  onClick={() => {
                    if (!isDragging.current) scrollToStep(index)
                  }}
                >
                  <div className="process-card-header">
                    <span className="process-card-number">{num}</span>
                    <span className="process-card-dot" aria-hidden="true">✦</span>
                  </div>
                  <h3 className="process-card-title">{step.title}</h3>
                  {step.subtitle && <p className="process-card-subtitle">{step.subtitle}</p>}
                  {step.description && <p className="process-card-desc">{step.description}</p>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
