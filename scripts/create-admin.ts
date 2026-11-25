import { getPayload } from 'payload'
import { z } from 'zod'
import config from '../src/payload.config'

const email = z.email().parse(process.env.INITIAL_ADMIN_EMAIL)
const password = z.string().min(16).max(256).parse(process.env.INITIAL_ADMIN_PASSWORD)
if (!process.env.PAYLOAD_SECRET || !process.env.DATABASE_URL) throw new Error('Set DATABASE_URL and PAYLOAD_SECRET first.')

const payload = await getPayload({ config })
try {
  const lock = await payload.db.pool.connect()
  try {
    await lock.query('SELECT pg_advisory_lock(781230143)')
    if ((await payload.count({ collection: 'users' })).totalDocs) throw new Error('The users collection is already initialized.')
    await payload.create({
      collection: 'users', context: { bootstrapAdmin: true }, data: { email, password, role: 'admin' },
    })
    payload.logger.info('First administrator created. Sign in at /admin.')
  } finally {
    await lock.query('SELECT pg_advisory_unlock(781230143)')
    lock.release()
  }
} finally {
  await payload.destroy()
}
