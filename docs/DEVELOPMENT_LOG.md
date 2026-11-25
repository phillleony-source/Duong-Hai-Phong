# Nhật ký phát triển

## 23/11/2026 lúc 12:52 UTC+7 · Lượt 01 · Khởi tạo portfolio và CMS

- **Yêu cầu** – Tạo ứng dụng Luxury Beige Editorial từ đầu, thiết lập CMS song ngữ, viết mã và tiếp tục qua các giai đoạn có thể xác minh.
- **Công việc** – Tạo Next.js/Payload, schema và migration, seed ảnh demo, giao diện Anh–Việt, route chi tiết, biên tập editorial, liên hệ, phân quyền, SEO và hướng dẫn triển khai.
- **Tệp** – Tạo `src/`, `public/portfolio/`, `scripts/`, `tests/`, cấu hình npm/Next/Docker, và bộ tài liệu tại `docs/`. Giữ ảnh gốc ở vị trí ban đầu.
- **Lệnh** – Kiểm tra Node/npm/Docker, cài phụ thuộc, chạy `payload migrate`, `payload run scripts/seed.ts`, `payload run scripts/create-admin.ts`, typegen, typecheck, lint, Vitest, Playwright, build và audit production.
- **Kết quả** – Build thành công. Vitest 12/12 và Playwright 8/8. Hai migration chạy được trên database mới. Kiểm tra hiển thị qua ảnh chụp desktop/mobile và đo tải ảnh Hero cục bộ.
- **Vấn đề và xử lý** – Dùng Node và PostgreSQL chạy cục bộ vì runtime hệ thống cũ hơn yêu cầu và Docker Engine chưa chạy. Sửa locator Playwright và phương thức cập nhật Global. Cài bản vá Sharp, DOMPurify và Happy DOM, chạy lại build và audit.
- **Còn lại** – Thương hiệu/media cuối, thử nghiệm Resend và S3, Docker build trên hạ tầng đích, Lighthouse và xác minh triển khai.

Chi tiết trong [Kết quả kiểm thử](TEST_RESULTS.md) và [Quyết định kiến trúc](ARCHITECTURE_DECISIONS.md).

## 23/11/2026 lúc 13:18 UTC+7 · Lượt 02 · BENG. Portfolio V2

- Đọc tài liệu và mã V1, kiểm tra Chrome desktop/mobile, ghi [biên bản UI/UX](UI_UX_AUDIT.md). Phát hiện chế độ demo là nguyên nhân form bị ẩn trên localhost.
- Triển khai About Anh–Việt, bố cục lưới Case Studies, danh mục, trang chi tiết, panel Contact, dock và footer. Tinh chỉnh header, Hero, Embla, tiêu điểm ảnh và khoảng trống bảo vệ nút khi dock nổi.
- Tạo và áp dụng migration cộng thêm vào PostgreSQL cục bộ và database kiểm thử riêng. Không seed lại hoặc đặt lại database. Tạo cấu hình local được Git bỏ qua để port 3000 dùng dữ liệu Payload và form thật.
- Kiểm tra production build, TypeScript và ESLint đều đạt. Vitest 13/13, Playwright 9 đạt và 1 bỏ qua. Đã chụp 16 ảnh Chrome và kiểm thử quota POST mặc định trên database riêng. Các tài khoản/dữ liệu QA dùng cho test được xử lý trong phạm vi cục bộ.
- Resend thực tế, video chính thức và kênh liên hệ chính thức vẫn chờ dữ liệu từ chủ dự án.

Chi tiết trong [changelog V2](UI_UX_CHANGELOG.md) và [kết quả kiểm thử](TEST_RESULTS.md).

## 23/11/2026 · Lượt 03 · Carousel dự án

- Tái sử dụng Embla cho Dự án chọn lọc, đưa nút Trước/Sau lên trên ảnh và giữ liên kết mở danh mục.
- Giới hạn truy vấn trang chủ ở sáu dự án và phân trang danh mục ngay tại Payload. Trang chi tiết và sitemap dùng truy vấn riêng theo nhu cầu.
- Đã thử danh mục với 50 dự án công bố trên database kiểm thử riêng. Dọn 47 bản ghi tạo cho phép thử sau khi xác minh và giữ ba bản mẫu ban đầu. Dữ liệu và URL dự án ở bản local chính được giữ nguyên.

## 23/11/2026 · Lượt 04 · Nút mạng xã hội

- Thêm bốn biểu tượng Facebook, Instagram, TikTok và Zalo vào cụm nút nổi. Người dùng sẽ bổ sung URL sau. Biểu tượng đang chờ có nhãn rõ và chưa điều hướng.
- Thêm lựa chọn TikTok cho nền tảng và biểu tượng trong Payload. Migration chỉ thêm giá trị enum, giữ các liên kết cũ. Cập nhật hướng dẫn Admin.

## 24/11/2026 · Khởi chạy môi trường phát triển

- Khởi động cơ sở dữ liệu PostgreSQL cho dự án ở cổng 55432 (dùng dữ liệu đã seed tại `.tooling/pgdata`).
- Ghi nhận Docker Engine đang chạy nhưng cổng 5432 mặc định bị chiếm bởi container `antigravity-db-1`. Cấu hình dự án tiếp tục dùng cổng 55432 đã khớp với `.env.local`.
- Khởi chạy Next.js dev server (`npm run dev`) trên Turbopack tại cổng 3000. Xác nhận phản hồi 200 OK cho các route `/vi`, `/en` và `/admin`.

## 24/11/2026 · Lượt 05 · Dòng thông báo Marquee (Announcement Bar)

- **Yêu cầu** – Thêm dòng thông báo dạng text marquee ở sát mép trên cùng website, nội dung chỉnh sửa được trong Payload Admin.
- **Thực hiện** –
  - Tạo Global `announcement` trong schema Payload CMS (nhóm Homepage), hỗ trợ các trường: `visible` (công tắc hiển thị), `text` (văn bản thông báo localized song ngữ Việt/Anh), `highlight` (nhãn nổi bật localized), `link` (liên kết điều hướng khi click), `speed` (thời gian cuộn marquee theo giây).
  - Tạo và chạy migration `20261124_044421_add_announcement`, biên dịch type TypeScript và seed nội dung ban đầu cho cả 2 locale.
  - Xây dựng component `AnnouncementMarquee` trong `src/components/interactive.tsx` với hiệu ứng CSS transform chạy liên tục mượt mà, tự động dừng khi rê chuột (`hover: paused`), tuân thủ chuẩn `prefers-reduced-motion`.
  - Tích hợp vào `Header` và `SiteFrame`, tự động tính toán bù lề (`scroll-padding-top` và `main-offset-announcement`) để không che khuất nội dung trang chi tiết hoặc thanh điều hướng trên mobile.
- **Kiểm tra** –
  - Typecheck và ESLint đạt 100% không cảnh báo.
  - Vitest 13/13 test cases đạt.
  - Kiểm tra trực quan trên trình duyệt máy tính (1440×900) và điện thoại (390×844) xác nhận thanh thông báo hiển thị đúng vị trí viền đỏ yêu cầu, chạy mượt và hiển thị chữ đẹp mắt theo ngôn ngữ hiện tại.
  - Route quản trị `/admin/globals/announcement` phản hồi 200 OK.

## 24/11/2026 · Lượt 06 · Quy trình làm việc (Process Section)

- **Yêu cầu** – Thêm phần quy trình làm việc ngay sau phần dịch vụ, giao diện dạng flex kéo ngang từng bước (theo ảnh mẫu cung cấp).
- **Thực hiện** –
  - Tạo Global `process` trong schema Payload CMS (nhóm Homepage) với các trường: `visible`, `eyebrow`, `heading`, `description`, mảng `steps` (gồm `stepNumber`, `title`, `subtitle`, `description` localized cho cả tiếng Việt và tiếng Anh).
  - Tạo và chạy migration `20261124_045452_add_process`, áp dụng vào PostgreSQL thành công.
  - Seed dữ liệu chuẩn 5 bước chụp ảnh nghệ thuật (Tiếp nhận & Lắng nghe, Moodboard & Định hình, Thực hiện buổi chụp, Tuyển chọn & Hậu kỳ, Bàn giao & Lưu giữ).
  - Xây dựng component `ProcessSection` hỗ trợ kéo ngang tự do bằng chuột trên máy tính (`dragFree: true`, cursor grab/grabbing), vuốt chạm trên điện thoại, nút điều hướng trước/sau (`←`/`→`), và hàng số timeline (`01` đến `05`) liên kết vị trí cuộn.
  - Đặt section `#process` ngay sau `#services` và thêm mục `Quy trình` vào thanh điều hướng menu.
  - Thiết kế tông nền tối sang trọng (`--dark`), chữ ngà (`--ivory`) và điểm nhấn cát ấm (`--sand`) tương thích chuẩn Luxury Beige Editorial.
- **Kiểm tra** –
  - Typecheck strict đạt, ESLint đạt (0 lỗi, 0 cảnh báo).
  - Vitest 13/13 passed.
  - Chụp ảnh kiểm chứng desktop ([process-desktop-vi.png](../.tooling/process-desktop-vi.png)) và mobile ([process-mobile-vi.png](../.tooling/process-mobile-vi.png)) xác nhận bố cục, font chữ, timeline và card hiển thị chuẩn theo ảnh mẫu.
  - Route quản trị `/admin/globals/process` trả về 200 OK.

## 24/11/2026 · Lượt 08 · Khắc phục khoảng trống dài ở Quy trình & Tối ưu cuộn chuột ngang

- **Yêu cầu** – "có 1 khoảng trống rất dài ở Quy trình làm việc": người dùng chụp ảnh toàn trang cho thấy có một mảng trống đen rất lớn bên dưới phần quy trình làm việc do thiết lập chiều cao `260vh` của cơ chế sticky pinning trước đó.
- **Thực hiện** –
  - Bỏ hoàn toàn chiều cao `260vh` và khung ghim `100vh`, đưa section `#process` về chiều cao tự nhiên (`height: auto`, padding `section-pad` tiêu chuẩn) đồng nhất với các section Dịch vụ và Dự án. Khoảng cách (gap) giữa phần Quy trình và phần Dự án trở về 0px, hoàn toàn biến mất mảng đen trống.
  - Chuyển cơ chế bắt sự kiện con lăn chuột (`wheel` event) trực tiếp trên container carousel:
    - Khi con trỏ chuột nằm trên vùng Quy trình và người dùng lăn chuột xuống (`deltaY > 0`), nếu danh sách bước chưa chạm đáy bên phải, sự kiện dọc bị chặn (`e.preventDefault()`) và chuyển trực tiếp thành cuộn ngang `container.scrollLeft += deltaY`.
    - Khi cuộn đến bước cuối cùng (bước 05), sự kiện không bị chặn nữa, cho phép người dùng cuộn tiếp xuống phần Dự án (`#work`) bình thường.
    - Tương tự khi lăn chuột ngược lên trên (`deltaY < 0`), danh sách bước cuộn lùi về bước 01 rồi mới cuộn tiếp lên phần Dịch vụ (`#services`).
    - Hỗ trợ vuốt ngang trackpad, kéo chuột tự do (`mouse drag`), click chọn số bước trên timeline và click nút mũi tên `←` / `→`.
- **Kiểm tra** –
  - Typecheck strict đạt 100%, ESLint 0 lỗi 0 cảnh báo, Vitest 13/13 test cases đạt.
  - Đo đạc tự động qua Playwright: chiều cao `#process` giảm từ 2340px xuống còn 821px; khoảng cách giữa `#process` và `#work` bằng 0px.
  - Kiểm thử `page.mouse.wheel(0, 300)` trực tiếp trên container: ghi nhận `scrollLeft` tăng chính xác từ `0` lên `300px`. Đã lưu ảnh chụp xác thực fullpage mới.

## 2026-11-24: Thiết kế lại Contact Form & Footer, chuyển đổi thương hiệu sang Dương Hải Phong (DHP)
- **Mục tiêu**:
  - Tái cấu trúc và thiết kế lại toàn bộ Contact Section & Contact Form khớp với thiết kế mẫu (Image 1: 2 cột thông tin & form, thẻ Google Maps studio, nút mạng xã hội nhanh, form đăng ký 2 cột với checkbox đồng ý và nút gửi kiểu pill button).
  - Tái cấu trúc và thiết kế lại Footer dạng panel tối bo tròn 3 tầng (Image 2: Tầng 1 gồm các kênh mạng xã hội Facebook, Instagram, Threads, TikTok, Flickr, Zalo; Tầng 2 gồm các chính sách; Tầng 3 gồm thông tin bản quyền sở hữu trí tuệ của Dương Hải Phong và nút cuộn lên đầu trang hình tròn).
  - Đổi toàn bộ thương hiệu từ "BENG" sang "Dương Hải Phong" (viết tắt là "DHP"), hỗ trợ chỉnh sửa linh hoạt từ Payload Admin (`site-settings`, `about`, `contact-settings`).
- **Các thay đổi đã thực hiện**:
  - **Database Migration**:
    - Cập nhật schema bảng `contact_submissions` (thêm `facebook_url`, `consent`, cho phép `email` & `message` nullable).
    - Cập nhật bảng `site_settings_locales` (thêm `short_name`), `site_settings` (thêm `established_year`).
    - Cập nhật bảng `contact_settings_locales` (thêm `studio_address`), `contact_settings` (thêm `google_maps_url`).
    - Cập nhật enum mạng xã hội hỗ trợ thêm `threads` và `flickr`.
    - Cập nhật dữ liệu mặc định: tên thương hiệu "Dương Hải Phong", tên viết tắt "DHP", copyright "DHP Photos", năm thành lập "2016".
  - **Payload Schema (`src/cms/schema.ts`)**:
    - Thêm `shortName`, `establishedYear` vào global `site-settings`.
    - Thêm `googleMapsUrl`, `studioAddress` vào global `contact-settings`.
    - Cập nhật collection `contact-submissions` và `social-links`.
  - **API & Validation (`src/lib/contact.ts`, `src/app/(payload)/api/contact/route.ts`)**:
    - Cập nhật schema xác thực Zod và API endpoint `/api/contact` nhận và lưu trữ `phone`, `facebookUrl`, `consent`, `service`, `message` vào cơ sở dữ liệu.
  - **UI & Components (`src/components/interactive.tsx`, `src/components/site.tsx`)**:
    - Cập nhật `ContactForm`: layout 2 cột (Tên, Số điện thoại, Email nếu có, URL Facebook nếu có), dropdown chọn thể loại concept, textarea lời nhắn, checkbox đồng ý điều khoản, nút gửi "Tư vấn ngay" kèm biểu tượng máy bay giấy, thông báo bảo mật bên dưới.
    - Cập nhật phần thông tin bên trái Contact Section: pill badge "Thông tin liên hệ", tiêu đề "Thông tin liên hệ cơ bản", nút mạng xã hội nhanh, card vị trí Google Maps với nút "Mở bản đồ" và "Xem bản đồ tại đây".
    - Thiết kế lại `footer` trong `SiteFrame`: panel bo góc 3 tầng chuẩn theo ảnh mẫu.
    - Cập nhật Header hiển thị tên "DHP" / "Dương Hải Phong".
    - Bổ sung biểu tượng SVG cho `threads` và `flickr`.
  - **CSS Styling (`src/styles/site.css`)**:
    - Thêm toàn bộ style cho `.contact-panel`, `.contact-maps-card`, `.contact-form-card`, `.contact-submit-btn`, `.contact-consent-checkbox`, `.footer-panel`, `.footer-tier-social`, `.footer-tier-policies`, `.footer-tier-bottom`, `.footer-scroll-top`.
    - Tối ưu hóa hiển thị responsive trên màn hình mobile và tablet.
- **Kiểm thử**:
  - `npm run typecheck`: Passed (0 lỗi).
  - `npm run lint`: Passed (0 lỗi, 0 cảnh báo).
  - `npm test`: Passed (13/13 tests).
  - Chạy test E2E gửi form qua Playwright: gửi thành công, dữ liệu lưu đầy đủ vào PostgreSQL.
  - Chụp ảnh kiểm thử giao diện Desktop & Mobile: xác nhận khớp với thiết kế người dùng cung cấp.

## 24/11/2026: Tối ưu hóa toàn diện giao diện Mobile cho Contact Form & Navigation
- **Phân tích vấn đề người dùng phản hồi**:
  - Khi xem trên mobile, do thanh topbar (gồm announcement bar + header) cố định `position: fixed` ở đỉnh màn hình, việc form quá dài (các trường xếp chồng 1 cột) khiến tiêu đề `Đăng ký tư vấn` và nhãn `Tên` bị đẩy lên khuất sau thanh topbar.
  - Các card bị lồng nhau kép (`contact-panel` padding 24px + `contact-form-card` padding 20px) khiến chiều rộng thực tế của các ô input bị thu hẹp chỉ còn ~250px.
  - Các nút mạng xã hội và Google Maps chiếm chiều dài quá lớn trước khi người dùng chạm tới form.
- **Giải pháp và Tối ưu hóa**:
  - Bổ sung `scroll-margin-top: calc(var(--bar) + var(--announcement-h) + 1.25rem)` cho `.contact-section`, `.contact-panel`, `.contact-form-card`, `#consultation-form` và các trường input, ngăn chặn tình trạng bị che khuất sau topbar cố định khi focus hoặc cuộn đến.
  - Tối ưu layout 2 cột cho các trường ngắn trên mobile (`Tên` & `Số điện thoại`, `Email` & `URL Facebook`), giúp giảm gần 200px chiều cao tổng thể của form.
  - Tối ưu 3 nút mạng xã hội nhanh (Facebook, Instagram, TikTok) nằm gọn gàng trên 1 hàng duy nhất (`repeat(3, 1fr)`).
  - Tinh chỉnh padding và khoảng cách các khối trên mobile giúp form hiển thị trọn vẹn, thoáng đãng trong 1 tầm mắt mà không bị cắt góc.
  - Kiểm thử Playwright trên viewport 390×844: điều hướng menu "Liên hệ" và cuộn form đều hiển thị hoàn hảo 100%.


## 25/11/2026 · Bo tròn các nút và khung hình ảnh
- **Yêu cầu** – Bo tròn các nút và hình ảnh trên giao diện.
- **Thực hiện (`src/styles/site.css`)** –
  - Thêm `border-radius: 9999px` cho `.button` và `.hero-controls button` để đồng bộ kiểu nút pill trên toàn trang.
  - Thêm `border-radius: 1.15rem` cho `.photo`, `.about-extras video`, `.detail-cover` và `.article-video` để bo tròn đồng bộ các khung ảnh giới thiệu, thẻ dịch vụ, thẻ dự án và nội dung editorial.
- **Kiểm tra** –
  - `npm run lint`: Đạt (0 lỗi, 0 cảnh báo).
  - `npm test`: Đạt (13/13 Vitest).

## 25/11/2026 · Bổ sung gradient tinh tế cho nút bấm, card và section nền
- **Yêu cầu** – Đổ thêm gradient nhẹ nhàng để giao diện nổi bật và có chiều sâu hơn.
- **Thực hiện (`src/styles/site.css`)** –
  - **Nút bấm & nhãn**: Thêm linear-gradient tông kem–cát ấm (`--ivory`, `--beige`, `--sand`) cho `.button-light`, `.contact-submit-btn`, `.announcement-badge` và tông nâu trầm (`--espresso`, `--dark`) cho `.button-dark` / `.button-outline:hover`.
  - **Section & Card**: Thêm gradient chiều sâu tinh tế cho `.services-section`, `.process-section` (kèm ánh sáng radial nhẹ), `.process-card`, `.process-node.is-active .process-node-bullet`, `.contact-section`, `.contact-panel`, `.contact-form-card`, `.footer-panel`, `.social-dock` và nền chờ ảnh `.photo`.
- **Kiểm tra** –
  - `npm run lint`: Đạt (0 lỗi, 0 cảnh báo).
  - `npm test`: Đạt (13/13 Vitest).

## 25/11/2026 · Bổ sung gradient nền cho các section còn lại
- **Yêu cầu** – Thêm background gradient cho các section trên trang.
- **Thực hiện (`src/styles/site.css`)** –
  - Thêm gradient nền cho `body` (áp dụng cho phần Giới thiệu `#about` và các trang chi tiết/danh mục), `.work-section` (Dự án chọn lọc `#work`), `.announcement-bar`, `.topbar-solid` và `.footer-wrap`.
- **Kiểm tra** –
  - `npm run lint`: Đạt (0 lỗi, 0 cảnh báo).
  - `npm test`: Đạt (13/13 Vitest).

## 25/11/2026 · Tạo nội dung và 5 trang Chính sách song ngữ
- **Yêu cầu** – Tổng hợp nội dung và xây dựng 5 trang chính sách ở footer (Chính sách bảo mật, Chính sách quyền riêng tư, Điều khoản dịch vụ, Chính sách cookie, Cấp phép hình ảnh).
- **Thực hiện** –
  - Tạo `src/lib/policies.ts` chứa nội dung song ngữ Việt–Anh đầy đủ, chuẩn nhiếp ảnh thương mại/editorial cho Dương Hải Phong (DHP Photos).
  - Tạo route động `src/app/(frontend)/[locale]/policies/[slug]/page.tsx` kèm SEO `generateMetadata`, breadcrumb, thanh chuyển nhanh giữa 5 trang chính sách và nút điều hướng.
  - Cập nhật `policyItems` trong `src/components/site.tsx` trỏ trực tiếp tới `/${locale}/policies/[slug]`.
  - Bổ sung style `.policy-page`, `.policy-tabs`, `.policy-tab`, `.policy-card`, `.policy-section`, `.policy-actions` trong `src/styles/site.css`.
- **Kiểm tra** –
  - `npm run typecheck`: Đạt (0 lỗi).
  - `npm run lint`: Đạt (0 lỗi, 0 cảnh báo).
  - `npm test`: Đạt (13/13 Vitest).

## 25/11/2026 · Lưới 3 cột × 4 hàng & Phân trang số cho Tất cả dự án (`case-studies`)
- **Yêu cầu** – Trang Tất cả dự án (`/vi/case-studies`) hiển thị dạng 4 hàng 3 cột (12 dự án mỗi trang) và có phân trang chuyển qua trang 2, 3, 4.
- **Thực hiện** –
  - Thêm `columns?: 2 | 3` cho `ProjectGrid` trong `src/components/site.tsx`; trang `case-studies` truyền `columns={3}` (giữ `limit = 12` trong `getProjectPage` tương ứng 4 hàng × 3 cột) và tắt `work-card-wide` khi ở chế độ 3 cột.
  - Thêm `.work-grid-3` trong `src/styles/site.css` (desktop 3 cột, tablet `<= 1020px` 2 cột, mobile `<= 760px` 1 cột).
  - Nâng cấp `CatalogPagination` trong `src/app/(frontend)/[locale]/case-studies/page.tsx` hiển thị danh sách số trang (`1`, `2`, `3`, `4`...) dạng nút tròn `.catalog-page-btn` bên cạnh nút Trước/Sau.
- **Kiểm tra** –
  - `npm run typecheck`: Đạt (0 lỗi).
  - `npm run lint`: Đạt (0 lỗi, 0 cảnh báo).
  - `npm test`: Đạt (13/13 Vitest).

## 25/11/2026 · Hero Slideshow 3 ảnh với hiệu ứng Grow & Crossfade
- **Yêu cầu** – Dùng 3 ảnh chỉ định (`NNT00154.jpg`, `NNT00216.jpg`, `HaiPhongphoto-10.jpg`) làm slide ở Hero với hiệu ứng grow và chuyển cảnh mượt.
- **Thực hiện** –
  - Chuyển đổi 3 ảnh gốc sang WebP tối ưu (`public/portfolio/hero-slide-1.webp`, `hero-slide-2.webp`, `hero-slide-3.webp`) bằng `sharp` mà không thay đổi thư mục ảnh gốc.
  - Cập nhật `HeroMedia` trong `src/components/interactive.tsx` để chạy slideshow tự động mỗi 5,5 giây (tôn trọng `prefers-reduced-motion`) và hỗ trợ chọn trực tiếp qua các chấm chỉ báo `.hero-slide-dots`.
  - Thêm hiệu ứng crossfade (`opacity` 1.35s) và animation `@keyframes hero-slide-grow` (`scale(1)` → `scale(1.08)`) trong `src/styles/site.css`.
- **Kiểm tra** –
  - `npm run typecheck`: Đạt (0 lỗi).
  - `npm run lint`: Đạt (0 lỗi, 0 cảnh báo).
  - `npm test`: Đạt (13/13 Vitest).

## 25/11/2026 · Carousel Dịch vụ chuyển động, thu nhỏ tiêu đề & căn đều chiều cao hàng
- **Yêu cầu** – Phần Dịch vụ nhiếp ảnh chuyển sang carousel tự động chuyển động, tiêu đề thẻ nhỏ lại và các thẻ trên hàng bằng nhau.
- **Thực hiện** –
  - Thêm prop `autoPlay` và `loop` cho `Carousel` trong `src/components/interactive.tsx` (tự động trượt mỗi 3,8 giây, tạm dừng khi hover/focus, tôn trọng `prefers-reduced-motion`) và bật `autoPlay` cho phần Dịch vụ trong `src/components/site.tsx`.
  - Cập nhật CSS trong `src/styles/site.css`: đặt `align-items: stretch` cho `.carousel-track`, `display: flex; flex-direction: column; height: 100%` cho `.carousel-slide .portfolio-card` và `.card-link`, đẩy `.text-link` xuống đáy bằng `margin-top: auto` để đường viền đáy các thẻ thẳng hàng tuyệt đối; thu nhỏ `.card-copy h3` xuống `clamp(1.3rem, 2.05vw, 1.85rem)`.
- **Kiểm tra** –
  - `npm run typecheck`: Đạt (0 lỗi).
  - `npm run lint`: Đạt (0 lỗi, 0 cảnh báo).
  - `npm test`: Đạt (13/13 Vitest).
