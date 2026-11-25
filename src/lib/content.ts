import { cache } from 'react'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Locale } from './i18n'
import { demoWebsite } from './demo'
import { editorialCopy, previousDemo } from './editorial-copy'

export type ImageAsset = { url?: string | null; alt?: string | null; mimeType?: string | null; sizes?: Record<string, { url?: string | null; width?: number | null }> | null; deliveryUrl?: string | null; focalX?: number | null; focalY?: number | null }
export type MediaRef = ImageAsset | number | null | undefined
export type CTA = { label?: string | null; href?: string | null } | null
export type SEO = { title?: string | null; description?: string | null; image?: MediaRef } | null
type Category = number | { name: string } | null
export type EditorialBlock = {
  blockType: 'richText' | 'singleImage' | 'fullWidthImage' | 'twoColumnImages' | 'imageGallery' | 'quote' | 'videoEmbed' | 'divider' | 'spacer'
  body?: DefaultTypedEditorState | null
  image?: MediaRef; left?: MediaRef; right?: MediaRef; images?: MediaRef[] | null
  caption?: string | null; quote?: string | null; attribution?: string | null
  url?: string | null; title?: string | null; size?: string | null
}
export type PortfolioEntry = {
  id: number; slug: string; title: string; summary?: string | null; cover?: MediaRef; coverVideo?: MediaRef;
  category?: Category; featured?: boolean | null; seo?: SEO; cta?: CTA;
  body?: DefaultTypedEditorState | null; gallery?: MediaRef[] | null; content?: EditorialBlock[] | null
  projectDate?: string | null; publishedAt?: string | null; client?: string | null; photographer?: string | null
  model?: string | null; stylist?: string | null; makeup?: string | null; collaborators?: string | null
  related?: (number | { id: number })[] | null
}
export type Social = { id: number; platform: string; label: string; href: string; icon?: string | null; tooltip?: string | null }
export type Announcement = {
  visible?: boolean | null
  text?: string | null
  highlight?: string | null
  link?: string | null
  speed?: number | null
}
export type ProcessStep = {
  id?: string | null
  stepNumber?: string | null
  title: string
  subtitle?: string | null
  description?: string | null
}
export type Process = {
  visible?: boolean | null
  eyebrow?: string | null
  heading?: string | null
  description?: string | null
  steps?: readonly ProcessStep[] | ProcessStep[] | null
}
export type Hero = {
  visible?: boolean | null; eyebrow?: string | null; headline?: string | null; accent?: string | null; description?: string | null
  mediaType?: string | null; desktopImage?: MediaRef; mobileImage?: MediaRef; desktopVideo?: MediaRef; mobileVideo?: MediaRef
  poster?: MediaRef; fallback?: MediaRef; overlay?: number | null; alignment?: string | null; loop?: boolean | null; sound?: boolean | null
  primary?: CTA; secondary?: CTA
}
export type Website = {
  site: { name?: string | null; shortName?: string | null; descriptor?: string | null; tagline?: string | null; copyright?: string | null;
    establishedYear?: string | null; logo?: MediaRef; isDemo?: boolean | null;
    servicesHeading?: string | null; servicesDescription?: string | null; workHeading?: string | null; workDescription?: string | null;
    workEyebrow?: string | null; workAction?: string | null; sloganQuote?: string | null; sloganAuthor?: string | null; footerLead?: string | null; footerHeading?: string | null;
    footerAction?: string | null; footerTagline?: string | null; footerDescription?: string | null; seo?: SEO }
  announcement?: Announcement | null
  process?: Process | null
  hero: Hero
  about: { visible?: boolean | null; heading?: string | null; subtitle?: string | null; description?: string | null; portrait?: MediaRef;
    featuredStatement?: string | null; editorialBody?: string | null; closingStatement?: string | null;
    images?: MediaRef[] | null; video?: MediaRef; biography?: DefaultTypedEditorState | null; cta?: CTA;
    links?: { id?: string | null; label?: string | null; href: string }[] | null }
  contact: { visible?: boolean | null; formVisible?: boolean | null; heading?: string | null; description?: string | null;
    eyebrow?: string | null; submitLabel?: string | null; location?: string | null; email?: string | null; phone?: string | null;
    googleMapsUrl?: string | null; studioAddress?: string | null }
  services: PortfolioEntry[]
  social: Social[]
}

export function withEditorialDefaults(data: Website, locale: Locale): Website {
  const { site, about, contact, announcement, process } = data
  const copy = editorialCopy[locale]
  const old = previousDemo[locale]
  const isOld = (value: string | null | undefined, sample: string) => site.isDemo && value === sample
  const legacyBody = !isOld(about.description, old.about.description) && about.description
  const hasBiography = !!about.biography?.root.children.length
  const cta = about.cta?.label && !isOld(about.cta.label, old.about.action) ? about.cta : {
    label: copy.about.cta.label, href: about.cta?.href || copy.about.cta.href,
  }
  return {
    ...data,
    announcement: {
      visible: announcement?.visible ?? true,
      text: announcement?.text || copy.announcement.text,
      highlight: announcement?.highlight || copy.announcement.highlight,
      link: announcement?.link ?? copy.announcement.link,
      speed: announcement?.speed || copy.announcement.speed,
    },
    process: {
      visible: process?.visible ?? true,
      eyebrow: process?.eyebrow || copy.process.eyebrow,
      heading: process?.heading || copy.process.heading,
      description: process?.description || copy.process.description,
      steps: process?.steps && process.steps.length > 0 ? process.steps : copy.process.steps,
    },
    site: {
      ...site,
      name: site.name || copy.site.name,
      shortName: site.shortName || copy.site.shortName,
      copyright: site.copyright || copy.site.copyright,
      establishedYear: site.establishedYear || copy.site.establishedYear,
      workEyebrow: site.workEyebrow || copy.site.workEyebrow,
      workHeading: !site.workHeading || isOld(site.workHeading, old.workHeading) ? copy.site.workHeading : site.workHeading,
      workAction: site.workAction || copy.site.workAction,
      footerLead: site.footerLead || copy.site.footerLead,
      footerHeading: site.footerHeading || copy.site.footerHeading,
      footerAction: site.footerAction || copy.site.footerAction,
      footerTagline: site.footerTagline || copy.site.footerTagline,
      footerDescription: site.footerDescription || (!isOld(site.tagline, old.tagline) && site.tagline) || copy.site.footerDescription,
    },
    about: {
      ...about,
      heading: !about.heading || isOld(about.heading, old.about.heading) ? copy.about.heading : about.heading,
      subtitle: !about.subtitle || isOld(about.subtitle, old.about.subtitle) ? copy.about.subtitle : about.subtitle,
      featuredStatement: about.featuredStatement || copy.about.featuredStatement,
      editorialBody: about.editorialBody || legacyBody || (hasBiography ? '' : copy.about.editorialBody),
      closingStatement: about.closingStatement || copy.about.closingStatement,
      cta,
    },
    contact: {
      ...contact,
      eyebrow: contact.eyebrow || copy.contact.eyebrow,
      heading: !contact.heading || isOld(contact.heading, old.contact.heading) ? copy.contact.heading : contact.heading,
      description: !contact.description || isOld(contact.description, old.contact.description) ? copy.contact.description : contact.description,
      submitLabel: contact.submitLabel || copy.contact.submitLabel,
      googleMapsUrl: contact.googleMapsUrl || copy.contact.googleMapsUrl,
      studioAddress: contact.studioAddress || copy.contact.studioAddress,
    },
  }
}

export const demoMode = () => process.env.PORTFOLIO_DEMO === 'true'
export const cms = cache(async () => {
  const [{ getPayload }, { default: config }] = await Promise.all([import('payload'), import('@payload-config')])
  return getPayload({ config })
})

export const getWebsite = cache(async (locale: Locale): Promise<Website> => {
  if (demoMode()) return demoWebsite(locale)
  const payload = await cms()
  const common = { locale, depth: 2, overrideAccess: false } as const
  const [site, announcement, processGlobal, hero, about, contact, services, social] = await Promise.all([
    payload.findGlobal({ ...common, slug: 'site-settings' }),
    payload.findGlobal({ ...common, slug: 'announcement' }),
    payload.findGlobal({ ...common, slug: 'process' }),
    payload.findGlobal({ ...common, slug: 'hero' }),
    payload.findGlobal({ ...common, slug: 'about' }),
    payload.findGlobal({ ...common, slug: 'contact-settings' }),
    payload.find({ ...common, collection: 'services', pagination: false, draft: false }),
    payload.find({ ...common, collection: 'social-links', pagination: false }),
  ])
  return withEditorialDefaults({ site, announcement, process: processGlobal, hero, about, contact, services: services.docs, social: social.docs }, locale)
})

const projectCards = {
  collection: 'case-studies', overrideAccess: false, draft: false, depth: 1,
  select: { title: true, slug: true, cover: true, category: true, projectDate: true },
} as const

export async function getSelectedProjects(locale: Locale): Promise<PortfolioEntry[]> {
  const limit = 6
  if (demoMode()) {
    const { cases } = demoWebsite(locale)
    const featured = cases.filter(item => item.featured)
    return (featured.length ? featured : cases).slice(0, limit)
  }
  const payload = await cms()
  const featured = await payload.find({ ...projectCards, locale, limit, where: { featured: { equals: true } } })
  if (featured.docs.length) return featured.docs
  return (await payload.find({ ...projectCards, locale, limit })).docs
}

export const getProjectPage = cache(async (locale: Locale, page: number) => {
  const limit = 12
  if (demoMode()) {
    const { cases } = demoWebsite(locale)
    return { docs: cases.slice((page - 1) * limit, page * limit), totalPages: Math.ceil(cases.length / limit) }
  }
  return (await cms()).find({ ...projectCards, locale, limit, page })
})

export async function getProjectNavigation(locale: Locale): Promise<PortfolioEntry[]> {
  if (demoMode()) return demoWebsite(locale).cases
  return (await (await cms()).find({ ...projectCards, locale, pagination: false })).docs
}

export async function getProjectSlugs(locale: Locale): Promise<string[]> {
  if (demoMode()) return demoWebsite(locale).cases.map(item => item.slug)
  const { docs } = await (await cms()).find({
    ...projectCards, locale, depth: 0, pagination: false, select: { slug: true },
  })
  return docs.map(item => item.slug)
}

export async function getEntry(locale: Locale, kind: 'services' | 'case-studies', slug: string): Promise<PortfolioEntry | undefined> {
  if (demoMode()) {
    const demo = demoWebsite(locale)
    return (kind === 'services' ? demo.services : demo.cases).find(item => item.slug === slug)
  }
  const payload = await cms()
  const result = await payload.find({
    collection: kind, locale, draft: false, overrideAccess: false,
    depth: 2, limit: 1, where: { slug: { equals: slug } },
  })
  return result.docs[0]
}

export function imageAsset(ref: MediaRef) {
  return ref && typeof ref === 'object' ? ref : undefined
}

export function videoUrl(ref: MediaRef) {
  const asset = imageAsset(ref)
  return asset?.mimeType?.startsWith('video/') ? asset.deliveryUrl || asset.url || undefined : undefined
}

export function categoryName(category: Category | undefined) {
  return category && typeof category === 'object' ? category.name : undefined
}
