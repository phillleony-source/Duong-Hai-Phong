import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { collections, globals } from './cms/schema'
import { sendEmail } from './lib/email'

const directory = path.dirname(fileURLToPath(import.meta.url))
const { S3_BUCKET, S3_REGION, S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY } = process.env
const s3 = S3_BUCKET && S3_REGION && S3_ACCESS_KEY_ID && S3_SECRET_ACCESS_KEY

export default buildConfig({
  admin: { user: 'users', importMap: { baseDir: directory }, meta: { titleSuffix: ' | Studio CMS' } },
  collections,
  globals,
  localization: { locales: [{ code: 'en', label: 'English' }, { code: 'vi', label: 'Tiếng Việt' }], defaultLocale: 'en', fallback: true },
  editor: lexicalEditor(),
  email: () => ({
    name: 'resend',
    defaultFromAddress: process.env.CONTACT_FROM || 'studio@example.com',
    defaultFromName: 'Portfolio CMS',
    sendEmail: async ({ to, subject, text, html }) => {
      if (typeof to !== 'string' || !process.env.CONTACT_FROM) throw new Error('CMS email delivery is unavailable.')
      const content = typeof text === 'string' ? text : typeof html === 'string' ? html.replace(/<[^>]+>/g, ' ') : undefined
      await sendEmail({ from: process.env.CONTACT_FROM, to, subject: subject || 'Portfolio CMS', text: content })
    },
  }),
  graphQL: { disable: true },
  secret: process.env.PAYLOAD_SECRET ?? '',
  serverURL: process.env.SITE_URL || undefined,
  typescript: { outputFile: path.join(directory, 'payload-types.ts') },
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL }, push: false, migrationDir: path.join(directory, 'migrations') }),
  sharp,
  upload: { limits: { fileSize: 64 * 1024 * 1024 }, abortOnLimit: true },
  plugins: s3 ? [s3Storage({
    bucket: S3_BUCKET,
    collections: { media: true },
    config: {
      region: S3_REGION,
      endpoint: S3_ENDPOINT || undefined,
      forcePathStyle: !!S3_ENDPOINT,
      credentials: { accessKeyId: S3_ACCESS_KEY_ID, secretAccessKey: S3_SECRET_ACCESS_KEY },
    },
  })] : [],
})
