import { z } from 'zod'
import { budgetOptions } from './inquiry-options'

const text = (limit: number) => z.string().trim().max(limit).refine(value => !/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(value))
export const contactSchema = z.strictObject({
  name: text(100).refine(value => value.length >= 2 && !/[\r\n]/.test(value)),
  phone: z.string().trim().max(30).regex(/^[+\d\s().-]*$/).optional(),
  email: z.union([z.string().trim().max(254).pipe(z.email()), z.literal('')]).optional(),
  facebookUrl: z.string().trim().max(300).optional(),
  service: z.string().regex(/^(?:[1-9]\d{0,9})?$/).optional(),
  projectDate: z.union([z.iso.date().refine(date => Number(date.slice(0, 4)) >= 1900), z.literal('')]).optional(),
  budgetRange: z.union([z.enum(budgetOptions.map(option => option.value)), z.literal('')]).optional(),
  message: z.union([text(3000).refine(value => value.length >= 10), z.literal('')]).optional(),
  consent: z.union([z.boolean(), z.literal('on'), z.literal('true'), z.literal('')]).optional(),
  website: z.literal('').optional(),
})

export async function readContactBody(request: Request) {
  const byteLimit = 16 * 1024
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json') ||
      Number(request.headers.get('content-length')) > byteLimit || !request.body) return undefined
  const reader = request.body.getReader()
  const decoder = new TextDecoder('utf-8', { fatal: true })
  let length = 0
  let text = ''
  try {
    for (;;) {
      const part = await reader.read()
      if (part.done) break
      length += part.value.byteLength
      if (length > byteLimit) {
        await reader.cancel()
        return undefined
      }
      text += decoder.decode(part.value, { stream: true })
    }
    return contactSchema.safeParse(JSON.parse(text + decoder.decode()))
  } catch {
    await reader.cancel().catch(() => {})
    return undefined
  } finally {
    reader.releaseLock()
  }
}
