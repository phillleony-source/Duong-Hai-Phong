import type { Locale } from './i18n'
import { editorialCopy } from './editorial-copy'

const images = '/portfolio/'
const image = (name: string, alt: string) => ({ url: images + name + '.webp', alt })
const gallery = {
  hero: image('hero', 'A cook at work in the light of an open kitchen'),
  mobile: image('hero-mobile', 'A cook at work in the light of an open kitchen'),
  about: image('about', 'Cinema camera on a film set'),
  portraits: image('portraits', 'Studio portrait with sculptural lighting'),
  editorial: image('editorial', 'Fashion editorial photograph'),
  commercial: image('commercial', 'Documentary photograph in a working studio'),
  still: image('still', 'Production still from a film set'),
  documentary: image('documentary', 'A documentary moment in an industrial workspace'),
  campaign: image('campaign', 'Portrait from a poster photography session'),
}

export const demoWebsite = (locale: Locale) => {
  const vi = locale === 'vi'
  const copy = editorialCopy[locale]
  return {
    site: {
      ...copy.site,
      name: copy.site.name || 'Dương Hải Phong',
      shortName: copy.site.shortName || 'DHP',
      descriptor: vi ? 'NHIẾP ẢNH' : 'PHOTOGRAPHY',
      tagline: vi ? 'Chân dung, thời trang và những câu chuyện qua ống kính.' : 'Portraits, fashion and stories told through light.',
      copyright: copy.site.copyright || 'DHP Photos',
      establishedYear: copy.site.establishedYear || '2016',
      servicesHeading: vi ? 'Dịch vụ nhiếp ảnh' : 'Photography Services',
      servicesDescription: vi ? 'Từ chân dung cá nhân đến hình ảnh thương hiệu.' : 'From personal portraits to imagery for brands.',
      workDescription: vi ? 'Một số câu chuyện qua ống kính.' : 'Photographs from the studio, the set and the spaces in between.',
      seo: { title: 'Dương Hải Phong - DHP Photos', description: vi ? 'Portfolio nhiếp ảnh chân dung, thời trang và thương mại.' : 'A photography portfolio for portrait, fashion and commercial work.', image: gallery.hero },
    },
    hero: {
      visible: true, eyebrow: vi ? 'CHÂN DUNG / THỜI TRANG / THƯƠNG MẠI' : 'PORTRAIT / FASHION / COMMERCIAL',
      headline: vi ? 'Nghệ thuật của' : 'The art of seeing',
      accent: vi ? 'một góc nhìn khác.' : 'differently.',
      description: vi ? 'Chân dung, thời trang và câu chuyện thương hiệu, kể bằng ánh sáng và cảm xúc.' : 'Portraits, fashion and brand stories, told through light and feeling.',
      primary: { label: vi ? 'Khám phá dự án' : 'Explore my work', href: '#work' },
      secondary: { label: vi ? 'Liên hệ' : 'Get in touch', href: '#contact' },
      mediaType: 'image', desktopImage: gallery.hero, mobileImage: gallery.mobile, fallback: gallery.hero,
      overlay: 48, alignment: 'left', loop: true, sound: false,
    },
    about: {
      visible: true, ...copy.about,
      portrait: gallery.about,
    },
    contact: {
      visible: true, formVisible: true,
      ...copy.contact,
      email: 'studio@example.com',
    },
    announcement: {
      visible: true,
      ...copy.announcement,
    },
    process: {
      visible: true,
      ...copy.process,
    },
    services: [
      { id: 1, slug: 'portrait', title: vi ? 'Chân dung' : 'Portrait', summary: vi ? 'Chân dung cá nhân và chân dung sáng tạo trong studio.' : 'Personal and creative portraits shaped by the person in front of the lens.', category: { name: vi ? 'Chân dung' : 'Portraiture' }, cover: gallery.portraits, gallery: [gallery.about] },
      { id: 2, slug: 'fashion-editorial', title: vi ? 'Thời trang' : 'Fashion Editorial', summary: vi ? 'Hình ảnh cho bộ sưu tập, lookbook và câu chuyện thời trang.' : 'Visual narratives for collections, lookbooks and fashion stories.', category: { name: vi ? 'Thời trang' : 'Fashion' }, cover: gallery.editorial, gallery: [gallery.campaign] },
      { id: 3, slug: 'commercial', title: vi ? 'Hình ảnh thương hiệu' : 'Commercial', summary: vi ? 'Hình ảnh về con người, sản phẩm và nơi tạo ra chúng.' : 'Photography about people, products and the places they’re made.', category: { name: vi ? 'Thương mại' : 'Branding' }, cover: gallery.commercial, gallery: [gallery.documentary] },
    ],
    cases: [
      { id: 1, slug: 'between-takes', title: vi ? 'Giữa những cảnh quay' : 'Between Takes', summary: vi ? 'Những khoảnh khắc hậu trường trên phim trường.' : 'Quiet moments and working gestures photographed on a film set.', category: { name: 'Still / BTS' }, cover: gallery.still, content: [{ blockType: 'fullWidthImage' as const, image: gallery.about }], featured: true },
      { id: 2, slug: 'the-work-of-hands', title: vi ? 'Công việc của đôi tay' : 'The Work of Hands', summary: vi ? 'Một góc nhìn về con người và không gian làm việc.' : 'An editorial study of people and the places they work.', category: { name: vi ? 'Tài liệu' : 'Documentary' }, cover: gallery.documentary, content: [{ blockType: 'singleImage' as const, image: gallery.commercial }], featured: true },
      { id: 3, slug: 'in-the-studio', title: vi ? 'Trong studio' : 'In the Studio', summary: vi ? 'Chân dung thực hiện trong một buổi chụp poster.' : 'Portrait work from a poster photography session.', category: { name: vi ? 'Chân dung' : 'Portraiture' }, cover: gallery.campaign, content: [{ blockType: 'twoColumnImages' as const, left: gallery.portraits, right: gallery.editorial }], featured: true },
    ],
    social: [{ id: 1, platform: 'email' as const, label: 'Email', href: 'mailto:studio@example.com' }],
  }
}
