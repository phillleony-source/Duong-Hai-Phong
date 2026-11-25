import type { Locale } from './i18n'

export type EditorialSiteCopy = {
  name: string
  shortName: string
  copyright: string
  establishedYear: string
  workEyebrow: string
  workHeading: string
  workAction: string
  footerLead: string
  footerHeading: string
  footerAction: string
  footerTagline: string
  footerDescription: string
}

export type EditorialContactCopy = {
  eyebrow: string
  heading: string
  description: string
  submitLabel: string
  googleMapsUrl: string
  studioAddress: string
}

export const editorialCopy = {
  vi: {
    about: {
      subtitle: 'NGƯỜI ĐẰNG SAU ỐNG KÍNH',
      heading: 'Xin chào, mình là Dương Hải Phong.',
      featuredStatement: 'Mình tin rằng một bức ảnh đẹp không chỉ nằm ở những gì chúng ta nhìn thấy, mà còn ở cảm xúc mà nó để lại.',
      editorialBody: [
        'Với mình, nhiếp ảnh là cách quan sát thế giới, khám phá cá tính của mỗi con người và kể lại những câu chuyện bằng ánh sáng, bố cục và cảm xúc.',
        'Mình yêu những khoảnh khắc tự nhiên, những biểu cảm chân thật và cả những chi tiết nhỏ đôi khi bị bỏ qua. Chính những điều ấy tạo nên chiều sâu và sự khác biệt cho mỗi khung hình.',
        'Từ chân dung cá nhân, thời trang đến những dự án hình ảnh mang tính thương mại, mình luôn tìm kiếm sự cân bằng giữa tính thẩm mỹ, bản sắc riêng và câu chuyện phía sau mỗi ý tưởng.',
        'Mỗi dự án là một cơ hội để gặp gỡ những con người mới, khám phá một góc nhìn khác và tạo nên những hình ảnh có giá trị vượt ra ngoài khoảnh khắc được chụp.',
      ].join('\n\n'),
      closingStatement: 'Không chỉ là một bức ảnh. Mà là một câu chuyện đáng được ghi nhớ.',
      cta: { label: 'Cùng tạo nên một câu chuyện', href: '#contact' },
    },
    site: {
      name: 'Dương Hải Phong', shortName: 'DHP', copyright: 'DHP Photos', establishedYear: '2016',
      workEyebrow: '04 / DỰ ÁN CHỌN LỌC', workHeading: 'Những câu chuyện qua ống kính', workAction: 'Khám phá tất cả dự án',
      footerLead: 'Bạn có một câu chuyện muốn kể?', footerHeading: 'Cùng tạo nên điều đáng nhớ.',
      footerAction: 'Bắt đầu dự án', footerTagline: 'Nhiếp ảnh & Kể chuyện bằng hình ảnh',
      footerDescription: 'Chân dung, thời trang và những câu chuyện được kể bằng hình ảnh.',
    },
    contact: {
      eyebrow: 'Thông tin liên hệ', heading: 'Thông tin liên hệ cơ bản',
      description: 'Gửi nhanh thông tin để DHP Photos lưu lại hồ sơ khách hàng, tư vấn đúng concept bạn đang quan tâm và chủ động liên hệ lại khi phù hợp.',
      submitLabel: 'Tư vấn ngay',
      googleMapsUrl: 'https://maps.google.com',
      studioAddress: 'Địa chỉ được thể hiện qua Google Maps',
    },
    announcement: {
      highlight: 'THÔNG BÁO',
      text: 'Nhận đặt lịch chụp ảnh cưới & editorial mùa mới · Giảm 10% khi đặt trước qua website · Liên hệ ngay',
      link: '#contact',
      speed: 25,
    },
    process: {
      eyebrow: '03 / QUY TRÌNH',
      heading: 'Quy trình làm việc',
      description: '5 bước thực hiện dự án chuyên nghiệp, chỉn chu từ ý tưởng sơ khởi đến tác phẩm hoàn thiện.',
      steps: [
        {
          stepNumber: '01',
          title: 'Tiếp nhận & Lắng nghe',
          subtitle: 'Tìm hiểu mong muốn & câu chuyện',
          description: 'Trao đổi chi tiết về ý tưởng, phong cách hình ảnh mong muốn, cảm xúc muốn truyền tải và mục tiêu cụ thể của buổi chụp.',
        },
        {
          stepNumber: '02',
          title: 'Moodboard & Định hình',
          subtitle: 'Chuẩn hóa phong cách & thẩm mỹ',
          description: 'Xây dựng moodboard trực quan, lựa chọn bảng màu, gợi ý trang phục, đạo cụ, bối cảnh và bố cục ánh sáng phù hợp nhất.',
        },
        {
          stepNumber: '03',
          title: 'Thực hiện buổi chụp',
          subtitle: 'Nắm bắt khoảnh khắc chân thực',
          description: 'Tạo không gian thoải mái, tự nhiên để nhân vật tự do thể hiện cá tính. Dương Hải Phong tỉ mỉ trau chuốt từng góc máy và đường sáng.',
        },
        {
          stepNumber: '04',
          title: 'Tuyển chọn & Hậu kỳ',
          subtitle: 'Nâng tầm thẩm mỹ từng khung hình',
          description: 'Cùng khách hàng chọn lọc những khung hình đắt giá nhất. Hậu kỳ màu sắc và chi tiết theo phong cách điện ảnh cao cấp.',
        },
        {
          stepNumber: '05',
          title: 'Bàn giao & Lưu giữ',
          subtitle: 'Trọn vẹn chất lượng & cảm xúc',
          description: 'Bàn giao trọn bộ ảnh số độ phân giải cao và các phiên bản tối ưu cho web/in ấn, sẵn sàng kể lại câu chuyện của bạn.',
        },
      ],
    },
  },
  en: {
    about: {
      subtitle: 'BEHIND THE LENS', heading: "Hello, I'm Duong Hai Phong.",
      featuredStatement: 'I believe a meaningful photograph is not only about what we see, but also about what it makes us feel.',
      editorialBody: [
        'For me, photography is a way of observing the world, exploring individuality, and telling stories through light, composition, and emotion.',
        "I'm drawn to natural moments, honest expressions, and the subtle details that often go unnoticed. These are the elements that give an image its depth, character, and lasting impression.",
        'From personal portraits and fashion editorials to commercial visual projects, my approach is rooted in finding the balance between aesthetic intention, individual identity, and the story behind every concept.',
        'Each project is an opportunity to connect with new people, discover a different perspective, and create imagery that holds meaning beyond the moment it was captured.',
      ].join('\n\n'),
      closingStatement: 'More than a photograph. A story worth remembering.',
      cta: { label: "Let's Create a Story", href: '#contact' },
    },
    site: {
      name: 'Duong Hai Phong', shortName: 'DHP', copyright: 'DHP Photos', establishedYear: '2016',
      workEyebrow: '04 / SELECTED WORKS', workHeading: 'Stories Through My Lens', workAction: 'Explore All Projects',
      footerLead: 'Have a Story to Tell?', footerHeading: "Let's Make It Unforgettable.",
      footerAction: 'Start a Project', footerTagline: 'Photography & Visual Storytelling',
      footerDescription: 'Portraits, fashion, and stories told through imagery.',
    },
    contact: {
      eyebrow: 'Contact Information', heading: 'Basic Contact Information',
      description: 'Send quick details so DHP Photos can prepare your client file, consult on your desired concept, and get back to you promptly.',
      submitLabel: 'Consult Now',
      googleMapsUrl: 'https://maps.google.com',
      studioAddress: 'Address shown via Google Maps',
    },
    announcement: {
      highlight: 'ANNOUNCEMENT',
      text: 'Now booking 2026 wedding & editorial sessions · 10% off early bookings via website · Get in touch',
      link: '#contact',
      speed: 25,
    },
    process: {
      eyebrow: '03 / WORKFLOW',
      heading: 'Working Process',
      description: 'A 5-step collaborative photography process, thoughtful from initial concept to final frame.',
      steps: [
        {
          stepNumber: '01',
          title: 'Discovery & Consultation',
          subtitle: 'Understanding your vision & story',
          description: 'An in-depth conversation about your creative direction, desired mood, emotional tone, and goals for the session.',
        },
        {
          stepNumber: '02',
          title: 'Concept & Moodboard',
          subtitle: 'Visual identity & aesthetic direction',
          description: 'Crafting a tailored moodboard with color palettes, styling guidance, locations, props, and custom lighting schemes.',
        },
        {
          stepNumber: '03',
          title: 'The Photoshoot Session',
          subtitle: 'Capturing authentic moments',
          description: 'A relaxed, collaborative environment where individuality shines. Every camera angle and light beam is thoughtfully directed.',
        },
        {
          stepNumber: '04',
          title: 'Selection & Retouching',
          subtitle: 'Elevating visual craftsmanship',
          description: 'Curating the contact sheets together to select the hero shots. Expert cinematic color grading and editorial retouching.',
        },
        {
          stepNumber: '05',
          title: 'Final Delivery & Archiving',
          subtitle: 'Timeless imagery in hand',
          description: 'Delivering full-resolution gallery assets and web-optimized deliverables, crafted to preserve your story with lasting clarity.',
        },
      ],
    },
  },
} as const

// Identify only the fixtures shipped before V2. Customized values keep precedence.
export const previousDemo = {
  vi: {
    about: { heading: 'Xin chào, mình là Beng.', subtitle: 'NGƯỜI SAU ỐNG KÍNH', description: 'Mình tìm kiếm những khoảnh khắc tự nhiên giữa ánh sáng và chuyển động. Mỗi buổi chụp là một cách lắng nghe con người, không gian và câu chuyện trước ống kính.', action: 'Cùng lên ý tưởng' },
    workHeading: 'Dự án chọn lọc',
    tagline: 'Chân dung, thời trang và những câu chuyện qua ống kính.',
    contact: { heading: 'Cùng tạo nên những điều đẹp đẽ.', description: 'Chia sẻ ý tưởng, lịch chụp hoặc câu chuyện bạn muốn kể.' },
  },
  en: {
    about: { heading: 'Hello, I’m Beng.', subtitle: 'BEHIND THE LENS', description: 'I look for the unguarded moments between light and movement. Every shoot is a chance to pay close attention to the people, spaces and stories in front of the lens.', action: 'Let’s talk about your project' },
    workHeading: 'Selected Work',
    tagline: 'Portraits, fashion and stories told through light.',
    contact: { heading: 'Let’s create something beautiful.', description: 'Tell me what you have in mind, when you’d like to shoot, or what story you want to tell.' },
  },
} satisfies Record<Locale, Record<string, unknown>>
