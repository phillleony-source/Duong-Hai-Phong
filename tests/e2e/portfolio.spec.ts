import { expect, test, type APIRequestContext } from '@playwright/test'

const adminEmail = process.env.E2E_ADMIN_EMAIL
const adminPassword = process.env.E2E_ADMIN_PASSWORD
const origin = process.env.E2E_BASE_URL || 'http://127.0.0.1:3000'
const canWrite = process.env.E2E_WRITE === 'true' && !!adminEmail && !!adminPassword

async function auth(request: APIRequestContext, email?: string, password?: string) {
  const result = await request.post('/api/users/login', { data: { email, password } })
  expect(result.ok()).toBeTruthy()
  return { Authorization: 'JWT ' + (await result.json()).token as string }
}

test('English, Vietnamese, carousel, responsive navigation, and localized metadata', async ({ page }) => {
  await page.goto('/en')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('The art of seeing')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('link[rel=alternate][hreflang=vi]')).toHaveAttribute('href', /\/vi$/)
  await expect(page.locator('.hero-media img')).toHaveJSProperty('complete', true)
  expect(await page.locator('.hero-media img').evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0)

  for (const width of [320, 375, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 850 })
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth), { message: `overflow at ${width}px` }).toBeLessThanOrEqual(width)
  }
  await page.setViewportSize({ width: 390, height: 844 })
  const menu = page.locator('button[aria-controls=navigation]')
  await page.getByRole('button', { name: 'Menu' }).click()
  await expect(menu).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press('Escape')
  await expect(menu).toHaveAttribute('aria-expanded', 'false')
  await expect(menu).toBeFocused()
  const dock = page.getByRole('button', { name: 'Social links' })
  await dock.click()
  const socialMenu = page.locator('#social-dock-links')
  for (const platform of ['Facebook', 'Instagram', 'TikTok', 'Zalo']) {
    await expect(socialMenu.getByRole('button', { name: `${platform} · Link not configured` })).toBeDisabled()
  }
  await page.getByRole('heading', { level: 1 }).click()
  await expect(dock).toHaveAttribute('aria-expanded', 'false')
  await dock.click()
  await page.keyboard.press('Escape')
  await expect(dock).toHaveAttribute('aria-expanded', 'false')

  await page.getByRole('link', { name: 'Tiếng Việt' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'vi')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('một góc nhìn khác.')
  expect(await page.evaluate(async () => {
    await document.fonts.ready
    return document.fonts.check('16px "Be Vietnam Pro"', 'Đường nét, ánh sáng và cảm xúc') &&
      document.fonts.check('16px "Playfair Display Variable"', 'Nghệ thuật lưu giữ khoảnh khắc')
  })).toBeTruthy()
  const next = page.locator('#services').getByRole('button', { name: 'Sau', exact: true })
  await expect(next).toBeEnabled()
  const carouselControl = await next.boundingBox()
  const mobileDock = await page.getByRole('button', { name: 'Mạng xã hội' }).boundingBox()
  expect(carouselControl && mobileDock && carouselControl.x + carouselControl.width <= mobileDock.x).toBe(true)
  await next.click()
  await expect(page.locator('#services').getByRole('button', { name: 'Trước', exact: true })).toBeEnabled()
  await expect(page.getByRole('heading', { name: 'Xin chào, mình là Beng.' })).toBeVisible()
  for (const width of [320, 375, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 850 })
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth), { message: `Vietnamese overflow at ${width}px` }).toBeLessThanOrEqual(width)
  }
  await page.goto('/')
  await expect(page).toHaveURL(/\/vi$/)
})

test('service and article detail, alternate locale, and an unknown slug', async ({ page, request }) => {
  await page.goto('/en/services/portrait')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Portrait')
  await expect(page.locator('.social-dock')).toHaveCount(1)
  await page.getByRole('link', { name: 'Tiếng Việt' }).click()
  await expect(page).toHaveURL(/\/vi\/services\/portrait$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Chân dung')
  await page.goto('/en/case-studies/between-takes')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Between Takes')
  await expect(page.locator('.social-dock')).toHaveCount(1)
  await expect(page.locator('article figure img')).toBeVisible()
  expect((await request.get('/en/services/absent-portfolio-entry')).status()).toBe(404)
  await page.goto('/vi/services/absent-portfolio-entry')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Không tìm thấy trang')
})

test('admin sign-in, invalid password, and private endpoint authorization', async ({ page, request }) => {
  test.skip(!canWrite, 'Run on an isolated seeded CMS with E2E_WRITE and admin credentials.')
  const guestSubmissions = await request.get('/api/contact-submissions')
  expect(guestSubmissions.status()).toBeGreaterThanOrEqual(400)
  const denied = await request.post('/api/users/login', { data: { email: adminEmail, password: 'incorrect-password' } })
  expect(denied.status()).toBeGreaterThanOrEqual(400)
  const guestCreate = await request.post('/api/users', { data: { email: 'guest@example.test', password: 'invalid-guest-secret-0123', role: 'admin' } })
  expect(guestCreate.status()).toBeGreaterThanOrEqual(400)

  await page.goto('/admin/login')
  await page.locator('input[type=email]').fill(adminEmail!)
  await page.locator('input[type=password]').fill(adminPassword!)
  await page.getByRole('button', { name: 'Login' }).click()
  await expect(page).toHaveURL(/\/admin\/?$/)
  await expect(page.getByRole('link', { name: 'Services', exact: true })).toBeVisible()
})

test('CMS role permissions, upload, editorial publishing, category protection, and social CRUD', async ({ request }) => {
  test.skip(!canWrite, 'Run on an isolated seeded CMS with E2E_WRITE and admin credentials.')
  const headers = await auth(request, adminEmail, adminPassword)
  const run = Date.now()
  const slug = 'qa-' + run
  const editorInfo = { email: `editor-${run}@example.test`, password: 'editor-test-only-123456', role: 'editor' }
  const cleanup: string[] = []
  async function create(collection: string, data: Record<string, unknown>) {
    const result = await request.post('/api/' + collection, { headers, data })
    expect(result.ok(), await result.text()).toBeTruthy()
    const { doc } = await result.json()
    cleanup.unshift(`/api/${collection}/${doc.id}`)
    return Number(doc.id)
  }
  try {
    await create('users', editorInfo)
    const editor = await auth(request, editorInfo.email, editorInfo.password)
    expect((await request.get('/api/contact-submissions', { headers: editor })).ok()).toBeFalsy()
    expect((await request.post('/api/globals/site-settings', { headers: editor, data: { name: 'Unauthorized' } })).status()).toBe(403)

    const media = await request.post('/api/media', { headers, multipart: {
      file: { name: slug + '.webp', mimeType: 'image/webp', buffer: await (await import('node:fs/promises')).readFile('public/portfolio/about.webp') },
      _payload: JSON.stringify({ alt: 'QA image' }),
    } })
    expect(media.ok(), await media.text()).toBeTruthy()
    const cover = (await media.json()).doc.id

    const category = await create('service-categories', { name: 'QA service category', slug, visible: true })
    const service = await create('services', { title: 'QA service', slug, category, cover, _status: 'published' })
    expect((await request.patch(`/api/services/${service}`, { headers: editor, data: { title: 'QA service revised' } })).ok()).toBeTruthy()
    const protectedCategory = await request.delete(`/api/service-categories/${category}`, { headers })
    expect(protectedCategory.status()).toBe(409)
    expect((await request.get('/en/services/' + slug)).ok()).toBeTruthy()
    expect((await request.delete(`/api/services/${service}`, { headers })).ok()).toBeTruthy()
    expect((await request.get('/en/services/' + slug)).status()).toBe(404)

    const caseCategory = await create('case-categories', { name: 'QA editorial category', slug })
    const lexical = {
      root: {
        type: 'root', direction: null, format: '', indent: 0, version: 1,
        children: [{
          type: 'paragraph', direction: null, format: '', indent: 0, version: 1,
          children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'QA Lexical paragraph', version: 1 }],
        }],
      },
    }
    const article = await create('case-studies', {
      title: 'QA editorial', slug, category: caseCategory, cover, _status: 'draft',
      content: [
        { blockType: 'richText', body: lexical },
        { blockType: 'singleImage', image: cover, caption: 'QA still' },
        { blockType: 'fullWidthImage', image: cover, caption: 'QA wide still' },
        { blockType: 'twoColumnImages', left: cover, right: cover, caption: 'QA diptych' },
        { blockType: 'imageGallery', images: [cover], caption: 'QA gallery' },
        { blockType: 'quote', quote: 'QA quotation', attribution: 'QA attribution' },
        { blockType: 'videoEmbed', url: 'https://vimeo.com/12345' },
        { blockType: 'divider' },
        { blockType: 'spacer', size: 'large' },
      ],
    })
    expect((await request.get('/en/case-studies/' + slug, { headers: { Authorization: '' } })).status()).toBe(404)
    const preview = await request.get(`/en/preview/case-studies/${article}`, { headers })
    expect(preview.ok()).toBeTruthy()
    expect((await request.patch(`/api/case-studies/${article}`, { headers, data: { _status: 'published' } })).ok()).toBeTruthy()
    const published = await request.get('/en/case-studies/' + slug)
    expect(published.ok()).toBeTruthy()
    const html = await published.text()
    for (const content of [
      'QA Lexical paragraph', 'QA still', 'QA wide still', 'QA diptych', 'QA gallery',
      'QA quotation', 'player.vimeo.com/video/12345', '<hr', 'class="spacer-large"',
    ]) expect(html).toContain(content)

    const social = await create('social-links', { platform: 'tiktok', icon: 'tiktok', label: 'QA link', href: 'https://example.com', sortOrder: 60 })
    const socialUpdate = await request.patch(`/api/social-links/${social}`, { headers, data: { label: 'QA revised link' } })
    expect(socialUpdate.ok()).toBeTruthy()
    expect((await socialUpdate.json()).doc.label).toBe('QA revised link')
    expect(await (await request.get('/en')).text()).toMatch(/<a(?=[^>]*class="social-item")(?=[^>]*href="https:\/\/example\.com\/")(?=[^>]*aria-label="QA revised link")/)
    expect((await request.delete(`/api/social-links/${social}`, { headers })).ok()).toBeTruthy()
  } finally {
    for (const target of cleanup) await request.delete(target, { headers })
  }
})

test('contact form persists an inquiry and rejects malformed requests', async ({ page, request }) => {
  test.skip(!canWrite, 'Run on an isolated seeded CMS with E2E_WRITE and admin credentials.')
  const invalid = await request.post('/api/contact', { headers: { origin }, data: { name: 'Spam' } })
  expect(invalid.status()).toBe(400)
  const crossOrigin = await request.post('/api/contact', { headers: { origin: 'https://example.com' }, data: {} })
  expect(crossOrigin.status()).toBe(403)
  await page.goto('/en#contact')
  const email = `inquiry-${Date.now()}@example.test`
  const submit = page.getByRole('button', { name: 'Send Your Message' })
  await submit.click()
  await expect(page.getByRole('textbox', { name: 'Full name' })).toBeFocused()
  await expect(page.getByRole('textbox', { name: 'Full name' })).toHaveAttribute('aria-invalid', 'true')
  await page.getByLabel('Full name').fill('QA Portfolio')
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill(email)
  await page.getByLabel('Interested service').selectOption({ label: 'Portrait' })
  await page.getByLabel('Preferred project date').fill('2027-02-12')
  await page.getByLabel('Budget range').selectOption('5m-to-under-15m')
  await page.getByLabel('Tell me about your project').fill('This is a temporary integration test inquiry.')
  await submit.click()
  await expect(page.getByRole('status')).toHaveText('Your inquiry has been received.')
  await expect(page.getByText('Email notifications are currently unavailable.')).toBeVisible()
  const headers = await auth(request, adminEmail, adminPassword)
  const stored = await request.get('/api/contact-submissions', { headers, params: { 'where[email][equals]': email } })
  expect(stored.ok()).toBeTruthy()
  const { docs } = await stored.json()
  expect(docs).toHaveLength(1)
  expect(docs[0].delivery).toBe('disabled')
  expect(docs[0].projectDate).toBe('2027-02-12T00:00:00.000Z')
  expect(docs[0].budgetRange).toBe('5m-to-under-15m')
  expect(docs[0].status).toBe('new')
  await request.delete('/api/contact-submissions/' + docs[0].id, { headers })
})

test('editorial defaults, featured project carousel, catalog and footer CTA', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/vi')
  await expect(page.locator('#about .about-body > p')).toHaveCount(4)
  await expect(page.locator('#about .about-statement')).toContainText('Mình tin rằng một bức ảnh đẹp')
  const cards = page.locator('#work .work-card')
  await expect(cards).toHaveCount(3)
  const carousel = page.locator('#work').getByRole('region', { name: 'Dự án', exact: true })
  const previous = carousel.getByRole('button', { name: 'Trước', exact: true })
  await expect(previous).toBeDisabled()
  await carousel.getByRole('button', { name: 'Sau', exact: true }).click()
  await expect(previous).toBeEnabled()
  expect((await cards.nth(0).boundingBox())?.y).toBe((await cards.nth(2).boundingBox())?.y)
  await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Bắt đầu dự án' })).toHaveAttribute('href', '/vi#contact')
  await expect(page.getByRole('contentinfo').getByText('studio@example.com')).toHaveCount(0)
  await expect(page.getByRole('contentinfo')).toContainText('Chân dung, thời trang và những câu chuyện được kể bằng hình ảnh.')
  await page.getByRole('link', { name: 'Khám phá tất cả dự án' }).click()
  await expect(page).toHaveURL(/\/vi\/case-studies$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Những câu chuyện qua ống kính')
  await expect(page.locator('.work-grid .work-card')).toHaveCount(3)
  await page.getByRole('link', { name: 'English' }).click()
  await expect(page).toHaveURL(/\/en\/case-studies$/)
})

test('localized About overrides remain editable and published in Payload', async ({ request, page }) => {
  test.skip(!canWrite, 'Run on an isolated seeded CMS with E2E_WRITE and admin credentials.')
  const headers = await auth(request, adminEmail, adminPassword)
  const settings = await (await request.get('/api/globals/site-settings', { headers })).json()
  expect(settings.isDemo).toBe(true)
  const target = '/api/globals/about?locale=vi&fallback-locale=none'
  const before = await (await request.get(target, { headers })).json()
  const statement = 'Lời dẫn biên tập được cập nhật trong Payload.'
  try {
    expect((await request.post(target, { headers, data: { featuredStatement: statement } })).ok()).toBeTruthy()
    await page.goto('/vi#about')
    await expect(page.locator('#about .about-statement')).toHaveText(statement)
    await page.goto('/en#about')
    await expect(page.locator('#about .about-statement')).not.toHaveText(statement)
  } finally {
    expect((await request.post(target, { headers, data: { featuredStatement: before.featuredStatement ?? null } })).ok()).toBeTruthy()
  }
})

test('hero keeps the image visible when the configured video fails', async ({ page, request }) => {
  test.skip(!canWrite, 'Run on an isolated seeded CMS with E2E_WRITE and admin credentials.')
  const headers = await auth(request, adminEmail, adminPassword)
  const hero = await (await request.get('/api/globals/hero?depth=0', { headers })).json()
  await page.goto('/en')
  const frames = await page.evaluate(async () => {
    const canvas = document.createElement('canvas')
    canvas.width = 48
    canvas.height = 48
    const context = canvas.getContext('2d')!
    const stream = canvas.captureStream(10)
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' })
    const chunks: Blob[] = []
    const done = new Promise<number[]>(resolve => {
      recorder.ondataavailable = event => chunks.push(event.data)
      recorder.onstop = async () => resolve(Array.from(new Uint8Array(await new Blob(chunks).arrayBuffer())))
    })
    recorder.start()
    context.fillRect(0, 0, 48, 48)
    await new Promise(resolve => setTimeout(resolve, 150))
    recorder.stop()
    stream.getTracks().forEach(track => track.stop())
    return done
  })
  const fileName = 'qa-fallback-' + Date.now() + '.webm'
  const upload = await request.post('/api/media', { headers, multipart: {
    file: { name: fileName, mimeType: 'video/webm', buffer: Buffer.from(frames) },
    _payload: JSON.stringify({ alt: 'QA video' }),
  } })
  expect(upload.ok(), await upload.text()).toBeTruthy()
  const { doc } = await upload.json()
  const settings = '/api/globals/hero'
  try {
    const update = await request.post(settings, { headers, data: { mediaType: 'video', desktopVideo: doc.id } })
    expect(update.ok(), await update.text()).toBeTruthy()
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.route('**/' + fileName, route => route.abort())
    const failed = page.waitForEvent('requestfailed', { predicate: req => req.url().endsWith(fileName) })
    await page.reload()
    await failed
    await expect(page.locator('.hero-media video')).toHaveCount(0)
    await expect(page.locator('.hero-media img')).toBeVisible()
    expect(await page.locator('.hero-media img').evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('The art of seeing')
  } finally {
    await request.post(settings, { headers, data: { mediaType: hero.mediaType, desktopVideo: hero.desktopVideo ?? null } })
  }
})

test('sitemap and robots publish both locales and exclude administration', async ({ request }) => {
  test.skip(!canWrite, 'Run on an isolated seeded CMS with E2E_WRITE and admin credentials.')
  const headers = await auth(request, adminEmail, adminPassword)
  const settings = '/api/globals/site-settings'
  const before = await (await request.get(settings, { headers })).json()
  try {
    expect((await request.post(settings, { headers, data: { isDemo: false } })).ok()).toBeTruthy()
    const robots = await request.get('/robots.txt')
    expect(robots.ok()).toBeTruthy()
    expect(await robots.text()).toContain('Disallow: /admin')
    const sitemap = await request.get('/sitemap.xml')
    expect(sitemap.ok()).toBeTruthy()
    const xml = await sitemap.text()
    expect(xml).toContain('/en/services/portrait')
    expect(xml).toContain('/vi/case-studies/between-takes')
    expect(xml).not.toContain('/admin')
    expect(xml).not.toContain('/preview')
  } finally {
    await request.post(settings, { headers, data: { isDemo: before.isDemo } })
  }
})

test('persisted rate limiter caps repeated submissions from a trusted client address', async ({ request }) => {
  const ipHeader = process.env.E2E_CONTACT_IP_HEADER
  test.skip(!canWrite || !ipHeader, 'Set E2E_CONTACT_IP_HEADER to the trusted header on an isolated test server.')
  const headers = await auth(request, adminEmail, adminPassword)
  const octets = (await import('node:crypto')).randomBytes(8).toString('hex')
  const ip = '2001:db8::' + octets.match(/.{4}/g)!.join(':')
  const email = `limiter-${octets}@example.test`
  try {
    const results = await Promise.all(Array.from({ length: 6 }, () => request.post('/api/contact', {
      headers: { origin, [ipHeader!]: ip },
      data: { name: 'Rate limit fixture', email, message: 'Temporary data for checking contact rate limits.' },
    })))
    expect(results.map(result => result.status()).sort()).toEqual([201, 201, 201, 201, 201, 429])
    expect(results.find(result => result.status() === 429)?.headers()['retry-after']).toBe('600')
  } finally {
    const response = await request.get('/api/contact-submissions', { headers, params: { 'where[email][equals]': email } })
    const { docs } = await response.json()
    for (const row of docs) await request.delete('/api/contact-submissions/' + row.id, { headers })
  }
})
