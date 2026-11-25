export const locales = ['en', 'vi'] as const
export type Locale = typeof locales[number]
export function isLocale(value: string): value is Locale {
  return value === 'en' || value === 'vi'
}

export const labels = {
  en: {
    home: 'Home', about: 'About', services: 'Services', work: 'Selected Work', contact: 'Contact',
    menu: 'Menu', close: 'Close', scroll: 'Scroll to discover', details: 'View details', project: 'View project',
    previous: 'Previous', next: 'Next', top: 'Back to top', skip: 'Skip to content', social: 'Social links',
    name: 'Full name', email: 'Email', phone: 'Phone (optional)', interest: 'Interested service',
    choose: 'Select a service', message: 'Tell me about your project', send: 'Send inquiry', sending: 'Sending…',
    success: 'Your inquiry has been received.', failure: 'Your inquiry could not be saved. Please try again.',
    limit: 'Please wait before sending another inquiry.', invalid: 'Please check the form fields.',
    mute: 'Mute video', unmute: 'Unmute video', related: 'Related work', demo: 'Demo portfolio',
    missing: 'Page not found', return: 'Return to the portfolio', unavailable: 'This page is temporarily unavailable.',
    pause: 'Pause video', play: 'Play video',
    explore: 'Explore', connect: 'Connect', projectIndex: 'All projects', projectPages: 'Project pages', page: 'Page',
    noProjects: 'New projects will appear here when they’re published.',
    projectDate: 'Preferred project date', budget: 'Budget range', optional: 'Optional', chooseBudget: 'Select a range',
    noticeUnavailable: 'Email notifications are currently unavailable.',
    noticeFailed: 'The email notification could not be delivered.',
    formPreview: 'The form is available when this preview is connected to the CMS.',
    fieldError: 'Please check this field.',
  },
  vi: {
    home: 'Trang chủ', about: 'Giới thiệu', services: 'Dịch vụ', work: 'Dự án', contact: 'Liên hệ',
    menu: 'Menu', close: 'Đóng', scroll: 'Cuộn để khám phá', details: 'Xem chi tiết', project: 'Xem dự án',
    previous: 'Trước', next: 'Sau', top: 'Về đầu trang', skip: 'Đến nội dung chính', social: 'Mạng xã hội',
    name: 'Họ và tên', email: 'Email', phone: 'Điện thoại (không bắt buộc)', interest: 'Dịch vụ quan tâm',
    choose: 'Chọn dịch vụ', message: 'Chia sẻ về dự án của bạn', send: 'Gửi yêu cầu', sending: 'Đang gửi…',
    success: 'Yêu cầu của bạn đã được ghi nhận.', failure: 'Chưa thể lưu yêu cầu. Vui lòng thử lại.',
    limit: 'Vui lòng đợi trước khi gửi yêu cầu khác.', invalid: 'Vui lòng kiểm tra các trường thông tin.',
    mute: 'Tắt tiếng video', unmute: 'Bật tiếng video', related: 'Dự án liên quan', demo: 'Bản minh họa',
    missing: 'Không tìm thấy trang', return: 'Về trang portfolio', unavailable: 'Trang này hiện không khả dụng.',
    pause: 'Tạm dừng video', play: 'Phát video',
    explore: 'Khám phá', connect: 'Kết nối', projectIndex: 'Tất cả dự án', projectPages: 'Phân trang dự án', page: 'Trang',
    noProjects: 'Các dự án mới sẽ xuất hiện ở đây khi được công bố.',
    projectDate: 'Ngày chụp dự kiến', budget: 'Khoảng ngân sách', optional: 'Không bắt buộc', chooseBudget: 'Chọn khoảng ngân sách',
    noticeUnavailable: 'Thông báo qua email hiện chưa khả dụng.',
    noticeFailed: 'Thông báo qua email chưa được gửi thành công.',
    formPreview: 'Bạn có thể gửi lời nhắn khi bản xem trước được kết nối với CMS.',
    fieldError: 'Vui lòng kiểm tra trường này.',
  },
}
