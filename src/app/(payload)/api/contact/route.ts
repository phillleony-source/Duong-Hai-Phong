import { createHmac } from 'node:crypto'
import { isIP } from 'node:net'
import { cms, demoMode } from '@/lib/content'
import { readContactBody } from '@/lib/contact'
import { sendEmail } from '@/lib/email'

const response = (status: number, notification?: 'sent' | 'failed' | 'unavailable') => Response.json({ received: status === 201, notification }, {
  status, headers: { 'Cache-Control': 'no-store', ...(status === 429 ? { 'Retry-After': '600' } : {}) },
})

export async function POST(request: Request) {
  if (demoMode()) return response(503)
  const origin = request.headers.get('origin')
  if (origin !== new URL(process.env.SITE_URL || request.url).origin) return response(403)
  const parsed = await readContactBody(request)
  if (!parsed?.success) return response(400)
  const { name, email, phone, facebookUrl, service, projectDate, budgetRange, message, consent } = parsed.data
  try {
    const payload = await cms()
    const settings = await payload.findGlobal({ slug: 'contact-settings', depth: 0, overrideAccess: true })
    if (!settings.visible || !settings.formVisible) return response(404)
    const ipHeader = process.env.CONTACT_IP_HEADER
    const ip = ipHeader ? request.headers.get(ipHeader)?.trim() : undefined
    const key = ip && isIP(ip) ? createHmac('sha256', payload.secret).update(ip).digest('hex') : 'shared'
    const bucket = Math.floor(Date.now() / 600_000)
    const db = payload.db.pool
    await db.query('DELETE FROM portfolio_contact_limits WHERE bucket < $1', [bucket - 144])
    const result = await db.query<{ attempts: number }>(`
      INSERT INTO portfolio_contact_limits (bucket, key, attempts) VALUES ($1, $2, 1)
      ON CONFLICT (bucket, key) DO UPDATE SET attempts = portfolio_contact_limits.attempts + 1
      WHERE portfolio_contact_limits.attempts < $3
      RETURNING attempts
    `, [bucket, key, key === 'shared' ? 30 : 5])
    if (!result.rowCount) return response(429)
    const selection = service ? await payload.findByID({
      collection: 'services', id: Number(service), overrideAccess: false, draft: false, depth: 0, disableErrors: true,
    }) : null
    if (service && !selection) return response(400)
    const canNotify = settings.recipient && process.env.RESEND_API_KEY && process.env.CONTACT_FROM
    const submission = await payload.create({
      collection: 'contact-submissions', overrideAccess: true,
      data: {
        name,
        email: email || undefined,
        phone: phone || '',
        facebookUrl: facebookUrl || undefined,
        service: selection?.id,
        consent: consent === true || consent === 'on' || consent === 'true',
        message: message || undefined,
        delivery: canNotify ? 'pending' : 'disabled',
        projectDate: projectDate ? projectDate + 'T00:00:00.000Z' : undefined,
        budgetRange: budgetRange || undefined,
      },
    })
    let notification: 'sent' | 'failed' | 'unavailable' = 'unavailable'
    if (settings.recipient && process.env.RESEND_API_KEY && process.env.CONTACT_FROM) {
      let delivery: 'sent' | 'failed' = 'sent'
      try {
        await sendEmail({
          from: process.env.CONTACT_FROM, to: settings.recipient, replyTo: email,
          subject: 'New portfolio inquiry',
          text: [name, email, phone, facebookUrl && `Facebook: ${facebookUrl}`, selection?.title, projectDate && `Date: ${projectDate}`, budgetRange && `Budget: ${budgetRange}`, '', message].filter(value => value !== undefined).join('\n'),
        })
      } catch {
        delivery = 'failed'
        payload.logger.warn({ submissionID: submission.id }, 'Contact notification failed.')
      }
      await payload.update({ collection: 'contact-submissions', id: submission.id, data: { delivery } }).catch(() => {
        payload.logger.warn({ submissionID: submission.id }, 'Could not update notification status.')
      })
      notification = delivery
    }
    return response(201, notification)
  } catch {
    return response(503)
  }
}
