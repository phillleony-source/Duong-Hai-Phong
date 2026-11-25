export async function sendEmail({ from, to, subject, text, replyTo }: {
  from: string; to: string | string[]; subject: string; text?: string; replyTo?: string
}) {
  if (!process.env.RESEND_API_KEY) throw new Error('Email delivery is not configured.')
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, text, reply_to: replyTo }),
    signal: AbortSignal.timeout(6000),
  })
  if (!response.ok) throw new Error(`Email provider returned HTTP ${response.status}.`)
}
