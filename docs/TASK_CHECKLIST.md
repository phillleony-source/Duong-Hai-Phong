# Checklist phát triển

## 01 · Nền tảng và CMS

- [x] Kiểm tra workspace, quyền, phiên bản Node/npm và PostgreSQL.
- [x] Khởi tạo Next.js App Router, TypeScript strict, Tailwind và token Luxury Beige.
- [x] Cấu hình PostgreSQL, migration và dữ liệu demo.
- [x] Cấu hình Payload Admin, Local API, Globals và Collections.
- [x] Khởi tạo Admin qua CLI, đăng nhập và kiểm tra quyền Editor.
- [x] Cấu hình hai locale và Media với biến thể ảnh.
- [x] Khởi tạo tài liệu theo dõi và quy trình cập nhật sau mỗi lượt.

## 02 · Giao diện editorial

- [x] Trang chủ SSR có Hero và About đọc từ CMS.
- [x] Thiết lập font Việt–Anh và bố cục desktop/mobile.
- [x] Xây dựng menu, điều hướng theo section, đổi ngôn ngữ.
- [x] Kết nối ảnh responsive, video, poster và ảnh dự phòng.
- [ ] Xác nhận nội dung thương hiệu và tài nguyên Hero chính thức từ chủ dự án.

## 03 · Dịch vụ và Case Studies

- [x] CRUD dịch vụ và danh mục, thứ tự và bảo vệ tham chiếu.
- [x] Carousel Embla và route chi tiết dịch vụ.
- [x] CRUD Case Study, danh mục, thông tin credit, khối editorial và dự án liên quan.
- [x] Bản nháp, xuất bản, URL xem trước riêng và SEO từ CMS.
- [x] Kiểm thử lưu, xuất bản và render đủ chín loại khối editorial.

## 04 · Liên hệ và chuyển động

- [x] Form song ngữ, kiểm tra đầu vào, lưu yêu cầu và phân quyền.
- [x] Social Links CRUD và dock thích nghi desktop/mobile.
- [x] Hiệu ứng nhẹ và thiết lập giảm chuyển động.
- [ ] Kiểm chứng email qua tài khoản Resend và địa chỉ gửi đã xác minh.

## 05 · Kiểm thử, tài liệu và production

- [x] README, hướng dẫn Admin và quy trình vận hành.
- [x] TypeScript, ESLint, Vitest và production build.
- [x] Chạy lại Playwright trên production build sau khi cập nhật phụ thuộc.
- [ ] Đo Lighthouse và Core Web Vitals trên môi trường triển khai.
- [ ] Kiểm chứng Docker build và lưu trữ S3 với hạ tầng đích.
- [ ] Triển khai và xác nhận điều kiện phát hành.

## V2 · Thiết kế lại BENG.

- [x] Kiểm tra giao diện desktop/mobile và lập biên bản UI/UX.
- [x] Chuẩn hóa typography, khoảng cách, header và Hero.
- [x] Biên tập About hai ngôn ngữ và thêm trường Payload.
- [x] Thay lưới Case Studies, thêm danh mục và tinh chỉnh chi tiết.
- [x] Mở rộng biểu mẫu liên hệ, lưu PostgreSQL và giữ quyền riêng tư.
- [x] Gắn dock chung, hỗ trợ nhãn, bàn phím và đóng khi bấm ngoài.
- [x] Thiết kế footer, CTA và các cột liên kết.
- [x] Áp dụng migration cộng thêm vào database hiện có, giữ nguyên bản ghi.
- [x] Kiểm tra production build, hai ngôn ngữ, responsive và luồng CMS.
- [x] Ghi changelog và cập nhật hướng dẫn Admin.
- [x] Thêm carousel dự án trên trang chủ và kiểm tra danh mục phân trang với 50 dự án.
- [x] Thêm Facebook, Instagram, TikTok và Zalo vào cụm nút nổi, nối dữ liệu Payload khi có URL.
- [x] Thêm dòng thông báo text marquee ở đầu trang, hỗ trợ chỉnh sửa nội dung, bật/tắt, nhãn nổi bật và liên kết trong Payload Admin.
- [x] Thêm phần Quy trình làm việc (Process Section) dạng flex kéo ngang từng bước sau phần Dịch vụ, kết nối dòng thời gian và quản lý nội dung trong Payload Admin.
- [x] Triển khai cơ chế cuộn chuột dọc chuyển thành cuộn ngang (Sticky Wheel-to-Horizontal Scroll) cho phần Quy trình trên desktop, vuốt ngang tự nhiên trên mobile.
- [x] Khắc phục khoảng trống dài ở phần Quy trình, ghim chiều cao tự nhiên và cho phép lăn chuột thoát rãnh mượt mà xuống phần Dự án.
- [x] Thiết kế lại Contact Section & Form 2 cột theo ảnh mẫu 1 (kèm Google Maps Studio card, quick social buttons, dropdown thể loại, checkbox điều khoản, nút gửi pill button).
- [x] Thiết kế lại Footer 3 tầng theo ảnh mẫu 2 (hàng 6 mạng xã hội, hàng 5 chính sách, hàng bản quyền Dương Hải Phong và nút tròn cuộn lên đầu trang).
- [x] Đổi toàn bộ thương hiệu từ BENG sang Dương Hải Phong (DHP), hỗ trợ chỉnh sửa đầy đủ trong Payload Admin (`/admin`).
