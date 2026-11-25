# PROJECT DEVELOPMENT REPORT

## Project

Premium Photography Portfolio & CMS

## Current Status

| Chỉ số | Trạng thái |
|---|---|
| Giai đoạn hiện tại | V2 · Contact Form & Footer mới, Thương hiệu Dương Hải Phong (DHP) |
| Cập nhật gần nhất | 25/11/2026, giờ Việt Nam |
| Tổng số việc | 44 |
| Đã xác minh hoàn thành | 41 |
| Tiến độ | 93,2% theo checklist toàn dự án |
| Build | Dev, Lint, Typecheck & Vitest 13/13 đạt |

## Phase Progress

| Giai đoạn | Nội dung | Trạng thái | Tiến độ |
|---|---|---|---:|
| 01 | Nền tảng và CMS | Đạt tiêu chí cục bộ | 7/7 · 100% |
| 02 | Giao diện editorial | Đã kiểm thử với nội dung mẫu | 4/5 · 80% |
| 03 | Dịch vụ và Case Studies | Đã kiểm thử cục bộ | 5/5 · 100% |
| 04 | Liên hệ và chuyển động | Còn xác minh email thực | 3/4 · 75% |
| 05 | Kiểm thử và production | Chưa triển khai | 3/6 · 50% |
| V2 | Thiết kế lại portfolio | Đã kiểm tra với PostgreSQL cục bộ | 14/14 · 100% |

## Latest Work Completed

- Tối ưu Carousel Dịch vụ (`src/components/interactive.tsx`, `src/components/site.tsx`, `src/styles/site.css`):
  - Bật chế độ tự động chuyển slide (`autoPlay` mỗi 3,8 giây, vòng lặp vô tận, tạm dừng khi rê chuột/focus) cho phần Dịch vụ nhiếp ảnh.
  - Thu nhỏ tiêu đề thẻ (`clamp(1.3rem, 2.05vw, 1.85rem)`) và căn đều chiều cao các thẻ trên cùng một hàng (`align-items: stretch`, `margin-top: auto` cho liên kết `Xem chi tiết`).

- Nâng cấp Hero thành slideshow 3 ảnh với hiệu ứng grow (zoom chậm) và chuyển cảnh crossfade (`src/components/interactive.tsx`, `src/styles/site.css`):
  - Chuyển đổi 3 ảnh gốc (`NNT00154.jpg`, `NNT00216.jpg`, `HaiPhongphoto-10.jpg`) sang WebP tối ưu tại `public/portfolio/hero-slide-1.webp`, `hero-slide-2.webp`, `hero-slide-3.webp` (giữ nguyên thư mục ảnh gốc).
  - Tự động chuyển slide mỗi 5,5 giây kèm hiệu ứng phóng nhẹ (`scale(1)` → `scale(1.08)`), chuyển cảnh mượt `opacity` 1.35s và thanh chấm chuyển slide thủ công (`.hero-slide-dots`).

- Cập nhật bố cục trang Tất cả dự án (`case-studies`) thành lưới 3 cột × 4 hàng (12 dự án/trang) và phân trang đánh số (`1, 2, 3, 4...`):
  - Bổ sung prop `columns` cho `ProjectGrid` (`src/components/site.tsx`) và class `.work-grid-3` (`src/styles/site.css`), bỏ thẻ dàn ngang `work-card-wide` ở danh mục 3 cột để các hàng thẳng đều nhau.
  - Cập nhật `CatalogPagination` (`src/app/(frontend)/[locale]/case-studies/page.tsx`) hiển thị các nút số trang bo tròn kèm nút Trước/Sau.

- Xây dựng nội dung và 5 trang chính sách song ngữ (Việt – Anh) cho footer (`src/lib/policies.ts`, `src/app/(frontend)/[locale]/policies/[slug]/page.tsx`):
  - Hoàn thiện nội dung chi tiết cho 5 trang: Chính sách bảo mật (`security-policy`), Chính sách quyền riêng tư (`privacy-policy`), Điều khoản dịch vụ (`terms-of-service`), Chính sách cookie (`cookie-policy`), Cấp phép hình ảnh (`image-licensing`).
  - Liên kết trực tiếp từ tầng 2 của Footer (`src/components/site.tsx`), bổ sung thanh chuyển nhanh giữa 5 chính sách và style card bo tròn kèm gradient nhẹ (`src/styles/site.css`).

- Bo tròn đồng bộ và bổ sung gradient tinh tế cho các nút bấm, khung ảnh và section nền (`src/styles/site.css`):
  - Bo tròn dạng pill (`border-radius: 9999px`) cho `.button` và `.hero-controls button`; bo tròn góc (`border-radius: 1.15rem`) cho `.photo`, `.about-extras video`, `.detail-cover` và `.article-video`.
  - Bổ sung gradient tông Luxury Beige / Espresso ấm cho `.button-light`, `.button-dark`, `.contact-submit-btn`, `.announcement-badge`, `body`, `.announcement-bar`, `.topbar-solid`, `.services-section`, `.process-section`, `.process-card`, `.work-section`, `.contact-panel`, `.contact-form-card`, `.footer-wrap`, `.footer-panel` và `.social-dock`.

- Thiết kế lại Contact Section & Form và Footer, chuyển đổi thương hiệu sang Dương Hải Phong (DHP):
  - **Tái cấu trúc Contact Section (Image 1)**: Cột trái gồm pill badge "Thông tin liên hệ", tiêu đề "Thông tin liên hệ cơ bản", mô tả giới thiệu, 3 nút mạng xã hội nhanh (Facebook, Instagram, TikTok), và thẻ vị trí Google Maps Studio tích hợp nút "Mở bản đồ" và "Xem bản đồ tại đây". Cột phải là card "Đăng ký tư vấn" dạng 2 cột: Tên (bắt buộc), Số điện thoại (bắt buộc), Email (nếu có), URL Facebook (nếu có), Thể loại concept (dropdown chọn dịch vụ), Nội dung (nếu có), Checkbox đồng ý cung cấp thông tin, nút gửi "Tư vấn ngay" kèm icon máy bay giấy và hộp thông báo bảo mật bên dưới.
  - **Tái cấu trúc Footer (Image 2)**: Panel tối bo tròn 24px chia 3 tầng rõ nét: Tầng 1 gồm hàng icon các mạng xã hội (Facebook, Instagram, Threads, TikTok, Flickr, Zalo); Tầng 2 gồm các liên kết chính sách (Chính sách bảo mật, Chính sách quyền riêng tư, Điều khoản dịch vụ, Chính sách cookie, Cấp phép hình ảnh); Tầng 3 gồm dòng bản quyền "Copyright © 2026 | DHP Photos. All rights reserved.", dòng xác nhận quyền sở hữu của Dương Hải Phong, năm thành lập 2016 và nút cuộn lên đầu trang hình tròn `↑`.
  - **Chuyển đổi toàn diện thương hiệu "BENG" -> "Dương Hải Phong" (DHP)**: Thay đổi tên thương hiệu trong Header, About ("Xin chào, mình là Dương Hải Phong."), Quy trình ("Dương Hải Phong tỉ mỉ trau chuốt..."), Footer, SEO Metadata, và Demo fallback. Tất cả đều có thể tùy chỉnh trực tiếp trong Payload Admin (`/admin`).
  - **Database Migration**: Cập nhật các bảng PostgreSQL `contact_submissions`, `site_settings`, `contact_settings`, `social_links` và các bảng locales tương ứng.
  - **Kiểm thử toàn diện**: Typecheck, Lint, Vitest (13/13) và test E2E Playwright gửi form vào PostgreSQL thành công 100%.

- Khắc phục triệt để khoảng trống dài ở phần Quy trình làm việc (Process Section) & tối ưu cuộn chuột ngang:
  - Bỏ hoàn toàn chiều cao `260vh` và khung sticky `100vh` gây ra khoảng trống đen khổng lồ bên dưới các thẻ.
  - Đưa phần Quy trình về chiều cao tự nhiên gọn gàng (821px), khoảng cách giữa phần Quy trình và phần Dự án trở về 0px, hoàn toàn liền mạch trong bố cục trang.
  - Tối ưu sự kiện con lăn chuột (`wheel` event): khi người dùng đặt con trỏ chuột trong vùng Quy trình và lăn chuột xuống, trang sẽ chuyển đổi thành cuộn ngang qua các bước; khi cuộn tới bước cuối cùng thì tự động nhả để lăn tiếp xuống phần Dự án phía dưới.
  - Duy trì đầy đủ các tương tác: kéo chuột tự do (`mouse drag`), vuốt ngang trackpad, click số bước timeline (`01`-`05`) và nút `←` / `→`.

- Thêm phần Quy trình làm việc (Process Section) dạng flex kéo ngang từng bước đặt ngay sau phần Dịch vụ:
  - Global `process` trong Payload CMS (nhóm Homepage) hỗ trợ tiêu đề, phụ đề, mô tả và danh sách các bước (`steps`) song ngữ (Việt - Anh) kèm số thứ tự.
  - Áp dụng migration `20261124_045452_add_process` và seed nội dung 5 bước chuyên nghiệp cho nhiếp ảnh (Tiếp nhận & Lắng nghe, Moodboard & Định hình, Thực hiện buổi chụp, Tuyển chọn & Hậu kỳ, Bàn giao & Lưu giữ).
  - Component `ProcessSection` sử dụng Embla Carousel hỗ trợ vuốt chạm trên mobile, kéo thả tự do bằng chuột trên desktop (`dragFree: true`, cursor grab), nút điều hướng tiến/lùi, và thanh timeline liên kết số bước (`01` đến `05`) tự động làm nổi bật theo vị trí cuộn.
  - Tích hợp mục `Quy trình` (`#process`) vào thanh điều hướng menu chính.

- Thêm dòng thông báo text marquee (Announcement Bar) ở đầu trang trên cả desktop và mobile:
  - Global `announcement` trong Payload CMS (nhóm Homepage) cho phép chỉnh sửa văn bản song ngữ (Việt - Anh), nhãn nổi bật (`highlight`), liên kết điều hướng (`link`), tốc độ chạy chữ (`speed`), và công tắc bật/tắt (`visible`).
  - Marquee cuộn mượt vô tận bằng CSS transform với hiệu ứng dừng khi rê chuột (`hover: paused`), tuân thủ chuẩn `prefers-reduced-motion`, tự động tính toán bù lề (`scroll-padding` và `main-offset`) cho toàn trang.
  - Áp dụng migration `20261124_044421_add_announcement` và seed nội dung mẫu ban đầu.

- Cụm nổi có Facebook, Instagram, TikTok và Zalo. URL được thêm trong Payload sau; trong lúc chờ, biểu tượng hiện trạng thái **Chưa có liên kết**.

- Dự án chọn lọc trên trang chủ chuyển sang carousel ngang, tối đa sáu thẻ. Danh mục tải 12 mục mỗi trang từ Payload. Đã kiểm tra 50 đường dẫn riêng biệt qua năm trang.

- V2 thêm bài giới thiệu Anh–Việt, lưới Case Studies hai cột có ảnh ngang, trang danh mục, Contact dạng panel, dock dùng chung và footer mới.
- Migration `20261123_060340_editorial_v2` thêm trường Payload và thông tin ngày, ngân sách, trạng thái, ghi chú. Dữ liệu, ảnh, dịch vụ và URL cũ vẫn được dùng. Văn bản demo V1 còn lưu nguyên.
- Bản local tại `http://localhost:3000/vi` chạy với PostgreSQL và hiển thị form gửi thật. Dữ liệu hiển thị vẫn là portfolio mẫu.

- Khởi tạo Next.js 16, Tailwind, Payload 3 và PostgreSQL. Áp dụng hai migration trên database trống, seed nội dung hai ngôn ngữ và tạo Admin bằng CLI.
- Dùng ảnh từ thư mục chủ dự án cung cấp cho Hero, About, dịch vụ và dự án demo. Tạo bản WebP desktop/mobile và giữ ảnh gốc.
- Tạo trang chủ Anh–Việt, điều hướng trên mobile, carousel dịch vụ, bài editorial với chín loại khối, SEO và preview yêu cầu đăng nhập.
- Kết nối biểu mẫu với PostgreSQL, bảo vệ dữ liệu theo vai trò và kiểm tra giới hạn tần suất khi nhiều yêu cầu đến đồng thời. Tích hợp cấu hình S3 và Resend.
- Cập nhật Sharp, DOMPurify và Happy DOM sau khi kiểm tra npm audit.

## Files Created

- `src/app/` cho route công khai, Payload Admin/REST, preview, liên hệ, sitemap và robots.
- `src/cms/`, `src/payload.config.ts`, `src/payload-types.ts` và `src/migrations/` cho schema, quyền và migration.
- `src/components/`, `src/lib/`, `src/styles/` và `public/portfolio/` cho giao diện, nội dung, trình biên tập, SEO và ảnh demo.
- `scripts/`, `tests/`, `package.json`, lockfile và cấu hình phát triển/QA.
- `README.md`, `docs/`, `AGENTS.md`, `.env.example`, `compose.yaml` và `Dockerfile`.

## Files Modified

V2 sửa layout, thành phần frontend, schema Payload, endpoint liên hệ, sitemap, bộ kiểm thử và tài liệu. Các tệp chính và lý do được ghi trong [UI_UX_CHANGELOG.md](UI_UX_CHANGELOG.md). Thư mục ảnh gốc được giữ nguyên.

## Testing Results

- TypeScript, ESLint và production build đạt.
- V2 đạt 13/13 Vitest. Playwright Chromium trên production build có 9 bài đạt, 1 bài dành cho proxy IP bỏ qua. Hạn mức mặc định đã được thử riêng trên PostgreSQL. [Kết quả kiểm thử](TEST_RESULTS.md)
- Đã kiểm tra hiển thị từ 320 đến 1920 px, nhập và hiển thị tiếng Việt, Hero dự phòng khi video lỗi, quản trị nội dung, phiên bản, sitemap và lưu yêu cầu liên hệ.
- Kết quả đo Chrome local và lịch sử lỗi kiểm thử có trong [TEST_RESULTS.md](TEST_RESULTS.md).

## Errors and Blockers

- Docker Engine chưa chạy trên máy kiểm thử. Migration và CMS được xác minh bằng PostgreSQL chạy cục bộ.
- Chưa có bucket S3, tài khoản Resend và máy chủ triển khai đích. Các kết nối đó chưa được kiểm chứng bằng tài khoản thật.
- npm audit còn 5 mục mức trung bình đi qua chuỗi Drizzle Kit và esbuild. Không còn mục cao hoặc nghiêm trọng trong lần quét production.
- Hero demo dùng ảnh tĩnh. Video có kiểm thử tải lên và dự phòng, còn video được chọn cho thương hiệu chưa được cung cấp.
- About dùng ảnh hậu trường có sẵn. Email và hồ sơ mạng xã hội thật cần được cập nhật trong Payload.

## Next Tasks

1. Cập nhật nhận diện, nội dung hai ngôn ngữ và tài nguyên Hero chính thức.
2. Kiểm tra email với Resend, kiểm tra S3 và Docker build trên hạ tầng đích.
3. Đo Lighthouse và Core Web Vitals ở URL triển khai, sau đó xác minh điều kiện phát hành.

## Recommendations

Giữ **Is Demo** bật trong Site Settings cho đến khi thay xong nội dung minh họa và xác nhận quyền công bố ảnh. Làm theo [README](../README.md) để chạy dự án và [hướng dẫn Admin](ADMIN_GUIDE.md) để cập nhật nội dung.
