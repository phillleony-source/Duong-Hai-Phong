import path from 'node:path'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { demoWebsite } from '../src/lib/demo'
import type { EditorialBlock, MediaRef, PortfolioEntry } from '../src/lib/content'
import type { About, CaseStudy, ContactSetting, Hero, Service, SiteSetting } from '../src/payload-types'

if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) throw new Error('Set DATABASE_URL and PAYLOAD_SECRET first.')
if (process.env.SEED_DEMO !== 'true') throw new Error('Set SEED_DEMO=true to import demo content into your selected database.')

const payload = await getPayload({ config })
const en = demoWebsite('en')
const vi = demoWebsite('vi')
const mediaIDs = new Map<string, number>()
const altVi: Record<string, string> = {
  'hero.webp': 'Đầu bếp làm việc dưới ánh sáng của bếp mở',
  'hero-mobile.webp': 'Đầu bếp làm việc dưới ánh sáng của bếp mở',
  'about.webp': 'Máy quay điện ảnh trên phim trường',
  'portraits.webp': 'Chân dung một diễn viên trên phim trường',
  'editorial.webp': 'Khung hình chân dung trên phim trường',
  'commercial.webp': 'Đầu bếp dùng đèn khò trong bếp',
  'still.webp': 'Khung hình hậu trường trong ánh sáng vàng',
  'documentary.webp': 'Không gian bếp mở trong bộ ảnh tài liệu',
  'campaign.webp': 'Chân dung sử dụng trong poster',
}

async function upload(ref: MediaRef) {
  if (!ref || typeof ref !== 'object' || !ref.url) return undefined
  const filename = path.basename(ref.url)
  const cached = mediaIDs.get(filename)
  if (cached) return cached
  const existing = await payload.find({ collection: 'media', locale: 'en', where: { filename: { equals: filename } }, limit: 1 })
  const media = existing.docs[0] ?? await payload.create({ collection: 'media', locale: 'en',
    data: { alt: ref.alt || filename }, filePath: path.resolve('public', 'portfolio', filename) })
  await payload.update({ collection: 'media', locale: 'vi', id: media.id, data: { alt: altVi[filename] || filename } })
  mediaIDs.set(filename, media.id)
  return media.id
}

async function seedEntry(kind: 'services' | 'case-studies', entry: PortfolioEntry, translated: PortfolioEntry, sortOrder: number) {
  const existing = await payload.find({ collection: kind, locale: 'en', where: { slug: { equals: entry.slug } }, depth: 0, limit: 1 })
  if (existing.totalDocs) return
  const categoryCollection = kind === 'services' ? 'service-categories' : 'case-categories'
  if (typeof entry.category !== 'object' || typeof translated.category !== 'object' || !entry.category || !translated.category) throw new Error('Demo category is missing.')
  const existingCategory = await payload.find({ collection: categoryCollection, where: { slug: { equals: entry.slug } }, limit: 1 })
  const category = existingCategory.docs[0] ?? await payload.create({ collection: categoryCollection, locale: 'en',
    data: { name: entry.category.name, slug: entry.slug, sortOrder, visible: true } })
  if (!existingCategory.totalDocs) await payload.update({ collection: categoryCollection, id: category.id, locale: 'vi', data: { name: translated.category.name } })
  const base = { slug: entry.slug, cover: await upload(entry.cover), category: category.id, featured: true,
    visible: true, sortOrder, _status: 'published' as const }

  const localized = (item: PortfolioEntry) => ({
    title: item.title, summary: item.summary, seo: { title: item.title, description: item.summary },
    cta: { label: item === translated ? 'Liên hệ' : 'Get in touch', href: '#contact' },
  })

  if (kind === 'services') {
    const gallery = (await Promise.all((entry.gallery ?? []).map(upload))).filter(id => id != null)
    const data: Omit<Service, 'id' | 'updatedAt' | 'createdAt'> = { ...base, ...localized(entry), gallery }
    const document = await payload.create({ collection: 'services', locale: 'en', data })
    await payload.update({ collection: 'services', id: document.id, locale: 'vi', data: localized(translated) })
    return
  }

  async function blocks(items: EditorialBlock[] = []): Promise<NonNullable<CaseStudy['content']>> {
    return Promise.all(items.map(async block => {
      if (block.blockType === 'twoColumnImages') return { blockType: block.blockType, left: await upload(block.left), right: await upload(block.right) }
      if (block.blockType === 'fullWidthImage' || block.blockType === 'singleImage') return { blockType: block.blockType, image: await upload(block.image) }
      throw new Error('Unsupported demo block.')
    }))
  }

  const document = await payload.create({ collection: 'case-studies', locale: 'en', data: { ...base, ...localized(entry), content: await blocks(entry.content ?? []) } })
  await payload.update({ collection: 'case-studies', id: document.id, locale: 'vi', data: { ...localized(translated), content: await blocks(translated.content ?? []) } })
}

try {
  const existingSite = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  if (existingSite.name) throw new Error('Site Settings already contains a site name. Use an empty demo database.')
  for (const kind of ['services', 'case-studies'] as const) {
    const entries = kind === 'services' ? en.services : en.cases
    const translated = kind === 'services' ? vi.services : vi.cases
    for (const [index, entry] of entries.entries()) await seedEntry(kind, entry, translated[index], index)
  }
  const exists = await payload.find({ collection: 'social-links', where: { href: { equals: en.social[0].href } }, limit: 1 })
  if (!exists.totalDocs) {
    const { label, href, platform } = en.social[0]
    const item = await payload.create({ collection: 'social-links', locale: 'en', data: { label, href, platform, visible: true } })
    await payload.update({ collection: 'social-links', id: item.id, locale: 'vi', data: { label: vi.social[0].label } })
  }
  let processStepIds: string[] = []
  for (const [locale, data] of [['en', en], ['vi', vi]] as const) {
    const hero: Partial<Hero> = {
      ...data.hero, mediaType: 'image', alignment: 'left', desktopImage: await upload(data.hero.desktopImage),
      mobileImage: await upload(data.hero.mobileImage), fallback: await upload(data.hero.fallback),
    }
    const about: Partial<About> = { ...data.about, portrait: await upload(data.about.portrait) }
    const site: Partial<SiteSetting> = { ...data.site, isDemo: true, seo: { ...data.site.seo, image: await upload(data.site.seo.image) } }
    const contact: Partial<ContactSetting> = data.contact
    const announcement = data.announcement
    const processData = {
      ...data.process,
      steps: data.process.steps.map((step, idx) => ({
        ...step,
        ...(processStepIds[idx] ? { id: processStepIds[idx] } : {}),
      })),
    }
    await payload.updateGlobal({ slug: 'announcement', locale, data: announcement })
    const savedProcess = await payload.updateGlobal({ slug: 'process', locale, data: processData })
    if (locale === 'en' && savedProcess.steps) {
      processStepIds = savedProcess.steps.map(s => s.id).filter((id): id is string => typeof id === 'string')
    }
    await payload.updateGlobal({ slug: 'hero', locale, data: hero })
    await payload.updateGlobal({ slug: 'about', locale, data: about })
    await payload.updateGlobal({ slug: 'contact-settings', locale, data: contact })
    await payload.updateGlobal({ slug: 'site-settings', locale, data: site })
  }
  payload.logger.info('Demo content saved. Create the first administrator with npm run admin:init.')
} finally {
  await payload.destroy()
}
