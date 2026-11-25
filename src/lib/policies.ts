import type { Locale } from './i18n'

export type PolicySlug =
  | 'security-policy'
  | 'privacy-policy'
  | 'terms-of-service'
  | 'cookie-policy'
  | 'image-licensing'

export interface PolicySection {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export interface PolicyDocument {
  slug: PolicySlug
  title: string
  eyebrow: string
  summary: string
  updatedAt: string
  sections: PolicySection[]
}

const policiesByLocale: Record<Locale, Record<PolicySlug, PolicyDocument>> = {
  vi: {
    'security-policy': {
      slug: 'security-policy',
      eyebrow: 'Pháp lý & An toàn dữ liệu',
      title: 'Chính sách bảo mật',
      summary:
        'Cam kết của Dương Hải Phong (DHP Photos) trong việc bảo vệ an toàn thông tin liên hệ, lịch hẹn và dữ liệu hình ảnh của khách hàng.',
      updatedAt: 'Cập nhật lần cuối: 25/11/2026',
      sections: [
        {
          heading: '1. Nguyên tắc bảo mật thông tin',
          paragraphs: [
            'Mọi thông tin khách hàng gửi qua biểu mẫu Đăng ký tư vấn trên website (bao gồm họ tên, số điện thoại, địa chỉ email, liên kết Facebook và mô tả concept) được mã hóa trong quá trình truyền tải qua giao thức HTTPS và lưu trữ an toàn trên hệ thống cơ sở dữ liệu riêng.',
          ],
        },
        {
          heading: '2. Kiểm soát truy cập & Lưu trữ dữ liệu',
          paragraphs: [
            'Dữ liệu tư vấn chỉ được phân quyền truy cập cho quản trị viên và đội ngũ phụ trách sản xuất trực tiếp của DHP Photos để phản hồi báo giá và sắp xếp lịch chụp.',
          ],
          bullets: [
            'Áp dụng cơ chế xác thực phiên đăng nhập và phân quyền quản trị chặt chẽ trong hệ thống CMS.',
            'Giới hạn tần suất gửi yêu cầu (rate limiting) nhằm ngăn chặn spam và truy cập tự động trái phép.',
            'Không bán, trao đổi hoặc chuyển giao dữ liệu khách hàng cho bất kỳ bên thứ ba nào phục vụ mục đích quảng cáo.',
          ],
        },
        {
          heading: '3. Bảo mật tệp ảnh gốc & Sản phẩm bàn giao',
          paragraphs: [
            'Các tệp ảnh gốc (RAW) và ảnh đã qua hậu kỳ được lưu trữ trên hệ thống lưu trữ riêng tư của studio. Đường dẫn tải ảnh hoặc thư viện riêng chỉ được gửi trực tiếp cho khách hàng đặt lịch.',
            'Đối với các buổi chụp mang tính chất riêng tư hoặc có thỏa thuận bảo mật (NDA), DHP Photos cam kết không công bố hình ảnh lên portfolio hay mạng xã hội.',
          ],
        },
        {
          heading: '4. Liên hệ về bảo mật',
          paragraphs: [
            'Nếu bạn phát hiện bất kỳ dấu hiệu truy cập trái phép nào hoặc có câu hỏi liên quan đến an toàn dữ liệu, vui lòng liên hệ trực tiếp qua mục Liên hệ trên trang chủ hoặc các kênh chính thức của Dương Hải Phong.',
          ],
        },
      ],
    },
    'privacy-policy': {
      slug: 'privacy-policy',
      eyebrow: 'Pháp lý & Quyền cá nhân',
      title: 'Chính sách quyền riêng tư',
      summary:
        'Cách DHP Photos thu thập, sử dụng, lưu giữ và tôn trọng quyền kiểm soát thông tin cá nhân của bạn khi truy cập và đặt lịch.',
      updatedAt: 'Cập nhật lần cuối: 25/11/2026',
      sections: [
        {
          heading: '1. Thông tin chúng tôi thu thập',
          paragraphs: [
            'Chúng tôi chỉ thu thập những thông tin tối thiểu mà bạn chủ động cung cấp khi đăng ký tư vấn chụp ảnh:',
          ],
          bullets: [
            'Thông tin bắt buộc: Họ và tên, Số điện thoại liên hệ.',
            'Thông tin tùy chọn: Địa chỉ Email, URL Facebook cá nhân, Thể loại concept quan tâm và Ghi chú chi tiết về buổi chụp.',
            'Xác nhận đồng ý: Sự chấp thuận rõ ràng của bạn trước khi gửi biểu mẫu.',
          ],
        },
        {
          heading: '2. Mục đích sử dụng thông tin',
          paragraphs: [
            'Thông tin của bạn chỉ được sử dụng cho các mục đích chính đáng sau:',
          ],
          bullets: [
            'Liên hệ tư vấn concept, đề xuất gói chụp và gửi báo giá phù hợp.',
            'Xác nhận lịch hẹn, địa điểm, moodboard và điều phối quá trình chụp.',
            'Bàn giao sản phẩm hoàn thiện và hỗ trợ lưu trữ, chỉnh sửa bổ sung sau buổi chụp.',
          ],
        },
        {
          heading: '3. Quyền riêng tư về hình ảnh cá nhân',
          paragraphs: [
            'DHP Photos luôn tôn trọng quyền hình ảnh của mỗi khách hàng. Việc sử dụng ảnh trong portfolio website hoặc trên các kênh mạng xã hội (Facebook, Instagram, Threads, TikTok, Flickr) chỉ được thực hiện khi có sự đồng ý của bạn hoặc theo thỏa thuận trong hợp đồng dịch vụ.',
          ],
        },
        {
          heading: '4. Quyền của bạn đối với dữ liệu cá nhân',
          paragraphs: [
            'Bạn có toàn quyền yêu cầu kiểm tra, cập nhật, đính chính hoặc xóa bỏ thông tin cá nhân và yêu cầu ẩn hình ảnh khỏi các kênh truyền thông của studio bất kỳ lúc nào thông qua mục Liên hệ.',
          ],
        },
      ],
    },
    'terms-of-service': {
      slug: 'terms-of-service',
      eyebrow: 'Quy định hợp tác',
      title: 'Điều khoản dịch vụ',
      summary:
        'Các điều khoản chung về quy trình đặt lịch, thực hiện buổi chụp, bàn giao sản phẩm và trách nhiệm giữa khách hàng và Dương Hải Phong (DHP Photos).',
      updatedAt: 'Cập nhật lần cuối: 25/11/2026',
      sections: [
        {
          heading: '1. Tư vấn & Xác nhận đặt lịch',
          paragraphs: [
            'Mọi yêu cầu qua website là bước đăng ký tư vấn ban đầu. Lịch chụp chính thức chỉ được xác nhận sau khi hai bên thống nhất về concept, thời gian, địa điểm, chi phí và hoàn tất khoản đặt cọc giữ lịch theo thỏa thuận.',
          ],
        },
        {
          heading: '2. Thay đổi lịch & Hủy dịch vụ',
          paragraphs: [
            'Chúng tôi hiểu kế hoạch có thể thay đổi vì lý do khách quan:',
          ],
          bullets: [
            'Khách hàng có thể đề xuất dời lịch trước ngày chụp theo mốc thời gian đã thống nhất khi đặt lịch để được hỗ trợ chuyển lịch linh hoạt.',
            'Trường hợp thời tiết xấu (với buổi chụp ngoại cảnh) hoặc sự kiện bất khả kháng, hai bên sẽ ưu tiên sắp xếp ngày chụp thay thế phù hợp.',
            'Chi phí thuê studio bên thứ ba, trang phục, makeup hoặc đạo cụ phát sinh (nếu có) sẽ tuân theo chính sách của từng đơn vị cung cấp.',
          ],
        },
        {
          heading: '3. Quy trình tuyển chọn & Bàn giao ảnh',
          paragraphs: [
            'Sau buổi chụp, DHP Photos tiến hành lọc ảnh, gửi bản xem trước để khách hàng tuyển chọn (tùy gói dịch vụ) và thực hiện hậu kỳ chỉnh màu, retouch chi tiết theo phong cách đã thống nhất.',
            'Thời gian bàn giao thành phẩm tiêu chuẩn được thông báo cụ thể trong từng báo giá (thông thường từ 5–10 ngày làm việc đối với bộ ảnh cá nhân/editorial và theo tiến độ dự án với chụp thương mại).',
          ],
        },
        {
          heading: '4. Giới hạn trách nhiệm & Bồi hoàn',
          paragraphs: [
            'DHP Photos luôn sao lưu dữ liệu trên nhiều thiết bị để đảm bảo an toàn tuyệt đối cho bộ ảnh. Trong trường hợp sự cố kỹ thuật bất khả kháng làm ảnh hưởng đến buổi chụp hoặc dữ liệu, trách nhiệm tối đa của studio là sắp xếp chụp lại miễn phí hoặc hoàn trả phần chi phí dịch vụ tương ứng chưa thể bàn giao.',
          ],
        },
      ],
    },
    'cookie-policy': {
      slug: 'cookie-policy',
      eyebrow: 'Minh bạch kỹ thuật',
      title: 'Chính sách cookie',
      summary:
        'Thông tin về các cookie và bộ nhớ trình duyệt tối thiểu được sử dụng trên website DHP Photos nhằm duy trì trải nghiệm mượt mà.',
      updatedAt: 'Cập nhật lần cuối: 25/11/2026',
      sections: [
        {
          heading: '1. Cookie là gì?',
          paragraphs: [
            'Cookie là các tệp văn bản nhỏ được trình duyệt lưu tạm trên thiết bị của bạn khi truy cập website, giúp ghi nhớ tùy chọn cơ bản và đảm bảo các chức năng hoạt động ổn định.',
          ],
        },
        {
          heading: '2. Các loại cookie website đang sử dụng',
          paragraphs: [
            'Website DHP Photos hoạt động theo nguyên tắc tối giản dữ liệu và tôn trọng quyền riêng tư:',
          ],
          bullets: [
            'Cookie/lưu trữ thiết yếu cho trải nghiệm: Ghi nhớ tùy chọn ngôn ngữ hiển thị (Tiếng Việt / English) khi bạn chuyển đổi giữa các trang.',
            'Cookie phiên quản trị (chỉ dành cho Admin/Editor): Phục vụ đăng nhập và xác thực bảo mật tại khu vực quản trị nội dung.',
            'Không sử dụng cookie quảng cáo, tiếp thị lại (retargeting) hay theo dõi hành vi từ bên thứ ba.',
          ],
        },
        {
          heading: '3. Cách quản lý hoặc tắt cookie',
          paragraphs: [
            'Bạn có thể xem, xóa hoặc chặn cookie bất kỳ lúc nào trong phần Cài đặt quyền riêng tư của trình duyệt (Chrome, Safari, Edge, Firefox). Lưu ý rằng việc tắt hoàn toàn cookie thiết yếu có thể khiến tùy chọn ngôn ngữ không được ghi nhớ giữa các lần tải trang.',
          ],
        },
      ],
    },
    'image-licensing': {
      slug: 'image-licensing',
      eyebrow: 'Bản quyền & Sở hữu trí tuệ',
      title: 'Cấp phép hình ảnh',
      summary:
        'Quy định về quyền tác giả, phạm vi sử dụng cá nhân và điều kiện cấp phép thương mại đối với toàn bộ hình ảnh thuộc sở hữu của Dương Hải Phong (DHP Photos).',
      updatedAt: 'Cập nhật lần cuối: 25/11/2026',
      sections: [
        {
          heading: '1. Quyền sở hữu & Bản quyền tác giả',
          paragraphs: [
            'Toàn bộ hình ảnh, video, bài viết và bố cục hiển thị trên website thuộc quyền sở hữu trí tuệ của Dương Hải Phong (DHP Photos), được xây dựng và phát triển từ năm 2016.',
            'Mọi hành vi sao chép, tải xuống trái phép hình ảnh từ portfolio để đăng lại dưới tên khác hoặc phục vụ mục đích kinh doanh đều vi phạm quyền tác giả.',
          ],
        },
        {
          heading: '2. Giấy phép sử dụng cá nhân (Personal Use)',
          paragraphs: [
            'Đối với khách hàng sử dụng gói chụp cá nhân, chân dung hoặc kỷ niệm:',
          ],
          bullets: [
            'Được phép lưu trữ, in ấn cho mục đích cá nhân/gia đình và đăng tải trên các trang mạng xã hội cá nhân.',
            'Khuyến khích giữ nguyên chất lượng ảnh, không tự ý cắt ghép làm sai lệch bố cục nghệ thuật hoặc áp bộ lọc màu làm biến dạng sản phẩm gốc của studio.',
            'Khi chia sẻ công khai, vui lòng ghi nhận nguồn ảnh (Credit: Dương Hải Phong / DHP Photos) nếu phù hợp.',
          ],
        },
        {
          heading: '3. Giấy phép sử dụng thương mại (Commercial License)',
          paragraphs: [
            'Đối với thương hiệu, doanh nghiệp, nghệ sĩ hoặc đơn vị truyền thông sử dụng hình ảnh cho quảng cáo, chiến dịch ra mắt sản phẩm, lookbook bán hàng, biển bảng (OOH) hoặc báo chí thương mại:',
          ],
          bullets: [
            'Phạm vi sử dụng (kênh phát hành, khu vực địa lý, thời hạn sử dụng) được quy định rõ trong báo giá hoặc hợp đồng cấp phép riêng.',
            'Việc chuyển nhượng toàn bộ bản quyền (Full Buyout) hoặc mở rộng thời hạn/kênh quảng cáo cần được thỏa thuận bằng văn bản với DHP Photos.',
          ],
        },
        {
          heading: '4. Yêu cầu cấp phép hoặc hợp tác bản quyền',
          paragraphs: [
            'Nếu bạn muốn mua quyền sử dụng hình ảnh có sẵn trong bộ sưu tập của Dương Hải Phong hoặc đặt lịch sản xuất bộ ảnh thương mại mới, vui lòng gửi yêu cầu qua biểu mẫu Liên hệ trên trang chủ.',
          ],
        },
      ],
    },
  },
  en: {
    'security-policy': {
      slug: 'security-policy',
      eyebrow: 'Legal & Data Safety',
      title: 'Data Protection & Security Policy',
      summary:
        'How Dương Hải Phong (DHP Photos) safeguards inquiry records, booking details, and client photography assets.',
      updatedAt: 'Last updated: November 25, 2026',
      sections: [
        {
          heading: '1. Core Security Commitment',
          paragraphs: [
            'All information submitted through the consultation form (name, phone number, email address, Facebook profile URL, and project notes) is transmitted over HTTPS encryption and stored securely in our private database.',
          ],
        },
        {
          heading: '2. Access Control & Safeguards',
          paragraphs: [
            'Inquiry records are accessible only to authorized administrators and production staff at DHP Photos for consultation and scheduling.',
          ],
          bullets: [
            'Role-based authentication and protected session handling within the CMS.',
            'Request rate limiting on public submission endpoints to prevent automated abuse and spam.',
            'Zero sale, rental, or unauthorized disclosure of client contact details to third parties.',
          ],
        },
        {
          heading: '3. Original Files & Client Galleries',
          paragraphs: [
            'RAW files and retouched deliverables are stored privately. Delivery links are shared directly with the commissioning client. For private or NDA shoots, images are never published to our public portfolio or social channels.',
          ],
        },
      ],
    },
    'privacy-policy': {
      slug: 'privacy-policy',
      eyebrow: 'Legal & Personal Rights',
      title: 'Privacy Policy',
      summary:
        'How DHP Photos collects, uses, retains, and respects your personal information when you visit or request a consultation.',
      updatedAt: 'Last updated: November 25, 2026',
      sections: [
        {
          heading: '1. Information We Collect',
          paragraphs: [
            'We collect only the information you voluntarily provide when submitting a consultation request:',
          ],
          bullets: [
            'Required details: Name and phone number.',
            'Optional details: Email address, Facebook URL, preferred concept category, and project message.',
            'Consent confirmation: Explicit agreement prior to form submission.',
          ],
        },
        {
          heading: '2. How We Use Your Information',
          paragraphs: [
            'Your information is used exclusively to respond to your inquiry, prepare creative proposals and quotes, coordinate shoot logistics, and deliver finished photography.',
          ],
        },
        {
          heading: '3. Portrait & Image Privacy',
          paragraphs: [
            'We respect every client’s likeness and privacy. Images are featured in our portfolio or social channels only with client consent or as agreed in the service terms.',
          ],
        },
        {
          heading: '4. Your Rights',
          paragraphs: [
            'You may request access to, correction of, or deletion of your personal contact records at any time through our Contact section.',
          ],
        },
      ],
    },
    'terms-of-service': {
      slug: 'terms-of-service',
      eyebrow: 'Client Agreement',
      title: 'Terms of Service',
      summary:
        'General terms governing booking confirmation, rescheduling, post-production delivery, and responsibilities for DHP Photos commissions.',
      updatedAt: 'Last updated: November 25, 2026',
      sections: [
        {
          heading: '1. Consultation & Booking Confirmation',
          paragraphs: [
            'Submitting the online form initiates a consultation. A shoot date is officially reserved only after concept, schedule, pricing, and booking deposit are mutually confirmed.',
          ],
        },
        {
          heading: '2. Rescheduling & Force Majeure',
          paragraphs: [
            'Rescheduling requests should be communicated ahead of the agreed notice window. In cases of severe weather for outdoor shoots or unforeseen force majeure, both parties will prioritize arranging an alternative shoot date.',
          ],
        },
        {
          heading: '3. Selection & Post-Production Delivery',
          paragraphs: [
            'Following the shoot, DHP Photos curates proofs (where applicable) and performs color grading and detailed retouching aligned with the agreed editorial direction. Standard delivery timelines are specified per commission.',
          ],
        },
        {
          heading: '4. Liability & Data Backup',
          paragraphs: [
            'We maintain redundant backups during and after production. In the unlikely event of technical failure beyond reasonable control, studio liability is limited to a complimentary reshoot or refund of undelivered service fees.',
          ],
        },
      ],
    },
    'cookie-policy': {
      slug: 'cookie-policy',
      eyebrow: 'Technical Transparency',
      title: 'Cookie Policy',
      summary:
        'Details on the minimal essential cookies and browser storage used by DHP Photos.',
      updatedAt: 'Last updated: November 25, 2026',
      sections: [
        {
          heading: '1. What Are Cookies?',
          paragraphs: [
            'Cookies are small text files stored by your browser to preserve essential preferences and ensure reliable site functionality.',
          ],
        },
        {
          heading: '2. Cookies We Use',
          paragraphs: [
            'DHP Photos follows a minimal-data approach:',
          ],
          bullets: [
            'Essential preference storage: Remembers your selected display language (Vietnamese / English).',
            'Admin session cookies: Used strictly for authenticated CMS access by site administrators.',
            'No third-party advertising, retargeting, or cross-site tracking cookies are used.',
          ],
        },
        {
          heading: '3. Managing Cookies',
          paragraphs: [
            'You can clear or disable cookies at any time through your browser privacy settings. Disabling essential cookies may prevent language preferences from persisting across visits.',
          ],
        },
      ],
    },
    'image-licensing': {
      slug: 'image-licensing',
      eyebrow: 'Copyright & Intellectual Property',
      title: 'Image Licensing',
      summary:
        'Copyright ownership, personal use rights, and commercial licensing terms for all photography created by Dương Hải Phong (DHP Photos).',
      updatedAt: 'Last updated: November 25, 2026',
      sections: [
        {
          heading: '1. Copyright Ownership',
          paragraphs: [
            'All photographs, videos, editorial copy, and visual layouts on this website are the intellectual property of Dương Hải Phong (DHP Photos), established in 2016. Unauthorized reproduction or commercial redistribution is prohibited.',
          ],
        },
        {
          heading: '2. Personal Use License',
          paragraphs: [
            'Personal portrait and editorial clients are granted non-commercial rights to archive, print for personal use, and share on personal social media channels without altering the core color grade or cropping out studio attribution where applicable.',
          ],
        },
        {
          heading: '3. Commercial License',
          paragraphs: [
            'Brand campaigns, lookbooks, paid advertising, OOH placements, and commercial press usage require an explicit commercial license specifying usage channels, territories, and duration, or a written full-buyout agreement.',
          ],
        },
      ],
    },
  },
}

export const POLICY_ORDER: PolicySlug[] = [
  'security-policy',
  'privacy-policy',
  'terms-of-service',
  'cookie-policy',
  'image-licensing',
]

export function getPolicy(locale: Locale, slug: string): PolicyDocument | null {
  const map = policiesByLocale[locale]
  return slug in map ? map[slug as PolicySlug] : null
}

export function getAllPolicies(locale: Locale): PolicyDocument[] {
  return POLICY_ORDER.map(slug => policiesByLocale[locale][slug])
}
