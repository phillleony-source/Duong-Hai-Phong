export function safeHref(value?: string | null, internal = true) {
  if (!value || /[\x00-\x20\x7f\\]/.test(value)) return undefined
  if (internal && (/^#[a-z][\w-]*$/i.test(value) || /^\/(?!\/)/.test(value))) return value
  try {
    const url = new URL(value)
    if (url.protocol === 'https:' && !url.username && !url.password) return url.href
    if (url.protocol === 'mailto:' && /^[^?\s@]+@[^?\s@]+\.[^?\s@]+$/.test(url.pathname) && !url.search && !url.hash) return url.href
    if (url.protocol === 'tel:' && /^\+?[\d()-]+$/.test(url.pathname) && !url.search && !url.hash) return url.href
  } catch {
    return undefined
  }
}

export function videoEmbed(value?: string | null) {
  const href = safeHref(value, false)
  if (!href) return undefined
  const url = new URL(href)
  if (url.protocol !== 'https:') return undefined
  const youtube = url.hostname === 'youtu.be' ? url.pathname.slice(1)
    : ['www.youtube.com', 'youtube.com'].includes(url.hostname) && url.pathname === '/watch'
      ? url.searchParams.get('v') : null
  if (youtube && /^[\w-]{11}$/.test(youtube)) return `https://www.youtube-nocookie.com/embed/${youtube}`
  if (['vimeo.com', 'www.vimeo.com'].includes(url.hostname) && /^\/\d+$/.test(url.pathname)) {
    return `https://player.vimeo.com/video${url.pathname}?dnt=1`
  }
}
