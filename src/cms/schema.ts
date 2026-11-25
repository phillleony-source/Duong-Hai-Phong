import { APIError, type Access, type Block, type CollectionConfig, type Field, type GlobalConfig, type Where } from 'payload'
import { safeHref, videoEmbed } from '../lib/urls'
import { budgetOptions } from '../lib/inquiry-options'

export const isAdmin: Access = ({ req }) => req.user?.role === 'admin'
const staff: Access = ({ req }) => !!req.user
const visible: Where = { visible: { equals: true } }
const published: Access = ({ req }) => !!req.user || { and: [visible, { _status: { equals: 'published' } }] }
const publicVisible: Access = ({ req }) => !!req.user || visible
const staffWrite = { create: staff, update: staff, delete: staff }
const localized = (name: string, required = false): Field => ({ name, type: 'text', localized: true, required })
const copy = (name: string): Field => ({ name, type: 'textarea', localized: true })
const rich = (name: string): Field => ({ name, type: 'richText', localized: true })
const media = (name: string, kind?: 'image' | 'video', hasMany = false): Field => ({
  name, type: 'upload', relationTo: 'media', hasMany,
  ...(kind ? { filterOptions: { mimeType: { contains: kind + '/' } } } : {}),
})
const link = (name: string, internal = true, required = false): Field => ({
  name, type: 'text', required,
  validate: (value: string | null | undefined) => value ? !!safeHref(value, internal) || 'Invalid link.' : !required || 'A link is required.',
})
const cta = (name: string): Field => ({ name, type: 'group', fields: [localized('label'), link('href')] })
const visibility: Field = { name: 'visible', type: 'checkbox', defaultValue: true, index: true }
const sortOrder: Field = { name: 'sortOrder', type: 'number', defaultValue: 0, index: true }
const slug: Field = {
  name: 'slug', type: 'text', required: true, unique: true,
  validate: (value: string | null | undefined) => !!value && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value) || 'Use lowercase ASCII letters, digits and hyphens.',
}
const seo: Field = { name: 'seo', type: 'group', fields: [localized('title'), copy('description'), media('image', 'image')] }

export const platforms = ['instagram', 'facebook', 'behance', 'zalo', 'whatsapp', 'email', 'phone', 'external', 'tiktok', 'threads', 'flickr'] as const

const blocks: Block[] = [
  { slug: 'richText', fields: [rich('body')] },
  { slug: 'singleImage', fields: [media('image', 'image'), copy('caption')] },
  { slug: 'fullWidthImage', fields: [media('image', 'image'), copy('caption')] },
  { slug: 'twoColumnImages', fields: [media('left', 'image'), media('right', 'image'), copy('caption')] },
  { slug: 'imageGallery', fields: [media('images', 'image', true), copy('caption')] },
  { slug: 'quote', fields: [copy('quote'), localized('attribution')] },
  { slug: 'videoEmbed', fields: [{
    name: 'url', type: 'text', required: true,
    validate: (value: string | null | undefined) => !!videoEmbed(value) || 'Use a YouTube watch or Vimeo video URL.',
  }, localized('title')] },
  { slug: 'divider', fields: [] },
  { slug: 'spacer', fields: [{ name: 'size', type: 'select', options: ['small', 'large'], defaultValue: 'small' }] },
]

const categories = (slugName: 'service-categories' | 'case-categories', reference: 'services' | 'case-studies'): CollectionConfig => ({
  slug: slugName, admin: { useAsTitle: 'name', group: 'Portfolio' },
  access: { ...staffWrite, read: publicVisible },
  fields: [localized('name', true), slug, copy('description'), sortOrder, visibility],
  hooks: { beforeDelete: [async ({ id, req }) => {
    const result = await req.payload.count({ collection: reference, where: { category: { equals: id } }, req })
    const versions = await req.payload.findVersions({ collection: reference, where: { 'version.category': { equals: id } }, limit: 1, depth: 0, req })
    if (result.totalDocs || versions.totalDocs) {
      throw new APIError('This category is referenced by portfolio content or a saved revision.', 409)
    }
  }] },
})

const portfolio = (kind: 'services' | 'case-studies'): CollectionConfig => {
  const service = kind === 'services'
  return {
    slug: kind,
    admin: {
      useAsTitle: 'title', group: 'Portfolio', defaultColumns: ['title', 'category', '_status', 'sortOrder'],
      preview: (doc, { locale }) => `/${locale || 'en'}/preview/${kind}/${doc.id}`,
    },
    defaultSort: ['sortOrder', 'id'],
    access: { ...staffWrite, read: published, readVersions: staff },
    versions: { drafts: true, maxPerDoc: 20 },
    fields: [
      localized('title', true), slug, copy('summary'),
      { name: 'category', type: 'relationship', required: true, relationTo: service ? 'service-categories' : 'case-categories' },
      media('cover', 'image'), { name: 'featured', type: 'checkbox' }, sortOrder, visibility, seo, cta('cta'),
      ...(service ? [rich('body'), media('gallery', 'image', true)] : [
        media('coverVideo', 'video'), { name: 'projectDate', type: 'date' } as Field,
        { name: 'publishedAt', type: 'date' } as Field,
        localized('client'), localized('photographer'), localized('model'), localized('stylist'),
        localized('makeup'), localized('collaborators'),
        { name: 'content', type: 'blocks', localized: true, blocks } as Field,
        { name: 'related', type: 'relationship', relationTo: 'case-studies', hasMany: true } as Field,
      ]),
    ],
  }
}

export const collections: CollectionConfig[] = [
  {
    slug: 'users', auth: { maxLoginAttempts: 5, lockTime: 10 * 60 * 1000 },
    admin: { useAsTitle: 'email', group: 'Settings' },
    access: {
      create: isAdmin,
      read: ({ req }) => req.user?.role === 'admin' || (req.user ? { id: { equals: req.user.id } } : false),
      update: isAdmin, delete: isAdmin,
    },
    hooks: { beforeChange: [({ data, operation, req }) => {
      if (operation === 'create' && !req.user) {
        if (req.payloadAPI !== 'local' || req.context.bootstrapAdmin !== true) throw new APIError('Create the first administrator from the server CLI.', 403)
        return { ...data, role: 'admin' }
      }
      return data
    }] },
    fields: [{
      name: 'role', type: 'select', options: ['admin', 'editor'], required: true, defaultValue: 'editor',
      access: { create: ({ req }) => req.user?.role === 'admin', update: ({ req }) => req.user?.role === 'admin' },
    }],
  },
  {
    slug: 'media', admin: { group: 'Media' },
    access: { ...staffWrite, read: () => true, delete: () => false },
    upload: {
      staticDir: 'media',
      mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm'],
      imageSizes: [640, 1120, 1920].map(width => ({
        name: `w${width}`, width, withoutEnlargement: true, formatOptions: { format: 'webp', options: { quality: 84 } },
      })),
    },
    fields: [localized('alt', true), { name: 'durationSeconds', type: 'number', min: 0 },
      media('poster', 'image'), { name: 'deliveryUrl', type: 'text', validate: (value: string | null | undefined) => !value || safeHref(value, false)?.startsWith('https:') === true || 'Enter an HTTPS delivery URL.' },
    ],
  },
  categories('service-categories', 'services'), portfolio('services'),
  categories('case-categories', 'case-studies'), portfolio('case-studies'),
  {
    slug: 'social-links', defaultSort: ['sortOrder', 'id'], admin: { useAsTitle: 'label', group: 'Communication' },
    access: { ...staffWrite, read: publicVisible },
    fields: [
      { name: 'platform', type: 'select', options: [...platforms], required: true },
      localized('label', true), link('href', false, true),
      { name: 'icon', type: 'select', options: [...platforms] }, localized('tooltip'), sortOrder, visibility,
    ],
  },
  {
    slug: 'contact-submissions', admin: { useAsTitle: 'name', group: 'Communication' },
    access: { read: isAdmin, create: () => false, update: isAdmin, delete: isAdmin },
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'phone', type: 'text', required: true },
      { name: 'email', type: 'email' },
      { name: 'facebookUrl', type: 'text' },
      { name: 'service', type: 'relationship', relationTo: 'services' },
      { name: 'projectDate', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
      { name: 'budgetRange', type: 'select', options: budgetOptions.map(({ label, value }) => ({ label, value })) },
      { name: 'message', type: 'textarea' },
      { name: 'consent', type: 'checkbox', defaultValue: true },
      { name: 'status', type: 'select', options: ['new', 'contacted', 'in-progress', 'closed'], defaultValue: 'new' },
      { name: 'internalNotes', type: 'textarea' },
      { name: 'delivery', type: 'select', options: ['pending', 'sent', 'failed', 'disabled'], defaultValue: 'pending' },
    ],
  },
]

export const globals: GlobalConfig[] = [
  {
    slug: 'site-settings', admin: { group: 'Settings' }, access: { read: () => true, update: isAdmin },
    fields: [
      localized('name'), localized('shortName'), localized('descriptor'), localized('tagline'), localized('copyright'), media('logo', 'image'),
      { name: 'isDemo', type: 'checkbox', defaultValue: false, admin: { description: 'Shows the demo label and disables indexing while sample content is in use.' } },
      localized('servicesHeading'), copy('servicesDescription'), localized('workEyebrow'), localized('workHeading'),
      copy('workDescription'), localized('workAction'), copy('sloganQuote'), localized('sloganAuthor'), localized('footerLead'), localized('footerHeading'),
      localized('footerAction'), localized('footerTagline'), copy('footerDescription'),
      { name: 'establishedYear', type: 'text', defaultValue: '2016' },
      seo,
    ],
  },
  {
    slug: 'announcement', admin: { group: 'Homepage' }, access: { read: () => true, update: staff },
    fields: [
      visibility, localized('text'), localized('highlight'), link('link', true, false),
      { name: 'speed', type: 'number', defaultValue: 25, min: 10, max: 120, admin: { description: 'Marquee speed duration in seconds (lower is faster, default: 25)' } },
    ],
  },
  {
    slug: 'process', admin: { group: 'Homepage' }, access: { read: () => true, update: staff },
    fields: [
      visibility, localized('eyebrow'), localized('heading'), copy('description'),
      {
        name: 'steps',
        type: 'array',
        fields: [
          { name: 'stepNumber', type: 'text' },
          localized('title', true),
          localized('subtitle'),
          copy('description'),
        ],
      },
    ],
  },
  {
    slug: 'hero', admin: { group: 'Homepage' }, access: { read: () => true, update: staff },
    fields: [
      visibility, localized('eyebrow'), localized('headline'), localized('accent'), copy('description'),
      { name: 'mediaType', type: 'select', options: ['image', 'video'], defaultValue: 'image' },
      media('desktopImage', 'image'), media('mobileImage', 'image'), media('desktopVideo', 'video'),
      media('mobileVideo', 'video'), media('poster', 'image'), media('fallback', 'image'),
      cta('primary'), cta('secondary'),
      { name: 'overlay', type: 'number', min: 0, max: 100, defaultValue: 42 },
      { name: 'alignment', type: 'select', options: ['left', 'center'], defaultValue: 'left' },
      { name: 'loop', type: 'checkbox', defaultValue: true }, { name: 'sound', type: 'checkbox' },
    ],
  },
  {
    slug: 'about', admin: { group: 'Homepage' }, access: { read: () => true, update: staff },
    fields: [visibility, localized('heading'), localized('subtitle'), copy('featuredStatement'), copy('editorialBody'),
      copy('closingStatement'), copy('description'), rich('biography'),
      media('portrait', 'image'), media('images', 'image', true), media('video', 'video'), cta('cta'),
      { name: 'links', type: 'array', fields: [localized('label'), link('href', false, true)] }],
  },
  {
    slug: 'contact-settings', admin: { group: 'Homepage' }, access: { read: () => true, update: isAdmin },
    fields: [
      visibility, localized('eyebrow'), localized('heading'), copy('description'), localized('submitLabel'), localized('location'),
      { name: 'email', type: 'email' }, { name: 'phone', type: 'text' },
      { name: 'googleMapsUrl', type: 'text', admin: { description: 'Link Google Maps của Studio' } },
      localized('studioAddress'),
      { name: 'recipient', type: 'email', access: { read: ({ req }) => req.user?.role === 'admin' } },
      { name: 'formVisible', type: 'checkbox', defaultValue: true },
    ],
  },
]
