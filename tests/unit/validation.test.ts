import { describe, expect, it } from 'vitest'
import { contactSchema, readContactBody } from '../../src/lib/contact'
import { isLocale } from '../../src/lib/i18n'
import { safeHref, videoEmbed } from '../../src/lib/urls'

describe('public input', () => {
  it.each(['javascript:alert(1)', '//example.com', '/\\example.com', 'data:text/html,hello', 'https://name:secret@example.com', 'mailto:owner@example.com?bcc=other@example.com'])(
    'rejects unsafe links %s', href => expect(safeHref(href)).toBeUndefined(),
  )
  it('accepts the intended destination types', () => {
    expect(safeHref('#work')).toBe('#work')
    expect(safeHref('/vi#work')).toBe('/vi#work')
    expect(safeHref('mailto:studio@example.com', false)).toBe('mailto:studio@example.com')
    expect(safeHref('tel:+84123456789', false)).toBe('tel:+84123456789')
  })
  it('constructs embeds only for approved providers', () => {
    expect(videoEmbed('https://youtu.be/dQw4w9WgXcQ')).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ')
    expect(videoEmbed('https://vimeo.com/12345')).toBe('https://player.vimeo.com/video/12345?dnt=1')
    expect(videoEmbed('https://vimeo.com.example.com/12345')).toBeUndefined()
  })
  it('recognizes both supported locale codes', () => {
    expect(['en', 'vi', 'fr'].filter(isLocale)).toEqual(['en', 'vi'])
  })
})

describe('contact validation', () => {
  const inquiry = { name: ' Nguyễn Phương ', email: 'person@example.test', message: 'Tôi muốn đặt lịch chụp chân dung.', service: '123', website: '' }
  it('preserves Vietnamese and trims surrounding whitespace', () => {
    expect(contactSchema.parse(inquiry).name).toBe('Nguyễn Phương')
  })
  it('rejects honeypot hits, mail header injection, invalid service IDs and short messages', () => {
    for (const fields of [{ website: 'spam' }, { email: 'person@example.test\r\na: b' }, { service: '-1' }, { message: 'Hi' }]) {
      expect(contactSchema.safeParse({ ...inquiry, ...fields }).success).toBe(false)
    }
  })
  it('limits streamed request size and rejects malformed JSON', async () => {
    const post = (body: string) => new Request('http://localhost/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
    expect((await readContactBody(post(JSON.stringify(inquiry))))?.success).toBe(true)
    expect(await readContactBody(post('x'.repeat(17000)))).toBeUndefined()
    expect(await readContactBody(post('{'))).toBeUndefined()
  })
  it('accepts optional project details and rejects invalid dates or unknown budget ranges', () => {
    expect(contactSchema.safeParse({ ...inquiry, projectDate: '', budgetRange: '' }).success).toBe(true)
    expect(contactSchema.safeParse({ ...inquiry, projectDate: '2028-02-29', budgetRange: 'to-discuss' }).success).toBe(true)
    expect(contactSchema.safeParse({ ...inquiry, projectDate: '2027-02-29' }).success).toBe(false)
    expect(contactSchema.safeParse({ ...inquiry, budgetRange: 'free text' }).success).toBe(false)
  })
})
